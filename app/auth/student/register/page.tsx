'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Chrome, Apple, Link as LinkIcon, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from '@/src/hooks/useAuth';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

export default function StudentRegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, loading, error } = useAuth();

  const features = [
    { title: "Live probability scores", desc: "For all target programs" },
    { title: "AI essay coach", desc: "AIF rubric scoring + human review" },
    { title: "MMI Simulator", desc: "8-station timed mock practice" },
    { title: "Strategy Advisor", desc: "Personalised weekly action plan" }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      return;
    }
    await register({ email, password, role: 'student' });
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ThemeToggle floating />
      {/* Left Sidebar - Branding */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0E14] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="text-xl font-bold mb-20 tracking-tight">AdmitIQ</div>
          <h1 className="text-5xl font-bold leading-tight mb-8">
            Your admissions <br /> co-pilot awaits.
          </h1>
          <p className="text-gray-400 mb-12">Sign up in seconds and start tracking your odds.</p>

          <div className="space-y-8">
            {features.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2" />
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px] space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">AdmitIQ</span>
              <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">✦ Student</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Create your account</h2>
            <p className="text-gray-500 text-sm">Free forever. Complete your profile after signup.</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase">Email address</label>
              <Input
                type="email"
                placeholder="priya.mehta@gmail.com"
                className="h-11"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-gray-400 uppercase">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  className="h-11 pr-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            <div className="flex items-center gap-2">
              <Checkbox
                id="terms"
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(Boolean(checked))}
                className="border-gray-300 data-[state=checked]:bg-blue-600"
              />
              <label htmlFor="terms" className="text-xs text-gray-500 italic">
                I agree to the <Link href="/terms" className="text-blue-600 underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Student Account'
              )}
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-[10px] text-gray-400 uppercase font-bold tracking-widest">or continue with</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="text-xs font-bold h-11 gap-2 border-gray-200">
              <Chrome className="w-4 h-4" /> Sign up with Google
            </Button>
            <Button variant="outline" className="text-xs font-bold h-11 gap-2 border-gray-200">
              <Apple className="w-4 h-4" /> Sign up with Apple
            </Button>
          </div>

          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl flex items-center gap-4 cursor-pointer hover:bg-blue-50 transition-colors">
            <div className="p-2 bg-white rounded-lg border border-blue-100">
              <LinkIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-900">Sign up with OUAC</p>
              <p className="text-[10px] text-blue-700/60 leading-tight">Ontario Universities Application Centre — auto-imports your grades</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account? <Link href="/auth/student" className="text-blue-600 font-bold">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}