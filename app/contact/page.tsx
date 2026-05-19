'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail, Phone, MessageSquare, Clock, ChevronDown, ChevronRight,
  CheckCircle2, ArrowRight, Sparkles, Users, GraduationCap,
  BookOpen, Building2, Zap, Shield, HeadphonesIcon, Globe,
  Twitter, Instagram, Linkedin, Send, AlertCircle, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// ── Data ───────────────────────────────────────────────────────────────────

const USER_TYPES = [
  { id: 'student',     label: 'Student',     Icon: BookOpen,      color: '#2b5ce6' },
  { id: 'parent',      label: 'Parent',      Icon: Users,         color: '#7c3aed' },
  { id: 'counsellor',  label: 'Counsellor',  Icon: GraduationCap, color: '#0891b2' },
  { id: 'institution', label: 'Institution', Icon: Building2,     color: '#0ca678' },
];

const ENQUIRY_TYPES = [
  { value: '',                    label: 'Select enquiry type…' },
  { value: 'demo',                label: '📅  Book a Demo' },
  { value: 'general',             label: '💬  General Enquiry' },
  { value: 'feedback',            label: '✨  Feedback & Suggestions' },
  { value: 'technical',           label: '🔧  Technical Support' },
  { value: 'complaint',           label: '⚠️   Complaint' },
  { value: 'billing',             label: '💳  Billing & Subscription' },
  { value: 'partnership',         label: '🤝  Partnership & Integration' },
  { value: 'press',               label: '📰  Press & Media' },
];

const RESPONSE_TIMES: Record<string, string> = {
  demo:        "We'll reach out within 4 hours to confirm your slot.",
  general:     'We aim to respond within 24 hours on business days.',
  feedback:    'Your feedback goes straight to our product team.',
  technical:   'Priority queue — expect a reply within 2–4 hours.',
  complaint:   "Escalated immediately — we'll respond within 2 hours.",
  billing:     'Billing queries resolved same business day.',
  partnership: 'Our partnerships team will be in touch within 48 hours.',
  press:       'Media enquiries answered within 24 hours.',
};

const CONTACT_CHANNELS = [
  {
    Icon: Mail,
    label: 'Email Support',
    value: 'support@admitiq.ca',
    note: 'Mon–Fri, 9 am–6 pm ET',
    color: '#2b5ce6',
    bg: 'rgba(43,92,230,0.12)',
  },
  {
    Icon: MessageSquare,
    label: 'Live Chat',
    value: 'In-app chat widget',
    note: 'Available inside your dashboard',
    color: '#0ca678',
    bg: 'rgba(12,166,120,0.12)',
  },
  {
    Icon: HeadphonesIcon,
    label: 'Demo Call',
    value: 'Book a 30-min session',
    note: 'Walk through AdmitIQ with a specialist',
    color: '#7c3aed',
    bg: 'rgba(124,58,237,0.12)',
  },
  {
    Icon: Globe,
    label: 'Help Centre',
    value: 'help.admitiq.ca',
    note: '200+ articles & guides',
    color: '#0891b2',
    bg: 'rgba(8,145,178,0.12)',
  },
];

const SUPPORT_STATS = [
  { value: '< 2 hr', label: 'Avg. first response' },
  { value: '97%',    label: 'Satisfaction rate' },
  { value: '24 / 7', label: 'Help centre access' },
  { value: '10 000+', label: 'Issues resolved' },
];

const SOCIALS = [
  { Icon: Twitter,   label: 'Twitter / X',  href: '#', handle: '@AdmitIQ' },
  { Icon: Instagram, label: 'Instagram',    href: '#', handle: '@admitiq.ca' },
  { Icon: Linkedin,  label: 'LinkedIn',     href: '#', handle: 'AdmitIQ' },
];

// ── FAQ data ───────────────────────────────────────────────────────────────

