'use client';

import { useState, ReactNode } from 'react';
import { RoleSwitcher, type UserRole } from './RoleSwitcher';

interface RoleLayoutProps {
  children: ReactNode;
}

export function RoleLayout({ children }: RoleLayoutProps) {
  const [activeRole, setActiveRole] = useState<UserRole>('student');

  return (
    <div className="flex flex-col h-screen bg-canvas">
      <div className="flex-shrink-0 border-b border-line bg-canvas">
        <div className="flex items-center gap-3 px-6 py-3 border-b border-line h-14">
          <div className="text-sm font-bold tracking-tight">
            Admit<span className="text-brand-mid">IQ</span>
          </div>
          <div className="w-px h-4 bg-line-2" />
          <span className="text-xs text-ink-3">Dashboard</span>
        </div>
        <RoleSwitcher activeRole={activeRole} onRoleChange={setActiveRole} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
