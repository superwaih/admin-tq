import Link from 'next/link';
import { Compass, ListChecks, Upload, BarChart3 } from 'lucide-react';

interface QuickAction {
  title: string;
  sub: string;
  icon: React.ReactNode;
  href: string;
  iconBg: string;
  cardBg: string;
}

const ACTIONS: QuickAction[] = [
  {
    title: 'Explore Pathways',
    sub: 'Browse apprenticeship and trade options',
    icon: <Compass size={18} />,
    href: '/vocational-technical-student-route/career',
    iconBg: 'bg-emerald-500 text-white',
    cardBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100/70 dark:hover:bg-emerald-500/15',
  },
  {
    title: 'Continue Milestones',
    sub: 'Work on your remaining milestone',
    icon: <ListChecks size={18} />,
    href: '/vocational-technical-student-route/milestones',
    iconBg: 'bg-blue-500 text-white',
    cardBg: 'bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 hover:bg-blue-100/70 dark:hover:bg-blue-500/15',
  },
  {
    title: 'Upload Document',
    sub: 'Submit required documents',
    icon: <Upload size={18} />,
    href: '/vocational-technical-student-route/experience-log',
    iconBg: 'bg-amber-500 text-white',
    cardBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20 hover:bg-amber-100/70 dark:hover:bg-amber-500/15',
  },
  {
    title: 'Admission Simulator',
    sub: 'Simulate outcome for your goals',
    icon: <BarChart3 size={18} />,
    href: '/vocational-technical-student-route/simulator',
    iconBg: 'bg-violet-500 text-white',
    cardBg: 'bg-violet-50 dark:bg-violet-500/10 border-violet-100 dark:border-violet-500/20 hover:bg-violet-100/70 dark:hover:bg-violet-500/15',
  },
];

export const QuickActionsRow = () => (
  <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {ACTIONS.map((a) => (
        <Link
          key={a.title}
          href={a.href}
          className={`flex flex-col gap-2.5 rounded-xl border p-3.5 transition-colors ${a.cardBg}`}
        >
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.iconBg}`}>{a.icon}</div>
          <div>
            <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{a.title}</p>
            <p className="text-[11px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{a.sub}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);
