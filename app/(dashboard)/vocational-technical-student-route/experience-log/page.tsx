'use client';

import React, { useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Upload, FileText, CheckCircle2, Clock, ShieldCheck,
  Building2, MapPin, CalendarDays, Award, X, Trash2, Info, Plus,
  BadgeCheck, GraduationCap, Lightbulb, Loader2,
} from 'lucide-react';
import { PATHWAYS } from '../career/pathways';

/* ── Reference data: Canadian provinces & pathway certification needs ── */

const PROVINCES = [
  { code: 'ON', name: 'Ontario', body: 'Skilled Trades Ontario' },
  { code: 'QC', name: 'Quebec', body: 'Commission de la construction du Québec (CCQ)' },
  { code: 'AB', name: 'Alberta', body: 'Apprenticeship & Industry Training (AIT)' },
  { code: 'BC', name: 'British Columbia', body: 'SkilledTradesBC' },
  { code: 'SK', name: 'Saskatchewan', body: 'Sask. Apprenticeship (SATCC)' },
  { code: 'MB', name: 'Manitoba', body: 'Apprenticeship Manitoba' },
  { code: 'NS', name: 'Nova Scotia', body: 'NS Apprenticeship Agency' },
];

interface CertReq {
  name: string;
  detail: string;
  hours?: string;
}

/* Canada-wide baseline certifications per pathway (province-independent). */
const PATHWAY_BASE: Record<string, { note: string; siteWork: boolean; certs: CertReq[] }> = {
  electrician: {
    note: 'High-school co-op or pre-apprenticeship hours count toward your electrical apprenticeship record.',
    siteWork: true,
    certs: [
      { name: 'WHMIS 2015', detail: 'Workplace hazardous materials — mandatory before any shop placement.' },
      { name: 'Standard First Aid & CPR-C', detail: 'Recognized provider (Red Cross / St. John Ambulance).', hours: '~16 hrs' },
      { name: 'Electrical Safety / Lockout-Tagout', detail: 'Awareness of arc-flash and lockout procedures.' },
    ],
  },
  automotive: {
    note: 'Service-bay hours during high-school co-op apply to your automotive apprenticeship record.',
    siteWork: false,
    certs: [
      { name: 'WHMIS 2015', detail: 'Required before working with shop chemicals and fluids.' },
      { name: 'Standard First Aid & CPR-C', detail: 'Recognized provider certification.', hours: '~16 hrs' },
      { name: 'Refrigerant Handling (ODP)', detail: 'Ozone Depletion Prevention card for A/C service.' },
      { name: 'Shop & Hoist Safety', detail: 'Safe vehicle lifting and equipment operation.' },
    ],
  },
  construction: {
    note: 'Site placements through co-op build hours toward your civil technician program.',
    siteWork: true,
    certs: [
      { name: 'WHMIS 2015', detail: 'Mandatory hazardous-materials awareness.' },
      { name: 'Standard First Aid & CPR-C', detail: 'Recognized provider certification.', hours: '~16 hrs' },
      { name: 'Confined Space Awareness', detail: 'Entry and rescue awareness for site work.' },
    ],
  },
  welder: {
    note: 'Shop and fabrication hours from high-school programs support your welding apprenticeship record.',
    siteWork: true,
    certs: [
      { name: 'WHMIS 2015', detail: 'Required before any welding shop placement.' },
      { name: 'Hot Work / Fire Safety', detail: 'Safe handling of ignition sources and fire watch.' },
      { name: 'CWB Welder Qualification (W47.1)', detail: 'Canadian Welding Bureau ticket for structural welds.' },
      { name: 'Standard First Aid & CPR-C', detail: 'Recognized provider certification.', hours: '~16 hrs' },
    ],
  },
};

/* Province-specific site-safety ticket (differs by jurisdiction). */
const PROVINCE_SAFETY: Record<string, CertReq> = {
  ON: { name: 'Working at Heights (CPO-approved)', detail: 'Ontario-mandated fall-protection training for construction projects.', hours: '~8 hrs' },
  QC: { name: 'ASP Construction Safety Card', detail: 'Quebec health & safety course required to work on construction sites.', hours: '~30 hrs' },
  AB: { name: 'Fall Protection (Alberta OHS)', detail: 'Alberta fall-protection certification for elevated work.', hours: '~8 hrs' },
  BC: { name: 'Fall Protection (WorkSafeBC)', detail: 'WorkSafeBC fall-protection training for site work.', hours: '~8 hrs' },
  SK: { name: 'Fall Protection (Sask. OHS)', detail: 'Saskatchewan fall-protection certification.', hours: '~8 hrs' },
  MB: { name: 'Fall Protection (SAFE Work MB)', detail: 'SAFE Work Manitoba fall-protection training.', hours: '~8 hrs' },
  NS: { name: 'Fall Protection (NS OHS)', detail: 'Nova Scotia fall-protection certification.', hours: '~8 hrs' },
};

