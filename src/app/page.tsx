
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, Lock, Mail, BrainCircuit, Banknote, CreditCard, UserCog } from 'lucide-react';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user && !isUserLoading) {
      router.replace('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firebase is not initialized. Please refresh.",
        });
        return;
    }
    setIsLoading(true);
    try {
      await initiateEmailSignIn(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
      // The useEffect above will handle the redirect
    } catch (error: any) {
      console.error("Login Error:", error);
      let errorMessage = "An unknown error occurred.";
      if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                errorMessage = "Invalid email or password. Please try again.";
                break;
            case 'auth/too-many-requests':
                errorMessage = "Too many login attempts. Please try again later.";
                break;
        }
      }
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isUserLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="grid w-full max-w-6xl grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl shadow-2xl bg-white">
        {/* Left Column: Feature Highlight */}
        <div className="bg-indigo-700 p-12 text-white flex-col justify-between hidden md:flex">
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <GraduationCap className="h-10 w-10 text-indigo-300" />
                    <h1 className="text-3xl font-bold">GAM Edu</h1>
                </div>
                <h2 className="text-2xl font-semibold leading-tight">Experience the next generation of AI-driven education management.</h2>
                <p className="mt-2 text-indigo-200">Personalized learning, automated administration, and seamless communication in one platform.</p>
                <ul className="mt-8 space-y-4">
                    <li className="flex items-start gap-3"><BrainCircuit className="h-5 w-5 text-indigo-300 mt-1 flex-shrink-0" /><span><span className="font-semibold">AI-Powered Tutoring</span> & Learning Paths</span></li>
                    <li className="flex items-start gap-3"><Banknote className="h-5 w-5 text-indigo-300 mt-1 flex-shrink-0" /><span><span className="font-semibold">Automated Payroll</span> & Tax Calculation</span></li>
                    <li className="flex items-start gap-3"><CreditCard className="h-5 w-5 text-indigo-300 mt-1 flex-shrink-0" /><span><span className="font-semibold">Integrated Student Billing</span> & Payments</span></li>
                    <li className="flex items-start gap-3"><UserCog className="h-5 w-5 text-indigo-300 mt-1 flex-shrink-0" /><span><span className="font-semibold">HR & Staff</span> Leave Management</span></li>
                </ul>
            </div>
            <p className="text-xs text-indigo-300 mt-12">© 2025 GAM IT Solutions. All rights reserved.</p>
        </div>

        {/* Right Column: Login Form */}
        <div className="p-12 flex flex-col justify-center">
             <Card className="border-none shadow-none">
                <CardHeader className="text-left p-0 mb-8">
                    <CardTitle className="text-3xl font-bold text-slate-900">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your account</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 h-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        />
                    </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link href="/password-reset" className="text-sm font-medium text-indigo-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                className="pl-10 h-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-12 bg-indigo-700 hover:bg-indigo-800" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Sign In
                    </Button>
                    <div className="mt-6 text-center text-sm">
                      <p className="text-slate-600">
                        Is your school not registered yet?{' '}
                        <Link href="/register-school" className="text-blue-600 font-bold hover:underline">
                          Register your School
                        </Link>
                      </p>
                    </div>
                </form>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
