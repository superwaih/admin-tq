'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Send, Phone, Video, Star, MoreHorizontal,
  Upload, MessageSquare, FileText, ChevronRight, Plus, X,
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    text: 'Please introduce yourself and tell us why you are interested in this role.\nWhat are your strengths, and how do you handle challenges in school projects?\nWhich school project are you most proud of, and why should we select you?',
  },
  {
    id: 2,
    text: 'Describe a time you faced a significant ethical dilemma. How did you approach it and what was the outcome?',
  },
  {
    id: 3,
    text: 'How do you prioritize tasks when you have multiple urgent deadlines? Give a specific example.',
  },
  {
    id: 4,
    text: 'What do you consider your greatest weakness, and what steps have you taken to improve it?',
  },
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'counselor' as const,
    text: 'Please introduce yourself and tell us why you are interested in this role.\nWhat are your strengths, and how do you handle challenges in school projects?\nWhich school project are you most proud of, and why should we select you?',
    time: '10:15 AM',
  },
  {
    id: 2,
    role: 'candidate' as const,
    text: "I'm a Computer Science student interested in software development.\n\nI'm a quick learner with good teamwork skills.\n\nI recently improved a web project's performance.\n\nI stay calm and organized during deadlines.\n\nI'm motivated, eager to learn, and ready to contribute.",
    time: '10:25 AM',
    read: true,
  },
  {
    id: 3,
    role: 'counselor' as const,
    text: "That would be great! I'm available tomorrow after 3 PM.",
    time: '10:28 AM',
  },
];

const NEW_MESSAGES = [
  {
    id: 4,
    role: 'counselor' as const,
    text: 'Also, could you recommend some additional resources for the "Overcoming Challenges" topic?',
    time: '10:30 AM',
  },
];