/* Province-specific apprenticeship record / logbook authority. */
const PROVINCE_LOGBOOK: Record<string, string> = {
  ON: 'Apprenticeship Logbook (Skilled Trades Ontario)',
  QC: "Carnet d'apprentissage (CCQ)",
  AB: 'Apprenticeship Record Book (AIT)',
  BC: 'Work-Based Training Hours (SkilledTradesBC)',
  SK: 'Apprenticeship Logbook (SATCC)',
  MB: 'Apprenticeship Hours (Apprenticeship Manitoba)',
  NS: 'Apprenticeship Logbook (NS Apprenticeship Agency)',
};

function getRequirements(pathwayId: string, provinceCode: string): { note: string; certs: CertReq[] } {
  const base = PATHWAY_BASE[pathwayId] ?? PATHWAY_BASE.electrician;
  const certs: CertReq[] = [...base.certs];
  if (base.siteWork && PROVINCE_SAFETY[provinceCode]) {
    certs.push(PROVINCE_SAFETY[provinceCode]);
  }
  certs.push({
    name: PROVINCE_LOGBOOK[provinceCode] ?? PROVINCE_LOGBOOK.ON,
    detail: 'Documented on-the-job hours signed by a supervisor and tracked with your provincial authority.',
    hours: 'Ongoing',
  });
  return { note: base.note, certs };
}

const EXPERIENCE_TYPES = [
  'Industry Certification',
  'High-School Co-op Placement',
  'Pre-Apprenticeship Training',
  'Skilled-Trades Camp / Workshop',
  'Volunteer / Community Build',
  'Part-time Trade Job',
];

type LogStatus = 'verified' | 'pending';

interface ExperienceLog {
  id: string;
  title: string;
  type: string;
  organization: string;
  province: string;
  date: string;
  hours: number;
  fileName: string;
  status: LogStatus;
}

const SEED_LOGS: ExperienceLog[] = [
  {
    id: 'seed-1', title: 'WHMIS 2015 Certification', type: 'Industry Certification',
    organization: 'Humber College — Skilled Trades', province: 'ON', date: 'Apr 12, 2026',
    hours: 4, fileName: 'whmis-certificate.pdf', status: 'verified',
  },
  {
    id: 'seed-2', title: 'Electrical Co-op Placement', type: 'High-School Co-op Placement',
    organization: 'Bright Spark Electric Ltd.', province: 'ON', date: 'May 02, 2026',
    hours: 40, fileName: 'coop-hours-log.pdf', status: 'pending',
  },
];

const card = 'bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm';
const inputBase = 'w-full px-3 py-2.5 text-sm rounded-xl bg-white dark:bg-[#11151f] border border-gray-200 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-gray-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400';
const labelBase = 'block text-[12px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5';

