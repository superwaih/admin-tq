'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft, Plus, ListFilter, ArrowDownUp, FileText, TrendingUp,
  Clock, CalendarClock, Building2, MoreVertical, Bot, ChevronLeft,
  ChevronRight, MessageSquareText, Award, ThumbsUp, AlertTriangle,
  Eye, Download, Trash2, SquarePen, Send,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ESSAYS, type Essay, type Review, type Rating } from '../essays-data';

const card = 'bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm';

const STATS = [
  { icon: FileText, label: 'Total Essays', value: '12', sub: 'Drafts', tint: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15' },
  { icon: TrendingUp, label: 'Average AI Score', value: '84/100', sub: '↑ 8 pts from last month', subClass: 'text-emerald-600 dark:text-emerald-400', tint: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15' },
  { icon: Clock, label: 'Pending Reviews', value: '3', sub: 'This month', tint: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15' },
  { icon: CalendarClock, label: 'Upcoming Deadline', value: '5', sub: 'This month', tint: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/15' },
];

const DEADLINES = [
  { label: 'UofT Engineering AIF', date: 'Jan 15, 2026', daysLeft: 81 },
  { label: 'Waterloo AIF', date: 'Jan 15, 2026', daysLeft: 81 },
  { label: 'McMaster Supplementary', date: 'Jan 15, 2026', daysLeft: 81 },
  { label: 'Western AIF', date: 'Jan 15, 2026', daysLeft: 81 },
  { label: "Queen's Supplementary", date: 'Jan 15, 2026', daysLeft: 81 },
];

function ratingStyle(r: Rating) {
  switch (r) {
    case 'Excellent': return { cls: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15', Icon: Award };
    case 'Good': return { cls: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15', Icon: ThumbsUp };
    case 'Needs Work': return { cls: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/15', Icon: AlertTriangle };
  }
}

function reviewStyle(r: Review): string {
  switch (r) {
    case 'Complete': return 'text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/20';
    case 'Reviewing': return 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-500/20';
    case 'Pending': return 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20';
    case 'Not Started': return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/10';
  }
}

function barColor(pct: number): string {
  if (pct >= 90) return 'bg-emerald-500';
  if (pct >= 75) return 'bg-amber-500';
  return 'bg-red-500';
}

function downloadEssay(essay: Essay) {
  const content = [
    essay.title,
    '='.repeat(essay.title.length),
    '',
    `Application: ${essay.subtitle}`,
    `University:  ${essay.university}`,
    `Program:    ${essay.program}`,
    `AI Score:   ${essay.rating} (${essay.score}/500)`,
    `Word Count: ${essay.words}/${essay.wordLimit}`,
    `Tutor Review: ${essay.review}`,
    `Deadline:   ${essay.deadline} (${essay.daysLeft} days left)`,
    '',
    '---',
    'Exported from AdmitIQ Essay Coach.',
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${essay.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function EssayActions({
  essay,
  onDelete,
  onResubmit,
}: {
  essay: Essay;
  onDelete: (id: number) => void;
  onResubmit: (id: number) => void;
}) {
  const reviewing = essay.review === 'Reviewing';
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label={`Actions for ${essay.title}`}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/8 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuItem asChild>
          <Link href={`/university-college-student-route/essay?essay=${essay.id}`} className="cursor-pointer">
            <Eye className="w-4 h-4 mr-2" /> View Essay
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/university-college-student-route/essay?essay=${essay.id}&edit=1`} className="cursor-pointer">
            <SquarePen className="w-4 h-4 mr-2" /> Edit Essay
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onResubmit(essay.id)}
          disabled={reviewing}
          className="cursor-pointer text-blue-600 dark:text-blue-400 focus:text-blue-600 dark:focus:text-blue-400 focus:bg-blue-50 dark:focus:bg-blue-500/10"
        >
          <Send className="w-4 h-4 mr-2" />
          {reviewing ? 'Review Requested' : 'Re-submit for Review'}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => downloadEssay(essay)} className="cursor-pointer">
          <Download className="w-4 h-4 mr-2" /> Download Essay
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(essay.id)}
          className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4 mr-2" /> Delete Essay
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ScoreBar({ words, limit }: { words: number; limit: number }) {
  const pct = Math.min(100, Math.round((words / limit) * 100));
  return (
    <div className="w-full max-w-[120px]">
      <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">{words}/{limit}</p>
      <div className="h-1.5 mt-1 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden">
        <div className={`h-full rounded-full ${barColor(pct)}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function MyEssaysPage() {
  const [page, setPage] = useState(1);
  const [essays, setEssays] = useState<Essay[]>(ESSAYS);
  const totalPages = 15;

  const handleDelete = (id: number) => setEssays((prev) => prev.filter((e) => e.id !== id));
  const handleResubmit = (id: number) =>
    setEssays((prev) => prev.map((e) => (e.id === id ? { ...e, review: 'Reviewing' } : e)));

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 space-y-4 sm:space-y-5">

        {/* Back */}
        <Link
          href="/university-college-student-route/essay"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Essay Coach
        </Link>

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Essays</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage, track, and improve your supplemental essays.</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/university-college-student-route/essay/new"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-9 px-4 text-[13px] font-semibold shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" /> New Essay
            </Link>
            <button className="inline-flex items-center gap-1.5 rounded-xl h-9 px-3.5 text-[13px] font-semibold border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 bg-white dark:bg-[#161a27] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <ListFilter className="w-4 h-4" /> Filter
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-xl h-9 px-3.5 text-[13px] font-semibold border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 bg-white dark:bg-[#161a27] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <ArrowDownUp className="w-4 h-4" /> Sort
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {STATS.map((s) => (
            <div key={s.label} className={`${card} p-4 flex items-center gap-3`}>
              <span className={`w-10 h-10 rounded-xl grid place-items-center shrink-0 ${s.tint}`}>
                <s.icon className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-gray-500 dark:text-slate-400 truncate">{s.label}</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{s.value}</p>
                <p className={`text-[10px] leading-tight truncate ${s.subClass || 'text-gray-400 dark:text-slate-500'}`}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 sm:gap-5 items-start">

          {/* Essay list */}
          <div className={`${card} overflow-hidden`}>
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 dark:border-white/6">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">My Essays</h2>
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-wide text-gray-400 dark:text-slate-500 border-b border-gray-100 dark:border-white/6">
                    <th className="px-5 py-3 font-bold">Essay</th>
                    <th className="px-3 py-3 font-bold">University</th>
                    <th className="px-3 py-3 font-bold">Program</th>
                    <th className="px-3 py-3 font-bold">AI Score</th>
                    <th className="px-3 py-3 font-bold">Word Count</th>
                    <th className="px-3 py-3 font-bold">Tutor Review</th>
                    <th className="px-3 py-3 font-bold">Deadline</th>
                    <th className="px-3 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {essays.map((e) => {
                    const { cls, Icon } = ratingStyle(e.rating);
                    return (
                      <tr key={e.id} className="border-b border-gray-50 dark:border-white/4 hover:bg-slate-50/60 dark:hover:bg-white/4 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="text-[13px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{e.title}</p>
                          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{e.subtitle}</p>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-300 grid place-items-center shrink-0">
                              <Building2 className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[12px] text-slate-600 dark:text-slate-300">{e.university}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3.5 text-[12px] text-slate-600 dark:text-slate-300">{e.program}</td>
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${cls}`}>
                            <Icon className="w-3.5 h-3.5" /> {e.rating}
                          </span>
                        </td>
                        <td className="px-3 py-3.5"><ScoreBar words={e.words} limit={e.wordLimit} /></td>
                        <td className="px-3 py-3.5">
                          <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${reviewStyle(e.review)}`}>{e.review}</span>
                        </td>
                        <td className="px-3 py-3.5">
                          <p className="text-[12px] font-semibold text-slate-700 dark:text-slate-200">{e.deadline}</p>
                          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5">{e.daysLeft} days left</p>
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex justify-end">
                            <EssayActions essay={e} onDelete={handleDelete} onResubmit={handleResubmit} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden divide-y divide-gray-100 dark:divide-white/6">
              {essays.map((e) => {
                const { cls, Icon } = ratingStyle(e.rating);
                return (
                  <div key={e.id} className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-slate-900 dark:text-slate-100 leading-tight">{e.title}</p>
                        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-0.5">{e.subtitle}</p>
                      </div>
                      <div className="shrink-0">
                        <EssayActions essay={e} onDelete={handleDelete} onResubmit={handleResubmit} />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2.5 text-[12px] text-slate-600 dark:text-slate-300">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/8 text-slate-500 dark:text-slate-300 grid place-items-center shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </span>
                      <span className="font-medium">{e.university}</span>
                      <span className="text-gray-300 dark:text-slate-600">·</span>
                      <span>{e.program}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-3">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-full ${cls}`}>
                        <Icon className="w-3.5 h-3.5" /> {e.rating}
                      </span>
                      <span className={`inline-flex text-[11px] font-bold px-2.5 py-1 rounded-full ${reviewStyle(e.review)}`}>{e.review}</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 dark:text-slate-400">
                        <CalendarClock className="w-3.5 h-3.5" /> {e.deadline}
                        <span className="text-amber-600 dark:text-amber-400">· {e.daysLeft}d left</span>
                      </span>
                    </div>
                    <div className="mt-3"><ScoreBar words={e.words} limit={e.wordLimit} /></div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="px-4 sm:px-5 py-3.5 border-t border-gray-100 dark:border-white/6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[12px] text-gray-500 dark:text-slate-400">Showing 1 to 6 of 12 essays</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-8 h-8 rounded-lg grid place-items-center border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {[1, 2, 3].map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-8 h-8 rounded-lg grid place-items-center text-[12px] font-semibold transition-colors ${
                      page === n
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                    }`}
                  >
                    {n}
                  </button>
                ))}
                <span className="px-1 text-[12px] text-gray-400 dark:text-slate-500">…</span>
                <button
                  onClick={() => setPage(totalPages)}
                  className={`w-8 h-8 rounded-lg grid place-items-center text-[12px] font-semibold transition-colors ${
                    page === totalPages
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                  }`}
                >
                  {totalPages}
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-8 h-8 rounded-lg grid place-items-center border border-gray-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4 sm:gap-5">
            {/* Upcoming deadlines */}
            <div className={`${card} p-4 sm:p-5`}>
              <div className="flex items-center justify-between gap-2 mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Upcoming Deadlines</h3>
                <button className="text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline">View All</button>
              </div>
              <div className="space-y-3">
                {DEADLINES.map((d) => (
                  <div key={d.label} className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-slate-700 dark:text-slate-200 truncate">{d.label}</span>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">{d.date}</p>
                      <p className="text-[10px] text-amber-600 dark:text-amber-400">{d.daysLeft} days left</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-3 w-full text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline text-center">View All Deadlines</button>
            </div>

            {/* AI writing suggestion */}
            <div className={`${card} p-4 sm:p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 grid place-items-center shrink-0">
                  <Bot className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">AI Writing Suggestion</h3>
              </div>
              <div className="space-y-3">
                {[
                  { t: 'Strengthen your thesis statement:', d: 'Make your main point clear in the introduction.' },
                  { t: 'Add more specific examples:', d: 'Include quantifiable results to strengthen your impact.' },
                  { t: 'Improve conclusion:', d: 'End with a stronger reflection on your growth and future impact.' },
                ].map((s) => (
                  <div key={s.t}>
                    <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200">{s.t}</p>
                    <p className="text-[12px] text-gray-500 dark:text-slate-400 leading-snug mt-0.5">{s.d}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/university-college-student-route/essay"
                className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Go to Essay Coach <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Expert feedback */}
            <div className={`${card} p-4 sm:p-5 bg-blue-50/60 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 grid place-items-center shrink-0">
                  <MessageSquareText className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Need expert feedback?</h3>
              </div>
              <p className="text-[12px] text-gray-600 dark:text-slate-400 leading-snug">Get personalized feedback from an admission expert.</p>
              <Link
                href="/university-college-student-route/counselors/book"
                className="mt-3 w-full inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-semibold rounded-xl px-4 py-2.5 transition-colors"
              >
                Book a Review Session
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
