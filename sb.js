import { CONFIG } from '../config.js?v=2025-10-12-39';

if (!window.supabase || typeof window.supabase.createClient !== 'function') {
  throw new Error('supabase-js failed to load. Check /vendor/supabase.js');
}

export const sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storageKey: 'tmgrow-auth'
  },
  global: {
    headers: { 'x-client-info': 'tmgrow-web' }
  }
});

const FRIENDLY = {
  UNAUTHENTICATED: 'Your session expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to do that.',
  ACCOUNT_RESTRICTED: 'Your account is restricted. Contact support.',
  WALLET_NOT_FOUND: 'Wallet not found. Refresh and try again.',
  INSUFFICIENT_BALANCE: 'Insufficient available balance.',
  INSUFFICIENT_FUNDS: 'Insufficient available balance to fund this campaign.',
  TASK_NOT_FOUND: 'This task no longer exists.',
  TASK_UNAVAILABLE: 'This task was just taken by another worker.',
  TASK_NOT_CLAIMED: 'Claim the task before submitting proof.',
  TASK_NOT_SUBMITTABLE: 'This task is no longer open for submission.',
  TASK_EXPIRED: 'Your claim expired. Claim an available task again.',
  NOT_ALLOWED: 'You cannot access this item.',
  CAMPAIGN_NOT_ACTIVE: 'This campaign is not active right now.',
  CAMPAIGN_NOT_FOUND: 'Campaign not found.',
  CAMPAIGN_FULL: 'This campaign has reached its target.',
  CAMPAIGN_COMPLETE: 'This campaign is already complete.',
  INVALID_STATE: 'That action does not fit the current status. Refresh and try again.',
  INVALID_ACTION: 'That action is not available.',
  INVALID_METHOD: 'Choose a valid deposit method.',
  WORKER_MODE_DISABLED: 'Your worker access is disabled. Contact support.',
  CAMPAIGN_BUDGET_EXHAUSTED: 'This campaign has no budget left for another reward.',
  ALREADY_TAKEN_THIS_CAMPAIGN: 'You already completed a task from this campaign.',
  ALREADY_CLAIMED: 'You already claimed a task from this campaign.',
  TRUST_TOO_LOW: 'Your trust score is below this campaign requirement.',
  NOT_ELIGIBLE_COUNTRY: 'This campaign is not open to your country.',
  TOO_MANY_ACTIVE_TASKS: 'Finish or submit your open tasks first (max 25).',
  LINK_ACCOUNT_REQUIRED: 'Link and verify a task account for this platform before claiming this task.',
  ACCOUNT_COOLDOWN: 'This X account is still in its 7-day warm-up. Task access unlocks after the countdown.',
  TOO_MANY_ACTIVE_CAMPAIGNS: 'You already have 10 open campaigns.',
  RATE_LIMIT_PROOF: 'You submitted many proofs in the last hour. Try again later.',
  PROOF_REQUIRED: 'Attach at least one screenshot before submitting.',
  TOO_MANY_FILES: 'A task accepts up to 6 screenshots.',
  INVALID_PROOF_PATH: 'The uploaded file path is invalid. Re-upload the proof.',
  DUPLICATE_PROOF_HASH: 'This exact screenshot was already submitted.',
  BELOW_MIN_WITHDRAWAL: 'Amount is below the minimum withdrawal.',
  INVALID_BEP20_ADDRESS: 'Enter a valid BEP-20 address (0x + 40 hex characters).',
  UNSUPPORTED_NETWORK: 'Only USDT on BNB Smart Chain (BEP-20) payouts are supported right now.',
  TOO_MANY_OPEN_WITHDRAWALS: 'You already have the maximum open withdrawal requests.',
  ALREADY_FINAL: 'This request is already finalised.',
  INVALID_TX_HASH: 'Enter a real transaction hash (0x + 64 hex characters).',
  BELOW_MIN_DEPOSIT: 'Amount is below the minimum deposit.',
  INVALID_TX_HASH_VALUE: 'Enter a valid transaction hash.',
  DUPLICATE_TX_HASH: 'That transaction hash was already submitted.',
  SUBMISSION_NOT_FOUND: 'Submission not found.',
  ALREADY_REVIEWED: 'This submission was already reviewed.',
  ALREADY_LINKED: 'A referrer is already linked to your account.',
  INVALID_CODE: 'That referral code is not valid.',
  BUYER_MODE_DISABLED: 'Open a buyer account first.',
  SERVICE_UNAVAILABLE: 'This service is not available.',
  INVALID_QUANTITY: 'Quantity is outside the allowed range for this service.',
  INVALID_REWARD: 'Reward is outside the allowed range for this service.',
  INVALID_TARGET_URL: 'Target link must start with http:// or https://',
  INVALID_TITLE: 'Title is too short.',
  INVALID_INSTRUCTIONS: 'Instructions are too short.',
  INVALID_AMOUNT: 'Enter a valid amount.',
  INVALID_STATUS: 'Invalid status.',
  CANNOT_MODERATE_SELF: 'You cannot change your own moderation status.',
  LAST_OWNER: 'You are the last owner. Promote another owner first.',
  USER_NOT_FOUND: 'User not found.',
  DEPOSIT_NOT_FOUND: 'Deposit not found.',
  WITHDRAWAL_NOT_FOUND: 'Withdrawal not found.',
  TICKET_NOT_FOUND: 'Ticket not found.',
  FLAG_NOT_FOUND: 'Flag not found.',
  EMPTY_MESSAGE: 'Write a message first.',
  INVALID_SUBJECT: 'Subject is too short.',
  REASON_REQUIRED: 'A reason is required.',
  NO_CHANGE: 'Enter at least one balance change.',
  INVALID_COUNTRY_CODE: 'Country code must be two letters.',
  SERVICE_NOT_FOUND: 'Service not found.',
  INVALID_QUANTITY_RANGE: 'Max quantity must be greater than min quantity.',
  INVALID_REWARD_RANGE: 'Reward range is invalid.',
  INVALID_KEY: 'Setting key is required.',
  INVALID_ROLE: 'Invalid admin role.',
  NOT_PENDING: 'Only pending campaigns can be reviewed.',
  PAYOUT_FIRST: 'Mark the request approved before paying.',
  TELEGRAM_ALREADY_SENT: 'This Telegram message was already delivered.',
  TIMER_NOT_STARTED: 'Open the task window first: the timer starts when you press Start task.',
  TIMER_NOT_FINISHED: 'The task timer has not finished yet. Wait for it to reach zero, then submit your proof.',
  NO_TELEGRAM_LINK: 'Open TM GROW from your Telegram bot once to link this account.',
  NOTIFICATION_NOT_SENT: 'That notification is not in a retryable state.',
  SOCIAL_NOT_FOUND: 'That task account no longer exists.',
  SMM_ORDER_LOCKED: 'You already had a unit rejected on this order, so its remaining units go to other workers.',
  ORDER_NOT_ACTIVE: 'This order is paused or closed right now.',
  TASK_NOT_SUBMITTED: 'This task has no submitted proof to review.',
  WALLET_FROZEN: 'This wallet is frozen. An administrator has paused outgoing transfers; your balance and history are unchanged.',
  INVALID_EXPIRY: 'A temporary suspension needs a future expiry date.',
  INVALID_USERNAME: 'Usernames use 3-24 letters, numbers or underscores.',
  USERNAME_TAKEN: 'That username is already taken. Try another one.',
  USERNAME_RESERVED: 'That username is reserved.',
  ACHIEVEMENT_NOT_FOUND: 'This achievement does not exist.',
  NOT_UNLOCKED: 'Unlock this achievement first.',
  ALREADY_CLAIMED: 'You already claimed this reward.'
};

