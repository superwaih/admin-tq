'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, Search, X, Plus, Check,
  Calendar, Clock, User, Zap, Video, Share2, Info,
  BookOpen, Users, Heart, Lightbulb, Shield, MessageCircle,
} from 'lucide-react';

// ── Data ───────────────────────────────────────────────────────────────────────
const ALL_STUDENTS = [
  { id: 'STU-2024-1001', name: 'Amina Yusuf',    initials: 'AY', color: 'bg-yellow-400', program: 'Medicine' },
  { id: 'STU-2024-1002', name: 'Daniel Musa',    initials: 'DM', color: 'bg-blue-500',   program: 'Medicine' },
  { id: 'STU-2024-1003', name: 'Fatima Bello',   initials: 'FB', color: 'bg-pink-500',   program: 'Medicine' },
  { id: 'STU-2024-1004', name: 'Ibrahim Ali',    initials: 'IA', color: 'bg-green-500',  program: 'Dentistry' },
  { id: 'STU-2024-1005', name: 'Maryam Okafor',  initials: 'MO', color: 'bg-orange-400', program: 'Medicine' },
  { id: 'STU-2024-1006', name: 'Joshua Adeyemi', initials: 'JA', color: 'bg-teal-500',   program: 'Pharmacy' },
  { id: 'STU-2024-1007', name: 'Halima Sani',    initials: 'HS', color: 'bg-red-400',    program: 'Medicine' },
  { id: 'STU-2024-1008', name: 'Samuel Johnson', initials: 'SJ', color: 'bg-purple-500', program: 'Dentistry' },
];

interface Station {
  id: string;
  title: string;
  sub: string;
  questions: number;
  icon: React.ReactNode;
  iconBg: string;
}

