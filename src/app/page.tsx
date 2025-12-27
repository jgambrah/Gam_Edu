
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, GraduationCap, Lock, Mail } from 'lucide-react';
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

  // Show a loading state while checking auth status
  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Prevent rendering form if user is logged in and redirect is happening
  if (user) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary-foreground p-3 rounded-full border mb-4 inline-block">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Sign in to your CampusConnect account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/password-reset" className="text-sm font-medium text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        id="password"
                        type="password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="underline font-semibold">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
