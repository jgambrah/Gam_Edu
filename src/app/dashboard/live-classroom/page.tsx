
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useUser } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, User as UserIcon, Loader2, Sparkles, Send, Volume2, Image as ImageIcon } from 'lucide-react';
import { generateDrGamResponse } from '@/ai/flows/dr-gam-tutor-flow';
import { generateLessonImageAction, generateTTSAction } from '@/ai/flows/junior-actions';
import { useCurrentSchool } from '@/hooks/use-current-school';
import confetti from 'canvas-confetti';

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface VisualState {
  type: 'concept' | 'image';
  value: string;
  url?: string;
  id: number;
}

export default function DrGamTutorPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeVisual, setActiveVisual] = useState<VisualState | null>(null);
  const [isVisualLoading, setIsVisualLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestIdRef = useRef(0);
  const hasStarted = useRef(false);

  // Initial greeting
  useEffect(() => {
    if (user && !hasStarted.current) {
      hasStarted.current = true;
      const initialMessage = `Hello ${user.displayName?.split(' ')[0] || 'Scholar'}. I am Dr. Gam, your personal AI tutor. What academic subject shall we explore today?`;
      setMessages([{ role: 'model', content: initialMessage }]);
      playAudio(initialMessage);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const playAudio = async (text: string) => {
    if (!text || !schoolId) return;
    try {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const result = await generateTTSAction({ text, voice: 'Puck', schoolId });
        if (result.success && result.data && typeof window !== 'undefined') {
            const audio = new Audio(`data:audio/wav;base64,${result.data}`);
            audioRef.current = audio;
            audio.play();
        }
    } catch (e) {
        console.error("Audio playback error:", e);
    }
  };

  const updateVisualsFromText = async (fullText: string) => {
    const commandMatch = fullText.match(/SHOW BOARD:\s*\[([^\]]+)\]/i);
    if (!commandMatch || !commandMatch[1]) return;
  
    const commandValue = commandMatch[1].trim();
    const newId = ++requestIdRef.current;
  
    setIsVisualLoading(true);
    setActiveVisual({ type: 'concept', value: commandValue, id: newId });
  
    try {
      if (!schoolId) {
        throw new Error("School ID is not available for image generation.");
      }
      const url = await generateLessonImageAction({ 
        prompt: `A vibrant, clear, educational illustration for a classroom whiteboard about: ${commandValue}. Clean, simple, 3D nursery style, white background.`, 
        schoolId: schoolId
      });
      if (newId === requestIdRef.current) { // Ensure we're updating the right visual
        setActiveVisual(prev => prev ? { ...prev, url: url.data || undefined } : null);
      }
    } catch (e) {
      console.error("Image generation failed", e);
    } finally {
      if (newId === requestIdRef.current) {
        setIsVisualLoading(false);
      }
    }
  };


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !user || !schoolId) return;

    const userMessage: Message = { role: 'user', content: input };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    const messageHistory = currentMessages.slice(-10); // Keep context reasonable
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateDrGamResponse({
          history: messageHistory,
          message: input,
          userId: user.uid,
          schoolId: schoolId,
      });

      if (!response.success) {
        throw new Error(response.text || "The AI tutor encountered an error.");
      }

      const aiMessage: Message = { role: 'model', content: response.text };
      setMessages(prev => [...prev, aiMessage]);
      await playAudio(response.text);
      await updateVisualsFromText(response.text);

    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "AI Error",
            description: error.message,
        });
        setMessages(prev => prev.slice(0, -1)); // Remove the user message that failed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-900 p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-4">
            <div className="bg-indigo-600/50 p-2 rounded-full">
                <Bot className="w-8 h-8 text-white" />
            </div>
            <div>
                <h2 className="font-bold text-lg flex items-center gap-2">
                    Dr. Gam Audio Tutor <Sparkles className="h-4 w-4 text-yellow-300"/>
                </h2>
                <p className="text-slate-300 text-xs">Your Personal AI Teacher</p>
            </div>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 overflow-hidden">
        {/* Visual Display */}
        <div className="lg:col-span-1 bg-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-white relative">
           <div className="absolute top-3 left-3 bg-black/30 text-white/70 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
             <ImageIcon className="h-3 w-3"/> Visual Board
           </div>
           {isVisualLoading ? (
               <Loader2 className="w-12 h-12 text-slate-500 animate-spin"/>
           ) : activeVisual?.url ? (
               <div className="w-full h-full animate-in fade-in zoom-in-95">
                 <img src={activeVisual.url} alt={activeVisual.value} className="w-full h-full object-contain rounded-lg"/>
                 <p className="text-center text-xs mt-2 font-semibold text-slate-300">{activeVisual.value}</p>
               </div>
           ) : (
                <div className="text-center text-slate-600">
                    <ImageIcon className="h-16 w-16 mx-auto mb-2"/>
                    <p className="font-bold">Whiteboard</p>
                    <p className="text-xs">Images and text will appear here.</p>
                </div>
           )}
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 flex flex-col bg-slate-50 rounded-xl border">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><Bot className="w-4 w-4 text-slate-600"/></div>}
                  <div className={`rounded-lg p-3 max-w-[80%] text-sm leading-relaxed shadow-sm prose prose-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-800 border'}`}>
                    <p>{msg.content}</p>
                  </div>
                  {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"><UserIcon className="w-4 w-4 text-blue-600"/></div>}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 text-slate-400 text-sm ml-12">
                  <Loader2 className="w-5 h-5 animate-spin"/>
                  <span>Dr. Gam is thinking...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question or response..."
              className="flex-1 h-12 text-base rounded-full"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="rounded-full h-12 w-12 p-0 bg-indigo-600 hover:bg-indigo-700">
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
