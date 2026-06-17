'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Search, FileText, Building2, GraduationCap, Clock,
  ChevronRight, Sparkles, BookOpen, PenLine, Star, ListChecks, X,
} from 'lucide-react';

const card = 'bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm';

type EssayType = 'AIF' | 'Personal Profile' | 'Supplementary' | 'Statement of Intent' | 'Scholarship';

interface Template {
  id: number;
  title: string;
  university: string;
  program: string;
  type: EssayType;
  wordLimit: string;
  timeEst: string;
  prompt: string;
  tips: string[];
  structure: string[];
}

const TYPE_STYLE: Record<EssayType, string> = {
  'AIF': 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15',
  'Personal Profile': 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-500/15',
  'Supplementary': 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15',
  'Statement of Intent': 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15',
  'Scholarship': 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15',
};

const TEMPLATES: Template[] = [
  {
    id: 1,
    title: 'UofT Engineering — Applicant Information Form',
    university: 'University of Toronto',
    program: 'Engineering',
    type: 'AIF',
    wordLimit: '~250 words / question',
    timeEst: '60–90 min',
    prompt: 'Describe an extracurricular, leadership, or work experience and what it taught you about engineering, teamwork, and resilience.',
    tips: [
      'Lead with a specific moment, not a list of titles.',
      'Tie every experience back to an engineering mindset.',
      'Quantify your impact wherever possible.',
    ],
    structure: ['Hook / situation', 'Your specific role & action', 'Challenge you overcame', 'What it taught you', 'Why UofT Engineering'],
  },
  {
    id: 2,
    title: 'Waterloo — Admission Information Form',
    university: 'University of Waterloo',
    program: 'Math / Engineering / CS',
    type: 'AIF',
    wordLimit: '~900 chars / question',
    timeEst: '45–75 min',
    prompt: 'Why are you interested in this program at Waterloo, and what experiences have prepared you for it?',
    tips: [
      'Reference co-op and hands-on building explicitly.',
      'Show genuine knowledge of the program structure.',
      'Be concise — character limits are tight.',
    ],
    structure: ['Motivation for the field', 'Relevant projects / activities', 'Fit with Waterloo co-op', 'Future goals'],
  },
  {
    id: 3,
    title: 'UBC — Personal Profile',
    university: 'University of British Columbia',
    program: 'All undergraduate programs',
    type: 'Personal Profile',
    wordLimit: '200–250 words / question',
    timeEst: '90–120 min',
    prompt: 'Tell us about who you are. Describe what you have learned through your most meaningful achievements and challenges.',
    tips: [
      'Show character and values, not just accomplishments.',
      'Use authentic, reflective storytelling.',
      'Answer the question actually asked — stay on prompt.',
    ],
    structure: ['Context', 'Action you took', 'Reflection & growth', 'Connection to your values'],
  },
  {
    id: 4,
    title: 'McMaster Health Sciences — Supplementary Application',
    university: 'McMaster University',
    program: 'Health Sciences (BHSc)',
    type: 'Supplementary',
    wordLimit: '~100 words / response',
    timeEst: '2–3 hrs',
    prompt: 'Respond to scenario-based and reflective prompts that reveal your critical thinking, empathy, and self-awareness.',
    tips: [
      'Embrace nuance — there is rarely one right answer.',
      'Reflect honestly; admissions values authenticity.',
      'Practice answering open-ended, abstract prompts.',
    ],
    structure: ['Interpret the prompt', 'Take a thoughtful position', 'Acknowledge other perspectives', 'Tie to your growth'],
  },
  {
    id: 5,
    title: 'Western (Ivey AEO) — Supplementary Essay',
    university: 'Western University',
    program: 'Business (Ivey AEO)',
    type: 'Supplementary',
    wordLimit: '300–500 words',
    timeEst: '60–90 min',
    prompt: 'Describe a leadership experience and the impact you had on the people and outcome around you.',
    tips: [
      'Focus on influence, not authority.',
      'Show measurable results and team impact.',
      'Connect leadership style to business school fit.',
    ],
    structure: ['Situation', 'Leadership challenge', 'Actions & decisions', 'Outcome & reflection'],
  },
  {
    id: 6,
    title: "Queen's — Personal Statement of Experience",
    university: "Queen's University",
    program: 'Commerce / Arts & Science',
    type: 'Supplementary',
    wordLimit: '~300 words',
    timeEst: '45–60 min',
    prompt: 'Describe a personal experience that shaped your perspective and how it will contribute to the Queen\u2019s community.',
    tips: [
      'Be specific about the community contribution.',
      'Avoid clichés — make the story uniquely yours.',
      'End with forward-looking intent.',
    ],
    structure: ['The experience', 'What changed in you', 'Contribution to campus', 'Why Queen\u2019s'],
  },
  {
    id: 7,
    title: 'McGill — Statement of Intent',
    university: 'McGill University',
    program: 'Selected programs',
    type: 'Statement of Intent',
    wordLimit: '500 words',
    timeEst: '90 min',
    prompt: 'Explain your academic interest in the program, your relevant background, and your goals.',
    tips: [
      'Be academically focused and articulate.',
      'Demonstrate research or subject curiosity.',
      'Keep tone professional and precise.',
    ],
    structure: ['Academic interest', 'Preparation & background', 'Goals', 'Program fit'],
  },
  {
    id: 8,
    title: 'TMU (Toronto Metropolitan) — Supplementary Form',
    university: 'Toronto Metropolitan University',
    program: 'Media / Design / Nursing',
    type: 'Supplementary',
    wordLimit: '200–300 words',
    timeEst: '45–60 min',
    prompt: 'Why have you chosen this program, and what relevant skills, experiences, or portfolio work do you bring?',
    tips: [
      'Tailor to the program\u2019s practical, career focus.',
      'Reference any portfolio or hands-on work.',
      'Be concrete about your motivation.',
    ],
    structure: ['Program motivation', 'Relevant skills', 'Experiences / portfolio', 'Career direction'],
  },
  {
    id: 9,
    title: 'TD / Schulich Leader — Scholarship Essay',
    university: 'National Scholarships',
    program: 'Leadership & Community',
    type: 'Scholarship',
    wordLimit: '500–600 words',
    timeEst: '2 hrs',
    prompt: 'Describe your community leadership and the lasting change you created for others.',
    tips: [
      'Center the people you served, not awards.',
      'Show initiative and sustained commitment.',
      'Make the impact tangible and measurable.',
    ],
    structure: ['The need you saw', 'What you initiated', 'Obstacles & persistence', 'Impact & legacy'],
  },
];

