import type {
  Program,
  GradeInput,
  TimelineItem,
  Student,
  EssayQueueItem,
  Notification,
  TuitionRow,
  ScholarshipItem,
  Milestone,
  PeerProfile,
} from '@/src/types';

// ── Student profile ──────────────────────────────────────────────────────────

export const STUDENT_PROFILE = {
  name: 'Priya Mehta',
  initials: 'PM',
  province: 'ON' as const,
  grade: 12,
  school: 'Ridgemont High School',
  counselor: 'J. Lee',
  daysToOUAC: 47,
  appProgress: 60,
  plan: 'Guided · $149/mo',
  sessionsRemaining: 2,
};

// ── Programs ─────────────────────────────────────────────────────────────────

export const PROGRAMS: Program[] = [
  {
    id: 'uoft',
    name: 'Engineering Science',
    university: 'University of Toronto',
    province: 'ON',
    probability: 72,
    admissionAvgRange: '95–97%',
    supplementalType: 'AIF required',
    deadline: 'Dec 1',
    confidenceProfiles: 38,
    confidenceThreshold: 30,
    trend: '↑ +6% this week',
  },
  {
    id: 'waterloo',
    name: 'Comp Eng (co-op)',
    university: 'University of Waterloo',
    province: 'ON',
    probability: 58,
    admissionAvgRange: '93–96%',
    supplementalType: 'AIF required',
    deadline: 'Dec 1',
    confidenceProfiles: 24,
    confidenceThreshold: 30,
    trend: null,
  },
  {
    id: 'mcmaster',
    name: 'iBSc Health Sciences',
    university: 'McMaster University',
    province: 'ON',
    probability: 31,
    admissionAvgRange: '94–97% + MMI',
    supplementalType: 'Supp + MMI',
    deadline: null,
    confidenceProfiles: 11,
    confidenceThreshold: 30,
    trend: null,
  },
  {
    id: 'ubc',
    name: 'Science (Vancouver)',
    university: 'UBC',
    province: 'BC',
    probability: 89,
    admissionAvgRange: '88–93%',
    supplementalType: 'Personal Profile',
    deadline: null,
    confidenceProfiles: 41,
    confidenceThreshold: 30,
    trend: null,
  },
  {
    id: 'queens',
    name: 'Computing',
    university: "Queen's University",
    province: 'ON',
    probability: 94,
    admissionAvgRange: '85–91%',
    supplementalType: 'None required',
    deadline: 'Feb 1',
    confidenceProfiles: 47,
    confidenceThreshold: 30,
    trend: null,
  },
];

export const AVG_PROBABILITY = Math.round(
  PROGRAMS.reduce((s, p) => s + p.probability, 0) / PROGRAMS.length,
);

// ── Grades ────────────────────────────────────────────────────────────────────

export const GRADES: GradeInput[] = [
  { label: 'Advanced Functions', courseCode: 'MHF4U', value: 92, priority: 'high', requiredFor: 3 },
  { label: 'Calculus & Vectors', courseCode: 'MCV4U', value: 89, priority: 'high', requiredFor: 4 },
  { label: 'Physics', courseCode: 'SPH4U', value: 91, priority: 'high', requiredFor: 4 },
  { label: 'English', courseCode: 'ENG4U', value: 85, priority: 'medium', requiredFor: 5 },
  { label: 'Chemistry', courseCode: 'SCH4U', value: 88, priority: 'medium', requiredFor: 2 },
  { label: 'Computer Science', courseCode: 'ICS4U', value: 94, priority: 'low', requiredFor: 1 },
];

export const TOP6_AVERAGE = 89.8;

// ── Timeline ─────────────────────────────────────────────────────────────────

