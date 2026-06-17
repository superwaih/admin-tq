'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, ChevronRight, ChevronLeft, CheckCircle2, Circle,
  AlertTriangle, Clock, ArrowRight, Save, Eye, Plus, Trash2,
  FileText, Users, Briefcase, Heart, Trophy, HelpCircle,
  Lightbulb, Target, Star, TrendingUp, BarChart3, Edit3,
  BookOpen, MessageSquare, Zap, Info, ChevronDown, ChevronUp,
  Download, Send, RotateCcw, Check, AlertCircle, X,
  Bot, ArrowUpRight, Activity, Brain, GraduationCap,
  Lock, Calendar, Wand2,
} from 'lucide-react';

// ── Constants ────────────────────────────────────────────────────────────────

const STUDENT_NAME  = 'Amina';
const UNIVERSITY    = 'University of Toronto';
const PROGRAM       = 'Health Sciences';
const DEADLINE      = '2025-06-01';
const DAYS_LEFT     = 7;

const SECTIONS = [
  { id: 'personal',        label: 'Personal Statement',         icon: FileText,   total: 650, filled: 420, required: true  },
  { id: 'extracurricular', label: 'Extracurricular Activities', icon: Users,      total: 5,   filled: 3,   required: true  },
  { id: 'work',            label: 'Work Experience',            icon: Briefcase,  total: 3,   filled: 1,   required: false },
  { id: 'volunteer',       label: 'Volunteer & Community',      icon: Heart,      total: 4,   filled: 2,   required: true  },
  { id: 'awards',          label: 'Awards & Achievements',      icon: Trophy,     total: 5,   filled: 1,   required: false },
  { id: 'questions',       label: 'Program Questions',          icon: HelpCircle, total: 3,   filled: 1,   required: true  },
] as const;
type SectionId = typeof SECTIONS[number]['id'];

function SectionPct(s: typeof SECTIONS[number]) {
  return Math.round((s.filled / s.total) * 100);
}

// ── AI Insights data ─────────────────────────────────────────────────────────

type ImpactLevel = 'High Impact' | 'Medium Impact' | 'Low Impact';

interface Insight {
  icon: React.ElementType; iconColor: string; iconBg: string;
  title: string; desc: string; impact: ImpactLevel; tab: string;
}

const INSIGHTS: Insight[] = [
  { icon: TrendingUp,  iconColor:'text-cyan-600',   iconBg:'bg-cyan-50 dark:bg-cyan-500/15',    title:'Improve your AIF Score',           desc:'Focus on activities and essays to improve your overall AIF score.',              impact:'High Impact',   tab:'Top Priorities'   },
  { icon: Users,       iconColor:'text-violet-600', iconBg:'bg-violet-50 dark:bg-violet-500/15', title:'Strengthen your Leadership Profile', desc:'Add one more leadership experience to stand out.',                             impact:'Medium Impact', tab:'Top Priorities'   },
  { icon: Edit3,       iconColor:'text-amber-600',  iconBg:'bg-amber-50 dark:bg-amber-500/15',   title:'Enhance Essay Quality',             desc:'Your essays are good but need more depth and personal stories.',                impact:'Medium Impact', tab:'Top Priorities'   },
  { icon: Zap,         iconColor:'text-pink-600',   iconBg:'bg-pink-50 dark:bg-pink-500/15',     title:'Practice MMI Scenarios',            desc:'You have 3 MMI scenarios left. Practice more to build confidence.',             impact:'High Impact',   tab:'Top Priorities'   },
  { icon: BookOpen,    iconColor:'text-blue-600',   iconBg:'bg-blue-50 dark:bg-blue-500/15',     title:'Research Program Fits',             desc:'Review program requirements and sign your profile.',                           impact:'Low Impact',    tab:'Top Priorities'   },
  { icon: Brain,       iconColor:'text-emerald-600',iconBg:'bg-emerald-50 dark:bg-emerald-500/15',title:'Boost Academic Standing',          desc:'Bring your Calc and Bio grades to 90+ to meet UofT competitive threshold.',    impact:'High Impact',   tab:'Academic'         },
  { icon: Star,        iconColor:'text-amber-600',  iconBg:'bg-amber-50 dark:bg-amber-500/15',   title:'Highlight Research Experience',    desc:'Mention your lab shadowing in the Personal Statement for academic depth.',      impact:'Medium Impact', tab:'Academic'         },
  { icon: FileText,    iconColor:'text-blue-600',   iconBg:'bg-blue-50 dark:bg-blue-500/15',     title:'Complete Personal Statement',       desc:'650-word limit — you\'re at 420 words. Add a forward-looking conclusion.',      impact:'High Impact',   tab:'Essays'           },
  { icon: CheckCircle2,iconColor:'text-emerald-600',iconBg:'bg-emerald-50 dark:bg-emerald-500/15',title:'Proofread Q1 Answer',             desc:'Run a grammar pass on your "Why UofT" answer before submission.',              impact:'Medium Impact', tab:'Essays'           },
  { icon: Activity,    iconColor:'text-violet-600', iconBg:'bg-violet-50 dark:bg-violet-500/15', title:'Complete 3 More MMI Scenarios',    desc:'Target empathy, communication, and ethics stations this week.',                impact:'High Impact',   tab:'MMI'              },
  { icon: Heart,       iconColor:'text-pink-600',   iconBg:'bg-pink-50 dark:bg-pink-500/15',     title:'Add 2 More Volunteer Entries',     desc:'Sustained commitment in clinical settings is a strong differentiator.',        impact:'High Impact',   tab:'Profile Building' },
  { icon: Trophy,      iconColor:'text-amber-600',  iconBg:'bg-amber-50 dark:bg-amber-500/15',   title:'List Governor General\'s Medal',  desc:'Academic awards carry significant weight — make sure it\'s prominently listed.',impact:'Medium Impact', tab:'Profile Building' },
];

const IMPACT_CLS: Record<ImpactLevel, string> = {
  'High Impact':   'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',
  'Medium Impact': 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
  'Low Impact':    'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400',
};

