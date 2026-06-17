'use client';

/**
 * Shared client-side store for counselling/mentoring session payment requests.
 *
 * In this demo there is no persistence backend, so a student's booking and the
 * parent/guardian who pays for it live in the same browser. We use localStorage
 * as the shared channel: the student booking flow CREATES a pending request, the
 * parent dashboard PAYS it, and the student's booking calendar only renders a
 * session once its request is `paid`.
 *
 * Reactivity is exposed through `useSessionPaymentRequests()` (built on
 * useSyncExternalStore) so every mounted dashboard updates the moment the store
 * changes — across components and across browser tabs (via the `storage` event).
 */

import { useSyncExternalStore } from 'react';

export type SessionRequestStatus = 'pending' | 'paid';

export interface SessionPaymentRequest {
  id: string;
  counselorId: string;
  counselorName: string;
  counselorTitle: string;
  avatar: string;        // mentor initials, e.g. "DB"
  gradient: string;      // tailwind gradient classes for the avatar tile
  type: string;          // consultation type label, e.g. "Consultation"
  dateLabel: string;     // human date, e.g. "June 18, 2026"
  dateISO: string;       // ISO date used for calendar placement
  time: string;          // "09:00 AM"
  startHour: number;     // 9.0 (24h, decimal minutes)
  price: number;         // CAD; 0 = free
  notes?: string;
  studentName: string;   // who requested the session
  status: SessionRequestStatus;
  createdAt: number;
  paidAt?: number;
  paidVia?: string;
}

const KEY = 'aiq_session_payment_requests';
const EVENT = 'aiq:session-payments-changed';

const EMPTY: SessionPaymentRequest[] = [];

// Cache so getSnapshot() returns a stable reference between unrelated renders
// (useSyncExternalStore will loop if the snapshot identity changes every call).
let cache: SessionPaymentRequest[] = EMPTY;
let cacheRaw: string | null = null;

function refreshCache(): void {
  if (typeof window === 'undefined') {
    cache = EMPTY;
    cacheRaw = null;
    return;
  }
  const raw = window.localStorage.getItem(KEY);
  if (raw === cacheRaw) return;
  cacheRaw = raw;
  try {
    cache = raw ? (JSON.parse(raw) as SessionPaymentRequest[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
}

function persist(list: SessionPaymentRequest[]): void {
  if (typeof window === 'undefined') return;
  const raw = JSON.stringify(list);
  window.localStorage.setItem(KEY, raw);
  cacheRaw = raw;
  cache = list;
  window.dispatchEvent(new Event(EVENT));
}

export function getRequests(): SessionPaymentRequest[] {
  refreshCache();
  return cache;
}

export function parseStartHour(time: string): number {
  // "09:00 AM" / "01:30 PM" -> 9 / 13.5
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!m) return 9;
  let h = parseInt(m[1], 10) % 12;
  const min = parseInt(m[2], 10);
  const ampm = m[3]?.toUpperCase();
  if (ampm === 'PM') h += 12;
  return h + min / 60;
}

export function addRequest(
  input: Omit<SessionPaymentRequest, 'id' | 'status' | 'createdAt'>,
): SessionPaymentRequest {
  const req: SessionPaymentRequest = {
    ...input,
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'pending',
    createdAt: Date.now(),
  };
  persist([req, ...getRequests()]);
  return req;
}

export function getRequest(id: string): SessionPaymentRequest | undefined {
  return getRequests().find(r => r.id === id);
}

export function markPaid(id: string, paidVia: string): void {
  const next = getRequests().map(r =>
    r.id === id ? { ...r, status: 'paid' as const, paidVia, paidAt: Date.now() } : r,
  );
  persist(next);
}

export function removeRequest(id: string): void {
  persist(getRequests().filter(r => r.id !== id));
}

function subscribe(cb: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => cb();
  window.addEventListener(EVENT, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(EVENT, handler);
    window.removeEventListener('storage', handler);
  };
}

function getServerSnapshot(): SessionPaymentRequest[] {
  return EMPTY;
}

export function useSessionPaymentRequests(): SessionPaymentRequest[] {
  return useSyncExternalStore(subscribe, getRequests, getServerSnapshot);
}
