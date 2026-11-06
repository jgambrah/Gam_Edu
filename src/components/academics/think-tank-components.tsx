'use client';

import { useState, useRef, useEffect } from 'react';
import { generateDebateResponse, evaluateDebateAction } from '@/ai/flows/debate-flow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Swords, Loader2, RefreshCw, Gavel, Star, TrendingUp, AlertCircle, Eye, CheckCircle, Trash2, HelpCircle, ShieldCheck, Sparkles, Lightbulb, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Paradox, DebateTopic } from '@/lib/types';
import type { ParadoxEvaluationResult } from '@/lib/think-tank-evaluator';
import type {
  SubmitThinkTankParadoxResponse,
  LockThinkTankBlueprintResponse,
} from '@/app/actions/think-tank-submit';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useCurrentSchool } from '@/hooks/use-current-school';
import confetti from 'canvas-confetti';

// --- PARADOX CARD ---
export type ParadoxCardProps = {
  paradox: Paradox;

  initialAwardedXp: number;
  isInitiallyLocked: boolean;

  onSubmitParadox: (
    paradoxId: string,
    conclusion: string,
    theory: string
  ) => Promise<SubmitThinkTankParadoxResponse>;

  onRequestBlueprint: (
    paradoxId: string
  ) => Promise<LockThinkTankBlueprintResponse>;

  isStaff?: boolean;
  onDelete?: () => void;
};

