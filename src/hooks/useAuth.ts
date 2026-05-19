'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { LoginCredentials, RegisterCredentials, Role, UserProfile, SocialProvider } from '@/src/types/auth';
import { AuthService } from '../services/authService';

/* ── Demo users injected when no real token is present ─────────────────────── */
const DEMO_USERS: Record<string, UserProfile> = {
  student: {
    id: 'demo-student',
    email: 'priya.mehta@gmail.com',
    role: 'student',
    first_name: 'Priya',
    last_name: 'Mehta',
    province: 'ON',
  },
  counselor: {
    id: 'demo-counselor',
    email: 'sarah.kim@westview.on.ca',
    role: 'counselor',
    first_name: 'Sarah',
    last_name: 'Kim',
    province: 'ON',
  },
  parent: {
    id: 'demo-parent',
    email: 'm.roberts@outlook.com',
    role: 'parent',
    first_name: 'Margaret',
    last_name: 'Roberts',
    province: 'ON',
  },
};

function detectDemoRole(): Role | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname;
  if (path.startsWith('/counselor')) return 'counselor';
  if (path.startsWith('/parent')) return 'parent';
  if (path.startsWith('/student')) return 'student';
  return null;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roleLabel = (role: Role) => {
    const roles: Record<Role, string> = {
      student: 'student',
      counselor: 'counselor',
      parent: 'parent',
      admin: 'admin'
    };
    return roles[role] || 'user';
  };

  const refreshUser = useCallback(async () => {
    const token = typeof window !== 'undefined'
      ? localStorage.getItem('access_token') ?? sessionStorage.getItem('access_token')
      : null;

    if (!token) {
      // No real token — inject a demo user based on the current URL
      const demoRole = detectDemoRole();
      if (demoRole) {
        setUser(DEMO_USERS[demoRole]);
      }
      setLoading(false);
      return;
    }

    try {
      const userData = await AuthService.getMe();
      setUser(userData);
    } catch (err) {
      // Token invalid — fall back to demo user so dashboards stay accessible
      const demoRole = detectDemoRole();
      if (demoRole) {
        setUser(DEMO_USERS[demoRole]);
      } else {
        AuthService.logout();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshUser(); }, [refreshUser]);

  const login = async (credentials: LoginCredentials, expectedRole?: Role, remember = true) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthService.login(credentials);
      AuthService.storeTokens(data, remember);
      
      const userData = await AuthService.getMe();
      
      if (expectedRole && userData.role !== expectedRole) {
        AuthService.logout();
        setUser(null);
        setError(
          `This email is registered as a ${roleLabel(userData.role)} account. Please sign in through the ${roleLabel(expectedRole)} page.`
        );
        return;
      }

      setUser(userData);
      router.push(`/${userData.role}`);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.register(credentials);
      const params = new URLSearchParams({
        email: credentials.email,
        role: credentials.role
      });
      router.push(`/auth/verify?${params.toString()}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (email: string, code: string, role: Role) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.verifyEmail(email, code);
      router.push(`/auth/onboarding/${role}`);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const requestPasswordReset = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.forgotPassword(email);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      await AuthService.resetPassword(token, newPassword);
      router.push('/auth/login?reset=success');
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      await AuthService.updateUser(user.id, updates);
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    router.push('/auth/');
  };

  const socialAuth = (provider: SocialProvider) => {
    AuthService.socialAuth(provider);
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    submitOtp,
    logout,
    socialAuth,
    resetPassword,
    requestPasswordReset,
    updateProfile,
    setError
  };
}
