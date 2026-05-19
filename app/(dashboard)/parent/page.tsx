'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users, CalendarDays, MessageSquare, CreditCard,
  ChevronRight, TrendingUp, ArrowUpRight,
  Star, Clock, MapPin, Flame,
} from 'lucide-react';

// ── helpers ───────────────────────────────────────────────────────────────────
function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── data ──────────────────────────────────────────────────────────────────────
const CHILDREN = [
  {
    initials: 'AY', color: 'bg-amber-400', name: 'Amina Yusuf',
    grade: 'Grade 10', gpa: '3.78', attendance: '98%',
  },
  {
    initials: 'DM', color: 'bg-blue-500', name: 'Daniel Musa',
    grade: 'Grade 10', gpa: '3.42', attendance: '92%',
  },
];

const ACADEMY_SUBJECTS = [
  { label: 'English',     amina: '8.3/10', daniel: '8.3/10', aminaColor: 'text-emerald-600 dark:text-emerald-400', danielColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Mathematics', amina: '8.1/10', daniel: '7.2/10', aminaColor: 'text-emerald-600 dark:text-emerald-400', danielColor: 'text-amber-500 dark:text-amber-400' },
  { label: 'Science',     amina: '9.2/10', daniel: '8/10',   aminaColor: 'text-emerald-600 dark:text-emerald-400', danielColor: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'History',     amina: '8.6/10', daniel: '9.1/10', aminaColor: 'text-emerald-600 dark:text-emerald-400', danielColor: 'text-emerald-600 dark:text-emerald-400' },
];

const ACTIVITY = [
  { icon: '💬', label: 'Aisha Patel joined the session',   sub: 'Essay Review · Today, 4:02 PM',    dot: 'bg-blue-500' },
  { icon: '📝', label: 'You reviewed an essay for Ethan',  sub: 'Personal Statement · Today, 11:30 A', dot: 'bg-violet-500' },
  { icon: '📅', label: 'Sophie Martin booked a session',   sub: 'MMI Prep · Yesterday, 6:15 PM',    dot: 'bg-green-500' },
  { icon: '📤', label: 'New resource uploaded',            sub: 'MMI Preparation Guide.pdf · May 16', dot: 'bg-amber-500' },
];

const EVENTS = [
  { initials: 'AP', color: 'bg-amber-400', name: 'Aisha Patel',   venue: 'Down Town Science',  time: '2:00 PM – 4:00 PM' },
  { initials: 'EK', color: 'bg-emerald-500', name: 'Ethan Kim',   venue: 'Main Campus',         time: '2:00 PM – 4:00 PM' },
  { initials: 'SM', color: 'bg-pink-500',   name: 'Sophie Martin', venue: 'Auditorium',          time: '2:00 PM – 4:00 PM' },
];

const MESSAGES = [
  {
    initials: 'AM', color: 'bg-amber-400', name: 'Amina Yusuf',
    tag: 'Essay Review Feedback', preview: 'Thank you for the detailed feedback...', time: '10:30 AM', unread: 2,
  },
  {
    initials: 'DM', color: 'bg-blue-500', name: 'Daniel Musa',
    tag: 'MMI Practice Session', preview: "Can we reschedule tomorrow's...", time: '9:15 AM', unread: 1,
  },
  {
    initials: 'FB', color: 'bg-pink-500', name: 'Fatima Bello',
    tag: 'SAT Preparation Resources', preview: 'Please share the reading materials...', time: 'Yesterday', starred: true,
  },
];

// Simple sparkline path helper
const ATTENDANCE_POINTS = [30, 48, 35, 60, 55, 72, 65, 80, 74, 88, 82, 92, 85, 95];
function polyline(pts: number[], w = 320, h = 80) {
  const max = 100; const min = 0;
  return pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  }).join(' ');
}

