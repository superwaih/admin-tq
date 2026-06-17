'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Filter, Plus, Eye, MessageSquare, Download,
  ChevronRight, ChevronLeft, Star, FileText, CheckCircle2,
  AlertTriangle, BookOpen, Clock, X, User, GraduationCap,
  Hash, Calendar, BarChart2,
} from 'lucide-react';
import {
  ApplicationDetailsModal,
  AppRecord,
} from '@/src/components/shared/ApplicationDetailsModal';

// ── Essay data ────────────────────────────────────────────────────────────────
const ESSAYS = [
  {
    name: 'Amina Yusuf',    id: 'STU-2024-1001', initials: 'AY', color: 'bg-yellow-400',
    topic: 'Why I Want to Study Medicine', words: 650,
    date: 'May 20, 2025',  time: '2:30 PM',  status: 'Pending',   score: null,  quality: '',
    university: 'University of Toronto',    program: 'Medicine (MD)',
    feedback: '',
    strengths: [],
    improvements: ['Develop a stronger opening hook', 'Include specific clinical experiences', 'Expand on long-term career goals'],
    note: 'First draft submitted. Schedule a review session before resubmission.',
    category: 'Leadership',
  },
  {
    name: 'Daniel Musa',    id: 'STU-2024-1002', initials: 'DM', color: 'bg-blue-500',
    topic: 'My Leadership Journey',        words: 720,
    date: 'May 21, 2025',  time: '9:15 AM',  status: 'In Review', score: null,  quality: '',
    university: 'McGill University',        program: 'Medicine (MD)',
    feedback: 'Currently under review. Strong opening but requires more depth in the body paragraphs.',
    strengths: ['Engaging opening paragraph', 'Good personal tone'],
    improvements: ['Deepen body paragraph analysis', 'Add concrete leadership outcomes', 'Improve conclusion'],
    note: 'Review in progress. Flag for follow-up after session.',
    category: 'Leadership',
  },
  {
    name: 'Fatima Bello',   id: 'STU-2024-1003', initials: 'FB', color: 'bg-pink-500',
    topic: 'Overcoming Challenges',        words: 540,
    date: 'May 21, 2025',  time: '11:45 AM', status: 'Reviewed',  score: 8.5,  quality: 'Great',
    university: 'University of British Columbia', program: 'Medicine (MD)',
    feedback: 'Your essay effectively communicates your personal challenges and the lessons you learned. The narrative is authentic and well-structured. Consider adding more specific examples to strengthen the impact further. Overall, a strong response with a clear message.',
    strengths: ['Clear and well-structured narrative', 'Good reflection and self-awareness', 'Strong conclusion'],
    improvements: ['Add more specific examples', 'Improve transitions between paragraphs', 'Expand on the impact of your experience'],
    note: 'Strong potential. Recommend a short follow-up discussion in next session.',
    category: 'Innovation',
  },
  {
    name: 'Ibrahim Ali',    id: 'STU-2024-1004', initials: 'IA', color: 'bg-green-500',
    topic: 'The Future of Artificial Int.', words: 680,
    date: 'May 20, 2025',  time: '4:20 PM',  status: 'In Review', score: null,  quality: '',
    university: 'University of Calgary',    program: 'Medicine (MD)',
    feedback: 'Interesting topic. Needs stronger connection to personal motivation.',
    strengths: ['Innovative topic choice', 'Good research knowledge'],
    improvements: ['Connect topic to personal motivation', 'Shorten introduction', 'Avoid overly technical language'],
    note: 'Needs another pass before final submission.',
    category: 'Medicine',
  },
  {
    name: 'Maryam Okafor',  id: 'STU-2024-1005', initials: 'MO', color: 'bg-orange-400',
    topic: 'Community Impact Initiative',  words: 610,
    date: 'May 19, 2025',  time: '7:30 PM',  status: 'Reviewed',  score: 9.2,  quality: 'Excellent',
    university: 'McMaster University',      program: 'Medicine (MD)',
    feedback: 'A visionary and well-articulated essay. The student demonstrates a clear understanding of community health challenges and presents a thoughtful plan for contributing to the field.',
    strengths: ['Exceptional community focus', 'Clear vision and goals', 'Strong evidence-based arguments'],
    improvements: ['Add a personal anecdote to connect with readers', 'Shorten some lengthy paragraphs', 'Include more specific program references'],
    note: 'One of the strongest essays this cycle. Highly recommend for scholarship programs.',
    category: 'Leadership',
  },
  {
    name: 'Joshua Adeyemi', id: 'STU-2024-1006', initials: 'JA', color: 'bg-teal-500',
    topic: 'Lessons From Failure',         words: 560,
    date: 'May 18, 2025',  time: '3:10 PM',  status: 'Reviewed',  score: 7.8,  quality: 'Good',
    university: 'Queen\'s University',     program: 'Medicine (MD)',
    feedback: 'The essay touches on an important theme but lacks depth in the analysis. The student needs to go beyond describing the failure and focus more on the growth and lessons learned.',
    strengths: ['Honest and vulnerable approach', 'Good topic selection', 'Relatable experience'],
    improvements: ['Deepen the reflection on growth', 'Connect experience to future goals', 'Improve overall essay length'],
    note: 'Schedule a follow-up session. Focus on the lessons-learned section.',
    category: 'Innovation',
  },
  {
    name: 'Halima Sani',    id: 'STU-2024-1007', initials: 'HS', color: 'bg-red-400',
    topic: 'My Vision for Global Health',  words: 630,
    date: 'May 18, 2025',  time: '12:40 PM', status: 'Pending',   score: null,  quality: '',
    university: 'University of Ottawa',    program: 'Medicine (MD)',
    feedback: '',
    strengths: [],
    improvements: ['Complete the draft before next session', 'Focus on personal connection to global health'],
    note: 'Awaiting full essay submission before review can begin.',
    category: 'Leadership',
  },
  {
    name: 'Samuel Johnson', id: 'STU-2024-1008', initials: 'SJ', color: 'bg-purple-500',
    topic: 'Innovation in Healthcare',     words: 700,
    date: 'May 17, 2025',  time: '10:00 AM', status: 'In Review', score: null,  quality: '',
    university: 'Dalhousie University',    program: 'Medicine (MD)',
    feedback: 'Impressive insight into healthcare innovation. Passion for the subject is evident. A stronger personal connection would make the essay more compelling.',
    strengths: ['Excellent domain knowledge', 'Innovative thinking', 'Well-researched content'],
    improvements: ['Add a personal motivating story', 'Address implementation challenges', 'Simplify some technical language'],
    note: 'Strong candidate. Encourage further exploration of personal narrative.',
    category: 'Medicine',
  },
];

