
'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, getFirestore, Firestore, persistentLocalCache } from 'firebase/firestore'; 
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Global variables to hold instances (Prevents re-initialization crashes in Next.js)
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase() {
  // Don't run on server side
  if (typeof window === 'undefined') return null; 

  if (!getApps().length) {
    // --- INITIALIZATION FOR THE FIRST TIME ---
    firebaseApp = initializeApp({
        ...firebaseConfig,
        // Ensure this matches the bucket we fixed CORS for
        storageBucket: "studio-525105839-159e4.firebasestorage.app",
    });

    // FIX: Removed experimentalForceLongPolling to prevent offline errors.
    // The SDK will now manage the connection automatically.
    try {
      firestore = initializeFirestore(firebaseApp, {
        localCache: persistentLocalCache({}),
      });
      console.log("🔥 Firestore initialized with Multi-Tab Persistence.");
    } catch (e) {
      console.warn("Firestore persistence failed, falling back to in-memory:", e);
      // If persistence fails (e.g., in some private browsing modes), initialize without it.
      firestore = getFirestore(firebaseApp);
    }

  } else {
    // --- ALREADY INITIALIZED (Hot Reload) ---
    firebaseApp = getApp();
    // Re-get firestore instance to ensure it's linked to the correct app instance
    firestore = getFirestore(firebaseApp);
  }

  auth = getAuth(firebaseApp);
  
  // Initialize Storage with the specific bucket to fix Uploads
  storage = getStorage(firebaseApp, "gs://studio-525105839-159e4.firebasestorage.app");

  return { firebaseApp, auth, firestore, storage };
}

export function getSdks(app: FirebaseApp) {
    return {
        firebaseApp: app,
        auth: getAuth(app),
        firestore: getFirestore(app),
        storage: getStorage(app)
    }
}

// Export existing hooks and providers
export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
