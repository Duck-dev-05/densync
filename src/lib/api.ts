const API_BASE = 'http://localhost:8000/api';

/**
 * The backend accepts the user_id as bearer token (see backend/auth.py).
 * AuthContext mirrors the logged-in user into localStorage ('densync_user'),
 * so we read it from there at call time.
 */
function getToken(): string | null {
  try {
    const raw = localStorage.getItem('densync_user');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.user_id === 'string' ? parsed.user_id : null;
  } catch {
    return null;
  }
}

export function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** GET helper. Returns the parsed JSON body, or null when the API is unreachable / errored. */
export async function apiGet<T = any>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { headers: authHeaders() });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** POST helper. Returns the parsed JSON body, or null when the API is unreachable / errored. */
export async function apiPost<T = any>(path: string, body: unknown): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders() },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
