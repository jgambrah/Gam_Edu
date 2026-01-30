
'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useRole } from '@/context/role-context';
import { generateSecureToken } from '@/app/actions/generate-secure-token';
import { useToast } from '@/hooks/use-toast';

const NurseryBloomIframePage: React.FC = () => {
  const [isLaunched, setIsLaunched] = useState(false);
  const [sessionUrl, setSessionUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { user } = useUser();
  const { schoolId } = useCurrentSchool();
  const { profile } = useRole();

  const APP_BASE_URL = "https://nursery-bloom-825774943692.us-west1.run.app";

  const handleLaunch = async () => {
    if (!user || !schoolId || !profile) {
      toast({
        variant: 'destructive',
        title: 'Session Not Ready',
        description: "User, school, or profile information is not yet available. Please wait a moment and try again."
      });
      return;
    }

    try {
      const secureToken = await generateSecureToken(user.uid);
      if (!secureToken) {
        throw new Error("Generated token is empty.");
      }

      const params = new URLSearchParams({
        schoolId: schoolId,
        userId: user.uid,
        userName: profile.firstName || user.displayName || 'Learner',
        licenseType: profile.plan || 'Trial',
        token: secureToken,
      });

      setSessionUrl(`${APP_BASE_URL}?${params.toString()}`);
      setIsLaunched(true);
      setIsLoading(true);

    } catch (error: any) {
      console.error("Launch Error:", error);
      toast({
        variant: 'destructive',
        title: 'Launch Failed',
        description: error.message || 'Could not generate a secure session token.',
      });
    }
  };

  const handleClose = () => {
    setIsLaunched(false);
    setSessionUrl('');
  };

  if (isLaunched) {
    return (
      <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col animate-in fade-in duration-500">
        <div className="bg-white border-b-4 border-slate-200 p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg rotate-3">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div>
              <h3 className="font-black text-slate-800 uppercase text-sm tracking-tighter leading-none mb-1">
                Nursery <span className="text-pink-500">Bloom</span>
              </h3>
              <p className="text-[9px] text-green-600 font-black uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                Secure Session Active
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleClose}
            className="px-6 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-600 font-black rounded-xl transition-all uppercase text-[10px] tracking-widest border-2 border-slate-200 flex items-center gap-2"
          >
            <i className="fas fa-arrow-left"></i>
            Exit to Dashboard
          </button>
        </div>

        <div className="flex-grow relative bg-[#FDFCF0]">
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FDFCF0] z-10">
              <div className="w-16 h-16 border-8 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4"></div>
              <p className="font-black text-pink-500 uppercase tracking-[0.3em] animate-pulse text-xs">Syncing Learning Environment...</p>
            </div>
          )}
          <iframe 
            src={sessionUrl}
            className="w-full h-full border-none"
            title="Nursery Bloom Session"
            onLoad={() => setIsLoading(false)}
            allow="microphone; camera; display-capture; autoplay"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-10 bg-slate-50 min-h-screen flex items-center justify-center">
        <div className="group relative p-8 max-w-sm bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-pink-50 rounded-full group-hover:scale-150 transition-transform duration-700 opacity-50" />
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl flex items-center justify-center text-white text-3xl mb-6 shadow-lg rotate-3 group-hover:rotate-12 transition-transform border-4 border-white">
              <i className="fas fa-magic"></i>
            </div>

            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">
              Nursery <span className="text-pink-500">Bloom</span>
            </h3>
            <p className="text-slate-400 text-sm font-bold leading-relaxed mb-8">
              Interactive AI learning suite. Click to launch the experience inside this window.
            </p>

            <button 
              onClick={handleLaunch}
              className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-pink-600 transition-all uppercase text-xs tracking-[0.2em] shadow-lg active:scale-95"
            >
              <i className="fas fa-play text-xs"></i>
              Launch Inside App
            </button>
          </div>
        </div>
    </div>
  );
};

export default NurseryBloomIframePage;
