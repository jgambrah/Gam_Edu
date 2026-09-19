import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';

// Helper function to format the private key from environment variables
const formatPrivateKey = (key?: string): string | undefined => {
  if (!key) return undefined;
  return key.replace(/\\n/g, '\n').replace(/"/g, '');
};

let _adminApp: App | null = null;
let _adminDb: Firestore | null = null;

export function getAdminApp(): App {
  if (_adminApp) return _adminApp;

  const existingApp = getApps().find(app => app.name === 'admin') || getApps()[0];
  if (existingApp) {
    _adminApp = existingApp;
    return existingApp;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.FIREBASE_PRIVATE_KEY;

  if (projectId && clientEmail && privateKeyRaw) {
    try {
      _adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey: formatPrivateKey(privateKeyRaw)
        })
      }, 'admin');
      return _adminApp;
    } catch (e) {
      console.warn('[firebaseAdmin] Error initializing with cert, falling back:', e);
    }
  }

  // Fallback initialization
  _adminApp = initializeApp({ projectId: projectId || 'gam-edu-project' }, 'admin');
  return _adminApp;
}

export function getAdminDb(): Firestore {
  if (_adminDb) return _adminDb;
  _adminDb = getFirestore(getAdminApp());
  return _adminDb;
}

// Proxy wrapper ensuring safe evaluation and lazy instantiation
export const adminDb: Firestore = new Proxy({} as Firestore, {
  get(target, prop, receiver) {
    const db = getAdminDb();
    const value = Reflect.get(db, prop, receiver);
    if (typeof value === 'function') {
      return value.bind(db);
    }
    return value;
  }
});

export { admin, FieldValue, Timestamp };
export default adminDb;
