'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search, Filter, Plus, Eye, MessageSquare, ChevronRight, ChevronLeft,
  Upload, Calendar, BarChart2, Users, UserCheck, AlertTriangle, GraduationCap,
  BookOpen, Award, Clock, Activity,
} from 'lucide-react';
import { AppRecord, ApplicationDetailsModal } from '@/src/components/shared/ApplicationDetailsModal';

// ── Extended type ──────────────────────────────────────────────────────────────
interface StudentRecord extends AppRecord {
  id: string;
  dept: string;
  level: string;
  gpa: number;
  attendance: number;
  status: 'Excellent' | 'Active' | 'At Risk' | 'Warning';
  lastActivity: string;
  lastDate: string;
  enrolledSince: string;
  advisor: string;
  coursesCompleted: number;
  totalCourses: number;
  sessionCount: number;
}

// ── Student data ───────────────────────────────────────────────────────────────
const STUDENTS: StudentRecord[] = [
  {
    name: 'Amina Yusuf', id: 'STU-2024-1001', dept: 'Computer Science', level: '300 Level',
    gpa: 4.7, attendance: 92, status: 'Excellent', lastActivity: '2 hrs ago', lastDate: 'May 22, 2025',
    initials: 'AY', color: 'bg-yellow-400', university: 'McGill University',
    program: 'MD Program', progress: 88, stage: 'Decision', priority: 'High',
    appId: 'APP-2025-00101', intake: 'Fall 2026', campus: 'Montreal, Canada',
    appDate: 'May 1, 2025', deadline: 'June 15, 2025', source: 'Website', referredBy: 'Dr. Kofi Mensah',
    graduation: 'Expected Graduation 2026', email: 'amina.yusuf@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'PENDING'   },
    ],
    academic: { gpa: '4.7 / 5.0', institution: 'McGill University', major: 'Computer Science', yearOfStudy: '3rd Year', mcatScore: '514 (88th Percentile)' },
    progressStep: 4, currentStageDesc: 'Decision is pending from the admissions committee.', estimatedUpdate: 'May 30, 2025',
    enrolledSince: 'September 2022', advisor: 'Dr. Sarah Johnson', coursesCompleted: 28, totalCourses: 40, sessionCount: 14,
  },
  {
    name: 'Daniel Musa', id: 'STU-2024-1002', dept: 'Software Engineering', level: '300 Level',
    gpa: 3.2, attendance: 68, status: 'At Risk', lastActivity: 'Yesterday', lastDate: 'May 21, 2025',
    initials: 'DM', color: 'bg-blue-500', university: 'University of Toronto',
    program: 'DDS Program', progress: 68, stage: 'Interview', priority: 'Medium',
    appId: 'APP-2025-00202', intake: 'Fall 2026', campus: 'Toronto, Canada',
    appDate: 'April 10, 2025', deadline: 'July 1, 2025', source: 'Referral', referredBy: 'Dr. Lisa Park',
    graduation: 'Expected Graduation 2027', email: 'daniel.musa@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'PENDING'   },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.2 / 5.0', institution: 'University of Toronto', major: 'Software Engineering', yearOfStudy: '3rd Year', mcatScore: '510 (80th Percentile)' },
    progressStep: 3, currentStageDesc: 'Interview has been scheduled. Attendance and GPA require counselor attention.', estimatedUpdate: 'June 5, 2025',
    enrolledSince: 'September 2022', advisor: 'Dr. Sarah Johnson', coursesCompleted: 22, totalCourses: 40, sessionCount: 7,
  },
  {
    name: 'Fatima Bello', id: 'STU-2024-1003', dept: 'Cyber Security', level: '200 Level',
    gpa: 4.3, attendance: 88, status: 'Active', lastActivity: '30 mins ago', lastDate: 'May 22, 2025',
    initials: 'FB', color: 'bg-pink-500', university: 'Western University',
    program: 'MPH Program', progress: 88, stage: 'Essays', priority: 'Medium',
    appId: 'APP-2025-00303', intake: 'Winter 2026', campus: 'London, Canada',
    appDate: 'March 20, 2025', deadline: 'August 15, 2025', source: 'School Event', referredBy: 'Prof. Nia Osei',
    graduation: 'Expected Graduation 2027', email: 'fatima.bello@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'PENDING'   },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'PENDING'   },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '4.3 / 5.0', institution: 'Western University', major: 'Cyber Security', yearOfStudy: '2nd Year', mcatScore: 'N/A' },
    progressStep: 1, currentStageDesc: 'Essays are pending submission. Please complete them promptly.', estimatedUpdate: 'June 25, 2025',
    enrolledSince: 'September 2023', advisor: 'Dr. Sarah Johnson', coursesCompleted: 14, totalCourses: 40, sessionCount: 9,
  },
  {
    name: 'Ibrahim Ali', id: 'STU-2024-1004', dept: 'Data Science', level: '200 Level',
    gpa: 2.9, attendance: 61, status: 'Warning', lastActivity: 'Today', lastDate: 'May 22, 2025',
    initials: 'IA', color: 'bg-green-500', university: 'UBC',
    program: 'MD Program', progress: 61, stage: 'Secondary', priority: 'At Risk',
    appId: 'APP-2025-00404', intake: 'Fall 2026', campus: 'Vancouver, Canada',
    appDate: 'April 5, 2025', deadline: 'July 20, 2025', source: 'Direct', referredBy: 'Dr. Sarah Johnson',
    graduation: 'Expected Graduation 2026', email: 'ibrahim.ali@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'PENDING'   },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'PENDING'   },
    ],
    academic: { gpa: '2.9 / 5.0', institution: 'UBC', major: 'Data Science', yearOfStudy: '2nd Year', mcatScore: '506 (72nd Percentile)' },
    progressStep: 2, currentStageDesc: 'Secondary application under review. GPA and attendance flagged for counselor follow-up.', estimatedUpdate: 'June 12, 2025',
    enrolledSince: 'September 2023', advisor: 'Dr. Sarah Johnson', coursesCompleted: 12, totalCourses: 40, sessionCount: 4,
  },
  {
    name: 'Maryam Okafor', id: 'STU-2024-1005', dept: 'Information Systems', level: '300 Level',
    gpa: 3.8, attendance: 74, status: 'Active', lastActivity: '3 hrs ago', lastDate: 'May 22, 2025',
    initials: 'MO', color: 'bg-orange-400', university: 'Harvard University',
    program: 'MD Program', progress: 74, stage: 'Essays', priority: 'Low',
    appId: 'APP-2025-00505', intake: 'Fall 2026', campus: 'Cambridge, USA',
    appDate: 'March 15, 2025', deadline: 'September 1, 2025', source: 'Online', referredBy: 'Mr. James Brown',
    graduation: 'Expected Graduation 2027', email: 'maryam.okafor@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'PENDING'   },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '3.8 / 5.0', institution: 'Yale University', major: 'Information Systems', yearOfStudy: '3rd Year', mcatScore: '517 (96th Percentile)' },
    progressStep: 1, currentStageDesc: 'Application essays are being finalised before submission.', estimatedUpdate: 'July 10, 2025',
    enrolledSince: 'September 2022', advisor: 'Dr. Sarah Johnson', coursesCompleted: 24, totalCourses: 40, sessionCount: 11,
  },
  {
    name: 'Joshua Adeyemi', id: 'STU-2024-1006', dept: 'Artificial Intelligence', level: '400 Level',
    gpa: 4.6, attendance: 95, status: 'Excellent', lastActivity: '1 hr ago', lastDate: 'May 22, 2025',
    initials: 'JA', color: 'bg-teal-500', university: 'MCGill University',
    program: 'MD Program', progress: 95, stage: 'Decision', priority: 'At Risk',
    appId: 'APP-2025-00606', intake: 'Fall 2026', campus: 'Montreal, Canada',
    appDate: 'February 28, 2025', deadline: 'May 31, 2025', source: 'Website', referredBy: 'Dr. Kofi Mensah',
    graduation: 'Expected Graduation 2026', email: 'joshua.adeyemi@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '4.6 / 5.0', institution: 'McGill University', major: 'Artificial Intelligence', yearOfStudy: 'Final Year', mcatScore: '520 (99th Percentile)' },
    progressStep: 4, currentStageDesc: 'Final decision is imminent. Awaiting committee review outcome.', estimatedUpdate: 'May 28, 2025',
    enrolledSince: 'September 2021', advisor: 'Dr. Sarah Johnson', coursesCompleted: 36, totalCourses: 40, sessionCount: 18,
  },
  {
    name: 'Halima Sani', id: 'STU-2024-1007', dept: 'Computer Science', level: '100 Level',
    gpa: 2.3, attendance: 45, status: 'At Risk', lastActivity: '2 days ago', lastDate: 'May 20, 2025',
    initials: 'HS', color: 'bg-red-400', university: 'Western University',
    program: 'MD Program', progress: 45, stage: 'Essays', priority: 'Medium',
    appId: 'APP-2025-00707', intake: 'Winter 2026', campus: 'London, Canada',
    appDate: 'April 18, 2025', deadline: 'August 30, 2025', source: 'Referral', referredBy: 'Dr. Amara Singh',
    graduation: 'Expected Graduation 2028', email: 'halima.sani@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'PENDING'   },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'PENDING'   },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'PENDING'   },
    ],
    academic: { gpa: '2.3 / 5.0', institution: 'Western University', major: 'Computer Science', yearOfStudy: '1st Year', mcatScore: '501 (56th Percentile)' },
    progressStep: 1, currentStageDesc: 'Multiple essay components pending. Low attendance requires immediate counselor intervention.', estimatedUpdate: 'July 15, 2025',
    enrolledSince: 'September 2024', advisor: 'Dr. Sarah Johnson', coursesCompleted: 6, totalCourses: 40, sessionCount: 2,
  },
  {
    name: 'Samuel Johnson', id: 'STU-2024-1008', dept: 'Software Engineering', level: '400 Level',
    gpa: 4.1, attendance: 82, status: 'Active', lastActivity: '5 hrs ago', lastDate: 'May 22, 2025',
    initials: 'SJ', color: 'bg-purple-500', university: "Queen's University",
    program: 'MD Program', progress: 82, stage: 'Interview', priority: 'Low',
    appId: 'APP-2025-00808', intake: 'Fall 2026', campus: 'Kingston, Canada',
    appDate: 'March 25, 2025', deadline: 'June 30, 2025', source: 'Direct', referredBy: 'Prof. Daniel Lee',
    graduation: 'Expected Graduation 2026', email: 'samuel.johnson@email.com',
    checklist: [
      { label: 'Personal Statement',       status: 'SUBMITTED' },
      { label: 'Transcript',               status: 'SUBMITTED' },
      { label: 'Letter of Recommendation', status: 'SUBMITTED' },
      { label: 'Resume / CV',              status: 'SUBMITTED' },
      { label: 'Application Fee',          status: 'SUBMITTED' },
    ],
    academic: { gpa: '4.1 / 5.0', institution: "Queen's University", major: 'Software Engineering', yearOfStudy: 'Final Year', mcatScore: '513 (87th Percentile)' },
    progressStep: 3, currentStageDesc: 'Interview scheduled for next week. MMI preparation is underway.', estimatedUpdate: 'June 3, 2025',
    enrolledSince: 'September 2021', advisor: 'Dr. Sarah Johnson', coursesCompleted: 34, totalCourses: 40, sessionCount: 16,
  },
];

