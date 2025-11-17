
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AcademicsPageContent from './academics-client';

export default function AcademicsPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
      <AcademicsPageContent />
    </Suspense>
  );
}
