'use client';

import { useState } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useAuth } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where } from 'firebase/firestore';
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
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AdmissionApplication } from '@/lib/types';
import { format } from 'date-fns';
import { Loader2, ShieldCheck, ThumbsDown } from 'lucide-react';
import { setDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

function ApplicationReviewDialog({ application }: { application: AdmissionApplication }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAdmit = async () => {
    setIsProcessing(true);
    try {
      // 1. Update application status
      const appRef = doc(firestore, 'admissionApplications', application.id);
      await updateDocumentNonBlocking(appRef, { status: 'Admitted' });

      // 2. Create new student and parent accounts (simplified)
      // In a real app, this would involve createUserWithEmailAndPassword, etc.
      const studentId = application.student.email?.split('@')[0] || `student-${Math.random().toString(36).substring(2,9)}`;
      const studentRef = doc(firestore, 'students', studentId);
      await setDocumentNonBlocking(studentRef, {
        uid: studentId,
        firstName: application.student.fullName.split(' ')[0],
        lastName: application.student.fullName.split(' ').slice(1).join(' '),
        email: application.student.email,
        classId: application.student.desiredGrade.toLowerCase().replace(/\s+/g, '-'),
        ...application.student
      }, { merge: true });

      const parentId = application.parent1.email.split('@')[0] || `parent-${Math.random().toString(36).substring(2,9)}`;
      const parentRef = doc(firestore, 'parents', parentId);
      await setDocumentNonBlocking(parentRef, {
        uid: parentId,
        firstName: application.parent1.name.split(' ')[0],
        lastName: application.parent1.name.split(' ').slice(1).join(' '),
        email: application.parent1.email,
        studentIds: [studentId],
        ...application.parent1
      }, { merge: true });

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
    <DialogContent className="max-w-4xl">
      <DialogHeader>
        <DialogTitle>Reviewing Application: {application.student.fullName}</DialogTitle>
        <DialogDescription>Application ID: {application.applicationId}</DialogDescription>
      </DialogHeader>
      <div className="max-h-[70vh] overflow-y-auto p-4 space-y-6">
        {/* Render application details here */}
        <p><strong>Student:</strong> {application.student.fullName}</p>
        <p><strong>Grade Applied For:</strong> {application.student.desiredGrade}</p>
        <p><strong>Parent:</strong> {application.parent1.name} ({application.parent1.email})</p>
        <p><strong>Submitted At:</strong> {format(application.submittedAt.toDate(), 'PPP p')}</p>
        {/* ... full details */}
      </div>
      <div className="flex justify-end gap-2 pt-4 border-t">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isProcessing}>
              <ThumbsDown className="mr-2 h-4 w-4" />
              Reject Application
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reason for Rejection</AlertDialogTitle>
              <AlertDialogDescription>
                Please provide a clear reason for rejecting this application. This will be recorded internally.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid gap-4 py-4">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Input
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
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
      </div>
    </DialogContent>
  );
}

function ApplicationsTable({ status }: { status: AdmissionApplication['status'] }) {
  const firestore = useFirestore();
  const applicationsQuery = useMemoFirebase(
    () => query(collection(firestore, 'admissionApplications'), where('status', '==', status)),
    [firestore, status]
  );
  const { data: applications, isLoading } = useCollection<AdmissionApplication>(applicationsQuery);

  if (isLoading) {
    return <Loader2 className="mx-auto my-8 h-8 w-8 animate-spin" />;
  }

  return (
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
        {applications?.map((app) => (
          <TableRow key={app.id}>
            <TableCell>{app.student.fullName}</TableCell>
            <TableCell>{app.student.desiredGrade}</TableCell>
            <TableCell>{app.parent1.name}</TableCell>
            <TableCell>{format(app.submittedAt.toDate(), 'PPP')}</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Application</Button>
                </DialogTrigger>
                <ApplicationReviewDialog application={app} />
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
