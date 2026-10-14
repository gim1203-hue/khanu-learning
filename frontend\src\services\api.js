const TOKEN_KEY = 'khanu-auth-token-v1';
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const STATIC_DEMO = import.meta.env.VITE_STATIC_DEMO === 'true' && !API_BASE_URL;

async function localDemoApi(path, options) {
  const { localApi } = await import('./localDemoApi.js');
  return localApi(path, options);
}

export async function api(path, options = {}) {
  if (STATIC_DEMO) return localDemoApi(path, options);
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) headers.set('authorization', `Bearer ${token}`);
  const response = await fetch(`${API_BASE_URL}/api${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
  return data;
}
export { API_BASE_URL, STATIC_DEMO, TOKEN_KEY };
