
'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { generateLessonImageAction, generateTTSAction } from '@/ai/flows/junior-actions';
import { 
  Loader2, Mic, StopCircle, Zap, ShieldCheck, 
  MonitorPlay, Volume2, XCircle, Sparkles, Clock, RefreshCw, User
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUser } from '@/firebase';
import { checkAndSpendCredits } from '@/app/actions/credits';

interface VisualState {
  type: 'letter' | 'word' | 'image' | 'number' | 'concept' | 'quiz';
  value: string;
  url?: string;
  id: number;
}

const DrGamTutor: React.FC = () => {
  const { user } = useUser();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [activeVisual, setActiveVisual] = useState<VisualState | null>(null);
  const [lastTranscript, setLastTranscript] = useState('');
  const [isVisualLoading, setIsVisualLoading] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isPaidSession, setIsPaidSession] = useState(false);
  const [showTrialEnd, setShowTrialEnd] = useState(false);
  const [isAiStudioEnv, setIsAiStudioEnv] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const transcriptBufferRef = useRef('');
  const requestIdRef = useRef(0);
  const timerIntervalRef = useRef<number | null>(null);
  const inactivityTimeoutRef = useRef<number | null>(null);
  const totalSessionTimerRef = useRef<number | null>(null);
  const lastActivityTimeRef = useRef<number>(Date.now());
  
  const autoReconnectAttempts = useRef(0);
  const lastProcessedCommandRef = useRef<string>('');

  const INACTIVITY_TIMEOUT = 120000; 

  const endSession = useCallback(() => {
    console.log("🛑 TERMINATING DR. GAM SESSION");
    setIsActive(false); 
    setIsResyncing(false);
    setIsConnecting(false);
    
    if (totalSessionTimerRef.current) clearTimeout(totalSessionTimerRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    if (inactivityTimeoutRef.current) clearTimeout(inactivityTimeoutRef.current);

    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e){}
      sessionRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      micStreamRef.current = null;
    }

    setActiveVisual(null); 
    lastProcessedCommandRef.current = "";
    console.log("🔒 Safety Check: Session and Hardware fully purged.");
  }, []);

  const resetInactivityTimer = useCallback(() => {
    lastActivityTimeRef.current = Date.now();
    if (inactivityTimeoutRef.current) window.clearTimeout(inactivityTimeoutRef.current);
    inactivityTimeoutRef.current = window.setTimeout(() => {
      console.warn("⚠️ Inactivity Limit: Auto-closing Dr. Gam.");
      endSession();
    }, INACTIVITY_TIMEOUT);
  }, [endSession]);

  const handleTrialEnd = useCallback(async () => {
    endSession();
    setShowTrialEnd(true);
    if(schoolId) {
        const result = await generateTTSAction({ text: "Dr. Gam's power cell needs recharging! To continue our advanced session, please connect your Magic Key.", schoolId, voice: 'Algenib' });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audio.play();
        }
    }
  }, [endSession, schoolId]);

  useEffect(() => {
    // @ts-ignore
    setIsAiStudioEnv(!!(window.aistudio && typeof window.aistudio.openSelectKey === 'function'));

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && (isActive || isConnecting)) {
        endSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', endSession);

    if (isActive) {
      resetInactivityTimer();
      timerIntervalRef.current = window.setInterval(() => {
        setSessionSeconds(prev => {
          const next = prev + 1;
          if (isAiStudioEnv && !isPaidSession && next >= 300) {
            handleTrialEnd();
            return prev;
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', endSession);
      endSession();
    };
  }, [isActive, isPaidSession, isAiStudioEnv, endSession, resetInactivityTimer, handleTrialEnd]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateVisualsFromText = async (fullText: string) => {
    if (!schoolId) return;
    const cleanText = fullText.toUpperCase();
    const commands = Array.from(cleanText.matchAll(/SHOW\s+BOARD:\s*([\w\s]+?)(?=[.!?]|$)/gi));
    if (commands.length === 0) return;

    const lastCommand = commands[commands.length - 1][1].trim();
    if (lastCommand === lastProcessedCommandRef.current) return;
    
    lastProcessedCommandRef.current = lastCommand;
    const newId = ++requestIdRef.current;
    setIsVisualLoading(true);

    let detectedValue = lastCommand;
    let detectedType: VisualState['type'] = 'concept';
    if (detectedValue.includes("QUIZ") || detectedValue.includes("QUESTION")) {
      detectedValue = "QUIZ TIME!"; detectedType = 'quiz';
    } else if (detectedValue.length === 1 && /[A-Z]/.test(detectedValue)) {
      detectedType = 'letter';
    } else if (/^\d+$/.test(detectedValue)) {
      detectedType = 'number';
    }

    setActiveVisual({ type: detectedType, value: detectedValue, id: newId });
    try {
      const result = await generateLessonImageAction({ prompt: `Academic high-quality 3D ${detectedValue}, centered, professional clean style, white background`, schoolId });
      if (result.success && newId === requestIdRef.current) {
          setActiveVisual(prev => prev ? { ...prev, url: result.data || undefined } : null);
          setIsVisualLoading(false);
      }
    } catch (e) { setIsVisualLoading(false); }
  };
  
  const handleUnexpectedClose = useCallback(() => {
    if (isActive && document.visibilityState === 'visible' && autoReconnectAttempts.current < 2) {
      autoReconnectAttempts.current++;
      setTimeout(() => {
        if (isActive && document.visibilityState === 'visible') {
           // startSession(true); // Re-enable if live feature is restored
        }
      }, 5000);
    } else {
      endSession();
    }
  }, [isActive, endSession]);


  const startSession = async (isReconnect = false) => {
    setShowTrialEnd(false);
    if (document.visibilityState === 'hidden') return;
    
    // TEMPORARY FIX: Disable live streaming until SDK is resolved.
    toast({
        title: "Feature In Development",
        description: "Live audio streaming with Dr. Gam is coming soon!",
    });
    return; 
    
    /* 
    // The code below is preserved but won't run due to the return statement above.
    
    setIsConnecting(true);
    
    // METERING LOGIC
    if (!schoolId) {
        toast({ variant: "destructive", title: "Error", description: "School ID not found for credit check." });
        setIsConnecting(false);
        return;
    }
    const creditResult = await checkAndSpendCredits(schoolId, 20);
    if (!creditResult.success) {
        toast({ variant: "destructive", title: "AI Credit Limit Reached", description: creditResult.error });
        setIsConnecting(false);
        return;
    }
    toast({ title: "Live Session Started", description: "20 credits have been deducted." });
    
    // This requires the @google/genai package which is not installed
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const ai = new GoogleGenAI({ apiKey });

    totalSessionTimerRef.current = window.setTimeout(() => {
        console.error("🚨 30-Minute Circuit Breaker Triggered. Safety Shutdown.");
        endSession();
        toast({ title: "Session Timeout", description: "Dr. Gam needs a break! Class closed for safety." });
    }, 1800000); 

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micStreamRef.current = stream;
    const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

    const sessionPromise = ai.live.connect({ ... });
    sessionRef.current = await sessionPromise;
    */
  };

  return (
    <div className="flex flex-col items-center p-6 md:p-12 bg-[#F8FAFC] rounded-[4rem] shadow-2xl max-w-7xl mx-auto border-[12px] border-slate-900 relative overflow-hidden font-black selection:bg-indigo-100">
      
      {showTrialEnd && (
        <div className="absolute inset-0 z-[150] bg-slate-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center animate-in zoom-in">
           <Zap className="w-24 h-24 text-yellow-400 mb-8 animate-bounce" />
           <h2 className="text-5xl font-black text-white uppercase tracking-tighter mb-4">Lecture Interrupted</h2>
           <p className="text-xl text-slate-400 max-w-xl mb-10">Dr. Gam's temporary connection has ended. Connect your Magic Key to continue this session.</p>
           <Button className="bg-yellow-400 text-slate-900 h-16 px-10 rounded-2xl text-xl font-black shadow-xl" onClick={endSession}>Reset Session</Button>
        </div>
      )}

      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-10 bg-white rounded-[4rem] border-4 border-slate-900 shadow-xl">
            <div className={`relative w-44 h-44 rounded-full bg-slate-50 flex items-center justify-center mb-8 border-8 transition-all duration-500 ${isActive ? 'border-indigo-500 scale-105' : 'border-slate-200'}`}>
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=DrGam" alt="Dr. Gam" className="w-36 h-36 rounded-full object-cover" />
                {isActive && <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-white shadow-xl animate-pulse"><Mic className="w-8 h-8" /></div>}
            </div>
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter text-center mb-6">Dr. Gam</h2>
            
            {isActive && (
              <div className="mb-8 px-6 py-2 bg-slate-900 text-white rounded-2xl font-mono text-lg flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" /> {formatTime(sessionSeconds)}
              </div>
            )}
            
            {isActive ? (
              <Button onClick={endSession} className="w-full h-14 bg-red-50 text-red-600 rounded-3xl font-black uppercase text-xs hover:bg-red-600 hover:text-white border-4 border-red-50">Stop Lecture</Button>
            ) : (
                <Badge variant="outline" className="text-slate-400 uppercase font-black tracking-widest text-[10px]">Awaiting Instruction</Badge>
            )}
        </div>

        <div className="lg:col-span-9">
            <div className="w-full aspect-[16/10] bg-slate-900 rounded-[5rem] border-[16px] border-slate-800 shadow-inner flex items-center justify-center relative overflow-hidden group">
                {!activeVisual ? (
                    <div className="text-center opacity-10 flex flex-col items-center gap-8 group-hover:opacity-20 transition-opacity">
                        <MonitorPlay className="w-48 h-48" />
                        <p className="font-black text-3xl uppercase tracking-[0.4em]">Visual Board Offline</p>
                    </div>
                ) : (
                    <div className="w-full h-full p-16 animate-in zoom-in duration-500">
                        <div className="w-full h-full rounded-[4rem] bg-white shadow-2xl flex items-center justify-center overflow-hidden border-[12px] border-slate-700">
                           {isVisualLoading ? (
                             <div className="flex flex-col items-center gap-4">
                               <Loader2 className="w-20 h-20 animate-spin text-slate-300" />
                               <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">Preparing Visual...</span>
                             </div>
                           ) : activeVisual.url && (
                             <img src={activeVisual.url} className="w-full h-full object-cover p-10 animate-in fade-in duration-700" alt="visual aid" />
                           )}
                        </div>
                    </div>
                )}
                <div className="absolute top-8 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-800 rounded-full border border-slate-700">
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em]">Dr. Gam Digital Board</span>
                </div>
            </div>
        </div>
      </div>
      
      {!isActive && (
        <div className="mt-16 flex flex-col items-center w-full animate-in slide-in-from-bottom-10 duration-700">
           <button 
             onClick={() => startSession(false)} 
             disabled={isConnecting}
             className="px-24 py-12 bg-slate-900 text-white text-5xl font-black rounded-[4rem] shadow-[0_15px_0_0_#000] hover:translate-y-1 active:translate-y-4 active:shadow-none transition-all flex items-center gap-6 uppercase tracking-tighter border-8 border-white mb-16"
           >
             {isConnecting ? <><Loader2 className="animate-spin w-12 h-12"/> Awakening...</> : 'Enter Classroom'}
           </button>
           
           <div className="bg-indigo-50 p-12 rounded-[4rem] border-8 border-indigo-100 shadow-xl max-w-3xl transform rotate-1">
              <div className="flex items-center justify-center gap-6 mb-8">
                <ShieldCheck className="w-12 h-12 text-indigo-600" />
                <h3 className="text-4xl font-black text-indigo-900 uppercase tracking-tighter">Academic Mastery</h3>
              </div>
              <div className="space-y-6 text-center">
                <p className="text-2xl font-black text-slate-800 leading-tight">
                  Dr. Gam is ready for a professional deep-dive.
                </p>
                <div className="bg-white p-8 rounded-[2.5rem] border-4 border-indigo-200 shadow-inner">
                  <p className="text-xl font-bold text-slate-600 leading-relaxed">
                    Say <span className="text-indigo-600 underline">"Good morning, Dr. Gam"</span> to begin. Mention any topic—Accounting, Science, or Literature—and I will visualize the concepts on the digital board for you.
                  </p>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default DrGamTutor;
