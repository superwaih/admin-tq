'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, X, ArrowRight, Sparkles, Users, GraduationCap, Shield, Zap, HelpCircle, ChevronDown } from 'lucide-react';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

/* ── Data ──────────────────────────────────────────────────────────────────── */

const plans = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'Get started and explore AdmitIQ at no cost.',
    cta: 'Get Started Free',
    ctaHref: '/auth/signup',
    ctaStyle: 'outline',
    accent: '#8e92ad',
    accentAlpha: 'rgba(142,146,173,0.1)',
    accentBorder: 'rgba(142,146,173,0.2)',
    icon: GraduationCap,
    features: [
      'Track up to 5 programs',
      'Basic acceptance estimates',
      '1 AIF essay draft',
      'Community forum access',
      'Deadline calendar',
      null,
      null,
      null,
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: 'Most Popular',
    monthlyPrice: 19,
    annualPrice: 149,
    description: 'Everything you need to maximize your chances.',
    cta: 'Start Free Trial',
    ctaHref: '/auth/signup?plan=pro',
    ctaStyle: 'filled',
    accent: '#2b5ce6',
    accentAlpha: 'rgba(43,92,230,0.14)',
    accentBorder: 'rgba(43,92,230,0.35)',
    icon: Zap,
    features: [
      'Unlimited program tracking',
      'Live AI probability scores',
      'Unlimited AIF drafting & rubric scoring',
      'MMI Simulator — 8 stations',
      'Personalised weekly strategy advisor',
      'Priority email support',
      'OUAC grade auto-import',
      null,
    ],
  },
  {
    id: 'counselor',
    name: 'Counselor',
    badge: 'For Schools',
    monthlyPrice: 49,
    annualPrice: 399,
    description: 'Cohort tools for high school guidance offices.',
    cta: 'Request Access',
    ctaHref: '/auth/counselor/signup',
    ctaStyle: 'teal',
    accent: '#0891b2',
    accentAlpha: 'rgba(8,145,178,0.14)',
    accentBorder: 'rgba(8,145,178,0.35)',
    icon: Users,
    features: [
      'Everything in Pro (per student)',
      'Full cohort roster & risk dashboard',
      'Cohort analytics & distributions',
      'Essay review queue with AI pre-scoring',
      'Automated deadline alerts & flags',
      'Admin seat management',
      'FERPA-compliant data handling',
      'Dedicated success manager',
    ],
  },
];

const comparisonRows = [
  { label: 'Program tracking', free: '5 programs', pro: 'Unlimited', counselor: 'Unlimited (all students)' },
  { label: 'AI probability scores', free: false, pro: true, counselor: true },
  { label: 'AIF essay drafts', free: '1 draft', pro: 'Unlimited', counselor: 'Unlimited' },
  { label: 'AIF rubric scoring', free: false, pro: true, counselor: true },
  { label: 'MMI Simulator', free: false, pro: '8 stations', counselor: '8 stations' },
  { label: 'Strategy Advisor', free: false, pro: 'Weekly', counselor: 'Weekly per student' },
  { label: 'OUAC grade import', free: false, pro: true, counselor: true },
  { label: 'Cohort risk dashboard', free: false, pro: false, counselor: true },
  { label: 'Cohort analytics', free: false, pro: false, counselor: true },
  { label: 'Essay review queue', free: false, pro: false, counselor: true },
  { label: 'FERPA compliance', free: false, pro: false, counselor: true },
  { label: 'Support', free: 'Community', pro: 'Priority email', counselor: 'Dedicated manager' },
];

