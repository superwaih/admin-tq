'use client';

import { useState } from 'react';
import { Search, Phone, Video, Star, MoreHorizontal, Send, Paperclip, Smile, Image, ChevronRight } from 'lucide-react';

const CONVERSATIONS = [
  { name: 'Amina Yusuf',   tag: 'Student', lastMsg: 'Thank you for the detailed feedback...', time: '10:30 AM', unread: 2, initials: 'AY', color: 'bg-yellow-400' },
  { name: 'Daniel Musa',   tag: 'Student', lastMsg: 'Can we reschedule tomorrow\'s...',      time: '9:15 AM',  unread: 1, initials: 'DM', color: 'bg-blue-500' },
  { name: 'Fatima Bello',  tag: 'Student', lastMsg: 'Please share the reading materials...',  time: 'Yesterday', unread: 0, initials: 'FB', color: 'bg-pink-500' },
  { name: 'Computer Science D', tag: 'Group', lastMsg: 'You are invited to our upcoming...', time: 'Yesterday', unread: 0, initials: 'CS', color: 'bg-teal-500' },
  { name: 'Joshua Adeyemi', tag: 'Student', lastMsg: 'Looking forward to our session...', time: 'May 24', unread: 0, initials: 'JA', color: 'bg-teal-500' },
  { name: 'Parent: Mr. Okafor', tag: 'Parent', lastMsg: "Thank you for the update on Maryam's...", time: 'May 23', unread: 0, initials: 'MO', color: 'bg-orange-400' },
  { name: 'Emily Davis',   tag: 'Student', lastMsg: 'The resources you shared were...', time: 'May 22', unread: 0, initials: 'ED', color: 'bg-pink-400' },
];

const CHAT_MSGS = [
  { from: 'student', text: "Hello Dr. Johnson, Thank you for reviewing my essay. The feedback was incredibly helpful. I have made the changes you suggested. Could you please take a look again when you have a moment?", time: '10:15 AM', date: 'May 28, 2025' },
  { from: 'counselor', text: "Hi Amina, I'm glad you found the feedback helpful! I've reviewed your updated essay, and it's much stronger now. Great job on the improvements 👏 Let's schedule a quick call to discuss your next steps.", time: '10:25 AM', date: null },
  { from: 'student', text: "That would be great! I'm available tomorrow after 3 PM.", time: '10:28 AM', date: null },
  { from: 'system', text: 'New Messages', time: '', date: null },
  { from: 'student', text: 'Also, could you recommend some additional resources for the "Overcoming Challenges" topic?', time: '10:30 AM', date: null },
];

