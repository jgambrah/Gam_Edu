
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";

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
                <Link href="https://nursery-bloom-early-english-explorer-296289880836.us-west1.run.app" target="_blank" rel="noopener noreferrer">
                    <Button>
                        Open Early Years Hub <ExternalLink className="ml-2 h-4 w-4"/>
                    </Button>
                </Link>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground pt-6 border-t">
                <div className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <p>When you are finished, simply close the new browser tab to return to CampusConnect.</p>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
