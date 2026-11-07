'use client';
import { LibraryDashboard } from '@/components/story-library/LibraryDashboard';

/**
 * Story Spark library PREVIEW. Self-contained: reads only static files under /story-spark-preview (sample stories),
 * never Firestore, Storage or any school data, so it is safe to show on a preview deployment. The production screen will
 * use the same components with the Firestore/Storage source.
 */
export default function StorySparkPreviewPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6" style={{ fontFamily: 'Nunito, system-ui, sans-serif' }}>
      <LibraryDashboard />
    </main>
  );
}
