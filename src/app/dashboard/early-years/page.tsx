
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function EarlyYearsRedirectPage() {
  return (
    <div className="flex items-center justify-center p-8">
        <Card className="max-w-lg text-center">
            <CardHeader>
                <CardTitle>This Feature Has a New Home!</CardTitle>
                <CardDescription>
                The Early Years module has been upgraded and moved to its own dedicated project in AI Studio for a better experience.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="https://studio.google.com/your-early-years-project-url" target="_blank" rel="noopener noreferrer">
                    <Button>
                        Open Early Years Hub <ExternalLink className="ml-2 h-4 w-4"/>
                    </Button>
                </Link>
            </CardContent>
        </Card>
    </div>
  );
}
