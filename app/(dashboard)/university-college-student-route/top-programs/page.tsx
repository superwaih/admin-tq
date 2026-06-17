'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Filter, ChevronDown,
  Bookmark, BookmarkCheck, GraduationCap, HelpCircle,
  Search, X, Sparkles, ArrowUpRight,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type FitLevel = 'Best Fit' | 'Reach' | 'Good Fit';

interface Program {
  id: number;
  name: string;
  degree: string;
  country: string;
  flag: string;
  fitLevel: FitLevel;
  stemDesignated: boolean;
  aifMatch: number;
  avgAifScore: number;
  classSize: number;
  tuition: string;
  deadline: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const PROGRAMS: Program[] = [
  { id:1,  name:'University of Toronto',       degree:'MEng in Computer Science',        country:'Canada',        flag:'🇨🇦', fitLevel:'Best Fit', stemDesignated:true,  aifMatch:92, avgAifScore:85, classSize:120, tuition:'$28,000/yr', deadline:'Feb 1'  },
  { id:2,  name:'University of Toronto',       degree:'BSc Health Sciences',             country:'Canada',        flag:'🇨🇦', fitLevel:'Best Fit', stemDesignated:true,  aifMatch:88, avgAifScore:85, classSize:120, tuition:'$14,000/yr', deadline:'Jan 15' },
  { id:3,  name:'University of Waterloo',      degree:'BASc Systems Design Engineering', country:'Canada',        flag:'🇨🇦', fitLevel:'Best Fit', stemDesignated:true,  aifMatch:85, avgAifScore:82, classSize:95,  tuition:'$16,500/yr', deadline:'Feb 1'  },
  { id:4,  name:'McMaster University',         degree:'BHSc Health Sciences',            country:'Canada',        flag:'🇨🇦', fitLevel:'Best Fit', stemDesignated:false, aifMatch:83, avgAifScore:80, classSize:145, tuition:'$12,800/yr', deadline:'Jan 15' },
  { id:5,  name:'Queen\'s University',         degree:'BSc Life Sciences',               country:'Canada',        flag:'🇨🇦', fitLevel:'Best Fit', stemDesignated:false, aifMatch:81, avgAifScore:79, classSize:200, tuition:'$13,200/yr', deadline:'Feb 1'  },
  { id:6,  name:'McGill University',           degree:'BSc Physiology',                  country:'Canada',        flag:'🇨🇦', fitLevel:'Reach',    stemDesignated:true,  aifMatch:74, avgAifScore:88, classSize:160, tuition:'$9,400/yr',  deadline:'Jan 15' },
  { id:7,  name:'University of British Columbia','degree':'BSc Science (Neuroscience)',  country:'Canada',        flag:'🇨🇦', fitLevel:'Reach',    stemDesignated:true,  aifMatch:71, avgAifScore:86, classSize:180, tuition:'$11,200/yr', deadline:'Jan 31' },
  { id:8,  name:'Western University',          degree:'BSc Medical Sciences',            country:'Canada',        flag:'🇨🇦', fitLevel:'Reach',    stemDesignated:false, aifMatch:68, avgAifScore:84, classSize:130, tuition:'$13,600/yr', deadline:'Feb 1'  },
  { id:9,  name:'University of Ottawa',        degree:'BSc Biomedical Science',          country:'Canada',        flag:'🇨🇦', fitLevel:'Reach',    stemDesignated:true,  aifMatch:65, avgAifScore:83, classSize:175, tuition:'$11,000/yr', deadline:'Jan 15' },
  { id:10, name:'Dalhousie University',        degree:'BSc Health Sciences',             country:'Canada',        flag:'🇨🇦', fitLevel:'Good Fit', stemDesignated:false, aifMatch:79, avgAifScore:76, classSize:110, tuition:'$10,800/yr', deadline:'Feb 15' },
  { id:11, name:'University of Calgary',       degree:'BSc Kinesiology',                 country:'Canada',        flag:'🇨🇦', fitLevel:'Good Fit', stemDesignated:false, aifMatch:77, avgAifScore:75, classSize:140, tuition:'$11,400/yr', deadline:'Feb 1'  },
  { id:12, name:'Carleton University',         degree:'BSc Neuroscience',                country:'Canada',        flag:'🇨🇦', fitLevel:'Good Fit', stemDesignated:true,  aifMatch:75, avgAifScore:74, classSize:90,  tuition:'$10,200/yr', deadline:'Mar 1'  },
];

const FIT_STYLE: Record<FitLevel, string> = {
  'Best Fit':  'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  'Reach':     'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  'Good Fit':  'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
};

const TABS = [
  { key:'all',      label:'All Program'  },
  { key:'Best Fit', label:'Best Fit',   count:5 },
  { key:'Reach',    label:'Reach',      count:4 },
  { key:'Good Fit', label:'Good Fit',   count:3 },
];

const SORT_OPTIONS = ['Most Relevant', 'Highest Match', 'Lowest Match', 'Deadline Soonest'];
const PAGE_SIZE = 4;

// ── Page ─────────────────────────────────────────────────────────────────────

export default function TopProgramsPage() {
  const [activeTab, setActiveTab]         = useState('all');
  const [sortBy, setSortBy]               = useState('Most Relevant');
  const [sortOpen, setSortOpen]           = useState(false);
  const [filterOpen, setFilterOpen]       = useState(false);
  const [stemOnly, setStemOnly]           = useState(false);
  const [searchQ, setSearchQ]             = useState('');
  const [saved, setSaved]                 = useState<Set<number>>(new Set());
  const [page, setPage]                   = useState(1);

  const filtered = useMemo(() => {
    let list = PROGRAMS;
    if (activeTab !== 'all') list = list.filter(p => p.fitLevel === activeTab);
    if (stemOnly)            list = list.filter(p => p.stemDesignated);
    if (searchQ.trim())      list = list.filter(p =>
      p.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      p.degree.toLowerCase().includes(searchQ.toLowerCase())
    );
    if (sortBy === 'Highest Match')    list = [...list].sort((a,b) => b.aifMatch - a.aifMatch);
    if (sortBy === 'Lowest Match')     list = [...list].sort((a,b) => a.aifMatch - b.aifMatch);
    return list;
  }, [activeTab, stemOnly, searchQ, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageNums   = Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1);

  function toggleSave(id: number) {
    setSaved(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }
  function changeTab(key: string) { setActiveTab(key); setPage(1); }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1280px] mx-auto space-y-5">

        {/* ── Header ── */}
        <div>
          <Link href="/university-college-student-route/aif-coach" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Top Programs for You</h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">These programs align with your interests and academic profile.</p>
            </div>
            <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shrink-0 self-start">
              <HelpCircle size={13}/> How match programs
            </button>
          </div>
        </div>

        {/* ── Tabs + controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Category tabs */}
          <div className="flex gap-0 overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-white/6">
            {TABS.map(t => (
              <button key={t.key} onClick={() => changeTab(t.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                  activeTab === t.key
                    ? 'border-cyan-600 text-cyan-700 dark:text-cyan-400'
                    : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-slate-300'
                }`}>
                {t.label}
                {t.count && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === t.key ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400' : 'bg-gray-100 dark:bg-white/10 text-slate-500'
                  }`}>{t.count}</span>
                )}
              </button>
            ))}
          </div>

