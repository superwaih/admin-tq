'use client';

import { useState } from 'react';
import { ChevronRight, Edit3, Mail, Phone, Hash, GraduationCap, CalendarDays, FileText, Bell, Users, BarChart2, Clock, Star, Lock, Shield, Monitor, History, Download, ShieldCheck, Trash2 } from 'lucide-react';

const TABS = ['Profile','Notifications','Preferences','Security','Integrations','Billing'];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`relative rounded-full transition-colors duration-200 shrink-0 ${on ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-white/15'}`}
      style={{ height: '22px', width: '40px', display: 'inline-block' }}>
      <span className={`absolute top-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-[20px]' : 'translate-x-[2px]'}`} />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('Profile');
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, newRequests: true, essayUpdates: true, sessionReminders: false, weeklyReports: true });

  return (
    <div className="bg-[#F8F9FB] dark:bg-[#0f1117]">
      <div className="max-w-[1400px] mx-auto space-y-5">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Manage your account preferences and application settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 border-b border-gray-100 dark:border-white/5 pb-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold transition-all border-b-2 -mb-px ${activeTab === t ? 'border-[#0284c7] text-cyan-600' : 'border-transparent text-slate-500 dark:text-[#8e92ad] hover:text-slate-700 dark:hover:text-white'}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ROW 1 — Profile | Notifications | Appearance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Profile Information */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-white">Profile Information</h3>
                <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5">Update your personal information and profile details.</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 hover:text-sky-700 transition-colors">
                <Edit3 size={13} /> Edit
              </button>
            </div>
            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center text-white text-xl font-bold mb-3 relative">
                SJ
                <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#161a27]" />
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">Dr. Sarah Johnson</p>
              <p className="text-xs text-slate-400 dark:text-[#8e92ad]">Senior Counselor</p>
              <span className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Online
              </span>
            </div>
            <div className="space-y-3 text-xs">
              {[
                { label: 'EMAIL',          value: 'sarah.johnson@admitiq.com',                                                                icon: Mail },
                { label: 'PHONE',          value: '+1 (555) 123-4567',                                                                        icon: Phone },
                { label: 'STUDENT ID',     value: 'STU-2025-0789',                                                                            icon: Hash },
                { label: 'GRADE LEVEL',    value: '12th Grade',                                                                               icon: GraduationCap },
                { label: 'COUNSELOR SINCE',value: 'August 2020',                                                                              icon: CalendarDays },
                { label: 'BIO',            value: 'Experienced college counselor dedicated to helping students achieve their academic goals.',  icon: FileText },
              ].map(f => (
                <div key={f.label} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-md bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <f.icon size={11} className="text-slate-400 dark:text-[#40455e]" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-widest">{f.label}</p>
                    <p className="text-slate-700 dark:text-[#c8ccdf] mt-0.5 leading-relaxed">{f.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Notification Preferences</h3>
            <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5 mb-5">Choose how you want to be notified.</p>
            <div className="space-y-4">
              {[
                { label: 'Email Notifications',  sub: 'Receive email updates',             key: 'email',            icon: Mail },
                { label: 'SMS Notifications',    sub: 'Receive text messages',             key: 'sms',              icon: Phone },
                { label: 'Push Notifications',   sub: 'Browser push notifications',       key: 'push',             icon: Bell },
                { label: 'New Student Requests', sub: 'Get notified about new requests',  key: 'newRequests',      icon: Users },
                { label: 'Essay Review Updates', sub: 'Updates on essay reviews',         key: 'essayUpdates',     icon: FileText },
                { label: 'Session Reminders',    sub: 'Reminders for scheduled sessions', key: 'sessionReminders', icon: Clock },
                { label: 'Weekly Reports',       sub: 'Weekly summary reports',           key: 'weeklyReports',    icon: BarChart2 },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                      <n.icon size={14} className="text-slate-400 dark:text-[#40455e]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">{n.label}</p>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{n.sub}</p>
                    </div>
                  </div>
                  <Toggle on={notifs[n.key as keyof typeof notifs]} onToggle={() => setNotifs(p => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))} />
                </div>
              ))}
            </div>
          </div>

          {/* Appearance & Preferences */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Appearance & Preferences</h3>
            <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5 mb-5">Customize your experience.</p>
            <div className="space-y-4">
              {[
                { label: 'Theme',       sub: 'Choose your preferred theme', value: 'Light' },
                { label: 'Language',    sub: 'Choose your language',        value: 'English' },
                { label: 'Timezone',    sub: 'Your current timezone',       value: '(GMT-5) Eastern Time' },
                { label: 'Date Format', sub: 'Choose date format',          value: 'MM/DD/YYYY' },
                { label: 'Time Format', sub: 'Choose time format',          value: '12 Hour' },
              ].map(f => (
                <div key={f.label} className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-white">{f.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{f.sub}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 dark:border-white/10 rounded-lg text-xs font-semibold text-slate-700 dark:text-[#c8ccdf] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors whitespace-nowrap">
                    {f.value} <span className="opacity-50">▾</span>
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">Compact Mode</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Show more content in less space</p>
                </div>
                <Toggle on={false} onToggle={() => {}} />
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-white">Auto-save</p>
                  <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">Automatically save your changes</p>
                </div>
                <Toggle on={true} onToggle={() => {}} />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 — Security | Data & Privacy | Account & Subscription */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Security Settings */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Security Settings</h3>
            <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">Manage your password and security preferences.</p>
            <div className="space-y-2">
              {[
                { label: 'Change Password',           sub: 'Update your password',           badge: null,        icon: Lock },
                { label: 'Two-Factor Authentication', sub: 'Add an extra layer of security', badge: 'Enabled',  icon: Shield },
                { label: 'Active Sessions',           sub: 'Manage your active sessions',    badge: '3 sessions',icon: Monitor },
                { label: 'Login History',             sub: 'View your login activity',       badge: null,        icon: History },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03] cursor-pointer transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <s.icon size={13} className="text-slate-400 dark:text-[#40455e]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{s.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.sub}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {s.badge && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">{s.badge}</span>}
                    <ChevronRight size={13} className="text-slate-300 dark:text-[#40455e]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data & Privacy */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-1">Data & Privacy</h3>
            <p className="text-xs text-slate-400 dark:text-[#8e92ad] mb-4">Manage your data and privacy settings.</p>
            <div className="space-y-2">
              {[
                { label: 'Download My Data',  sub: 'Export your data',                        danger: false, icon: Download },
                { label: 'Privacy Settings',  sub: 'Manage your privacy preferences',         danger: false, icon: ShieldCheck },
                { label: 'Delete Account',    sub: 'Permanently delete your account',         danger: true,  icon: Trash2 },
              ].map(s => (
                <div key={s.label} className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border cursor-pointer transition-colors ${s.danger ? 'border-red-100 dark:border-red-500/20 hover:bg-red-50 dark:hover:bg-red-500/10' : 'border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03]'}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${s.danger ? 'bg-red-50 dark:bg-red-500/10' : 'bg-gray-50 dark:bg-white/5'}`}>
                    <s.icon size={13} className={s.danger ? 'text-red-500' : 'text-slate-400 dark:text-[#40455e]'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-semibold ${s.danger ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-[#c8ccdf]'}`}>{s.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{s.sub}</p>
                  </div>
                  <ChevronRight size={13} className={s.danger ? 'text-red-400' : 'text-slate-300 dark:text-[#40455e]'} />
                </div>
              ))}
            </div>
          </div>

          {/* Account & Subscription */}
          <div className="bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">Account & Subscription</h3>
            <p className="text-xs text-slate-400 dark:text-[#8e92ad] mt-0.5 mb-4">Manage your account and subscription details.</p>
            <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-sky-100 dark:border-sky-500/20 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-600 flex items-center justify-center shrink-0">
                  <Star size={14} className="text-white fill-white" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-[#8e92ad]">Current Plan</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">Premium Plan</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-cyan-600 text-white text-xs font-bold rounded-lg hover:bg-cyan-700 transition-colors whitespace-nowrap">Change Plan</button>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Billing History',   sub: 'View your billing history',      icon: History },
                { label: 'Payment Methods',   sub: 'Manage your payment methods',    icon: ShieldCheck },
                { label: 'Invoice Download',  sub: 'Download your invoices',         icon: Download },
              ].map(a => (
                <button key={a.label} className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-gray-100 dark:border-white/6 hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors">
                  <div className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-white/5 flex items-center justify-center shrink-0">
                    <a.icon size={13} className="text-slate-400 dark:text-[#40455e]" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-semibold text-slate-700 dark:text-[#c8ccdf]">{a.label}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#8e92ad]">{a.sub}</p>
                  </div>
                  <ChevronRight size={13} className="text-slate-300 dark:text-[#40455e] shrink-0" />
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
