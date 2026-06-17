'use client';

import React from 'react';
import {
  SectionTitle,
  FieldLabel,
  TextArea,
  EducatorBox,
  RatingScale,
  InfoBanner,
  StepCard,
} from '@/src/components/assessment/primitives';
import { useAssessment } from '@/src/components/assessment/context';
import { ACTIVITIES } from '@/src/lib/assessment-config';

const TAG_STYLES: Record<string, string> = {
  Data: 'bg-blue-50 text-blue-700 border-blue-200',
  People: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Things: 'bg-amber-50 text-amber-700 border-amber-200',
  Blue: 'bg-blue-50 text-blue-700 border-blue-200',
  Gold: 'bg-amber-50 text-amber-700 border-amber-200',
  Green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Orange: 'bg-orange-50 text-orange-700 border-orange-200',
};

function TagPill({ label }: { label: string }) {
  const cls = TAG_STYLES[label] ?? 'bg-gray-50 text-slate-500 border-gray-200';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

const COLOR_DOT: Record<string, string> = {
  Data: 'bg-blue-500',
  People: 'bg-emerald-500',
  Things: 'bg-amber-500',
  Blue: 'bg-blue-500',
  Gold: 'bg-amber-500',
  Green: 'bg-emerald-500',
  Orange: 'bg-orange-500',
};

const FUNCTIONAL_LENS = [
  {
    key: 'Data',
    letter: 'D',
    title: 'Data Focus',
    refs: 'A · E · H',
    desc: 'Thrives on information processing, patterns and organization.',
    pathways: 'Business Data Science, Accounting, Law, Health Informatics.',
  },
  {
    key: 'People',
    letter: 'P',
    title: 'People Focus',
    refs: 'B · D',
    desc: 'Thrives on human connection, leadership and communication.',
    pathways: 'Education, Nursing, Social Work, Marketing, PR.',
  },
  {
    key: 'Things',
    letter: 'T',
    title: 'Things Focus',
    refs: 'C · F · G',
    desc: 'Thrives on tangible outputs, technology and physical making.',
    pathways: 'Trades, Engineering, Digital Media, Architecture, Applied Sci.',
  },
];

const TRUE_COLORS = [
  {
    key: 'Blue',
    title: 'Blue',
    desc: 'Driven by purpose, empathy and harmony — needs collaborative, human-centric paths.',
  },
  {
    key: 'Gold',
    title: 'Gold',
    desc: 'Driven by stability, organization and clear expectations — excels in structured, logistical or governmental settings.',
  },
  {
    key: 'Green',
    title: 'Green',
    desc: 'Driven by logic, curiosity and problem-solving — excels in research, tech development and strategy.',
  },
  {
    key: 'Orange',
    title: 'Orange',
    desc: 'Driven by variety, dynamic environments and hands-on results — thrives in fast-paced, entrepreneurial or creative work.',
  },
];

const LEARNING_STYLES = [
  {
    key: 'People',
    title: 'Kinesthetic',
    desc: 'Learns by doing — highly compatible with polytechnics, hands-on college diplomas and apprenticeships.',
  },
  {
    key: 'Orange',
    title: 'Visual',
    desc: 'Thinks in concepts and layouts — compatible with design, media and technical-modeling programs.',
  },
  {
    key: 'Green',
    title: 'Auditory',
    desc: 'Processes through language, lectures and debate — compatible with traditional university and research-heavy fields.',
  },
];

export default function InterestsStepView() {
  const { data, setInterests } = useAssessment();
  const activities = data.interests.activities;

  // Lightweight live pathway preview from ratings
  const sums = { data: 0, things: 0, people: 0 };
  ACTIVITIES.forEach((act) => {
    sums[act.functional] += activities[act.id] ?? 0;
  });
  const total = sums.data + sums.things + sums.people;
  const pct = (v: number) => (total > 0 ? Math.round((v / total) * 100) : 0);

  const pathways = [
    { name: 'University', value: pct(sums.data), focus: 'Academic / Research', accent: 'bg-blue-600' },
    { name: 'Apprenticeship', value: pct(sums.things), focus: 'Practical / Hands-on', accent: 'bg-emerald-500' },
    { name: 'College', value: pct(sums.people), focus: 'Applied / Technical', accent: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">What genuinely interests you?</h2>
        <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-1 leading-relaxed max-w-2xl">
          Rate how much you enjoy each activity — be honest, not strategic. Theses map to six
          interest themes (the Holland / RIASEC model) that help match you to fitting work and pathways.
        </p>
      </div>

      <InfoBanner>
        <span className="font-bold">Three lenses, one survey. </span>
        Each activity is tagged against three theme signals. Together they point toward fitting
        occupations and the post-secondary environment — apprenticeship, college or university — where you'll thrive.
      </InfoBanner>

      {/* Section 1 — Rate your school activities */}
      <StepCard>
        <SectionTitle
          n={1}
          title="Rate your school activities"
          subtitle="How much do you enjoy each one? 1 = not for me, 5 = love it."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {ACTIVITIES.map((act) => (
            <div
              key={act.id}
              className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex flex-col gap-3"
            >
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {act.id}
                </span>
                <p className="text-xs font-semibold text-slate-800 dark:text-white leading-snug">{act.label}</p>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {act.tags.map((t) => (
                  <TagPill key={t} label={t} />
                ))}
              </div>
              <div className="flex">
                <RatingScale
                  value={activities[act.id] ?? 0}
                  onChange={(n) => setInterests({ activities: { ...activities, [act.id]: n } })}
                />
              </div>
            </div>
          ))}
        </div>
      </StepCard>

      {/* Section 2 — Your theme mapping */}
      <StepCard>
        <SectionTitle
          n={2}
          title="Your theme mapping"
          subtitle="Activities you score 4 or 5 aggregate into three Canadian guidance themes. Your strongest theme in each lens highlights the path you're most likely to thrive in."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Functional Work Lens */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] mb-3">
              Functional Work Lens · Data - People - Things
            </p>
            <div className="space-y-3">
              {FUNCTIONAL_LENS.map((f) => (
                <div key={f.key} className="flex items-start gap-2.5">
                  <span className={`w-5 h-5 rounded-full ${COLOR_DOT[f.key]} text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5`}>
                    {f.letter}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">
                      {f.title} <span className="text-slate-400 dark:text-[#8e92ad] font-semibold">{f.refs}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] mt-0.5 leading-relaxed">{f.desc}</p>
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-1 leading-relaxed">
                      <span className="font-semibold">Pathways: </span>{f.pathways}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Motivation Lens */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] mb-3">
              Core Motivation Lens · True Colors
            </p>
            <div className="space-y-3">
              {TRUE_COLORS.map((c) => (
                <div key={c.key} className="flex items-start gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${COLOR_DOT[c.key]} shrink-0 mt-1`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{c.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] mt-0.5 leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning & Processing Style */}
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
            <p className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] mb-3">
              Learning & Processing Style
            </p>
            <div className="space-y-3">
              {LEARNING_STYLES.map((l) => (
                <div key={l.title} className="flex items-start gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${COLOR_DOT[l.key]} shrink-0 mt-1`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-white">{l.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] mt-0.5 leading-relaxed">{l.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </StepCard>

      {/* Section 3 — Post-High School Pathway Mapper */}
      <StepCard>
        <SectionTitle
          n={3}
          title="Post-High School Pathway Mapper"
          subtitle="A live preview of your Canadian post-secondary pathway split — it shifts as you rate the activities above. Your complete, decision-ready picture appears in the Step 5 results."
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Bars */}
          <div className="space-y-3">
            {pathways.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] w-28 shrink-0">{p.name}</span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className={`h-full rounded-full ${p.accent} transition-all`} style={{ width: `${p.value}%` }} />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-white w-10 text-right">{p.value}%</span>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wide">Pathway</th>
                  <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wide">Fit %</th>
                  <th className="px-3 py-2 text-[10px] font-bold text-slate-500 dark:text-[#8e92ad] uppercase tracking-wide">Primary Focus</th>
                </tr>
              </thead>
              <tbody>
                {pathways.map((p) => (
                  <tr key={p.name} className="border-t border-gray-100">
                    <td className="px-3 py-2.5 text-xs font-semibold text-slate-800 dark:text-white">{p.name}</td>
                    <td className="px-3 py-2.5 text-xs font-bold text-blue-600">{p.value}%</td>
                    <td className="px-3 py-2.5 text-xs text-slate-500 dark:text-[#8e92ad]">{p.focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5">
          <InfoBanner>
            <span className="font-bold">What This Means. </span>
            Your responses are turned into a live preview of where your interests currently align across
            Canadian post-secondary environments. Keep rating activities to sharpen the match.
          </InfoBanner>
        </div>
      </StepCard>

      {/* Section 4 — In your own words */}
      <StepCard>
        <SectionTitle n={4} title="In your own words" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <FieldLabel>What you most enjoy doing - in or out of school?</FieldLabel>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-2 leading-relaxed">
              Hobbies, side projects, things you lose track of time doing...
            </p>
            <TextArea
              rows={4}
              placeholder="Write your response here..."
              value={data.interests.mostEnjoyDoing}
              onChange={(e) => setInterests({ mostEnjoyDoing: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel optional>Is there a job or industry you're curious about?</FieldLabel>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-2 leading-relaxed">
              Roles, fields, companies, things you've heard of and wondered about...
            </p>
            <TextArea
              rows={4}
              placeholder="Write your response here..."
              value={data.interests.jobCurious}
              onChange={(e) => setInterests({ jobCurious: e.target.value })}
            />
          </div>
        </div>
      </StepCard>

      {/* Educator observation */}
      <EducatorBox
        title="Educator observation - interests & motivation"
        subtitle="Where have you seen this student show genuine interest or initiative? Clubs, co-op, projects, or topics that consistently engage them?"
      >
        <TextArea
          rows={3}
          placeholder="Write your observation here..."
          value={data.interests.educatorInterestsNote}
          onChange={(e) => setInterests({ educatorInterestsNote: e.target.value })}
        />
      </EducatorBox>
    </div>
  );
}
