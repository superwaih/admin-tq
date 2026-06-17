'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles, ChevronLeft, TrendingUp, Users, Edit3, Zap,
  BookOpen, Brain, Star, FileText, CheckCircle2, Heart,
  Trophy, Activity, ArrowUpRight, Download, ChevronDown,
  ChevronRight, Filter, X, Clock, Target,
  CheckSquare, Square, PlayCircle,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ImpactLevel = 'High Impact' | 'Medium Impact' | 'Low Impact';
type InsightCategory = 'Top Priorities' | 'Academics' | 'Essays' | 'MMI' | 'Profile Building';

interface ActionStep {
  id: number;
  label: string;
  detail: string;
  tag: string;
  tagColor: string;
}

interface Insight {
  id: number;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  desc: string;
  impact: ImpactLevel;
  category: InsightCategory;
  hasActionPlan: boolean;
  timeEst: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  steps: ActionStep[];
}

// ── Action plan step templates by category ────────────────────────────────────

const STEPS_BY_CATEGORY: Record<InsightCategory, ActionStep[]> = {
  'Top Priorities': [
    { id:1, label:'Review your current AIF score breakdown',      detail:'Check each section score in the dashboard.',         tag:'Review',   tagColor:'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' },
    { id:2, label:'Identify your 2 lowest-scoring sections',      detail:'Focus effort where you have the most room to grow.', tag:'Analysis', tagColor:'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' },
    { id:3, label:'Set a weekly improvement goal',                detail:'Commit to adding one entry or essay per week.',       tag:'Planning', tagColor:'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300' },
    { id:4, label:'Schedule a check-in with AIF Coach',           detail:'Ask for targeted recommendations.',                  tag:'Action',   tagColor:'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
  ],
  'Academics': [
    { id:1, label:'Pull up your last 3 test grades',              detail:'Identify subjects below your target average.',       tag:'Review',   tagColor:'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' },
    { id:2, label:'Book a tutoring session for your weakest subject', detail:'Aim for at least 2 sessions before next exam.',  tag:'Action',   tagColor:'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
    { id:3, label:'Update your Grade Tracker with latest marks',  detail:'Keep your profile data accurate and up-to-date.',    tag:'Profile',  tagColor:'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300' },
    { id:4, label:'Research advanced course options for next semester', detail:'AP or IB courses signal academic rigour.',     tag:'Planning', tagColor:'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300' },
  ],
  'Essays': [
    { id:1, label:'Open your AIF form and read the prompt again', detail:'Make sure your answer directly addresses the question.', tag:'Review', tagColor:'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' },
    { id:2, label:'Write a 100-word rough draft without editing', detail:'Get ideas on paper — you can refine later.',          tag:'Draft',    tagColor:'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' },
    { id:3, label:'Add one personal story or specific example',   detail:'Concrete details make essays memorable.',             tag:'Improve',  tagColor:'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
    { id:4, label:'Run a spell-check and read it aloud',          detail:'Catch grammar errors and improve flow.',              tag:'Polish',   tagColor:'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
  ],
  'MMI': [
    { id:1, label:'Review the 5 MMI station types',               detail:'Empathy, ethics, communication, critical thinking, team.', tag:'Review', tagColor:'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' },
    { id:2, label:'Practice 1 scenario from your weakest station', detail:'Use the MMI Simulator — aim for a 7/10 score.',     tag:'Practice', tagColor:'bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300' },
    { id:3, label:'Record yourself and watch it back',            detail:'Check for filler words and body language.',           tag:'Reflect',  tagColor:'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300' },
    { id:4, label:'Complete 2 more scenarios this week',          detail:'Consistency matters more than a single long session.', tag:'Action',  tagColor:'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
  ],
  'Profile Building': [
    { id:1, label:'List your current extracurricular activities',  detail:'Review for gaps in leadership or community service.', tag:'Review',  tagColor:'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300' },
    { id:2, label:'Add a new volunteer or leadership entry',       detail:'Sustained commitment is more valuable than duration.', tag:'Add',    tagColor:'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' },
    { id:3, label:'Write a 2-sentence description for each activity', detail:'Describe your role, impact, and hours per week.', tag:'Improve', tagColor:'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300' },
    { id:4, label:'Ask AI Coach to review your profile section',   detail:'Get feedback before the submission deadline.',        tag:'Action',  tagColor:'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300' },
  ],
};

const DIFFICULTY_STYLE = {
  Easy:   'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  Medium: 'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  Hard:   'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
};

// ── Data ──────────────────────────────────────────────────────────────────────

const ALL_INSIGHTS: Insight[] = [
  { id:1,  icon:TrendingUp,   iconColor:'text-cyan-600',    iconBg:'bg-cyan-50 dark:bg-cyan-500/15',      title:'Improve your AIF Score',              desc:'Focus on activities and essays to improve your overall AIF score.',             impact:'High Impact',   category:'Top Priorities',   hasActionPlan:true,  timeEst:'2–3 hrs', difficulty:'Medium', steps:STEPS_BY_CATEGORY['Top Priorities']   },
  { id:2,  icon:Users,        iconColor:'text-violet-600',  iconBg:'bg-violet-50 dark:bg-violet-500/15',  title:'Strengthen your Leadership Profile',  desc:'Add more leadership experience to standout.',                                  impact:'Medium Impact', category:'Top Priorities',   hasActionPlan:true,  timeEst:'1–2 hrs', difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Profile Building'] },
  { id:3,  icon:Edit3,        iconColor:'text-amber-600',   iconBg:'bg-amber-50 dark:bg-amber-500/15',    title:'Enhance Essay Quality',               desc:'Your essays are good but need more depth and personal stories.',                impact:'Low Impact',    category:'Essays',           hasActionPlan:false, timeEst:'3–4 hrs', difficulty:'Hard',   steps:STEPS_BY_CATEGORY['Essays']           },
  { id:4,  icon:Zap,          iconColor:'text-pink-600',    iconBg:'bg-pink-50 dark:bg-pink-500/15',      title:'Practice MMI Scenarios',              desc:'You have 3 MMI scenarios left. Practice more to build confidence.',            impact:'High Impact',   category:'MMI',              hasActionPlan:true,  timeEst:'45 min',  difficulty:'Medium', steps:STEPS_BY_CATEGORY['MMI']              },
  { id:5,  icon:BookOpen,     iconColor:'text-blue-600',    iconBg:'bg-blue-50 dark:bg-blue-500/15',      title:'Research Program Fits',               desc:'Review program requirements and align your profile.',                          impact:'High Impact',   category:'Top Priorities',   hasActionPlan:true,  timeEst:'1–2 hrs', difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Top Priorities']   },
  { id:6,  icon:Activity,     iconColor:'text-pink-600',    iconBg:'bg-pink-50 dark:bg-pink-500/15',      title:'Practice MMI Scenarios',              desc:'You have 3 MMI scenarios left. Practice more to build confidence.',            impact:'Medium Impact', category:'MMI',              hasActionPlan:false, timeEst:'45 min',  difficulty:'Medium', steps:STEPS_BY_CATEGORY['MMI']              },
  { id:7,  icon:Users,        iconColor:'text-violet-600',  iconBg:'bg-violet-50 dark:bg-violet-500/15',  title:'Strengthen your Leadership Profile',  desc:'Add more leadership experience to standout.',                                  impact:'Low Impact',    category:'Profile Building', hasActionPlan:true,  timeEst:'1–2 hrs', difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Profile Building'] },
  { id:8,  icon:Zap,          iconColor:'text-pink-600',    iconBg:'bg-pink-50 dark:bg-pink-500/15',      title:'Practice MMI Scenarios',              desc:'You have 3 MMI scenarios left. Practice more to build confidence.',            impact:'Low Impact',    category:'MMI',              hasActionPlan:false, timeEst:'45 min',  difficulty:'Medium', steps:STEPS_BY_CATEGORY['MMI']              },
  { id:9,  icon:Edit3,        iconColor:'text-amber-600',   iconBg:'bg-amber-50 dark:bg-amber-500/15',    title:'Enhance Essay Quality',               desc:'Your essays are good but need more depth and personal stories.',                impact:'Medium Impact', category:'Essays',           hasActionPlan:true,  timeEst:'3–4 hrs', difficulty:'Hard',   steps:STEPS_BY_CATEGORY['Essays']           },
  { id:10, icon:BookOpen,     iconColor:'text-blue-600',    iconBg:'bg-blue-50 dark:bg-blue-500/15',      title:'Research Program Fits',               desc:'Review program requirements and align your profile.',                          impact:'High Impact',   category:'Top Priorities',   hasActionPlan:true,  timeEst:'1–2 hrs', difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Top Priorities']   },
  { id:11, icon:Brain,        iconColor:'text-emerald-600', iconBg:'bg-emerald-50 dark:bg-emerald-500/15',title:'Boost Academic Standing',             desc:'Bring your Calc and Bio grades to 90+ to meet UofT competitive threshold.',   impact:'High Impact',   category:'Academics',        hasActionPlan:true,  timeEst:'Ongoing', difficulty:'Hard',   steps:STEPS_BY_CATEGORY['Academics']        },
  { id:12, icon:Star,         iconColor:'text-amber-600',   iconBg:'bg-amber-50 dark:bg-amber-500/15',    title:'Highlight Research Experience',       desc:'Mention your lab shadowing in the Personal Statement for academic depth.',     impact:'Medium Impact', category:'Academics',        hasActionPlan:false, timeEst:'30 min',  difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Academics']        },
  { id:13, icon:FileText,     iconColor:'text-blue-600',    iconBg:'bg-blue-50 dark:bg-blue-500/15',      title:'Complete Personal Statement',         desc:"650-word limit — you're at 420 words. Add a forward-looking conclusion.",     impact:'High Impact',   category:'Essays',           hasActionPlan:true,  timeEst:'2–3 hrs', difficulty:'Hard',   steps:STEPS_BY_CATEGORY['Essays']           },
  { id:14, icon:CheckCircle2, iconColor:'text-emerald-600', iconBg:'bg-emerald-50 dark:bg-emerald-500/15',title:'Proofread Q1 Answer',                desc:'Run a grammar pass on your "Why UofT" answer before submission.',            impact:'Medium Impact', category:'Essays',           hasActionPlan:false, timeEst:'20 min',  difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Essays']           },
  { id:15, icon:Activity,     iconColor:'text-violet-600',  iconBg:'bg-violet-50 dark:bg-violet-500/15',  title:'Complete 3 More MMI Scenarios',       desc:'Target empathy, communication, and ethics stations this week.',               impact:'High Impact',   category:'MMI',              hasActionPlan:true,  timeEst:'2 hrs',   difficulty:'Medium', steps:STEPS_BY_CATEGORY['MMI']              },
  { id:16, icon:Heart,        iconColor:'text-pink-600',    iconBg:'bg-pink-50 dark:bg-pink-500/15',      title:'Add 2 More Volunteer Entries',        desc:'Sustained commitment in clinical settings is a strong differentiator.',       impact:'High Impact',   category:'Profile Building', hasActionPlan:true,  timeEst:'1 hr',    difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Profile Building'] },
  { id:17, icon:Trophy,       iconColor:'text-amber-600',   iconBg:'bg-amber-50 dark:bg-amber-500/15',    title:"List Governor General's Medal",       desc:"Academic awards carry significant weight — make sure it's prominently listed.",impact:'Medium Impact', category:'Profile Building', hasActionPlan:false, timeEst:'15 min',  difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Profile Building'] },
  { id:18, icon:Brain,        iconColor:'text-emerald-600', iconBg:'bg-emerald-50 dark:bg-emerald-500/15',title:'Improve Science GPA',                desc:'Focus on Chemistry and Biology to push your average above 92%.',              impact:'High Impact',   category:'Academics',        hasActionPlan:true,  timeEst:'Ongoing', difficulty:'Hard',   steps:STEPS_BY_CATEGORY['Academics']        },
  { id:19, icon:Star,         iconColor:'text-amber-600',   iconBg:'bg-amber-50 dark:bg-amber-500/15',    title:'Take Advanced Coursework',            desc:'Enroll in AP Biology or equivalent to demonstrate academic rigour.',           impact:'Medium Impact', category:'Academics',        hasActionPlan:false, timeEst:'Semester',difficulty:'Medium', steps:STEPS_BY_CATEGORY['Academics']        },
  { id:20, icon:Users,        iconColor:'text-violet-600',  iconBg:'bg-violet-50 dark:bg-violet-500/15',  title:'Join a New Club or Initiative',       desc:'Add at least one leadership-oriented extracurricular before deadline.',        impact:'Low Impact',    category:'Profile Building', hasActionPlan:true,  timeEst:'1 hr',    difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Profile Building'] },
  { id:21, icon:Edit3,        iconColor:'text-amber-600',   iconBg:'bg-amber-50 dark:bg-amber-500/15',    title:'Answer Program Question 3',           desc:'Complete your response about healthcare background (350-word limit).',         impact:'Medium Impact', category:'Essays',           hasActionPlan:true,  timeEst:'2 hrs',   difficulty:'Medium', steps:STEPS_BY_CATEGORY['Essays']           },
  { id:22, icon:BookOpen,     iconColor:'text-blue-600',    iconBg:'bg-blue-50 dark:bg-blue-500/15',      title:"Match to Queen's LifeSci Program",   desc:'Your profile scores 87% fit — worth adding to your shortlist.',               impact:'Low Impact',    category:'Top Priorities',   hasActionPlan:false, timeEst:'30 min',  difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Top Priorities']   },
  { id:23, icon:Zap,          iconColor:'text-pink-600',    iconBg:'bg-pink-50 dark:bg-pink-500/15',      title:'MMI Ethics Practice Session',         desc:'Focus on the ethical dilemma format — your weakest station type.',            impact:'High Impact',   category:'MMI',              hasActionPlan:true,  timeEst:'1 hr',    difficulty:'Medium', steps:STEPS_BY_CATEGORY['MMI']              },
  { id:24, icon:TrendingUp,   iconColor:'text-cyan-600',    iconBg:'bg-cyan-50 dark:bg-cyan-500/15',      title:'Track Weekly AIF Progress',           desc:'Set a goal to complete one AIF section per week until the deadline.',         impact:'Medium Impact', category:'Top Priorities',   hasActionPlan:false, timeEst:'15 min',  difficulty:'Easy',   steps:STEPS_BY_CATEGORY['Top Priorities']   },
];

const IMPACT_COUNTS = { 'High Impact': 48, 'Medium Impact': 36, 'Low Impact': 16 };

const IMPACT_STYLE: Record<ImpactLevel, { badge: string; dot: string; bar: string }> = {
  'High Impact':   { badge:'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',         dot:'bg-emerald-500', bar:'bg-red-500'    },
  'Medium Impact': { badge:'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', dot:'bg-blue-500',    bar:'bg-amber-500'  },
  'Low Impact':    { badge:'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400',      dot:'bg-violet-500',  bar:'bg-slate-400'  },
};

const CATEGORY_TABS: { label: string; key: string; count: number }[] = [
  { label:'All Insights',    key:'all',              count:24 },
  { label:'Top Priorities',  key:'Top Priorities',   count:6  },
  { label:'Academics',       key:'Academics',        count:8  },
  { label:'Essays',          key:'Essays',           count:2  },
  { label:'MMI',             key:'MMI',              count:4  },
  { label:'Profile Building',key:'Profile Building', count:5  },
];

const SORT_OPTIONS = ['Most Relevant', 'Highest Impact', 'Lowest Impact', 'Newest First'];
const PAGE_SIZE = 10;

// ── Insight Plan Modal ────────────────────────────────────────────────────────

function InsightPlanModal({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  function toggle(id: number) {
    setChecked(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  const pct = Math.round((checked.size / insight.steps.length) * 100);
  const circumference = 2 * Math.PI * 28;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"/>

      <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-white dark:bg-[#161a27] shadow-2xl shadow-black/30 animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-white/8">

        {/* ── Coloured header band ── */}
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-t-3xl px-6 pt-6 pb-8">
          <button onClick={onClose}
            className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl backdrop-blur-sm transition-all border border-white/20">
            <X size={12}/> Close
          </button>

          <div className="flex items-start gap-4 pr-20">
            <div className={`w-11 h-11 rounded-2xl ${insight.iconBg} flex items-center justify-center shrink-0 border border-white/20`}>
              <insight.icon size={18} className={insight.iconColor}/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">{insight.category}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${IMPACT_STYLE[insight.impact].badge}`}>
                  {insight.impact}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">{insight.title}</h2>
              <p className="text-xs text-cyan-100 mt-1 leading-relaxed">{insight.desc}</p>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-white text-[10px] font-semibold">
              <Clock size={11}/> {insight.timeEst}
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold ${DIFFICULTY_STYLE[insight.difficulty]}`}>
              <Zap size={11}/> {insight.difficulty}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 text-white text-[10px] font-semibold">
              <Target size={11}/> {insight.steps.length} steps
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="px-6 py-5 space-y-5">

          {/* Progress ring + summary */}
          <div className="flex items-center gap-5 bg-slate-50 dark:bg-white/5 rounded-2xl px-5 py-4">
            <div className="relative w-16 h-16 shrink-0">
              <svg width="64" height="64" className="-rotate-90">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="5" className="dark:stroke-white/10"/>
                <circle cx="32" cy="32" r="28" fill="none" stroke="#0891b2" strokeWidth="5"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - pct / 100)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-slate-900 dark:text-white">{pct}%</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {checked.size === insight.steps.length && checked.size > 0
                  ? 'Plan Complete!'
                  : `${checked.size} of ${insight.steps.length} steps done`}
              </p>
              <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5">
                {checked.size === 0
                  ? 'Start checking off steps as you complete them.'
                  : checked.size === insight.steps.length
                  ? 'Great work — this insight is fully actioned!'
                  : 'Keep going — you\'re making progress.'}
              </p>
              {/* Mini progress bar */}
              <div className="mt-2 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 rounded-full transition-all duration-300" style={{ width:`${pct}%` }}/>
              </div>
            </div>
          </div>

          {/* Action steps */}
          <div>
            <h3 className="text-xs font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-widest mb-3">Action Steps</h3>
            <div className="space-y-2">
              {insight.steps.map((step, idx) => {
                const done = checked.has(step.id);
                return (
                  <button key={step.id} onClick={() => toggle(step.id)}
                    className={`w-full flex items-start gap-3 p-3.5 rounded-xl border transition-all text-left ${
                      done
                        ? 'bg-cyan-50 dark:bg-cyan-500/10 border-cyan-200 dark:border-cyan-500/30'
                        : 'bg-white dark:bg-white/3 border-gray-100 dark:border-white/8 hover:border-cyan-300 hover:bg-cyan-50/50 dark:hover:bg-white/5'
                    }`}>
                    <div className="shrink-0 mt-0.5">
                      {done
                        ? <CheckSquare size={16} className="text-cyan-600 dark:text-cyan-400"/>
                        : <Square size={16} className="text-slate-300 dark:text-[#5a5f78]"/>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-xs font-semibold transition-colors ${done ? 'line-through text-slate-400 dark:text-[#5a5f78]' : 'text-slate-800 dark:text-white'}`}>
                          Step {idx + 1}: {step.label}
                        </span>
                      </div>
                      <p className={`text-[10px] leading-relaxed transition-colors ${done ? 'text-slate-300 dark:text-[#5a5f78]' : 'text-slate-400 dark:text-[#8e92ad]'}`}>
                        {step.detail}
                      </p>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 self-center ${step.tagColor}`}>
                      {step.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => {
                if (checked.size === insight.steps.length) {
                  setChecked(new Set());
                } else {
                  setChecked(new Set(insight.steps.map(s => s.id)));
                }
              }}
              className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all">
              {checked.size === insight.steps.length
                ? <><X size={13}/> Reset Plan</>
                : <><PlayCircle size={14}/> {checked.size === 0 ? 'Start Plan' : 'Mark All Complete'}</>
              }
            </button>
            <button onClick={onClose}
              className="h-10 px-4 rounded-xl border border-gray-200 dark:border-white/8 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              Done
            </button>
          </div>

          {/* AI Coach tip */}
          <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl px-4 py-3">
            <Sparkles size={13} className="text-blue-500 dark:text-blue-400 shrink-0 mt-0.5"/>
            <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed">
              <span className="font-bold">AI Coach Tip: </span>
              Completing this plan could improve your AIF score in the{' '}
              <span className="font-bold">{insight.category}</span> section. Tackle it this week for the best results.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AllInsightsPage() {
  const [activeTab, setActiveTab]           = useState('all');
  const [impactFilter, setImpactFilter]     = useState<ImpactLevel | null>(null);
  const [sortBy, setSortBy]                 = useState('Most Relevant');
  const [sortOpen, setSortOpen]             = useState(false);
  const [page, setPage]                     = useState(1);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);

  const filtered = useMemo(() => {
    let list = ALL_INSIGHTS;
    if (activeTab !== 'all') list = list.filter(i => i.category === activeTab);
    if (impactFilter)        list = list.filter(i => i.impact === impactFilter);
    if (sortBy === 'Highest Impact') {
      const order: Record<ImpactLevel, number> = { 'High Impact':0, 'Medium Impact':1, 'Low Impact':2 };
      list = [...list].sort((a,b) => order[a.impact] - order[b.impact]);
    } else if (sortBy === 'Lowest Impact') {
      const order: Record<ImpactLevel, number> = { 'High Impact':2, 'Medium Impact':1, 'Low Impact':0 };
      list = [...list].sort((a,b) => order[a.impact] - order[b.impact]);
    }
    return list;
  }, [activeTab, impactFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleTabChange(key: string) { setActiveTab(key); setPage(1); }
  function handleImpact(lvl: ImpactLevel) { setImpactFilter(f => f === lvl ? null : lvl); setPage(1); }

  const pageNums = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  const FilterPanel = () => (
    <div className="space-y-5">
      {/* Impact Level */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Impact Level</h4>
        <div className="space-y-2">
          {(Object.entries(IMPACT_COUNTS) as [ImpactLevel, number][]).map(([lvl, cnt]) => (
            <button key={lvl} onClick={() => handleImpact(lvl)}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                impactFilter === lvl ? 'bg-cyan-50 dark:bg-cyan-500/15 ring-1 ring-cyan-300 dark:ring-cyan-600' : 'hover:bg-gray-50 dark:hover:bg-white/5'
              }`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${IMPACT_STYLE[lvl].dot}`}/>
                <span className="text-xs text-slate-700 dark:text-slate-300">{lvl}</span>
              </div>
              <span className="text-xs font-bold text-slate-500 dark:text-[#8e92ad]">{cnt}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Category</h4>
        <div className="space-y-2">
          <div className="w-full flex items-center justify-between h-9 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            All Categories <ChevronDown size={12} className="text-slate-400"/>
          </div>
          <div className="w-full flex items-center justify-between h-9 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            Active Students <ChevronDown size={12} className="text-slate-400"/>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Status</h4>
        <div className="w-full flex items-center justify-between h-9 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-xs text-slate-600 dark:text-slate-300">
          All Status <ChevronDown size={12} className="text-slate-400"/>
        </div>
      </div>

      {/* Sort by */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Sort by</h4>
        <div className="relative">
          <button onClick={() => setSortOpen(v => !v)}
            className="w-full flex items-center justify-between h-9 px-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-xs text-slate-600 dark:text-slate-300">
            {sortBy} <ChevronDown size={12} className="text-slate-400"/>
          </button>
          {sortOpen && (
            <div className="absolute top-10 left-0 right-0 bg-white dark:bg-[#1e2335] border border-gray-100 dark:border-white/8 rounded-xl shadow-lg overflow-hidden z-20">
              {SORT_OPTIONS.map(opt => (
                <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); setPage(1); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors ${sortBy === opt ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Insights Summary */}
      <div>
        <h4 className="text-[11px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wider mb-3">Insights Summary</h4>
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 space-y-2">
          <p className="text-[10px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wider mb-2">Total Insights</p>
          {[
            { label:'High Impact',          cnt:48, dot:'bg-emerald-500' },
            { label:'Medium Impact',        cnt:36, dot:'bg-blue-500'   },
            { label:'Low Impact',           cnt:16, dot:'bg-violet-500' },
            { label:'Action Plan Available',cnt:18, dot:'bg-amber-400'  },
          ].map(s => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className={`w-1.5 h-1.5 rounded-full ${s.dot}`}/><span className="text-[10px] text-slate-600 dark:text-slate-300">{s.label}</span></div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{s.cnt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Coach Tip */}
      <div className="bg-blue-600 rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles size={13} className="text-blue-200"/>
          <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider">AI Coach Tip</p>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed mb-3">
          Focus on high impact insights first to maximize your AIF score and admission chances.
        </p>
        <button className="flex items-center gap-1 text-[10px] font-semibold text-blue-200 hover:text-white transition-colors">
          How insights are generated <ArrowUpRight size={10}/>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      {/* Modal */}
      {selectedInsight && (
        <InsightPlanModal insight={selectedInsight} onClose={() => setSelectedInsight(null)}/>
      )}

      <div className="max-w-[1380px] mx-auto space-y-5">

        {/* ── Back + Header ── */}
        <div>
          <Link href="/university-college-student-route/aif-coach" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to AIF Coach
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">All AI Insights & Recommendations</h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Personalized insights to help you improve your profile and maximize your admission chances.</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all shrink-0 self-start sm:self-auto">
              <Download size={13}/> Export Report
            </button>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── Left / Centre ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Category tabs */}
            <div className="flex gap-0 overflow-x-auto scrollbar-none border-b border-gray-100 dark:border-white/6">
              {CATEGORY_TABS.map(t => (
                <button key={t.key} onClick={() => handleTabChange(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-px ${
                    activeTab === t.key
                      ? 'border-cyan-600 text-cyan-700 dark:text-cyan-400'
                      : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700'
                  }`}>
                  {t.label}
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === t.key ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400' : 'bg-gray-100 dark:bg-white/10 text-slate-500'
                  }`}>{t.count}</span>
                </button>
              ))}
            </div>

            {/* Sort row + mobile filters */}
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-[#8e92ad]">
                Showing <span className="font-semibold text-slate-700 dark:text-white">{filtered.length}</span> insights
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setMobileFiltersOpen(v => !v)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Filter size={12}/> Filters
                </button>
                <div className="flex items-center gap-2 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/6 rounded-xl px-3 py-2">
                  <span className="text-[10px] text-slate-400 dark:text-[#8e92ad] whitespace-nowrap">Sort by</span>
                  <div className="relative">
                    <button onClick={() => setSortOpen(v => !v)}
                      className="flex items-center gap-1 text-xs font-semibold text-slate-700 dark:text-slate-200">
                      {sortBy} <ChevronDown size={12} className="text-slate-400"/>
                    </button>
                    {sortOpen && (
                      <div className="absolute top-7 right-0 bg-white dark:bg-[#1e2335] border border-gray-100 dark:border-white/8 rounded-xl shadow-xl overflow-hidden z-20 w-40">
                        {SORT_OPTIONS.map(opt => (
                          <button key={opt} onClick={() => { setSortBy(opt); setSortOpen(false); setPage(1); }}
                            className={`w-full text-left px-3 py-2.5 text-xs transition-colors ${sortBy === opt ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters drawer */}
            {mobileFiltersOpen && (
              <div className="lg:hidden bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-white">Filter Insights</h3>
                  <button onClick={() => setMobileFiltersOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors">
                    <X size={14} className="text-slate-400"/>
                  </button>
                </div>
                <FilterPanel/>
              </div>
            )}

            {/* Insights list */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
              {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center mb-4">
                    <Sparkles size={22} className="text-cyan-500"/>
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-white">No insights found</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">Try adjusting your filters</p>
                  <button onClick={() => { setImpactFilter(null); setActiveTab('all'); }} className="mt-4 text-xs font-bold text-cyan-600 hover:text-cyan-700 transition-colors">Clear all filters</button>
                </div>
              ) : (
                paginated.map((insight, i) => (
                  <div key={insight.id}
                    className={`flex items-center gap-4 px-5 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-white/3 ${i < paginated.length - 1 ? 'border-b border-gray-50 dark:border-white/5' : ''}`}>
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-xl ${insight.iconBg} flex items-center justify-center shrink-0`}>
                      <insight.icon size={15} className={insight.iconColor}/>
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white leading-snug">{insight.title}</p>
                      <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate sm:whitespace-normal">{insight.desc}</p>
                    </div>

                    {/* Impact badge */}
                    <span className={`text-[9px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 hidden sm:inline-flex ${IMPACT_STYLE[insight.impact].badge}`}>
                      {insight.impact === 'High Impact' ? 'High Impacted' : insight.impact}
                    </span>

                    {/* View plan */}
                    <button
                      onClick={() => setSelectedInsight(insight)}
                      className="text-[11px] font-bold text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 px-3.5 py-2 rounded-xl transition-all whitespace-nowrap shrink-0">
                      View plan
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">
                  Show {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} insights
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all">
                    <ChevronLeft size={13}/>
                  </button>
                  {pageNums.map(n => (
                    <button key={n} onClick={() => setPage(n)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                        page === n ? 'bg-cyan-600 text-white' : 'border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-500 dark:text-slate-400 hover:bg-gray-50'
                      }`}>{n}</button>
                  ))}
                  {totalPages > 3 && (
                    <>
                      <span className="text-slate-400 text-xs px-0.5">…</span>
                      <button onClick={() => setPage(totalPages)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-500 hover:bg-gray-50 transition-all ${page === totalPages ? 'bg-cyan-600 text-white border-transparent' : ''}`}>
                        {totalPages}
                      </button>
                    </>
                  )}
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-white/8 bg-white dark:bg-[#161a27] text-slate-400 hover:text-slate-700 disabled:opacity-30 transition-all">
                    <ChevronRight size={13}/>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Right Sidebar (desktop) ── */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 gap-0">
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Filter Insights</h3>
                <button onClick={() => { setImpactFilter(null); setActiveTab('all'); setSortBy('Most Relevant'); setPage(1); }}
                  className="text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors">
                  Clear All
                </button>
              </div>
              <FilterPanel/>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
