
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { initializeFirebase } from '@/firebase/client-provider'; 
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
  const { auth } = initializeFirebase() || {};
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth) {
        toast({
            variant: "destructive",
            title: "Initialization Error",
            description: "Firebase is not ready. Please refresh."
        });
        setIsLoading(false);
        return;
    }

    try {
      // 1. Authenticate against existing Firebase Users
      await signInWithEmailAndPassword(auth, email, password);
      
      // 2. Success - Redirect to Dashboard
      // The RoleGuard inside /dashboard will handle permissions now.
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
    <div className="min-h-screen w-full flex">
      
      {/* --- LEFT SIDE: BRANDING & MARKETING --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-between p-12 relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20 -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600 rounded-full blur-3xl opacity-10 -ml-20 -mb-20"></div>

        {/* Logo Area */}
        <div className="flex items-center gap-2 z-10">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide">CampusConnect</span>
        </div>

        {/* Hero Text */}
        <div className="z-10 max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Experience the next generation of AI-driven education.
          </h1>
          <p className="text-slate-400 text-lg">
            Personalized learning, automated administration, and seamless communication in one platform.
          </p>

          {/* Feature List */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-full"><BrainCircuit className="h-5 w-5 text-indigo-400" /></div>
              <span className="font-medium">Adaptive Learning Paths</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-full"><LineChart className="h-5 w-5 text-pink-400" /></div>
              <span className="font-medium">Real-time Analytics</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-slate-800 p-2 rounded-full"><Sparkles className="h-5 w-5 text-yellow-400" /></div>
              <span className="font-medium">AI-Powered Tutoring</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="z-10 text-xs text-slate-500">
          © 2025 Sunnyside Academy. All rights reserved.
        </div>
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
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
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
              </div>
              <Input 
                id="password" 
                type="password" 
                placeholder="•••••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-base">
              {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Sign In"}
            </Button>

          </form>

          <div className="text-center text-sm">
            <span className="text-slate-500">Don't have an account? </span>
            <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline">
              Sign Up
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
