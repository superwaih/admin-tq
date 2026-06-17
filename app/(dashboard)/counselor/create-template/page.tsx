'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, FileText, Mic, MessageSquare, BookOpen,
  Plus, X, Pencil, Trash2, GripVertical, Upload, Clock, Users,
  Lightbulb, CheckCircle2, BookMarked, CheckCheck,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type SessionType = 'Essay Review' | 'Mock Interview' | 'Consultation' | 'MMI Prep' | 'Custom';
type TemplateStatus = 'active' | 'draft' | 'private';

interface Section {
  id: string;
  title: string;
  duration: number;
}

// ── Session type config ────────────────────────────────────────────────────────
const SESSION_TYPES: Array<{ id: SessionType; icon: React.ReactNode; color: string; bg: string; activeBg: string; activeBorder: string }> = [
  {
    id: 'Essay Review',
    icon: <FileText size={18} />,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-500/15',
    activeBg: 'bg-amber-50 dark:bg-amber-500/20',
    activeBorder: 'border-amber-400 dark:border-amber-500/60',
  },
  {
    id: 'Mock Interview',
    icon: <Mic size={18} />,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-500/15',
    activeBg: 'bg-blue-50 dark:bg-blue-500/20',
    activeBorder: 'border-blue-400 dark:border-blue-500/60',
  },
  {
    id: 'Consultation',
    icon: <MessageSquare size={18} />,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-500/15',
    activeBg: 'bg-indigo-50 dark:bg-indigo-500/20',
    activeBorder: 'border-indigo-400 dark:border-indigo-500/60',
  },
  {
    id: 'MMI Prep',
    icon: <BookOpen size={18} />,
    color: 'text-purple-500',
    bg: 'bg-purple-50 dark:bg-purple-500/15',
    activeBg: 'bg-purple-50 dark:bg-purple-500/20',
    activeBorder: 'border-purple-400 dark:border-purple-500/60',
  },
  {
    id: 'Custom',
    icon: <Plus size={18} />,
    color: 'text-slate-500 dark:text-[#8e92ad]',
    bg: 'bg-slate-100 dark:bg-white/8',
    activeBg: 'bg-slate-100 dark:bg-white/12',
    activeBorder: 'border-slate-400 dark:border-white/30',
  },
];

const SESSION_TYPE_BADGE: Record<SessionType, string> = {
  'Essay Review':   'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
  'Mock Interview': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
  'Consultation':   'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400',
  'MMI Prep':       'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
  'Custom':         'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300',
};

const SUGGESTED_TAGS = ['General', 'Consultation', 'Strategy', 'Planning', 'MMI', 'Essay', 'Interview'];

const TIPS = [
  'Start with a clear section objective',
  'Quality key discussion points',
  'Add recommended sources',
  'Include time allocation for topics',
  'Review and update regularly',
];

const DEFAULT_SECTIONS: Section[] = [
  { id: 's1', title: 'Introduction & Agenda Setting',  duration: 10 },
  { id: 's2', title: 'Main Discussion',                duration: 10 },
  { id: 's3', title: 'Feedback & Recommendations',     duration: 10 },
  { id: 's4', title: 'Next Steps & Action Plan',       duration: 10 },
];

let sectionCounter = 5;

// ── Reusable helpers ───────────────────────────────────────────────────────────
function FieldLabel({ children, required, optional }: { children: React.ReactNode; required?: boolean; optional?: boolean }) {
  return (
    <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
      {optional && <span className="ml-1.5 text-[11px] font-normal text-slate-400 dark:text-[#8e92ad]">(Optional)</span>}
    </p>
  );
}

