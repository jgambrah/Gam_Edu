
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gamepad2, PenSquare, LogIn, Youtube } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '@/context/role-context';

export default function GameZonePage() {
  const { role } = useRole();
  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="h-8 w-8" />
            Game Zone - Kahoot!
          </CardTitle>
          <CardDescription>
            Use the official Kahoot! platform to create and play engaging learning games.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* For Teachers & Admins */}
        {isTeacherOrAdmin && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenSquare /> For Teachers
              </CardTitle>
              <CardDescription>
                Create a new quiz or launch a game from your existing Kahoots. You will be redirected to the Kahoot! website.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href="https://create.kahoot.it" target="_blank" rel="noopener noreferrer">
                  Create or Host a Game on Kahoot!
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="https://www.youtube.com/watch?v=xGOLi56UQ3U" target="_blank" rel="noopener noreferrer">
                  <Youtube className="mr-2 h-4 w-4" />
                  Watch a Tutorial
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* For Students */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn /> For Students
            </CardTitle>
            <CardDescription>
              Ready to play? Get the Game PIN from your teacher and click the button below to join the game on the official Kahoot! site.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="https://kahoot.it" target="_blank" rel="noopener noreferrer">
                Join a Game on Kahoot!
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
