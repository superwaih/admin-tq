'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Filter, Download,
  Users, TrendingUp, TrendingDown, Calendar, BookOpen,
  Activity, Star, ArrowUpRight, Sparkles, BarChart2,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label: 'Total Students',
    value: '120',
    change: '+12%',
    sub: 'vs Apr 1 – Apr 30',
    icon: Users,
    iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    positive: true,
  },
  {
    label: 'Average Engagement Rate',
    value: '98',
    change: '+18%',
    sub: 'vs Apr 1 – Apr 30',
    icon: Activity,
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    iconColor: 'text-blue-600 dark:text-blue-400',
    positive: true,
  },
  {
    label: 'Season Attendance',
    value: '8.2/10',
    change: '+0.6',
    sub: 'vs Apr 1 – Apr 30',
    icon: Calendar,
    iconBg: 'bg-violet-50 dark:bg-violet-500/15',
    iconColor: 'text-violet-600 dark:text-violet-400',
    positive: true,
  },
  {
    label: 'Most Active Department',
    value: 'Medicine',
    change: '+15%',
    sub: 'vs Apr 1 – Apr 30',
    icon: BookOpen,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    positive: true,
  },
  {
    label: 'Inactive Students',
    value: '5',
    change: '-2%',
    sub: 'vs Apr 1 – Apr 30',
    icon: Users,
    iconBg: 'bg-red-50 dark:bg-red-500/15',
    iconColor: 'text-red-500 dark:text-red-400',
    positive: false,
  },
  {
    label: 'Engagement Growth',
    value: '+14%',
    change: '+22%',
    sub: 'vs Apr 1 – Apr 30',
    icon: TrendingUp,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-600 dark:text-amber-400',
    positive: true,
  },
];

const STUDENTS = [
  { name: 'Daniel Musa',   initials: 'DM', color: 'bg-blue-500',   id: 'STU-2024-1002', dept: 'Medicine',       attendance: 8.6, participation: 8.6, essayActivity: 8.6, score: 8.6, status: 'Highly Engaged',     statusCls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trendUp: true  },
  { name: 'Fatima Bello',  initials: 'FB', color: 'bg-pink-500',   id: 'STU-2024-1003', dept: 'Engineering',    attendance: 8.2, participation: 8.2, essayActivity: 8.2, score: 8.2, status: 'Highly Engaged',     statusCls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trendUp: true  },
  { name: 'Ibrahim Ali',   initials: 'IA', color: 'bg-green-500',  id: 'STU-2024-1004', dept: 'Medicine\nBusiness', attendance: 7.9, participation: 7.9, essayActivity: 7.1, score: 7.9, status: 'Moderately Engaged', statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trendUp: true  },
  { name: 'Halima Sani',   initials: 'HS', color: 'bg-red-400',    id: 'STU-2024-1007', dept: 'Computer Science', attendance: 7.6, participation: 7.6, essayActivity: 7.6, score: 7.5, status: 'Moderately Engaged', statusCls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trendUp: false },
];

const ENGAGEMENT_SEGMENTS = [
  { label: 'High Engagement',   value: '45 (37%)', color: '#10b981' },
  { label: 'Medium Engagement', value: '50 (41%)', color: '#0284c7' },
  { label: 'Low Engagement',    value: '20 (17%)', color: '#f59e0b' },
  { label: 'Inactive',          value: '5 (4%)',   color: '#94a3b8' },
];

