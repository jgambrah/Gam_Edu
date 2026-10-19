'use client';

import { getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/** fetch() with the signed-in user's Firebase ID token in the Authorization header. */
export async function authFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});
  try {
    const app = getApps()[0];
    const user = app ? getAuth(app).currentUser : null;
    if (user) headers.set('Authorization', `Bearer ${await user.getIdToken()}`);
  } catch {
    // no signed-in user: the server will answer 401
  }
  return fetch(input, { ...init, headers });
}
