import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function average(nums: number[]): number {
  if (nums.length === 0) return 0;
  return nums.reduce((sum, n) => sum + n, 0) / nums.length;
}

export function top6Average(grades: number[]): number {
  const sorted = [...grades].sort((a, b) => b - a);
  const top6 = sorted.slice(0, 6);
  return average(top6);
}

export function probabilityColor(prob: number): 'emerald' | 'saffron' | 'rose' {
  if (prob >= 70) return 'emerald';
  if (prob >= 40) return 'saffron';
  return 'rose';
}

export function riskLevel(prob: number): 'hi' | 'med' | 'lo' {
  if (prob >= 70) return 'hi';
  if (prob >= 40) return 'med';
  return 'lo';
}

export function formatCountdown(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
