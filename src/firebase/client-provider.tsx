
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  memoryLocalCache
} from 'firebase/firestore'; 
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

// Next.js HMR developer tool to preserve singleton references
const globalForFirebase = (typeof window !== 'undefined' ? window as any : {}) as any;

/**
 * SELF-HEALING OFFLINE CACHE
 * Firestore keeps a copy of read documents in the browser (IndexedDB) to save reads. If that copy gets
 * corrupted, the SDK stops with "INTERNAL ASSERTION FAILED: Unexpected state" and every read on the page
 * hangs (cards stuck on "Checking…") until the person clears their browser data by hand.
 * Now: when that error appears, the page reloads once with the browser copy removed; that session runs
 * without the browser copy, and the next visit builds a fresh one. At most once every 10 minutes.
 */
const FS_RESET_KEY = 'gam_fs_cache_reset';
const FS_RESET_AT = 'gam_fs_cache_reset_at';
function installFirestoreSelfHeal() {
  if (typeof window === 'undefined' || (window as any).__gamFsHealInstalled) return;
  (window as any).__gamFsHealInstalled = true;
  const trigger = (msg: string) => {
    if (!/INTERNAL ASSERTION FAILED/i.test(msg)) return;
    try {
      const last = Number(localStorage.getItem(FS_RESET_AT) || 0);
      if (Date.now() - last < 10 * 60 * 1000) return; // already tried recently: do not loop
      localStorage.setItem(FS_RESET_AT, String(Date.now()));
      localStorage.setItem(FS_RESET_KEY, '1');
    } catch { return; }
    console.warn('[Firestore] Browser cache is corrupted — reloading with a fresh cache.');
    window.location.reload();
  };
  window.addEventListener('error', (ev: ErrorEvent) => trigger(String(ev?.message || ev?.error?.message || '')));
  window.addEventListener('unhandledrejection', (ev: PromiseRejectionEvent) => trigger(String((ev?.reason as any)?.message || ev?.reason || '')));
  // The SDK also reports it through console.error before failing.
  const origError = console.error.bind(console);
  console.error = (...args: any[]) => {
    try { trigger(args.map(a => (a && a.message) || String(a)).join(' ')); } catch { /* ignore */ }
    origError(...args);
  };
}

/** Removes the browser's Firestore cache databases (used after a corruption). */
function deleteFirestoreBrowserCache() {
  try {
    const anyIdb: any = indexedDB as any;
    if (typeof anyIdb.databases === 'function') {
      anyIdb.databases().then((dbs: any[]) => (dbs || []).forEach(d => {
        if (d?.name && String(d.name).startsWith('firestore/')) indexedDB.deleteDatabase(d.name);
      })).catch(() => undefined);
    } else {
      indexedDB.deleteDatabase(`firestore/[DEFAULT]/${firebaseConfig.projectId}/main`);
    }
  } catch { /* ignore */ }
}

function initializeFirebaseOnClient(): FirebaseServices | null {
  // This function should only run on the client
  if (typeof window === 'undefined') {
    return null;
  }

  // If services are already initialized in global window object, reuse them
  if (globalForFirebase.__firebaseServices) {
    services = globalForFirebase.__firebaseServices;
    return services;
  }

  // If services are already initialized in module scope, return them
  if (services) {
    return services;
  }

  // Otherwise, initialize them for the first time
  console.log("Firebase Config loaded in client:", firebaseConfig);
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  
  installFirestoreSelfHeal();
  let resetPending = false;
  try { resetPending = localStorage.getItem(FS_RESET_KEY) === '1'; } catch { /* ignore */ }

  let firestoreInstance: Firestore;
  try {
    if (resetPending) {
      // The browser cache was corrupted: run this session from memory and delete the old cache, so the
      // next visit starts a clean one.
      try { localStorage.removeItem(FS_RESET_KEY); } catch { /* ignore */ }
      deleteFirestoreBrowserCache();
      firestoreInstance = initializeFirestore(app, { localCache: memoryLocalCache() });
    } else {
      // Enable persistent offline IndexedDB cache across multiple tabs to minimize Firestore document reads
      firestoreInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({
          tabManager: persistentMultipleTabManager()
        })
      });
    }
  } catch (e) {
    // Fallback if initialization settings differ or already initialized
    console.warn("Firestore persistent cache initialization, falling back to existing instance:", e);
    firestoreInstance = getFirestore(app);
  }

  // Store the initialized services in global/local variables
  const newServices = {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: firestoreInstance,
    storage: getStorage(app),
  };

  services = newServices;
  globalForFirebase.__firebaseServices = newServices;

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
