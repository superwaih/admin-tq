'use client';

import { useState } from 'react';
import {
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2, Circle,
  AlertTriangle, Clock, ArrowRight, Save, Eye, Plus, Trash2,
  FileText, Users, Briefcase, Heart, Trophy, HelpCircle,
  Lightbulb, Target, Star, TrendingUp, BarChart3, Edit3,
  BookOpen, MessageSquare, Zap, Info, ChevronDown, ChevronUp,
  Download, Send, RotateCcw, Check, AlertCircle, X,
} from 'lucide-react';

const UNIVERSITY = 'University of Toronto';
const PROGRAM    = 'Health Sciences';
const DEADLINE   = '2025-06-01';
const DAYS_LEFT  = 7;

const SECTIONS = [
  { id: 'personal',         label: 'Personal Statement',         icon: FileText,   total: 650,  filled: 420, required: true  },
  { id: 'extracurricular',  label: 'Extracurricular Activities', icon: Users,      total: 5,    filled: 3,   required: true  },
  { id: 'work',             label: 'Work Experience',            icon: Briefcase,  total: 3,    filled: 1,   required: false },
  { id: 'volunteer',        label: 'Volunteer & Community',      icon: Heart,      total: 4,    filled: 2,   required: true  },
  { id: 'awards',           label: 'Awards & Achievements',      icon: Trophy,     total: 5,    filled: 1,   required: false },
  { id: 'questions',        label: 'Program Questions',          icon: HelpCircle, total: 3,    filled: 1,   required: true  },
] as const;
type SectionId = typeof SECTIONS[number]['id'];

const AI_TIPS: Record<SectionId, { title: string; tips: string[] }> = {
  personal: {
    title: 'Personal Statement Tips',
    tips: [
      'Open with a specific, vivid moment — not a generic statement about your passion for healthcare.',
      'Connect your past experiences directly to your future goals in Health Sciences.',
      'Mention 2–3 concrete accomplishments with measurable impact where possible.',
      'End with a forward-looking statement about what you hope to achieve at UofT.',
      'Avoid clichés like "ever since I was young" or "I have always wanted to be a doctor."',
    ],
  },
  extracurricular: {
    title: 'Extracurricular Tips',
    tips: [
      'List activities in order of significance to your application, not chronological order.',
      'Quantify your involvement: hours per week, members led, events organized.',
      'Highlight leadership growth — promoted from member to executive, etc.',
      'Focus on depth over breadth: 3 meaningful activities beat 10 shallow ones.',
      'Tie each activity back to skills relevant to Health Sciences.',
    ],
  },
  work: {
    title: 'Work Experience Tips',
    tips: [
      'Include paid, unpaid, and co-op positions — all are valid.',
      'Focus on transferable skills: communication, teamwork, problem-solving.',
      'Mention any healthcare-adjacent roles prominently (pharmacy, lab, clinic).',
      'Describe your responsibilities using action verbs: managed, coordinated, developed.',
    ],
  },
  volunteer: {
    title: 'Volunteer & Community Tips',
    tips: [
      'Emphasize sustained commitment — ongoing roles show dedication.',
      'Hospital, hospice, or clinical volunteering is especially relevant.',
      'Include cultural or community initiatives that shaped your worldview.',
      'Describe the impact you made, not just the tasks you performed.',
    ],
  },
  awards: {
    title: 'Awards & Achievements Tips',
    tips: [
      'Include academic and non-academic awards — both count.',
      'Provide brief context: out of how many applicants/students was this awarded?',
      'Regional or national recognition should be prominently placed.',
      'Include scholarships, bursaries, or merit-based recognitions.',
    ],
  },
  questions: {
    title: 'Program Question Tips',
    tips: [
      'Read the exact question carefully — answer what is asked, not what you wish was asked.',
      'Be specific to UofT and the Health Sciences program — avoid generic answers.',
      'Reference specific courses, labs, or faculty that align with your goals.',
      'Proofread for grammar and clarity — admissions officers read hundreds of AIFs.',
    ],
  },
};

