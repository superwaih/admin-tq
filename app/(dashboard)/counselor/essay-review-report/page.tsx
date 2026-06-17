'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Filter, Download,
  Users, TrendingUp, TrendingDown, ArrowUpRight, Sparkles,
  FileText, Star, CheckCircle2, Clock, AlertTriangle,
  BarChart2, Target, Zap, Eye, MessageSquare, BookOpen,
} from 'lucide-react';

// ── Types & data ──────────────────────────────────────────────────────────────

const STAT_CARDS = [
  { label: 'Total Essays',       value: '156',    change: '+15%', sub: 'vs last month',  icon: FileText,    iconBg: 'bg-cyan-50 dark:bg-cyan-500/15',      iconColor: 'text-cyan-600 dark:text-cyan-400',     positive: true  },
  { label: 'Avg Essay Score',    value: '8.1/10', change: '+0.6', sub: 'vs last month',  icon: Star,        iconBg: 'bg-violet-50 dark:bg-violet-500/15',  iconColor: 'text-violet-600 dark:text-violet-400', positive: true  },
  { label: 'Reviews Completed',  value: '142',    change: '+12%', sub: 'vs last month',  icon: CheckCircle2,iconBg: 'bg-emerald-50 dark:bg-emerald-500/15', iconColor: 'text-emerald-600 dark:text-emerald-400',positive: true  },
  { label: 'Pending Reviews',    value: '14',     change: '-8%',  sub: 'vs last month',  icon: Clock,       iconBg: 'bg-amber-50 dark:bg-amber-500/15',    iconColor: 'text-amber-600 dark:text-amber-400',   positive: true  },
  { label: 'Avg Review Time',    value: '2.4 days',change: '-0.3d',sub: 'vs last month', icon: Zap,         iconBg: 'bg-blue-50 dark:bg-blue-500/15',      iconColor: 'text-blue-600 dark:text-blue-400',     positive: true  },
  { label: 'Revision Rate',      value: '38%',    change: '-4%',  sub: 'vs last month',  icon: TrendingUp,  iconBg: 'bg-pink-50 dark:bg-pink-500/15',      iconColor: 'text-pink-600 dark:text-pink-400',     positive: true  },
];

type Category = 'Leadership' | 'Medicine' | 'Innovation' | 'Community Impact';
type ScoreLabel = 'Excellent' | 'Great' | 'Good' | 'Fair' | 'Needs Work';
type Trend = 'up' | 'down' | 'neutral';

interface EssayRow {
  name: string; initials: string; color: string; id: string;
  topic: string; category: Category;
  score: number; scoreLabel: ScoreLabel;
  reviewer: string; reviewedOn: string;
  revisions: number; status: string; statusCls: string;
  trend: Trend;
}

