'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from '@/src/hooks/useAuth';
import { useState } from 'react';

export default function ParentSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      return;
    }
    await register({ email, password, role: 'parent' });
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0E14] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="text-xl font-bold mb-20 tracking-tight">AdmitIQ</div>
          <h1 className="text-5xl font-bold leading-tight mb-8 font-serif">
            Connected to <br /> your student&apos;s journey.
          </h1>

          <div className="space-y-8">
            {[
              { t: "Live probability tracker", d: "See odds across all programs" },
              { t: "Milestones & deadlines", d: "Never miss an important date" },
              { t: "Financial aid summary", d: "OSAP, bursaries, scholarships" },
              { t: "Privacy first", d: "Essays and AI chat stay private" }
            ].map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                <div>
                  <p className="text-sm font-bold">{f.t}</p>
                  <p className="text-xs text-gray-400">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">AdmitIQ</span>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1 uppercase">
                ✦ Parent
              </span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900">Create parent account</h2>
            <p className="text-gray-500 font-medium">Free for life. Complete your profile after signup.</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email address</label>
              <Input
                type="email"
                placeholder="m.roberts@outlook.com"
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
                className="border-gray-300 data-[state=checked]:bg-purple-600"
              />
              <label htmlFor="terms" className="text-xs font-medium text-gray-600 italic">
                I agree to the <Link href="/terms" className="text-purple-600 underline">Terms of Service</Link> and <Link href="/privacy" className="text-purple-600 underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading || !acceptTerms}
              className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-lg shadow-purple-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                'Create Parent Account'
              )}
            </Button>
          </form>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-gray-400">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-12 border-gray-200 font-bold text-xs">Google</Button>
            <Button variant="outline" className="h-12 border-gray-200 font-bold text-xs">Apple</Button>
          </div>

          <p className="text-center text-sm text-gray-500 font-medium pt-4">
            Already have an account? <Link href="/auth/parent" className="text-purple-600 font-bold hover:underline">Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}