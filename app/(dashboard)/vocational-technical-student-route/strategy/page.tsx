'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, TrendingUp, CheckCircle2, AlertTriangle,
  ChevronRight, ChevronDown, Mic, GraduationCap, ListChecks,
  Trophy, Brain, ArrowUpRight, Shield, Star, Flag,
  Briefcase, ClipboardCheck, Clock, HardHat, Award, MapPin,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ── Province data ───────────────────────────────────────────────────────────────

interface Province {
  code: string;
  name: string;
  body: string;          // provincial apprenticeship authority
  institute: string;     // flagship technical institute / college
  readiness: number;     // overall readiness % for this province/pathway
  trend: string;
  confidence: number;    // AI confidence /10
  progress: { month: string; value: number }[];
  note: string;          // AI summary line for the banner
}

const PROVINCES: Province[] = [
  {
    code: 'ON', name: 'Ontario', body: 'Skilled Trades Ontario', institute: 'Conestoga · George Brown · Humber',
    readiness: 72, trend: '+6% from last month', confidence: 8.4,
    progress: [
      { month: 'Jan', value: 52 }, { month: 'Feb', value: 56 }, { month: 'Mar', value: 61 },
      { month: 'Apr', value: 66 }, { month: 'May', value: 69 }, { month: 'Jun', value: 72 },
    ],
    note: 'Your profile is competitive for Ontario apprenticeship intake, but securing an employer sponsor and logging more on-the-job hours will unlock higher-tier college and Red Seal pathways.',
  },
  {
    code: 'BC', name: 'British Columbia', body: 'SkilledTradesBC', institute: 'BCIT · Camosun',
    readiness: 68, trend: '+4% from last month', confidence: 7.9,
    progress: [
      { month: 'Jan', value: 48 }, { month: 'Feb', value: 52 }, { month: 'Mar', value: 57 },
      { month: 'Apr', value: 61 }, { month: 'May', value: 65 }, { month: 'Jun', value: 68 },
    ],
    note: 'You meet most SkilledTradesBC foundation requirements. A pre-apprenticeship seat at BCIT and a completed aptitude test would meaningfully raise your odds.',
  },
  {
    code: 'AB', name: 'Alberta', body: 'Alberta Apprenticeship & Industry Training', institute: 'SAIT · NAIT',
    readiness: 75, trend: '+7% from last month', confidence: 8.6,
    progress: [
      { month: 'Jan', value: 55 }, { month: 'Feb', value: 60 }, { month: 'Mar', value: 64 },
      { month: 'Apr', value: 69 }, { month: 'May', value: 72 }, { month: 'Jun', value: 75 },
    ],
    note: 'Strong standing for Alberta AIT intake. Employer demand at SAIT and NAIT partner sites is high — confirm a sponsor to convert readiness into a registered apprenticeship.',
  },
  {
    code: 'QC', name: 'Quebec', body: 'Commission de la construction du Québec (CCQ)', institute: 'DEP · Cégep technique',
    readiness: 66, trend: '+3% from last month', confidence: 7.6,
    progress: [
      { month: 'Jan', value: 47 }, { month: 'Feb', value: 51 }, { month: 'Mar', value: 55 },
      { month: 'Apr', value: 59 }, { month: 'May', value: 63 }, { month: 'Jun', value: 66 },
    ],
    note: 'A DEP (Diplôme d\u2019études professionnelles) is your most direct route. French proficiency and CCQ registration are the main levers to improve your standing.',
  },
  {
    code: 'MB', name: 'Manitoba', body: 'Apprenticeship Manitoba', institute: 'Red River College Polytechnic',
    readiness: 70, trend: '+5% from last month', confidence: 8.0,
    progress: [
      { month: 'Jan', value: 50 }, { month: 'Feb', value: 54 }, { month: 'Mar', value: 59 },
      { month: 'Apr', value: 63 }, { month: 'May', value: 67 }, { month: 'Jun', value: 70 },
    ],
    note: 'You are on track for Apprenticeship Manitoba intake. Pairing a Red River College Polytechnic seat with logged work hours strengthens your file.',
  },
  {
    code: 'SK', name: 'Saskatchewan', body: 'Saskatchewan Apprenticeship & Trade Certification (SATCC)', institute: 'Saskatchewan Polytechnic',
    readiness: 69, trend: '+5% from last month', confidence: 7.8,
    progress: [
      { month: 'Jan', value: 49 }, { month: 'Feb', value: 53 }, { month: 'Mar', value: 58 },
      { month: 'Apr', value: 62 }, { month: 'May', value: 66 }, { month: 'Jun', value: 69 },
    ],
    note: 'SATCC registration plus a Saskatchewan Polytechnic program would consolidate your readiness. Focus on prerequisite math and a confirmed sponsor.',
  },
  {
    code: 'NS', name: 'Nova Scotia', body: 'Nova Scotia Apprenticeship Agency', institute: 'NSCC',
    readiness: 67, trend: '+4% from last month', confidence: 7.7,
    progress: [
      { month: 'Jan', value: 47 }, { month: 'Feb', value: 52 }, { month: 'Mar', value: 56 },
      { month: 'Apr', value: 60 }, { month: 'May', value: 64 }, { month: 'Jun', value: 67 },
    ],
    note: 'NSCC pathways align well with your profile. Completing the entrance assessment and securing a host employer are your next priorities.',
  },
  {
    code: 'NB', name: 'New Brunswick', body: 'Apprenticeship and Occupational Certification (NB)', institute: 'NBCC · CCNB',
    readiness: 65, trend: '+3% from last month', confidence: 7.5,
    progress: [
      { month: 'Jan', value: 45 }, { month: 'Feb', value: 49 }, { month: 'Mar', value: 54 },
      { month: 'Apr', value: 58 }, { month: 'May', value: 62 }, { month: 'Jun', value: 65 },
    ],
    note: 'A bilingual edge helps across NBCC and CCNB. Build your work-hour log and confirm a sponsor to lift your readiness toward the competitive band.',
  },
  {
    code: 'NL', name: 'Newfoundland and Labrador', body: 'Apprenticeship and Trades Certification (NL)', institute: 'College of the North Atlantic',
    readiness: 64, trend: '+3% from last month', confidence: 7.3,
    progress: [
      { month: 'Jan', value: 44 }, { month: 'Feb', value: 48 }, { month: 'Mar', value: 53 },
      { month: 'Apr', value: 57 }, { month: 'May', value: 61 }, { month: 'Jun', value: 64 },
    ],
    note: 'College of the North Atlantic offers strong entry programs. Prioritise the aptitude test and a documented work placement to raise your standing.',
  },
  {
    code: 'PE', name: 'Prince Edward Island', body: 'Apprenticeship PEI', institute: 'Holland College',
    readiness: 66, trend: '+4% from last month', confidence: 7.6,
    progress: [
      { month: 'Jan', value: 46 }, { month: 'Feb', value: 50 }, { month: 'Mar', value: 55 },
      { month: 'Apr', value: 59 }, { month: 'May', value: 63 }, { month: 'Jun', value: 66 },
    ],
    note: 'Holland College intake is within reach. Securing a local employer sponsor is the single biggest lever for your PEI apprenticeship file.',
  },
  {
    code: 'NT', name: 'Northwest Territories', body: 'Apprenticeship NWT', institute: 'Aurora College',
    readiness: 71, trend: '+6% from last month', confidence: 8.1,
    progress: [
      { month: 'Jan', value: 51 }, { month: 'Feb', value: 55 }, { month: 'Mar', value: 60 },
      { month: 'Apr', value: 64 }, { month: 'May', value: 68 }, { month: 'Jun', value: 71 },
    ],
    note: 'Northern trades demand is high. With Aurora College and a confirmed sponsor, your readiness for an NWT registered apprenticeship is strong.',
  },
  {
    code: 'YT', name: 'Yukon', body: 'Yukon Apprenticeship', institute: 'Yukon University',
    readiness: 68, trend: '+5% from last month', confidence: 7.9,
    progress: [
      { month: 'Jan', value: 48 }, { month: 'Feb', value: 53 }, { month: 'Mar', value: 57 },
      { month: 'Apr', value: 62 }, { month: 'May', value: 65 }, { month: 'Jun', value: 68 },
    ],
    note: 'Yukon University trades programs suit your profile. Log additional work hours and confirm a sponsor to move into the competitive band.',
  },
  {
    code: 'NU', name: 'Nunavut', body: 'Nunavut Apprenticeship', institute: 'Nunavut Arctic College',
    readiness: 63, trend: '+3% from last month', confidence: 7.2,
    progress: [
      { month: 'Jan', value: 43 }, { month: 'Feb', value: 47 }, { month: 'Mar', value: 52 },
      { month: 'Apr', value: 56 }, { month: 'May', value: 60 }, { month: 'Jun', value: 63 },
    ],
    note: 'Nunavut Arctic College provides foundational trades training. Prioritise the entrance assessment and a documented work placement to build readiness.',
  },
];

