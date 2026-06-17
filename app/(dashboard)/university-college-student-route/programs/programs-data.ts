// Shared program catalogue + detail content for the university / college route.
// Used by the "Add New Program" browse page and the "Program Details" page.

export interface Program {
  id: number;
  university: string;
  country: string;
  program: string;
  degree: string;
  intake: string;
  deadline: string;
  match: number;
  status: 'On Track' | 'Moderate' | 'Reach';
  tuition: string;
}

export const ALL_PROGRAMS: Program[] = [
  { id:1,  university:'University of Toronto',   country:'Canada', program:'MEng in Computer Science',       degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:92, status:'On Track', tuition:'$22k' },
  { id:2,  university:'University of Toronto',   country:'Canada', program:'MEng in Computer Science',       degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:82, status:'Moderate', tuition:'$22k' },
  { id:3,  university:'University of Waterloo',  country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:35, status:'Reach',    tuition:'$18k' },
  { id:4,  university:'McMaster University',     country:'Canada', program:'MEng in Computer Science',       degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:92, status:'On Track', tuition:'$20k' },
  { id:5,  university:"Queen's University",      country:'Canada', program:'Computing',                      degree:'Masters', intake:'Fall 2025', deadline:'July 1, 2025',  match:78, status:'Moderate', tuition:'$16k' },
  { id:6,  university:'University of British Columbia', country:'Canada', program:'MSc Computer Science',    degree:'Masters', intake:'Fall 2025', deadline:'June 30, 2025', match:65, status:'Moderate', tuition:'$24k' },
  { id:7,  university:'University of Alberta',   country:'Canada', program:'MSc Computing Science',          degree:'Masters', intake:'Fall 2025', deadline:'May 15, 2025',  match:88, status:'On Track', tuition:'$15k' },
  { id:8,  university:'McGill University',       country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:71, status:'Moderate', tuition:'$19k' },
  { id:9,  university:'Dalhousie University',    country:'Canada', program:'MEng Computer Engineering',      degree:'Masters', intake:'Fall 2025', deadline:'July 15, 2025', match:95, status:'On Track', tuition:'$12k' },
  { id:10, university:'University of Calgary',   country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'June 1, 2025',  match:84, status:'On Track', tuition:'$14k' },
  { id:11, university:'Simon Fraser University', country:'Canada', program:'MSc Computing Science',          degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:76, status:'Moderate', tuition:'$17k' },
  { id:12, university:'Concordia University',    country:'Canada', program:'MEng Software Engineering',      degree:'Masters', intake:'Fall 2025', deadline:'May 30, 2025',  match:89, status:'On Track', tuition:'$11k' },
  { id:13, university:'University of Victoria',  country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:82, status:'On Track', tuition:'$16k' },
  { id:14, university:'University of Ottawa',    country:'Canada', program:'MEng Software Engineering',      degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:73, status:'Moderate', tuition:'$18k' },
  { id:15, university:'Carleton University',     country:'Canada', program:'MEng Computer Systems Eng',      degree:'Masters', intake:'Fall 2025', deadline:'June 30, 2025', match:67, status:'Moderate', tuition:'$14k' },
  { id:16, university:'University of Manitoba',  country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'July 1, 2025',  match:91, status:'On Track', tuition:'$10k' },
  { id:17, university:'University of Guelph',    country:'Canada', program:'MSc Computing & Information Science', degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:58, status:'Reach', tuition:'$13k' },
  { id:18, university:'Ryerson University',      country:'Canada', program:'MEng Computer Networks',         degree:'Masters', intake:'Fall 2025', deadline:'July 15, 2025', match:44, status:'Reach',    tuition:'$15k' },
  { id:19, university:'York University',         country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'June 30, 2025', match:69, status:'Moderate', tuition:'$13k' },
  { id:20, university:'Western University',      country:'Canada', program:'MSc Computer Science',           degree:'Masters', intake:'Fall 2025', deadline:'June 15, 2025', match:77, status:'Moderate', tuition:'$16k' },
  { id:21, university:'University of Toronto',   country:'Canada', program:'MEng Electrical & Computer Eng', degree:'Masters', intake:'Winter 2026', deadline:'Sep 1, 2025', match:85, status:'On Track', tuition:'$23k' },
  { id:22, university:'University of Waterloo',  country:'Canada', program:'MEng Systems Design Engineering', degree:'Masters', intake:'Winter 2026', deadline:'Sep 15, 2025', match:62, status:'Reach', tuition:'$19k' },
  { id:23, university:'McMaster University',     country:'Canada', program:'MEng Electrical Engineering',    degree:'Masters', intake:'Winter 2026', deadline:'Sep 30, 2025', match:79, status:'Moderate', tuition:'$20k' },
  { id:24, university:"Queen's University",      country:'Canada', program:'MEng Engineering Science',       degree:'Masters', intake:'Winter 2026', deadline:'Oct 1, 2025',  match:93, status:'On Track', tuition:'$17k' },
  { id:25, university:'University of British Columbia', country:'Canada', program:'MEng Electrical Engineering', degree:'Masters', intake:'Winter 2026', deadline:'Sep 15, 2025', match:70, status:'Moderate', tuition:'$25k' },
];

export function getProgram(id: number): Program | undefined {
  return ALL_PROGRAMS.find(p => p.id === id);
}

// ── Detail-page content ───────────────────────────────────────────────────────

export interface SimilarProgram {
  id: number;
  university: string;
  program: string;
  match: number;
}

