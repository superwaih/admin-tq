'use client';

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
  { date: 'Dec 1',  score: 28 },
  { date: 'Dec 8',  score: 42 },
  { date: 'Dec 15', score: 58 },
  { date: 'Dec 22', score: 52 },
  { date: 'Dec 29', score: 71 },
  { date: 'Jan 5',  score: 82 },
];

const categories = [
  { label: "Communication",   value: 86, color: "#10b981" },
  { label: "Ethics",          value: 82, color: "#3b82f6" },
  { label: "Teamwork",        value: 78, color: "#8b5cf6" },
  { label: "Empathy",         value: 90, color: "#06b6d4" },
  { label: "Problem Solving", value: 84, color: "#f59e0b" },
];

export function PerformanceOverview() {
  return (
    <div className="flex flex-col p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Performance Overview</h3>
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2 py-1 rounded-lg">↑ Improving</span>
      </div>

      <div className="h-44 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 0 }}>
            <defs>
              <linearGradient id="perfGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#3B82F6" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="0" vertical={false} stroke="rgba(148,163,184,0.12)" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 700, fill: '#6e76a0' }}
              dy={12}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fontWeight: 700, fill: '#6e76a0' }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip
              cursor={{ stroke: 'rgba(148,163,184,0.2)', strokeWidth: 1 }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: '#1e2338',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.4)',
                fontSize: 11,
                fontWeight: 700,
                color: '#dde0f0',
              }}
              formatter={(value: number) => [`${value}%`, 'Score']}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#3B82F6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#perfGradient)"
              dot={{ r: 3.5, fill: '#fff', stroke: '#3B82F6', strokeWidth: 2 }}
              activeDot={{ r: 5.5, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">Score by Category</p>
        <div className="space-y-3">
          {categories.map((cat) => (
            <div key={cat.label} className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 w-28 shrink-0 truncate">{cat.label}</span>
              <div className="flex-1 h-1.5 bg-slate-100 dark:bg-white/8 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.value}%`, backgroundColor: cat.color }}
                />
              </div>
              <span className="text-[11px] font-bold w-8 text-right shrink-0" style={{ color: cat.color }}>
                {cat.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
