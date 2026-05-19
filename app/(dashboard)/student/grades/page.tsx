'use client';

import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Plus, ChevronDown, MoreVertical,
  ChevronRight, AlertTriangle, CheckCircle2, Sparkles,
} from 'lucide-react';
import { GRADES } from '@/src/lib/sample-data';
import { useStudentDashboard } from '@/src/hooks/useStudentDasboard';

// ── Extended course data ─────────────────────────────────────────────────────

const COURSE_META: Record<string, {
  teacher: string; trend: number; target: number;
  status: 'On Track' | 'At Risk'; updated: string;
}> = {
  MHF4U: { teacher: 'Mr. Johnson', trend: +3, target: 96, status: 'On Track', updated: 'May 20, 2026' },
  MCV4U: { teacher: 'Mr. Brown',   trend: +3, target: 93, status: 'At Risk',  updated: 'May 18, 2026' },
  SPH4U: { teacher: 'Mr. Brown',   trend: +1, target: 93, status: 'On Track', updated: 'May 14, 2026' },
  ENG4U: { teacher: 'Dr. Lee',     trend: +3, target: 90, status: 'At Risk',  updated: 'May 16, 2026' },
  SCH4U: { teacher: 'Mr. Brown',   trend: +2, target: 92, status: 'On Track', updated: 'May 18, 2026' },
  ICS4U: { teacher: 'Ms. Patel',   trend: +2, target: 95, status: 'On Track', updated: 'May 12, 2026' },
};

const UPCOMING = [
  { course: 'Chemistry',   type: 'Unit Test',   date: null },
  { course: 'Calculus 12', type: 'Quiz',        date: null },
  { course: 'Physics 12',  type: 'Lab Report',  date: 'June 2nd, 2026' },
];

const OVERTIME_PTS = [22, 30, 38, 45, 42, 52, 60, 65, 70, 72, 78, 88];

