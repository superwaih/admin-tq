'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Plus, Eye, MoreHorizontal, Settings, ChevronDown,
  BookOpen, FileText, Video, Link2, Share2, ArrowUpRight,
  Clapperboard, ExternalLink, ClipboardList, GraduationCap,
  X, Download, Edit2, Globe, Users, Lock, Tag, Clock,
  BarChart2, Calendar, CheckCircle2, Copy, Sparkles, MessageSquare,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'All Categories',   count: 156 },
  { label: 'Admissions',       count: 28  },
  { label: 'Test Preparation', count: 24  },
  { label: 'Essays',           count: 18  },
  { label: 'Interviews',       count: 16  },
  { label: 'Financial Aid',    count: 14  },
  { label: 'Career Guidance',  count: 12  },
  { label: 'Wellness',         count: 8   },
  { label: 'Other',            count: 36  },
];

interface Resource {
  id: number;
  title: string; desc: string; category: string; type: string;
  author: { name: string; initials: string; color: string; role: string };
  date: string; time: string;
  typeColor: string; catColor: string; Icon: React.ElementType;
  views: number; downloads: number; shares: number;
  visibility: 'all' | 'specific' | 'private';
  audience: string;
  tags: string[];
  fileSize?: string;
  url?: string;
  lastReviewed: string;
  sharedWith: { name: string; initials: string; color: string }[];
  notes: string;
}

