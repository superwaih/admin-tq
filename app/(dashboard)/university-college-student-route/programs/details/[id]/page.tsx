'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { notFound, useParams } from 'next/navigation';
import {
  ArrowLeft, Star, GitCompareArrows, CheckCircle2, ChevronRight,
  TrendingUp, DollarSign, Award, MapPin, GraduationCap, Building2,
  BookOpen, ClipboardCheck, CalendarClock, Compass, Briefcase,
  CalendarDays, BarChart3, Wallet,
} from 'lucide-react';
import { getProgramDetail, type ProgramDetail } from '../../programs-data';

const TABS = ['Overview', 'Curriculum', 'Admission Requirements', 'Career Outcomes', 'Similar Programs'] as const;
type Tab = (typeof TABS)[number];

const card = 'bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm';

function matchPill(m: number): string {
  if (m >= 80) return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300';
  if (m >= 60) return 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300';
  return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300';
}

const HIGHLIGHT_TINTS = [
  'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15',
  'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15',
  'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15',
  'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15',
];
const HIGHLIGHT_ICONS = [TrendingUp, BookOpen, Briefcase, Award];

/* ── Overview tab ──────────────────────────────────────────────────── */
function OverviewTab({ p }: { p: ProgramDetail }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      {/* About */}
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">About This Program</h2>
        <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed mt-3">{p.about}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {p.highlights.map((h, i) => {
            const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length];
            return (
              <div key={h.label} className="flex flex-col items-center text-center gap-2">
                <span className={`w-10 h-10 rounded-xl grid place-items-center ${HIGHLIGHT_TINTS[i % HIGHLIGHT_TINTS.length]}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 leading-tight">{h.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* What you'll study + Key facts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <div className={`${card} p-4 sm:p-5`}>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">What You&apos;ll Study</h2>
          <ul className="space-y-2.5">
            {p.whatYoullStudy.map((t) => (
              <li key={t} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[13px] text-gray-600 dark:text-slate-300 leading-snug">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className={`${card} p-4 sm:p-5`}>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Key Facts</h2>
          <div className="space-y-3">
            {[
              { icon: GraduationCap, label: 'Degree', value: p.degree },
              { icon: CalendarDays, label: 'Intake', value: p.intake },
              { icon: ClipboardCheck, label: 'Application Deadline', value: p.deadline },
              { icon: MapPin, label: 'Location', value: p.country },
              { icon: Wallet, label: 'Annual Tuition', value: p.tuition },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-300 grid place-items-center shrink-0">
                  <f.icon className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                  <span className="text-[12px] text-gray-500 dark:text-slate-400">{f.label}</span>
                  <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 text-right">{f.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar programs */}
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Similar Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.similar.slice(0, 3).map((sp) => <SimilarCard key={sp.id} sp={sp} />)}
        </div>
      </div>
    </div>
  );
}

function SimilarCard({ sp }: { sp: ProgramDetail['similar'][number] }) {
  return (
    <Link
      href={`/university-college-student-route/programs/details/${sp.id}`}
      className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:shadow-md transition-all block"
    >
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
          <Building2 className="w-4 h-4" />
        </span>
        <span className="text-[11px] font-medium text-gray-400 dark:text-slate-500 truncate">{sp.university}</span>
      </div>
      <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-2 leading-snug">{sp.program}</h3>
      <div className="flex items-center justify-between mt-3">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${matchPill(sp.match)}`}>{sp.match}% Match</span>
        <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
          View <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

/* ── Curriculum tab ────────────────────────────────────────────────── */
function CurriculumTab({ p }: { p: ProgramDetail }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Program Structure</h2>
        <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed mt-2">
          The {p.program} blends core coursework with electives and a research or capstone component. Most students
          complete the program over three to four full-time terms beginning in {p.intake}.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { n: '1', t: 'Foundations', d: 'Build core knowledge through required graduate coursework.' },
            { n: '2', t: 'Specialise', d: 'Choose electives aligned with your interests and goals.' },
            { n: '3', t: 'Apply', d: 'Complete a capstone project or research thesis.' },
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
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Core Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {p.coreCourses.map((c, i) => (
            <div key={c} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-white/8 px-3 py-2.5">
              <span className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 grid place-items-center shrink-0 text-[12px] font-bold">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-[13px] font-medium text-slate-700 dark:text-slate-200">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Admission Requirements tab ────────────────────────────────────── */
function RequirementsTab({ p }: { p: ProgramDetail }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Admission Requirements</h2>
        <ul className="space-y-2.5">
          {p.requirements.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
              <span className="text-[13px] text-gray-600 dark:text-slate-300 leading-snug">{r}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">Key Dates</h2>
        <p className="text-[12px] text-gray-500 dark:text-slate-400 mb-3">Plan ahead so you don&apos;t miss a deadline.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5 flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 grid place-items-center shrink-0">
              <CalendarClock className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Application Deadline</p>
              <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{p.deadline}</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5 flex items-center gap-3">
            <span className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 grid place-items-center shrink-0">
              <CalendarDays className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">Program Intake</p>
              <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100">{p.intake}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Career Outcomes tab ───────────────────────────────────────────── */
function OutcomesTab({ p }: { p: ProgramDetail }) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {[
          { icon: TrendingUp, label: 'Projected Growth', value: p.outlook.growth, tint: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' },
          { icon: BarChart3, label: 'Employer Demand', value: p.outlook.demand, tint: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' },
          { icon: DollarSign, label: 'Top Salary', value: p.careerOutcomes[0]?.salary.split('–')[1]?.trim() || '—', tint: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15' },
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
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Common Career Paths</h2>
        <div className="space-y-2.5">
          {p.careerOutcomes.map((c) => (
            <div key={c.title} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 dark:border-white/8 px-3.5 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
                  <Briefcase className="w-4 h-4" />
                </span>
                <span className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">{c.title}</span>
              </div>
              <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{c.salary}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={`${card} p-4 sm:p-5`}>
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Market Outlook</h2>
        <p className="text-[13px] text-gray-600 dark:text-slate-400 leading-relaxed mt-2">{p.outlook.summary}</p>
      </div>
    </div>
  );
}

/* ── Similar Programs tab ──────────────────────────────────────────── */
function SimilarTab({ p }: { p: ProgramDetail }) {
  return (
    <div className={`${card} p-4 sm:p-5`}>
      <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">Similar Programs</h2>
      {p.similar.length === 0 ? (
        <p className="text-[13px] text-gray-500 dark:text-slate-400">No similar programs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {p.similar.map((sp) => <SimilarCard key={sp.id} sp={sp} />)}
        </div>
      )}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function ProgramDetailPage() {
  const params = useParams();
  const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  const id = raw ? parseInt(raw, 10) : NaN;
  const p = Number.isNaN(id) ? undefined : getProgramDetail(id);

  const [tab, setTab] = useState<Tab>('Overview');
  const [saved, setSaved] = useState(false);

  if (!p) return notFound();

  const stats = [
    { label: p.degree, sub: 'Degree' },
    { label: p.intake, sub: 'Intake' },
    { label: p.deadline, sub: 'Deadline' },
    { label: `${p.match}%`, sub: 'Your Match Score' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4 sm:space-y-5">

        {/* Back */}
        <Link
          href="/university-college-student-route/programs/new"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Add New Program
        </Link>

        {/* Header */}
        <div className={`${card} p-4 sm:p-5`}>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  {p.program}
                </h1>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${matchPill(p.match)}`}>{p.match}% Match</span>
              </div>
              <p className="text-[13px] text-gray-600 dark:text-slate-400 mt-1.5 leading-snug flex items-center gap-1.5">
                <span className="text-sm">🇨🇦</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{p.university}</span>
                <span className="text-gray-400 dark:text-slate-500">· {p.country}</span>
              </p>
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
                {saved ? 'Saved' : 'Save Program'}
              </button>
              <Link
                href="/university-college-student-route/programs/new"
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
                <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate">{s.label}</p>
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
            {tab === 'Curriculum' && <CurriculumTab p={p} />}
            {tab === 'Admission Requirements' && <RequirementsTab p={p} />}
            {tab === 'Career Outcomes' && <OutcomesTab p={p} />}
            {tab === 'Similar Programs' && <SimilarTab p={p} />}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Tuition & costs */}
            <div className={`${card} p-4 sm:p-5`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tuition &amp; Costs</h3>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-2">Estimated Annual Tuition</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{p.costs.tuitionAnnual}</p>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">Per year, before living expenses</p>
              <div className="space-y-2.5 mt-4 pt-4 border-t border-gray-100 dark:border-white/8">
                {[
                  { t: 'Application Fee', v: p.costs.applicationFee },
                  { t: 'Living Estimate', v: p.costs.livingEstimate },
                  { t: 'Financial Aid', v: p.costs.scholarships },
                ].map((s) => (
                  <div key={s.t} className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-gray-500 dark:text-slate-400">{s.t}</span>
                    <span className="text-[12px] font-bold text-slate-800 dark:text-slate-200 text-right">{s.v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps */}
            <div className={`${card} p-4 sm:p-5`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Next Steps</h3>
              <div className="space-y-2">
                {[
                  { icon: Compass, title: 'Add to my program list', sub: 'Save this program to your shortlist', href: '/university-college-student-route/programs/new' },
                  { icon: CalendarClock, title: 'Book a counselling session', sub: 'Get guidance on your application', href: '/university-college-student-route/counselors/book' },
                  { icon: BookOpen, title: 'Start your application', sub: 'Begin your application checklist', href: '/university-college-student-route/programs/application' },
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
                href="/university-college-student-route/programs/application"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl px-4 py-2.5 transition-colors"
              >
                <ClipboardCheck className="w-4 h-4" /> Apply to This Program
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