export default function ExperienceLogPage() {
  const [pathwayId, setPathwayId] = useState('electrician');
  const [province, setProvince] = useState('ON');
  const [logs, setLogs] = useState<ExperienceLog[]>(SEED_LOGS);

  // form state
  const [title, setTitle] = useState('');
  const [type, setType] = useState(EXPERIENCE_TYPES[0]);
  const [organization, setOrganization] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pathway = PATHWAYS.find((p) => p.id === pathwayId) ?? PATHWAYS[0];
  const reqs = getRequirements(pathwayId, province);
  const provinceInfo = PROVINCES.find((p) => p.code === province) ?? PROVINCES[0];

  const totalHours = useMemo(() => logs.reduce((sum, l) => sum + l.hours, 0), [logs]);
  const verifiedCount = useMemo(() => logs.filter((l) => l.status === 'verified').length, [logs]);
  const HOURS_GOAL = 200;
  const hoursPct = Math.min(100, Math.round((totalHours / HOURS_GOAL) * 100));

  const formValid = title.trim() && organization.trim() && date.trim() && Number(hours) > 0 && file;

  const pickFile = (f: File | null) => setFile(f);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) pickFile(f);
  };

  const resetForm = () => {
    setTitle(''); setType(EXPERIENCE_TYPES[0]); setOrganization('');
    setDate(''); setHours(''); setDescription(''); setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid || submitting) return;
    setSubmitting(true);
    // Simulate upload/processing
    setTimeout(() => {
      const newLog: ExperienceLog = {
        id: `log-${Date.now()}`,
        title: title.trim(),
        type,
        organization: organization.trim(),
        province,
        date: date
          ? new Date(date).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: '2-digit' })
          : 'Pending',
        hours: Number(hours),
        fileName: file?.name ?? 'document.pdf',
        status: 'pending',
      };
      setLogs((prev) => [newLog, ...prev]);
      setSubmitting(false);
      setSubmitted(true);
      resetForm();
      setTimeout(() => setSubmitted(false), 3500);
    }, 900);
  };

  const removeLog = (id: string) => setLogs((prev) => prev.filter((l) => l.id !== id));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-5">

        {/* Back */}
        <Link
          href="/vocational-technical-student-route"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Experience Log
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1 max-w-2xl">
            Upload certifications and training from your high-school placements for your chosen pathway.
            Logged experience strengthens your apprenticeship record and improves your career matches.
          </p>
        </div>

        {/* Pathway + Province context */}
        <div className={`${card} p-4 sm:p-5`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelBase}>Your chosen pathway</label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400 pointer-events-none" />
                <select
                  value={pathwayId}
                  onChange={(e) => setPathwayId(e.target.value)}
                  className={`${inputBase} pl-9 appearance-none cursor-pointer font-semibold`}
                >
                  {PATHWAYS.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.code})</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className={labelBase}>Province / Territory</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400 pointer-events-none" />
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className={`${inputBase} pl-9 appearance-none cursor-pointer font-semibold`}
                >
                  {PROVINCES.map((p) => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 mt-3 rounded-xl bg-blue-50/70 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-2.5">
            <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-600 dark:text-slate-300 leading-snug">
              In <span className="font-semibold">{provinceInfo.name}</span>, the {pathway.title} pathway is overseen by{' '}
              <span className="font-semibold">{provinceInfo.body}</span>. {reqs.note}
            </p>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4 sm:gap-6 items-start">
          {/* Left column */}
          <div className="min-w-0 space-y-4 sm:space-y-5">

            {/* Required certifications */}
            <div className={`${card} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Recommended Certifications & Training
                </h2>
              </div>
              <p className="text-[12px] text-gray-500 dark:text-slate-400 mb-3">
                Typical requirements for {pathway.title} students in {provinceInfo.name}.
              </p>
              <div className="space-y-2.5">
                {reqs.certs.map((c) => {
                  const have = logs.some((l) =>
                    l.title.toLowerCase().includes(c.name.toLowerCase().split(' ')[0]) ||
                    c.name.toLowerCase().includes(l.title.toLowerCase().split(' ')[0]),
                  );
                  return (
                    <div key={c.name} className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-white/8 p-3">
                      <span className={`w-7 h-7 rounded-lg grid place-items-center shrink-0 ${
                        have
                          ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-100 dark:bg-white/8 text-slate-400 dark:text-slate-500'
                      }`}>
                        {have ? <CheckCircle2 className="w-4 h-4" /> : <Award className="w-4 h-4" />}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200">{c.name}</p>
                          {c.hours && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400">
                              {c.hours}
                            </span>
                          )}
                          {have && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                              Uploaded
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5 leading-snug">{c.detail}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Upload form */}
            <div className={`${card} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <Plus className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Add an Experience Entry</h2>
              </div>

              {submitted && (
                <div className="flex items-center gap-2 mb-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 px-3 py-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <p className="text-[12px] font-medium text-emerald-700 dark:text-emerald-300">
                    Experience submitted — it&apos;s now pending counsellor verification.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className={labelBase}>Title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Working at Heights Certificate"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Experience type</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={`${inputBase} appearance-none cursor-pointer`}>
                      {EXPERIENCE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelBase}>Organization / Provider</label>
                    <input
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Humber College"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Date completed</label>
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputBase} />
                  </div>
                  <div>
                    <label className={labelBase}>Hours logged</label>
                    <input
                      type="number" min={0} value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      placeholder="e.g. 40"
                      className={inputBase}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={labelBase}>Description <span className="font-normal text-gray-400 dark:text-slate-500">(optional)</span></label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="What did you learn or do during this experience?"
                      className={`${inputBase} resize-none`}
                    />
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className={labelBase}>Upload certificate / proof</label>
                  {!file ? (
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-7 cursor-pointer transition-colors ${
                        dragging
                          ? 'border-blue-400 bg-blue-50/60 dark:bg-blue-500/10'
                          : 'border-gray-200 dark:border-white/12 hover:border-blue-300 dark:hover:border-blue-500/30'
                      }`}
                    >
                      <span className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center">
                        <Upload className="w-5 h-5" />
                      </span>
                      <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-200 mt-1">
                        Drag &amp; drop or <span className="text-blue-600 dark:text-blue-400">browse</span>
                      </p>
                      <p className="text-[11px] text-gray-400 dark:text-slate-500">PDF, JPG or PNG · up to 10 MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 dark:border-white/10 p-3">
                      <span className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-200 truncate">{file.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500">{(file.size / 1024).toFixed(0)} KB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => pickFile(null)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-[13px] font-semibold rounded-xl px-4 py-2.5 border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={!formValid || submitting}
                    className={`inline-flex items-center justify-center gap-1.5 text-[13px] font-semibold rounded-xl px-4 py-2.5 transition-colors ${
                      formValid && !submitting
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {submitting ? 'Uploading…' : 'Submit Experience'}
                  </button>
                </div>
              </form>
            </div>

            {/* Submitted logs */}
            <div className={`${card} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Your Experience Log</h2>
                <span className="text-[12px] text-gray-400 dark:text-slate-500">{logs.length} entries</span>
              </div>

              {logs.length > 0 ? (
                <div className="space-y-2.5">
                  {logs.map((l) => {
                    const prov = PROVINCES.find((p) => p.code === l.province);
                    return (
                      <div key={l.id} className="flex items-start gap-3 rounded-xl border border-gray-100 dark:border-white/8 p-3 hover:border-blue-200 dark:hover:border-blue-500/30 transition-colors">
                        <span className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{l.title}</p>
                            <StatusBadge status={l.status} />
                          </div>
                          <p className="text-[12px] text-gray-500 dark:text-slate-400 mt-0.5">{l.type}</p>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-gray-500 dark:text-slate-400">
                            <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{l.organization}</span>
                            <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{prov?.name ?? l.province}</span>
                            <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" />{l.date}</span>
                            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{l.hours} hrs</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLog(l.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
                          aria-label="Remove entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No entries yet</p>
                  <p className="text-[12px] text-gray-400 dark:text-slate-500 mt-1">Add your first certification or placement above.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Progress */}
            <div className={`${card} p-4 sm:p-5`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">Your Progress</h3>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] font-medium text-slate-600 dark:text-slate-300">Logged hours</span>
                <span className="text-[12px] font-bold text-blue-600 dark:text-blue-400">{totalHours} / {HOURS_GOAL} hrs</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100 dark:bg-white/8 overflow-hidden">
                <div className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all" style={{ width: `${hoursPct}%` }} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: 'Entries', value: logs.length },
                  { label: 'Verified', value: verifiedCount },
                  { label: 'Hours', value: totalHours },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl bg-slate-50 dark:bg-white/5 px-2 py-2.5 text-center">
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-none">{s.value}</p>
                    <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accepted documents */}
            <div className={`${card} p-4 sm:p-5`}>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">What You Can Upload</h3>
              <ul className="space-y-2.5">
                {[
                  'Industry certification cards (WHMIS, First Aid, etc.)',
                  'Signed co-op or apprenticeship hour logs',
                  'Training completion certificates',
                  'Reference or supervisor letters',
                ].map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-[12px] text-gray-600 dark:text-slate-300 leading-snug">{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tip */}
            <div className="rounded-2xl border border-amber-200 dark:border-amber-500/25 bg-amber-50/70 dark:bg-amber-500/10 p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">Tip</h3>
              </div>
              <p className="text-[12px] text-amber-800/80 dark:text-amber-200/80 leading-snug">
                Upload certificates as soon as you earn them. Verified experience boosts your match score and
                gives your counsellor what they need to support your apprenticeship registration.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: LogStatus }) {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
        <CheckCircle2 className="w-3 h-3" /> Verified
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
      <Clock className="w-3 h-3" /> Pending
    </span>
  );
}
