'use client';

import { useMemo, useState } from 'react';
import {
  ChevronLeft, ChevronRight, Calendar, Clock, MapPin, Video, X, CalendarDays,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { useSessionPaymentRequests, type SessionPaymentRequest } from '@/src/lib/sessionPayments';

// ── Types ─────────────────────────────────────────────────────────────────────
type ViewMode = 'Agenda' | 'Week' | 'Month' | 'Day';
type SessionType = 'Sponsorship Help' | 'Interview Prep' | 'Consultation' | 'C of Q / Red Seal' | 'Other';

interface BookedSession {
  id: number;
  initials: string;
  mentor: string;
  title: string;          // mentor short title
  type: SessionType;
  startHour: number;      // 15.0 = 3:00 PM
  endHour: number;
  dayIndex: number;       // 0 = Mon … 6 = Sun
  venue: string;
  format: 'Virtual' | 'In-person';
}

// ── Colour maps ───────────────────────────────────────────────────────────────
const TYPE_COLORS: Record<SessionType, { bg: string; border: string; dot: string; text: string }> = {
  'Sponsorship Help':  { bg: 'bg-blue-50 dark:bg-blue-500/20',     border: 'border-blue-300 dark:border-blue-500/40',     dot: 'bg-blue-500',     text: 'text-blue-700 dark:text-blue-300'     },
  'Interview Prep':    { bg: 'bg-violet-50 dark:bg-violet-500/20', border: 'border-violet-300 dark:border-violet-500/40', dot: 'bg-violet-500',   text: 'text-violet-700 dark:text-violet-300' },
  'Consultation':      { bg: 'bg-emerald-50 dark:bg-emerald-500/20', border: 'border-emerald-300 dark:border-emerald-500/40', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300' },
  'C of Q / Red Seal': { bg: 'bg-amber-50 dark:bg-amber-500/20',   border: 'border-amber-300 dark:border-amber-500/40',   dot: 'bg-amber-500',    text: 'text-amber-700 dark:text-amber-300'   },
  'Other':             { bg: 'bg-slate-100 dark:bg-white/8',       border: 'border-slate-300 dark:border-white/15',       dot: 'bg-slate-400',    text: 'text-slate-600 dark:text-slate-300'   },
};

const AVATAR_COLORS: Record<string, string> = {
  DB: 'bg-blue-500', ML: 'bg-emerald-500', GS: 'bg-amber-500',
  SM: 'bg-violet-500', LC: 'bg-rose-500', TW: 'bg-cyan-500',
};

// ── Booked-session data (student's own bookings) ───────────────────────────────
const SESSIONS: BookedSession[] = [
  { id: 1, initials: 'DB', mentor: 'Daniel Brooks', title: 'Red Seal Electrician',   type: 'C of Q / Red Seal', startHour: 16,   endHour: 17,   dayIndex: 0, venue: 'Zoom',    format: 'Virtual' },
  { id: 2, initials: 'DB', mentor: 'Daniel Brooks', title: 'Red Seal Electrician',   type: 'Sponsorship Help',  startHour: 15,   endHour: 16,   dayIndex: 1, venue: 'Zoom',    format: 'Virtual' },
  { id: 3, initials: 'SM', mentor: 'Sarah Mitchell', title: 'Admissions Advisor',    type: 'Consultation',      startHour: 14,   endHour: 14.75, dayIndex: 2, venue: 'Teams',  format: 'Virtual' },
  { id: 4, initials: 'LC', mentor: 'Linda Chen',     title: 'College Admissions',    type: 'Consultation',      startHour: 13,   endHour: 13.75, dayIndex: 3, venue: 'Video call', format: 'Virtual' },
  { id: 5, initials: 'GS', mentor: 'Gurpreet Singh', title: 'Welding Mentor · CWB',  type: 'C of Q / Red Seal', startHour: 19.5, endHour: 20.5, dayIndex: 3, venue: 'Teams',   format: 'Virtual' },
  { id: 6, initials: 'ML', mentor: 'Marie Lavoie',   title: 'Automotive Tech',       type: 'Interview Prep',    startHour: 10,   endHour: 11,   dayIndex: 4, venue: 'CCQ Montréal', format: 'In-person' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DAY_DATES = [15, 16, 17, 18, 19, 20, 21];
const TODAY_INDEX = 1; // Tuesday, Jun 16 2026
const WEEK_START = new Date(2026, 5, 15); // Monday, Jun 15 2026 — anchors the displayed week

const VALID_TYPES: SessionType[] = ['Sponsorship Help', 'Interview Prep', 'Consultation', 'C of Q / Red Seal'];

// Parse a stored date (local YYYY-MM-DD, or a full ISO string as a fallback)
// into a local day, avoiding UTC day-boundary drift.
function parseLocalDate(s: string): Date {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const d = new Date(s);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// A parent-paid request becomes a real session on the student's calendar.
// Pending (unpaid) requests are excluded, as are sessions whose real date
// falls outside the displayed week (this demo renders a single fixed week) —
// they are never coerced onto the wrong day.
function requestToSession(req: SessionPaymentRequest, idx: number): BookedSession | null {
  const dayStart = parseLocalDate(req.dateISO);
  const diffDays = Math.round((dayStart.getTime() - WEEK_START.getTime()) / 86400000);
  if (diffDays < 0 || diffDays > 6) return null;
  const type: SessionType = VALID_TYPES.includes(req.type as SessionType)
    ? (req.type as SessionType)
    : 'Other';
  return {
    id: 1000 + idx,
    initials: req.avatar,
    mentor: req.counselorName,
    title: req.counselorTitle,
    type,
    startHour: req.startHour,
    endHour: req.startHour + 1,
    dayIndex: diffDays,
    venue: 'Zoom',
    format: 'Virtual',
  };
}
const HOURS = Array.from({ length: 15 }, (_, i) => i + 6); // 6 AM – 8 PM
const HOUR_HEIGHT = 56;

function formatHour(h: number) {
  const hh = Math.floor(h);
  const mm = (h % 1) * 60;
  const ampm = hh < 12 ? 'AM' : 'PM';
  const display = hh > 12 ? hh - 12 : hh === 0 ? 12 : hh;
  return mm === 0 ? `${display}:00 ${ampm}` : `${display}:${String(mm).padStart(2, '0')} ${ampm}`;
}

function formatHourRange(s: number, e: number) {
  return `${formatHour(s)} – ${formatHour(e)}`;
}

// ── Session block (week / day view) ────────────────────────────────────────────
function SessionBlock({ session, topPx, heightPx, onClick }: {
  session: BookedSession; topPx: number; heightPx: number;
  onClick: (s: BookedSession) => void;
}) {
  const c = TYPE_COLORS[session.type];
  const av = AVATAR_COLORS[session.initials] ?? 'bg-slate-500';
  return (
    <button
      onClick={() => onClick(session)}
      className={`absolute inset-x-1 rounded-xl border px-2 py-1.5 text-left transition-all hover:shadow-md hover:scale-[1.01] active:scale-[0.99] overflow-hidden ${c.bg} ${c.border}`}
      style={{ top: topPx, height: Math.max(heightPx, 42) }}
    >
      <div className="flex items-center gap-1.5 mb-0.5">
        <div className={`w-5 h-5 rounded-full ${av} flex items-center justify-center text-[8px] font-bold text-white shrink-0`}>
          {session.initials}
        </div>
        <p className={`text-[10px] font-bold truncate ${c.text}`}>{session.mentor}</p>
      </div>
      {heightPx > 50 && (
        <p className={`text-[9px] font-medium truncate ${c.text} opacity-80`}>{session.type}</p>
      )}
    </button>
  );
}

function MonthSessionPill({ session, onClick }: { session: BookedSession; onClick: (s: BookedSession) => void }) {
  const c = TYPE_COLORS[session.type];
  return (
    <button
      onClick={() => onClick(session)}
      className={`w-full rounded-md px-1.5 py-0.5 mb-0.5 text-[9px] font-semibold truncate text-left ${c.bg} ${c.text}`}
    >
      {session.mentor}
    </button>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function BookedSessionsCalendar() {
  const [view, setView] = useState<ViewMode>('Week');
  const [weekOffset, setWeekOffset] = useState(0);
  const [selected, setSelected] = useState<BookedSession | null>(null);

  // Parent-paid session requests appear here; pending ones do not.
  const requests = useSessionPaymentRequests();
  const allSessions = useMemo(() => {
    const paid = requests
      .filter(r => r.status === 'paid')
      .map((r, i) => requestToSession(r, i))
      .filter((s): s is BookedSession => s !== null);
    return [...SESSIONS, ...paid];
  }, [requests]);

  const weekLabel = weekOffset === 0
    ? 'Jun 15 – 21, 2026'
    : weekOffset === 1 ? 'Jun 22 – 28, 2026'
    : weekOffset === -1 ? 'Jun 8 – 14, 2026'
    : `Week ${weekOffset > 0 ? '+' : ''}${weekOffset}`;

  const sortedSessions = useMemo(
    () => allSessions.slice().sort((a, b) => a.dayIndex - b.dayIndex || a.startHour - b.startHour),
    [allSessions],
  );

  const nextSession = useMemo(() => {
    const upcoming = sortedSessions.filter(
      s => s.dayIndex > TODAY_INDEX || (s.dayIndex === TODAY_INDEX),
    );
    return upcoming[0] ?? sortedSessions[0];
  }, [sortedSessions]);

  const c = nextSession ? TYPE_COLORS[nextSession.type] : null;

  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

      {/* ── Section header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-5 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/15 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">My Booked Sessions</h2>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">All your scheduled counselling and mentoring sessions.</p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-500/20">
          {allSessions.length} upcoming
        </span>
      </div>

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-0 xl:gap-5 items-start px-5 pb-5">

        {/* ── Calendar area ── */}
        <div className="min-w-0 rounded-2xl border border-gray-100 dark:border-white/6 overflow-hidden">

          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-gray-100 dark:border-white/5">
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

            <div className="flex items-center gap-0.5 bg-gray-100 dark:bg-white/6 rounded-xl p-1">
              {(['Agenda', 'Week', 'Month', 'Day'] as ViewMode[]).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    view === v
                      ? 'bg-white dark:bg-[#1d2133] text-blue-600 dark:text-blue-400 shadow-sm'
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
              <div className="grid border-b border-gray-100 dark:border-white/5" style={{ gridTemplateColumns: '52px repeat(7, minmax(72px, 1fr))' }}>
                <div className="border-r border-gray-100 dark:border-white/5" />
                {DAYS.map((day, di) => (
                  <div key={di} className={`py-3 text-center border-r border-gray-100 dark:border-white/5 last:border-r-0 ${di === TODAY_INDEX ? 'bg-blue-50 dark:bg-blue-500/5' : ''}`}>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{day.slice(0, 3)} {DAY_DATES[di]}</p>
                  </div>
                ))}
              </div>

              <div className="relative" style={{ minWidth: 600 }}>
                <div style={{ gridTemplateColumns: '52px repeat(7, minmax(72px, 1fr))' }} className="grid">
                  <div className="border-r border-gray-100 dark:border-white/5">
                    {HOURS.map(h => (
                      <div key={h} className="flex items-start justify-end pr-2 border-b border-gray-50 dark:border-white/4 text-[10px] text-slate-400 dark:text-[#8e92ad] font-medium" style={{ height: HOUR_HEIGHT }}>
                        <span className="-mt-2">{h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}</span>
                      </div>
                    ))}
                  </div>

                  {DAYS.map((_, di) => {
                    const daySessions = allSessions.filter(s => s.dayIndex === di);
                    return (
                      <div
                        key={di}
                        className={`relative border-r border-gray-100 dark:border-white/5 last:border-r-0 ${di === TODAY_INDEX ? 'bg-blue-50/40 dark:bg-blue-500/[0.03]' : ''}`}
                        style={{ height: HOURS.length * HOUR_HEIGHT }}
                      >
                        {HOURS.map((_, hi) => (
                          <div key={hi} className="absolute inset-x-0 border-b border-gray-50 dark:border-white/4" style={{ top: hi * HOUR_HEIGHT }} />
                        ))}
                        {daySessions.map(session => (
                          <SessionBlock
                            key={session.id}
                            session={session}
                            topPx={(session.startHour - HOURS[0]) * HOUR_HEIGHT}
                            heightPx={(session.endHour - session.startHour) * HOUR_HEIGHT}
                            onClick={setSelected}
                          />
                        ))}
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
              <div className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5">
                {DAYS.map(d => (
                  <div key={d} className="py-2.5 text-center text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider border-r last:border-r-0 border-gray-100 dark:border-white/5">
                    {d.slice(0, 3)}
                  </div>
                ))}
              </div>
              {Array.from({ length: 5 }).map((_, week) => (
                <div key={week} className="grid grid-cols-7 border-b border-gray-100 dark:border-white/5 last:border-b-0" style={{ minHeight: 92 }}>
                  {DAYS.map((_, di) => {
                    const dayNum = week * 7 + di + 1; // Jun 1 2026 is a Monday (week 0, di 0)
                    const inMonth = dayNum >= 1 && dayNum <= 30;
                    const daySessions = week === 2 ? allSessions.filter(s => s.dayIndex === di) : [];
                    const isToday = week === 2 && di === TODAY_INDEX;
                    return (
                      <div key={di} className={`p-2 border-r last:border-r-0 border-gray-100 dark:border-white/5 ${isToday ? 'bg-blue-50 dark:bg-blue-500/5' : ''}`}>
                        {inMonth && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mb-1 ${
                            isToday ? 'bg-blue-600 text-white' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {dayNum}
                          </div>
                        )}
                        {daySessions.slice(0, 2).map(s => (
                          <MonthSessionPill key={s.id} session={s} onClick={setSelected} />
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
                <p className="text-sm font-bold text-slate-700 dark:text-white">Tuesday, Jun 16, 2026</p>
                <p className="text-xs text-slate-400 dark:text-[#8e92ad]">
                  {allSessions.filter(s => s.dayIndex === TODAY_INDEX).length} session(s) scheduled
                </p>
              </div>
              <div className="relative" style={{ minWidth: 300 }}>
                <div className="grid" style={{ gridTemplateColumns: '52px 1fr' }}>
                  <div className="border-r border-gray-100 dark:border-white/5">
                    {HOURS.map(h => (
                      <div key={h} className="flex items-start justify-end pr-2 border-b border-gray-50 dark:border-white/4 text-[10px] text-slate-400 dark:text-[#8e92ad]" style={{ height: HOUR_HEIGHT }}>
                        <span className="-mt-2">{h < 12 ? `${h}am` : h === 12 ? '12pm' : `${h - 12}pm`}</span>
                      </div>
                    ))}
                  </div>
                  <div className="relative" style={{ height: HOURS.length * HOUR_HEIGHT }}>
                    {HOURS.map((_, hi) => (
                      <div key={hi} className="absolute inset-x-0 border-b border-gray-50 dark:border-white/4" style={{ top: hi * HOUR_HEIGHT }} />
                    ))}
                    {allSessions.filter(s => s.dayIndex === TODAY_INDEX).map(session => (
                      <SessionBlock
                        key={session.id}
                        session={session}
                        topPx={(session.startHour - HOURS[0]) * HOUR_HEIGHT}
                        heightPx={(session.endHour - session.startHour) * HOUR_HEIGHT}
                        onClick={setSelected}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── AGENDA VIEW ─── */}
          {view === 'Agenda' && (
            <div className="divide-y divide-gray-50 dark:divide-white/5">
              {sortedSessions.map(session => {
                const tc = TYPE_COLORS[session.type];
                const av = AVATAR_COLORS[session.initials] ?? 'bg-slate-500';
                return (
                  <button
                    key={session.id}
                    onClick={() => setSelected(session)}
                    className="w-full flex items-center gap-4 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors text-left"
                  >
                    <div className="text-center shrink-0 w-12">
                      <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase">{DAYS[session.dayIndex].slice(0, 3)}</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">{DAY_DATES[session.dayIndex]}</p>
                    </div>
                    <div className={`w-1 self-stretch rounded-full shrink-0 ${tc.dot}`} />
                    <div className={`w-9 h-9 rounded-xl ${av} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                      {session.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{session.mentor}</p>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#8e92ad]">
                          <Clock size={10} /> {formatHourRange(session.startHour, session.endHour)}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#8e92ad]">
                          {session.format === 'Virtual' ? <Video size={10} /> : <MapPin size={10} />} {session.venue}
                        </span>
                      </div>
                    </div>
                    <span className={`hidden sm:inline text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${tc.bg} ${tc.text}`}>
                      {session.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4 mt-4 xl:mt-0">

          {/* Next session spotlight */}
          {nextSession && c && (
            <div className="rounded-2xl border border-gray-100 dark:border-white/6 p-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Next Session</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-11 h-11 rounded-xl ${AVATAR_COLORS[nextSession.initials] ?? 'bg-slate-500'} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {nextSession.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{nextSession.mentor}</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] truncate">{nextSession.type}</p>
                </div>
              </div>
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Calendar size={12} className="text-slate-400 shrink-0" />
                  {DAYS[nextSession.dayIndex]}, Jun {DAY_DATES[nextSession.dayIndex]}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <Clock size={12} className="text-slate-400 shrink-0" />
                  {formatHourRange(nextSession.startHour, nextSession.endHour)}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {nextSession.format === 'Virtual' ? <Video size={12} className="text-slate-400 shrink-0" /> : <MapPin size={12} className="text-slate-400 shrink-0" />}
                  {nextSession.venue}
                </div>
              </div>
              <button
                onClick={() => setSelected(nextSession)}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all"
              >
                View Session Details
              </button>
            </div>
          )}

          {/* Session Types legend */}
          <div className="rounded-2xl border border-gray-100 dark:border-white/6 p-4">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Session Types</h3>
            <div className="space-y-2.5">
              {(Object.keys(TYPE_COLORS) as SessionType[]).map(type => (
                <div key={type} className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${TYPE_COLORS[type].dot}`} />
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Session details dialog ── */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
          {selected && (
            <>
              <DialogTitle className="sr-only">{selected.type} with {selected.mentor}</DialogTitle>
              <DialogDescription className="sr-only">Booked session details for your {selected.type} session with {selected.mentor}.</DialogDescription>
              <div className={`px-5 py-4 ${TYPE_COLORS[selected.type].bg} border-b ${TYPE_COLORS[selected.type].border}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/70 dark:bg-black/20 ${TYPE_COLORS[selected.type].text}`}>
                    {selected.type}
                  </span>
                  <DialogClose className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
                    <X size={15} />
                  </DialogClose>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <div className={`w-12 h-12 rounded-2xl ${AVATAR_COLORS[selected.initials] ?? 'bg-slate-500'} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {selected.initials}
                  </div>
                  <div>
                    <p className="text-base font-bold text-slate-900 dark:text-white">{selected.mentor}</p>
                    <p className="text-xs text-slate-500 dark:text-[#8e92ad]">{selected.title}</p>
                  </div>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Calendar size={15} className="text-slate-400 shrink-0" />
                  {DAYS[selected.dayIndex]}, June {DAY_DATES[selected.dayIndex]}, 2026
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <Clock size={15} className="text-slate-400 shrink-0" />
                  {formatHourRange(selected.startHour, selected.endHour)}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  {selected.format === 'Virtual' ? <Video size={15} className="text-slate-400 shrink-0" /> : <MapPin size={15} className="text-slate-400 shrink-0" />}
                  {selected.venue} · {selected.format}
                </div>
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all">
                    {selected.format === 'Virtual' ? 'Join Session' : 'Get Directions'}
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
