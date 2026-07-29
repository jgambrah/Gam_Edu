'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase, useDoc, useAuth } from '@/firebase';
import { useRole } from '@/context/role-context';
import { logAuditEvent } from '@/lib/audit';
import { collection, doc, query, where, getDocs, getDoc, onSnapshot, updateDoc, serverTimestamp, addDoc, orderBy, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdmissionApplication, Class, Student, studentRegistrationSchema, StudentRegistrationData } from '@/lib/types';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, differenceInYears } from 'date-fns';
import { Loader2, ShieldCheck, ThumbsDown, FilePenLine, BrainCircuit, Sparkles, Check, X, UserPlus, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { updateDocumentNonBlocking, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { recommendClassPlacementAction } from '@/ai/flows/admission-actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { createNewUser } from '@/app/actions/create-user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { ApplicationTracker } from '@/components/dashboard/admissions/application-tracker';
import { Badge } from '@/components/ui/badge';
import { StudentDisplay } from '@/components/student-display';
import { generateNextStudentId } from '@/lib/student-utils';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { checkAndSpendCredits } from '@/app/actions/credits';
import { TimelineService } from '@/lib/timeline-service';

function ParentApplicationForm({ onSuccess, schoolId }: { onSuccess: () => void, schoolId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    const form = useForm<StudentRegistrationData>({
      resolver: zodResolver(studentRegistrationSchema),
      defaultValues: {
        student: { fullName: '', gender: '', address: '', desiredGrade: '' },
        parent1: { name: '', relationship: '', phone: '', email: '', address: '', addressSameAsStudent: false },
        addParent2: false,
        emergencyContact: { name: '', relationship: '', phone: '' },
        addMedicalInfo: false,
      },
    });

    async function onSubmit(values: StudentRegistrationData) {
        if (!user) return;
        setIsSubmitting(true);
        try {
            const appId = `APP-${Date.now()}`;
            const applicationData = {
                ...values,
                applicationId: appId,
                status: 'Pending Review',
                submittedByParentId: user.uid,
                submittedAt: serverTimestamp(),
                schoolId: schoolId,
            };
    
            await addDocumentNonBlocking(collection(firestore!, 'admissionApplications'), applicationData);
    
            toast({
                title: 'Application Submitted!',
                description: `Application ID: ${appId}. You will be notified of the decision.`,
            });
            form.reset();
            onSuccess();
        } catch (error) {
            console.error('Error submitting application:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Submission failed.' });
        } finally {
            setIsSubmitting(false);
        }
      }

      return (
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>New Student Admission</CardTitle>
            <CardDescription>Submit an application for your child.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <section className="space-y-4">
                  <h3 className="font-semibold text-lg border-b pb-2">Student Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField control={form.control} name="student.fullName" render={({ field }) => (
                          <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="student.dateOfBirth" render={({ field }) => (
                        <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                            <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                        )}/>
                       <FormField control={form.control} name="student.desiredGrade" render={({ field }) => (
                        <FormItem><FormLabel>Desired Grade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl>
                        <SelectContent>{['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'JHS 1', 'JHS 2'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="student.gender" render={({ field }) => (
                        <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="student.address" render={({ field }) => (
                  <FormItem><FormLabel>Full Residential Address</FormLabel><FormControl><Input placeholder="Address" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
                  </div>
                </section>
                
                <section className="space-y-4">
                  <h3 className="text-xl font-semibold">Parent / Guardian 1 Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="parent1.name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="parent1.relationship" render={({ field }) => (
                        <FormItem><FormLabel>Relationship to Student</FormLabel><FormControl><Input placeholder="e.g., Mother, Father" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="parent1.phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="parent1.email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                  </div>
                  <FormField control={form.control} name="parent1.addressSameAsStudent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Address is the same as student's</FormLabel></div>
                    </FormItem>
                  )}/>
                </section>
    
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4"/>}
                  Submit Application
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      );
}

// --- ADMIN REVIEW DASHBOARD ---
function AdminApplicationDashboard() {
    const auth = useAuth();
    const firestore = useFirestore();
    const { user } = useUser();
    const { profile } = useRole();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();

    // Data State
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableClasses, setAvailableClasses] = useState<{id: string, name: string, capacity: number, currentStudents: number}[]>([]);
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loadingEnquiries, setLoadingEnquiries] = useState(true);
    
    // Dialog State
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [decision, setDecision] = useState<'Approve' | 'Reject' | null>(null);
    const [assignedClass, setAssignedClass] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    // AI State
    const [aiThinking, setAiThinking] = useState(false);
    const [aiReasoning, setAiReasoning] = useState<string | null>(null);

    // Evaluation Scores State
    const [entranceExamScore, setEntranceExamScore] = useState('');
    const [interviewScore, setInterviewScore] = useState('');
    const [processingScores, setProcessingScores] = useState(false);

    // Student Credentials State
    const [studentEmail, setStudentEmail] = useState('');
    const [studentPassword, setStudentPassword] = useState('password123');

    // School data query
    const schoolRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schools', schoolId) : null, [firestore, schoolId]);
    const { data: schoolData } = useDoc<any>(schoolRef);

    useEffect(() => {
        if (selectedApp) {
            setEntranceExamScore(selectedApp.entranceExamScore !== undefined && selectedApp.entranceExamScore !== null ? selectedApp.entranceExamScore.toString() : '');
            setInterviewScore(selectedApp.interviewScore !== undefined && selectedApp.interviewScore !== null ? selectedApp.interviewScore.toString() : '');
        } else {
            setEntranceExamScore('');
            setInterviewScore('');
        }
    }, [selectedApp]);

    useEffect(() => {
        if (decision === 'Approve' && selectedApp && !studentEmail) {
            const cleanName = selectedApp.student.fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanSlug = schoolData?.slug || 'school';
            setStudentEmail(`${cleanName}@${cleanSlug}.gamedu.com`);
        } else if (!selectedApp) {
            setStudentEmail('');
            setStudentPassword('password123');
        }
    }, [decision, selectedApp, schoolData, studentEmail]);

    const averageScore = useMemo(() => {
        if (!selectedApp) return 0;
        const exam = selectedApp.entranceExamScore || 0;
        const interview = selectedApp.interviewScore || 0;
        const count = (selectedApp.entranceExamScore !== undefined && selectedApp.entranceExamScore !== null ? 1 : 0) + 
                      (selectedApp.interviewScore !== undefined && selectedApp.interviewScore !== null ? 1 : 0);
        return count > 0 ? Math.round((exam + interview) / count) : 0;
    }, [selectedApp]);

    const hasScores = selectedApp?.entranceExamScore !== undefined && selectedApp?.entranceExamScore !== null || 
                      selectedApp?.interviewScore !== undefined && selectedApp?.interviewScore !== null;

    useEffect(() => {
        if (!firestore || !schoolId) return;
        const q = query(
            collection(firestore, 'admissionApplications'),
            where('schoolId', '==', schoolId),
            where('isArchived', '!=', true)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            apps.sort((a: any, b: any) => {
                const timeA = a.submittedAt?.seconds || 0;
                const timeB = b.submittedAt?.seconds || 0;
                return timeB - timeA;
            });
            setApplications(apps);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firestore, schoolId]);

    useEffect(() => {
        if (!firestore || !schoolId) return;
        const q = query(
            collection(firestore, 'admissionEnquiries'),
            where('schoolId', '==', schoolId),
            where('isArchived', '!=', true)
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const enqs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            enqs.sort((a: any, b: any) => {
                const timeA = a.createdAt?.seconds || 0;
                const timeB = b.createdAt?.seconds || 0;
                return timeB - timeA;
            });
            setEnquiries(enqs);
            setLoadingEnquiries(false);
        });
        return () => unsubscribe();
    }, [firestore, schoolId]);

    const handleToggleEnquiryStatus = async (enquiryId: string, currentStatus: string) => {
        if (!firestore) return;
        try {
            const newStatus = currentStatus === 'Responded' ? 'Pending Response' : 'Responded';
            await updateDoc(doc(firestore, 'admissionEnquiries', enquiryId), {
                status: newStatus
            });
            toast({ title: "Status Updated", description: `Enquiry status updated to ${newStatus}.` });
        } catch (e) {
            console.error(e);
            toast({ variant: 'destructive', title: "Error", description: "Failed to update status." });
        }
    };

    useEffect(() => {
        if (!firestore || !schoolId) return;
        const fetchClasses = async () => {
            const querySnapshot = await getDocs(query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)));
            
            const studentsQuery = await getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId)));
            const studentsData = studentsQuery.docs.map(doc => doc.data() as Student);
            
            const classesData = querySnapshot.docs.map(doc => {
                const currentStudents = studentsData.filter(s => s.classId === doc.id).length;
                return {
                    id: doc.id,
                    name: doc.data().name || doc.id,
                    capacity: doc.data().capacity || 30,
                    currentStudents: currentStudents,
                };
            });
            setAvailableClasses(classesData as any);
        };
        fetchClasses();
    }, [firestore, schoolId]);

    const handleAskAI = async () => {
        if (!selectedApp || availableClasses.length === 0 || !schoolId) return;
        setAiThinking(true);
        setAiReasoning(null);

        const creditResult = await checkAndSpendCredits(schoolId, 1);
        if (!creditResult.success) {
            toast({ variant: "destructive", title: "AI Credit Error", description: creditResult.error });
            setAiThinking(false);
            return;
        }

        const dob = selectedApp.student.dateOfBirth?.toDate ? selectedApp.student.dateOfBirth.toDate() : new Date();
        const age = differenceInYears(new Date(), dob);

        const aiResult = await recommendClassPlacementAction(
            {
                name: selectedApp.student.fullName,
                age: age,
                gender: selectedApp.student.gender,
                desiredGrade: selectedApp.student.desiredGrade
            },
            availableClasses
        );

        if (aiResult.success && aiResult.data) {
            if (aiResult.data.recommendedClassId) {
                setAssignedClass(aiResult.data.recommendedClassId);
            }
            setAiReasoning(aiResult.data.reasoning);
        } else {
            toast({ variant: "destructive", title: "AI Failed", description: "Could not generate a suggestion." });
        }
        setAiThinking(false);
    };

    const handleStartReview = async (app: any) => {
        if (!firestore || !user || !schoolId) return;
        setProcessing(true);
        try {
            const appRef = doc(firestore, 'admissionApplications', app.id);
            await updateDoc(appRef, {
                status: 'Under Review',
                reviewedBy: user.uid,
                reviewedAt: serverTimestamp()
            });

            let academicYear = '';
            let term = '';
            try {
                const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId));
                if (settingsSnap.exists()) {
                    academicYear = settingsSnap.data().academicYear || '';
                    term = settingsSnap.data().term || '';
                }
            } catch (e) {
                console.error("Failed to fetch settings:", e);
            }

            try {
                await TimelineService.logEvent(firestore, {
                    studentId: app.submittedByParentId,
                    title: "Application Under Review",
                    description: `Admission application (${app.applicationId}) has been moved to Under Review.`,
                    category: 'admission',
                    schoolId,
                    recordedBy: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user.displayName || 'System'),
                    recordedById: user.uid,
                    academicYear,
                    term,
                    date: new Date()
                });
            } catch (err) {
                console.error("Failed to log timeline event:", err);
            }

            toast({ title: "Review Started", description: "Application status updated to Under Review." });
            setSelectedApp((prev: any) => ({ ...prev, status: 'Under Review' }));
        } catch (error) {
            console.error('Error starting review:', error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update application." });
        } finally {
            setProcessing(false);
        }
    };

    const handleSaveScores = async () => {
        if (!selectedApp || !firestore) return;
        setProcessingScores(true);
        try {
            const appRef = doc(firestore, 'admissionApplications', selectedApp.id);
            const updates: any = {};
            
            updates.entranceExamScore = entranceExamScore !== '' ? Number(entranceExamScore) : null;
            updates.interviewScore = interviewScore !== '' ? Number(interviewScore) : null;

            await updateDoc(appRef, updates);
            toast({ title: "Scores Saved", description: "Admission evaluation scores have been updated." });
            
            setSelectedApp((prev: any) => ({
                ...prev,
                ...updates
            }));
        } catch (error) {
            console.error("Failed to save scores:", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to save evaluation scores." });
        } finally {
            setProcessingScores(false);
        }
    };

    const handleProcessApplication = async () => {
        if (!selectedApp || !user || !schoolId || !firestore) return;
        setProcessing(true);

        try {
            const appRef = doc(firestore, 'admissionApplications', selectedApp.id);
            const timestamp = serverTimestamp();

            if (decision === 'Approve') {
                if (!assignedClass) {
                    toast({ variant: "destructive", title: "Class Required", description: "Please assign a class." });
                    setProcessing(false);
                    return;
                }
                
                const newStudentId = await generateNextStudentId(firestore, schoolId);
                const fullName = (selectedApp.student.fullName || '').trim();
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || 'New';
                const lastName = nameParts.slice(1).join(' ') || 'Student';

                if (!studentEmail.trim()) {
                    toast({ variant: "destructive", title: "Email Required", description: "Please enter a student email address." });
                    setProcessing(false);
                    return;
                }

                // Create Firebase User account for the student
                const idToken = await auth?.currentUser?.getIdToken();
                const userResult = await createNewUser(
                    studentEmail.trim(), 
                    studentPassword || 'password123', 
                    'Student', 
                    { firstName, lastName }, 
                    schoolId,
                    idToken
                );

                if (userResult.error) {
                    toast({ variant: "destructive", title: "Account Creation Failed", description: userResult.error });
                    setProcessing(false);
                    return;
                }

                const newUid = userResult.uid;
                if (!newUid) {
                    toast({ variant: "destructive", title: "Account Creation Failed", description: "Failed to generate UID for student." });
                    setProcessing(false);
                    return;
                }

                const studentData = {
                    uid: newUid,
                    studentId: newStudentId,
                    firstName: firstName,
                    lastName: lastName,
                    email: studentEmail.trim(),
                    classId: assignedClass,
                    gender: selectedApp.student.gender,
                    dateOfBirth: selectedApp.student.dateOfBirth,
                    address: selectedApp.student.address,
                    enrollmentStatus: 'Active',
                    schoolId: schoolId,
                    parentId: selectedApp.submittedByParentId || null,
                };
                
                // Save the full student details into the collection using the generated UID
                await setDoc(doc(firestore, 'students', newUid), studentData, { merge: true });

                let academicYear = '';
                let term = '';
                try {
                    const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', schoolId));
                    if (settingsSnap.exists()) {
                        academicYear = settingsSnap.data().academicYear || '';
                        term = settingsSnap.data().term || '';
                    }
                } catch (e) {
                    console.error("Failed to fetch settings:", e);
                }

                try {
                    await TimelineService.logEvent(firestore, {
                        studentId: newUid,
                        title: "Admission Approved",
                        description: `Admission application (${selectedApp.applicationId}) has been approved and student is assigned to class ${availableClasses?.find(c => c.id === assignedClass)?.name || assignedClass}.`,
                        category: 'admission',
                        classId: assignedClass,
                        className: availableClasses?.find(c => c.id === assignedClass)?.name || null,
                        schoolId,
                        recordedBy: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user.displayName || 'System'),
                        recordedById: user.uid,
                        academicYear,
                        term,
                        date: new Date()
                    });
                } catch (err) {
                    console.error("Failed to log timeline event for approved admission:", err);
                }

                await updateDoc(appRef, {
                    status: 'Admitted',
                    assignedClassId: assignedClass,
                    reviewedBy: user.uid,
                    reviewedAt: timestamp
                });

                toast({ title: "Approved", description: "Student enrolled and parent notified." });

            } else {
                await updateDoc(appRef, {
                    status: 'Rejected',
                    rejectionReason: rejectionReason || 'Does not meet criteria',
                    reviewedBy: user.uid,
                    reviewedAt: timestamp
                });
                toast({ variant: "default", title: "Rejected", description: "Application status updated." });
            }

            await logAuditEvent({
                firestore,
                schoolId,
                userName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user.displayName || user.email || 'Anonymous'),
                action: decision === 'Approve' ? 'APPROVE_ADMISSION' : 'REJECT_ADMISSION',
                details: decision === 'Approve'
                    ? `Approved admission application (${selectedApp.applicationId}) for student ${selectedApp.student?.fullName || ''} and assigned to class ${availableClasses?.find(c => c.id === assignedClass)?.name || assignedClass}`
                    : `Rejected admission application (${selectedApp.applicationId}) for student ${selectedApp.student?.fullName || ''}. Reason: ${rejectionReason || 'Does not meet criteria'}`
            });

            setSelectedApp(null);
            setDecision(null);
            setAssignedClass('');
            setRejectionReason('');
            setAiReasoning(null);

        } catch (error) {
            console.error(error);
            toast({ variant: "destructive", title: "Error", description: "Failed to process application." });
        } finally {
            setProcessing(false);
        }
    };
    
    const pendingApps = useMemo(() => applications.filter(a => a.status === 'Pending Review'), [applications]);
    const underReviewApps = useMemo(() => applications.filter(a => a.status === 'Under Review'), [applications]);
    const admittedApps = useMemo(() => applications.filter(a => a.status === 'Admitted' || a.status === 'Enrolled'), [applications]);
    const rejectedApps = useMemo(() => applications.filter(a => a.status === 'Rejected'), [applications]);

    const getAiFlags = (app: any) => {
        const flags = [];

        const dob = app.student.dateOfBirth?.toDate ? app.student.dateOfBirth.toDate() : null;
        if(dob) {
            const age = differenceInYears(new Date(), dob);
            const gradeNum = parseInt(app.student.desiredGrade.replace(/\D/g, ''), 10);
            
            if (gradeNum && (age < gradeNum + 4 || age > gradeNum + 7)) {
                flags.push({type: 'warning', text: `AI Flag: Age Mismatch (Age ${age} for ${app.student.desiredGrade})`});
            }
        }

        const targetClasses = availableClasses.filter(c => c.name.includes(app.student.desiredGrade));
        if (targetClasses.length > 0 && targetClasses.every(c => c.currentStudents >= c.capacity)) {
            flags.push({type: 'info', text: 'AI Flag: Waitlist Recommended (Class Full)'});
        }
        
        return flags;
    };

    const renderAppList = (list: any[], emptyTitle: string, emptyDesc: string) => {
        if (list.length === 0) {
            return (
                <div className="py-16 text-center text-slate-400 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="h-10 w-10 text-slate-300" />
                    <div>
                        <p className="font-semibold text-slate-700">{emptyTitle}</p>
                        <p className="text-xs text-slate-400 mt-1">{emptyDesc}</p>
                    </div>
                </div>
            );
        }

        return (
            <div className="grid gap-4">
                {list.map((app) => {
                    const aiFlags = getAiFlags(app);
                    return (
                        <div key={app.id} className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-violet-200 transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 font-bold text-lg border border-violet-100/50">
                                        {app.student.fullName?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h3 className="font-semibold text-slate-800 text-lg group-hover:text-violet-700 transition-colors">
                                                {app.student.fullName}
                                            </h3>
                                            {aiFlags.map((flag, i) => (
                                                <Badge key={i} variant={flag.type === 'warning' ? 'destructive' : 'secondary'} className={cn("text-xs font-semibold px-2 py-0.5", flag.type === 'warning' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100/50 border-rose-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100/50 border-amber-100')}>
                                                    <AlertCircle className="h-3 w-3 mr-1 shrink-0" /> {flag.text}
                                                </Badge>
                                            ))}
                                        </div>
                                        
                                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                                            <span className="flex items-center gap-1.5">
                                                Desired: <Badge variant="outline" className="border-violet-100 bg-violet-50/50 text-violet-700 font-semibold px-2 py-0.5 rounded-md">{app.student.desiredGrade}</Badge>
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span>App ID: <code className="font-mono text-slate-600 bg-slate-50 px-1 py-0.5 rounded border border-slate-100">{app.applicationId}</code></span>
                                            <span className="text-slate-300">•</span>
                                            <span>Parent: <strong className="text-slate-600 font-medium">{app.parent1.name}</strong></span>
                                            {app.submittedAt && (
                                                <>
                                                    <span className="text-slate-300">•</span>
                                                    <span>Submitted: {app.submittedAt.toDate ? format(app.submittedAt.toDate(), 'PP') : 'N/A'}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 md:self-center self-end">
                                    <Button size="sm" variant="outline" className="h-9 text-violet-655 hover:text-violet-700 hover:bg-violet-50 border-violet-200 font-semibold rounded-xl transition-all"
                                        onClick={() => { setSelectedApp(app); setDecision(null); }}>
                                        <FilePenLine className="mr-1.5 h-4 w-4 text-violet-500" /> Review Application
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-50 border border-dashed rounded-3xl min-h-[300px]">
                <Loader2 className="animate-spin h-8 w-8 text-violet-600 mb-3" />
                <p className="text-sm font-semibold tracking-wide uppercase">Loading Admission Applications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Executive Gradient Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 p-8 md:p-10 text-white shadow-xl shadow-violet-100/50 dark:shadow-none">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-100 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5 text-violet-200" /> Admissions & Intake
                        </span>
                        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Admissions Control Center</h1>
                        <p className="mt-2 text-violet-100/80 max-w-xl text-sm md:text-base leading-relaxed">
                            Process incoming student applications, utilize AI-powered placement recommendations, and manage class distribution settings.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 shrink-0">
                        <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-md border border-white/10">
                            <div className="text-xs text-violet-200 uppercase tracking-wider font-bold">New/Pending</div>
                            <div className="text-2xl md:text-3xl font-black mt-1">{pendingApps.length} Applications</div>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-5 py-4 backdrop-blur-md border border-white/10">
                            <div className="text-xs text-violet-200 uppercase tracking-wider font-bold">In Review</div>
                            <div className="text-2xl md:text-3xl font-black mt-1">{underReviewApps.length} Applications</div>
                        </div>
                    </div>
                </div>
                {/* Visual Glows */}
                <div className="absolute right-0 top-0 -mr-12 -mt-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
                <div className="absolute left-1/3 bottom-0 -mb-12 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl pointer-events-none"></div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-800">Incoming Applications</h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{applications.length} total records</span>
                </div>
                
                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid grid-cols-5 w-full md:max-w-3xl bg-slate-100 rounded-2xl p-1">
                        <TabsTrigger value="pending" className="rounded-xl font-bold text-xs md:text-sm">
                            Pending ({pendingApps.length})
                        </TabsTrigger>
                        <TabsTrigger value="review" className="rounded-xl font-bold text-xs md:text-sm">
                            Reviewing ({underReviewApps.length})
                        </TabsTrigger>
                        <TabsTrigger value="admitted" className="rounded-xl font-bold text-xs md:text-sm">
                            Admitted ({admittedApps.length})
                        </TabsTrigger>
                        <TabsTrigger value="rejected" className="rounded-xl font-bold text-xs md:text-sm">
                            Rejected ({rejectedApps.length})
                        </TabsTrigger>
                        <TabsTrigger value="enquiries" className="rounded-xl font-bold text-xs md:text-sm">
                            Enquiries ({enquiries.length})
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-6 space-y-4">
                        {renderAppList(pendingApps, 'No pending applications', 'Newly submitted applications will show up here.')}
                    </TabsContent>
                    <TabsContent value="review" className="mt-6 space-y-4">
                        {renderAppList(underReviewApps, 'No applications in review', 'Move pending applications to "Under Review" to track progress.')}
                    </TabsContent>
                    <TabsContent value="admitted" className="mt-6 space-y-4">
                        {renderAppList(admittedApps, 'No admitted students', 'Applications you approve will list here.')}
                    </TabsContent>
                    <TabsContent value="rejected" className="mt-6 space-y-4">
                        {renderAppList(rejectedApps, 'No rejected applications', 'Unsuccessful applications will list here.')}
                    </TabsContent>
                    <TabsContent value="enquiries" className="mt-6 space-y-4">
                        {loadingEnquiries ? (
                            <div className="flex justify-center py-12"><Loader2 className="animate-spin h-6 w-6 text-violet-650"/></div>
                        ) : enquiries.length === 0 ? (
                            <div className="py-16 text-center text-slate-400 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center gap-4">
                                <AlertCircle className="h-10 w-10 text-slate-350" />
                                <p className="font-semibold text-slate-700">No enquiries submitted yet</p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                {enquiries.map((enq) => (
                                    <div key={enq.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-slate-800 text-lg">{enq.parentName}</h4>
                                                    <Badge variant="outline" className="border-indigo-100 bg-indigo-50/50 text-indigo-700 font-semibold text-xs px-2 py-0.5 rounded-md">
                                                        Interested in {enq.interest}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-slate-550 font-semibold space-x-3 mt-1">
                                                    <span>📞 {enq.parentPhone}</span>
                                                    <span>✉️ {enq.parentEmail}</span>
                                                    <span>📅 Submitted: {enq.createdAt?.toDate ? format(enq.createdAt.toDate(), 'PP') : 'N/A'}</span>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                variant={enq.status === 'Responded' ? 'outline' : 'default'}
                                                className={cn(
                                                    "rounded-xl font-bold transition-all h-9 self-start sm:self-center",
                                                    enq.status === 'Responded' ? 'text-slate-505 border-slate-200 hover:bg-slate-50' : 'bg-violet-600 hover:bg-violet-700 text-white shadow-sm'
                                                )}
                                                onClick={() => handleToggleEnquiryStatus(enq.id, enq.status)}
                                            >
                                                {enq.status === 'Responded' ? '✓ Responded' : 'Mark Responded'}
                                            </Button>
                                        </div>
                                        <Separator className="my-3 opacity-60" />
                                        <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium leading-relaxed">
                                            {enq.message}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>

            <Dialog open={!!selectedApp} onOpenChange={(open) => { if(!open) { setSelectedApp(null); setDecision(null); setAiReasoning(null); } }}>
                <DialogContent className="sm:max-w-2xl rounded-[2rem] p-6 max-h-[90vh] flex flex-col justify-between overflow-hidden">
                    <DialogHeader className="pb-3 border-b">
                        <DialogTitle className="text-xl font-bold flex items-center gap-2">
                            {decision === 'Approve' ? (
                                <span className="flex items-center gap-2 text-emerald-600"><CheckCircle2 className="h-5 w-5" /> Approve Application</span>
                            ) : decision === 'Reject' ? (
                                <span className="flex items-center gap-2 text-rose-600"><AlertCircle className="h-5 w-5" /> Reject Application</span>
                            ) : (
                                <span className="flex items-center gap-2 text-violet-650"><GraduationCap className="h-6 w-6" /> Review Admission Application</span>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 text-xs">
                            Reviewing <strong>{selectedApp?.student?.fullName}</strong> for {selectedApp?.student?.desiredGrade}.
                        </DialogDescription>
                    </DialogHeader>

                    {decision === null && selectedApp && (
                        <div className="space-y-6 py-4 overflow-y-auto flex-1 pr-1">
                            {/* App status badge */}
                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current Status</p>
                                    <Badge className={cn(
                                        "mt-1 font-bold rounded-lg px-2.5 py-1 text-xs border shadow-none",
                                        selectedApp.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        selectedApp.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                        selectedApp.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                        'bg-blue-50 text-blue-700 border-blue-100'
                                    )}>
                                        {selectedApp.status}
                                    </Badge>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Application ID</p>
                                    <p className="font-mono text-sm font-bold text-slate-700 mt-1">{selectedApp.applicationId}</p>
                                </div>
                            </div>

                            {/* Section 1: Student Information */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-violet-600 border-b pb-1">Student Details</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                                    <div>
                                        <span className="text-slate-400 text-xs block">Full Name</span>
                                        <span className="font-semibold text-slate-750">{selectedApp.student?.fullName}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-xs block">Desired Grade</span>
                                        <span className="font-semibold text-slate-750">{selectedApp.student?.desiredGrade}</span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-xs block">Date of Birth</span>
                                        <span className="font-semibold text-slate-750">
                                            {selectedApp.student?.dateOfBirth?.toDate 
                                                ? format(selectedApp.student.dateOfBirth.toDate(), 'PPP') 
                                                : selectedApp.student?.dateOfBirth ? format(new Date(selectedApp.student.dateOfBirth), 'PPP') : 'N/A'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-400 text-xs block">Gender</span>
                                        <span className="font-semibold text-slate-750">{selectedApp.student?.gender}</span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-400 text-xs block">Address</span>
                                        <span className="font-medium text-slate-750">{selectedApp.student?.address}</span>
                                    </div>
                                    {selectedApp.student?.previousSchool && (
                                        <div className="col-span-2">
                                            <span className="text-slate-400 text-xs block">Previous School</span>
                                            <span className="font-medium text-slate-750">{selectedApp.student.previousSchool}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 2: Parent Information */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase tracking-wider text-violet-600 border-b pb-1">Parent / Guardian Details</h4>
                                <div className="bg-slate-50 p-4 rounded-2xl space-y-4 border border-slate-100">
                                    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm border-b pb-4 border-slate-200/60 last:border-b-0 last:pb-0">
                                        <div className="col-span-2">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Parent 1 (Primary)</span>
                                            <span className="font-bold text-slate-800 text-base">{selectedApp.parent1?.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs block">Relationship</span>
                                            <span className="font-semibold text-slate-700">{selectedApp.parent1?.relationship}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs block">Phone</span>
                                            <span className="font-semibold text-slate-700">{selectedApp.parent1?.phone}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-400 text-xs block">Email</span>
                                            <span className="font-semibold text-slate-700 break-all">{selectedApp.parent1?.email}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-slate-400 text-xs block">Address</span>
                                            <span className="font-medium text-slate-700">
                                                {selectedApp.parent1?.addressSameAsStudent ? 'Same as Student Address' : selectedApp.parent1?.address}
                                            </span>
                                        </div>
                                    </div>

                                    {selectedApp.addParent2 && selectedApp.parent2 && (
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm pt-2">
                                            <div className="col-span-2">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Parent 2 (Secondary)</span>
                                                <span className="font-bold text-slate-800 text-base">{selectedApp.parent2.name}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs block">Relationship</span>
                                                <span className="font-semibold text-slate-700">{selectedApp.parent2.relationship}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 text-xs block">Phone</span>
                                                <span className="font-semibold text-slate-700">{selectedApp.parent2.phone}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-slate-400 text-xs block">Email</span>
                                                <span className="font-semibold text-slate-700 break-all">{selectedApp.parent2.email}</span>
                                            </div>
                                            <div className="col-span-2">
                                                <span className="text-slate-400 text-xs block">Address</span>
                                                <span className="font-medium text-slate-700">
                                                    {selectedApp.parent2.addressSameAsStudent ? 'Same as Student' : selectedApp.parent2.address}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section 3: Emergency & Medical Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-violet-600 border-b pb-1">Emergency Contact</h4>
                                    <div className="text-sm space-y-2">
                                        <div>
                                            <span className="text-slate-400 text-xs block">Contact Name</span>
                                            <span className="font-semibold text-slate-750">{selectedApp.emergencyContact?.name}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs block">Relationship</span>
                                            <span className="font-semibold text-slate-750">{selectedApp.emergencyContact?.relationship}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 text-xs block">Phone</span>
                                            <span className="font-semibold text-slate-750">{selectedApp.emergencyContact?.phone}</span>
                                        </div>
                                    </div>
                                </div>

                                {selectedApp.addMedicalInfo && selectedApp.medical && (
                                    <div className="space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-violet-600 border-b pb-1">Medical Info</h4>
                                        <div className="text-sm space-y-2">
                                            {selectedApp.medical.allergies && (
                                                <div>
                                                    <span className="text-slate-400 text-xs block">Allergies</span>
                                                    <span className="font-semibold text-slate-750">{selectedApp.medical.allergies}</span>
                                                </div>
                                            )}
                                            {selectedApp.medical.conditions && (
                                                <div>
                                                    <span className="text-slate-400 text-xs block">Medical Conditions</span>
                                                    <span className="font-semibold text-slate-750">{selectedApp.medical.conditions}</span>
                                                </div>
                                            )}
                                            {selectedApp.medical.physicianName && (
                                                <div>
                                                    <span className="text-slate-400 text-xs block">Physician</span>
                                                    <span className="font-semibold text-slate-750">
                                                        {selectedApp.medical.physicianName} {selectedApp.medical.physicianPhone ? `(${selectedApp.medical.physicianPhone})` : ''}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Section 3.5: Scientific Evaluation & Scores */}
                            <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                <div className="flex items-center gap-1.5 border-b pb-1">
                                    <span className="text-lg">📊</span>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-violet-650">Scientific Evaluation</h4>
                                </div>
                                <p className="text-[11px] text-slate-500 font-medium">Enter optional entrance exam and interview scores to assess the student scientifically.</p>
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-slate-650">Entrance Exam Score (0-100)</Label>
                                        <Input 
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="e.g. 85"
                                            value={entranceExamScore}
                                            onChange={(e) => setEntranceExamScore(e.target.value)}
                                            className="bg-white rounded-xl focus:ring-violet-500 text-sm font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-bold text-slate-650">Interview Score (0-100)</Label>
                                        <Input 
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="e.g. 78"
                                            value={interviewScore}
                                            onChange={(e) => setInterviewScore(e.target.value)}
                                            className="bg-white rounded-xl focus:ring-violet-500 text-sm font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-200/50 mt-3">
                                    {hasScores ? (
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-slate-600">Average: <strong className="text-slate-800 font-black">{averageScore}%</strong></span>
                                            <Badge className={cn(
                                                "font-bold text-[10px] rounded-lg px-2 py-0.5 border shadow-none",
                                                averageScore >= 75 ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                                                averageScore >= 50 ? "bg-amber-50 text-amber-700 border-amber-100" :
                                                "bg-rose-50 text-rose-700 border-rose-100"
                                            )}>
                                                {averageScore >= 75 ? "Excellent Fit" : averageScore >= 50 ? "Pass Fit" : "Fail / Reassess"}
                                            </Badge>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] italic text-slate-400">No evaluation scores saved yet</span>
                                    )}

                                    <Button 
                                        size="sm"
                                        variant="outline"
                                        onClick={handleSaveScores}
                                        disabled={processingScores}
                                        className="h-8 rounded-lg text-xs bg-white text-violet-700 hover:bg-slate-50 font-bold border-violet-250 shadow-sm"
                                    >
                                        {processingScores ? <Loader2 className="animate-spin h-3 w-3 mr-1"/> : null}
                                        Save Scores
                                    </Button>
                                </div>
                            </div>

                            {/* Section 4: AI Placement recommendations */}
                            {(selectedApp.status === 'Pending Review' || selectedApp.status === 'Under Review') && (
                                <div className="relative overflow-hidden bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-fuchsia-500/10 p-5 rounded-2xl border border-violet-100/50 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-violet-700 flex items-center gap-1.5 uppercase tracking-wider">
                                            <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" /> Smart Placement Assistant
                                        </span>
                                        {!aiReasoning && (
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 text-xs bg-white text-violet-700 border-violet-200 hover:bg-violet-50 hover:text-violet-800 font-semibold rounded-lg shadow-sm" 
                                                onClick={handleAskAI} 
                                                disabled={aiThinking}
                                            >
                                                {aiThinking ? <Loader2 className="animate-spin w-3 h-3 mr-1" /> : 'Suggest Placement (-1 Credit)'}
                                            </Button>
                                        )}
                                    </div>
                                    {aiThinking && (
                                        <div className="flex items-center gap-2 py-2 text-violet-600 text-xs">
                                            <Loader2 className="animate-spin h-3.5 w-3.5" />
                                            <span>Analyzing age metrics and class capacities...</span>
                                        </div>
                                    )}
                                    {aiReasoning && (
                                        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                            <p className="text-xs text-violet-900 leading-relaxed italic bg-white/60 p-3.5 rounded-xl border border-violet-100/50">
                                                "{aiReasoning}"
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {decision === 'Approve' && (
                        <div className="space-y-5 py-4 overflow-y-auto flex-1 pr-1">
                            {/* Premium AI Recommendation Panel */}
                            <div className="relative overflow-hidden bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-fuchsia-500/10 p-5 rounded-2xl border border-violet-100/50">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-xs font-bold text-violet-700 flex items-center gap-1.5 uppercase tracking-wider">
                                        <Sparkles className="w-4 h-4 text-violet-600 animate-pulse" /> Smart Placement Assistant
                                    </span>
                                    {!aiReasoning && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-8 text-xs bg-white text-violet-700 border-violet-200 hover:bg-violet-50 hover:text-violet-800 font-semibold rounded-lg shadow-sm" 
                                            onClick={handleAskAI} 
                                            disabled={aiThinking}
                                        >
                                            {aiThinking ? <Loader2 className="animate-spin w-3 h-3 mr-1" /> : 'Suggest Placement (-1 Credit)'}
                                        </Button>
                                    )}
                                </div>
                                {aiThinking && (
                                    <div className="flex items-center gap-2 py-2 text-violet-600 text-xs">
                                        <Loader2 className="animate-spin h-3.5 w-3.5" />
                                        <span>Analyzing age metrics and class capacities...</span>
                                    </div>
                                )}
                                {aiReasoning && (
                                    <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                        <p className="text-xs text-violet-900 leading-relaxed italic bg-white/60 p-3.5 rounded-xl border border-violet-100/50">
                                            "{aiReasoning}"
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold text-sm">Assign to Class</Label>
                                <Select value={assignedClass} onValueChange={setAssignedClass}>
                                    <SelectTrigger className="border-slate-200 rounded-xl focus:ring-violet-500"><SelectValue placeholder="Select a class" /></SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {availableClasses.map(cls => (
                                            <SelectItem key={cls.id} value={cls.id} className="rounded-lg">
                                                {cls.name} <span className="text-slate-400 text-xs font-mono ml-2">({cls.currentStudents} / {cls.capacity} students)</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="text-xs font-black uppercase tracking-wider text-violet-655 flex items-center gap-1"><GraduationCap className="h-4 w-4"/> Student Portal Credentials</h4>
                                <p className="text-[11px] text-slate-500 leading-normal">
                                    Setup a student account so they can log in to the portal. Enter a custom email or leave the auto-generated one.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700">Student Portal Email</Label>
                                        <Input 
                                            type="email"
                                            value={studentEmail}
                                            onChange={(e) => setStudentEmail(e.target.value)}
                                            className="border-slate-200 rounded-xl focus:ring-violet-500 text-sm font-semibold"
                                            placeholder="student@school.com"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs font-semibold text-slate-700">Default Temporary Password</Label>
                                        <Input 
                                            type="text"
                                            value={studentPassword}
                                            onChange={(e) => setStudentPassword(e.target.value)}
                                            className="border-slate-200 rounded-xl focus:ring-violet-500 text-sm font-semibold"
                                            placeholder="password123"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {decision === 'Reject' && (
                        <div className="space-y-4 py-4 overflow-y-auto flex-1 pr-1">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold text-sm">Reason for Rejection</Label>
                                <Input 
                                    placeholder="e.g. Class capacity reached, Age criteria mismatch" 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="border-slate-200 rounded-xl focus:ring-rose-500"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 border-t pt-4">
                        {decision === null ? (
                            <>
                                <Button variant="ghost" onClick={() => setSelectedApp(null)} className="rounded-xl">
                                    Close
                                </Button>
                                {(selectedApp?.status === 'Pending Review' || selectedApp?.status === 'Under Review') && (
                                    <>
                                        {selectedApp?.status === 'Pending Review' && (
                                            <Button 
                                                variant="outline" 
                                                onClick={() => handleStartReview(selectedApp)} 
                                                disabled={processing}
                                                className="rounded-xl font-semibold border-amber-250 text-amber-700 hover:text-amber-800 hover:bg-amber-50"
                                            >
                                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Start Review
                                            </Button>
                                        )}
                                        <Button 
                                            onClick={() => setDecision('Reject')} 
                                            variant="outline" 
                                            className="rounded-xl border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold"
                                        >
                                            Reject
                                        </Button>
                                        <Button 
                                            onClick={() => setDecision('Approve')} 
                                            className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md px-5"
                                        >
                                            Approve Admission
                                        </Button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Button variant="ghost" onClick={() => setDecision(null)} disabled={processing} className="rounded-xl hover:bg-slate-100">
                                    Back to Profile
                                </Button>
                                <Button 
                                    onClick={handleProcessApplication} 
                                    disabled={processing}
                                    className={cn("rounded-xl font-semibold shadow-md px-5", decision === 'Approve' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white')}
                                >
                                    {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Confirm {decision}
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ParentDashboard({ schoolId }: { schoolId: string }) {
    const { user } = useUser();
    const firestore = useFirestore();
    const [myApps, setMyApps] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const { data: availableClasses } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));


    useEffect(() => {
        if (!user || !firestore || !schoolId) return;
        const q = query(collection(firestore, 'admissionApplications'), where('schoolId', '==', schoolId), where('submittedByParentId', '==', user.uid), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMyApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, firestore, schoolId]);

    if (showForm) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => setShowForm(false)} className="rounded-xl font-semibold hover:bg-slate-100">
                    ← Back to Portal
                </Button>
                <ParentApplicationForm onSuccess={() => setShowForm(false)} schoolId={schoolId} />
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Parent admissions Header */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 p-8 md:p-10 text-white shadow-xl shadow-fuchsia-100/50 dark:shadow-none">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                            <GraduationCap className="h-3.5 w-3.5 text-pink-200" /> Parent Portal
                        </span>
                        <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight">Admissions Portal</h1>
                        <p className="mt-2 text-white/80 max-w-xl text-sm leading-relaxed">
                            Apply for your child's enrollment, track the step-by-step progress of your application, and manage admissions details here.
                        </p>
                    </div>
                    <Button 
                        onClick={() => setShowForm(true)} 
                        className="bg-white text-violet-700 hover:bg-violet-50 hover:text-violet-800 font-bold px-6 py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all self-start md:self-center shrink-0 border border-violet-100"
                    >
                        <UserPlus className="mr-2 h-5 w-5 text-violet-600" /> New Application
                    </Button>
                </div>
                {/* Decorative glows */}
                <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"></div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-12 text-slate-500">
                    <Loader2 className="animate-spin h-8 w-8 text-violet-600 mb-3" />
                    <p className="text-sm font-semibold tracking-wider uppercase">Fetching your applications...</p>
                </div>
            ) : myApps.length === 0 ? (
                <div className="py-16 text-center text-slate-400 border-2 border-dashed rounded-3xl bg-slate-50 flex flex-col items-center justify-center gap-4">
                    <AlertCircle className="h-10 w-10 text-slate-300" />
                    <div>
                        <p className="font-semibold text-slate-700">No applications submitted yet</p>
                        <p className="text-xs text-slate-400 mt-1">Click "New Application" above to begin enrollment.</p>
                    </div>
                </div>
            ) : (
                <div className="grid gap-6">
                    {myApps.map(app => (
                        <Card key={app.id} className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                            <CardHeader className="pb-4 border-b bg-slate-50/50">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-800">{app.student.fullName}</CardTitle>
                                        <CardDescription className="text-xs font-mono mt-0.5 text-slate-500">Application ID: {app.applicationId}</CardDescription>
                                    </div>
                                    <Badge className={cn(
                                        "w-fit font-bold rounded-lg px-2.5 py-1 text-xs border shadow-none",
                                        app.status === 'Admitted' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-50' : 
                                        app.status === 'Rejected' ? 'bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-50' : 
                                        app.status === 'Under Review' ? 'bg-amber-50 text-amber-700 border border-amber-100 hover:bg-amber-50' :
                                        'bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-50'
                                    )}>
                                        {app.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            
                            <CardContent className="pt-6">
                                <ApplicationTracker status={app.status} />
                                
                                <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex justify-between sm:justify-start sm:gap-6 py-1.5 border-b border-slate-50 sm:border-none">
                                        <span className="text-slate-500 w-28">Desired Grade:</span>
                                        <span className="font-semibold text-slate-800 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-xs">{app.student.desiredGrade}</span>
                                    </div>
                                    <div className="flex justify-between sm:justify-start sm:gap-6 py-1.5 border-b border-slate-50 sm:border-none">
                                        <span className="text-slate-500 w-28">Submitted On:</span>
                                        <span className="text-slate-700 font-medium">{app.submittedAt?.toDate ? format(app.submittedAt.toDate(), 'PPP') : 'N/A'}</span>
                                    </div>

                                    {app.status === 'Admitted' && (
                                        <div className="md:col-span-2 mt-4 p-4 bg-emerald-50 border border-emerald-150 rounded-xl text-emerald-800 text-sm flex items-start gap-3">
                                            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                                            <div>
                                                <strong className="text-emerald-950 font-semibold">Admission Offer Received!</strong>
                                                <p className="mt-1 text-emerald-800/90 text-xs">
                                                    Your child has been assigned to class: <strong className="font-bold">{availableClasses?.find((c: any) => c.id === app.assignedClassId)?.name || app.assignedClassId}</strong>. Welcome to our school community!
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {app.status === 'Rejected' && (
                                        <div className="md:col-span-2 mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-800 text-sm flex items-start gap-3">
                                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                                            <div>
                                                <strong className="text-rose-950 font-semibold">Decision Details</strong>
                                                <p className="mt-1 text-rose-800/90 text-xs">
                                                    {app.rejectionReason || 'The school has not provided a specific reason.'}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function AdmissionsPage() {
    const { role } = useRole();
    const { schoolId } = useCurrentSchool();

    if (role === 'Administrator' || role === 'Director') {
        return <AdminApplicationDashboard />;
    }

    if (role === 'Parent' && schoolId) {
        return <ParentDashboard schoolId={schoolId} />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You do not have permission to view this page or your school data is not available.</CardDescription>
            </CardHeader>
        </Card>
    );
}