import ky from 'ky';

const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
        }
      },
    ],
  },
});

export async function signUp(data: { name: string; email: string; password: string }) {
  return api.post('auth/signup', { json: data }).json();
}

export async function signIn(data: { email: string; password: string }) {
  return api.post('auth/signin', { json: data }).json();
}

export default api;
