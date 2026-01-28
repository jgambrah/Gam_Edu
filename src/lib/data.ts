
import type { NavItem, UserRole, ChartOfAccount, GeneralLedgerTransaction, Bus, Route } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
  MessageSquare,
  MessageCircle,
  Library,
  Banknote,
  UserPlus,
  HeartHandshake,
  BookMarked,
  ClipboardCheck,
  FileText,
  CalendarDays,
  ClipboardList,
  FilePen,
  UserCheck as UserCheckIcon,
  Plane,
  Star,
  Landmark,
  Boxes,
  Route as RouteIcon,
  BookCopy,
  BarChart,
  CalendarCheck,
  UserCog as StaffIcon, // Using UserCog for Staff
  Shield,
  Code,
  Sigma,
  FlaskConical,
  BookOpenCheck,
  Activity,
  FolderKanban,
  PenSquare,
  TrendingUp,
  Gamepad2,
  AlertCircle,
  Atom,
  Wallet,
  Settings,
  Megaphone,
  BrainCircuit,
  Clapperboard,
  Book,
  ShoppingBag,
  Wrench,
  Truck,
  Calculator,
  Building2,
  Rabbit,
  Rocket,
  FileQuestion,
  Sparkles
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    roles: 'all',
  },
  {
    path: '/dashboard/announcements',
    title: 'Announcements',
    icon: Megaphone,
    roles: 'all',
  },
  {
    path: '/dashboard/my-bills',
    title: 'My Bills',
    icon: Banknote,
    roles: ['Student', 'Parent'],
  },
  {
    path: '/dashboard/people',
    title: 'People Management',
    icon: Users,
    roles: ['Director', 'Administrator', 'Teacher', 'Parent'],
    subItems: [
        {
            path: '/dashboard/admissions',
            title: 'Admissions',
            icon: FilePen,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/staff-management-v2',
            title: 'Staff Management',
            icon: UserCog,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/students-v3',
            title: 'Students',
            icon: GraduationCap,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/parents-v2',
            title: 'Parents',
            icon: HeartHandshake,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/alumni',
            title: 'Alumni',
            icon: UserCheckIcon,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/student-registration',
            title: 'Apply for Admission',
            icon: FilePen,
            roles: ['Parent'],
        },
    ]
  },
  {
    path: '/dashboard/academics',
    title: 'Academics',
    icon: BookOpen,
    roles: ['Director', 'Administrator', 'Teacher', 'Student'],
    subItems: [
        {
            path: '/dashboard/academics',
            title: 'Classes',
            icon: Users,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/academics/subjects',
            title: 'Subjects',
            icon: BookCopy,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/assignments',
            title: 'Assignments & Quizzes',
            icon: BookMarked,
            roles: ['Director', 'Administrator', 'Teacher', 'Student'],
        },
        {
            path: '/dashboard/lesson-planning',
            title: 'Lesson Planning',
            icon: ClipboardList,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
         {
            path: '/dashboard/academics/learning-materials',
            title: 'Learning Materials',
            icon: FolderKanban,
            roles: ['Director', 'Administrator', 'Teacher', 'Student'],
        },
        {
            path: '/dashboard/assessments',
            title: 'Assessments',
            icon: ClipboardCheck,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/academics/gradebook',
            title: 'Gradebook',
            icon: TrendingUp,
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
        },
        {
            path: '/dashboard/academics/analytics',
            title: 'Learning Analytics',
            icon: BrainCircuit,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/report-cards',
            title: 'Report Cards',
            icon: FileText,
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
        },
        {
            path: '/dashboard/timetable',
            title: 'Timetable',
            icon: CalendarDays,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/smart-schedule',
            title: 'Smart Schedule',
            icon: CalendarCheck,
            roles: ['Student', 'Teacher'],
        },
        {
            path: '/dashboard/calendar',
            title: 'School Calendar',
            icon: CalendarDays,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
    ]
  },
  {
    path: '/dashboard/clubs',
    title: 'Clubs & Activities',
    icon: Activity,
    roles: ['Student', 'Teacher', 'Administrator', 'Director'],
    subItems: [
        {
            path: '/dashboard/junior-academy',
            title: 'Junior Campus',
            icon: Rabbit,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/nursery-bloom',
            title: 'Nursery Bloom',
            icon: Sparkles,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/senior-academy',
            title: 'Senior Academy',
            icon: Rocket,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/study-club',
            title: 'Dr. Gam AI Tutor',
            icon: BrainCircuit,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/maths-club-v2',
            title: 'Maths Club',
            icon: Sigma,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/science-club-v2',
            title: 'Science Club',
            icon: FlaskConical,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/ela-club',
            title: 'ELA Club',
            icon: BookOpenCheck,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/coding-club',
            title: 'Coding Club',
            icon: Code,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/think-tank',
            title: 'Think Tank',
            icon: BrainCircuit,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/game-zone',
            title: 'Game Zone',
            icon: Gamepad2,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/live-classroom',
            title: 'Live Classroom',
            icon: Clapperboard,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
    ]
  },
  {
    path: '/dashboard/communication',
    title: 'Communication',
    icon: MessageSquare,
    roles: 'all',
    subItems: [
        {
            path: '/dashboard/forum',
            title: 'Forum',
            icon: MessageSquare,
            roles: 'all',
        },
        {
            path: '/dashboard/messages',
            title: 'Direct Messages',
            icon: MessageCircle,
            roles: 'all',
        },
        {
            path: '/dashboard/communication/sms',
            title: 'Bulk SMS',
            icon: MessageSquare,
            roles: ['Director', 'Administrator'],
        }
    ]
  },
   {
    path: '/dashboard/hr',
    title: 'Human Resources',
    icon: UserCog,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff'],
    subItems: [
        {
            path: '/dashboard/leave-management',
            title: 'Leave Management',
            icon: Plane,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff'],
        },
        {
            path: '/dashboard/my-payslips',
            title: 'My Payslips',
            icon: FileText,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff'],
        },
        {
            path: '/dashboard/staff/performance',
            title: 'Performance',
            icon: Star,
            roles: ['Director', 'Administrator'],
        },
    ]
  },
  {
    path: '/dashboard/financials',
    title: 'Financials',
    icon: Banknote,
    roles: ['Director', 'Administrator', 'Accountant', 'Librarian', 'Cook'],
     subItems: [
      {
        path: '/dashboard/accounts',
        title: 'Student Billing',
        icon: Banknote,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/accounting',
        title: 'Accounting / GL',
        icon: Book,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/payroll/staff-config',
        title: 'Staff Payroll Config',
        icon: Settings,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/payroll',
        title: 'Payroll',
        icon: Calculator,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/procurement',
        title: 'Procurement',
        icon: Truck,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/shop',
        title: 'School Shop',
        icon: ShoppingBag,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/cash-till',
        title: 'Cash Till',
        icon: Wallet,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/reports/financials',
        title: 'Financial Reports',
        icon: BarChart,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/payroll/settings',
        title: 'Settings',
        icon: Settings,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
    ]
  },
   {
    path: '/dashboard/operations',
    title: 'Operations',
    icon: Boxes,
    roles: ['Director', 'Administrator', 'Librarian', 'Transport Staff', 'Student', 'Teacher', 'Accountant'],
     subItems: [
        {
            path: '/dashboard/library',
            title: 'Library',
            icon: Library,
            roles: ['Librarian', 'Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/inventory',
            title: 'Inventory',
            icon: Boxes,
            roles: ['Administrator', 'Director', 'Accountant'],
        },
        {
            path: '/dashboard/transport',
            title: 'Transport',
            icon: RouteIcon,
            roles: ['Administrator', 'Director', 'Transport Staff'],
        },
    ]
  },
  {
    path: '/dashboard/reports',
    title: 'Reporting & Analytics',
    icon: BarChart,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant'],
     subItems: [
      {
        path: '/dashboard/reports/academics',
        title: 'Academic',
        icon: GraduationCap,
        roles: ['Director', 'Administrator', 'Teacher'],
      },
      {
        path: '/dashboard/reports/attendance',
        title: 'Attendance',
        icon: CalendarCheck,
        roles: ['Director', 'Administrator', 'Teacher'],
      },
      {
        path: '/dashboard/reports/enrollment',
        title: 'Enrollment',
        icon: Users,
        roles: ['Director', 'Administrator'],
      },
      {
        path: '/dashboard/reports/inventory',
        title: 'Inventory',
        icon: Boxes,
        roles: ['Director', 'Administrator'],
      },
    ]
  },
  {
    path: '/dashboard/system',
    title: 'System & Administration',
    icon: Shield,
    roles: ['Director', 'Administrator'],
    subItems: [
        {
            path: '/dashboard/audit-log',
            title: 'Audit Log',
            icon: FileText,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/admin/school-profile',
            title: 'School Profile',
            icon: Building2,
            roles: ['Director', 'Administrator'],
        },
    ]
  },
  {
    path: '/dashboard/help',
    title: 'Help Center',
    icon: FileQuestion,
    roles: 'all',
  },
];

export const sampleAnnouncements = [
  {
    id: 1,
    title: 'Annual Sports Day Postponed',
    date: '2024-10-15',
    content: `Dear Parents and Students,\nPlease note that the Annual Sports Day, originally scheduled for October 20th, has been postponed due to forecasted heavy rain. The new date will be November 5th. All event timings and venues remain the same. We apologize for any inconvenience this may cause and appreciate your understanding. Field trip permission slips for the science museum are due by this Friday, October 18th. Also, the parent-teacher conference is scheduled for next month.`,
  },
  {
    id: 2,
    title: 'Parent-Teacher Conference Schedule',
    date: '2024-10-12',
    content: `We are pleased to announce the schedule for the upcoming Parent-Teacher Conferences on November 10th and 11th. Please log in to the portal to book your slots with the respective teachers. Bookings will be open from October 15th to November 5th. This is a valuable opportunity to discuss your child's progress.`,
  },
  {
    id: 3,
    title: 'School Policy Update: Mobile Phones',
    date: '2024-10-10',
    content: `Effective immediately, there is an update to the school's mobile phone policy. Students are no longer permitted to use mobile phones during lunch breaks to encourage more social interaction. Phones must be kept in lockers during school hours. This policy change will be strictly enforced by all staff. Teachers are required to attend a brief meeting on this policy change this Friday after school in the staff room.`,
  },
];


export const MOCK_SUBJECTS = [
    { id: 'math-01', name: 'Mathematics' },
    { id: 'sci-01', name: 'Science' },
    { id: 'eng-01', name: 'English Language Arts' },
    { id: 'hist-01', name: 'History' },
    { id: 'art-01', name: 'Art' },
];

export const MOCK_ACADEMIC_YEARS = ['2023-2024', '2024-2025'];
export const MOCK_TERMS = ['First Term', 'Second Term', 'Third Term'];

export const LEAVE_TYPES = ['Sick Leave', 'Vacation', 'Personal', 'Study Leave', 'Unpaid Leave'] as const;

export const MOCK_PUBLIC_HOLIDAYS = [
    { name: "New Year's Day", date: new Date('2024-01-01') },
    { name: 'Memorial Day', date: new Date('2024-05-27') },
    { name: 'Independence Day', date: new Date('2024-07-04') },
    { name: 'Labor Day', date: new Date('2024-09-02') },
    { name: 'Thanksgiving Day', date: new Date('2024-11-28') },
    { name: 'Christmas Day', date: new Date('2024-12-25') },
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
    { accountId: '1010', name: 'Cash at Bank', type: 'Asset', isControlAccount: false, parentAccountId: '1000' },
    { accountId: '1200', name: 'Accounts Receivable', type: 'Asset', isControlAccount: true, parentAccountId: '1000' },
    { accountId: '2100', name: 'Accounts Payable', type: 'Liability', isControlAccount: true, parentAccountId: '2000' },
    { accountId: '4000', name: 'Operating Revenue', type: 'Revenue', isControlAccount: true },
    { accountId: '4010', name: 'Tuition Fees', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
    { accountId: '4020', name: 'Library Fines', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
    { accountId: '5000', name: 'Operating Expenses', type: 'Expense', isControlAccount: true },
    { accountId: '5010', name: 'Salaries Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '5020', name: 'Utilities Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '5030', name: 'Maintenance Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '1000', name: 'Current Assets', type: 'Asset', isControlAccount: true },
    { accountId: '2000', name: 'Current Liabilities', type: 'Liability', isControlAccount: true },
    { accountId: '3000', name: 'Equity', type: 'Equity', isControlAccount: true },
    { accountId: '3010', name: 'Retained Earnings', type: 'Equity', isControlAccount: false, parentAccountId: '3000' },

];

export const MOCK_JOURNAL_ENTRIES: GeneralLedgerTransaction[] = [
    { id: 1, ref: 'INV-001', date: '2024-07-15', description: 'Billed John Doe for Fall Term', debits: [{ accountId: '1200', amount: 5000 }], credits: [{ accountId: '4010', amount: 5000 }] },
    { id: 2, ref: 'PAY-001', date: '2024-08-01', description: 'Received tuition payment from John Doe', debits: [{ accountId: '1010', amount: 5000 }], credits: [{ accountId: '1200', amount: 5000 }] },
    { id: 3, ref: 'BILL-001', date: '2024-08-05', description: 'Electricity bill for July', debits: [{ accountId: '5020', amount: 800 }], credits: [{ accountId: '2100', amount: 800 }] },
    { id: 4, ref: 'PAY-002', date: '2024-08-10', description: 'Paid electricity bill', debits: [{ accountId: '2100', amount: 800 }], credits: [{ accountId: '1010', amount: 800 }] },
    { id: 5, ref: 'SAL-01', date: '2024-08-31', description: 'August salaries', debits: [{ accountId: '5010', amount: 15000 }], credits: [{ accountId: '1010', amount: 15000 }] },
];

export const MOCK_BUSES: Bus[] = [
    { id: 'bus-01', name: 'Yellow Eagle', capacity: 48, assignedDriverId: 'driver-01' },
    { id: 'bus-02', name: 'Blue Sparrow', capacity: 36, assignedDriverId: 'driver-02' },
];

export let MOCK_ROUTES: Route[] = [
    {
        id: 'route-A',
        name: 'Morning Route A - North',
        busId: 'bus-01',
        driverId: 'driver-01',
        stops: [
            { id: 'stop-A1', name: 'Oak Street & 1st', address: '100 Oak St', order: 1, assignedStudentIds: ['student-01'] },
            { id: 'stop-A2', name: 'Maple Avenue', address: '250 Maple Ave', order: 2, assignedStudentIds: ['student-02', 'student-03'] },
        ]
    },
    {
        id: 'route-B',
        name: 'Afternoon Route B - South',
        busId: 'bus-02',
        driverId: 'driver-02',
        stops: [
            { id: 'stop-B1', name: 'Pine & Main', address: '300 Pine St', order: 1, assignedStudentIds: [] },
            { id: 'stop-B2', name: 'Elm Street Plaza', address: '450 Elm St', order: 2, assignedStudentIds: ['student-04'] },
        ]
    }
];

export const MOCK_STUDENTS_FOR_TRANSPORT = [
    { uid: 'student-01', firstName: 'Alice', lastName: 'Smith', classId: 'g5', transportStopId: 'stop-A1' },
    { uid: 'student-02', firstName: 'Bob', lastName: 'Johnson', classId: 'g5', transportStopId: 'stop-A2' },
    { uid: 'student-03', firstName: 'Charlie', lastName: 'Brown', classId: 'g6', transportStopId: 'stop-A2' },
    { uid: 'student-04', firstName: 'Diana', lastName: 'Prince', classId: 'g6', transportStopId: 'stop-B2' },
    { uid: 'student-05', firstName: 'Eve', lastName: 'Adams', classId: 'g7', transportStopId: undefined },
    { uid: 'student-06', firstName: 'Frank', lastName: 'White', classId: 'g7', transportStopId: undefined },
];

export const mockAttendanceRecords = [
  { id: '1', studentId: 'student-01', studentName: 'Alice Smith', classId: 'grade-10-a', date: new Date('2024-05-20'), status: 'Present', notes: '' },
  { id: '2', studentId: 'student-02', studentName: 'Bob Johnson', classId: 'grade-10-a', date: new Date('2024-05-20'), status: 'Absent', notes: 'Feeling unwell' },
  { id: '3', studentId: 'student-03', studentName: 'Charlie Brown', classId: 'grade-10-a', date: new Date('2024-05-20'), status: 'Late', notes: 'Traffic' },
  { id: '4', studentId: 'student-04', studentName: 'grade-10-b', date: new Date('2024-05-20'), status: 'Present', notes: '' },
  { id: '5', studentId: 'student-01', studentName: 'Alice Smith', classId: 'grade-10-a', date: new Date('2024-05-21'), status: 'Present', notes: '' },
  { id: '6', studentId: 'student-02', studentName: 'Bob Johnson', classId: 'grade-10-a', date: new Date('2024-05-21'), status: 'Present', notes: '' },
  { id: '7', studentId: 'student-03', studentName: 'Charlie Brown', classId: 'grade-10-a', date: new Date('2024-05-21'), status: 'Excused', notes: "Doctor's appointment" },
  { id: '8', studentId: 'student-04', studentName: 'Diana Prince', classId: 'grade-10-b', date: new Date('2024-05-21'), status: 'Absent', notes: '' },
  { id: '9', studentId: 'student-01', studentName: 'Alice Smith', classId: 'grade-10-a', date: new Date('2024-05-19'), status: 'Late', notes: 'Missed bus' },
];

export type MathProblem = {
    id: string;
    topic: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    question_text: string;
    correct_answer: number | string;
    options: (number | string)[];
    classId: string;
};

export const MOCK_MATH_PROBLEMS: MathProblem[] = [
    { id: 'alg-e-01', topic: 'Algebra', difficulty: 'Easy', question_text: 'If x + 5 = 12, what is x?', correct_answer: 7, options: [5, 6, 7, 8], classId: 'class-1' },
    { id: 'alg-e-02', topic: 'Algebra', difficulty: 'Easy', question_text: 'Solve for y: 3y = 21', correct_answer: 7, options: [3, 6, 7, 9], classId: 'class-1' },
    { id: 'geo-m-01', topic: 'Geometry', difficulty: 'Medium', question_text: 'What is the area of a circle with a radius of 5?', correct_answer: '78.54', options: ['31.42', '50.00', '78.54', '100.00'], classId: 'class-2' },
];

export type GlobalLeaderboardEntry = {
    userId: string;
    userName: string;
    profilePictureUrl?: string;
    total_correct_answers: number;
    total_quizzes_completed: number;
};

export const MOCK_LEADERBOARD: GlobalLeaderboardEntry[] = [
    { userId: 'student-01', userName: 'Alice', total_correct_answers: 150, total_quizzes_completed: 20, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-01' },
    { userId: 'student-02', userName: 'Bob', total_correct_answers: 135, total_quizzes_completed: 18, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-02' },
    { userId: 'student-03', userName: 'Charlie', total_correct_answers: 120, total_quizzes_completed: 22, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-03' },
];

export type ElaGrammarDrill = {
    id: string;
    topic: string;
    type: 'MCQ' | 'Drag and Drop';
    question_prompt: string;
    options?: string[];
    correct_answer: string | string[];
    classId: string;
};

export const MOCK_ELA_DRILLS: ElaGrammarDrill[] = [
    { id: 'ela-g-01', topic: 'Punctuation', type: 'MCQ', question_prompt: 'Which sentence is correctly punctuated?', correct_answer: "The quick, brown fox jumps over the lazy dog.", options: ["The quick, brown fox jumps over the lazy dog.", "The quick brown fox, jumps over the lazy dog.", "The quick brown fox jumps over, the lazy dog."], classId: 'class-1' },
    { id: 'ela-g-02', topic: 'Verbs', type: 'MCQ', question_prompt: "The children ______ playing in the park.", correct_answer: "are", options: ["is", "are", "am", "be"], classId: 'class-1' },
];


export const MOCK_CROSSWORD_PUZZLES = [
  {
    id: "puzzle1",
    title: "Simple Animals",
    topic: "Animals",
    grid: [
      ["C", "A", "T", ""],
      ["", "P", "", ""],
      ["D", "O", "G", ""],
      ["", "T", "", ""],
    ],
    clues: {
      across: [
        { number: 1, clue: "A small, furry pet", answer: "CAT", row: 0, col: 0 },
        { number: 2, clue: "Man's best friend", answer: "DOG", row: 2, col: 0 },
      ],
      down: [
        { number: 3, clue: "A farm animal", answer: "PIG", row: 0, col: 2 },
        { number: 4, clue: "A big cat", answer: "TIGER", row: 0, col: 2 },
      ],
    },
  },
];

// --- JUNIOR ACADEMY DATA ---

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export const STROKES = [
  { id: 'standing', label: 'Standing Line', icon: 'fa-grip-lines-vertical' },
  { id: 'sleeping', label: 'Sleeping Line', icon: 'fa-grip-lines' },
  { id: 'slanting', label: 'Slanting Line', icon: 'fa-slash' },
  { id: 'curve-up', label: 'Curve Up', icon: 'fa-chevron-up' },
  { id: 'curve-down', label: 'Curve Down', icon: 'fa-chevron-down' },
  { id: 'curve-left', label: 'Curve Left', icon: 'fa-chevron-left' },
  { id: 'curve-right', label: 'Curve Right', icon: 'fa-chevron-right' },
  { id: 'circle', label: 'Circle', icon: 'fa-circle' },
];

export const JOLLY_PHONICS_DATA = [
  { letter: 'S', sound: 'sss', action: 'Weave your hand like a snake and say sss.', story: 'Sammy the Snake lives in the sun. He slides through the grass and says sss!', imagePrompt: 'A friendly cartoon snake in a sunny garden, bright colors, nursery style, white background' },
  { letter: 'A', sound: 'a-a-a', action: 'Wiggle your fingers on your arm like ants and say a-a-a.', story: 'Annie the Ant found a big red apple. She invited her friends for a snack!', imagePrompt: 'A happy ant carrying a huge shiny red apple, nursery style' },
];

export const PHONICS_DATA = [
  { upper: 'S', lower: 's', word: 'Snake', imagePrompt: 'A friendly cartoon snake sliding in the grass, bright colors, nursery style, white background' },
  { upper: 'A', lower: 'a', word: 'Apple', imagePrompt: 'A shiny red cartoon apple with a happy face, nursery style, white background' },
];

export const PICTURE_READING_DATA = [
  { sound: 'S', target: 'Snake', options: [{ name: 'Snake', prompt: 'A friendly cartoon snake' }, { name: 'Apple', prompt: 'A red apple' }, { name: 'Ball', prompt: 'A bouncy ball' }], correctIdx: 0 },
];

export const SYLLABLES_DATA = [
  { word: 'APPLE', syllables: ['AP', 'PLE'], prompt: 'A shiny red apple, nursery style' },
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], prompt: 'A happy yellow banana, nursery style' },
];

export const ALLITERATION_DATA = [
  { sound: 'B', target: 'Bear', options: [{ word: 'Balloon', match: true }, { word: 'Cat', match: false }], prompt: 'A friendly brown bear, nursery style' },
];

export const SOUND_MATCHING_DATA = [
  { sound: 'M', items: [{ word: 'Moon', prompt: 'A glowing crescent moon' }, { word: 'Mouse', prompt: 'A tiny grey mouse' }, { word: 'Fish', prompt: 'A goldfish' }] },
];

export const BLENDS_DATA = [
  { blend: 'sh', type: 'digraph', words: [{ word: 'Ship', prompt: 'A blue cartoon ship on water, nursery style' }, { word: 'Shell', prompt: 'A pink sea shell on sand, nursery style' }] },
];

export const RHYMES_DATA = [
  { ending: 'ug', words: [{ word: 'Bug', prompt: 'A tiny ladybug on a leaf, nursery style' }, { word: 'Hug', prompt: 'A bear hugging a cub, nursery style' }, { word: 'Mug', prompt: 'A hot cocoa mug, nursery style' }] },
];

export const DICTION_DATA = [
  { word: 'APPLE', syllables: 'AP-PLE', instruction: 'Open your mouth wide like a lion for the "AP"!', prompt: 'A big red apple, nursery style' },
  { word: 'BANANA', syllables: 'BA-NA-NA', instruction: 'Three happy bounces! BA... NA... NA!', prompt: 'A happy yellow banana, nursery style' },
];

export const MISSING_LETTERS_DATA = [
  { word: 'CAT', missing: 'A', options: ['A', 'E', 'I'], prompt: 'A cute orange cat, nursery style' },
];

export const ENVIRONMENTAL_PRINT_DATA = [
  { text: 'EXIT', context: 'Door', prompt: 'A bright green EXIT sign above a door in a friendly nursery school hallway' },
];

export const BOOK_HANDLING_DATA = [
  { 
    title: 'How to Hold a Book', 
    pages: [{ text: 'This is the FRONT of the book.', prompt: 'A close up of a colorful nursery book cover with a happy sun' }, { text: 'We turn the page from RIGHT to LEFT.', prompt: 'A hand flipping a page in a colorful picture book' }] }
];

export type DictionaryWord = {
  word: string;
  category: string;
  imagePrompt: string;
};

export const VOCABULARY_DATA: DictionaryWord[] = [
  { word: 'Apple', category: 'Nature', imagePrompt: 'A shiny red apple with a happy face, nursery style' },
  { word: 'Ball', category: 'General', imagePrompt: 'A colorful bouncy ball with stripes, nursery style' },
  { word: 'Cat', category: 'Animals', imagePrompt: 'A fluffy orange kitten with big eyes, nursery style' },
  { word: 'Dog', category: 'Animals', imagePrompt: 'A friendly brown puppy wagging its tail, nursery style' },
];


// --- NEW MATH DATA ---
export const NUMERACY_DATA = {
  numbers: [
    { value: 1, word: 'One', prompt: 'A single red apple' },
    { value: 2, word: 'Two', prompt: 'Two yellow bananas' },
    { value: 3, word: 'Three', prompt: 'Three green frogs' },
    { value: 4, word: 'Four', prompt: 'Four blue cars' },
    { value: 5, word: 'Five', prompt: 'Five orange flowers' },
  ],
  shapes: [
    { name: 'Circle', type: '2D', prompt: 'A round blue ball' },
    { name: 'Square', type: '2D', prompt: 'A red square block' },
    { name: 'Triangle', type: '2D', prompt: 'A yellow triangle cheese' },
  ],
  comparisons: [
     { q: 'Which is bigger?', val1: 5, val2: 2, answer: 5, prompt: 'A big elephant and a small mouse' },
     { q: 'Which is smaller?', val1: 8, val2: 10, answer: 8, prompt: 'A large ship and a small boat' }
  ],
  numComparison: [
    { q: 'Which is greater?', val1: 7, val2: 3, answer: 7 },
    { q: 'Which is smaller?', val1: 9, val2: 12, answer: 9 },
  ],
  patterns: [
    { sequence: ['apple-whole', 'carrot', 'apple-whole'], next: 'carrot', options: ['apple-whole', 'carrot'] },
    { sequence: ['square', 'circle', 'square'], next: 'circle', options: ['square', 'circle'] }
  ],
  oneToOne: [
    { count: 3, name: 'Rabbit', itemName: 'Carrot', character: 'fa-rabbit', item: 'fa-carrot' }
  ],
  sequence: [
    { type: 'before', question: 'What comes before 5?', sequence: [null, 5, 6], answer: 4, options: [3, 4, 7] },
    { type: 'after', question: 'What comes after 8?', sequence: [7, 8, null], answer: 9, options: [7, 9, 10] },
    { type: 'between', question: 'What comes between 2 and 4?', sequence: [2, null, 4], answer: 3, options: [1, 3, 5] },
  ],
  numberWords: [
    { digit: 1, word: 'One', prompt: 'One red ball' },
    { digit: 2, word: 'Two', prompt: 'Two blue cars' },
  ],
  numberBonds: [
    { target: 5, part1: 3, part2: 2, theme: 'Apples', prompt: 'A group of 3 red apples and a group of 2 green apples' },
    { target: 10, part1: 6, part2: 4, theme: 'Stars', prompt: 'A group of 6 yellow stars and 4 blue stars' },
  ],
  addition: [
    { val1: 2, val2: 3, icon: 'fa-star', theme: 'Stars', prompt: 'Two stars plus three stars' },
    { val1: 4, val2: 1, icon: 'fa-heart', theme: 'Hearts', prompt: 'Four hearts plus one heart' },
  ],
  subtraction: [
    { val1: 5, val2: 2, icon: 'fa-cookie', theme: 'Cookies', prompt: 'Five cookies, with two being eaten' },
    { val1: 7, val2: 4, icon: 'fa-bolt', theme: 'Lightning bolts', prompt: 'Seven lightning bolts, four fade away' },
  ],
  tensUnits: [
    { number: 23, tens: 2, units: 3, prompt: 'Two groups of ten blocks and three single blocks' },
    { number: 45, tens: 4, units: 5, prompt: 'Four groups of ten pencils and five single pencils' },
  ],
  grouping: [
    { groupSize: 2, totalItems: 6, theme: 'Pencils', prompt: 'Six pencils arranged in groups of two' },
    { groupSize: 3, totalItems: 9, theme: 'Balls', prompt: 'Nine balls arranged in groups of three' },
  ],
  time: [
    { hour: 3, minute: 0, phrase: "Three o'clock", prompt: 'An analog clock showing 3:00' },
    { hour: 9, minute: 0, phrase: "Nine o'clock", prompt: 'An analog clock showing 9:00' },
  ],
  money: [
    { amount: 4, coins: 4, label: 'Four Pesewas', prompt: 'Four Ghana pesewas coins' },
    { amount: 6, coins: 6, label: 'Six Pesewas', prompt: 'Six Ghana pesewas coins' },
  ],
  measurement: {
    weight: [
        { q: 'Which is heavier?', correct: 0, items: [{ label: 'Elephant', prompt: 'An elephant' }, { label: 'Feather', prompt: 'A bird feather' }] }
    ],
    height: [
        { q: 'Which is taller?', correct: 0, items: [{ label: 'Giraffe', prompt: 'A tall giraffe' }, { label: 'Mouse', prompt: 'A small mouse' }] }
    ]
  },
  spatial: [
    { target: 'Ball', position: 'above', refObject: 'Box', prompt: 'A red ball on top of a brown box' },
    { target: 'Cat', position: 'below', refObject: 'Table', prompt: 'A cat sleeping under a wooden table' },
  ]
};

export const COUNTING_TASK_DATA = [
  { count: 3, icon: 'fa-apple-whole', theme: 'Apples', prompt: 'Three red apples on a table' },
  { count: 5, icon: 'fa-car', theme: 'Cars', prompt: 'Five colorful toy cars' }
];

export const SEQUENCE_DATA = [
    { type: 'before', question: 'What comes before 5?', sequence: [null, 5, 6], answer: 4, options: [3, 4, 7] },
    { type: 'after', question: 'What comes after 8?', sequence: [7, 8, null], answer: 9, options: [7, 9, 10] },
    { type: 'between', question: 'What comes between 2 and 4?', sequence: [2, null, 4], answer: 3, options: [1, 3, 5] },
];

export const NUM_COMPARISON_DATA = [
    { q: 'Which is greater?', val1: 7, val2: 3, answer: 7 },
    { q: 'Which is smaller?', val1: 9, val2: 12, answer: 9 },
];

export const NUMBER_WORDS_DATA = [
    { digit: 1, word: 'One', prompt: 'One red ball' },
    { digit: 2, word: 'Two', prompt: 'Two blue cars' },
    { digit: 3, word: 'Three', prompt: 'Three green trees' },
];

export const NUMBER_BONDS_DATA = [
    { target: 5, part1: 3, part2: 2, theme: 'Apples', prompt: 'A group of 3 red apples and a group of 2 green apples' },
    { target: 10, part1: 6, part2: 4, theme: 'Stars', prompt: 'A group of 6 yellow stars and 4 blue stars' },
];

export const ADDITION_DATA = [
    { val1: 2, val2: 3, icon: 'fa-star', theme: 'Stars', prompt: 'Two stars plus three stars' },
    { val1: 4, val2: 1, icon: 'fa-heart', theme: 'Hearts', prompt: 'Four hearts plus one heart' },
];

export const SUBTRACTION_DATA = [
    { val1: 5, val2: 2, icon: 'fa-cookie', theme: 'Cookies', prompt: 'Five cookies, with two being eaten' },
    { val1: 7, val2: 4, icon: 'fa-bolt', theme: 'Lightning bolts', prompt: 'Seven lightning bolts, four fade away' },
];

export const TENS_UNITS_DATA = [
    { number: 23, tens: 2, units: 3, prompt: 'Two groups of ten blocks and three single blocks' },
    { number: 45, tens: 4, units: 5, prompt: 'Four groups of ten pencils and five single pencils' },
];

export const LIFE_SKILLS_DATA = {
  emotions: [
    { name: 'Happy', color: 'bg-yellow-400', icon: 'fa-face-smile', prompt: 'A happy, smiling sun', technique: 'smile back at the sun!' },
    { name: 'Sad', color: 'bg-blue-400', icon: 'fa-face-sad-tear', prompt: 'A sad cloud crying rain', technique: 'give a friend a big hug.' },
    { name: 'Angry', color: 'bg-red-500', icon: 'fa-face-angry', prompt: 'An angry volcano erupting', technique: 'take a deep breath and count to three.' },
  ],
  music: [
    { title: 'Clean Up Song', theme: 'cleaning up', icon: 'fa-broom' },
    { title: 'Good Morning', theme: 'greetings', icon: 'fa-sun' },
    { title: 'Goodbye Song', theme: 'saying goodbye', icon: 'fa-hand-wave' },
  ],
  practicalLife: {
    dressing: [
      { item: 'Jacket', need: 'it is cold', prompt: 'A child putting on a warm jacket', icon: 'fa-vest' },
      { item: 'Shoes', need: 'we are going outside', prompt: 'A child tying their shoes', icon: 'fa-shoe-prints' },
    ],
    schedules: [
      { name: 'Breakfast Time', icon: 'fa-utensils', prompt: 'A family eating breakfast together' },
      { name: 'Bed Time', icon: 'fa-bed', prompt: 'A child reading a book in bed' },
    ],
    pretendPlay: [
        { title: 'Doctor', scenario: 'Your teddy bear is sick!', modeling: 'Let\'s check its heartbeat with a toy stethoscope.', prompt: 'A child using a toy stethoscope on a teddy bear' },
        { title: 'Chef', scenario: 'It\'s time to cook dinner!', modeling: 'Let\'s stir the soup in a big pot.', prompt: 'A child wearing a chef hat stirring a toy pot' }
    ]
  },
  communication: {
    pictureTalk: [
        { title: "Ball", description: "This is a red bouncy ball.", prompt: "A 3D Pixar-style illustration of a red ball", icon: "⚽" },
        { title: "Dog", description: "The dog says woof woof!", prompt: "A friendly 3D cartoon puppy wagging its tail", icon: "🐶" }
    ],
    instructions: [
        { task: "Point to the big bear", spoken: "Point to the BIG bear.", prompt: "A big brown bear next to a small teddy bear", icon: "fa-hand-pointer" },
        { task: "Find the apple", spoken: "Where is the apple?", prompt: "An apple, a banana, and a grape on a table", icon: "fa-search" }
    ],
    circleTime: [
        { q: "What is your favorite animal?", a: "My favorite is a lion!", prompt: "A circle of diverse children sitting on a colorful rug", icon: "fa-people-group" }
    ]
  },
  social: [
    { scenario: 'Your friend is crying.', q: 'What do you do?', options: ['Give a hug', 'Walk away'], correct: 0, prompt: 'A child crying and another child looking concerned' }
  ],
  community: [
    { role: 'Firefighter', fact: 'Firefighters help put out fires and keep us safe.', icon: 'fa-fire-extinguisher', prompt: 'A friendly firefighter in front of a fire truck' },
    { role: 'Doctor', fact: 'Doctors help us feel better when we are sick.', icon: 'fa-user-doctor', prompt: 'A kind doctor with a stethoscope' }
  ],
  cognitive: {
    scenarios: [
        { q: 'It is raining outside. What should you bring?', options: ['Umbrella', 'Sunglasses'], correct: 0, prompt: 'A rainy day with clouds' }
    ],
    patterns: [
        { sequence: ['apple-whole', 'carrot', 'apple-whole'], next: 'carrot', options: ['apple-whole', 'carrot'] },
    ],
    whatIf: [
        { q: "What if you could fly?", a: "You could visit the birds in the trees!", prompt: 'A child flying with birds in the sky' }
    ]
  },
  physicalHealth: {
      grossMotor: [{ title: 'Jumping Jacks', action: 'Jump and spread your arms and legs!', icon: 'fa-child-reaching', prompt: 'A child doing a jumping jack' }],
      fineMotor: [{ title: 'Drawing', action: 'Hold the crayon and draw a circle.', icon: 'fa-pen-nib', prompt: 'A childs hand drawing a circle with a crayon' }],
      hygiene: [{ title: 'Wash Hands', action: 'Use soap and water to make bubbles!', icon: 'fa-soap', prompt: 'Hands being washed with soap and water' }],
      nutrition: [{ title: 'Eat Vegetables', action: 'Broccoli makes you strong!', icon: 'fa-broccoli', prompt: 'A happy child eating a piece of broccoli' }],
  }
};

    