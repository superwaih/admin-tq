'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, ChevronDown, FileText, BarChart2, Calendar,
  Layers, Download, FileSpreadsheet, CheckCircle2,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────
type ReportType = 'student-list' | 'performance' | 'attendance' | 'season';
type ExportFormat = 'doc' | 'pdf' | 'xls' | 'docx';

// ── Report type options ────────────────────────────────────────────────────────
const REPORT_TYPES: Array<{ id: ReportType; label: string; desc: string; icon: React.ReactNode }> = [
  { id: 'student-list',  label: 'Student List',        desc: 'Export basic student information',      icon: <FileText size={16} /> },
  { id: 'performance',   label: 'Performance Report',  desc: 'Export academic performance data',      icon: <BarChart2 size={16} /> },
  { id: 'attendance',    label: 'Attendance Report',   desc: 'Export attendance and activity data',   icon: <Calendar size={16} /> },
  { id: 'season',        label: 'Season Report',       desc: 'Export counseling session details',     icon: <Layers size={16} /> },
];

// ── Format options ─────────────────────────────────────────────────────────────
const FORMAT_OPTIONS: Array<{ id: ExportFormat; label: string; color: string; bg: string }> = [
  { id: 'doc',  label: 'DOC',  color: 'text-blue-600',  bg: 'bg-blue-100 dark:bg-blue-500/20' },
  { id: 'pdf',  label: 'PDF',  color: 'text-red-600',   bg: 'bg-red-100 dark:bg-red-500/20' },
  { id: 'xls',  label: 'XLS',  color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  { id: 'docx', label: 'DOCX', color: 'text-indigo-600', bg: 'bg-indigo-100 dark:bg-indigo-500/20' },
];

// ── Reusable helpers ───────────────────────────────────────────────────────────
function SelectField({ label, options, value, onChange, placeholder }: {
  label?: string; options: string[]; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      {label && <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">{label}</p>}
      <div className="relative">
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm bg-white dark:bg-[#1d2133] border border-gray-200 dark:border-white/10 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function SectionTitle({ num, title }: { num: string; title: string }) {
  return (
    <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">
      {num}. {title}
    </h2>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function ExportReportsPage() {
  const [reportType, setReportType] = useState<ReportType>('student-list');
  const [format, setFormat] = useState<ExportFormat>('doc');

  const [department, setDepartment] = useState('All Departments');
  const [level,      setLevel]      = useState('');
  const [status,     setStatus]     = useState('');
  const [acadYear,   setAcadYear]   = useState('2025 - 2025');
  const [dateRange,  setDateRange]  = useState('May 1, 2025 - May 22, 2025');
  const [stuStatus,  setStuStatus]  = useState('Active Students');

  const [exporting, setExporting] = useState(false);
  const [done,      setDone]      = useState(false);

  function handleExport() {
    setExporting(true);
    setTimeout(() => { setExporting(false); setDone(true); }, 1800);
    setTimeout(() => setDone(false), 4000);
  }

  // Preview stats derived from current filters
  const previewStats = [
    { label: 'Students to be exported', value: department === 'All Departments' ? 120 : 24 },
    { label: 'Departments', value: department === 'All Departments' ? 8 : 1 },
    { label: 'Levels', value: level ? 1 : 4 },
    { label: 'Date Range', value: dateRange, isText: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1200px] mx-auto">

        {/* ── Page header ─────────────────────────────────────── */}
        <div className="mb-6">
          <Link
            href="/counselor/my-students"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1"
          >
            <ChevronLeft size={15} /> Back to My Students
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Export Reports
          </h1>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
            Export student data and performance reports in your preferred format.
          </p>
        </div>

        {/* ── Three-column main grid ───────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px] gap-5 items-start">

          {/* ── Col 1: Report Type ──────────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
            <SectionTitle num="1" title="Select Report Type" />
            <div className="space-y-2.5">
              {REPORT_TYPES.map(r => {
                const active = reportType === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setReportType(r.id)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all text-left ${
                      active
                        ? 'border-cyan-500/50 bg-cyan-50 dark:bg-cyan-500/10'
                        : 'border-gray-200 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        active
                          ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400'
                          : 'bg-gray-100 dark:bg-white/8 text-slate-400 dark:text-[#8e92ad]'
                      }`}>
                        {r.icon}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>
                          {r.label}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-[#8e92ad]">{r.desc}</p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      active
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-gray-300 dark:border-white/20'
                    }`}>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Col 2: Filters ──────────────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
            <SectionTitle num="2" title="Select Filters" />

            <div className="space-y-4">
              <SelectField
                label="Departments"
                placeholder="All Departments"
                options={['All Departments','Computer Science','Software Engineering','Cyber Security','Data Science','Medicine','Nursing','Pharmacy']}
                value={department}
                onChange={setDepartment}
              />
              <SelectField
                label="Level"
                placeholder="All Levels"
                options={['All Levels','100 Level','200 Level','300 Level','400 Level','Graduate']}
                value={level}
                onChange={setLevel}
              />
              <SelectField
                label="Status"
                placeholder="All Statuses"
                options={['All Statuses','Excellent','Active','At Risk','Warning']}
                value={status}
                onChange={setStatus}
              />

              {/* hint */}
              <div className="px-3 py-2.5 bg-cyan-50 dark:bg-cyan-500/8 border border-cyan-100 dark:border-cyan-500/20 rounded-xl">
                <p className="text-[11px] text-cyan-700 dark:text-cyan-400">
                  Leave filters empty to export all data
                </p>
              </div>
            </div>
          </div>

          {/* ── Col 3: Academic filters ──────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
            <div className="space-y-4">
              <SelectField
                label="Academic Year"
                options={['2023 - 2024','2024 - 2025','2025 - 2025']}
                value={acadYear}
                onChange={setAcadYear}
              />

              <div>
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Date Range</p>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-300 dark:border-white/20 absolute left-3 top-1/2 -translate-y-1/2" />
                    <SelectField
                      options={['May 1, 2025 - May 22, 2025','Apr 1, 2025 - Apr 30, 2025','Mar 1, 2025 - Mar 31, 2025','Jan 1, 2025 - May 22, 2025','Full Academic Year']}
                      value={dateRange}
                      onChange={setDateRange}
                    />
                  </div>
                </div>
              </div>

              <SelectField
                label="Student Status"
                options={['Active Students','All Students','At Risk Only','Excellent Only']}
                value={stuStatus}
                onChange={setStuStatus}
              />
            </div>
          </div>
        </div>

        {/* ── Format + Preview row ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-5 mt-5 items-start">

          {/* ── Format selector ──────────────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
            <SectionTitle num="3" title="Select Format" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {FORMAT_OPTIONS.map(f => {
                const active = format === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFormat(f.id)}
                    className={`flex flex-col items-center gap-2.5 py-4 px-3 rounded-xl border-2 transition-all ${
                      active
                        ? 'border-cyan-500/60 bg-cyan-50 dark:bg-cyan-500/10'
                        : 'border-gray-200 dark:border-white/8 hover:bg-gray-50 dark:hover:bg-white/[0.03]'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.color} flex items-center justify-center`}>
                      {f.id === 'xls' ? <FileSpreadsheet size={18} /> : <FileText size={18} />}
                    </div>
                    <span className={`text-sm font-bold ${active ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-[#c8ccdf]'}`}>
                      {f.label}
                    </span>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                      active ? 'border-cyan-500 bg-cyan-500' : 'border-gray-300 dark:border-white/20'
                    }`}>
                      {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Export preview summary ───────────────────────────── */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 lg:p-6">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">4. Export Preview</h2>
            <div className="grid grid-cols-2 gap-3">
              {previewStats.map((s, i) => (
                <div key={i} className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3 border border-gray-100 dark:border-white/6">
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] font-medium mb-1">{s.label}</p>
                  <p className={`font-bold ${s.isText ? 'text-xs text-slate-600 dark:text-[#c8ccdf]' : 'text-xl text-slate-800 dark:text-white'}`}>
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Export summary chip */}
            <div className="mt-3 px-3 py-2 bg-cyan-50 dark:bg-cyan-500/10 rounded-xl border border-cyan-100 dark:border-cyan-500/20">
              <p className="text-[11px] text-cyan-700 dark:text-cyan-400 font-medium">
                {REPORT_TYPES.find(r => r.id === reportType)?.label} · {FORMAT_OPTIONS.find(f => f.id === format)?.label.toUpperCase()} format
              </p>
            </div>
          </div>
        </div>

        {/* ── Bottom action bar ─────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-end gap-3 mt-5 pb-4">
          <Link
            href="/counselor/my-students"
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
          >
            Cancel
          </Link>
          <button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
              done
                ? 'bg-emerald-600 text-white shadow-emerald-200 dark:shadow-emerald-900/20'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-cyan-200 dark:shadow-cyan-900/20 disabled:opacity-70'
            }`}
          >
            {done ? (
              <><CheckCircle2 size={15} /> Exported!</>
            ) : exporting ? (
              <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Exporting…</>
            ) : (
              <><Download size={15} /> Export Report</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
