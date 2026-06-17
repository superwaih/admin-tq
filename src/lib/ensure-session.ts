'use client';

/**
 * Demo Mode session bootstrap (client side).
 *
 * Protected assessment APIs require a signed, httpOnly session cookie that only
 * the server can mint. In Demo Mode that cookie is established by POSTing the
 * URL-derived role to /api/auth/session. This helper does that exactly once per
 * role and hands every caller the same in-flight promise, so any component can
 * `await ensureDemoSession()` before hitting a protected API without racing or
 * firing duplicate requests.
 *
 * When a real auth backend is connected (a real access_token is present), the
 * session is managed by that flow and this becomes a no-op.
 */

function detectRole(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  if (path.startsWith('/counselor')) return 'counselor';
  if (path.startsWith('/parent')) return 'parent';
  if (path.startsWith('/student')) return 'student';
  if (path.startsWith('/university-college-student-route')) return 'student';
  if (path.startsWith('/vocational-technical-student-route')) return 'student';
  if (path.startsWith('/assessment')) return 'student';
  if (path.startsWith('/pathway')) return 'student';
  return null;
}

let current: { role: string; promise: Promise<void> } | null = null;

export function ensureDemoSession(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();

  // A real token means real auth owns the session; nothing to bootstrap.
  const token = localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token');
  if (token) return Promise.resolve();

  const role = detectRole();
  if (!role) return Promise.resolve();

  if (!current || current.role !== role) {
    const promise = fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    })
      .then(() => undefined)
      .catch(() => {
        // Allow a later retry if establishing the session failed.
        current = null;
      });
    current = { role, promise };
  }

  return current.promise;
}
