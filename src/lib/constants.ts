
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
  FileQuestion
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

export const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
export const NUMBERS = '0123456789'.split('');

export const DICTIONARY_WORDS: DictionaryWord[] = [
  { word: 'Apple', category: 'Nature', imagePrompt: 'A shiny red apple with a happy face, nursery style' },
  { word: 'Ball', category: 'General', imagePrompt: 'A colorful bouncy ball with stripes, nursery style' },
  { word: 'Cat', category: 'Animals', imagePrompt: 'A fluffy orange kitten with big eyes, nursery style' },
  { word: 'Dog', category: 'Animals', imagePrompt: 'A friendly brown puppy wagging its tail, nursery style' },
  { word: 'Elephant', category: 'Animals', imagePrompt: 'A cute blue elephant with big ears, nursery style' },
  { word: 'Fish', category: 'Nature', imagePrompt: 'A happy orange goldfish swimming, nursery style' },
  { word: 'Giraffe', category: 'Animals', imagePrompt: 'A tall friendly giraffe with a long neck, nursery style' },
  { word: 'House', category: 'Home', imagePrompt: 'A cozy little house with flowers, nursery style' },
  { word: 'Igloo', category: 'Nature', imagePrompt: 'A white snowy igloo with a penguin nearby, nursery style' },
  { word: 'Jellyfish', category: 'Nature', imagePrompt: 'A glowing purple jellyfish under the sea, nursery style' },
  { word: 'Kite', category: 'General', imagePrompt: 'A colorful diamond kite flying in the sky, nursery style' },
  { word: 'Lion', category: 'Animals', imagePrompt: 'A brave little lion cub with a fluffy mane, nursery style' },
  { word: 'Moon', category: 'Nature', imagePrompt: 'A smiling crescent moon in the night sky, nursery style' },
];

export const VOCABULARY_DATA = DICTIONARY_WORDS;

export const INITIAL_WORDS = [
  { word: 'AT', sentence: 'The cat is AT the mat.', imagePrompt: 'A tiny cartoon cat sitting on a colorful mat, nursery style' },
  { word: 'CAT', sentence: 'The CAT is fat.', imagePrompt: 'A fluffy fat cartoon kitten, orange fur, nursery style' },
  { word: 'DOG', sentence: 'The DOG says woof!', imagePrompt: 'A friendly brown cartoon dog wagging its tail, nursery style' },
  { word: 'SUN', sentence: 'The SUN is hot.', imagePrompt: 'A smiling yellow sun with bright rays, nursery style' },
];

export const DICTION_DATA = [
  { word: 'APPLE', syllables: 'AP-PLE', instruction: 'Open your mouth wide like a lion for the "AP"!', prompt: 'A big red apple, nursery style' },
  { word: 'BANANA', syllables: 'BA-NA-NA', instruction: 'Three happy bounces! BA... NA... NA!', prompt: 'A happy yellow banana, nursery style' },
];

