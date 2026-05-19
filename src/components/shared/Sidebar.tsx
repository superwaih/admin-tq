'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from '@/src/hooks/useTheme';
import {
  LayoutDashboard, TrendingUp, BookOpen, FileText,
  Mic, Lightbulb, GraduationCap, Users,
  HelpCircle, ChevronRight, Sparkles, ShieldCheck,
  Calendar, MessageSquare, Clock, Wallet, Zap,
  ArrowUpRight, BarChart3, Settings, Star,
  ClipboardList, UserCheck, School, CreditCard,
  Activity, Bell,
} from 'lucide-react';

export type RoleType = 'student' | 'counselor' | 'parent';

interface MenuItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  premium?: boolean;
}

interface ThemeConfig {
  accent: string;
  accentLight: string;
  accentDark: string;
  gradient: string;
  dot: string;
  roleLabel: string;
  menu: MenuItem[];
}

interface SidebarProps {
  role: RoleType;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const config = useMemo((): ThemeConfig => {
    const themes: Record<RoleType, ThemeConfig> = {
      student: {
        accent: '#2563EB',
        accentLight: '#EFF6FF',
        accentDark: 'rgba(37,99,235,0.18)',
        gradient: 'from-blue-600 to-blue-700',
        dot: 'bg-blue-500',
        roleLabel: 'Student Console',
        menu: [
          { href: '/student',            label: 'Dashboard',           icon: <LayoutDashboard size={18} /> },
          { href: '/student/simulator',  label: 'Admission Simulator', icon: <TrendingUp size={18} /> },
          { href: '/student/programs',   label: 'My Programs',         icon: <BookOpen size={18} /> },
          { href: '/student/essay',      label: 'Essay Coach',         icon: <FileText size={18} />, badge: '2' },
          { href: '/student/mmi',        label: 'MMI Simulator',       icon: <Mic size={18} /> },
          { href: '/student/strategy',   label: 'Strategy Advisor',    icon: <Lightbulb size={18} />, premium: true },
          { href: '/student/grades',     label: 'Grade Tracker',       icon: <GraduationCap size={18} /> },
          { href: '/student/counselors', label: 'Counsellor Directory', icon: <Users size={18} /> },
          { href: '/student/settings',   label: 'Settings',            icon: <Settings size={18} /> },
        ],
      },
      counselor: {
        accent: '#0891b2',
        accentLight: '#ecfeff',
        accentDark: 'rgba(8,145,178,0.18)',
        gradient: 'from-cyan-600 to-teal-700',
        dot: 'bg-cyan-500',
        roleLabel: 'Counselor Console',
        menu: [
          { href: '/counselor',                   label: 'Dashboard',        icon: <LayoutDashboard size={18} /> },
          { href: '/counselor/student-requests',  label: 'Student Requests', icon: <Users size={18} />, badge: '12' },
          { href: '/counselor/my-students',       label: 'My Students',      icon: <GraduationCap size={18} /> },
          { href: '/counselor/session-schedule',  label: 'Session Schedule', icon: <Calendar size={18} /> },
          { href: '/counselor/essay-reviews',     label: 'Essay Reviews',    icon: <FileText size={18} />, badge: '8' },
          { href: '/counselor/mmi-coaching',      label: 'MMI Coaching',     icon: <Mic size={18} />, badge: '5' },
          { href: '/counselor/analytics',         label: 'Analytics',        icon: <BarChart3 size={18} /> },
          { href: '/counselor/resources',         label: 'Resources',        icon: <BookOpen size={18} /> },
          { href: '/counselor/messages',          label: 'Messages',         icon: <MessageSquare size={18} />, badge: '3' },
          { href: '/counselor/settings',          label: 'Settings',         icon: <Settings size={18} /> },
        ],
      },
      parent: {
        accent: '#7c3aed',
        accentLight: '#F5F3FF',
        accentDark: 'rgba(124,58,237,0.18)',
        gradient: 'from-violet-600 to-violet-700',
        dot: 'bg-violet-500',
        roleLabel: 'Parent Console',
        menu: [
          { href: '/parent',                    label: 'My Children',       icon: <Users size={18} /> },
          { href: '/parent/academic-progress',  label: 'Academic Progress', icon: <TrendingUp size={18} /> },
          { href: '/parent/assignments',        label: 'Assignments',       icon: <ClipboardList size={18} />, badge: '12' },
          { href: '/parent/grades',             label: 'Grades',            icon: <GraduationCap size={18} /> },
          { href: '/parent/attendance',         label: 'Attendance',        icon: <UserCheck size={18} /> },
          { href: '/parent/behaviour',          label: 'Behaviour',         icon: <Activity size={18} /> },
          { href: '/parent/messages',           label: 'Messages',          icon: <MessageSquare size={18} />, badge: '3' },
          { href: '/parent/schedule',           label: 'Schedule',          icon: <Calendar size={18} /> },
          { href: '/parent/school-events',      label: 'School Events',     icon: <School size={18} /> },
          { href: '/parent/resources',          label: 'Resources',         icon: <BookOpen size={18} /> },
          { href: '/parent/payment',            label: 'Payment',           icon: <CreditCard size={18} /> },
          { href: '/parent/settings',           label: 'Settings',          icon: <Settings size={18} /> },
        ],
      },
    };
    return themes[role] ?? themes.student;
  }, [role]);

