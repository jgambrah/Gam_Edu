'use client';

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc, updateDoc, increment, serverTimestamp, getDocs, limit } from 'firebase/firestore';
import { Student } from '@/lib/types';
import { BADGE_CATALOG, calculateStudentLevel, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { 
  Trophy, Award, Star, Search, PlusCircle, Printer, Sparkles, Loader2, 
  Landmark, CheckCircle2, Download, MapPin, Phone, Mail, FileText, Trash2, 
  ShieldAlert, Zap, Calendar, Filter, Layers3, Users, RotateCcw
} from 'lucide-react';
import { StudentBadgeShowcase } from '@/components/achievements/StudentBadgeShowcase';
import { SectionHeroBanner } from '@/components/common/SectionHeroBanner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AchievementsPage() {
  const { role, profile } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<string>('current');
  const [selectedTerm, setSelectedTerm] = useState<string>('All');

  // Manual Award Modal State
  const [awardClassId, setAwardClassId] = useState<string>('');
  const [awardStudentId, setAwardStudentId] = useState<string>('');
  const [awardSearchTerm, setAwardSearchTerm] = useState<string>('');
  const [awardBadgeId, setAwardBadgeId] = useState<string>(BADGE_CATALOG[0].id);
  const [isAwardOpen, setIsAwardOpen] = useState(false);
  const [awardClassStudents, setAwardClassStudents] = useState<Student[]>([]);
  const [loadingAwardClass, setLoadingAwardClass] = useState(false);

  // Manage & Revoke Badges Modal State
  const [manageStudent, setManageStudent] = useState<any | null>(null);
  const [isManageDialogOpen, setIsManageDialogOpen] = useState(false);

  // Certificate Modal & PDF Generation State
  const [certStudent, setCertStudent] = useState<any | null>(null);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  // ── ON-DEMAND COHORT DATA STATE ──
  const [loadedStudents, setLoadedStudents] = useState<Student[] | null>(null);
  const [isLoadingOnDemand, setIsLoadingOnDemand] = useState(false);
  const [loadedClassId, setLoadedClassId] = useState<string>('');

  // Fetch School Profile for School Name, Address, Logo, Brand Colors, and Signature
  const schoolRef = useMemoFirebase(
    () => (firestore && schoolId ? doc(firestore, 'schools', schoolId) : null),
    [firestore, schoolId]
  );
  const { data: schoolProfile } = useDoc<any>(schoolRef);

  const schoolName = schoolProfile?.name || schoolProfile?.schoolName || 'GAM EDU ACADEMY';
  const schoolMotto = schoolProfile?.motto || 'Excellence, Integrity & Leadership';
  const schoolAddress = schoolProfile?.address || schoolProfile?.location || schoolProfile?.city || '';
  const schoolPhone = schoolProfile?.phone || schoolProfile?.contactPhone || '';
  const schoolEmail = schoolProfile?.email || schoolProfile?.contactEmail || '';
  const schoolLogo = schoolProfile?.logoUrl || schoolProfile?.logo || '';
  const brandColor = schoolProfile?.brandColor || schoolProfile?.primaryColor || '#1e1b4b';
  const secondaryColor = schoolProfile?.secondaryColor || '#d97706';

  // Lightweight Classes Query (~12 documents, minimal reads)
  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: rawClasses } = useCollection<any>(classesQuery);
  const classes = rawClasses || [];

  const classNameMap = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach((c: any) => {
      const name = c.name || c.className || c.title || c.gradeLevel;
      if (c.id && name && name !== c.id) {
        map.set(c.id, name);
        map.set(c.id.toLowerCase(), name);
      }
      if (c.code && name) {
        map.set(c.code, name);
        map.set(c.code.toLowerCase(), name);
      }
    });
    return map;
  }, [classes]);

  const getStudentClassName = (student: any) => {
    if (!student) return 'Unassigned';
    const isUid = (val: string) => /^[a-zA-Z0-9_-]{15,}$/.test(val.trim());
    const candidates = [
      student.classId,
      student.className,
      student.gradeLevel,
      student.currentClass,
      student.class,
      student.grade,
    ].filter(Boolean);

    for (const cand of candidates) {
      if (typeof cand === 'string') {
        const trimmed = cand.trim();
        if (classNameMap.has(trimmed)) return classNameMap.get(trimmed)!;
        if (classNameMap.has(trimmed.toLowerCase())) return classNameMap.get(trimmed.toLowerCase())!;
      }
    }

    for (const cand of candidates) {
      if (typeof cand === 'string' && cand.trim() && !isUid(cand)) {
        const val = cand.trim();
        if (/^bs-\d+$/i.test(val)) return `BS ${val.split('-')[1]}`;
        if (/^bs\d+$/i.test(val)) return `BS ${val.replace(/^bs/i, '')}`;
        if (/^kg-\d+$/i.test(val)) return `KG ${val.split('-')[1]}`;
        if (/^kg\d+$/i.test(val)) return `KG ${val.replace(/^kg/i, '')}`;
        if (/^jhs-\d+$/i.test(val)) return `JHS ${val.split('-')[1]}`;
        if (/^jhs\d+$/i.test(val)) return `JHS ${val.replace(/^jhs/i, '')}`;
        if (/^shs-\d+$/i.test(val)) return `SHS ${val.split('-')[1]}`;
        if (/^primary-\d+$/i.test(val)) return `Primary ${val.split('-')[1]}`;
        return val;
      }
    }

    return 'Assigned Class';
  };

  // Staff query for teacher signatures
  const staffQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: rawStaff } = useCollection<any>(staffQuery);
  const staffList = rawStaff || [];

  const getTeacherSignatureAndName = (student: any) => {
    if (!student) return { signature: null, name: 'Class Teacher' };
    const studentClassId = student.classId || student.gradeLevel;
    const matchedClass = classes.find((c: any) => c.id === studentClassId || c.code === studentClassId);

    let teacherStaff: any = null;
    if (matchedClass?.teacherId || matchedClass?.classTeacherId) {
      const tId = matchedClass.teacherId || matchedClass.classTeacherId;
      teacherStaff = staffList.find((s: any) => s.id === tId || s.uid === tId);
    }
    if (!teacherStaff && studentClassId) {
      teacherStaff = staffList.find(
        (s: any) => s.classId === studentClassId || s.assignedClassId === studentClassId || s.homeRoomId === studentClassId
      );
    }
    if (!teacherStaff && profile && (role === 'Teacher' || profile?.role === 'Teacher')) {
      teacherStaff = profile;
    }
    if (!teacherStaff) {
      teacherStaff = staffList.find(
        (s: any) =>
          (s.role === 'Teacher' || s.designation?.toLowerCase().includes('teacher')) &&
          (s.signatureBase64 || s.signatureUrl || s.signature)
      );
    }

    const signature =
      teacherStaff?.signatureBase64 ||
      teacherStaff?.signatureUrl ||
      teacherStaff?.signature ||
      profile?.signatureBase64 ||
      profile?.signatureUrl ||
      null;

    const name = teacherStaff
      ? teacherStaff.fullName ||
        `${teacherStaff.firstName || ''} ${teacherStaff.lastName || ''}`.trim() ||
        teacherStaff.name ||
        'Class Teacher'
      : profile?.firstName
      ? `${profile.firstName} ${profile.lastName || ''}`.trim()
      : 'Class Teacher';

    return { signature, name: name || 'Class Teacher' };
  };

  const isStudentRole = role === 'Student';

  // ── FOR STUDENTS: Query only their single student record (cost = 1 read only) ──
  const studentSelfQuery = useMemoFirebase(() =>
    (firestore && schoolId && isStudentRole && user?.uid)
      ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('uid', '==', user.uid), limit(1))
      : null
  , [firestore, schoolId, isStudentRole, user?.uid]);
  const { data: selfStudentList } = useCollection<Student>(studentSelfQuery);
  const currentStudent = selfStudentList?.[0] || null;

  // ── ON-DEMAND CLASS/PERIOD FETCHER ──
  const handleLoadClassLeaderboard = useCallback(async (targetClassId?: string) => {
    const classIdToLoad = targetClassId || selectedClass;
    if (!firestore || !schoolId) return;
    if (!classIdToLoad) {
      toast({
        variant: 'destructive',
        title: 'Select a Class',
        description: 'Please select a specific class to view its gamification rankings. Bulk loading all school classes at once is disabled to protect database quota.',
      });
      return;
    }

    setIsLoadingOnDemand(true);
    try {
      const q = query(
        collection(firestore, 'students'),
        where('schoolId', '==', schoolId),
        where('classId', '==', classIdToLoad),
        limit(100)
      );
      const snap = await getDocs(q);
      const studentsInClass = snap.docs.map(d => ({ id: d.id, ...d.data() } as Student));
      
      setLoadedStudents(studentsInClass);
      setLoadedClassId(classIdToLoad);

      const targetClassName = classNameMap.get(classIdToLoad) || 'Selected Class';
      toast({
        title: 'Class Leaderboard Loaded',
        description: `Loaded ${studentsInClass.length} student records for ${targetClassName}.`,
      });
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Error loading leaderboard',
        description: err?.message || 'Failed to load students for the selected class.',
      });
    } finally {
      setIsLoadingOnDemand(false);
    }
  }, [firestore, schoolId, selectedClass, classNameMap, toast]);

  // Handle Class change in the Award modal
  const handleAwardClassChange = async (clsId: string) => {
    setAwardClassId(clsId);
    setAwardStudentId('');
    if (clsId === loadedClassId && loadedStudents) {
      setAwardClassStudents(loadedStudents);
      return;
    }
    if (!firestore || !schoolId || !clsId) {
      setAwardClassStudents([]);
      return;
    }
    setLoadingAwardClass(true);
    try {
      const q = query(
        collection(firestore, 'students'),
        where('schoolId', '==', schoolId),
        where('classId', '==', clsId),
        limit(100)
      );
      const snap = await getDocs(q);
      setAwardClassStudents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Student)));
    } catch (e) {
      console.error('Failed to load students for award modal', e);
    } finally {
      setLoadingAwardClass(false);
    }
  };

  // Synchronize award modal default class when opened
  useEffect(() => {
    if (isAwardOpen && !awardClassId) {
      if (selectedClass) {
        handleAwardClassChange(selectedClass);
      } else if (classes.length > 0) {
        handleAwardClassChange(classes[0].id);
      }
    }
  }, [isAwardOpen, selectedClass, classes]);

  // Leaderboard students for the currently loaded cohort
  const leaderboardStudents = useMemo(() => {
    if (!loadedStudents) return [];
    let filtered = [...loadedStudents];

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((s: any) =>
        `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase().includes(q) ||
        (s.studentId && s.studentId.toLowerCase().includes(q))
      );
    }

    return filtered.sort((a: any, b: any) => (Number(b.totalPoints) || 0) - (Number(a.totalPoints) || 0));
  }, [loadedStudents, searchTerm]);

  // Modal student candidates for awarding badges
  const modalStudents = useMemo(() => {
    const sourceList = awardClassStudents.length > 0 
      ? awardClassStudents 
      : (loadedStudents || []);
    if (sourceList.length === 0) return [];
    let list = [...sourceList];
    if (awardSearchTerm.trim()) {
      const q = awardSearchTerm.toLowerCase();
      list = list.filter((s: any) => {
        const name = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
        const cls = getStudentClassName(s).toLowerCase();
        const stId = (s.studentId || s.id || s.uid || '').toLowerCase();
        return name.includes(q) || cls.includes(q) || stId.includes(q);
      });
    }
    return list.sort((a: any, b: any) => (a.lastName || '').localeCompare(b.lastName || ''));
  }, [awardClassStudents, loadedStudents, awardSearchTerm]);

  const canManageBadges = ['Administrator', 'Director', 'Teacher'].includes(role || '');

  const handleManualAward = async () => {
    if (!firestore || !awardStudentId || !awardBadgeId) return;
    try {
      await triggerStudentBadgeEvent(firestore, awardStudentId, {
        type: 'MANUAL_TEACHER_AWARD',
        customBadgeId: awardBadgeId
      });
      toast({ title: 'Badge Awarded! 🎉', description: 'Student has been awarded the achievement badge and XP.' });
      
      // Update loaded cohort if currently active
      if (loadedClassId) {
        await handleLoadClassLeaderboard(loadedClassId);
      }
      setIsAwardOpen(false);
      setAwardStudentId('');
      setAwardSearchTerm('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not award badge.' });
    }
  };

  const handleRevokeBadge = async (targetStudent: any, badgeToRemove: any) => {
    if (!firestore || !targetStudent || !badgeToRemove) return;
    const confirmMsg = `Are you sure you want to revoke "${badgeToRemove.title}" from ${targetStudent.firstName}? This will also deduct ${badgeToRemove.xpAwarded || badgeToRemove.xpReward || 0} XP.`;
    if (!confirm(confirmMsg)) return;

    try {
      const studentRef = doc(firestore, 'students', targetStudent.id || targetStudent.uid);
      const currentBadges = (targetStudent.earnedBadges || []) as any[];

      const updatedBadges = currentBadges.filter(
        b => (b.id ? b.id !== badgeToRemove.id : (b.title !== badgeToRemove.title || b.unlockedAt !== badgeToRemove.unlockedAt))
      );
      const xpDeduction = Number(badgeToRemove.xpAwarded) || Number(badgeToRemove.xpReward) || 0;

      await updateDoc(studentRef, {
        earnedBadges: updatedBadges,
        totalPoints: increment(-xpDeduction),
        lastGamificationUpdate: serverTimestamp()
      });

      toast({
        title: 'Badge Revoked 🗑️',
        description: `Removed "${badgeToRemove.title}" and deducted ${xpDeduction} XP from ${targetStudent.firstName}.`
      });

      // Update in loaded students state immediately
      setLoadedStudents((prev: any[] | null) => {
        if (!prev) return prev;
        return prev.map((s: any) => {
          if ((s.id || s.uid) === (targetStudent.id || targetStudent.uid)) {
            return {
              ...s,
              earnedBadges: updatedBadges,
              totalPoints: Math.max(0, (s.totalPoints || 0) - xpDeduction)
            };
          }
          return s;
        });
      });

      setManageStudent((prev: any) =>
        prev
          ? {
              ...prev,
              earnedBadges: updatedBadges,
              totalPoints: Math.max(0, (prev.totalPoints || 0) - xpDeduction)
            }
          : null
      );
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not revoke badge.' });
    }
  };

  const handleOpenCertificateModal = (student: any) => {
    setCertStudent(student);
    setIsCertDialogOpen(true);
  };

  const handleDirectPrint = () => {
    window.print();
  };

  const handleDownloadCertificatePdf = async () => {
    if (!certRef.current || !certStudent) return;
    setIsGeneratingPdf(true);
    try {
      const element = certRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${certStudent.firstName}_${certStudent.lastName}_Official_Gamification_Certificate.pdf`);

      toast({
        title: 'Certificate Downloaded! 🎓',
        description: `Official Certificate for ${certStudent.firstName} ${certStudent.lastName} generated successfully.`
      });
    } catch (error) {
      console.error('PDF Generation Error:', error);
      toast({
        variant: 'destructive',
        title: 'Generation Failed',
        description: 'Failed to generate certificate PDF. Please use Direct Print.'
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto pb-16 animate-in fade-in duration-500 flex flex-col h-full">
      
      {/* Printable Certificate Modal */}
      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto bg-slate-950 p-4 sm:p-6 border-slate-800 text-white rounded-3xl">
          <DialogHeader className="sr-only">
            <DialogTitle>Student Official Certificate</DialogTitle>
            <DialogDescription>Award certificate ready for high-resolution print or PDF export.</DialogDescription>
          </DialogHeader>

          {certStudent && (
            <div className="flex justify-center p-2 sm:p-4 overflow-x-auto">
              <div 
                ref={certRef}
                className="w-[880px] h-[620px] bg-white text-slate-950 p-10 relative flex flex-col justify-between shadow-2xl border-[16px] border-double select-none shrink-0"
                style={{ borderColor: brandColor }}
              >
                {/* Certificate Background Elements */}
                <div className="absolute inset-2 border-2 border-dashed pointer-events-none opacity-40" style={{ borderColor: secondaryColor }} />
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <Landmark className="w-[450px] h-[450px]" style={{ color: brandColor }} />
                </div>

                {/* Certificate Header */}
                <div className="text-center relative z-10 space-y-1">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    {schoolLogo ? (
                      <img src={schoolLogo} alt="School Crest" className="h-14 w-14 object-contain" />
                    ) : (
                      <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md" style={{ backgroundColor: brandColor }}>
                        {schoolName.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <h2 className="text-xl font-black uppercase tracking-wider" style={{ color: brandColor }}>
                        {schoolName}
                      </h2>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {schoolMotto}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h1 className="text-3xl font-serif font-black tracking-wide uppercase" style={{ color: brandColor }}>
                      Certificate of Achievement
                    </h1>
                    <p className="text-xs uppercase font-bold tracking-[0.25em] text-amber-600 mt-0.5">
                      Gamification & Academic Excellence Honors
                    </p>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="text-center relative z-10 my-auto py-2 space-y-3">
                  <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
                    This official honor is proudly presented to
                  </p>

                  <h3 className="text-3xl sm:text-4xl font-serif font-black underline decoration-amber-500 decoration-2 underline-offset-8 uppercase tracking-wide" style={{ color: brandColor }}>
                    {certStudent.firstName} {certStudent.lastName}
                  </h3>

                  <p className="text-xs text-slate-600 max-w-xl mx-auto leading-relaxed font-medium pt-1">
                    For distinguished academic dedication, active extracurricular participation, and attaining{' '}
                    <strong className="text-slate-900 font-bold">
                      Level {calculateStudentLevel(certStudent.totalPoints || 0, getStudentClassName(certStudent)).level} ({calculateStudentLevel(certStudent.totalPoints || 0, getStudentClassName(certStudent)).title})
                    </strong>{' '}
                    with an exceptional accumulation of{' '}
                    <strong className="text-amber-700 font-black font-mono">
                      {certStudent.totalPoints || 0} XP Points
                    </strong>{' '}
                    in class <strong className="text-slate-900 font-bold">{getStudentClassName(certStudent)}</strong>.
                  </p>

                  {/* Earned Badges Showcase Strip */}
                  <div className="flex items-center justify-center gap-2 pt-2 flex-wrap max-w-lg mx-auto">
                    {((certStudent.earnedBadges || []) as any[]).slice(0, 6).map((b: any, i: number) => {
                      const catalogMatch = BADGE_CATALOG.find(c => c.id === b.id || c.title === b.title);
                      return (
                        <span 
                          key={i} 
                          className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full border bg-amber-50/70 text-amber-900 border-amber-300/80 shadow-xs"
                        >
                          <span>{catalogMatch?.icon || '⭐'}</span>
                          <span>{b.title}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Certificate Signatures and Footer */}
                <div className="relative z-10 border-t border-slate-200 pt-3">
                  <div className="grid grid-cols-3 items-end text-center">
                    
                    {/* Class Teacher Signature */}
                    <div className="flex flex-col items-center">
                      <div className="h-11 flex items-end justify-center mb-1">
                        {getTeacherSignatureAndName(certStudent).signature ? (
                          <img 
                            src={getTeacherSignatureAndName(certStudent).signature!} 
                            alt="Teacher Signature" 
                            className="max-h-10 max-w-[130px] object-contain"
                          />
                        ) : (
                          <div className="font-serif italic text-sm text-slate-400 font-bold">Verified Sign-Off</div>
                        )}
                      </div>
                      <div className="w-40 border-t border-slate-400"></div>
                      <p className="text-[10px] font-black text-slate-800 uppercase mt-1">
                        {getTeacherSignatureAndName(certStudent).name}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Class Teacher</p>
                    </div>

                    {/* Official Seal */}
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-16 w-16 rounded-full border-4 border-double flex items-center justify-center shadow-inner" style={{ borderColor: secondaryColor }}>
                        <div className="h-12 w-12 rounded-full border border-dashed flex items-center justify-center text-center p-1" style={{ borderColor: brandColor }}>
                          <span className="text-[7px] font-black uppercase tracking-tighter text-amber-700 leading-tight">
                            OFFICIAL<br/>SEAL OF<br/>HONOR
                          </span>
                        </div>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    {/* Head of School / Principal Signature */}
                    <div className="flex flex-col items-center">
                      <div className="h-11 flex items-end justify-center mb-1">
                        {schoolProfile?.headmasterSignature || schoolProfile?.principalSignature || schoolProfile?.signatureUrl ? (
                          <img 
                            src={schoolProfile?.headmasterSignature || schoolProfile?.principalSignature || schoolProfile?.signatureUrl} 
                            alt="Principal Signature" 
                            className="max-h-10 max-w-[130px] object-contain"
                          />
                        ) : (
                          <div className="font-serif italic text-sm text-slate-400 font-bold">Approved & Issued</div>
                        )}
                      </div>
                      <div className="w-40 border-t border-slate-400"></div>
                      <p className="text-[10px] font-black text-slate-800 uppercase mt-1">
                        {schoolProfile?.headmasterName || schoolProfile?.principalName || 'Head of School'}
                      </p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Principal / Director</p>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-800 print:hidden">
            <Button
              type="button"
              onClick={handleDirectPrint}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs h-11 px-5 rounded-xl border border-slate-700 shadow-md transition-colors"
            >
              <Printer className="h-4 w-4 mr-2 text-amber-400" /> Direct Print
            </Button>
            <Button
              type="button"
              onClick={handleDownloadCertificatePdf}
              disabled={isGeneratingPdf}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black h-11 px-6 rounded-xl shadow-lg border-0"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating PDF...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" /> Download PDF Certificate
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Standardized Classic Institutional Hero Banner */}
      <SectionHeroBanner
        eyebrow={`${schoolName.toUpperCase()} • ON-DEMAND GAMIFICATION HUB`}
        title={isStudentRole ? 'My Badges & Achievements' : 'Gamification & Achievement Hub'}
        subtitle={
          isStudentRole
            ? 'Track your level progress, XP points, and unlocked achievement badges.'
            : 'Recognize and motivate students with automated badges, XP points, and official PDF certificates.'
        }
        icon={Trophy}
        badge={{
          label: loadedClassId
            ? `${classNameMap.get(loadedClassId) || 'Class Cohort'} (${leaderboardStudents.length} Students)`
            : 'Live Gamification Engine',
          variant: 'gold',
        }}
        breadcrumbs={[
          { label: 'Director Suite' },
          { label: 'Academics', href: '/dashboard' },
          { label: 'Achievements & Badges' },
        ]}
        stats={[
          { label: 'Badges Catalog', value: BADGE_CATALOG.length || 18 },
          { label: 'Active Classes', value: classes.length || 0 },
        ]}
        actions={
          canManageBadges ? (
            <Button
              onClick={() => setIsAwardOpen(true)}
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl h-9 px-4 gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="h-4 w-4 text-slate-950" />
              <span>Award Badge Manually</span>
            </Button>
          ) : undefined
        }
      />

      {/* Manual Badge Award Dialog */}
      {canManageBadges && (
        <Dialog open={isAwardOpen} onOpenChange={setIsAwardOpen}>
          <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" /> Award Student Badge
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Select a class cohort and student to award an achievement badge and XP.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-3">
                {/* Class Cohort Picker in Modal */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">1. Target Class Cohort</label>
                  <Select value={awardClassId || selectedClass} onValueChange={handleAwardClassChange}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-bold">
                      <SelectValue placeholder="Select Class Cohort..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {classes.map((c: any) => (
                        <SelectItem key={c.id} value={c.id} className="text-xs font-semibold">
                          {c.name || c.className || c.gradeLevel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filtered Student Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>2. Select Student</span>
                    {loadingAwardClass && <span className="text-[10px] text-purple-600 font-semibold flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Loading...</span>}
                  </label>
                  
                  {modalStudents.length > 5 && (
                    <div className="relative mb-1.5">
                      <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        placeholder="Search student in this class..."
                        value={awardSearchTerm}
                        onChange={(e) => setAwardSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-xs rounded-lg border-slate-300"
                      />
                    </div>
                  )}

                  <Select value={awardStudentId} onValueChange={setAwardStudentId} disabled={loadingAwardClass || modalStudents.length === 0}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                      <SelectValue placeholder={
                        loadingAwardClass 
                          ? "Loading class students..." 
                          : (modalStudents.length > 0 ? "Choose student..." : "No students in this class")
                      } />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {modalStudents.map((s: any) => (
                        <SelectItem key={s.id || s.uid} value={s.id || s.uid} className="text-xs">
                          {s.firstName} {s.lastName} {s.studentId ? `(${s.studentId})` : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Badge Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">3. Select Badge</label>
                  <Select value={awardBadgeId} onValueChange={setAwardBadgeId}>
                    <SelectTrigger className="h-10 rounded-xl text-xs font-semibold">
                      <SelectValue placeholder="Choose badge..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {BADGE_CATALOG.map(b => (
                        <SelectItem key={b.id} value={b.id} className="text-xs">
                          {b.icon} {b.title} (+{b.xpReward} XP)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={handleManualAward}
                disabled={!awardStudentId}
                className="w-full bg-indigo-900 hover:bg-indigo-950 text-white font-bold h-11 rounded-xl shadow-lg transition-colors"
              >
                Confirm & Award Badge
              </Button>
            </DialogContent>
          </Dialog>
        )}

        {/* Manage & Revoke Student Badges Dialog */}
        <Dialog open={isManageDialogOpen} onOpenChange={setIsManageDialogOpen}>
          <DialogContent className="sm:max-w-lg bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-amber-600" /> Manage Badges for {manageStudent?.firstName} {manageStudent?.lastName}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                View and revoke badges awarded to this student. Revoking a badge automatically deducts the earned XP points.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="bg-slate-50 p-3 rounded-xl border flex justify-between items-center text-xs font-bold text-slate-700">
                <span>Class: <strong className="text-indigo-900">{manageStudent ? getStudentClassName(manageStudent) : ''}</strong></span>
                <span>Total Points: <strong className="text-amber-600 font-mono">{manageStudent?.totalPoints || 0} XP</strong></span>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Unlocked Badges ({((manageStudent?.earnedBadges || []) as any[]).length})</h4>
                {((manageStudent?.earnedBadges || []) as any[]).length > 0 ? (
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {((manageStudent?.earnedBadges || []) as any[]).map((b: any, idx: number) => {
                      const catalogMatch = BADGE_CATALOG.find(c => c.id === b.id || c.title === b.title);
                      const icon = catalogMatch?.icon || '🛡️';

                      return (
                        <div
                          key={b.id || idx}
                          className="flex items-center justify-between p-3 bg-purple-50/40 border border-purple-100 rounded-xl"
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="text-xl">{icon}</span>
                            <div>
                              <p className="text-xs font-bold text-slate-900">{b.title}</p>
                              <p className="text-[10px] text-purple-700 font-medium font-mono">
                                +{b.xpAwarded || catalogMatch?.xpReward || 0} XP • Awarded {b.unlockedAt ? new Date(b.unlockedAt).toLocaleDateString() : 'recently'}
                              </p>
                            </div>
                          </div>

                          {canManageBadges && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRevokeBadge(manageStudent, b)}
                              className="h-8 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg font-bold"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" /> Revoke
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-400 italic bg-slate-50 border border-dashed rounded-xl">
                    This student has not earned any badges yet.
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

      {/* Student Personal Showcase (If student role) */}
      {isStudentRole && currentStudent && (
        <StudentBadgeShowcase
          studentName={`${currentStudent.firstName} ${currentStudent.lastName}`}
          gradeLevel={getStudentClassName(currentStudent)}
          totalPoints={(currentStudent as any).totalPoints || 0}
          earnedBadges={((currentStudent as any).earnedBadges || []) as any[]}
        />
      )}

      {/* Leaderboard Card with On-Demand Scoped Controls */}
      <Card className="border border-slate-200 shadow-md rounded-3xl bg-white overflow-hidden">
        <CardHeader className="p-6 pb-5 border-b border-slate-100 flex flex-col gap-4 bg-slate-50/40">
          <div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg font-black text-slate-900">
                Class XP Leaderboard
              </CardTitle>
              <Badge variant="outline" className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border-indigo-200 ml-1">
                SCOPED AUDIT
              </Badge>
            </div>
            <CardDescription className="text-xs text-slate-500 mt-1">
              Select a class cohort and academic period to load student gamification rankings on-demand. Bulk loading all school years is disabled to optimize data usage.
            </CardDescription>
          </div>

          {/* Scoped Controls: Class + Academic Period + Term */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            
            {/* 1. Class Cohort (Mandatory selection) */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                1. Select Class / Cohort
              </label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-11 text-xs rounded-xl font-bold bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Choose Class..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {classes.map((c: any) => (
                    <SelectItem key={c.id} value={c.id} className="font-semibold text-xs">
                      {c.name || c.className || c.gradeLevel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 2. Academic Period / Year */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                2. Academic Period
              </label>
              <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
                <SelectTrigger className="h-11 text-xs rounded-xl font-bold bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current" className="font-semibold text-xs">Current Session (2026/2027)</SelectItem>
                  <SelectItem value="2025-2026" className="font-semibold text-xs">2025 / 2026 Academic Year</SelectItem>
                  <SelectItem value="2024-2025" className="font-semibold text-xs">2024 / 2025 Academic Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Term Filter */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                3. Term Scope
              </label>
              <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                <SelectTrigger className="h-11 text-xs rounded-xl font-bold bg-white border-slate-200 shadow-sm">
                  <SelectValue placeholder="Term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="font-semibold text-xs">Cumulative (All Terms)</SelectItem>
                  <SelectItem value="Term 1" className="font-semibold text-xs">Term 1</SelectItem>
                  <SelectItem value="Term 2" className="font-semibold text-xs">Term 2</SelectItem>
                  <SelectItem value="Term 3" className="font-semibold text-xs">Term 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 4. Action: Load Button */}
            <div className="flex flex-col justify-end space-y-1.5">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider hidden lg:block">
                Action
              </label>
              <Button
                onClick={() => handleLoadClassLeaderboard()}
                disabled={!selectedClass || isLoadingOnDemand}
                className={cn(
                  "h-11 text-xs font-black rounded-xl shadow-md flex items-center justify-center gap-2 transition-all",
                  selectedClass 
                    ? "bg-indigo-900 hover:bg-indigo-950 text-white" 
                    : "bg-slate-200 text-slate-400 cursor-not-allowed"
                )}
              >
                {isLoadingOnDemand ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4 text-amber-400" />}
                {isLoadingOnDemand ? 'Loading Cohort...' : 'Load Class Leaderboard'}
              </Button>
            </div>
          </div>

          {/* Quick Search within currently loaded cohort */}
          {loadedStudents !== null && (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-700">Active Cohort:</span>
                <Badge className="bg-purple-100 text-purple-900 border-purple-200 font-extrabold text-xs">
                  {classNameMap.get(loadedClassId) || 'Class Cohort'}
                </Badge>
                <span className="text-xs text-slate-500 font-medium">({leaderboardStudents.length} students ranked)</span>
                {selectedClass !== loadedClassId && (
                  <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-300 bg-amber-50">
                    Selection changed · Click Load to refresh
                  </Badge>
                )}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Filter student by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-white border-slate-200"
                />
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="p-0">
          {isLoadingOnDemand ? (
            <div className="flex justify-center p-24 flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Fetching Cohort Gamification Records...
              </p>
            </div>
          ) : loadedStudents === null ? (
            /* On-Demand Prompt State */
            <div className="text-center py-24 px-6 bg-slate-50/30">
              <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                <div className="p-4 bg-purple-100 text-purple-700 rounded-3xl">
                  <Trophy className="h-8 w-8 text-purple-700" />
                </div>
                <h3 className="font-black text-base text-slate-900">On-Demand Period Leaderboard</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select a <strong>Class / Cohort</strong> and <strong>Academic Period</strong> above, then click <strong>Load Class Leaderboard</strong>. Bulk loading all students across all years at once is disabled to protect database performance and avoid high read costs.
                </p>
                {classes.length > 0 && !selectedClass && (
                  <p className="text-[11px] text-indigo-600 font-bold mt-1">
                    Tip: Select a class above to get started.
                  </p>
                )}
                {selectedClass && (
                  <Button
                    onClick={() => handleLoadClassLeaderboard()}
                    disabled={isLoadingOnDemand}
                    className="mt-2 bg-indigo-900 hover:bg-indigo-950 text-white font-black text-xs h-11 px-6 rounded-xl shadow-md flex items-center gap-2"
                  >
                    <Zap className="h-4 w-4 text-amber-400" />
                    Load {classNameMap.get(selectedClass) || 'Selected Class'} Leaderboard
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/70 border-b">
                  <TableRow>
                    <TableHead className="w-16 font-black text-[10px] uppercase text-slate-600 tracking-wider pl-6">Rank</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-600 tracking-wider">Student Name</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-600 tracking-wider">Class / Grade</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-600 tracking-wider">Gamification Level</TableHead>
                    <TableHead className="font-black text-[10px] uppercase text-slate-600 tracking-wider">Badges Unlocked</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase text-slate-600 tracking-wider">Total XP</TableHead>
                    <TableHead className="text-right pr-6 font-black text-[10px] uppercase text-slate-600 tracking-wider">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardStudents.length > 0 ? (
                    leaderboardStudents.map((student: any, idx: number) => {
                      const rank = idx + 1;
                      const studentClassName = getStudentClassName(student);
                      const levelInfo = calculateStudentLevel(
                        student.totalPoints || 0,
                        studentClassName
                      );
                      const badges = (student.earnedBadges || []) as any[];

                      return (
                        <TableRow key={student.id || student.uid} className="hover:bg-purple-50/30 transition-colors h-16">
                          <TableCell className="font-black text-sm pl-6">
                            {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                          </TableCell>
                          <TableCell className="font-bold text-slate-800 text-sm">
                            {student.firstName} {student.lastName}
                            {student.studentId && (
                              <span className="block text-[10px] font-mono text-slate-400 uppercase font-normal">
                                ID: {student.studentId}
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-indigo-950">
                            {getStudentClassName(student)}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${levelInfo.badgeColor} text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md`}>
                              Lvl {levelInfo.level}: {levelInfo.title}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div
                              className={cn("flex gap-1 flex-wrap", canManageBadges && "cursor-pointer")}
                              onClick={() => {
                                if (canManageBadges) {
                                  setManageStudent(student);
                                  setIsManageDialogOpen(true);
                                }
                              }}
                            >
                              {badges.slice(0, 4).map((b, bIdx) => (
                                <Badge key={bIdx} variant="secondary" className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors">
                                  {b.title}
                                </Badge>
                              ))}
                              {badges.length > 4 && (
                                <span className="text-[10px] font-bold text-slate-400 self-center">+{badges.length - 4} more</span>
                              )}
                              {badges.length === 0 && (
                                <span className="text-[11px] text-slate-400 italic">No badges yet</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono font-black text-indigo-700 text-base">
                            {student.totalPoints || 0} XP
                          </TableCell>
                          <TableCell className="text-right pr-6">
                            <div className="flex justify-end gap-2">
                              {canManageBadges && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setManageStudent(student);
                                    setIsManageDialogOpen(true);
                                  }}
                                  className="h-8 text-xs font-bold border-purple-200 text-purple-800 hover:bg-purple-50"
                                >
                                  <ShieldAlert className="h-3.5 w-3.5 mr-1 text-purple-600" /> Manage Badges
                                </Button>
                              )}
                              {!isStudentRole && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenCertificateModal(student)}
                                  className="h-8 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100"
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1 text-indigo-600" /> Certificate
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-slate-400 font-medium">
                        No student gamification records found for {classNameMap.get(loadedClassId) || 'this class'}.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