const TOP_PERFORMERS = [
  { name: 'Maryam Okafor',  initials: 'MO', color: 'bg-orange-400', score: '9.5/10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Fatima Bello',   initials: 'FB', color: 'bg-pink-500',   score: '9.2/10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Samuel Johnson', initials: 'SJ', color: 'bg-indigo-500', score: '8.9/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Amina Yusuf',    initials: 'AY', color: 'bg-yellow-400', score: '8.7/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Joshua Adeyemi', initials: 'JA', color: 'bg-teal-500',   score: '8.5/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
];

const DEPARTMENT_PERF = [
  { name: 'Medicine',        score: 8.6, barW: 86, color: 'bg-emerald-500' },
  { name: 'Engineering',     score: 8.2, barW: 82, color: 'bg-blue-500'    },
  { name: 'Business',        score: 7.9, barW: 79, color: 'bg-violet-500'  },
  { name: 'Computer Science',score: 7.6, barW: 76, color: 'bg-amber-400'   },
  { name: 'Law',             score: 7.1, barW: 71, color: 'bg-red-400'     },
];

const RECENT_FEEDBACK = [
  { name: 'Amina Yusuf',   initials: 'AY', color: 'bg-yellow-400', date: 'May 31, 2025, 10:30 AM', type: 'Session',      typeCls: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400',    note: 'Essay Review Feedback' },
  { name: 'Daniel Musa',   initials: 'DM', color: 'bg-blue-500',   date: '9:15 AM',                type: 'MMI Practice', typeCls: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400', note: 'MMI Practice Session' },
  { name: 'Fatima Bello',  initials: 'FB', color: 'bg-pink-500',   date: 'Yesterday',              type: 'Feedback',     typeCls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400', note: 'Feedback' },
];

// ── Multi-line chart ──────────────────────────────────────────────────────────
function PerformanceChart() {
  const w = 480, h = 120, pad = { t: 10, b: 24, l: 28, r: 8 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const labels = ['May 18', 'May 19', 'May 20', 'May 22', 'May 30'];
  const series = [
    { pts: [6, 6.5, 7, 6.8, 7.5], color: '#0891b2', dash: '' },
    { pts: [5, 5.8, 6.2, 6, 7.2], color: '#7c3aed', dash: '4 2' },
    { pts: [4.5, 5, 5.5, 5.2, 6],  color: '#f59e0b', dash: '2 3' },
    { pts: [3.8, 4.2, 4.8, 4.5, 5.5], color: '#10b981', dash: '5 2' },
  ];
  const yMin = 0, yMax = 10;
  const px = (i: number) => pad.l + (i / (labels.length - 1)) * iw;
  const py = (v: number) => pad.t + ih - ((v - yMin) / (yMax - yMin)) * ih;
  const yTicks = [0, 2, 4, 6, 8];
  const poly = (pts: number[]) => pts.map((v, i) => `${px(i)},${py(v)}`).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ minHeight: h }}>
      {yTicks.map(v => (
        <line key={v} x1={pad.l} x2={w - pad.r} y1={py(v)} y2={py(v)} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="3 3" />
      ))}
      {yTicks.map(v => (
        <text key={`yt-${v}`} x={pad.l - 4} y={py(v) + 4} textAnchor="end" style={{ fontSize: 7, fill: '#94a3b8' }}>{v}</text>
      ))}
      {labels.map((l, i) => (
        <text key={l} x={px(i)} y={h - 4} textAnchor="middle" style={{ fontSize: 7, fill: '#94a3b8' }}>{l}</text>
      ))}
      {series.map((s, si) => (
        <polyline key={si} points={poly(s.pts)} fill="none" stroke={s.color} strokeWidth={1.8} strokeDasharray={s.dash} />
      ))}
      {series[0].pts.map((v, i) => (
        <circle key={i} cx={px(i)} cy={py(v)} r={2.5} fill="#0891b2" />
      ))}
    </svg>
  );
}

// ── Donut chart ───────────────────────────────────────────────────────────────
function EngagementDonut() {
  const segs = [
    { pct: 37, color: '#10b981' },
    { pct: 41, color: '#0284c7' },
    { pct: 17, color: '#f59e0b' },
    { pct: 4,  color: '#94a3b8' },
  ];
  const r = 50, cx = 60, cy = 60, stroke = 16;
  const circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120">
      {segs.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={s.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-off * circ / 100}
            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"
          />
        );
        off += s.pct;
        return el;
      })}
      <text x={cx} y={cy + 5} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: '#0f172a' }}>120</text>
    </svg>
  );
}

