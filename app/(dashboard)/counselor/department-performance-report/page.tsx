'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Filter, Download,
  Users, TrendingUp, TrendingDown, ArrowUpRight, Sparkles,
  BookOpen, Activity, BarChart2, Search,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { label: 'Total Departments',         value: '8',     change: '+15%', sub: 'vs Apr 1 – Apr 30', icon: BookOpen,   iconBg: 'bg-violet-50 dark:bg-violet-500/15', iconColor: 'text-violet-600 dark:text-violet-400', positive: true  },
  { label: 'Total Students',            value: '120',   change: '+12%', sub: 'vs Apr 1 – Apr 30', icon: Users,      iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',     iconColor: 'text-cyan-600 dark:text-cyan-400',     positive: true  },
  { label: 'Average Engagement Rate',   value: '98',    change: '+18%', sub: 'vs Apr 1 – Apr 30', icon: Activity,   iconBg: 'bg-blue-50 dark:bg-blue-500/15',     iconColor: 'text-blue-600 dark:text-blue-400',     positive: true  },
  { label: 'Average Performance Score', value: '98',    change: '+18%', sub: 'vs Apr 1 – Apr 30', icon: BarChart2,  iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',iconColor: 'text-emerald-600 dark:text-emerald-400',positive: true  },
  { label: 'Inactive Students',         value: '5',     change: '-2%',  sub: 'vs Apr 1 – Apr 30', icon: Users,      iconBg: 'bg-red-50 dark:bg-red-500/15',       iconColor: 'text-red-500 dark:text-red-400',       positive: false },
  { label: 'Improvement Rate',          value: '+14%',  change: '+22%', sub: 'vs Apr 1 – Apr 30', icon: TrendingUp, iconBg: 'bg-amber-50 dark:bg-amber-500/15',   iconColor: 'text-amber-600 dark:text-amber-400',   positive: true  },
];

// Bar chart data: each item = one bar group
const BAR_DATA = [
  { dept: 'Medicine',    pct: 55, avg: 7.2 },
  { dept: 'Engineering', pct: 45, avg: 6.8 },
  { dept: 'Medicine',    pct: 50, avg: 7.5 },
  { dept: 'Law',         pct: 30, avg: 6.2 },
  { dept: 'Business',    pct: 96, avg: 8.1 },
  { dept: 'Business',    pct: 100,avg: 8.6 },
  { dept: 'Law',         pct: 50, avg: 7.0 },
  { dept: 'Medicine',    pct: 45, avg: 6.9 },
  { dept: 'Law',         pct: 55, avg: 7.4 },
];

const DIST_SEGMENTS = [
  { label: 'Medicine',        value: '45 (37%)', pct: 37, color: '#10b981' },
  { label: 'Engineering',     value: '50 (41%)', pct: 41, color: '#0284c7' },
  { label: 'Business',        value: '20 (17%)', pct: 17, color: '#f59e0b' },
  { label: 'Computer Science',value: '5 (4%)',   pct: 4,  color: '#8b5cf6' },
  { label: 'Law',             value: '20 (17%)', pct: 17, color: '#f87171' },
  { label: 'Biology',         value: '5 (4%)',   pct: 4,  color: '#34d399' },
  { label: 'Psychology',      value: '50 (41%)', pct: 41, color: '#fb923c' },
  { label: 'Nursing',         value: '5 (4%)',   pct: 4,  color: '#a78bfa' },
];

type StatusKey = 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';

const DEPT_ROWS: {
  name: string;
  students: number;
  engScore: number;
  perfScore: number;
  sessions: number;
  improvement: string;
  topActivity: string;
  topActivityCls: string;
  status: StatusKey;
}[] = [
  { name: 'Medicine',        students: 34, engScore: 8.6, perfScore: 8.6, sessions: 34, improvement: '+18%', topActivity: 'MMI Practice',       topActivityCls: 'text-cyan-600 dark:text-cyan-400',   status: 'Excellent'         },
  { name: 'Engineering',     students: 21, engScore: 8.2, perfScore: 8.2, sessions: 21, improvement: '+14%', topActivity: 'MMI Practice',       topActivityCls: 'text-cyan-600 dark:text-cyan-400',   status: 'Good'              },
  { name: 'Medicine',        students: 50, engScore: 7.9, perfScore: 7.9, sessions: 50, improvement: '+12%', topActivity: 'Session Attendance', topActivityCls: 'text-violet-600 dark:text-violet-400',status: 'Average'           },
  { name: 'Business',        students: 18, engScore: 7.6, perfScore: 7.6, sessions: 18, improvement: '+11%', topActivity: 'Essay Review',       topActivityCls: 'text-emerald-600 dark:text-emerald-400',status: 'Needs Improvement'},
  { name: 'Computer Science',students: 15, engScore: 7.4, perfScore: 7.3, sessions: 15, improvement: '+10%', topActivity: 'MMI Practice',       topActivityCls: 'text-cyan-600 dark:text-cyan-400',   status: 'Average'           },
];

const STATUS_CLS: Record<StatusKey, string> = {
  'Excellent':         'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  'Good':              'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  'Average':           'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'Needs Improvement': 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',
};

const TOP_DEPTS = [
  { name: 'Medicine',        score: '9.5/10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Engineering',     score: '9.2/10', scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Law',             score: '8.9/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Business',        score: '8.7/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Computer Science',score: '8.5/10', scoreCls: 'text-blue-600 dark:text-blue-400' },
];

const DEPT_IMPROVEMENT = [
  { name: 'Medicine',        change: '+16%', cls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Engineering',     change: '+15%', cls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Law',             change: '+14%', cls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Business',        change: '+12%', cls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Computer Science',change: '+12%', cls: 'text-blue-600 dark:text-blue-400' },
];

// ── Donut chart ───────────────────────────────────────────────────────────────
function DistributionDonut() {
  const allColors = DIST_SEGMENTS.map(s => s.color);
  const allPcts   = DIST_SEGMENTS.map(s => s.pct);
  const total     = allPcts.reduce((a, b) => a + b, 0);
  const r = 52, cx = 65, cy = 65, stroke = 16;
  const circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={130} height={130} viewBox="0 0 130 130">
      {DIST_SEGMENTS.map((s, i) => {
        const dash = (s.pct / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r}
            fill="none" stroke={allColors[i]} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-off * circ / total}
            transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"
          />
        );
        off += s.pct;
        return el;
      })}
      <text x={cx} y={cx - 7} textAnchor="middle" style={{ fontSize: 18, fontWeight: 700, fill: '#0f172a' }}>120</text>
      <text x={cx} y={cx + 11} textAnchor="middle" style={{ fontSize: 9, fill: '#94a3b8' }}>Students</text>
    </svg>
  );
}

