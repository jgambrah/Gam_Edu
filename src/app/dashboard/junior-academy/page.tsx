
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, 
  Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, Handshake, Milestone, 
  Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, 
  Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, Pen, Apple, Sun, 
  CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, 
  Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play, 
  Flag, GraduationCap, Monitor, Zap, CircleDot,
  BotMessageSquare as Bot, Shirt, FlaskConical, Bed, Eye, TrendingUp, Leaf, Tree, User as UserIcon, Hand, BrainCircuit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Correct imports for sub-modules
import NumeracyZone from './numeracy-zone';
import MathWorld from './math-world';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import PhonicsWorld from './phonics-world';
import type { DictionaryWord, LessonCard } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Label } from '@/components/ui/label';
import LifeSkillsZone from './life-skills-zone';
import WritingCanvas from './writing-canvas'; 
import * as constants from '@/lib/constants';

// Bring in StorySpark, but not VoiceCoach
import { StorySpark } from './voice-coach';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper to get client app
function getClientApp() {
    if (getApps().length) return getApp();
    return initializeApp(firebaseConfig);
}

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();
    const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
    const { toast } = useToast();

    // --- ADDED: PostMessage Event Listener ---
    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            // IMPORTANT: Check the origin of the message for security
            if (event.origin !== "https://nursery-bloom-825774943692.us-west1.run.app") {
                return;
            }

            const { type, payload } = event.data;

            if (type === 'saveToStorage' && payload.path && payload.dataUrl) {
                toast({ title: "Saving...", description: "Uploading your creation to the cloud." });
                try {
                    const app = getClientApp();
                    const storage = getStorage(app);
                    const storageRef = ref(storage, payload.path);
                    
                    const uploadResult = await uploadString(storageRef, payload.dataUrl, 'data_url');
                    const downloadURL = await getDownloadURL(uploadResult.ref);
                    
                    toast({ title: "Saved!", description: "Your work is saved securely." });

                    // Optionally send a confirmation back to the iframe
                    // event.source?.postMessage({ type: 'saveSuccess', payload: { downloadURL } }, event.origin);
                } catch (error: any) {
                    console.error("Storage Save Error:", error);
                    toast({ variant: 'destructive', title: 'Save Failed', description: error.message });
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [toast]);

    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">The Magic of Learning! ✨</p>
                        </div>
                    </div>
                    {schoolId && <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>}
                </header>

                <Tabs defaultValue="bloom" className="w-full">
                    <TabsList className="grid w-full grid-cols-10 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="bloom" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Sparkles className="w-5 h-5"/>Nursery Bloom</TabsTrigger>
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pencil className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="phonics" className="rounded-2xl data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black flex flex-col items-center gap-1"><Ear className="w-5 h-5"/> Phonics</TabsTrigger>
                        <TabsTrigger value="numeracy" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Numeracy</TabsTrigger>
                        <TabsTrigger value="mathworld" className="rounded-2xl data-[state=active]:bg-sky-100 data-[state=active]:text-sky-700 font-black flex flex-col items-center gap-1"><BrainCircuit className="w-5 h-5"/> Math World</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="bloom" className="mt-0">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Nursery Bloom</CardTitle>
                                    <CardDescription>A dedicated learning suite for early years.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>This module has been moved to its own page for a better experience.</p>
                                    <Button asChild className="mt-4">
                                        <Link href="/dashboard/nursery-bloom">Go to Nursery Bloom</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="lifeskills" className="mt-0">{schoolId && <LifeSkillsZone />}</TabsContent>
                        <TabsContent value="writing" className="mt-0">{schoolId && <WritingCanvas onSound={() => {}} schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="stories" className="mt-0">{schoolId && <StorySpark canEdit={canEdit} schoolId={schoolId} />}</TabsContent>
                        <TabsContent value="phonics" className="mt-0">{schoolId && <PhonicsWorld />}</TabsContent>
                        <TabsContent value="numeracy" className="mt-0">{schoolId && <NumeracyZone />}</TabsContent>
                        <TabsContent value="mathworld" className="mt-0">{schoolId && <MathWorld />}</TabsContent>
                        <TabsContent value="science" className="mt-0">{schoolId && <JuniorScienceWorld />}</TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300">{schoolId && <ArtStudio schoolId={schoolId} />}</div></TabsContent>
                        <TabsContent value="rewards" className="mt-0">{schoolId && <StickerBook schoolId={schoolId} />}</TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
