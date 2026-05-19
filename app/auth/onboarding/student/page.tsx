'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/src/hooks/useAuth';
import { AuthService } from '@/src/services/authService';

const studentFeatures = [
  { title: "Live probability scores", desc: "See your real-time odds for every program" },
  { title: "School list recommendations", desc: "AI-powered matches based on your profile" },
  { title: "Grade tracking", desc: "Monitor your academic progress in real-time" },
  { title: "Essay preparation", desc: "Get AI coaching on your personal statements" }
];

export default function StudentOnboardingPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    province: '',
    school_name: '',
    grad_year: '',
    counselor_code: '',
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

      // Redirect to student dashboard
      router.push('/student');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="hidden lg:flex w-[40%] bg-[#0B0E14] text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="text-xl font-bold mb-20 tracking-tight">AdmitIQ</div>
          <h1 className="text-5xl font-bold leading-tight mb-8 font-serif">
            Complete your <br /> profile.
          </h1>
          <p className="text-gray-400 mb-12">Just a few details to unlock all the tools you need.</p>

          <div className="space-y-8">
            {studentFeatures.map((f, i) => (
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
      <div className="flex-1 flex items-center justify-center p-8 lg:p-20">
        <div className="w-full max-w-[450px] space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Complete your profile</h2>
            <p className="text-gray-500 text-sm">This helps us personalize your recommendations.</p>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg">
              {error}
            </div>
          )}

          {authLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
                  placeholder="Priya"
                  className="h-11"
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Last name</label>
                <Input
                  placeholder="Mehta"
                  className="h-11"
                  value={formData.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                />
              </div>
            </div>

            {/* Province & School */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Province</label>
                <Input
                  placeholder="Ontario"
                  className="h-11"
                  value={formData.province}
                  onChange={(e) => handleChange('province', e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-400 uppercase">Grad year</label>
                <Input
                  placeholder="2026"
                  className="h-11"
                  value={formData.grad_year}
                  onChange={(e) => handleChange('grad_year', e.target.value)}
                />
              </div>
            </div>

            {/* School Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">School name</label>
              <Input
                placeholder="Your high school"
                className="h-11"
                value={formData.school_name}
                onChange={(e) => handleChange('school_name', e.target.value)}
              />
            </div>

            {/* Counselor Code */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase">Counselor code (optional)</label>
              <Input
                placeholder="Leave blank if you don't have one"
                className="h-11"
                value={formData.counselor_code}
                onChange={(e) => handleChange('counselor_code', e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/student')}
                className="flex-1 h-12 rounded-lg"
              >
                Skip for now
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 rounded-lg"
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