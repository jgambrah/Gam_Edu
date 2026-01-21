
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
  | 'Cook'
  | 'Transport Staff';

export const ALL_ROLES: UserRole[] = [
  'Director',
  'Administrator',
  'Teacher',
  'Accountant',
  'Student',
  'Parent',
  'Librarian',
  'Cook',
  'Transport Staff',
];

export const STAFF_ROLES: UserRole[] = ALL_ROLES.filter(
  (role) => role !== 'Student' && role !== 'Parent'
);

export type NavItem = {
  path: string;
  title: string;
  icon: LucideIcon;
  roles: UserRole[] | 'all';
  subItems?: NavItem[];
};

export interface CrosswordPuzzle {
  id: string;
  title: string;
  topic: string;
  grid: string[][];
  clues: {
    across: { number: number; clue: string; answer: string; row: number; col: number; }[];
    down: { number: number; clue: string; answer: string; row: number; col: number; }[];
  };
}

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

export type SubjectGradeSummary = {
    subjectId: string;
    subjectName: string;
    assessments: Assessment[];
    finalGrade: string;
    percentage: number;
    teacherComment: string;
};

export type ReportCard = {
    id: string; 
    studentId: string;
    classId: string;
    academicYear: string;
    term: string;
    status: ReportCardStatus;
    generalComment?: string;
    publishedAt?: any;
    finalGrade?: string;
    finalPercentage?: number;
    classPosition?: string; // e.g. "1st", "2nd"
    subjectSummaries?: SubjectGradeSummary[]; // New structured field
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
  classId: z.string().min(1, "Please select a class"),
  date: z.date({
    required_error: "Please select a date",
  }),
  topic: z.string().min(1, "Topic is required"),
  objectives: z.string().min(1, "Objectives are required"),
  activities: z.string().min(1, "Activities are required"),
  materials: z.string().min(1, "Materials are required"),
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
    id: string;
    uid: string;
    studentId?: string; // The official SS-YYYY-XXXX ID
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
    transportStopId?: string;
    usesBusService?: boolean;
    usesCanteen?: boolean;
};

export type Class = {
    id: string;
    name: string;
    description?: string;
    teacherId?: string;
    studentIds?: string[];
    capacity?: number;
};


// Leave Management Schemas
export const LEAVE_TYPES = ['Sick Leave', 'Vacation', 'Personal', 'Study Leave', 'Unpaid Leave'] as const;
export type LeaveType = typeof LEAVE_TYPES[number];
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export const leaveApplicationSchema = z.object({
  leaveType: z.enum(LEAVE_TYPES),
  startDate: z.date({ required_error: 'Start date is required.' }),
  endDate: z.date({ required_error: 'End date is required.' }),
  reason: z.string().min(10, 'Please provide a brief reason for your leave.'),
}).refine(data => data.endDate >= data.startDate, {
  message: 'End date cannot be before the start date.',
  path: ['endDate'],
});

export type LeaveRequest = {
  id: string;
  staffId: string;
  staffName: string;
  leaveType: LeaveType;
  startDate: any;
  endDate: any;
  reason: string;
  status: LeaveStatus;
  approverId?: string;
  approverName?: string;
  approverNotes?: string;
  createdAt: any;
};

export const managerApprovalSchema = z.object({
    notes: z.string().optional(),
});

export const managerRejectionSchema = z.object({
    notes: z.string().min(1, "A reason for rejection is required."),
});


export type PublicHoliday = {
    id: string;
    name: string;
    date: any;
};

// Performance Review Schemas
export const performanceReviewSchema = z.object({
  staffId: z.string().min(1, 'You must select a staff member.'),
  reviewDate: z.date({ required_error: 'Review date is required.' }),
  rating: z.number().min(1, 'Rating is required.').max(5),
  strengths: z.string().min(1, 'Strengths section cannot be empty.'),
  improvementAreas: z.string().min(1, 'Areas for Improvement cannot be empty.'),
  goals: z.string().min(1, 'Goals for next period cannot be empty.'),
  staffComments: z.string().optional(),
});

