'use client';

import React, { useState, useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHome: () => void;
  showHome: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, onHome, showHome }) => {
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // This function will check for the key when the component mounts.
    const checkKey = async () => {
      // @ts-ignore - aistudio is an external object available in the execution environment
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        // @ts-ignore
        const result = await window.aistudio.hasSelectedApiKey();
        setHasKey(result);
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // We assume the key selection is successful and update the UI.
      setHasKey(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onHome}>
            <div className="w-12 h-12 bg-pink-500 rounded-2xl flex items-center justify-center text-white text-2xl rotate-3 shadow-md">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Nursery<span className="text-pink-500">Bloom</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={handleSelectKey}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all text-sm ${hasKey ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600 animate-pulse border-2 border-orange-200'}`}
              title="Select your API Key to enable sounds and videos"
            >
              <i className={`fas ${hasKey ? 'fa-key' : 'fa-triangle-exclamation'}`}></i>
              {hasKey ? 'Key Ready' : 'Setup Key'}
            </button>

            {showHome && (
              <button 
                onClick={onHome}
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold transition-colors text-sm"
              >
                <i className="fas fa-house"></i> Home
              </button>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-grow p-4 md:p-8">
        {children}
      </main>

      <footer className="bg-white border-t p-6 text-center text-gray-400 font-medium">
        <p>© 2024 Nursery Bloom Education • Play. Learn. Grow.</p>
        <p className="text-[10px] mt-2">Sounds and videos require an API Key with available quota.</p>
      </footer>
    </div>
  );
};

export default Layout;
