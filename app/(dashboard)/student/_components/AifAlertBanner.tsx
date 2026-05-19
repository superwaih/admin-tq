'use client';

import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowRight, X } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const AifAlertBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();
  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-blue-100/60 to-blue-50 dark:from-blue-950/50 dark:via-blue-900/30 dark:to-blue-950/50 border border-blue-200/80 dark:border-blue-500/25">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 via-blue-500/10 to-blue-400/5 pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-500/20 border border-blue-200 dark:border-blue-500/30 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
              <span className="text-blue-700 dark:text-blue-300 font-bold">UofT AIF due in 7 days</span>
              {' — '}your application form needs 2 more activity entries.
            </p>
            <div className="flex items-center gap-2.5 mt-2.5">
              <div className="flex-1 h-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-full overflow-hidden max-w-[180px]">
                <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all" style={{ width: '65%' }} />
              </div>
              <span className="text-[11px] font-bold text-blue-700 dark:text-blue-300 shrink-0">65% complete</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            onClick={() => router.push('/student/aif-coach')}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl px-5 h-9 text-sm font-semibold shadow-sm shadow-blue-200 dark:shadow-blue-900/20 gap-1.5"
          >
            Open AIF Coach
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1.5 rounded-lg text-blue-400 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
