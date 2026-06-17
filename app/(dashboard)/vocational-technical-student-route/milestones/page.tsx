'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import {
  CheckCircle2, ChevronDown, Lock, ClipboardCheck, BookOpen, ListChecks,
  Award, RefreshCw, ArrowRight, Wrench, TrendingUp, Sparkles, Headphones,
  BookMarked, Clock,
} from 'lucide-react';

type Status = 'done' | 'active' | 'upcoming';

interface Milestone {
  id: string;
  num: number;
  title: string;
  description: string;
  status: Status;
  icon: React.ElementType;
  date?: string;          // completion date (done)
  currentProgram?: string; // active
  progress?: number;       // active %
  expected?: string;       // active expected completion
  available?: string;      // upcoming availability
}

const MILESTONES: Milestone[] = [
  {
    id: 'skills', num: 1, title: 'Skills Assessment',
    description: 'Complete your skills assessment to identify your strengths.',
    status: 'done', icon: ClipboardCheck, date: 'Apr 15, 2026',
  },
  {
    id: 'experience', num: 2, title: 'Experience Log',
    description: 'Document your work, volunteer, or relevant experiences.',
    status: 'done', icon: BookOpen, date: 'Apr 15, 2026',
  },
  {
    id: 'training', num: 3, title: 'Training Plan',
    description: 'Build your personalized training and development plan.',
    status: 'done', icon: ListChecks, date: 'Apr 15, 2026',
  },
  {
    id: 'certification', num: 4, title: 'Industry Certification / Training',
    description: 'Complete a recommended certification or training program.',
    status: 'active', icon: Award,
    currentProgram: 'WHMIS Certification', progress: 60, expected: 'Jun 30, 2026',
  },
  {
    id: 'reassessment', num: 5, title: 'Reassessment',
    description: 'Retake the assessments to qualify for the Standard Track.',
    status: 'upcoming', icon: RefreshCw, available: 'Sep 10, 2026',
  },
];

const DONE = MILESTONES.filter((m) => m.status === 'done').length;
const ACTIVE = MILESTONES.filter((m) => m.status === 'active').length;
const UPCOMING = MILESTONES.filter((m) => m.status === 'upcoming').length;
const TOTAL = MILESTONES.length;
const PCT = Math.round(((DONE + ACTIVE * 0.5) / TOTAL) * 100);

/* ── Progress overview ─────────────────────────────────────────────── */

