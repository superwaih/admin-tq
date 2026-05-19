'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Search, Download, Plus,
  Eye, MoreHorizontal, SlidersHorizontal, ChevronDown,
  HelpCircle, AlertCircle,
} from 'lucide-react';
import { AppRecord, ApplicationDetailsModal } from '@/src/components/shared/ApplicationDetailsModal';

// ── Types ─────────────────────────────────────────────────────────────────────
type Stage    = 'Interview' | 'Secondary' | 'Essays' | 'Decision';
type Priority = 'At Risk' | 'Medium' | 'Low';

interface Application extends AppRecord {
  stage: Stage;
  priority: Priority;
  lastActivity: string;
  lastDate: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const ALL_APPLICATIONS: Application[] = [
  {
    initials:'AY', color:'bg-amber-400', name:'Amina Yusuf', program:'MD Program',
    university:'MCGill University', progress:88, stage:'Decision', priority:'At Risk',
    lastActivity:'2 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-00101', intake:'Fall 2026', campus:'Montreal, Canada',
    appDate:'May 1, 2025', deadline:'June 15, 2025', source:'Website', referredBy:'Dr. Kofi Mensah',
    graduation:'Expected Graduation 2026', email:'amina.yusuf@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'PENDING'   },
    ],
    academic:{ gpa:'3.92 / 4.00', institution:'McGill University', major:'Biochemistry', yearOfStudy:'Final Year', mcatScore:'514 (88th Percentile)' },
    progressStep:4, currentStageDesc:'Decision is pending from the admissions committee.', estimatedUpdate:'May 30, 2025',
  },
  {
    initials:'DM', color:'bg-blue-500', name:'Daniel Musa', program:'DDS Program',
    university:'University of Toronto', progress:68, stage:'Interview', priority:'Medium',
    lastActivity:'Yesterday', lastDate:'May 21, 2025',
    appId:'APP-2025-00202', intake:'Fall 2026', campus:'Toronto, Canada',
    appDate:'April 10, 2025', deadline:'July 1, 2025', source:'Referral', referredBy:'Dr. Lisa Park',
    graduation:'Expected Graduation 2027', email:'daniel.musa@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'PENDING'   },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.78 / 4.00', institution:'University of Toronto', major:'Biology', yearOfStudy:'4th Year', mcatScore:'510 (80th Percentile)' },
    progressStep:3, currentStageDesc:'Interview has been scheduled. Please prepare using the MMI guide.', estimatedUpdate:'June 5, 2025',
  },
  {
    initials:'FB', color:'bg-pink-500', name:'Fatima Bello', program:'MPH Program',
    university:'Western University', progress:88, stage:'Essays', priority:'Medium',
    lastActivity:'30 mins ago', lastDate:'May 22, 2025',
    appId:'APP-2025-00303', intake:'Winter 2026', campus:'London, Canada',
    appDate:'March 20, 2025', deadline:'August 15, 2025', source:'School Event', referredBy:'Prof. Nia Osei',
    graduation:'Expected Graduation 2027', email:'fatima.bello@email.com',
    checklist:[
      { label:'Personal Statement',       status:'PENDING'   },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'PENDING'   },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.68 / 4.00', institution:'Western University', major:'Public Health', yearOfStudy:'3rd Year', mcatScore:'N/A' },
    progressStep:1, currentStageDesc:'Essays are pending submission. Please complete them promptly.', estimatedUpdate:'June 25, 2025',
  },
  {
    initials:'IA', color:'bg-teal-500', name:'Ibrahim Ali', program:'MD Program',
    university:'UBC', progress:61, stage:'Secondary', priority:'At Risk',
    lastActivity:'Today', lastDate:'May 22, 2025',
    appId:'APP-2025-00404', intake:'Fall 2026', campus:'Vancouver, Canada',
    appDate:'April 5, 2025', deadline:'July 20, 2025', source:'Direct', referredBy:'Dr. Sarah Johnson',
    graduation:'Expected Graduation 2026', email:'ibrahim.ali@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'PENDING'   },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'PENDING'   },
    ],
    academic:{ gpa:'3.55 / 4.00', institution:'UBC', major:'Cellular Biology', yearOfStudy:'Final Year', mcatScore:'506 (72nd Percentile)' },
    progressStep:2, currentStageDesc:'Secondary application is under review by the admissions team.', estimatedUpdate:'June 12, 2025',
  },
  {
    initials:'MO', color:'bg-orange-500', name:'Maryam Okafor', program:'MD Program',
    university:'Harvard University', progress:74, stage:'Essays', priority:'Low',
    lastActivity:'3 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-00505', intake:'Fall 2026', campus:'Cambridge, USA',
    appDate:'March 15, 2025', deadline:'September 1, 2025', source:'Online', referredBy:'Mr. James Brown',
    graduation:'Expected Graduation 2027', email:'maryam.okafor@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'PENDING'   },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.82 / 4.00', institution:'Yale University', major:'Neuroscience', yearOfStudy:'4th Year', mcatScore:'517 (96th Percentile)' },
    progressStep:1, currentStageDesc:'Application essays are being finalized before submission.', estimatedUpdate:'July 10, 2025',
  },
  {
    initials:'JA', color:'bg-emerald-500', name:'Joshua Adeyemi', program:'MD Program',
    university:'MCGill University', progress:95, stage:'Decision', priority:'At Risk',
    lastActivity:'1 hr ago', lastDate:'May 22, 2025',
    appId:'APP-2025-00606', intake:'Fall 2026', campus:'Montreal, Canada',
    appDate:'February 28, 2025', deadline:'May 31, 2025', source:'Website', referredBy:'Dr. Kofi Mensah',
    graduation:'Expected Graduation 2026', email:'joshua.adeyemi@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.95 / 4.00', institution:'McGill University', major:'Biochemistry', yearOfStudy:'Final Year', mcatScore:'520 (99th Percentile)' },
    progressStep:4, currentStageDesc:'Final decision is imminent. Awaiting committee review outcome.', estimatedUpdate:'May 28, 2025',
  },
  {
    initials:'HS', color:'bg-rose-500', name:'Halima Sani', program:'MD Program',
    university:'Western University', progress:45, stage:'Essays', priority:'Medium',
    lastActivity:'2 days ago', lastDate:'May 20, 2025',
    appId:'APP-2025-00707', intake:'Winter 2026', campus:'London, Canada',
    appDate:'April 18, 2025', deadline:'August 30, 2025', source:'Referral', referredBy:'Dr. Amara Singh',
    graduation:'Expected Graduation 2028', email:'halima.sani@email.com',
    checklist:[
      { label:'Personal Statement',       status:'PENDING'   },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'PENDING'   },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'PENDING'   },
    ],
    academic:{ gpa:'3.45 / 4.00', institution:'Western University', major:'Biology', yearOfStudy:'3rd Year', mcatScore:'501 (56th Percentile)' },
    progressStep:1, currentStageDesc:'Multiple essay components are still pending. Counselor follow-up required.', estimatedUpdate:'July 15, 2025',
  },
  {
    initials:'SJ', color:'bg-indigo-500', name:'Samuel Johnson', program:'MD Program',
    university:'Queen\'s University', progress:82, stage:'Interview', priority:'Low',
    lastActivity:'5 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-00808', intake:'Fall 2026', campus:'Kingston, Canada',
    appDate:'March 25, 2025', deadline:'June 30, 2025', source:'Direct', referredBy:'Prof. Daniel Lee',
    graduation:'Expected Graduation 2026', email:'samuel.johnson@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.88 / 4.00', institution:'Queen\'s University', major:'Kinesiology', yearOfStudy:'Final Year', mcatScore:'513 (87th Percentile)' },
    progressStep:3, currentStageDesc:'Interview scheduled for next week. MMI preparation is underway.', estimatedUpdate:'June 3, 2025',
  },
  {
    initials:'AL', color:'bg-cyan-500', name:'Aisha Lawal', program:'Nursing Program',
    university:'Queen\'s University', progress:57, stage:'Secondary', priority:'Medium',
    lastActivity:'1 day ago', lastDate:'May 21, 2025',
    appId:'APP-2025-00909', intake:'Fall 2026', campus:'Kingston, Canada',
    appDate:'April 22, 2025', deadline:'July 10, 2025', source:'School Event', referredBy:'Ms. Grace Nwosu',
    graduation:'Expected Graduation 2027', email:'aisha.lawal@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'PENDING'   },
      { label:'Resume / CV',              status:'PENDING'   },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.62 / 4.00', institution:'York University', major:'Health Sciences', yearOfStudy:'3rd Year', mcatScore:'N/A' },
    progressStep:2, currentStageDesc:'Secondary materials have been received and are being evaluated.', estimatedUpdate:'June 18, 2025',
  },
  {
    initials:'BO', color:'bg-violet-500', name:'Bilal Omar', program:'Pharmacy Program',
    university:'University of Ottawa', progress:72, stage:'Interview', priority:'Low',
    lastActivity:'4 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-01010', intake:'Fall 2026', campus:'Ottawa, Canada',
    appDate:'March 30, 2025', deadline:'July 5, 2025', source:'Online', referredBy:'Dr. Priya Nair',
    graduation:'Expected Graduation 2027', email:'bilal.omar@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'PENDING'   },
    ],
    academic:{ gpa:'3.75 / 4.00', institution:'University of Ottawa', major:'Chemistry', yearOfStudy:'4th Year', mcatScore:'509 (78th Percentile)' },
    progressStep:3, currentStageDesc:'Interview invitation accepted. Preparing for panel session.', estimatedUpdate:'June 8, 2025',
  },
  {
    initials:'CE', color:'bg-lime-600', name:'Chioma Eze', program:'MD Program',
    university:'Dalhousie University', progress:90, stage:'Decision', priority:'Medium',
    lastActivity:'6 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-01111', intake:'Fall 2026', campus:'Halifax, Canada',
    appDate:'February 20, 2025', deadline:'May 25, 2025', source:'Referral', referredBy:'Dr. Kofi Mensah',
    graduation:'Expected Graduation 2026', email:'chioma.eze@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.90 / 4.00', institution:'Dalhousie University', major:'Biomedical Sciences', yearOfStudy:'Final Year', mcatScore:'516 (95th Percentile)' },
    progressStep:4, currentStageDesc:'All materials submitted. Awaiting final admissions decision.', estimatedUpdate:'May 26, 2025',
  },
  {
    initials:'DK', color:'bg-red-500', name:'David Kim', program:'Dentistry Program',
    university:'University of Manitoba', progress:38, stage:'Essays', priority:'At Risk',
    lastActivity:'3 days ago', lastDate:'May 19, 2025',
    appId:'APP-2025-01212', intake:'Fall 2026', campus:'Winnipeg, Canada',
    appDate:'May 5, 2025', deadline:'August 10, 2025', source:'Direct', referredBy:'Dr. Sarah Johnson',
    graduation:'Expected Graduation 2028', email:'david.kim@email.com',
    checklist:[
      { label:'Personal Statement',       status:'PENDING'   },
      { label:'Transcript',               status:'PENDING'   },
      { label:'Letter of Recommendation', status:'PENDING'   },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'PENDING'   },
    ],
    academic:{ gpa:'3.30 / 4.00', institution:'University of Manitoba', major:'Biological Sciences', yearOfStudy:'3rd Year', mcatScore:'498 (47th Percentile)' },
    progressStep:1, currentStageDesc:'Application is at risk — multiple required documents not yet submitted.', estimatedUpdate:'July 20, 2025',
  },
  {
    initials:'EM', color:'bg-amber-600', name:'Elena Morin', program:'Physiotherapy',
    university:'McMaster University', progress:65, stage:'Secondary', priority:'Low',
    lastActivity:'8 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-01313', intake:'Fall 2026', campus:'Hamilton, Canada',
    appDate:'April 12, 2025', deadline:'July 28, 2025', source:'School Event', referredBy:'Prof. Mark Tremblay',
    graduation:'Expected Graduation 2027', email:'elena.morin@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'PENDING'   },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.70 / 4.00', institution:'McMaster University', major:'Exercise Science', yearOfStudy:'3rd Year', mcatScore:'N/A' },
    progressStep:2, currentStageDesc:'Secondary forms received and under initial assessment.', estimatedUpdate:'June 20, 2025',
  },
  {
    initials:'FK', color:'bg-sky-500', name:'Fatou Kouyate', program:'MD Program',
    university:'Laval University', progress:79, stage:'Interview', priority:'Medium',
    lastActivity:'12 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-01414', intake:'Fall 2026', campus:'Quebec City, Canada',
    appDate:'March 28, 2025', deadline:'July 12, 2025', source:'Website', referredBy:'Dr. Chidi Okafor',
    graduation:'Expected Graduation 2027', email:'fatou.kouyate@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.80 / 4.00', institution:'Laval University', major:'Physiology', yearOfStudy:'4th Year', mcatScore:'511 (82nd Percentile)' },
    progressStep:3, currentStageDesc:'Interview confirmed. Student notified and preparing responses.', estimatedUpdate:'June 10, 2025',
  },
  {
    initials:'GA', color:'bg-fuchsia-500', name:'Grace Amadi', program:'Occupational Therapy',
    university:'University of Calgary', progress:83, stage:'Decision', priority:'Low',
    lastActivity:'2 hrs ago', lastDate:'May 22, 2025',
    appId:'APP-2025-01515', intake:'Fall 2026', campus:'Calgary, Canada',
    appDate:'March 10, 2025', deadline:'June 20, 2025', source:'Referral', referredBy:'Ms. Adaeze Umeh',
    graduation:'Expected Graduation 2026', email:'grace.amadi@email.com',
    checklist:[
      { label:'Personal Statement',       status:'SUBMITTED' },
      { label:'Transcript',               status:'SUBMITTED' },
      { label:'Letter of Recommendation', status:'SUBMITTED' },
      { label:'Resume / CV',              status:'SUBMITTED' },
      { label:'Application Fee',          status:'SUBMITTED' },
    ],
    academic:{ gpa:'3.85 / 4.00', institution:'University of Calgary', major:'Rehabilitation Sciences', yearOfStudy:'Final Year', mcatScore:'N/A' },
    progressStep:4, currentStageDesc:'Application complete. Final decision expected within the week.', estimatedUpdate:'May 27, 2025',
  },
];

