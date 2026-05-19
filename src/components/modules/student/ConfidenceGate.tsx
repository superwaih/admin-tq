'use client';

import { useEffect, useState } from 'react';
import { CONFIDENCE_GATE } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';

const COLOR_MAP = {
  emerald: { dot: 'bg-emerald', bar: 'bg-emerald', text: 'text-emerald' },
  saffron: { dot: 'bg-saffron', bar: 'bg-saffron', text: 'text-saffron' },
  rose: { dot: 'bg-rose', bar: 'bg-rose', text: 'text-rose' },
} as const;

export function ConfidenceGate() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-1.5">
      {CONFIDENCE_GATE.map((item) => {
        const pct = Math.round((item.profiles / item.threshold) * 100);
        const displayPct = Math.min(pct, 100);
        const colors = COLOR_MAP[item.color];
        const met = item.profiles >= item.threshold;

        return (
          <div
            key={item.id}
            className="border border-[var(--line)] rounded-r-md rounded-b-md px-2.5 py-2 hover:border-brand-mid transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', colors.dot)} />
              <span className="text-[11.5px] font-medium flex-1 text-ink">{item.label}</span>
              <span
                className="text-[10px] text-ink-3 font-semibold font-tabular"
                data-tip={met
                  ? `${item.profiles} verified profiles — above ${item.threshold} threshold`
                  : `${item.profiles} profiles — ${item.threshold - item.profiles} more needed`}
              >
                {item.profiles}/{item.threshold} {met && '✓'}
              </span>
            </div>
            <div className="h-1 bg-surface-3 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-1000', colors.bar)}
                style={{
                  width: animated ? `${displayPct}%` : '0%',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
