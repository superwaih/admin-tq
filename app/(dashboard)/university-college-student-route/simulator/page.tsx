'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw, Target, Award, Zap, TrendingUp, Info,
  ChevronRight, BarChart3, Plus, ChevronUp, Lightbulb,
  ArrowUpRight, ChevronDown,
} from 'lucide-react';
import { PROGRAMS } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';
import { useStudentDashboard } from '@/src/hooks/useStudentDasboard';

// ── Constants ──────────────────────────────────────────────────────────────────

const GRADE_META = [
  { code: 'MHF4U', name: 'Advanced Functions', color: '#2563EB' },
  { code: 'MCV4U', name: 'Calculus & Vectors', color: '#7c3aed' },
  { code: 'SPH4U', name: 'Physics',             color: '#0891b2' },
  { code: 'ENG4U', name: 'English',             color: '#d97706' },
  { code: 'SCH4U', name: 'Chemistry',           color: '#0d9b6a' },
  { code: 'ICS4U', name: 'Computer Science',    color: '#dc2626' },
];

const ORIGINALS = [92, 89, 91, 85, 88, 94];

const CUTOFF_LABELS: Record<string, string> = {
  uoft:     '95–97%',
  waterloo: '93–96%',
  mcmaster: '94–97%',
  ubc:      '88–93%',
  queens:   '85–91%',
};

const PROGRAM_COLORS: Record<string, string> = {
  uoft:     '#2563EB',
  waterloo: '#d97706',
  mcmaster: '#dc2626',
  ubc:      '#0891b2',
  queens:   '#7c3aed',
};

const SHAP_FACTORS = [
  { label: 'Calculus grade', impact: 18, color: '#7c3aed' },
  { label: 'Physics grade',  impact: 12, color: '#0891b2' },
  { label: 'English grade',  impact:  8, color: '#d97706' },
];

const AIF_OPTIONS = ['High', 'Medium', 'Low'];

// ── Helpers ────────────────────────────────────────────────────────────────────

