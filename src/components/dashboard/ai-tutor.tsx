'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase'; 
import { chatWithAiTutor } from '@/ai/flows/ai-tutor-flow';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';

// Types
type MessageRole = 'user' | 'model';
interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

export const AITutor: React.FC = () => {
  const { user } = useUser();
  const { toast } = useToast();
  // Initial State: Just the greeting.
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // 1. One-time Greeting
  useEffect(() => {
    if (user && !initialized.current) {
      initialized.current = true;
      setMessages([
        {
          role: 'model',
          content: `Hello ${user.displayName?.split(' ')[0] || 'Scholar'}! 👋 I'm your AI Tutor. I can help with any subject—Math, Science, English, you name it. What are we tackling today?`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    if (!user?.uid) {
        toast({ title: "Error", description: "You must be logged in to use the tutor.", variant: 'destructive' });
        return;
    }

    const userText = inputText;
    setInputText('');
    setIsLoading(true);

    const userMsg: ChatMessage = {
      role: 'user',
      content: userText,
      timestamp: Date.now()
    };
    
    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);

    try {
      const historyForApi = currentHistory.slice(-50).map(m => ({ 
          role: m.role, 
          content: m.content
      }));

      const lastMessage = historyForApi.pop(); 
      
      const response = await chatWithAiTutor({
        history: historyForApi,
        message: lastMessage?.content || userText,
        userId: user.uid,
      });

      if (!response.success) {
        throw new Error(response.text || "AI tutor failed to respond.");
      }

      const aiMsg: ChatMessage = {
        role: 'model',
        content: response.text,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMsg]);
      
    } catch (error: any) {
        console.error("Chat error", error);
        toast({
            variant: "destructive",
            title: "AI Error",
            description: error.message || "Could not get a response. Check your internet or API key."
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-4 flex items-center gap-3 text-primary-foreground">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            AI Personal Tutor <Sparkles className="h-4 w-4 text-yellow-300"/>
          </h2>
          <p className="text-indigo-100 text-xs">Math • Science • English • History</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
            <Loader2 className="w-4 h-4 animate-spin"/>
            <span>Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="What do you want to learn today?"
          className="flex-1 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputText.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl disabled:opacity-50 transition-colors shadow-sm"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
