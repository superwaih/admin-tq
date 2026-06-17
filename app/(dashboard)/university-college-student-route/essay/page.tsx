import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock } from "lucide-react";
import { AiFeedbackPanel } from "../_components/AiFeedbackPanel";
import { EssayScoreCard } from "../_components/EssayScoreCard";
import { EssayEditor } from "../_components/EssayEditor";
import { getEssay } from "./essays-data";

const essays = [
  { label: "UofT Engineering AIF", tag: "AIF",   tagColor: "bg-blue-50  dark:bg-blue-500/15  text-blue-600  dark:text-blue-400",  status: "In Progress", deadline: "Dec 1" },
  { label: "Waterloo AIF",         tag: "AIF",   tagColor: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400", status: "Draft",       deadline: "Dec 1" },
  { label: "UBC Personal Profile", tag: "Essay", tagColor: "bg-sky-50   dark:bg-sky-500/15   text-sky-600   dark:text-sky-400",   status: "Not started", deadline: "Jan 15" },
];

export default function EssayCoachPage({ searchParams }: { searchParams?: { essay?: string; edit?: string } }) {
  const selected = searchParams?.essay ? getEssay(Number(searchParams.essay)) : undefined;
  const editing = searchParams?.edit === '1';
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Essay Coach</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Write, refine, and get AI-powered feedback on your applications.</p>
          </div>
          <Link href="/university-college-student-route/essay/new" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 px-5 text-sm font-semibold shadow-sm shadow-blue-200 transition-all self-start sm:self-auto">
            <Plus size={15} /> New Essay
          </Link>
        </div>

        {/* Essay selector row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {essays.map((e, i) => (
            <div
              key={i}
              className={`bg-white dark:bg-[#161a27] rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${
                i === 0 ? 'border-blue-200 dark:border-blue-500/35 ring-1 ring-blue-100 dark:ring-blue-500/20 shadow-sm' : 'border-gray-100 dark:border-white/6 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${e.tagColor}`}>{e.tag}</span>
                    <span className={`text-[10px] font-semibold ${
                      e.status === 'In Progress' ? 'text-emerald-600 dark:text-emerald-400' :
                      e.status === 'Draft' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-400 dark:text-slate-500'
                    }`}>{e.status}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{e.label}</p>
                </div>
                <div className="shrink-0 flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                  <Clock size={10} />
                  {e.deadline}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main editor + AI panel */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          <div className="xl:col-span-8">
            <EssayEditor
              title={selected?.title}
              tag={selected?.subtitle}
              editing={editing}
            />
          </div>
          <div className="xl:col-span-4 space-y-5">
            <AiFeedbackPanel />
            <EssayScoreCard />
          </div>
        </div>

      </div>
    </div>
  );
}
