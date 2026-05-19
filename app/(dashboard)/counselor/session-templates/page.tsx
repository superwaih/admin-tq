'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Search, MoreHorizontal, Clock, Users, Star,
  FileText, Mic, MessageSquare, BookOpen, Plus, Lightbulb,
  ChevronDown, Info, BarChart2, Pencil, Bookmark,
} from 'lucide-react';

const CATEGORIES = ['All Template', 'Essay Review', 'Mock Interview', 'Consultation', 'MMI Prep', 'Custom'];

const TYPE_STYLES: Record<string, string> = {
  'Mock Interview': 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
  'Essay Review':   'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'Consultation':   'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  'MMI Prep':       'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400',
  'Custom':         'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  'Mock Interview': <Mic size={16} />,
  'Essay Review':   <FileText size={16} />,
  'Consultation':   <MessageSquare size={16} />,
  'MMI Prep':       <BookOpen size={16} />,
  'Custom':         <Pencil size={16} />,
};

const TEMPLATES = [
  {
    id: 't1',
    title: 'Medical School',
    subtitle: 'Mock Interview',
    type: 'Mock Interview',
    description: 'Full length mock interview with behavioral and situational question.',
    duration: 60,
    stage: 'Interview Stage',
    used: 18,
    starred: false,
  },
  {
    id: 't2',
    title: 'Personal Statement',
    subtitle: 'Review',
    type: 'Essay Review',
    description: 'Comprehensive review of personal statement structure, content, clarity and impact.',
    duration: 60,
    stage: 'Any Stage',
    used: 24,
    starred: false,
  },
  {
    id: 't3',
    title: 'General',
    subtitle: 'Consultation',
    type: 'Consultation',
    description: 'General guidance session to discuss application strategy, timeline and next steps.',
    duration: 45,
    stage: 'Any Stage',
    used: 32,
    starred: true,
  },
  {
    id: 't4',
    title: 'MMI Practice',
    subtitle: 'Session',
    type: 'MMI Prep',
    description: 'Practice multiple MMI stations with structured feedback and improvement tip.',
    duration: 45,
    stage: 'MMI Stage',
    used: 15,
    starred: false,
  },
  {
    id: 't5',
    title: 'Secondary Essay',
    subtitle: 'Review',
    type: 'Essay Review',
    description: 'Review and feedback on secondary essays quality, relevance and storytelling.',
    duration: 45,
    stage: 'Any Stage',
    used: 20,
    starred: false,
  },
  {
    id: 't6',
    title: 'Interview Readiness',
    subtitle: 'Coaching',
    type: 'Mock Interview',
    description: 'Strategy and coaching to help students excel in interviews with confidence.',
    duration: 45,
    stage: 'Interview Stage',
    used: 10,
    starred: false,
  },
  {
    id: 't7',
    title: 'MMI Ethics',
    subtitle: 'Practice',
    type: 'MMI Prep',
    description: 'Focused practice on ethics and professionalism scenarios in MMI.',
    duration: 45,
    stage: 'Any Stage',
    used: 8,
    starred: false,
  },
];

const SORT_OPTIONS = ['Recently Updated', 'Most Used', 'Alphabetical', 'Duration'];

const MOST_USED = [
  { name: 'General Consultation',        times: 32 },
  { name: 'Personal Statement Review',   times: 24 },
  { name: 'Medical School Mock Interview', times: 18 },
];

const TIPS = [
  'Start with a clear session objective',
  'Quality key discussion points',
  'Add recommended sources',
  'Include time allocation for topics',
  'Review and update regularly',
];

