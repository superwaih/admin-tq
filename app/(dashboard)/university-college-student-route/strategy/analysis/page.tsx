'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, CheckCircle2, Plus, Pencil,
  Trash2, Upload, FileText, X, Save, ChevronRight,
  Sparkles, BookOpen, Trophy, MessageSquare, Target,
  History, Lightbulb, Building2, TrendingUp, Star,
  GraduationCap, BarChart3, Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Academic Info' },
  { id: 2, label: 'Extracurricular' },
  { id: 3, label: 'Essays & Interview' },
  { id: 4, label: 'Program Selection' },
  { id: 5, label: 'Analysis Results' },
];

const ANALYSIS_FACTORS = [
  { icon: BarChart3,    label: 'Academic Performance',      color: 'text-blue-600 dark:text-blue-400',    bg: 'bg-blue-50 dark:bg-blue-500/15' },
  { icon: Users,        label: 'Extracurricular Impact',     color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/15' },
  { icon: MessageSquare,label: 'Essays & Interview',         color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/15' },
  { icon: Target,       label: 'Program Competitiveness',    color: 'text-amber-600 dark:text-amber-400',  bg: 'bg-amber-50 dark:bg-amber-500/15' },
  { icon: History,      label: 'Historical Admission Data',  color: 'text-rose-600 dark:text-rose-400',    bg: 'bg-rose-50 dark:bg-rose-500/15' },
];

const SELECTED_PROGRAMS = [
  { id: 1, university: 'University of Toronto',  program: 'MEng in Computer Science', match: 92, matchCls: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  { id: 2, university: 'University of Toronto',  program: 'MEng in Computer Science', match: 68, matchCls: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' },
  { id: 3, university: 'University of Toronto',  program: 'MEng in Computer Science', match: 35, matchCls: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300' },
];

const EDU_LEVELS   = ['Undergraduate', 'Graduate', 'High School', 'College Diploma'];
const GRAD_YEARS   = ['2025', '2026', '2027', '2028'];
const YEARS        = ['1st Year – First Semester', '1st Year – Second Semester', '2nd Year – First Semester', '2nd Year – Second Semester', '3rd Year – First Semester', '3rd Year – Second Semester', '4th Year', 'Graduated'];
const CLASS_RANKS  = ['Top 5%', 'Top 10%', 'Top 20%', 'Top 30%', 'Top 50%', 'N/A'];
const UNIVERSITIES = ['University of Toronto', 'University of Waterloo', 'McMaster University', "Queen's University", 'University of British Columbia'];
const PROGRAMS_MAP: Record<string, string[]> = {
  'University of Toronto':   ['Engineering Science', 'Computer Science', 'Health Sciences', 'Commerce'],
  'University of Waterloo':  ['Computer Science', 'Software Engineering', 'Systems Design'],
  'McMaster University':     ['Health Sciences', 'Engineering', 'Life Sciences'],
  "Queen's University":      ['Computing', 'Engineering'],
  'University of British Columbia': ['Computer Science', 'Engineering'],
};
const TEST_NAMES  = ['IELTS Academic', 'TOEFL iBT', 'GRE General', 'GMAT', 'SAT', 'ACT'];
const ACTIVITIES  = ['Athletics / Sports', 'Music / Arts', 'Volunteer Work', 'Research', 'Leadership Role', 'Part-time Job', 'Academic Clubs', 'Community Service'];
const ESSAY_QLTY  = ['Excellent', 'Strong', 'Good', 'Fair', 'Needs Work'];
const INT_CONF    = ['High', 'Medium', 'Low'];

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
  const [eduLevel, setEduLevel]   = useState('Undergraduate');
  const [phone, setPhone]         = useState('');
  const [univSchool, setUnivSchool] = useState('University of Toronto');
  const [progMajor, setProgMajor] = useState('Engineering Science');
  const [gpa, setGpa]             = useState('3.72');
  const [gradYear, setGradYear]   = useState('2026');
  const [courses, setCourses]     = useState('68');
  const [yearSem, setYearSem]     = useState('3rd Year – First Semester');
  const [classRank, setClassRank] = useState('Top 20%');
  const [tests, setTests]         = useState<TestScore[]>([
    { id: 1, name: 'IELTS Academic', score: 'Overall 7.5', date: 'Nov. 2023', editing: false },
    { id: 2, name: 'TOEFL iBT',      score: '110',         date: 'Oct. 2023', editing: false },
  ]);
  const [addingTest, setAddingTest]   = useState(false);
  const [newTestName, setNewTestName] = useState(TEST_NAMES[0]);
  const [newTestScore, setNewTestScore] = useState('');
  const [newTestDate, setNewTestDate]   = useState('');
  const [transcriptFiles, setTranscriptFiles] = useState<File[]>([]);
  const [dragging, setDragging]   = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Step 2 – Extracurricular
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, name: 'Athletics / Sports',  years: '3', role: 'Team Captain' },
    { id: 2, name: 'Volunteer Work',       years: '2', role: 'Coordinator' },
  ]);
  const [addingActivity, setAddingActivity] = useState(false);
  const [newActName, setNewActName]   = useState(ACTIVITIES[0]);
  const [newActYears, setNewActYears] = useState('1');
  const [newActRole, setNewActRole]   = useState('');

  // Step 3 – Essays & Interview
  const [essayQuality, setEssayQuality]   = useState('Good');
  const [interviewConf, setInterviewConf] = useState('Medium');
  const [essaySample, setEssaySample]     = useState('');
  const [intPrepNotes, setIntPrepNotes]   = useState('');

  // Step 4 – Program Selection
  const [selectedProgs, setSelectedProgs] = useState<number[]>([1, 2]);

  // Step 5 – Results
  const [analyzing, setAnalyzing] = useState(false);
  const [done, setDone]           = useState(false);

  const progOptions = PROGRAMS_MAP[univSchool] ?? ['Engineering Science'];
  const gpaNum = parseFloat(gpa) || 0;
  const gpaLabel = gpaNum >= 3.7 ? { text:'Excellent', cls:'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' }
                 : gpaNum >= 3.3 ? { text:'Good',      cls:'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' }
                 : gpaNum >= 2.7 ? { text:'Fair',      cls:'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15' }
                 :                  { text:'Low',       cls:'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15' };

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
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-0">

        {/* ── Header ── */}
        <div className="mb-6">
          <Link href="/university-college-student-route/strategy" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to Strategy Advisor
          </Link>
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Run New Analysis</h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Get an updated AI analysis of your profile and admission chances.</p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-1">
              <span className="text-3xl font-black text-blue-600 italic" style={{ fontFamily: 'Georgia, serif' }}>Ai</span>
              <Sparkles size={18} className="text-blue-500 -mt-3"/>
            </div>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="flex-1 min-w-0">
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
                        <Label>Education Level</Label>
                        <SelectInput value={eduLevel} options={EDU_LEVELS} onChange={setEduLevel}/>
                      </div>
                      <div>
                        <Label>Phone Number</Label>
                        <TextInput placeholder="Enter phone number" value={phone} onChange={setPhone} type="tel"/>
                      </div>
                      <div>
                        <Label>University / School</Label>
                        <SelectInput value={univSchool} options={UNIVERSITIES}
                          onChange={v => { setUnivSchool(v); setProgMajor(PROGRAMS_MAP[v]?.[0] ?? ''); }}/>
                      </div>
                      <div>
                        <Label>Program / Major</Label>
                        <SelectInput value={progMajor} options={progOptions} onChange={setProgMajor}/>
                      </div>
                      <div>
                        <Label>Current GPA</Label>
                        <div className="relative">
                          <input value={gpa} onChange={e => setGpa(e.target.value)} placeholder="e.g. 3.72 /4.0"
                            className="w-full h-10 pl-3 pr-24 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                          <span className={cn('absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-0.5 rounded-full', gpaLabel.cls)}>
                            {gpaLabel.text}
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
                        <Label>Course Completed</Label>
                        <TextInput placeholder="e.g. 68" value={courses} onChange={setCourses} type="number"/>
                      </div>
                      <div>
                        <Label>Current Year / Semester</Label>
                        <SelectInput value={yearSem} options={YEARS} onChange={setYearSem}/>
                      </div>
                      <div>
                        <Label optional>Class Rank</Label>
                        <SelectInput value={classRank} options={CLASS_RANKS} onChange={setClassRank}/>
                      </div>
                    </div>
                  </div>

                  {/* Standardized Tests */}
                  <div>
                    <SectionTitle>Standardize Tests</SectionTitle>
                    <div className="space-y-2">
                      {tests.map(t => (
                        <div key={t.id} className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/3 rounded-xl border border-gray-100 dark:border-white/6">
                          <div className="flex-1 min-w-0 grid grid-cols-3 gap-4">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate">{t.name}</p>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t.score}</p>
                            <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{t.date}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-slate-400 hover:text-blue-600 transition-all">
                              <Pencil size={12}/>
                            </button>
                            <button onClick={() => removeTest(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all">
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
                          <TextInput placeholder="Score (e.g. 7.5)" value={newTestScore} onChange={setNewTestScore}/>
                          <TextInput placeholder="Date (e.g. Nov 2023)" value={newTestDate} onChange={setNewTestDate}/>
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
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">PDF, DOCX, PPTX, or ZIP (Max. 10MB)</p>
                        </div>
                      </div>
                      <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                        className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1f30] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 transition-all shrink-0">
                        Browse Files
                      </button>
                      <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.pptx,.zip" className="hidden"
                        onChange={e => handleFiles(e.target.files)}/>
                    </div>
                    {transcriptFiles.map((f, i) => (
                      <div key={i} className="flex items-center justify-between mt-2 px-4 py-2.5 bg-white dark:bg-[#1a1f30] rounded-xl border border-gray-100 dark:border-white/8">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText size={13} className="text-blue-500 shrink-0"/>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">{f.name}</span>
                        </div>
                        <button onClick={() => setTranscriptFiles(p => p.filter((_, j) => j !== i))}
                          className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all ml-2">
                          <X size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ══ STEP 2: Extracurricular ══ */}
              {step === 2 && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 2: Extracurricular Activities</h2>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] -mt-3">List your meaningful activities, roles, and commitments.</p>

                  <div className="space-y-3">
                    {activities.map(a => (
                      <div key={a.id} className="flex items-center gap-4 px-4 py-3.5 bg-gray-50 dark:bg-white/3 rounded-xl border border-gray-100 dark:border-white/6 group">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                          <Trophy size={13} className="text-emerald-600 dark:text-emerald-400"/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{a.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{a.role} · {a.years} yr{parseInt(a.years) !== 1 ? 's' : ''}</p>
                        </div>
                        <button onClick={() => removeActivity(a.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all">
                          <Trash2 size={12}/>
                        </button>
                      </div>
                    ))}
                  </div>

                  {addingActivity ? (
                    <div className="p-4 bg-blue-50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/15 space-y-3">
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Add Activity</p>
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
                      <Plus size={13}/> Add Activity
                    </button>
                  )}
                </div>
              )}

              {/* ══ STEP 3: Essays & Interview ══ */}
              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 3: Essays &amp; Interview</h2>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <Label>Essay Quality</Label>
                      <SelectInput value={essayQuality} options={ESSAY_QLTY} onChange={setEssayQuality}/>
                    </div>
                    <div>
                      <Label>Interview Confidence</Label>
                      <SelectInput value={interviewConf} options={INT_CONF} onChange={setInterviewConf}/>
                    </div>
                  </div>
                  <div>
                    <Label optional>Essay Sample (paste your best essay)</Label>
                    <textarea value={essaySample} onChange={e => setEssaySample(e.target.value)} rows={7}
                      placeholder="Paste your essay here for AI analysis…"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
                  </div>
                  <div>
                    <Label optional>Interview Preparation Notes</Label>
                    <textarea value={intPrepNotes} onChange={e => setIntPrepNotes(e.target.value)} rows={4}
                      placeholder="Describe your interview preparation and any practice sessions…"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
                  </div>
                </div>
              )}

              {/* ══ STEP 4: Program Selection ══ */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Step 4: Program Selection</h2>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] -mt-2">Select the programs you want to include in this analysis.</p>
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
                            <Building2 size={13} className="text-blue-600"/>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.university}</p>
                            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{p.program}</p>
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
                        <p className="text-sm font-bold text-slate-800 dark:text-white">AI is analysing your profile…</p>
                        <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">Evaluating 60+ factors across all selected programs</p>
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
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">Your updated AI profile analysis is ready. View it in the Strategy Advisor.</p>
                        </div>
                      </div>
                      {[
                        { label:'Academic Performance',   score:92, trend:'+4%',  color:'#2563eb' },
                        { label:'Extracurricular Impact',  score:81, trend:'+2%',  color:'#7c3aed' },
                        { label:'Essay Quality',           score:65, trend:'—',    color:'#d97706' },
                        { label:'Interview Readiness',     score:70, trend:'+8%',  color:'#0891b2' },
                        { label:'Program Fit',             score:78, trend:'+3%',  color:'#059669' },
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
                      <Link href="/university-college-student-route/strategy"
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
              <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pb-8">
                <div>
                  {step > 1 && (
                    <button onClick={goBack} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <ChevronLeft size={14}/> Back
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/university-college-student-route/strategy" className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
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
                Our AI evaluate 60+ factors to generate personalized recommendation and improve your admission chances.
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
                  Your Selected Programs <span className="text-slate-400">({SELECTED_PROGRAMS.length})</span>
                </h3>
                <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {SELECTED_PROGRAMS.map(p => (
                  <div key={p.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-white/3 transition-colors">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      <Building2 size={12} className="text-blue-600"/>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-slate-800 dark:text-white leading-tight">{p.university}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{p.program}</p>
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
                  <Lightbulb size={13} className="text-amber-600 dark:text-amber-400"/>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Pro Tip</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8e92ad] leading-relaxed mb-3">
                The more accurate your information, the more precise your analysis will be.
              </p>
              <Link href="/university-college-student-route/strategy"
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
