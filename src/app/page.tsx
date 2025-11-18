'use client';

import { useRouter, useSearchParams } from 'next/navigation';
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
import { FormEvent, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import type { UserRole } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      const searchParams = new URLSearchParams(window.location.search);
      const role = searchParams.get('role');
      router.push(role ? `/dashboard?role=${role}` : '/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast({
          title: 'Login Successful',
          description: "Welcome back!",
        });
      })
      .catch((error) => {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: "Invalid email or password. Please try again.",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleDemoLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
        if (role === 'Director' || role === 'Administrator') {
            await signInWithEmailAndPassword(auth, 'jamesgambrah@sunnyside.com', 'password123');
        } else {
            await signInAnonymously(auth);
        }
        router.push(`/dashboard?role=${role}`);
    } catch(error) {
        console.error("Demo login failed:", error);
        toast({
          variant: 'destructive',
          title: 'Demo Login Failed',
          description: "Could not sign in with demo credentials.",
        });
    } finally {
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
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <AppLogo className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">CampusConnect</h1>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading && !email ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="px-6 pb-6">
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or sign in as
                    </span>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
                <Button variant="outline" onClick={() => handleDemoLogin('Director')} disabled={isLoading}>Director</Button>
                <Button variant="outline" onClick={() => handleDemoLogin('Teacher')} disabled={isLoading}>Teacher</Button>
                <Button variant="outline" onClick={() => handleDemoLogin('Student')} disabled={isLoading}>Student</Button>
                <Button variant="outline" onClick={() => handleDemoLogin('Parent')} disabled={isLoading}>Parent</Button>
            </div>
        </div>
      </Card>
    </main>
  );
}