const SHARED_FILES = [
  { name: 'Essay_Draft_v2.pdf', size: '1.2 MB', date: 'May 28, 2025', icon: '📄', color: 'text-red-500' },
  { name: 'Personal_Statement.docx', size: '856 KB', date: 'May 20, 2025', icon: '📝', color: 'text-blue-500' },
  { name: 'College_List.xlsx', size: '120 KB', date: 'May 18, 2025', icon: '📊', color: 'text-green-500' },
];

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(0);
  const [message, setMessage] = useState('');
  const active = CONVERSATIONS[activeConv];

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Messages</h1>
        <p className="text-sm text-slate-500 dark:text-[#8e92ad] mt-1">Communicate with students, parents, and your team.</p>
      </div>

        <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_260px] gap-0 bg-white dark:bg-[#161a27] rounded-2xl border border-gray-100 dark:border-white/6 shadow-sm overflow-hidden">

          {/* Left: conversation list */}
          <div className="border-r border-gray-100 dark:border-white/5 flex flex-col" style={{ height: '680px' }}>
            <div className="p-4 border-b border-gray-50 dark:border-white/5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-bold text-slate-800 dark:text-white">Messages</h2>
                <button className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-semibold hover:bg-cyan-700 transition-colors">
                  + New
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#8e92ad] mb-3">Communicate with students, parents, and your team.</p>
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Search messages..." className="w-full h-8 pl-8 pr-3 text-xs bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/6 rounded-xl text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#40455e] outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400/50 transition-all" />
              </div>
              <div className="flex items-center gap-1.5 mt-3">
                {['Inbox','Starred','Sent','Archive'].map((t, i) => (
                  <button key={t} className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors ${i === 0 ? 'text-cyan-600 bg-cyan-50 dark:bg-cyan-500/15' : 'text-slate-400 dark:text-[#8e92ad] hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                    {t}{i === 0 && <span className="ml-1 bg-cyan-600 text-white text-[9px] px-1 py-0.5 rounded-full">3</span>}
                  </button>
                ))}
              </div>
              <button className="mt-2 flex items-center justify-between w-full text-[11px] text-slate-500 dark:text-[#8e92ad] px-1">
                <span>All Conversations</span>
                <span>≡</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 dark:divide-white/[0.04]">
              {CONVERSATIONS.map((c, i) => (
                <button key={i} onClick={() => setActiveConv(i)} className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.02] ${activeConv === i ? 'bg-cyan-50 dark:bg-cyan-500/10' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0 relative`}>
                      {c.initials}
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-[#161a27]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{c.name}</p>
                        <span className="text-[9px] text-slate-400 dark:text-[#40455e] shrink-0">{c.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-[#8e92ad] truncate mt-0.5">{c.lastMsg}</p>
                    </div>
                    {c.unread > 0 && (
                      <span className="w-5 h-5 bg-cyan-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center shrink-0">{c.unread}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Middle: chat */}
          <div className="flex flex-col border-r border-gray-100 dark:border-white/5" style={{ height: '680px' }}>
            {/* Chat header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${active.color} flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>{active.initials}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{active.name}</p>
                  <p className="text-[10px] text-emerald-500">{active.tag} · {active.tag === 'Student' ? 'amina.yusuf@email.com' : 'group'}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Phone size={15} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Video size={15} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><Star size={15} /></button>
                <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/8 rounded-lg transition-colors"><MoreHorizontal size={15} /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {CHAT_MSGS.map((m, i) => {
                if (m.from === 'system') return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
                    <span className="text-[10px] text-slate-400 dark:text-[#40455e] font-medium">{m.text}</span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
                  </div>
                );
                const isMe = m.from === 'counselor';
                return (
                  <div key={i}>
                    {m.date && <p className="text-[10px] text-center text-slate-400 dark:text-[#40455e] mb-3">{m.date}</p>}
                    <div className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                      {!isMe && <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center text-white text-[10px] font-bold shrink-0">AY</div>}
                      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${isMe ? 'bg-cyan-600 text-white rounded-br-sm' : 'bg-gray-100 dark:bg-white/8 text-slate-700 dark:text-[#c8ccdf] rounded-bl-sm'}`}>
                        {m.text}
                        <p className={`text-[9px] mt-1 ${isMe ? 'text-sky-200' : 'text-slate-400 dark:text-[#40455e]'}`}>{m.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input */}
            <div className="px-5 py-3.5 border-t border-gray-50 dark:border-white/5">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/8 rounded-xl px-3 py-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm bg-transparent text-slate-700 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#40455e] outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Paperclip size={15} /></button>
                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Image size={15} /></button>
                  <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"><Smile size={15} /></button>
                  <button className="p-1.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"><Send size={14} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: details panel */}
          <div className="flex flex-col">
            <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white">Details</h3>
              <button className="text-xs font-semibold text-cyan-600">Edit</button>
            </div>
            {/* Profile */}
            <div className="px-4 py-3 flex flex-col items-center border-b border-gray-50 dark:border-white/5 shrink-0">
              <div className={`w-12 h-12 rounded-2xl ${active.color} flex items-center justify-center text-white text-sm font-bold mb-2`}>{active.initials}</div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{active.name}</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 mt-1">{active.tag}</span>
            </div>
            {/* Info fields — 2-column grid */}
            <div className="px-4 py-3 border-b border-gray-50 dark:border-white/5 shrink-0">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                {[
                  { label: 'NAME',       value: 'Amina Yusuf' },
                  { label: 'EMAIL',      value: 'amina.yusuf@email.com' },
                  { label: 'PHONE',      value: '+1 (555) 123-4567' },
                  { label: 'STUDENT ID', value: 'STU-2025-0789' },
                  { label: 'GRADE',      value: '12th Grade' },
                  { label: 'COUNSELOR',  value: 'Dr. Sarah Johnson' },
                ].map(f => (
                  <div key={f.label}>
                    <p className="text-[9px] font-bold text-slate-400 dark:text-[#40455e] uppercase tracking-widest">{f.label}</p>
                    <p className="text-[10px] text-slate-700 dark:text-[#c8ccdf] mt-0.5 leading-tight truncate">{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Shared Files */}
            <div className="px-4 py-2.5 border-b border-gray-50 dark:border-white/5 shrink-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold text-slate-800 dark:text-white">Shared Files</p>
                <button className="text-[10px] font-semibold text-cyan-600 flex items-center gap-0.5">View All <ChevronRight size={10} /></button>
              </div>
              <div className="space-y-1.5">
                {SHARED_FILES.map((f, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-sm">{f.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-semibold text-slate-700 dark:text-[#c8ccdf] truncate">{f.name}</p>
                      <p className="text-[9px] text-slate-400 dark:text-[#40455e]">{f.size} · {f.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Conversation info */}
            <div className="px-4 py-2.5 shrink-0">
              <p className="font-bold text-slate-800 dark:text-white text-xs mb-2">Conversation Info</p>
              <div className="grid grid-cols-3 gap-1 mb-2">
                {[['Started','May 20'],['Last Msg','10:30 AM'],['Total','12 msgs']].map(([l,v]) => (
                  <div key={l} className="bg-gray-50 dark:bg-white/5 rounded-lg px-2 py-1.5 text-center">
                    <p className="text-[9px] text-slate-400 dark:text-[#40455e]">{l}</p>
                    <p className="text-[10px] font-bold text-slate-700 dark:text-[#c8ccdf] leading-tight">{v}</p>
                  </div>
                ))}
              </div>
              <button className="w-full text-center text-xs font-bold text-red-500 hover:text-red-600 transition-colors py-1">Archive Conversation</button>
            </div>
          </div>
        </div>
    </div>
  );
}
