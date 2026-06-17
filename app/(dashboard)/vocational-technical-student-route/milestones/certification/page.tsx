'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  CalendarDays,
  Target,
  Clock,
  Star,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  Building2,
  GraduationCap,
  BarChart3,
  Headphones,
  Lightbulb,
  Download,
  TrendingUp,
  Sparkles,
  BadgeCheck,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────────────────────────── */

const PROGRESS = 60;

const OVERVIEW_STATS = [
  { icon: <CalendarDays className="w-4 h-4" />, label: 'Started On', value: 'May 10, 2026', color: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { icon: <Target className="w-4 h-4" />, label: 'Target Completion', value: 'Jun 30, 2026', color: 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400' },
  { icon: <Clock className="w-4 h-4" />, label: 'Expected Time', value: '4–8 Weeks', color: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { icon: <Star className="w-4 h-4" />, label: 'Points Earned', value: '60 / 100', color: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
];

type StepStatus = 'done' | 'active' | 'pending';

interface Step {
  title: string;
  description: string;
  status: StepStatus;
  date?: string;
  progress?: number;
}

const STEPS: Step[] = [
  {
    title: 'Research Certification Programs',
    description: 'Explore and shortlist relevant programs.',
    status: 'done',
    date: 'May 12, 2026',
  },
  {
    title: 'Enroll in a Program',
    description: 'Register for the selected certification or training.',
    status: 'done',
    date: 'May 18, 2026',
  },
  {
    title: 'Complete Required Coursework',
    description: 'Finish the modules or training requirements.',
    status: 'active',
    progress: 60,
  },
  {
    title: 'Submit Certification Proof',
    description: 'Upload your certificate to complete this milestone.',
    status: 'pending',
  },
];

const CERT_DETAILS = [
  { label: 'Current Program', value: 'WHMIS Certification', sub: 'Workplace Hazardous Materials Information System' },
  { label: 'Provider', value: 'Ontario Ministry of Labour', icon: <Building2 className="w-4 h-4" /> },
  { label: 'Level', value: 'Beginner', icon: <BarChart3 className="w-4 h-4" /> },
];

const LEARNING_OUTCOMES = [
  'Identify workplace hazards',
  'Understand WHMIS labels and symbols',
  'Handle hazardous materials safely',
  'Follow emergency procedures',
];

const BENEFITS = [
  { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', title: 'Increase employability', sub: 'Employers value certified, job-ready candidates.' },
  { icon: <Sparkles className="w-4 h-4" />, color: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', title: 'Boost your skills', sub: 'Gain practical knowledge for safer workplaces.' },
  { icon: <BadgeCheck className="w-4 h-4" />, color: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', title: 'Meet industry standards', sub: 'Certifications help you meet legal requirements.' },
];

/* ── Step row ─────────────────────────────────────────────────────────── */

function StepIcon({ status }: { status: StepStatus }) {
  if (status === 'done') return <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
  if (status === 'active') return <Loader2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />;
  return <span className="block w-4 h-4 rounded-full border-2 border-gray-200 dark:border-white/15" />;
}

function StepBadge({ step }: { step: Step }) {
  if (step.status === 'done') {
    return (
      <div className="flex flex-col items-start sm:items-end shrink-0">
        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg">
          Completed
        </span>
        {step.date && (
          <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 mt-1">{step.date}</span>
        )}
      </div>
    );
  }
  if (step.status === 'active') {
    return (
      <div className="flex flex-col items-start sm:items-end shrink-0">
        <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg">
          In Progress
        </span>
        <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 mt-1">{step.progress}% completed</span>
      </div>
    );
  }
  return (
    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg shrink-0">
      Pending
    </span>
  );
}

function StepRow({ step, last }: { step: Step; last: boolean }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center shrink-0">
        <StepIcon status={step.status} />
        {!last && <span className="w-px flex-1 bg-gray-100 dark:bg-white/8 my-1" />}
      </div>
      <div className={`flex-1 min-w-0 ${last ? '' : 'pb-5'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{step.title}</p>
            <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{step.description}</p>
          </div>
          <div className="hidden sm:block">
            <StepBadge step={step} />
          </div>
        </div>
        <div className="sm:hidden mt-2">
          <StepBadge step={step} />
        </div>
        {step.status === 'active' && typeof step.progress === 'number' && (
          <div className="mt-2.5 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden max-w-md">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${step.progress}%` }} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function CertificationTrainingPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Back link ──────────────────────────────────── */}
        <Link
          href="/vocational-technical-student-route/milestones"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Milestones
        </Link>

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
                Industry Certification / Training
              </h1>
              <span className="inline-flex items-center text-[11px] font-bold bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg shrink-0">
                Milestone 4 of 5
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1.5 max-w-2xl">
              Complete a recognized certification or training program to strengthen your career readiness.
            </p>
          </div>
          <div className="lg:text-right shrink-0 lg:min-w-[220px]">
            <div className="flex items-center justify-between lg:justify-end gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg">
                In Progress
              </span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{PROGRESS}% Complete</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${PROGRESS}%` }} />
            </div>
          </div>
        </div>

        {/* ── Main + sidebar ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">

          {/* ── Left column ──────────────────────────────── */}
          <div className="space-y-4 sm:space-y-6 min-w-0">

            {/* Milestone overview */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Milestone Overview</h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed">
                  This milestone focuses on completing an industry-recognized certification or training program
                  relevant to your chosen career pathway. It validates your skills and improves your employment
                  opportunities.
                </p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                {OVERVIEW_STATS.map((s) => (
                  <div key={s.label} className="rounded-xl border border-gray-100 dark:border-white/6 p-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.color}`}>{s.icon}</div>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 mt-2.5">{s.label}</p>
                    <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-tight">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress steps */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Your Progress</h2>
                <span className="text-[12px] font-bold text-indigo-600 dark:text-indigo-400">{PROGRESS}%</span>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mb-3">You&apos;re making good progress! Keep going.</p>
              <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${PROGRESS}%` }} />
              </div>

              <div>
                {STEPS.map((step, i) => (
                  <StepRow key={step.title} step={step} last={i === STEPS.length - 1} />
                ))}
              </div>

              {/* Need help banner */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">Need Help?</p>
                    <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Book a session with your counselor for guidance on choosing the right certification.
                    </p>
                  </div>
                </div>
                <Link
                  href="/vocational-technical-student-route/counselors/book"
                  className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors shrink-0"
                >
                  Book Counseling Session
                </Link>
              </div>

              {/* Tips banner */}
              <div className="mt-3 flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4">
                <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">Tips for Success</p>
                  <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">
                    Set a weekly study goal, use practice tests, and don&apos;t hesitate to ask your counselor for resources.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Certification details */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Certification Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{CERT_DETAILS[0].label}</p>
                  <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-0.5">{CERT_DETAILS[0].value}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{CERT_DETAILS[0].sub}</p>
                </div>

                {CERT_DETAILS.slice(1).map((d) => (
                  <div key={d.label} className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 flex items-center justify-center shrink-0">
                      {d.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500">{d.label}</p>
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{d.value}</p>
                    </div>
                  </div>
                ))}

                <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Approx. 6 Hours
                    </span>
                    <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-md">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2.5">
                    <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${PROGRESS}%` }} />
                    </div>
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shrink-0">{PROGRESS}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-1.5 mb-3">
                <GraduationCap className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">What You&apos;ll Learn</h3>
              </div>
              <ul className="space-y-2.5">
                {LEARNING_OUTCOMES.map((o) => (
                  <li key={o} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Benefits</h3>
              <div className="space-y-3.5">
                {BENEFITS.map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${b.color}`}>{b.icon}</div>
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{b.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">{b.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 flex items-center justify-center gap-1.5 w-full border border-indigo-200 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
              >
                <Download className="w-4 h-4" /> Download Program Guide
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
