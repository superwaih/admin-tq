'use client';

import React, { useMemo, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Topbar } from './Topbar';
import { Sidebar, type RoleType } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { CounselorMobileNav } from './CounselorMobileNav';
import { ParentMobileNav } from './ParentMobileNav';
import { useTheme } from '@/src/hooks/useTheme';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { initTheme } = useTheme();

  useEffect(() => {
    initTheme();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const role = useMemo((): RoleType => {
    if (pathname.startsWith('/counselor')) return 'counselor';
    if (pathname.startsWith('/parent')) return 'parent';
    return 'student';
  }, [pathname]);

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
      {role === 'student' && <MobileBottomNav />}
      {role === 'counselor' && <CounselorMobileNav />}
      {role === 'parent' && <ParentMobileNav />}
    </div>
  );
}
