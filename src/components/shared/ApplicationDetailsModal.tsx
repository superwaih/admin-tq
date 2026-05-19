'use client';

import { useState } from 'react';
import { ReactNode } from 'react';
import {
  X, CheckCircle2, FileText, Clock, BookOpen,
  MapPin, Hash, GraduationCap, CalendarDays, Link2, UserCheck, Calendar,
} from 'lucide-react';

export interface AppRecord {
  name: string; university: string; progress: number; stage: string;
  priority: string; initials: string; color: string;
  program: string; appId: string; intake: string; campus: string;
  appDate: string; deadline: string; source: string; referredBy: string;
  graduation: string; email: string;
  checklist: { label: string; status: 'SUBMITTED' | 'PENDING' | 'NOT REQUIRED' }[];
  academic: { gpa: string; institution: string; major: string; yearOfStudy: string; mcatScore: string };
  progressStep: number;
  currentStageDesc: string; estimatedUpdate: string;
}

export const PROGRESS_STEPS = ['Submitted', 'Under Review', 'Interview', 'Decision'];

interface ModalProps {
  app: AppRecord;
  onClose: () => void;
  extraTab?: { key: string; label: string; content: ReactNode };
}

export function ApplicationDetailsModal({ app, onClose, extraTab }: ModalProps) {
  const [tab, setTab] = useState<string>('overview');

  const baseTabs = [
    { key: 'overview', label: 'Application Overview' },
    { key: 'docs',     label: 'Documentation (3)'    },
    { key: 'activity', label: 'Activity log'         },
    { key: 'notes',    label: 'Notes (6)'            },
  ];
  const allTabs = extraTab ? [...baseTabs, { key: extraTab.key, label: extraTab.label }] : baseTabs;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[3px]" onClick={onClose} />
      <div className="fixed z-50 inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="pointer-events-auto w-full max-w-3xl max-h-[92vh] bg-white dark:bg-[#161a27] rounded-2xl shadow-2xl border border-gray-100 dark:border-white/8 flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-gray-100 dark:border-white/6 shrink-0">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">Application Details</h2>
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl ${app.color} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                  {app.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{app.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">{app.program} · {app.graduation}</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">{app.university}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-white/10 text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              <X size={12} /> Close
            </button>
          </div>

          {/* Tab strip */}
          <div className="flex items-center gap-0 border-b border-gray-100 dark:border-white/6 px-6 shrink-0 overflow-x-auto">
            {allTabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                  tab === t.key
                    ? 'border-cyan-600 text-cyan-600 dark:text-cyan-400'
                    : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">

            {tab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                  {/* Application Information */}
                  <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Application Information</p>
                    <div className="space-y-3">
                      {[
                        { icon: <Hash size={11} />,          label: 'Applications ID',  value: app.appId },
                        { icon: <GraduationCap size={11} />, label: 'Program',           value: app.program.toUpperCase() },
                        { icon: <CalendarDays size={11} />,  label: 'Intake / Term',     value: app.intake.toUpperCase() },
                        { icon: <MapPin size={11} />,        label: 'Campus',            value: app.campus.toUpperCase() },
                        { icon: <Calendar size={11} />,      label: 'Application Date',  value: app.appDate.toUpperCase() },
                        { icon: <Clock size={11} />,         label: 'Deadline',          value: app.deadline.toUpperCase() },
                        { icon: <Link2 size={11} />,         label: 'Source',            value: app.source.toUpperCase() },
                        { icon: <UserCheck size={11} />,     label: 'Referred By',       value: app.referredBy.toUpperCase() },
                      ].map((row, i) => (
                        <div key={i}>
                          <div className="flex items-center gap-1.5 text-[9px] text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider font-semibold mb-0.5">
                            <span className="text-slate-300 dark:text-white/20">{row.icon}</span>
                            {row.label}
                          </div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200 pl-4">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Requirement Checklist */}
                  <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Requirement Checklist</p>
                    <div className="space-y-4">
                      {app.checklist.map((item, i) => (
                        <div key={i}>
                          <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-0.5">{item.label}</p>
                          <p className={`text-xs font-bold ${
                            item.status === 'SUBMITTED'    ? 'text-emerald-600 dark:text-emerald-400' :
                            item.status === 'PENDING'      ? 'text-amber-500  dark:text-amber-400'   :
                                                             'text-slate-400'
                          }`}>{item.status}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Academic Summary */}
                  <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-4">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-4">Academic Summary</p>
                    <div className="space-y-3">
                      {[
                        { label: 'GPA',                       value: app.academic.gpa },
                        { label: 'Undergraduate Institution', value: app.academic.institution.toUpperCase() },
                        { label: 'Major',                     value: app.academic.major.toUpperCase() },
                        { label: 'Year of Study',             value: app.academic.yearOfStudy.toUpperCase() },
                        { label: 'MCAT Score',                value: app.academic.mcatScore.toUpperCase() },
                      ].map((row, i) => (
                        <div key={i}>
                          <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-0.5">{row.label}</p>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{row.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Application Progress */}
                <div className="bg-gray-50 dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/6 p-5">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-widest mb-6">Application Progress</p>

                  <div className="relative flex items-center justify-between mb-6 px-2">
                    <div className="absolute inset-x-6 top-4 h-0.5 bg-gray-200 dark:bg-white/10" />
                    <div
                      className="absolute top-4 h-0.5 bg-cyan-500 transition-all"
                      style={{ left: '1.5rem', width: `${((app.progressStep - 1) / (PROGRESS_STEPS.length - 1)) * (100 - 12)}%` }}
                    />
                    {PROGRESS_STEPS.map((step, i) => {
                      const stepNum = i + 1;
                      const done    = stepNum < app.progressStep;
                      const active  = stepNum === app.progressStep;
                      return (
                        <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                            done   ? 'bg-cyan-500 border-cyan-500 text-white' :
                            active ? 'bg-white dark:bg-[#161a27] border-cyan-500 text-cyan-600 dark:text-cyan-400 shadow-md' :
                                     'bg-white dark:bg-[#161a27] border-gray-200 dark:border-white/15 text-slate-400'
                          }`}>
                            {done ? <CheckCircle2 size={14} className="text-white" /> : stepNum}
                          </div>
                          <div className="text-center">
                            <p className={`text-[10px] font-bold whitespace-nowrap ${active ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-[#8e92ad]'}`}>
                              {step === 'Submitted'    && app.appDate}
                              {step === 'Under Review' && (active || done ? app.appDate.replace('May 13', 'May 15') : step)}
                              {step !== 'Submitted' && step !== 'Under Review' && step.toUpperCase()}
                            </p>
                            <p className={`text-[9px] font-semibold uppercase tracking-wide mt-0.5 ${
                              done   ? 'text-cyan-500' :
                              active ? 'text-slate-700 dark:text-white font-bold' :
                                       'text-slate-400 dark:text-[#8e92ad]'
                            }`}>
                              {done ? 'SUBMITTED' : active ? step.toUpperCase() : 'PENDING'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-4">
                    <p className="text-[10px] text-indigo-400 font-semibold mb-1">Current stage</p>
                    <p className="text-sm font-bold text-indigo-800 dark:text-indigo-200 mb-1">
                      {PROGRESS_STEPS[app.progressStep - 1]}
                    </p>
                    <p className="text-[11px] text-indigo-600/70 dark:text-indigo-300/70 mb-3">{app.currentStageDesc}</p>
                    <p className="text-xs font-bold text-indigo-800 dark:text-indigo-200">
                      Estimated Updated: {app.estimatedUpdate}
                    </p>
                  </div>
                </div>
              </>
            )}

            {tab === 'docs' && (
              <div className="py-12 text-center text-slate-400 dark:text-[#8e92ad]">
                <FileText size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">3 documents on file</p>
                <p className="text-xs mt-1">Personal Statement · Transcript · Letter of Recommendation</p>
              </div>
            )}

            {tab === 'activity' && (
              <div className="py-12 text-center text-slate-400 dark:text-[#8e92ad]">
                <Clock size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">Activity log coming soon</p>
                <p className="text-xs mt-1">All actions for this application will appear here.</p>
              </div>
            )}

            {tab === 'notes' && (
              <div className="py-12 text-center text-slate-400 dark:text-[#8e92ad]">
                <BookOpen size={32} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm font-semibold">6 counselor notes</p>
                <p className="text-xs mt-1">Notes for this student&apos;s application will appear here.</p>
              </div>
            )}

            {extraTab && tab === extraTab.key && extraTab.content}
          </div>
        </div>
      </div>
    </>
  );
}
