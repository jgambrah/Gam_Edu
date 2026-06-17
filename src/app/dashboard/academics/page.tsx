
'use client';

import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AcademicsPageContent from './academics-client';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcademicsPage() {
    const { role, loading } = useRole();

    // 1. MUST check loading first to prevent falling through to the staff view
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    // 2. Redirect/Block students from accessing the management view
    if (role === 'Student') {
        return (
             <div className="p-6">
                <Card className="border-t-4 border-t-red-500 shadow-xl rounded-[2rem] bg-red-50/50">
                    <CardHeader className="text-center p-8">
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-red-650">Access Restricted</CardTitle>
                        <CardDescription className="text-xs font-bold uppercase text-red-400 mt-1">
                            This management portal is for school staff. Your assignments, 
                            quizzes, and learning materials can be found under the student portals.
                        </CardDescription>
                    </CardHeader>
                </Card>
             </div>
        );
    }

    return (
        <Suspense fallback={<div className="flex min-h-[80vh] w-full items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>}>
            <AcademicsPageContent />
        </Suspense>
    );
}