const TABS = [
  { label: 'All Students', count: 120 },
  { label: 'Active', count: 98 },
  { label: 'At Risk', count: 12 },
  { label: 'Top Performers', count: 15 },
  { label: 'Graduated', count: 10 },
];

const MEETINGS = [
  { name: 'Amina Yusuf',  date: 'May 22, 2025', time: '2:00 PM',  initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Daniel Musa',  date: 'May 22, 2025', time: '4:30 PM',  initials: 'DM', color: 'bg-blue-500' },
  { name: 'Fatima Bello', date: 'May 23, 2025', time: 'Tomorrow', initials: 'FB', color: 'bg-pink-500' },
];

function StatusBadge({ s }: { s: string }) {
  const m: Record<string, string> = {
    Excellent: 'text-emerald-600 dark:text-emerald-400',
    Active:    'text-blue-600 dark:text-blue-400',
    'At Risk': 'text-red-600 dark:text-red-400',
    Warning:   'text-amber-600 dark:text-amber-400',
  };
  return <span className={`text-xs font-bold ${m[s] ?? 'text-slate-500'}`}>{s}</span>;
}

function GpaBar({ gpa }: { gpa: number }) {
  const pct = (gpa / 5) * 100;
  const color = gpa >= 4 ? 'bg-emerald-500' : gpa >= 3 ? 'bg-blue-500' : gpa >= 2.5 ? 'bg-amber-500' : 'bg-red-500';
  const textColor = gpa >= 4 ? 'text-emerald-600 dark:text-emerald-400' : gpa >= 3 ? 'text-blue-600 dark:text-blue-400' : gpa >= 2.5 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';
  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm font-bold ${textColor}`}>{gpa.toFixed(1)}<span className="text-slate-400 dark:text-[#8e92ad] font-normal text-xs"> / 5.0</span></span>
      <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function StudentProfileTab({ s }: { s: StudentRecord }) {
  const statusColor = s.status === 'Excellent' ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : s.status === 'Active' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10' : s.status === 'At Risk' ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10' : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10';
  const attColor = s.attendance >= 80 ? 'bg-emerald-500' : s.attendance >= 60 ? 'bg-amber-500' : 'bg-red-500';
  const gpaColor = s.gpa >= 4 ? 'bg-emerald-500' : s.gpa >= 3 ? 'bg-blue-500' : s.gpa >= 2.5 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      <div className={`rounded-2xl px-5 py-4 flex items-center justify-between ${statusColor}`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">Student Status</p>
          <p className="text-lg font-bold">{s.status}</p>
        </div>
        <Activity size={28} className="opacity-30" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Academic Performance */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Academic Performance</p>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Student ID</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.id}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Department</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.dept}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Level / Year</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.level}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-2">GPA</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800 dark:text-white">{s.gpa.toFixed(1)} <span className="text-xs text-slate-400 font-normal">/ 5.0</span></span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${gpaColor}`} style={{ width: `${(s.gpa / 5) * 100}%` }} />
                </div>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-2">Attendance Rate</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800 dark:text-white">{s.attendance}%</span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${attColor}`} style={{ width: `${s.attendance}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollment & Engagement */}
        <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
          <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Enrollment & Engagement</p>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Enrolled Since</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.enrolledSince}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Advisor</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.advisor}</p>
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-2">Course Progress</p>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-slate-800 dark:text-white">{s.coursesCompleted}<span className="text-xs text-slate-400 font-normal"> / {s.totalCourses}</span></span>
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${(s.coursesCompleted / s.totalCourses) * 100}%` }} />
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Clock size={10} className="text-slate-400" />
                <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Counseling Sessions</p>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.sessionCount} sessions completed</p>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={10} className="text-slate-400" />
                <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Email</p>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: <Award size={16} />, label: 'GPA Score', value: `${s.gpa.toFixed(1)} / 5.0`, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
          { icon: <Activity size={16} />, label: 'Attendance', value: `${s.attendance}%`, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
          { icon: <BookOpen size={16} />, label: 'Courses Done', value: `${s.coursesCompleted} / ${s.totalCourses}`, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-50 dark:bg-cyan-500/10' },
        ].map((stat, i) => (
          <div key={i} className={`${stat.bg} rounded-2xl p-4 text-center`}>
            <div className={`${stat.color} flex justify-center mb-2`}>{stat.icon}</div>
            <p className="text-[9px] font-semibold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyStudentsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('All Students');
  const [page, setPage] = useState(1);
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Students</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Manage and monitor all assigned students, track performance and communication.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="space-y-4">
            {/* Tabs + Actions */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                {TABS.map(t => (
                  <button key={t.label} onClick={() => setActiveTab(t.label)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === t.label ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {t.label} <span className="opacity-70">{t.count}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search students..." className="h-9 pl-9 pr-4 text-sm bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400/50 transition-all" />
                </div>
                <button className="flex items-center gap-1.5 h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <Filter size={13} /> Filters
                </button>
                <button
                  onClick={() => router.push('/counselor/add-new-application')}
                  className="flex items-center gap-1.5 h-9 px-3.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors"
                >
                  <Plus size={14} /> Add Student
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      {['STUDENT','DEPARTMENT','GPA','ATTENDANCE','STATUS','LAST ACTIVITY','ACTION'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {STUDENTS.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">{s.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">ID: {s.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{s.dept}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.level}</p>
                        </td>
                        <td className="px-5 py-3.5"><GpaBar gpa={s.gpa} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{s.attendance}%</span>
                            <div className="w-12 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${s.attendance >= 80 ? 'bg-emerald-500' : s.attendance >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${s.attendance}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge s={s.status} /></td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{s.lastActivity}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.lastDate}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedStudent(s)}
                              className="p-1.5 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => router.push('/counselor/messages')}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                              <MessageSquare size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to 8 of 120 students</p>
                <div className="flex items-center gap-1">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"><ChevronLeft size={14} /></button>
                  {[1,2,3].map(n => <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${page === n ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{n}</button>)}
                  <span className="text-slate-400 text-xs">... 15</span>
                  <button onClick={() => setPage(p => p + 1)} className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Student Overview</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Students', value: 120, color: 'text-slate-800 dark:text-white',           bg: 'bg-slate-50 dark:bg-white/5',           icon: <Users size={13} className="text-slate-400" /> },
                  { label: 'Active Students', value: 98,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10',  icon: <UserCheck size={13} className="text-emerald-500" /> },
                  { label: 'At Risk',         value: 12,  color: 'text-red-600 dark:text-red-400',         bg: 'bg-red-50 dark:bg-red-500/10',           icon: <AlertTriangle size={13} className="text-red-500" /> },
                  { label: 'Graduated',       value: 10,  color: 'text-blue-600 dark:text-blue-400',       bg: 'bg-blue-50 dark:bg-blue-500/10',         icon: <GraduationCap size={13} className="text-blue-500" /> },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                    <div className="flex items-center justify-between mb-1">{s.icon}</div>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.label}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Message All Students', icon: <MessageSquare size={14} />, color: 'text-blue-600',    bg: 'bg-blue-50 dark:bg-blue-500/15',    route: '/counselor/message-student' },
                  { label: 'Upload Materials',     icon: <Upload size={14} />,        color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/15', route: '/counselor/upload-resources' },
                  { label: 'Schedule Session',     icon: <Calendar size={14} />,      color: 'text-purple-600',  bg: 'bg-purple-50 dark:bg-purple-500/15',  route: '/counselor/session-schedule' },
                  { label: 'Export Reports',       icon: <BarChart2 size={14} />,     color: 'text-amber-600',   bg: 'bg-amber-50 dark:bg-amber-500/15',    route: '/counselor/export-reports' },
                ].map(a => (
                  <button key={a.label} onClick={() => a.route && router.push(a.route)} className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg ${a.bg} ${a.color} flex items-center justify-center`}>{a.icon}</div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{a.label}</span>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 dark:text-[#40455e]" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Performance Overview</h3>
              <div className="flex items-center gap-4">
                <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-white/8" />
                  {[{p:29,c:'#10b981',o:0},{p:37,c:'#0284c7',o:29},{p:21,c:'#f59e0b',o:66},{p:13,c:'#ef4444',o:87}].map((s,i)=>{
                    const circ=2*Math.PI*30;
                    return <circle key={i} cx="40" cy="40" r="30" fill="none" stroke={s.c} strokeWidth="10" strokeDasharray={`${(s.p/100)*circ-1} ${circ}`} strokeDashoffset={-((s.o/100)*circ)+circ/4} />;
                  })}
                </svg>
                <div className="space-y-1.5 flex-1">
                  {[{l:'Excellent',p:35,c:'#10b981'},{l:'Average',p:45,c:'#0284c7'},{l:'At Risk',p:25,c:'#f59e0b'},{l:'Inactive',p:15,c:'#ef4444'}].map(r=>(
                    <div key={r.l} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{background:r.c}} />
                      <span className="text-[10px] text-slate-500 dark:text-[#8e92ad] flex-1">{r.l}</span>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-[#c8ccdf]">{r.p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="mt-3 text-xs font-semibold text-cyan-600 flex items-center gap-1">View Full Analytics <ChevronRight size={12} /></button>
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upcoming Meetings</h3>
              <div className="space-y-3">
                {MEETINGS.map((m, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center text-white text-[10px] font-bold`}>{m.initials}</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-white">{m.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{m.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold shrink-0 ${m.time === 'Tomorrow' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>{m.time}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => router.push('/counselor/view-calendar')} className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1">View All Meetings <ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      </div>

      {selectedStudent && (
        <ApplicationDetailsModal
          app={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          extraTab={{
            key: 'profile',
            label: 'Student Profile',
            content: <StudentProfileTab s={selectedStudent} />,
          }}
        />
      )}
    </div>
  );
}
