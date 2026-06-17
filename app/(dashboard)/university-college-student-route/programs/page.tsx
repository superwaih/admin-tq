'use client';

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Search, BookOpen, Target, Clock, TrendingUp } from "lucide-react";
import { ProgramsTable } from "../_components/ProgramsTable";

const statCards = [
  { label: "Programs Tracked", value: "5",     sub: "3 provinces",        icon: <BookOpen size={16} />,  iconBg: "bg-blue-50    dark:bg-blue-500/15",   iconColor: "text-blue-600    dark:text-blue-400",   valueColor: "text-blue-700    dark:text-blue-400" },
  { label: "Avg Probability",  value: "68.8%", sub: "+4% this week",      icon: <Target size={16} />,    iconBg: "bg-emerald-50 dark:bg-emerald-500/15", iconColor: "text-emerald-600 dark:text-emerald-400", valueColor: "text-emerald-700 dark:text-emerald-400" },
  { label: "Next Deadline",    value: "7d",    sub: "UofT AIF — Dec 1",   icon: <Clock size={16} />,     iconBg: "bg-red-50     dark:bg-red-500/15",     iconColor: "text-red-500     dark:text-red-400",     valueColor: "text-red-600     dark:text-red-400" },
  { label: "Best Chance",      value: "94%",   sub: "Queen's Computing",   icon: <TrendingUp size={16} />,iconBg: "bg-purple-50  dark:bg-purple-500/15",  iconColor: "text-purple-600  dark:text-purple-400",  valueColor: "text-purple-700  dark:text-purple-400" },
];

export default function MyProgramsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Programs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track and manage the programs you're applying to.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <Button variant="outline" className="flex gap-2 rounded-xl border-slate-200 text-slate-600 h-10 px-4 text-sm font-semibold shadow-sm">
              <Filter size={15} /> Filter
            </Button>
            <Link href="/university-college-student-route/programs/new" className="bg-white hover:bg-gray-50 flex items-center gap-2 rounded-xl h-10 px-5 text-sm font-semibold shadow-sm border border-gray-200 text-slate-700 transition-colors">
              <Plus size={15} /> Add Program
            </Link>
            <Link href="/university-college-student-route/programs/application" className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 rounded-xl h-10 px-5 text-sm font-semibold shadow-sm shadow-blue-200 text-white transition-colors">
              <Plus size={15} /> Add New Application
            </Link>
          </div>
        </div>

        {/* Stat summary row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.iconBg} ${s.iconColor}`}>
                {s.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider truncate">{s.label}</p>
                <p className={`text-lg font-bold leading-tight ${s.valueColor}`}>{s.value}</p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 truncate">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <div className="relative max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Search programs…"
                className="w-full pl-8 pr-3 h-9 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-500/50 transition-all dark:text-slate-200 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
          <ProgramsTable />
        </div>

        {/* Footer banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
          <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-full bg-white/5" />
          <div className="relative flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-white" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Keep your programs updated</h4>
              <p className="text-[11px] text-blue-200 mt-0.5">Accurate deadlines & status improve your AI recommendations</p>
            </div>
          </div>
          <Button className="relative bg-white hover:bg-blue-50 text-blue-700 font-bold rounded-xl px-6 h-10 text-sm shrink-0 shadow-sm">
            Update Program Status
          </Button>
        </div>

      </div>
    </div>
  );
}
