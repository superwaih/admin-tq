'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/src/hooks/useAuth';
import { CalendarDays } from 'lucide-react';
import { AifAlertBanner } from './_components/AifAlertBanner';
import { StudentSidebarWidgets } from './_components/StudentSidebarWidgets';
import { StudentStatCards } from './_components/StudentStatCards';
import { MilestoneTimeline } from './_components/MilestoneTimeline';
import { CareerMatches } from './_components/CareerMatches';
import { QuickActionsRow } from './_components/QuickActionsRow';

export default function VocationalStudentPage() {
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('Good morning');
  const [today, setToday] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    setToday(
      now.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
    );
  }, []);

  const firstName = user?.first_name || user?.last_name?.split(' ')[0] || 'Student';

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Page header ──────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              {greeting}, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Here&apos;s your <span className="font-semibold text-blue-600 dark:text-blue-400">vocational pathway</span> overview for today.
            </p>
          </div>

          {today && (
            <span className="hidden sm:inline-flex items-center gap-2 self-start bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl shrink-0">
              <CalendarDays className="w-4 h-4 text-gray-400 dark:text-slate-500" />
              {today}
            </span>
          )}
        </div>

        {/* ── Next milestone banner ────────────────────────── */}
        <AifAlertBanner />

        {/* ── Stat cards ──────────────────────────────────── */}
        <StudentStatCards />

        {/* ── Main content + sidebar ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">
          <div className="space-y-4 sm:space-y-6 min-w-0">
            <MilestoneTimeline />
            <CareerMatches />
            <QuickActionsRow />
          </div>
          <StudentSidebarWidgets />
        </div>

      </div>
    </div>
  );
}
