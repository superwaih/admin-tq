'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Search, CheckCheck,
  MessageSquare, FileText, Calendar, Upload, Bell, BookOpen,
  MoreHorizontal, AlertCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type NType   = 'Sessions' | 'Applications' | 'Messages' | 'Reviews' | 'Resources' | 'System';
type ReadStatus = 'All' | 'Unread' | 'Read';

interface Notification {
  id: number;
  type: NType;
  title: string;
  subtitle: string;
  timeAgo: string;
  fullTime: string;
  date: string;
  dateLabel: string;
  read: boolean;
}

// ── Styling maps ──────────────────────────────────────────────────────────────
const TYPE_META: Record<NType, { icon: React.ReactNode; bg: string; iconColor: string; dot: string; label: string }> = {
  Sessions:     { icon: <Calendar     size={13} />, bg: 'bg-blue-100   dark:bg-blue-500/20',    iconColor: 'text-blue-600   dark:text-blue-400',    dot: 'bg-blue-500',    label: 'Sessions'     },
  Applications: { icon: <FileText     size={13} />, bg: 'bg-violet-100 dark:bg-violet-500/20',  iconColor: 'text-violet-600 dark:text-violet-400',  dot: 'bg-violet-500',  label: 'Applications' },
  Messages:     { icon: <MessageSquare size={13} />, bg: 'bg-emerald-100 dark:bg-emerald-500/20', iconColor: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500', label: 'Messages' },
  Reviews:      { icon: <BookOpen     size={13} />, bg: 'bg-amber-100  dark:bg-amber-500/20',   iconColor: 'text-amber-600  dark:text-amber-400',   dot: 'bg-amber-500',   label: 'Reviews'      },
  Resources:    { icon: <Upload       size={13} />, bg: 'bg-pink-100   dark:bg-pink-500/20',    iconColor: 'text-pink-600   dark:text-pink-400',    dot: 'bg-pink-500',    label: 'Resources'    },
  System:       { icon: <Bell         size={13} />, bg: 'bg-slate-100  dark:bg-white/8',        iconColor: 'text-slate-500  dark:text-slate-400',   dot: 'bg-slate-400',   label: 'System'       },
};

// ── Mock data ─────────────────────────────────────────────────────────────────
const ALL_NOTIFICATIONS: Notification[] = [
  // Tuesday · May 19, 2026
  { id:1,  type:'Messages',     title:'New message from Aisha Patel',           subtitle:'Essay Review · Today, 4:02 PM',          timeAgo:'2m ago',   fullTime:'2:00 PM',            date:'2026-05-19', dateLabel:'Tuesday · May 19, 2026',  read:false },
  { id:2,  type:'Reviews',      title:'Essay review completed for Ethan Kim',   subtitle:'Personal Statement · Today, 11:30 AM',   timeAgo:'10m ago',  fullTime:'11:30 AM',           date:'2026-05-19', dateLabel:'Tuesday · May 19, 2026',  read:false },
  { id:3,  type:'Sessions',     title:'Sophie Martin booked a session',         subtitle:'MMI Prep · Yesterday, 6:15 PM',          timeAgo:'30m ago',  fullTime:'6:15 PM',            date:'2026-05-19', dateLabel:'Tuesday · May 19, 2026',  read:false },
  { id:4,  type:'Resources',    title:'New resource uploaded',                  subtitle:'MMI Preparation Guide.pdf · May 16',    timeAgo:'1h ago',   fullTime:'9:00 AM',            date:'2026-05-19', dateLabel:'Tuesday · May 19, 2026',  read:false },
  // May 18, 2026
  { id:5,  type:'Sessions',     title:'Aisha Patel joined the session',         subtitle:'Essay Review · Today, 4:02 PM',          timeAgo:'Yesterday', fullTime:'Yesterday, 2:00 PM',date:'2026-05-18', dateLabel:'May 18, 2026',            read:false },
  { id:6,  type:'Reviews',      title:'You reviewed an essay for Ethan',        subtitle:'Personal Statement · Today, 11:30 AM',   timeAgo:'Yesterday', fullTime:'Yesterday, 3:00 PM',date:'2026-05-18', dateLabel:'May 18, 2026',            read:false },
  { id:7,  type:'Sessions',     title:'Sophie Martin booked a session',         subtitle:'MMI Prep · Yesterday, 6:15 PM',          timeAgo:'Yesterday', fullTime:'Yesterday, 4:00 PM',date:'2026-05-18', dateLabel:'May 18, 2026',            read:false },
  { id:8,  type:'Resources',    title:'New resource uploaded',                  subtitle:'MMI Preparation Guide.pdf · May 16',    timeAgo:'Yesterday', fullTime:'Yesterday, 2:00 PM',date:'2026-05-18', dateLabel:'May 18, 2026',            read:true  },
  // Yesterday · May 19, 2026 (older group)
  { id:9,  type:'Sessions',     title:'Aisha Patel joined the session',         subtitle:'Essay Review · Today, 4:02 PM',          timeAgo:'May 18',   fullTime:'May 18, 2:00 PM',    date:'2026-05-17', dateLabel:'Yesterday · May 19, 2026', read:true  },
  { id:10, type:'Reviews',      title:'Essay review completed for Ethan Kim',   subtitle:'Today, 11:30 AM',                        timeAgo:'May 18',   fullTime:'May 18, 2:00 PM',    date:'2026-05-17', dateLabel:'Yesterday · May 19, 2026', read:true  },
  { id:11, type:'Sessions',     title:'Sophie Martin booked a session',         subtitle:'MMI Prep · Yesterday, 6:15 PM',          timeAgo:'May 18',   fullTime:'May 18, 2:00 PM',    date:'2026-05-17', dateLabel:'Yesterday · May 19, 2026', read:true  },
  { id:12, type:'Resources',    title:'New resource uploaded',                  subtitle:'MMI Preparation Guide.pdf · May 16',    timeAgo:'May 18',   fullTime:'May 18, 2:00 PM',    date:'2026-05-17', dateLabel:'Yesterday · May 19, 2026', read:true  },
  // May 17, 2026
  { id:13, type:'Applications', title:'New application from Liam Kay',          subtitle:'MD Program · McGill University',         timeAgo:'May 17',   fullTime:'May 17, 9:00 AM',    date:'2026-05-16', dateLabel:'May 17, 2026',            read:true  },
  { id:14, type:'Messages',     title:'Message received from Daniel Musa',      subtitle:'Question about DDS requirements',        timeAgo:'May 17',   fullTime:'May 17, 11:00 AM',   date:'2026-05-16', dateLabel:'May 17, 2026',            read:true  },
  { id:15, type:'System',       title:'System maintenance scheduled',           subtitle:'Platform downtime 3–4 AM',               timeAgo:'May 17',   fullTime:'May 17, 8:00 AM',    date:'2026-05-16', dateLabel:'May 17, 2026',            read:true  },
  { id:16, type:'Reviews',      title:'Essay reviewed: Fatima Bello',           subtitle:'University of Toronto Personal Statement',timeAgo:'May 16',  fullTime:'May 16, 2:30 PM',    date:'2026-05-15', dateLabel:'May 16, 2026',            read:true  },
  { id:17, type:'Sessions',     title:'MMI coaching session completed',          subtitle:'Joshua Adeyemi · 1 hr session',          timeAgo:'May 16',   fullTime:'May 16, 10:00 AM',   date:'2026-05-15', dateLabel:'May 16, 2026',            read:true  },
  { id:18, type:'Applications', title:'Application stage updated',              subtitle:'Maryam Okafor moved to Essays stage',    timeAgo:'May 16',   fullTime:'May 16, 4:45 PM',    date:'2026-05-15', dateLabel:'May 16, 2026',            read:true  },
  { id:19, type:'Messages',     title:'Message from Halima Sani',               subtitle:'Regarding upcoming session schedule',    timeAgo:'May 15',   fullTime:'May 15, 1:00 PM',    date:'2026-05-14', dateLabel:'May 15, 2026',            read:true  },
  { id:20, type:'System',       title:'Weekly summary ready',                   subtitle:'View your counselling stats for the week',timeAgo:'May 15',  fullTime:'May 15, 7:00 AM',    date:'2026-05-14', dateLabel:'May 15, 2026',            read:true  },
];

const ALL_TYPES: NType[] = ['Sessions','Applications','Messages','Reviews','Resources','System'];
const PAGE_SIZE = 10;
const DATE_RANGES = ['May 21 – 26, 2026','May 14 – 20, 2026','May 7 – 13, 2026','All Dates'];

// ── Tab counts ────────────────────────────────────────────────────────────────
const TAB_COUNTS = {
  All:          ALL_NOTIFICATIONS.length,
  Unread:       ALL_NOTIFICATIONS.filter(n => !n.read).length,
  Messages:     ALL_NOTIFICATIONS.filter(n => n.type === 'Messages').length,
  Applications: ALL_NOTIFICATIONS.filter(n => n.type === 'Applications').length,
  Sessions:     ALL_NOTIFICATIONS.filter(n => n.type === 'Sessions').length,
  System:       ALL_NOTIFICATIONS.filter(n => n.type === 'System').length,
};

type TabKey = 'All' | 'Unread' | NType;
const TABS: { key: TabKey; label: string; count: number }[] = [
  { key:'All',          label:`All`,          count: TAB_COUNTS.All          },
  { key:'Unread',       label:`Unread`,        count: TAB_COUNTS.Unread        },
  { key:'Messages',     label:'Messages',      count: TAB_COUNTS.Messages      },
  { key:'Applications', label:'Applications',  count: TAB_COUNTS.Applications  },
  { key:'Sessions',     label:'Seasons',       count: TAB_COUNTS.Sessions      },
  { key:'System',       label:'System',        count: TAB_COUNTS.System        },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(ALL_NOTIFICATIONS);
  const [search,        setSearch]        = useState('');
  const [activeTab,     setActiveTab]     = useState<TabKey>('All');
  const [typeFilter,    setTypeFilter]    = useState<'All Types' | NType>('All Types');
  const [readStatus,    setReadStatus]    = useState<ReadStatus>('All');
  const [dateRange,     setDateRange]     = useState(DATE_RANGES[0]);
  const [startDate,     setStartDate]     = useState('2026-05-13');
  const [endDate,       setEndDate]       = useState('2026-05-20');
  const [page,          setPage]          = useState(1);
  const [showDateDrop,  setShowDateDrop]  = useState(false);
  const [showTypeDrop,  setShowTypeDrop]  = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }

  function markRead(id: number) {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function clearAll() {
    setTypeFilter('All Types');
    setReadStatus('All');
    setDateRange(DATE_RANGES[0]);
    setSearch('');
    setActiveTab('All');
    setPage(1);
  }

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const q = search.toLowerCase();
      const matchSearch = !q || n.title.toLowerCase().includes(q) || n.subtitle.toLowerCase().includes(q);
      const matchTab    = activeTab === 'All'    ? true
                        : activeTab === 'Unread' ? !n.read
                        : n.type === activeTab;
      const matchType   = typeFilter === 'All Types' || n.type === typeFilter;
      const matchRead   = readStatus === 'All'    ? true
                        : readStatus === 'Unread' ? !n.read
                        : n.read;
      return matchSearch && matchTab && matchType && matchRead;
    });
  }, [notifications, search, activeTab, typeFilter, readStatus]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, { label: string; items: Notification[] }>();
    filtered.forEach(n => {
      if (!map.has(n.date)) map.set(n.date, { label: n.dateLabel, items: [] });
      map.get(n.date)!.items.push(n);
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Notification
              </h1>
              {unreadCount > 0 && (
                <span className="flex items-center justify-center min-w-[26px] h-6 px-2 rounded-full bg-cyan-600 text-white text-[11px] font-bold">
                  {unreadCount}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Stay updated with important activities, messages and alerts.
            </p>
          </div>
          <button
            onClick={markAllRead}
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm shrink-0"
          >
            <CheckCheck size={14} className="text-cyan-600" /> Mark all as read
          </button>
        </div>

        {/* ── Two-column layout ──────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-5 items-start">

          {/* ── Notifications feed ────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* Search + date + type toolbar */}
            <div className="flex flex-wrap items-center gap-2.5 px-4 py-3.5 border-b border-gray-100 dark:border-white/5">
              <div className="relative flex-1 min-w-[160px]">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  placeholder="Search notification"
                  className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Date range */}
              <div className="relative">
                <button
                  onClick={() => { setShowDateDrop(s => !s); setShowTypeDrop(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all whitespace-nowrap"
                >
                  {dateRange}
                  <ChevronRight size={12} className={`transition-transform ${showDateDrop ? 'rotate-90' : 'rotate-90'}`} style={{ transform: showDateDrop ? 'rotate(-90deg)' : 'rotate(90deg)' }} />
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

              {/* Type filter */}
              <div className="relative">
                <button
                  onClick={() => { setShowTypeDrop(s => !s); setShowDateDrop(false); }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all whitespace-nowrap"
                >
                  {typeFilter}
                  <ChevronRight size={12} style={{ transform: showTypeDrop ? 'rotate(-90deg)' : 'rotate(90deg)' }} className="transition-transform" />
                </button>
                {showTypeDrop && (
                  <div className="absolute z-20 top-full right-0 mt-1.5 w-48 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                    {(['All Types', ...ALL_TYPES] as const).map(t => (
                      <button key={t} onClick={() => { setTypeFilter(t as typeof typeFilter); setShowTypeDrop(false); setPage(1); }}
                        className={`w-full text-left px-4 py-2.5 text-xs flex items-center gap-2 transition-colors ${typeFilter === t ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        {t !== 'All Types' && <span className={`w-2 h-2 rounded-full shrink-0 ${TYPE_META[t as NType].dot}`} />}
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tab strip */}
            <div className="flex items-center gap-0 border-b border-gray-100 dark:border-white/5 overflow-x-auto px-2">
              {TABS.map(tab => {
                const isUnread = tab.key === 'Unread';
                const active   = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setPage(1); }}
                    className={`relative flex items-center gap-1.5 px-3 py-3.5 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-all ${
                      active
                        ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                        : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {tab.label}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      active
                        ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                        : 'bg-gray-100 dark:bg-white/8 text-slate-400'
                    }`}>{tab.count}</span>
                    {isUnread && unreadCount > 0 && (
                      <span className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Notification rows grouped by date */}
            <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {grouped.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                    <AlertCircle size={20} className="text-slate-300 dark:text-white/20" />
                  </div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No notifications found</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]/70 mt-1">Try adjusting your filters.</p>
                </div>
              ) : grouped.map((group, gi) => (
                <div key={gi}>
                  {/* Date group header */}
                  <div className="px-5 py-2.5 bg-gray-50/60 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest">{group.label}</p>
                  </div>

                  {group.items.map(n => {
                    const meta = TYPE_META[n.type];
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`group flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-colors ${
                          !n.read
                            ? 'bg-cyan-50/40 dark:bg-cyan-500/[0.04] hover:bg-cyan-50/70 dark:hover:bg-cyan-500/[0.07]'
                            : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Icon */}
                        <div className={`w-8 h-8 rounded-xl ${meta.bg} ${meta.iconColor} flex items-center justify-center shrink-0`}>
                          {meta.icon}
                        </div>

                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs leading-snug truncate ${!n.read ? 'font-bold text-slate-900 dark:text-white' : 'font-semibold text-slate-700 dark:text-slate-300'}`}>
                            {n.title}
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{n.subtitle}</p>
                        </div>

                        {/* Time + unread dot */}
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="text-[11px] text-slate-400 dark:text-[#8e92ad] tabular-nums whitespace-nowrap">{n.fullTime}</span>
                          <span className={`w-2 h-2 rounded-full shrink-0 ${!n.read ? 'bg-cyan-500' : 'bg-transparent'}`} />
                        </div>

                        {/* More */}
                        <button
                          onClick={e => e.stopPropagation()}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                        >
                          <MoreHorizontal size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Pagination */}
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

          {/* ── Right sidebar ─────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Filters</h3>
              <button onClick={clearAll} className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                Clear All
              </button>
            </div>

            {/* Notification Type */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-2.5">Notification Type</p>
              <div className="space-y-1.5">
                {(['All Types', ...ALL_TYPES] as const).map(t => {
                  const isAll  = t === 'All Types';
                  const active = typeFilter === t;
                  return (
                    <button
                      key={t}
                      onClick={() => { setTypeFilter(t as typeof typeFilter); setPage(1); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left ${active ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <span className={`w-3 h-3 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300 dark:border-white/20'}`}>
                        {active && <span className="w-1 h-1 rounded-full bg-white block" />}
                      </span>
                      {!isAll && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${TYPE_META[t as NType].dot}`} />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-white/5" />

            {/* Date Range */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-2.5">Date Range</p>
              <div className="relative mb-2.5">
                <select
                  value={dateRange}
                  onChange={e => setDateRange(e.target.value)}
                  className="w-full appearance-none pl-3 pr-7 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                >
                  {DATE_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronRight size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" />
              </div>
              <div className="space-y-2">
                {[
                  { label:'From', value: startDate, set: setStartDate },
                  { label:'To',   value: endDate,   set: setEndDate   },
                ].map(({ label, value, set }) => (
                  <div key={label} className="relative">
                    <input
                      type="date"
                      value={value}
                      onChange={e => set(e.target.value)}
                      className="w-full pl-3 pr-8 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                    />
                    <Calendar size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-white/5" />

            {/* Read Status */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-2.5">Read Status</p>
              <div className="space-y-1.5">
                {(['All','Unread','Read'] as ReadStatus[]).map(rs => {
                  const active = readStatus === rs;
                  return (
                    <button
                      key={rs}
                      onClick={() => { setReadStatus(rs); setPage(1); }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all text-left ${active ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      <span className={`w-3 h-3 rounded-full border-2 shrink-0 flex items-center justify-center ${active ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300 dark:border-white/20'}`}>
                        {active && <span className="w-1 h-1 rounded-full bg-white block" />}
                      </span>
                      {rs}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
