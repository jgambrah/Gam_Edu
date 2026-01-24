
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ear, Sparkles } from 'lucide-react';

export default function PhonicsWorld({ schoolId }: { schoolId: string }) {
  return (
    <Card className="rounded-[60px] border-8 border-purple-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-purple-500 p-10 text-white text-center">
        <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <Ear className="h-12 w-12" />
          Phonics World
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-8 py-20">
          <Sparkles className="h-24 w-24 text-purple-300 animate-pulse" />
          <h3 className="text-3xl font-black text-purple-600">Coming Soon!</h3>
          <p className="text-xl text-slate-600 max-w-md">
            Get ready to learn letter sounds and phonics in a magical way! 
            Mr. Bloom is preparing something special for you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