const TYPE_FILTERS: ('All' | EssayType)[] = ['All', 'AIF', 'Personal Profile', 'Supplementary', 'Statement of Intent', 'Scholarship'];

export default function EssayTemplatesPage() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | EssayType>('All');
  const [active, setActive] = useState<Template | null>(null);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActive(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [active]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      const matchesType = filter === 'All' || t.type === filter;
      const matchesQuery =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.university.toLowerCase().includes(q) ||
        t.program.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q);
      return matchesType && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">

        {/* Back */}
        <Link
          href="/university-college-student-route/essay"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Essay Coach
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Essay Templates</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Current application essay templates required by Canadian universities &amp; colleges — practice with them and use them as a writing guide.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className={`${card} px-4 py-2.5 flex items-center gap-2`}>
              <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center">
                <FileText className="w-4 h-4" />
              </span>
              <div>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-tight">Templates</p>
                <p className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">{TEMPLATES.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search + filters */}
        <div className={`${card} p-3 sm:p-4 flex flex-col lg:flex-row lg:items-center gap-3`}>
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by university, program, or essay type…"
              className="w-full h-10 pl-9 pr-3 rounded-xl text-[13px] bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 dark:focus:border-blue-500/40 placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`shrink-0 px-3 h-9 rounded-xl text-[12px] font-semibold transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Template grid */}
        {filtered.length === 0 ? (
          <div className={`${card} p-12 flex flex-col items-center text-center`}>
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/8 grid place-items-center mb-3">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">No templates found</p>
            <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1">Try a different search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((t) => (
              <div key={t.id} className={`${card} p-5 flex flex-col`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${TYPE_STYLE[t.type]}`}>{t.type}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" /> {t.timeEst}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{t.title}</h3>

                <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1 min-w-0">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.university}</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1 min-w-0">
                    <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{t.program}</span>
                  </span>
                </div>

                <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed mt-3 line-clamp-3">
                  {t.prompt}
                </p>

                <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  <PenLine className="w-3.5 h-3.5 text-blue-500" /> {t.wordLimit}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-white/6">
                  <button
                    onClick={() => setActive(t)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl text-[12px] font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Preview
                  </button>
                  <Link
                    href="/university-college-student-route/essay/new"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl text-[12px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-colors"
                  >
                    Use Template <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4"
          onClick={() => setActive(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${active.title} template preview`}
            className="bg-white dark:bg-[#161a27] w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-slate-100 dark:border-white/8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="sticky top-0 bg-white dark:bg-[#161a27] px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-white/6 flex items-start justify-between gap-3 z-10">
              <div className="min-w-0">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${TYPE_STYLE[active.type]}`}>{active.type}</span>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mt-2 leading-snug">{active.title}</h2>
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {active.university}</span>
                  <span className="text-slate-300 dark:text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> {active.program}</span>
                </div>
              </div>
              <button
                onClick={() => setActive(null)}
                aria-label="Close preview"
                className="shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="px-5 sm:px-6 py-5 space-y-5">
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg px-3 py-1.5">
                  <PenLine className="w-3.5 h-3.5 text-blue-500" /> {active.wordLimit}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg px-3 py-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> {active.timeEst}
                </span>
              </div>

              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2">Prompt</h3>
                <p className="text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-4">
                  {active.prompt}
                </p>
              </div>

              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <ListChecks className="w-3.5 h-3.5" /> Suggested Structure
                </h3>
                <ol className="space-y-2">
                  {active.structure.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-[13px] text-slate-700 dark:text-slate-200">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="text-[12px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5" /> Pro Tips
                </h3>
                <ul className="space-y-2">
                  {active.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0 mt-0.5" />
                      <span className="text-[13px] text-slate-700 dark:text-slate-200">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 bg-white dark:bg-[#161a27] px-5 sm:px-6 py-4 border-t border-slate-100 dark:border-white/6 flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button
                onClick={() => setActive(null)}
                className="inline-flex items-center justify-center h-10 px-5 rounded-xl text-[13px] font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
              >
                Close
              </button>
              <Link
                href="/university-college-student-route/essay/new"
                className="inline-flex items-center justify-center gap-1.5 h-10 px-5 rounded-xl text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-colors"
              >
                Use This Template <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
