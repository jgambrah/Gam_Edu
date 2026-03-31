'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc, serverTimestamp, getDocs, writeBatch, limit, arrayUnion, updateDoc } from 'firebase/firestore';
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
  Trash2, Wand2, Filter, BookCopy, GraduationCap, History, Info, RefreshCw, HeartHandshake
} from 'lucide-react';
import { extractStudentsFromText } from '@/ai/flows/extract-students-flow';
import type { Class, Subject, Student } from '@/lib/types';
import { generateNextStudentId } from '@/lib/student-utils';
import { Progress } from '@/components/ui/progress';

type MigrationTab = 'students' | 'grades' | 'parents';

/**
 * Robust value extractor that handles common CSV variations and missing data.
 */
function getRowValue(row: any, keys: string[]): string {
  const rowKeys = Object.keys(row);
  for (const searchKey of keys) {
    // 1. Try exact match
    if (row[searchKey] !== undefined && row[searchKey] !== null) {
      return row[searchKey].toString().trim();
    }
    // 2. Try case-insensitive and space-insensitive match
    const normalizedSearch = searchKey.toLowerCase().replace(/[\s_]/g, '');
    const foundKey = rowKeys.find(k => k.toLowerCase().replace(/[\s_]/g, '') === normalizedSearch);
    if (foundKey && row[foundKey] !== undefined && row[foundKey] !== null) {
      return row[foundKey].toString().trim();
    }
  }
  return '';
}

