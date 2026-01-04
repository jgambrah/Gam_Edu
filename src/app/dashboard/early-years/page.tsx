
'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Function to generate a secure random token on the client-side
function generateMagicTicket() {
  if (typeof window === 'undefined') return null;
  const array = new Uint32Array(8);
  window.crypto.getRandomValues(array);
  let token = '';
  for (let i = 0; i < array.length; i++) {
    token += array[i].toString(16);
  }
  return token;
}

export default function EarlyYearsEmbeddedPage() {
  const { user, isUserLoading } = useUser();
  // Generate the token immediately. We only need it once.
  const [magicTicket] = useState(generateMagicTicket());

  if (isUserLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Authenticating session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
       <Card>
        <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>You must be logged in to access this feature.</CardDescription>
        </CardHeader>
       </Card>
    );
  }
  
  if (!magicTicket) {
     return (
      <div className="flex h-full w-full items-center justify-center p-8 text-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Generating secure connection...</p>
        </div>
      </div>
    );
  }

  const externalAppUrl = `https://nursery-bloom-825774943692.us-west1.run.app/?token=${magicTicket}`;

  return (
    <div style={{ width: '100%', height: 'calc(100vh - 150px)', overflow: 'hidden', borderRadius: '1rem' }}>
        <iframe
            src={externalAppUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Early Years Learning Hub"
            allow="microphone"
        />
    </div>
  );
}
