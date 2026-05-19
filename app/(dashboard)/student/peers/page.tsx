'use client';

import { useState } from 'react';
import { Users } from 'lucide-react';
import { PEER_PROFILES } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';

const METRICS = [
  { label: 'Profiles', value: '2,841', tip: 'similar profiles' },
  { label: 'Verified', value: '1,904', tip: 'verified outcomes' },
  { label: 'Programs', value: '312', tip: 'program cohorts' },
];

const OUTCOME_STYLES = {
  accepted: 'text-emerald bg-emerald-dim border border-emerald/25',
  rejected: 'text-rose bg-rose-dim border border-rose/25',
  waitlisted: 'text-amber bg-amber-dim border border-amber/25',
};

export default function PeersPage() {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState('');
  const submitEnabled = selectedProgram !== '' && selectedOutcome !== '';

  return (
    <div className="p-5 flex flex-col gap-5 max-w-[1120px]">
      <div>
        <h1 className="text-[18px] font-bold tracking-tight text-ink">Peer intelligence network</h1>
        <p className="text-xs text-ink-3 mt-0.5">Anonymised verified outcomes · k-anonymity enforced (k≥5)</p>
      </div>

      <div className="grid xl:grid-cols-[1.55fr_0.95fr] gap-5">
        <div className="space-y-5">
          <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--line)] bg-surface-2 flex items-center gap-3">
              <Users size={16} className="text-ink-4" />
              <div>
                <div className="text-sm font-semibold text-ink">Similar profiles · UofT Engineering Science</div>
                <div className="text-[10px] text-ink-4 mt-1">Verified peers with matching program interest and province.</div>
              </div>
            </div>
            <div className="space-y-1 p-5">
              {PEER_PROFILES.map((peer) => (
                <div key={peer.id} className="flex items-center justify-between gap-4 rounded-3xl border border-[var(--line)] bg-white px-4 py-3 shadow-sm">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink">Applicant {peer.anonymousId}</div>
                    <div className="text-[11px] text-ink-4 mt-1">{peer.province} · Top-6: {peer.top6Average.toFixed(1)}% · {peer.aifSubmitted ? 'AIF submitted' : 'AIF not submitted'}</div>
                  </div>
                  <span className={cn('text-[10px] font-bold px-3 py-1 rounded-full', OUTCOME_STYLES[peer.outcome])}>
                    {peer.outcome === 'accepted' ? 'Accepted' : 'Rejected'}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-[var(--line)] bg-[#EFF6FF] px-5 py-4">
              <div className="rounded-3xl border border-blue-100 bg-blue-50 p-4 text-[13px] leading-6 text-slate-700">
                <div className="text-[11px] uppercase tracking-[0.2em] text-brand font-semibold mb-2">Key finding</div>
                <p>All accepted profiles at 94%+ also submitted the AIF. The 95.4% applicant who skipped it was rejected — AIF completion appears decisive.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--line)] bg-surface-2">
              <div className="text-sm font-semibold text-ink">Data flywheel</div>
              <div className="text-[11px] text-ink-4 mt-1">Program analytics feeding future simulator accuracy.</div>
            </div>
            <div className="grid grid-cols-3 gap-3 p-5">
              {METRICS.map((metric, index) => (
                <div key={metric.label} className="rounded-3xl border border-[var(--line)] bg-white p-4 text-center shadow-sm">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-ink-4 font-semibold mb-2">{metric.label}</div>
                  <div className={index === 0 ? 'text-2xl font-bold text-brand font-tabular' : 'text-2xl font-bold text-ink font-tabular'}>{metric.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
            <div className="px-5 py-4 border-b border-[var(--line)] bg-surface-2">
              <div className="text-sm font-semibold text-ink">Contribute your outcome</div>
              <div className="text-[11px] text-ink-4 mt-1">After offers are released in May, submit your result to improve the simulator for future applicants.</div>
            </div>
            <div className="space-y-4 p-5">
              <select
                value={selectedProgram}
                onChange={(event) => setSelectedProgram(event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/10"
              >
                <option value="">Select program...</option>
                <option value="UofT Engineering Science">UofT Engineering Science</option>
                <option value="Waterloo Computer Engineering">Waterloo Computer Engineering</option>
                <option value="McMaster iBSc Health Science">McMaster iBSc Health Science</option>
              </select>
              <select
                value={selectedOutcome}
                onChange={(event) => setSelectedOutcome(event.target.value)}
                className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/10"
              >
                <option value="">Select outcome...</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Waitlisted">Waitlisted</option>
              </select>
              <button
                className={cn(
                  'w-full rounded-r-sm rounded-b-sm px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.16em]',
                  submitEnabled
                    ? 'bg-brand text-white hover:bg-brand-dark'
                    : 'bg-ink-100 text-ink-4'
                )}
                disabled={!submitEnabled}
              >
                Submit outcome (available May 2025)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
