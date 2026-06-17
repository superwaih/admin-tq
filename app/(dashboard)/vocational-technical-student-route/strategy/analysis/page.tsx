'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, CheckCircle2, Plus, Pencil,
  Trash2, Upload, FileText, X, Save, ChevronRight,
  Sparkles, MessageSquare, Target, Wrench, GraduationCap,
  History, Lightbulb, BarChart3, HardHat, Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Academic Info' },
  { id: 2, label: 'Hands-on Experience' },
  { id: 3, label: 'Statement & Interview' },
  { id: 4, label: 'Program Selection' },
  { id: 5, label: 'Analysis Results' },
];

const ANALYSIS_FACTORS = [
  { icon: BarChart3,     label: 'Academic Prerequisites',     color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-500/15' },
  { icon: Wrench,        label: 'Hands-on / Work Experience',  color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/15' },
  { icon: MessageSquare, label: 'Aptitude & Interview',        color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/15' },
  { icon: Target,        label: 'Program Competitiveness',     color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/15' },
  { icon: History,       label: 'Regional Demand & History',   color: 'text-rose-600 dark:text-rose-400',     bg: 'bg-rose-50 dark:bg-rose-500/15' },
];

const PROVINCES = [
  'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba', 'Saskatchewan',
  'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador', 'Prince Edward Island',
  'Northwest Territories', 'Yukon', 'Nunavut',
];

// Trade / technical programs available for analysis (province-agnostic catalog)
const PROGRAMS = [
  { name: 'Electrician (309A)',                          type: 'Apprenticeship' },
  { name: 'Automotive Service Technician (310S)',        type: 'Apprenticeship' },
  { name: 'Welder (456A)',                               type: 'Apprenticeship' },
  { name: 'HVAC / Refrigeration Mechanic (313A)',        type: 'Apprenticeship' },
  { name: 'Plumber (306A)',                              type: 'Apprenticeship' },
  { name: 'Construction / Civil Engineering Technician', type: 'College/Technical Diploma' },
  { name: 'Electrical Engineering Technology',           type: 'College/Technical Diploma' },
  { name: 'HVAC Engineering Technician',                 type: 'College/Technical Diploma' },
  { name: 'Computer / Network Technician',               type: 'College/Technical Diploma' },
];

const SELECTED_PROGRAMS = [
  { id: 1, title: 'Electrician (309A)',            org: 'Skilled Trades Ontario · Conestoga', type: 'Apprenticeship',            match: 92, matchCls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  { id: 2, title: 'HVAC / Refrigeration (313A)',   org: 'SkilledTradesBC · BCIT',             type: 'Apprenticeship',            match: 74, matchCls: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' },
  { id: 3, title: 'Electrical Engineering Tech',   org: 'SAIT · Alberta AIT',                 type: 'College/Technical Diploma', match: 58, matchCls: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' },
];

const PROGRAM_TYPES = ['Apprenticeship', 'College/Technical Diploma'];
const EDU_LEVELS    = ['Currently in High School', 'High School Graduate', 'Mature / Returning Student', 'Career Changer'];
const GRAD_YEARS    = ['2025', '2026', '2027', '2028'];
const GRADE_STATUS  = ['Grade 10', 'Grade 11', 'Grade 12 – First Semester', 'Grade 12 – Second Semester', 'Graduated', 'Out of school'];
const STANDINGS     = ['Top 5%', 'Top 10%', 'Top 20%', 'Top 30%', 'Top 50%', 'N/A'];
const TEST_NAMES    = ['Trade Entrance Exam', 'Mechanical Aptitude', 'Accuplacer', 'GED', 'Math Assessment', 'English Assessment'];
const ACTIVITIES    = ['Co-op / Work Placement', 'Part-time Trade Job', 'Shop / Hands-on Projects', 'Volunteer Build (e.g. Habitat)', 'Pre-apprenticeship Program', 'Skills Competition', 'Safety Certification (WHMIS)', "Driver's Licence / Equipment Ticket"];
const STATEMENT_QLTY = ['Excellent', 'Strong', 'Good', 'Fair', 'Needs Work'];
const INT_CONF       = ['High', 'Medium', 'Low'];

interface TestScore { id: number; name: string; score: string; date: string; editing: boolean }
interface Activity  { id: number; name: string; years: string; role: string }

// ── Helpers ───────────────────────────────────────────────────────────────────

function Label({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
      {children}{optional && <span className="ml-1.5 text-[10px] font-normal text-slate-400">(Optional)</span>}
    </label>
  );
}

function TextInput({ placeholder, value, onChange, type = 'text' }: {
  placeholder: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full h-10 px-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
  );
}

function SelectInput({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="relative">
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full appearance-none h-10 pl-3 pr-8 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all cursor-pointer">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">{children}</h3>;
}

// ── Stepper ───────────────────────────────────────────────────────────────────

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-7">
      {STEPS.map((s, i) => {
        const done   = s.id < current;
        const active = s.id === current;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn('w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all text-[11px] font-bold',
                done   ? 'bg-blue-600 border-blue-600 text-white' :
                active ? 'bg-white dark:bg-[#161a27] border-blue-600 text-blue-600' :
                         'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/10 text-slate-400')}>
                {done ? <CheckCircle2 size={14}/> : s.id}
              </div>
              <span className={cn('text-[9px] font-bold mt-1.5 hidden sm:block text-center uppercase tracking-wide max-w-[70px] leading-tight',
                active ? 'text-blue-600 dark:text-blue-400' :
                done   ? 'text-slate-400 dark:text-slate-500' : 'text-slate-400 dark:text-[#8e92ad]')}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px w-10 sm:w-16 mx-1 mb-4', done ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10')}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RunAnalysisPage() {
  const [step, setStep]           = useState(1);

  // Step 1 – Academic
  const [eduLevel, setEduLevel]   = useState('Currently in High School');
  const [phone, setPhone]         = useState('');
  const [province, setProvince]   = useState('Ontario');
  const [programType, setProgramType] = useState('Apprenticeship');
  const [targetProgram, setTargetProgram] = useState('Electrician (309A)');
  const [overallAvg, setOverallAvg] = useState('78');
  const [gradYear, setGradYear]   = useState('2026');
  const [credits, setCredits]     = useState('22');
  const [gradeStatus, setGradeStatus] = useState('Grade 12 – First Semester');
  const [standing, setStanding]   = useState('Top 20%');
  const [tests, setTests]         = useState<TestScore[]>([
    { id: 1, name: 'Trade Entrance Exam', score: '78%', date: 'Nov. 2025', editing: false },
    { id: 2, name: 'Mechanical Aptitude', score: '82%', date: 'Oct. 2025', editing: false },
  ]);
  const [addingTest, setAddingTest]   = useState(false);
  const [newTestName, setNewTestName] = useState(TEST_NAMES[0]);
  const [newTestScore, setNewTestScore] = useState('');
  const [newTestDate, setNewTestDate]   = useState('');
  const [transcriptFiles, setTranscriptFiles] = useState<File[]>([]);
  const [dragging, setDragging]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 2 – Hands-on experience
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, name: 'Part-time Trade Job',  years: '2', role: 'Electrician helper' },
    { id: 2, name: 'Shop / Hands-on Projects', years: '3', role: 'Lead builder' },
  ]);
  const [addingActivity, setAddingActivity] = useState(false);
  const [newActName, setNewActName]   = useState(ACTIVITIES[0]);
  const [newActYears, setNewActYears] = useState('1');
  const [newActRole, setNewActRole]   = useState('');
  const [sponsorSecured, setSponsorSecured] = useState(true);

  // Step 3 – Statement & Interview
  const [statementQuality, setStatementQuality] = useState('Good');
  const [interviewConf, setInterviewConf] = useState('Medium');
  const [statementSample, setStatementSample] = useState('');
  const [intPrepNotes, setIntPrepNotes]   = useState('');

  // Step 4 – Program Selection
  const [selectedProgs, setSelectedProgs] = useState<number[]>([1, 2]);

  // Step 5 – Results
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone]           = useState(false);

  const programOptions = PROGRAMS.filter(p => p.type === programType).map(p => p.name);
  const selectedRecords = SELECTED_PROGRAMS.filter(p => selectedProgs.includes(p.id));

  function changeProgramType(t: string) {
    setProgramType(t);
    const first = PROGRAMS.find(p => p.type === t);
    if (first) setTargetProgram(first.name);
  }

  const avgNum = parseFloat(overallAvg) || 0;
  const avgLabel = avgNum >= 85 ? { text:'Excellent', cls:'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' }
                 : avgNum >= 75 ? { text:'Good',      cls:'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' }
                 : avgNum >= 65 ? { text:'Fair',      cls:'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15' }
                 :                 { text:'Building',  cls:'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15' };
  const isApprenticeship = programType === 'Apprenticeship';

  function handleFiles(fl: FileList | null) {
    if (!fl) return;
    setTranscriptFiles(p => [...p, ...Array.from(fl)].slice(0, 3));
  }
  function addTest() {
    if (!newTestScore) return;
    setTests(t => [...t, { id: Date.now(), name: newTestName, score: newTestScore, date: newTestDate || '—', editing: false }]);
    setNewTestScore(''); setNewTestDate(''); setAddingTest(false);
  }
  function removeTest(id: number) { setTests(t => t.filter(x => x.id !== id)); }
  function addActivity() {
    if (!newActName) return;
    setActivities(a => [...a, { id: Date.now(), name: newActName, years: newActYears, role: newActRole }]);
    setNewActName(ACTIVITIES[0]); setNewActYears('1'); setNewActRole(''); setAddingActivity(false);
  }
  function removeActivity(id: number) { setActivities(a => a.filter(x => x.id !== id)); }
  function advance() {
    if (step === 4) {
      setStep(5);
      setAnalyzing(true);
      setTimeout(() => { setAnalyzing(false); setDone(true); }, 2500);
    } else {
      setStep(s => Math.min(5, s + 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  function goBack() { setStep(s => Math.max(1, s - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Header ── */}
        <div>
          <Link href="/vocational-technical-student-route/strategy" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to Strategy Advisor
          </Link>
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">Run New Analysis</h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
                Get an updated analysis of your profile and your chances of admission into a vocational or technical program.
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1.5 shrink-0">
              <HardHat size={20} className="text-blue-600 dark:text-blue-400"/>
              <Sparkles size={16} className="text-blue-500 -mt-3"/>
            </div>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="flex-1 min-w-0 w-full">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm px-5 sm:px-7 py-6 mb-5">
              <Stepper current={step}/>

              {/* ══ STEP 1: Academic Info ══ */}
              {step === 1 && (
                <div className="space-y-6">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 1: Academic Information</h2>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
                    {/* Left column */}
                    <div className="space-y-4">
                      <div>
                        <Label>Current Status</Label>
                        <SelectInput value={eduLevel} options={EDU_LEVELS} onChange={setEduLevel}/>
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <TextInput placeholder="Enter phone number" value={phone} onChange={setPhone} type="tel"/>
                      </div>
                      <div>
                        <Label>Province / Territory</Label>
                        <SelectInput value={province} options={PROVINCES} onChange={setProvince}/>
                      </div>
                      <div>
                        <Label>Program Type</Label>
                        <SelectInput value={programType} options={PROGRAM_TYPES} onChange={changeProgramType}/>
                      </div>
                      <div>
                        <Label>Target Program / Trade</Label>
                        <SelectInput value={targetProgram} options={programOptions} onChange={setTargetProgram}/>
                      </div>
                      <div>
                        <Label>Overall Average</Label>
                        <div className="relative">
                          <input value={overallAvg} onChange={e => setOverallAvg(e.target.value)} placeholder="e.g. 78"
                            className="w-full h-10 pl-3 pr-24 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                          <span className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full', avgLabel.cls)}>
                            {avgLabel.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <div>
                        <Label>Graduation Year</Label>
                        <SelectInput value={gradYear} options={GRAD_YEARS} onChange={setGradYear}/>
                      </div>
                      <div>
                        <Label>Credits Completed</Label>
                        <TextInput placeholder="e.g. 22" value={credits} onChange={setCredits} type="number"/>
                      </div>
                      <div>
                        <Label>Current Grade / Status</Label>
                        <SelectInput value={gradeStatus} options={GRADE_STATUS} onChange={setGradeStatus}/>
                      </div>
                      <div>
                        <Label optional>Class Standing</Label>
                        <SelectInput value={standing} options={STANDINGS} onChange={setStanding}/>
                      </div>
                    </div>
                  </div>

                  {/* Entrance / Aptitude Tests */}
                  <div>
                    <SectionTitle>Entrance &amp; Aptitude Tests</SectionTitle>
                    <div className="space-y-2">
                      {tests.map(t => (
                        <div key={t.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/3 rounded-xl border border-gray-100 dark:border-white/6">
                          <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{t.name}</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t.score}</p>
                            <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{t.date}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 transition-all" aria-label="Edit test">
                              <Pencil size={12}/>
                            </button>
                            <button onClick={() => removeTest(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all" aria-label="Remove test">
                              <Trash2 size={12}/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {addingTest ? (
                      <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/15 space-y-3">
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Add Test Score</p>
                        <div className="grid sm:grid-cols-3 gap-2">
                          <SelectInput value={newTestName} options={TEST_NAMES} onChange={setNewTestName}/>
                          <TextInput placeholder="Score (e.g. 80%)" value={newTestScore} onChange={setNewTestScore}/>
                          <TextInput placeholder="Date (e.g. Nov 2025)" value={newTestDate} onChange={setNewTestDate}/>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setAddingTest(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                          <button onClick={addTest} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                            <CheckCircle2 size={12}/> Add
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setAddingTest(true)}
                        className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                        <Plus size={13}/> Add Another Test Score
                      </button>
                    )}
                  </div>

                  {/* Upload Transcript */}
                  <div>
                    <SectionTitle>Upload Latest Transcript</SectionTitle>
                    <div
                      onDragOver={e => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                      onClick={() => fileRef.current?.click()}
                      className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl border-2 border-dashed cursor-pointer transition-all',
                        dragging ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-200 dark:border-white/10 hover:border-blue-300 hover:bg-blue-50/30 dark:hover:bg-blue-500/5')}>
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                          <Upload size={16} className="text-blue-600 dark:text-blue-400"/>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <span className="text-blue-600 dark:text-blue-400">Upload files</span>
                            <span className="text-slate-400 ml-1">or drag and drop</span>
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Transcript, certifications or tickets — PDF, DOCX, JPG (Max. 10MB)</p>
                        </div>
                      </div>
                      <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1f30] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 transition-all shrink-0">
                        Browse Files
                      </button>
                      <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.jpg,.jpeg,.png" className="hidden"
                        onChange={e => handleFiles(e.target.files)}/>
                    </div>
                    {transcriptFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between mt-2 px-4 py-2.5 bg-white dark:bg-[#1a1f30] rounded-xl border border-gray-100 dark:border-white/8">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText size={13} className="text-blue-500 shrink-0"/>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{f.name}</span>
                        </div>
                        <button onClick={() => setTranscriptFiles(p => p.filter((_, j) => j !== i))}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all ml-2" aria-label="Remove file">
                          <X size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ STEP 2: Hands-on / Work Experience ══ */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 2: Hands-on &amp; Work Experience</h2>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] -mt-3">List co-ops, trade jobs, shop projects and certifications that show your readiness.</p>

                  {/* Employer sponsorship (apprenticeship) */}
                  {isApprenticeship && (
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl border border-gray-100 dark:border-white/6 bg-gray-50 dark:bg-white/3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Employer sponsorship secured</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Apprenticeship registration usually requires a sponsoring employer.</p>
                      </div>
                      <button onClick={() => setSponsorSecured(v => !v)}
                        role="switch" aria-checked={sponsorSecured} aria-label="Employer sponsorship secured"
                        className={cn('relative w-12 h-6 rounded-full transition-colors shrink-0', sponsorSecured ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-white/15')}>
                        <span className={cn('absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform', sponsorSecured && 'translate-x-6')}/>
                      </button>
                    </div>
                  )}

                  <div className="space-y-3">
                    {activities.map(a => (
                      <div key={a.id} className="flex items-center gap-4 px-4 py-3.5 bg-gray-50 dark:bg-white/3 rounded-xl border border-gray-100 dark:border-white/6 group">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                          <Wrench size={13} className="text-emerald-600 dark:text-emerald-400"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{a.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{a.role} · {a.years} yr{parseInt(a.years) !== 1 ? 's' : ''}</p>
                        </div>
                        <button onClick={() => removeActivity(a.id)} aria-label="Remove experience"
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all">
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>

                  {addingActivity ? (
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/15 space-y-3">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Add Experience</p>
                      <div className="grid sm:grid-cols-3 gap-2">
                        <SelectInput value={newActName} options={ACTIVITIES} onChange={setNewActName}/>
                        <TextInput placeholder="Role / Position" value={newActRole} onChange={setNewActRole}/>
                        <div className="flex items-center gap-2">
                          <TextInput placeholder="Years" value={newActYears} onChange={setNewActYears} type="number"/>
                          <span className="text-xs text-slate-400 whitespace-nowrap">yrs</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setAddingActivity(false)} className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
                        <button onClick={addActivity} className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                          <CheckCircle2 size={12}/> Add
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setAddingActivity(true)}
                      className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors">
                      <Plus size={13}/> Add Experience
                    </button>
                  )}
                </div>
              )}

              {/* ══ STEP 3: Statement & Interview ══ */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 3: Statement &amp; Interview</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label>Application Statement Quality</Label>
                      <SelectInput value={statementQuality} options={STATEMENT_QLTY} onChange={setStatementQuality}/>
                    </div>
                    <div>
                      <Label>Interview Confidence</Label>
                      <SelectInput value={interviewConf} options={INT_CONF} onChange={setInterviewConf}/>
                    </div>
                  </div>
                  <div>
                    <Label optional>Statement Sample (why this trade?)</Label>
                    <textarea value={statementSample} onChange={e => setStatementSample(e.target.value)} rows={7}
                      placeholder="Paste your application statement here for analysis…"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
                  </div>
                  <div>
                    <Label optional>Interview Preparation Notes</Label>
                    <textarea value={intPrepNotes} onChange={e => setIntPrepNotes(e.target.value)} rows={4}
                      placeholder="Describe your interview preparation and any practice sessions…"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
                  </div>
                  <Link href="/vocational-technical-student-route/mmi"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700">
                    Practice trade interview & aptitude stations <ChevronRight size={12}/>
                  </Link>
                </div>
              )}

              {/* ══ STEP 4: Program Selection ══ */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 4: Program Selection</h2>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] -mt-2">Select the trade or technical programs to include in this analysis.</p>
                  <div className="space-y-3">
                    {SELECTED_PROGRAMS.map(p => {
                      const sel = selectedProgs.includes(p.id);
                      return (
                        <label key={p.id} className={cn('flex items-center gap-4 px-4 py-3.5 rounded-2xl border cursor-pointer transition-all',
                          sel ? 'border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-100 dark:border-white/6 bg-white dark:bg-[#1a1f30] hover:border-blue-200')}>
                          <input type="checkbox" checked={sel}
                            onChange={() => setSelectedProgs(ps => sel ? ps.filter(x => x !== p.id) : [...ps, p.id])}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                          <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                            {p.type === 'Apprenticeship' ? <Wrench size={13} className="text-blue-600 dark:text-blue-400"/> : <GraduationCap size={13} className="text-blue-600 dark:text-blue-400"/>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{p.org} · {p.type}</p>
                          </div>
                          <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0', p.matchCls)}>{p.match}% Match</span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="pt-3 border-t border-gray-50 dark:border-white/5">
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{selectedProgs.length} program{selectedProgs.length !== 1 ? 's' : ''} selected for analysis.</p>
                  </div>
                </div>
              )}

              {/* ══ STEP 5: Analysis Results ══ */}
              {step === 5 && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 5: Analysis Results</h2>
                  {analyzing ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-5">
                      <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
                        <Sparkles size={28} className="text-blue-600 dark:text-blue-400 animate-pulse"/>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">Analysing your profile…</p>
                        <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">Evaluating prerequisites, experience and regional demand across selected programs</p>
                      </div>
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" style={{ animationDelay:`${i*0.15}s` }}/>
                        ))}
                      </div>
                    </div>
                  ) : done ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl">
                        <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0"/>
                        <div>
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Analysis Complete!</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Your updated profile analysis for {province} is ready. View it in the Strategy Advisor.</p>
                        </div>
                      </div>
                      {[
                        { label:'Academic Prerequisites',  score:88, trend:'+4%',  color:'#2563eb' },
                        { label:'Hands-on Experience',     score:81, trend:'+6%',  color:'#7c3aed' },
                        { label:'Aptitude & Interview',    score:74, trend:'+8%',  color:'#0891b2' },
                        { label:'Program Competitiveness', score:70, trend:'+3%',  color:'#d97706' },
                        { label:'Regional Demand Fit',     score:85, trend:'+2%',  color:'#059669' },
                      ].map(r => (
                        <div key={r.label} className="bg-white dark:bg-[#1a1f30] rounded-2xl border border-gray-100 dark:border-white/8 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{r.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold" style={{ color:r.color }}>{r.score}%</span>
                              {r.trend !== '—' && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{r.trend}</span>}
                            </div>
                          </div>
                          <div className="h-2 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width:`${r.score}%`, backgroundColor:r.color, transition:'width 0.8s ease' }}/>
                          </div>
                        </div>
                      ))}
                      <Link href="/vocational-technical-student-route/strategy"
                        className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                        View Full Report in Strategy Advisor <ChevronRight size={14}/>
                      </Link>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* ── Tip banner ── */}
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-3.5 mb-5">
              <Lightbulb size={14} className="text-blue-500 shrink-0"/>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <span className="font-bold">Tip:</span> The more accurate your information, the more precise your analysis will be. Click Save &amp; Exit to resume anytime.
              </p>
            </div>

            {/* ── Footer actions ── */}
            {!(step === 5 && done) && (
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">
                <div>
                  {step > 1 && (
                    <button onClick={goBack} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <ChevronLeft size={14}/> Back
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/vocational-technical-student-route/strategy" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <Save size={13}/> Save &amp; Exit
                  </Link>
                  <button onClick={advance} disabled={step === 5 && analyzing}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                    {step === 4 ? <><Sparkles size={13}/> Run Analysis</> : <>Save &amp; Continue <ChevronRight size={14}/></>}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 gap-4">

            {/* About This Analysis */}
            <div className="bg-violet-50 dark:bg-violet-500/10 rounded-2xl border border-violet-100 dark:border-violet-500/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles size={14} className="text-violet-600 dark:text-violet-400"/>
                <h3 className="text-sm font-bold text-violet-800 dark:text-violet-200">About This Analysis</h3>
              </div>
              <p className="text-[11px] text-violet-700 dark:text-violet-300 mb-4 leading-relaxed">
                We weigh prerequisites, hands-on experience and regional demand to estimate your odds and recommend next steps.
              </p>
              <div className="space-y-2.5">
                {ANALYSIS_FACTORS.map(f => (
                  <div key={f.label} className="flex items-center gap-2.5">
                    <div className={cn('w-5 h-5 rounded-lg flex items-center justify-center shrink-0', f.bg)}>
                      <f.icon size={11} className={f.color}/>
                    </div>
                    <span className="text-[11px] font-medium text-violet-700 dark:text-violet-300">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Your Selected Programs */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="px-4 py-3.5 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">
                  Your Selected Programs <span className="text-slate-400">({selectedRecords.length})</span>
                </h3>
                <button onClick={() => setStep(4)} className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {selectedRecords.length === 0 && (
                  <p className="px-4 py-5 text-[11px] text-slate-400 dark:text-[#8e92ad]">No programs selected yet. Choose programs in Step 4.</p>
                )}
                {selectedRecords.map(p => (
                  <div key={p.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      {p.type === 'Apprenticeship' ? <Wrench size={12} className="text-blue-600 dark:text-blue-400"/> : <GraduationCap size={12} className="text-blue-600 dark:text-blue-400"/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">{p.title}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{p.org}</p>
                      <span className={cn('inline-flex mt-1.5 text-[9px] font-bold px-2 py-0.5 rounded-full', p.matchCls)}>{p.match}% Match</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
                  <Award size={13} className="text-amber-600 dark:text-amber-400"/>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Pro Tip</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8e92ad] leading-relaxed mb-3">
                Securing an employer sponsor and logging hands-on hours often raises your odds more than grades alone.
              </p>
              <Link href="/vocational-technical-student-route/strategy"
                className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
                Learn More <ChevronRight size={12}/>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
