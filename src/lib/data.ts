
import type { NavItem, Bus, Route } from '@/lib/types';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  CalendarCheck,
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
  ScanFace,
  FilePen,
  UserCheck as UserCheckIcon,
  Plane,
  Star,
  Landmark,
  Boxes,
  Route as RouteIcon,
  BookCopy,
} from 'lucide-react';

export const navItems: NavItem[] = [
  {
    path: '/dashboard',
    title: 'Dashboard',
    icon: LayoutDashboard,
    roles: 'all',
  },
  {
    path: '/dashboard/admissions',
    title: 'Admissions',
    icon: FilePen,
    roles: ['Director', 'Administrator'],
  },
  {
    path: '/dashboard/staff',
    title: 'Staff',
    icon: UserPlus,
    roles: ['Director', 'Administrator'],
    subItems: [
        {
            path: '/dashboard/staff',
            title: 'Staff Management',
            icon: UserPlus,
            roles: ['Director', 'Administrator'],
        },
        {
            path: '/dashboard/staff/performance',
            title: 'Performance Reviews',
            icon: Star,
            roles: ['Director', 'Administrator'],
        },
    ]
  },
  {
    path: '/dashboard/students',
    title: 'Students',
    icon: Users,
    roles: ['Director', 'Administrator'],
  },
    {
    path: '/dashboard/alumni',
    title: 'Alumni',
    icon: UserCheckIcon,
    roles: ['Director', 'Administrator'],
  },
  {
    path: '/dashboard/parents',
    title: 'Parents',
    icon: HeartHandshake,
    roles: ['Director', 'Administrator'],
  },
  {
    path: '/dashboard/student-registration',
    title: 'Apply for Admission',
    icon: FilePen,
    roles: ['Parent'],
  },
  {
    path: '/dashboard/academics',
    title: 'Classes',
    icon: BookOpen,
    roles: ['Director', 'Administrator', 'Teacher'],
  },
  {
    path: '/dashboard/subjects',
    title: 'Subjects',
    icon: BookCopy,
    roles: ['Director', 'Administrator'],
  },
  {
    path: '/dashboard/lesson-planning',
    title: 'Lesson Planning',
    icon: ClipboardList,
    roles: ['Director', 'Administrator', 'Teacher'],
  },
  {
    path: '/dashboard/leave-management',
    title: 'Leave Management',
    icon: Plane,
    roles: ['Director', 'Administrator', 'Teacher', 'Accountant', 'Librarian', 'Cook'],
  },
  {
    path: '/dashboard/resources',
    title: 'Resources',
    icon: BookOpen,
    roles: 'all',
  },
  {
    path: '/dashboard/assessments',
    title: 'Assessments',
    icon: ClipboardCheck,
    roles: ['Director', 'Administrator', 'Teacher'],
  },
  {
    path: '/dashboard/assignments',
    title: 'Assignments',
    icon: BookMarked,
    roles: ['Director', 'Administrator', 'Teacher', 'Student'],
  },
  {
    path: '/dashboard/timetable',
    title: 'Timetable',
    icon: CalendarDays,
    roles: ['Student', 'Teacher', 'Administrator', 'Director'],
  },
  {
    path: '/dashboard/communication',
    title: 'Communication',
    icon: MessageSquare,
    roles: 'all',
  },
  {
    path: '/dashboard/attendance/face-recognition',
    title: 'Attendance Kiosk',
    icon: ScanFace,
    roles: ['Director', 'Administrator', 'Teacher'],
  },
  {
    path: '/dashboard/grades',
    title: 'Gradebook',
    icon: GraduationCap,
    roles: ['Teacher', 'Administrator', 'Director'],
  },
   {
    path: '/dashboard/report-cards',
    title: 'Report Cards',
    icon: FileText,
    roles: ['Teacher', 'Administrator', 'Director'],
  },
  {
    path: '/dashboard/inventory',
    title: 'Inventory',
    icon: Boxes,
    roles: ['Administrator', 'Director'],
  },
  {
    path: '/dashboard/transport',
    title: 'Transport',
    icon: RouteIcon,
    roles: ['Administrator', 'Director', 'Transport Staff'],
  },
  {
    path: '/dashboard/accounts',
    title: 'Accounts',
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
        path: '/dashboard/accounts/payables',
        title: 'Accounts Payable',
        icon: Landmark,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/vendors',
        title: 'Vendors',
        icon: Users,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/general-ledger',
        title: 'General Ledger',
        icon: BookOpen,
        roles: ['Director', 'Administrator', 'Accountant'],
      },
      {
        path: '/dashboard/accounts/chart-of-accounts',
        title: 'Chart of Accounts',
        icon: BookMarked,
        roles: ['Director', 'Administrator', 'Accountant'],
      }
    ]
  },
  {
    path: '/dashboard/library',
    title: 'Library',
    icon: Library,
    roles: ['Librarian', 'Student', 'Teacher', 'Administrator', 'Director'],
  },
  {
    path: '/dashboard/payroll',
    title: 'Payroll',
    icon: Landmark,
    roles: ['Director', 'Administrator', 'Accountant'],
    subItems: [
        {
            path: '/dashboard/payroll',
            title: 'Run Payroll',
            icon: Landmark,
            roles: ['Director', 'Administrator', 'Accountant'],
        },
        {
            path: '/dashboard/payroll/staff-config',
            title: 'Staff Config',
            icon: Users,
            roles: ['Director', 'Administrator', 'Accountant'],
        },
        {
            path: '/dashboard/payroll/settings',
            title: 'Settings',
            icon: FileText,
            roles: ['Director', 'Administrator', 'Accountant'],
        },
    ]
  },
  {
    path: '/dashboard/my-payslips',
    title: 'My Payslips',
    icon: FileText,
    roles: ['Teacher', 'Accountant', 'Librarian', 'Cook', 'Director', 'Administrator'],
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

export const MOCK_CHART_OF_ACCOUNTS = [
    { accountId: '1010', name: 'Cash at Bank', type: 'Asset', isControlAccount: false, parentAccountId: '1000' },
    { accountId: '1200', name: 'Accounts Receivable', type: 'Asset', isControlAccount: true },
    { accountId: '2100', name: 'Accounts Payable', type: 'Liability', isControlAccount: true },
    { accountId: '4000', name: 'Operating Revenue', type: 'Revenue', isControlAccount: true },
    { accountId: '4010', name: 'Tuition Fees', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
    { accountId: '4020', name: 'Library Fines', type: 'Revenue', isControlAccount: false, parentAccountId: '4000' },
    { accountId: '5000', name: 'Operating Expenses', type: 'Expense', isControlAccount: true },
    { accountId: '5010', name: 'Salaries Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '5020', name: 'Utilities Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '5030', name: 'Maintenance Expense', type: 'Expense', isControlAccount: false, parentAccountId: '5000' },
    { accountId: '1000', name: 'Current Assets', type: 'Asset', isControlAccount: true },
];

export const MOCK_JOURNAL_ENTRIES = [
    { id: 1, ref: 'INV-001', date: '2024-07-15', description: 'Billed John Doe for Fall Term', debits: [{ accountId: '1200', amount: 5000 }], credits: [{ accountId: '4010', amount: 5000 }] },
    { id: 2, ref: 'PAY-001', date: '2024-08-01', description: 'Received tuition payment from John Doe', debits: [{ accountId: '1010', amount: 5000 }], credits: [{ accountId: '1200', amount: 5000 }] },
    { id: 3, ref: 'BILL-001', date: '2024-08-05', description: 'Electricity bill for July', debits: [{ accountId: '5020', amount: 800 }], credits: [{ accountId: '2100', amount: 800 }] },
    { id: 4, ref: 'PAY-002', date: '2024-08-10', description: 'Paid electricity bill', debits: [{ accountId: '2100', amount: 800 }], credits: [{ accountId: '1010', amount: 800 }] },
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

    

    