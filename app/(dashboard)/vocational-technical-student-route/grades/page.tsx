'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp, TrendingDown, Plus, ChevronDown, MoreVertical,
  ChevronRight, AlertTriangle, CheckCircle2, Sparkles,
  X, CheckCircle, AlertCircle, ArrowDown, PauseCircle,
  MapPin, GraduationCap, Wrench, Target, Award,
} from 'lucide-react';
import { GRADES } from '@/src/lib/sample-data';
import { useStudentDashboard } from '@/src/hooks/useStudentDasboard';
import { cn } from '@/lib/utils';

// ── Province & program data (vocational / technical) ──────────────────────────

interface Province { code: string; name: string; body: string; delta: number; }

const PROVINCES: Province[] = [
  { code: 'ON', name: 'Ontario',                     body: 'Skilled Trades Ontario',                          delta: 0 },
  { code: 'BC', name: 'British Columbia',            body: 'SkilledTradesBC',                                 delta: 0 },
  { code: 'AB', name: 'Alberta',                     body: 'Alberta Apprenticeship & Industry Training',      delta: 2 },
  { code: 'QC', name: 'Quebec',                      body: 'CCQ · DEP (Diploma of Vocational Studies)',       delta: 2 },
  { code: 'MB', name: 'Manitoba',                    body: 'Apprenticeship Manitoba',                         delta: 0 },
  { code: 'SK', name: 'Saskatchewan',               body: 'SATCC (Saskatchewan Apprenticeship)',             delta: 0 },
  { code: 'NS', name: 'Nova Scotia',                 body: 'Nova Scotia Apprenticeship Agency',               delta: 0 },
  { code: 'NB', name: 'New Brunswick',               body: 'Apprenticeship & Occupational Certification (NB)',delta: 0 },
  { code: 'NL', name: 'Newfoundland and Labrador',   body: 'Apprenticeship & Trades Certification (NL)',      delta: 0 },
  { code: 'PE', name: 'Prince Edward Island',        body: 'Apprenticeship PEI',                              delta: -2 },
  { code: 'NT', name: 'Northwest Territories',       body: 'NT Apprenticeship Program',                       delta: -2 },
  { code: 'YT', name: 'Yukon',                       body: 'Yukon Apprenticeship Program',                    delta: -2 },
  { code: 'NU', name: 'Nunavut',                     body: 'Nunavut Apprenticeship Program',                  delta: -2 },
];

interface Prereq { name: string; code: string; base: number; note: string; }
interface VocProgram {
  id: string; label: string; type: 'Apprenticeship' | 'College Diploma';
  seal: boolean; prereqs: Prereq[];
}

