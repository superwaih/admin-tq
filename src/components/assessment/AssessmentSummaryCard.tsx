'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Loader2, ClipboardList, ArrowRight, RefreshCw, GraduationCap, Compass, Sparkles, Target,
  TrendingUp, AlertTriangle, Route,
} from 'lucide-react';
import type { AssessmentResults } from '@/src/types/assessment';

interface Props {
  userId: string;
  showRetake?: boolean;
  className?: string;
}

export default function AssessmentSummaryCard({ userId, showRetake = true, className = '' }: Props) {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [completedAt, setCompletedAt] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetch(`/api/assessment/results?userId=${encodeURIComponent(userId)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        setResults(d?.results ?? null);
        setCompletedAt(d?.completedAt ?? null);
      })
      .catch(() => { if (active) setResults(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [userId]);

  const wrap = `bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 ${className}`;

  if (loading) {
    return (
      <div className={wrap}>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className={wrap}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <ClipboardList size={16} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Potential Assessment</h3>
            <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-0.5">
              This student hasn&apos;t completed the potential assessment yet.
            </p>
            {showRetake && (
              <Link
                href="/assessment"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
              >
                Start assessment <ArrowRight size={13} />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  const date = completedAt ? new Date(completedAt).toLocaleDateString() : null;
  const stats = [
    { icon: <GraduationCap size={14} />, label: 'Academic Strength', value: results.academicStrength },
    { icon: <Sparkles size={14} />, label: 'Top Interest Area', value: results.topInterestArea },
    { icon: <Target size={14} />, label: 'Strongest Skills', value: results.strongestSkills },
    { icon: <Compass size={14} />, label: 'Career Direction', value: results.careerDirection },
  ];

  return (
    <div className={wrap}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {results.initials}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{results.studentName}</h3>
            <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{results.gradeProvince}</p>
          </div>
        </div>
        {date && <span className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad]">Completed {date}</span>}
      </div>

      {/* Pathway fit */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
          <span className="text-blue-600">College &amp; University · {results.collegeUniversityFit}%</span>
          <span className="text-emerald-600">Trades · {results.apprenticeshipFit}%</span>
        </div>
        <div className="flex h-2.5 rounded-full overflow-hidden bg-gray-100">
          <div className="bg-blue-600 h-full" style={{ width: `${results.collegeUniversityFit}%` }} />
          <div className="bg-emerald-500 h-full" style={{ width: `${results.apprenticeshipFit}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <div className="flex items-center gap-1.5 text-slate-400 dark:text-[#8e92ad] mb-1">
              {s.icon}<span className="text-[10px] font-bold uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xs font-bold text-slate-800 dark:text-white leading-snug">{s.value || '—'}</p>
          </div>
        ))}
      </div>

      {/* Recommended pathway */}
      <div className="flex items-center gap-2 mt-4 rounded-xl bg-blue-50 border border-blue-100 p-3">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
          <Route size={15} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Recommended Pathway</p>
          <p className="text-xs font-bold text-slate-800 dark:text-white">{results.recommendedPathway || '—'}</p>
        </div>
      </div>

      {/* Strengths & challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-3">
          <div className="flex items-center gap-1.5 text-emerald-600 mb-1.5">
            <TrendingUp size={13} /><span className="text-[10px] font-bold uppercase tracking-wider">Strengths</span>
          </div>
          <ul className="space-y-1">
            {(results.strengths ?? []).map((s, i) => (
              <li key={i} className="text-[11px] text-slate-700 dark:text-[#c8ccdf] leading-snug">• {s}</li>
            ))}
            {!(results.strengths ?? []).length && <li className="text-[11px] text-slate-400">—</li>}
          </ul>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
          <div className="flex items-center gap-1.5 text-amber-600 mb-1.5">
            <AlertTriangle size={13} /><span className="text-[10px] font-bold uppercase tracking-wider">Areas to Develop</span>
          </div>
          <ul className="space-y-1">
            {(results.challenges ?? []).map((c, i) => (
              <li key={i} className="text-[11px] text-slate-700 dark:text-[#c8ccdf] leading-snug">• {c}</li>
            ))}
            {!(results.challenges ?? []).length && <li className="text-[11px] text-slate-400">—</li>}
          </ul>
        </div>
      </div>

      {/* Profile summary */}
      <div className="mt-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#8e92ad] mb-1">Profile Summary</p>
        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-relaxed">{results.profileSummary || results.summary}</p>
      </div>

      {showRetake && (
        <div className="flex items-center gap-2 mt-4">
          <Link
            href="/assessment?retake=1"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-50 text-xs font-bold transition-colors"
          >
            <RefreshCw size={13} /> Retake assessment
          </Link>
        </div>
      )}
    </div>
  );
}
