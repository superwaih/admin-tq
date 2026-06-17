'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  Users,
  UserRound,
  ArrowLeft,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/src/hooks/useTheme';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

const roles = [
  {
    id: 'student',
    label: 'Student',
    tagline: "I'm applying to Canadian universities",
    href: '/auth/student',
    icon: GraduationCap,
    accent: '#2b5ce6',
    accentAlpha: 'rgba(43,92,230,0.14)',
    accentBorder: 'rgba(43,92,230,0.35)',
    accentGlow: 'rgba(43,92,230,0.12)',
    features: [
      'Live probability scores for every program',
      'AI-powered AIF drafting & rubric scoring',
      'MMI practice & mock interview scoring',
      'Personalised weekly strategy advisor',
    ],
    cta: 'Sign in as Student',
  },
  {
    id: 'counselor',
    label: 'Counselor',
    tagline: 'I advise students at a secondary school',
    href: '/auth/counselor',
    icon: Users,
    accent: '#0891b2',
    accentAlpha: 'rgba(8,145,178,0.14)',
    accentBorder: 'rgba(8,145,178,0.35)',
    accentGlow: 'rgba(8,145,178,0.12)',
    features: [
      'Full cohort roster & risk dashboard',
      'Cohort analytics across all students',
      'Essay review queue with AI pre-scoring',
      'Automated deadline alerts & flags',
    ],
    cta: 'Sign in as Counselor',
  },
  {
    id: 'parent',
    label: 'Parent',
    tagline: "I'm a parent or guardian of an applicant",
    href: '/auth/parent',
    icon: UserRound,
    accent: '#7c3aed',
    accentAlpha: 'rgba(124,58,237,0.14)',
    accentBorder: 'rgba(124,58,237,0.35)',
    accentGlow: 'rgba(124,58,237,0.12)',
    features: [
      'Read-only family digest',
      'Milestone & deadline tracker',
      'Financial aid snapshot',
      'Privacy protected: no access to essays',
    ],
    cta: 'Sign in as Parent',
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('student');

  const current = roles.find((r) => r.id === selected)!;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 antialiased flex flex-col">

      {/* ── Background glow ─────────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b5ce6]/8 blur-[130px]" />
      </div>

      {/* ── Header ──────────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between border-b border-gray-200 px-5 py-4 lg:px-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <Link href="/" className="font-lora text-xl font-normal tracking-tight text-slate-900">
          AdmitIQ
        </Link>

        <div className="flex items-center justify-end gap-3">
          <Link href="/auth/signup" className="text-xs text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline">
            New account →
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main ────────────────────────────────────────────── */}
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-12 sm:py-16">

        {/* Heading */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#2b5ce6]">
            Welcome back
          </p>
          <h1 className="font-lora text-3xl font-normal text-slate-900 sm:text-4xl lg:text-5xl">
            Who are you signing in as?
          </h1>
          <p className="mx-auto mt-4 max-w-sm text-sm text-slate-500">
            Choose your role to get started. You can switch between linked accounts at any time.
          </p>
        </div>

        {/* ── Mobile tab switcher (sm and below) ── */}
        <div className="mb-6 flex w-full max-w-sm gap-1 rounded-2xl border border-gray-200 bg-white p-1 sm:hidden">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
                  selected === r.id ? 'bg-gray-100 text-slate-900' : 'text-slate-500'
                }`}
              >
                <Icon size={14} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* ── Mobile: single selected card ── */}
        <div className="w-full max-w-sm sm:hidden">
          <RoleCard role={current} isSelected router={router} />
        </div>

        {/* ── Desktop: 3-card grid ── */}
        <div className="hidden w-full max-w-5xl grid-cols-3 gap-5 sm:grid">
          {roles.map((role) => (
            <RoleCard
              key={role.id}
              role={role}
              isSelected={selected === role.id}
              onSelect={() => setSelected(role.id)}
              router={router}
            />
          ))}
        </div>

        {/* Footer */}
        <p className="mt-10 text-center text-xs text-slate-400">
          New to AdmitIQ?{' '}
          <Link href="/auth/signup" className="text-blue-600 dark:text-blue-300 hover:text-[#2b5ce6] transition-colors">
            Create a free account →
          </Link>
        </p>
      </main>
    </div>
  );
}

/* ── Role Card ──────────────────────────────────────────────────────────────── */

interface RoleCardProps {
  role: (typeof roles)[number];
  isSelected: boolean;
  onSelect?: () => void;
  router: ReturnType<typeof useRouter>;
}

function RoleCard({ role, isSelected, onSelect, router }: RoleCardProps) {
  const Icon = role.icon;
  const theme = useTheme((s) => s.theme);
  const isDark = theme === 'dark';

  return (
    <div
      onClick={onSelect}
      className="flex flex-col rounded-2xl border bg-white p-6 lg:p-7 transition-all duration-250 cursor-pointer"
      style={{
        borderColor: isSelected
          ? role.accentBorder
          : isDark
            ? 'rgba(255,255,255,0.06)'
            : 'rgba(15,17,23,0.08)',
        boxShadow: isSelected
          ? `0 0 0 1px ${role.accentBorder}, 0 8px 40px ${isDark ? 'rgba(0,0,0,0.5)' : 'rgba(15,17,23,0.10)'}, 0 0 60px ${role.accentGlow}`
          : isDark
            ? '0 4px 24px rgba(0,0,0,0.35)'
            : '0 4px 24px rgba(15,17,23,0.06)',
        transform: isSelected ? 'translateY(-3px)' : 'translateY(0)',
      }}
    >
      {/* Icon + selected indicator */}
      <div className="mb-5 flex items-start justify-between">
        <div
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl transition-colors"
          style={{
            background: isSelected
              ? role.accentAlpha
              : isDark
                ? 'rgba(255,255,255,0.05)'
                : 'rgba(15,17,23,0.04)',
          }}
        >
          <Icon size={22} style={{ color: isSelected ? role.accent : isDark ? '#8e92ad' : '#64748b' }} />
        </div>

        {isSelected && (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ background: role.accentAlpha, color: role.accent }}
          >
            Selected
          </span>
        )}
      </div>

      {/* Title & tagline */}
      <h3
        className="mb-1 text-lg font-semibold transition-colors"
        style={{
          color: isSelected
            ? isDark ? '#ffffff' : '#0f1117'
            : isDark ? '#c8ccdf' : '#334155',
        }}
      >
        {role.label}
      </h3>
      <p className="mb-6 text-xs leading-relaxed text-slate-500">{role.tagline}</p>

      {/* Features */}
      <ul className="mb-7 flex-1 space-y-3">
        {role.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle2
              size={14}
              className="mt-0.5 shrink-0 transition-colors"
              style={{ color: isSelected ? role.accent : isDark ? '#40455e' : '#cbd5e1' }}
            />
            <span
              className="text-xs leading-relaxed transition-colors"
              style={{
                color: isSelected
                  ? isDark ? '#c8ccdf' : '#334155'
                  : isDark ? '#8e92ad' : '#64748b',
              }}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href={role.href}
        onClick={(e) => e.stopPropagation()}
        className="block"
      >
        <Button
          className="h-11 w-full rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: isSelected
              ? role.accent
              : isDark ? 'rgba(255,255,255,0.05)' : 'rgba(15,17,23,0.04)',
            color: isSelected ? '#ffffff' : isDark ? '#8e92ad' : '#64748b',
            boxShadow: isSelected ? `0 4px 20px ${role.accentGlow}` : 'none',
          }}
        >
          {role.cta}
          {isSelected && <ArrowRight size={15} className="ml-2" />}
        </Button>
      </Link>
    </div>
  );
}
