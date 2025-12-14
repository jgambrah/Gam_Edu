
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code, MousePointerClick, Youtube, Code2, BrainCircuit } from 'lucide-react';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const BlocklyEditor = dynamic(
  () => import('./blockly-editor').then((mod) => mod.BlocklyEditor),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />,
  }
);


export default function CodingClubPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code />
            Coding Club
          </CardTitle>
          <CardDescription>
            Explore different platforms to practice your coding skills.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <Card className="w-full">
                <CardHeader>
                <CardTitle>Option 1: Scratch Platform</CardTitle>
                <CardDescription>
                    A visual, block-based coding language perfect for beginners.
                    Create stories, games, and animations.
                </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row gap-4 items-start">
                <Link
                    href="https://scratch.mit.edu/projects/editor/"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button>
                    <MousePointerClick className="mr-2 h-4 w-4" />
                    Go to Scratch Platform
                    </Button>
                </Link>
                <Link
                    href="https://www.youtube.com/watch?v=sb-wF35TuvQ&list=PLlryJer4FuggBT5-4ZDTcYivs7kJHowXb"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Button variant="outline">
                        <Youtube className="mr-2 h-4 w-4" />
                        Watch a Beginner's Tutorial
                    </Button>
                </Link>
                </CardContent>
            </Card>

            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BrainCircuit className="text-indigo-500" /> Option 2: Logic Lab</CardTitle>
                    <CardDescription>
                       An interactive, block-based environment to learn core programming concepts, powered by AI.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/coding-club/logic-lab">
                            Enter the Logic Lab
                        </Link>
                    </Button>
                </CardContent>
            </Card>
          
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Option 3: Integrated Blockly Editor</CardTitle>
                    <CardDescription>
                        Use our built-in block-based editor to create and save your projects directly in CampusConnect.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4">
                        <Link
                            href="https://www.youtube.com/watch?v=lPVJjQbEeN0"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button variant="outline">
                                <Youtube className="mr-2 h-4 w-4" />
                                How to Use Blockly
                            </Button>
                        </Link>
                    </div>
                    <BlocklyEditor />
                </CardContent>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