// `code` links each prerequisite to a tracked course in GRADES so we can read the
// student's current grade. base = baseline required minimum (province delta added).
const PROGRAMS: VocProgram[] = [
  {
    id: 'electrician', label: 'Electrician (309A)', type: 'Apprenticeship', seal: true,
    prereqs: [
      { name: 'English 12',                       code: 'ENG4U', base: 60, note: 'Code reading & communication' },
      { name: 'Apprenticeship / Foundations Math 12', code: 'MCV4U', base: 70, note: 'Electrical calculations' },
      { name: 'Physics 11',                       code: 'SPH4U', base: 60, note: 'Circuits & electrical theory' },
      { name: 'Technological Education credit',   code: 'ICS4U', base: 60, note: 'Shop / hands-on experience' },
    ],
  },
  {
    id: 'automotive', label: 'Automotive Service Technician (310S)', type: 'Apprenticeship', seal: true,
    prereqs: [
      { name: 'English 12',                       code: 'ENG4U', base: 55, note: 'Manuals & service records' },
      { name: 'Foundations Math 11/12',           code: 'MHF4U', base: 60, note: 'Measurement & diagnostics' },
      { name: 'Physics 11',                       code: 'SPH4U', base: 55, note: 'Mechanics & systems' },
      { name: 'Technological Education credit',   code: 'ICS4U', base: 55, note: 'Auto / shop credit' },
    ],
  },
  {
    id: 'welder', label: 'Welder', type: 'Apprenticeship', seal: true,
    prereqs: [
      { name: 'English 12',                       code: 'ENG4U', base: 55, note: 'Blueprints & safety docs' },
      { name: 'Foundations Math 11',              code: 'MHF4U', base: 60, note: 'Measurement & layout' },
      { name: 'Physics 11 (recommended)',         code: 'SPH4U', base: 50, note: 'Heat & metallurgy basics' },
      { name: 'Technological Education credit',   code: 'ICS4U', base: 55, note: 'Welding / fabrication shop' },
    ],
  },
  {
    id: 'hvac', label: 'HVAC / Refrigeration Technician', type: 'Apprenticeship', seal: true,
    prereqs: [
      { name: 'English 12',                       code: 'ENG4U', base: 60, note: 'Specs & code interpretation' },
      { name: 'Apprenticeship Math 12',           code: 'MCV4U', base: 65, note: 'Load & airflow calculations' },
      { name: 'Physics 11',                       code: 'SPH4U', base: 60, note: 'Thermodynamics basics' },
      { name: 'Chemistry 11 (refrigerants)',      code: 'SCH4U', base: 55, note: 'Refrigerant handling' },
    ],
  },
  {
    id: 'plumbing', label: 'Plumber', type: 'Apprenticeship', seal: true,
    prereqs: [
      { name: 'English 12',                       code: 'ENG4U', base: 60, note: 'Plumbing code & permits' },
      { name: 'Foundations Math 12',              code: 'MCV4U', base: 65, note: 'Pipe sizing & grade math' },
      { name: 'Physics 11 (recommended)',         code: 'SPH4U', base: 55, note: 'Pressure & flow' },
      { name: 'Technological Education credit',   code: 'ICS4U', base: 55, note: 'Construction / shop credit' },
    ],
  },
  {
    id: 'construction', label: 'Construction / Civil Engineering Technician', type: 'College Diploma', seal: false,
    prereqs: [
      { name: 'English 12',                       code: 'ENG4U', base: 65, note: 'Reports & documentation' },
      { name: 'Math 12 (College/University)',     code: 'MHF4U', base: 70, note: 'Surveying & estimating' },
      { name: 'Physics 12 (recommended)',         code: 'SPH4U', base: 60, note: 'Statics & materials' },
      { name: 'Chemistry 11 (recommended)',       code: 'SCH4U', base: 55, note: 'Materials science' },
    ],
  },
];

// ── Course meta (re-themed toward trades-relevant prerequisites) ──────────────

const COURSE_META: Record<string, {
  teacher: string; trend: number; target: number;
  status: 'On Track' | 'At Risk'; updated: string;
}> = {
  MHF4U: { teacher: 'Mr. Johnson', trend: +3, target: 90, status: 'On Track', updated: 'May 20, 2026' },
  MCV4U: { teacher: 'Mr. Brown',   trend: +3, target: 88, status: 'At Risk',  updated: 'May 18, 2026' },
  SPH4U: { teacher: 'Mr. Brown',   trend: +1, target: 90, status: 'On Track', updated: 'May 14, 2026' },
  ENG4U: { teacher: 'Dr. Lee',     trend: +3, target: 88, status: 'At Risk',  updated: 'May 16, 2026' },
  SCH4U: { teacher: 'Mr. Brown',   trend: +2, target: 88, status: 'On Track', updated: 'May 18, 2026' },
  ICS4U: { teacher: 'Ms. Patel',   trend: +2, target: 92, status: 'On Track', updated: 'May 12, 2026' },
};

const UPCOMING = [
  { course: 'Apprenticeship Math', type: 'Aptitude Practice', date: null },
  { course: 'Physics 11',          type: 'Unit Test',         date: null },
  { course: 'Tech / Shop',         type: 'Skills Demo',       date: 'June 2nd, 2026' },
];

const OVERTIME_PTS = [22, 30, 38, 45, 42, 52, 60, 65, 70, 72, 78, 88];

// ── Helpers ──────────────────────────────────────────────────────────────────

function gradeColor(v: number) {
  if (v >= 90) return '#10b981';
  if (v >= 80) return '#f59e0b';
  return '#ef4444';
}

// Build a small deterministic trend series for a sparkline from a grade value.
function sparkFor(v: number) {
  return [v - 8, v - 6, v - 7, v - 4, v - 3, v - 1, v].map((x) => Math.max(45, Math.min(100, x)));
}

