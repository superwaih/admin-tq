import { BookOpen, Target, FileText, Clock, TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  trend?: string;
  trendUp?: boolean;
  iconBg: string;
  iconColor: string;
  valueColor: string;
}

const StatCard = ({ icon, label, value, sub, trend, trendUp, iconBg, iconColor, valueColor }: StatCardProps) => (
  <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-3.5 sm:p-5 flex flex-col gap-2.5 sm:gap-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-start justify-between">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
        <span className="scale-90 sm:scale-100">{icon}</span>
      </div>
      {trend && (
        <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg flex items-center gap-1 ${
          trendUp
            ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
            : 'bg-red-50 dark:bg-red-500/15 text-red-500 dark:text-red-400'
        }`}>
          <TrendingUp className={`w-2.5 h-2.5 ${!trendUp ? 'rotate-180' : ''}`} />
          {trend}
        </span>
      )}
    </div>

    <div>
      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 dark:text-slate-500 tracking-widest uppercase mb-0.5 sm:mb-1">{label}</p>
      <h2 className={`text-[22px] sm:text-[28px] font-bold leading-none ${valueColor}`}>{value}</h2>
      <p className="text-[10px] sm:text-[11px] text-gray-400 dark:text-slate-500 mt-1 font-medium leading-tight">{sub}</p>
    </div>
  </div>
);

export const StudentStatCards = () => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
    <StatCard
      icon={<BookOpen size={18} />}
      label="Programs"
      value="5"
      sub="3 provinces tracked"
      iconBg="bg-blue-50 dark:bg-blue-500/15"
      iconColor="text-blue-600 dark:text-blue-400"
      valueColor="text-blue-800 dark:text-blue-400"
    />
    <StatCard
      icon={<Target size={18} />}
      label="Avg Probability"
      value="68.8%"
      sub="Across all programs"
      trend="+4% this week"
      trendUp={true}
      iconBg="bg-emerald-50 dark:bg-emerald-500/15"
      iconColor="text-emerald-600 dark:text-emerald-400"
      valueColor="text-emerald-800 dark:text-emerald-400"
    />
    <StatCard
      icon={<FileText size={18} />}
      label="AIF Progress"
      value="65%"
      sub="UofT — ready to submit"
      iconBg="bg-amber-50 dark:bg-amber-500/15"
      iconColor="text-amber-600 dark:text-amber-400"
      valueColor="text-amber-800 dark:text-amber-400"
    />
    <StatCard
      icon={<Clock size={18} />}
      label="Next Deadline"
      value="7d"
      sub="UofT AIF — Dec 1"
      iconBg="bg-red-50 dark:bg-red-500/15"
      iconColor="text-red-500 dark:text-red-400"
      valueColor="text-red-700 dark:text-red-400"
    />
  </div>
);
