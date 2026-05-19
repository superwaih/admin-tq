import { GraduationCap, Flag, ExternalLink, Power, MoveUpRight } from 'lucide-react';

const stats = [
  { icon: <GraduationCap size={20} />, label: "Total Students", value: "14", trend: "1 this week", color: "blue", bg: "bg-blue-50", text: "text-blue-500" },
  { icon: <Flag size={20} />, label: "At-Risk Flags", value: "2", trend: "1 this week", color: "red", bg: "bg-red-50", text: "text-red-500" },
  { icon: <ExternalLink size={20} />, label: "Follow-ups", value: "3", trend: "1 this week", color: "orange", bg: "bg-orange-50", text: "text-orange-500" },
  { icon: <Power size={20} />, label: "On Track", value: "9", trend: "2 this week", color: "green", bg: "bg-green-50", text: "text-green-500" },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.text}`}>
              {stat.icon}
            </div>
            <p className="text-[11px] font-semibold text-gray-400">{stat.label}</p>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${stat.text}`}>
              <MoveUpRight size={10} strokeWidth={3} />
              <span>{stat.trend}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}