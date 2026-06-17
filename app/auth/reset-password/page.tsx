'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, KeyRound, Mail, Loader2, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

const ACCENT = '#2b5ce6';
const ACCENT_ALPHA = 'rgba(43,92,230,0.14)';
const ACCENT_BORDER = 'rgba(43,92,230,0.35)';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { requestPasswordReset, loading, error, setError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const success = await requestPasswordReset(email);
    if (success) setIsSubmitted(true);
  };

  const handleRetry = async () => {
    const success = await requestPasswordReset(email);
    if (success) setIsSubmitted(true);
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
          href="/auth"
          className="mb-8 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>

        {/* Card */}
        <div className="rounded-3xl border border-gray-100 bg-white p-8 sm:p-10">

          {isSubmitted ? (
            /* ── Success state ────────────────────────────────────── */
            <div className="flex flex-col items-center text-center space-y-6">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(16,185,129,0.14)' }}
              >
                <CheckCircle2 size={30} className="text-emerald-400" />
              </div>

              <div className="space-y-2">
                <h2 className="font-lora text-2xl font-normal text-slate-900">Check your inbox</h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  We sent a password reset link to
                </p>
                <p className="text-sm font-semibold text-slate-900">{email}</p>
                <p className="text-xs text-slate-500">
                  The link expires in 15 minutes. Check your spam folder if you don't see it.
                </p>
              </div>

              <div className="w-full space-y-3">
                <Link href="/auth" className="block w-full">
                  <Button
                    className="h-12 w-full rounded-xl text-sm font-semibold text-white"
                    style={{ background: ACCENT, boxShadow: '0 4px 20px rgba(43,92,230,0.25)' }}
                  >
                    Back to sign in
                  </Button>
                </Link>

                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-xs font-medium text-slate-500 transition-all hover:bg-gray-50 hover:text-slate-900 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RotateCcw size={14} />
                  )}
                  Resend email
                </button>
              </div>
            </div>

          ) : (
            /* ── Request form ─────────────────────────────────────── */
            <div className="space-y-7">
              {/* Icon */}
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: ACCENT_ALPHA }}
              >
                <KeyRound size={26} style={{ color: ACCENT }} />
              </div>

              {/* Heading */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    AdmitIQ
                  </span>
                </div>
                <h2 className="font-lora text-3xl font-normal text-slate-900">Reset your password</h2>
                <p className="text-sm leading-relaxed text-slate-500">
                  Enter your email and we'll send a reset link within 2 minutes.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      autoComplete="email"
                      placeholder="your.email@example.com"
                      value={email}
                      required
                      disabled={loading}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="auth-input pl-10"
                      style={
                        error
                          ? { borderColor: 'rgba(239,68,68,0.5)', boxShadow: '0 0 0 3px rgba(239,68,68,0.1)' }
                          : {}
                      }
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="h-12 w-full rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: ACCENT, boxShadow: '0 4px 20px rgba(43,92,230,0.25)' }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Sending…
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>

              {/* Footer */}
              <p className="text-center text-xs text-slate-400">
                Didn't receive an email? Check your spam folder or{' '}
                <button
                  type="button"
                  onClick={handleRetry}
                  disabled={loading || !email}
                  className="font-semibold transition-colors disabled:opacity-40"
                  style={{ color: ACCENT }}
                >
                  try again
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
