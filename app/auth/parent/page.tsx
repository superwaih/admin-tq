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
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';

const features = [
  {
    title: 'Family Digest',
    desc: 'Read-only view of your student\'s applications and progress',
  },
  {
    title: 'Milestone Tracker',
    desc: 'Upcoming deadlines, interviews, and offer dates at a glance',
  },
  {
    title: 'Financial Snapshot',
    desc: 'Scholarship opportunities and estimated aid packages',
  },
  {
    title: 'Privacy Protected',
    desc: 'No access to private essay drafts without student permission',
  },
];

const ACCENT = '#7c3aed';
const ACCENT_ALPHA = 'rgba(124,58,237,0.14)';
const ACCENT_BORDER = 'rgba(124,58,237,0.35)';
const ACCENT_GLOW = 'rgba(124,58,237,0.12)';

export default function ParentLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password }, 'parent', rememberMe);
  };

  return (
    <div className="flex min-h-screen bg-[#070b14] text-white antialiased">

      {/* ── Background glow ─────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/8 blur-[130px]" />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#2b5ce6]/5 blur-[100px]" />
      </div>

      {/* ── Left panel ──────────────────────────────────────── */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-[#080c18] p-12 xl:p-16 lg:flex">

        {/* Top: logo + back */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-lora text-xl font-normal tracking-tight text-white">
            AdmitIQ
          </Link>
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-xs text-[#8e92ad] transition-colors hover:text-white"
          >
            <ArrowLeft size={13} />
            All roles
          </Link>
        </div>

        {/* Middle: headline + features */}
        <div className="relative z-10 space-y-10">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: ACCENT_ALPHA, color: ACCENT }}
            >
              <UserRound size={12} />
              Family Dashboard
            </div>
            <h1 className="font-lora text-4xl font-normal leading-[1.1] text-white xl:text-5xl">
              Stay in the loop.
              <br />
              Stay supportive.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#8e92ad]">
              Monitor your student's admissions journey without the friction.
            </p>
          </div>

          <ul className="space-y-5">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3.5">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                <div>
                  <p className="text-sm font-semibold text-white">{f.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-[#8e92ad]">{f.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom: testimonial */}
        <div className="relative z-10 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
          <p className="text-sm italic leading-relaxed text-[#c8ccdf]">
            "I finally felt like I understood what my son was going through.
            The milestone tracker made every deadline feel manageable."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: ACCENT }}
            >
              MR
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Margaret R.</p>
              <p className="text-[10px] text-[#8e92ad]">Parent · Toronto, ON</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ───────────────────────────────── */}
      <div className="flex flex-1 flex-col">

        {/* Mobile-only header */}
        <header className="flex items-center justify-between border-b border-white/[0.06] px-5 py-4 lg:hidden">
          <Link
            href="/auth"
            className="flex items-center gap-1.5 text-sm text-[#8e92ad] hover:text-white transition-colors"
          >
            <ArrowLeft size={15} />
            Back
          </Link>
          <Link href="/" className="font-lora text-lg font-normal text-white">
            AdmitIQ
          </Link>
          <div className="w-12" />
        </header>

        {/* Form area */}
        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[400px] space-y-7">

            {/* Heading */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">
                  AdmitIQ
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                  style={{ background: ACCENT_ALPHA, color: ACCENT }}
                >
                  ✦ Parent
                </span>
              </div>
              <h2 className="font-lora text-3xl font-normal text-white">Guardian sign in</h2>
              <p className="text-sm text-[#8e92ad]">View-only access to your student's progress</p>
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">
                  Email address
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="m.roberts@outlook.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="auth-input"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">
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
                    className="absolute inset-y-0 right-3 flex items-center text-[#8e92ad] transition-colors hover:text-white"
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
                    borderColor: rememberMe ? ACCENT : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {rememberMe && (
                    <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-[#8e92ad]">Remember this device</span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                style={{ background: ACCENT, boxShadow: `0 4px 20px ${ACCENT_GLOW}` }}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Connecting…
                  </>
                ) : (
                  'Sign in to Family Dashboard'
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/[0.07]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#40455e]">
                or sign in with
              </span>
              <div className="h-px flex-1 bg-white/[0.07]" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="auth-social-btn">
                <Chrome size={15} className="text-[#8e92ad]" />
                <span>Google</span>
              </button>
              <button type="button" className="auth-social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-[#8e92ad]">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Privacy notice */}
            <div
              className="flex items-start gap-4 rounded-xl border px-4 py-3.5"
              style={{ borderColor: ACCENT_BORDER, background: ACCENT_ALPHA }}
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                style={{ borderColor: ACCENT_BORDER, background: 'rgba(124,58,237,0.2)' }}
              >
                <ShieldCheck size={15} style={{ color: ACCENT }} />
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Privacy Notice</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[#8e92ad]">
                  Parent accounts are read-only. Private essay drafts are never accessible without explicit student permission.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="space-y-2 text-center">
              <p className="text-sm text-[#8e92ad]">
                New to AdmitIQ?{' '}
                <Link
                  href="/auth/parent/signup"
                  className="font-semibold transition-colors hover:text-white"
                  style={{ color: ACCENT }}
                >
                  Create parent account →
                </Link>
              </p>
              <p className="text-xs text-[#40455e]">
                Need to link a student?{' '}
                <Link
                  href="/auth/parent/link"
                  className="transition-colors hover:text-[#8e92ad]"
                  style={{ color: '#6b6f8a' }}
                >
                  Enter link code →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
