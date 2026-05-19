'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Search, Eye, Reply, Trash2, Filter, Star, StarOff,
  Users, User, CheckCheck, Clock, X, ChevronRight, Send,
  MessageSquare, Download, MoreHorizontal,
} from 'lucide-react';

// ── Message data ───────────────────────────────────────────────────────────────
const MESSAGES = [
  {
    id: 'MSG-001', type: 'individual', subject: 'Interview Preparation Reminder',
    body: 'Hi Amina,\n\nThis is a reminder about your upcoming interview scheduled for May 27, 2025. Please ensure you are well-prepared and reach out if you have any questions.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['Amina Yusuf'], recipientCount: 1, initials: 'AY', color: 'bg-yellow-400',
    sentAt: 'May 22, 2025', sentTime: '9:15 AM', status: 'Read', starred: true,
    dept: 'Computer Science',
  },
  {
    id: 'MSG-002', type: 'group', subject: 'Essay Deadline Alert — Action Required',
    body: 'Hi {name},\n\nYour essay submission deadline is approaching on June 15, 2025. Please ensure your personal statement and all required essays are submitted before the deadline.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['At Risk Group'], recipientCount: 12, initials: 'AR', color: 'bg-red-500',
    sentAt: 'May 21, 2025', sentTime: '2:30 PM', status: 'Delivered', starred: false,
    dept: 'At Risk · 12 students',
  },
  {
    id: 'MSG-003', type: 'individual', subject: 'Session Follow-up — Action Items',
    body: 'Hi Daniel,\n\nThank you for attending our session yesterday. Please find below the action items we discussed:\n1. Complete your MCAT preparation schedule\n2. Submit your letter of recommendation request\n3. Revise your personal statement introduction\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['Daniel Musa'], recipientCount: 1, initials: 'DM', color: 'bg-blue-500',
    sentAt: 'May 21, 2025', sentTime: '11:00 AM', status: 'Read', starred: false,
    dept: 'Software Engineering',
  },
  {
    id: 'MSG-004', type: 'group', subject: 'Welcome to Fall 2026 Application Cycle',
    body: 'Hi {name},\n\nWelcome to the Fall 2026 application cycle! I am excited to support you through this journey. Please review the key deadlines and schedule a session with me at your earliest convenience.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['All Students'], recipientCount: 120, initials: 'AS', color: 'bg-cyan-500',
    sentAt: 'May 20, 2025', sentTime: '8:00 AM', status: 'Delivered', starred: true,
    dept: 'All Students · 120',
  },
  {
    id: 'MSG-005', type: 'individual', subject: 'MMI Coaching — Session Confirmed',
    body: 'Hi Joshua,\n\nYour MMI coaching session has been confirmed for May 24, 2025 at 3:00 PM. Please come prepared with your response to at least two practice MMI scenarios.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['Joshua Adeyemi'], recipientCount: 1, initials: 'JA', color: 'bg-teal-500',
    sentAt: 'May 19, 2025', sentTime: '4:45 PM', status: 'Read', starred: false,
    dept: 'Artificial Intelligence',
  },
  {
    id: 'MSG-006', type: 'group', subject: 'Top Performers — Scholarship Opportunity',
    body: 'Hi {name},\n\nCongratulations on your outstanding academic performance! I wanted to share an exciting scholarship opportunity that you may be eligible for. Please review the attached details and reach out if you have questions.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['Top Performers'], recipientCount: 15, initials: 'TP', color: 'bg-amber-500',
    sentAt: 'May 18, 2025', sentTime: '10:20 AM', status: 'Read', starred: false,
    dept: 'Top Performers · 15 students',
  },
  {
    id: 'MSG-007', type: 'individual', subject: 'Attendance Warning — Immediate Attention Required',
    body: 'Hi Halima,\n\nI have noticed that your attendance has dropped to 45% this semester, which is below the required threshold. Please reach out to schedule an urgent meeting so we can work on a plan together.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['Halima Sani'], recipientCount: 1, initials: 'HS', color: 'bg-red-400',
    sentAt: 'May 17, 2025', sentTime: '3:00 PM', status: 'Sent', starred: true,
    dept: 'Computer Science',
  },
  {
    id: 'MSG-008', type: 'individual', subject: 'Application Documents — Pending Items',
    body: 'Hi Fatima,\n\nYour application has two pending items: Personal Statement and Resume/CV. Please ensure these are submitted before your June 15 deadline.\n\nBest regards,\nDr. Sarah Johnson',
    recipients: ['Fatima Bello'], recipientCount: 1, initials: 'FB', color: 'bg-pink-500',
    sentAt: 'May 16, 2025', sentTime: '1:30 PM', status: 'Read', starred: false,
    dept: 'Cyber Security',
  },
];

