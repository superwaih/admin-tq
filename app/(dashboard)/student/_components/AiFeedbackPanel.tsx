'use client';

import { useState } from "react";
import { Sparkles, CheckCircle2, Lightbulb, Layers, ChevronRight, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { label: "All",       count: 8 },
  { label: "Grammar",   count: 3 },
  { label: "Clarity",   count: 2 },
  { label: "Structure", count: 2 },
  { label: "Impact",    count: 1 },
];

interface Feedback {
  type: 'grammar' | 'clarity' | 'structure' | 'impact';
  title: string;
  body: string;
  highlight?: string;
}

const feedbackItems: Feedback[] = [
  { type: 'grammar',   title: 'Stronger verb choice',    body: 'Consider replacing',            highlight: '"fascinated"' },
  { type: 'clarity',   title: 'Sentence too long',       body: 'This sentence spans 3 clauses. Try splitting it for better readability.' },
  { type: 'structure', title: 'Missing topic sentence',  body: 'Your second paragraph lacks a clear opening statement to anchor the reader.' },
];

const TYPE_CONFIG = {
  grammar:   {
    icon: <CheckCircle2 size={13} />,
    bg: 'bg-emerald-50 dark:bg-emerald-500/12', text: 'text-emerald-700 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-500/20', iconText: 'text-emerald-600 dark:text-emerald-400',
    border: 'border-emerald-100 dark:border-emerald-500/20',
  },
  clarity:   {
    icon: <Sparkles size={13} />,
    bg: 'bg-amber-50 dark:bg-amber-500/12', text: 'text-amber-700 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-500/20', iconText: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-100 dark:border-amber-500/20',
  },
  structure: {
    icon: <Layers size={13} />,
    bg: 'bg-blue-50 dark:bg-blue-500/12', text: 'text-blue-700 dark:text-blue-400',
    iconBg: 'bg-blue-100 dark:bg-blue-500/20', iconText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-100 dark:border-blue-500/20',
  },
  impact:    {
    icon: <Lightbulb size={13} />,
    bg: 'bg-purple-50 dark:bg-purple-500/12', text: 'text-purple-700 dark:text-purple-400',
    iconBg: 'bg-purple-100 dark:bg-purple-500/20', iconText: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-100 dark:border-purple-500/20',
  },
};

export function AiFeedbackPanel() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center">
              <Wand2 size={14} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">AI Feedback</h3>
          </div>
          <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 px-2 py-1 rounded-lg">
            {categories[0].count} suggestions
          </span>
        </div>

        <div className="flex gap-1 overflow-x-auto pb-0 no-scrollbar -mx-1 px-1">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              onClick={() => setActiveTab(i)}
              className={cn(
                "text-[11px] font-bold whitespace-nowrap pb-3 border-b-2 transition-all px-1.5",
                i === activeTab
                  ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400"
                  : "text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300"
              )}
            >
              {cat.label}
              {i === activeTab && (
                <span className="ml-1 text-[9px] bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded">
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-slate-100 dark:bg-white/6" />

      <div className="p-4 space-y-3">
        {feedbackItems.map((item, i) => {
          const cfg = TYPE_CONFIG[item.type];
          return (
            <div key={i} className={cn("group rounded-xl border p-3.5 cursor-pointer hover:shadow-sm transition-all", cfg.bg, cfg.border)}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={cn("p-1.5 rounded-lg", cfg.iconBg, cfg.iconText)}>
                    {cfg.icon}
                  </div>
                  <span className={cn("text-[11px] font-bold capitalize", cfg.text)}>{item.title}</span>
                </div>
                <button className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-lg border bg-white dark:bg-white/8 shrink-0 hover:brightness-95 transition-colors",
                  cfg.text, cfg.border
                )}>
                  Apply
                </button>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed pl-7">
                {item.body}
                {item.highlight && (
                  <> <code className={cn("px-1 rounded font-mono text-[10px]", cfg.iconBg, cfg.text)}>{item.highlight}</code> with a stronger, more specific verb.</>
                )}
              </p>
              <div className="flex items-center justify-end mt-2">
                <button className={cn("text-[10px] font-semibold flex items-center gap-0.5 hover:underline", cfg.text)}>
                  View in essay <ChevronRight size={11} />
                </button>
              </div>
            </div>
          );
        })}

        <button className="w-full py-2.5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/4 transition-all">
          Show 5 more suggestions
        </button>
      </div>
    </div>
  );
}
