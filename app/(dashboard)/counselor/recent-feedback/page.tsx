'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, ChevronDown, Search, Filter,
  CheckCircle2, AlertTriangle, MessageSquare, Share2,
} from 'lucide-react';

// ── Data ───────────────────────────────────────────────────────────────────────
interface FeedbackItem {
  id: string;
  name: string;
  initials: string;
  color: string;
  studentId: string;
  topic: string;
  score: number | null;
  time: string;
  date: string;
  category: 'positive' | 'needs-improvement' | 'critical';
  feedback: string;
  strengths: string[];
  improvements: string[];
  note: string;
}

const FEEDBACK_DATA: FeedbackItem[] = [
  {
    id: 'f1', name: 'Amina Yusuf', initials: 'AY', color: 'bg-yellow-400',
    studentId: 'STU-2024-1001', topic: 'Why I want to Study Medicine',
    score: 8.5, time: '2:30 PM', date: 'May 21, 2025, 11:45 AM',
    category: 'positive',
    feedback: 'Your essay effectively communicates your personal challenges and the lessons you learned. The narrative is authentic and well-structured. Consider adding more specific examples to strengthen the impact further. Overall, a strong response with a clear message',
    strengths: ['Clear and well-structured narrative', 'Good reflection and self-awareness', 'Strong conclusion'],
    improvements: ['Add more specific examples', 'Improve transition between paragraph', 'Expand on the impact of your experience'],
    note: 'Strong potential Recommendation short follow - up discussion in next session.',
  },
  {
    id: 'f2', name: 'Daniel Musa', initials: 'DM', color: 'bg-blue-500',
    studentId: 'STU-2024-1002', topic: 'Overcoming Challenges',
    score: 8.5, time: '11:45 AM', date: 'May 21, 2025, 11:45 AM',
    category: 'positive',
    feedback: 'The essay shows genuine reflection on past challenges. The writing is engaging and the structure is logical. Adding concrete outcomes and lessons learned would elevate it further.',
    strengths: ['Genuine and authentic tone', 'Logical structure throughout', 'Relatable personal story'],
    improvements: ['Include measurable outcomes', 'Strengthen the conclusion', 'Avoid passive voice in places'],
    note: 'Good progress. Encourage student to revisit the conclusion before final submission.',
  },
  {
    id: 'f3', name: 'Fatima Bello', initials: 'FB', color: 'bg-pink-500',
    studentId: 'STU-2024-1003', topic: 'My Leadership Journey',
    score: 8.5, time: '11:45 AM', date: 'May 20, 2025, 11:45 AM',
    category: 'positive',
    feedback: 'A compelling essay that highlights strong leadership qualities. The examples provided are relevant and well-chosen. The introduction could be more engaging to immediately draw the reader in.',
    strengths: ['Strong leadership examples', 'Good use of specific scenarios', 'Confident and assertive tone'],
    improvements: ['Strengthen the opening hook', 'Vary sentence structure more', 'Connect leadership to future medical goals'],
    note: 'Very solid draft. Minor polish needed before submission.',
  },
  {
    id: 'f4', name: 'Ibrahim Ali', initials: 'IA', color: 'bg-green-500',
    studentId: 'STU-2024-1004', topic: 'Lesson from Failure',
    score: 8.5, time: '11:45 AM', date: 'May 20, 2025, 04:20 PM',
    category: 'needs-improvement',
    feedback: 'The essay touches on an important theme but lacks depth in the analysis. The student needs to go beyond describing the failure and focus more on the growth and lessons learned from it.',
    strengths: ['Honest and vulnerable approach', 'Good topic selection', 'Relatable experience'],
    improvements: ['Deepen the reflection on growth', 'Connect experience to future goals', 'Improve overall essay length'],
    note: 'Schedule a follow-up session to review rewrite. Focus on lesson learned section.',
  },
  {
    id: 'f5', name: 'Maryam Okafor', initials: 'MO', color: 'bg-orange-400',
    studentId: 'STU-2024-1005', topic: 'My vision for Global Health',
    score: 8.5, time: '7:30 PM', date: 'May 19, 2025, 07:30 PM',
    category: 'positive',
    feedback: 'A visionary and well-articulated essay. The student demonstrates a clear understanding of global health challenges and presents a thoughtful plan for contributing to the field.',
    strengths: ['Exceptional global health knowledge', 'Clear vision and goals', 'Strong evidence-based arguments'],
    improvements: ['Add a personal anecdote to connect with readers', 'Shorten some lengthy paragraphs', 'Include more specific program references'],
    note: 'One of the strongest essays reviewed this cycle. Highly recommend for scholarship programs.',
  },
  {
    id: 'f6', name: 'Joshua Adeyemi', initials: 'JA', color: 'bg-teal-500',
    studentId: 'STU-2024-1006', topic: 'Innovation in Healthcare',
    score: 8.5, time: '3:10 PM', date: 'May 19, 2025, 03:10 PM',
    category: 'positive',
    feedback: 'The essay shows impressive insight into healthcare innovation. The student clearly has a passion for the subject. A stronger personal connection would make the essay even more compelling.',
    strengths: ['Excellent domain knowledge', 'Innovative thinking', 'Well-researched content'],
    improvements: ['Add a personal motivating story', 'Address implementation challenges', 'Simplify some technical language'],
    note: 'Strong candidate. Encourage further exploration of personal narrative.',
  },
  {
    id: 'f7', name: 'Halima Sani', initials: 'HS', color: 'bg-purple-500',
    studentId: 'STU-2024-1007', topic: 'Community and Impact Initiative',
    score: null, time: '12:40 PM', date: 'May 18, 2025, 12:40 PM',
    category: 'critical',
    feedback: '',
    strengths: [],
    improvements: [],
    note: 'Awaiting full essay submission before review can begin.',
  },
  {
    id: 'f8', name: 'Samuel Johnson', initials: 'SJ', color: 'bg-indigo-500',
    studentId: 'STU-2024-1008', topic: 'My vision for Global Health',
    score: null, time: '12:40 PM', date: 'May 18, 2025, 12:40 PM',
    category: 'critical',
    feedback: '',
    strengths: [],
    improvements: [],
    note: 'Submission received late. Prioritize review in next session.',
  },
];

