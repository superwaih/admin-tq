'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { AifAlertBanner } from './_components/AifAlertBanner';
import { StudentSidebarWidgets } from './_components/StudentSidebarWidgets';
import { StudentStatCards } from './_components/StudentStatCards';
import { TargetProgramsList } from './_components/TargetProgramsList';

export default function StudentPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const firstName = user?.first_name || user?.last_name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Page header ──────────────────────────────────── */}
        <div className="flex items-end justify-between gap-3">
          <div>
            <h1 className="text-[22px] sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              <span className="font-semibold text-red-500 dark:text-red-400">3 deadlines</span>
              {' '}in next 14 days{' '}
              <span className="hidden sm:inline">· Last OUAC sync: 2 hours ago</span>
            </p>
          </div>

          {/* OUAC status chips — hidden on mobile to save space */}
          <div className="hidden sm:flex items-center gap-2 self-start">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              OUAC Synced
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[11px] font-semibold text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-full">
              Grade 12 · Ridgemont HS
            </span>
          </div>

          {/* Mobile: compact OUAC badge */}
          <div className="sm:hidden">
            <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/25 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              OUAC Live
            </span>
          </div>
        </div>

        {/* ── Urgent alert banner ──────────────────────────── */}
        <AifAlertBanner />

        {/* ── Stat cards ──────────────────────────────────── */}
        <StudentStatCards />

        {/* ── Main content + sidebar ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6">
          {/* Left: programs table */}
          <TargetProgramsList className="min-h-[360px] sm:min-h-[480px]" />

          {/* Right: sidebar widgets — stacks below on mobile */}
          <StudentSidebarWidgets />
        </div>

      </div>
    </div>
  );
}
