'use client';

import { useState, useMemo } from 'react';
import {
  Star, MapPin, Globe, Video, MessageSquare, Phone, Bookmark,
  BookmarkCheck, ChevronDown, Award, GraduationCap, Zap,
  Calendar, ArrowRight, BadgeCheck, CheckCircle2, X,
  Clock, ChevronLeft, ChevronRight, Check, Users,
  Search, Filter, Shuffle, HeadphonesIcon, HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';

// ── Types ──────────────────────────────────────────────────────────────────

interface Counselor {
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
  languages: string[];
  availability: 'available' | 'busy' | 'booked';
  nextSlot: string;
  price: number;
  sessionTypes: ('Video' | 'Chat' | 'Phone')[];
  featured: boolean;
  verified: boolean;
  bio: string;
  fullBio: string;
  specialties: string[];
  universities: string[];
  studentsHelped: number;
  acceptanceRate: number;
  successHighlights: string[];
  category: string;
  language: string;
  reviewsList: { name: string; avatar: string; rating: number; text: string; program: string }[];
}

// ── Sample Data ────────────────────────────────────────────────────────────

const COUNSELORS: Counselor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    credentials: 'Ph.D., M.Ed',
    title: 'University Admissions Specialist',
    avatar: 'SC',
    avatarGradient: 'from-blue-500 to-indigo-600',
    rating: 4.9,
    reviews: 127,
    experience: 12,
    location: 'Toronto, ON',
    languages: ['English', 'Mandarin'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Today, 3:00 PM',
    price: 120,
    sessionTypes: ['Video', 'Chat'],
    featured: true,
    verified: true,
    bio: 'Former UofT admissions officer with 12 years of experience guiding students into top Canadian engineering and science programs.',
    fullBio: 'Former UofT admissions officer with 12 years of experience guiding students into top Canadian engineering and science programs. Expertise in AIF writing, personal statements, and interview preparation.',
    specialties: ['STEM', 'Engineering', 'AIF Coaching', 'Essay Writing'],
    universities: ['UofT', 'Waterloo', 'McMaster', 'Queens'],
    studentsHelped: 340,
    acceptanceRate: 94,
    successHighlights: ['UofT Engineering Science', 'Waterloo CS', 'McMaster iBSc'],
    category: 'STEM',
    reviewsList: [
      { name: 'Riya S.', avatar: 'RS', rating: 5, text: 'Dr. Chen completely transformed my AIF. I got into UofT Engineering Science.', program: 'UofT Engineering Science' },
      { name: 'Jason L.', avatar: 'JL', rating: 5, text: 'Her feedback was incredibly detailed and actionable. Accepted to Waterloo CS after two sessions!', program: 'Waterloo CS' },
      { name: 'Ananya P.', avatar: 'AP', rating: 5, text: 'Best investment I made for my applications. Knowledgeable, patient, and results-driven.', program: 'McMaster iBSc' },
    ],
  },
  {
    id: 2,
    name: 'Marcus Williams',
    credentials: 'M.Sc., B.Ed',
    title: 'Health Sciences & Medical Coach',
    avatar: 'MW',
    avatarGradient: 'from-emerald-500 to-teal-600',
    rating: 4.8,
    reviews: 89,
    experience: 8,
    location: 'Vancouver, BC',
    languages: ['English', 'French'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Tomorrow, 10:00 AM',
    price: 95,
    sessionTypes: ['Video', 'Phone'],
    featured: true,
    verified: true,
    bio: 'Specialised in health science and medical pathways. Deep knowledge of UBC and McMaster requirements, MMI preparation, and CASPer coaching.',
    fullBio: 'Specialised in health science and medical pathways with deep knowledge of UBC and McMaster requirements, MMI preparation, and CASPer coaching. Marcus has helped 215+ students gain entry to competitive health programs across Canada.',
    specialties: ['Medical', 'Health Sciences', 'MMI Prep', 'CASPer Coaching'],
    universities: ['UBC', 'McMaster', 'Queens', 'Western'],
    studentsHelped: 215,
    acceptanceRate: 91,
    successHighlights: ["Queen's Health Sci", 'McMaster BHSc', 'UBC Science'],
    category: 'Medical',
    reviewsList: [
      { name: 'Preethi M.', avatar: 'PM', rating: 5, text: 'Marcus helped me nail my MMI prep for McMaster BHSc.', program: 'McMaster BHSc' },
      { name: 'Sanjay R.', avatar: 'SR', rating: 5, text: 'Incredibly thorough CASPer preparation.', program: "Queen's Health Sci" },
      { name: 'Lena K.', avatar: 'LK', rating: 4, text: 'Very knowledgeable about UBC requirements.', program: 'UBC Science' },
    ],
  },
  {
    id: 3,
    name: 'Aisha Patel',
    credentials: 'MBA, B.Comm',
    title: 'Business & Commerce Admissions Expert',
    avatar: 'AP',
    avatarGradient: 'from-violet-500 to-purple-600',
    rating: 4.9,
    reviews: 103,
    experience: 10,
    location: 'Mississauga, ON',
    languages: ['English', 'Hindi', 'Gujarati'],
    language: 'English',
    availability: 'busy',
    nextSlot: 'Wed, Dec 4, 2:00 PM',
    price: 110,
    sessionTypes: ['Video', 'Chat', 'Phone'],
    featured: true,
    verified: true,
    bio: 'Former Ivey School of Business recruiter. Expert in Rotman Commerce, Schulich, and Ivey HBA applications.',
    fullBio: 'Former Ivey School of Business recruiter with 10 years of experience in business and commerce admissions. Expert in Rotman Commerce, Schulich, and Ivey HBA applications.',
    specialties: ['Business', 'Commerce', 'Scholarship Essays', 'Interview Prep'],
    universities: ['UofT Rotman', 'Ivey HBA', 'Schulich', 'Queens Commerce'],
    studentsHelped: 278,
    acceptanceRate: 92,
    successHighlights: ['Ivey HBA', 'Rotman Commerce', 'Schulich BBA'],
    category: 'Business',
    reviewsList: [
      { name: 'Dev C.', avatar: 'DC', rating: 5, text: 'Aisha helped me get into Ivey HBA. Her resume and essay coaching was next level.', program: 'Ivey HBA' },
      { name: 'Sophia T.', avatar: 'ST', rating: 5, text: 'She knew exactly what Rotman was looking for.', program: 'Rotman Commerce' },
      { name: 'Michael B.', avatar: 'MB', rating: 5, text: 'Very professional and responsive.', program: 'Schulich BBA' },
    ],
  },
  {
    id: 4,
    name: 'Étienne Tremblay',
    credentials: 'M.A., B.A. (Hons)',
    title: 'Arts, Humanities & Law Pathway Advisor',
    avatar: 'ÉT',
    avatarGradient: 'from-rose-500 to-pink-600',
    rating: 4.7,
    reviews: 64,
    experience: 7,
    location: 'Montréal, QC',
    languages: ['English', 'French'],
    language: 'French',
    availability: 'available',
    nextSlot: 'Today, 6:00 PM',
    price: 80,
    sessionTypes: ['Video', 'Chat'],
    featured: false,
    verified: true,
    bio: 'Bilingual advisor specialising in arts, social sciences, and pre-law tracks. Expert in McGill and Université de Montréal admissions.',
    fullBio: 'Bilingual advisor specialising in arts, social sciences, and pre-law tracks. Expert in McGill and Université de Montréal admissions.',
    specialties: ['Arts', 'Law', 'Social Sciences', 'Personal Statements'],
    universities: ['McGill', 'UdeM', 'Laval', 'Ottawa'],
    studentsHelped: 142,
    acceptanceRate: 88,
    successHighlights: ['McGill Arts', 'Ottawa Law', "Dalhousie's JD"],
    category: 'Arts',
    reviewsList: [
      { name: 'Claire F.', avatar: 'CF', rating: 5, text: 'Étienne helped me write the best personal statement of my life.', program: 'McGill Arts' },
      { name: 'Thomas B.', avatar: 'TB', rating: 4, text: 'Very helpful for understanding the Québec university system.', program: 'Ottawa Law' },
      { name: 'Amara O.', avatar: 'AO', rating: 5, text: 'Patient, thoughtful, and really listened to my story.', program: "Dalhousie JD" },
    ],
  },
  {
    id: 5,
    name: 'Dr. Priya Nair',
    credentials: 'Ph.D. (Computer Science)',
    title: 'CS, AI & Data Science Admissions Mentor',
    avatar: 'PN',
    avatarGradient: 'from-cyan-500 to-blue-600',
    rating: 4.8,
    reviews: 76,
    experience: 9,
    location: 'Waterloo, ON',
    languages: ['English', 'Malayalam', 'Hindi'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Today, 7:30 PM',
    price: 130,
    sessionTypes: ['Video', 'Chat'],
    featured: false,
    verified: true,
    bio: 'PhD-trained computer scientist with industry experience at Google Canada. Provides deep technical guidance for CS, AI, and data science applicants.',
    fullBio: 'PhD-trained computer scientist with industry experience at Google Canada. Provides deep technical guidance for CS, AI, and data science applicants, including coding portfolios and co-op program strategy.',
    specialties: ['Computer Science', 'AI & ML', 'Co-op Strategy', 'Portfolio Review'],
    universities: ['Waterloo', 'UofT', 'UBC', 'Concordia'],
    studentsHelped: 189,
    acceptanceRate: 90,
    successHighlights: ['Waterloo CS', 'UofT CS', 'UBC Data Science'],
    category: 'STEM',
    reviewsList: [
      { name: 'Arjun S.', avatar: 'AS', rating: 5, text: 'Dr. Nair helped me refine my portfolio for Waterloo CS.', program: 'Waterloo CS' },
      { name: 'Mei L.', avatar: 'ML', rating: 5, text: 'Amazing co-op strategy advice. Got into Waterloo CS co-op!', program: 'Waterloo CS Co-op' },
      { name: 'Ben T.', avatar: 'BT', rating: 4, text: 'Very knowledgeable about UofT CS requirements.', program: 'UofT CS' },
    ],
  },
  {
    id: 6,
    name: 'James Okoye',
    credentials: 'M.Ed, B.Sc',
    title: 'OUAC & Application Strategy Specialist',
    avatar: 'JO',
    avatarGradient: 'from-amber-500 to-orange-600',
    rating: 4.6,
    reviews: 51,
    experience: 6,
    location: 'Calgary, AB',
    languages: ['English'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Tomorrow, 1:00 PM',
    price: 75,
    sessionTypes: ['Video', 'Phone', 'Chat'],
    featured: false,
    verified: true,
    bio: 'Specialises in holistic OUAC strategy — program selection, deadline management, and transcript optimisation.',
    fullBio: 'Specialises in holistic OUAC strategy — program selection, deadline management, and transcript optimisation.',
    specialties: ['OUAC Strategy', 'Program Selection', 'Deadline Planning', 'Grade Analysis'],
    universities: ['UCalgary', 'UAlberta', 'SFU', 'Queens'],
    studentsHelped: 123,
    acceptanceRate: 87,
    successHighlights: ['UAlberta Engineering', 'UCalgary Medicine', 'SFU Business'],
    category: 'General',
    reviewsList: [
      { name: 'Katie M.', avatar: 'KM', rating: 5, text: 'James helped me build the perfect school list.', program: 'UAlberta Engineering' },
      { name: 'Omar F.', avatar: 'OF', rating: 4, text: 'Very practical and no-nonsense advice.', program: 'SFU Business' },
      { name: 'Grace L.', avatar: 'GL', rating: 5, text: 'Helped me figure out which programs I actually had a shot at.', program: 'UCalgary Science' },
    ],
  },
  {
    id: 7,
    name: 'Natalie Rousseau',
    credentials: 'M.Ed (Counselling)',
    title: 'Scholarship & Financial Aid Advisor',
    avatar: 'NR',
    avatarGradient: 'from-lime-500 to-green-600',
    rating: 4.7,
    reviews: 58,
    experience: 8,
    location: 'Ottawa, ON',
    languages: ['English', 'French'],
    language: 'French',
    availability: 'booked',
    nextSlot: 'Fri, Dec 6, 9:00 AM',
    price: 85,
    sessionTypes: ['Video', 'Chat'],
    featured: false,
    verified: true,
    bio: 'Expert in scholarship hunting, financial aid applications, and bursary strategies. Has helped students secure over $2.4M in funding.',
    fullBio: 'Expert in scholarship hunting, financial aid applications, and bursary strategies. Has helped students secure over $2.4M in scholarship funding.',
    specialties: ['Scholarships', 'Financial Aid', 'Entrance Awards', 'Bursaries'],
    universities: ['All Canadian Universities'],
    studentsHelped: 165,
    acceptanceRate: 89,
    successHighlights: ['$32K Loran Award', 'UofT Nationals', "Queen's Chancellor's Award"],
    category: 'Scholarships',
    reviewsList: [
      { name: 'Isabella R.', avatar: 'IR', rating: 5, text: 'Natalie helped me win the Loran Scholarship.', program: 'Loran Scholar' },
      { name: 'Finn O.', avatar: 'FO', rating: 5, text: 'She found scholarships I never even knew existed.', program: "Queen's Chancellor's Award" },
      { name: 'Zara M.', avatar: 'ZM', rating: 4, text: 'Very organised and thorough.', program: 'UofT Nationals' },
    ],
  },
  {
    id: 8,
    name: 'Kevin Park',
    credentials: 'B.Sc (Kinesiology)',
    title: 'Athletic & Kinesiology Program Advisor',
    avatar: 'KP',
    avatarGradient: 'from-red-500 to-rose-600',
    rating: 4.5,
    reviews: 38,
    experience: 5,
    location: 'Hamilton, ON',
    languages: ['English', 'Korean'],
    language: 'English',
    availability: 'available',
    nextSlot: 'Today, 5:00 PM',
    price: 65,
    sessionTypes: ['Video', 'Phone'],
    featured: false,
    verified: false,
    bio: 'Former varsity athlete helping student-athletes navigate athletic recruitment, Kin program applications, and balancing academic and sport commitments.',
    fullBio: 'Former varsity athlete and current Kinesiology graduate helping student-athletes navigate athletic recruitment, Kin program applications, and balancing academic and sport commitments.',
    specialties: ['Kinesiology', 'Athletic Recruitment', 'Sports Medicine Track', 'Student Athletes'],
    universities: ['McMaster', 'Western', 'Queens', 'Brock'],
    studentsHelped: 78,
    acceptanceRate: 85,
    successHighlights: ['McMaster Kin', 'Western Kin', 'Queens PE'],
    category: 'General',
    reviewsList: [
      { name: 'Tyler N.', avatar: 'TN', rating: 5, text: "Kevin totally gets what it's like to be a student athlete.", program: 'McMaster Kinesiology' },
      { name: 'Sara J.', avatar: 'SJ', rating: 4, text: 'Great advice on athletic recruiting.', program: 'Western Kinesiology' },
      { name: 'Chris B.', avatar: 'CB', rating: 5, text: 'Really relatable and practical.', program: "Queen's Physical Education" },
    ],
  },
];

const CATEGORIES = ['All', 'STEM', 'Medical', 'Business', 'Arts', 'Scholarships', 'General'];
const EXPERTISE_OPTIONS = ['All', 'Engineering', 'Computer Science', 'Health Sciences', 'Business', 'AIF & Essays', 'Law', 'Scholarships'];
const UNIVERSITY_OPTIONS = ['All', 'UofT', 'Waterloo', 'UBC', 'McMaster', 'Queens', 'Western', 'McGill', 'Ivey'];
const LANGUAGE_OPTIONS = ['All', 'English', 'French', 'Mandarin', 'Hindi'];
const SORT_OPTIONS = ['Top Rated', 'Price: Low to High', 'Price: High to Low', 'Most Students Helped'];

const TOP_EXPERTISE = [
  { label: 'Engineering', count: 24 },
  { label: 'Computer Science', count: 18 },
  { label: 'Health Science', count: 16 },
  { label: 'Business', count: 14 },
  { label: 'AIF & Essays', count: 20 },
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

function AvailabilityBadge({ status, nextSlot }: { status: Counselor['availability']; nextSlot: string }) {
  if (status === 'available') return (
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Availability</span>
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
  counselor, open, onClose, onBook,
}: {
  counselor: Counselor | null;
  open: boolean;
  onClose: () => void;
  onBook: () => void;
}) {
  if (!counselor) return null;
  const c = counselor;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-2xl w-full p-0 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] gap-0 flex flex-col max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">{c.name} — Counsellor Profile</DialogTitle>
        <DialogDescription className="sr-only">Full profile, specialties, reviews and booking options for {c.name}.</DialogDescription>

        <div className={`relative shrink-0 bg-gradient-to-br ${c.avatarGradient} px-6 pt-5 pb-5`}>
          <DialogClose className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
            <X size={14} className="text-white" />
          </DialogClose>
          {c.featured && (
            <div className="inline-flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-[10px] font-bold text-white mb-3">
              <Zap size={9} fill="white" /> Featured Counsellor
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
              { value: `${c.studentsHelped}`, label: 'Students' },
              { value: `${c.acceptanceRate}%`, label: 'Success Rate', color: 'text-emerald-600 dark:text-emerald-400' },
              { value: `${c.experience}y`, label: 'Experience' },
              { value: `$${c.price}`, label: 'Per Session' },
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
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Areas of Expertise</p>
            <div className="flex flex-wrap gap-2">
              {c.specialties.map(s => (
                <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">{s}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">University Expertise</p>
            <div className="flex flex-wrap gap-2">
              {c.universities.map(u => (
                <span key={u} className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/6 text-slate-700 dark:text-slate-400">{u}</span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Recent Student Wins</p>
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
              <MapPin size={12} className="text-slate-400" /> {c.location}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Globe size={12} className="text-slate-400" /> {c.languages.join(', ')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              {c.sessionTypes.map(t => <SessionTypeIcon key={t} type={t} />)}
              <span className="ml-0.5">{c.sessionTypes.join(' · ')}</span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Student Reviews</p>
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
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Accepted → {r.program}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">"{r.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 dark:border-white/6 flex items-center justify-between gap-3 bg-white dark:bg-[#161a27]">
          <div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Starting from</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">${c.price}<span className="text-xs font-medium text-slate-400">/session</span></p>
            <AvailabilityBadge status={c.availability} nextSlot={c.nextSlot} />
          </div>
          <Button
            disabled={c.availability === 'booked'}
            onClick={() => { onClose(); onBook(); }}
            className={`h-10 px-5 rounded-xl text-sm font-bold gap-2 ${
              c.availability === 'booked'
                ? 'bg-slate-100 dark:bg-white/6 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Calendar size={14} />
            {c.availability === 'booked' ? 'Fully Booked' : 'Book a Session'}
          </Button>
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
  counselor: Counselor | null;
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
              <p className="text-[10px] text-slate-400 dark:text-slate-500">${c.price} / session</p>
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
                  { label: 'Price', value: `$${c.price}` },
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
                      placeholder={`e.g. "I need help reviewing my AIF for UofT Engineering Science."`}
                      rows={4}
                      className="w-full text-sm bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl p-3 outline-none resize-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-300 dark:focus:border-blue-500/40 transition-all dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-slate-600"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">{topic.length}/500 characters</p>
                  </div>
                  <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-white/6">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Session total</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">${c.price}</p>
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
                <><Check size={14} /> Confirm Booking — ${c.price}</>
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

// ── Counselor Row Card (horizontal 3-panel layout) ─────────────────────────

function CounselorCard({
  c, saved, onSave, onViewProfile, onBook,
}: {
  c: Counselor;
  saved: boolean;
  onSave: (id: number) => void;
  onViewProfile: (c: Counselor) => void;
  onBook: (c: Counselor) => void;
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
                    Top Related
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
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 truncate">{c.universities[0]} · {c.experience}+ years experience</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {c.specialties.slice(0, 3).map(s => (
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
              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">Students Guided</span>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-auto md:ml-0">{c.studentsHelped}+</span>
            </div>
            <div className="flex items-center gap-2 md:justify-between">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">Success Rate</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 ml-auto md:ml-0">{c.acceptanceRate}%</span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-gray-100 dark:bg-white/6 self-stretch my-0" />
        <div className="md:hidden h-px bg-gray-100 dark:bg-white/6 mx-4" />

        {/* ── Panel 3: Availability + CTA ── */}
        <div className="md:w-52 px-4 md:px-5 py-3 md:py-5 flex flex-row md:flex-col items-center md:items-stretch justify-between md:justify-center gap-3 md:gap-3">
          <div className="min-w-0">
            <AvailabilityBadge status={c.availability} nextSlot={c.nextSlot} />
            <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mt-1">
              <Clock size={10} className="shrink-0" />
              <span className="truncate">Next Slot: {c.nextSlot}</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 shrink-0 md:shrink w-auto md:w-full">
            <button
              onClick={() => onViewProfile(c)}
              className="h-8 px-3.5 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/6 transition-all whitespace-nowrap"
            >
              View Profile
            </button>
            <Button
              disabled={c.availability === 'booked'}
              onClick={() => onBook(c)}
              className={`h-8 px-3.5 rounded-xl text-[11px] font-bold whitespace-nowrap ${
                c.availability === 'booked'
                  ? 'bg-slate-100 dark:bg-white/6 text-slate-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
              }`}
            >
              {c.availability === 'booked' ? 'Fully Booked' : 'Book Now'}
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}

// ── Right Sidebar ──────────────────────────────────────────────────────────

function DirectorySidebar({ onBook }: { onBook: () => void }) {
  return (
    <div className="flex flex-col gap-4">

      {/* Why work with a counselor? */}
      <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Why work with a counselor?</h3>
        <ul className="space-y-2">
          {[
            'Personalised strategy for your goals',
            'Expert guidance from experienced professionals',
            'Higher admissions success rate',
            'Save time and reduce stress',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-cyan-500 mt-0.5 shrink-0" />
              <span className="text-xs text-slate-600 dark:text-slate-400">{item}</span>
            </li>
          ))}
        </ul>
        <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
          Learn more about counseling <ArrowRight size={11} />
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
            Let us match you with the best counselor based on your goals and preferences.
          </p>
          <button className="w-full py-2 rounded-xl bg-white text-[12px] font-bold text-purple-700 hover:bg-purple-50 transition-all">
            Find My Match
          </button>
        </div>
      </div>

      {/* Top Expertise */}
      <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-3">Top Expertise</h3>
        <div className="space-y-2">
          {TOP_EXPERTISE.map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-xs text-slate-600 dark:text-slate-400">{item.label}</span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{item.count} counselors</span>
            </div>
          ))}
        </div>
        <button className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
          Learn more about counseling <ArrowRight size={11} />
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
              Our support team is here to help you find the right counselor.
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

export default function CounsellorDirectoryPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('Top Rated');
  const [expertiseFilter, setExpertiseFilter] = useState('All');
  const [universityFilter, setUniversityFilter] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [saved, setSaved] = useState<number[]>([]);

  const [profileOpen, setProfileOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeCounselor, setActiveCounselor] = useState<Counselor | null>(null);

  const toggleSave = (id: number) =>
    setSaved(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const openProfile = (c: Counselor) => { setActiveCounselor(c); setProfileOpen(true); };
  const openBooking = (c: Counselor) => { setActiveCounselor(c); setBookingOpen(true); };

  const hasActiveFilters = expertiseFilter !== 'All' || universityFilter !== 'All' || availabilityFilter !== 'All' || languageFilter !== 'All';

  const clearFilters = () => {
    setExpertiseFilter('All');
    setUniversityFilter('All');
    setAvailabilityFilter('All');
    setLanguageFilter('All');
    setSearch('');
    setCategory('All');
  };

  const filtered = useMemo(() => {
    let list = [...COUNSELORS];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.specialties.some(s => s.toLowerCase().includes(q)) ||
        c.universities.some(u => u.toLowerCase().includes(q))
      );
    }
    if (category !== 'All') list = list.filter(c => c.category === category);
    if (availabilityFilter !== 'All') list = list.filter(c => c.availability === availabilityFilter.toLowerCase());
    if (languageFilter !== 'All') list = list.filter(c => c.language === languageFilter);
    if (universityFilter !== 'All') list = list.filter(c => c.universities.some(u => u.toLowerCase().includes(universityFilter.toLowerCase())));
    if (sort === 'Top Rated') list.sort((a, b) => b.rating - a.rating);
    else if (sort === 'Price: Low to High') list.sort((a, b) => a.price - b.price);
    else if (sort === 'Price: High to Low') list.sort((a, b) => b.price - a.price);
    else if (sort === 'Most Students Helped') list.sort((a, b) => b.studentsHelped - a.studentsHelped);
    return [...list.filter(c => c.featured), ...list.filter(c => !c.featured)];
  }, [search, category, sort, availabilityFilter, languageFilter, universityFilter]);

  return (
    <div className="bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5 sm:space-y-6">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-[22px] sm:text-2xl lg:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Counselor Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Connect with experienced counselors who can guide your admission journey.
            </p>
          </div>
          <Button
            onClick={() => activeCounselor ? setBookingOpen(true) : openBooking(COUNSELORS[0])}
            className="self-start sm:self-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm shadow-blue-200 dark:shadow-blue-900/20 transition-all whitespace-nowrap"
          >
            <Calendar size={14} /> Book a Consultation
          </Button>
        </div>

        {/* ── Main 2-column layout ── */}
        <div className="flex gap-5 items-start">

          {/* ── Left: Main content ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* Search + Filters */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 space-y-3">

              {/* Row 1: Search + Filters button */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search counselor by name, expertise, or school…"
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

              {/* Row 2: Filter dropdowns (show always or toggled) */}
              <div className={`flex flex-wrap items-center gap-2 ${showFilters ? '' : 'hidden sm:flex'}`}>
                <FilterSelect label="Expertise" value={expertiseFilter} options={EXPERTISE_OPTIONS} onChange={setExpertiseFilter} />
                <FilterSelect label="University Focus" value={universityFilter} options={UNIVERSITY_OPTIONS} onChange={setUniversityFilter} />
                <FilterSelect
                  label="Availability"
                  value={availabilityFilter}
                  options={['All', 'Available', 'Busy', 'Booked']}
                  onChange={setAvailabilityFilter}
                />
                <FilterSelect label="Language" value={languageFilter} options={LANGUAGE_OPTIONS} onChange={setLanguageFilter} />
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

            {/* ── Counselor list ── */}
            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 p-12 flex flex-col items-center gap-3">
                <GraduationCap size={40} className="text-slate-300 dark:text-slate-600" />
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">No counsellors match your filters</p>
                <button onClick={clearFilters} className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map(c => (
                  <CounselorCard
                    key={c.id}
                    c={c}
                    saved={saved.includes(c.id)}
                    onSave={toggleSave}
                    onViewProfile={openProfile}
                    onBook={openBooking}
                  />
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              {[
                { icon: <BadgeCheck size={16} className="text-cyan-500" />, label: 'Verified Counsellors', desc: 'All counsellors are background-checked and credential-verified.' },
                { icon: <Award size={16} className="text-amber-500" />, label: 'Satisfaction Guaranteed', desc: 'Not happy with a session? We offer a free replacement booking.' },
                { icon: <Users size={16} className="text-emerald-500" />, label: '1,500+ Students Helped', desc: 'Join a growing community of successful Canadian applicants.' },
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
          <div className="hidden lg:block w-72 shrink-0 sticky top-24">
            <DirectorySidebar onBook={() => openBooking(COUNSELORS[0])} />
          </div>

        </div>{/* end 2-col */}

        {/* ── Mobile sidebar (shown below list) ── */}
        <div className="lg:hidden">
          <DirectorySidebar onBook={() => openBooking(COUNSELORS[0])} />
        </div>

      </div>

      <ProfileDialog
        counselor={activeCounselor}
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onBook={() => { setProfileOpen(false); setBookingOpen(true); }}
      />
      <BookingDialog
        counselor={activeCounselor}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}