export function friendlyError(error) {
  if (!error) return 'Something went wrong.';
  const raw = String(error.message || error.error_description || error);

  /* Missing column inside an existing function: this is a migration
     problem, not a missing schema. Say which one instead of blaming setup. */
  if (/column .* does not exist/i.test(raw) || error?.code === '42703') {
    const first = raw.split('\n')[0].replace(/^error:\s*/i, '');
    return `A database column is missing (${first}). Run supabase/fix-suspension-columns.sql and supabase/advanced-management.sql in the SQL editor, then reload.`;
  }

  /* Missing table: name the exact relation instead of a generic setup page. */
  if (/relation .* does not exist/i.test(raw) || error?.code === '42P01') {
    const rel = raw.match(/relation "?([A-Za-z_0-9.]+)"?/i)?.[1]
      || raw.split('\n')[0].replace(/^error:\s*/i, '');
    return `The database table "${rel}" is missing (42P01). Run supabase/schema.sql (and supabase/smm-orders.sql for the SMM system) in the SQL editor, then reload.`;
  }

  /* Missing function or a stale PostgREST schema cache (PGRST202). Name the
     exact function so the fix targets one object, never "the database". */
  if (/PGRST202|Could not find the function|function .* does not exist|schema cache/i.test(raw)) {
    const fn = raw.match(/function\s+(?:public\.)?([A-Za-z_0-9]+)/i)?.[1];
    const which = fn
      ? `The database function "${fn}" is missing or the API schema cache is stale (PGRST202).`
      : 'A required database function is missing or the API schema cache is stale (PGRST202).';
    return `${which} Run supabase/smm-orders-repair.sql in the Supabase SQL editor: it re-deploys the buyer SMM functions additively and idempotently (no data is touched) and reloads the PostgREST schema cache itself. Its verification queries (6a/6b) then show exactly what is deployed. Running only "notify pgrst, 'reload schema';" helps when the functions already exist but the cache is stale.`;
  }

  if (/Invalid login credentials/i.test(raw)) return 'Wrong email or password.';
  if (/Email not confirmed/i.test(raw)) return 'Confirm your email first, or use Google sign-in.';
  if (/User already registered/i.test(raw)) return 'That email is already registered. Sign in instead.';
  if (/Password should be at least/i.test(raw)) return 'Password must be at least 6 characters.';
  if (/provider is not enabled|Unsupported provider/i.test(raw)) {
    return 'This sign-in provider is not enabled in Supabase Auth yet. Enable it in Authentication > Providers, or use another method.';
  }
  if (/redirect.*not allowed|redirect_uri/i.test(raw)) {
    return 'This URL is not allowed in Supabase Auth redirect settings. Add it under Authentication > URL Configuration.';
  }
  if (/Failed to fetch|NetworkError/i.test(raw)) return 'Network error. Check your connection and retry.';
  if (/rate limit|too many requests/i.test(raw)) return 'Too many attempts. Wait a moment and try again.';
  const code = raw.trim().split('\n')[0].replace(/^error:\s*/i, '');

  /* The server sends the authoritative minimum and the amount it received,
     e.g. "BELOW_MIN_DEPOSIT: min=5 amount=0.4". Show both: that is the only
     way to see whether the browser sent the wrong amount. */
  const minDeposit = raw.match(/BELOW_MIN_DEPOSIT\s*:?\s*(?:min=)?([0-9]+(?:\.[0-9]+)?)(?:\s+amount=([0-9]+(?:\.[0-9]+)?))?/i);
  if (minDeposit) {
    const got = minDeposit[2];
    return got
      ? `The deposit amount read (${got} USDT) is below the minimum of ${minDeposit[1]} USDT.`
      : `Amount is below the minimum deposit of ${minDeposit[1]} USDT.`;
  }
  if (/INVALID_AMOUNT/i.test(raw)) return 'Enter a deposit amount greater than zero.';

  if (FRIENDLY[code]) return FRIENDLY[code];
  const fromMap = Object.keys(FRIENDLY).find((k) => code.startsWith(k));
  if (fromMap) return FRIENDLY[fromMap];
  return code.length > 220 ? code.slice(0, 220) + '…' : code;
}

export async function rpc(name, params = {}) {
  const { data, error } = await sb.rpc(name, params);
  if (error) {
    const wrapped = new Error(friendlyError(error));
    wrapped.code = error.code;
    wrapped.raw = error;
    throw wrapped;
  }
  return data;
}
