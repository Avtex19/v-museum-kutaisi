const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

const base = () =>
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/?$/, '') ?? 'http://localhost:8000';

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}

export function saveTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

export async function login(username: string, password: string): Promise<void> {
  const res = await fetch(`${base()}/api/auth/token/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Invalid credentials');

  const data = await res.json();
  saveTokens(data.access, data.refresh);
}

export async function logout(): Promise<void> {
  const token = getAccessToken();
  const refresh = getRefreshToken();

  try {
    await fetch(`${base()}/api/auth/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ refresh }),
    });
  } catch {
    // clear tokens regardless of server response
  }

  clearTokens();
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${base()}/api/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    clearTokens();
    return null;
  }

  const data = await res.json();
  localStorage.setItem('access_token', data.access);
  return data.access;
}

function buildHeaders(token: string, options: RequestInit): HeadersInit {
  const isFormData = options.body instanceof FormData;
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
}

export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  let token = getAccessToken();

  let res = await fetch(url, { ...options, headers: buildHeaders(token ?? '', options) });

  if (res.status === 401) {
    token = await refreshAccessToken();
    if (!token) return res;
    res = await fetch(url, { ...options, headers: buildHeaders(token, options) });
  }

  return res;
}
