'use client';
import { useEffect } from 'react';
import { claimAutoReload, isStaleBuildError, reloadAppFresh } from '@/lib/app-recovery';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  // A phone still running an older build after an update: reload once by itself to get the new version.
  useEffect(() => {
    if (!isStaleBuildError(error)) return;
    let storage: Storage | null = null;
    try { storage = window.sessionStorage; } catch { storage = null; }
    if (claimAutoReload(storage)) void reloadAppFresh();
  }, [error]);

  return (
    <div className="p-10 bg-white border-8 border-black rounded-[3rem] text-center">
      <h2 className="text-3xl font-black uppercase mb-4">Dr. GAM hit a snag!</h2>
      <p className="text-red-500 font-bold mb-6">{error.message}</p>
      <button onClick={() => reset()} className="px-8 py-3 bg-black text-white rounded-2xl font-black uppercase">Try Again</button>
      {/* The installed phone app has no browser refresh button, so offer one here. */}
      <button onClick={() => { void reloadAppFresh(); }} className="mt-3 block mx-auto px-8 py-3 bg-white text-black border-4 border-black rounded-2xl font-black uppercase">
        Reload App
      </button>
    </div>
  );
}