// ── Bar + trend line chart ────────────────────────────────────────────────────
function BarTrendChart() {
  const W = 460, H = 130, padL = 10, padR = 10, padT = 24, padB = 28;
  const iW = W - padL - padR;
  const iH = H - padT - padB;
  const n   = BAR_DATA.length;
  const barW = (iW / n) * 0.4;
  const gap  = iW / n;

  const barX = (i: number) => padL + gap * i + gap * 0.3;
  const barH = (pct: number) => (pct / 100) * iH;
  const barY = (pct: number) => padT + iH - barH(pct);

  // avg line (dashed green) mapped to 0-10 scale over height
  const lineY = (v: number) => padT + iH - (v / 10) * iH;
  const linePts = BAR_DATA.map((d, i) => `${barX(i) + barW / 2},${lineY(d.avg)}`).join(' ');

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ minHeight: H }}>
      {/* horizontal guide lines */}
      {[0, 25, 50, 75, 100].map(v => (
        <line key={v}
          x1={padL} x2={W - padR}
          y1={padT + iH - (v / 100) * iH}
          y2={padT + iH - (v / 100) * iH}
          stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="3 3"
        />
      ))}
      {/* bars */}
      {BAR_DATA.map((d, i) => (
        <g key={i}>
          <rect
            x={barX(i)} y={barY(d.pct)}
            width={barW} height={barH(d.pct)}
            rx={3} fill="#0891b2" opacity={0.85}
          />
          <text x={barX(i) + barW / 2} y={barY(d.pct) - 3} textAnchor="middle" style={{ fontSize: 7, fill: '#94a3b8' }}>{d.pct}%</text>
          <text x={barX(i) + barW / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 6.5, fill: '#94a3b8' }}>{d.dept}</text>
        </g>
      ))}
      {/* avg engagement dashed line */}
      <polyline points={linePts} fill="none" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 2" />
      {BAR_DATA.map((d, i) => (
        <circle key={i} cx={barX(i) + barW / 2} cy={lineY(d.avg)} r={2.5} fill="#10b981" />
      ))}
      {/* bottom baseline */}
      <line x1={padL} x2={W - padR} y1={padT + iH} y2={padT + iH} stroke="#e2e8f0" strokeWidth={1} />
    </svg>
  );
}

