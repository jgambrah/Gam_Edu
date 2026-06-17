'use client';

import { useState, useMemo, useEffect } from 'react';
import { useUser, useCollection, useFirestore, useMemoFirebase, useDoc } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LessonPlan } from '@/lib/types';
import { 
  ClipboardList, Loader2, PlusCircle, Search, Edit, Trash2, Copy, Download, 
  Sparkles, Target, Activity, BookOpen, Lock, FileText, Calendar, BookOpenCheck,
  CheckCircle, ArrowLeftRight, HelpCircle
} from 'lucide-react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { LessonPlanForm } from './lesson-plan-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { generateLessonEnhancementsAction } from '@/app/actions/insights-ai';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ReactMarkdown from 'react-markdown';
import CreditBalance from '@/components/CreditBalance';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const toDateSafe = (d: any): Date => {
  if (!d) return new Date();
  if (typeof d.toDate === 'function') return d.toDate();
  if (d instanceof Date) return d;
  if (d.seconds) return new Date(d.seconds * 1000);
  return new Date(d);
};

type ClassData = { id: string, name: string };
type StaffData = { uid: string, firstName: string, lastName: string };

export default function LessonPlanningPage() {
  const { role, profile } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const { toast } = useToast();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('all');
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isEnhancingAI, setIsEnhancingAI] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'ai-review'>('details');

  const [editingPlan, setEditingPlan] = useState<LessonPlan & { teacherName?: string } | undefined>(undefined);
  const [duplicatingPlan, setDuplicatingPlan] = useState<LessonPlan | undefined>(undefined);

  const canAccess = role === 'Teacher' || role === 'Administrator' || role === 'Director';
  const isAdminOrDirector = role === 'Administrator' || role === 'Director';

  const plansQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'lesson-plans'), where('schoolId', '==', schoolId), orderBy('date', 'desc'));
    if (role === 'Teacher') {
      q = query(q, where('teacherId', '==', user.uid));
    }
    return q;
  }, [firestore, user, role, schoolId]);
  const { data: lessonPlans, isLoading: isLoadingPlans, forceRefetch: forceRefetchPlans } = useCollection<LessonPlan>(plansQuery);

  const classesQuery = useMemoFirebase(() => {
    if (!user || !firestore || !schoolId) return null;
    let q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
    if (role === 'Teacher') {
      q = query(q, where('teacherId', '==', user.uid));
    }
    return q;
  }, [firestore, user, role, schoolId]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<ClassData>(classesQuery);

  const staffQuery = useMemoFirebase(() => 
    (firestore && schoolId && isAdminOrDirector) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null, 
    [firestore, schoolId, isAdminOrDirector]
  );
  const { data: staff, isLoading: isLoadingStaff } = useCollection<StaffData>(staffQuery);
  
  const isLoading = isLoadingPlans || isLoadingClasses || (isAdminOrDirector && isLoadingStaff) || isLoadingSchool;

  const enrichedLessonPlans = useMemo(() => {
    if (!lessonPlans || !classes) return [];
    
    return lessonPlans.map(plan => {
      const className = classes.find(c => c.id === plan.classId)?.name || 'Unknown Class';
      
      let teacherName = 'Unknown Teacher';
      if (role === 'Teacher' && plan.teacherId === user?.uid) {
          teacherName = profile?.firstName ? `${profile.firstName} ${profile.lastName || ''}` : 'Me';
      } else if (staff) {
          const teacher = staff.find(s => s.uid === plan.teacherId);
          teacherName = teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Unknown Teacher';
      }
      
      return { ...plan, className, teacherName };
    });
  }, [lessonPlans, classes, staff, role, profile, user?.uid]);

  // Auto-select first plan when list loads
  useEffect(() => {
    if (enrichedLessonPlans && enrichedLessonPlans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(enrichedLessonPlans[0].id);
    }
  }, [enrichedLessonPlans, selectedPlanId]);

  // Date filters ranges
  const startOfCurrentWeek = useMemo(() => startOfWeek(new Date(), { weekStartsOn: 1 }), []);
  const endOfCurrentWeek = useMemo(() => endOfWeek(new Date(), { weekStartsOn: 1 }), []);

  // Stats Calculations
  const stats = useMemo(() => {
    if (!lessonPlans) return { total: 0, classesCount: 0, thisWeek: 0, aiEnhanced: 0 };
    
    const uniqueClasses = new Set(lessonPlans.map(p => p.classId)).size;
    const thisWeek = lessonPlans.filter(p => {
      const d = toDateSafe(p.date);
      return d >= startOfCurrentWeek && d <= endOfCurrentWeek;
    }).length;
    
    const aiEnhanced = lessonPlans.filter(p => !!(p as any).aiReview).length;

    return {
      total: lessonPlans.length,
      classesCount: uniqueClasses,
      thisWeek,
      aiEnhanced
    };
  }, [lessonPlans, startOfCurrentWeek, endOfCurrentWeek]);

  // Filtering Logic
  const filteredPlans = useMemo(() => {
    return enrichedLessonPlans.filter(plan => {
      // 1. Search Query Filter
      const matchesSearch = searchQuery === '' || 
        plan.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.objectives.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.activities.toLowerCase().includes(searchQuery.toLowerCase());
        
      // 2. Class Filter
      const matchesClass = selectedClassFilter === 'all' || plan.classId === selectedClassFilter;
      
      // 3. Date Filter
      const planDate = toDateSafe(plan.date);
      const today = new Date();
      const isToday = planDate.toDateString() === today.toDateString();
      
      let matchesDate = true;
      if (selectedDateFilter === 'today') {
        matchesDate = isToday;
      } else if (selectedDateFilter === 'this-week') {
        matchesDate = planDate >= startOfCurrentWeek && planDate <= endOfCurrentWeek;
      } else if (selectedDateFilter === 'upcoming') {
        matchesDate = planDate >= today;
      }
      
      return matchesSearch && matchesClass && matchesDate;
    });
  }, [enrichedLessonPlans, searchQuery, selectedClassFilter, selectedDateFilter, startOfCurrentWeek, endOfCurrentWeek]);

  // Active Plan Object
  const activePlan = useMemo(() => {
    if (!selectedPlanId || !enrichedLessonPlans) return null;
    return enrichedLessonPlans.find(p => p.id === selectedPlanId) || null;
  }, [selectedPlanId, enrichedLessonPlans]);

  // AI Enhancer Logic
  const handleEnhancePlan = async (plan: any) => {
    if (!schoolId) return;
    setIsEnhancingAI(true);
    toast({ title: "AI is analyzing...", description: "Developing custom pedagogical suggestions for your lesson plan." });

    try {
      const res = await generateLessonEnhancementsAction(
        schoolId,
        plan.topic,
        plan.objectives,
        plan.activities,
        plan.materials
      );

      if (res.success && res.text) {
        // Save to Firestore
        const docRef = doc(firestore!, 'lesson-plans', plan.id);
        await updateDoc(docRef, {
          aiReview: res.text,
          updatedAt: new Date(),
        });
        toast({ title: "Enhancements Saved", description: "AI suggestions have been successfully written to the plan." });
        forceRefetchPlans();
        setActiveTab('ai-review');
      } else {
        toast({ variant: 'destructive', title: "AI Generation Failed", description: res.error || "An unknown error occurred." });
      }
    } catch (err: any) {
      console.error(err);
      toast({ variant: 'destructive', title: "Process Error", description: err.message || "Could not generate enhancements." });
    } finally {
      setIsEnhancingAI(false);
    }
  };

  // Delete Plan Logic
  const handleDeletePlan = async (id: string) => {
    if (!firestore) return;
    if (!confirm("Are you sure you want to delete this lesson plan? This action is permanent and cannot be undone.")) return;

    try {
      await deleteDoc(doc(firestore, 'lesson-plans', id));
      toast({ title: "Deleted", description: "Lesson plan has been removed." });
      
      if (selectedPlanId === id) {
        setSelectedPlanId('');
      }
      forceRefetchPlans();
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Deletion Failed", description: err.message });
    }
  };

  // PDF Export Logic
  const handleExportPDF = async () => {
    const element = document.getElementById('printable-lesson-plan');
    if (!element) return;
    
    setIsExportingPDF(true);
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Fitting canvas within A4 limits (210mm x 297mm)
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, 297));
      pdf.save(`Lesson_Plan_${activePlan?.topic.replace(/\s+/g, '_') || 'Export'}.pdf`);
      toast({ title: "PDF Export Complete", description: "Lesson plan saved to your downloads." });
    } catch (e) {
      console.error("PDF Export error:", e);
      toast({ variant: 'destructive', title: "Export Failed", description: "Could not render the plan as a PDF file." });
    } finally {
      setIsExportingPDF(false);
    }
  };

  if (!canAccess) {
    return (
      <Card className="border-red-200/50 shadow-md">
        <CardHeader className="bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-400">
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This workspace is restricted to Teachers, Administrators, and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      {/* Premium Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white p-6 shadow-lg border border-purple-900/50">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <ClipboardList className="h-40 w-40 transform rotate-12 text-purple-300" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="bg-purple-500/20 p-2 rounded-xl border border-purple-500/30">
                <ClipboardList className="h-6 w-6 text-purple-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Lesson Planner</h1>
            </div>
            <p className="text-slate-400 text-sm max-w-xl">
              Design engaging learning paths, generate structured activities with AI, and maintain a centralized catalog.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <CreditBalance />
            <Button 
              onClick={() => {
                setEditingPlan(undefined);
                setDuplicatingPlan(undefined);
                setIsCreateOpen(true);
              }}
              disabled={isLoading || !schoolId}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-900/30 border border-purple-500/50 rounded-xl px-4 py-2 flex items-center gap-2 transition-all duration-300 active:scale-95"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              <span>Create Lesson Plan</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Plans */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-purple-100 dark:bg-purple-950/40 p-2.5 rounded-xl text-purple-700 dark:text-purple-400">
              <ClipboardList className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Total Lesson Plans</p>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.total}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Classes Active */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-cyan-100 dark:bg-cyan-950/40 p-2.5 rounded-xl text-cyan-700 dark:text-cyan-400">
              <BookOpenCheck className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Classes Covered</p>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.classesCount}</h3>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Target */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-amber-100 dark:bg-amber-950/40 p-2.5 rounded-xl text-amber-700 dark:text-amber-400">
              <Calendar className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Plans This Week</p>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.thisWeek}</h3>
            </div>
          </CardContent>
        </Card>

        {/* AI Enhanced */}
        <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-emerald-100 dark:bg-emerald-950/40 p-2.5 rounded-xl text-emerald-700 dark:text-emerald-400">
              <Sparkles className="h-5.5 w-5.5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">AI-Reviewed Plans</p>
              <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">{isLoading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : stats.aiEnhanced}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Master Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* Left Side: Filter and Scrollable List */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white dark:bg-slate-950">
            <CardContent className="p-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search topic or objectives..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-slate-200 focus:border-purple-500 rounded-xl transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Select value={selectedClassFilter} onValueChange={setSelectedClassFilter}>
                  <SelectTrigger className="border-slate-200 focus:border-purple-500 rounded-xl text-xs h-9">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {classes?.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedDateFilter} onValueChange={setSelectedDateFilter}>
                  <SelectTrigger className="border-slate-200 focus:border-purple-500 rounded-xl text-xs h-9">
                    <SelectValue placeholder="All Dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Dates</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Plans List */}
          <ScrollArea className="h-[520px] pr-2">
            <div className="space-y-3">
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                  <Skeleton className="h-28 w-full rounded-xl" />
                </div>
              ) : filteredPlans.length > 0 ? (
                filteredPlans.map(plan => {
                  const isSelected = plan.id === selectedPlanId;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlanId(plan.id);
                        setActiveTab('details');
                      }}
                      className={cn(
                        "p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md hover:border-purple-300 dark:hover:border-purple-800 relative group",
                        isSelected 
                          ? "bg-purple-50/50 border-purple-500 shadow-sm dark:bg-purple-950/20 dark:border-purple-500" 
                          : "bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-l-xl" />
                      )}
                      
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1 min-w-0">
                          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 truncate text-sm md:text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {plan.topic}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 items-center text-[11px] text-slate-500">
                            <span className="font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                              {plan.className}
                            </span>
                            <span>•</span>
                            <span>{format(toDateSafe(plan.date), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                        
                        {(plan as any).aiReview && (
                          <span className="bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-400 px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-0.5 shadow-sm shrink-0">
                            <Sparkles className="h-2.5 w-2.5 fill-current" />
                            AI Enhanced
                          </span>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                        {plan.objectives}
                      </p>

                      {role !== 'Teacher' && (
                        <div className="text-[10px] text-slate-400 mt-2.5 italic flex items-center gap-1">
                          <span>by:</span>
                          <span className="font-semibold">{plan.teacherName}</span>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-14 px-4 border border-dashed rounded-xl border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
                  <ClipboardList className="h-8 w-8 mx-auto text-slate-400 animate-pulse mb-3" />
                  <p className="text-slate-600 text-sm font-bold">No lesson plans found</p>
                  <p className="text-xs text-slate-400 mt-1">Refine your filter search or create a new plan.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side: High Fidelity Detail view */}
        <div className="lg:col-span-3">
          {activePlan ? (
            <Card className="border-slate-200/80 shadow-md dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden flex flex-col h-[660px]">
              
              {/* Printable Area Wrapper */}
              <div id="printable-lesson-plan" className="flex flex-col flex-1 overflow-hidden bg-white dark:bg-slate-950">
                {/* Visual Header */}
                <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 border-b border-indigo-950 relative shrink-0">
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <ClipboardList className="h-24 w-24" />
                  </div>
                  
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                    <div className="space-y-1 min-w-0">
                      <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {activePlan.className}
                      </span>
                      <h2 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1 leading-tight truncate">
                        {activePlan.topic}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-400 text-xs mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-purple-400" />
                          {format(toDateSafe(activePlan.date), 'PPPP')}
                        </span>
                        <span>•</span>
                        <span>Created by: <strong className="text-slate-200">{activePlan.teacherName}</strong></span>
                      </div>
                    </div>
                    
                    {/* Action Bar */}
                    <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                      {(role === 'Administrator' || role === 'Director' || activePlan.teacherId === user?.uid) && (
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => {
                            setEditingPlan(activePlan);
                            setIsEditOpen(true);
                          }}
                          className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white rounded-xl h-8.5 w-8.5 shadow-sm"
                          title="Edit Lesson Plan"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={() => {
                          setDuplicatingPlan(activePlan);
                          setIsCreateOpen(true);
                        }}
                        className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white rounded-xl h-8.5 w-8.5 shadow-sm"
                        title="Duplicate Plan"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>

                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={handleExportPDF}
                        disabled={isExportingPDF}
                        className="bg-white/10 hover:bg-white/20 border-white/20 hover:border-white/30 text-white rounded-xl h-8.5 w-8.5 shadow-sm"
                        title="Export to PDF"
                      >
                        {isExportingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      </Button>

                      {(role === 'Administrator' || role === 'Director' || activePlan.teacherId === user?.uid) && (
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={() => handleDeletePlan(activePlan.id)}
                          className="rounded-xl h-8.5 w-8.5 shadow-sm hover:bg-red-600 transition-colors"
                          title="Delete Plan"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Navigation Tabs */}
                  <div className="flex gap-4 mt-5 border-t border-white/10 pt-3 text-xs md:text-sm">
                    <button 
                      onClick={() => setActiveTab('details')}
                      className={cn(
                        "pb-1 border-b-2 font-semibold transition-all duration-200 flex items-center gap-1.5",
                        activeTab === 'details' 
                          ? "border-purple-400 text-purple-300" 
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <FileText className="h-4 w-4" />
                      Plan Content
                    </button>
                    <button 
                      onClick={() => setActiveTab('ai-review')}
                      className={cn(
                        "pb-1 border-b-2 font-semibold transition-all duration-200 flex items-center gap-1.5 relative",
                        activeTab === 'ai-review' 
                          ? "border-purple-400 text-purple-300" 
                          : "border-transparent text-slate-400 hover:text-slate-200"
                      )}
                    >
                      <Sparkles className="h-4 w-4" />
                      Pedagogical AI Insights
                      {!(activePlan as any).aiReview && (
                        <span className="absolute -top-1 -right-2.5 h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Content Area */}
                <ScrollArea className="flex-1 p-5 bg-slate-50/50 dark:bg-slate-900/10">
                  {activeTab === 'details' ? (
                    <div className="space-y-5">
                      {/* Learning Objectives */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-400 font-bold border-b pb-1.5 text-sm md:text-base">
                          <Target className="h-4.5 w-4.5 text-emerald-600" />
                          <h3>Learning Objectives</h3>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-xs md:text-sm">
                          {activePlan.objectives}
                        </div>
                      </div>

                      {/* Activities */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400 font-bold border-b pb-1.5 text-sm md:text-base">
                          <Activity className="h-4.5 w-4.5 text-amber-600" />
                          <h3>Activities & Classroom Tasks</h3>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-xs md:text-sm">
                          {activePlan.activities}
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2 text-blue-700 dark:text-blue-400 font-bold border-b pb-1.5 text-sm md:text-base">
                          <BookOpen className="h-4.5 w-4.5 text-blue-600" />
                          <h3>Materials & Resources</h3>
                        </div>
                        <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-xs md:text-sm">
                          {activePlan.materials}
                        </div>
                      </div>

                      {/* Notes */}
                      {activePlan.notes && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm rounded-xl p-4">
                          <div className="flex items-center gap-2 mb-2 text-slate-700 dark:text-slate-300 font-bold border-b pb-1.5 text-sm md:text-base">
                            <Lock className="h-4 w-4 text-slate-500" />
                            <h3>Teacher's Reflection Notes</h3>
                          </div>
                          <div className="prose prose-sm max-w-none text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-wrap italic text-xs md:text-sm">
                            {activePlan.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // AI Review Tab
                    <div className="space-y-4">
                      {(activePlan as any).aiReview ? (
                        <div className="bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/50 shadow-sm rounded-xl p-5 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Sparkles className="h-20 w-20 text-purple-600" />
                          </div>
                          <div className="flex justify-between items-center border-b pb-2.5 mb-3">
                            <div className="flex items-center gap-2 text-purple-700 dark:text-purple-400 font-extrabold text-sm md:text-base">
                              <Sparkles className="h-4.5 w-4.5 text-purple-600 animate-pulse" />
                              <h3>AI Pedagogical Review</h3>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEnhancePlan(activePlan)}
                              disabled={isEnhancingAI}
                              className="text-xs border-purple-200 text-purple-700 hover:bg-purple-50 dark:border-purple-800 dark:text-purple-400 dark:hover:bg-purple-950/20 px-3.5 rounded-full"
                            >
                              {isEnhancingAI ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : <Sparkles className="h-3 w-3 mr-1.5" />}
                              Re-generate (2 Credits)
                            </Button>
                          </div>
                          <div className="prose prose-sm max-w-none text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap text-xs md:text-sm">
                            <ReactMarkdown>{(activePlan as any).aiReview}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 border border-dashed rounded-xl border-purple-200 dark:border-purple-900/50 shadow-sm">
                          <Sparkles className="h-10 w-10 text-purple-400 animate-bounce mx-auto mb-4" />
                          <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-lg mb-2">Pedagogical Review by AI</h3>
                          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                            Analyze this lesson structure to generate **differentiation strategies** (support/extension), **common misconceptions**, and **assessment questions**.
                          </p>
                          <Button 
                            onClick={() => handleEnhancePlan(activePlan)}
                            disabled={isEnhancingAI || !schoolId}
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-purple-500/20 active:scale-95 transition-all flex items-center gap-2 mx-auto"
                          >
                            {isEnhancingAI ? (
                              <>
                                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                                Generating Enhancements...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4.5 w-4.5 fill-current" />
                                Review & Enhance (-2 Credits)
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </ScrollArea>
              </div>

            </Card>
          ) : (
            <Card className="border-slate-200/80 shadow-sm dark:border-slate-800 bg-white/50 dark:bg-slate-950/20 h-[660px] flex items-center justify-center p-6 text-center border-dashed">
              <div className="space-y-4 max-w-sm">
                <div className="bg-purple-100 dark:bg-purple-950/40 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto text-purple-600 border border-purple-200 dark:border-purple-900/50">
                  <ClipboardList className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-slate-200">No Lesson Plan Selected</h3>
                  <p className="text-slate-500 text-sm mt-1.5 leading-relaxed">
                    Select a plan from the list to review objectives, materials, print a copy, or activate AI-guided pedagogical review.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-purple-600" />
              {duplicatingPlan ? "Duplicate Lesson Plan" : "Create New Lesson Plan"}
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-slate-500">
              {duplicatingPlan 
                ? "Review pre-populated fields and choose a new class or date for the copy." 
                : "Fill out the fields below or request AI assistance to kickstart your plan."}
            </DialogDescription>
          </DialogHeader>
          <LessonPlanForm 
            setOpen={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                setDuplicatingPlan(undefined);
              }
            }} 
            classes={classes || []} 
            initialData={duplicatingPlan}
          />
        </DialogContent>
      </Dialog>

      {/* Editing Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[650px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Edit className="h-5 w-5 text-purple-600" />
              Edit Lesson Plan
            </DialogTitle>
            <DialogDescription className="text-xs md:text-sm text-slate-500">
              Modify the learning parameters, notes, or objectives for this plan.
            </DialogDescription>
          </DialogHeader>
          {editingPlan && (
            <LessonPlanForm 
              setOpen={setIsEditOpen} 
              classes={classes || []} 
              planId={editingPlan.id}
              initialData={editingPlan}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