const TABS = [
  { key: 'all',       label: 'All Messages', count: MESSAGES.length },
  { key: 'individual',label: 'Individual',   count: MESSAGES.filter(m => m.type === 'individual').length },
  { key: 'group',     label: 'Group',        count: MESSAGES.filter(m => m.type === 'group').length },
  { key: 'starred',   label: 'Starred',      count: MESSAGES.filter(m => m.starred).length },
];

function StatusBadge({ s }: { s: string }) {
  if (s === 'Read')      return <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><CheckCheck size={11} /> Read</span>;
  if (s === 'Delivered') return <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 dark:text-blue-400"><CheckCheck size={11} /> Delivered</span>;
  return                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-400"><Clock size={11} /> Sent</span>;
}

function TypeBadge({ t }: { t: string }) {
  return t === 'individual'
    ? <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400"><User size={9} /> Individual</span>
    : <span className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400"><Users size={9} /> Group</span>;
}

type Msg = typeof MESSAGES[number];

export default function MessageHistoryPage() {
  const router = useRouter();
  const [activeTab, setActiveTab]         = useState('all');
  const [search, setSearch]               = useState('');
  const [selected, setSelected]           = useState<Msg | null>(null);
  const [starred, setStarred]             = useState<Record<string, boolean>>(
    Object.fromEntries(MESSAGES.map(m => [m.id, m.starred]))
  );
  const [deleted, setDeleted]             = useState<Set<string>>(new Set());

  const visible = MESSAGES.filter(m => {
    if (deleted.has(m.id)) return false;
    if (activeTab === 'individual' && m.type !== 'individual') return false;
    if (activeTab === 'group'      && m.type !== 'group')      return false;
    if (activeTab === 'starred'    && !starred[m.id])          return false;
    if (search && !m.subject.toLowerCase().includes(search.toLowerCase()) &&
        !m.recipients.join(' ').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function toggleStar(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setStarred(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function deleteMsg(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setDeleted(prev => new Set([...prev, id]));
    if (selected?.id === id) setSelected(null);
  }

  const stats = [
    { label: 'Total Sent',  value: MESSAGES.length, color: 'text-slate-800 dark:text-white',           bg: 'bg-slate-50 dark:bg-white/5',           icon: <Send size={14} className="text-slate-400" /> },
    { label: 'Delivered',   value: MESSAGES.filter(m=>m.status!=='Sent').length, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10', icon: <CheckCheck size={14} className="text-blue-500" /> },
    { label: 'Read',        value: MESSAGES.filter(m=>m.status==='Read').length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: <Eye size={14} className="text-emerald-500" /> },
    { label: 'Group Sends', value: MESSAGES.filter(m=>m.type==='group').length, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10', icon: <Users size={14} className="text-purple-500" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-white transition-colors shrink-0"
            >
              <ChevronLeft size={15} /> Back
            </button>
            <span className="text-slate-300 dark:text-white/15">|</span>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Message History</h1>
              <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">All sent messages — individual and group.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-100 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-[#8e92ad] bg-white dark:bg-[#161a27] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <Download size={13} /> Export
            </button>
            <button
              onClick={() => router.push('/counselor/message-student')}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              <Send size={13} /> New Message
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 dark:border-white/6 p-4 flex items-center gap-3`}>
              <div className={`w-9 h-9 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center shrink-0`}>{s.icon}</div>
              <div>
                <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className={`grid gap-5 ${selected ? 'grid-cols-1 lg:grid-cols-[1fr_420px]' : 'grid-cols-1'} items-start`}>

          {/* ── Message list ── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* Toolbar */}
            <div className="px-5 pt-4 pb-3 border-b border-gray-50 dark:border-white/5 space-y-3">
              {/* Tabs — scrollable on mobile */}
              <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                      activeTab === t.key
                        ? 'bg-cyan-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {t.key === 'starred' && <Star size={11} />} {t.label}
                    <span className={`text-[10px] font-bold ${activeTab === t.key ? 'opacity-80' : 'opacity-60'}`}>{t.count}</span>
                  </button>
                ))}
              </div>

              {/* Search + filter row */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search messages..."
                    className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/50 transition-all"
                  />
                </div>
                <button className="flex items-center gap-1.5 h-9 px-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-500 dark:text-[#8e92ad] hover:bg-gray-100 dark:hover:bg-white/8 transition-colors shrink-0">
                  <Filter size={13} /> Filter
                </button>
              </div>
            </div>

            {/* Message rows */}
            {visible.length === 0 ? (
              <div className="py-16 text-center">
                <MessageSquare size={32} className="mx-auto mb-3 text-slate-200 dark:text-white/10" />
                <p className="text-sm font-semibold text-slate-400">No messages found</p>
                <p className="text-xs text-slate-400 mt-1">Try adjusting your search or filter.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                {visible.map(m => (
                  <div
                    key={m.id}
                    onClick={() => setSelected(selected?.id === m.id ? null : m)}
                    className={`group flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors ${
                      selected?.id === m.id
                        ? 'bg-cyan-50/60 dark:bg-cyan-500/[0.07]'
                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl ${m.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5`}>
                      {m.type === 'group' ? <Users size={14} /> : m.initials}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap min-w-0">
                          <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{m.subject}</p>
                          <TypeBadge t={m.type} />
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400 dark:text-[#8e92ad] whitespace-nowrap hidden sm:block">{m.sentAt}</span>
                          <button
                            onClick={e => toggleStar(m.id, e)}
                            className="p-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
                          >
                            {starred[m.id]
                              ? <Star size={13} className="text-amber-400 fill-amber-400" />
                              : <StarOff size={13} className="text-slate-300 dark:text-white/15 group-hover:text-slate-400 transition-colors" />
                            }
                          </button>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] mb-2 truncate">
                        To: <span className="font-semibold text-slate-600 dark:text-[#c8ccdf]">
                          {m.type === 'group' ? `${m.recipients[0]} (${m.recipientCount} students)` : m.recipients[0]}
                        </span>
                        <span className="text-slate-300 dark:text-white/15 mx-1.5">·</span>
                        {m.dept}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        <StatusBadge s={m.status} />
                        {/* Action buttons — visible on hover or active */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={e => { e.stopPropagation(); setSelected(m); }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/8 text-[10px] font-semibold text-slate-600 dark:text-[#c8ccdf] hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Eye size={11} /> View
                          </button>
                          <button
                            onClick={e => { e.stopPropagation(); router.push('/counselor/message-student'); }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-white/8 text-[10px] font-semibold text-slate-600 dark:text-[#c8ccdf] hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                          >
                            <Reply size={11} /> Reply
                          </button>
                          <button
                            onClick={e => deleteMsg(m.id, e)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/8 text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Showing {visible.length} of {MESSAGES.length - deleted.size} messages</p>
              <button className="flex items-center gap-1 text-[10px] font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">
                Load more <ChevronRight size={11} />
              </button>
            </div>
          </div>

          {/* ── Detail panel ── */}
          {selected && (
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden sticky top-4">
              {/* Detail header */}
              <div className="flex items-start justify-between p-5 border-b border-gray-50 dark:border-white/5">
                <div className="flex items-start gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-xl ${selected.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                    {selected.type === 'group' ? <Users size={15} /> : selected.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight mb-0.5 truncate">{selected.subject}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">
                      To: <span className="font-semibold text-slate-600 dark:text-[#c8ccdf]">
                        {selected.type === 'group' ? `${selected.recipients[0]} (${selected.recipientCount})` : selected.recipients[0]}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{selected.sentAt} · {selected.sentTime}</p>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 text-slate-400 hover:text-slate-600 transition-colors shrink-0 ml-2">
                  <X size={14} />
                </button>
              </div>

              {/* Status strip */}
              <div className="px-5 py-3 bg-gray-50 dark:bg-white/[0.02] border-b border-gray-50 dark:border-white/5 flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <TypeBadge t={selected.type} />
                </div>
                <StatusBadge s={selected.status} />
                <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">
                  {selected.recipientCount} recipient{selected.recipientCount !== 1 ? 's' : ''}
                </span>
                <button onClick={e => toggleStar(selected.id, e)} className="ml-auto">
                  {starred[selected.id]
                    ? <Star size={14} className="text-amber-400 fill-amber-400" />
                    : <StarOff size={14} className="text-slate-300 hover:text-amber-400 transition-colors" />
                  }
                </button>
              </div>

              {/* Body */}
              <div className="p-5">
                <pre className="text-xs text-slate-700 dark:text-[#c8ccdf] whitespace-pre-wrap font-sans leading-relaxed">
                  {selected.body}
                </pre>
              </div>

              {/* Action footer */}
              <div className="px-5 pb-5 flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => router.push('/counselor/message-student')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold shadow-sm transition-colors"
                >
                  <Reply size={13} /> Reply
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <Download size={13} /> Export
                </button>
                <button
                  onClick={e => deleteMsg(selected.id, e)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-100 dark:border-red-500/20 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors ml-auto"
                >
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
