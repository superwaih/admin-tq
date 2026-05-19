'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { CircleCheck as CheckCircle2, Clock, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import type { MilestoneStatus } from '@/src/types';
import { cn } from '@/lib/utils';

const STATUS_ICON: Record<MilestoneStatus, ReactNode> = {
  done: <CheckCircle2 size={18} className="text-emerald" />,
  'in-progress': <Clock size={18} className="text-saffron" />,
  upcoming: <Circle size={18} className="text-ink-4" />,
};
const STATUS_LABEL: Record<MilestoneStatus, string> = { done: 'Completed', 'in-progress': 'In progress', upcoming: 'Upcoming' };
const STATUS_BADGE: Record<MilestoneStatus, string> = {
  done: 'text-emerald bg-emerald-dim border-emerald/25',
  'in-progress': 'text-saffron bg-saffron-dim border-saffron/25',
  upcoming: 'text-ink-4 bg-surface-2 border-[var(--line)]',
};

type Milestone = {
  id: string;
  status: MilestoneStatus;
  title: string;
  date: string;
  details: string;
};

export default function ParentMilestonesPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMilestones() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_CORE_URL || 'http://localhost:8000'}/api/v1/parent/milestones`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setError('Failed to load milestones');
          setLoading(false);
          return;
        }
        const data = await res.json();
        setMilestones(data.milestones || []);
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchMilestones();
  }, []);

  const doneCount = milestones.filter((m) => m.status === 'done').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4" />
        <span className="text-ink-3">Loading milestones...</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-rose mb-2">Dashboard Error</h1>
        <p className="text-ink-3 mb-4">{error}</p>
        <button className="bg-brand text-white px-4 py-2 rounded" onClick={() => window.location.reload()}>Reload</button>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5 max-w-[700px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-ink">Milestones & deadlines</h1>
          <p className="text-xs text-ink-3 mt-0.5">Key dates in your application cycle</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4">Progress</div>
          <div className="text-lg font-bold text-ink font-tabular">{doneCount}/{milestones.length} completed</div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute left-[17px] top-0 bottom-0 w-px bg-[var(--line)]" />
        <div className="flex flex-col gap-3">
          {milestones.map((m) => {
            const expanded = expandedId === m.id;
            return (
              <div key={m.id} className="relative flex gap-4">
                <div className={cn('relative z-10 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-surface border-2',
                  m.status === 'done' ? 'border-emerald' : m.status === 'in-progress' ? 'border-saffron' : 'border-[var(--line)]'
                )}>
                  {STATUS_ICON[m.status]}
                </div>
                <div
                  className={cn('flex-1 bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden cursor-pointer hover:shadow-card-hover transition-all',
                    m.status === 'in-progress' && 'border-saffron/40 ring-1 ring-saffron/20'
                  )}
                  onClick={() => setExpandedId(expanded ? null : m.id)}
                >
                  <div className="px-4 py-3 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-semibold text-ink">{m.title}</span>
                        <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0', STATUS_BADGE[m.status])}>{STATUS_LABEL[m.status]}</span>
                      </div>
                      <div className="text-[11px] text-ink-4">{m.date}</div>
                    </div>
                    {expanded ? <ChevronUp size={14} className="text-ink-4 flex-shrink-0" /> : <ChevronDown size={14} className="text-ink-4 flex-shrink-0" />}
                  </div>
                  {expanded && (
                    <div className="px-4 pb-3.5 border-t border-[var(--line)]">
                      <p className="text-xs text-ink-3 leading-relaxed pt-2.5">{m.details}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
