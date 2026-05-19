'use client';

import React, { useState, useMemo } from 'react';
import { MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  name: string;
  sub: string;
  grade: string;
  risk: string;
  status: string;
  activity: string;
  initials: string;
}

export function StudentTable({ students = [] }: { students?: Student[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // 1. Calculate the data slice for the current page
  // useMemo ensures we don't re-calculate unless students or page changes
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return students.slice(startIndex, startIndex + itemsPerPage);
  }, [students, currentPage]);

  // 2. Calculate total pages
  const totalPages = Math.ceil(students.length / itemsPerPage);

  // Reset to page 1 if filters change the student list drastically
  React.useEffect(() => {
    setCurrentPage(1);
  }, [students.length]);

  return (
    <div className="flex flex-col w-full bg-white">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left min-w-[1000px] border-collapse">
          <thead>
            <tr className="bg-[#F1F3F5] border-b border-gray-100">
              <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#6B7280]">Student</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center text-[#6B7280]">Grade/Program</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center text-[#6B7280]">University</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center text-[#6B7280]">Risk Level</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center text-[#6B7280]">Status</th>
              <th className="px-4 py-2.5 text-[10px] font-bold uppercase tracking-wider text-center text-[#6B7280]">Last Activity</th>
              <th className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-wider text-right text-[#6B7280]">Action</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-50">
            {paginatedStudents.length > 0 ? (
              paginatedStudents.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#EBF1FF] text-[#2D5CFE] flex items-center justify-center font-bold text-[10px] shrink-0">
                        {s.initials}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-bold text-slate-900 leading-tight truncate">{s.name}</span>
                        <span className="text-[11px] text-gray-400 truncate">{s.sub}</span>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3 text-center text-[12px] text-gray-500 font-medium">{s.grade}</td>

                  <td className="px-4 py-3 text-center">
                    <span className="text-[#2D5CFE] font-bold text-[12px] underline decoration-blue-100 underline-offset-4 cursor-pointer hover:text-blue-700 transition-colors">
                      Province/ON
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide inline-block",
                      s.risk === 'Urgent' ? 'bg-red-50 text-red-500' : 
                      s.risk === 'Follow-up' ? 'bg-orange-50 text-orange-400' : 
                      'bg-green-50 text-green-500'
                    )}>
                      {s.risk}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide inline-block",
                      s.status === 'Low' ? 'bg-red-50 text-red-400' : 
                      s.status === 'Medium' ? 'bg-orange-50 text-orange-400' : 
                      'bg-green-50 text-green-500'
                    )}>
                      {s.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-center text-[12px] text-gray-400 font-medium">{s.activity}</td>

                  <td className="px-6 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="h-8 px-4 border border-gray-200 rounded-lg text-[11px] font-bold text-slate-700 hover:bg-gray-50 transition-all shadow-sm">
                        View
                      </button>
                      <button className="p-1 text-gray-300 hover:text-gray-500 transition-colors">
                        <MoreVertical size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                  No students found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Dynamic Footer Section */}
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-[24px]">
        <p className="text-[11px] text-gray-400 font-medium">
          Showing <span className="font-bold text-slate-900">
            {students.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, students.length)}
          </span> of <span className="font-bold text-slate-900">{students.length}</span> students
        </p>
        
        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-1.5 border border-gray-100 rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={14} />
          </button>
          
          {/* Dynamically render page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                "w-7 h-7 rounded-md text-[11px] font-bold transition-all",
                currentPage === page 
                  ? "bg-[#2D5CFE] text-white shadow-sm" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-slate-900"
              )}
            >
              {page}
            </button>
          ))}

          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-1.5 border border-gray-100 rounded-md text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}