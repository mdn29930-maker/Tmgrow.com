/* Telegram Mini App helpers.
   The SDK (https://telegram.org/js/telegram-web-app.js) is loaded in index.html.
   Signing in never trusts initDataUnsafe: only the raw initData string is sent
   to the telegram-auth Edge Function, which verifies Telegram's HMAC signature
   with the bot token and returns a one-time token hash. */

import { CONFIG } from '../config.js?v=2025-10-12-39';

function app() {
  return (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) || null;
}

export function telegramApp() {
  return app();
}

export function isTelegramMiniApp() {
  const tg = app();
  return !!tg && typeof tg.initData === 'string' && tg.initData.length > 0;
}

/* True when the page is opened inside a Telegram client, even if initData is
   missing (older client or a non-bot launch). Used only to explain the failure;
   it is never accepted as proof of identity. */
export function isTelegramEnvironment() {
  const tg = app();
  if (!tg) return false;
  const platform = String(tg.platform || 'unknown');
  return platform !== 'unknown' || !!tg.initDataUnsafe?.user;
}

export function telegramUser() {
  const tg = app();
  const user = tg?.initDataUnsafe?.user;
  return user && typeof user.id === 'number' ? user : null;
}

export function telegramInitData() {
  const tg = app();
  return typeof tg?.initData === 'string' ? tg.initData : '';
}

export function telegramAuthUrl() {
  return CONFIG.telegramAuthUrl
    || `${CONFIG.supabaseUrl}/functions/v1/${CONFIG.telegramAuthFunction || 'Telegram-auth-'}`;
}

/* Expand the mini app to full height and match the shell colours. Safe to
   call outside Telegram (it simply does nothing). */
export function prepareTelegram() {
  const tg = app();
  if (!tg) return null;
  try {
    if (typeof tg.ready === 'function') tg.ready();
    if (typeof tg.expand === 'function') tg.expand();
    if (typeof tg.disableVerticalSwipes === 'function') tg.disableVerticalSwipes();
    if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor('#050505');
    if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor('#050505');
  } catch (_) { /* older Telegram clients */ }
  return telegramUser();
}

export async function signInWithTelegram(sb) {
  /* Only the raw, server-signed string is used. initDataUnsafe is display-only
     and is never sent as proof. */
  const initData = telegramInitData();
  if (!initData) {
    const err = new Error(isTelegramEnvironment()
      ? 'Telegram opened TM GROW without initData. Close the mini app and reopen it from the bot’s menu button.'
      : 'Open TM GROW from inside Telegram to use Telegram sign-in.');
    err.code = 'EMPTY_INIT_DATA';
    throw err;
  }

  const url = telegramAuthUrl();
  /* Safe log: length only, never the initData value (it is a signed credential). */
  console.log('[telegram-auth] initData length', initData.length, '→ POST', url);

  /* Primary: JSON POST with the publishable key in the `apikey` header.
     Custom headers trigger a CORS preflight; if that preflight is rejected by
     the gateway/function the browser only reports a fetch TypeError, which is
     our "Could not reach" message. The fallback sends the identical JSON body
     as text/plain with the key in the query string — a CORS "simple" request
     with no preflight — and the function still parses it with req.json(). */
  let res;
  try {
    console.info('[telegram-auth] POST', url);
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: CONFIG.supabaseKey
      },
      body: JSON.stringify({ initData })
    });
  } catch (e) {
    const fallbackUrl = `${url}?apikey=${encodeURIComponent(CONFIG.supabaseKey)}`;
    console.warn('[telegram-auth] preflight/network failed; retrying as simple request:', fallbackUrl, e && e.message);
    try {
      res = await fetch(fallbackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({ initData })
      });
    } catch (e2) {
      console.error('[telegram-auth] both attempts failed', url, e2 && e2.message);
      const err = new Error(
        `Could not reach ${url} (network or CORS). URL used: ${url}`
      );
      err.code = 'NETWORK';
      err.status = 0;
      throw err;
    }
  }

  let payload = {};
  let raw = '';
  try {
    raw = await res.text();
    payload = raw ? JSON.parse(raw) : {};
  } catch (_) {
    payload = {};
  }

  if (!res.ok) {
    const step = payload.step ? ` [${payload.step}]` : '';
    const body = raw ? raw.slice(0, 400) : '(empty body)';
    const serverError = payload.error || payload.message || body;
    const base = res.status === 404
      ? `The Telegram-auth- function is not deployed at ${url}. Response: ${body}`
      : res.status === 401
        ? `Telegram-auth- rejected the sign-in (HTTP 401). Server said: ${serverError}. ` +
          'If it mentions BAD_SIGNATURE, the TELEGRAM_BOT_TOKEN secret belongs to a different bot than the one opening this Mini App.'
        : `Telegram sign-in failed (HTTP ${res.status}). Response: ${body}`;
    const err = new Error(`${base}${step}`);
    err.code = 'TELEGRAM_AUTH';
    err.status = res.status;
    err.body = raw;
    err.serverError = serverError;
    err.step = payload.step || null;
    throw err;
  }

  if (!payload.token_hash) {
    const err = new Error(payload.error || 'The telegram-auth function returned no session token.');
    err.code = 'TELEGRAM_AUTH';
    err.status = res.status;
    err.step = payload.step || null;
    throw err;
  }

  const { error } = await sb.auth.verifyOtp({ token_hash: payload.token_hash, type: 'magiclink' });
  if (error) {
    const err = new Error(error.message || 'Telegram session could not be created.');
    err.code = 'VERIFY_FAILED';
    throw err;
  }

  return payload.user || null;
}

