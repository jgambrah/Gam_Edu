'use client';

import { useRole } from "@/context/role-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GradebookManager from "./gradebook2-manager";
import { Loader2, ShieldAlert } from "lucide-react";

export default function GradebookPage() {
    const { role, loading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (role === 'Parent' || role === 'Student')) {
            router.replace('/dashboard/report-cards');
        }
    }, [role, loading, router]);
    
    if (loading) {
        return (
             <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    // Explicitly check for staff roles to prevent any unauthorized component mounting
    const isStaff = ['Teacher', 'Administrator', 'Director', 'Accountant'].includes(role || '');

    if (!isStaff) {
        return (
             <div className="p-6 flex justify-center">
                <Card className="max-w-md w-full border-red-100 bg-red-50/50">
                    <CardHeader className="text-center">
                        <div className="bg-red-100 p-3 rounded-full w-fit mx-auto mb-4">
                            <ShieldAlert className="h-8 w-8 text-red-600" />
                        </div>
                        <CardTitle>Access Restricted</CardTitle>
                        <CardDescription>
                            The full gradebook management system is for school staff only. 
                            Students and parents can view finalized results in the "Report Cards" section.
                        </CardDescription>
                    </CardHeader>
                </Card>
             </div>
        );
    }

    // For Teacher, Administrator, Director
    return <GradebookManager />;
}
