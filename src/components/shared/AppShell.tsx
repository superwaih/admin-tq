'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Topbar } from './Topbar';
import { Sidebar, type RoleType } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { CounselorMobileNav } from './CounselorMobileNav';
import { ParentMobileNav } from './ParentMobileNav';
import { useTheme } from '@/src/hooks/useTheme';
import { useAuth } from '@/src/hooks/useAuth';
import { ensureDemoSession } from '@/src/lib/ensure-session';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { initTheme } = useTheme();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    initTheme();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const role = useMemo((): RoleType => {
    if (pathname.startsWith('/counselor')) return 'counselor';
    if (pathname.startsWith('/parent')) return 'parent';
    if (pathname.startsWith('/university-college-student-route')) return 'uni-college';
    if (pathname.startsWith('/vocational-technical-student-route')) return 'vocational';
    return 'student';
  }, [pathname]);

  const isStudentRole = role === 'student' || role === 'uni-college' || role === 'vocational';

  // ── Establish the server-side session cookie before any protected fetch ──
  const [sessionReady, setSessionReady] = useState(false);
  useEffect(() => {
    let active = true;
    ensureDemoSession().then(() => { if (active) setSessionReady(true); });
    return () => { active = false; };
  }, []);

  // ── Gate: students must complete the assessment before the dashboard ──
  const [gateChecked, setGateChecked] = useState(!isStudentRole);

  useEffect(() => {
    if (!sessionReady) return;
    if (!isStudentRole) { setGateChecked(true); return; }
    if (authLoading) return;
    const uid = user?.id;
    // Fail closed: a student role with no resolved user must not see the
    // dashboard without verifying assessment completion.
    if (!uid) { router.replace('/assessment'); return; }
    let active = true;
    setGateChecked(false);
    fetch(`/api/assessment/status?userId=${encodeURIComponent(uid)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (!active) return;
        if (!d?.completed) router.replace('/assessment');
        else setGateChecked(true);
      })
      // Fail closed: if completion can't be verified, send the student to the
      // assessment rather than granting unverified dashboard access.
      .catch(() => { if (active) router.replace('/assessment'); });
    return () => { active = false; };
  }, [sessionReady, role, authLoading, user?.id, router]);

  if (!sessionReady || !gateChecked) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8F9FC] dark:bg-[#0f1117]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F8F9FC] dark:bg-[#0f1117] overflow-hidden transition-colors duration-200">

      {/* Sidebar — desktop only */}
      <div className="hidden md:flex">
        <Sidebar role={role} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />

        {/* Extra bottom padding on mobile so content clears the fixed bottom nav */}
        <main className="flex-1 overflow-y-auto bg-[#F8F9FC] dark:bg-[#0f1117] transition-colors duration-200 pb-[76px] md:pb-0">
          <div className="p-3.5 sm:p-5 md:p-8 lg:p-10 max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom navigation — mobile only */}
      {role === 'student' && <MobileBottomNav basePath="/student" />}
      {role === 'uni-college' && <MobileBottomNav basePath="/university-college-student-route" />}
      {role === 'vocational' && <MobileBottomNav basePath="/vocational-technical-student-route" vocational />}
      {role === 'counselor' && <CounselorMobileNav />}
      {role === 'parent' && <ParentMobileNav />}
    </div>
  );
}
