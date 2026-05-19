'use client';

import { useEffect, useRef, useState } from 'react';
import { STUDENT_PROFILE, AVG_PROBABILITY } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';
import { useProgram } from '@/src/hooks/useProgram';

interface MetricCardProps {
  label: string;
  value: string;
  trend: string;
  valueClass?: string;
  tooltip?: string;
}

function MetricCard({ label, value, trend, valueClass, tooltip }: MetricCardProps) {
  return (
    <div
      className="bg-surface border border-[var(--line)] rounded-r-md rounded-b-md p-3.5 hover:border-brand-mid hover:shadow-card-hover transition-all cursor-default"
      data-tip={tooltip}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4">{label}</div>
      <div className={cn('text-[21px] font-bold mt-1 font-tabular', valueClass)}>{value}</div>
      <div className="text-[10px] text-ink-4 mt-0.5">{trend}</div>
    </div>
  );
}

function ProgressRingCard() {
  const [progress, setProgress] = useState(0);
  const pct = STUDENT_PROFILE.appProgress;
  const r = 17;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    const t = setTimeout(() => setProgress(pct), 300);
    return () => clearTimeout(t);
  }, [pct]);

  const offset = circ - (progress / 100) * circ;

  return (
    <div className="bg-surface border border-[var(--line)] rounded-r-md rounded-b-md p-3.5 flex items-center gap-3 hover:border-brand-mid hover:shadow-card-hover transition-all cursor-pointer">
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4">App. progress</div>
        <div className="text-[18px] font-bold mt-1 font-tabular">{pct}%</div>
      </div>
      <div className="ml-auto relative">
        <svg width="42" height="42" viewBox="0 0 42 42">
          <circle cx="21" cy="21" r={r} fill="none" stroke="var(--surface-3)" strokeWidth="3" />
          <circle
            cx="21" cy="21" r={r}
            fill="none"
            stroke="var(--brand)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            transform="rotate(-90 21 21)"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)' }}
          />
        </svg>
      </div>
    </div>
  );
}

function useCountUp(target: number, suffix = '', delay = 100) {
  const [display, setDisplay] = useState('0' + suffix);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const start = Date.now() + delay;
    const dur = 900;
    const isFloat = String(target).includes('.');

    function tick() {
      const now = Date.now();
      if (now < start) { raf.current = requestAnimationFrame(tick); return; }
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
      setDisplay(val + suffix);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    }

    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [target, suffix, delay]);

  return display;
}

export function MetricCards() {
  const { programs, loading } = useProgram();
  const progCount = useCountUp(programs.length, '', 80);
  const avgProb = useCountUp(AVG_PROBABILITY, '%', 160);
  const days = useCountUp(STUDENT_PROFILE.daysToOUAC, '', 240);

  return (
    <div className="grid grid-cols-4 gap-2.5">
      <MetricCard
        label="Programs"
        value={progCount}
        trend="↑ 2 added this month"
        valueClass="text-brand"
        tooltip={`${programs.length} programs tracked`}
      />
      <MetricCard
        label="Avg probability"
        value={avgProb}
        trend="↑ 4% this week"
        valueClass="text-emerald"
        tooltip={`Weighted average across all ${programs.length}`}
      />
      <MetricCard
        label="Days to OUAC"
        value={days}
        trend="Opens Jan 15, 2025"
        valueClass="text-saffron"
        tooltip="Days until OUAC application opens"
      />
      <ProgressRingCard />
    </div>
  );
}
