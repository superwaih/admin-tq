'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ChevronLeft, Upload, FileText, Video, Link2, BookOpen,
  X, CheckCircle2, AlertCircle, Plus,
  ChevronDown, Users, Lock, Globe, Eye, Tag, Info,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ResourceType = 'document' | 'video' | 'link' | 'guide';
type Visibility   = 'all' | 'specific' | 'private';

interface UploadedFile {
  id: string; name: string; size: string; type: string; done: boolean; error: boolean;
}

// ── Data ─────────────────────────────────────────────────────────────────────

const RESOURCE_TYPES: {
  id: ResourceType; label: string; desc: string;
  icon: React.ElementType; color: string; bg: string;
}[] = [
  { id:'document', label:'Document / PDF', desc:'PDF, Word, spreadsheets',          icon:FileText, color:'text-blue-600 dark:text-blue-400',    bg:'bg-blue-50 dark:bg-blue-500/15'    },
  { id:'video',    label:'Video',          desc:'Upload MP4 or paste YouTube URL',   icon:Video,    color:'text-violet-600 dark:text-violet-400',bg:'bg-violet-50 dark:bg-violet-500/15'},
  { id:'link',     label:'External Link',  desc:'Website, article or tool',          icon:Link2,    color:'text-emerald-600 dark:text-emerald-400',bg:'bg-emerald-50 dark:bg-emerald-500/15'},
  { id:'guide',    label:'Study Guide',    desc:'Structured guide or worksheet',     icon:BookOpen, color:'text-amber-600 dark:text-amber-400',  bg:'bg-amber-50 dark:bg-amber-500/15'  },
];

const CATEGORIES = [
  'Admissions','Test Preparation','Essays','Scholarships','Interview Prep',
  'Financial Aid','University Research','Application Strategy','Other',
];
const AUDIENCES = [
  'All Students','Medicine Applicants','Engineering Applicants','Law Applicants',
  'Business Applicants','Computer Science Applicants','First-Year Students','International Students',
];
const TAGS_LIST = [
  'CASPer','MMI','OMSAS','GPA','Reference Letters','Personal Statement',
  'ABS','Extracurriculars','Ontario','British Columbia','Scholarships',
];

