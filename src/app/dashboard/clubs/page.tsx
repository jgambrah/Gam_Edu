
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Bot, Puzzle, ExternalLink, Activity, Rabbit, GraduationCap, Rocket, BrainCircuit, Sigma, FlaskConical, BookOpenCheck, Gamepad2, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { Construction } from 'lucide-react';
import { useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { evaluateStudentEnrichmentAccess } from '@/lib/student-enrichment-release';

const clubModules = [
  {
    path: '/dashboard/nursery-bloom',
    title: 'Nursery Bloom',
    icon: Rabbit,
    description: 'Interactive AI suite with Phonics, voice coach, math playgrounds, science experiments and creative art studio.',
  },
  {
    path: '/dashboard/senior-academy',
    title: 'Senior Academy',
    icon: Rocket,
    description: 'Advanced modules for Math, English, and Science for secondary students.',
  },
  {
    path: '/dashboard/study-club',
    title: 'Study Club (AI Tutor)',
    icon: BrainCircuit,
    description: 'Get personalized help with any subject from your AI-powered study partner.',
  },
  {
    path: '/dashboard/maths-club-v2',
    title: 'Maths Club',
    icon: Sigma,
    description: 'Practice problems, track progress, and compete on the leaderboard.',
  },
  {
    path: '/dashboard/science-club-v2',
    title: 'Science Club',
    icon: FlaskConical,
    description: 'Explore scientific concepts with facts, quizzes, and AI-led lessons.',
  },
  {
    path: '/dashboard/ela-club',
    title: 'ELA Club',
    icon: BookOpenCheck,
    description: 'Improve reading, writing, and grammar with interactive drills and challenges.',
  },
  {
    path: '/dashboard/coding-club',
    title: 'Coding Club',
    icon: Code,
    description: 'Learn to code with visual blocks, Python puzzles, and the Scratch editor.',
  },
   {
    path: '/dashboard/think-tank',
    title: 'Think Tank',
    icon: BrainCircuit,
    description: 'Sharpen your mind with daily logic puzzles and critical analysis.',
  },
  {
    path: '/dashboard/game-zone',
    title: 'Game Zone',
    icon: Gamepad2,
    description: 'Create and play engaging learning games using the Kahoot! platform.',
  },
  {
    path: '/dashboard/live-classroom',
    title: 'Live Classroom',
    icon: Clapperboard,
    description: 'Join or conduct real-time virtual classes with video and chat.',
  },
];

/** Hub entries that are not part of Student Enrichment (general school functions) are never marked or restricted. */
const NON_ENRICHMENT_PATHS = new Set(['/dashboard/live-classroom']);

export default function CodingClubPage() {
  // This page is a navigation hub (not itself restricted). While Student Enrichment is Under Construction, each
  // enrichment card says so before the user clicks; the destination routes enforce the actual release gate.
  const { user, isUserLoading } = useUser();
  const { role, loading: isRoleLoading } = useRole();
  const decision = evaluateStudentEnrichmentAccess({
    role: user ? role : null,
    isAuthenticated: Boolean(user),
    isLoading: isUserLoading || isRoleLoading,
  });
  const underConstruction = decision.status !== 'released';
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
          <Link key={mod.path} href={mod.path} passHref>
            <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
              <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted rounded-full">
                       <mod.icon className="w-6 h-6 text-primary"/>
                    </div>
                    <CardTitle>{mod.title}</CardTitle>
                  </div>
                  {underConstruction && !NON_ENRICHMENT_PATHS.has(mod.path) && (
                    <span
                      data-testid="under-construction-badge"
                      className="mt-2 inline-flex w-fit items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900"
                    >
                      <Construction className="h-3 w-3" aria-hidden="true" />
                      {decision.allowed ? 'Under construction · staff preview' : 'Under construction'}
                    </span>
                  )}
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{mod.description}</CardDescription>
              </CardContent>
              <CardFooter>
                 <Button variant="ghost" className="w-full justify-start text-primary p-0">
                    Enter Club
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
