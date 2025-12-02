
'use client';

import { getApps, initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
// Add getFirestore to imports
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'; 
import { getStorage, FirebaseStorage } from 'firebase/storage'; // Import Storage
import { useState, useEffect } from 'react';

// Your Config
const firebaseConfig = {
  // Using hardcoded values from the previous config file as the .env is empty
  "projectId": "studio-525105839-159e4",
  "appId": "1:793841793308:web:408f4035e4178bf2f962d9",
  "storageBucket": "studio-525105839-159e4.firebasestorage.app", // HARDCODED FIX
  "apiKey": "AIzaSyBZly_kWYNRG5Kgt_uyTqDXGXa4_T3jGzk",
  "authDomain": "studio-525105839-159e4.firebaseapp.com",
  "messagingSenderId": "793841793308"
};

// Global instances to prevent re-initialization during hot-reload
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;
let storage: FirebaseStorage;

export function initializeFirebase() {
  if (typeof window === 'undefined') return null; // Don't run on server

  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    
    // --- CRITICAL FIX: Force Long Polling ---
    // This prevents the "Rolling Non-Stop" / QUIC Error
    firestore = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true, 
    });
  } else {
    firebaseApp = getApp();
    // If already initialized, try to grab the existing instance
    // If it wasn't initialized with LongPolling before, this might still hang, 
    // so a hard refresh (Ctrl+F5) is needed after saving this file.
    firestore = getFirestore(firebaseApp);
  }

  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);

  return { firebaseApp, auth, firestore, storage };
}

// Helper hook for components
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  
  useEffect(() => {
    const { auth } = initializeFirebase() || {};
    if(!auth) return;
    const unsub = auth.onAuthStateChanged((u) => {
      setUser(u);
      setIsUserLoading(false);
    });
    return () => unsub();
  }, []);
  
  return { user, isUserLoading };
};

export const useFirestore = () => {
  const { firestore } = initializeFirebase() || {};
  return firestore;
};

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';