export type PerformanceReview = z.infer<typeof performanceReviewSchema> & {
  id: string;
  reviewerId: string;
  reviewerName: string;
  createdAt: any;
};


// Financial Schemas
export const financialRecordSchema = z.object({
  studentId: z.string().min(1, "A student must be selected."),
  type: z.enum(['Tuition Fee', 'Library Fine', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other']),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
  academicYear: z.string().optional(),
  term: z.string().optional(),
});

export const bulkBillingSchema = z.object({
  classId: z.string().min(1, "A class must be selected."),
  type: z.enum(['Tuition Fee', 'Lab Fee', 'Sports Fee', 'Canteen Fee', 'Transport Fee', 'Other']),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
});

export const recordPaymentSchema = z.object({
    amount: z.coerce.number().min(0.01, "Payment amount must be positive."),
    method: z.enum(['Cash', 'Card', 'Bank Transfer', 'Mobile Money', 'Other']),
    notes: z.string().optional(),
});

export const applyWaiverSchema = z.object({
    amount: z.coerce.number().min(0.01, "Waiver amount must be positive."),
    reason: z.string().min(1, "A reason for the waiver is required."),
});

export type FinancialRecord = {
    id: string;
    studentId: string;
    studentName: string;
    classId: string;
    type: 'Tuition Fee' | 'Library Fine' | 'Lab Fee' | 'Sports Fee' | 'Canteen Fee' | 'Transport Fee' | 'Other';
    description: string;
    billedAmount: number;
    amountPaid: number;
    waiverAmount?: number;
    waiverReason?: string;
    status: 'Paid' | 'Unpaid' | 'Overdue';
    dueDate: any;
    createdAt: any;
    academicYear?: string;
    term?: string;
};

export type Staff = {
    uid: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
};

// Payroll Schemas
export const payrollSettingsFormSchema = z.object({
    ssnitEmployeeContributionRate: z.coerce.number().min(0).max(1),
    ssnitEmployerContributionRate: z.coerce.number().min(0).max(1),
    payeeBrackets: z.array(z.object({
        from: z.coerce.number().min(0),
        to: z.coerce.number().min(0).nullable(),
        rate: z.coerce.number().min(0).max(1)
    }))
});

export interface TaxBracket {
  limit: number; 
  rate: number;  
}

export interface PayrollConfig {
  ssnitEmployeeRate: number;
  ssnitEmployerRate: number;
  tier3Rate: number;
  taxBrackets: TaxBracket[];
}

export interface StaffSalaryDetails {
  uid: string;
  name: string;
  role: string;
  basicSalary: number;
  allowances: { name: string; amount: number; isTaxable: boolean }[];
  tier3Contribution: number;
  bankName: string;
  accountNumber: string;
  tin: string;
  ssnitNumber: string;
}

export interface Payslip {
  id: string;
  month: string;
  staffId: string;
  staffName: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  ssnitDeduction: number;
  tier3Deduction: number;
  taxableIncome: number;
  payeTax: number;
  netSalary: number;
  employerSSNIT: number;
  totalCostToCompany: number;
  status: 'Draft' | 'Paid';
  date: any;
}


export type PayrollSettings = z.infer<typeof payrollSettingsFormSchema> & { id: string };

const allowanceSchema = z.object({ name: z.string().min(1), amount: z.coerce.number().min(0) });
const deductionSchema = z.object({ name: z.string().min(1), amount: z.coerce.number().min(0) });

export const staffPayrollConfigSchema = z.object({
    basicSalary: z.coerce.number().min(0),
    allowances: z.array(allowanceSchema).optional(),
    deductions: z.array(deductionSchema).optional(),
    ssnitNumber: z.string().min(1),
    tinNumber: z.string().min(1),
    bankName: z.string().min(1),
    accountNumber: z.string().min(1),
});

export type StaffPayrollConfig = z.infer<typeof staffPayrollConfigSchema> & {
    id?: string;
    staffId: string;
}

export type PayrollRecord = {
    id: string;
    staffId: string;
    staffName: string;
    period: string; // "YYYY-MM"
    grossSalary: number;
    netSalary: number;
    basicSalary: number;
    totalAllowances: number;
    totalDeductions: number;
    allowances: Array<{name: string, amount: number}>;
    deductions: Array<{name: string, amount: number}>;
    statutory: {
        ssnitEmployee: number;
        ssnitEmployer: number;
        paye: number;
    },
    createdAt: any;
}

// Accounts Payable Schemas
export const vendorSchema = z.object({
    name: z.string().min(1, 'Vendor name is required.'),
    category: z.string().min(1, 'Category is required.'),
    email: z.string().email('Invalid email address.'),
    phone: z.string().min(1, 'Phone number is required.'),
});

export type Vendor = z.infer<typeof vendorSchema> & { id: string };

export const payableSchema = z.object({
    vendorId: z.string().min(1, 'A vendor must be selected.'),
    expenseAccountId: z.string().min(1, 'An expense account must be selected.'),
    description: z.string().min(1, 'A description is required.'),
    invoiceNumber: z.string().optional(),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than zero.'),
    dueDate: z.date({ required_error: 'A due date is required.'}),
});

export type AccountsPayableRecord = z.infer<typeof payableSchema> & {
    id: string;
    status: 'Unpaid' | 'Paid';
    createdAt: any;
    paidAt?: any;
    paymentAccountId?: string;
};

// General Ledger Schemas
export const ACCOUNT_TYPES = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'] as const;
export type AccountType = typeof ACCOUNT_TYPES[number];

export const accountSchema = z.object({
    name: z.string().min(1, 'Account name is required.'),
    type: z.enum(ACCOUNT_TYPES),
    parentAccountId: z.string().optional(),
    description: z.string().optional(),
});

export type ChartOfAccount = {
    accountId: string;
    name: string;
    type: AccountType;
    isControlAccount: boolean;
    parentAccountId?: string;
    description?: string;
};

export type JournalEntryItem = {
    accountId: string;
    amount: number;
};

export type GeneralLedgerTransaction = {
    id: number;
    ref: string;
    date: string;
    description: string;
    debits: JournalEntryItem[];
    credits: JournalEntryItem[];
};

export const journalEntrySchema = z.object({
    description: z.string().min(1, 'Description is required.'),
    amount: z.coerce.number().positive('Amount must be positive.'),
    debitAccountId: z.string().min(1, 'Debit account is required.'),
    creditAccountId: z.string().min(1, 'Credit account is required.'),
}).refine(data => data.debitAccountId !== data.creditAccountId, {
    message: 'Debit and Credit accounts cannot be the same.',
    path: ['creditAccountId'],
});
    
// Inventory Schemas
export const inventoryItemSchema = z.object({
    name: z.string().min(1, "Item name is required."),
    category: z.enum(['Uniform', 'Book', 'Stationery', 'Other']),
    quantity: z.coerce.number().int().min(0),
    location: z.string().min(1, "Location is required."),
    supplier: z.string().optional(),
    purchaseDate: z.date().optional(),
    unitPrice: z.coerce.number().min(0).optional(),
    condition: z.enum(['New', 'Good', 'Fair', 'Poor', 'For Repair']),
});

export type InventoryItem = z.infer<typeof inventoryItemSchema> & {
    id: string;
    status: 'Available' | 'In Use' | 'Under Maintenance' | 'Out of Stock';
    currentHolderId?: string;
    currentHolderName?: string;
    lastCheckedOut?: any;
};

export const checkoutSchema = z.object({
  staffId: z.string().min(1, "You must select a staff member."),
});

export type InventoryTransaction = {
    id: string;
    itemId: string;
    transactionType: 'Creation' | 'Check-Out' | 'Check-In' | 'Sale' | 'Adjustment' | 'Audit';
    timestamp: any;
    staffId?: string; // Who performed the action
    quantityChange?: number;
    notes?: string;
};

// Transport Schemas
export type Bus = {
    id: string;
    name: string;
    capacity: number;
    assignedDriverId?: string;
};
  
export type Stop = {
    id: string;
    name: string;
    address: string;
    order: number;
    assignedStudentIds: string[];
};
  
export type Route = {
    id: string;
    name: string;
    busId: string;
    driverId: string;
    stops: Stop[];
};

export const studentAssignmentSchema = z.object({
    studentId: z.string().min(1, "You must select a student."),
    stopId: z.string().min(1, "You must select a stop."),
});

// Attendance Schemas
export const attendanceRecordSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  studentName: z.string().optional(), // For display only, not stored
  classId: z.string(),
  date: z.date(),
  status: z.enum(['Present', 'Absent', 'Late', 'Excused']),
  notes: z.string().optional(),
  usesBusService: z.boolean().optional(),
});