function SelectDropdown({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CreateTemplatePage() {
  const [templateName, setTemplateName]     = useState('');
  const [sessionType, setSessionType]       = useState<SessionType>('Consultation');
  const [description, setDescription]       = useState('');
  const [duration, setDuration]             = useState('60 minutes');
  const [stage, setStage]                   = useState('Any Stage');
  const [sections, setSections]             = useState<Section[]>(DEFAULT_SECTIONS);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editTitle, setEditTitle]           = useState('');
  const [tagInput, setTagInput]             = useState('');
  const [tags, setTags]                     = useState<string[]>([]);
  const [templateStatus, setTemplateStatus] = useState<TemplateStatus>('active');
  const [files, setFiles]                   = useState<File[]>([]);
  const [dragging, setDragging]             = useState(false);
  const [published, setPublished]           = useState(false);
  const [savedDraft, setSavedDraft]         = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFiles(fl: FileList | null) {
    if (!fl) return;
    setFiles(prev => [...prev, ...Array.from(fl)]);
  }

  function addTag(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  }

  function addSuggestedTag(tag: string) {
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
  }

  function removeTag(t: string) { setTags(prev => prev.filter(x => x !== t)); }

  function addSection() {
    setSections(prev => [...prev, { id: `s${sectionCounter++}`, title: 'New Section', duration: 10 }]);
  }

  function deleteSection(id: string) { setSections(prev => prev.filter(s => s.id !== id)); }

  function startEdit(s: Section) { setEditingSection(s.id); setEditTitle(s.title); }

  function saveEdit(id: string) {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title: editTitle } : s));
    setEditingSection(null);
  }

  function handlePublish() {
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  }

  function handleSaveDraft() {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  }

  const totalDuration = sections.reduce((acc, s) => acc + s.duration, 0);
  const sessionCfg = SESSION_TYPES.find(s => s.id === sessionType)!;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto">

        {/* ── Page header ─────────────────────────────────── */}
        <div className="mb-5">
          <Link
            href="/counselor/session-templates"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to Template
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Create New Template
              </h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
                Build a reusable session template to save time and maintain consistency.
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                onClick={handleSaveDraft}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                  savedDraft
                    ? 'border-emerald-400 text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {savedDraft ? <span className="flex items-center gap-1.5"><CheckCheck size={14} /> Saved!</span> : 'Save as Draft'}
              </button>
              <button
                onClick={handlePublish}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  published
                    ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/20'
                }`}
              >
                {published ? <><CheckCircle2 size={14} /> Published!</> : 'Publish Template'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_272px] gap-5 items-start">

          {/* ── Left: form ──────────────────────────────────── */}
          <div className="space-y-4">

            {/* ── Section 1 & 2: Name + Session Type ─────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">

                {/* Template name */}
                <div>
                  <FieldLabel required>1. Select Student</FieldLabel>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={100}
                      value={templateName}
                      onChange={e => setTemplateName(e.target.value)}
                      placeholder="Enter template name......"
                      className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 dark:text-[#8e92ad] tabular-nums pointer-events-none">
                      {templateName.length}/100
                    </span>
                  </div>
                </div>

                {/* Session type selector */}
                <div>
                  <FieldLabel required>2. Session Type</FieldLabel>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {SESSION_TYPES.map(t => {
                      const active = sessionType === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setSessionType(t.id)}
                          className={`relative flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border-2 transition-all ${
                            active
                              ? `${t.activeBorder} ${t.activeBg}`
                              : 'border-gray-200 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                          }`}
                        >
                          {active && (
                            <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full" />
                            </div>
                          )}
                          <div className={`${t.color}`}>{t.icon}</div>
                          <span className={`text-[10px] font-semibold leading-tight text-center ${active ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-[#8e92ad]'}`}>
                            {t.id}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 3: Description + Duration + Stage ───── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_180px] gap-5">

                {/* Description */}
                <div>
                  <FieldLabel required>3. Template Description</FieldLabel>
                  <div className="relative">
                    <textarea
                      maxLength={300}
                      rows={4}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe the purpose and focus of this template..."
                      className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 resize-none transition-all"
                    />
                    <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 dark:text-[#8e92ad] tabular-nums pointer-events-none">
                      {description.length}/300
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <FieldLabel>4. Duration</FieldLabel>
                  <div className="relative">
                    <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="w-full appearance-none pl-8 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                    >
                      {['30 minutes','45 minutes','60 minutes','75 minutes','90 minutes','120 minutes'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Stage */}
                <div>
                  <FieldLabel>Stage</FieldLabel>
                  <div className="relative">
                    <Users size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={stage}
                      onChange={e => setStage(e.target.value)}
                      className="w-full appearance-none pl-8 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
                    >
                      {['Any Stage','Interview','Secondary','Essays','Decision'].map(o => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 5: Template Sections ────────────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <div className="mb-4">
                <FieldLabel>5. Template Sections</FieldLabel>
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] -mt-1">
                  Add and organize the sections you typically cover in this type of session.
                </p>
              </div>

              <div className="space-y-2 mb-3">
                {sections.map((s, idx) => (
                  <div
                    key={s.id}
                    className="flex items-center gap-3 px-3 py-3 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 rounded-xl group"
                  >
                    <GripVertical size={14} className="text-slate-300 dark:text-[#40455e] shrink-0 cursor-grab" />

                    {/* Number badge */}
                    <div className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold shrink-0">
                      {idx + 1}
                    </div>

                    {/* Title */}
                    {editingSection === s.id ? (
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        onBlur={() => saveEdit(s.id)}
                        onKeyDown={e => { if (e.key === 'Enter') saveEdit(s.id); if (e.key === 'Escape') setEditingSection(null); }}
                        className="flex-1 px-2 py-1 text-sm bg-white dark:bg-[#1d2133] border border-indigo-300 dark:border-indigo-500/40 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                      />
                    ) : (
                      <span className="flex-1 text-sm font-medium text-slate-700 dark:text-[#c8ccdf] truncate">
                        {s.title}
                      </span>
                    )}

                    {/* Duration */}
                    <div className="flex items-center gap-1 shrink-0">
                      <input
                        type="number"
                        min={1}
                        max={120}
                        value={s.duration}
                        onChange={e => setSections(prev => prev.map(x => x.id === s.id ? { ...x, duration: Number(e.target.value) } : x))}
                        className="w-14 px-2 py-1 text-sm text-right bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-lg text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500/30"
                      />
                      <span className="text-xs text-slate-400 dark:text-[#8e92ad]">min</span>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={() => startEdit(s)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => deleteSection(s.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Section button */}
              <button
                onClick={addSection}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-white/15 text-sm font-semibold text-slate-500 dark:text-[#8e92ad] hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/40 dark:hover:bg-indigo-500/5 transition-all"
              >
                <Plus size={14} /> Add Section
              </button>

              {/* Total time */}
              {sections.length > 0 && (
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-2 text-right">
                  Total: <span className="font-bold text-slate-600 dark:text-[#c8ccdf]">{totalDuration} min</span>
                </p>
              )}
            </div>

            {/* ── Section 6 & 7: Resources + Tags ─────────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6">

                {/* Resources */}
                <div>
                  <FieldLabel optional>6. Resources & Attachments</FieldLabel>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] -mt-1 mb-3">
                    Add default resources, worksheets, or files that can be used with this template.
                  </p>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileRef.current?.click()}
                    className={`flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-5 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                      dragging
                        ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                        : 'border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] hover:border-indigo-300 dark:hover:border-indigo-500/40 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0">
                        <Upload size={14} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          <span className="text-indigo-600 dark:text-indigo-400">Upload files</span> &nbsp;or drag and drop
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">PDF, DOCX, PPTX, or ZIP (Max. 10MB each)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}
                      className="shrink-0 px-3.5 py-1.5 rounded-lg border border-indigo-300 dark:border-indigo-500/40 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    >
                      Browse Files
                    </button>
                    <input ref={fileRef} type="file" multiple accept=".pdf,.docx,.pptx,.zip" className="hidden" onChange={e => handleFiles(e.target.files)} />
                  </div>

                  {files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 dark:bg-white/8 rounded-lg text-[11px] font-medium text-slate-600 dark:text-slate-300">
                          <FileText size={10} className="text-slate-400" />
                          <span className="max-w-[120px] truncate">{f.name}</span>
                          <button onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 ml-0.5">
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <FieldLabel optional>7. Tags</FieldLabel>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] -mt-1 mb-3">
                    Add tags to help you quickly find this template
                  </p>

                  {/* Tag input */}
                  <div className="flex flex-wrap gap-1.5 px-3 py-2 min-h-[42px] bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500/50 transition-all mb-3">
                    {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-lg text-[11px] font-semibold">
                        {t}
                        <button onClick={() => removeTag(t)} className="hover:text-red-500 transition-colors"><X size={9} /></button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={addTag}
                      placeholder={tags.length === 0 ? 'Add tags and press Enter...' : ''}
                      className="flex-1 min-w-[140px] bg-transparent text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none"
                    />
                  </div>

                  {/* Suggested tags */}
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-2">Suggested Tags</p>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTED_TAGS.filter(t => !tags.includes(t)).map(t => (
                        <button
                          key={t}
                          onClick={() => addSuggestedTag(t)}
                          className="px-2.5 py-1 bg-gray-100 dark:bg-white/8 text-slate-600 dark:text-slate-300 rounded-lg text-[11px] font-medium hover:bg-indigo-100 dark:hover:bg-indigo-500/20 hover:text-indigo-700 dark:hover:text-indigo-400 transition-all"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 8: Template Status ───────────────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <FieldLabel>8. Template Status</FieldLabel>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] -mt-1 mb-4">
                Choose whether this template is available for use.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {([
                  { id: 'active',  label: 'Active',  desc: 'Make this template available for scheduling sessions', dot: 'bg-emerald-500' },
                  { id: 'draft',   label: 'Draft',   desc: 'Save as draft and activate later.', dot: 'bg-amber-500' },
                  { id: 'private', label: 'Private', desc: 'Only you can use this template.', dot: 'bg-slate-400 dark:bg-slate-500' },
                ] as const).map(opt => {
                  const active = templateStatus === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setTemplateStatus(opt.id)}
                      className={`flex items-start gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                        active
                          ? 'border-indigo-500/60 bg-indigo-50 dark:bg-indigo-500/10'
                          : 'border-gray-200 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center transition-all ${
                        active ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 dark:border-white/20'
                      }`}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                          <p className={`text-sm font-semibold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>
                            {opt.label}
                          </p>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] leading-snug">{opt.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Bottom actions ───────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-end gap-3 pb-2">
              <Link
                href="/counselor/session-templates"
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
              <button
                onClick={handleSaveDraft}
                className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Save as Draft
              </button>
              <button
                onClick={handlePublish}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  published
                    ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/20'
                }`}
              >
                {published ? <><CheckCircle2 size={14} /> Published!</> : 'Publish Template'}
              </button>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────── */}
          <div className="space-y-4">

            {/* Template Preview */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Template Preview</h3>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-4">
                This is how your template will appear when selecting a session type.
              </p>

              {/* Preview card */}
              <div className="p-4 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/6 space-y-3">
                {/* Icon + name */}
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${sessionCfg.bg} ${sessionCfg.color} flex items-center justify-center shrink-0`}>
                    {sessionCfg.icon}
                  </div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {templateName || 'New Template'}
                  </p>
                </div>

                {/* Session type badge */}
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${SESSION_TYPE_BADGE[sessionType]}`}>
                  {sessionType}
                </span>

                {/* Duration + Stage */}
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-[#8e92ad]">
                  <div className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users size={11} />
                    <span>{stage}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] leading-relaxed">
                  {description || 'Template description will appear here.'}
                </p>

                {/* Sections count */}
                {sections.length > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-white/8">
                    <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{sections.length} sections</span>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-[#c8ccdf]">{totalDuration} min total</span>
                  </div>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={13} className="text-amber-500 shrink-0" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Tips for Creating Templates</h3>
              </div>
              <ul className="space-y-2.5">
                {TIPS.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-[#8e92ad]">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      ['bg-indigo-100 text-indigo-600','bg-amber-100 text-amber-600','bg-emerald-100 text-emerald-600','bg-blue-100 text-blue-600','bg-purple-100 text-purple-600'][i % 5]
                    }`}>
                      <span className="text-[8px] font-bold">{i + 1}</span>
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Need Inspiration */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-start gap-2 mb-1">
                <BookMarked size={14} className="text-indigo-600 mt-0.5 shrink-0" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Need Inspiration?</h3>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-3 ml-5">
                Use one of our pre-built templates as a starting point.
              </p>
              <Link
                href="/counselor/session-templates"
                className="flex items-center justify-center w-full py-2.5 rounded-xl border border-indigo-200 dark:border-indigo-500/30 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
              >
                Browse Template
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
