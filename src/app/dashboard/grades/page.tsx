
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

export default function DeprecatedGradesPage() {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-md text-center">
                <CardHeader>
                    <CardTitle>Page Moved</CardTitle>
                    <CardDescription>
                        The old gradebook has been replaced by the new and improved Gradebook 2.0.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href="/dashboard/grades2">
                            <TrendingUp className="mr-2 h-4 w-4" /> Go to New Gradebook
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
