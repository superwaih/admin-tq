'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Plus, Eye, MessageSquare, ChevronRight, ChevronLeft, Star, Users, AlertCircle, Activity, CheckCircle } from 'lucide-react';

const STUDENTS = [
  { name: 'Amina Yusuf',    id: 'STU-2024-1001', initials: 'AY', color: 'bg-yellow-400', progress: 82, stations: 8,  total: 10, score: 8.4, quality: 'Good',        lastPractice: 'May 22, 2025', lastAgo: '2 days ago', status: 'In Progress' },
  { name: 'Daniel Musa',    id: 'STU-2024-1002', initials: 'DM', color: 'bg-blue-500',   progress: 65, stations: 6,  total: 10, score: 7.2, quality: 'Fair',        lastPractice: 'May 20, 2025', lastAgo: '4 days ago', status: 'Needs Practice' },
  { name: 'Fatima Bello',   id: 'STU-2024-1003', initials: 'FB', color: 'bg-pink-500',   progress: 90, stations: 9,  total: 10, score: 8.9, quality: 'Excellent',   lastPractice: 'May 21, 2025', lastAgo: '3 days ago', status: 'In Progress' },
  { name: 'Ibrahim Ali',    id: 'STU-2024-1004', initials: 'IA', color: 'bg-green-500',  progress: 45, stations: 4,  total: 10, score: 6.1, quality: 'Needs Work',  lastPractice: 'May 18, 2025', lastAgo: '6 days ago', status: 'Needs Practice' },
  { name: 'Maryam Okafor',  id: 'STU-2024-1005', initials: 'MO', color: 'bg-orange-400', progress: 95, stations: 10, total: 10, score: 9.3, quality: 'Excellent',   lastPractice: 'May 22, 2025', lastAgo: '2 days ago', status: 'Completed' },
  { name: 'Joshua Adeyemi', id: 'STU-2024-1006', initials: 'JA', color: 'bg-teal-500',   progress: 75, stations: 7,  total: 10, score: 7.8, quality: 'Good',        lastPractice: 'May 19, 2025', lastAgo: '5 days ago', status: 'In Progress' },
  { name: 'Halima Sani',    id: 'STU-2024-1007', initials: 'HS', color: 'bg-red-400',    progress: 55, stations: 5,  total: 10, score: 6.5, quality: 'Fair',        lastPractice: 'May 17, 2025', lastAgo: '7 days ago', status: 'Needs Practice' },
];

