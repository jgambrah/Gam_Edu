'use client';

import Link from 'next/link';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

/**
 * Retired. The old tool created bills without a school ID or term and could overwrite existing bills.
 * Missing daily bills are now created from Finance Settings → Retrospective Billing, which never
 * overwrites a bill that already exists and stamps the current term.
 */
export default function FixBillingPage() {
  return (
    <div className="p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>This tool has been retired</CardTitle>
          <CardDescription>
            To create missing canteen or transport bills, use Finance Settings → Retrospective Billing. It only adds bills
            that are missing and never changes existing ones.
          </CardDescription>
          <div className="pt-4">
            <Button asChild><Link href="/dashboard/finance/settings">Go to Finance Settings</Link></Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
