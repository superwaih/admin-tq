import { Button } from "@/components/ui/button";
import { Link2, MousePointerClick, ChevronLeft } from "lucide-react";

export default function Step2GradeChoice({ onSelectOUAC, onSelectManual, onBack }: any) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-left space-y-2">
        <h2 className="text-4xl font-serif text-[#1A1A1A]">How would you like to add your grades?</h2>
        <p className="text-gray-500 text-sm font-medium">
          We use your grades to calculate your admission probability.
        </p>
      </div>

      <div className="grid gap-4">
        {/* OUAC Option */}
        <button 
          onClick={onSelectOUAC}
          className="p-6 border-2 border-blue-600 bg-blue-50/30 rounded-2xl flex items-center gap-6 group hover:bg-blue-50/50 transition-all text-left"
        >
          <div className="p-4 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
            <Link2 className="text-blue-600 w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-blue-700">Connect OUAC</h4>
            <p className="text-xs text-gray-500 font-medium">
              Import your Top-6 and course data automatically. (Recommended)
            </p>
          </div>
        </button>

        {/* Manual Option */}
        <button 
          onClick={onSelectManual}
          className="p-6 border border-gray-200 bg-white rounded-2xl flex items-center gap-6 group hover:border-blue-200 hover:bg-gray-50/30 transition-all text-left"
        >
          <div className="p-4 bg-gray-50 rounded-xl group-hover:bg-white transition-colors">
            <MousePointerClick className="text-gray-400 w-6 h-6 group-hover:text-blue-500" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg text-gray-800">Manual Entry</h4>
            <p className="text-xs text-gray-400 font-medium">
              Type in your 12 U/M-level courses and grades yourself.
            </p>
          </div>
        </button>
      </div>

      <button 
        onClick={onBack}
        className="w-full flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors pt-4"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to account details
      </button>
    </div>
  );
}