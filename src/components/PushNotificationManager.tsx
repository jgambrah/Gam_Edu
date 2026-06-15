'use client';

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage, isSupported as isMessagingSupported } from 'firebase/messaging';
import { useUser, useFirestore, useFirebaseApp } from '@/firebase';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { BellRing, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * Manages Push Notification permissions and FCM token registration.
 * Saves tokens to the specified collection (staff, students, or parents).
 */
export function PushNotificationManager({ collectionName }: { collectionName: string }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const app = useFirebaseApp();
  const { toast } = useToast();
  
  const [showPrompt, setShowPrompt] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    async function checkSupport() {
      const isSupportedBrowser = typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
      if (isSupportedBrowser) {
        try {
          const messagingSupported = await isMessagingSupported();
          if (messagingSupported) {
            setSupported(true);
            // Show prompt if permission is not yet decided
            if (Notification.permission === 'default') {
              setShowPrompt(true);
            } else if (Notification.permission === 'granted' && user) {
              // Silently refresh/save token if already granted
              requestAndSaveToken();
            }
          }
        } catch (e) {
          console.warn("Messaging not supported in this environment");
        }
      }
    }
    checkSupport();
  }, [user]);

  // Handle messages while the app is in the foreground
  useEffect(() => {
    if (supported && user && app) {
      try {
        const messaging = getMessaging(app);
        const unsubscribe = onMessage(messaging, (payload) => {
          console.log('Foreground Message:', payload);
          toast({
            title: payload.notification?.title || 'New Notification',
            description: payload.notification?.body,
          });
        });
        return () => unsubscribe();
      } catch (e) {
        console.warn("Foreground messaging setup failed:", e);
      }
    }
  }, [supported, user, app, toast]);

  const requestAndSaveToken = async () => {
    if (!user || !firestore || !app) return;

    try {
      const messaging = getMessaging(app);
      
      // Get the existing ready service worker registration (typically /sw.js)
      let serviceWorkerRegistration;
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
        serviceWorkerRegistration = await navigator.serviceWorker.ready.catch(() => undefined);
      }

      // VAPID key must be generated in Firebase Console
      const currentToken = await getToken(messaging, { 
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        ...(serviceWorkerRegistration ? { serviceWorkerRegistration } : {})
      });

      if (currentToken) {
        console.log("FCM Token Acquired:", currentToken);
        const userRef = doc(firestore, collectionName, user.uid);
        await updateDoc(userRef, {
          fcmTokens: arrayUnion(currentToken)
        });
        setShowPrompt(false);
      }
    } catch (err) {
      console.error('Failed to get FCM token:', err);
    }
  };

  const handleAllow = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await requestAndSaveToken();
        toast({ title: 'Notifications Enabled!' });
      } else {
        setShowPrompt(false);
      }
    } catch (err) {
      console.error("Permission request failed", err);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 bg-indigo-950 text-white p-5 rounded-[2rem] shadow-2xl z-[100] flex items-start gap-4 animate-in slide-in-from-bottom-10 border-4 border-white/10 backdrop-blur-xl">
      <div className="bg-indigo-500/20 p-3 rounded-2xl shrink-0">
        <BellRing className="h-6 w-6 text-indigo-400" />
      </div>
      <div className="flex-1">
        <h4 className="font-black uppercase tracking-tighter text-sm">Stay Updated?</h4>
        <p className="text-xs text-indigo-200/70 mt-1 mb-4 leading-relaxed font-medium">
          Get instant alerts for attendance, fees, and school announcements.
        </p>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-white text-indigo-900 hover:bg-indigo-100 font-bold px-6 rounded-xl h-9" 
            onClick={handleAllow}
          >
            Allow
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-indigo-300 hover:text-white hover:bg-white/10 font-bold px-4 rounded-xl h-9" 
            onClick={() => setShowPrompt(false)}
          >
            Not Now
          </Button>
        </div>
      </div>
      <button 
        onClick={() => setShowPrompt(false)} 
        className="text-indigo-400 hover:text-white transition-colors"
      >
        <X className="h-5 w-5"/>
      </button>
    </div>
  );
}