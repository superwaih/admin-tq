'use client';

import { useState } from 'react';
import { Search, Filter, Plus, Eye, MessageSquare, Download, ChevronRight, ChevronLeft, Star } from 'lucide-react';

const ESSAYS = [
  { name: 'Amina Yusuf',    id: 'STU-2024-1001', initials: 'AY', color: 'bg-yellow-400', topic: 'Why I Want to Study Medicine', words: 650, date: 'May 20, 2025', time: '2:30 PM', status: 'Pending',   score: null,  quality: '' },
  { name: 'Daniel Musa',    id: 'STU-2024-1002', initials: 'DM', color: 'bg-blue-500',   topic: 'My Leadership Journey',        words: 720, date: 'May 21, 2025', time: '9:15 AM', status: 'In Review', score: null,  quality: '' },
  { name: 'Fatima Bello',   id: 'STU-2024-1003', initials: 'FB', color: 'bg-pink-500',   topic: 'Overcoming Challenges',        words: 540, date: 'May 21, 2025', time: '11:45 AM', status: 'Reviewed', score: 8.5,  quality: 'Great' },
  { name: 'Ibrahim Ali',    id: 'STU-2024-1004', initials: 'IA', color: 'bg-green-500',  topic: 'The Future of Artificial Int.', words: 680, date: 'May 20, 2025', time: '4:20 PM', status: 'In Review', score: null,  quality: '' },
  { name: 'Maryam Okafor',  id: 'STU-2024-1005', initials: 'MO', color: 'bg-orange-400', topic: 'Community Impact Initiative',  words: 610, date: 'May 19, 2025', time: '7:30 PM', status: 'Reviewed', score: 9.2,  quality: 'Excellent' },
  { name: 'Joshua Adeyemi', id: 'STU-2024-1006', initials: 'JA', color: 'bg-teal-500',   topic: 'Lessons From Failure',         words: 560, date: 'May 18, 2025', time: '3:10 PM', status: 'Reviewed', score: 7.8,  quality: 'Good' },
  { name: 'Halima Sani',    id: 'STU-2024-1007', initials: 'HS', color: 'bg-red-400',    topic: 'My Vision for Global Health',  words: 630, date: 'May 18, 2025', time: '12:40 PM', status: 'Pending', score: null,  quality: '' },
  { name: 'Samuel Johnson', id: 'STU-2024-1008', initials: 'SJ', color: 'bg-purple-500', topic: 'Innovation in Healthcare',     words: 700, date: 'May 17, 2025', time: '10:00 AM', status: 'In Review', score: null, quality: '' },
];

const RECENT_FEEDBACK = [
  { name: 'Fatima Bello', topic: 'Overcoming Challenges', comment: 'Excellent storytelling and structure...', time: '2 hrs ago', initials: 'FB', color: 'bg-pink-500' },
  { name: 'Amina Yusuf',  topic: 'Why I Want to Study Medicine', comment: 'Strong motivation and clear goals...', time: '5 hrs ago', initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Daniel Musa',  topic: 'My Leadership Journey', comment: 'Great examples of leadership...', time: '1 day ago', initials: 'DM', color: 'bg-blue-500' },
];

const TOP_ESSAYS = [
  { name: 'Maryam Okafor',  topic: 'Community Impact Initiative', score: 9.2, initials: 'MO', color: 'bg-orange-400' },
  { name: 'Amina Yusuf',    topic: 'Why I Want to Study Medicine', score: 9.0, initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Samuel Johnson', topic: 'Innovation in Healthcare',     score: 8.9, initials: 'SJ', color: 'bg-purple-500' },
  { name: 'Fatima Bello',   topic: 'Overcoming Challenges',        score: 8.5, initials: 'FB', color: 'bg-pink-500' },
  { name: 'Daniel Musa',    topic: 'My Leadership Journey',        score: 8.3, initials: 'DM', color: 'bg-blue-500' },
];

function StatusBadge({ s }: { s: string }) {
  const m: Record<string, string> = {
    Pending:    'bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400',
    'In Review':'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400',
    Reviewed:   'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
    Submitted:  'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m[s] ?? ''}`}>{s}</span>;
}

const TABS = ['All Essays','Pending Review','In Progress','Reviewed','Submitted'];

export default function EssayReviewsPage() {
  const [activeTab, setActiveTab] = useState('All Essays');
  const [page, setPage] = useState(1);

  const filtered = ESSAYS.filter(e =>
    activeTab === 'All Essays' ? true :
    activeTab === 'Pending Review' ? e.status === 'Pending' :
    activeTab === 'In Progress' ? e.status === 'In Review' :
    activeTab === 'Reviewed' ? e.status === 'Reviewed' :
    e.status === 'Submitted'
  );

  const counts = { 'All Essays': 120, 'Pending Review': 24, 'In Progress': 18, 'Reviewed': 62, 'Submitted': 16 };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Essay Reviews</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Review, manage, and provide feedback on student admission essays.</p>
          </div>
          <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Plus size={15} /> New Review
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="space-y-4">
            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {tab} <span className="opacity-70 text-[10px]">{counts[tab as keyof typeof counts]}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search essays..." className="h-9 pl-9 pr-4 text-sm bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400/50 transition-all" />
                </div>
                <button className="flex items-center gap-1.5 h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <Filter size={13} /> Filters
                </button>
                <button className="h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Sort: Newest
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      {['STUDENT','ESSAY TOPIC','WORD COUNT','SUBMISSION DATE','STATUS','REVIEW SCORE','ACTION'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {filtered.map((e, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">{e.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">ID: {e.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[140px]">
                          <p className="text-xs text-slate-700 dark:text-[#c8ccdf] truncate">{e.topic}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{e.words} Words</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{e.date}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.time}</p>
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge s={e.status} /></td>
                        <td className="px-5 py-3.5">
                          {e.score ? (
                            <div>
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{e.score}/10</span>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.quality}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-[#40455e]">Not reviewed</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Eye size={14} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><MessageSquare size={14} /></button>
                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Download size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to 8 of 120 essays</p>
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
            {/* Review Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Review Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Essays', value: 120, color: 'text-slate-800 dark:text-white', bg: 'bg-slate-50 dark:bg-white/5' },
                  { label: 'Pending',      value: 24,  color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                  { label: 'Reviewed',     value: 62,  color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  { label: 'Avg Score',    value: '8.6/10', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.label}</p>
                    <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Feedback</h3>
                <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1">View All <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-3">
                {RECENT_FEEDBACK.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{f.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">{f.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8e92ad] font-medium">{f.topic}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-0.5 truncate">{f.comment}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-[#40455e] shrink-0">{f.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Essays */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performing Essays</h3>
                <button className="text-xs font-semibold text-cyan-600 flex items-center gap-1">View All <ChevronRight size={12} /></button>
              </div>
              <div className="space-y-3">
                {TOP_ESSAYS.map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-lg ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{e.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{e.topic}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-[#c8ccdf]">{e.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1">View All Rankings <ChevronRight size={12} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
