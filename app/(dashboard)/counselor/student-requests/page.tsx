'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Filter, Eye, ChevronRight, ChevronLeft,
  Upload, Mic, FileText, MessageSquare,
  Calendar, Clock, Tag, AlertCircle, CheckCircle2, Layers,
} from 'lucide-react';
import { AppRecord, ApplicationDetailsModal } from '@/src/components/shared/ApplicationDetailsModal';

// ── Extended type ──────────────────────────────────────────────────────────────
interface RequestRecord extends AppRecord {
  uni: string;
  type: 'Session' | 'Review' | 'Mentorship';
  topic: string;
  detail: string;
  date: string;
  time: string;
  requestStatus: 'New' | 'In Progress' | 'Pending' | 'Completed';
}

// ── Data ───────────────────────────────────────────────────────────────────────
const REQUESTS: RequestRecord[] = [
  {
    name: 'Aisha Patel', initials: 'AP', color: 'bg-orange-400',
    university: 'McGill University', uni: 'McGill University',
    type: 'Session', topic: 'Interview Preparation', detail: 'MD Program Interview',
    date: 'May 22, 2025', time: '4:00 PM', priority: 'High', requestStatus: 'New',
    program: 'MD Program', progress: 75, stage: 'Interview',
    appId: 'APP-2025-00128', intake: 'Fall 2026', campus: 'Montreal, Canada',
    appDate: 'May 13, 2025', deadline: 'June 30, 2025', source: 'Website', referredBy: 'Dr. Sarah Johnson',
    graduation: 'Expected Graduation 2026', email: 'aisha.patel@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'PENDING'   },
    ],
    academic: { gpa: '3.85 / 4.00', institution: 'McGill University', major: 'Biochemistry', yearOfStudy: 'Final Year', mcatScore: '512 (85th Percentile)' },
    progressStep: 3, currentStageDesc: 'Interview scheduled. Student requests session to prepare.', estimatedUpdate: 'May 27, 2025',
  },
  {
    name: 'Ethan Kim', initials: 'EK', color: 'bg-blue-500',
    university: 'University of Toronto', uni: 'University of Toronto',
    type: 'Review', topic: 'Essay Review', detail: 'Personal Statement',
    date: 'May 22, 2025', time: '6:00 PM', priority: 'Medium', requestStatus: 'New',
    program: 'MD Program', progress: 60, stage: 'Secondary',
    appId: 'APP-2025-00219', intake: 'Fall 2026', campus: 'Toronto, Canada',
    appDate: 'April 20, 2025', deadline: 'July 15, 2025', source: 'Referral', referredBy: 'Prof. James Lee',
    graduation: 'Expected Graduation 2027', email: 'ethan.kim@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'PENDING'   },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'PENDING'   },
    ],
    academic: { gpa: '3.72 / 4.00', institution: 'University of Waterloo', major: 'Life Sciences', yearOfStudy: '4th Year', mcatScore: '507 (74th Percentile)' },
    progressStep: 2, currentStageDesc: 'Secondary application received. Student requests essay review.', estimatedUpdate: 'June 10, 2025',
  },
  {
    name: 'Sophie Martin', initials: 'SM', color: 'bg-pink-500',
    university: 'Western University', uni: 'Western University',
    type: 'Mentorship', topic: 'Career Guidance', detail: 'Specialization Advice',
    date: 'May 22, 2025', time: '6:30 PM', priority: 'Medium', requestStatus: 'In Progress',
    program: 'DDS Program', progress: 40, stage: 'Essays',
    appId: 'APP-2025-00341', intake: 'Fall 2026', campus: 'London, Canada',
    appDate: 'March 5, 2025', deadline: 'August 1, 2025', source: 'School Event', referredBy: 'Ms. Amara Singh',
    graduation: 'Expected Graduation 2028', email: 'sophie.martin@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'PENDING'   },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'PENDING'   },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.65 / 4.00', institution: 'Western University', major: 'Biology', yearOfStudy: '3rd Year', mcatScore: '505 (70th Percentile)' },
    progressStep: 1, currentStageDesc: 'Mentorship session in progress. Career guidance underway.', estimatedUpdate: 'June 20, 2025',
  },
  {
    name: 'Arjun Mehta', initials: 'AM', color: 'bg-green-500',
    university: 'UBC', uni: 'UBC',
    type: 'Session', topic: 'MMI Coaching', detail: 'Multiple Mini Interview',
    date: 'May 22, 2025', time: '7:15 PM', priority: 'High', requestStatus: 'New',
    program: 'DDS Program', progress: 80, stage: 'Interview',
    appId: 'APP-2025-00456', intake: 'Winter 2026', campus: 'Vancouver, Canada',
    appDate: 'February 18, 2025', deadline: 'May 30, 2025', source: 'Direct', referredBy: 'Dr. Sarah Johnson',
    graduation: 'Expected Graduation 2026', email: 'arjun.mehta@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.91 / 4.00', institution: 'UBC', major: 'Microbiology', yearOfStudy: 'Final Year', mcatScore: '518 (97th Percentile)' },
    progressStep: 3, currentStageDesc: 'Interview scheduled. Requesting MMI coaching session.', estimatedUpdate: 'May 28, 2025',
  },
  {
    name: 'Maya Chen', initials: 'MC', color: 'bg-purple-500',
    university: 'Johns Hopkins', uni: 'Johns Hopkins',
    type: 'Review', topic: 'Essay Review', detail: 'Why Medicine Essay',
    date: 'May 22, 2025', time: '7:45 PM', priority: 'Low', requestStatus: 'New',
    program: 'MPH Program', progress: 30, stage: 'Essays',
    appId: 'APP-2025-00512', intake: 'Spring 2026', campus: 'Baltimore, USA',
    appDate: 'April 1, 2025', deadline: 'September 1, 2025', source: 'Online', referredBy: 'Mr. David Chen',
    graduation: 'Expected Graduation 2027', email: 'maya.chen@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'PENDING'   },
      { label: 'Transcript',               status: 'PENDING'   },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'PENDING'   },
    ],
    academic: { gpa: '3.50 / 4.00', institution: 'NYU', major: 'Public Health', yearOfStudy: '2nd Year', mcatScore: 'N/A' },
    progressStep: 1, currentStageDesc: 'Essay review requested. Application essays pending submission.', estimatedUpdate: 'July 5, 2025',
  },
  {
    name: "Liam O'Connor", initials: 'LO', color: 'bg-teal-500',
    university: 'University of Sydney', uni: 'University of Sydney',
    type: 'Session', topic: 'Interview Preparation', detail: 'MD Program Interview',
    date: 'May 22, 2025', time: '8:10 PM', priority: 'Medium', requestStatus: 'Pending',
    program: 'MD Program', progress: 55, stage: 'Secondary',
    appId: 'APP-2025-00623', intake: 'Fall 2026', campus: 'Sydney, Australia',
    appDate: 'March 12, 2025', deadline: 'July 30, 2025', source: 'Website', referredBy: 'Dr. Patrick O\'Brien',
    graduation: 'Expected Graduation 2027', email: 'liam.oconnor@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'PENDING'   },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.60 / 4.00', institution: 'University of Sydney', major: 'Physiology', yearOfStudy: '3rd Year', mcatScore: '508 (76th Percentile)' },
    progressStep: 2, currentStageDesc: 'Counselor session pending confirmation. Secondary materials under review.', estimatedUpdate: 'June 15, 2025',
  },
  {
    name: 'Isabella Rossi', initials: 'IR', color: 'bg-red-400',
    university: 'Univ. of Melbourne', uni: 'Univ. of Melbourne',
    type: 'Mentorship', topic: 'Study Plan Guidance', detail: 'Pre-med Roadmap',
    date: 'May 22, 2025', time: '8:25 PM', priority: 'Low', requestStatus: 'In Progress',
    program: 'MD Program', progress: 48, stage: 'Essays',
    appId: 'APP-2025-00734', intake: 'Fall 2026', campus: 'Melbourne, Australia',
    appDate: 'April 8, 2025', deadline: 'August 20, 2025', source: 'School Event', referredBy: 'Prof. Elena Greco',
    graduation: 'Expected Graduation 2028', email: 'isabella.rossi@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'PENDING'   },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'PENDING'   },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.55 / 4.00', institution: 'University of Melbourne', major: 'Biomedical Science', yearOfStudy: '2nd Year', mcatScore: 'N/A' },
    progressStep: 1, currentStageDesc: 'Mentorship roadmap session in progress. Pre-med guidance ongoing.', estimatedUpdate: 'July 8, 2025',
  },
];

