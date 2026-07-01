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
    questions: z.array(z.object({
        questionText: z.string().min(1, 'Question text is required.'),
        type: z.enum(['mcq', 'written']),
        options: z.array(z.string()).optional(),
        correctAnswer: z.string().optional(),
    })).optional(),
    timeLimit: z.coerce.number().optional(),
    startDate: z.string().optional(),
    questionsFile: z.object({
        fileName: z.string(),
        fileSize: z.string(),
        fileData: z.string(),
        fileType: z.string(),
    }).optional(),
    gradable: z.boolean().optional(),
    subjectId: z.string().optional(),
    assessmentType: z.string().optional(),
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
    questionType: z.enum(['mcq', 'written', 'mixed']).default('mcq'),
    dueDate: z.string().min(1, "Please select a submission due date."),
    context: z.string().optional(),
    gradeLevel: z.string().min(1, "Please enter a target grade/class level."),
    timeLimit: z.coerce.number().optional(),
    startDate: z.string().optional(),
    gradable: z.boolean().optional(),
    subjectId: z.string().optional(),
    assessmentType: z.string().optional(),
});

export type QuizQuestion = {
    questionText: string;
    type?: 'mcq' | 'written';
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
    dueDate?: any;
    context?: string;
    forGradeLevel?: string;
    timeLimit?: number;
    startDate?: string;
    gradable?: boolean;
    subjectId?: string;
    assessmentType?: string;
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
    reportCardPositionMode?: 'both' | 'subject_only' | 'none';
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
    enrollmentStatus?: 'Active' | 'Graduated' | 'Inactive' | 'Suspended' | 'Withdrawn';
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
    biometricId?: string;
    bloodGroup?: string;
    chronicIllnesses?: string;
    allergies?: string;
    healthNotes?: string;
    medical?: {
        bloodGroup?: string;
        conditions?: string;
        allergies?: string;
        physicianName?: string;
        physicianPhone?: string;
    };
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
    caWeight?: number;
    examWeight?: number;
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
  metrics?: { teaching: number; punctuality: number; engagement: number; professionalism: number; };
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
    customDescription: z.string().optional(),
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
    description?: string;
    studentId?: string;
    tillId?: string;
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
    costCenter?: string; // Department / Cost Center e.g. "Sports", "Transport"
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
    costCenter: z.string().optional(),
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

export interface Bus {
  id: string;
  name: string;
  capacity: number;
  schoolId: string;
}

export interface Stop {
  id: string;
  name: string;
  address: string;
  order: number;
  assignedStudentIds: string[];
}

export interface Route {
  id: string;
  name: string;
  busId: string;
  driverId: string;
  dailyRate: number;
  termlyRate?: number;
  stops: Stop[];
  schoolId?: string;
  driverName?: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  status: 'Present' | 'Late' | 'Absent';
  date: any;
  notes?: string;
  schoolId?: string;
}

export interface VideoLink {
  title: string;
  url: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: 'PDF' | 'IMAGE' | 'DOC' | 'Spreadsheet' | 'Link' | 'AUDIO';
  category?: 'PDF Document' | 'Worksheet' | 'Revision Guide' | 'Interactive Material' | 'Audio Lesson';
}

export interface RichQuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface LearningMaterial {
  id: string;
  topicTitle: string;
  content: string;
  classId: string;
  subject: string;
  videoLinks: VideoLink[];
  attachments: Attachment[];
  practiceQuestions: RichQuizQuestion[];
  uploadedBy: string;
  createdAt: any;
  updatedAt: any;
  schoolId: string;
  courseId?: string;
  strand?: string;
  subStrand?: string;
}

export interface Till {
  id: string;
  accountantId: string;
  accountantName: string;
  openingBalance: number;
  currentBalance: number;
  closingBalance: number | null;
  dateOpened: any;
  dateClosed: any;
  status: string;
  directorApproval: {
    directorId: string | null;
    directorName: string | null;
    approvedAt: any;
    rejectionReason?: string;
  };
  schoolId: string;
  expectedBalance?: number;
  actualCashCounted?: number;
  discrepancy?: number;
  discrepancyNote?: string;
}

export interface TillTransaction {
  id: string;
  tillId: string;
  amount: number;
  description: string;
  timestamp: any;
  type: string;
  status: string;
  schoolId: string;
  studentId?: string;
  studentName?: string;
  approverId?: string;
  approverName?: string;
  decisionAt?: any;
}

export interface BankTransaction {
  id: string;
  date: any;
  description: string;
  amount: number;
  type: 'Deposit' | 'Withdrawal' | 'Fee' | 'Interest' | string;
  reference?: string;
  schoolId: string;
}

export interface ChartOfAccount {
  accountId: string;
  name: string;
  type: AccountType;
  isControlAccount: boolean;
  parentAccountId?: string | null;
  description?: string;
  balance?: number;
  schoolId?: string;
}

export interface GeneralLedgerTransaction {
  id: number;
  ref: string;
  date: string;
  description: string;
  debits: { accountId: string; amount: number }[];
  credits: { accountId: string; amount: number }[];
}

export const vendorSchema = z.object({
  name: z.string().min(1, 'Vendor name is required.'),
  category: z.enum(['Office Supplies', 'Maintenance', 'IT Services', 'Catering', 'Transportation', 'Utilities', 'Other']),
  email: z.string().email('Invalid email address.').or(z.literal('')),
  phone: z.string().min(1, 'Phone number is required.').or(z.literal('')),
});

export type Vendor = z.infer<typeof vendorSchema> & {
  id: string;
  schoolId: string;
  createdAt: any;
};

export const payableSchema = z.object({
  vendorId: z.string().min(1, 'Vendor is required.'),
  description: z.string().min(1, 'Description is required.'),
  amount: z.coerce.number().min(0.01, 'Amount must be positive.'),
  dueDate: z.date({ required_error: 'Due date is required.' }),
  invoiceNumber: z.string().optional(),
  expenseAccountId: z.string().optional(),
});

export type AccountsPayableRecord = z.infer<typeof payableSchema> & {
  id: string;
  status: 'Unpaid' | 'Paid';
  createdAt: any;
  schoolId?: string;
  paidAt?: any;
  paymentAccountId?: string;
};

export interface AuditLog {
  id: string;
  timestamp: any;
  userName: string;
  action: string;
  details: string;
  schoolId: string;
}

export const staffPayrollConfigSchema = z.object({
  basicSalary: z.coerce.number().min(0),
  ssnitNumber: z.string().optional().or(z.literal('')),
  tinNumber: z.string().optional().or(z.literal('')),
  bankName: z.string().optional().or(z.literal('')),
  accountNumber: z.string().optional().or(z.literal('')),
  allowances: z.array(z.object({
    name: z.string().min(1, 'Name is required.'),
    amount: z.coerce.number().min(0),
  })).default([]),
  deductions: z.array(z.object({
    name: z.string().min(1, 'Name is required.'),
    amount: z.coerce.number().min(0),
  })).default([]),
});

export type StaffPayrollConfig = z.infer<typeof staffPayrollConfigSchema> & {
  schoolId?: string;
};

export type PayrollSettings = {
  id?: string;
  ssnitEmployeeContributionRate: number;
  ssnitEmployerContributionRate: number;
  payeeBrackets: { from: number; to: number; rate: number }[];
  schoolId?: string;
  updatedAt?: any;
};

export interface PayrollRecord {
  id?: string;
  staffId: string;
  staffName: string;
  basicSalary: number;
  totalAllowances: number;
  grossSalary: number;
  taxableIncome: number;
  netSalary: number;
  totalDeductions: number;
  allowances: { name: string; amount: number }[];
  deductions: { name: string; amount: number }[];
  ssnitNumber?: string;
  tinNumber?: string;
  bankName?: string;
  accountNumber?: string;
  statutory: {
    ssnitEmployee: number;
    ssnitEmployer: number;
    paye: number;
  };
  schoolId: string;
  period: string;
  processedById: string;
  processedByName: string;
  createdAt: any;
}

export const elaGrammarDrillSchema = z.object({
  topic: z.string().min(1),
  question_prompt: z.string().min(1),
  options: z.array(z.string()).min(2),
  correct_answer: z.string().min(1),
  explanation: z.string().optional(),
  difficulty: z.string().optional(),
});

export type ElaGrammarDrill = z.infer<typeof elaGrammarDrillSchema> & {
  id: string;
  schoolId?: string;
  classId?: string;
};

export const elaReadingPassageSchema = z.object({
  title: z.string().min(1),
  reading_level: z.string().min(1),
  passage_text: z.string().min(1),
  question_set: z.array(z.object({
    question: z.string().min(1),
    type: z.enum(['MCQ', 'Short Answer']),
    options: z.array(z.string()).optional(),
    correct_answer_key: z.string().min(1),
  })).min(1),
});

export type ElaReadingPassage = z.infer<typeof elaReadingPassageSchema> & {
  id: string;
  schoolId?: string;
  classId?: string;
};

export const elaWritingChallengeSchema = z.object({
  title: z.string().min(1),
  challengeType: z.string().min(1),
  prompt: z.string().min(1),
});

export type ElaWritingChallenge = z.infer<typeof elaWritingChallengeSchema> & {
  id: string;
  schoolId?: string;
  classId?: string;
};

export interface ElaUserSubmission {
  id: string;
  userId: string;
  challenge_id: string;
  challenge_title: string;
  type: string;
  submission_text?: string;
  user_answer?: string;
  question?: string;
  is_correct?: boolean;
  teacher_score: number | null;
  teacher_feedback?: string | null;
  date_submitted: any;
  status: string;
  schoolId: string;
}

export interface ElaLeaderboardEntry {
  userId: string;
  userName: string;
  profilePictureUrl: string;
  total_correct_answers: number;
  total_challenges_completed: number;
  schoolId: string;
}

export type InventoryItem = z.infer<typeof inventoryItemSchema> & {
    id: string;
    status: 'Available' | 'In Use' | 'Under Maintenance' | 'Out of Stock';
    currentHolderId?: string;
    currentHolderName?: string;
    schoolId?: string;
};

export interface ForumThread {
    id: string;
    title: string;
    content: string;
    createdBy: { uid: string; name: string };
    createdAt: any;
    aiModeratorEnabled: boolean;
    replyCount: number;
    lastReplyAt: any;
    schoolId: string;
}

export interface ForumReply {
    id: string;
    threadId: string;
    author: { uid: string; name: string };
    content: string;
    createdAt: any;
    isAIMessage: boolean;
}

export const scienceProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    classId: z.string().min(1, "Please select a class."),
});

