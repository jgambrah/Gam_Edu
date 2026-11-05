'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { doc, getDoc, setDoc, increment } from 'firebase/firestore';
import { runPython, preparePython, outputMatches } from '@/lib/python-runner';
import {
  PYTHON_ACADEMY_CURRICULUM,
  PYTHON_CHEAT_SHEETS,
  type PythonAcademyPhase,
  type CheatSheetSection,
} from '@/lib/python-academy-data';
import { useOnceQuery } from '@/lib/firestore-once';
import { seedPythonAcademyCentralCurriculumAction } from '@/app/actions/python-academy-seed';
import { 
  Play, CheckCircle2, Code2, BookOpen, ArrowRight, Loader2, Trophy, Sparkles, Github, ChevronRight, RefreshCw, Database, FileText, Search
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';
import { getPythonTutorHelp } from '@/ai/flows/senior-actions';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import dynamic from 'next/dynamic';
import { useCurrentSchool } from '@/hooks/use-current-school';

const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex h-64 items-center justify-center bg-slate-950 text-slate-400">Loading editor compiler...</div>,
});

interface Mission {
  id: string;
  title: string;
  task: string;
  theory?: string;
  startingCode: string;
  phase: string;
  mainTopicTitle: string;
  validation?: string;
  /** Exact output the program must print. */
  expectOutput?: string;
  /** Pieces of code the answer must use (so pasting a printed answer does not count). */
  mustUse?: string[];
  /** The program must draw a Matplotlib chart. */
  needsPlot?: boolean;
}

// --- SECTION: CONSISTENCY (REAL PRACTICE DAYS) ---
/** Last 4 weeks: a square per day, lit when the pupil completed a lesson or mission that day. */
function ContributionHeatmap({ activity }: { activity: Record<string, number> }) {
    const days = useMemo(() => {
        const out: { key: string; count: number; label: string }[] = [];
        const today = new Date();
        for (let i = 27; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            out.push({ key, count: activity[key] || 0, label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }) });
        }
        return out;
    }, [activity]);
    const activeDays = days.filter(d => d.count > 0).length;

    return (
        <div className="space-y-3 bg-slate-950/80 p-5 rounded-[24px] border border-slate-900 shadow-inner">
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Practice days (4 weeks)</p>
                <span className="text-[10px] font-bold text-fuchsia-400">{activeDays} / 28</span>
            </div>
            <div className="grid grid-flow-col grid-rows-7 gap-1 w-fit">
                {days.map(d => (
                    <div
                        key={d.key}
                        title={`${d.label}: ${d.count ? `${d.count} solved` : 'no practice'}`}
                        className={`w-3.5 h-3.5 rounded-sm transition-all border border-slate-900/50 ${
                            d.count >= 3 ? 'bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.35)]'
                            : d.count > 0 ? 'bg-fuchsia-600/80'
                            : 'bg-slate-900'
                        }`}
                    />
                ))}
            </div>
            <p className="text-[9px] text-slate-500 font-bold italic">
                {activeDays === 0 ? 'Solve a lesson today to light up your first square! 🔥' : 'Practice a little every day to keep the squares lit. 🔥'}
            </p>
        </div>
    );
}

const dayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/** A lesson's starter: the goal as a comment, plus a half-written line when the lesson gives one ("year = "). */
const starterFor = (lesson: Mission) => {
    const partial = /=\s*$/.test(lesson.startingCode || '') ? lesson.startingCode : '';
    return `# Goal: ${lesson.task}\n# Write your code below. Stuck? Press "Show example".\n\n${partial}`;
};

const draftKey = (uid: string | undefined, lessonId: string) => `gam:pyacademy:${uid || 'guest'}:${lessonId}`;

