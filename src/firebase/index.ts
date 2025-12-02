
'use client';

import { getApps, initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth'; // Import User type
import { initializeFirestore, getFirestore, Firestore } from 'firebase/firestore'; 
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { useState, useEffect } from 'react';

// Your Config
const firebaseConfig = {
  "projectId": "studio-525105839-159e4",
  "appId": "1:793841793308:web:408f4035e4178bf2f962d9",
  "storageBucket": "studio-525105839-159e4.firebasestorage.app",
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
  if (typeof window === 'undefined') return null;

  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
    firestore = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true, 
    });
  } else {
    firebaseApp = getApp();
    firestore = getFirestore(firebaseApp);
  }

  auth = getAuth(firebaseApp);
  storage = getStorage(firebaseApp);

  return { firebaseApp, auth, firestore, storage };
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';
