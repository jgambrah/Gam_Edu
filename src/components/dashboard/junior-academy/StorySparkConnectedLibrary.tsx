'use client';

import { useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { LibraryDashboard, type StageFilterId } from '@/components/story-library/LibraryDashboard';
import {
  exportCloudShelf,
  mergeAndSaveCloudShelf,
  setActiveProgressUser,
  subscribeProgressChanges,
  type StoryShelfCloudPayload,
} from '@/lib/story-library/progress-store';

/**
 * Authenticated wrapper around LibraryDashboard that syncs reading progress (In Progress, Finished)
 * and Favourites to the user's Firestore profile (`users/{uid}.storySparkShelf`), so switching between
 * a home laptop, office desktop, or school tablet keeps every counter and shelf in sync.
 *
 * Keeps LibraryDashboard itself 100% free of Firebase imports so /story-spark-preview stays isolated.
 */
export function StorySparkConnectedLibrary({
  activeAgeTier,
  defaultStage = 'all',
}: {
  activeAgeTier?: string;
  defaultStage?: StageFilterId;
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const syncingFromRemote = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirtyRef = useRef(false);

  useEffect(() => {
    const uid = user?.uid ?? null;
    setActiveProgressUser(uid);
    if (!uid || !firestore) return;

    let cancelled = false;
    const userRef = doc(firestore, 'users', uid);

    const pushToCloud = async (payload: StoryShelfCloudPayload) => {
      try {
        await updateDoc(userRef, { storySparkShelf: payload });
      } catch {
        try {
          await setDoc(userRef, { storySparkShelf: payload }, { merge: true });
        } catch {
          /* offline or restricted: local storage still preserves progress */
        }
      }
    };

    // 1. Pull remote shelf once per session and union-merge with local device progress
    getDoc(userRef)
      .then(async (snap) => {
        if (cancelled) return;
        const remote = snap.exists() ? (snap.data()?.storySparkShelf as Partial<StoryShelfCloudPayload> | undefined) : undefined;
        syncingFromRemote.current = true;
        const { merged, needsUpload } = mergeAndSaveCloudShelf(remote, uid);
        syncingFromRemote.current = false;
        if (needsUpload && (Object.keys(merged.progress).length > 0 || merged.favourites.length > 0)) {
          await pushToCloud(merged);
        }
      })
      .catch(() => {
        syncingFromRemote.current = false;
      });

    // 2. Debounce-sync any local progress or favourite change up to Firestore
    const flushNow = () => {
      if (!dirtyRef.current) return;
      dirtyRef.current = false;
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
      const payload = exportCloudShelf(uid);
      void pushToCloud(payload);
    };

    const unsub = subscribeProgressChanges(() => {
      if (syncingFromRemote.current) return;
      dirtyRef.current = true;
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(flushNow, 1200);
    });

    const onVisibilityChange = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
        flushNow();
      }
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      cancelled = true;
      unsub();
      if (typeof document !== 'undefined') {
        document.removeEventListener('visibilitychange', onVisibilityChange);
      }
      flushNow();
    };
  }, [user?.uid, firestore]);

  return <LibraryDashboard activeAgeTier={activeAgeTier} defaultStage={defaultStage} />;
}
