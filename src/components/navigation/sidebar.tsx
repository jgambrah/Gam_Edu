
'use client';

import { useRouter } from 'next/navigation';
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';

export default function AppSidebar() {
  const router = useRouter();

  const testClick = () => {
    alert('BUTTON CLICKED!');
    console.log('Button was clicked!');
    router.push('/dashboard/students');
  };

  return (
    <>
      <SidebarHeader>
        <div className="p-4 bg-red-500 text-white">
          <h1>TEST SIDEBAR</h1>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="p-4 space-y-4">
          {/* Test 1: Plain button with inline styles */}
          <button
            onClick={testClick}
            style={{
              backgroundColor: 'blue',
              color: 'white',
              padding: '16px',
              width: '100%',
              cursor: 'pointer',
              border: '2px solid yellow',
              zIndex: 99999,
              position: 'relative',
              pointerEvents: 'auto'
            }}
          >
            CLICK ME - Test Button 1
          </button>

          {/* Test 2: Another test button */}
          <button
            onClick={() => {
              alert('Button 2 clicked!');
              window.location.href = '/dashboard/students';
            }}
            className="w-full p-4 bg-green-500 text-white font-bold border-4 border-red-500"
          >
            CLICK ME - Test Button 2
          </button>

          {/* Test 3: Link test */}
          <a 
            href="/dashboard/students"
            className="block w-full p-4 bg-purple-500 text-white text-center font-bold"
          >
            CLICK ME - Test Link
          </a>
        </div>
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-4 bg-green-500 text-white">
          <p>Footer</p>
        </div>
      </SidebarFooter>
    </>
  );
}