const faqs = [
  {
    q: 'Is the free plan really free forever?',
    a: 'Yes. The Free plan has no time limit. You can use AdmitIQ at no cost to track up to 5 programs and create one AIF draft. Upgrade anytime to unlock the full suite.',
  },
  {
    q: 'Can I cancel my Pro subscription at any time?',
    a: 'Absolutely. You can cancel at any time from your account settings. If you cancel, you retain access until the end of your current billing period.',
  },
  {
    q: 'What does "live probability score" mean?',
    a: 'Our AI model ingests historical admissions data, your reported grades, and current applicant pool trends to give you a real-time acceptance probability for each program you track. It updates as you improve your profile.',
  },
  {
    q: 'How does the Counselor plan work for multiple students?',
    a: 'Each Counselor seat unlocks the full Pro feature set for every student connected to that counselor. Pricing is per counselor seat, not per student.',
  },
  {
    q: 'Is there a free trial for Pro?',
    a: 'Yes — clicking "Start Free Trial" gives you 14 days of full Pro access with no credit card required. You\'ll only be charged at the end of the trial if you choose to continue.',
  },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 antialiased">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#2b5ce6]/7 blur-[140px]" />
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className="relative z-10 border-b border-gray-200">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-10">
          <Link href="/" className="font-lora text-xl font-normal tracking-tight text-slate-900">
            AdmitIQ
          </Link>
          <div className="hidden items-center gap-8 sm:flex">
            <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Home</Link>
            <Link href="/#features" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-slate-900 font-medium">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/auth" className="text-sm text-slate-500 hover:text-slate-900 transition-colors hidden sm:inline">
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#2b5ce6', boxShadow: '0 4px 16px rgba(43,92,230,0.3)' }}
            >
              Get started free
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">

        {/* ── Hero ─────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-20">
          <div
            className="mb-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest"
            style={{ background: 'rgba(43,92,230,0.14)', color: '#2b5ce6' }}
          >
            <Sparkles size={11} />
            Simple, transparent pricing
          </div>
          <h1 className="font-lora text-4xl font-normal text-slate-900 sm:text-5xl lg:text-6xl">
            Start free.{' '}
            <span className="admitiq-gradient-text">Upgrade when ready.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-500">
            AdmitIQ is free to start. Upgrade to Pro for live AI scores, unlimited essay drafting, and MMI practice — or get the full counselor suite for your school.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => setAnnual(false)}
              className={`text-sm font-medium transition-colors ${!annual ? 'text-slate-900' : 'text-slate-500'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual((v) => !v)}
              className="relative h-7 w-12 rounded-full border border-gray-200 bg-gray-100 transition-colors"
            >
              <span
                className="absolute top-1 h-5 w-5 rounded-full bg-[#2b5ce6] transition-all"
                style={{ left: annual ? '24px' : '3px' }}
              />
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${annual ? 'text-slate-900' : 'text-slate-500'}`}
            >
              Annual
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
              >
                Save up to 35%
              </span>
            </button>
          </div>
        </section>

        {/* ── Pricing cards ─────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-5 pb-20">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = annual ? plan.annualPrice : plan.monthlyPrice;
              const isPopular = plan.id === 'pro';

              return (
                <div
                  key={plan.id}
                  className="relative flex flex-col rounded-3xl border border-gray-200 bg-white p-7 transition-all"
                  style={{
                    borderColor: isPopular ? plan.accentBorder : undefined,
                    boxShadow: isPopular
                      ? `0 0 0 1px ${plan.accentBorder}, 0 20px 60px rgba(43,92,230,0.12), 0 0 80px ${plan.accentAlpha}`
                      : '0 4px 24px rgba(15,17,23,0.06)',
                  }}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <div
                      className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                      style={{ background: isPopular ? plan.accent : '#0891b2' }}
                    >
                      {plan.badge}
                    </div>
                  )}

                  {/* Icon + name */}
                  <div className="mb-5 flex items-start justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{ background: plan.accentAlpha }}
                    >
                      <Icon size={20} style={{ color: plan.accent }} />
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{plan.description}</p>

                  {/* Price */}
                  <div className="my-6 flex items-end gap-1">
                    <span className="font-lora text-4xl font-normal text-slate-900">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="mb-1.5 text-sm text-slate-500">
                        /{annual ? 'year' : 'mo'}
                      </span>
                    )}
                    {price === 0 && (
                      <span className="mb-1.5 text-sm text-slate-500">forever</span>
                    )}
                  </div>
                  {annual && price > 0 && (
                    <p className="mb-6 -mt-3 text-xs text-slate-500">
                      equiv. ${Math.round(price / 12)}/mo
                    </p>
                  )}

                  {/* CTA */}
                  <Link href={plan.ctaHref} className="block">
                    <button
                      className={`mb-7 h-11 w-full rounded-xl text-sm font-semibold transition-all hover:opacity-90 ${
                        plan.ctaStyle === 'outline'
                          ? 'border border-gray-200 bg-gray-100 text-slate-700 hover:bg-gray-100'
                          : ''
                      }`}
                      style={
                        plan.ctaStyle === 'filled' || plan.ctaStyle === 'teal'
                          ? { background: plan.accent, color: 'white', boxShadow: `0 4px 20px ${plan.accentAlpha}` }
                          : undefined
                      }
                    >
                      {plan.cta}
                    </button>
                  </Link>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) =>
                      feature ? (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: plan.accent }} />
                          <span className="text-xs leading-relaxed text-slate-700">{feature}</span>
                        </li>
                      ) : null
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Comparison table ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-5 pb-20">
          <h2 className="mb-10 text-center font-lora text-2xl font-normal text-slate-900 sm:text-3xl">
            Full feature comparison
          </h2>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            {/* Header row */}
            <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50">
              <div className="p-4 text-xs font-bold uppercase tracking-widest text-slate-500">Feature</div>
              {plans.map((p) => (
                <div key={p.id} className="p-4 text-center">
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                </div>
              ))}
            </div>

            {/* Data rows */}
            {comparisonRows.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
              >
                <div className="p-4 text-xs text-slate-500">{row.label}</div>
                {(['free', 'pro', 'counselor'] as const).map((planId) => {
                  const val = row[planId];
                  return (
                    <div key={planId} className="flex items-center justify-center p-4">
                      {val === true ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : val === false ? (
                        <X size={14} className="text-slate-400" />
                      ) : (
                        <span className="text-center text-xs text-slate-700">{val}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>

        {/* ── Trust strip ──────────────────────────────────────────────────── */}
        <section className="border-y border-gray-200 bg-gray-50 py-10">
          <div className="mx-auto max-w-4xl px-5">
            <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3">
              {[
                { icon: Shield, label: 'Bank-level encryption', sub: 'All data encrypted at rest & in transit' },
                { icon: Shield, label: 'FERPA compliant', sub: 'Student data privacy guaranteed' },
                { icon: Shield, label: 'No credit card for free plan', sub: 'Start instantly, upgrade when ready' },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <item.icon size={18} className="text-emerald-500" />
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-3xl px-5 py-20">
          <div className="mb-10 flex items-center gap-3">
            <HelpCircle size={20} className="text-[#2b5ce6]" />
            <h2 className="font-lora text-2xl font-normal text-slate-900 sm:text-3xl">
              Frequently asked questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left"
                >
                  <span className="text-sm font-medium text-slate-900">{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className="shrink-0 text-slate-500 transition-transform"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)' }}
                  />
                </button>
                {openFaq === i && (
                  <div className="border-t border-gray-200 px-6 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-slate-500">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA footer ───────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-5 pb-20">
          <div
            className="rounded-3xl border border-[#2b5ce6]/25 p-10 text-center sm:p-14"
            style={{ background: 'linear-gradient(135deg, rgba(43,92,230,0.12), rgba(124,58,237,0.08))' }}
          >
            <h2 className="font-lora text-3xl font-normal text-slate-900 sm:text-4xl">
              Ready to raise your odds?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-slate-500">
              Join over 12,000 Canadian students already using AdmitIQ. Start free — no credit card required.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/auth/signup"
                className="flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#2b5ce6', boxShadow: '0 4px 24px rgba(43,92,230,0.3)' }}
              >
                Get Started Free
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/auth"
                className="rounded-xl border border-gray-200 bg-white px-7 py-3.5 text-sm font-semibold text-slate-900 transition-all hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 text-center text-xs text-slate-400">
        © 2026 AdmitIQ · Built for Canadian students ·{' '}
        <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy</Link>
        {' · '}
        <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms</Link>
      </footer>
    </div>
  );
}
