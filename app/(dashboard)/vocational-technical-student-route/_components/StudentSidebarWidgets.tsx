import React from 'react';
import Link from 'next/link';
import { CalendarDays, CalendarCheck, ChevronRight, ArrowRight, CheckCircle2, Upload, UserPlus } from 'lucide-react';

const NextReassessment = () => (
  <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Next Reassessment</h3>
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center shrink-0">
        <CalendarDays className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Available On</p>
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">Sep 10, 2026</p>
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">Complete your plan to be ready for assessment</p>
      </div>
    </div>
    <Link
      href="/upgrade"
      className="mt-4 flex items-center justify-center gap-1.5 w-full border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
    >
      View Upgrade Plan <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>
);

const UpcomingSession = () => (
  <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upcoming Counselling Session</h3>
      <Link href="/vocational-technical-student-route/counselors" className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline shrink-0">
        View Calendar
      </Link>
    </div>
    <div className="flex items-start gap-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 p-3.5">
      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
        <CalendarCheck className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">Career Planning Session</p>
        <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">with James Wilson</p>
        <p className="text-[11px] font-semibold text-blue-700 dark:text-blue-300 mt-1">Jun 24, 2026 · 4:00 PM EST</p>
      </div>
    </div>
    <Link
      href="/vocational-technical-student-route/counselors/book"
      className="mt-3 flex items-center justify-center gap-1.5 w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl py-2.5 text-[13px] font-semibold transition-colors"
    >
      Book Another Session
    </Link>
  </div>
);

interface Recommendation {
  title: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  href?: string;
}

const recommendations: Recommendation[] = [
  {
    title: 'Complete your Skills Assessment',
    sub: 'Add more skills to improve your matches',
    icon: <CheckCircle2 size={15} />,
    iconBg: 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    href: '/vocational-technical-student-route/skill-assessment',
  },
  {
    title: 'Upload your Experience Log',
    sub: 'Share your work or volunteer experience',
    icon: <Upload size={15} />,
    iconBg: 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400',
    href: '/vocational-technical-student-route/experience-log',
  },
  {
    title: 'Book a Career Planning Session',
    sub: 'Get personalized guidance from your counselor',
    icon: <UserPlus size={15} />,
    iconBg: 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400',
    href: '/vocational-technical-student-route/counselors/book',
  },
];

const RecommendationRow = ({ r }: { r: Recommendation }) => (
  <>
    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${r.iconBg}`}>{r.icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 leading-tight">{r.title}</p>
      <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5 leading-snug">{r.sub}</p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-300 dark:text-slate-600 group-hover:text-gray-500 dark:group-hover:text-slate-400 transition-colors shrink-0" />
  </>
);

const baseRowClass = 'flex items-center gap-3 py-3 group -mx-5 px-5 transition-colors';
const linkRowClass = `${baseRowClass} cursor-pointer hover:bg-gray-50/70 dark:hover:bg-white/3`;

const CounselorRecommendation = () => (
  <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">Counselor Recommendation</h3>
    <div className="divide-y divide-gray-50 dark:divide-white/5">
      {recommendations.map((r, i) =>
        r.href ? (
          <Link key={i} href={r.href} className={linkRowClass}>
            <RecommendationRow r={r} />
          </Link>
        ) : (
          <div key={i} className={baseRowClass}>
            <RecommendationRow r={r} />
          </div>
        ),
      )}
    </div>
    <Link
      href="/vocational-technical-student-route/strategy"
      className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:gap-1.5 transition-all"
    >
      View All Recommendations <ArrowRight className="w-3.5 h-3.5" />
    </Link>
  </div>
);

export const StudentSidebarWidgets = () => (
  <div className="flex flex-col gap-4 sm:gap-5">
    <NextReassessment />
    <UpcomingSession />
    <CounselorRecommendation />
  </div>
);
