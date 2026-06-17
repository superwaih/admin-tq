'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Check, ArrowRight, ArrowLeft, Loader2, HelpCircle, Save, AlertCircle, Download,
} from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import ThemeToggle from '@/src/components/shared/ThemeToggle';
import {
  AssessmentProvider, EMPTY_ASSESSMENT,
} from '@/src/components/assessment/context';
import type {
  AssessmentData, ProfileStep, InterestsStep, SkillsStep, ValuesStep,
} from '@/src/types/assessment';
import ProfileStepView from '@/src/components/assessment/steps/ProfileStepView';
import InterestsStepView from '@/src/components/assessment/steps/InterestsStepView';
import SkillsStepView from '@/src/components/assessment/steps/SkillsStepView';
import ValuesStepView from '@/src/components/assessment/steps/ValuesStepView';
import ResultsStepView from '@/src/components/assessment/steps/ResultsStepView';

const STEPS = ['Profile', 'Interests', 'Skills', 'Values & Goals', 'Results'] as const;
const STORAGE_KEY = 'admitiq-assessment-draft';

export default function AssessmentClient() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<AssessmentData>(EMPTY_ASSESSMENT);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // Hydrate draft from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setData({ ...EMPTY_ASSESSMENT, ...parsed, profile: { ...EMPTY_ASSESSMENT.profile, ...parsed.profile }, interests: { ...EMPTY_ASSESSMENT.interests, ...parsed.interests }, skills: { ...EMPTY_ASSESSMENT.skills, ...parsed.skills }, values: { ...EMPTY_ASSESSMENT.values, ...parsed.values } });
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  // Autosave draft
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setSavedAt(new Date());
    } catch { /* ignore */ }
  }, [data, hydrated]);

  const setProfile = useCallback((patch: Partial<ProfileStep>) =>
    setData((d) => ({ ...d, profile: { ...d.profile, ...patch } })), []);
  const setInterests = useCallback((patch: Partial<InterestsStep>) =>
    setData((d) => ({ ...d, interests: { ...d.interests, ...patch } })), []);
  const setSkills = useCallback((patch: Partial<SkillsStep>) =>
    setData((d) => ({ ...d, skills: { ...d.skills, ...patch } })), []);
  const setValues = useCallback((patch: Partial<ValuesStep>) =>
    setData((d) => ({ ...d, values: { ...d.values, ...patch } })), []);

  const ctx = useMemo(() => ({ data, setProfile, setInterests, setSkills, setValues }),
    [data, setProfile, setInterests, setSkills, setValues]);

  const submit = useCallback(async () => {
    const uid = user?.id ?? 'demo-student';
    setSubmitting(true);
    setSubmitError(null);
    const payload = JSON.stringify({ userId: uid, responses: data });
    let lastErr: any = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/assessment/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await res.json();
        localStorage.removeItem(STORAGE_KEY);
        router.replace('/pathway');
        return;
      } catch (err) {
        lastErr = err;
        await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
      }
    }
    console.error('[assessment submit failed]', lastErr);
    setSubmitError('We could not save your assessment. Your answers are kept — please try again.');
    setSubmitting(false);
  }, [data, user?.id, router]);

  const downloadPdf = useCallback(async () => {
    const el = document.getElementById('assessment-results');
    if (!el) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      const raw = data.profile.studentFullName?.trim() || 'Student';
      const safe = raw.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '') || 'Student';
      const { downloadResultsPdf } = await import('@/src/lib/download-results-pdf');
      await downloadResultsPdf(el, `AdmitIQ-Assessment-${safe}.pdf`);
    } catch (err) {
      console.error('[assessment pdf failed]', err);
      setDownloadError('We could not generate the PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  }, [data.profile.studentFullName]);

  const goNext = () => { setStep((s) => Math.min(STEPS.length - 1, s + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const goBack = () => { setStep((s) => Math.max(0, s - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] dark:bg-[#0f1117]">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  const progress = Math.round(((step + 1) / STEPS.length) * 100);

  return (
    <AssessmentProvider value={ctx}>
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex">
        {/* ── Left rail / stepper ── */}
        <aside className="hidden lg:flex flex-col w-[230px] shrink-0 border-r border-gray-100 bg-white px-5 py-6 sticky top-0 h-screen">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-blue-600">AdmitIQ</span>
              <span className="text-base">🇨🇦</span>
            </div>
            <ThemeToggle size={15} />
          </div>
          <p className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider mb-8">
            Potential Assessment · Canada
          </p>

          <nav className="space-y-1 flex-1">
            {STEPS.map((label, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button
                  key={label}
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  className={cn(
                    'flex items-center gap-3 w-full text-left px-2 py-2 rounded-lg transition-colors',
                    active ? 'text-blue-600' : done ? 'text-slate-600 dark:text-[#c8ccdf]' : 'text-slate-300 dark:text-[#40455e]',
                    i <= step && 'hover:bg-gray-50',
                  )}
                >
                  <span className={cn(
                    'w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 border',
                    active ? 'bg-blue-600 border-blue-600 text-white'
                      : done ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 text-slate-300 dark:text-[#40455e]',
                  )}>
                    {done ? <Check size={12} /> : i + 1}
                  </span>
                  <span className="text-[13px] font-semibold">{label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 rounded-2xl bg-indigo-50 p-4">
            <p className="text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf]">Step {step + 1} of {STEPS.length}</p>
            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mb-2">Phase 1: Foundation</p>
            <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1.5">{progress}% Complete</p>
          </div>

          <div className="mt-4 rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#8e92ad]">
              <HelpCircle size={13} /><span className="text-[11px] font-bold">Needs help?</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-1">Your answers are saved automatically.</p>
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0">
          {/* mobile progress header */}
          <div className="lg:hidden sticky top-0 z-10 bg-white/90 border-b border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-blue-600">AdmitIQ 🇨🇦</span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-[#8e92ad]">Step {step + 1} of {STEPS.length}</span>
                <ThemeToggle size={14} className="h-7 w-7" />
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-blue-100 overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-[11px] font-semibold text-slate-700 dark:text-[#c8ccdf] mt-1.5">{STEPS[step]}</p>
          </div>

          <div className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-[1080px] mx-auto">
            {step === 0 && <ProfileStepView />}
            {step === 1 && <InterestsStepView />}
            {step === 2 && <SkillsStepView />}
            {step === 3 && <ValuesStepView />}
            {step === 4 && <ResultsStepView data={data} />}

            {submitError && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-semibold text-red-600">
                <AlertCircle size={14} /> {submitError}
              </div>
            )}

            {downloadError && (
              <div className="mt-6 flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-xs font-semibold text-red-600">
                <AlertCircle size={14} /> {downloadError}
              </div>
            )}

            {/* ── Footer nav ── */}
            <div className="mt-8 flex items-center justify-between gap-3">
              <button
                onClick={goBack}
                disabled={step === 0}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors',
                  step === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'border-gray-200 text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-50',
                )}
              >
                <ArrowLeft size={14} /> {step === 4 ? 'Back to edit' : 'Back'}
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-[#8e92ad]">
                <Check size={12} className="text-emerald-500" />
                {savedAt ? 'All changes saved automatically' : 'Auto-saving…'}
              </div>

              {step < 4 ? (
                <button
                  onClick={goNext}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm"
                >
                  {step === 3 ? 'Continue to Result' : `Continue to ${STEPS[step + 1]}`} <ArrowRight size={14} />
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={downloadPdf}
                    disabled={downloading || submitting}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-gray-200 text-slate-600 dark:text-[#c8ccdf] hover:bg-gray-50 text-xs font-bold transition-colors disabled:opacity-70"
                  >
                    {downloading ? <><Loader2 size={14} className="animate-spin" /> Preparing…</> : <><Download size={14} /> Download Result</>}
                  </button>
                  <button
                    onClick={submit}
                    disabled={submitting}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-70"
                  >
                    {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving…</> : <>Continue to Dashboard <ArrowRight size={14} /></>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AssessmentProvider>
  );
}
