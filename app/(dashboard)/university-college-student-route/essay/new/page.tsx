'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Sparkles, BookOpen, Target, Clock, Calendar,
  CheckCircle2, AlertCircle, Lightbulb, Star, Users, Shield,
  FileText, Bold, Italic, List, AlignLeft, RotateCcw,
  ChevronDown, Check, Loader2, ArrowRight, Award, Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Constants ─────────────────────────────────────────────────────────────────

const ESSAY_TYPES = [
  { key: 'aif',         label: 'AIF',                  desc: 'Activities Information Form',       color: 'blue'   },
  { key: 'personal',    label: 'Personal Statement',   desc: 'General personal statement',        color: 'violet' },
  { key: 'supplemental',label: 'Supplemental Essay',   desc: 'University-specific prompt',        color: 'cyan'   },
  { key: 'scholarship', label: 'Scholarship Essay',    desc: 'Award or bursary application',     color: 'amber'  },
  { key: 'short',       label: 'Short Answer',         desc: 'Brief response questions',          color: 'emerald'},
] as const;

type EssayTypeKey = typeof ESSAY_TYPES[number]['key'];

const UNIVERSITIES = [
  'University of Toronto','University of Waterloo','University of British Columbia',
  'McGill University','Queen\'s University','Western University','McMaster University',
  'University of Calgary','University of Ottawa','Dalhousie University','Other',
];

const WORD_LIMITS = ['150','250','500','650','800','1000','1200','1500','No limit'];

const COLOR_MAP: Record<string, string> = {
  blue:    'border-blue-400 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300',
  violet:  'border-violet-400 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300',
  cyan:    'border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
  amber:   'border-amber-400 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300',
  emerald: 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
};

const SCORING_CRITERIA = [
  { label: 'Clarity & Structure',   icon: AlignLeft,  pct: 25, color: 'bg-blue-500'    },
  { label: 'Authenticity & Voice',  icon: Star,        pct: 25, color: 'bg-violet-500'  },
  { label: 'Relevance to Prompt',   icon: Target,      pct: 25, color: 'bg-cyan-500'    },
  { label: 'Grammar & Style',        icon: BookOpen,   pct: 15, color: 'bg-amber-500'   },
  { label: 'Impact & Impression',   icon: Zap,         pct: 10, color: 'bg-emerald-500' },
];

const WRITING_TIPS = [
  { tip: 'Start with a vivid anecdote or moment that shows, not tells.' },
  { tip: 'Keep your introduction punchy — admissions officers read hundreds of essays.' },
  { tip: 'Use specific details and examples rather than vague generalisations.' },
  { tip: 'Address the prompt directly; avoid going off-topic.' },
  { tip: 'End with a forward-looking statement that ties back to your opening.' },
  { tip: 'Read your essay aloud to catch awkward phrasing.' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function countWords(text: string) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function SectionCard({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/6">
        <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
          <Icon size={13} className="text-blue-600 dark:text-blue-400"/>
        </div>
        <h2 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h2>
      </div>
      <div className="px-5 sm:px-6 py-5">{children}</div>
    </div>
  );
}

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
      {children}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

function Input({ placeholder, value, onChange, type = 'text', error }: {
  placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; error?: string;
}) {
  return (
    <div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full h-11 px-4 text-sm rounded-xl border outline-none transition-all',
          'bg-white dark:bg-[#1a1f30] text-slate-800 dark:text-slate-200',
          'placeholder:text-slate-300 dark:placeholder:text-[#5a5f78]',
          error
            ? 'border-red-400 dark:border-red-500/60 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20'
            : 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500/50'
        )}/>
      {error && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={9}/>{error}</p>}
    </div>
  );
}

function SelectField({ options, value, onChange, placeholder, error }: {
  options: string[]; value: string; onChange: (v: string) => void;
  placeholder: string; error?: string;
}) {
  return (
    <div>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className={cn(
            'w-full h-11 pl-4 pr-9 text-sm rounded-xl border outline-none transition-all appearance-none cursor-pointer',
            'bg-white dark:bg-[#1a1f30] text-slate-800 dark:text-slate-200',
            value === '' ? 'text-slate-300 dark:text-[#5a5f78]' : '',
            error
              ? 'border-red-400 dark:border-red-500/60'
              : 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500/50'
          )}>
          <option value="" disabled>{placeholder}</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
      </div>
      {error && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={9}/>{error}</p>}
    </div>
  );
}

