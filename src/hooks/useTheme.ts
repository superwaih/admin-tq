'use client';

import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  initTheme: () => void;
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useTheme = create<ThemeStore>((set, get) => ({
  theme: 'light',

  initTheme: () => {
    const stored = localStorage.getItem('admitiq-theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved: Theme = stored ?? (prefersDark ? 'dark' : 'light');
    applyTheme(resolved);
    set({ theme: resolved });
  },

  setTheme: (t) => {
    localStorage.setItem('admitiq-theme', t);
    applyTheme(t);
    set({ theme: t });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('admitiq-theme', next);
    applyTheme(next);
    set({ theme: next });
  },
}));
