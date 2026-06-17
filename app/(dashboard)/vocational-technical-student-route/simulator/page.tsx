'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, RotateCcw, MapPin, ChevronDown, Wrench, GraduationCap,
  Target, Award, TrendingUp, Zap, CheckCircle2, XCircle, Lightbulb,
  GitCompareArrows, Info, ArrowUpRight, Building2, BadgeCheck, Clock,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────────── */

type ProgramType = 'Apprenticeship' | 'College/Technical Diploma';

interface Province {
  id: string;
  name: string;
  body: string;
  institute: string;
  demand: 'High' | 'Medium' | 'Low';
  comp: number; // competitiveness modifier added to required average
}

interface Program {
  id: string;
  name: string;
  code: string;
  type: ProgramType;
  reqAvg: number;
  reqEnglish: number;
  reqMath: number;
  reqScience: number;
  scienceLabel: string;
  redSeal: boolean;
  needsSponsor: boolean;
  minHours: number;
  minAptitude: number;
  blurb: string;
}

interface Inputs {
  overallAvg: number;
  englishGrade: number;
  mathGrade: number;
  scienceGrade: number;
  sponsorSecured: boolean;
  hoursLogged: number;
  aptitudeScore: number;
}

/* ── Data ──────────────────────────────────────────────────────────── */

const PROVINCES: Province[] = [
  { id: 'ON', name: 'Ontario', body: 'Skilled Trades Ontario', institute: 'Conestoga · George Brown · Humber', demand: 'High', comp: 2 },
  { id: 'BC', name: 'British Columbia', body: 'SkilledTradesBC', institute: 'BCIT', demand: 'High', comp: 2 },
  { id: 'AB', name: 'Alberta', body: 'Alberta Apprenticeship & Industry Training', institute: 'SAIT · NAIT', demand: 'High', comp: 1 },
  { id: 'QC', name: 'Quebec', body: 'CCQ · DEP technical programs', institute: 'Cégep technical institutes', demand: 'Medium', comp: 1 },
  { id: 'MB', name: 'Manitoba', body: 'Apprenticeship Manitoba', institute: 'Red River College Polytechnic', demand: 'Medium', comp: 0 },
  { id: 'SK', name: 'Saskatchewan', body: 'SATCC', institute: 'Saskatchewan Polytechnic', demand: 'Medium', comp: 0 },
  { id: 'NS', name: 'Nova Scotia', body: 'Nova Scotia Apprenticeship Agency', institute: 'NSCC', demand: 'Medium', comp: 0 },
  { id: 'NB', name: 'New Brunswick', body: 'Apprenticeship & Occupational Certification', institute: 'NBCC', demand: 'Medium', comp: 0 },
  { id: 'NL', name: 'Newfoundland and Labrador', body: 'Apprenticeship & Trades Certification', institute: 'College of the North Atlantic', demand: 'Medium', comp: 0 },
  { id: 'PE', name: 'Prince Edward Island', body: 'PEI Apprenticeship', institute: 'Holland College', demand: 'Low', comp: -1 },
  { id: 'NT', name: 'Northwest Territories', body: 'NWT Apprenticeship', institute: 'Aurora College', demand: 'High', comp: -1 },
  { id: 'YT', name: 'Yukon', body: 'Yukon Apprenticeship Program', institute: 'Yukon University', demand: 'High', comp: -1 },
  { id: 'NU', name: 'Nunavut', body: 'Nunavut Apprenticeship Program', institute: 'Nunavut Arctic College', demand: 'High', comp: -2 },
];

