'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, doc, getDoc, setDoc, where, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Gamepad2, PenSquare, LogIn, Youtube, Cpu, ToggleLeft, Loader2, Trophy, HelpCircle, CheckCircle2, ChevronRight, Swords, Sparkles, AlertCircle, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { useCurrentSchool } from '@/hooks/use-current-school';
import type { Student } from '@/lib/types';
import { generateTriviaQuiz } from '@/ai/flows/think-tank';
import { BinaryCodeBreaker, BooleanGates, generateBooleanPuzzle } from '@/components/academics/arcade-games';

const CATEGORIES = ['Python Programming', 'Boolean Logic Gates', 'Math Riddles', 'Deductive Logic'];
const TARGET_GROUPS = ['Novice (Basic 1-3)', 'Apprentice (Basic 4-6)', 'Scholar (JHS)', 'Master (SHS)'];

function generateOfflineTriviaQuiz(category: string, targetGroup: string): any[] {
  const questions: any[] = [];
  const isHard = targetGroup.includes('Scholar') || targetGroup.includes('Master');

  // Shuffle array helper
  const shuffle = <T,>(array: T[]): T[] => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  if (category === 'Python Programming') {
    // 1. String index slicing
    const strWord = ["Python", "JavaScript", "HTML", "Coding", "Arcade", "Boolean"][Math.floor(Math.random() * 6)];
    const index = Math.floor(Math.random() * strWord.length);
    const correctChar = strWord[index];
    const incorrect1 = strWord[(index + 1) % strWord.length];
    const incorrect2 = strWord[(index + 2) % strWord.length];
    const options1 = Array.from(new Set([correctChar, incorrect1, incorrect2, "Error"])).slice(0, 4);
    if (options1.indexOf(correctChar) === -1) options1[0] = correctChar;
    questions.push({
      question: `What is the output of print('${strWord}'[${index}]) in Python?`,
      options: shuffle(options1),
      correctAnswer: correctChar,
      explanation: `Strings in Python are 0-indexed, meaning index ${index} refers to the character at position ${index + 1} which is '${correctChar}'.`
    });

    // 2. Floor division / modulo
    const xVal = [7, 8, 9, 10, 11, 12, 13, 15][Math.floor(Math.random() * 8)];
    const yVal = [2, 3, 4][Math.floor(Math.random() * 3)];
    const isFloorDiv = Math.random() > 0.5;
    if (isFloorDiv) {
      const ans = Math.floor(xVal / yVal);
      const floatAns = (xVal / yVal).toFixed(3);
      const modAns = xVal % yVal;
      const options2 = Array.from(new Set([ans.toString(), floatAns, modAns.toString(), (xVal + yVal).toString()])).slice(0, 4);
      questions.push({
        question: `What is the output of print(${xVal} // ${yVal}) in Python?`,
        options: shuffle(options2),
        correctAnswer: ans.toString(),
        explanation: `The '//' operator performs floor division, returning the largest mathematical integer less than or equal to the division result. ${xVal} // ${yVal} is ${ans}.`
      });
    } else {
      const ans = xVal % yVal;
      const floorAns = Math.floor(xVal / yVal);
      const floatAns = (xVal / yVal).toFixed(3);
      const options2 = Array.from(new Set([ans.toString(), floorAns.toString(), floatAns, (xVal - yVal).toString()])).slice(0, 4);
      questions.push({
        question: `What is the output of print(${xVal} % ${yVal}) in Python?`,
        options: shuffle(options2),
        correctAnswer: ans.toString(),
        explanation: `The '%' operator returns the remainder of the division. ${xVal} divided by ${yVal} leaves a remainder of ${ans}.`
      });
    }

    // 3. Functions
    questions.push({
      question: "Which keyword is used to start defining a function in Python?",
      options: shuffle(["def", "function", "func", "define"]),
      correctAnswer: "def",
      explanation: "In Python, the `def` keyword is used to define functions (short for 'define')."
    });

    // 4. Variables and operations
    const varA = Math.floor(Math.random() * 5) + 2;
    const varB = Math.floor(Math.random() * 4) + 1;
    const isMult = Math.random() > 0.5;
    const ans4 = isMult ? varA * varB : varA + varB;
    const incorrectOps = [varA - varB, varA * varB + 1, varA + varB + 2, varA * varB * 2];
    const options4 = Array.from(new Set([ans4.toString(), ...incorrectOps.map(v => v.toString())])).slice(0, 4);
    if (options4.indexOf(ans4.toString()) === -1) options4[0] = ans4.toString();
    questions.push({
      question: `Consider the code:\nx = ${varA}\ny = ${varB}\nprint(x ${isMult ? '*' : '+'} y)\nWhat is the output?`,
      options: shuffle(options4),
      correctAnswer: ans4.toString(),
      explanation: `x is assigned ${varA} and y is assigned ${varB}. Evaluating x ${isMult ? '*' : '+'} y gives ${varA} ${isMult ? '*' : '+'} ${varB} = ${ans4}.`
    });

    // 5. Data structures
    const listMut = [
      { q: "Which of the following data structures in Python is ordered and immutable (cannot be changed)?", ans: "Tuple", options: ["List", "Tuple", "Set", "Dictionary"], exp: "A Tuple in Python is ordered and immutable (defined with parentheses `()`). Lists are mutable, sets are unordered, and dictionaries map keys to values." },
      { q: "Which data structure stores unique elements with no fixed order?", ans: "Set", options: ["List", "Tuple", "Set", "Dictionary"], exp: "A Set in Python stores unique elements with no guaranteed order (defined with curly braces `{}`)." }
    ];
    const choice = Math.random() > 0.5 ? listMut[0] : listMut[1];
    questions.push({
      question: choice.q,
      options: shuffle([...choice.options]),
      correctAnswer: choice.ans,
      explanation: choice.exp
    });

  } else if (category === 'Boolean Logic Gates') {
    for (let i = 0; i < 5; i++) {
      const pzIsHard = isHard ? true : (i >= 3);
      const puzzle = generateBooleanPuzzle(pzIsHard);
      questions.push({
        question: `What does the expression evaluate to?\n\nExpression: ${puzzle.expression}`,
        options: ["True", "False"],
        correctAnswer: puzzle.correctAnswer ? "True" : "False",
        explanation: puzzle.explanation
      });
    }

  } else if (category === 'Math Riddles') {
    // 1. Discount Price
    const basePrice = [20, 40, 50, 80, 100, 120][Math.floor(Math.random() * 6)];
    const discount = [10, 20, 25, 50][Math.floor(Math.random() * 4)];
    const priceAns = basePrice - (basePrice * discount) / 100;
    const incorrectPrices = [basePrice - discount, priceAns + 5, priceAns - 5, basePrice * (discount / 100)];
    const options1 = Array.from(new Set([`$${priceAns}`, ...incorrectPrices.map(p => `$${Math.abs(p)}`)])).slice(0, 4);
    if (options1.indexOf(`$${priceAns}`) === -1) options1[0] = `$${priceAns}`;
    questions.push({
      question: `A coding book is originally priced at $${basePrice}. If it is on a ${discount}% sale, what is the final price?`,
      options: shuffle(options1),
      correctAnswer: `$${priceAns}`,
      explanation: `Discount amount is $${basePrice} * ${discount}% = $${(basePrice * discount) / 100}. Subtracting this from the original price gives $${priceAns}.`
    });

    // 2. Logic sequence
    const startNum = Math.floor(Math.random() * 10) + 1;
    const diff = Math.floor(Math.random() * 5) + 3;
    const seq = [startNum, startNum + diff, startNum + 2 * diff, startNum + 3 * diff];
    const seqAns = startNum + 4 * diff;
    const options2 = [seqAns.toString(), (seqAns + diff).toString(), (seqAns - 1).toString(), (seqAns + 2).toString()];
    questions.push({
      question: `Find the next number in the sequence: ${seq.join(', ')}, ...?`,
      options: shuffle(options2),
      correctAnswer: seqAns.toString(),
      explanation: `Each term increases by ${diff}. The next number is ${seq[3]} + ${diff} = ${seqAns}.`
    });

    // 3. Simple algebra
    const aCoeff = Math.floor(Math.random() * 4) + 2;
    const xAns = Math.floor(Math.random() * 5) + 1;
    const bConst = Math.floor(Math.random() * 10) + 1;
    const cVal = aCoeff * xAns + bConst;
    const options3 = [xAns.toString(), (xAns + 1).toString(), (xAns - 1).toString(), (xAns + 2).toString()];
    questions.push({
      question: `Solve for x: ${aCoeff}x + ${bConst} = ${cVal}`,
      options: shuffle(options3),
      correctAnswer: xAns.toString(),
      explanation: `Subtract ${bConst} from both sides: ${aCoeff}x = ${cVal - bConst}. Divide by ${aCoeff}: x = ${xAns}.`
    });

    // 4. Speed
    const speed = [40, 50, 60, 80][Math.floor(Math.random() * 4)];
    const time = [2, 3, 4, 5][Math.floor(Math.random() * 4)];
    const distance = speed * time;
    const options4 = [`${distance} cm`, `${distance - 20} cm`, `${distance + 40} cm`, `${speed + time} cm`];
    questions.push({
      question: `A micro-robot travels at a speed of ${speed} cm/s. How far does it travel in ${time} seconds?`,
      options: shuffle(options4),
      correctAnswer: `${distance} cm`,
      explanation: `Distance = Speed * Time. So, ${speed} cm/s * ${time} s = ${distance} cm.`
    });

    // 5. Rope Cut
    const ropeLen = [6, 8, 10, 12][Math.floor(Math.random() * 4)];
    const cutAns = ropeLen - 1;
    const options5 = [`${cutAns} mins`, `${ropeLen} mins`, `${cutAns + 2} mins`, `${ropeLen / 2} mins`];
    questions.push({
      question: `If you cut a ${ropeLen}-meter cable into 1-meter pieces, and it takes 1 minute to make one cut, how many minutes will it take to cut the entire cable?`,
      options: shuffle(options5),
      correctAnswer: `${cutAns} mins`,
      explanation: `To get ${ropeLen} pieces, you need to make ${ropeLen - 1} cuts. Thus, it takes ${cutAns} minutes.`
    });

  } else {
    // Deductive Logic
    // 1. Syllogism
    const subjs = ["cats", "dogs", "robots", "laptops", "birds"][Math.floor(Math.random() * 5)];
    questions.push({
      question: `All ${subjs} are entities. All entities require energy. Therefore:`,
      options: shuffle([
        `All ${subjs} require energy`,
        `No ${subjs} require energy`,
        `Only some ${subjs} require energy`,
        "None of the above"
      ]),
      correctAnswer: `All ${subjs} require energy`,
      explanation: "This is a transitive deduction (syllogism): If A implies B, and B implies C, then A implies C."
    });

    // 2. Modus Tollens
    questions.push({
      question: "If it rains, the grass is wet. The grass is NOT wet. What logical conclusion can you draw?",
      options: shuffle([
        "It did not rain",
        "It is raining right now",
        "The sprinkler was on",
        "No logical conclusion can be drawn"
      ]),
      correctAnswer: "It did not rain",
      explanation: "By Modus Tollens, if P implies Q, and Q is false, then P must be false. Therefore, it did not rain."
    });

    // 3. Disjunctive Syllogism
    questions.push({
      question: "The key is either in the drawer or on the table. The key is NOT in the drawer. Where is the key?",
      options: shuffle([
        "On the table",
        "Lost forever",
        "In the drawer",
        "In the pocket"
      ]),
      correctAnswer: "On the table",
      explanation: "By Disjunctive Syllogism, if P or Q is true, and P is false, then Q must be true. Therefore, the key is on the table."
    });

    // 4. Hypothetical Syllogism
    questions.push({
      question: "If study is high, test score is good. If test score is good, reward is granted. What is the logical conclusion?",
      options: shuffle([
        "If study is high, reward is granted",
        "If study is low, reward is granted",
        "Test score is always good",
        "Study does not affect reward"
      ]),
      correctAnswer: "If study is high, reward is granted",
      explanation: "By Hypothetical Syllogism, if A implies B and B implies C, then A implies C."
    });

    // 5. Modus Ponens
    questions.push({
      question: "If a shape is a triangle, it has 3 sides. Shape X is a triangle. What is the conclusion?",
      options: shuffle([
        "Shape X has 3 sides",
        "Shape X has 4 sides",
        "Shape X is a square",
        "No conclusion can be made"
      ]),
      correctAnswer: "Shape X has 3 sides",
      explanation: "By Modus Ponens, if P implies Q, and P is true, then Q must be true. Thus, shape X has 3 sides."
    });
  }

  return questions;
}

