'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import {
  collection,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  doc,
  where,
  getDoc,
  limit,
} from 'firebase/firestore';
import {
  BrainCircuit,
  Loader2,
  PlusCircle,
  Lightbulb,
  CheckCircle2,
  MessageSquare,
  Search,
  AlertTriangle,
  ShieldCheck,
  Trash2,
  Activity,
  Trophy,
  Database,
  Sparkles,
  Eye,
  RefreshCw,
} from 'lucide-react';

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import confetti from 'canvas-confetti';

// Custom Components
import { ParadoxCard, DebateArena } from '@/components/academics/think-tank-components';

// Public v2 Curriculum Types & Validator (no private answer bank bundled)
import type { Student } from '@/lib/types';
import {
  THINK_TANK_PUBLIC_V2_VERSION,
  verifyAndAssemblePublicV2Curriculum,
  type PublicParadox,
  type PublicDetectiveCase,
  type PublicRiddle,
  type PublicDebate,
} from '@/lib/think-tank-public-curriculum';
import {
  compareCurriculumVersions,
  type ShardDocumentData,
} from '@/lib/think-tank-sync-utils';
import { useOnceQuery } from '@/lib/firestore-once';
import { seedThinkTankCentralRepoAction } from '@/app/actions/think-tank-seed';
import {
  submitThinkTankParadoxAction,
  lockThinkTankBlueprintAction,
} from '@/app/actions/think-tank-submit';
import { submitThinkTankDetectiveAction } from '@/app/actions/think-tank-detective-submit';
import {
  submitThinkTankRiddleAction,
  revealThinkTankRiddleAction,
} from '@/app/actions/think-tank-riddle-submit';
import {
  generateSchoolParadoxAction,
  deleteSchoolParadoxAction,
  generateSchoolDetectiveCaseAction,
  deleteSchoolDetectiveCaseAction,
  generateSchoolDebateTopicAction,
  deleteSchoolDebateTopicAction,
} from '@/app/actions/think-tank-school-paradoxes';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school';

const TARGET_GROUPS = ['Novice (Basic 1-3)', 'Apprentice (Basic 4-6)', 'Scholar (JHS)', 'Master (SHS)'];

const getStudentGroup = (className: string = '') => {
  const name = className.toLowerCase();
  if (name.includes('bs1') || name.includes('bs2') || name.includes('bs3')) return 'Novice (Basic 1-3)';
  if (name.includes('bs4') || name.includes('bs5') || name.includes('bs6')) return 'Apprentice (Basic 4-6)';
  if (name.includes('jhs')) return 'Scholar (JHS)';
  if (name.includes('shs')) return 'Master (SHS)';
  return 'Scholar (JHS)';
};

