import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// AUTH BYPASS — all dashboard routes are accessible without a token.
// Remove this file's early-return and restore the token check below
// once a real backend is connected.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/student/:path*', '/counselor/:path*', '/parent/:path*'],
};