export type AttendanceRecord = z.infer<typeof attendanceRecordSchema> & {
    id: string;
};


// Audit Log Schema
export const auditLogSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  action: z.string(), // e.g., 'CREATE_STUDENT', 'UPDATE_GRADE'
  details: z.string(), // e.g., 'Created student John Doe'
  targetId: z.string().optional(), // ID of the entity that was affected
  timestamp: z.date(),
});

export type AuditLog = z.infer<typeof auditLogSchema> & {
  id: string;
};

// Maths Club Schemas
export const mathProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    metadata: z.object({
        source: z.string().optional(),
        gradeLevel: z.string().optional(),
    }).optional(),
    classId: z.string().min(1, "Please select a class."),
});

export type MathProblem = z.infer<typeof mathProblemSchema> & {
    id: string;
    explanation?: string;
};

export type UserResult = {
    id: string;
    userId: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken_seconds: number;
    date_completed: any;
    correct_count: number;
};

export type GlobalLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_quizzes_completed: number;
};

// Science Club Schemas
export const scienceProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    metadata: z.object({
        source: z.string().optional(),
        gradeLevel: z.string().optional(),
    }).optional(),
    classId: z.string().min(1, "Please select a class."),
});

export type ScienceProblem = z.infer<typeof scienceProblemSchema> & {
    id: string;
    explanation?: string;
};

