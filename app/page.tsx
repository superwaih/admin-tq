'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle2,
  Target,
  BookOpen,
  Mic,
  Shield,
  TrendingUp,
  Users,
  Sparkles,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact Us', href: '/contact' },
];

const stats = [
  { value: '94%', label: 'Prediction accuracy' },
  { value: '12,000+', label: 'Students matched' },
  { value: '3.2×', label: 'Avg probability gain' },
  { value: '#1', label: 'Rated OUAC tool' },
];

const features = [
  {
    icon: Target,
    title: 'Admission Simulator',
    description:
      'Live acceptance probabilities for every Canadian program — updated in real-time as your grades change.',
    accent: '#2b5ce6',
    bg: 'rgba(43,92,230,0.12)',
  },
  {
    icon: BookOpen,
    title: 'AI Essay Coach',
    description:
      "Draft, refine and score AIF essays with AI that knows every school's rubric inside-out.",
    accent: '#0ca678',
    bg: 'rgba(12,166,120,0.12)',
  },
  {
    icon: Mic,
    title: 'MMI Simulator',
    description:
      'Practice medical-school interviews with AI feedback and per-question scoring on demand.',
    accent: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
  },
  {
    icon: TrendingUp,
    title: 'Strategy Advisor',
    description:
      'Personalised weekly action plans that move the needle on your acceptance odds every week.',
    accent: '#d97706',
    bg: 'rgba(217,119,6,0.12)',
  },
  {
    icon: Shield,
    title: 'Grade Tracker',
    description:
      'Monitor your prerequisite GPA and receive smart alerts when you approach cutoff thresholds.',
    accent: '#dc2626',
    bg: 'rgba(220,38,38,0.12)',
  },
  {
    icon: Users,
    title: 'Counselor Tools',
    description:
      'Full cohort roster, risk dashboard, and essay review queue purpose-built for school counselors.',
    accent: '#0891b2',
    bg: 'rgba(8,145,178,0.12)',
  },
];

const personas = [
  {
    id: 'student',
    label: 'Student',
    tagline: "I'm applying to Canadian universities",
    accent: '#2b5ce6',
    perks: [
      'Live probability scores for every program',
      'AI-powered AIF drafting & rubric scoring',
      'MMI practice & mock interview scoring',
      'Personalised weekly strategy advisor',
    ],
    cta: 'Sign in as Student',
    href: '/auth/student',
  },
  {
    id: 'counselor',
    label: 'Counselor',
    tagline: 'I advise students at a secondary school',
    accent: '#0891b2',
    perks: [
      'Full cohort roster & risk dashboard',
      'Cohort analytics across all students',
      'Essay review queue with AI pre-scoring',
      'Automated deadline alerts & flags',
    ],
    cta: 'Sign in as Counselor',
    href: '/auth/counselor',
  },
  {
    id: 'parent',
    label: 'Parent',
    tagline: "I'm a parent or guardian of an applicant",
    accent: '#7c3aed',
    perks: [
      'Read-only family digest',
      'Milestone & deadline tracker',
      'Financial aid snapshot',
      'Privacy protected: no access to essays',
    ],
    cta: 'Sign in as Parent',
    href: '/auth/parent',
  },
];

const universities = ['UofT', 'Waterloo', 'UBC', 'McMaster', "Queen's", 'Western', 'Ottawa', 'McGill'];

const dashboardStats = [
  { label: 'AVG PROB', value: '68%', color: '#f59e0b' },
  { label: 'PROGRAMS', value: '5', color: '#2b5ce6' },
  { label: 'DAYS LEFT', value: '47', color: '#dc2626' },
  { label: 'PROGRESS', value: '60%', color: '#0ca678' },
];

const programs = [
  { name: 'Engineering Science', school: 'U of T', prob: 72, bar: '#f59e0b' },
  { name: 'Computer Science', school: 'Waterloo', prob: 58, bar: '#f59e0b' },
  { name: 'Science (BSc)', school: 'UBC', prob: 89, bar: '#0ca678' },
];

