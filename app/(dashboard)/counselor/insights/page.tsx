'use client';

import { TrendingUp, Minus, Users, ChartBar as BarChart2 } from 'lucide-react';
import { STUDENTS, PROGRAMS } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';

const avgTop6 = (STUDENTS.reduce((s, st) => s + st.avgGrade, 0) / STUDENTS.length).toFixed(1);
const avgProb = Math.round(STUDENTS.reduce((s, st) => s + st.avgProbability, 0) / STUDENTS.length);

export default function InsightsPage() {
  return (
    <div className="p-5 flex flex-col gap-5 max-w-[900px]">
      <div>
        <h1 className="text-[18px] font-bold tracking-tight text-ink">AI insights</h1>
        <p className="text-xs text-ink-3 mt-0.5">AdmitIQ analysis · cohort vs national benchmarks</p>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Cohort avg grade', value: avgTop6 + '%', sub: 'Top 6 · all students', color: 'text-ink' },
          { label: 'Avg probability', value: avgProb + '%', sub: 'across all programs', color: 'text-emerald' },
          { label: 'At-risk students', value: STUDENTS.filter(s => s.riskLevel === 'hi').length.toString(), sub: 'high risk tier', color: 'text-rose' },
          { label: 'Programs tracked', value: STUDENTS.reduce((s, st) => s + st.programCount, 0).toString(), sub: 'across ' + STUDENTS.length + ' students', color: 'text-brand' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface border border-[var(--line)] rounded-r-md rounded-b-md p-3.5 shadow-card">
            <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4 mb-1">{stat.label}</div>
            <div className={cn('text-2xl font-bold font-tabular', stat.color)}>{stat.value}</div>
            <div className="text-[11px] text-ink-3 mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_320px] gap-5">
        <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2 flex items-center gap-2">
            <BarChart2 size={13} className="text-ink-4" />
            <span className="text-xs font-semibold text-ink">Program demand vs cohort strength</span>
          </div>
          <div className="divide-y divide-[var(--line)]">
            {PROGRAMS.map((p) => {
              const bar = p.probability >= 70 ? 'bg-emerald' : p.probability >= 40 ? 'bg-saffron' : 'bg-rose';
              const color = p.probability >= 70 ? 'text-emerald' : p.probability >= 40 ? 'text-saffron' : 'text-rose';
              const TrendIcon = p.trend ? TrendingUp : Minus;
              return (
                <div key={p.id} className="px-4 py-3.5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-semibold text-ink">{p.name}</div>
                      <div className="text-[11px] text-ink-4">{p.university} · {p.admissionAvgRange}</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon size={12} className={p.trend ? 'text-emerald' : 'text-ink-4'} />
                      <span className={cn('text-sm font-bold font-tabular', color)}>{p.probability}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', bar)} style={{ width: p.probability + '%' }} />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-ink-4">
                    <span>{p.confidenceProfiles} peer profiles</span>
                    <span>{p.supplementalType ?? 'No supplemental'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2 flex items-center gap-2">
              <Users size={13} className="text-ink-4" />
              <span className="text-xs font-semibold text-ink">Risk distribution</span>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {[
                { label: 'High risk', count: STUDENTS.filter(s => s.riskLevel === 'hi').length, color: 'bg-rose', textColor: 'text-rose' },
                { label: 'Medium risk', count: STUDENTS.filter(s => s.riskLevel === 'med').length, color: 'bg-saffron', textColor: 'text-saffron' },
                { label: 'Low risk', count: STUDENTS.filter(s => s.riskLevel === 'lo').length, color: 'bg-emerald', textColor: 'text-emerald' },
              ].map((tier) => (
                <div key={tier.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-ink-3">{tier.label}</span>
                    <span className={cn('text-xs font-bold font-tabular', tier.textColor)}>{tier.count} students</span>
                  </div>
                  <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', tier.color)} style={{ width: ((tier.count / STUDENTS.length) * 100) + '%' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-brand-dim border border-brand/20 rounded-r-md rounded-b-md p-4">
            <div className="text-xs font-bold text-ink mb-2">AI recommendation</div>
            <p className="text-xs text-ink-3 leading-relaxed">2 students (James Kim, Amir Chen) are showing strong grades but high-reach program selections. Consider scheduling a program balance review before OUAC opens Jan 15.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
