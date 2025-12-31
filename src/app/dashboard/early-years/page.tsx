
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ArrowLeft } from "lucide-react";

export default function EarlyYearsRedirectPage() {

  const externalUrl = "https://nursery-bloom-early-english-explorer-296289880836.us-west1.run.app";

  const handleOpenHub = () => {
    const windowFeatures = "width=1280,height=800,location=no,toolbar=no,menubar=no,scrollbars=yes,resizable=yes";
    window.open(externalUrl, "_blank", windowFeatures);
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
                <Button onClick={handleOpenHub}>
                    Open Early Years Hub <ExternalLink className="ml-2 h-4 w-4"/>
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