export type ScienceResult = {
    id: string;
    userId: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    score: number;
    time_taken_seconds: number;
    date_completed: any;
    correct_count: number;
};

export type ScienceLeaderboardEntry = {
    id?: string;
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    points?: number;
    quizzesPlayed?: number;
};

export type DailyFact = {
    id: string;
    factText: string;
    text?: string;
    createdAt: any;
    postedBy: string;
};

// ELA Club Schemas
export const elaGrammarDrillSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    type: z.enum(["MCQ", "Drag and Drop"]),
    question_prompt: z.string().min(1, "Question prompt is required."),
    options: z.array(z.string()).optional(),
    correct_answer: z.union([z.string(), z.array(z.string())]).refine(val => (Array.isArray(val) ? val.length > 0 : String(val).length > 0), { message: "Correct answer cannot be empty." }),
    classId: z.string().min(1, "Please select a class."),
});

export type ElaGrammarDrill = z.infer<typeof elaGrammarDrillSchema> & {
    id: string;
    explanation?: string;
};

const elaQuestionSchema = z.object({
    question: z.string().min(1, "Question cannot be empty"),
    type: z.enum(["MCQ", "Short Answer"]),
    options: z.array(z.string()).optional(),
    correct_answer_key: z.string().min(1, "Correct answer is required"),
    explanation: z.string().optional(),
});

export const elaReadingPassageSchema = z.object({
    title: z.string().min(1, "Title is required."),
    passage_text: z.string().min(1, "Passage text is required."),
    reading_level: z.string().min(1, "Reading level is required."),
    classId: z.string().min(1, "Please select a class."),
    question_set: z.array(elaQuestionSchema).min(1, "At least one question is required."),
});


export type ElaReadingPassage = z.infer<typeof elaReadingPassageSchema> & {
    id: string;
};

export const elaWritingChallengeSchema = z.object({
    title: z.string().min(1, "Title is required."),
    prompt: z.string().min(10, "Prompt must be at least 10 characters."),
    challengeType: z.enum(['Creative Writing', 'Summarization', 'Essay']),
    classId: z.string().min(1, "Please select a class for this challenge."),
});

