
import type { NavItem } from '@/lib/types';
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
  UserCheck,
  Plane,
  Star,
  Landmark,
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
    icon: UserCheck,
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
    title: 'Academics',
    icon: BookOpen,
    roles: ['Director', 'Administrator', 'Teacher'],
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
    path: '/dashboard/attendance',
    title: 'Attendance',
    icon: CalendarCheck,
    roles: ['Administrator', 'Teacher'],
    subItems: [
        {
            path: '/dashboard/attendance/face-recognition',
            title: 'Face Recognition Kiosk',
            icon: ScanFace,
            roles: ['Administrator', 'Teacher'],
        }
    ]
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
export const MOCK_TERMS = ['Fall', 'Spring', 'Summer'];

export const LEAVE_TYPES = ['Sick Leave', 'Vacation', 'Personal', 'Study Leave', 'Unpaid Leave'] as const;

export const MOCK_PUBLIC_HOLIDAYS = [
    { name: "New Year's Day", date: new Date('2024-01-01') },
    { name: 'Memorial Day', date: new Date('2024-05-27') },
    { name: 'Independence Day', date: new Date('2024-07-04') },
    { name: 'Labor Day', date: new Date('2024-09-02') },
    { name: 'Thanksgiving Day', date: new Date('2024-11-28') },
    { name: 'Christmas Day', date: new Date('2024-12-25') },
];

    