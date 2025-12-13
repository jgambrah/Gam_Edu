'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AppLogo } from '@/components/icons/app-logo';
import { useAuth, useUser } from '@/firebase';
import { FormEvent, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { initiateEmailSignIn } from '@/firebase/non-blocking-login';
import { createNewUser } from './actions/create-user';

// Reusable Feature Item Component for the left panel
const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-3 text-sm font-medium bg-white/10 p-3 rounded-lg backdrop-blur-sm border border-white/20">
    <div className="w-5 h-5 bg-green-500/50 text-green-200 rounded-full flex items-center justify-center flex-shrink-0">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
    </div>
    <span>{children}</span>
  </div>
);


export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleAuthAction = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'Firebase Auth is not available. Please try again later.'
        });
        setIsLoading(false);
        return;
    }

    try {
      if (isSignUp) {
        const result = await createNewUser(email, password, 'Director', { firstName: 'Admin', lastName: 'User' });
        
        if ('error' in result) {
            throw new Error(result.error);
        }
        
        toast({
          title: 'Account Created!',
          description: "Logging you in now...",
        });
        initiateEmailSignIn(auth, email, password);
      } else {
        initiateEmailSignIn(auth, email, password);
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: isSignUp ? 'Sign Up Failed' : 'Authentication Failed',
        description: error.message,
      });
       setIsLoading(false);
    } 
  };

  if (isUserLoading || user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[900px]">
        {/* Left Side: Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            {/* Decorative Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/30">
                    <AppLogo className="w-8 h-8 text-white"/>
                </div>
                <h1 className="text-4xl font-bold mb-4">CampusConnect</h1>
                <p className="text-indigo-100 text-lg leading-relaxed max-w-prose">
                  Experience the next generation of AI-driven education management. Personalized learning, automated admin, and seamless communication.
                </p>
            </div>
            
            <div className="relative z-10 space-y-4">
                <FeatureItem>Adaptive Learning Paths</FeatureItem>
                <FeatureItem>Real-time Analytics</FeatureItem>
                <FeatureItem>AI-Powered Tutoring</FeatureItem>
            </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
            <Card className="w-full max-w-md border-none shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold">{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
                <CardDescription>
                  {isSignUp ? 'Fill in the details to create your admin account.' : 'Enter your credentials to access your account'}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleAuthAction}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email" type="email" placeholder="m@example.com" required
                      value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password" type="password" required
                      value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                  </Button>
                  <Button variant="link" type="button" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
        </div>
      </div>
    </main>
  );
}
