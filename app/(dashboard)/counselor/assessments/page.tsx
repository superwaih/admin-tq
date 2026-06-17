'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, ClipboardList, CheckCircle2, Clock } from 'lucide-react';
import AssessmentSummaryCard from '@/src/components/assessment/AssessmentSummaryCard';
import { STUDENTS } from '@/src/lib/sample-data';

interface Row { id: string; name: string; initials: string; grade: string; }

// Drive the roster from the canonical counselor student records. `id` is the
// user id the student's assessment data is stored under (so Done/Pending badges
// and the detail card resolve real data), falling back to the record id.
const ROSTER: Row[] = STUDENTS.map((s) => ({
  id: s.assessmentUserId ?? s.id,
  name: s.name,
  initials: s.initials,
  grade: s.province,
}));

function initialsFrom(id: string): string {
  return id.replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase() || 'ST';
}

export default function CounselorAssessmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const studentIdParam = searchParams.get('studentId');

  const [q, setQ] = useState('');
  // Real completion status per student id, fetched from the API.
  const [statusMap, setStatusMap] = useState<Record<string, boolean>>({});

  // If a studentId is supplied that isn't in the roster, surface it as a row so
  // counselors can view any student's stored assessment by id.
  const roster = useMemo<Row[]>(() => {
    if (studentIdParam && !ROSTER.some((s) => s.id === studentIdParam)) {
      return [{ id: studentIdParam, name: studentIdParam, initials: initialsFrom(studentIdParam), grade: '—' }, ...ROSTER];
    }
    return ROSTER;
  }, [studentIdParam]);

  const selected = useMemo<Row>(
    () => roster.find((s) => s.id === studentIdParam) ?? roster[0],
    [roster, studentIdParam],
  );

  // Fetch real completion status for every roster student in one batch request
  // (avoids the N+1 of one /api/assessment/status call per student).
  useEffect(() => {
    let active = true;
    const ids = roster.map((s) => s.id);
    fetch('/api/assessment/statuses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: ids }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!active) return;
        const statuses: Record<string, { completed?: boolean }> = d?.statuses ?? {};
        setStatusMap(Object.fromEntries(ids.map((id) => [id, Boolean(statuses[id]?.completed)])));
      })
      .catch(() => {
        if (active) setStatusMap(Object.fromEntries(ids.map((id) => [id, false])));
      });
    return () => { active = false; };
  }, [roster]);

  const select = (id: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('studentId', id);
    router.replace(`?${params.toString()}`);
  };

  const filtered = roster.filter((s) => s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1200px] mx-auto space-y-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Potential Assessments</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">
            Review each student&apos;s completed personality &amp; potential assessment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-5 items-start">
          {/* Student list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search students…"
                className="w-full h-9 pl-9 pr-3 text-xs rounded-xl bg-gray-50 border border-gray-200 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50"
              />
            </div>
            <div className="space-y-1">
              {filtered.map((s) => {
                const active = s.id === selected?.id;
                const done = statusMap[s.id];
                return (
                  <button
                    key={s.id}
                    onClick={() => select(s.id)}
                    className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                      active ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{s.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.grade}</p>
                    </div>
                    {done ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600"><CheckCircle2 size={12} /> Done</span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-[#8e92ad]"><Clock size={12} /> Pending</span>
                    )}
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <p className="text-xs text-slate-400 dark:text-[#8e92ad] text-center py-6">No students found.</p>
              )}
            </div>
          </div>

          {/* Detail */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardList size={15} className="text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{selected.name}&apos;s Assessment</h2>
            </div>
            <AssessmentSummaryCard userId={selected.id} showRetake={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
