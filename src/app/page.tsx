import { redirect } from 'next/navigation';

export default function RootPage() {
  // This is the "Traffic Controller"
  // It automatically sends anyone visiting "/" into the Academy
  redirect('/dashboard/senior-academy');
}
