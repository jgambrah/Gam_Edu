// src/app/page.tsx
'use client';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

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
      <h1 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '20px' }}>SYSTEM ONLINE</h1>
      <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Files verified. Routing established.</p>
      <button 
        onClick={() => router.push('/dashboard/senior-academy')}
        style={{ 
          padding: '15px 40px', 
          background: '#4C97FF', 
          border: 'none', 
          borderRadius: '12px', 
          color: 'white', 
          fontWeight: 'bold', 
          cursor: 'pointer' 
        }}
      >
        OPEN SENIOR ACADEMY
      </button>
    </div>
  );
}
