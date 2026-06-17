'use client';

import { useEffect, useState } from 'react';
import { Target, Compass, CalendarClock, TrendingUp } from 'lucide-react';

/** Fixed reassessment target used for the live countdown. */
const REASSESSMENT_TARGET = new Date('2026-09-10T09:00:00');

function getRemaining(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

const cardBase =
  'bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all duration-200';

function CardHeader({
  icon,
  iconBg,
  iconColor,
  label,
}: {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2.5 mb-3">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <p className="text-[11px] sm:text-xs font-semibold text-gray-500 dark:text-slate-400 leading-tight">{label}</p>
    </div>
  );
}

export const StudentStatCards = () => {
  const [t, setT] = useState(() => getRemaining(REASSESSMENT_TARGET));

  useEffect(() => {
    const id = setInterval(() => setT(getRemaining(REASSESSMENT_TARGET)), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
      {/* Pathway Progress */}
      <div className={cardBase}>
        <CardHeader
          icon={<Target size={17} />}
          iconBg="bg-emerald-50 dark:bg-emerald-500/15"
          iconColor="text-emerald-600 dark:text-emerald-400"
          label="Pathway Progress"
        />
        <div className="flex items-baseline gap-2">
          <h2 className="text-[26px] sm:text-[30px] font-bold leading-none text-slate-900 dark:text-slate-100">70%</h2>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> On Track
          </span>
        </div>
        <div className="mt-3 h-2 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full" style={{ width: '70%' }} />
        </div>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-2 font-medium">Keep going, you&apos;re doing great</p>
      </div>

      {/* Career Match Score */}
      <div className={cardBase}>
        <CardHeader
          icon={<Compass size={17} />}
          iconBg="bg-blue-50 dark:bg-blue-500/15"
          iconColor="text-blue-600 dark:text-blue-400"
          label="Career Match Score"
        />
        <div className="flex items-baseline gap-2">
          <h2 className="text-[26px] sm:text-[30px] font-bold leading-none text-slate-900 dark:text-slate-100">85%</h2>
          <span className="text-[11px] font-bold text-rose-500 dark:text-rose-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> High Match
          </span>
        </div>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-auto pt-4 font-medium leading-snug">
          Strong match for your interests and skills.
        </p>
      </div>

      {/* Reassessment countdown */}
      <div className={cardBase}>
        <CardHeader
          icon={<CalendarClock size={17} />}
          iconBg="bg-amber-50 dark:bg-amber-500/15"
          iconColor="text-amber-600 dark:text-amber-400"
          label="Reassessment Available In"
        />
        <div className="flex items-baseline gap-1.5">
          <h2 className="text-[26px] sm:text-[30px] font-bold leading-none text-slate-900 dark:text-slate-100 tabular-nums">{t.days}</h2>
          <span className="text-xs font-semibold text-gray-400 dark:text-slate-500">Days</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          {[
            { v: t.hours, l: 'Hours' },
            { v: t.minutes, l: 'Minutes' },
            { v: t.seconds, l: 'Seconds' },
          ].map((u) => (
            <div key={u.l} className="bg-gray-50 dark:bg-white/5 rounded-lg py-1.5 text-center">
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {String(u.v).padStart(2, '0')}
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 dark:text-slate-500">{u.l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Readiness Score */}
      <div className={cardBase}>
        <CardHeader
          icon={<TrendingUp size={17} />}
          iconBg="bg-violet-50 dark:bg-violet-500/15"
          iconColor="text-violet-600 dark:text-violet-400"
          label="Readiness Score"
        />
        <div className="flex items-baseline gap-2">
          <h2 className="text-[26px] sm:text-[30px] font-bold leading-none text-slate-900 dark:text-slate-100">78%</h2>
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> Improving
          </span>
        </div>
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-auto pt-4 font-semibold">+8% improvement this month</p>
      </div>
    </div>
  );
};
