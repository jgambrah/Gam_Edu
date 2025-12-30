
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Bot, Puzzle, ExternalLink, Activity, Rabbit, GraduationCap, Rocket, BrainCircuit, Sigma, FlaskConical, BookOpenCheck, Gamepad2, Clapperboard } from 'lucide-react';
import Link from 'next/link';

const clubModules = [
  {
    path: 'https://nursery-bloom-early-english-explorer-296289880836.us-west1.run.app',
    title: 'Early Years',
    icon: Rabbit,
    description: 'Explore foundational literacy and numeracy in a fun, interactive environment.',
    isExternal: true,
  },
  {
    path: '/dashboard/junior-academy',
    title: 'Junior Campus',
    icon: GraduationCap,
    description: 'Engaging activities for phonics, math, science, and creative arts for young learners.',
    isExternal: false,
  },
  {
    path: '/dashboard/senior-academy',
    title: 'Senior Academy',
    icon: Rocket,
    description: 'Advanced modules for Math, English, and Science for secondary students.',
    isExternal: false,
  },
  {
    path: '/dashboard/study-club',
    title: 'Study Club (AI Tutor)',
    icon: BrainCircuit,
    description: 'Get personalized help with any subject from your AI-powered study partner.',
    isExternal: false,
  },
  {
    path: '/dashboard/maths-club-v2',
    title: 'Maths Club',
    icon: Sigma,
    description: 'Practice problems, track progress, and compete on the leaderboard.',
    isExternal: false,
  },
  {
    path: '/dashboard/science-club-v2',
    title: 'Science Club',
    icon: FlaskConical,
    description: 'Explore scientific concepts with facts, quizzes, and AI-led lessons.',
    isExternal: false,
  },
  {
    path: '/dashboard/ela-club',
    title: 'ELA Club',
    icon: BookOpenCheck,
    description: 'Improve reading, writing, and grammar with interactive drills and challenges.',
    isExternal: false,
  },
  {
    path: '/dashboard/coding-club',
    title: 'Coding Club',
    icon: Code,
    description: 'Learn to code with visual blocks, Python puzzles, and the Scratch editor.',
    isExternal: false,
  },
   {
    path: '/dashboard/think-tank',
    title: 'Think Tank',
    icon: BrainCircuit,
    description: 'Sharpen your mind with daily logic puzzles and critical analysis.',
    isExternal: false,
  },
  {
    path: '/dashboard/game-zone',
    title: 'Game Zone',
    icon: Gamepad2,
    description: 'Create and play engaging learning games using the Kahoot! platform.',
    isExternal: false,
  },
  {
    path: '/dashboard/live-classroom',
    title: 'Live Classroom',
    icon: Clapperboard,
    description: 'Join or conduct real-time virtual classes with video and chat.',
    isExternal: false,
  },
];

export default function CodingClubPage() {
  return (
    <div className="space-y-6">
       <Card className="border-t-4 border-t-purple-600 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Activity className="h-6 w-6 text-purple-600" />
            Clubs & Activities
          </CardTitle>
          <CardDescription>
            Explore different learning zones, from coding and logic to creative arts and AI tutoring.
          </CardDescription>
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubModules.map((mod) => (
          <Link key={mod.path} href={mod.path} target={mod.isExternal ? '_blank' : '_self'} rel={mod.isExternal ? "noopener noreferrer" : ""}>
            <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
              <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-full">
                       <mod.icon className="w-6 h-6 text-primary"/>
                    </div>
                    <CardTitle>{mod.title}</CardTitle>
                  </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{mod.description}</CardDescription>
              </CardContent>
              <CardFooter>
                 <Button variant="ghost" className="w-full justify-start text-primary p-0">
                    {mod.isExternal ? 'Open in AI Studio' : 'Enter Club'}
                    <ExternalLink className="ml-2 h-3 w-3"/>
                  </Button>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