const ESSAYS: EssayRow[] = [
  { name:'Maryam Okafor',  initials:'MO', color:'bg-orange-400', id:'STU-2024-1005', topic:'Community Impact Initiative',     category:'Leadership',       score:9.2, scoreLabel:'Excellent', reviewer:'Dr. Sarah Johnson', reviewedOn:'May 22, 2025', revisions:0, status:'Approved',  statusCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'up'      },
  { name:'Fatima Bello',   initials:'FB', color:'bg-pink-500',   id:'STU-2024-1003', topic:'Overcoming Challenges',            category:'Innovation',       score:8.5, scoreLabel:'Great',     reviewer:'Dr. Emily Davis',   reviewedOn:'May 21, 2025', revisions:1, status:'Approved',  statusCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'up'      },
  { name:'Amina Yusuf',    initials:'AY', color:'bg-yellow-400', id:'STU-2024-1001', topic:'Why I Want to Study Medicine',     category:'Medicine',         score:9.2, scoreLabel:'Excellent', reviewer:'Dr. Sarah Johnson', reviewedOn:'May 20, 2025', revisions:1, status:'Approved',  statusCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'neutral' },
  { name:'Samuel Johnson', initials:'SJ', color:'bg-indigo-500', id:'STU-2024-1008', topic:'Innovation in Healthcare',         category:'Medicine',         score:8.9, scoreLabel:'Great',     reviewer:'Dr. Michael Brown', reviewedOn:'May 21, 2025', revisions:0, status:'Approved',  statusCls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', trend:'up'      },
  { name:'Joshua Adeyemi', initials:'JA', color:'bg-teal-500',   id:'STU-2024-1006', topic:'Lessons From Failure',             category:'Innovation',       score:7.8, scoreLabel:'Good',      reviewer:'Dr. James Wikson',  reviewedOn:'May 18, 2025', revisions:2, status:'Revising',  statusCls:'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trend:'up'      },
  { name:'Daniel Musa',    initials:'DM', color:'bg-blue-500',   id:'STU-2024-1002', topic:'My Leadership Journey',            category:'Leadership',       score:7.8, scoreLabel:'Good',      reviewer:'Dr. Emily Davis',   reviewedOn:'May 21, 2025', revisions:2, status:'Revising',  statusCls:'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',             trend:'down'    },
  { name:'Halima Sani',    initials:'HS', color:'bg-red-400',    id:'STU-2024-1007', topic:'My Vision for Global Health',      category:'Leadership',       score:7.2, scoreLabel:'Good',      reviewer:'Dr. James Wikson',  reviewedOn:'May 18, 2025', revisions:3, status:'Pending',   statusCls:'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',         trend:'down'    },
  { name:'Ibrahim Ali',    initials:'IA', color:'bg-green-500',  id:'STU-2024-1004', topic:'The Future of Artificial Intell.', category:'Medicine',         score:6.5, scoreLabel:'Fair',      reviewer:'Dr. Michael Brown', reviewedOn:'May 20, 2025', revisions:4, status:'Needs Work', statusCls:'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',                 trend:'down'    },
];

const CATEGORY_DISTRIBUTION = [
  { label: 'Leadership',       count: 52, pct: 33, color: 'bg-cyan-500',    dotColor: '#0891b2' },
  { label: 'Medicine',         count: 45, pct: 29, color: 'bg-violet-500',  dotColor: '#7c3aed' },
  { label: 'Innovation',       count: 38, pct: 24, color: 'bg-emerald-500', dotColor: '#10b981' },
  { label: 'Community Impact', count: 21, pct: 14, color: 'bg-amber-400',   dotColor: '#f59e0b' },
];

const SCORE_BANDS = [
  { label: 'Excellent (9–10)', count: 28, pct: 18, color: 'bg-emerald-500' },
  { label: 'Great (8–8.9)',    count: 54, pct: 35, color: 'bg-blue-500'    },
  { label: 'Good (7–7.9)',     count: 46, pct: 29, color: 'bg-cyan-400'    },
  { label: 'Fair (5–6.9)',     count: 20, pct: 13, color: 'bg-amber-400'   },
  { label: 'Needs Work (<5)',  count:  8, pct:  5, color: 'bg-red-400'     },
];

const REVIEWERS = [
  { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-indigo-500', reviewed: 52, avgScore: 8.8, pending: 2, scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Dr. Michael Brown', initials: 'MB', color: 'bg-violet-500', reviewed: 41, avgScore: 8.5, pending: 3, scoreCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Dr. Emily Davis',   initials: 'ED', color: 'bg-teal-500',   reviewed: 33, avgScore: 8.1, pending: 5, scoreCls: 'text-blue-600 dark:text-blue-400'       },
  { name: 'Dr. James Wikson',  initials: 'JW', color: 'bg-pink-500',   reviewed: 16, avgScore: 7.9, pending: 4, scoreCls: 'text-amber-600 dark:text-amber-400'     },
];

const ACTION_ITEMS = [
  { text: 'Ibrahim Ali has 4 revisions — schedule a 1:1 essay coaching session urgently', urgency: 'high'   },
  { text: 'Halima Sani essay is still Pending after 5 days — assign a reviewer today',    urgency: 'high'   },
  { text: 'Daniel Musa score dropped 0.4 pts — review feedback and suggest resources',    urgency: 'medium' },
  { text: '14 essays awaiting review — consider redistributing workload across reviewers',urgency: 'medium' },
  { text: 'Maryam Okafor and Amina Yusuf eligible for scholarship essay track (9.2 avg)', urgency: 'info'   },
];
const URGENCY_CLS: Record<string, string> = {
  high:   'bg-red-50 dark:bg-red-500/15 border-l-2 border-red-400',
  medium: 'bg-amber-50 dark:bg-amber-500/15 border-l-2 border-amber-400',
  info:   'bg-emerald-50 dark:bg-emerald-500/15 border-l-2 border-emerald-400',
};
const URGENCY_DOT: Record<string, string> = { high: 'bg-red-500', medium: 'bg-amber-400', info: 'bg-emerald-500' };

const TREND_DATA = [5.8, 6.4, 7.0, 7.5, 7.8, 8.1, 8.4];
const TREND_LABELS = ['Apr 21', 'Apr 28', 'May 5', 'May 12', 'May 19', 'May 26', 'Jun 2'];

// ── Score line chart ──────────────────────────────────────────────────────────
function ScoreTrendChart() {
  const W = 380, H = 110, p = { t: 12, b: 24, l: 28, r: 10 };
  const iw = W - p.l - p.r, ih = H - p.t - p.b;
  const yMin = 4, yMax = 10;
  const px = (i: number) => p.l + (i / (TREND_DATA.length - 1)) * iw;
  const py = (v: number) => p.t + ih - ((v - yMin) / (yMax - yMin)) * ih;
  const pts = TREND_DATA.map((v, i) => `${px(i)},${py(v)}`).join(' ');
  // filled area
  const area = `M ${px(0)},${py(TREND_DATA[0])} ` + TREND_DATA.map((v, i) => `L ${px(i)},${py(v)}`).join(' ') + ` L ${px(TREND_DATA.length - 1)},${p.t + ih} L ${px(0)},${p.t + ih} Z`;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ minHeight: H }}>
      {[4, 6, 8, 10].map(v => (
        <line key={v} x1={p.l} x2={W - p.r} y1={py(v)} y2={py(v)} stroke="#e2e8f0" strokeWidth={0.5} strokeDasharray="3 3" />
      ))}
      {[4, 6, 8, 10].map(v => (
        <text key={`y${v}`} x={p.l - 4} y={py(v) + 4} textAnchor="end" style={{ fontSize: 7, fill: '#94a3b8' }}>{v}</text>
      ))}
      {TREND_LABELS.map((l, i) => (
        <text key={l} x={px(i)} y={H - 4} textAnchor="middle" style={{ fontSize: 6.5, fill: '#94a3b8' }}>{l}</text>
      ))}
      <path d={area} fill="#0891b2" opacity={0.08} />
      <polyline points={pts} fill="none" stroke="#0891b2" strokeWidth={2} />
      {TREND_DATA.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r={3} fill="#0891b2" />)}
    </svg>
  );
}