// ── Sparkline bar ─────────────────────────────────────────────────────────────
function MiniBar({ value, max = 10, color = 'bg-emerald-500' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{value}/10</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function StudentEngagementReportPage() {
  const [viewMode, setViewMode] = useState<'Monthly' | 'Weekly'>('Monthly');
  const [page] = useState(1);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link
              href="/counselor/analytics"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
            >
              <ChevronLeft size={15} /> Back to Analytics
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Student Engagement Report
            </h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Detailed insights into student participation and engagement trends.
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
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              <Download size={14} /> Download PDF
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
                {c.positive ? (
                  <div className="flex items-center gap-0.5">
                    <ArrowUpRight size={11} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{c.change}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-0.5">
                    <TrendingDown size={11} className="text-red-500" />
                    <span className="text-[10px] font-bold text-red-500 dark:text-red-400">{c.change}</span>
                  </div>
                )}
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{c.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-tight">{c.label}</p>
              <p className="text-[9px] text-slate-300 dark:text-[#5a5f78] mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main content grid ───────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* Left + centre (span 2) */}
          <div className="xl:col-span-2 space-y-5">

            {/* Performance Over Time + Engagement donut */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

              {/* Performance Over Time */}
              <div className="md:col-span-3 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Student Performance Over Time</h3>
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/6 rounded-lg p-0.5">
                    {(['Monthly', 'Weekly'] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setViewMode(m)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition-all ${
                          viewMode === m
                            ? 'bg-white dark:bg-[#1e2335] text-slate-800 dark:text-white shadow-sm'
                            : 'text-slate-400 dark:text-[#8e92ad] hover:text-slate-600'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
                  {[
                    { label: 'Engagement Rate',        color: 'bg-cyan-500' },
                    { label: 'Sessions Participation', color: 'bg-violet-500', dash: true },
                    { label: 'Sessions Participation', color: 'bg-amber-400', dash: true },
                    { label: 'Essay Activity',         color: 'bg-emerald-500', dash: true },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className={`w-4 h-0.5 ${l.color} rounded`} />
                      <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{l.label}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full overflow-hidden">
                  <PerformanceChart />
                </div>
              </div>

              {/* Engagement donut */}
              <div className="md:col-span-2 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Student Engagement</h3>
                <div className="flex flex-col items-center gap-3">
                  <EngagementDonut />
                  <div className="w-full space-y-2">
                    {ENGAGEMENT_SEGMENTS.map((s) => (
                      <div key={s.label} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                          <span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">{s.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Students Engagement Details table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Students Engagement Details</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      {['Students', 'Departments', 'Attendance', 'Participation', 'Essay Activity', 'Engagement Score', 'Status', 'Trend'].map(h => (
                        <th key={h} className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {STUDENTS.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                              {s.initials}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 dark:text-white whitespace-nowrap">{s.name}</p>
                              <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">ID: {s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <span className="text-slate-500 dark:text-[#8e92ad] whitespace-nowrap">{s.dept.split('\n')[0]}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <MiniBar value={s.attendance} color="bg-emerald-500" />
                        </td>
                        <td className="py-3 pr-3">
                          <MiniBar value={s.participation} color="bg-blue-500" />
                        </td>
                        <td className="py-3 pr-3">
                          <MiniBar value={s.essayActivity} color="bg-emerald-500" />
                        </td>
                        <td className="py-3 pr-3">
                          <span className="font-bold text-slate-800 dark:text-white">{s.score}/10</span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${s.statusCls}`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3">
                          {s.trendUp
                            ? <TrendingUp size={14} className="text-emerald-500" />
                            : <TrendingDown size={14} className="text-red-400" />
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/6">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to 8 of 120 essays</p>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/8 flex items-center justify-center text-slate-400 hover:border-cyan-400 transition-all">
                    <ChevronLeft size={13} />
                  </button>
                  {[1, 2, 3, '...', 15].map((p, i) => (
                    <button
                      key={i}
                      className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${
                        p === page
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'border border-gray-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:border-cyan-400'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/8 flex items-center justify-center text-slate-400 hover:border-cyan-400 transition-all">
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Feedback row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {RECENT_FEEDBACK.map((f, i) => (
                <div key={i} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-full ${f.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {f.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{f.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{f.date}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-[#8e92ad] mb-2 truncate">{f.note}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${f.typeCls}`}>{f.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Top Performing Students */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performing Students</h3>
                <Link href="/counselor/essay-ranking" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {TOP_PERFORMERS.map((p, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300 dark:text-[#5a5f78] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-full ${p.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {p.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{p.name}</p>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${p.scoreCls}`}>{p.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-violet-200" />
                <span className="text-xs font-bold text-violet-100">AI Insight</span>
              </div>
              <p className="text-xs text-violet-100 leading-relaxed mb-3">
                Students who attended 3+ sessions this month showed significantly higher essay scores.
              </p>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-white hover:text-violet-200 transition-colors">
                View Detailed Analysis <ArrowUpRight size={11} />
              </button>
            </div>

            {/* Department Performance */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Department Performance</h3>
                <Link href="/counselor/analytics" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {DEPARTMENT_PERF.map((d) => (
                  <div key={d.name} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-[#8e92ad]">{d.name}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{d.score}/10</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.barW}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Schedule Session',      href: '/counselor/schedule-session', icon: Calendar },
                  { label: 'View MMI Analytics',    href: '/counselor/mmi-coaching-analytics', icon: BarChart2 },
                  { label: 'Essay Rankings',         href: '/counselor/essay-ranking', icon: Star },
                ].map((a) => (
                  <Link
                    key={a.label}
                    href={a.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group"
                  >
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
