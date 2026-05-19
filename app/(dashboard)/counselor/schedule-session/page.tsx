'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, ChevronRight, FileText, Mic, Users, BookOpen,
  Clock, X, Upload, Calendar, Lightbulb, CheckCircle, ChevronDown,
  Search, PenLine,
} from 'lucide-react';
import Link from 'next/link';

const STUDENTS = [
  { id: 's1', name: 'Aisha Patel',     initials: 'AP', color: 'bg-orange-400', university: 'McGill University',     program: 'MD Program' },
  { id: 's2', name: 'Ethan Kim',       initials: 'EK', color: 'bg-blue-500',   university: 'University of Toronto', program: 'MD Program' },
  { id: 's3', name: 'Sophie Martin',   initials: 'SM', color: 'bg-pink-500',   university: 'Western University',    program: 'DDS Program' },
  { id: 's4', name: 'Arjun Mehta',     initials: 'AM', color: 'bg-green-500',  university: 'UBC',                   program: 'DDS Program' },
  { id: 's5', name: 'Priya Mehta',     initials: 'PM', color: 'bg-indigo-500', university: 'University of Toronto', program: 'Engineering' },
  { id: 's6', name: 'James Kim',       initials: 'JK', color: 'bg-cyan-600',   university: 'McMaster University',   program: 'Health Sci' },
  { id: 's7', name: 'Sofia Martinez',  initials: 'SM', color: 'bg-rose-500',   university: "Queen's University",    program: 'Commerce' },
  { id: 's8', name: 'Nadia Patel',     initials: 'NP', color: 'bg-purple-500', university: 'UBC',                   program: 'Pharmacy' },
];

const SESSION_TYPES = [
  { id: 'essay',     label: 'Essay Review',     icon: <FileText size={20} />,  desc: 'Review and feedback on application essays' },
  { id: 'mock',      label: 'Mock Interview',   icon: <Mic size={20} />,       desc: 'MMI or traditional interview practice' },
  { id: 'consult',   label: 'Consultation',     icon: <Users size={20} />,     desc: 'General admissions counselling session' },
  { id: 'mmi',       label: 'MMI Prep',         icon: <BookOpen size={20} />,  desc: 'Multiple Mini Interview preparation' },
];

const TIME_SLOTS = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '1:00 PM',
  '1:30 PM',  '2:00 PM',  '2:30 PM',  '3:00 PM',
  '3:30 PM',  '4:00 PM',  '4:30 PM',  '5:00 PM',
];

const UPCOMING_SESSIONS = [
  { name: 'Aisha Patel',   initials: 'AP', color: 'bg-orange-400', university: 'McGill University',     program: 'MD Program',  time: 'Today, 4:00 PM' },
  { name: 'Ethan Kim',     initials: 'EK', color: 'bg-blue-500',   university: 'University of Toronto', program: 'MD Program',  time: 'Today, 6:00 PM' },
  { name: 'Sophie Martin', initials: 'SM', color: 'bg-pink-500',   university: 'Western University',    program: 'DDS Program', time: 'Tomorrow, 11:00 AM' },
];

const CAL_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MAY_SESSIONS = [8, 12, 15, 19, 20, 21, 22, 26, 27, 29];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

