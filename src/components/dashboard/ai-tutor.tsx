'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useUser } from '@/firebase'; // To personalize greeting
import { chatWithAiTutor } from '@/ai/flows/ai-tutor-flow'; // Import the Server Action

// Types
type MessageRole = 'user' | 'model';
interface ChatMessage {
  role: MessageRole;
  content: string;
  timestamp: number;
}

export const AITutor: React.FC = () => {
  const { user } = useUser();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize greeting once user loads
  useEffect(() => {
    if (user && messages.length === 0) {
      setMessages([
        {
          role: 'model',
          content: `Hello ${user.displayName || 'Scholar'}! 👋 I'm your AI Tutor. What subject are we tackling today?`,
          timestamp: Date.now()
        }
      ]);
    }
  }, [user, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    // 1. Add User Message
    const userMsg: ChatMessage = {
      role: 'user',
      content: inputText,
      timestamp: Date.now()
    };
    
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // 2. Call Server Action
      // Convert history to simple format for API
      const historyForApi = messages.map(m => ({ role: m.role, content: m.content }));
      
      const response = await chatWithAiTutor({
        history: historyForApi,
        message: userMsg.content
      });

      // 3. Add AI Response
      if (response.success) {
        const aiMsg: ChatMessage = {
          role: 'model',
          text: response.text,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error(response.text);
      }
      
    } catch (error) {
      console.error("Chat error", error);
      const errorMsg: ChatMessage = {
        role: 'model',
        text: 'Sorry, I ran into an issue. Please try again.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev.slice(0, -1), errorMsg]);
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
          <p className="text-indigo-100 text-xs">Always here to help you learn</p>
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
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12 animate-pulse">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
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
          placeholder="Ask a question or request an explanation..."
          className="flex-1 px-4 py-3 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        />
        <button 
          type="submit" 
          disabled={isLoading || !inputText.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin"/> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
};
