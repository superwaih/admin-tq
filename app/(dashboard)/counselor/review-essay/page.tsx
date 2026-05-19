'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Download, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, CheckCircle, CheckCircle2,
  XCircle, ChevronRight, User,
} from 'lucide-react';

const ESSAY_TEXT = `Describe a time when you faced a challenge in your life and how you overcame it.

During my second year of university, I struggled to balance my academic responsibilities with my commitment to volunteering at a local community clinic. At the time, I was taking a full course load while also preparing for the MCAT and serving as a volunteer coordinator on weekends. Although I was passionate about both my education and community service, the pressure quickly became overwhelming.

One particular week stands out in my memory. I had two midterms, a major research paper due, and a shortage of volunteers at the clinic because several students were unavailable during flu season. I felt torn between my academic goals and my responsibility to support patients who relied on the`;

const STRENGTHS_POS = [
  'Strong academic average',
  'Consistent and rigorous coursework',
  'Good extracurricular balance',
  'Early application preparation',
];

const STRENGTHS_NEG = [
  'Could use more specific examples',
  'Stronger conclusion and connection to future goals.',
];

const ESSAY_HISTORY = [
  { date: 'May 10, 2025 · 2:30 PM', label: 'Essay Submitted',  color: 'text-cyan-600 dark:text-cyan-400',    dot: 'bg-cyan-500',     done: true },
  { date: 'May 10, 2025 · 2:30 PM', label: 'Under Review',     color: 'text-amber-600 dark:text-amber-400',  dot: 'bg-amber-500',    done: true },
  { date: 'Pending',                 label: 'Feedback Ready',   color: 'text-slate-400 dark:text-[#8e92ad]',  dot: 'bg-slate-300 dark:bg-white/20', done: false },
  { date: 'Pending',                 label: 'Completed',        color: 'text-slate-400 dark:text-[#8e92ad]',  dot: 'bg-slate-300 dark:bg-white/20', done: false },
];

type FeedbackTab = 'Feedback' | 'Comments' | 'History';

function ToolbarButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/8 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
      {children}
    </button>
  );
}

function RichToolbar() {
  return (
    <div className="flex items-center gap-0.5 px-3 py-2 border-b border-gray-100 dark:border-white/5 flex-wrap">
      <ToolbarButton><Bold size={13} /></ToolbarButton>
      <ToolbarButton><Italic size={13} /></ToolbarButton>
      <ToolbarButton><Underline size={13} /></ToolbarButton>
      <ToolbarButton><Strikethrough size={13} /></ToolbarButton>
      <div className="w-px h-4 bg-gray-200 dark:bg-white/10 mx-1" />
      <ToolbarButton><AlignLeft size={13} /></ToolbarButton>
      <ToolbarButton><AlignCenter size={13} /></ToolbarButton>
      <ToolbarButton><AlignRight size={13} /></ToolbarButton>
    </div>
  );
}

