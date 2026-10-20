/**
 * Staff roles that teach (can be a subject teacher or form tutor). Used for Firestore `where('role', 'in', …)`
 * queries — at most 30 values. Before, pages only listed staff whose role was exactly "Teacher", so a
 * "Class Teacher", "Head Teacher" or "Head of Department" assigned to a subject/class showed as "TBA".
 */
export const TEACHING_ROLES = [
    'Teacher', 'teacher', 'Class Teacher', 'Subject Teacher', 'Head of Department', 'Tutor', 'Instructor',
    'Faculty', 'Head Teacher', 'Headmaster', 'Headmistress',
];
