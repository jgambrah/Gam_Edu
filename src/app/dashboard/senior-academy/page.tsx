'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Use dynamic import to safely load the heavy Blockly/p5 components
const ScratchEngine = dynamic(
  () => import('@/components/ScratchEngine'), 
  { 
    ssr: false, 
    loading: () => (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-white font-bold">Initializing Studio...</p>
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
