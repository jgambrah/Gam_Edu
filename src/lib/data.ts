

import type { NavItem, Bus, Route, ChartOfAccount, GeneralLedgerTransaction, MathProblem, GlobalLeaderboardEntry, ElaGrammarDrill } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  GraduationCap,
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
  UserCog,
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
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    roles: 'all',
  },
  {
    path: '/dashboard/communication',
    title: 'Communication',
    icon: MessageSquare,
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
            title: 'Staff Management V2',
            icon: UserCog,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/students-v3',
            title: 'Students V3',
            icon: GraduationCap,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/parents-v2',
            title: 'Parents V2',
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
            path: '/dashboard/grades2',
            title: 'Gradebook',
            icon: TrendingUp,
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
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
    ]
  },
  {
    path: '/dashboard/clubs',
    title: 'Clubs & Activities',
    icon: Activity,
    roles: ['Student', 'Teacher', 'Administrator', 'Director'],
    subItems: [
        {
            path: '/dashboard/game-zone',
            title: 'Game Zone',
            icon: Gamepad2,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/maths-club-v2',
            title: 'Maths Club 2.0',
            icon: Sigma,
            roles: ['Student', 'Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/science-club-v2',
            title: 'Science Club 2.0',
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
    ]
  },
   {
    path: '/dashboard/hr',
    title: 'Human Resources',
    icon: UserCog,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook'],
    subItems: [
        {
            path: '/dashboard/leave-management',
            title: 'Leave Management',
            icon: Plane,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook'],
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
    roles: ['Director', 'Administrator', 'Accountant', 'Teacher', 'Librarian', 'Cook'],
     subItems: [
      {
        path: '/dashboard/accounts',
        title: 'Student Billing',
        icon: Banknote,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/cash-till',
        title: 'Cash Till',
        icon: Wallet,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/payables',
        title: 'Accounts Payable',
        icon: Landmark,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/payroll',
        title: 'Payroll',
        icon: Landmark,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/payroll/settings',
        title: 'Settings',
        icon: Settings,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/my-payslips',
        title: 'My Payslips',
        icon: FileText,
        roles: ['Teacher', 'Accountant', 'Librarian', 'Cook', 'Director', 'Administrator'],
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
        path: '/dashboard/reports/financials',
        title: 'Financial',
        icon: Banknote,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/reports/payroll',
        title: 'Payroll',
        icon: Landmark,
        roles: ['Director', 'Administrator', 'Accountant'],
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
    ]
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

export const MOCK_MATH_PROBLEMS: MathProblem[] = [
    { id: 'alg-e-01', topic: 'Algebra', difficulty: 'Easy', question_text: 'If x + 5 = 12, what is x?', correct_answer: 7, options: [5, 6, 7, 8], classId: 'class-1' },
    { id: 'alg-e-02', topic: 'Algebra', difficulty: 'Easy', question_text: 'Solve for y: 3y = 21', correct_answer: 7, options: [3, 6, 7, 9], classId: 'class-1' },
    { id: 'geo-m-01', topic: 'Geometry', difficulty: 'Medium', question_text: 'What is the area of a circle with a radius of 5?', correct_answer: '78.54', options: ['31.42', '50.00', '78.54', '100.00'], classId: 'class-2' },
];

export const MOCK_LEADERBOARD: GlobalLeaderboardEntry[] = [
    { userId: 'student-01', userName: 'Alice', total_correct_answers: 150, total_quizzes_completed: 20, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-01' },
    { userId: 'student-02', userName: 'Bob', total_correct_answers: 135, total_quizzes_completed: 18, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-02' },
    { userId: 'student-03', userName: 'Charlie', total_correct_answers: 120, total_quizzes_completed: 22, profilePictureUrl: 'https://i.pravatar.cc/150?u=student-03' },
];

export const MOCK_ELA_DRILLS: ElaGrammarDrill[] = [
    { id: 'ela-g-01', topic: 'Punctuation', type: 'MCQ', question_prompt: 'Which sentence is correctly punctuated?', correct_answer: "The quick, brown fox jumps over the lazy dog.", options: ["The quick, brown fox jumps over the lazy dog.", "The quick brown fox, jumps over the lazy dog.", "The quick brown fox jumps over, the lazy dog."], classId: 'class-1' },
    { id: 'ela-g-02', topic: 'Verbs', type: 'MCQ', question_prompt: "The children ______ playing in the park.", correct_answer: "are", options: ["is", "are", "am", "be"], classId: 'class-1' },
];