          {/* Filter + Sort */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Search */}
            <div className="relative hidden sm:flex items-center">
              <Search size={13} className="absolute left-3 text-slate-400 pointer-events-none"/>
              <input
                value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }}
                placeholder="Search programs…"
                className="h-9 pl-8 pr-3 w-48 text-xs bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
              />
              {searchQ && <button onClick={() => setSearchQ('')} className="absolute right-2.5"><X size={11} className="text-slate-400 hover:text-slate-600"/></button>}
            </div>

            <button onClick={() => setFilterOpen(v => !v)}
              className={`flex items-center gap-1.5 h-9 px-3 rounded-xl border text-xs font-semibold transition-all ${
                filterOpen || stemOnly ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400' : 'border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-600 dark:text-slate-300 hover:bg-gray-50'
              }`}>
              <Filter size={13}/> Filter {stemOnly && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 ml-0.5"/>}
            </button>

            <div className="relative">
              <button onClick={() => setSortOpen(v => !v)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 transition-all">
                <span className="text-slate-400 text-[10px]">Sort by</span> {sortBy} <ChevronDown size={12} className="text-slate-400"/>
              </button>
              {sortOpen && (
                <div className="absolute top-10 right-0 bg-white dark:bg-[#1e2335] border border-gray-100 dark:border-white/8 rounded-xl shadow-xl overflow-hidden z-20 w-44">
                  {SORT_OPTIONS.map(opt => (
                    <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); setPage(1); }}
                      className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${sortBy === opt ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filter panel */}
        {filterOpen && (
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Filter Programs</h3>
              <button onClick={() => { setStemOnly(false); setFilterOpen(false); }} className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors">Clear all</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label:'STEM Designated', active:stemOnly, toggle:() => setStemOnly(v => !v) },
                { label:'Best Fit Only',   active:activeTab==='Best Fit', toggle:() => changeTab(activeTab==='Best Fit'?'all':'Best Fit') },
                { label:'Reach Programs',  active:activeTab==='Reach',    toggle:() => changeTab(activeTab==='Reach'?'all':'Reach')      },
                { label:'Good Fit Only',   active:activeTab==='Good Fit', toggle:() => changeTab(activeTab==='Good Fit'?'all':'Good Fit') },
              ].map(f => (
                <button key={f.label} onClick={f.toggle}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    f.active ? 'bg-cyan-600 text-white border-cyan-600' : 'border-gray-200 dark:border-white/8 text-slate-600 dark:text-slate-300 hover:border-cyan-400 hover:text-cyan-600'
                  }`}>
                  {f.active && <span className="w-1.5 h-1.5 rounded-full bg-white/80 mr-0.5"/>}
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mobile search */}
        <div className="sm:hidden relative flex items-center">
          <Search size={13} className="absolute left-3 text-slate-400 pointer-events-none"/>
          <input value={searchQ} onChange={e => { setSearchQ(e.target.value); setPage(1); }} placeholder="Search programs…"
            className="w-full h-10 pl-8 pr-3 text-xs bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"/>
          {searchQ && <button onClick={() => setSearchQ('')} className="absolute right-3"><X size={11} className="text-slate-400"/></button>}
        </div>

        {/* ── Programs list ── */}
        <div className="space-y-3">
          {paginated.length === 0 ? (
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center mx-auto mb-4">
                <GraduationCap size={22} className="text-cyan-500"/>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-white">No programs found</p>
              <p className="text-xs text-slate-400 mt-1 mb-4">Try adjusting your filters or search query</p>
              <button onClick={() => { setStemOnly(false); setSearchQ(''); setActiveTab('all'); }}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors">Clear all filters</button>
            </div>
          ) : (
            paginated.map(p => (
              <div key={p.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 hover:shadow-md transition-shadow">

                {/* Tags row */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${FIT_STYLE[p.fitLevel]}`}>{p.fitLevel}</span>
                  {p.stemDesignated && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300">
                      STEM Designated
                    </span>
                  )}
                </div>

                {/* Main content */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* University info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-white/8 flex items-center justify-center shrink-0">
                      <GraduationCap size={20} className="text-slate-500 dark:text-slate-400"/>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{p.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-0.5">{p.degree}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-sm">{p.flag}</span>
                        <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{p.country}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 sm:shrink-0">

                    {/* AIF Match bar */}
                    <div className="min-w-[130px]">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">AIF Match</p>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width:`${p.aifMatch}%` }}/>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{p.aifMatch}%</span>
                      </div>
                    </div>

                    {/* Avg AIF Score */}
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Avg. AIF Score</p>
                      <p className="text-base font-black text-slate-800 dark:text-white">{p.avgAifScore}%</p>
                    </div>

                    {/* Class Size */}
                    <div className="text-center">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Class Size</p>
                      <p className="text-base font-black text-slate-800 dark:text-white">{p.classSize}</p>
                    </div>

                    {/* Deadline */}
                    <div className="text-center hidden xl:block">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Deadline</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.deadline}</p>
                    </div>

                    {/* Tuition */}
                    <div className="text-center hidden xl:block">
                      <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Tuition</p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{p.tuition}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 sm:shrink-0">
                    <button className="flex items-center gap-1.5 h-9 px-4 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-cyan-400 hover:text-cyan-700 transition-all whitespace-nowrap">
                      View Details
                    </button>
                    <button onClick={() => toggleSave(p.id)}
                      className={`flex items-center gap-1.5 h-9 px-3.5 rounded-xl border text-xs font-semibold transition-all whitespace-nowrap ${
                        saved.has(p.id)
                          ? 'bg-cyan-600 border-cyan-600 text-white hover:bg-cyan-700'
                          : 'border-gray-200 dark:border-white/8 text-slate-500 dark:text-slate-400 hover:border-cyan-400 hover:text-cyan-600'
                      }`}>
                      {saved.has(p.id)
                        ? <><BookmarkCheck size={13}/> Saved</>
                        : <><Bookmark size={13}/> Save</>
                      }
                    </button>
                  </div>
                </div>

                {/* Mobile extras */}
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-50 dark:border-white/5 sm:hidden text-[10px] text-slate-500 dark:text-[#8e92ad]">
                  <span>Deadline: <strong className="text-slate-700 dark:text-slate-200">{p.deadline}</strong></span>
                  <span>Tuition: <strong className="text-slate-700 dark:text-slate-200">{p.tuition}</strong></span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Pagination ── */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400 dark:text-[#8e92ad]">
              Show {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} Programs
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all">
                <ChevronLeft size={13}/>
              </button>
              {pageNums.map(n => (
                <button key={n} onClick={() => setPage(n)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    page === n ? 'bg-cyan-600 text-white' : 'border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-500 dark:text-slate-400 hover:bg-gray-50'
                  }`}>{n}</button>
              ))}
              {totalPages > 3 && (
                <>
                  <span className="text-slate-400 text-xs px-0.5">…</span>
                  <button onClick={() => setPage(totalPages)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-500 hover:bg-gray-50 transition-all ${page === totalPages ? 'bg-cyan-600 text-white border-transparent' : ''}`}>
                    {totalPages}
                  </button>
                </>
              )}
              <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all">
                <ChevronRight size={13}/>
              </button>
            </div>
          </div>
        )}

        {/* ── Bottom banner ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-2xl px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles size={13} className="text-cyan-600 dark:text-cyan-400"/>
            </div>
            <div>
              <p className="text-sm font-bold text-cyan-800 dark:text-cyan-200">Can&apos;t Find the right program?</p>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-0.5">Try adjusting your preference or explore more programs</p>
            </div>
          </div>
          <Link href="/university-college-student-route/programs"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all shrink-0 whitespace-nowrap self-start sm:self-auto">
            Explore All Programs <ArrowUpRight size={13}/>
          </Link>
        </div>

      </div>
    </div>
  );
}