// ── Mini score bar ────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 10, color = 'bg-emerald-500' }: { value: number; max?: number; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="w-14 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap">{value}/10</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DepartmentPerformanceReportPage() {
  const [page] = useState(1);
  const [viewMode] = useState('Monthly');

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
              Department Performance Report
            </h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Comprehensive insights into department performance and students outcomes.
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
                    <span className="text-[10px] font-bold text-red-500">{c.change}</span>
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

            {/* Performance Over Time + Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

              {/* Bar/trend chart */}
              <div className="md:col-span-3 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Student Performance Over Time</h3>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-gray-200 dark:border-white/8 text-xs text-slate-500 dark:text-[#8e92ad] hover:border-cyan-300 transition-all">
                    {viewMode} <ChevronDown size={11} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-0.5 bg-cyan-500 rounded" />
                    <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">Average Performance Score (%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 border-t border-dashed border-emerald-500" />
                    <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">Average Engagements Score (./10)</span>
                  </div>
                </div>
                <div className="w-full overflow-hidden">
                  <BarTrendChart />
                </div>
              </div>

              {/* Distribution donut */}
              <div className="md:col-span-2 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Student Distribution by Departments</h3>
                <div className="flex flex-col items-center gap-3">
                  <DistributionDonut />
                  <div className="w-full grid grid-cols-2 gap-x-3 gap-y-1.5">
                    {DIST_SEGMENTS.map((s) => (
                      <div key={s.label} className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                        <span className="text-[9px] text-slate-500 dark:text-[#8e92ad] truncate">{s.label}</span>
                        <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 ml-auto shrink-0">{s.value.split(' ')[1]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Details table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white shrink-0">Students Engagement Details</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      readOnly
                      placeholder="Search departments"
                      className="pl-7 pr-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/8 bg-slate-50 dark:bg-white/5 text-xs text-slate-600 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] w-40 focus:outline-none focus:border-cyan-300 transition-all"
                    />
                  </div>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/8 text-xs text-slate-500 dark:text-[#8e92ad] hover:border-cyan-300 transition-all whitespace-nowrap">
                    All Departments <ChevronDown size={11} />
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/10 text-xs font-semibold text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                    All Year <ChevronDown size={11} />
                  </button>
                  <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-white/8 text-xs text-slate-500 dark:text-[#8e92ad] hover:border-cyan-300 transition-all whitespace-nowrap">
                    New Filters <ChevronDown size={11} />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      {['Departments', 'Total Students', 'Engagements Score', 'Performance Score', 'Session Completed', 'Improvements Rate', 'Top Activity', 'Status'].map(h => (
                        <th key={h} className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {DEPT_ROWS.map((d, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-3">
                          <span className="font-semibold text-slate-800 dark:text-white">{d.name}</span>
                        </td>
                        <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">{d.students}</td>
                        <td className="py-3 pr-3">
                          <ScoreBar value={d.engScore} color="bg-emerald-500" />
                        </td>
                        <td className="py-3 pr-3">
                          <ScoreBar value={d.perfScore} color="bg-blue-500" />
                        </td>
                        <td className="py-3 pr-3 text-slate-600 dark:text-slate-300">{d.sessions}</td>
                        <td className="py-3 pr-3">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{d.improvement}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`font-semibold ${d.topActivityCls}`}>{d.topActivity}</span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_CLS[d.status]}`}>
                            {d.status}
                          </span>
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
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Top Performing Departments */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Top Performing Departments</h3>
              <div className="space-y-3">
                {TOP_DEPTS.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300 dark:text-[#5a5f78] w-4 shrink-0">{i + 1}</span>
                    <div className="w-8 h-8 rounded-xl bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center shrink-0">
                      <BookOpen size={14} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <p className="flex-1 text-xs font-semibold text-slate-800 dark:text-white truncate">{d.name}</p>
                    <span className={`text-xs font-bold shrink-0 ${d.scoreCls}`}>{d.score}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                View All
              </button>
            </div>

            {/* Department Improvement */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Department Improvement</h3>
              <div className="space-y-3">
                {DEPT_IMPROVEMENT.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300 dark:text-[#5a5f78] w-4 shrink-0">{i + 1}</span>
                    <p className="flex-1 text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{d.name}</p>
                    <span className={`text-xs font-bold shrink-0 ${d.cls}`}>{d.change}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                View All
              </button>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-violet-200" />
                <span className="text-xs font-bold text-violet-100">AI Insight</span>
              </div>
              <p className="text-xs text-violet-100 leading-relaxed mb-3">
                The Medical department leads in engagement and performance with 18% improvement this month.
              </p>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-white hover:text-violet-200 transition-colors">
                View Detailed Analysis <ArrowUpRight size={11} />
              </button>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: 'Student Engagement Report', href: '/counselor/student-engagement-report', icon: Activity },
                  { label: 'MMI Coaching Analytics',    href: '/counselor/mmi-coaching-analytics',   icon: BarChart2 },
                  { label: 'Essay Rankings',            href: '/counselor/essay-ranking',            icon: BookOpen  },
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