  return (
    <aside className="w-64 xl:w-[17.5rem] bg-white dark:bg-[#0d1020] border-r border-gray-100/80 dark:border-white/5 flex flex-col h-full shrink-0 shadow-[1px_0_20px_0_rgba(0,0,0,0.04)] dark:shadow-[1px_0_20px_0_rgba(0,0,0,0.3)] transition-colors duration-200">

      {/* ── Brand ───────────────────────────────────────── */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md shrink-0', config.gradient)}>
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <span className="text-[17px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">AdmitIQ</span>
          <span
            className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-md text-white ml-0.5 shrink-0"
            style={{ backgroundColor: config.accent }}
          >
            {role === 'student' ? 'Beta' : role === 'counselor' ? 'Pro' : 'Plus'}
          </span>
          {role === 'counselor' && <ShieldCheck size={15} className="text-sky-500 ml-auto shrink-0" />}
        </div>
        <div className="flex items-center gap-1.5 mt-2 pl-0.5">
          <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse shrink-0', config.dot)} />
          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-600 uppercase tracking-widest truncate">
            {config.roleLabel}
          </p>
        </div>
      </div>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent" />

      {/* ── Navigation ──────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-3.5 overflow-y-auto">
        {config.menu.map((item: MenuItem) => {
          const isActive =
            item.href === `/${role}`
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 group relative',
                isActive
                  ? 'font-semibold shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-slate-700 dark:hover:text-slate-200',
              )}
              style={
                isActive
                  ? {
                      backgroundColor: theme === 'dark' ? config.accentDark : config.accentLight,
                      color: config.accent,
                    }
                  : {}
              }
            >
              {/* Active indicator stripe */}
              {isActive && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ backgroundColor: config.accent }}
                />
              )}

              <div className="flex items-center gap-3 min-w-0">
                <span className={cn('shrink-0 transition-colors', isActive ? '' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300')}>
                  {item.icon}
                </span>
                <span className="text-[13px] leading-none truncate">{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-bold text-white min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5 shadow-sm bg-red-500 shrink-0 ml-1">
                  {item.badge}
                </span>
              )}
              {item.premium && !isActive && (
                <div className="flex items-center gap-0.5 bg-blue-50 dark:bg-blue-500/15 px-1.5 py-0.5 rounded-md shrink-0">
                  <Sparkles size={10} className="text-blue-400" />
                  <span className="text-[9px] font-bold text-blue-400 uppercase tracking-wide">Pro</span>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Divider ─────────────────────────────────────── */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-gray-100 dark:via-white/5 to-transparent" />

      {/* ── Upgrade card ─────────────────────────────────── */}
      {role === 'student' && (
        <div className="mx-3 my-3">
          <div className={cn('relative overflow-hidden rounded-2xl bg-gradient-to-br p-4', config.gradient)}>
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute -bottom-6 -left-2 w-20 h-20 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={12} className="text-yellow-300" />
                <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Guided Plan</p>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug">
                Unlock unlimited programs + MMI prep
              </h4>
              <p className="text-[10px] text-blue-200 mt-1 mb-2.5 leading-relaxed">
                Get personalized strategy, AI essay coach & more.
              </p>
              <Link
                href="/upgrade"
                className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-white rounded-xl text-[11px] font-bold transition-all hover:bg-black hover:text-white group"
                style={{ color: config.accent }}
              >
                Upgrade to Guided <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {role === 'counselor' && (
        <div className="mx-3 my-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Star size={12} className="text-white fill-white" />
                <p className="text-[10px] font-bold text-cyan-100 uppercase tracking-widest">Essential Plan</p>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug">
                Upgrade for unlimited programs + MMI prep
              </h4>
              <Link
                href="/upgrade"
                className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-1.5 bg-white rounded-xl text-[11px] font-bold text-cyan-600 transition-all hover:bg-cyan-50"
              >
                Upgrade to Guided <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {role === 'parent' && (
        <div className="mx-3 my-3">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 p-4">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="absolute -bottom-5 -left-2 w-16 h-16 rounded-full bg-white/5" />
            <div className="relative">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Star size={12} className="text-yellow-300 fill-yellow-300" />
                <p className="text-[10px] font-bold text-violet-100 uppercase tracking-widest">Upgrade to Premium</p>
              </div>
              <h4 className="text-xs font-bold text-white leading-snug">
                Unlock advanced tools, analytics and priority support.
              </h4>
              <Link
                href="/upgrade"
                className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-1.5 bg-white rounded-xl text-[11px] font-bold text-violet-600 transition-all hover:bg-violet-50"
              >
                Upgrade Now <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Footer ──────────────────────────────────────── */}
      <div className="px-3 pb-4">
        <Link
          href="/help"
          className="w-full flex items-center justify-between px-3 py-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl text-sm transition-all group"
        >
          <div className="flex items-center gap-3">
            <HelpCircle size={17} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
            <span className="text-[13px] font-medium">Help & Support</span>
          </div>
          <ChevronRight size={13} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 transition-colors" />
        </Link>
      </div>
    </aside>
  );
}