export default function SessionTemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All Template');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Recently Updated');
  const [showSort, setShowSort] = useState(false);
  const [starred, setStarred] = useState<Record<string, boolean>>(
    Object.fromEntries(TEMPLATES.map(t => [t.id, t.starred]))
  );

  const filtered = TEMPLATES.filter(t => {
    const matchCat = activeCategory === 'All Template' || t.type === activeCategory || (activeCategory === 'Custom' && t.type === 'Custom');
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.subtitle.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div>
          <Link
            href="/counselor/schedule-session"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2"
          >
            <ChevronLeft size={15} /> Back to Schedule Session
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Session Templates</h1>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(cat => {
              const count = cat === 'All Template' ? TEMPLATES.length : TEMPLATES.filter(t => t.type === cat || (cat === 'Custom' && t.type === 'Custom')).length;
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {cat}
                  {count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/8 text-slate-500 dark:text-[#8e92ad]'}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8e92ad]" />
              <input
                type="text"
                placeholder="Search templates..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-4 py-2 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 w-36 sm:w-44 transition-all"
              />
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSort(s => !s)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {sort} <ChevronDown size={12} />
              </button>
              {showSort && (
                <div className="absolute right-0 top-full mt-1.5 z-20 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden w-44">
                  {SORT_OPTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => { setSort(s); setShowSort(false); }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium transition-colors ${sort === s ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600' : 'text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">

          {/* Template grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(t => (
              <div
                key={t.id}
                className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md hover:border-gray-200 dark:hover:border-white/10 transition-all group"
              >
                {/* Card header */}
                <div className="flex items-start justify-between">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${TYPE_STYLES[t.type]}`}>
                    {TYPE_ICONS[t.type]}
                  </div>
                  <button className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal size={15} />
                  </button>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{t.title}</h3>
                  <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight">{t.subtitle}</p>
                </div>

                {/* Type badge */}
                <span className={`self-start text-[10px] font-bold px-2.5 py-1 rounded-full ${TYPE_STYLES[t.type]}`}>
                  {t.type}
                </span>

                {/* Description */}
                <p className="text-xs text-slate-500 dark:text-[#8e92ad] leading-relaxed flex-1">{t.description}</p>

                {/* Meta */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400 dark:text-[#8e92ad]">
                  <span className="flex items-center gap-1"><Clock size={10} /> {t.duration} min</span>
                  <span className="flex items-center gap-1"><Users size={10} /> {t.stage}</span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-white/5">
                  <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Used {t.used} times</span>
                  <button
                    onClick={() => setStarred(prev => ({ ...prev, [t.id]: !prev[t.id] }))}
                    className={`p-1 rounded-lg transition-colors ${starred[t.id] ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'}`}
                  >
                    <Star size={13} fill={starred[t.id] ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            ))}

            {/* Create New Template card */}
            <Link href="/counselor/create-template" className="bg-white dark:bg-[#161a27] rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/8 p-5 flex flex-col items-center justify-center gap-3 text-center hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:bg-cyan-50/30 dark:hover:bg-cyan-500/5 transition-all cursor-pointer group min-h-[200px]">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/8 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/15 flex items-center justify-center transition-colors">
                <Plus size={20} className="text-slate-400 dark:text-[#8e92ad] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-cyan-700 dark:group-hover:text-cyan-300 transition-colors">Create New Template</p>
                <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">Create a custom session template from scratch.</p>
              </div>
              <span className="px-4 py-2 rounded-xl bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white group-hover:border-cyan-600 transition-all shadow-sm">
                Get Started
              </span>
            </Link>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="sm:col-span-2 lg:col-span-3 py-12 text-center">
                <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No templates match your search</p>
                <p className="text-xs text-slate-400 dark:text-[#40455e] mt-1">Try a different filter or search term</p>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* About card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center">
                  <Info size={13} className="text-cyan-600" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">About Session Template</h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-relaxed mb-4">
                Templates help you standardize your session, save time, and ensure every student gets the best experience
              </p>
              <ul className="space-y-2.5">
                {[
                  { icon: <Clock size={11} />, text: 'Save time reusable template' },
                  { icon: <BarChart2 size={11} />, text: 'Maintain consistent session quality' },
                  { icon: <Pencil size={11} />, text: 'Customize for different student needs' },
                  { icon: <BarChart2 size={11} />, text: 'Track usage and effectiveness' },
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-[#c8ccdf]">
                    <span className="text-cyan-500 shrink-0">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Most Used */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Most Used Template</h3>
              <ol className="space-y-3">
                {MOST_USED.map((m, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[10px] font-bold text-cyan-600 shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex-1 truncate">{m.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] shrink-0">{m.times} times</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} className="text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Tips for Creating Templates</h3>
              </div>
              <ul className="space-y-2">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-[#8e92ad]">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Inspiration */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Users size={13} className="text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Need Inspiration?</h3>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-relaxed mb-3">
                Browse our recommended templates or create your own customize template.
              </p>
              <button className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-400 hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all">
                View Recommendation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
