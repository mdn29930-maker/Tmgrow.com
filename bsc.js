/* Live BNB Smart Chain (BEP-20) verification for USDT deposits.
   Reads a transaction receipt from a public BSC node and checks that it is a
   successful USDT transfer to the platform deposit address. No key, no server. */

import { CONFIG } from '../config.js?v=2025-10-12-39';

const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef';
const RPC_TIMEOUT = 12000;

let rpcIndex = 0;
let requestId = 1;

function fail(message, steps = []) {
  const err = new Error(message);
  err.steps = steps;
  return err;
}

async function call(method, params) {
  let last = null;
  for (let attempt = 0; attempt < CONFIG.bscRpcs.length; attempt += 1) {
    const url = CONFIG.bscRpcs[(rpcIndex + attempt) % CONFIG.bscRpcs.length];
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), RPC_TIMEOUT);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: requestId++, method, params }),
        signal: controller.signal
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`node answered ${res.status}`);
      const json = await res.json();
      if (json.error) throw new Error(json.error.message || 'node error');
      rpcIndex = (rpcIndex + attempt) % CONFIG.bscRpcs.length;
      return json.result;
    } catch (e) {
      clearTimeout(timer);
      last = e;
    }
  }
  throw fail(`Could not reach a BNB Smart Chain node (${last?.message || 'network error'}). Check your connection and try again.`);
}

function hexToNumber(hex) {
  if (!hex) return 0;
  return Number(BigInt(hex));
}

function units18(hex) {
  try {
    const raw = BigInt(hex);
    const whole = raw / 1000000000000000000n;
    const frac = (raw % 1000000000000000000n).toString().padStart(18, '0').replace(/0+$/, '');
    return Number(`${whole.toString()}${frac ? '.' + frac : ''}`);
  } catch (_) { return 0; }
}

function topicAddress(topic) {
  const hex = String(topic || '');
  if (hex.length < 42) return '';
  return `0x${hex.slice(-40)}`.toLowerCase();
}

export async function verifyUsdtDeposit(txHash, opts = {}) {
  const hash = String(txHash || '').trim().toLowerCase();
  if (!/^0x[0-9a-f]{64}$/.test(hash)) {
    throw fail('Transaction hash must be 0x followed by 64 hex characters.');
  }

  const address = String(opts.address || CONFIG.depositAddress).trim().toLowerCase();
  const minConfirmations = Number(opts.minConfirmations ?? CONFIG.depositConfirmations);
  const steps = [];

  const receipt = await call('eth_getTransactionReceipt', [hash]);
  if (!receipt) {
    throw fail('That transaction was not found on BNB Smart Chain yet. If you just sent it, wait a minute and try again.');
  }

  const block = hexToNumber(receipt.blockNumber);
  const success = receipt.status === '0x1';
  steps.push({ ok: success, label: success ? 'Transaction confirmed on-chain' : 'Transaction failed on-chain', detail: `Block ${block.toLocaleString('en-US')}` });
  if (!success) {
    throw fail('This transaction failed on BNB Smart Chain, so no USDT was transferred. Nothing can be credited.', steps);
  }

  const latest = hexToNumber(await call('eth_blockNumber', []));
  const confirmations = Math.max(0, latest - block + 1);
  steps.push({
    ok: confirmations >= minConfirmations,
    label: `${confirmations} confirmation${confirmations === 1 ? '' : 's'}`,
    detail: `Needs ${minConfirmations}`
  });

  const logs = (receipt.logs || []).filter((l) => (
    String(l.address || '').toLowerCase() === CONFIG.usdtContract.toLowerCase()
    && String((l.topics || [])[0] || '').toLowerCase() === TRANSFER_TOPIC
  ));
  steps.push({ ok: logs.length > 0, label: 'USDT transfer event', detail: logs.length ? `${logs.length} transfer(s) in this transaction` : 'No USDT transfer found' });

  /* A transaction can contain several USDT transfers (exchange batch payouts,
     aggregators). Take the largest transfer to our address, never the first
     one: taking the first could read a dust transfer and fail the minimum. */
  const matches = [];
  for (const log of logs) {
    const to = topicAddress((log.topics || [])[2]);
    if (to !== address) continue;
    const amount = units18(log.data);
    if (amount > 0) {
      matches.push({ from: topicAddress((log.topics || [])[1]), to, amount });
    }
  }
  matches.sort((a, b) => b.amount - a.amount);
  const match = matches[0] || null;

  if (!match) {
    steps.push({ ok: false, label: 'Recipient address', detail: 'No USDT transfer to the platform deposit address in this transaction' });
    throw fail('This transaction did not send USDT to the TM GROW deposit address.', steps);
  }

  steps.push({ ok: true, label: 'Recipient matches', detail: `${address.slice(0, 8)}…${address.slice(-6)}` });
  steps.push({ ok: true, label: 'Amount read from chain', detail: `${match.amount} USDT${matches.length > 1 ? ` (largest of ${matches.length} transfers to this address)` : ''}` });

  return {
    txHash: hash,
    from: match.from,
    to: match.to,
    amount: match.amount,
    matchedTransfers: matches.length,
    block,
    confirmations,
    enoughConfirmations: confirmations >= minConfirmations,
    steps
  };
}
