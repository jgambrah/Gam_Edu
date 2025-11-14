import type { LucideIcon } from 'lucide-react';

export type UserRole =
  | 'Director'
  | 'Administrator'
  | 'Teacher'
  | 'Accountant'
  | 'Student'
  | 'Parent'
  | 'Librarian'
  | 'Cook';

export const ALL_ROLES: UserRole[] = [
  'Director',
  'Administrator',
  'Teacher',
  'Accountant',
  'Student',
  'Parent',
  'Librarian',
  'Cook',
];

export type NavItem = {
  path: string;
  title: string;
  icon: LucideIcon;
  roles: UserRole[] | 'all';
};
