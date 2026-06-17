'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, ChevronRight, Save, Play,
  Plus, Trash2, Info, BarChart3, Sparkles, TrendingUp,
  ArrowUpRight, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Subject { id: number; code: string; name: string; grade: number; color: string }

// ── Constants ─────────────────────────────────────────────────────────────────

const PROVINCES   = ['Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Nova Scotia'];
const UNIVERSITIES: Record<string, string[]> = {
  Ontario:           ['University of Toronto', 'University of Waterloo', 'McMaster University', "Queen's University", 'Western University'],
  'British Columbia':['University of British Columbia', 'Simon Fraser University', 'University of Victoria'],
  Alberta:           ['University of Alberta', 'University of Calgary'],
  Quebec:            ['McGill University', 'Concordia University'],
  'Nova Scotia':     ['Dalhousie University'],
};
const PROGRAMS_BY_UNI: Record<string, string[]> = {
  'University of Toronto':      ['Engineering Science', 'Computer Science', 'Health Sciences', 'Commerce', 'Life Sciences'],
  'University of Waterloo':     ['Computer Science', 'Software Engineering', 'Systems Design Engineering', 'Mechatronics'],
  'McMaster University':        ['Health Sciences', 'Engineering', 'Life Sciences', 'Commerce'],
  "Queen's University":         ['Computing', 'Engineering', 'Life Sciences', 'Commerce'],
  'University of Western Ontario':['Medical Sciences', 'Engineering', 'Business', 'Computer Science'],
  'University of British Columbia':['Computer Science', 'Engineering', 'Life Sciences', 'Commerce'],
};
const QUALITY_OPTIONS     = ['High', 'Medium', 'Low'];
const STRENGTH_OPTIONS    = ['Excellent', 'Strong', 'Good', 'Fair'];
const TREND_OPTIONS       = ['Improving', 'Stable', 'Declining'];
const CONFIDENCE_OPTIONS  = ['High', 'Medium', 'Low'];

const SUBJECT_COLORS = ['#2563EB','#7c3aed','#0891b2','#d97706','#0d9b6a','#dc2626','#db2777','#059669'];

const DEFAULT_SUBJECTS: Subject[] = [
  { id:1, code:'MHF4U', name:'Advanced Functions', grade:92, color:'#2563EB' },
  { id:2, code:'MCV4U', name:'Calculus & Vectors',  grade:89, color:'#7c3aed' },
  { id:3, code:'SPH4U', name:'Physics',              grade:91, color:'#0891b2' },
  { id:4, code:'ENG4U', name:'English',              grade:85, color:'#d97706' },
  { id:5, code:'SCH4U', name:'Chemistry',            grade:88, color:'#0d9b6a' },
  { id:6, code:'ICS4U', name:'Computer Science',     grade:94, color:'#dc2626' },
];