export type ElaWritingChallenge = z.infer<typeof elaWritingChallengeSchema> & {
    id: string;
    createdBy: string;
    createdAt: any;
};

export type ElaUserSubmission = {
    id: string;
    userId: string;
    challenge_id: string;
    challenge_title: string;
    submission_text: string;
    date_submitted: any;
    status: 'Submitted' | 'Graded';
    teacher_score?: number | null;
    teacher_feedback?: string | null;
};

export type ElaLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_challenges_completed: number;
};


// --- RICH LEARNING MATERIAL ---

// Attachment for a Topic
export interface Attachment {
    name: string;
    url: string;
    type: 'PDF' | 'DOC' | 'IMAGE';
}

// Video Link for a Topic
export interface VideoLink {
    title: string;
    url: string;
}

// Question for a Topic
export interface RichQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// The Main "Topic" Container
export interface LearningMaterial {
    id: string;
    courseId: string; // e.g. "bs7-integrated-science"
    strand: string;
    subStrand: string;
    topicTitle: string;
    content: string; // This is for rich text / html content
    attachments: Attachment[];
    videoLinks: VideoLink[];
    practiceQuestions: RichQuizQuestion[];
    createdAt: any;
    updatedAt?: any;
}

// --- CASH TILL MANAGEMENT ---
export type TillStatus = 'Open' | 'PendingApproval' | 'Closed';

export type Till = {
    id: string;
    accountantId: string;
    accountantName: string;
    openingBalance: number;
    closingBalance: number | null;
    dateOpened: any;
    dateClosed: any | null;
    status: TillStatus;
    directorApproval: {
        directorId: string | null;
        directorName: string | null;
        approvedAt: any | null;
        rejectionReason?: string;
    };
};

export type TillTransaction = {
    id: string;
    tillId: string;
    financialRecordId: string; // For POS, this could be the item ID
    studentId?: string; // For fees
    studentName?: string; // For fees
    amount: number;
    timestamp: any;
    description: string; // For POS, "Sale of: Book"
};

// --- BANK TRANSACTION APPROVAL ---
export const bankTransactionSchema = z.object({
  amount: z.number(),
  paymentMethod: z.enum(['Card', 'Bank Transfer', 'Mobile Money', 'Other']),
  notes: z.string().optional(),
  studentId: z.string(),
  studentName: z.string(),
  financialRecordId: z.string(),
  recordedById: z.string(),
  recordedByName: z.string(),
  status: z.enum(['Pending', 'Approved', 'Rejected']),
  schoolId: z.string(),
  approverId: z.string().optional(),
  approverName: z.string().optional(),
  rejectionReason: z.string().optional(),
});

export type BankTransaction = z.infer<typeof bankTransactionSchema> & {
    id: string;
    recordedAt: any;
    approvedAt?: any;
};


// --- THINK TANK MODULE ---
export interface Paradox {
  id: string;
  question: string;
  answer: string;
  explanation: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdAt: any;
  targetGroup: string;
}

export interface DebateTopic {
  id: string;
  topic: string;
  context: string; // Background info
  createdAt: any;
  targetGroup: string;
}

export interface DebateMessage {
  role: 'user' | 'ai';
  content: string;
}

// --- FORUM ---
export interface ForumThread {
    id: string;
    title: string;
    content: string;
    createdBy: {
        uid: string;
        name: string;
    };
    createdAt: any;
    aiModeratorEnabled: boolean;
    lastReplyAt?: any;
    replyCount?: number;
}

export interface ForumReply {
    id: string;
    threadId: string;
    author: {
        uid: string;
        name: string;
    };
    content: string;
    createdAt: any;
    isAIMessage?: boolean; // True if the reply is from the AI moderator
}

// --- ELA Explorer ---
export type ElaLesson = {
    id?: string;
    userId: string;
    timestamp: any;
    title: string;
    explanation: string;
    example: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}
    
