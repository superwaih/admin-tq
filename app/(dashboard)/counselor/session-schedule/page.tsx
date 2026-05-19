'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, MessageSquare, ChevronLeft, ChevronRight, Calendar, Clock, CheckCircle, X, User, BookOpen, Video } from 'lucide-react';
import Link from 'next/link';
import { AppRecord, ApplicationDetailsModal } from '@/src/components/shared/ApplicationDetailsModal';

const WEEK_DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const WEEK_DATES = [18,19,20,21,22,23,24];
const WEEK_SESSIONS = [
  { day: 18, count: 3 }, { day: 19, count: 4 }, { day: 20, count: 3 },
  { day: 21, count: 5 }, { day: 22, count: 3 }, { day: 23, count: 4 }, { day: 24, count: 2 },
];

type SessionRecord = {
  name: string; id: string; initials: string; color: string;
  type: string; desc: string; status: string; time: string; end: string;
  dept: string; email: string; university: string; gpa: string;
};

const SESSIONS: Record<string, SessionRecord[]> = {
  'Monday, May 19, 2025': [
    { name: 'Daniel Musa',    id: 'STU-2024-1002', initials: 'DM', color: 'bg-blue-500',   type: 'College Planning Session', desc: 'Discuss college options and application strategy',  status: 'Upcoming',  time: '9:00 AM',  end: '10:00 AM', dept: 'Software Engineering',    email: 'daniel.musa@university.ca',    university: 'University of Toronto', gpa: '3.7' },
    { name: 'Fatima Bello',   id: 'STU-2024-1003', initials: 'FB', color: 'bg-pink-500',   type: 'Essay Writing Review',     desc: 'Personal statement and essay feedback',             status: 'Upcoming',  time: '11:00 AM', end: '12:00 PM', dept: 'Cyber Security',          email: 'fatima.bello@university.ca',   university: 'McGill University',     gpa: '3.9' },
    { name: 'Ibrahim Ali',    id: 'STU-2024-1004', initials: 'IA', color: 'bg-green-500',  type: 'MMI Practice Session',     desc: 'Medical school interview preparation',              status: 'Confirmed', time: '2:00 PM',  end: '3:00 PM',  dept: 'Data Science',            email: 'ibrahim.ali@university.ca',    university: 'UBC',                   gpa: '3.8' },
    { name: 'Maryam Okafor',  id: 'STU-2024-1005', initials: 'MO', color: 'bg-orange-400', type: 'Application Review',       desc: 'Review application materials',                      status: 'Upcoming',  time: '4:00 PM',  end: '5:00 PM',  dept: 'Information Systems',     email: 'maryam.okafor@university.ca',  university: 'Western University',    gpa: '3.6' },
  ],
  'Tuesday, May 20, 2025': [
    { name: 'Joshua Adeyemi', id: 'STU-2024-1006', initials: 'JA', color: 'bg-teal-500',   type: 'Scholarship Guidance',     desc: 'Explore scholarship opportunities',                 status: 'Upcoming',  time: '9:00 AM',  end: '10:00 AM', dept: 'Artificial Intelligence', email: 'joshua.adeyemi@university.ca', university: 'McMaster University',   gpa: '4.0' },
    { name: 'Halima Sani',    id: 'STU-2024-1007', initials: 'HS', color: 'bg-red-400',    type: 'Career Counseling',        desc: 'Career path and major selection guidance',          status: 'Upcoming',  time: '11:30 AM', end: '12:30 PM', dept: 'Computer Science',        email: 'halima.sani@university.ca',    university: 'Queen\'s University',   gpa: '3.5' },
    { name: 'Samuel Johnson', id: 'STU-2024-1008', initials: 'SJ', color: 'bg-purple-500', type: 'Financial Aid Planning',   desc: 'Financial aid and funding options',                 status: 'Upcoming',  time: '3:00 PM',  end: '4:00 PM',  dept: 'Software Engineering',    email: 'samuel.johnson@university.ca', university: 'University of Ottawa',  gpa: '3.4' },
  ],
};

const UPCOMING_SIDEBAR = [
  { name: 'Daniel Musa',    initials: 'DM', color: 'bg-blue-500',   time: 'Today, 9:00 AM',     status: 'Upcoming',  statusCls: 'text-slate-500 dark:text-[#8e92ad]' },
  { name: 'Fatima Bello',   initials: 'FB', color: 'bg-pink-500',   time: 'Today, 11:00 AM',    status: 'Upcoming',  statusCls: 'text-slate-500 dark:text-[#8e92ad]' },
  { name: 'Ibrahim Ali',    initials: 'IA', color: 'bg-green-500',  time: 'Today, 2:00 PM',     status: 'Confirmed', statusCls: 'text-emerald-600 dark:text-emerald-400' },
  { name: 'Maryam Okafor',  initials: 'MO', color: 'bg-orange-400', time: 'Today, 4:00 PM',     status: 'Upcoming',  statusCls: 'text-slate-500 dark:text-[#8e92ad]' },
  { name: 'Joshua Adeyemi', initials: 'JA', color: 'bg-teal-500',   time: 'Tomorrow, 9:00 AM',  status: 'Upcoming',  statusCls: 'text-slate-500 dark:text-[#8e92ad]' },
];

