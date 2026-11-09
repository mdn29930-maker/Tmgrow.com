import { sb, rpc, friendlyError } from './sb.js?v=2025-10-12-39';

export const ADMIN_ROLES = ['OWNER', 'SUPER_ADMIN', 'ADMIN', 'MODERATOR', 'VERIFIER', 'SUPPORT', 'FINANCE'];

export const state = {
  session: null,
  profile: null,
  wallet: null,
  counts: {},
  referral: null,
  buyer: null,
  isAdmin: false,
  identity: null,
  settings: {},
  publicStats: null,
  featureStatus: null,
  smmCounts: null,
  adminPermissions: [],
  telegramError: null,
  loaded: false,
  loadError: null
};

export function isSignedIn() {
  return !!state.session;
}

export function isAdmin() {
  return !!state.isAdmin;
}

/* The database is the authority: a profile whose status is not 'active' is
   suspended and every write RPC refuses it. This only drives the UI. */
export function isSuspended() {
  const status = state.profile?.status;
  return !!status && status !== 'active';
}

export function walletFrozen() {
  return state.wallet?.frozen === true;
}

/* Which dashboard the account is looking at. Stored in profiles.prefs.mode and
   enforced per capability by the server (is_worker / is_buyer). */
export function currentMode() {
  const p = state.profile;
  if (!p) return 'worker';
  if (p.prefs?.mode === 'buyer' && p.is_buyer) return 'buyer';
  if (p.prefs?.mode === 'worker' && p.is_worker) return 'worker';
  /* No explicit preference yet: a worker keeps the worker workspace even when
     the account also has buyer rights. Only an explicit switch (or an account
     with no worker permission) opens buyer mode. */
  if (p.is_worker) return 'worker';
  if (p.is_buyer) return 'buyer';
  return 'worker';
}

/* True only when the account really holds both capabilities. */
export function canSwitchMode() {
  const p = state.profile;
  return !!(p && p.is_worker && p.is_buyer);
}

export async function switchMode(mode) {
  await rpc('set_my_mode', { p_mode: mode });
  state.profile = {
    ...(state.profile || {}),
    prefs: { ...(state.profile?.prefs || {}), mode }
  };
  return mode;
}

export function adminIn(roles) {
  return !!state.profile?.admin_role && roles.includes(state.profile.admin_role);
}

/* True only when the database granted this permission to the signed-in admin. */
export function hasPerm(permission) {
  return Array.isArray(state.adminPermissions) && state.adminPermissions.includes(permission);
}

export function displayName(profile = state.profile) {
  if (!profile) return 'Worker';
  const uname = (profile.username || '').trim();
  if (uname) return uname;
  return (profile.full_name || '').trim() || (profile.email || 'worker').split('@')[0];
}

export function firstName(profile = state.profile) {
  return displayName(profile).split(/\s+/)[0].slice(0, 24);
}

export async function loadSession() {
  const { data } = await sb.auth.getSession();
  state.session = data.session || null;
  return state.session;
}

export async function loadContext() {
  if (!state.session) return null;
  state.loadError = null;
  try {
    const ctx = await rpc('my_context');
    state.profile = ctx.profile;
    state.wallet = ctx.wallet;
    state.counts = ctx.counts || {};
    state.referral = ctx.referral || {};
    state.buyer = ctx.buyer || {};
    /* The database decides: is_admin comes from the RPC. The profile fields are
       a consistency fallback for an older my_context definition, not a
       permission source — every admin RPC re-checks the role server-side. */
    state.isAdmin = !!ctx.is_admin
      || (!!ctx.profile?.admin_role && ctx.profile?.status === 'active');
    if (state.profile?.is_buyer) {
      try { state.smmCounts = await rpc('smm_platform_counts'); }
      catch (_) { state.smmCounts = null; }
    }
    /* RBAC permissions come from the database, never from localStorage. */
    if (state.profile?.admin_role) {
      try {
        const perms = await rpc('my_permissions');
        state.adminPermissions = perms?.permissions || [];
      } catch (_) { state.adminPermissions = []; }
    } else {
      state.adminPermissions = [];
    }
    state.loaded = true;
    return ctx;
  } catch (err) {
    state.loadError = friendlyError(err);
    state.loaded = false;
    throw err;
  }
}

