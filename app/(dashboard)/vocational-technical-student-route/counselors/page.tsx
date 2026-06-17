'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Star, MapPin, Globe, Video, MessageSquare, Phone, Bookmark,
  BookmarkCheck, ChevronDown, Award, GraduationCap, Zap,
  Calendar, ArrowRight, BadgeCheck, CheckCircle2, X,
  Clock, ChevronLeft, ChevronRight, Check, Users,
  Search, Filter, Shuffle, HelpCircle, Wrench, HardHat,
  Sparkles, Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import BookedSessionsCalendar from './BookedSessionsCalendar';

// ── Types ──────────────────────────────────────────────────────────────────

interface Mentor {
  id: number;
  name: string;
  credentials: string;
  title: string;
  avatar: string;
  avatarGradient: string;
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  provinces: string[];
  languages: string[];
  language: string;
  availability: 'available' | 'busy' | 'booked';
  nextSlot: string;
  price: number;
  free: boolean;
  formats: ('Virtual' | 'In-person')[];
  sessionTypes: ('Video' | 'Chat' | 'Phone')[];
  featured: boolean;
  verified: boolean;
  bio: string;
  fullBio: string;
  trades: string[];
  institutes: string[];
  studentsHelped: number;
  completionRate: number;
  programHighlights: string[];
  successHighlights: string[];
  category: string;
  reviewsList: { name: string; avatar: string; rating: number; text: string; program: string }[];
}

// ── Sample Data ────────────────────────────────────────────────────────────