const WRITING_CHECKLIST: Record<SectionId, { item: string; done: boolean }[]> = {
  personal:        [
    { item: 'Opens with a compelling hook', done: true },
    { item: 'Mentions 2+ specific experiences', done: true },
    { item: 'Connects experience to program goals', done: false },
    { item: 'Within 650 word limit', done: true },
    { item: 'Proofread for grammar', done: false },
  ],
  extracurricular: [
    { item: 'At least 3 activities listed', done: true },
    { item: 'Each entry has hours/week', done: false },
    { item: 'Listed in order of importance', done: true },
    { item: 'Descriptions use action verbs', done: false },
  ],
  work:            [
    { item: 'Employer name & dates included', done: true },
    { item: 'Responsibilities described', done: false },
    { item: 'Transferable skills highlighted', done: false },
  ],
  volunteer:       [
    { item: 'At least 2 ongoing roles listed', done: true },
    { item: 'Impact described, not just tasks', done: false },
    { item: 'Healthcare-relevant roles noted', done: true },
  ],
  awards:          [
    { item: 'Academic awards included', done: true },
    { item: 'Context provided for each award', done: false },
    { item: 'Listed in order of prestige', done: false },
  ],
  questions:       [
    { item: 'Answers are program-specific', done: false },
    { item: 'UofT resources mentioned', done: false },
    { item: 'Within word limits', done: true },
    { item: 'Proofread', done: false },
  ],
};

const PERSONAL_STATEMENT_DEFAULT = `My first encounter with the complexity of human health was not in a textbook, but at my grandmother's bedside. Watching the healthcare team coordinate her care — bridging medicine, communication, and compassion — sparked a curiosity that has driven every decision since.

Over the past four years, I have explored this curiosity through diverse lenses. As a volunteer at St. Michael's Hospital, I spent over 200 hours in the geriatric ward, assisting nurses and speaking with patients who often felt overlooked by the system. I learned that healing is not only clinical — it is deeply relational. These interactions shaped my belief that effective health advocacy requires both scientific rigour and genuine human empathy.

Academically, I have pursued this dual commitment through my coursework in biology and psychology, achieving a 94% average while leading my school's Health Awareness Club to double its membership. Under my leadership, we organized three community wellness fairs reaching over 400 students.`;

interface Activity {
  id: number; role: string; organization: string; startDate: string; endDate: string; hoursPerWeek: string; description: string;
}
interface Award {
  id: number; title: string; organization: string; year: string; description: string;
}

const INITIAL_ACTIVITIES: Activity[] = [
  { id: 1, role: 'Vice President', organization: 'Health Awareness Club', startDate: '2022-09', endDate: 'Present', hoursPerWeek: '5', description: 'Led a team of 12 executives to organize community wellness fairs, doubling club membership to 80+ students.' },
  { id: 2, role: 'Volunteer',      organization: 'St. Michael\'s Hospital', startDate: '2021-06', endDate: 'Present', hoursPerWeek: '4', description: 'Assisted nursing staff in the geriatric ward, providing companionship and basic patient support for 200+ hours.' },
  { id: 3, role: 'Team Captain',   organization: 'School Volleyball Team', startDate: '2021-09', endDate: '2023-06', hoursPerWeek: '6', description: 'Captained the varsity volleyball team for two seasons, leading the team to regional finals.' },
];

const INITIAL_WORK: Activity[] = [
  { id: 1, role: 'Pharmacy Assistant', organization: 'Shoppers Drug Mart', startDate: '2023-06', endDate: '2024-08', hoursPerWeek: '15', description: 'Assisted pharmacists with prescription intake, patient counselling, and inventory management.' },
];

const INITIAL_VOLUNTEER: Activity[] = [
  { id: 1, role: 'Tutor',    organization: 'Ridgemont Learning Centre', startDate: '2022-01', endDate: 'Present', hoursPerWeek: '3', description: 'Tutored Grade 9–10 students in math and science, improving average grades by 15%.' },
  { id: 2, role: 'Volunteer', organization: 'Food Bank of Ottawa',      startDate: '2021-09', endDate: '2022-06', hoursPerWeek: '4', description: 'Sorted and distributed food packages to over 300 families per month during the pandemic.' },
];

const INITIAL_AWARDS: Award[] = [
  { id: 1, title: 'Governor General\'s Academic Medal', organization: 'Ridgemont High School', year: '2025', description: 'Awarded to the student with the highest academic standing graduating from secondary school.' },
];