const GOAL_ROWS = [
  { label: 'Maintain 90% + Average',   value: 93, max: 100, display: '93%' },
  { label: 'Top 6 Average = 93%',       value: 94, max: 100, display: '94%' },
  { label: 'No Course Below 80%',       value: 7,  max: 8,   display: '7/8' },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function gradeColor(v: number) {
  if (v >= 90) return '#10b981';
  if (v >= 80) return '#f59e0b';
  return '#ef4444';
}

// Tiny inline sparkline
function Sparkline({ pts, color }: { pts: number[]; color: string }) {
  const min = Math.min(...pts), max = Math.max(...pts);
  const rng = max - min || 1;
  const W = 80, H = 28;
  const points = pts.map((v, i) =>
    `${(i / (pts.length - 1)) * W},${H - ((v - min) / rng) * (H - 4) - 2}`
  ).join(' ');
  return (
    <svg width={W} height={H} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Donut chart — works on both light and dark backgrounds via CSS variables
function DonutChart({
  pct, segments, light,
}: { pct: number; segments: { pct: number; color: string }[]; light?: boolean }) {
  const R = 54, CX = 64, CY = 64;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  const trackStroke = light ? '#e2e8f0' : 'rgba(255,255,255,0.06)';
  const textFill     = light ? '#1e293b' : 'white';
  const subFill      = light ? '#94a3b8' : '#8e92ad';
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={trackStroke} strokeWidth="14" />
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const arc = (
          <circle key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={s.color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${Math.max(dash - 2, 0)} ${circ - Math.max(dash - 2, 0)}`}
            strokeDashoffset={-offset + circ / 4}
          />
        );
        offset += dash;
        return arc;
      })}
      <text x={CX} y={CY - 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={textFill}>{pct}%</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill={subFill}>Overall</text>
    </svg>
  );
}

// Area chart for overtime
function AreaChart({ pts }: { pts: number[] }) {
  const W = 400, H = 100;
  const scaleX = (i: number) => (i / (pts.length - 1)) * W;
  const scaleY = (v: number) => H - (v / 100) * H;
  const linePts = pts.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' L ');
  const areaPath = `M ${linePts} L ${scaleX(pts.length - 1)},${H} L 0,${H} Z`;
  const linePath = `M ${linePts}`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b5ce6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2b5ce6" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#2b5ce6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((v, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(v)} r="3" fill="#2b5ce6" />
      ))}
      <circle cx={scaleX(pts.length - 1)} cy={scaleY(last)} r="6" fill="#2b5ce6" />
      <rect x={scaleX(pts.length - 1) - 16} y={scaleY(last) - 20} width="32" height="16" rx="4" fill="#2b5ce6" />
      <text x={scaleX(pts.length - 1)} y={scaleY(last) - 8} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">{last}%</text>
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GradeTrackerPage() {
  const { grades, top6Avg } = useStudentDashboard();
  const [yearOpen, setYearOpen] = useState(false);

  const highest    = Math.max(...grades);
  const above90    = grades.filter(g => g >= 90).length;
  const above80    = grades.filter(g => g >= 80 && g < 90).length;
  const above70    = grades.filter(g => g >= 70 && g < 80).length;
  const below70    = grades.filter(g => g < 70).length;
  const total      = GRADES.length;

  const donutSegments = [
    { pct: (above90 / total) * 100, color: '#10b981' },
    { pct: (above80 / total) * 100, color: '#f59e0b' },
    { pct: (above70 / total) * 100, color: '#eab308' },
    { pct: (below70 / total) * 100, color: '#ef4444' },
  ];

  const sparkPts1 = OVERTIME_PTS;
  const sparkPts2 = [70, 75, 73, 78, 76, 82, 85, 88, 90, 91, 93, highest];
  const sparkPts3 = [1, 1, 2, 2, 2, 2, 3, 3, 3, 3, above90, above90].map(v => v * 25);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-5">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Grade Tracker
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">
              Track your progress and stay on top of your admission goals.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Year selector */}
            <div className="relative">
              <button
                onClick={() => setYearOpen(!yearOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#161a27] text-sm font-medium text-slate-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
              >
                <span className="text-slate-400 dark:text-[#8e92ad]">📅</span>
                <span>Current Year (2024–2025)</span>
                <ChevronDown size={14} className={`text-slate-400 dark:text-[#8e92ad] transition-transform ${yearOpen ? 'rotate-180' : ''}`} />
              </button>
              {yearOpen && (
                <div className="absolute right-0 top-full mt-1 z-30 w-52 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#161a27] shadow-xl py-1 overflow-hidden">
                  {['Current Year (2024–2025)', 'Previous Year (2023–2024)'].map(y => (
                    <button key={y} onClick={() => setYearOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors">
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Add Course */}
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-blue-600/20 transition-all">
              <Plus size={15} /> Add Course
            </button>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Overall Average', value: `${top6Avg.toFixed(1)}%`, sub: '↑ 2% from last month', sparkPts: sparkPts1, sparkColor: '#2b5ce6' },
            { label: 'Top Average',     value: `${highest}%`,            sub: '↑ 18% from last month', sparkPts: sparkPts2, sparkColor: '#10b981' },
            { label: 'Top Average',     value: `${above90}`,             sub: '↑ 18% from last month', sparkPts: sparkPts3, sparkColor: '#7c3aed' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-[#8e92ad] mb-2">{s.label}</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white tabular-nums leading-none">{s.value}</p>
                <p className="text-xs mt-2 font-medium text-emerald-600 dark:text-[#10b981]">{s.sub}</p>
              </div>
              <Sparkline pts={s.sparkPts} color={s.sparkColor} />
            </div>
          ))}
        </div>

        {/* ── Main: course table + right sidebar ──────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 items-start">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Course Overview card */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Course Overview</h2>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                      {['COURSE', 'TEACHER', 'CURRENT GRADE', 'TREND', 'TARGET', 'STATUS', 'UPDATE'].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e]">
                          {h}
                        </th>
                      ))}
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {GRADES.map((course, idx) => {
                      const meta = COURSE_META[course.courseCode];
                      const val  = grades[idx] ?? course.value;
                      const color = gradeColor(val);
                      const isAtRisk = meta?.status === 'At Risk';
                      return (
                        <tr key={course.courseCode} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                          <td className="px-6 py-4">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{course.label}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-500 dark:text-[#8e92ad]">{meta?.teacher ?? '—'}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-bold tabular-nums" style={{ color }}>{val}%</span>
                          </td>
                          <td className="px-6 py-4">
                            {meta && (
                              <span className={`flex items-center gap-1 text-xs font-bold ${meta.trend >= 0 ? 'text-emerald-600 dark:text-[#10b981]' : 'text-red-500'}`}>
                                {meta.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {meta.trend > 0 ? '+' : ''}{meta.trend}%
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-slate-600 dark:text-[#c8ccdf] tabular-nums">{meta?.target ?? '—'}%</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              isAtRisk
                                ? 'bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b]'
                                : 'bg-emerald-50 dark:bg-[#10b981]/12 text-emerald-700 dark:text-[#10b981]'
                            }`}>
                              {isAtRisk ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                              {meta?.status ?? 'On Track'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-slate-400 dark:text-[#40455e]">{meta?.updated ?? '—'}</p>
                          </td>
                          <td className="px-4 py-4">
                            <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] text-slate-400 dark:text-[#8e92ad] transition-all">
                              <MoreVertical size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                {GRADES.map((course, idx) => {
                  const meta  = COURSE_META[course.courseCode];
                  const val   = grades[idx] ?? course.value;
                  const color = gradeColor(val);
                  const isAtRisk = meta?.status === 'At Risk';
                  return (
                    <div key={course.courseCode} className="px-5 py-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">{course.label}</p>
                          <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-0.5">{meta?.teacher}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold tabular-nums" style={{ color }}>{val}%</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            isAtRisk
                              ? 'bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b]'
                              : 'bg-emerald-50 dark:bg-[#10b981]/12 text-emerald-700 dark:text-[#10b981]'
                          }`}>
                            {meta?.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-[#8e92ad]">
                        <span className={`flex items-center gap-1 font-bold ${meta && meta.trend >= 0 ? 'text-emerald-600 dark:text-[#10b981]' : 'text-red-500'}`}>
                          {meta && meta.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {meta && meta.trend > 0 ? '+' : ''}{meta?.trend}%
                        </span>
                        <span>Target: <strong className="text-slate-800 dark:text-white">{meta?.target}%</strong></span>
                        <span className="ml-auto text-slate-400 dark:text-[#40455e]">{meta?.updated}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 2-column: overtime chart + upcoming assessments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* Average Overtime */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Average Overtime</h3>
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8e92ad] border border-gray-200 dark:border-white/[0.08] rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                    This Year <ChevronDown size={11} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col justify-between text-[9px] text-slate-400 dark:text-[#40455e] pb-6" style={{ height: '100px' }}>
                    {['100%', '75%', '50%', '25%', '0%'].map(l => <span key={l}>{l}</span>)}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div style={{ height: '100px' }} className="w-full">
                      <AreaChart pts={OVERTIME_PTS} />
                    </div>
                    <div className="flex justify-between pt-1.5 px-1">
                      {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map(l => (
                        <span key={l} className="text-[9px] text-slate-400 dark:text-[#40455e]">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Assessments */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upcoming Assessments</h3>
                <div className="space-y-4">
                  {UPCOMING.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          <span className="text-slate-500 dark:text-[#8e92ad] font-normal">{item.course} - </span>
                          {item.type}
                        </p>
                        {item.date && <p className="text-xs text-slate-400 dark:text-[#40455e] mt-0.5">{item.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#2b5ce6] hover:text-blue-700 dark:hover:text-[#7b9ef0] transition-colors">
                  View Full Calendar <ChevronRight size={12} />
                </button>
              </div>

            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Average Breakdown */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Average Breakdown</h3>
              {/* Donut + legend — use a wrapper to switch the SVG fill values */}
              <div className="flex items-center gap-4">
                <div className="dark:hidden">
                  <DonutChart pct={Math.round(top6Avg)} segments={donutSegments} light />
                </div>
                <div className="hidden dark:block">
                  <DonutChart pct={Math.round(top6Avg)} segments={donutSegments} />
                </div>
                <div className="flex-1 space-y-2.5 min-w-0">
                  {[
                    { label: '90% and above', count: above90, color: '#10b981' },
                    { label: '80–89%',        count: above80, color: '#f59e0b' },
                    { label: '70–79%',        count: above70, color: '#eab308' },
                    { label: 'Below 70%',     count: below70, color: '#ef4444' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: row.color }} />
                        <span className="text-[11px] text-slate-500 dark:text-[#8e92ad] truncate">{row.label}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] shrink-0">{row.count} Courses</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress to Goal */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Progress to Goal</h3>
              <div className="space-y-4">
                {GOAL_ROWS.map((g) => (
                  <div key={g.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-slate-500 dark:text-[#8e92ad]">{g.label}</p>
                      <p className="text-xs font-bold text-[#2b5ce6]">{g.display}</p>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-700"
                        style={{ width: `${(g.value / g.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2b5ce6] hover:text-blue-700 dark:hover:text-[#7b9ef0] transition-colors">
                View All Goals <ChevronRight size={12} />
              </button>
            </div>

            {/* At Risk Courses */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">At Risk Courses</h3>
              <div className="space-y-3">
                {GRADES.filter(c => COURSE_META[c.courseCode]?.status === 'At Risk').map((course, i) => {
                  const idx = GRADES.indexOf(course);
                  const val = grades[idx] ?? course.value;
                  const tips = ['Just below your target', 'Focus more on assessments'];
                  return (
                    <div key={course.courseCode} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{course.label}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-0.5">{tips[i] ?? 'Needs improvement'}</p>
                      </div>
                      <span className="text-xs font-bold text-amber-500 shrink-0 tabular-nums">{val}%</span>
                      <button className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b] hover:bg-amber-100 dark:hover:bg-[#f59e0b]/20 border border-amber-200 dark:border-transparent transition-colors">
                        Improve
                      </button>
                    </div>
                  );
                })}
              </div>
              <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2b5ce6] hover:text-blue-700 dark:hover:text-[#7b9ef0] transition-colors">
                View Recommendations <ChevronRight size={12} />
              </button>
            </div>

            {/* Study Plan CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-[#7c3aed]/20 dark:via-[#2b5ce6]/15 dark:to-[#7c3aed]/10 border border-purple-100 dark:border-[#7c3aed]/20 p-5">
              <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-purple-200/40 dark:bg-blue-600/15 blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-purple-100 dark:bg-blue-600/20 flex items-center justify-center">
                  <Sparkles size={15} className="text-purple-600 dark:text-[#a78bfa]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Improve Your Average</p>
                  <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-1 leading-relaxed">
                    Focus on completing assignment and reviewing week topics to boost your grades
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 dark:shadow-[#7c3aed]/20">
                View Study Plan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
