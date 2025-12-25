
'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Code, MousePointerClick, Youtube, BrainCircuit, Cpu, Play, Palette, Image as ImageIcon, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// --- DYNAMICALLY IMPORT THE BLOCKLY EDITOR ---
const BlocklyEditor = dynamic(
  () => import('@/components/BlocklyEditor'), 
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full bg-slate-50 border rounded-lg text-slate-400 gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        Loading Block Editor...
      </div>
    )
  }
);

// --- NEW SCRATCH-LIKE UI ---
export default function CodingClubPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-4">
      {/* Header Bar */}
      <div className="flex justify-between items-center bg-white p-2 rounded-lg border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded text-orange-600 font-bold flex items-center gap-2">
            <Code className="h-5 w-5" /> 
            <span>Block-Based Game Lab</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
                <Link href="/dashboard/coding-club/logic-lab">Logic Lab</Link>
            </Button>
            <Button variant="outline" size="sm">
                 <Link href="/dashboard/coding-club/python-academy">Python Academy</Link>
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2 fill-current" /> Run Project
            </Button>
        </div>
      </div>
      
      {/* Main Workspace */}
      <div className="flex-1 grid grid-cols-12 gap-4 min-h-0">

        {/* Left: Blockly Toolbox & Workspace */}
        <div className="col-span-12 lg:col-span-7 flex flex-col h-full">
            <BlocklyEditor />
        </div>

        {/* Right: Stage and Asset Panels */}
        <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-4 h-full">
          
          {/* Top-Right: The Stage */}
          <Card className="row-span-1 flex flex-col shadow-lg border-2 border-slate-200">
            <CardHeader className="bg-slate-50 border-b py-2 px-4">
              <CardTitle className="text-base text-center">Stage</CardTitle>
            </CardHeader>
            <CardContent className="p-2 flex-1 bg-slate-100 flex items-center justify-center">
              {/* p5.js canvas will go here */}
              <div className="w-full h-full bg-white rounded-md flex items-center justify-center text-slate-300">
                <span>Game Canvas</span>
              </div>
            </CardContent>
          </Card>

          {/* Bottom-Right: Sprites & Backdrops */}
          <div className="row-span-1 grid grid-cols-2 gap-4 min-h-0">
             <Card className="flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <UserIcon className="h-4 w-4 text-blue-500"/> Sprites
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto text-center text-xs text-muted-foreground pt-4">
                    Select a character...
                </CardContent>
             </Card>
              <Card className="flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-green-500"/> Backdrops
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto text-center text-xs text-muted-foreground pt-4">
                    Select a background...
                </CardContent>
             </Card>
          </div>
          
        </div>
      </div>
    </div>
  );
}