const STAGE_COLORS: Record<Stage, string> = {
  Interview: 'bg-blue-100  dark:bg-blue-500/20  text-blue-700  dark:text-blue-300',
  Secondary: 'bg-violet-100 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300',
  Essays:    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
  Decision:  'bg-amber-100  dark:bg-amber-500/20  text-amber-700  dark:text-amber-300',
};

const PRIORITY_COLORS: Record<Priority, string> = {
  'At Risk': 'bg-red-100  dark:bg-red-500/20  text-red-700  dark:text-red-300',
  'Medium':  'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300',
  'Low':     'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300',
};

const DONUT_SLICES = [
  { label:'Interview', count:45, pct:37, color:'#3b82f6', dot:'bg-blue-500' },
  { label:'Secondary', count:25, pct:21, color:'#8b5cf6', dot:'bg-violet-500' },
  { label:'Essays',    count:35, pct:29, color:'#22c55e', dot:'bg-emerald-500' },
  { label:'Decisions', count:25, pct:21, color:'#f59e0b', dot:'bg-amber-500' },
];

const STAGE_BREAKDOWN = [
  { label:'Interview', count:48, color:'bg-blue-500' },
  { label:'Secondary', count:36, color:'bg-violet-500' },
  { label:'Essays',    count:16, color:'bg-emerald-500' },
  { label:'Decisions', count:26, color:'bg-amber-500' },
];

