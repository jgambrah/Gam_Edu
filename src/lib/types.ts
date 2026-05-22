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
  | 'Transport Staff'
  | 'Cleaner'
  | 'Security Officer'
  | 'Secretary'
  | 'Receptionist';

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
  'Cleaner',
  'Security Officer',
  'Secretary',
  'Receptionist',
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

export type Tutorial = {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  category: 'General' | 'Finance' | 'Academics' | 'Admin';
  createdAt: any;
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
  teacherId: z.string().optional(),
}).refine(data => !data.score || !data.maxScore || data.score <= data.maxScore, {
  message: "Score cannot exceed max score",
  path: ["score"],
});


export type Assessment = z.infer<typeof assessmentFeedbackSchema> & {
    id: string;
    createdAt: any;
    teacherRemark?: string;
    subjectName?: string;
};

export const behavioralRecordSchema = z.object({
    studentId: z.string().min(1, "Student is required."),
    studentName: z.string().optional(),
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
    classTeacherSignatureUrl?: string;
    headmasterSignatureUrl?: string;
    digitalFingerprint?: string;
}

// Timetable Schemas
export type Subject = { 
    id: string; 
    name: string; 
    teacherIds: string[];
    weeklyPeriods?: number;
    requiresLab?: boolean;
    targetClasses?: string[];
};
export type Room = { id: string; name: string; capacity: number; isLab?: boolean };
export type TimeSlot = { 
  id: string; 
  day: string; 
  startTime: string; 
  endTime: string; 
  type: 'Lesson' | 'Break' | 'Lunch' | 'Worship' | 'Event';
  label?: string;
  classId?: string | null; // NULL means global/all classes
};
export type TimetableEntry = {
  id: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  roomId: string;
  day: string;
  timeSlotId: string;
  schoolId?: string;
  startTime?: string;
  endTime?: string;
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
    routeId?: string; 
    usesBusService?: boolean;
    usesCanteen?: boolean;
    photoURL?: string; 
    transportBillingModel?: 'Daily' | 'Termly';
    canteenBillingMode?: 'Daily' | 'Termly' | 'None';
    schoolId?: string;
};

export type Class = {
    id: string;
    name: string;
    description?: string;
    teacherId?: string;
    studentIds?: string[];
    capacity?: number;
    schoolId?: string;
    homeRoomId?: string;
    teachingModel?: 'ClassTeacher' | 'SubjectTeacher';
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
  schoolId?: string;
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
  schoolId?: string;
};


// Financial Schemas
export const financialRecordSchema = z.object({
  studentId: z.string().min(1, "A student must be selected."),
  type: z.enum([
    'Tuition Fee', 
    'Admission Fee',
    'Maintenance Fee',
    'Examination Fee',
    'PTA Levy',
    'Library Fine', 
    'Lab Fee', 
    'Sports Fee', 
    'Canteen Fee', 
    'Canteen Fee (Daily)',
    'Canteen Fee (Termly)',
    'Transport Fee', 
    'Transport Fee (Daily)', 
    'Transport Fee (Termly)', 
    'Other', 
    'Correction / Reversal'
  ]),
  description: z.string().min(1, "Description is required."),
  billedAmount: z.coerce.number().min(0.01, "Amount must be greater than 0."),
  dueDate: z.date({ required_error: "Due date is required." }),
  academicYear: z.string().optional(),
  term: z.string().optional(),
});

export const bulkBillingSchema = z.object({
  classId: z.string().min(1, "A class must be selected."),
  type: z.enum([
    'Tuition Fee', 
    'Admission Fee',
    'Maintenance Fee',
    'Examination Fee',
    'PTA Levy',
    'Lab Fee', 
    'Sports Fee', 
    'Canteen Fee', 
    'Transport Fee', 
    'Other'
  ]),
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
    type: 
      | 'Tuition Fee' 
      | 'Admission Fee'
      | 'Maintenance Fee'
      | 'Examination Fee'
      | 'PTA Levy'
      | 'Library Fine' 
      | 'Lab Fee' 
      | 'Sports Fee' 
      | 'Canteen Fee' 
      | 'Canteen Fee (Daily)'
      | 'Canteen Fee (Termly)'
      | 'Transport Fee' 
      | 'Transport Fee (Daily)' 
      | 'Transport Fee (Termly)' 
      | 'Other' 
      | 'Correction / Reversal';
    description: string;
    billedAmount: number;
    amountPaid: number;
    waiverAmount?: number;
    waiverReason?: string;
    status: 'Paid' | 'Unpaid' | 'Overdue' | 'Pending Reversal' | 'Rejected Reversal';
    dueDate: any;
    createdAt: any;
    lastPaymentDate?: any; 
    academicYear?: string;
    term?: string;
    schoolId?: string;
};

export type PaymentTransaction = {
    id: string;
    amount: number;
    method: string;
    notes?: string;
    paidAt: any;
    processedById: string;
    processedByName: string;
    schoolId?: string;
};

export type Staff = {
    uid: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    email: string;
    schoolId?: string;
    signatureUrl?: string;
    photoURL?: string;
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
  schoolId?: string;
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
  schoolId?: string;
}

export interface StudentPerformance {
  studentId: string;
  studentName: string;
  attendanceRate: number; 
  averageGrade: number;   
  missedAssessments: number;
  participationScore: number; 
  schoolId?: string;
}

export interface AiInsight {
  atRiskStudents: {
    studentName: string;
    reason: string; 
    intervention: string; 
  }[];
  classTrends: string; 
  teachingStrategy: string; 
}

export type ModuleType =
  | 'SINGING_DICTIONARY' | 'PHONICS' | 'READING_WRITING'
  | 'NUMERACY' | 'LIFE_SKILLS' | 'SCIENCE'
  | 'CREATIVE_ARTS' | 'TUTOR';

export interface DictionaryWord {
  word: string;
  category: string;
  imagePrompt: string;
}

export type StaffAttendance = {
    id: string;
    staffId: string;
    staffName: string;
    type: 'In' | 'Out';
    status: 'Present' | 'Late';
    leftEarly?: boolean;
    timestamp: any;
    verificationPhotoUrl: string;
    schoolId: string;
    latitude?: number;
    longitude?: number;
    isFlagged?: boolean;
    distanceMeters?: number;
    isIdentityFlagged?: boolean;
    identityNotes?: string;
};

export type AccountType = 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
export const ACCOUNT_TYPES: AccountType[] = ['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'];

export const accountSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  type: z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense']),
  parentAccountId: z.string().optional(),
  description: z.string().optional(),
});

