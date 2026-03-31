'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, doc, setDoc, serverTimestamp, getDocs, writeBatch, limit, arrayUnion, updateDoc, Timestamp } from 'firebase/firestore';
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
  AlertCircle, FileSpreadsheet, FileText, ArrowRight, UserPlus,
  Trash2, Wand2, Filter, BookCopy, GraduationCap, History, Info, RefreshCw, HeartHandshake, Banknote, Wallet
} from 'lucide-react';
import { extractStudentsFromText } from '@/ai/flows/extract-students-flow';
import type { Class, Subject, Student, FinancialRecord } from '@/lib/types';
import { generateNextStudentId } from '@/lib/student-utils';
import { Progress } from '@/components/ui/progress';

type MigrationTab = 'students' | 'grades' | 'parents' | 'balances';

/**
 * Robust value extractor that handles common CSV variations and missing data.
 * "Solid" mapping strategy for all data hubs.
 */
function getRowValue(row: any, keys: string[]): string {
  if (!row) return '';
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

  // Data State - Balances
  const [balanceCsvData, setBalanceCsvData] = useState<any[]>([]);
  const [isImportingBalances, setIsImportingBalances] = useState(false);
  const [balanceImportProgress, setBalanceImportProgress] = useState(0);

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
        } else if (type === 'balances') {
          setBalanceCsvData(results.data);
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
        
        const email = getRowValue(row, ['Email', 'Email Address', 'User Email', 'student_email']).toLowerCase();
        const firstName = getRowValue(row, ['FirstName', 'First Name', 'Given Name']);
        const lastName = getRowValue(row, ['LastName', 'Last Name', 'Surname']);
        const rawClassName = getRowValue(row, ['ClassName', 'Class', 'Grade']);
        const gender = getRowValue(row, ['Gender', 'Sex']);

        const targetClassId = classMap[rawClassName] || null;

        if (!email || !firstName) {
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

      toast({ title: "Migration Complete", description: `Success: ${successCount}, Failed: ${failCount}.` });
      if (successCount > 0) { setStudentCsvData([]); setClassMap({}); }
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

    try {
      const studentsSnap = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
      const studentEmailMap = new Map<string, string>();
      studentsSnap.docs.forEach(d => {
        const data = d.data();
        if (data.email) studentEmailMap.set(data.email.toLowerCase().trim(), d.id);
      });

      for (let i = 0; i < parentCsvData.length; i++) {
        const row = parentCsvData[i];
        const email = getRowValue(row, ['Email', 'Email Address', 'Parent Email', 'parent_email']).toLowerCase();
        const firstName = getRowValue(row, ['FirstName', 'First Name', 'Parent FirstName']);
        const lastName = getRowValue(row, ['LastName', 'Last Name', 'Parent LastName']);
        const phone = getRowValue(row, ['Phone', 'PhoneNumber']);
        const studentEmail = getRowValue(row, ['StudentEmail', 'Child Email', 'student_email']).toLowerCase();

        if (!email || !firstName) { failCount++; setParentImportProgress(i + 1); continue; }

        const result = await createNewUser(email, "password123", 'Parent', { firstName, lastName }, schoolId);
        if ('error' in result) { failCount++; setParentImportProgress(i + 1); continue; }

        const linkedStudentId = studentEmailMap.get(studentEmail);
        await setDoc(doc(firestore, 'parents', result.uid), {
          uid: result.uid,
          firstName, lastName, email, phone: phone || null,
          schoolId, createdAt: serverTimestamp(),
          studentIds: linkedStudentId ? [linkedStudentId] : [],
          requirePasswordChange: true
        });

        if (linkedStudentId) {
          await updateDoc(doc(firestore, 'students', linkedStudentId), { parentId: result.uid });
        }
        successCount++;
        setParentImportProgress(i + 1);
      }
      toast({ title: "Migration Complete", description: `Success: ${successCount}, Failed: ${failCount}.` });
      if (successCount > 0) setParentCsvData([]);
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

    try {
      const studentsSnapshot = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
      const studentMap = new Map<string, any>();
      studentsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        studentMap.set(data.email?.toLowerCase().trim(), { uid: doc.id, classId: data.classId, subjectName: data.subjectName });
      });

      let batch = writeBatch(firestore);
      let batchCount = 0;

      for (let i = 0; i < gradeCsvData.length; i++) {
        const row = gradeCsvData[i];
        const email = getRowValue(row, ['Email', 'Student Email', 'student_email']).toLowerCase().trim();
        const subjectName = getRowValue(row, ['SubjectName', 'Subject', 'subject_name']);
        const ca = getRowValue(row, ['CA', 'Test', 'ca_score', 'assessment_score']);
        const exam = getRowValue(row, ['Exam', 'Final', 'exam_score', 'test_score']);
        
        const studentInfo = studentMap.get(email);
        const targetSubjectId = subjectMap[subjectName] || null;

        if (!studentInfo || !targetSubjectId) { failCount++; setGradeImportProgress(i + 1); continue; }

        const base = {
          studentId: studentInfo.uid,
          classId: studentInfo.classId || 'unassigned',
          subjectId: targetSubjectId,
          subjectName: subjects?.find(s => s.id === targetSubjectId)?.name || subjectName,
          academicYear: getRowValue(row, ['Year', 'academic_year']) || '2024-2025',
          term: getRowValue(row, ['Term', 'academic_term']) || 'First Term',
          schoolId, createdAt: serverTimestamp(), maxScore: 100
        };

        batch.set(doc(collection(firestore, 'assessments')), { ...base, assessmentType: 'Class Exercise (CA)', score: parseFloat(ca) || 0 });
        batch.set(doc(collection(firestore, 'assessments')), { ...base, assessmentType: 'End of Term Exam (Exam)', score: parseFloat(exam) || 0 });

        successCount++;
        batchCount += 2;
        setGradeImportProgress(i + 1);

        if (batchCount >= 450) { await batch.commit(); batch = writeBatch(firestore); batchCount = 0; }
      }
      if (batchCount > 0) await batch.commit();
      toast({ title: "Grades Imported", description: `Success: ${successCount}, Failed: ${failCount}.` });
      if (successCount > 0) { setGradeCsvData([]); setSubjectMap({}); }
    } catch (error: any) {
      toast({ variant: 'destructive', title: "Import Failed", description: error.message });
    } finally {
      setIsImportingGrades(false);
      setGradeImportProgress(0);
    }
  };

  // --- HANDLERS: BALANCES ---

  const executeBalanceImport = async () => {
    if (!firestore || !schoolId || balanceCsvData.length === 0) return;
    setIsImportingBalances(true);
    setBalanceImportProgress(0);
    
    let successCount = 0;
    let failCount = 0;

    try {
      // 1. Fetch Students to build lookup map
      const studentsSnapshot = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
      const studentMap = new Map<string, any>();
      studentsSnapshot.docs.forEach(docSnap => {
        const data = docSnap.data();
        if (data.email) studentMap.set(data.email.toLowerCase().trim(), { 
          uid: docSnap.id, 
          firstName: data.firstName, 
          lastName: data.lastName, 
          classId: data.classId 
        });
      });

      let batch = writeBatch(firestore);
      let batchCount = 0;

      for (let i = 0; i < balanceCsvData.length; i++) {
        const row = balanceCsvData[i];
        const email = getRowValue(row, ['Email', 'Student Email', 'Email Address', 'student_email']).toLowerCase().trim();
        const balanceStr = getRowValue(row, ['Balance', 'Closing Balance', 'Amount', 'Arrears', 'outstanding', 'debt']);
        
        const studentInfo = studentMap.get(email);
        
        // Solid parsing: Handle commas, currency symbols and extra characters
        const cleanAmountStr = balanceStr.replace(/[^0-9.-]+/g, "");
        const amount = parseFloat(cleanAmountStr);

        if (!studentInfo || isNaN(amount) || amount <= 0) {
          failCount++;
          setBalanceImportProgress(i + 1);
          continue;
        }

        const recordRef = doc(collection(firestore, 'financialRecords'));
        batch.set(recordRef, {
          studentId: studentInfo.uid,
          studentName: `${studentInfo.firstName} ${studentInfo.lastName}`,
          classId: studentInfo.classId || 'unassigned',
          type: 'Other',
          description: 'Opening Balance (System Migration)',
          billedAmount: amount,
          amountPaid: 0,
          status: 'Unpaid',
          dueDate: serverTimestamp(),
          createdAt: serverTimestamp(),
          schoolId: schoolId,
        });

        successCount++;
        batchCount++;
        setBalanceImportProgress(i + 1);

        if (batchCount >= 450) {
          await batch.commit();
          batch = writeBatch(firestore);
          batchCount = 0;
        }
      }

      if (batchCount > 0) await batch.commit();
      toast({ title: "Balances Migrated", description: `Created ${successCount} opening balance records.` });
      if (successCount > 0) setBalanceCsvData([]);

    } catch (error: any) {
      console.error("Balance Migration Error:", error);
      toast({ variant: 'destructive', title: "Migration Failed", description: error.message });
    } finally {
      setIsImportingBalances(false);
      setBalanceImportProgress(0);
    }
  };

  // --- MEMOS ---

  const uniqueCsvClasses = useMemo(() => {
    const set = new Set<string>();
    studentCsvData.forEach(row => {
      const val = getRowValue(row, ['ClassName', 'Class', 'Grade', 'class_name']);
      if (val) set.add(val);
    });
    return Array.from(set);
  }, [studentCsvData]);

  const uniqueCsvSubjects = useMemo(() => {
    const set = new Set<string>();
    gradeCsvData.forEach(row => {
      const val = getRowValue(row, ['SubjectName', 'Subject', 'Topic', 'subject_name']);
      if (val) set.add(val);
    });
    return Array.from(set);
  }, [gradeCsvData]);

  const studentImportPercentage = studentCsvData.length > 0 ? (studentImportProgress / studentCsvData.length) * 100 : 0;
  const parentImportPercentage = parentCsvData.length > 0 ? (parentImportProgress / parentCsvData.length) * 100 : 0;
  const gradeImportPercentage = gradeCsvData.length > 0 ? (gradeImportProgress / gradeCsvData.length) * 100 : 0;
  const balanceImportPercentage = balanceCsvData.length > 0 ? (balanceImportProgress / balanceCsvData.length) * 100 : 0;

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="flex flex-col gap-1 mb-4">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase italic">Data <span className="text-indigo-600">Migration</span> Hub</h1>
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Bulk Import Students, Parents, Grades, and Balances</p>
      </div>

      <Tabs defaultValue="students" value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl mb-6 flex overflow-x-auto h-auto scrollbar-hide">
          <TabsTrigger value="students" className="rounded-lg px-8 font-bold flex-1"><UserPlus className="mr-2 h-4 w-4"/> Students</TabsTrigger>
          <TabsTrigger value="parents" className="rounded-lg px-8 font-bold flex-1"><HeartHandshake className="mr-2 h-4 w-4"/> Parents</TabsTrigger>
          <TabsTrigger value="grades" className="rounded-lg px-8 font-bold flex-1"><History className="mr-2 h-4 w-4"/> Past Grades</TabsTrigger>
          <TabsTrigger value="balances" className="rounded-lg px-8 font-bold flex-1"><Banknote className="mr-2 h-4 w-4"/> Arrears</TabsTrigger>
        </TabsList>

        {/* --- TAB: STUDENTS --- */}
        <TabsContent value="students" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem]">
              <CardHeader><CardTitle className="text-lg font-black uppercase text-slate-800">1. Student Source</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                {!showTextPaste ? (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-all group cursor-pointer relative">
                      <FileSpreadsheet className="h-12 w-12 text-slate-300 group-hover:text-indigo-500 mb-4" />
                      <p className="text-sm font-bold text-slate-600">Upload Student CSV</p>
                      <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'students')} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    <Button variant="ghost" className="w-full text-indigo-600 font-black uppercase text-[10px]" onClick={() => setShowTextPaste(true)}><Sparkles className="mr-2 h-3 w-3"/> AI Extract from Text</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Textarea value={rawText} onChange={e => setRawText(e.target.value)} placeholder="Paste PDF text here..." className="h-48 rounded-2xl" />
                    <Button disabled={isExtracting} onClick={handleAiExtract} className="w-full bg-purple-600 font-bold">{isExtracting ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Wand2 className="mr-2 h-4 w-4"/>} AI Extract</Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8"><CardTitle className="text-xl font-black uppercase tracking-tight">2. Class Mapping</CardTitle></CardHeader>
              <CardContent className="p-8">
                {isImportingStudents && <Progress value={studentImportPercentage} className="h-3 mb-4" />}
                {studentCsvData.length === 0 ? <div className="text-center py-20 text-slate-300 italic">Load data to start mapping</div> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueCsvClasses.map(csvClass => (
                      <div key={csvClass} className="p-4 bg-slate-50 border-2 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">CSV: {csvClass}</span>
                        <Select value={classMap[csvClass] || ''} onValueChange={(val) => setClassMap(prev => ({ ...prev, [csvClass]: val }))}>
                          <SelectTrigger className="bg-white"><SelectValue placeholder="Map to..." /></SelectTrigger>
                          <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button onClick={executeStudentImport} disabled={isImportingStudents || studentCsvData.length === 0} className="w-full h-14 bg-indigo-600 text-white font-black uppercase">Migrate Students ({studentCsvData.length})</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: PARENTS --- */}
        <TabsContent value="parents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-pink-600 shadow-xl rounded-[2rem]">
              <CardHeader><CardTitle className="text-lg font-black uppercase text-slate-800">1. Parent Source</CardTitle></CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 relative">
                  <HeartHandshake className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-600">Upload Parent CSV</p>
                  <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'parents')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8"><CardTitle className="text-xl font-black uppercase tracking-tight">2. Parent-Student Link</CardTitle></CardHeader>
              <CardContent className="p-8">
                {isImportingParents && <Progress value={parentImportPercentage} className="h-3 mb-4" />}
                {parentCsvData.length === 0 ? <div className="text-center py-20 text-slate-300 italic">Upload CSV to begin</div> : (
                  <Table>
                    <TableHeader><TableRow><TableHead>Parent Name</TableHead><TableHead>Student Email</TableHead></TableRow></TableHeader>
                    <TableBody>
                      {parentCsvData.slice(0, 5).map((row, i) => (
                        <TableRow key={i}>
                          <TableCell className="text-xs font-bold">{getRowValue(row, ['FirstName', 'First Name'])} {getRowValue(row, ['LastName', 'Last Name'])}</TableCell>
                          <TableCell className="text-xs text-pink-600">{getRowValue(row, ['StudentEmail', 'Child Email', 'student_email']) || 'No Link'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button onClick={executeParentImport} disabled={isImportingParents || parentCsvData.length === 0} className="w-full h-14 bg-pink-600 text-white font-black uppercase">Migrate Parents ({parentCsvData.length})</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: GRADES --- */}
        <TabsContent value="grades" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-orange-600 shadow-xl rounded-[2rem]">
              <CardHeader><CardTitle className="text-lg font-black uppercase text-slate-800">1. Grades Source</CardTitle></CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 relative">
                  <FileText className="h-12 w-12 text-slate-300 mb-4" />
                  <p className="text-sm font-bold text-slate-600">Upload Grades CSV</p>
                  <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'grades')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
              </CardContent>
            </Card>
            <Card className="lg:col-span-2 shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-slate-900 text-white p-8"><CardTitle className="text-xl font-black uppercase tracking-tight">2. Subject Mapping</CardTitle></CardHeader>
              <CardContent className="p-8">
                {isImportingGrades && <Progress value={gradeImportPercentage} className="h-3 mb-4" />}
                {gradeCsvData.length === 0 ? <div className="text-center py-20 text-slate-300 italic">Upload CSV to begin mapping</div> : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueCsvSubjects.map(csvSub => (
                      <div key={csvSub} className="p-4 bg-slate-50 border-2 rounded-2xl space-y-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase">CSV: {csvSub}</span>
                        <Select value={subjectMap[csvSub] || ''} onValueChange={(val) => setSubjectMap(prev => ({ ...prev, [csvSub]: val }))}>
                          <SelectTrigger className="bg-white"><SelectValue placeholder="Map to..." /></SelectTrigger>
                          <SelectContent>{subjects?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button onClick={executeGradeImport} disabled={isImportingGrades || gradeCsvData.length === 0} className="w-full h-14 bg-orange-600 text-white font-black uppercase">Migrate History ({gradeCsvData.length})</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        {/* --- TAB: BALANCES --- */}
        <TabsContent value="balances" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-1 border-t-4 border-t-emerald-600 shadow-xl rounded-[2rem]">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase text-slate-800">1. Balance Source</CardTitle>
                <CardDescription className="text-xs font-medium text-emerald-600">Bring forward student arrears.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-3">
                    <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-emerald-600" />
                        <h4 className="text-xs font-black text-emerald-900 uppercase">Solid Mapping</h4>
                    </div>
                    <p className="text-[10px] text-emerald-700 leading-tight">Headers accepted: Email, Balance, Closing Balance, Arrears, or Debt.</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 relative group cursor-pointer">
                  <Wallet className="h-12 w-12 text-slate-300 group-hover:text-emerald-500 mb-4 transition-colors" />
                  <p className="text-sm font-bold text-slate-600">Upload Balance CSV</p>
                  <input type="file" accept=".csv" onChange={(e) => handleFileUpload(e, 'balances')} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>

                {balanceCsvData.length > 0 && (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 flex items-center justify-between">
                    <p className="text-sm font-black text-emerald-900">{balanceCsvData.length} Records Loaded</p>
                    <Button variant="ghost" size="icon" onClick={() => setBalanceCsvData([])} className="text-red-500"><Trash2 className="h-4 w-4"/></Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-none">
              <CardHeader className="bg-slate-900 text-white p-8">
                <CardTitle className="text-xl font-black uppercase tracking-tight">2. Review Arrears</CardTitle>
                <CardDescription className="text-slate-400 font-bold text-xs mt-1">Parsed balances will be recorded as 'Opening Balance' bills.</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {isImportingBalances && <Progress value={balanceImportPercentage} className="h-3 mb-6 bg-emerald-100" />}
                
                {balanceCsvData.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-slate-200">
                    <Banknote className="h-16 w-16 mb-4 opacity-10" />
                    <p className="font-bold uppercase tracking-widest text-sm">Upload CSV to begin</p>
                  </div>
                ) : (
                  <div className="border rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="text-[10px] font-black uppercase">Student Email</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-right">Parsed Balance (GH₵)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {balanceCsvData.slice(0, 10).map((row, i) => {
                          const email = getRowValue(row, ['Email', 'Student Email', 'Email Address', 'student_email']);
                          const balStr = getRowValue(row, ['Balance', 'Arrears', 'Amount', 'Closing Balance', 'debt']);
                          const cleanAmt = balStr.replace(/[^0-9.-]+/g, "");
                          
                          return (
                            <TableRow key={i}>
                              <TableCell className="text-xs font-medium">{email}</TableCell>
                              <TableCell className="text-xs font-black text-right text-red-600">
                                  {isNaN(parseFloat(cleanAmt)) ? 'Invalid' : `GH₵${parseFloat(cleanAmt).toFixed(2)}`}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                    {balanceCsvData.length > 10 && <div className="p-3 text-center text-[10px] text-slate-400 font-bold uppercase border-t bg-slate-50">And {balanceCsvData.length - 10} more...</div>}
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-slate-50 p-8 border-t">
                <Button 
                    onClick={executeBalanceImport} 
                    disabled={isImportingBalances || balanceCsvData.length === 0} 
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl"
                >
                  {isImportingBalances ? <Loader2 className="animate-spin mr-3 h-6 w-6"/> : <Database className="mr-3 h-6 w-6"/>}
                  Inject Opening Balances ({balanceCsvData.length})
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}