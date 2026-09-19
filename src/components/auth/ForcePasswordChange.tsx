'use client';

import { useState } from 'react';
import { updatePassword, User, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
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
import { Loader2, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react';
import { useRole } from '@/context/role-context';

interface ForcePasswordChangeProps {
  user: User;
  profile: any;
}

export default function ForcePasswordChange({ user, profile }: ForcePasswordChangeProps) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { role, refreshRole } = useRole();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      let clientUpdated = false;

      // 1. Re-authenticate client if current password is provided
      if (currentPassword && user.email) {
        try {
          const cred = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, cred);
          await updatePassword(user, newPassword);
          clientUpdated = true;
        } catch (reauthErr: any) {
          console.warn('Client re-auth attempt failed, falling back to server Admin API:', reauthErr?.message);
        }
      } else {
        try {
          await updatePassword(user, newPassword);
          clientUpdated = true;
        } catch (updateErr: any) {
          console.warn('Direct updatePassword note (will use server fallback):', updateErr?.message);
        }
      }

      // 2. If client update threw auth/requires-recent-login or was skipped, execute via Admin SDK endpoint
      if (!clientUpdated) {
        let idToken = '';
        try {
          idToken = await user.getIdToken(true);
        } catch (_) {}

        const res = await fetch('/api/auth/force-change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user.uid,
            newPassword,
            idToken,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update password via server.');
        }
      }

      // 3. Clear requirePasswordChange on client firestore records
      if (firestore) {
        try {
          const userRef = doc(firestore, 'users', user.uid);
          await setDoc(userRef, { requirePasswordChange: false }, { merge: true });

          const collectionName = role === 'Student' || user.email?.includes('-student.') 
            ? 'students' 
            : role === 'Parent' || user.email?.includes('-parent.') 
            ? 'parents' 
            : 'staff';
          const profileRef = doc(firestore, collectionName, user.uid);
          await setDoc(profileRef, { requirePasswordChange: false }, { merge: true });
        } catch (dbErr) {
          console.warn('Local Firestore status update note:', dbErr);
        }
      }

      toast({
        title: 'Password Updated',
        description: 'Your password has been changed successfully. Welcome to your portal!',
      });
      
      // Trigger a refresh of the role context to unmount this dialog
      refreshRole();
      
    } catch (err: any) {
      console.error('Password change failed:', err);
      setError(err.message || 'An error occurred. Please try again.');
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

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="current-password" className="text-xs font-bold text-slate-700">
                Current Password <span className="text-slate-400 font-normal">(the password used to sign in)</span>
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="h-11 border-2 focus:ring-indigo-500 rounded-xl text-black"
                placeholder="Enter current password (optional)"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-password" className="text-xs font-bold text-slate-700">New Password</Label>
              <Input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-11 border-2 focus:ring-indigo-500 rounded-xl text-black"
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-xs font-bold text-slate-700">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-11 border-2 focus:ring-indigo-500 rounded-xl text-black"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-start gap-2 animate-in slide-in-from-top-2">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-base shadow-xl active:scale-95 transition-all"
          >
            {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Update Password & Enter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