export type Account = {
    id: string;
    code: string;
    name: string;
    type: AccountType;
    isControlAccount: boolean;
    parentAccountId?: string | null;
    description?: string;
    balance: number;
    schoolId: string;
};

export type JournalLine = {
    accountId: string;
    accountName: string;
    debit: number;
    credit: number;
};

export type JournalEntry = {
    id: string;
    date: any;
    description: string;
    reference?: string;
    lines: JournalLine[];
    totalAmount: number;
    createdBy: string;
    createdAt: any;
    schoolId: string;
};

export const journalEntrySchema = z.object({
    description: z.string().min(1, "Description is required"),
    amount: z.coerce.number().min(0.01, "Amount must be positive"),
    debitAccountId: z.string().min(1, "Debit account is required"),
    creditAccountId: z.string().min(1, "Credit account is required"),
});

export type InventoryTransaction = {
    id: string;
    itemId: string;
    transactionType: 'Creation' | 'Check-Out' | 'Check-In' | 'Sale' | 'Adjustment' | 'Restock';
    quantityChange?: number;
    timestamp: any;
    staffId?: string;
    notes?: string;
    schoolId: string;
}

export const checkoutSchema = z.object({
    staffId: z.string().min(1, 'Please select a staff member.'),
});

export const inventoryItemSchema = z.object({
    name: z.string().min(1, 'Item name is required.'),
    category: z.enum(['IT Equipment', 'Furniture', 'Office Supplies', 'Lab Equipment', 'Sports Gear', 'Other']),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1.'),
    location: z.string().min(1, 'Location is required.'),
    unitPrice: z.coerce.number().min(0, 'Unit price cannot be negative.').optional(),
    supplier: z.string().optional(),
    purchaseDate: z.date().optional(),
    condition: z.enum(['New', 'Good', 'Fair', 'Poor', 'For Repair']),
});

export type Paradox = {
    id: string;
    question: string;
    answer: string;
    explanation: string;
    targetGroup: string;
    difficulty: string;
    createdAt: any;
};

export type DebateTopic = {
    id: string;
    topic: string;
    context: string;
    targetGroup: string;
    createdAt: any;
};
