
'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Code, Bot, Rocket, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScratchEngine from '@/components/ScratchEngine';

export default function CodingClubPage() {
  return (
    <div className="space-y-6">
       <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-3xl">
            <Code className="h-8 w-8" />
            <span>Coding Club</span>
          </CardTitle>
          <CardDescription className="text-indigo-100">
            From visual blocks to real-world Python, start your coding adventure here.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="game-lab" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="game-lab" className="flex flex-col gap-2 p-4 h-full">
            <Gamepad2 />
            <span className="font-bold">Block-Based Game Lab</span>
            <span className="text-xs font-normal text-muted-foreground">Create games with visual blocks</span>
          </TabsTrigger>
          <TabsTrigger value="logic-lab" className="flex flex-col gap-2 p-4 h-full">
            <Bot />
            <span className="font-bold">Logic Lab</span>
            <span className="text-xs font-normal text-muted-foreground">Learn Python logic puzzles</span>
          </TabsTrigger>
          <TabsTrigger value="python-academy" className="flex flex-col gap-2 p-4 h-full">
            <Rocket />
            <span className="font-bold">Python Pro Academy</span>
            <span className="text-xs font-normal text-muted-foreground">Master text-based Python</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="game-lab" className="mt-6">
          <Card>
            <CardHeader>
                <CardTitle>Block-Based Game Lab</CardTitle>
                <CardDescription>Build your own games and animations by dragging and dropping code blocks, just like Scratch!</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="h-[calc(100vh-20rem)] w-full rounded-lg overflow-hidden border">
                    <ScratchEngine />
                </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="logic-lab">
            <Card className="text-center p-8">
                <CardHeader>
                    <Bot className="mx-auto h-12 w-12 text-slate-400 mb-4"/>
                    <CardTitle>Logic Lab</CardTitle>
                    <CardDescription>Solve puzzles and learn the fundamentals of Python logic by snapping together code blocks in sequence.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/coding-club/logic-lab">Launch Logic Lab</Link>
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="python-academy">
             <Card className="text-center p-8">
                <CardHeader>
                    <Rocket className="mx-auto h-12 w-12 text-slate-400 mb-4"/>
                    <CardTitle>Python Pro Academy</CardTitle>
                    <CardDescription>Transition from blocks to real-world Python code with our guided curriculum, from basic syntax to advanced OOP concepts.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/coding-club/python-academy">Launch Python Academy</Link>
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
