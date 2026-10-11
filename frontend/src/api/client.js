import { API_URL as BASE_URL } from '../config';
const TOKEN_KEY = 'cdc_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
  constructor(status, data) {
    super(extractMessage(data) || `Request failed (${status})`);
    this.status = status;
    this.data = data;
  }
}

function extractMessage(data) {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  return Object.entries(data)
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
    .join('; ');
}

export async function api(path, { method = 'GET', body, params } = {}) {
  const query = params
    ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v != null)).toString()
    : '';
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStorage.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}${query}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, data);
  return data;
}

// Paginated list endpoints return { results }; others return arrays.
export const unwrapList = (data) => (Array.isArray(data) ? data : data?.results ?? []);
