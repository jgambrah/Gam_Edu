
'use client';
import { useState } from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

/**
 * Public Admission Enquiry Form.
 * This form is accessible by anyone on the school's public microsite.
 * It submits data directly to the school's admissionApplications collection.
 */
export function AdmissionForm({ schoolId, primaryColor }: { schoolId: string, primaryColor: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!firestore || !schoolId) return;
        
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        try {
            // Generate a human-readable application ID
            const appId = `APP-${Date.now().toString().slice(-6)}`;

            await addDoc(collection(firestore, 'admissionApplications'), {
                schoolId,
                applicationId: appId,
                // Form Fields
                student: {
                    fullName: formData.get('studentName'),
                    desiredGrade: formData.get('grade'),
                },
                parent1: {
                    name: formData.get('parentName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                },
                // Metadata
                status: 'Pending Review', // Matches the internal dashboard filter
                submittedAt: serverTimestamp(),
                source: 'Public Website'
            });

            toast({ 
                title: "Application Submitted!", 
                description: `Thank you. Your application ID is ${appId}. We will contact you shortly.` 
            });
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            console.error("Admission Submit Error:", err);
            toast({ 
                variant: 'destructive', 
                title: "Submission Error", 
                description: "We couldn't process your application right now. Please try again or contact the school directly." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="enrol-form" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded-[2.5rem] shadow-2xl border-4 border-slate-100 text-left">
                <div className="mb-6">
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter" style={{ color: primaryColor }}>Apply for Admission</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Start your child's journey with us.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Parent Full Name *</Label>
                        <Input name="parentName" required placeholder="e.g. Jane Doe" className="h-12 rounded-xl border-2" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone Number *</Label>
                        <Input name="phone" required placeholder="e.g. 024 XXX XXXX" className="h-12 rounded-xl border-2" />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email Address</Label>
                    <Input name="email" type="email" placeholder="jane@example.com" className="h-12 rounded-xl border-2" />
                </div>

                <Separator className="my-4 opacity-50" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Child's Full Name *</Label>
                        <Input name="studentName" required placeholder="e.g. John Doe" className="h-12 rounded-xl border-2" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 ml-1">Grade Applying For *</Label>
                        <Input name="grade" placeholder="e.g. Grade 1 or JHS 1" required className="h-12 rounded-xl border-2" />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full h-16 text-xl font-black uppercase tracking-tighter rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95 text-white" 
                    style={{ backgroundColor: primaryColor }}
                >
                    {loading ? <Loader2 className="animate-spin mr-2 h-6 w-6"/> : <Send className="mr-2 h-6 w-6"/>} 
                    Submit Application
                </Button>
                
                <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
                    Your data is secure and will be reviewed by the school administration.
                </p>
            </form>
        </div>
    );
}

function Separator({ className }: { className?: string }) {
    return <div className={cn("h-px w-full bg-slate-200", className)} />;
}
