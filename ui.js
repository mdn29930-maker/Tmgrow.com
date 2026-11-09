import { CONFIG } from '../config.js?v=2025-10-12-39';
import { sb } from './sb.js?v=2025-10-12-39';

const STROKE_ICONS = {
  home: '<path d="M3 10.8 12 3l9 7.8"/><path d="M5.5 9.5V21h13V9.5"/><path d="M9.5 21v-6h5v6"/>',
  tasks: '<path d="M9 6h12M9 12h12M9 18h12"/><path d="m3 6 1.6 1.6L7.2 5M3 12l1.6 1.6L7.2 11M3 18l1.6 1.6L7.2 17"/>',
  wallet: '<rect x="2.5" y="5.5" width="19" height="14" rx="3"/><path d="M2.5 9.5h19"/><path d="M16.5 14h2.5"/>',
  trophy: '<path d="M8 21h8M12 17v4"/><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5v1A3.5 3.5 0 0 0 8 10.5M17 6h2.5v1A3.5 3.5 0 0 1 16 10.5"/>',
  users: '<circle cx="9" cy="8" r="3.2"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16.5 5.4a3 3 0 0 1 0 5.6M18.5 14.4a6 6 0 0 1 3 5.1"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
  bell: '<path d="M18 8.5a6 6 0 0 0-12 0c0 7-2.5 8.5-2.5 8.5h17S18 15.5 18 8.5"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  settings: '<circle cx="12" cy="12" r="3.1"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5.2l3.4 2"/>',
  arrowRight: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  arrowLeft: '<path d="M20 12H4M10 18l-6-6 6-6"/>',
  arrowUpRight: '<path d="M7 17 17 7M8 7h9v9"/>',
  arrowDownLeft: '<path d="M17 7 7 17M16 17H7V8"/>',
  upload: '<path d="M12 16V4M7 9l5-5 5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/>',
  shield: '<path d="M12 2.8 4.5 6v5.6c0 4.6 3.2 8.1 7.5 9.6 4.3-1.5 7.5-5 7.5-9.6V6z"/><path d="m9 11.7 2.1 2.1 4.2-4.3"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  megaphone: '<path d="M3 11v3l12 5V6z"/><path d="M15 9h3a3 3 0 0 1 0 6h-3"/><path d="M7 15v4a2 2 0 0 0 4 0v-2"/>',
  ticket: '<path d="M3 8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v2M13 11v2M13 16v2"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/>',
  flag: '<path d="M5 21V4"/><path d="M5 5h11l-1.5 3.5L16 12H5"/>',
  sparkles: '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M18.5 15.5 19.4 18l2.6.9-2.6.9-.9 2.6-.9-2.6-2.6-.9 2.6-.9z"/>',
  chevronDown: '<path d="m6 9 6 6 6-6"/>',
  chevronRight: '<path d="m9 5 7 7-7 7"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
  external: '<path d="M14 4h6v6M20 4 10 14"/><path d="M18 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4"/>',
  mail: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  alert: '<path d="M10.3 4.1 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 4.1a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  trash: '<path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="M12 20H4a1 1 0 0 1-1-1v-8"/><path d="m16.5 3.5 4 4L9 19l-5 1 1-5z"/>',
  play: '<path d="M8 5.5v13l11-6.5z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>',
  gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M12 8v13"/><path d="M12 8S10.5 3 8 3a2.5 2.5 0 0 0 0 5M12 8s1.5-5 4-5a2.5 2.5 0 0 1 0 5"/>',
  zap: '<path d="M13 2 4.5 13.2c-.4.5 0 1.3.6 1.3H10l-1.4 7.1c-.1.7.8 1.1 1.3.5L19.5 10.8c.4-.5 0-1.3-.6-1.3H14l1.3-6.9c.1-.7-.8-1.1-1.3-.6z"/>',
  coin: '<circle cx="12" cy="12" r="9"/><path d="M9.5 8h5M12 8v8M9.8 16h4.7"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  filter: '<path d="M3 5h18l-7 8v5l-4 2v-7z"/>',
  send: '<path d="M21.5 3 2.8 10.4l6.6 2.3 2.2 6.5z"/><path d="M9.4 12.7 21.5 3"/>',
  checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.7 2.7L16.5 9"/>',
  xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  pause: '<rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/>',
  stop: '<rect x="6" y="6" width="12" height="12" rx="2"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m3 17 5-4.5 4 3.5 3-2.5 6 5"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 9.5h19M6 15h4"/>',
  trending: '<path d="m3 17 6-6 4 4 7-8"/><path d="M14 7h6v6"/>',
  star: '<path d="m12 3 2.7 5.7 6.3.9-4.6 4.4 1.1 6.2L12 17.3 6.5 20.2l1.1-6.2L3 9.6l6.3-.9z"/>',
  grid: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
  key: '<circle cx="8" cy="8" r="4.5"/><path d="m11.2 11.2 8.3 8.3M17 15l-2 2M19 17l-2 2"/>',
  database: '<ellipse cx="12" cy="5.5" rx="8" ry="3"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  book: '<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z"/><path d="M4 17.5h16"/>',
  sliders: '<path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5"/><path d="M4 20h16"/>',
  dot: '<circle cx="12" cy="12" r="2"/>',
  target: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.4"/><path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.2 5.2l1.9 1.9M16.9 16.9l1.9 1.9M18.8 5.2l-1.9 1.9M7.1 16.9l-1.9 1.9"/>',
  moon: '<path d="M20.5 14.6A8.6 8.6 0 1 1 9.4 3.5a6.9 6.9 0 0 0 11.1 11.1z"/>',
  flame: '<path d="M12 2.8c2.9 3.1 5.2 5.4 5.2 8.8A5.2 5.2 0 0 1 6.8 11.6c0-2.2 1.2-4 2.9-5.8.5 1.7 1.4 2.8 2.4 3.6.4-2-.1-4.3-.1-6.6z"/><path d="M12 21.5a3.1 3.1 0 0 0 3.1-3.1c0-1.6-1-2.6-2-3.6-.4 1-1 1.6-1.7 2.1-.5.9-.9 1.6-.9 2.5A1.5 1.5 0 0 0 12 21.5z" fill="currentColor" stroke="none"/>'
};

