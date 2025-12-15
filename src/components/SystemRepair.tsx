
'use client';

import { useState, useEffect } from 'react';
// We use direct Firebase SDK calls to bypass any hook issues
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase'; // Correct import for the app instance
import { Button } from '@/components/ui/button';
import { Loader2, Wrench, AlertTriangle, RefreshCw } from 'lucide-react';

export default function SystemRepair() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [debugMsg, setDebugMsg] = useState("");

  // DIRECTLY LISTEN TO FIREBASE AUTH
  useEffect(() => {
    // Make sure firebase is initialized before getting auth
    const services = initializeFirebase();
    if (services?.auth) {
        const auth = services.auth;
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("SystemRepair found user:", user.uid);
                setCurrentUser(user);
                setDebugMsg(`Ready: ${user.email}`);
            } else {
                setCurrentUser(null);
                setDebugMsg("Waiting for login...");
            }
            setAuthChecking(false);
        });
        return () => unsubscribe();
    } else {
        setDebugMsg("Firebase not initialized...");
        setAuthChecking(false);
    }
  }, []);

  const fixSystem = async () => {
    setLoading(true);
    const services = initializeFirebase();

    if (!services || !services.auth || !services.firestore) {
        alert("Critical Error: Firebase services failed to initialize.");
        setLoading(false);
        return;
    }
    
    const user = services.auth.currentUser;
    const firestore = services.firestore;

    if (!user) {
        alert("Still waiting for user... try refreshing.");
        setLoading(false);
        return;
    }

    try {
      setDebugMsg(`Processing User: ${user.uid}...`);
      
      // 1. FORCE ADMIN ROLE in the 'staff' collection
      await setDoc(doc(firestore, 'staff', user.uid), {
        uid: user.uid,
        email: user.email,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'Director', // This is the role the rules check for Admin access
        repairedAt: new Date().toISOString()
      }, { merge: true });

      setDebugMsg("Role Set. Creating dummy data...");

      // 2. FORCE COLLECTION INIT
      await addDoc(collection(firestore, 'timetables'), {
        day: 'SystemInit',
        created_by: 'AdminRepairTool',
        timestamp: new Date()
      });

      alert("✅ SUCCESS! \n\n1. Admin Role Assigned.\n2. 'timetables' collection created.\n\nPlease refresh the page now.");
      
    } catch (error: any) {
      console.error(error);
      const errorText = `❌ CRASH: ${error.message}`;
      setDebugMsg(errorText);
      alert(errorText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg my-4 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-orange-900 flex items-center gap-2">
            <Wrench className="h-5 w-5"/> Admin Force-Fixer
        </h3>
        {authChecking && <Loader2 className="h-4 w-4 animate-spin text-orange-600"/>}
      </div>
      
      <div className="text-sm text-orange-800 mb-4 space-y-2 bg-orange-100 p-3 rounded">
        <div className="flex items-center justify-between">
            <span>User Status:</span>
            <span className="font-bold">
                {currentUser ? "✅ FOUND" : "❌ SEARCHING..."}
            </span>
        </div>
        {currentUser && (
            <div className="text-xs font-mono text-orange-700 break-all">
                ID: {currentUser.uid}
            </div>
        )}
      </div>

      <Button 
        onClick={fixSystem} 
        disabled={loading || !currentUser} 
        className="bg-orange-600 hover:bg-orange-700 w-full font-bold h-12"
      >
        {loading ? <Loader2 className="animate-spin mr-2"/> : <AlertTriangle className="mr-2 h-4 w-4" />}
        {currentUser ? "CLICK TO FIX PERMISSIONS" : "Waiting for User..."}
      </Button>

      {/* Manual Reload Button if stuck */}
      {!currentUser && !authChecking && (
          <Button variant="outline" onClick={() => window.location.reload()} className="w-full mt-2 border-orange-300 text-orange-700">
              <RefreshCw className="mr-2 h-3 w-3" /> Force Reload Page
          </Button>
      )}
    </div>
  );
}
