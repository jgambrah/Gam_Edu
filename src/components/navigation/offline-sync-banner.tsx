'use client';

import React from 'react';
import { useOfflineSync } from '@/hooks/use-offline-sync';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OfflineSyncBanner() {
  const { isOnline, isSyncing, pendingCount, syncOfflineData } = useOfflineSync();

  if (isOnline && pendingCount === 0 && !isSyncing) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900 text-white px-4 py-2 text-xs font-bold shadow-md border-b border-white/10 flex items-center justify-between z-[100] animate-in slide-in-from-top-4 duration-300">
      {!isOnline ? (
        <div className="flex items-center gap-2 text-amber-300">
          <WifiOff className="h-4 w-4 animate-pulse shrink-0" />
          <span>Offline Mode Active — Attendance & grade entries will save locally to your device.</span>
        </div>
      ) : isSyncing ? (
        <div className="flex items-center gap-2 text-indigo-300">
          <RefreshCw className="h-4 w-4 animate-spin shrink-0" />
          <span>Syncing {pendingCount} offline entries to server...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{pendingCount} offline item(s) saved locally and ready to upload.</span>
        </div>
      )}

      {isOnline && pendingCount > 0 && (
        <Button
          size="sm"
          variant="secondary"
          onClick={syncOfflineData}
          disabled={isSyncing}
          className="h-7 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider transition-all shrink-0"
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
      )}
    </div>
  );
}
