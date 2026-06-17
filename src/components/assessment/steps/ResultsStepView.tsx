'use client';

import React from 'react';
import {
  GraduationCap, Wrench, Sparkles, Target, Award, Lightbulb,
  Briefcase, TrendingUp, BookOpen, Building2, DollarSign, Coins,
  CheckCircle2, User, ClipboardCheck, FileSignature, PenLine,
} from 'lucide-react';
import { StepCard, SectionTitle, InfoBanner } from '@/src/components/assessment/primitives';
import { computeResults } from '@/src/lib/assessment-compute';
import type { AssessmentData } from '@/src/types/assessment';

function pct(n: number) {
  return `${Math.round(n)}%`;
}

function eligStyles(e: 'On Track' | 'Needs Work' | 'Eligible') {
  if (e === 'Eligible') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (e === 'Needs Work') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
}

/* Mini stat card in the profile strip */
function MiniStat({ icon, label, value, tint }: {
  icon: React.ReactNode; label: string; value: string; tint: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl bg-gray-50 border border-gray-100 p-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tint}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}

export default function ResultsStepView({ data }: { data: AssessmentData }) {
  const r = computeResults(data);
  const today = new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div id="assessment-results" className="space-y-5">
      {/* ── Header ── */}
      <StepCard>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Potential Profile</h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-md">
                Built from everything you shared across the five phases. Use this as a starting point for a guided
                conversation — not a verdict.
              </p>
            </div>
          </div>

          {/* Pathway Fit mini gauge */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3 sm:min-w-[210px]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Pathway Fit</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <GraduationCap size={13} className="text-blue-600" /> College &amp; University
                </span>
                <span className="text-xs font-bold text-blue-600">{pct(r.collegeUniversityFit)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <Wrench size={13} className="text-emerald-600" /> Skilled Trades
                </span>
                <span className="text-xs font-bold text-emerald-600">{pct(r.apprenticeshipFit)}</span>
              </div>
            </div>
          </div>
        </div>
      </StepCard>

      {/* ── Profile strip ── */}
      <StepCard>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {r.initials}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{r.studentName}</p>
              <p className="text-xs text-slate-500">{r.gradeProvince}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MiniStat
              icon={<Award size={16} className="text-blue-600" />}
              tint="bg-blue-50"
              label="Academic Strength"
              value={r.academicStrength}
            />
            <MiniStat
              icon={<Lightbulb size={16} className="text-amber-600" />}
              tint="bg-amber-50"
              label="Top Interest Area"
              value={r.topInterestArea}
            />
            <MiniStat
              icon={<Sparkles size={16} className="text-indigo-600" />}
              tint="bg-indigo-50"
              label="Strongest Skills"
              value={r.strongestSkills}
            />
            <MiniStat
              icon={<Target size={16} className="text-emerald-600" />}
              tint="bg-emerald-50"
              label="Career Direction"
              value={r.careerDirection}
            />
          </div>
        </div>
      </StepCard>

      {/* ── Pathway Fit dual bar ── */}
      <StepCard>
        <SectionTitle
          n={1}
          title="Pathway Fit"
          subtitle="How your interests, skills, values and readiness weigh across Canada's two main routes. Both can be valid — the meter shows the stronger current fit."
        />
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <GraduationCap size={14} className="text-blue-600" /> College &amp; University — Diploma / Degree
              </span>
              <span className="text-xs font-bold text-blue-600">{pct(r.collegeUniversityFit)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-blue-600" style={{ width: pct(r.collegeUniversityFit) }} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Wrench size={14} className="text-emerald-600" /> Apprenticeship &amp; Skilled Trades — Red Seal
              </span>
              <span className="text-xs font-bold text-emerald-600">{pct(r.apprenticeshipFit)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: pct(r.apprenticeshipFit) }} />
            </div>
          </div>
          <InfoBanner>
            The current lean is {pct(r.collegeUniversityFit)} towards the college / university route. This reflects your
            answers today and should be revisited as you gain experience.
          </InfoBanner>
        </div>
      </StepCard>

      {/* ── Skilled Profile + Top Occupational Matches ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StepCard>
          <SectionTitle
            n={2}
            title="Skilled Profile"
            subtitle="Student self-view (and where available, educator view) blended. Gaps are conversation starters."
          />
          <div className="space-y-3">
            {r.skillProfile.map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-slate-700">{s.label}</span>
                  <span className="text-[11px] font-bold text-slate-500">{pct(s.value)}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: pct(s.value) }} />
                </div>
              </div>
            ))}
          </div>
        </StepCard>

        <StepCard>
          <SectionTitle
            n={3}
            title="Top Occupational Matches"
            subtitle="Ranked by fit with your interests and strengths."
          />
          <div className="divide-y divide-gray-100">
            {r.occupationalMatches.map((o) => (
              <div key={o.title} className="flex items-start gap-3 py-3 first:pt-0">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <Briefcase size={15} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{o.title}</p>
                    <span className="text-[10px] font-bold text-blue-600 whitespace-nowrap">{o.match}% Match</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{o.description}</p>
                  <div className="flex items-center justify-between gap-2 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-slate-500">
                      {o.route}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-600">
                      {o.salary} CAD avg / yr
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 leading-relaxed">
            Salary figures are indicated national averages (Job Bank, 2025) and vary by province, city and experience.
          </p>
        </StepCard>
      </div>

      {/* ── Grades & Program Eligibility ── */}
      <StepCard>
        <SectionTitle
          n={4}
          title="Grades & Program Eligibility"
          subtitle="How your current marks compare with typical entry requirements for each top match."
        />
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Match</th>
                <th className="py-2 px-3">Typical Entry Route</th>
                <th className="py-2 px-3">English</th>
                <th className="py-2 px-3">Math</th>
                <th className="py-2 px-3">Science</th>
                <th className="py-2 px-3">Your Average</th>
                <th className="py-2 pl-3">Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {r.programEligibility.map((p) => (
                <tr key={p.match} className="text-xs text-slate-700">
                  <td className="py-2.5 pr-3 font-semibold text-slate-800 dark:text-white">{p.match}</td>
                  <td className="py-2.5 px-3 text-slate-500">{p.route}</td>
                  <td className="py-2.5 px-3">{p.english}</td>
                  <td className="py-2.5 px-3">{p.math}</td>
                  <td className="py-2.5 px-3">{p.science}</td>
                  <td className="py-2.5 px-3 font-semibold">{p.yourAverage}</td>
                  <td className="py-2.5 pl-3">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${eligStyles(p.eligible)}`}>
                      {p.eligible}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </StepCard>

      {/* ── Recommended Programs + Scholarships ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <StepCard>
          <SectionTitle
            n={5}
            title="Recommended Programs"
            subtitle="School offering programs that fit your top match."
          />
          <div className="space-y-2.5">
            {r.recommendedPrograms.map((p) => (
              <div key={`${p.institution}-${p.program}`} className="flex items-center gap-3 rounded-xl bg-gray-50 border border-gray-100 p-3">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0">
                  <Building2 size={15} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{p.institution}</p>
                  <p className="text-[11px] text-slate-500 truncate">{p.program}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 whitespace-nowrap">
                  {p.tag}
                </span>
              </div>
            ))}
          </div>
        </StepCard>

        <StepCard>
          <SectionTitle
            n={6}
            title="Scholarships & Financial aid"
            subtitle="Explore funding options for your pathway."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {r.scholarships.map((s) => (
              <div key={s.name} className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                    <Coins size={14} className="text-amber-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{s.name}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">{s.amount}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{s.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </StepCard>
      </div>

      {/* ── Profile Summary + Shared Action Plan ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <StepCard className="lg:col-span-1">
          <SectionTitle
            n={7}
            title="Profile Summary"
            subtitle="Next steps for the weeks ahead — owned by both of you."
          />
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 mb-3">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700">
              <CheckCircle2 size={13} /> Current pathway lean
            </p>
            <p className="text-[11px] text-blue-700/90 mt-1 leading-relaxed">
              {r.collegeUniversityFit >= r.apprenticeshipFit
                ? `College & University (${pct(r.collegeUniversityFit)})`
                : `Apprenticeship & Skilled Trades (${pct(r.apprenticeshipFit)})`}
            </p>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">{r.summary}</p>
        </StepCard>

        <StepCard className="lg:col-span-2">
          <SectionTitle
            n={8}
            title="Shared Action Plan"
            subtitle="Next steps for the weeks ahead — owned by both of you."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-2.5">
                <User size={14} /> Student — your next steps
              </p>
              <ul className="space-y-2">
                {r.studentActions.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                    <span className="w-4 h-4 rounded border border-gray-300 shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 mb-2.5">
                <ClipboardCheck size={14} /> Educator — to put in place
              </p>
              <ul className="space-y-2">
                {r.educatorActions.map((a) => (
                  <li key={a} className="flex items-start gap-2 text-[11px] text-slate-600 leading-relaxed">
                    <span className="w-4 h-4 rounded border border-gray-300 shrink-0 mt-0.5" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </StepCard>
      </div>

      {/* ── Agreed & signed off ── */}
      <StepCard>
        <SectionTitle
          n={9}
          title="Agreed & signed off"
          subtitle="Record the agreed direction so it can be revisited."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 rounded-xl bg-gray-50 border border-gray-100 p-4">
            <p className="text-[11px] font-bold text-slate-700 mb-1.5">Agreed pathway direction &amp; key decisions</p>
            <p className="text-[11px] text-slate-600 leading-relaxed">{r.summary}</p>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4 flex flex-col">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <FileSignature size={13} /> Student signature / date
            </p>
            <div className="flex-1 min-h-[44px] border-b border-dashed border-gray-300 my-3 flex items-end justify-center pb-1 text-slate-300">
              <PenLine size={18} />
            </div>
            <p className="text-[11px] font-semibold text-slate-500">{today}</p>
          </div>
          <div className="rounded-xl bg-white border border-gray-200 p-4 flex flex-col">
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
              <FileSignature size={13} /> Educator signature / date
            </p>
            <div className="flex-1 min-h-[44px] border-b border-dashed border-gray-300 my-3 flex items-end justify-center pb-1 text-slate-300">
              <PenLine size={18} />
            </div>
            <p className="text-[11px] font-semibold text-slate-500">{today}</p>
          </div>
        </div>
      </StepCard>
    </div>
  );
}