export type ScienceProblem = z.infer<typeof scienceProblemSchema> & {
    id: string;
    schoolId: string;
    explanation?: string;
};

export interface DailyFact {
    id: string;
    factText: string;
    createdAt: any;
    postedBy?: string;
}

export interface ScienceLeaderboardEntry {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_quizzes_completed: number;
    schoolId: string;
}

export interface ScienceLesson {
    title: string;
    explanation: string;
    analogy: string;
    keyTerms: string[];
    quizQuestion: string;
    quizAnswer: string;
}

export interface Lecture {
    id: string;
    title: string;
    scheduledFor: any;
    schoolId?: string;
}

export const mathProblemSchema = z.object({
    topic: z.string().min(1, "Topic is required."),
    difficulty: z.enum(['Easy', 'Medium', 'Hard']),
    question_text: z.string().min(1, "Question text is required."),
    correct_answer: z.string().min(1, "Correct answer is required."),
    options: z.array(z.string().min(1, "Option cannot be empty.")).length(4, "You must provide 4 options."),
    classId: z.string().min(1, "Please select a class."),
});

export type MathProblem = z.infer<typeof mathProblemSchema> & {
    id: string;
    schoolId: string;
    explanation?: string;
};

export interface GlobalLeaderboardEntry {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_quizzes_completed: number;
    schoolId: string;
}

