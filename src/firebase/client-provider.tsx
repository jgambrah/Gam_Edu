
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, persistentLocalCache } from 'firebase/firestore'; 
import { firebaseConfig } from './config';

// Global variables to hold instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

export function initializeFirebase() {
  if (typeof window === 'undefined') return null;

  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
        localCache: persistentLocalCache({}),
      });
    } catch (e) {
      console.warn("Firestore persistence failed, falling back:", e);
      firestore = getFirestore(firebaseApp);
    }
  } else {
    firebaseApp = getApp();
    firestore = getFirestore(firebaseApp);
  }
  auth = getAuth(firebaseApp);

  return { firebaseApp, auth, firestore };
}


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    return initializeFirebase();
  }, []);

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices?.firebaseApp || null}
      auth={firebaseServices?.auth || null}
      firestore={firebaseServices?.firestore || null}
    >
      {children}
    </FirebaseProvider>
  );
}

// Export the auth instance for direct use in client components like the login page
export { auth };
