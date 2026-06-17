'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft, Shield, MessageSquare, HeadphonesIcon,
  X, Lock, Check, CreditCard, AlertCircle, ChevronDown,
  ChevronRight, Pencil,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Counselor data ────────────────────────────────────────────────────────────

const COUNSELORS_DATA: Record<string, {
  name: string; title: string; avatar: string; gradient: string;
}> = {
  '1': { name: 'Dr. Sarah Chen',    title: 'Senior Admissions Counselor',           avatar: 'SC', gradient: 'from-blue-500 to-indigo-600'    },
  '2': { name: 'Marcus Williams',   title: 'Health Sciences & Medical Coach',        avatar: 'MW', gradient: 'from-emerald-500 to-teal-600'   },
  '3': { name: 'Aisha Patel',       title: 'Business & Commerce Expert',             avatar: 'AP', gradient: 'from-violet-500 to-purple-600'  },
  '4': { name: 'Étienne Tremblay',  title: 'Arts, Humanities & Law Advisor',         avatar: 'ÉT', gradient: 'from-rose-500 to-pink-600'      },
  '5': { name: 'Dr. Priya Nair',    title: 'CS, AI & Data Science Mentor',           avatar: 'PN', gradient: 'from-cyan-500 to-blue-600'      },
  '6': { name: 'James Okoye',       title: 'OUAC & Application Strategy Specialist', avatar: 'JO', gradient: 'from-amber-500 to-orange-600'   },
};

// ── Payment method config ─────────────────────────────────────────────────────

type MethodKey = 'card' | 'paypal' | 'stripe' | 'gpay' | 'applepay';