export async function loadPublicData() {
  const settings = await rpc('get_public_settings').catch(() => ({}));
  state.settings = settings || {};
  /* v2 adds total registered users; the original public_stats() stays the
     fallback so an un-migrated database still renders the landing page. */
  let stats = null;
  try { stats = await rpc('public_stats_v2'); }
  catch (_) {
    try { stats = await rpc('public_stats'); }
    catch (__) { stats = null; }
  }
  state.publicStats = stats || null;
}

/* Real status of every admin module, computed by admin_feature_status().
   A missing RPC (migration not run yet) simply leaves the panel without
   status badges — it never blocks the app and never invents a state. */
export async function loadFeatureStatus() {
  if (!state.session || !state.isAdmin) {
    state.featureStatus = null;
    return null;
  }
  try {
    state.featureStatus = await rpc('admin_feature_status');
  } catch (err) {
    state.featureStatus = null;
    state.featureStatusError = friendlyError(err);
  }
  return state.featureStatus;
}

export function settingNumber(key, fallback) {
  const v = state.settings?.[key];
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function settingText(key, fallback = '') {
  const v = state.settings?.[key];
  return typeof v === 'string' ? v : fallback;
}

export function withdrawalMin() {
  const v = Number(state.settings?.withdrawal_min);
  return Number.isFinite(v) && v > 0 ? v : 2;
}

export function campaignFeePct() {
  const v = Number(state.settings?.campaign_fee_pct);
  return Number.isFinite(v) && v >= 0 ? v : 10;
}

export function resetState() {
  state.session = null;
  state.profile = null;
  state.wallet = null;
  state.counts = {};
  state.referral = null;
  state.buyer = null;
  state.isAdmin = false;
  state.telegramError = null;
  state.featureStatus = null;
  state.featureStatusError = null;
  state.adminPermissions = [];
  state.loaded = false;
  state.loadError = null;
}

/* Referral capture: ?ref=CODE survives the Google OAuth round trip. */
const REF_KEY = 'tmgrow-ref';
const PENDING_HASH = 'tmgrow-pending-hash';

export function captureRefFromUrl() {
  try {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref') || params.get('startapp');
    if (ref) localStorage.setItem(REF_KEY, ref.trim());
  } catch (_) { /* ignore */ }
}

export function pendingRef() {
  try { return localStorage.getItem(REF_KEY); } catch (_) { return null; }
}

export function clearPendingRef() {
  try { localStorage.removeItem(REF_KEY); } catch (_) { /* ignore */ }
}

export function rememberHash(hash) {
  try { sessionStorage.setItem(PENDING_HASH, hash || ''); } catch (_) { /* ignore */ }
}

export function takeRememberedHash() {
  try {
    const v = sessionStorage.getItem(PENDING_HASH) || '';
    sessionStorage.removeItem(PENDING_HASH);
    return v;
  } catch (_) { return ''; }
}

export async function applyPendingReferral() {
  const code = pendingRef();
  if (!code) return null;
  try {
    const res = await rpc('apply_referral', { p_code: code });
    if (res?.ok) clearPendingRef();
    return res;
  } catch (_) {
    clearPendingRef();
    return null;
  }
}


/* Username picked at registration while the email is still unconfirmed:
   applied to the profile at the first sign-in, then cleared. */
const PENDING_USERNAME = 'tmgrow-pending-username';

export function pendingUsername() {
  try { return localStorage.getItem(PENDING_USERNAME) || ''; }
  catch (_) { return ''; }
}

export function clearPendingUsername() {
  try { localStorage.removeItem(PENDING_USERNAME); } catch (_) { /* ignore */ }
}

export async function applyPendingUsername() {
  if (!state.session) return false;
  const uname = pendingUsername();
  if (!uname) return false;
  try {
    await rpc('set_my_username', { p_username: uname });
    clearPendingUsername();
    return true;
  } catch (_) {
    clearPendingUsername();
    return false;
  }
}