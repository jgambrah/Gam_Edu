'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

function AuthDiagnostic() {
  const { user: hookUser } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const router = useRouter();
  const [directAuthUser, setDirectAuthUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  // Test 1: Check Firebase Auth directly
  useEffect(() => {
    const auth = getAuth();
    
    addResult('🔍 Starting Auth Diagnostic...');
    addResult(`📱 Current URL: ${window.location.href}`);
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthChecked(true);
      setDirectAuthUser(user);
      
      if (user) {
        addResult('✅ Firebase Auth: User IS logged in');
        addResult(`   UID: ${user.uid}`);
        addResult(`   Email: ${user.email}`);
        addResult(`   Email Verified: ${user.emailVerified}`);
      } else {
        addResult('❌ Firebase Auth: NO user logged in');
        addResult('   → You need to log in first!');
      }
    });

    return () => unsubscribe();
  }, []);

  // Test 2: Check useAuth hook
  useEffect(() => {
    if (!authChecked) return;
    
    addResult('\n🪝 Testing useAuth() Hook:');
    if (hookUser) {
      addResult('✅ useAuth hook: Returns user');
      addResult(`   UID: ${hookUser.uid}`);
      addResult(`   Email: ${hookUser.email}`);
    } else {
      addResult('❌ useAuth hook: Returns null/undefined');
      addResult('   → Issue with your useAuth hook implementation');
    }
  }, [hookUser, authChecked]);

  // Test 3: Check role
  useEffect(() => {
    if (!authChecked) return;
    
    addResult('\n👔 Testing Role:');
    addResult(`   Role from useRole(): ${role || 'Not set'}`);
    
    if (role && !directAuthUser) {
      addResult('⚠️  WARNING: You have a role but no auth user!');
      addResult('   → Role is cached but you are not logged in');
    }
  }, [role, directAuthUser, authChecked]);

  // Test 4: Try to fetch classes
  useEffect(() => {
    if (!authChecked) return;
    
    async function testFirestore() {
      addResult('\n🔥 Testing Firestore Access:');
      
      if (!directAuthUser) {
        addResult('⏭️  Skipped: No authenticated user');
        return;
      }

      try {
        const classesRef = collection(firestore, 'classes');
        const snapshot = await getDocs(classesRef);
        addResult(`✅ Firestore: Successfully fetched data`);
        addResult(`   Classes found: ${snapshot.size}`);
        
        if (snapshot.size > 0) {
          const firstClass = snapshot.docs[0];
          addResult(`   First class ID: ${firstClass.id}`);
          addResult(`   First class data: ${JSON.stringify(firstClass.data())}`);
        }
      } catch (error: any) {
        addResult(`❌ Firestore Error: ${error.message}`);
      }
    }

    testFirestore();
  }, [directAuthUser, firestore, authChecked]);

  function addResult(message: string) {
    setTestResults(prev => [...prev, message]);
    console.log(message);
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🔐 Authentication Diagnostic</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push('/')} variant="default">
            Go to Login
          </Button>
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            Go to Dashboard
          </Button>
        </div>
      </div>

      {/* Quick Status */}
      <Card className={directAuthUser ? "border-green-500" : "border-red-500"}>
        <CardHeader>
          <CardTitle>
            {directAuthUser ? "✅ You are logged in" : "❌ You are NOT logged in"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {directAuthUser ? (
            <>
              <div><strong>UID:</strong> {directAuthUser.uid}</div>
              <div><strong>Email:</strong> {directAuthUser.email}</div>
              <div><strong>Role:</strong> {role || 'Not set'}</div>
              <Button onClick={() => router.push('/dashboard/grades')} className="mt-4">
                Go to Gradebook
              </Button>
            </>
          ) : (
            <>
              <p className="text-red-600 font-medium">
                You need to log in to access the gradebook.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Role shows as "{role}" but this is cached. You have no active Firebase Auth session.
              </p>
              <Button onClick={() => router.push('/')} className="mt-4">
                Go to Login Page
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <Card>
        <CardHeader>
          <CardTitle>Diagnostic Results</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="p-4 bg-muted rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap font-mono">
            {testResults.join('\n')}
          </pre>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle>📋 What to Do Next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {!directAuthUser ? (
            <>
              <div className="font-medium text-red-600">You are not logged in!</div>
              <ol className="list-decimal ml-6 space-y-2">
                <li>Click the <strong>"Go to Login"</strong> button above</li>
                <li>Log in with your email and password</li>
                <li>After successful login, return to the gradebook</li>
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-950 rounded">
                <strong>Note:</strong> The role "Director" is cached in your browser but your Firebase Auth session has expired or doesn't exist.
              </div>
            </>
          ) : (
            <>
              <div className="font-medium text-green-600">Authentication is working!</div>
              <p>You can now use the gradebook and other features.</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card className="border-orange-500">
        <CardHeader>
          <CardTitle>🔧 If Login Doesn't Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p><strong>Try these steps:</strong></p>
          <ol className="list-decimal ml-6 space-y-1">
            <li>Clear your browser cache and cookies</li>
            <li>Try incognito/private browsing mode</li>
            <li>Check browser console (F12) for errors</li>
            <li>Verify Firebase configuration in your environment variables</li>
            <li>Make sure Firebase Auth is enabled in Firebase Console</li>
          </ol>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded">
            <strong>For Developers:</strong> Check that your Firebase config is correct and Firebase Auth is properly initialized in your app.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GradesPage() {
  return <AuthDiagnostic />;
}