function ProgressOverview({ firstName }: { firstName: string }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-5">Vocational Milestone Progress</h3>

      <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
        {/* Ring */}
        <div className="relative w-32 h-32 shrink-0">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r={r} fill="none" stroke="currentColor" className="text-gray-100 dark:text-white/8" strokeWidth="11" />
            <circle
              cx="64" cy="64" r={r} fill="none" stroke="url(#mgrad)" strokeWidth="11" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - PCT / 100)}
            />
            <defs>
              <linearGradient id="mgrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{PCT}%</span>
            <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 mt-0.5">{DONE} of {TOTAL} Completed</span>
          </div>
        </div>

        {/* Copy + bar */}
        <div className="flex-1 min-w-0 text-center sm:text-left">
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Great job, {firstName}!</h4>
          <p className="text-[13px] text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
            You&apos;re making strong progress on your vocational milestones. Complete the remaining steps to unlock your reassessment.
          </p>
          <div className="mt-4 h-2.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all" style={{ width: `${PCT}%` }} />
          </div>
        </div>
      </div>

      {/* Stat counts */}
      <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-50 dark:border-white/5">
        {[
          { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-600 dark:text-emerald-400', count: DONE, label: 'Completed' },
          { icon: <Clock className="w-4 h-4" />, color: 'text-rose-500 dark:text-rose-400', count: ACTIVE, label: 'In Progress' },
          { icon: <Lock className="w-4 h-4" />, color: 'text-slate-400 dark:text-slate-500', count: UPCOMING, label: 'Upcoming' },
        ].map((s) => (
          <div key={s.label} className="flex flex-col items-center sm:items-start">
            <span className={`flex items-center gap-1.5 ${s.color}`}>
              {s.icon}
              <span className="text-lg font-bold">{s.count}</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Milestone accordion item ──────────────────────────────────────── */

function MilestoneCard({ m, open, onToggle }: { m: Milestone; open: boolean; onToggle: () => void }) {
  const Icon = m.icon;

  const styles = {
    done: {
      card: 'bg-emerald-50/60 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20',
      iconWrap: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      pill: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
    },
    active: {
      card: 'bg-indigo-50/70 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/25',
      iconWrap: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400',
      pill: 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
    },
    upcoming: {
      card: 'bg-slate-50 dark:bg-white/5 border-gray-100 dark:border-white/8',
      iconWrap: 'bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500',
      pill: 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400',
    },
  }[m.status];

  const leftMarker =
    m.status === 'done' ? (
      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
    ) : m.status === 'active' ? (
      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[11px] font-bold flex items-center justify-center">{m.num}</span>
    ) : (
      <Lock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
    );

  return (
    <div className={`rounded-2xl border ${styles.card} transition-colors`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-left"
      >
        <span className="shrink-0 flex items-center justify-center w-5">{leftMarker}</span>

        <span className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${styles.iconWrap}`}>
          <Icon className="w-5 h-5" strokeWidth={2} />
        </span>

        <span className="flex-1 min-w-0">
          <span className="block text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {m.num}. {m.title}
          </span>
          <span className="block text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug truncate">{m.description}</span>
        </span>

        <span className="hidden sm:flex flex-col items-end shrink-0">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${styles.pill}`}>
            {m.status === 'done' ? 'Completed' : m.status === 'active' ? 'In Progress' : 'Upcoming'}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500 mt-1">
            {m.status === 'done' ? m.date : m.status === 'active' ? `Due ${m.expected}` : `Available ${m.available}`}
          </span>
        </span>

        <ChevronDown className={`w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 -mt-1">
          {/* mobile status row */}
          <div className="sm:hidden flex items-center gap-2 mb-3">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${styles.pill}`}>
              {m.status === 'done' ? 'Completed' : m.status === 'active' ? 'In Progress' : 'Upcoming'}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">
              {m.status === 'done' ? m.date : m.status === 'active' ? `Due ${m.expected}` : `Available ${m.available}`}
            </span>
          </div>

          {m.status === 'active' && (
            <div className="rounded-xl bg-white dark:bg-[#1b2030] border border-indigo-100 dark:border-white/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">Current Program</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">{m.currentProgram}</p>
                </div>
                <Link
                  href="/vocational-technical-student-route/strategy"
                  className="shrink-0 inline-flex items-center gap-1 text-[12px] font-semibold border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg px-3 py-1.5 transition-colors"
                >
                  View Details
                </Link>
              </div>
              <div className="flex items-center gap-2.5 mt-3">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${m.progress}%` }} />
                </div>
                <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{m.progress}%</span>
              </div>
              <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500 mt-2.5">Expected completion: {m.expected}</p>
            </div>
          )}

          {m.status === 'done' && (
            <p className="text-[12px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Finished on {m.date}. Nice work — this milestone is locked in.
            </p>
          )}

          {m.status === 'upcoming' && (
            <p className="text-[12px] text-gray-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" /> Unlocks on {m.available} once your earlier milestones are complete.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Sidebar widgets ───────────────────────────────────────────────── */

function NextMilestoneWidget() {
  const active = MILESTONES.find((m) => m.status === 'active')!;
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Next Milestone</h3>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{active.title}</p>
          <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">You&apos;re working on this milestone</p>
        </div>
      </div>
      <p className="text-[11px] font-medium text-gray-400 dark:text-slate-500 mt-3">Expected Completion: {active.expected}</p>
      <div className="mt-2 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${active.progress}%` }} />
      </div>
      <Link
        href="/vocational-technical-student-route/milestones/certification"
        className="mt-4 flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
      >
        Continue Progress <ArrowRight className="w-3.5 h-3.5" />
      </Link>
      <Link
        href="/vocational-technical-student-route/career"
        className="mt-2 block text-center text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        View Milestone Details
      </Link>
    </div>
  );
}

function WhyMatters() {
  const reasons = [
    { icon: <Wrench className="w-4 h-4" />, color: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', title: 'Build Real-World Skills', sub: 'Strengthen your profile with practical experience and training.' },
    { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', title: 'Increase Opportunity', sub: 'Unlock more career pathways and apprenticeship options.' },
    { icon: <Sparkles className="w-4 h-4" />, color: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', title: 'Unlock Upgrades', sub: 'Complete all milestones to qualify for the Standard Track.' },
  ];
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Why Milestones Matter</h3>
      <div className="space-y-3.5">
        {reasons.map((r) => (
          <div key={r.title} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>{r.icon}</div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{r.title}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NeedHelp() {
  return (
    <div className="rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Need Help?</h3>
      </div>
      <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-snug">
        Have questions about your milestones? Book a session with your counselor.
      </p>
      <Link
        href="/vocational-technical-student-route/counselors/book"
        className="mt-3 flex items-center justify-center w-full border border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/15 rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
      >
        Book Counselling Session
      </Link>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function MilestonesPage() {
  const { user } = useAuth();
  const firstName = user?.first_name || user?.last_name?.split(' ')[0] || 'Student';
  const [openId, setOpenId] = useState<string>('certification');

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Milestones
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Track your progress through your vocational journey.
            </p>
          </div>
          <Link
            href="/vocational-technical-student-route/strategy"
            className="inline-flex items-center gap-1.5 self-start bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-semibold text-slate-600 dark:text-slate-300 px-3 sm:px-3.5 py-2 rounded-xl shrink-0 hover:bg-gray-50 dark:hover:bg-white/12 transition-colors"
          >
            <BookMarked className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="hidden sm:inline">Milestones Guide</span>
            <span className="sm:hidden">Guide</span>
          </Link>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">
          {/* Left */}
          <div className="space-y-4 sm:space-y-5 min-w-0">
            <ProgressOverview firstName={firstName} />
            <div className="space-y-3">
              {MILESTONES.map((m) => (
                <MilestoneCard
                  key={m.id}
                  m={m}
                  open={openId === m.id}
                  onToggle={() => setOpenId((cur) => (cur === m.id ? '' : m.id))}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <NextMilestoneWidget />
            <WhyMatters />
            <NeedHelp />
          </div>
        </div>

      </div>
    </div>
  );
}
