'use client';

import React from 'react';
import {
  SectionTitle,
  FieldLabel,
  TextInput,
  TextArea,
  EducatorBox,
  Chip,
  OptionCard,
  ValueCard,
  StepCard,
} from '@/src/components/assessment/primitives';
import { useAssessment } from '@/src/components/assessment/context';
import { WORK_VALUES, READINESS_FACTORS } from '@/src/lib/assessment-config';

export default function ValuesStepView() {
  const { data, setValues } = useAssessment();
  const values = data.values;

  const toggleWorkValue = (id: string) => {
    const has = values.workValues.includes(id);
    if (has) {
      setValues({ workValues: values.workValues.filter((v) => v !== id) });
    } else if (values.workValues.length < 5) {
      setValues({ workValues: [...values.workValues, id] });
    }
  };

  const toggleFactor = (factor: string) => {
    const has = values.factors.includes(factor);
    setValues({
      factors: has
        ? values.factors.filter((f) => f !== factor)
        : [...values.factors, factor],
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          What matters and what&apos;s realistic?
        </h2>
        <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-1 leading-relaxed">
          A pathway only works if it fits the student&apos;s values, ambitions, and real-world circumstances.
          This phase weighs all three so the recommendation is grounded, not aspirational alone.
        </p>
      </div>

      {/* Section 1 — Work Values */}
      <StepCard>
        <SectionTitle
          n={1}
          title="Work Values"
          subtitle="When you picture a good working life, what matters most? Tap your top priorities."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {WORK_VALUES.map((v) => (
            <ValueCard
              key={v.id}
              label={v.label}
              desc={v.desc}
              selected={values.workValues.includes(v.id)}
              onClick={() => toggleWorkValue(v.id)}
            />
          ))}
        </div>
        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-3">
          Select up to 5 values.
        </p>
      </StepCard>

      {/* Section 2 — Pathway leanings */}
      <StepCard>
        <SectionTitle
          n={2}
          title="Pathway leanings"
          subtitle="There are no wrong answers — this just calibrates the recommendation. In Canada both routes are valued and well funded."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Which appeals more right now?</FieldLabel>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              <OptionCard
                label="Apprenticeship / Learn a trade"
                selected={values.pathwayLeaning === 'apprenticeship'}
                onClick={() => setValues({ pathwayLeaning: 'apprenticeship' })}
              />
              <OptionCard
                label="Genuinely undecided"
                selected={values.pathwayLeaning === 'undecided'}
                onClick={() => setValues({ pathwayLeaning: 'undecided' })}
              />
              <OptionCard
                label="College or university study"
                selected={values.pathwayLeaning === 'college'}
                onClick={() => setValues({ pathwayLeaning: 'college' })}
              />
            </div>
          </div>

          <div>
            <FieldLabel>How important is this to you?</FieldLabel>
            <div className="space-y-2 mt-1">
              <OptionCard
                label="Very important"
                selected={values.pathwayImportance === 'very'}
                onClick={() => setValues({ pathwayImportance: 'very' })}
              />
              <OptionCard
                label="Somewhat"
                selected={values.pathwayImportance === 'somewhat'}
                onClick={() => setValues({ pathwayImportance: 'somewhat' })}
              />
              <OptionCard
                label="Not a priority"
                selected={values.pathwayImportance === 'not'}
                onClick={() => setValues({ pathwayImportance: 'not' })}
              />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel optional>A specific occupation you&apos;re aiming towards, if any</FieldLabel>
          <TextInput
            value={values.specificOccupation}
            onChange={(e) => setValues({ specificOccupation: e.target.value })}
            placeholder="Electrician..."
          />
          <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-1.5">
            e.g. electrician, software developer, registered nurse, undecided
          </p>
        </div>
      </StepCard>

      {/* Section 3 — Readiness & real-world factors */}
      <StepCard>
        <SectionTitle
          n={3}
          title="Readiness & real-world factors"
          subtitle="Honesty here makes the plan workable. Complete collaboratively."
        />

        <div className="mb-5">
          <FieldLabel>Confidence meeting entry requirements for a chosen route</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
            <OptionCard
              label="Will need support"
              selected={values.confidence === 'support'}
              onClick={() => setValues({ confidence: 'support' })}
            />
            <OptionCard
              label="On track"
              selected={values.confidence === 'on-track'}
              onClick={() => setValues({ confidence: 'on-track' })}
            />
            <OptionCard
              label="Comfortably meeting them"
              selected={values.confidence === 'comfortable'}
              onClick={() => setValues({ confidence: 'comfortable' })}
            />
          </div>
        </div>

        <div>
          <FieldLabel>Any factor to plan around? (tap all that apply)</FieldLabel>
          <div className="flex flex-wrap gap-2 mt-1">
            {READINESS_FACTORS.map((factor) => (
              <Chip
                key={factor}
                label={factor}
                selected={values.factors.includes(factor)}
                onClick={() => toggleFactor(factor)}
              />
            ))}
          </div>
        </div>
      </StepCard>

      {/* Educator observation */}
      <EducatorBox
        title="Educator observation — readiness & recommendation notes"
        subtitle="Your professional read on readiness, supports to put in place, and your initial sense of the most suitable pathway (apprenticeship / trades, college, or university) and why."
      >
        <TextArea
          rows={3}
          value={values.educatorReadinessNote}
          onChange={(e) => setValues({ educatorReadinessNote: e.target.value })}
          placeholder="Maya is motivated, practical, and shows strong aptitude in hands-on and technical areas. Recommended exploring the skilled trades pathway (e.g. electrician). With some support in math and exam prep, she is well-positioned for apprenticeship entry."
        />
      </EducatorBox>
    </div>
  );
}