const PROGRAMS: Program[] = [
  {
    id: 'electrician', name: 'Electrician', code: '309A', type: 'Apprenticeship',
    reqAvg: 70, reqEnglish: 65, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11/12',
    redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 70,
    blurb: 'Construction & maintenance electrician — a Red Seal trade with strong demand nationwide.',
  },
  {
    id: 'automotive', name: 'Automotive Service Technician', code: '310S', type: 'Apprenticeship',
    reqAvg: 65, reqEnglish: 60, reqMath: 65, reqScience: 60, scienceLabel: 'Science 11',
    redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 65,
    blurb: 'Diagnose and repair modern vehicles — a Red Seal trade requiring an employer sponsor.',
  },
  {
    id: 'welder', name: 'Welder', code: '456A', type: 'Apprenticeship',
    reqAvg: 60, reqEnglish: 55, reqMath: 60, reqScience: 55, scienceLabel: 'Science 10/11',
    redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 60,
    blurb: 'Join and fabricate metal structures — strong manual dexterity and Red Seal pathway.',
  },
  {
    id: 'hvac-app', name: 'HVAC / Refrigeration Mechanic', code: '313A', type: 'Apprenticeship',
    reqAvg: 68, reqEnglish: 60, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11',
    redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 68,
    blurb: 'Install and service heating, cooling and refrigeration systems — a Red Seal trade.',
  },
  {
    id: 'plumbing', name: 'Plumber', code: '306A', type: 'Apprenticeship',
    reqAvg: 65, reqEnglish: 60, reqMath: 68, reqScience: 60, scienceLabel: 'Science 11',
    redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 65,
    blurb: 'Install and repair piping systems — a Red Seal trade in high demand.',
  },
  {
    id: 'civil-tech', name: 'Construction / Civil Engineering Technician', code: 'CET', type: 'College/Technical Diploma',
    reqAvg: 70, reqEnglish: 65, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11/12',
    redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 60,
    blurb: 'Diploma program covering surveying, estimating and site inspection.',
  },
  {
    id: 'elec-eng-tech', name: 'Electrical Engineering Technology', code: 'EET', type: 'College/Technical Diploma',
    reqAvg: 72, reqEnglish: 65, reqMath: 72, reqScience: 70, scienceLabel: 'Physics 12',
    redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 60,
    blurb: 'Advanced diploma in electrical/electronics systems and controls.',
  },
  {
    id: 'hvac-tech', name: 'HVAC Engineering Technician', code: 'HVT', type: 'College/Technical Diploma',
    reqAvg: 68, reqEnglish: 60, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11',
    redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 58,
    blurb: 'Diploma focused on building mechanical systems and energy efficiency.',
  },
  {
    id: 'network-tech', name: 'Computer / Network Technician', code: 'CNT', type: 'College/Technical Diploma',
    reqAvg: 70, reqEnglish: 65, reqMath: 68, reqScience: 60, scienceLabel: 'Science 11',
    redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 60,
    blurb: 'Hands-on diploma in networking, hardware support and IT infrastructure.',
  },
];

const PROGRAM_TYPES: ProgramType[] = ['Apprenticeship', 'College/Technical Diploma'];

const DEFAULT_INPUTS: Inputs = {
  overallAvg: 78,
  englishGrade: 75,
  mathGrade: 76,
  scienceGrade: 74,
  sponsorSecured: true,
  hoursLogged: 600,
  aptitudeScore: 75,
};

/* ── Probability model ─────────────────────────────────────────────── */

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function computeProbability(program: Program, province: Province, i: Inputs) {
  const reqAvg = program.reqAvg + province.comp;
  let score = 50;
  score += (i.overallAvg - reqAvg) * 2.0;
  score += (i.englishGrade - program.reqEnglish) * 0.4;
  score += (i.mathGrade - program.reqMath) * 0.7;
  score += (i.scienceGrade - program.reqScience) * 0.4;
  score += (i.aptitudeScore - program.minAptitude) * 0.35;

  if (program.type === 'Apprenticeship') {
    if (program.needsSponsor) score += i.sponsorSecured ? 14 : -20;
    if (program.minHours > 0) {
      const ratio = i.hoursLogged / program.minHours;
      score += clamp((ratio - 1) * 12, -10, 10);
    }
  }
  return Math.round(clamp(score, 4, 98));
}

interface CheckItem {
  label: string;
  detail: string;
  met: boolean;
}

function buildChecklist(program: Program, province: Province, i: Inputs): CheckItem[] {
  const reqAvg = program.reqAvg + province.comp;
  const items: CheckItem[] = [
    {
      label: 'Overall average',
      detail: `${i.overallAvg}% vs ${reqAvg}% required`,
      met: i.overallAvg >= reqAvg,
    },
    {
      label: 'English 12',
      detail: `${i.englishGrade}% vs ${program.reqEnglish}% required`,
      met: i.englishGrade >= program.reqEnglish,
    },
    {
      label: 'Math (Apprenticeship/Foundations)',
      detail: `${i.mathGrade}% vs ${program.reqMath}% required`,
      met: i.mathGrade >= program.reqMath,
    },
    {
      label: program.scienceLabel,
      detail: `${i.scienceGrade}% vs ${program.reqScience}% required`,
      met: i.scienceGrade >= program.reqScience,
    },
    {
      label: 'Entrance / aptitude test',
      detail: `${i.aptitudeScore}% vs ${program.minAptitude}% required`,
      met: i.aptitudeScore >= program.minAptitude,
    },
  ];

  if (program.type === 'Apprenticeship') {
    if (program.needsSponsor) {
      items.push({
        label: 'Employer sponsorship secured',
        detail: i.sponsorSecured ? 'Sponsor confirmed' : 'No sponsor yet — required to register',
        met: i.sponsorSecured,
      });
    }
    if (program.minHours > 0) {
      items.push({
        label: 'On-the-job hours logged',
        detail: `${i.hoursLogged} hrs vs ${program.minHours} hrs target`,
        met: i.hoursLogged >= program.minHours,
      });
    }
  }
  return items;
}

