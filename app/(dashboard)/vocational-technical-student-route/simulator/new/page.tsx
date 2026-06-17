'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Save, Play,
  Plus, Trash2, Info, Sparkles, TrendingUp,
  ArrowUpRight, CheckCircle2, Wrench, GraduationCap,
  Building2, BadgeCheck, Clock, Award,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ProgramType = 'Apprenticeship' | 'College/Technical Diploma';

interface Province {
  id: string; name: string; body: string; institute: string;
  demand: 'High' | 'Medium' | 'Low'; comp: number;
}
interface Program {
  id: string; name: string; code: string; type: ProgramType;
  reqAvg: number; reqEnglish: number; reqMath: number; reqScience: number;
  scienceLabel: string; redSeal: boolean; needsSponsor: boolean;
  minHours: number; minAptitude: number; blurb: string;
}
interface Subject { id: number; code: string; name: string; grade: number; color: string }

// ── Data (matches /simulator) ───────────────────────────────────────────────

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
  { id: 'electrician', name: 'Electrician', code: '309A', type: 'Apprenticeship', reqAvg: 70, reqEnglish: 65, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11/12', redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 70, blurb: 'Construction & maintenance electrician — a Red Seal trade with strong demand nationwide.' },
  { id: 'automotive', name: 'Automotive Service Technician', code: '310S', type: 'Apprenticeship', reqAvg: 65, reqEnglish: 60, reqMath: 65, reqScience: 60, scienceLabel: 'Science 11', redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 65, blurb: 'Diagnose and repair modern vehicles — a Red Seal trade requiring an employer sponsor.' },
  { id: 'welder', name: 'Welder', code: '456A', type: 'Apprenticeship', reqAvg: 60, reqEnglish: 55, reqMath: 60, reqScience: 55, scienceLabel: 'Science 10/11', redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 60, blurb: 'Join and fabricate metal structures — strong manual dexterity and Red Seal pathway.' },
  { id: 'hvac-app', name: 'HVAC / Refrigeration Mechanic', code: '313A', type: 'Apprenticeship', reqAvg: 68, reqEnglish: 60, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11', redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 68, blurb: 'Install and service heating, cooling and refrigeration systems — a Red Seal trade.' },
  { id: 'plumbing', name: 'Plumber', code: '306A', type: 'Apprenticeship', reqAvg: 65, reqEnglish: 60, reqMath: 68, reqScience: 60, scienceLabel: 'Science 11', redSeal: true, needsSponsor: true, minHours: 720, minAptitude: 65, blurb: 'Install and repair piping systems — a Red Seal trade in high demand.' },
  { id: 'civil-tech', name: 'Construction / Civil Engineering Technician', code: 'CET', type: 'College/Technical Diploma', reqAvg: 70, reqEnglish: 65, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11/12', redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 60, blurb: 'Diploma program covering surveying, estimating and site inspection.' },
  { id: 'elec-eng-tech', name: 'Electrical Engineering Technology', code: 'EET', type: 'College/Technical Diploma', reqAvg: 72, reqEnglish: 65, reqMath: 72, reqScience: 70, scienceLabel: 'Physics 12', redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 60, blurb: 'Advanced diploma in electrical/electronics systems and controls.' },
  { id: 'hvac-tech', name: 'HVAC Engineering Technician', code: 'HVT', type: 'College/Technical Diploma', reqAvg: 68, reqEnglish: 60, reqMath: 70, reqScience: 65, scienceLabel: 'Physics 11', redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 58, blurb: 'Diploma focused on building mechanical systems and energy efficiency.' },
  { id: 'network-tech', name: 'Computer / Network Technician', code: 'CNT', type: 'College/Technical Diploma', reqAvg: 70, reqEnglish: 65, reqMath: 68, reqScience: 60, scienceLabel: 'Science 11', redSeal: false, needsSponsor: false, minHours: 0, minAptitude: 60, blurb: 'Hands-on diploma in networking, hardware support and IT infrastructure.' },
];

const PROGRAM_TYPES: ProgramType[] = ['Apprenticeship', 'College/Technical Diploma'];
const TREND_OPTIONS      = ['Improving', 'Stable', 'Declining'];
const STRENGTH_OPTIONS   = ['Excellent', 'Strong', 'Good', 'Fair'];
const READINESS_OPTIONS  = ['High', 'Medium', 'Low'];

const SUBJECT_COLORS = ['#2563EB', '#7c3aed', '#0891b2', '#d97706', '#0d9b6a', '#dc2626', '#db2777', '#059669'];

const DEFAULT_SUBJECTS: Subject[] = [
  { id: 1, code: 'ENG4U', name: 'English 12', grade: 78, color: '#2563EB' },
  { id: 2, code: 'MAP4C', name: 'Apprenticeship / Workplace Math 12', grade: 80, color: '#7c3aed' },
  { id: 3, code: 'SPH3U', name: 'Physics 11', grade: 76, color: '#0891b2' },
  { id: 4, code: 'TDJ3M', name: 'Technological Design', grade: 84, color: '#d97706' },
  { id: 5, code: 'TTJ4C', name: 'Transportation Tech (Auto)', grade: 86, color: '#0d9b6a' },
  { id: 6, code: 'TCJ3E', name: 'Construction / Welding Tech', grade: 88, color: '#dc2626' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function gradeColor(v: number) { return v >= 90 ? '#10b981' : v >= 75 ? '#f59e0b' : '#ef4444'; }
function gradeLabel(v: number) { return v >= 90 ? 'Excellent' : v >= 75 ? 'Good' : 'Needs work'; }
function avg(subjects: Subject[]) {
  if (!subjects.length) return 0;
  return Math.round(subjects.reduce((s, x) => s + x.grade, 0) / subjects.length);
}

function computeProbability(
  program: Program, province: Province,
  i: { overallAvg: number; englishGrade: number; mathGrade: number; scienceGrade: number; aptitudeScore: number; sponsorSecured: boolean; hoursLogged: number; },
) {
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

// ── Sub-components ────────────────────────────────────────────────────────────

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: { value: string; label: string }[]; onChange: (v: string) => void;
}) {
  const id = `sel-${label.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`;
  return (
    <div className="flex-1 min-w-[150px]">
      {label && <label htmlFor={id} className="block text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">{label}</label>}
      <div className="relative">
        <select id={id} value={value} onChange={e => onChange(e.target.value)}
          className="w-full appearance-none h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer">
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function SectionHeader({ n, title, sub }: { n: string; title: string; sub?: string }) {
  return (
    <div className="flex items-start gap-2 mb-4">
      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
        <span className="text-[10px] font-black text-white">{n}</span>
      </div>
      <div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h2>
        {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function GradeSlider({ subject, onChange }: { subject: Subject; onChange: (g: number) => void }) {
  const pct = ((subject.grade - 50) / 50) * 100;
  const color = gradeColor(subject.grade);
  return (
    <div className="px-5 py-4 group hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: subject.color }} />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">{subject.name}</p>
            <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500">{subject.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: color + '18', color }}>
            {gradeLabel(subject.grade)}
          </span>
          <span className="text-base font-bold tabular-nums min-w-[40px] text-right" style={{ color }}>{subject.grade}%</span>
        </div>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-150" style={{ width: `${pct}%`, backgroundColor: color }} />
        </div>
        <div className="absolute w-5 h-5 rounded-full border-2 border-white dark:border-[#161a27] shadow-md pointer-events-none"
          style={{ left: `calc(${pct}% - 10px)`, backgroundColor: color, boxShadow: `0 0 0 3px ${color}30` }} />
        <input type="range" min={50} max={100} value={subject.grade} onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer" aria-label={`${subject.name} grade`} />
      </div>
      <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-0.5">
        <span>50%</span><span>75%</span><span>100%</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CreateSimulationPage() {
  // Target program
  const [provinceId, setProvinceId] = useState('ON');
  const [programType, setProgramType] = useState<ProgramType>('Apprenticeship');
  const [programId, setProgramId] = useState('electrician');

  // Academic profile
  const [acadAvg, setAcadAvg] = useState(78);
  const [englishGrade, setEnglishGrade] = useState(75);
  const [mathGrade, setMathGrade] = useState(76);
  const [scienceGrade, setScienceGrade] = useState(74);
  const [gradeTrend, setGradeTrend] = useState('Improving');

  // Readiness / supplemental (vocational)
  const [sponsorSecured, setSponsorSecured] = useState(true);
  const [hoursLogged, setHoursLogged] = useState(600);
  const [safetyCerts, setSafetyCerts] = useState('Strong');   // WHMIS / Working at Heights / First Aid
  const [reference, setReference] = useState('Strong');        // employer / shop-teacher reference

  // Interview / aptitude
  const [aptitudeScore, setAptitudeScore] = useState(75);
  const [interviewReadiness, setInterviewReadiness] = useState('High');

  // Grade inputs
  const [subjects, setSubjects] = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [addingSubject, setAddingSubject] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newGrade, setNewGrade] = useState(80);

  const province = PROVINCES.find(p => p.id === provinceId) ?? PROVINCES[0];
  const programOptions = useMemo(() => PROGRAMS.filter(p => p.type === programType), [programType]);
  const program = PROGRAMS.find(p => p.id === programId) ?? programOptions[0] ?? PROGRAMS[0];
  const isApprenticeship = program.type === 'Apprenticeship';

  // Derived
  const avgGrade = avg(subjects);
  const inputs = { overallAvg: acadAvg, englishGrade, mathGrade, scienceGrade, aptitudeScore, sponsorSecured, hoursLogged };
  const chance = computeProbability(program, province, inputs);
  const optChance = Math.min(99, chance + 14);
  const consChance = Math.max(5, chance - 14);
  const bestChance = Math.min(99, chance + 19);
  const chanceLabel = chance >= 70 ? { text: 'Strong Chance', cls: 'text-emerald-600 dark:text-emerald-400' }
    : chance >= 50 ? { text: 'Medium Chance', cls: 'text-amber-500 dark:text-amber-400' }
      : { text: 'Building', cls: 'text-red-500 dark:text-red-400' };
  const trendBadge = gradeTrend === 'Improving' ? { cls: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', label: 'Good Trend' }
    : gradeTrend === 'Stable' ? { cls: 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300', label: 'Stable Trend' }
      : { cls: 'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300', label: 'Declining Trend' };
  const reqAvg = program.reqAvg + province.comp;

  // Explainability factors (relative to selected program/province)
  const factors = [
    { label: 'Overall average vs requirement', impact: clamp(Math.round((acadAvg - reqAvg) * 2), -30, 30), color: '#2563EB' },
    { label: 'Math grade', impact: clamp(Math.round((mathGrade - program.reqMath) * 0.7), -20, 20), color: '#7c3aed' },
    { label: 'Entrance / aptitude test', impact: clamp(Math.round((aptitudeScore - program.minAptitude) * 0.35), -15, 15), color: '#0891b2' },
    ...(isApprenticeship && program.needsSponsor
      ? [{ label: 'Employer sponsorship', impact: sponsorSecured ? 14 : -20, color: '#0d9b6a' }]
      : []),
  ];
  const maxAbs = Math.max(10, ...factors.map(f => Math.abs(f.impact)));

  function updateSubject(id: number, grade: number) {
    setSubjects(s => s.map(x => x.id === id ? { ...x, grade } : x));
  }
  function removeSubject(id: number) {
    setSubjects(s => s.filter(x => x.id !== id));
  }
  function addSubject() {
    if (!newName.trim()) return;
    const color = SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length];
    const grade = clamp(Math.round(newGrade), 50, 100);
    setSubjects(s => [...s, { id: Date.now(), code: newCode || 'NEW', name: newName, grade, color }]);
    setNewCode(''); setNewName(''); setNewGrade(80); setAddingSubject(false);
  }

  // Donut
  const R = 56; const circ = 2 * Math.PI * R;
  const chanceColor = chance >= 70 ? '#10b981' : chance >= 50 ? '#f59e0b' : '#ef4444';

  const SCENARIOS = [
    { label: 'Realistic Scenario', sub: 'Your current profile', pct: chance, pctCls: 'text-blue-600 dark:text-blue-400', bgCls: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30', icon: '🎯' },
    { label: 'Optimistic Scenario', sub: 'Above-average intake', pct: optChance, pctCls: 'text-emerald-600 dark:text-emerald-400', bgCls: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', icon: '🚀' },
    { label: 'Conservative Scenario', sub: 'Competitive intake', pct: consChance, pctCls: 'text-amber-500 dark:text-amber-400', bgCls: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30', icon: '🌤' },
    { label: 'Best Case Scenario', sub: 'Strongest profile', pct: bestChance, pctCls: 'text-violet-600 dark:text-violet-400', bgCls: 'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30', icon: '⭐' },
  ];

  const provinceOpts = PROVINCES.map(p => ({ value: p.id, label: p.name }));
  const typeOpts = PROGRAM_TYPES.map(t => ({ value: t, label: t }));
  const programOpts = programOptions.map(p => ({ value: p.id, label: `${p.name}${p.code ? ` (${p.code})` : ''}` }));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="min-w-0">
            <Link href="/vocational-technical-student-route/simulator" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
              <ChevronLeft size={15} /> Back to Simulator
            </Link>
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">Create New Simulation</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Estimate your chances of admission into a vocational or technical program in your province.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 transition-all">
              <Save size={13} /> Save Draft
            </button>
            <Link href="/vocational-technical-student-route/simulator"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/25">
              <Play size={13} /> Run Simulation <ChevronRight size={13} />
            </Link>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="flex-1 min-w-0 w-full space-y-4 sm:space-y-5">

            {/* 1. Target Program */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <SectionHeader n="1" title="Target Program" sub="Choose the province and trade or technical program you're aiming for." />

              {/* Program type toggle */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PROGRAM_TYPES.map(t => {
                  const active = programType === t;
                  return (
                    <button key={t}
                      onClick={() => {
                        setProgramType(t);
                        const first = PROGRAMS.find(p => p.type === t);
                        if (first) setProgramId(first.id);
                      }}
                      className={`flex items-center justify-center gap-2 h-11 rounded-xl border text-xs sm:text-sm font-bold transition-all ${active
                        ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300'
                        : 'bg-white dark:bg-[#1a1f30] border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                      {t === 'Apprenticeship' ? <Wrench size={15} /> : <GraduationCap size={15} />}
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3">
                <SelectField label="Province / Territory" value={provinceId} options={provinceOpts} onChange={setProvinceId} />
                <SelectField label="Program Type" value={programType} options={typeOpts}
                  onChange={(v) => { setProgramType(v as ProgramType); const first = PROGRAMS.find(p => p.type === v); if (first) setProgramId(first.id); }} />
                <SelectField label="Target Program / Trade" value={programId} options={programOpts} onChange={setProgramId} />
              </div>

              {/* Context chips */}
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
                  <Building2 size={12} /> {province.body}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
                  <GraduationCap size={12} /> {province.institute}
                </span>
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg ${province.demand === 'High' ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300' : province.demand === 'Medium' ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300' : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300'}`}>
                  <TrendingUp size={12} /> {province.demand} regional demand
                </span>
                {program.redSeal && (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300">
                    <Award size={12} /> Red Seal trade
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 leading-relaxed">{program.blurb}</p>
            </div>

            {/* 2. Academic Profile */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-5">
              <SectionHeader n="2" title="Academic Profile" sub="Your high-school grades against this program's prerequisites." />

              {[
                { label: 'Overall average', val: acadAvg, set: setAcadAvg, req: reqAvg },
                { label: 'English 12', val: englishGrade, set: setEnglishGrade, req: program.reqEnglish },
                { label: 'Math (Apprenticeship / Foundations)', val: mathGrade, set: setMathGrade, req: program.reqMath },
                { label: program.scienceLabel, val: scienceGrade, set: setScienceGrade, req: program.reqScience },
              ].map(s => {
                const pct = ((s.val - 50) / 50) * 100;
                const met = s.val >= s.req;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{s.label}</span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${met ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>req {s.req}%</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1">{s.val}%</span>
                      </div>
                    </div>
                    <div className="relative h-5 flex items-center">
                      <div className="absolute w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
                        style={{ left: `calc(${pct}% - 10px)` }} />
                      <input type="range" min={50} max={100} value={s.val} onChange={e => s.set(Number(e.target.value))}
                        className="absolute w-full h-5 opacity-0 cursor-pointer" aria-label={s.label} />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-0.5">
                      <span>50%</span><span>100%</span>
                    </div>
                  </div>
                );
              })}

              {/* Grade Trend */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Grade Trend</span>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select value={gradeTrend} onChange={e => setGradeTrend(e.target.value)}
                      className="appearance-none h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                      {TREND_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${trendBadge.cls}`}>
                    <TrendingUp size={10} /> {trendBadge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Work Readiness & Documents */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-5">
              <SectionHeader n="3" title="Work Readiness & Documents" sub="Apprenticeship registration and college applications weigh these too." />

              {/* Sponsor + hours (apprenticeship) */}
              {isApprenticeship ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Employer sponsorship secured</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Most apprenticeship intakes require a sponsoring employer to register.</p>
                    </div>
                    <button onClick={() => setSponsorSecured(v => !v)}
                      role="switch" aria-checked={sponsorSecured} aria-label="Employer sponsorship secured"
                      className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${sponsorSecured ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/15'}`}>
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${sponsorSecured ? 'translate-x-6' : ''}`} />
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">On-the-job hours logged</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1">{hoursLogged} hrs</span>
                    </div>
                    <div className="relative h-5 flex items-center">
                      <div className="absolute w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(hoursLogged / 1500) * 100}%` }} />
                      </div>
                      <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
                        style={{ left: `calc(${(hoursLogged / 1500) * 100}% - 10px)` }} />
                      <input type="range" min={0} max={1500} step={30} value={hoursLogged} onChange={e => setHoursLogged(Number(e.target.value))}
                        className="absolute w-full h-5 opacity-0 cursor-pointer" aria-label="On-the-job hours logged" />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-0.5">
                      <span>0</span><span>Target {program.minHours} hrs</span><span>1500</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-3.5">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[12px] text-blue-700 dark:text-blue-300 leading-relaxed">
                    College/technical diplomas admit on grades and prerequisites — no employer sponsor or logged hours required to apply.
                  </p>
                </div>
              )}

              {/* Safety certs + reference */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { label: 'Safety certifications (WHMIS, First Aid)', val: safetyCerts, set: setSafetyCerts },
                  { label: 'Employer / shop-teacher reference', val: reference, set: setReference },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">{f.label}</p>
                    <div className="relative">
                      <select value={f.val} onChange={e => f.set(e.target.value)}
                        className="w-full appearance-none h-9 pl-3 pr-7 text-xs font-medium bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                        {STRENGTH_OPTIONS.map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Admission Interview / Aptitude */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-5">
              <SectionHeader n="4" title="Admission Interview / Aptitude" sub="Many trades programs use an entrance test or interview." />

              <div>
                <div className="flex items-center justify-between mb-2 gap-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Entrance / aptitude test score</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${aptitudeScore >= program.minAptitude ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300'}`}>req {program.minAptitude}%</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1">{aptitudeScore}%</span>
                  </div>
                </div>
                <div className="relative h-5 flex items-center">
                  <div className="absolute w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${aptitudeScore}%` }} />
                  </div>
                  <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
                    style={{ left: `calc(${aptitudeScore}% - 10px)` }} />
                  <input type="range" min={0} max={100} value={aptitudeScore} onChange={e => setAptitudeScore(Number(e.target.value))}
                    className="absolute w-full h-5 opacity-0 cursor-pointer" aria-label="Entrance / aptitude test score" />
                </div>
                <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-0.5">
                  <span>0</span><span>50</span><span>100</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Interview readiness</span>
                <div className="relative">
                  <select value={interviewReadiness} onChange={e => setInterviewReadiness(e.target.value)}
                    className="appearance-none h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                    {READINESS_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <Link href="/vocational-technical-student-route/mmi"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                Practice interview & aptitude stations <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* 5. Grade Inputs */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50 dark:border-white/5 gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-white">5</span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white truncate">Grade Inputs · {province.name} prerequisites</h2>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 ml-8">Add or edit high-school courses and adjust grades.</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{avgGrade}%</p>
                </div>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {subjects.map(s => (
                  <div key={s.id} className="relative group">
                    <GradeSlider subject={s} onChange={g => updateSubject(s.id, g)} />
                    <button onClick={() => removeSubject(s.id)} aria-label={`Remove ${s.name}`}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-slate-300 hover:text-red-500 dark:hover:text-red-400">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {addingSubject ? (
                <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 bg-blue-50/50 dark:bg-blue-500/5">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">Add New Course</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Course code (e.g. TDJ4M)"
                      className="w-36 h-9 px-3 text-xs bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Course name (e.g. Welding Tech)"
                      className="flex-1 min-w-[140px] h-9 px-3 text-xs bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-[#8e92ad]">Grade:</span>
                      <input type="number" min={50} max={100} value={newGrade} onChange={e => setNewGrade(Number(e.target.value))}
                        className="w-16 h-9 px-2 text-xs text-center bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20" />
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddingSubject(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                    <button onClick={addSubject}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                      <CheckCircle2 size={12} /> Add Course
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingSubject(true)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border-t border-gray-50 dark:border-white/5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all">
                  <Plus size={14} /> Add Course
                </button>
              )}

              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-white/3 border-t border-gray-100 dark:border-white/5">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Simulated course average</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">{avgGrade}%</p>
              </div>
            </div>

            {/* 6. Explainability */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <SectionHeader n="6" title="What's driving your estimate" sub={`Factors most affecting your odds for ${program.name}`} />
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Info size={13} className="text-blue-500" />
                </div>
              </div>
              <div className="space-y-4">
                {factors.map(f => {
                  const positive = f.impact >= 0;
                  return (
                    <div key={f.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{f.label}</span>
                        <span className={`text-xs font-bold ${positive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                          {positive ? '+' : ''}{f.impact}%
                        </span>
                      </div>
                      <div className="h-2.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${(Math.abs(f.impact) / maxAbs) * 100}%`, backgroundColor: positive ? f.color : '#ef4444' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Estimates are indicative and based on typical {program.type === 'Apprenticeship' ? 'apprenticeship intake' : 'college admission'} criteria for {province.name}. Confirm exact requirements with {province.body}.
                </p>
              </div>
            </div>

            {/* Scenario cards */}
            <div>
              <h2 className="text-sm font-bold text-slate-700 dark:text-white mb-3">Scenario Estimates</h2>
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                {SCENARIOS.map(s => (
                  <div key={s.label} className={`flex flex-col p-4 rounded-2xl border transition-all ${s.bgCls}`}>
                    <span className="text-lg mb-1">{s.icon}</span>
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200 leading-tight">{s.label}</p>
                    <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 mb-2">{s.sub}</p>
                    <span className={`text-xl font-black tabular-nums ${s.pctCls}`}>{s.pct}%</span>
                    <span className="text-[8px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Chance</span>
                  </div>
                ))}
                <Link href="/vocational-technical-student-route/strategy"
                  className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all text-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-1">
                    <Plus size={14} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Build a Strategy</p>
                  <p className="text-[9px] text-slate-400">Improve your odds</p>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">Open</span>
                </Link>
              </div>
            </div>

            {/* Recommendation banner */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">Recommendation</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 leading-relaxed">
                    {isApprenticeship && program.needsSponsor && !sponsorSecured
                      ? `Securing an employer sponsor is required to register your ${program.name} apprenticeship and would significantly raise your odds.`
                      : acadAvg < reqAvg
                        ? `Raising your overall average from ${acadAvg}% toward the ${reqAvg}% benchmark for ${province.name} would improve your chances the most.`
                        : `You're tracking well for ${program.name} in ${province.name}. Keep your prerequisite grades up and prepare for the entrance assessment.`}
                  </p>
                </div>
              </div>
              <Link href="/vocational-technical-student-route/strategy"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all whitespace-nowrap shrink-0">
                View Strategy <ArrowUpRight size={12} />
              </Link>
            </div>

            {/* Bottom actions */}
            <div className="flex justify-end gap-3 pb-2">
              <Link href="/vocational-technical-student-route/simulator"
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Cancel
              </Link>
              <Link href="/vocational-technical-student-route/simulator"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                <Play size={14} /> Run Simulation <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 gap-4 sticky top-4">

            {/* Summary card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Summary</h3>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/30">
                  {isApprenticeship ? <Wrench size={18} /> : <GraduationCap size={18} />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{program.name}{program.code ? ` (${program.code})` : ''}</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] truncate">{province.name} · {program.type}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label: 'Overall average', val: `${acadAvg}%` },
                  { label: 'Required average', val: `${reqAvg}%` },
                  { label: 'Aptitude test', val: `${aptitudeScore}%` },
                  ...(isApprenticeship ? [
                    { label: 'Sponsor secured', val: sponsorSecured ? 'Yes' : 'No' },
                    { label: 'Hours logged', val: `${hoursLogged}` },
                  ] : []),
                  { label: 'Governing body', val: province.body },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-500 dark:text-[#8e92ad] shrink-0">{r.label}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 text-right truncate">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Admission Likelihood</h3>
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-36 h-36">
                  <svg width="144" height="144" className="-rotate-90">
                    <circle cx="72" cy="72" r={R} fill="none" stroke="#E5E7EB" strokeWidth="14" className="dark:stroke-white/10" />
                    <circle cx="72" cy="72" r={R} fill="none" stroke={chanceColor} strokeWidth="14"
                      strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - chance / 100)}
                      style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black" style={{ color: chanceColor }}>{chance}%</span>
                    <span className={`text-[10px] font-bold mt-0.5 ${chanceLabel.cls}`}>{chanceLabel.text}</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-[10px] text-slate-400 dark:text-slate-500">Cautious</p><p className="text-sm font-bold text-amber-500 dark:text-amber-400">{consChance}%</p></div>
                <div><p className="text-[10px] text-slate-400 dark:text-slate-500">Realistic</p><p className="text-sm font-bold text-blue-600 dark:text-blue-400">{chance}%</p></div>
                <div><p className="text-[10px] text-slate-400 dark:text-slate-500">Best</p><p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{bestChance}%</p></div>
              </div>
            </div>

            {/* Next steps card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
                  <BadgeCheck size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">Next steps</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Track prerequisite grades', href: '/vocational-technical-student-route/grades', icon: GraduationCap },
                  { label: 'Practice the entrance interview', href: '/vocational-technical-student-route/mmi', icon: Clock },
                  { label: 'Find a mentor / counsellor', href: '/vocational-technical-student-route/counselors', icon: Building2 },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <Link key={s.label} href={s.href}
                      className="flex items-center gap-2.5 rounded-xl border border-gray-100 dark:border-white/8 px-3 py-2.5 hover:border-blue-200 dark:hover:border-blue-500/30 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all group">
                      <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/8 flex items-center justify-center text-slate-500 dark:text-slate-300 shrink-0">
                        <Icon size={14} />
                      </span>
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex-1">{s.label}</span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
