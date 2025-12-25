
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScratchEngine from '@/components/ScratchEngine';
import { Code, Bot, Puzzle, Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';

// Use dynamic imports for the other heavy pages to prevent 404/crashing
const LogicLabPage = dynamic(() => import('./logic-lab/page'), { ssr: false });
const PythonAcademyPage = dynamic(() => import('./python-academy/page'), { ssr: false });

export default function CodingClubPage() {
  return (
    <div className="space-y-6 p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-sans">
      <Card className="border-t-8 border-t-purple-600 shadow-xl rounded-[32px] overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-white">
          <CardTitle className="flex items-center gap-3 text-3xl font-black text-slate-800">
            <div className="bg-purple-600 p-2 rounded-2xl shadow-lg">
                <Code className="h-8 w-8 text-white" />
            </div>
            Coding & Logic Academy
          </CardTitle>
          <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-14">
            Visual Blocks • Python Logic • Full Stack Development
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="scratch" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-20 bg-white p-2 rounded-[24px] shadow-lg border border-slate-100 mb-8">
          <TabsTrigger value="scratch" className="rounded-xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black">
            <Puzzle className="mr-2 h-5 w-5" /> Scratch Stage
          </TabsTrigger>
          <TabsTrigger value="logic_lab" className="rounded-xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black">
            <Bot className="mr-2 h-5 w-5" /> Logic Lab
          </TabsTrigger>
          <TabsTrigger value="python_academy" className="rounded-xl data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black">
            <Sparkles className="mr-2 h-5 w-5 text-yellow-400" /> Python Academy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scratch" className="animate-in fade-in zoom-in duration-500">
          <Card className="rounded-[40px] border-none shadow-2xl overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className='h-[calc(100vh-280px)] w-full'>
                <ScratchEngine />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logic_lab">
          <LogicLabPage />
        </TabsContent>

        <TabsContent value="python_academy">
          <PythonAcademyPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
