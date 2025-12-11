'use client';

import { useState, useRef, useEffect } from 'react';
import { generateDebateResponse } from '@/ai/flows/debate-flow'; // Import the new action
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Swords, Loader2, RefreshCw, Eye, CheckCircle, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Paradox, DebateTopic } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

// --- PARADOX CARD ---
interface ParadoxCardProps {
  paradox: Paradox;
  onComplete: () => void;
  onAttempt?: (answer: string) => void; // <--- NEW PROP
  onDelete?: () => void;
  isStaff?: boolean;
}

export function ParadoxCard({ paradox, onComplete, onAttempt, onDelete, isStaff }: ParadoxCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const handleReveal = () => {
    setIsRevealed(true);
    if (onAttempt && userAnswer) {
        onAttempt(userAnswer); // Save to DB
    }
    onComplete();
  };

  return (
    <Card className="border-t-4 border-t-indigo-500 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-slate-800">Daily Challenge</CardTitle>
            {isStaff && onDelete && (
                <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
            )}
        </div>
        <div className="flex gap-2 mt-2">
            <Badge variant="outline">{paradox.difficulty || 'General'}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* The Riddle/Question */}
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-lg font-medium leading-relaxed text-slate-800">{paradox.question}</p>
        </div>
        {/* Answer Section */}
        <div className="space-y-3">
            <Input 
                placeholder="Type your answer here..." 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={isRevealed}
                className="bg-white"
            />
            {!isRevealed ? (
                <Button onClick={handleReveal} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                    <Eye className="mr-2 h-4 w-4" /> Submit & Reveal Answer
                </Button>
            ) : (
                <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800 font-bold">Answer: {paradox.answer}</AlertTitle>
                    <AlertDescription className="text-green-700 mt-1">{paradox.explanation}</AlertDescription>
                </Alert>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- DEBATE ARENA (Now Interactive) ---
export function DebateArena({ topic }: { topic: DebateTopic }) {
    const [messages, setMessages] = useState<{ role: 'user' | 'model'; content: string }[]>([
        { role: 'model', content: `The motion is: "${topic.topic}". \n\nI am ready to debate. Are you For or Against this motion?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        // 1. Add User Message
        const userMsg = { role: 'user' as const, content: input };
        const newHistory = [...messages, userMsg];
        
        setMessages(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            // 2. Prepare History for AI
            const historyForAi = newHistory.map(m => ({ role: m.role, content: m.content }));
            
            const lastMessage = historyForAi[historyForAi.length -1];

            // 3. Call Server Action
            const result = await generateDebateResponse({
                topic: topic.topic,
                history: historyForAi.slice(0, -1),
                lastMessage: lastMessage.content
            });

            // 4. Add AI Response
            if (result.success && result.text) {
                setMessages(prev => [...prev, { role: 'model', content: result.text }]);
            } else {
                 throw new Error(result.error || "The AI failed to generate a response.");
            }

        } catch (error: any) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'AI Opponent Error',
                description: error.message || 'Could not get a response from the AI.',
            });
             setMessages(prev => [...prev, { role: 'model', content: "My apologies, I seem to have lost my train of thought. Could you rephrase your argument?" }]);

        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setMessages([{ role: 'model', content: `The motion is: "${topic.topic}". \n\nI am ready to debate. Are you For or Against this motion?` }]);
        setInput('');
    };

    return (
        <Card className="h-[600px] flex flex-col border-indigo-200 shadow-md">
            <CardHeader className="bg-slate-50 border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-indigo-800">
                            <Swords className="h-5 w-5"/> Debate Arena
                        </CardTitle>
                        <CardDescription className="line-clamp-1 max-w-md" title={topic.topic}>
                            Topic: {topic.topic}
                        </CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleReset} title="Restart Debate">
                        <RefreshCw className="h-4 w-4 text-slate-500"/>
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-5 w-5 text-indigo-600"/>
                                    </div>
                                )}
                                
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${
                                    msg.role === 'user' 
                                    ? 'bg-indigo-600 text-white rounded-br-none' 
                                    : 'bg-white border text-slate-700 rounded-bl-none shadow-sm'
                                }`}>
                                    {msg.content}
                                </div>

                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                                        <User className="h-5 w-5 text-slate-600"/>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 items-center text-slate-400 text-sm ml-12">
                                <Loader2 className="h-4 w-4 animate-spin"/> Opponent is thinking...
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 bg-white border-t mt-auto flex gap-2">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your argument..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="bg-indigo-600 hover:bg-indigo-700">
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}