const FILLED = new Set(['x', 'youtube', 'facebook', 'telegram', 'tiktok', 'discord']);
const BRAND_PATHS = {
  x: '<path d="M18.9 2H22l-7.6 8.7L23.3 22H16l-5.7-7.4L3.8 22H.7l8.2-9.3L.4 2H8l5.1 6.8L18.9 2Zm-1.1 18h1.7L7.3 3.8H5.5L17.8 20Z"/>',
  youtube: '<path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12Zm-13 3.5v-7l6 3.5-6 3.5Z"/>',
  facebook: '<path d="M14 9h3V5h-3c-2.8 0-5 2.2-5 5v3H6v4h3v7h4v-7h3l1-4h-4v-3c0-.6.4-1 1-1z"/>',
  telegram: '<path d="M21.9 4.3 18.6 20c-.2 1.1-.9 1.4-1.9.9l-5.1-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.2 9.5-8.6c.4-.4-.1-.6-.6-.2L5.1 13.3l-5-1.6c-1.1-.3-1.1-1 .2-1.5l19.4-7.5c.9-.3 1.7.2 1.4 1.6Z"/>',
  tiktok: '<path d="M16.5 3c.4 2.6 1.9 4.2 4.5 4.4v3.2c-1.6.1-3-.4-4.4-1.3v6.2c0 3.4-2.6 5.5-5.6 5.5-3.2 0-5.5-2.3-5.5-5.3 0-3.2 2.6-5.4 5.9-5.1v3.3c-.3-.1-.6-.1-.9-.1-1.3 0-2.2.9-2.2 2.1 0 1.3.9 2.1 2.2 2.1 1.4 0 2.3-.9 2.3-2.4V3h2.8z"/>',
  discord: '<path d="M19.3 5.6A15.6 15.6 0 0 0 15.4 4l-.4.9c-1.3-.2-2.7-.2-4 0L10.6 4a15.7 15.7 0 0 0-3.9 1.6C4.2 9.8 3.5 13.8 3.9 17.7a15.8 15.8 0 0 0 4.8 2.4l1-1.6c-.6-.2-1.1-.5-1.6-.8l.4-.3a11.2 11.2 0 0 0 9.4 0l.4.3c-.5.3-1 .6-1.6.8l1 1.6a15.8 15.8 0 0 0 4.8-2.4c.5-4.5-.7-8.4-2.3-12.1zM9.7 15.1c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm4.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z"/>',
  reddit: '<circle cx="12" cy="14" r="7.2"/><path d="M12 6.8 13.4 3l3 .7"/><circle cx="17" cy="4" r="1.3"/><circle cx="9.2" cy="13.4" r="1.1"/><circle cx="14.8" cy="13.1" r="1.1"/><path d="M9 16.6c1.7 1.2 4.2 1.2 6 0"/>',
  spotify: '<circle cx="12" cy="12" r="9"/><path d="M7 9.5c3.4-1 7-.6 10 1M7.6 12.6c2.8-.9 5.8-.5 8.3 1M8.2 15.6c2.2-.7 4.6-.4 6.6.8"/>',
  website: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18"/>'
};

