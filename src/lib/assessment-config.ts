// ─── Static config shared by assessment steps + compute ─────────────────────

export const PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
  'Newfoundland and Labrador', 'Nova Scotia', 'Ontario', 'Prince Edward Island',
  'Quebec', 'Saskatchewan', 'Northwest Territories', 'Nunavut', 'Yukon',
];

export const SUBJECT_OPTIONS = [
  'English / Français', 'Mathematics', 'Science', 'Social Studies',
  'Business Studies', 'Arts', 'Computer Science', 'Physical Education',
  'Languages', 'Technology / Trades',
];

export const EDUCATOR_ROLES = [
  'Teacher', 'Guidance Counsellor', 'Advisor', 'Coach / Mentor', 'Parent / Guardian',
];

export const ACHIEVEMENT_OPTIONS = ['Excellent', 'Good', 'Developing', 'Needs Support'];

// ── Interests: 8 activities (A–H) tagged with theme signals ──
export interface ActivityDef {
  id: string;
  label: string;
  tags: string[];
  // signal weights toward pathway + functional lens
  functional: 'data' | 'people' | 'things';
}

export const ACTIVITIES: ActivityDef[] = [
  { id: 'A', label: 'Organizing the timeline, budget, or checklist for a group project', tags: ['Data', 'Gold'], functional: 'data' },
  { id: 'B', label: 'Mediating a disagreement between classmates or mentoring a younger student', tags: ['People', 'Blue'], functional: 'people' },
  { id: 'C', label: 'Fixing broken classroom equipment, 3D printing or coding a script', tags: ['Things', 'Green'], functional: 'things' },
  { id: 'D', label: 'Leading a fast-paced brainstorm session or organizing a school pep rally', tags: ['People', 'Orange'], functional: 'people' },
  { id: 'E', label: 'Analyzing historical trends, lab data, or solving complex riddles', tags: ['Data', 'Green'], functional: 'data' },
  { id: 'F', label: 'Designing the visual layout for a presentation or editing a video', tags: ['Things', 'Orange'], functional: 'things' },
  { id: 'G', label: 'Building a physical model, running a sports drill, or acting in a drama production', tags: ['Things', 'Orange'], functional: 'things' },
  { id: 'H', label: 'Writing a detailed, step-by-step summary or keeping the team notes organized', tags: ['Data', 'Gold'], functional: 'data' },
];

// ── Skills: 8 dimensions ──
export interface SkillDef { id: string; label: string; }
export const SKILLS: SkillDef[] = [
  { id: 'practical', label: 'Practical / hands-on' },
  { id: 'technical', label: 'Technical STEM' },
  { id: 'creative', label: 'Creative' },
  { id: 'communication', label: 'Communication' },
  { id: 'digital', label: 'Digital' },
  { id: 'problemSolving', label: 'Problem Solving' },
  { id: 'organization', label: 'Organization' },
  { id: 'teamwork', label: 'Teamwork / leadership' },
];

// ── Values: work value options ──
export interface ValueDef { id: string; label: string; desc: string; }
export const WORK_VALUES: ValueDef[] = [
  { id: 'impact', label: 'Making a real impact', desc: 'Help people, solve problems' },
  { id: 'income', label: 'Good income', desc: 'Earn well, support my goals' },
  { id: 'balance', label: 'Work-life balance', desc: 'Time for what matters' },
  { id: 'security', label: 'Job security & stability', desc: 'Steady work, reliable income' },
  { id: 'growth', label: 'Learning & growth', desc: 'Keep developing skills' },
  { id: 'creative', label: 'Creative & innovation', desc: 'Express ideas, be original' },
  { id: 'independence', label: 'Independence', desc: 'Work on my own terms' },
  { id: 'flexibility', label: 'Flexibility', desc: 'Choose my schedule / location' },
  { id: 'leadership', label: 'Leadership', desc: 'Lead people or project' },
  { id: 'handsOn', label: 'Hands-on / practical work', desc: 'Build, fix, create with tools' },
];

export const READINESS_FACTORS = [
  'Financial Considerations', 'Transportation / travel', 'Family responsibilities',
  'Learning support needs', 'Health Considerations', 'Work Commitments',
  'Relocation', 'Childcare', 'Limited Program Availability', 'Other',
];
