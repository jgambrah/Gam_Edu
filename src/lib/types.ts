import type { LucideIcon } from 'lucide-react';
import { z } from 'zod';

export type UserRole =
  | 'Director'
  | 'Administrator'
  | 'Teacher'
  | 'Accountant'
  | 'Student'
  | 'Parent'
  | 'Librarian'
  | 'Cook';

export const ALL_ROLES: UserRole[] = [
  'Director',
  'Administrator',
  'Teacher',
  'Accountant',
  'Student',
  'Parent',
  'Librarian',
  'Cook',
];

export type NavItem = {
  path: string;
  title: string;
  icon: LucideIcon;
  roles: UserRole[] | 'all';
  subItems?: NavItem[];
};

export const assignmentSchema = z.object({
    classId: z.string().min(1, 'Class is required.'),
    title: z.string().min(1, 'Title is required.'),
    description: z.string().min(1, 'Description is required.'),
    dueDate: z.date(),
    gradingType: z.enum(['points', 'letter', 'pass_fail', 'standards']),
    attachments: z.string().optional(),
});

export type Assignment = z.infer<typeof assignmentSchema> & {
    id: string;
    teacherId: string;
    createdAt: any;
};

export const studentSubmissionSchema = z.object({
    content: z.string().min(1, 'Content is required.'),
});

export type StudentSubmission = {
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    submissionType: 'file' | 'text';
    content: string;
    submittedAt: any;
    status: 'Submitted' | 'Late' | 'Graded';
    grade?: string;
    teacherFeedback?: string;
};

export const gradeSubmissionSchema = z.object({
    grade: z.string().min(1, 'Grade is required.'),
    teacherFeedback: z.string().optional(),
});

export const quizSchema = z.object({
    topic: z.string().min(3, "Topic must be at least 3 characters long."),
    numQuestions: z.coerce.number().min(1).max(10),
    classId: z.string().min(1, "Please select a class."),
});

export type QuizQuestion = {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation?: string;
}

export type Quiz = {
    id: string;
    classId: string;
    teacherId: string;
    title: string;
    topic: string;
    questions: QuizQuestion[];
    createdAt: any;
    forGradeLevel?: string;
}

export type QuizAttempt = {
    id: string;
    quizId: string;
    studentId: string;
    score: number;
    total: number;
    completedAt: any;
}


// Assessment & Gradebook Schemas
export const assessmentFeedbackSchema = z.object({
  academicYear: z.string().min(1, "Academic year is required."),
  term: z.string().min(1, "Term is required."),
  classId: z.string().min(1, "Class is required."),
  studentId: z.string().min(1, "Student is required."),
  subjectId: z.string().min(1, "Subject is required."),
  assessmentName: z.string().min(1, "Assessment name is required."),
  assessmentType: z.enum(['Quiz', 'Assignment', 'Activity', 'Exam']),
  assessmentDate: z.date(),
  score: z.coerce.number().optional(),
  maxScore: z.coerce.number().optional(),
  feedback: z.string().optional(),
  teacherId: z.string().optional(),
}).refine(data => !data.score || !data.maxScore || data.score <= data.maxScore, {
  message: "Score cannot exceed max score",
  path: ["score"],
});


export type Assessment = z.infer<typeof assessmentFeedbackSchema> & {
    id: string;
    createdAt: any;
};

export const behavioralRecordSchema = z.object({
    studentId: z.string().min(1, "Student is required."),
    incidentType: z.enum(['Infraction', 'Positive Behavior', 'Counseling Note', 'Disciplinary Action', 'Teacher Note']),
    date: z.date(),
    description: z.string().min(1, "Description is required."),
    actionTaken: z.string().optional(),
    recordedById: z.string(),
});

export type BehavioralRecord = z.infer<typeof behavioralRecordSchema> & {
    id: string;
    createdAt: any;
};

export const reportCardCommentSchema = z.object({
    comment: z.string().min(1, "Comment cannot be empty."),
    subjectId: z.string().min(1, "Subject is required."),
});

export type ReportCardComment = {
    id: string;
    studentId: string;
    subjectId: string;
    comment: string;
    teacherId: string;
    term: string;
    academicYear: string;
    createdAt: any;
    updatedAt: any;
}

export type ReportCardStatus = 'Draft' | 'AwaitingFinalApproval' | 'Published';

export type ReportCard = {
    id: string; // Typically studentId-academicYear-term
    studentId: string;
    classId: string;
    academicYear: string;
    term: string;
    status: ReportCardStatus;
    generalComment?: string;
    publishedAt?: any;
    finalGrade?: string;
    finalPercentage?: number;
}

// Timetable Schemas
export type Subject = { id: string; name: string; teacherIds: string[] };
export type Room = { id: string; name: string; capacity: number };
export type TimeSlot = { id: string; day: string; startTime: string; endTime: string };
export type TimetableEntry = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  day: string;
  timeSlotId: string;
};

// Resource Schemas
export const resourceSchema = z.object({
    title: z.string().min(1, 'Title is required.'),
    courseName: z.string().min(1, 'Course is required.'),
    resourceType: z.enum(['Document', 'Video', 'Presentation', 'Link']),
    url: z.string().url('Must be a valid URL.'),
});

