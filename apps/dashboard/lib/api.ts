import ky from 'ky';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refresh_token');
          }
        }
      },
    ],
  },
});

export async function signUp(data: { email: string; password: string }) {
  return api.post('auth/signup', { json: data }).json();
}

export async function confirmSignUp(data: { email: string; code: string }) {
  return api.post('auth/confirm-signup', { json: data }).json();
}

export async function signIn(data: { email: string; password: string }) {
  return api.post('auth/login', { json: data }).json();
}

export async function forgotPassword(data: { email: string }) {
  return api.post('auth/forgot-password', { json: data }).json();
}

export async function resetPassword(data: { email: string; code: string; newPassword: string }) {
  return api.post('auth/reset-password', { json: data }).json();
}

export async function refreshToken(data: { refreshToken: string }) {
  return api.post('auth/refresh', { json: data }).json();
}

export async function logout(data: { refreshToken: string }) {
  return api.post('auth/logout', { json: data }).json();
}

export function setAuthToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export function setRefreshToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh_token', token);
  }
}

export function getRefreshToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh_token');
  }
  return null;
}

export function clearAuthTokens() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }
}

export default api;
