import { redirect } from 'next/navigation';

// The old single-assessment gradebook was replaced by the Terminal SBA Matrix (which also has the
// single-assessment mode). It re-read every mark ever recorded for a class + subject, and teachers could not
// re-save a batch there (it deleted and re-created marks, which teachers are not allowed to do).
export default function GradebookRedirect() {
    redirect('/dashboard/academics/gradebook/manual-entry');
}
