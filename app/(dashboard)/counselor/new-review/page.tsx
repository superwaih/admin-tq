'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, Star, Bold, Italic, Underline,
  Strikethrough, AlignLeft, AlignCenter, AlignRight,
  CheckCircle2, Save,
} from 'lucide-react';

// ── Reusable helpers ───────────────────────────────────────────────────────────
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
      {num}. {title}
    </h2>
  );
}

function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
      {children}
      {optional && <span className="ml-1.5 text-[11px] font-normal text-slate-400 dark:text-[#8e92ad]">(Optional)</span>}
    </p>
  );
}

function SelectDropdown({ value, onChange, options, placeholder }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

function WordCountTextarea({
  placeholder, value, onChange, rows = 5, maxWords = 500,
}: {
  placeholder?: string; value: string; onChange: (v: string) => void; rows?: number; maxWords?: number;
}) {
  const wordCount = value.trim() === '' ? 0 : value.trim().split(/\s+/).length;
  return (
    <div className="relative">
      <textarea
        rows={rows}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 resize-none transition-all"
      />
      <span className="absolute bottom-2 right-3 text-[10px] text-slate-400 dark:text-[#8e92ad] pointer-events-none tabular-nums">
        {wordCount}/{maxWords} word
      </span>
    </div>
  );
}

const SCORE_OPTIONS = ['1/10','2/10','3/10','4/10','5/10','6/10','7/10','8/10','9/10','10/10'];

const SCORE_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'Very Poor',  color: 'text-red-600 dark:text-red-400' },
  2: { label: 'Poor',       color: 'text-red-500 dark:text-red-400' },
  3: { label: 'Below Avg',  color: 'text-orange-500 dark:text-orange-400' },
  4: { label: 'Fair',       color: 'text-amber-600 dark:text-amber-400' },
  5: { label: 'Average',    color: 'text-amber-500 dark:text-amber-400' },
  6: { label: 'Above Avg',  color: 'text-lime-600 dark:text-lime-400' },
  7: { label: 'Good',       color: 'text-emerald-600 dark:text-emerald-400' },
  8: { label: 'Very Good',  color: 'text-cyan-600 dark:text-cyan-400' },
  9: { label: 'Great',      color: 'text-blue-600 dark:text-blue-400' },
  10:{ label: 'Excellent',  color: 'text-indigo-600 dark:text-indigo-400' },
};

