// Your web app's Firebase configuration with safe Vercel fallbacks
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBwTYgwwcHA5C1UdHGBvhyVoE_-sULCyHI',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'gamedu-69888475-f5783.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'gamedu-69888475-f5783',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gamedu-69888475-f5783.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '667443968578',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:667443968578:web:bfddf34703726808e60bdb',
};
