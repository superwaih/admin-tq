'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, ChevronDown, Search, Filter,
  TrendingUp, TrendingDown, Minus, Eye, Download, Star,
  BarChart2, BookOpen, Users, CheckCircle2,
} from 'lucide-react';

// ── Data ───────────────────────────────────────────────────────────────────────
type Category = 'Leadership' | 'Medicine' | 'Innovation' | 'Community Impact';
type Trend     = 'up' | 'down' | 'neutral';

interface EssayRow {
  id: string;
  name: string;
  initials: string;
  color: string;
  studentId: string;
  topic: string;
  category: Category;
  reviewedOn: string;
  reviewedTime: string;
  score: number;
  scoreLabel: string;
  trend: Trend;
}

const ESSAYS: EssayRow[] = [
  { id:'e1', name:'Amina Yusuf',    initials:'AY', color:'bg-yellow-400', studentId:'STU-2024-1001', topic:'Why I Want to Study',          category:'Leadership',       reviewedOn:'May 20, 2025', reviewedTime:'2:30 PM',  score:9.2, scoreLabel:'Excellent', trend:'up'      },
  { id:'e2', name:'Daniel Musa',    initials:'DM', color:'bg-blue-500',   studentId:'STU-2024-1002', topic:'My Leadership Journey',         category:'Medicine',         reviewedOn:'May 21, 2025', reviewedTime:'9:15 AM',  score:7.8, scoreLabel:'Good',      trend:'down'    },
  { id:'e3', name:'Fatima Bello',   initials:'FB', color:'bg-pink-500',   studentId:'STU-2024-1003', topic:'Overcoming Challenges',         category:'Innovation',       reviewedOn:'May 21, 2025', reviewedTime:'11:45 AM', score:8.5, scoreLabel:'Great',     trend:'down'    },
  { id:'e4', name:'Ibrahim Ali',    initials:'IA', color:'bg-green-500',  studentId:'STU-2024-1004', topic:'The Future of Artificial',      category:'Medicine',         reviewedOn:'May 20, 2025', reviewedTime:'4:20 PM',  score:7.8, scoreLabel:'Good',      trend:'neutral' },
  { id:'e5', name:'Maryam Okafor', initials:'MO', color:'bg-orange-400', studentId:'STU-2024-1005', topic:'Community Impact Initiat.',     category:'Leadership',       reviewedOn:'May 19, 2025', reviewedTime:'7:30 PM',  score:9.2, scoreLabel:'Excellent', trend:'neutral' },
  { id:'e6', name:'Joshua Adeyemi', initials:'JA', color:'bg-teal-500',   studentId:'STU-2024-1006', topic:'Lessons From Failure',          category:'Innovation',       reviewedOn:'May 18, 2025', reviewedTime:'3:10 PM',  score:7.8, scoreLabel:'Good',      trend:'up'      },
  { id:'e7', name:'Halima Sani',   initials:'HS', color:'bg-purple-500', studentId:'STU-2024-1007', topic:'My Vision for Global Heal.',    category:'Leadership',       reviewedOn:'May 18, 2025', reviewedTime:'12:40 PM', score:9.2, scoreLabel:'Excellent', trend:'down'    },
  { id:'e8', name:'Samuel Johnson', initials:'SJ', color:'bg-indigo-500', studentId:'STU-2024-1008', topic:'Innovation in Healthcare',      category:'Medicine',         reviewedOn:'May 18, 2025', reviewedTime:'12:40 PM', score:9.2, scoreLabel:'Excellent', trend:'neutral' },
];

const CATEGORY_TABS = [
  { id:'all',              label:'All Essays',       count:120 },
  { id:'Leadership',       label:'Leadership',        count:24  },
  { id:'Medicine',         label:'Medicine',          count:18  },
  { id:'Innovation',       label:'Innovation',        count:62  },
  { id:'Community Impact', label:'Community Impact',  count:16  },
  { id:'recently',         label:'Recently Viewed',   count:16  },
];

const CAT_BADGE: Record<Category, string> = {
  Leadership:       'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  Medicine:         'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
  Innovation:       'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  'Community Impact':'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
};

