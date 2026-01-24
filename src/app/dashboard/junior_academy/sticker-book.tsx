
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Sparkles, Star } from 'lucide-react';

export default function StickerBook({ schoolId }: { schoolId: string }) {
  return (
    <Card className="rounded-[60px] border-8 border-yellow-100 shadow-xl overflow-hidden bg-white">
      <CardHeader className="bg-yellow-500 p-10 text-white text-center">
        <CardTitle className="text-4xl font-black uppercase tracking-tighter flex items-center justify-center gap-4">
          <Trophy className="h-12 w-12" />
          Sticker Book & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center gap-8 py-20">
          <div className="flex gap-4">
            <Star className="h-16 w-16 text-yellow-300 animate-bounce" style={{ animationDelay: '0s' }} />
            <Sparkles className="h-24 w-24 text-yellow-400 animate-pulse" />
            <Star className="h-16 w-16 text-yellow-300 animate-bounce" style={{ animationDelay: '0.3s' }} />
          </div>
          <h3 className="text-3xl font-black text-yellow-600">Coming Soon!</h3>
          <p className="text-xl text-slate-600 max-w-md">
            Collect stickers and earn rewards as you complete activities! 
            Your reward collection is being prepared.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