// ── Main page ──────────────────────────────────────────────────────────────────
export default function NewReviewPage() {
  const [student,       setStudent]       = useState('');
  const [essayTopic,    setEssayTopic]    = useState('Over Coming Challenges');
  const [overallScore,  setOverallScore]  = useState(8);
  const [hoverScore,    setHoverScore]    = useState(0);
  const [dob,           setDob]           = useState('');
  const [feedback,      setFeedback]      = useState('');
  const [strengths,     setStrengths]     = useState('');
  const [improvements,  setImprovements]  = useState('');
  const [internalNote,  setInternalNote]  = useState('');
  const [content,       setContent]       = useState('9/10');
  const [structure,     setStructure]     = useState('9/10');
  const [clarity,       setClarity]       = useState('8/10');
  const [originality,   setOriginality]   = useState('7/10');

  const [submitted,     setSubmitted]     = useState(false);
  const [savedDraft,    setSavedDraft]    = useState(false);

  const displayScore = hoverScore || overallScore;
  const scoreMeta    = SCORE_LABEL[displayScore] ?? SCORE_LABEL[8];
  const scoreDisplay = `${displayScore}.5/10`;

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }
  function handleSaveDraft() {
    setSavedDraft(true);
    setTimeout(() => setSavedDraft(false), 2500);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto">

        {/* ── Page header ──────────────────────────────────────── */}
        <div className="mb-6">
          <Link
            href="/counselor/essay-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to Essay Review
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Add New Review
              </h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
                Review and evaluate student essay
              </p>
            </div>
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/counselor/essay-reviews"
                className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  submitted
                    ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
                }`}
              >
                {submitted ? <><CheckCircle2 size={14} /> Submitted!</> : 'Submit Review'}
              </button>
            </div>
          </div>
        </div>

        {/* ── Section 1: Select Student & Essay ────────────────── */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6 mb-4">
          <SectionHeader num="1" title="Select Student & Essay" />

          {/* 3-column grid: Student | Essay/Topic | Score Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_220px] gap-5 lg:gap-6">

            {/* Left: Student */}
            <div>
              <FieldLabel>Select Student</FieldLabel>
              <input
                type="text"
                value={student}
                onChange={e => setStudent(e.target.value)}
                placeholder="Enter full name"
                className="w-full px-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Center: Essay/Topic */}
            <div>
              <FieldLabel>Essay / Topics</FieldLabel>
              <div className="relative">
                <select
                  value={essayTopic}
                  onChange={e => setEssayTopic(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                >
                  {[
                    'Over Coming Challenges',
                    'Why Medicine?',
                    'Leadership Experience',
                    'Diversity & Inclusion',
                    'Research Experience',
                  ].map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1.5">
                540 words · Submitted on May 21, 2021
              </p>
            </div>

            {/* Right: Score Breakdown */}
            <div>
              <FieldLabel optional>Score Breakdown</FieldLabel>
              <div className="space-y-2.5">
                {[
                  { label: 'Content',     value: content,     onChange: setContent },
                  { label: 'Structure',   value: structure,   onChange: setStructure },
                  { label: 'Clarity',     value: clarity,     onChange: setClarity },
                  { label: 'Originality', value: originality, onChange: setOriginality },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-600 dark:text-[#c8ccdf] font-medium w-20 shrink-0">{item.label}</span>
                    <div className="relative flex-1">
                      <select
                        value={item.value}
                        onChange={e => item.onChange(e.target.value)}
                        className="w-full appearance-none pl-3 pr-7 py-2 text-xs bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                      >
                        {SCORE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 2 + 3: Scoring & Feedback (main body) ─────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4 mb-4">

          {/* Left column: Review & Scoring + Feedback */}
          <div className="space-y-4">

            {/* Section 2: Review & Scoring */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader num="2" title="Review & Scoring" />

              {/* Star rating */}
              <div className="mb-4">
                <FieldLabel>Overall Score</FieldLabel>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex gap-1">
                    {Array.from({ length: 10 }).map((_, i) => {
                      const filled = i < (hoverScore || overallScore);
                      return (
                        <button
                          key={i}
                          onMouseEnter={() => setHoverScore(i + 1)}
                          onMouseLeave={() => setHoverScore(0)}
                          onClick={() => setOverallScore(i + 1)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={20}
                            className={`transition-colors ${
                              filled
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-200 dark:fill-white/10 text-gray-200 dark:text-white/10'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-slate-800 dark:text-white tabular-nums">
                      {scoreDisplay}
                    </span>
                    <span className={`text-xs font-semibold ${scoreMeta.color}`}>
                      {scoreMeta.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <FieldLabel>Date of Birth</FieldLabel>
                <div className="relative">
                  <input
                    type="date"
                    value={dob}
                    onChange={e => setDob(e.target.value)}
                    placeholder="Select date of birth"
                    className="w-full pl-3 pr-3 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Feedback & Comments */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <SectionHeader num="3" title="Feedback & Comments" />

              {/* Mini rich-text toolbar */}
              <div className="flex items-center gap-0.5 px-2 py-1.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-t-xl border-b-0">
                {[
                  { icon: <Bold size={13} />,          label: 'Bold' },
                  { icon: <Italic size={13} />,        label: 'Italic' },
                  { icon: <Underline size={13} />,     label: 'Underline' },
                  { icon: <Strikethrough size={13} />, label: 'Strikethrough' },
                  null,
                  { icon: <AlignLeft size={13} />,    label: 'Align Left' },
                  { icon: <AlignCenter size={13} />,  label: 'Align Center' },
                  { icon: <AlignRight size={13} />,   label: 'Align Right' },
                ].map((btn, i) =>
                  btn === null ? (
                    <div key={`sep-${i}`} className="w-px h-4 bg-gray-200 dark:bg-white/15 mx-1" />
                  ) : (
                    <button
                      key={btn.label}
                      title={btn.label}
                      className="p-1.5 rounded-lg text-slate-500 dark:text-[#8e92ad] hover:bg-gray-200 dark:hover:bg-white/10 hover:text-slate-800 dark:hover:text-white transition-all"
                    >
                      {btn.icon}
                    </button>
                  )
                )}
              </div>

              {/* Feedback textarea (mimics rich-text area) */}
              <div className="relative">
                <textarea
                  rows={7}
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                  placeholder="Write your detailed feedback and comments."
                  className="w-full px-3 py-3 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-b-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 resize-none transition-all"
                />
                <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-400 dark:text-[#8e92ad] pointer-events-none tabular-nums">
                  {feedback.trim() === '' ? 0 : feedback.trim().split(/\s+/).length}/500 word
                </span>
              </div>
            </div>
          </div>

          {/* Right column: Strengths + Areas */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  Strengths <span className="text-[11px] font-normal text-slate-400 dark:text-[#8e92ad] ml-1">(Optional)</span>
                </p>
              </div>
              <WordCountTextarea
                placeholder="List key strength of the essay..."
                value={strengths}
                onChange={setStrengths}
                rows={7}
              />
            </div>

            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
              <div className="mb-4">
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                  Area for Improvement <span className="text-[11px] font-normal text-slate-400 dark:text-[#8e92ad] ml-1">(Optional)</span>
                </p>
              </div>
              <WordCountTextarea
                placeholder="Provide suggestion for improvement..."
                value={improvements}
                onChange={setImprovements}
                rows={7}
              />
            </div>
          </div>
        </div>

        {/* ── Section 4: Internal Review Note ─────────────────── */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6 mb-4">
          <SectionHeader num="4" title="Review Note Internal" />
          <WordCountTextarea
            placeholder="Provide suggestion for improvement..."
            value={internalNote}
            onChange={setInternalNote}
            rows={5}
          />
          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-2">
            Internal notes are only visible to counselors and will not be shared with the student.
          </p>
        </div>

        {/* ── Bottom actions ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4">
          <button
            onClick={handleSaveDraft}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
              savedDraft
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            {savedDraft ? <><CheckCircle2 size={14} /> Saved!</> : <><Save size={14} /> Save as Draft</>}
          </button>

          <div className="flex items-center gap-2.5">
            <Link
              href="/counselor/essay-reviews"
              className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </Link>
            <button
              onClick={handleSubmit}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                submitted
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
              }`}
            >
              {submitted ? <><CheckCircle2 size={14} /> Submitted!</> : 'Submit Review'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