// ── Score donut ───────────────────────────────────────────────────────────────
function ScoreDonut() {
  const segs = CATEGORY_DISTRIBUTION.map(c => ({ pct: c.pct, color: c.dotColor }));
  const r = 50, cx = 64, cy = 64, stroke = 16, circ = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      {segs.map((s, i) => {
        const dash = (s.pct / 100) * circ, gap = circ - dash;
        const el = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-off * circ / 100}
          transform={`rotate(-90 ${cx} ${cy})`} strokeLinecap="butt" />;
        off += s.pct; return el;
      })}
      <text x={cx} y={cx - 6}  textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fill: '#0f172a' }}>156</text>
      <text x={cx} y={cx + 11} textAnchor="middle" style={{ fontSize: 8, fill: '#94a3b8' }}>Essays</text>
    </svg>
  );
}

// ── Horizontal bar ────────────────────────────────────────────────────────────
function HBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 w-6 text-right">{pct}%</span>
    </div>
  );
}

// ── Trend icon ────────────────────────────────────────────────────────────────
function TrendIcon({ t }: { t: Trend }) {
  return t === 'up'
    ? <ArrowUpRight size={13} className="text-emerald-500" />
    : t === 'down'
    ? <TrendingDown size={13} className="text-red-400" />
    : <span className="text-slate-300 dark:text-[#5a5f78] text-xs">—</span>;
}

