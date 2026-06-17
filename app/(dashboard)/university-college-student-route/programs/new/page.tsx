'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Search, ChevronDown, Filter, X, Heart,
  Plus, Trash2, TrendingUp, Sparkles, Building2, Star,
  BookOpen, AlertCircle, CheckCircle2, ChevronRight,
  Globe, SlidersHorizontal, BarChart3,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ALL_PROGRAMS, type Program } from '../programs-data';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Selected {
  id: number;
  university: string;
  program: string;
  match: number;
}

// ── Data ──────────────────────────────────────────────────────────────────────

const COUNTRIES     = ['All Countries', 'Canada', 'USA', 'UK', 'Australia'];
const DEGREE_TYPES  = ['All Degree', 'Masters', 'Bachelors', 'PhD', 'Diploma'];
const INTAKES       = ['All Intakes', 'Fall 2025', 'Winter 2026', 'Summer 2025'];
const TUITION_OPTS  = ['Any', 'Under $15k', '$15k–$20k', 'Over $20k'];
const SORT_OPTS     = ['Best Match', 'Deadline', 'Tuition Low–High', 'Tuition High–Low'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function matchColor(m: number): string {
  if (m >= 80) return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
  if (m >= 60) return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300';
  return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
}
function statusColor(s: string) {
  if (s === 'On Track') return 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300';
  if (s === 'Moderate') return 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300';
  return 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300';
}
function avgMatch(sel: Selected[]) {
  if (!sel.length) return 0;
  return Math.round(sel.reduce((a, b) => a + b.match, 0) / sel.length);
}
function riskDist(sel: Selected[]) {
  const safe     = sel.filter(s => s.match >= 80).length;
  const moderate = sel.filter(s => s.match >= 60 && s.match < 80).length;
  const reach    = sel.filter(s => s.match < 60).length;
  return { safe, moderate, reach };
}

// ── Inline select wrapper ─────────────────────────────────────────────────────

function FilterSelect({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="appearance-none h-9 pl-3 pr-7 text-xs font-medium bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
    </div>
  );
}

// ── Program Card ──────────────────────────────────────────────────────────────

function ProgramCard({ prog, isSelected, onAdd, onRemove, onWishlist, onOpen, wishlisted }: {
  prog: Program;
  isSelected: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onWishlist: () => void;
  onOpen: () => void;
  wishlisted: boolean;
}) {
  return (
    <div className={`group bg-white dark:bg-[#161a27] rounded-2xl border transition-all shadow-sm flex flex-col ${isSelected ? 'border-blue-300 dark:border-blue-500/50 ring-1 ring-blue-200 dark:ring-blue-500/20' : 'border-gray-100 dark:border-white/6 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md'}`}>
      <div className="relative p-4 flex-1">
        {/* Stretched overlay button — makes the whole body open details */}
        <button
          type="button"
          onClick={onOpen}
          aria-label={`View details for ${prog.program} at ${prog.university}`}
          className="absolute inset-0 z-0 rounded-t-2xl cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        />

        {/* Top row */}
        <div className="relative z-10 flex items-start justify-between gap-2 mb-3 pointer-events-none">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${matchColor(prog.match)}`}>{prog.match}% Match</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onWishlist(); }}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            className="pointer-events-auto p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <Heart size={14} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-slate-300 dark:text-slate-600'}/>
          </button>
        </div>

        {/* University */}
        <div className="relative z-10 flex items-center gap-2 mb-2 pointer-events-none">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20">
            <Building2 size={13} className="text-blue-600 dark:text-blue-400"/>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{prog.university}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[9px]">🇨🇦</span>
              <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{prog.country}</span>
            </div>
          </div>
        </div>

        {/* Program name */}
        <p className="relative z-10 pointer-events-none text-[11px] font-semibold text-slate-700 dark:text-slate-200 mb-3 leading-snug">{prog.program}</p>

        {/* Intake / Deadline */}
        <div className="relative z-10 pointer-events-none flex items-center gap-3 mb-3">
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Intake</p>
            <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{prog.intake}</p>
          </div>
          <div className="w-px h-6 bg-gray-100 dark:bg-white/8"/>
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Deadline</p>
            <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{prog.deadline}</p>
          </div>
          <div className="w-px h-6 bg-gray-100 dark:bg-white/8"/>
          <div>
            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Tuition</p>
            <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{prog.tuition}</p>
          </div>
        </div>

        {/* Status + view hint */}
        <div className="relative z-10 pointer-events-none flex items-center justify-between gap-2">
          <span className={`inline-flex text-[9px] font-bold px-2 py-0.5 rounded-full ${statusColor(prog.status)}`}>{prog.status}</span>
          <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
            View Details <ChevronRight size={11}/>
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        {isSelected ? (
          <button onClick={onRemove}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-red-50 dark:bg-red-500/15 hover:bg-red-100 text-red-600 dark:text-red-400 text-[11px] font-bold transition-all border border-red-100 dark:border-red-500/20">
            <CheckCircle2 size={12}/> Added
          </button>
        ) : (
          <button onClick={onAdd}
            className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-all shadow-sm">
            <Plus size={12}/> Add Program
          </button>
        )}
        <button onClick={onRemove}
          className="w-8 h-8 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 text-slate-400 hover:text-red-500 transition-all">
          <Trash2 size={12}/>
        </button>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AddNewProgramPage() {
  const router = useRouter();
  const [query, setQuery]           = useState('');
  const [country, setCountry]       = useState('All Countries');
  const [degreeType, setDegreeType] = useState('All Degree');
  const [intake, setIntake]         = useState('All Intakes');
  const [tuition, setTuition]       = useState('Any');
  const [sortBy, setSortBy]         = useState('Best Match');
  const [visibleCount, setVisibleCount] = useState(8);
  const [selected, setSelected]     = useState<Selected[]>([]);
  const [wishlisted, setWishlisted] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab]   = useState<'browse' | 'ai'>('browse');

  // Filtering
  const filtered = useMemo(() => {
    let list = ALL_PROGRAMS.filter(p => {
      if (query && !p.university.toLowerCase().includes(query.toLowerCase()) &&
                   !p.program.toLowerCase().includes(query.toLowerCase())) return false;
      if (country !== 'All Countries' && p.country !== country) return false;
      if (degreeType !== 'All Degree' && p.degree !== degreeType) return false;
      if (intake !== 'All Intakes' && p.intake !== intake) return false;
      if (tuition === 'Under $15k'   && parseInt(p.tuition) >= 15) return false;
      if (tuition === '$15k–$20k'    && (parseInt(p.tuition) < 15 || parseInt(p.tuition) > 20)) return false;
      if (tuition === 'Over $20k'    && parseInt(p.tuition) <= 20) return false;
      return true;
    });
    if (sortBy === 'Best Match')          list = [...list].sort((a,b) => b.match - a.match);
    if (sortBy === 'Deadline')            list = [...list].sort((a,b) => a.deadline.localeCompare(b.deadline));
    if (sortBy === 'Tuition Low–High')    list = [...list].sort((a,b) => parseInt(a.tuition) - parseInt(b.tuition));
    if (sortBy === 'Tuition High–Low')    list = [...list].sort((a,b) => parseInt(b.tuition) - parseInt(a.tuition));
    return list;
  }, [query, country, degreeType, intake, tuition, sortBy]);

  function clearFilters() {
    setQuery(''); setCountry('All Countries'); setDegreeType('All Degree');
    setIntake('All Intakes'); setTuition('Any');
  }
  function toggleSelect(prog: Program) {
    if (selected.find(s => s.id === prog.id)) {
      setSelected(s => s.filter(x => x.id !== prog.id));
    } else if (selected.length < 10) {
      setSelected(s => [...s, { id: prog.id, university: prog.university, program: prog.program, match: prog.match }]);
    }
  }
  function removeSelected(id: number) { setSelected(s => s.filter(x => x.id !== id)); }
  function toggleWish(id: number) {
    setWishlisted(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const risk = riskDist(selected);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <Link href="/university-college-student-route/programs" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
              <ChevronLeft size={15}/> Back to Program
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Program</h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Discover universities and programs that match your goals, grades and interests.</p>
          </div>

          {/* Illustration badges */}
          <div className="hidden sm:flex items-start gap-3 shrink-0 relative h-24 w-72">
            <div className="absolute top-0 left-12 flex items-center gap-1.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-xl px-3 py-1.5 shadow-sm z-10">
              <div className="w-5 h-5 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                <Search size={10} className="text-blue-600"/>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Find<br/>Best Programs</span>
            </div>
            <div className="absolute top-8 left-0 flex items-center gap-1.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-xl px-3 py-1.5 shadow-sm">
              <div className="w-5 h-5 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center">
                <BarChart3 size={10} className="text-amber-600"/>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Track<br/>Application</span>
            </div>
            <div className="absolute top-0 right-20 flex items-center gap-1.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-xl px-3 py-1.5 shadow-sm">
              <div className="w-5 h-5 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <TrendingUp size={10} className="text-emerald-600"/>
              </div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">Maximize<br/>Admits</span>
            </div>
            <div className="absolute bottom-0 right-0 text-5xl">🎓</div>
          </div>
        </div>

        {/* ── Tab buttons ── */}
        <div className="flex items-center gap-2">
          <button onClick={() => setActiveTab('browse')}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border',
              activeTab === 'browse'
                ? 'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/10 text-slate-800 dark:text-white shadow-sm'
                : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700')}>
            <Globe size={15}/> Browse Program
          </button>
          <button onClick={() => setActiveTab('ai')}
            className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/25'
                : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100')}>
            <Sparkles size={15}/> Get AI Recommendations
          </button>
        </div>

        {/* ── Main layout ── */}
        <div className="flex gap-5 items-start">

          {/* ── LEFT: search + cards ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Filters row */}
            <div className="flex flex-wrap gap-2 items-end">
              {/* Search */}
              <div className="flex-1 min-w-[180px]">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Program</p>
                <div className="relative">
                  <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                  <input value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Search university or program…"
                    className="w-full pl-8 pr-3 h-9 text-xs bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                </div>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Country</p>
                <FilterSelect value={country} options={COUNTRIES} onChange={setCountry}/>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Degree Type</p>
                <FilterSelect value={degreeType} options={DEGREE_TYPES} onChange={setDegreeType}/>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Intake</p>
                <FilterSelect value={intake} options={INTAKES} onChange={setIntake}/>
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tuition Range</p>
                <FilterSelect value={tuition} options={TUITION_OPTS} onChange={setTuition}/>
              </div>
              <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 transition-all">
                <SlidersHorizontal size={12}/> Filters
              </button>
              <button onClick={clearFilters} className="h-9 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all">
                Clear All
              </button>
            </div>

            {/* Sort row */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white">
                Recommended Programs <span className="ml-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">{filtered.length}</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 dark:text-[#8e92ad]">Sort by:</span>
                <FilterSelect value={sortBy} options={SORT_OPTS} onChange={setSortBy}/>
              </div>
            </div>

            {/* Program cards grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.slice(0, visibleCount).map(prog => (
                <ProgramCard
                  key={prog.id}
                  prog={prog}
                  isSelected={!!selected.find(s => s.id === prog.id)}
                  wishlisted={wishlisted.has(prog.id)}
                  onAdd={() => toggleSelect(prog)}
                  onRemove={() => { toggleSelect(prog); removeSelected(prog.id); }}
                  onWishlist={() => toggleWish(prog.id)}
                  onOpen={() => router.push(`/university-college-student-route/programs/details/${prog.id}`)}
                />
              ))}
            </div>

            {/* Load more */}
            {visibleCount < filtered.length && (
              <button onClick={() => setVisibleCount(v => v + 8)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Load More Programs <ChevronDown size={14}/>
              </button>
            )}

            {/* Tip banner */}
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-3.5">
              <Sparkles size={14} className="text-blue-500 shrink-0"/>
              <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                <span className="font-bold">Tip:</span> Add 6–10 programs for accurate probability prediction and better result.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-68 xl:w-72 shrink-0 gap-4">

            {/* My Selection card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">My Selection</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                  {selected.length}
                </span>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {selected.length === 0 ? (
                  <div className="px-4 py-6 text-center">
                    <BookOpen size={20} className="text-slate-300 dark:text-slate-600 mx-auto mb-2"/>
                    <p className="text-xs text-slate-400 dark:text-[#8e92ad]">No programs added yet.</p>
                    <p className="text-[10px] text-slate-300 dark:text-[#5a5f78] mt-0.5">Click "Add Program" on any card.</p>
                  </div>
                ) : (
                  selected.map(s => (
                    <div key={s.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors group">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                        <Building2 size={12} className="text-blue-600"/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{s.university}</p>
                        <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] truncate mt-0.5">{s.program}</p>
                        <span className={`inline-flex mt-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${matchColor(s.match)}`}>{s.match}% Match</span>
                      </div>
                      <button onClick={() => removeSelected(s.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all shrink-0 mt-0.5">
                        <X size={11}/>
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-50 dark:border-white/5">
                <button onClick={() => {}} disabled={selected.length >= 10}
                  className="w-full flex items-center justify-center gap-1.5 h-8 rounded-xl border border-dashed border-blue-300 dark:border-blue-500/40 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <Plus size={12}/> Add Another Program
                </button>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Insights</h3>
              <div className="space-y-2.5 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={11} className="text-slate-400"/>
                    <span className="text-xs text-slate-500 dark:text-[#8e92ad]">Avg. Match</span>
                  </div>
                  <span className={`text-xs font-bold ${avgMatch(selected) >= 80 ? 'text-emerald-600 dark:text-emerald-400' : avgMatch(selected) >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500'}`}>
                    {selected.length ? `${avgMatch(selected)}%` : '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={11} className="text-slate-400"/>
                    <span className="text-xs text-slate-500 dark:text-[#8e92ad]">Total Program</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{selected.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={11} className="text-slate-400"/>
                    <span className="text-xs text-slate-500 dark:text-[#8e92ad]">Risk Distribution</span>
                  </div>
                  {selected.length > 0 ? (
                    <div className="flex items-center gap-1">
                      {risk.safe > 0     && <span className="text-[9px] font-bold text-emerald-600">{risk.safe}S</span>}
                      {risk.moderate > 0 && <span className="text-[9px] font-bold text-amber-600">{risk.moderate}M</span>}
                      {risk.reach > 0    && <span className="text-[9px] font-bold text-red-500">{risk.reach}R</span>}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-300 dark:text-[#5a5f78]">—</span>
                  )}
                </div>
              </div>

              {/* Risk legend */}
              <div className="flex items-center gap-3 mb-4 py-2.5 px-3 bg-gray-50 dark:bg-white/3 rounded-xl">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"/><span className="text-[9px] text-slate-500 dark:text-[#8e92ad]">Safe</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"/><span className="text-[9px] text-slate-500 dark:text-[#8e92ad]">Moderate</span></div>
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"/><span className="text-[9px] text-slate-500 dark:text-[#8e92ad]">Reach</span></div>
              </div>

              <Link href="/university-college-student-route/programs"
                className={cn('w-full flex items-center justify-center gap-1.5 h-10 rounded-xl text-sm font-bold transition-all',
                  selected.length > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-600/25'
                    : 'bg-gray-100 dark:bg-white/8 text-slate-400 dark:text-[#8e92ad] cursor-not-allowed pointer-events-none')}>
                <Plus size={14}/> Add Selected Program
              </Link>
              <p className="text-[9px] text-center text-slate-400 dark:text-[#8e92ad] mt-2">
                You can add up to 10 programs
              </p>
            </div>

            {/* Mobile bottom CTA spacer */}
          </aside>
        </div>

        {/* Mobile sticky bottom bar */}
        {selected.length > 0 && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#161a27] border-t border-gray-100 dark:border-white/8 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-white">{selected.length} program{selected.length > 1 ? 's' : ''} selected</p>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Avg match: {avgMatch(selected)}%</p>
            </div>
            <Link href="/university-college-student-route/programs"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
              <CheckCircle2 size={14}/> Add {selected.length} Program{selected.length > 1 ? 's' : ''}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
