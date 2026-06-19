
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, memoryLocalCache } from 'firebase/firestore'; 
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

// Define a type for our services
type FirebaseServices = {
    firebaseApp: FirebaseApp;
    auth: Auth;
    firestore: Firestore;
    storage: FirebaseStorage;
};

// Use a global variable to hold the initialized services, making it a singleton
let services: FirebaseServices | null = null;

// Next.js HMR developer tool to preserve singleton references
const globalForFirebase = (typeof window !== 'undefined' ? window as any : {}) as any;

function initializeFirebaseOnClient(): FirebaseServices | null {
  // This function should only run on the client
  if (typeof window === 'undefined') {
    return null;
  }

  // If services are already initialized in global window object, reuse them
  if (globalForFirebase.__firebaseServices) {
    services = globalForFirebase.__firebaseServices;
    return services;
  }

  // If services are already initialized in module scope, return them
  if (services) {
    return services;
  }

  // Otherwise, initialize them for the first time
  console.log("Firebase Config loaded in client:", firebaseConfig);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  
  let firestoreInstance: Firestore;
  try {
    // Disable offline IndexedDB cache to prevent loading latency and transaction abort errors
    firestoreInstance = initializeFirestore(app, {
      localCache: memoryLocalCache({})
    });
  } catch (e) {
    // Fallback if initialization settings differ
    console.warn("Firestore initialization failed, falling back to default:", e);
    firestoreInstance = getFirestore(app);
  }

  // Store the initialized services in global/local variables
  const newServices = {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: firestoreInstance,
    storage: getStorage(app),
  };

  services = newServices;
  globalForFirebase.__firebaseServices = newServices;

  return services;
}


interface FirebaseClientProviderProps {
  children: ReactNode;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
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

// Re-export auth if needed elsewhere, though using the hook is preferred.
export const auth = (services as any)?.auth as Auth;
