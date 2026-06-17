'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Mic, Clock, ChevronDown, Play, BookOpen, Bookmark, Search, CheckCircle2,
  HardHat, Users, Lightbulb, Wrench, Scale, Hammer, Target, TrendingUp,
  Award, ArrowRight, MapPin, Star, Timer, BarChart3,
} from 'lucide-react';

/* ── Province data ─────────────────────────────────────────────────── */

const PROVINCES = [
  'All Provinces', 'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba',
  'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador',
  'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut',
];

const PROVINCE_BODIES: Record<string, string> = {
  Ontario: 'Skilled Trades Ontario',
  'British Columbia': 'SkilledTradesBC',
  Alberta: 'Alberta Apprenticeship & Industry Training',
  Quebec: 'Quebec CCQ / DEP intake',
  Manitoba: 'Apprenticeship Manitoba',
  Saskatchewan: 'SATCC (Saskatchewan)',
  'Nova Scotia': 'Nova Scotia Apprenticeship Agency',
  'New Brunswick': 'NB Apprenticeship & Occupational Certification',
  'Newfoundland and Labrador': 'NL Apprenticeship & Trades',
  'Prince Edward Island': 'PEI Apprenticeship',
  'Northwest Territories': 'NWT Apprenticeship',
  Yukon: 'Yukon Trades & Apprenticeship',
  Nunavut: 'Nunavut Trades Training',
};

/* ── Station data ──────────────────────────────────────────────────── */

type Difficulty = 'Easy' | 'Medium' | 'Hard';
type Category =
  | 'Workplace Safety'
  | 'Teamwork'
  | 'Motivation'
  | 'Problem Solving'
  | 'Aptitude'
  | 'Ethics';

interface Station {
  id: string;
  title: string;
  prompt: string;
  category: Category;
  difficulty: Difficulty;
  minutes: number;
  icon: React.ElementType;
  provinceNote?: string;
  completed?: boolean;
  score?: number;
}

const STATIONS: Station[] = [
  {
    id: 'safety-judgment',
    title: 'Workplace Safety Judgment',
    prompt: 'You notice a co-worker on the job site skipping lockout/tagout before servicing a machine. Walk through how you respond.',
    category: 'Workplace Safety', difficulty: 'Medium', minutes: 6, icon: HardHat,
    provinceNote: 'WHMIS & OH&S expectations vary by province',
    completed: true, score: 82,
  },
  {
    id: 'why-this-trade',
    title: 'Why This Trade?',
    prompt: 'Explain to an apprenticeship advisor why you are choosing this trade and how you know it fits you.',
    category: 'Motivation', difficulty: 'Easy', minutes: 5, icon: Lightbulb,
    completed: true, score: 88,
  },
  {
    id: 'jobsite-teamwork',
    title: 'Teamwork on a Job Site',
    prompt: 'A crew member disagrees with your approach mid-task and the deadline is tight. How do you keep the team moving?',
    category: 'Teamwork', difficulty: 'Medium', minutes: 6, icon: Users,
    completed: false,
  },
  {
    id: 'diagnostic-problem',
    title: 'Diagnose & Problem-Solve',
    prompt: 'A circuit keeps tripping after you finish an install. Talk through how you isolate and fix the fault step by step.',
    category: 'Problem Solving', difficulty: 'Hard', minutes: 8, icon: Wrench,
    completed: false,
  },
  {
    id: 'manual-dexterity',
    title: 'Manual Dexterity & Spatial Aptitude',
    prompt: 'A timed station: read a simple shop drawing, identify the measurements, and describe your cut/assembly plan.',
    category: 'Aptitude', difficulty: 'Medium', minutes: 7, icon: Hammer,
    provinceNote: 'Mirrors common entrance/aptitude test stations',
    completed: false,
  },
  {
    id: 'workplace-ethics',
    title: 'Workplace Ethics',
    prompt: 'Your employer asks you to sign off on work you did not fully complete. How do you handle it professionally?',
    category: 'Ethics', difficulty: 'Hard', minutes: 6, icon: Scale,
    completed: false,
  },
  {
    id: 'customer-communication',
    title: 'Explaining Work to a Client',
    prompt: 'A homeowner does not understand why a repair costs more than quoted. Communicate clearly and keep their trust.',
    category: 'Teamwork', difficulty: 'Easy', minutes: 5, icon: Users,
    completed: false,
  },
  {
    id: 'sponsorship-readiness',
    title: 'Employer Sponsorship Interview',
    prompt: 'A potential sponsor asks what you bring to their shop on day one. Make your case in under two minutes.',
    category: 'Motivation', difficulty: 'Medium', minutes: 5, icon: Target,
    provinceNote: 'Sponsorship is required for most apprenticeship intakes',
    completed: false,
  },
];

