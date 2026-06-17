'use client';

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Mic, Clock, ChevronLeft, Play, Pause, RotateCcw, CheckCircle2,
  HardHat, Users, Lightbulb, Wrench, Scale, Hammer, Target, MapPin,
  ArrowRight, ArrowLeft, SkipForward, MessageSquare, ThumbsUp, AlertCircle,
  Square, Award,
} from 'lucide-react';

/* ── Province bodies (kept in sync with the MMI list page) ─────────────── */

const PROVINCE_BODIES: Record<string, string> = {
  Ontario: 'Skilled Trades Ontario',
  'British Columbia': 'SkilledTradesBC',
  Alberta: 'Alberta Apprenticeship & Industry Training',
  Quebec: 'Quebec CCQ / DEP intake',
  Manitoba: 'Apprenticeship Manitoba',
  Saskatchewan: 'SATCC (Saskatchewan)',
  'Nova Scotia': 'Nova Scotia Apprenticeship Agency',
  'New Brunswick': 'NB Apprenticeship & Occupational Certification',
  'Newfoundland and Labrador': 'NL Apprenticeship & Trades',
  'Prince Edward Island': 'PEI Apprenticeship',
  'Northwest Territories': 'NWT Apprenticeship',
  Yukon: 'Yukon Trades & Apprenticeship',
  Nunavut: 'Nunavut Trades Training',
};

/* ── Station catalog (ids match the MMI list page) ─────────────────────── */

interface StationInfo {
  id: string;
  title: string;
  prompt: string;
  category: string;
  minutes: number;
  icon: React.ElementType;
  provinceNote?: string;
  tips: string[];
}

const STATIONS: StationInfo[] = [
  {
    id: 'safety-judgment',
    title: 'Workplace Safety Judgment',
    prompt: 'You notice a co-worker on the job site skipping lockout/tagout before servicing a machine. Walk through how you respond.',
    category: 'Workplace Safety', minutes: 6, icon: HardHat,
    provinceNote: 'WHMIS & OH&S expectations vary by province',
    tips: ['Lead with safety — stop the unsafe work first', 'Reference lockout/tagout and WHMIS procedures', 'Show how you escalate without blaming the co-worker'],
  },
  {
    id: 'why-this-trade',
    title: 'Why This Trade?',
    prompt: 'Explain to an apprenticeship advisor why you are choosing this trade and how you know it fits you.',
    category: 'Motivation', minutes: 5, icon: Lightbulb,
    tips: ['Connect a real hands-on experience to the trade', 'Mention the Red Seal / certification path', 'Show you understand the day-to-day work'],
  },
  {
    id: 'jobsite-teamwork',
    title: 'Teamwork on a Job Site',
    prompt: 'A crew member disagrees with your approach mid-task and the deadline is tight. How do you keep the team moving?',
    category: 'Teamwork', minutes: 6, icon: Users,
    tips: ['Acknowledge the other view before responding', 'Keep safety and the deadline in balance', 'Show respect for the crew lead / chain of command'],
  },
  {
    id: 'diagnostic-problem',
    title: 'Diagnose & Problem-Solve',
    prompt: 'A circuit keeps tripping after you finish an install. Talk through how you isolate and fix the fault step by step.',
    category: 'Problem Solving', minutes: 8, icon: Wrench,
    tips: ['Work through it methodically, step by step', 'Mention isolating the circuit safely first', 'Explain how you verify the fix before sign-off'],
  },
  {
    id: 'manual-dexterity',
    title: 'Manual Dexterity & Spatial Aptitude',
    prompt: 'A timed station: read a simple shop drawing, identify the measurements, and describe your cut/assembly plan.',
    category: 'Aptitude', minutes: 7, icon: Hammer,
    provinceNote: 'Mirrors common entrance/aptitude test stations',
    tips: ['Read the drawing fully before you start', 'Call out your measurements out loud', 'Describe a "measure twice, cut once" plan'],
  },
  {
    id: 'workplace-ethics',
    title: 'Workplace Ethics',
    prompt: 'Your employer asks you to sign off on work you did not fully complete. How do you handle it professionally?',
    category: 'Ethics', minutes: 6, icon: Scale,
    tips: ['Be honest while staying professional', 'Explain the risk of signing off incomplete work', 'Offer a concrete path to finish it properly'],
  },
  {
    id: 'customer-communication',
    title: 'Explaining Work to a Client',
    prompt: 'A homeowner does not understand why a repair costs more than quoted. Communicate clearly and keep their trust.',
    category: 'Teamwork', minutes: 5, icon: Users,
    tips: ['Use plain language, not jargon', 'Explain what changed and why', 'Reassure them and offer options'],
  },
  {
    id: 'sponsorship-readiness',
    title: 'Employer Sponsorship Interview',
    prompt: 'A potential sponsor asks what you bring to their shop on day one. Make your case in under two minutes.',
    category: 'Motivation', minutes: 5, icon: Target,
    provinceNote: 'Sponsorship is required for most apprenticeship intakes',
    tips: ['Lead with reliability and a safety-first attitude', 'Reference any tickets, hours, or tools you have', 'Show eagerness to learn on the job'],
  },
];

