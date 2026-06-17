'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import {
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  Lock,
  Loader2,
  ChevronDown,
  Wrench,
  Lightbulb,
  Users,
  HardHat,
  BookText,
  TrendingUp,
  Sparkles,
  Target,
  ArrowRight,
  FileText,
} from 'lucide-react';

/* ── Data ─────────────────────────────────────────────────────────────── */

type SectionStatus = 'completed' | 'in_progress' | 'not_started';

interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  status: SectionStatus;
  score?: number;
  answered?: number;
  total?: number;
  icon: React.ReactNode;
  iconBg: string;
}

const SECTIONS: AssessmentSection[] = [
  {
    id: 'technical-knowledge',
    title: 'Technical Knowledge',
    description: 'Test your understanding of tools, materials, and technical concepts.',
    status: 'completed',
    score: 80,
    icon: <Wrench className="w-4 h-4" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving',
    description: 'Work through real on-the-job scenarios and diagnostic challenges.',
    status: 'completed',
    score: 80,
    icon: <Lightbulb className="w-4 h-4" />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  },
  {
    id: 'work-skills',
    title: 'Work Skills',
    description: 'Assess your communication, teamwork, and professionalism.',
    status: 'in_progress',
    answered: 8,
    total: 10,
    icon: <Users className="w-4 h-4" />,
    iconBg: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  {
    id: 'safety-awareness',
    title: 'Safety Awareness',
    description: 'Check your knowledge of workplace safety and best practices.',
    status: 'in_progress',
    answered: 5,
    total: 10,
    icon: <HardHat className="w-4 h-4" />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  },
  {
    id: 'reading-comprehension',
    title: 'Reading Comprehension',
    description: 'Evaluate your ability to read and understand technical documents.',
    status: 'not_started',
    answered: 0,
    total: 10,
    icon: <BookText className="w-4 h-4" />,
    iconBg: 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400',
  },
  {
    id: 'numeracy-measurement',
    title: 'Numeracy & Measurement',
    description: 'Apply math, measurement, and estimation used on the job.',
    status: 'not_started',
    answered: 0,
    total: 10,
    icon: <Target className="w-4 h-4" />,
    iconBg: 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400',
  },
];

const RADAR_SKILLS = [
  { label: 'Technical Skills', value: 80 },
  { label: 'Problem Solving', value: 75 },
  { label: 'Work Ethics', value: 80 },
  { label: 'Communication', value: 60 },
  { label: 'Teamwork', value: 85 },
  { label: 'Safety Awareness', value: 60 },
];

const SKILL_PROFILE = [
  {
    tag: 'Strongest Skill',
    name: 'Work Ethic',
    tagColor: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    tag: 'Growing Area',
    name: 'Safety Awareness',
    tagColor: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  {
    tag: 'Focus Area',
    name: 'Communication',
    tagColor: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
];

const PROGRESS_PCT = 65;

/* ── Progress ring ────────────────────────────────────────────────────── */

function ProgressRing({ pct }: { pct: number }) {
  const size = 168;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          className="text-gray-100 dark:text-white/10"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#3B82F6"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{pct}%</span>
        <span className="text-[11px] font-medium text-gray-500 dark:text-slate-400 mt-0.5 text-center leading-tight">
          Assessment
          <br />
          Completed
        </span>
      </div>
    </div>
  );
}

/* ── Radar / spider chart ─────────────────────────────────────────────── */

function RadarChart({ skills }: { skills: { label: string; value: number }[] }) {
  const size = 230;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 74;
  const n = skills.length;
  const levels = [0.25, 0.5, 0.75, 1];

  const point = (i: number, factor: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + radius * factor * Math.cos(angle),
      y: cy + radius * factor * Math.sin(angle),
    };
  };

  const dataPoints = skills
    .map((s, i) => {
      const p = point(i, s.value / 100);
      return `${p.x},${p.y}`;
    })
    .join(' ');

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto" role="img" aria-label="Skill summary radar chart">
      {levels.map((lvl) => (
        <polygon
          key={lvl}
          points={skills.map((_, i) => {
            const p = point(i, lvl);
            return `${p.x},${p.y}`;
          }).join(' ')}
          fill="none"
          stroke="currentColor"
          className="text-gray-200 dark:text-white/10"
          strokeWidth={1}
        />
      ))}
      {skills.map((_, i) => {
        const p = point(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="currentColor"
            className="text-gray-200 dark:text-white/10"
            strokeWidth={1}
          />
        );
      })}
      <polygon points={dataPoints} fill="#3B82F6" fillOpacity={0.18} stroke="#3B82F6" strokeWidth={2} />
      {skills.map((s, i) => {
        const p = point(i, s.value / 100);
        return <circle key={i} cx={p.x} cy={p.y} r={3} fill="#3B82F6" />;
      })}
      {skills.map((s, i) => {
        const p = point(i, 1.18);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-slate-500 dark:fill-slate-400"
            style={{ fontSize: 8, fontWeight: 700 }}
          >
            <tspan x={p.x} dy="-0.4em">{s.label}</tspan>
            <tspan x={p.x} dy="1.1em" className="fill-blue-600 dark:fill-blue-400">{s.value}%</tspan>
          </text>
        );
      })}
    </svg>
  );
}

