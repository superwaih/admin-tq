'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import {
  GraduationCap, Wrench, ArrowRight, Sparkles, CheckCircle2, Loader2,
} from 'lucide-react';
import type { AssessmentResults } from '@/src/types/assessment';

type Pathway = 'uni-college' | 'vocational';

interface PathwayCard {
  key: Pathway;
  href: string;
  title: string;
  tagline: string;
  Icon: React.ElementType;
  points: string[];
}

const CARDS: PathwayCard[] = [
  {
    key: 'uni-college',
    href: '/university-college-student-route',
    title: 'University / College',
    tagline: 'Degree & diploma admissions',
    Icon: GraduationCap,
    points: ['Program matching & admission odds', 'Essay & AIF coaching', 'MMI interview prep'],
  },
  {
    key: 'vocational',
    href: '/vocational-technical-student-route',
    title: 'Vocational / Technical',
    tagline: 'Apprenticeships & skilled trades',
    Icon: Wrench,
    points: ['Apprenticeship milestones', 'Career & certification pathway', 'Wage & outlook insights'],
  },
];

export default function PathwayChooserPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [recommended, setRecommended] = useState<Pathway | null>(null);
  // `gateChecked` stays false until we have confirmed the assessment is complete.
  // Until then we render only a blocking loader — never the actionable chooser —
  // so the cards can't flash before completion is verified.
  const [gateChecked, setGateChecked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    const uid = user?.id;
    // The chooser is only meaningful after the assessment is finished.
    // Without a user we cannot verify completion, so send them to take it.
    if (!uid) { router.replace('/assessment'); return; }
    let active = true;
    fetch(`/api/assessment/status?userId=${encodeURIComponent(uid)}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((s) => {
        if (!active) return;
        // Gate: must complete the assessment before choosing a pathway.
        if (!s?.completed) { router.replace('/assessment'); return; }
        setGateChecked(true);
        // Recommendation is best-effort: a failure here must NOT invalidate the
        // already-verified completion. Degrade to the chooser without a highlight.
        fetch(`/api/assessment/results?userId=${encodeURIComponent(uid)}`)
          .then((r) => r.json())
          .then((d) => {
            if (!active) return;
            const results: AssessmentResults | null = d?.results ?? null;
            if (results) {
              const isTrade =
                /apprentice/i.test(results.recommendedPathway || '') ||
                (results.apprenticeshipFit ?? 0) >= 55;
              setRecommended(isTrade ? 'vocational' : 'uni-college');
            }
            setLoading(false);
          })
          .catch(() => { if (active) setLoading(false); });
      })
      // Fail closed: only when completion itself can't be verified, send them
      // back to the assessment.
      .catch(() => { if (active) router.replace('/assessment'); });
    return () => { active = false; };
  }, [authLoading, user?.id, router]);

  // Block the chooser entirely until completion is verified.
  if (!gateChecked) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 text-[11px] font-bold px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Assessment complete
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Choose your pathway
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
            {loading
              ? 'Loading your personalised recommendation…'
              : recommended
                ? 'We\u2019ve highlighted the pathway that best matches your results. You can choose either — it\u2019s your call.'
                : 'Pick the dashboard that fits your goals. You can explore both.'}
          </p>
        </div>

        {/* ── Pathway cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {CARDS.map((c) => {
            const isRecommended = recommended === c.key;
            return (
              <Link
                key={c.key}
                href={c.href}
                className={`group relative flex flex-col rounded-2xl border-2 bg-white dark:bg-[#161a27] p-6 transition-all hover:-translate-y-1 hover:shadow-lg ${
                  isRecommended
                    ? 'border-blue-500 dark:border-blue-400 shadow-md'
                    : 'border-gray-100 dark:border-white/8 hover:border-blue-200 dark:hover:border-blue-500/30'
                }`}
              >
                {isRecommended && (
                  <span className="absolute -top-3 left-6 inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                    <Sparkles className="w-3 h-3" /> Recommended for you
                  </span>
                )}

                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  isRecommended
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                    : 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                }`}>
                  <c.Icon className="w-6 h-6" />
                </div>

                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">{c.title}</h2>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{c.tagline}</p>

                <ul className="mt-4 space-y-2 flex-1">
                  {c.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-slate-600 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>

                <div className={`mt-5 inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-semibold transition-colors ${
                  isRecommended
                    ? 'bg-blue-600 group-hover:bg-blue-700 text-white'
                    : 'bg-slate-100 dark:bg-white/8 text-slate-700 dark:text-slate-200 group-hover:bg-slate-200 dark:group-hover:bg-white/12'
                }`}>
                  Enter dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-slate-500 mt-6">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Personalising your recommendation
          </div>
        )}
      </div>
    </div>
  );
}
