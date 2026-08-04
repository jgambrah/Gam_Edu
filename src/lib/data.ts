import type { NavItem, UserRole, ChartOfAccount, GeneralLedgerTransaction } from '@/lib/types';
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
  ArrowUpCircle,
  Database,
  LayoutTemplate,
  IdCard,
  User as UserIcon
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    roles: 'all',
  },
  {
    path: '/dashboard/my-children',
    title: 'My Children',
    icon: Users,
    roles: ['Parent'],
  },
  {
    path: '/dashboard/announcements',
    title: 'Announcements',
    icon: Megaphone,
    roles: 'all',
  },
  {
    path: '/dashboard/my-attendance',
    title: 'My Attendance',
    icon: CalendarCheck,
    roles: ['Student'],
  },
  {
    path: '/dashboard/my-attendance',
    title: 'My Ward(s) Attendance',
    icon: CalendarCheck,
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
            roles: ['Director', 'Administrator', 'Secretary'],
        }
    ]
  },
  {
    path: '/dashboard/profile',
    title: 'My Profile',
    icon: UserIcon,
    roles: 'all',
  },
  {
    path: '/dashboard/gallery',
    title: 'School Gallery',
    icon: Clapperboard,
    roles: 'all',
  },
  {
    path: '/dashboard/people',
    title: 'People Management',
    icon: Users,
    roles: ['Director', 'Administrator', 'Secretary', 'Receptionist'],
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
            roles: ['Director', 'Administrator', 'Secretary', 'Receptionist'],
        },
        {
            path: '/dashboard/parents-v2',
            title: 'Parents',
            icon: HeartHandshake,
            roles: ['Director', 'Administrator', 'Secretary'],
        },
        {
            path: '/dashboard/students/id-cards',
            title: 'ID Card Generator',
            icon: IdCard,
            roles: ['Director', 'Administrator', 'Secretary'],
        },
        {
            path: '/dashboard/admin/promotion',
            title: 'Class Promotion',
            icon: ArrowUpCircle,
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
            icon: PenLine,
            roles: ['Parent'],
        },
    ]
  },
  {
    path: '/dashboard/academics',
    title: 'Academics',
    icon: BookOpen,
    roles: ['Director', 'Administrator', 'Teacher'],
    subItems: [
        {
            path: '/dashboard/attendance',
            title: 'Student Attendance',
            icon: CalendarCheck,
            roles: ['Director', 'Administrator', 'Teacher', 'Receptionist'],
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
            roles: ['Director', 'Administrator', 'Teacher'],
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
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/assessments',
            title: 'Assessments',
            icon: ClipboardCheck,
            roles: ['Director', 'Administrator', 'Teacher'],
        },
        {
            path: '/dashboard/academics/gradebook/manual-entry',
            title: 'Gradebook',
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
            roles: ['Teacher', 'Administrator', 'Director'],
        },
        {
            path: '/dashboard/timetable',
            title: 'Timetable',
            icon: CalendarDays,
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
        },
        {
            path: '/dashboard/calendar',
            title: 'School Calendar',
            icon: CalendarDays,
            roles: ['Teacher', 'Administrator', 'Director', 'Receptionist', 'Student', 'Parent'],
        },
    ]
  },
  {
    path: '/dashboard/clubs',
    title: 'Clubs & Activities',
    icon: Activity,
    roles: ['Student', 'Teacher', 'Administrator', 'Director', 'Parent'],
    subItems: [
        {
            path: '/dashboard/nursery-bloom',
            title: 'Nursery Bloom',
            icon: Sparkles,
            roles: ['Student', 'Teacher', 'Administrator', 'Director', 'Parent'],
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
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer', 'Secretary'],
    subItems: [
        {
            path: '/dashboard/attendance/staff',
            title: 'Staff Clock-In',
            icon: UserCheckIcon,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer', 'Secretary', 'Receptionist'],
        },
        {
            path: '/dashboard/hr/staff-attendance-records',
            title: 'Staff Attendance Records',
            icon: CalendarCheck,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/hr/leave-management',
            title: 'Leave Management',
            icon: Plane,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer', 'Secretary'],
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
    roles: ['Director', 'Administrator', 'Accountant', 'Secretary'],
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
        path: '/dashboard/finance/fixed-assets',
        title: 'Fixed Asset Register',
        icon: Landmark,
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
        roles: ['Director', 'Administrator', 'Accountant', 'Secretary'],
      },
      {
        path: '/dashboard/finance/shop',
        title: 'School Shop',
        icon: ShoppingBag,
        roles: ['Director', 'Administrator', 'Accountant', 'Secretary'],
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
        path: '/dashboard/finance/budget',
        title: 'Budgeting & Variance',
        icon: TrendingUp,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
       {
        path: '/dashboard/finance/settings',
        title: 'Financial Settings',
        icon: Settings,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
    ]
  },
   {
    path: '/dashboard/operations',
    title: 'Operations',
    icon: Boxes,
    roles: ['Director', 'Administrator', 'Librarian', 'Transport Staff', 'Student', 'Teacher', 'Accountant', 'Secretary', 'Receptionist'],
     subItems: [
        {
            path: '/dashboard/library',
            title: 'Library',
            icon: Library,
            roles: ['Librarian', 'Student', 'Teacher', 'Administrator', 'Director', 'Secretary'],
        },
        {
            path: '/dashboard/inventory',
            title: 'Inventory',
            icon: Boxes,
            roles: ['Administrator', 'Director', 'Accountant', 'Secretary'],
        },
        {
            path: '/dashboard/transport',
            title: 'Transport',
            icon: RouteIcon,
            roles: ['Administrator', 'Director', 'Transport Staff', 'Receptionist'],
        },
        {
            path: '/dashboard/boarding',
            title: 'Boarding',
            icon: Building2,
            roles: ['Administrator', 'Director', 'Teacher', 'Student', 'Secretary'],
        },
    ]
  },
  {
    path: '/dashboard/reports',
    title: 'Reporting & Analytics',
    icon: BarChart,
    roles: ['Director', 'Administrator', 'Teacher', 'Secretary'],
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
        roles: ['Director', 'Administrator', 'Teacher', 'Receptionist'],
      },
      {
        path: '/dashboard/reports/enrollment',
        title: 'Enrollment',
        icon: Users,
        roles: ['Director', 'Administrator', 'Secretary'],
      },
      {
        path: '/dashboard/reports/inventory',
        title: 'Inventory',
        icon: Boxes,
        roles: ['Director', 'Administrator', 'Secretary'],
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
            path: '/dashboard/admin/migration',
            title: 'Data Import Hub',
            icon: Database,
            roles: ['Director', 'Administrator'],
        },
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
        {
            path: '/dashboard/admin/website-builder',
            title: 'Website Builder',
            icon: LayoutTemplate,
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

export const MOCK_ACADEMIC_YEARS = [
  '2020-2021',
  '2021-2022',
  '2022-2023',
  '2023-2024',
  '2024-2025',
  '2025-2026',
  '2026-2027',
  '2027-2028',
  '2028-2029',
  '2029-2030',
];

export const MOCK_TERMS = [
  'First Term',
  'Second Term',
  'Third Term',
];

export const MOCK_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
  { accountId: '1000', name: 'Assets', type: 'Asset', isControlAccount: true },
  { accountId: '1010', name: 'Cash at Bank', type: 'Asset', isControlAccount: false, parentAccountId: '1000', balance: 50000, schoolId: 'default' },
  { accountId: '1020', name: 'Petty Cash', type: 'Asset', isControlAccount: false, parentAccountId: '1000', balance: 1500, schoolId: 'default' },
  { accountId: '2000', name: 'Liabilities', type: 'Liability', isControlAccount: true },
  { accountId: '2010', name: 'Accounts Payable', type: 'Liability', isControlAccount: false, parentAccountId: '2000', balance: 3400, schoolId: 'default' },
  { accountId: '3000', name: 'Equity', type: 'Equity', isControlAccount: true },
  { accountId: '3010', name: 'Retained Earnings', type: 'Equity', isControlAccount: false, parentAccountId: '3000', balance: 48100, schoolId: 'default' },
  { accountId: '4000', name: 'Revenue', type: 'Revenue', isControlAccount: true },
  { accountId: '4010', name: 'Tuition Fees', type: 'Revenue', isControlAccount: false, parentAccountId: '4000', balance: 12000, schoolId: 'default' },
  { accountId: '5000', name: 'Expenses', type: 'Expense', isControlAccount: true },
  { accountId: '5010', name: 'Salaries Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000', balance: 8000, schoolId: 'default' },
  { accountId: '5020', name: 'Rent Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000', balance: 2000, schoolId: 'default' }
];

export const MOCK_JOURNAL_ENTRIES: GeneralLedgerTransaction[] = [
  {
    id: 1,
    ref: 'INIT-01',
    date: '2026-06-01',
    description: 'Initial balance transfer',
    debits: [{ accountId: '1010', amount: 50000 }],
    credits: [{ accountId: '3010', amount: 50000 }]
  },
  {
    id: 2,
    ref: 'PAY-01',
    date: '2026-06-02',
    description: 'Tuition fee collection',
    debits: [{ accountId: '1010', amount: 12000 }],
    credits: [{ accountId: '4010', amount: 12000 }]
  },
  {
    id: 3,
    ref: 'EXP-01',
    date: '2026-06-03',
    description: 'June staff salaries paid',
    debits: [{ accountId: '5010', amount: 8000 }],
    credits: [{ accountId: '1010', amount: 8000 }]
  }
];