const INSIGHT_TABS = ['Top Priorities', 'Academic', 'Essays', 'MMI', 'Profile Building'];

// ── Activity feed ─────────────────────────────────────────────────────────────

const RECENT_ACTIVITY = [
  { icon: Sparkles, iconBg:'bg-cyan-50 dark:bg-cyan-500/15',    iconColor:'text-cyan-600',   title:'Profile Analyzed',      desc:'Your profile was analyzed by AIF Coach',     time:'2 hours ago' },
  { icon: Star,     iconBg:'bg-violet-50 dark:bg-violet-500/15',iconColor:'text-violet-600', title:'New Recommendation',    desc:'Add one leadership activity to your profile', time:'5 hours ago' },
  { icon: FileText, iconBg:'bg-blue-50 dark:bg-blue-500/15',    iconColor:'text-blue-600',   title:'Essay Feedback',        desc:'Essay on leadership activity reviewed',       time:'Yesterday'   },
  { icon: Activity, iconBg:'bg-pink-50 dark:bg-pink-500/15',    iconColor:'text-pink-600',   title:'MMI Practice',          desc:'You completed a practice session',            time:'Yesterday'   },
];

// ── Chat messages ─────────────────────────────────────────────────────────────

interface ChatMsg { role: 'ai' | 'user'; text: string; }

const INITIAL_CHAT: ChatMsg[] = [
  { role: 'ai', text: `Hi ${STUDENT_NAME}! What would you like help with today?` },
];
const QUICK_PROMPTS = [
  'Improve my AIF chances',
  'Which programs are best for me?',
  'How can I improve my essays?',
];

// ── Recommended ───────────────────────────────────────────────────────────────

const RECOMMENDED = [
  { icon: BookOpen,    iconBg:'bg-cyan-50 dark:bg-cyan-500/15',    iconColor:'text-cyan-600',   title:'Personalized Study Plan', desc:'Get a tailored plan to improve your profile'    },
  { icon: GraduationCap,iconBg:'bg-violet-50 dark:bg-violet-500/15',iconColor:'text-violet-600',title:'Top Programs for You',     desc:'12 programs match your profile'                },
  { icon: FileText,    iconBg:'bg-blue-50 dark:bg-blue-500/15',    iconColor:'text-blue-600',   title:'Essays Feedback',         desc:'Get AI feedback on your essays'                 },
  { icon: Activity,    iconBg:'bg-pink-50 dark:bg-pink-500/15',    iconColor:'text-pink-600',   title:'MMI Practice',            desc:'Continue your MMI preparation'                  },
];

const PROGRESS_BARS = [
  { label: 'AIF Score',       value: 8.6, max: 10, color: 'bg-cyan-500'    },
  { label: 'Essays',          value: 8.2, max: 10, color: 'bg-blue-500'    },
  { label: 'MMI Practice',    value: 7.9, max: 10, color: 'bg-violet-500'  },
  { label: 'Profile Building',value: 7.6, max: 10, color: 'bg-amber-400'   },
];

// ── AIF Form data ─────────────────────────────────────────────────────────────

const AI_TIPS: Record<SectionId, { title: string; tips: string[] }> = {
  personal:        { title: 'Personal Statement Tips',     tips: ['Open with a vivid, specific moment — not a generic passion statement.','Connect past experiences directly to your future goals in Health Sciences.','Mention 2–3 concrete accomplishments with measurable impact.','End with a forward-looking statement about UofT.','Avoid clichés like "ever since I was young".'] },
  extracurricular: { title: 'Extracurricular Tips',        tips: ['List activities in order of significance, not chronological order.','Quantify your involvement: hours/week, members led, events organized.','Highlight leadership growth — promoted from member to executive.','Focus on depth over breadth.'] },
  work:            { title: 'Work Experience Tips',        tips: ['Include paid, unpaid, and co-op positions.','Focus on transferable skills: communication, teamwork, problem-solving.','Mention any healthcare-adjacent roles prominently.','Use action verbs: managed, coordinated, developed.'] },
  volunteer:       { title: 'Volunteer & Community Tips',  tips: ['Emphasize sustained commitment — ongoing roles show dedication.','Hospital or clinical volunteering is especially relevant.','Include cultural or community initiatives.','Describe impact, not just tasks.'] },
  awards:          { title: 'Awards & Achievements Tips',  tips: ['Include academic and non-academic awards.','Provide context: out of how many applicants was this awarded?','Regional or national recognition should be prominently placed.','Include scholarships, bursaries, or merit-based recognitions.'] },
  questions:       { title: 'Program Question Tips',       tips: ['Answer what is asked, not what you wish was asked.','Be specific to UofT and Health Sciences.','Reference specific courses, labs, or faculty.','Proofread carefully.'] },
};

const WRITING_CHECKLIST: Record<SectionId, { item: string; done: boolean }[]> = {
  personal:        [{ item:'Opens with a compelling hook', done:true},{ item:'Mentions 2+ specific experiences', done:true},{ item:'Connects experience to program goals', done:false},{ item:'Within 650 word limit', done:true},{ item:'Proofread for grammar', done:false}],
  extracurricular: [{ item:'At least 3 activities listed', done:true},{ item:'Each entry has hours/week', done:false},{ item:'Listed in order of importance', done:true},{ item:'Descriptions use action verbs', done:false}],
  work:            [{ item:'Employer name & dates included', done:true},{ item:'Responsibilities described', done:false},{ item:'Transferable skills highlighted', done:false}],
  volunteer:       [{ item:'At least 2 ongoing roles listed', done:true},{ item:'Impact described, not just tasks', done:false},{ item:'Healthcare-relevant roles noted', done:true}],
  awards:          [{ item:'Academic awards included', done:true},{ item:'Context provided for each award', done:false},{ item:'Listed in order of prestige', done:false}],
  questions:       [{ item:'Answers are program-specific', done:false},{ item:'UofT resources mentioned', done:false},{ item:'Within word limits', done:true},{ item:'Proofread', done:false}],
};

