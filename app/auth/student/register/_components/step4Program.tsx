import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, Plus } from "lucide-react";

export default function Step3Programs({ onNext, onBack }: any) {
  const programs = [
    { name: "Engineering Science", school: "University of Toronto", prob: 72, color: "bg-orange-500" },
    { name: "Computer Engineering", school: "University of Waterloo", prob: 84, color: "bg-blue-600" }
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="text-left space-y-2">
        <h2 className="text-4xl font-serif text-[#1A1A1A]">Select your programs</h2>
        <p className="text-gray-500 text-sm font-medium">
          Search for a university program to see your probability score instantly.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-600 transition-colors" />
        <Input 
          placeholder="Search for a program (e.g. Waterloo Software Engineering)" 
          className="h-14 pl-12 border-2 border-gray-100 rounded-2xl focus-visible:border-blue-600 bg-gray-50/30 transition-all text-sm font-medium"
        />
      </div>

      {/* Program List */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-gray-100 pb-4">
          <h3 className="font-bold text-sm text-gray-800">Your target programs</h3>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
            Based on your grade profile
          </span>
        </div>

        <div className="space-y-3">
          {programs.map((p, i) => (
            <div key={i} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-pointer">
              <div className="space-y-1">
                <p className="font-bold text-sm group-hover:text-blue-600 transition-colors">{p.name}</p>
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{p.school}</p>
              </div>
              
              <div className="w-48 space-y-2">
                 <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-gray-400 uppercase">Probability</span>
                    <p className="text-[11px] font-bold text-blue-600">{p.prob}%</p>
                 </div>
                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${p.color} transition-all duration-1000 ease-out`} 
                      style={{ width: `${p.prob}%` }} 
                    />
                 </div>
              </div>
            </div>
          ))}

          {/* Add Program Placeholder */}
          <button className="w-full p-6 border-2 border-dashed border-gray-100 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all group">
            <Plus className="w-4 h-4" />
            <span className="text-sm font-bold">Add another program</span>
          </button>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="space-y-6 pt-6">
        <Button 
          onClick={onNext}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base shadow-xl shadow-blue-600/20"
        >
          View Full Analysis
        </Button>

        <button 
          onClick={onBack}
          className="w-full flex items-center justify-center gap-1 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to grade entry
        </button>
      </div>
    </div>
  );
}