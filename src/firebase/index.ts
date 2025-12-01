
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Add getFirestore to imports
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'; 

// Global variable to hold the instance across re-renders
let firestoreInstance: Firestore | null = null;

export function initializeFirebase() {
  // 1. Check if App is already initialized
  if (getApps().length > 0) {
    const app = getApp();
    if (!firestoreInstance) {
        // This case handles HMR where the app exists but our global var was cleared.
        // It safely gets the existing instance without re-initializing with settings.
        firestoreInstance = getFirestore(app);
    }
    return {
        firebaseApp: app,
        auth: getAuth(app),
        firestore: firestoreInstance
    };
  }

  // 2. Initialize Fresh App
  // Important! We explicitly set the bucket that has CORS enabled.
  const firebaseApp = initializeApp({
      ...firebaseConfig,
      // FIX: Use .firebasestorage.app (This is where we fixed CORS)
      storageBucket: "studio-525105839-159e4.firebasestorage.app",
  });

  // 3. Initialize Firestore with Long Polling (Fixes QUIC Error)
  // We save this to the global variable so we don't lose the settings
  firestoreInstance = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true,
  });

  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: firestoreInstance,
  };
}

// Optional helper if you need it elsewhere, updated to be safe
export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    // Use getFirestore here to avoid crashing if already initialized
    firestore: firestoreInstance || getFirestore(firebaseApp),
  };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