const UPCOMING_SESSIONS = [
  { name: 'Amina Yusuf',    initials: 'AY', color: 'bg-yellow-400', time: 'Today, 2:00 PM',     status: 'In Progress',     statusCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Daniel Musa',    initials: 'DM', color: 'bg-blue-500',   time: 'Today, 3:30 PM',     status: 'Needs Practice',  statusCls: 'text-amber-600 dark:text-amber-400' },
  { name: 'Fatima Bello',   initials: 'FB', color: 'bg-pink-500',   time: 'Tomorrow, 9:00 AM',  status: 'In Progress',     statusCls: 'text-blue-600 dark:text-blue-400' },
  { name: 'Ibrahim Ali',    initials: 'IA', color: 'bg-green-500',  time: 'Tomorrow, 11:30 AM', status: 'Needs Practice',  statusCls: 'text-amber-600 dark:text-amber-400' },
  { name: 'Maryam Okafor',  initials: 'MO', color: 'bg-orange-400', time: 'May 24, 10:00 AM',   status: 'Completed',       statusCls: 'text-emerald-600 dark:text-emerald-400' },
];

const TOP_STUDENTS = [
  { name: 'Maryam Okafor',  score: 9.3, initials: 'MO', color: 'bg-orange-400' },
  { name: 'Fatima Bello',   score: 8.9, initials: 'FB', color: 'bg-pink-500' },
  { name: 'Samuel Johnson', score: 8.6, initials: 'SJ', color: 'bg-purple-500' },
  { name: 'Amina Yusuf',    score: 8.4, initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Joshua Adeyemi', score: 7.8, initials: 'JA', color: 'bg-teal-500' },
];

const OVERVIEW_TABS = ['All Students','Needs Practice','In Progress','Completed','Top Performers'];

function StatusBadge({ s }: { s: string }) {
  const m: Record<string, string> = {
    'In Progress':     'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400',
    'Needs Practice':  'bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400',
    'Completed':       'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
    'Not Assigned':    'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${m[s] ?? ''}`}>{s}</span>;
}

export default function MMICoachingPage() {
  const [activeTab, setActiveTab] = useState('All Students');
  const [page, setPage] = useState(1);
  const counts = { 'All Students': 120, 'Needs Practice': 24, 'In Progress': 36, 'Completed': 40, 'Top Performers': 20 };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">MMI Coaching</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Prepare students for Multi-Mini Interviews with practice stations and personalized feedback.</p>
          </div>
          <Link href="/counselor/assign-practice" className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Plus size={15} /> Assign Practice
          </Link>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Students', value: '120', sub: 'All enrolled students', color: 'text-slate-800 dark:text-white',             bg: 'bg-white dark:bg-[#161a27]', icon: <Users size={15} className="text-slate-400" /> },
            { label: 'Needs Practice', value: '24',  sub: 'Require more sessions', color: 'text-amber-600 dark:text-amber-400',         bg: 'bg-white dark:bg-[#161a27]', icon: <AlertCircle size={15} className="text-amber-400" /> },
            { label: 'In Progress',    value: '36',  sub: 'Currently practicing',  color: 'text-blue-600 dark:text-blue-400',           bg: 'bg-white dark:bg-[#161a27]', icon: <Activity size={15} className="text-blue-400" /> },
            { label: 'Top Performers', value: '20',  sub: 'Score ≥ 85%',           color: 'text-emerald-600 dark:text-emerald-400',     bg: 'bg-white dark:bg-[#161a27]', icon: <CheckCircle size={15} className="text-emerald-400" /> },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4`}>
              <div className="flex items-center justify-between mb-1">{s.icon}</div>
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-wider">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Students</h2>
            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                {OVERVIEW_TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {tab} <span className="opacity-70 text-[10px]">{counts[tab as keyof typeof counts]}</span>
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
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      {['STUDENT','OVERALL PROGRESS','STATIONS COMPLETED','AVERAGE SCORE','LAST PRACTICE','STATUS','ACTION'].map(h => (
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
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{s.progress}%</span>
                            <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${s.progress >= 80 ? 'bg-emerald-500' : s.progress >= 60 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${s.progress}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5"><span className="text-xs text-slate-600 dark:text-[#c8ccdf]">{s.stations} / {s.total}</span></td>
                        <td className="px-5 py-3.5">
                          <span className={`text-sm font-bold ${s.score >= 8.5 ? 'text-emerald-600 dark:text-emerald-400' : s.score >= 7 ? 'text-blue-600 dark:text-blue-400' : 'text-red-500'}`}>{s.score.toFixed(1)}/10</span>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.quality}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{s.lastPractice}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.lastAgo}</p>
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge s={s.status} /></td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Eye size={14} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><MessageSquare size={14} /></button>
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
            {/* MMI Overview donut */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">MMI Overview</h3>
              <div className="flex items-center gap-4">
                <svg width="80" height="80" viewBox="0 0 80 80" className="shrink-0">
                  <circle cx="40" cy="40" r="30" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-white/8" />
                  {[{p:33,c:'#10b981',o:0},{p:30,c:'#0284c7',o:33},{p:20,c:'#f59e0b',o:63},{p:13,c:'#94a3b8',o:83},{p:4,c:'#ef4444',o:96}].map((s,i)=>{
                    const circ=2*Math.PI*30;
                    return <circle key={i} cx="40" cy="40" r="30" fill="none" stroke={s.c} strokeWidth="10" strokeDasharray={`${(s.p/100)*circ-1} ${circ}`} strokeDashoffset={-((s.o/100)*circ)+circ/4} />;
                  })}
                </svg>
                <div className="space-y-1.5 flex-1">
                  {[{l:'Completed',p:'40 (33%)',c:'#10b981'},{l:'In Progress',p:'36 (30%)',c:'#0284c7'},{l:'Needs Practice',p:'24 (20%)',c:'#f59e0b'},{l:'Not Started',p:'16 (13%)',c:'#94a3b8'},{l:'Not Assigned',p:'4 (3%)',c:'#ef4444'}].map(r=>(
                    <div key={r.l} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{background:r.c}} />
                      <span className="text-[10px] text-slate-500 dark:text-[#8e92ad] flex-1 truncate">{r.l}</span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-[#c8ccdf] shrink-0">{r.p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <Link href="/counselor/mmi-coaching-analytics" className="mt-3 text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View Full Analytics <ChevronRight size={12} /></Link>
            </div>

            {/* Upcoming Practice Sessions */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Upcoming Practice</h3>
                <Link href="/counselor/view-calendar" className="text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View All <ChevronRight size={12} /></Link>
              </div>
              <div className="space-y-3">
                {UPCOMING_SESSIONS.map((s, i) => (
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

            {/* Top Performing Students */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performing</h3>
                <Link href="/counselor/essay-ranking" className="text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View All <ChevronRight size={12} /></Link>
              </div>
              <div className="space-y-3">
                {TOP_STUDENTS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white flex-1 truncate">{s.name}</p>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-[#c8ccdf]">{s.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/counselor/essay-ranking" className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View All Rankings <ChevronRight size={12} /></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
