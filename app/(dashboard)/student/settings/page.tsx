'use client';

import { useState } from 'react';
import {
  User, Mail, Phone, Hash, GraduationCap, FileText, Edit2,
  Bell, MessageSquare, Smartphone, BookOpen, Calendar, BarChart3,
  Sun, Globe, Clock, AlignJustify, Save,
  Shield, Key, Monitor, History, ChevronRight,
  Download, Lock, Trash2, AlertCircle,
  Star, CreditCard, Receipt, Package,
  Check, X,
} from 'lucide-react';

const TABS = ['Profile', 'Notifications', 'Preferences', 'Security', 'Integrations', 'Billing'] as const;
type Tab = typeof TABS[number];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${on ? 'bg-blue-600' : 'bg-gray-200 dark:bg-white/15'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  );
}

function SectionCard({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-5 sm:p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5">{subtitle}</p>}
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
      className={`w-full flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] -mx-1 px-1 rounded-xl transition-colors group`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-50 dark:bg-red-500/10 text-red-500' : 'bg-gray-50 dark:bg-white/[0.04] text-slate-500 dark:text-[#8e92ad]'}`}>
          {icon}
        </div>
        <div className="text-left">
          <p className={`text-xs font-semibold ${danger ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>{label}</p>
          {sublabel && <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{sublabel}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {extra}
        <ChevronRight size={13} className="text-slate-300 dark:text-[#40455e] group-hover:text-slate-500 transition-colors" />
      </div>
    </button>
  );
}

function SelectField({ label, sublabel, value, options }: { label: string; sublabel?: string; value: string; options?: string[] }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
      <div>
        <p className="text-xs font-semibold text-slate-800 dark:text-white">{label}</p>
        {sublabel && <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{sublabel}</p>}
      </div>
      <select className="text-[11px] font-semibold text-slate-700 dark:text-[#c8ccdf] bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/8 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all cursor-pointer">
        <option>{value}</option>
        {options?.map(o => o !== value && <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function StudentSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [editing, setEditing]     = useState(false);

  const [notifs, setNotifs] = useState({
    email:        true,
    sms:          false,
    push:         true,
    newRequests:  true,
    essayUpdates: true,
    sessionReminders: false,
    weeklyReports: true,
  });

  const [prefs, setPrefs] = useState({
    compactMode: false,
    autoSave:    true,
  });

  const [profile, setProfile] = useState({
    name:    'Priya Mehta',
    email:   'priyamehta@student.com',
    phone:   '+1 (555) 123-4567',
    id:      'STU-2025-0789',
    grade:   '12th Grade',
    bio:     'Motivated and ambitious student passionate about learning, leadership, and personal growth, with strong teamwork and communication skills.',
  });

  const [editProfile, setEditProfile] = useState({ ...profile });

  function saveProfile() {
    setProfile({ ...editProfile });
    setEditing(false);
  }

  const tabSections: Record<Tab, string[]> = {
    Profile:       ['profile', 'security', 'data'],
    Notifications: ['notifications'],
    Preferences:   ['preferences'],
    Security:      ['security', 'data'],
    Integrations:  ['integrations'],
    Billing:       ['billing'],
  };
  const visible = (s: string) => tabSections[activeTab].includes(s);

  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1200px] mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Manage your account preferences and application settings.</p>
        </div>

        {/* Tab bar */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-[#161a27] text-slate-600 dark:text-[#8e92ad] border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Row 1: Profile · Notifications · Preferences ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Profile Information */}
          {visible('profile') && (
            <SectionCard
              title="Profile Information"
              subtitle="Update your personal information and profile details."
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shrink-0">PM</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{profile.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditProfile({ ...profile }); setEditing(v => !v); }}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Edit2 size={12} /> {editing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              {editing ? (
                <div className="space-y-3">
                  {([
                    { key: 'name',  label: 'Full Name',   type: 'text'  },
                    { key: 'email', label: 'Email',        type: 'email' },
                    { key: 'phone', label: 'Phone',        type: 'tel'   },
                  ] as const).map(f => (
                    <div key={f.key}>
                      <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">{f.label}</label>
                      <input
                        type={f.type}
                        value={editProfile[f.key]}
                        onChange={e => setEditProfile(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full h-9 px-3 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider block mb-1">Bio</label>
                    <textarea
                      value={editProfile.bio}
                      onChange={e => setEditProfile(p => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 text-xs bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400/50 transition-all resize-none"
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
                    { icon: <Mail size={13} />,          label: 'EMAIL',      value: profile.email },
                    { icon: <Phone size={13} />,         label: 'PHONE',      value: profile.phone },
                    { icon: <Hash size={13} />,          label: 'STUDENT ID', value: profile.id },
                    { icon: <GraduationCap size={13} />, label: 'GRADE LEVEL', value: profile.grade },
                    { icon: <Check size={13} />,         label: 'EMAIL',      value: 'Verified' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0 mt-0.5">{r.icon}</div>
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">{r.label}</p>
                        <p className={`text-xs font-semibold mt-0.5 ${r.value === 'Verified' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-white'}`}>{r.value}</p>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0 mt-0.5"><FileText size={13} /></div>
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 dark:text-[#8e92ad] uppercase tracking-wider">BIO</p>
                      <p className="text-xs text-slate-600 dark:text-[#c8ccdf] mt-0.5 leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              )}
            </SectionCard>
          )}

          {/* Notification Preferences */}
          {visible('notifications') && (
            <SectionCard
              title="Notification Preferences"
              subtitle="Choose how you want to be notified."
            >
              <div className="space-y-1">
                {([
                  { key: 'email',            icon: <Mail size={13} />,         label: 'Email Notifications',   sub: 'Receive email updates' },
                  { key: 'sms',              icon: <Smartphone size={13} />,   label: 'SMS Notifications',     sub: 'Receive text messages' },
                  { key: 'push',             icon: <Bell size={13} />,          label: 'Push Notifications',    sub: 'Browser push notifications' },
                  { key: 'newRequests',      icon: <User size={13} />,          label: 'New Student Requests',  sub: 'Get notified about new requests' },
                  { key: 'essayUpdates',     icon: <BookOpen size={13} />,      label: 'Essay Review Updates',  sub: 'Updates on essay reviews' },
                  { key: 'sessionReminders', icon: <Calendar size={13} />,      label: 'Session Reminders',     sub: 'Reminders for scheduled sessions' },
                  { key: 'weeklyReports',    icon: <BarChart3 size={13} />,     label: 'Weekly Reports',        sub: 'Weekly summary reports' },
                ] as const).map(n => (
                  <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-slate-400 shrink-0">
                        {n.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-white">{n.label}</p>
                        <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{n.sub}</p>
                      </div>
                    </div>
                    <Toggle on={notifs[n.key]} onChange={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key] }))} />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* Appearance & Preferences */}
          {visible('preferences') && (
            <SectionCard
              title="Appearance & Preferences"
              subtitle="Customize your experience."
            >
              <div className="space-y-0">
                <SelectField label="Theme"       sublabel="Choose your preferred theme"  value="Light"              options={['Dark', 'System']} />
                <SelectField label="Language"    sublabel="Choose your language"         value="English"            options={['French', 'Spanish', 'Mandarin']} />
                <SelectField label="Timezone"    sublabel="Your current timezone"        value="(GMT-5) Eastern Time" options={['(GMT-8) Pacific Time', '(GMT-6) Central Time', '(GMT-7) Mountain Time']} />
                <SelectField label="Date Format" sublabel="Choose date format"           value="MM/DD/YYYY"         options={['DD/MM/YYYY', 'YYYY-MM-DD']} />
                <SelectField label="Time Format" sublabel="Choose time format"           value="12 Hour"            options={['24 Hour']} />

                <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04]">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Compact Mode</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Show more content in less space</p>
                  </div>
                  <Toggle on={prefs.compactMode} onChange={() => setPrefs(p => ({ ...p, compactMode: !p.compactMode }))} />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">Auto-save</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Automatically save your changes</p>
                  </div>
                  <Toggle on={prefs.autoSave} onChange={() => setPrefs(p => ({ ...p, autoSave: !p.autoSave }))} />
                </div>
              </div>
            </SectionCard>
          )}
        </div>

        {/* ── Row 2: Security · Data & Privacy · Billing ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {/* Security Settings */}
          {visible('security') && (
            <SectionCard
              title="Security Settings"
              subtitle="Manage your password and security preferences."
            >
              <ActionRow icon={<Key size={14} />}     label="Change Password"          sublabel="Update your password" />
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

          {/* Data & Privacy */}
          {visible('data') && (
            <SectionCard
              title="Data & Privacy"
              subtitle="Manage your data and privacy settings."
            >
              <ActionRow icon={<Download size={14} />} label="Download My Data"   sublabel="Export your data" />
              <ActionRow icon={<Lock size={14} />}     label="Privacy Settings"   sublabel="Manage your privacy preferences" />
              <ActionRow icon={<Trash2 size={14} />}   label="Delete Account"     sublabel="Permanently delete your account" danger />
            </SectionCard>
          )}

          {/* Integrations */}
          {visible('integrations') && (
            <SectionCard
              title="Integrations"
              subtitle="Connect your apps and services."
            >
              {[
                { name: 'Google Calendar', sub: 'Sync your sessions', connected: true,  color: 'bg-blue-50 dark:bg-blue-500/10',   tc: 'text-blue-600' },
                { name: 'Microsoft Teams', sub: 'Join video sessions', connected: false, color: 'bg-violet-50 dark:bg-violet-500/10', tc: 'text-violet-600' },
                { name: 'Slack',           sub: 'Get notifications',   connected: false, color: 'bg-pink-50 dark:bg-pink-500/10',    tc: 'text-pink-600' },
                { name: 'Zoom',            sub: 'Video conferencing',  connected: true,  color: 'bg-blue-50 dark:bg-blue-500/10',   tc: 'text-blue-600' },
              ].map(int => (
                <div key={int.name} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-white/[0.04] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl ${int.color} flex items-center justify-center shrink-0`}>
                      <Globe size={14} className={int.tc} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-white">{int.name}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{int.sub}</p>
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

          {/* Account & Subscription */}
          {visible('billing') && (
            <SectionCard
              title="Account & Subscription"
              subtitle="Manage your account and subscription details."
            >
              {/* Current plan */}
              <div className="flex items-center justify-between p-3.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl border border-blue-100 dark:border-blue-500/20 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                    <Star size={14} className="text-white fill-white" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">Current Plan</p>
                    <p className="text-xs font-bold text-blue-800 dark:text-blue-200">Premium Plan</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition-colors">
                  Change Plan
                </button>
              </div>

              <ActionRow icon={<Receipt size={14} />}    label="Billing History"   sublabel="View your billing history" />
              <ActionRow icon={<CreditCard size={14} />} label="Payment Methods"   sublabel="Manage your payment methods" />
              <ActionRow icon={<Package size={14} />}    label="Invoice Download"  sublabel="Download your invoices" />
            </SectionCard>
          )}
        </div>

        {/* Bottom save bar — shown on Profile or Preferences tab */}
        {(activeTab === 'Profile' || activeTab === 'Notifications' || activeTab === 'Preferences') && (
          <div className="flex items-center justify-end gap-3 pt-1 pb-4">
            <button className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-200 dark:border-white/8 text-slate-600 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Reset to defaults
            </button>
            <button className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-sm shadow-blue-200 dark:shadow-blue-900/20">
              <Save size={13} /> Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
