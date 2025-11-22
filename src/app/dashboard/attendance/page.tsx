
'use client';

import { Suspense } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyAttendanceSheet } from './daily-attendance-sheet';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ScanFace } from 'lucide-react';

function AttendancePageContent() {
    const { role } = useRole();
    const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';

    if (!canAccess) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This module is only for Teachers, Administrators, and Directors.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Daily Attendance</CardTitle>
                            <CardDescription>Select a class and date to take attendance.</CardDescription>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/attendance/face-recognition">
                                <ScanFace className="mr-2 h-4 w-4" />
                                Switch to Face Recognition Kiosk
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <DailyAttendanceSheet />
                </CardContent>
            </Card>
        </div>
    );
}


export default function AttendancePage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AttendancePageContent />
        </Suspense>
    )
}

    