const CATEGORIES: (Category | 'All Categories')[] = [
  'All Categories', 'Workplace Safety', 'Teamwork', 'Motivation', 'Problem Solving', 'Aptitude', 'Ethics',
];
const DIFFICULTIES: (Difficulty | 'All Difficulties')[] = ['All Difficulties', 'Easy', 'Medium', 'Hard'];
const TABS = ['All Stations', 'Completed', 'Bookmarked'];

/* ── Small UI helpers ──────────────────────────────────────────────── */

function diffStyle(d: Difficulty) {
  return d === 'Easy'
    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    : d === 'Medium'
    ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
    : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300';
}

function Dropdown({
  value, options, onChange,
}: {
  value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
    </div>
  );
}

/* ── Metric cards ──────────────────────────────────────────────────── */

function MetricCards({ completed, avg }: { completed: number; avg: number }) {
  const cards = [
    { icon: <CheckCircle2 className="w-5 h-5" />, color: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', value: `${completed}`, label: 'Sessions Completed' },
    { icon: <BarChart3 className="w-5 h-5" />, color: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', value: `${avg}%`, label: 'Average Score' },
    { icon: <Timer className="w-5 h-5" />, color: 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400', value: '3h 20m', label: 'Time Practiced' },
    { icon: <Award className="w-5 h-5" />, color: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', value: 'On Track', label: 'Interview Readiness' },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.color}`}>{c.icon}</div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-3">{c.value}</p>
          <p className="text-[11px] sm:text-[12px] font-medium text-gray-500 dark:text-slate-400 mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}

/* ── Station card ──────────────────────────────────────────────────── */

function StationCard({
  s, bookmarked, onBookmark, province, provinceBody,
}: {
  s: Station; bookmarked: boolean; onBookmark: () => void; province: string; provinceBody?: string | null;
}) {
  const Icon = s.icon;
  return (
    <div className="flex gap-3 sm:gap-4 p-3.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-white/8 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all bg-white dark:bg-[#161a27]">
      <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100">{s.title}</h3>
              {s.completed && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> {s.score}%
                </span>
              )}
            </div>
            <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">{s.prompt}</p>
          </div>
          <button
            onClick={onBookmark}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark station'}
            className="shrink-0 p-1 -mr-1 -mt-1"
          >
            <Bookmark className={`w-4 h-4 transition-colors ${bookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-300 dark:text-slate-600 hover:text-blue-500'}`} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">{s.category}</span>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${diffStyle(s.difficulty)}`}>{s.difficulty}</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
            <Clock className="w-3 h-3" /> {s.minutes} min
          </span>
          {province !== 'All Provinces' && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <MapPin className="w-3 h-3" /> {province}
            </span>
          )}
        </div>

        {(s.provinceNote || (province !== 'All Provinces' && provinceBody)) && (
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-2 leading-snug">
            {s.provinceNote ? `${s.provinceNote}. ` : ''}
            {province !== 'All Provinces' && provinceBody && (
              <span className="text-blue-500 dark:text-blue-400 font-medium">Aligned to {provinceBody} expectations.</span>
            )}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
          <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500">
            {s.completed ? 'Completed · review feedback' : 'Not started yet'}
          </span>
          <Link
            href={`/vocational-technical-student-route/mmi/practice?station=${s.id}&province=${encodeURIComponent(province)}${s.completed ? '&retry=1' : ''}`}
            className="inline-flex items-center gap-1.5 text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-lg px-3.5 py-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5" fill="currentColor" />
            {s.completed ? 'Retry' : 'Practice'}
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar widgets ───────────────────────────────────────────────── */

function PerformanceOverview({ avg }: { avg: number }) {
  const skills = [
    { label: 'Workplace Safety', value: 84 },
    { label: 'Communication', value: 78 },
    { label: 'Problem Solving', value: 71 },
    { label: 'Teamwork', value: 88 },
  ];
  const r = 56;
  const semi = Math.PI * r;
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Performance Overview</h3>
      <div className="relative w-full flex justify-center pt-2">
        <svg viewBox="0 0 140 80" className="w-44 h-24">
          <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="currentColor" className="text-gray-100 dark:text-white/10" strokeWidth="12" strokeLinecap="round" />
          <path
            d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="url(#pgrad)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={semi} strokeDashoffset={semi * (1 - avg / 100)}
          />
          <defs>
            <linearGradient id="pgrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avg}%</span>
          <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500">Overall Score</span>
        </div>
      </div>
      <div className="space-y-3 mt-3">
        {skills.map((s) => (
          <div key={s.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">{s.label}</span>
              <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{s.value}%</span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${s.value}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RecentSessions() {
  const recent = [
    { title: 'Why This Trade?', score: 88, when: '2 days ago' },
    { title: 'Workplace Safety Judgment', score: 82, when: '4 days ago' },
    { title: 'Explaining Work to a Client', score: 75, when: '1 week ago' },
  ];
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Recent Sessions</h3>
      <div className="space-y-1">
        {recent.map((s) => (
          <div key={s.title} className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">{s.title}</span>
              <span className="block text-[11px] text-gray-400 dark:text-slate-500">{s.when}</span>
            </span>
            <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{s.score}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImproveTips() {
  const tips = [
    { icon: <TrendingUp className="w-4 h-4" />, color: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400', title: 'Use the STAR method', sub: 'Situation, Task, Action, Result keeps answers focused.' },
    { icon: <HardHat className="w-4 h-4" />, color: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', title: 'Lead with safety', sub: 'Trades interviews reward a safety-first mindset.' },
    { icon: <Star className="w-4 h-4" />, color: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', title: 'Show hands-on proof', sub: 'Reference real projects, tools, and logged hours.' },
  ];
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">How to Improve</h3>
      <div className="space-y-3.5">
        {tips.map((t) => (
          <div key={t.title} className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${t.color}`}>{t.icon}</div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200 leading-tight">{t.title}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>
      <Link
        href="/vocational-technical-student-route/counselors/book"
        className="mt-4 flex items-center justify-center gap-1.5 w-full border border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/15 rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
      >
        Book a Mock Interview <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function MmiSimulatorPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [province, setProvince] = useState('All Provinces');
  const [category, setCategory] = useState<string>('All Categories');
  const [difficulty, setDifficulty] = useState<string>('All Difficulties');
  const [query, setQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set(['diagnostic-problem']));

  const completedCount = STATIONS.filter((s) => s.completed).length;
  const recommendedStationId = (STATIONS.find((s) => !s.completed) ?? STATIONS[0]).id;
  const avg = Math.round(
    STATIONS.filter((s) => s.completed).reduce((a, s) => a + (s.score || 0), 0) /
      Math.max(completedCount, 1),
  );

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    return STATIONS.filter((s) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q || s.title.toLowerCase().includes(q) || s.prompt.toLowerCase().includes(q);
      const matchesCat = category === 'All Categories' || s.category === category;
      const matchesDiff = difficulty === 'All Difficulties' || s.difficulty === difficulty;
      const matchesTab =
        activeTab === 0 ? true : activeTab === 1 ? !!s.completed : bookmarks.has(s.id);
      return matchesQuery && matchesCat && matchesDiff && matchesTab;
    });
  }, [query, category, difficulty, activeTab, bookmarks]);

  const bodyLabel = province !== 'All Provinces' ? PROVINCE_BODIES[province] : null;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Trades & Technical Admission Interview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Practice interview, safety, and aptitude stations used for apprenticeship and college program intake.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-semibold text-slate-600 dark:text-slate-300 px-3 py-2 rounded-xl">
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              3 sessions left
            </span>
            <Link
              href={`/vocational-technical-student-route/mmi/practice?station=${recommendedStationId}&province=${encodeURIComponent(province)}`}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl px-4 py-2 text-[13px] font-semibold transition-colors"
            >
              <Play className="w-3.5 h-3.5" fill="currentColor" /> Start Practice
            </Link>
          </div>
        </div>

        {/* Hero CTA */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">
                {bodyLabel ? `${bodyLabel} · Intake Interview` : 'Apprenticeship & College Intake'}
              </p>
              <h3 className="text-lg font-bold text-white leading-tight">Get interview-ready for your trade</h3>
              <p className="text-[12px] text-blue-200 mt-0.5">
                You&apos;ve completed {completedCount} of {STATIONS.length} recommended stations. Keep going!
              </p>
            </div>
          </div>
          <div className="relative flex items-center gap-3 shrink-0">
            <div className="text-center hidden sm:block">
              <p className="text-2xl font-bold text-white">{Math.round((completedCount / STATIONS.length) * 100)}%</p>
              <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-wide">Complete</p>
            </div>
            <Link
              href={`/vocational-technical-student-route/mmi/practice?station=${recommendedStationId}&province=${encodeURIComponent(province)}`}
              className="bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl px-5 py-2.5 text-sm shadow-sm inline-flex gap-2 items-center"
            >
              <BookOpen className="w-4 h-4" /> Practice Now
            </Link>
          </div>
        </div>

        {/* Metrics */}
        <MetricCards completed={completedCount} avg={avg} />

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">
          {/* Left */}
          <div className="min-w-0 space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col lg:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search stations or scenarios…"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
                />
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Dropdown value={province} options={PROVINCES} onChange={setProvince} />
                <Dropdown value={category} options={CATEGORIES as string[]} onChange={setCategory} />
                <Dropdown value={difficulty} options={DIFFICULTIES as string[]} onChange={setDifficulty} />
              </div>
            </div>

            {/* Tabs + list card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/6 px-4 sm:px-5">
                <div className="flex">
                  {TABS.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className={`pb-3.5 pt-4 px-1 mr-6 text-[12px] font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                        i === activeTab
                          ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                          : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                    >
                      {tab === 'Bookmarked' && <Bookmark className="w-3 h-3" />}
                      {tab}
                    </button>
                  ))}
                </div>
                <span className="text-[12px] text-gray-400 dark:text-slate-500">{filtered.length} stations</span>
              </div>

              <div className="p-4 sm:p-5">
                {filtered.length > 0 ? (
                  <div className="space-y-3">
                    {filtered.map((s) => (
                      <StationCard
                        key={s.id}
                        s={s}
                        bookmarked={bookmarks.has(s.id)}
                        onBookmark={() => toggleBookmark(s.id)}
                        province={province}
                        provinceBody={bodyLabel}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No stations found</p>
                    <p className="text-[12px] text-gray-400 dark:text-slate-500 mt-1">Try adjusting your search, filters, or tab.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <PerformanceOverview avg={avg} />
            <RecentSessions />
            <ImproveTips />
          </div>
        </div>

      </div>
    </div>
  );
}