export default function ScheduleSessionPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<typeof STUDENTS[0] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [sessionType, setSessionType] = useState('essay');
  const [selectedDate, setSelectedDate] = useState(20);
  const [calMonth, setCalMonth] = useState(4); // May = 4
  const [calYear, setCalYear] = useState(2025);
  const [selectedTime, setSelectedTime] = useState('9:00 AM');
  const [timezone, setTimezone] = useState('EST (UTC-05:00)');
  const [notes, setNotes] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const { firstDay, daysInMonth } = buildCalendar(calYear, calMonth);

  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.university.toLowerCase().includes(search.toLowerCase())
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files.map(f => f.name)]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setAttachedFiles(prev => [...prev, ...files.map(f => f.name)]);
  }

  function handleSchedule() {
    if (!selectedStudent || !sessionType || !selectedDate || !selectedTime) return;
    setSubmitted(true);
    setTimeout(() => router.push('/counselor/session-schedule'), 1800);
  }

  const today = 20;
  const availabilityDays = [20, 21, 22, 23, 26, 27, 28];

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center">
          <CheckCircle size={32} className="text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Session Scheduled!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
          Your session with <strong>{selectedStudent?.name}</strong> on{' '}
          <strong>{MONTH_NAMES[calMonth]} {selectedDate}, {calYear}</strong> at{' '}
          <strong>{selectedTime}</strong> has been confirmed.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Redirecting to Session Schedule…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link
              href="/counselor"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2"
            >
              <ChevronLeft size={15} /> Back to Dashboard
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Schedule New Session</h1>
            <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">Fill in the details below to schedule a session with your student.</p>
          </div>
          <Link href="/counselor/session-templates" className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-white/5 transition-all shadow-sm">
            <PenLine size={14} /> Session Template
          </Link>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-5 items-start">

          {/* ── Left: Form ── */}
          <div className="space-y-5">

            {/* 1. Select Student */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[11px] font-bold text-cyan-600">1</span>
                Select Student
              </h2>

              {/* Search input */}
              <div className="relative mb-3">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#8e92ad]" />
                <input
                  type="text"
                  placeholder="Search by name or select student"
                  value={search}
                  onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                />
                {showDropdown && (
                  <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                    {filteredStudents.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-slate-400">No students found</p>
                    ) : (
                      filteredStudents.map(s => (
                        <button
                          key={s.id}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                          onClick={() => { setSelectedStudent(s); setSearch(''); setShowDropdown(false); }}
                        >
                          <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{s.initials}</div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{s.name}</p>
                            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] truncate">{s.university} · {s.program}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected student chip */}
              {selectedStudent ? (
                <div className="flex items-center gap-3 px-3.5 py-2.5 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200/60 dark:border-cyan-500/25 rounded-xl">
                  <div className={`w-8 h-8 rounded-lg ${selectedStudent.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                    {selectedStudent.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{selectedStudent.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8e92ad]">{selectedStudent.university}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 shrink-0">
                    {selectedStudent.program}
                  </span>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                  {STUDENTS.slice(0, 4).map(s => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 dark:border-white/6 bg-gray-50 dark:bg-white/3 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:border-cyan-200 dark:hover:border-cyan-500/25 transition-all text-left"
                    >
                      <div className={`w-6 h-6 rounded-md ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>{s.initials}</div>
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{s.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Session Type */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[11px] font-bold text-cyan-600">2</span>
                Select Session Type
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SESSION_TYPES.map(t => {
                  const active = sessionType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSessionType(t.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                        active
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 shadow-sm'
                          : 'border-gray-100 dark:border-white/6 bg-gray-50 dark:bg-white/3 hover:border-gray-200 dark:hover:border-white/10 hover:bg-white dark:hover:bg-white/5'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600' : 'bg-white dark:bg-white/8 text-slate-500 dark:text-[#8e92ad]'}`}>
                        {t.icon}
                      </div>
                      <span className={`text-xs font-semibold leading-tight ${active ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3 & 4: Date + Time side by side on wide screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* 3. Select Date */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[11px] font-bold text-cyan-600">3</span>
                  Select Date
                </h2>
                {/* Calendar header */}
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <span className="text-sm font-bold text-slate-700 dark:text-[#c8ccdf]">{MONTH_NAMES[calMonth]} {calYear}</span>
                  <button
                    onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                  {CAL_DAYS.map((d, i) => (
                    <span key={i} className="text-[9px] font-bold text-slate-400 dark:text-[#40455e] py-1">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 text-center">
                  {Array.from({ length: firstDay }).map((_, i) => <span key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isSelected = day === selectedDate;
                    const isToday = day === today && calMonth === 4 && calYear === 2025;
                    const hasSessions = MAY_SESSIONS.includes(day) && calMonth === 4;
                    const isPast = day < today && calMonth === 4 && calYear === 2025;
                    return (
                      <button
                        key={day}
                        disabled={isPast}
                        onClick={() => setSelectedDate(day)}
                        className={`relative flex flex-col items-center justify-center py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                          isSelected
                            ? 'bg-cyan-600 text-white font-bold shadow-sm'
                            : isToday
                            ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 font-bold'
                            : isPast
                            ? 'text-slate-300 dark:text-[#40455e] cursor-not-allowed'
                            : 'text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-100 dark:hover:bg-white/8 cursor-pointer'
                        }`}
                      >
                        {day}
                        {hasSessions && !isSelected && (
                          <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-cyan-500 dark:bg-cyan-400" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Select Time */}
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[11px] font-bold text-cyan-600">4</span>
                  Select Time
                </h2>
                {/* Timezone */}
                <div className="flex items-center gap-1.5 mb-3 mt-1">
                  <span className="text-[11px] text-slate-400 dark:text-[#8e92ad]">Time Zone:</span>
                  <button className="flex items-center gap-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                    {timezone} <ChevronDown size={11} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-1.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
                  {TIME_SLOTS.map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedTime(t)}
                      className={`py-2 rounded-xl text-xs font-semibold transition-all ${
                        selectedTime === t
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'bg-gray-50 dark:bg-white/5 text-slate-600 dark:text-[#c8ccdf] hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-700 dark:hover:text-cyan-400 border border-gray-100 dark:border-white/6'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-[11px] text-slate-400 dark:text-[#8e92ad]">
                  <Clock size={11} /> Duration: 60 minutes
                </div>
              </div>
            </div>

            {/* 5. Session Notes */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[11px] font-bold text-cyan-600">5</span>
                Session Agenda / Notes
                <span className="text-[10px] font-normal text-slate-400 dark:text-[#8e92ad] ml-1">Optional</span>
              </h2>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Add agenda items, discussion points, or any specific notes for the session..."
                className="w-full mt-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 resize-none transition-all"
              />
              <div className="flex justify-end mt-1">
                <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{notes.length}/500</span>
              </div>
            </div>

            {/* 6. Attach Resources */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 md:p-6">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-[11px] font-bold text-cyan-600">6</span>
                Attach Resources
                <span className="text-[10px] font-normal text-slate-400 dark:text-[#8e92ad] ml-1">Optional</span>
              </h2>
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`mt-3 rounded-xl border-2 border-dashed transition-all px-5 py-6 flex flex-col sm:flex-row items-center gap-4 ${
                  dragOver
                    ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10'
                    : 'border-gray-200 dark:border-white/8 bg-gray-50 dark:bg-white/3'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/8 border border-gray-100 dark:border-white/8 flex items-center justify-center shadow-sm shrink-0">
                  <Upload size={16} className="text-slate-400 dark:text-[#8e92ad]" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Upload files{' '}
                    <span className="font-normal text-slate-400 dark:text-[#8e92ad]">or drag and drop</span>
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">PDF, DOCX, PPTX, or ZIP (Max. 10MB each)</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 px-4 py-2 rounded-xl bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 transition-all"
                >
                  Browse Files
                </button>
                <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
              </div>
              {attachedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/6">
                      <FileText size={13} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-700 dark:text-slate-300 flex-1 truncate">{f}</span>
                      <button onClick={() => setAttachedFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pb-4">
              <Link
                href="/counselor/session-schedule"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
              <button
                onClick={handleSchedule}
                disabled={!selectedStudent}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${
                  selectedStudent
                    ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200 dark:shadow-cyan-900/20 cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Calendar size={15} /> Schedule Session
              </button>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-4">

            {/* Your Availability */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Your Availability</h3>
                <button className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">Edit Availability</button>
              </div>
              {/* Mini calendar */}
              <div className="flex items-center justify-between mb-3">
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors">
                  <ChevronLeft size={13} />
                </button>
                <span className="text-xs font-semibold text-slate-600 dark:text-[#c8ccdf]">May 2025</span>
                <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors">
                  <ChevronRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                {CAL_DAYS.map((d, i) => <span key={i} className="text-[9px] font-bold text-slate-400 dark:text-[#40455e]">{d}</span>)}
              </div>
              <div className="grid grid-cols-7 gap-0.5 text-center">
                {Array.from({ length: 3 }).map((_, i) => <span key={`ep-${i}`} />)}
                {Array.from({ length: 31 }, (_, i) => {
                  const day = i + 1;
                  const isSelected = day === selectedDate;
                  const isAvail = availabilityDays.includes(day);
                  const isPast = day < today;
                  return (
                    <div
                      key={day}
                      className={`relative flex items-center justify-center py-0.5 rounded-md text-[10px] font-medium cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-cyan-600 text-white font-bold'
                          : isAvail
                          ? 'bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 font-semibold'
                          : isPast
                          ? 'text-slate-300 dark:text-[#40455e]'
                          : 'text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/5'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              {/* Availability info */}
              <div className="mt-4 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Available on {MONTH_NAMES[calMonth]} {selectedDate}
                </p>
                <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-semibold mt-0.5">9:00 AM – 6:00 PM</p>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-0.5">8 available slots</p>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Upcoming Sessions</h3>
                <Link href="/counselor/session-schedule" className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 hover:underline">
                  View All <ChevronRight size={11} />
                </Link>
              </div>
              <div className="space-y-3">
                {UPCOMING_SESSIONS.map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${s.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate">{s.university}</p>
                      <p className="text-[10px] font-medium text-cyan-700 dark:text-cyan-400 truncate">{s.program}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] font-semibold text-slate-600 dark:text-[#c8ccdf]">{s.time.split(', ')[0]}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.time.split(', ')[1]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-amber-500" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Quick Tips</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Add agenda to help you stay focused',
                  'Share resources with your student',
                  'Student will receive email reminders',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] text-slate-500 dark:text-[#8e92ad]">
                    <CheckCircle size={11} className="text-cyan-500 mt-0.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
