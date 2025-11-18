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
import { signInWithEmailAndPassword } from 'firebase/auth';

function DemoLoginButtons() {
    const router = useRouter();
    const auth = useAuth();
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const { toast } = useToast();
    const searchParams = useSearchParams();

    const demoUsers = {
        Director: 'jamesgambrah@sunnyside.com',
        Teacher: 'teacher@sunnyside.com',
        Student: 'student@sunnyside-student.com',
        Parent: 'parent@sunnyside-parent.com',
    };

    const handleDemoLogin = (role: keyof typeof demoUsers) => {
        setIsLoading(role);
        signInWithEmailAndPassword(auth, demoUsers[role], 'password123')
            .then(() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set('role', role);
                router.push(`/dashboard?${params.toString()}`);
            })
            .catch((error) => {
                toast({
                    variant: 'destructive',
                    title: 'Demo Login Failed',
                    description: `Could not log in as ${role}. Please ensure the demo user exists.`,
                });
                console.error(`Demo login error for ${role}:`, error);
            })
            .finally(() => {
                setIsLoading(null);
            });
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {Object.keys(demoUsers).map((role) => (
                <Button 
                    key={role}
                    variant="outline"
                    onClick={() => handleDemoLogin(role as keyof typeof demoUsers)}
                    disabled={!!isLoading}
                >
                    {isLoading === role ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Log in as {role}
                </Button>
            ))}
        </div>
    );
}


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
      const roleFromURL = searchParams.get('role') || 'Parent';
      const params = new URLSearchParams(searchParams.toString());
      params.set('role', roleFromURL);
      router.push(`/dashboard?${params.toString()}`);
    }
  }, [user, isUserLoading, router, searchParams]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // The useEffect will handle the redirect on user state change.
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
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
        </div>
        <CardContent>
          <Suspense fallback={<Loader2 className="mx-auto h-6 w-6 animate-spin" />}>
            <DemoLoginButtons />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