const PROGRAM_QUESTIONS = [
  { id: 1, question: 'Why do you want to study Health Sciences at the University of Toronto specifically?', answer: 'The University of Toronto\'s Health Sciences program uniquely bridges the gap between foundational life sciences and applied health policy — an intersection I am deeply passionate about. The opportunity to work alongside faculty members like Dr. Patricia O\'Campo, whose research in population health and equity aligns with my volunteer experiences, is especially compelling. I am also drawn to the collaborative research opportunities at the Dalla Lana School of Public Health, where I hope to investigate social determinants of health in underserved communities.', limit: 350 },
  { id: 2, question: 'Describe a challenge you have overcome and what you learned from it.', answer: '', limit: 300 },
  { id: 3, question: 'How has your background prepared you for a career in the health sector?', answer: '', limit: 350 },
];

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function ProgressRing({ pct, size = 40, stroke = 3.5, color = '#2563EB' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r  = (size - stroke * 2) / 2;
  const c  = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} className="dark:stroke-white/10" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-500" />
    </svg>
  );
}

function SectionPct(s: typeof SECTIONS[number]): number {
  if (s.id === 'personal') return Math.round((s.filled / s.total) * 100);
  return Math.round((s.filled / s.total) * 100);
}

export default function AifCoachPage() {
  const [activeSection, setActiveSection] = useState<SectionId>('personal');
  const [personalText, setPersonalText]   = useState(PERSONAL_STATEMENT_DEFAULT);
  const [activities, setActivities]       = useState<Activity[]>(INITIAL_ACTIVITIES);
  const [work, setWork]                   = useState<Activity[]>(INITIAL_WORK);
  const [volunteer, setVolunteer]         = useState<Activity[]>(INITIAL_VOLUNTEER);
  const [awards, setAwards]               = useState<Award[]>(INITIAL_AWARDS);
  const [programQs, setProgramQs]         = useState(PROGRAM_QUESTIONS);
  const [aiExpanded, setAiExpanded]       = useState(true);
  const [checklistExpanded, setChecklistExpanded] = useState(true);
  const [savedBanner, setSavedBanner]     = useState(false);
  const [sidebarOpen, setSidebarOpen]     = useState(false);

  const section = SECTIONS.find(s => s.id === activeSection)!;
  const sectionIdx = SECTIONS.findIndex(s => s.id === activeSection);
  const overallPct = Math.round(SECTIONS.reduce((acc, s) => acc + SectionPct(s), 0) / SECTIONS.length);

  function handleSave() {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  }

  function addActivity(setter: React.Dispatch<React.SetStateAction<Activity[]>>) {
    setter(prev => [...prev, { id: Date.now(), role: '', organization: '', startDate: '', endDate: '', hoursPerWeek: '', description: '' }]);
  }
  function updateActivity(setter: React.Dispatch<React.SetStateAction<Activity[]>>, id: number, field: keyof Activity, val: string) {
    setter(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
  }
  function removeActivity(setter: React.Dispatch<React.SetStateAction<Activity[]>>, id: number) {
    setter(prev => prev.filter(a => a.id !== id));
  }

  const wordCount = countWords(personalText);
  const wordLimit = 650;

  function ActivityEditor({ items, setter, label }: { items: Activity[]; setter: React.Dispatch<React.SetStateAction<Activity[]>>; label: string }) {
    return (
      <div className="space-y-4">
        {items.map((act, idx) => (
          <div key={act.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg">Entry {idx + 1}</span>
              <button onClick={() => removeActivity(setter, act.id)} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Role / Title</label>
                <input value={act.role} onChange={e => updateActivity(setter, act.id, 'role', e.target.value)} placeholder="e.g. Vice President" className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Organization</label>
                <input value={act.organization} onChange={e => updateActivity(setter, act.id, 'organization', e.target.value)} placeholder="e.g. Health Awareness Club" className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Start Date</label>
                <input value={act.startDate} onChange={e => updateActivity(setter, act.id, 'startDate', e.target.value)} placeholder="e.g. 2022-09" className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">End Date</label>
                <input value={act.endDate} onChange={e => updateActivity(setter, act.id, 'endDate', e.target.value)} placeholder="e.g. Present" className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Hrs / Week</label>
                <input value={act.hoursPerWeek} onChange={e => updateActivity(setter, act.id, 'hoursPerWeek', e.target.value)} placeholder="e.g. 5" className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Description</label>
              <textarea value={act.description} onChange={e => updateActivity(setter, act.id, 'description', e.target.value)} placeholder="Describe your role, responsibilities, and impact..." rows={3} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all resize-none" />
              <div className="flex justify-end mt-1">
                <span className={`text-[10px] font-semibold ${act.description.length > 200 ? 'text-amber-500' : 'text-slate-400'}`}>{act.description.length}/250 chars</span>
              </div>
            </div>
          </div>
        ))}
        <button onClick={() => addActivity(setter)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/5 hover:border-blue-400 transition-all">
          <Plus size={15} /> Add {label}
        </button>
      </div>
    );
  }

  const SectionIcon = section.icon;

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">

      {/* ── Saved banner ── */}
      {savedBanner && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-200/50 dark:shadow-emerald-900/30 animate-in slide-in-from-top-2">
          <Check size={13} /> Saved successfully!
        </div>
      )}

      <div className="max-w-[1280px] mx-auto space-y-5">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Zap size={13} className="text-white fill-white" />
              </div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">AIF Coach</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{UNIVERSITY}</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">{PROGRAM} — Applicant Information Form</p>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {/* Deadline chip */}
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl px-3 py-2">
              <Clock size={13} className="text-red-500" />
              <div>
                <p className="text-[9px] font-bold text-red-400 uppercase tracking-wider">Deadline</p>
                <p className="text-xs font-bold text-red-600 dark:text-red-400">{DAYS_LEFT} days left</p>
              </div>
            </div>

            {/* Overall progress */}
            <div className="flex items-center gap-2.5 bg-white dark:bg-[#161a27] rounded-xl border border-gray-100 dark:border-white/6 px-3 py-2">
              <ProgressRing pct={overallPct} size={36} stroke={3.5} />
              <div>
                <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Overall</p>
                <p className="text-xs font-bold text-slate-800 dark:text-white">{overallPct}% Complete</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button onClick={handleSave} className="flex items-center gap-1.5 h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/20">
                <Save size={13} /> Save
              </button>
              <button className="flex items-center gap-1.5 h-9 px-4 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-700 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-xs font-bold transition-colors">
                <Eye size={13} /> Preview
              </button>
            </div>
          </div>
        </div>

        {/* ── Deadline urgency banner ── */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-2xl px-4 py-3">
          <AlertTriangle size={15} className="text-amber-500 shrink-0" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            <span className="font-bold">2 required sections still need attention</span> — Program Questions and Extracurricular descriptions are incomplete. Complete them before {DEADLINE}.
          </p>
          <button className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 underline underline-offset-2 whitespace-nowrap">See all</button>
        </div>

        {/* ── Main 3-column layout ── */}
        <div className="flex gap-5 items-start">

          {/* ── Left: Section nav (desktop) ── */}
          <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 gap-2">
            <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest px-1 mb-1">Sections</p>
            {SECTIONS.map(s => {
              const Icon = s.icon;
              const pct  = SectionPct(s);
              const done = pct === 100;
              const isActive = s.id === activeSection;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-blue-900/30'
                      : 'bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-gray-50 dark:bg-white/[0.04]'}`}>
                    {done ? <CheckCircle2 size={14} className={isActive ? 'text-white' : 'text-emerald-500'} /> : <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400 dark:text-[#8e92ad]'} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[11px] font-semibold truncate ${isActive ? 'text-white' : ''}`}>{s.label}</p>
                    <div className={`flex items-center gap-1.5 mt-1`}>
                      <div className={`flex-1 h-1 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/8'}`}>
                        <div className={`h-full rounded-full transition-all ${isActive ? 'bg-white' : pct === 100 ? 'bg-emerald-400' : 'bg-blue-400'}`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-[9px] font-bold shrink-0 ${isActive ? 'text-blue-100' : 'text-slate-400 dark:text-[#8e92ad]'}`}>{pct}%</span>
                    </div>
                  </div>
                  {s.required && !done && <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-red-50 dark:bg-red-500/10 text-red-500'}`}>Req</span>}
                </button>
              );
            })}

            {/* Download / submit */}
            <div className="mt-3 space-y-2">
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-600 dark:text-[#8e92ad] text-xs font-semibold hover:bg-gray-50 transition-colors">
                <Download size={13} /> Export Draft
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm">
                <Send size={13} /> Submit AIF
              </button>
            </div>
          </aside>

          {/* ── Center: Editor ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Mobile section selector */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {SECTIONS.map(s => {
                const Icon = s.icon;
                const pct  = SectionPct(s);
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-[11px] font-semibold shrink-0 transition-all ${
                      s.id === activeSection
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-600 dark:text-[#8e92ad]'
                    }`}
                  >
                    <Icon size={12} /> {s.label.split(' ')[0]}
                    {pct === 100 && <CheckCircle2 size={11} className={s.id === activeSection ? 'text-white' : 'text-emerald-500'} />}
                  </button>
                );
              })}
            </div>

            {/* Section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
                  <SectionIcon size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{section.label}</h2>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">
                    {section.required ? '● Required section' : '○ Optional section'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button disabled={sectionIdx === 0} onClick={() => setActiveSection(SECTIONS[sectionIdx - 1].id)} className="p-2 rounded-lg border border-gray-100 dark:border-white/6 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                <button disabled={sectionIdx === SECTIONS.length - 1} onClick={() => setActiveSection(SECTIONS[sectionIdx + 1].id)} className="p-2 rounded-lg border border-gray-100 dark:border-white/6 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* ── Personal Statement ── */}
            {activeSection === 'personal' && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Write Your Personal Statement</h3>
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Introduce yourself and explain why you are applying to Health Sciences.</p>
                  </div>
                  <button className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors">
                    <Sparkles size={11} /> AI Rewrite
                  </button>
                </div>
                <textarea
                  value={personalText}
                  onChange={e => setPersonalText(e.target.value)}
                  rows={14}
                  className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-[#c8ccdf] leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400/40 transition-all resize-none"
                  placeholder="Begin writing your personal statement here…"
                />
                <div className="flex items-center justify-between mt-2.5">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${wordCount > wordLimit ? 'text-red-500' : wordCount > wordLimit * 0.9 ? 'text-amber-500' : 'text-slate-400 dark:text-[#8e92ad]'}`}>
                      {wordCount} / {wordLimit} words
                    </span>
                    <div className="w-32 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${wordCount > wordLimit ? 'bg-red-500' : wordCount > wordLimit * 0.9 ? 'bg-amber-400' : 'bg-blue-500'}`} style={{ width: `${Math.min((wordCount / wordLimit) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <button onClick={() => setPersonalText('')} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors">
                    <RotateCcw size={10} /> Clear
                  </button>
                </div>
              </div>
            )}

            {/* ── Extracurricular ── */}
            {activeSection === 'extracurricular' && <ActivityEditor items={activities} setter={setActivities} label="Activity" />}

            {/* ── Work Experience ── */}
            {activeSection === 'work' && <ActivityEditor items={work} setter={setWork} label="Work Experience" />}

            {/* ── Volunteer ── */}
            {activeSection === 'volunteer' && <ActivityEditor items={volunteer} setter={setVolunteer} label="Volunteer Role" />}

            {/* ── Awards ── */}
            {activeSection === 'awards' && (
              <div className="space-y-4">
                {awards.map((aw, idx) => (
                  <div key={aw.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 rounded-lg">Award {idx + 1}</span>
                      <button onClick={() => setAwards(prev => prev.filter(a => a.id !== aw.id))} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      {([
                        { field: 'title' as const,        label: 'Award / Honour Title',   ph: 'e.g. Governor General\'s Medal' },
                        { field: 'organization' as const, label: 'Awarding Organization',  ph: 'e.g. Ridgemont High School'     },
                        { field: 'year' as const,         label: 'Year Received',           ph: 'e.g. 2025'                     },
                      ]).map(f => (
                        <div key={f.field}>
                          <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">{f.label}</label>
                          <input value={aw[f.field]} onChange={e => setAwards(prev => prev.map(a => a.id === aw.id ? { ...a, [f.field]: e.target.value } : a))} placeholder={f.ph} className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all" />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Description / Context</label>
                      <textarea value={aw.description} onChange={e => setAwards(prev => prev.map(a => a.id === aw.id ? { ...a, description: e.target.value } : a))} placeholder="Describe the award and its significance…" rows={2} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all resize-none" />
                    </div>
                  </div>
                ))}
                <button onClick={() => setAwards(prev => [...prev, { id: Date.now(), title: '', organization: '', year: '', description: '' }])} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-500/25 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-500/5 hover:border-blue-400 transition-all">
                  <Plus size={15} /> Add Award
                </button>
              </div>
            )}

            {/* ── Program Questions ── */}
            {activeSection === 'questions' && (
              <div className="space-y-4">
                {programQs.map((q, idx) => (
                  <div key={q.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-5 shadow-sm">
                    <div className="flex items-start gap-2.5 mb-4">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-white">{idx + 1}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">{q.question}</p>
                    </div>
                    <textarea
                      value={q.answer}
                      onChange={e => setProgramQs(prev => prev.map(pq => pq.id === q.id ? { ...pq, answer: e.target.value } : pq))}
                      rows={5}
                      placeholder="Write your response here…"
                      className="w-full px-3 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-[#c8ccdf] leading-relaxed outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400/40 transition-all resize-none"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-[10px] font-semibold ${countWords(q.answer) > q.limit ? 'text-red-500' : 'text-slate-400 dark:text-[#8e92ad]'}`}>
                        {countWords(q.answer)} / {q.limit} words
                      </span>
                      <button className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg transition-colors">
                        <Sparkles size={9} /> AI Assist
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom nav */}
            <div className="flex items-center justify-between pt-2">
              <button disabled={sectionIdx === 0} onClick={() => setActiveSection(SECTIONS[sectionIdx - 1].id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] text-xs font-semibold hover:bg-gray-50 disabled:opacity-30 transition-colors">
                <ChevronLeft size={13} /> Previous
              </button>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors">
                <Save size={13} /> Save Section
              </button>
              {sectionIdx < SECTIONS.length - 1 ? (
                <button onClick={() => setActiveSection(SECTIONS[sectionIdx + 1].id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-600 dark:text-[#8e92ad] text-xs font-semibold hover:bg-gray-50 transition-colors">
                  Next <ChevronRight size={13} />
                </button>
              ) : (
                <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors">
                  <Send size={13} /> Submit AIF
                </button>
              )}
            </div>
          </div>

          {/* ── Right: AI Coach panel ── */}
          <aside className="hidden xl:flex flex-col w-72 2xl:w-80 shrink-0 gap-4">

            {/* AI Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <button onClick={() => setAiExpanded(v => !v)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                    <Sparkles size={13} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">AI Coaching Tips</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{AI_TIPS[activeSection].title}</p>
                  </div>
                </div>
                {aiExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>
              {aiExpanded && (
                <div className="px-5 pb-5 space-y-2.5">
                  {AI_TIPS[activeSection].tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb size={10} className="text-blue-500" />
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-[#c8ccdf] leading-relaxed">{tip}</p>
                    </div>
                  ))}
                  <button className="w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-bold transition-colors">
                    <MessageSquare size={11} /> Ask AI Coach
                  </button>
                </div>
              )}
            </div>

            {/* Writing Checklist */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              <button onClick={() => setChecklistExpanded(v => !v)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
                    <CheckCircle2 size={13} className="text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">Quality Checklist</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">
                      {WRITING_CHECKLIST[activeSection].filter(c => c.done).length}/{WRITING_CHECKLIST[activeSection].length} complete
                    </p>
                  </div>
                </div>
                {checklistExpanded ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
              </button>
              {checklistExpanded && (
                <div className="px-5 pb-5 space-y-2">
                  {WRITING_CHECKLIST[activeSection].map((c, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      {c.done
                        ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                        : <Circle size={15} className="text-slate-200 dark:text-white/15 shrink-0" />}
                      <p className={`text-[11px] ${c.done ? 'text-slate-500 dark:text-[#8e92ad] line-through' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>{c.item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Score card */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={14} className="text-blue-200" />
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">AIF Strength Score</p>
              </div>
              <div className="flex items-end gap-3 mb-3">
                <span className="text-4xl font-black">72</span>
                <div className="pb-1">
                  <span className="text-sm font-bold text-blue-200">/ 100</span>
                  <p className="text-[10px] text-blue-300">Good — needs polish</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Completeness',  val: 65 },
                  { label: 'Specificity',   val: 78 },
                  { label: 'Impact Focus',  val: 74 },
                  { label: 'UofT Fit',      val: 70 },
                ].map(m => (
                  <div key={m.label} className="flex items-center gap-2">
                    <p className="text-[10px] text-blue-200 w-24 shrink-0">{m.label}</p>
                    <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{ width: `${m.val}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-100 w-6 text-right">{m.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Section progress overview */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={13} className="text-slate-400" />
                <p className="text-xs font-bold text-slate-900 dark:text-white">Section Overview</p>
              </div>
              <div className="space-y-2.5">
                {SECTIONS.map(s => {
                  const pct = SectionPct(s);
                  return (
                    <div key={s.id}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[10px] font-semibold text-slate-600 dark:text-[#c8ccdf] truncate">{s.label}</p>
                        <span className={`text-[10px] font-bold ml-2 shrink-0 ${pct === 100 ? 'text-emerald-500' : pct > 50 ? 'text-blue-500' : 'text-amber-500'}`}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-emerald-400' : 'bg-blue-500'}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
