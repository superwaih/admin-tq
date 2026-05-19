import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-[32px] p-8 text-white">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-[10px] uppercase tracking-widest">
            <Sparkles size={14} /> <span>New Feature</span>
          </div>
          <h2 className="text-2xl font-bold">AI Application Insights</h2>
          <p className="text-slate-400 text-sm font-medium">Predict admission odds for 500+ global universities.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 rounded-2xl px-6 h-12 font-bold group">
          Try Now <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}