const TOP_REVIEWERS = [
  { name:'Dr. Sarah Johnson', initials:'SJ', color:'bg-cyan-600',   essays:'62 essays', score:'9.3/10', rank:1 },
  { name:'Dr. Michael Brown', initials:'MB', color:'bg-orange-400', essays:'35 essays', score:'8.3/10', rank:2 },
  { name:'Dr. Emily Davis',   initials:'ED', color:'bg-purple-500', essays:'27 essays', score:'8.1/10', rank:3 },
  { name:'Dr. James Wilkson', initials:'JW', color:'bg-pink-500',   essays:'19 essays', score:'7.8/10', rank:4 },
];

const PAGES = 15;

function TrendIcon({ trend }: { trend: Trend }) {
  if (trend === 'up')      return <TrendingUp  size={14} className="text-emerald-500" />;
  if (trend === 'down')    return <TrendingDown size={14} className="text-red-500" />;
  return <Minus size={14} className="text-slate-400" />;
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function EssayRankingPage() {
  const [activeTab,   setActiveTab]   = useState('all');
  const [search,      setSearch]      = useState('');
  const [sortBy,      setSortBy]      = useState('Highly Rated');
  const [currentPage, setCurrentPage] = useState(1);
  const [exported,    setExported]    = useState(false);

  const filtered = ESSAYS.filter(e => {
    const matchTab = activeTab === 'all' || activeTab === 'recently' || e.category === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || e.name.toLowerCase().includes(q) || e.topic.toLowerCase().includes(q) || e.category.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  function handleExport() {
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="mb-5">
          <Link
            href="/counselor/essay-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to Essay Review
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Essay Ranking
              </h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
                Track highest performing student essays and review insights.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search essays..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 w-44"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                <Filter size={12} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
          {[
            { label:'Highest Score', sub:'Maryam Okafor',    value:'9.810',  icon:<Star size={18} />,       iconBg:'bg-amber-50 dark:bg-amber-500/15',   iconColor:'text-amber-500', change:null },
            { label:'Average Score', sub:'+4% vs last month', value:'8.4/10', icon:<BarChart2 size={18} />,   iconBg:'bg-cyan-50 dark:bg-cyan-500/15',     iconColor:'text-cyan-600',  change:'+4%' },
            { label:'Improvement Rate',sub:'+4% vs last month',value:'12%',   icon:<TrendingUp size={18} />, iconBg:'bg-emerald-50 dark:bg-emerald-500/15',iconColor:'text-emerald-600',change:'+4%' },
            { label:'Total Reviewed', sub:'Essays',           value:'62',     icon:<BookOpen size={18} />,   iconBg:'bg-purple-50 dark:bg-purple-500/15',  iconColor:'text-purple-600', change:null },
          ].map(s => (
            <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
              <div className={`w-9 h-9 rounded-xl ${s.iconBg} ${s.iconColor} flex items-center justify-center mb-3`}>
                {s.icon}
              </div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{s.label}</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white mt-0.5">{s.value}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {s.change && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{s.change}</span>
                )}
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main two-column layout ───────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 items-start">

          {/* ── Left: table area ─────────────────────────────── */}
          <div>
            {/* Category tabs + sort */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <div className="flex flex-wrap gap-2 flex-1">
                {CATEGORY_TABS.map(t => {
                  const isActive = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {t.label}
                      <span className={`text-[10px] font-bold ${isActive ? 'opacity-80' : 'opacity-60'}`}>{t.count}</span>
                    </button>
                  );
                })}
              </div>
              {/* Sort */}
              <div className="relative shrink-0">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-3 pr-7 py-2 text-xs bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-slate-600 dark:text-[#8e92ad] focus:outline-none shadow-sm"
                >
                  {['Highly Rated','Lowest Rated','Most Recent','Oldest'].map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

              {/* Table header */}
              <div className="hidden lg:grid grid-cols-[2fr_2fr_auto_auto_auto_auto_auto_auto] gap-3 px-5 py-3 border-b border-gray-50 dark:border-white/[0.04]">
                {['Student','Essay Topic','Category','Reviewed On','Score','Reviewer','Trend','Action'].map(h => (
                  <p key={h} className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{h}</p>
                ))}
              </div>

              {/* Rows */}
              <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((e, idx) => (
                  <div
                    key={e.id}
                    className={`flex flex-col lg:grid lg:grid-cols-[2fr_2fr_auto_auto_auto_auto_auto_auto] lg:items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${idx === 0 ? 'bg-amber-50/30 dark:bg-amber-500/5' : ''}`}
                  >
                    {/* Student */}
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {e.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{e.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">ID: {e.studentId}</p>
                      </div>
                    </div>

                    {/* Topic */}
                    <p className="text-xs font-medium text-slate-600 dark:text-[#c8ccdf] truncate">{e.topic}</p>

                    {/* Category badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${CAT_BADGE[e.category]}`}>
                      {e.category}
                    </span>

                    {/* Reviewed on */}
                    <div className="hidden lg:block">
                      <p className="text-xs text-slate-600 dark:text-[#c8ccdf] whitespace-nowrap">{e.reviewedOn}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.reviewedTime}</p>
                    </div>

                    {/* Score */}
                    <div>
                      <p className={`text-sm font-bold whitespace-nowrap ${e.score >= 9 ? 'text-emerald-600 dark:text-emerald-400' : e.score >= 8 ? 'text-cyan-600 dark:text-cyan-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {e.score}/10
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.scoreLabel}</p>
                    </div>

                    {/* Reviewer */}
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">SJ</div>
                      <span className="text-xs text-slate-600 dark:text-[#c8ccdf] hidden xl:block whitespace-nowrap">Dr. Sarah Johnson</span>
                    </div>

                    {/* Trend */}
                    <TrendIcon trend={e.trend} />

                    {/* Action */}
                    <button className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-all">
                      <Eye size={14} />
                    </button>
                  </div>
                ))}

                {filtered.length === 0 && (
                  <div className="px-5 py-12 text-center">
                    <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No essays match your search</p>
                    <p className="text-xs text-slate-400 dark:text-[#40455e] mt-1">Try adjusting the filters or search term</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-5 py-4 border-t border-gray-50 dark:border-white/[0.04]">
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">
                  Showing 1 to {Math.min(8, filtered.length)} of{' '}
                  <span className="font-bold text-slate-600 dark:text-[#c8ccdf]">120</span> essays
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-gray-100 dark:hover:bg-white/8 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  {[1, 2, 3].map(p => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        currentPage === p
                          ? 'bg-cyan-600 text-white'
                          : 'text-slate-500 dark:text-[#8e92ad] hover:bg-gray-100 dark:hover:bg-white/8'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <span className="text-xs text-slate-400">…</span>
                  <button
                    onClick={() => setCurrentPage(PAGES)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      currentPage === PAGES
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-500 dark:text-[#8e92ad] hover:bg-gray-100 dark:hover:bg-white/8'
                    }`}
                  >
                    {PAGES}
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(PAGES, p + 1))}
                    disabled={currentPage === PAGES}
                    className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-gray-100 dark:hover:bg-white/8 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────── */}
          <div className="space-y-4">

            {/* Performance Insights */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance Insights</h3>
              <div className="space-y-3.5">
                {[
                  { label:'Most Improved',        sub:'Daniel Musa',           value:'1.4/10',  valueColor:'text-emerald-600 dark:text-emerald-400' },
                  { label:'Best Writing Structure', sub:'Maryam Okafor',        value:'9/10',    valueColor:'text-cyan-600 dark:text-cyan-400' },
                  { label:'Most Common Weakness',  sub:'Evidence & Examples',  value:'Avg 8/10', valueColor:'text-amber-600 dark:text-amber-400' },
                  { label:'Strongest Category',    sub:'Leadership Essay',      value:'28%',     valueColor:'text-indigo-600 dark:text-indigo-400' },
                ].map(item => (
                  <div key={item.label} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{item.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{item.sub}</p>
                    </div>
                    <span className={`text-xs font-bold shrink-0 px-2 py-0.5 rounded-lg bg-gray-50 dark:bg-white/5 ${item.valueColor}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Reviewers */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Top Reviewers</h3>
              <div className="space-y-3">
                {TOP_REVIEWERS.map(r => (
                  <div key={r.rank} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] w-4 shrink-0">{r.rank}</span>
                    <div className={`w-8 h-8 rounded-lg ${r.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {r.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{r.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.essays} ({r.score})</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
                View All Reviewers <ChevronRight size={11} />
              </button>
            </div>

            {/* Export */}
            <button
              onClick={handleExport}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold shadow-sm transition-all ${
                exported
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
              }`}
            >
              {exported
                ? <><CheckCircle2 size={15} /> Exported!</>
                : <><Download size={15} /> Export Ranking</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
