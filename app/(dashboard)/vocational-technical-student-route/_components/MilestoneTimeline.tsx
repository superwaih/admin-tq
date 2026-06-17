import Link from 'next/link';
import { CheckCircle2, Loader2, Circle, ArrowRight, Sparkles } from 'lucide-react';

type StageStatus = 'done' | 'active' | 'upcoming';

interface Stage {
  id: string;
  title: string;
  status: StageStatus;
}

const STAGES: Stage[] = [
  { id: 'assessment', title: 'Assessment', status: 'done' },
  { id: 'skills', title: 'Skills Discovery', status: 'done' },
  { id: 'experience', title: 'Experience Log', status: 'done' },
  { id: 'training', title: 'Training Plan', status: 'active' },
  { id: 'reassessment', title: 'Reassessment', status: 'upcoming' },
];

function statusLabel(s: StageStatus) {
  if (s === 'done') return 'Completed';
  if (s === 'active') return 'In progress';
  return 'Upcoming';
}

function StageIcon({ status }: { status: StageStatus }) {
  if (status === 'done')
    return <CheckCircle2 className="w-6 h-6 text-emerald-500" />;
  if (status === 'active')
    return (
      <span className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
      </span>
    );
  return <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600" />;
}

export const MilestoneTimeline = () => {
  const done = STAGES.filter((s) => s.status === 'done').length;

  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-5">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Vocational Milestone Progress</h3>
        <Link
          href="/vocational-technical-student-route/milestones"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:gap-1.5 transition-all shrink-0"
        >
          View All Milestones <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Horizontal timeline (sm and up) */}
      <div className="hidden sm:block">
        <div className="flex items-start">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex-1 flex flex-col items-center relative">
              {/* connector to next */}
              {i < STAGES.length - 1 && (
                <span
                  className={`absolute top-3 left-1/2 w-full h-0.5 ${
                    stage.status === 'done' ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-white/10'
                  }`}
                />
              )}
              <div className="relative z-10 bg-white dark:bg-[#161a27] px-1">
                <StageIcon status={stage.status} />
              </div>
              <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200 mt-2 text-center leading-tight">{stage.title}</p>
              <p
                className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${
                  stage.status === 'done'
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : stage.status === 'active'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 dark:text-slate-500'
                }`}
              >
                {statusLabel(stage.status)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Vertical timeline (mobile) */}
      <div className="sm:hidden">
        <div className="relative pl-1">
          {STAGES.map((stage, i) => (
            <div key={stage.id} className="flex gap-3 relative pb-4 last:pb-0">
              {i < STAGES.length - 1 && (
                <span
                  className={`absolute left-3 top-7 bottom-0 w-0.5 ${
                    stage.status === 'done' ? 'bg-emerald-400' : 'bg-gray-200 dark:bg-white/10'
                  }`}
                />
              )}
              <div className="relative z-10 shrink-0">
                <StageIcon status={stage.status} />
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{stage.title}</p>
                <p
                  className={`text-[10px] font-bold uppercase tracking-wide mt-0.5 ${
                    stage.status === 'done'
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : stage.status === 'active'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-400 dark:text-slate-500'
                  }`}
                >
                  {statusLabel(stage.status)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Great progress banner */}
      <div className="mt-5 flex items-center gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 p-3.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Great Progress</p>
          <p className="text-[12px] text-emerald-700/80 dark:text-emerald-400/80 leading-snug">
            You&apos;ve completed {done} of {STAGES.length} milestones. Stay on track to unlock more opportunities.
          </p>
        </div>
      </div>
    </div>
  );
};
