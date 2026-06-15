
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, persistentLocalCache } from 'firebase/firestore'; 
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

function initializeFirebaseOnClient(): FirebaseServices | null {
  // This function should only run on the client
  if (typeof window === 'undefined') {
    return null;
  }

  // If services are already initialized, return them to prevent re-initialization
  if (services) {
    return services;
  }

  // Otherwise, initialize them for the first time
  console.log("Firebase Config loaded in client:", firebaseConfig);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  
  let firestoreInstance: Firestore;
  try {
    // This is the correct way to initialize with persistence. It's idempotent.
    firestoreInstance = initializeFirestore(app, {
      localCache: persistentLocalCache({})
    });
  } catch (e) {
    // This might happen in some rare HMR cases if settings somehow differ. Fallback.
    console.warn("Firestore persistence failed to initialize, falling back to in-memory:", e);
    firestoreInstance = getFirestore(app);
  }

  // Store the initialized services in the global variable
  services = {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: firestoreInstance,
    storage: getStorage(app),
  };

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
