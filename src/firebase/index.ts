'use client';

import { getApps, initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { useState, useEffect, useMemo } from 'react';

// Your Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: "studio-525105839-159e4.firebasestorage.app", // Hardcoded to ensure uploads work
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Global variables to prevent crashing during hot-reloads
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase() {
  if (typeof window === 'undefined') return null; // Don't run on server

  // --- DEBUGGING STEP ---
  console.log("Firebase Config Object:", firebaseConfig);
  // Check if the key is missing. This will be visible in the browser's developer console.
  if (!firebaseConfig.apiKey) {
    console.error("Firebase API Key is missing! Check your .env file and ensure it's loaded correctly.");
  }
  // --- END DEBUGGING STEP ---

  if (!getApps().length) {
    // 1. Initialize New App
    firebaseApp = initializeApp(firebaseConfig);
    
    // 2. FORCE LONG POLLING (The Network Fix)
    try {
      firestore = initializeFirestore(firebaseApp, {
        experimentalForceLongPolling: true, 
      });
    } catch (e) {
      // If it fails (rare), fallback to default
      firestore = getFirestore(firebaseApp);
    }
  } else {
    // 3. Use Existing App (Hot Reload safe)
    firebaseApp = getApp();
    firestore = getFirestore(firebaseApp);
  }

  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);

  return { firebaseApp, auth, firestore, storage };
}


// --- HELPER HOOKS ---

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';