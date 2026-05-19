'use client';

import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { PROGRAMS } from '@/src/lib/sample-data';
import { probabilityColor, cn } from '@/lib/utils';
import type { Program } from '@/src/types';
import { useStudentDashboard } from '@/src/hooks/useStudentDasboard';
import { useProgram } from '@/src/hooks/useProgram';

const PROVINCE_CHIP: Record<string, { bg: string; text: string }> = {
  ON: { bg: 'bg-[#DBEAFE]', text: 'text-[#1D4ED8]' },
  BC: { bg: 'bg-[#D1FAE5]', text: 'text-[#065F46]' },
};

const BADGE_VARIANT = {
  emerald: 'bg-emerald-dim text-emerald',
  saffron: 'bg-saffron-dim text-saffron',
  rose: 'bg-rose-dim text-rose',
};

function ProbabilityBadge({ prob }: { prob: number }) {
  const color = probabilityColor(prob);
  return (
    <span className={cn('text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0', BADGE_VARIANT[color])}>
      {prob}%
    </span>
  );
}

function ProgramBar({ prob }: { prob: number }) {
  const color = probabilityColor(prob);
  const barColor = color === 'emerald' ? 'bg-emerald' : color === 'saffron' ? 'bg-saffron' : 'bg-rose';
  return (
    <div className="w-[60px] h-[5px] bg-surface-3 rounded-full overflow-hidden flex-shrink-0">
      <motion.div
        className={cn('h-full rounded-full', barColor)}
        initial={{ width: 0 }}
        animate={{ width: `${prob}%` }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      />
    </div>
  );
}

function ProgramDetail({ program }: { program: Program }) {
  const router = useRouter();
  const color = probabilityColor(program.probability);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="px-3 pb-3 border-t border-[var(--line)]"
    >
      <div className="pt-2.5 space-y-0">
        {(
          [
            ['Admission avg', program.admissionAvgRange],
            ['Your avg', '89.8%'],
            ['Supplemental', program.supplementalType ?? 'None required'],
            program.deadline ? ['Deadline', program.deadline] : null,
            ['Confidence', `${color === 'emerald' ? 'High' : color === 'saffron' ? 'Medium' : 'Low'} · ${program.confidenceProfiles} profiles`],
            program.trend ? ['Trend', program.trend] : null,
          ].filter((x): x is [string, string] => Array.isArray(x))
        ).map(([label, value]) => (
            <div key={label} className="flex justify-between py-1.5 text-xs border-b border-[var(--line)] last:border-0">
              <span className="text-ink-3">{label}</span>
              <span
                className={cn(
                  'font-semibold',
                  label === 'Deadline' && 'text-rose',
                  label === 'Trend' && 'text-emerald',
                )}
              >
                {value}
              </span>
            </div>
          ))}
      </div>

      {program.id === 'uoft' && (
        <button
          onClick={() => router.push('/student/simulator')}
          className="w-full mt-2.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2 rounded-r-sm rounded-b-sm transition-all hover:-translate-y-px hover:shadow-brand"
        >
          Simulate grade improvement →
        </button>
      )}
      {program.id === 'waterloo' && (
        <button
          onClick={() => router.push('/student/supplemental')}
          className="w-full mt-2.5 bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2 rounded-r-sm rounded-b-sm transition-all hover:-translate-y-px hover:shadow-brand"
        >
          Draft Waterloo AIF →
        </button>
      )}
      {program.id === 'mcmaster' && (
        <button
          onClick={() => router.push('/student/mmi')}
          className="w-full mt-2.5 bg-violet hover:bg-violet/90 text-white text-xs font-semibold py-2 rounded-r-sm rounded-b-sm transition-all hover:-translate-y-px"
        >
          Practice MMI →
        </button>
      )}
      {program.id === 'ubc' && (
        <div className="mt-2.5 bg-emerald-dim border-l-2 border-emerald rounded-r-md rounded-b-md px-3 py-2">
          <div className="text-xs font-bold text-emerald">Strong position</div>
          <div className="text-xs text-ink-2 mt-0.5 leading-relaxed">
            {"You're above the cutoff. Focus effort on UofT/Waterloo supplements."}
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function ProgramList() {
  const { expandedProgramId, toggleProgram } = useStudentDashboard();
  const { programs: apiPrograms, loading, error } = useProgram();
  const programs = apiPrograms.length > 0 ? apiPrograms : PROGRAMS;

  return (
    <div className="space-y-2">
      {loading && apiPrograms.length === 0 ? (
        <div className="flex items-center justify-center py-6 text-sm text-ink-3">
          Loading programs...
        </div>
      ) : null}
      {error && apiPrograms.length === 0 ? (
        <div className="rounded-md border border-rose/10 bg-rose-50 px-4 py-3 text-xs text-rose">
          Unable to load live program data. Showing fallback program list.
        </div>
      ) : null}
      {programs.map((program) => {
        const isOpen = expandedProgramId === program.id;
        const chip = PROVINCE_CHIP[program.province];

        return (
          <div
            key={program.id}
            className="border border-[var(--line)] rounded-r-md rounded-b-md overflow-hidden hover:shadow-card transition-shadow"
          >
            <button
              onClick={() => toggleProgram(program.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2.5 text-left transition-colors',
                isOpen ? 'bg-surface-2' : 'bg-surface hover:bg-surface-2',
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold truncate">{program.name}</div>
                <div className="text-[11px] text-ink-3 flex items-center gap-1 mt-0.5">
                  {program.university}
                  <span className={cn('text-[10px] font-bold px-1.5 py-px rounded', chip?.bg, chip?.text)}>
                    {program.province}
                  </span>
                </div>
              </div>
              <ProgramBar prob={program.probability} />
              <ProbabilityBadge prob={program.probability} />
              <svg
                viewBox="0 0 16 16" fill="none" stroke="var(--ink-4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className={cn('w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && <ProgramDetail key="detail" program={program} />}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}