'use client';

import { Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function EssayReviewPage() {
  const [essays, setEssays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEssays() {
      setLoading(true);
      setError(null);
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_CORE_URL || 'http://localhost:8000'}/api/v1/auth/counselor/overview`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          setError('Failed to load essay queue');
          setLoading(false);
          return;
        }
        const data = await res.json();
        // Assume API returns { essays: [...] }
        setEssays(data.essays || []);
      } catch (err: any) {
        setError(err.message || 'Network error');
      } finally {
        setLoading(false);
      }
    }
    fetchEssays();
  }, []);

  const urgentCount = essays.filter((e) => e.urgent).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mb-4" />
        <span className="text-ink-3">Loading essay queue...</span>
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
    <div className="p-5 flex flex-col gap-5 max-w-[820px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-ink">Essay review queue</h1>
          <p className="text-xs text-ink-3 mt-0.5">{essays.length} drafts awaiting review · AI pre-scored</p>
        </div>
        {urgentCount > 0 && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-rose bg-rose-dim border border-rose/25 px-2.5 py-1.5 rounded-r-sm rounded-b-sm">
            <AlertTriangle size={12} /> {urgentCount} urgent
          </span>
        )}
      </div>
      <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2">
          <div className="grid grid-cols-[2fr_1fr_100px_80px_32px] gap-3 text-[10px] font-bold uppercase tracking-wider text-ink-4">
            <span>Student / Program</span><span>Submitted</span><span>AI score</span><span>Status</span><span />
          </div>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {essays.map((e) => {
            const scoreColor = e.aiScore >= 70 ? 'text-emerald' : e.aiScore >= 55 ? 'text-saffron' : 'text-rose';
            const scoreBar = e.aiScore >= 70 ? 'bg-emerald' : e.aiScore >= 55 ? 'bg-saffron' : 'bg-rose';
            return (
              <div key={e.id} className={cn('px-4 py-3.5 grid grid-cols-[2fr_1fr_100px_80px_32px] gap-3 items-center hover:bg-surface-2 transition-colors cursor-pointer', e.urgent && 'bg-rose/[0.02]')}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-ink">{e.studentName}</span>
                    {e.urgent && <span className="text-[9px] font-bold text-rose bg-rose-dim border border-rose/25 px-1 py-0.5 rounded">Urgent</span>}
                  </div>
                  <div className="text-[11px] text-ink-4">{e.programName}</div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-ink-3">
                  <Clock size={11} className="text-ink-4" />{e.submittedAgo}
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className={cn('text-sm font-bold font-tabular', scoreColor)}>{e.aiScore}</span>
                    <span className="text-[10px] text-ink-4">/100</span>
                  </div>
                  <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
                    <div className={cn('h-full rounded-full', scoreBar)} style={{ width: e.aiScore + '%' }} />
                  </div>
                </div>
                <div>
                  {e.aiScore >= 70 ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald bg-emerald-dim border border-emerald/25 px-1.5 py-0.5 rounded">
                      <CheckCircle size={9} /> Ready
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-saffron bg-saffron-dim border border-saffron/25 px-1.5 py-0.5 rounded">Needs work</span>
                  )}
                </div>
                <ChevronRight size={14} className="text-ink-4" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-surface-2 border border-[var(--line)] rounded-r-md rounded-b-md px-4 py-3">
        <div className="text-xs font-bold text-ink mb-1">About AI scoring</div>
        <p className="text-xs text-ink-3 leading-relaxed">Each essay is automatically pre-scored across program fit, authenticity, narrative arc, and specificity. Essays scoring below 60 are flagged for priority counselor review.</p>
      </div>
    </div>
  );
}