export interface ProgramDetail extends Program {
  about: string;
  highlights: { label: string }[];
  whatYoullStudy: string[];
  coreCourses: string[];
  requirements: string[];
  careerOutcomes: { title: string; salary: string }[];
  outlook: { growth: string; demand: string; summary: string };
  costs: { tuitionAnnual: string; applicationFee: string; livingEstimate: string; scholarships: string };
  similar: SimilarProgram[];
}

function tuitionNum(t: string): number {
  return parseInt(t.replace(/[^0-9]/g, ''), 10) || 0;
}

function focusOf(program: string): 'software' | 'hardware' | 'data' | 'general' {
  const p = program.toLowerCase();
  if (p.includes('software')) return 'software';
  if (p.includes('electrical') || p.includes('computer eng') || p.includes('systems') || p.includes('networks')) return 'hardware';
  if (p.includes('computing') || p.includes('information')) return 'data';
  return 'general';
}

const STUDY_BY_FOCUS: Record<string, string[]> = {
  software: [
    'Advanced software architecture and design patterns',
    'Distributed systems and cloud-native development',
    'Software quality, testing and DevOps practices',
    'Agile project delivery and team collaboration',
  ],
  hardware: [
    'Digital systems and computer architecture',
    'Embedded systems and signal processing',
    'Networks, communications and hardware design',
    'Control systems and real-time computing',
  ],
  data: [
    'Data structures, algorithms and analysis',
    'Machine learning and applied data science',
    'Database systems and information management',
    'Research methods and statistical computing',
  ],
  general: [
    'Foundations of advanced computer science',
    'Algorithms, theory and computational thinking',
    'Systems programming and software engineering',
    'A research or capstone project in your area of interest',
  ],
};

const COURSES_BY_FOCUS: Record<string, string[]> = {
  software: ['Software Architecture', 'Cloud Computing', 'Distributed Systems', 'Secure Software Design', 'Capstone Project'],
  hardware: ['Computer Architecture', 'Embedded Systems', 'Computer Networks', 'Digital Signal Processing', 'Capstone Project'],
  data: ['Machine Learning', 'Data Mining', 'Database Systems', 'Statistical Methods', 'Research Thesis'],
  general: ['Advanced Algorithms', 'Operating Systems', 'Programming Languages', 'Research Methods', 'Capstone Project'],
};

const CAREERS_BY_FOCUS: Record<string, { title: string; salary: string }[]> = {
  software: [
    { title: 'Software Engineer', salary: '$95k – $130k' },
    { title: 'Cloud / DevOps Engineer', salary: '$100k – $140k' },
    { title: 'Engineering Team Lead', salary: '$130k – $170k' },
  ],
  hardware: [
    { title: 'Hardware / Embedded Engineer', salary: '$90k – $125k' },
    { title: 'Network Engineer', salary: '$85k – $120k' },
    { title: 'Systems Engineer', salary: '$95k – $135k' },
  ],
  data: [
    { title: 'Data Scientist', salary: '$100k – $140k' },
    { title: 'Machine Learning Engineer', salary: '$110k – $150k' },
    { title: 'Data Engineer', salary: '$95k – $135k' },
  ],
  general: [
    { title: 'Software Developer', salary: '$90k – $125k' },
    { title: 'Research Associate', salary: '$80k – $110k' },
    { title: 'Solutions Architect', salary: '$120k – $160k' },
  ],
};

export function getProgramDetail(id: number): ProgramDetail | undefined {
  const p = getProgram(id);
  if (!p) return undefined;

  const focus = focusOf(p.program);
  const annual = tuitionNum(p.tuition);

  const similar: SimilarProgram[] = ALL_PROGRAMS
    .filter(o => o.id !== p.id && (o.degree === p.degree))
    .sort((a, b) => Math.abs(a.match - p.match) - Math.abs(b.match - p.match))
    .slice(0, 6)
    .map(o => ({ id: o.id, university: o.university, program: o.program, match: o.match }));

  return {
    ...p,
    about: `The ${p.program} at ${p.university} is a ${p.degree.toLowerCase()}-level program designed to deepen your technical expertise and prepare you for advanced roles in industry and research. With a ${p.match}% match to your profile, this program aligns well with your academic background, goals and interests. The ${p.intake} intake combines coursework, hands-on projects and opportunities to specialise.`,
    highlights: [
      { label: 'Strong Industry Demand' },
      { label: 'Research & Project Focus' },
      { label: 'Co-op / Internship Options' },
      { label: 'Pathway to Advancement' },
    ],
    whatYoullStudy: STUDY_BY_FOCUS[focus],
    coreCourses: COURSES_BY_FOCUS[focus],
    requirements: [
      `A recognised bachelor's degree in a related field with a strong GPA`,
      'Official transcripts from all post-secondary institutions',
      'English language proficiency (IELTS / TOEFL) for international applicants',
      'Statement of purpose outlining your goals and interests',
      'Two to three academic or professional references',
    ],
    careerOutcomes: CAREERS_BY_FOCUS[focus],
    outlook: {
      growth: '+12%',
      demand: 'High',
      summary: `Graduates of the ${p.program} are in strong demand across Canada and abroad, with employers seeking advanced technical skills, problem-solving ability and research experience. The field continues to grow faster than the national average.`,
    },
    costs: {
      tuitionAnnual: p.tuition,
      applicationFee: '$120',
      livingEstimate: '$15k – $20k / yr',
      scholarships: annual > 0 && annual <= 15 ? 'Entrance awards available' : 'Merit & need-based aid',
    },
    similar,
  };
}
