'use client';

import { create } from 'zustand';
import { useEffect } from 'react';
import { useBaseDashboard } from './useBaseDashboard';
import { probabilityColor } from '@/lib/utils';
import { GRADES, TOP6_AVERAGE } from '@/src/lib/sample-data';

interface ProgramProbability {
  id: string;
  probability: number;
}

interface DashboardStore {
  grades: number[];
  expandedProgramId: string | null;
  bannerVisible: boolean;
  setGrades: (grades: number[]) => void;
  updateGrade: (index: number, value: number) => void;
  toggleProgram: (id: string) => void;
  dismissBanner: () => void;
}

// Initialise store with sample-data grades so the page renders immediately
// without needing any API response.
const DEFAULT_GRADES = GRADES.map((g) => g.value);

export const useDashboardStore = create<DashboardStore>((set) => ({
  grades: DEFAULT_GRADES,
  expandedProgramId: null,
  bannerVisible: true,
  setGrades: (grades) => set({ grades }),
  updateGrade: (index, value) =>
    set((state) => {
      const newGrades = [...state.grades];
      newGrades[index] = value;
      return { grades: newGrades };
    }),
  toggleProgram: (id) =>
    set((state) => ({
      expandedProgramId: state.expandedProgramId === id ? null : id,
    })),
  dismissBanner: () => set({ bannerVisible: false }),
}));

function calcProbabilities(avg: number): ProgramProbability[] {
  const g = avg - 95;
  return [
    { id: 'uoft',     probability: Math.min(95, Math.max(5,  Math.round(50 + g * 8))) },
    { id: 'waterloo', probability: Math.min(95, Math.max(5,  Math.round(55 + (avg - 94) * 9))) },
    { id: 'mcmaster', probability: Math.min(70, Math.max(5,  Math.round(25 + (avg - 93) * 4))) },
    { id: 'ubc',      probability: Math.min(98, Math.max(20, Math.round(75 + (avg - 90) * 4))) },
    { id: 'queens',   probability: Math.min(99, Math.max(30, Math.round(85 + (avg - 87) * 5))) },
  ];
}

export function useStudentDashboard() {
  // Only calls the API when a real token is present; returns null otherwise.
  const { data, loading, error } = useBaseDashboard<any>('/api/v1/users/me');
  const store = useDashboardStore();

  // If the API responds with grade fields, sync them into the store.
  // Otherwise the store's sample-data defaults are used as-is.
  useEffect(() => {
    if (!data) return;
    const gradeValues = [
      data.ENG4U, data.MCV4U, data.MHF4U, data.SPH4U, data.SCH4U, data.BIO4U,
    ].filter((g): g is number => g !== null && g !== undefined);
    if (gradeValues.length > 0) {
      store.setGrades(gradeValues);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentAvg =
    store.grades.length > 0
      ? store.grades.reduce((a, b) => a + b, 0) / store.grades.length
      : TOP6_AVERAGE;

  const liveProbabilities = calcProbabilities(currentAvg);

  return {
    loading,
    error,
    ...store,
    top6Avg: currentAvg,
    simulatedProbabilities: liveProbabilities,
    calcProbabilities,
    probabilityColor,
  };
}