export interface Budget {
    id: string;
    schoolId: string;
    name: string;
    fiscalYear: string;
    term: string;
    startDate: any; // Firestore Timestamp
    endDate: any;   // Firestore Timestamp
    totalBudgetedRevenue: number;
    totalBudgetedExpenses: number;
    status: 'Draft' | 'Awaiting Review' | 'Approved' | 'Rejected' | 'Closed';
    createdAt: any;
    createdBy: string;
    updatedAt?: any;
    aiInsight?: string;
    rejectionReason?: string;
}

export interface BudgetItem {
    id: string;
    budgetId: string;
    schoolId: string;
    accountId: string;
    accountCode: string;
    accountName: string;
    accountType: 'Revenue' | 'Expense';
    budgetedAmount: number;
    costCenter?: string;
    createdAt: any;
}

export const budgetFormSchema = z.object({
    name: z.string().min(3, "Budget name must be at least 3 characters."),
    fiscalYear: z.string().min(1, "Please select an academic year."),
    term: z.string().min(1, "Please select a term."),
    startDate: z.date({ required_error: "Start date is required." }),
    endDate: z.date({ required_error: "End date is required." }),
}).refine(data => data.endDate >= data.startDate, {
    message: "End date cannot be before the start date.",
    path: ["endDate"],
});

