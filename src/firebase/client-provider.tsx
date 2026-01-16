
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, persistentLocalCache } from 'firebase/firestore'; 
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

// Global variables to hold instances
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

// The robust initializer from index.ts is now here.
function initializeFirebaseOnClient() {
  if (typeof window === 'undefined') return null;

  if (!getApps().length) {
    firebaseApp = initializeApp({
        ...firebaseConfig,
        storageBucket: "studio-525105839-159e4.firebasestorage.app",
    });
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
  storage = getStorage(firebaseApp, "gs://studio-525105839-159e4.firebasestorage.app");

  return { firebaseApp, auth, firestore, storage };
}


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // We call the robust client initializer here.
    return initializeFirebaseOnClient();
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
