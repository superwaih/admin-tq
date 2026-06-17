import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface Match {
  title: string;
  blurb: string;
  match: number;
  image: string;
}

const MATCHES: Match[] = [
  {
    title: 'Electrician (309A)',
    blurb: 'Strong match for your interests and skills.',
    match: 94,
    image: '/career/electrician.jpg',
  },
  {
    title: 'Automotive Service Technician',
    blurb: 'Great potential in this field.',
    match: 88,
    image: '/career/automotive.jpg',
  },
  {
    title: 'Construction Technician',
    blurb: 'Good match with your profile.',
    match: 82,
    image: '/career/construction.jpg',
  },
];

export const CareerMatches = () => (
  <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6">
    <div className="flex items-center justify-between gap-3 mb-4">
      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Top Career Pathway Matches</h3>
      <Link
        href="/vocational-technical-student-route/career"
        className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 hover:gap-1.5 transition-all shrink-0"
      >
        View All Pathways <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
      {MATCHES.map((m) => (
        <div
          key={m.title}
          className="group rounded-xl border border-gray-100 dark:border-white/6 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 bg-white dark:bg-[#1b2030]"
        >
          <div className="relative h-28 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m.image}
              alt={m.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <span className="absolute top-2 left-2 text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur px-2 py-0.5 rounded-full">
              {m.match}% Match
            </span>
          </div>
          <div className="p-3.5">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">{m.title}</p>
            <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1 leading-snug min-h-[28px]">{m.blurb}</p>
            <Link
              href="/vocational-technical-student-route/career"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 dark:text-blue-400 mt-2 hover:gap-1.5 transition-all"
            >
              Explore Pathway <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);
