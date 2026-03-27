'use client';

import { useState, useMemo, useEffect } from 'react';
import Papa from 'papaparse';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc, serverTimestamp, getDocs, writeBatch, limit } from 'firebase/firestore';
import { createNewUser } from '@/app/actions/create-user';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  FileUp, Database, Loader2, Sparkles, CheckCircle2, 
  AlertTriangle, FileSpreadsheet, FileText, ArrowRight, UserPlus,
  Trash2, Wand2, Filter, BookCopy, GraduationCap, History
} from 'lucide-react';
import { extractStudentsFromText } from '@/ai/flows/extract-students-flow';
import type { Class, Subject, Student } from '@/lib/types';
import { generateNextStudentId } from '@/lib/student-utils';

export default function MigrationHubPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();

  // Mode state
  const [activeTab, setActiveTab] = useState<'students' | 'grades'>('students');

  // Data State - Students
  const [studentCsvData, setStudentCsvData] = useState<any[]>([]);
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [isImportingStudents, setIsImportingStudents] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [rawText, setRawText] = useState('');
  const [showTextPaste, setShowTextPaste] = useState(false);

  // Data State - Grades
  const [gradeCsvData, setGradeCsvData] = useState<any[]>([]);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [isImportingGrades, setIsImportingGrades] = useState(false);

  // Fetch Classes for mapping
  const classesQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  // Fetch Subjects for mapping
  const subjectsQuery = useMemoFirebase(() => 
    (firestore && schoolId) ? query(collection(firestore, 'subjects'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId]);
  const { data: subjects } = useCollection<Subject>(subjectsQuery);

  // --- HANDLERS: SHARED ---

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'students' | 'grades') => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (type === 'students') {
          setStudentCsvData(results.data);
        } else {
          setGradeCsvData(results.data);
        }
        toast({ title: "File Read", description: `Found ${results.data.length} records.` });
      },
      error: (error) => {
        toast({ variant: 'destructive', title: "Error", description: error.message });
      }
    });
  };

  // --- HANDLERS: STUDENTS ---

  const handleAiExtract = async () => {
    if (!rawText.trim()) return;
    setIsExtracting(true);
    try {
      const result = await extractStudentsFromText(rawText);
      if (result.success && result.data) {
        setStudentCsvData(result.data);
        setShowTextPaste(false);
        setRawText('');
        toast({ title: "AI Extraction Complete", description: `Recovered ${result.data.length} students from text.` });
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: "AI Failed", description: error.message });
    } finally {
      setIsExtracting(false);
    }
  };

  const executeStudentImport = async () => {
    if (!firestore || !schoolId || studentCsvData.length === 0) return;
    setIsImportingStudents(true);
    let successCount = 0;
    let failCount = 0;

    toast({ title: "Import Starting", description: "Provisioning accounts. Please do not close this tab." });

    try {
      for (const row of studentCsvData) {
        const { FirstName, LastName, Email, ClassName, Gender } = row as any;
        const targetClassId = classMap[ClassName] || null;

        if (!Email || !FirstName) {
          failCount++;
          continue;
        }

        const result = await createNewUser(
          Email.trim().toLowerCase(),
          "password123", 
          'Student',
          { firstName: FirstName, lastName: LastName },
          schoolId
        );

        if ('error' in result) {
          console.warn(`Failed to import ${Email}:`, result.error);
          failCount++;
          continue;
        }

        const studentId = await generateNextStudentId(firestore, schoolId);

        await setDoc(doc(firestore, 'students', result.uid), {
          uid: result.uid,
          studentId: studentId,
          firstName: FirstName,
          lastName: LastName,
          email: Email.trim().toLowerCase(),
          grade: ClassName,
          classId: targetClassId,
          gender: Gender || '',
          schoolId: schoolId,
          enrollmentStatus: 'Active',
          createdAt: serverTimestamp(),
          requirePasswordChange: true
        });

        successCount++;
      }

      toast({ 
        title: "Migration Complete", 
        description: `Successfully imported ${successCount} students. ${failCount} failed.`,
        duration: 10000 
      });
      setStudentCsvData([]);
      setClassMap({});
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Import Error", description: e.message });
    } finally {
      setIsImportingStudents(false);
    }
  };

  // --- HANDLERS: GRADES ---

  const executeGradeImport = async () => {
    if (!firestore || !schoolId || gradeCsvData.length === 0) return;
    setIsImportingGrades(true);
    
    let successCount = 0;
    let failCount = 0;

    try {
      // 1. Fetch all students for identity resolution (Email -> UID)
      const studentsSnapshot = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
      const studentMap = new Map<string, any>();
      studentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        studentMap.set(data.email?.toLowerCase(), { uid: doc.id, classId: data.classId, firstName: data.firstName, lastName: data.lastName });
      });

      // 2. Process in batches
      const batch = writeBatch(firestore);
      let batchCount = 0;

      for (const row of gradeCsvData) {
        const { Email, SubjectName, CA, Exam, Term, AcademicYear } = row as any;
        
        const studentInfo = studentMap.get(Email?.trim().toLowerCase());
        const targetSubjectId = subjectMap[SubjectName] || null;

        if (!studentInfo || !targetSubjectId || !CA || !Exam) {
          failCount++;
          continue;
        }

        const baseAssessmentData = {
          studentId: studentInfo.uid,
          classId: studentInfo.classId,
          subjectId: targetSubjectId,
          subjectName: subjects?.find(s => s.id === targetSubjectId)?.name || SubjectName,
          academicYear: AcademicYear || '2024-2025',
          term: Term || 'First Term',
          schoolId: schoolId,
          createdAt: serverTimestamp(),
          gradedAt: serverTimestamp(),
          assessmentDate: new Date(),
          maxScore: 100
        };

        // Create CA record
        const caRef = doc(collection(firestore, 'assessments'));
        batch.set(caRef, {
          ...baseAssessmentData,
          assessmentType: 'Class Exercise (CA)',
          assessmentName: 'Legacy CA Import',
          score: parseFloat(CA)
        });

        // Create Exam record
        const examRef = doc(collection(firestore, 'assessments'));
        batch.set(examRef, {
          ...baseAssessmentData,
          assessmentType: 'End of Term Exam (Exam)',
          assessmentName: 'Legacy Exam Import',
          score: parseFloat(Exam)
        });

        successCount++;
        batchCount += 2;

        if (batchCount >= 450) {
          await batch.commit();
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      toast({ 
        title: "Grades Imported", 
        description: `Successfully imported ${successCount} subject records. ${failCount} failed lookup.`,
        duration: 8000
      });
      setGradeCsvData([]);
      setSubjectMap({});

    } catch (error: any) {
      console.error(error);
      toast({ variant: 'destructive', title: "Import Failed", description: error.message });
    } finally {
      setIsImportingGrades(false);
    }
  };

  // --- MEMOS ---

  const uniqueCsvClasses = useMemo(() => {
    const set = new Set<string>();
    studentCsvData.forEach(row => {
      if (row.ClassName) set.add(row.ClassName);
    });
    return Array.from(set);
  }, [studentCsvData]);

  const uniqueCsvSubjects = useMemo(() => {
    const set = new Set<string>();
    gradeCsvData.forEach(row => {
      if (row.SubjectName) set.add(row.SubjectName);
    });
    return Array.from(set);
  }, [gradeCsvData]);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Data <span className="text-indigo-600">Migration</span> Hub</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Bulk Import Students, Staff, and Records</p>
      </div>

      <Tabs defaultValue="students" value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-2xl mb-6">
          <TabsTrigger value="students" className="rounded-xl px-8 font-bold"><UserPlus className="mr-2 h-4 w-4"/> Import Students</TabsTrigger>
          <TabsTrigger value="grades" className="rounded-xl px-8 font-bold"><History className="mr-2 h-4 w-4"/> Import Past Grades</TabsTrigger>
        </TabsList>

        {/* --- TAB: STUDENTS --- */}
        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-slate-800">1. Source Data</CardTitle>
                <CardDescription className="text-xs font-medium">Choose your import method.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!showTextPaste ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                      <FileSpreadsheet className="h-12 w-12 text-slate-300 group-hover:text-indigo-500 mb-4 transition-colors" />
                      <p className="text-sm font-bold text-slate-600">Drag & Drop CSV File</p>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase">Headers: FirstName, LastName, Email, ClassName</p>
                      <input 
                        type="file" 
                        accept=".csv" 
                        onChange={(e) => handleFileUpload(e, 'students')}
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full text-indigo-600 font-black uppercase text-[10px] tracking-widest"
                      onClick={() => setShowTextPaste(true)}
                    >
                      <Sparkles className="mr-2 h-3 w-3"/> Extract from PDF/Text (AI)
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 animate-in slide-in-from-top-4">
                    <Label className="text-[10px] font-black uppercase text-slate-400">Paste register text below</Label>
                    <Textarea 
                      value={rawText}
                      onChange={e => setRawText(e.target.value)}
                      placeholder="Copy and paste the text from your PDF or Word list here..."
                      className="h-48 rounded-2xl border-2 font-mono text-xs"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowTextPaste(false)}>Cancel</Button>
                      <Button 
                        disabled={isExtracting || !rawText.trim()} 
                        onClick={handleAiExtract}
                        className="flex-[2] bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold"
                      >
                        {isExtracting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Wand2 className="mr-2 h-4 w-4"/>}
                        AI Extract
                      </Button>
                    </div>
                  </div>
                )}

                {studentCsvData.length > 0 && (
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-xl shadow-sm text-indigo-600"><CheckCircle2 className="h-5 w-5"/></div>
                      <div>
                        <p className="text-sm font-black text-indigo-900">{studentCsvData.length} Records</p>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase">Ready to Map</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setStudentCsvData([])} className="text-indigo-400"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Intelligence Mapping</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs uppercase mt-1">Map CSV labels to system Class IDs</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {studentCsvData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <Database className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-bold text-sm uppercase tracking-widest">Load data to start mapping</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="h-4 w-4 text-indigo-600"/> Class Reconciliation
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uniqueCsvClasses.map(csvClass => (
                          <div key={csvClass} className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">CSV Label: <strong className="text-slate-900">{csvClass}</strong></span>
                            <Select 
                              value={classMap[csvClass] || ''} 
                              onValueChange={(val) => setClassMap(prev => ({ ...prev, [csvClass]: val }))}
                            >
                              <SelectTrigger className="bg-white rounded-xl h-10 border-indigo-100">
                                <SelectValue placeholder="Map to System Class..." />
                              </SelectTrigger>
                              <SelectContent>
                                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-dashed">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Data Preview (Top 5)</h3>
                      <div className="border rounded-2xl overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="font-black text-[10px] uppercase">Name</TableHead>
                              <TableHead className="font-black text-[10px] uppercase">Email</TableHead>
                              <TableHead className="font-black text-[10px] uppercase">CSV Class</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {studentCsvData.slice(0, 5).map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className="text-xs font-bold">{row.FirstName} {row.LastName}</TableCell>
                                <TableCell className="text-xs text-slate-500 font-mono">{row.Email}</TableCell>
                                <TableCell className="text-xs italic">{row.ClassName}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">This will create real user accounts & send emails.</span>
                </div>
                <Button 
                  onClick={executeStudentImport} 
                  disabled={isImportingStudents || studentCsvData.length === 0}
                  className="w-full sm:w-auto h-14 px-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-95"
                >
                  {isImportingStudents ? <Loader2 className="animate-spin mr-2 h-5 w-5"/> : <Database className="mr-2 h-5 w-5"/>}
                  Start Migration ({studentCsvData.length})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: GRADES --- */}
        <TabsContent value="grades" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-orange-600 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-slate-800">1. Past Results Source</CardTitle>
                <CardDescription className="text-xs font-medium">Upload historical marks CSV.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                  <FileText className="h-12 w-12 text-slate-300 group-hover:text-orange-500 mb-4 transition-colors" />
                  <p className="text-sm font-bold text-slate-600">Upload Grades CSV</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase">Headers: Email, SubjectName, CA, Exam, Term, AcademicYear</p>
                  <input 
                    type="file" 
                    accept=".csv" 
                    onChange={(e) => handleFileUpload(e, 'grades')}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>

                {gradeCsvData.length > 0 && (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white p-2 rounded-xl shadow-sm text-orange-600"><CheckCircle2 className="h-5 w-5"/></div>
                      <div>
                        <p className="text-sm font-black text-orange-900">{gradeCsvData.length} Grades</p>
                        <p className="text-[10px] text-orange-400 font-bold uppercase">Ready to Map Subjects</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setGradeCsvData([])} className="text-orange-400"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Subject Reconciliation</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs uppercase mt-1">Link CSV subjects to your current curriculum</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {gradeCsvData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <BookCopy className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-bold text-sm uppercase tracking-widest">Load data to start mapping</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="h-4 w-4 text-orange-600"/> Subject Mapping
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {uniqueCsvSubjects.map(csvSub => (
                          <div key={csvSub} className="p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl flex flex-col gap-2">
                            <span className="text-[10px] font-black text-slate-400 uppercase">CSV Subject: <strong className="text-slate-900">{csvSub}</strong></span>
                            <Select 
                              value={subjectMap[csvSub] || ''} 
                              onValueChange={(val) => setSubjectMap(prev => ({ ...prev, [csvSub]: val }))}
                            >
                              <SelectTrigger className="bg-white rounded-xl h-10 border-orange-100">
                                <SelectValue placeholder="Map to System Subject..." />
                              </SelectTrigger>
                              <SelectContent>
                                {subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-dashed">
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Grades Preview (Top 5)</h3>
                      <div className="border rounded-2xl overflow-hidden">
                        <Table>
                          <TableHeader className="bg-slate-50">
                            <TableRow>
                              <TableHead className="font-black text-[10px] uppercase">Email</TableHead>
                              <TableHead className="font-black text-[10px] uppercase">Subject</TableHead>
                              <TableHead className="font-black text-[10px] uppercase">CA</TableHead>
                              <TableHead className="font-black text-[10px] uppercase">Exam</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {gradeCsvData.slice(0, 5).map((row, i) => (
                              <TableRow key={i}>
                                <TableCell className="text-xs font-mono">{row.Email}</TableCell>
                                <TableCell className="text-xs font-bold">{row.SubjectName}</TableCell>
                                <TableCell className="text-xs">{row.CA}</TableCell>
                                <TableCell className="text-xs">{row.Exam}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">This will populate students' gradebooks and report cards.</span>
                </div>
                <Button 
                  onClick={executeGradeImport} 
                  disabled={isImportingGrades || gradeCsvData.length === 0}
                  className="w-full sm:w-auto h-14 px-12 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-100 transition-all active:scale-95"
                >
                  {isImportingGrades ? <Loader2 className="animate-spin mr-2 h-5 w-5"/> : <History className="mr-2 h-5 w-5"/>}
                  Import Past Grades ({gradeCsvData.length})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}