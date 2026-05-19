'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Search, Send, Users, User, ChevronDown, X,
  CheckCircle2, MessageSquare, FileText, Clock, Paperclip, ChevronRight, Eye,
  CheckCheck, Star,
} from 'lucide-react';

// ── Student roster ─────────────────────────────────────────────────────────────
const ALL_STUDENTS = [
  { name: 'Amina Yusuf',    id: 'STU-2024-1001', dept: 'Computer Science',        status: 'Excellent', initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Daniel Musa',    id: 'STU-2024-1002', dept: 'Software Engineering',    status: 'At Risk',   initials: 'DM', color: 'bg-blue-500' },
  { name: 'Fatima Bello',   id: 'STU-2024-1003', dept: 'Cyber Security',          status: 'Active',    initials: 'FB', color: 'bg-pink-500' },
  { name: 'Ibrahim Ali',    id: 'STU-2024-1004', dept: 'Data Science',            status: 'Warning',   initials: 'IA', color: 'bg-green-500' },
  { name: 'Maryam Okafor',  id: 'STU-2024-1005', dept: 'Information Systems',    status: 'Active',    initials: 'MO', color: 'bg-orange-400' },
  { name: 'Joshua Adeyemi', id: 'STU-2024-1006', dept: 'Artificial Intelligence', status: 'Excellent', initials: 'JA', color: 'bg-teal-500' },
  { name: 'Halima Sani',    id: 'STU-2024-1007', dept: 'Computer Science',        status: 'At Risk',   initials: 'HS', color: 'bg-red-400' },
  { name: 'Samuel Johnson', id: 'STU-2024-1008', dept: 'Software Engineering',    status: 'Active',    initials: 'SJ', color: 'bg-purple-500' },
];

const GROUPS = [
  { key: 'all',       label: 'All Students',    count: 120, color: 'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300',           dot: 'bg-slate-400' },
  { key: 'active',    label: 'Active Students', count: 98,  color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { key: 'atrisk',    label: 'At Risk',         count: 12,  color: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400',                dot: 'bg-red-500' },
  { key: 'top',       label: 'Top Performers',  count: 15,  color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400',        dot: 'bg-amber-500' },
  { key: 'graduated', label: 'Graduated',       count: 10,  color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400',            dot: 'bg-blue-500' },
];

const TEMPLATES = [
  { label: 'Interview Reminder',   body: 'Hi {name},\n\nThis is a reminder about your upcoming interview. Please ensure you are well-prepared and reach out if you have any questions.\n\nBest regards,\nYour Counselor' },
  { label: 'Essay Deadline Alert', body: 'Hi {name},\n\nYour essay submission deadline is approaching. Please ensure your personal statement and required essays are submitted on time.\n\nBest regards,\nYour Counselor' },
  { label: 'Session Follow-up',    body: 'Hi {name},\n\nThank you for attending our recent session. Please find the action items we discussed below. Do not hesitate to reach out if you need further guidance.\n\nBest regards,\nYour Counselor' },
  { label: 'General Check-in',     body: 'Hi {name},\n\nI wanted to check in and see how your application progress is going. Feel free to schedule a session if you need any support.\n\nBest regards,\nYour Counselor' },
];

type Student = typeof ALL_STUDENTS[number];

function StatusDot({ s }: { s: string }) {
  const c = s === 'Excellent' ? 'bg-emerald-500' : s === 'Active' ? 'bg-blue-500' : s === 'At Risk' ? 'bg-red-500' : 'bg-amber-500';
  return <span className={`inline-block w-1.5 h-1.5 rounded-full ${c} shrink-0`} />;
}

export default function MessageStudentPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'individual' | 'group'>('individual');

  const [search, setSearch]               = useState('');
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const [subject, setSubject]             = useState('');
  const [body, setBody]                   = useState('');
  const [templateOpen, setTemplateOpen]   = useState(false);
  const [sent, setSent]                   = useState(false);

  const filtered = ALL_STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.dept.toLowerCase().includes(search.toLowerCase())
  );

  function toggleStudent(s: Student) {
    setSelectedStudents(prev =>
      prev.find(p => p.id === s.id) ? prev.filter(p => p.id !== s.id) : [...prev, s]
    );
  }

  function applyTemplate(t: typeof TEMPLATES[number]) {
    setBody(t.body);
    setTemplateOpen(false);
  }

  const recipientCount =
    mode === 'individual'
      ? selectedStudents.length
      : selectedGroup
        ? (GROUPS.find(g => g.key === selectedGroup)?.count ?? 0)
        : 0;

  const canSend = subject.trim() && body.trim() && recipientCount > 0;

  function handleSend() {
    if (!canSend) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSubject('');
      setBody('');
      setSelectedStudents([]);
      setSelectedGroup(null);
    }, 2500);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1100px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <ChevronLeft size={15} /> Back
          </button>
          <span className="text-slate-300 dark:text-white/15">|</span>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Message Students</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">Send messages to individual students or a group.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">

          {/* ── Left: Compose ──────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Mode toggle */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-1.5 flex gap-1.5">
              {([
                { key: 'individual', label: 'Individual Student', icon: <User size={14} /> },
                { key: 'group',      label: 'Group Message',      icon: <Users size={14} /> },
              ] as const).map(m => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    mode === m.key
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'text-slate-500 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* ── Recipient selector ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">
                {mode === 'individual' ? 'Select Recipient(s)' : 'Select Student Group'}
              </p>

              {mode === 'individual' ? (
                <div className="space-y-3">
                  {/* Chips */}
                  {selectedStudents.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedStudents.map(s => (
                        <span key={s.id} className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-semibold">
                          <div className={`w-5 h-5 rounded-md ${s.color} flex items-center justify-center text-white text-[9px] font-bold`}>{s.initials}</div>
                          {s.name}
                          <button onClick={() => toggleStudent(s)} className="ml-0.5 text-cyan-400 hover:text-red-400 transition-colors"><X size={11} /></button>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative">
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setDropdownOpen(true); }}
                        onFocus={() => setDropdownOpen(true)}
                        placeholder="Search student by name or department..."
                        className="w-full h-10 pl-9 pr-9 text-sm bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/50 transition-all"
                      />
                      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    {dropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => { setDropdownOpen(false); setSearch(''); }} />
                        <div className="absolute z-20 top-full mt-1.5 w-full bg-white dark:bg-[#1c2133] border border-gray-100 dark:border-white/8 rounded-2xl shadow-xl overflow-hidden">
                          <div className="max-h-64 overflow-y-auto divide-y divide-gray-50 dark:divide-white/[0.04]">
                            {filtered.length === 0 ? (
                              <p className="px-4 py-4 text-xs text-slate-400 text-center">No students found.</p>
                            ) : filtered.map(s => {
                              const isSelected = !!selectedStudents.find(p => p.id === s.id);
                              return (
                                <button
                                  key={s.id}
                                  onClick={() => { toggleStudent(s); setSearch(''); }}
                                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors ${isSelected ? 'bg-cyan-50/50 dark:bg-cyan-500/5' : ''}`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                                    <div className="text-left">
                                      <p className="text-xs font-semibold text-slate-800 dark:text-white">{s.name}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <StatusDot s={s.status} />
                                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.dept}</p>
                                      </div>
                                    </div>
                                  </div>
                                  {isSelected && <CheckCircle2 size={15} className="text-cyan-500 shrink-0" />}
                                </button>
                              );
                            })}
                          </div>
                          <div className="px-4 py-2 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                            <p className="text-[10px] text-slate-400">{filtered.length} student{filtered.length !== 1 ? 's' : ''} · {selectedStudents.length} selected</p>
                            {selectedStudents.length > 0 && (
                              <button onClick={() => setSelectedStudents([])} className="text-[10px] font-semibold text-red-400 hover:text-red-500">Clear all</button>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {selectedStudents.length === 0 && (
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] text-center py-1">Search and select one or more students above.</p>
                  )}
                </div>
              ) : (
                /* Group selector */
                <div className="space-y-2">
                  {GROUPS.map(g => (
                    <button
                      key={g.key}
                      onClick={() => setSelectedGroup(selectedGroup === g.key ? null : g.key)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                        selectedGroup === g.key
                          ? 'border-cyan-500/40 bg-cyan-50 dark:bg-cyan-500/10'
                          : 'border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${g.dot}`} />
                        <span className={`text-xs font-semibold ${selectedGroup === g.key ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>
                          {g.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${g.color}`}>{g.count} students</span>
                        {selectedGroup === g.key && <CheckCircle2 size={15} className="text-cyan-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Compose ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest">Compose Message</p>
                <div className="relative">
                  <button
                    onClick={() => setTemplateOpen(v => !v)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/8 text-[11px] font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <FileText size={12} /> Use Template <ChevronDown size={11} />
                  </button>
                  {templateOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setTemplateOpen(false)} />
                      <div className="absolute z-20 right-0 top-full mt-1.5 w-52 bg-white dark:bg-[#1c2133] border border-gray-100 dark:border-white/8 rounded-2xl shadow-xl overflow-hidden">
                        {TEMPLATES.map(t => (
                          <button
                            key={t.label}
                            onClick={() => applyTemplate(t)}
                            className="w-full text-left px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors border-b border-gray-50 dark:border-white/[0.04] last:border-0"
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1.5">Subject</label>
                <input
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="Enter message subject..."
                  className="w-full h-10 px-4 text-sm bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/50 transition-all"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1.5">Message</label>
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  placeholder="Write your message here... Use {name} to personalise with each student's name."
                  rows={8}
                  className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400/50 transition-all resize-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">{body.length} characters</p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-white transition-colors">
                  <Paperclip size={13} /> Attach File
                </button>
                <button
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all ${
                    sent
                      ? 'bg-emerald-500 text-white'
                      : canSend
                        ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                        : 'bg-gray-100 dark:bg-white/8 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {sent
                    ? <><CheckCircle2 size={14} /> Sent!</>
                    : <><Send size={13} /> Send{recipientCount > 0 ? ` to ${recipientCount} student${recipientCount !== 1 ? 's' : ''}` : ' Message'}</>
                  }
                </button>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ──────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Message Summary</p>
              <div className="space-y-3">
                {[
                  { label: 'Mode',       value: mode === 'individual' ? 'Individual' : 'Group' },
                  { label: 'Recipients', value: recipientCount > 0 ? `${recipientCount} student${recipientCount !== 1 ? 's' : ''}` : 'None selected', highlight: recipientCount > 0 },
                  { label: 'Subject',    value: subject || '—', truncate: true },
                  { label: 'Length',     value: `${body.length} chars` },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-500 dark:text-[#8e92ad] shrink-0">{r.label}</span>
                    <span className={`text-xs font-bold text-right ${r.highlight ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-800 dark:text-white'} ${r.truncate ? 'max-w-[140px] truncate' : ''}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
              {canSend && (
                <div className="mt-4 p-3 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl border border-cyan-100 dark:border-cyan-500/20">
                  <p className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 size={11} /> Ready to send
                  </p>
                </div>
              )}
            </div>

            {/* Selected students list */}
            {mode === 'individual' && selectedStudents.length > 0 && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest">Selected ({selectedStudents.length})</p>
                  <button onClick={() => setSelectedStudents([])} className="text-[10px] font-semibold text-red-400 hover:text-red-500 transition-colors">Clear all</button>
                </div>
                <div className="space-y-3">
                  {selectedStudents.map(s => (
                    <div key={s.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{s.initials}</div>
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">{s.name}</p>
                          <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{s.id}</p>
                        </div>
                      </div>
                      <button onClick={() => toggleStudent(s)} className="p-1 text-slate-300 hover:text-red-400 transition-colors"><X size={12} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected group badge */}
            {mode === 'group' && selectedGroup && (() => {
              const g = GROUPS.find(gr => gr.key === selectedGroup)!;
              return (
                <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-3">Selected Group</p>
                  <div className={`flex items-center justify-between px-4 py-3 rounded-xl ${g.color}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${g.dot}`} />
                      <span className="text-sm font-bold">{g.label}</span>
                    </div>
                    <span className="text-xs font-bold">{g.count}</span>
                  </div>
                </div>
              );
            })()}

            {/* Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Tips</p>
              <div className="space-y-3">
                {[
                  { icon: <MessageSquare size={12} />, text: 'Use {name} to automatically personalise the message with each student\'s name.' },
                  { icon: <Users size={12} />,         text: 'Group messages reach all students in the selected status category.' },
                  { icon: <Clock size={12} />,         text: 'Apply a template first, then customise it to save time.' },
                  { icon: <FileText size={12} />,      text: 'You can select multiple individual students before sending.' },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="mt-0.5 text-cyan-500 shrink-0">{t.icon}</div>
                    <p className="text-[10px] text-slate-500 dark:text-[#8e92ad] leading-relaxed">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Recent Messages ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-50 dark:border-white/5">
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest">Recent Messages</p>
                <button
                  onClick={() => router.push('/counselor/message-history')}
                  className="flex items-center gap-1 text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors"
                >
                  View All <ChevronRight size={12} />
                </button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                {[
                  { initials: 'AY', color: 'bg-yellow-400', subject: 'Interview Preparation Reminder',         to: 'Amina Yusuf',        status: 'Read',      time: 'May 22' },
                  { initials: '',   color: 'bg-red-500',    subject: 'Essay Deadline Alert',                   to: 'At Risk Group (12)',  status: 'Delivered', time: 'May 21' },
                  { initials: 'DM', color: 'bg-blue-500',   subject: 'Session Follow-up — Action Items',       to: 'Daniel Musa',         status: 'Read',      time: 'May 21' },
                  { initials: '',   color: 'bg-cyan-500',   subject: 'Welcome to Fall 2026 Cycle',             to: 'All Students (120)',  status: 'Delivered', time: 'May 20' },
                ].map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className={`w-7 h-7 rounded-lg ${m.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                      {m.initials || <Users size={11} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-slate-800 dark:text-white truncate">{m.subject}</p>
                      <div className="flex items-center justify-between gap-1 mt-0.5">
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{m.to}</p>
                        <span className={`text-[9px] font-bold flex items-center gap-0.5 shrink-0 ${m.status === 'Read' ? 'text-emerald-500' : 'text-blue-500'}`}>
                          <CheckCheck size={9} /> {m.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-50 dark:border-white/5">
                <button
                  onClick={() => router.push('/counselor/message-history')}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
                >
                  <Eye size={13} /> View Full History
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
