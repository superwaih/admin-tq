'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Search, Download, MoreHorizontal,
  MessageSquare, FileText, Calendar, Upload, Bell, BookOpen,
  CheckCircle2, AlertCircle, X,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type ActivityType = 'Sessions' | 'Applications' | 'Messages' | 'Reviews' | 'Resources' | 'System';
type PerformedBy  = 'YOU' | 'Students' | 'System';

interface Activity {
  id: number;
  type: ActivityType;
  title: string;
  subtitle: string;
  time: string;
  date: string;        // "2026-05-20" for grouping
  dateLabel: string;   // "Today" / "Yesterday" / "May 18, 2026"
  avatarInitials: string;
  avatarColor: string;
  timeDisplay: string;
  performedBy: PerformedBy;
}

// ── Icon map ──────────────────────────────────────────────────────────────────
const TYPE_META: Record<ActivityType, { icon: React.ReactNode; bg: string; iconColor: string; dot: string }> = {
  Sessions:     { icon: <Calendar  size={13} />, bg: 'bg-blue-100   dark:bg-blue-500/20',    iconColor: 'text-blue-600   dark:text-blue-400',    dot: 'bg-blue-500'    },
  Applications: { icon: <FileText  size={13} />, bg: 'bg-violet-100 dark:bg-violet-500/20',  iconColor: 'text-violet-600 dark:text-violet-400',  dot: 'bg-violet-500'  },
  Messages:     { icon: <MessageSquare size={13} />, bg: 'bg-emerald-100 dark:bg-emerald-500/20', iconColor: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Reviews:      { icon: <BookOpen  size={13} />, bg: 'bg-amber-100  dark:bg-amber-500/20',   iconColor: 'text-amber-600  dark:text-amber-400',   dot: 'bg-amber-500'   },
  Resources:    { icon: <Upload    size={13} />, bg: 'bg-pink-100   dark:bg-pink-500/20',    iconColor: 'text-pink-600   dark:text-pink-400',    dot: 'bg-pink-500'    },
  System:       { icon: <Bell      size={13} />, bg: 'bg-slate-100  dark:bg-white/8',        iconColor: 'text-slate-500  dark:text-slate-400',   dot: 'bg-slate-400'   },
};

// ── Mock data ──────────────────────────────────────────────────────────────────
const ACTIVITIES: Activity[] = [
  // Today — May 20
  { id:1,  type:'Sessions',     title:'Aisha Patel joined the session',       subtitle:'Essay Review · Today, 4:02 PM',                   time:'4:02 PM',  date:'2026-05-20', dateLabel:'Today · May 20, 2026',     avatarInitials:'AY', avatarColor:'bg-amber-400',   timeDisplay:'2:00 PM',  performedBy:'Students' },
  { id:2,  type:'Reviews',      title:'You reviewed an essay for Ethan',      subtitle:'Personal Statement · Today, 11:30 AM',             time:'11:30 AM', date:'2026-05-20', dateLabel:'Today · May 20, 2026',     avatarInitials:'AY', avatarColor:'bg-amber-400',   timeDisplay:'2:00 PM',  performedBy:'YOU'      },
  { id:3,  type:'Sessions',     title:'Sophie Martin booked a session',       subtitle:'MMI Prep · Yesterday, 6:15 PM',                   time:'6:15 PM',  date:'2026-05-20', dateLabel:'Today · May 20, 2026',     avatarInitials:'DM', avatarColor:'bg-blue-500',    timeDisplay:'4:30 PM',  performedBy:'Students' },
  { id:4,  type:'Resources',    title:'New resource uploaded',                subtitle:'MMI Preparation Guide.pdf · May 16',               time:'9:00 AM',  date:'2026-05-20', dateLabel:'Today · May 20, 2026',     avatarInitials:'FB', avatarColor:'bg-pink-500',    timeDisplay:'1:00 PM',  performedBy:'YOU'      },
  // Yesterday — May 19
  { id:5,  type:'Sessions',     title:'Aisha Patel joined the session',       subtitle:'Essay Review · Today, 4:02 PM',                   time:'4:02 PM',  date:'2026-05-19', dateLabel:'Yesterday · May 19, 2026', avatarInitials:'AY', avatarColor:'bg-amber-400',   timeDisplay:'2:00 PM',  performedBy:'Students' },
  { id:6,  type:'Reviews',      title:'You reviewed an essay for Ethan',      subtitle:'Personal Statement · Today, 11:30 AM',             time:'11:30 AM', date:'2026-05-19', dateLabel:'Yesterday · May 19, 2026', avatarInitials:'AY', avatarColor:'bg-amber-400',   timeDisplay:'2:00 PM',  performedBy:'YOU'      },
  { id:7,  type:'Sessions',     title:'Sophie Martin booked a session',       subtitle:'MMI Prep · Yesterday, 6:15 PM',                   time:'6:15 PM',  date:'2026-05-19', dateLabel:'Yesterday · May 19, 2026', avatarInitials:'DM', avatarColor:'bg-blue-500',    timeDisplay:'4:30 PM',  performedBy:'Students' },
  { id:8,  type:'Resources',    title:'New resource uploaded',                subtitle:'MMI Preparation Guide.pdf · May 16',               time:'9:00 AM',  date:'2026-05-19', dateLabel:'Yesterday · May 19, 2026', avatarInitials:'FB', avatarColor:'bg-pink-500',    timeDisplay:'1:00 PM',  performedBy:'YOU'      },
  // May 18
  { id:9,  type:'Sessions',     title:'Aisha Patel joined the session',       subtitle:'Essay Review · Today, 4:02 PM',                   time:'4:02 PM',  date:'2026-05-18', dateLabel:'May 18, 2026',             avatarInitials:'AY', avatarColor:'bg-amber-400',   timeDisplay:'2:00 PM',  performedBy:'Students' },
  { id:10, type:'Reviews',      title:'You reviewed an essay for Ethan',      subtitle:'Personal Statement · Today, 11:30 AM',             time:'11:30 AM', date:'2026-05-18', dateLabel:'May 18, 2026',             avatarInitials:'AY', avatarColor:'bg-amber-400',   timeDisplay:'2:00 PM',  performedBy:'YOU'      },
  { id:11, type:'Sessions',     title:'Sophie Martin booked a session',       subtitle:'MMI Prep · Yesterday, 6:15 PM',                   time:'6:15 PM',  date:'2026-05-18', dateLabel:'May 18, 2026',             avatarInitials:'DM', avatarColor:'bg-blue-500',    timeDisplay:'4:30 PM',  performedBy:'Students' },
  { id:12, type:'Resources',    title:'New resource uploaded',                subtitle:'MMI Preparation Guide.pdf · May 16',               time:'9:00 AM',  date:'2026-05-18', dateLabel:'May 18, 2026',             avatarInitials:'FB', avatarColor:'bg-pink-500',    timeDisplay:'1:00 PM',  performedBy:'YOU'      },
  // May 17
  { id:13, type:'Applications', title:'New application submitted by Liam Kay', subtitle:'MD Program · McGill University · May 17, 9:00 AM', time:'9:00 AM', date:'2026-05-17', dateLabel:'May 17, 2026',            avatarInitials:'LK', avatarColor:'bg-indigo-500',  timeDisplay:'9:00 AM',  performedBy:'Students' },
  { id:14, type:'Messages',     title:'Message sent to Ibrahim Ali',           subtitle:'Regarding essay deadline extension',               time:'11:00 AM', date:'2026-05-17', dateLabel:'May 17, 2026',            avatarInitials:'IA', avatarColor:'bg-teal-500',    timeDisplay:'11:00 AM', performedBy:'YOU'      },
  { id:15, type:'System',       title:'System maintenance completed',          subtitle:'Platform updated to v2.4.1',                       time:'3:00 AM',  date:'2026-05-17', dateLabel:'May 17, 2026',            avatarInitials:'SY', avatarColor:'bg-slate-400',   timeDisplay:'3:00 AM',  performedBy:'System'   },
  // May 16
  { id:16, type:'Reviews',      title:'Essay reviewed: Fatima Bello',          subtitle:'University of Toronto Personal Statement',         time:'2:30 PM',  date:'2026-05-16', dateLabel:'May 16, 2026',            avatarInitials:'FB', avatarColor:'bg-pink-500',    timeDisplay:'2:30 PM',  performedBy:'YOU'      },
  { id:17, type:'Sessions',     title:'MMI coaching session completed',         subtitle:'Joshua Adeyemi · 1 hr session',                   time:'10:00 AM', date:'2026-05-16', dateLabel:'May 16, 2026',            avatarInitials:'JA', avatarColor:'bg-emerald-500', timeDisplay:'10:00 AM', performedBy:'YOU'      },
  { id:18, type:'Applications', title:'Application stage updated',              subtitle:'Maryam Okafor moved to Essays stage',             time:'4:45 PM',  date:'2026-05-16', dateLabel:'May 16, 2026',            avatarInitials:'MO', avatarColor:'bg-orange-500',  timeDisplay:'4:45 PM',  performedBy:'YOU'      },
  // May 15
  { id:19, type:'Messages',     title:'Message received from Daniel Musa',      subtitle:'Question about DDS Program requirements',         time:'8:15 AM',  date:'2026-05-15', dateLabel:'May 15, 2026',            avatarInitials:'DM', avatarColor:'bg-blue-500',    timeDisplay:'8:15 AM',  performedBy:'Students' },
  { id:20, type:'Resources',    title:'Resource shared with students',           subtitle:'Canadian Med School Guide 2026 · 5 recipients',   time:'1:00 PM',  date:'2026-05-15', dateLabel:'May 15, 2026',            avatarInitials:'SJ', avatarColor:'bg-indigo-600',  timeDisplay:'1:00 PM',  performedBy:'YOU'      },
];

const ALL_TYPES: ActivityType[] = ['Sessions','Applications','Messages','Reviews','Resources','System'];
const PAGE_SIZE = 10;

// ── Date range labels ─────────────────────────────────────────────────────────
const DATE_RANGES = ['May 21 – 26, 2026','May 14 – 20, 2026','May 7 – 13, 2026','All Dates'];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function RecentActivityPage() {
  const [search,      setSearch]      = useState('');
  const [typeFilter,  setTypeFilter]  = useState<'All Activity Types' | ActivityType>('All Activity Types');
  const [performedBy, setPerformedBy] = useState<'All Users' | PerformedBy>('All Users');
  const [dateRange,   setDateRange]   = useState(DATE_RANGES[0]);
  const [startDate,   setStartDate]   = useState('2026-05-13');
  const [endDate,     setEndDate]     = useState('2026-05-20');
  const [page,        setPage]        = useState(1);

  // Type filter dropdown state
  const [showTypeDrop, setShowTypeDrop] = useState(false);
  const [showDateDrop, setShowDateDrop] = useState(false);

  function clearAll() {
    setTypeFilter('All Activity Types');
    setPerformedBy('All Users');
    setDateRange(DATE_RANGES[0]);
    setSearch('');
    setPage(1);
  }

  const filtered = useMemo(() => {
    return ACTIVITIES.filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q);
      const matchType   = typeFilter === 'All Activity Types' || a.type === typeFilter;
      const matchBy     = performedBy === 'All Users' || a.performedBy === performedBy;
      return matchSearch && matchType && matchBy;
    });
  }, [search, typeFilter, performedBy]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; items: Activity[] }>();
    filtered.forEach(a => {
      if (!map.has(a.date)) map.set(a.date, { label: a.dateLabel, items: [] });
      map.get(a.date)!.items.push(a);
    });
    return Array.from(map.values());
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link
              href="/counselor"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
            >
              <ChevronLeft size={15} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Recent Activity
            </h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              A detailed log of recent actions and updates across your account.
            </p>
          </div>
          <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm shrink-0">
            <Download size={14} /> Export Activity
          </button>
        </div>

        {/* ── Two-column layout ──────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-5 items-start">

          {/* ── Activity feed ─────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* Search + date + type toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 px-4 py-3.5 border-b border-gray-100 dark:border-white/5">
              {/* Search */}
              <div className="relative flex-1 min-w-[160px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search activity..."
                  className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Date range dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowDateDrop(s => !s); setShowTypeDrop(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all whitespace-nowrap"
                >
                  {dateRange}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${showDateDrop ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {showDateDrop && (
                  <div className="absolute z-20 top-full left-0 mt-1.5 w-48 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                    {DATE_RANGES.map(r => (
                      <button key={r} onClick={() => { setDateRange(r); setShowDateDrop(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${dateRange === r ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Type dropdown */}
              <div className="relative">
                <button
                  onClick={() => { setShowTypeDrop(s => !s); setShowDateDrop(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all whitespace-nowrap"
                >
                  {typeFilter}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform ${showTypeDrop ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6"/></svg>
                </button>
                {showTypeDrop && (
                  <div className="absolute z-20 top-full right-0 mt-1.5 w-48 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                    {['All Activity Types', ...ALL_TYPES].map(t => (
                      <button key={t} onClick={() => { setTypeFilter(t as typeof typeFilter); setShowTypeDrop(false); setPage(1); }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center gap-2 ${typeFilter === t ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        {t !== 'All Activity Types' && (
                          <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_META[t as ActivityType]?.dot}`} />
                        )}
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Activity feed grouped by date */}
            <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {grouped.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={20} className="text-slate-300 dark:text-white/20" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No activity found</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]/70 mt-1">Try adjusting your filters or search query.</p>
                </div>
              ) : grouped.map((group, gi) => (
                <div key={gi}>
                  {/* Date group header */}
                  <div className="px-5 py-2.5 bg-gray-50/60 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest">{group.label}</p>
                  </div>

                  {/* Activity rows */}
                  {group.items.map((a, ai) => {
                    const meta = TYPE_META[a.type];
                    return (
                      <div
                        key={a.id}
                        className="group flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Type icon */}
                        <div className={`w-8 h-8 rounded-xl ${meta.bg} ${meta.iconColor} flex items-center justify-center shrink-0`}>
                          {meta.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white leading-snug truncate">
                            {a.title}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">
                            {a.subtitle}
                          </p>
                        </div>

                        {/* Avatar + time */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <div className={`w-7 h-7 rounded-full ${a.avatarColor} flex items-center justify-center text-white text-[9px] font-bold`}>
                            {a.avatarInitials}
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 w-14 text-right tabular-nums">
                            {a.timeDisplay}
                          </span>
                        </div>

                        {/* Actions (hover) */}
                        <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Pagination footer */}
            <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">
                Show {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} activities
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 text-slate-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronLeft size={13} />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
                      page === p
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                {totalPages > 5 && (
                  <>
                    <span className="text-slate-400 text-[11px] px-0.5">…</span>
                    <button
                      onClick={() => setPage(totalPages)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 text-slate-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right sidebar — Filters ────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Filters</h3>
              <button
                onClick={clearAll}
                className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline transition-all"
              >
                Clear All
              </button>
            </div>

            {/* Activity Type */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-2.5">Activity Type</p>
              <div className="space-y-1.5">
                {(['All Activity Types', ...ALL_TYPES] as const).map(t => {
                  const isAll = t === 'All Activity Types';
                  const active = typeFilter === t;
                  return (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(t as typeof typeFilter); setPage(1); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                        active
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-gray-300 dark:border-white/20'
                      }`}>
                        {active && <span className="w-1 h-1 rounded-full bg-white block" />}
                      </span>
                      {!isAll && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TYPE_META[t as ActivityType]?.dot}`} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-white/5" />

            {/* Performed By */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-2.5">Performed By</p>
              <div className="space-y-1.5">
                {(['All Users','YOU','Students','System'] as const).map(by => {
                  const active = performedBy === by;
                  return (
                    <button
                      key={by}
                      onClick={() => { setPerformedBy(by); setPage(1); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                        active
                          ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full border-2 shrink-0 flex items-center justify-center ${
                        active
                          ? 'border-cyan-500 bg-cyan-500'
                          : 'border-gray-300 dark:border-white/20'
                      }`}>
                        {active && <span className="w-1 h-1 rounded-full bg-white block" />}
                      </span>
                      {by}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 dark:border-white/5" />

            {/* Date Range */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-2.5">Date Range</p>
              {/* Custom range selector */}
              <div className="relative mb-3">
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="w-full appearance-none pl-3 pr-7 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                >
                  {DATE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"><path d="M6 9l6 6 6-6"/></svg>
              </div>
              {/* From/To date pickers */}
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                  <Calendar size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="relative">
                  <input
                    type="date"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  />
                  <Calendar size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
