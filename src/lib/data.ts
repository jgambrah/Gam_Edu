import type { NavItem, UserRole, ChartOfAccount, GeneralLedgerTransaction, Bus, Route } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  UserCog,
  GraduationCap,
  BookOpen,
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
  PenLine,
  UserCheck as UserCheckIcon,
  Plane,
  Star,
  Landmark,
  Boxes,
  Route as RouteIcon,
  BookCopy,
  BarChart,
  CalendarCheck,
  Shield,
  Code,
  Sigma,
  FlaskConical,
  BookOpenCheck,
  Activity,
  FolderKanban,
  SquarePen,
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
  Sparkles,
  Coins,
  MessageSquare
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
    path: '/dashboard/my-children',
    title: 'My Children',
    icon: Users,
    roles: ['Parent'],
  },
  {
    path: '/dashboard/my-bills',
    title: 'My Bills',
    icon: Banknote,
    roles: ['Student', 'Parent'],
  },
  {
    path: '/dashboard/my-grades',
    title: 'Live Grades',
    icon: TrendingUp,
    roles: ['Student', 'Parent'],
  },
  {
    path: '/dashboard/my-reports',
    title: 'My Report Cards',
    icon: FileText,
    roles: ['Student', 'Parent'],
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
            roles: ['Director', 'Administrator', 'Teacher', 'Student'],
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
    path: '/dashboard/people',
    title: 'People Management',
    icon: Users,
    roles: ['Director', 'Administrator'],
    subItems: [
        {
            path: '/dashboard/admissions',
            title: 'Admissions',
            icon: PenLine,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/staff-management-v2',
            title: 'Staff Management',
            icon: UserCog,
            roles: ['Director', 'Administrator'],
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
    ]
  },
  {
    path: '/dashboard/academics',
    title: 'Academics',
    icon: BookOpen,
    roles: ['Director', 'Administrator', 'Teacher', 'Student'],
    subItems: [
        {
            path: '/dashboard/attendance',
            title: 'Student Attendance',
            icon: CalendarCheck,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
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
            roles: ['Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/academics/gradebook/manual-entry',
            title: 'Bulk Grade Entry',
            icon: SquarePen,
            roles: ['Teacher', 'Administrator', 'Director'],
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
    path: '/dashboard/hr',
    title: 'Human Resources',
    icon: UserCog,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff'],
    subItems: [
        {
            path: '/dashboard/attendance/staff',
            title: 'Staff Clock-In',
            icon: UserCheckIcon,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff'],
        },
        {
            path: '/dashboard/hr/staff-attendance-records',
            title: 'Staff Attendance Records',
            icon: CalendarCheck,
            roles: ['Director', 'Administrator'],
        },
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
    roles: ['Director', 'Administrator', 'Accountant'],
     subItems: [
      {
        path: '/dashboard/accounts',
        title: 'Student Billing',
        icon: Banknote,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/finance/bulk-payments',
        title: 'Bulk Daily Receipts',
        icon: Coins,
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
    roles: ['Director', 'Administrator', 'Teacher'],
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

export const MOCK_ACADEMIC_YEARS = ['2023-2024', '2024-2025'];
export const MOCK_TERMS = ['First Term', 'Second Term', 'Third Term'];

export const MOCK_SUBJECTS = [
  { id: 'math', name: 'Mathematics' },
  { id: 'science', name: 'Integrated Science' },
  { id: 'english', name: 'English Language' },
  { id: 'social', name: 'Social Studies' },
  { id: 'rme', name: 'R.M.E' },
  { id: 'ict', name: 'I.C.T' },
  { id: 'french', name: 'French' },
  { id: 'gl', name: 'Ghanaian Language' },
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  { id: '1000', code: '1000', name: 'Assets', type: 'Asset', isControlAccount: true },
  { id: '1100', code: '1100', name: 'Cash at Bank', type: 'Asset', isControlAccount: false, parentAccountId: '1000' },
  { id: '1200', code: '1200', name: 'Cash in Hand', type: 'Asset', isControlAccount: false, parentAccountId: '1000' },
  { id: '2000', code: '2000', name: 'Liabilities', type: 'Liability', isControlAccount: true },
  { id: '3000', code: '3000', name: 'Equity', type: 'Equity', isControlAccount: true },
  { id: '4000', code: '4000', name: 'Revenue', type: 'Revenue', isControlAccount: true },
  { id: '4100', code: '4100', name: 'Tuition Fees', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
  { id: '5000', code: '5000', name: 'Expenses', type: 'Expense', isControlAccount: true },
  { id: '5100', code: '5100', name: 'Salaries', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
  { id: '5200', code: '5200', name: 'Rent', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
];

export const MOCK_JOURNAL_ENTRIES: any[] = [];

export const MOCK_PUBLIC_HOLIDAYS = [
  { id: '1', name: 'New Year Day', date: new Date(2024, 0, 1) },
  { id: '2', name: 'Constitution Day', date: new Date(2024, 0, 7) },
  { id: '3', name: 'Independence Day', date: new Date(2024, 2, 6) },
  { id: '4', name: 'Good Friday', date: new Date(2024, 2, 29) },
  { id: '5', name: 'Easter Monday', date: new Date(2024, 3, 1) },
  { id: '6', name: 'Eidul-Fitr', date: new Date(2024, 3, 11) },
  { id: '7', name: 'May Day', date: new Date(2024, 4, 1) },
  { id: '8', name: 'Eidul-Adha', date: new Date(2024, 5, 17) },
  { id: '9', name: 'Founders’ Day', date: new Date(2024, 7, 4) },
  { id: '10', name: 'Kwame Nkrumah Memorial Day', date: new Date(2024, 8, 21) },
  { id: '11', name: 'Farmer’s Day', date: new Date(2024, 11, 6) },
  { id: '12', name: 'Christmas Day', date: new Date(2024, 11, 25) },
  { id: '13', name: 'Boxing Day', date: new Date(2024, 11, 26) },
];

export const MOCK_CROSSWORD_PUZZLES = [
  {
    id: '1',
    title: 'Science Basics',
    topic: 'Science',
    grid: [
      ['C', 'E', 'L', 'L'],
      ['O', '', '', ''],
      ['R', '', '', ''],
      ['E', '', '', '']
    ],
    clues: {
      across: [{ number: 1, clue: 'Basic unit of life', answer: 'CELL', row: 0, col: 0 }],
      down: [{ number: 1, clue: 'The center of an atom', answer: 'CORE', row: 0, col: 0 }]
    }
  }
];
