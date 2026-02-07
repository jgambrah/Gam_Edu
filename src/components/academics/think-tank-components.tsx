
'use client';

import { useState, useRef, useEffect } from 'react';
import { generateDebateResponse, evaluateDebateAction } from '@/ai/flows/debate-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Swords, Loader2, RefreshCw, Gavel, Star, TrendingUp, AlertCircle, Eye, CheckCircle, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Paradox, DebateTopic } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


// --- PARADOX CARD ---
interface ParadoxCardProps {
  paradox: Paradox;
  onComplete: () => void;
  onAttempt?: (answer: string) => void;
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
        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-lg font-medium leading-relaxed text-slate-800">{paradox.question}</p>
        </div>
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
interface Message {
    role: 'user' | 'model';
    text: string;
}

interface EvaluationResult {
    logicScore: number;
    clarityScore: number;
    rebuttalScore: number;
    feedback: string;
    keyStrength: string;
    areaForImprovement: string;
}

export function DebateArena({ topic }: { topic: DebateTopic }) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `The motion is: "${topic.topic}". \n\nI am ready to debate. Are you For or Against this motion?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isJudging, setIsJudging] = useState(false);
    const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
    
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', text: input };
        const newHistory = [...messages, userMsg];
        
        setMessages(newHistory);
        setInput('');
        setIsLoading(true);

        try {
            const historyForAi = newHistory.map(m => ({ role: m.role, text: m.text }));

            const result = await generateDebateResponse({
                topic: topic.topic,
                history: historyForAi.slice(0, -1),
                lastMessage: input
            });

            if (result.success) {
                setMessages(prev => [...prev, { role: 'model', text: result.text }]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConclude = async () => {
        if (messages.length < 3) {
            alert("Please exchange at least a few arguments before judging.");
            return;
        }

        setIsJudging(true);
        try {
            const historyForAi = messages.map(m => ({ 
                role: m.role, 
                text: m.text 
            }));
            
            const result = await evaluateDebateAction(historyForAi);
            
            if (result.success && result.data) {
                setEvaluation(result.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsJudging(false);
        }
    };

    const handleReset = () => {
        setMessages([{ role: 'model', text: `The motion is: "${topic.topic}". \n\nI am ready to debate. Are you For or Against this motion?` }]);
        setInput('');
        setEvaluation(null);
    };

    return (
        <Card className="h-[650px] flex flex-col border-indigo-200 shadow-md">
            <CardHeader className="bg-slate-50 border-b py-3">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-indigo-800 text-lg">
                            <Swords className="h-5 w-5"/> Debate Arena
                        </CardTitle>
                        <CardDescription className="line-clamp-1 max-w-md text-xs" title={topic.topic}>
                            {topic.topic}
                        </CardDescription>
                    </div>
                    <div className="flex gap-1">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleConclude} 
                            disabled={messages.length < 3 || isJudging || isLoading}
                            className="text-amber-700 border-amber-200 hover:bg-amber-50"
                        >
                            {isJudging ? <Loader2 className="h-4 w-4 animate-spin"/> : <Gavel className="h-4 w-4 mr-2"/>}
                            Conclude & Judge
                        </Button>
                        
                        <Button variant="ghost" size="icon" onClick={handleReset} title="Restart Debate">
                            <RefreshCw className="h-4 w-4 text-slate-500"/>
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4 bg-slate-50/50">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0"><Bot className="h-5 w-5 text-indigo-600"/></div>}
                                <div className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white border text-slate-700 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0"><User className="h-5 w-5 text-slate-600"/></div>}
                            </div>
                        ))}
                        {isLoading && <div className="flex gap-3 items-center text-slate-400 text-sm ml-12"><Loader2 className="h-4 w-4 animate-spin"/> Opponent is thinking...</div>}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 bg-white border-t mt-auto flex gap-2">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your argument..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading || isJudging}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim() || isJudging} className="bg-indigo-600 hover:bg-indigo-700">
                        <Send className="h-4 w-4"/>
                    </Button>
                </div>
            </CardContent>

            {evaluation && (
                <Dialog open={!!evaluation} onOpenChange={() => setEvaluation(null)}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl">
                                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500"/> Debate Scorecard
                            </DialogTitle>
                            <DialogDescription>Here is how the judge rated your performance.</DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-medium"><span>Logic & Reasoning</span><span>{evaluation.logicScore}/10</span></div>
                                    <Progress value={evaluation.logicScore * 10} className="h-2 bg-slate-100" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-medium"><span>Clarity</span><span>{evaluation.clarityScore}/10</span></div>
                                    <Progress value={evaluation.clarityScore * 10} className="h-2 bg-slate-100" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-sm font-medium"><span>Rebuttal Skills</span><span>{evaluation.rebuttalScore}/10</span></div>
                                    <Progress value={evaluation.rebuttalScore * 10} className="h-2 bg-slate-100" />
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border space-y-3">
                                <div className="flex gap-2 text-sm">
                                    <TrendingUp className="h-4 w-4 text-green-600 shrink-0"/>
                                    <div><span className="font-bold text-green-700">Strength:</span> {evaluation.keyStrength}</div>
                                </div>
                                <div className="flex gap-2 text-sm">
                                    <AlertCircle className="h-4 w-4 text-amber-600 shrink-0"/>
                                    <div><span className="font-bold text-amber-700">Improve:</span> {evaluation.areaForImprovement}</div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 italic">"{evaluation.feedback}"</p>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button onClick={() => setEvaluation(null)} variant="outline">Close</Button>
                            <Button onClick={handleReset} className="bg-indigo-600">Start New Debate</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}
