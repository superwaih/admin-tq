'use client';

import { create } from 'zustand';
import type { Role, Language, Student } from '@/src/types';

interface UIStore {
  activeRole: Role;
  language: Language;
  breadcrumb: string;
  chatOpen: boolean;
  drawerOpen: boolean;
  drawerStudent: Student | null;
  onboardingStep: number;
  onboardingVisible: boolean;
  kbdHintVisible: boolean;

  setRole: (role: Role) => void;
  setLanguage: (lang: Language) => void;
  setBreadcrumb: (label: string) => void;
  toggleChat: () => void;
  openDrawer: (student: Student) => void;
  closeDrawer: () => void;
  advanceOnboarding: () => void;
  closeOnboarding: () => void;
  toggleKbdHint: () => void;
  showKbdHint: () => void;
  hideKbdHint: () => void;
}

export const useUI = create<UIStore>((set, get) => ({
  activeRole: 'student',
  language: 'en',
  breadcrumb: 'Dashboard',
  chatOpen: false,
  drawerOpen: false,
  drawerStudent: null,
  onboardingStep: 0,
  onboardingVisible: false,
  kbdHintVisible: false,

  setRole: (role) => set({ activeRole: role }),
  setLanguage: (lang) => set({ language: lang }),
  setBreadcrumb: (label) => set({ breadcrumb: label }),

  toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),

  openDrawer: (student) => set({ drawerOpen: true, drawerStudent: student }),
  closeDrawer: () => set({ drawerOpen: false, drawerStudent: null }),

  advanceOnboarding: () => {
    const next = get().onboardingStep + 1;
    if (next >= 3) {
      set({ onboardingVisible: false, onboardingStep: 0 });
    } else {
      set({ onboardingStep: next });
    }
  },
  closeOnboarding: () => set({ onboardingVisible: false }),

  toggleKbdHint: () => set((s) => ({ kbdHintVisible: !s.kbdHintVisible })),
  showKbdHint: () => set({ kbdHintVisible: true }),
  hideKbdHint: () => set({ kbdHintVisible: false }),
}));
