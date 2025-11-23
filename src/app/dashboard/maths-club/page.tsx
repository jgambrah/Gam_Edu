
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Sigma } from 'lucide-react';

export default function MathsClubPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sigma />
            Maths Club
          </CardTitle>
          <CardDescription>
            Welcome to the Maths Club! Practice problems, track your progress,
            and climb the leaderboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This feature is currently under development. Check back soon for
            exciting maths challenges!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