const STATIONS: Station[] = [
  { id: 's1', title: 'Why Medicine?',      sub: 'Motivation & FAS Question', questions: 5, icon: <Heart size={16} />,        iconBg: 'bg-red-100 dark:bg-red-500/20 text-red-500' },
  { id: 's2', title: 'Ethical Dilemma',   sub: 'Ethics & Value',            questions: 5, icon: <Shield size={16} />,        iconBg: 'bg-orange-100 dark:bg-orange-500/20 text-orange-500' },
  { id: 's3', title: 'Team work scenario',sub: 'Interpersonal skills',      questions: 5, icon: <Users size={16} />,         iconBg: 'bg-purple-100 dark:bg-purple-500/20 text-purple-500' },
  { id: 's4', title: 'Problem Solving',   sub: 'Critical Thinking',         questions: 5, icon: <Lightbulb size={16} />,     iconBg: 'bg-blue-100 dark:bg-blue-500/20 text-blue-500' },
  { id: 's5', title: 'Handling Pressure', sub: 'Resilience',                questions: 5, icon: <Zap size={16} />,           iconBg: 'bg-pink-100 dark:bg-pink-500/20 text-pink-500' },
  { id: 's6', title: 'Communication',     sub: 'Communication skills',      questions: 5, icon: <MessageCircle size={16} />, iconBg: 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-500' },
];

const PROGRAMS = ['All Programs', 'Medicine', 'Dentistry', 'Pharmacy'];

const FACILITATORS = [
  { name: 'Dr. Sarah Johnson', role: 'Senior Counselor', initials: 'SJ', color: 'bg-cyan-600' },
  { name: 'Dr. Michael Brown', role: 'Counselor',        initials: 'MB', color: 'bg-orange-400' },
  { name: 'Dr. Emily Davis',   role: 'Counselor',        initials: 'ED', color: 'bg-purple-500' },
];

export default function AssignPracticePage() {
  const [selectedStudents, setSelectedStudents] = useState<typeof ALL_STUDENTS>(
    [ALL_STUDENTS[0], ALL_STUDENTS[1], ALL_STUDENTS[2]],
  );
  const [selectedStations, setSelectedStations] = useState<string[]>(['s3', 's1', 's5']);
  const [search, setSearch]     = useState('');
  const [program, setProgram]   = useState('All Programs');
  const [showDropdown, setShowDropdown] = useState(false);
  const [sessionDate, setSessionDate]   = useState('May 24, 2025');
  const [startTime, setStartTime]       = useState('2:00PM');
  const [duration, setDuration]         = useState('60 mins');
  const [facilitator, setFacilitator]   = useState(0);
  const [instruction, setInstruction]   = useState('');
  const [settings, setSettings] = useState({
    aiFeedback:   true,
    recording:    true,
    shareInstructions: false,
  });
  const [saving,    setSaving]    = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assigned,  setAssigned]  = useState(false);

  const filteredStudents = ALL_STUDENTS.filter(s => {
    const matchSearch  = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search);
    const matchProgram = program === 'All Programs' || s.program === program;
    const notSelected  = !selectedStudents.find(sel => sel.id === s.id);
    return matchSearch && matchProgram && notSelected;
  });

  function addStudent(s: typeof ALL_STUDENTS[number]) {
    setSelectedStudents(prev => [...prev, s]);
    setShowDropdown(false);
    setSearch('');
  }

  function removeStudent(id: string) {
    setSelectedStudents(prev => prev.filter(s => s.id !== id));
  }

  function toggleStation(id: string) {
    setSelectedStations(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }

  function toggleSetting(key: keyof typeof settings) {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleAssign() {
    setAssigning(true);
    setTimeout(() => { setAssigning(false); setAssigned(true); }, 1800);
  }

  function handleSaveDraft() {
    setSaving(true);
    setTimeout(() => setSaving(false), 1200);
  }

  const selectedStationObjects = STATIONS.filter(s => selectedStations.includes(s.id));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1300px] mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="mb-5">
          <Link
            href="/counselor/mmi-coaching"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to MMI Coaching
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Assign Practice Session
              </h1>
              <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
                Select students, choose stations, and schedule a season.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleSaveDraft}
                className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                  saving
                    ? 'border-emerald-400 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                    : 'border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 bg-white dark:bg-[#161a27] hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                {saving ? 'Saved!' : 'Save as Draft'}
              </button>
              <button
                onClick={handleAssign}
                disabled={assigning || assigned || selectedStudents.length === 0 || selectedStations.length === 0}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all disabled:opacity-60 ${
                  assigned
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 dark:shadow-indigo-900/20'
                }`}
              >
                {assigned ? (
                  <><Check size={14} /> Session Assigned!</>
                ) : assigning ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Assigning…</>
                ) : (
                  'Assign Session'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Two-column layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 items-start">

          {/* ── Left: Form ──────────────────────────────────── */}
          <div className="space-y-5">

            {/* ── Section 1: Select Student ─────────────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">1. Select Student</h2>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                  Selected Student ({selectedStudents.length})
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">Choose one or more students to assign</p>

              {/* Search + program filter */}
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search student by name or ID"
                    value={search}
                    onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.03] text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                  {/* Dropdown */}
                  {showDropdown && filteredStudents.length > 0 && (
                    <div className="absolute top-full mt-1 left-0 right-0 z-20 bg-white dark:bg-[#1e2235] rounded-xl border border-gray-100 dark:border-white/10 shadow-lg overflow-hidden">
                      {filteredStudents.slice(0, 5).map(s => (
                        <button
                          key={s.id}
                          onClick={() => addStudent(s)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
                        >
                          <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                            {s.initials}
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{s.name}</p>
                            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.id}</p>
                          </div>
                          <span className="ml-auto text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.program}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Program dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={program}
                    onChange={e => setProgram(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-[#8e92ad] focus:outline-none"
                  >
                    {PROGRAMS.map(p => <option key={p}>{p}</option>)}
                  </select>
                  <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Selected student chips */}
              {selectedStudents.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedStudents.map(s => (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/8 rounded-xl"
                    >
                      <div className={`w-6 h-6 rounded-lg ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                        {s.initials}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] leading-none">{s.name}</p>
                        <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{s.id}</p>
                      </div>
                      <button
                        onClick={() => removeStudent(s.id)}
                        className="ml-1 text-slate-300 dark:text-white/20 hover:text-slate-500 dark:hover:text-white/50 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setShowDropdown(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-400 dark:text-[#8e92ad] hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                  >
                    <Plus size={12} /> Assign Practice
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDropdown(true)}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-dashed border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-400 dark:text-[#8e92ad] hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all"
                >
                  <Plus size={12} /> Add Students
                </button>
              )}
            </div>

            {/* ── Section 2: Choose Practice Station ────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">2. Choose Practice Station</h2>
                <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                  Selected Station ({selectedStations.length})
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">
                Select the MMI stations or question sets for this practice.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {STATIONS.map(station => {
                  const active = selectedStations.includes(station.id);
                  return (
                    <button
                      key={station.id}
                      onClick={() => toggleStation(station.id)}
                      className={`relative flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                        active
                          ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10 shadow-sm'
                          : 'border-gray-100 dark:border-white/6 bg-gray-50 dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/10'
                      }`}
                    >
                      {/* Check indicator */}
                      {active && (
                        <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-cyan-600 flex items-center justify-center">
                          <Check size={9} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${station.iconBg}`}>
                        {station.icon}
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold leading-tight ${active ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>
                          {station.title}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{station.sub}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#40455e] mt-1">{station.questions} Question</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Section 3: Schedule Session ────────────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-1">3. Schedule Session</h2>
              <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">Set date, time, and duration for this practice session.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Session Date */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">Session Date</label>
                  <div className="relative">
                    <Calendar size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={sessionDate}
                      onChange={e => setSessionDate(e.target.value)}
                      className="w-full appearance-none pl-8 pr-7 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-[#c8ccdf] focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                      {['May 24, 2025','May 25, 2025','May 26, 2025','May 27, 2025','May 28, 2025'].map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">Start Time</label>
                  <div className="relative">
                    <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full appearance-none pl-8 pr-7 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-[#c8ccdf] focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                      {['9:00AM','10:00AM','11:00AM','1:00PM','2:00PM','3:00PM','4:00PM'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">Start Time</label>
                  <div className="relative">
                    <Clock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <select
                      value={duration}
                      onChange={e => setDuration(e.target.value)}
                      className="w-full appearance-none pl-8 pr-7 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-[#c8ccdf] focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                      {['30 mins','45 mins','60 mins','90 mins','120 mins'].map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Counselor/Facilitator */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-1.5">Counselor / Facilitator</label>
                  <div className="relative">
                    <div className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-lg ${FACILITATORS[facilitator].color} flex items-center justify-center text-white text-[8px] font-bold pointer-events-none`}>
                      {FACILITATORS[facilitator].initials}
                    </div>
                    <select
                      value={facilitator}
                      onChange={e => setFacilitator(Number(e.target.value))}
                      className="w-full appearance-none pl-9 pr-7 py-2.5 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-[#c8ccdf] focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                    >
                      {FACILITATORS.map((f, i) => (
                        <option key={f.name} value={i}>{f.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1 pl-0.5">{FACILITATORS[facilitator].role}</p>
                </div>
              </div>
            </div>

            {/* ── Section 4: Session Settings ─────────────────── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-1">4. Sessions Settings</h2>
              <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">Add instruction and customize session preference</p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Instruction textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] mb-1.5">
                    Instruction for Students <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={instruction}
                      onChange={e => setInstruction(e.target.value.slice(0, 500))}
                      placeholder="Please complete the assigned stations as a realistically as possible, you will receive feedback after the session."
                      rows={4}
                      className="w-full px-4 py-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-[#c8ccdf] placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none"
                    />
                    <p className="absolute bottom-3 right-3 text-[10px] text-slate-400 dark:text-[#40455e] pointer-events-none">
                      {instruction.length}/500 word
                    </p>
                  </div>
                </div>

                {/* Session settings toggles */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] mb-3">Session Settings</label>
                  <div className="space-y-3">
                    {[
                      { key: 'aiFeedback' as const,        icon: <Zap size={13} />,    label: 'Enable AI-powered feedback',   iconColor: 'text-indigo-500' },
                      { key: 'recording'  as const,        icon: <Video size={13} />,  label: 'Allow recording for review',   iconColor: 'text-cyan-500' },
                      { key: 'shareInstructions' as const, icon: <Share2 size={13} />, label: 'Share instruction with student',iconColor: 'text-orange-500' },
                    ].map(item => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          onClick={() => toggleSetting(item.key)}
                          className={`relative w-9 h-5 rounded-full transition-all flex items-center shrink-0 ${
                            settings[item.key] ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-white/10'
                          }`}
                        >
                          <div className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${
                            settings[item.key] ? 'left-[18px]' : 'left-[3px]'
                          }`} />
                        </div>
                        <span className={`${item.iconColor} shrink-0`}>{item.icon}</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ──────────────────────────────────── */}
          <div className="space-y-4">

            {/* Selected Students */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Selected Students</h3>
              {selectedStudents.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">No students selected yet.</p>
              ) : (
                <div className="space-y-3">
                  {selectedStudents.map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}>
                        {s.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{s.name}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.id}</p>
                      </div>
                      <button onClick={() => removeStudent(s.id)} className="text-slate-300 dark:text-white/20 hover:text-red-400 transition-colors">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Station */}
            {selectedStationObjects.length > 0 && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Selected Station</h3>
                <div className="space-y-2.5">
                  {selectedStationObjects.map(s => (
                    <div key={s.id} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>
                        {s.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{s.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Session Settings summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Session Settings</h3>
              <div className="space-y-2">
                {[
                  { icon: <Zap size={12} />,    label: 'Enable AI-powered feedback',    key: 'aiFeedback' as const,        color: 'text-indigo-500' },
                  { icon: <Video size={12} />,  label: 'Allow recording for review',    key: 'recording'  as const,        color: 'text-cyan-500' },
                  { icon: <Share2 size={12} />, label: 'Share instruction with student',key: 'shareInstructions' as const, color: 'text-orange-500' },
                ].map(item => (
                  <div key={item.key} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded flex items-center justify-center border-2 shrink-0 transition-all ${
                      settings[item.key] ? 'bg-cyan-600 border-cyan-600' : 'border-gray-200 dark:border-white/15'
                    }`}>
                      {settings[item.key] && <Check size={9} className="text-white" strokeWidth={3} />}
                    </div>
                    <span className={`${item.color} shrink-0`}>{item.icon}</span>
                    <span className="text-[11px] text-slate-600 dark:text-[#c8ccdf]">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* How it works */}
            <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
                  <Info size={12} className="text-white" />
                </div>
                <p className="text-xs font-bold text-indigo-800 dark:text-indigo-200">How it works</p>
              </div>
              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-300/80 leading-relaxed">
                Student will receive invitation and can join practice session at schedule time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
