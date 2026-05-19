'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, Calendar,
  FileText, Mic, BarChart3, BookOpen,
  MessageSquare, Settings, MoreHorizontal, X, ChevronRight,
} from 'lucide-react';

const PRIMARY_TABS = [
  { href: '/counselor',                  label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/counselor/student-requests', label: 'Requests',  Icon: Users, badge: '12' },
  { href: '/counselor/my-students',      label: 'Students',  Icon: GraduationCap },
  { href: '/counselor/session-schedule', label: 'Schedule',  Icon: Calendar },
];

const MORE_PAGES = [
  {
    href: '/counselor/essay-reviews',
    label: 'Essay Reviews',
    shortLabel: 'Essays',
    Icon: FileText,
    description: 'Review and score student admission essays',
    color: 'from-blue-500 to-indigo-600',
    badge: '8',
  },
  {
    href: '/counselor/mmi-coaching',
    label: 'MMI Coaching',
    shortLabel: 'MMI',
    Icon: Mic,
    description: 'Prepare students for multi-mini interviews',
    color: 'from-violet-500 to-purple-600',
    badge: '5',
  },
  {
    href: '/counselor/analytics',
    label: 'Analytics',
    shortLabel: 'Analytics',
    Icon: BarChart3,
    description: 'Insights into student performance & outcomes',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    href: '/counselor/resources',
    label: 'Resources',
    shortLabel: 'Resources',
    Icon: BookOpen,
    description: 'Curated resources for student success',
    color: 'from-amber-500 to-orange-500',
  },
  {
    href: '/counselor/messages',
    label: 'Messages',
    shortLabel: 'Messages',
    Icon: MessageSquare,
    description: 'Communicate with students and parents',
    color: 'from-sky-500 to-cyan-600',
    badge: '3',
  },
  {
    href: '/counselor/settings',
    label: 'Settings',
    shortLabel: 'Settings',
    Icon: Settings,
    description: 'Manage your account and preferences',
    color: 'from-slate-500 to-slate-600',
  },
];

function isMoreActive(pathname: string) {
  return MORE_PAGES.some(p => pathname.startsWith(p.href));
}

const ACCENT = '#0284c7';

export function CounselorMobileNav() {
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
      {/* ── Bottom nav bar ──────────────────────────────── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white dark:bg-[#0d1020] border-t border-gray-100 dark:border-white/8 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch h-[60px]">
          {PRIMARY_TABS.map(({ href, label, Icon, badge }) => {
            const isActive = href === '/counselor' ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-[3px] relative transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-sky-600 dark:text-sky-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-sky-600 dark:bg-sky-400 rounded-full" />
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

          {/* More button */}
          <button
            onClick={() => setSheetOpen(v => !v)}
            className={`flex-1 flex flex-col items-center justify-center gap-[3px] relative transition-all duration-150 active:scale-95 ${
              moreActive || sheetOpen
                ? 'text-sky-600 dark:text-sky-400'
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            {(moreActive || sheetOpen) && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-sky-600 dark:bg-sky-400 rounded-full" />
            )}
            <div className="relative">
              {sheetOpen ? <X size={21} strokeWidth={2.4} /> : <MoreHorizontal size={21} strokeWidth={moreActive ? 2.4 : 1.7} />}
              {moreActive && !sheetOpen && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-600 dark:bg-sky-400 rounded-full border-2 border-white dark:border-[#0d1020]" />
              )}
            </div>
            <span className={`text-[10px] leading-none tracking-tight ${moreActive || sheetOpen ? 'font-bold' : 'font-medium'}`}>
              {moreActive && !sheetOpen ? activeMorePage?.shortLabel : 'More'}
            </span>
          </button>
        </div>
      </nav>

      {/* ── Backdrop ────────────────────────────────────── */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-[2px]"
          style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* ── Slide-up sheet ──────────────────────────────── */}
      <div
        className={`fixed inset-x-0 z-40 md:hidden transition-transform duration-300 ease-out ${sheetOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="bg-white dark:bg-[#0d1020] rounded-t-2xl border-t border-x border-gray-100 dark:border-white/8 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)] px-4 pt-3 pb-4">
          <div className="w-10 h-1 bg-slate-200 dark:bg-white/15 rounded-full mx-auto mb-4" />
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">More tools</p>
          <div className="grid grid-cols-2 gap-2.5">
            {MORE_PAGES.map(({ href, label, Icon, description, color, badge }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex flex-col gap-2.5 p-3.5 rounded-2xl border transition-all duration-150 active:scale-[0.97] ${
                    isActive
                      ? 'bg-sky-50 dark:bg-sky-500/15 border-sky-200 dark:border-sky-500/30'
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
                      <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse mt-1" />
                    )}
                  </div>
                  <div>
                    <p className={`text-[12px] font-bold leading-tight ${isActive ? 'text-sky-700 dark:text-sky-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">{description}</p>
                  </div>
                  <div className={`flex items-center gap-0.5 text-[10px] font-semibold mt-auto ${isActive ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-sky-500'}`}>
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
