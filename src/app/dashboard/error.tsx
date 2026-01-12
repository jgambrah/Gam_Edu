'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
        <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    An Error Occurred
                </CardTitle>
                <CardDescription>Something went wrong while loading this part of the dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                    You can try to refresh the page or go back to the main dashboard.
                </p>
                <Button onClick={() => reset()}>
                    Try Again
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