export function ParadoxCard({
  paradox,
  initialAwardedXp = 0,
  isInitiallyLocked = false,
  onSubmitParadox,
  onRequestBlueprint,
  onDelete,
  isStaff,
}: ParadoxCardProps) {
  const [userAnswer, setUserAnswer] = useState('');
  const [userTheory, setUserTheory] = useState('');
  const [evaluationResult, setEvaluationResult] = useState<ParadoxEvaluationResult | null>(null);
  const [isServerLocked, setIsServerLocked] = useState(
    Boolean(isInitiallyLocked || initialAwardedXp >= 15)
  );
  const [isBlueprintRevealed, setIsBlueprintRevealed] = useState(false);
  const [revealedBlueprint, setRevealedBlueprint] = useState<{
    answer: string;
    explanation: string;
  } | null>(null);
  const [highestAwardedXp, setHighestAwardedXp] = useState(Math.max(0, initialAwardedXp));
  const [pendingDailyRolloverXp, setPendingDailyRolloverXp] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLockingBlueprint, setIsLockingBlueprint] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    if (initialAwardedXp > highestAwardedXp) {
      setHighestAwardedXp(initialAwardedXp);
    }
    if (isInitiallyLocked || initialAwardedXp >= 15) {
      setIsServerLocked(true);
    }
  }, [initialAwardedXp, isInitiallyLocked, highestAwardedXp]);

  const isLocked = isServerLocked || highestAwardedXp >= 15;

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || isLocked || isSubmitting || isLockingBlueprint) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      const result = await onSubmitParadox(
        paradox.id,
        userAnswer,
        userTheory
      );

      if (result.evaluation) {
        setEvaluationResult(result.evaluation);
      }

      if (typeof result.totalParadoxXp === 'number') {
        setHighestAwardedXp(result.totalParadoxXp);
      }

      setPendingDailyRolloverXp(
        result.masteryAchieved && result.fullyCredited === false
          ? Number(result.pendingXp ?? 0)
          : 0
      );

      if (result.isBlueprintLocked || result.isCompleted) {
        setIsServerLocked(true);
      }

      if (result.blueprint) {
        setRevealedBlueprint(result.blueprint);
        setIsBlueprintRevealed(true);
      }

      if (
        (result.evaluation?.tier === 'Mastered' || result.masteryAchieved) &&
        (result.awarded ?? 0) > 0
      ) {
        confetti({ particleCount: 100, spread: 60, colors: ['#10b981', '#6366f1', '#a855f7'] });
      }
    } catch (err: any) {
      setActionError(
        err?.message || 'Unable to submit paradox response. No XP was awarded.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevise = () => {
    if (isLocked || isSubmitting || isLockingBlueprint) return;
    setEvaluationResult(null);
    setActionError(null);
  };

  const handleRevealBlueprint = async () => {
    if (!paradox.id || isLockingBlueprint || isSubmitting) return;

    setIsLockingBlueprint(true);
    setActionError(null);

    try {
      const result = await onRequestBlueprint(paradox.id);
      if (!result.success || !result.locked || !result.blueprint) {
        throw new Error(result.error || 'Unable to unlock blueprint.');
      }
      setIsServerLocked(true);
      setRevealedBlueprint(result.blueprint);
      setIsBlueprintRevealed(true);
    } catch (err: any) {
      setActionError(err?.message || 'Unable to unlock blueprint.');
    } finally {
      setIsLockingBlueprint(false);
    }
  };

  return (
    <Card className="border border-slate-900 bg-slate-950/80 backdrop-blur-md rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-300">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="relative z-10 border-b border-slate-900 pb-4">
        <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-indigo-400 animate-pulse" /> Daily Paradox
              </CardTitle>
              <CardDescription className="text-slate-400 mt-1">Challenge your mind with lateral logic rules.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">{paradox.difficulty || 'General'}</Badge>
                {highestAwardedXp > 0 && (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold">
                    +{highestAwardedXp}/15 XP
                  </Badge>
                )}
                {isStaff && onDelete && (
                    <Button variant="ghost" size="sm" onClick={onDelete} className="text-rose-400 hover:text-rose-350 hover:bg-slate-900/60 rounded-xl"><Trash2 className="h-4 w-4" /></Button>
                )}
            </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6 relative z-10">
        <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="absolute left-2 top-2 text-slate-800 font-serif text-6xl opacity-20 pointer-events-none">“</div>
            <p className="text-md sm:text-lg font-serif leading-relaxed text-slate-100 text-center italic relative z-10">
              "{paradox.question}"
            </p>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Your Conclusion</label>
              <Input 
                  placeholder="State your main conclusion..." 
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    if (evaluationResult && !isLocked) setEvaluationResult(null);
                    if (actionError) setActionError(null);
                  }}
                  disabled={isLocked || isSubmitting || isLockingBlueprint}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl h-11 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-slate-500">Supporting Theory (Recommended for Full Mastery)</label>
              <Input 
                  placeholder="Explain why your conclusion holds under the rules..." 
                  value={userTheory}
                  onChange={(e) => {
                    setUserTheory(e.target.value);
                    if (evaluationResult && !isLocked) setEvaluationResult(null);
                    if (actionError) setActionError(null);
                  }}
                  disabled={isLocked || isSubmitting || isLockingBlueprint}
                  className="bg-slate-900 border-slate-800 text-white rounded-xl h-11 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {!isLocked && (
                <Button 
                  onClick={handleEvaluate} 
                  disabled={!userAnswer.trim() || isSubmitting || isLockingBlueprint} 
                  className="w-full h-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/10 active:scale-95 text-sm flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Evaluating Reasoning...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Evaluate Reasoning
                      </>
                    )}
                </Button>
            )}

            {actionError && (
              <Alert className="bg-rose-950/30 border-rose-500/40 rounded-2xl p-4 shadow-inner">
                <AlertCircle className="h-4 w-4 text-rose-400" />
                <AlertTitle className="text-rose-400 font-bold text-xs">
                  Action Could Not Complete
                </AlertTitle>
                <AlertDescription className="text-slate-300 text-xs mt-1">
                  {actionError}
                </AlertDescription>
              </Alert>
            )}

            {evaluationResult && (
                <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                    <Alert
                      className={
                        evaluationResult.tier === 'Mastered'
                          ? 'bg-emerald-950/25 border-emerald-500/30 rounded-2xl p-5 shadow-inner'
                          : evaluationResult.tier === 'Partially Correct'
                          ? 'bg-amber-950/25 border-amber-500/30 rounded-2xl p-5 shadow-inner'
                          : evaluationResult.tier === 'Uncertain'
                          ? 'bg-indigo-950/25 border-indigo-500/30 rounded-2xl p-5 shadow-inner'
                          : 'bg-rose-950/25 border-rose-500/30 rounded-2xl p-5 shadow-inner'
                      }
                    >
                        {evaluationResult.tier === 'Mastered' ? (
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        ) : evaluationResult.tier === 'Partially Correct' || evaluationResult.tier === 'Uncertain' ? (
                          <Lightbulb className="h-5 w-5 text-amber-400" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-rose-400" />
                        )}
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <AlertTitle
                            className={
                              evaluationResult.tier === 'Mastered'
                                ? 'text-emerald-400 font-bold text-sm tracking-tight'
                                : evaluationResult.tier === 'Partially Correct'
                                ? 'text-amber-400 font-bold text-sm tracking-tight'
                                : evaluationResult.tier === 'Uncertain'
                                ? 'text-indigo-300 font-bold text-sm tracking-tight'
                                : 'text-rose-400 font-bold text-sm tracking-tight'
                            }
                          >
                            {evaluationResult.headline}
                          </AlertTitle>
                          <Badge
                            variant="outline"
                            className={
                              evaluationResult.tier === 'Mastered'
                                ? 'border-emerald-500/30 text-emerald-300 text-[10px]'
                                : evaluationResult.tier === 'Partially Correct'
                                ? 'border-amber-500/30 text-amber-300 text-[10px]'
                                : evaluationResult.tier === 'Uncertain'
                                ? 'border-indigo-500/30 text-indigo-300 text-[10px]'
                                : 'border-rose-500/30 text-rose-300 text-[10px]'
                            }
                          >
                            {evaluationResult.tier} • {highestAwardedXp}/{evaluationResult.maxXp} XP Credited
                          </Badge>
                        </div>
                        <AlertDescription className="text-slate-300 mt-2 space-y-2.5">
                          <p className="text-xs leading-relaxed text-slate-200">{evaluationResult.feedback}</p>
                          {pendingDailyRolloverXp > 0 && (
                            <p className="text-xs text-amber-300 font-semibold">
                              You demonstrated full mastery! Because of the 1,000 daily self-XP cap, {highestAwardedXp}/{evaluationResult.maxXp} XP has been credited so far and the remaining +{pendingDailyRolloverXp} XP stays eligible after the daily reset.
                            </p>
                          )}
                          {evaluationResult.coachingHint && evaluationResult.tier !== 'Mastered' && (
                            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-indigo-200 flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                              <span><strong>Coaching Hint:</strong> {evaluationResult.coachingHint}</span>
                            </div>
                          )}
                          {!isLocked && !isBlueprintRevealed && (
                            <div className="flex flex-wrap items-center gap-2 pt-2">
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={handleRevise}
                                disabled={isSubmitting || isLockingBlueprint}
                                className="border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-200 rounded-xl text-xs h-8"
                              >
                                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Revise My Reasoning
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={handleRevealBlueprint}
                                disabled={isSubmitting || isLockingBlueprint}
                                className="text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl text-xs h-8"
                              >
                                {isLockingBlueprint ? (
                                  <>
                                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Locking Blueprint...
                                  </>
                                ) : (
                                  <>
                                    <Eye className="h-3.5 w-3.5 mr-1.5" /> Study Logic Blueprint (Locks Revisions)
                                  </>
                                )}
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                    </Alert>
                </div>
            )}

            {isLocked && !isBlueprintRevealed && !isStaff && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRevealBlueprint}
                disabled={isLockingBlueprint || isSubmitting}
                className="w-full border-indigo-500/30 bg-slate-900/60 hover:bg-slate-900 text-indigo-300 rounded-xl h-10 text-xs"
              >
                {isLockingBlueprint ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Loading Official Blueprint...
                  </>
                ) : (
                  <>
                    <Eye className="h-3.5 w-3.5 mr-1.5" /> View Official Logic Blueprint
                  </>
                )}
              </Button>
            )}

            {isBlueprintRevealed && revealedBlueprint && (
              <Alert className="bg-slate-900/80 border-indigo-500/25 rounded-2xl p-5 shadow-inner animate-in slide-in-from-bottom duration-300">
                  <ShieldCheck className="h-5 w-5 text-indigo-400" />
                  <AlertTitle className="text-indigo-300 font-bold text-sm tracking-tight">
                    Revealed Logic Blueprint {highestAwardedXp >= 15 ? '• Mastered' : '• Revisions Locked'}
                  </AlertTitle>
                  <AlertDescription className="text-slate-300 mt-2 space-y-2">
                    <p className="font-semibold text-white">Canonical Answer: <span className="text-emerald-300">{revealedBlueprint.answer}</span></p>
                    <p className="text-xs leading-relaxed text-slate-400">{revealedBlueprint.explanation}</p>
                  </AlertDescription>
              </Alert>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

// --- DEBATE ARENA (Interactive Pane) ---
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

export function DebateArena({ topic, onSolve }: { topic: DebateTopic; onSolve?: (points: number, id: string) => void }) {
    const { schoolId } = useCurrentSchool();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: `Welcome to the debate! The motion is: "${topic.topic}". \n\nI will represent the opposing view. Are you For or Against this motion? State your stance to begin!` }
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
                lastMessage: input,
                schoolId: schoolId || ''
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

    const { toast } = useToast();

    const handleConclude = async () => {
        if (messages.length < 3) return;

        setIsJudging(true);
        try {
            const historyForAi = messages.map(m => ({ 
                role: m.role, 
                text: m.text 
            }));
            
            const result = await evaluateDebateAction(historyForAi, schoolId || '');
            
            if (result.success && result.data) {
                setEvaluation(result.data);
                confetti({ particleCount: 150, spread: 80, colors: ['#eab308', '#a855f7'] });
                
                const awardedPoints = Math.max(30, Number(result.data.logicScore || 30) + 10);
                if (onSolve) {
                    onSolve(awardedPoints, topic.id || `debate-${Date.now()}`);
                }

                toast({
                    title: "Debate Gavel Judged! ⚔️",
                    description: `+${awardedPoints} Logic XP saved to your profile! STEM Pioneer badge evaluated.`
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsJudging(false);
        }
    };

    const handleReset = () => {
        setMessages([{ role: 'model', text: `Welcome to the debate! The motion is: "${topic.topic}". \n\nI will represent the opposing view. Are you For or Against this motion? State your stance to begin!` }]);
        setInput('');
        setEvaluation(null);
    };

    return (
        <Card className="h-[650px] flex flex-col bg-slate-950 border border-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <CardHeader className="bg-slate-900/60 backdrop-blur-md border-b border-slate-900 py-4 px-6 shrink-0 relative z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-xl">
                            <Swords className="h-5 w-5 text-indigo-400" />
                        </div>
                        <div>
                            <CardTitle className="text-md font-black text-white">Interactive Debate Arena</CardTitle>
                            <CardDescription className="line-clamp-1 max-w-sm sm:max-w-md text-xs text-slate-400 mt-0.5" title={topic.topic}>
                                Motion: {topic.topic}
                            </CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleConclude} 
                            disabled={messages.length < 3 || isJudging || isLoading}
                            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20 rounded-xl h-9 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95"
                        >
                            {isJudging ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Gavel className="h-4.5 w-4.5" />}
                            Judge Performance
                        </Button>
                        
                        <Button variant="ghost" size="icon" onClick={handleReset} className="text-slate-400 hover:text-white rounded-xl h-9 w-9 bg-slate-900 hover:bg-slate-850" title="Reset Stance">
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-0 overflow-hidden flex flex-col bg-slate-950/20 relative z-10">
                <ScrollArea className="flex-grow p-4 md:p-6 bg-slate-950/40">
                    <div className="space-y-4">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'model' && (
                                    <div className="w-8.5 h-8.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-5 w-5 text-indigo-400"/>
                                    </div>
                                )}
                                <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-md ${
                                    msg.role === 'user' 
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-tr-none border border-indigo-400/25' 
                                    : 'bg-slate-900 border border-slate-850 text-slate-200 rounded-tl-none'
                                }`}>
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8.5 h-8.5 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                                        <User className="h-5 w-5 text-slate-300"/>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 items-center text-slate-500 text-xs ml-12 animate-pulse">
                                <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                                Opponent is typing argument...
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                <div className="p-4 bg-slate-950 border-t border-slate-900 flex gap-2 shrink-0">
                    <Input 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="State your claim or rebuttal arguments here..."
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading || isJudging}
                        className="bg-slate-900 border-slate-800 text-white rounded-xl h-11 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim() || isJudging} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl h-11 w-11 shrink-0 shadow-lg shadow-indigo-500/10">
                        <Send className="h-4.5 w-4.5"/>
                    </Button>
                </div>
            </CardContent>

            {evaluation && (
                <Dialog open={!!evaluation} onOpenChange={() => setEvaluation(null)}>
                    <DialogContent className="max-w-md bg-slate-950 border border-slate-900 text-slate-100 rounded-3xl shadow-2xl p-6">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-xl font-black text-white">
                                <Star className="h-6 w-6 text-yellow-500 fill-yellow-500 animate-bounce"/> Debate Scorecard
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">The logic judge has evaluated your presentation.</DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-300"><span>Logic & Reasoning</span><span className="text-indigo-400">{evaluation.logicScore}/10</span></div>
                                    <Progress value={evaluation.logicScore * 10} className="h-2 bg-slate-900" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-300"><span>Clarity</span><span className="text-purple-400">{evaluation.clarityScore}/10</span></div>
                                    <Progress value={evaluation.clarityScore * 10} className="h-2 bg-slate-900" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-slate-300"><span>Rebuttal Skills</span><span className="text-pink-400">{evaluation.rebuttalScore}/10</span></div>
                                    <Progress value={evaluation.rebuttalScore * 10} className="h-2 bg-slate-900" />
                                </div>
                            </div>

                            <div className="bg-slate-900/60 border border-slate-850 p-4.5 rounded-2xl space-y-3 shadow-inner">
                                <div className="flex gap-2.5 text-xs leading-relaxed">
                                    <TrendingUp className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5"/>
                                    <div><span className="font-extrabold text-emerald-400 uppercase tracking-wider text-[9px] block">Key Strength</span> <span className="text-slate-250">{evaluation.keyStrength}</span></div>
                                </div>
                                <div className="flex gap-2.5 text-xs leading-relaxed pt-2 border-t border-slate-850">
                                    <AlertCircle className="h-4.5 w-4.5 text-amber-400 shrink-0 mt-0.5"/>
                                    <div><span className="font-extrabold text-amber-400 uppercase tracking-wider text-[9px] block">Area For Improvement</span> <span className="text-slate-300">{evaluation.areaForImprovement}</span></div>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-2.5 italic border-t border-slate-850/50 pt-2 leading-relaxed font-serif">"{evaluation.feedback}"</p>
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button onClick={() => setEvaluation(null)} variant="outline" className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850 hover:text-white rounded-xl">Close Scorecard</Button>
                            <Button onClick={handleReset} className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg">New Stance</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </Card>
    );
}
