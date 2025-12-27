

'use client';

import { useRole } from "@/context/role-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GradebookManager from "./gradebook2-manager";
import { Loader2 } from "lucide-react";

export default function GradebookPage() {
    const { role, loading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (role === 'Parent' || role === 'Student')) {
            router.replace('/dashboard/my-children');
        }
    }, [role, loading, router]);
    
    if (loading) {
        return (
             <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (role === 'Parent' || role === 'Student') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Redirecting...</CardTitle>
                    <CardDescription>
                        Please view grades under the "My Children" or "Report Cards" section. Redirecting you now.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // For Teacher, Administrator, Director
    if (['Teacher', 'Administrator', 'Director'].includes(role || '')) {
        return <GradebookManager />;
    }

    // Fallback for any other roles or states
    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                    The gradebook is not available for your role.
                </CardDescription>
            </CardHeader>
        </Card>
    );
}