export const JOLLY_PHONICS_DATA = [
  { letter: 'S', sound: 'sss', action: 'Weave your hand like a snake and say sss.', story: 'Sammy the Snake lives in the sun. He slides through the grass and says sss!', imagePrompt: 'A friendly cartoon snake in a sunny garden, bright colors, nursery style' },
  { letter: 'A', sound: 'a-a-a', action: 'Wiggle your fingers on your arm like ants and say a-a-a.', story: 'Annie the Ant found a big red apple. She invited her friends for a snack!', imagePrompt: 'A happy ant carrying a huge shiny red apple, nursery style' },
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

export const PHONICS_DATA = [
  { upper: 'S', lower: 's', word: 'Snake', imagePrompt: 'A friendly cartoon snake sliding in the grass, bright colors, nursery style, white background' },
  { upper: 'A', lower: 'a', word: 'Apple', imagePrompt: 'A shiny red cartoon apple with a happy face, nursery style, white background' },
];

export const BLENDS_DATA = [
  { blend: 'sh', type: 'digraph', words: [{ word: 'Ship', prompt: 'A blue cartoon ship on water, nursery style' }, { word: 'Shell', prompt: 'A pink sea shell on sand, nursery style' }] },
];

export const RHYMES_DATA = [
  { ending: 'ug', words: [{ word: 'Bug', prompt: 'A tiny ladybug on a leaf, nursery style' }, { word: 'Hug', prompt: 'A bear hugging a cub, nursery style' }, { word: 'Mug', prompt: 'A hot cocoa mug, nursery style' }] },
];

export const SIGHT_WORDS_DATA = [
  { word: 'he', type: 'tricky', prompt: 'A boy pointing to himself, high contrast text "he", nursery style' },
  { word: 'me', type: 'tricky', prompt: 'A happy girl pointing to her chest, high contrast text "me", nursery style' },
];

export const ENVIRONMENTAL_PRINT_DATA = [
  { text: 'EXIT', context: 'Door', prompt: 'A bright green EXIT sign above a door in a friendly nursery school hallway' },
];

export const BOOK_HANDLING_DATA = [
  { title: 'How to Hold a Book', pages: [{ text: 'This is the FRONT of the book.', prompt: 'A close up of a colorful nursery book cover with a happy sun' }, { text: 'We turn the page from RIGHT to LEFT.', prompt: 'A hand flipping a page in a colorful picture book' }] }
];

export const MISSING_LETTERS_DATA = [
  { word: 'CAT', missing: 'A', options: ['A', 'E', 'I'], prompt: 'A cute orange cat, nursery style' },
];

export const STORYTELLING_DATA = [
  { 
    title: 'The Boy and His Cat', 
    prompt: 'A boy pouring milk for his cat',
    sequence: [
      { id: 1, text: 'A small boy sees his thirsty cat.', prompt: 'A 3D nursery scene of a boy looking at his orange cat.' }, 
      { id: 2, text: 'He is pouring milk into a small blue bowl.', prompt: 'A boy pouring fresh white milk into a small blue bowl.' }, 
      { id: 3, text: 'The boy and cat are happy.', prompt: 'A happy cat drinking milk and the boy patting its back.' }
    ] 
  }
];

export const THEME_VOCAB_DATA = {
  seasons: [
    { name: 'Summer', prompt: 'A sunny beach scene, nursery style', words: ['Sun', 'Sand', 'Hot'] }, 
  ],
  family: [
    { name: 'My Family', prompt: 'A diverse friendly family group smiling, nursery style', words: ['Mom', 'Dad', 'Baby', 'Love'] }
  ]
};

export const READING_DATA = [
  { title: 'The Blue Whale', text: 'A big whale is in the sea. It is blue and very happy. The whale loves to swim and play with fish.', imagePrompt: 'A big happy blue whale swimming in the ocean with small fish, colorful nursery style animation art', activities: [{ question: 'WHAT color is the whale?', options: ['Blue', 'Red', 'Green'], correct: 0 }, { question: 'WHERE is the whale?', options: ['Forest', 'Sea', 'Moon'], correct: 1 }] }
];

export const GRAMMAR_DATA = {
  plurals: [{ singular: 'Apple', plural: 'Apples', prompt: 'A single red apple next to a pointer of red apples, nursery style' }],
  articles: [{ word: 'Apple', article: 'an', prompt: 'A shiny red apple, nursery style' }],
  nouns: [{ word: 'Boy', type: 'Person', prompt: 'A happy little boy smiling, nursery style' }],
  verbs: [{ word: 'Run', action: 'Running fast', prompt: 'A cartoon child running in a park, motion lines, nursery style' }],
  adjectives: [{ word: 'Big', prompt: 'A very big grey elephant, nursery style' }],
  pronouns: [{ word: 'He', prompt: 'A happy boy pointing at himself, nursery style' }],
  adverbs: [{ word: 'Quickly', prompt: 'A cheetah running very fast with wind lines, nursery style' }],
  prepositions: [{ word: 'Under', prompt: 'A tiny cat hiding under a wooden chair, nursery style' }],
  conjunctions: [{ word: 'And', prompt: 'An apple and a banana sitting together on a plate, nursery style' }],
  interjections: [{ word: 'Wow!', prompt: 'A child looking at magical glowing sparkles with big eyes, nursery style' }],
};

export const OPPOSITES_DATA = [
  { word: 'Happy', opposite: 'Sad', imagePrompt: 'A split screen: left side a smiling cartoon child, right side a sad cartoon child, nursery style' },
];

export const SENTENCE_DATA = [
  { text: 'I see a red cat.', imagePrompt: 'A cute red cartoon kitten sitting on a floor, nursery style', pattern: 'I see a...' },
];

export const HIDDEN_WORDS_DATA = [
  { target: 'CAT', options: ['CAT', 'BAT', 'CAR', 'CAN'], imagePrompt: 'A group of nursery items, a cat, a bat, a car, and a can, bright colors' },
];

export const NUMERACY_DATA = {
  numbers: [
    { value: 1, word: 'One', prompt: 'one friendly lion' },
    { value: 2, word: 'Two', prompt: 'two happy monkeys' },
  ],
  shapes: [
    { name: 'Circle', type: '2D', prompt: 'A round red circle' },
    { name: 'Square', type: '2D', prompt: 'A blue square with four equal sides' },
  ],
  comparisons: [
    { 
      q: "Which is BIG?", 
      category: 'Size', 
      options: [
        { size: 'lg', label: 'Big Bear', prompt: 'A very large friendly brown bear' }, 
        { size: 'sm', label: 'Small Bear', prompt: 'A tiny cute brown bear cub' }
      ], 
      correct: 0 
    }
  ],
  patterns: [
    { sequence: ['apple-whole', 'carrot', 'apple-whole'], next: 'carrot', options: ['apple-whole', 'carrot'] },
  ],
  oneToOne: [
    { count: 3, name: 'Rabbit', itemName: 'Carrot', character: 'fa-rabbit', item: 'fa-carrot' },
  ]
};

export const ADDITION_DATA = [
  { val1: 2, val2: 3, icon: 'fa-apple-whole', theme: 'Apples', prompt: 'Two apples and three apples on a table, nursery style' },
];

export const SUBTRACTION_DATA = [
  { val1: 5, val2: 2, icon: 'fa-cookie', theme: 'Cookies', prompt: 'Five cookies with two eaten, nursery style' },
];

export const NUMBER_WORDS_DATA = [
  { digit: 1, word: 'ONE', prompt: 'The number one made of colorful blocks' },
];

export const TIME_DATA = [
  { hour: 3, minute: 0, phrase: 'Three o\'clock', prompt: 'A round clock showing 3:00, nursery style' },
];

export const MEASUREMENT_DATA = {
  weight: [
    { q: 'Which is HEAVIER?', correct: 0, items: [{ label: 'Elephant', prompt: 'A big blue elephant' }, { label: 'Feather', prompt: 'A light pink feather' }] }
  ],
  height: [
    { q: 'Which is TALLER?', correct: 0, items: [{ label: 'Giraffe', prompt: 'A tall friendly giraffe' }, { label: 'Mouse', prompt: 'A tiny grey mouse' }] }
  ]
};

export const TENS_UNITS_DATA = [
  { number: 12, tens: 1, units: 2, prompt: 'One bundle of ten sticks and two single sticks, nursery style' },
];

export const GROUPING_DATA = [
  { groupSize: 2, totalItems: 6, theme: 'Birds', prompt: 'Six birds grouped into pairs of two, nursery style' },
];

export const SEQUENCE_DATA = [
  { type: 'after', question: 'What comes after 2?', sequence: [1, 2, null], answer: 3, options: [3, 4, 5] },
];

export const NUM_COMPARISON_DATA = [
  { q: 'Which is GREATER?', val1: 5, val2: 3, answer: 5, type: 'greater' },
];

export const COUNTING_TASK_DATA = [
  { count: 4, icon: 'fa-star', theme: 'Stars', prompt: 'Four bright yellow stars in a blue sky, nursery style' },
];

export const NUMBER_BONDS_DATA = [
  { target: 10, part1: 7, part2: 3, theme: 'Balloons', prompt: 'Seven red balloons and three blue balloons, nursery style' },
];

export const SPATIAL_DATA = [
  { target: 'Ball', position: 'above', refObject: 'Box', prompt: 'A red ball hovering above a colorful toy box, nursery style' },
];

export const MONEY_DATA = [
  { amount: 5, coins: 5, label: 'Gold Coins', prompt: 'Five shiny gold coins on a table, nursery style' },
];

export const SCIENCE_DATA = {
  bodyParts: [
    { name: 'Eyes', icon: 'fa-eye', action: 'I use my eyes to see the world!' },
    { name: 'Ears', icon: 'fa-ear-listen', action: 'I use my ears to hear sounds!' },
  ],
  innerOrgans: [
    { name: 'Heart', icon: 'fa-heart-pulse', action: 'My heart pumps blood to my whole body!', prompt: 'A red cartoon heart beating' },
  ],
  growth: [
    { stage: 'Baby', action: 'I was a tiny baby who could crawl!' },
    { stage: 'Toddler', action: 'I became a toddler and learned to walk!' },
    { stage: 'Child', action: 'Now I am a child who can run and jump!' }
  ],
  senses: [
    { sense: 'Sight', icon: 'fa-eye', action: 'I see a beautiful rainbow!', prompt: 'A child looking at a bright rainbow' },
  ],
  water: [
    { source: 'Rain', use: 'Watering plants', icon: 'fa-cloud-showers-heavy' },
  ],
  floatSink: [
    { name: 'Rubber Duck', result: 'Float', reason: 'It is light and filled with air!' },
  ],
  livingNeeds: [
    { name: 'Plant', need: 'Sunlight', instruction: 'Put plants near the window to see the sun!' },
  ],
  living: [
    { name: 'Tree' },
    { name: 'Butterfly' },
  ],
  nonLiving: [
    { name: 'Car' },
    { name: 'Ball' },
  ],
  weather: [
    { type: 'Sunny' },
    { type: 'Rainy' },
  ],
  animals: [
    { name: 'Lion', sound: 'ROAR', fact: 'Lions have big fluffy manes!', prompt: 'A brave lion with a big golden mane' },
  ],
  transport: [
    { name: 'Aeroplane', icon: 'fa-plane', type: 'Air' },
    { name: 'Car', icon: 'fa-car', type: 'Road' },
  ],
  properties: {
    colors: [
      { name: 'Red', prompt: 'A big red apple', explanation: 'Red is the color of apples and hearts!' },
    ],
    shapes: [
      { name: 'Circle', prompt: 'A round yellow sun', explanation: 'A circle is perfectly round like a ball!', type: '2D' }
    ],
    sizes: [
      { pair: 'Big and Small', items: [{ prompt: 'A giant elephant', label: 'Big' }, { prompt: 'A tiny mouse', label: 'Small' }], explanation: 'The elephant is big and the mouse is small!' }
    ]
  },
  skills: {
    observation: [
      { name: 'Ladybird', task: 'Counting spots' }
    ],
    curiosity: [
      { q: 'Why is the grass green?', a: 'Grass is green because it has magic called chlorophyll!' }
    ],
    care: [
      { task: 'Feeding pets' }
    ]
  },
  environment: {
    surroundings: [
        { name: 'My Home', icon: 'fa-house', prompt: 'A cozy colorful cottage with a garden and a white fence, nursery style', fact: 'My home is where I sleep and eat with my family.' },
        { name: 'My School', icon: 'fa-school', prompt: 'A bright school building with a playground and slides, nursery style', fact: 'My school is where I play and learn with my friends!' },
    ],
    greenHabits: [
        { name: 'Recycling', icon: 'fa-recycle', prompt: 'A friendly blue recycling bin with happy paper and bottles, nursery style', fact: 'We recycle to keep our Earth clean and happy!' },
    ],
    cleanWorld: [
        { name: 'Clear Gutters', icon: 'fa-water', prompt: 'A clean paved gutter with clear blue water flowing freely, no trash inside, nursery style', fact: 'Gutters are for rain water! Never throw trash in the gutter so the water can flow away.' },
        { name: 'Gutter Hero', icon: 'fa-broom', prompt: 'A group of children and adults cleaning a gutter, removing plastic bottles, nursery style', fact: 'We are Gutter Heroes! We keep our drains clear so the rain does not flood our homes.' },
        { name: 'Ghana Clean & Green', icon: 'fa-flag', prompt: 'A beautiful clean Ghanaian street with green trees and the national flag waving, nursery style', fact: 'Let us keep Ghana clean and green! A clean Ghana is a healthy Ghana.' }
    ]
  }
};

export const ARTS_DATA = {
  drawingPrompts: [
    { title: 'A Happy Sun', prompt: 'A simple bold sun for a child to draw', difficulty: 'Easy' },
  ],
  colorNature: [
    { name: 'Red Rose', color: 'Red', prompt: 'A bright red rose in a garden' },
  ],
  shapeChallenges: [
    { name: 'Round Wheel', parts: ['Circle'], description: 'Draw a big circle for a wheel!' }
  ],
  visual: {
    sculptures: [
      { name: 'Red Apple Clay', prompt: 'A high-quality 3D clay sculpture of a shiny red apple, ceramic style', fact: 'Sculptures are art you can touch!' },
    ],
    paintings: [
      { name: 'Magic Rainbow', prompt: 'A vibrant child-like oil painting of a rainbow over a green field', type: 'Oil Painting' },
    ]
  },
  performing: {
    instruments: [
      { name: 'Magic Guitar', icon: 'fa-guitar', soundPrompt: 'Say: STRUM STRUM STRUM!' },
    ],
    dancePrompts: [
      { character: 'Happy Robot', style: 'Disco', prompt: '3D animation of a friendly robot doing disco moves, nursery style' },
    ]
  },
  drama: {
    prompts: [
      { situation: 'You are a tiny mouse eating cheese!', action: 'Squeak and nibble!' },
    ]
  },
  literature: {
    poets: [
      { topic: 'Little Star', rhyme: 'Twinkle twinkle little star, \nhow I wonder what you are! \nUp above the world so high, \nlike a diamond in the sky.' }
    ]
  }
};

export const CREATIVE_ARTS_DATA = ARTS_DATA;

export const LIFE_SKILLS_DATA = {
  health: [
    { title: 'Brushing Teeth', action: 'Brush up and down, twice a day!', icon: 'fa-tooth', prompt: 'A child happily brushing their teeth, with sparkles on their teeth' },
    { title: 'Being Healthy', action: 'Eat healthy food and play every day to feel full of energy!', icon: 'fa-heart-pulse', prompt: 'A group of children playing outside with a colorful salad on a nearby picnic blanket' }
  ],
  music: [
    { title: 'Brushing Teeth Song', theme: 'brushing teeth every morning', icon: 'fa-tooth' },
  ],
  practicalLife: {
    pretendPlay: [
      { title: 'The Chef', scenario: 'Pretend to cook a yummy soup!', modeling: 'Stir the pot carefully so it does not spill.', action: 'Stir Soup', prompt: 'A child wearing a chef hat stirring a big pot, nursery style' },
    ],
    dressing: [
      { item: 'Coat', need: 'it is cold outside', icon: 'fa-vest', prompt: 'A child putting on a warm winter coat, nursery style', clothing: 'winter coat' },
    ],
    schedules: [
      { name: 'Morning Routine', sequence: ['Wake up', 'Eat breakfast', 'Go to school'], icons: ['fa-sun', 'fa-utensils', 'fa-school'], prompt: 'A simple morning routine sequence illustration' }
    ]
  },
  emotions: [
    { name: 'Happy', color: 'bg-yellow-400', icon: 'fa-face-smile', prompt: 'A very happy smiling child face, nursery style', technique: 'Smile big and show your teeth!' },
  ],
  communication: {
    pictureTalk: [
      { title: 'In the Park', prompt: 'A busy park with kids playing, a dog, and a slide, nursery style', description: 'I see kids playing on the slide and a brown dog!' }
    ],
    instructions: [
      { task: 'Touch your nose', icon: 'fa-hand-pointer', spoken: 'Can you touch your nose with one finger?' }
    ],
    circleTime: [
      { q: 'What is your favorite color?', icon: 'fa-palette', followUp: 'Tell us why you like it!' }
    ]
  },
  social: [
    { scenario: 'Sharing Toys', q: 'Your friend wants the ball. What do you do?', options: ['Give it to them', 'Keep it', 'Hide it'], correct: 0, prompt: 'Two kids looking at a colorful ball, nursery style' },
  ],
  community: [
    { role: 'The Teacher', icon: 'fa-chalkboard-user', fact: 'Teachers help us learn new things and be kind to others.', prompt: 'A kind teacher reading a story to a group of happy children' },
  ],
  cognitive: {
    scenarios: [
      { q: 'The floor is messy with toys. How do we fix it?', options: ['fa-broom', 'fa-tv', 'fa-bed'], labels: ['Tidy Up', 'Watch TV', 'Go to Bed'], correct: 0, prompt: 'A room with many toys on the floor, nursery style' }
    ],
    patterns: [
      { sequence: ['fa-apple-whole', 'fa-carrot', 'fa-apple-whole'], next: 'fa-carrot', options: ['fa-apple-whole', 'fa-carrot'], prompt: 'A simple pattern of fruit and vegetables' }
    ],
    whatIf: [
      { q: 'What if we could fly like birds?', a: 'We would see the whole world from high in the sky!', prompt: 'A child with bird wings flying over a colorful town' }
    ]
  },
  tidying: [
    { title: 'Blocks', icon: 'fa-cube', prompt: 'Colorful toy blocks scattered on a rug' }
  ]
};

```
- src/app/dashboard/junior-academy/page.tsx:
```tsx

'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, addDoc, query, orderBy, serverTimestamp, deleteDoc, doc, where, setDoc, increment, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, Volume2, Star, Rabbit, Rocket, Wand2, Mic, ArrowRight, 
  Save, Trash2, Library, Calculator, Brain, BookOpen, Atom, Music, Palette, 
  Trophy, Gift, Check, CheckCircle2, XCircle, PenTool, Eraser, Database, Pencil, Heart, Utensils, Smile, Tv, Users, Activity, CheckSquare, BrainCircuit, Handshake, Milestone, Ear, Layers, AudioLines, Repeat, Underline, BookCheck, FolderOpen, Car, Earth, Sparkles, HeartPulse, CloudSun, PawPrint, Shapes, Languages, PenNib, Apple, Sun, CloudRain, Guitar, Plane, MousePointer2, Cube, Carrot, Cookie, School, Home, Recycle, Water, Droplets, HelpCircle, MessageSquare, Drama, ArrowLeft, Play, Flag, User as UserIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateJuniorStory, generateWordDetails, generateTTSAction, assessHandwritingAction, generateLifeSkillEntry, generateLessonImageAction, generatePhonicsWorldEntry, generateMathWorldEntry, generateRhyme, generateSkillDetails } from '@/ai/flows/junior-actions';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Label } from '@/components/ui/label';