// --- Boarding Module Schemas & Types ---

export const hostelBlockSchema = z.object({
    name: z.string().min(1, "Hostel block name is required."),
    genderRestriction: z.enum(['Male', 'Female', 'Co-Ed', 'None']),
    totalFloors: z.coerce.number().min(1, "Total floors must be at least 1."),
});

export type HostelBlock = z.infer<typeof hostelBlockSchema> & {
    id: string;
    schoolId: string;
    createdAt: any;
    createdBy: string;
};

export const hostelRoomSchema = z.object({
    roomNumber: z.string().min(1, "Room number is required."),
    floorLevel: z.coerce.number().min(0, "Floor level must be 0 or greater."),
    totalCapacity: z.coerce.number().min(1, "Total capacity must be at least 1."),
    roomType: z.enum(['Standard', 'AC', 'Premium', 'Study']),
    status: z.enum(['Available', 'Full', 'Maintenance', 'Inactive']),
});

export type HostelRoom = z.infer<typeof hostelRoomSchema> & {
    id: string;
    schoolId: string;
    blockId: string;
    createdAt: any;
};

export const hostelBedSchema = z.object({
    bedIdentifier: z.string().min(1, "Bed identifier is required."),
    status: z.enum(['Available', 'Occupied', 'Maintenance']),
    currentOccupantId: z.string().nullable().optional(),
});

export type HostelBed = z.infer<typeof hostelBedSchema> & {
    id: string;
    schoolId: string;
    blockId: string;
    roomId: string;
    createdAt: any;
};

export const hostelAllocationSchema = z.object({
    studentId: z.string().min(1, "Student ID is required."),
    studentName: z.string().min(1, "Student Name is required."),
    blockId: z.string().min(1, "Block ID is required."),
    blockName: z.string().min(1, "Block Name is required."),
    roomId: z.string().min(1, "Room ID is required."),
    roomNumber: z.string().min(1, "Room number is required."),
    bedId: z.string().min(1, "Bed ID is required."),
    bedIdentifier: z.string().min(1, "Bed identifier is required."),
    checkInDate: z.date({ required_error: "Check-in date is required." }),
    checkOutDate: z.date().nullable().optional(),
    status: z.enum(['Active', 'Completed', 'Cancelled']),
});

export type HostelAllocation = z.infer<typeof hostelAllocationSchema> & {
    id: string;
    schoolId: string;
    allocatedById: string;
    allocatedByName: string;
    createdAt: any;
};

// --- Student Outings & Leaves Schemas & Types ---

export const studentLeaveSchema = z.object({
    studentId: z.string().min(1, "Student ID is required."),
    studentName: z.string().min(1, "Student Name is required."),
    leaveType: z.enum(['Day Outing', 'Weekend Leave', 'Vacation']),
    departureDate: z.date({ required_error: "Departure date is required." }),
    expectedReturnDate: z.date({ required_error: "Expected return date is required." }),
    destination: z.string().min(1, "Destination is required."),
    reason: z.string().min(1, "Reason is required."),
    parentContact: z.string().min(1, "Parent contact is required."),
});

export type StudentLeave = z.infer<typeof studentLeaveSchema> & {
    id: string;
    schoolId: string;
    status: 'Pending' | 'Approved' | 'Rejected' | 'CheckedOut' | 'Completed' | 'Overdue';
    gatePassToken?: string | null;
    approvedById?: string | null;
    approvedByName?: string | null;
    approvedAt?: any | null;
    actualDepartureTime?: any | null;
    actualReturnTime?: any | null;
    securityCheckOutById?: string | null;
    securityCheckOutByName?: string | null;
    securityCheckInById?: string | null;
    securityCheckInByName?: string | null;
    createdAt: any;
    createdBy: string;
    createdByName: string;
    createdByRole: 'Parent' | 'Student';
};

