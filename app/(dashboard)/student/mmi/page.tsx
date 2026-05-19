'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Clock, ChevronDown, Filter, Play, BookOpen, Bookmark } from "lucide-react";
import { MmiMetrics } from "../_components/MmiMetrics";
import { PerformanceOverview } from "../_components/PerformanceOverview";
import { RecentSimulations } from "../_components/RecentSimulations";

const TABS = ['All Scenarios', 'Completed', 'Bookmarked'];
const CATEGORIES = ['All Categories', 'Ethics', 'Healthcare', 'Teamwork', 'Communication', 'Personal'];
const DIFFICULTIES = ['All Difficulties', 'Easy', 'Medium', 'Hard'];

function FilterDropdown({ label, options }: { label: string; options: string[] }) {
  return (
    <button className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 text-[12px] font-semibold shadow-sm hover:bg-slate-50 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/15 transition-all">
      {label}
      <ChevronDown size={13} className="text-slate-300 dark:text-slate-500" />
    </button>
  );
}

export default function MmiSimulatorPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">

        {/* ── Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">MMI Simulator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Practice real MMI scenarios and get instant AI feedback.</p>
          </div>
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3.5 py-2 shadow-sm">
              <Clock size={14} className="text-slate-400 dark:text-slate-500" />
              <span className="text-[12px] font-bold text-slate-600 dark:text-slate-300">3 sessions left</span>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl px-5 h-10 font-semibold text-sm shadow-sm shadow-blue-200 flex gap-2">
              <Play size={14} fill="white" /> Start Simulation
            </Button>
          </div>
        </div>

        {/* ── Hero CTA card ────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5" />
          <div className="absolute -bottom-10 left-1/3 w-32 h-32 rounded-full bg-white/5" />
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
              <Mic size={22} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-200 uppercase tracking-widest mb-1">McMaster iBSc · MMI Required</p>
              <h3 className="text-lg font-bold text-white leading-tight">Your deadline is in 47 days</h3>
              <p className="text-[12px] text-blue-200 mt-0.5">You've completed 12 of 25 recommended scenarios. Keep going!</p>
            </div>
          </div>
          <div className="relative flex items-center gap-3 shrink-0">
            <div className="text-center hidden sm:block">
              <p className="text-2xl font-bold text-white">48%</p>
              <p className="text-[10px] text-blue-200 font-semibold uppercase tracking-wide">Complete</p>
            </div>
            <Button className="bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl px-5 h-10 text-sm shadow-sm flex gap-2">
              <BookOpen size={14} /> Practice Now
            </Button>
          </div>
        </div>

        {/* ── Metrics ──────────────────────────────────── */}
        <MmiMetrics />

        {/* ── Tabs + Filters ───────────────────────────── */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/6 px-5">
            <div className="flex">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`pb-3.5 pt-4 px-1 mr-6 text-[12px] font-bold border-b-2 transition-all flex items-center gap-1.5 ${
                    i === activeTab
                      ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                      : 'text-slate-400 dark:text-slate-500 border-transparent hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  {tab === 'Bookmarked' && <Bookmark size={11} />}
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 mb-1 border border-slate-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              <Filter size={12} /> Filter
            </button>
          </div>

          {/* Filter dropdowns */}
          <div className="flex gap-2.5 px-5 py-3.5 border-b border-slate-50 dark:border-white/5">
            <FilterDropdown label="All Categories" options={CATEGORIES} />
            <FilterDropdown label="All Difficulties" options={DIFFICULTIES} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:divide-x divide-slate-100 dark:divide-white/5">
            <div className="lg:col-span-7">
              <RecentSimulations />
            </div>
            <div className="lg:col-span-5">
              <PerformanceOverview />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
