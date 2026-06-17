'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ChevronLeft, Users, Clock, ShieldCheck, CalendarCheck,
  CheckCircle2, Send, CreditCard, Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSessionPaymentRequests } from '@/src/lib/sessionPayments';

// ── Sidebar info card ─────────────────────────────────────────────────────────
function InfoCard({ icon: Icon, iconClass, title, desc }: {
  icon: React.ElementType; iconClass: string; title: string; desc: string;
}) {
  return (
    <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
      <div className="flex items-start gap-3">
        <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0', iconClass)}>
          <Icon size={15} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-800 dark:text-white mb-0.5">{title}</p>
          <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] leading-relaxed">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function StepRow({ done, active, title, desc }: {
  done: boolean; active: boolean; title: string; desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5',
        done
          ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
          : active
            ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
            : 'bg-slate-100 dark:bg-white/6 text-slate-400 dark:text-[#8e92ad]',
      )}>
        {done ? <CheckCircle2 size={15} /> : active ? <Clock size={14} /> : <CreditCard size={13} />}
      </div>
      <div>
        <p className={cn('text-sm font-bold',
          done ? 'text-emerald-700 dark:text-emerald-400'
            : active ? 'text-slate-800 dark:text-white'
            : 'text-slate-500 dark:text-[#8e92ad]')}>
          {title}
        </p>
        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] leading-relaxed mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function Confirmation() {
  const params = useSearchParams();
  const reqId  = params.get('reqId');
  const requests = useSessionPaymentRequests();
  const request = requests.find(r => r.id === reqId);

  const isPaid = request?.status === 'paid';
  const free   = request ? request.price === 0 : false;
  const priceText = request ? (free ? 'Free' : `CAD ${request.price}`) : '—';

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* Header */}
        <div className="mb-6">
          <Link href="/university-college-student-route/counselors/book"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-blue-600 transition-colors mb-2">
            <ChevronLeft size={15} /> Back to Booking
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            {free ? 'Request Sent for Approval' : 'Payment Request Sent'}
          </h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
            Your session request has been forwarded to your parent / guardian.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── LEFT column ── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Status banner */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6 sm:p-7">
              <div className="flex flex-col items-center text-center gap-4">
                <div className={cn('w-16 h-16 rounded-full flex items-center justify-center',
                  isPaid
                    ? 'bg-emerald-100 dark:bg-emerald-500/20'
                    : 'bg-blue-100 dark:bg-blue-500/20')}>
                  {isPaid
                    ? <CalendarCheck size={30} className="text-emerald-600 dark:text-emerald-400" />
                    : <Send size={28} className="text-blue-600 dark:text-blue-400" />}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {!request
                      ? 'Request not found'
                      : isPaid
                        ? 'Session confirmed!'
                        : free
                          ? 'Sent to your parent for approval'
                          : 'Sent to your parent for payment'}
                  </h2>
                  <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-1 leading-relaxed max-w-md">
                    {!request
                      ? 'We couldn’t find this booking request. It may have been completed or cleared. Please start a new booking.'
                      : isPaid
                        ? <>Your parent / guardian has {free ? 'approved' : 'paid for'} this session. It now appears on your booking calendar.</>
                        : <>We’ve notified your parent / guardian. Your session with <strong className="text-slate-700 dark:text-slate-200">{request.counselorName}</strong> will appear on your booking calendar once they {free ? 'approve it' : 'complete the payment'}.</>}
                  </p>
                </div>

                {request && (
                  <span className={cn('text-xs font-bold px-3 py-1.5 rounded-full',
                    isPaid
                      ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-500/20'
                      : 'bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-100 dark:border-amber-500/20')}>
                    {isPaid ? (free ? 'Approved' : 'Paid') : (free ? 'Awaiting approval' : 'Awaiting parent payment')}
                  </span>
                )}
              </div>
            </div>

            {/* Order summary */}
            {request && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Session Summary</h2>
                <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-white/6">
                  <div className={cn('w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-sm shrink-0', request.gradient)}>
                    {request.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{request.counselorName}</p>
                    <p className="text-xs text-slate-400 dark:text-[#8e92ad]">{request.counselorTitle}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: 'Consultation Type', value: request.type },
                    { label: 'Duration',          value: '60 min' },
                    { label: 'Date',              value: request.dateLabel },
                    { label: 'Time',              value: request.time + ' (EST)' },
                    { label: 'Requested for',     value: request.studentName },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-400 dark:text-[#8e92ad] shrink-0">{row.label}</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white text-right">{row.value}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-gray-100 dark:border-white/6 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-white">Amount</span>
                    <span className="text-sm font-black text-blue-600 dark:text-blue-400">{priceText}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Progress steps */}
            {request && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">What happens next</h2>
                <div className="space-y-4">
                  <StepRow done active={false} title="You requested this session" desc="The booking details were sent for approval." />
                  <StepRow
                    done={isPaid}
                    active={!isPaid}
                    title={free ? 'Parent / guardian approves' : 'Parent / guardian completes payment'}
                    desc={free
                      ? 'A parent reviews and approves the session from their dashboard.'
                      : 'A parent reviews and pays for the session from their dashboard.'}
                  />
                  <StepRow
                    done={isPaid}
                    active={false}
                    title="Session added to your calendar"
                    desc="Once confirmed, it appears under “My Booked Sessions”."
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pb-2">
              <Link href="/university-college-student-route/counselors/book"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                Book Another Session
              </Link>
              <Link href="/university-college-student-route/counselors"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all shadow-sm">
                <CalendarCheck size={14} /> View My Booked Sessions
              </Link>
            </div>
          </div>

          {/* ── RIGHT sidebar ── */}
          <aside className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">
            <InfoCard
              icon={Users}
              iconClass="bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400"
              title="Parent-Approved Bookings"
              desc="Sessions are paid and approved by a parent or guardian before they are confirmed."
            />
            <InfoCard
              icon={Bell}
              iconClass="bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400"
              title="They’ve Been Notified"
              desc="This request now shows on the parent dashboard for any of your guardians to action."
            />
            <InfoCard
              icon={ShieldCheck}
              iconClass="bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              title="No Payment Needed From You"
              desc="You never enter card details — all payments are handled securely by your guardian."
            />
          </aside>

        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]" />
    }>
      <Confirmation />
    </Suspense>
  );
}
