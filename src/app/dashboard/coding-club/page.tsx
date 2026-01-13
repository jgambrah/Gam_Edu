

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
    <div className="space-y-6">
       <Card className="border-t-4 border-t-purple-600 shadow-sm">
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
      <Tabs defaultValue="scratch" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
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
        <TabsContent value="scratch">
           <Card>
              <CardHeader>
                <CardTitle>Launch Scratch</CardTitle>
                <CardDescription>
                  Click the button below to open the official MIT Scratch creative coding environment in a new tab. Let your imagination run wild!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center p-10">
                <Link href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                    Open Scratch Editor <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
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
