'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'; 

// Global variable to hold the instance
let firestoreInstance: Firestore | null = null;

// Helper to safely initialize Firestore with Long Polling
function getSafeFirestore(app: FirebaseApp): Firestore {
  if (firestoreInstance) return firestoreInstance;

  try {
    // Try to initialize with settings (Fixes QUIC/Network errors)
    firestoreInstance = initializeFirestore(app, {
      experimentalForceLongPolling: true,
    });
  } catch (e) {
    // If already initialized, just grab the existing instance
    // (This happens during hot-reloads in development)
    firestoreInstance = getFirestore(app);
  }
  return firestoreInstance;
}

export function initializeFirebase() {
  let app: FirebaseApp;

  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp({
        ...firebaseConfig,
        // Use the bucket we fixed for CORS
        storageBucket: "studio-525105839-159e4.firebasestorage.app",
    });
  }

  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getSafeFirestore(app), // Use our safe helper
  };
}

export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getSafeFirestore(firebaseApp), // Use our safe helper
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
