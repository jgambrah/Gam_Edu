'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRole } from "@/context/role-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeprecatedGradebookPage() {
    const { role, loading } = useRole();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (role === 'Parent') {
                router.replace('/dashboard/my-children');
            }
        }
    }, [role, loading, router]);


    if (role === 'Parent') {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Redirecting...</CardTitle>
                    <CardDescription>
                        Moving to the new parent dashboard.
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Deprecated</CardTitle>
        <CardDescription>
            This page is no longer in use for your role. Please use the appropriate module from the sidebar.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