/* Plain-language version of the failures the function and Telegram return, so
   the sign-in screen says what is actually wrong. */
export function telegramFriendlyError(error) {
  const raw = String(error?.message || error || '');
  if (error?.code === 'EMPTY_INIT_DATA' || error?.code === 'NETWORK') return raw;
  if (/TELEGRAM_BOT_TOKEN/i.test(raw)) {
    return 'Telegram sign-in is not configured yet: set TELEGRAM_BOT_TOKEN and deploy the telegram-auth function.';
  }
  if (error?.status === 404 || /not found|NOT_FOUND|Failed to send a request/i.test(raw)) {
    return `The ${CONFIG.telegramAuthFunction || 'Telegram-auth-'} function is not deployed at ${telegramAuthUrl()}.`;
  }
  if (/BAD_SIGNATURE|EXPIRED|MISSING_INIT_DATA|INVALID_USER|MISSING_HASH|AUTH_DATE_IN_FUTURE/i.test(raw)) {
    /* Show the server's real diagnostic text (token format, bot username,
       received fields) instead of a generic session error. */
    return raw;
  }
  if (/ALREADY|VALIDATION|PROFILE_FAILED|CREATE_USER_FAILED|LINK_FAILED/i.test(raw)) {
    return `Telegram sign-in stopped at the database step: ${raw}`;
  }
  return raw || 'Telegram sign-in failed.';
}


/* ---------------------------------------------------------------------------
   TEMPORARY DIAGNOSTIC — remove with the button in src/views/auth.js.
   Probes the exact configured URL with GET, a JSON POST and a preflight-free
   POST, and returns everything the browser actually saw.
   --------------------------------------------------------------------------- */
async function probe(method, url, { body, contentType, withKey = false, label = '' } = {}) {
  const started = Date.now();
  const entry = { method, url, label, status: 0, ok: false, body: '', error: null, ms: 0 };
  const headers = {};
  if (contentType) headers['Content-Type'] = contentType;
  if (withKey) headers.apikey = CONFIG.supabaseKey;

  try {
    console.log(`[telegram-diag] ${label || method} ${method} ${url}`, headers);
    const res = await fetch(url, {
      method,
      cache: 'no-store',
      headers,
      body
    });
    entry.status = res.status;
    entry.statusText = res.statusText || '';
    entry.type = res.type || '';
    try { entry.body = await res.text(); } catch (_) { entry.body = ''; }
    entry.ok = res.ok;
  } catch (e) {
    entry.error = { name: (e && e.name) || 'Error', message: (e && e.message) || String(e) };
    console.error('[telegram-diag] failed', entry.error);
  }
  entry.ms = Date.now() - started;
  return entry;
}

export async function diagnoseTelegramAuth() {
  const url = telegramAuthUrl();
  const result = {
    configuredUrl: CONFIG.telegramAuthUrl || '(missing)',
    builtUrl: url,
    pageHost: location.host,
    get: null,
    getWithKey: null,
    post: null,
    fallback: null
  };

  /* The configured value is logged verbatim, untruncated, before any request. */
  console.log('[telegram-diag] CONFIG.telegramAuthUrl =', result.configuredUrl);
  console.log('[telegram-diag] telegramAuthUrl() =', result.builtUrl);
  console.log('[telegram-diag] page host =', result.pageHost);

  result.get = await probe('GET', url, { label: '1. GET without apikey' });
  result.getWithKey = await probe('GET', url, { withKey: true, label: '2. GET with apikey header' });
  result.post = await probe('POST', url, {
    body: JSON.stringify({ initData: 'diagnostic_test' }),
    contentType: 'application/json',
    withKey: true,
    label: '3. POST JSON + apikey (login path)'
  });

  const fallbackUrl = `${url}?apikey=${encodeURIComponent(CONFIG.supabaseKey)}`;
  result.fallback = await probe('POST', fallbackUrl, {
    body: JSON.stringify({ initData: 'diagnostic_test' }),
    contentType: 'text/plain;charset=UTF-8',
    label: '4. POST without preflight'
  });

  console.table([result.get, result.getWithKey, result.post, result.fallback].map((r) => ({
    step: r.label,
    method: r.method,
    status: r.status,
    ms: r.ms,
    error: r.error ? `${r.error.name}: ${r.error.message}` : '',
    body: r.body.slice(0, 80)
  })));

  return result;
}
