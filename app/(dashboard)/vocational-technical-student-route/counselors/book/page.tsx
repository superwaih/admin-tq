'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, Star, BadgeCheck,
  FileText, MessageSquare, Video, Mic, Check,
  Shield, Calendar, HeadphonesIcon, CheckCircle2,
  Sparkles, Clock, DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/src/hooks/useAuth';
import { addRequest, parseStartHour } from '@/src/lib/sessionPayments';

// ── Constants ─────────────────────────────────────────────────────────────────

const COUNSELORS_DATA: Record<string, {
  name: string; title: string; university: string; experience: string;
  rating: number; reviews: number; students: number; successRate: number;
  avatar: string; gradient: string; verified: boolean;
  specialties: string[]; price: number;
}> = {
  '1': { name: 'Daniel Brooks',     title: 'Red Seal Electrician · Apprenticeship Mentor', university: 'Skilled Trades Ontario',          experience: '15+', rating: 4.9, reviews: 142, students: 210, successRate: 93, avatar: 'DB', gradient: 'from-blue-500 to-indigo-600',    verified: true,  specialties: ['Electrical', '309A C of Q', 'Sponsorship'],     price: 0 },
  '2': { name: 'Marie Lavoie',      title: 'Red Seal Automotive Tech · Trade Instructor',  university: 'CCQ Québec',                      experience: '11+', rating: 4.8, reviews: 96,  students: 168, successRate: 90, avatar: 'ML', gradient: 'from-emerald-500 to-teal-600',   verified: true,  specialties: ['Automotive', 'DEP Intake', 'Bilingual'],        price: 70 },
  '3': { name: 'Gurpreet Singh',    title: 'Welding Mentor & CWB Inspector',               university: 'Alberta Apprenticeship & Industry Training', experience: '13+', rating: 4.9, reviews: 88, students: 134, successRate: 91, avatar: 'GS', gradient: 'from-amber-500 to-orange-600', verified: true,  specialties: ['Welding', 'CWB Ticket', 'NAIT/SAIT'],          price: 60 },
  '4': { name: 'Sarah Mitchell',    title: 'Apprenticeship & College Admissions Advisor',  university: 'SkilledTradesBC · BCIT',          experience: '9+',  rating: 4.8, reviews: 113, students: 245, successRate: 92, avatar: 'SM', gradient: 'from-violet-500 to-purple-600',  verified: true,  specialties: ['College Admissions', 'Funding', 'Foundation'],  price: 0 },
  '5': { name: 'Tom Whitefeather',  title: 'Heavy Equipment & Construction Mentor',        university: 'SATCC Saskatchewan',              experience: '18+', rating: 4.7, reviews: 67,  students: 98,  successRate: 88, avatar: 'TW', gradient: 'from-cyan-500 to-blue-600',     verified: true,  specialties: ['Heavy Equipment', 'Construction', 'Safety Tickets'], price: 0 },
  '6': { name: 'Linda Chen',        title: 'Technical College Admissions Advisor',         university: 'George Brown · Humber',           experience: '10+', rating: 4.8, reviews: 104, students: 188, successRate: 90, avatar: 'LC', gradient: 'from-rose-500 to-pink-600',     verified: true,  specialties: ['College Admissions', 'OCAS', 'Portfolio Prep'], price: 85 },
  '7': { name: 'Robert Friesen',    title: 'Plumber & Steamfitter Mentor',                 university: 'Apprenticeship Manitoba · RRC Polytech', experience: '14+', rating: 4.7, reviews: 59, students: 87, successRate: 89, avatar: 'RF', gradient: 'from-lime-500 to-green-600',   verified: true,  specialties: ['Plumbing', 'Steamfitter', 'Red Seal Prep'],    price: 55 },
  '8': { name: 'Amara Okafor',      title: 'HVAC/R Mentor & Apprenticeship Advisor',       university: 'Nova Scotia Apprenticeship Agency · NSCC', experience: '8+', rating: 4.6, reviews: 48, students: 72, successRate: 87, avatar: 'AO', gradient: 'from-red-500 to-rose-600',   verified: false, specialties: ['HVAC/R', 'Refrigeration', 'ODP Cert'],         price: 0 },
};

const DEFAULT_COUNSELOR = COUNSELORS_DATA['1'];

