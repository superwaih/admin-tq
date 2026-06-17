'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, TrendingUp, CheckCircle2, AlertTriangle,
  ChevronRight, BookOpen, Mic, GraduationCap, ListChecks,
  FileText, Trophy, Brain, Users, ArrowUpRight, RefreshCw,
  Shield, Star, Flag,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';

// ── Sample data ────────────────────────────────────────────────────────────────

const READINESS_SCORE = 72;
const READINESS_TREND = '+6% from last month';
const AI_CONFIDENCE = 8.4;

const OPPORTUNITY_CARDS = [
  {
    label: 'Essay Strength',
    value: 58,
    status: 'Needs Improvement',
    statusColor: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15',
    barColor: 'bg-amber-400',
    icon: <FileText size={16} />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-500 dark:text-amber-400',
  },
  {
    label: 'Extracurricular Activities',
    value: 81,
    status: 'Strong',
    statusColor: 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15',
    barColor: 'bg-emerald-500',
    icon: <Trophy size={16} />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    label: 'Academic Average',
    value: 92,
    status: 'Competitive',
    statusColor: 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15',
    barColor: 'bg-blue-500',
    icon: <Brain size={16} />,
    iconBg: 'bg-blue-50 dark:bg-blue-500/15',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'Interview Readiness',
    value: 64,
    status: 'Moderate',
    statusColor: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/15',
    barColor: 'bg-orange-400',
    icon: <Mic size={16} />,
    iconBg: 'bg-orange-50 dark:bg-orange-500/15',
    iconColor: 'text-orange-500 dark:text-orange-400',
  },
];

const NEXT_STEPS = [
  {
    icon: <FileText size={18} />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    iconColor: 'text-amber-500 dark:text-amber-400',
    title: 'Improve Essay Quality',
    desc: 'Add more leadership-focused examples to your UofT AIF response.',
    cta: 'Open Essay Coach',
    ctaHref: '/university-college-student-route/essay',
    ctaColor: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/15',
  },
  {
    icon: <Mic size={18} />,
    iconBg: 'bg-purple-50 dark:bg-purple-500/15',
    iconColor: 'text-purple-500 dark:text-purple-400',
    title: 'Practice MMI Scenarios',
    desc: 'Complete 3 healthcare ethical scenarios this week.',
    cta: 'Start Practice',
    ctaHref: '/university-college-student-route/mmi',
    ctaColor: 'text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/30 hover:bg-purple-50 dark:hover:bg-purple-500/15',
  },
  {
    icon: <TrendingUp size={18} />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    title: 'Raise Calculus Grade',
    desc: 'Improving Calculus by 4% could increase your probability by 8%.',
    cta: 'Open Grade Tracker',
    ctaHref: '/university-college-student-route/grades',
    ctaColor: 'text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-50 dark:hover:bg-emerald-500/15',
  },
  {
    icon: <ListChecks size={18} />,
    iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    iconColor: 'text-rose-500 dark:text-rose-400',
    title: 'Complete Missing Activities',
    desc: 'Add 2 meaningful activities to strengthen your extracurricular profile.',
    cta: 'Edit Activities',
    ctaHref: '/university-college-student-route/programs',
    ctaColor: 'text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-50 dark:hover:bg-rose-500/15',
  },
];

const PROBABILITY_PROGRESS = [
  { month: 'Jan', value: 52 },
  { month: 'Feb', value: 56 },
  { month: 'Mar', value: 61 },
  { month: 'Apr', value: 68 },
  { month: 'May', value: 69 },
  { month: 'Jun', value: 72 },
];

const STRENGTHS = [
  'Strong academic average',
  'Consistent and rigorous coursework',
  'Good extracurricular balance',
  'Early application preparation',
];

const AREAS_TO_IMPROVE = [
  'Weak essay storytelling',
  'Limited leadership examples',
  'Low interview preparation',
  'Not enough program-specific research',
];