export default function MigrationHubPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: schoolLoading } = useCurrentSchool();

  // Mode state
  const [activeTab, setActiveTab] = useState<MigrationTab>('students');

  // Data State - Students
  const [studentCsvData, setStudentCsvData] = useState<any[]>([]);
  const [classMap, setClassMap] = useState<Record<string, string>>({});
  const [isImportingStudents, setIsImportingStudents] = useState(false);
  const [studentImportProgress, setStudentImportProgress] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [rawText, setRawText] = useState('');
  const [showTextPaste, setShowTextPaste] = useState(false);

  // Data State - Grades
  const [gradeCsvData, setGradeCsvData] = useState<any[]>([]);
  const [subjectMap, setSubjectMap] = useState<Record<string, string>>({});
  const [isImportingGrades, setIsImportingGrades] = useState(false);
  const [gradeImportProgress, setGradeImportProgress] = useState(0);

  // Data State - Parents
  const [parentCsvData, setParentCsvData] = useState<any[]>([]);
  const [isImportingParents, setIsImportingParents] = useState(false);
  const [parentImportProgress, setParentImportProgress] = useState(0);

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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: MigrationTab) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (type === 'students') {
          setStudentCsvData(results.data);
        } else if (type === 'grades') {
          setGradeCsvData(results.data);
        } else if (type === 'parents') {
          setParentCsvData(results.data);
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
        throw new Error(result.error || 'AI extraction failed');
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
    setStudentImportProgress(0);
    let successCount = 0;
    let failCount = 0;

    const total = studentCsvData.length;

    toast({ title: "Import Starting", description: `Provisioning ${total} student accounts.` });

    try {
      for (let i = 0; i < studentCsvData.length; i++) {
        const row = studentCsvData[i];
        
        const email = getRowValue(row, ['Email', 'Email Address', 'User Email']).toLowerCase();
        const firstName = getRowValue(row, ['FirstName', 'First Name', 'Given Name']);
        const lastName = getRowValue(row, ['LastName', 'Last Name', 'Surname']);
        const rawClassName = getRowValue(row, ['ClassName', 'Class', 'Grade']);
        const gender = getRowValue(row, ['Gender', 'Sex']);

        const targetClassId = classMap[rawClassName] || null;

        if (!email || !firstName) {
          console.warn(`[Import Skip] Missing mandatory data at row ${i + 1}`, { email, firstName });
          failCount++;
          setStudentImportProgress(i + 1);
          continue;
        }

        const result = await createNewUser(
          email,
          "password123",
          'Student',
          { firstName, lastName },
          schoolId
        );

        if ('error' in result) {
          console.error(`[Import Failure] ${email}:`, result.error);
          failCount++;
          setStudentImportProgress(i + 1);
          continue;
        }

        const studentId = await generateNextStudentId(firestore, schoolId);

        await setDoc(doc(firestore, 'students', result.uid), {
          uid: result.uid,
          studentId: studentId,
          firstName,
          lastName,
          email: email,
          grade: rawClassName,
          classId: targetClassId,
          gender: gender || null,
          schoolId: schoolId,
          enrollmentStatus: 'Active',
          createdAt: serverTimestamp(),
          requirePasswordChange: true
        });

        successCount++;
        setStudentImportProgress(i + 1);
      }

      toast({ 
        title: "Student Migration Complete", 
        description: `Successfully processed ${total} records. Success: ${successCount}, Failed: ${failCount}.`,
        duration: 10000 
      });
      
      if (successCount > 0) {
          setStudentCsvData([]);
          setClassMap({});
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Import Error", description: e.message });
    } finally {
      setIsImportingStudents(false);
      setStudentImportProgress(0);
    }
  };

  // --- HANDLERS: PARENTS ---

  const executeParentImport = async () => {
    if (!firestore || !schoolId || parentCsvData.length === 0) return;
    setIsImportingParents(true);
    setParentImportProgress(0);
    let successCount = 0;
    let failCount = 0;

    const total = parentCsvData.length;
    toast({ title: "Parent Import Starting", description: `Provisioning ${total} parent accounts and linking students.` });

    try {
      // Fetch all students to match by email
      const studentsSnap = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
      const studentEmailMap = new Map<string, string>();
      studentsSnap.docs.forEach(d => {
        const data = d.data();
        if (data.email) studentEmailMap.set(data.email.toLowerCase().trim(), d.id);
      });

      for (let i = 0; i < parentCsvData.length; i++) {
        const row = parentCsvData[i];
        
        const email = getRowValue(row, ['Email', 'Email Address', 'Parent Email']).toLowerCase();
        const firstName = getRowValue(row, ['FirstName', 'First Name', 'Parent FirstName']);
        const lastName = getRowValue(row, ['LastName', 'Last Name', 'Parent LastName']);
        const phone = getRowValue(row, ['Phone', 'PhoneNumber', 'Mobile', 'Contact']);
        const address = getRowValue(row, ['Address', 'Home Address', 'Location']);
        const studentEmail = getRowValue(row, ['StudentEmail', 'Child Email', 'Student Email', 'Link Email']).toLowerCase();

        if (!email || !firstName) {
          console.warn(`[Parent Skip] Row ${i + 1} missing required fields`, { email, firstName });
          failCount++;
          setParentImportProgress(i + 1);
          continue;
        }

        const result = await createNewUser(
          email,
          "password123",
          'Parent',
          { firstName, lastName },
          schoolId
        );

        if ('error' in result) {
          console.error(`[Parent Import Failure] ${email}:`, result.error);
          failCount++;
          setParentImportProgress(i + 1);
          continue;
        }

        const linkedStudentId = studentEmailMap.get(studentEmail);
        const parentData: any = {
          uid: result.uid,
          firstName,
          lastName,
          email: email,
          phone: phone || null,
          address: address || null,
          schoolId: schoolId,
          createdAt: serverTimestamp(),
          studentIds: linkedStudentId ? [linkedStudentId] : [],
          requirePasswordChange: true
        };

        await setDoc(doc(firestore, 'parents', result.uid), parentData);

        if (linkedStudentId) {
          await updateDoc(doc(firestore, 'students', linkedStudentId), {
            parentId: result.uid
          });
        }

        successCount++;
        setParentImportProgress(i + 1);
      }

      toast({ 
        title: "Parent Migration Complete", 
        description: `Processed ${total} records. Success: ${successCount}, Failed: ${failCount}.`,
        duration: 10000 
      });
      
      if (successCount > 0) {
          setParentCsvData([]);
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: "Import Error", description: e.message });
    } finally {
      setIsImportingParents(false);
      setParentImportProgress(0);
    }
  };

  // --- HANDLERS: GRADES ---

  const executeGradeImport = async () => {
    if (!firestore || !schoolId || gradeCsvData.length === 0) return;
    setIsImportingGrades(true);
    setGradeImportProgress(0);
    
    let successCount = 0;
    let failCount = 0;

    const totalRows = gradeCsvData.length;

    try {
      // 1. Fetch all students for the school once
      const studentsSnapshot = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
      const studentMap = new Map<string, any>();
      studentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        studentMap.set(data.email?.toLowerCase().trim(), { uid: doc.id, classId: data.classId, firstName: data.firstName, lastName: data.lastName });
      });

      let batch = writeBatch(firestore);
      let batchCount = 0;

      for (let i = 0; i < gradeCsvData.length; i++) {
        const row = gradeCsvData[i];
        const email = getRowValue(row, ['Email', 'Email Address', 'Student Email']).toLowerCase().trim();
        const subjectName = getRowValue(row, ['SubjectName', 'Subject', 'Topic']);
        const ca = getRowValue(row, ['CA', 'Continuous Assessment', 'Test']);
        const exam = getRowValue(row, ['Exam', 'Examination', 'Final']);
        const termLabel = getRowValue(row, ['Term', 'Semester']) || 'First Term';
        const yearLabel = getRowValue(row, ['AcademicYear', 'Year', 'Session']) || '2024-2025';
        
        const studentInfo = studentMap.get(email);
        const targetSubjectId = subjectMap[subjectName] || null;

        // "Solid" check: Skip if we can't find the student or the subject isn't mapped
        if (!studentInfo || !targetSubjectId) {
          console.warn(`[Grade Skip] Student or Subject missing mapping at row ${i+1}`, { email, subjectName });
          failCount++;
          setGradeImportProgress(i + 1);
          continue;
        }

        const baseAssessmentData = {
          studentId: studentInfo.uid,
          classId: studentInfo.classId || 'unassigned',
          subjectId: targetSubjectId,
          subjectName: subjects?.find(s => s.id === targetSubjectId)?.name || subjectName,
          academicYear: yearLabel,
          term: termLabel,
          schoolId: schoolId,
          createdAt: serverTimestamp(),
          gradedAt: serverTimestamp(),
          assessmentDate: new Date(),
          maxScore: 100
        };

        // Create CA Document
        const caRef = doc(collection(firestore, 'assessments'));
        batch.set(caRef, {
          ...baseAssessmentData,
          assessmentType: 'Class Exercise (CA)',
          assessmentName: 'Legacy CA Import',
          score: parseFloat(ca) || 0 // Graceful 0 for empty scores
        });

        // Create Exam Document
        const examRef = doc(collection(firestore, 'assessments'));
        batch.set(examRef, {
          ...baseAssessmentData,
          assessmentType: 'End of Term Exam (Exam)',
          assessmentName: 'Legacy Exam Import',
          score: parseFloat(exam) || 0 // Graceful 0 for empty scores
        });

        successCount++;
        batchCount += 2; // Two documents per row
        setGradeImportProgress(i + 1);

        // Firestore batch limit is 500 operations
        if (batchCount >= 450) {
          await batch.commit();
          batch = writeBatch(firestore);
          batchCount = 0;
        }
      }

      // Commit final batch if needed
      if (batchCount > 0) {
        await batch.commit();
      }

      toast({ 
        title: "Grades Imported", 
        description: `Successfully imported ${successCount} subject records. ${failCount} failed mapping.`,
        duration: 8000
      });
      
      if (successCount > 0) {
          setGradeCsvData([]);
          setSubjectMap({});
      }

    } catch (error: any) {
      console.error("Grade Import Error:", error);
      toast({ variant: 'destructive', title: "Import Failed", description: error.message });
    } finally {
      setIsImportingGrades(false);
      setGradeImportProgress(0);
    }
  };

  // --- MEMOS ---

  const uniqueCsvClasses = useMemo(() => {
    const set = new Set<string>();
    studentCsvData.forEach(row => {
      const val = getRowValue(row, ['ClassName', 'Class', 'Grade']);
      if (val) set.add(val);
    });
    return Array.from(set);
  }, [studentCsvData]);

  const uniqueCsvSubjects = useMemo(() => {
    const set = new Set<string>();
    gradeCsvData.forEach(row => {
      const val = getRowValue(row, ['SubjectName', 'Subject', 'Topic']);
      if (val) set.add(val);
    });
    return Array.from(set);
  }, [gradeCsvData]);

  const studentImportPercentage = studentCsvData.length > 0 ? (studentImportProgress / studentCsvData.length) * 100 : 0;
  const parentImportPercentage = parentCsvData.length > 0 ? (parentImportProgress / parentCsvData.length) * 100 : 0;
  const gradeImportPercentage = gradeCsvData.length > 0 ? (gradeImportProgress / gradeCsvData.length) * 100 : 0;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Data <span className="text-indigo-600">Migration</span> Hub</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Bulk Import Students, Parents, and Grades</p>
      </div>

      <Tabs defaultValue="students" value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 flex overflow-x-auto h-auto scrollbar-hide">
          <TabsTrigger value="students" className="rounded-lg px-8 font-bold flex-1"><UserPlus className="mr-2 h-4 w-4"/> Students</TabsTrigger>
          <TabsTrigger value="parents" className="rounded-lg px-8 font-bold flex-1"><HeartHandshake className="mr-2 h-4 w-4"/> Parents</TabsTrigger>
          <TabsTrigger value="grades" className="rounded-lg px-8 font-bold flex-1"><History className="mr-2 h-4 w-4"/> Past Grades</TabsTrigger>
        </TabsList>

        {/* --- TAB: STUDENTS --- */}
        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-slate-800">1. Student Source</CardTitle>
                <CardDescription className="text-xs font-medium text-indigo-600">Upload your register file.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-indigo-600" />
                        <h4 className="text-xs font-black text-indigo-900 uppercase">CSV Header Guide</h4>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-indigo-700 leading-none">Format: FirstName, LastName, Email, ClassName, Gender</p>
                    </div>
                </div>

                {!showTextPaste ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                      <FileSpreadsheet className="h-12 w-12 text-slate-300 group-hover:text-indigo-500 mb-4 transition-colors" />
                      <p className="text-sm font-bold text-slate-600">Upload Student CSV</p>
                      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'students')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <Button variant="ghost" className="w-full text-indigo-600 font-black uppercase text-[10px] tracking-widest" onClick={() => setShowTextPaste(true)}>
                      <Sparkles className="mr-2 h-3 w-3"/> Extract from PDF/Text (AI)
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea value={rawText} onChange={e => setRawText(e.target.value)} placeholder="Paste PDF text here..." className="h-48 rounded-2xl" />
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => setShowTextPaste(false)}>Cancel</Button>
                      <Button disabled={isExtracting} onClick={handleAiExtract} className="flex-[2] bg-purple-600 font-bold">
                        {isExtracting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Wand2 className="mr-2 h-4 w-4"/>}
                        AI Extract
                      </Button>
                    </div>
                  </div>
                )}

                {studentCsvData.length > 0 && (
                  <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 flex items-center justify-between">
                    <p className="text-sm font-black text-indigo-900">{studentCsvData.length} Records Loaded</p>
                    <Button variant="ghost" size="icon" onClick={() => setStudentCsvData([])} className="text-indigo-400 hover:text-red-500"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Class Mapping</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs mt-1">Map CSV labels to system classes</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isImportingStudents && (
                    <div className="mb-8 space-y-4">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-xs font-black text-indigo-600 uppercase">Provisioning Students...</p>
                            <span className="text-sm font-black text-indigo-600">{studentImportProgress} / {studentCsvData.length}</span>
                        </div>
                        <Progress value={studentImportPercentage} className="h-3" />
                    </div>
                )}

                {studentCsvData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <Database className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-bold text-sm uppercase">Load data to start mapping</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uniqueCsvClasses.map(csvClass => (
                        <div key={csvClass} className="p-4 bg-slate-50 border-2 rounded-2xl space-y-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase">CSV: {csvClass}</span>
                          <Select value={classMap[csvClass] || ''} onValueChange={(val) => setClassMap(prev => ({ ...prev, [csvClass]: val }))}>
                            <SelectTrigger className="bg-white border-indigo-100"><SelectValue placeholder="Map to..." /></SelectTrigger>
                            <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button onClick={executeStudentImport} disabled={isImportingStudents || studentCsvData.length === 0} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl">
                  {isImportingStudents ? <Loader2 className="animate-spin mr-2"/> : <Database className="mr-2"/>}
                  Start Migration ({studentCsvData.length})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: PARENTS --- */}
        <TabsContent value="parents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-pink-600 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-slate-800">1. Parent Source</CardTitle>
                <CardDescription className="text-xs font-medium text-pink-600">Upload parent/guardian list.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-pink-600" />
                        <h4 className="text-xs font-black text-pink-900 uppercase">CSV Header Guide</h4>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-pink-700 leading-none">Accepted: FirstName, LastName, Email, Phone, Address, StudentEmail</p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                  <HeartHandshake className="h-12 w-12 text-slate-300 group-hover:text-pink-500 mb-4 transition-colors" />
                  <p className="text-sm font-bold text-slate-600">Upload Parent CSV</p>
                  <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'parents')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                {parentCsvData.length > 0 && (
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100 flex items-center justify-between">
                    <p className="text-sm font-black text-pink-900">{parentCsvData.length} Records Loaded</p>
                    <Button variant="ghost" size="icon" onClick={() => setParentCsvData([])} className="text-pink-400 hover:text-red-500"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Verification & Linking</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs mt-1">Parents will be linked to students by student email address</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isImportingParents && (
                    <div className="mb-8 space-y-4">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-xs font-black text-pink-600 uppercase">Provisioning Parents...</p>
                            <span className="text-sm font-black text-pink-600">{parentImportProgress} / {parentCsvData.length}</span>
                        </div>
                        <Progress value={parentImportPercentage} className="h-3 bg-pink-100" />
                    </div>
                )}

                {parentCsvData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <HeartHandshake className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-bold text-sm uppercase">Load data to review list</p>
                  </div>
                ) : (
                  <div className="border rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="text-[10px] font-black uppercase">Parent Name</TableHead>
                          <TableHead className="text-[10px] font-black uppercase">Student Link</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {parentCsvData.slice(0, 5).map((row, i) => (
                          <TableRow key={i}>
                            <TableCell className="text-xs font-bold">{getRowValue(row, ['FirstName', 'First Name'])} {getRowValue(row, ['LastName', 'Last Name'])}</TableCell>
                            <TableCell className="text-xs italic text-pink-600">{getRowValue(row, ['StudentEmail', 'Student Email', 'Child Email']) || 'No Link'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {parentCsvData.length > 5 && <div className="p-3 text-center text-[10px] text-slate-400 font-bold uppercase border-t">Plus {parentCsvData.length - 5} more...</div>}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button onClick={executeParentImport} disabled={isImportingParents || parentCsvData.length === 0} className="w-full h-14 bg-pink-600 hover:bg-pink-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl">
                  {isImportingParents ? <Loader2 className="animate-spin mr-2"/> : <UserPlus className="mr-2"/>}
                  Import Parents & Link Students ({parentCsvData.length})
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
                <CardDescription className="text-xs font-medium text-orange-600">Link scores to student history.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-orange-600" />
                        <h4 className="text-xs font-black text-orange-900 uppercase">CSV Header Guide</h4>
                    </div>
                    <div className="space-y-1">
                        <p className="text-[10px] text-orange-700 leading-none">Format: Email, SubjectName, CA, Exam, Term, AcademicYear</p>
                    </div>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                  <FileText className="h-12 w-12 text-slate-300 group-hover:text-orange-500 mb-4 transition-colors" />
                  <p className="text-sm font-bold text-slate-600">Upload Grades CSV</p>
                  <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'grades')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                {gradeCsvData.length > 0 && (
                  <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 flex items-center justify-between">
                    <p className="text-sm font-black text-orange-900">{gradeCsvData.length} Grades Loaded</p>
                    <Button variant="ghost" size="icon" onClick={() => setGradeCsvData([])} className="text-orange-400 hover:text-red-500"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Subject Mapping</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs mt-1">Reconcile subjects with system data</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isImportingGrades && (
                    <div className="mb-8 space-y-4">
                        <div className="flex justify-between items-end mb-2">
                            <p className="text-xs font-black text-orange-600 uppercase">Importing Academic History...</p>
                            <span className="text-sm font-black text-orange-600">{gradeImportProgress} / {gradeCsvData.length}</span>
                        </div>
                        <Progress value={gradeImportPercentage} className="h-3 bg-orange-100" />
                    </div>
                )}

                {gradeCsvData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                    <BookCopy className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-bold text-sm uppercase">Load data to start mapping</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uniqueCsvSubjects.map(csvSub => (
                        <div key={csvSub} className="p-4 bg-slate-50 border-2 rounded-2xl space-y-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase">CSV: {csvSub}</span>
                          <Select value={subjectMap[csvSub] || ''} onValueChange={(val) => setSubjectMap(prev => ({ ...prev, [csvSub]: val }))}>
                            <SelectTrigger className="bg-white border-orange-100"><SelectValue placeholder="Map to..." /></SelectTrigger>
                            <SelectContent>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button onClick={executeGradeImport} disabled={isImportingGrades || gradeCsvData.length === 0} className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl">
                  {isImportingGrades ? <Loader2 className="animate-spin mr-2"/> : <History className="mr-2"/>}
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
