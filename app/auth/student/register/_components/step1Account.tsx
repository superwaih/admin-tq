import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { EyeIcon } from "lucide-react";
import Image from "next/image";

export default function Step1Account({ formData, updateForm, onNext }: any) {
  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="text-left">
        <h2 className="text-4xl font-serif text-[#1A1A1A] mb-2">Create your account</h2>
        <p className="text-gray-500 text-sm">Fill in your details to get started. Takes under 2 minutes.</p>
      </div>

      <div className="space-y-6">
        {/* Row 1: Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[11px] font-semibold text-gray-600 absolute -top-2.5 left-3 bg-white px-1 z-10">First name</label>
            <Input 
              className="h-12 border-gray-300 rounded-xl focus-visible:ring-blue-600 focus-visible:border-blue-600" 
              placeholder="Priya"
              value={formData.firstName}
              onChange={(e) => updateForm({ firstName: e.target.value })}
            />
          </div>
          <div className="relative">
            <label className="text-[11px] font-semibold text-gray-600 absolute -top-2.5 left-3 bg-white px-1 z-10">Last name</label>
            <Input 
              className="h-12 border-gray-300 rounded-xl focus-visible:ring-blue-600 focus-visible:border-blue-600" 
              placeholder="Mehta"
              value={formData.lastName}
              onChange={(e) => updateForm({ lastName: e.target.value })}
            />
          </div>
        </div>

        {/* Row 2: Email */}
        <div className="relative">
          <label className="text-[11px] font-semibold text-gray-600 absolute -top-2.5 left-3 bg-white px-1 z-10">Email address</label>
          <Input 
            type="email" 
            className="h-12 border-gray-300 rounded-xl focus-visible:ring-blue-600 focus-visible:border-blue-600" 
            placeholder="priya.mehta@email.com"
            value={formData.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          />
        </div>

        {/* Row 3: Password */}
        <div className="relative">
          <label className="text-[11px] font-semibold text-gray-600 absolute -top-2.5 left-3 bg-white px-1 z-10">Password</label>
          <div className="relative">
            <Input 
              type="password" 
              className="h-12 border-gray-300 rounded-xl pr-10 focus-visible:ring-blue-600 focus-visible:border-blue-600" 
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateForm({ password: e.target.value })}
            />
            <EyeIcon className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer hover:text-gray-600 transition-colors" />
          </div>
        </div>

        {/* Row 4: Province & Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label className="text-[11px] font-semibold text-gray-600 absolute -top-2.5 left-3 bg-white px-1 z-10">Province</label>
            <Input 
              className="h-12 border-gray-300 rounded-xl focus-visible:ring-blue-600 focus-visible:border-blue-600" 
              placeholder="Ontario (OUAC)"
              value={formData.province}
              onChange={(e) => updateForm({ province: e.target.value })}
            />
          </div>
          <div className="relative">
            <label className="text-[11px] font-semibold text-gray-600 absolute -top-2.5 left-3 bg-white px-1 z-10">Graduating year</label>
            <Input 
              className="h-12 border-gray-300 rounded-xl focus-visible:ring-blue-600 focus-visible:border-blue-600" 
              placeholder="2026"
              value={formData.gradYear}
              onChange={(e) => updateForm({ gradYear: e.target.value })}
            />
          </div>
        </div>

        {/* Consent */}
        <div className="flex items-center space-x-3 pt-2">
          <Checkbox id="tips" className="border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" />
          <label htmlFor="tips" className="text-xs text-gray-500 font-medium leading-none cursor-pointer">
            Send me study tips and deadline reminders (optional)
          </label>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button 
            onClick={onNext} 
            className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-base shadow-xl shadow-blue-600/20 transition-all"
          >
            Create Account & Continue
          </Button>
        </div>

        {/* Social Register */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-100"></span>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
            <span className="bg-white px-4 text-gray-400">or sign up with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="h-12 rounded-xl border-gray-200 text-xs font-bold gap-2 hover:bg-gray-50">
             <Image src="/google-icon.svg" width={16} height={16} alt="Google" /> Google
          </Button>
          <Button variant="outline" className="h-12 rounded-xl border-gray-200 text-xs font-bold gap-2 hover:bg-gray-50">
             <Image src="/apple-icon.svg" width={16} height={16} alt="Apple" /> Apple
          </Button>
        </div>

        <p className="text-center text-xs text-gray-400 font-medium pt-4">
          Already have an account? <a href="/auth" className="text-blue-600 font-bold hover:underline">Sign in →</a>
        </p>
      </div>
    </div>
  );
}