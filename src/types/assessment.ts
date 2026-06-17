// ─── Student Personality Assessment types ───────────────────────────────────

export type LearnNew = 'hands-on' | 'mix' | 'reading';
export type SpendTime = 'making' | 'balance' | 'researching';
export type FutureStudy = 'working' | 'either' | 'academic';
export type GradeTrend = 'improving' | 'holding' | 'slipping';

export interface SubjectGrade {
  subject: string;
  grade: string;
}

export interface ProfileStep {
  studentFullName: string;
  preferredName: string;
  age: string;
  gradeLevel: string;
  province: string;
  schoolCity: string;
  educatorName: string;
  educatorRole: string;
  // Academic snapshot
  subjectsStudied: string[];
  overallAchievements: string;
  strongestSubjects: string;
  // Current grades
  overallAverage: string;
  recentTerm: string;
  gradeTrend: GradeTrend | '';
  subjectGrades: SubjectGrade[];
  educatorAchievementNote: string;
  // Learning style
  learnNew: LearnNew | '';
  spendTime: SpendTime | '';
  futureStudy: FutureStudy | '';
  educatorLearningNote: string;
}

export interface InterestsStep {
  // 8 activities A–H rated 1–5
  activities: Record<string, number>;
  mostEnjoyDoing: string;
  jobCurious: string;
  educatorInterestsNote: string;
}

export interface SkillsStep {
  // 8 skills, student + educator rating 1–5
  student: Record<string, number>;
  educator: Record<string, number>;
  confidentlyGoodAt: string;
  wantToImprove: string;
  educatorAptitudesNote: string;
}

export interface ValuesStep {
  workValues: string[]; // up to 5
  pathwayLeaning: string; // apprenticeship | undecided | college
  pathwayImportance: string; // very | somewhat | not
  specificOccupation: string;
  confidence: string; // support | on-track | comfortable
  factors: string[];
  educatorReadinessNote: string;
}

export interface AssessmentData {
  profile: ProfileStep;
  interests: InterestsStep;
  skills: SkillsStep;
  values: ValuesStep;
}

// ─── Computed results ───────────────────────────────────────────────────────

export interface OccupationMatch {
  title: string;
  description: string;
  match: number;
  salary: string;
  route: string;
}

export interface ProgramEligibility {
  match: string;
  route: string;
  english: string;
  math: string;
  science: string;
  yourAverage: string;
  eligible: 'On Track' | 'Needs Work' | 'Eligible';
}

export interface RecommendedProgram {
  institution: string;
  program: string;
  tag: string;
}

export interface ScholarshipItem {
  name: string;
  amount: string;
  detail: string;
}

export interface AssessmentResults {
  studentName: string;
  initials: string;
  gradeProvince: string;
  academicStrength: string;
  topInterestArea: string;
  strongestSkills: string;
  careerDirection: string;
  // pathway fit
  collegeUniversityFit: number;
  apprenticeshipFit: number;
  // radar (8 skills, blended)
  skillProfile: { label: string; value: number }[];
  occupationalMatches: OccupationMatch[];
  programEligibility: ProgramEligibility[];
  recommendedPrograms: RecommendedProgram[];
  scholarships: ScholarshipItem[];
  // theme mapping
  functionalLens: string;
  coreMotivation: string;
  learningStyle: string;
  // narrative outputs
  strengths: string[];
  challenges: string[];
  recommendedPathway: string;
  studentActions: string[];
  educatorActions: string[];
  summary: string;
  profileSummary: string;
  computedAt: string;
}

export interface AssessmentRecord {
  responses: AssessmentData;
  results: AssessmentResults;
  completed: boolean;
  completedAt: string | null;
}