const CONSULT_TYPES = [
  { key: 'sponsorship', label: 'Sponsorship Help', icon: FileText,      desc: 'Find an employer sponsor and register your apprenticeship.', dur: '60 min', price: 'Free / CAD 60' },
  { key: 'mock',        label: 'Interview Prep',   icon: MessageSquare, desc: 'Practice trades admission & job-site interviews.',          dur: '60 min', price: 'Free / CAD 60' },
  { key: 'general',     label: 'Consultation',     icon: Video,         desc: 'Get overall guidance for your vocational pathway.',         dur: '60 min', price: 'Free / CAD 60' },
  { key: 'exam',        label: 'C of Q / Red Seal',icon: Mic,           desc: 'Prepare for your Certificate of Qualification exam.',       dur: '60 min', price: 'Free / CAD 60' },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT = ['S','M','T','W','T','F','S'];

const TIME_ROWS = [
  ['09:00 AM','09:00 AM','09:00 AM'],
  ['09:00 AM','09:00 AM','09:00 AM'],
  ['09:00 AM','09:00 AM','09:00 AM'],
  ['09:00 AM','09:00 AM','09:00 AM'],
  ['09:00 AM','09:00 AM','09:00 AM'],
];

// ── Calendar ──────────────────────────────────────────────────────────────────

function MiniCalendar({
  selectedDate, onSelect,
}: {
  selectedDate: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year  = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevDays = new Date(year, month, 0).getDate();

  const cells: { day: number; curr: boolean }[] = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: prevDays - i, curr: false });
  for (let d = 1; d <= daysInMonth; d++)   cells.push({ day: d, curr: true });
  while (cells.length % 7 !== 0)           cells.push({ day: cells.length - daysInMonth - firstDay + 1, curr: false });

  const isSel = (d: number) => selectedDate?.getFullYear() === year && selectedDate?.getMonth() === month && selectedDate?.getDate() === d;
  const isToday = (d: number) => today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;
  const isPast = (d: number) => new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return (
    <div className="w-full max-w-[240px]">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setView(new Date(year, month - 1, 1))}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 flex items-center justify-center text-slate-400 transition-all">
          <ChevronLeft size={14}/>
        </button>
        <span className="text-xs font-bold text-slate-700 dark:text-white">{MONTHS[month]} {year}</span>
        <button onClick={() => setView(new Date(year, month + 1, 1))}
          className="w-7 h-7 rounded-lg hover:bg-gray-100 dark:hover:bg-white/8 flex items-center justify-center text-slate-400 transition-all">
          <ChevronRight size={14}/>
        </button>
      </div>
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d, i) => (
          <div key={i} className="h-7 flex items-center justify-center text-[9px] font-bold text-slate-400 uppercase">{d}</div>
        ))}
      </div>
      {/* Cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((c, i) => (
          <button key={i} disabled={!c.curr || isPast(c.day)}
            onClick={() => c.curr && !isPast(c.day) && onSelect(new Date(year, month, c.day))}
            className={cn('h-7 w-7 mx-auto rounded-full flex items-center justify-center text-[10px] font-semibold transition-all',
              !c.curr              ? 'text-slate-300 dark:text-white/20 cursor-default' :
              isPast(c.day)        ? 'text-slate-300 dark:text-white/20 cursor-not-allowed' :
              isSel(c.day)         ? 'bg-blue-600 text-white font-bold shadow-sm' :
              isToday(c.day)       ? 'border-2 border-blue-400 text-blue-600 dark:text-blue-400 font-bold' :
                                     'text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-500/15')}>
            {c.day}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-black text-white">{n}</span>
      </div>
      <h2 className="text-sm font-bold text-slate-800 dark:text-white">{children}</h2>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookConsultationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { user } = useAuth();
  const id = params.get('id') ?? '1';
  const counselor = COUNSELORS_DATA[id] ?? DEFAULT_COUNSELOR;

  const [consultType, setConsultType] = useState<string>('general');
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    const d = new Date(); d.setDate(d.getDate() + 2); return d;
  });
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [notes, setNotes] = useState('');

  const selectedType = CONSULT_TYPES.find(t => t.key === consultType) ?? CONSULT_TYPES[2];
  const feeText = counselor.price === 0 ? 'Free' : `CAD ${counselor.price}`;

  const dateLabel = selectedDate
    ? `${MONTHS[selectedDate.getMonth()]} ${selectedDate.getDate()}, ${selectedDate.getFullYear()}`
    : '';

  const handleBook = useCallback(() => {
    const studentName = user
      ? `${user.first_name} ${user.last_name}`.trim()
      : 'Your student';
    const sd = selectedDate ?? new Date();
    // Local date-only (YYYY-MM-DD) so the calendar can't drift across the
    // day boundary via UTC conversion.
    const dateISO = `${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, '0')}-${String(sd.getDate()).padStart(2, '0')}`;
    const req = addRequest({
      counselorId:    id,
      counselorName:  counselor.name,
      counselorTitle: counselor.title,
      avatar:         counselor.avatar,
      gradient:       counselor.gradient,
      type:           selectedType.label,
      dateLabel,
      dateISO,
      time:           selectedTime,
      startHour:      parseStartHour(selectedTime),
      price:          counselor.price,
      notes:          notes.trim() || undefined,
      studentName,
    });
    router.push(`/vocational-technical-student-route/counselors/book/payment?reqId=${req.id}`);
  }, [id, counselor, selectedType.label, dateLabel, selectedDate, selectedTime, notes, user, router]);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Header ── */}
        <div className="mb-6">
          <Link href="/vocational-technical-student-route/counselors" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to My Consultation
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Book a Consultation</h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Schedule a 1:1 session with your selected counselor.</p>
        </div>

        {/* ── Two-column layout ── */}
        <div className="flex gap-6 items-start">

          {/* ── LEFT ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Counselor info banner */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar + name */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={cn('w-14 h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0', counselor.gradient)}>
                    {counselor.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">{counselor.name}</h3>
                      {counselor.verified && <BadgeCheck size={14} className="text-blue-500 shrink-0"/>}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">Top Rated</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-0.5">{counselor.title}</p>
                    <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{counselor.university} · {counselor.experience} experience</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {counselor.specialties.map(s => (
                        <span key={s} className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/8 text-slate-600 dark:text-slate-400">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="flex sm:flex-col gap-x-6 gap-y-1 sm:text-right shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < Math.floor(counselor.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}/>
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{counselor.rating}</span>
                    <span className="text-[10px] text-slate-400">({counselor.reviews} reviews)</span>
                  </div>
                  <div className="flex sm:justify-end items-center gap-3">
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] text-slate-400">Students Guided</p>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{counselor.students}+</p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] text-slate-400">Success Rate</p>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{counselor.successRate}%</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section 1: Consultation Type ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <SectionLabel n={1}>Select Consultation Type</SectionLabel>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CONSULT_TYPES.map(t => {
                  const Icon = t.icon;
                  const sel  = consultType === t.key;
                  return (
                    <button key={t.key} onClick={() => setConsultType(t.key)}
                      className={cn('flex flex-col items-start gap-2.5 p-4 rounded-2xl border-2 text-left transition-all',
                        sel ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10' : 'border-gray-100 dark:border-white/8 bg-white dark:bg-[#1a1f30] hover:border-blue-200 dark:hover:border-blue-500/20')}>
                      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center',
                        sel ? 'bg-blue-100 dark:bg-blue-500/25 text-blue-600 dark:text-blue-400' : 'bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400')}>
                        <Icon size={15}/>
                      </div>
                      <div className="w-full">
                        <p className={cn('text-xs font-bold leading-tight', sel ? 'text-blue-700 dark:text-blue-300' : 'text-slate-800 dark:text-white')}>{t.label}</p>
                        <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed line-clamp-2">{t.desc}</p>
                        <p className={cn('text-[9px] font-bold mt-2', sel ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400')}>
                          {t.dur} · {t.price}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 2: Select Date & Time ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <SectionLabel n={2}>Select Date</SectionLabel>
              <div className="flex flex-col md:flex-row gap-6">

                {/* Calendar */}
                <div className="shrink-0">
                  <MiniCalendar selectedDate={selectedDate} onSelect={setSelectedDate}/>
                </div>

                <div className="w-px bg-gray-100 dark:bg-white/6 hidden md:block self-stretch"/>

                {/* Time slots */}
                <div className="flex-1 min-w-0">
                  {selectedDate && (
                    <>
                      <p className="text-xs font-bold text-slate-700 dark:text-white mb-3 text-center">{dateLabel}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_ROWS.flat().map((slot, i) => {
                          // Vary the actual times for realism
                          const times = ['09:00 AM','10:00 AM','11:00 AM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM','08:00 AM','10:30 AM','01:30 PM','03:30 PM','04:30 PM'];
                          const t = times[i % times.length];
                          const sel = selectedTime === t;
                          return (
                            <button key={i} onClick={() => setSelectedTime(t)}
                              className={cn('h-9 rounded-xl text-[11px] font-semibold transition-all',
                                sel ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/8 text-slate-600 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-500/10')}>
                              {t}
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-3">All times shown in Eastern Time (EST)</p>
                    </>
                  )}
                  {!selectedDate && (
                    <div className="flex items-center justify-center h-full min-h-[120px] text-xs text-slate-400 dark:text-[#8e92ad]">
                      Please select a date to see available slots
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Section 3: Additional Details ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <SectionLabel n={3}>
                Add Additional Details
                <span className="ml-1.5 text-[10px] font-normal text-slate-400">(Optional)</span>
              </SectionLabel>
              <div className="relative">
                <textarea value={notes} onChange={e => setNotes(e.target.value.slice(0, 500))} rows={5}
                  placeholder="Tell the counselor about your goals, concern or specific topics you'd like to discuss"
                  className="w-full px-4 pt-3 pb-7 text-sm bg-white dark:bg-[#1a1f30] border border-gray-200 dark:border-white/10 rounded-2xl text-slate-700 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none leading-relaxed"/>
                <span className="absolute bottom-3 right-4 text-[10px] text-slate-400 pointer-events-none">{notes.length}/500</span>
              </div>
            </div>

            {/* ── Footer actions ── */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pb-8">
              <Link href="/vocational-technical-student-route/counselors"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Cancel
              </Link>
              <button onClick={handleBook}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm shadow-blue-600/25">
                <Calendar size={14}/> Send to Parent for Payment
              </button>
            </div>
          </div>

          {/* ── RIGHT: Sidebar ── */}
          <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0 gap-4">

            {/* Consultation Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Consultation Summary</h3>
              <div className="space-y-3">
                {[
                  { label:'Counselor',         value: counselor.name },
                  { label:'Consultation Type', value: selectedType.label + '\n60 min' },
                  { label:'Duration',          value: '60 min' },
                  { label:'Date',              value: selectedDate ? `${MONTHS[selectedDate.getMonth()].slice(0,3)} ${selectedDate.getDate()},  ${selectedDate.getFullYear()}` : '—' },
                  { label:'Time',              value: selectedTime + ' (EST)' },
                  { label:'Fee',               value: feeText, highlight: true },
                ].filter(r => r.label !== 'Duration').map(r => (
                  <div key={r.label} className="flex items-start justify-between gap-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider whitespace-nowrap pt-0.5">{r.label}</span>
                    <span className={cn('text-xs font-bold text-right', r.highlight ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white')}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Total</span>
                <span className="text-sm font-black text-blue-600 dark:text-blue-400">{feeText}</span>
              </div>
            </div>

            {/* Why work with a counselor */}
            <div className="bg-violet-50 dark:bg-violet-500/10 rounded-2xl border border-violet-100 dark:border-violet-500/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={13} className="text-violet-600 dark:text-violet-400"/>
                <h3 className="text-sm font-bold text-violet-800 dark:text-violet-200">Why work with a counselor?</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Personalized strategy for your goals',
                  'Expert guidance from experienced professionals',
                  'Higher admissions success rate',
                  'Save time and reduce stress',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={12} className="text-violet-500 dark:text-violet-400 mt-0.5 shrink-0"/>
                    <span className="text-[11px] text-violet-700 dark:text-violet-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Before You Book */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Before You Book</h3>
              <ul className="space-y-2.5">
                {[
                  { icon: Calendar,         text: 'You will receive a confirmation email with meeting details' },
                  { icon: Clock,            text: 'You can reschedule or cancel 24 hours before' },
                  { icon: Shield,           text: 'All session are 1:1 and confidential.' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex items-start gap-2.5">
                      <Icon size={12} className="text-slate-400 dark:text-[#8e92ad] mt-0.5 shrink-0"/>
                      <span className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-relaxed">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Need Help */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/6 flex items-center justify-center shrink-0">
                  <HeadphonesIcon size={14} className="text-slate-500 dark:text-slate-400"/>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Need Help?</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-relaxed">Our support team is here to help you find the right counselor.</p>
                </div>
              </div>
              <button className="w-full py-2 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5 transition-all">
                Contact Support
              </button>
            </div>

          </aside>
        </div>
      </div>
    </div>
  );
}
