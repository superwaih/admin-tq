import crypto from 'crypto';
import { cookies } from 'next/headers';
import type { Role } from '@/src/types/auth';

/**
 * Server-side session for the AdmitIQ web app.
 *
 * Identity is carried in a signed, httpOnly cookie that only the server can
 * mint (via /api/auth/session). API routes derive the acting user from this
 * cookie and NEVER trust a `userId` supplied by the browser — that closes the
 * IDOR hole where anyone could read/overwrite another student's assessment by
 * changing the id in the request.
 *
 * In Demo Mode the session is established from the chosen demo role (see the
 * session route). When a real auth backend is connected, mint the cookie from
 * verified backend credentials instead — every consumer here stays the same.
 */

export const SESSION_COOKIE = 'aiq_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export interface SessionUser {
  userId: string;
  role: Role;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length > 0) return secret;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  // Dev-only fallback so the demo works out of the box.
  return 'admitiq-dev-insecure-session-secret';
}

function b64url(buf: Buffer): string {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(str: string): Buffer {
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function sign(payload: string): string {
  return b64url(crypto.createHmac('sha256', getSecret()).update(payload).digest());
}

export function createSessionToken(user: SessionUser): string {
  const payload = b64url(
    Buffer.from(JSON.stringify({ sub: user.userId, role: user.role, iat: Date.now() })),
  );
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;

  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const obj = JSON.parse(fromB64url(payload).toString('utf8'));
    if (!obj?.sub || !obj?.role) return null;
    return { userId: String(obj.sub), role: obj.role as Role };
  } catch {
    return null;
  }
}

/** Read and verify the current session from the request cookies. */
export function getServerSession(): SessionUser | null {
  const token = cookies().get(SESSION_COOKIE)?.value;
  return verifySessionToken(token);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: MAX_AGE_SECONDS,
};

/**
 * Resolve which student's assessment the session may act on.
 * - Self access (no id, or the session's own id) is always allowed.
 * - Reading another user's assessment requires a counselor/admin role.
 */
export type AccessDecision =
  | { ok: true; userId: string }
  | { ok: false; status: number; error: string };

export function resolveAssessmentTarget(
  session: SessionUser,
  requestedUserId: string | null,
): AccessDecision {
  if (!requestedUserId || requestedUserId === session.userId) {
    return { ok: true, userId: session.userId };
  }
  if (session.role === 'counselor' || session.role === 'admin') {
    return { ok: true, userId: requestedUserId };
  }
  return { ok: false, status: 403, error: 'You are not allowed to view this assessment' };
}

/**
 * Resolve which of the requested student ids the session may read in a batch.
 * Applies the same rule as `resolveAssessmentTarget` per id: counselors/admins
 * may read any id, while a student is narrowed to only their own id. Ids the
 * session cannot read are silently dropped (the caller defaults them to
 * incomplete) so one disallowed id never fails the whole batch.
 */
export function resolveAssessmentTargets(
  session: SessionUser,
  requestedUserIds: string[],
): string[] {
  const ids = Array.from(new Set(requestedUserIds));
  if (session.role === 'counselor' || session.role === 'admin') {
    return ids;
  }
  return ids.filter((id) => id === session.userId);
}
