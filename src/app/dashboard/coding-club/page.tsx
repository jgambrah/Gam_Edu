'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LogicLabPage from './logic-lab/page';
import PythonAcademyPage from './python-academy/page';
import { Code, Bot, Puzzle, ExternalLink, Play, Maximize2, Sparkles, Terminal } from 'lucide-react';
import CreditBalance from '@/components/CreditBalance';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

// A curated list of beginner-friendly public Scratch projects
const STARTER_PROJECTS = [
  { id: "60917032", title: "Starter: Move & Jump", desc: "Basic movement controls" },
  { id: "10128407", title: "Starter: Draw & Paint", desc: "Drawing with the pen tool" },
  { id: "1026256",  title: "Starter: Music Maker", desc: "Play sounds and music" },
];

export default function CodingClubPage() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 p-6 relative rounded-3xl border border-slate-900 shadow-2xl overflow-hidden flex flex-col">
      {/* Ambient glowing blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-fuchsia-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 space-y-6 flex-1 flex flex-col min-h-0">
        {/* Deep fuchsia/indigo cyber hacker header banner */}
        <div className="bg-gradient-to-r from-fuchsia-950/20 via-slate-900 to-indigo-950/20 border border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          {/* subtle interior glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shadow-lg shadow-fuchsia-500/10">
              <Code className="w-8 h-8 text-fuchsia-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Coding & Logic Hub
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Explore different ways to code, from visual Scratch blocks to advanced Python development.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-end">
            <CreditBalance />
          </div>
        </div>

        <Tabs defaultValue="scratch" className="w-full flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-900 border border-slate-800/60 rounded-2xl shrink-0">
            <TabsTrigger value="scratch" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-fuchsia-500/20">
              <Puzzle className="mr-2 h-4 w-4" /> Scratch Playground
            </TabsTrigger>
            <TabsTrigger value="logic_lab" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-fuchsia-500/20">
              <Bot className="mr-2 h-4 w-4" /> Logic Lab (Python)
            </TabsTrigger>
            <TabsTrigger value="python_academy" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-violet-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-fuchsia-500/20">
              <Code className="mr-2 h-4 w-4" /> Python Academy
            </TabsTrigger>
          </TabsList>

          {/* ===== SCRATCH TAB ===== */}
          <TabsContent
            value="scratch"
            className="mt-6 flex-1 flex flex-col data-[state=inactive]:hidden min-h-[600px]"
          >
            <Card className="flex-1 flex flex-col overflow-hidden border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-3xl shadow-2xl">
              {/* Header */}
              <div className="bg-slate-950/80 border-b border-slate-900/60 py-4 px-6 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                    <Puzzle className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-md font-black uppercase tracking-tight text-white">Scratch Studio</h2>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">
                      Interactive Visual Coding Playground
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border border-orange-500/25">Free sandbox</Badge>
              </div>

              {/* Body: split into project viewer + launch panel */}
              <div className="flex-1 p-0 flex flex-col lg:flex-row overflow-hidden min-h-0">

                {/* LEFT: Embedded starter project */}
                <div className="flex-1 bg-slate-950 flex flex-col overflow-hidden relative">
                  <div className="bg-slate-900/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-950 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                      <span className="text-[10px] font-mono text-slate-500 ml-2">scratch_player_v4.2.sh</span>
                    </div>
                    <span className="text-[9px] uppercase font-black tracking-widest text-orange-400 flex items-center gap-1.5">
                      <Play className="h-3 w-3 fill-orange-400 text-orange-400 animate-pulse" /> Live Preview
                    </span>
                  </div>
                  <iframe
                    src="https://turbowarp.org/60917032/embed"
                    className="w-full flex-grow border-none bg-slate-950"
                    allowFullScreen
                    allow="geolocation; microphone; camera; midi; bluetooth"
                    title="Scratch Starter Project"
                    style={{ minHeight: '400px' }}
                  />
                </div>

                {/* RIGHT: Launch panel for the full editor */}
                <div className="w-full lg:w-80 bg-slate-950/40 backdrop-blur-md border-t lg:border-t-0 lg:border-l border-slate-900/80 flex flex-col p-6 gap-6 shrink-0 justify-between">
                  <div className="space-y-6">
                    {/* Create section */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">🎨 Create Your Own</p>
                      <p className="text-xs text-slate-450 leading-relaxed text-slate-400">
                        Open the full Scratch block workspace in a new tab to create custom stories, paint animations, or build games.
                      </p>
                      
                      <a
                        href="https://scratch.mit.edu/projects/editor/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-650 hover:to-amber-655 text-white font-bold h-11 rounded-xl transition-all text-sm shadow-md shadow-orange-500/10 active:scale-95"
                      >
                        <Maximize2 className="h-4 w-4" />
                        Open Scratch Editor
                      </a>
                      
                      <a
                        href="https://turbowarp.org/editor"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 rounded-xl h-11 transition-all text-sm active:scale-95"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Open TurboWarp Editor
                      </a>
                    </div>

                    {/* Starter projects */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">⭐ Starter Templates</p>
                      <div className="space-y-2">
                        {STARTER_PROJECTS.map((project) => (
                          <a
                            key={project.id}
                            href={`https://turbowarp.org/${project.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col w-full bg-slate-900/50 hover:bg-slate-900 border border-slate-850 hover:border-orange-500/40 p-3 rounded-xl transition-all group text-left shadow-sm"
                          >
                            <span className="text-xs font-bold text-slate-200 group-hover:text-orange-400 transition-colors">{project.title}</span>
                            <span className="text-[10px] text-slate-550 text-slate-500 mt-0.5">{project.desc}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl">
                    <p className="text-[10px] text-orange-300 leading-relaxed flex gap-1.5 items-start font-medium">
                      <Sparkles className="h-3.5 w-3.5 text-orange-400 shrink-0 mt-0.5 animate-pulse" />
                      <span>Build your Scratch project, export its ID, and compile complex mechanics inside your web browser.</span>
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ===== LOGIC LAB TAB ===== */}
          <TabsContent
            value="logic_lab"
            className="mt-6 data-[state=inactive]:hidden flex-grow"
          >
            <LogicLabPage />
          </TabsContent>

          {/* ===== PYTHON ACADEMY TAB ===== */}
          <TabsContent
            value="python_academy"
            className="mt-6 data-[state=inactive]:hidden flex-grow"
          >
            <PythonAcademyPage />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}