/* ── Status badge ─────────────────────────────────────────────────────── */

function StatusBadge({ status }: { status: SectionStatus }) {
  if (status === 'completed') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg">
        Completed
      </span>
    );
  }
  if (status === 'in_progress') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg">
        In Progress
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400 px-2 py-1 rounded-lg">
      Not Started
    </span>
  );
}

function StatusIcon({ status }: { status: SectionStatus }) {
  if (status === 'completed')
    return <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />;
  if (status === 'in_progress')
    return <Loader2 className="w-5 h-5 text-blue-500 dark:text-blue-400" />;
  return <span className="block w-4 h-4 rounded-full border-2 border-gray-200 dark:border-white/15" />;
}

/* ── Section row ──────────────────────────────────────────────────────── */

function SectionRow({ s }: { s: AssessmentSection }) {
  const [open, setOpen] = useState(false);
  const cta =
    s.status === 'completed' ? 'Review' : s.status === 'in_progress' ? 'Continue' : 'Start Section';

  return (
    <div className="rounded-xl border border-gray-100 dark:border-white/6 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-gray-50/70 dark:hover:bg-white/3 transition-colors"
      >
        <span className="shrink-0">
          <StatusIcon status={s.status} />
        </span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg}`}>
          {s.icon}
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight truncate">
            {s.title}
          </span>
          <span className="block text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug line-clamp-1">
            {s.description}
          </span>
        </span>
        <span className="hidden sm:flex flex-col items-end shrink-0 mr-1">
          <StatusBadge status={s.status} />
          <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 mt-1">
            {s.status === 'completed'
              ? `SCORE: ${s.score}%`
              : `${s.answered} of ${s.total} questions`}
          </span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div className="sm:hidden flex items-center justify-between gap-2 px-3.5 pb-3 -mt-1">
        <StatusBadge status={s.status} />
        <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500">
          {s.status === 'completed' ? `SCORE: ${s.score}%` : `${s.answered} of ${s.total} questions`}
        </span>
      </div>

      {open && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-gray-50 dark:border-white/5">
          {s.status !== 'completed' && typeof s.answered === 'number' && (
            <div className="mb-3 mt-2">
              <div className="h-1.5 bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${((s.answered || 0) / (s.total || 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
          <p className="text-[12px] text-gray-500 dark:text-slate-400 leading-relaxed mb-3">
            {s.description}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-colors"
          >
            {cta} <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function SkillAssessmentPage() {
  const { user } = useAuth();
  const firstName = user?.first_name || user?.last_name?.split(' ')[0] || 'there';
  const [showAll, setShowAll] = useState(false);
  const visibleSections = showAll ? SECTIONS : SECTIONS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Back link ──────────────────────────────────── */}
        <Link
          href="/vocational-technical-student-route"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-tight">
              Skill Assessment
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-2xl">
              Discover your strengths and areas for growth. Your results help us match you with the right{' '}
              <span className="font-semibold text-blue-600 dark:text-blue-400">career pathways</span>.
            </p>
          </div>
          <button
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 self-start shrink-0 bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/12 transition-colors"
          >
            <BookOpen className="w-4 h-4 text-blue-500 dark:text-blue-400" /> Assessment Guide
          </button>
        </div>

        {/* ── Main + sidebar ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">

          {/* ── Left column ──────────────────────────────── */}
          <div className="space-y-4 sm:space-y-6 min-w-0">

            {/* Overall progress */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">Overall Progress</h2>
              <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-7">
                <ProgressRing pct={PROGRESS_PCT} />
                <div className="flex-1 min-w-0 w-full">
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Great job, {firstName}!
                  </p>
                  <p className="text-[13px] text-gray-500 dark:text-slate-400 mt-1 leading-relaxed">
                    You&apos;re making strong progress on your vocational milestones. Complete the remaining
                    steps to unlock your reassessment.
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
                        Sections
                      </span>
                      <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                        13 of 20 sections
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${PROGRESS_PCT}%` }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">7</span>
                        <span className="block text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mt-0.5">
                          Completed
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">6</span>
                        <span className="block text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mt-0.5">
                          In Progress
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-gray-400 dark:text-slate-500 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">7</span>
                        <span className="block text-[10px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide mt-0.5">
                          Not Started
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment sections */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Assessment Sections</h2>
                <span className="text-[11px] font-semibold text-gray-400 dark:text-slate-500">
                  {SECTIONS.length} of 20 sections
                </span>
              </div>
              <div className="space-y-2.5">
                {visibleSections.map((s) => (
                  <SectionRow key={s.id} s={s} />
                ))}
              </div>
              {SECTIONS.length > 4 && (
                <div className="flex justify-center mt-4">
                  <button
                    type="button"
                    onClick={() => setShowAll((v) => !v)}
                    className="inline-flex items-center gap-1.5 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/6 text-slate-600 dark:text-slate-300 rounded-xl px-4 py-2 text-[12px] font-semibold transition-colors"
                  >
                    {showAll ? 'Show Less' : 'View All Sections'}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              )}

              {/* Improve banner */}
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">
                      Want to improve your results?
                    </p>
                    <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">
                      Practice with our sample tests and resources to boost your skills.
                    </p>
                  </div>
                </div>
                <Link
                  href="/vocational-technical-student-route/mmi/practice"
                  className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl px-4 py-2.5 text-[13px] font-semibold transition-colors shrink-0"
                >
                  Start Practice Test
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Assessment summary radar */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Assessment Summary</h3>
              <div className="px-2">
                <RadarChart skills={RADAR_SKILLS} />
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-emerald-700 dark:text-emerald-300 leading-tight">
                    8% improvement since last assessment
                  </p>
                  <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">
                    Last taken on May 10, 2026
                  </p>
                </div>
              </div>
            </div>

            {/* Skill profile */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Your Skill Profile</h3>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 leading-relaxed mb-4">
                Based on your results, you show strong potential in technical and hands-on roles.
              </p>
              <div className="space-y-3">
                {SKILL_PROFILE.map((p) => (
                  <div key={p.tag} className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${p.dot}`} />
                    <div className="min-w-0">
                      <p className={`text-[10px] font-bold uppercase tracking-wide ${p.tagColor}`}>{p.tag}</p>
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                        {p.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="mt-4 flex items-center justify-center gap-1.5 w-full border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
              >
                <FileText className="w-4 h-4" /> View Detailed Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
