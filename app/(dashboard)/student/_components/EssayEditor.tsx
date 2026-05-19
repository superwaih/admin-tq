'use client';

import React from 'react';
import {
  ArrowLeft, Bold, Italic, Underline, Strikethrough,
  AlignLeft, AlignRight, AlignCenter, List, ListOrdered,
  Link2, Paperclip, Sparkles, Download, Share2,
  LayoutTemplate, Files, Lightbulb, CheckCircle2,
} from 'lucide-react';
import { Button } from "@/components/ui/button";

const WORD_COUNT = 642;
const WORD_LIMIT = 800;
const wordPct = Math.round((WORD_COUNT / WORD_LIMIT) * 100);

export function EssayEditor() {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm flex flex-col min-h-[680px] overflow-hidden">

      {/* Doc header */}
      <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 shrink-0 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-slate-800 dark:text-slate-200 text-sm leading-none">UofT Engineering AIF</h2>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold shrink-0">
                Personal Profile
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 size={11} className="text-emerald-500 shrink-0" />
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Saved just now</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">{WORD_COUNT} / {WORD_LIMIT} words</span>
            <div className="w-20 h-1 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-blue-500 transition-all" style={{ width: `${wordPct}%` }} />
            </div>
          </div>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 rounded-xl flex gap-1.5 h-8 px-3 text-xs font-semibold shadow-sm shadow-blue-200 dark:shadow-blue-900/20">
            <Sparkles size={13} /> AI Improve
          </Button>
        </div>
      </div>

      {/* Formatting toolbar */}
      <div className="px-4 py-2 border-b border-slate-100 dark:border-white/6 flex items-center gap-1 bg-slate-50/50 dark:bg-white/3 flex-wrap">
        <button className="px-2 py-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-white/8 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-all flex items-center gap-1 border border-transparent hover:border-slate-200 dark:hover:border-white/10">
          Paragraph
        </button>
        <Divider />
        <ToolbarButton icon={<Bold size={14} />} />
        <ToolbarButton icon={<Italic size={14} />} />
        <ToolbarButton icon={<Underline size={14} />} />
        <ToolbarButton icon={<Strikethrough size={14} />} />
        <Divider />
        <ToolbarButton icon={<AlignLeft size={14} />} active />
        <ToolbarButton icon={<AlignCenter size={14} />} />
        <ToolbarButton icon={<AlignRight size={14} />} />
        <Divider />
        <ToolbarButton icon={<List size={14} />} />
        <ToolbarButton icon={<ListOrdered size={14} />} />
        <Divider />
        <ToolbarButton icon={<Paperclip size={14} />} />
        <ToolbarButton icon={<Link2 size={14} />} />
      </div>

      {/* Text area */}
      <div className="flex-1 px-8 py-6">
        <textarea
          className="w-full h-full resize-none text-[14px] leading-[1.85] text-slate-700 dark:text-slate-300 outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600 font-sans bg-transparent"
          placeholder="Start writing your essay here…"
          defaultValue={`My interest in engineering started when I began solving small real-life problems through technology and creativity. Over the years, I have developed strong analytical and leadership skills through academic projects, teamwork activities, and personal learning experiences.\n\nOne experience that greatly shaped me was leading a science project team during a regional competition. Our task was to design a water purification prototype for rural communities in Northern Ontario. I coordinated a team of five students, managing timelines, delegating research tasks, and presenting our solution to a panel of engineers and professors.\n\nThis experience reinforced my desire to pursue engineering at a world-class institution like the University of Toronto.`}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="px-5 py-3 border-t border-slate-100 dark:border-white/6 bg-slate-50/50 dark:bg-white/3 flex items-center justify-between gap-2">
        <div className="flex gap-2 flex-wrap">
          <FooterButton icon={<LayoutTemplate size={13} />} label="Template" />
          <FooterButton icon={<Files size={13} />} label="My Essays" />
          <FooterButton icon={<Lightbulb size={13} />} label="Example" />
        </div>
        <div className="flex gap-2">
          <FooterButton icon={<Download size={13} />} label="Download" />
          <FooterButton icon={<Share2 size={13} />} label="Share" />
        </div>
      </div>
    </div>
  );
}

function Divider() {
  return <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-0.5 shrink-0" />;
}

function ToolbarButton({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button className={`p-1.5 rounded-lg transition-all ${
      active
        ? 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
        : 'text-slate-400 dark:text-slate-500 hover:bg-white dark:hover:bg-white/8 hover:text-slate-600 dark:hover:text-slate-300 hover:border hover:border-slate-200 dark:hover:border-white/10'
    }`}>
      {icon}
    </button>
  );
}

function FooterButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm">
      {icon} {label}
    </button>
  );
}
