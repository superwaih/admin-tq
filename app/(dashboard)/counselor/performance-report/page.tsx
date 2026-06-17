'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Filter, Download,
  Users, TrendingUp, TrendingDown, ArrowUpRight, Sparkles,
  Star, CheckCircle2, Clock, AlertTriangle, BarChart2,
  Target, Zap, FileText, Activity, Medal, BookOpen,
} from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { label: 'Total Students',       value: '120',    change: '+12%', sub: 'vs last month', icon: Users,       iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',      iconColor: 'text-cyan-600 dark:text-cyan-400',      positive: true  },
  { label: 'Avg Performance Score',value: '8.2/10', change: '+0.6', sub: 'vs last month', icon: Star,        iconBg: 'bg-violet-50 dark:bg-violet-500/15',  iconColor: 'text-violet-600 dark:text-violet-400',  positive: true  },
  { label: 'Top Performers',       value: '28',     change: '+6',   sub: 'vs last month', icon: Medal,       iconBg: 'bg-amber-50 dark:bg-amber-500/15',    iconColor: 'text-amber-600 dark:text-amber-400',    positive: true  },
  { label: 'Needs Improvement',    value: '14',     change: '-3',   sub: 'vs last month', icon: AlertTriangle,iconBg:'bg-red-50 dark:bg-red-500/15',       iconColor: 'text-red-500 dark:text-red-400',        positive: true  },
  { label: 'Completion Rate',      value: '87%',    change: '+5%',  sub: 'vs last month', icon: CheckCircle2,iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',iconColor: 'text-emerald-600 dark:text-emerald-400',positive: true  },
  { label: 'Sessions Completed',   value: '98',     change: '+18%', sub: 'vs last month', icon: Activity,    iconBg: 'bg-blue-50 dark:bg-blue-500/15',      iconColor: 'text-blue-600 dark:text-blue-400',      positive: true  },
];

type Band = 'Excellent' | 'Great' | 'Good' | 'Fair' | 'Needs Work';

interface StudentRow {
  name: string; initials: string; color: string; id: string; dept: string;
  essayScore: number; mmiScore: number; sessionScore: number; overall: number;
  band: Band; bandCls: string; trend: 'up' | 'down' | 'neutral'; sessions: number;
}

const STUDENTS: StudentRow[] = [
  { name:'Maryam Okafor',  initials:'MO', color:'bg-orange-400', id:'STU-2024-1005', dept:'Medicine',       essayScore:9.2, mmiScore:9.3, sessionScore:9.0, overall:9.2, band:'Excellent', bandCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'up',      sessions:10 },
  { name:'Fatima Bello',   initials:'FB', color:'bg-pink-500',   id:'STU-2024-1003', dept:'Engineering',    essayScore:8.5, mmiScore:8.9, sessionScore:8.2, overall:8.5, band:'Excellent', bandCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'up',      sessions:9  },
  { name:'Samuel Johnson', initials:'SJ', color:'bg-indigo-500', id:'STU-2024-1008', dept:'Medicine',       essayScore:8.9, mmiScore:8.4, sessionScore:8.8, overall:8.7, band:'Excellent', bandCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'up',      sessions:9  },
  { name:'Amina Yusuf',    initials:'AY', color:'bg-yellow-400', id:'STU-2024-1001', dept:'Business',       essayScore:9.2, mmiScore:8.4, sessionScore:8.0, overall:8.5, band:'Excellent', bandCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'neutral', sessions:8  },
  { name:'Joshua Adeyemi', initials:'JA', color:'bg-teal-500',   id:'STU-2024-1006', dept:'Law',            essayScore:7.8, mmiScore:7.8, sessionScore:7.5, overall:7.7, band:'Good',      bandCls:'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trend:'up',      sessions:7  },
  { name:'Daniel Musa',    initials:'DM', color:'bg-blue-500',   id:'STU-2024-1002', dept:'Medicine',       essayScore:7.8, mmiScore:7.2, sessionScore:7.0, overall:7.3, band:'Good',      bandCls:'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trend:'down',    sessions:6  },
  { name:'Halima Sani',    initials:'HS', color:'bg-red-400',    id:'STU-2024-1007', dept:'Computer Science',essayScore:7.2, mmiScore:6.5, sessionScore:6.8, overall:6.8, band:'Fair',      bandCls:'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400',         trend:'down',    sessions:5  },
  { name:'Ibrahim Ali',    initials:'IA', color:'bg-green-500',  id:'STU-2024-1004', dept:'Medicine',       essayScore:6.5, mmiScore:6.1, sessionScore:5.8, overall:6.1, band:'Needs Work', bandCls:'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',                 trend:'down',    sessions:4  },
];

const SCORE_BANDS = [
  { label: 'Excellent (9–10)', count: 28, pct: 23, color: 'bg-emerald-500', dotColor: '#10b981' },
  { label: 'Great (8–8.9)',    count: 42, pct: 35, color: 'bg-blue-500',    dotColor: '#0284c7' },
  { label: 'Good (7–7.9)',     count: 30, pct: 25, color: 'bg-cyan-400',    dotColor: '#22d3ee' },
  { label: 'Fair (5–6.9)',     count: 12, pct: 10, color: 'bg-amber-400',   dotColor: '#f59e0b' },
  { label: 'Needs Work (<5)',  count:  8, pct:  7, color: 'bg-red-400',     dotColor: '#f87171' },
];

const DEPT_PERF = [
  { name: 'Medicine',         avg: 8.6, students: 34, barW: 86, color: 'bg-emerald-500' },
  { name: 'Engineering',      avg: 8.2, students: 21, barW: 82, color: 'bg-blue-500'    },
  { name: 'Law',              avg: 7.9, students: 18, barW: 79, color: 'bg-violet-500'  },
  { name: 'Business',         avg: 7.6, students: 15, barW: 76, color: 'bg-amber-400'   },
  { name: 'Computer Science', avg: 7.1, students: 12, barW: 71, color: 'bg-red-400'     },
];

const MONTHLY_SCORES = [7.1, 7.3, 7.5, 7.8, 7.9, 8.1, 8.2];
const MONTHLY_LABELS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'];

const SESSION_SCORES = [6.8, 7.2, 7.0, 7.6, 7.4, 7.9, 8.1, 7.8, 8.2, 8.4];
const SESSION_LABELS = ['May 1','May 3','May 8','May 11','May 15','May 18','May 22','May 25','May 29','Jun 1'];

const ACTION_ITEMS = [
  { text: 'Ibrahim Ali (6.1 avg) — missed 6 of 10 sessions; book weekly 1:1 check-ins immediately',  urgency: 'high'   },
  { text: 'Halima Sani score dropped 0.5 pts month-over-month — review goals and adjust study plan', urgency: 'high'   },
  { text: 'Daniel Musa trend declining in both Essay and MMI — consider combined coaching package',   urgency: 'medium' },
  { text: 'Computer Science dept avg (7.1) lags other depts by >1 pt — review curriculum support',   urgency: 'medium' },
  { text: 'Maryam, Samuel & Amina eligible for advanced-track early application programme (8.5+)',   urgency: 'info'   },
];
const U_CLS: Record<string,string> = {
  high:   'bg-red-50 dark:bg-red-500/15 border-l-2 border-red-400',
  medium: 'bg-amber-50 dark:bg-amber-500/15 border-l-2 border-amber-400',
  info:   'bg-emerald-50 dark:bg-emerald-500/15 border-l-2 border-emerald-400',
};
const U_DOT: Record<string,string> = { high:'bg-red-500', medium:'bg-amber-400', info:'bg-emerald-500' };

// ── Mini score pill ───────────────────────────────────────────────────────────
function Pill({ v }: { v: number }) {
  const cls = v >= 8.5 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    : v >= 7.5         ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'
    : v >= 6.5         ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
    : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
  return <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-md ${cls}`}>{v.toFixed(1)}</span>;
}

// ── Trend icon ────────────────────────────────────────────────────────────────
function TrendIcon({ t }: { t: 'up'|'down'|'neutral' }) {
  return t==='up'    ? <ArrowUpRight size={13} className="text-emerald-500"/>
       : t==='down'  ? <TrendingDown  size={13} className="text-red-400"/>
       :               <span className="text-slate-300 dark:text-[#5a5f78] text-xs">—</span>;
}

// ── Score trend line chart ────────────────────────────────────────────────────
function ScoreTrendLine({ data, labels, color = '#0891b2', yMin = 6, yMax = 10 }: {
  data: number[]; labels: string[]; color?: string; yMin?: number; yMax?: number;
}) {
  const W = 380, H = 110, p = { t: 12, b: 24, l: 28, r: 10 };
  const iw = W-p.l-p.r, ih = H-p.t-p.b;
  const px = (i:number) => p.l + (i/(data.length-1))*iw;
  const py = (v:number) => p.t + ih - ((v-yMin)/(yMax-yMin))*ih;
  const pts = data.map((v,i)=>`${px(i)},${py(v)}`).join(' ');
  const area = `M ${px(0)},${py(data[0])} ${data.map((v,i)=>`L ${px(i)},${py(v)}`).join(' ')} L ${px(data.length-1)},${p.t+ih} L ${px(0)},${p.t+ih} Z`;
  const yTicks = [yMin, (yMin+yMax)/2, yMax];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{minHeight:H}}>
      {yTicks.map(v=>(
        <line key={v} x1={p.l} x2={W-p.r} y1={py(v)} y2={py(v)} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="3 3"/>
      ))}
      {yTicks.map(v=>(
        <text key={`y${v}`} x={p.l-4} y={py(v)+4} textAnchor="end" style={{fontSize:7,fill:'#94a3b8'}}>{v}</text>
      ))}
      {labels.map((l,i)=>(
        <text key={l} x={px(i)} y={H-4} textAnchor="middle" style={{fontSize:6.5,fill:'#94a3b8'}}>{l}</text>
      ))}
      <path d={area} fill={color} opacity={0.07}/>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={2}/>
      {data.map((v,i)=><circle key={i} cx={px(i)} cy={py(v)} r={3} fill={color}/>)}
    </svg>
  );
}

// ── Radar-style spider chart (SVG) ────────────────────────────────────────────
function RadarChart({ scores }: { scores: { label: string; value: number }[] }) {
  const n = scores.length, r = 52, cx = 68, cy = 68;
  const angle = (i: number) => (i * 2 * Math.PI / n) - Math.PI / 2;
  const pt = (i: number, ratio: number) => ({
    x: cx + r * ratio * Math.cos(angle(i)),
    y: cy + r * ratio * Math.sin(angle(i)),
  });
  const grid = [0.25, 0.5, 0.75, 1];
  const shape = scores.map((s, i) => pt(i, s.value / 10));
  const shapePath = shape.map((p, i) => `${i===0?'M':'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
  return (
    <svg width={136} height={136} viewBox="0 0 136 136">
      {grid.map(g => (
        <polygon key={g}
          points={scores.map((_,i)=>`${pt(i,g).x},${pt(i,g).y}`).join(' ')}
          fill="none" stroke="#e2e8f0" strokeWidth={0.8}/>
      ))}
      {scores.map((_,i) => (
        <line key={i} x1={cx} y1={cy} x2={pt(i,1).x} y2={pt(i,1).y} stroke="#e2e8f0" strokeWidth={0.8}/>
      ))}
      <path d={shapePath} fill="#0891b2" fillOpacity={0.18} stroke="#0891b2" strokeWidth={1.5}/>
      {scores.map((s,i) => {
        const p = pt(i, s.value/10);
        const lp = pt(i, 1.22);
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={2.5} fill="#0891b2"/>
            <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
              style={{fontSize:6.5, fill:'#64748b', fontWeight:600}}>{s.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Donut distribution chart ──────────────────────────────────────────────────
function BandDonut() {
  const total = SCORE_BANDS.reduce((a,b)=>a+b.count,0);
  const r=50,cx=64,cy=64,stroke=15,circ=2*Math.PI*r;
  let off=0;
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      {SCORE_BANDS.map((b,i)=>{
        const dash=(b.count/total)*circ, gap=circ-dash;
        const el=<circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={b.dotColor} strokeWidth={stroke}
          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-off*circ/total}
          transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt"/>;
        off+=b.count; return el;
      })}
      <text x={cx} y={cx-6}  textAnchor="middle" style={{fontSize:15,fontWeight:700,fill:'#0f172a'}}>120</text>
      <text x={cx} y={cx+10} textAnchor="middle" style={{fontSize:8,fill:'#94a3b8'}}>Students</text>
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function PerformanceReportPage() {
  const [activeTab, setActiveTab] = useState<'All'|'Excellent'|'Needs Work'>('All');
  const [page] = useState(1);

  const filtered = activeTab==='All' ? STUDENTS
    : activeTab==='Excellent' ? STUDENTS.filter(s=>s.band==='Excellent'||s.band==='Great')
    : STUDENTS.filter(s=>s.band==='Fair'||s.band==='Needs Work');

  const atRisk = STUDENTS.filter(s=>s.band==='Needs Work'||s.band==='Fair');

  const radarScores = [
    { label:'Essays',    value: STUDENTS.reduce((a,s)=>a+s.essayScore,0)/STUDENTS.length },
    { label:'MMI',       value: STUDENTS.reduce((a,s)=>a+s.mmiScore,0)/STUDENTS.length },
    { label:'Sessions',  value: STUDENTS.reduce((a,s)=>a+s.sessionScore,0)/STUDENTS.length },
    { label:'Engage',    value: 8.1 },
    { label:'Attendance',value: 8.4 },
    { label:'Overall',   value: STUDENTS.reduce((a,s)=>a+s.overall,0)/STUDENTS.length },
  ].map(s=>({...s,value:parseFloat(s.value.toFixed(1))}));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link href="/counselor/analytics"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1">
              <ChevronLeft size={15}/> Back to Analytics
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Full Performance Report</h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Complete student performance breakdown — scores, trends, department analysis & counselor actions.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-cyan-300 transition-all">
              May 21 – 26, 2026 <ChevronDown size={14} className="text-slate-400"/>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-cyan-300 transition-all">
              <Filter size={14}/> Filters
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:border-cyan-300 hover:text-cyan-700 transition-all">
              <Download size={14}/> Export Report
            </button>
          </div>
        </div>

        {/* ── Stat cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAT_CARDS.map((c)=>(
            <div key={c.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
              <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-xl ${c.iconBg} flex items-center justify-center shrink-0`}>
                  <c.icon size={15} className={c.iconColor}/>
                </div>
                {c.positive
                  ? <div className="flex items-center gap-0.5"><ArrowUpRight size={11} className="text-emerald-500"/><span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{c.change}</span></div>
                  : <div className="flex items-center gap-0.5"><TrendingDown size={11} className="text-red-500"/><span className="text-[10px] font-bold text-red-500">{c.change}</span></div>
                }
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{c.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-tight">{c.label}</p>
              <p className="text-[9px] text-slate-300 dark:text-[#5a5f78] mt-0.5">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main 3-col grid ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

          {/* ── LEFT + CENTRE ───────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Row 1: 6-month trend + radar */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

              {/* 6-month avg score trend */}
              <div className="md:col-span-3 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">6-Month Performance Trend</h3>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">↑ +1.1 pts since Nov</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mb-3">Monthly cohort average across all assessments</p>
                <ScoreTrendLine data={MONTHLY_SCORES} labels={MONTHLY_LABELS} color="#0891b2" yMin={6} yMax={10}/>
              </div>

              {/* Radar chart */}
              <div className="md:col-span-2 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">Cohort Skill Profile</h3>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mb-3">Average scores across 6 performance dimensions</p>
                <div className="flex items-center justify-center">
                  <RadarChart scores={radarScores}/>
                </div>
              </div>
            </div>

            {/* Row 2: Score distribution + weekly sessions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Score band distribution */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Score Distribution</h3>
                <div className="flex items-center gap-4">
                  <div className="shrink-0"><BandDonut/></div>
                  <div className="flex-1 space-y-2.5">
                    {SCORE_BANDS.map(b=>(
                      <div key={b.label}>
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{background:b.dotColor}}/>
                            <span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">{b.label}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{b.count}</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${b.color}`} style={{width:`${b.pct*2.5}%`}}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Weekly session scores */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Session Score Timeline</h3>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mb-3">Avg session quality score — May 1 to May 29</p>
                <ScoreTrendLine data={SESSION_SCORES} labels={SESSION_LABELS} color="#7c3aed" yMin={5} yMax={10}/>
              </div>
            </div>

            {/* Row 3: Student breakdown table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Student Performance Breakdown</h3>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/6 rounded-xl p-1 w-fit">
                  {(['All','Excellent','Needs Work'] as const).map(tab=>(
                    <button key={tab} onClick={()=>setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        activeTab===tab ? 'bg-white dark:bg-[#1e2335] text-slate-800 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                      }`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[680px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      {['Student','Department','Essay','MMI','Sessions','Overall','Band','Trend'].map(h=>(
                        <th key={h} className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {filtered.map((s,i)=>(
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{s.initials}</div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-white whitespace-nowrap">{s.name}</p>
                              <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">{s.dept}</td>
                        <td className="py-3 pr-3"><Pill v={s.essayScore}/></td>
                        <td className="py-3 pr-3"><Pill v={s.mmiScore}/></td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-1">
                            <Pill v={s.sessionScore}/>
                            <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{s.sessions}/10</span>
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <span className="text-sm font-bold text-slate-800 dark:text-white">{s.overall.toFixed(1)}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${s.bandCls}`}>{s.band}</span>
                        </td>
                        <td className="py-3"><TrendIcon t={s.trend}/></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/6">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing {filtered.length} of 120 students</p>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/8 flex items-center justify-center text-slate-400 hover:border-cyan-400 transition-all"><ChevronLeft size={13}/></button>
                  {[1,2,3,'...',12].map((p,i)=>(
                    <button key={i} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${p===page?'bg-cyan-600 text-white shadow-sm':'border border-gray-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:border-cyan-400'}`}>{p}</button>
                  ))}
                  <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/8 flex items-center justify-center text-slate-400 hover:border-cyan-400 transition-all"><ChevronRight size={13}/></button>
                </div>
              </div>
            </div>

            {/* Row 4: Students needing attention */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-red-500"/>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Students Needing Immediate Support</h3>
                <span className="ml-auto text-[10px] font-bold bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">{atRisk.length} students</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {atRisk.map((s)=>(
                  <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.dept} · Avg {s.overall.toFixed(1)}/10 · {s.sessions}/10 sessions</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${s.bandCls}`}>{s.band}</span>
                        <Link href="/counselor/assign-practice" className="text-[9px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">Assign Session →</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 5: Department performance */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Performance by Department</h3>
                <Link href="/counselor/department-performance-report" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">Full Report</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[400px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      {['Department','Students','Avg Score','Progress','vs Cohort'].map(h=>(
                        <th key={h} className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {DEPT_PERF.map((d)=>{
                      const cohortAvg = 8.0;
                      const diff = d.avg - cohortAvg;
                      return (
                        <tr key={d.name} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                          <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-200">{d.name}</td>
                          <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{d.students}</td>
                          <td className="py-3 pr-4 font-bold text-slate-800 dark:text-white">{d.avg}/10</td>
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${d.color}`} style={{width:`${d.barW}%`}}/>
                              </div>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`text-xs font-bold ${diff>=0?'text-emerald-600 dark:text-emerald-400':'text-red-500'}`}>
                              {diff>=0?'+':''}{diff.toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ───────────────────────────── */}
          <div className="space-y-5">

            {/* Action Items */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={14} className="text-cyan-600"/>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Counselor Action Items</h3>
              </div>
              <div className="space-y-2.5">
                {ACTION_ITEMS.map((a,i)=>(
                  <div key={i} className={`rounded-lg px-3 py-2.5 ${U_CLS[a.urgency]}`}>
                    <div className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${U_DOT[a.urgency]}`}/>
                      <p className="text-[10px] text-slate-600 dark:text-[#8e92ad] leading-relaxed">{a.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 performers */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performers</h3>
                <Link href="/counselor/essay-ranking" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {STUDENTS.slice().sort((a,b)=>b.overall-a.overall).slice(0,5).map((s,i)=>(
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-300 dark:text-[#5a5f78] w-4 shrink-0">{i+1}</span>
                    <div className={`w-8 h-8 rounded-full ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{s.dept}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{s.overall.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Stats</h3>
              <div className="space-y-3">
                {[
                  { icon:Medal,      label:'Highest Overall Score', value:'9.2 – Maryam',   color:'text-amber-500'   },
                  { icon:TrendingUp, label:'Most Improved (MoM)',   value:'Amina Yusuf +0.8',color:'text-emerald-500' },
                  { icon:Clock,      label:'Avg Sessions/Student',  value:'7.3 / 10',        color:'text-blue-500'    },
                  { icon:BarChart2,  label:'Week-on-Week Growth',   value:'+6.2%',            color:'text-cyan-500'    },
                  { icon:BookOpen,   label:'Best Dept (avg)',       value:'Medicine 8.6',     color:'text-violet-500'  },
                  { icon:Zap,        label:'Completion Rate',       value:'87%',              color:'text-pink-500'    },
                ].map((s)=>(
                  <div key={s.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <s.icon size={13} className={s.color}/>
                      <span className="text-xs text-slate-500 dark:text-[#8e92ad]">{s.label}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-white">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Insight */}
            <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-cyan-200"/>
                <span className="text-xs font-bold text-cyan-100">AI Insight</span>
              </div>
              <p className="text-xs text-cyan-100 leading-relaxed mb-3">
                Students who completed <span className="font-bold text-white">8+ sessions</span> this month scored on average <span className="font-bold text-white">1.4 pts higher</span> than those with fewer than 5. Prioritise session attendance for low scorers.
              </p>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-white hover:text-cyan-200 transition-colors">
                View Detailed Analysis <ArrowUpRight size={11}/>
              </button>
            </div>

            {/* Related pages */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Related Reports</h3>
              <div className="space-y-1">
                {[
                  { label:'Essay Review Report',      href:'/counselor/essay-review-report',      icon:FileText   },
                  { label:'MMI Report',               href:'/counselor/mmi-report',               icon:Activity   },
                  { label:'Student Engagement',       href:'/counselor/student-engagement-report',icon:Users      },
                  { label:'Department Performance',   href:'/counselor/department-performance-report',icon:BarChart2},
                ].map((a)=>(
                  <Link key={a.label} href={a.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all group">
                    <a.icon size={13} className="shrink-0"/>
                    <span className="text-xs font-medium">{a.label}</span>
                    <ChevronRight size={11} className="ml-auto text-slate-300 dark:text-[#5a5f78] group-hover:text-cyan-400 transition-colors"/>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer banner ───────────────────────────────── */}
        <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"/>
          <p className="text-xs text-cyan-700 dark:text-cyan-300">
            Analytics data is updated in real-time. Last Updated May 24, 2025 at 2:00 PM
          </p>
        </div>

      </div>
    </div>
  );
}
