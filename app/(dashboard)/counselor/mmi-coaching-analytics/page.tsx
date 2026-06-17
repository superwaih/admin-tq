'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, Filter, Download,
  TrendingUp, Users, Star, Activity, CheckCircle2,
  BarChart2, Clock, ArrowUpRight,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label: 'Total Students',
    value: '9,810',
    sub: '8.2/10',
    change: '+4%',
    icon: Users,
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    positive: true,
  },
  {
    label: 'Average Score',
    value: '8.4/10',
    sub: null,
    change: '+4%',
    icon: Star,
    iconBg: 'bg-violet-50 dark:bg-violet-500/15',
    iconColor: 'text-violet-600 dark:text-violet-400',
    positive: true,
  },
  {
    label: 'Improvement Rate',
    value: '+12%',
    sub: null,
    change: 'vs last month',
    icon: TrendingUp,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    positive: true,
    noArrow: true,
  },
  {
    label: 'Practice Session',
    value: '62',
    sub: null,
    change: '+4%',
    icon: Activity,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
    positive: true,
  },
];

const PRACTICE_STATIONS = [
  { name: 'Why Medicine?',      score: 8.6, completed: '8.6/10', improvement: '+16%', barColor: 'bg-emerald-500', barW: 88 },
  { name: 'Problem Solving',    score: 8.2, completed: '8.2/10', improvement: '+15%', barColor: 'bg-blue-500',    barW: 82 },
  { name: 'Handling Pressure',  score: 7.9, completed: '7.1/10', improvement: '+14%', barColor: 'bg-red-400',     barW: 72 },
  { name: 'Ethical Dilemma',    score: 7.6, completed: '7.5/10', improvement: '+12%', barColor: 'bg-amber-400',   barW: 68 },
  { name: 'Communication',      score: 7.6, completed: '7.5/10', improvement: '+12%', barColor: 'bg-slate-700 dark:bg-slate-300', barW: 68 },
  { name: 'Team work scenario', score: 7.6, completed: '7.5/10', improvement: '+12%', barColor: 'bg-orange-400',  barW: 64 },
];