// Tiny inline sparkline
function Sparkline({ pts, color }: { pts: number[]; color: string }) {
  const min = Math.min(...pts), max = Math.max(...pts);
  const rng = max - min || 1;
  const W = 80, H = 28;
  const points = pts.map((v, i) =>
    `${(i / (pts.length - 1)) * W},${H - ((v - min) / rng) * (H - 4) - 2}`
  ).join(' ');
  return (
    <svg width={W} height={H} className="shrink-0">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Donut chart — works on both light and dark backgrounds via CSS variables
function DonutChart({
  pct, segments, light,
}: { pct: number; segments: { pct: number; color: string }[]; light?: boolean }) {
  const R = 54, CX = 64, CY = 64;
  const circ = 2 * Math.PI * R;
  let offset = 0;
  const trackStroke = light ? '#e2e8f0' : 'rgba(255,255,255,0.06)';
  const textFill     = light ? '#1e293b' : 'white';
  const subFill      = light ? '#94a3b8' : '#8e92ad';
  return (
    <svg width={128} height={128} viewBox="0 0 128 128">
      <circle cx={CX} cy={CY} r={R} fill="none" stroke={trackStroke} strokeWidth="14" />
      {segments.map((s, i) => {
        const dash = (s.pct / 100) * circ;
        const arc = (
          <circle key={i} cx={CX} cy={CY} r={R} fill="none"
            stroke={s.color} strokeWidth="14" strokeLinecap="round"
            strokeDasharray={`${Math.max(dash - 2, 0)} ${circ - Math.max(dash - 2, 0)}`}
            strokeDashoffset={-offset + circ / 4}
          />
        );
        offset += dash;
        return arc;
      })}
      <text x={CX} y={CY - 5} textAnchor="middle" fontSize="15" fontWeight="700" fill={textFill}>{pct}%</text>
      <text x={CX} y={CY + 12} textAnchor="middle" fontSize="9" fill={subFill}>Overall</text>
    </svg>
  );
}

// Area chart for grade history
function AreaChart({ pts }: { pts: number[] }) {
  const W = 400, H = 100;
  const scaleX = (i: number) => (i / (pts.length - 1)) * W;
  const scaleY = (v: number) => H - (v / 100) * H;
  const linePts = pts.map((v, i) => `${scaleX(i)},${scaleY(v)}`).join(' L ');
  const areaPath = `M ${linePts} L ${scaleX(pts.length - 1)},${H} L 0,${H} Z`;
  const linePath = `M ${linePts}`;
  const last = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b5ce6" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2b5ce6" stopOpacity="0.01" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#areaGrad)" />
      <path d={linePath} fill="none" stroke="#2b5ce6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((v, i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(v)} r="3" fill="#2b5ce6" />
      ))}
      <circle cx={scaleX(pts.length - 1)} cy={scaleY(last)} r="6" fill="#2b5ce6" />
      <rect x={scaleX(pts.length - 1) - 16} y={scaleY(last) - 20} width="32" height="16" rx="4" fill="#2b5ce6" />
      <text x={scaleX(pts.length - 1)} y={scaleY(last) - 8} textAnchor="middle" fontSize="9" fill="white" fontWeight="bold">{last}%</text>
    </svg>
  );
}

// ── Add Course Modal ──────────────────────────────────────────────────────────

const SUBJECT_AREAS = [
  'Mathematics', 'Sciences', 'English / Language Arts', 'History / Social Studies',
  'Technological Education', 'Trades / Shop', 'Physical Education', 'Languages', 'Other',
];

