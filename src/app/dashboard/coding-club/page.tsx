'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogicLabPage from './logic-lab/page';
import PythonAcademyPage from './python-academy/page';
import { Code, Bot, Puzzle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CodingClubPage() {
  return (
    <div className="space-y-6 flex flex-col h-full">
       <Card className="border-t-4 border-t-purple-600 shadow-sm shrink-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Code className="h-6 w-6 text-purple-600" />
            Coding & Logic Hub
          </CardTitle>
          <CardDescription>
            Explore different ways to code, from visual blocks to text-based Python.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Tabs defaultValue="scratch" className="w-full flex-1 flex flex-col overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 shrink-0">
          <TabsTrigger value="scratch">
            <Puzzle className="mr-2 h-4 w-4" /> Scratch Playground
          </TabsTrigger>
          <TabsTrigger value="logic_lab">
            <Bot className="mr-2 h-4 w-4" /> Logic Lab (Python)
          </TabsTrigger>
          <TabsTrigger value="python_academy">
             <Code className="mr-2 h-4 w-4" /> Python Academy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="scratch" className="mt-6 flex-1 flex flex-col overflow-hidden min-h-[600px]">
           <Card className="flex-1 flex flex-col overflow-hidden border-2 border-orange-100 shadow-xl rounded-[2rem] bg-white">
              <CardHeader className="bg-orange-500 text-white py-3 px-6 flex flex-row justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-xl">
                        <Puzzle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black uppercase tracking-tight">Scratch Studio</CardTitle>
                        <CardDescription className="text-orange-100 text-[10px] uppercase font-bold tracking-widest">Integrated Creative Coding</CardDescription>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" asChild className="h-8 text-[10px] font-black uppercase tracking-widest bg-white text-orange-600 hover:bg-orange-50 border-none shadow-md">
                        <Link href="https://turbowarp.org/editor" target="_blank">
                            Open External <ExternalLink className="ml-1 h-3 w-3" />
                        </Link>
                    </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 relative bg-slate-900">
                <iframe 
                    src="https://turbowarp.org/editor" 
                    className="w-full h-full border-none"
                    allowtransparency="true"
                    allowFullScreen={true}
                    allow="geolocation; microphone; camera; midi; bluetooth"
                    title="Scratch Editor"
                />
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="logic_lab" className="mt-6 flex-1 flex flex-col overflow-auto min-h-[600px]">
           <LogicLabPage />
        </TabsContent>

         <TabsContent value="python_academy" className="mt-6 flex-1 flex flex-col overflow-auto min-h-[600px]">
           <PythonAcademyPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
