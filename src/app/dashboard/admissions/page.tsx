
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useAuth, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
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
import { format, differenceInYears } from 'date-fns';
import { Loader2, ShieldCheck, ThumbsDown, FilePenLine, BrainCircuit, Sparkles, Check, X, UserPlus } from 'lucide-react';
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
import { serverTimestamp } from 'firebase/firestore';
import { ApplicationTracker } from '@/components/dashboard/admissions/application-tracker';


function ParentApplicationForm({ onSuccess }: { onSuccess: () => void }) {
    const { user } = useAuth();
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
            };
    
            await addDocumentNonBlocking(collection(firestore, 'admissionApplications'), applicationData);
    
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

function AdminApplicationDashboard() {
    const firestore = useFirestore();
    const { user } = useAuth();
    const { toast } = useToast();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    
    const [availableClasses, setAvailableClasses] = useState<{id: string, name: string, capacity: number, currentStudents: number}[]>([]);
    
    const [selectedApp, setSelectedApp] = useState<any>(null);
    const [decision, setDecision] = useState<'Approve' | 'Reject' | null>(null);
    const [assignedClass, setAssignedClass] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    const [aiThinking, setAiThinking] = useState(false);
    const [aiReasoning, setAiReasoning] = useState<string | null>(null);

    useEffect(() => {
        if (!firestore) return;
        const q = query(collection(firestore, 'admissionApplications'), where('status', '==', 'Pending Review'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setApplications(apps);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [firestore]);

    useEffect(() => {
        if (!firestore) return;
        const fetchClassesAndStudents = async () => {
            const classesQuery = await getDocs(collection(firestore, 'classes'));
            const studentsQuery = await getDocs(collection(firestore, 'students'));
            
            const studentsData = studentsQuery.docs.map(doc => doc.data() as Student);
            
            const classesData = classesQuery.docs.map(doc => {
                const currentStudents = studentsData.filter(s => s.classId === doc.id).length;
                return {
                    id: doc.id,
                    name: doc.data().name || doc.id,
                    capacity: doc.data().capacity || 30,
                    currentStudents: currentStudents
                };
            });
            setAvailableClasses(classesData as any);
        };
        fetchClassesAndStudents();
    }, [firestore]);

    const handleAskAI = async () => {
        if (!selectedApp || availableClasses.length === 0) return;
        setAiThinking(true);
        setAiReasoning(null);

        const dob = selectedApp.student.dateOfBirth ? new Date(selectedApp.student.dateOfBirth) : new Date();
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

    const handleProcessApplication = async () => {
        if (!selectedApp || !user) return;
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

                await updateDoc(appRef, {
                    status: 'Admitted',
                    assignedClassId: assignedClass,
                    reviewedBy: user.uid,
                    reviewedAt: timestamp
                });

                const studentData = {
                    uid: selectedApp.submittedByParentId,
                    fullName: selectedApp.student.fullName,
                    grade: selectedApp.student.desiredGrade,
                    classId: assignedClass,
                    parentId: selectedApp.submittedByParentId,
                    enrollmentDate: timestamp,
                    gender: selectedApp.student.gender,
                    address: selectedApp.student.address,
                };
                await addDoc(collection(firestore, 'students'), studentData);

                const classRef = doc(firestore, 'classes', assignedClass);
                const classSnap = await getDoc(classRef);
                if (classSnap.exists()) {
                     await updateDoc(classRef, { currentStudents: (classSnap.data().currentStudents || 0) + 1 });
                }

                await addDoc(collection(firestore, 'notifications'), {
                    userId: selectedApp.submittedByParentId,
                    title: 'Application Accepted! 🎉',
                    message: `Congratulations! ${selectedApp.student.fullName} has been accepted into ${selectedApp.student.desiredGrade}. Assigned Class: ${availableClasses.find(c => c.id === assignedClass)?.name || assignedClass}.`,
                    read: false,
                    createdAt: timestamp
                });

                toast({ title: "Approved", description: "Student enrolled and parent notified." });

            } else {
                await updateDoc(appRef, {
                    status: 'Rejected',
                    rejectionReason: rejectionReason || 'Does not meet criteria',
                    reviewedBy: user.uid,
                    reviewedAt: timestamp
                });

                await addDoc(collection(firestore, 'notifications'), {
                    userId: selectedApp.submittedByParentId,
                    title: 'Application Update',
                    message: `Regarding the application for ${selectedApp.student.fullName}: We regret to inform you that the application was not successful.`,
                    read: false,
                    createdAt: timestamp
                });

                toast({ variant: "default", title: "Rejected", description: "Application status updated." });
            }

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

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Incoming Applications</h2>
            
            {applications.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-gray-500">No pending applications found.</CardContent></Card>
            ) : (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <Card key={app.id} className="flex flex-row items-center justify-between p-4">
                            <div>
                                <h3 className="font-bold text-lg">{app.student.fullName}</h3>
                                <p className="text-sm text-gray-500">Desired: {app.student.desiredGrade} | ID: {app.applicationId}</p>
                                <p className="text-xs text-gray-400">Parent: {app.parent1.name}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                                    onClick={() => { setSelectedApp(app); setDecision('Approve'); }}>
                                    <Check className="mr-2 h-4 w-4" /> Approve
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                    onClick={() => { setSelectedApp(app); setDecision('Reject'); }}>
                                    <X className="mr-2 h-4 w-4" /> Reject
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* DECISION DIALOG */}
            <Dialog open={!!selectedApp} onOpenChange={(open) => { if(!open) { setSelectedApp(null); setAiReasoning(null); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{decision} Application</DialogTitle>
                        <DialogDescription>
                            Reviewing <strong>{selectedApp?.student?.fullName}</strong> (Grade: {selectedApp?.student?.desiredGrade})
                        </DialogDescription>
                    </DialogHeader>

                    {decision === 'Approve' && (
                        <div className="space-y-4 py-4">
                            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-bold text-indigo-700 flex items-center">
                                        <Sparkles className="w-3 h-3 mr-1" /> Smart Placement Assistant
                                    </span>
                                    {!aiReasoning && (
                                        <Button variant="ghost" size="sm" className="h-6 text-xs text-indigo-600" onClick={handleAskAI} disabled={aiThinking}>
                                            {aiThinking ? <Loader2 className="animate-spin w-3 h-3" /> : 'Suggest Placement'}
                                        </Button>
                                    )}
                                </div>
                                {aiReasoning && (
                                    <p className="text-xs text-indigo-800 italic animate-in fade-in">
                                        "{aiReasoning}"
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Assign to Class</label>
                                <Select value={assignedClass} onValueChange={setAssignedClass}>
                                    <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                                    <SelectContent>
                                        {availableClasses.map(cls => (
                                            <SelectItem key={cls.id} value={cls.id}>
                                                {cls.name} <span className="text-gray-400 text-xs">({cls.currentStudents}/{cls.capacity})</span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {decision === 'Reject' && (
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Reason for Rejection</label>
                                <Input 
                                    placeholder="e.g. Class full, Age requirement not met" 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="ghost" onClick={() => setSelectedApp(null)} disabled={processing}>Cancel</Button>
                        <Button 
                            onClick={handleProcessApplication} 
                            disabled={processing}
                            className={decision === 'Approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                        >
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirm {decision}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function ParentDashboard() {
     const { user } = useAuth();
    const firestore = useFirestore();
    const [myApps, setMyApps] = useState<any[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !firestore) return;
        const q = query(collection(firestore, 'admissionApplications'), where('submittedByParentId', '==', user.uid), orderBy('submittedAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMyApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user, firestore]);

    if (showForm) {
        return (
            <div className="space-y-4">
                <Button variant="ghost" onClick={() => setShowForm(false)}>← Back to Dashboard</Button>
                <ParentApplicationForm onSuccess={() => setShowForm(false)} />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Applications</h2>
                <Button onClick={() => setShowForm(true)}><UserPlus className="mr-2 h-4 w-4" /> New Application</Button>
            </div>
            
            {loading && <Loader2 className="animate-spin mx-auto"/>}

            {!loading && myApps.length === 0 ? (
                <Card><CardContent className="p-8 text-center text-gray-500">You haven't submitted any applications yet.</CardContent></Card>
            ) : (
                <div className="space-y-4">
                    {myApps.map(app => (
                        <Card key={app.id} className="overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{app.student.fullName}</CardTitle>
                                        <CardDescription>Applied for {app.student.desiredGrade} on {app.submittedAt?.toDate().toLocaleDateString()}</CardDescription>
                                    </div>
                                    <Badge variant={
                                        app.status === 'Admitted' ? 'default' : 
                                        app.status === 'Rejected' ? 'destructive' : 'secondary'
                                    } className={app.status === 'Admitted' ? 'bg-green-600' : ''}>
                                        {app.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <ApplicationTracker status={app.status} />
                                {app.status === 'Rejected' && (
                                    <Alert variant="destructive" className="mt-4">
                                        <AlertTitle>Decision Details</AlertTitle>
                                        <AlertDescription>{app.rejectionReason || 'The school has not provided a specific reason.'}</AlertDescription>
                                    </Alert>
                                )}
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

    if (role === 'Administrator' || role === 'Director') {
        return <AdminApplicationDashboard />;
    }

    if (role === 'Parent') {
        return <ParentDashboard />;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>You do not have permission to view this page.</CardDescription>
            </CardHeader>
        </Card>
    );
}
