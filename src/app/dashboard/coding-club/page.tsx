'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogicLabPage from './logic-lab/page';
import PythonAcademyPage from './python-academy/page';
import { Code, Bot, Puzzle, ExternalLink, Play, Maximize2 } from 'lucide-react';

// A curated list of beginner-friendly public Scratch projects
const STARTER_PROJECTS = [
  { id: "60917032", title: "Starter: Move & Jump", desc: "Basic movement controls" },
  { id: "10128407", title: "Starter: Draw & Paint", desc: "Drawing with the pen tool" },
  { id: "1026256",  title: "Starter: Music Maker", desc: "Play sounds and music" },
];

export default function CodingClubPage() {
  return (
    <div className="space-y-6 h-full flex flex-col">
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

      <Tabs defaultValue="scratch" className="w-full flex-1 flex flex-col min-h-0">
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

        {/* ===== SCRATCH TAB ===== */}
        <TabsContent
          value="scratch"
          className="mt-4 flex-1 flex flex-col data-[state=inactive]:hidden"
          style={{ minHeight: '600px' }}
        >
          <Card className="flex-1 flex flex-col overflow-hidden border-2 border-orange-100 shadow-xl rounded-[2rem] bg-white">
            {/* Header */}
            <CardHeader className="bg-orange-500 text-white py-3 px-6 flex flex-row items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <Puzzle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black uppercase tracking-tight">Scratch Studio</CardTitle>
                  <CardDescription className="text-orange-100 text-[10px] uppercase font-bold tracking-widest">
                    Interactive Coding Playground
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            {/* Body: split into project viewer + launch panel */}
            <CardContent className="flex-1 p-0 flex flex-col lg:flex-row overflow-hidden">

              {/* LEFT: Embedded starter project (guaranteed to work) */}
              <div className="flex-1 bg-slate-900 flex flex-col overflow-hidden">
                <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 shrink-0">
                  <Play className="h-3 w-3 text-orange-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Live Project Preview
                  </span>
                </div>
                <iframe
                  src="https://turbowarp.org/60917032/embed"
                  className="w-full flex-1 border-none"
                  allowFullScreen
                  allow="geolocation; microphone; camera; midi; bluetooth"
                  title="Scratch Starter Project"
                  style={{ minHeight: '400px' }}
                />
              </div>

              {/* RIGHT: Launch panel for the full editor */}
              <div className="w-full lg:w-72 bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-200 flex flex-col p-6 gap-6 shrink-0">

                {/* Create section */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🎨 Create Your Own</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Open the full Scratch editor to build your own projects with all blocks and tools.
                  </p>
                  
                  <a
                    href="https://scratch.mit.edu/projects/editor/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-orange-500 hover:bg-orange-400 active:scale-95 text-white font-black px-4 py-3 rounded-xl transition-all text-sm shadow-md shadow-orange-200"
                  >
                    <Maximize2 className="h-4 w-4" />
                    Open Scratch Editor
                  </a>
                  
                  <a
                    href="https://turbowarp.org/editor"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white hover:bg-slate-100 border-2 border-slate-200 text-slate-700 font-black px-4 py-3 rounded-xl transition-all text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Open TurboWarp Editor
                  </a>
                </div>

                {/* Starter projects */}
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">⭐ Starter Projects</p>
                  <div className="space-y-2">
                    {STARTER_PROJECTS.map((project) => (
                      <a
                        key={project.id}
                        href={`https://turbowarp.org/${project.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col w-full bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 px-3 py-2 rounded-xl transition-all group text-left"
                      >
                        <span className="text-xs font-bold text-slate-700 group-hover:text-orange-600">{project.title}</span>
                        <span className="text-[10px] text-slate-400">{project.desc}</span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="mt-auto p-3 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-[10px] text-orange-700 leading-relaxed">
                    💡 <strong>Tip:</strong> Build your project in the editor, then share it on Scratch to get a project ID you can embed here!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ===== LOGIC LAB TAB ===== */}
        <TabsContent
          value="logic_lab"
          className="mt-4 data-[state=inactive]:hidden"
          style={{ minHeight: '700px' }}
        >
          <LogicLabPage />
        </TabsContent>

        {/* ===== PYTHON ACADEMY TAB ===== */}
        <TabsContent
          value="python_academy"
          className="mt-4 data-[state=inactive]:hidden"
          style={{ minHeight: '700px' }}
        >
          <PythonAcademyPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}