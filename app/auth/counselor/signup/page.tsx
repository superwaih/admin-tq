'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/src/hooks/useAuth';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

export default function CounselorSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, loading, error } = useAuth();

  const benefits = [
    {
      title: "Full cohort management",
      desc: "Monitor all students in one place",
      icon: <ShieldCheck className="w-4 h-4 text-cyan-500" />
    },
    {
      title: "Risk-Flags & Analytics",
      desc: "Identify students falling behind",
      icon: <ShieldCheck className="w-4 h-4 text-cyan-500" />
    },
    {
      title: "Essay Review Queue",
      desc: "AI-pre-scored AIF and personal statements",
      icon: <ShieldCheck className="w-4 h-4 text-cyan-500" />
    },
    {
      title: "FERPA compliant",
      desc: "Enterprise-grade data security",
      icon: <ShieldCheck className="w-4 h-4 text-cyan-500" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      return;
    }
    await register({ email, password, role: 'counselor' });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ThemeToggle floating />
      {/* Left Sidebar - Value Proposition */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0E14] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="text-xl font-bold mb-20 tracking-tight">AdmitIQ</div>
          <h1 className="text-5xl font-bold leading-tight mb-8 font-serif">
            Built for school <br /> counselors.
          </h1>
          <p className="text-gray-400 mb-12 max-w-md">
            Empower your staff with AI-driven insights to manage your students&apos; admissions journey with precision.
          </p>

          <div className="space-y-8">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1.5">{b.icon}</div>
                <div>
                  <p className="text-sm font-bold text-white">{b.title}</p>
                  <p className="text-[11px] text-gray-400">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-[520px] space-y-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AdmitIQ</span>
              <span className="bg-cyan-50 text-cyan-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">✦ Counselor</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create counselor account</h2>
            <p className="text-gray-500 text-sm italic">Free for educators. Complete your profile after signup.</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">School email address</label>
              <Input
                type="email"
                placeholder="sarah.kim@westview.on.ca"
                required
                className="h-12 border-gray-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  required
                  className="h-12 pr-11 border-gray-200"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((state) => !state)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-900"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2 py-1">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
                className="border-gray-300 data-[state=checked]:bg-cyan-600"
              />
              <label htmlFor="terms" className="text-xs font-medium text-gray-600 italic">
                I agree to the <Link href="/terms" className="text-cyan-600 underline">Terms of Service</Link> and <Link href="/privacy" className="text-cyan-600 underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full h-12 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm shadow-lg shadow-cyan-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Counselor Account'
              )}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-gray-400">or continue with</span>
            </div>
          </div>

          <Button variant="outline" className="w-full text-xs font-bold h-12 gap-2 border-gray-200">
            <ShieldCheck className="w-4 h-4" /> Sign up with Google Workspace (school account)
          </Button>

          <p className="text-center text-xs text-gray-400">
            Already have an account? <Link href="/auth/counselor" className="text-cyan-600 font-bold">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}