export default function ReviewEssayPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedbackTab>('Feedback');
  const [reviewNotes, setReviewNotes] = useState('');
  const [detailedFeedback, setDetailedFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    setSubmitted(true);
    setTimeout(() => router.push('/counselor/essay-reviews'), 1800);
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Feedback Submitted!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
          Your feedback for <strong>Aisha Patel's</strong> essay has been submitted successfully.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Redirecting to Essay Reviews…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link
              href="/counselor"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
            >
              <ChevronLeft size={15} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Review Essay</h1>
          </div>

          {/* Meta + Download */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Stage</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Interview</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Submitted</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">May 10, 2025 · 2:30PM</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Word Count</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">612 Words</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all">
              <Download size={14} /> Download Essay
            </button>
          </div>
        </div>

        {/* Three-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_260px] gap-5 items-start">

          {/* ── Col 1: Essay Content + Review Notes ── */}
          <div className="space-y-4">

            {/* Essay Content */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-50 dark:border-white/5">
                <h2 className="text-base font-bold text-slate-800 dark:text-white">Essay Content</h2>
              </div>
              <div className="px-6 py-5">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-7 whitespace-pre-line">{ESSAY_TEXT}</p>
              </div>
              <div className="px-6 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-[#8e92ad]">612 word</span>
                <span className="text-[11px] text-slate-400 dark:text-[#8e92ad]">May 10, 2025 · 2:30PM</span>
              </div>
            </div>

            {/* Review Notes */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Review Notes</h2>
                <span className="text-[10px] text-slate-400 dark:text-[#8e92ad] font-medium">(Internal)</span>
              </div>
              <RichToolbar />
              <textarea
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                rows={6}
                placeholder="Write private notes about this essay, the notes are only visible to counselors"
                className="w-full px-6 py-4 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* ── Col 2: Feedback Panel ── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden flex flex-col">

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-100 dark:border-white/5 px-5">
              {(['Feedback', 'Comments', 'History'] as FeedbackTab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`py-3.5 mr-5 text-xs font-semibold border-b-2 transition-all ${
                    activeTab === t
                      ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="p-5 flex-1 space-y-5">
              {activeTab === 'Feedback' && (
                <>
                  {/* Positive Strengths */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Strengths</h3>
                    <ul className="space-y-2.5">
                      {STRENGTHS_POS.map((s, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <CheckCircle size={15} className="text-emerald-500 shrink-0" />
                          <span className="text-xs text-slate-600 dark:text-slate-300">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Areas to Improve */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Areas to Improve</h3>
                    <ul className="space-y-2.5">
                      {STRENGTHS_NEG.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <XCircle size={15} className="text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-600 dark:text-slate-300">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-100 dark:border-white/5" />

                  {/* Detailed Feedback */}
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Detailed Feedback</h3>
                    <div className="border border-gray-200 dark:border-white/8 rounded-xl overflow-hidden">
                      <RichToolbar />
                      <textarea
                        value={detailedFeedback}
                        onChange={e => setDetailedFeedback(e.target.value)}
                        rows={7}
                        placeholder="Write your detailed feedback here..."
                        className="w-full px-4 py-3 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'Comments' && (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No comments yet</p>
                  <p className="text-xs text-slate-400 dark:text-[#40455e] mt-1">Add inline comments by selecting essay text</p>
                </div>
              )}

              {activeTab === 'History' && (
                <div className="space-y-3">
                  {ESSAY_HISTORY.map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex flex-col items-center shrink-0">
                        <span className={`w-2.5 h-2.5 rounded-full mt-0.5 ${h.dot}`} />
                        {i < ESSAY_HISTORY.length - 1 && <span className="w-px flex-1 bg-gray-100 dark:bg-white/5 mt-1 min-h-[24px]" />}
                      </div>
                      <div className="flex-1 min-w-0 pb-3">
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{h.date}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${h.color}`}>{h.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action buttons */}
            {activeTab === 'Feedback' && (
              <div className="px-5 py-4 border-t border-gray-100 dark:border-white/5 flex items-center gap-3">
                <button className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                  Save Draft
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>

          {/* ── Col 3: Student Snapshot + Essay History ── */}
          <div className="space-y-4">

            {/* Student Snapshot */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/15 flex items-center justify-center">
                  <User size={14} className="text-orange-500" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Student Snapshot</h3>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                {[
                  { label: 'GPA',        value: '3.8', sub: '/ 4.0', color: 'text-slate-800 dark:text-white' },
                  { label: 'MCAT',       value: '510', sub: '',      color: 'text-slate-800 dark:text-white' },
                  { label: 'Interviews', value: '2',   sub: '/ 5',   color: 'text-slate-800 dark:text-white' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500 dark:text-[#8e92ad]">{s.label}</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                      {s.value}
                      {s.sub && <span className="text-[10px] font-normal text-slate-400 dark:text-[#8e92ad] ml-1">{s.sub}</span>}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full flex items-center justify-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                View Full Profile <ChevronRight size={12} />
              </button>
            </div>

            {/* Essay History */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Essay History</h3>
              <div className="space-y-0">
                {ESSAY_HISTORY.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <span className={`w-2.5 h-2.5 rounded-full mt-1 ${h.dot}`} />
                      {i < ESSAY_HISTORY.length - 1 && <span className="w-px h-8 bg-gray-100 dark:bg-white/5 mt-1" />}
                    </div>
                    <div className="flex-1 pb-3">
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{h.date}</p>
                      <p className={`text-xs font-semibold mt-0.5 ${h.color}`}>{h.label}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-1 w-full flex items-center justify-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">
                View All Essays <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
