'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, TrendingUp, UserCheck,
  ClipboardList, MessageSquare, MoreHorizontal, Search,
  Star, Phone, Mail, MapPin, GraduationCap,
} from 'lucide-react';

// ── data ──────────────────────────────────────────────────────────────────────
const CHILDREN = [
  {
    initials: 'AY', color: 'bg-amber-400', name: 'Amina Yusuf',
    grade: 'Grade 10', school: 'Ridgemont High School',
    gpa: '3.78', gpaDenominator: '4.0', attendance: '98%', assignments: '24/26',
    status: 'Excellent', statusColor: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
    phone: '+1 (555) 234-5678', email: 'amina@student.com',
    subjects: [
      { name: 'English',     score: 83, grade: 'A',  color: 'bg-emerald-500' },
      { name: 'Mathematics', score: 81, grade: 'A',  color: 'bg-emerald-500' },
      { name: 'Science',     score: 92, grade: 'A+', color: 'bg-emerald-500' },
      { name: 'History',     score: 86, grade: 'A',  color: 'bg-emerald-500' },
      { name: 'French',      score: 74, grade: 'B+', color: 'bg-amber-400' },
    ],
    recentActivity: [
      { text: 'Submitted English essay', time: 'Today, 9:00 AM', dot: 'bg-blue-500' },
      { text: 'Math test result: 81%',  time: 'Yesterday',        dot: 'bg-emerald-500' },
      { text: 'Attended Science class', time: '2 days ago',        dot: 'bg-violet-500' },
    ],
  },
  {
    initials: 'DM', color: 'bg-blue-500', name: 'Daniel Musa',
    grade: 'Grade 10', school: 'Ridgemont High School',
    gpa: '3.42', gpaDenominator: '4.0', attendance: '92%', assignments: '21/26',
    status: 'Good', statusColor: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400',
    phone: '+1 (555) 345-6789', email: 'daniel@student.com',
    subjects: [
      { name: 'English',     score: 83, grade: 'A',  color: 'bg-emerald-500' },
      { name: 'Mathematics', score: 72, grade: 'B+', color: 'bg-amber-400' },
      { name: 'Science',     score: 80, grade: 'A',  color: 'bg-emerald-500' },
      { name: 'History',     score: 91, grade: 'A+', color: 'bg-emerald-500' },
      { name: 'French',      score: 68, grade: 'B',  color: 'bg-amber-400' },
    ],
    recentActivity: [
      { text: 'Missed History class',     time: 'Today, 10:00 AM', dot: 'bg-red-500' },
      { text: 'Science project submitted',time: 'Yesterday',        dot: 'bg-emerald-500' },
      { text: 'French quiz: 68%',         time: '3 days ago',        dot: 'bg-amber-500' },
    ],
  },
];

const SUMMARY_CARDS = [
  { label: 'Total Children', value: '2', icon: '👨‍👩‍👧', bg: 'bg-violet-50 dark:bg-violet-500/15', color: 'text-violet-600 dark:text-violet-400' },
  { label: 'Avg. GPA',       value: '3.60', icon: '📚', bg: 'bg-blue-50 dark:bg-blue-500/15',   color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Avg. Attendance',value: '95%',  icon: '✅', bg: 'bg-emerald-50 dark:bg-emerald-500/15', color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Pending Tasks',  value: '5',   icon: '📋', bg: 'bg-amber-50 dark:bg-amber-500/15',  color: 'text-amber-600 dark:text-amber-400' },
];

