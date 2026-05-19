'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Search, FileText, Mic, MessageSquare, BookOpen,
  Pencil, Clock, LayoutGrid, Plus, Lightbulb, CheckCircle,
  Calendar, TrendingUp, MoreHorizontal,
} from 'lucide-react';

const TYPE_STYLES: Record<string, string> = {
  'Essay Review':   'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'Mock Interview': 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  'Consultation':   'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  'MMI Prep':       'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
  'Other':          'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Essay Review':   <FileText size={16} className="text-amber-500" />,
  'Mock Interview': <Mic size={16} className="text-blue-500" />,
  'Consultation':   <MessageSquare size={16} className="text-emerald-500" />,
  'MMI Prep':       <BookOpen size={16} className="text-purple-500" />,
  'Other':          <Pencil size={16} className="text-slate-400" />,
};

const STAT_CARDS = [
  {
    label: 'Total Templates',
    sub: 'All templates created',
    value: '45',
    icon: <LayoutGrid size={20} />,
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    iconColor: 'text-blue-600',
    valueColor: 'text-slate-800 dark:text-white',
  },
  {
    label: 'Active Templates',
    sub: 'Currently in use',
    value: '38',
    icon: <TrendingUp size={20} />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600',
    valueColor: 'text-slate-800 dark:text-white',
  },
  {
    label: 'Most Used',
    sub: 'Used 156 times',
    value: 'Essay Review',
    icon: <Clock size={20} />,
    iconBg: 'bg-purple-50 dark:bg-purple-500/15',
    iconColor: 'text-purple-600',
    valueColor: 'text-slate-800 dark:text-white',
  },
  {
    label: 'Last Updated',
    sub: 'May 15, 2026',
    value: 'Today',
    icon: <Calendar size={20} />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-600',
    valueColor: 'text-slate-800 dark:text-white',
  },
];

const TEMPLATES = [
  {
    id: 't1',
    title: 'Personal Statement Review',
    desc: 'Comprehensive review of personal statements with feedback on structure, content',
    type: 'Essay Review',
    sections: 5,
    updated: 'May 12, 2026',
    status: 'Active',
  },
  {
    id: 't2',
    title: 'MMI Practice Session',
    desc: 'Multiple Mini Interview preparation with scenario-based questions and feedback',
    type: 'MMI Prep',
    sections: 8,
    updated: 'May 10, 2026',
    status: 'Active',
  },
  {
    id: 't3',
    title: 'Career Guidance Consultation',
    desc: 'Initial consultation to discuss career goals, program fit, and application strategy',
    type: 'Consultation',
    sections: 4,
    updated: 'May 8, 2026',
    status: 'Active',
  },
  {
    id: 't4',
    title: 'Mock Interview - Medical School',
    desc: 'Full-length mock interview with typical medical school admissions questions',
    type: 'Mock Interview',
    sections: 6,
    updated: 'May 5, 2026',
    status: 'Active',
  },
  {
    id: 't5',
    title: 'Secondary Essay Review',
    desc: 'Detailed review and editing of secondary application essays',
    type: 'Essay Review',
    sections: 4,
    updated: 'May 3, 2026',
    status: 'Draft',
  },
  {
    id: 't6',
    title: 'Gap Year Planning',
    desc: 'Strategic planning for productive gap year activities and experiences',
    type: 'Consultation',
    sections: 3,
    updated: 'Apr 28, 2026',
    status: 'Active',
  },
];

const CATEGORIES = [
  { label: 'Essay Review',   count: 12, dot: 'bg-amber-400' },
  { label: 'Mock Interview', count: 8,  dot: 'bg-blue-400' },
  { label: 'Consultation',   count: 15, dot: 'bg-emerald-400' },
  { label: 'MMI Prep',       count: 6,  dot: 'bg-purple-400' },
  { label: 'Other',          count: 4,  dot: 'bg-slate-400' },
];

const QUICK_TIPS = [
  'Templates help standardize your session workflows',
  'Reuse templates to save time scheduling',
  'Update templates to reflect best practices',
];