const CAL_DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function sessionToAppRecord(s: SessionRecord, dayLabel: string): AppRecord {
  return {
    name:             s.name,
    university:       s.university,
    progress:         65,
    stage:            'Under Review',
    priority:         'Medium',
    initials:         s.initials,
    color:            s.color,
    program:          s.dept,
    appId:            s.id,
    intake:           'Fall 2026',
    campus:           'Main Campus',
    appDate:          'Jan 15, 2025',
    deadline:         'Jun 1, 2025',
    source:           'Direct',
    referredBy:       '—',
    graduation:       '2026',
    email:            s.email,
    checklist: [
      { label: 'Transcripts',        status: 'SUBMITTED'    },
      { label: 'Personal Statement', status: 'SUBMITTED'    },
      { label: 'Reference Letters',  status: 'PENDING'      },
      { label: 'Test Scores',        status: 'SUBMITTED'    },
      { label: 'Financial Aid Form', status: 'NOT REQUIRED' },
    ],
    academic: {
      gpa:          s.gpa,
      institution:  s.university,
      major:        s.dept,
      yearOfStudy:  '3rd Year',
      mcatScore:    '—',
    },
    progressStep:       1,
    currentStageDesc:   'Application materials are being evaluated by the admissions committee.',
    estimatedUpdate:    'Jun 15, 2025',
  };
}

function StatusBadge({ s }: { s: string }) {
  const cls = s === 'Confirmed'
    ? 'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400'
    : s === 'Cancelled'
      ? 'bg-red-50 dark:bg-red-500/12 text-red-600 dark:text-red-400'
      : 'bg-cyan-50 dark:bg-cyan-500/12 text-sky-700 dark:text-cyan-400';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{s}</span>;
}

