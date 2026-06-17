import { NextResponse } from 'next/server';
import { createSessionToken, getServerSession, SESSION_COOKIE, sessionCookieOptions } from '@/src/lib/session';
import type { Role } from '@/src/types/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Demo Mode sign-in. Identity is established server-side from the chosen role
 * and pinned to a fixed demo user id. The browser can only assume one of these
 * three demo identities — it can never name an arbitrary user id, so it cannot
 * mint a session for someone else's account.
 *
 * When a real auth backend is connected, replace this map with verification of
 * the backend-issued token and mint the cookie from the verified {userId, role}.
 */
const DEMO_SESSIONS: Record<string, { userId: string; role: Role }> = {
  student: { userId: 'demo-student', role: 'student' },
  counselor: { userId: 'demo-counselor', role: 'counselor' },
  parent: { userId: 'demo-parent', role: 'parent' },
};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const role: string | undefined = body?.role;

    const session = role ? DEMO_SESSIONS[role] : undefined;
    if (!session) {
      return NextResponse.json({ error: 'A valid role is required' }, { status: 400 });
    }

    const res = NextResponse.json({ ok: true, userId: session.userId, role: session.role });
    res.cookies.set(SESSION_COOKIE, createSessionToken(session), sessionCookieOptions);
    return res;
  } catch (err) {
    console.error('[auth/session POST]', err);
    return NextResponse.json({ error: 'Failed to establish session' }, { status: 500 });
  }
}

export async function GET() {
  const session = getServerSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
  return NextResponse.json({ authenticated: true, userId: session.userId, role: session.role });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions, maxAge: 0 });
  return res;
}
