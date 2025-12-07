'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Lightbulb, Loader2, Send } from 'lucide-react';
import type { Paradox, DebateTopic, DebateMessage } from '@/lib/types';
import { runDebateTurn } from '@/ai/flows/think-tank';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// --- Component 1: ParadoxCard ---

interface ParadoxCardProps {
  paradox: Paradox;
  onComplete: () => void;
}

export function ParadoxCard({ paradox, onComplete }: ParadoxCardProps) {
  const [isRevealed, setIsRevealed] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{paradox.question}</CardTitle>
        <CardDescription>
          Difficulty: {paradox.difficulty} | Read the riddle and type your answer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input placeholder="Your answer..." disabled={isRevealed} />

        {isRevealed ? (
          <Alert variant="default" className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">The Answer</AlertTitle>
            <AlertDescription className="text-green-700 space-y-2">
              <p className="font-bold">{paradox.answer}</p>
              <p>{paradox.explanation}</p>
            </AlertDescription>
          </Alert>
        ) : (
          <Button onClick={() => setIsRevealed(true)}>Reveal Answer</Button>
        )}
      </CardContent>
      {isRevealed && (
        <CardContent>
          <Button onClick={onComplete} className="w-full">
            Mark as Solved & Get New Paradox
          </Button>
        </CardContent>
      )}
    </Card>
  );
}


// --- Component 2: DebateArena ---

interface DebateArenaProps {
    topic: DebateTopic;
}

export function DebateArena({ topic }: DebateArenaProps) {
    const [messages, setMessages] = useState<DebateMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: DebateMessage = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await runDebateTurn({
                topic: topic.topic,
                history: newMessages,
                userArgument: input,
            });

            const aiMessage: DebateMessage = { role: 'ai', content: response.rebuttal };
            setMessages(prev => [...prev, aiMessage]);

            if (response.critique) {
                toast({
                    title: "Debate Tip",
                    description: response.critique,
                });
            }

        } catch (error) {
            console.error('Debate AI Error:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not get a response from the AI.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[70vh] flex flex-col">
            <CardHeader>
                <CardTitle>Debate Arena: {topic.topic}</CardTitle>
                <CardDescription>{topic.context}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden">
                 <ScrollArea className="h-full pr-4">
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                {message.role === 'ai' && <div className="bg-primary text-primary-foreground p-2 rounded-full"><Lightbulb className="h-4 w-4"/></div>}
                                <div className={cn("rounded-lg p-3 max-w-[80%] prose prose-sm", message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                    {message.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex items-start gap-3 justify-start">
                                <div className="bg-primary text-primary-foreground p-2 rounded-full"><Lightbulb className="h-4 w-4"/></div>
                                <div className="rounded-lg p-3 bg-muted flex items-center">
                                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardContent>
                 <div className="flex w-full items-center gap-2 pt-4 border-t">
                    <Textarea
                        placeholder="Your argument..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        disabled={isLoading}
                        rows={2}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
