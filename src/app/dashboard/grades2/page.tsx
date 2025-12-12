
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DeprecatedGradebookPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Deprecated</CardTitle>
        <CardDescription>
            This page is no longer in use. The new and improved gradebook is located under Academics.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/dashboard/academics/gradebook">
            <Button>Go to the new Gradebook</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
