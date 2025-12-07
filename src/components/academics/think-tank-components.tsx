'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Eye, CheckCircle, Trash2, MessageSquare, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Paradox, DebateTopic } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

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
export function DebateArena({ topic, onSend }: { topic: DebateTopic, onSend?: (msg: string) => void }) {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<{role: 'user'|'ai', content: string}[]>([]);

    const handleSend = () => {
        if(!input.trim()) return;
        const newMsg = { role: 'user' as const, content: input };
        setMessages([...messages, newMsg]);
        if(onSend) onSend(input); // Save to DB
        setInput('');
        
        // Simulate AI response (Placeholder until backend connected)
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'ai', content: "That's an interesting point! Consider this perspective..." }]);
        }, 1000);
    };

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="border-b bg-slate-50">
                <CardTitle>{topic.topic}</CardTitle>
                <p className="text-sm text-muted-foreground">{topic.context}</p>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden">
                <ScrollArea className="h-full p-4">
                    {messages.length === 0 && <div className="text-center text-slate-400 mt-20">Start the debate by stating your stance!</div>}
                    <div className="space-y-4">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-100 text-slate-800 rounded-bl-none'}`}>
                                    {m.content}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="p-4 border-t">
                <div className="flex w-full gap-2">
                    <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Type your argument..." />
                    <Button onClick={handleSend}><Send className="h-4 w-4"/></Button>
                </div>
            </CardFooter>
        </Card>
    );
}