function gradeColor(v: number) {
  if (v >= 90) return '#10b981';
  if (v >= 80) return '#f59e0b';
  return '#ef4444';
}
function gradeLabel(v: number) {
  if (v >= 90) return 'Excellent';
  if (v >= 80) return 'Good';
  return 'Needs work';
}
function probColors(p: number) {
  if (p >= 70) return { text: 'text-emerald-600 dark:text-emerald-400', badge: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400', bar: '#10b981', label: 'Strong' };
  if (p >= 40) return { text: 'text-amber-600 dark:text-amber-400',   badge: 'bg-amber-50   dark:bg-amber-500/15   text-amber-700   dark:text-amber-400',   bar: '#f59e0b', label: 'Possible' };
  return             { text: 'text-red-500   dark:text-red-400',     badge: 'bg-red-50     dark:bg-red-500/15     text-red-700     dark:text-red-400',     bar: '#ef4444', label: 'Reach' };
}
function chanceLevel(p: number): { label: string; cls: string } {
  if (p >= 70) return { label: 'Strong Chance',  cls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' };
  if (p >= 50) return { label: 'Medium Chance',  cls: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' };
  return              { label: 'Low Chance',     cls: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' };
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function MiniRing({ value, color }: { value: number; color: string }) {
  const r = 20; const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-[52px] h-[52px] shrink-0">
      <svg width="52" height="52" className="-rotate-90">
        <circle cx="26" cy="26" r={r} fill="none" stroke="#f1f5f9" strokeWidth="4.5" className="dark:stroke-white/8"/>
        <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="4.5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16,1,0.3,1)' }}/>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold" style={{ color }}>{value}%</span>
    </div>
  );
}

function StatCard({ icon, label, value, sub, valueColor, iconBg, iconColor }: {
  icon: React.ReactNode; label: string; value: string; sub: string;
  valueColor: string; iconBg: string; iconColor: string;
}) {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow">
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', iconBg, iconColor)}>{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider truncate">{label}</p>
        <p className={cn('text-lg font-bold leading-tight', valueColor)}>{value}</p>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{sub}</p>
      </div>
    </div>
  );
}

// Scenario slider row
function ScenarioSlider({ label, value, onChange, min = 70, max = 100 }: {
  label: string; value: number; onChange: (v: number) => void; min?: number; max?: number;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 w-44 shrink-0">{label}</span>
      <div className="flex-1 relative h-5 flex items-center">
        <div className="absolute w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }}/>
        </div>
        <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
          style={{ left: `calc(${pct}% - 8px)` }}/>
        <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer"/>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-slate-400 dark:text-[#8e92ad]">{min}%</span>
        <span className="w-16 text-center text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2 py-1">{value}%</span>
        <span className="text-xs text-slate-400 dark:text-[#8e92ad]">{max}%</span>
      </div>
    </div>
  );
}


// ── Page ───────────────────────────────────────────────────────────────────────

export default function SimulatorPage() {
  const { grades, top6Avg, simulatedProbabilities, updateGrade } = useStudentDashboard();

  // New section state
  const [admissionAvg, setAdmissionAvg]         = useState(92);
  const [admissionCutoff, setAdmissionCutoff]   = useState(85);
  const [suppScore, setSuppScore]               = useState(78);
  const [aifQuality, setAifQuality]             = useState<string>('High');
  const [aifDropOpen, setAifDropOpen]           = useState(false);
  const [activeScenario, setActiveScenario]     = useState<'realistic' | 'optimist-best' | 'optimist-low' | 'custom'>('realistic');

  function resetGrades() { ORIGINALS.forEach((v, i) => updateGrade?.(i, v)); }

  const best = simulatedProbabilities.reduce(
    (a, b) => (a.probability > b.probability ? a : b),
    simulatedProbabilities[0] ?? { id: '', probability: 0 }
  );
  const bestProg     = PROGRAMS.find(p => p.id === best.id);
  const strongCount  = simulatedProbabilities.filter(p => p.probability >= 70).length;
  const currentChance = best.probability;
  const chanceLvl    = chanceLevel(currentChance);

  // Derived chance for scenario
  const scenarioChance =
    activeScenario === 'optimist-best' ? Math.min(100, currentChance + 12) :
    activeScenario === 'optimist-low'  ? Math.max(0,   currentChance - 31) :
    activeScenario === 'custom'        ? Math.min(100, currentChance + 5) :
    currentChance;

  // Chance breakdown computed from sliders
  const breakdown = [
    { label: 'Academic Averages',  value: `${admissionAvg}%`, delta: '+45%', positive: true },
    { label: 'Supplementary Score',value: `${admissionCutoff}%`, delta: '+20%', positive: true },
    { label: 'AIF Quality',        value: aifQuality,         delta: '+15%', positive: true },
    { label: 'Course Rigor',       value: 'High',             delta: '+10%', positive: true },
    { label: 'Extracurriculars',   value: 'N/A',              delta: '+0%',  positive: false },
  ];

  const SCENARIOS = [
    { key: 'realistic',     label: 'Realistic', sub: 'Current',   pct: currentChance,     pctColor: 'text-blue-600 dark:text-blue-400',   active: true  },
    { key: 'optimist-best', label: 'Optimist',  sub: 'Best Case', pct: Math.min(100, currentChance + 12), pctColor: 'text-emerald-600 dark:text-emerald-400', active: false },
    { key: 'optimist-low',  label: 'Optimist',  sub: 'Low end',   pct: Math.max(0, currentChance - 31),   pctColor: 'text-amber-500 dark:text-amber-400',    active: false },
    { key: 'custom',        label: 'Custom',    sub: 'Your own values', pct: null,          pctColor: '',  active: false },
  ] as const;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Admissions Simulator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Simulate your chances with different academic scenarios.</p>
          </div>
          <Link href="/university-college-student-route/simulator/new"
            className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-sm shadow-blue-600/25 transition-all">
            <Plus size={15}/> New Simulation
          </Link>
        </div>

        {/* ── Current Simulation + Your Chances ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr] gap-4">

          {/* Current Simulation */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Current Simulation</p>
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 text-blue-700 dark:text-blue-300 font-black text-sm border border-blue-100 dark:border-blue-500/30">
                En
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {bestProg?.name ?? 'UofT Engineering Science'}
                </p>
                <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5">
                  {bestProg?.university ?? 'University of Toronto'} · ON
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-2xl font-black text-amber-500 tabular-nums">{currentChance}%</span>
                <span className="text-[9px] font-bold px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 whitespace-nowrap">
                  Current Chance
                </span>
              </div>
            </div>
          </div>

          {/* Your Chances */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Your Chances</p>
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl font-black text-amber-500 tabular-nums">{scenarioChance}%</span>
                </div>
                <span className={`inline-flex text-[9px] font-bold px-2.5 py-1 rounded-full ${chanceLvl.cls}`}>
                  {chanceLvl.label}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                  <ChevronUp size={14}/> 6% with this changes
                </div>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1">vs. baseline</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Adjust Averages + Chance Breakdown ── */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-4 items-start">

          {/* Adjust your Averages */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Adjust your Averages</h2>

            <ScenarioSlider label="Adjust your Averages" value={admissionAvg} onChange={setAdmissionAvg}/>
            <ScenarioSlider label="Admission Averages"   value={admissionCutoff} onChange={setAdmissionCutoff}/>
            <ScenarioSlider label="Supplementary Score"  value={suppScore} onChange={setSuppScore}/>

            {/* AIF Quality row */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 w-44 shrink-0">AIF Quality</span>
              <div className="flex-1 relative h-5 flex items-center">
                <div className="absolute w-full h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: aifQuality === 'High' ? '80%' : aifQuality === 'Medium' ? '50%' : '25%' }}/>
                </div>
                <div className="absolute w-4 h-4 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
                  style={{ left: aifQuality === 'High' ? 'calc(80% - 8px)' : aifQuality === 'Medium' ? 'calc(50% - 8px)' : 'calc(25% - 8px)' }}/>
              </div>
              <div className="relative shrink-0">
                <button onClick={() => setAifDropOpen(v => !v)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg min-w-[80px] justify-between">
                  {aifQuality} <ChevronDown size={11} className="text-slate-400"/>
                </button>
                {aifDropOpen && (
                  <div className="absolute top-9 right-0 bg-white dark:bg-[#1e2335] border border-gray-100 dark:border-white/8 rounded-xl shadow-xl overflow-hidden z-20 w-28">
                    {AIF_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => { setAifQuality(opt); setAifDropOpen(false); }}
                        className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${aifQuality === opt ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Chance Breakdown */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Chance Breakdown</h2>
            <div className="space-y-3">
              {breakdown.map(b => (
                <div key={b.label} className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300 flex-1">{b.label}</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 w-12 text-right">{b.value}</span>
                  <span className={`text-xs font-bold w-12 text-right ${b.positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-[#8e92ad]'}`}>
                    {b.delta}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-[#8e92ad] font-medium">Estimated total boost</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400">+{b_total(breakdown)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Scenarios ── */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 dark:text-white mb-3">Scenarios</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIOS.map(s => (
              <button key={s.key} onClick={() => setActiveScenario(s.key)}
                className={`relative flex flex-col items-start p-4 rounded-2xl border transition-all text-left ${
                  activeScenario === s.key
                    ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 shadow-sm'
                    : 'bg-white dark:bg-[#161a27] border-gray-100 dark:border-white/6 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/40'
                }`}>
                {activeScenario === s.key && (
                  <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-600"/>
                )}
                <p className={`text-sm font-bold ${activeScenario === s.key ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200'}`}>
                  {s.label}
                </p>
                <p className={`text-[10px] mt-0.5 mb-3 ${activeScenario === s.key ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-[#8e92ad]'}`}>
                  {s.sub}
                </p>
                {s.pct !== null ? (
                  <span className={`text-2xl font-black tabular-nums ${s.pctColor}`}>{s.pct}%</span>
                ) : (
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    Create <ArrowUpRight size={12}/>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── How it works banner ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-4">
          <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
            <Lightbulb size={15} className="text-blue-600 dark:text-blue-400"/>
          </div>
          <div>
            <p className="text-xs font-bold text-blue-700 dark:text-blue-300">How it works</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 leading-relaxed">
              Our simulator uses historical data and program-specific factors to estimate your admission chances.
              Results are estimates, not guarantees. Focus on strengthening your overall application.
            </p>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Top‑6 Average" value={`${top6Avg.toFixed(1)}%`} sub="Ontario OUAC"
            icon={<Target size={16}/>} iconBg="bg-blue-50 dark:bg-blue-500/15" iconColor="text-blue-600"
            valueColor="text-blue-700 dark:text-blue-400"/>
          <StatCard label="Best Chance" value={`${best.probability}%`} sub={bestProg?.name ?? '—'}
            icon={<Award size={16}/>} iconBg="bg-emerald-50 dark:bg-emerald-500/15" iconColor="text-emerald-600"
            valueColor="text-emerald-700 dark:text-emerald-400"/>
          <StatCard label="Programs tracked" value={`${simulatedProbabilities.length}`} sub="3 provinces"
            icon={<Zap size={16}/>} iconBg="bg-purple-50 dark:bg-purple-500/15" iconColor="text-purple-600"
            valueColor="text-purple-700 dark:text-purple-400"/>
          <StatCard label="Strong chances" value={`${strongCount}`} sub="probability ≥ 70%"
            icon={<TrendingUp size={16}/>} iconBg="bg-amber-50 dark:bg-amber-500/15" iconColor="text-amber-500"
            valueColor="text-amber-600 dark:text-amber-400"/>
        </div>

        {/* ── Main two-column grid ── */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">

          {/* LEFT: grade sliders */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-50 dark:border-white/5">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Grade Inputs · Ontario OUAC</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Drag any slider — probabilities update instantly</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Top‑6 avg</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{top6Avg.toFixed(1)}%</p>
                </div>
                <button onClick={resetGrades}
                  className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-all">
                  <RotateCcw size={12}/> Reset
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {grades.map((value, index) => {
                const meta  = GRADE_META[index];
                const color = gradeColor(value);
                const pct   = ((value - 50) / 50) * 100;
                return (
                  <div key={meta.code} className="px-6 py-5 group">
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-3 h-3 rounded-full shrink-0 ring-2 ring-offset-2 dark:ring-offset-[#161a27]"
                          style={{ backgroundColor: meta.color }}/>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{meta.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{meta.code}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                          style={{ backgroundColor: color + '18', color }}>{gradeLabel(value)}</span>
                        <span className="text-xl font-bold tabular-nums min-w-[48px] text-right dark:text-slate-100" style={{ color }}>
                          {value}%
                        </span>
                      </div>
                    </div>
                    <div className="relative h-5 flex items-center">
                      <div className="absolute w-full h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-150" style={{ width:`${pct}%`, backgroundColor:color }}/>
                      </div>
                      <div className="absolute w-5 h-5 rounded-full border-2 border-white dark:border-[#161a27] shadow-md pointer-events-none transition-all duration-150"
                        style={{ left:`calc(${pct}% - 10px)`, backgroundColor:color, boxShadow:`0 0 0 3px ${color}30` }}/>
                      <input type="range" min={50} max={100} value={value}
                        onChange={e => updateGrade?.(index, Number(e.target.value))}
                        className="absolute w-full h-5 opacity-0 cursor-pointer"/>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-300 dark:text-slate-600 mt-1.5 px-0.5">
                      <span>50%</span><span>75%</span><span>100%</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-white/3 border-t border-gray-100 dark:border-white/5">
              <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Simulated top‑6 average</p>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{top6Avg.toFixed(1)}%</p>
            </div>
          </div>

          {/* RIGHT: probabilities + SHAP + CTA */}
          <div className="space-y-5">

            {/* Program probabilities */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Live Probability</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Updates as you move sliders</p>
                </div>
                <BarChart3 size={16} className="text-slate-300 dark:text-slate-600"/>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {simulatedProbabilities.map(prob => {
                  const program = PROGRAMS.find(p => p.id === prob.id);
                  if (!program) return null;
                  const pc     = probColors(prob.probability);
                  const pColor = PROGRAM_COLORS[prob.id] ?? '#6b7280';
                  return (
                    <div key={prob.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors">
                      <MiniRing value={prob.probability} color={pColor}/>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">{program.name}</p>
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', pc.badge)}>{pc.label}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{program.university}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-md',
                            program.province === 'ON'
                              ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                              : 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400')}>
                            {program.province}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">Cutoff {CUTOFF_LABELS[prob.id]}</span>
                        </div>
                        <div className="mt-2.5 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width:`${prob.probability}%`, backgroundColor:pc.bar }}/>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SHAP explainability */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">AI Explainability</h2>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Which courses matter most for UofT</p>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Info size={13} className="text-blue-500"/>
                </div>
              </div>
              <div className="space-y-4">
                {SHAP_FACTORS.map(f => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300">{f.label}</span>
                      <span className="text-[12px] font-bold" style={{ color:f.color }}>+{f.impact}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width:`${f.impact * 4.5}%`, backgroundColor:f.color }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Based on <span className="font-semibold text-slate-600 dark:text-slate-300">347 similar profiles</span>. Raising Calculus by 4% could boost UofT probability by ~8%.
                </p>
              </div>
            </div>

            {/* Strategy CTA */}
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-2xl p-5 text-white">
              <div className="absolute -top-5 -right-5 w-28 h-28 rounded-full bg-white/5"/>
              <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-full bg-white/5"/>
              <div className="relative">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1.5">AI Recommendation</p>
                <h3 className="text-sm font-bold leading-snug mb-3">
                  Raising Calculus to 92% gives the highest single-course probability gain.
                </h3>
                <Link href="/university-college-student-route/strategy"
                  className="flex items-center justify-center gap-2 w-full bg-white/15 hover:bg-white/25 text-white py-2.5 rounded-xl text-[13px] font-bold transition-all border border-white/20">
                  Open Strategy Advisor <ChevronRight size={14}/>
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Helper used inline above
function b_total(breakdown: { delta: string; positive: boolean }[]) {
  const sum = breakdown.reduce((acc, b) => {
    const n = parseInt(b.delta.replace(/[^0-9]/g, ''), 10);
    return acc + (b.positive && !isNaN(n) ? n : 0);
  }, 0);
  return `${sum}%`;
}