function PythonAcademy() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const { role } = useRole();

  // Central Repository Fetch (1 Firestore read per 30-min session across all schools, instant local fallback)
  const { data: centralDoc, refresh: refreshCentralDoc } = useOnceQuery<{
    phases?: PythonAcademyPhase[];
    curriculum?: PythonAcademyPhase[];
    cheatSheets?: CheatSheetSection[];
    version?: string;
  } | null>(
    firestore ? 'global_curriculum:python_academy_v1' : null,
    async () => {
      if (!firestore) return null;
      const snap = await getDoc(doc(firestore, 'global_curriculum', 'python_academy_v1'));
      return snap.exists() ? (snap.data() as any) : null;
    },
    { ttlMs: 30 * 60 * 1000 }
  );

  const curriculumPhases: PythonAcademyPhase[] = useMemo(() => {
    const remotePhases = centralDoc?.phases || centralDoc?.curriculum;
    if (Array.isArray(remotePhases) && remotePhases.length > 0) {
      return remotePhases;
    }
    return PYTHON_ACADEMY_CURRICULUM;
  }, [centralDoc]);

  const cheatSheets: CheatSheetSection[] = useMemo(() => {
    if (centralDoc?.cheatSheets && Array.isArray(centralDoc.cheatSheets) && centralDoc.cheatSheets.length > 0) {
      return centralDoc.cheatSheets;
    }
    return PYTHON_CHEAT_SHEETS;
  }, [centralDoc]);

  const allMissions: Mission[] = useMemo(() => (curriculumPhases || []).flatMap(phase =>
      (phase.mainTopics || []).flatMap(mainTopic =>
          (mainTopic.lessons || []).map((lesson: any) => ({
              ...lesson,
              phase: phase.title,
              mainTopicTitle: mainTopic.title
          }))
      )
  ), [curriculumPhases]);

  // --- STATE ---
  const [currentMissionId, setCurrentMissionId] = useState("p1-1-1");
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [activity, setActivity] = useState<Record<string, number>>({});
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [plotImage, setPlotImage] = useState<string | null>(null);
  const [stdinText, setStdinText] = useState('');
  const [pyState, setPyState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const [isRunning, setIsRunning] = useState(false);
  const [isPassed, setIsPassed] = useState(false);
  const [checkNote, setCheckNote] = useState<string | null>(null);
  const [consoleTab, setConsoleTab] = useState<'console' | 'visuals'>('console');

  const [aiQuestion, setAiQuestion] = useState("");
  const [tutorResponse, setTutorResponse] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const [isCheatSheetOpen, setIsCheatSheetOpen] = useState(false);
  const [cheatSearch, setCheatSearch] = useState('');
  const [isSeedingCentral, setIsSeedingCentral] = useState(false);
  const [sandboxSnippetTitle, setSandboxSnippetTitle] = useState<string | null>(null);

  const canManageCentralRepo = role && ['Director', 'Administrator', 'Teacher', 'SuperAdmin'].includes(role);

  const handleSeedCentralRepo = async () => {
    setIsSeedingCentral(true);
    try {
      const res = await seedPythonAcademyCentralCurriculumAction();
      if (res.success) {
        await refreshCentralDoc();
        toast({
          title: 'Central Repository Synced',
          description: res.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Central Sync Failed',
          description: res.error || 'Could not seed global_curriculum/python_academy_v1.',
        });
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Central Sync Error',
        description: e?.message || 'Unexpected error.',
      });
    } finally {
      setIsSeedingCentral(false);
    }
  };

  const filteredCheatSheets = useMemo(() => {
    const q = cheatSearch.trim().toLowerCase();
    const list = Array.isArray(cheatSheets) ? cheatSheets : [];
    if (!q) return list;
    return list
      .map((sec) => {
        const rawSnippets: any[] = Array.isArray(sec.snippets)
          ? sec.snippets
          : Array.isArray((sec as any).items)
            ? (sec as any).items
            : [];
        const matched = rawSnippets.filter((it) => {
          const label = String(it?.label || it?.heading || '').toLowerCase();
          const explanation = String(it?.explanation || it?.description || '').toLowerCase();
          const codeStr = String(it?.code || '').toLowerCase();
          return label.includes(q) || explanation.includes(q) || codeStr.includes(q);
        });
        return {
          ...sec,
          snippets: matched,
        };
      })
      .filter((sec) => String(sec.title || '').toLowerCase().includes(q) || (sec.snippets && sec.snippets.length > 0));
  }, [cheatSheets, cheatSearch]);

  const speak = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  };

  // Python loads once per browser tab, in the background (it survives switching tabs on this page).
  useEffect(() => {
    let alive = true;
    preparePython().then(() => alive && setPyState('ready')).catch(() => alive && setPyState('failed'));
    return () => { alive = false; };
  }, []);

  // --- LOAD PROGRESS (one read) ---
  useEffect(() => {
    if (!user || !firestore) return;
    const fetchProgress = async () => {
        try {
            const snap = await getDoc(doc(firestore, 'student_progress', user.uid));
            if (snap.exists()) {
                const d: any = snap.data();
                if (Array.isArray(d.pythonAcademyCompleted)) setCompletedMissions(d.pythonAcademyCompleted);
                if (d.codingActivity && typeof d.codingActivity === 'object') setActivity(d.codingActivity);
            }
        } catch (e) {
            console.error("Error loading progress:", e);
        }
    };
    fetchProgress();
  }, [user, firestore]);

  const activeLesson = useMemo(() => {
    if (allMissions.length === 0) return null;
    return allMissions.find(m => m.id === currentMissionId) || allMissions[0];
  }, [allMissions, currentMissionId]);

  // Opening a lesson brings back the pupil's own draft for it (kept on this device), or the starter.
  useEffect(() => {
    if (!activeLesson) return;
    setSandboxSnippetTitle(null);
    let draft: string | null = null;
    try { draft = localStorage.getItem(draftKey(user?.uid, activeLesson.id)); } catch {}
    setCode(draft ?? starterFor(activeLesson));
    setIsPassed(false);
    setCheckNote(null);
    setOutput([]);
    setPlotImage(null);
    setStdinText('');
    setTutorResponse(null);
    setConsoleTab('console');
  }, [activeLesson, user?.uid]);

  // Keep the draft as the pupil types (only when working on the lesson, not in Cheat Sheet Sandbox mode).
  useEffect(() => {
    if (!activeLesson || sandboxSnippetTitle) return;
    const t = setTimeout(() => {
      try {
        if (code && code !== starterFor(activeLesson)) localStorage.setItem(draftKey(user?.uid, activeLesson.id), code);
      } catch {}
    }, 500);
    return () => clearTimeout(t);
  }, [code, activeLesson, user?.uid, sandboxSnippetTitle]);

  const usesInput = /\binput\s*\(/.test(code);

  const runAndValidate = async () => {
        if (!activeLesson || isRunning) return;
        setIsRunning(true);
        setOutput([]);
        setIsPassed(false);
        setCheckNote(null);
        setPlotImage(null);
        try {
            const result = await runPython(code, {
                validation: sandboxSnippetTitle ? undefined : activeLesson.validation,
                stdin: stdinText,
                timeoutMs: 10000
            });
            const lines = result.output ? result.output.split('\n') : [];
            if (result.error) lines.push(`❌ ${result.error}`);
            setOutput(lines);
            if (result.image) { setPlotImage(`data:image/png;base64,${result.image}`); setConsoleTab('visuals'); }
            if (!result.ok) {
                if (usesInput && /EOFError/.test(result.error || '')) setCheckNote('Your program asked for more input than you typed. Add an answer per line in "Program input".');
                return;
            }

            // If running a Cheat Sheet snippet in Sandbox Mode, skip lesson-specific grading checks.
            if (sandboxSnippetTitle) {
                return;
            }

            // Every check the lesson asks for must pass.
            const problems: string[] = [];
            // Comments don't count (the starter repeats the goal in a comment), except when the lesson is about comments.
            const codeOnly = code.split('\n').map(l => l.replace(/#.*$/, '')).join('\n');
            const missing = (activeLesson.mustUse || []).filter(t => !(t === '#' ? code : codeOnly).includes(t));
            if (missing.length) problems.push(`Use ${missing.map(m => `"${m}"`).join(' and ')} in your code (Current Lesson: ${activeLesson.title}).`);
            if (activeLesson.validation && result.passed !== true) problems.push('Your variables do not match the goal yet. Read the goal again.');
            if (activeLesson.expectOutput !== undefined && !outputMatches(result.output, activeLesson.expectOutput)) {
                problems.push(`Expected output:\n${activeLesson.expectOutput}`);
            }
            if (activeLesson.needsPlot && !result.image) problems.push('Draw a chart (the program did not make one).');
            const hasAnyCheck = !!(activeLesson.validation || activeLesson.expectOutput !== undefined || activeLesson.needsPlot);
            if (!hasAnyCheck && !result.output.trim()) problems.push('Print something so we can see your program working.');

            if (problems.length) { setCheckNote(problems.join('\n')); return; }

            setIsPassed(true);
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#d946ef', '#4f46e5'] });
            speak("Great job!");

            if (user && firestore && !completedMissions.includes(activeLesson.id)) {
                const nextMissions = Array.from(new Set([...completedMissions, activeLesson.id]));
                setCompletedMissions(nextMissions);
                const day = dayKey();
                setActivity(prev => ({ ...prev, [day]: (prev[day] || 0) + 1 }));
                try {
                    await setDoc(doc(firestore, 'student_progress', user.uid), { pythonAcademyCompleted: nextMissions, codingActivity: { [day]: increment(1) } }, { merge: true });
                } catch (e) {
                    console.error("Failed to save progress:", e);
                    toast({ variant: 'destructive', title: 'Progress not saved', description: 'Your answer is right, but it could not be saved. Check your connection and run it again.' });
                }
            }
        } finally {
            setIsRunning(false);
        }
  };

  const askTutor = async () => {
    if (!aiQuestion.trim() || !activeLesson) return;
    if (!schoolId) {
        toast({ variant: 'destructive', title: "School not found", description: "Reload the page and try again." });
        return;
    }
    setIsAiLoading(true);
    try {
      const res = await getPythonTutorHelp({
        phase: activeLesson.phase || "Fundamentals",
        lesson: activeLesson.title,
        task: activeLesson.task,
        userCode: code,
        question: aiQuestion,
        schoolId: schoolId
      });
      if (res.success && res.data) {
        setTutorResponse(res.data);
        setAiQuestion("");
        speak(res.data.explanation);
      } else {
        toast({ variant: 'destructive', title: "Tutor Busy", description: res.error || "AI credit spent limit hit." });
      }
    } catch (e: any) {
        toast({ variant: 'destructive', title: "AI Error", description: e.message || "Failed to contact coach." });
    } finally {
      setIsAiLoading(false);
    }
  };

  const goToNextLesson = () => {
    setIsPassed(false);
    setSandboxSnippetTitle(null);
    const currentIndex = allMissions.findIndex(l => l.id === activeLesson?.id);
    if (currentIndex < allMissions.length - 1) {
      setCurrentMissionId(allMissions[currentIndex + 1].id);
    } else {
      toast({ title: 'Academy complete! 🎓', description: 'You have reached the last lesson.' });
    }
  };

  const showExample = () => {
    if (!activeLesson) return;
    setSandboxSnippetTitle(null);
    setCheckNote(null);
    setCode(activeLesson.startingCode || '');
    toast({ description: 'Example loaded. Read it, change it, then run it.' });
  };

  const resetLesson = () => {
    if (!activeLesson) return;
    setSandboxSnippetTitle(null);
    try { localStorage.removeItem(draftKey(user?.uid, activeLesson.id)); } catch {}
    setCode(starterFor(activeLesson));
    setOutput([]); setPlotImage(null); setCheckNote(null);
  };

  const solvedCount = completedMissions.filter(id => allMissions.some(m => m.id === id)).length;
  const progressPercentage = Math.round((solvedCount / allMissions.length) * 100) || 0;
  const studentRank = solvedCount < 5
    ? "Python Novice 🐍"
    : solvedCount < 12
      ? "Logic Explorer 🔍"
      : solvedCount < 20
        ? "Data Apprentice 📊"
        : "AI Architect 🤖";

  if (!activeLesson) {
      return (
          <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-fuchsia-500" />
          </div>
      );
  }

  const activePhase = curriculumPhases.find(p => p.title === activeLesson.phase)?.phase;

  return (
    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-900 text-slate-300 p-1 font-sans rounded-3xl overflow-hidden flex flex-col min-h-[600px] shadow-2xl relative">
      {/* --- TOP BAR: GAMIFICATION & CENTRAL REPO --- */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-900 shadow-xl gap-4 mb-4 shrink-0 mx-4 mt-4">
        <div className="flex items-center gap-3">
             <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-full"><Trophy className="h-5 w-5 text-fuchsia-400" /></div>
             <div>
                 <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                     Student Rank
                     {centralDoc?.version && (
                       <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">
                         Central Repo v{centralDoc.version}
                       </span>
                     )}
                 </div>
                 <div className="text-sm font-bold text-white flex items-center gap-2">
                     {studentRank}
                     <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-[9px] py-0.5 font-mono">{solvedCount} / {allMissions.length} Solved</Badge>
                 </div>
             </div>
        </div>
        <div className="flex-1 sm:mx-8 w-full sm:w-auto">
             <div className="flex justify-between text-[10px] mb-1">
                 <span className="font-bold uppercase tracking-wider text-slate-400">Academy Completion</span>
                 <span className="font-bold text-fuchsia-400">{progressPercentage}%</span>
             </div>
             <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-950">
                 <div className="bg-gradient-to-r from-fuchsia-500 to-violet-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
             </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => setIsCheatSheetOpen(true)}
            className="h-9 px-3 text-[11px] font-bold bg-slate-900 border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/15 hover:text-white rounded-xl flex items-center gap-1.5"
          >
            <FileText className="h-3.5 w-3.5 text-fuchsia-400" />
            Cheat Sheet (26p Guide)
          </Button>
          {canManageCentralRepo && (
            <Button
              variant="outline"
              onClick={handleSeedCentralRepo}
              disabled={isSeedingCentral}
              title="Publish/Sync this curriculum to the Central Firestore Repository for all schools"
              className="h-9 px-3 text-[11px] font-bold bg-slate-900 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 hover:text-white rounded-xl flex items-center gap-1.5"
            >
              {isSeedingCentral ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Database className="h-3.5 w-3.5 text-emerald-400" />}
              Sync Central Repo
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 flex-grow items-stretch">

        <aside className="lg:col-span-3 space-y-6 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-fuchsia-500/10 border border-fuchsia-500/20 p-2.5 rounded-xl shadow-lg"><Code2 className="text-fuchsia-400" /></div>
            <h2 className="text-lg font-black text-white">Academy Index</h2>
          </div>

          <ContributionHeatmap activity={activity} />

          <ScrollArea className="flex-grow max-h-[420px] lg:max-h-none rounded-3xl border border-slate-900 bg-slate-950/60 p-3 shadow-inner">
            <div className="p-1 space-y-2">
              {(curriculumPhases || []).map((phase) => {
                const phaseLessons = (phase.mainTopics || []).flatMap((t: any) => t.lessons || []);
                const phaseDone = phaseLessons.filter((l: any) => completedMissions.includes(l.id)).length;
                return (
                <Accordion key={phase.phase} type="single" collapsible defaultValue={phase.phase === activePhase ? phase.phase : undefined} className="w-full">
                  <AccordionItem value={phase.phase} className="border-none">
                    <AccordionTrigger className="hover:no-underline p-3 bg-slate-900/50 rounded-2xl mb-1 group border border-slate-950 hover:bg-slate-900">
                      <span className="flex-1 text-left font-black text-[10px] uppercase tracking-widest text-slate-300">{phase.title}</span>
                      <span className="mr-2 text-[9px] font-mono text-slate-500">{phaseDone}/{phaseLessons.length}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pl-3 space-y-1">
                      {(phase.mainTopics || []).map((mainTopic: any) => (
                        <Accordion key={mainTopic.title} type="single" collapsible defaultValue={mainTopic.title === activeLesson.mainTopicTitle && phase.title === activeLesson.phase ? mainTopic.title : undefined}>
                          <AccordionItem value={mainTopic.title} className="border-none">
                            <AccordionTrigger className="text-[11px] font-extrabold text-slate-500 py-2.5 hover:text-fuchsia-400 hover:no-underline px-2 transition-all">
                                {mainTopic.title}
                            </AccordionTrigger>
                            <AccordionContent className="space-y-1 pl-2">
                                {(mainTopic.lessons || []).map((lesson: any) => {
                                    const isCompleted = completedMissions.includes(lesson.id);
                                    const isActive = activeLesson?.id === lesson.id;
                                    return (
                                        <button
                                            key={lesson.id}
                                            onClick={() => setCurrentMissionId(lesson.id)}
                                            className={`w-full text-left p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${isActive ? 'bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-500/20' : 'hover:bg-slate-900/40 text-slate-400 hover:text-slate-200'}`}
                                        >
                                            <span className="truncate">{lesson.title}</span>
                                            {isCompleted && <CheckCircle2 className={`h-3.5 w-3.5 shrink-0 ml-2 ${isActive ? 'text-white' : 'text-emerald-400'}`} />}
                                        </button>
                                    );
                                })}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        <main className="lg:col-span-6 flex flex-col gap-4 overflow-hidden min-h-[500px]">
          <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col h-full">
            <div className="bg-slate-900/80 px-6 py-3.5 flex flex-col gap-2 border-b border-slate-950 shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                  {sandboxSnippetTitle ? `Cheat Sheet Sandbox · ${sandboxSnippetTitle}` : `${activeLesson.phase} · ${activeLesson.title}`}
                </div>
                {sandboxSnippetTitle && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={resetLesson}
                    className="h-6 px-2.5 text-[10px] font-bold bg-slate-900 border-fuchsia-500/40 text-fuchsia-300 hover:bg-fuchsia-500/20 hover:text-white rounded-lg"
                  >
                    Back to Lesson ({activeLesson.title})
                  </Button>
                )}
              </div>
              {activeLesson.theory && !sandboxSnippetTitle && (
                <div className="text-[11px] text-slate-300 bg-slate-950/70 border border-slate-800/80 px-3 py-2 rounded-xl leading-relaxed">
                  <span className="text-violet-400 font-bold uppercase tracking-wider text-[10px] mr-1.5">Cheat Sheet Tip:</span>
                  {activeLesson.theory}
                </div>
              )}
              <div className="text-xs text-slate-400 font-bold bg-slate-950/40 border border-slate-900/80 p-3 rounded-xl">
                {sandboxSnippetTitle ? (
                  <span>
                    Sandbox Mode: <span className="text-emerald-400 font-extrabold">Run and experiment with &ldquo;{sandboxSnippetTitle}&rdquo; freely without lesson grading rules.</span>
                  </span>
                ) : (
                  <span>
                    Goal: <span className="text-fuchsia-400 font-extrabold">{activeLesson.task}</span>
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-between items-center gap-2 mt-1">
                <Badge variant="outline" className={`text-[10px] py-0.5 font-bold flex items-center gap-1 ${
                    pyState === 'ready' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25'
                    : pyState === 'failed' ? 'text-rose-400 bg-rose-500/10 border-rose-500/25'
                    : 'text-amber-300 bg-amber-500/10 border-amber-500/25 animate-pulse'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${pyState === 'ready' ? 'bg-emerald-400' : pyState === 'failed' ? 'bg-rose-400' : 'bg-amber-300'}`} />
                  {pyState === 'ready' ? 'Python ready' : pyState === 'failed' ? 'Python could not load — reload the page' : 'Loading Python...'}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" onClick={showExample} className="h-10 px-3 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                    <BookOpen className="h-3.5 w-3.5 mr-1" /> Show example
                  </Button>
                  <Button variant="ghost" onClick={resetLesson} title="Reset to current lesson starter" className="h-10 px-3 text-[11px] font-bold text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl">
                    <RefreshCw className="h-3.5 w-3.5" />
                  </Button>
                  <Button onClick={runAndValidate} disabled={isRunning || pyState === 'failed'} className="bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-fuchsia-500/20 transition-all active:scale-95 text-xs flex items-center gap-1.5">
                    {isRunning ? <Loader2 className="animate-spin h-4 w-4" /> : <><Play className="h-4 w-4 fill-current text-white" /> {sandboxSnippetTitle ? 'Run Snippet' : 'Run & Check'}</>}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-grow relative bg-[#1e1e1e] min-h-[300px] border-b border-slate-950">
                <Editor
                    height="100%"
                    defaultLanguage="python"
                    theme="vs-dark"
                    value={code}
                    onChange={(v) => setCode(v || "")}
                    options={{
                        fontSize: 15,
                        minimap: { enabled: false },
                        padding: { top: 15 },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        lineNumbers: 'on',
                        fontFamily: 'monospace'
                    }}
                />

                {isPassed && (
                    <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center animate-in zoom-in duration-300">
                        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] text-center space-y-6 max-w-sm shadow-2xl">
                            <div className="relative mx-auto w-16 h-16">
                                <div className="absolute inset-0 bg-fuchsia-500 rounded-full animate-ping opacity-20" />
                                <div className="relative bg-gradient-to-tr from-fuchsia-500 to-violet-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
                                    <CheckCircle2 className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white tracking-tight">MISSION COMPLETED</h3>
                                <p className="text-xs text-slate-400">Great work! Every check passed.</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setIsPassed(false)} className="flex-1 h-12 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl text-xs font-bold">See my output</Button>
                                <Button onClick={goToNextLesson} className="flex-1 h-12 bg-gradient-to-r from-fuchsia-500 to-violet-500 hover:from-fuchsia-600 hover:to-violet-600 text-white font-bold rounded-xl shadow-xl shadow-fuchsia-500/20 active:scale-95 transition-all text-xs">
                                    NEXT LESSON <ArrowRight className="ml-1.5 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {usesInput && (
                <div className="bg-slate-950 border-t border-slate-900 px-6 py-3 shrink-0">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Program input — one answer per line, used by input()</Label>
                    <Textarea value={stdinText} onChange={(e) => setStdinText(e.target.value)} placeholder="e.g. blue" className="mt-1.5 min-h-[56px] bg-slate-900 border-slate-800 text-slate-100 font-mono text-xs rounded-xl" />
                </div>
            )}

            <div className="h-48 bg-slate-950 shrink-0 flex flex-col border-t border-slate-900">
                <Tabs value={consoleTab} onValueChange={(v) => setConsoleTab(v as any)} className="h-full flex flex-col">
                    <div className="px-6 py-2 bg-slate-950 border-b border-slate-900 flex justify-between items-center shrink-0">
                        <TabsList className="bg-slate-900/60 p-0.5 border border-slate-800 rounded-lg">
                            <TabsTrigger value="console" className="text-[10px] font-bold uppercase py-1 px-3 data-[state=active]:bg-fuchsia-500/10 data-[state=active]:text-fuchsia-400">Terminal Output</TabsTrigger>
                            <TabsTrigger value="visuals" className="text-[10px] font-bold uppercase py-1 px-3 data-[state=active]:bg-fuchsia-500/10 data-[state=active]:text-fuchsia-400">Matplotlib Graph</TabsTrigger>
                        </TabsList>
                        {output.length > 0 && <button onClick={() => setOutput([])} className="text-[9px] font-bold uppercase text-slate-500 hover:text-white">Clear</button>}
                    </div>

                    <TabsContent value="console" className="flex-1 p-4 font-mono text-xs overflow-y-auto leading-relaxed mt-0">
                        {checkNote && (
                            <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-200 whitespace-pre-wrap font-sans text-[11px] font-semibold">
                                Not yet: {checkNote}
                            </div>
                        )}
                        {output.map((line, i) => (
                            <div key={i} className={`mb-1 whitespace-pre-wrap ${line.startsWith('❌') ? 'text-rose-400' : 'text-emerald-400/90'}`}>{line}</div>
                        ))}
                        {output.length === 0 && !checkNote && <span className="text-slate-600 italic">No output yet. Press Run &amp; Check.</span>}
                    </TabsContent>

                    <TabsContent value="visuals" className="flex-1 flex items-center justify-center p-3 bg-slate-900/30 relative mt-0">
                        {plotImage
                            ? <img className="max-h-full max-w-full rounded-lg shadow-md border border-slate-800 bg-white" alt="Your chart" src={plotImage} />
                            : <span className="text-[11px] text-slate-500 italic">Charts drawn with matplotlib appear here.</span>}
                    </TabsContent>
                </Tabs>
            </div>
          </Card>
        </main>

        <aside className="lg:col-span-3 space-y-6 flex flex-col overflow-y-auto">
          <Card className="bg-slate-950/80 border border-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shrink-0">
            <div className="bg-slate-900/50 p-4 border-b border-slate-900 flex items-center justify-between">
              <CardTitle className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-fuchsia-400" /> Dr. Gam AI Coach
              </CardTitle>
              <Badge className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/25 text-[9px] py-0.5">1 credit / question</Badge>
            </div>
            <CardContent className="p-4 space-y-4">
              {tutorResponse ? (
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-inner space-y-2">
                     <p className="text-[10px] text-fuchsia-400 font-bold uppercase tracking-wider">Tutor Explanation</p>
                     <p className="text-xs leading-relaxed text-slate-300">{tutorResponse.explanation}</p>
                     {tutorResponse.hint && (
                          <div className="pt-2 border-t border-slate-800/80">
                              <p className="text-[10px] text-violet-400 font-bold uppercase tracking-wider">Hint</p>
                              <p className="text-xs leading-relaxed text-slate-400 italic">"{tutorResponse.hint}"</p>
                          </div>
                     )}
                  </div>
                  <Button variant="ghost" onClick={() => setTutorResponse(null)} className="w-full text-[10px] font-bold text-slate-500 hover:text-white rounded-xl hover:bg-slate-900">Ask another question</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type a coding question or explain your script error..."
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-xl text-xs min-h-[90px] focus:ring-1 focus:ring-fuchsia-500 focus:outline-none p-3 text-slate-200"
                  />
                  <Button onClick={askTutor} disabled={isAiLoading || !aiQuestion.trim()} className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold rounded-xl h-10 text-xs shadow-lg shadow-fuchsia-500/10">
                    {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : "Request AI Assistance"}
                  </Button>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Running your code is free. Only questions to the coach use AI credits.</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] overflow-hidden shrink-0">
            <CardHeader className="p-4 border-b border-slate-900">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Developer Resources</CardTitle>
            </CardHeader>
            <CardContent className="p-2 space-y-1">
              <button
                onClick={() => setIsCheatSheetOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors group text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-fuchsia-400" />
                  <span className="text-[11px] font-bold group-hover:text-fuchsia-400 text-slate-300">Python Crash Course Cheat Sheet</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </button>
              <a href="https://docs.python.org/3/tutorial/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors group">
                <span className="text-[11px] font-bold group-hover:text-fuchsia-400 text-slate-300">Official Python Docs</span>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-900 transition-colors group">
                <div className="flex items-center gap-2">
                  <Github className="h-3.5 w-3.5 text-white" />
                  <span className="text-[11px] font-bold group-hover:text-white text-slate-300">GitHub Portal</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </a>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* --- INTERACTIVE 26-PAGE PYTHON CHEAT SHEET MODAL --- */}
      <Dialog open={isCheatSheetOpen} onOpenChange={setIsCheatSheetOpen}>
        <DialogContent className="max-w-4xl bg-slate-950 border border-slate-800 text-slate-200 max-h-[88vh] overflow-hidden flex flex-col">
          <DialogHeader className="shrink-0">
            <DialogTitle className="text-lg font-black text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-fuchsia-400" />
              Beginner&apos;s Python Cheat Sheet — Complete Reference
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Covers Variables, Lists, Dictionaries, Loops, Functions, Classes, Files &amp; Exceptions, unittest, Pygame, Matplotlib/Pygal, and Django. Scroll down or click a topic tab below, then click &ldquo;Try in Editor&rdquo; on any snippet.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 my-2 shrink-0">
            <div className="relative">
              <Search className="h-4 w-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                value={cheatSearch}
                onChange={(e) => setCheatSearch(e.target.value)}
                placeholder="Search syntax, methods, pygame, unittest, json, matplotlib, django..."
                className="pl-9 bg-slate-900 border-slate-800 text-xs text-slate-200 rounded-xl"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setCheatSearch('')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                  !cheatSearch
                    ? 'bg-fuchsia-600 text-white border-fuchsia-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All ({(cheatSheets || []).length})
              </button>
              {(cheatSheets || []).map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    setCheatSearch('');
                    const el = document.getElementById(`cheat-sec-${sec.id}`);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-900 text-slate-300 border border-slate-800 hover:border-fuchsia-500/50 hover:text-fuchsia-300 transition-all"
                >
                  {sec.title.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 min-h-0 max-h-[60vh] overflow-y-auto pr-2 space-y-6 py-2">
              {(filteredCheatSheets || []).map((section) => {
                const sectionSnippets: any[] = Array.isArray(section.snippets)
                  ? section.snippets
                  : Array.isArray((section as any).items)
                    ? (section as any).items
                    : [];
                return (
                <div id={`cheat-sec-${section.id}`} key={section.id} className="space-y-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div>
                      <h3 className="text-sm font-black text-fuchsia-400">{section.title}</h3>
                      <p className="text-[11px] text-slate-400">{section.summary}</p>
                    </div>
                    {section.category && (
                      <Badge className="bg-slate-800 text-slate-300 border border-slate-700 text-[9px]">
                        {section.category}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sectionSnippets.map((item, idx) => {
                      const titleText = item.label || item.heading || 'Code Example';
                      const descText = item.explanation || item.description || '';
                      return (
                      <div key={idx} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3 flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-white">{titleText}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSandboxSnippetTitle(titleText);
                                setCheckNote(null);
                                setIsPassed(false);
                                setCode(item.code);
                                setIsCheatSheetOpen(false);
                                toast({
                                  title: 'Cheat Sheet Sandbox Active',
                                  description: `Loaded "${titleText}". Click "Run Snippet" to execute it freely!`,
                                });
                              }}
                              className="h-6 px-2 text-[10px] font-bold text-fuchsia-400 hover:text-white hover:bg-fuchsia-600/20 rounded-lg"
                            >
                              Try in Editor
                            </Button>
                          </div>
                          <p className="text-[11px] text-slate-400 mb-2">{descText}</p>
                        </div>
                        <pre className="bg-slate-900/90 border border-slate-800 rounded-lg p-2.5 text-[11px] font-mono text-emerald-300 overflow-x-auto whitespace-pre-wrap">
                          {item.code}
                        </pre>
                      </div>
                      );
                    })}
                  </div>
                </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PythonAcademyPage() {
    return <PythonAcademy />;
}
