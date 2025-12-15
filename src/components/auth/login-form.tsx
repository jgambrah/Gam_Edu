
'use client';

import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { createNewUser } from '@/app/actions/create-user';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function LoginForm() {
    const router = useRouter();
    const auth = useAuth();
    const { user, isUserLoading } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const { toast } = useToast();

    // This effect handles the case where a user is already logged in
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
                // Now we await the sign-in to complete
                await initiateEmailSignIn(auth, email, password);
            } else {
                // Await the sign-in to complete before doing anything else
                await initiateEmailSignIn(auth, email, password);
            }
            // The redirection is now handled by the useEffect hook, which will
            // trigger once the 'user' object is updated by the onAuthStateChanged listener.
            // This ensures the session is fully established.
            
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: isSignUp ? 'Sign Up Failed' : 'Authentication Failed',
                description: error.message,
            });
            setIsLoading(false); // Only set loading to false on error
        }
        // Don't set isLoading to false on success, as we will be redirected.
    };
    
    // Show a loading spinner if we are logging in OR if we are just checking the initial user state
    if (isUserLoading || isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">{isLoading ? 'Signing in...' : 'Loading session...'}</p>
            </div>
        );
    }
    
    // Only show the form if we are not loading and not logged in
    if (!user) {
        return (
            <form onSubmit={handleAuthAction}>
                <div className="space-y-4">
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
                </div>
                <div className="flex flex-col gap-4 mt-6">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isSignUp ? 'Sign Up' : 'Sign In')}
                    </Button>
                    <Button variant="link" type="button" onClick={() => setIsSignUp(!isSignUp)}>
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                    </Button>
                </div>
            </form>
        );
    }

    // Return null or a placeholder if already logged in and waiting for redirect
    return null;
}
