'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, Bookmark, Square, Pause, Play, Mic, Type, Info,
  Lock, Sparkles, CheckCircle2, ChevronLeft, ChevronRight, Send,
  ThumbsUp, AlertTriangle, RotateCcw,
} from 'lucide-react';

type Phase = 'reading' | 'response' | 'submitted';
type ResponseMode = 'voice' | 'text';

const READING_SECONDS = 120; // 2 min
const RESPONSE_SECONDS = 360; // 6 min

interface Station {
  n: number;
  label: string;
  difficulty: 'Essay' | 'Medium' | 'Hard';
  status: 'done' | 'current' | 'upcoming';
}

const STATIONS: Station[] = [
  { n: 1, label: 'Essay', difficulty: 'Essay', status: 'done' },
  { n: 2, label: 'Current', difficulty: 'Medium', status: 'current' },
  { n: 3, label: 'Medium', difficulty: 'Medium', status: 'upcoming' },
  { n: 4, label: 'Medium', difficulty: 'Medium', status: 'upcoming' },
  { n: 5, label: 'Hard', difficulty: 'Hard', status: 'upcoming' },
  { n: 6, label: 'Hard', difficulty: 'Hard', status: 'upcoming' },
];

const TAGS = [
  { label: 'Reading Time', cls: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' },
  { label: 'Response Time', cls: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10' },
  { label: 'Ethical Dilemma', cls: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15' },
  { label: 'Teamwork', cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' },
];

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const card = 'bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm';

export default function MmiPracticePage() {
  const [phase, setPhase] = useState<Phase>('reading');
  const [paused, setPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState(READING_SECONDS);
  const [mode, setMode] = useState<ResponseMode>('voice');
  const [recording, setRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [text, setText] = useState('');

  const totalForPhase = phase === 'reading' ? READING_SECONDS : RESPONSE_SECONDS;

  // Main countdown timer
  useEffect(() => {
    if (phase === 'submitted' || paused) return;
    if (timeLeft <= 0) {
      if (phase === 'reading') {
        setPhase('response');
        setTimeLeft(RESPONSE_SECONDS);
      } else if (phase === 'response') {
        // Time is up — auto-submit and unlock feedback.
        setRecording(false);
        setPhase('submitted');
      }
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [phase, paused, timeLeft]);

  // Recording timer
  useEffect(() => {
    if (!recording) return;
    const id = setInterval(() => setRecordSecs((s) => Math.min(RESPONSE_SECONDS, s + 1)), 1000);
    return () => clearInterval(id);
  }, [recording]);

  const startResponse = () => {
    setPhase('response');
    setTimeLeft(RESPONSE_SECONDS);
    setPaused(false);
  };

  const submit = () => {
    setRecording(false);
    setPhase('submitted');
  };

  const reset = () => {
    setPhase('reading');
    setTimeLeft(READING_SECONDS);
    setPaused(false);
    setRecording(false);
    setRecordSecs(0);
    setText('');
  };

  const ringPct = useMemo(
    () => Math.max(0, Math.min(100, (timeLeft / totalForPhase) * 100)),
    [timeLeft, totalForPhase],
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-5">

        {/* Back */}
        <Link
          href="/university-college-student-route/mmi"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to MMI Simulator
        </Link>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">MMI Practice</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Practice real MMI scenarios and get AI-powered feedback to improve your performance.
            </p>
          </div>
          <div className="flex items-center gap-2.5 self-start shrink-0">
            <button className="flex items-center gap-2 px-3.5 h-10 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-[12px] font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
              <Bookmark size={14} /> Bookmark
            </button>
            <Link
              href="/university-college-student-route/mmi"
              className="flex items-center gap-2 px-3.5 h-10 bg-white dark:bg-white/5 border border-red-200 dark:border-red-500/30 rounded-xl text-[12px] font-semibold text-red-600 dark:text-red-400 shadow-sm hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <Square size={13} /> End Session
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div className={`${card} px-5 py-4`}>
          <div className="flex items-center justify-between gap-4 mb-2.5">
            <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300">Station 2 of 6</span>
            <div className="flex items-center gap-6 text-right">
              <div className="hidden sm:block">
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">Estimated Time</p>
                <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400">49 min remaining</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide">Overall Progress</p>
                <p className="text-[12px] font-bold text-blue-600 dark:text-blue-400">16%</p>
              </div>
            </div>
          </div>
          <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" style={{ width: '16%' }} />
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">

          {/* Left / center column */}
          <div className="xl:col-span-8 space-y-5">
            {/* Scenario card */}
            <div className={`${card} p-5 sm:p-6`}>
              <div className="flex flex-wrap gap-2 mb-5">
                {TAGS.map((t) => (
                  <span key={t.label} className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${t.cls}`}>
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-2">Scenario</h2>
                  <p className="text-[13px] leading-relaxed text-slate-600 dark:text-slate-400">
                    You are working on a group project with three other classmates. One of your teammates
                    is consistently not completing their part of the work but still expects to receive the
                    same grade as everyone else.
                  </p>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-5 mb-2">
                    What would you do in this situation?
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    You have <span className="font-bold text-slate-700 dark:text-slate-200">2 minutes</span> to read and think.
                  </p>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    You have <span className="font-bold text-slate-700 dark:text-slate-200">6 minutes</span> to respond.
                  </p>
                </div>

                {/* Circular timer */}
                <div className="flex flex-col items-center justify-center">
                  <CircularTimer
                    pct={ringPct}
                    label={phase === 'reading' ? 'Reading Time Left' : phase === 'response' ? 'Response Time Left' : 'Session Complete'}
                    time={phase === 'submitted' ? '00:00' : fmt(timeLeft)}
                    danger={phase !== 'submitted' && timeLeft <= 15}
                  />
                  <div className="mt-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-lg px-3 py-1.5">
                    Total Time: 8:00
                  </div>
                </div>
              </div>
            </div>

            {/* Info banner */}
            <div className="flex items-center gap-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-3">
              <Info size={15} className="text-blue-500 dark:text-blue-400 shrink-0" />
              <p className="text-[12px] font-medium text-blue-700 dark:text-blue-300">
                {phase === 'reading'
                  ? 'Use this time to read the scenario carefully and think about your response.'
                  : phase === 'response'
                    ? 'Record or type your response. It will be submitted automatically when time is up.'
                    : 'Session complete. Review your AI feedback on the right to improve your performance.'}
              </p>
            </div>

            {/* Control buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {phase === 'submitted' ? (
                <Button
                  onClick={reset}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-semibold text-sm shadow-sm shadow-blue-200 dark:shadow-blue-900/20 flex gap-2 w-full sm:w-auto"
                >
                  <RotateCcw size={15} /> Restart Station
                </Button>
              ) : (
                <>
                  <button
                    onClick={() => setPaused((p) => !p)}
                    className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-all w-full sm:w-auto"
                  >
                    {paused ? <Play size={14} /> : <Pause size={14} />}
                    {paused ? 'Resume' : phase === 'reading' ? 'Pause Reading' : 'Pause Response'}
                  </button>

                  {phase === 'reading' && (
                    <Button
                      onClick={startResponse}
                      className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-6 font-semibold text-sm shadow-sm shadow-blue-200 dark:shadow-blue-900/20 flex gap-2 w-full sm:w-auto sm:flex-1 sm:max-w-xs sm:mx-auto"
                    >
                      <Play size={14} fill="white" /> Start Response Time
                    </Button>
                  )}

                  <button
                    onClick={submit}
                    className="flex items-center justify-center gap-2 h-11 px-5 rounded-xl border border-red-200 dark:border-red-500/30 bg-white dark:bg-white/5 text-[13px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all w-full sm:w-auto"
                  >
                    <Square size={13} /> Stop Station
                  </button>
                </>
              )}
            </div>

            {/* All stations */}
            <div className={`${card} p-5`}>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">All Stations</h3>
              <div className="flex items-center gap-1 overflow-x-auto pb-1">
                {STATIONS.map((s, i) => (
                  <div key={s.n} className="flex items-center shrink-0">
                    <div className="flex flex-col items-center gap-1.5 w-16">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold ${
                          s.status === 'done'
                            ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                            : s.status === 'current'
                              ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-500/20'
                              : 'bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {s.status === 'done' ? <CheckCircle2 size={16} /> : s.n}
                      </div>
                      <span
                        className={`text-[10px] font-semibold ${
                          s.status === 'current' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < STATIONS.length - 1 && (
                      <div className={`h-0.5 w-6 sm:w-10 ${s.status === 'done' ? 'bg-emerald-300 dark:bg-emerald-500/40' : 'bg-slate-200 dark:bg-white/10'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-white/6">
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  <ChevronLeft size={14} /> Previous
                </button>
                <button className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Next Station <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="xl:col-span-4 space-y-5">
            {/* AI Recommendation */}
            <div className={`${card} overflow-hidden`}>
              <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-500/10 dark:to-blue-500/10 border-b border-slate-100 dark:border-white/6">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-violet-500 dark:text-violet-400" />
                  <span className="text-[12px] font-bold text-slate-700 dark:text-slate-200">AI Recommendation</span>
                </div>
                {phase !== 'submitted' && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-white/60 dark:bg-white/10 px-2 py-0.5 rounded-full">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
              {phase === 'submitted' ? <AiFeedback /> : (
                <div className="px-6 py-8 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-white/8 flex items-center justify-center mb-3">
                    <Lock size={20} className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200">Complete your response to unlock AI feedback</p>
                  <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-1.5">
                    Your feedback will appear here after you submit your response.
                  </p>
                </div>
              )}
            </div>

            {/* Response Input */}
            <div className={`${card} p-5`}>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Response Input</h3>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 mb-4">Choose your preferred method to respond.</p>

              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setMode('voice')}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold transition-all ${
                    mode === 'voice'
                      ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                      : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                  }`}
                >
                  <Mic size={13} /> Voice Recording
                </button>
                <button
                  onClick={() => setMode('text')}
                  className={`flex-1 flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold transition-all ${
                    mode === 'text'
                      ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                      : 'bg-white dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10'
                  }`}
                >
                  <Type size={13} /> Text Response
                </button>
              </div>

              {mode === 'voice' ? (
                <div className="flex flex-col items-center">
                  <div className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-500 mb-2">
                    <span>{fmt(recordSecs)} / 06:00</span>
                    {recording && <span className="flex items-center gap-1 text-red-500"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> Recording</span>}
                  </div>
                  <Waveform active={recording} />
                  <button
                    onClick={() => setRecording((r) => !r)}
                    disabled={phase === 'submitted'}
                    className={`mt-4 w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      recording ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {recording ? <Square size={16} className="text-white" fill="white" /> : <Mic size={18} className="text-white" />}
                  </button>
                  <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 mt-3">
                    {recording ? 'Recording your response…' : 'Click the microphone to start recording'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 text-center">You will have 6 minutes to record your response.</p>
                </div>
              ) : (
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={phase === 'submitted'}
                  placeholder="Type your response to the scenario here…"
                  className="w-full h-40 resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 px-3.5 py-3 text-[13px] leading-relaxed text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-300 dark:focus:border-blue-500/40 placeholder:text-slate-300 dark:placeholder:text-slate-600 disabled:opacity-60"
                />
              )}
            </div>

            {/* Autosave note + submit */}
            <div className="flex items-start gap-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-3">
              <Info size={14} className="text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Your recording is saved automatically and will be submitted when time is up or when you click submit.
              </p>
            </div>

            <Button
              onClick={submit}
              disabled={phase === 'submitted'}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-white/10 disabled:text-slate-500 text-white rounded-xl h-11 font-semibold text-sm shadow-sm shadow-blue-200 dark:shadow-blue-900/20 flex gap-2"
            >
              {phase === 'submitted' ? <><CheckCircle2 size={15} /> Submitted</> : <><Send size={15} /> Submit Response</>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CircularTimer({ pct, label, time, danger }: { pct: number; label: string; time: string; danger?: boolean }) {
  const r = 70;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className="relative w-44 h-44">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" strokeWidth="10" className="stroke-slate-100 dark:stroke-white/10" />
        <circle
          cx="80" cy="80" r={r} fill="none" strokeWidth="10" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          className={`transition-all duration-1000 ease-linear ${danger ? 'stroke-red-500' : 'stroke-blue-600 dark:stroke-blue-500'}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold tabular-nums ${danger ? 'text-red-500' : 'text-slate-800 dark:text-slate-100'}`}>{time}</span>
        <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 mt-1">{label}</span>
      </div>
    </div>
  );
}

function Waveform({ active }: { active: boolean }) {
  const bars = [8, 16, 24, 14, 28, 20, 32, 18, 26, 12, 22, 30, 16, 24, 10, 20, 28, 14, 22, 8];
  return (
    <div className="w-full h-16 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 flex items-center justify-center gap-1 px-3 overflow-hidden">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-1 rounded-full ${active ? 'bg-blue-500 dark:bg-blue-400 animate-pulse' : 'bg-slate-300 dark:bg-white/20'}`}
          style={{ height: `${h}px`, animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

function AiFeedback() {
  const items = [
    { Icon: ThumbsUp, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15', title: 'Clear ethical reasoning', body: 'You identified the core conflict and weighed fairness against team cohesion.' },
    { Icon: ThumbsUp, cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15', title: 'Empathetic tone', body: 'You considered your teammate\u2019s perspective before judging.' },
    { Icon: AlertTriangle, cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15', title: 'Add a concrete next step', body: 'Mention how you would escalate to the instructor if the issue persists.' },
  ];
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] font-semibold text-slate-500 dark:text-slate-400">Overall Score</span>
        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">86<span className="text-[12px] text-slate-400 dark:text-slate-500">/100</span></span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden mb-4">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: '86%' }} />
      </div>
      <div className="space-y-2.5">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2.5">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${it.cls}`}>
              <it.Icon size={14} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-700 dark:text-slate-200">{it.title}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{it.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