// --- Science Explorer ---
export type ScienceLesson = {
    id?: string;
    userId: string;
    timestamp: any;
    title: string;
    explanation: string;
    analogy: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}

// --- Direct Messages ---
export interface ChatMetadata {
    id: string;
    participants: string[];
    participantDetails: Record<string, { name: string; role: string }>;
    lastMessage: string;
    lastMessageTime: any;
    unreadCount: Record<string, number>;
}

export interface Message {
    id: string;
    senderId: string;
    text: string;
    createdAt: any;
}

export interface Lecture {
  id: string;
  title: string;
  description?: string;
  classId?: string; // Changed from targetGroup
  scheduledFor?: any;
  teacherName: string;
  teacherId: string;
  status: 'scheduled' | 'live' | 'ended';
  createdAt: any;
  slides?: string[];
  currentSlide?: number;
  isPresentationMode?: boolean;
  breakoutActive?: boolean;
  breakoutDuration?: number;
  breakoutEndTime?: any;
}

// --- ACCOUNTING TYPES ---

export interface Account {
  id: string;
  code: string; // e.g., "1001"
  name: string; // e.g., "Cash on Hand"
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  balance: number; // Current running balance
  parentId?: string | null;
}

export interface JournalLine {
  accountId: string;
  accountName: string;
  debit: number;
  credit: number;
}

export interface JournalEntry {
  id: string;
  date: any; // Timestamp
  reference?: string; // e.g., "INV-001" or "PV-502"
  description: string;
  lines: JournalLine[];
  totalAmount: number;
  createdBy: string;
  createdAt: any;
}

export interface PaymentVoucher {
  id: string;
  payee: string;
  description: string;
  grossAmount: number;
  whtAmount: number;
  netAmount: number;
  paymentMethod: string;
  referenceNumber?: string;
  expenseAccountId: string;
  paymentAccountId: string;
  whtLiabilityAccountId?: string;
  status: 'Paid' | 'Cancelled';
  date: any;
  createdBy: string;
  linkedBillId?: string;
}

// --- PROCUREMENT & AP ---
export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  balance: number; // Amount we owe them
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  date: any;
  status: 'Draft' | 'Sent' | 'Received' | 'Cancelled';
  items: { 
    itemId: string; // From Inventory/Shop items
    name: string; 
    quantity: number; 
    unitCost: number; 
    total: number;
  }[];
  totalAmount: number;
  expectedDate?: any;
}

export interface VendorBill {
  id: string;
  supplierId: string;
  supplierName: string;
  poId: string; // Link to PO
  date: any;
  dueDate: any;
  totalAmount: number;
  amountPaid: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
  items: any[];
}


// --- PAYROLL ---
export interface TaxBracket {
  limit: number; 
  rate: number;  
}

export interface PayrollConfig {
  ssnitEmployeeRate: number;
  ssnitEmployerRate: number;
  tier3Rate: number;
  taxBrackets: TaxBracket[];
}

export interface StaffSalaryDetails {
  uid: string;
  name: string;
  role: string;
  basicSalary: number;
  allowances: { name: string; amount: number; isTaxable: boolean }[];
  tier3Contribution: number;
  bankName: string;
  accountNumber: string;
  tin: string;
  ssnitNumber: string;
}

export interface Payslip {
  id: string;
  month: string;
  staffId: string;
  staffName: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  ssnitDeduction: number;
  tier3Deduction: number;
  taxableIncome: number;
  payeTax: number;
  netSalary: number;
  employerSSNIT: number;
  totalCostToCompany: number;
  status: 'Draft' | 'Paid';
  date: any;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  attendanceRate: number; // 0-100
  averageGrade: number;   // 0-100
  missedAssessments: number;
  participationScore: number; // Calculated based on behavior records or consistency
}

export interface AiInsight {
  atRiskStudents: {
    studentName: string;
    reason: string; // e.g. "High grades but dropping attendance"
    intervention: string; // e.g. "Schedule parent meeting"
  }[];
  classTrends: string; // General observation
  teachingStrategy: string; // Advice for the teacher
}
    

    
