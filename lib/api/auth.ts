/**
 * Auth API — all calls go through the shared Axios instance.
 * Never import axios directly in this file.
 */

import api, { setToken } from '@/lib/axios';
import { User } from '@/types';

export async function loginApi(
  username: string,
  password: string
): Promise<User> {
  const { data } = await api.post<User>('/auth/login', {
    username,
    password,
    expiresInMins: 60,
  });
  // Persist token in memory so every subsequent request is authenticated
  setToken(data.token);
  return data;
}

export async function logoutApi(): Promise<void> {
  setToken(null);
  // Hit our Next.js route handler to clear the HttpOnly cookie
  await fetch('/api/auth/logout', { method: 'POST' });
}
