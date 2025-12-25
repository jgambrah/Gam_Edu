
// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function RootPage() {
  // This automatically moves the user from "/" to the main dashboard
  redirect('/dashboard/senior-academy');
}
