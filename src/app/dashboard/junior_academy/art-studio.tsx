
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Sparkles } from 'lucide-react';

export default function ArtStudio({ schoolId }: { schoolId: string }) {
  return (
    <Card className="rounded-[60px] border-8 border-pink-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-pink-500 p-10 text-white text-center">
        <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <Palette className="h-12 w-12" />
          Art Studio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-8 py-20">
          <Sparkles className="h-24 w-24 text-pink-300 animate-pulse" />
          <h3 className="text-3xl font-black text-pink-600">Coming Soon!</h3>
          <p className="text-xl text-slate-600 max-w-md">
            Draw, paint, and create beautiful artwork! 
            Your digital canvas is being prepared with magic brushes.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
