import { ChevronRight, FileText, TrendingUp } from "lucide-react";

interface ScoreBar {
  label: string;
  value: number;
  color: string;
  bg: string;
}

const scores: ScoreBar[] = [
  { label: "Grammar",   value: 90, color: "#10b981", bg: "bg-emerald-500" },
  { label: "Clarity",   value: 78, color: "#3b82f6", bg: "bg-blue-500" },
  { label: "Structure", value: 84, color: "#8b5cf6", bg: "bg-violet-500" },
  { label: "Impact",    value: 75, color: "#f59e0b", bg: "bg-amber-400" },
];

const OVERALL = 82;
const CIRCUMFERENCE = 2 * Math.PI * 38;

export function EssayScoreCard() {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm p-5">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Essay Score</h3>
          <div className="flex items-center gap-1 mt-0.5">
            <TrendingUp size={11} className="text-emerald-500" />
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">+3pts since last edit</p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-lg">Good</span>
      </div>

      <div className="flex items-center gap-5 mb-5">
        <div className="relative w-20 h-20 shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 90 90">
            <circle cx="45" cy="45" r="38" fill="none" stroke="currentColor" strokeWidth="7" className="text-slate-100 dark:text-white/8" />
            <circle cx="45" cy="45" r="38" fill="none" stroke="#10b981" strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - OVERALL / 100)} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-none">{OVERALL}%</span>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide mt-0.5">Overall</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          {scores.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 w-14 shrink-0">{s.label}</span>
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${s.bg} transition-all`} style={{ width: `${s.value}%` }} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 w-7 text-right shrink-0">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full bg-blue-50 dark:bg-blue-500/12 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 py-2.5 rounded-xl flex items-center justify-between px-4 transition-colors border border-blue-100 dark:border-blue-500/20">
        <div className="flex items-center gap-2.5 text-[12px] font-bold">
          <FileText size={14} />
          View Detailed Report
        </div>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
