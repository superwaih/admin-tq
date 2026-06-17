'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User, Mail, Phone, FileText, Edit2, Save,
  Bell, Calendar, BarChart3, Flag, Briefcase, Milestone,
  Sun, Moon, Type, Activity, Globe, MapPin, Wrench, Building2,
  GraduationCap, Shield, Download, Lock, Eye, LogOut, ArrowRightLeft,
  Key, Monitor, History, Trash2, Smartphone, BookOpen,
  Check, LayoutGrid, ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { useTheme } from '@/src/hooks/useTheme';
import AssessmentSummaryCard from '@/src/components/assessment/AssessmentSummaryCard';

/* ── Vocational reference data ──────────────────────────────────────── */

interface Province { code: string; name: string; body: string; }

const PROVINCES: Province[] = [
  { code: 'ON', name: 'Ontario', body: 'Skilled Trades Ontario' },
  { code: 'BC', name: 'British Columbia', body: 'SkilledTradesBC' },
  { code: 'AB', name: 'Alberta', body: 'Alberta Apprenticeship & Industry Training' },
  { code: 'QC', name: 'Quebec', body: 'Commission de la construction du Québec (CCQ)' },
  { code: 'MB', name: 'Manitoba', body: 'Apprenticeship Manitoba' },
  { code: 'SK', name: 'Saskatchewan', body: 'Saskatchewan Apprenticeship (SATCC)' },
  { code: 'NS', name: 'Nova Scotia', body: 'Nova Scotia Apprenticeship Agency' },
  { code: 'NB', name: 'New Brunswick', body: 'NB Apprenticeship & Occupational Certification' },
  { code: 'NL', name: 'Newfoundland and Labrador', body: 'Apprenticeship & Trades Certification (NL)' },
  { code: 'PE', name: 'Prince Edward Island', body: 'PEI Apprenticeship Program' },
  { code: 'NT', name: 'Northwest Territories', body: 'NWT Apprenticeship Program' },
  { code: 'YT', name: 'Yukon', body: 'Yukon Apprenticeship Program' },
  { code: 'NU', name: 'Nunavut', body: 'Nunavut Apprenticeship Program' },
];

const TRADES = [
  'Electrician (309A)',
  'Automotive Service Technician (310S)',
  'Welder',
  'HVAC / Refrigeration & A/C Mechanic',
  'Plumber',
  'Carpenter',
  'Construction / Civil Technician',
  'Industrial Mechanic (Millwright)',
  'Heavy Equipment Technician',
  'Machinist',
  'Cook / Culinary',
  'Hairstylist / Esthetician',
];

const INSTITUTES: Record<string, string[]> = {
  ON: ['Conestoga College', 'George Brown College', 'Humber College', 'Centennial College', 'Mohawk College', 'Fanshawe College', 'Algonquin College'],
  BC: ['BCIT', 'Camosun College', 'Okanagan College', 'Vancouver Community College'],
  AB: ['SAIT', 'NAIT', 'Red Deer Polytechnic', 'Lethbridge College'],
  QC: ['Cégep de Trois-Rivières', 'Cégep du Vieux Montréal', 'CFP (DEP centres)'],
  MB: ['Red River College Polytechnic', 'Assiniboine Community College'],
  SK: ['Saskatchewan Polytechnic', 'Saskatchewan Indian Institute of Technologies'],
  NS: ['NSCC (Nova Scotia Community College)'],
  NB: ['NBCC (New Brunswick Community College)', 'CCNB'],
  NL: ['College of the North Atlantic'],
  PE: ['Holland College'],
  NT: ['Aurora College'],
  YT: ['Yukon University'],
  NU: ['Nunavut Arctic College'],
};

const DEFAULT_INSTITUTES = ['BCIT', 'SAIT', 'NAIT', 'Conestoga College', 'George Brown College', 'Humber College', 'Red River College Polytechnic', 'Saskatchewan Polytechnic'];

const TABS = ['Profile', 'Assessment', 'Notifications', 'Preferences', 'Security', 'Integrations', 'Pathway', 'Display', 'Privacy'] as const;
type Tab = typeof TABS[number] | 'All';