// --- COMPONENT: Teacher Monitor ---
function TeacherMonitorTab({ schoolId }: { schoolId: string | null }) {
  const firestore = useFirestore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('All');

  const submissionsQuery = useMemoFirebase(
    () =>
      firestore && schoolId
        ? query(
            collection(firestore, 'think_tank_submissions'),
            where('schoolId', '==', schoolId),
            orderBy('timestamp', 'desc'),
            limit(100)
          )
        : null,
    [firestore, schoolId]
  );

  const { data: submissions, isLoading } = useCollection<any>(submissionsQuery);

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    return submissions.filter((sub: any) => {
      const matchesSearch =
        sub.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.response?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGroup = selectedGroup === 'All' || sub.type === selectedGroup;
      return matchesSearch && matchesGroup;
    });
  }, [submissions, searchTerm, selectedGroup]);

  if (isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full bg-slate-900" />
        <Skeleton className="h-40 w-full bg-slate-900" />
      </div>
    );

  return (
    <Card className="bg-slate-950 border border-slate-900 rounded-[2rem] shadow-2xl overflow-hidden">
      <CardHeader className="border-b border-slate-900 pb-4">
        <CardTitle className="text-white font-black text-lg flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-400" /> Student Activity Monitor
        </CardTitle>
        <CardDescription className="text-slate-400">
          Track and review critical thinking logs in real time.
        </CardDescription>
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-500" />
            <Input
              placeholder="Search by student name or response..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800 text-white rounded-xl h-10 text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-[160px] h-10 bg-slate-900 border-slate-800 text-slate-300 rounded-xl text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-slate-900 text-slate-300">
              <SelectItem value="All">All Activities</SelectItem>
              <SelectItem value="Paradox">Paradoxes</SelectItem>
              <SelectItem value="Detective Case">Detective Cases</SelectItem>
              <SelectItem value="Riddle">Riddles</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="rounded-2xl border border-slate-900 overflow-hidden bg-slate-900/30">
          <Table>
            <TableHeader className="bg-slate-950 border-b border-slate-900">
              <TableRow className="border-b border-slate-900 hover:bg-slate-950/80">
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Student
                </TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Activity
                </TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Response / Answer
                </TableHead>
                <TableHead className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  Submitted Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubmissions.map((sub: any) => (
                <TableRow key={sub.id} className="border-b border-slate-900 hover:bg-slate-900/40 text-slate-300">
                  <TableCell className="font-bold text-white text-xs">{sub.studentName}</TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        'text-[9px] py-0.5 px-2 font-bold',
                        sub.type === 'Paradox'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : sub.type === 'Riddle'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      )}
                    >
                      {sub.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs" title={sub.response}>
                    {sub.response}
                  </TableCell>
                  <TableCell className="text-[10px] text-slate-500">
                    {sub.timestamp?.toDate ? sub.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                  </TableCell>
                </TableRow>
              ))}
              {filteredSubmissions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-slate-500 py-8 text-xs italic">
                    No matching activities logged.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

// --- COMPONENT: Detective Card ---
function DetectiveCard({
  caseData,
  onDelete,
  isStaff,
}: {
  caseData: PublicDetectiveCase & { createdAt?: any; schoolId?: string };
  onDelete?: () => void;
  isStaff: boolean;
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [serverFeedback, setServerFeedback] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!selectedOption || isSubmitting || isSolved) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      const result = await submitThinkTankDetectiveAction({
        caseId: caseData.id,
        selectedOption,
      });

      if (!result.success) {
        setActionError(result.error || 'Unable to verify detective analysis.');
        return;
      }

      const correct = Boolean(result.correct);
      setIsSolved(true);
      setIsCorrect(correct);
      setAwardedXp(result.awardedXp ?? 0);
      setAlreadyCompleted(Boolean(result.alreadyCompleted));
      setServerFeedback(result.feedback ?? result.explanation ?? '');

      if (user && firestore && schoolId) {
        try {
          await addDoc(collection(firestore, 'think_tank_submissions'), {
            studentId: user.uid,
            userId: user.uid,
            studentName: user.displayName || user.email,
            type: 'Detective Case',
            activityId: caseData.id,
            response: `Selected Option: "${selectedOption}" (${correct ? 'Correct' : 'Incorrect'})`,
            timestamp: serverTimestamp(),
            schoolId: schoolId,
          });
        } catch (e) {
          console.error('Failed to add case submission:', e);
        }
      }
    } catch (e: any) {
      setActionError(e?.message || 'Unable to verify detective analysis.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border border-slate-900 bg-slate-950/80 backdrop-blur-md rounded-[2rem] shadow-2xl relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="border-b border-slate-900 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-amber-400 animate-pulse" />
            <CardTitle className="text-lg text-white font-black">Detective Desk File</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold">
              {caseData.caseType}
            </Badge>
            {isStaff && onDelete && !caseData.isCentral && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onDelete}
                className="text-rose-400 hover:text-rose-300 hover:bg-slate-900/60 rounded-xl"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-900 relative overflow-hidden shadow-inner">
          <div className="absolute right-4 top-2 text-slate-800 font-serif font-black text-5xl rotate-12 select-none opacity-20">
            TOP SECRET
          </div>

          <h4 className="font-extrabold text-slate-500 mb-2 uppercase text-[10px] tracking-widest">
            Case Scenario &amp; Evidence:
          </h4>
          <p className="text-md font-serif text-slate-100 leading-relaxed italic">&ldquo;{caseData.scenario}&rdquo;</p>
        </div>

        <div className="space-y-3">
          <p className="font-bold text-slate-300 text-sm">{caseData.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {caseData.options.map((opt: string) => {
              const isSelected = selectedOption === opt;
              return (
                <Button
                  key={opt}
                  variant="outline"
                  className={cn(
                    'w-full justify-start rounded-xl h-auto min-h-[44px] py-2.5 px-3 text-xs border-slate-800 transition-all font-semibold whitespace-normal text-left',
                    isSelected
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-600 border-amber-500 shadow-lg'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200'
                  )}
                  onClick={() => !isSolved && !isSubmitting && setSelectedOption(opt)}
                  disabled={isSolved || isSubmitting}
                >
                  {isSelected && <CheckCircle2 className="mr-2 h-4 w-4 text-slate-950 shrink-0" />}
                  {opt}
                </Button>
              );
            })}
          </div>
        </div>

        {actionError && (
          <Alert className="rounded-2xl border bg-rose-950/20 border-rose-900/30 text-rose-300">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <AlertTitle className="font-bold text-sm">Submission Error</AlertTitle>
            <AlertDescription className="text-slate-300 mt-1 text-xs">
              {actionError}
            </AlertDescription>
          </Alert>
        )}

        {isSolved && (
          <Alert
            className={cn(
              'rounded-2xl border animate-in slide-in-from-bottom duration-300',
              isCorrect
                ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                : 'bg-rose-950/20 border-rose-900/30 text-rose-300'
            )}
          >
            {isCorrect ? (
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-rose-400" />
            )}
            <AlertTitle className="font-bold text-sm">
              {isCorrect
                ? alreadyCompleted
                  ? 'Case Solved! (Already Completed)'
                  : `Case Solved! (+${awardedXp} Logic XP)`
                : 'Incorrect Analysis'}
            </AlertTitle>
            <AlertDescription className="text-slate-300 mt-2 leading-relaxed text-xs">
              {serverFeedback}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="border-t border-slate-900 pt-4">
        {!isSolved && (
          <Button
            onClick={handleCheck}
            disabled={!selectedOption || isSubmitting}
            className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl shadow-lg active:scale-95 text-xs"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Evidence...
              </>
            ) : (
              'Analyze Evidence File'
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// --- SUB-COMPONENT: Detective Desk Tab ---
function DetectiveDeskTab({
  schoolId,
  centralCases,
  solvedActivities,
}: {
  schoolId: string | null;
  centralCases: PublicDetectiveCase[];
  solvedActivities: string[];
}) {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(
      () =>
        role === 'Student' && user && schoolId
          ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId))
          : null,
      [role, user, schoolId, firestore]
    )
  );

  const activeGroup = useMemo(() => {
    if (canManage) return adminSelectedGroup;
    if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
    return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const casesQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'think_tank_detective_cases'), where('schoolId', '==', schoolId), limit(50));
  }, [firestore, schoolId]);

  const { data: schoolCases, isLoading, forceRefetch } = useCollection<any>(casesQuery);

  const groupCases = useMemo(() => {
    const getCreatedAtMs = (val: any): number => {
      if (!val) return 0;
      if (typeof val === 'string') {
        const parsed = Date.parse(val);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      if (typeof val.seconds === 'number') {
        return val.seconds * 1000;
      }
      return 0;
    };
    const customList = (schoolCases || [])
      .slice()
      .sort((a: any, b: any) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt))
      .filter((c: any) => c.targetGroup === activeGroup);
    const centralList = centralCases.filter((c) => c.targetGroup === activeGroup);
    return [...customList, ...centralList];
  }, [schoolCases, centralCases, activeGroup]);

  const activeCase = useMemo(() => {
    if (!groupCases.length) return null;
    return (selectedCaseId ? groupCases.find((c: any) => c.id === selectedCaseId) : null) || groupCases[0];
  }, [groupCases, selectedCaseId]);

  const handleGenerateCase = async () => {
    if (!canManage) return;
    setIsGenerating(true);
    toast({ title: 'Investigating...', description: 'Gathering evidence for a new school case.' });

    try {
      const result = await generateSchoolDetectiveCaseAction({
        targetGroup: activeGroup,
      });

      if (!result.success || !result.detectiveCase) {
        throw new Error(result.error || 'Failed to generate school detective case.');
      }

      toast({ title: 'Case File Opened', description: 'New investigation ready.' });
      setSelectedCaseId(result.detectiveCase.id);
      forceRefetch();
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Error', description: e.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!canManage) return;
    try {
      const result = await deleteSchoolDetectiveCaseAction(id);
      if (!result.success) {
        throw new Error(result.error || 'Could not delete detective case.');
      }
      toast({ title: 'Case Closed', description: 'File deleted.' });
      if (selectedCaseId === id) setSelectedCaseId(null);
      forceRefetch();
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: e?.message || 'Could not delete detective case.',
      });
    }
  };

  if (isLoading && groupCases.length === 0) return <Skeleton className="h-64 w-full bg-slate-900" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs px-3 py-1 w-fit font-bold uppercase tracking-wider">
              CLEARANCE: {activeGroup.toUpperCase()}
            </Badge>
            <Badge className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-0.5">
              {groupCases.length} Cases Ready
            </Badge>
          </div>
          {canManage && (
            <Select
              value={adminSelectedGroup}
              onValueChange={(val) => {
                setAdminSelectedGroup(val);
                setSelectedCaseId(null);
              }}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-900 text-slate-300">
                {TARGET_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {activeCase ? (
          <DetectiveCard
            key={activeCase.id}
            caseData={activeCase}
            isStaff={canManage}
            onDelete={activeCase.isCentral ? undefined : () => handleDeleteCase(activeCase.id)}
          />
        ) : (
          <Card className="text-center py-12 border-2 border-dashed border-slate-800 h-full flex flex-col justify-center items-center bg-slate-950/20 rounded-3xl">
            <Search className="h-12 w-12 text-slate-700 mb-2 animate-bounce" />
            <CardTitle className="text-white font-bold text-md">No Active Cases</CardTitle>
            <CardDescription className="text-slate-500 mt-1">
              The desk is currently clear for {activeGroup}.
            </CardDescription>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {canManage && (
          <Card className="bg-amber-500/5 border border-amber-500/10 shadow-sm rounded-3xl">
            <CardContent className="p-4">
              <h3 className="font-extrabold text-amber-400 text-xs mb-2 flex items-center gap-2">
                <PlusCircle className="h-4.5 w-4.5" /> Add Custom School Case (AI)
              </h3>
              <Button
                onClick={handleGenerateCase}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black rounded-xl h-10 text-xs shadow-md"
              >
                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Case File'}
              </Button>
            </CardContent>
          </Card>
        )}
        <Card className="max-h-[540px] flex flex-col bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="py-3 px-4 bg-slate-900/60 border-b border-slate-900 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-white font-black">Case File Archive</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px]">
              {groupCases.filter((c: any) => solvedActivities.includes(c.id)).length}/{groupCases.length} Solved
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-[360px] lg:h-[440px]">
              <div className="flex flex-col p-2 gap-1.5">
                {groupCases.map((c: any) => {
                  const isCompleted = solvedActivities.includes(c.id);
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCaseId(c.id)}
                      className={`text-left p-3.5 rounded-2xl text-xs transition-all border flex justify-between items-center gap-2 group ${
                        c.id === activeCase?.id
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold shadow-md'
                          : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="truncate font-bold text-slate-200 group-hover:text-amber-400 transition-colors">
                            {c.caseType}
                          </span>
                          {isCompleted && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold shrink-0">
                              Solved ✓
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500 truncate block mt-0.5">{c.scenario}</span>
                      </div>
                      {c.id === activeCase?.id && <CheckCircle2 className="h-4.5 w-4.5 text-amber-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Daily Paradox Tab ---
function DailyParadoxTab({
  schoolId,
  centralParadoxes,
  solvedActivities,
  awardedXpByActivity = {},
  lockedBlueprints = [],
}: {
  schoolId: string | null;
  centralParadoxes: PublicParadox[];
  solvedActivities: string[];
  awardedXpByActivity?: Record<string, number>;
  lockedBlueprints?: string[];
}) {
  const { user, isUserLoading } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const [selectedParadoxId, setSelectedParadoxId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(
      () =>
        role === 'Student' && user && schoolId
          ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId))
          : null,
      [role, user, schoolId, firestore]
    )
  );

  const activeGroup = useMemo(() => {
    if (canManage) return adminSelectedGroup;
    if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
    return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const paradoxQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'think_tank_paradoxes'), where('schoolId', '==', schoolId), limit(50));
  }, [firestore, schoolId]);

  const { data: schoolParadoxes, isLoading, forceRefetch } = useCollection<PublicParadox & { createdAt?: any; schoolId?: string }>(paradoxQuery);

  const groupParadoxes = useMemo(() => {
    const getCreatedAtMs = (val: any): number => {
      if (!val) return 0;
      if (typeof val === 'string') {
        const parsed = Date.parse(val);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      if (typeof val.seconds === 'number') {
        return val.seconds * 1000;
      }
      return 0;
    };
    const customList = (schoolParadoxes || [])
      .slice()
      .sort((a, b) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt))
      .filter((p) => p.targetGroup === activeGroup);
    const centralList = centralParadoxes
      .filter((p) => p.targetGroup === activeGroup)
      .map((p) => ({ ...p, createdAt: null }));
    return [...customList, ...centralList];
  }, [schoolParadoxes, centralParadoxes, activeGroup]);

  const activeParadox = useMemo(() => {
    if (!groupParadoxes.length) return null;
    return (selectedParadoxId ? groupParadoxes.find((p) => p.id === selectedParadoxId) : null) || groupParadoxes[0];
  }, [groupParadoxes, selectedParadoxId]);

  const handleParadoxSubmit = async (
    paradoxId: string,
    conclusion: string,
    theory: string
  ) => {
    if (!user || !schoolId) {
      throw new Error('Submission not permitted.');
    }

    if (!activeParadox || activeParadox.id !== paradoxId) {
      throw new Error('Invalid active paradox.');
    }

    const result = await submitThinkTankParadoxAction({
      paradoxId,
      conclusion,
      theory,
    });

    if (!result.success) {
      throw new Error(
        result.error ?? 'Unable to submit paradox.'
      );
    }

    return result;
  };

  const handleParadoxBlueprint = async (
    paradoxId: string
  ) => {
    if (!user || !schoolId) {
      throw new Error('Blueprint access not permitted.');
    }

    if (!activeParadox || activeParadox.id !== paradoxId) {
      throw new Error('Invalid active paradox.');
    }

    const result = await lockThinkTankBlueprintAction(paradoxId);

    if (!result.success || !result.locked) {
      throw new Error(
        result.error ?? 'Unable to unlock blueprint.'
      );
    }

    return result;
  };

  const handleDeleteParadox = async (paradoxId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canManage) return;

    try {
      const result = await deleteSchoolParadoxAction(paradoxId);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast({ title: 'Deleted', description: 'Puzzle removed.' });
      if (selectedParadoxId === paradoxId) setSelectedParadoxId(null);
      forceRefetch();
    } catch (error: any) {
      console.error('Failed to delete school paradox:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error?.message || 'Could not delete puzzle.',
      });
    }
  };

  const handleGenerateParadox = async () => {
    if (!canManage) return;
    setIsGenerating(true);

    try {
      const result = await generateSchoolParadoxAction({
        targetGroup: activeGroup,
      });

      if (!result.success || !result.paradox) {
        throw new Error(result.error);
      }

      toast({ title: 'New Paradox Added!' });
      setSelectedParadoxId(result.paradox.id);
      forceRefetch();
    } catch (error: any) {
      console.error('Failed to generate school paradox:', error);
      toast({
        variant: 'destructive',
        title: 'AI Error',
        description: error?.message || 'Failed to generate school paradox.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if ((isLoading && groupParadoxes.length === 0) || isUserLoading) return <Skeleton className="h-64 w-full bg-slate-900" />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 font-bold">
              LEVEL: {activeGroup.toUpperCase()}
            </Badge>
            <Badge className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-0.5">
              {groupParadoxes.length} Paradoxes Ready
            </Badge>
          </div>
          {canManage && (
            <Select
              value={adminSelectedGroup}
              onValueChange={(val) => {
                setAdminSelectedGroup(val);
                setSelectedParadoxId(null);
              }}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-900 text-slate-300">
                {TARGET_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        {activeParadox ? (
          <ParadoxCard
            key={activeParadox.id}
            paradox={activeParadox}
            initialAwardedXp={
              awardedXpByActivity[activeParadox.id] ??
              (solvedActivities.includes(activeParadox.id) ? 15 : 0)
            }
            isInitiallyLocked={
              lockedBlueprints.includes(activeParadox.id) ||
              solvedActivities.includes(activeParadox.id)
            }
            onSubmitParadox={handleParadoxSubmit}
            onRequestBlueprint={handleParadoxBlueprint}
            onDelete={
              (activeParadox as any).isCentral
                ? undefined
                : () => handleDeleteParadox(activeParadox.id)
            }
            isStaff={
              canManage &&
              !(activeParadox as any).isCentral
            }
          />
        ) : (
          <Card className="text-center py-12 border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-3xl">
            <CardTitle className="text-white font-bold text-md">No Paradox Puzzles Available</CardTitle>
            <CardDescription className="text-slate-500 mt-1">For {activeGroup}</CardDescription>
          </Card>
        )}
      </div>
      <div className="space-y-4">
        {canManage && (
          <Button
            onClick={handleGenerateParadox}
            disabled={isGenerating}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-11 text-xs shadow-lg"
          >
            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Generate Custom School Paradox (AI)'}
          </Button>
        )}
        <Card className="max-h-[540px] flex flex-col bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="py-3 px-4 bg-slate-900/60 border-b border-slate-900 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-white font-black">Paradox Archive</CardTitle>
            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px]">
              {groupParadoxes.filter((p) => solvedActivities.includes(p.id)).length}/{groupParadoxes.length} Solved
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-[360px] lg:h-[440px]">
              <div className="flex flex-col p-2 gap-1.5">
                {groupParadoxes.map((p: any) => {
                  const isCompleted = solvedActivities.includes(p.id);
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedParadoxId(p.id)}
                      className={`p-3.5 rounded-2xl text-xs border flex justify-between items-center cursor-pointer transition-all gap-2 ${
                        p.id === activeParadox?.id
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-md'
                          : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate flex-1 pr-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold text-indigo-400/80 uppercase">{p.difficulty}</span>
                          {isCompleted && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                              Solved ✓
                            </span>
                          )}
                        </div>
                        <span className="truncate block">{p.question}</span>
                      </div>
                      {canManage && !p.isCentral && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl shrink-0"
                          onClick={(e) => handleDeleteParadox(p.id, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- COMPONENT: Interactive Riddle Card ---
function RiddleCard({
  riddle,
}: {
  riddle: PublicRiddle;
}) {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();

  const [guess, setGuess] = useState('');
  const [hintsShown, setHintsShown] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong' | 'revealed'>('idle');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [awardedXp, setAwardedXp] = useState(0);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [alreadyRevealed, setAlreadyRevealed] = useState(false);
  const [revealedAnswer, setRevealedAnswer] = useState('');
  const [revealedExplanation, setRevealedExplanation] = useState('');
  const [serverFeedback, setServerFeedback] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const checkAnswer = async () => {
    const cleanGuess = guess.trim();
    if (!cleanGuess || isSubmitting || isRevealing) return;

    setIsSubmitting(true);
    setActionError(null);

    try {
      const result = await submitThinkTankRiddleAction({
        riddleId: riddle.id,
        guess: cleanGuess,
      });

      if (!result.success) {
        setActionError(result.error || 'Unable to verify riddle guess.');
        return;
      }

      const matched = Boolean(result.correct);
      setAwardedXp(result.awardedXp ?? 0);
      setAlreadyCompleted(Boolean(result.alreadyCompleted));
      setAlreadyRevealed(Boolean(result.alreadyRevealed));
      setServerFeedback(result.feedback ?? '');

      if (matched) {
        setStatus('correct');
        setRevealedAnswer(result.answer ?? '');
        setRevealedExplanation(result.explanation ?? '');
        if ((result.awardedXp ?? 0) > 0) {
          confetti({ particleCount: 110, spread: 65, colors: ['#10b981', '#a855f7', '#f59e0b'] });
        }
      } else {
        setStatus('wrong');
      }

      if (user && firestore && schoolId) {
        try {
          await addDoc(collection(firestore, 'think_tank_submissions'), {
            studentId: user.uid,
            userId: user.uid,
            studentName: user.displayName || user.email,
            type: 'Riddle',
            activityId: riddle.id,
            response: `Guess: "${cleanGuess}" (${matched ? 'Solved!' : 'Try again'})`,
            timestamp: serverTimestamp(),
            schoolId,
          });
        } catch (e) {
          console.error('Failed to log riddle attempt:', e);
        }
      }
    } catch (e: any) {
      setActionError(e?.message || 'Unable to verify riddle guess.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReveal = async () => {
    if (isSubmitting || isRevealing) return;

    setIsRevealing(true);
    setActionError(null);

    try {
      const result = await revealThinkTankRiddleAction({
        riddleId: riddle.id,
      });

      if (!result.success || !result.revealed) {
        setActionError(result.error || 'Unable to reveal riddle solution.');
        return;
      }

      setStatus('revealed');
      setAwardedXp(0);
      setAlreadyCompleted(Boolean(result.alreadyCompleted));
      setAlreadyRevealed(true);
      setRevealedAnswer(result.answer ?? '');
      setRevealedExplanation(result.explanation ?? '');
    } catch (e: any) {
      setActionError(e?.message || 'Unable to reveal riddle solution.');
    } finally {
      setIsRevealing(false);
    }
  };

  return (
    <Card className="border border-slate-900 bg-slate-950/80 backdrop-blur-md rounded-[2rem] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <CardHeader className="border-b border-slate-900 pb-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg text-white font-black flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-emerald-400 animate-pulse" /> Riddle Vault Challenge
            </CardTitle>
            <CardDescription className="text-slate-400 text-xs mt-1">
              Use progressive clues to crack the riddle and earn +15 Logic XP!
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
              {riddle.category}
            </Badge>
            <Badge className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px]">
              {riddle.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 pt-6">
        <div className="p-6 bg-slate-900/50 border border-slate-900 rounded-2xl shadow-inner">
          <p className="text-md sm:text-lg font-serif leading-relaxed text-slate-100 text-center italic">
            &ldquo;{riddle.question}&rdquo;
          </p>
        </div>

        {/* Progressive Hints */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={hintsShown >= 1 || status === 'correct' || status === 'revealed'}
              onClick={() => setHintsShown((h) => Math.max(h, 1))}
              className="h-8 text-xs rounded-xl bg-slate-900 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15"
            >
              <Lightbulb className="h-3.5 w-3.5 mr-1.5 text-emerald-400" />
              {hintsShown >= 1 ? 'Clue 1 Unlocked' : 'Unlock Clue 1'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={hintsShown < 1 || hintsShown >= 2 || status === 'correct' || status === 'revealed'}
              onClick={() => setHintsShown(2)}
              className="h-8 text-xs rounded-xl bg-slate-900 border-amber-500/30 text-amber-300 hover:bg-amber-500/15"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-400" />
              {hintsShown >= 2 ? 'Clue 2 Unlocked' : 'Unlock Clue 2'}
            </Button>
          </div>

          {hintsShown >= 1 && (
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-200 animate-in fade-in">
              <span className="font-bold text-emerald-400 uppercase text-[10px] mr-2">Clue 1:</span>
              {riddle.hint1}
            </div>
          )}
          {hintsShown >= 2 && (
            <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200 animate-in fade-in">
              <span className="font-bold text-amber-400 uppercase text-[10px] mr-2">Clue 2:</span>
              {riddle.hint2}
            </div>
          )}
        </div>

        {actionError && (
          <Alert className="rounded-2xl border bg-rose-950/25 border-rose-500/30 text-rose-300">
            <AlertTriangle className="h-5 w-5 text-rose-400" />
            <AlertTitle className="font-bold text-sm">Action Error</AlertTitle>
            <AlertDescription className="text-slate-300 mt-1 text-xs">
              {actionError}
            </AlertDescription>
          </Alert>
        )}

        {/* Answer Input */}
        {status !== 'correct' && status !== 'revealed' && (
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Type your answer here (e.g. a clock, shadow, 23)..."
                value={guess}
                onChange={(e) => {
                  setGuess(e.target.value);
                  if (status === 'wrong') setStatus('idle');
                  if (actionError) setActionError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                disabled={isSubmitting || isRevealing}
                className="bg-slate-900 border-slate-800 text-white rounded-xl h-11 text-xs focus:ring-1 focus:ring-emerald-500"
              />
              <Button
                onClick={checkAnswer}
                disabled={!guess.trim() || isSubmitting || isRevealing}
                className="h-11 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-black rounded-xl text-xs shrink-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Checking...
                  </>
                ) : (
                  'Check Answer'
                )}
              </Button>
            </div>

            {status === 'wrong' && (
              <div className="flex items-center justify-between bg-rose-950/25 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300">
                <span>{serverFeedback || 'Not quite! Try unlocking a clue or phrasing your answer simply.'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReveal}
                  disabled={isSubmitting || isRevealing}
                  className="text-amber-300 hover:text-white text-xs h-7 px-2.5"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> Reveal Answer
                </Button>
              </div>
            )}

            {status === 'idle' && (
              <div className="flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReveal}
                  disabled={isSubmitting || isRevealing}
                  className="text-slate-400 hover:text-white text-[11px] h-7"
                >
                  <Eye className="h-3.5 w-3.5 mr-1" /> Stumped? Reveal Answer
                </Button>
              </div>
            )}
          </div>
        )}

        {(status === 'correct' || status === 'revealed') && (
          <Alert
            className={cn(
              'rounded-2xl border p-5 animate-in slide-in-from-bottom duration-300',
              status === 'correct'
                ? 'bg-emerald-950/25 border-emerald-500/30 text-emerald-300'
                : 'bg-indigo-950/25 border-indigo-500/30 text-indigo-200'
            )}
          >
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <AlertTitle className="font-bold text-sm text-emerald-400">
              {status === 'correct'
                ? alreadyRevealed
                  ? 'Spot On! (Solution Previously Revealed — 0 XP)'
                  : alreadyCompleted
                  ? 'Spot On! (Already Completed — 0 Additional XP)'
                  : `Spot On! Riddle Cracked (+${awardedXp} Logic XP) 🎉`
                : 'Riddle Solution Revealed (0 XP)'}
            </AlertTitle>
            <AlertDescription className="text-slate-300 mt-2 space-y-2">
              <p className="font-bold text-white text-sm">
                Answer: <span className="text-emerald-300">{revealedAnswer}</span>
              </p>
              <p className="text-xs leading-relaxed text-slate-300">
                {serverFeedback || revealedExplanation}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// --- SUB-COMPONENT: Riddle Vault Tab ---
function RiddleVaultTab({
  schoolId,
  centralRiddles,
  solvedActivities,
}: {
  schoolId: string | null;
  centralRiddles: PublicRiddle[];
  solvedActivities: string[];
}) {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();

  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRiddleId, setSelectedRiddleId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(
      () =>
        role === 'Student' && user && schoolId
          ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId))
          : null,
      [role, user, schoolId, firestore]
    )
  );

  const activeGroup = useMemo(() => {
    if (canManage) return adminSelectedGroup;
    if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
    return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const categories = ['All', 'Word Riddle', 'Math & Logic', 'Science & Nature', 'African Wisdom', 'Lateral Thinking'];

  const groupRiddles = useMemo(() => {
    return centralRiddles.filter(
      (r) => r.targetGroup === activeGroup && (selectedCategory === 'All' || r.category === selectedCategory)
    );
  }, [centralRiddles, activeGroup, selectedCategory]);

  const activeRiddle = useMemo(() => {
    if (!groupRiddles.length) return null;
    return (selectedRiddleId ? groupRiddles.find((r) => r.id === selectedRiddleId) : null) || groupRiddles[0];
  }, [groupRiddles, selectedRiddleId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 font-bold">
              VAULT: {activeGroup.toUpperCase()}
            </Badge>
            <Badge className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-0.5">
              {groupRiddles.length} Riddles Available
            </Badge>
          </div>
          {canManage && (
            <Select
              value={adminSelectedGroup}
              onValueChange={(val) => {
                setAdminSelectedGroup(val);
                setSelectedRiddleId(null);
              }}
            >
              <SelectTrigger className="w-[180px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-900 text-slate-300">
                {TARGET_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedRiddleId(null);
              }}
              className={cn(
                'px-3 py-1 rounded-full text-[11px] font-bold transition-all border',
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeRiddle ? (
          <RiddleCard key={activeRiddle.id} riddle={activeRiddle} />
        ) : (
          <Card className="text-center py-12 border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-3xl">
            <CardTitle className="text-white font-bold text-md">No Riddles in This Category</CardTitle>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        <Card className="max-h-[540px] flex flex-col bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="py-3 px-4 bg-slate-900/60 border-b border-slate-900 flex flex-row items-center justify-between">
            <CardTitle className="text-sm text-white font-black">Riddle Vault List</CardTitle>
            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px]">
              {groupRiddles.filter((r) => solvedActivities.includes(r.id)).length}/{groupRiddles.length} Cracked
            </Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-[380px] lg:h-[460px]">
              <div className="flex flex-col p-2 gap-1.5">
                {groupRiddles.map((r, idx) => {
                  const isCompleted = solvedActivities.includes(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRiddleId(r.id)}
                      className={`text-left p-3.5 rounded-2xl text-xs transition-all border flex justify-between items-center gap-2 ${
                        r.id === activeRiddle?.id
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 font-bold shadow-md'
                          : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-emerald-400">
                            #{idx + 1} • {r.category}
                          </span>
                          {isCompleted && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                              Cracked ✓
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-200 truncate block mt-0.5">{r.question}</span>
                      </div>
                      {r.id === activeRiddle?.id && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: Debate Arena Tab ---
function DebateArenaTab({
  schoolId,
  centralDebates,
  solvedActivities,
}: {
  schoolId: string | null;
  centralDebates: PublicDebate[];
  solvedActivities: string[];
}) {
  const { user } = useUser();
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isGenerating, setIsGenerating] = useState(false);
  const [adminSelectedGroup, setAdminSelectedGroup] = useState(TARGET_GROUPS[2]);
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');

  const { data: studentData } = useCollection<Student>(
    useMemoFirebase(
      () =>
        role === 'Student' && user && schoolId
          ? query(collection(firestore!, 'students'), where('uid', '==', user.uid), where('schoolId', '==', schoolId))
          : null,
      [role, user, schoolId, firestore]
    )
  );

  const activeGroup = useMemo(() => {
    if (canManage) return adminSelectedGroup;
    if (studentData && studentData[0]) return getStudentGroup(studentData[0].classId);
    return 'Scholar (JHS)';
  }, [canManage, adminSelectedGroup, studentData]);

  const topicsQuery = useMemoFirebase(
    () =>
      firestore && schoolId
        ? query(collection(firestore, 'think_tank_debates'), where('schoolId', '==', schoolId), limit(50))
        : null,
    [firestore, schoolId]
  );
  const { data: schoolTopics, isLoading, forceRefetch } = useCollection<PublicDebate & { createdAt?: any; schoolId?: string }>(topicsQuery);

  const groupTopics = useMemo(() => {
    const getCreatedAtMs = (val: any): number => {
      if (!val) return 0;
      if (typeof val === 'string') {
        const parsed = Date.parse(val);
        return Number.isFinite(parsed) ? parsed : 0;
      }
      if (typeof val.seconds === 'number') {
        return val.seconds * 1000;
      }
      return 0;
    };
    const customList = (schoolTopics || [])
      .filter((t) => t.targetGroup === activeGroup)
      .sort((a, b) => getCreatedAtMs(b.createdAt) - getCreatedAtMs(a.createdAt));
    const centralList = centralDebates
      .filter((t) => t.targetGroup === activeGroup)
      .map((t) => ({ ...t, createdAt: null }));
    return [...customList, ...centralList];
  }, [schoolTopics, centralDebates, activeGroup]);

  const activeTopic = useMemo(() => {
    if (!groupTopics.length) return null;
    return (selectedTopicId ? groupTopics.find((t) => t.id === selectedTopicId) : null) || groupTopics[0];
  }, [groupTopics, selectedTopicId]);

  const handleAiGenerate = async () => {
    if (!canManage) return;

    if (!customTopic.trim()) {
      toast({
        title: 'Topic Required',
        description: 'Please enter a topic to generate a debate context.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateSchoolDebateTopicAction({
        targetGroup: activeGroup,
        topic: customTopic,
      });
      if (!result.success || !result.debate) {
        throw new Error(result.error || 'Failed to generate debate motion.');
      }
      toast({ title: 'AI Generated Debate Motion!' });
      setSelectedTopicId(result.debate.id);
      forceRefetch();
      setCustomTopic('');
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'AI Error', description: e.message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteDebate = async (debateId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!canManage) return;
    try {
      const result = await deleteSchoolDebateTopicAction(debateId);
      if (!result.success) {
        throw new Error(result.error || 'Could not delete debate motion.');
      }
      toast({ title: 'Motion Removed', description: 'School debate motion deleted.' });
      if (selectedTopicId === debateId) setSelectedTopicId(null);
      forceRefetch();
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err?.message || 'Could not delete debate motion.',
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-3 py-1 font-bold">
              Arena: {activeGroup}
            </Badge>
            <Badge className="bg-slate-900 text-slate-300 border border-slate-800 text-[10px] px-2.5 py-0.5">
              {groupTopics.length} Motions Ready
            </Badge>
          </div>
          {canManage && (
            <Select
              value={adminSelectedGroup}
              onValueChange={(val) => {
                setAdminSelectedGroup(val);
                setSelectedTopicId(null);
              }}
            >
              <SelectTrigger className="w-[200px] h-8 text-xs bg-slate-900 border-slate-800 text-slate-300 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-950 border-slate-900 text-slate-300">
                {TARGET_GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {isLoading && groupTopics.length === 0 ? (
          <Skeleton className="h-96 w-full bg-slate-900 rounded-[2.5rem] animate-pulse" />
        ) : activeTopic ? (
          <DebateArena key={activeTopic.id} topic={activeTopic} />
        ) : (
          <Card className="text-center py-12 border-2 border-dashed border-slate-800 bg-slate-950/20 rounded-3xl">
            <CardHeader>
              <MessageSquare className="mx-auto h-12 w-12 text-slate-700 mb-2 animate-pulse" />
              <CardTitle className="text-white font-bold text-md">No Active Debate</CardTitle>
              <CardDescription className="text-slate-500 mt-1">
                There is no debate topic set for {activeGroup} yet.
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {canManage && (
          <Card className="bg-slate-900/30 border border-slate-900 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-xs font-black">Add Custom School Debate Motion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom motion..."
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  className="bg-slate-950 border-slate-800 text-white rounded-xl text-xs"
                />
                <Button
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !customTopic.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 text-xs font-bold shrink-0"
                >
                  {isGenerating ? <Loader2 className="animate-spin h-4 w-4" /> : 'Add'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="max-h-[560px] flex flex-col bg-slate-950 border border-slate-900 rounded-3xl overflow-hidden shadow-2xl">
          <CardHeader className="py-3 px-4 bg-slate-900/60 border-b border-slate-900">
            <CardTitle className="text-sm text-white font-black">Debate Motion Archive</CardTitle>
          </CardHeader>
          <CardContent className="p-0 flex-1 min-h-0">
            <ScrollArea className="h-[380px] lg:h-[460px]">
              <div className="flex flex-col p-2 gap-1.5">
                {groupTopics.map((t: any, idx) => {
                  const isCompleted = solvedActivities.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTopicId(t.id)}
                      className={`text-left p-3.5 rounded-2xl text-xs transition-all border flex justify-between items-center cursor-pointer gap-2 ${
                        t.id === activeTopic?.id
                          ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 font-bold shadow-md'
                          : 'bg-slate-900/30 border-transparent hover:bg-slate-900/60 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">Motion #{idx + 1}</span>
                          {isCompleted && (
                            <span className="text-[9px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded-full font-bold">
                              Debated ✓
                            </span>
                          )}
                        </div>
                        <span className="line-clamp-2 text-slate-200 font-semibold">{t.topic}</span>
                      </div>
                      {canManage && !t.isCentral ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl shrink-0"
                          onClick={(e) => handleDeleteDebate(t.id, e)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      ) : (
                        t.id === activeTopic?.id && <CheckCircle2 className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function ThinkTankPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const canManage = ['Teacher', 'Administrator', 'Director'].includes(role || '');
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();

  const [solvedActivities, setSolvedActivities] = useState<string[]>([]);
  const [awardedXpByActivity, setAwardedXpByActivity] = useState<Record<string, number>>({});
  const [lockedBlueprints, setLockedBlueprints] = useState<string[]>([]);
  const [logicPoints, setLogicPoints] = useState(0);
  const [isSyncingCentral, setIsSyncingCentral] = useState(false);
  const hasAutoSyncedRef = useRef(false);

  // Central Repository Fetch (sanitized v2 manifest + 8 public shards; fails closed with no v1 or private fallback)
  const {
    data: centralDocs,
    isLoading: isLoadingCentral,
    refresh: refreshCentralDoc,
  } = useOnceQuery<{
    isVerifiedRemote: boolean;
    reason?: string;
    version?: string;
    sharded?: boolean;
    shardIds?: string[];
    totalCount?: number;
    paradoxes: PublicParadox[];
    detectiveCases: PublicDetectiveCase[];
    riddles: PublicRiddle[];
    debates: PublicDebate[];
  }>(
    firestore ? `think-tank:central:v2:${THINK_TANK_PUBLIC_V2_VERSION}` : null,
    async () => {
      if (!firestore) return [];
      const snap = await getDoc(doc(firestore, 'global_curriculum', 'think_tank_v2'));
      if (!snap.exists()) {
        return [
          {
            isVerifiedRemote: false,
            reason: 'Public v2 curriculum manifest not found.',
            paradoxes: [],
            detectiveCases: [],
            riddles: [],
            debates: [],
          },
        ];
      }
      const manifest = snap.data() as any;

      if (
        manifest.sharded &&
        Array.isArray(manifest.shardIds) &&
        manifest.shardIds.length > 0 &&
        compareCurriculumVersions(manifest.version, THINK_TANK_PUBLIC_V2_VERSION) >= 0
      ) {
        const shardSnaps = await Promise.all(
          manifest.shardIds.map((id: string) => getDoc(doc(firestore, 'global_curriculum', id)))
        );
        const shardDocs: Array<ShardDocumentData | null> = shardSnaps.map((s) =>
          s.exists() ? ({ id: s.id, ...(s.data() as any) } as ShardDocumentData) : null
        );
        const verified = verifyAndAssemblePublicV2Curriculum(
          manifest,
          shardDocs,
          THINK_TANK_PUBLIC_V2_VERSION
        );
        return [
          {
            ...manifest,
            isVerifiedRemote: verified.isVerifiedRemote,
            reason: verified.reason,
            paradoxes: verified.paradoxes,
            detectiveCases: verified.detectiveCases,
            riddles: verified.riddles,
            debates: verified.debates,
          },
        ];
      }
      return [
        {
          ...manifest,
          isVerifiedRemote: false,
          reason: 'Public v2 curriculum manifest failed version or shard structure check.',
          paradoxes: [],
          detectiveCases: [],
          riddles: [],
          debates: [],
        },
      ];
    }
  );
  const centralDoc = centralDocs?.[0] ?? null;
  const publicCurriculumVerified = Boolean(centralDoc?.isVerifiedRemote);

  const centralParadoxes = useMemo(
    () => (publicCurriculumVerified ? centralDoc?.paradoxes ?? [] : []),
    [publicCurriculumVerified, centralDoc]
  );

  const centralCases = useMemo(
    () => (publicCurriculumVerified ? centralDoc?.detectiveCases ?? [] : []),
    [publicCurriculumVerified, centralDoc]
  );

  const centralRiddles = useMemo(
    () => (publicCurriculumVerified ? centralDoc?.riddles ?? [] : []),
    [publicCurriculumVerified, centralDoc]
  );

  const centralDebates = useMemo(
    () => (publicCurriculumVerified ? centralDoc?.debates ?? [] : []),
    [publicCurriculumVerified, centralDoc]
  );

  const handleSyncCentralRepo = async () => {
    setIsSyncingCentral(true);
    try {
      const res = await seedThinkTankCentralRepoAction();
      if (res.success) {
        refreshCentralDoc();
        toast({
          title: 'Central Think Tank Repository Synced!',
          description: res.message,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Sync Failed',
          description: res.error || 'Could not sync central Think Tank repository.',
        });
      }
    } catch (e: any) {
      toast({
        variant: 'destructive',
        title: 'Sync Error',
        description: e?.message || 'Unexpected error syncing repository.',
      });
    } finally {
      setIsSyncingCentral(false);
    }
  };

  // Auto-sync central repository once when an authorized staff member visits and remote v2 shards are out of date
  useEffect(() => {
    if (
      canManage &&
      !isLoadingCentral &&
      centralDocs &&
      !publicCurriculumVerified &&
      !isSyncingCentral &&
      !hasAutoSyncedRef.current
    ) {
      hasAutoSyncedRef.current = true;
      handleSyncCentralRepo();
    }
  }, [canManage, isLoadingCentral, centralDocs, publicCurriculumVerified, isSyncingCentral]);

  // Load progress
  useEffect(() => {
    if (!user || !firestore) return;
    const fetchProgress = async () => {
      try {
        const progressRef = doc(firestore, 'student_progress', user.uid);
        const snap = await getDoc(progressRef);
        if (snap.exists()) {
          const data = snap.data();
          if (data.thinkTankCompleted) setSolvedActivities(data.thinkTankCompleted);
          if (data.thinkTankAwardedXp) setAwardedXpByActivity(data.thinkTankAwardedXp);
          if (Array.isArray(data.thinkTankLockedBlueprints)) setLockedBlueprints(data.thinkTankLockedBlueprints);
          if (data.thinkTankScore) setLogicPoints(data.thinkTankScore);
        }
      } catch (e) {
        console.error('Failed to load think tank progress:', e);
      }
    };
    fetchProgress();
  }, [user, firestore]);

  const nextMilestone = logicPoints < 30 ? 30 : logicPoints < 100 ? 100 : logicPoints < 200 ? 200 : 400;
  const currentThreshold = logicPoints < 30 ? 0 : logicPoints < 100 ? 30 : logicPoints < 200 ? 100 : 200;
  const xpPercentage =
    Math.min(100, Math.round(((logicPoints - currentThreshold) / (nextMilestone - currentThreshold)) * 100)) || 0;

  const sleuthRank =
    logicPoints < 30
      ? 'Mentalist Novice 🧠'
      : logicPoints < 100
      ? 'Logic Sleuth 🕵️'
      : logicPoints < 200
      ? 'Paradox Master 🌀'
      : 'Grandmaster Thinker 👑';

  const totalCentralItems =
    centralParadoxes.length + centralCases.length + centralRiddles.length + centralDebates.length;

  if (isLoadingSchool || isLoadingCentral) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!publicCurriculumVerified) {
    return (
      <div
        role="alert"
        className="space-y-4 p-8 min-h-[320px] bg-slate-950 text-slate-100 rounded-3xl border border-slate-900 shadow-2xl flex flex-col items-center justify-center text-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-amber-400" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-lg font-extrabold text-white">
            The Think Tank challenges are temporarily unavailable. Please try again.
          </h2>
          <p className="text-xs text-slate-400">
            Could not verify the public curriculum shards from the server.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refreshCentralDoc()}
            className="h-9 px-4 text-xs font-bold bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </Button>
          {canManage && (
            <Button
              variant="outline"
              onClick={handleSyncCentralRepo}
              disabled={isSyncingCentral}
              className="h-9 px-4 text-xs font-bold bg-slate-900 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 hover:text-white rounded-xl flex items-center gap-2"
            >
              {isSyncingCentral ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Database className="h-3.5 w-3.5 text-emerald-400" />
              )}
              Sync Central Repo
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-950 text-slate-100 relative rounded-3xl border border-slate-900 shadow-2xl overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-900 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <BrainCircuit className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-3xl font-extrabold tracking-tight text-white">The Think Tank</h1>
              <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[10px]">
                Central Bank • {totalCentralItems} Challenges
              </Badge>
            </div>
            <p className="text-slate-400 text-sm mt-1">
              Sharpen your mind with logic paradoxes, forensic detective cases, interactive riddles, and debate modules.
            </p>
          </div>
        </div>

        {canManage && (
          <Button
            variant="outline"
            onClick={handleSyncCentralRepo}
            disabled={isSyncingCentral}
            className="h-10 px-4 text-xs font-bold bg-slate-900 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/15 hover:text-white rounded-xl flex items-center gap-2 shrink-0"
          >
            {isSyncingCentral ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Database className="h-4 w-4 text-emerald-400" />
            )}
            Sync Central Repo
          </Button>
        )}
      </div>

      {/* --- TOP BAR: GAMIFICATION --- */}
      {!canManage && (
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900/40 backdrop-blur-md p-5 rounded-2xl border border-slate-900 shadow-xl gap-4 shrink-0 mx-1 mt-1 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-2.5 rounded-full">
              <Trophy className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Cognitive Rank</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                {sleuthRank}
                <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] py-0.5 font-mono">
                  {logicPoints} Logic XP • {solvedActivities.length} Solved
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex-grow max-w-lg mx-0 sm:mx-8 w-full sm:w-auto">
            <div className="flex justify-between text-[10px] mb-1">
              <span className="font-bold uppercase tracking-wider text-slate-400">Next Rank Progress</span>
              <span className="font-bold text-indigo-400">
                {xpPercentage}% ({logicPoints}/{nextMilestone} XP)
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-900">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2.5 rounded-full transition-all duration-1000"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="paradox" className="w-full flex-1 flex flex-col min-h-0 relative z-10">
        <TabsList
          className={cn(
            'grid w-full p-1 bg-slate-900 border border-slate-800 rounded-2xl shrink-0',
            canManage ? 'grid-cols-2 sm:grid-cols-5' : 'grid-cols-2 sm:grid-cols-4'
          )}
        >
          <TabsTrigger
            value="paradox"
            className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            Daily Paradox ({centralParadoxes.length})
          </TabsTrigger>
          <TabsTrigger
            value="detective"
            className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg"
          >
            Detective Desk ({centralCases.length})
          </TabsTrigger>
          <TabsTrigger
            value="riddles"
            className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-500 data-[state=active]:text-slate-950 data-[state=active]:shadow-lg"
          >
            Riddle Vault ({centralRiddles.length})
          </TabsTrigger>
          <TabsTrigger
            value="debate"
            className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
          >
            Debate Arena ({centralDebates.length})
          </TabsTrigger>
          {canManage && (
            <TabsTrigger
              value="monitor"
              className="rounded-xl font-bold py-2.5 text-xs sm:text-sm text-slate-400 hover:text-white transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg"
            >
              <Activity className="mr-2 h-4 w-4" /> Activity Log
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="paradox" className="mt-6 flex-1">
          <DailyParadoxTab
            schoolId={schoolId}
            centralParadoxes={centralParadoxes}
            solvedActivities={solvedActivities}
            awardedXpByActivity={awardedXpByActivity}
            lockedBlueprints={lockedBlueprints}
          />
        </TabsContent>
        <TabsContent value="detective" className="mt-6 flex-1">
          <DetectiveDeskTab
            schoolId={schoolId}
            centralCases={centralCases}
            solvedActivities={solvedActivities}
          />
        </TabsContent>
        <TabsContent value="riddles" className="mt-6 flex-1">
          <RiddleVaultTab
            schoolId={schoolId}
            centralRiddles={centralRiddles}
            solvedActivities={solvedActivities}
          />
        </TabsContent>
        <TabsContent value="debate" className="mt-6 flex-1">
          <DebateArenaTab
            schoolId={schoolId}
            centralDebates={centralDebates}
            solvedActivities={solvedActivities}
          />
        </TabsContent>
        {canManage && (
          <TabsContent value="monitor" className="mt-6 flex-1">
            <TeacherMonitorTab schoolId={schoolId} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