export const TIMELINE_ITEMS: TimelineItem[] = [
  { id: 't1', date: 'Sep 2024', label: 'Transcript uploaded', sublabel: 'Grade 11 marks processed · ON', status: 'done' },
  { id: 't2', date: 'Oct 2024', label: 'Program list confirmed', sublabel: '5 programs · provincial routing set', status: 'done' },
  { id: 't3', date: 'Nov 2024 · Now', label: 'Supplemental drafting', sublabel: 'UofT AIF · Waterloo AIF due Dec 1', status: 'now' },
  { id: 't4', date: 'Jan 2025', label: 'OUAC application opens', sublabel: undefined, status: 'soon' },
  { id: 't5', date: 'May 2025', label: 'Offers released', sublabel: undefined, status: 'soon' },
];

// ── Confidence gate ───────────────────────────────────────────────────────────

export const CONFIDENCE_GATE = [
  { id: 'g1', label: 'UofT Engineering Science', profiles: 38, threshold: 30, color: 'emerald' as const },
  { id: 'g2', label: 'Waterloo Comp Eng', profiles: 24, threshold: 30, color: 'saffron' as const },
  { id: 'g3', label: 'McMaster iBSc', profiles: 11, threshold: 30, color: 'rose' as const },
];

// ── Students (counselor) ──────────────────────────────────────────────────────

export const STUDENTS: Student[] = [
  { id: 's1', initials: 'PM', name: 'Priya Mehta', province: 'ON', avgGrade: 89.8, programCount: 5, avgProbability: 68, riskLevel: 'med', bgColor: '#EEF2FD', textColor: '#2D5BE3' },
  { id: 's2', initials: 'JK', name: 'James Kim', province: 'ON', avgGrade: 92.4, programCount: 4, avgProbability: 81, riskLevel: 'hi', bgColor: '#E0F2FE', textColor: '#0891B2' },
  { id: 's3', initials: 'SM', name: 'Sofia Martinez', province: 'ON', avgGrade: 84.1, programCount: 6, avgProbability: 34, riskLevel: 'lo', bgColor: '#FEE2E2', textColor: '#DC2626' },
  { id: 's4', initials: 'AC', name: 'Amir Chen', province: 'BC', avgGrade: 91.0, programCount: 3, avgProbability: 77, riskLevel: 'hi', bgColor: '#D1FAE5', textColor: '#065F46' },
  { id: 's5', initials: 'NP', name: 'Nadia Patel', province: 'ON', avgGrade: 87.3, programCount: 5, avgProbability: 52, riskLevel: 'med', bgColor: '#EDE9FE', textColor: '#7C3AED' },
  { id: 's6', initials: 'LT', name: 'Lucas Tremblay', province: 'QC', avgGrade: 84.0, programCount: 4, avgProbability: 29, riskLevel: 'lo', bgColor: '#FEF3C7', textColor: '#92400E' },
];

// ── Essay queue ───────────────────────────────────────────────────────────────

export const ESSAY_QUEUE: EssayQueueItem[] = [
  { id: 'e1', studentName: 'Priya Mehta', programName: 'UofT AIF', submittedAgo: '2h ago', aiScore: 72, urgent: false },
  { id: 'e2', studentName: 'Sofia Martinez', programName: 'McMaster Supp', submittedAgo: '5h ago', aiScore: 54, urgent: true },
  { id: 'e3', studentName: 'Nadia Patel', programName: 'Waterloo AIF', submittedAgo: '1d ago', aiScore: 68, urgent: false },
  { id: 'e4', studentName: 'James Kim', programName: "Queen's Essay", submittedAgo: '2d ago', aiScore: 81, urgent: false },
];

// ── Parent notifications ──────────────────────────────────────────────────────

export const PARENT_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'UofT AIF due in 12 days', body: "Priya's UofT AIF draft is in tutor review. Remind her to approve and submit before Dec 1.", timestamp: 'Today, 9:14 AM', read: false, color: '#D97706' },
  { id: 'n2', title: 'Tutor session completed', body: 'Sarah Kim reviewed Priya\'s essay and left 3 annotations.', timestamp: 'Yesterday, 3:42 PM', read: false, color: '#2D5BE3' },
  { id: 'n3', title: 'UBC probability updated to 89%', body: "New peer data increased Priya's UBC Science probability from 84% → 89%.", timestamp: 'Nov 18, 2024', read: true, color: '#0D9B6A' },
];