// ── Score label badge ─────────────────────────────────────────────────────────
function ScoreBadge({ score, label }: { score: number; label: string }) {
  const cls = score >= 9 ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
    : score >= 8 ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300'
    : score >= 7 ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300'
    : score >= 5 ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300'
    : 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300';
  return (
    <div className="flex items-center gap-1.5">
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${cls}`}>{score.toFixed(1)}</span>
      <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{label}</span>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function EssayReviewReportPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'Approved' | 'Pending' | 'Needs Work'>('All');
  const [page] = useState(1);

  const filtered = activeTab === 'All' ? ESSAYS
    : activeTab === 'Approved'   ? ESSAYS.filter(e => e.status === 'Approved')
    : activeTab === 'Pending'    ? ESSAYS.filter(e => e.status === 'Pending' || e.status === 'Revising')
    : ESSAYS.filter(e => e.status === 'Needs Work');

  const pending = ESSAYS.filter(e => e.status === 'Pending' || e.status === 'Needs Work');

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
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Essay Review Reports</h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Full essay performance insights — scores, reviewer workload, trends & counselor action items.
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
                {c.positive
                  ? <div className="flex items-center gap-0.5"><ArrowUpRight size={11} className="text-emerald-500" /><span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{c.change}</span></div>
                  : <div className="flex items-center gap-0.5"><TrendingDown size={11} className="text-red-500" /><span className="text-[10px] font-bold text-red-500">{c.change}</span></div>
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

          {/* ── LEFT + CENTRE (span 2) ──────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Row 1: Trend + Distribution donut */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">

              {/* Average score trend */}
              <div className="md:col-span-3 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Average Essay Score Trend</h3>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">↑ +2.3 pts since Apr</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mb-3">7-week rolling average across all reviewed essays</p>
                <ScoreTrendChart />
              </div>

              {/* Category distribution */}
              <div className="md:col-span-2 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Essays by Category</h3>
                <div className="flex flex-col items-center gap-3">
                  <ScoreDonut />
                  <div className="w-full space-y-2">
                    {CATEGORY_DISTRIBUTION.map((c) => (
                      <div key={c.label}>
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ background: c.dotColor }} />
                            <span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">{c.label}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{c.count}</span>
                        </div>
                        <HBar pct={c.pct} color={c.color} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: Score distribution */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Score Distribution</h3>
              <div className="space-y-3">
                {SCORE_BANDS.map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 dark:text-[#8e92ad] w-36 shrink-0">{b.label}</span>
                    <div className="flex-1 h-2.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct * 2.5}%` }} />
                    </div>
                    <div className="flex items-center gap-1.5 w-16 shrink-0">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{b.count}</span>
                      <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">({b.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Essay detail table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Essay Review Details</h3>
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/6 rounded-xl p-1 w-fit">
                  {(['All', 'Approved', 'Pending', 'Needs Work'] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                        activeTab === tab
                          ? 'bg-white dark:bg-[#1e2335] text-slate-800 dark:text-white shadow-sm'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}>{tab}</button>
                  ))}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/6">
                      {['Student', 'Essay Topic', 'Category', 'Score', 'Reviewer', 'Reviewed On', 'Revisions', 'Status', 'Trend'].map(h => (
                        <th key={h} className="pb-2.5 text-left text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] pr-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {filtered.map((e, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full ${e.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{e.initials}</div>
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-800 dark:text-white truncate whitespace-nowrap text-xs">{e.name}</p>
                              <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{e.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-3 max-w-[130px]">
                          <p className="text-xs text-slate-600 dark:text-slate-300 truncate">{e.topic}</p>
                        </td>
                        <td className="py-3 pr-3">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 whitespace-nowrap">{e.category}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <ScoreBadge score={e.score} label={e.scoreLabel} />
                        </td>
                        <td className="py-3 pr-3">
                          <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap truncate max-w-[100px]">{e.reviewer}</p>
                        </td>
                        <td className="py-3 pr-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{e.reviewedOn}</td>
                        <td className="py-3 pr-3 text-center">
                          <span className={`text-xs font-bold ${e.revisions > 2 ? 'text-red-500' : e.revisions > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>{e.revisions}</span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${e.statusCls}`}>{e.status}</span>
                        </td>
                        <td className="py-3"><TrendIcon t={e.trend} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-gray-100 dark:border-white/6">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing {filtered.length} of 156 essays</p>
                <div className="flex items-center gap-1">
                  <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/8 flex items-center justify-center text-slate-400 hover:border-cyan-400 transition-all"><ChevronLeft size={13} /></button>
                  {[1, 2, 3, '...', 15].map((p, i) => (
                    <button key={i} className={`w-7 h-7 rounded-lg text-xs font-semibold transition-all ${p === page ? 'bg-cyan-600 text-white shadow-sm' : 'border border-gray-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:border-cyan-400'}`}>{p}</button>
                  ))}
                  <button className="w-7 h-7 rounded-lg border border-gray-200 dark:border-white/8 flex items-center justify-center text-slate-400 hover:border-cyan-400 transition-all"><ChevronRight size={13} /></button>
                </div>
              </div>
            </div>

            {/* Row 4: Essays requiring attention */}
            {pending.length > 0 && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle size={15} className="text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Essays Requiring Immediate Attention</h3>
                  <span className="ml-auto text-[10px] font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">{pending.length} essays</span>
                </div>
                <div className="space-y-3">
                  {pending.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                      <div className={`w-9 h-9 rounded-xl ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white">{e.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{e.topic} · {e.revisions} revisions · Score {e.score}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${e.statusCls}`}>{e.status}</span>
                        <button className="text-[9px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-0.5">
                          <MessageSquare size={10} /> Send Feedback
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT SIDEBAR ───────────────────────────── */}
          <div className="space-y-5">

            {/* Action Items */}
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

            {/* Reviewer Workload */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Reviewer Workload</h3>
              <div className="space-y-4">
                {REVIEWERS.map((r, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full ${r.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{r.initials}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{r.name}</p>
                        <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{r.reviewed} reviewed · <span className="text-amber-500">{r.pending} pending</span></p>
                      </div>
                      <span className={`text-xs font-bold shrink-0 ${r.scoreCls}`}>{r.avgScore}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.reviewed / 60) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                View All Reviewers
              </button>
            </div>

            {/* Top essay students */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Essay Writers</h3>
                <Link href="/counselor/essay-ranking" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {ESSAYS.slice().sort((a, b) => b.score - a.score).slice(0, 5).map((e, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <span className="text-xs font-bold text-slate-300 dark:text-[#5a5f78] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-full ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{e.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] truncate">{e.category}</p>
                    </div>
                    <ScoreBadge score={e.score} label="" />
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
                Students who received feedback within <span className="font-bold text-white">24 hours</span> improved their essay score by an average of <span className="font-bold text-white">+1.2 pts</span> on resubmission.
              </p>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-white hover:text-violet-200 transition-colors">
                View Detailed Analysis <ArrowUpRight size={11} />
              </button>
            </div>

            {/* Quick links */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Related Pages</h3>
              <div className="space-y-1">
                {[
                  { label: 'Essay Reviews',         href: '/counselor/essay-reviews',   icon: FileText  },
                  { label: 'Essay Rankings',         href: '/counselor/essay-ranking',   icon: Star      },
                  { label: 'Student Engagement',     href: '/counselor/student-engagement-report', icon: Users },
                  { label: 'Messages',              href: '/counselor/messages',        icon: MessageSquare },
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