import MathPlayground from './math-playground';
import JuniorScienceWorld from './science-world';
import ArtStudio from './art-studio';
import StickerBook from './sticker-book';
import * as constants from '@/lib/constants';
import * as LucideIcons from 'lucide-react';
import PhonicsWorld from './phonics-world';
import { generateScienceLessonAction } from '@/ai/flows/generate-science-lesson';
import type { DictionaryWord, LessonCard } from '@/lib/types';


// --- ICON MAPPER ---
const IconRenderer = ({ iconName, className }: { iconName: string, className?: string }) => {
    const map: Record<string, keyof typeof LucideIcons> = {
      'fa-spell-check': 'Languages', 'fa-ear-listen': 'Ear', 'fa-pen-nib': 'PenNib',
      'fa-arrow-1-9': 'Calculator', 'fa-hand-holding-heart': 'Handshake', 'fa-flask-vial': 'FlaskConical',
      'fa-palette': 'Palette', 'fa-robot': 'Bot', 'fa-face-smile': 'Smile', 'fa-tooth': 'Sparkles',
      'fa-heart-pulse': 'HeartPulse', 'fa-vest': 'Shirt', 'fa-sun': 'Sun', 'fa-utensils': 'Utensils',
      'fa-school': 'School', 'fa-house': 'Home', 'fa-recycle': 'Recycle', 'fa-water': 'Droplets',
      'fa-broom': 'Trash2', 'fa-flag': 'Flag', 'fa-hand-pointer': 'MousePointer2', 'fa-cube': 'Cube',
      'fa-chalkboard-user': 'User', 'fa-rabbit': 'Rabbit', 'fa-carrot': 'Carrot', 'fa-apple-whole': 'Apple',
      'fa-cookie': 'Cookie', 'fa-star': 'Star', 'fa-tv': 'Tv', 'fa-bed': 'Bed', 'fa-eye': 'Eye',
      'fa-cloud-showers-heavy': 'CloudRain', 'fa-guitar': 'Guitar', 'fa-plane': 'Plane', 'fa-car': 'Car',
      'fa-frog': 'Rabbit', // No frog, using rabbit
      'fa-bolt': 'Zap',
      'fa-circle-dot': 'CircleDot',
      'fa-soap': 'Sparkles', // No soap, using sparkles
      'fa-broccoli': 'Carrot', // No broccoli
      'fa-display': 'Monitor',
      'fa-graduation-cap': 'GraduationCap',
      'fa-comments': 'MessageCircle',
      'fa-people-group': 'Users',
      'fa-masks-theater': 'Drama',
      'fa-brain': 'BrainCircuit',
      'fa-child-reaching': 'User',
      'fa-music': 'Music',
      'fa-magic': 'Wand2',
      'fa-arrow-left': 'ArrowLeft',
      'fa-arrow-right': 'ArrowRight',
      'fa-spinner fa-spin': 'Loader2',
      'fa-volume-high': 'Volume2',
      'fa-dna': 'Atom'
    };
  
    const LucideName = map[iconName] || 'HelpCircle';
    const IconComponent = (LucideIcons as any)[LucideName];
  
    return <IconComponent className={cn(className, iconName.includes('fa-spin') && 'animate-spin')} />;
};