const READINESS_BAND = (n: number) =>
  n >= 75 ? { label: 'Competitive', cls: 'bg-emerald-500/40 text-emerald-50' }
  : n >= 65 ? { label: 'On Track', cls: 'bg-blue-500/40 text-blue-50' }
  : { label: 'Developing', cls: 'bg-amber-500/40 text-amber-50' };

// ── Opportunity cards (vocational pathway) ──────────────────────────────────────

const OPPORTUNITY_CARDS = [
  {
    label: 'Employer Sponsor',
    value: 45,
    status: 'Action Needed',
    statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15',
    barColor: 'bg-amber-400',
    icon: <Briefcase size={16} />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    label: 'College Pre-Apprenticeship',
    value: 78,
    status: 'Eligible',
    statusColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15',
    barColor: 'bg-emerald-500',
    icon: <GraduationCap size={16} />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Entrance / Aptitude Test',
    value: 62,
    status: 'In Progress',
    statusColor: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15',
    barColor: 'bg-blue-500',
    icon: <Brain size={16} />,
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Work Hours Logged',
    value: 54,
    status: 'Building',
    statusColor: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/15',
    barColor: 'bg-orange-400',
    icon: <Clock size={16} />,
    iconBg: 'bg-orange-50 dark:bg-orange-500/15',
    iconColor: 'text-orange-500 dark:text-orange-400',
  },
];

