'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft, Star, GitCompareArrows, CheckCircle2, ChevronRight,
  TrendingUp, Hammer, DollarSign, Award, MapPin, Clock, GraduationCap,
  Compass, CalendarClock, ClipboardCheck, Building2, BarChart3,
} from 'lucide-react';
import { getPathway, type Pathway } from '../pathways';

const TABS = ['Overview', 'Program & Training', 'Skills & Competencies', 'Job Outlook', 'Related Careers'] as const;
type Tab = (typeof TABS)[number];

const HIGHLIGHTS = [
  { icon: TrendingUp, label: 'Strong Career Demand', tint: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' },
  { icon: Hammer, label: 'Hands-on Work', tint: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15' },
  { icon: DollarSign, label: 'Good Earning Potential', tint: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' },
  { icon: Award, label: 'Opportunities for Advancement', tint: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15' },
];

const card = 'bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm';

/* ── Overview tab ──────────────────────────────────────────────────── */
function OverviewTab({ p }: { p: Pathway }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* About */}
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">About This Pathway</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 sm:gap-5 mt-3 items-start">
          <div>
            <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed">{p.about}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {HIGHLIGHTS.map((h) => (
                <div key={h.label} className="flex flex-col items-center text-center gap-2">
                  <span className={`w-10 h-10 rounded-xl grid place-items-center ${h.tint}`}>
                    <h.icon className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">{h.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full h-44 lg:h-full lg:min-h-[180px] rounded-xl overflow-hidden">
            <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
            <span className="absolute bottom-2 left-2 text-[11px] font-bold text-white bg-emerald-500/90 px-2 py-0.5 rounded-md">
              {p.match}% Match
            </span>
          </div>
        </div>
      </div>

      {/* What you'll do + Work environments */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className={`${card} p-4 sm:p-5`}>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">What You&apos;ll Do</h2>
          <ul className="space-y-2.5">
            {p.whatYoullDo.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-gray-600 dark:text-slate-300 leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${card} p-4 sm:p-5`}>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Work Environments</h2>
          <ul className="space-y-2.5">
            {p.workEnvironments.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0" />
                <span className="text-[13px] text-gray-600 dark:text-slate-300">{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Top training programs */}
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Top Training Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.trainingPrograms.map((tp) => (
            <ProgramCard key={tp.program} tp={tp} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ tp }: { tp: Pathway['trainingPrograms'][number] }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
          <GraduationCap className="w-4 h-4" />
        </span>
        <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500 truncate">{tp.college}</span>
      </div>
      <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-2 leading-snug">{tp.program}</h3>
      <div className="flex flex-wrap gap-1.5 mt-2">
        {tp.badges.map((b) => (
          <span key={b} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">{b}</span>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[11px] text-gray-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tp.duration}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{tp.location}</span>
      </div>
    </div>
  );
}

/* ── Program & Training tab ────────────────────────────────────────── */
function ProgramTab({ p }: { p: Pathway }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Path to Certification</h2>
        <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed mt-2">
          Most students enter this pathway through an {p.entry.toLowerCase()} that combines paid on-the-job training
          with in-class learning. The typical duration is {p.duration.toLowerCase()} before full certification.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { n: '1', t: 'Enroll', d: `Apply to an approved ${p.entry.toLowerCase()} or college program.` },
            { n: '2', t: 'Train', d: 'Build skills through hands-on work terms and classroom blocks.' },
            { n: '3', t: 'Certify', d: 'Complete required hours and exams to earn your credential.' },
          ].map((s) => (
            <div key={s.n} className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white text-[13px] font-bold grid place-items-center">{s.n}</span>
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-2.5">{s.t}</h3>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1 leading-snug">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Recommended Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.trainingPrograms.map((tp) => <ProgramCard key={tp.program} tp={tp} />)}
        </div>
      </div>
    </div>
  );
}

/* ── Skills & Competencies tab ─────────────────────────────────────── */
function SkillsTab({ p }: { p: Pathway }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4">Key Skills</h2>
        <div className="space-y-3.5">
          {p.skills.map((s) => (
            <div key={s.name}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                <span className="text-[12px] font-semibold text-blue-600 dark:text-blue-400">{s.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/8 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500" style={{ width: `${s.level}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Core Competencies</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {p.competencies.map((c) => (
            <div key={c} className="flex items-center gap-2 rounded-xl border border-gray-100 dark:border-white/8 px-3 py-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[13px] text-gray-600 dark:text-slate-300">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Job Outlook tab ───────────────────────────────────────────────── */
function OutlookTab({ p }: { p: Pathway }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: TrendingUp, label: 'Projected Growth', value: p.outlook.growth, tint: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' },
          { icon: BarChart3, label: 'Annual Openings', value: p.outlook.openings, tint: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' },
          { icon: DollarSign, label: 'Avg. Salary', value: p.salary, tint: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15' },
        ].map((s) => (
          <div key={s.label} className={`${card} p-4 flex items-center gap-3`}>
            <span className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${s.tint}`}>
              <s.icon className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{s.value}</p>
              <p className="text-[12px] text-gray-500 dark:text-slate-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Market Outlook</h2>
        <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed mt-2">{p.outlook.summary}</p>
        <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-4 mb-2">Key Trends</h3>
        <ul className="space-y-2.5">
          {p.outlook.trends.map((t) => (
            <li key={t} className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[13px] text-gray-600 dark:text-slate-300 leading-snug">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ── Related Careers tab ───────────────────────────────────────────── */
function RelatedTab({ p }: { p: Pathway }) {
  return (
    <div className={`${card} p-4 sm:p-5`}>
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Related Careers</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {p.relatedCareers.map((rc) => {
          const inner = (
            <>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-snug">{rc.title}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shrink-0">
                  {rc.match}%
                </span>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-1">Code {rc.code}</p>
              {rc.id && (
                <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 mt-2">
                  View details <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </>
          );
          return rc.id ? (
            <Link
              key={rc.title}
              href={`/vocational-technical-student-route/career/${rc.id}`}
              className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all"
            >
              {inner}
            </Link>
          ) : (
            <div key={rc.title} className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function PathwayDetailPage() {
  const params = useParams();
  const id = Array.isArray(params.pathwayId) ? params.pathwayId[0] : params.pathwayId;
  const p = id ? getPathway(id) : undefined;

  const [tab, setTab] = useState<Tab>('Overview');
  const [saved, setSaved] = useState(false);

  if (!p) return notFound();

  const demandStyle = p.demand === 'High Demand'
    ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
    : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300';

  const stats = [
    { label: p.entry, sub: 'Entry Path' },
    { label: p.duration, sub: 'Duration' },
    { label: p.salary, sub: 'Avg. Salary' },
    { label: `${p.match}%`, sub: 'Your Match Score' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-5">

        {/* Back */}
        <Link
          href="/vocational-technical-student-route/career"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Career Pathways
        </Link>

        {/* Header */}
        <div className={`${card} p-4 sm:p-5`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {p.title} ({p.code})
                </h1>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${demandStyle}`}>{p.demand}</span>
              </div>
              <p className="text-[13px] text-gray-600 dark:text-slate-400 mt-1.5 leading-snug max-w-2xl">{p.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSaved((v) => !v)}
                className={`inline-flex items-center gap-1.5 text-[12px] font-semibold rounded-lg px-3 py-2 border transition-colors ${
                  saved
                    ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-200 dark:border-amber-500/30 text-amber-700 dark:text-amber-300'
                    : 'border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                }`}
              >
                <Star className={`w-4 h-4 ${saved ? 'fill-amber-400 text-amber-400' : ''}`} />
                {saved ? 'Saved' : 'Save Pathway'}
              </button>
              <Link
                href="/vocational-technical-student-route/career"
                className="inline-flex items-center gap-1.5 text-[12px] font-semibold rounded-lg px-3 py-2 border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <GitCompareArrows className="w-4 h-4" /> Compare
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {stats.map((s) => (
              <div key={s.sub} className="rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-2.5">
                <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{s.label}</p>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-white/10 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-3.5 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors ${
                  tab === t
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {t}
                {tab === t && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 sm:gap-6 items-start">
          {/* Left content */}
          <div className="min-w-0">
            {tab === 'Overview' && <OverviewTab p={p} />}
            {tab === 'Program & Training' && <ProgramTab p={p} />}
            {tab === 'Skills & Competencies' && <SkillsTab p={p} />}
            {tab === 'Job Outlook' && <OutlookTab p={p} />}
            {tab === 'Related Careers' && <RelatedTab p={p} />}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Earning potential */}
            <div className={`${card} p-4 sm:p-5`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Earning Potential</h3>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-2">Average Salary Range</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{p.salary}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Based on experience and location</p>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 dark:border-white/8">
                {[
                  { t: 'Entry-Level', v: p.salaryEntry },
                  { t: 'Mid-Career', v: p.salaryMid },
                  { t: 'Experienced', v: p.salaryExp },
                ].map((s) => (
                  <div key={s.t}>
                    <p className="text-[10px] uppercase tracking-wide text-gray-400 dark:text-slate-500">{s.t}</p>
                    <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 mt-0.5">{s.v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className={`${card} p-4 sm:p-5`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Next Steps</h3>
              <div className="space-y-2">
                {[
                  { icon: Compass, title: 'Explore training programs', sub: 'Review and compare your matches', href: '/vocational-technical-student-route/strategy' },
                  { icon: CalendarClock, title: 'Book a career counselling session', sub: 'Get personalised guidance from your counsellor', href: '/vocational-technical-student-route/counselors/book' },
                  { icon: Star, title: 'Add to my pathway list', sub: 'Save for future reference', href: '/vocational-technical-student-route/career' },
                ].map((s) => (
                  <Link
                    key={s.title}
                    href={s.href}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/8 p-2.5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all"
                  >
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
                      <s.icon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-semibold text-slate-800 dark:text-slate-200 leading-snug">{s.title}</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 leading-snug">{s.sub}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600 shrink-0" />
                  </Link>
                ))}
              </div>
              <Link
                href="/vocational-technical-student-route/skill-assessment"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl px-4 py-2.5 transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" /> Take Skills Assessment
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
