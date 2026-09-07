'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TargetedBillingPurgeTool, SPRINGFIELD_SCHOOL_ID } from '@/components/dashboard/finance/TargetedBillingPurgeTool';

export default function PurgeSpringfieldBillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/accounts">
            <Button variant="outline" size="sm" className="rounded-xl border-slate-300 text-slate-700 hover:bg-slate-100">
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Accounts
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Springfield Fee Operations
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Dedicated Administrative Tool for Springfield Third Term Billing Reconciliation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3.5 py-1.5 rounded-2xl text-xs font-black shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Restricted Admin Utility</span>
        </div>
      </div>

      {/* Main Targeted Tool */}
      <TargetedBillingPurgeTool schoolId={SPRINGFIELD_SCHOOL_ID} />
    </div>
  );
}
