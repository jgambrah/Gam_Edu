
'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useAuth, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, getDocs } from 'firebase/firestore';
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
import { AdmissionApplication, Class, Student } from '@/lib/types';
import { format, differenceInYears } from 'date-fns';
import { Loader2, ShieldCheck, ThumbsDown, FilePenLine, BrainCircuit } from 'lucide-react';
import { updateDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { recommendClassPlacementAction } from '@/ai/flows/admission-actions';
import { Alert, AlertTitle } from '@/components/ui/alert';

function ApplicationReviewDialog({ application, open, setOpen, classes, students }: { application: AdmissionApplication, open: boolean, setOpen: (open: boolean) => void, classes: Class[], students: Student[] }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [challengeNotes, setChallengeNotes] = useState(application.challengeNotes || '');
  const [assessmentScore, setAssessmentScore] = useState(application.assessmentTestScore || '');
  const [interviewNotes, setInterviewNotes] = useState(application.assessmentInterviewNotes || '');
  const [adminFeedback, setAdminFeedback] = useState(application.adminFeedback || '');
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState<{ recommendedClassId: string, reasoning: string } | null>(null);

  const handleAiPlacement = async () => {
    setIsAiLoading(true);
    setAiRecommendation(null);
    try {
        const studentAge = differenceInYears(new Date(), new Date(application.student.dateOfBirth));
        
        const classData = classes.map(c => {
            const currentStudents = students.filter(s => s.classId === c.id).length;
            return {
                id: c.id,
                name: c.name,
                capacity: c.capacity || 30, // Default capacity if not set
                currentStudents: currentStudents,
            };
        });

        const result = await recommendClassPlacementAction({
            name: application.student.fullName,
            age: studentAge,
            gender: application.student.gender,
            desiredGrade: application.student.desiredGrade,
        }, classData);

        if (result.success && result.data) {
            setAiRecommendation(result.data);
            toast({ title: "AI Recommendation", description: "Placement suggestion is ready." });
        } else {
            throw new Error(result.error);
        }
    } catch(e: any) {
        toast({ variant: 'destructive', title: "AI Error", description: e.message });
    } finally {
        setIsAiLoading(false);
    }
  };


  const handleUpdateAssessment = async () => {
    setIsProcessing(true);
    try {
      const appRef = doc(firestore, 'admissionApplications', application.id);
      await updateDocumentNonBlocking(appRef, {
        assessmentTestScore: Number(assessmentScore),
        assessmentInterviewNotes: interviewNotes,
        adminFeedback: adminFeedback,
      });
      toast({ title: 'Success', description: 'Internal assessment has been updated.' });
    } catch (error) {
      console.error('Error updating assessment:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not update assessment.' });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleChallenge = async () => {
    setIsProcessing(true);
    try {
      const appRef = doc(firestore, 'admissionApplications', application.id);
      await updateDocumentNonBlocking(appRef, { challengeNotes });
      toast({ title: 'Success', description: 'Challenge notes have been saved.' });
    } catch (error) {
      console.error('Error saving challenge notes:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save challenge notes.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAdmit = async () => {
    setIsProcessing(true);
    try {
      const appRef = doc(firestore, 'admissionApplications', application.id);
      
      const classId = aiRecommendation?.recommendedClassId || application.student.desiredGrade.toLowerCase().replace(/\s+/g, '-');
      
      await updateDocumentNonBlocking(appRef, { 
        status: 'Admitted',
        // Save the AI's reason if available
        adminFeedback: aiRecommendation ? `AI Recommendation: ${aiRecommendation.reasoning}. ${adminFeedback}` : adminFeedback,
      });

      const studentId = application.student.email?.split('@')[0] || `student-${Math.random().toString(36).substring(2,9)}`;
      const studentRef = doc(firestore, 'students', studentId);
      await setDocumentNonBlocking(studentRef, {
        uid: studentId,
        firstName: application.student.fullName.split(' ')[0],
        lastName: application.student.fullName.split(' ').slice(1).join(' '),
        email: application.student.email,
        classId: classId,
        dateOfBirth: application.student.dateOfBirth,
        gender: application.student.gender,
        address: application.student.address
      }, { merge: true });

      // Check if parent exists before creating
      const parentEmail = application.parent1.email;
      const parentQuery = query(collection(firestore, 'parents'), where('email', '==', parentEmail));
      const parentSnap = await getDocs(parentQuery);
      
      if (parentSnap.empty) {
          const parentId = parentEmail.split('@')[0] || `parent-${Math.random().toString(36).substring(2,9)}`;
          const parentRef = doc(firestore, 'parents', parentId);
          await setDocumentNonBlocking(parentRef, {
            uid: parentId,
            firstName: application.parent1.name.split(' ')[0],
            lastName: application.parent1.name.split(' ').slice(1).join(' '),
            email: application.parent1.email,
            phone: application.parent1.phone,
            address: application.parent1.address,
            studentIds: [studentId],
          }, { merge: true });
      } else {
          // If parent exists, add student to their list
          const parentDoc = parentSnap.docs[0];
          const existingIds = parentDoc.data().studentIds || [];
          if (!existingIds.includes(studentId)) {
              await updateDocumentNonBlocking(parentDoc.ref, { studentIds: [...existingIds, studentId] });
          }
      }


      toast({
        title: 'Application Admitted!',
        description: `${application.student.fullName} is now enrolled.`,
      });
    } catch (error) {
      console.error('Error admitting application:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not admit application.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast({ variant: 'destructive', title: 'Reason Required', description: 'Please provide a reason for rejection.' });
      return;
    }
    setIsProcessing(true);
    try {
      const appRef = doc(firestore, 'admissionApplications', application.id);
      await updateDocumentNonBlocking(appRef, {
        status: 'Rejected',
        rejectionReason: rejectionReason,
      });
      toast({
        title: 'Application Rejected',
        description: `Application for ${application.student.fullName} has been rejected.`,
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not reject application.' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
        <DialogHeader>
            <DialogTitle>Review Application: {application.student.fullName}</DialogTitle>
            <DialogDescription>Application ID: {application.applicationId} | Submitted: {format(application.submittedAt.toDate(), 'PPP p')}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
            {/* Student Details */}
            <div className="space-y-2">
                <h4 className="text-lg font-semibold">Student Information</h4>
                <p><strong>Grade Applied For:</strong> {application.student.desiredGrade}</p>
                <p><strong>Date of Birth:</strong> {format(new Date(application.student.dateOfBirth), 'PPP')}</p>
                <p><strong>Gender:</strong> {application.student.gender}</p>
                <p><strong>Address:</strong> {application.student.address}</p>
                {application.student.previousSchool && <p><strong>Previous School:</strong> {application.student.previousSchool}</p>}
            </div>
            <Separator />
            {/* Parent Details */}
            <div className="space-y-2">
                <h4 className="text-lg font-semibold">Parent / Guardian Information</h4>
                <p><strong>Name:</strong> {application.parent1.name} ({application.parent1.relationship})</p>
                <p><strong>Contact:</strong> {application.parent1.email} | {application.parent1.phone}</p>
            </div>
            <Separator />
            {/* Internal Assessment Section */}
            <div className="space-y-4 rounded-md bg-muted/50 p-4">
                <h4 className="text-lg font-semibold flex items-center gap-2"><FilePenLine /> Internal Assessment & Placement</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="assessment-score">Assessment Test Score</Label>
                        <Input id="assessment-score" type="number" value={assessmentScore} onChange={e => setAssessmentScore(e.target.value)} />
                    </div>
                     <div className="space-y-2 md:col-span-2">
                        <Label>Smart Placement Assistant</Label>
                        <Button variant="outline" onClick={handleAiPlacement} disabled={isAiLoading} className="w-full">
                           {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <BrainCircuit className="mr-2 h-4 w-4"/>} 
                            Ask AI for Placement Recommendation
                        </Button>
                     </div>
                </div>

                {aiRecommendation && (
                    <Alert className="bg-indigo-50 border-indigo-200">
                        <BrainCircuit className="h-4 w-4 text-indigo-600"/>
                        <AlertTitle className="font-bold text-indigo-800">AI Recommendation: Place in {classes.find(c => c.id === aiRecommendation.recommendedClassId)?.name || 'Unknown'}</AlertTitle>
                        <AlertDescription className="text-indigo-700">
                            Reason: {aiRecommendation.reasoning}
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="interview-notes">Assessment Interview Notes</Label>
                    <Textarea id="interview-notes" value={interviewNotes} onChange={e => setInterviewNotes(e.target.value)} rows={4} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="admin-feedback">General Admin Feedback</Label>
                    <Textarea id="admin-feedback" value={adminFeedback} onChange={e => setAdminFeedback(e.target.value)} rows={4} />
                </div>
                <Button onClick={handleUpdateAssessment} disabled={isProcessing}>Update Assessment</Button>
            </div>
            
            {application.status === 'Rejected' && (
                <div className="space-y-4 rounded-md bg-yellow-100 dark:bg-yellow-900/50 p-4">
                    <h4 className="text-lg font-semibold">Rejection Details</h4>
                    <p><strong>Rejection Reason:</strong> {application.rejectionReason}</p>
                    <div className="space-y-2">
                        <Label htmlFor="challenge-notes">Challenge/Follow-up Notes</Label>
                        <Textarea id="challenge-notes" value={challengeNotes} onChange={e => setChallengeNotes(e.target.value)} />
                        <Button onClick={handleChallenge} disabled={isProcessing}>Save Challenge Notes</Button>
                    </div>
                </div>
            )}

        </div>
        <DialogFooter>
            {application.status === 'Pending Review' && (
                <>
                    <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={isProcessing}>
                        <ThumbsDown className="mr-2 h-4 w-4" /> Reject Application
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Reason for Rejection</AlertDialogTitle>
                        <AlertDialogDescription>Please provide a clear reason for rejecting this application. This will be recorded internally.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="grid gap-4 py-4">
                        <Label htmlFor="rejection-reason">Rejection Reason</Label>
                        <Input id="rejection-reason" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
                        </div>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleReject}>Confirm Rejection</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={handleAdmit} disabled={isProcessing}>
                    {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                    Admit Student
                    </Button>
                </>
            )}
        </DialogFooter>
        </DialogContent>
    </Dialog>
  );
}

function ApplicationsTable({ status }: { status: AdmissionApplication['status'] }) {
  const firestore = useFirestore();
  const applicationsQuery = useMemoFirebase(
    () => query(collection(firestore, 'admissionApplications'), where('status', '==', status)),
    [firestore, status]
  );
  const { data: applications, isLoading } = useCollection<AdmissionApplication>(applicationsQuery);
  const { data: classes } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));
  const { data: students } = useCollection<Student>(useMemoFirebase(() => collection(firestore, 'students'), [firestore]));
  
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);

  if (isLoading) {
    return <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin" />;
  }
  
  if (!applications || applications.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No {status.toLowerCase()} applications found.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Name</TableHead>
            <TableHead>Grade Applied</TableHead>
            <TableHead>Parent Name</TableHead>
            <TableHead>Application Date</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>{app.student.fullName}</TableCell>
              <TableCell>{app.student.desiredGrade}</TableCell>
              <TableCell>{app.parent1.name}</TableCell>
              <TableCell>{format(app.submittedAt.toDate(), 'PPP')}</TableCell>
              <TableCell>
                  <Button variant="outline" onClick={() => setSelectedApplication(app)}>Open Application</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {selectedApplication && (
        <ApplicationReviewDialog 
            application={selectedApplication} 
            open={!!selectedApplication} 
            setOpen={() => setSelectedApplication(null)}
            classes={classes || []}
            students={students || []}
        />
      )}
    </>
  );
}

export default function AdmissionsPage() {
  const { role } = useRole();

  if (!['Administrator', 'Director'].includes(role)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>This page is only accessible to Administrators and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Admissions</CardTitle>
        <CardDescription>Review and process new student admission applications.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending Review</TabsTrigger>
            <TabsTrigger value="admitted">Admitted</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="pending">
            <ApplicationsTable status="Pending Review" />
          </TabsContent>
          <TabsContent value="admitted">
            <ApplicationsTable status="Admitted" />
          </TabsContent>
          <TabsContent value="rejected">
            <ApplicationsTable status="Rejected" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