const MENTORS: Mentor[] = [
  {
    id: 1,
    name: 'Daniel Brooks',
    credentials: 'Red Seal · 309A',
    title: 'Red Seal Electrician · Apprenticeship Mentor',
    avatar: 'DB',
    avatarGradient: 'from-blue-500 to-indigo-600',
    rating: 4.9,
    reviews: 142,
    experience: 15,
    location: 'Toronto, ON',
    provinces: ['Ontario'],
    languages: ['English'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Today, 3:00 PM',
    price: 0,
    free: true,
    formats: ['Virtual', 'In-person'],
    sessionTypes: ['Video', 'Chat'],
    featured: true,
    verified: true,
    bio: 'Red Seal journeyperson electrician with 15 years on the tools. Helps apprentices secure sponsorship and pass the 309A Certificate of Qualification.',
    fullBio: 'Red Seal journeyperson electrician with 15 years on the tools and 6 years as a registered training mentor with Skilled Trades Ontario. I guide apprentices through finding an employer sponsor, logging hours, and preparing for the 309A Certificate of Qualification exam. My mentoring programme pairs you with a structured 12-week plan and weekly check-ins.',
    trades: ['Electrical', 'Construction Electrician', 'Industrial Electrician'],
    institutes: ['Skilled Trades Ontario', 'George Brown College', 'Conestoga College'],
    studentsHelped: 210,
    completionRate: 93,
    programHighlights: ['12-week structured mentoring plan', 'Sponsorship & resume coaching', 'C of Q exam prep sessions'],
    successHighlights: ['309A C of Q — first attempt', 'Sponsored at union shop (IBEW)', 'Pre-apprenticeship at George Brown'],
    category: 'Electrical',
    reviewsList: [
      { name: 'Riya S.', avatar: 'RS', rating: 5, text: 'Daniel helped me find a sponsor and passed my 309A on the first try.', program: '309A Electrician' },
      { name: 'Jason L.', avatar: 'JL', rating: 5, text: 'The hour-logging system he taught me kept my apprenticeship on track.', program: 'Construction Electrician' },
      { name: 'Ananya P.', avatar: 'AP', rating: 5, text: 'Practical, no-nonsense advice from someone who has actually done the work.', program: 'Pre-Apprenticeship' },
    ],
  },
  {
    id: 2,
    name: 'Marie Lavoie',
    credentials: 'Sceau rouge · 310S',
    title: 'Red Seal Automotive Tech · Trade Instructor',
    avatar: 'ML',
    avatarGradient: 'from-emerald-500 to-teal-600',
    rating: 4.8,
    reviews: 96,
    experience: 11,
    location: 'Montréal, QC',
    provinces: ['Quebec'],
    languages: ['French', 'English'],
    language: 'French',
    availability: 'available',
    nextSlot: 'Tomorrow, 10:00 AM',
    price: 70,
    free: false,
    formats: ['Virtual', 'In-person'],
    sessionTypes: ['Video', 'Phone'],
    featured: true,
    verified: true,
    bio: 'Bilingual automotive service technician and DEP instructor. Specialises in the Québec CCQ pathway and DEP en mécanique automobile admissions.',
    fullBio: 'Bilingual (FR/EN) Red Seal automotive service technician and instructor for the DEP en mécanique automobile. I help students navigate the Québec apprenticeship system (CCQ) and college technical-diploma intake, including the aptitude assessments and shop placements. Sessions available in French or English.',
    trades: ['Automotive', 'Auto Service Technician', 'Heavy Truck'],
    institutes: ['CCQ Québec', 'Cégep technical programs', 'Red Seal Program'],
    studentsHelped: 168,
    completionRate: 90,
    programHighlights: ['Bilingual FR/EN mentoring', 'DEP & CCQ intake guidance', 'Shop-placement preparation'],
    successHighlights: ['DEP Mécanique automobile', '310S Red Seal challenge', 'Dealership apprenticeship'],
    category: 'Automotive',
    reviewsList: [
      { name: 'Préethi M.', avatar: 'PM', rating: 5, text: 'Marie expliqua tout le parcours CCQ clairement. Très utile!', program: 'DEP Mécanique' },
      { name: 'Sanjay R.', avatar: 'SR', rating: 5, text: 'Helped me land a dealership apprenticeship placement.', program: '310S Apprenticeship' },
      { name: 'Lena K.', avatar: 'LK', rating: 4, text: 'Great bilingual support and aptitude-test tips.', program: 'Auto Service Tech' },
    ],
  },
  {
    id: 3,
    name: 'Gurpreet Singh',
    credentials: 'Red Seal · CWB Inspector',
    title: 'Welding Mentor & CWB Inspector',
    avatar: 'GS',
    avatarGradient: 'from-amber-500 to-orange-600',
    rating: 4.9,
    reviews: 88,
    experience: 13,
    location: 'Calgary, AB',
    provinces: ['Alberta', 'Saskatchewan'],
    languages: ['English', 'Punjabi', 'Hindi'],
    language: 'Punjabi',
    availability: 'available',
    nextSlot: 'Today, 7:30 PM',
    price: 60,
    free: false,
    formats: ['Virtual', 'In-person'],
    sessionTypes: ['Video', 'Chat'],
    featured: true,
    verified: true,
    bio: 'CWB-certified welding inspector and Red Seal welder. Mentors apprentices through SAIT/NAIT intake and Alberta Apprenticeship & Industry Training.',
    fullBio: 'CWB-certified welding inspector and Red Seal welder with 13 years in structural and pipe welding. I mentor apprentices through Alberta Apprenticeship & Industry Training (AIT) registration, SAIT and NAIT program intake, and CWB ticket preparation. Multilingual support in English, Punjabi and Hindi.',
    trades: ['Welding', 'Pipe Welding', 'Metal Fabrication'],
    institutes: ['Alberta Apprenticeship & Industry Training', 'SAIT', 'NAIT'],
    studentsHelped: 134,
    completionRate: 91,
    programHighlights: ['CWB ticket prep', 'Multilingual mentoring (EN/PA/HI)', 'SAIT & NAIT intake guidance'],
    successHighlights: ['NAIT Welding diploma', 'CWB All-Position ticket', 'Pipeline apprenticeship'],
    category: 'Welding & Fabrication',
    reviewsList: [
      { name: 'Arjun S.', avatar: 'AS', rating: 5, text: 'Gurpreet got me ready for my CWB test and NAIT intake.', program: 'NAIT Welding' },
      { name: 'Mei L.', avatar: 'ML', rating: 5, text: 'Multilingual help made the whole process so much easier for my family.', program: 'Pipe Welding' },
      { name: 'Ben T.', avatar: 'BT', rating: 4, text: 'Knows the Alberta AIT system inside out.', program: 'Metal Fabrication' },
    ],
  },
  {
    id: 4,
    name: 'Sarah Mitchell',
    credentials: 'M.Ed · Apprenticeship Advisor',
    title: 'Apprenticeship & College Admissions Advisor',
    avatar: 'SM',
    avatarGradient: 'from-violet-500 to-purple-600',
    rating: 4.8,
    reviews: 113,
    experience: 9,
    location: 'Burnaby, BC',
    provinces: ['British Columbia'],
    languages: ['English', 'Mandarin'],
    language: 'English',
    availability: 'busy',
    nextSlot: 'Wed, 2:00 PM',
    price: 0,
    free: true,
    formats: ['Virtual'],
    sessionTypes: ['Video', 'Chat', 'Phone'],
    featured: false,
    verified: true,
    bio: 'SkilledTradesBC-registered advisor specialising in BCIT technical-diploma admissions and the foundation-to-apprenticeship pathway.',
    fullBio: 'Registered apprenticeship advisor working with SkilledTradesBC and BCIT. I help students choose between foundation programs and direct apprenticeship, build their application, and understand provincial funding and grants. Free mentoring for first-generation and youth applicants.',
    trades: ['College Admissions', 'Carpentry', 'Electrical', 'Plumbing'],
    institutes: ['SkilledTradesBC', 'BCIT', 'Camosun College'],
    studentsHelped: 245,
    completionRate: 92,
    programHighlights: ['Free for youth & first-gen', 'BCIT application review', 'Funding & grants guidance'],
    successHighlights: ['BCIT Trades Foundation', 'Youth Work in Trades', 'StudentAid BC grant secured'],
    category: 'College Admissions',
    reviewsList: [
      { name: 'Katie M.', avatar: 'KM', rating: 5, text: 'Sarah helped me pick the right BCIT foundation program and get funding.', program: 'BCIT Foundation' },
      { name: 'Omar F.', avatar: 'OF', rating: 4, text: 'Clear, patient guidance through the whole SkilledTradesBC process.', program: 'Youth in Trades' },
      { name: 'Grace L.', avatar: 'GL', rating: 5, text: 'She found grants I had no idea I qualified for.', program: 'Carpentry Foundation' },
    ],
  },
  {
    id: 5,
    name: 'Tom Whitefeather',
    credentials: 'Red Seal · Heavy Equipment',
    title: 'Heavy Equipment & Construction Mentor',
    avatar: 'TW',
    avatarGradient: 'from-cyan-500 to-blue-600',
    rating: 4.7,
    reviews: 67,
    experience: 18,
    location: 'Saskatoon, SK',
    provinces: ['Saskatchewan', 'Manitoba'],
    languages: ['English', 'Cree'],
    language: 'Cree',
    availability: 'available',
    nextSlot: 'Today, 5:00 PM',
    price: 0,
    free: true,
    formats: ['Virtual', 'In-person'],
    sessionTypes: ['Video', 'Phone'],
    featured: false,
    verified: true,
    bio: 'Red Seal heavy equipment technician mentoring rural and Indigenous apprentices through the SATCC pathway and construction-sector entry.',
    fullBio: 'Red Seal heavy equipment technician with 18 years in mining and construction. I mentor rural and Indigenous apprentices through the Saskatchewan Apprenticeship and Trade Certification Commission (SATCC), helping with travel-for-training logistics, sponsorship, and safety tickets. Cree-language support available.',
    trades: ['Heavy Equipment', 'Construction', 'Civil'],
    institutes: ['SATCC', 'Saskatchewan Polytechnic', 'Apprenticeship Manitoba'],
    studentsHelped: 98,
    completionRate: 88,
    programHighlights: ['Rural & Indigenous focus', 'Safety-ticket support', 'Sponsorship & travel-for-training help'],
    successHighlights: ['SATCC Heavy Equipment', 'Mine-site apprenticeship', 'Sask Polytech Civil Tech'],
    category: 'Construction',
    reviewsList: [
      { name: 'Tyler N.', avatar: 'TN', rating: 5, text: 'Tom understood the challenges of training far from home.', program: 'Heavy Equipment' },
      { name: 'Sara J.', avatar: 'SJ', rating: 4, text: 'Great help navigating SATCC and getting my safety tickets.', program: 'Construction' },
      { name: 'Chris B.', avatar: 'CB', rating: 5, text: 'Relatable, practical and genuinely cares about apprentices.', program: 'Civil Tech' },
    ],
  },
  {
    id: 6,
    name: 'Linda Chen',
    credentials: 'B.Tech · Admissions',
    title: 'Technical College Admissions Advisor',
    avatar: 'LC',
    avatarGradient: 'from-rose-500 to-pink-600',
    rating: 4.8,
    reviews: 104,
    experience: 10,
    location: 'Toronto, ON',
    provinces: ['Ontario'],
    languages: ['English', 'Mandarin', 'Cantonese'],
    language: 'Mandarin',
    availability: 'available',
    nextSlot: 'Tomorrow, 1:00 PM',
    price: 85,
    free: false,
    formats: ['Virtual', 'In-person'],
    sessionTypes: ['Video', 'Chat', 'Phone'],
    featured: false,
    verified: true,
    bio: 'College admissions advisor for technical and applied-technology diplomas at George Brown, Humber, Centennial and Conestoga.',
    fullBio: 'Admissions advisor specialising in technical and applied-technology diploma programs across Ontario colleges — George Brown, Humber, Centennial and Conestoga. I help with program selection, OCAS applications, portfolio prep, and transition from high school to college technical programs.',
    trades: ['College Admissions', 'HVAC/R', 'Mechanical Tech', 'Electrical Tech'],
    institutes: ['George Brown College', 'Humber College', 'Centennial College', 'Conestoga College'],
    studentsHelped: 188,
    completionRate: 90,
    programHighlights: ['OCAS application coaching', 'Program-selection strategy', 'Portfolio & interview prep'],
    successHighlights: ['Humber HVAC Diploma', 'Centennial Mechanical Tech', 'George Brown Construction'],
    category: 'College Admissions',
    reviewsList: [
      { name: 'Dev C.', avatar: 'DC', rating: 5, text: 'Linda helped me build the perfect college shortlist for HVAC.', program: 'Humber HVAC' },
      { name: 'Sophia T.', avatar: 'ST', rating: 5, text: 'Knew exactly what each college program was looking for.', program: 'Mechanical Tech' },
      { name: 'Michael B.', avatar: 'MB', rating: 5, text: 'Professional, responsive and very organised.', program: 'Construction Eng Tech' },
    ],
  },
  {
    id: 7,
    name: 'Robert Friesen',
    credentials: 'Red Seal · Steamfitter',
    title: 'Plumber & Steamfitter Mentor',
    avatar: 'RF',
    avatarGradient: 'from-lime-500 to-green-600',
    rating: 4.7,
    reviews: 59,
    experience: 14,
    location: 'Winnipeg, MB',
    provinces: ['Manitoba'],
    languages: ['English'],
    language: 'English',
    availability: 'booked',
    nextSlot: 'Fri, 9:00 AM',
    price: 55,
    free: false,
    formats: ['Virtual', 'In-person'],
    sessionTypes: ['Video', 'Chat'],
    featured: false,
    verified: true,
    bio: 'Red Seal plumber and steamfitter mentoring apprentices through Apprenticeship Manitoba and the mechanical trades pathway.',
    fullBio: 'Red Seal plumber and steamfitter/pipefitter with 14 years in commercial mechanical work. I mentor apprentices registering with Apprenticeship Manitoba, help with technical-training scheduling at RRC Polytech, and prepare candidates for inter-provincial Red Seal exams.',
    trades: ['Plumbing', 'Steamfitter/Pipefitter', 'Gasfitter'],
    institutes: ['Apprenticeship Manitoba', 'RRC Polytech', 'Red Seal Program'],
    studentsHelped: 87,
    completionRate: 89,
    programHighlights: ['Red Seal exam prep', 'Technical-training scheduling', 'Level-by-level mentoring'],
    successHighlights: ['Red Seal Plumber', 'RRC Polytech Plumbing', 'Commercial steamfitter role'],
    category: 'Plumbing',
    reviewsList: [
      { name: 'Isabella R.', avatar: 'IR', rating: 5, text: 'Robert mapped out every apprenticeship level for me.', program: 'Plumbing' },
      { name: 'Finn O.', avatar: 'FO', rating: 5, text: 'His Red Seal exam prep was spot on.', program: 'Red Seal Plumber' },
      { name: 'Zara M.', avatar: 'ZM', rating: 4, text: 'Very organised and knows the Manitoba system well.', program: 'Steamfitter' },
    ],
  },
  {
    id: 8,
    name: 'Amara Okafor',
    credentials: 'Red Seal · 313A HVAC',
    title: 'HVAC/R Mentor & Apprenticeship Advisor',
    avatar: 'AO',
    avatarGradient: 'from-red-500 to-rose-600',
    rating: 4.6,
    reviews: 48,
    experience: 8,
    location: 'Halifax, NS',
    provinces: ['Nova Scotia', 'New Brunswick', 'Prince Edward Island'],
    languages: ['English', 'French'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Today, 6:00 PM',
    price: 0,
    free: true,
    formats: ['Virtual'],
    sessionTypes: ['Video', 'Phone'],
    featured: false,
    verified: false,
    bio: 'Red Seal refrigeration & air-conditioning mechanic mentoring Atlantic Canada apprentices via the Nova Scotia Apprenticeship Agency.',
    fullBio: 'Red Seal refrigeration and air-conditioning mechanic (313A) mentoring apprentices across Atlantic Canada through the Nova Scotia Apprenticeship Agency and the Atlantic Apprenticeship Harmonization Project. I cover NSCC intake, ozone-depletion certification, and women-in-trades support. Free virtual mentoring.',
    trades: ['HVAC/R', 'Refrigeration', 'Sheet Metal'],
    institutes: ['Nova Scotia Apprenticeship Agency', 'NSCC', 'Red Seal Program'],
    studentsHelped: 72,
    completionRate: 87,
    programHighlights: ['Free virtual mentoring', 'Women-in-trades support', 'NSCC intake & ODP certification'],
    successHighlights: ['313A HVAC/R apprenticeship', 'NSCC Refrigeration diploma', 'ODP certification'],
    category: 'Mechanical & HVAC',
    reviewsList: [
      { name: 'Claire F.', avatar: 'CF', rating: 5, text: 'Amara made starting in trades far less intimidating.', program: '313A HVAC/R' },
      { name: 'Thomas B.', avatar: 'TB', rating: 4, text: 'Really helpful with NSCC intake and certification.', program: 'NSCC Refrigeration' },
      { name: 'Amina O.', avatar: 'AO', rating: 5, text: 'Her women-in-trades support meant a lot to me.', program: 'Sheet Metal' },
    ],
  },
];

const PROVINCES = [
  'All', 'Ontario', 'British Columbia', 'Alberta', 'Quebec', 'Manitoba',
  'Saskatchewan', 'Nova Scotia', 'New Brunswick', 'Newfoundland and Labrador',
  'Prince Edward Island', 'Northwest Territories', 'Yukon', 'Nunavut',
];

const CATEGORIES = ['All', 'Electrical', 'Automotive', 'Welding & Fabrication', 'Construction', 'Mechanical & HVAC', 'Plumbing', 'College Admissions'];
const TRADE_OPTIONS = ['All', 'Electrical', 'Automotive', 'Welding', 'Plumbing', 'HVAC/R', 'Carpentry', 'Heavy Equipment', 'College Admissions'];
const LANGUAGE_OPTIONS = ['All', 'English', 'French', 'Punjabi', 'Mandarin', 'Cree'];
const FORMAT_OPTIONS = ['All', 'Virtual', 'In-person'];
const SORT_OPTIONS = ['Top Rated', 'Fee: Low to High', 'Fee: High to Low', 'Most Mentees'];

const TOP_TRADES = [
  { label: 'Electrical', count: 24 },
  { label: 'Welding & Fabrication', count: 18 },
  { label: 'Automotive', count: 16 },
  { label: 'HVAC/R & Refrigeration', count: 12 },
  { label: 'Plumbing & Pipefitting', count: 14 },
];

function getNextDays(n: number) {
  const days = [];
  const now = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[d.getDay()],
      sub: `${monthNames[d.getMonth()]} ${d.getDate()}`,
      value: d.toDateString(),
    });
  }
  return days;
}

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM'];
const UNAVAILABLE_SLOTS = ['10:00 AM', '4:00 PM'];