const SHAP_FACTORS = [
  { label:'Calculus grade', impact:18, color:'#7c3aed' },
  { label:'Physics grade',  impact:12, color:'#0891b2' },
  { label:'English grade',  impact:8,  color:'#d97706' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

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
function avg(subjects: Subject[]) {
  if (!subjects.length) return 0;
  return Math.round(subjects.reduce((s, x) => s + x.grade, 0) / subjects.length);
}
function estimateChance(academicAvg: number, prereqAvg: number, aifQ: string, mmiScore: number) {
  const base = (academicAvg - 70) / 30 * 60;
  const aifBonus   = aifQ === 'High' ? 15 : aifQ === 'Medium' ? 8 : 2;
  const mmiBonus   = (mmiScore / 10) * 15;
  const prereqB    = (prereqAvg - 70) / 30 * 10;
  return Math.min(99, Math.max(5, Math.round(base + aifBonus + mmiBonus + prereqB)));
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SelectField({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex-1 min-w-0">
      {label && <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">{label}</p>}
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full appearance-none h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer">
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
        <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
    </div>
  );
}

function SectionHeader({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-black text-white">{n}</span>
      </div>
      <h2 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h2>
    </div>
  );
}

function GradeSlider({ subject, onChange }: { subject: Subject; onChange: (g: number) => void }) {
  const pct   = ((subject.grade - 50) / 50) * 100;
  const color = gradeColor(subject.grade);
  return (
    <div className="px-5 py-4 group hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: subject.color }}/>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate">{subject.name}</p>
            <p className="text-[9px] font-mono text-slate-400 dark:text-slate-500">{subject.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: color+'18', color }}>
            {gradeLabel(subject.grade)}
          </span>
          <span className="text-base font-bold tabular-nums min-w-[40px] text-right" style={{ color }}>{subject.grade}%</span>
        </div>
      </div>
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-150" style={{ width:`${pct}%`, backgroundColor:color }}/>
        </div>
        <div className="absolute w-5 h-5 rounded-full border-2 border-white dark:border-[#161a27] shadow-md pointer-events-none"
          style={{ left:`calc(${pct}% - 10px)`, backgroundColor:color, boxShadow:`0 0 0 3px ${color}30` }}/>
        <input type="range" min={50} max={100} value={subject.grade} onChange={e => onChange(Number(e.target.value))}
          className="absolute w-full h-5 opacity-0 cursor-pointer"/>
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
  const [province, setProvince]     = useState('Ontario');
  const [university, setUniversity] = useState('University of Toronto');
  const [program, setProgram]       = useState('Engineering Science');
  const [searchProg, setSearchProg] = useState('');

  // Academic profile
  const [acadAvg, setAcadAvg]       = useState(92);
  const [prereqAvg, setPrereqAvg]   = useState(85);
  const [gradeTrend, setGradeTrend] = useState('Improving');

  // Supplemental
  const [aifQuality, setAifQuality]   = useState('High');
  const [essayStr, setEssayStr]       = useState('Strong');
  const [extraStr, setExtraStr]       = useState('Excellent');
  const [leaderExp, setLeaderExp]     = useState('Excellent');

  // MMI
  const [mmiScore, setMmiScore]       = useState(8);
  const [interviewConf, setInterviewConf] = useState('High');

  // Grade inputs
  const [subjects, setSubjects]       = useState<Subject[]>(DEFAULT_SUBJECTS);
  const [addingSubject, setAddingSubject] = useState(false);
  const [newCode, setNewCode]         = useState('');
  const [newName, setNewName]         = useState('');
  const [newGrade, setNewGrade]       = useState(85);

  // Derived
  const avgGrade    = avg(subjects);
  const chance      = estimateChance(acadAvg, prereqAvg, aifQuality, mmiScore);
  const optChance   = Math.min(99, chance + 14);
  const consChance  = Math.max(5,  chance - 14);
  const bestChance  = Math.min(99, chance + 19);
  const chanceLabel = chance >= 70 ? { text:'Strong Chance', cls:'text-emerald-600 dark:text-emerald-400' }
                    : chance >= 50 ? { text:'Medium Chance', cls:'text-amber-500 dark:text-amber-400' }
                    :                { text:'Low Chance',    cls:'text-red-500 dark:text-red-400' };
  const trendBadge  = gradeTrend === 'Improving' ? { cls:'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300', label:'Good Trend' }
                    : gradeTrend === 'Stable'    ? { cls:'bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300',           label:'Stable Trend' }
                    :                             { cls:'bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300',               label:'Declining Trend' };

  const univOptions = UNIVERSITIES[province] ?? UNIVERSITIES['Ontario'];
  const progOptions = PROGRAMS_BY_UNI[university] ?? ['Engineering Science','Computer Science','Health Sciences'];

  function updateSubject(id: number, grade: number) {
    setSubjects(s => s.map(x => x.id === id ? { ...x, grade } : x));
  }
  function removeSubject(id: number) {
    setSubjects(s => s.filter(x => x.id !== id));
  }
  function addSubject() {
    if (!newName.trim()) return;
    const color = SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length];
    setSubjects(s => [...s, { id: Date.now(), code: newCode || 'NEW', name: newName, grade: newGrade, color }]);
    setNewCode(''); setNewName(''); setNewGrade(85); setAddingSubject(false);
  }

  // Donut chart
  const R = 56; const circ = 2 * Math.PI * R;
  const chanceColor = chance >= 70 ? '#10b981' : chance >= 50 ? '#f59e0b' : '#ef4444';

  const SCENARIOS = [
    { label:'Realistic Scenario',   sub:'Balance Profile',         pct:chance,    pctCls:'text-blue-600 dark:text-blue-400',    bgCls:'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30', icon:'🎯' },
    { label:'Optimistic Scenario',  sub:'Above average profile',   pct:optChance, pctCls:'text-emerald-600 dark:text-emerald-400', bgCls:'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30', icon:'🚀' },
    { label:'Conservative Scenario',sub:'Below average profile',   pct:consChance,pctCls:'text-amber-500 dark:text-amber-400',  bgCls:'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',  icon:'🌤' },
    { label:'Best Case Scenario',   sub:'Strongest possible profile',pct:bestChance,pctCls:'text-violet-600 dark:text-violet-400', bgCls:'bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30', icon:'⭐' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-0">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
          <div>
            <Link href="/student/simulator" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
              <ChevronLeft size={15}/> Back to Simulator
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Create New Simulation</h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Build a new scenario and estimate your admission chances.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-start">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 transition-all">
              <Save size={13}/> Save Draft
            </button>
            <Link href="/student/simulator"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/25">
              <Play size={13}/> Run Simulation <ChevronRight size={13}/>
            </Link>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* 1. Target Program */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <SectionHeader n="1" title="Target Program"/>
              <div className="flex flex-wrap gap-3">
                <SelectField label="Province" value={province} options={PROVINCES}
                  onChange={v => { setProvince(v); setUniversity(UNIVERSITIES[v]?.[0] ?? ''); }}/>
                <SelectField label="University" value={university} options={univOptions}
                  onChange={v => { setUniversity(v); setProgram(PROGRAMS_BY_UNI[v]?.[0] ?? ''); }}/>
                <SelectField label="Program" value={program} options={progOptions} onChange={setProgram}/>
                <div className="flex-1 min-w-[160px]">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">Search Program (Optional)</p>
                  <div className="relative">
                    <input value={searchProg} onChange={e => setSearchProg(e.target.value)}
                      placeholder="Search templates…"
                      className="w-full h-9 pl-3 pr-8 text-xs bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                    <Info size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"/>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Academic Profile */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-5">
              <SectionHeader n="2" title="Academic Profile"/>

              {/* Academy Average slider */}
              {[
                { label:'Academy Average',    val:acadAvg,    set:setAcadAvg },
                { label:'Prerequisite Average',val:prereqAvg, set:setPrereqAvg },
              ].map(s => {
                const pct   = ((s.val - 70) / 30) * 100;
                const color = gradeColor(s.val);
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{s.label}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1">{s.val}%</span>
                        <ChevronDown size={12} className="text-slate-400"/>
                      </div>
                    </div>
                    <div className="relative h-5 flex items-center">
                      <div className="absolute w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width:`${pct}%` }}/>
                      </div>
                      <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
                        style={{ left:`calc(${pct}% - 10px)` }}/>
                      <input type="range" min={70} max={100} value={s.val} onChange={e => s.set(Number(e.target.value))}
                        className="absolute w-full h-5 opacity-0 cursor-pointer"/>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-0.5">
                      <span>70%</span><span>100%</span>
                    </div>
                  </div>
                );
              })}

              {/* Grade Trend */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Grade Trend</span>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select value={gradeTrend} onChange={e => setGradeTrend(e.target.value)}
                      className="appearance-none h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                      {TREND_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg ${trendBadge.cls}`}>
                    <TrendingUp size={10}/> {trendBadge.label}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Supplemental Application */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <SectionHeader n="3" title="Supplemental Application"/>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label:'AIF Quality',              val:aifQuality, set:setAifQuality, opts:QUALITY_OPTIONS  },
                  { label:'Essay Strength',            val:essayStr,   set:setEssayStr,   opts:STRENGTH_OPTIONS },
                  { label:'Extracurricular Activities',val:extraStr,   set:setExtraStr,   opts:STRENGTH_OPTIONS },
                  { label:'Leadership Experience',     val:leaderExp,  set:setLeaderExp,  opts:STRENGTH_OPTIONS },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">{f.label}</p>
                    <div className="relative">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className={`w-2 h-2 rounded-full ${f.val === 'Excellent' || f.val === 'High' ? 'bg-emerald-500' : f.val === 'Strong' || f.val === 'Medium' ? 'bg-blue-500' : f.val === 'Good' ? 'bg-amber-400' : 'bg-slate-300'}`}/>
                      </div>
                      <select value={f.val} onChange={e => f.set(e.target.value)}
                        className="w-full appearance-none h-9 pl-3 pr-7 text-xs font-medium bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                        {f.opts.map(o => <option key={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 bottom-2.5 text-slate-400 pointer-events-none"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Interview / MMI */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 space-y-5">
              <SectionHeader n="4" title="Interview / MMI"/>

              {/* MMI Performance slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">MMI Performance</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1">{mmiScore.toFixed(1)}/10</span>
                </div>
                <div className="relative h-5 flex items-center">
                  <div className="absolute w-full h-2.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width:`${mmiScore * 10}%` }}/>
                  </div>
                  <div className="absolute w-5 h-5 rounded-full bg-white border-2 border-blue-600 shadow-md pointer-events-none"
                    style={{ left:`calc(${mmiScore * 10}% - 10px)` }}/>
                  <input type="range" min={0} max={10} step={0.5} value={mmiScore} onChange={e => setMmiScore(Number(e.target.value))}
                    className="absolute w-full h-5 opacity-0 cursor-pointer"/>
                </div>
                <div className="flex justify-between text-[9px] text-slate-300 dark:text-slate-600 mt-1 px-0.5">
                  <span>0</span><span>5</span><span>10</span>
                </div>
              </div>

              {/* Interview Confidence */}
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Interview Confidence</span>
                <div className="relative">
                  <select value={interviewConf} onChange={e => setInterviewConf(e.target.value)}
                    className="appearance-none h-9 pl-3 pr-8 text-xs font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer">
                    {CONFIDENCE_OPTIONS.map(o => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                </div>
              </div>
            </div>

            {/* 5. Grade Inputs (reused from simulator) */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50 dark:border-white/5">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-white">5</span>
                    </div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white">Grade Inputs · Ontario OUAC</h2>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 ml-8">Add or edit subjects and drag sliders to adjust grades</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Top-6 avg</p>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">{avgGrade}%</p>
                </div>
              </div>

              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {subjects.map(s => (
                  <div key={s.id} className="relative group">
                    <GradeSlider subject={s} onChange={g => updateSubject(s.id, g)}/>
                    <button onClick={() => removeSubject(s.id)}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 text-slate-300 hover:text-red-500 dark:hover:text-red-400">
                      <Trash2 size={12}/>
                    </button>
                  </div>
                ))}
              </div>

              {/* Add subject row */}
              {addingSubject ? (
                <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 bg-blue-50/50 dark:bg-blue-500/5">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-3">Add New Subject</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <input value={newCode} onChange={e => setNewCode(e.target.value)} placeholder="Course code (e.g. BIO4U)"
                      className="w-36 h-9 px-3 text-xs bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"/>
                    <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Subject name"
                      className="flex-1 min-w-[140px] h-9 px-3 text-xs bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"/>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 dark:text-[#8e92ad]">Grade:</span>
                      <input type="number" min={50} max={100} value={newGrade} onChange={e => setNewGrade(Number(e.target.value))}
                        className="w-16 h-9 px-2 text-xs text-center bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20"/>
                      <span className="text-xs text-slate-400">%</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setAddingSubject(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                    <button onClick={addSubject}
                      className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                      <CheckCircle2 size={12}/> Add Subject
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setAddingSubject(true)}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 border-t border-gray-50 dark:border-white/5 text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all">
                  <Plus size={14}/> Add Subject
                </button>
              )}

              <div className="flex items-center justify-between px-5 py-3.5 bg-gray-50 dark:bg-white/3 border-t border-gray-100 dark:border-white/5">
                <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">Simulated top‑6 average</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">{avgGrade}%</p>
              </div>
            </div>

            {/* 6. Live Probability (AI Explainability) */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-black text-white">6</span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-white">AI Explainability</h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Which courses matter most for {program}</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Info size={13} className="text-blue-500"/>
                </div>
              </div>
              <div className="space-y-4">
                {SHAP_FACTORS.map(f => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{f.label}</span>
                      <span className="text-xs font-bold" style={{ color:f.color }}>+{f.impact}%</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width:`${f.impact * 4.5}%`, backgroundColor:f.color }}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed">
                  Based on <span className="font-semibold text-slate-600 dark:text-slate-300">347 similar profiles</span>. Raising Calculus by 4% could boost your probability by ~8%.
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
                <button className="flex flex-col items-center justify-center p-4 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-500/5 transition-all text-center gap-1">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center mb-1">
                    <Plus size={14} className="text-slate-500 dark:text-slate-400"/>
                  </div>
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">Custom Scenario</p>
                  <p className="text-[9px] text-slate-400">Build your own</p>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">Create</span>
                </button>
              </div>
            </div>

            {/* AI Recommendation banner */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={14} className="text-blue-600 dark:text-blue-400"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">AI Recommendation</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5 leading-relaxed">
                    AI improve your academic average from {acadAvg}% to {Math.min(100, acadAvg + 2)}% could increase your admission chances by approximately 8%.
                  </p>
                </div>
              </div>
              <Link href="/student/strategy"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all whitespace-nowrap shrink-0">
                View Suggestion <ArrowUpRight size={12}/>
              </Link>
            </div>

            {/* Bottom actions */}
            <div className="flex justify-end gap-3 pb-6">
              <Link href="/student/simulator"
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Cancel
              </Link>
              <Link href="/student/simulator"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                <Play size={14}/> Run Simulation <ChevronRight size={14}/>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0 gap-4">

            {/* Summary card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Summary</h3>
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50 dark:border-white/5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 text-blue-700 font-black text-sm border border-blue-100 dark:border-blue-500/30">
                  En
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{program === 'Engineering Science' ? 'UofT Eng Science' : program}</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{university}</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {[
                  { label:'Academic Averages',    val:`${acadAvg}%`     },
                  { label:'Supplementary Score',  val:`${prereqAvg}%`   },
                  { label:'AIF Quality',          val:aifQuality        },
                  { label:'Leadership Experience',val:leaderExp         },
                  { label:'MMI Performance',      val:`${mmiScore}/10`  },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 dark:text-[#8e92ad]">{r.label}</span>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Summary</h3>
              <div className="flex items-center justify-center mb-3">
                <div className="relative w-36 h-36">
                  <svg width="144" height="144" className="-rotate-90">
                    <circle cx="72" cy="72" r={R} fill="none" stroke="#E5E7EB" strokeWidth="14" className="dark:stroke-white/10"/>
                    <circle cx="72" cy="72" r={R} fill="none" stroke={chanceColor} strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - chance / 100)}
                      style={{ transition:'stroke-dashoffset 0.5s ease' }}/>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black" style={{ color:chanceColor }}>{chance}%</span>
                    <span className={`text-[10px] font-bold mt-0.5 ${chanceLabel.cls}`}>{chanceLabel.text}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <TrendingUp size={13}/> 6% improvement with changes
              </div>
            </div>

            {/* AI Recommendation card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center shrink-0">
                  <span className="text-base">🤖</span>
                </div>
                <p className="text-sm font-bold text-slate-800 dark:text-white">AI Recommendation</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8e92ad] leading-relaxed mb-4">
                AI improve your academic average from {acadAvg}% to {Math.min(100, acadAvg + 2)}% could increase your admission chances by approximately 8%.
              </p>
              <Link href="/student/strategy"
                className="flex items-center justify-center gap-1.5 w-full px-4 py-2.5 rounded-xl bg-violet-50 dark:bg-violet-500/15 hover:bg-violet-100 dark:hover:bg-violet-500/25 text-violet-700 dark:text-violet-300 text-xs font-bold transition-all border border-violet-100 dark:border-violet-500/20">
                View Suggestion <ArrowUpRight size={12}/>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