export default function LandingPage() {
  const [activePersona, setActivePersona] = useState('student');
  const [menuOpen, setMenuOpen] = useState(false);

  const currentPersona = personas.find((p) => p.id === activePersona)!;

  return (
    <div className="min-h-screen bg-[#070b14] text-white antialiased overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-lora text-xl font-normal text-white tracking-tight">AdmitIQ</span>
            <span className="rounded-full bg-[#2b5ce6]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#7b9ef0]">
              Beta
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-sm text-[#8e92ad] hover:text-white transition-colors duration-150"
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth/signup">
              <Button className="h-9 rounded-full bg-[#2b5ce6] px-5 text-sm font-semibold text-white hover:bg-[#254ec3] shadow-lg shadow-[#2b5ce6]/20">
                Get started free
              </Button>
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-[#8e92ad] hover:text-white transition-colors"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#070b14] px-5 py-5 space-y-4">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="block text-sm text-[#8e92ad] hover:text-white py-1 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                <Button className="w-full rounded-full bg-[#2b5ce6] text-sm font-semibold text-white hover:bg-[#254ec3]">
                  Get started free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 pb-20 pt-24 sm:pt-32">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b5ce6]/10 blur-[140px]" />
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-[#7c3aed]/7 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[400px] rounded-full bg-[#2b5ce6]/6 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ── Left: Copy ─────────────────────────────────── */}
            <div className="flex flex-col items-start">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2b5ce6]/30 bg-[#2b5ce6]/10 px-4 py-1.5 text-xs font-medium text-[#7b9ef0]">
                <Sparkles size={11} />
                Built for Canadian Grade 12 students
              </div>

              <h1 className="font-lora text-[42px] leading-[1.06] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl">
                Your AI-powered
                <br />
                <span className="admitiq-gradient-text">admissions co-pilot.</span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-[#8e92ad] sm:text-lg">
                Get your exact acceptance probability, AI-crafted essays, MMI practice,
                and a personalised weekly strategy — all in one place.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/auth/signup">
                  <Button className="h-12 w-full rounded-full bg-[#2b5ce6] px-8 text-sm font-semibold text-white shadow-xl shadow-[#2b5ce6]/25 hover:bg-[#254ec3] hover:shadow-[#2b5ce6]/40 hover:scale-[1.02] transition-all duration-200 sm:w-auto">
                    Start for free <ArrowRight size={15} className="ml-2" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="ghost" className="h-12 w-full rounded-full border border-white/10 bg-white/[0.04] px-8 text-sm text-[#c8ccdf] hover:bg-white/[0.08] hover:text-white transition-all sm:w-auto">
                    Sign in →
                  </Button>
                </Link>
              </div>

              <p className="mt-3 text-xs text-[#40455e]">No credit card required · Free Essentials Plan</p>

              {/* Social proof avatars */}
              <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-3.5">
                <div className="flex -space-x-2.5">
                  {['#2b5ce6','#0ca678','#7c3aed','#d97706','#dc2626'].map((c, i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#070b14] flex items-center justify-center text-[10px] font-bold text-white" style={{ background: c }}>
                      {['P','A','J','S','R'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">12,000+ students</p>
                  <p className="text-[11px] text-[#8e92ad]">already boosting their odds</p>
                </div>
              </div>
            </div>

            {/* ── Right: Phone mockup ─────────────────────────── */}
            <div className="relative flex items-center justify-center lg:justify-end">

              {/* Glow behind phone */}
              <div className="absolute h-[420px] w-[340px] rounded-full bg-[#2b5ce6]/15 blur-[80px]" />

              {/* Floating chip — top left */}
              <div className="absolute left-2 top-[8%] z-20 flex items-center gap-2 rounded-2xl border border-white/10 bg-[#0d1020]/95 px-3 py-2.5 shadow-2xl backdrop-blur-sm">
                <div className="h-2 w-2 rounded-full bg-[#0ca678] animate-pulse" />
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e92ad]">OUAC Live</p>
                  <p className="text-xs font-bold text-[#0ca678]">Connected</p>
                </div>
              </div>

              {/* Floating chip — top right */}
              <div className="absolute right-0 top-[22%] z-20 rounded-2xl border border-white/10 bg-[#0d1020]/95 px-3 py-2.5 shadow-2xl backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e92ad]">Avg Probability</p>
                <p className="text-base font-bold text-[#f59e0b]">68.8% <span className="text-[11px] text-[#0ca678]">↑ +4%</span></p>
              </div>

              {/* Floating chip — bottom left */}
              <div className="absolute bottom-[20%] left-0 z-20 flex items-center gap-2.5 rounded-2xl border border-white/10 bg-[#0d1020]/95 px-3 py-2.5 shadow-2xl backdrop-blur-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d97706]/15 text-sm">⚠️</div>
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e92ad]">Next Deadline</p>
                  <p className="text-xs font-bold text-[#d97706]">UofT AIF · 7 days</p>
                </div>
              </div>

              {/* Floating chip — bottom right */}
              <div className="absolute bottom-[8%] right-2 z-20 rounded-2xl border border-white/10 bg-[#0d1020]/95 px-3 py-2.5 shadow-2xl backdrop-blur-sm">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e92ad]">This week</p>
                <p className="text-xs font-bold text-[#7b9ef0]">+16pp UofT odds 🚀</p>
              </div>

              {/* Phone image */}
              <div className="relative z-10 py-12" style={{ transform: 'perspective(900px) rotateY(-6deg) rotateX(2deg)' }}>
                <img
                  src="/app-hero.png"
                  alt="AdmitIQ mobile app dashboard"
                  className="w-[260px] drop-shadow-[0_40px_80px_rgba(0,0,0,0.8)] sm:w-[300px]"
                  style={{ filter: 'drop-shadow(0 0 40px rgba(43,92,230,0.2))' }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Trust strip ────────────────────────────────────────── */}
      <section className="border-y border-white/[0.05] bg-[#0b0f1c] py-5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
            <p className="shrink-0 text-[10px] font-bold uppercase tracking-widest text-[#40455e]">
              Trusted by students at
            </p>
            <div className="hidden h-4 w-px bg-white/10 sm:block" />
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1.5">
              {universities.map((u) => (
                <span key={u} className="text-sm font-medium text-[#8e92ad]">{u}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-6 py-8 text-center transition-colors hover:bg-white/[0.04]"
              >
                <p className="font-lora text-4xl font-normal text-white">{s.value}</p>
                <p className="mt-2 text-sm text-[#8e92ad]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="px-5 py-24">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="mb-16 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2b5ce6]">Everything you need</p>
            <h2 className="font-lora text-3xl font-normal text-white sm:text-4xl">Built for serious applicants</h2>
            <p className="mx-auto mt-4 max-w-xl text-[#8e92ad]">
              Every tool you need to maximise your chances — from first research to final submission.
            </p>
          </div>

          {/* ── Feature row 1: Admission Simulator ── */}
          <div className="mb-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0f1c]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Phone side */}
              <div className="relative flex items-end justify-center overflow-hidden bg-gradient-to-br from-[#2b5ce6]/10 via-transparent to-transparent px-8 pt-10 pb-0 min-h-[320px]">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute bottom-0 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[#2b5ce6]/20 blur-[60px]" />
                </div>
                {/* Floating probability card */}
                <div className="absolute top-6 right-6 z-20 rounded-2xl border border-white/10 bg-[#0d1020]/90 px-3 py-2.5 shadow-xl backdrop-blur-sm">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e92ad]">UofT Eng Science</p>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-[72%] rounded-full bg-[#f59e0b]" />
                    </div>
                    <span className="text-sm font-bold text-[#f59e0b]">72%</span>
                  </div>
                </div>
                <div className="absolute top-16 left-5 z-20 rounded-2xl border border-white/10 bg-[#0d1020]/90 px-3 py-2 shadow-xl backdrop-blur-sm">
                  <p className="text-[9px] text-[#8e92ad]">Waterloo CS</p>
                  <p className="text-sm font-bold text-[#f59e0b]">58% <span className="text-[10px] text-[#0ca678]">↑ +3%</span></p>
                </div>
                <img
                  src="/app-mobile.png"
                  alt="Admission Simulator on mobile"
                  className="relative z-10 w-[210px] drop-shadow-2xl sm:w-[240px]"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(43,92,230,0.25))' }}
                />
              </div>
              {/* Text side */}
              <div className="flex flex-col justify-center px-8 py-10 lg:px-12">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(43,92,230,0.12)]">
                  <Target size={20} className="text-[#2b5ce6]" />
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2b5ce6]">Feature #1</p>
                <h3 className="font-lora text-2xl font-normal text-white sm:text-3xl">Admission Simulator</h3>
                <p className="mt-3 text-[#8e92ad] leading-relaxed">
                  Live acceptance probabilities for every Canadian university program — updated in real-time as your grades change. See exactly where you stand and what to improve.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {['Real-time probability for 50+ Canadian programs','Grade sensitivity — see impact of every 1%','OUAC live data integration','Cutoff alerts when you approach thresholds'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-[#c8ccdf]">
                      <CheckCircle2 size={14} className="shrink-0 text-[#2b5ce6]" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="mt-8">
                  <Button className="rounded-full bg-[#2b5ce6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#254ec3] shadow-lg shadow-[#2b5ce6]/20 hover:shadow-[#2b5ce6]/40 transition-all">
                    Try the Simulator <ArrowRight size={14} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* ── Feature row 2: AI Essay Coach ── */}
          <div className="mb-5 overflow-hidden rounded-3xl border border-white/[0.07] bg-[#0b0f1c]">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Text side */}
              <div className="flex flex-col justify-center px-8 py-10 lg:px-12 lg:order-1">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[rgba(12,166,120,0.12)]">
                  <BookOpen size={20} className="text-[#0ca678]" />
                </div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#0ca678]">Feature #2</p>
                <h3 className="font-lora text-2xl font-normal text-white sm:text-3xl">AI Essay Coach</h3>
                <p className="mt-3 text-[#8e92ad] leading-relaxed">
                  Draft, refine and score AIF essays with AI that knows every school's rubric inside-out. Get sentence-level feedback, structure suggestions, and a final score before you submit.
                </p>
                <ul className="mt-5 space-y-2.5">
                  {['Per-sentence AI feedback & rewrite suggestions','Rubric scoring for UofT, Waterloo, McMaster & more','Plagiarism-safe — your voice, enhanced by AI','Essay history & version comparison'].map(t => (
                    <li key={t} className="flex items-center gap-2.5 text-sm text-[#c8ccdf]">
                      <CheckCircle2 size={14} className="shrink-0 text-[#0ca678]" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="mt-8">
                  <Button className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all shadow-lg hover:opacity-90" style={{ background: '#0ca678', boxShadow: '0 8px 24px rgba(12,166,120,0.2)' }}>
                    Try Essay Coach <ArrowRight size={14} className="ml-2" />
                  </Button>
                </Link>
              </div>
              {/* Essay UI mockup side */}
              <div className="relative flex items-center justify-center overflow-hidden bg-gradient-to-bl from-[#0ca678]/8 via-transparent to-transparent px-8 py-10 lg:order-2">
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-64 w-64 rounded-full bg-[#0ca678]/10 blur-[80px]" />
                  </div>
                </div>
                {/* Essay coach CSS mockup */}
                <div className="relative z-10 w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0d1020] shadow-2xl overflow-hidden">
                  {/* Titlebar */}
                  <div className="flex items-center justify-between border-b border-white/[0.06] bg-[#0f1428] px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <BookOpen size={12} className="text-[#0ca678]" />
                      <span className="text-[11px] font-semibold text-white">AIF Essay · UofT Engineering</span>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full border border-[#0ca678]/30 bg-[#0ca678]/10 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#0ca678]" />
                      <span className="text-[9px] font-bold text-[#0ca678]">Score: 87/100</span>
                    </div>
                  </div>
                  {/* Essay text area mock */}
                  <div className="p-4 space-y-2">
                    <p className="text-[11px] leading-relaxed text-[#c8ccdf]">
                      My passion for problem-solving began when I redesigned our school's recycling system, <span className="rounded bg-[#0ca678]/20 px-0.5 text-[#0ca678]">reducing waste by 40%</span> through data analysis and community engagement...
                    </p>
                    <p className="text-[11px] leading-relaxed text-[#8e92ad]">
                      <span className="rounded bg-[#d97706]/15 border-b border-[#d97706]/40 text-[#d97706]">This experience shaped my desire</span> to study engineering at the University of Toronto.
                    </p>
                  </div>
                  {/* Feedback panel */}
                  <div className="border-t border-white/[0.06] bg-white/[0.02] p-4 space-y-2">
                    <p className="text-[9px] font-bold uppercase tracking-widest text-[#8e92ad]">AI Feedback</p>
                    <div className="flex items-start gap-2 rounded-xl border border-[#0ca678]/20 bg-[#0ca678]/8 px-3 py-2">
                      <span className="text-[10px]">✅</span>
                      <p className="text-[10px] text-[#0ca678]"><strong>Strong:</strong> Quantified impact with specific data point. UofT rubric rewards measurable results.</p>
                    </div>
                    <div className="flex items-start gap-2 rounded-xl border border-[#d97706]/20 bg-[#d97706]/8 px-3 py-2">
                      <span className="text-[10px]">💡</span>
                      <p className="text-[10px] text-[#d97706]"><strong>Suggestion:</strong> Replace "desire" with a more active verb — "drives me to" or "motivates my pursuit of".</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Remaining 4 feature cards ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.slice(2).map((f) => (
              <div key={f.title} className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:-translate-y-0.5">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: f.bg }}>
                  <f.icon size={20} style={{ color: f.accent }} />
                </div>
                <h3 className="mb-2 text-sm font-semibold text-white">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[#8e92ad]">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who is it for ──────────────────────────────────────── */}
      <section className="bg-[#0b0f1c] px-5 py-24">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2b5ce6]">Made for everyone</p>
            <h2 className="font-lora text-3xl font-normal text-white sm:text-4xl">Who is AdmitIQ for?</h2>
            <p className="mt-4 text-[#8e92ad]">Choose your role to explore what AdmitIQ does for you.</p>
          </div>

          {/* Persona tabs */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex gap-1 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-1">
              {personas.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePersona(p.id)}
                  className={`rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-200 ${
                    activePersona === p.id ? 'bg-white/10 text-white shadow-sm' : 'text-[#8e92ad] hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Split card */}
          <div
            key={currentPersona.id}
            className="overflow-hidden rounded-3xl border bg-[#0d1020] transition-all duration-300"
            style={{ borderColor: `${currentPersona.accent}22` }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5">

              {/* ── Left: perks (3/5) ── */}
              <div className="flex flex-col justify-center px-8 py-12 lg:col-span-3 lg:px-12">
                <div
                  className="mb-4 inline-flex items-center gap-2 self-start rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest"
                  style={{ background: `${currentPersona.accent}1a`, color: currentPersona.accent }}
                >
                  {currentPersona.label}
                </div>

                <p className="mb-2 font-lora text-2xl font-normal text-white sm:text-3xl">{currentPersona.tagline}</p>
                <p className="mb-8 text-sm text-[#8e92ad]">Here's exactly what AdmitIQ gives you:</p>

                <ul className="mb-10 space-y-4">
                  {currentPersona.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-3.5">
                      <div
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                        style={{ background: `${currentPersona.accent}20` }}
                      >
                        <CheckCircle2 size={12} style={{ color: currentPersona.accent }} />
                      </div>
                      <span className="text-sm text-white leading-relaxed">{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link href={currentPersona.href} className="self-start">
                  <Button
                    className="h-12 rounded-xl px-8 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:scale-[1.02]"
                    style={{ background: currentPersona.accent, boxShadow: `0 8px 24px ${currentPersona.accent}30` }}
                  >
                    {currentPersona.cta} <ChevronRight size={15} className="ml-1" />
                  </Button>
                </Link>
              </div>

              {/* ── Right: phone mockup (2/5) ── */}
              <div
                className="relative flex items-end justify-center overflow-hidden px-8 pt-10 pb-0 min-h-[300px] lg:col-span-2"
                style={{ background: `linear-gradient(135deg, ${currentPersona.accent}0d 0%, transparent 60%)` }}
              >
                <div className="pointer-events-none absolute inset-0">
                  <div
                    className="absolute bottom-0 left-1/2 h-48 w-64 -translate-x-1/2 rounded-full blur-[60px]"
                    style={{ background: `${currentPersona.accent}18` }}
                  />
                </div>

                {/* Persona-specific floating badge */}
                {activePersona === 'student' && (
                  <div className="absolute top-6 right-4 z-20 rounded-2xl border border-white/10 bg-[#0d1020]/90 px-3 py-2 shadow-xl backdrop-blur-sm">
                    <p className="text-[9px] text-[#8e92ad] uppercase tracking-widest font-bold">AIF Progress</p>
                    <p className="text-sm font-bold text-[#d97706]">65% <span className="text-[10px] text-[#0ca678]">· UofT</span></p>
                  </div>
                )}
                {activePersona === 'counselor' && (
                  <div className="absolute top-6 right-4 z-20 rounded-2xl border border-white/10 bg-[#0d1020]/90 px-3 py-2.5 shadow-xl backdrop-blur-sm">
                    <p className="text-[9px] text-[#8e92ad] uppercase tracking-widest font-bold">Cohort Risk</p>
                    <p className="text-sm font-bold text-[#0891b2]">3 at-risk <span className="text-[10px] text-[#dc2626]">⚠</span></p>
                  </div>
                )}
                {activePersona === 'parent' && (
                  <div className="absolute top-6 right-4 z-20 rounded-2xl border border-white/10 bg-[#0d1020]/90 px-3 py-2.5 shadow-xl backdrop-blur-sm">
                    <p className="text-[9px] text-[#8e92ad] uppercase tracking-widest font-bold">Next Milestone</p>
                    <p className="text-sm font-bold text-[#7c3aed]">Dec 1 · OUAC</p>
                  </div>
                )}

                <img
                  src="/app-mobile.png"
                  alt={`AdmitIQ for ${currentPersona.label}`}
                  className="relative z-10 w-[190px] drop-shadow-2xl sm:w-[215px]"
                  style={{ filter: `drop-shadow(0 0 24px ${currentPersona.accent}30)` }}
                />
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile App Download ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#070b14] px-5 py-28">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-[#2b5ce6]/8 blur-[130px]" />
          <div className="absolute -bottom-20 left-0 h-[400px] w-[500px] rounded-full bg-[#7c3aed]/8 blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-[1px] w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">

            {/* ── Left: Copy + Buttons ──────────────────────────── */}
            <div className="flex flex-col items-start">
              {/* Badge */}
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2b5ce6]/30 bg-[#2b5ce6]/10 px-4 py-1.5 text-xs font-medium text-[#7b9ef0]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                iOS & Android — Coming Soon
              </div>

              <h2 className="font-lora text-3xl font-normal leading-tight text-white sm:text-4xl lg:text-5xl">
                Take AdmitIQ
                <br />
                <span className="admitiq-gradient-text">everywhere you go.</span>
              </h2>

              <p className="mt-5 max-w-md text-base leading-relaxed text-[#8e92ad]">
                Get your personalised admission dashboard, AI essay feedback, and MMI practice sessions right in your pocket — available on iPhone and Android.
              </p>

              {/* Feature list */}
              <ul className="mt-8 space-y-3.5">
                {[
                  { icon: '📊', text: 'Live acceptance probabilities, updated instantly' },
                  { icon: '✍️', text: 'AI Essay Coach with per-sentence feedback' },
                  { icon: '🎙️', text: 'MMI practice & scoring on the go' },
                  { icon: '🔔', text: 'Smart deadline & cutoff alerts' },
                  { icon: '📶', text: 'Works offline — sync when connected' },
                ].map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="text-base leading-none">{item.icon}</span>
                    <span className="text-sm text-[#c8ccdf]">{item.text}</span>
                  </li>
                ))}
              </ul>

              {/* Store Buttons */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                {/* App Store */}
                <button className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
                  <svg className="h-8 w-8 shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-[#8e92ad]">Download on the</p>
                    <p className="text-base font-semibold text-white leading-tight">App Store</p>
                  </div>
                  <div className="ml-auto shrink-0 rounded-lg bg-[#2b5ce6]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#7b9ef0]">
                    Soon
                  </div>
                </button>

                {/* Google Play */}
                <button className="group relative flex items-center gap-3.5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08] hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
                  <svg className="h-8 w-8 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path d="M3.18 23.76c.37.2.8.22 1.2.05l11.4-6.58-2.53-2.54-10.07 9.07z" fill="#EA4335"/>
                    <path d="M20.54 10.27L17.7 8.66 14.9 11.4l2.82 2.81 2.82-1.62c.8-.46.8-1.87 0-2.32z" fill="#FBBC04"/>
                    <path d="M2.1 1.04a1.5 1.5 0 0 0-.6 1.3V21.7c0 .53.22 1 .6 1.3l.08.06 10.8-10.8v-.26L2.18.98l-.08.06z" fill="#4285F4"/>
                    <path d="M15.75 14.77l-3.27-3.27L2.1 22.3c.37.4.96.44 1.64.1l12.01-7.63z" fill="#34A853"/>
                  </svg>
                  <div className="text-left">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-[#8e92ad]">Get it on</p>
                    <p className="text-base font-semibold text-white leading-tight">Google Play</p>
                  </div>
                  <div className="ml-auto shrink-0 rounded-lg bg-[#2b5ce6]/15 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-[#7b9ef0]">
                    Soon
                  </div>
                </button>
              </div>

              {/* Sub-note */}
              <p className="mt-4 text-xs text-[#40455e]">
                Join 12,000+ students already on the waitlist · Free Essentials included
              </p>
            </div>

            {/* ── Right: Phone Mockups ──────────────────────────── */}
            <div className="relative flex items-end justify-center" style={{ minHeight: '580px' }}>

              {/* Glow under phones */}
              <div className="absolute bottom-0 left-1/2 h-32 w-80 -translate-x-1/2 rounded-full bg-[#2b5ce6]/20 blur-[60px]" />

              {/* ── Samsung Galaxy S25 (left, slightly behind) ─── */}
              <div className="relative z-10 -mr-10 mt-10 self-end" style={{ transform: 'perspective(1000px) rotateY(8deg) rotateX(2deg)' }}>
                {/* Phone body */}
                <div className="relative rounded-[44px] bg-gradient-to-b from-[#1c1c28] via-[#141420] to-[#0f0f1a] shadow-[0_40px_80px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.08)] overflow-hidden" style={{ width: '220px', height: '476px' }}>
                  {/* Side buttons */}
                  <div className="absolute -right-1 top-24 h-16 w-1 rounded-full bg-[#2a2a38]" />
                  <div className="absolute -left-1 top-20 h-10 w-1 rounded-full bg-[#2a2a38]" />
                  <div className="absolute -left-1 top-32 h-10 w-1 rounded-full bg-[#2a2a38]" />
                  {/* Screen bezel */}
                  <div className="absolute inset-[3px] rounded-[41px] overflow-hidden bg-[#070b14]">
                    {/* Punch-hole camera (S25 style) */}
                    <div className="absolute left-1/2 top-3 h-3 w-3 -translate-x-1/2 rounded-full bg-black z-10 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]" />
                    {/* Dashboard screenshot */}
                    <img
                      src="/app-screenshot.png"
                      alt="AdmitIQ student dashboard"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  </div>
                </div>
                {/* Samsung label */}
                <div className="mt-4 text-center">
                  <p className="text-[10px] font-semibold text-[#8e92ad]">Samsung Galaxy S25</p>
                  <p className="text-[9px] text-[#40455e]">Admission Simulator</p>
                </div>
              </div>

              {/* ── iPhone 17 (right, front) ───────────────────── */}
              <div className="relative z-20 self-end" style={{ transform: 'perspective(1000px) rotateY(-6deg) rotateX(1deg)' }}>
                {/* Phone body */}
                <div className="relative bg-gradient-to-b from-[#1e1e2e] via-[#15151f] to-[#0e0e18] shadow-[0_50px_100px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.1),inset_0_0_0_1px_rgba(255,255,255,0.04)] overflow-hidden" style={{ width: '240px', height: '520px', borderRadius: '50px' }}>
                  {/* Titanium edge highlight */}
                  <div className="absolute inset-0 rounded-[50px] shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(255,255,255,0.05)]" />
                  {/* Side buttons */}
                  <div className="absolute -right-1 top-28 h-12 w-1 rounded-full bg-[#2e2e3e]" />
                  <div className="absolute -left-1 top-20 h-8 w-1 rounded-full bg-[#2e2e3e]" />
                  <div className="absolute -left-1 top-30 h-14 w-1 rounded-full bg-[#2e2e3e]" />
                  {/* Screen bezel */}
                  <div className="absolute inset-[3px] overflow-hidden bg-[#070b14]" style={{ borderRadius: '47px' }}>
                    {/* Dynamic Island */}
                    <div className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black z-10" style={{ width: '88px', height: '28px' }} />
                    {/* Dashboard screenshot */}
                    <img
                      src="/app-screenshot.png"
                      alt="AdmitIQ student dashboard"
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                    {/* Bottom home indicator */}
                    <div className="absolute bottom-2 inset-x-0 flex justify-center z-10">
                      <div className="h-1 w-24 rounded-full bg-white/30" />
                    </div>
                  </div>
                </div>
                {/* iPhone label */}
                <div className="mt-4 text-center">
                  <p className="text-[10px] font-semibold text-[#8e92ad]">iPhone 17</p>
                  <p className="text-[9px] text-[#40455e]">AI Essay Coach</p>
                </div>
              </div>

            </div>
          </div>

          {/* ── Bottom strip: platform compatibility ── */}
          <div className="mt-20 flex flex-col items-center gap-6">
            <div className="h-px w-full max-w-2xl bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              {[
                { label: 'iOS 17+', icon: '🍎' },
                { label: 'Android 12+', icon: '🤖' },
                { label: 'All screen sizes', icon: '📱' },
                { label: 'Offline support', icon: '📶' },
                { label: 'Free to download', icon: '🎁' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm font-medium text-[#8e92ad]">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-5 py-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2b5ce6]/12 via-transparent to-[#7c3aed]/10" />
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b5ce6]/8 blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-lora text-3xl font-normal text-white sm:text-4xl lg:text-5xl">
            Ready to raise your acceptance odds?
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-lg text-[#8e92ad]">
            Join 12,000+ students who've used AdmitIQ to get into their dream programs.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/auth/signup">
              <Button className="h-14 w-full rounded-full bg-[#2b5ce6] px-10 text-base font-semibold text-white shadow-2xl shadow-[#2b5ce6]/30 hover:bg-[#254ec3] hover:scale-[1.02] transition-all duration-200 sm:w-auto">
                Get started for free <ArrowRight size={17} className="ml-2" />
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="ghost"
                className="h-14 w-full rounded-full border border-white/10 bg-white/[0.04] px-8 text-base text-[#c8ccdf] hover:bg-white/[0.08] hover:text-white sm:w-auto"
              >
                Sign in →
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-[#40455e]">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#070b14] px-5 py-10">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <Link href="/" className="font-lora text-lg font-normal text-white tracking-tight">
              AdmitIQ
            </Link>
            <p className="text-xs text-[#40455e]">© 2026 AdmitIQ. Built for Canadian students.</p>
            <div className="flex items-center gap-5">
              {['Privacy', 'Terms', 'Contact'].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-xs text-[#40455e] transition-colors hover:text-[#8e92ad]"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
