'use client';

import React, { createContext, useContext } from 'react';
import type {
  AssessmentData, ProfileStep, InterestsStep, SkillsStep, ValuesStep,
} from '@/src/types/assessment';

export const EMPTY_ASSESSMENT: AssessmentData = {
  profile: {
    studentFullName: '', preferredName: '', age: '', gradeLevel: '', province: '',
    schoolCity: '', educatorName: '', educatorRole: '',
    subjectsStudied: [], overallAchievements: '', strongestSubjects: '',
    overallAverage: '', recentTerm: '', gradeTrend: '',
    subjectGrades: [
      { subject: 'English / Français', grade: '' },
      { subject: 'Mathematics', grade: '' },
      { subject: 'Science', grade: '' },
    ],
    educatorAchievementNote: '',
    learnNew: '', spendTime: '', futureStudy: '', educatorLearningNote: '',
  },
  interests: { activities: {}, mostEnjoyDoing: '', jobCurious: '', educatorInterestsNote: '' },
  skills: { student: {}, educator: {}, confidentlyGoodAt: '', wantToImprove: '', educatorAptitudesNote: '' },
  values: {
    workValues: [], pathwayLeaning: '', pathwayImportance: '', specificOccupation: '',
    confidence: '', factors: [], educatorReadinessNote: '',
  },
};

interface Ctx {
  data: AssessmentData;
  setProfile: (patch: Partial<ProfileStep>) => void;
  setInterests: (patch: Partial<InterestsStep>) => void;
  setSkills: (patch: Partial<SkillsStep>) => void;
  setValues: (patch: Partial<ValuesStep>) => void;
}

const AssessmentContext = createContext<Ctx | null>(null);

export function AssessmentProvider({ value, children }: { value: Ctx; children: React.ReactNode }) {
  return <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>;
}

export function useAssessment(): Ctx {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error('useAssessment must be used within AssessmentProvider');
  return ctx;
}
