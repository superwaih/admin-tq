'use client';

import { useState } from 'react';
import { SquareCheck as CheckSquare, Square, Send, Mail, FileText } from 'lucide-react';
import { STUDENTS } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';

const BULK_ACTIONS = [
  { id: 'nudge', label: 'Send deadline nudge', Icon: Mail, desc: 'Email selected students about upcoming AIF deadlines' },
  { id: 'report', label: 'Generate progress reports', Icon: FileText, desc: 'Export PDF progress reports for selected students' },
  { id: 'review', label: 'Request essay drafts', Icon: Send, desc: 'Prompt selected students to submit pending essay drafts' },
];

export default function BulkActionsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const allSelected = selectedIds.length === STUDENTS.length;

  function toggleAll() { setSelectedIds(allSelected ? [] : STUDENTS.map((s) => s.id)); }
  function toggleStudent(id: string) { setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]); }
  function handleSend() { setSent(true); setTimeout(() => setSent(false), 3000); setActiveAction(null); setSelectedIds([]); }

  return (
    <div className="p-5 flex flex-col gap-5 max-w-[820px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-ink">Bulk actions</h1>
          <p className="text-xs text-ink-3 mt-0.5">Apply actions across multiple students at once</p>
        </div>
        {selectedIds.length > 0 && (
          <span className="text-[11px] font-bold text-brand bg-brand-dim border border-brand/20 px-2.5 py-1.5 rounded-r-sm rounded-b-sm">
            {selectedIds.length} student{selectedIds.length !== 1 ? 's' : ''} selected
          </span>
        )}
      </div>
      {sent && <div className="bg-emerald-dim border border-emerald/25 rounded-r-md rounded-b-md px-4 py-3 text-xs font-semibold text-emerald">Action sent successfully.</div>}
      <div className="grid grid-cols-3 gap-3">
        {BULK_ACTIONS.map(({ id, label, Icon, desc }) => {
          const isActive = activeAction === id;
          return (
            <button key={id} onClick={() => setActiveAction(isActive ? null : id)} disabled={selectedIds.length === 0}
              className={cn('p-3.5 text-left rounded-r-md rounded-b-md border transition-all',
                isActive ? 'bg-brand-dim border-brand/30 ring-1 ring-brand/20' : 'bg-surface border-[var(--line)] hover:shadow-card-hover hover:bg-surface-2',
                selectedIds.length === 0 && 'opacity-40 cursor-not-allowed'
              )}>
              <Icon size={15} className={isActive ? 'text-brand' : 'text-ink-4'} />
              <div className="text-xs font-semibold text-ink mt-2 mb-0.5">{label}</div>
              <div className="text-[11px] text-ink-4 leading-relaxed">{desc}</div>
            </button>
          );
        })}
      </div>
      {activeAction && selectedIds.length > 0 && (
        <div className="bg-surface border border-brand/30 rounded-r-md rounded-b-md px-4 py-3.5 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-ink">{BULK_ACTIONS.find(a => a.id === activeAction)?.label}</div>
            <div className="text-[11px] text-ink-4 mt-0.5">Will be sent to {selectedIds.length} student{selectedIds.length !== 1 ? 's' : ''}</div>
          </div>
          <button onClick={handleSend} className="flex items-center gap-1.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-4 py-2 rounded-r-sm rounded-b-sm transition-all hover:-translate-y-px hover:shadow-brand">
            <Send size={11} /> Send now
          </button>
        </div>
      )}
      <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2">
          <button onClick={toggleAll} className="flex items-center gap-2 hover:text-brand transition-colors">
            {allSelected ? <CheckSquare size={15} className="text-brand" /> : <Square size={15} className="text-ink-4" />}
            <span className="text-[10px] font-bold uppercase tracking-wider text-ink-4">{allSelected ? 'Deselect all' : 'Select all'}</span>
          </button>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {STUDENTS.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <div key={s.id} onClick={() => toggleStudent(s.id)} className={cn('px-4 py-3 flex items-center gap-3 cursor-pointer transition-colors hover:bg-surface-2', isSelected && 'bg-brand/[0.025]')}>
                {isSelected ? <CheckSquare size={15} className="text-brand flex-shrink-0" /> : <Square size={15} className="text-ink-4 flex-shrink-0" />}
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: s.bgColor, color: s.textColor }}>{s.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-ink">{s.name}</div>
                  <div className="text-[11px] text-ink-4">{s.province} · {s.programCount} programs</div>
                </div>
                <div className={cn('text-xs font-bold font-tabular', s.avgProbability >= 70 ? 'text-emerald' : s.avgProbability >= 40 ? 'text-saffron' : 'text-rose')}>{s.avgProbability}%</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