const RESOURCES: Resource[] = [
  {
    id: 1,
    title: 'Common App Essay Guide',
    desc:  'Comprehensive guide to writing a compelling Common App personal statement. Covers structure, tone, authenticity, and common mistakes to avoid. Includes real student examples with before/after annotations.',
    category: 'Essays', type: 'PDF',
    author: { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-cyan-500', role: 'Senior Counselor' },
    date: 'May 28, 2025', time: '2:30 PM',
    typeColor: 'bg-red-50 dark:bg-red-500/12 text-red-600 dark:text-red-400',
    catColor:  'bg-blue-50 dark:bg-blue-500/12 text-blue-600 dark:text-blue-400',
    Icon: FileText,
    views: 142, downloads: 89, shares: 24,
    visibility: 'all', audience: 'All Students',
    tags: ['Personal Statement', 'Common App', 'Essays', 'Writing'],
    fileSize: '2.4 MB', lastReviewed: 'May 28, 2025',
    sharedWith: [
      { name: 'Amina Yusuf',    initials: 'AY', color: 'bg-yellow-400' },
      { name: 'Daniel Musa',    initials: 'DM', color: 'bg-blue-500'   },
      { name: 'Fatima Bello',   initials: 'FB', color: 'bg-pink-500'   },
      { name: 'Ibrahim Ali',    initials: 'IA', color: 'bg-green-500'  },
    ],
    notes: 'Great reference for students struggling with the 650-word limit. Recommend pairing with the Common App webinar video.',
  },
  {
    id: 2,
    title: 'Interview Preparation Tips',
    desc:  'Video series covering common interview questions, body language, and best practices for both in-person and virtual interviews. Includes mock interview walkthroughs and a scoring rubric.',
    category: 'Interviews', type: 'Video',
    author: { name: 'James Wilson', initials: 'JW', color: 'bg-green-500', role: 'Interview Coach' },
    date: 'May 27, 2025', time: '11:15 AM',
    typeColor: 'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400',
    catColor:  'bg-emerald-50 dark:bg-emerald-500/12 text-emerald-700 dark:text-emerald-400',
    Icon: Video,
    views: 98, downloads: 0, shares: 31,
    visibility: 'specific', audience: 'Medicine Applicants',
    tags: ['MMI', 'Interview', 'Body Language', 'Mock Interview'],
    url: 'https://youtube.com/watch?v=example', lastReviewed: 'May 27, 2025',
    sharedWith: [
      { name: 'Maryam Okafor',  initials: 'MO', color: 'bg-orange-400' },
      { name: 'Samuel Johnson', initials: 'SJ', color: 'bg-indigo-500' },
      { name: 'Halima Sani',    initials: 'HS', color: 'bg-red-400'    },
    ],
    notes: 'Especially useful for CASPer prep. Ask students to watch before their first mock session.',
  },
  {
    id: 3,
    title: 'FAFSA Official Website',
    desc:  'Official link to the FAFSA application portal for financial aid. Students should complete this as early as possible — funding is limited and awarded on a first-come, first-served basis.',
    category: 'Financial Aid', type: 'Link',
    author: { name: 'Dr. Sarah Johnson', initials: 'SJ', color: 'bg-cyan-500', role: 'Senior Counselor' },
    date: 'May 25, 2025', time: '4:45 PM',
    typeColor: 'bg-cyan-50 dark:bg-cyan-500/12 text-cyan-600 dark:text-cyan-400',
    catColor:  'bg-amber-50 dark:bg-amber-500/12 text-amber-600 dark:text-amber-400',
    Icon: Link2,
    views: 76, downloads: 0, shares: 18,
    visibility: 'all', audience: 'All Students',
    tags: ['Financial Aid', 'FAFSA', 'Scholarships', 'Funding'],
    url: 'https://studentaid.gov/h/apply-for-aid/fafsa', lastReviewed: 'May 25, 2025',
    sharedWith: [
      { name: 'Ibrahim Ali',    initials: 'IA', color: 'bg-green-500'  },
      { name: 'Halima Sani',    initials: 'HS', color: 'bg-red-400'    },
    ],
    notes: 'Deadline is typically June 30. Send a reminder to all students in mid-May.',
  },
  {
    id: 4,
    title: 'SAT Preparation Checklist',
    desc:  'Step-by-step checklist to help students prepare for the SAT exam. Covers study schedule templates, recommended practice tests, test-day logistics, and subject-specific strategies.',
    category: 'Test Preparation', type: 'PDF',
    author: { name: 'Michael Brown', initials: 'MB', color: 'bg-orange-400', role: 'Academic Advisor' },
    date: 'May 24, 2025', time: '9:20 AM',
    typeColor: 'bg-red-50 dark:bg-red-500/12 text-red-600 dark:text-red-400',
    catColor:  'bg-violet-50 dark:bg-violet-500/12 text-violet-600 dark:text-violet-400',
    Icon: ClipboardList,
    views: 61, downloads: 47, shares: 12,
    visibility: 'specific', audience: 'First-Year Students',
    tags: ['SAT', 'Test Prep', 'GPA', 'Study Schedule'],
    fileSize: '1.1 MB', lastReviewed: 'May 24, 2025',
    sharedWith: [
      { name: 'Daniel Musa',    initials: 'DM', color: 'bg-blue-500'   },
      { name: 'Joshua Adeyemi', initials: 'JA', color: 'bg-teal-500'   },
    ],
    notes: 'Pair with the Khan Academy SAT link. Recommend students start 3 months before their test date.',
  },
  {
    id: 5,
    title: 'Choosing the Right Major',
    desc:  'Webinar recording on selecting a major aligned with your personal interests, career goals, and university strengths. Features Q&A from current university students and career counselors.',
    category: 'Career Guidance', type: 'Video',
    author: { name: 'Emily Davis', initials: 'ED', color: 'bg-pink-500', role: 'Career Advisor' },
    date: 'May 22, 2025', time: '3:10 PM',
    typeColor: 'bg-purple-50 dark:bg-purple-500/12 text-purple-600 dark:text-purple-400',
    catColor:  'bg-teal-50 dark:bg-teal-500/12 text-teal-700 dark:text-teal-400',
    Icon: GraduationCap,
    views: 53, downloads: 0, shares: 9,
    visibility: 'all', audience: 'All Students',
    tags: ['Career', 'Major', 'University', 'Extracurriculars'],
    url: 'https://youtube.com/watch?v=example2', lastReviewed: 'May 22, 2025',
    sharedWith: [
      { name: 'Amina Yusuf',   initials: 'AY', color: 'bg-yellow-400' },
      { name: 'Fatima Bello',  initials: 'FB', color: 'bg-pink-500'   },
      { name: 'Samuel Johnson',initials: 'SJ', color: 'bg-indigo-500' },
      { name: 'Maryam Okafor', initials: 'MO', color: 'bg-orange-400' },
    ],
    notes: 'Students with undecided majors find this most helpful. Schedule a follow-up session after they watch.',
  },
];

const STAT_CARDS = [
  { label: 'Total Resources',   value: '156', trend: '+18%', icon: BookOpen,  iconCls: 'text-slate-400',   color: 'text-slate-800 dark:text-white'               },
  { label: 'Documents',         value: '68',  trend: '+12%', icon: FileText,  iconCls: 'text-blue-400',    color: 'text-blue-600 dark:text-blue-400'             },
  { label: 'Videos',            value: '42',  trend: '+22%', icon: Video,     iconCls: 'text-purple-400',  color: 'text-purple-600 dark:text-purple-400'         },
  { label: 'Links',             value: '32',  trend: '+8%',  icon: Link2,     iconCls: 'text-emerald-400', color: 'text-emerald-600 dark:text-emerald-400'       },
  { label: 'Shared This Month', value: '98',  trend: '+15%', icon: Share2,    iconCls: 'text-amber-400',   color: 'text-amber-600 dark:text-amber-400'           },
];

// ── Resource Preview Modal ────────────────────────────────────────────────────

function ResourceModal({ resource, onClose }: { resource: Resource; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (resource.url) navigator.clipboard.writeText(resource.url).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const VisIcon = resource.visibility === 'all' ? Globe
    : resource.visibility === 'specific'        ? Users
    : Lock;
  const visLabel = resource.visibility === 'all' ? 'All Students'
    : resource.visibility === 'specific'          ? resource.audience
    : 'Private (Draft)';
  const visCls = resource.visibility === 'all'      ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15'
    : resource.visibility === 'specific'             ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15'
    : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15';

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>

      {/* Dialog */}
      <div className="relative bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/8 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* ── Header ── */}
        <div className="sticky top-0 z-10 bg-white dark:bg-[#161a27] border-b border-gray-100 dark:border-white/6 px-6 py-4 flex items-start justify-between gap-3 rounded-t-2xl">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/8 flex items-center justify-center shrink-0 mt-0.5">
              <resource.Icon size={18} className="text-slate-500 dark:text-[#8e92ad]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-slate-900 dark:text-white leading-tight">{resource.title}</h2>
              <div className="flex items-center flex-wrap gap-1.5 mt-1">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${resource.typeColor}`}>{resource.type}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${resource.catColor}`}>{resource.category}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${visCls}`}>
                  <VisIcon size={8}/>{visLabel}
                </span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-white/8 transition-all shrink-0">
            <X size={16}/>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="p-6 space-y-5">

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Eye,      label: 'Views',     value: resource.views                       },
              { icon: Download, label: 'Downloads',  value: resource.type === 'Link' || resource.type === 'Video' ? '—' : resource.downloads },
              { icon: Share2,   label: 'Shares',    value: resource.shares                      },
            ].map(s => (
              <div key={s.label} className="bg-slate-50 dark:bg-white/4 rounded-xl p-3 text-center">
                <s.icon size={14} className="text-slate-400 mx-auto mb-1"/>
                <p className="text-base font-bold text-slate-800 dark:text-white">{s.value}</p>
                <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">Description</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{resource.desc}</p>
          </div>

          {/* URL (for links/video) */}
          {resource.url && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">
                {resource.type === 'Video' ? 'Video URL' : 'External URL'}
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
                <Link2 size={13} className="text-slate-400 shrink-0"/>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 flex-1 truncate">{resource.url}</span>
                <button onClick={handleCopy}
                  className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg transition-all ${
                    copied ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600' : 'hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500'
                  }`}>
                  {copied ? <><CheckCircle2 size={10}/> Copied</> : <><Copy size={10}/> Copy</>}
                </button>
                <a href={resource.url} target="_blank" rel="noreferrer"
                  className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-white/8 text-slate-500 hover:text-cyan-600 transition-all">
                  <ExternalLink size={10}/> Open
                </a>
              </div>
            </div>
          )}

          {/* File info */}
          {resource.fileSize && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">File Info</p>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-slate-400"/>
                  <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">{resource.title}.{resource.type.toLowerCase()}</span>
                </div>
                <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{resource.fileSize}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ml-auto ${resource.typeColor}`}>{resource.type}</span>
              </div>
            </div>
          )}

          {/* 2-col: Author + Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Author */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">Created By</p>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
                <div className={`w-9 h-9 rounded-xl ${resource.author.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                  {resource.author.initials}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">{resource.author.name}</p>
                  <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{resource.author.role}</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">Dates</p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Calendar size={11} className="text-slate-400"/><span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">Uploaded</span></div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{resource.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><Clock size={11} className="text-slate-400"/><span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">Time</span></div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{resource.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5"><CheckCircle2 size={11} className="text-emerald-500"/><span className="text-[10px] text-slate-500 dark:text-[#8e92ad]">Last Reviewed</span></div>
                  <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-200">{resource.lastReviewed}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {resource.tags.map(t => (
                <span key={t} className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
                  <Tag size={8}/>{t}
                </span>
              ))}
            </div>
          </div>

          {/* Shared with */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2">
              Shared With ({resource.sharedWith.length} students)
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {resource.sharedWith.map(s => (
                <div key={s.name} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
                  <div className={`w-5 h-5 rounded-full ${s.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>{s.initials}</div>
                  <span className="text-[10px] font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Counselor notes */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#5a5f78] mb-2 flex items-center gap-1.5">
              <MessageSquare size={10}/> Counselor Notes
            </p>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20">
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">{resource.notes}</p>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-4 text-white">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles size={12} className="text-violet-200"/>
              <span className="text-[10px] font-bold text-violet-200">AI Insight</span>
            </div>
            <p className="text-[11px] text-violet-100 leading-relaxed">
              Students who access this resource <span className="font-bold text-white">before their counselling session</span> show{' '}
              <span className="font-bold text-white">23% higher</span> session productivity scores on average.
            </p>
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="sticky bottom-0 bg-white dark:bg-[#161a27] border-t border-gray-100 dark:border-white/6 px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-b-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              <Share2 size={12}/> Share
            </button>
            {resource.fileSize && (
              <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <Download size={12}/> Download
              </button>
            )}
            {resource.url && (
              <a href={resource.url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                <ExternalLink size={12}/> Open Link
              </a>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
              Close
            </button>
            <Link href="/counselor/upload-resources"
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold transition-all">
              <Edit2 size={12}/> Edit Resource
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ResourcesPage() {
  const [activeCat, setActiveCat]           = useState('All Categories');
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      {/* Modal */}
      {selectedResource && (
        <ResourceModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}

      <div className="max-w-[1400px] mx-auto space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Resources</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Access and share curated resources to support student success.</p>
          </div>
          <Link href="/counselor/upload-resources" className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Plus size={15} /> Add Resource
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} className={s.iconCls} />
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-wider text-right">{s.label}</p>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1"><ArrowUpRight size={10} /> {s.trend}</p>
              </div>
            );
          })}
        </div>

        {/* Search + Filters */}
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input placeholder="Search resources by title, category, or keyword..." className="w-full h-9 pl-9 pr-4 text-sm bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400/50 transition-all" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {['All Categories','All Resource Types','All Departments','Created By Me'].map(f => (
                <button key={f} className="flex items-center gap-1.5 h-9 px-3.5 bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-xl text-xs font-semibold text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
                  {f} <ChevronDown size={12} />
                </button>
              ))}
              <button className="h-9 px-3.5 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">Reset</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-5 items-start">
          {/* Category list */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-widest">CATEGORIES</p>
            </div>
            <div className="py-2">
              {CATEGORIES.map(c => (
                <button key={c.label} onClick={() => setActiveCat(c.label)}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs transition-colors ${activeCat === c.label ? 'font-bold text-cyan-600 bg-cyan-50 dark:bg-cyan-500/10' : 'font-medium text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/[0.03]'}`}>
                  <span>{c.label}</span>
                  <span className={`text-[10px] font-bold ${activeCat === c.label ? 'bg-cyan-600 text-white px-1.5 py-0.5 rounded-full' : 'text-slate-400 dark:text-[#40455e]'}`}>{c.count}</span>
                </button>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-50 dark:border-white/5">
              <button className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-white transition-colors">
                <Settings size={13} /> Manage Categories
              </button>
            </div>
          </div>

          {/* Resource list */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5">
                    {['RESOURCE','CATEGORY','TYPE','CREATED BY','LAST UPDATED','ACTIONS'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-[#40455e] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-white/[0.04]">
                  {RESOURCES.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/8 flex items-center justify-center shrink-0">
                            <r.Icon size={16} className="text-slate-500 dark:text-[#8e92ad]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-white">{r.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed line-clamp-2 max-w-[200px]">{r.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.catColor}`}>{r.category}</span></td>
                      <td className="px-5 py-4"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.typeColor}`}>{r.type}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${r.author.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{r.author.initials}</div>
                          <p className="text-xs text-slate-600 dark:text-[#c8ccdf] truncate max-w-[80px]">{r.author.name}</p>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-xs text-slate-600 dark:text-[#c8ccdf]">{r.date}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{r.time}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedResource(r)}
                            title="Preview resource"
                            className="p-1.5 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 rounded-lg transition-all">
                            <Eye size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
              <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Showing 1 to 5 of 156 resources</p>
              <div className="flex items-center gap-1">
                <button className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-30 transition-all">◀</button>
                {[1,2,3].map(n => (
                  <button key={n} className={`w-7 h-7 rounded-md text-xs font-bold transition-all ${n === 1 ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5'}`}>{n}</button>
                ))}
                <span className="text-slate-400 text-xs">... 32</span>
                <button className="p-1.5 border border-gray-100 dark:border-white/8 rounded-md text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">▶</button>
                <select className="ml-2 h-7 px-2 text-xs bg-white dark:bg-[#161a27] border border-gray-100 dark:border-white/8 rounded-md text-slate-500 dark:text-[#8e92ad] outline-none">
                  <option>5 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
