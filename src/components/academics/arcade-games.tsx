'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, CheckCircle2, RotateCcw, Swords, ToggleLeft, Cpu, Activity, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';

interface GameProps {
  onSolve: (points: number, id: string) => void;
  targetGroup: string;
}

// ==========================================
// 1. BINARY CODE BREAKER GAME
// ==========================================
export function BinaryCodeBreaker({ onSolve, targetGroup }: GameProps) {
  const isHard = targetGroup.includes('Scholar') || targetGroup.includes('Master');
  const numBits = isHard ? 8 : 4;
  const bitWeights = isHard ? [128, 64, 32, 16, 8, 4, 2, 1] : [8, 4, 2, 1];
  const maxVal = isHard ? 255 : 15;

  const [target, setTarget] = useState(0);
  const [bits, setBits] = useState<number[]>([]);
  const [isSolved, setIsSolved] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const generateNewPuzzle = () => {
    const randomTarget = Math.floor(Math.random() * maxVal) + 1;
    setTarget(randomTarget);
    setBits(new Array(numBits).fill(0));
    setIsSolved(false);
  };

  useEffect(() => {
    generateNewPuzzle();
  }, [targetGroup]);

  const { toast } = useToast();

  const toggleBit = (index: number) => {
    if (isSolved) return;
    const newBits = [...bits];
    newBits[index] = newBits[index] === 1 ? 0 : 1;
    setBits(newBits);

    // Calculate current value
    const currentSum = newBits.reduce((sum, bit, i) => sum + bit * bitWeights[i], 0);
    if (currentSum === target) {
      setIsSolved(true);
      confetti({ particleCount: 80, spread: 50, colors: ['#10b981', '#3b82f6'] });
      toast({
        title: "Binary Target Breached! ⚡",
        description: "+15 XP saved to your profile! STEM Pioneer badge evaluated."
      });
      onSolve(15, `binary-breaker-${target}-${attempts}`);
    }
  };

  const currentSum = bits.reduce((sum, bit, i) => sum + bit * bitWeights[i], 0);

  return (
    <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="border-b border-slate-900 py-4 px-6">
        <CardTitle className="text-white font-black text-md flex items-center gap-2">
          <Cpu className="h-5 w-5 text-emerald-400 animate-pulse" /> Binary Code Breaker
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">Toggle the bits below to match the decimal target number.</CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Target Board */}
        <div className="flex justify-between items-center bg-slate-900/40 p-5 rounded-2xl border border-slate-900">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Target Value</span>
            <span className="text-3xl font-black text-white font-mono">{target}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Current Sum</span>
            <span className={`text-3xl font-black font-mono transition-colors ${currentSum === target ? 'text-emerald-400' : 'text-indigo-400'}`}>{currentSum}</span>
          </div>
        </div>

        {/* Bits Row */}
        <div className="flex flex-wrap gap-3 justify-center">
          {bitWeights.map((weight, idx) => {
            const isActive = bits[idx] === 1;
            return (
              <button
                key={idx}
                onClick={() => toggleBit(idx)}
                className={`w-16 h-20 rounded-2xl border transition-all duration-200 flex flex-col justify-between p-2.5 font-mono group select-none active:scale-95 ${
                  isActive 
                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <span className="text-[9px] uppercase font-bold tracking-wider opacity-60 self-center">2^{numBits - 1 - idx}</span>
                <span className="text-xl font-black self-center">{bits[idx]}</span>
                <span className="text-[9px] font-bold opacity-60 self-center">val: {weight}</span>
              </button>
            );
          })}
        </div>

        {/* Binary string representation */}
        <div className="text-center font-mono text-xs text-slate-500 bg-slate-900/30 py-2 rounded-xl border border-slate-900/50">
          BINARY ARRAY: [ {bits.join(', ')} ]
        </div>

        {isSolved ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 p-4 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Code Breaker Complete! +15 XP Awarded.
            </div>
            <Button onClick={generateNewPuzzle} className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black h-11 rounded-xl shadow-lg active:scale-95 text-xs">
              Load Next Binary Code
            </Button>
          </div>
        ) : (
          <Button onClick={generateNewPuzzle} variant="outline" className="w-full h-11 border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-850 hover:text-white rounded-xl text-xs flex items-center justify-center gap-1">
            <RotateCcw className="h-3.5 w-3.5" /> Skip & Reset Target
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ==========================================
// 2. BOOLEAN GATES GAME
// ==========================================
interface GatePuzzle {
  id: string;
  expression: string;
  correctAnswer: boolean;
  explanation: string;
}

export function generateBooleanPuzzle(isHard: boolean): GatePuzzle {
  const randBool = () => Math.random() > 0.5;
  const randOp = () => (Math.random() > 0.5 ? 'AND' : 'OR');

  if (!isHard) {
    // Easy mode: single operations (AND, OR, NOT)
    const type = Math.floor(Math.random() * 3);
    const a = randBool();
    
    if (type === 0) {
      const b = randBool();
      const ans = a && b;
      return {
        id: `bg-gen-easy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `${a ? 'True' : 'False'} AND ${b ? 'True' : 'False'}`,
        correctAnswer: ans,
        explanation: `An 'AND' gate requires BOTH inputs to be True to yield True. Here, ${a ? 'True' : 'False'} AND ${b ? 'True' : 'False'} evaluates to ${ans ? 'True' : 'False'}.`
      };
    } else if (type === 1) {
      const b = randBool();
      const ans = a || b;
      return {
        id: `bg-gen-easy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `${a ? 'True' : 'False'} OR ${b ? 'True' : 'False'}`,
        correctAnswer: ans,
        explanation: `An 'OR' gate yields True if AT LEAST one input is True. Here, ${a ? 'True' : 'False'} OR ${b ? 'True' : 'False'} evaluates to ${ans ? 'True' : 'False'}.`
      };
    } else {
      const ans = !a;
      return {
        id: `bg-gen-easy-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `NOT ${a ? 'True' : 'False'}`,
        correctAnswer: ans,
        explanation: `A 'NOT' gate inverts the input. So NOT ${a ? 'True' : 'False'} evaluates to ${ans ? 'True' : 'False'}.`
      };
    }
  } else {
    // Hard mode: compound operations
    const type = Math.floor(Math.random() * 5);
    const a = randBool();
    const b = randBool();
    const c = randBool();
    const op1 = randOp();
    const op2 = randOp();

    const evalOp = (x: boolean, y: boolean, op: 'AND' | 'OR') => op === 'AND' ? x && y : x || y;
    
    if (type === 0) {
      // (A OP1 B) OP2 C
      const sub1 = evalOp(a, b, op1);
      const ans = evalOp(sub1, c, op2);
      const strA = a ? 'True' : 'False';
      const strB = b ? 'True' : 'False';
      const strC = c ? 'True' : 'False';
      const strSub1 = sub1 ? 'True' : 'False';
      const strAns = ans ? 'True' : 'False';
      return {
        id: `bg-gen-hard-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `(${strA} ${op1} ${strB}) ${op2} ${strC}`,
        correctAnswer: ans,
        explanation: `First evaluate parentheses: ${strA} ${op1} ${strB} = ${strSub1}. Then: ${strSub1} ${op2} ${strC} = ${strAns}.`
      };
    } else if (type === 1) {
      // NOT (A OP B)
      const sub1 = evalOp(a, b, op1);
      const ans = !sub1;
      const strA = a ? 'True' : 'False';
      const strB = b ? 'True' : 'False';
      const strSub1 = sub1 ? 'True' : 'False';
      const strAns = ans ? 'True' : 'False';
      return {
        id: `bg-gen-hard-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `NOT (${strA} ${op1} ${strB})`,
        correctAnswer: ans,
        explanation: `First evaluate parentheses: ${strA} ${op1} ${strB} = ${strSub1}. Then invert with NOT: NOT ${strSub1} = ${strAns}.`
      };
    } else if (type === 2) {
      // (A OP1 B) AND (NOT C)
      const sub1 = evalOp(a, b, op1);
      const sub2 = !c;
      const ans = sub1 && sub2;
      const strA = a ? 'True' : 'False';
      const strB = b ? 'True' : 'False';
      const strC = c ? 'True' : 'False';
      const strSub1 = sub1 ? 'True' : 'False';
      const strSub2 = sub2 ? 'True' : 'False';
      const strAns = ans ? 'True' : 'False';
      return {
        id: `bg-gen-hard-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `(${strA} ${op1} ${strB}) AND (NOT ${strC})`,
        correctAnswer: ans,
        explanation: `Left parenthesis: ${strA} ${op1} ${strB} = ${strSub1}. Right parenthesis: NOT ${strC} = ${strSub2}. Finally, ${strSub1} AND ${strSub2} = ${strAns}.`
      };
    } else if (type === 3) {
      // NOT (A OP1 B) OP2 C
      const sub1 = evalOp(a, b, op1);
      const notSub1 = !sub1;
      const ans = evalOp(notSub1, c, op2);
      const strA = a ? 'True' : 'False';
      const strB = b ? 'True' : 'False';
      const strC = c ? 'True' : 'False';
      const strSub1 = sub1 ? 'True' : 'False';
      const strNotSub1 = notSub1 ? 'True' : 'False';
      const strAns = ans ? 'True' : 'False';
      return {
        id: `bg-gen-hard-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `NOT (${strA} ${op1} ${strB}) ${op2} ${strC}`,
        correctAnswer: ans,
        explanation: `First evaluate parentheses: ${strA} ${op1} ${strB} = ${strSub1}. Invert with NOT: NOT ${strSub1} = ${strNotSub1}. Then: ${strNotSub1} ${op2} ${strC} = ${strAns}.`
      };
    } else {
      // (A OP1 B) OR (C OP2 D)
      const d = randBool();
      const sub1 = evalOp(a, b, op1);
      const sub2 = evalOp(c, d, op2);
      const ans = sub1 || sub2;
      const strA = a ? 'True' : 'False';
      const strB = b ? 'True' : 'False';
      const strC = c ? 'True' : 'False';
      const strD = d ? 'True' : 'False';
      const strSub1 = sub1 ? 'True' : 'False';
      const strSub2 = sub2 ? 'True' : 'False';
      const strAns = ans ? 'True' : 'False';
      return {
        id: `bg-gen-hard-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        expression: `(${strA} ${op1} ${strB}) OR (${strC} ${op2} ${strD})`,
        correctAnswer: ans,
        explanation: `Left parenthesis: ${strA} ${op1} ${strB} = ${strSub1}. Right parenthesis: ${strC} ${op2} ${strD} = ${strSub2}. Finally, ${strSub1} OR ${strSub2} = ${strAns}.`
      };
    }
  }
}

export function BooleanGates({ onSolve, targetGroup }: GameProps) {
  const isHard = targetGroup.includes('Scholar') || targetGroup.includes('Master');

  const [activePuzzle, setActivePuzzle] = useState<GatePuzzle | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const loadPuzzle = () => {
    setActivePuzzle(generateBooleanPuzzle(isHard));
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    loadPuzzle();
  }, [targetGroup]);

  const { toast } = useToast();

  const handleAnswerSubmit = (ans: boolean) => {
    if (isAnswered || !activePuzzle) return;
    setSelectedAnswer(ans);
    setIsAnswered(true);
    const correct = ans === activePuzzle.correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      confetti({ particleCount: 80, spread: 50, colors: ['#a855f7', '#ec4899'] });
      toast({
        title: "Logic Gate Resolved! 🧠",
        description: "+15 XP saved to your profile! STEM Pioneer badge evaluated."
      });
      onSolve(15, activePuzzle.id);
    }
  };

  if (!activePuzzle) return null;

  return (
    <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="border-b border-slate-900 py-4 px-6">
        <CardTitle className="text-white font-black text-md flex items-center gap-2">
          <ToggleLeft className="h-5 w-5 text-purple-400 animate-pulse" /> Boolean Logic Gates
        </CardTitle>
        <CardDescription className="text-slate-400 text-xs">Evaluate the logical expression and determine the output bit.</CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Logic Board Display */}
        <div className="bg-slate-900/40 p-8 rounded-2xl border border-slate-900 flex flex-col items-center justify-center min-h-[120px] relative">
          <div className="absolute left-3 top-3 text-[8px] font-mono tracking-widest text-slate-600">SCHEMATIC RESOLVER v1.0</div>
          
          <span className="text-xs uppercase font-extrabold tracking-widest text-slate-550 text-slate-500 mb-2">Expression</span>
          <span className="text-lg sm:text-xl font-mono text-white font-black uppercase text-center bg-slate-950 py-3 px-6 border border-slate-850 rounded-xl shadow-inner tracking-wider">
            {activePuzzle.expression}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            onClick={() => handleAnswerSubmit(true)}
            disabled={isAnswered}
            className={`flex-1 h-12 text-sm font-black rounded-xl border transition-all active:scale-95 ${
              isAnswered && activePuzzle.correctAnswer === true
              ? 'bg-emerald-500 text-slate-950 border-emerald-500'
              : isAnswered && selectedAnswer === true && isCorrect === false
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-white'
            }`}
          >
            TRUE (1)
          </Button>

          <Button 
            onClick={() => handleAnswerSubmit(false)}
            disabled={isAnswered}
            className={`flex-1 h-12 text-sm font-black rounded-xl border transition-all active:scale-95 ${
              isAnswered && activePuzzle.correctAnswer === false
              ? 'bg-emerald-500 text-slate-950 border-emerald-500'
              : isAnswered && selectedAnswer === false && isCorrect === false
                ? 'bg-rose-500 text-white border-rose-500'
                : 'bg-slate-900 hover:bg-slate-850 border-slate-800 text-white'
            }`}
          >
            FALSE (0)
          </Button>
        </div>

        {isAnswered && (
          <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
              isCorrect 
              ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300' 
              : 'bg-rose-950/20 border-rose-900/30 text-rose-350'
            }`}>
              <div className="flex items-center gap-1.5 font-bold mb-1">
                {isCorrect ? <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" /> : <Award className="h-4.5 w-4.5 text-rose-400" />}
                {isCorrect ? "Gate Resolved! +15 XP Awarded." : "Resolve Failed"}
              </div>
              <p className="text-slate-400">{activePuzzle.explanation}</p>
            </div>
            
            <Button onClick={loadPuzzle} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-black h-11 rounded-xl shadow-lg active:scale-95 text-xs">
              Load Next Schematic Gate
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