// ── components ────────────────────────────────────────────────────────────────
function StatCard({
  icon, label, value, sub, subColor, href,
}: {
  icon: React.ReactNode; label: string; value: string; sub: string; subColor?: string; href: string;
}) {
  return (
    <Link href={href} className="group bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 flex flex-col gap-2 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className={`text-[11px] font-semibold ${subColor ?? 'text-violet-600 dark:text-violet-400'} group-hover:underline`}>{sub}</p>
    </Link>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────
export default function ParentPage() {
  const [greet, setGreet] = useState('Good morning');
  useEffect(() => { setGreet(greeting()); }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              {greet}, Priya 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">
              Here's what's happening with your child today.
            </p>
          </div>
          <Link
            href="/parent/schedule"
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-violet-200 dark:shadow-violet-900/20 transition-all shrink-0"
          >
            <CalendarDays size={15} /> View Calendar
          </Link>
        </div>

        {/* ── Stat cards ─────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            icon={<div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center"><Users size={16} className="text-blue-500" /></div>}
            label="My Children" value="2" sub="View All Children" subColor="text-blue-600 dark:text-blue-400" href="/parent/my-children"
          />
          <StatCard
            icon={<div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center"><CalendarDays size={16} className="text-emerald-500" /></div>}
            label="Upcoming Events" value="3" sub="View All Calendar" subColor="text-emerald-600 dark:text-emerald-400" href="/parent/schedule"
          />
          <StatCard
            icon={<div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center"><MessageSquare size={16} className="text-violet-500" /></div>}
            label="Unread Messages" value="42" sub="View Messages" subColor="text-violet-600 dark:text-violet-400" href="/parent/messages"
          />
          <StatCard
            icon={<div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center"><CreditCard size={16} className="text-amber-500" /></div>}
            label="Total Due" value="$120.00" sub="View Payments" subColor="text-amber-600 dark:text-amber-400" href="/parent/payment"
          />
        </div>

        {/* ── Three-column main area ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-4 sm:gap-5 items-start">

          {/* ── Col 1: My Children + Recent Activity ── */}
          <div className="space-y-4">

            {/* My Children */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">My Children</h3>
              <div className="space-y-3">
                {CHILDREN.map((c, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/4 hover:bg-violet-50 dark:hover:bg-violet-500/8 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-full ${c.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{c.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{c.grade}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wide">GPA</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{c.gpa}</p>
                      <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{c.attendance}</p>
                    </div>
                    <ChevronRight size={14} className="text-slate-300 dark:text-white/20 group-hover:text-violet-500 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
              <Link href="/parent/my-children" className="mt-3 flex items-center justify-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline py-2">
                View All Children
              </Link>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Activity</h3>
                <button className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.dot}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-snug">{a.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{a.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 2: Academy Progress + Attendance ── */}
          <div className="space-y-4">

            {/* Academy Progress */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Academy Progress</h3>
                <Link href="/parent/academic-progress" className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1">
                  View Full Report Card <ArrowUpRight size={11} />
                </Link>
              </div>
              <div className="overflow-x-auto -mx-1">
                <table className="w-full min-w-[300px]">
                  <thead>
                    <tr>
                      <th className="text-left pb-2 text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider w-1/3">Subjects</th>
                      <th className="pb-2 text-center text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider w-1/3">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center text-[7px] font-bold text-white">AY</div>
                          <span>Amina Yusuf (10)</span>
                        </div>
                      </th>
                      <th className="pb-2 text-center text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider w-1/3">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[7px] font-bold text-white">DM</div>
                          <span>Jafar Yusuf (7th)</span>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/4">
                    {ACADEMY_SUBJECTS.map((s, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300">{s.label}</td>
                        <td className={`py-2.5 text-center text-xs font-bold ${s.aminaColor}`}>{s.amina}</td>
                        <td className={`py-2.5 text-center text-xs font-bold ${s.danielColor}`}>{s.daniel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Attendance Overview */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Attendance Overview</h3>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/6">
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">This Week</span>
                  <ChevronRight size={11} className="text-slate-400 rotate-90" />
                </div>
              </div>

              {/* Y-axis + chart */}
              <div className="flex gap-2">
                <div className="flex flex-col justify-between text-[9px] text-slate-400 dark:text-[#8e92ad] py-1 shrink-0" style={{ height: 80 }}>
                  {['100%','75%','50%','25%','0%'].map(l => <span key={l}>{l}</span>)}
                </div>
                <div className="flex-1 relative" style={{ height: 80 }}>
                  <svg width="100%" height="80" viewBox="0 0 320 80" preserveAspectRatio="none" className="absolute inset-0">
                    {/* Grid lines */}
                    {[0,20,40,60,80].map(y => (
                      <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="currentColor" strokeWidth="0.5" className="text-gray-100 dark:text-white/5" />
                    ))}
                    {/* Area fill */}
                    <defs>
                      <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points={`0,80 ${polyline(ATTENDANCE_POINTS)} 320,80`}
                      fill="url(#attGrad)"
                    />
                    <polyline
                      points={polyline(ATTENDANCE_POINTS)}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* X-axis labels */}
              <div className="flex justify-between mt-2 px-6 text-[9px] text-slate-400 dark:text-[#8e92ad]">
                {['Mon','Tue','Wed','Thurs','Fri','Sat'].map(d => <span key={d}>{d}</span>)}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
                {CHILDREN.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full ${c.color} flex items-center justify-center text-[8px] font-bold text-white`}>{c.initials}</div>
                    <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">{c.name}</span>
                    <span className={`text-[10px] font-bold ${i === 0 ? 'text-amber-500' : 'text-blue-500'}`}>{i === 0 ? '10th' : '7th'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Col 3: Upcoming Events + Messaging ── */}
          <div className="space-y-4">

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {EVENTS.map((e, i) => (
                  <div key={i} className="flex items-start gap-3 group cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-2 px-2 py-2 rounded-xl transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{e.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Clock size={9} className="text-slate-400 shrink-0" />
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{e.time}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={9} className="text-slate-400 shrink-0" />
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{e.venue}</p>
                      </div>
                    </div>
                    <ChevronRight size={13} className="text-slate-300 dark:text-white/20 group-hover:text-violet-500 transition-colors mt-1 shrink-0" />
                  </div>
                ))}
              </div>
              <Link href="/parent/schedule" className="mt-2 flex items-center justify-center text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline pt-3 border-t border-gray-50 dark:border-white/5">
                View Full Calendar
              </Link>
            </div>

            {/* Messaging */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Messaging</h3>
                <button className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {MESSAGES.map((m, i) => (
                  <div key={i} className="flex items-start gap-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-2 px-2 py-1.5 rounded-xl transition-colors">
                    <div className={`w-9 h-9 rounded-xl ${m.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{m.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{m.name}</p>
                        <span className="text-[10px] text-slate-400 dark:text-[#8e92ad] shrink-0">{m.time}</span>
                      </div>
                      <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad] truncate">{m.tag}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{m.preview}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {m.unread && (
                        <span className="w-4 h-4 rounded-full bg-violet-600 flex items-center justify-center text-[9px] font-bold text-white">{m.unread}</span>
                      )}
                      {m.starred && <Star size={11} className="text-amber-400" fill="currentColor" />}
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
