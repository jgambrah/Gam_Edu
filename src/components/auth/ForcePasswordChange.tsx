'use client';

import { useState } from 'react';
import { updatePassword, User } from 'firebase/auth';
import { doc, writeBatch } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldAlert, Lock } from 'lucide-react';
import { useRole } from '@/context/role-context';

interface ForcePasswordChangeProps {
  user: User;
  profile: any;
}

export default function ForcePasswordChange({ user, profile }: ForcePasswordChangeProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { role, refreshRole } = useRole();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore) return;

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Update Auth Password
      await updatePassword(user, newPassword);

      // 2. Update Firestore profile status
      const batch = writeBatch(firestore);
      
      // Determine collection name using the verified role from context
      let collectionName = 'staff';
      if (role === 'Student') collectionName = 'students';
      if (role === 'Parent') collectionName = 'parents';

      const userRef = doc(firestore, 'users', user.uid);
      const profileRef = doc(firestore, collectionName, user.uid);

      batch.update(userRef, { requirePasswordChange: false });
      batch.update(profileRef, { requirePasswordChange: false });

      await batch.commit();

      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully. Welcome to the portal!',
      });
      
      // Trigger a refresh of the role context to unmount this dialog
      refreshRole();
      
    } catch (err: any) {
      console.error('Password change failed:', err);
      
      if (err.code === 'auth/requires-recent-login') {
        setError('Security sensitive operation. Please log out and log in again, then try changing your password immediately.');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md bg-white border-4 border-indigo-600 rounded-[2rem] shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center">
          <div className="mx-auto bg-indigo-100 p-4 rounded-full w-fit mb-4">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-indigo-900">
            Secure Your Account
          </DialogTitle>
          <DialogDescription className="text-slate-600 font-medium">
            This is your first login. Please choose a new, secure password to continue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-12 border-2 focus:ring-indigo-500 rounded-xl text-black"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-12 border-2 focus:ring-indigo-500 rounded-xl text-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm flex items-start gap-2 animate-in slide-in-from-top-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl text-lg shadow-xl active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Update Password & Enter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