const COURSE_STATUSES = [
  { key: 'on-track', label: 'On Track',   desc: 'Meeting goals and expectation',   icon: CheckCircle,   iconCls: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  { key: 'at-risk',  label: 'At Risk',    desc: 'Slightly below Target',            icon: AlertCircle,   iconCls: 'text-amber-500',   bg: 'bg-amber-100 dark:bg-amber-500/20' },
  { key: 'behind',   label: 'Behind',     desc: 'Needs improvement and attention',  icon: ArrowDown,     iconCls: 'text-red-500',     bg: 'bg-red-100 dark:bg-red-500/20' },
  { key: 'paused',   label: 'Paused',     desc: 'Currently not in progress',        icon: PauseCircle,   iconCls: 'text-violet-500',  bg: 'bg-violet-100 dark:bg-violet-500/20' },
];

interface AddCourseModalProps { onClose: () => void; onAdd: (course: NewCourse) => void; }
interface NewCourse {
  name: string; subject: string; teacher: string; credit: string;
  currentGrade: string; targetGrade: string; status: string; notes: string;
}

function AddCourseModal({ onClose, onAdd }: AddCourseModalProps) {
  const [name, setName]             = useState('');
  const [subject, setSubject]       = useState('');
  const [teacher, setTeacher]       = useState('');
  const [credit, setCredit]         = useState('');
  const [currentGrade, setCurrentGrade] = useState('');
  const [targetGrade, setTargetGrade]   = useState('');
  const [status, setStatus]         = useState('on-track');
  const [notes, setNotes]           = useState('');
  const [errors, setErrors]         = useState<{ name?: boolean; subject?: boolean }>({});

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape
  useEffect(() => {
    function handler(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  function handleSubmit() {
    const errs: { name?: boolean; subject?: boolean } = {};
    if (!name.trim())    errs.name    = true;
    if (!subject)        errs.subject = true;
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onAdd({ name, subject, teacher, credit, currentGrade, targetGrade, status, notes });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4 py-8 sm:py-12 overflow-y-auto"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#161a27] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all z-10">
          Close <X size={12}/>
        </button>

        {/* Content */}
        <div className="px-6 sm:px-8 pt-8 pb-6">

          {/* Header */}
          <div className="mb-6 pr-20">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Add Course</h2>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Add a new course to track your grades and prerequisite progress.</p>
          </div>

          {/* Row 1: Course Name + Subject Area */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Course Name <span className="text-red-500">*</span>
              </label>
              <input value={name} onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: false })); }}
                placeholder="eg. Apprenticeship Math 12"
                className={cn('w-full h-10 px-3 text-sm bg-white dark:bg-[#1a1f30] border rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 transition-all',
                  errors.name
                    ? 'border-red-400 focus:ring-red-500/20'
                    : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/20 focus:border-blue-400')}/>
              {errors.name && <p className="text-[10px] text-red-500 mt-1">Course name is required.</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Subject Area <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select value={subject} onChange={e => { setSubject(e.target.value); setErrors(p => ({ ...p, subject: false })); }}
                  className={cn('w-full appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-[#1a1f30] border rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 transition-all cursor-pointer',
                    errors.subject
                      ? 'border-red-400 focus:ring-red-500/20'
                      : 'border-gray-200 dark:border-white/10 focus:ring-blue-500/20 focus:border-blue-400',
                    !subject && 'text-slate-300 dark:text-[#5a5f78]')}>
                  <option value="">Select Subject</option>
                  {SUBJECT_AREAS.map(s => <option key={s} value={s} className="text-slate-700 dark:text-slate-200">{s}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
              </div>
              {errors.subject && <p className="text-[10px] text-red-500 mt-1">Subject area is required.</p>}
            </div>
          </div>

          {/* Row 2: Teacher + Credit Value */}
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Teacher <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
              </label>
              <input value={teacher} onChange={e => setTeacher(e.target.value)} placeholder="eg. Mr. Johnson"
                className="w-full h-10 px-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Credit Value <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <input value={credit} onChange={e => setCredit(e.target.value)} placeholder="eg. 1" type="number" min="0"
                  className="w-full h-10 pl-3 pr-16 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">credits</span>
              </div>
            </div>
          </div>

          {/* Row 3: Current Grade + Target Grade */}
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Current Grade <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
              </label>
              <input value={currentGrade} onChange={e => setCurrentGrade(e.target.value)} placeholder="eg. 78" type="number" min="0" max="100"
                className="w-full h-10 px-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Target Grade <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
              </label>
              <div className="relative">
                <input value={targetGrade} onChange={e => setTargetGrade(e.target.value)} placeholder="eg. 85" type="number" min="0" max="100"
                  className="w-full h-10 pl-3 pr-8 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">%</span>
              </div>
            </div>
          </div>

          {/* Course Status */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">Course Status</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {COURSE_STATUSES.map(s => {
                const Icon = s.icon;
                const sel  = status === s.key;
                return (
                  <button key={s.key} type="button" onClick={() => setStatus(s.key)}
                    className={cn('relative flex flex-col items-center gap-2.5 px-3 py-4 rounded-2xl border-2 text-center transition-all',
                      sel
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                        : 'border-gray-100 dark:border-white/8 bg-white dark:bg-[#1a1f30] hover:border-gray-200 dark:hover:border-white/15')}>
                    {sel && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
                        <CheckCircle2 size={10} className="text-white fill-white stroke-none"/>
                      </div>
                    )}
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center', s.bg)}>
                      <Icon size={16} className={s.iconCls}/>
                    </div>
                    <div>
                      <p className={cn('text-xs font-bold leading-tight', sel ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-white')}>{s.label}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-tight">{s.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Notes <span className="text-[10px] font-normal text-slate-400">(Optional)</span>
            </label>
            <div className="relative">
              <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 200))} rows={4}
                placeholder="Add any notes about the course........"
                className="w-full px-4 pt-3 pb-6 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
              <span className="absolute bottom-3 right-4 text-[10px] text-slate-400 pointer-events-none">{notes.length}/200</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3">
            <button onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              Cancel
            </button>
            <button onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
              <Plus size={14}/> Add Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function GradeTrackerPage() {
  const { grades, top6Avg } = useStudentDashboard();
  const [yearOpen, setYearOpen]           = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [provinceCode, setProvinceCode]   = useState('ON');
  const [programId, setProgramId]         = useState('electrician');

  const province = PROVINCES.find(p => p.code === provinceCode)!;
  const program  = PROGRAMS.find(p => p.id === programId)!;

  // Read a student's current grade for a course code (falls back to sample value).
  function currentFor(code: string) {
    const idx = GRADES.findIndex(g => g.courseCode === code);
    if (idx === -1) return 0;
    return grades[idx] ?? GRADES[idx].value;
  }

  // Prerequisite matching (province-aware via delta on required minimum).
  const prereqs = useMemo(() => program.prereqs.map((pr) => {
    const required = Math.max(45, Math.min(95, pr.base + province.delta));
    const current  = currentFor(pr.code);
    return { ...pr, required, current, met: current >= required };
  }), [program, province, grades]); // eslint-disable-line react-hooks/exhaustive-deps

  const metCount     = prereqs.filter(p => p.met).length;
  const totalPrereqs = prereqs.length;
  const prereqAvg    = Math.round(prereqs.reduce((s, p) => s + p.current, 0) / (totalPrereqs || 1));
  const creditsEarned = GRADES.length;
  const creditsNeeded = 8;

  const onTrack = metCount === totalPrereqs
    ? { label: 'On Track', cls: 'text-emerald-600 dark:text-[#10b981]' }
    : metCount >= totalPrereqs - 1
      ? { label: 'Almost There', cls: 'text-amber-600 dark:text-[#f59e0b]' }
      : { label: 'Needs Work', cls: 'text-red-500' };

  // Donut subject mix
  const highest = Math.max(...grades);
  const above90 = grades.filter(g => g >= 90).length;
  const above80 = grades.filter(g => g >= 80 && g < 90).length;
  const above70 = grades.filter(g => g >= 70 && g < 80).length;
  const below70 = grades.filter(g => g < 70).length;
  const total   = GRADES.length;

  const donutSegments = [
    { pct: (above90 / total) * 100, color: '#10b981' },
    { pct: (above80 / total) * 100, color: '#f59e0b' },
    { pct: (above70 / total) * 100, color: '#eab308' },
    { pct: (below70 / total) * 100, color: '#ef4444' },
  ];

  const GOAL_ROWS = [
    { label: `Meet all ${program.label.split('(')[0].trim()} prerequisites`, value: metCount, max: totalPrereqs, display: `${metCount}/${totalPrereqs}` },
    { label: 'Prerequisite average ≥ 75%', value: Math.min(prereqAvg, 100), max: 100, display: `${prereqAvg}%` },
    { label: 'No prerequisite below minimum', value: metCount, max: totalPrereqs, display: `${metCount}/${totalPrereqs}` },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Header ──────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Grade Tracker
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Track your grades against the prerequisites required for vocational &amp; technical school entry.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Year selector */}
            <div className="relative">
              <button
                onClick={() => setYearOpen(!yearOpen)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#161a27] text-sm font-medium text-slate-700 dark:text-white shadow-sm hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-colors"
              >
                <span className="text-slate-400 dark:text-[#8e92ad]">📅</span>
                <span className="hidden sm:inline">Current Year (2025–2026)</span>
                <span className="sm:hidden">2025–26</span>
                <ChevronDown size={14} className={`text-slate-400 dark:text-[#8e92ad] transition-transform ${yearOpen ? 'rotate-180' : ''}`} />
              </button>
              {yearOpen && (
                <div className="absolute right-0 top-full mt-1 z-30 w-52 rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#161a27] shadow-xl py-1 overflow-hidden">
                  {['Current Year (2025–2026)', 'Previous Year (2024–2025)'].map(y => (
                    <button key={y} onClick={() => setYearOpen(false)}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white transition-colors">
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Add Course */}
            <button
              onClick={() => setShowAddCourse(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 shadow-sm shadow-blue-200 dark:shadow-blue-600/20 transition-all">
              <Plus size={15} /> <span className="hidden sm:inline">Add Course</span><span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* ── Province + Program selectors ─────────────────────────── */}
        <div className="rounded-2xl border border-gray-100 dark:border-white/6 bg-white dark:bg-[#161a27] shadow-sm p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-end gap-4">
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <MapPin size={13} className="text-blue-500 dark:text-blue-400" /> Province / Territory
              </label>
              <div className="relative">
                <select value={provinceCode} onChange={e => setProvinceCode(e.target.value)}
                  className="w-full appearance-none h-11 pl-3 pr-9 text-sm font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 cursor-pointer transition-all">
                  {PROVINCES.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                <GraduationCap size={13} className="text-blue-500 dark:text-blue-400" /> Target Program / Trade
              </label>
              <div className="relative">
                <select value={programId} onChange={e => setProgramId(e.target.value)}
                  className="w-full appearance-none h-11 pl-3 pr-9 text-sm font-medium bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 cursor-pointer transition-all">
                  {PROGRAMS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
              <Wrench size={11} /> {program.type}
            </span>
            {program.seal && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400">
                <Award size={11} /> Red Seal trade
              </span>
            )}
            <span className="text-[11px] text-slate-500 dark:text-[#8e92ad]">
              Governing body: <span className="font-semibold text-slate-700 dark:text-slate-300">{province.body}</span>
            </span>
          </div>
        </div>

        {/* ── Stat cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: 'Overall Average',    value: `${top6Avg.toFixed(1)}%`, sub: '↑ 2% from last month',         spark: OVERTIME_PTS,                       color: '#2b5ce6', subColor: 'text-emerald-600 dark:text-[#10b981]' },
            { label: 'Prerequisite Average', value: `${prereqAvg}%`,        sub: `${program.label.split('(')[0].trim()}`, spark: sparkFor(prereqAvg),         color: '#10b981', subColor: 'text-slate-400 dark:text-[#8e92ad]' },
            { label: 'Credits Earned',     value: `${creditsEarned}/${creditsNeeded}`, sub: 'Prerequisite credits', spark: [2,3,3,4,5,5,creditsEarned].map(v=>v*12), color: '#7c3aed', subColor: 'text-slate-400 dark:text-[#8e92ad]' },
            { label: 'On-Track Status',    value: onTrack.label,            sub: `${metCount}/${totalPrereqs} prerequisites met`, spark: sparkFor(Math.round((metCount/totalPrereqs)*100)), color: '#f59e0b', subColor: onTrack.cls, valueCls: onTrack.cls },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-4 sm:p-5 flex flex-col justify-between gap-3 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-[#8e92ad] mb-1.5 truncate">{s.label}</p>
                  <p className={cn('text-xl sm:text-2xl lg:text-[28px] font-bold tabular-nums leading-none', (s as any).valueCls ?? 'text-slate-900 dark:text-white')}>{s.value}</p>
                </div>
                <div className="hidden sm:block"><Sparkline pts={s.spark} color={s.color} /></div>
              </div>
              <p className={cn('text-[11px] font-medium truncate', s.subColor)}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Main: prerequisites + table + sidebar ───────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 sm:gap-6 items-start">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="space-y-4 sm:space-y-5 min-w-0">

            {/* Required Prerequisites */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                    <Target size={15} className="text-blue-500 dark:text-blue-400" /> Required Prerequisites
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] mt-0.5">
                    {program.label} · {province.name}
                  </p>
                </div>
                <span className={cn('shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full',
                  metCount === totalPrereqs
                    ? 'bg-emerald-50 dark:bg-[#10b981]/12 text-emerald-700 dark:text-[#10b981]'
                    : 'bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b]')}>
                  {metCount === totalPrereqs ? <CheckCircle2 size={11} /> : <AlertTriangle size={11} />}
                  {metCount}/{totalPrereqs} met
                </span>
              </div>

              <div className="space-y-3">
                {prereqs.map((pr) => (
                  <div key={pr.name} className={cn('rounded-xl border p-3.5 transition-colors',
                    pr.met
                      ? 'border-emerald-100 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.07]'
                      : 'border-amber-100 dark:border-amber-500/20 bg-amber-50/50 dark:bg-amber-500/[0.07]')}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-slate-800 dark:text-white leading-tight">{pr.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] mt-0.5">{pr.note}</p>
                      </div>
                      <span className={cn('shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md',
                        pr.met
                          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300')}>
                        {pr.met ? <CheckCircle2 size={10} /> : <AlertTriangle size={10} />}
                        {pr.met ? 'Met' : 'Not met'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, (pr.current / Math.max(pr.required, 1)) * 100)}%`, backgroundColor: pr.met ? '#10b981' : '#f59e0b' }} />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-600 dark:text-[#c8ccdf] tabular-nums shrink-0">
                        {pr.current}% <span className="text-slate-400 dark:text-[#40455e]">/ req {pr.required}%</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#40455e] mt-3.5 leading-snug">
                Minimums vary by program intake and are administered through {province.body}. Always confirm
                requirements with the institution and the Red Seal / provincial standard for your trade.
              </p>
            </div>

            {/* Course Overview card */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/[0.05]">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Course Overview</h2>
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/[0.05]">
                      {['COURSE', 'CURRENT', 'TREND', 'TARGET', 'PROGRESS', 'STATUS'].map(h => (
                        <th key={h} className="px-5 lg:px-6 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e]">
                          {h}
                        </th>
                      ))}
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {GRADES.map((course, idx) => {
                      const meta = COURSE_META[course.courseCode];
                      const val  = grades[idx] ?? course.value;
                      const color = gradeColor(val);
                      const isAtRisk = meta?.status === 'At Risk';
                      return (
                        <tr key={course.courseCode} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                          <td className="px-5 lg:px-6 py-4">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{course.label}</p>
                            <p className="text-xs text-slate-400 dark:text-[#40455e]">{meta?.teacher ?? '—'}</p>
                          </td>
                          <td className="px-5 lg:px-6 py-4">
                            <span className="text-sm font-bold tabular-nums" style={{ color }}>{val}%</span>
                          </td>
                          <td className="px-5 lg:px-6 py-4">
                            {meta && (
                              <span className={`flex items-center gap-1 text-xs font-bold ${meta.trend >= 0 ? 'text-emerald-600 dark:text-[#10b981]' : 'text-red-500'}`}>
                                {meta.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                {meta.trend > 0 ? '+' : ''}{meta.trend}%
                              </span>
                            )}
                          </td>
                          <td className="px-5 lg:px-6 py-4">
                            <span className="text-sm text-slate-600 dark:text-[#c8ccdf] tabular-nums">{meta?.target ?? '—'}%</span>
                          </td>
                          <td className="px-5 lg:px-6 py-4">
                            <Sparkline pts={sparkFor(val)} color={color} />
                          </td>
                          <td className="px-5 lg:px-6 py-4">
                            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                              isAtRisk
                                ? 'bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b]'
                                : 'bg-emerald-50 dark:bg-[#10b981]/12 text-emerald-700 dark:text-[#10b981]'
                            }`}>
                              {isAtRisk ? <AlertTriangle size={10} /> : <CheckCircle2 size={10} />}
                              {meta?.status ?? 'On Track'}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/[0.05] text-slate-400 dark:text-[#8e92ad] transition-all">
                              <MoreVertical size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-50 dark:divide-white/[0.04]">
                {GRADES.map((course, idx) => {
                  const meta  = COURSE_META[course.courseCode];
                  const val   = grades[idx] ?? course.value;
                  const color = gradeColor(val);
                  const isAtRisk = meta?.status === 'At Risk';
                  return (
                    <div key={course.courseCode} className="px-5 py-4 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-white">{course.label}</p>
                          <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-0.5">{meta?.teacher}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold tabular-nums" style={{ color }}>{val}%</p>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                            isAtRisk
                              ? 'bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b]'
                              : 'bg-emerald-50 dark:bg-[#10b981]/12 text-emerald-700 dark:text-[#10b981]'
                          }`}>
                            {meta?.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-[#8e92ad]">
                        <span className={`flex items-center gap-1 font-bold ${meta && meta.trend >= 0 ? 'text-emerald-600 dark:text-[#10b981]' : 'text-red-500'}`}>
                          {meta && meta.trend >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {meta && meta.trend > 0 ? '+' : ''}{meta?.trend}%
                        </span>
                        <span>Target: <strong className="text-slate-800 dark:text-white">{meta?.target}%</strong></span>
                        <span className="ml-auto text-slate-400 dark:text-[#40455e]">{meta?.updated}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/[0.06] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${val}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 2-column: grade-history chart + upcoming assessments */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

              {/* Grade History */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-4 sm:p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Grade History</h3>
                  <button className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#8e92ad] border border-gray-200 dark:border-white/[0.08] rounded-lg px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
                    This Year <ChevronDown size={11} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="flex flex-col justify-between text-[9px] text-slate-400 dark:text-[#40455e] pb-6" style={{ height: '100px' }}>
                    {['100%', '75%', '50%', '25%', '0%'].map(l => <span key={l}>{l}</span>)}
                  </div>
                  <div className="flex-1 flex flex-col min-w-0">
                    <div style={{ height: '100px' }} className="w-full">
                      <AreaChart pts={OVERTIME_PTS} />
                    </div>
                    <div className="flex justify-between pt-1.5 px-1">
                      {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'].map(l => (
                        <span key={l} className="text-[9px] text-slate-400 dark:text-[#40455e]">{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Assessments */}
              <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-4 sm:p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upcoming Assessments</h3>
                <div className="space-y-4">
                  {UPCOMING.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-white">
                          <span className="text-slate-500 dark:text-[#8e92ad] font-normal">{item.course} - </span>
                          {item.type}
                        </p>
                        {item.date && <p className="text-xs text-slate-400 dark:text-[#40455e] mt-0.5">{item.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-[#2b5ce6] hover:text-blue-700 dark:hover:text-[#7b9ef0] transition-colors">
                  View Full Calendar <ChevronRight size={12} />
                </button>
              </div>

            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────────────────── */}
          <div className="space-y-4 sm:space-y-5">

            {/* Subject Mix */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Subject Mix</h3>
              <div className="flex items-center gap-4">
                <div className="dark:hidden">
                  <DonutChart pct={Math.round(top6Avg)} segments={donutSegments} light />
                </div>
                <div className="hidden dark:block">
                  <DonutChart pct={Math.round(top6Avg)} segments={donutSegments} />
                </div>
                <div className="flex-1 space-y-2.5 min-w-0">
                  {[
                    { label: '90% and above', count: above90, color: '#10b981' },
                    { label: '80–89%',        count: above80, color: '#f59e0b' },
                    { label: '70–79%',        count: above70, color: '#eab308' },
                    { label: 'Below 70%',     count: below70, color: '#ef4444' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="h-2 w-2 rounded-full shrink-0" style={{ background: row.color }} />
                        <span className="text-[11px] text-slate-500 dark:text-[#8e92ad] truncate">{row.label}</span>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] shrink-0">{row.count} Courses</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Progress to Goal */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Admission Goals</h3>
              <div className="space-y-4">
                {GOAL_ROWS.map((g) => (
                  <div key={g.label}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <p className="text-xs text-slate-500 dark:text-[#8e92ad] min-w-0">{g.label}</p>
                      <p className="text-xs font-bold text-[#2b5ce6] shrink-0">{g.display}</p>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden bg-gray-100 dark:bg-white/[0.06]">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-700"
                        style={{ width: `${(g.value / g.max) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2b5ce6] hover:text-blue-700 dark:hover:text-[#7b9ef0] transition-colors">
                View All Goals <ChevronRight size={12} />
              </button>
            </div>

            {/* Prerequisites at Risk */}
            <div className="rounded-2xl border border-gray-100 dark:border-white/[0.07] bg-white dark:bg-[#161a27] shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Prerequisites to Improve</h3>
              {prereqs.filter(p => !p.met).length === 0 ? (
                <div className="flex items-center gap-2 text-[12px] text-emerald-600 dark:text-[#10b981] font-medium">
                  <CheckCircle2 size={14} /> All prerequisites for {program.label.split('(')[0].trim()} are met.
                </div>
              ) : (
                <div className="space-y-3">
                  {prereqs.filter(p => !p.met).map((pr) => (
                    <div key={pr.name} className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{pr.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-0.5">Need +{Math.max(0, pr.required - pr.current)}% to reach minimum</p>
                      </div>
                      <span className="text-xs font-bold text-amber-500 shrink-0 tabular-nums">{pr.current}%</span>
                      <button className="shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-[#f59e0b]/12 text-amber-600 dark:text-[#f59e0b] hover:bg-amber-100 dark:hover:bg-[#f59e0b]/20 border border-amber-200 dark:border-transparent transition-colors">
                        Improve
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#2b5ce6] hover:text-blue-700 dark:hover:text-[#7b9ef0] transition-colors">
                View Recommendations <ChevronRight size={12} />
              </button>
            </div>

            {/* Study Plan CTA */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 dark:from-[#7c3aed]/20 dark:via-[#2b5ce6]/15 dark:to-[#7c3aed]/10 border border-purple-100 dark:border-[#7c3aed]/20 p-5">
              <div className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-purple-200/40 dark:bg-blue-600/15 blur-2xl" />
              <div className="relative flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-xl bg-purple-100 dark:bg-blue-600/20 flex items-center justify-center">
                  <Sparkles size={15} className="text-purple-600 dark:text-[#a78bfa]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Boost Your Prerequisites</p>
                  <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-1 leading-relaxed">
                    Focus on the courses that gate your trade intake to strengthen your apprenticeship application.
                  </p>
                </div>
              </div>
              <button className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md shadow-blue-200 dark:shadow-[#7c3aed]/20">
                Build Study Plan
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourse && (
        <AddCourseModal
          onClose={() => setShowAddCourse(false)}
          onAdd={() => {}}
        />
      )}
    </div>
  );
}
