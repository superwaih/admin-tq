'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, TrendingUp, MessageSquare, Calendar,
  ClipboardList, GraduationCap, UserCheck, Activity,
  School, BookOpen, CreditCard, Settings,
  MoreHorizontal, X, ChevronRight,
} from 'lucide-react';

const PRIMARY_TABS = [
  { href: '/parent',             label: 'Children',  Icon: Users },
  { href: '/parent/assignments', label: 'Homework',  Icon: ClipboardList, badge: '12' },
  { href: '/parent/messages',    label: 'Messages',  Icon: MessageSquare, badge: '3' },
  { href: '/parent/schedule',    label: 'Schedule',  Icon: Calendar },
];

type MorePage = {
  href: string;
  label: string;
  shortLabel: string;
  Icon: typeof TrendingUp;
  description: string;
  color: string;
  badge?: string;
};

const MORE_PAGES: MorePage[] = [
  {
    href: '/parent/academic-progress',
    label: 'Academic Progress',
    shortLabel: 'Academics',
    Icon: TrendingUp,
    description: "Track your child's academic performance",
    color: 'from-violet-500 to-purple-600',
  },
  {
    href: '/parent/grades',
    label: 'Grades',
    shortLabel: 'Grades',
    Icon: GraduationCap,
    description: 'View report cards and subject grades',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    href: '/parent/attendance',
    label: 'Attendance',
    shortLabel: 'Attendance',
    Icon: UserCheck,
    description: 'Monitor attendance and absences',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    href: '/parent/behaviour',
    label: 'Behaviour',
    shortLabel: 'Behaviour',
    Icon: Activity,
    description: 'Behavioural notes and incident reports',
    color: 'from-amber-500 to-orange-600',
  },
  {
    href: '/parent/school-events',
    label: 'School Events',
    shortLabel: 'Events',
    Icon: School,
    description: 'Upcoming school events and activities',
    color: 'from-pink-500 to-rose-600',
  },
  {
    href: '/parent/resources',
    label: 'Resources',
    shortLabel: 'Resources',
    Icon: BookOpen,
    description: 'Shared resources and materials',
    color: 'from-sky-500 to-cyan-600',
  },
  {
    href: '/parent/payment',
    label: 'Payment',
    shortLabel: 'Payment',
    Icon: CreditCard,
    description: 'Manage fees and payment history',
    color: 'from-slate-500 to-slate-600',
  },
  {
    href: '/parent/settings',
    label: 'Settings',
    shortLabel: 'Settings',
    Icon: Settings,
    description: 'Account and notification preferences',
    color: 'from-gray-500 to-gray-600',
  },
];

function isMoreActive(pathname: string) {
  return MORE_PAGES.some(p => pathname.startsWith(p.href));
}

const ACCENT = '#7c3aed';

export function ParentMobileNav() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => { setSheetOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sheetOpen]);

  const moreActive = isMoreActive(pathname);
  const activeMorePage = MORE_PAGES.find(p => pathname.startsWith(p.href));

  return (
    <>
      {/* Bottom nav bar */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white dark:bg-[#0d1020] border-t border-gray-100 dark:border-white/8 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch h-[60px]">
          {PRIMARY_TABS.map(({ href, label, Icon, badge }) => {
            const isActive = href === '/parent' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-[3px] relative transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-violet-600 dark:text-violet-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-violet-600 dark:bg-violet-400 rounded-full" />
                )}
                <div className="relative">
                  <Icon size={21} strokeWidth={isActive ? 2.4 : 1.7} />
                  {badge && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                      {badge}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] leading-none tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* More */}
          <button
            onClick={() => setSheetOpen(v => !v)}
            className={`flex-1 flex flex-col items-center justify-center gap-[3px] relative transition-all duration-150 active:scale-95 ${
              moreActive || sheetOpen
                ? 'text-violet-600 dark:text-violet-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {(moreActive || sheetOpen) && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-violet-600 dark:bg-violet-400 rounded-full" />
            )}
            <div className="relative">
              {sheetOpen ? <X size={21} strokeWidth={2.4} /> : <MoreHorizontal size={21} strokeWidth={moreActive ? 2.4 : 1.7} />}
              {moreActive && !sheetOpen && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-violet-600 dark:bg-violet-400 rounded-full border-2 border-white dark:border-[#0d1020]" />
              )}
            </div>
            <span className={`text-[10px] leading-none tracking-tight ${moreActive || sheetOpen ? 'font-bold' : 'font-medium'}`}>
              {moreActive && !sheetOpen ? activeMorePage?.shortLabel : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-[2px]"
          style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* Slide-up sheet */}
      <div
        className={`fixed inset-x-0 z-40 md:hidden transition-transform duration-300 ease-out ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="bg-white dark:bg-[#0d1020] rounded-t-2xl border-t border-x border-gray-100 dark:border-white/8 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)] px-4 pt-3 pb-5 max-h-[70vh] overflow-y-auto">
          <div className="w-10 h-1 bg-slate-200 dark:bg-white/15 rounded-full mx-auto mb-4" />
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">More options</p>
          <div className="grid grid-cols-2 gap-2.5">
            {MORE_PAGES.map(({ href, label, Icon, description, color, badge }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex flex-col gap-2.5 p-3.5 rounded-2xl border transition-all duration-150 active:scale-[0.97] ${
                    isActive
                      ? 'bg-violet-50 dark:bg-violet-500/15 border-violet-200 dark:border-violet-500/30'
                      : 'bg-slate-50 dark:bg-white/4 border-gray-100 dark:border-white/8'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                      <Icon size={17} className="text-white" strokeWidth={2} />
                    </div>
                    {badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-red-50 dark:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/30">
                        {badge}
                      </span>
                    )}
                    {isActive && !badge && (
                      <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse mt-1" />
                    )}
                  </div>
                  <div>
                    <p className={`text-[12px] font-bold leading-tight ${isActive ? 'text-violet-700 dark:text-violet-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">{description}</p>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-semibold mt-auto ${isActive ? 'text-violet-600 dark:text-violet-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-violet-500'}`}>
                    {isActive ? 'Current page' : 'Open'} <ChevronRight size={11} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
