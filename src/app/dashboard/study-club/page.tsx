'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase'; 
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { generateDrGamResponse } from '@/ai/flows/dr-gam-tutor-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function StudyClubPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (user && !initialized.current) {
      initialized.current = true;
      setMessages([
        {
          role: 'model',
          content: `Hello ${user.displayName?.split(' ')[0] || 'Scholar'}. I am Dr. Gam, your personal AI tutor. What academic subject shall we explore today?`,
        }
      ]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Extra safety checks
    if (!input.trim() || isLoading || !user || !schoolId) {
      if (!schoolId) console.error("Missing SchoolID");
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 2. Format history for Gemini (Gemini expects 'parts' inside each message)
      // This ensures the flow receives exactly what it needs
      const formattedHistory = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const response = await generateDrGamResponse({
          // @ts-ignore - The type will mismatch temporarily until the flow file is also updated
          history: formattedHistory,
          message: input,
          userId: user.uid,
          schoolId: schoolId,
      });

      if (!response || !response.success) {
        throw new Error(response?.text || "The connection timed out. Please try a shorter question.");
      }

      const aiMessage: Message = { role: 'model', content: response.text };
      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error: any) {
        console.error("AI Tutor Error:", error);
        toast({
            variant: "destructive",
            title: "Connection Lost",
            description: error.message || "Dr. Gam is resting. Try again in a moment.",
        });
        
        // Return the text to the input so the user doesn't lose it
        setInput(userMessage.content);
        setMessages(prev => prev.slice(0, -1)); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 p-4 flex items-center gap-4 text-white">
        <div className="bg-indigo-600/50 p-2 rounded-full">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            Dr. Gam AI Tutor <Sparkles className="h-4 w-4 text-yellow-300"/>
          </h2>
          <p className="text-slate-300 text-xs">Your Personal Academic Tutor</p>
        </div>
      </div>

      {/* Chat Area */}
      <ScrollArea className="flex-1 p-4 bg-slate-50">
        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={cn(
                'rounded-lg p-3 max-w-[80%] text-sm leading-relaxed shadow-sm prose prose-sm',
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              )}>
                <p>{msg.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-4 text-slate-400 text-sm ml-14">
              <Loader2 className="w-5 h-5 animate-spin"/>
              <span>AI Tutor is thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-3">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about any subject..."
          className="flex-1 px-4 py-3 h-12 text-base rounded-full border-slate-300 bg-slate-50 focus:bg-white focus-visible:ring-blue-500"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full h-12 w-12 p-0"
        >
          <Send className="w-5 h-5" />
        </Button>
      </form>
    </div>
  );
}
