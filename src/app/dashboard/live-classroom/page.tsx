
'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { decode, decodeAudioData, createBlob } from './services/audio';
import { generateLessonImage } from './services/gemini';
import { saasService } from './services/saas';
import { AI_COSTS } from './types';
import { Button } from '@/components/ui/button';
import { Loader2, X, Bot, Sparkles, Play, ArrowLeft } from 'lucide-react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

const StartScreen: React.FC<{ title: string; icon: React.ElementType; color: string; onStart: () => void }> = ({ title, icon: Icon, color, onStart }) => (
  <div className="w-full bg-white p-12 rounded-[4rem] shadow-2xl border-8 border-black flex flex-col items-center justify-center min-h-[500px] animate-in zoom-in font-black text-center">
    <div className={`w-40 h-40 ${color} text-white rounded-[3rem] flex items-center justify-center text-7xl mb-10 shadow-2xl border-8 border-white animate-bounce`}>
      <Icon className="h-20 w-20" />
    </div>
    <h2 className="text-5xl font-black text-black uppercase tracking-tighter mb-4">{title}</h2>
    <p className="text-xl text-slate-400 font-black uppercase tracking-widest mb-12">Talk to your AI buddy Dr. GAM!</p>
    <Button
      onClick={onStart}
      className="px-16 py-8 bg-black text-white text-3xl font-black rounded-[3rem] shadow-[0_12px_0_0_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest border-4 border-white"
    >
      Wake Dr. GAM! 🚀
    </Button>
  </div>
);

const CloseButton: React.FC<{ onExit: () => void }> = ({ onExit }) => (
  <Button
    onClick={onExit}
    variant="ghost"
    size="icon"
    className="absolute top-6 left-6 w-12 h-12 bg-white border-4 border-black rounded-2xl text-black hover:bg-red-50 hover:text-red-500 transition-colors z-[160] shadow-sm font-black"
  >
    <X className="text-xl" />
  </Button>
);

interface VisualState {
  type: 'concept';
  value: string;
  url?: string;
  id: number;
}

