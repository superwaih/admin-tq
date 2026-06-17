import React from 'react';
import { Clock, ChevronRight, Sparkles, Mic, BarChart3, BookOpen } from 'lucide-react';

interface Deadline {
  title: string;
  sub: string;
  daysLeft: number;
  date: string;
}

const deadlines: Deadline[] = [
  { title: 'UofT AIF',             sub: 'Activity Entries',  daysLeft: 7,  date: 'Dec 1'  },
  { title: 'UBC Personal Profile', sub: 'Personal Profile',  daysLeft: 12, date: 'Dec 8'  },
  { title: 'Waterloo AIF',         sub: 'Full Application',  daysLeft: 14, date: 'Dec 15' },
];

function urgencyColor(days: number) {
  if (days <= 7)  return { badge: 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400',    ring: 'bg-red-500',    text: 'text-red-600 dark:text-red-400' };
  if (days <= 12) return { badge: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400', ring: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400' };
  return              { badge: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',   ring: 'bg-blue-400',   text: 'text-blue-600 dark:text-blue-400' };
}

const DeadlineItem = ({ title, sub, daysLeft, date }: Deadline) => {
  const uc = urgencyColor(daysLeft);
  return (
    <div className="flex items-center gap-3 py-3.5 group cursor-pointer hover:bg-gray-50/70 dark:hover:bg-white/3 -mx-5 px-5 rounded-xl transition-colors">
      <div className="relative shrink-0">
        <div className={`w-2.5 h-2.5 rounded-full ${uc.ring}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">{title}</p>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{sub} · {date}</p>
      </div>
      <span className={`text-[11px] font-bold px-2 py-1 rounded-lg shrink-0 ${uc.badge}`}>
        {daysLeft}d
      </span>
    </div>
  );
};

interface Action {
  title: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  href: string;
}

const actions: Action[] = [
  { title: 'Improve your AIF',  sub: 'AI-powered suggestions',   icon: <Sparkles size={15} />, iconBg: 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400', href: '/university-college-student-route/essay' },
  { title: 'Practice MMI',      sub: 'Real-world interview prep', icon: <Mic size={15} />,      iconBg: 'bg-blue-50   dark:bg-blue-500/15   text-blue-600   dark:text-blue-400',   href: '/university-college-student-route/mmi' },
  { title: 'Check your odds',   sub: 'Run admission simulator',   icon: <BarChart3 size={15} />,iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400', href: '/university-college-student-route/simulator' },
  { title: 'Update grades',     sub: 'Keep your profile strong',  icon: <BookOpen size={15} />, iconBg: 'bg-amber-50  dark:bg-amber-500/15  text-amber-600  dark:text-amber-400',  href: '/university-college-student-route/grades' },
];

const ActionItem = ({ title, sub, icon, iconBg }: Action) => (
  <div className="flex items-center gap-3 py-3 group cursor-pointer hover:bg-gray-50/70 dark:hover:bg-white/3 -mx-5 px-5 rounded-xl transition-colors">
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-none">{title}</p>
      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{sub}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-gray-500 dark:group-hover:text-slate-400 transition-colors shrink-0" />
  </div>
);

const AppReadiness = () => {
  const steps = [
    { label: 'Transcript',     done: true },
    { label: 'Grade 12 marks', done: true },
    { label: 'UofT AIF',       done: false },
    { label: 'Waterloo AIF',   done: false },
    { label: 'OUAC form',      done: false },
  ];
  const done = steps.filter(s => s.done).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200">Application Readiness</p>
          <p className="text-2xl font-bold mt-1">{pct}%</p>
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r="20" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
            <circle cx="28" cy="28" r="20" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - pct / 100)}`} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{done}/{steps.length}</span>
        </div>
      </div>

      <div className="space-y-1.5 mt-3">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 ${s.done ? 'bg-white border-white' : 'border-blue-400 bg-transparent'}`}>
              {s.done && (
                <svg className="w-2.5 h-2.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <p className={`text-[12px] ${s.done ? 'text-white font-medium' : 'text-blue-300'}`}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const StudentSidebarWidgets = () => (
  <div className="flex flex-col gap-5">
    <AppReadiness />

    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Upcoming Deadlines</h3>
        <span className="text-[11px] font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/15 px-2 py-0.5 rounded-lg">
          {deadlines.filter(d => d.daysLeft <= 7).length} urgent
        </span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {deadlines.map((d, i) => <DeadlineItem key={i} {...d} />)}
      </div>
    </div>

    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-1">Quick Actions</h3>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {actions.map((a, i) => <ActionItem key={i} {...a} />)}
      </div>
    </div>
  </div>
);