// ── Success screen ─────────────────────────────────────────────────────────────

function SuccessScreen({ essayTitle, aiRequested, counselorRequested }: {
  essayTitle: string; aiRequested: boolean; counselorRequested: boolean;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-8 flex flex-col items-center gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check size={30} className="text-emerald-600 dark:text-emerald-400"/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Essay Submitted!</h2>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-1 leading-relaxed">
              <span className="font-semibold text-slate-700 dark:text-slate-200">"{essayTitle}"</span> has been submitted for review.
            </p>
          </div>

          {/* What happens next */}
          <div className="w-full space-y-3 text-left">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What Happens Next</p>
            {aiRequested && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles size={13} className="text-blue-600 dark:text-blue-400"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-700 dark:text-blue-300">AI Feedback — Immediate</p>
                  <p className="text-[11px] text-blue-600/70 dark:text-blue-400/70 mt-0.5 leading-relaxed">AdmitIQ AI is analysing your essay for structure, clarity, voice, and grammar right now.</p>
                </div>
              </div>
            )}
            {counselorRequested && (
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20">
                <div className="w-7 h-7 rounded-xl bg-violet-100 dark:bg-violet-500/25 flex items-center justify-center shrink-0 mt-0.5">
                  <Users size={13} className="text-violet-600 dark:text-violet-400"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Counselor Review — within 24–48 hrs</p>
                  <p className="text-[11px] text-violet-600/70 dark:text-violet-400/70 mt-0.5 leading-relaxed">A verified counselor will review and leave detailed comments on your essay.</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link href="/university-college-student-route/essay"
              className="flex-1 flex items-center justify-center h-10 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              Back to Essays
            </Link>
            <Link href="/university-college-student-route/essay"
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
              <Sparkles size={13}/> View AI Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function NewEssayPage() {
  // Essay setup
  const [essayType,   setEssayType]   = useState<EssayTypeKey | ''>('');
  const [university,  setUniversity]  = useState('');
  const [program,     setProgram]     = useState('');
  const [deadline,    setDeadline]    = useState('');
  const [wordLimit,   setWordLimit]   = useState('');

  // Prompt
  const [prompt,      setPrompt]      = useState('');

  // Essay content
  const [content,     setContent]     = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Review options
  const [wantAi,        setWantAi]        = useState(true);
  const [wantCounselor, setWantCounselor] = useState(false);
  const [agreeTerms,    setAgreeTerms]    = useState(false);

  // UI state
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  const wordCount = countWords(content);
  const wordLimitNum = wordLimit && wordLimit !== 'No limit' ? parseInt(wordLimit) : null;
  const overLimit = wordLimitNum ? wordCount > wordLimitNum : false;
  const pct = wordLimitNum ? Math.min((wordCount / wordLimitNum) * 100, 100) : null;

  const selectedType = ESSAY_TYPES.find(t => t.key === essayType);
  const essayTitle = university && essayType ? `${university} — ${selectedType?.label ?? essayType}` : 'New Essay';

  // Simple formatting helpers (visual only in a textarea context)
  const insertFormat = (before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value: v } = ta;
    const selected = v.slice(s, e) || 'text';
    const newVal = v.slice(0, s) + before + selected + after + v.slice(e);
    setContent(newVal);
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + selected.length); }, 0);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!essayType)          e.essayType  = 'Please select an essay type.';
    if (!university)         e.university = 'Please select a university.';
    if (!prompt.trim())      e.prompt     = 'Please enter the essay prompt.';
    if (content.trim().length < 50) e.content = 'Your essay is too short — please write at least 50 characters.';
    if (!agreeTerms)         e.terms      = 'Please agree to the submission terms.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsAnalysing(true);
    setTimeout(() => { setIsAnalysing(false); setSubmitted(true); }, 1800);
  };

  if (submitted) {
    return <SuccessScreen essayTitle={essayTitle} aiRequested={wantAi} counselorRequested={wantCounselor}/>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Header ── */}
        <div className="mb-6">
          <Link href="/university-college-student-route/essay"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to Essay Coach
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">New Essay</h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Write your essay below and submit it for AI feedback and counselor review.</p>
            </div>
            {selectedType && (
              <span className={cn('self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 text-xs font-bold', COLOR_MAP[selectedType.color])}>
                <FileText size={11}/> {selectedType.label}
              </span>
            )}
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT: main form ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* ── Section 1: Essay Setup ── */}
            <SectionCard title="Essay Setup" icon={FileText}>
              <div className="space-y-4">

                {/* Essay type picker */}
                <div>
                  <FieldLabel required>Essay Type</FieldLabel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2">
                    {ESSAY_TYPES.map(t => {
                      const sel = essayType === t.key;
                      return (
                        <button key={t.key} onClick={() => { setEssayType(t.key); setErrors(er => ({ ...er, essayType: '' })); }}
                          className={cn(
                            'flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all',
                            sel ? cn('border-2', COLOR_MAP[t.color]) : 'border-gray-100 dark:border-white/8 bg-white dark:bg-[#1a1f30] hover:border-blue-200 dark:hover:border-blue-500/20'
                          )}>
                          <span className={cn('text-[11px] font-bold leading-tight', sel ? '' : 'text-slate-700 dark:text-slate-200')}>{t.label}</span>
                          <span className={cn('text-[9px] mt-0.5 leading-relaxed', sel ? 'opacity-70' : 'text-slate-400 dark:text-[#8e92ad]')}>{t.desc}</span>
                        </button>
                      );
                    })}
                  </div>
                  {errors.essayType && <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={9}/>{errors.essayType}</p>}
                </div>

                {/* University + Program */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Target University</FieldLabel>
                    <SelectField options={UNIVERSITIES} value={university} onChange={v => { setUniversity(v); setErrors(er => ({ ...er, university: '' })); }} placeholder="Select university" error={errors.university}/>
                  </div>
                  <div>
                    <FieldLabel>Program / Faculty</FieldLabel>
                    <Input placeholder="e.g. Engineering, Computer Science" value={program} onChange={setProgram}/>
                  </div>
                </div>

                {/* Deadline + Word Limit */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Submission Deadline</FieldLabel>
                    <div className="relative">
                      <Calendar size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                      <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)}
                        className="w-full h-11 pl-9 pr-4 text-sm rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1f30] text-slate-800 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400 transition-all"/>
                    </div>
                  </div>
                  <div>
                    <FieldLabel>Word Limit</FieldLabel>
                    <SelectField options={WORD_LIMITS} value={wordLimit} onChange={setWordLimit} placeholder="Select word limit"/>
                  </div>
                </div>

              </div>
            </SectionCard>

            {/* ── Section 2: Essay Prompt ── */}
            <SectionCard title="Essay Prompt" icon={BookOpen}>
              <div className="space-y-4">
                <div>
                  <FieldLabel required>Prompt / Question</FieldLabel>
                  <div className="relative">
                    <textarea value={prompt} onChange={e => { setPrompt(e.target.value); setErrors(er => ({ ...er, prompt: '' })); }} rows={3}
                      placeholder="Paste or type the full essay prompt here. e.g. Describe an experience that changed your perspective…"
                      className={cn(
                        'w-full px-4 py-3 text-sm rounded-xl border bg-white dark:bg-[#1a1f30] text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none transition-all resize-none leading-relaxed',
                        errors.prompt ? 'border-red-400 dark:border-red-500/60 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20' : 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400'
                      )}/>
                  </div>
                  {errors.prompt && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={9}/>{errors.prompt}</p>}
                </div>

                {/* Prompt analysis hint */}
                {prompt.trim().length > 20 && (
                  <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-50 dark:bg-blue-500/8 border border-blue-100 dark:border-blue-500/15">
                    <Sparkles size={13} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0"/>
                    <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                      <strong>AdmitIQ AI tip:</strong> Make sure your essay directly addresses every aspect of the prompt. Our AI will check for this when you submit.
                    </p>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ── Section 3: Essay Content ── */}
            <SectionCard title="Your Essay" icon={AlignLeft}>
              <div className="space-y-3">

                {/* Mini formatting toolbar */}
                <div className="flex items-center gap-1 flex-wrap">
                  {[
                    { icon: Bold,         label: 'Bold',   fn: () => insertFormat('**', '**') },
                    { icon: Italic,       label: 'Italic', fn: () => insertFormat('_', '_')   },
                    { icon: List,         label: 'List',   fn: () => insertFormat('\n- ')      },
                  ].map(b => {
                    const Icon = b.icon;
                    return (
                      <button key={b.label} onClick={b.fn} title={b.label}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-800 dark:hover:text-white transition-all">
                        <Icon size={13}/>
                      </button>
                    );
                  })}
                  <div className="w-px h-5 bg-gray-200 dark:bg-white/10 mx-1"/>
                  <button onClick={() => setContent('')} title="Clear"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all">
                    <RotateCcw size={13}/>
                  </button>
                  <div className="ml-auto flex items-center gap-2">
                    {overLimit && (
                      <span className="text-[10px] font-bold text-red-500 flex items-center gap-1">
                        <AlertCircle size={10}/> Over limit
                      </span>
                    )}
                    <span className={cn('text-[11px] font-semibold tabular-nums',
                      overLimit ? 'text-red-500' : wordLimitNum && wordCount > wordLimitNum * 0.9 ? 'text-amber-500' : 'text-slate-400 dark:text-[#8e92ad]')}>
                      {wordCount.toLocaleString()}{wordLimitNum ? ` / ${wordLimitNum}` : ''} words
                    </span>
                  </div>
                </div>

                {/* Word count progress bar */}
                {pct !== null && (
                  <div className="h-1 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all', overLimit ? 'bg-red-500' : pct > 90 ? 'bg-amber-400' : 'bg-emerald-400')}
                      style={{ width: `${pct}%` }}/>
                  </div>
                )}

                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={content}
                  onChange={e => { setContent(e.target.value); setErrors(er => ({ ...er, content: '' })); }}
                  rows={18}
                  placeholder="Start writing your essay here…&#10;&#10;Tip: Begin with a compelling first sentence that hooks the reader immediately."
                  className={cn(
                    'w-full px-4 py-4 text-sm rounded-xl border bg-white dark:bg-[#1a1f30] text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none transition-all resize-none leading-8 font-[400]',
                    errors.content ? 'border-red-400 dark:border-red-500/60 focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20' : 'border-gray-200 dark:border-white/10 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400'
                  )}/>
                {errors.content && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle size={9}/>{errors.content}</p>}

                {/* Character stats row */}
                {content.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] text-slate-400 dark:text-[#8e92ad]">
                    <span>{content.length.toLocaleString()} characters</span>
                    <span>{content.split(/[.!?]+/).filter(s => s.trim()).length} sentences</span>
                    <span>{content.split(/\n\n+/).filter(p => p.trim()).length} paragraphs</span>
                  </div>
                )}
              </div>
            </SectionCard>

            {/* ── Section 4: Review Options ── */}
            <SectionCard title="Review & Submission" icon={Sparkles}>
              <div className="space-y-5">

                {/* Review options */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Review Type</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                    {/* AI Feedback */}
                    <button onClick={() => setWantAi(v => !v)}
                      className={cn('flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all',
                        wantAi ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-100 dark:border-white/8 bg-white dark:bg-[#1a1f30] hover:border-blue-200')}>
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                        wantAi ? 'bg-blue-100 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-white/6 text-slate-400')}>
                        <Sparkles size={16}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-xs font-bold', wantAi ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200')}>AI Feedback</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Free · Instant</span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed">Automated scoring across 5 criteria with specific improvement suggestions.</p>
                      </div>
                      {wantAi && <Check size={14} className="text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"/>}
                    </button>

                    {/* Counselor Review */}
                    <button onClick={() => setWantCounselor(v => !v)}
                      className={cn('flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all',
                        wantCounselor ? 'border-violet-500 bg-violet-50 dark:bg-violet-500/10' : 'border-gray-100 dark:border-white/8 bg-white dark:bg-[#1a1f30] hover:border-violet-200')}>
                      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                        wantCounselor ? 'bg-violet-100 dark:bg-violet-500/25 text-violet-600 dark:text-violet-400' : 'bg-slate-100 dark:bg-white/6 text-slate-400')}>
                        <Users size={16}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={cn('text-xs font-bold', wantCounselor ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-200')}>Counselor Review</p>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">24–48 hrs</span>
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed">A verified counselor annotates your essay and recommends targeted improvements.</p>
                      </div>
                      {wantCounselor && <Check size={14} className="text-violet-600 dark:text-violet-400 shrink-0 mt-0.5"/>}
                    </button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div>
                  <button onClick={() => { setAgreeTerms(v => !v); setErrors(er => ({ ...er, terms: '' })); }}
                    className="flex items-start gap-2.5 text-left">
                    <div className={cn('w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all',
                      agreeTerms ? 'bg-blue-600 border-blue-600' : 'border-gray-300 dark:border-white/20',
                      errors.terms ? 'border-red-400' : '')}>
                      {agreeTerms && <Check size={10} className="text-white"/>}
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-relaxed">
                      I confirm this essay is my own original work and I consent to it being reviewed by AdmitIQ AI and counselors for the purpose of providing feedback.
                    </span>
                  </button>
                  {errors.terms && <p className="text-[10px] text-red-500 mt-1 ml-6.5 flex items-center gap-1"><AlertCircle size={9}/>{errors.terms}</p>}
                </div>

                {/* Submit button */}
                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                  <Link href="/university-college-student-route/essay"
                    className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    Cancel
                  </Link>
                  <button onClick={handleSubmit} disabled={isAnalysing}
                    className="flex-1 flex items-center justify-center gap-2 h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                    {isAnalysing
                      ? <><Loader2 size={14} className="animate-spin"/> Submitting…</>
                      : <><Sparkles size={14}/> Submit for Review</>
                    }
                  </button>
                </div>

                {/* Secure note */}
                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-[#8e92ad]">
                  <Shield size={10}/> Your essay is encrypted and only shared with your selected reviewers.
                </div>
              </div>
            </SectionCard>

          </div>

          {/* ── RIGHT sidebar ── */}
          <aside className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">

            {/* Writing Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center shrink-0">
                  <Lightbulb size={13} className="text-amber-500"/>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Writing Tips</h3>
              </div>
              <ul className="space-y-3">
                {WRITING_TIPS.map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-black text-amber-600 dark:text-amber-400">{i + 1}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-relaxed">{t.tip}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Scoring Criteria */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center shrink-0">
                  <Award size={13} className="text-blue-600 dark:text-blue-400"/>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">AI Scoring Criteria</h3>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-3 leading-relaxed">Your essay will be scored across these dimensions:</p>
              <ul className="space-y-2.5">
                {SCORING_CRITERIA.map(c => {
                  const Icon = c.icon;
                  return (
                    <li key={c.label}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon size={10} className="text-slate-400"/>
                          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{c.label}</span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">{c.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden">
                        <div className={cn('h-full rounded-full', c.color)} style={{ width: `${c.pct * 4}%` }}/>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* What to expect */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
                  <Target size={13} className="text-emerald-600 dark:text-emerald-400"/>
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">What to Expect</h3>
              </div>
              <ul className="space-y-3">
                {[
                  { icon: Sparkles, color: 'text-blue-500',    label: 'AI Feedback',       sub: 'Instant score + comments' },
                  { icon: Users,    color: 'text-violet-500',   label: 'Counselor Notes',   sub: 'Annotated within 48 hrs' },
                  { icon: ArrowRight,color:'text-emerald-500', label: 'Revision History',  sub: 'Track every draft' },
                  { icon: CheckCircle2,color:'text-cyan-500',  label: 'Final Approval',    sub: 'Counselor marks essay ready' },
                ].map(s => {
                  const Icon = s.icon;
                  return (
                    <li key={s.label} className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                        <Icon size={12} className={s.color}/>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{s.label}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.sub}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Quick stat */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/10"/>
              <div className="relative">
                <p className="text-xs font-bold text-blue-100 mb-1">AdmitIQ Success Rate</p>
                <p className="text-3xl font-black text-white">94%</p>
                <p className="text-[11px] text-blue-200 mt-1 leading-relaxed">of students who used essay coaching were accepted to their first-choice program.</p>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
