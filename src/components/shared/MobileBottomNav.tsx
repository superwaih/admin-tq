'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, FileText, Mic,
  MoreHorizontal, Lightbulb, BarChart2, GraduationCap,
  TrendingUp, X, ChevronRight, Settings, ClipboardList, Compass,
} from 'lucide-react';

interface PrimaryTab {
  href: string;
  label: string;
  Icon: React.ElementType;
  badge?: string;
}

interface MorePage {
  href: string;
  label: string;
  shortLabel: string;
  Icon: React.ElementType;
  description: string;
  color: string;
  badge?: string;
}

// ── Per-pathway tab builders ────────────────────────────────────────────────

function buildPrimaryTabs(basePath: string, vocational: boolean): PrimaryTab[] {
  if (vocational) {
    return [
      { href: basePath,                    label: 'Home',       Icon: LayoutDashboard },
      { href: `${basePath}/milestones`,    label: 'Milestones', Icon: ClipboardList },
      { href: `${basePath}/career`,        label: 'Career',     Icon: Compass },
      { href: `${basePath}/mmi`,           label: 'MMI',        Icon: Mic },
    ];
  }
  return [
    { href: basePath,                label: 'Home',     Icon: LayoutDashboard },
    { href: `${basePath}/programs`,  label: 'Programs', Icon: BookOpen },
    { href: `${basePath}/essay`,     label: 'Essay',    Icon: FileText, badge: '2' },
    { href: `${basePath}/mmi`,       label: 'MMI',      Icon: Mic },
  ];
}

function buildMorePages(basePath: string): MorePage[] {
  return [
    {
      href: `${basePath}/strategy`,
      label: 'Strategy Advisor',
      shortLabel: 'Strategy',
      Icon: Lightbulb,
      description: 'Get a personalised admissions roadmap',
      color: 'from-violet-500 to-purple-600',
      badge: 'PRO',
    },
    {
      href: `${basePath}/simulator`,
      label: 'Admission Simulator',
      shortLabel: 'Simulator',
      Icon: TrendingUp,
      description: 'Predict your acceptance chances',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      href: `${basePath}/grades`,
      label: 'Grade Tracker',
      shortLabel: 'Grades',
      Icon: BarChart2,
      description: 'Monitor your academic progress',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      href: `${basePath}/counselors`,
      label: 'Counsellor Directory',
      shortLabel: 'Counsellors',
      Icon: GraduationCap,
      description: 'Book 1-on-1 expert guidance sessions',
      color: 'from-amber-500 to-orange-600',
    },
    {
      href: `${basePath}/settings`,
      label: 'Settings',
      shortLabel: 'Settings',
      Icon: Settings,
      description: 'Manage your account and preferences',
      color: 'from-slate-500 to-slate-600',
    },
  ];
}

// ── Component ──────────────────────────────────────────────────────────────

interface MobileBottomNavProps {
  basePath: string;
  vocational?: boolean;
}

export function MobileBottomNav({ basePath, vocational = false }: MobileBottomNavProps) {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);

  const primaryTabs = buildPrimaryTabs(basePath, vocational);
  const morePages = buildMorePages(basePath);

  // Close sheet on route change
  useEffect(() => { setSheetOpen(false); }, [pathname]);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (sheetOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sheetOpen]);

  const moreActive = morePages.some(p => pathname.startsWith(p.href));
  const activeMorePage = morePages.find(p => pathname.startsWith(p.href));

  return (
    <>
      {/* ── Bottom nav bar ──────────────────────────────────── */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-white dark:bg-[#0d1020] border-t border-gray-100 dark:border-white/8 shadow-[0_-4px_24px_rgba(0,0,0,0.07)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-stretch h-[60px]">

          {/* Primary tabs */}
          {primaryTabs.map(({ href, label, Icon, badge }) => {
            const isActive =
              href === basePath ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center justify-center gap-[3px] relative transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {isActive && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-blue-600 dark:bg-blue-400 rounded-full" />
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
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            {(moreActive || sheetOpen) && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-9 h-[3px] bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
            <div className="relative">
              {sheetOpen
                ? <X size={21} strokeWidth={2.4} />
                : <MoreHorizontal size={21} strokeWidth={moreActive ? 2.4 : 1.7} />
              }
              {/* Dot indicator when a "more" page is active */}
              {moreActive && !sheetOpen && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full border-2 border-white dark:border-[#0d1020]" />
              )}
            </div>
            <span className={`text-[10px] leading-none tracking-tight ${moreActive || sheetOpen ? 'font-bold' : 'font-medium'}`}>
              {moreActive && !sheetOpen ? activeMorePage?.shortLabel : 'More'}
            </span>
          </button>

        </div>
      </nav>

      {/* ── Backdrop ────────────────────────────────────────── */}
      {sheetOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-[2px]"
          style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
          onClick={() => setSheetOpen(false)}
        />
      )}

      {/* ── Slide-up sheet ──────────────────────────────────── */}
      <div
        className={`fixed inset-x-0 z-40 md:hidden transition-transform duration-300 ease-out ${
          sheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ bottom: 'calc(60px + env(safe-area-inset-bottom, 0px))' }}
      >
        <div className="bg-white dark:bg-[#0d1020] rounded-t-2xl border-t border-x border-gray-100 dark:border-white/8 shadow-[0_-8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_32px_rgba(0,0,0,0.5)] px-4 pt-3 pb-4">

          {/* Drag handle */}
          <div className="w-10 h-1 bg-slate-200 dark:bg-white/15 rounded-full mx-auto mb-4" />

          {/* Section label */}
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 px-1">
            More pages
          </p>

          {/* Page grid — 2 columns */}
          <div className="grid grid-cols-2 gap-2.5">
            {morePages.map(({ href, label, Icon, description, color, badge }) => {
              const isActive = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex flex-col gap-2.5 p-3.5 rounded-2xl border transition-all duration-150 active:scale-[0.97] ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30'
                      : 'bg-slate-50 dark:bg-white/4 border-gray-100 dark:border-white/8 hover:border-blue-200 dark:hover:border-blue-500/20'
                  }`}
                >
                  {/* Icon + badge */}
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
                      <Icon size={17} className="text-white" strokeWidth={2} />
                    </div>
                    {badge && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-400 border border-violet-200 dark:border-violet-500/30">
                        {badge}
                      </span>
                    )}
                    {isActive && !badge && (
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1" />
                    )}
                  </div>

                  {/* Label + description */}
                  <div>
                    <p className={`text-[12px] font-bold leading-tight ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-slate-200'}`}>
                      {label}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-snug mt-0.5">
                      {description}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className={`flex items-center gap-0.5 text-[10px] font-semibold mt-auto ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-blue-500 dark:group-hover:text-blue-400'}`}>
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