const PLATFORM_META = {
  youtube: { label: 'YouTube', color: '#ffffff', bg: 'linear-gradient(140deg,#ff4b3a,#c4302b)', icon: 'youtube' },
  instagram: { label: 'Instagram', color: '#ffffff', bg: 'linear-gradient(140deg,#f9ce34,#ee2a7b 55%,#6228d7)', icon: 'instagram' },
  tiktok: { label: 'TikTok', color: '#ffffff', bg: 'linear-gradient(140deg,#161616,#25f4ee 170%)', icon: 'tiktok' },
  facebook: { label: 'Facebook', color: '#ffffff', bg: 'linear-gradient(140deg,#3b82f6,#1877f2)', icon: 'facebook' },
  x: { label: 'X', color: '#ffffff', bg: 'linear-gradient(140deg,#2a2a30,#050507)', icon: 'x' },
  telegram: { label: 'Telegram', color: '#ffffff', bg: 'linear-gradient(140deg,#41c8f5,#229ED9)', icon: 'telegram' },
  reddit: { label: 'Reddit', color: '#ffffff', bg: 'linear-gradient(140deg,#ff6a3d,#FF4500)', icon: 'reddit' },
  spotify: { label: 'Spotify', color: '#ffffff', bg: 'linear-gradient(140deg,#25d366,#1DB954)', icon: 'spotify' },
  discord: { label: 'Discord', color: '#ffffff', bg: 'linear-gradient(140deg,#7b8cff,#5865F2)', icon: 'discord' },
  website: { label: 'Website', color: '#ffffff', bg: 'linear-gradient(140deg,#38bdf8,#2563eb)', icon: 'globe' }
};

export function platformMeta(platform) {
  return PLATFORM_META[String(platform || '').toLowerCase()] || PLATFORM_META.website;
}

export function platformIcon(platform, size = 20) {
  const m = platformMeta(platform);
  if (m.icon === 'globe') return icon('globe', size);
  return `<img class="platform-glyph" src="/assets/logos/${m.icon}.svg" alt="" width="${size}" height="${size}" loading="lazy" />`;
}

export function avatarInner(profile) {
  const url = safeHttpUrl(profile?.avatar_url || '');
  if (url) return `<img src="${esc(url)}" alt="" loading="lazy" />`;
  return esc(initials(profile?.full_name, profile?.email));
}

export function avatarHTML(profile, cls = 'avatar') {
  return `<span class="${cls}">${avatarInner(profile)}</span>`;
}

export function esc(value) {
  return String(value === null || value === undefined ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function usdt(value) {
  const n = Number(value || 0);
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
}

export function tg(value) {
  const n = Number(value || 0);
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 4 });
}

export function initials(name, email) {
  const source = (name || '').trim() || (email || '').split('@')[0] || 'U';
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

export function icon(name, size = 18) {
  const p = BRAND_PATHS[name] || STROKE_ICONS[name] || STROKE_ICONS.dot;
  if (FILLED.has(name)) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">${p}</svg>`;
  }
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
}