const NEXT_STEPS = [
  {
    icon: <Briefcase size={18} />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-500 dark:text-amber-400',
    title: 'Secure an Employer Sponsor',
    desc: 'A registered sponsor is required to start most apprenticeships — explore matched trade pathways.',
    cta: 'Explore Pathways',
    ctaHref: '/vocational-technical-student-route/career',
    ctaColor: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/15',
  },
  {
    icon: <Mic size={18} />,
    iconBg: 'bg-purple-50 dark:bg-purple-500/15',
    iconColor: 'text-purple-500 dark:text-purple-400',
    title: 'Practise Admission Interviews',
    desc: 'Complete 3 trades-admission interview scenarios (safety judgment, teamwork, “why this trade”).',
    cta: 'Start Practice',
    ctaHref: '/vocational-technical-student-route/mmi',
    ctaColor: 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-500/15',
  },
  {
    icon: <TrendingUp size={18} />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'Raise Prerequisite Grades',
    desc: 'Lift your Apprenticeship Math by 4% to meet the technical-diploma cut-off for your target program.',
    cta: 'Open Grade Tracker',
    ctaHref: '/vocational-technical-student-route/grades',
    ctaColor: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/15',
  },
  {
    icon: <ListChecks size={18} />,
    iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    iconColor: 'text-rose-500 dark:text-rose-400',
    title: 'Log Work Hours & Milestones',
    desc: 'Document on-the-job hours and safety certifications to complete your apprenticeship file.',
    cta: 'Open Milestones',
    ctaHref: '/vocational-technical-student-route/milestones',
    ctaColor: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/15',
  },
];

const STRENGTHS = [
  'Strong hands-on / mechanical aptitude',
  'Consistent shop & technical coursework',
  'Reliable work-readiness and safety mindset',
  'Early start on apprenticeship planning',
];

