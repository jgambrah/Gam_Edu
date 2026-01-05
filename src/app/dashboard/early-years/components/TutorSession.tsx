
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, Bot, User, Volume2, ShieldAlert } from 'lucide-react';
import { generateTTSAction } from '@/ai/flows/junior-actions';
import { playRawPcm, getAudioContext } from '../services/audio';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { chatWithAiTutor } from '@/ai/flows/ai-tutor-flow';

// Types
type MessageRole = 'user' | 'model';
interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

const LiveTutor: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  
  // State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  const [lastUserTranscript, setLastUserTranscript] = useState("");

  const recognitionRef = useRef<any>(null); // SpeechRecognition instance
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // --- 1. GREETING ON SESSION START ---
  const startSession = useCallback(async () => {
    setSessionActive(true);
    const welcomeText = `Hello ${user?.displayName?.split(' ')[0] || 'friend'}! I'm Mr. Bloom, your AI Tutor. What amazing thing do you want to learn about today?`;
    
    setMessages([{ role: 'model', content: welcomeText, timestamp: Date.now() }]);
    
    setIsAiSpeaking(true);
    try {
        const result = await generateTTSAction({ text: welcomeText, voice: 'Puck' });
        if (result.success && result.data) {
            audioSourceRef.current = await playRawPcm(result.data);
            if(audioSourceRef.current) {
                audioSourceRef.current.onended = () => setIsAiSpeaking(false);
            } else {
                 setIsAiSpeaking(false);
            }
        } else {
            throw new Error(result.error || "Audio generation failed.");
        }
    } catch(e: any) {
        toast({ variant: "destructive", title: "Tutor Voice Error", description: e.message });
        setIsAiSpeaking(false);
    }
  }, [user, toast]);

  // --- 2. SPEECH RECOGNITION LOGIC ---
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Browser Not Supported", description: "Please use Google Chrome for voice features." });
      return;
    }

    recognitionRef.current = new (window as any).webkitSpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.interimResults = false;
    recognitionRef.current.start();
    
    setIsListening(true);

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLastUserTranscript(transcript);
      const userMessage: ChatMessage = { role: 'user', content: transcript, timestamp: Date.now() };
      setMessages(prev => [...prev, userMessage]);
      // Trigger AI response after recognition is successful
      triggerAiResponse([...messages, userMessage]);
    };

    recognitionRef.current.onend = () => setIsListening(false);
    recognitionRef.current.onerror = (event: any) => {
        toast({ variant: 'destructive', title: 'Mic Error', description: event.error });
        setIsListening(false);
    };
  };

  // --- 3. AI RESPONSE LOGIC ---
  const triggerAiResponse = async (currentHistory: ChatMessage[]) => {
      setIsAiThinking(true);
      
      const historyForApi = currentHistory.slice(-10).map(m => ({ 
          role: m.role, 
          content: m.content
      }));
      const lastMessage = historyForApi.pop();

      try {
          const response = await chatWithAiTutor({
              history: historyForApi,
              message: lastMessage?.content || ""
          });

          if (response.success) {
              const aiText = response.text;
              setMessages(prev => [...prev, { role: 'model', content: aiText, timestamp: Date.now() }]);
              
              // Speak the AI's response
              setIsAiSpeaking(true);
              const ttsResult = await generateTTSAction({ text: aiText, voice: 'Puck' });
              if (ttsResult.success && ttsResult.data) {
                  audioSourceRef.current = await playRawPcm(ttsResult.data);
                  if(audioSourceRef.current) {
                      audioSourceRef.current.onended = () => setIsAiSpeaking(false);
                  } else {
                      setIsAiSpeaking(false);
                  }
              } else {
                   setIsAiSpeaking(false);
                   throw new Error(ttsResult.error);
              }
          } else {
               throw new Error(response.error);
          }
      } catch (error: any) {
          console.error("AI Response Error:", error);
          toast({ variant: "destructive", title: "AI Tutor Error", description: "I couldn't think of a response. Please try again." });
      } finally {
          setIsAiThinking(false);
      }
  };


  if (!sessionActive) {
      return (
          <div className="text-center p-12">
              <Button onClick={startSession} size="lg" className="h-16 text-xl rounded-2xl bg-blue-600 hover:bg-blue-700">
                  <Bot className="mr-3 h-6 w-6"/> Start Live Tutor Session
              </Button>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full items-center text-center p-6 space-y-6">
        {/* Main Mic Button */}
        <button 
            onClick={handleListen} 
            disabled={isAiSpeaking || isAiThinking}
            className={cn(
                "h-48 w-48 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 border-[16px]",
                isListening ? "bg-red-500 border-red-100 animate-pulse scale-105" : 
                isAiSpeaking || isAiThinking ? "bg-slate-300 border-slate-100 cursor-not-allowed" : 
                "bg-blue-600 hover:bg-blue-700 border-blue-100 hover:scale-105"
            )}
        >
            {isAiSpeaking || isAiThinking ? (
                <Loader2 className="h-16 w-16 text-white animate-spin"/>
            ) : (
                <Mic className="h-20 w-20 text-white"/>
            )}
        </button>

        {/* Status Text */}
        <div className="h-12 flex items-center justify-center">
            <p className="text-xl font-bold text-slate-700">
                {isListening ? "I'm listening..." : isAiSpeaking ? "Mr. Bloom is talking..." : isAiThinking ? "Mr. Bloom is thinking..." : "Tap the mic and speak"}
            </p>
        </div>

        {/* Transcript/Message */}
        <div className="w-full max-w-lg p-4 bg-slate-50 rounded-xl border min-h-[60px] text-center">
            {messages.length > 0 && (
                <p className={`italic text-lg ${messages[messages.length-1].role === 'user' ? 'text-blue-700' : 'text-slate-800'}`}>
                    "{messages[messages.length-1].content}"
                </p>
            )}
        </div>
    </div>
  );
};

export default LiveTutor;
