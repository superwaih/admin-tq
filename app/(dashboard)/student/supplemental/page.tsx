'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudentDashboard } from '@/src/hooks/useStudentDasboard';

interface Draft {
  id: string;
  programName: string;
  university: string;
  wordLimit: number;
  aiScore: number;
  tutorStatus: 'reviewing' | 'pending' | 'complete';
  deadline: string | null;
  excerpt: string;
}

const DRAFTS: Draft[] = [
  {
    id: 'd1',
    programName: 'UofT AIF — Why Engineering?',
    university: 'University of Toronto',
    wordLimit: 450,
    aiScore: 72,
    tutorStatus: 'reviewing',
    deadline: 'Dec 1',
    excerpt: 'Engineering is not just about solving problems — it is about finding which problems are worth solving. Growing up watching my city’s transit infrastructure age while ridership grew, I became obsessed with systems that scale. I built a bus bunching prediction model using open GTFS data as my Grade 11 independent project, presenting findings to the City of Brampton’s transit advisory panel.',
  },
  {
    id: 'd2',
    programName: 'Waterloo AIF — Why Comp Eng?',
    university: 'University of Waterloo',
    wordLimit: 450,
    aiScore: 54,
    tutorStatus: 'pending',
    deadline: 'Dec 1',
    excerpt: 'I want to study computer engineering because I am passionate about technology and innovation in today’s world…',
  },
  {
    id: 'd3',
    programName: 'McMaster Supp — iBSc Health Sci',
    university: 'McMaster University',
    wordLimit: 500,
    aiScore: 0,
    tutorStatus: 'pending',
    deadline: null,
    excerpt: '',
  },
];

const RUBRIC_LABELS = ['Program fit', 'Authenticity', 'Narrative arc', 'Specificity'];
const RUBRIC_SCORES: Record<string, number[]> = {
  d1: [78, 91, 65, 55],
  d2: [45, 52, 48, 70],
  d3: [0, 0, 0, 0],
};

function ScoreBar({ score }: { score: number }) {
  const color = score >= 70 ? 'bg-emerald' : score >= 50 ? 'bg-saffron' : 'bg-rose';
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', color)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] font-bold font-tabular text-ink-3 w-7 text-right">{score}</span>
    </div>
  );
}

export default function SupplementalPage() {
  const { top6Avg, loading, error } = useStudentDashboard();
  const [selectedDraftId, setSelectedDraftId] = useState(DRAFTS[0].id);
  const selectedDraft = DRAFTS.find((draft) => draft.id === selectedDraftId) ?? DRAFTS[0];
  const [draftText, setDraftText] = useState(selectedDraft.excerpt);

  useEffect(() => {
    setDraftText(selectedDraft.excerpt);
  }, [selectedDraftId, selectedDraft.excerpt]);

  const wordCount = draftText.trim().split(/\s+/).filter(Boolean).length;
  const rubricScores = RUBRIC_SCORES[selectedDraft.id] ?? [0, 0, 0, 0];

  if (loading) {
    return (
      <div className="p-10 flex flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-brand" size={24} />
        <p className="text-xs text-ink-3">Refreshing supplemental coach...</p>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-5 max-w-[1000px]">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-ink">Supplemental coach</h1>
          <p className="text-xs text-ink-3 mt-0.5">AI-assisted drafting · {top6Avg.toFixed(1)}% Top 6 Avg · 2 drafts pending</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold uppercase tracking-wider text-ink-4">Tutor review status</div>
          <div className="text-lg font-bold text-ink">In progress</div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-dim border border-rose/25 text-rose text-xs p-3 rounded flex items-center gap-2">
          <AlertTriangle size={14} /> Failed to sync latest dashboard data.
        </div>
      )}

      <div className="grid lg:grid-cols-[1.75fr_1fr] gap-5">
        <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
          <div className="px-4 py-4 border-b border-[var(--line)] bg-surface-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-ink-4">Current draft</label>
              <div className="mt-2">
                <select
                  value={selectedDraftId}
                  onChange={(event) => setSelectedDraftId(event.target.value)}
                  className="w-full rounded-2xl border border-[var(--line)] bg-white px-3 py-2 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
                >
                  {DRAFTS.map((draft) => (
                    <option key={draft.id} value={draft.id}>{draft.programName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] uppercase tracking-wider text-ink-4">Due</div>
              <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-rose-dim text-rose border border-rose/25">{selectedDraft.deadline ?? 'TBD'}</span>
            </div>
          </div>

          <div className="px-4 py-4">
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              placeholder="Start your draft here..."
              className="min-h-[320px] w-full resize-none rounded-3xl border border-[var(--line)] bg-white p-4 text-sm leading-6 text-ink shadow-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10"
            />
          </div>

          <div className="px-4 py-4 border-t border-[var(--line)] bg-surface-2 space-y-4">
            <div className="rounded-3xl bg-blue-50 border border-blue-100 p-4 text-sm text-slate-800">
              <div className="font-semibold text-[13px] mb-2">AI feedback · live</div>
              <p className="leading-6">
                Good start. Expand your key example with a specific outcome or metric (e.g. “prediction accuracy of 84%”). Focus the next paragraph on why Waterloo Engineering needs systems thinking.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-3 rounded-r-sm rounded-b-sm transition-all hover:-translate-y-px hover:shadow-brand">Submit for review</button>
              <button className="w-full border border-[var(--line)] text-sm font-semibold text-ink py-3 rounded-r-sm rounded-b-sm transition-all hover:bg-surface-2">Save draft</button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
            <div className="px-4 py-3 border-b border-[var(--line)] bg-surface-2">
              <div className="text-sm font-semibold text-ink">Rubric alignment · UofT AIF</div>
            </div>
            <div className="space-y-4 p-4">
              {RUBRIC_LABELS.map((label, index) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-ink-4">
                    <span>{label}</span>
                    <span className="font-semibold text-ink">{rubricScores[index]}%</span>
                  </div>
                  <ScoreBar score={rubricScores[index]} />
                </div>
              ))}

              <div className="rounded-3xl bg-surface-2 p-4 border border-[var(--line)]">
                <div className="text-[10px] uppercase tracking-wider text-ink-4 mb-3">Tutor review status</div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white font-semibold">SK</div>
                  <div>
                    <div className="text-sm font-semibold text-ink">Sarah Kim</div>
                    <div className="text-[11px] text-ink-4">UofT Engineering specialist · 3 annotations</div>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose/25 bg-rose-dim px-3 py-1 text-[11px] font-semibold text-rose">
                  <span className="h-2 w-2 rounded-full bg-rose" /> Reviewing
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card p-4">
            <div className="text-sm font-semibold text-ink mb-2">Rubric quick tips</div>
            <ul className="space-y-2 text-[12px] text-ink-4">
              <li>Connect your experience to a concrete result and why it matters.</li>
              <li>Keep your voice authentic and avoid generic phrases.</li>
              <li>Use one strong example rather than multiple shallow points.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
