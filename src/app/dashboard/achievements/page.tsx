'use client';

import { useState, useMemo, useRef } from 'react';
import { useCollection, useDoc, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
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
import { Trophy, Award, Star, Search, PlusCircle, Printer, Sparkles, Loader2, Landmark, CheckCircle2, Download, MapPin, Phone, Mail, FileText } from 'lucide-react';
import { StudentBadgeShowcase } from '@/components/achievements/StudentBadgeShowcase';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AchievementsPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [awardStudentId, setAwardStudentId] = useState<string>('');
  const [awardSearchTerm, setAwardSearchTerm] = useState<string>('');
  const [awardBadgeId, setAwardBadgeId] = useState<string>(BADGE_CATALOG[0].id);
  const [isAwardOpen, setIsAwardOpen] = useState(false);

  // Certificate Modal & PDF Generation State
  const [certStudent, setCertStudent] = useState<any | null>(null);
  const [isCertDialogOpen, setIsCertDialogOpen] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

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
  const brandColor = schoolProfile?.brandColor || schoolProfile?.primaryColor || '#1e1b4b'; // Default Indigo-950
  const secondaryColor = schoolProfile?.secondaryColor || '#d97706'; // Default Amber-600

  // Queries
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

    // 1. Check all candidate fields against classNameMap
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
        if (classNameMap.has(trimmed)) {
          return classNameMap.get(trimmed)!;
        }
        if (classNameMap.has(trimmed.toLowerCase())) {
          return classNameMap.get(trimmed.toLowerCase())!;
        }
      }
    }

    // 2. Look for human-readable string candidate (not a UID)
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

    // 3. Fallback formatting if candidate string is a code pattern
    for (const cand of candidates) {
      if (typeof cand === 'string' && cand.trim()) {
        const val = cand.trim();
        if (/^bs-\d+$/i.test(val)) return `BS ${val.split('-')[1]}`;
        if (/^kg-\d+$/i.test(val)) return `KG ${val.split('-')[1]}`;
        if (/^jhs-\d+$/i.test(val)) return `JHS ${val.split('-')[1]}`;
      }
    }

    return 'Assigned Class';
  };

  // Fetch Staff Members to resolve Class Teacher names and signatures
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

  const studentsQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: rawStudents, isLoading: loadingStudents, forceRefetch } = useCollection<Student>(studentsQuery);

  const leaderboardStudents = useMemo(() => {
    if (!rawStudents) return [];
    let filtered = [...rawStudents];

    if (selectedClass !== 'All') {
      filtered = filtered.filter((s: any) => s.classId === selectedClass || s.gradeLevel === selectedClass);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((s: any) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
      );
    }

    // Sort by Total Points (XP) descending
    return filtered.sort((a: any, b: any) => (Number(b.totalPoints) || 0) - (Number(a.totalPoints) || 0));
  }, [rawStudents, selectedClass, searchTerm]);

  const modalStudents = useMemo(() => {
    if (!rawStudents) return [];
    let list = [...rawStudents];
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
  }, [rawStudents, awardSearchTerm]);

  const canManageBadges = ['Administrator', 'Director', 'Teacher'].includes(role || '');

  const handleManualAward = async () => {
    if (!firestore || !awardStudentId || !awardBadgeId) return;
    try {
      await triggerStudentBadgeEvent(firestore, awardStudentId, {
        type: 'MANUAL_TEACHER_AWARD',
        customBadgeId: awardBadgeId
      });
      toast({ title: 'Badge Awarded! 🎉', description: 'Student has been awarded the achievement badge and XP.' });
      forceRefetch();
      setIsAwardOpen(false);
      setAwardStudentId('');
      setAwardSearchTerm('');
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not award badge.' });
    }
  };

  const handleOpenCertificateModal = (student: any) => {
    setCertStudent(student);
    setIsCertDialogOpen(true);
  };

  // Download PDF Function
  const handleDownloadCertificatePdf = async () => {
    if (!certRef.current || !certStudent) return;
    setIsGeneratingPdf(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificate_${certStudent.firstName}_${certStudent.lastName}.pdf`);

      toast({ title: 'Certificate Downloaded 🎓', description: 'PDF certificate has been saved to your downloads folder.' });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not generate PDF certificate.' });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDirectPrint = () => {
    window.print();
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* Certificate Modal & PDF Export Preview */}
      <Dialog open={isCertDialogOpen} onOpenChange={setIsCertDialogOpen}>
        <DialogContent className="max-w-4xl p-6 bg-slate-900 text-white border-slate-800 rounded-3xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-black flex items-center gap-2 text-amber-400">
              <Trophy className="h-6 w-6 text-amber-400" />
              Certificate of Achievement Preview
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-xs">
              Download official PDF certificate featuring school profile branding and student achievements.
            </DialogDescription>
          </DialogHeader>

          {/* Certificate Render Target (Landscape PDF Box) */}
          {certStudent && (
            <div className="bg-white text-slate-900 p-2 rounded-2xl overflow-hidden shadow-2xl">
              <div 
                ref={certRef}
                className="bg-white text-slate-900 p-8 sm:p-12 text-center relative select-none w-full border-[10px] border-double rounded-2xl"
                style={{ borderColor: brandColor }}
              >
                {/* Decorative Corner Accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-4 border-l-4" style={{ borderColor: brandColor }} />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-4 border-r-4" style={{ borderColor: brandColor }} />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-4 border-l-4" style={{ borderColor: brandColor }} />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-4 border-r-4" style={{ borderColor: brandColor }} />

                {/* Header: Logo, School Name, Motto, Address */}
                <div className="flex flex-col items-center justify-center space-y-2 border-b-2 pb-6" style={{ borderColor: `${brandColor}20` }}>
                  {schoolLogo ? (
                    <img src={schoolLogo} alt="School Logo" className="h-20 w-auto object-contain mb-1" />
                  ) : (
                    <Landmark className="h-14 w-14 mb-1" style={{ color: brandColor }} />
                  )}
                  <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight" style={{ color: brandColor }}>
                    {schoolName}
                  </h1>
                  {schoolMotto && (
                    <p className="text-xs font-serif italic text-slate-600 max-w-lg">
                      "{schoolMotto}"
                    </p>
                  )}

                  {/* School Contact Details Footer Line */}
                  <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold text-slate-500 pt-1">
                    {schoolAddress && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {schoolAddress}</span>}
                    {schoolPhone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {schoolPhone}</span>}
                    {schoolEmail && <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {schoolEmail}</span>}
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="my-6">
                  <span className="bg-amber-100 text-amber-950 font-black text-xs uppercase px-4 py-1 rounded-full tracking-widest border border-amber-300">
                    Official Certificate of Achievement
                  </span>
                </div>

                {/* Student Details */}
                <div className="space-y-4 my-6">
                  <p className="text-sm italic font-serif text-slate-600">This certificate is proudly awarded to</p>
                  <h2 
                    className="text-3xl sm:text-4xl font-black border-b-2 pb-2 inline-block px-12"
                    style={{ color: brandColor, borderColor: brandColor }}
                  >
                    {certStudent.firstName} {certStudent.lastName}
                  </h2>
                  <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed">
                    For outstanding academic dedication, active school participation, and earning{' '}
                    <strong className="text-amber-600 font-mono">{certStudent.totalPoints || 0} XP Points</strong> in the GAM Edu League.
                  </p>

                  {/* Badges Earned List */}
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {((certStudent.earnedBadges || []) as any[]).map((b, idx) => (
                      <span 
                        key={idx} 
                        className="bg-slate-50 border text-slate-900 font-extrabold text-xs px-3 py-1 rounded-xl shadow-xs flex items-center gap-1"
                        style={{ borderColor: `${brandColor}40` }}
                      >
                        🏆 {b.title}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Signature Blocks */}
                {(() => {
                  const teacherInfo = getTeacherSignatureAndName(certStudent);
                  const headmasterSig =
                    schoolProfile?.headmasterSignature ||
                    schoolProfile?.principalSignature ||
                    schoolProfile?.headmasterSignatureUrl ||
                    schoolProfile?.directorSignature;

                  return (
                    <div className="grid grid-cols-2 gap-12 pt-8 border-t border-slate-200 text-center text-xs font-bold text-slate-700 mt-8">
                      <div>
                        <div className="border-b border-slate-400 h-10 max-w-[200px] mx-auto flex items-end justify-center pb-1">
                          {teacherInfo.signature ? (
                            <img
                              src={teacherInfo.signature}
                              alt="Teacher Signature"
                              className="h-8 max-w-[160px] object-contain mix-blend-multiply contrast-125"
                            />
                          ) : (
                            <span className="font-serif italic font-extrabold text-slate-800 text-xs tracking-tight">
                              {teacherInfo.name !== 'Class Teacher' ? teacherInfo.name : 'Certified Staff'}
                            </span>
                          )}
                        </div>
                        <p className="mt-1.5 font-black text-[11px] text-slate-900 uppercase tracking-tight">
                          {teacherInfo.name}
                        </p>
                        <p className="uppercase tracking-wider text-[9px] text-slate-500 font-medium">Class Teacher</p>
                      </div>
                      <div>
                        <div className="border-b border-slate-400 h-10 max-w-[200px] mx-auto flex items-end justify-center pb-1">
                          {headmasterSig ? (
                            <img
                              src={headmasterSig}
                              alt="Principal Signature"
                              className="h-8 max-w-[160px] object-contain mix-blend-multiply contrast-125"
                            />
                          ) : (
                            <span className="font-serif italic text-slate-500 text-xs">Official Seal</span>
                          )}
                        </div>
                        <p className="mt-1.5 font-black text-[11px] text-slate-900 uppercase tracking-tight">
                          {schoolProfile?.principalName || schoolProfile?.headmasterName || 'School Principal / Director'}
                        </p>
                        <p className="uppercase tracking-wider text-[9px] text-slate-500 font-medium">School Principal / Director</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-800 print:hidden">
            <Button
              type="button"
              onClick={handleDirectPrint}
              className="bg-slate-800 hover:bg-slate-700 active:bg-slate-700 focus:bg-slate-700 text-white font-bold text-xs h-11 px-5 rounded-xl border border-slate-700 shadow-md transition-colors"
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

      {/* Main Screen Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-amber-400" />
            <h1 className="text-2xl font-black tracking-tight">Gamification & Achievement Hub</h1>
          </div>
          <p className="text-xs text-indigo-200 font-medium">
            Recognize and motivate students with automated badges, XP points, and official PDF certificates.
          </p>
        </div>

        {canManageBadges && (
          <Dialog open={isAwardOpen} onOpenChange={setIsAwardOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs h-10 px-5 rounded-xl shadow-lg border-0">
                <PlusCircle className="h-4 w-4 mr-1.5" /> Award Badge Manually
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" /> Award Student Badge
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Manually grant an achievement badge and XP points to a student.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-3">
                {/* Search Engine for Student List */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Search Student</span>
                    {awardSearchTerm && (
                      <span className="text-[10px] text-purple-600 font-semibold">
                        {modalStudents.length} student{modalStudents.length === 1 ? '' : 's'} found
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search student by name, ID or class..."
                      value={awardSearchTerm}
                      onChange={(e) => setAwardSearchTerm(e.target.value)}
                      className="pl-9 h-10 text-xs rounded-xl border-slate-300 focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Filtered Student Selection Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Student</label>
                  <Select value={awardStudentId} onValueChange={setAwardStudentId}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder={modalStudents.length > 0 ? "Choose student..." : "No matching students"} />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {modalStudents.map((s: any) => (
                        <SelectItem key={s.id || s.uid} value={s.id || s.uid}>
                          {s.firstName} {s.lastName} ({getStudentClassName(s)})
                        </SelectItem>
                      ))}
                      {modalStudents.length === 0 && (
                        <div className="p-3 text-center text-xs text-slate-400 font-medium">
                          No student matches "{awardSearchTerm}"
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Badge Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Select Badge</label>
                  <Select value={awardBadgeId} onValueChange={setAwardBadgeId}>
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue placeholder="Choose badge..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {BADGE_CATALOG.map(b => (
                        <SelectItem key={b.id} value={b.id}>
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
      </div>

      {/* Leaderboard Table */}
      <Card className="border border-slate-200 shadow-md rounded-2xl bg-white overflow-hidden">
        <CardHeader className="p-6 pb-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" /> Class XP Leaderboard
            </CardTitle>
            <CardDescription className="text-xs text-slate-500 mt-0.5">
              Rankings based on overall student reward points (XP) earned across all activities.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search student..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="h-9 text-xs rounded-xl w-36">
                <SelectValue placeholder="Filter Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Classes</SelectItem>
                {classes.map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loadingStudents ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="w-16 font-black text-xs uppercase text-slate-600">Rank</TableHead>
                  <TableHead className="font-black text-xs uppercase text-slate-600">Student Name</TableHead>
                  <TableHead className="font-black text-xs uppercase text-slate-600">Class / Grade</TableHead>
                  <TableHead className="font-black text-xs uppercase text-slate-600">Gamification Level</TableHead>
                  <TableHead className="font-black text-xs uppercase text-slate-600">Badges Unlocked</TableHead>
                  <TableHead className="text-right font-black text-xs uppercase text-slate-600">Total XP</TableHead>
                  <TableHead className="text-right pr-6 font-black text-xs uppercase text-slate-600">Action</TableHead>
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
                      <TableRow key={student.id || student.uid} className="hover:bg-purple-50/30 transition-colors">
                        <TableCell className="font-black text-sm">
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                        </TableCell>
                        <TableCell className="font-bold text-slate-800 text-sm">
                          {student.firstName} {student.lastName}
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
                          <div className="flex gap-1 flex-wrap">
                            {badges.slice(0, 4).map((b, bIdx) => (
                              <Badge key={bIdx} variant="secondary" className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenCertificateModal(student)}
                            className="h-8 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100"
                          >
                            <FileText className="h-3.5 w-3.5 mr-1 text-indigo-600" /> Certificate
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                      No student gamification records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
