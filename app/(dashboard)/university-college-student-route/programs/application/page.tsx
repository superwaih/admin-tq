'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, CheckCircle2, Circle,
  Upload, FileText, X, Lightbulb, Save, ChevronRight,
  User, BookOpen, FolderOpen, PenLine, ClipboardCheck,
  AlertCircle, Calendar, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Personal Info',   icon: User },
  { id: 2, label: 'Academic Info',   icon: BookOpen },
  { id: 3, label: 'Documents',       icon: FolderOpen },
  { id: 4, label: 'Essay',           icon: PenLine },
  { id: 5, label: 'Review & Submit', icon: ClipboardCheck },
];

const CHECKLIST = [
  { key: 'personal',     label: 'Personal Information' },
  { key: 'academic',     label: 'Academic Information' },
  { key: 'document',     label: 'Document' },
  { key: 'essay',        label: 'Essay' },
  { key: 'recommendation', label: 'Recommendation' },
  { key: 'review',       label: 'Review & Submit' },
  { key: 'fee',          label: 'Application Fee' },
];

const GENDERS     = ['Select gender', 'Male', 'Female', 'Non-binary', 'Prefer not to say'];
const COUNTRIES   = ['Select country', 'Canada', 'United States', 'United Kingdom', 'India', 'China', 'Other'];
const UNIVERSITIES = ['Select University', 'University of Toronto', 'University of Waterloo', 'McMaster University', "Queen's University", 'University of British Columbia'];
const PROGRAMS_BY: Record<string, string[]> = {
  'University of Toronto':   ['MEng in Computer Science', 'MEng Electrical Engineering', 'MBA'],
  'University of Waterloo':  ['MEng in Computer Science', 'MSc Computer Science', 'MEng Systems Design'],
  'McMaster University':     ['MEng in Computer Science', 'MEng Health Sciences'],
  "Queen's University":      ['MEng Computing', 'MEng Engineering Science'],
  'University of British Columbia': ['MSc Computer Science', 'MEng Electrical Engineering'],
};
const ESSAY_PROMPTS = [
  'Describe a challenge you have overcome and what you learned from it.',
  'Why are you interested in this program and how will it help you achieve your goals?',
  'Describe a time you demonstrated leadership.',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function FormLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
      {children}
      {optional && <span className="ml-1.5 text-[10px] font-medium text-slate-400">(Optional)</span>}
    </label>
  );
}

function Input({ placeholder, type = 'text', value, onChange }: {
  placeholder: string; type?: string; value: string; onChange: (v: string) => void;
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full h-10 px-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
  );
}

