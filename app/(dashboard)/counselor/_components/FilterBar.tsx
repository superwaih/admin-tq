'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, ChevronDown, Menu, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  onSearch: (term: string) => void;
  onFilterChange: (filterType: string, value: string) => void;
}

export function FilterBar({ onSearch, onFilterChange }: FilterBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Track selected values to update button labels
  const [selectedFilters, setSelectedFilters] = useState({
    status: 'All Status',
    program: 'All Programs',
    grade: 'All Grades'
  });

  const filters = [
    { label: 'Status', key: 'status', options: ['All Status', 'Urgent', 'Follow-up', 'On-track'] },
    { label: 'Programs', key: 'program', options: ['All Programs', 'OUAC Eng', 'CommonApp', 'UC Portal'] },
    { label: 'Grades', key: 'grade', options: ['All Grades', 'Grade 12', 'Grade 11', 'Post-Grad'] },
  ];

  const handleSelect = (key: string, value: string) => {
    setSelectedFilters(prev => ({ ...prev, [key]: value }));
    onFilterChange(key, value);
    setActiveDropdown(null);
  };

  return (
    <div className="relative">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full">
        
        {/* 1. Search Input */}
        <div className="relative flex-grow lg:flex-[1.5]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={2.5} />
          <input 
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search Student...." 
            className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 rounded-[14px] text-[13px] font-medium focus:outline-none focus:border-[#2D5CFE] transition-all"
          />
        </div>

        {/* 2. Functional Desktop Filters */}
        <div className="hidden lg:flex items-center gap-3 flex-grow">
          {filters.map((f) => (
            <div key={f.key} className="relative flex-1">
              <button 
                onClick={() => setActiveDropdown(activeDropdown === f.key ? null : f.key)}
                className={cn(
                  "w-full h-11 px-4 bg-white border rounded-[14px] flex items-center justify-between text-[13px] font-bold transition-all",
                  activeDropdown === f.key ? "border-[#2D5CFE] ring-4 ring-[#2D5CFE]/5 text-[#2D5CFE]" : "border-gray-200 text-slate-600 hover:bg-gray-50"
                )}
              >
                <span className="truncate">{selectedFilters[f.key as keyof typeof selectedFilters]}</span>
                <ChevronDown size={14} className={cn("transition-transform", activeDropdown === f.key && "rotate-180")} strokeWidth={3} />
              </button>

              {/* Dropdown Menu */}
              {activeDropdown === f.key && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {f.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleSelect(f.key, opt)}
                        className="w-full px-4 py-2.5 text-left text-[13px] font-medium text-slate-600 hover:bg-blue-50 hover:text-[#2D5CFE] flex items-center justify-between"
                      >
                        {opt}
                        {selectedFilters[f.key as keyof typeof selectedFilters] === opt && <Check size={14} strokeWidth={3} />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {/* 3. Action Buttons */}
        <div className="flex items-center gap-2">
          <button className="flex-grow lg:flex-none h-11 px-6 bg-cyan-600 text-white rounded-[14px] font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm">
            <Plus size={18} strokeWidth={3} />
            <span className="whitespace-nowrap">Add Student</span>
          </button>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "h-11 w-11 flex items-center justify-center rounded-[14px] border transition-all",
              isMobileMenuOpen ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-gray-200 text-slate-600"
            )}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* 4. Mobile Filter Menu */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 p-4 bg-white border border-gray-100 rounded-[20px] shadow-xl z-50 lg:hidden">
          <div className="space-y-4">
            {filters.map((f) => (
              <div key={f.key}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">{f.label}</p>
                <div className="grid grid-cols-2 gap-2">
                  {f.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSelect(f.key, opt)}
                      className={cn(
                        "h-10 px-3 rounded-lg text-[12px] font-bold border transition-all",
                        selectedFilters[f.key as keyof typeof selectedFilters] === opt
                          ? "bg-blue-50 border-[#2D5CFE] text-[#2D5CFE]"
                          : "bg-gray-50 border-transparent text-slate-600"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}