'use client';

import { useState } from 'react';
import { Search, Plus, Eye, MoreHorizontal, Settings, ChevronDown, BookOpen, FileText, Video, Link2, Share2, ArrowUpRight, FileIcon, Clapperboard, ExternalLink, ClipboardList, GraduationCap } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Categories', count: 156 },
  { label: 'Admissions',     count: 28 },
  { label: 'Test Preparation', count: 24 },
  { label: 'Essays',         count: 18 },
  { label: 'Interviews',     count: 16 },
  { label: 'Financial Aid',  count: 14 },
  { label: 'Career Guidance', count: 12 },
  { label: 'Wellness',       count: 8 },
  { label: 'Other',          count: 36 },
];

const RESOURCES = [
  { title: 'Common App Essay Guide',   desc: 'Comprehensive guide to writing a compelling Common App personal statement.', category: 'Essays',          type: 'PDF',   author: { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-cyan-500' },    date: 'May 28, 2025', time: '2:30 PM',  typeColor: 'bg-red-50 dark:bg-red-500/12 text-red-600 dark:text-red-400',       catColor: 'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400',           Icon: FileText },
  { title: 'Interview Preparation Tips', desc: 'Video series covering common interview questions and best practices.',  category: 'Interviews',     type: 'Video', author: { name: 'James Wilson',       initials: 'JW', color: 'bg-green-500' },  date: 'May 27, 2025', time: '11:15 AM', typeColor: 'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400', catColor: 'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400', Icon: Video },
  { title: 'FAFSA Official Website',   desc: 'Official link to the FAFSA application portal for financial aid.',        category: 'Financial Aid',  type: 'Link',  author: { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-cyan-500' },    date: 'May 25, 2025', time: '4:45 PM',  typeColor: 'bg-cyan-50 dark:bg-cyan-500/12 text-cyan-600 dark:text-cyan-400',       catColor: 'bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400',       Icon: Link2 },
  { title: 'SAT Preparation Checklist', desc: 'Step-by-step checklist to help students prepare for the SAT exam.',    category: 'Test Preparation', type: 'PDF', author: { name: 'Michael Brown',      initials: 'MB', color: 'bg-orange-400' }, date: 'May 24, 2025', time: '9:20 AM',  typeColor: 'bg-red-50 dark:bg-red-500/12 text-red-600 dark:text-red-400',       catColor: 'bg-violet-50 dark:bg-violet-500/12 text-violet-600 dark:text-violet-400',   Icon: ClipboardList },
  { title: 'Choosing the Right Major', desc: 'Webinar on selecting a major aligned with your interests and career goals.', category: 'Career Guidance', type: 'Video', author: { name: 'Emily Davis', initials: 'ED', color: 'bg-pink-500' },  date: 'May 22, 2025', time: '3:10 PM',  typeColor: 'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400', catColor: 'bg-teal-50 dark:bg-teal-500/12 text-teal-700 dark:text-teal-400',           Icon: GraduationCap },
];

const STAT_CARDS = [
  { label: 'Total Resources',  value: '156', trend: '+18% vs last month', icon: BookOpen, iconCls: 'text-slate-400',   color: 'text-slate-800 dark:text-white' },
  { label: 'Documents',        value: '68',  trend: '+12% vs last month', icon: FileText, iconCls: 'text-blue-400',    color: 'text-blue-600 dark:text-blue-400' },
  { label: 'Videos',           value: '42',  trend: '+22% vs last month', icon: Video,    iconCls: 'text-purple-400',  color: 'text-purple-600 dark:text-purple-400' },
  { label: 'Links',            value: '32',  trend: '+8% vs last month',  icon: Link2,    iconCls: 'text-emerald-400', color: 'text-emerald-600 dark:text-emerald-400' },
  { label: 'Shared This Month',value: '98',  trend: '+15% vs last month', icon: Share2,   iconCls: 'text-amber-400',   color: 'text-amber-600 dark:text-amber-400' },
];

export default function ResourcesPage() {
  const [activeCat, setActiveCat] = useState('All Categories');

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Resources</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Access and share curated resources to support student success.</p>
          </div>
          <button className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Plus size={15} /> Add Resource
          </button>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map(s => {
            const Icon = s.icon;
            return (
            <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon size={16} className={s.iconCls} />
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-wider text-right">{s.label}</p>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight size={10} /> {s.trend.split(' ').slice(0, 1)[0]}</p>
            </div>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search resources by title, category, or keyword..." className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400/50 transition-all" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {['All Categories','All Resource Types','All Departments','Created By Me'].map(f => (
                <button key={f} className="flex items-center gap-1.5 h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
                  {f} <ChevronDown size={12} />
                </button>
              ))}
              <button className="h-9 px-3.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">Reset</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-5 items-start">
          {/* Category list */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-widest">CATEGORIES</p>
            </div>
            <div className="py-2">
              {CATEGORIES.map(c => (
                <button key={c.label} onClick={() => setActiveCat(c.label)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors ${activeCat === c.label ? 'font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10' : 'font-medium text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/[0.03]'}`}>
                  <span>{c.label}</span>
                  <span className={`text-[10px] font-bold ${activeCat === c.label ? 'bg-cyan-600 text-white px-1.5 py-0.5 rounded-full' : 'text-slate-400 dark:text-[#40455e]'}`}>{c.count}</span>
                </button>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-50 dark:border-white/5">
              <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-white transition-colors">
                <Settings size={13} /> Manage Categories
              </button>
            </div>
          </div>

          {/* Resource list */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    {['RESOURCE','CATEGORY','TYPE','CREATED BY','LAST UPDATED','ACTIONS'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                  {RESOURCES.map((r, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/8 flex items-center justify-center shrink-0"><r.Icon size={16} className="text-slate-500 dark:text-[#8e92ad]" /></div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{r.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed line-clamp-2 max-w-[200px]">{r.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.catColor}`}>{r.category}</span></td>
                      <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.typeColor}`}>{r.type}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${r.author.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{r.author.initials}</div>
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf] truncate max-w-[80px]">{r.author.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{r.date}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Eye size={14} /></button>
                          <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><MoreHorizontal size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to 5 of 156 resources</p>
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all">◀</button>
                {[1,2,3].map(n => <button key={n} className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${n === 1 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{n}</button>)}
                <span className="text-slate-400 text-xs">... 32</span>
                <button className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">▶</button>
                <select className="ml-2 h-7 px-2 text-xs bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-md text-slate-500 dark:text-[#8e92ad] outline-none">
                  <option>5 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