const RECENT_ACTIVITY = [
  { name: 'Aisha Patel',    initials: 'FB', color: 'bg-pink-500',   action: 'completed a practice session', time: 'Today, 4:02 PM',    status: 'In Progress',    statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { name: 'Ethan Kim',      initials: 'ED', color: 'bg-teal-500',   action: 'completed a practice session', time: 'Today, 11:30 AM',   status: 'Needs Practice', statusCls: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { name: 'Sophie Martin',  initials: 'MB', color: 'bg-violet-500', action: 'completed a practice session', time: 'Yesterday, 6:15 PM', status: 'In Progress',    statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { name: 'Sarah John',     initials: 'SJ', color: 'bg-indigo-500', action: 'completed a practice session', time: 'May 16, 2025 4: PM', status: 'Needs Practice', statusCls: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  { name: 'Sophie Martin',  initials: 'MB', color: 'bg-violet-500', action: 'completed a practice session', time: 'Yesterday, 6:15 PM', status: 'Completed',      statusCls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400' },
];

const REVIEWERS = [
  { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-indigo-500', essays: 62, score: '9.3/10', scoreColor: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Dr. Michael Brown', initials: 'MB', color: 'bg-violet-500', essays: 35, score: '9.3/10', scoreColor: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Dr. Emily Davis',   initials: 'ED', color: 'bg-teal-500',   essays: 27, score: '8.1/10', scoreColor: 'text-blue-600 dark:text-blue-400' },
  { name: 'Dr. James Wikson',  initials: 'FB', color: 'bg-pink-500',   essays: 19, score: '7.8/10', scoreColor: 'text-amber-600 dark:text-amber-400' },
];

const TOP_PERFORMERS = [
  { name: 'Daniel Musa',    initials: 'DM', color: 'bg-blue-500',   id: 'STU-2024-1002', score: '8.5 /10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Fatima Bello',   initials: 'FB', color: 'bg-pink-500',   id: 'STU-2024-1003', score: '8.1 /10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Ibrahim Ali',    initials: 'IA', color: 'bg-green-500',  id: 'STU-2024-1004', score: '7.9 /10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Halima Sani',    initials: 'HS', color: 'bg-red-400',    id: 'STU-2024-1007', score: '7.2 /10', scoreCls: 'text-amber-600 dark:text-amber-400' },
];

// ── Donut chart (SVG) ────────────────────────────────────────────────────────
function DonutChart() {
  const segments = [
    { pct: 38, color: '#0891b2' },  // Excellent – cyan
    { pct: 30, color: '#10b981' },  // Good      – emerald
    { pct: 20, color: '#f59e0b' },  // Fair      – amber
    { pct: 12, color: '#f87171' },  // Needs Practice – red
  ];
  const r = 52, cx = 70, cy = 70, stroke = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circumference;
        const gap  = circumference - dash;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circumference / 100}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
        offset += s.pct;
        return el;
      })}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-slate-800 dark:fill-white" style={{ fontSize: 18, fontWeight: 700, fill: 'currentColor' }}>120</text>
      <text x={cx} y={cy + 10} textAnchor="middle" style={{ fontSize: 9, fill: '#94a3b8' }}>Students</text>
    </svg>
  );
}

// ── Line chart (SVG) ─────────────────────────────────────────────────────────
function LineChart() {
  const w = 320, h = 110, pad = { t: 10, b: 24, l: 28, r: 10 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;

  const labels = ['May 1', 'May 8', 'May 15', 'May 22', 'May 29'];
  const avgScore    = [5.2, 6.1, 6.8, 7.4, 8.1];
  const completion  = [3.8, 5.0, 6.2, 7.0, 7.8];
  const yMin = 0, yMax = 10;

  const px = (i: number) => pad.l + (i / (labels.length - 1)) * iw;
  const py = (v: number) => pad.t + ih - ((v - yMin) / (yMax - yMin)) * ih;

  const polyline = (pts: number[]) =>
    pts.map((v, i) => `${px(i)},${py(v)}`).join(' ');

  const yTicks = [0, 2, 4, 6, 8];

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ minHeight: h }}>
      {/* grid */}
      {yTicks.map(v => (
        <line key={v} x1={pad.l} x2={w - pad.r} y1={py(v)} y2={py(v)} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="3 3" />
      ))}
      {yTicks.map(v => (
        <text key={`yt-${v}`} x={pad.l - 4} y={py(v) + 4} textAnchor="end" style={{ fontSize: 7, fill: '#94a3b8' }}>{v}</text>
      ))}
      {labels.map((l, i) => (
        <text key={l} x={px(i)} y={h - 4} textAnchor="middle" style={{ fontSize: 7, fill: '#94a3b8' }}>{l}</text>
      ))}
      {/* completion line */}
      <polyline points={polyline(completion)} fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" />
      {/* avg score line */}
      <polyline points={polyline(avgScore)} fill="none" stroke="#0891b2" strokeWidth={2} />
      {/* dots */}
      {avgScore.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={3} fill="#0891b2" />
      ))}
      {completion.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={2.5} fill="#10b981" />
      ))}
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function MMICoachingAnalyticsPage() {
  const [dateRange] = useState('May 21 – 26, 2026');

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link
              href="/counselor/mmi-coaching"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
            >
              <ChevronLeft size={15} /> Back to MMI Coaching
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              MMI Coaching Analytics
            </h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Comprehensive insights and performance analytics for all MMI coaching activities.
            </p>
          </div>

          {/* controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all">
              {dateRange} <ChevronDown size={14} className="text-slate-400" />
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all">
              <Filter size={14} /> Filters
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:text-cyan-700 dark:hover:text-cyan-400 transition-all">
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        {/* ── Stat cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((c) => (
            <div key={c.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] font-medium">{c.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{c.value}</p>
                </div>
                <div className={`w-9 h-9 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
                  <c.icon size={17} className={c.iconColor} />
                </div>
              </div>
              {c.noArrow ? (
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{c.change}</p>
              ) : (
                <div className="flex items-center gap-1.5">
                  <ArrowUpRight size={12} className="text-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">{c.change}</span>
                  <span className="text-xs text-slate-400 dark:text-[#8e92ad]">vs last month</span>
                </div>
              )}
              {c.sub && (
                <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">{c.sub}</p>
              )}
            </div>
          ))}
        </div>

        {/* ── Main content grid ───────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Left column (spans 2) */}
          <div className="xl:col-span-2 space-y-5">

            {/* Row 1: Performance Overview + Session Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Performance Overview */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance Overview</h3>
                <div className="flex items-center gap-5">
                  <div className="shrink-0"><DonutChart /></div>
                  <div className="space-y-2 flex-1">
                    {[
                      { label: 'Excellent',      score: '8.6/10', color: 'bg-cyan-500' },
                      { label: 'Good',           score: '8.2/10', color: 'bg-emerald-500' },
                      { label: 'Fair',           score: '7.9/10', color: 'bg-amber-400' },
                      { label: 'Needs Practice', score: 'Below 5', color: 'bg-red-400' },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${item.color}`} />
                          <span className="text-xs text-slate-600 dark:text-[#8e92ad]">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-white">{item.score}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-gray-100 dark:border-white/6">
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Average Score <span className="font-bold text-slate-700 dark:text-slate-200">7.9/10</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Session Performance Over Time */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Session Performance Over Time</h3>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-cyan-500 rounded" />
                    <span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">Avg Score</span>
                    <ArrowUpRight size={10} className="text-slate-400" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-emerald-500 rounded" style={{ borderTop: '1.5px dashed' }} />
                    <span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">Completion Rate</span>
                    <ArrowUpRight size={10} className="text-slate-400" />
                  </div>
                </div>
                <div className="w-full overflow-hidden">
                  <LineChart />
                </div>
              </div>
            </div>

            {/* Row 2: Performance by Practice Station */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance by Practice Station</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[480px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      <th className="pb-2.5 text-left text-[11px] font-semibold text-slate-400 dark:text-[#8e92ad] w-[40%]">Station</th>
                      <th className="pb-2.5 text-left text-[11px] font-semibold text-slate-400 dark:text-[#8e92ad]">Average Score</th>
                      <th className="pb-2.5 text-center text-[11px] font-semibold text-slate-400 dark:text-[#8e92ad]">COMPLETED</th>
                      <th className="pb-2.5 text-right text-[11px] font-semibold text-slate-400 dark:text-[#8e92ad]">Improvements</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {PRACTICE_STATIONS.map((s) => (
                      <tr key={s.name} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-3">
                          <span className="font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden w-20">
                              <div className={`h-full rounded-full ${s.barColor}`} style={{ width: `${s.barW}%` }} />
                            </div>
                            <span className="font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{s.score}/10</span>
                          </div>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-medium text-slate-600 dark:text-slate-300">{s.completed}</span>
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{s.improvement}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Row 3: Recent Activity */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                <button className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</button>
              </div>
              <div className="space-y-3">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${a.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {a.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                        <span className="font-bold">{a.name}</span> {a.action}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{a.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${a.statusCls}`}>
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-5">

            {/* Reviewers Performance */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Reviewers Performance</h3>
              <div className="space-y-3">
                {REVIEWERS.map((r, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 dark:text-[#8e92ad] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-full ${r.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{r.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.essays} essays · <span className={`font-semibold ${r.scoreColor}`}>{r.score}</span></p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                View All Reviewers
              </button>
            </div>

            {/* Top Performance */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performance</h3>
                <Link href="/counselor/essay-ranking" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {TOP_PERFORMERS.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${p.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{p.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">ID: {p.id} · <span className={`font-bold ${p.scoreCls}`}>{p.score}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { icon: CheckCircle2, label: 'Sessions Completed', value: '48', color: 'text-emerald-500' },
                  { icon: Clock,        label: 'Avg Session Length', value: '52 min', color: 'text-cyan-500' },
                  { icon: BarChart2,    label: 'Stations Covered',   value: '6 / 6',  color: 'text-violet-500' },
                  { icon: Star,         label: 'Top Score This Week', value: '9.3/10', color: 'text-amber-500' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon size={14} className={s.color} />
                      <span className="text-xs text-slate-500 dark:text-[#8e92ad]">{s.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{s.value}</span>
                  </div>
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