// --- Boarding Visitors Schemas & Types ---

export const boardingVisitorSchema = z.object({
    visitorName: z.string().min(1, "Visitor name is required."),
    contactNumber: z.string().min(1, "Contact number is required."),
    relationshipToStudent: z.string().min(1, "Relationship to student is required."),
    photoIdUrl: z.string().min(1, "Photo ID is required."),
    studentId: z.string().min(1, "Student visited ID is required."),
    studentName: z.string().min(1, "Student Name is required."),
});

export type BoardingVisitor = z.infer<typeof boardingVisitorSchema> & {
    id: string;
    schoolId: string;
    checkInTime: any;
    checkOutTime: any | null;
    recordedById: string;
    recordedByName: string;
    createdAt: any;
};

// --- Roll Call Report Schemas & Types ---

export const rollCallReportSchema = z.object({
    date: z.string().min(1, "Roll call date is required."),
    presentStudentIds: z.array(z.string()),
});

export type RollCallReport = {
    id: string;
    schoolId: string;
    date: string;
    presentCount: number;
    absentCount: number;
    unaccountedCount: number;
    legallyAbsentCount: number;
    presentStudentIds: string[];
    unaccountedStudentIds: string[];
    legallyAbsentStudentIds: string[];
    recordedById: string;
    recordedByName: string;
    createdAt: any;
};

// --- Mess & Diet Management Schemas & Types ---

export const mealItemSchema = z.object({
    breakfast: z.string().min(1, "Breakfast menu description is required."),
    lunch: z.string().min(1, "Lunch menu description is required."),
    dinner: z.string().min(1, "Dinner menu description is required."),
});

export const messMenuSchema = z.object({
    weekStartDate: z.string().min(1, "Week start date is required."),
    menu: z.record(mealItemSchema),
});

export type MessMenu = z.infer<typeof messMenuSchema> & {
    id: string;
    schoolId: string;
    publishedById: string;
    publishedByName: string;
    createdAt: any;
    updatedAt: any;
};

export const diningAttendanceSchema = z.object({
    date: z.string().min(1, "Attendance date is required."),
    mealType: z.enum(['Breakfast', 'Lunch', 'Dinner']),
    studentId: z.string().min(1, "Student ID is required."),
    status: z.enum(['Attended', 'Missed']),
});

export type DiningAttendance = z.infer<typeof diningAttendanceSchema> & {
    id: string;
    schoolId: string;
    studentName: string;
    recordedById: string;
    recordedByName: string;
    timestamp: any;
};

// --- Infirmary & Medical Tracking Schemas & Types ---

export const infirmaryVisitSchema = z.object({
    studentId: z.string().min(1, "Student ID is required."),
    reportedSymptoms: z.string().min(1, "Reported symptoms are required."),
    treatmentAdministered: z.string().min(1, "Medication / Treatment administered is required."),
    disposition: z.enum(['Returned to Dorm', 'Kept for Observation', 'Transferred to Hospital']),
    isSevereTriage: z.boolean().default(false),
});

export type InfirmaryVisit = z.infer<typeof infirmaryVisitSchema> & {
    id: string;
    schoolId: string;
    studentName: string;
    visitDate: any;
    treatingStaffId: string;
    treatingStaffName: string;
    createdAt: any;
};
// --- Student Digital Wallet Schemas & Types ---

export const studentWalletSchema = z.object({
    studentId: z.string().min(1, "Student ID is required."),
    studentName: z.string().min(1, "Student Name is required."),
    schoolId: z.string().min(1, "School ID is required."),
    balance: z.number().default(0),
});

export type StudentWallet = z.infer<typeof studentWalletSchema> & {
    id: string;
    updatedAt: any;
};

export const walletTransactionSchema = z.object({
    studentId: z.string().min(1, "Student ID is required."),
    schoolId: z.string().min(1, "School ID is required."),
    amount: z.number(),
    type: z.enum(['Credit', 'Debit']),
    description: z.string().min(1, "Description is required."),
    reference: z.string().min(1, "Reference code is required."),
});

export type WalletTransaction = z.infer<typeof walletTransactionSchema> & {
    id: string;
    recordedById: string;
    recordedByName: string;
    timestamp: any;
};

