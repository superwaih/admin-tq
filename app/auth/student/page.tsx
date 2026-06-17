'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  Chrome,
  Link as LinkIcon,
  GraduationCap,
} from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { useTheme } from '@/src/hooks/useTheme';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

const features = [
  {
    title: 'Live probability scores',
    desc: 'Real-time acceptance odds for every program you track',
  },
  {
    title: 'AI essay coach',
    desc: 'AIF rubric scoring + personalised feedback',
  },
  {
    title: 'MMI Simulator',
    desc: '8-station timed mock practice with AI scoring',
  },
  {
    title: 'Strategy Advisor',
    desc: 'Personalised weekly action plan to raise your odds',
  },
];

const ACCENT = '#2b5ce6';

export default function StudentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const { login, socialAuth, loading, error } = useAuth();
  const theme = useTheme((s) => s.theme);
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password }, 'student', rememberMe);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FB] text-slate-900 antialiased">

      {/* ── Left panel ──────────────────────────────────────────── */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-gray-200 bg-white p-12 xl:p-16 lg:flex">

        {/* Background glow */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#2b5ce6]/10 blur-[120px]" />
        <div className="pointer-events-none absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#7c3aed]/6 blur-[100px]" />

        {/* Top: logo + back */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-lora text-xl font-normal tracking-tight text-slate-900">
            AdmitIQ
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft size={13} />
              All roles
            </Link>
            <ThemeToggle />
          </div>
        </div>

        {/* Middle: headline + features */}
        <div className="relative z-10 space-y-10">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(43,92,230,0.14)', color: ACCENT }}
            >
              <GraduationCap size={12} />
              Student Portal
            </div>
            <h1 className="font-lora text-4xl font-normal leading-[1.1] text-slate-900 xl:text-5xl">
              Your admissions
              <br />
              co-pilot awaits.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Sign in to track your odds and continue your AIF draft.
            </p>
          </div>

          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                <div>
                  <p className="text-sm font-semibold text-slate-900">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: testimonial */}
        <div className="relative z-10 rounded-2xl border border-gray-100 bg-gray-50 p-5">
          <p className="text-sm italic leading-relaxed text-slate-700">
            "AdmitIQ told me my Waterloo odds were 61% before I applied — I got in.
            The AIF coach alone was worth it."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: ACCENT }}
            >
              PM
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Priya M.</p>
              <p className="text-[10px] text-slate-500">Waterloo Software Eng · Class of 2028</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ───────────────────────────────────── */}
      <div className="flex flex-1 flex-col">

        {/* Mobile-only header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 lg:hidden">
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          <Link href="/" className="font-lora text-lg font-normal text-slate-900">
            AdmitIQ
          </Link>
          <ThemeToggle />
        </header>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[400px] space-y-7">

            {/* Heading */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  AdmitIQ
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: 'rgba(43,92,230,0.15)', color: ACCENT }}
                >
                  ✦ Student
                </span>
              </div>
              <h2 className="font-lora text-3xl font-normal text-slate-900">Welcome back</h2>
              <p className="text-sm text-slate-500">Sign in to your student account</p>
            </div>

            {/* Error banner */}
            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Email address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="priya.mehta@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Password
                  </label>
                  <Link
                    href="/auth/reset-password"
                    className="text-xs font-medium transition-colors"
                    style={{ color: ACCENT }}
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition-colors hover:text-slate-900"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember me */}
              <label className="flex cursor-pointer items-center gap-2.5 select-none">
                <div
                  onClick={() => setRememberMe((v) => !v)}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
                  style={{
                    background: rememberMe ? ACCENT : 'transparent',
                    borderColor: rememberMe ? ACCENT : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,17,23,0.2)',
                  }}
                >
                  {rememberMe && (
                    <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-slate-500">Remember me for 30 days</span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: ACCENT, boxShadow: '0 4px 20px rgba(43,92,230,0.3)' }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign in to Student Portal'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => socialAuth('google')}
                className="auth-social-btn"
              >
                <Chrome size={15} className="text-slate-500" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => socialAuth('apple')}
                className="auth-social-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-slate-500">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* OUAC banner */}
            <button
              type="button"
              onClick={() => socialAuth('ouac' as any)}
              className="flex w-full items-center gap-4 rounded-xl border border-[#2b5ce6]/20 bg-[#2b5ce6]/[0.07] px-4 py-3.5 text-left transition-all hover:border-[#2b5ce6]/40 hover:bg-[#2b5ce6]/[0.12]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2b5ce6]/25 bg-[#2b5ce6]/15">
                <LinkIcon size={15} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">Sign in with OUAC</p>
                <p className="mt-0.5 text-[10px] leading-tight text-slate-500">
                  Ontario Universities Application Centre — auto-imports your grades
                </p>
              </div>
            </button>

            {/* Footer */}
            <p className="text-center text-sm text-slate-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/auth/student/register"
                className="font-semibold transition-colors hover:text-slate-900"
                style={{ color: ACCENT }}
              >
                Create free account →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
