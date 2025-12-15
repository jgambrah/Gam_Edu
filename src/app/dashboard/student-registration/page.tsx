
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useAuth, useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { studentRegistrationSchema, StudentRegistrationData } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useRole } from '@/context/role-context';

function StudentRegistrationForm() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<StudentRegistrationData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      student: {
        fullName: '',
        gender: '',
        address: '',
        desiredGrade: '',
      },
      parent1: {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        address: '',
        addressSameAsStudent: false,
      },
      addParent2: false,
      emergencyContact: {
        name: '',
        relationship: '',
        phone: '',
      },
      addMedicalInfo: false,
    },
  });

  const watchAddParent2 = form.watch('addParent2');
  const watchAddMedical = form.watch('addMedicalInfo');
  const watchParent1AddressSame = form.watch('parent1.addressSameAsStudent');
  const watchParent2AddressSame = form.watch('parent2.addressSameAsStudent');

  async function onSubmit(values: StudentRegistrationData) {
    if (!user) return;
    setIsSubmitting(true);
    try {
        const appId = `APP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const applicationData = {
            ...values,
            applicationId: appId,
            status: 'Pending Review',
            submittedByParentId: user.uid,
            submittedAt: serverTimestamp(),
        };

        const newDocRef = doc(collection(firestore, 'admissionApplications'));
        await addDocumentNonBlocking(collection(firestore, 'admissionApplications'), applicationData);

      toast({
        title: 'Application Submitted!',
        description: `Your application ID is ${appId}. We will review it shortly.`,
      });
      form.reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while submitting your application.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Student Admission Application</CardTitle>
        <CardDescription>
          Please fill out the form below with as much detail as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Student Information */}
            <section className="space-y-4">
              <h3 className="text-xl font-semibold">Student Information</h3>
              <FormField control={form.control} name="student.fullName" render={({ field }) => (
                  <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="student.dateOfBirth" render={({ field }) => (
                  <FormItem className="flex flex-col"><FormLabel>Date of Birth</FormLabel><Popover><PopoverTrigger asChild><FormControl>
                    <Button variant={'outline'} className={cn('pl-3 text-left font-normal',!field.value && 'text-muted-foreground')}>
                      {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent></Popover><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="student.gender" render={({ field }) => (
                    <FormItem><FormLabel>Gender</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Other">Other</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )}/>
              </div>
              <FormField control={form.control} name="student.address" render={({ field }) => (
                  <FormItem><FormLabel>Full Residential Address</FormLabel><FormControl><Input placeholder="123 Main St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
              )}/>
               <div className="grid grid-cols-2 gap-4">
                 <FormField control={form.control} name="student.previousSchool" render={({ field }) => (
                    <FormItem><FormLabel>Previous School (Optional)</FormLabel><FormControl><Input placeholder="Old School Name" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
                <FormField control={form.control} name="student.desiredGrade" render={({ field }) => (
                    <FormItem><FormLabel>Desired Grade Level</FormLabel><Select onValueChange={field.onChange}><FormControl><SelectTrigger><SelectValue placeholder="Select grade..." /></SelectTrigger></FormControl>
                    <SelectContent>
                        {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'JHS 1', 'JHS 2', 'JHS 3'].map(grade => (
                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                        ))}
                    </SelectContent>
                    </Select><FormMessage /></FormItem>
                )}/>
               </div>
            </section>
            
            <Separator />

            {/* Parent/Guardian 1 Information */}
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
              {!watchParent1AddressSame && (
                <FormField control={form.control} name="parent1.address" render={({ field }) => (
                    <FormItem><FormLabel>Full Residential Address</FormLabel><FormControl><Input placeholder="123 Parent St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
              )}
            </section>
            
            <FormField control={form.control} name="addParent2" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl><div className="space-y-1 leading-none"><FormLabel>Add a second Parent/Guardian</FormLabel></div></FormItem>
            )}/>
            
            {/* Parent/Guardian 2 Information */}
            {watchAddParent2 && (
                <section className="space-y-4 p-4 border-l-4 border-accent bg-accent/10 rounded-r-md">
                    <h3 className="text-xl font-semibold">Parent / Guardian 2 Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="parent2.name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Smith" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="parent2.relationship" render={({ field }) => (
                        <FormItem><FormLabel>Relationship to Student</FormLabel><FormControl><Input placeholder="e.g., Mother, Father" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="parent2.phone" render={({ field }) => (
                        <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="parent2.email" render={({ field }) => (
                        <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="john.smith@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    </div>
                    <FormField control={form.control} name="parent2.addressSameAsStudent" render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 bg-background">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <div className="space-y-1 leading-none"><FormLabel>Address is the same as student's</FormLabel></div>
                    </FormItem>
                    )}/>
                    {!watchParent2AddressSame && (
                    <FormField control={form.control} name="parent2.address" render={({ field }) => (
                        <FormItem><FormLabel>Full Residential Address</FormLabel><FormControl><Input placeholder="456 Other St, Anytown, USA" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    )}
              </section>
            )}

            <Separator />
            
            {/* Emergency Contact */}
            <section className="space-y-4">
                <h3 className="text-xl font-semibold">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                    <FormField control={form.control} name="emergencyContact.name" render={({ field }) => (
                        <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Mary Smith" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="emergencyContact.relationship" render={({ field }) => (
                        <FormItem><FormLabel>Relationship to Student</FormLabel><FormControl><Input placeholder="e.g., Aunt, Grandparent" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                </div>
                <FormField control={form.control} name="emergencyContact.phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="(123) 555-1234" {...field} /></FormControl><FormMessage /></FormItem>
                )}/>
            </section>

             <Separator />

             <FormField control={form.control} name="addMedicalInfo" render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl><div className="space-y-1 leading-none"><FormLabel>Add Medical Information (Optional)</FormLabel></div></FormItem>
            )}/>
            
            {/* Medical Information */}
            {watchAddMedical && (
                <section className="space-y-4 p-4 border-l-4 border-accent bg-accent/10 rounded-r-md">
                     <h3 className="text-xl font-semibold">Medical Information</h3>
                     <FormField control={form.control} name="medical.allergies" render={({ field }) => (
                        <FormItem><FormLabel>Allergies</FormLabel><FormControl><Input placeholder="e.g., Peanuts, Pollen" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="medical.conditions" render={({ field }) => (
                        <FormItem><FormLabel>Ongoing Medical Conditions</FormLabel><FormControl><Input placeholder="e.g., Asthma" {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="medical.physicianName" render={({ field }) => (
                            <FormItem><FormLabel>Primary Physician Name</FormLabel><FormControl><Input placeholder="Dr. Jones" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="medical.physicianPhone" render={({ field }) => (
                            <FormItem><FormLabel>Physician's Phone Number</FormLabel><FormControl><Input placeholder="(123) 555-5678" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                </section>
            )}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function StudentRegistrationPage() {
    const { role } = useRole();

    if (role !== 'Parent') {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This form is only available for users with the 'Parent' role.</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return <StudentRegistrationForm />;
}

    