const PERSONAL_STATEMENT_DEFAULT = `My first encounter with the complexity of human health was not in a textbook, but at my grandmother's bedside. Watching the healthcare team coordinate her care — bridging medicine, communication, and compassion — sparked a curiosity that has driven every decision since.

Over the past four years, I have explored this curiosity through diverse lenses. As a volunteer at St. Michael's Hospital, I spent over 200 hours in the geriatric ward, assisting nurses and speaking with patients who often felt overlooked by the system. I learned that healing is not only clinical — it is deeply relational. These interactions shaped my belief that effective health advocacy requires both scientific rigour and genuine human empathy.

Academically, I have pursued this dual commitment through my coursework in biology and psychology, achieving a 94% average while leading my school's Health Awareness Club to double its membership. Under my leadership, we organized three community wellness fairs reaching over 400 students.`;

interface Activity2 { id: number; role: string; organization: string; startDate: string; endDate: string; hoursPerWeek: string; description: string; }
interface Award { id: number; title: string; organization: string; year: string; description: string; }

function countWords(text: string) { return text.trim().split(/\s+/).filter(Boolean).length; }

function addActivity(setter: React.Dispatch<React.SetStateAction<Activity2[]>>) {
  setter(prev => [...prev, { id: Date.now(), role:'', organization:'', startDate:'', endDate:'', hoursPerWeek:'', description:'' }]);
}
function updateActivity(setter: React.Dispatch<React.SetStateAction<Activity2[]>>, id: number, field: keyof Activity2, val: string) {
  setter(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
}
function removeActivity(setter: React.Dispatch<React.SetStateAction<Activity2[]>>, id: number) {
  setter(prev => prev.filter(a => a.id !== id));
}

function ActivityEditor({ items, setter, label }: { items: Activity2[]; setter: React.Dispatch<React.SetStateAction<Activity2[]>>; label: string }) {
  return (
    <div className="space-y-4">
      {items.map((act, idx) => (
        <div key={act.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 px-2.5 py-1 rounded-lg">Entry {idx + 1}</span>
            <button onClick={() => removeActivity(setter, act.id)} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"><Trash2 size={14}/></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {[
              { f:'role'        as const, lbl:'Role / Title',  ph:'e.g. Vice President'       },
              { f:'organization'as const, lbl:'Organization',  ph:'e.g. Health Awareness Club' },
              { f:'startDate'   as const, lbl:'Start Date',    ph:'e.g. 2022-09'              },
              { f:'endDate'     as const, lbl:'End Date',      ph:'e.g. Present'              },
              { f:'hoursPerWeek'as const, lbl:'Hrs / Week',    ph:'e.g. 5'                    },
            ].map(({f,lbl,ph}) => (
              <div key={f}>
                <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">{lbl}</label>
                <input
                  value={act[f] as string}
                  onChange={e => updateActivity(setter, act.id, f, e.target.value)}
                  placeholder={ph}
                  className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Description</label>
            <textarea
              value={act.description}
              onChange={e => updateActivity(setter, act.id, 'description', e.target.value)}
              placeholder="Describe your role, responsibilities, and impact..."
              rows={3}
              className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"
            />
            <div className="flex justify-end mt-1">
              <span className={`text-[10px] font-semibold ${act.description.length > 200 ? 'text-amber-500' : 'text-slate-400'}`}>{act.description.length}/250</span>
            </div>
          </div>
        </div>
      ))}
      <button onClick={() => addActivity(setter)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-cyan-200 dark:border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-xs font-semibold hover:bg-cyan-50 dark:hover:bg-cyan-500/5 transition-all">
        <Plus size={15}/> Add {label}
      </button>
    </div>
  );
}

// ── Personalized Study Plan Modal ────────────────────────────────────────────

function StudyPlanModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated]   = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  if (!open) return null;

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1800);
  }

  const WEEKLY_SCHEDULE = [
    { day: 'Mon', task: 'Complete Personal Statement draft — add 200 more words', tag: 'Essays',    color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'   },
    { day: 'Tue', task: 'Add 2nd extracurricular activity entry with hours/week',  tag: 'Profile',  color: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300' },
    { day: 'Wed', task: 'Practice 1 MMI scenario — ethics station',                tag: 'MMI',      color: 'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300'   },
    { day: 'Thu', task: 'Answer Program Question 2 (300-word limit)',               tag: 'Essays',   color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'   },
    { day: 'Fri', task: 'Research 3 high-fit programs and bookmark them',           tag: 'Programs', color: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'   },
    { day: 'Sat', task: 'Proofread Personal Statement and run grammar check',       tag: 'Essays',   color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300'   },
    { day: 'Sun', task: 'Review progress + update AIF Coach with week\'s work',    tag: 'Review',   color: 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-[#2f43d4] shadow-2xl shadow-blue-900/50 animate-in zoom-in-95 duration-200">

        {/* Close */}
        <button onClick={onClose}
          className="absolute top-4 right-4 z-10 flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl backdrop-blur-sm transition-all border border-white/20">
          <X size={13}/> Close
        </button>

        <div className="p-6 sm:p-8">

          {/* Header */}
          <div className="flex items-start justify-between mb-6 pr-24">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <BookOpen size={22} className="text-white"/>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">Personalized Study Plan</h2>
                <p className="text-sm text-blue-200 mt-1">AI-generated roadmap tailored to your academic goals.</p>
              </div>
            </div>
          </div>

          {/* AI Powered badge */}
          <div className="flex justify-end -mt-14 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-violet-400/50 bg-violet-500/20 text-violet-200 text-xs font-semibold">
              <Wand2 size={11}/> AI Powered
            </span>
          </div>

          {/* Main white card */}
          <div className="bg-white dark:bg-[#1e2335] rounded-2xl overflow-hidden shadow-xl mb-4">

            {/* Progress section */}
            <div className="p-5 border-b border-gray-100 dark:border-white/8">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-slate-900 dark:text-white mb-3">
                    Improve AIF Score to{' '}
                    <span className="text-blue-600 dark:text-blue-400">75%</span>
                  </p>
                  {/* Progress bar */}
                  <div className="relative mb-2">
                    <div className="h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '70%' }}/>
                    </div>
                    {/* Thumb indicator */}
                    <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-600 rounded-full shadow-md" style={{ left: 'calc(70% - 10px)' }}/>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-blue-500 dark:text-blue-400 font-medium">70% progress</span>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-600 dark:text-slate-300">85%</p>
                      <p className="text-[9px] text-slate-400">target</p>
                    </div>
                  </div>
                </div>

                {/* Completion ring */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="relative w-20 h-20">
                    <svg width="80" height="80" className="-rotate-90">
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#E5E7EB" strokeWidth="7" className="dark:stroke-white/10"/>
                      <circle cx="40" cy="40" r="32" fill="none" stroke="#2563EB" strokeWidth="7"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.68)}`}
                        strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-black text-slate-900 dark:text-white">68%</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Completion</span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 divide-x divide-gray-100 dark:divide-white/8">
              <div className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center shrink-0">
                  <Calendar size={16} className="text-violet-600 dark:text-violet-400"/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Weekly Tasks</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">4 remaining</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                  <Clock size={16} className="text-emerald-600 dark:text-emerald-400"/>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Estimated Completion</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">2 weeks</p>
                </div>
              </div>
            </div>

            {/* AI suggestion */}
            <div className="mx-4 mb-4 mt-1 bg-blue-50 dark:bg-blue-500/10 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={13} className="text-white"/>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white">AI suggests focusing on essay quality</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">this week to maximize your score.</p>
              </div>
              <span className="text-3xl shrink-0 select-none" role="img" aria-label="robot">🤖</span>
            </div>
          </div>

          {/* Weekly schedule (expandable) */}
          {scheduleOpen && (
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl p-4 mb-4">
              <p className="text-xs font-bold text-blue-100 uppercase tracking-wider mb-3">Weekly Schedule</p>
              <div className="space-y-2">
                {WEEKLY_SCHEDULE.map((s, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[10px] font-black text-blue-300 w-7 shrink-0 mt-0.5">{s.day}</span>
                    <p className="flex-1 text-xs text-white/90 leading-relaxed">{s.task}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${s.color}`}>{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all mb-3 disabled:opacity-60">
            {generating
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"/><span>Generating...</span></>
              : <><Wand2 size={15}/><span>{generated ? 'Plan Generated!' : 'Generate My Plan'}</span>{generated && <Check size={14} className="text-emerald-300"/>}</>
            }
          </button>

          {/* Preview Weekly Schedule button */}
          <button
            onClick={() => setScheduleOpen(v => !v)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white hover:bg-blue-50 text-blue-600 font-semibold text-sm transition-all shadow-lg shadow-blue-900/20 mb-5">
            <Calendar size={15}/>
            {scheduleOpen ? 'Hide Weekly Schedule' : 'Preview Weekly Schedule'}
          </button>

          {/* Footer */}
          <div className="flex items-center justify-center gap-2 text-blue-200 text-xs">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <Lock size={12} className="text-blue-200"/>
            </div>
            <span>Your plan is private and secured</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ pct, size = 40, stroke = 3.5, color = '#0891b2' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke * 2) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} className="dark:stroke-white/10"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={c - (pct/100)*c} strokeLinecap="round" className="transition-all duration-500"/>
    </svg>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AifCoachPage() {
  const [activeSection, setActiveSection]   = useState<SectionId>('personal');
  const [personalText, setPersonalText]     = useState(PERSONAL_STATEMENT_DEFAULT);
  const [activities, setActivities]         = useState<Activity2[]>([
    { id:1, role:'Vice President',    organization:'Health Awareness Club',  startDate:'2022-09', endDate:'Present', hoursPerWeek:'5',  description:'Led a team of 12 executives to organize community wellness fairs, doubling club membership to 80+ students.' },
    { id:2, role:'Volunteer',         organization:"St. Michael's Hospital", startDate:'2021-06', endDate:'Present', hoursPerWeek:'4',  description:'Assisted nursing staff in the geriatric ward, providing companionship and basic patient support for 200+ hours.' },
    { id:3, role:'Team Captain',      organization:'School Volleyball Team', startDate:'2021-09', endDate:'2023-06', hoursPerWeek:'6',  description:'Captained the varsity volleyball team for two seasons, leading the team to regional finals.' },
  ]);
  const [work, setWork]                     = useState<Activity2[]>([
    { id:1, role:'Pharmacy Assistant', organization:'Shoppers Drug Mart',    startDate:'2023-06', endDate:'2024-08', hoursPerWeek:'15', description:'Assisted pharmacists with prescription intake, patient counselling, and inventory management.' },
  ]);
  const [volunteer, setVolunteer]           = useState<Activity2[]>([
    { id:1, role:'Tutor',     organization:'Ridgemont Learning Centre', startDate:'2022-01', endDate:'Present', hoursPerWeek:'3', description:'Tutored Grade 9–10 students in math and science, improving average grades by 15%.' },
    { id:2, role:'Volunteer', organization:'Food Bank of Ottawa',       startDate:'2021-09', endDate:'2022-06', hoursPerWeek:'4', description:'Sorted and distributed food packages to over 300 families per month during the pandemic.' },
  ]);
  const [awards, setAwards]                 = useState<Award[]>([
    { id:1, title:"Governor General's Academic Medal", organization:'Ridgemont High School', year:'2025', description:'Awarded to the student with the highest academic standing graduating from secondary school.' },
  ]);
  const [programQs, setProgramQs]           = useState([
    { id:1, question:"Why do you want to study Health Sciences at the University of Toronto specifically?", answer:"The University of Toronto's Health Sciences program uniquely bridges the gap between foundational life sciences and applied health policy — an intersection I am deeply passionate about.", limit:350 },
    { id:2, question:'Describe a challenge you have overcome and what you learned from it.', answer:'', limit:300 },
    { id:3, question:'How has your background prepared you for a career in the health sector?', answer:'', limit:350 },
  ]);

  const [insightTab, setInsightTab]         = useState('Top Priorities');
  const [chatInput, setChatInput]           = useState('');
  const [chatMsgs, setChatMsgs]             = useState<ChatMsg[]>(INITIAL_CHAT);
  const [formMode, setFormMode]             = useState(false);
  const [studyPlanOpen, setStudyPlanOpen]   = useState(false);
  const [aiExpanded, setAiExpanded]         = useState(true);
  const [checklistExpanded, setChecklistExpanded] = useState(true);
  const [savedBanner, setSavedBanner]       = useState(false);

  const overallPct  = Math.round(SECTIONS.reduce((acc, s) => acc + SectionPct(s), 0) / SECTIONS.length);
  const section     = SECTIONS.find(s => s.id === activeSection)!;
  const sectionIdx  = SECTIONS.findIndex(s => s.id === activeSection);
  const SectionIcon = section.icon;
  const wordCount   = countWords(personalText);
  const wordLimit   = 650;

  const filteredInsights = insightTab === 'Top Priorities'
    ? INSIGHTS.filter(i => i.tab === 'Top Priorities')
    : INSIGHTS.filter(i => i.tab === insightTab);

  function handleSave() { setSavedBanner(true); setTimeout(() => setSavedBanner(false), 2500); }

  function sendChat(text: string) {
    if (!text.trim()) return;
    setChatMsgs(prev => [...prev,
      { role:'user', text },
      { role:'ai',   text:'Great question! Based on your profile, I recommend focusing on your ' + (text.toLowerCase().includes('essay') ? 'Personal Statement depth and specificity' : text.toLowerCase().includes('program') ? 'top 3 matches: UofT Health Sciences, McMaster LifeSci, and Queen\u2019s Health' : 'AIF score by strengthening your leadership and essay sections') + '. Want a detailed action plan?' },
    ]);
    setChatInput('');
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">

      {/* ── Study Plan Modal ── */}
      <StudyPlanModal open={studyPlanOpen} onClose={() => setStudyPlanOpen(false)}/>

      {/* ── Save banner ── */}
      {savedBanner && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg animate-in slide-in-from-top-2">
          <Check size={13}/> Saved successfully!
        </div>
      )}

      <div className="max-w-[1380px] mx-auto space-y-5">

        {/* ── Back + Header ─────────────────────────────── */}
        <div>
          <Link href="/student" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to Dashboard
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">AIF Coach</h1>
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 uppercase tracking-wider">BETA</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-all">
                <HelpCircle size={13}/> How AIF Coach works
              </button>
              <button onClick={() => setFormMode(v => !v)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all">
                {formMode ? <><Eye size={13}/> Dashboard</> : <><Edit3 size={13}/> Open Form Editor</>}
              </button>
            </div>
          </div>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Your AI-powered academic and admission strategy coach.</p>
        </div>

        {/* ── Deadline urgency banner ── */}
        <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/25 rounded-2xl px-4 py-3">
          <AlertTriangle size={15} className="text-amber-500 shrink-0"/>
          <p className="text-xs text-amber-700 dark:text-amber-400 flex-1">
            <span className="font-bold">2 required sections still need attention</span> — Program Questions and Extracurricular descriptions are incomplete. Complete them before {DEADLINE}.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/15 border border-red-100 dark:border-red-500/20 rounded-lg px-2.5 py-1">
              <Clock size={11} className="text-red-500"/>
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400">{DAYS_LEFT} days left</span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════
            FORM EDITOR MODE
        ══════════════════════════════════════════════════ */}
        {formMode && (
          <div className="flex gap-5 items-start">
            {/* Left section nav */}
            <aside className="hidden lg:flex flex-col w-60 xl:w-64 shrink-0 gap-2">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest px-1 mb-1">Sections</p>
              {SECTIONS.map(s => {
                const Icon = s.icon, pct = SectionPct(s), done = pct === 100, isActive = s.id === activeSection;
                return (
                  <button key={s.id} onClick={() => setActiveSection(s.id)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all ${
                      isActive ? 'bg-cyan-600 text-white shadow-md shadow-cyan-200 dark:shadow-cyan-900/30'
                      : 'bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isActive ? 'bg-white/20' : 'bg-gray-50 dark:bg-white/[0.04]'}`}>
                      {done ? <CheckCircle2 size={14} className={isActive ? 'text-white' : 'text-emerald-500'}/> : <Icon size={14} className={isActive ? 'text-white' : 'text-slate-400'}/>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] font-semibold truncate ${isActive ? 'text-white' : ''}`}>{s.label}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <div className={`flex-1 h-1 rounded-full ${isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-white/8'}`}>
                          <div className={`h-full rounded-full transition-all ${isActive ? 'bg-white' : pct === 100 ? 'bg-emerald-400' : 'bg-cyan-400'}`} style={{ width:`${pct}%` }}/>
                        </div>
                        <span className={`text-[9px] font-bold shrink-0 ${isActive ? 'text-cyan-100' : 'text-slate-400'}`}>{pct}%</span>
                      </div>
                    </div>
                    {s.required && !done && <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md shrink-0 ${isActive ? 'bg-white/20 text-white' : 'bg-red-50 dark:bg-red-500/10 text-red-500'}`}>Req</span>}
                  </button>
                );
              })}
              <div className="mt-3 space-y-2">
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-600 dark:text-[#8e92ad] text-xs font-semibold hover:bg-gray-50 transition-colors">
                  <Download size={13}/> Export Draft
                </button>
                <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm">
                  <Send size={13}/> Submit AIF
                </button>
              </div>
            </aside>

            {/* Centre: Editor */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Mobile section tabs */}
              <div className="lg:hidden flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                {SECTIONS.map(s => {
                  const Icon = s.icon, pct = SectionPct(s);
                  return (
                    <button key={s.id} onClick={() => setActiveSection(s.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl whitespace-nowrap text-[11px] font-semibold shrink-0 transition-all ${
                        s.id === activeSection ? 'bg-cyan-600 text-white' : 'bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 text-slate-600 dark:text-[#8e92ad]'
                      }`}>
                      <Icon size={12}/> {s.label.split(' ')[0]}
                      {pct === 100 && <CheckCircle2 size={11} className={s.id === activeSection ? 'text-white' : 'text-emerald-500'}/>}
                    </button>
                  );
                })}
              </div>

              {/* Section header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-600 flex items-center justify-center shrink-0"><SectionIcon size={16} className="text-white"/></div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white">{section.label}</h2>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{section.required ? '● Required section' : '○ Optional section'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={sectionIdx === 0} onClick={() => setActiveSection(SECTIONS[sectionIdx-1].id)} className="p-2 rounded-lg border border-gray-100 dark:border-white/6 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"><ChevronLeft size={14}/></button>
                  <button disabled={sectionIdx === SECTIONS.length-1} onClick={() => setActiveSection(SECTIONS[sectionIdx+1].id)} className="p-2 rounded-lg border border-gray-100 dark:border-white/6 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-600 disabled:opacity-30 transition-colors"><ChevronRight size={14}/></button>
                </div>
              </div>

              {/* Personal Statement */}
              {activeSection === 'personal' && (
                <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Write Your Personal Statement</h3>
                      <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Introduce yourself and explain why you are applying to Health Sciences.</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 px-3 py-1.5 rounded-lg transition-colors hover:bg-cyan-100">
                      <Sparkles size={11}/> AI Rewrite
                    </button>
                  </div>
                  <textarea value={personalText} onChange={e => setPersonalText(e.target.value)} rows={14}
                    className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-[#c8ccdf] leading-relaxed outline-none focus:ring-2 focus:ring-cyan-500/15 focus:border-cyan-400/40 transition-all resize-none"
                    placeholder="Begin writing your personal statement here…"/>
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold ${wordCount > wordLimit ? 'text-red-500' : wordCount > wordLimit*0.9 ? 'text-amber-500' : 'text-slate-400'}`}>{wordCount} / {wordLimit} words</span>
                      <div className="w-32 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${wordCount > wordLimit ? 'bg-red-500' : wordCount > wordLimit*0.9 ? 'bg-amber-400' : 'bg-cyan-500'}`} style={{ width:`${Math.min((wordCount/wordLimit)*100,100)}%` }}/>
                      </div>
                    </div>
                    <button onClick={() => setPersonalText('')} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors"><RotateCcw size={10}/> Clear</button>
                  </div>
                </div>
              )}
              {activeSection === 'extracurricular' && <ActivityEditor items={activities} setter={setActivities} label="Activity"/>}
              {activeSection === 'work'            && <ActivityEditor items={work}       setter={setWork}       label="Work Experience"/>}
              {activeSection === 'volunteer'       && <ActivityEditor items={volunteer}  setter={setVolunteer}  label="Volunteer Role"/>}
              {activeSection === 'awards' && (
                <div className="space-y-4">
                  {awards.map((aw,idx) => (
                    <div key={aw.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-5 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 px-2.5 py-1 rounded-lg">Award {idx+1}</span>
                        <button onClick={() => setAwards(prev => prev.filter(a => a.id !== aw.id))} className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        {([{f:'title',l:'Award / Honour Title',ph:"e.g. Governor General's Medal"},{f:'organization',l:'Awarding Organization',ph:'e.g. Ridgemont High School'},{f:'year',l:'Year Received',ph:'e.g. 2025'}] as const).map(({f,l,ph}) => (
                          <div key={f}>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{l}</label>
                            <input value={aw[f as keyof Award] as string} onChange={e => setAwards(prev => prev.map(a => a.id === aw.id ? {...a,[f]:e.target.value} : a))} placeholder={ph} className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"/>
                          </div>
                        ))}
                      </div>
                      <textarea value={aw.description} onChange={e => setAwards(prev => prev.map(a => a.id === aw.id ? {...a,description:e.target.value} : a))} placeholder="Describe the award and its significance…" rows={2} className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all resize-none"/>
                    </div>
                  ))}
                  <button onClick={() => setAwards(prev => [...prev,{id:Date.now(),title:'',organization:'',year:'',description:''}])} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-dashed border-cyan-200 dark:border-cyan-500/25 text-cyan-600 dark:text-cyan-400 text-xs font-semibold hover:bg-cyan-50 transition-all">
                    <Plus size={15}/> Add Award
                  </button>
                </div>
              )}
              {activeSection === 'questions' && (
                <div className="space-y-4">
                  {programQs.map((q,idx) => (
                    <div key={q.id} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-5 shadow-sm">
                      <div className="flex items-start gap-2.5 mb-4">
                        <div className="w-6 h-6 rounded-lg bg-cyan-600 flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-bold text-white">{idx+1}</span></div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">{q.question}</p>
                      </div>
                      <textarea value={q.answer} onChange={e => setProgramQs(prev => prev.map(pq => pq.id === q.id ? {...pq,answer:e.target.value} : pq))} rows={5} placeholder="Write your response here…"
                        className="w-full px-3 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-[#c8ccdf] leading-relaxed outline-none focus:ring-2 focus:ring-cyan-500/15 transition-all resize-none"/>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-[10px] font-semibold ${countWords(q.answer) > q.limit ? 'text-red-500' : 'text-slate-400'}`}>{countWords(q.answer)} / {q.limit} words</span>
                        <button className="flex items-center gap-1 text-[10px] font-semibold text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 px-2 py-1 rounded-lg hover:bg-cyan-100 transition-colors"><Sparkles size={9}/> AI Assist</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom nav */}
              <div className="flex items-center justify-between pt-2">
                <button disabled={sectionIdx===0} onClick={() => setActiveSection(SECTIONS[sectionIdx-1].id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] text-xs font-semibold hover:bg-gray-50 disabled:opacity-30 transition-colors">
                  <ChevronLeft size={13}/> Previous
                </button>
                <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-colors">
                  <Save size={13}/> Save Section
                </button>
                {sectionIdx < SECTIONS.length-1
                  ? <button onClick={() => setActiveSection(SECTIONS[sectionIdx+1].id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-600 text-xs font-semibold hover:bg-gray-50 transition-colors">Next <ChevronRight size={13}/></button>
                  : <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"><Send size={13}/> Submit AIF</button>
                }
              </div>
            </div>

            {/* Right: AI panel */}
            <aside className="hidden xl:flex flex-col w-72 2xl:w-80 shrink-0 gap-4">
              {/* AI Tips */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
                <button onClick={() => setAiExpanded(v => !v)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-cyan-600 flex items-center justify-center"><Sparkles size={13} className="text-white"/></div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">AI Coaching Tips</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{AI_TIPS[activeSection].title}</p>
                    </div>
                  </div>
                  {aiExpanded ? <ChevronUp size={14} className="text-slate-400"/> : <ChevronDown size={14} className="text-slate-400"/>}
                </button>
                {aiExpanded && (
                  <div className="px-5 pb-5 space-y-2.5">
                    {AI_TIPS[activeSection].tips.map((tip,i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5"><Lightbulb size={10} className="text-cyan-500"/></div>
                        <p className="text-[11px] text-slate-600 dark:text-[#c8ccdf] leading-relaxed">{tip}</p>
                      </div>
                    ))}
                    <button className="w-full mt-1 flex items-center justify-center gap-1.5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-[11px] font-bold transition-colors">
                      <MessageSquare size={11}/> Ask AI Coach
                    </button>
                  </div>
                )}
              </div>
              {/* Checklist */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
                <button onClick={() => setChecklistExpanded(v => !v)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center"><CheckCircle2 size={13} className="text-white"/></div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Quality Checklist</p>
                      <p className="text-[10px] text-slate-400">{WRITING_CHECKLIST[activeSection].filter(c=>c.done).length}/{WRITING_CHECKLIST[activeSection].length} complete</p>
                    </div>
                  </div>
                  {checklistExpanded ? <ChevronUp size={14} className="text-slate-400"/> : <ChevronDown size={14} className="text-slate-400"/>}
                </button>
                {checklistExpanded && (
                  <div className="px-5 pb-5 space-y-2">
                    {WRITING_CHECKLIST[activeSection].map((c,i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        {c.done ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0"/> : <Circle size={15} className="text-slate-200 dark:text-white/15 shrink-0"/>}
                        <p className={`text-[11px] ${c.done ? 'text-slate-400 dark:text-[#8e92ad] line-through' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>{c.item}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* AIF Score */}
              <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp size={14} className="text-cyan-200"/>
                  <p className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest">AIF Strength Score</p>
                </div>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl font-black">72</span>
                  <div className="pb-1"><span className="text-sm font-bold text-cyan-200">/ 100</span><p className="text-[10px] text-cyan-300">Good — needs polish</p></div>
                </div>
                <div className="space-y-2">
                  {[{label:'Completeness',val:65},{label:'Specificity',val:78},{label:'Impact Focus',val:74},{label:'UofT Fit',val:70}].map(m => (
                    <div key={m.label} className="flex items-center gap-2">
                      <p className="text-[10px] text-cyan-200 w-24 shrink-0">{m.label}</p>
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-white rounded-full" style={{width:`${m.val}%`}}/></div>
                      <span className="text-[10px] font-bold text-cyan-100 w-6 text-right">{m.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            DASHBOARD MODE (default)
        ══════════════════════════════════════════════════ */}
        {!formMode && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* ── CENTRE (2 cols) ──────────────────────── */}
            <div className="xl:col-span-2 space-y-5">

              {/* Welcome hero card */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Robot illustration (emoji-based) */}
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-500/20 dark:to-blue-500/20 flex items-center justify-center text-5xl shrink-0 select-none">
                    🤖
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Hi {STUDENT_NAME} 👋</h2>
                    <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1 leading-relaxed max-w-lg">
                      I'm your AIF Coach. I analyze your profile, performance, and goals to give you personalized guidance and recommendations to help you get admitted to your dream program.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {[
                        { icon:'🎯', label:'Personalized Insights',    color:'text-violet-600 dark:text-violet-400', bg:'bg-violet-50 dark:bg-violet-500/10' },
                        { icon:'📈', label:'Smart Recommendations',    color:'text-cyan-600 dark:text-cyan-400',    bg:'bg-cyan-50 dark:bg-cyan-500/10'    },
                        { icon:'💡', label:'Progress Tracking',        color:'text-amber-600 dark:text-amber-400',  bg:'bg-amber-50 dark:bg-amber-500/10'  },
                      ].map(f => (
                        <span key={f.label} className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${f.bg} ${f.color}`}>
                          <span>{f.icon}</span>{f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Snapshot */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Your Profile Snapshot</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {[
                    { label:'Total Request',        value:'68.8%', sub:'+4pp this week',   icon:'📊', color:'text-cyan-600 dark:text-cyan-400',    bg:'bg-cyan-50 dark:bg-cyan-500/15'    },
                    { label:'Academic Strengths',   value:'3',     sub:'Strong',            icon:'🧠', color:'text-violet-600 dark:text-violet-400',bg:'bg-violet-50 dark:bg-violet-500/15'},
                    { label:'Areas to Improve',     value:'2',     sub:'Focus areas',       icon:'🎯', color:'text-amber-600 dark:text-amber-400',  bg:'bg-amber-50 dark:bg-amber-500/15'  },
                    { label:'Program Matches',      value:'12',    sub:'High fit programs', icon:'🏫', color:'text-emerald-600 dark:text-emerald-400',bg:'bg-emerald-50 dark:bg-emerald-500/15'},
                    { label:'Recommended Actions',  value:'5',     sub:'Pending tasks',     icon:'⚡', color:'text-red-600 dark:text-red-400',      bg:'bg-red-50 dark:bg-red-500/15'      },
                  ].map(s => (
                    <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 text-center">
                      <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-2 text-base`}>{s.icon}</div>
                      <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[9px] font-bold text-slate-500 dark:text-[#8e92ad] mt-0.5 leading-tight">{s.label}</p>
                      <p className="text-[8px] text-slate-400 dark:text-[#5a5f78] mt-0.5">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Insights & Recommendations */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={15} className="text-cyan-600"/>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">AI Insights & Recommendations</h3>
                  </div>
                  <Link href="/student/aif-insights" className="flex items-center gap-1 text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 transition-colors">
                    View All <ArrowUpRight size={12}/>
                  </Link>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none mb-4">
                  {INSIGHT_TABS.map(tab => (
                    <button key={tab} onClick={() => setInsightTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                        insightTab === tab
                          ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400 bg-transparent rounded-none pb-1.5'
                          : 'text-slate-500 dark:text-[#8e92ad] hover:text-slate-700'
                      }`}>{tab}</button>
                  ))}
                </div>

                {/* Insights table */}
                <div className="space-y-2">
                  {filteredInsights.map((insight, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-white/3 transition-colors">
                      <div className={`w-8 h-8 rounded-xl ${insight.iconBg} flex items-center justify-center shrink-0`}>
                        <insight.icon size={14} className={insight.iconColor}/>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white">{insight.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{insight.desc}</p>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${IMPACT_CLS[insight.impact]}`}>{insight.impact}</span>
                      <button onClick={() => setFormMode(true)} className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0">
                        View plan
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity feed */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Recent Activity</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {RECENT_ACTIVITY.map((a, i) => (
                    <div key={i} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
                      <div className={`w-8 h-8 rounded-xl ${a.iconBg} flex items-center justify-center mb-2`}>
                        <a.icon size={14} className={a.iconColor}/>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{a.title}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed">{a.desc}</p>
                      <p className="text-[8px] font-semibold text-slate-300 dark:text-[#5a5f78] mt-1.5">{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT SIDEBAR ────────────────────────── */}
            <div className="space-y-5">

              {/* Coach Chat */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-sm">🤖</div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white">Coach Chat</h3>
                  </div>
                  <button onClick={() => setChatMsgs(INITIAL_CHAT)} className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors">New Chat</button>
                </div>

                {/* Messages */}
                <div className="px-4 py-3 space-y-2 max-h-52 overflow-y-auto">
                  {chatMsgs.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {m.role === 'ai' && (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs shrink-0 mr-2 mt-0.5">🤖</div>
                      )}
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                        m.role === 'ai'
                          ? 'bg-slate-100 dark:bg-white/8 text-slate-700 dark:text-slate-200'
                          : 'bg-cyan-600 text-white'
                      }`}>{m.text}</div>
                    </div>
                  ))}
                </div>

                {/* Quick prompts */}
                {chatMsgs.length <= 2 && (
                  <div className="px-4 pb-3 space-y-1.5">
                    {QUICK_PROMPTS.map(p => (
                      <button key={p} onClick={() => sendChat(p)}
                        className="w-full text-left text-[10px] font-medium px-3 py-2 rounded-lg bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-400 border border-gray-100 dark:border-white/6 transition-all">
                        {p}
                      </button>
                    ))}
                  </div>
                )}

                {/* Input */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-xl px-3 py-2">
                    <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') sendChat(chatInput); }}
                      placeholder="Type your question here..." className="flex-1 text-xs bg-transparent text-slate-700 dark:text-white placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none"/>
                    <button onClick={() => sendChat(chatInput)} className="w-6 h-6 rounded-lg bg-cyan-600 hover:bg-cyan-700 flex items-center justify-center transition-colors shrink-0">
                      <Send size={10} className="text-white"/>
                    </button>
                  </div>
                </div>
              </div>

              {/* Recommended for You */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-3">RECOMMENDED FOR YOU</h3>
                <div className="space-y-1">
                  {RECOMMENDED.map((r, i) => {
                    const inner = (
                      <>
                        <div className={`w-8 h-8 rounded-xl ${r.iconBg} flex items-center justify-center shrink-0`}>
                          <r.icon size={14} className={r.iconColor}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">{r.title}</p>
                          <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{r.desc}</p>
                        </div>
                        <ChevronRight size={12} className="text-slate-300 dark:text-[#5a5f78] group-hover:text-cyan-500 transition-colors shrink-0"/>
                      </>
                    );
                    const cls = "w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all group text-left";
                    if (r.title === 'Top Programs for You')
                      return <Link key={i} href="/student/top-programs" className={cls}>{inner}</Link>;
                    if (r.title === 'Essays Feedback')
                      return <Link key={i} href="/student/essay" className={cls}>{inner}</Link>;
                    if (r.title === 'MMI Practice')
                      return <Link key={i} href="/student/mmi" className={cls}>{inner}</Link>;
                    return (
                      <button key={i} onClick={() => { if (r.title === 'Personalized Study Plan') setStudyPlanOpen(true); }} className={cls}>
                        {inner}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Progress Overview */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Your Progress Overview</h3>
                  <button onClick={() => setFormMode(true)} className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors">View Full Progress</button>
                </div>
                <div className="space-y-3">
                  {PROGRESS_BARS.map(b => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600 dark:text-slate-300">{b.label}</span>
                        <span className="text-xs font-bold text-slate-800 dark:text-white">{b.value}/{b.max}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.color} transition-all`} style={{ width:`${(b.value/b.max)*100}%` }}/>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Overall ring */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                  <ProgressRing pct={overallPct} size={44} stroke={4} color="#0891b2"/>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{overallPct}% Complete</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">AIF Form · {SECTIONS.filter(s=>SectionPct(s)===100).length}/{SECTIONS.length} sections done</p>
                  </div>
                  <button onClick={() => setFormMode(true)} className="ml-auto text-[10px] font-bold text-white bg-cyan-600 hover:bg-cyan-700 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap">
                    Edit Form
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