const TABS = [
  { id: 'all',              label: 'Feedback',          count: 12 },
  { id: 'positive',         label: 'Positive',           count: 24 },
  { id: 'needs-improvement',label: 'Needs Improvement',  count: 18 },
  { id: 'critical',         label: 'Critical',           count: 62 },
];

const TAB_STYLES: Record<string, string> = {
  all:               'bg-cyan-600 text-white',
  positive:          'bg-white dark:bg-[#161a27] text-emerald-600 dark:text-emerald-400 border border-gray-100 dark:border-white/6',
  'needs-improvement':'bg-white dark:bg-[#161a27] text-amber-600 dark:text-amber-400 border border-gray-100 dark:border-white/6',
  critical:          'bg-white dark:bg-[#161a27] text-red-600 dark:text-red-400 border border-gray-100 dark:border-white/6',
};

const TAB_ACTIVE: Record<string, string> = {
  all:               'bg-cyan-600 text-white shadow-sm',
  positive:          'bg-emerald-600 text-white shadow-sm',
  'needs-improvement':'bg-amber-500 text-white shadow-sm',
  critical:          'bg-red-600 text-white shadow-sm',
};

const PAGES = 15;

export default function RecentFeedbackPage() {
  const [activeTab,    setActiveTab]    = useState('all');
  const [search,       setSearch]       = useState('');
  const [sortBy,       setSortBy]       = useState('Newest');
  const [selectedId,   setSelectedId]   = useState('f1');
  const [currentPage,  setCurrentPage]  = useState(1);
  const [replied,      setReplied]      = useState(false);

  const selected = FEEDBACK_DATA.find(f => f.id === selectedId) ?? FEEDBACK_DATA[0];

  const filtered = FEEDBACK_DATA.filter(f => {
    const matchTab = activeTab === 'all' || f.category === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q || f.name.toLowerCase().includes(q) || f.topic.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  function handleReply() {
    setReplied(true);
    setTimeout(() => setReplied(false), 2500);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="mb-5">
          <Link
            href="/counselor/essay-reviews"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to Essay Review
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Recent Feedback
          </h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
            Feedback and comment on reviewed essays.
          </p>
        </div>

        {/* ── Filter tabs + search ────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-2 flex-1">
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive ? TAB_ACTIVE[t.id] : TAB_STYLES[t.id]
                  }`}
                >
                  {t.label}
                  <span className={`text-[10px] font-bold ${isActive ? 'opacity-80' : 'opacity-60'}`}>
                    {t.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search feedback..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 w-40"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <Filter size={12} /> Filters
            </button>
          </div>
        </div>

        {/* ── Two-column layout ────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr] gap-4 items-start">

          {/* ── Left: Feedback List ──────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* List header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-white/[0.04]">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">
                Feedback List
              </p>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="appearance-none pl-2 pr-6 py-1 text-xs bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-lg text-slate-600 dark:text-slate-300 focus:outline-none"
                >
                  {['Newest','Oldest','Highest Score','Lowest Score'].map(o => (
                    <option key={o} value={o}>Sort by: {o}</option>
                  ))}
                </select>
                <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50 dark:divide-white/[0.03]">
              {filtered.map(f => {
                const isActive = selectedId === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setSelectedId(f.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 border-l-2 border-l-cyan-500'
                        : 'hover:bg-gray-50 dark:hover:bg-white/[0.02] border-l-2 border-l-transparent'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                      {f.initials}
                    </div>

                    {/* Name + topic */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>
                        {f.name}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] truncate">{f.topic}</p>
                    </div>

                    {/* Score + time */}
                    <div className="text-right shrink-0">
                      {f.score !== null ? (
                        <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{f.score}/10</p>
                      ) : (
                        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] font-medium">Not reviewed</p>
                      )}
                      <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-0.5">{f.time}</p>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="px-4 py-10 text-center">
                  <p className="text-sm font-semibold text-slate-500 dark:text-[#8e92ad]">No feedback found</p>
                  <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 py-3 border-t border-gray-50 dark:border-white/[0.04]">
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">
                Showing 1 to {Math.min(8, filtered.length)} of <span className="font-bold text-slate-600 dark:text-[#c8ccdf]">62</span> Feedbacks
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-gray-100 dark:hover:bg-white/8 disabled:opacity-40 transition-all"
                >
                  <ChevronLeft size={13} />
                </button>
                {[1, 2, 3].map(p => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      currentPage === p
                        ? 'bg-cyan-600 text-white'
                        : 'text-slate-500 dark:text-[#8e92ad] hover:bg-gray-100 dark:hover:bg-white/8'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <span className="text-xs text-slate-400">…</span>
                <button
                  onClick={() => setCurrentPage(PAGES)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    currentPage === PAGES
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-500 dark:text-[#8e92ad] hover:bg-gray-100 dark:hover:bg-white/8'
                  }`}
                >
                  {PAGES}
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(PAGES, p + 1))}
                  disabled={currentPage === PAGES}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-gray-100 dark:hover:bg-white/8 disabled:opacity-40 transition-all"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Right: Detail panel ──────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* Detail header */}
            <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-gray-50 dark:border-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${selected.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                  {selected.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">ID: {selected.studentId}</p>
                </div>
              </div>
              {selected.score !== null && (
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selected.score}/10</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Overall Score</p>
                </div>
              )}
            </div>

            {/* Detail body */}
            <div className="p-5 space-y-5">

              {/* Essay topic + date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Essay Topics</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{selected.topic}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1">Essay Topics</p>
                  <p className="text-sm font-semibold text-slate-700 dark:text-[#c8ccdf]">{selected.date}</p>
                </div>
              </div>

              {/* Feedback & Comments */}
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-2">Feedback & Comments</p>
                {selected.feedback ? (
                  <div className="px-4 py-3.5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/8 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-[#c8ccdf] leading-relaxed">
                      {selected.feedback}
                    </p>
                  </div>
                ) : (
                  <div className="px-4 py-6 bg-gray-50 dark:bg-white/[0.03] border border-dashed border-gray-200 dark:border-white/8 rounded-xl text-center">
                    <p className="text-xs text-slate-400 dark:text-[#8e92ad]">No feedback submitted yet</p>
                  </div>
                )}
              </div>

              {/* Strength */}
              {selected.strengths.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white mb-2.5">Strength</p>
                  <div className="space-y-2">
                    {selected.strengths.map((s, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-[#c8ccdf]">{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Areas for Improvement */}
              {selected.improvements.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white mb-2.5">Areas for Improvement</p>
                  <div className="space-y-2">
                    {selected.improvements.map((imp, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <AlertTriangle size={14} className="text-amber-500 shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-[#c8ccdf]">{imp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal note */}
              {selected.note && (
                <div className="px-4 py-3 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl">
                  <p className="text-[11px] text-cyan-700 dark:text-cyan-400 leading-relaxed">
                    {selected.note}
                  </p>
                </div>
              )}
            </div>

            {/* Detail footer actions */}
            <div className="flex items-center justify-between gap-3 px-5 py-4 border-t border-gray-50 dark:border-white/[0.04]">
              <div className="flex items-center gap-2">
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                  <MessageSquare size={15} />
                </button>
                <button className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/10 text-slate-500 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                  <Share2 size={15} />
                </button>
              </div>
              <button
                onClick={handleReply}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
                  replied
                    ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
                }`}
              >
                {replied ? (
                  <><CheckCircle2 size={14} /> Sent!</>
                ) : (
                  <><MessageSquare size={14} /> Reply to student</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
