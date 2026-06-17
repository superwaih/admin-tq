'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/src/hooks/useTheme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  /** Render as a fixed floating button in the top-right corner. */
  floating?: boolean;
  className?: string;
  size?: number;
}

/**
 * Reusable light/dark theme toggle for public pages
 * (landing, pricing, auth, etc.). Uses the global theme store
 * so the choice persists and applies across the whole app.
 */
export default function ThemeToggle({ floating = false, className, size = 16 }: ThemeToggleProps) {
  const theme = useTheme((s) => s.theme);
  const toggleTheme = useTheme((s) => s.toggleTheme);
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border transition-all',
        'h-9 w-9 shrink-0',
        'border-gray-200 bg-white text-slate-600 hover:bg-gray-50 hover:text-slate-900',
        'dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white',
        floating && 'fixed top-4 right-4 z-50 shadow-lg shadow-black/5 dark:shadow-black/40',
        className,
      )}
    >
      {isDark ? <Sun size={size} /> : <Moon size={size} />}
    </button>
  );
}