const TutorSession: React.FC = () => {
  const [isModuleStarted, setIsModuleStarted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activeVisual, setActiveVisual] = useState<VisualState | null>(null);
  const [isVisualLoading, setIsVisualLoading] = useState(false);
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef(0);
  const transcriptBufferRef = useRef('');
  const requestIdRef = useRef(0);
  const lastProcessedCommandRef = useRef<string>('');
  const isUserSpeakingRef = useRef(false);

  // --- SAAS & DATA HOOKS ---
  const { schoolId } = useCurrentSchool();
  const firestore = useFirestore();

  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  const { data: schoolData, loading: isLoadingSchool } = useDoc(schoolRef);

  // Initialize SAAS service when school data is available
  useEffect(() => {
    if (schoolId && schoolData && typeof schoolData.aiCredits === 'number') {
      console.log('✅ Initializing SAAS with credits:', schoolData.aiCredits);
      saasService.initialize(schoolId, schoolData.aiCredits);
    }
  }, [schoolId, schoolData]);
  // --- END SAAS & DATA HOOKS ---


  const endSession = () => {
    console.log('🛑 Ending session');
    setIsActive(false); 
    setIsConnecting(false);
    
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current.onaudioprocess = null;
      scriptProcessorRef.current = null;
    }

    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e){}
      sessionRef.current = null;
    }

    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }

    setActiveVisual(null); 
    lastProcessedCommandRef.current = "";
    isUserSpeakingRef.current = false;
  };

  const updateVisualsFromText = async (fullText: string) => {
    const cleanText = fullText.toUpperCase();
    const commands = Array.from(cleanText.matchAll(/SHOW\s+BOARD:\s*([\w\s]+?)(?=[.!?]|$)/gi));
    if (commands.length === 0) return;

    const lastCommand = commands[commands.length - 1][1].trim();
    if (lastCommand === lastProcessedCommandRef.current) return;
    
    lastProcessedCommandRef.current = lastCommand;
    const newId = ++requestIdRef.current;
    setIsVisualLoading(true);

    setActiveVisual({ type: 'concept', value: lastCommand, id: newId });
    try {
      const url = await generateLessonImage(lastCommand);
      if (newId === requestIdRef.current) {
          setActiveVisual(prev => prev ? { ...prev, url: url || undefined } : null);
          setIsVisualLoading(false);
      }
    } catch (e) { 
      console.error('Error generating image:', e);
      setIsVisualLoading(false); 
    }
  };

  const startSession = async () => {
    console.log("--- WAKING UP DR. GAM ---");

    // 1. THE MAGIC KEY: Wake up the Audio Engine
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
      console.log("Audio Engine: AWAKE AND LISTENING");
    }

    // 2. CHECK THE KEY
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      toast({
        variant: "destructive",
        title: "Live Classroom Disabled",
        description: "The NEXT_PUBLIC_GEMINI_API_KEY is not configured. Please contact your administrator.",
        duration: 10000,
      });
      setIsConnecting(false);
      return;
    }

    setIsConnecting(true);
    
    try {
      // CHANGED: Pass apiKey in an options object
      const ai = new GoogleGenAI({ apiKey });
      
      // 3. GET MICROPHONE
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });

      // 4. THE CONNECTION
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.0-flash-exp', 
        callbacks: {
          onopen: () => {
            console.log("DR. GAM IS LIVE!");
            setIsConnecting(false);
            setIsActive(true);
            
            const source = inputAudioContext.createMediaStreamSource(stream);
            const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!sessionRef.current || !isActive) return;
              const inputData = e.inputBuffer.getChannelData(0);
              
              const pcmBlob = createBlob(inputData);
              sessionRef.current.sendRealtimeInput({ media: pcmBlob });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputAudioContext.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            console.log('📨 Full message from Dr. GAM:', message);
            
            const base64 = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            
            console.log('🔊 Audio data present:', !!base64);
            console.log('🔊 Audio data length:', base64?.length || 0);
            console.log('🔊 AudioContext state:', audioContextRef.current?.state);
            
            if (base64 && audioContextRef.current) {
              console.log("🎵 DR. GAM IS SPEAKING...");
              
              try {
                const bytes = decode(base64);
                console.log('✅ Decoded bytes:', bytes.length);
                
                const buffer = await decodeAudioData(bytes, audioContextRef.current, 24000, 1);
                console.log('✅ Audio buffer created. Duration:', buffer.duration, 'seconds');
                console.log('✅ Buffer sample rate:', buffer.sampleRate);
                console.log('✅ Buffer channels:', buffer.numberOfChannels);
                
                const source = audioContextRef.current.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContextRef.current.destination);
                
                const startTime = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
                source.start(startTime);
                nextStartTimeRef.current = startTime + buffer.duration;
                
                console.log('✅ Audio scheduled to play at:', startTime);
                console.log('✅ Current audio time:', audioContextRef.current.currentTime);
                
              } catch (error) {
                console.error('❌ Audio playback error:', error);
              }
            } else {
              if (!base64) console.log('⚠️ No audio data in message');
              if (!audioContextRef.current) console.log('⚠️ AudioContext is null');
            }
          },
          onerror: (err) => {
            console.error("DR. GAM ERROR:", err);
            endSession();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          systemInstruction: { parts: [{ text: "Your name is Dr. GAM. You are a magical nursery teacher. Talk in very simple, friendly English. Start by saying 'Hello! I am Dr. GAM, your AI buddy!'" }] }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error("CRITICAL FAILURE:", err);
      setIsConnecting(false);
      alert("Could not start session. Make sure you allowed Microphone access!");
    }
  };

  if (!isModuleStarted) {
    return <StartScreen title="AI Buddy" icon={Bot} color="bg-[#FFD6A5]" onStart={() => setIsModuleStarted(true)} />;
  }

  return (
    <div className="flex flex-col items-center p-8 md:p-12 bg-white rounded-[4rem] shadow-2xl max-w-7xl mx-auto border-[10px] border-black relative overflow-hidden font-black animate-in zoom-in">
      <CloseButton onExit={() => { endSession(); setIsModuleStarted(false); }} />
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8 font-black">
        <div className="lg:col-span-4 flex flex-col items-center p-8 bg-slate-50 rounded-[3rem] border-4 border-black font-black">
            <div className={`w-40 h-40 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 border-8 transition-all ${isActive ? 'border-teal-400 scale-105 animate-pulse' : 'border-slate-200 grayscale opacity-50'}`}>
                <img src="https://api.dicebear.com/7.x/bottts/svg?seed=DrGAM" alt="Tutor" className="w-32 h-32 rounded-full" />
            </div>
            <h2 className="text-4xl font-black uppercase text-black mb-6 tracking-tighter">Dr. GAM</h2>
            <div className="flex items-center gap-2 mb-6 font-black">
               <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-teal-500 animate-pulse' : isConnecting ? 'bg-yellow-400 animate-bounce' : 'bg-slate-300'}`}></span>
               <span className={`text-[10px] uppercase tracking-widest ${isActive ? 'text-teal-600' : 'text-slate-400'}`}>
                 Class: {isActive ? 'Active' : isConnecting ? 'Connecting' : 'Inactive'}
               </span>
            </div>
            
            {!isActive && !isConnecting && (
              <div className="mb-4 p-2 bg-white rounded text-xs text-slate-500 w-full">
                <div>School ID: {schoolId ? '✅' : '❌'}</div>
                <div>Credits: {schoolData?.aiCredits ?? 'Loading...'}</div>
                <div>SAAS: {saasService.getSession() ? '✅' : '❌'}</div>
              </div>
            )}
            
            {isActive && <Button onClick={endSession} variant="destructive" className="w-full py-4 text-white rounded-2xl font-black uppercase text-sm border-4 border-white shadow-lg transition-transform active:scale-95">End Class</Button>}
        </div>

        <div className="lg:col-span-8">
            <div className="w-full aspect-video bg-white rounded-[3rem] border-[10px] border-slate-100 shadow-2xl flex items-center justify-center relative overflow-hidden font-black">
                {!activeVisual ? (
                    <div className="text-center opacity-10 flex flex-col items-center gap-6 font-black">
                        <Sparkles className="text-[10rem]"/>
                        <p className="font-black text-3xl uppercase tracking-widest font-black">Magic Board</p>
                    </div>
                ) : (
                    <div className="w-full h-full p-8 animate-in zoom-in font-black">
                        {isVisualLoading ? (
                          <div className="flex flex-col items-center justify-center h-full gap-4 font-black">
                             <Loader2 className="animate-spin text-6xl text-slate-200"/>
                             <p className="text-slate-300 uppercase text-xs font-black">Dr. GAM is drawing...</p>
                          </div>
                        ) : activeVisual.url && <img src={activeVisual.url} className="w-full h-full object-cover rounded-[2rem] shadow-xl border-4 border-white" alt="lesson visual" />}
                    </div>
                )}
            </div>
        </div>
      </div>

      {!isActive && !isConnecting && (
        <div className="mt-12 flex flex-col items-center w-full font-black">
           <Button
             onClick={startSession} 
             disabled={isLoadingSchool || !schoolId || !schoolData}
             className="px-20 py-8 bg-black text-white text-3xl font-black rounded-[3rem] shadow-[0_12px_0_0_rgba(0,0,0,0.2)] hover:translate-y-2 active:translate-y-4 active:shadow-none transition-all uppercase tracking-tighter border-8 border-white flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
           >
             <span>{isLoadingSchool ? 'Loading...' : 'Start Session!'}</span>
             <span className="text-xs opacity-40">Entry Cost: 5 Sparks</span>
           </Button>
        </div>
      )}

      {isConnecting && (
        <div className="mt-12 flex flex-col items-center w-full font-black">
           <div className="px-20 py-8 bg-slate-100 text-slate-400 text-3xl font-black rounded-[3rem] uppercase tracking-tighter border-8 border-white flex items-center gap-4">
             <Loader2 className="animate-spin" />
             Waking up Dr. GAM...
           </div>
        </div>
      )}
    </div>
  );
};


export default function LiveClassroomPage() {
    return (
        <div className="p-4 sm:p-6 md:p-8">
            <TutorSession />
        </div>
    )
}

    