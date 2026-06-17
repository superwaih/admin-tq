'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

/* Numbered section header (blue circle badge + title + subtitle) */
export function SectionTitle({ n, title, subtitle, icon }: {
  n?: number; title: string; subtitle?: string; icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      {typeof n === 'number' && (
        <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          {n}
        </span>
      )}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
          {icon}{title}
        </h3>
        {subtitle && <p className="text-xs text-slate-500 dark:text-[#8e92ad] mt-0.5 leading-relaxed">{subtitle}</p>}
      </div>
    </div>
  );
}

export function FieldLabel({ children, optional }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-[11px] font-bold text-slate-700 dark:text-[#c8ccdf] mb-1">
      {children}{optional && <span className="font-normal text-slate-400 dark:text-[#8e92ad]"> (Optional)</span>}
    </label>
  );
}

const inputBase =
  'w-full h-10 px-3 text-xs rounded-xl bg-gray-50 border border-gray-200 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all placeholder:text-slate-400';

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputBase, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        'w-full px-3 py-2.5 text-xs rounded-xl bg-gray-50 border border-gray-200 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all resize-none placeholder:text-slate-400',
        props.className,
      )}
    />
  );
}

export function SelectInput({ value, onChange, options, placeholder, className }: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; className?: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputBase, 'cursor-pointer', className)}
    >
      <option value="">{placeholder ?? 'Select'}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

/* Educator note box — indigo tinted to denote the "second voice" */
export function EducatorBox({ title, subtitle, children }: {
  title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
      <p className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{title}</p>
      {subtitle && <p className="text-[11px] text-indigo-500/90 dark:text-indigo-300/70 mt-0.5 mb-2.5 leading-relaxed">{subtitle}</p>}
      <div className={subtitle ? '' : 'mt-2.5'}>{children}</div>
    </div>
  );
}

/* Selectable chip (subjects, factors) */
export function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all',
        selected
          ? 'bg-blue-50 border-blue-200 text-blue-700'
          : 'bg-gray-50 border-gray-200 text-slate-500 dark:text-[#8e92ad] hover:border-blue-200',
      )}
    >
      {selected && <Check size={11} />}{label}
    </button>
  );
}

/* 1–5 rating scale (radio circles with numbers above) */
export function RatingScale({ value, onChange, accent = 'blue' }: {
  value: number; onChange: (n: number) => void; accent?: 'blue' | 'emerald';
}) {
  const accentCls = accent === 'emerald'
    ? 'bg-emerald-500 border-emerald-500 text-white'
    : 'bg-blue-600 border-blue-600 text-white';
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={cn(
            'w-8 h-8 rounded-full border text-xs font-bold flex items-center justify-center transition-all',
            value === n
              ? accentCls
              : 'bg-white border-gray-200 text-slate-400 dark:text-[#8e92ad] hover:border-blue-300',
          )}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

/* Radio option card (learning style, pathway leaning) */
export function OptionCard({ label, sublabel, selected, onClick, className }: {
  label: string; sublabel?: string; selected: boolean; onClick: () => void; className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-start gap-2.5 w-full text-left px-3.5 py-3 rounded-xl border transition-all',
        selected
          ? 'bg-blue-50 border-blue-300'
          : 'bg-white border-gray-200 hover:border-blue-200',
        className,
      )}
    >
      <span className={cn(
        'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
        selected ? 'border-blue-600' : 'border-gray-300',
      )}>
        {selected && <span className="w-2 h-2 rounded-full bg-blue-600" />}
      </span>
      <span>
        <span className="block text-xs font-semibold text-slate-800 dark:text-white">{label}</span>
        {sublabel && <span className="block text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{sublabel}</span>}
      </span>
    </button>
  );
}

/* Large value selection card with checkmark (work values) */
export function ValueCard({ label, desc, icon, selected, onClick }: {
  label: string; desc: string; icon?: React.ReactNode; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-start gap-3 w-full text-left p-4 rounded-2xl border transition-all',
        selected ? 'bg-indigo-50 border-indigo-300' : 'bg-white border-gray-200 hover:border-indigo-200',
      )}
    >
      <div className="flex-1">
        <p className="text-xs font-bold text-slate-800 dark:text-white">{label}</p>
        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">{desc}</p>
      </div>
      <span className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all',
        selected ? 'bg-blue-600 text-white' : 'border border-gray-300',
      )}>
        {selected && <Check size={12} />}
      </span>
    </button>
  );
}

/* Info banner (light blue) */
export function InfoBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-indigo-50 border border-indigo-100 px-4 py-3 text-[11px] text-indigo-700 dark:text-indigo-300 leading-relaxed">
      {children}
    </div>
  );
}

/* White card wrapper for a step block */
export function StepCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6', className)}>
      {children}
    </div>
  );
}