const ACTIVE_FILTERS: Stage[] = ['Interview','Secondary','Essays','Decision'];
const PAGE_SIZE = 8;

// ── Donut chart ───────────────────────────────────────────────────────────────
function DonutChart() {
  const total = DONUT_SLICES.reduce((s, d) => s + d.count, 0);
  let cumAngle = -90;
  const R = 52; const cx = 70; const cy = 70;

  function polarToXY(deg: number, r: number) {
    const rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  return (
    <svg viewBox="0 0 140 140" className="w-32 h-32 shrink-0">
      {DONUT_SLICES.map((d, i) => {
        const sweep = (d.count / total) * 360;
        const start = polarToXY(cumAngle, R);
        const end   = polarToXY(cumAngle + sweep, R);
        const large = sweep > 180 ? 1 : 0;
        const path  = `M ${cx} ${cy} L ${start.x} ${start.y} A ${R} ${R} 0 ${large} 1 ${end.x} ${end.y} Z`;
        cumAngle += sweep;
        return <path key={i} d={path} fill={d.color} opacity={0.9} />;
      })}
      <circle cx={cx} cy={cy} r={32} fill="white" className="dark:fill-[#161a27]" />
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="14" fontWeight="700" fill="currentColor" className="text-slate-800 dark:text-white fill-slate-800 dark:fill-white">120</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="7" fill="currentColor" className="fill-slate-400">Total</text>
    </svg>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────
function ProgressBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-emerald-500' : value >= 60 ? 'bg-amber-400' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 min-w-[90px]">
      <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 tabular-nums shrink-0">{value}%</span>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function StudentApplicationsPage() {
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState<'All' | Stage>('All');
  const [stageFilter, setStageFilter] = useState('All Stages');
  const [priorityFilter, setPriorityFilter] = useState('All Priorities');
  const [page, setPage]               = useState(1);
  const [showStage, setShowStage]     = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppRecord | null>(null);

  const TABS: Array<{ label: string; count: number; key: 'All' | Stage }> = [
    { label:'All Application', count:120, key:'All' },
    { label:'Interview',       count:98,  key:'Interview' },
    { label:'Essays',          count:98,  key:'Essays' },
    { label:'Secondary',       count:15,  key:'Secondary' },
    { label:'Decision',        count:95,  key:'Decision' },
  ];

  const filtered = useMemo(() => {
    return ALL_APPLICATIONS.filter(a => {
      const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.university.toLowerCase().includes(search.toLowerCase()) ||
        a.program.toLowerCase().includes(search.toLowerCase());
      const matchTab   = activeTab === 'All' || a.stage === activeTab;
      const matchStage = stageFilter === 'All Stages' || a.stage === stageFilter;
      const matchPrio  = priorityFilter === 'All Priorities' || a.priority === priorityFilter;
      return matchSearch && matchTab && matchStage && matchPrio;
    });
  }, [search, activeTab, stageFilter, priorityFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageData   = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function changePage(p: number) {
    if (p >= 1 && p <= totalPages) setPage(p);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link
              href="/counselor"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
            >
              <ChevronLeft size={15} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Student Applications
            </h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              View and manage all student applications in one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm">
              <Download size={14} /> Export Calendar
            </button>
            <Link
              href="/counselor/add-new-application"
              className="flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all"
            >
              <Plus size={14} /> Add New Application
            </Link>
          </div>
        </div>

        {/* ── Two-column layout ──────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 items-start">

          {/* ── Main table area ─────────────────────────── */}
          <div className="space-y-4">

            {/* Filter tabs + search bar */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

              {/* Tab row */}
              <div className="flex items-center gap-0 border-b border-gray-100 dark:border-white/5 overflow-x-auto px-2">
                {TABS.map(t => (
                  <button
                    key={t.key}
                    onClick={() => { setActiveTab(t.key); setPage(1); }}
                    className={`flex items-center gap-1.5 px-3 py-3.5 text-[11px] font-semibold whitespace-nowrap border-b-2 transition-all ${
                      activeTab === t.key
                        ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                        : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                    {t.label}
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      activeTab === t.key
                        ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300'
                        : 'bg-gray-100 dark:bg-white/8 text-slate-500 dark:text-[#8e92ad]'
                    }`}>{t.count}</span>
                  </button>
                ))}
              </div>

              {/* Search + filter row */}
              <div className="flex flex-wrap items-center gap-2.5 px-4 py-3 border-b border-gray-50 dark:border-white/5">
                {/* Search */}
                <div className="relative flex-1 min-w-[160px]">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Search students..."
                    className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl text-slate-700 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                  />
                </div>

                {/* Stage dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setShowStage(s => !s); setShowPriority(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all"
                  >
                    {stageFilter} <ChevronDown size={12} className={`transition-transform ${showStage ? 'rotate-180' : ''}`} />
                  </button>
                  {showStage && (
                    <div className="absolute z-20 top-full left-0 mt-1.5 w-40 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                      {['All Stages', ...ACTIVE_FILTERS].map(s => (
                        <button key={s} onClick={() => { setStageFilter(s); setShowStage(false); setPage(1); }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${stageFilter === s ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Priority dropdown */}
                <div className="relative">
                  <button
                    onClick={() => { setShowPriority(s => !s); setShowStage(false); }}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all"
                  >
                    {priorityFilter} <ChevronDown size={12} className={`transition-transform ${showPriority ? 'rotate-180' : ''}`} />
                  </button>
                  {showPriority && (
                    <div className="absolute z-20 top-full left-0 mt-1.5 w-44 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                      {['All Priorities','At Risk','Medium','Low'].map(p => (
                        <button key={p} onClick={() => { setPriorityFilter(p); setShowPriority(false); setPage(1); }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${priorityFilter === p ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold' : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/8 rounded-xl hover:bg-gray-100 dark:hover:bg-white/8 transition-all">
                  <SlidersHorizontal size={12} /> Filters
                </button>
              </div>

              {/* ── Table — desktop ── */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-50 dark:border-white/5">
                      {['STUDENT','UNIVERSITY','PROGRESS','STAGE','PRIORITY','LAST ACTIVITY','ACTION'].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                    {pageData.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-400 dark:text-[#8e92ad]">
                          No applications match your filters.
                        </td>
                      </tr>
                    ) : pageData.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{a.initials}</div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{a.name}</p>
                              <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{a.program}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-xs text-slate-500 dark:text-[#8e92ad] truncate max-w-[130px]">{a.university}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <ProgressBar value={a.progress} />
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${STAGE_COLORS[a.stage]}`}>
                            {a.stage}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${PRIORITY_COLORS[a.priority]}`}>
                            {a.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{a.lastActivity}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{a.lastDate}</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => setSelectedApp(a)}
                              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all"
                            >
                              <Eye size={13} />
                            </button>
                            <button className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-gray-100 dark:hover:bg-white/8 transition-all">
                              <MoreHorizontal size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ── Cards — mobile ── */}
              <div className="sm:hidden divide-y divide-gray-50 dark:divide-white/5">
                {pageData.length === 0 ? (
                  <div className="py-10 text-center text-sm text-slate-400 dark:text-[#8e92ad]">No applications match your filters.</div>
                ) : pageData.map((a, i) => (
                  <div key={i} className="px-4 py-4 flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center text-white text-[11px] font-bold shrink-0`}>{a.initials}</div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{a.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{a.program} · {a.university}</p>
                        </div>
                        <button className="text-slate-400"><MoreHorizontal size={15} /></button>
                      </div>
                      <ProgressBar value={a.progress} />
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${STAGE_COLORS[a.stage]}`}>{a.stage}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${PRIORITY_COLORS[a.priority]}`}>{a.priority}</span>
                        <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{a.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-5 py-4 border-t border-gray-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">
                  Showing {Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length} results
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 text-slate-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    <ChevronLeft size={13} />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
                          page === p
                            ? 'bg-cyan-600 text-white shadow-sm'
                            : 'border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && <span className="text-slate-400 text-[11px] px-1">…</span>}
                  {totalPages > 5 && (
                    <button
                      onClick={() => changePage(totalPages)}
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5`}
                    >
                      {totalPages}
                    </button>
                  )}
                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 text-slate-400 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ─────────────────────────── */}
          <div className="space-y-4">

            {/* Application Overview donut */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Application Overview</h3>
              <div className="flex items-center gap-4">
                <DonutChart />
                <div className="space-y-2 flex-1 min-w-0">
                  {DONUT_SLICES.map((d, i) => (
                    <div key={i} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${d.dot}`} />
                        <span className="text-[11px] text-slate-600 dark:text-slate-300 truncate">{d.label}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[11px] font-bold text-slate-700 dark:text-white">{d.count}</span>
                        <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">({d.pct}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stage Breakdown */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Stage Breakdown</h3>
              <div className="space-y-3">
                {STAGE_BREAKDOWN.map((s, i) => {
                  const total = STAGE_BREAKDOWN.reduce((acc, x) => acc + x.count, 0);
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${s.color}`} />
                          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">{s.label}</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 dark:text-white">{s.count}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-white/8 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.color}`} style={{ width: `${(s.count/total)*100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Quick Filters</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon:'🔴', label:'High Priority',    count:120, bg:'bg-red-50 dark:bg-red-500/10',     text:'text-red-600 dark:text-red-400',     filter:() => setPriorityFilter('At Risk') },
                  { icon:'📅', label:'Due this week',    count:98,  bg:'bg-blue-50 dark:bg-blue-500/10',   text:'text-blue-600 dark:text-blue-400',   filter:() => setStageFilter('Interview') },
                  { icon:'⏳', label:'Awaiting Review',  count:12,  bg:'bg-violet-50 dark:bg-violet-500/10', text:'text-violet-600 dark:text-violet-400', filter:() => setActiveTab('Secondary') },
                  { icon:'🆕', label:'New Application',  count:10,  bg:'bg-emerald-50 dark:bg-emerald-500/10', text:'text-emerald-600 dark:text-emerald-400', filter:() => setActiveTab('All') },
                ].map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { q.filter(); setPage(1); }}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl ${q.bg} border border-transparent hover:border-current/20 transition-all text-left`}
                  >
                    <span className="text-base">{q.icon}</span>
                    <p className={`text-[10px] font-semibold ${q.text}`}>{q.label}</p>
                    <p className={`text-lg font-bold ${q.text}`}>{q.count}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-start gap-2 mb-2">
                <HelpCircle size={16} className="text-cyan-600 mt-0.5 shrink-0" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Need Help?</h3>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-3 ml-6">
                Learn how to manage application efficiently.
              </p>
              <button className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                View Help Center
              </button>
            </div>
          </div>
        </div>
      </div>

      {selectedApp && (
        <ApplicationDetailsModal app={selectedApp} onClose={() => setSelectedApp(null)} />
      )}
    </div>
  );
}
