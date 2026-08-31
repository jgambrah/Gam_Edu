'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { campusAssistant } from '@/ai/flows/campus-assistant-flow';
import { useRole } from '@/context/role-context';
import { Bot, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    const userMessage: Message = { role: 'user', content: text };
    
    setMessages((prev) => {
      const updated = [...prev, userMessage];
      
      (async () => {
        try {
          if (schoolId) {
            const result = await checkAndSpendCredits(schoolId, 1);
            if (!result.success) {
              setMessages((current) => [...current, { 
                role: 'model', 
                content: "🚫 " + (result.error || "You are out of AI Credits. Please ask your administrator to upgrade the school's plan.") 
              }]);
              setIsLoading(false);
              return;
            }
          }

          const response = await campusAssistant({
            prompt: text,
            role: role || 'user',
            history: prev,
          });

          const modelMessage: Message = { role: 'model', content: response.response };
          setMessages((current) => [...current, modelMessage]);
        } catch (error) {
          console.error('AI Assistant Error:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not get a response from the AI assistant.',
          });
        } finally {
          setIsLoading(false);
        }
      })();

      return updated;
    });
  };

  const handleSend = async () => {
    const text = input;
    if (!text.trim()) return;
    setInput('');
    await sendMessage(text);
  };

  useEffect(() => {
    const handleOpenChat = (event: Event) => {
      const customEvent = event as CustomEvent<{ prompt: string; autoSend?: boolean }>;
      if (customEvent.detail) {
        const { prompt, autoSend } = customEvent.detail;
        setIsOpen(true);
        if (autoSend) {
          sendMessage(prompt);
        } else {
          setInput(prompt);
        }
      }
    };
    window.addEventListener('open-ai-chat', handleOpenChat as EventListener);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat as EventListener);
  }, [schoolId, role]);

  return (
    <>
      <Button
        className="fixed bottom-20 right-6 h-14 w-14 rounded-full shadow-2xl bg-purple-600 hover:bg-purple-700 z-[150] transition-all duration-300 hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <div className="relative">
            <Bot className="h-8 w-8 text-white" />
            <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full border-2 border-purple-600 animate-pulse" />
        </div>
        <span className="sr-only">Open AI Assistant</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-lg lg:max-w-2xl h-full max-h-[85vh] flex flex-col rounded-[2rem] border-none shadow-2xl p-0 overflow-hidden">
          <DialogHeader className="bg-purple-600 p-6 text-white shrink-0">
            <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                    <Bot className="h-6 w-6" />
                </div>
                <div>
                    <DialogTitle className="text-white text-xl font-black uppercase tracking-tight">GAM Edu Assistant</DialogTitle>
                    <DialogDescription className="text-purple-100 font-medium">
                        How can I help you manage your school today?
                    </DialogDescription>
                </div>
            </div>
          </DialogHeader>
          
          <ScrollArea className="flex-1 px-6 py-4 bg-slate-50/50">
            <div className="space-y-4">
              {messages.length === 0 && (
                  <div className="text-center py-10 space-y-4">
                      <div className="bg-white p-4 rounded-full w-fit mx-auto shadow-sm border border-purple-100">
                        <Bot className="h-8 w-8 text-purple-600" />
                      </div>
                      <p className="text-sm text-slate-500 max-w-[250px] mx-auto leading-relaxed">
                          Ask me about <strong>Lesson Plans</strong>, <strong>Reporting</strong>, or <strong>Billing</strong>. I can even draft announcements for you!
                      </p>
                  </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && (
                    <Avatar className="h-8 w-8 border-2 border-purple-100 shadow-sm shrink-0">
                        <AvatarFallback className="bg-purple-100 text-purple-600 text-[10px] font-bold">AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'rounded-2xl p-4 max-w-[85%] text-sm leading-relaxed shadow-sm',
                      message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 rounded-tl-none border'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Avatar className="h-8 w-8 animate-pulse border-2 border-purple-100 shrink-0">
                    <AvatarFallback className="bg-purple-50 text-purple-400">...</AvatarFallback>
                  </Avatar>
                  <div className="rounded-2xl p-4 bg-white border flex items-center gap-2 text-slate-400 italic text-xs">
                    <Loader2 className="h-3 w-3 animate-spin" /> Assistant is typing...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="p-4 bg-white border-t mt-auto">
            <div className="flex w-full items-center gap-3">
              <Input
                placeholder="Message Dr. GAM..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
                className="h-12 border-2 rounded-xl focus:ring-purple-500"
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="h-12 w-12 rounded-xl bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-200"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}