
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

const EarlyYearsLayout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  
  const handleHome = () => {
      router.push('/dashboard/early-years');
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
};

export default EarlyYearsLayout;
