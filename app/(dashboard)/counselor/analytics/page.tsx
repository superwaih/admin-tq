'use client';

import { ChevronRight, Download, ArrowUpRight, Users, Calendar, Star, FileText, Mic } from 'lucide-react';

const STAT_CARDS = [
  { label: 'Total Students',       value: '120',    trend: '+12% vs Apr 1-30', icon: Users,    iconCls: 'text-slate-400',   color: 'text-slate-800 dark:text-white',           trendColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Sessions Completed',   value: '98',     trend: '+18% vs Apr 1-30', icon: Calendar, iconCls: 'text-blue-400',    color: 'text-blue-600 dark:text-blue-400',         trendColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Avg Performance Score',value: '8.2/10', trend: '+0.6 vs Apr 1-30', icon: Star,     iconCls: 'text-purple-400',  color: 'text-purple-600 dark:text-purple-400',     trendColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Essays Reviewed',      value: '156',    trend: '+15% vs Apr 1-30', icon: FileText, iconCls: 'text-emerald-400', color: 'text-emerald-600 dark:text-emerald-400',   trendColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'MMI Practice Sessions',value: '86',     trend: '+22% vs Apr 1-30', icon: Mic,      iconCls: 'text-amber-400',   color: 'text-amber-600 dark:text-amber-400',       trendColor: 'text-emerald-600 dark:text-emerald-400' },
];

const PERF_DATA = [5, 10, 20, 35, 50];
const PERF_LABELS = ['0-2', '2-4', '4-6', '6-8', '8-10'];
const PERF_COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];

const TIMELINE_SCORES = [2.5, 5, 7.5, 5, 7.5, 7.5, 7.5, 7.5, 7.5, 5];
const TIMELINE_SESSIONS = [50, 75, 50, 75, 50, 50, 75, 50, 75, 75];
const TIMELINE_LABELS = ['May 1','','May 8','','May 15','','May 22','','May 29',''];

const ESSAY_SEGMENTS = [{p:46,c:'#10b981'},{p:36,c:'#0284c7'},{p:13,c:'#f59e0b'},{p:5,c:'#ef4444'}];
const ESSAY_LEGEND = [{l:'Excellent (8-1)',v:'72 (46%)',c:'#10b981'},{l:'Good (6-8)',v:'56 (36%)',c:'#0284c7'},{l:'Fair (4-6)',v:'20 (13%)',c:'#f59e0b'},{l:'Needs Impr. (0-',v:'8 (5%)',c:'#ef4444'}];

const MMI_SEGMENTS = [{p:47,c:'#10b981'},{p:42,c:'#0284c7'},{p:5,c:'#f59e0b'},{p:2,c:'#94a3b8'}];
const MMI_LEGEND = [{l:'Completed',v:'40 (47%)',c:'#10b981'},{l:'In Progress',v:'36 (42%)',c:'#0284c7'},{l:'Needs Practice',v:'8 (5%)',c:'#f59e0b'},{l:'Not Started',v:'2 (2%)',c:'#94a3b8'}];

const DEPT_PERF = [
  { dept: 'Medicine',        score: 8.6, color: 'bg-emerald-500' },
  { dept: 'Engineering',     score: 8.2, color: 'bg-blue-500' },
  { dept: 'Business',        score: 7.9, color: 'bg-purple-500' },
  { dept: 'Computer Science',score: 7.6, color: 'bg-amber-500' },
  { dept: 'Law',             score: 7.1, color: 'bg-red-400' },
];

const ENGAGEMENT = [{l:'High Engagement',v:'45 (37%)',c:'#10b981'},{l:'Medium Engagement',v:'50 (41%)',c:'#0284c7'},{l:'Low Engagement',v:'20 (17%)',c:'#f59e0b'},{l:'Inactive',v:'5 (4%)',c:'#ef4444'}];

