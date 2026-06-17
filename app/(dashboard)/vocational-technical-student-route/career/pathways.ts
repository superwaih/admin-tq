export interface TrainingProgram {
  college: string;
  program: string;
  badges: string[];
  duration: string;
  location: string;
}

export interface SkillLevel {
  name: string;
  level: number;
}

export interface RelatedCareer {
  id?: string;
  title: string;
  code: string;
  match: number;
}

export interface Pathway {
  id: string;
  title: string;
  code: string;
  image: string;
  match: number;
  demand: 'High Demand' | 'Growing';
  category: string;
  description: string;
  entry: string;
  duration: string;
  salary: string;
  fit: string;

  /* ── Detail-page content ── */
  about: string;
  salaryEntry: string;
  salaryMid: string;
  salaryExp: string;
  whatYoullDo: string[];
  workEnvironments: string[];
  trainingPrograms: TrainingProgram[];
  skills: SkillLevel[];
  competencies: string[];
  outlook: {
    growth: string;
    openings: string;
    summary: string;
    trends: string[];
  };
  relatedCareers: RelatedCareer[];
}

export const PATHWAYS: Pathway[] = [
  {
    id: 'electrician', title: 'Electrician', code: '309A', image: '/career/electrician.jpg',
    match: 94, demand: 'High Demand', category: 'Skilled Trades',
    description: 'Install, maintain and repair electrical systems in residential, commercial and industrial settings.',
    entry: 'Apprenticeship', duration: '2–5 Years', salary: '$60k – $85k',
    fit: 'Strong match with your problem-solving, technical skills and interest in hands-on work.',
    about: 'Electricians work with electrical power, communications, lighting and control systems. You will learn to read blueprints, install wiring, troubleshoot issues, and ensure systems are safe and up to code.',
    salaryEntry: '$45k – $55k', salaryMid: '$60k – $75k', salaryExp: '$75k – $95k',
    whatYoullDo: [
      'Install, maintain and repair electrical wiring and equipment',
      'Read and interpret blueprints and technical diagrams',
      'Work in residential, commercial and industrial environments',
      'Troubleshoot electrical problems and ensure safety compliance',
    ],
    workEnvironments: ['Construction Sites', 'Industrial Facilities', 'Residential Homes', 'Commercial Buildings', 'Service & Maintenance'],
    trainingPrograms: [
      { college: 'Humber College', program: 'Electrician (309A)', badges: ['Apprenticeship', 'In Class'], duration: '2–5 Years', location: 'Toronto, ON' },
      { college: 'George Brown College', program: 'Electrical Techniques', badges: ['Apprenticeship', 'Co-op Available'], duration: '2–5 Years', location: 'Toronto, ON' },
      { college: 'Centennial College', program: 'Electrical Engineering Technician', badges: ['Diploma', 'Full Time'], duration: '2–3 Years', location: 'Scarborough, ON' },
    ],
    skills: [
      { name: 'Electrical Theory', level: 90 },
      { name: 'Blueprint Reading', level: 85 },
      { name: 'Problem Solving', level: 88 },
      { name: 'Safety Compliance', level: 92 },
      { name: 'Hand & Power Tools', level: 80 },
    ],
    competencies: ['Wiring & circuit installation', 'Electrical code knowledge', 'Diagnostics & testing', 'Attention to detail'],
    outlook: {
      growth: '+9%', openings: '12,000+',
      summary: 'Demand for licensed electricians remains strong across Canada, driven by new construction, electrification and the green-energy transition.',
      trends: ['Renewable energy and EV charging installations', 'Smart-home and building automation', 'Aging workforce creating new openings'],
    },
    relatedCareers: [
      { id: 'construction', title: 'Construction Technician (Civil)', code: '223S', match: 82 },
      { id: 'automotive', title: 'Automotive Service Technician', code: '310S', match: 88 },
      { title: 'Industrial Electrician', code: '442A', match: 90 },
    ],
  },
  {
    id: 'automotive', title: 'Automotive Service Technician', code: '310S', image: '/career/automotive.jpg',
    match: 88, demand: 'High Demand', category: 'Automotive',
    description: 'Diagnose, service and repair vehicles. Work with modern automotive technologies.',
    entry: 'Apprenticeship', duration: '2–4 Years', salary: '$50k – $75k',
    fit: 'You enjoy working with machines and have strong mechanical aptitude.',
    about: 'Automotive Service Technicians inspect, maintain and repair cars and light trucks. You will diagnose faults using computerized equipment, service engines and systems, and work with the latest hybrid and electric vehicle technologies.',
    salaryEntry: '$38k – $48k', salaryMid: '$50k – $65k', salaryExp: '$65k – $85k',
    whatYoullDo: [
      'Diagnose mechanical and electronic vehicle problems',
      'Perform routine maintenance, repairs and inspections',
      'Use computerized diagnostic and testing equipment',
      'Service hybrid, electric and conventional vehicles',
    ],
    workEnvironments: ['Dealership Service Centres', 'Independent Repair Shops', 'Fleet Maintenance Garages', 'Specialty Performance Shops', 'Roadside & Mobile Service'],
    trainingPrograms: [
      { college: 'Centennial College', program: 'Automotive Service Technician (310S)', badges: ['Apprenticeship', 'In Class'], duration: '2–4 Years', location: 'Scarborough, ON' },
      { college: 'Mohawk College', program: 'Motive Power Technician', badges: ['Diploma', 'Co-op Available'], duration: '2 Years', location: 'Hamilton, ON' },
      { college: 'Georgian College', program: 'Automotive Business', badges: ['Diploma', 'Full Time'], duration: '2–3 Years', location: 'Barrie, ON' },
    ],
    skills: [
      { name: 'Engine Diagnostics', level: 88 },
      { name: 'Electrical Systems', level: 80 },
      { name: 'Mechanical Aptitude', level: 90 },
      { name: 'Computer Diagnostics', level: 82 },
      { name: 'Customer Service', level: 75 },
    ],
    competencies: ['Vehicle diagnostics', 'Brake & suspension repair', 'EV/hybrid systems', 'Precision & care'],
    outlook: {
      growth: '+6%', openings: '9,500+',
      summary: 'Vehicles are increasingly complex, raising demand for technicians who can service advanced electronics and electric drivetrains.',
      trends: ['Rapid growth in EV and hybrid servicing', 'Advanced driver-assistance systems (ADAS)', 'Shortage of certified technicians'],
    },
    relatedCareers: [
      { id: 'welder', title: 'Welder (Fitter)', code: '7216', match: 78 },
      { id: 'electrician', title: 'Electrician', code: '309A', match: 94 },
      { title: 'Heavy Equipment Technician', code: '421A', match: 84 },
    ],
  },
  {
    id: 'construction', title: 'Construction Technician (Civil)', code: '223S', image: '/career/construction.jpg',
    match: 82, demand: 'Growing', category: 'Construction',
    description: 'Assist in planning, surveying and inspecting construction projects and sites.',
    entry: 'College Diploma', duration: '2–3 Years', salary: '$65k – $70k',
    fit: 'You like working outdoors and have good attention to detail.',
    about: 'Construction Technicians support civil and building projects from planning through completion. You will assist with surveying, materials testing, site inspections and quality control to keep projects safe, on time and to code.',
    salaryEntry: '$48k – $58k', salaryMid: '$62k – $72k', salaryExp: '$75k – $90k',
    whatYoullDo: [
      'Assist with site surveying and layout',
      'Inspect work and test construction materials for quality',
      'Read and interpret project drawings and specifications',
      'Support project scheduling, safety and documentation',
    ],
    workEnvironments: ['Construction Sites', 'Engineering Firms', 'Municipal Infrastructure Projects', 'Surveying & Inspection', 'Site Field Offices'],
    trainingPrograms: [
      { college: 'George Brown College', program: 'Civil Engineering Technician', badges: ['Diploma', 'In Class'], duration: '2 Years', location: 'Toronto, ON' },
      { college: 'Mohawk College', program: 'Construction Engineering Technician', badges: ['Diploma', 'Co-op Available'], duration: '2–3 Years', location: 'Hamilton, ON' },
      { college: 'Conestoga College', program: 'Construction Project Management', badges: ['Graduate Cert', 'Full Time'], duration: '1 Year', location: 'Kitchener, ON' },
    ],
    skills: [
      { name: 'Site Surveying', level: 84 },
      { name: 'Blueprint Reading', level: 86 },
      { name: 'Materials Testing', level: 80 },
      { name: 'Attention to Detail', level: 90 },
      { name: 'Project Coordination', level: 78 },
    ],
    competencies: ['Surveying & layout', 'Quality control', 'Building-code awareness', 'Outdoor field work'],
    outlook: {
      growth: '+8%', openings: '7,800+',
      summary: 'Infrastructure investment and housing demand are fuelling steady growth for skilled construction technicians across the country.',
      trends: ['Major public infrastructure spending', 'Sustainable and green building practices', 'Adoption of digital site tools and BIM'],
    },
    relatedCareers: [
      { id: 'electrician', title: 'Electrician', code: '309A', match: 94 },
      { id: 'welder', title: 'Welder (Fitter)', code: '7216', match: 78 },
      { title: 'Heavy Equipment Operator', code: '636', match: 80 },
    ],
  },
  {
    id: 'welder', title: 'Welder (Fitter)', code: '7216', image: '/career/welder.jpg',
    match: 78, demand: 'Growing', category: 'Manufacturing',
    description: 'Join, weld and fabricate metal parts and structures using various welding techniques.',
    entry: 'Apprenticeship', duration: '1–4 Years', salary: '$48k – $65k',
    fit: 'You have good focus, patience and spatial awareness.',
    about: 'Welders join and fabricate metal components for manufacturing, construction and repair. You will learn multiple welding processes, read fabrication drawings, and produce strong, precise welds that meet industry standards.',
    salaryEntry: '$40k – $50k', salaryMid: '$52k – $65k', salaryExp: '$68k – $85k',
    whatYoullDo: [
      'Weld and join metal parts using MIG, TIG and stick processes',
      'Read and interpret fabrication and assembly drawings',
      'Cut, shape and fit metal components to specification',
      'Inspect welds for quality and structural integrity',
    ],
    workEnvironments: ['Fabrication Shops', 'Manufacturing Plants', 'Construction Sites', 'Shipyards & Pipelines', 'Repair & Maintenance'],
    trainingPrograms: [
      { college: 'Conestoga College', program: 'Welding Techniques', badges: ['Certificate', 'In Class'], duration: '1 Year', location: 'Kitchener, ON' },
      { college: 'Fanshawe College', program: 'Welding & Fabrication Technician', badges: ['Diploma', 'Co-op Available'], duration: '2 Years', location: 'London, ON' },
      { college: 'Cambrian College', program: 'Welding & Fabrication', badges: ['Apprenticeship', 'Full Time'], duration: '1–4 Years', location: 'Sudbury, ON' },
    ],
    skills: [
      { name: 'MIG / TIG Welding', level: 88 },
      { name: 'Blueprint Reading', level: 80 },
      { name: 'Metal Fabrication', level: 85 },
      { name: 'Precision & Focus', level: 90 },
      { name: 'Safety Compliance', level: 86 },
    ],
    competencies: ['Multiple welding processes', 'Fabrication & fitting', 'Weld inspection', 'Spatial awareness'],
    outlook: {
      growth: '+5%', openings: '6,400+',
      summary: 'Skilled welders remain in demand for manufacturing, energy and infrastructure projects, especially those with multi-process certification.',
      trends: ['Pipeline and energy-sector projects', 'Automated and robotic welding support', 'Premium pay for certified specialists'],
    },
    relatedCareers: [
      { id: 'automotive', title: 'Automotive Service Technician', code: '310S', match: 88 },
      { id: 'construction', title: 'Construction Technician (Civil)', code: '223S', match: 82 },
      { title: 'Sheet Metal Worker', code: '308A', match: 81 },
    ],
  },
];

export function getPathway(id: string): Pathway | undefined {
  return PATHWAYS.find((p) => p.id === id);
}
