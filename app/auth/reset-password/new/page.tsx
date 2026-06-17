'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

const ACCENT = '#2b5ce6';
const ACCENT_ALPHA = 'rgba(43,92,230,0.14)';

function getStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#ef4444' };
  if (score === 2) return { score, label: 'Fair', color: '#f59e0b' };
  if (score === 3) return { score, label: 'Good', color: '#3b82f6' };
  return { score, label: 'Strong', color: '#10b981' };
}

const REQUIREMENTS = [
  { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
  { label: 'One uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
  { label: 'One number', test: (p: string) => /[0-9]/.test(p) },
  { label: 'One symbol (!@#$…)', test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function NewPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strength = getStrength(password);
  const allMet = REQUIREMENTS.every((r) => r.test(password));
  const matches = password === confirm && confirm.length > 0;
  const canSubmit = allMet && matches;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    // Simulated submission — wire up to real API
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setDone(true);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#F8F9FB] px-5 py-12 antialiased">
      <ThemeToggle floating />

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b5ce6]/7 blur-[130px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">

        {/* Back link */}
        <Link
          href="/auth/reset-password"
          className="mb-8 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-10">

          {done ? (
            /* ── Success state ─────────────────────────────────── */
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/14">
                <ShieldCheck size={30} className="text-emerald-400" />
              </div>
              <div className="space-y-2">
                <h2 className="font-lora text-2xl font-normal text-slate-900">Password updated</h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  Your password has been changed successfully. You can now sign in with your new credentials.
                </p>
              </div>
              <Link href="/auth" className="block w-full">
                <Button
                  className="h-12 w-full rounded-xl text-sm font-semibold text-white"
                  style={{ background: ACCENT, boxShadow: '0 4px 20px rgba(43,92,230,0.25)' }}
                >
                  Sign in now
                </Button>
              </Link>
            </div>

          ) : (
            /* ── Form ─────────────────────────────────────────── */
            <div className="space-y-7">
              {/* Icon */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: ACCENT_ALPHA }}
              >
                <Lock size={26} style={{ color: ACCENT }} />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  AdmitIQ
                </span>
                <h2 className="font-lora text-3xl font-normal text-slate-900">Create new password</h2>
                <p className="text-sm text-slate-500">
                  Choose a strong password you haven't used before.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="auth-input pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  {/* Strength bar */}
                  {password.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.score ? '' : 'bg-gray-200'}`}
                            style={i <= strength.score ? { background: strength.color } : undefined}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] font-bold" style={{ color: strength.color }}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      className="auth-input pr-11"
                      style={
                        confirm.length > 0 && !matches
                          ? { borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 0 3px rgba(239,68,68,0.08)' }
                          : confirm.length > 0 && matches
                          ? { borderColor: 'rgba(16,185,129,0.45)', boxShadow: '0 0 0 3px rgba(16,185,129,0.08)' }
                          : {}
                      }
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirm.length > 0 && !matches && (
                    <p className="text-[10px] font-semibold text-red-400">Passwords do not match</p>
                  )}
                </div>

                {/* Requirements checklist */}
                {password.length > 0 && (
                  <ul className="space-y-2 rounded-xl border border-gray-200 bg-white p-4">
                    {REQUIREMENTS.map((req) => {
                      const met = req.test(password);
                      return (
                        <li key={req.label} className="flex items-center gap-2.5">
                          <CheckCircle2
                            size={13}
                            className={`shrink-0 transition-colors ${met ? 'text-emerald-500' : 'text-slate-400'}`}
                          />
                          <span
                            className={`text-xs transition-colors ${met ? 'text-slate-700' : 'text-slate-500'}`}
                          >
                            {req.label}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <Button
                  type="submit"
                  disabled={!canSubmit || loading}
                  className="h-12 w-full rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-40"
                  style={{ background: ACCENT, boxShadow: '0 4px 20px rgba(43,92,230,0.25)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Updating…
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
