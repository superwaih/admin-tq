'use client';

import { useState } from 'react';
import {
  Users, Calendar, FileText, TrendingUp, MoreHorizontal,
  ArrowUpRight, Bell, ChevronRight, Upload, Mic,
  MessageSquare, BarChart3,
} from 'lucide-react';
import Link from 'next/link';
import { AppRecord, ApplicationDetailsModal } from '@/src/components/shared/ApplicationDetailsModal';

const STAT_CARDS = [
  { label: 'Total Students', value: '128', trend: '+12% vs last month', icon: <Users size={18} />, iconBg: 'bg-blue-50 dark:bg-blue-500/15', iconColor: 'text-blue-600', valueColor: 'text-blue-700 dark:text-blue-400', trendColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Sessions This Week', value: '24', trend: '+8% vs last week', icon: <Calendar size={18} />, iconBg: 'bg-emerald-50 dark:bg-emerald-500/15', iconColor: 'text-emerald-600', valueColor: 'text-emerald-700 dark:text-emerald-400', trendColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Pending Reviews', value: '18', trend: '+5 vs last week', icon: <FileText size={18} />, iconBg: 'bg-amber-50 dark:bg-amber-500/15', iconColor: 'text-amber-600', valueColor: 'text-amber-700 dark:text-amber-400', trendColor: 'text-amber-600 dark:text-amber-400' },
  { label: 'Success Rate', value: '92%', trend: '+4% vs last month', icon: <TrendingUp size={18} />, iconBg: 'bg-purple-50 dark:bg-purple-500/15', iconColor: 'text-purple-600', valueColor: 'text-purple-700 dark:text-purple-400', trendColor: 'text-emerald-600 dark:text-emerald-400' },
];

const SESSIONS = [
  { name: 'Aisha Patel',   university: 'McGill University',    program: 'MD Program',     time: 'Today, 4:00 PM',      type: 'Essay Review',  initials: 'AP', color: 'bg-orange-400' },
  { name: 'Ethan Kim',     university: 'University of Toronto', program: 'MD Program',    time: 'Today, 6:00 PM',      type: 'MMI Prep',      initials: 'EK', color: 'bg-blue-500' },
  { name: 'Sophie Martin', university: 'Western University',    program: 'DDS Program',   time: 'Tomorrow, 11:00 AM',  type: 'Consultation',  initials: 'SM', color: 'bg-pink-500' },
  { name: 'Arjun Mehta',   university: 'UBC',                  program: 'DDS Program',   time: 'May 22, 2025',        type: 'Essay Review',  initials: 'AM', color: 'bg-green-500' },
];

