import type { NavItem, UserRole } from '@/lib/types';
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
  Receipt,
  User as UserIcon,
  ShieldCheck
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
            roles: ['Director', 'Administrator'],
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
            roles: ['Director', 'Administrator'],
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
            icon: PenLine,
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
            roles: ['Teacher', 'Administrator', 'Director', 'Student', 'Parent'],
        },
        {
            path: '/dashboard/report-cards/signing',
            title: 'Authorization Vault',
            icon: ShieldCheck,
            roles: ['Director', 'Administrator'],
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
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer'],
    subItems: [
        {
            path: '/dashboard/attendance/staff',
            title: 'Staff Clock-In',
            icon: UserCheckIcon,
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer'],
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
            roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook', 'Transport Staff', 'Cleaner', 'Security Officer'],
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
        path: '/dashboard/finance/payment-vouchers',
        title: 'Payment Vouchers',
        icon: Receipt,
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

export const NUMERACY_DATA = {
  numbers: [
    { value: 1, word: 'One', prompt: 'a cute single cartoon lion cub playing with a ball' },
    { value: 2, word: 'Two', prompt: 'two cute cartoon penguins sliding on ice' },
    { value: 3, word: 'Three', prompt: 'three cute friendly cartoon monkeys hanging on tree branches' },
    { value: 4, word: 'Four', prompt: 'four cute cartoon puppies running in a garden' },
    { value: 5, word: 'Five', prompt: 'five colorful cartoon butterflies flying around flowers' }
  ],
  sequence: [
    { question: 'What number is missing?', sequence: [1, 2, null, 4], answer: 3, options: [2, 3, 5] },
    { question: 'What number is missing?', sequence: [null, 6, 7, 8], answer: 5, options: [4, 5, 9] },
    { question: 'What number is missing?', sequence: [2, 4, 6, null], answer: 8, options: [7, 8, 10] }
  ],
  numComparison: [
    { q: 'Which number is bigger?', val1: 5, val2: 3, answer: 5 },
    { q: 'Which number is smaller?', val1: 2, val2: 8, answer: 2 },
    { q: 'Which number is bigger?', val1: 7, val2: 9, answer: 9 }
  ],
  numberWords: [
    { digit: 1, word: 'One', prompt: 'cartoon number one with happy eyes and a smile' },
    { digit: 2, word: 'Two', prompt: 'cartoon number two with happy eyes and a smile' },
    { digit: 3, word: 'Three', prompt: 'cartoon number three with happy eyes and a smile' }
  ],
  numberBonds: [
    { target: 5, part1: 2, part2: 3 },
    { target: 5, part1: 4, part2: 1 },
    { target: 4, part1: 2, part2: 2 }
  ],
  addition: [
    { val1: 2, val2: 3, prompt: 'five cute cartoon apples arranged in a row', icon: 'fa-face-smile', theme: 'apples' },
    { val1: 3, val2: 1, prompt: 'four cute cartoon stars smiling', icon: 'fa-magic', theme: 'stars' }
  ],
  subtraction: [
    { val1: 5, val2: 2, prompt: 'three cute cartoon fish swimming in a bowl', icon: 'fa-face-smile' },
    { val1: 4, val2: 1, prompt: 'three cute cartoon flowers in the garden', icon: 'fa-face-smile' }
  ],
  tensUnits: [
    { number: 12, tens: 1, units: 2, prompt: 'a bundle of 10 cartoon sticks and 2 single sticks next to it' },
    { number: 25, tens: 2, units: 5, prompt: 'two boxes of 10 cartoon blocks and 5 single blocks next to them' }
  ],
  grouping: [
    { groupSize: 2, theme: 'shoes', totalItems: 6, prompt: 'three groups of two shoes on a bright floor' },
    { groupSize: 3, theme: 'birds', totalItems: 9, prompt: 'three groups of three birds sitting on branches' }
  ],
  time: [
    { hour: 3, phrase: "It is three o'clock" },
    { hour: 9, phrase: "It is nine o'clock" }
  ],
  money: [
    { amount: 5, prompt: 'five golden cartoon coins stacked neatly on a table' },
    { amount: 8, prompt: 'eight cartoon coins spread out on a wooden table' }
  ],
  measurement: {
    weight: [
      {
        q: 'Which one is heavier?',
        items: [
          { prompt: 'a cartoon elephant smiling', size: 'lg', label: 'Elephant' },
          { prompt: 'a cartoon feather floating', size: 'sm', label: 'Feather' }
        ],
        correct: 0
      }
    ],
    height: [
      {
        q: 'Which one is taller?',
        items: [
          { prompt: 'a cartoon giraffe standing tall', size: 'lg', label: 'Giraffe' },
          { prompt: 'a cartoon mouse looking up', size: 'sm', label: 'Mouse' }
        ],
        correct: 0
      }
    ]
  },
  shapes: [
    { name: 'Circle', prompt: 'a happy cartoon circle with googly eyes' },
    { name: 'Square', prompt: 'a happy cartoon square with googly eyes' },
    { name: 'Triangle', prompt: 'a happy cartoon triangle with googly eyes' }
  ],
  spatial: [
    { target: 'bird', prompt: 'a cute yellow cartoon bird sitting above a red wooden birdhouse', position: 'above' as const },
    { target: 'cat', prompt: 'a cute cartoon kitten sitting below a large green leaf', position: 'below' as const }
  ],
  comparisons: [
    {
      q: 'Which one is bigger?',
      items: [
        { prompt: 'a huge cartoon balloon', size: 'lg', label: 'Big Balloon' },
        { prompt: 'a tiny cartoon balloon', size: 'sm', label: 'Small Balloon' }
      ],
      correct: 0
    }
  ],
  patterns: [
    { sequence: ['star', 'circle', 'star', 'circle'], options: ['star', 'circle'], next: 'star' }
  ],
  oneToOne: [
    { name: 'bunnies', itemName: 'carrots', count: 3, character: 'Rabbit', item: 'Carrot' }
  ]
};

export const COUNTING_TASK_DATA = [
  { count: 3, theme: 'apples', prompt: 'three shiny red cartoon apples in a wooden basket' },
  { count: 5, theme: 'dogs', prompt: 'five cute fluffy cartoon puppies playing in a garden' }
];
