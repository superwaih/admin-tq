'use client';

import { useState } from 'react';
import { DollarSign, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { TUITION_ROWS, SCHOLARSHIPS } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';

const ELIGIBILITY_STYLES = {
  likely: 'text-emerald bg-emerald-dim border-emerald/25',
  possible: 'text-saffron bg-saffron-dim border-saffron/25',
  unlikely: 'text-rose bg-rose-dim border-rose/25',
};
const ELIGIBILITY_LABELS = { likely: 'Likely', possible: 'Possible', unlikely: 'Unlikely' };

export default function FinancialPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const cheapest = [...TUITION_ROWS].sort((a, b) => a.annualTuition - b.annualTuition)[0];

  return (
    <div className="p-5 flex flex-col gap-5 max-w-[820px]">
      <div>
        <h1 className="text-[18px] font-bold tracking-tight text-ink">Financial aid estimates</h1>
        <p className="text-xs text-ink-3 mt-0.5">Projected costs and aid · subject to change after acceptance</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-surface border border-[var(--line)] rounded-r-md rounded-b-md p-3.5 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4 mb-1">Most affordable</div>
          <div className="text-lg font-bold text-emerald">{cheapest.programName.split(' ')[0]}</div>
          <div className="text-sm font-bold text-ink font-tabular">CA{cheapest.annualTuition.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).replace('CA', '')}/yr</div>
        </div>
        <div className="bg-surface border border-[var(--line)] rounded-r-md rounded-b-md p-3.5 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4 mb-1">Scholarships tracked</div>
          <div className="text-lg font-bold text-brand font-tabular">{SCHOLARSHIPS.length}</div>
          <div className="text-[11px] text-ink-3 mt-0.5">potential awards</div>
        </div>
        <div className="bg-surface border border-[var(--line)] rounded-r-md rounded-b-md p-3.5 shadow-card">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4 mb-1">Programs tracked</div>
          <div className="text-lg font-bold text-ink font-tabular">{TUITION_ROWS.length}</div>
          <div className="text-[11px] text-ink-3 mt-0.5">with cost estimates</div>
        </div>
      </div>
      <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2 flex items-center justify-between">
          <div className="flex items-center gap-2"><DollarSign size={13} className="text-ink-4" /><span className="text-xs font-semibold text-ink">Annual tuition estimates</span></div>
          <div className="flex items-center gap-1 text-[11px] text-ink-4"><Info size={11} /> Tuition only</div>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {TUITION_ROWS.map((row) => {
            const isExpanded = expandedId === row.programId;
            return (
              <div key={row.programId} className="cursor-pointer hover:bg-surface-2 transition-colors" onClick={() => setExpandedId(isExpanded ? null : row.programId)}>
                <div className="px-4 py-3.5 flex items-center gap-3">
                  <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-ink">{row.programName}</div></div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-ink font-tabular">{row.annualTuition.toLocaleString('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).replace('CA', 'CA')}/yr</span>
                    {isExpanded ? <ChevronUp size={14} className="text-ink-4" /> : <ChevronDown size={14} className="text-ink-4" />}
                  </div>
                </div>
                {isExpanded && <div className="px-4 pb-3.5 border-t border-[var(--line)]"><p className="text-xs text-ink-3 leading-relaxed pt-2">{row.details}</p></div>}
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2"><span className="text-xs font-semibold text-ink">Scholarship eligibility</span></div>
        <div className="divide-y divide-[var(--line)]">
          {SCHOLARSHIPS.map((s) => (
            <div key={s.id} className="px-4 py-3.5 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-ink">{s.name}</span>
                  <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0', ELIGIBILITY_STYLES[s.eligibility])}>{ELIGIBILITY_LABELS[s.eligibility]}</span>
                </div>
                <div className="text-[11px] text-ink-4">{s.details}</div>
              </div>
              <div className="text-sm font-bold text-emerald font-tabular flex-shrink-0">{s.amount}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
