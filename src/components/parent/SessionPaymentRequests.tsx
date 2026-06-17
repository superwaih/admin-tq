'use client';

import { useMemo, useState } from 'react';
import {
  CreditCard, Clock, CheckCircle2, Video, ShieldCheck, Lock,
  CalendarDays, GraduationCap,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import {
  useSessionPaymentRequests, markPaid, type SessionPaymentRequest,
} from '@/src/lib/sessionPayments';

type MethodKey = 'card' | 'paypal' | 'stripe' | 'gpay' | 'applepay';

const METHODS: { key: MethodKey; label: string; sub: string }[] = [
  { key: 'card',     label: 'Credit / Debit Card', sub: 'Visa, Mastercard, Amex' },
  { key: 'paypal',   label: 'PayPal',              sub: 'Pay with your PayPal account' },
  { key: 'stripe',   label: 'Stripe',              sub: 'Stripe-linked card or wallet' },
  { key: 'gpay',     label: 'Google Pay',          sub: 'Pay with Google Pay' },
  { key: 'applepay', label: 'Apple Pay',           sub: 'Pay with Apple Pay' },
];

function StatusBadge({ status, free }: { status: SessionPaymentRequest['status']; free: boolean }) {
  if (status === 'paid') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20">
        <CheckCircle2 size={11} /> {free ? 'Approved' : 'Paid'}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20">
      <Clock size={11} /> Action needed
    </span>
  );
}