const APPLICATIONS: AppRecord[] = [
  {
    name: 'Aisha Patel', university: 'McGill University', progress: 75, stage: 'Interview',
    priority: 'High', initials: 'AP', color: 'bg-orange-400',
    program: 'MD Program', appId: 'APP-2025-00128', intake: 'FSL 2026', campus: 'Montreal, Canada',
    appDate: 'May 13, 2025', deadline: 'June 30, 2025', source: 'Website', referredBy: 'Dr. Sarah Johnson',
    graduation: 'Expected Graduation 2026', email: 'aisha.patel@email.com',
    checklist: [
      { label: 'Personal Statement',      status: 'SUBMITTED' },
      { label: 'Transcript',              status: 'SUBMITTED' },
      { label: 'Letter of Recommendation',status: 'SUBMITTED' },
      { label: 'Resume / CV',             status: 'SUBMITTED' },
      { label: 'Application Fee',         status: 'PENDING'   },
    ],
    academic: { gpa: '3.85 / 4.00', institution: 'McG University', major: 'Biochemistry', yearOfStudy: 'Final Year', mcatScore: '512 (85th Percentile)' },
    progressStep: 2, currentStageDesc: 'Your application is currently being reviewed by the admission team.', estimatedUpdate: 'May 27, 2025',
  },
  {
    name: 'Ethan Kim', university: 'University of Toronto', progress: 60, stage: 'Secondary',
    priority: 'Medium', initials: 'EK', color: 'bg-blue-500',
    program: 'MD Program', appId: 'APP-2025-00219', intake: 'Fall 2026', campus: 'Toronto, Canada',
    appDate: 'April 20, 2025', deadline: 'July 15, 2025', source: 'Referral', referredBy: 'Prof. James Lee',
    graduation: 'Expected Graduation 2027', email: 'ethan.kim@email.com',
    checklist: [
      { label: 'Personal Statement',      status: 'SUBMITTED' },
      { label: 'Transcript',              status: 'SUBMITTED' },
      { label: 'Letter of Recommendation',status: 'PENDING'   },
      { label: 'Resume / CV',             status: 'SUBMITTED' },
      { label: 'Application Fee',         status: 'PENDING'   },
    ],
    academic: { gpa: '3.72 / 4.00', institution: 'University of Waterloo', major: 'Life Sciences', yearOfStudy: '4th Year', mcatScore: '507 (74th Percentile)' },
    progressStep: 2, currentStageDesc: 'Secondary application forms have been received and are under review.', estimatedUpdate: 'June 10, 2025',
  },
  {
    name: 'Sophie Martin', university: 'Western University', progress: 40, stage: 'Essays',
    priority: 'Medium', initials: 'SM', color: 'bg-pink-500',
    program: 'DDS Program', appId: 'APP-2025-00341', intake: 'Fall 2026', campus: 'London, Canada',
    appDate: 'March 5, 2025', deadline: 'August 1, 2025', source: 'School Event', referredBy: 'Ms. Amara Singh',
    graduation: 'Expected Graduation 2028', email: 'sophie.martin@email.com',
    checklist: [
      { label: 'Personal Statement',      status: 'PENDING'   },
      { label: 'Transcript',              status: 'SUBMITTED' },
      { label: 'Letter of Recommendation',status: 'SUBMITTED' },
      { label: 'Resume / CV',             status: 'PENDING'   },
      { label: 'Application Fee',         status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.65 / 4.00', institution: 'Western University', major: 'Biology', yearOfStudy: '3rd Year', mcatScore: '505 (70th Percentile)' },
    progressStep: 1, currentStageDesc: 'Essay submissions are currently being reviewed by the counselor.', estimatedUpdate: 'June 20, 2025',
  },
  {
    name: 'Arjun Mehta', university: 'UBC', progress: 80, stage: 'Interview',
    priority: 'High', initials: 'AM', color: 'bg-green-500',
    program: 'DDS Program', appId: 'APP-2025-00456', intake: 'Winter 2026', campus: 'Vancouver, Canada',
    appDate: 'February 18, 2025', deadline: 'May 30, 2025', source: 'Direct', referredBy: 'Dr. Sarah Johnson',
    graduation: 'Expected Graduation 2026', email: 'arjun.mehta@email.com',
    checklist: [
      { label: 'Personal Statement',      status: 'SUBMITTED' },
      { label: 'Transcript',              status: 'SUBMITTED' },
      { label: 'Letter of Recommendation',status: 'SUBMITTED' },
      { label: 'Resume / CV',             status: 'SUBMITTED' },
      { label: 'Application Fee',         status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.91 / 4.00', institution: 'UBC', major: 'Microbiology', yearOfStudy: 'Final Year', mcatScore: '518 (97th Percentile)' },
    progressStep: 3, currentStageDesc: 'Interview has been scheduled. Please prepare using the MMI guide.', estimatedUpdate: 'May 28, 2025',
  },
  {
    name: 'Maya Chen', university: 'Johns Hopkins', progress: 30, stage: 'Essays',
    priority: 'Low', initials: 'MC', color: 'bg-purple-500',
    program: 'MPH Program', appId: 'APP-2025-00512', intake: 'Spring 2026', campus: 'Baltimore, USA',
    appDate: 'April 1, 2025', deadline: 'September 1, 2025', source: 'Online', referredBy: 'Mr. David Chen',
    graduation: 'Expected Graduation 2027', email: 'maya.chen@email.com',
    checklist: [
      { label: 'Personal Statement',      status: 'PENDING'   },
      { label: 'Transcript',              status: 'PENDING'   },
      { label: 'Letter of Recommendation',status: 'SUBMITTED' },
      { label: 'Resume / CV',             status: 'SUBMITTED' },
      { label: 'Application Fee',         status: 'PENDING'   },
    ],
    academic: { gpa: '3.50 / 4.00', institution: 'NYU', major: 'Public Health', yearOfStudy: '2nd Year', mcatScore: 'N/A' },
    progressStep: 1, currentStageDesc: 'Application essays are pending submission. Please complete them promptly.', estimatedUpdate: 'July 5, 2025',
  },
];

const QUICK_ACTIONS = [
  { label: 'Upload Resources',   icon: <Upload size={15} />,      color: 'text-blue-600',   bg: 'bg-blue-50 dark:bg-blue-500/15',   href: '/counselor/upload-resources' },
  { label: 'Start Mock Interview', icon: <Mic size={15} />,       color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/15', href: '/counselor/start-mock-interview' },
  { label: 'Review Essay',       icon: <FileText size={15} />,    color: 'text-amber-600',  bg: 'bg-amber-50 dark:bg-amber-500/15',  href: '/counselor/review-essay' },
  { label: 'Message Student',    icon: <MessageSquare size={15} />, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/15', href: '/counselor/message-student' },
];

const NOTIFICATIONS = [
  { title: 'New message from Aisha Patel', sub: 'Thanks for the feedback on my...', time: '2m ago', dot: true },
  { title: 'Essay submitted by Ethan Kim', sub: 'Personal Statement.docx', time: '1h ago', dot: true },
  { title: 'Interview invitation received', sub: 'MMI Preparation Guide.pdf', time: '3h ago', dot: false },
];

const RECENT_ACTIVITY = [
  { icon: <FileText size={14} />, text: 'Aisha Patel joined the session', sub: 'Essay Review · Today, 4:02 PM', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/15' },
  { icon: <FileText size={14} />, text: 'You reviewed an essay for Ethan Kim', sub: 'Personal Statement · Today, 11:30 AM', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/15' },
  { icon: <Calendar size={14} />, text: 'Sophie Martin booked a session', sub: 'MMI Prep · Yesterday, 6:15 PM', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/15' },
  { icon: <Upload size={14} />, text: 'New resource uploaded', sub: 'MMI Preparation Guide.pdf · May 16', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/15' },
];

const CAL_DAYS = ['S','M','T','W','T','F','S'];
const PROD_ITEMS = [
  { label: 'Sessions Completed', value: 16, max: 20, color: 'bg-blue-500' },
  { label: 'Essay Reviews',      value: 12, max: 15, color: 'bg-emerald-500' },
  { label: 'Student Interactions', value: 28, max: 35, color: 'bg-purple-500' },
];

function PriorityBadge({ p }: { p: string }) {
  const cls = p === 'High' ? 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400' : p === 'Medium' ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{p}</span>;
}


export default function CounselorDashboard() {
  const [selectedApp, setSelectedApp] = useState<AppRecord | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Counselor Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">Manage student applications, sessions, and mentorship activities.</p>
          </div>
          <Link href="/counselor/schedule-session"
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all">
            <Calendar size={15} /> Schedule Session
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg} ${s.iconColor}`}>{s.icon}</div>
                <button className="text-slate-300 dark:text-slate-600 hover:text-slate-400 transition-colors"><MoreHorizontal size={15} /></button>
              </div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-0.5 ${s.valueColor}`}>{s.value}</p>
              <p className={`text-[11px] font-medium mt-1 flex items-center gap-1 ${s.trendColor}`}>
                <ArrowUpRight size={11} /> {s.trend}
              </p>
            </div>
          ))}
        </div>

        {/* Main 2-column: content + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 items-start">

          {/* Left */}
          <div className="space-y-5">

            {/* Upcoming sessions */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Upcoming Sessions</h2>
                <Link href="/counselor/view-calendar" className="text-xs font-semibold text-cyan-600 hover:text-sky-700 flex items-center gap-1">
                  View Calendar <ChevronRight size={13} />
                </Link>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {SESSIONS.map((s, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{s.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-xs text-slate-400 dark:text-[#8e92ad] truncate">{s.university} · {s.type}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500 dark:text-[#8e92ad]">{s.time}</p>
                      <a
                        href="https://zoom.us/join"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-[11px] font-bold px-3 py-1 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
                      >
                        Join Session
                      </a>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5">
                <Link href="/counselor/session-schedule" className="text-xs font-semibold text-cyan-600 hover:text-sky-700 flex items-center gap-1">
                  View All Sessions <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* Student Applications */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Student Applications</h2>
                <Link href="/counselor/student-applications" className="text-xs font-semibold text-cyan-600 hover:text-sky-700 flex items-center gap-1">
                  View All <ChevronRight size={13} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 dark:border-white/5">
                      {['STUDENT','UNIVERSITY','PROGRESS','STAGE','PRIORITY','ACTION'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e]">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {APPLICATIONS.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg ${a.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{a.initials}</div>
                            <p className="text-xs font-semibold text-slate-800 dark:text-white truncate max-w-[80px]">{a.name.split(' ')[0]} {a.name.split(' ')[1]?.charAt(0)}.</p>
                          </div>
                        </td>
                        <td className="px-5 py-3"><p className="text-xs text-slate-500 dark:text-[#8e92ad] truncate max-w-[120px]">{a.university}</p></td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden min-w-[60px]">
                              <div className="h-full bg-cyan-600 rounded-full" style={{ width: `${a.progress}%` }} />
                            </div>
                            <span className="text-xs text-slate-500 dark:text-[#8e92ad] tabular-nums shrink-0">{a.progress}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3"><span className="text-xs text-slate-600 dark:text-[#c8ccdf]">{a.stage}</span></td>
                        <td className="px-5 py-3"><PriorityBadge p={a.priority} /></td>
                        <td className="px-5 py-3">
                          <button
                            onClick={() => setSelectedApp(a)}
                            className="text-[11px] font-bold text-cyan-600 hover:text-sky-700 transition-colors"
                          >View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5">
                <Link href="/counselor/student-applications" className="text-xs font-semibold text-cyan-600 flex items-center gap-1">
                  View All Applications <ChevronRight size={13} />
                </Link>
              </div>
            </div>

            {/* Bottom row: schedule + productivity + activity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              {/* My Schedule mini calendar */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">My Schedule</h3>
                  <span className="text-xs text-slate-400 dark:text-[#8e92ad]">May 2025</span>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                  {CAL_DAYS.map((d, i) => <span key={i} className="text-[9px] font-bold text-slate-400 dark:text-[#40455e]">{d}</span>)}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 2; // May starts on Thursday (index 4)
                    const num = day + 1;
                    const isToday = num === 20;
                    const hasDot = [19, 22, 24, 27, 29].includes(num);
                    if (num < 1 || num > 31) return <span key={i} />;
                    return (
                      <div key={i} className={`relative flex flex-col items-center py-0.5 rounded-md text-[10px] font-medium transition-colors cursor-pointer ${isToday ? 'bg-cyan-600 text-white font-bold' : 'text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        {num}
                        {hasDot && !isToday && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-600" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Counselor Productivity */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Counselor Productivity</h3>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg width="64" height="64" className="-rotate-90">
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#e2e8f0" strokeWidth="7" className="dark:stroke-white/8" />
                      <circle cx="32" cy="32" r="26" fill="none" stroke="#0284c7" strokeWidth="7" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 26 * 0.78} ${2 * Math.PI * 26 * 0.22}`} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-slate-800 dark:text-white">78%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-white">Great Progress!</p>
                    <p className="text-xs text-slate-500 dark:text-[#8e92ad]">On track to reach your weekly goals.</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {PROD_ITEMS.map(p => (
                    <div key={p.label}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad]">{p.label}</p>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf]">{p.value}/{p.max}</p>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.value / p.max) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                  <Link href="/counselor/recent-activity" className="text-xs font-semibold text-cyan-600 hover:text-sky-700 flex items-center gap-1">View All <ChevronRight size={13} /></Link>
                </div>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-7 h-7 rounded-lg ${a.bg} ${a.color} flex items-center justify-center shrink-0 mt-0.5`}>{a.icon}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-700 dark:text-white leading-snug truncate">{a.text}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-0.5">{a.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map(a => (
                  <Link key={a.label} href={a.href}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${a.bg} ${a.color} flex items-center justify-center`}>{a.icon}</div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{a.label}</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 dark:text-[#40455e] group-hover:text-slate-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Performance Insights</h3>
                <span className="text-xs text-slate-400 dark:text-[#8e92ad]">This Week</span>
              </div>
              <div className="mb-3">
                <p className="text-xs text-slate-500 dark:text-[#8e92ad]">Weekly Success Rate</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5">92%</p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ArrowUpRight size={11} /> 4% vs last week
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-[#8e92ad]">Student Engagement Score</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-0.5">86<span className="text-sm text-slate-400 dark:text-[#8e92ad] font-medium">/100</span></p>
                <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <ArrowUpRight size={11} /> 6 pts vs last week
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notifications</h3>
                <Link href="/counselor/notifications" className="text-xs font-semibold text-cyan-600 hover:text-sky-700 flex items-center gap-1">View All <ChevronRight size={13} /></Link>
              </div>
              <div className="space-y-3">
                {NOTIFICATIONS.map((n, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center shrink-0">
                      <Bell size={13} className="text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-700 dark:text-white truncate">{n.title}</p>
                        {n.dot && <span className="w-2 h-2 bg-cyan-600 rounded-full shrink-0" />}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{n.sub}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-[#40455e] shrink-0">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {selectedApp && (
        <ApplicationDetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}
