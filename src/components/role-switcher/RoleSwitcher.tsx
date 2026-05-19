'use client';

import { useState } from 'react';

export type UserRole = 'student' | 'counselor' | 'parent' | 'mobile';

interface RoleSwitcherProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const ROLES = [
  {
    id: 'student',
    label: 'Student portal',
    subtitle: 'Next.js 15 · PWA',
    dot: '#2D5BE3',
  },
  {
    id: 'counselor',
    label: 'Counselor console',
    subtitle: 'Multi-portfolio · AI',
    dot: '#0891B2',
  },
  {
    id: 'parent',
    label: 'Parent view',
    subtitle: 'Read-only · Alerts',
    dot: '#7C3AED',
  },
 
] as const;

export function RoleSwitcher({ activeRole, onRoleChange }: RoleSwitcherProps) {
  return (
    <div className="bg-canvas border-b border-line">
      <div className="flex px-6">
        {ROLES.map((role) => (
          <button
            key={role.id}
            onClick={() => onRoleChange(role.id as UserRole)}
            className={`flex items-center gap-2 px-5 py-3 cursor-pointer border-b-[2.5px] transition-colors font-medium text-sm whitespace-nowrap ${
              activeRole === role.id
                ? 'border-brand text-white'
                : 'border-transparent text-ink-3 hover:text-ink-2'
            }`}
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: role.dot }}
            />
            <div className="text-left">
              <div className="text-sm font-medium">{role.label}</div>
              <div className="text-2xs text-ink-3">{role.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
