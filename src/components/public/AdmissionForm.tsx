'use client';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

export function AdmissionForm({ schoolId, primaryColor }: { schoolId: string, primaryColor: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [submittedId, setSubmittedId] = useState<string | null>(null);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore) return;
        const formData = new FormData(e.currentTarget);
        // Hidden field that people never fill in; automated spam bots usually do.
        if (String(formData.get('website') || '').trim()) return;
        const phone = String(formData.get('phone') || '').replace(/[^\d+]/g, '');
        if (phone.replace(/\D/g, '').length < 9) {
            toast({ variant: 'destructive', title: 'Check the phone number', description: 'Please enter a full phone number so the school can reach you.' });
            return;
        }
        setLoading(true);
        
        try {
            const appId = `APP-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
            const dob = String(formData.get('dob') || '');
            await addDoc(collection(firestore, 'admissionApplications'), {
                schoolId,
                applicationId: appId,
                status: 'Pending Review',
                submittedAt: serverTimestamp(),
                student: {
                    fullName: String(formData.get('studentName') || '').trim(),
                    desiredGrade: String(formData.get('grade') || '').trim(),
                    gender: String(formData.get('gender') || ''),
                    address: '',
                    dateOfBirth: dob || null,
                    previousSchool: String(formData.get('previousSchool') || '').trim(),
                },
                source: 'website',
                parent1: {
                    name: String(formData.get('parentName') || '').trim(),
                    relationship: 'Parent/Guardian',
                    phone,
                    email: String(formData.get('email') || '').trim().toLowerCase(),
                    addressSameAsStudent: true,
                    address: '',
                },
                emergencyContact: {
                    name: formData.get('parentName') as string || '',
                    relationship: 'Parent/Guardian',
                    phone,
                }
            });
            setSubmittedId(appId);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            console.error("Admission Submit Error:", err);
            toast({ variant: 'destructive', title: "Error", description: "Failed to submit. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    if (submittedId) {
        return (
            <div className="space-y-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-left">
                <h3 className="text-2xl font-bold" style={{ color: primaryColor }}>Application received</h3>
                <p className="text-sm text-slate-600">Thank you. The school will review the application and contact you on the phone number you gave.</p>
                <div className="p-4 rounded-xl bg-slate-50 border">
                    <p className="text-xs text-slate-500">Your application number — please keep it:</p>
                    <p className="text-xl font-black font-mono text-slate-900 mt-1">{submittedId}</p>
                </div>
                <Button variant="outline" onClick={() => setSubmittedId(null)} className="w-full">Apply for another child</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-left">
            <h3 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Apply for Admission</h3>
            <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Parent Name *</Label>
                    <Input name="parentName" required placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input name="phone" required placeholder="Contact Number" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Email Address</Label>
                <Input name="email" type="email" placeholder="example@email.com" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Child's Full Name *</Label>
                    <Input name="studentName" required placeholder="Student Name" />
                </div>
                <div className="space-y-2">
                    <Label>Grade Applying For *</Label>
                    <Input name="grade" placeholder="e.g. Grade 1" required />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Child's Date of Birth</Label>
                    <Input name="dob" type="date" max={new Date().toISOString().slice(0, 10)} />
                </div>
                <div className="space-y-2">
                    <Label>Gender</Label>
                    <select name="gender" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                        <option value="">—</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Previous School</Label>
                    <Input name="previousSchool" placeholder="If any" />
                </div>
            </div>
            <p className="text-[11px] text-slate-500">Add an email address if you would like a parent login to follow your child's progress once admitted.</p>
            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 text-lg text-white font-bold" 
                style={{ backgroundColor: primaryColor }}
            >
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Send className="mr-2 h-4 w-4"/>} 
                Submit Application
            </Button>
        </form>
    );
}

export function AdmissionEnquiryForm({ schoolId, primaryColor }: { schoolId: string, primaryColor: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore) return;
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const enqId = `ENQ-${Date.now().toString().slice(-6)}`;
        
        try {
            await addDoc(collection(firestore, 'admissionEnquiries'), {
                schoolId,
                enquiryId: enqId,
                status: 'Pending Response',
                stage: 'Pending Response',
                createdAt: serverTimestamp(),
                parentName: formData.get('parentName') as string || '',
                parentPhone: formData.get('phone') as string || '',
                parentEmail: formData.get('email') as string || '',
                interest: formData.get('interest') as string || '',
                preferredContact: formData.get('preferredContact') as string || 'WhatsApp',
                message: formData.get('message') as string || '',
            });
            toast({ title: "Enquiry Submitted!", description: `The school admissions team will contact you shortly. Reference ID: ${enqId}` });
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            console.error("Enquiry Submit Error:", err);
            toast({ variant: 'destructive', title: "Error", description: "Failed to submit. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 text-left">
            <h3 className="text-2xl font-bold mb-2" style={{ color: primaryColor }}>Enquire Online</h3>
            <p className="text-sm text-slate-500 mb-4">To enquire about enrolling your child, please fill out the form below.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Your Name *</Label>
                    <Input name="parentName" required placeholder="Full Name" />
                </div>
                <div className="space-y-2">
                    <Label>Your Phone Number *</Label>
                    <Input name="phone" required placeholder="Contact Number" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label>Your Email *</Label>
                    <Input name="email" type="email" required placeholder="example@email.com" />
                </div>
                <div className="space-y-2">
                    <Label>Looking For a... *</Label>
                    <select 
                        name="interest" 
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-semibold"
                    >
                        <option value="Pre-School">Pre-School</option>
                        <option value="Primary School">Primary / Basic School</option>
                        <option value="JHS">Junior High School (JHS)</option>
                        <option value="SHS">Senior High School (SHS)</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <Label>Preferred Contact *</Label>
                    <select 
                        name="preferredContact" 
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-semibold"
                    >
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Phone Call">Phone Call</option>
                        <option value="Email">Email</option>
                    </select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Your Message / Question *</Label>
                <textarea 
                    name="message" 
                    required 
                    rows={4}
                    placeholder="Describe your inquiry..."
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-medium border-slate-200"
                />
            </div>
            <Button 
                type="submit" 
                disabled={loading} 
                className="w-full h-12 text-lg text-white font-bold" 
                style={{ backgroundColor: primaryColor }}
            >
                {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Send className="mr-2 h-4 w-4"/>} 
                Send Enquiry
            </Button>
        </form>
    );
}