const RECENT_FEEDBACK = [
  { name: 'Fatima Bello', topic: 'Overcoming Challenges',       comment: 'Excellent storytelling and structure...', time: '2 hrs ago', initials: 'FB', color: 'bg-pink-500' },
  { name: 'Amina Yusuf',  topic: 'Why I Want to Study Medicine', comment: 'Strong motivation and clear goals...',    time: '5 hrs ago', initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Daniel Musa',  topic: 'My Leadership Journey',        comment: 'Great examples of leadership...',        time: '1 day ago', initials: 'DM', color: 'bg-blue-500' },
];

const TOP_ESSAYS = [
  { name: 'Maryam Okafor',  topic: 'Community Impact Initiative', score: 9.2, initials: 'MO', color: 'bg-orange-400' },
  { name: 'Amina Yusuf',    topic: 'Why I Want to Study Medicine', score: 9.0, initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Samuel Johnson', topic: 'Innovation in Healthcare',     score: 8.9, initials: 'SJ', color: 'bg-purple-500' },
  { name: 'Fatima Bello',   topic: 'Overcoming Challenges',        score: 8.5, initials: 'FB', color: 'bg-pink-500' },
  { name: 'Daniel Musa',    topic: 'My Leadership Journey',        score: 8.3, initials: 'DM', color: 'bg-blue-500' },
];

function StatusBadge({ s }: { s: string }) {
  const m: Record<string, string> = {
    Pending:    'bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400',
    'In Review':'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400',
    Reviewed:   'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
    Submitted:  'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400',
  };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m[s] ?? ''}`}>{s}</span>;
}

const TABS = ['All Essays', 'Pending Review', 'In Progress', 'Reviewed', 'Submitted'];
const counts = { 'All Essays': 120, 'Pending Review': 24, 'In Progress': 18, 'Reviewed': 62, 'Submitted': 16 };

// ── Map essay → AppRecord ─────────────────────────────────────────────────────
function toAppRecord(e: typeof ESSAYS[number]): AppRecord {
  const statusToStep: Record<string, number> = {
    Pending:    1,
    'In Review': 2,
    Reviewed:   3,
    Submitted:  4,
  };
  return {
    name:       e.name,
    university: e.university,
    progress:   statusToStep[e.status] * 25,
    stage:      e.status,
    priority:   e.score && e.score >= 9 ? 'High' : 'Medium',
    initials:   e.initials,
    color:      e.color,
    program:    e.program,
    appId:      e.id,
    intake:     'Fall 2025',
    campus:     'Main Campus',
    appDate:    e.date,
    deadline:   'Jun 30, 2025',
    source:     'Online Portal',
    referredBy: 'Self',
    graduation: 'Expected 2026',
    email:      `${e.name.toLowerCase().replace(' ', '.')}@email.com`,
    checklist: [
      { label: 'Personal Statement', status: e.status === 'Pending' ? 'PENDING' : 'SUBMITTED' },
      { label: 'Transcripts',        status: 'SUBMITTED' },
      { label: 'Reference Letters',  status: e.status === 'Pending' ? 'PENDING' : 'SUBMITTED' },
      { label: 'CV / Resume',        status: 'SUBMITTED' },
      { label: 'English Proficiency',status: 'NOT REQUIRED' },
    ],
    academic: {
      gpa:         '3.85 / 4.0',
      institution: e.university,
      major:       'Life Sciences',
      yearOfStudy: '4th Year',
      mcatScore:   '516 / 528',
    },
    progressStep:       statusToStep[e.status] ?? 1,
    currentStageDesc:   e.status === 'Reviewed'
      ? 'Essay reviewed and scored. Awaiting student revision.'
      : e.status === 'In Review'
      ? 'Essay is currently under counselor review.'
      : 'Essay submitted and awaiting review.',
    estimatedUpdate: 'Jun 5, 2025',
  };
}

// ── Essay Review extra tab content ────────────────────────────────────────────
function EssayReviewTab({ e }: { e: typeof ESSAYS[number] }) {
  return (
    <div className="space-y-5">
      {/* Essay Info */}
      <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
        <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Essay Information</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Essay Topic',   value: e.topic },
            { label: 'Word Count',    value: `${e.words} words` },
            { label: 'Category',      value: e.category },
            { label: 'Submitted On',  value: `${e.date}, ${e.time}` },
            { label: 'Review Status', value: e.status },
            { label: 'Review Score',  value: e.score ? `${e.score}/10 · ${e.quality}` : 'Not yet scored' },
          ].map(row => (
            <div key={row.label}>
              <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-0.5">{row.label}</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback */}
      <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
        <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-3">Feedback & Comments</p>
        {e.feedback ? (
          <p className="text-sm text-slate-600 dark:text-[#c8ccdf] leading-relaxed">{e.feedback}</p>
        ) : (
          <div className="flex items-center gap-2 py-4 text-slate-400 dark:text-[#8e92ad]">
            <Clock size={15} className="shrink-0 opacity-50" />
            <p className="text-xs">No feedback submitted yet — review is pending.</p>
          </div>
        )}
      </div>

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Strengths */}
        <div className="bg-emerald-50 dark:bg-emerald-500/8 rounded-2xl border border-emerald-100 dark:border-emerald-500/15 p-4">
          <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <CheckCircle2 size={11} /> Strengths
          </p>
          {e.strengths.length > 0 ? (
            <div className="space-y-2">
              {e.strengths.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-emerald-800 dark:text-emerald-200">{s}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60">Awaiting review</p>
          )}
        </div>

        {/* Improvements */}
        <div className="bg-amber-50 dark:bg-amber-500/8 rounded-2xl border border-amber-100 dark:border-amber-500/15 p-4">
          <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <AlertTriangle size={11} /> Areas for Improvement
          </p>
          {e.improvements.length > 0 ? (
            <div className="space-y-2">
              {e.improvements.map((imp, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-amber-800 dark:text-amber-200">{imp}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-amber-600/60 dark:text-amber-400/60">Awaiting review</p>
          )}
        </div>
      </div>

      {/* Internal note */}
      {e.note && (
        <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl px-4 py-3">
          <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
            <BookOpen size={10} className="inline mr-1" />Counselor Note
          </p>
          <p className="text-xs text-cyan-800 dark:text-cyan-200 leading-relaxed">{e.note}</p>
        </div>
      )}
    </div>
  );
}

// ── Download Modal ────────────────────────────────────────────────────────────
type DownloadFormat = 'pdf' | 'docx' | 'csv';

function DownloadEssayModal({
  e, onClose,
}: { e: typeof ESSAYS[number]; onClose: () => void }) {
  const [format,       setFormat]       = useState<DownloadFormat>('pdf');
  const [includeSections, setInclude]   = useState({
    studentInfo:  true,
    essayContent: true,
    feedback:     true,
    strengths:    true,
    improvements: true,
    counselorNote:true,
    academicInfo: true,
  });
  const [downloading, setDownloading]   = useState(false);
  const [done,        setDone]          = useState(false);

  function toggle(key: keyof typeof includeSections) {
    setInclude(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setDone(true); }, 1800);
    setTimeout(() => { setDone(false); onClose(); }, 3200);
  }

  const formatLabels: Record<DownloadFormat, string> = {
    pdf:  'PDF Document (.pdf)',
    docx: 'Word Document (.docx)',
    csv:  'Spreadsheet (.csv)',
  };

  const sections: { key: keyof typeof includeSections; label: string; icon: React.ReactNode }[] = [
    { key: 'studentInfo',   label: 'Student Information',  icon: <User size={13} /> },
    { key: 'essayContent',  label: 'Essay Topic & Details', icon: <FileText size={13} /> },
    { key: 'feedback',      label: 'Feedback & Comments',   icon: <BookOpen size={13} /> },
    { key: 'strengths',     label: 'Strengths',             icon: <CheckCircle2 size={13} /> },
    { key: 'improvements',  label: 'Areas for Improvement', icon: <AlertTriangle size={13} /> },
    { key: 'counselorNote', label: 'Counselor Note',        icon: <Hash size={13} /> },
    { key: 'academicInfo',  label: 'Academic Summary',      icon: <GraduationCap size={13} /> },
  ];

  const selectedCount = Object.values(includeSections).filter(Boolean).length;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[3px]" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-md bg-white dark:bg-[#161a27] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 flex flex-col overflow-hidden"
          onClick={ev => ev.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100 dark:border-white/6">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${e.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>
                {e.initials}
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">Download Essay Review</h2>
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{e.name} · {e.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              <X size={14} />
            </button>
          </div>

          <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">

            {/* Essay summary card */}
            <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/6 p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Essay Summary</p>
                {e.score && (
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
                    {e.score}/10 · {e.quality}
                  </span>
                )}
              </div>
              {[
                { icon: <FileText size={11} />,    label: 'Topic',      value: e.topic },
                { icon: <BarChart2 size={11} />,   label: 'Words',      value: `${e.words} words` },
                { icon: <Calendar size={11} />,    label: 'Submitted',  value: `${e.date}, ${e.time}` },
                { icon: <CheckCircle2 size={11} />,label: 'Status',     value: e.status },
                { icon: <GraduationCap size={11} />,label:'University', value: e.university },
              ].map(row => (
                <div key={row.label} className="flex items-center gap-2">
                  <span className="text-slate-300 dark:text-white/20 shrink-0">{row.icon}</span>
                  <span className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] w-16 shrink-0">{row.label}</span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] truncate">{row.value}</span>
                </div>
              ))}
            </div>

            {/* File format */}
            <div>
              <p className="text-xs font-bold text-slate-700 dark:text-white mb-2.5">Download Format</p>
              <div className="grid grid-cols-3 gap-2">
                {(['pdf', 'docx', 'csv'] as DownloadFormat[]).map(f => (
                  <button
                    key={f}
                    onClick={() => setFormat(f)}
                    className={`py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wide transition-all ${
                      format === f
                        ? 'bg-cyan-600 border-cyan-600 text-white shadow-sm'
                        : 'bg-gray-50 dark:bg-white/[0.03] border-gray-200 dark:border-white/10 text-slate-500 dark:text-[#8e92ad] hover:border-cyan-400 dark:hover:border-cyan-500/50'
                    }`}
                  >
                    .{f}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1.5">{formatLabels[format]}</p>
            </div>

            {/* Sections to include */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-xs font-bold text-slate-700 dark:text-white">Include in Report</p>
                <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">{selectedCount} of {sections.length} selected</span>
              </div>
              <div className="space-y-1.5">
                {sections.map(s => (
                  <label
                    key={s.key}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:border-gray-100 dark:hover:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-all"
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all shrink-0 ${
                      includeSections[s.key]
                        ? 'bg-cyan-600 border-cyan-600'
                        : 'border-gray-300 dark:border-white/20'
                    }`}>
                      {includeSections[s.key] && <CheckCircle2 size={10} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-slate-400 dark:text-[#8e92ad] shrink-0 ${includeSections[s.key] ? 'text-cyan-600 dark:text-cyan-400' : ''}`}>
                      {s.icon}
                    </span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{s.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 dark:border-white/6">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading || done || selectedCount === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60 ${
                done
                  ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20'
              }`}
            >
              {done ? (
                <><CheckCircle2 size={14} /> Downloaded!</>
              ) : downloading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Preparing…</>
              ) : (
                <><Download size={14} /> Download {format.toUpperCase()}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EssayReviewsPage() {
  const [activeTab,    setActiveTab]    = useState('All Essays');
  const [page,         setPage]         = useState(1);
  const [modalEssay,   setModalEssay]   = useState<typeof ESSAYS[number] | null>(null);
  const [downloadEssay, setDownloadEssay] = useState<typeof ESSAYS[number] | null>(null);

  const filtered = ESSAYS.filter(e =>
    activeTab === 'All Essays'     ? true :
    activeTab === 'Pending Review' ? e.status === 'Pending' :
    activeTab === 'In Progress'    ? e.status === 'In Review' :
    activeTab === 'Reviewed'       ? e.status === 'Reviewed' :
    e.status === 'Submitted'
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Essay Reviews</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Review, manage, and provide feedback on student admission essays.</p>
          </div>
          <Link href="/counselor/new-review" className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Plus size={15} /> New Review
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">
          <div className="space-y-4">
            {/* Tabs + Search */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                {TABS.map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${activeTab === tab ? 'bg-cyan-600 text-white shadow-sm' : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {tab} <span className="opacity-70 text-[10px]">{counts[tab as keyof typeof counts]}</span>
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 sm:ml-auto">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input placeholder="Search essays..." className="h-9 pl-9 pr-4 text-sm bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400/50 transition-all" />
                </div>
                <button className="flex items-center gap-1.5 h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <Filter size={13} /> Filters
                </button>
                <button className="h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  Sort: Newest
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-white/5">
                      {['STUDENT','ESSAY TOPIC','WORD COUNT','SUBMISSION DATE','STATUS','REVIEW SCORE','ACTION'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {filtered.map((e, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800 dark:text-white">{e.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">ID: {e.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 max-w-[140px]">
                          <p className="text-xs text-slate-700 dark:text-[#c8ccdf] truncate">{e.topic}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{e.words} Words</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{e.date}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.time}</p>
                        </td>
                        <td className="px-5 py-3.5"><StatusBadge s={e.status} /></td>
                        <td className="px-5 py-3.5">
                          {e.score ? (
                            <div>
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{e.score}/10</span>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{e.quality}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 dark:text-[#40455e]">Not reviewed</span>
                          )}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setModalEssay(e)}
                              className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <Link href="/counselor/messages" className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors" title="Message Student">
                              <MessageSquare size={14} />
                            </Link>
                            <button
                              onClick={() => setDownloadEssay(e)}
                              className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-colors"
                              title="Download Essay Review"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to 8 of 120 essays</p>
                <div className="flex items-center gap-1">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all"><ChevronLeft size={14} /></button>
                  {[1,2,3].map(n => <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${page === n ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{n}</button>)}
                  <span className="text-slate-400 text-xs">... 15</span>
                  <button onClick={() => setPage(p => p + 1)} className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"><ChevronRight size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Review Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Review Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total Essays', value: 120,      color: 'text-slate-800 dark:text-white',       bg: 'bg-slate-50 dark:bg-white/5' },
                  { label: 'Pending',      value: 24,       color: 'text-amber-600 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-500/10' },
                  { label: 'Reviewed',     value: 62,       color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                  { label: 'Avg Score',    value: '8.6/10', color: 'text-blue-600 dark:text-blue-400',     bg: 'bg-blue-50 dark:bg-blue-500/10' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} rounded-xl p-3`}>
                    <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">{s.label}</p>
                    <p className={`text-xl font-bold mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Feedback */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Feedback</h3>
                <Link href="/counselor/recent-feedback" className="text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View All <ChevronRight size={12} /></Link>
              </div>
              <div className="space-y-3">
                {RECENT_FEEDBACK.map((f, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{f.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">{f.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-[#8e92ad] font-medium">{f.topic}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-0.5 truncate">{f.comment}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-[#40455e] shrink-0">{f.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Essays */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Top Performing Essays</h3>
                <Link href="/counselor/essay-ranking" className="text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View All <ChevronRight size={12} /></Link>
              </div>
              <div className="space-y-3">
                {TOP_ESSAYS.map((e, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] w-4 shrink-0">{i + 1}</span>
                    <div className={`w-8 h-8 rounded-lg ${e.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{e.initials}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{e.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{e.topic}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={11} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-slate-700 dark:text-[#c8ccdf]">{e.score}/10</span>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/counselor/essay-ranking" className="mt-4 text-xs font-semibold text-cyan-600 flex items-center gap-1 hover:text-cyan-700 transition-colors">View All Rankings <ChevronRight size={12} /></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Application Details Modal */}
      {modalEssay && (
        <ApplicationDetailsModal
          app={toAppRecord(modalEssay)}
          onClose={() => setModalEssay(null)}
          extraTab={{
            key:     'essay',
            label:   'Essay Review',
            content: <EssayReviewTab e={modalEssay} />,
          }}
        />
      )}

      {/* Download Modal */}
      {downloadEssay && (
        <DownloadEssayModal
          e={downloadEssay}
          onClose={() => setDownloadEssay(null)}
        />
      )}
    </div>
  );
}
