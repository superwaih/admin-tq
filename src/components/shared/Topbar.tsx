'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { useUI } from '@/src/hooks/useUI';
import { useTheme } from '@/src/hooks/useTheme';
import { STUDENT_PROFILE, STUDENTS } from '@/src/lib/sample-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User, LogOut, Search, Bell, Sun, Moon, Zap,
  MessageSquare, FileText, Calendar, Upload, BookOpen, X, CheckCheck,
} from 'lucide-react';

const RECENT_NOTIFICATIONS = [
  {
    id: 1, type: 'Messages', read: false, timeAgo: '2m ago',
    title: 'New message from Aisha Patel',
    subtitle: 'Thanks for the feedback on my personal statement...',
    icon: <MessageSquare size={13} />,
    bg: 'bg-emerald-100 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    dot: 'bg-emerald-500',
  },
  {
    id: 2, type: 'Applications', read: false, timeAgo: '1h ago',
    title: 'Essay submitted by Ethan Kim',
    subtitle: 'Personal Statement.docx — awaiting your review',
    icon: <FileText size={13} />,
    bg: 'bg-violet-100 dark:bg-violet-500/20',
    iconColor: 'text-violet-600 dark:text-violet-400',
    dot: 'bg-violet-500',
  },
  {
    id: 3, type: 'Sessions', read: false, timeAgo: '3h ago',
    title: 'Interview invitation received',
    subtitle: 'Sophie Martin — MMI Prep session request',
    icon: <Calendar size={13} />,
    bg: 'bg-blue-100 dark:bg-blue-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    dot: 'bg-blue-500',
  },
  {
    id: 4, type: 'Resources', read: true, timeAgo: 'May 16',
    title: 'New resource uploaded',
    subtitle: 'MMI Preparation Guide.pdf — available to students',
    icon: <Upload size={13} />,
    bg: 'bg-pink-100 dark:bg-pink-500/20',
    iconColor: 'text-pink-600 dark:text-pink-400',
    dot: 'bg-pink-500',
  },
  {
    id: 5, type: 'Reviews', read: true, timeAgo: 'May 15',
    title: 'Essay review completed',
    subtitle: 'You reviewed Fatima Bello\'s personal statement',
    icon: <BookOpen size={13} />,
    bg: 'bg-amber-100 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
];

export function Topbar() {
  const { breadcrumb } = useUI();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [notifOpen, setNotifOpen]   = useState(false);
  const [readIds, setReadIds]       = useState<Set<number>>(new Set([4, 5]));
  const notifRef                    = useRef<HTMLDivElement>(null);

  const role = pathname.startsWith('/counselor')
    ? 'counselor'
    : pathname.startsWith('/parent')
    ? 'parent'
    : 'student';

  const initials =
    role === 'counselor'
      ? STUDENT_PROFILE.counselor.split(' ').map((n) => n[0]).join('')
      : STUDENT_PROFILE.initials;

  const unreadCount = RECENT_NOTIFICATIONS.filter(n => !readIds.has(n.id)).length;

  function markAllRead() {
    setReadIds(new Set(RECENT_NOTIFICATIONS.map(n => n.id)));
  }

  function handleProfileUpdate() {
    router.push(`/auth/onboarding/${role}`);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [notifOpen]);

  return (
    <header className="h-14 md:h-20 bg-white dark:bg-[#0d1020] border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 md:px-6 lg:px-10 shrink-0 sticky top-0 z-30 transition-colors duration-200">

      {/* Mobile: brand logo — Desktop: breadcrumb title */}
      <div>
        <div className="flex items-center gap-2 md:hidden">
          <div className={`w-7 h-7 rounded-xl bg-gradient-to-br ${role === 'counselor' ? 'from-cyan-600 to-teal-700' : 'from-blue-600 to-blue-700'} flex items-center justify-center shadow-md`}>
            <Zap size={13} className="text-white" fill="white" />
          </div>
          <span className="text-[16px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">AdmitIQ</span>
        </div>

        <h1 className="hidden md:block text-xl font-bold text-gray-900 dark:text-slate-100">
          {breadcrumb || 'Student Roster'}
        </h1>
        {role === 'counselor' && (
          <p className="hidden md:block text-xs text-gray-400 dark:text-slate-500 font-medium">
            {STUDENT_PROFILE.school} • {STUDENTS.length} students • 2 urgent flags
          </p>
        )}
      </div>

      {/* Actions & Profile Area */}
      <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
        <div className="flex items-center gap-3 md:gap-5">
          <Search className="hidden md:block text-gray-400 dark:text-slate-500 w-5 h-5 cursor-pointer hover:text-gray-600 dark:hover:text-slate-300 transition-colors" />

          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(v => !v)}
              className="relative p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="text-gray-400 dark:text-slate-500 w-5 h-5 hover:text-gray-600 dark:hover:text-slate-300 transition-colors" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center bg-red-500 rounded-full border-2 border-white dark:border-[#0d1020] text-[9px] font-bold text-white px-0.5">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown panel */}
            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-[360px] bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/8 shadow-2xl shadow-gray-200/60 dark:shadow-black/50 z-50 overflow-hidden">

                {/* Panel header */}
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-50 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Notifications</p>
                    {unreadCount > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="flex items-center gap-1 text-[11px] font-semibold text-cyan-600 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors"
                      >
                        <CheckCheck size={12} /> Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Notification list */}
                <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50 dark:divide-white/[0.04]">
                  {RECENT_NOTIFICATIONS.map(n => {
                    const isUnread = !readIds.has(n.id);
                    return (
                      <button
                        key={n.id}
                        onClick={() => setReadIds(prev => new Set([...prev, n.id]))}
                        className={`w-full flex items-start gap-3 px-4 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${isUnread ? 'bg-cyan-50/40 dark:bg-cyan-500/[0.04]' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-xl ${n.bg} ${n.iconColor} flex items-center justify-center shrink-0 mt-0.5`}>
                          {n.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className={`text-xs font-semibold truncate ${isUnread ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#c8ccdf]'}`}>
                              {n.title}
                            </p>
                            <span className="text-[10px] text-slate-400 dark:text-[#8e92ad] shrink-0">{n.timeAgo}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5 truncate">{n.subtitle}</p>
                        </div>
                        {isUnread && (
                          <div className={`w-2 h-2 rounded-full ${n.dot} shrink-0 mt-1.5`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Footer */}
                <div className="px-4 py-3 border-t border-gray-50 dark:border-white/5">
                  <Link
                    href="/counselor/notifications"
                    onClick={() => setNotifOpen(false)}
                    className="flex items-center justify-center w-full py-2 rounded-xl bg-gray-50 dark:bg-white/[0.03] hover:bg-gray-100 dark:hover:bg-white/8 text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:text-slate-800 dark:hover:text-white transition-colors"
                  >
                    View All Notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dark / light toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-700 dark:hover:text-slate-200 transition-all"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden md:block">
                <p className={`text-xs font-bold text-gray-900 dark:text-slate-100 ${role === 'counselor' ? 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400' : 'group-hover:text-blue-600 dark:group-hover:text-blue-400'} transition-colors`}>
                  {user?.first_name
                    ? `${user.first_name} ${user.last_name || ''}`
                    : 'Counselor Admin'}
                </p>
                <p className="text-[10px] text-gray-400 dark:text-slate-500 font-medium">
                  {user?.email || 'admin@admitiq.ca'}
                </p>
              </div>

              <div className="relative">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${role === 'counselor' ? 'bg-cyan-600 shadow-cyan-100 dark:shadow-cyan-900/20' : 'bg-blue-600 shadow-blue-100 dark:shadow-blue-900/20'}`}>
                  {user?.first_name
                    ? user.first_name.charAt(0).toUpperCase()
                    : initials}
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 border-2 border-white dark:border-[#0d1020]" />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 rounded-xl border-gray-100 dark:border-white/8 dark:bg-[#161a27] shadow-xl shadow-gray-200/50 dark:shadow-black/40"
          >
            <DropdownMenuItem
              onClick={handleProfileUpdate}
              className="py-2.5 cursor-pointer gap-2 dark:text-slate-200 dark:hover:bg-white/5"
            >
              <User className="h-4 w-4 text-gray-400 dark:text-slate-500" />
              <span className="text-sm font-medium">Account Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-gray-50 dark:bg-white/5" />
            <DropdownMenuItem
              onClick={logout}
              className="py-2.5 cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-bold">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
