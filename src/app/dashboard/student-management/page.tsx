
/**
 * @fileOverview This page is deprecated. Use src/app/dashboard/students-v3/page.tsx instead.
 */
import { redirect } from 'next/navigation';

export default function DeprecatedStudentManagement() {
    redirect('/dashboard/students-v3');
    return null;
}
