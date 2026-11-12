'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import {
  isDeveloperReviewer,
  loadLocalReviewOverrides,
  saveCachedViewerEmail,
  saveLocalReviewOverrides,
  type ReviewOverrides,
} from '@/lib/story-library/quarantine';

/**
 * Authenticated wrapper around LibraryDashboard that:
 *   1. Syncs reading progress (In Progress, Finished) and Favourites to `users/{uid}.storySparkShelf`.
 *   2. Passes `viewerEmail` (`user?.email`) and syncs `library_meta/review_overrides` for the 48-hour
 *      developer quarantine (`jamesgambrah@gmail.com`), allowing one-click Hold/Flag or Early Release
 *      across all schools without introducing any Firebase imports into `LibraryDashboard` itself.
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

  const [overrides, setOverrides] = useState<ReviewOverrides>(() => loadLocalReviewOverrides());
  const viewerEmail = user?.email ?? null;

  useEffect(() => {
    saveCachedViewerEmail(viewerEmail);
  }, [viewerEmail]);

  // Pull global review quarantine overrides (`library_meta/review_overrides`) once per session
  useEffect(() => {
    if (!firestore || !user?.uid) return;
    let cancelled = false;
    const overridesRef = doc(firestore, 'library_meta', 'review_overrides');
    getDoc(overridesRef)
      .then((snap) => {
        if (cancelled || !snap.exists()) return;
        const data = snap.data() as Partial<ReviewOverrides>;
        const next: ReviewOverrides = {
          heldKeys: Array.isArray(data.heldKeys) ? data.heldKeys.filter((x): x is string => typeof x === 'string') : [],
          approvedKeys: Array.isArray(data.approvedKeys)
            ? data.approvedKeys.filter((x): x is string => typeof x === 'string')
            : [],
          updatedAt: typeof data.updatedAt === 'number' ? data.updatedAt : Date.now(),
        };
        setOverrides(next);
        saveLocalReviewOverrides(next);
      })
      .catch(() => {
        /* offline or rules-restricted: fallback to local overrides */
      });
    return () => {
      cancelled = true;
    };
  }, [firestore, user?.uid]);

  const persistOverrides = useCallback(
    async (next: ReviewOverrides) => {
      setOverrides(next);
      saveLocalReviewOverrides(next);
      if (!firestore || !isDeveloperReviewer(viewerEmail)) return;
      try {
        await setDoc(doc(firestore, 'library_meta', 'review_overrides'), {
          heldKeys: next.heldKeys,
          approvedKeys: next.approvedKeys,
          updatedAt: Date.now(),
          updatedBy: viewerEmail,
        });
      } catch {
        /* local storage preserves state if offline */
      }
    },
    [firestore, viewerEmail],
  );

  const handleToggleHoldStory = useCallback(
    (storyKey: string, nextHold: boolean) => {
      const heldSet = new Set(overrides.heldKeys);
      const approvedSet = new Set(overrides.approvedKeys);
      if (nextHold) {
        heldSet.add(storyKey);
        approvedSet.delete(storyKey);
      } else {
        heldSet.delete(storyKey);
      }
      void persistOverrides({
        heldKeys: [...heldSet],
        approvedKeys: [...approvedSet],
        updatedAt: Date.now(),
      });
    },
    [overrides, persistOverrides],
  );

  const handleApproveStoryEarly = useCallback(
    (storyKey: string) => {
      const heldSet = new Set(overrides.heldKeys);
      const approvedSet = new Set(overrides.approvedKeys);
      heldSet.delete(storyKey);
      approvedSet.add(storyKey);
      void persistOverrides({
        heldKeys: [...heldSet],
        approvedKeys: [...approvedSet],
        updatedAt: Date.now(),
      });
    },
    [overrides, persistOverrides],
  );

  const heldStoryKeys = useMemo(() => new Set(overrides.heldKeys), [overrides.heldKeys]);
  const approvedEarlyStoryKeys = useMemo(() => new Set(overrides.approvedKeys), [overrides.approvedKeys]);

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

  return (
    <LibraryDashboard
      activeAgeTier={activeAgeTier}
      defaultStage={defaultStage}
      viewerEmail={viewerEmail}
      heldStoryKeys={heldStoryKeys}
      approvedEarlyStoryKeys={approvedEarlyStoryKeys}
      onToggleHoldStory={handleToggleHoldStory}
      onApproveStoryEarly={handleApproveStoryEarly}
    />
  );
}
