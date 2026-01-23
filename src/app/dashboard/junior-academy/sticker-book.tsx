'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trophy, Gift, Star, BookOpen, Calculator, Atom, Palette, ChevronRight 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// --- JUNIOR REWARDS COMPONENT ---
export default function StickerBook({ schoolId }: { schoolId: string | null }) {
    const { user } = useUser(); 
    const firestore = useFirestore();
    const [activeFilter, setActiveFilter] = useState<'all' | 'math' | 'literacy' | 'science' | 'art'>('all');

    // SaaS & User-specific Query
    const stickerQuery = useMemoFirebase(() => 
        (user && firestore && schoolId) ? query(
            collection(firestore, 'junior_stickers'), 
            where('userId', '==', user.uid), 
            where('schoolId', '==', schoolId),
            orderBy('earnedAt', 'desc')
        ) : null, [firestore, user, schoolId]
    );
    const { data: stickers, isLoading } = useCollection<any>(stickerQuery);

    // Stats Calculation
    const stats = useMemo(() => ({ // Memoize this calculation
        total: stickers?.length || 0,
        math: stickers?.filter(s => s.category === 'math' || s.type === 'math').length || 0,
        literacy: stickers?.filter(s => s.category === 'literacy' || s.name?.includes('ABC') || s.name?.includes('Word')).length || 0,
        science: stickers?.filter(s => s.category === 'science').length || 0,
        art: stickers?.filter(s => s.category === 'art').length || 0,
    }), [stickers]);

    // Progress Bar Mapping
    const progressTracks = useMemo(() => [
        { label: 'Math Whiz', count: stats.math, color: 'bg-orange-500', icon: <Calculator className="w-4 h-4" /> },
        { label: 'Reading Hero', count: stats.literacy, color: 'bg-purple-500', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Science Pro', count: stats.science, color: 'bg-blue-500', icon: <Atom className="w-4 h-4" /> },
        { label: 'Art Legend', count: stats.art, color: 'bg-pink-500', icon: <Palette className="w-4 h-4" /> },
    ], [stats]);

    // Tier Logic
    const getTier = (count: number) => {
        if (count >= 20) return { label: 'Grand Master', icon: '👑', color: 'from-purple-500 to-indigo-600' };
        if (count >= 10) return { label: 'Gold Tier', icon: '🥇', color: 'from-yellow-400 to-orange-500' };
        if (count >= 5) return { label: 'Silver Tier', icon: '🥈', color: 'from-slate-300 to-slate-500' };
        return { label: 'Bronze Tier', icon: '🥉', color: 'from-orange-400 to-amber-700' };
    };

    const currentTier = getTier(stats.total);

    const filteredStickers = useMemo(() => activeFilter === 'all' 
        ? stickers 
        : stickers?.filter(s => {
            const cat = s.category || s.type;
            return cat === activeFilter;
        }), [activeFilter, stickers]);

    if (isLoading) return <div className="p-20 text-center animate-pulse text-yellow-500 font-bold">Opening Sticker Book...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            
            {/* 1. HERO TROPHY CARD */}
            <div className={`bg-gradient-to-br ${currentTier.color} rounded-[50px] p-10 text-white shadow-2xl relative overflow-hidden`}>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left space-y-2">
                        <Badge className="bg-white/20 text-white border-none px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">My Progress</Badge>
                        <h3 className="text-5xl font-black tracking-tight">Hall of Fame</h3>
                        <p className="text-xl font-bold opacity-90">You have collected {stats.total} magical stickers!</p>
                        <div className="mt-6 inline-flex items-center gap-3 bg-black/20 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/10">
                            <span className="text-4xl">{currentTier.icon}</span>
                            <span className="font-black text-xl uppercase tracking-tighter">{currentTier.label}</span>
                        </div>
                    </div>
                    
                    {/* MINI STATS GRID */}
                    <div className="grid grid-cols-2 gap-3">
                        {['math', 'literacy'].map((cat: any) => (
                            <div key={cat} className="bg-white/10 p-4 rounded-[30px] border border-white/10 text-center min-w-[100px]">
                                <div className="text-2xl font-black">{(stats as any)[cat]}</div>
                                <div className="text-[10px] font-bold uppercase opacity-60 tracking-widest">{cat}</div>
                            </div>
                        ))}
                    </div>
                </div>
                <Trophy className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 rotate-12" />
            </div>

            {/* 2. SUBJECT PROGRESS TRACKER */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {progressTracks.map((p) => (
                    <Card key={p.label} className="rounded-[35px] border-4 border-slate-50 shadow-sm overflow-hidden bg-white">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2 font-black text-slate-700 uppercase text-xs tracking-tight">
                                    <span className={`p-2 rounded-xl ${p.color} text-white`}>{p.icon}</span>
                                    {p.label}
                                </div>
                                <span className="text-[10px] font-black text-slate-400">{p.count} / 10 to Level Up</span>
                            </div>
                            <div className="h-4 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-50 shadow-inner">
                                <div 
                                    className={`h-full ${p.color} transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(0,0,0,0.1)]`} 
                                    style={{ width: `${Math.min((p.count / 10) * 100, 100)}%` }} 
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* 3. STICKER COLLECTION GRID */}
            <div className="space-y-6">
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {['all', 'math', 'literacy', 'science', 'art'].map((f) => (
                        <button 
                            key={f} 
                            onClick={() => setActiveFilter(f as any)}
                            className={`px-8 py-3 rounded-2xl capitalize font-black text-sm transition-all whitespace-nowrap ${
                                activeFilter === f 
                                ? 'bg-slate-900 text-white shadow-xl scale-105' 
                                : 'bg-white text-slate-400 border-2 border-slate-100 hover:bg-slate-50'
                            }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                {!filteredStickers || filteredStickers.length === 0 ? (
                    <div className="text-center py-24 bg-white rounded-[60px] border-8 border-dashed border-slate-50">
                        <Gift className="h-20 w-20 mx-auto mb-4 text-slate-100 animate-bounce" />
                        <h3 className="text-2xl font-black text-slate-300">Keep playing to earn stickers!</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
                        {filteredStickers.map((s: any, idx: number) => (
                            <div 
                                key={s.id} 
                                className="group relative aspect-square bg-white rounded-[35px] shadow-lg border-b-8 border-slate-100 flex flex-col items-center justify-center p-2 hover:-translate-y-2 transition-all cursor-help"
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                <div className="text-5xl mb-2 transition-transform group-hover:scale-125 duration-300 drop-shadow-md">
                                    {s.emoji}
                                </div>
                                <span className="text-[10px] text-center leading-tight font-black text-slate-400 uppercase tracking-tighter">
                                    {s.name || 'New Sticker'}
                                </span>
                                
                                {/* Glow Effect on Hover */}
                                <div className="absolute inset-0 bg-yellow-400/5 rounded-[35px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 4. JUNIOR ENCOURAGEMENT FOOTER */}
            <div className="p-8 bg-yellow-50 rounded-[40px] border-4 border-dashed border-yellow-200 text-center">
                <p className="text-yellow-700 font-bold text-lg flex items-center justify-center gap-2">
                    <Star className="fill-yellow-500 text-yellow-500" />
                    Complete more lessons to fill your book with magic!
                    <Star className="fill-yellow-500 text-yellow-500" />
                </p>
            </div>
        </div>
    );
}