export function ago(ts) {
  if (!ts) return '';
  const ms = Date.now() - new Date(ts).getTime();
  if (!Number.isFinite(ms)) return '';
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 45) return 'just now';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function shortDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function dateTime(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

export function timeLeft(ts) {
  if (!ts) return { text: '—', expired: true };
  const ms = new Date(ts).getTime() - Date.now();
  if (ms <= 0) return { text: 'expired', expired: true };
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { text: `${m}:${String(s).padStart(2, '0')}`, expired: false };
}

const STATUS_MAP = {
  available: ['green', 'Available'],
  claimed: ['orange', 'In progress'],
  submitted: ['blue', 'In review'],
  approved: ['green', 'Approved'],
  rejected: ['red', 'Rejected'],
  expired: ['grey', 'Expired'],
  cancelled: ['grey', 'Cancelled'],
  pending: ['orange', 'Pending'],
  active: ['green', 'Active'],
  paused: ['gold', 'Paused'],
  completed: ['green', 'Completed'],
  paid: ['green', 'Paid'],
  processing: ['blue', 'Processing'],
  open: ['blue', 'Open'],
  resolved: ['green', 'Resolved'],
  closed: ['grey', 'Closed'],
  suspended: ['red', 'Suspended'],
  banned: ['red', 'Banned'],
  reviewing: ['orange', 'Reviewing'],
  dismissed: ['grey', 'Dismissed'],
  draft: ['grey', 'Draft']
};

export function statusBadge(status, overrideLabel) {
  const entry = STATUS_MAP[status] || ['grey', status || '—'];
  return `<span class="badge ${entry[0]}">${esc(overrideLabel || entry[1])}</span>`;
}

export function toast(message, type = 'info', ms = 4200) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const ic = type === 'success' ? 'checkCircle' : type === 'error' ? 'alert' : 'info';
  el.innerHTML = `${icon(ic, 17)}<div>${esc(message)}</div>`;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-6px)';
    el.style.transition = 'opacity .2s ease, transform .2s ease';
    setTimeout(() => el.remove(), 220);
  }, ms);
}

let activeModal = null;

const modalStack = [];

function onEscapeKey(e) {
  if (e.key !== 'Escape') return;
  const top = modalStack[modalStack.length - 1];
  if (top) top();
}

export function openModal({ title, subtitle = '', body = '', footer = '', wide = false, onClose = null }) {
  const mount = document.getElementById('modal-root');
  if (!mount) return { close() {}, root: null, modal: null };

  const holder = document.createElement('div');
  holder.innerHTML = `
    <div class="modal-backdrop" data-modal-backdrop>
      <div class="modal ${wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
        <div class="modal-head">
          <div>
            <h3>${esc(title)}</h3>
            ${subtitle ? `<p>${esc(subtitle)}</p>` : ''}
          </div>
          <button class="modal-close" type="button" data-modal-close aria-label="Close">${icon('x', 17)}</button>
        </div>
        <div class="modal-body" data-modal-body>${body}</div>
        ${footer ? `<div class="modal-foot" data-modal-foot>${footer}</div>` : ''}
      </div>
    </div>`;
  const backdrop = holder.firstElementChild;
  mount.appendChild(backdrop);

  if (!modalStack.length) document.addEventListener('keydown', onEscapeKey);

  const close = () => {
    const i = modalStack.indexOf(close);
    if (i >= 0) modalStack.splice(i, 1);
    backdrop.remove();
    if (!modalStack.length) {
      document.removeEventListener('keydown', onEscapeKey);
      mount.innerHTML = '';
    }
    if (onClose) onClose();
  };

  modalStack.push(close);
  activeModal = close;

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target.closest('[data-modal-close]')) close();
  });

  return { close, root: backdrop, modal: backdrop.firstElementChild };
}

export function closeModal() {
  const top = modalStack[modalStack.length - 1];
  if (top) {
    top();
    activeModal = modalStack[modalStack.length - 1] || null;
  }
}

export function confirmDialog({ title = 'Are you sure?', message = '', confirmLabel = 'Confirm', danger = false }) {
  return new Promise((resolve) => {
    const m = openModal({
      title,
      body: `<p class="muted" style="font-size:13px;line-height:1.65">${esc(message)}</p>`,
      footer: `<button class="btn btn-ghost" type="button" data-cancel>Cancel</button>
               <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" type="button" data-confirm>${esc(confirmLabel)}</button>`,
      onClose: () => resolve(false)
    });
    m.root.querySelector('[data-cancel]').onclick = () => { m.close(); };
    m.root.querySelector('[data-confirm]').onclick = () => { resolve(true); m.close(); };
    m.root.querySelector('[data-confirm]').focus();
  });
}