export default function GameZonePage() {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  // --- PERSISTENT STATE ---
  const [arcadeScore, setArcadeScore] = useState(0);
  const [solvedGames, setSolvedGames] = useState<string[]>([]);
  
  // --- LOCAL COMPONENT STATE ---
  const [activeTab, setActiveTab] = useState('trivia');
  const [adminSelectedGroup, setAdminSelectedGroup] = useState('Scholar (JHS)');
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [puzzleSelection, setPuzzleSelection] = useState<'binary' | 'boolean'>('binary');
  
  // --- AI TRIVIA STATE ---
  const [isGenerating, setIsGenerating] = useState(false);
  const [triviaQuestions, setTriviaQuestions] = useState<any[]>([]);
  const [isPlayingTrivia, setIsPlayingTrivia] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const isTeacherOrAdmin = role === 'Teacher' || role === 'Administrator' || role === 'Director';

  // 1. Fetch Student class
  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(() => (role === 'Student' && user && schoolId) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId)) : null, [role, user, schoolId])
  );

  const activeGroup = useMemo(() => {
      if (role !== 'Student') return adminSelectedGroup;
      if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
      return 'Scholar (JHS)';
  }, [role, adminSelectedGroup, studentData]);

  // Helper to resolve student class level
  function getStudentGroup(className: string = '') {
      const name = className.toLowerCase();
      if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3')) return 'Novice (Basic 1-3)';
      if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6')) return 'Apprentice (Basic 4-6)';
      if (name.includes('jhs')) return 'Scholar (JHS)';
      if (name.includes('shs')) return 'Master (SHS)';
      return 'Scholar (JHS)'; 
  }

  // 2. Load Progress
  useEffect(() => {
    if (!user || !firestore) return;
    const fetchProgress = async () => {
        try {
            const progressRef = doc(firestore, 'student_progress', user.uid);
            const snap = await getDoc(progressRef);
            if (snap.exists()) {
                const data = snap.data();
                if (data.arcadeScore) setArcadeScore(data.arcadeScore);
                if (data.arcadeCompleted) setSolvedGames(data.arcadeCompleted);
            }
        } catch (e) {
            console.error("Failed to load arcade progress:", e);
        }
    };
    fetchProgress();
  }, [user, firestore]);

  // 3. Score callback
  const handleSolve = async (points: number, gameId: string) => {
    if (!user || !firestore || role !== 'Student') return;
    if (solvedGames.includes(gameId)) return; // No duplicate scoring

    const nextSolved = [...solvedGames, gameId];
    const nextScore = arcadeScore + points;

    setSolvedGames(nextSolved);
    setArcadeScore(nextScore);

    try {
        const progressRef = doc(firestore, 'student_progress', user.uid);
        await setDoc(progressRef, {
            arcadeCompleted: nextSolved,
            arcadeScore: nextScore
        }, { merge: true });
        
        confetti({ particleCount: 120, spread: 60, colors: ['#10b981', '#3b82f6', '#ec4899'] });
    } catch (e) {
        console.error("Failed to save progress:", e);
    }
  };

  // --- TRIVIA CORE ACTIONS ---
  const launchTriviaBattle = async () => {
    if (!schoolId) return;
    setIsGenerating(true);
    setTriviaQuestions([]);
    setIsPlayingTrivia(false);
    setCurrentQuestionIdx(0);
    setQuizScore(0);
    setSelectedOption(null);
    setShowResults(false);

    toast({ title: "Connecting to Arena...", description: "AI is formulating trivia questions." });

    try {
      const res = await generateTriviaQuiz({
        targetGroup: activeGroup,
        category: selectedCategory,
        schoolId: schoolId
      });

      if (res && res.questions && res.questions.length > 0) {
        setTriviaQuestions(res.questions);
        setIsPlayingTrivia(true);
      } else {
        throw new Error("AI Quiz format invalid. Falling back.");
      }
    } catch (err: any) {
      console.warn("AI Quiz generation failed, loading local fallback questions:", err.message);
      setTriviaQuestions(generateOfflineTriviaQuiz(selectedCategory, activeGroup));
      setIsPlayingTrivia(true);
      toast({ title: "Local Match Ready", description: "Successfully loaded offline training set." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectOption = (option: string) => {
    if (selectedOption !== null) return; // Answer locked
    setSelectedOption(option);
    const correctOption = triviaQuestions[currentQuestionIdx].correctAnswer;
    if (option === correctOption) {
      setQuizScore(prev => prev + 1);
      confetti({ particleCount: 40, spread: 30, colors: ['#10b981', '#6366f1'] });
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < triviaQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
      // Award XP points
      const points = quizScore * 10;
      if (points > 0) {
        handleSolve(points, `trivia-${selectedCategory}-${Date.now()}`);
      }
    }
  };

  const resetTrivia = () => {
    setTriviaQuestions([]);
    setIsPlayingTrivia(false);
    setShowResults(false);
  };

  const nextMilestone = arcadeScore < 50 ? 50 : arcadeScore < 150 ? 150 : arcadeScore < 300 ? 300 : 500;
  const currentThreshold = arcadeScore < 50 ? 0 : arcadeScore < 150 ? 50 : arcadeScore < 300 ? 150 : 300;
  const xpPercentage = Math.min(100, Math.round(((arcadeScore - currentThreshold) / (nextMilestone - currentThreshold)) * 100)) || 0;

  const arcadeRank = arcadeScore < 50 
    ? "Arcade Novice 👾" 
    : arcadeScore < 150 
      ? "Pixel Fighter 🕹️" 
      : arcadeScore < 300 
        ? "Cyber Gladiator 🦾" 
        : "Arcade Champion 👑";

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-100 relative rounded-3xl border border-slate-900 shadow-2xl overflow-hidden flex flex-col">
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Cyber Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950/10 to-slate-900 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl shrink-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/10">
              <Gamepad2 className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Cyber Logic Arcade
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Battle in AI coding trivia and solve visual binary algorithms to earn logic awards.
              </p>
            </div>
          </div>
      </div>

      {/* --- TOP BAR: GAMIFICATION --- */}
      {role === 'Student' && (
          <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-xl gap-4 shrink-0 relative z-10">
            <div className="flex items-center gap-3">
                 <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-full"><Trophy className="h-5 w-5 text-emerald-400" /></div>
                 <div>
                     <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Arcade Rank</div>
                     <div className="text-sm font-bold text-white flex items-center gap-2">
                         {arcadeRank}
                         <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] py-0.5 font-mono">{arcadeScore} XP</Badge>
                     </div>
                 </div>
            </div>
            <div className="flex-grow max-w-lg mx-0 sm:mx-8 w-full sm:w-auto">
                 <div className="flex justify-between text-[10px] mb-1">
                     <span className="font-bold uppercase tracking-wider text-slate-450 text-slate-400">Next Level Progression</span>
                     <span className="font-bold text-emerald-400">{xpPercentage}% ({arcadeScore}/{nextMilestone} XP)</span>
                 </div>
                 <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900">
                     <div className="bg-gradient-to-r from-emerald-500 to-indigo-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${xpPercentage}%` }}></div>
                 </div>
            </div>
          </div>
      )}

      {/* TAB SYSTEM */}
      <Tabs defaultValue="trivia" className="w-full flex-1 flex flex-col min-h-0 relative z-10" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0">
            <TabsTrigger value="trivia" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20">AI Trivia Battle</TabsTrigger>
            <TabsTrigger value="puzzles" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20">Arcade Puzzles</TabsTrigger>
            <TabsTrigger value="kahoot" className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/20">Kahoot Hub</TabsTrigger>
        </TabsList>

        {/* =========================================================
            TAB 1: AI TRIVIA BATTLE
            ========================================================= */}
        <TabsContent value="trivia" className="mt-6 flex-1 flex flex-col min-h-0 justify-stretch">
          {!isPlayingTrivia ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch flex-grow">
              <Card className="lg:col-span-2 bg-slate-955 bg-slate-955 bg-slate-950 border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-center items-center text-center shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center shadow-lg"><Swords className="h-8 w-8 text-indigo-400" /></div>
                
                <div className="space-y-2 max-w-sm">
                  <CardTitle className="text-xl text-white font-black">Launch AI Trivia Battle</CardTitle>
                  <CardDescription className="text-slate-450 text-slate-400 text-xs leading-relaxed">
                    Test your coding syntax, math logic, and boolean equations in a generated 5-question logic duel.
                  </CardDescription>
                </div>

                <div className="flex gap-4 w-full max-w-sm">
                  <div className="flex-1 text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1.5 pl-1">Category</label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-11 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent className="bg-slate-950 border-slate-900 text-slate-350">
                        {CATEGORIES.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {isTeacherOrAdmin && (
                    <div className="text-left w-40">
                      <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest block mb-1.5 pl-1">Level Group</label>
                      <Select value={adminSelectedGroup} onValueChange={setAdminSelectedGroup}>
                        <SelectTrigger className="w-full bg-slate-900 border-slate-800 text-slate-300 rounded-xl h-11 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-slate-950 border-slate-900 text-slate-350">
                          {TARGET_GROUPS.map(grp => <SelectItem key={grp} value={grp}>{grp}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button onClick={launchTriviaBattle} disabled={isGenerating} className="w-full max-w-sm h-12 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/10 active:scale-95 text-xs flex items-center justify-center gap-2">
                  {isGenerating ? <Loader2 className="animate-spin h-5 w-5" /> : <><Play className="h-4 w-4 fill-current" /> Enter Trivia Arena</>}
                </Button>
              </Card>

              {/* Trivia side info */}
              <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider">Trivia Guidelines</h3>
                  <div className="space-y-3">
                    <div className="flex gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Answer 5 generated multiple choice questions.</span>
                    </div>
                    <div className="flex gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Earn +10 XP logic points for each correct response.</span>
                    </div>
                    <div className="flex gap-2.5 text-xs text-slate-400">
                      <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>Detailed explanations are revealed on evaluation.</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl mt-6">
                  <p className="text-[10px] text-emerald-400 font-semibold leading-relaxed flex gap-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>AI credits are spent to generate target logic sets.</span>
                  </p>
                </div>
              </Card>
            </div>
          ) : (
            /* ACTIVE TRIVIA WIZARD */
            <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col justify-center">
              {!showResults ? (
                <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-300">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <CardHeader className="border-b border-slate-900 py-4 px-6 flex justify-between items-center flex-row">
                    <div>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block">Question {currentQuestionIdx + 1} of {triviaQuestions.length}</span>
                      <CardTitle className="text-sm text-slate-450 mt-0.5">Category: {selectedCategory}</CardTitle>
                    </div>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/20 bg-emerald-500/5 font-mono text-[10px]">{quizScore} correct</Badge>
                  </CardHeader>

                  <CardContent className="p-6 space-y-6">
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-900/50">
                      <div className="bg-indigo-500 h-1.5 transition-all duration-300" style={{ width: `${((currentQuestionIdx + 1) / triviaQuestions.length) * 100}%` }} />
                    </div>

                    <div className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 min-h-[90px] flex items-center justify-center">
                      <p className="text-md leading-relaxed text-center font-serif text-slate-100 font-semibold">"{triviaQuestions[currentQuestionIdx].question}"</p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {triviaQuestions[currentQuestionIdx].options.map((opt: string) => {
                        const isSelected = selectedOption === opt;
                        const isCorrectAnswer = opt === triviaQuestions[currentQuestionIdx].correctAnswer;
                        return (
                          <button
                            key={opt}
                            disabled={selectedOption !== null}
                            onClick={() => handleSelectOption(opt)}
                            className={cn(
                              "w-full h-12 text-left px-5 rounded-xl text-xs font-semibold border transition-all active:scale-[0.99] flex items-center justify-between",
                              selectedOption === null 
                                ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700 hover:bg-slate-850'
                                : isSelected && isCorrectAnswer
                                  ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-md'
                                  : isSelected && !isCorrectAnswer
                                    ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                                    : isCorrectAnswer
                                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                                      : 'bg-slate-900 border-slate-850 text-slate-500 opacity-60'
                            )}
                          >
                            <span>{opt}</span>
                            {selectedOption !== null && isCorrectAnswer && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {selectedOption !== null && (
                      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 text-xs leading-relaxed text-slate-400 animate-in slide-in-from-bottom duration-300">
                        <span className="font-bold text-slate-300 block mb-0.5">Explanation:</span>
                        {triviaQuestions[currentQuestionIdx].explanation}
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="border-t border-slate-900 pt-4 flex justify-between">
                    <Button onClick={resetTrivia} variant="ghost" className="text-slate-500 hover:text-white rounded-xl text-xs">Exit Quiz</Button>
                    <Button 
                      onClick={nextQuestion} 
                      disabled={selectedOption === null} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6 h-10 text-xs active:scale-95 transition-all shadow-md"
                    >
                      {currentQuestionIdx === triviaQuestions.length - 1 ? "Evaluate Battle" : "Next Question"}
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                /* QUIZ RESULT SCREEN */
                <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] p-8 text-center space-y-6 shadow-2xl animate-in zoom-in duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto shadow-lg"><Trophy className="h-8 w-8 text-emerald-400" /></div>
                  
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white tracking-tight">QUIZ RESOLVED</h3>
                    <p className="text-xs text-slate-400">Scorecard summary from the trivia duel.</p>
                  </div>

                  <div className="p-6 bg-slate-900/40 border border-slate-900 rounded-2xl max-w-sm mx-auto flex items-center justify-between">
                    <div className="text-left">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Success Rate</span>
                      <span className="text-3xl font-black text-white font-mono">{quizScore} / {triviaQuestions.length}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest block">Points Awarded</span>
                      <span className="text-3xl font-black text-emerald-400 font-mono">+{quizScore * 10} XP</span>
                    </div>
                  </div>

                  <Button onClick={resetTrivia} className="w-full max-w-sm h-11 bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 text-xs">
                    Close Arena & Return
                  </Button>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* =========================================================
            TAB 2: ARCADE PUZZLES (MINIGAMES)
            ========================================================= */}
        <TabsContent value="puzzles" className="mt-6 flex-1 flex flex-col justify-stretch min-h-[480px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow">
            
            {/* Game Panel side index */}
            <aside className="lg:col-span-3 space-y-4 flex flex-col">
              <h3 className="text-xs font-black text-white uppercase tracking-wider px-1.5">Arcade Cabinet</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setPuzzleSelection('binary')}
                  className={cn(
                    "w-full text-left p-3.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-between group",
                    puzzleSelection === 'binary'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-md'
                    : 'bg-slate-900/40 border-transparent hover:bg-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <Cpu className="h-4.5 w-4.5" />
                    Binary Code Breaker
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  onClick={() => setPuzzleSelection('boolean')}
                  className={cn(
                    "w-full text-left p-3.5 rounded-2xl text-xs font-bold transition-all border flex items-center justify-between group",
                    puzzleSelection === 'boolean'
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-md'
                    : 'bg-slate-900/40 border-transparent hover:bg-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                  )}
                >
                  <span className="flex items-center gap-2">
                    <ToggleLeft className="h-4.5 w-4.5" />
                    Boolean Logic Gates
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </aside>

            {/* Game Screen wrapper */}
            <main className="lg:col-span-9 flex flex-col">
              {puzzleSelection === 'binary' ? (
                <BinaryCodeBreaker onSolve={handleSolve} targetGroup={activeGroup} />
              ) : (
                <BooleanGates onSolve={handleSolve} targetGroup={activeGroup} />
              )}
            </main>
          </div>
        </TabsContent>

        {/* =========================================================
            TAB 3: KAHOOT HUB
            ========================================================= */}
        <TabsContent value="kahoot" className="mt-6 flex-grow flex flex-col justify-stretch">
          <div className="grid md:grid-cols-2 gap-6 items-stretch flex-grow">
            {/* For Teachers */}
            {isTeacherOrAdmin && (
              <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl">
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center"><PenSquare className="h-5 w-5 text-indigo-400" /></div>
                  <div className="space-y-2">
                    <CardTitle className="text-white text-md font-black">For Classroom Instructors</CardTitle>
                    <CardDescription className="text-slate-400 text-xs leading-relaxed">
                      Launch class-wide games, host custom logic quizzes, or manage classroom Kahoots. Clicking the button below opens the editor in a new window.
                    </CardDescription>
                  </div>
                </div>
                <div className="space-y-3 mt-6">
                  <Button asChild className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs active:scale-95 shadow-md shadow-indigo-500/10">
                    <Link href="https://create.kahoot.it" target="_blank" rel="noopener noreferrer">
                      Host or Create Game on Kahoot!
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full h-11 border-slate-800 bg-slate-900 text-slate-350 hover:bg-slate-850 hover:text-white rounded-xl text-xs active:scale-95">
                    <Link href="https://www.youtube.com/watch?v=xGOLi56UQ3U" target="_blank" rel="noopener noreferrer">
                      <Youtube className="mr-1.5 h-4 w-4 text-rose-500" />
                      Watch Tutorial Video
                    </Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* For Students */}
            <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] p-6 flex flex-col justify-between shadow-xl">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center"><LogIn className="h-5 w-5 text-emerald-400" /></div>
                <div className="space-y-2">
                  <CardTitle className="text-white text-md font-black">For Student Competitors</CardTitle>
                  <CardDescription className="text-slate-400 text-xs leading-relaxed">
                    Ready to participate in a classroom duel? Get the **Game PIN** from your teacher and join the server lobby on the official site.
                  </CardDescription>
                </div>
              </div>
              <div className="mt-6">
                <Button asChild className="w-full h-11 bg-gradient-to-r from-emerald-500 to-indigo-500 hover:from-emerald-600 hover:to-indigo-600 text-slate-950 font-black rounded-xl text-xs active:scale-95 shadow-lg shadow-emerald-500/10">
                  <Link href="https://kahoot.it" target="_blank" rel="noopener noreferrer">
                    Join Live Kahoot! Game
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
