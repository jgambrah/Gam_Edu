
'use client';

import { useState } from 'react';
import { useRole } from '@/context/role-context';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { 
  Mic, Calculator, BookOpen, Atom, Palette, Trophy, Sparkles, Rabbit, Music, Brain,
  Headphones
} from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoiceCoach, StorySpark } from './voice-coach';
import ArtStudio from './art-studio';
import JuniorScienceWorld from './science-world';
import MathPlayground from './math-playground';
import PhonicsWorld from './phonics-world';
import StickerBook from './sticker-book';

export default function JuniorCampusPage() {
  const { role } = useRole();
  const { schoolId } = useCurrentSchool();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');

  return (
    <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border-b-4 border-slate-200">
        <div className="bg-yellow-400 p-3 rounded-2xl shadow-inner"><Rabbit className="h-10 w-10 text-white" /></div>
        <div><h1 className="text-4xl font-extrabold text-slate-800">Junior Campus</h1><p className="text-slate-500 font-medium">Learn, Play, and Grow!</p></div>
      </div>
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="coach" className="w-full">
            <TabsList className="grid w-full grid-cols-8 h-24 bg-white p-2 rounded-2xl shadow-sm border-2 border-slate-100 mb-8 overflow-x-auto no-scrollbar">
                <TabsTrigger value="coach" className="rounded-xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Mic className="w-5 h-5"/> Voice Coach</TabsTrigger>
                <TabsTrigger value="phonics-world" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Sparkles className="w-5 h-5"/>Phonics World</TabsTrigger>
                <TabsTrigger value="math" className="rounded-xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                <TabsTrigger value="stories" className="rounded-xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                <TabsTrigger value="science" className="rounded-xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                <TabsTrigger value="art" className="rounded-xl data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                <TabsTrigger value="rewards" className="rounded-xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-bold flex flex-col items-center gap-1 text-xs md:text-sm"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
            </TabsList>
            
            <div className="min-h-[500px]">
                <TabsContent value="coach" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-pink-200">{schoolId && <VoiceCoach canEdit={canEdit} schoolId={schoolId} />}</div></TabsContent>
                <TabsContent value="phonics-world" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-purple-200">{schoolId && <PhonicsWorld schoolId={schoolId} />}</div></TabsContent>
                <TabsContent value="math" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-orange-200 relative">{schoolId && <MathPlayground schoolId={schoolId} />}</div></TabsContent>
                <TabsContent value="stories" className="mt-0">{schoolId && <StorySpark canEdit={canEdit} schoolId={schoolId} />}</TabsContent>
                <TabsContent value="science" className="mt-0"><div className="bg-white p-8 rounded-3xl shadow-xl border-b-8 border-sky-200">{schoolId && <JuniorScienceWorld schoolId={schoolId} />}</div></TabsContent>
                <TabsContent value="art" className="mt-0">
                    <div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300">
                        {schoolId && <ArtStudio schoolId={schoolId} />}
                    </div>
                </TabsContent>
                <TabsContent value="rewards" className="mt-0">{schoolId && <StickerBook schoolId={schoolId} />}</TabsContent>
            </div>
        </Tabs>
      </div>
    </div>
  );
}
