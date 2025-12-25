// src/app/dashboard/senior-academy/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// We use a dynamic import to prevent any Blockly/p5 errors from blocking the rest of the app
const ScratchEngine = dynamic(
  () => import('@/components/ScratchEngine'), // Ensure this path matches where your component is
  { 
    ssr: false, 
    loading: () => (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-white font-bold">Loading Studio...</p>
      </div>
    )
  }
);

export default function SeniorAcademyPage() {
  return (
    <main className="h-screen w-full">
      <ScratchEngine />
    </main>
  );
}