const RECENT_FILES = [
  { name: 'OMSAS_Guide_2025.pdf',    size: '2.4 MB', date: 'May 22, 2026', ext: 'PDF', color: 'bg-red-500'     },
  { name: 'MMI_Practice_Sheet.docx', size: '840 KB', date: 'May 20, 2026', ext: 'DOC', color: 'bg-blue-500'    },
  { name: 'College_List.xlsx',       size: '120 KB', date: 'May 18, 2026', ext: 'XLS', color: 'bg-emerald-500' },
  { name: 'Interview_Prep.pdf',      size: '1.1 MB', date: 'May 15, 2026', ext: 'PDF', color: 'bg-red-500'     },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function ExtBadge({ type }: { type: string }) {
  const cls = type === 'PDF'  ? 'bg-red-50 dark:bg-red-500/15 text-red-500'
            : type === 'DOC' || type === 'DOCX'  ? 'bg-blue-50 dark:bg-blue-500/15 text-blue-500'
            : type === 'XLS' || type === 'XLSX'  ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-500'
            : type === 'MP4' || type === 'MOV'   ? 'bg-violet-50 dark:bg-violet-500/15 text-violet-500'
            : type === 'PPT' || type === 'PPTX'  ? 'bg-orange-50 dark:bg-orange-500/15 text-orange-500'
            : 'bg-slate-100 dark:bg-white/8 text-slate-400';
  return (
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[8px] font-bold shrink-0 ${cls}`}>{type}</div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function UploadResourcesPage() {
  const [resourceType, setResourceType] = useState<ResourceType>('document');
  const [title, setTitle]               = useState('');
  const [description, setDescription]   = useState('');
  const [category, setCategory]         = useState('');
  const [audience, setAudience]         = useState('All Students');
  const [visibility, setVisibility]     = useState<Visibility>('all');
  const [externalUrl, setExternalUrl]   = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [files, setFiles]               = useState<UploadedFile[]>([]);
  const [dragging, setDragging]         = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const toggleTag   = (t: string) =>
    setSelectedTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  const removeFile  = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const addFiles = (newFiles: File[]) => {
    const mapped: UploadedFile[] = newFiles.map((f, i) => ({
      id:   `${Date.now()}-${i}`,
      name: f.name,
      size: f.size > 1_000_000 ? `${(f.size / 1_000_000).toFixed(1)} MB` : `${Math.round(f.size / 1000)} KB`,
      type: f.name.split('.').pop()?.toUpperCase() || 'FILE',
      done: true, error: false,
    }));
    setFiles(prev => [...prev, ...mapped]);
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())  e.title    = 'Title is required.';
    if (!category)      e.category = 'Please select a category.';
    if (resourceType === 'link' && !externalUrl.trim()) e.url = 'Please enter a URL.';
    if (resourceType !== 'link' && files.length === 0 && !externalUrl.trim())
      e.files = 'Please upload at least one file.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) setSubmitted(true); };

  /* ── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117] flex items-center justify-center p-6">
        <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/15 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resource Published!</h2>
          <p className="text-sm text-slate-400 dark:text-[#8e92ad] mb-6">
            <span className="font-semibold text-slate-700 dark:text-slate-200">{title || 'Your resource'}</span> has been added and is now visible to{' '}
            {visibility === 'private' ? 'you only' : visibility === 'specific' ? audience : 'all students'}.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => { setSubmitted(false); setTitle(''); setDescription(''); setCategory(''); setFiles([]); setSelectedTags([]); setExternalUrl(''); }}
              className="px-5 py-2.5 bg-slate-100 dark:bg-white/8 hover:bg-slate-200 dark:hover:bg-white/12 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 transition-all">
              Add Another
            </button>
            <Link href="/counselor/resources"
              className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold transition-all">
              Back to Resources
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1100px] mx-auto space-y-5">

        {/* ── Header ───────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <Link href="/counselor/resources"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-[#8e92ad] hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors mb-1">
              <ChevronLeft size={15} /> Back to Resources
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Add New Resource</h1>
            <p className="text-sm text-slate-400 dark:text-[#8e92ad] mt-0.5">
              Upload a file, paste a link, or create a study guide to share with your students.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
              <Upload size={14} /> Publish Resource
            </button>
          </div>
        </div>

        {/* ── 2-col layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT — main form ─────────────────────── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Step 1: Resource type */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">1</div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Resource Type</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {RESOURCE_TYPES.map(t => (
                  <button key={t.id} onClick={() => setResourceType(t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center ${
                      resourceType === t.id
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                        : 'border-gray-100 dark:border-white/6 hover:border-cyan-200 dark:hover:border-cyan-500/30'
                    }`}>
                    <div className={`w-9 h-9 rounded-xl ${t.bg} flex items-center justify-center`}>
                      <t.icon size={17} className={t.color} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white leading-tight">{t.label}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad] mt-0.5 leading-tight hidden sm:block">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">2</div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Resource Details</h2>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input value={title} onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. OMSAS Application Guide 2025–26"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.title ? 'border-red-400' : 'border-gray-200 dark:border-white/10'}`}
                />
                {errors.title && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.title}</p>}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                  Description <span className="text-[10px] font-normal text-slate-400 dark:text-[#8e92ad]">Optional</span>
                </label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
                  placeholder="Briefly describe what this resource covers and who it's for…"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all resize-none"
                />
              </div>

              {/* Category + Audience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select value={category} onChange={e => setCategory(e.target.value)}
                      className={`w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.category ? 'border-red-400' : 'border-gray-200 dark:border-white/10'}`}>
                      <option value="">Select a category…</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  </div>
                  {errors.category && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.category}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Target Audience</label>
                  <div className="relative">
                    <select value={audience} onChange={e => setAudience(e.target.value)}
                      className="w-full appearance-none px-3.5 py-2.5 pr-9 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all">
                      {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
                  </div>
                </div>
              </div>

              {/* External URL */}
              {(resourceType === 'link' || resourceType === 'video') && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                    {resourceType === 'video' ? 'Video URL (YouTube / Vimeo)' : 'External URL'}
                    {resourceType === 'link' && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  <input value={externalUrl} onChange={e => setExternalUrl(e.target.value)}
                    placeholder={resourceType === 'video' ? 'https://youtube.com/watch?v=…' : 'https://example.com/resource'}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5 placeholder:text-slate-300 dark:placeholder:text-[#5a5f78] focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${errors.url ? 'border-red-400' : 'border-gray-200 dark:border-white/10'}`}
                  />
                  {errors.url && <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.url}</p>}
                </div>
              )}
            </div>

            {/* Step 3: Upload (not for pure link type) */}
            {resourceType !== 'link' && (
              <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">3</div>
                  <h2 className="text-sm font-bold text-slate-800 dark:text-white">Upload Files</h2>
                  <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">
                    {resourceType === 'video' ? 'MP4, MOV up to 500 MB' : 'PDF, DOCX, XLSX, PPTX up to 50 MB'}
                  </span>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input')?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                    dragging ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                    : errors.files ? 'border-red-300 hover:border-red-400'
                    : 'border-gray-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-500/40 hover:bg-slate-50 dark:hover:bg-white/3'
                  }`}>
                  <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center mb-3">
                    <Upload size={22} className="text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Drop files here or <span className="text-cyan-600 dark:text-cyan-400">browse</span>
                  </p>
                  <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-1">Drag and drop multiple files at once</p>
                  <input id="file-input" type="file" multiple className="hidden"
                    onChange={e => { if (e.target.files) addFiles(Array.from(e.target.files)); }} />
                </div>
                {errors.files && (
                  <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                    <AlertCircle size={10}/>{errors.files}
                  </p>
                )}

                {/* Uploaded file list */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map(f => (
                      <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/3 border border-gray-100 dark:border-white/5">
                        <ExtBadge type={f.type} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{f.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{f.size}</span>
                            <span className="text-[9px] font-semibold text-emerald-500 flex items-center gap-0.5">
                              <CheckCircle2 size={9}/> Ready
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeFile(f.id)}
                          className="w-6 h-6 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/15 flex items-center justify-center text-slate-300 hover:text-red-500 transition-all">
                          <X size={13}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Tags */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  {resourceType === 'link' ? '3' : '4'}
                </div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Tags</h2>
                <span className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Help students find this resource via search</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TAGS_LIST.map(t => (
                  <button key={t} onClick={() => toggleTag(t)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
                      selectedTags.includes(t)
                        ? 'bg-cyan-600 text-white border-cyan-600'
                        : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-white/10 hover:border-cyan-300'
                    }`}>
                    <Tag size={9}/> {t}
                  </button>
                ))}
              </div>
              {selectedTags.length > 0 && (
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] mt-2">
                  {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''} selected: {selectedTags.join(', ')}
                </p>
              )}
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────── */}
          <div className="space-y-5">

            {/* Visibility */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Visibility</h3>
              <div className="space-y-2">
                {([
                  { id:'all',      icon:Globe, label:'All Students',    desc:'Visible to your entire cohort'  },
                  { id:'specific', icon:Users, label:'Specific Group',  desc:'Choose a target audience above' },
                  { id:'private',  icon:Lock,  label:'Private (Draft)', desc:'Only visible to you'            },
                ] as const).map(v => (
                  <button key={v.id} onClick={() => setVisibility(v.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left ${
                      visibility === v.id
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                        : 'border-gray-100 dark:border-white/6 hover:border-cyan-200 dark:hover:border-cyan-500/30'
                    }`}>
                    <v.icon size={14} className={`mt-0.5 ${visibility === v.id ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`}/>
                    <div>
                      <p className={`text-xs font-semibold ${visibility === v.id ? 'text-cyan-700 dark:text-cyan-300' : 'text-slate-700 dark:text-slate-200'}`}>{v.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] leading-relaxed">{v.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live preview card */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Eye size={13} className="text-slate-400"/> Preview
              </h3>
              <div className="rounded-xl border border-gray-100 dark:border-white/8 p-4 space-y-2">
                <div className="flex items-center gap-2">
                  {(() => {
                    const t = RESOURCE_TYPES.find(rt => rt.id === resourceType)!;
                    return (
                      <div className={`w-7 h-7 rounded-lg ${t.bg} flex items-center justify-center shrink-0`}>
                        <t.icon size={13} className={t.color}/>
                      </div>
                    );
                  })()}
                  <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{title || 'Resource title…'}</p>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] line-clamp-2 leading-relaxed">
                  {description || 'Your description will appear here.'}
                </p>
                {category && (
                  <span className="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-400">
                    {category}
                  </span>
                )}
                {selectedTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {selectedTags.slice(0, 4).map(t => (
                      <span key={t} className="text-[8px] px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-400">{t}</span>
                    ))}
                    {selectedTags.length > 4 && <span className="text-[8px] text-slate-400">+{selectedTags.length - 4}</span>}
                  </div>
                )}
                <div className="flex items-center gap-1.5 pt-1">
                  {visibility === 'all'      && <Globe size={9} className="text-emerald-500"/>}
                  {visibility === 'specific' && <Users size={9} className="text-blue-500"/>}
                  {visibility === 'private'  && <Lock  size={9} className="text-amber-500"/>}
                  <span className="text-[9px] text-slate-400 dark:text-[#8e92ad]">
                    {visibility === 'all' ? 'All students' : visibility === 'specific' ? audience : 'Private draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Upload tips */}
            <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Info size={13} className="text-blue-500"/>
                <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300">Tips</h3>
              </div>
              <ul className="space-y-2">
                {[
                  'Use clear, descriptive titles so students can find resources quickly.',
                  'Add relevant tags (e.g. "CASPer", "OMSAS") to improve searchability.',
                  'Use "Specific Group" visibility for targeted, programme-specific support.',
                  'PDFs are preferred over Word docs for consistent formatting on all devices.',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[8px] font-bold text-blue-600 dark:text-blue-400">{i + 1}</span>
                    </div>
                    <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed">{tip}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent uploads */}
            <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Recent Uploads</h3>
                <Link href="/counselor/resources" className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 transition-colors">View All</Link>
              </div>
              <div className="space-y-3">
                {RECENT_FILES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${f.color} flex items-center justify-center text-white text-[8px] font-bold shrink-0`}>{f.ext}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{f.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#8e92ad]">{f.size} · {f.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2.5">
              <button onClick={handleSubmit}
                className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all">
                <Upload size={14}/> Publish Resource
              </button>
              <button className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-[#161a27] border border-gray-200 dark:border-white/8 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-white/5 transition-all">
                Save as Draft
              </button>
              <Link href="/counselor/resources"
                className="w-full flex items-center justify-center gap-2 py-2.5 text-slate-400 hover:text-red-500 rounded-xl text-sm font-medium transition-all">
                Cancel
              </Link>
            </div>

          </div>
        </div>

        {/* ── Footer ──────────────────────────────────── */}
        <div className="bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-100 dark:border-cyan-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"/>
          <p className="text-xs text-cyan-700 dark:text-cyan-300">
            Resources are published instantly and visible to students on their dashboard.
          </p>
        </div>

      </div>
    </div>
  );
}
