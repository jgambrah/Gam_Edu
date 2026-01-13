
'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useCollection, useAuth } from '@/firebase';
import { collection, query, where, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, School, UserPlus, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRole } from '@/context/role-context';

export default function SchoolSetupWizard() {
  const { user } = useAuth();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const { role, loading: isLoadingRole } = useRole();
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [className, setClassName] = useState('');
  
  const isDirector = role === 'Director' || role === 'Administrator';

  // 1. Check if Setup is Needed
  useEffect(() => {
    // Don't run check until we know the user's role and school
    if (isLoadingSchool || isLoadingRole || !isDirector || !firestore || !schoolId) {
      return;
    }
    
    async function checkStatus() {
      // Check if they have any classes yet
      const q = query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
      const snap = await getDocs(q);
      
      if (snap.empty) {
        setIsOpen(true); // Open Wizard if no classes found
      }
    }
    checkStatus();
  }, [firestore, schoolId, isDirector, isLoadingSchool, isLoadingRole]);

  // 2. Handle Step 1: Create Class
  const handleCreateClass = async () => {
    if (!className || !schoolId) return;
    setLoading(true);
    try {
      await addDoc(collection(firestore, 'classes'), {
        name: className,
        schoolId: schoolId,
        createdAt: serverTimestamp()
      });
      setStep(2); // Move to next step
    } catch (e) {
      console.error(e);
      toast({ variant: 'destructive', title: "Error", description: "Failed to create class." });
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Finish
  const handleFinish = () => {
    setIsOpen(false);
    toast({ title: "Setup Complete!", description: "You can now add more data from the dashboard." });
    // Refresh to reload data and hide wizard
    window.location.reload();
  };

  // Only render for admins, and only if it's supposed to be open
  if (!isDirector || !isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2 text-blue-600">
            {step === 1 && <School />}
            {step === 2 && <CheckCircle2 />}
            Welcome to CampusConnect!
          </DialogTitle>
          <DialogDescription>
            Let's get your school set up in less than 30 seconds.
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: CREATE CLASS */}
        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Let's create your first Class / Grade</Label>
              <Input 
                placeholder="e.g. Grade 1 or Primary 4" 
                value={className}
                onChange={e => setClassName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">You can add more later.</p>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateClass} disabled={loading || !className} className="w-full">
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Create Class & Continue"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* STEP 2: SUCCESS & AI INTRO */}
        {step === 2 && (
          <div className="space-y-6 py-4 text-center">
            
            {/* Success Icon */}
            <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full animate-bounce">
                    <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-800">You are ready to go!</h3>
                <p className="text-slate-600">
                    You have successfully created your first class: <span className="font-bold text-blue-600">{className}</span>.
                </p>
            </div>

            {/* AI Assistant Tip */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-left flex gap-3">
                <div className="bg-purple-100 p-2 rounded-full h-fit">
                    {/* Robot Icon matching your chat bot */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-6 w-6 text-purple-600"
                    >
                        <rect width="18" height="18" x="3" y="3" rx="2" />
                        <path d="M9 3v18" />
                        <path d="m14 9 3 3-3 3" />
                        <path d="M9 12h5" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-bold text-purple-900 text-sm">Need Help? Ask our AI!</h4>
                    <p className="text-xs text-purple-700 mt-1">
                        Look for the <strong>Purple Robot Icon</strong> in the bottom-right corner. 
                        It can guide you through the app, answer questions, or help you generate content.
                    </p>
                </div>
            </div>

            <DialogFooter>
              <Button onClick={handleFinish} className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </DialogFooter>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
}
