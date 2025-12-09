
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

    // 2. CRITICAL FIX: Force Long Polling & enable persistent cache
    // This fixes "Internal Assertion Failed" and random disconnects
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true,
        localCache: persistentLocalCache(/*settings*/{}),
      });
      console.log("🔥 Firestore initialized with Long Polling (Stable Mode)");
    } catch (e) {
      console.warn("Firestore initialization with persistence failed, falling back:", e);
      try {
        // Fallback without persistence if the first attempt fails
        firestore = initializeFirestore(firebaseApp, {
          experimentalForceLongPolling: true,
        });
      } catch (fallbackError) {
          console.error("Critical Firestore initialization failed:", fallbackError);
          // If even the basic init fails, get the standard instance
          firestore = getFirestore(firebaseApp);
      }
    }

  } else {
    // --- ALREADY INITIALIZED (Hot Reload) ---
    firebaseApp = getApp();
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
