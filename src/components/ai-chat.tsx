
'use client';

import { useState } from 'react';
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
import { GraduationCap, Bot, Loader2, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await campusAssistant({
        prompt: input,
        role: role || 'user',
        history: messages,
      });

      const modelMessage: Message = { role: 'model', content: response.response };
      setMessages((prev) => [...prev, modelMessage]);
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
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700"
        onClick={() => setIsOpen(true)}
      >
        <Bot className="h-8 w-8" />
        <span className="sr-only">Open AI Assistant</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-lg lg:max-w-2xl grid-rows-[auto_1fr_auto] h-full max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>CampusBot Assistant</DialogTitle>
            <DialogDescription>
              Your AI-powered helper for all things CampusConnect.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow my-4 pr-4 -mr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-3',
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0" />}
                  <div
                    className={cn(
                      'rounded-lg p-3 max-w-[80%]',
                      'prose prose-sm',
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 justify-start">
                  <Bot className="h-6 w-6 text-primary flex-shrink-0" />
                  <div className="rounded-lg p-3 bg-muted flex items-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <div className="flex w-full items-center gap-2">
              <Input
                placeholder="Ask a question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