export function loadingBlock(label = 'Loading') {
  return `<div class="loading-block"><span class="spinner"></span><span>${esc(label)}</span></div>`;
}

export function skeletonCards(n = 3) {
  return Array.from({ length: n }).map(() => `
    <div class="card card-pad" style="display:flex;gap:14px;align-items:center">
      <div class="skeleton" style="width:42px;height:42px;border-radius:12px"></div>
      <div style="flex:1">
        <div class="skeleton sk-line" style="width:46%"></div>
        <div class="skeleton sk-line mt-10" style="width:28%;height:10px"></div>
      </div>
    </div>`).join('');
}

export function emptyState({ iconName = 'info', title = 'Nothing here yet', text = '', action = '' }) {
  return `<div class="empty">
    <div class="empty-ic">${icon(iconName, 22)}</div>
    <h3>${esc(title)}</h3>
    ${text ? `<p>${esc(text)}</p>` : ''}
    ${action}
  </div>`;
}

export function errorPanel(message) {
  return `<div class="alert error">${icon('alert', 17)}<div><strong>Something went wrong.</strong><br>${esc(message)}</div></div>`;
}

export function safeHttpUrl(url) {
  try {
    const u = new URL(String(url));
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.toString() : '';
  } catch (_) { return ''; }
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (_) {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      return true;
    } catch (__) { return false; }
  }
}

export async function sha256Hex(file) {
  try {
    if (!window.crypto?.subtle) return '';
    const buf = await file.arrayBuffer();
    const digest = await window.crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (_) { return ''; }
}

export async function uploadProofFile(file, userId) {
  if (!file) throw new Error('Choose a file first.');
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!allowed.includes(file.type)) throw new Error('Use JPG, PNG, WebP or PDF.');
  if (file.size > 5 * 1024 * 1024) throw new Error('File is larger than 5 MB.');

  const ext = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1].replace('jpeg', 'jpg');
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  const hash = await sha256Hex(file);
  const { error } = await sb.storage.from(CONFIG.proofBucket).upload(path, file, {
    contentType: file.type,
    cacheControl: '3600',
    upsert: false
  });
  if (error) throw new Error(error.message || 'Upload failed.');
  return { path, hash };
}

export async function signedProofUrl(path, seconds = 3600) {
  if (!path) return '';
  const { data, error } = await sb.storage.from(CONFIG.proofBucket).createSignedUrl(path, seconds);
  if (error) return '';
  return data?.signedUrl || '';
}

export function debounce(fn, ms = 320) {
  let t = null;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export function pct(part, total) {
  const p = Number(part || 0);
  const t = Number(total || 0);
  if (!t) return 0;
  return Math.max(0, Math.min(100, Math.round((p / t) * 100)));
}

export function jsonPretty(value) {
  try { return JSON.stringify(value, null, 2); } catch (_) { return String(value); }
}

export function setBusy(button, busy, label = 'Working') {
  if (!button) return;
  if (busy) {
    button.dataset.originalHtml = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `<span class="spinner"></span><span>${esc(label)}</span>`;
  } else {
    button.disabled = false;
    if (button.dataset.originalHtml) button.innerHTML = button.dataset.originalHtml;
  }
}

export function qs(root, selector) { return root.querySelector(selector); }
export function qsa(root, selector) { return Array.from(root.querySelectorAll(selector)); }

export function on(root, selector, event, handler) {
  qsa(root, selector).forEach((el) => el.addEventListener(event, handler));
}


/* Opens a Telegram deep link. A normal tab first (as the design asks); inside
   a Mini App, where window.open can be blocked, the WebApp bridge is used. */
export function openTelegramUrl(url) {
  if (!url) return;
  let win = null;
  try { win = window.open(url, '_blank'); } catch (_) { win = null; }
  if (win) return;
  const tg = window.Telegram && window.Telegram.WebApp;
  if (tg && typeof tg.openTelegramLink === 'function') {
    try { tg.openTelegramLink(url); } catch (_) { /* ignore */ }
  }
}