const TABS = ['All Requests', 'Session Requests', 'Review Requests', 'Mentorship Requests'];

const TOPICS_PIE = [
  { label: 'Interview Prep', pct: 42, color: '#0284c7' },
  { label: 'Essay Review',   pct: 33, color: '#7c3aed' },
  { label: 'MMI Coaching',   pct: 17, color: '#10b981' },
  { label: 'Career Guidance', pct: 8,  color: '#f59e0b' },
];

const QUICK_ACTIONS = [
  { label: 'Upload Resources',    Icon: Upload,        color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-500/15',    href: '/counselor/upload-resources' },
  { label: 'Start Mock Interview', Icon: Mic,          color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/15', href: '/counselor/start-mock-interview' },
  { label: 'Review Essay',        Icon: FileText,      color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-500/15',  href: '/counselor/review-essay' },
  { label: 'Message Student',     Icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/15', href: '/counselor/message-student' },
];

function PriorityBadge({ p }: { p: string }) {
  const cls = p === 'High' ? 'text-red-600 dark:text-red-400' : p === 'Medium' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400';
  return <span className={`text-xs font-bold ${cls}`}>{p}</span>;
}

function StatusBadge({ s }: { s: string }) {
  const cls = s === 'New' ? 'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400' : s === 'In Progress' ? 'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400' : s === 'Completed' ? 'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400' : 'bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400';
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls}`}>{s}</span>;
}

function TypeBadge({ t }: { t: string }) {
  const cls = t === 'Session' ? 'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400' : t === 'Review' ? 'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400' : 'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400';
  return <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${cls}`}>{t}</span>;
}

function RequestDetailsTab({ r }: { r: RequestRecord }) {
  const typeColor = r.type === 'Session' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : r.type === 'Review' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10' : 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10';
  const statusColor = r.requestStatus === 'New' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : r.requestStatus === 'In Progress' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : r.requestStatus === 'Completed' ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10';
  const priorityColor = r.priority === 'High' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10' : r.priority === 'Medium' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5';

  return (
    <div className="space-y-4">
      {/* Status banner */}
      <div className={`rounded-2xl px-5 py-4 flex items-center justify-between ${statusColor}`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Request Status</p>
          <p className="text-lg font-bold">{r.requestStatus}</p>
        </div>
        <CheckCircle2 size={28} className="opacity-30" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Request Info */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Request Information</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <Layers size={9} /> Request Type
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${typeColor}`}>{r.type}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <Tag size={9} /> Topic
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.topic}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <FileText size={9} /> Details
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.detail}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <AlertCircle size={9} /> Priority
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${priorityColor}`}>{r.priority}</span>
            </div>
          </div>
        </div>

        {/* Schedule Info */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Schedule & Contact</p>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <Calendar size={9} /> Requested Date
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.date}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <Clock size={9} /> Requested Time
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.time}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <MessageSquare size={9} /> Email
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.email}</p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[9px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                <CheckCircle2 size={9} /> Status
              </div>
              <StatusBadge s={r.requestStatus} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Layers size={16} />,      label: 'Type',     value: r.type,          color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { icon: <AlertCircle size={16} />, label: 'Priority', value: r.priority,      color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
          { icon: <Clock size={16} />,       label: 'Time Slot', value: r.time,         color: 'text-cyan-600 dark:text-cyan-400',   bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-4 text-center`}>
            <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
            <p className="text-[9px] font-semibold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-xs font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StudentRequestsPage() {
  const [activeTab, setActiveTab] = useState('All Requests');
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<RequestRecord | null>(null);

  const filtered = REQUESTS.filter(r =>
    activeTab === 'All Requests'       ? true :
    activeTab === 'Session Requests'   ? r.type === 'Session' :
    activeTab === 'Review Requests'    ? r.type === 'Review' :
    r.type === 'Mentorship'
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Requests</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Review and manage student requests for sessions, reviews, and mentorship.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">

          <div className="space-y-4">
            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                {TABS.map(tab => {
                  const count = tab === 'All Requests' ? REQUESTS.length : tab === 'Session Requests' ? REQUESTS.filter(r => r.type === 'Session').length : tab === 'Review Requests' ? REQUESTS.filter(r => r.type === 'Review').length : REQUESTS.filter(r => r.type === 'Mentorship').length;
                  return (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                      {tab.replace(' Requests','').replace('All ','All ')} <span className="text-[10px] font-bold opacity-80">{count}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search requests..." className="h-9 pl-9 pr-4 text-sm bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 transition-all" />
                </div>
                <button className="flex items-center gap-1.5 h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <Filter size={13} /> Filters
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      {['STUDENT','REQUEST TYPE','TOPIC / DETAILS','REQUESTED ON','PRIORITY','STATUS','ACTION'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {filtered.map((r, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-9 h-9 rounded-xl ${r.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{r.initials}</div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">{r.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.uni}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><TypeBadge t={r.type} /></td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{r.topic}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.detail}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{r.date}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.time}</p>
                        </td>
                        <td className="px-5 py-3.5"><PriorityBadge p={r.priority} /></td>
                        <td className="px-5 py-3.5"><StatusBadge s={r.requestStatus} /></td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setSelectedRequest(r)}
                            className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to {filtered.length} of {filtered.length} requests</p>
                <div className="flex items-center gap-1">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"><ChevronLeft size={14} /></button>
                  <span className="w-7 h-7 rounded-md bg-cyan-600 text-white text-xs font-bold flex items-center justify-center">{page}</span>
                  <button onClick={() => setPage(p => p + 1)} className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Request Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Requests', value: REQUESTS.length, color: 'text-slate-800 dark:text-white', bg: 'bg-slate-50 dark:bg-white/5' },
                  { label: 'New Requests',   value: REQUESTS.filter(r => r.requestStatus === 'New').length,         color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                  { label: 'In Progress',    value: REQUESTS.filter(r => r.requestStatus === 'In Progress').length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  { label: 'Completed',      value: 2,                                                              color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.label}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1">View All Requests <ChevronRight size={12} /></button>
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {QUICK_ACTIONS.map(a => (
                  <Link key={a.label} href={a.href}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${a.bg} ${a.color} flex items-center justify-center`}><a.Icon size={14} /></div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{a.label}</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 dark:text-[#40455e] group-hover:text-slate-500 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Top Request Topics</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0">
                  <svg width="80" height="80" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-white/8" />
                    {[
                      { pct: 42, color: '#0284c7', offset: 0 },
                      { pct: 33, color: '#7c3aed', offset: 42 },
                      { pct: 17, color: '#10b981', offset: 75 },
                      { pct: 8,  color: '#f59e0b', offset: 92 },
                    ].map((s, i) => {
                      const circ = 2 * Math.PI * 30;
                      return (
                        <circle key={i} cx="40" cy="40" r="30" fill="none"
                          stroke={s.color} strokeWidth="10"
                          strokeDasharray={`${(s.pct / 100) * circ - 1} ${circ - (s.pct / 100) * circ + 1}`}
                          strokeDashoffset={-((s.offset / 100) * circ) + circ / 4}
                          strokeLinecap="round"
                        />
                      );
                    })}
                    <text x="40" y="44" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1e293b" className="dark:fill-white">12</text>
                  </svg>
                </div>
                <div className="space-y-2 flex-1">
                  {TOPICS_PIE.map(t => (
                    <div key={t.label} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.color }} />
                        <span className="text-[10px] text-slate-500 dark:text-[#8e92ad] truncate">{t.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-[#c8ccdf] shrink-0">{t.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full Analytics <ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      </div>

      {selectedRequest && (
        <ApplicationDetailsModal
          app={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          extraTab={{
            key: 'request',
            label: 'Request Details',
            content: <RequestDetailsTab r={selectedRequest} />,
          }}
        />
      )}
    </div>
  );
}
