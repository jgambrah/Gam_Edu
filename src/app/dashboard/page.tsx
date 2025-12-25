// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation';

export default function DashboardHome() {
  // If someone just clicks "Dashboard", send them to Senior Academy
  redirect('/dashboard/senior-academy');
}