export type Resource = z.infer<typeof resourceSchema> & {
    id: string;
};

// Lesson Planning Schemas
export const lessonPlanSchema = z.object({
    classId: z.string().min(1, 'Class is required.'),
    date: z.date({ required_error: 'A date for the lesson is required.'}),
    topic: z.string().min(1, 'Topic is required.'),
    objectives: z.string().min(1, 'Learning objectives are required.'),
    activities: z.string().min(1, 'Activities are required.'),
    materials: z.string().min(1, 'Materials and resources are required.'),
    notes: z.string().optional(),
});

export type LessonPlan = z.infer<typeof lessonPlanSchema> & {
    id: string;
    teacherId: string;
    createdAt: any;
};

// Library Schemas
export const libraryItemSchema = z.object({
    name: z.string().min(1, "Item name is required."),
    category: z.enum(['Book', 'Magazine', 'DVD', 'Other']),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1."),
    location: z.string().min(1, "Location is required."),
    author: z.string().optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    unitPrice: z.coerce.number().optional(),
    purchaseDate: z.date().optional(),
});

export type LibraryItem = z.infer<typeof libraryItemSchema> & {
    id: string;
    status: 'Available' | 'Requested' | 'Borrowed' | 'Pending Return';
    currentHolderId?: string;
    currentHolderName?: string;
    dueDate?: any;
    createdAt: any;
};

// Attendance Schemas
export const attendanceRecordSchema = z.object({
  studentId: z.string(),
  date: z.date(),
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  markedBy: z.string(), // UID of teacher or 'kiosk'
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema> & {
    id: string;
};


// Admission Schemas
const parentGuardianSchema = z.object({
    name: z.string().min(1, 'Name is required.'),
    relationship: z.string().min(1, 'Relationship is required.'),
    phone: z.string().min(1, 'Phone number is required.'),
    email: z.string().email('Invalid email address.'),
    addressSameAsStudent: z.boolean().default(false),
    address: z.string().optional(),
});
  
export const studentRegistrationSchema = z.object({
    // Student Information
    student: z.object({
        fullName: z.string().min(1, 'Full name is required.'),
        dateOfBirth: z.date({ required_error: 'Date of birth is required.' }),
        gender: z.string().min(1, 'Gender is required.'),
        phone: z.string().optional(),
        email: z.string().email('Invalid email address.').optional(),
        address: z.string().min(1, 'Address is required.'),
        previousSchool: z.string().optional(),
        desiredGrade: z.string().min(1, 'Desired grade is required.'),
    }),
    
    // Parent/Guardian Information
    parent1: parentGuardianSchema,
    addParent2: z.boolean().default(false),
    parent2: parentGuardianSchema.optional(),

    // Emergency Contact
    emergencyContact: z.object({
        name: z.string().min(1, 'Emergency contact name is required.'),
        relationship: z.string().min(1, 'Relationship is required.'),
        phone: z.string().min(1, 'Phone number is required.'),
    }),

    // Medical Information
    addMedicalInfo: z.boolean().default(false),
    medical: z.object({
        allergies: z.string().optional(),
        conditions: z.string().optional(),
        physicianName: z.string().optional(),
        physicianPhone: z.string().optional(),
    }).optional(),

}).superRefine((data, ctx) => {
    // Conditional validation for Parent 1's address
    if (!data.parent1.addressSameAsStudent && !data.parent1.address) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Address is required.',
            path: ['parent1', 'address'],
        });
    }
    // Conditional validation for Parent 2
    if (data.addParent2 && data.parent2) {
        if (!data.parent2.addressSameAsStudent && !data.parent2.address) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Address is required.',
                path: ['parent2', 'address'],
            });
        }
    }
    // Conditional validation for medical info
    if (data.addMedicalInfo && data.medical) {
        if (!data.medical.allergies && !data.medical.conditions && !data.medical.physicianName) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Please provide at least one piece of medical information.',
                path: ['medical', 'allergies'],
            });
        }
    }
});
  
export type StudentRegistrationData = z.infer<typeof studentRegistrationSchema>;

export type AdmissionApplication = StudentRegistrationData & {
    id: string;
    applicationId: string; // A user-friendly, unique ID
    status: 'Pending Review' | 'Admitted' | 'Rejected';
    submittedByParentId: string;
    submittedAt: any;
    rejectionReason?: string;
    challengeNotes?: string;
    assessmentTestScore?: number;
    assessmentInterviewNotes?: string;
    adminFeedback?: string;
};

// Alumni Schemas
export const graduateStudentSchema = z.object({
    studentId: z.string().min(1, "You must select a student."),
    graduationYear: z.coerce.number().min(new Date().getFullYear() - 10).max(new Date().getFullYear() + 1),
});

export const editAlumniSchema = z.object({
    currentOccupation: z.string().optional(),
    employer: z.string().optional(),
    mentorshipWillingness: z.boolean().default(false),
});

export type AlumniDetails = z.infer<typeof editAlumniSchema>;

// This extends the existing Student type for alumni management
export type Student = {
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    classId: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    enrollmentStatus?: 'Active' | 'Graduated';
    graduationYear?: number;
    alumniDetails?: AlumniDetails;
};
