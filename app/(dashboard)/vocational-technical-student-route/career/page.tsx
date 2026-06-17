'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import {
  Search, ChevronDown, SlidersHorizontal, GitCompareArrows, Info, Star,
  CheckCircle2, ClipboardCheck, Compass, CalendarClock, BookOpen, Headphones,
  X,
} from 'lucide-react';
import { PATHWAYS, type Pathway } from './pathways';

/* ── Data ──────────────────────────────────────────────────────────── */

const CATEGORIES = ['All Categories', 'Skilled Trades', 'Automotive', 'Construction', 'Manufacturing', 'Technology', 'Energy'];
const INDUSTRIES = ['Construction', 'Skilled Trades', 'Manufacturing', 'Automotive', 'Technology', 'Energy'];

/* ── Pathway card ──────────────────────────────────────────────────── */

function PathwayCard({
  p, saved, onSave, selected, onCompare,
}: {
  p: Pathway; saved: boolean; onSave: () => void; selected: boolean; onCompare: () => void;
}) {
  const demandStyle = p.demand === 'High Demand'
    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300';

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-3.5 sm:p-4 rounded-2xl border border-gray-100 dark:border-white/8 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all bg-white dark:bg-[#161a27]">
      {/* Image */}
      <div className="relative w-full sm:w-44 lg:w-52 h-36 sm:h-auto shrink-0 rounded-xl overflow-hidden">
        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
        <span className="absolute bottom-2 left-2 text-[10px] font-bold text-white bg-black/55 backdrop-blur-sm px-2 py-0.5 rounded-md">
          {p.match}% Match
        </span>
      </div>

      {/* Body */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-[15px] font-bold text-slate-900 dark:text-slate-100">
                {p.title} ({p.code})
              </h3>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${demandStyle}`}>{p.demand}</span>
            </div>
            <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">{p.description}</p>
          </div>
          <button
            onClick={onSave}
            aria-label={saved ? 'Remove from saved' : 'Save pathway'}
            className="shrink-0 p-1 -mr-1 -mt-1"
          >
            <Star className={`w-4 h-4 transition-colors ${saved ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-slate-600 hover:text-amber-400'}`} />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
          {[p.entry, p.duration, p.salary].map((t) => (
            <span key={t} className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
              {t}
            </span>
          ))}
        </div>

        {/* Fit */}
        <div className="mt-2.5 flex items-start gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-snug">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Why it&apos;s a great fit: </span>
            {p.fit}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-gray-50 dark:border-white/5">
          <label className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={selected}
              onChange={onCompare}
              className="w-3.5 h-3.5 rounded border-gray-300 dark:border-white/20 text-blue-600 focus:ring-blue-500 accent-blue-600"
            />
            Compare
          </label>
          <Link
            href={`/vocational-technical-student-route/career/${p.id}`}
            className="inline-flex items-center text-[12px] font-semibold border border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg px-3.5 py-1.5 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── Sidebar widgets ───────────────────────────────────────────────── */

function MatchScoreCard({ score }: { score: number }) {
  const r = 56;
  const semi = Math.PI * r;
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2">Your Career Match Score</h3>
      <div className="relative w-full flex justify-center pt-2">
        <svg viewBox="0 0 140 80" className="w-44 h-24">
          <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="currentColor" className="text-gray-100 dark:text-white/10" strokeWidth="12" strokeLinecap="round" />
          <path
            d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="url(#cgrad)" strokeWidth="12" strokeLinecap="round"
            strokeDasharray={semi} strokeDashoffset={semi * (1 - score / 100)}
          />
          <defs>
            <linearGradient id="cgrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{score}%</span>
          <span className="text-[10px] font-semibold text-gray-400 dark:text-slate-500">Overall Match</span>
        </div>
      </div>
      <p className="text-[11px] text-gray-400 dark:text-slate-500 text-center mt-1 leading-snug">
        Based on your assessment, interests and skills.
      </p>
    </div>
  );
}

function NextSteps() {
  const steps = [
    { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-500', title: 'Explore top pathways', sub: 'Review and compare your matches', href: '#pathways' },
    { icon: <ClipboardCheck className="w-4 h-4" />, color: 'text-amber-500', title: 'Skill assessment', sub: 'Discover your strengths', href: '/vocational-technical-student-route/skill-assessment' },
    { icon: <Compass className="w-4 h-4" />, color: 'text-blue-500', title: 'Book a counseling session', sub: 'Get personalized guidance from your counselor', href: '/vocational-technical-student-route/counselors/book' },
    { icon: <BookOpen className="w-4 h-4" />, color: 'text-purple-500', title: 'Experience log', sub: 'Add experience to improve matches', href: '/vocational-technical-student-route/experience-log' },
  ];
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Recommended Next Steps</h3>
      <div className="space-y-1">
        {steps.map((s) => (
          <Link
            key={s.title}
            href={s.href}
            className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
          >
            <span className={`shrink-0 ${s.color}`}>{s.icon}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{s.title}</span>
              <span className="block text-[11px] text-gray-400 dark:text-slate-500 leading-snug">{s.sub}</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600 -rotate-90 group-hover:text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}

function PopularIndustries({ onPick }: { onPick: (i: string) => void }) {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Popular Industries</h3>
      <div className="flex flex-wrap gap-2">
        {INDUSTRIES.map((i) => (
          <button
            key={i}
            onClick={() => onPick(i)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/15 dark:hover:text-blue-400 transition-colors"
          >
            {i}
          </button>
        ))}
      </div>
      <button
        onClick={() => onPick('All Categories')}
        className="mt-3 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
      >
        Explore All Industries
      </button>
    </div>
  );
}

function NotSure() {
  return (
    <div className="rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0">
          <Headphones className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Not Sure Which Path?</h3>
      </div>
      <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-snug">
        Let our counselors help you find the right career pathways.
      </p>
      <Link
        href="/vocational-technical-student-route/counselors/book"
        className="mt-3 flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
      >
        Talk to a Counselor
      </Link>
    </div>
  );
}

/* ── Compare modal ─────────────────────────────────────────────────── */

function CompareModal({ items, onClose }: { items: Pathway[]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const rows: { label: string; key: keyof Pathway }[] = [
    { label: 'Match', key: 'match' },
    { label: 'Demand', key: 'demand' },
    { label: 'Category', key: 'category' },
    { label: 'Entry route', key: 'entry' },
    { label: 'Duration', key: 'duration' },
    { label: 'Salary', key: 'salary' },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Compare pathways"
        className="bg-white dark:bg-[#161a27] w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 dark:border-white/8 sticky top-0 bg-white dark:bg-[#161a27]">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Compare Pathways</h3>
          <button onClick={onClose} aria-label="Close" className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-slate-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 sm:p-5 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 pb-3 pr-3" />
                {items.map((p) => (
                  <th key={p.id} className="pb-3 px-3 min-w-[120px]">
                    <span className="block text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{p.title}</span>
                    <span className="block text-[11px] text-gray-400 dark:text-slate-500">({p.code})</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-gray-50 dark:border-white/5">
                  <td className="text-[12px] font-semibold text-gray-500 dark:text-slate-400 py-2.5 pr-3 whitespace-nowrap">{row.label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="text-[12px] text-slate-700 dark:text-slate-200 py-2.5 px-3">
                      {row.key === 'match' ? `${p.match}%` : String(p[row.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function CareerPathwayPage() {
  const { user, loading: authLoading } = useAuth();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [highMatch, setHighMatch] = useState(false);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [compare, setCompare] = useState<Set<string>>(new Set());
  const [showCompare, setShowCompare] = useState(false);
  const [score, setScore] = useState(85);

  useEffect(() => {
    if (authLoading) return;
    const uid = user?.id;
    if (!uid) return;
    let active = true;
    fetch(`/api/assessment/results?userId=${encodeURIComponent(uid)}`)
      .then((r) => r.json())
      .then((d) => {
        const fit = d?.results?.apprenticeshipFit;
        if (active && typeof fit === 'number') setScore(fit);
      })
      .catch(() => {});
    return () => { active = false; };
  }, [authLoading, user?.id]);

  const toggle = (set: Set<string>, id: string) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  };

  const filtered = useMemo(() => {
    let list = PATHWAYS.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchesQuery = !q
        || p.title.toLowerCase().includes(q)
        || p.code.toLowerCase().includes(q)
        || p.category.toLowerCase().includes(q)
        || p.description.toLowerCase().includes(q);
      const matchesCat = category === 'All Categories' || p.category === category;
      const matchesHigh = !highMatch || p.match >= 85;
      return matchesQuery && matchesCat && matchesHigh;
    });
    return [...list].sort((a, b) => b.match - a.match);
  }, [query, category, highMatch]);

  const compareItems = PATHWAYS.filter((p) => compare.has(p.id));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-5">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Career Pathways
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Explore and compare vocational career pathways that match your interests, skills and goals.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 self-start bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl shrink-0">
            <CalendarClock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            May 21, 2026
          </span>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pathways, trades or industries…"
              className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400"
            />
          </div>
          <div className="flex gap-2.5">
            <div className="relative flex-1 lg:flex-none">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full lg:w-auto appearance-none pl-3 pr-8 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <button
              onClick={() => setHighMatch((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                highMatch
                  ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400'
                  : 'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">High Match</span>
            </button>
            <button
              onClick={() => compare.size >= 2 && setShowCompare(true)}
              disabled={compare.size < 2}
              className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                compare.size >= 2
                  ? 'bg-blue-600 border-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/10 text-gray-400 dark:text-slate-500 cursor-not-allowed'
              }`}
            >
              <GitCompareArrows className="w-4 h-4" />
              Compare ({compare.size})
            </button>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 sm:gap-6 items-start">
          {/* Left */}
          <div id="pathways" className="min-w-0">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Top Career Pathway Matches</h2>
                <Info className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />
                <span className="ml-auto text-[12px] text-gray-400 dark:text-slate-500">{filtered.length} results</span>
              </div>

              {filtered.length > 0 ? (
                <div className="space-y-3">
                  {filtered.map((p) => (
                    <PathwayCard
                      key={p.id}
                      p={p}
                      saved={saved.has(p.id)}
                      onSave={() => setSaved((s) => toggle(s, p.id))}
                      selected={compare.has(p.id)}
                      onCompare={() => setCompare((s) => toggle(s, p.id))}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No pathways found</p>
                  <p className="text-[12px] text-gray-400 dark:text-slate-500 mt-1">Try adjusting your search or filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <MatchScoreCard score={score} />
            <NextSteps />
            <PopularIndustries onPick={(i) => setCategory(CATEGORIES.includes(i) ? i : 'All Categories')} />
            <NotSure />
          </div>
        </div>

      </div>

      {showCompare && compareItems.length >= 2 && (
        <CompareModal items={compareItems} onClose={() => setShowCompare(false)} />
      )}
    </div>
  );
}
