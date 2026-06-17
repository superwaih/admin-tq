'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useAuth } from '@/src/hooks/useAuth';
import { Role } from '@/src/types/auth';
import { AuthService } from '@/src/services/authService'; // Direct import for resend
import ThemeToggle from '@/src/components/shared/ThemeToggle';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const { submitOtp, error, setError, loading } = useAuth();
  
  const email = searchParams.get('email') || '';
  const role = (searchParams.get('role') as Role) || 'student';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(45);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer logic for resending code
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) return;
    await submitOtp(email, code, role);
  };

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return;
    
    setIsResending(true);
    try {
      // Assuming your backend has a resend endpoint or re-uses register
      // Replace with your actual resend method if different
      await AuthService.forgotPassword(email); 
      setResendTimer(45);
      setError(null);
    } catch (err: any) {
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center p-6">
      <ThemeToggle floating />
      <div className="w-full max-w-[440px] bg-white rounded-[32px] border border-gray-100 shadow-xl p-12 text-center space-y-8">
        
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Verify your email</h2>
          <p className="text-gray-500 text-sm">
            We&apos;ve sent a 6-digit verification code to <br /> 
            <span className="font-bold text-slate-900">{email}</span>
          </p>
        </div>

        <div className="flex justify-between gap-2">
          {otp.map((digit, i) => (
            <input
              key={i}
              // FIXED: Callback ref wrapped in braces to return void
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-14 border-2 border-gray-100 rounded-xl text-center font-bold text-xl focus:border-blue-600 focus:ring-0 outline-none transition-colors"
            />
          ))}
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <Button 
          onClick={handleVerify}
          disabled={loading || otp.some(d => d === '')}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify and Continue'}
        </Button>

        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Didn&apos;t receive a code?</p>
          <button 
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className="text-sm font-bold text-blue-600 hover:underline disabled:text-gray-300 disabled:no-underline"
          >
            {isResending ? "Sending..." : resendTimer > 0 ? `Resend Code (0:${resendTimer.toString().padStart(2, '0')})` : "Resend Code"}
          </button>
          <br />
          <button className="text-xs text-gray-400 underline">Check your spam folder</button>
        </div>
      </div>
    </div>
  );
}