// ── Sub-components ─────────────────────────────────────────────────────────────

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
  const [analysisRunning, setAnalysisRunning] = useState(false);

  function handleRunAnalysis() {
    setAnalysisRunning(true);
    setTimeout(() => setAnalysisRunning(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">Strategy Advisor</h1>
            <p className="text-sm text-slate-500 mt-1">AI-powered recommendations to improve your admission chances.</p>
          </div>
          <Link
            href="/university-college-student-route/strategy/analysis"
            className="self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-blue-200 transition-all"
          >
            <Sparkles size={15} /> Run New Analysis
          </Link>
        </div>

        {/* ── Two-column grid ─────────────────────────────────────────────── */}
        <div className="grid lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6">

          {/* ── LEFT COLUMN ────────────────────────────────────────────────── */}
          <div className="space-y-6 min-w-0">

            {/* Readiness banner */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6">
              <div className="absolute -top-8 -right-8 w-44 h-44 rounded-full bg-white/5" />
              <div className="absolute -bottom-10 left-1/3 w-36 h-36 rounded-full bg-white/5" />
              <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
                {/* Score block */}
                <div className="shrink-0">
                  <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">Current Admission Readiness</p>
                  <div className="flex items-end gap-3">
                    <span className="text-5xl font-bold text-white leading-none">{READINESS_SCORE}%</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-bold bg-blue-500/40 text-blue-100 px-2.5 py-0.5 rounded-full">
                      Competitive
                    </span>
                    <span className="text-[11px] text-blue-300 flex items-center gap-1">
                      <TrendingUp size={11} /> {READINESS_TREND}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block h-16 w-px bg-white/15 shrink-0" />

                {/* AI description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-blue-100 leading-relaxed">
                    Your profile is competitive for Ontario engineering programs, but your supplementary essays
                    and extracurricular depth are limiting higher-tier admission probabilities.
                  </p>
                </div>

                {/* AI badge */}
                <div className="hidden md:flex w-14 h-14 shrink-0 rounded-2xl bg-white/15 items-center justify-center">
                  <span className="text-2xl font-black text-white italic leading-none" style={{ fontFamily: 'Georgia, serif' }}>Ai</span>
                </div>
              </div>
            </div>

            {/* Improvement opportunities */}
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-3">Improvement Opportunities</h2>
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
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-3">Recommended Next Steps</h2>
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden divide-y divide-gray-50 dark:divide-white/5">
                {NEXT_STEPS.map((step, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-white/3 transition-colors group">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${step.iconBg} ${step.iconColor}`}>
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{step.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{step.desc}</p>
                    </div>
                    <Link
                      href={step.ctaHref}
                      className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-[12px] font-bold transition-all ${step.ctaColor}`}
                    >
                      {step.cta}
                      <ChevronRight size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Probability progress chart */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200">Admission Probability Progress</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Average across all tracked programs · last 6 months</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-1 rounded-full">
                  <TrendingUp size={11} /> Improving
                </span>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={PROBABILITY_PROGRESS} margin={{ top: 8, right: 16, bottom: 0, left: -20 }}>
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
                    formatter={(v: number) => [`${v}%`, 'Avg Probability']}
                  />
                  <ReferenceLine y={72} stroke="#2563EB" strokeDasharray="4 4" strokeWidth={1.5} />
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
          <div className="space-y-4">

            {/* AI Confidence Score */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={15} className="text-emerald-400" />
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">AI Confidence Score</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{AI_CONFIDENCE}</span>
                    <span className="text-lg text-slate-400 font-semibold">/10</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">Your profile is<br />improving steadily.</p>
                </div>
                <div className="ml-auto">
                  <GaugeArc score={AI_CONFIDENCE} />
                </div>
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

            <div className="bg-purple-50 dark:bg-purple-500/12 border border-purple-100 dark:border-purple-500/25 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Flag size={14} className="text-purple-500 dark:text-purple-400" />
                <p className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Top Priority This Week</p>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug mb-4">
                Complete your UofT Engineering AIF before Nov 1 to avoid probability reduction.
              </p>
              <Link
                href="/university-college-student-route/essay"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm shadow-blue-200 dark:shadow-blue-900/20"
              >
                Continue Task
                <ArrowUpRight size={14} />
              </Link>
              <div className="flex items-center gap-1.5 mt-3">
                <GraduationCap size={12} className="text-purple-400" />
                <p className="text-[10px] text-purple-400 dark:text-purple-400 font-semibold">Due: Nov 1, 2026</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
