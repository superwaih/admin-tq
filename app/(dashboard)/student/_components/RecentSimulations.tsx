import { Button } from "@/components/ui/button";
import { Users, Scale, HeartPulse, Target, Lightbulb, RotateCcw, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

interface Simulation {
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  date: string;
  score: number;
  status: 'Good' | 'Fair' | 'Excellent';
  icon: React.ReactNode;
  iconBg: string;
  bookmarked?: boolean;
}

const simulations: Simulation[] = [
  { title: "Ethical Dilemma",     category: "Ethics",     difficulty: "Hard",   date: "2 days ago",  score: 87, status: "Good",      icon: <Users size={16} />,     iconBg: "bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400", bookmarked: true },
  { title: "Teamwork Challenge",  category: "Teamwork",   difficulty: "Medium", date: "4 days ago",  score: 76, status: "Fair",      icon: <Scale size={16} />,     iconBg: "bg-blue-50   dark:bg-blue-500/15   text-blue-600   dark:text-blue-400" },
  { title: "Healthcare Scenario", category: "Healthcare", difficulty: "Easy",   date: "1 week ago",  score: 91, status: "Excellent", icon: <HeartPulse size={16} />,iconBg: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  { title: "Personal Motivation", category: "Personal",   difficulty: "Easy",   date: "1 week ago",  score: 88, status: "Good",      icon: <Target size={16} />,    iconBg: "bg-amber-50  dark:bg-amber-500/15  text-amber-600  dark:text-amber-400",  bookmarked: true },
  { title: "Critical Thinking",   category: "Ethics",     difficulty: "Medium", date: "2 weeks ago", score: 79, status: "Good",      icon: <Lightbulb size={16} />, iconBg: "bg-rose-50   dark:bg-rose-500/15   text-rose-600   dark:text-rose-400" },
];

const DIFFICULTY_CONFIG = {
  Easy:   { bg: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-400" },
  Medium: { bg: "bg-amber-50   dark:bg-amber-500/15",   text: "text-amber-700   dark:text-amber-400" },
  Hard:   { bg: "bg-red-50     dark:bg-red-500/15",     text: "text-red-700     dark:text-red-400" },
};

const STATUS_COLOR = {
  Excellent: "text-emerald-600 dark:text-emerald-400",
  Good:      "text-blue-600   dark:text-blue-400",
  Fair:      "text-amber-600  dark:text-amber-400",
};

export function RecentSimulations() {
  return (
    <div className="flex flex-col">
      <div className="px-6 py-4 flex items-center justify-between border-b border-slate-50 dark:border-white/5">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Recent Simulations</h3>
        <button className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors">View all →</button>
      </div>

      <div className="divide-y divide-slate-50 dark:divide-white/5">
        {simulations.map((sim, i) => {
          const diff = DIFFICULTY_CONFIG[sim.difficulty];
          return (
            <div key={i} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/60 dark:hover:bg-white/3 transition-colors group cursor-pointer">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", sim.iconBg)}>
                {sim.icon}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate leading-none">{sim.title}</h4>
                  {sim.bookmarked && <Bookmark size={11} className="text-amber-400 fill-amber-400 shrink-0" />}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-md", diff.bg, diff.text)}>
                    {sim.difficulty}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{sim.category}</span>
                  <span className="text-[10px] text-slate-300 dark:text-slate-600">·</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">{sim.date}</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className={cn("text-sm font-bold leading-none", STATUS_COLOR[sim.status])}>{sim.score}%</p>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wide mt-0.5">{sim.status}</p>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/25 hover:bg-blue-50 dark:hover:bg-blue-500/15 rounded-xl font-semibold text-[11px] px-3 h-8 gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity"
              >
                <RotateCcw size={11} /> Review
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