function probMeta(p: number) {
  if (p >= 70) return { label: 'Strong Chance', text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300', stroke: '#10b981' };
  if (p >= 45) return { label: 'Possible', text: 'text-amber-600 dark:text-amber-400', badge: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300', stroke: '#f59e0b' };
  return { label: 'Reach', text: 'text-rose-500 dark:text-rose-400', badge: 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300', stroke: '#ef4444' };
}

/* ── Gauge ─────────────────────────────────────────────────────────── */

function LikelihoodGauge({ value }: { value: number }) {
  const r = 56;
  const semi = Math.PI * r;
  const meta = probMeta(value);
  return (
    <div className="relative w-full flex justify-center pt-1">
      <svg viewBox="0 0 140 80" className="w-52 h-28">
        <path d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke="currentColor" className="text-gray-100 dark:text-white/10" strokeWidth="12" strokeLinecap="round" />
        <path
          d="M 14 70 A 56 56 0 0 1 126 70" fill="none" stroke={meta.stroke} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={semi} strokeDashoffset={semi * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{value}%</span>
        <span className={`text-[11px] font-bold ${meta.text}`}>{meta.label}</span>
      </div>
    </div>
  );
}

/* ── Sliders / inputs ──────────────────────────────────────────────── */

function GradeSlider({ label, value, onChange, min = 50, max = 100, required, unit = '%' }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; required?: number; unit?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const met = required === undefined || value >= required;
  return (
    <div>
      <div className="flex items-center justify-between mb-2 gap-2">
        <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <div className="flex items-center gap-2 shrink-0">
          {required !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${met ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300'}`}>
              req {required}{unit}
            </span>
          )}
          <span className="w-16 text-center text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1 tabular-nums">{value}{unit}</span>
        </div>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none" style={{ left: `calc(${pct}% - 8px)` }} />
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer"
          aria-label={label}
        />
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sub, valueColor, iconBg, iconColor }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  valueColor: string; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 flex items-center gap-3.5">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider truncate">{label}</p>
        <p className={`text-lg font-bold leading-tight ${valueColor}`}>{value}</p>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{sub}</p>
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function VocationalSimulatorPage() {
  const [provinceId, setProvinceId] = useState('ON');
  const [type, setType] = useState<ProgramType>('Apprenticeship');
  const [programId, setProgramId] = useState('electrician');
  const [compareId, setCompareId] = useState<string>('');
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS);

  const province = PROVINCES.find((p) => p.id === provinceId)!;
  const typedPrograms = useMemo(() => PROGRAMS.filter((p) => p.type === type), [type]);
  const program = PROGRAMS.find((p) => p.id === programId) ?? typedPrograms[0];

  const set = <K extends keyof Inputs>(key: K, val: Inputs[K]) =>
    setInputs((s) => ({ ...s, [key]: val }));

  const onTypeChange = (t: ProgramType) => {
    setType(t);
    const first = PROGRAMS.find((p) => p.type === t);
    if (first) setProgramId(first.id);
    setCompareId('');
  };

  const probability = computeProbability(program, province, inputs);
  const optimistic = Math.round(clamp(probability + 12, 4, 99));
  const conservative = Math.round(clamp(probability - 14, 2, 98));
  const checklist = buildChecklist(program, province, inputs);
  const metCount = checklist.filter((c) => c.met).length;
  const meta = probMeta(probability);

  const compareProgram = PROGRAMS.find((p) => p.id === compareId);
  const compareProb = compareProgram ? computeProbability(compareProgram, province, inputs) : null;
  const compareOptions = PROGRAMS.filter((p) => p.id !== program.id);

  // Improvement tips: unmet requirements first, then generic guidance.
  const unmet = checklist.filter((c) => !c.met);
  const tips: string[] = [
    ...unmet.map((c) => `Raise your ${c.label.toLowerCase()} — currently ${c.detail.split(' vs ')[0]}.`),
  ];
  if (program.type === 'Apprenticeship' && program.needsSponsor && !inputs.sponsorSecured) {
    tips.push(`Connect with employers through ${province.body} to secure a sponsorship.`);
  }
  if (program.redSeal) {
    tips.push('Aim for Red Seal endorsement to work across provinces and territories.');
  }
  tips.push(`Tour a technical institute (${province.institute}) and book an info session.`);
  tips.push('Log more verified on-the-job or co-op hours to strengthen your file.');
  const topTips = tips.slice(0, 5);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Admission Simulator
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Estimate your likelihood of getting into a vocational or technical program in your province.
            </p>
          </div>
          <Link
            href="/vocational-technical-student-route/simulator/new"
            className="self-start inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl text-sm font-bold shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" /> New Simulation
          </Link>
        </div>

        {/* Selectors */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5 space-y-4">
          {/* Province + program selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> Province / Territory
              </label>
              <div className="relative">
                <select
                  value={provinceId}
                  onChange={(e) => setProvinceId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-9 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {PROVINCES.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5 block">
                Target Program / Trade
              </label>
              <div className="relative">
                <select
                  value={program.id}
                  onChange={(e) => setProgramId(e.target.value)}
                  className="w-full appearance-none pl-3 pr-9 py-2.5 text-sm font-medium rounded-xl bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {typedPrograms.map((p) => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Program-type toggle */}
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Program Type</p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {PROGRAM_TYPES.map((t) => {
                const active = type === t;
                const Icon = t === 'Apprenticeship' ? Wrench : GraduationCap;
                return (
                  <button
                    key={t}
                    onClick={() => onTypeChange(t)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-[13px] font-semibold transition-colors ${
                      active
                        ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-[#1a1f30] border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-500/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Province context strip */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
              <Building2 className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> {province.body}
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" /> {province.institute}
            </span>
            <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
              province.demand === 'High'
                ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                : province.demand === 'Medium'
                ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300'
                : 'bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300'
            }`}>
              <TrendingUp className="w-3.5 h-3.5" /> {province.demand} regional demand
            </span>
            {program.redSeal && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">
                <BadgeCheck className="w-3.5 h-3.5" /> Red Seal trade
              </span>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard label="Likelihood" value={`${probability}%`} sub={meta.label}
            icon={<Target className="w-4 h-4" />} iconBg="bg-blue-50 dark:bg-blue-500/15" iconColor="text-blue-600"
            valueColor={meta.text} />
          <StatCard label="Requirements met" value={`${metCount}/${checklist.length}`} sub="for this program"
            icon={<CheckCircle2 className="w-4 h-4" />} iconBg="bg-emerald-50 dark:bg-emerald-500/15" iconColor="text-emerald-600"
            valueColor="text-emerald-700 dark:text-emerald-400" />
          <StatCard label="Best case" value={`${optimistic}%`} sub="optimistic scenario"
            icon={<Zap className="w-4 h-4" />} iconBg="bg-purple-50 dark:bg-purple-500/15" iconColor="text-purple-600"
            valueColor="text-purple-700 dark:text-purple-400" />
          <StatCard label="Conservative" value={`${conservative}%`} sub="cautious scenario"
            icon={<Award className="w-4 h-4" />} iconBg="bg-amber-50 dark:bg-amber-500/15" iconColor="text-amber-500"
            valueColor="text-amber-600 dark:text-amber-400" />
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-4 sm:gap-6 items-start">

          {/* Left: inputs */}
          <div className="space-y-4 sm:space-y-6 min-w-0">

            {/* Academic inputs */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Your Inputs</h2>
                  <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{program.blurb}</p>
                </div>
                <button
                  onClick={() => setInputs(DEFAULT_INPUTS)}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              </div>

              <div className="space-y-5">
                <GradeSlider label="Overall average" value={inputs.overallAvg} onChange={(v) => set('overallAvg', v)} required={program.reqAvg + province.comp} />
                <GradeSlider label="English 12" value={inputs.englishGrade} onChange={(v) => set('englishGrade', v)} required={program.reqEnglish} />
                <GradeSlider label="Math (Apprenticeship / Foundations)" value={inputs.mathGrade} onChange={(v) => set('mathGrade', v)} required={program.reqMath} />
                <GradeSlider label={program.scienceLabel} value={inputs.scienceGrade} onChange={(v) => set('scienceGrade', v)} required={program.reqScience} />
                <GradeSlider label="Entrance / aptitude test score" value={inputs.aptitudeScore} onChange={(v) => set('aptitudeScore', v)} required={program.minAptitude} />
              </div>

              {/* Apprenticeship-specific factors */}
              {program.type === 'Apprenticeship' && (
                <div className="mt-5 pt-5 border-t border-gray-50 dark:border-white/5 space-y-5">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Apprenticeship factors</p>

                  {/* Sponsorship toggle */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200">Employer sponsorship secured</p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">Most Red Seal trades require a sponsoring employer to register.</p>
                    </div>
                    <button
                      onClick={() => set('sponsorSecured', !inputs.sponsorSecured)}
                      role="switch"
                      aria-checked={inputs.sponsorSecured}
                      className={`relative shrink-0 w-12 h-6 rounded-full transition-colors ${inputs.sponsorSecured ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/15'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${inputs.sponsorSecured ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>

                  {/* Hours logged */}
                  <GradeSlider
                    label="On-the-job hours logged"
                    value={inputs.hoursLogged}
                    onChange={(v) => set('hoursLogged', v)}
                    min={0} max={2000}
                    required={program.minHours}
                    unit=" hrs"
                  />
                </div>
              )}
            </div>

            {/* Requirement checklist */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Requirement Checklist</h2>
                <Info className="w-3.5 h-3.5 text-gray-300 dark:text-slate-600" />
                <span className="ml-auto text-[12px] font-semibold text-gray-400 dark:text-slate-500">{metCount} of {checklist.length} met</span>
              </div>
              <div className="space-y-2">
                {checklist.map((c) => (
                  <div
                    key={c.label}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${
                      c.met
                        ? 'bg-emerald-50/60 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20'
                        : 'bg-rose-50/60 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20'
                    }`}
                  >
                    {c.met
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      : <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />}
                    <div className="min-w-0">
                      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{c.label}</p>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5">{c.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compare two programs */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
              <div className="flex items-center gap-1.5 mb-4">
                <GitCompareArrows className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Compare Two Programs</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Current */}
                <div className="rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/10 p-4">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Selected</p>
                  <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 mt-1 leading-tight">{program.name}</p>
                  <p className="text-[11px] text-gray-500 dark:text-slate-400">({program.code}) · {program.type}</p>
                  <p className={`text-3xl font-bold mt-3 tabular-nums ${probMeta(probability).text}`}>{probability}%</p>
                  <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${probMeta(probability).badge}`}>{probMeta(probability).label}</span>
                </div>

                {/* Compare target */}
                <div className="rounded-xl border border-gray-100 dark:border-white/8 bg-slate-50/60 dark:bg-white/5 p-4">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">Compare with</p>
                  <div className="relative">
                    <select
                      value={compareId}
                      onChange={(e) => setCompareId(e.target.value)}
                      className="w-full appearance-none pl-3 pr-9 py-2 text-[13px] font-medium rounded-lg bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                    >
                      <option value="">Choose a program…</option>
                      {compareOptions.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.code})</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                  {compareProgram && compareProb !== null ? (
                    <>
                      <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-2">{compareProgram.type}</p>
                      <p className={`text-3xl font-bold mt-2 tabular-nums ${probMeta(compareProb).text}`}>{compareProb}%</p>
                      <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md mt-1 ${probMeta(compareProb).badge}`}>{probMeta(compareProb).label}</span>
                      <p className="text-[11px] font-medium text-gray-500 dark:text-slate-400 mt-2">
                        {compareProb > probability
                          ? `+${compareProb - probability}% higher with the same inputs`
                          : compareProb < probability
                          ? `${compareProb - probability}% lower with the same inputs`
                          : 'Same likelihood with these inputs'}
                      </p>
                    </>
                  ) : (
                    <p className="text-[12px] text-gray-400 dark:text-slate-500 mt-3 leading-snug">
                      Select another program to see how your same inputs would perform.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-6">

            {/* Likelihood gauge */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Admission Likelihood</h3>
              <p className="text-[11px] text-gray-400 dark:text-slate-500">{program.name} · {province.name}</p>
              <LikelihoodGauge value={probability} />

              {/* Scenario framing */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                {[
                  { label: 'Conservative', val: conservative, color: 'text-amber-600 dark:text-amber-400' },
                  { label: 'Realistic', val: probability, color: meta.text },
                  { label: 'Optimistic', val: optimistic, color: 'text-emerald-600 dark:text-emerald-400' },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={`text-lg font-bold tabular-nums ${s.color}`}>{s.val}%</p>
                    <p className="text-[10px] font-semibold text-gray-400 dark:text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* How to improve */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">How to Improve Your Odds</h3>
              </div>
              <ul className="space-y-2.5">
                {topTips.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-[12px] text-gray-600 dark:text-slate-300 leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* How it works */}
            <div className="rounded-2xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">How it works</h3>
              </div>
              <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-snug">
                Estimates combine your grades, prerequisites, aptitude test and apprenticeship factors against
                typical intake expectations for the selected province. Results are guidance only — not official
                admission decisions.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