// --- HELPERS ---
const isJuniorLevel = (grade: string) => 
    grade === 'Early Childhood' || grade === 'Lower Primary';

const juniorStyles = {
    storybook: "bg-[#FFFDE7] border-y-8 border-x-4 border-orange-200 rounded-[60px] p-8 shadow-[0_15px_0_#FFE082]",
    storyText: "text-3xl font-bold text-orange-900 leading-relaxed font-serif",
    
    questCard: "bg-gradient-to-b from-sky-400 to-blue-500 border-b-[12px] border-blue-700 rounded-[50px] text-white",
    stepBubble: "w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center text-3xl shadow-lg border-4 border-blue-200",
    
    card: "rounded-[60px] border-8 border-yellow-200 shadow-xl bg-gradient-to-br from-yellow-50 to-orange-100",
    header: "p-10 text-center",
    mathBox: "bg-sky-100 p-10 rounded-[50px] border-4 border-dashed border-sky-300 shadow-inner",
    
    button: "h-24 px-12 bg-gradient-to-t from-pink-600 to-pink-400 hover:scale-105 text-3xl font-black text-white rounded-[40px] shadow-[0_12px_0_#9d174d] active:translate-y-2 active:shadow-none transition-all",
    input: "h-28 text-7xl font-black text-center border-8 border-yellow-300 rounded-[40px] bg-white text-pink-500 shadow-inner"
};

