import { CheckCircle2, Trophy, Clock, Star, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Metric {
  title: string;
  value: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
  trend?: string;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
}

const metrics: Metric[] = [
  {
    title: "Scenarios Completed",
    value: "12",
    sub: "of 25 total",
    icon: <CheckCircle2 size={17} />,
    iconBg: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
    valueColor: "text-blue-700 dark:text-blue-400",
  },
  {
    title: "Average Score",
    value: "82%",
    badge: "Good",
    badgeColor: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    trend: "+5% this week",
    icon: <Trophy size={17} />,
    iconBg: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    valueColor: "text-emerald-700 dark:text-emerald-400",
  },
  {
    title: "Avg Response Time",
    value: "1:48",
    sub: "min per station",
    icon: <Clock size={17} />,
    iconBg: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400",
    valueColor: "text-amber-700 dark:text-amber-400",
  },
  {
    title: "Feedback Rating",
    value: "B+",
    badge: "Above Avg",
    badgeColor: "bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400",
    icon: <Star size={17} />,
    iconBg: "bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400",
    valueColor: "text-purple-700 dark:text-purple-400",
  },
];

export function MmiMetrics() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m) => (
        <div
          key={m.title}
          className="bg-white dark:bg-[#161a27] rounded-2xl border border-slate-100 dark:border-white/6 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", m.iconBg)}>
              {m.icon}
            </div>
            {m.trend && (
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                <TrendingUp size={9} /> {m.trend}
              </span>
            )}
          </div>

          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{m.title}</p>
          <div className="flex items-end gap-2">
            <h3 className={cn("text-2xl font-bold leading-none", m.valueColor)}>{m.value}</h3>
            {m.sub && <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mb-0.5">{m.sub}</span>}
          </div>
          {m.badge && (
            <span className={cn("inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-md", m.badgeColor)}>
              {m.badge}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
