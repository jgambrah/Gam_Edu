'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { chatWithAiTutor } from '@/ai/flows/ai-tutor-flow';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export default function StudyClubPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Map current message state to the required format for the AI flow
      const historyForAI = messages.map(m => ({
          role: m.role,
          text: m.content, // The AI flow expects 'text' not 'content'
      }));

      const response = await chatWithAiTutor({
        history: historyForAI,
        message: input,
      });

      if (response.success) {
        const modelMessage: Message = { role: 'model', content: response.text };
        setMessages((prev) => [...prev, modelMessage]);
      } else {
        throw new Error(response.text);
      }
    } catch (error: any) {
      console.error('AI Tutor Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Could not get a response from the AI Tutor.',
      });
      // OPTIONAL: remove the user's message if the call fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-start p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="text-primary"/> AI Study Buddy
          </CardTitle>
          <CardDescription>
            Your personal AI tutor. Ask questions about any academic subject.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <ScrollArea className="h-full" ref={scrollAreaRef}>
            <div className="p-6 space-y-6">
                {messages.length === 0 && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>Ask a question to get started!</p>
                        <p className="text-xs">e.g., "Explain photosynthesis" or "Help me with a math problem"</p>
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
                    {message.role === 'model' && <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />}
                    <div
                        className={cn(
                        'rounded-lg p-3 max-w-[85%] text-sm shadow-sm',
                        'prose prose-sm prose-p:my-2',
                        message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                    >
                        {message.content}
                    </div>
                     {message.role === 'user' && <User className="h-6 w-6 text-muted-foreground flex-shrink-0 mt-1" />}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3 justify-start">
                    <Bot className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div className="rounded-lg p-3 bg-muted flex items-center">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                    </div>
                )}
            </div>
          </ScrollArea>
        </CardContent>
        <div className="p-4 border-t">
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
        </div>
      </Card>
    </div>
  );
}
