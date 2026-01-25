
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
    Bot, User, Loader2, Sparkles, Image as ImageIcon, Volume2, 
    Mic, MicOff, Zap, Clock, Shield, School, Wand2, XCircle, Info 
} from 'lucide-react';
import { useUser } from '@/firebase'; 
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { generateDrGamResponse } from '@/ai/flows/dr-gam-tutor-flow';
import { generateLessonImageAction, generateTTSAction } from '@/ai/flows/junior-actions';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VisualState {
  type: 'letter' | 'word' | 'image' | 'number' | 'concept' | 'quiz';
  value: string;
  url?: string;
  id: number;
}

export default function LiveClassroomPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  
  // Session State
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  // AI & Media State
  const [activeVisual, setActiveVisual] = useState<VisualState | null>(null);
  const [isVisualLoading, setIsVisualLoading] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const requestIdRef = useRef(0);
  const lastProcessedCommandRef = useRef<string>('');

  // --- 1. INITIALIZATION ---

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setLastTranscript(transcript);
          handleStudentSpeech(transcript);
        };
        recognitionRef.current.onerror = (event: any) => {
          toast({ variant: 'destructive', title: 'Mic Error', description: `Could not understand audio. (${event.error})` });
          setIsListening(false);
        };
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [toast]);
  
  // Timer for session duration
  useEffect(() => {
    if (isActive) {
      if (!timerIntervalRef.current) {
        timerIntervalRef.current = window.setInterval(() => setSessionSeconds(prev => prev + 1), 1000);
      }
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
    return () => { if (timerIntervalRef.current) clearInterval(timerIntervalRef.current); };
  }, [isActive]);


  // --- 2. CORE AI & MEDIA FUNCTIONS ---

  const playAudio = useCallback(async (text: string) => {
    if (!text || !schoolId) return;
    setIsSpeaking(true);
    try {
        if (audioRef.current) audioRef.current.pause();
        const result = await generateTTSAction({ text, voice: 'Puck', schoolId });
        if (result.success && result.data) {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audioRef.current = audio;
            audio.play();
            audio.onended = () => { setIsSpeaking(false); audioRef.current = null; };
        } else { setIsSpeaking(false); }
    } catch (e) {
        console.error("Audio playback error:", e);
        setIsSpeaking(false);
    }
  }, [schoolId]);

  const updateVisualsFromText = useCallback(async (fullText: string) => {
    const commandMatch = fullText.match(/SHOW BOARD:\s*\[([^\]]+)\]/i);
    if (!commandMatch || !commandMatch[1]) return;

    const commandValue = commandMatch[1].trim();
    if (commandValue.toLowerCase() === lastProcessedCommandRef.current.toLowerCase()) return;
    
    lastProcessedCommandRef.current = commandValue;
    const newId = ++requestIdRef.current;
    setIsVisualLoading(true);

    let detectedValue = commandValue;
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
      if (!schoolId) throw new Error("School ID not found.");
      const result = await generateLessonImageAction({ 
        prompt: `A vibrant, clear, educational 3D illustration for a classroom whiteboard about: ${commandValue}. Clean, simple, nursery style, white background.`, 
        schoolId
      });
      if (newId === requestIdRef.current) {
          setActiveVisual(prev => prev ? { ...prev, url: result.data || undefined } : null);
      }
    } catch (e) { console.error("Image generation failed", e);
    } finally {
      if (newId === requestIdRef.current) setIsVisualLoading(false);
    }
  }, [schoolId]);

  const handleStudentSpeech = async (transcript: string) => {
    if (!transcript.trim() || isAiThinking || !user || !schoolId) return;

    setIsAiThinking(true);
    
    // For simplicity, we manage a short history here
    const history: Message[] = [{ role: 'user', content: transcript }];

    try {
      const response = await generateDrGamResponse({
          history,
          message: transcript,
          userId: user.uid,
          schoolId: schoolId,
      });

      if (!response.success) throw new Error(response.text || "Dr. Gam encountered an error.");

      await playAudio(response.text);
      await updateVisualsFromText(response.text);

    } catch (error: any) {
        toast({ variant: "destructive", title: "AI Error", description: error.message });
    } finally {
      setIsAiThinking(false);
    }
  };


  // --- 3. SESSION MANAGEMENT ---

  const startSession = async () => {
    setIsConnecting(true);
    setSessionSeconds(0);
    lastProcessedCommandRef.current = "";
    setActiveVisual(null);
    
    // Greet the user
    const welcomeText = `Hello ${user?.displayName?.split(' ')[0] || 'Scholar'}. I am Dr. Gam. What amazing topic shall we explore today?`;
    await playAudio(welcomeText);

    setIsActive(true);
    setIsConnecting(false);
  };
  
  const endSession = () => {
    setIsActive(false);
    if (audioRef.current) audioRef.current.pause();
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (audioRef.current) audioRef.current.pause();
      recognitionRef.current?.start();
    }
    setIsListening(!isListening);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- 4. RENDER LOGIC ---

  return (
    <div className="flex flex-col items-center p-4 md:p-10 bg-white rounded-[3rem] shadow-2xl max-w-7xl mx-auto border-[10px] border-black relative overflow-hidden font-sans">
      
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        {/* --- LEFT: TUTOR PROFILE --- */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center p-8 bg-slate-50 rounded-[4rem] border-4 border-black shadow-inner">
            <div className={`relative w-40 h-40 rounded-full bg-white shadow-2xl flex items-center justify-center mb-8 border-8 transition-all duration-500 ${isActive ? 'border-green-400 scale-105 rotate-2' : 'border-slate-200'}`}>
                <img src="https://picsum.photos/seed/drgam/400" alt="Dr. Gam" className="w-32 h-32 rounded-full object-cover" />
                {isActive && (
                  <div className="absolute -bottom-2 -right-2 w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-xl">
                      {isSpeaking ? <Volume2 className="animate-pulse"/> : <Mic />}
                  </div>
                )}
            </div>
            <h2 className="text-4xl font-black text-black uppercase tracking-tighter text-center mb-6">Dr. Gam</h2>
            
            {isActive && (
              <div className="mb-6 px-8 py-3 text-white rounded-full font-mono text-xl shadow-xl border-4 border-white bg-black">
                <Clock className="mr-3 text-yellow-400 inline-block h-5 w-5"/> {formatTime(sessionSeconds)}
              </div>
            )}
            
            {isActive && (
              <Button onClick={endSession} variant="destructive" className="w-full h-12 rounded-2xl font-black uppercase text-xs tracking-widest border-4 border-red-100">
                  Stop Lesson
              </Button>
            )}
        </div>

        {/* --- RIGHT: VISUAL BOARD --- */}
        <div className="lg:col-span-9">
            <div className="w-full aspect-[4/3] bg-white rounded-[5rem] border-[12px] border-slate-100 shadow-2xl flex items-center justify-center relative overflow-hidden group">
                {!activeVisual ? (
                    <div className="text-center opacity-10 flex flex-col items-center gap-8 group-hover:opacity-20 transition-opacity">
                        <Wand2 className="text-[15rem]"/>
                        <p className="font-black text-4xl uppercase tracking-[0.5em]">Board Ready</p>
                    </div>
                ) : (
                    <div className="w-full h-full p-12 animate-in zoom-in duration-500">
                        <div className="w-full h-full rounded-[4rem] bg-slate-50 border-8 border-white shadow-inner flex items-center justify-center overflow-hidden">
                           {isVisualLoading ? <Loader2 className="w-16 h-16 animate-spin text-slate-400" /> : activeVisual.url && <img src={activeVisual.url} className="w-full h-full object-contain p-10 animate-in fade-in duration-1000" alt="lesson visual" />}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* --- BOTTOM: SESSION CONTROLS --- */}
      {!isActive ? (
        <div className="mt-12 flex flex-col items-center w-full">
           <Button 
             onClick={startSession} 
             disabled={isConnecting}
             className="px-24 py-10 bg-black text-white text-4xl md:text-6xl font-black rounded-[3rem] md:rounded-[4rem] shadow-[0_15px_0_0_rgba(0,0,0,0.2)] hover:translate-y-2 active:translate-y-4 active:shadow-none transition-all flex items-center gap-8 uppercase tracking-tighter border-8 border-white mb-16"
           >
             {isConnecting ? <Loader2 className="animate-spin h-12 w-12"/> : 'Start Class!'}
           </Button>
           
           <div className="bg-amber-50 p-12 rounded-[4rem] border-8 border-black shadow-2xl max-w-2xl transform -rotate-1">
              <div className="flex items-center justify-center gap-6 mb-8">
                <Shield className="text-6xl text-amber-500"/>
                <h3 className="text-4xl font-black text-black uppercase tracking-tighter">Learning Zone</h3>
              </div>
              <div className="space-y-6 text-center">
                <p className="text-2xl font-black text-slate-800 leading-tight">
                  Dr. Gam is ready to teach anything!
                </p>
                <div className="bg-white p-6 rounded-3xl border-4 border-amber-200 shadow-inner">
                  <p className="text-xl font-bold text-slate-600 leading-relaxed">
                    Say <span className="text-black underline">"Hello Dr. Gam"</span> to start our lesson. From ABCs and 123s to Science, History, Economics, and Accounting—tell me what you want to learn!
                  </p>
                </div>
              </div>
           </div>
        </div>
      ) : (
        <div className="mt-12 w-full flex flex-col items-center gap-6">
            <p className="text-slate-500 font-bold text-center text-sm max-w-lg">
                Your last recognized words: <span className="text-indigo-600 italic">"{lastTranscript || '...'}"</span>
            </p>
            <Button 
                onClick={toggleListening}
                className={cn("w-32 h-32 rounded-full text-white shadow-2xl border-8 border-white transition-all duration-300 flex flex-col items-center justify-center",
                isListening ? 'bg-red-500 animate-pulse' : 'bg-indigo-600 hover:scale-105',
                isAiThinking || isSpeaking ? 'bg-slate-400 cursor-not-allowed' : '')}
                disabled={isAiThinking || isSpeaking}
            >
                {isListening ? <MicOff className="h-10 w-10"/> : <Mic className="h-10 w-10"/>}
                <span className="text-xs font-black uppercase mt-1">{isListening ? 'Listening...' : 'Speak'}</span>
            </Button>
        </div>
      )}
    </div>
  );
};
