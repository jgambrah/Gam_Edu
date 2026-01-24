
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, Sparkles } from 'lucide-react';

export default function MathPlayground({ schoolId }: { schoolId: string }) {
  return (
    <Card className="rounded-[60px] border-8 border-emerald-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-emerald-500 p-10 text-white text-center">
        <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <Calculator className="h-12 w-12" />
          Math Playground
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-8 py-20">
          <Sparkles className="h-24 w-24 text-emerald-300 animate-pulse" />
          <h3 className="text-3xl font-black text-emerald-600">Coming Soon!</h3>
          <p className="text-xl text-slate-600 max-w-md">
            Numbers and counting adventures are on the way! 
            Practice addition, subtraction, and more with fun games.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
