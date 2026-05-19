import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Info } from "lucide-react";

export default function Step3GradesManual({ onNext, onBack }: any) {
  // Initial course data based on typical Ontario requirements
  const courses = [
    { name: "Calculus (MCV4U)", grade: "89%" },
    { name: "Physics (SPH4U)", grade: "91%" },
    { name: "English (ENG4U)", grade: "85%" },
    { name: "Adv Functions (MHF4U)", grade: "92%" },
    { name: "Chemistry (SCH4U)", grade: "88%" },
    { name: "Data Mgmt (MDM4U)", grade: "94%" },
    { name: "French (FSF4U)", grade: "78%" },
    { name: "Computer Sci (ICS4U)", grade: "96%" },
  ];

  const emptySlots = Array(4).fill(null);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header */}
      <div className="text-left space-y-2">
        <h2 className="text-4xl font-serif text-[#1A1A1A]">Enter your grades</h2>
        <p className="text-gray-500 text-sm font-medium">
          Please enter your top 6 and remaining Grade 12 U/M courses.
        </p>
      </div>

      {/* Info Callout */}
      <div className="flex gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Tip:</strong> If you haven&apos;t received your final grade yet, use your most recent midterm or predicted grade for the most accurate probability score.
        </p>
      </div>

      {/* Manual Entry Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <h3 className="font-bold text-sm text-gray-800">12 U/M-level courses</h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Course Name & Grade (%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
          {courses.map((course, i) => (
            <div key={i} className="flex gap-2 group">
              <div className="flex-1">
                <Input 
                  defaultValue={course.name} 
                  className="h-11 border-gray-200 rounded-xl text-xs font-medium bg-white focus-visible:border-blue-600 transition-all"
                />
              </div>
              <div className="relative">
                <Input 
                  defaultValue={course.grade.replace('%', '')} 
                  className="w-16 h-11 border-gray-200 rounded-xl text-center text-xs font-bold text-blue-600 bg-white focus-visible:border-blue-600 transition-all"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-300 pointer-events-none">%</span>
              </div>
            </div>
          ))}
          
          {emptySlots.map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1">
                <Input 
                  placeholder="Select course —" 
                  className="h-11 border-gray-200 rounded-xl text-xs font-medium bg-gray-50/30 italic hover:bg-white transition-all"
                />
              </div>
              <div className="w-16 h-11 bg-gray-50/30 border border-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="space-y-6 pt-6 border-t border-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-full max-w-[400px] space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Confirm Email</label>
            <Input 
              placeholder="priya.mehta@email.com" 
              disabled
              className="h-12 border-2 border-blue-600 bg-blue-50/10 rounded-2xl text-center font-medium opacity-80"
            />
          </div>
        </div>

        <Button 
          onClick={onNext}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base shadow-xl shadow-blue-600/20 transition-all"
        >
          Calculate My Odds
        </Button>

        <button 
          onClick={onBack}
          className="w-full flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Change entry method
        </button>
      </div>
    </div>
  );
}