'use client';

import { useEffect } from 'react';
import { useTheme } from '@/src/hooks/useTheme';

/**
 * Initializes the global theme (light/dark) on every page.
 * Reads the persisted/system preference and applies the `.dark`
 * class to <html>, then syncs the zustand store so toggles render
 * the correct icon. Renders nothing.
 */
export default function ThemeInit() {
  const initTheme = useTheme((s) => s.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return null;
}
