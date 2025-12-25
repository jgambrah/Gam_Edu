// src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  // This forces the blank URL to go to your dashboard immediately
  // This will "bring back" the sidebar and the shell
  redirect('/dashboard/senior-academy');
}
