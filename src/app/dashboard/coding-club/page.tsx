'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Code, MousePointerClick } from 'lucide-react';
import Link from 'next/link';

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
        <CardContent>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Option 1: Scratch Platform</CardTitle>
              <CardDescription>
                A visual, block-based coding language perfect for beginners.
                Create stories, games, and animations.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