export default function SessionSchedulePage() {
  const router = useRouter();
  const [activeDay, setActiveDay]       = useState(19);
  const [calPage, setCalPage]           = useState(0);
  const [modalSession, setModalSession] = useState<SessionRecord | null>(null);

  const dayLabel    = activeDay === 19 ? 'Monday, May 19, 2025' : 'Tuesday, May 20, 2025';
  const daySessions = SESSIONS[dayLabel] ?? [];
  const dayTotal    = WEEK_SESSIONS.find(w => w.day === activeDay)?.count ?? 0;

  const sessionDetailTab = modalSession
    ? {
        key:   'session',
        label: 'Session Details',
        content: (
          <div className="p-6 space-y-5">
            {/* Session type banner */}
            <div className="flex items-center gap-3 p-4 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl border border-cyan-100 dark:border-cyan-500/20">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Video size={18} className="text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-cyan-800 dark:text-cyan-200">{modalSession.type}</p>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">{modalSession.desc}</p>
              </div>
            </div>

            {/* Time & status */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Date',       value: dayLabel.replace(', 2025', '') },
                { label: 'Start Time', value: modalSession.time },
                { label: 'End Time',   value: modalSession.end },
                { label: 'Duration',   value: '1 hour' },
              ].map(r => (
                <div key={r.label} className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3.5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">{r.label}</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{r.value}</p>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={15} className={modalSession.status === 'Confirmed' ? 'text-emerald-500' : 'text-slate-400'} />
                <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">Session Status</span>
              </div>
              <StatusBadge s={modalSession.status} />
            </div>

            {/* Student info */}
            <div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-3">Student</p>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl">
                <div className={`w-10 h-10 rounded-xl ${modalSession.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {modalSession.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{modalSession.name}</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{modalSession.id} · {modalSession.dept}</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{modalSession.email}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setModalSession(null); router.push('/counselor/messages'); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-colors"
              >
                <MessageSquare size={13} /> Message Student
              </button>
              <button
                onClick={() => setModalSession(null)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-100 dark:bg-white/8 hover:bg-gray-200 dark:hover:bg-white/12 text-slate-700 dark:text-[#c8ccdf] text-xs font-bold transition-colors"
              >
                <X size={13} /> Close
              </button>
            </div>
          </div>
        ),
      }
    : undefined;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Session Schedule</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Manage your counseling sessions and availability.</p>
          </div>
          <Link href="/counselor/schedule-session" className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all">
            <Plus size={15} /> Schedule Session
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="space-y-5">
            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'All Sessions', count: 24, active: true },
                { label: 'Upcoming', count: 8 },
                { label: 'Today', count: 3 },
                { label: 'Completed', count: 16 },
                { label: 'Cancelled', count: 2 },
              ].map(f => (
                <button key={f.label}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${f.active ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  {f.label} <span className="opacity-75 text-[10px]">{f.count}</span>
                </button>
              ))}
              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-xs text-slate-500 dark:text-[#8e92ad] ml-auto cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                May 18 – May 24, 2025 <ChevronRight size={13} />
              </div>
            </div>

            {/* Week day selector */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5">
                {WEEK_DAYS.map((d, i) => {
                  const date = WEEK_DATES[i];
                  const isActive = date === activeDay;
                  return (
                    <button key={d} onClick={() => setActiveDay(date)}
                      className={`flex flex-col items-center py-3.5 gap-1 transition-all border-b-2 ${isActive ? 'border-[#0284c7] bg-cyan-50 dark:bg-cyan-500/10' : 'border-transparent hover:bg-gray-50 dark:hover:bg-white/[0.02]'}`}>
                      <span className="text-[10px] font-semibold text-slate-400 dark:text-[#40455e]">{d}</span>
                      <span className={`text-base font-bold ${isActive ? 'text-cyan-600' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>{date}</span>
                      <span className="text-[9px] text-slate-400 dark:text-[#40455e]">{WEEK_SESSIONS.find(w => w.day === date)?.count ?? 0} sessions</span>
                    </button>
                  );
                })}
              </div>

              {/* Session list for active day */}
              <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">{dayLabel}</h3>
                <span className="text-xs text-slate-400 dark:text-[#8e92ad]">{dayTotal} Sessions</span>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                {daySessions.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className="text-right shrink-0 w-20">
                      <p className="text-xs font-bold text-slate-700 dark:text-[#c8ccdf]">{s.time}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.end}</p>
                    </div>
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">ID: {s.id}</p>
                    </div>
                    <div className="hidden sm:block flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{s.type}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{s.desc}</p>
                    </div>
                    <StatusBadge s={s.status} />
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => setModalSession(s)}
                        title="View student details"
                        className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => router.push('/counselor/messages')}
                        title="Message student"
                        className="p-1.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition-colors"
                      >
                        <MessageSquare size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Mini Calendar */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Calendar</h3>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCalPage(p => p - 1)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><ChevronLeft size={14} /></button>
                  <span className="text-xs font-semibold text-slate-600 dark:text-[#c8ccdf] px-1">May 2025</span>
                  <button onClick={() => setCalPage(p => p + 1)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><ChevronRight size={14} /></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                {CAL_DAYS.map(d => <span key={d} className="text-[9px] font-bold text-slate-400 dark:text-[#40455e]">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {Array.from({ length: 35 }, (_, i) => {
                  const num = i - 2;
                  if (num < 1 || num > 31) return <span key={i} />;
                  const isToday = num === 19;
                  const hasDot = [19,21,22,24,27,29].includes(num);
                  return (
                    <div key={i} className={`relative flex flex-col items-center py-0.5 rounded-md text-[10px] font-medium cursor-pointer transition-colors ${isToday ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                      {num}
                      {hasDot && !isToday && <span className="absolute bottom-0 w-1 h-1 rounded-full bg-cyan-600" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Upcoming Sessions</h3>
                <Link href="/counselor/view-calendar" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1 transition-colors">View All <ChevronRight size={12} /></Link>
              </div>
              <div className="space-y-3">
                {UPCOMING_SIDEBAR.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.time}</p>
                    </div>
                    <span className={`text-[10px] font-bold shrink-0 ${s.statusCls}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Session Stats */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Session Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Sessions', value: 24, icon: <Calendar size={13} className="text-slate-400" />,       color: 'text-slate-800 dark:text-white',         bg: 'bg-slate-50 dark:bg-white/5' },
                  { label: 'Upcoming',       value: 8,  icon: <Clock size={13} className="text-blue-500" />,           color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10' },
                  { label: 'Completed',      value: 16, icon: <CheckCircle size={13} className="text-emerald-500" />,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  { label: 'Cancelled',      value: 2,  icon: <X size={13} className="text-red-500" />,               color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-500/10' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                    <div className="flex items-center justify-between mb-1">{s.icon}</div>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.label}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {modalSession && (
        <ApplicationDetailsModal
          app={sessionToAppRecord(modalSession, dayLabel)}
          onClose={() => setModalSession(null)}
          extraTab={sessionDetailTab}
        />
      )}
    </div>
  );
}
