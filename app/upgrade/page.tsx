'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, CheckCircle2, Lock, Loader2, Zap, CreditCard, Shield,
} from 'lucide-react';

/* ── Plans ─────────────────────────────────────────────────────────────────── */
const plans = [
  {
    id: 'pro-monthly',
    label: 'Pro · Monthly',
    period: 'monthly',
    price: 19,
    display: '$19/month',
    savings: null,
  },
  {
    id: 'pro-annual',
    label: 'Pro · Annual',
    period: 'annual',
    price: 149,
    display: '$149/year',
    savings: 'Save $79 vs monthly',
  },
];

const included = [
  'Unlimited program tracking',
  'Live AI acceptance probability scores',
  'Unlimited AIF drafting & rubric scoring',
  'MMI Simulator — 8 stations',
  'Personalised weekly strategy advisor',
  'OUAC grade auto-import',
  'Priority email support',
];

const ACCENT = '#2b5ce6';

/* ── Card input helpers ─────────────────────────────────────────────────────── */
function formatCardNumber(v: string) {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 3 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

export default function UpgradePage() {
  const searchParams = useSearchParams();
  const defaultPlan = searchParams?.get('plan') === 'monthly' ? 'pro-monthly' : 'pro-annual';

  const [selectedPlan, setSelectedPlan] = useState(defaultPlan);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry]         = useState('');
  const [cvc, setCvc]               = useState('');
  const [cardName, setCardName]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [done, setDone]             = useState(false);

  const plan = plans.find((p) => p.id === selectedPlan)!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1800));
    setLoading(false);
    setDone(true);
  };

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b14] px-5 antialiased">
        <div className="w-full max-w-[400px] rounded-3xl border border-white/[0.07] bg-[#0d1020] p-10 text-center space-y-6">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-emerald-500/14">
            <CheckCircle2 size={30} className="text-emerald-400" />
          </div>
          <div className="space-y-2">
            <h2 className="font-lora text-2xl font-normal text-white">You're on Pro!</h2>
            <p className="text-sm leading-relaxed text-[#8e92ad]">
              Your {plan.label} subscription is now active. All Pro features are unlocked.
            </p>
          </div>
          <Link href="/auth/student">
            <Button
              className="h-12 w-full rounded-xl text-sm font-semibold text-white"
              style={{ background: ACCENT, boxShadow: '0 4px 20px rgba(43,92,230,0.25)' }}
            >
              Go to my dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white antialiased">

      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#2b5ce6]/7 blur-[140px]" />
      </div>

      {/* Nav */}
      <header className="relative z-10 border-b border-white/[0.06] px-5 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/pricing" className="flex items-center gap-1.5 text-sm text-[#8e92ad] hover:text-white transition-colors">
            <ArrowLeft size={15} /> Back to pricing
          </Link>
          <Link href="/" className="font-lora text-xl font-normal text-white">AdmitIQ</Link>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400">
            <Lock size={12} /> Secure checkout
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_400px]">

          {/* ── Left: Payment form ───────────────────────────── */}
          <div className="space-y-7">

            {/* Plan selector */}
            <div>
              <h2 className="font-lora text-2xl font-normal text-white mb-5">Choose your plan</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {plans.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className="flex flex-col items-start rounded-2xl border p-5 text-left transition-all"
                    style={{
                      borderColor: selectedPlan === p.id ? 'rgba(43,92,230,0.4)' : 'rgba(255,255,255,0.07)',
                      background: selectedPlan === p.id ? 'rgba(43,92,230,0.1)' : 'rgba(255,255,255,0.03)',
                      boxShadow: selectedPlan === p.id ? '0 0 30px rgba(43,92,230,0.1)' : 'none',
                    }}
                  >
                    <div className="flex w-full items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{p.label}</span>
                      <div
                        className="flex h-4 w-4 items-center justify-center rounded-full border"
                        style={{
                          borderColor: selectedPlan === p.id ? ACCENT : 'rgba(255,255,255,0.25)',
                          background: selectedPlan === p.id ? ACCENT : 'transparent',
                        }}
                      >
                        {selectedPlan === p.id && (
                          <div className="h-1.5 w-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                    <p className="text-lg font-light text-white">{p.display}</p>
                    {p.savings && (
                      <span
                        className="mt-2 rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}
                      >
                        {p.savings}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment form */}
            <div>
              <h2 className="font-lora text-2xl font-normal text-white mb-5">Payment details</h2>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Card number */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">
                    Card number
                  </label>
                  <div className="relative">
                    <CreditCard size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#40455e]" />
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      required
                      className="auth-input pl-10"
                    />
                  </div>
                </div>

                {/* Name on card */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">Name on card</label>
                  <input
                    type="text"
                    autoComplete="cc-name"
                    placeholder="Priya Mehta"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>

                {/* Expiry + CVC */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">Expiry</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      required
                      className="auth-input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">CVC</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="•••"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      required
                      className="auth-input"
                    />
                  </div>
                </div>

                {/* Security badges */}
                <div className="flex flex-wrap items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3">
                  <div className="flex items-center gap-1.5 text-xs text-[#8e92ad]">
                    <Lock size={12} className="text-emerald-400" /> 256-bit SSL
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8e92ad]">
                    <Shield size={12} className="text-emerald-400" /> PCI compliant
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-[#8e92ad]">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Cancel anytime
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-13 w-full rounded-xl py-4 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: ACCENT, boxShadow: '0 4px 24px rgba(43,92,230,0.3)' }}
                >
                  {loading ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Processing…</>
                  ) : (
                    <>
                      <Lock size={14} className="mr-2" />
                      Pay {plan.display} · Start Pro
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-[#40455e]">
                  By subscribing you agree to our{' '}
                  <Link href="/terms" className="hover:text-[#8e92ad] transition-colors underline">Terms</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="hover:text-[#8e92ad] transition-colors underline">Privacy Policy</Link>.
                  Cancel anytime — no questions asked.
                </p>
              </form>
            </div>
          </div>

          {/* ── Right: Order summary ─────────────────────────── */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="rounded-3xl border border-white/[0.07] bg-[#0d1020] p-7">

              {/* Plan badge */}
              <div
                className="mb-5 flex items-center gap-2 rounded-xl px-4 py-3"
                style={{ background: 'rgba(43,92,230,0.12)', border: '1px solid rgba(43,92,230,0.25)' }}
              >
                <Zap size={16} style={{ color: ACCENT }} />
                <div>
                  <p className="text-sm font-semibold text-white">{plan.label}</p>
                  <p className="text-[10px] text-[#8e92ad]">Billed {plan.period}</p>
                </div>
                <p className="ml-auto font-lora text-xl text-white">{plan.display}</p>
              </div>

              {/* What's included */}
              <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-[#8e92ad]">
                What's included
              </p>
              <ul className="space-y-3 mb-7">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    <span className="text-xs leading-relaxed text-[#c8ccdf]">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Trial note */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                <p className="text-xs text-emerald-400 font-semibold">14-day free trial</p>
                <p className="mt-0.5 text-[10px] leading-relaxed text-[#8e92ad]">
                  You won't be charged until your trial ends. Cancel anytime before then.
                </p>
              </div>

              {/* Price breakdown */}
              <div className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8e92ad]">Subtotal</span>
                  <span className="text-white">{plan.display}</span>
                </div>
                {plan.savings && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-400">Annual discount</span>
                    <span className="text-emerald-400">−$79</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-white/[0.07] pt-2.5 text-base font-semibold">
                  <span className="text-white">Total today</span>
                  <span className="text-white">$0.00</span>
                </div>
                <p className="text-[10px] text-[#40455e]">
                  {plan.display} charged after your 14-day trial
                </p>
              </div>
            </div>

            {/* Need help */}
            <p className="mt-4 text-center text-xs text-[#40455e]">
              Questions?{' '}
              <a href="mailto:support@admitiq.ca" className="text-[#8e92ad] hover:text-white transition-colors">
                Contact support
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
