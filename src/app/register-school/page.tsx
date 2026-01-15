
'use client';

import { useState } from 'react';
import { submitSchoolLead } from '@/app/actions/leads';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, School, GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function RegisterSchoolPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await submitSchoolLead(formData);

    if (result.success) {
      setSuccess(true);
    } else {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl mb-2">Request Received!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your interest. We have received your details and will contact you shortly to set up your school dashboard.
          </CardDescription>
          <div className="mt-8">
            <Link href="/">
              <Button variant="outline">Return Home</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-900 flex items-center justify-center gap-3">
            <GraduationCap className="h-10 w-10" /> GAM Edu
        </h1>
        <p className="text-slate-600 mt-2">The complete management solution for modern schools.</p>
      </div>

      <Card className="max-w-lg w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">Register Your School</CardTitle>
          <CardDescription>
            Fill out the form below to request a demo or a school account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name *</Label>
              <Input id="schoolName" name="schoolName" required placeholder="e.g. Galaxy International School" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="contactName">Contact Person *</Label>
                <Input id="contactName" name="contactName" required placeholder="Principal Name" />
                </div>
                <div className="space-y-2">
                <Label htmlFor="studentCount">Est. Students</Label>
                <Input id="studentCount" name="studentCount" type="number" placeholder="500" />
                </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Official Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="info@school.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" name="phone" type="tel" required placeholder="024 XXX XXXX" />
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 mt-4" disabled={loading}>
              {loading ? <Loader2 className="animate-spin mr-2" /> : null}
              Submit Request
            </Button>

          </form>
        </CardContent>
        <CardFooter className="justify-center border-t pt-6 bg-slate-50 rounded-b-lg">
          <p className="text-sm text-slate-500">
            Already have an account? <Link href="/" className="text-blue-600 hover:underline font-bold">Log in here</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
