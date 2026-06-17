'use client';

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import ThemeToggle from '@/src/components/shared/ThemeToggle';

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <ThemeToggle floating />
      <div className="w-full max-w-[440px] bg-white rounded-[32px] border border-gray-100 shadow-xl p-12 text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-500" strokeWidth={3} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, Priya!</h2>
          <p className="text-gray-500 text-sm italic">Signed in successfully as Student. <br /> Redirecting to your Dashboard...</p>
        </div>

        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-blue-600 h-full w-2/3 animate-pulse" />
        </div>

        <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold">
          Open AI Coach
        </Button>

        <p className="text-[10px] text-gray-400">
          Not you? <button className="text-blue-600 font-bold underline">Sign out</button>
        </p>
      </div>
    </div>
  );
}