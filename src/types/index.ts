// ─── Role system ───────────────────────────────────────────────────────────

export type Role = 'student' | 'counselor' | 'parent';

export type Language = 'en' | 'fr';

// ─── Programs & probabilities ───────────────────────────────────────────────

export type Province = 'ON' | 'BC' | 'QC' | 'AB' | 'MB' | 'SK' | 'NS' | 'NB';

export type ProbabilityTier = 'high' | 'medium' | 'low';

export interface Program {
  id: string;
  name: string;
  university: string;
  province: Province;
  probability: number;
  admissionAvgRange: string;
  supplementalType: string | null;
  deadline: string | null;
  confidenceProfiles: number;
  confidenceThreshold: number;
  trend: string | null;
}

export interface GradeInput {
  label: string;
  courseCode: string;
  value: number;
  priority: 'high' | 'medium' | 'low';
  requiredFor: number;
}

// ─── Timeline ───────────────────────────────────────────────────────────────

export type TimelineStatus = 'done' | 'now' | 'soon';

export interface TimelineItem {
  id: string;
  date: string;
  label: string;
  sublabel?: string;
  status: TimelineStatus;
}

// ─── MMI Simulator ──────────────────────────────────────────────────────────

export type MMIPhase = 'prep' | 'resp';

export interface MMIStation {
  id: number;
  prompt: string;
  status: 'complete' | 'active' | 'pending';
}

export interface MMIScore {
  clarity: number;
  ethicalDepth: number;
  structure: number;
}

export interface MMIAnnotation {
  id: string;
  type: 'strong' | 'improve' | 'gap';
  text: string;
  tip: string;
}

// ─── Essay / Supplemental ───────────────────────────────────────────────────

export interface EssayRubric {
  programFit: number;
  authenticity: number;
  narrativeArc: number;
  specificity: number;
}

export type TutorStatus = 'reviewing' | 'pending' | 'complete';

export interface TutorAnnotation {
  id: string;
  author: string;
  authorType: 'counselor' | 'ai' | 'tutor';
  text: string;
  timestamp: string;
}

// ─── Chat ────────────────────────────────────────────────────────────────────

export type ChatMessageRole = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  role: ChatMessageRole;
  content: string;
  timestamp: Date;
}

// ─── Toast ───────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  message: string;
  color: string;
}

// ─── Student (Counselor view) ─────────────────────────────────────────────

export type RiskLevel = 'hi' | 'med' | 'lo';

export interface Student {
  id: string;
  initials: string;
  name: string;
  province: Province;
  avgGrade: number;
  programCount: number;
  avgProbability: number;
  riskLevel: RiskLevel;
  bgColor: string;
  textColor: string;
  /** The user id this student's assessment data is stored under, when it differs from `id`. */
  assessmentUserId?: string;
}

export interface EssayQueueItem {
  id: string;
  studentName: string;
  programName: string;
  submittedAgo: string;
  aiScore: number;
  urgent: boolean;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  color: string;
}

// ─── Financial Aid ───────────────────────────────────────────────────────────

export interface TuitionRow {
  programId: string;
  programName: string;
  annualTuition: number;
  details: string;
}

export interface ScholarshipItem {
  id: string;
  name: string;
  amount: string;
  eligibility: 'likely' | 'possible' | 'unlikely';
  details: string;
}

// ─── Milestones ──────────────────────────────────────────────────────────────

export type MilestoneStatus = 'done' | 'in-progress' | 'upcoming';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  status: MilestoneStatus;
  details: string;
}

// ─── Mobile tasks ────────────────────────────────────────────────────────────

export interface MobileTask {
  id: string;
  title: string;
  subtitle: string;
  done: boolean;
}

// ─── Peer network ────────────────────────────────────────────────────────────

export interface PeerProfile {
  id: string;
  anonymousId: string;
  province: Province;
  top6Average: number;
  aifSubmitted: boolean;
  outcome: 'accepted' | 'rejected' | 'waitlisted';
}

// ─── UI state ────────────────────────────────────────────────────────────────

export interface UIState {
  activeRole: Role;
  language: Language;
  sidebarOpen: boolean;
  chatOpen: boolean;
  drawerOpen: boolean;
  activeDrawerStudent: Student | null;
  onboardingStep: number;
  onboardingVisible: boolean;
  kbdHintVisible: boolean;
}

// ─── Dashboard state ─────────────────────────────────────────────────────────

export interface DashboardState {
  programs: Program[];
  expandedProgramId: string | null;
  grades: GradeInput[];
  top6Average: number;
}

// ─── Simulator ───────────────────────────────────────────────────────────────

export interface SimulatorState {
  grades: number[];
  top6Average: number;
  probabilities: number[];
}
