'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  SectionTitle, FieldLabel, TextInput, TextArea, SelectInput,
  EducatorBox, Chip, OptionCard, InfoBanner, StepCard,
} from '@/src/components/assessment/primitives';
import { useAssessment } from '@/src/components/assessment/context';
import {
  PROVINCES, SUBJECT_OPTIONS, EDUCATOR_ROLES, ACHIEVEMENT_OPTIONS,
} from '@/src/lib/assessment-config';
import type { GradeTrend, LearnNew, SpendTime, FutureStudy, SubjectGrade } from '@/src/types/assessment';

export default function ProfileStepView() {
  const { data, setProfile } = useAssessment();
  const p = data.profile;

  const toggleSubject = (subject: string) => {
    const current = p.subjectsStudied;
    const next = current.includes(subject)
      ? current.filter((s) => s !== subject)
      : [...current, subject];
    setProfile({ subjectsStudied: next });
  };

  const updateSubjectGrade = (index: number, patch: Partial<SubjectGrade>) => {
    const next = p.subjectGrades.map((sg, i) => (i === index ? { ...sg, ...patch } : sg));
    setProfile({ subjectGrades: next });
  };

  const addSubjectGrade = () => {
    setProfile({ subjectGrades: [...p.subjectGrades, { subject: '', grade: '' }] });
  };

  const removeSubjectGrade = (index: number) => {
    setProfile({ subjectGrades: p.subjectGrades.filter((_, i) => i !== index) });
  };

  const trendOptions: { value: GradeTrend; label: string }[] = [
    { value: 'improving', label: 'Improving' },
    { value: 'holding', label: 'Holding Steady' },
    { value: 'slipping', label: 'Slipping' },
  ];

  const learnNewOptions: { value: LearnNew; label: string }[] = [
    { value: 'hands-on', label: 'By doing it hands-on' },
    { value: 'mix', label: 'A mix of both' },
    { value: 'reading', label: 'By reading & analyzing' },
  ];

  const spendTimeOptions: { value: SpendTime; label: string }[] = [
    { value: 'making', label: 'Making / Building / Fixing' },
    { value: 'balance', label: 'A balance' },
    { value: 'researching', label: 'Researching / theorizing' },
  ];

  const futureStudyOptions: { value: FutureStudy; label: string }[] = [
    { value: 'working', label: "I'd rather start working / training" },
    { value: 'either', label: 'Open to either' },
    { value: 'academic', label: 'I enjoy academic study' },
  ];

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          Let&apos;s build the student profile.
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#8e92ad] mt-2 leading-relaxed max-w-3xl">
          Work through this together. The student answers in their own voice; the educator adds
          context and observations. This first phase captures who the student is, where they are in
          school, and how they learn — across any province or territory in Canada.
        </p>
      </div>

      <InfoBanner>
        <span className="font-bold">Collaborative tool.</span> Amber boxes are for the educator,
        guidance counsellor or advisor. <span className="font-bold">Teal inputs</span> are the
        student&apos;s own responses.
      </InfoBanner>

      {/* 1. Who's completing this */}
      <StepCard>
        <SectionTitle
          n={1}
          title="Who's completing this"
          subtitle="Identify the student, their province/territory, an the supporting educator or guidance counsellor"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <FieldLabel>Student full name</FieldLabel>
            <TextInput
              placeholder="e.g Jordan Tremblay"
              value={p.studentFullName}
              onChange={(e) => setProfile({ studentFullName: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel optional>Preferred Name</FieldLabel>
            <TextInput
              placeholder="What you like to be called"
              value={p.preferredName}
              onChange={(e) => setProfile({ preferredName: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Age</FieldLabel>
            <TextInput
              type="number"
              placeholder="16"
              value={p.age}
              onChange={(e) => setProfile({ age: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Grade / Level</FieldLabel>
            <TextInput
              placeholder="Grade 11 (Sec. IV in QC)"
              value={p.gradeLevel}
              onChange={(e) => setProfile({ gradeLevel: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Province / Territory</FieldLabel>
            <SelectInput
              value={p.province}
              onChange={(v) => setProfile({ province: v })}
              options={PROVINCES}
              placeholder="Select"
            />
          </div>
          <div>
            <FieldLabel>School / City</FieldLabel>
            <TextInput
              placeholder="School Name"
              value={p.schoolCity}
              onChange={(e) => setProfile({ schoolCity: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Educator / Advisor Name</FieldLabel>
            <TextInput
              placeholder="e.g Ms. Nguyen"
              value={p.educatorName}
              onChange={(e) => setProfile({ educatorName: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Educator Role</FieldLabel>
            <SelectInput
              value={p.educatorRole}
              onChange={(v) => setProfile({ educatorRole: v })}
              options={EDUCATOR_ROLES}
              placeholder="Select"
            />
          </div>
        </div>
      </StepCard>

      {/* 2. Academic Snapshot */}
      <StepCard>
        <SectionTitle
          n={2}
          title="Academic Snapshot"
          subtitle="A quick picture of current studies and achievement so far."
        />
        <div className="space-y-5">
          <div>
            <FieldLabel>Subjects currently studied</FieldLabel>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] -mt-0.5 mb-2">(tap all that apply)</p>
            <div className="flex flex-wrap gap-2">
              {SUBJECT_OPTIONS.map((subject) => (
                <Chip
                  key={subject}
                  label={subject}
                  selected={p.subjectsStudied.includes(subject)}
                  onClick={() => toggleSubject(subject)}
                />
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <FieldLabel>Overall Achievements so Far</FieldLabel>
              <SelectInput
                value={p.overallAchievements}
                onChange={(v) => setProfile({ overallAchievements: v })}
                options={ACHIEVEMENT_OPTIONS}
                placeholder="Select"
              />
            </div>
            <div>
              <FieldLabel>Strongest Subject Areas</FieldLabel>
              <SelectInput
                value={p.strongestSubjects}
                onChange={(v) => setProfile({ strongestSubjects: v })}
                options={SUBJECT_OPTIONS}
                placeholder="Select"
              />
            </div>
          </div>
        </div>
      </StepCard>

      {/* 3. Current Grades & Progress */}
      <StepCard>
        <SectionTitle
          n={3}
          title="Current Grades & Progress"
          subtitle="Used to check whether the student is on track for the programs their matches point to — and to advise where to focus. Enter percentage marks ( Canadian %). Leave blank if unknown."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <FieldLabel>Overall Current average (%)</FieldLabel>
            <TextInput
              type="number"
              placeholder="%"
              value={p.overallAverage}
              onChange={(e) => setProfile({ overallAverage: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel optional>Most Recent Term / Report</FieldLabel>
            <TextInput
              placeholder="Term 2, Grade 11"
              value={p.recentTerm}
              onChange={(e) => setProfile({ recentTerm: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-5">
          <FieldLabel>Subject grades</FieldLabel>
          <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] -mt-0.5 mb-2.5">
            Add the subjects you want to track and enter each percentage mark. Remove any you don&apos;t need.
          </p>

          {p.subjectGrades.length === 0 ? (
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] italic mb-2.5">No subjects added yet.</p>
          ) : (
            <div className="space-y-2.5">
              {p.subjectGrades.map((sg, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <TextInput
                    className="flex-1"
                    placeholder="Subject (e.g Mathematics)"
                    value={sg.subject}
                    onChange={(e) => updateSubjectGrade(i, { subject: e.target.value })}
                  />
                  <TextInput
                    type="number"
                    className="w-24"
                    placeholder="%"
                    value={sg.grade}
                    onChange={(e) => updateSubjectGrade(i, { grade: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => removeSubjectGrade(i)}
                    aria-label={`Remove ${sg.subject || 'subject'}`}
                    className="shrink-0 w-10 h-10 rounded-xl border border-gray-200 text-slate-400 dark:text-[#8e92ad] hover:text-red-600 hover:border-red-200 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addSubjectGrade}
            className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-dashed border-gray-300 text-slate-600 dark:text-[#c8ccdf] hover:border-blue-300 hover:text-blue-600 text-xs font-bold transition-colors"
          >
            <Plus size={14} /> Add subject
          </button>
        </div>

        <div className="mt-6">
          <FieldLabel>Over the last year, the student&apos;s grades are…</FieldLabel>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
            {trendOptions.map((opt) => (
              <OptionCard
                key={opt.value}
                label={opt.label}
                selected={p.gradeTrend === opt.value}
                onClick={() => setProfile({ gradeTrend: opt.value })}
              />
            ))}
          </div>
        </div>

        <div className="mt-6">
          <EducatorBox
            title="Educator note – achievement context"
            subtitle="Any context behind the marks (e.g. strong upward trend, tough term, subjects where potential exceeds the current mark, courses still to be taken) This helps interpret the numbers fairly."
          >
            <TextArea
              rows={2}
              placeholder="Write your observation here…"
              value={p.educatorAchievementNote}
              onChange={(e) => setProfile({ educatorAchievementNote: e.target.value })}
            />
          </EducatorBox>
        </div>
      </StepCard>

      {/* 4. How The Student Learn Best */}
      <StepCard>
        <SectionTitle
          n={4}
          title="How The Student Learn Best"
          subtitle="Learning preference strongly influence whether an apprenticeship / trades or college / university route fits better."
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <FieldLabel>When you learn something new, what works best for you?</FieldLabel>
            <div className="space-y-2.5 mt-1">
              {learnNewOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={p.learnNew === opt.value}
                  onClick={() => setProfile({ learnNew: opt.value })}
                />
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>I&apos;d rather spend my time…</FieldLabel>
            <div className="space-y-2.5 mt-1">
              {spendTimeOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={p.spendTime === opt.value}
                  onClick={() => setProfile({ spendTime: opt.value })}
                />
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>How do you feel about several more years of classroom study after high school?</FieldLabel>
            <div className="space-y-2.5 mt-1">
              {futureStudyOptions.map((opt) => (
                <OptionCard
                  key={opt.value}
                  label={opt.label}
                  selected={p.futureStudy === opt.value}
                  onClick={() => setProfile({ futureStudy: opt.value })}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <EducatorBox
            title="Educator observation - learning & engagement"
            subtitle="How does this student engage in class? where do they come alive - practical / shop tasks discussion, independent research? Any support needs or accommodations to note?"
          >
            <TextArea
              rows={2}
              placeholder="Write your observation here…"
              value={p.educatorLearningNote}
              onChange={(e) => setProfile({ educatorLearningNote: e.target.value })}
            />
          </EducatorBox>
        </div>
      </StepCard>
    </div>
  );
}