function Select({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
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

function SectionTitle({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-black text-white">{n}</span>
      </div>
      <h2 className="text-base font-bold text-slate-800 dark:text-white">{title}</h2>
    </div>
  );
}

// ── Step Stepper ──────────────────────────────────────────────────────────────

function Stepper({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const done    = step.id < current;
        const active  = step.id === current;
        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn('w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all',
                done   ? 'bg-blue-600 border-blue-600 text-white' :
                active ? 'bg-white dark:bg-[#161a27] border-blue-600 text-blue-600' :
                         'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/10 text-slate-400')}>
                {done
                  ? <CheckCircle2 size={16} className="fill-white stroke-white"/>
                  : <span className="text-[11px] font-bold">{step.id}</span>}
              </div>
              <span className={cn('text-[9px] font-bold mt-1.5 hidden sm:block whitespace-nowrap uppercase tracking-wide',
                active ? 'text-blue-600 dark:text-blue-400' :
                done   ? 'text-slate-500 dark:text-slate-400' :
                         'text-slate-400 dark:text-[#8e92ad]')}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn('h-px w-12 sm:w-20 mx-1 transition-all', done ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/10')}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AddNewApplicationPage() {
  const [step, setStep] = useState(1);

  // Personal Info
  const [fullName,   setFullName]   = useState('');
  const [email,      setEmail]      = useState('');
  const [phone,      setPhone]      = useState('');
  const [gender,     setGender]     = useState('Select gender');
  const [dob,        setDob]        = useState('');
  const [country,    setCountry]    = useState('Select country');

  // Academic Info
  const [university, setUniversity] = useState('University of Waterloo');
  const [program,    setProgram]    = useState('MEng in Computer Science');
  const [prefName,   setPrefName]   = useState('Priya');

  // Documents
  const [files, setFiles]           = useState<File[]>([]);
  const [dragging, setDragging]     = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Essay
  const [essayPrompt, setEssayPrompt] = useState(ESSAY_PROMPTS[0]);
  const [essayText,   setEssayText]   = useState('');

  // Checklist state
  const [checked, setChecked] = useState<Set<string>>(new Set(['personal']));

  const progOptions = PROGRAMS_BY[university] ?? ['MEng in Computer Science'];

  function completedCount() { return checked.size; }

  function handleFiles(incoming: FileList | null) {
    if (!incoming) return;
    const arr = Array.from(incoming).filter(f => f.size <= 10 * 1024 * 1024);
    setFiles(prev => [...prev, ...arr].slice(0, 5));
  }
  function removeFile(idx: number) { setFiles(f => f.filter((_, i) => i !== idx)); }

  function advance() {
    const key = CHECKLIST[step - 1]?.key;
    if (key) setChecked(prev => new Set([...prev, key]));
    setStep(s => Math.min(5, s + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function back() { setStep(s => Math.max(1, s - 1)); }

  // Summary values
  const summaryRows = [
    { label:'Program',    value: program },
    { label:'University', value: university },
    { label:'Intake',     value:'Full 2025' },
    { label:'Deadline',   value:'Jan 15, 2025', badge:'45 day left', badgeCls:'text-red-500 dark:text-red-400' },
    { label:'Application',value:'CAD $125' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-0">

        {/* ── Header ── */}
        <div className="mb-6">
          <Link href="/university-college-student-route/programs"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to My Program
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Application</h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Complete your application for the program below</p>
        </div>

        {/* ── Main layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT: Form ── */}
          <div className="flex-1 min-w-0">

            {/* Stepper */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm px-4 sm:px-8 py-6 mb-5">
              <Stepper current={step}/>

              {/* ── Step 1: Personal Info ── */}
              {step === 1 && (
                <div>
                  <SectionTitle n="1" title="Personal Information"/>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Full Name</FormLabel>
                      <Input placeholder="Enter full name" value={fullName} onChange={setFullName}/>
                    </div>
                    <div>
                      <FormLabel>Email</FormLabel>
                      <Input placeholder="Enter email address" type="email" value={email} onChange={setEmail}/>
                    </div>
                    <div>
                      <FormLabel>Phone Number</FormLabel>
                      <Input placeholder="Enter phone number" type="tel" value={phone} onChange={setPhone}/>
                    </div>
                    <div>
                      <FormLabel>Gender</FormLabel>
                      <Select value={gender} options={GENDERS} onChange={setGender}/>
                    </div>
                    <div>
                      <FormLabel>Date of Birth</FormLabel>
                      <Input placeholder="Select date of birth" type="date" value={dob} onChange={setDob}/>
                    </div>
                    <div>
                      <FormLabel>Country of Residence</FormLabel>
                      <Select value={country} options={COUNTRIES} onChange={setCountry}/>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Academic Info ── */}
              {step === 2 && (
                <div>
                  <SectionTitle n="2" title="Academic Information"/>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>University</FormLabel>
                      <Select value={university} options={UNIVERSITIES} onChange={v => { setUniversity(v); setProgram(PROGRAMS_BY[v]?.[0] ?? ''); }}/>
                    </div>
                    <div>
                      <FormLabel>Preferred Name</FormLabel>
                      <Input placeholder="Preferred name" value={prefName} onChange={setPrefName}/>
                    </div>
                    <div>
                      <FormLabel>Program</FormLabel>
                      <Select value={program} options={progOptions} onChange={setProgram}/>
                    </div>
                  </div>

                  {/* Academic extras */}
                  <div className="mt-6 grid sm:grid-cols-2 gap-4">
                    <div>
                      <FormLabel>GPA / Average</FormLabel>
                      <Input placeholder="e.g. 3.8 / 4.0 or 92%" value="" onChange={() => {}}/>
                    </div>
                    <div>
                      <FormLabel>Expected Graduation</FormLabel>
                      <Input placeholder="e.g. May 2025" value="" onChange={() => {}}/>
                    </div>
                    <div>
                      <FormLabel>Major / Field of Study</FormLabel>
                      <Input placeholder="e.g. Computer Engineering" value="" onChange={() => {}}/>
                    </div>
                    <div>
                      <FormLabel>English Test Score</FormLabel>
                      <Input placeholder="e.g. IELTS 7.5 / TOEFL 100" value="" onChange={() => {}}/>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Documents ── */}
              {step === 3 && (
                <div>
                  <SectionTitle n="3" title="Documents & Files"/>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">Upload any supporting documents related to this application</p>

                  {/* Upload area */}
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileRef.current?.click()}
                    className={cn('flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all',
                      dragging
                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                        : 'border-gray-200 dark:border-white/10 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-blue-50/40 dark:hover:bg-blue-500/5')}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                        <Upload size={18} className="text-blue-600 dark:text-blue-400"/>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                          <span className="text-blue-600 dark:text-blue-400">Upload files</span>
                          <span className="font-normal text-slate-500 dark:text-[#8e92ad] ml-1">or drag and drop</span>
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">PDF, DOCX, PPTX, or ZIP (Max. 10MB each)</p>
                      </div>
                    </div>
                    <button type="button" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                      className="px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1f30] text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-gray-50 transition-all shrink-0">
                      Browse Files
                    </button>
                    <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.pptx,.zip"
                      className="hidden" onChange={e => handleFiles(e.target.files)}/>
                  </div>

                  {/* Uploaded files */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-[#1a1f30] rounded-xl border border-gray-100 dark:border-white/8">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                              <FileText size={14} className="text-blue-600"/>
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">{f.name}</p>
                              <p className="text-[9px] text-slate-400">{(f.size / 1024).toFixed(0)} KB</p>
                            </div>
                          </div>
                          <button onClick={() => removeFile(i)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-300 hover:text-red-500 transition-all shrink-0">
                            <X size={13}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400">
                    <AlertCircle size={12} className="shrink-0"/>
                    <span>Please ensure your name matches your official document</span>
                  </div>

                  {/* Document checklist */}
                  <div className="mt-5 grid sm:grid-cols-2 gap-3">
                    {[
                      { label:'Transcript / Grade Report', done: true  },
                      { label:'CV / Resume',               done: false },
                      { label:'Statement of Purpose',      done: false },
                      { label:'Letters of Recommendation', done: false },
                      { label:'English Proficiency Test',  done: false },
                      { label:'Passport / ID',             done: false },
                    ].map(d => (
                      <div key={d.label} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all ${d.done ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-white dark:bg-[#1a1f30] border-gray-100 dark:border-white/8 text-slate-600 dark:text-slate-300'}`}>
                        {d.done
                          ? <CheckCircle2 size={14} className="text-emerald-500 shrink-0"/>
                          : <Circle size={14} className="text-slate-300 dark:text-slate-600 shrink-0"/>}
                        {d.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Step 4: Essay ── */}
              {step === 4 && (
                <div>
                  <SectionTitle n="4" title="Essay"/>
                  <div className="mb-4">
                    <FormLabel>Select Essay Prompt</FormLabel>
                    <div className="space-y-2">
                      {ESSAY_PROMPTS.map(p => (
                        <label key={p} className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${essayPrompt === p ? 'border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-100 dark:border-white/8 bg-white dark:bg-[#1a1f30] hover:border-blue-200'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${essayPrompt === p ? 'border-blue-600' : 'border-slate-300 dark:border-slate-600'}`}>
                            {essayPrompt === p && <div className="w-2 h-2 rounded-full bg-blue-600"/>}
                          </div>
                          <input type="radio" className="sr-only" checked={essayPrompt === p} onChange={() => setEssayPrompt(p)}/>
                          <span className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{p}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <FormLabel>Your Response</FormLabel>
                      <span className="text-[10px] text-slate-400">{essayText.length} / 650 words</span>
                    </div>
                    <textarea value={essayText} onChange={e => setEssayText(e.target.value)}
                      rows={10} placeholder="Write your essay response here…"
                      className="w-full px-4 py-3 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1.5">Recommended: 400–650 words. Be specific and authentic.</p>
                  </div>
                </div>
              )}

              {/* ── Step 5: Review & Submit ── */}
              {step === 5 && (
                <div>
                  <SectionTitle n="5" title="Review & Submit"/>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-6">Review your application details before submitting.</p>

                  <div className="space-y-4">
                    {/* Personal summary */}
                    <div className="bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-3 uppercase tracking-wider">Personal Information</p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {[
                          { l:'Full Name', v: fullName || '—' },
                          { l:'Email',     v: email    || '—' },
                          { l:'Phone',     v: phone    || '—' },
                          { l:'Gender',    v: gender === 'Select gender' ? '—' : gender },
                          { l:'Date of Birth', v: dob || '—' },
                          { l:'Country',   v: country === 'Select country' ? '—' : country },
                        ].map(r => (
                          <div key={r.l}>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{r.l}</p>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{r.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Academic summary */}
                    <div className="bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-3 uppercase tracking-wider">Academic Information</p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {[
                          { l:'University', v: university },
                          { l:'Program',    v: program    },
                          { l:'Preferred Name', v: prefName || '—' },
                        ].map(r => (
                          <div key={r.l}>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{r.l}</p>
                            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mt-0.5">{r.v}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Documents */}
                    <div className="bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">Documents</p>
                      {files.length === 0
                        ? <p className="text-xs text-slate-400">No files uploaded.</p>
                        : files.map((f,i) => (
                            <div key={i} className="flex items-center gap-2 mt-1.5">
                              <CheckCircle2 size={12} className="text-emerald-500 shrink-0"/>
                              <span className="text-xs text-slate-700 dark:text-slate-200">{f.name}</span>
                            </div>
                          ))
                      }
                    </div>

                    {/* Essay */}
                    <div className="bg-gray-50 dark:bg-white/3 rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300 mb-2 uppercase tracking-wider">Essay</p>
                      <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] italic mb-2">"{essayPrompt}"</p>
                      <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-4">{essayText || 'No essay written yet.'}</p>
                    </div>

                    {/* Consent */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                      <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        I confirm that all information provided is accurate and complete. I understand that providing false information may result in disqualification.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* ── Tip banner ── */}
            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-5 py-3.5 mb-5">
              <div className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                <Lightbulb size={13} className="text-blue-600 dark:text-blue-400"/>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                <span className="font-bold">Tip:</span> You can save your progress and continue later. Click Save &amp; Exit to resume anytime.
              </p>
            </div>

            {/* ── Footer actions ── */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pb-8">
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <button onClick={back}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <ChevronLeft size={14}/> Back
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Link href="/university-college-student-route/programs"
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <Save size={13}/> Save &amp; Exit
                </Link>
                {step < 5 ? (
                  <button onClick={advance}
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                    Save &amp; Continue <ChevronRight size={14}/>
                  </button>
                ) : (
                  <Link href="/university-college-student-route/programs"
                    className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all shadow-sm shadow-emerald-600/25">
                    <CheckCircle2 size={14}/> Submit Application
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 gap-4">

            {/* Application Checklist */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Application Checklist</h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mb-4">
                ({completedCount()} of {CHECKLIST.length} completed)
              </p>
              <div className="space-y-1">
                {CHECKLIST.map((item, i) => {
                  const done    = checked.has(item.key);
                  const active  = CHECKLIST[step - 1]?.key === item.key;
                  return (
                    <div key={item.key} className={cn('flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all',
                      active ? 'bg-blue-50 dark:bg-blue-500/15' : 'hover:bg-gray-50 dark:hover:bg-white/3')}>
                      <div className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                        done   ? 'border-emerald-500 bg-emerald-500' :
                        active ? 'border-blue-600 bg-white dark:bg-[#161a27]' :
                                 'border-gray-200 dark:border-white/15')}>
                        {done && <CheckCircle2 size={10} className="fill-white stroke-white"/>}
                        {active && !done && <div className="w-2 h-2 rounded-full bg-blue-600"/>}
                      </div>
                      <span className={cn('text-xs font-medium',
                        done   ? 'text-slate-500 dark:text-slate-400' :
                        active ? 'text-blue-700 dark:text-blue-300 font-bold' :
                                 'text-slate-500 dark:text-[#8e92ad]')}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Application Summary</h3>
              <div className="space-y-3">
                {summaryRows.map(r => (
                  <div key={r.label} className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider whitespace-nowrap pt-0.5">{r.label}</span>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{r.value}</span>
                      {'badge' in r && r.badge && (
                        <span className={`ml-1.5 text-[9px] font-bold ${r.badgeCls}`}>({r.badge})</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress ring */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Completion</h3>
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  {(() => {
                    const r = 26; const circ = 2 * Math.PI * r;
                    const pct = completedCount() / CHECKLIST.length;
                    return (
                      <svg width="64" height="64" className="-rotate-90">
                        <circle cx="32" cy="32" r={r} fill="none" stroke="#f1f5f9" strokeWidth="6" className="dark:stroke-white/8"/>
                        <circle cx="32" cy="32" r={r} fill="none" stroke="#2563eb" strokeWidth="6"
                          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
                          style={{ transition:'stroke-dashoffset 0.4s ease' }}/>
                      </svg>
                    );
                  })()}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[11px] font-black text-blue-600">
                      {Math.round(completedCount() / CHECKLIST.length * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{completedCount()} of {CHECKLIST.length}</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">sections complete</p>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    <Clock size={10}/> Deadline: Jan 15
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
