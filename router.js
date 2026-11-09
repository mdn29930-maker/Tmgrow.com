/* Tiny hash router with :param support. */

const routes = [];
let onChange = null;
let started = false;

export function addRoute(pattern, loader, meta = {}) {
  const keys = [];
  const regex = new RegExp('^' + pattern
    .replace(/\/+$/, '')
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\/:([A-Za-z0-9_]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    }) + '/?$');
  routes.push({ pattern, regex, keys, loader, meta });
}

export function currentPath() {
  let raw = String(window.location.hash || '').replace(/^#/, '');
  if (!raw) {
    // Legacy paths like /login?ref=x are also honoured once.
    const path = String(window.location.pathname || '/');
    if (path !== '/' && !/\.html?$/.test(path)) raw = path;
  }
  const q = raw.indexOf('?');
  if (q >= 0) raw = raw.slice(0, q);
  if (!raw.startsWith('/')) raw = '/' + raw;
  return raw.replace(/\/+$/, '') || '/';
}

export function navigate(to, { replace = false } = {}) {
  const target = '#' + (to.startsWith('/') ? to : '/' + to);
  if (replace) {
    window.history.replaceState(null, '', target);
    emit();
  } else if (window.location.hash === target) {
    emit();
  } else {
    window.location.hash = target;
  }
}

export function startRouter(cb) {
  onChange = cb;
  if (started) return;
  started = true;
  window.addEventListener('hashchange', emit);
  emit();
}

export function refreshRoute() {
  emit();
}

function emit() {
  if (!onChange) return;
  const path = currentPath();
  for (const r of routes) {
    const m = r.regex.exec(path);
    if (m) {
      const params = {};
      r.keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
      onChange({ path, route: r, params, meta: r.meta });
      return;
    }
  }
  onChange({ path, route: null, params: {}, meta: {} });
}

export function isPath(prefix) {
  const p = currentPath();
  return p === prefix || p.startsWith(prefix + '/');
}
