'use client';

import React, { useState } from 'react';
import { ArrowUpRight, TrendingUp, Calendar } from 'lucide-react';
import { cn } from "@/lib/utils";

const tabs = [
  { label: "All Programs",  count: 5 },
  { label: "On Track",      count: 2 },
  { label: "At Risk",       count: 2 },
  { label: "Not Started",   count: 1 },
];

interface Program {
  name: string; code: string; initials: string; color: string;
  university: string; province: string; cutoff: string;
  requirement: string; probability: number;
  status: 'on-track' | 'medium' | 'at-risk' | 'not-started';
  deadline: string; date: string; trend?: string;
}

const programData: Program[] = [
  { name: "Engineering Science",        code: "OUAC 7221",      initials: "UofT", color: "#2563EB", university: "University of Toronto",         province: "ON", cutoff: "95–97%", requirement: "AIF required",     probability: 72, status: "on-track",    deadline: "UofT AIF",    date: "Dec 1, 2024",  trend: "+6%" },
  { name: "Computer Science",           code: "UBC Direct",     initials: "UBC",  color: "#0891b2", university: "University of British Columbia", province: "BC", cutoff: "92–95%", requirement: "Personal Profile",  probability: 64, status: "medium",      deadline: "UBC Essay",   date: "Jan 15, 2025" },
  { name: "Software Engineering (co-op)", code: "OUAC 4BE",     initials: "UW",   color: "#d97706", university: "University of Waterloo",         province: "ON", cutoff: "90–93%", requirement: "AIF required",     probability: 48, status: "medium",      deadline: "Waterloo AIF", date: "Dec 1, 2024" },
  { name: "iBSc Health Sciences",       code: "McMaster Direct",initials: "McM",  color: "#dc2626", university: "McMaster University",            province: "ON", cutoff: "94–97%", requirement: "Supp + MMI",       probability: 31, status: "at-risk",     deadline: "Supplemental",date: "Feb 1, 2025" },
  { name: "Computing",                  code: "OUAC 435",       initials: "QU",   color: "#7c3aed", university: "Queen's University",             province: "ON", cutoff: "85–91%", requirement: "None required",    probability: 94, status: "on-track",    deadline: "OUAC Form",   date: "Feb 1, 2025" },
];

const STATUS_CONFIG = {
  'on-track':    { label: 'On Track',    bg: 'bg-emerald-50 dark:bg-emerald-500/15', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-100 dark:border-emerald-500/20', bar: '#10b981' },
  'medium':      { label: 'Medium',      bg: 'bg-amber-50   dark:bg-amber-500/15',   text: 'text-amber-700   dark:text-amber-400',   border: 'border-amber-100   dark:border-amber-500/20',   bar: '#f59e0b' },
  'at-risk':     { label: 'At Risk',     bg: 'bg-red-50     dark:bg-red-500/15',     text: 'text-red-700     dark:text-red-400',     border: 'border-red-100     dark:border-red-500/20',     bar: '#ef4444' },
  'not-started': { label: 'Not Started', bg: 'bg-slate-50   dark:bg-white/5',        text: 'text-slate-500   dark:text-slate-400',   border: 'border-slate-100   dark:border-white/8',        bar: '#94a3b8' },
};

function ProbabilityBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-8 text-right shrink-0">{value}%</span>
    </div>
  );
}

export function ProgramsTable() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 dark:border-white/6 px-5">
        {tabs.map((tab, i) => (
          <button key={tab.label} onClick={() => setActiveTab(i)}
            className={cn(
              "px-3 py-3.5 text-[12px] font-bold transition-all border-b-2 mr-4 flex items-center gap-1.5 whitespace-nowrap",
              i === activeTab
                ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                : "text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300"
            )}
          >
            {tab.label}
            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-md font-bold",
              i === activeTab
                ? "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
                : "bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500")}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Header */}
      <div className="hidden md:grid grid-cols-12 bg-slate-50/60 dark:bg-white/3 px-5 py-2.5 border-b border-slate-100 dark:border-white/5">
        {['Program', 'University', 'Probability', 'Status', 'Deadline'].map((h, i) => (
          <div key={h} className={cn("text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider",
            i === 0 ? "col-span-4" : i === 1 ? "col-span-3" : i === 2 ? "col-span-2" : i === 3 ? "col-span-1 text-center" : "col-span-2 text-right")}>
            {h}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <div className="divide-y divide-slate-50 dark:divide-white/5">
        {programData.map((item, idx) => {
          const st = STATUS_CONFIG[item.status];
          return (
            <div key={idx} className="group px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-white/3 transition-colors cursor-pointer">
              {/* Mobile */}
              <div className="md:hidden flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5"
                  style={{ backgroundColor: item.color + '18', color: item.color }}>
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0", st.bg, st.text, st.border)}>{st.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{item.university} · {item.province}</p>
                  <div className="mt-2"><ProbabilityBar value={item.probability} color={st.bar} /></div>
                  <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    <Calendar size={10} />
                    <span>{item.deadline} · {item.date}</span>
                  </div>
                </div>
              </div>

              {/* Desktop */}
              <div className="hidden md:grid grid-cols-12 items-center gap-2">
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: item.color + '18', color: item.color }}>
                    {item.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</h4>
                      {item.trend && (
                        <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-1 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                          <TrendingUp size={9} />{item.trend}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.code} · {item.requirement}</p>
                  </div>
                </div>

                <div className="col-span-3 min-w-0">
                  <p className="text-[12px] text-slate-600 dark:text-slate-300 font-medium truncate">{item.university}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.province} · Cutoff {item.cutoff}</p>
                </div>

                <div className="col-span-2"><ProbabilityBar value={item.probability} color={st.bar} /></div>

                <div className="col-span-1 flex justify-center">
                  <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg border", st.bg, st.text, st.border)}>{st.label}</span>
                </div>

                <div className="col-span-2 flex items-center justify-end gap-2">
                  <div className="text-right">
                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">{item.deadline}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{item.date}</p>
                  </div>
                  <button className="p-1.5 rounded-lg text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/8 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                    <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3.5 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">Showing {programData.length} of {programData.length} programs</p>
        <button className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
          + Add program
        </button>
      </div>
    </div>
  );
}
