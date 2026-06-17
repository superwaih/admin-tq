'use client';

import React from 'react';
import {
  SectionTitle, FieldLabel, TextArea, EducatorBox, RatingScale, StepCard,
} from '@/src/components/assessment/primitives';
import { useAssessment } from '@/src/components/assessment/context';
import { SKILLS } from '@/src/lib/assessment-config';

export default function SkillsStepView() {
  const { data, setSkills } = useAssessment();
  const { student, educator } = data.skills;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          What are the strengths?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8e92ad] mt-1.5 leading-relaxed max-w-3xl">
          The student rates themselves, and the educator rates the same skills from what
          they&apos;ve observed. Comparing the two views is where the real conversation happens.
        </p>
      </div>

      {/* ── Section 1: Skills — two perspectives ── */}
      <StepCard>
        <SectionTitle
          n={1}
          title="Skills — two perspectives"
          subtitle="Rate each skill 1 (developing) to 5 (a real strength)"
        />

        {/* Header row (desktop) */}
        <div className="hidden md:flex items-center border-b border-gray-200 pb-2.5 mb-1">
          <div className="w-1/4 shrink-0" />
          <div className="flex-1 flex justify-center">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">🎓 Student</span>
          </div>
          <div className="w-px self-stretch bg-gray-200" />
          <div className="flex-1 flex justify-center">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">✏️ Educator</span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {SKILLS.map((skill) => (
            <div
              key={skill.id}
              className="flex flex-col md:flex-row md:items-center py-4 gap-3 md:gap-0"
            >
              {/* Skill label */}
              <div className="md:w-1/4 md:shrink-0">
                <span className="text-xs font-semibold text-slate-800 dark:text-white">
                  {skill.label}
                </span>
              </div>

              {/* Ratings */}
              <div className="flex flex-col md:flex-row md:items-center flex-1 gap-3 md:gap-0">
                {/* Student */}
                <div className="flex-1 flex flex-col items-start md:items-center gap-1">
                  <span className="md:hidden text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    🎓 Student
                  </span>
                  <RatingScale
                    accent="blue"
                    value={student[skill.id] ?? 0}
                    onChange={(n) => setSkills({ student: { ...student, [skill.id]: n } })}
                  />
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px self-stretch bg-gray-200" />

                {/* Educator */}
                <div className="flex-1 flex flex-col items-start md:items-center gap-1">
                  <span className="md:hidden text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    ✏️ Educator
                  </span>
                  <RatingScale
                    accent="emerald"
                    value={educator[skill.id] ?? 0}
                    onChange={(n) => setSkills({ educator: { ...educator, [skill.id]: n } })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </StepCard>

      {/* ── Section 2: Strengths in context ── */}
      <StepCard>
        <SectionTitle n={2} title="Strengths in context" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <FieldLabel>Student — what&apos;s one thing you&apos;re confidently good at?</FieldLabel>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-1.5">
              Something you&apos;d be happy to be known for
            </p>
            <TextArea
              rows={4}
              placeholder="Write your response here..."
              value={data.skills.confidentlyGoodAt}
              onChange={(e) => setSkills({ confidentlyGoodAt: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Student — what would you like to get better at?</FieldLabel>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mb-1.5">
              An area you want to develop
            </p>
            <TextArea
              rows={4}
              placeholder="Write your response here..."
              value={data.skills.wantToImprove}
              onChange={(e) => setSkills({ wantToImprove: e.target.value })}
            />
          </div>
        </div>

        <EducatorBox
          title="Educator observation — demonstrated aptitudes"
          subtitle={'Concentrate examples of strengths you\u2019ve witnessed (e.g. \u201Crebuilt the bike for the fundraiser\u201D, led the group presentation). Note any standout aptitude or untapped potential.'}
        >
          <TextArea
            rows={3}
            placeholder="Write your observation here..."
            value={data.skills.educatorAptitudesNote}
            onChange={(e) => setSkills({ educatorAptitudesNote: e.target.value })}
          />
        </EducatorBox>
      </StepCard>
    </div>
  );
}
