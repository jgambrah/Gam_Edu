'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Atom, Sparkles } from 'lucide-react';

export default function JuniorScienceWorld({ schoolId }: { schoolId: string }) {
  return (
    <Card className="rounded-[60px] border-8 border-blue-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-blue-500 p-10 text-white text-center">
        <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <Atom className="h-12 w-12" />
          Science World
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-8 py-20">
          <Sparkles className="h-24 w-24 text-blue-300 animate-pulse" />
          <h3 className="text-3xl font-black text-blue-600">Coming Soon!</h3>
          <p className="text-xl text-slate-600 max-w-md">
            Explore nature, animals, weather, and amazing science facts! 
            Exciting experiments are being prepared.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