const TOP_STUDENTS = [
  { name: 'Maryam Okafor',  score: 9.5, initials: 'MO', color: 'bg-orange-400' },
  { name: 'Fatima Bello',   score: 9.2, initials: 'FB', color: 'bg-pink-500' },
  { name: 'Samuel Johnson', score: 8.9, initials: 'SJ', color: 'bg-purple-500' },
  { name: 'Amina Yusuf',    score: 8.7, initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Joshua Adeyemi', score: 8.5, initials: 'JA', color: 'bg-teal-500' },
];

function SmallDonut({ segments }: { segments: { p: number; c: string }[] }) {
  const R = 30, circ = 2 * Math.PI * R;
  let offset = 0;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80">
      <circle cx="40" cy="40" r={R} fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-white/8" />
      {segments.map((s, i) => {
        const arc = (
          <circle key={i} cx="40" cy="40" r={R} fill="none" stroke={s.c} strokeWidth="10"
            strokeDasharray={`${(s.p / 100) * circ - 1} ${circ}`}
            strokeDashoffset={-((offset / 100) * circ) + circ / 4} />
        );
        offset += s.p;
        return arc;
      })}
    </svg>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Analytics</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Comprehensive insights into student performance and counseling outcomes.</p>
          </div>
          <div className="flex items-center gap-2">
            {['May 1 – May 31, 2025','All Departments','All Students'].map(f => (
              <button key={f} className="hidden sm:flex items-center gap-1.5 h-9 px-3 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                {f} <span className="opacity-50">▾</span>
              </button>
            ))}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
              <Download size={14} /> Export Report
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map(s => {
            const Icon = s.icon;
            return (
            <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={s.iconCls} />
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-wider text-right leading-tight">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className={`text-[10px] font-medium mt-1 flex items-center gap-1 ${s.trendColor}`}>
                <ArrowUpRight size={10} /> {s.trend}
              </p>
            </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="space-y-5">

            {/* Performance Over Time chart */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Student Performance Over Time</h3>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3 text-[10px] text-slate-400 dark:text-[#8e92ad]">
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-cyan-600 inline-block" /> Average Score</span>
                    <span className="flex items-center gap-1.5"><span className="w-5 h-0.5 bg-emerald-400 border-dashed border-t-2 inline-block" /> Sessions Completed</span>
                  </div>
                  <button className="text-xs text-slate-500 dark:text-[#8e92ad] border border-gray-100 dark:border-white/8 rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Weekly ▾</button>
                </div>
              </div>
              <div style={{ height: 140 }} className="w-full relative">
                <svg viewBox="0 0 400 120" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="lgPerf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0284c7" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0,30,60,90,120].map((y,i) => <line key={i} x1="0" x2="400" y1={y} y2={y} stroke="#e2e8f0" strokeWidth="0.5" className="dark:stroke-white/8" />)}
                  {/* Sessions line */}
                  <polyline points={TIMELINE_SESSIONS.map((v,i)=>`${(i/(TIMELINE_SCORES.length-1))*400},${120-v}`).join(' ')} fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 2" strokeLinecap="round" />
                  {/* Score fill */}
                  <path d={`M 0,${120-TIMELINE_SCORES[0]*14} ${TIMELINE_SCORES.map((v,i)=>`L ${(i/(TIMELINE_SCORES.length-1))*400},${120-v*14}`).slice(1).join(' ')} L 400,120 L 0,120 Z`} fill="url(#lgPerf)" />
                  {/* Score line */}
                  <polyline points={TIMELINE_SCORES.map((v,i)=>`${(i/(TIMELINE_SCORES.length-1))*400},${120-v*14}`).join(' ')} fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {TIMELINE_SCORES.map((v,i)=><circle key={i} cx={(i/(TIMELINE_SCORES.length-1))*400} cy={120-v*14} r="3" fill="#0284c7" />)}
                </svg>
                <div className="flex justify-between mt-1 px-1">
                  {TIMELINE_LABELS.map((l,i) => <span key={i} className="text-[9px] text-slate-400 dark:text-[#40455e]">{l}</span>)}
                </div>
              </div>
            </div>

            {/* 3 bottom cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              {/* Essay Review Insights */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Essay Review Insights</h3>
                <div className="flex items-center gap-3 mb-4">
                  <SmallDonut segments={ESSAY_SEGMENTS} />
                  <div className="space-y-1.5 flex-1">
                    {ESSAY_LEGEND.map(r => (
                      <div key={r.l} className="flex items-start gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: r.c }} />
                        <div className="min-w-0">
                          <p className="text-[9px] text-slate-500 dark:text-[#8e92ad] leading-tight">{r.l}</p>
                          <p className="text-[10px] font-bold text-slate-700 dark:text-[#c8ccdf]">{r.v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full Essay Report <ChevronRight size={12} /></button>
              </div>

              {/* MMI Practice Insights */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">MMI Practice Insights</h3>
                <div className="flex items-center gap-3 mb-4">
                  <SmallDonut segments={MMI_SEGMENTS} />
                  <div className="space-y-1.5 flex-1">
                    {MMI_LEGEND.map(r => (
                      <div key={r.l} className="flex items-start gap-1.5">
                        <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: r.c }} />
                        <div className="min-w-0">
                          <p className="text-[9px] text-slate-500 dark:text-[#8e92ad] leading-tight">{r.l}</p>
                          <p className="text-[10px] font-bold text-slate-700 dark:text-[#c8ccdf]">{r.v}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full MMI Report <ChevronRight size={12} /></button>
              </div>

              {/* Department Performance */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Department Performance</h3>
                <div className="space-y-3">
                  {DEPT_PERF.map(d => (
                    <div key={d.dept}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{d.dept}</p>
                        <p className="text-xs font-bold text-slate-700 dark:text-[#c8ccdf]">{d.score}/10</p>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(d.score / 10) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full Department Report <ChevronRight size={12} /></button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Recent Activity Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{l:'New Students',v:'8',sub:'This week',color:'text-blue-600 dark:text-blue-400',bg:'bg-blue-50 dark:bg-blue-500/10'},{l:'Sessions Done',v:'24',sub:'This week',color:'text-emerald-600 dark:text-emerald-400',bg:'bg-emerald-50 dark:bg-emerald-500/10'},{l:'Essays Submitted',v:'12',sub:'This week',color:'text-purple-600 dark:text-purple-400',bg:'bg-purple-50 dark:bg-purple-500/10'},{l:'MMI Completed',v:'18',sub:'This week',color:'text-amber-600 dark:text-amber-400',bg:'bg-amber-50 dark:bg-amber-500/10'}].map(s=>(
                  <div key={s.l} className={`${s.bg} rounded-xl p-4`}>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.l}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.v}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Student Engagement donut */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Student Engagement</h3>
              <div className="flex items-center gap-3 mb-3">
                <SmallDonut segments={[{p:37,c:'#10b981'},{p:41,c:'#0284c7'},{p:17,c:'#f59e0b'},{p:4,c:'#94a3b8'}]} />
                <div className="space-y-1.5 flex-1">
                  {ENGAGEMENT.map(r => (
                    <div key={r.l} className="flex items-start gap-1.5">
                      <div className="w-2 h-2 rounded-full shrink-0 mt-0.5" style={{ background: r.c }} />
                      <div className="min-w-0">
                        <p className="text-[9px] text-slate-500 dark:text-[#8e92ad] leading-tight truncate">{r.l}</p>
                        <p className="text-[10px] font-bold text-slate-700 dark:text-[#c8ccdf]">{r.v}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full Engagement Report <ChevronRight size={12} /></button>
            </div>

            {/* Performance Distribution */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance Distribution</h3>
              <div className="flex items-end gap-1 h-20">
                {PERF_DATA.map((v, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-slate-500 dark:text-[#8e92ad]">{v}</span>
                    <div className="w-full rounded-t-md" style={{ height: `${(v / 50) * 60}px`, backgroundColor: PERF_COLORS[i] }} />
                    <span className="text-[9px] text-slate-400 dark:text-[#40455e]">{PERF_LABELS[i]}</span>
                  </div>
                ))}
              </div>
              <button className="mt-3 text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full Performance Report <ChevronRight size={12} /></button>
            </div>

            {/* Top Performing Students */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performing Students</h3>
                <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1">View All <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-3">
                {TOP_STUDENTS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white flex-1 truncate">{s.name}</p>
                    <span className="text-xs font-bold text-slate-700 dark:text-[#c8ccdf] shrink-0">{s.score}/10</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-500/20 dark:to-teal-500/10 border border-cyan-100 dark:border-cyan-500/20 p-5">
              <div className="pointer-events-none absolute -top-6 -right-6 h-20 w-20 rounded-full bg-cyan-200/40 dark:bg-cyan-500/15 blur-xl" />
              <div className="relative">
                <span className="text-[10px] font-bold bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded-full">AI Insight</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white mt-2">Performance trends improving by 12%</p>
                <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-1 leading-relaxed">Students who attended 3+ sessions this month showed significantly higher essay scores.</p>
                <button className="mt-3 text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1">View Detailed Analysis <ChevronRight size={12} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
