
'use client';

import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/firebase'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle, School } from 'lucide-react';
import Link from 'next/link';

export default function PasswordResetPage() {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !email) {
      setStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    setErrorMessage('');

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus('success');
      setEmail(''); // Clear email field on success
    } catch (error: any) {
      setStatus('error');
      
      switch (error.code) {
        case 'auth/user-not-found':
          setErrorMessage('No account found with this email address');
          break;
        case 'auth/invalid-email':
          setErrorMessage('Invalid email address format');
          break;
        case 'auth/too-many-requests':
          setErrorMessage('Too many requests. Please try again later');
          break;
        default:
          setErrorMessage('Failed to send reset email. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription className="text-gray-600">
              Enter your email and we'll send a link to reset your password
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'success' && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Email sent! Check your inbox and follow the instructions.
                </AlertDescription>
              </Alert>
            )}

            {status === 'error' && (
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/30 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Sending Link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