const AREAS_TO_IMPROVE = [
  'No confirmed employer sponsor yet',
  'Entrance / aptitude test not completed',
  'Limited documented work hours',
  'Prerequisite math below program cut-off',
];

// ── AI confidence gauge (SVG) ───────────────────────────────────────────────────

function GaugeArc({ score }: { score: number }) {
  const pct = score / 10;
  const r = 42;
  const cx = 56;
  const cy = 56;
  const startAngle = -210;
  const sweepAngle = 240;

  function polarToCartesian(angleDeg: number) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function describeArc(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const large = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const needleAngle = startAngle + pct * sweepAngle;
  const needleTip = polarToCartesian(needleAngle);

  return (
    <svg width="112" height="80" viewBox="0 0 112 80">
      <path
        d={describeArc(startAngle, startAngle + sweepAngle)}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d={describeArc(startAngle, startAngle + pct * sweepAngle)}
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
      <line
        x1={cx}
        y1={cy}
        x2={needleTip.x}
        y2={needleTip.y}
        stroke="rgba(255,255,255,0.85)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx={cx} cy={cy} r="4" fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StrategyAdvisorPage() {
  const [provinceCode, setProvinceCode] = useState('ON');

  const province = useMemo(
    () => PROVINCES.find((p) => p.code === provinceCode) ?? PROVINCES[0],
    [provinceCode],
  );
  const band = READINESS_BAND(province.readiness);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Strategy Advisor
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              A personalised plan to get into apprenticeships, college technical programs and the Red Seal pathway.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Province selector */}
            <div className="relative flex-1 sm:flex-none">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400" />
              <select
                value={provinceCode}
                onChange={(e) => setProvinceCode(e.target.value)}
                aria-label="Select province or territory"
                className="w-full sm:w-auto appearance-none pl-9 pr-8 py-2.5 text-sm font-semibold rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
              >
                {PROVINCES.map((p) => (
                  <option key={p.code} value={p.code}>{p.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <Link
              href="/vocational-technical-student-route/strategy/analysis"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all shrink-0"
            >
              <Sparkles size={15} /> <span className="hidden sm:inline">Run New Analysis</span>
              <span className="sm:hidden">Analyse</span>
            </Link>
          </div>
        </div>

        {/* ── Province pills ─────────────────────────────────────────────── */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {PROVINCES.map((p) => (
            <button
              key={p.code}
              onClick={() => setProvinceCode(p.code)}
              className={`shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                p.code === provinceCode
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-200 dark:hover:border-blue-500/30'
              }`}
            >
              {p.code}
            </button>
          ))}
        </div>

        {/* ── Two-column grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 sm:gap-6 items-start">

          {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
          <div className="space-y-4 sm:space-y-6 min-w-0">

            {/* Readiness banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-5 sm:p-6">
              <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 left-1/3 w-36 h-36 rounded-full bg-white/5" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
                {/* Score block */}
                <div className="shrink-0">
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">
                    Admission Readiness · {province.name}
                  </p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold text-white leading-none">{province.readiness}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${band.cls}`}>
                      {band.label}
                    </span>
                    <span className="text-[11px] text-blue-300 flex items-center gap-1">
                      <TrendingUp size={11} /> {province.trend}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-16 w-px bg-white/15 shrink-0" />

                {/* AI description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-blue-100 leading-relaxed">{province.note}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-100 bg-white/10 px-2.5 py-1 rounded-lg">
                      <HardHat size={11} /> {province.body}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-100 bg-white/10 px-2.5 py-1 rounded-lg">
                      <GraduationCap size={11} /> {province.institute}
                    </span>
                  </div>
                </div>

                {/* AI badge */}
                <div className="hidden md:flex w-14 h-14 shrink-0 rounded-2xl bg-white/15 items-center justify-center">
                  <span className="text-2xl font-black text-white italic leading-none" style={{ fontFamily: 'Georgia, serif' }}>Ai</span>
                </div>
              </div>
            </div>

            {/* Improvement opportunities */}
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-3">Opportunities to Strengthen Your File</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {OPPORTUNITY_CARDS.map((card) => (
                  <div key={card.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${card.iconBg} ${card.iconColor}`}>
                        {card.icon}
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide leading-tight mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{card.value}%</p>
                    </div>
                    <div>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${card.statusColor}`}>
                        {card.status}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-white/8 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${card.barColor}`}
                        style={{ width: `${card.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended next steps */}
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-3">Prioritised Next Steps</h2>
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
                {NEXT_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 sm:px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-white/3 transition-colors group">
                    <span className="hidden sm:flex w-6 h-6 rounded-full bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400 text-[11px] font-bold items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${step.iconBg} ${step.iconColor}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{step.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                    <Link
                      href={step.ctaHref}
                      className={`shrink-0 flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl border text-[12px] font-bold transition-all ${step.ctaColor}`}
                    >
                      <span className="hidden sm:inline">{step.cta}</span>
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Probability progress chart */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4 gap-3">
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Readiness Progress</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{province.name} apprenticeship & technical pathway · last 6 months</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 rounded-full shrink-0">
                  <TrendingUp size={11} /> Improving
                </span>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={province.progress} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: '#6e76a0', fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[25, 100]}
                    ticks={[25, 50, 75, 100]}
                    tick={{ fontSize: 10, fill: '#6e76a0' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)', background: '#1e2338', boxShadow: '0 4px 20px rgba(0,0,0,0.4)', padding: '8px 14px', color: '#dde0f0' }}
                    labelStyle={{ color: '#8a91b2', fontSize: 11, fontWeight: 700 }}
                    itemStyle={{ color: '#60a5fa', fontWeight: 700, fontSize: 13 }}
                    formatter={(v: number) => [`${v}%`, 'Readiness']}
                  />
                  <ReferenceLine y={province.readiness} stroke="#2563EB" strokeDasharray="4 4" strokeWidth={1.5} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#2563EB', stroke: 'white', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ───────────────────────────────────────────────── */}
          <div className="space-y-4 sm:space-y-5">

            {/* AI Confidence Score */}
            <div className="bg-slate-900 dark:bg-[#161a27] dark:border dark:border-white/6 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={15} className="text-emerald-400" />
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">AI Confidence Score</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{province.confidence}</span>
                    <span className="text-lg text-slate-400 font-semibold">/10</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">Your {province.name}<br />profile is improving.</p>
                </div>
                <div className="ml-auto">
                  <GaugeArc score={province.confidence} />
                </div>
              </div>
            </div>

            {/* Red Seal pathway callout */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <Award size={15} className="text-blue-500 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Red Seal Pathway</h3>
              </div>
              <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-snug">
                The interprovincial Red Seal endorsement lets you work in your trade across Canada. Complete your
                apprenticeship hours and the certification exam to earn it.
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="flex-1 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" style={{ width: '40%' }} />
                </div>
                <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400 shrink-0">40%</span>
              </div>
            </div>

            {/* Strengths */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star size={15} className="text-emerald-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Strengths</h3>
              </div>
              <ul className="space-y-2.5">
                {STRENGTHS.map((s, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-[12px] text-slate-600 dark:text-slate-400 leading-snug">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to improve */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={15} className="text-amber-400" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Areas to Improve</h3>
              </div>
              <ul className="space-y-2.5">
                {AREAS_TO_IMPROVE.map((a, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="text-[12px] text-slate-600 dark:text-slate-400 leading-snug">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Top priority */}
            <div className="bg-purple-50 dark:bg-purple-500/12 border border-purple-100 dark:border-purple-500/25 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Flag size={14} className="text-purple-500 dark:text-purple-400" />
                <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Top Priority This Week</p>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug mb-4">
                Reach out to 3 employers to secure a {province.body} apprenticeship sponsor.
              </p>
              <Link
                href="/vocational-technical-student-route/career"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm"
              >
                Find Sponsoring Trades
                <ArrowUpRight size={14} />
              </Link>
              <div className="flex items-center gap-1.5 mt-3">
                <ClipboardCheck size={12} className="text-purple-400" />
                <p className="text-[10px] text-purple-400 dark:text-purple-400 font-semibold">Goal: sponsor confirmed before intake</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
