
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '@/firebase'; // Ensure this path matches your setup
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, School, CheckCircle2, ShieldCheck, Zap, Globe, GraduationCap } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!auth) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Firebase is not initialized. Please refresh.",
        });
        setLoading(false);
        return;
    }


    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({ title: "Welcome back!", description: "Logging you in..." });
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      let message = "Invalid email or password.";
      if (error.code === 'auth/too-many-requests') message = "Too many attempts. Try again later.";
      toast({ variant: "destructive", title: "Login Failed", description: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
      
      {/* LEFT SIDE: MARKETING & BRANDING */}
      <div className="hidden lg:flex flex-col justify-between bg-blue-900 text-white p-12">
        <div>
          <div className="flex items-center gap-3 text-2xl font-bold mb-10">
            <GraduationCap className="h-8 w-8 text-blue-300" />
            GAM Edu
          </div>
          
          <h1 className="text-5xl font-extrabold leading-tight mb-6">
            Manage your school with <span className="text-blue-300">Intelligent AI</span>.
          </h1>
          <p className="text-blue-100 text-lg mb-8 max-w-md">
            The all-in-one platform for modern education management. Finance, Grading, Attendance, and AI Tutoring in one place.
          </p>

          <div className="space-y-4">
            <FeatureRow text="Multi-School SaaS Architecture" />
            <FeatureRow text="AI-Powered Lesson Planning & Quizzes" />
            <FeatureRow text="Automated Finance & Billing" />
            <FeatureRow text="Secure Role-Based Access" />
          </div>
        </div>

        <div className="bg-blue-800/50 p-6 rounded-xl border border-blue-700 backdrop-blur-sm">
          <p className="font-medium italic">"This platform transformed how we run our school. The AI features save our teachers hours every week."</p>
          <div className="mt-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-400 flex items-center justify-center font-bold text-blue-900">JS</div>
            <div>
              <p className="text-sm font-bold">James Smith</p>
              <p className="text-xs text-blue-300">Principal, Galaxy Int. School</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex items-center justify-center p-8 bg-slate-50">
        <Card className="w-full max-w-md shadow-xl border-t-4 border-t-blue-600">
          <CardHeader className="space-y-1">
            <div className="lg:hidden flex justify-center mb-4">
               <GraduationCap className="h-10 w-10 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-center">Sign in to your account</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="admin@school.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="#" className="text-sm text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 bg-slate-50/50 pt-6 border-t">
            <div className="text-center text-sm text-slate-600">
              Is your school not registered yet?
            </div>
            <Link href="/register-school" className="w-full">
              <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 text-blue-700 font-bold">
                <Globe className="mr-2 h-4 w-4"/> Register Your School
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
        <CheckCircle2 className="h-4 w-4 text-blue-300" />
      </div>
      <span className="font-medium">{text}</span>
    </div>
  );
}