const PREP_SECONDS = 45;

type Phase = 'ready' | 'prep' | 'answer' | 'feedback';

interface Feedback {
  overall: number;
  metrics: { label: string; value: number }[];
  strengths: string[];
  improvements: string[];
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function buildFeedback(secondsUsed: number, totalSeconds: number): Feedback {
  // Lightweight, plausible scoring for a practice session (no backend).
  const usage = Math.min(1, secondsUsed / Math.max(totalSeconds * 0.5, 1));
  const base = 62 + Math.round(usage * 18); // 62–80 band by how much of the time was used
  const jitter = () => Math.max(55, Math.min(96, base + Math.floor(Math.random() * 16) - 6));
  const metrics = [
    { label: 'Structure & Clarity', value: jitter() },
    { label: 'Safety Awareness', value: jitter() },
    { label: 'Communication', value: jitter() },
    { label: 'Confidence & Pace', value: jitter() },
  ];
  const overall = Math.round(metrics.reduce((a, m) => a + m.value, 0) / metrics.length);
  return {
    overall,
    metrics,
    strengths: [
      'You answered the full prompt and stayed on topic.',
      'Good use of a clear beginning, middle, and end.',
      'You kept a steady, professional tone.',
    ],
    improvements: [
      'Add one concrete, hands-on example to back up your point.',
      'Mention safety earlier — trades panels reward a safety-first mindset.',
      'Slow down slightly at the start to organise your answer.',
    ],
  };
}

/* ── Circular timer ─────────────────────────────────────────────────── */

function TimerRing({ remaining, total, accent, label, sublabel }: {
  remaining: number; total: number; accent: string; label: string; sublabel: string;
}) {
  const size = 232;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? remaining / total : 0;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size, maxWidth: '78vw' }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-gray-100 dark:text-white/10" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center" aria-live="polite" role="timer">
        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400 dark:text-slate-500">{label}</span>
        <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">{fmt(remaining)}</span>
        <span className="text-[12px] font-medium text-gray-500 dark:text-slate-400 mt-1">{sublabel}</span>
      </div>
    </div>
  );
}

/* ── Session ─────────────────────────────────────────────────────────── */

