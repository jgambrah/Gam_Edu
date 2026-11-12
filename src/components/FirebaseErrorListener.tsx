'use client';

import { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { toast } from '@/hooks/use-toast';

/** At most one notice of each kind in this many milliseconds, however many reads fail together. */
export const DATA_NOTICE_GAP_MS = 15 * 1000;

const READ_OPERATIONS = ['get', 'list'];
let lastNoticeAt: Record<'read' | 'write', number> = { read: 0, write: 0 };

/** Test hook: forget when the last notice was shown. */
export function resetDataNoticesForTests() {
  lastNoticeAt = { read: 0, write: 0 };
}

function isSignedIn(): boolean {
  try {
    return !!getAuth().currentUser;
  } catch {
    return false;
  }
}

/**
 * An invisible component that listens for database errors reported by the data hooks (useCollection, useDoc)
 * and the non-blocking save helpers.
 *
 * IT MUST NEVER THROW. It used to re-throw every reported error, and because it sits in the app's outer shell
 * that replaced the WHOLE app with the bare "Something went wrong!" screen whenever a single read failed on
 * any page (a permission refusal, a missing index, a listener closed at sign-out…). One list that cannot load
 * must not take the app down: the hook that failed already returns its error and empty data to its own page.
 *
 * Now: the error is logged, and a signed-in person gets one short notice.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      const operation = String(error?.request?.method || '');
      const kind: 'read' | 'write' = READ_OPERATIONS.includes(operation) ? 'read' : 'write';
      console.error(`[GAM Edu] Database ${kind} failed (${operation || 'unknown'} ${error?.request?.path || ''}):`, error);

      // Reads that stop because the person signed out are expected: nothing to tell anyone.
      if (!isSignedIn()) return;

      const now = Date.now();
      if (now - lastNoticeAt[kind] < DATA_NOTICE_GAP_MS) return;
      lastNoticeAt[kind] = now;

      try {
        if (kind === 'read') {
          toast({
            title: 'Some information could not be loaded',
            description: 'Part of this page may be empty. Check your internet connection and open the page again.',
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'Your change was not saved',
            description: 'Please check your internet connection and try again.',
          });
        }
      } catch {
        /* a notice must never break the app */
      }
    };

    errorEmitter.on('permission-error', handleError);
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // This component renders nothing.
  return null;
}
