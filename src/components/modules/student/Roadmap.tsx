'use client';

import { cn } from '@/lib/utils';
import { TIMELINE_ITEMS } from '@/src/lib/sample-data';
import type { TimelineItem } from '@/src/types';

function TimelineDot({ status }: { status: TimelineItem['status'] }) {
  return (
    <div className="flex flex-col items-center w-[13px] flex-shrink-0">
      <div
        className={cn(
          'w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0',
          status === 'done' && 'bg-emerald',
          status === 'now' && 'bg-brand outline outline-[3px] outline-brand-dim tl-dot-now',
          status === 'soon' && 'bg-surface-3 border-[1.5px] border-ink-4',
        )}
      />
      <div className="w-px flex-1 bg-[var(--line-2)] mt-0.5" />
    </div>
  );
}

export function Roadmap() {
  return (
    <div className="flex flex-col">
      {TIMELINE_ITEMS.map((item, i) => (
        <div key={item.id} className="flex gap-2.5 pb-3">
          <div className="flex flex-col items-center w-[13px] flex-shrink-0">
            <div
              className={cn(
                'w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0',
                item.status === 'done' && 'bg-emerald',
                item.status === 'now' && 'bg-brand outline outline-[3px] outline-brand-dim',
                item.status === 'soon' && 'bg-surface-3 border-[1.5px] border-ink-4',
              )}
              style={item.status === 'now' ? { animation: 'glow 2s infinite' } : undefined}
            />
            {i < TIMELINE_ITEMS.length - 1 && (
              <div className="w-px flex-1 bg-[var(--line-2)] mt-0.5 min-h-[10px]" />
            )}
          </div>
          <div className="pb-1">
            <div className="text-[10px] font-semibold text-ink-4">{item.date}</div>
            <div
              className={cn(
                'text-xs font-semibold mt-0.5',
                item.status === 'now' && 'text-brand',
                item.status === 'soon' && 'text-ink-3',
              )}
            >
              {item.label}
            </div>
            {item.sublabel && (
              <div className="text-[11px] text-ink-3 mt-0.5">{item.sublabel}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
