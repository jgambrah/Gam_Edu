
'use client';

import { Suspense, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export default function ClientBoundary({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>{children}</Suspense>;
}
