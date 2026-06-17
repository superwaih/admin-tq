'use client';

import { ArrowUpRight, TrendingUp } from 'lucide-react';

interface Program {
  name: string;
  university: string;
  province: string;
  cutoff: string;
  requirement: string;
  deadline: string;
  probability: number;
  status: 'high' | 'medium' | 'at-risk' | 'on-track';
  trend?: string;
  initials: string;
  color: string;
}

const programs: Program[] = [
  { name: 'Engineering Science',  university: 'University of Toronto',         province: 'ON', cutoff: '95–97%', requirement: 'AIF required',     deadline: 'Dec 1',  probability: 72, status: 'medium',   trend: '+6%', initials: 'UofT', color: '#2563EB' },
  { name: 'Computer Science',     university: 'University of British Columbia', province: 'BC', cutoff: '92–95%', requirement: 'Personal Profile',  deadline: 'Jan 15', probability: 64, status: 'medium',             initials: 'UBC',  color: '#0891b2' },
  { name: 'Software Engineering', university: 'University of Waterloo',         province: 'ON', cutoff: '90–93%', requirement: 'AIF required',     deadline: 'Dec 1',  probability: 48, status: 'on-track',            initials: 'UW',   color: '#d97706' },
  { name: 'Computer Science',     university: 'McGill University',             province: 'QC', cutoff: '92–94%', requirement: 'Supplementary',    deadline: 'Feb 1',  probability: 35, status: 'at-risk',             initials: 'MCG',  color: '#dc2626' },
];

const STATUS_CONFIG = {
  high:       { label: 'High',     bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', bar: '#10b981' },
  medium:     { label: 'Medium',   bg: 'bg-amber-50   dark:bg-amber-500/15',   text: 'text-amber-700   dark:text-amber-400',   bar: '#f59e0b' },
  'on-track': { label: 'On Track', bg: 'bg-blue-50    dark:bg-blue-500/15',    text: 'text-blue-700    dark:text-blue-400',    bar: '#3b82f6' },
  'at-risk':  { label: 'At Risk',  bg: 'bg-red-50     dark:bg-red-500/15',     text: 'text-red-700     dark:text-red-400',     bar: '#ef4444' },
};

function ProbabilityRing({ value, color }: { value: number; color: string }) {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="relative w-14 h-14 shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-gray-100 dark:text-white/8" />
        <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-slate-700 dark:text-slate-300">
        {value}%
      </span>
    </div>
  );
}

interface TargetProgramsListProps { className?: string; }

export const TargetProgramsList = ({ className }: TargetProgramsListProps) => (
  <div className={`bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm flex flex-col ${className}`}>
    <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-50 dark:border-white/5">
      <div>
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Target Programs</h3>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{programs.length} programs tracked</p>
      </div>
      <button className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors">
        View all →
      </button>
    </div>

    <div className="flex flex-col divide-y divide-gray-50 dark:divide-white/5 flex-1">
      {programs.map((prog, i) => {
        const st = STATUS_CONFIG[prog.status];
        return (
          <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 dark:hover:bg-white/3 transition-colors group cursor-pointer">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{ backgroundColor: prog.color + '18', color: prog.color }}>
              {prog.initials}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">{prog.name}</h4>
                {prog.trend && (
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                    <TrendingUp className="w-2.5 h-2.5" />{prog.trend}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 truncate">{prog.university} · {prog.province} · Cutoff {prog.cutoff}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${st.bg} ${st.text}`}>{st.label}</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">{prog.requirement}</span>
                <span className="text-[10px] text-gray-300 dark:text-slate-600">·</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500">Due {prog.deadline}</span>
              </div>
            </div>

            <div className="shrink-0 hidden sm:block">
              <ProbabilityRing value={prog.probability} color={st.bar} />
            </div>
            <div className="sm:hidden shrink-0">
              <span className="text-sm font-bold" style={{ color: st.bar }}>{prog.probability}%</span>
            </div>

            <button className="p-1.5 rounded-lg text-gray-300 dark:text-slate-600 hover:text-gray-600 dark:hover:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/8 transition-all opacity-0 group-hover:opacity-100 shrink-0">
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  </div>
);
