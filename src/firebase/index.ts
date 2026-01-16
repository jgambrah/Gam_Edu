
'use client';

import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore'; 
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { firebaseConfig } from '@/firebase/config';

// Removed the redundant initializeFirebase function from this file.
// The primary initializer now lives in client-provider.tsx to ensure
// it's always used on the client with the correct settings.

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
