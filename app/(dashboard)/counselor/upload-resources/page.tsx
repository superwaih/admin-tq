'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Upload, X, FileText, CheckCircle,
  ChevronDown, Users, User,
} from 'lucide-react';

const RESOURCE_TYPES = [
  'Essay Guide',
  'Interview Prep',
  'Application Checklist',
  'MMI Practice Material',
  'Scholarship Info',
  'Program Overview',
  'Study Resource',
  'Other',
];

const RECENT_FILES = [
  { name: 'Essay_Draft_v2.pdf',      size: '1.2 MB', date: 'May 28, 2025', ext: 'PDF', color: 'bg-red-500' },
  { name: 'Personal_Statement.docx', size: '856 KB',  date: 'May 20, 2025', ext: 'DOC', color: 'bg-blue-500' },
  { name: 'College_List.xlsx',       size: '120 KB',  date: 'May 18, 2025', ext: 'XLS', color: 'bg-emerald-500' },
  { name: 'Personal_Statement.docx', size: '856 KB',  date: 'May 20, 2025', ext: 'DOC', color: 'bg-blue-500' },
  { name: 'Essay_Draft_v2.pdf',      size: '1.2 MB',  date: 'May 28, 2025', ext: 'PDF', color: 'bg-red-500' },
  { name: 'Personal_Statement.docx', size: '856 KB',  date: 'May 20, 2025', ext: 'DOC', color: 'bg-blue-500' },
  { name: 'College_List.xlsx',       size: '120 KB',  date: 'May 18, 2025', ext: 'XLS', color: 'bg-emerald-500' },
];

export default function UploadResourcesPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [resourceType, setResourceType] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'all' | 'specific'>('all');
  const [submitted, setSubmitted] = useState(false);

  function addFiles(incoming: File[]) {
    setFiles(prev => [...prev, ...incoming]);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) addFiles(Array.from(e.target.files));
  }

  function handleSubmit() {
    if (!files.length || !resourceType || !title) return;
    setSubmitted(true);
    setTimeout(() => router.push('/counselor/resources'), 1800);
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center">
          <CheckCircle size={32} className="text-cyan-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Successful!</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
          <strong>{files.length} file{files.length > 1 ? 's' : ''}</strong> uploaded successfully and shared with your students.
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">Redirecting to Resources…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">

        {/* Header */}
        <div>
          <Link
            href="/counselor"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-2"
          >
            <ChevronLeft size={15} /> Back to Dashboard
          </Link>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Upload Resources</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-0.5">Share helpful resources with your students.</p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5 items-start">

          {/* Left: form */}
          <div className="space-y-5">

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all flex flex-col items-center justify-center gap-4 px-6 py-14 ${
                dragOver
                  ? 'border-cyan-400 bg-cyan-50 dark:bg-cyan-500/10'
                  : 'border-cyan-300 dark:border-cyan-500/40 bg-white dark:bg-[#161a27] hover:border-cyan-400 hover:bg-cyan-50/40 dark:hover:bg-cyan-500/5'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-200 dark:shadow-cyan-900/30">
                <Upload size={28} className="text-white" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 cursor-pointer">Click to upload</span>
                  {' '}or drag and drop
                </p>
                <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">or</p>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  className="mt-2 px-8 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm shadow-cyan-200 dark:shadow-cyan-900/20 transition-all"
                >
                  Browse File
                </button>
              </div>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileChange} />
            </div>

            {/* Attached files list */}
            {files.length > 0 && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm divide-y divide-gray-50 dark:divide-white/[0.04]">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center shrink-0">
                      <FileText size={14} className="text-cyan-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{f.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{(f.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button
                      onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))}
                      className="p-1 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Resource Type */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 md:p-6 space-y-5">
              <div>
                <label className="block text-base font-bold text-slate-800 dark:text-white mb-2">Resource Type</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowTypeDropdown(s => !s)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/5 text-sm text-slate-700 dark:text-slate-300 hover:border-gray-300 dark:hover:border-white/15 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all"
                  >
                    <span className={resourceType ? 'text-slate-800 dark:text-white' : 'text-slate-400 dark:text-[#8e92ad]'}>
                      {resourceType || 'Select Resource Type'}
                    </span>
                    <ChevronDown size={15} className={`text-slate-400 transition-transform ${showTypeDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showTypeDropdown && (
                    <div className="absolute z-20 top-full left-0 right-0 mt-1.5 bg-white dark:bg-[#1d2133] rounded-xl border border-gray-100 dark:border-white/8 shadow-xl overflow-hidden">
                      {RESOURCE_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => { setResourceType(t); setShowTypeDropdown(false); }}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            resourceType === t
                              ? 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-base font-bold text-slate-800 dark:text-white mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter resource title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 transition-all"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-base font-bold text-slate-800 dark:text-white mb-2">
                  Description <span className="text-xs font-normal text-slate-400 dark:text-[#8e92ad] ml-1">Optional</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Add a short description for your student"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/8 bg-white dark:bg-white/5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#8e92ad] focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500/50 resize-none transition-all"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pb-4">
              <Link
                href="/counselor"
                className="w-full sm:w-auto flex items-center justify-center px-6 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#161a27] text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </Link>
              <button
                onClick={handleSubmit}
                disabled={!files.length || !resourceType || !title}
                className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${
                  files.length && resourceType && title
                    ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200 dark:shadow-cyan-900/20 cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Upload size={15} /> Upload Resources
              </button>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-4">

            {/* Visibility */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Visibility</h3>
              <div className="space-y-3">
                {/* All Students */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5">
                    <div
                      onClick={() => setVisibility('all')}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        visibility === 'all'
                          ? 'border-cyan-600 bg-cyan-600'
                          : 'border-gray-300 dark:border-white/20 group-hover:border-cyan-400'
                      }`}
                    >
                      {visibility === 'all' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div onClick={() => setVisibility('all')}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Users size={13} className="text-slate-400" /> All Students
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Make this resource available to all students</p>
                  </div>
                </label>

                {/* Specific Students */}
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="mt-0.5">
                    <div
                      onClick={() => setVisibility('specific')}
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                        visibility === 'specific'
                          ? 'border-cyan-600 bg-cyan-600'
                          : 'border-gray-300 dark:border-white/20 group-hover:border-cyan-400'
                      }`}
                    >
                      {visibility === 'specific' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </div>
                  <div onClick={() => setVisibility('specific')}>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <User size={13} className="text-slate-400" /> Specific Students
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-[#8e92ad] mt-0.5">Select students who can access this resource</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Update</h3>
                <button className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {RECENT_FILES.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>
                      {f.ext}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{f.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{f.size} · {f.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile upload button */}
            <div className="xl:hidden">
              <button
                onClick={handleSubmit}
                disabled={!files.length || !resourceType || !title}
                className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-sm transition-all ${
                  files.length && resourceType && title
                    ? 'bg-cyan-600 hover:bg-cyan-700 shadow-cyan-200 dark:shadow-cyan-900/20 cursor-pointer'
                    : 'bg-slate-300 dark:bg-slate-700 cursor-not-allowed opacity-60'
                }`}
              >
                <Upload size={15} /> Upload Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
