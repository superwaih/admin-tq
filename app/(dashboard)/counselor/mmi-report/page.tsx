'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Filter, Download,
  Users, TrendingUp, TrendingDown, ArrowUpRight, Sparkles,
  Activity, Star, CheckCircle2, Clock, AlertTriangle,
  BarChart2, Target, Zap, BookOpen,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type StatusKey = 'Excellent' | 'Good' | 'Fair' | 'Needs Practice' | 'At Risk';

// ── Data ─────────────────────────────────────────────────────────────────────
const STAT_CARDS = [
  { label: 'Total Students',    value: '120',   change: '+4%',  sub: 'vs last month', icon: Users,       iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',     iconColor: 'text-cyan-600 dark:text-cyan-400',     positive: true  },
  { label: 'Average Score',     value: '8.4/10',change: '+4%',  sub: 'vs last month', icon: Star,        iconBg: 'bg-violet-50 dark:bg-violet-500/15', iconColor: 'text-violet-600 dark:text-violet-400', positive: true  },
  { label: 'Improvement Rate',  value: '+12%',  change: null,   sub: 'vs last month', icon: TrendingUp,  iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',iconColor: 'text-emerald-600 dark:text-emerald-400',positive: true  },
  { label: 'Practice Sessions', value: '62',    change: '+4%',  sub: 'vs last month', icon: Activity,    iconBg: 'bg-amber-50 dark:bg-amber-500/15',   iconColor: 'text-amber-600 dark:text-amber-400',   positive: true  },
  { label: 'Completion Rate',   value: '87%',   change: '+6%',  sub: 'vs last month', icon: CheckCircle2,iconBg: 'bg-blue-50 dark:bg-blue-500/15',     iconColor: 'text-blue-600 dark:text-blue-400',     positive: true  },
  { label: 'Avg Session Time',  value: '52 min',change: '-3min',sub: 'vs last month', icon: Clock,       iconBg: 'bg-pink-50 dark:bg-pink-500/15',     iconColor: 'text-pink-600 dark:text-pink-400',     positive: false },
];

const PRACTICE_STATIONS = [
  { name: 'Why Medicine?',      icon: '🩺', avgScore: 8.6, completed: '8.6/10', improvement: '+16%', passRate: 94, barW: 88, barColor: 'bg-emerald-500', difficulty: 'Easy'    },
  { name: 'Problem Solving',    icon: '🧩', avgScore: 8.2, completed: '8.2/10', improvement: '+15%', passRate: 89, barW: 82, barColor: 'bg-blue-500',    difficulty: 'Medium'  },
  { name: 'Handling Pressure',  icon: '💪', avgScore: 7.9, completed: '7.1/10', improvement: '+14%', passRate: 81, barW: 72, barColor: 'bg-amber-400',   difficulty: 'Medium'  },
  { name: 'Ethical Dilemma',    icon: '⚖️', avgScore: 7.6, completed: '7.5/10', improvement: '+12%', passRate: 77, barW: 68, barColor: 'bg-orange-400',  difficulty: 'Hard'    },
  { name: 'Communication',      icon: '🗣️', avgScore: 7.6, completed: '7.5/10', improvement: '+12%', passRate: 76, barW: 67, barColor: 'bg-slate-500',   difficulty: 'Medium'  },
  { name: 'Team work scenario', icon: '🤝', avgScore: 7.6, completed: '7.5/10', improvement: '+12%', passRate: 74, barW: 64, barColor: 'bg-red-400',    difficulty: 'Hard'    },
];

const DIFF_BADGE: Record<string, string> = {
  Easy:   'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  Medium: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Hard:   'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',
};

const STUDENTS = [
  { name: 'Maryam Okafor',  id: 'STU-2024-1005', initials: 'MO', color: 'bg-orange-400', scores: [9.3, 9.0, 8.8, 8.5, 9.1, 8.9], avg: 9.3, sessions: 10, status: 'Excellent',     statusCls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend: true  },
  { name: 'Fatima Bello',   id: 'STU-2024-1003', initials: 'FB', color: 'bg-pink-500',   scores: [8.9, 8.5, 8.0, 7.8, 8.4, 8.2], avg: 8.9, sessions:  9, status: 'Excellent',     statusCls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend: true  },
  { name: 'Amina Yusuf',    id: 'STU-2024-1001', initials: 'AY', color: 'bg-yellow-400', scores: [8.4, 8.0, 7.5, 7.2, 7.8, 7.6], avg: 8.4, sessions:  8, status: 'Good',          statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trend: true  },
  { name: 'Joshua Adeyemi', id: 'STU-2024-1006', initials: 'JA', color: 'bg-teal-500',   scores: [7.8, 7.5, 7.0, 6.8, 7.2, 7.0], avg: 7.8, sessions:  7, status: 'Good',          statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trend: false },
  { name: 'Daniel Musa',    id: 'STU-2024-1002', initials: 'DM', color: 'bg-blue-500',   scores: [7.2, 6.8, 6.5, 6.1, 6.8, 6.5], avg: 7.2, sessions:  6, status: 'Fair',          statusCls: 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',         trend: true  },
  { name: 'Halima Sani',    id: 'STU-2024-1007', initials: 'HS', color: 'bg-red-400',    scores: [6.5, 6.0, 5.8, 5.5, 6.0, 5.9], avg: 6.5, sessions:  5, status: 'Needs Practice',statusCls: 'bg-orange-50 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400',     trend: true  },
  { name: 'Ibrahim Ali',    id: 'STU-2024-1004', initials: 'IA', color: 'bg-green-500',  scores: [6.1, 5.5, 5.0, 4.8, 5.5, 5.2], avg: 6.1, sessions:  4, status: 'At Risk',       statusCls: 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',                 trend: false },
];

const AT_RISK = STUDENTS.filter(s => s.status === 'At Risk' || s.status === 'Needs Practice');

const RECENT_ACTIVITY = [
  { name: 'Aisha Patel',    initials: 'FB', color: 'bg-pink-500',   action: 'completed Why Medicine? station', time: 'Today, 4:02 PM',    status: 'In Progress',    statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { name: 'Ethan Kim',      initials: 'ED', color: 'bg-teal-500',   action: 'completed Problem Solving station', time: 'Today, 11:30 AM', status: 'Needs Practice', statusCls: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { name: 'Sophie Martin',  initials: 'MB', color: 'bg-violet-500', action: 'completed Ethical Dilemma station', time: 'Yesterday 6:15 PM',status: 'In Progress',    statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { name: 'Sarah John',     initials: 'SJ', color: 'bg-indigo-500', action: 'completed Communication station',   time: 'May 16, 4:00 PM',  status: 'Needs Practice', statusCls: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { name: 'Maryam Okafor',  initials: 'MO', color: 'bg-orange-400', action: 'completed all 6 stations',          time: 'Yesterday 6:15 PM',status: 'Completed',      statusCls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
];

const COACHES = [
  { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-indigo-500', sessions: 62, score: '9.3/10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Dr. Michael Brown', initials: 'MB', color: 'bg-violet-500', sessions: 35, score: '9.3/10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Dr. Emily Davis',   initials: 'ED', color: 'bg-teal-500',   sessions: 27, score: '8.1/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Dr. James Wikson',  initials: 'FB', color: 'bg-pink-500',   sessions: 19, score: '7.8/10', scoreCls: 'text-amber-600 dark:text-amber-400' },
];

const ACTION_ITEMS = [
  { text: 'Schedule extra sessions for Ibrahim Ali – scoring below threshold in 4 stations', urgency: 'high' },
  { text: 'Halima Sani needs Ethical Dilemma coaching — dropped 0.6 pts this week',           urgency: 'high' },
  { text: 'Review Team Work scenario materials — lowest pass rate across cohort (74%)',        urgency: 'medium' },
  { text: 'Recognise Maryam Okafor – first student to complete all stations with 9.3 avg',    urgency: 'info' },
];

const URGENCY_CLS: Record<string, string> = {
  high:   'bg-red-50 dark:bg-red-500/15 border-l-2 border-red-400',
  medium: 'bg-amber-50 dark:bg-amber-500/15 border-l-2 border-amber-400',
  info:   'bg-emerald-50 dark:bg-emerald-500/15 border-l-2 border-emerald-400',
};
const URGENCY_DOT: Record<string, string> = {
  high: 'bg-red-500', medium: 'bg-amber-400', info: 'bg-emerald-500',
};

// ── Donut chart ───────────────────────────────────────────────────────────────
function PerformanceDonut() {
  const segs = [
    { pct: 38, color: '#0891b2' },
    { pct: 30, color: '#10b981' },
    { pct: 20, color: '#f59e0b' },
    { pct: 12, color: '#f87171' },
  ];
  const r = 52, cx = 70, cy = 70, stroke = 18, circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      {segs.map((s, i) => {
        const dash = (s.pct / 100) * circ, gap = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-off * circ / 100}
            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />
        );
        off += s.pct; return el;
      })}
      <text x={cx} y={cx - 7} textAnchor="middle" style={{ fontSize: 18, fontWeight: 700, fill: 'currentColor' }} className="fill-slate-800 dark:fill-white">120</text>
      <text x={cx} y={cx + 11} textAnchor="middle" style={{ fontSize: 9, fill: '#94a3b8' }}>Students</text>
    </svg>
  );
}

// ── Line chart ────────────────────────────────────────────────────────────────
function SessionLineChart() {
  const w = 340, h = 120, p = { t: 10, b: 24, l: 28, r: 10 };
  const iw = w - p.l - p.r, ih = h - p.t - p.b;
  const labels = ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'];
  const avgScore   = [5.2, 6.1, 6.8, 7.4, 8.1];
  const completion = [3.8, 5.0, 6.2, 7.0, 7.8];
  const px = (i: number) => p.l + (i / (labels.length - 1)) * iw;
  const py = (v: number) => p.t + ih - ((v / 10)) * ih;
  const poly = (pts: number[]) => pts.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ minHeight: h }}>
      {[0, 2, 4, 6, 8].map(v => (
        <line key={v} x1={p.l} x2={w - p.r} y1={py(v)} y2={py(v)} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="3 3" />
      ))}
      {[0, 2, 4, 6, 8].map(v => (
        <text key={`y${v}`} x={p.l - 4} y={py(v) + 4} textAnchor="end" style={{ fontSize: 7, fill: '#94a3b8' }}>{v}</text>
      ))}
      {labels.map((l, i) => (
        <text key={l} x={px(i)} y={h - 4} textAnchor="middle" style={{ fontSize: 7, fill: '#94a3b8' }}>{l}</text>
      ))}
      <polyline points={poly(completion)} fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" />
      <polyline points={poly(avgScore)}   fill="none" stroke="#0891b2" strokeWidth={2} />
      {avgScore.map((v, i)    => <circle key={i} cx={px(i)} cy={py(v)} r={3}   fill="#0891b2" />)}
      {completion.map((v, i)  => <circle key={i} cx={px(i)} cy={py(v)} r={2.5} fill="#10b981" />)}
    </svg>
  );
}

// ── Score badge ───────────────────────────────────────────────────────────────
function ScorePill({ v }: { v: number }) {
  const cls = v >= 8.5 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    : v >= 7.5 ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
    : v >= 6.5 ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
    : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
  return <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md ${cls}`}>{v.toFixed(1)}</span>;
}

// ── Mini bar ──────────────────────────────────────────────────────────────────
function MiniBar({ value, color = 'bg-emerald-500' }: { value: number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / 10) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{value}/10</span>
    </div>
  );
}

// ── Pass-rate bar ─────────────────────────────────────────────────────────────
function PassBar({ pct }: { pct: number }) {
  const color = pct >= 88 ? 'bg-emerald-500' : pct >= 78 ? 'bg-blue-500' : pct >= 70 ? 'bg-amber-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-12 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{pct}%</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MMIReportPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Excellent' | 'At Risk'>('All');
  const filteredStudents = activeTab === 'All' ? STUDENTS
    : activeTab === 'Excellent' ? STUDENTS.filter(s => s.status === 'Excellent' || s.status === 'Good')
    : STUDENTS.filter(s => s.status === 'At Risk' || s.status === 'Needs Practice');

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link href="/counselor/analytics"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1">
              <ChevronLeft size={15} /> Back to Analytics
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">MMI Report</h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Full MMI practice insights — performance, station analysis, student progress & counselor action items.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-cyan-300 transition-all">
              May 21 – 26, 2026 <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-cyan-300 transition-all">
              <Filter size={14} /> Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:border-cyan-300 hover:text-cyan-700 transition-all">
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        {/* ── Stat cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CARDS.map((c) => (
            <div key={c.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
                  <c.icon size={15} className={c.iconColor} />
                </div>
                {c.change && (
                  c.positive
                    ? <div className="flex items-center gap-0.5"><ArrowUpRight size={11} className="text-emerald-500" /><span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{c.change}</span></div>
                    : <div className="flex items-center gap-0.5"><TrendingDown size={11} className="text-red-500" /><span className="text-[10px] font-bold text-red-500">{c.change}</span></div>
                )}
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{c.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-tight">{c.label}</p>
              <p className="text-[9px] text-slate-300 dark:text-[#5a5f78] mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main 3-col grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── LEFT + CENTRE (span 2) ──────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Row 1: Overview donut + Session line */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Performance Overview */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance Overview</h3>
                <div className="flex items-center gap-4">
                  <div className="shrink-0"><PerformanceDonut /></div>
                  <div className="space-y-2 flex-1">
                    {[
                      { label: 'Excellent',      score: '8.6/10', color: 'bg-cyan-500',   count: 46 },
                      { label: 'Good',           score: '8.2/10', color: 'bg-emerald-500',count: 36 },
                      { label: 'Fair',           score: '7.9/10', color: 'bg-amber-400',  count: 24 },
                      { label: 'Needs Practice', score: 'Below 5',color: 'bg-red-400',    count: 14 },
                    ].map(item => (
                      <div key={item.label} className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                        <span className="text-xs text-slate-500 dark:text-[#8e92ad] flex-1">{item.label}</span>
                        <span className="text-[10px] text-slate-400 dark:text-[#5a5f78]">{item.count}</span>
                        <span className="text-xs font-semibold text-slate-800 dark:text-white">{item.score}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/6">
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Cohort Average <span className="font-bold text-slate-700 dark:text-slate-200">7.9/10</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Performance Over Time */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Session Performance Over Time</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5"><div className="w-5 h-0.5 bg-cyan-500 rounded" /><span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">Avg Score</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-5 border-t border-dashed border-emerald-500" /><span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">Completion Rate</span></div>
                </div>
                <div className="w-full overflow-hidden"><SessionLineChart /></div>
              </div>
            </div>

            {/* Row 2: Performance by Station */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance by Practice Station</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[560px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      {['Station', 'Average Score', 'Pass Rate', 'Difficulty', 'Completed', 'Improvement'].map(h => (
                        <th key={h} className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-4 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {PRACTICE_STATIONS.map((s) => (
                      <tr key={s.name} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{s.icon}</span>
                            <span className="font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{s.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4"><MiniBar value={s.avgScore} color={s.barColor} /></td>
                        <td className="py-3 pr-4"><PassBar pct={s.passRate} /></td>
                        <td className="py-3 pr-4">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${DIFF_BADGE[s.difficulty]}`}>{s.difficulty}</span>
                        </td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{s.completed}</td>
                        <td className="py-3 text-right">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{s.improvement}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 3: Student Progress Tracker */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Student Progress Tracker</h3>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/6 rounded-xl p-1 w-fit">
                  {(['All', 'Excellent', 'At Risk'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        activeTab === tab ? 'bg-white dark:bg-[#1e2335] text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[680px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      <th className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-3">Student</th>
                      {['Why Med', 'Prob Solv', 'Pressure', 'Ethics', 'Comm', 'Teamwork'].map(h => (
                        <th key={h} className="pb-2.5 text-center text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] px-1">{h}</th>
                      ))}
                      <th className="pb-2.5 text-center text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] px-1">Avg</th>
                      <th className="pb-2.5 text-center text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] px-1">Sessions</th>
                      <th className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pl-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{s.initials}</div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-white truncate whitespace-nowrap">{s.name}</p>
                              <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{s.id}</p>
                            </div>
                          </div>
                        </td>
                        {s.scores.map((sc, i) => <td key={i} className="py-3 text-center px-1"><ScorePill v={sc} /></td>)}
                        <td className="py-3 text-center px-1">
                          <span className="text-xs font-bold text-slate-800 dark:text-white">{s.avg}</span>
                        </td>
                        <td className="py-3 text-center px-1 text-slate-500 dark:text-slate-400 text-xs">{s.sessions}/10</td>
                        <td className="py-3 pl-2">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${s.statusCls}`}>{s.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 4: At-Risk Students */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-red-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Students Requiring Immediate Attention</h3>
                <span className="ml-auto text-[10px] font-bold bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">{AT_RISK.length} students</span>
              </div>
              <div className="space-y-3">
                {AT_RISK.map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.id} · {s.sessions}/10 stations · Avg {s.avg}/10</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.statusCls}`}>{s.status}</span>
                      <Link href="/counselor/assign-practice" className="text-[9px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">Assign Session →</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 5: Recent Activity */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                <button className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{a.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate"><span className="font-bold">{a.name}</span> {a.action}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{a.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${a.statusCls}`}>{a.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ───────────────────────────── */}
          <div className="space-y-5">

            {/* Counselor Action Items */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-cyan-600" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Counselor Action Items</h3>
              </div>
              <div className="space-y-2.5">
                {ACTION_ITEMS.map((a, i) => (
                  <div key={i} className={`rounded-lg px-3 py-2.5 ${URGENCY_CLS[a.urgency]}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${URGENCY_DOT[a.urgency]}`} />
                      <p className="text-[10px] text-slate-600 dark:text-[#8e92ad] leading-relaxed">{a.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pass Rate by Station */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Pass Rate by Station</h3>
              <div className="space-y-3">
                {PRACTICE_STATIONS.map((s) => (
                  <div key={s.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-[#8e92ad] truncate pr-2">{s.name}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white shrink-0">{s.passRate}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${s.barColor}`} style={{ width: `${s.passRate}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach Performance */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Coach Performance</h3>
              <div className="space-y-3">
                {COACHES.map((c, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-300 dark:text-[#5a5f78] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-full ${c.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{c.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{c.sessions} sessions</p>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${c.scoreCls}`}>{c.score}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                View All Reviewers
              </button>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-cyan-200" />
                <span className="text-xs font-bold text-cyan-100">AI Insight</span>
              </div>
              <p className="text-xs text-cyan-100 leading-relaxed mb-3">
                Students who practised the Ethical Dilemma station 3+ times this month improved their overall MMI score by <span className="font-bold text-white">+0.9 pts</span> on average.
              </p>
              <Link href="/counselor/mmi-coaching-analytics" className="flex items-center gap-1 text-[10px] font-semibold text-white hover:text-cyan-200 transition-colors">
                View Full Analytics <ArrowUpRight size={11} />
              </Link>
            </div>

            {/* Quick stats */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle2, label: 'All Stations Completed',  value: '14 students', color: 'text-emerald-500' },
                  { icon: Zap,          label: 'Fastest Improver',         value: 'Amina Yusuf',  color: 'text-amber-500' },
                  { icon: BookOpen,     label: 'Hardest Station',          value: 'Team Work',    color: 'text-red-400'   },
                  { icon: BarChart2,    label: 'Week-on-Week Growth',      value: '+8.4%',        color: 'text-cyan-500'  },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon size={13} className={s.color} />
                      <span className="text-xs text-slate-500 dark:text-[#8e92ad]">{s.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Related Pages</h3>
              <div className="space-y-1">
                {[
                  { label: 'Assign Practice Session', href: '/counselor/assign-practice', icon: Zap },
                  { label: 'MMI Coaching Overview',   href: '/counselor/mmi-coaching',    icon: Activity },
                  { label: 'Full Analytics',          href: '/counselor/mmi-coaching-analytics', icon: BarChart2 },
                  { label: 'View Calendar',           href: '/counselor/view-calendar',   icon: CheckCircle2 },
                ].map((a) => (
                  <Link key={a.label} href={a.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group">
                    <a.icon size={13} className="shrink-0" />
                    <span className="text-xs font-medium">{a.label}</span>
                    <ChevronRight size={11} className="ml-auto text-slate-300 dark:text-[#5a5f78] group-hover:text-cyan-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer banner ───────────────────────────────── */}
        <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <p className="text-xs text-cyan-700 dark:text-cyan-300">
            Analytics data is updated in real-time. Last Updated May 24, 2025 at 2:00 PM
          </p>
        </div>

      </div>
    </div>
  );
}
