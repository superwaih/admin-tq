'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Eye, EyeOff, Loader2, ArrowLeft, GraduationCap, Users, UserRound,
  Chrome, Link as LinkIcon, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { useTheme } from '@/src/hooks/useTheme';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

const roles = [
  { id: 'student', label: 'Student', icon: GraduationCap, accent: '#2b5ce6', accentAlpha: 'rgba(43,92,230,0.14)', accentBorder: 'rgba(43,92,230,0.35)' },
  { id: 'counselor', label: 'Counselor', icon: Users, accent: '#0891b2', accentAlpha: 'rgba(8,145,178,0.14)', accentBorder: 'rgba(8,145,178,0.35)' },
  { id: 'parent', label: 'Parent', icon: UserRound, accent: '#7c3aed', accentAlpha: 'rgba(124,58,237,0.14)', accentBorder: 'rgba(124,58,237,0.35)' },
];

const benefits = [
  'Live AI acceptance probability scores',
  'AI-powered AIF drafting & rubric scoring',
  'MMI Simulator with instant feedback',
  'Personalised weekly strategy advisor',
];

const ACCENT = '#2b5ce6';

export default function SignupPage() {
  const searchParams = useSearchParams();
  const defaultRole = (searchParams?.get('role') as string) || 'student';

  const [role, setRole] = useState(defaultRole);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms]   = useState(false);

  const { register, socialAuth, loading, error } = useAuth();
  const theme = useTheme((s) => s.theme);
  const isDark = theme === 'dark';

  const currentRole = roles.find((r) => r.id === role)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) return;
    await register({ email, password, role: role as any });
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 antialiased">

      <ThemeToggle floating />

      {/* ── Background glow ─────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#2b5ce6]/8 blur-[130px]" />
        <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#7c3aed]/5 blur-[100px]" />
      </div>

      {/* ── Left panel (desktop) — permanent dark brand panel ── */}
      <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden border-r border-white/[0.06] bg-[#080c18] p-12 xl:p-16 lg:flex">
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/" className="font-lora text-xl font-normal tracking-tight text-white">
            AdmitIQ
          </Link>
          <Link href="/auth" className="flex items-center gap-1.5 text-xs text-[#8e92ad] hover:text-white transition-colors">
            <ArrowLeft size={13} /> Sign in instead
          </Link>
        </div>

        <div className="relative z-10 space-y-10">
          <div>
            <div
              className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
              style={{ background: 'rgba(43,92,230,0.14)', color: ACCENT }}
            >
              Free forever · No credit card
            </div>
            <h1 className="font-lora text-4xl font-normal leading-[1.1] text-white xl:text-5xl">
              Your admissions
              <br />
              edge starts here.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#8e92ad]">
              Join 12,000+ Canadian students making smarter application decisions with AI.
            </p>
          </div>

          <ul className="space-y-5">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3.5">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                <span className="text-sm text-[#c8ccdf]">{b}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Testimonial */}
        <div className="relative z-10 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
          <p className="text-sm italic leading-relaxed text-[#c8ccdf]">
            "I went from no idea where I stood to knowing my exact odds at every school.
            AdmitIQ changed how I applied."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: ACCENT }}>
              AK
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Aryan K.</p>
              <p className="text-[10px] text-[#8e92ad]">Admitted to UofT Life Sci · Class of 2028</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ───────────────────────────────── */}
      <div className="flex flex-1 flex-col">

        {/* Mobile header */}
        <header className="flex items-center justify-between border-b border-gray-200 px-5 py-4 lg:hidden">
          <Link href="/auth" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft size={15} /> Back
          </Link>
          <Link href="/" className="font-lora text-lg font-normal text-slate-900">AdmitIQ</Link>
          <div className="w-12" />
        </header>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10">
          <div className="w-full max-w-[420px] space-y-6">

            {/* Heading */}
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500">AdmitIQ</p>
              <h2 className="font-lora text-3xl font-normal text-slate-900">Create free account</h2>
              <p className="mt-1 text-sm text-slate-500">No credit card required. Start in seconds.</p>
            </div>

            {/* Role picker */}
            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">I am a…</p>
              <div className="flex gap-2">
                {roles.map((r) => {
                  const Icon = r.icon;
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className="flex flex-1 flex-col items-center gap-1.5 rounded-xl border py-3 text-xs font-medium transition-all"
                      style={{
                        borderColor: active ? r.accentBorder : (isDark ? 'rgba(255,255,255,0.07)' : '#e2e5ec'),
                        background: active ? r.accentAlpha : (isDark ? 'rgba(255,255,255,0.03)' : '#ffffff'),
                        color: active ? (isDark ? '#ffffff' : '#0f1117') : (isDark ? '#8e92ad' : '#6b7280'),
                        boxShadow: active ? `0 0 20px ${r.accentAlpha}` : 'none',
                      }}
                    >
                      <Icon size={16} style={{ color: active ? r.accent : (isDark ? '#8e92ad' : '#6b7280') }} />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">First name</label>
                  <input
                    type="text"
                    autoComplete="given-name"
                    placeholder="Priya"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Last name</label>
                  <input
                    type="text"
                    autoComplete="family-name"
                    placeholder="Mehta"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Email address</label>
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-2.5 select-none">
                <div
                  onClick={() => setAcceptTerms((v) => !v)}
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors"
                  style={{
                    background: acceptTerms ? currentRole.accent : 'transparent',
                    borderColor: acceptTerms ? currentRole.accent : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(15,17,23,0.25)'),
                  }}
                >
                  {acceptTerms && (
                    <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-xs leading-relaxed text-slate-500">
                  I agree to the{' '}
                  <Link href="/terms" className="underline transition-colors hover:opacity-80" style={{ color: currentRole.accent }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline transition-colors hover:opacity-80" style={{ color: currentRole.accent }}>
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !acceptTerms}
                className="h-12 w-full rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{
                  background: currentRole.accent,
                  boxShadow: `0 4px 20px ${currentRole.accentAlpha}`,
                }}
              >
                {loading ? (
                  <><Loader2 size={16} className="mr-2 animate-spin" /> Creating account…</>
                ) : (
                  `Create ${currentRole.label} Account`
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">or continue with</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => socialAuth('google')} className="auth-social-btn">
                <Chrome size={15} className="text-slate-500" />
                <span>Google</span>
              </button>
              <button type="button" className="auth-social-btn">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 text-slate-500">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* OUAC — only for student */}
            {role === 'student' && (
              <button
                type="button"
                className="flex w-full items-center gap-4 rounded-xl border border-[#2b5ce6]/20 bg-[#2b5ce6]/[0.07] px-4 py-3.5 text-left transition-all hover:border-[#2b5ce6]/40 hover:bg-[#2b5ce6]/[0.12]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#2b5ce6]/25 bg-[#2b5ce6]/15">
                  <LinkIcon size={15} style={{ color: ACCENT }} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">Sign up with OUAC</p>
                  <p className="mt-0.5 text-[10px] leading-tight text-slate-500">
                    Ontario Universities Application Centre — auto-imports your grades
                  </p>
                </div>
              </button>
            )}

            <p className="text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/auth" className="font-semibold transition-colors hover:opacity-80" style={{ color: ACCENT }}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
