
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { School, Home, ArrowLeft, SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* Visual Icon */}
      <div className="bg-white p-6 rounded-full shadow-xl mb-6 animate-in zoom-in duration-500">
        <div className="relative">
          <School className="h-24 w-24 text-indigo-200" />
          <SearchX className="h-12 w-12 text-indigo-600 absolute -bottom-2 -right-2 bg-white rounded-full border-4 border-white" />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center max-w-md space-y-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Class Dismissed?
        </h1>
        <h2 className="text-xl font-medium text-indigo-600">
          404 - Page Not Found
        </h2>
        <p className="text-slate-500">
          Oops! It seems like this student (or page) has wandered off campus. 
          We couldn't find the resource you were looking for.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" className="bg-indigo-600 hover:bg-indigo-700">
            <Link href="/dashboard">
              <Home className="mr-2 h-4 w-4" /> Return to Campus
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-300">
            <Link href="/" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Link>
          </Button>
        </div>
      </div>

      {/* Footer decoration */}
      <div className="absolute bottom-8 text-xs text-slate-400">
        GAM Edu &copy; 2025
      </div>
    </div>
  );
}