// ── component ─────────────────────────────────────────────────────────────────
export default function MyChildrenPage() {
  const [activeChild, setActiveChild] = useState(0);
  const child = CHILDREN[activeChild];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div>
          <Link
            href="/parent"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-violet-600 dark:hover:text-violet-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">My Children</h1>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {SUMMARY_CARDS.map((c, i) => (
            <div key={i} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center text-xl shrink-0`}>
                {c.icon}
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{c.label}</p>
                <p className={`text-2xl font-bold mt-0.5 ${c.color}`}>{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Child selector tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          {CHILDREN.map((c, i) => (
            <button
              key={i}
              onClick={() => setActiveChild(i)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                activeChild === i
                  ? 'bg-violet-600 border-violet-600 text-white shadow-sm shadow-violet-200 dark:shadow-violet-900/20'
                  : 'bg-white dark:bg-[#161a27] border-gray-100 dark:border-white/8 text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-500/30'
              }`}
            >
              <div className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center text-white text-[9px] font-bold`}>
                {c.initials}
              </div>
              {c.name}
            </button>
          ))}
        </div>

        {/* Two-column detail */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5">

          {/* Left: main profile + grades */}
          <div className="space-y-4">

            {/* Profile card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <div className={`w-20 h-20 rounded-2xl ${child.color} flex items-center justify-center text-white text-2xl font-bold shrink-0 self-center sm:self-auto`}>
                  {child.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{child.name}</h2>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${child.statusColor}`}>{child.status}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-[#8e92ad]">{child.grade} · {child.school}</p>
                  <div className="flex flex-wrap gap-4 mt-3">
                    {[
                      { label: 'GPA', value: `${child.gpa} / ${child.gpaDenominator}` },
                      { label: 'Attendance', value: child.attendance },
                      { label: 'Assignments', value: child.assignments },
                    ].map((s, i) => (
                      <div key={i}>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{s.label}</p>
                        <p className="text-base font-bold text-slate-800 dark:text-white mt-0.5">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 self-start sm:self-auto">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-all">
                    <MessageSquare size={12} /> Message
                  </button>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                    <MoreHorizontal size={12} /> More
                  </button>
                </div>
              </div>
            </div>

            {/* Subject Grades */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Subject Grades</h3>
                <Link href="/parent/grades" className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">Full Report</Link>
              </div>
              <div className="space-y-4">
                {child.subjects.map((s, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{s.score}%</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          s.grade.startsWith('A') ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400'
                        }`}>{s.grade}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${s.color} transition-all duration-500`}
                        style={{ width: `${s.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick action links */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Academic Progress', icon: <TrendingUp size={16} className="text-violet-500" />, bg: 'bg-violet-50 dark:bg-violet-500/15', href: '/parent/academic-progress' },
                { label: 'Attendance',         icon: <UserCheck size={16} className="text-emerald-500" />, bg: 'bg-emerald-50 dark:bg-emerald-500/15', href: '/parent/attendance' },
                { label: 'Assignments',        icon: <ClipboardList size={16} className="text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-500/15', href: '/parent/assignments' },
                { label: 'Messages',           icon: <MessageSquare size={16} className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-500/15', href: '/parent/messages' },
              ].map((a, i) => (
                <Link
                  key={i}
                  href={a.href}
                  className="group bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 flex flex-col items-center gap-2 text-center hover:border-violet-200 dark:hover:border-violet-500/30 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl ${a.bg} flex items-center justify-center`}>{a.icon}</div>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-tight">{a.label}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Contact Info */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Phone size={13} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Phone</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{child.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <Mail size={13} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Email</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{child.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin size={13} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">School</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{child.school}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <GraduationCap size={13} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Grade</p>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{child.grade}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                <button className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">View All</button>
              </div>
              <div className="space-y-3.5">
                {child.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                    <div>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{a.text}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upcoming Events</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Parent–Teacher Meeting', date: 'May 20', time: '4:00 PM', color: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300' },
                  { label: 'Science Fair',            date: 'May 24', time: '10:00 AM', color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
                  { label: 'Report Card Day',         date: 'Jun 01', time: 'All Day',  color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
                ].map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`text-center px-2 py-1.5 rounded-lg ${e.color} shrink-0`}>
                      <p className="text-[9px] font-bold uppercase leading-none">{e.date}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">{e.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
