'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, Calendar, Upload, Tag, X,
  HelpCircle, FileText, CheckCircle2, Lock, Users,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type Stage    = 'Interview' | 'Secondary' | 'Essays' | 'Decision';
type Priority = 'High' | 'Medium' | 'Low';
type Degree   = 'MD' | 'DDS' | 'MPH' | 'PhD' | 'MSc' | 'BScN' | 'PharmD' | 'Other';

// ── Reusable form components ──────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({ placeholder, type = 'text', value, onChange, icon }: {
  placeholder?: string; type?: string;
  value?: string; onChange?: (v: string) => void; icon?: React.ReactNode;
}) {
  return (
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">{icon}</div>}
      <input
        type={type}
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={`w-full ${icon ? 'pl-8' : 'pl-3'} pr-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all`}
      />
    </div>
  );
}

function Select({ placeholder, options, value, onChange }: {
  placeholder?: string; options: string[];
  value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function DateInput({ value, onChange, placeholder }: { value?: string; onChange?: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative">
      <input
        type="date"
        value={value ?? ''}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
      />
      <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function SectionHeader({ num, title, sub, optional }: { num: string; title: string; sub: string; optional?: boolean }) {
  return (
    <div className="mb-4">
      <h2 className="text-sm font-bold text-slate-800 dark:text-white">
        {num}. {title}{optional && <span className="ml-1.5 text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] normal-case">(Optional)</span>}
      </h2>
      <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{sub}</p>
    </div>
  );
}

const STAGE_STEPS: Array<{ stage: Stage; dot: string; desc: string }> = [
  { stage:'Interview', dot:'bg-blue-500',    desc:'Initial interview with counselor' },
  { stage:'Secondary', dot:'bg-violet-500',  desc:'Secondary application review' },
  { stage:'Essays',    dot:'bg-emerald-500', desc:'Essay review and feedback' },
  { stage:'Decision',  dot:'bg-amber-500',   desc:'Admission decision received' },
];

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AddNewApplicationPage() {
  // Section 1 — Student
  const [fullName,  setFullName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [phone,     setPhone]     = useState('');
  const [dob,       setDob]       = useState('');
  const [gender,    setGender]    = useState('');
  const [level,     setLevel]     = useState('');
  const [gpa,       setGpa]       = useState('');
  const studentId = 'STU-2025-104';

  // Section 2 — Parents / Guidance
  const [parentName,         setParentName]         = useState('');
  const [parentPhone,        setParentPhone]        = useState('');
  const [parentRelationship, setParentRelationship] = useState('');

  // kept for summary/compat
  const student = fullName;

  // Section 2 — University & Program
  const [university,   setUniversity]   = useState('');
  const [program,      setProgram]      = useState('');
  const [degree,       setDegree]       = useState('');
  const [intake,       setIntake]       = useState('');
  const [startDate,    setStartDate]    = useState('2026-05');
  const [campus,       setCampus]       = useState('');

  // Section 3 — Application Details
  const [stage,    setStage]    = useState<Stage | ''>('Interview');
  const [priority, setPriority] = useState<Priority | ''>('High');
  const [progress, setProgress] = useState(0);
  const [source,   setSource]   = useState('');
  const [referred, setReferred] = useState('');
  const [notes,    setNotes]    = useState('');

  // Section 4 — Documents
  const [files,    setFiles]    = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Section 5 — Tags
  const [tagInput, setTagInput] = useState('');
  const [tags,     setTags]     = useState<string[]>(['Interview', 'Scholarship']);

  // Saved state
  const [saved, setSaved] = useState(false);

  const hasData = !!(student || university || program);

  function handleFiles(fl: FileList | null) {
    if (!fl) return;
    setFiles(prev => [...prev, ...Array.from(fl)]);
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  function removeTag(t: string) {
    setTags(prev => prev.filter(x => x !== t));
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const PRIORITY_COLORS: Record<string, string> = {
    High:   'text-red-600   dark:text-red-400',
    Medium: 'text-amber-600 dark:text-amber-400',
    Low:    'text-emerald-600 dark:text-emerald-400',
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto">

        {/* ── Page header ─────────────────────────────── */}
        <div className="mb-5">
          <Link
            href="/counselor/student-applications"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to Student Applications
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Add New Application
          </h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
            Enter student and application details to add a new application to the system.
          </p>
        </div>

        {/* ── Two-column layout ──────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_268px] gap-5 items-start">

          {/* ── Left: form ─────────────────────────── */}
          <div className="space-y-4">

            {/* Section 1 — Student Information */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">

              {/* Title + actions on same row for desktop */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <SectionHeader
                  num="1"
                  title="Student Information"
                  sub="Select or add the student for the application"
                />
                <div className="flex items-center gap-2.5 shrink-0">
                  <Link
                    href="/counselor/student-applications"
                    className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </Link>
                  <button
                    onClick={handleSave}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                      saved
                        ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
                    }`}
                  >
                    {saved ? <><CheckCircle2 size={14} /> Saved!</> : 'Save Application'}
                  </button>
                </div>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label required>Full Name</Label>
                  <Input placeholder="Enter full name" value={fullName} onChange={setFullName} />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input placeholder="Enter email address" type="email" value={email} onChange={setEmail} />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    placeholder="Select gender"
                    options={['Male','Female','Non-binary','Prefer not to say']}
                    value={gender}
                    onChange={setGender}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="relative w-20 shrink-0">
                      <select className="w-full appearance-none pl-2 pr-6 py-2.5 text-xs bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all">
                        <option>🇨🇦 +1</option>
                        <option>🇺🇸 +1</option>
                        <option>🇬🇧 +44</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <Input placeholder="Enter phone number" value={phone} onChange={setPhone} />
                  </div>
                </div>
                <div>
                  <Label>Date of Birth</Label>
                  <DateInput value={dob} onChange={setDob} placeholder="Select date of birth" />
                </div>
                <div>
                  <Label>Level</Label>
                  <Select
                    placeholder="Select level"
                    options={['Grade 9','Grade 10','Grade 11','Grade 12','Undergraduate Year 1','Undergraduate Year 2','Undergraduate Year 3','Undergraduate Year 4','Graduate']}
                    value={level}
                    onChange={setLevel}
                  />
                </div>
              </div>

              {/* Row 3 — GPA + Student ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>GPA <span className="text-[10px] font-normal text-slate-400 ml-1">(Optional)</span></Label>
                  <Input placeholder="e.g. 3.7" value={gpa} onChange={setGpa} />
                </div>
                <div>
                  <Label>Student ID</Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl">
                      <span className="text-sm text-slate-400 dark:text-[#8e92ad] flex-1">Auto-generated ID</span>
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{studentId}</span>
                    </div>
                    <div className="w-9 h-9 flex items-center justify-center bg-gray-100 dark:bg-white/8 rounded-xl shrink-0">
                      <Lock size={13} className="text-slate-400 dark:text-[#8e92ad]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 — Parents / Guidance Information */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader
                num="2"
                title="Parents / Guidance Information"
                sub="Add parent or guidance counselor contact details"
                optional
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Enter full name" value={parentName} onChange={setParentName} />
                </div>
                <div>
                  <Label>Phone Number</Label>
                  <div className="flex gap-2">
                    <div className="relative w-20 shrink-0">
                      <select className="w-full appearance-none pl-2 pr-6 py-2.5 text-xs bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all">
                        <option>🇨🇦 +1</option>
                        <option>🇺🇸 +1</option>
                        <option>🇬🇧 +44</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <Input placeholder="Enter phone number" value={parentPhone} onChange={setParentPhone} />
                  </div>
                </div>
                <div>
                  <Label>Relationship to Student</Label>
                  <Select
                    placeholder="Select relationship"
                    options={['Parent / Guardian','Mother','Father','Grandparent','Legal Guardian','School Guidance Counselor','Other']}
                    value={parentRelationship}
                    onChange={setParentRelationship}
                  />
                </div>
              </div>
            </div>

            {/* Section 3 — University & Program */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader num="3" title="University & Program Information" sub="Select the university and program the student is applying to" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label required>University</Label>
                  <Select
                    placeholder="Search or select university"
                    options={['McGill University','University of Toronto','Western University','UBC','Harvard University','McMaster University','Queen\'s University','University of Ottawa','Dalhousie University','University of Calgary']}
                    value={university}
                    onChange={setUniversity}
                  />
                </div>
                <div>
                  <Label required>Program</Label>
                  <Select
                    placeholder="Search or select program"
                    options={['MD Program','DDS Program','MPH Program','Nursing Program','Pharmacy Program','Physiotherapy','Occupational Therapy','Software Engineering']}
                    value={program}
                    onChange={setProgram}
                  />
                </div>
                <div>
                  <Label required>Degree Type</Label>
                  <Select
                    placeholder="Select degree type"
                    options={['MD','DDS','MPH','PhD','MSc','BScN','PharmD','Other']}
                    value={degree}
                    onChange={setDegree}
                  />
                </div>
                <div>
                  <Label required>Intake / Term</Label>
                  <DateInput value={intake} onChange={setIntake} />
                </div>
                <div>
                  <Label>International Start Date</Label>
                  <div className="relative">
                    <input
                      type="month"
                      defaultValue="2026-05"
                      className="w-full pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                    />
                    <Calendar size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label>Campus (if applicable)</Label>
                  <Select
                    placeholder="Select degree type"
                    options={['Main Campus','Downtown','Online','Satellite Campus']}
                    value={campus}
                    onChange={setCampus}
                  />
                </div>
              </div>
            </div>

            {/* Section 4 — Application Details */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader num="4" title="Application Details" sub="Provide additional details about this application" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label required>Stage</Label>
                  <Select
                    placeholder="Select stage"
                    options={['Interview','Secondary','Essays','Decision']}
                    value={stage}
                    onChange={v => setStage(v as Stage)}
                  />
                </div>
                <div>
                  <Label required>Priority</Label>
                  <div className="relative">
                    <select
                      value={priority}
                      onChange={e => setPriority(e.target.value as Priority)}
                      className={`w-full appearance-none pl-3 pr-8 py-2.5 text-sm font-semibold bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all ${priority ? PRIORITY_COLORS[priority] : 'text-slate-400'}`}
                    >
                      <option value="" disabled>Select priority</option>
                      <option value="High"   className="text-red-600">High</option>
                      <option value="Medium" className="text-amber-600">Medium</option>
                      <option value="Low"    className="text-emerald-600">Low</option>
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <Label>Current Progress</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={progress}
                      onChange={e => setProgress(Number(e.target.value))}
                      className="flex-1 h-1.5 accent-cyan-600 cursor-pointer"
                    />
                    <span className="text-sm font-bold text-slate-700 dark:text-white tabular-nums w-8 text-right">{progress}</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${progress >= 80 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-400' : 'bg-red-500'}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <Label>Source / Channel</Label>
                  <Select
                    placeholder="Select source"
                    options={['Direct','Referral','School Event','Online','Agency','Other']}
                    value={source}
                    onChange={setSource}
                  />
                </div>
                <div>
                  <Label>Referred By (Optional)</Label>
                  <Select
                    placeholder="Search or select"
                    options={['Dr. Sarah Kim','Prof. James Lee','Ms. Amara Singh','Mr. David Chen']}
                    value={referred}
                    onChange={setReferred}
                  />
                </div>
                <div className="sm:col-span-1">
                  <Label>Notes (Optional)</Label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Add any notes about this application"
                    rows={3}
                    className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 5 — Documents & Files */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader num="5" title="Documents & Files" sub="Upload any supporting documents related to this application" optional />

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                className={`relative flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                  dragging
                    ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10'
                    : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/3 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:bg-cyan-50/40 dark:hover:bg-cyan-500/5'
                }`}
                onClick={() => fileRef.current?.click()}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-100 dark:bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <Upload size={16} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                      <span className="text-cyan-600 dark:text-cyan-400">Upload files</span>&nbsp; or drag and drop
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">PDF, DOCX, PPTX, or ZIP (Max. 10MB each)</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="shrink-0 px-4 py-2 rounded-xl border border-cyan-300 dark:border-cyan-500/40 bg-white dark:bg-white/5 text-cyan-600 dark:text-cyan-400 text-sm font-semibold hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all"
                  onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                >
                  Browse Files
                </button>
                <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.pptx,.zip" className="hidden" onChange={e => handleFiles(e.target.files)} />
              </div>

              {/* Uploaded file chips */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/8 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
                      <FileText size={11} className="text-slate-400" />
                      {f.name}
                      <button onClick={() => setFiles(p => p.filter((_,j) => j !== i))} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 6 — Additional Information */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader num="6" title="Additional Information" sub="Add any tags or additional information to organize this application" optional />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Tags */}
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-1.5 px-3 py-2 min-h-[42px] bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500/50 transition-all">
                    {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 rounded-lg text-[11px] font-semibold">
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors"><X size={9} /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder={tags.length === 0 ? 'Add tags and press enter' : ''}
                      className="flex-1 min-w-[100px] bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1.5">
                    Examples: <span className="text-slate-500 dark:text-slate-400">Interview, Scholarship, International</span>
                  </p>
                </div>

                {/* Assigned Counselor */}
                <div>
                  <Label>Counselor</Label>
                  <div className="flex items-center gap-3 px-3 py-2.5 bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">SJ</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Dr. Sarah Johnson</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Senior Counselor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="flex flex-wrap items-center justify-end gap-3 pb-2">
              <Link
                href="/counselor/student-applications"
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
              <button
                onClick={handleSave}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  saved
                    ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
                }`}
              >
                {saved ? <><CheckCircle2 size={14} /> Saved!</> : 'Save Application'}
              </button>
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────── */}
          <div className="space-y-4">

            {/* Application Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Application Summary</h3>
              {hasData ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">Review the details of this application before saving.</p>
                  {student && (
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Student</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{student}</p>
                      {email && <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">{email}</p>}
                    </div>
                  )}
                  {(university || program) && (
                    <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Application</span>
                      {university && <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{university}</p>}
                      {program   && <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">{program}</p>}
                    </div>
                  )}
                  {stage && (
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <span className="text-[11px] text-slate-500 dark:text-[#8e92ad]">Stage</span>
                      <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{stage}</span>
                    </div>
                  )}
                  {priority && (
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl">
                      <span className="text-[11px] text-slate-500 dark:text-[#8e92ad]">Priority</span>
                      <span className={`text-[11px] font-bold ${PRIORITY_COLORS[priority]}`}>{priority}</span>
                    </div>
                  )}
                  {progress > 0 && (
                    <div className="px-3 py-2 bg-gray-50 dark:bg-white/5 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 dark:text-[#8e92ad]">Progress</span>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-white">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${progress >= 80 ? 'bg-emerald-500' : progress >= 50 ? 'bg-amber-400' : 'bg-red-500'}`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 bg-slate-50 dark:bg-white/3 rounded-xl text-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/8 flex items-center justify-center mb-3">
                    <FileText size={20} className="text-slate-300 dark:text-white/20" />
                  </div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-[#8e92ad]">No application data yet</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]/70 mt-1">Fill in the details to see the summary here.</p>
                </div>
              )}
            </div>

            {/* Application Stages */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Application Stages</h3>
              <div className="space-y-3">
                {STAGE_STEPS.map((s, i) => {
                  const isActive = s.stage === stage;
                  const isPast   = STAGE_STEPS.findIndex(x => x.stage === stage) > i;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <div className={`w-2.5 h-2.5 rounded-full mt-0.5 ${isActive || isPast ? s.dot : 'bg-gray-200 dark:bg-white/15'}`} />
                        {i < STAGE_STEPS.length - 1 && (
                          <div className={`w-px flex-1 mt-1 min-h-[20px] ${isPast ? s.dot.replace('bg-','bg-').replace('500','200') : 'bg-gray-200 dark:bg-white/10'}`} />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className={`text-[11px] font-bold ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-[#8e92ad]'}`}>{s.stage}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-start gap-2 mb-1">
                <HelpCircle size={15} className="text-cyan-600 mt-0.5 shrink-0" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Need Help?</h3>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-3 ml-5">
                Learn how to manage application
              </p>
              <button className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
