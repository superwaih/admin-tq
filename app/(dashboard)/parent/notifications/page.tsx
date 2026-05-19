'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { PARENT_NOTIFICATIONS } from '@/src/lib/sample-data';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(PARENT_NOTIFICATIONS);
  function markRead(id: string) { setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n)); }
  function markAllRead() { setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))); }
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="p-5 flex flex-col gap-5 max-w-[700px]">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[18px] font-bold tracking-tight text-ink">Notifications</h1>
          <p className="text-xs text-ink-3 mt-0.5">Alerts about Priya&apos;s application milestones</p>
        </div>
        <div className="flex items-center gap-3">
          {unread > 0 && <span className="bg-rose text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unread} unread</span>}
          {unread > 0 && <button onClick={markAllRead} className="text-xs text-brand font-semibold hover:text-brand-dark transition-colors">Mark all read</button>}
        </div>
      </div>
      <div className="bg-surface border border-[var(--line)] rounded-r-lg rounded-b-lg shadow-card overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={24} className="text-ink-4 mx-auto mb-3" />
            <div className="text-sm font-semibold text-ink">No notifications</div>
          </div>
        ) : (
          <div className="divide-y divide-[var(--line)]">
            {notifications.map((n) => (
              <div key={n.id} className={cn('px-4 py-4 flex gap-3 transition-colors cursor-pointer', !n.read ? 'bg-brand/[0.025] hover:bg-brand/[0.04]' : 'hover:bg-surface-2')} onClick={() => markRead(n.id)}>
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.color, opacity: n.read ? 0.4 : 1 }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <span className={cn('text-sm text-ink', !n.read ? 'font-bold' : 'font-semibold')}>{n.title}</span>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-brand flex-shrink-0 mt-1" />}
                  </div>
                  <p className="text-xs text-ink-3 leading-relaxed mb-1.5">{n.body}</p>
                  <div className="text-[10px] text-ink-4">{n.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
