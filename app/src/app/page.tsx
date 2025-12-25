// src/app/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // This ensures the redirect happens only on the client-side after the page has loaded
    router.push('/dashboard/senior-academy');
  }, [router]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0f172a', 
      color: 'white' 
    }}>
      <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '20px' }}>SYSTEM ONLINE</h1>
      <p style={{ color: '#94a3b8' }}>Redirecting to dashboard...</p>
    </div>
  );
}