// ── Milestones ────────────────────────────────────────────────────────────────

export const MILESTONES: Milestone[] = [
  { id: 'm1', title: 'Transcript uploaded', date: 'Sep 15, 2024', status: 'done', details: 'Transcript uploaded Sep 15 · Grade 11 marks processed · Province: Ontario (OUAC)' },
  { id: 'm2', title: 'Program list confirmed', date: 'Oct 8, 2024', status: 'done', details: '5 programs confirmed: UofT, Waterloo, McMaster, UBC, Queens · OUAC + BC routing' },
  { id: 'm3', title: 'UofT & Waterloo AIFs due', date: 'Dec 1, 2024', status: 'in-progress', details: 'UofT AIF in tutor review with Sarah Kim. Waterloo AIF 40% complete. Both due Dec 1.' },
  { id: 'm4', title: 'OUAC application opens', date: 'Jan 15, 2025', status: 'upcoming', details: 'Priya formally applies via the OUAC portal. Grades submitted here are mid-year marks.' },
  { id: 'm5', title: 'Offer decisions released', date: 'May 2025', status: 'upcoming', details: 'Universities release offers. Priya has until June 1 to confirm.' },
];

// ── Financial aid ─────────────────────────────────────────────────────────────

export const TUITION_ROWS: TuitionRow[] = [
  { programId: 'uoft', programName: 'UofT Engineering Science', annualTuition: 14180, details: '$14,180 tuition + ~$12,000 residence + ~$3,500 books ≈ $29,680/yr total' },
  { programId: 'waterloo', programName: 'Waterloo Comp Eng', annualTuition: 14308, details: '$14,308 tuition + ~$11,500 residence + ~$3,000 books ≈ $28,808/yr total' },
  { programId: 'mcmaster', programName: 'McMaster iBSc', annualTuition: 9124, details: '$9,124 tuition + ~$10,800 residence + ~$2,500 books ≈ $22,424/yr total' },
  { programId: 'ubc', programName: 'UBC Science', annualTuition: 9002, details: '$9,002 tuition + ~$13,200 residence + ~$2,800 books ≈ $25,002/yr total' },
  { programId: 'queens', programName: "Queen's Computing", annualTuition: 13920, details: "$13,920 tuition + ~$11,800 residence + ~$2,800 books ≈ $28,520/yr total" },
];

export const SCHOLARSHIPS: ScholarshipItem[] = [
  { id: 'sc1', name: 'UofT National Scholarship', amount: '$12,000/yr', eligibility: 'possible', details: 'Requires top 1% GPA · apply by Jan 31' },
  { id: 'sc2', name: 'McMaster Excellence Award', amount: '$2,000–$8,000', eligibility: 'likely', details: 'Auto-awarded at acceptance — no application required' },
  { id: 'sc3', name: "Waterloo President's Award", amount: '$2,000', eligibility: 'unlikely', details: 'Requires 95%+ average — Priya is at 89.8%' },
];

// ── Peer profiles ─────────────────────────────────────────────────────────────

export const PEER_PROFILES: PeerProfile[] = [
  { id: 'p1', anonymousId: '#4821', province: 'ON', top6Average: 96.1, aifSubmitted: true, outcome: 'accepted' },
  { id: 'p2', anonymousId: '#3307', province: 'ON', top6Average: 94.8, aifSubmitted: true, outcome: 'accepted' },
  { id: 'p3', anonymousId: '#5512', province: 'ON', top6Average: 93.2, aifSubmitted: true, outcome: 'rejected' },
  { id: 'p4', anonymousId: '#2198', province: 'ON', top6Average: 95.4, aifSubmitted: false, outcome: 'rejected' },
];