/* ── Small UI primitives ───────────────────────────────────────────── */

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={on}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/15'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

function SectionCard({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-4 sm:p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{title}</h3>
        {subtitle && <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

function ActionRow({ icon, label, sublabel, extra, danger = false, onClick }: {
  icon: React.ReactNode; label: string; sublabel?: string; extra?: React.ReactNode; danger?: boolean; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-1 px-1 rounded-xl transition-colors group"
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-gray-50 dark:bg-white/[0.04] text-slate-500 dark:text-slate-400'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className={`text-xs font-semibold ${danger ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-100'}`}>{label}</p>
          {sublabel && <p className="text-[10px] text-gray-400 dark:text-slate-500">{sublabel}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {extra}
        <ChevronRight size={13} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-500 transition-colors" />
      </div>
    </button>
  );
}

function SelectField({ label, sublabel, value, options }: { label: string; sublabel?: string; value: string; options?: string[] }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        {sublabel && <p className="text-[10px] text-gray-400 dark:text-slate-500">{sublabel}</p>}
      </div>
      <select className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/8 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all cursor-pointer">
        <option>{value}</option>
        {options?.map(o => o !== value && <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { val: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex p-0.5 rounded-xl bg-gray-100 dark:bg-white/8 gap-0.5">
      {options.map((o) => (
        <button
          key={o.val}
          onClick={() => onChange(o.val)}
          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
            value === o.val
              ? 'bg-white dark:bg-[#1b2030] text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function VocationalSettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('Profile');

  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.first_name ? `${user.first_name} ${user.last_name ?? ''}`.trim() : 'Priya Mehta',
    email: user?.email ?? 'priyamehta@student.com',
    phone: '+1 (555) 123-4567',
    bio: 'Hands-on learner pursuing a skilled-trades career, motivated to earn my Red Seal and build real-world experience through an apprenticeship.',
  });
  const [editProfile, setEditProfile] = useState({ ...profile });

  function saveProfile() {
    setProfile({ ...editProfile });
    setEditing(false);
  }

  /* Pathway preferences (the key vocational customization) */
  const [pathway, setPathway] = useState({
    province: (PROVINCES.find((p) => p.code === user?.province)?.code) ?? 'ON',
    trade: TRADES[0],
    route: 'apprenticeship' as 'apprenticeship' | 'college',
    relocate: false,
    language: 'EN' as 'EN' | 'FR',
  });
  const [institutes, setInstitutes] = useState<Set<string>>(new Set(['BCIT', 'Conestoga College']));

  const currentProvince = PROVINCES.find((p) => p.code === pathway.province)!;
  const provinceInstitutes = INSTITUTES[pathway.province] ?? DEFAULT_INSTITUTES;

  const toggleInstitute = (name: string) => {
    setInstitutes((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  /* Notifications */
  const [notifs, setNotifs] = useState({
    milestones: true,
    counselling: true,
    deadlines: true,
    sponsorship: true,
    grades: false,
    email: true,
    sms: false,
  });

  /* Preferences */
  const [prefs, setPrefs] = useState({
    compactMode: false,
    autoSave:    true,
  });

  /* Display / accessibility */
  const [textSize, setTextSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [reducedMotion, setReducedMotion] = useState(false);

  /* Privacy */
  const [visibility, setVisibility] = useState<'public' | 'counsellors' | 'private'>('counsellors');

  const initials = profile.name.split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  const tabSections: Record<Tab, string[]> = {
    All: ['profile', 'assessment', 'notifications', 'preferences', 'security', 'integrations', 'pathway', 'display', 'privacy'],
    Profile: ['profile'],
    Assessment: ['assessment'],
    Notifications: ['notifications'],
    Preferences: ['preferences'],
    Security: ['security'],
    Integrations: ['integrations'],
    Pathway: ['pathway'],
    Display: ['display'],
    Privacy: ['privacy'],
  };
  const visible = (s: string) => tabSections[activeTab].includes(s);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-4 sm:space-y-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-[22px] sm:text-2xl lg:text-[28px] font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400 mt-1">
              Manage your profile and tailor AdmitIQ to your trades &amp; technical-school pathway.
            </p>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 self-start bg-white dark:bg-white/8 border border-gray-200 dark:border-white/10 shadow-sm text-[12px] font-semibold text-slate-600 dark:text-slate-300 px-3.5 py-2 rounded-xl shrink-0">
            <MapPin className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            {currentProvince.name}
          </span>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-slate-400 border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {tab === 'Pathway' ? 'Pathway Preferences' : tab}
            </button>
          ))}
          <button
            onClick={() => setActiveTab('All')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'All'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white dark:bg-[#161a27] text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/5'
            }`}
          >
            <LayoutGrid size={11} /> Show All Settings
          </button>
        </div>

        {/* Assessment (full width) */}
        {visible('assessment') && (
          <AssessmentSummaryCard userId={user?.id ?? 'demo-student'} />
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 items-start">

          {/* Profile */}
          {visible('profile') && (
            <SectionCard title="Profile Information" subtitle="Update your personal information and bio.">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">{initials}</div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{profile.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditProfile({ ...profile }); setEditing((v) => !v); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit2 size={12} /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <div className="space-y-3">
                  {([
                    { key: 'name', label: 'Full Name', type: 'text' },
                    { key: 'email', label: 'Email', type: 'email' },
                    { key: 'phone', label: 'Phone', type: 'tel' },
                  ] as const).map((f) => (
                    <div key={f.key}>
                      <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={editProfile[f.key]}
                        onChange={(e) => setEditProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Bio</label>
                    <textarea
                      value={editProfile.bio}
                      onChange={(e) => setEditProfile((p) => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all resize-none"
                    />
                  </div>
                  <button
                    onClick={saveProfile}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    <Save size={12} /> Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { icon: <Mail size={13} />, label: 'EMAIL', value: profile.email },
                    { icon: <Phone size={13} />, label: 'PHONE', value: profile.phone },
                    { icon: <Check size={13} />, label: 'EMAIL STATUS', value: 'Verified' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0 mt-0.5">{r.icon}</div>
                      <div>
                        <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{r.label}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${r.value === 'Verified' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'}`}>{r.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0 mt-0.5"><FileText size={13} /></div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">BIO</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {/* Notifications */}
          {visible('notifications') && (
            <SectionCard title="Notification Preferences" subtitle="Choose what updates you receive.">
              <div className="space-y-1">
                {([
                  { key: 'milestones', icon: <Milestone size={13} />, label: 'Milestone Updates', sub: 'Progress on your vocational milestones' },
                  { key: 'counselling', icon: <Calendar size={13} />, label: 'Counselling Reminders', sub: 'Upcoming mentor & advisor sessions' },
                  { key: 'deadlines', icon: <Bell size={13} />, label: 'Application Deadlines', sub: 'Intake & program application dates' },
                  { key: 'sponsorship', icon: <Briefcase size={13} />, label: 'Employer / Sponsorship Opportunities', sub: 'New sponsor & apprenticeship openings' },
                  { key: 'grades', icon: <BarChart3 size={13} />, label: 'Grade Alerts', sub: 'Changes to prerequisite course grades' },
                  { key: 'email', icon: <Mail size={13} />, label: 'Email Notifications', sub: 'Receive updates by email' },
                  { key: 'sms', icon: <Phone size={13} />, label: 'SMS Notifications', sub: 'Receive text messages' },
                ] as const).map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0">{n.icon}</div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{n.label}</p>
                        <p className="text-[10px] text-gray-400 dark:text-slate-500">{n.sub}</p>
                      </div>
                    </div>
                    <Toggle on={notifs[n.key]} onChange={() => setNotifs((p) => ({ ...p, [n.key]: !p[n.key] }))} />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Preferences */}
          {visible('preferences') && (
            <SectionCard title="Preferences" subtitle="Customize your experience.">
              <div className="space-y-0">
                <SelectField label="Language"    sublabel="Choose your language"          value="English"             options={['French', 'Spanish', 'Mandarin']} />
                <SelectField label="Timezone"    sublabel="Your current timezone"         value="(GMT-5) Eastern Time" options={['(GMT-8) Pacific Time', '(GMT-6) Central Time', '(GMT-7) Mountain Time']} />
                <SelectField label="Date Format" sublabel="Choose date format"            value="MM/DD/YYYY"          options={['DD/MM/YYYY', 'YYYY-MM-DD']} />
                <SelectField label="Time Format" sublabel="Choose time format"            value="12 Hour"             options={['24 Hour']} />

                <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04]">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Compact Mode</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Show more content in less space</p>
                  </div>
                  <Toggle on={prefs.compactMode} onChange={() => setPrefs((p) => ({ ...p, compactMode: !p.compactMode }))} />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Auto-save</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500">Automatically save your changes</p>
                  </div>
                  <Toggle on={prefs.autoSave} onChange={() => setPrefs((p) => ({ ...p, autoSave: !p.autoSave }))} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Pathway Preferences */}
          {visible('pathway') && (
            <SectionCard
              title="Pathway Preferences"
              subtitle="Tailor recommendations to your trade and province."
              className="md:col-span-2"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Province */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    <Flag size={12} /> Home Province / Territory
                  </label>
                  <select
                    value={pathway.province}
                    onChange={(e) => setPathway((p) => ({ ...p, province: e.target.value }))}
                    className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all cursor-pointer"
                  >
                    {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1.5 flex items-center gap-1">
                    <Building2 size={11} /> Governing body: {currentProvince.body}
                  </p>
                </div>

                {/* Target trade */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    <Wrench size={12} /> Target Trade / Program
                  </label>
                  <select
                    value={pathway.trade}
                    onChange={(e) => setPathway((p) => ({ ...p, trade: e.target.value }))}
                    className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all cursor-pointer"
                  >
                    {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Route preference */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    <GraduationCap size={12} /> Entry Route Preference
                  </label>
                  <Segmented
                    value={pathway.route}
                    onChange={(v) => setPathway((p) => ({ ...p, route: v }))}
                    options={[
                      { val: 'apprenticeship', label: 'Apprenticeship' },
                      { val: 'college', label: 'College Diploma' },
                    ]}
                  />
                </div>

                {/* Language */}
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    <Globe size={12} /> Preferred Language
                  </label>
                  <Segmented
                    value={pathway.language}
                    onChange={(v) => setPathway((p) => ({ ...p, language: v }))}
                    options={[
                      { val: 'EN', label: 'English' },
                      { val: 'FR', label: 'Français' },
                    ]}
                  />
                </div>
              </div>

              {/* Preferred institutes */}
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  <Building2 size={12} /> Preferred Technical Institutes
                </label>
                <div className="flex flex-wrap gap-2">
                  {provinceInstitutes.map((inst) => {
                    const on = institutes.has(inst);
                    return (
                      <button
                        key={inst}
                        onClick={() => toggleInstitute(inst)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                          on
                            ? 'bg-blue-50 dark:bg-blue-500/15 border-blue-200 dark:border-blue-500/30 text-blue-600 dark:text-blue-400'
                            : 'bg-slate-100 dark:bg-white/8 border-transparent text-slate-600 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10'
                        }`}
                      >
                        {on && <Check size={11} className="inline -mt-0.5 mr-1" />}{inst}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Relocate */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Willing to relocate</p>
                  <p className="text-[10px] text-gray-400 dark:text-slate-500">Show apprenticeships &amp; programs in other provinces.</p>
                </div>
                <Toggle on={pathway.relocate} onChange={() => setPathway((p) => ({ ...p, relocate: !p.relocate }))} />
              </div>
            </SectionCard>
          )}

          {/* Security Settings */}
          {visible('security') && (
            <SectionCard title="Security Settings" subtitle="Manage your password and security preferences.">
              <ActionRow icon={<Key size={14} />} label="Change Password" sublabel="Update your sign-in password" />
              <ActionRow
                icon={<Shield size={14} />}
                label="Two-Factor Authentication"
                sublabel="Add an extra layer of security"
                extra={<span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">Enabled</span>}
              />
              <ActionRow
                icon={<Monitor size={14} />}
                label="Active Sessions"
                sublabel="Manage your active sessions"
                extra={<span className="text-[10px] font-semibold text-slate-400">3 sessions</span>}
              />
              <ActionRow icon={<History size={14} />} label="Login History" sublabel="View your login activity" />
            </SectionCard>
          )}

          {/* Integrations */}
          {visible('integrations') && (
            <SectionCard title="Integrations" subtitle="Connect your apps and services.">
              {[
                { name: 'Google Calendar', sub: 'Sync your sessions',     connected: true,  color: 'bg-blue-50 dark:bg-blue-500/10',   tc: 'text-blue-600' },
                { name: 'Microsoft Teams', sub: 'Join video sessions',    connected: false, color: 'bg-violet-50 dark:bg-violet-500/10', tc: 'text-violet-600' },
                { name: 'Slack',           sub: 'Get notifications',       connected: false, color: 'bg-pink-50 dark:bg-pink-500/10',    tc: 'text-pink-600' },
                { name: 'Zoom',            sub: 'Video conferencing',      connected: true,  color: 'bg-blue-50 dark:bg-blue-500/10',   tc: 'text-blue-600' },
              ].map((int) => (
                <div key={int.name} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${int.color} flex items-center justify-center shrink-0`}>
                      <Globe size={14} className={int.tc} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{int.name}</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">{int.sub}</p>
                    </div>
                  </div>
                  <button className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors ${
                    int.connected
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500'
                      : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100'
                  }`}>
                    {int.connected ? 'Connected' : 'Connect'}
                  </button>
                </div>
              ))}
            </SectionCard>
          )}

          {/* Display / Accessibility */}
          {visible('display') && (
            <SectionCard title="Accessibility & Display" subtitle="Customize how AdmitIQ looks and feels.">
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    {theme === 'dark' ? <Moon size={12} /> : <Sun size={12} />} Theme
                  </label>
                  <Segmented
                    value={theme}
                    onChange={(v) => setTheme(v)}
                    options={[
                      { val: 'light', label: 'Light' },
                      { val: 'dark', label: 'Dark' },
                    ]}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                    <Type size={12} /> Text Size
                  </label>
                  <Segmented
                    value={textSize}
                    onChange={(v) => setTextSize(v)}
                    options={[
                      { val: 'sm', label: 'Small' },
                      { val: 'md', label: 'Default' },
                      { val: 'lg', label: 'Large' },
                    ]}
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0"><Activity size={13} /></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">Reduced Motion</p>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500">Minimize animations &amp; transitions</p>
                    </div>
                  </div>
                  <Toggle on={reducedMotion} onChange={() => setReducedMotion((v) => !v)} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Privacy & Account */}
          {visible('privacy') && (
            <SectionCard title="Privacy & Account" subtitle="Control visibility, your data, and your portal.">
              <div className="mb-3">
                <label className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                  <Eye size={12} /> Profile Visibility
                </label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as typeof visibility)}
                  className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-slate-100 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all cursor-pointer"
                >
                  <option value="public">Public</option>
                  <option value="counsellors">Counsellors &amp; mentors only</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <ActionRow icon={<Download size={14} />} label="Download My Data" sublabel="Export your profile & progress" />
              <ActionRow icon={<Lock size={14} />} label="Privacy Settings" sublabel="Manage your privacy preferences" />
              <ActionRow icon={<Trash2 size={14} />} label="Delete Account" sublabel="Permanently delete your account" danger />

              {/* Role / portal switcher */}
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5">
                <p className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  <ArrowRightLeft size={12} /> Switch Portal
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { href: '/student', label: 'Student' },
                    { href: '/counselor', label: 'Counselor' },
                    { href: '/parent', label: 'Parent' },
                  ].map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      className="flex items-center justify-center px-2 py-2 rounded-xl border border-gray-100 dark:border-white/8 bg-gray-50 dark:bg-white/[0.03] text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 transition-colors"
                    >
                      {r.label}
                    </Link>
                  ))}
                </div>
                <button
                  onClick={logout}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 text-xs font-bold transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Bottom save bar */}
        {(activeTab === 'Profile' || activeTab === 'Notifications' || activeTab === 'Preferences' || activeTab === 'Pathway' || activeTab === 'Display' || activeTab === 'All') && (
          <div className="flex items-center justify-end gap-3 pt-1 pb-4">
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/8 text-slate-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Reset to defaults
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm">
              <Save size={13} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
