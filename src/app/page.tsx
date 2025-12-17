
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
  BrainCircuit,
  LineChart,
  Sparkles,
  GraduationCap
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
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      
      {/* --- LEFT SIDE: BRANDING (GAM IT Solutions) --- */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-purple-950 text-white relative overflow-hidden">
        
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-700 rounded-full blur-3xl opacity-15 -ml-20 -mb-20"></div>

        {/* Logo Area */}
        <div className="flex items-center gap-2 z-10">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
            <GraduationCap className="h-6 w-6 text-purple-200" />
          </div>
          <span className="text-xl font-bold tracking-wide">CampusConnect</span>
        </div>

        {/* Hero Text */}
        <div className="z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Experience the next generation of AI-driven education management.
          </h1>
          <p className="text-purple-200 text-lg">
            Personalized learning, automated administration, and seamless communication in one platform.
          </p>

          {/* Feature List */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-2 rounded-full border border-purple-700/50">
                <BrainCircuit className="h-5 w-5 text-purple-300" />
              </div>
              <span className="font-medium text-purple-100">Adaptive Learning Paths</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-2 rounded-full border border-purple-700/50">
                <LineChart className="h-5 w-5 text-pink-300" />
              </div>
              <span className="font-medium text-purple-100">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-900/50 p-2 rounded-full border border-purple-700/50">
                <Sparkles className="h-5 w-5 text-yellow-300" />
              </div>
              <span className="font-medium text-purple-100">AI-Powered Tutoring</span>
            </div>
          </div>
        </div>

        {/* Footer (Copyright) */}
        <div className="z-10 text-xs text-purple-300/60">
          © 2025 GAM IT Solutions. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          
          <div className="space-y-2 text-center lg:text-left">
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
                className="h-11 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-500">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="•••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-base font-semibold shadow-lg shadow-purple-200">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
            </Button>

          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <a href="#" className="font-semibold text-purple-700 hover:text-purple-600 hover:underline">
              Sign Up
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