const FAQ_CATEGORIES = [
  {
    id: 'general',
    label: 'General',
    Icon: Sparkles,
    color: '#2b5ce6',
    items: [
      {
        q: 'What is AdmitIQ?',
        a: 'AdmitIQ is an AI-powered Canadian university admissions platform built for Grade 12 students, parents, and school counsellors. It provides real-time acceptance probabilities, AI-assisted essay coaching, MMI interview practice, and personalised weekly strategy plans.',
      },
      {
        q: 'Is AdmitIQ free to use?',
        a: 'Yes — AdmitIQ offers a free Essentials plan with core features including the Admission Simulator and Grade Tracker. Guided and Pro plans unlock AI Essay Coach, MMI Simulator, and unlimited strategy sessions.',
      },
      {
        q: 'Which provinces and universities does AdmitIQ cover?',
        a: 'AdmitIQ currently covers all OUAC-participating Ontario universities plus BC, Alberta, and Quebec institutions including UBC, SFU, UofC, and McGill. We are actively expanding coverage.',
      },
      {
        q: 'Can parents and counsellors use AdmitIQ?',
        a: 'Absolutely. Parents get a read-only family digest with milestone tracking and financial aid snapshots. Counsellors get a full cohort roster, risk dashboard, and essay review queue purpose-built for secondary-school advisors.',
      },
    ],
  },
  {
    id: 'account',
    label: 'Account & Billing',
    Icon: Shield,
    color: '#0ca678',
    items: [
      {
        q: 'How do I upgrade my plan?',
        a: 'Inside your dashboard, go to Settings → Plan & Billing and choose Guided or Pro. Upgrades take effect immediately and you are billed on a pro-rated basis for the remainder of your billing cycle.',
      },
      {
        q: 'Can I cancel at any time?',
        a: 'Yes. You can cancel your subscription at any time from Settings → Plan & Billing. You will retain access to paid features until the end of your current billing period, after which your account reverts to the free Essentials plan.',
      },
      {
        q: 'Do you offer a student discount?',
        a: 'We offer a 20 % discount for students who verify their school email address. Institutional group licences are also available for schools — contact us via the Partnership enquiry type for pricing.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) processed securely via Stripe. All prices are in Canadian dollars (CAD).',
      },
    ],
  },
  {
    id: 'technical',
    label: 'Technical',
    Icon: Zap,
    color: '#7c3aed',
    items: [
      {
        q: 'Is my data safe with AdmitIQ?',
        a: 'Yes. All data is encrypted in transit (TLS 1.3) and at rest (AES-256). We are SOC 2 Type II compliant and never sell or share your personal data with third parties. Full details are in our Privacy Policy.',
      },
      {
        q: 'Which browsers and devices are supported?',
        a: 'AdmitIQ works on all modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile. A dedicated iOS and Android app is currently in development — join the waitlist via the Download section on our homepage.',
      },
      {
        q: 'Why is my acceptance probability different from what my school calculated?',
        a: 'Our model uses a combination of historical admission data, school-reported cutoff ranges, GPA distributions, and supplemental requirement weighting. Discrepancies can occur due to differences in data sources or the current academic year\'s cutoff shifts.',
      },
      {
        q: 'Can I import my grades from my student information system?',
        a: 'Manual grade entry is fully supported. Automated import from SIS platforms (e.g. Trillium, MyBlueprint) is on our roadmap for Q3 2026. We will notify users via in-app announcements when it launches.',
      },
    ],
  },
  {
    id: 'privacy',
    label: 'Privacy & Data',
    Icon: Shield,
    color: '#0891b2',
    items: [
      {
        q: 'Does AdmitIQ share my data with universities?',
        a: 'No. AdmitIQ does not share any personal data, grades, or essays with any university, college, or third party without your explicit consent. We operate entirely independently of OUAC and university admissions offices.',
      },
      {
        q: 'Can I delete my account and all my data?',
        a: 'Yes. You can request a full account and data deletion from Settings → Privacy → Delete Account. All personal data is permanently removed within 30 days in accordance with PIPEDA and applicable provincial privacy legislation.',
      },
      {
        q: 'How long do you retain my data?',
        a: 'Active account data is retained for the duration of your subscription. Inactive free accounts are archived after 24 months of inactivity and deleted after 36 months. You can request earlier deletion at any time.',
      },
    ],
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export default function ContactPage() {
  // form state
  const [userType, setUserType]     = useState('student');
  const [enquiryType, setEnquiryType] = useState('');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [message, setMessage]       = useState('');
  const [submitted, setSubmitted]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors]         = useState<Record<string, string>>({});

  // faq state
  const [activeCategory, setActiveCategory] = useState('general');
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  // nav state
  const [menuOpen, setMenuOpen] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim())        e.name    = 'Please enter your name.';
    if (!email.trim())       e.email   = 'Please enter your email address.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Please enter a valid email.';
    if (!enquiryType)        e.enquiry = 'Please select an enquiry type.';
    if (!message.trim())     e.message = 'Please include a message.';
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setSubmitted(true); }, 1400);
  };

  const activeColor = USER_TYPES.find(u => u.id === userType)?.color ?? '#2b5ce6';
  const faqCategory = FAQ_CATEGORIES.find(c => c.id === activeCategory)!;

  return (
    <div className="min-h-screen bg-[#070b14] text-white antialiased overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#070b14]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-lora text-xl font-normal text-white tracking-tight">AdmitIQ</span>
            <span className="rounded-full bg-[#2b5ce6]/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#7b9ef0]">Beta</span>
          </Link>
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: 'Features', href: '/#features' },
              { label: 'Pricing', href: '/pricing' },
              { label: 'Contact Us', href: '/contact' },
            ].map(l => (
              <Link key={l.label} href={l.href}
                className={`text-sm transition-colors duration-150 ${l.href === '/contact' ? 'text-white font-semibold' : 'text-[#8e92ad] hover:text-white'}`}>
                {l.label}
              </Link>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/auth">
              <Button variant="ghost" className="h-9 rounded-full px-4 text-sm text-[#8e92ad] hover:text-white hover:bg-white/5">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button className="h-9 rounded-full bg-[#2b5ce6] px-5 text-sm font-semibold text-white hover:bg-[#254ec3] shadow-lg shadow-[#2b5ce6]/20">Get started free</Button>
            </Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-[#8e92ad] hover:text-white transition-colors">
            {menuOpen ? <X size={22} /> : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.06] bg-[#070b14] px-5 py-5 space-y-4">
            {[{ label: 'Features', href: '/#features' }, { label: 'Pricing', href: '/pricing' }, { label: 'Contact Us', href: '/contact' }].map(l => (
              <Link key={l.label} href={l.href} className="block text-sm text-[#8e92ad] hover:text-white py-1" onClick={() => setMenuOpen(false)}>{l.label}</Link>
            ))}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
              <Link href="/auth/signup" onClick={() => setMenuOpen(false)}>
                <Button className="w-full rounded-full bg-[#2b5ce6] text-sm font-semibold text-white hover:bg-[#254ec3]">Get started free</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 px-5">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/3 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#2b5ce6]/8 blur-[120px]" />
          <div className="absolute right-0 top-0 h-[300px] w-[400px] rounded-full bg-[#7c3aed]/6 blur-[100px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#2b5ce6]/30 bg-[#2b5ce6]/10 px-4 py-1.5 text-xs font-medium text-[#7b9ef0]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0ca678] animate-pulse" />
            Support team online · avg. response &lt; 2 hrs
          </div>
          <h1 className="font-lora text-4xl font-normal leading-tight text-white sm:text-5xl lg:text-6xl">
            How can we
            <br />
            <span className="admitiq-gradient-text">help you today?</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[#8e92ad]">
            Whether you have a question, need a demo, or want to share feedback — our team is ready to help. Reach out any time.
          </p>

          {/* Support stats */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl mx-auto">
            {SUPPORT_STATS.map(s => (
              <div key={s.label} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-4 text-center">
                <p className="font-lora text-2xl font-normal text-white">{s.value}</p>
                <p className="mt-1 text-xs text-[#8e92ad]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main: Form + Channels ────────────────────────────────── */}
      <section className="px-5 py-12">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">

            {/* ── Contact Form (3/5) ─────────────────────────────── */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">

                {submitted ? (
                  /* ── Success state ── */
                  <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
                    <div className="h-16 w-16 rounded-full bg-[#0ca678]/15 flex items-center justify-center">
                      <CheckCircle2 size={32} className="text-[#0ca678]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Message received!</h3>
                      <p className="mt-2 text-sm text-[#8e92ad] max-w-sm">
                        Thanks for reaching out, <strong className="text-white">{name.split(' ')[0]}</strong>. We've sent a confirmation to <strong className="text-white">{email}</strong> and will be in touch shortly.
                      </p>
                      {enquiryType && RESPONSE_TIMES[enquiryType] && (
                        <p className="mt-3 text-xs text-[#7b9ef0] italic">{RESPONSE_TIMES[enquiryType]}</p>
                      )}
                    </div>
                    <Button
                      onClick={() => { setSubmitted(false); setName(''); setEmail(''); setPhone(''); setMessage(''); setEnquiryType(''); }}
                      className="mt-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm text-[#c8ccdf] hover:bg-white/[0.08]"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <h2 className="text-lg font-bold text-white">Send us a message</h2>
                      <p className="mt-1 text-sm text-[#8e92ad]">Fill out the form and we'll get back to you as soon as possible.</p>
                    </div>

                    {/* ── I am a… ── */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#8e92ad] mb-3">I am a…</label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {USER_TYPES.map(({ id, label, Icon, color }) => (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setUserType(id)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all duration-200 ${
                              userType === id
                                ? 'border-current bg-white/[0.06]'
                                : 'border-white/[0.07] bg-transparent hover:border-white/15 hover:bg-white/[0.03]'
                            }`}
                            style={userType === id ? { borderColor: color, color } : { color: '#8e92ad' }}
                          >
                            <Icon size={18} />
                            <span className="text-[11px] font-semibold leading-none text-white">{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* ── Enquiry type ── */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#8e92ad] mb-2">
                        Enquiry type <span className="text-rose-400">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={enquiryType}
                          onChange={e => { setEnquiryType(e.target.value); setErrors(prev => ({ ...prev, enquiry: '' })); }}
                          className={`w-full appearance-none rounded-xl border bg-[#0d1020] px-4 py-3 text-sm pr-10 outline-none transition-all ${
                            errors.enquiry ? 'border-rose-500/60 focus:border-rose-500' : 'border-white/[0.08] focus:border-[#2b5ce6]/60'
                          } ${enquiryType ? 'text-white' : 'text-[#8e92ad]'}`}
                        >
                          {ENQUIRY_TYPES.map(t => (
                            <option key={t.value} value={t.value} className="bg-[#0d1020]">{t.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8e92ad]" />
                      </div>
                      {errors.enquiry && <p className="mt-1 flex items-center gap-1 text-xs text-rose-400"><AlertCircle size={11} />{errors.enquiry}</p>}
                      {enquiryType && RESPONSE_TIMES[enquiryType] && (
                        <p className="mt-1.5 text-xs text-[#7b9ef0] flex items-center gap-1.5">
                          <Clock size={11} />{RESPONSE_TIMES[enquiryType]}
                        </p>
                      )}
                    </div>

                    {/* ── Name + Email ── */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#8e92ad] mb-2">
                          Full name <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
                          placeholder="Priya Mehta"
                          className={`w-full rounded-xl border bg-[#0d1020] px-4 py-3 text-sm text-white placeholder:text-[#4b4f6a] outline-none transition-all ${
                            errors.name ? 'border-rose-500/60 focus:border-rose-500' : 'border-white/[0.08] focus:border-[#2b5ce6]/60'
                          }`}
                        />
                        {errors.name && <p className="mt-1 flex items-center gap-1 text-xs text-rose-400"><AlertCircle size={11} />{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-[#8e92ad] mb-2">
                          Email address <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })); }}
                          placeholder="priya@email.com"
                          className={`w-full rounded-xl border bg-[#0d1020] px-4 py-3 text-sm text-white placeholder:text-[#4b4f6a] outline-none transition-all ${
                            errors.email ? 'border-rose-500/60 focus:border-rose-500' : 'border-white/[0.08] focus:border-[#2b5ce6]/60'
                          }`}
                        />
                        {errors.email && <p className="mt-1 flex items-center gap-1 text-xs text-rose-400"><AlertCircle size={11} />{errors.email}</p>}
                      </div>
                    </div>

                    {/* ── Phone (optional) ── */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#8e92ad] mb-2">
                        Phone number <span className="text-[#40455e] font-normal normal-case text-[10px] ml-1">optional</span>
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+1 (416) 555-0100"
                        className="w-full rounded-xl border border-white/[0.08] bg-[#0d1020] px-4 py-3 text-sm text-white placeholder:text-[#4b4f6a] outline-none transition-all focus:border-[#2b5ce6]/60"
                      />
                    </div>

                    {/* ── Message ── */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-[#8e92ad] mb-2">
                        Message <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={e => { setMessage(e.target.value); setErrors(prev => ({ ...prev, message: '' })); }}
                        rows={5}
                        placeholder="Tell us what's on your mind — be as detailed as you like…"
                        className={`w-full resize-none rounded-xl border bg-[#0d1020] px-4 py-3 text-sm text-white placeholder:text-[#4b4f6a] outline-none transition-all ${
                          errors.message ? 'border-rose-500/60 focus:border-rose-500' : 'border-white/[0.08] focus:border-[#2b5ce6]/60'
                        }`}
                      />
                      <div className="mt-1 flex items-center justify-between">
                        {errors.message
                          ? <p className="flex items-center gap-1 text-xs text-rose-400"><AlertCircle size={11} />{errors.message}</p>
                          : <span />}
                        <span className="text-[11px] text-[#40455e]">{message.length} / 1000</span>
                      </div>
                    </div>

                    {/* ── Submit ── */}
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full h-12 rounded-xl bg-[#2b5ce6] text-sm font-semibold text-white hover:bg-[#254ec3] shadow-lg shadow-[#2b5ce6]/20 hover:shadow-[#2b5ce6]/40 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/>
                            <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                          </svg>
                          Sending…
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send size={15} /> Send message
                        </span>
                      )}
                    </Button>

                    <p className="text-center text-xs text-[#40455e]">
                      By submitting you agree to our{' '}
                      <Link href="#" className="text-[#8e92ad] underline underline-offset-2 hover:text-white">Privacy Policy</Link>.
                      We never share your data.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* ── Right: Channels + Socials (2/5) ──────────────── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Channels */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="mb-5 text-base font-bold text-white">Other ways to reach us</h3>
                <div className="space-y-4">
                  {CONTACT_CHANNELS.map(({ Icon, label, value, note, color, bg }) => (
                    <div key={label} className="flex items-start gap-3.5">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: bg }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold uppercase tracking-widest text-[#8e92ad]">{label}</p>
                        <p className="text-sm font-semibold text-white truncate">{value}</p>
                        <p className="text-xs text-[#8e92ad]">{note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="mb-4 text-base font-bold text-white flex items-center gap-2">
                  <Clock size={16} className="text-[#2b5ce6]" /> Office Hours
                </h3>
                <div className="space-y-2.5">
                  {[
                    { day: 'Monday – Friday', time: '9:00 am – 6:00 pm ET', open: true },
                    { day: 'Saturday',        time: '10:00 am – 2:00 pm ET', open: true },
                    { day: 'Sunday',          time: 'Closed',                 open: false },
                  ].map(({ day, time, open }) => (
                    <div key={day} className="flex items-center justify-between">
                      <span className="text-sm text-[#8e92ad]">{day}</span>
                      <span className={`text-xs font-semibold ${open ? 'text-white' : 'text-[#40455e]'}`}>{time}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 rounded-xl border border-[#0ca678]/20 bg-[#0ca678]/8 px-3 py-2.5">
                  <p className="text-xs text-[#0ca678]">🟢 Help centre & email queue is always open — even outside office hours.</p>
                </div>
              </div>

              {/* Social media */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6">
                <h3 className="mb-4 text-base font-bold text-white">Follow us</h3>
                <div className="space-y-3">
                  {SOCIALS.map(({ Icon, label, href, handle }) => (
                    <Link key={label} href={href}
                      className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-all hover:border-white/15 hover:bg-white/[0.05] group">
                      <Icon size={17} className="text-[#8e92ad] group-hover:text-white transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white">{label}</p>
                        <p className="text-[11px] text-[#8e92ad]">{handle}</p>
                      </div>
                      <ChevronRight size={13} className="text-[#40455e] group-hover:text-[#8e92ad] transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Quick-action cards ──────────────────────────────────── */}
      <section className="px-5 py-14 bg-[#0b0f1c]">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="mb-10 text-center">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#2b5ce6]">Quick actions</p>
            <h2 className="font-lora text-2xl font-normal text-white sm:text-3xl">Not sure where to start?</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { Icon: Zap,            title: 'Book a Demo',        desc: 'See AdmitIQ in action with a specialist — 30 min.',                color: '#2b5ce6', bg: 'rgba(43,92,230,0.12)',   onClick: () => setEnquiryType('demo') },
              { Icon: MessageSquare,  title: 'Share Feedback',     desc: 'Help us build the best admissions tool in Canada.',               color: '#0ca678', bg: 'rgba(12,166,120,0.12)',  onClick: () => setEnquiryType('feedback') },
              { Icon: Shield,         title: 'Technical Support',  desc: 'Something not working? Our engineers are standing by.',           color: '#7c3aed', bg: 'rgba(124,58,237,0.12)', onClick: () => setEnquiryType('technical') },
              { Icon: Building2,      title: 'School Partnership', desc: 'Bring AdmitIQ to your whole cohort with a group licence.',        color: '#0891b2', bg: 'rgba(8,145,178,0.12)',   onClick: () => setEnquiryType('partnership') },
            ].map(({ Icon, title, desc, color, bg, onClick }) => (
              <button
                key={title}
                onClick={() => { onClick(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="group text-left rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05] hover:-translate-y-0.5"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: bg }}>
                  <Icon size={20} style={{ color }} />
                </div>
                <h3 className="mb-1.5 text-sm font-bold text-white">{title}</h3>
                <p className="text-xs leading-relaxed text-[#8e92ad]">{desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                  Get in touch <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-4xl lg:px-8">
          <div className="mb-12 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#2b5ce6]">FAQ</p>
            <h2 className="font-lora text-3xl font-normal text-white sm:text-4xl">Frequently asked questions</h2>
            <p className="mt-4 text-[#8e92ad]">Can't find what you're looking for? <Link href="#" className="text-[#7b9ef0] underline underline-offset-2 hover:text-white">Search our help centre →</Link></p>
          </div>

          {/* Category tabs */}
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {FAQ_CATEGORIES.map(({ id, label, Icon, color }) => (
              <button
                key={id}
                onClick={() => { setActiveCategory(id); setOpenFaq(null); }}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeCategory === id
                    ? 'border-current bg-white/[0.06] text-white'
                    : 'border-white/[0.08] text-[#8e92ad] hover:border-white/15 hover:text-white'
                }`}
                style={activeCategory === id ? { borderColor: color, color } : {}}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* FAQ accordion */}
          <div className="space-y-2">
            {faqCategory.items.map((item, i) => {
              const key = `${activeCategory}-${i}`;
              const isOpen = openFaq === key;
              return (
                <div
                  key={key}
                  className={`rounded-2xl border transition-all duration-200 ${
                    isOpen ? 'border-white/10 bg-white/[0.04]' : 'border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.03]'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : key)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left"
                  >
                    <span className={`text-sm font-semibold leading-snug transition-colors ${isOpen ? 'text-white' : 'text-[#c8ccdf]'}`}>
                      {item.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-[#8e92ad] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5">
                      <p className="text-sm leading-relaxed text-[#8e92ad]">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still need help */}
          <div className="mt-12 rounded-2xl border border-[#2b5ce6]/20 bg-[#2b5ce6]/[0.06] p-8 text-center">
            <p className="text-base font-semibold text-white">Still have questions?</p>
            <p className="mt-2 text-sm text-[#8e92ad]">Our support team is happy to walk you through anything — no question is too small.</p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#2b5ce6] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#254ec3] transition-colors shadow-lg shadow-[#2b5ce6]/20"
            >
              <Send size={13} /> Contact support
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] bg-[#070b14] px-5 py-10">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <Link href="/" className="font-lora text-lg font-normal text-white tracking-tight">AdmitIQ</Link>
            <p className="text-xs text-[#40455e]">© 2026 AdmitIQ. Built for Canadian students.</p>
            <div className="flex items-center gap-5">
              {['Privacy', 'Terms', 'Contact'].map(item => (
                <Link key={item} href="#" className="text-xs text-[#40455e] transition-colors hover:text-[#8e92ad]">{item}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