const TAGS = [
  { label: 'DSA',                color: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400' },
  { label: 'Ques',               color: 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400' },
  { label: 'Good Communication', color: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  { label: 'Improve Pace',       color: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400' },
];

const SCORES = [
  { label: 'Communication',    score: 40, pct: 33, color: '#22d3ee',  ring: '#22d3ee' },
  { label: 'Technical Knowledge', score: 36, pct: 30, color: '#3b82f6', ring: '#3b82f6' },
  { label: 'Problem Solving',  score: 24, pct: 20, color: '#f59e0b',  ring: '#f59e0b' },
  { label: 'Confidence',       score: 16, pct: 13, color: '#94a3b8',  ring: '#94a3b8' },
  { label: 'Presence of Mind', score: 4,  pct: 3,  color: '#e2e8f0',  ring: '#e2e8f0' },
];

const ACTIVE_TABS = ['Interview', 'Notes', 'Candidate'] as const;
type Tab = typeof ACTIVE_TABS[number];

function useTimer() {
  const [seconds, setSeconds] = useState(18 * 60 + 42);
  useEffect(() => {
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return `00:${mm}:${ss}`;
}

export default function StartMockInterviewPage() {
  const [tab, setTab] = useState<Tab>('Interview');
  const [messages, setMessages] = useState([...INITIAL_MESSAGES, ...NEW_MESSAGES]);
  const [input, setInput] = useState('');
  const [qIndex, setQIndex] = useState(0);
  const [note, setNote] = useState('Explained concept clearly with good examples, could improve on edge case analysis and communication pace.');
  const [editingNote, setEditingNote] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState(TAGS);
  const [ended, setEnded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timer = useTimer();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function sendMessage() {
    if (!input.trim()) return;
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'counselor',
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  }

  function nextQuestion() {
    const next = QUESTIONS[(qIndex + 1) % QUESTIONS.length];
    setQIndex(i => (i + 1) % QUESTIONS.length);
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      role: 'counselor',
      text: next.text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
  }

  function addTag() {
    if (!newTag.trim()) return;
    setTags(prev => [...prev, { label: newTag.trim(), color: 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400' }]);
    setNewTag('');
  }

  if (ended) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
          <Star size={28} className="text-emerald-600" fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Interview Completed!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
          The mock interview with <strong>Amina Yusuf</strong> has ended.<br />Overall score: <strong>7.8 / 10</strong>
        </p>
        <Link href="/counselor" className="mt-2 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-all">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex flex-col">
      <div className="max-w-[1400px] w-full mx-auto flex flex-col flex-1 gap-4">

        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <Link href="/counselor" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1">
              <ChevronLeft size={15} /> Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Mock Interview in Progress</h1>
          </div>

          {/* Candidate info + controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-white text-xs font-bold shrink-0">AM</div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-slate-800 dark:text-white">Amina Yusuf</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">Student</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">amina.yusuf@email.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button className="p-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shadow-sm">
                <Phone size={14} />
              </button>
              <button className="p-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors shadow-sm">
                <Video size={14} />
              </button>
              <button className="p-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-500 dark:text-slate-400 transition-colors shadow-sm">
                <MoreHorizontal size={14} />
              </button>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200/60 dark:border-emerald-500/25">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Live Interview</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 shadow-sm">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono">{timer}</span>
              </div>
              <button
                onClick={() => setEnded(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 dark:bg-red-500/15 border border-red-200/60 dark:border-red-500/25 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/25 transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>

        {/* Three-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_300px] gap-4 flex-1">

          {/* ── Col 1: Chat ── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm flex flex-col overflow-hidden">

            {/* Tabs */}
            <div className="flex items-center border-b border-gray-100 dark:border-white/5 px-4 pt-3 gap-4">
              {ACTIVE_TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`pb-2.5 text-xs font-semibold border-b-2 transition-all ${
                    tab === t
                      ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                      : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
              <button
                onClick={nextQuestion}
                className="ml-auto mb-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Next Question <ChevronRight size={12} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-[300px] max-h-[480px]">
              {/* Counselor label */}
              <div className="text-center text-[10px] font-semibold text-cyan-600 dark:text-cyan-400">Counselor</div>

              {messages.slice(0, 3).map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.role === 'counselor' && (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">C</div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'candidate' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'candidate'
                        ? 'bg-cyan-600 text-white rounded-tr-sm'
                        : 'bg-gray-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-tl-sm border border-gray-100 dark:border-white/6'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-[#8e92ad] px-1">{msg.time}{'read' in msg && msg.read ? ' ✓' : ''}</span>
                  </div>
                  {msg.role === 'candidate' && (
                    <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">AM</div>
                  )}
                </div>
              ))}

              {/* New messages divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
                <span className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad]">New Messages</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
              </div>

              {messages.slice(3).map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'candidate' ? 'justify-end' : 'justify-start'} gap-2`}>
                  {msg.role === 'counselor' && (
                    <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0 mt-0.5">C</div>
                  )}
                  <div className="max-w-[80%] flex flex-col gap-1">
                    <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                      msg.role === 'candidate'
                        ? 'bg-cyan-600 text-white rounded-tr-sm'
                        : 'bg-gray-50 dark:bg-white/5 text-slate-700 dark:text-slate-300 rounded-tl-sm border border-gray-100 dark:border-white/6'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-400 dark:text-[#8e92ad] px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="border-t border-gray-100 dark:border-white/5 px-4 py-3">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/6 px-3 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none"
                />
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Upload size={13} /></button>
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><MessageSquare size={13} /></button>
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><FileText size={13} /></button>
                <button
                  onClick={sendMessage}
                  className="w-7 h-7 rounded-lg bg-cyan-600 hover:bg-cyan-700 flex items-center justify-center text-white transition-all shrink-0"
                >
                  <Send size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Col 2: Evaluation + Tags ── */}
          <div className="space-y-4">

            {/* Evaluation Overview */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Evaluation Overview</h3>
              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mb-4">Overall Score</p>

              <div className="flex items-center gap-5">
                {/* Donut */}
                <div className="relative shrink-0 w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" className="dark:stroke-white/10" />
                    {/* Communication 33% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#22d3ee" strokeWidth="4"
                      strokeDasharray="29.03 58.97" strokeLinecap="round" />
                    {/* Technical 30% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#3b82f6" strokeWidth="4"
                      strokeDasharray="26.39 61.61" strokeDashoffset="-29.03" strokeLinecap="round" />
                    {/* Problem Solving 20% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f59e0b" strokeWidth="4"
                      strokeDasharray="17.59 70.41" strokeDashoffset="-55.42" strokeLinecap="round" />
                    {/* Confidence 13% */}
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#94a3b8" strokeWidth="4"
                      strokeDasharray="11.43 76.57" strokeDashoffset="-73.01" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-slate-800 dark:text-white">7.8</span>
                    <span className="text-[9px] text-slate-400">/10</span>
                  </div>
                </div>

                {/* Score breakdown */}
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-1">Good Performance</p>
                  {SCORES.map(s => (
                    <div key={s.label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-[11px] text-slate-600 dark:text-slate-300 flex-1 truncate">{s.label}</span>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] shrink-0">{s.score} ({s.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notes</h3>
                <button
                  onClick={() => setEditingNote(e => !e)}
                  className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors"
                >
                  {editingNote ? 'Save' : 'Add Notes'}
                </button>
              </div>
              {editingNote ? (
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={5}
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none transition-all"
                />
              ) : (
                <div className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 border border-gray-100 dark:border-white/6">
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">{note}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.map((t, i) => (
                  <div key={i} className={`flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${t.color}`}>
                    {t.label}
                    <button onClick={() => setTags(prev => prev.filter((_, j) => j !== i))} className="opacity-60 hover:opacity-100 transition-opacity">
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTag()}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-xs text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                />
                <button
                  onClick={addTag}
                  className="p-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition-all"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Col 3: Stats bar ── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 flex flex-col gap-4 lg:h-fit">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Interview Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {[
                { label: 'Total Questions',  value: QUESTIONS.length, sub: '' },
                { label: 'Questions Asked',  value: qIndex + 1,       sub: '' },
                { label: 'Pending',          value: QUESTIONS.length - (qIndex + 1), sub: '' },
                { label: 'Difficulty Level', value: 'Medium',         color: 'text-amber-600 dark:text-amber-400' },
                { label: 'Interview Start',  value: '10:00 AM',       sub: '' },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 dark:bg-white/5 rounded-xl px-4 py-3 border border-gray-50 dark:border-white/5">
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wide">{s.label}</p>
                  <p className={`text-lg font-bold mt-0.5 ${(s as any).color || 'text-slate-800 dark:text-white'}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Current question preview */}
            <div className="bg-cyan-50 dark:bg-cyan-500/10 rounded-xl p-4 border border-cyan-100 dark:border-cyan-500/20">
              <p className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide mb-1.5">Current Question</p>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-4">{QUESTIONS[qIndex].text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
