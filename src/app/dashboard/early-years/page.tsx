
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ExternalLink, ArrowLeft, Loader2 } from "lucide-react";
import { generateSecureToken } from '@/app/actions/generate-secure-token';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';

export default function EarlyYearsRedirectPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // The base URL of your external application
  const externalUrl = "https://nursery-bloom-early-english-explorer-296289880836.us-west1.run.app";

  const handleOpenHub = async () => {
    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Logged In",
            description: "You must be logged in to access this feature.",
        });
        return;
    }

    setIsLoading(true);
    try {
        // 1. Generate a secure, short-lived token
        const token = await generateSecureToken(user.uid);
        
        // 2. Construct the URL with the token
        const secureUrl = `${externalUrl}?token=${token}`;

        // 3. Open the URL in a new popup window
        const windowFeatures = "width=1280,height=800,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes";
        window.open(secureUrl, "EarlyYearsHub", windowFeatures);

    } catch (error: any) {
        console.error("Failed to generate token or open window:", error);
        toast({
            variant: "destructive",
            title: "Could Not Open Hub",
            description: error.message || "An unexpected error occurred.",
        });
    } finally {
        setIsLoading(false);
    }
  };

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
                <Button onClick={handleOpenHub} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ExternalLink className="mr-2 h-4 w-4"/>}
                    Open Early Years Hub
                </Button>
            </CardContent>
            <CardFooter className="flex flex-col items-center justify-center text-sm text-muted-foreground pt-6 border-t">
                <div className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    <p>The application will open in a new window. When you are finished, simply close the new window to return to CampusConnect.</p>
                </div>
            </CardFooter>
        </Card>
    </div>
  );
}
