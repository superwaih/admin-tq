import type { AssessmentData, AssessmentResults } from '@/src/types/assessment';
import { ACTIVITIES, SKILLS, WORK_VALUES } from './assessment-config';

function avg(nums: number[]): number {
  const valid = nums.filter((n) => typeof n === 'number' && !Number.isNaN(n));
  if (!valid.length) return 0;
  return valid.reduce((s, n) => s + n, 0) / valid.length;
}

function num(v: string | undefined): number {
  const n = parseFloat(v ?? '');
  return Number.isNaN(n) ? NaN : n;
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'ST';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const ELIG = (avgGrade: number, threshold: number): 'On Track' | 'Needs Work' | 'Eligible' => {
  if (Number.isNaN(avgGrade)) return 'Needs Work';
  if (avgGrade >= threshold + 5) return 'Eligible';
  if (avgGrade >= threshold - 3) return 'On Track';
  return 'Needs Work';
};

export function computeResults(data: AssessmentData): AssessmentResults {
  const { profile, interests, skills, values } = data;

  // ── Functional lens (Data / People / Things) from interest activities ──
  const functionalScore = { data: 0, people: 0, things: 0 };
  for (const act of ACTIVITIES) {
    const rating = interests.activities[act.id] ?? 0;
    functionalScore[act.functional] += rating;
  }
  const functionalWinner = (Object.entries(functionalScore).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'things') as
    'data' | 'people' | 'things';
  const functionalLensLabel: Record<string, string> = {
    data: 'Data — information processing, patterns & organization',
    people: 'People — connection, leadership & communication',
    things: 'Things — tangible outputs, technology & physical making',
  };

  // ── Core motivation (True Colors) from activity tags ──
  const colorScore: Record<string, number> = { Blue: 0, Gold: 0, Green: 0, Orange: 0 };
  for (const act of ACTIVITIES) {
    const rating = interests.activities[act.id] ?? 0;
    for (const t of act.tags) if (t in colorScore) colorScore[t] += rating;
  }
  const colorWinner = Object.entries(colorScore).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Green';
  const colorLabel: Record<string, string> = {
    Blue: 'Blue — purpose, empathy & human-centric paths',
    Gold: 'Gold — stability, organization & clear expectations',
    Green: 'Green — logic, curiosity & problem-solving',
    Orange: 'Orange — variety, hands-on results & fast pace',
  };

  // ── Learning style from profile learning prefs ──
  const learnMap: Record<string, string> = {
    'hands-on': 'Kinesthetic — learns by doing; suits polytechnics, hands-on college & apprenticeships',
    mix: 'Blended — comfortable across hands-on and theory-based study',
    reading: 'Visual / Auditory — thrives in concept-led university & research study',
  };
  const learningStyle = learnMap[profile.learnNew] ?? 'Blended — comfortable across multiple learning modes';

  // ── Skills blended (student + educator) ──
  const skillProfile = SKILLS.map((s) => {
    const blended = avg([skills.student[s.id] ?? 0, skills.educator[s.id] ?? 0].filter((n) => n > 0));
    return { label: s.label, value: Math.round((blended || 0) * 20) }; // 1-5 → 0-100
  });
  const topSkills = [...skillProfile].sort((a, b) => b.value - a.value).slice(0, 2).map((s) => s.label);

  // ── Pathway fit ──
  // Lean from explicit values choice + learning style + hands-on signal.
  let tradesScore = 0;
  let academicScore = 0;
  if (values.pathwayLeaning === 'apprenticeship') tradesScore += 3;
  if (values.pathwayLeaning === 'college') { tradesScore += 1; academicScore += 1; }
  if (values.pathwayLeaning === 'undecided') { tradesScore += 1; academicScore += 1; }
  if (profile.learnNew === 'hands-on') tradesScore += 2;
  if (profile.learnNew === 'reading') academicScore += 2;
  if (profile.futureStudy === 'working') tradesScore += 2;
  if (profile.futureStudy === 'academic') academicScore += 2;
  if (values.workValues.includes('handsOn')) tradesScore += 1.5;
  if (values.workValues.includes('growth')) academicScore += 1;
  // skill signal
  const practicalVal = skillProfile.find((s) => s.label.includes('Practical'))?.value ?? 0;
  const technicalVal = skillProfile.find((s) => s.label.includes('Technical'))?.value ?? 0;
  tradesScore += practicalVal / 50;
  academicScore += technicalVal / 50;
  // functional
  if (functionalWinner === 'things') tradesScore += 1.5;
  if (functionalWinner === 'data') academicScore += 1.5;

  const totalScore = tradesScore + academicScore || 1;
  let apprenticeshipFit = Math.round((tradesScore / totalScore) * 100);
  apprenticeshipFit = Math.max(8, Math.min(92, apprenticeshipFit));
  const collegeUniversityFit = 100 - apprenticeshipFit;

  // ── Occupational matches ──
  const tradesOccupations = [
    { title: 'Electrician', description: 'Install and maintain electrical systems.', salary: '$70,000', route: 'Apprenticeship / Red Seal' },
    { title: 'Industrial Mechanic', description: 'Maintain and repair industrial machinery.', salary: '$72,000', route: 'Apprenticeship / Red Seal' },
    { title: 'Welder', description: 'Join and fabricate metal components.', salary: '$65,000', route: 'Apprenticeship / Red Seal' },
  ];
  const collegeOccupations = [
    { title: 'Lab / Science Technician', description: 'Prepare, run and record scientific experiments.', salary: '$55,000', route: 'College Diploma' },
    { title: 'Engineering Technologist', description: 'Build, test and maintain technical systems.', salary: '$70,000', route: 'College Diploma / Degree' },
    { title: 'Software Developer', description: 'Design, build and test software and applications.', salary: '$95,000', route: 'College / University' },
  ];
  const uniOccupations = [
    { title: 'Software Developer', description: 'Design, build and test software and applications.', salary: '$95,000', route: 'University Degree' },
    { title: 'Data Analyst', description: 'Turn data into insights and decisions.', salary: '$78,000', route: 'University Degree' },
    { title: 'Registered Nurse', description: 'Deliver and coordinate patient care.', salary: '$80,000', route: 'University Degree' },
  ];

  const pool = apprenticeshipFit >= 55
    ? [...tradesOccupations, collegeOccupations[0], collegeOccupations[1]]
    : apprenticeshipFit >= 40
      ? [collegeOccupations[2], collegeOccupations[1], collegeOccupations[0], tradesOccupations[0]]
      : [...uniOccupations, collegeOccupations[1]];

  const baseMatch = 98;
  const occupationalMatches = pool.slice(0, 4).map((o, i) => ({
    ...o,
    match: Math.max(78, baseMatch - i * 5),
  }));

  // ── Grades & program eligibility ──
  const overall = num(profile.overallAverage);
  const subjectGrades = Array.isArray(profile.subjectGrades) ? profile.subjectGrades : [];
  const gradeFor = (...keys: string[]) => {
    const hit = subjectGrades.find(
      (sg) => (sg.grade ?? '').trim() !== '' && keys.some((k) => (sg.subject ?? '').toLowerCase().includes(k)),
    );
    return hit ? num(hit.grade) : NaN;
  };
  const eng = gradeFor('english', 'français', 'francais');
  const math = gradeFor('math', 'calcul');
  const sciScience = gradeFor('science');
  const sciPhysics = gradeFor('physic');
  const sciChem = gradeFor('chem');
  const sci = !Number.isNaN(sciScience) ? sciScience
    : !Number.isNaN(sciPhysics) ? sciPhysics : sciChem;
  const yourAvg = !Number.isNaN(overall) ? overall : avg([eng, math, sci].filter((n) => !Number.isNaN(n)));

  const programEligibility = occupationalMatches.map((m) => {
    const thresholdMap: Record<string, number> = {
      'University Degree': 80, 'College / University': 75, 'College Diploma / Degree': 72,
      'College Diploma': 68, 'Apprenticeship / Red Seal': 60,
    };
    const threshold = thresholdMap[m.route] ?? 70;
    return {
      match: m.title,
      route: m.route,
      english: `${threshold}%`,
      math: `${threshold}%`,
      science: m.route.includes('Apprenticeship') ? '-' : `${threshold}%`,
      yourAverage: Number.isNaN(yourAvg) ? '—' : `${Math.round(yourAvg)}%`,
      eligible: ELIG(yourAvg, threshold),
    };
  });

  // ── Recommended programs (province-aware-ish) ──
  const recommendedPrograms = apprenticeshipFit >= 55
    ? [
        { institution: 'Local Trades College', program: 'Electrical Techniques', tag: 'Apprenticeship' },
        { institution: 'Polytechnic Institute', program: 'Mechanical Technician', tag: 'Diploma' },
        { institution: 'Community College', program: 'Welding & Fabrication', tag: 'Certificate' },
        { institution: 'Skilled Trades Centre', program: 'Red Seal Pre-Apprenticeship', tag: 'Apprenticeship' },
      ]
    : [
        { institution: 'University of Toronto', program: 'Computer Science (B.Sc.)', tag: 'Degree' },
        { institution: 'University of Waterloo', program: 'Software Engineering', tag: 'Degree' },
        { institution: 'Science Polytechnic', program: 'Computer Programming', tag: 'Diploma' },
        { institution: 'Humber College', program: 'Computer Engineering Technology', tag: 'Diploma' },
      ];

  // ── Scholarships ──
  const scholarships = [
    { name: 'Loran Scholarship', amount: 'Up to $100,000', detail: 'Merit-based award' },
    { name: 'Schulich Scholarship', amount: 'Up to $100,000', detail: 'STEM Scholarship' },
    { name: 'TD Community Leadership', amount: 'Up to $70,000', detail: 'For community leaders' },
    { name: 'Canada Student Grants & Loans', amount: 'Federal Support', detail: 'For all students' },
    { name: 'Canada Apprentice Loan', amount: 'Up to $200,000', detail: 'For apprentices' },
    { name: 'Indigenous Student Bursaries', amount: 'Bursaries & scholarships', detail: 'Across Canada' },
  ];

  const academicStrength = profile.strongestSubjects || (Number.isNaN(yourAvg) ? 'Developing' : yourAvg >= 80 ? 'Strong' : 'Developing');
  const topInterestArea = ACTIVITIES.reduce(
    (best, a) => ((interests.activities[a.id] ?? 0) > (interests.activities[best.id] ?? 0) ? a : best),
    ACTIVITIES[0],
  ).tags[0];

  const name = profile.studentFullName || profile.preferredName || 'Student';

  const recommendedPathway = apprenticeshipFit >= 55
    ? 'Apprenticeship & Skilled Trades'
    : 'College & University';

  // ── Strengths: top skills + strongest subjects + interest direction ──
  const strengths: string[] = [];
  for (const s of [...skillProfile].sort((a, b) => b.value - a.value)) {
    if (s.value >= 60 && strengths.length < 3) strengths.push(`${s.label} (${s.value}%)`);
  }
  if (profile.strongestSubjects) strengths.push(`Strong in ${profile.strongestSubjects}`);
  if (skills.confidentlyGoodAt) strengths.push(skills.confidentlyGoodAt);
  if (!strengths.length) strengths.push('Developing a balanced profile across skill areas');

  // ── Challenges: lowest skills + stated areas to improve ──
  const challenges: string[] = [];
  for (const s of [...skillProfile].sort((a, b) => a.value - b.value)) {
    if (s.value > 0 && s.value < 60 && challenges.length < 2) challenges.push(`Build ${s.label.toLowerCase()} (${s.value}%)`);
  }
  if (skills.wantToImprove) challenges.push(`Wants to improve: ${skills.wantToImprove}`);
  if (!Number.isNaN(yourAvg) && yourAvg < 70) challenges.push('Lift overall average toward program thresholds');
  if (!challenges.length) challenges.push('Keep momentum and explore stretch goals');

  const summary = `${profile.preferredName || name} shows ${academicStrength.toLowerCase()} academic potential with strengths in ${topSkills.join(' and ') || 'developing areas'}. ` +
    `Based on interests, values and readiness, the ${apprenticeshipFit >= 55 ? 'apprenticeship & skilled trades' : 'college & university'} pathway currently provides the strongest alignment. ` +
    `Review progress next term.`;

  const profileSummary = `${name} is a ${[profile.gradeLevel, profile.province].filter(Boolean).join(' ')} student with ${academicStrength.toLowerCase()} academic standing` +
    `${Number.isNaN(yourAvg) ? '' : ` (≈${Math.round(yourAvg)}% average)`}. ` +
    `Their interests point toward ${topInterestArea}, with ${functionalLensLabel[functionalWinner].split(' — ')[0]}-oriented work and a ${colorLabel[colorWinner].split(' — ')[0]} core motivation. ` +
    `The recommended pathway is ${recommendedPathway}, with top fit roles including ${occupationalMatches.slice(0, 2).map((o) => o.title).join(' and ') || 'several options'}.`;

  const studentActions = [
    'Research 3 programs linked to your top matches',
    'Attend a campus open house or virtual tour',
    'Build a small coding/practical project to build your skills',
    'Maintain strong grades in your strongest subjects',
    'Seek relevant experience (co-op, clubs, volunteering)',
  ];
  const educatorActions = [
    'Review the skills radar and discuss any gaps',
    'Share application timelines & key deadlines',
    'Provide resources for program exploration',
    'Connect the student with relevant supports',
    'Set a follow-up review date next term',
  ];

  return {
    studentName: name,
    initials: initialsFrom(name),
    gradeProvince: [profile.gradeLevel, profile.province].filter(Boolean).join(' · ') || '—',
    academicStrength,
    topInterestArea,
    strongestSkills: topSkills.join(', ') || '—',
    careerDirection: occupationalMatches[0]?.title ?? '—',
    collegeUniversityFit,
    apprenticeshipFit,
    skillProfile,
    occupationalMatches,
    programEligibility,
    recommendedPrograms,
    scholarships,
    functionalLens: functionalLensLabel[functionalWinner],
    coreMotivation: colorLabel[colorWinner],
    learningStyle,
    strengths,
    challenges,
    recommendedPathway,
    studentActions,
    educatorActions,
    summary,
    profileSummary,
    computedAt: new Date().toISOString(),
  };
}
