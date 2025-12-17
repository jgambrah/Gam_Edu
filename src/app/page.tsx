
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase/client-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  GraduationCap,
  Calculator,
  Banknote,
  UserCog,
  BrainCircuit,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Signing you in..." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Login Error:", error);
      let msg = "Invalid credentials.";
      if (error.code === 'auth/user-not-found') msg = "No user found with this email.";
      if (error.code === 'auth/wrong-password') msg = "Incorrect password.";
      if (error.code === 'auth/too-many-requests') msg = "Too many attempts. Try again later.";

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: msg
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden md:flex md:h-[750px]">
          
          {/* --- LEFT SIDE: BRANDING --- */}
          <div className="w-full md:w-1/2 flex flex-col justify-between p-8 lg:p-12 bg-gradient-to-br from-indigo-600 to-purple-700 text-white relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/30 rounded-full blur-3xl -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl -ml-20 -mb-20"></div>

            <div className="flex items-center gap-3 z-10">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                <GraduationCap className="h-8 w-8 text-purple-100" />
              </div>
              <span className="text-2xl font-bold tracking-wide">CampusConnect</span>
            </div>

            <div className="z-10 max-w-md space-y-6">
              <h1 className="text-4xl font-bold leading-tight">
                Experience the next generation of AI-driven education management.
              </h1>
              <p className="text-purple-200 text-lg">
                Personalized learning, automated administration, and seamless communication in one platform.
              </p>
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full border border-white/20"><BrainCircuit className="h-5 w-5 text-green-200" /></div>
                  <span className="font-medium">AI-Powered Tutoring & Learning Paths</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full border border-white/20"><Calculator className="h-5 w-5 text-purple-200" /></div>
                  <span className="font-medium">Automated Payroll & Tax Calculation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full border border-white/20"><Banknote className="h-5 w-5 text-pink-200" /></div>
                  <span className="font-medium">Integrated Student Billing & Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-full border border-white/20"><UserCog className="h-5 w-5 text-yellow-200" /></div>
                  <span className="font-medium">HR & Staff Leave Management</span>
                </div>
              </div>
            </div>

            <div className="z-10 text-xs text-purple-300/80">
              © {new Date().getFullYear()} GAM IT Solutions. All rights reserved.
            </div>
          </div>

          {/* --- RIGHT SIDE: LOGIN FORM --- */}
          <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
            <div className="w-full max-w-sm">
              <div className="space-y-2 text-center md:text-left mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
                <p className="text-slate-500">Enter your credentials to access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@school.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password">Password</Label>
                    <a href="/password-reset" className="text-sm font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
                  </div>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="•••••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 text-base"
                  />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-lg font-semibold shadow-lg shadow-purple-200">
                  {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
                </Button>
              </form>
              
              <div className="text-center text-sm mt-8">
                <span className="text-slate-500">Don't have an account? </span>
                <a href="#" className="font-semibold text-purple-700 hover:text-purple-600 hover:underline">
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