function RequestRow({ req, onPay }: { req: SessionPaymentRequest; onPay: (r: SessionPaymentRequest) => void }) {
  const free  = req.price === 0;
  const paid  = req.status === 'paid';
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-gray-50 dark:bg-white/4 border border-gray-100 dark:border-white/6">
      <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0', req.gradient)}>
        {req.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{req.counselorName}</p>
          <StatusBadge status={req.status} free={free} />
        </div>
        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] truncate">{req.counselorTitle}</p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <GraduationCap size={11} className="text-slate-400" /> {req.studentName}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <CalendarDays size={11} className="text-slate-400" /> {req.dateLabel}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Clock size={11} className="text-slate-400" /> {req.time}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <Video size={11} className="text-slate-400" /> {req.type}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
        <span className={cn('text-sm font-black', free ? 'text-emerald-600 dark:text-emerald-400' : 'text-violet-600 dark:text-violet-400')}>
          {free ? 'Free' : `CAD ${req.price}`}
        </span>
        {paid ? (
          <span className="text-[10px] font-semibold text-slate-400 dark:text-[#8e92ad]">
            {free ? 'Confirmed' : `Paid · ${req.paidVia ?? 'Card'}`}
          </span>
        ) : (
          <button
            onClick={() => onPay(req)}
            className={cn(
              'px-4 py-1.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm',
              free ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-violet-600 hover:bg-violet-700',
            )}
          >
            {free ? 'Approve' : 'Pay Now'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function SessionPaymentRequests() {
  const requests = useSessionPaymentRequests();
  const [active, setActive] = useState<SessionPaymentRequest | null>(null);
  const [method, setMethod] = useState<MethodKey>('card');

  const pending = useMemo(() => requests.filter(r => r.status === 'pending'), [requests]);
  const paid    = useMemo(() => requests.filter(r => r.status === 'paid'), [requests]);
  const sorted  = useMemo(() => [...pending, ...paid], [pending, paid]);

  const confirmPayment = () => {
    if (!active) return;
    const label = active.price === 0 ? 'Free' : (METHODS.find(m => m.key === method)?.label ?? 'Card');
    markPaid(active.id, label);
    setActive(null);
  };

  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
            <CreditCard size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Session Payment Requests</h3>
            <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">
              Approve and pay for sessions your children have requested.
            </p>
          </div>
        </div>
        {pending.length > 0 && (
          <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20">
            {pending.length} pending
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-10 px-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3">
            <CreditCard size={20} className="text-slate-300 dark:text-white/25" />
          </div>
          <p className="text-sm font-bold text-slate-700 dark:text-white">No payment requests yet</p>
          <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-1 max-w-xs">
            When your child requests a counselling or mentoring session, it will appear here for you to approve and pay.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {sorted.map(req => (
            <RequestRow key={req.id} req={req} onPay={setActive} />
          ))}
        </div>
      )}

      {/* Payment dialog */}
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden gap-0">
          {active && (
            <>
              <DialogTitle className="sr-only">
                {active.price === 0 ? 'Approve' : 'Pay for'} session with {active.counselorName}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Review and {active.price === 0 ? 'approve' : 'pay for'} the {active.type} session requested by {active.studentName}.
              </DialogDescription>

              {/* Header */}
              <div className="px-5 py-4 bg-violet-50 dark:bg-violet-500/10 border-b border-violet-100 dark:border-violet-500/20">
                <div className="flex items-center gap-3">
                  <div className={cn('w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold shrink-0', active.gradient)}>
                    {active.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{active.counselorName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#8e92ad] truncate">{active.type} · for {active.studentName}</p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Summary */}
                <div className="rounded-xl bg-slate-50 dark:bg-white/4 border border-gray-100 dark:border-white/6 p-4 space-y-2.5">
                  {[
                    { l: 'Date',     v: active.dateLabel },
                    { l: 'Time',     v: active.time + ' (EST)' },
                    { l: 'Duration', v: '60 min' },
                  ].map(r => (
                    <div key={r.l} className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 dark:text-[#8e92ad]">{r.l}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{r.v}</span>
                    </div>
                  ))}
                  <div className="pt-2.5 border-t border-gray-100 dark:border-white/6 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-white">Total</span>
                    <span className="text-sm font-black text-violet-600 dark:text-violet-400">
                      {active.price === 0 ? 'Free' : `CAD ${active.price}`}
                    </span>
                  </div>
                </div>

                {active.notes && (
                  <div className="rounded-xl bg-blue-50/60 dark:bg-blue-500/8 border border-blue-100 dark:border-blue-500/15 p-3">
                    <p className="text-[10px] font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide mb-1">Student note</p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{active.notes}</p>
                  </div>
                )}

                {/* Payment methods (paid sessions only) */}
                {active.price > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 dark:text-white mb-2">Payment Method</p>
                    <div className="space-y-1.5">
                      {METHODS.map(m => {
                        const sel = method === m.key;
                        return (
                          <button
                            key={m.key}
                            onClick={() => setMethod(m.key)}
                            className={cn(
                              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-left transition-all',
                              sel
                                ? 'border-violet-400 dark:border-violet-500/50 bg-violet-50 dark:bg-violet-500/10'
                                : 'border-gray-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5',
                            )}
                          >
                            <div className={cn(
                              'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                              sel ? 'border-violet-600 bg-violet-600' : 'border-gray-300 dark:border-white/20',
                            )}>
                              {sel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                            <div className="flex flex-col">
                              <span className={cn('text-xs font-bold', sel ? 'text-violet-700 dark:text-violet-300' : 'text-slate-700 dark:text-slate-200')}>
                                {m.label}
                              </span>
                              <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{m.sub}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button
                  onClick={confirmPayment}
                  className={cn(
                    'w-full flex items-center justify-center gap-2 h-11 rounded-xl text-white text-sm font-bold transition-all shadow-sm',
                    active.price === 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-violet-600 hover:bg-violet-700',
                  )}
                >
                  {active.price === 0
                    ? <><CheckCircle2 size={15} /> Approve Session</>
                    : <><Lock size={14} /> Pay CAD {active.price}</>}
                </button>

                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] flex items-center justify-center gap-1">
                  <ShieldCheck size={11} /> Once {active.price === 0 ? 'approved' : 'paid'}, the session is added to your child’s calendar.
                </p>

                <DialogClose className="sr-only">Close</DialogClose>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