// ── Shared helpers ─────────────────────────────────────────────────────────

function AvailabilityBadge({ status }: { status: Mentor['availability'] }) {
  if (status === 'available') return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Available</span>
    </div>
  );
  if (status === 'busy') return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
      <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">Busy</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-slate-400 shrink-0" />
      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Fully Booked</span>
    </div>
  );
}

function FeeBadge({ free, price }: { free: boolean; price: number }) {
  if (free) return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
      Free Mentoring
    </span>
  );
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-300">
      ${price}/session
    </span>
  );
}

function SessionTypeIcon({ type }: { type: 'Video' | 'Chat' | 'Phone' }) {
  if (type === 'Video') return <Video size={11} />;
  if (type === 'Chat') return <MessageSquare size={11} />;
  return <Phone size={11} />;
}

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const s = size === 'lg' ? 14 : 11;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={s} className={
          i < full ? 'text-amber-400 fill-amber-400' :
          i === full && half ? 'text-amber-400 fill-amber-200' :
          'text-gray-200 dark:text-slate-700 fill-gray-200 dark:fill-slate-700'
        } />
      ))}
    </div>
  );
}

// ── Dropdown helper ────────────────────────────────────────────────────────

function FilterSelect({
  label, value, options, onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="h-9 pl-3 pr-7 text-[11px] font-semibold bg-white dark:bg-[#161a27] border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-400 outline-none cursor-pointer appearance-none hover:bg-slate-50 dark:hover:bg-white/5 transition-all"
      >
        <option value="All" disabled hidden>{label}</option>
        {options.map(o => <option key={o} value={o}>{o === 'All' ? `${label}: All` : o}</option>)}
      </select>
      <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}

// ── Profile Dialog ─────────────────────────────────────────────────────────

function ProfileDialog({
  counselor, open, onClose,
}: {
  counselor: Mentor | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!counselor) return null;
  const c = counselor;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl w-full p-0 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] gap-0 flex flex-col max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">{c.name} — Mentor Profile</DialogTitle>
        <DialogDescription className="sr-only">Full profile, trade specialties, reviews and booking options for {c.name}.</DialogDescription>

        <div className={`relative shrink-0 bg-gradient-to-br ${c.avatarGradient} px-6 pt-5 pb-5`}>
          <DialogClose className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
            <X size={14} className="text-white" />
          </DialogClose>
          {c.featured && (
            <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-[10px] font-bold text-white mb-3">
              <Zap size={9} fill="white" /> Featured Mentor
            </div>
          )}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-xl shadow-lg border border-white/30 shrink-0">
              {c.avatar}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white leading-tight">{c.name}</h2>
                {c.verified && <BadgeCheck size={16} className="text-white/80 shrink-0" />}
              </div>
              <p className="text-xs text-white/80 truncate">{c.credentials} · {c.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <StarRating rating={c.rating} size="lg" />
                <span className="text-sm font-bold text-white">{c.rating}</span>
                <span className="text-xs text-white/70">({c.reviews} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="bg-slate-50 dark:bg-[#0f1117] rounded-2xl border border-gray-100 dark:border-white/8 shadow-sm grid grid-cols-4 divide-x divide-gray-100 dark:divide-white/8">
            {[
              { value: `${c.studentsHelped}`, label: 'Mentees' },
              { value: `${c.completionRate}%`, label: 'Completion', color: 'text-emerald-600 dark:text-emerald-400' },
              { value: `${c.experience}y`, label: 'Experience' },
              { value: c.free ? 'Free' : `$${c.price}`, label: 'Per Session' },
            ].map(stat => (
              <div key={stat.label} className="text-center py-3 px-2">
                <p className={`text-lg font-bold ${stat.color ?? 'text-slate-900 dark:text-slate-100'}`}>{stat.value}</p>
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">About</p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{c.fullBio}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Trade Specialties</p>
            <div className="flex flex-wrap gap-2">
              {c.trades.map(s => (
                <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Apprenticeship Bodies & Institutes</p>
            <div className="flex flex-wrap gap-2">
              {c.institutes.map(u => (
                <span key={u} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/6 text-slate-700 dark:text-slate-400">{u}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Mentoring Programme</p>
            <div className="flex flex-col gap-1.5">
              {c.programHighlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Sparkles size={13} className="text-violet-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Recent Mentee Wins</p>
            <div className="flex flex-col gap-1.5">
              {c.successHighlights.map((h, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{h}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={12} className="text-slate-400" /> {c.provinces.join(', ')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Globe size={12} className="text-slate-400" /> {c.languages.join(', ')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {c.formats.includes('Virtual') && <Video size={12} className="text-slate-400" />}
              {c.formats.includes('In-person') && <Users size={12} className="text-slate-400" />}
              <span className="ml-0.5">{c.formats.join(' · ')}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Mentee Reviews</p>
            <div className="space-y-3">
              {c.reviewsList.map((r, i) => (
                <div key={i} className="bg-slate-50 dark:bg-white/4 rounded-xl p-3.5 border border-gray-100 dark:border-white/6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">{r.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.name}</p>
                        <StarRating rating={r.rating} />
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Pathway → {r.program}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">&ldquo;{r.text}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/6 flex items-center justify-between gap-3 bg-white dark:bg-[#161a27]">
          <div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{c.free ? 'Mentoring' : 'Starting from'}</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {c.free ? 'Free' : <>${c.price}<span className="text-xs font-medium text-slate-400">/session</span></>}
            </p>
            <AvailabilityBadge status={c.availability} />
          </div>
          {c.availability === 'booked' ? (
            <Button disabled className="h-10 px-5 rounded-xl text-sm font-bold gap-2 bg-slate-100 dark:bg-white/6 text-slate-400 cursor-not-allowed">
              <Calendar size={14} /> Fully Booked
            </Button>
          ) : (
            <Link href={`/vocational-technical-student-route/counselors/book?id=${c.id}`}
              onClick={onClose}
              className="flex items-center gap-2 h-10 px-5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all">
              <Calendar size={14} /> Book a Session
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Booking Dialog ─────────────────────────────────────────────────────────

type SessionType = 'Video' | 'Chat' | 'Phone' | '';

function BookingDialog({
  counselor, open, onClose,
}: {
  counselor: Mentor | null;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState(1);
  const [sessionType, setSessionType] = useState<SessionType>('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [topic, setTopic] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const days = getNextDays(7);

  const reset = () => {
    setStep(1); setSessionType(''); setSelectedDay('');
    setSelectedTime(''); setTopic(''); setConfirmed(false);
  };

  const handleClose = () => { onClose(); setTimeout(reset, 300); };

  const canAdvance =
    (step === 1 && sessionType !== '') ||
    (step === 2 && selectedDay !== '' && selectedTime !== '') ||
    step === 3;

  if (!counselor) return null;
  const c = counselor;
  const feeLabel = c.free ? 'Free' : `$${c.price}`;

  const sessionIcons: Record<string, React.ReactNode> = {
    Video: <Video size={16} />,
    Chat: <MessageSquare size={16} />,
    Phone: <Phone size={16} />,
  };

  return (
    <Dialog open={open} onOpenChange={v => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-lg w-full p-0 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] gap-0 flex flex-col max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">Book a session with {c.name}</DialogTitle>
        <DialogDescription className="sr-only">Select your session type, date, time and topic to book a session with {c.name}.</DialogDescription>

        <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/6">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${c.avatarGradient} flex items-center justify-center text-white font-bold text-xs`}>{c.avatar}</div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{c.name}</p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">{feeLabel} / session</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!confirmed && (
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map(s => (
                  <div key={s} className={`rounded-full transition-all ${
                    s <= step ? 'w-5 h-2 bg-blue-600' : 'w-2 h-2 bg-slate-200 dark:bg-white/15'
                  }`} />
                ))}
              </div>
            )}
            <DialogClose onClick={handleClose} className="w-8 h-8 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/6 transition-all text-slate-400">
              <X size={14} />
            </DialogClose>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {confirmed ? (
            <div className="flex flex-col items-center justify-center gap-4 py-12 px-8 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                <Check size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Session Booked!</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Your {sessionType} session with <strong className="text-slate-700 dark:text-slate-300">{c.name}</strong> is confirmed.
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 w-full text-left space-y-2 border border-gray-100 dark:border-white/8">
                {[
                  { label: 'Date', value: days.find(d => d.value === selectedDay)?.label + ', ' + days.find(d => d.value === selectedDay)?.sub },
                  { label: 'Time', value: selectedTime },
                  { label: 'Session Type', value: sessionType },
                  { label: 'Fee', value: feeLabel },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 dark:text-slate-500">{row.label}</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{row.value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">A confirmation has been sent to your email.</p>
              <Button onClick={handleClose} className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm">Done</Button>
            </div>
          ) : (
            <>
              {step === 1 && (
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Choose session type</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">How would you like to meet with {c.name.split(' ')[0]}?</p>
                  </div>
                  <div className="space-y-2.5">
                    {c.sessionTypes.map(type => (
                      <button
                        key={type}
                        onClick={() => setSessionType(type)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                          sessionType === type
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15'
                            : 'border-gray-100 dark:border-white/8 bg-slate-50 dark:bg-white/3 hover:border-blue-200 dark:hover:border-blue-500/30'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          sessionType === type ? 'bg-blue-100 dark:bg-blue-500/30 text-blue-600 dark:text-blue-400' : 'bg-white dark:bg-white/6 text-slate-400'
                        }`}>
                          {sessionIcons[type]}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${sessionType === type ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'}`}>{type} Session</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {type === 'Video' ? 'Face-to-face via video call' : type === 'Chat' ? 'Text-based messaging session' : 'Phone call session'}
                          </p>
                        </div>
                        {sessionType === type && (
                          <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                            <Check size={11} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Pick a date & time</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All times shown in your local timezone.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Date</p>
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      {days.map(d => (
                        <button
                          key={d.value}
                          onClick={() => { setSelectedDay(d.value); setSelectedTime(''); }}
                          className={`shrink-0 flex flex-col items-center px-3.5 py-2.5 rounded-xl border-2 transition-all min-w-[64px] ${
                            selectedDay === d.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15'
                              : 'border-gray-100 dark:border-white/8 bg-slate-50 dark:bg-white/3 hover:border-blue-200 dark:hover:border-blue-500/30'
                          }`}
                        >
                          <span className={`text-[11px] font-bold ${selectedDay === d.value ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>{d.label}</span>
                          <span className={`text-[10px] mt-0.5 ${selectedDay === d.value ? 'text-cyan-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`}>{d.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {selectedDay && (
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Available Times</p>
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map(t => {
                          const unavail = UNAVAILABLE_SLOTS.includes(t);
                          return (
                            <button
                              key={t}
                              disabled={unavail}
                              onClick={() => setSelectedTime(t)}
                              className={`py-2 px-1 rounded-xl text-[11px] font-bold border-2 transition-all ${
                                unavail ? 'border-transparent bg-slate-100 dark:bg-white/3 text-slate-300 dark:text-slate-600 cursor-not-allowed line-through' :
                                selectedTime === t ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400' :
                                'border-gray-100 dark:border-white/8 bg-white dark:bg-white/3 text-slate-600 dark:text-slate-400 hover:border-blue-200 dark:hover:border-blue-500/30'
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 rounded bg-slate-200 dark:bg-white/10" /> Greyed-out slots are unavailable
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div className="p-5 space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tell us what you need help with</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">This helps {c.name.split(' ')[0]} prepare for your session.</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-500/10 rounded-xl p-3 border border-blue-100 dark:border-blue-500/20 space-y-1.5">
                    {[
                      { icon: <Calendar size={11} />, text: `${days.find(d => d.value === selectedDay)?.label}, ${days.find(d => d.value === selectedDay)?.sub}` },
                      { icon: <Clock size={11} />, text: selectedTime },
                      { icon: sessionIcons[sessionType], text: `${sessionType} Session` },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] font-semibold text-blue-700 dark:text-blue-400">
                        <span className="opacity-70">{row.icon}</span>{row.text}
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">
                      What would you like to focus on? <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder={`e.g. "I need help finding an employer sponsor for my electrical apprenticeship."`}
                      rows={4}
                      className="w-full text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 outline-none resize-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-500/40 transition-all dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{topic.length}/500 characters</p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Session total</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{feeLabel}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {!confirmed && (
          <div className="shrink-0 px-5 py-4 border-t border-gray-100 dark:border-white/6 flex items-center gap-3 bg-white dark:bg-[#161a27]">
            {step > 1 && (
              <button
                onClick={() => setStep(s => s - 1)}
                className="h-10 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/6 transition-all flex items-center gap-1.5"
              >
                <ChevronLeft size={14} /> Back
              </button>
            )}
            <Button
              disabled={!canAdvance || (step === 3 && topic.trim().length === 0)}
              onClick={() => { if (step < 3) setStep(s => s + 1); else setConfirmed(true); }}
              className="flex-1 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {step === 3 ? (
                <><Check size={14} /> Confirm Booking — {feeLabel}</>
              ) : (
                <>Continue <ChevronRight size={14} /></>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ── Mentor Row Card (horizontal 3-panel layout) ────────────────────────────

function MentorCard({
  c, saved, onSave, onViewProfile,
}: {
  c: Mentor;
  saved: boolean;
  onSave: (id: number) => void;
  onViewProfile: (c: Mentor) => void;
}) {
  return (
    <div className={`bg-white dark:bg-[#161a27] rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
      c.featured ? 'border-blue-100 dark:border-blue-500/20' : 'border-gray-100 dark:border-white/6'
    }`}>
      <div className="flex flex-col md:flex-row">

        {/* ── Panel 1: Profile info ── */}
        <div className="flex-1 p-4 sm:p-5 flex items-start gap-3.5 min-w-0">
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br ${c.avatarGradient} flex items-center justify-center text-white font-bold text-base shrink-0 shadow-md`}>
            {c.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-0.5">
              <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{c.name}</h3>
                {c.verified && <BadgeCheck size={13} className="text-cyan-500 shrink-0" />}
                {c.featured && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 whitespace-nowrap">
                    Featured
                  </span>
                )}
              </div>
              <button
                onClick={() => onSave(c.id)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 dark:border-white/8 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400"
              >
                {saved ? <BookmarkCheck size={13} className="text-blue-600 dark:text-blue-400" /> : <Bookmark size={13} />}
              </button>
            </div>
            <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 truncate">{c.title}</p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate flex items-center gap-1">
              <MapPin size={10} className="shrink-0" /> {c.provinces.join(', ')} · {c.experience}+ yrs
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {c.trades.slice(0, 3).map(s => (
                <span key={s} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/6 text-slate-600 dark:text-slate-400">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-100 dark:bg-white/6 self-stretch my-0" />
        <div className="md:hidden h-px bg-gray-100 dark:bg-white/6 mx-4" />

        {/* ── Panel 2: Stats ── */}
        <div className="md:w-48 px-4 md:px-5 py-3 md:py-5 flex flex-row md:flex-col justify-start md:justify-center gap-3 md:gap-2.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <StarRating rating={c.rating} />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{c.rating}</span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">({c.reviews} reviews)</span>
          </div>
          <div className="flex flex-row md:flex-col gap-3 md:gap-1.5 flex-1">
            <div className="flex items-center gap-2 md:justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">Mentees</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-auto md:ml-0">{c.studentsHelped}+</span>
            </div>
            <div className="flex items-center gap-2 md:justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">Completion</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto md:ml-0">{c.completionRate}%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-100 dark:bg-white/6 self-stretch my-0" />
        <div className="md:hidden h-px bg-gray-100 dark:bg-white/6 mx-4" />

        {/* ── Panel 3: Availability + CTA ── */}
        <div className="md:w-52 px-4 md:px-5 py-3 md:py-5 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center gap-3 md:gap-3">
          <div className="min-w-0">
            <AvailabilityBadge status={c.availability} />
            <div className="mt-1.5">
              <FeeBadge free={c.free} price={c.price} />
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1.5">
              <Clock size={10} className="shrink-0" />
              <span className="truncate">Next: {c.nextSlot}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0 md:shrink w-auto md:w-full">
            <button
              onClick={() => onViewProfile(c)}
              className="h-8 px-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/6 transition-all whitespace-nowrap"
            >
              View Profile
            </button>
            {c.availability === 'booked' ? (
              <Button disabled className="h-8 px-3.5 rounded-xl text-[11px] font-bold whitespace-nowrap bg-slate-100 dark:bg-white/6 text-slate-400 cursor-not-allowed">
                Fully Booked
              </Button>
            ) : (
              <Link href={`/vocational-technical-student-route/counselors/book?id=${c.id}`}
                className="flex items-center justify-center h-8 px-3.5 rounded-xl text-[11px] font-bold whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all">
                Book Now
              </Link>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Mentoring Programme banner ─────────────────────────────────────────────

function MentoringBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 p-5 sm:p-6">
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
      <div className="absolute -bottom-10 right-20 w-24 h-24 rounded-full bg-white/5" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
          <HardHat size={24} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-white">Trades Mentoring Programme</h2>
          <p className="text-[12px] sm:text-sm text-white/85 mt-1 leading-relaxed max-w-2xl">
            Get matched with Red Seal journeypersons, apprenticeship advisors and college admissions
            experts across every Canadian province. Structured plans cover sponsorship, hour logging,
            Certificate of Qualification prep and college intake — many mentors offer free guidance.
          </p>
        </div>
        <div className="flex sm:flex-col gap-2 shrink-0">
          {[
            { icon: <Wrench size={12} />, label: 'Red Seal mentors' },
            { icon: <Building2 size={12} />, label: 'Provincial bodies' },
          ].map(item => (
            <span key={item.label} className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white whitespace-nowrap">
              {item.icon} {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Right Sidebar ──────────────────────────────────────────────────────────

function DirectorySidebar() {
  return (
    <div className="flex flex-col gap-4">

      {/* Why work with a mentor? */}
      <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Why work with a trades mentor?</h3>
        <ul className="space-y-2">
          {[
            'Find an employer sponsor faster',
            'Stay on track logging apprenticeship hours',
            'Prepare for your Certificate of Qualification',
            'Navigate provincial & Red Seal pathways',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-cyan-500 mt-0.5 shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400">{item}</span>
            </li>
          ))}
        </ul>
        <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
          Learn more about mentoring <ArrowRight size={11} />
        </button>
      </div>

      {/* Quick Match */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 p-5">
        <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Shuffle size={14} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Quick Match</p>
            </div>
          </div>
          <p className="text-[11px] text-purple-200 mb-3 leading-relaxed">
            Let us match you with the best mentor based on your trade, province and goals.
          </p>
          <button className="w-full py-2 rounded-xl bg-white text-[12px] font-bold text-purple-700 hover:bg-purple-50 transition-all">
            Find My Mentor
          </button>
        </div>
      </div>

      {/* Top Trades */}
      <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Top Trade Specialties</h3>
        <div className="space-y-2">
          {TOP_TRADES.map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{item.count} mentors</span>
            </div>
          ))}
        </div>
        <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
          Browse all specialties <ArrowRight size={11} />
        </button>
      </div>

      {/* Need Help? */}
      <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/6 flex items-center justify-center shrink-0">
            <HelpCircle size={14} className="text-slate-500 dark:text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-100">Need Help?</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              Our support team is here to help you find the right mentor.
            </p>
          </div>
        </div>
        <button className="w-full py-2 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
          Contact Support
        </button>
      </div>

    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function MentorDirectoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Top Rated');
  const [provinceFilter, setProvinceFilter] = useState('All');
  const [tradeFilter, setTradeFilter] = useState('All');
  const [formatFilter, setFormatFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeMentor, setActiveMentor] = useState<Mentor | null>(null);

  const toggleSave = (id: number) =>
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const openProfile = (c: Mentor) => { setActiveMentor(c); setProfileOpen(true); };

  const hasActiveFilters = provinceFilter !== 'All' || tradeFilter !== 'All' || formatFilter !== 'All' || languageFilter !== 'All';

  const clearFilters = () => {
    setProvinceFilter('All');
    setTradeFilter('All');
    setFormatFilter('All');
    setLanguageFilter('All');
    setSearch('');
    setCategory('All');
  };

  const filtered = useMemo(() => {
    let list = [...MENTORS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.trades.some(s => s.toLowerCase().includes(q)) ||
        c.institutes.some(u => u.toLowerCase().includes(q)) ||
        c.provinces.some(p => p.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') list = list.filter(c => c.category === category);
    if (provinceFilter !== 'All') list = list.filter(c => c.provinces.includes(provinceFilter));
    if (tradeFilter !== 'All') list = list.filter(c => c.trades.some(t => t.toLowerCase().includes(tradeFilter.toLowerCase())));
    if (formatFilter !== 'All') list = list.filter(c => c.formats.includes(formatFilter as 'Virtual' | 'In-person'));
    if (languageFilter !== 'All') list = list.filter(c => c.languages.includes(languageFilter));
    if (sort === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Fee: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sort === 'Fee: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sort === 'Most Mentees') list.sort((a, b) => b.studentsHelped - a.studentsHelped);
    return [...list.filter(c => c.featured), ...list.filter(c => !c.featured)];
  }, [search, category, sort, provinceFilter, tradeFilter, formatFilter, languageFilter]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Mentor & Counsellor Directory
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Connect with Red Seal journeypersons, apprenticeship advisors and college admissions experts across Canada.
            </p>
          </div>
        </div>

        {/* ── Mentoring Programme banner ── */}
        <MentoringBanner />

        {/* ── My booked sessions calendar ── */}
        <BookedSessionsCalendar />

        {/* ── Main 2-column layout ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 sm:gap-6 items-start">

          {/* ── Left: Main content ── */}
          <div className="min-w-0 space-y-4">

            {/* Search + Filters */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 space-y-3">

              {/* Row 1: Search + Filters button */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search by name, trade, province or institute…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 h-10 text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-500/50 transition-all dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(v => !v)}
                  className={`shrink-0 flex items-center gap-1.5 h-10 px-3.5 rounded-xl border text-[12px] font-semibold transition-all ${
                    showFilters || hasActiveFilters
                      ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400'
                      : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/8'
                  }`}
                >
                  <Filter size={13} />
                  <span>Filters</span>
                  {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                </button>
              </div>

              {/* Row 2: Filter dropdowns */}
              <div className={`flex flex-wrap items-center gap-2 ${showFilters ? '' : 'hidden sm:flex'}`}>
                <FilterSelect label="Province" value={provinceFilter} options={PROVINCES} onChange={setProvinceFilter} />
                <FilterSelect label="Trade" value={tradeFilter} options={TRADE_OPTIONS} onChange={setTradeFilter} />
                <FilterSelect label="Language" value={languageFilter} options={LANGUAGE_OPTIONS} onChange={setLanguageFilter} />
                <FilterSelect label="Format" value={formatFilter} options={FORMAT_OPTIONS} onChange={setFormatFilter} />
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 h-9 px-3 text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <X size={11} /> Clear All
                  </button>
                )}
              </div>

              {/* Row 3: Category tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-[11px] sm:text-[12px] font-bold transition-all ${
                      category === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
                <div className="shrink-0 w-px h-4 bg-slate-200 dark:bg-white/8 mx-1" />
                <div className="relative shrink-0">
                  <select
                    value={sort}
                    onChange={e => setSort(e.target.value)}
                    className="h-8 pl-2.5 pr-7 text-[11px] font-semibold bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-500 dark:text-slate-400 outline-none cursor-pointer appearance-none hover:bg-slate-50 dark:hover:bg-white/8 transition-all"
                  >
                    {SORT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <span className="shrink-0 text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap ml-auto">
                  {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* ── Mentor list ── */}
            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-12 flex flex-col items-center gap-3">
                <GraduationCap size={40} className="text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No mentors match your filters</p>
                <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(c => (
                  <MentorCard
                    key={c.id}
                    c={c}
                    saved={saved.includes(c.id)}
                    onSave={toggleSave}
                    onViewProfile={openProfile}
                  />
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {[
                { icon: <BadgeCheck size={16} className="text-cyan-500" />, label: 'Verified Mentors', desc: 'All mentors are credential-verified Red Seal & advisor professionals.' },
                { icon: <Award size={16} className="text-amber-500" />, label: 'Satisfaction Guaranteed', desc: 'Not happy with a session? We offer a free replacement booking.' },
                { icon: <Users size={16} className="text-emerald-500" />, label: '1,200+ Apprentices Helped', desc: 'Join a growing community of Canadian skilled-trades apprentices.' },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2.5 max-w-[220px]">
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{item.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>{/* end left column */}

          {/* ── Right sidebar — desktop only ── */}
          <div className="hidden xl:block sticky top-24">
            <DirectorySidebar />
          </div>

        </div>{/* end 2-col */}

        {/* ── Mobile sidebar (shown below list) ── */}
        <div className="xl:hidden">
          <DirectorySidebar />
        </div>

      </div>

      <ProfileDialog
        counselor={activeMentor}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />
      <BookingDialog
        counselor={activeMentor}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
