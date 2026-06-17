'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronRight, Plus, Download,
  Calendar, Clock, MapPin, LayoutList,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
type ViewMode = 'Week' | 'Month' | 'Day' | 'Agenda';

interface Session {
  id: number;
  initials: string;
  name: string;
  type: 'Essay Review' | 'Mock Interview' | 'Consultation' | 'MMI Prep' | 'Other';
  startHour: number;   // e.g. 9.0  = 9:00 AM
  endHour: number;     // e.g. 10.0 = 10:00 AM
  dayIndex: number;    // 0 = Mon … 6 = Sun
  venue?: string;
}

// ── Colour maps ───────────────────────────────────────────────────────────────
const TYPE_COLORS: Record<string, { bg: string; border: string; dot: string; text: string }> = {
  'Essay Review':   { bg: 'bg-blue-50  dark:bg-blue-500/20',   border: 'border-blue-300  dark:border-blue-500/40',   dot: 'bg-blue-500',   text: 'text-blue-700  dark:text-blue-300'   },
  'Mock Interview': { bg: 'bg-violet-50 dark:bg-violet-500/20', border: 'border-violet-300 dark:border-violet-500/40', dot: 'bg-violet-500', text: 'text-violet-700 dark:text-violet-300' },
  'Consultation':   { bg: 'bg-emerald-50 dark:bg-emerald-500/20', border: 'border-emerald-300 dark:border-emerald-500/40', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  'MMI Prep':       { bg: 'bg-amber-50  dark:bg-amber-500/20',  border: 'border-amber-300  dark:border-amber-500/40',  dot: 'bg-amber-500',  text: 'text-amber-700  dark:text-amber-300'  },
  'Other':          { bg: 'bg-slate-100 dark:bg-white/8',       border: 'border-slate-300  dark:border-white/15',      dot: 'bg-slate-400',  text: 'text-slate-600  dark:text-slate-300'  },
};

const AVATAR_COLORS: Record<string, string> = {
  'LK': 'bg-indigo-500', 'AT': 'bg-violet-500', 'JL': 'bg-slate-500',
  'OE': 'bg-amber-500',  'PM': 'bg-indigo-600', 'SM': 'bg-pink-500',
  'AY': 'bg-yellow-400', 'DM': 'bg-blue-500',   'FB': 'bg-pink-500',
  'IA': 'bg-green-500',  'MO': 'bg-orange-400',
};

// ── Calendar data ─────────────────────────────────────────────────────────────
const SESSIONS: Session[] = [
  { id: 1,  initials: 'LK', name: 'Liam Kay',      type: 'Mock Interview', startHour: 9,    endHour: 10,   dayIndex: 3, venue: 'Zoom' },
  { id: 2,  initials: 'AT', name: 'Ave Tyler',      type: 'Consultation',   startHour: 10,   endHour: 10.5, dayIndex: 1, venue: 'McGill University' },
  { id: 3,  initials: 'AT', name: 'Ave Tyler',      type: 'Essay Review',   startHour: 13.5, endHour: 14.5, dayIndex: 3, venue: 'McGill University' },
  { id: 4,  initials: 'LK', name: 'Liam Kay',      type: 'Consultation',   startHour: 9.08, endHour: 10,   dayIndex: 0, venue: 'Teams' },
  { id: 5,  initials: 'OE', name: 'Oliva Ema',     type: 'Essay Review',   startHour: 10,   endHour: 11,   dayIndex: 5, venue: 'Zoom' },
  { id: 6,  initials: 'JL', name: 'James Lee',     type: 'Other',          startHour: 10,   endHour: 11,   dayIndex: 6, venue: 'Campus' },
  { id: 7,  initials: 'AT', name: 'Ave Tyler',      type: 'Consultation',   startHour: 18,   endHour: 19,   dayIndex: 3, venue: 'Zoom' },
  { id: 8,  initials: 'LK', name: 'Liam Kay',      type: 'Consultation',   startHour: 6,    endHour: 7,    dayIndex: 5, venue: 'Teams' },
  // ── MMI Practice sessions from MMI Coaching ──────────────────────────────
  { id: 9,  initials: 'AY', name: 'Amina Yusuf',   type: 'MMI Prep',       startHour: 14,   endHour: 15,   dayIndex: 2, venue: 'Zoom' },
  { id: 10, initials: 'DM', name: 'Daniel Musa',   type: 'MMI Prep',       startHour: 15.5, endHour: 16.5, dayIndex: 2, venue: 'Zoom' },
  { id: 11, initials: 'FB', name: 'Fatima Bello',  type: 'MMI Prep',       startHour: 9,    endHour: 10,   dayIndex: 3, venue: 'Teams' },
  { id: 12, initials: 'IA', name: 'Ibrahim Ali',   type: 'MMI Prep',       startHour: 11.5, endHour: 12.5, dayIndex: 3, venue: 'Teams' },
  { id: 13, initials: 'MO', name: 'Maryam Okafor', type: 'MMI Prep',       startHour: 10,   endHour: 11,   dayIndex: 4, venue: 'Zoom' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_DATES = [21, 22, 23, 24, 25, 26, 27];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM – 8 PM
const HOUR_HEIGHT = 60; // px per hour

function formatHour(h: number) {
  const hh = Math.floor(h);
  const mm = (h % 1) * 60;
  const ampm = hh < 12 ? 'AM' : 'PM';
  const display = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh;
  return mm === 0 ? `${display} ${ampm}` : `${display}:${String(mm).padStart(2,'0')} ${ampm}`;
}

function formatHourRange(s: number, e: number) {
  return `${formatHour(s)} – ${formatHour(e)}`;
}

// ── Session block (week view) ─────────────────────────────────────────────────
function SessionBlock({ session, topPx, heightPx, onClick }: {
  session: Session; topPx: number; heightPx: number;
  onClick: (s: Session) => void;
}) {
  const c = TYPE_COLORS[session.type];
  const av = AVATAR_COLORS[session.initials] ?? 'bg-slate-500';
  return (
    <button
      onClick={() => onClick(session)}
      className={`absolute inset-x-1 rounded-xl border px-2 py-1.5 text-left transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] overflow-hidden ${c.bg} ${c.border}`}
      style={{ top: topPx, height: Math.max(heightPx, 44) }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className={`w-5 h-5 rounded-full ${av} flex items-center justify-center text-[8px] font-bold text-white shrink-0`}>
          {session.initials}
        </div>
        <p className={`text-[10px] font-bold truncate ${c.text}`}>{session.name}</p>
      </div>
      {heightPx > 52 && (
        <p className={`text-[9px] font-medium truncate ${c.text} opacity-80`}>{session.type}</p>
      )}
    </button>
  );
}

// ── Month cell sessions ───────────────────────────────────────────────────────
function MonthSessionPill({ session }: { session: Session }) {
  const c = TYPE_COLORS[session.type];
  return (
    <div className={`w-full rounded-md px-1.5 py-0.5 mb-0.5 text-[9px] font-semibold truncate ${c.bg} ${c.text}`}>
      {session.name}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ViewCalendarPage() {
  const [view, setView] = useState<ViewMode>('Week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<Session | null>(null);

  const weekLabel = weekOffset === 0
    ? 'May 21 – 26, 2026'
    : weekOffset === 1 ? 'May 27 – Jun 2, 2026'
    : weekOffset === -1 ? 'May 14 – 20, 2026'
    : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`;

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
              Upcoming Sessions
            </h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              View and manage your upcoming counseling sessions.
            </p>
          </div>
          <Link
            href="/counselor/schedule-session"
            className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all shrink-0"
          >
            <Plus size={14} /> Add Schedule Session
          </Link>
        </div>

        {/* ── Two-column layout ──────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 items-start">

          {/* ── Calendar area ─────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

            {/* Calendar toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/5">
              {/* Left: today + nav + date */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWeekOffset(0)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  Today
                </button>
                <button
                  onClick={() => setWeekOffset(o => o - 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => setWeekOffset(o => o + 1)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center border border-gray-200 dark:border-white/10 text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                >
                  <ChevronRight size={14} />
                </button>
                <span className="text-sm font-bold text-slate-700 dark:text-white ml-1 whitespace-nowrap">
                  {weekLabel}
                </span>
              </div>

              {/* Right: view mode tabs */}
              <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/6 rounded-xl p-1">
                {(['Agenda', 'Week', 'Month', 'Day'] as ViewMode[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                      view === v
                        ? 'bg-white dark:bg-[#1d2133] text-cyan-600 dark:text-cyan-400 shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── WEEK VIEW ─── */}
            {view === 'Week' && (
              <div className="overflow-auto">
                {/* Day header row */}
                <div className="grid border-b border-gray-100 dark:border-white/5" style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }}>
                  <div className="border-r border-gray-100 dark:border-white/5" />
                  {DAYS.map((day, di) => (
                    <div key={di} className={`py-3 text-center border-r border-gray-100 dark:border-white/5 last:border-r-0 ${di === 3 ? 'bg-cyan-50 dark:bg-cyan-500/5' : ''}`}>
                      <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{day.slice(0,3)} {DAY_DATES[di]}</p>
                    </div>
                  ))}
                </div>

                {/* Time grid */}
                <div className="relative" style={{ minWidth: 600 }}>
                  <div style={{ gridTemplateColumns: '52px repeat(7, 1fr)' }} className="grid">
                    {/* Time labels */}
                    <div className="border-r border-gray-100 dark:border-white/5">
                      {HOURS.map(h => (
                        <div key={h} className="flex items-start justify-end pr-2 border-b border-gray-50 dark:border-white/4 text-[10px] text-slate-400 dark:text-[#8e92ad] font-medium" style={{ height: HOUR_HEIGHT }}>
                          <span className="-mt-2">{h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h-12}pm`}</span>
                        </div>
                      ))}
                    </div>

                    {/* Day columns */}
                    {DAYS.map((_, di) => {
                      const daySessions = SESSIONS.filter(s => s.dayIndex === di);
                      return (
                        <div
                          key={di}
                          className={`relative border-r border-gray-100 dark:border-white/5 last:border-r-0 ${di === 3 ? 'bg-cyan-50/40 dark:bg-cyan-500/[0.03]' : ''}`}
                          style={{ height: HOURS.length * HOUR_HEIGHT }}
                        >
                          {/* Hour grid lines */}
                          {HOURS.map((_, hi) => (
                            <div key={hi} className="absolute inset-x-0 border-b border-gray-50 dark:border-white/4" style={{ top: hi * HOUR_HEIGHT }} />
                          ))}
                          {/* Sessions */}
                          {daySessions.map(session => {
                            const topPx = (session.startHour - HOURS[0]) * HOUR_HEIGHT;
                            const heightPx = (session.endHour - session.startHour) * HOUR_HEIGHT;
                            return (
                              <SessionBlock
                                key={session.id}
                                session={session}
                                topPx={topPx}
                                heightPx={heightPx}
                                onClick={setSelected}
                              />
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ─── MONTH VIEW ─── */}
            {view === 'Month' && (
              <div>
                {/* Month grid header */}
                <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5">
                  {DAYS.map(d => (
                    <div key={d} className="py-2.5 text-center text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider border-r last:border-r-0 border-gray-100 dark:border-white/5">
                      {d.slice(0,3)}
                    </div>
                  ))}
                </div>
                {/* 5 week rows */}
                {Array.from({ length: 5 }).map((_, week) => (
                  <div key={week} className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5 last:border-b-0" style={{ minHeight: 100 }}>
                    {DAYS.map((_, di) => {
                      const dayNum = week * 7 + di + 1;
                      const daySessions = SESSIONS.filter(s => s.dayIndex === di && (week === 2));
                      const isToday = week === 2 && di === 3;
                      return (
                        <div key={di} className={`p-2 border-r last:border-r-0 border-gray-100 dark:border-white/5 ${isToday ? 'bg-cyan-50 dark:bg-cyan-500/5' : ''}`}>
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mb-1 ${
                            isToday ? 'bg-cyan-600 text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {dayNum <= 31 ? dayNum : dayNum - 31}
                          </div>
                          {daySessions.slice(0,2).map(s => (
                            <MonthSessionPill key={s.id} session={s} />
                          ))}
                          {daySessions.length > 2 && (
                            <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] font-semibold">+{daySessions.length - 2} more</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

            {/* ─── DAY VIEW ─── */}
            {view === 'Day' && (
              <div className="overflow-auto">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                  <p className="text-sm font-bold text-slate-700 dark:text-white">Thursday 15, May 2026</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{SESSIONS.filter(s => s.dayIndex === 3).length} sessions scheduled</p>
                </div>
                <div className="relative" style={{ minWidth: 300 }}>
                  <div className="grid" style={{ gridTemplateColumns: '52px 1fr' }}>
                    <div className="border-r border-gray-100 dark:border-white/5">
                      {HOURS.map(h => (
                        <div key={h} className="flex items-start justify-end pr-2 border-b border-gray-50 dark:border-white/4 text-[10px] text-slate-400 dark:text-[#8e92ad]" style={{ height: HOUR_HEIGHT }}>
                          <span className="-mt-2">{h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h-12}pm`}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                      {HOURS.map((_, hi) => (
                        <div key={hi} className="absolute inset-x-0 border-b border-gray-50 dark:border-white/4" style={{ top: hi * HOUR_HEIGHT }} />
                      ))}
                      {SESSIONS.filter(s => s.dayIndex === 3).map(session => {
                        const topPx = (session.startHour - HOURS[0]) * HOUR_HEIGHT;
                        const heightPx = (session.endHour - session.startHour) * HOUR_HEIGHT;
                        return (
                          <SessionBlock key={session.id} session={session} topPx={topPx} heightPx={heightPx} onClick={setSelected} />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─── AGENDA VIEW ─── */}
            {view === 'Agenda' && (
              <div className="divide-y divide-gray-50 dark:divide-white/5">
                {SESSIONS.slice().sort((a,b) => a.dayIndex - b.dayIndex || a.startHour - b.startHour).map(session => {
                  const c = TYPE_COLORS[session.type];
                  const av = AVATAR_COLORS[session.initials] ?? 'bg-slate-500';
                  return (
                    <button
                      key={session.id}
                      onClick={() => setSelected(session)}
                      className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors text-left"
                    >
                      <div className="text-center shrink-0 w-14">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase">{DAYS[session.dayIndex].slice(0,3)}</p>
                        <p className="text-lg font-bold text-slate-800 dark:text-white">{DAY_DATES[session.dayIndex]}</p>
                      </div>
                      <div className={`w-1 self-stretch rounded-full shrink-0 ${c.dot}`} />
                      <div className={`w-9 h-9 rounded-xl ${av} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                        {session.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 dark:text-white">{session.name}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#8e92ad]">
                            <Clock size={10} /> {formatHourRange(session.startHour, session.endHour)}
                          </span>
                          {session.venue && (
                            <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#8e92ad]">
                              <MapPin size={10} /> {session.venue}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${c.bg} ${c.text}`}>
                        {session.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────── */}
          <div className="space-y-4">

            {/* Upcoming session spotlight */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Upcoming Session</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">PM</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">Priya Mehta</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">Essay Review</p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} className="text-slate-400 shrink-0" />
                  Today, 4:00 PM – 5:00 PM
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <MapPin size={12} className="text-slate-400 shrink-0" />
                  McGill University
                </div>
              </div>
              <button className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                View Session Details
              </button>
            </div>

            {/* Session Types legend */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Session Types</h3>
              <div className="space-y-2.5">
                {Object.entries(TYPE_COLORS).map(([type, c]) => (
                  <div key={type} className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${c.dot}`} />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{type}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Legend tips */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Calendar Legend</h3>
              <ul className="space-y-2">
                {[
                  'Click on a session to view details',
                  'Drag and drop to reschedule',
                  'All times are in your local time zone',
                ].map((tip, i) => (
                  <li key={i} className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-snug flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-white/20 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
                <li className="text-[11px] text-slate-500 dark:text-[#8e92ad] leading-snug flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-slate-400 dark:bg-white/20 mt-1.5 shrink-0" />
                  You can schedule sessions from the{' '}
                  <Link href="/counselor/schedule-session" className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 font-medium">
                    Schedule Session
                  </Link>{' '}button
                </li>
              </ul>
            </div>

            {/* Export Calendar */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Export Calendar</h3>
              <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-3">Download your upcoming sessions calendar.</p>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/8 transition-all">
                <Download size={13} /> Export Calendar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Session detail modal ───────────────────────── */}
      {selected && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
          />
          <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white dark:bg-[#1d2133] rounded-2xl border border-gray-100 dark:border-white/8 shadow-2xl p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl ${AVATAR_COLORS[selected.initials] ?? 'bg-slate-500'} flex items-center justify-center text-white text-sm font-bold`}>
                  {selected.initials}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selected.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[selected.type].bg} ${TYPE_COLORS[selected.type].text}`}>
                    {selected.type}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg leading-none">✕</button>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-5">
              <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                {DAYS[selected.dayIndex]}, May {DAY_DATES[selected.dayIndex]}, 2026
              </div>
              <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                <Clock size={14} className="text-slate-400 shrink-0" />
                {formatHourRange(selected.startHour, selected.endHour)}
              </div>
              {selected.venue && (
                <div className="flex items-center gap-2.5 text-sm text-slate-600 dark:text-slate-300">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  {selected.venue}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5">
              <a
                href="https://zoom.us/join"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-bold transition-all"
              >
                Join Session
              </a>
              <button
                onClick={() => setSelected(null)}
                className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/8 transition-all"
              >
                Reschedule
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