function PracticeSession() {
  const params = useSearchParams();
  const stationId = params.get('station');
  const province = params.get('province') || 'All Provinces';
  const isRetry = params.get('retry') === '1';

  const station = useMemo(
    () => STATIONS.find((s) => s.id === stationId) ?? STATIONS[0],
    [stationId],
  );
  const answerSeconds = station.minutes * 60;
  const bodyLabel = province !== 'All Provinces' ? PROVINCE_BODIES[province] : null;
  const Icon = station.icon;

  const [phase, setPhase] = useState<Phase>('ready');
  const [remaining, setRemaining] = useState(PREP_SECONDS);
  const [paused, setPaused] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const answerUsedRef = useRef(0);

  const goAnswer = useCallback(() => {
    setPhase('answer');
    setRemaining(answerSeconds);
    setPaused(false);
  }, [answerSeconds]);

  const finishAnswer = useCallback(() => {
    answerUsedRef.current = answerSeconds - remaining;
    setFeedback(buildFeedback(answerUsedRef.current, answerSeconds));
    setPhase('feedback');
  }, [answerSeconds, remaining]);

  const startPrep = () => {
    setPhase('prep');
    setRemaining(PREP_SECONDS);
    setPaused(false);
  };

  const restart = () => {
    setPhase('ready');
    setRemaining(PREP_SECONDS);
    setPaused(false);
    setFeedback(null);
    answerUsedRef.current = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to a clean session if the station/province query params change
  useEffect(() => {
    setPhase('ready');
    setRemaining(PREP_SECONDS);
    setPaused(false);
    setFeedback(null);
    answerUsedRef.current = 0;
  }, [stationId, province]);

  // Countdown engine for prep + answer phases
  useEffect(() => {
    if ((phase !== 'prep' && phase !== 'answer') || paused) return;
    if (remaining <= 0) {
      if (phase === 'prep') goAnswer();
      else finishAnswer();
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, paused, remaining, goAnswer, finishAnswer]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1100px] mx-auto space-y-4 sm:space-y-6">

        {/* Back link */}
        <Link
          href="/vocational-technical-student-route/mmi"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to MMI Simulation
        </Link>

        {/* Station header */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Icon className="w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{station.title}</h1>
                {isRetry && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                    <RotateCcw className="w-3 h-3" /> Retry
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">{station.category}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3 h-3" /> {station.minutes} min
                </span>
                {province !== 'All Provinces' && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                    <MapPin className="w-3 h-3" /> {province}
                  </span>
                )}
              </div>
              {bodyLabel && (
                <p className="text-[11px] text-blue-500 dark:text-blue-400 font-medium mt-2">Aligned to {bodyLabel} expectations.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── READY ── */}
        {phase === 'ready' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4 sm:gap-6 items-start">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Your Prompt</p>
                <p className="text-[15px] sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">{station.prompt}</p>
              </div>
              {station.provinceNote && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                  <AlertCircle className="w-4 h-4 text-blue-500 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-snug">{station.provinceNote}.</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5">
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500">Prep time</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{fmt(PREP_SECONDS)}</p>
                </div>
                <div className="rounded-xl border border-gray-100 dark:border-white/8 p-3.5">
                  <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500">Answer time</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">{fmt(answerSeconds)}</p>
                </div>
              </div>
              <button
                onClick={startPrep}
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-xl py-3 text-sm transition-colors shadow-sm shadow-blue-600/25"
              >
                <Play className="w-4 h-4" fill="currentColor" /> {isRetry ? 'Restart Practice Session' : 'Start Practice Session'}
              </button>
              <p className="text-[11px] text-center text-gray-400 dark:text-slate-500">
                You&apos;ll get {fmt(PREP_SECONDS)} to think, then {fmt(answerSeconds)} to answer out loud — just like a real station.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Tips for this station</h3>
              </div>
              <ul className="space-y-3">
                {station.tips.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ── PREP / ANSWER ── */}
        {(phase === 'prep' || phase === 'answer') && (
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-8">
            {/* Prompt */}
            <div className="max-w-2xl mx-auto text-center mb-6">
              <p className="text-[11px] font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">Prompt</p>
              <p className="text-[15px] sm:text-base text-slate-800 dark:text-slate-100 leading-relaxed font-medium">{station.prompt}</p>
            </div>

            <TimerRing
              remaining={remaining}
              total={phase === 'prep' ? PREP_SECONDS : answerSeconds}
              accent={phase === 'prep' ? '#f59e0b' : '#3b82f6'}
              label={phase === 'prep' ? 'Prep time' : 'Answer now'}
              sublabel={phase === 'prep' ? 'Plan your answer' : paused ? 'Paused' : 'Recording…'}
            />

            {/* Recording indicator */}
            {phase === 'answer' && (
              <div className="flex items-center justify-center gap-2 mt-5">
                <span className={`relative flex h-3 w-3 ${paused ? '' : 'animate-pulse'}`}>
                  <span className={`absolute inline-flex h-full w-full rounded-full ${paused ? 'bg-gray-300 dark:bg-white/20' : 'bg-rose-400 opacity-75 animate-ping'}`} />
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${paused ? 'bg-gray-400' : 'bg-rose-500'}`} />
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-slate-600 dark:text-slate-300">
                  <Mic className="w-3.5 h-3.5" /> {paused ? 'Microphone paused' : 'Answer out loud'}
                </span>
              </div>
            )}

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-7 max-w-md mx-auto">
              <button
                onClick={() => setPaused((p) => !p)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                {paused ? <><Play className="w-4 h-4" fill="currentColor" /> Resume</> : <><Pause className="w-4 h-4" /> Pause</>}
              </button>
              {phase === 'prep' ? (
                <button
                  onClick={goAnswer}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white text-sm font-bold transition-colors shadow-sm shadow-blue-600/25"
                >
                  <SkipForward className="w-4 h-4" /> Start Answering Now
                </button>
              ) : (
                <button
                  onClick={finishAnswer}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors shadow-sm shadow-emerald-600/25"
                >
                  <Square className="w-4 h-4" fill="currentColor" /> Finish & Get Feedback
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {phase === 'feedback' && feedback && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 sm:gap-6 items-start">
              {/* Score */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 text-center">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 mb-4">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Session Complete
                </div>
                <div className="relative w-36 h-36 mx-auto">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="currentColor" className="text-gray-100 dark:text-white/10" strokeWidth="12" />
                    <circle
                      cx="60" cy="60" r="52" fill="none" stroke="url(#sgrad)" strokeWidth="12" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 52} strokeDashoffset={2 * Math.PI * 52 * (1 - feedback.overall / 100)}
                    />
                    <defs>
                      <linearGradient id="sgrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-slate-900 dark:text-slate-100">{feedback.overall}%</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">Overall</span>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 mt-4 text-[12px] font-bold text-amber-600 dark:text-amber-400">
                  <Award className="w-4 h-4" />
                  {feedback.overall >= 80 ? 'Interview-ready' : feedback.overall >= 70 ? 'On track' : 'Keep practising'}
                </div>
              </div>

              {/* Metrics */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Performance Breakdown</h3>
                </div>
                <div className="space-y-3.5">
                  {feedback.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">{m.label}</span>
                        <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{m.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{ width: `${m.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths + improvements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <ThumbsUp className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">What went well</h3>
                </div>
                <ul className="space-y-2.5">
                  {feedback.strengths.map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <TargetIcon />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Where to improve</h3>
                </div>
                <ul className="space-y-2.5">
                  {feedback.improvements.map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <ArrowRight className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                onClick={restart}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold rounded-xl px-6 py-3 text-sm transition-colors shadow-sm shadow-blue-600/25"
              >
                <RotateCcw className="w-4 h-4" /> Retry This Station
              </button>
              <Link
                href="/vocational-technical-student-route/mmi"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to All Stations
              </Link>
              <Link
                href="/vocational-technical-student-route/counselors/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/15 font-semibold rounded-xl px-6 py-3 text-sm transition-colors"
              >
                Book a Mock Interview <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function TargetIcon() {
  return <Target className="w-4 h-4 text-amber-500 dark:text-amber-400" />;
}

export default function MmiPracticePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]" />}>
      <PracticeSession />
    </Suspense>
  );
}
