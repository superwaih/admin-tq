'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/src/hooks/useAuth';
import { AuthService } from '@/src/services/authService';
import ThemeToggle from '@/src/components/shared/ThemeToggle';

const parentFeatures = [
  { title: "Live probability tracker", desc: "See odds across all programs" },
  { title: "Milestones & deadlines", desc: "Never miss an important date" },
  { title: "Financial aid summary", desc: "OSAP, bursaries, scholarships" },
  { title: "Privacy first", desc: "Essays and AI chat stay private" }
];

export default function ParentOnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    province: '',
    student_email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authLoading) {
        throw new Error('Loading user data, please wait...');
      }

      if (!user?.id) {
        throw new Error('User not authenticated. Please try logging in again.');
      }

      await AuthService.updateUser(user.id, formData);

      // Redirect to parent dashboard
      router.push('/parent');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <ThemeToggle floating />
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0E14] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="text-xl font-bold mb-20 tracking-tight">AdmitIQ</div>
          <h1 className="text-5xl font-bold leading-tight mb-8 font-serif">
            Complete your <br /> profile.
          </h1>
          <p className="text-gray-400 mb-12">Just a few details to get started.</p>

          <div className="space-y-8">
            {parentFeatures.map((f, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2" />
                <div>
                  <p className="text-sm font-bold">{f.title}</p>
                  <p className="text-xs text-gray-400">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-[450px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Complete your profile</h2>
            <p className="text-gray-500 text-sm">Help us personalize your experience.</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          {authLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading your account...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase">First name</label>
                <Input
                  placeholder="Mary"
                  className="h-11"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Last name</label>
                <Input
                  placeholder="Roberts"
                  className="h-11"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
              </div>
            </div>

            {/* Province */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">Province</label>
              <Input
                placeholder="Ontario"
                className="h-11"
                value={formData.province}
                onChange={(e) => handleChange('province', e.target.value)}
              />
            </div>

            {/* Student Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">Student's email address</label>
              <Input
                type="email"
                placeholder="student@email.com"
                className="h-11"
                value={formData.student_email}
                onChange={(e) => handleChange('student_email', e.target.value)}
              />
              <p className="text-xs text-gray-400 pt-1">We'll use this to connect you with your student's account</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/parent')}
                className="flex-1 h-12 rounded-lg"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                {loading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}