'use client';

import { useState, useEffect } from 'react';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

type Class = {
  id: string;
  name?: string;
  teacherId?: string;
  grade?: string;
  [key: string]: any;
};

function GradebookTest() {
  const { user } = useAuth();
  const { role } = useRole();
  const firestore = useFirestore();
  const [manualClasses, setManualClasses] = useState<any[]>([]);
  const [manualError, setManualError] = useState<string>('');

  // Test 1: Manual fetch without useCollection hook
  useEffect(() => {
    async function testFetch() {
      if (!firestore || !user) return;
      
      console.log('🔍 MANUAL FETCH TEST');
      console.log('User UID:', user.uid);
      console.log('Role:', role);
      
      try {
        let classesRef;
        if (role === 'Administrator' || role === 'Director') {
          console.log('Fetching ALL classes (Admin/Director)');
          classesRef = collection(firestore, 'classes');
        } else if (role === 'Teacher') {
          console.log('Fetching classes for teacher:', user.uid);
          classesRef = query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
        } else {
          console.log('❌ Role not authorized:', role);
          setManualError(`Role "${role}" is not authorized`);
          return;
        }

        const snapshot = await getDocs(classesRef);
        console.log('📊 Snapshot size:', snapshot.size);
        console.log('📊 Snapshot empty:', snapshot.empty);
        
        const fetchedClasses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        console.log('📚 Fetched classes:', fetchedClasses);
        setManualClasses(fetchedClasses);
        
        if (fetchedClasses.length === 0) {
          if (role === 'Teacher') {
            setManualError(`No classes found with teacherId="${user.uid}". Check if classes have this teacherId field.`);
          } else {
            setManualError('No classes found in the collection. Create some classes first.');
          }
        }
      } catch (error: any) {
        console.error('❌ Error fetching classes:', error);
        setManualError(error.message);
      }
    }
    
    testFetch();
  }, [firestore, user, role]);

  // Test 2: Using useCollection hook
  const classesQuery = useMemoFirebase(() => {
    if (!user) return null;
    if (role === 'Administrator' || role === 'Director') {
      return collection(firestore, 'classes');
    }
    if (role === 'Teacher') {
      return query(collection(firestore, 'classes'), where('teacherId', '==', user.uid));
    }
    return null;
  }, [firestore, user, role]);
  
  const { data: hookClasses, isLoading: hookLoading, error: hookError } = useCollection<Class>(classesQuery);

  useEffect(() => {
    console.log('🪝 HOOK TEST');
    console.log('Hook Loading:', hookLoading);
    console.log('Hook Error:', hookError);
    console.log('Hook Classes:', hookClasses);
    console.log('Hook Classes Length:', hookClasses?.length);
  }, [hookLoading, hookError, hookClasses]);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">Gradebook Debug Test</h1>

      {/* User Info */}
      <Card className="border-blue-500">
        <CardHeader>
          <CardTitle>👤 User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>UID:</strong> {user?.uid || 'Not logged in'}</div>
          <div><strong>Email:</strong> {user?.email || 'N/A'}</div>
          <div><strong>Role:</strong> {role || 'Not set'}</div>
          <div><strong>Can Access:</strong> {role === 'Teacher' || role === 'Administrator' || role === 'Director' ? '✅ Yes' : '❌ No'}</div>
        </CardContent>
      </Card>

      {/* Manual Fetch Results */}
      <Card className="border-green-500">
        <CardHeader>
          <CardTitle>🔍 Test 1: Manual getDocs() Fetch</CardTitle>
          <CardDescription>Direct Firestore query without hooks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Classes Found:</strong> {manualClasses.length}</div>
          {manualError && <div className="text-red-500"><strong>Error:</strong> {manualError}</div>}
          
          {manualClasses.length > 0 && (
            <div className="mt-4">
              <strong>Classes List:</strong>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(manualClasses, null, 2)}
              </pre>
              
              <div className="mt-4">
                <strong>Test Select Dropdown:</strong>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {manualClasses.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || c.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hook Results */}
      <Card className="border-purple-500">
        <CardHeader>
          <CardTitle>🪝 Test 2: useCollection Hook</CardTitle>
          <CardDescription>Using your custom hook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><strong>Loading:</strong> {hookLoading ? '⏳ Yes' : '✅ No'}</div>
          <div><strong>Error:</strong> {hookError ? `❌ ${JSON.stringify(hookError)}` : '✅ None'}</div>
          <div><strong>Classes Found:</strong> {hookClasses?.length || 0}</div>
          
          {hookClasses && hookClasses.length > 0 && (
            <div className="mt-4">
              <strong>Classes List:</strong>
              <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto max-h-60">
                {JSON.stringify(hookClasses, null, 2)}
              </pre>
              
              <div className="mt-4">
                <strong>Test Select Dropdown:</strong>
                <Select>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {hookClasses.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name || c.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="border-yellow-500">
        <CardHeader>
          <CardTitle>📋 Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Check the browser console (F12)</strong> for detailed logs.</p>
          <p><strong>Compare Test 1 and Test 2:</strong></p>
          <ul className="list-disc ml-6 space-y-1">
            <li>If Test 1 works but Test 2 doesn't → Issue with useCollection hook</li>
            <li>If both fail → Firestore permissions or query issue</li>
            <li>If Test 1 shows 0 classes for Teacher → Add teacherId field to classes</li>
            <li>If Test 1 shows classes → Dropdown should work!</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GradesPage() {
  const { role } = useRole();

  const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  if (!canAccess) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            This feature is available only to Teachers, Administrators, and Directors.
            Your current role: {role || 'Not set'}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <GradebookTest />;
}
