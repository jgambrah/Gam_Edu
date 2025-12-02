'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// 1. Import initializeFirestore
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'; 
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Global variables to hold instances (Prevents re-initialization crashes)
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase() {
  if (typeof window === 'undefined') return null; 

  if (!getApps().length) {
    // --- INITIALIZATION FOR THE FIRST TIME ---
    firebaseApp = initializeApp({
        ...firebaseConfig,
        // Ensure this matches your CORS-configured bucket
        storageBucket: "studio-525105839-159e4.firebasestorage.app",
    });

    // 2. CRITICAL FIX: Force Long Polling
    // This prevents ERR_QUIC_PROTOCOL_ERROR
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true, 
      });
    } catch (e) {
      // If it fails (rare), grab existing instance
      console.warn("Firestore init warning:", e);
      firestore = getFirestore(firebaseApp);
    }

  } else {
    // --- ALREADY INITIALIZED (Hot Reload) ---
    firebaseApp = getApp();
    // Grab the existing instance
    firestore = getFirestore(firebaseApp);
  }

  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);

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

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