const METHODS: { key: MethodKey; label: string; sub: string }[] = [
  { key: 'card',     label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
  { key: 'paypal',   label: 'PayPal',               sub: 'Pay with your PayPal account' },
  { key: 'stripe',   label: 'Stripe',               sub: 'Stripe-linked card or wallet' },
  { key: 'gpay',     label: 'Google Pay',            sub: 'Pay with Google Pay' },
  { key: 'applepay', label: 'Apple Pay',             sub: 'Pay with Apple Pay' },
];

// ── Brand mark components ─────────────────────────────────────────────────────

function VisaMark() {
  return <span className="font-black text-[13px] italic text-[#1A1F71] dark:text-[#7B8FE8] tracking-tight">VISA</span>;
}
function MastercardMark() {
  return (
    <span className="relative inline-flex">
      <span className="w-4 h-4 rounded-full bg-[#EB001B] inline-block"/>
      <span className="w-4 h-4 rounded-full bg-[#F79E1B] inline-block -ml-2 opacity-90"/>
    </span>
  );
}
function PayPalMark() {
  return <span className="font-black text-[13px]"><span className="text-[#003087] dark:text-[#6BA4FF]">Pay</span><span className="text-[#009cde]">Pal</span></span>;
}
function StripeMark() {
  return <span className="font-black text-[13px] text-[#635BFF]">stripe</span>;
}
function GPayMark() {
  return (
    <span className="font-bold text-[12px]">
      <span className="text-[#4285F4]">G</span>
      <span className="text-[#34A853]">o</span>
      <span className="text-[#FBBC05]">o</span>
      <span className="text-[#EA4335]">g</span>
      <span className="text-[#4285F4]">le</span>
      <span className="text-slate-500 dark:text-slate-400"> Pay</span>
    </span>
  );
}
function ApplePayMark() {
  return (
    <span className="font-bold text-[13px] text-slate-800 dark:text-white tracking-tight">
       Pay
    </span>
  );
}

const METHOD_MARK: Record<MethodKey, React.ReactNode> = {
  card:     <div className="flex items-center gap-1.5"><VisaMark/><MastercardMark/></div>,
  paypal:   <PayPalMark/>,
  stripe:   <StripeMark/>,
  gpay:     <GPayMark/>,
  applepay: <ApplePayMark/>,
};

// ── Shared input ──────────────────────────────────────────────────────────────

function Field({
  label, placeholder, value, onChange, type = 'text', half = false,
  error, readOnly = false, hint,
}: {
  label: string; placeholder: string; value: string;
  onChange?: (v: string) => void; type?: string; half?: boolean;
  error?: string; readOnly?: boolean; hint?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-1', half ? 'flex-1' : 'w-full')}>
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</label>
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        onChange={e => onChange?.(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'h-11 px-4 text-sm rounded-xl border transition-all outline-none',
          readOnly
            ? 'bg-slate-50 dark:bg-white/4 border-gray-100 dark:border-white/6 text-slate-500 dark:text-slate-400 cursor-default'
            : error
              ? 'bg-white dark:bg-[#1a1f30] border-red-400 dark:border-red-500/60 text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] focus:ring-2 focus:ring-red-200 dark:focus:ring-red-500/20'
              : 'bg-white dark:bg-[#1a1f30] border-gray-200 dark:border-white/10 text-slate-800 dark:text-slate-200 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/20 focus:border-blue-400 dark:focus:border-blue-500/50'
        )}
      />
      {hint  && !error && <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{hint}</p>}
      {error && <p className="text-[10px] text-red-500 flex items-center gap-1"><AlertCircle size={9}/>{error}</p>}
    </div>
  );
}

// ── Pay button ────────────────────────────────────────────────────────────────

function PayBtn({ label, onClick, color = 'blue' }: { label: string; onClick: () => void; color?: string }) {
  const cls = color === 'paypal'
    ? 'bg-[#0070ba] hover:bg-[#005ea6]'
    : color === 'stripe'
      ? 'bg-[#635BFF] hover:bg-[#4e47cc]'
      : color === 'gpay'
        ? 'bg-slate-800 hover:bg-slate-900 dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900'
        : color === 'apple'
          ? 'bg-black hover:bg-[#1a1a1a] dark:bg-white dark:hover:bg-slate-100 dark:text-black'
          : 'bg-blue-600 hover:bg-blue-700';
  return (
    <button onClick={onClick}
      className={cn('mt-5 w-full flex items-center justify-center gap-2 h-12 rounded-xl text-white text-sm font-bold transition-all shadow-sm', cls)}>
      <Lock size={14}/> {label}
    </button>
  );
}

// ── Sidebar info card ─────────────────────────────────────────────────────────

function InfoCard({ icon: Icon, iconClass, title, desc }: {
  icon: React.ElementType; iconClass: string; title: string; desc: string;
}) {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', iconClass)}>
          <Icon size={15}/>
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">{title}</p>
          <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

// ── Saved account display ─────────────────────────────────────────────────────

function SavedAccount({
  label, value, onEdit,
}: { label: string; value: string; onEdit: () => void }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Check size={13} className="text-emerald-600 dark:text-emerald-400"/>
        </div>
        <div>
          <p className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">{label}</p>
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{value}</p>
        </div>
      </div>
      <button onClick={onEdit} className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        <Pencil size={10}/> Edit
      </button>
    </div>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────

export default function PaymentPage() {
  const params    = useSearchParams();
  const id        = params.get('id')    ?? '1';
  const type      = params.get('type')  ?? 'General Consultation';
  const date      = params.get('date')  ?? '—';
  const time      = params.get('time')  ?? '—';
  const price     = params.get('price') ?? '120';
  const counselor = COUNSELORS_DATA[id] ?? COUNSELORS_DATA['1'];

  // Which payment method tab is open
  const [method, setMethod] = useState<MethodKey>('card');

  // Personal details
  const [addressLine, setAddressLine] = useState('');
  const [city,        setCity]        = useState('');
  const [stateVal,    setStateVal]    = useState('');
  const [postal,      setPostal]      = useState('');

  // Card
  const [cardName,   setCardName]   = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry,     setExpiry]     = useState('');
  const [cvc,        setCvc]        = useState('');

  // PayPal
  const [paypalEmail,    setPaypalEmail]    = useState('');
  const [paypalSaved,    setPaypalSaved]    = useState(false);
  const [paypalEditing,  setPaypalEditing]  = useState(false);

  // Stripe
  const [stripeEmail,   setStripeEmail]   = useState('');
  const [stripeSaved,   setStripeSaved]   = useState(false);
  const [stripeEditing, setStripeEditing] = useState(false);

  // Google Pay
  const [gpayEmail,   setGpayEmail]   = useState('');
  const [gpaySaved,   setGpaySaved]   = useState(false);
  const [gpayEditing, setGpayEditing] = useState(false);

  // Apple Pay
  const [appleId,      setAppleId]      = useState('');
  const [appleSaved,   setAppleSaved]   = useState(false);
  const [appleEditing, setAppleEditing] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paid,   setPaid]   = useState(false);

  // ── Formatters
  const fmtCard   = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
  const fmtExpiry = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length >= 3 ? d.slice(0,2) + '/' + d.slice(2) : d; };

  // ── Validate per method
  const validate = () => {
    const e: Record<string,string> = {};
    if (method === 'card') {
      if (!cardName.trim())                             e.cardName   = 'Cardholder name is required';
      if (cardNumber.replace(/\s/g,'').length < 16)    e.cardNumber = 'Enter a valid 16-digit card number';
      if (expiry.length < 5)                           e.expiry     = 'Enter a valid expiry date';
      if (cvc.length < 3)                              e.cvc        = 'Enter a valid CVC';
    }
    if (method === 'paypal' && !paypalSaved) {
      if (!paypalEmail.includes('@'))                   e.paypalEmail = 'Enter a valid PayPal email';
    }
    if (method === 'stripe' && !stripeSaved) {
      if (!stripeEmail.includes('@'))                   e.stripeEmail = 'Enter a valid Stripe account email';
    }
    if (method === 'gpay' && !gpaySaved) {
      if (!gpayEmail.includes('@'))                     e.gpayEmail = 'Enter your Google account email';
    }
    if (method === 'applepay' && !appleSaved) {
      if (!appleId.includes('@'))                       e.appleId = 'Enter your Apple ID email';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePay = () => { if (validate()) setPaid(true); };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (paid) {
    const methodLabel = METHODS.find(m => m.key === method)?.label ?? 'Card';
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-md p-10 flex flex-col items-center gap-5 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
            <Check size={30} className="text-emerald-600 dark:text-emerald-400"/>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Payment Successful!</h2>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-1 leading-relaxed">
              Your session with <strong className="text-slate-700 dark:text-slate-200">{counselor.name}</strong> is confirmed. A receipt has been sent to your email.
            </p>
          </div>
          <div className="w-full bg-slate-50 dark:bg-white/4 rounded-2xl border border-gray-100 dark:border-white/6 p-4 text-left space-y-2.5">
            {[
              { l: 'Counselor',       v: counselor.name },
              { l: 'Session',         v: type },
              { l: 'Date',            v: date },
              { l: 'Time',            v: time + ' (EST)' },
              { l: 'Paid via',        v: methodLabel },
              { l: 'Amount',          v: `CAD ${price}`, hi: true },
            ].map(r => (
              <div key={r.l} className="flex items-center justify-between">
                <span className="text-xs text-slate-400">{r.l}</span>
                <span className={cn('text-xs font-bold', 'hi' in r && r.hi ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-white')}>{r.v}</span>
              </div>
            ))}
          </div>
          <Link href="/student/counselors"
            className="w-full flex items-center justify-center h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all">
            Back to Counsellor Directory
          </Link>
        </div>
      </div>
    );
  }

  // ── Per-method form panels ──────────────────────────────────────────────────

  const cardPanel = (
    <div className="space-y-3">
      <Field label="Cardholder's name"   placeholder="As seen on your card"   value={cardName}   onChange={setCardName}   error={errors.cardName}/>
      <Field label="Card number"         placeholder="1234 5678 9012 3456"    value={cardNumber} onChange={v => setCardNumber(fmtCard(v))}   error={errors.cardNumber}/>
      <div className="flex flex-col sm:flex-row gap-3">
        <Field label="Expiry" placeholder="MM/YY" value={expiry} onChange={v => setExpiry(fmtExpiry(v))} half error={errors.expiry}/>
        <Field label="CVC"    placeholder="123"   value={cvc}    onChange={v => setCvc(v.replace(/\D/g,'').slice(0,4))} half error={errors.cvc}/>
      </div>
      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] flex items-center gap-1 mt-1">
        <Shield size={10}/> Your card details are encrypted and never stored.
      </p>
    </div>
  );

  const paypalPanel = (
    <div className="space-y-3">
      {paypalSaved && !paypalEditing ? (
        <SavedAccount label="PayPal account" value={paypalEmail} onEdit={() => setPaypalEditing(true)}/>
      ) : (
        <>
          <Field
            label="PayPal email address"
            placeholder="you@example.com"
            value={paypalEmail}
            onChange={setPaypalEmail}
            type="email"
            error={errors.paypalEmail}
            hint="Enter the email linked to your PayPal account."
          />
          <button
            onClick={() => {
              if (paypalEmail.includes('@')) { setPaypalSaved(true); setPaypalEditing(false); setErrors({}); }
              else setErrors(e => ({ ...e, paypalEmail: 'Enter a valid PayPal email' }));
            }}
            className="h-9 px-4 rounded-xl border border-blue-300 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
          >
            Save PayPal Account
          </button>
        </>
      )}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#003087]/5 dark:bg-[#003087]/15 border border-[#003087]/10 dark:border-[#6BA4FF]/20">
        <PayPalMark/>
        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad]">You will be redirected to PayPal to authorise the payment securely.</p>
      </div>
    </div>
  );

  const stripePanel = (
    <div className="space-y-3">
      {stripeSaved && !stripeEditing ? (
        <SavedAccount label="Stripe account" value={stripeEmail} onEdit={() => setStripeEditing(true)}/>
      ) : (
        <>
          <Field
            label="Stripe account email"
            placeholder="you@example.com"
            value={stripeEmail}
            onChange={setStripeEmail}
            type="email"
            error={errors.stripeEmail}
            hint="Enter the email linked to your Stripe account."
          />
          <button
            onClick={() => {
              if (stripeEmail.includes('@')) { setStripeSaved(true); setStripeEditing(false); setErrors({}); }
              else setErrors(e => ({ ...e, stripeEmail: 'Enter a valid Stripe account email' }));
            }}
            className="h-9 px-4 rounded-xl border border-[#635BFF]/30 dark:border-[#635BFF]/40 bg-[#635BFF]/5 dark:bg-[#635BFF]/10 text-xs font-bold text-[#635BFF] hover:bg-[#635BFF]/10 transition-all"
          >
            Save Stripe Account
          </button>
        </>
      )}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-[#635BFF]/5 dark:bg-[#635BFF]/10 border border-[#635BFF]/10 dark:border-[#635BFF]/20">
        <StripeMark/>
        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] ml-1">Stripe uses industry-leading encryption to process your payment.</p>
      </div>
    </div>
  );

  const gpayPanel = (
    <div className="space-y-3">
      {gpaySaved && !gpayEditing ? (
        <SavedAccount label="Google account" value={gpayEmail} onEdit={() => setGpayEditing(true)}/>
      ) : (
        <>
          <Field
            label="Google account email"
            placeholder="you@gmail.com"
            value={gpayEmail}
            onChange={setGpayEmail}
            type="email"
            error={errors.gpayEmail}
            hint="Enter your Google account email to link Google Pay."
          />
          <button
            onClick={() => {
              if (gpayEmail.includes('@')) { setGpaySaved(true); setGpayEditing(false); setErrors({}); }
              else setErrors(e => ({ ...e, gpayEmail: 'Enter your Google account email' }));
            }}
            className="h-9 px-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            Save Google Pay Account
          </button>
        </>
      )}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
        <GPayMark/>
        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] ml-1">Pay securely using your saved Google Pay payment methods.</p>
      </div>
    </div>
  );

  const applePanel = (
    <div className="space-y-3">
      {appleSaved && !appleEditing ? (
        <SavedAccount label="Apple ID" value={appleId} onEdit={() => setAppleEditing(true)}/>
      ) : (
        <>
          <Field
            label="Apple ID (email)"
            placeholder="you@icloud.com"
            value={appleId}
            onChange={setAppleId}
            type="email"
            error={errors.appleId}
            hint="Enter your Apple ID to link Apple Pay."
          />
          <button
            onClick={() => {
              if (appleId.includes('@')) { setAppleSaved(true); setAppleEditing(false); setErrors({}); }
              else setErrors(e => ({ ...e, appleId: 'Enter your Apple ID email' }));
            }}
            className="h-9 px-4 rounded-xl border border-slate-800/20 dark:border-white/15 bg-slate-800/5 dark:bg-white/5 text-xs font-bold text-slate-800 dark:text-white hover:bg-slate-800/10 dark:hover:bg-white/10 transition-all"
          >
            Save Apple Pay Account
          </button>
        </>
      )}
      <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
        <ApplePayMark/>
        <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] ml-1">Use Touch ID or Face ID to pay quickly and securely with Apple Pay.</p>
      </div>
    </div>
  );

  const panels: Record<MethodKey, React.ReactNode> = {
    card:     cardPanel,
    paypal:   paypalPanel,
    stripe:   stripePanel,
    gpay:     gpayPanel,
    applepay: applePanel,
  };

  const payBtnLabel: Record<MethodKey, string> = {
    card:     `Pay CAD ${price}`,
    paypal:   `Continue with PayPal · CAD ${price}`,
    stripe:   `Pay via Stripe · CAD ${price}`,
    gpay:     `Pay with Google Pay · CAD ${price}`,
    applepay: ` Pay · CAD ${price}`,
  };
  const payBtnColor: Record<MethodKey, string> = {
    card:     'blue',
    paypal:   'paypal',
    stripe:   'stripe',
    gpay:     'gpay',
    applepay: 'apple',
  };

  // ── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="mb-6">
          <Link href="/student/counselors/book"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15}/> Back to Booking
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Complete Your Payment</h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">Secure your session by completing the payment.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT column ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Order Summary */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Order Summary</h2>
              <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-white/6">
                <div className={cn('w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shrink-0', counselor.gradient)}>
                  {counselor.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{counselor.name}</p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{counselor.title}</p>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Consultation Type', value: type },
                  { label: 'Duration',           value: '60 min' },
                  { label: 'Date',               value: date },
                  { label: 'Time',               value: time + ' (EST)' },
                  { label: 'Fee',                value: `CAD ${price}` },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-400 dark:text-[#8e92ad] shrink-0">{row.label}</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-white text-right">{row.value}</span>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-100 dark:border-white/6 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-white">Total</span>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">CAD {price}</span>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
              <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Personal Details</h2>
              <div className="space-y-3">
                <Field label="Address line" placeholder="P.o.Box 1223" value={addressLine} onChange={setAddressLine}/>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Field label="City"  placeholder="City"  value={city}     onChange={setCity}     half/>
                  <Field label="State" placeholder="State" value={stateVal} onChange={setStateVal} half/>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Field label="Postal code" placeholder="Postal code" value={postal} onChange={setPostal} half/>
                  <div className="flex-1 hidden sm:block"/>
                </div>
              </div>
            </div>

            {/* ── Payment Method selector + form ── */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

              {/* Header */}
              <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-gray-100 dark:border-white/6">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Payment Method</h2>
                <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Choose how you'd like to pay.</p>
              </div>

              {/* Method list — accordion style */}
              <div className="divide-y divide-gray-100 dark:divide-white/6">
                {METHODS.map(m => {
                  const active = method === m.key;
                  return (
                    <div key={m.key}>
                      {/* Method row / trigger */}
                      <button
                        onClick={() => { setMethod(m.key); setErrors({}); }}
                        className={cn(
                          'w-full flex items-center justify-between gap-3 px-5 sm:px-6 py-4 text-left transition-all',
                          active ? 'bg-blue-50 dark:bg-blue-500/8' : 'hover:bg-slate-50 dark:hover:bg-white/3'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {/* Radio dot */}
                          <div className={cn(
                            'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                            active ? 'border-blue-600 bg-blue-600' : 'border-gray-300 dark:border-white/20'
                          )}>
                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white"/>}
                          </div>

                          <div className="flex flex-col">
                            <span className={cn('text-sm font-bold', active ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200')}>
                              {m.label}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{m.sub}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span>{METHOD_MARK[m.key]}</span>
                          {active
                            ? <ChevronDown size={14} className="text-blue-500"/>
                            : <ChevronRight size={14} className="text-slate-400"/>
                          }
                        </div>
                      </button>

                      {/* Expandable form panel */}
                      {active && (
                        <div className="px-5 sm:px-6 pb-5 pt-1 bg-blue-50/50 dark:bg-blue-500/4 border-t border-blue-100 dark:border-blue-500/10">
                          <div className="pt-4">
                            {panels[m.key]}
                            <PayBtn
                              label={payBtnLabel[m.key]}
                              onClick={handlePay}
                              color={payBtnColor[m.key]}
                            />
                            {/* Trust badges */}
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
                              {[
                                { icon: Shield, label: 'Secured Payments' },
                                { icon: Lock,   label: `CAD ${price}` },
                                { icon: Check,  label: 'Trusted by Students' },
                              ].map(b => {
                                const Icon = b.icon;
                                return (
                                  <div key={b.label} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad]">
                                    <Icon size={10} className="text-slate-300 dark:text-white/25"/>
                                    {b.label}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* ── RIGHT sidebar ── */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">
            <InfoCard
              icon={Shield}
              iconClass="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              title="Your Payment is Safe"
              desc="We use industry standard encryption to protect your payment information."
            />
            <InfoCard
              icon={MessageSquare}
              iconClass="bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
              title="Session Guaranteed"
              desc="If your session is canceled by the counselor you will get a full refund."
            />
            <InfoCard
              icon={HeadphonesIcon}
              iconClass="bg-slate-100 dark:bg-white/6 text-slate-500 dark:text-slate-400"
              title="Need Help?"
              desc="Our support team is here to help you find the right counselor."
            />
            <InfoCard
              icon={X}
              iconClass="bg-rose-50 dark:bg-rose-500/15 text-rose-500 dark:text-rose-400"
              title="Cancel Anytime"
              desc="You can reschedule or cancel up to 24 hours before the session."
            />
          </aside>

        </div>
      </div>
    </div>
  );
}
