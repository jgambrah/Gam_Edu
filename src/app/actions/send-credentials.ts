
'use server';

import { sendSchoolCredentialsEmail } from '@/lib/email';

export async function sendCredentialsAction(email: string, name: string, schoolName: string, password: string) {
    await sendSchoolCredentialsEmail(email, name, schoolName, password);
}