function StorySpark({ canEdit, schoolId }: { canEdit: boolean, schoolId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const [topic, setTopic] = useState('');
    const [wordCount, setWordCount] = useState('150');
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    
    const [currentQ, setCurrentQ] = useState(0);
    const [userAns, setUserAns] = useState('');
    const [quizStatus, setQuizStatus] = useState<'typing' | 'correct' | 'wrong'>('typing');

    const storiesQuery = useMemoFirebase(() => 
        (firestore && schoolId) ? query(
            collection(firestore, 'junior_stories'), 
            where('schoolId', '==', schoolId), 
            orderBy('createdAt', 'desc')
        ) : null, [firestore, schoolId]);
    const { data: savedStories, forceRefetch } = useCollection<any>(storiesQuery);
    
    const speak = async (text: string) => {
        if (!text || !schoolId) return;
        const result = await generateTTSAction({ text, voice: 'Algenib', schoolId });
        if(result.success && result.data && typeof window !== 'undefined'){
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    };

    const handleGenerate = async () => {
        if (!topic.trim() || !schoolId) return;
        setLoading(true);
        const res = await generateJuniorStory({ topic, wordCount: parseInt(wordCount), schoolId });
        if (res.success && res.data) {
            setStory(res.data);
            setCurrentQ(0);
            setUserAns('');
            setQuizStatus('typing');
            speak(`I've written a story about ${topic}. Let's read!`);
        } else {
            toast({ title: "Magic Failed", description: res.error || "The story book is stuck!", variant: "destructive" });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        if (!story || !firestore || !schoolId) return;
        try {
            await addDoc(collection(firestore, 'junior_stories'), {
                ...story,
                topic,
                schoolId: schoolId,
                createdAt: serverTimestamp(),
                createdBy: user?.uid
            });
            toast({ title: "Saved!", description: "This story is now in the school library." });
            forceRefetch();
        } catch (e) {
            toast({ title: "Error", description: "Could not save to library." });
        }
    };

    const checkAnswer = () => {
        if (!userAns.trim()) return;
        const currentQuestion = story.questions[currentQ];
        const isCorrect = userAns.toLowerCase().includes(currentQuestion.answer.toLowerCase()) || 
                          currentQuestion.answer.toLowerCase().includes(userAns.toLowerCase());

        if (isCorrect) {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.7 } });
            setQuizStatus('correct');
            speak("That is exactly right! You are a brilliant reader!");
        } else {
            setQuizStatus('wrong');
            speak("Not quite, but good try! Let's look at the story again.");
        }
    };

    const handleNext = () => {
        if (currentQ < 2) {
            setCurrentQ(currentQ + 1);
            setUserAns('');
            setQuizStatus('typing');
        } else {
            setStory(null);
            setTopic('');
            confetti({ particleCount: 200, spread: 100 });
            toast({ title: "Mission Complete!", description: "You mastered the whole story!" });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {canEdit && (
                <div className="bg-white p-6 rounded-[35px] border-4 border-purple-100 flex flex-col md:flex-row gap-4 shadow-lg">
                    <div className="flex-1 space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Story Topic</Label>
                        <Input 
                            value={topic} 
                            onChange={e => setTopic(e.target.value)} 
                            placeholder="e.g. A brave cat in space" 
                            className="rounded-2xl h-14 border-2 focus:border-purple-400" 
                        />
                    </div>
                    <div className="w-full md:w-48 space-y-1">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-2">Length</Label>
                        <select 
                            value={wordCount} 
                            onChange={(e) => setWordCount(e.target.value)}
                            className="w-full h-14 rounded-2xl bg-slate-50 border-2 px-4 font-bold outline-none"
                        >
                            <option value="50">Short (50 words)</option>
                            <option value="150">Medium (150 words)</option>
                            <option value="300">Long (300 words)</option>
                        </select>
                    </div>
                    <Button 
                        onClick={handleGenerate} 
                        disabled={loading || !topic} 
                        className="md:mt-6 h-14 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-2xl px-8 shadow-lg shadow-purple-900/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><Wand2 className="mr-2 h-5 w-5" /> MAGIC WRITE</>}
                    </Button>
                </div>
            )}
            {story ? (
                <Card className="rounded-[60px] border-8 border-orange-100 overflow-hidden shadow-2xl bg-[#FFFDE7] animate-in zoom-in duration-500">
                    <div className="bg-orange-400 p-8 text-white flex justify-between items-center border-b-8 border-orange-500/20">
                        <div className="flex items-center gap-4">
                            <span className="text-6xl drop-shadow-md">{story.emojiIcon || '📖'}</span>
                            <CardTitle className="text-4xl font-black uppercase tracking-tighter">{story.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                             <Button variant="ghost" onClick={() => speak(story.content)} className="text-white hover:bg-white/20 rounded-full h-12 w-12"><Volume2 /></Button>
                             {canEdit && <Button onClick={handleSave} variant="ghost" className="text-white hover:bg-white/20 rounded-full h-12 w-12"><Save /></Button>}
                             <Button variant="ghost" onClick={() => setStory(null)} className="text-white hover:bg-white/20 rounded-full h-12 w-12"><XCircle /></Button>
                        </div>
                    </div>

                    <CardContent className="p-12 space-y-12">
                        <div className="max-w-4xl mx-auto">
                            <p className="text-3xl font-bold text-orange-900 leading-relaxed font-serif first-letter:text-7xl first-letter:font-black first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                                {story.content}
                            </p>
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[50px] border-4 border-dashed border-orange-300 shadow-inner space-y-8 relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <Badge className="bg-purple-600 text-white px-6 py-2 rounded-full text-lg font-black uppercase tracking-widest">
                                    Question {currentQ + 1} of 3
                                </Badge>
                                <div className="flex gap-2">
                                    {[0,1,2].map(i => (
                                        <div key={i} className={`h-3 w-3 rounded-full ${i === currentQ ? 'bg-purple-600 animate-pulse' : i < currentQ ? 'bg-green-400' : 'bg-slate-200'}`} />
                                    ))}
                                </div>
                            </div>

                            <h3 className="text-3xl font-black text-blue-900 leading-tight">
                                {story.questions[currentQ].question}
                            </h3>

                            {quizStatus === 'typing' ? (
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input 
                                        value={userAns} 
                                        onChange={e => setUserAns(e.target.value)} 
                                        placeholder="Speak your answer or type it here..." 
                                        className="h-20 text-2xl rounded-[30px] border-4 border-orange-100 shadow-inner px-8"
                                        onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                                    />
                                    <Button 
                                        onClick={checkAnswer}
                                        disabled={!userAns.trim()}
                                        className="h-20 px-12 bg-blue-600 hover:bg-blue-500 text-white text-2xl font-black rounded-[30px] shadow-[0_8px_0_#1e3a8a] transition-all active:translate-y-1 active:shadow-none"
                                    >
                                        CHECK! 🚀
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-6 animate-in zoom-in duration-300">
                                    <div className={`p-8 rounded-[40px] border-4 flex items-center gap-6 ${quizStatus === 'correct' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                                        <div className={`h-20 w-20 rounded-full flex items-center justify-center text-4xl shadow-lg ${quizStatus === 'correct' ? 'bg-green-500 text-white' : 'bg-rose-500 text-white'}`}>
                                            {quizStatus === 'correct' ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
                                        </div>
                                        <div>
                                            <p className="text-3xl font-black uppercase tracking-tight">{quizStatus === 'correct' ? "Amazing Thinking!" : "Almost There!"}</p>
                                            <p className="text-lg font-bold opacity-80">
                                                {quizStatus === 'correct' 
                                                    ? "You found the correct answer in the story book!" 
                                                    : `Let's try again! The story says: ${story.questions[currentQ].answer}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Button 
                                        onClick={handleNext} 
                                        className="w-full h-20 bg-purple-600 hover:bg-purple-500 text-white text-3xl font-black rounded-[40px] shadow-[0_10px_0_#581c87] transition-all active:translate-y-1 active:shadow-none"
                                    >
                                        {currentQ < 2 ? "NEXT QUESTION 🌈" : "FINISH MISSION 🏆"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-2xl font-black text-slate-700 flex items-center gap-2">
                            <Library className="text-purple-500" /> School Story Library
                        </h3>
                        <Badge variant="outline" className="text-slate-400 font-bold">{savedStories?.length || 0} Stories</Badge>
                    </div>

                    {!savedStories || savedStories.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[50px] border-8 border-dashed border-slate-50">
                            <BookOpen className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                            <p className="text-slate-300 font-bold uppercase tracking-widest">Library is quiet today...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedStories.map((s: any) => (
                                <Card 
                                    key={s.id} 
                                    className="group cursor-pointer rounded-[40px] border-none shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden bg-white"
                                    onClick={() => {
                                        setStory(s);
                                        setCurrentQ(0);
                                        setQuizStatus('typing');
                                        speak(s.title);
                                    }}
                                >
                                    <div className="p-6 flex items-center gap-4">
                                        <div className="text-5xl bg-slate-50 p-4 rounded-3xl transition-transform group-hover:scale-110">{s.emojiIcon}</div>
                                        <div className="flex-1 overflow-hidden">
                                            <h4 className="text-xl font-black text-slate-800 truncate leading-tight">{s.title}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge className="bg-orange-100 text-orange-600 border-none text-[10px] px-2">{s.wordCount} words</Badge>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{s.topic || 'Fun Tale'}</span>
                                            </div>
                                        </div>
                                        {canEdit && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); deleteDoc(doc(firestore!, 'junior_stories', s.id)); }}
                                                className="opacity-0 group-hover:opacity-100 p-2 text-rose-300 hover:text-rose-600 transition-opacity"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
const WritingCanvas: React.FC<{ onSound: (t: string) => void; schoolId: string }> = ({ onSound, schoolId }) => {
    const traceCanvasRef = useRef<HTMLCanvasElement>(null);
    const freeCanvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'letters' | 'numbers'>('letters');
    const [selectedItem, setSelectedItem] = useState('A');
    const [isDrawingFree, setIsDrawingFree] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [feedback, setFeedback] = useState('');
  
    const setupCanvases = useCallback(() => {
        [traceCanvasRef, freeCanvasRef].forEach((ref, isTraceCanvas) => {
            const canvas = ref.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            
            const size = Math.min(canvas.parentElement?.clientWidth || 400, 400);
            canvas.width = size; 
            canvas.height = size;
            
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);

            if (isTraceCanvas === 0 && traceCanvasRef.current) {
                const c = traceCanvasRef.current.getContext('2d')!;
                c.font = `900 ${size * 0.8}px "Nunito", sans-serif`; 
                c.textAlign = 'center'; 
                c.textBaseline = 'middle';
                c.strokeStyle = '#E2E8F0'; 
                c.setLineDash([10, 10]);
                c.lineWidth = 4;
                c.strokeText(selectedItem, size / 2, size / 2 + 10);
            } else if (isTraceCanvas === 1) {
                 ctx.lineWidth = 12;
                 ctx.lineCap = 'round';
                 ctx.lineJoin = 'round';
            }
        });
    }, [selectedItem]);
  
    useEffect(() => {
        setupCanvases();
        window.addEventListener('resize', setupCanvases);
        return () => window.removeEventListener('resize', setupCanvases);
    }, [setupCanvases]);

    const startFreeDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = freeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawingFree(true);
    };

    const drawFree = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawingFree) return;
        const canvas = freeCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const rect = canvas.getBoundingClientRect();
        const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
        const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const handleCheck = async () => {
        if (!freeCanvasRef.current || !schoolId) return;
        setIsEvaluating(true);
        setFeedback("Magic eyes checking...");
        
        const imageDataUri = freeCanvasRef.current.toDataURL('image/png');
        const result = await assessHandwritingAction({ imageDataUri, targetCharacter: selectedItem, schoolId });

        if (result.success) {
            if (result.isCorrect) {
                confetti();
                setFeedback("You are a Number Superstar! ⭐");
                onSound(`Wonderful! You wrote ${selectedItem} perfectly!`);
            } else {
                setFeedback("Almost there! Try tracing one more time.");
                onSound("Not quite, but good try! Let's look at the example again.");
            }
        } else {
            setFeedback("The AI couldn't see your drawing. Try again!");
        }
        
        setIsEvaluating(false);
    };

    return (
      <Card className="rounded-[60px] border-8 border-purple-100 overflow-hidden bg-white shadow-2xl">
          <div className="bg-purple-500 p-8 text-white text-center">
              <h3 className="text-4xl font-black uppercase tracking-tighter">Number Magic Pen 🪄</h3>
          </div>
          <CardContent className="p-12 space-y-10">
              <div className="flex justify-center gap-2 overflow-x-auto py-4">
                 <div className="bg-white p-2 rounded-full flex gap-1 border-2 border-slate-100">
                    <Button variant={mode === 'letters' ? 'secondary' : 'ghost'} className="rounded-full" onClick={() => { setMode('letters'); setSelectedItem('A'); }}>Letters</Button>
                    <Button variant={mode === 'numbers' ? 'secondary' : 'ghost'} className="rounded-full" onClick={() => { setMode('numbers'); setSelectedItem('1'); }}>Numbers</Button>
                 </div>
              </div>
              <div className="flex justify-center gap-2 overflow-x-auto pb-4 no-scrollbar">
                  {(mode === 'letters' ? constants.LETTERS : constants.NUMBERS).map(item => (
                      <button key={item} onClick={() => setSelectedItem(item)} className={`flex-shrink-0 w-14 h-14 rounded-2xl font-black text-2xl border-4 ${selectedItem === item ? 'bg-purple-600 text-white border-white scale-110' : 'bg-slate-50 text-slate-400 border-transparent'}`}>{item}</button>
                  ))}
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-4 text-center">
                      <p className="text-slate-400 font-bold uppercase text-xs">1. Trace This</p>
                      <canvas ref={traceCanvasRef} className="border-4 border-slate-100 rounded-[3rem] w-full aspect-square" />
                  </div>
                  <div className="space-y-4 text-center relative">
                      <p className="text-slate-800 font-bold uppercase text-xs">2. Write it yourself</p>
                      <canvas 
                          ref={freeCanvasRef} 
                          onMouseDown={startFreeDrawing}
                          onMouseUp={() => setIsDrawingFree(false)}
                          onMouseLeave={() => setIsDrawingFree(false)}
                          onTouchStart={startFreeDrawing}
                          onTouchEnd={() => setIsDrawingFree(false)}
                          onMouseMove={drawFree}
                          onTouchMove={drawFree}
                          className="border-8 border-purple-200 rounded-[3rem] w-full aspect-square cursor-crosshair" 
                      />
                      {isEvaluating && <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-[3rem] animate-pulse"><Loader2 className="w-12 h-12 animate-spin text-purple-600"/></div>}
                  </div>
              </div>
              <div className="text-center space-y-6">
                  {feedback && <Badge className="bg-purple-100 text-purple-700 text-xl p-4 rounded-2xl border-none">{feedback}</Badge>}
                  <div className="flex gap-4 justify-center">
                      <Button onClick={() => setupCanvases()} variant="outline" className="h-16 px-10 rounded-2xl border-4 font-black">CLEAR</Button>
                      <Button onClick={handleCheck} disabled={isEvaluating} className="h-16 px-16 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black shadow-xl">CHECK MY WORK!</Button>
                  </div>
              </div>
          </CardContent>
      </Card>
  );
};
const SingingDictionary: React.FC<{ schoolId: string }> = ({ schoolId }) => {
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [rhyme, setRhyme] = useState('');
    const { toast } = useToast();
    
    const words = constants.DICTIONARY_WORDS; 
    const current = words[index];

    const loadPage = useCallback(async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        setRhyme('');
        try {
            const result = await generateLessonImageAction({ prompt: current.imagePrompt, schoolId });
            if (result.success) {
                setImageUrl(result.data || null);
            }
        } catch (e: any) {
            toast({ title: 'Image Error', description: e.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    }, [current, schoolId, toast]);

    useEffect(() => { loadPage(); }, [index, loadPage]);

    const playSong = async () => {
        if (!current || !schoolId) return;
        setLoading(true);
        try {
            const rhymeResult = await generateRhyme({ topic: current.word, schoolId });
            if (rhymeResult.success) {
                setRhyme(rhymeResult.rhyme);
                const ttsResult = await generateTTSAction({ text: rhymeResult.rhyme, voice: 'Puck', schoolId });
                if (ttsResult.success && ttsResult.data && typeof window !== 'undefined') {
                    const audio = new Audio(`data:audio/wav;base64,${ttsResult.data}`);
                    audio.play();
                }
            } else {
                throw new Error(rhymeResult.error || "Failed to generate rhyme.");
            }
        } catch (e: any) {
            toast({ title: 'AI Error', description: e.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-8 animate-in fade-in">
            <div className="grid grid-cols-7 md:grid-cols-13 gap-2 overflow-x-auto p-4 bg-white rounded-3xl shadow-lg border-4 border-red-50">
                {words.map((w, i) => (
                    <button key={i} onClick={() => setIndex(i)} className={`flex-shrink-0 w-10 h-10 rounded-lg font-black ${index === i ? 'bg-red-500 text-white' : 'bg-red-50 text-red-400'}`}>
                        {w.word[0]}
                    </button>
                ))}
            </div>

            <Card className={juniorStyles.card}>
                <div className="bg-gradient-to-r from-red-400 to-pink-400 p-8 text-white text-center">
                    <h2 className="text-7xl font-black">{current.word[0]}{current.word[0].toLowerCase()}</h2>
                    <p className="text-2xl font-bold uppercase tracking-widest">{current.word}</p>
                </div>
                <CardContent className="p-10 flex flex-col items-center space-y-8">
                    <div className="w-80 h-80 rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden bg-red-50">
                        {loading ? <div className="flex h-full items-center justify-center animate-spin text-red-200"><Loader2 size={48}/></div> : imageUrl && <img src={imageUrl} className="w-full h-full object-cover" alt={current.word} />}
                    </div>
                    
                    {rhyme && (
                        <div className="bg-red-50 p-6 rounded-3xl border-4 border-dashed border-red-200 text-center animate-in zoom-in">
                            <p className="text-xl font-bold text-red-700 whitespace-pre-wrap">{rhyme}</p>
                        </div>
                    )}

                    <Button onClick={playSong} disabled={loading} className={`${juniorStyles.button} bg-red-500 hover:bg-red-600 shadow-[0_10px_0_#991b1b]`}>
                        <Music className="mr-3" /> SING ALONG!
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

// --- LIFE SKILLS SECTION ---
type PhysicalHealthTab = 'gross-motor' | 'fine-motor' | 'hygiene' | 'nutrition';
const PhysicalHealthModule: React.FC<{ onSound: (t: string) => void; onComplete: () => void, schoolId: string, canEdit: boolean }> = ({ onSound, onComplete, schoolId, canEdit }) => {
    return <div className="p-8 text-center text-muted-foreground">Physical Health Module coming soon!</div>
};

const LifeSkillsZone: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LifeSkillTab>('emotions');
  const [playing, setPlaying] = useState(false);
  const [stars, setStars] = useState(0);
  const { schoolId } = useCurrentSchool();
  const { role } = useRole();
  const canEdit = ['Admin', 'Administrator', 'Teacher', 'Director'].includes(role || '');
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);

  const playFeedbackSound = async (text: string) => {
    if (!schoolId) return;
    if (currentSourceRef.current) {
      try { currentSourceRef.current.stop(); } catch (e) {}
    }
    setPlaying(true);
    const result = await generateTTSAction({ text, voice: 'Kore', schoolId });
    if (result.success && result.data && typeof window !== 'undefined' && window.AudioContext) {
        const audioContext = new window.AudioContext();
        const decodedData = await audioContext.decodeAudioData(Buffer.from(result.data, 'base64').buffer);
        const source = audioContext.createBufferSource();
        source.buffer = decodedData;
        source.connect(audioContext.destination);
        source.start(0);
        currentSourceRef.current = source;
        source.onended = () => { setPlaying(false); currentSourceRef.current = null; };
    } else { setPlaying(false); }
  };

  const addStar = () => setStars(prev => prev + 1);

  const tabs: {id: LifeSkillTab, label: string, icon: React.ElementType, color: string}[] = [
    { id: 'physical-health', label: 'Physical & Health', icon: Heart, color: 'bg-green-500' },
    { id: 'emotions', label: 'Feelings', icon: Smile, color: 'bg-yellow-500' },
    { id: 'routine-songs', label: 'Skill Songs', icon: Music, color: 'bg-pink-500' },
    { id: 'modeling', label: 'Modeling', icon: Tv, color: 'bg-indigo-500' },
    { id: 'practical-life', label: 'Play & Routines', icon: GraduationCap, color: 'bg-blue-500' },
    { id: 'communication', label: 'Talk & Listen', icon: MessageSquare, color: 'bg-orange-500' },
    { id: 'social', label: 'Social & Kind', icon: Users, color: 'bg-rose-500' },
    { id: 'puppet-theater', label: 'Puppet Show', icon: Drama, color: 'bg-purple-500' },
    { id: 'cognitive', label: 'Super Solver', icon: BrainCircuit, color: 'bg-emerald-500' }
  ];

  if (!schoolId) return <div className="text-center p-8"><Loader2 className="animate-spin"/></div>

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto space-y-8 pb-20 animate-in fade-in duration-500 font-black">
      <div className="w-full flex justify-between items-center px-6">
        <div className="text-left">
          <h2 className="text-5xl font-black text-teal-600 uppercase tracking-tighter">Life Skills Hub 🌟</h2>
          <p className="text-slate-800 font-black italic">Social, Emotional & Independence!</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-3xl shadow-xl border-4 border-yellow-100">
           <Star className="text-3xl text-yellow-400 fill-current"/>
           <span className="text-3xl font-black text-slate-800">{stars}</span>
        </div>
      </div>
      <div className="w-full overflow-x-auto no-scrollbar pb-4 px-4 font-black">
        <div className="flex justify-start md:justify-center gap-3 bg-white p-4 rounded-[3rem] shadow-2xl border-4 border-teal-50 min-w-max font-black">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[120px] px-5 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex flex-col items-center justify-center gap-1 ${
                activeTab === tab.id ? `${tab.color} text-white shadow-xl scale-110 -translate-y-1` : 'text-slate-800 hover:bg-teal-50 font-black'
              }`}
            >
              <Icon className={`w-5 h-5`} />
              <span>{tab.label}</span>
            </button>
          )})}
        </div>
      </div>
      <div className="w-full px-4 font-black">
        {activeTab === 'physical-health' && <PhysicalHealthModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} canEdit={canEdit}/>}
        {activeTab === 'emotions' && <EmotionsModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} canEdit={canEdit} />}
        {activeTab === 'routine-songs' && <RoutineSongsModule onSound={playFeedbackSound} schoolId={schoolId} />}
        {activeTab === 'modeling' && <ModelingModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} />}
        {activeTab === 'practical-life' && <PracticalLifeModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} />}
        {activeTab === 'communication' && <CommunicationModule onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId!} />}
        {activeTab === 'social' && <SocialScenarios onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId} canEdit={canEdit}/>}
        {activeTab === 'puppet-theater' && <PuppetTheater onSound={playFeedbackSound} onComplete={addStar} schoolId={schoolId!} />}
        {activeTab === 'cognitive' && <CognitiveSkills onSound={playFeedbackSound} onComplete={addStar} />}
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
export default function JuniorCampusPage() {
    const { role } = useRole();
    const { user } = useUser();
    
    const { schoolId } = useCurrentSchool();
    const canEdit = ['Admin', 'Administrator', 'Director', 'Teacher'].includes(role || '');
    
    return (
        <div className="min-h-screen bg-[#FFFBEB] p-4 md:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-8 rounded-[45px] shadow-xl border-b-[12px] border-yellow-200">
                    <div className="flex items-center gap-4">
                        <div className="bg-yellow-400 p-5 rounded-[30px] shadow-inner rotate-3"><Rabbit className="h-12 w-12 text-white" /></div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-800 tracking-tighter">Junior Campus</h1>
                            <p className="text-xl font-bold text-pink-500 uppercase tracking-widest italic">The Magic of Learning! ✨</p>
                        </div>
                    </div>
                    {schoolId && <div className="flex items-center gap-2 bg-slate-50 px-6 py-3 rounded-[20px] border-2 border-slate-100">
                        <Badge variant="outline" className="text-indigo-500 border-indigo-200">SaaS Node</Badge>
                        <span className="text-xs font-black text-slate-400">{schoolId}</span>
                    </div>}
                </header>

                <Tabs defaultValue="lifeskills" className="w-full">
                    <TabsList className="grid w-full grid-cols-9 h-24 bg-white p-2 rounded-[30px] shadow-xl border-2 border-yellow-100 mb-10 overflow-x-auto no-scrollbar">
                        <TabsTrigger value="lifeskills" className="rounded-2xl data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700 font-black flex flex-col items-center gap-1"><Heart className="w-5 h-5"/> Life Skills</TabsTrigger>
                        <TabsTrigger value="writing" className="rounded-2xl data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 font-black flex flex-col items-center gap-1"><Pencil className="w-5 h-5"/> Writing</TabsTrigger>
                        <TabsTrigger value="stories" className="rounded-2xl data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 font-black flex flex-col items-center gap-1"><BookOpen className="w-5 h-5"/> Stories</TabsTrigger>
                        <TabsTrigger value="phonics" className="rounded-2xl data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black flex flex-col items-center gap-1"><Ear className="w-5 h-5"/> Phonics</TabsTrigger>
                        <TabsTrigger value="dictionary" className="rounded-2xl data-[state=active]:bg-red-100 data-[state=active]:text-red-700 font-black flex flex-col items-center gap-1"><Languages className="w-5 h-5"/> Dictionary</TabsTrigger>
                        <TabsTrigger value="math" className="rounded-2xl data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 font-black flex flex-col items-center gap-1"><Calculator className="w-5 h-5"/> Math</TabsTrigger>
                        <TabsTrigger value="science" className="rounded-2xl data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 font-black flex flex-col items-center gap-1"><Atom className="w-5 h-5"/> Science</TabsTrigger>
                        <TabsTrigger value="art" className="rounded-2xl data-[state=active]:bg-pink-100 data-[state=active]:text-pink-700 font-black flex flex-col items-center gap-1"><Palette className="w-5 h-5"/> Art</TabsTrigger>
                        <TabsTrigger value="rewards" className="rounded-2xl data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700 font-black flex flex-col items-center gap-1"><Trophy className="w-5 h-5"/> Rewards</TabsTrigger>
                    </TabsList>

                    <div className="min-h-[700px] animate-in slide-in-from-bottom-10 duration-1000">
                        <TabsContent value="lifeskills" className="mt-0"><LifeSkillsZone /></TabsContent>
                        <TabsContent value="writing" className="mt-0"><WritingCanvas onSound={() => {}} schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="stories" className="mt-0"><StorySpark canEdit={canEdit} schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="phonics" className="mt-0"><PhonicsWorld schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="dictionary" className="mt-0"><SingingDictionary schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="math" className="mt-0"><MathPlayground schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="science" className="mt-0"><JuniorScienceWorld schoolId={schoolId!} /></TabsContent>
                        <TabsContent value="art" className="mt-0"><div className="bg-slate-100 p-8 rounded-3xl shadow-xl border-b-8 border-slate-300"><ArtStudio schoolId={schoolId!} /></div></TabsContent>
                        <TabsContent value="rewards" className="mt-0"><StickerBook schoolId={schoolId!} /></TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
