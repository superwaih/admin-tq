'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link as LinkIcon, Edit3, ChevronRight } from "lucide-react";

export default function GradeChoicePage() {
  return (
    <div className="flex min-h-screen bg-white">
      <div className="hidden lg:flex w-[35%] bg-[#0B0E14] text-white p-16 flex-col justify-between">
        <div className="space-y-6">
          <div className="text-xl font-bold tracking-tight">AdmitIQ</div>
          <h1 className="text-4xl font-bold leading-tight">Your grades. <br /> Your real odds.</h1>
          <p className="text-gray-400 text-sm">We need your grades to calculate your probability score. Choose the fastest method.</p>
        </div>
      </div>

      <div className="flex-1 p-12 lg:p-24 flex items-center">
        <div className="w-full max-w-xl space-y-10">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase text-blue-600 tracking-[0.2em]">Step 2 of 3</span>
            <h2 className="text-3xl font-bold tracking-tight">How would you like to <br /> add your grades?</h2>
          </div>

          <div className="space-y-4">
            {/* Option 1: OUAC */}
            <Card className="border-2 border-blue-600 bg-blue-50/30 cursor-pointer transition-all hover:bg-blue-50">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                    <LinkIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-blue-900">Connect OUAC Account</p>
                      <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded tracking-tighter">RECOMMENDED</span>
                    </div>
                    <p className="text-xs text-blue-700/60">Instant Ontario Application Centre — auto-imports 12 courses & grades.</p>
                  </div>
                </div>
                <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 font-bold px-6">
                  <Link href="/auth/signup/grades/ouac">Connect OUAC →</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Option 2: Manual */}
            <Card className="border border-gray-100 bg-white cursor-pointer transition-all hover:border-blue-200">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                    <Edit3 className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900">Enter grades manually</p>
                    <p className="text-xs text-gray-500">Type in your course grades. Takes about 2 minutes.</p>
                  </div>
                </div>
                <Link href="/auth/signup/grades/manual" className="flex items-center gap-1 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                  Enter manually <ChevronRight className="w-4 h-4" />
                </Link>
              </CardContent>
            </Card>
          </div>

          <p className="text-xs text-gray-400 text-center">
            You can skip this for now, but your probability scores will be estimated based on regional averages.
          </p>
        </div>
      </div>
    </div>
  );
}