export default function CreateTemplatePage() {
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.desc.toLowerCase().includes(search.toLowerCase()) ||
    t.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div>
          <Link
            href="/counselor/session-templates"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2"
          >
            <ChevronLeft size={15} /> Back to Session Templates
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Template</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">Create, manage, and reuse templates for your different types of counseling sessions.</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map(s => (
            <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>
              <p className={`text-xl font-bold ${s.valueColor} leading-tight`}>{s.value}</p>
              <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main two-column */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 items-start">

          {/* Left: list + actions */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* Search bar */}
            <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8e92ad]" />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                />
              </div>
            </div>

            {/* Template rows */}
            <div className="divide-y divide-gray-50 dark:divide-white/[0.04]">
              {filtered.map((t, i) => (
                <div
                  key={t.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${i === 0 ? 'bg-cyan-50/40 dark:bg-cyan-500/5' : ''}`}
                >
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${TYPE_STYLES[t.type]}`}>
                    {TYPE_ICONS[t.type]}
                  </div>

                  {/* Title + desc */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{t.title}</p>
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] truncate mt-0.5">{t.desc}</p>
                  </div>

                  {/* Meta row for mobile / columns for desktop */}
                  <div className="flex flex-wrap items-center gap-3 sm:gap-5 shrink-0">
                    {/* Type badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${TYPE_STYLES[t.type]}`}>
                      {t.type}
                    </span>

                    {/* Sections */}
                    <div className="text-center hidden sm:block">
                      <p className="text-sm font-bold text-slate-700 dark:text-[#c8ccdf]">{t.sections}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] uppercase tracking-wide">Sections</p>
                    </div>

                    {/* Last updated */}
                    <div className="text-right hidden sm:block">
                      <p className="text-xs font-semibold text-slate-600 dark:text-[#c8ccdf]">{t.updated}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] uppercase tracking-wide">Last updated</p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      t.status === 'Active'
                        ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}>
                      {t.status}
                    </span>

                    {/* Actions */}
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors">
                      <MoreHorizontal size={14} />
                    </button>
                  </div>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="px-5 py-12 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No templates match your search</p>
                  <p className="text-xs text-slate-400 dark:text-[#40455e] mt-1">Try a different keyword</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-gray-50 dark:border-white/5">
              <button className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                Load More Templates
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all">
                <Plus size={15} /> Add Template
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Template Categories */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Template Categories</h3>
              <ul className="space-y-2.5">
                {CATEGORIES.map(c => (
                  <li key={c.label} className="flex items-center gap-2.5">
                    <span className={`w-2 h-2 rounded-full ${c.dot} shrink-0`} />
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1">{c.label}</span>
                    <span className="text-xs font-bold text-slate-500 dark:text-[#8e92ad]">{c.count}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Template Stats donut */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Template Stats</h3>
              <div className="flex flex-col items-center gap-3">
                {/* SVG donut */}
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#e5e7eb" strokeWidth="4" className="dark:stroke-white/10" />
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke="#0891b2"
                      strokeWidth="4"
                      strokeDasharray="65.97 34.03"
                      strokeLinecap="round"
                    />
                    <circle
                      cx="18" cy="18" r="14"
                      fill="none"
                      stroke="#a78bfa"
                      strokeWidth="4"
                      strokeDasharray="18.85 81.15"
                      strokeDashoffset="-65.97"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold text-slate-800 dark:text-white">75%</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] text-center">Templates actively used</p>

                {/* Legend */}
                <div className="w-full space-y-1.5 mt-1">
                  {[
                    { label: 'Active',  pct: '75%', color: 'bg-cyan-600' },
                    { label: 'Draft',   pct: '16%', color: 'bg-purple-400' },
                    { label: 'Archived', pct: '9%', color: 'bg-gray-200 dark:bg-white/15' },
                  ].map(l => (
                    <div key={l.label} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${l.color} shrink-0`} />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 flex-1">{l.label}</span>
                      <span className="text-[11px] font-bold text-slate-500 dark:text-[#8e92ad]">{l.pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} className="text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Quick Tips</h3>
              </div>
              <ul className="space-y-2.5">
                {QUICK_TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-[#8e92ad]">
                    <CheckCircle size={11} className="text-cyan-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
