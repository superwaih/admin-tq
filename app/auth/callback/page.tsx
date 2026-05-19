'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthService } from '@/src/services/authService';
import { Loader2 } from 'lucide-react';

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const access_token = searchParams.get('access_token');
    const refresh_token = searchParams.get('refresh_token');
    const role = searchParams.get('role');

    if (access_token && refresh_token) {
      // 1. Store tokens using your existing logic
      AuthService.storeTokens({
        access_token,
        refresh_token,
        token_type: 'bearer'
      }, true);

      // 2. Redirect to the correct dashboard
      router.push(`/${role || 'student'}`);
    } else {
      // Handle error scenario
      router.push('/auth/login?error=OAuthFailed');
    }
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
      <p className="text-gray-500 font-medium">Completing secure sign in...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}