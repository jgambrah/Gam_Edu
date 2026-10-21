'use client';
/**
 * Shown straight after the school creates an account (pupil, parent or staff).
 *
 * Schools were used to every new account having "password123". New accounts now get their own temporary
 * password (e.g. "tulip1018"), so this dialog makes sure the person creating the account sees it and
 * decides: give it NOW (copy / print a login slip) or LATER (where to find it again).
 * It cannot be closed by clicking outside — one of the two choices must be made.
 */
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AlertTriangle, Copy, Printer, Clock, CheckCircle2 } from 'lucide-react';
import { printLoginSlip, printLoginSlips } from '@/components/auth/LoginDetailsCard';

export type NewAccountCredentials = {
    name: string;
    email: string;
    password: string;
    /** Where to find the details again, e.g. "Student Directory". */
    whereLater?: string;
    schoolName?: string;
};

export function NewAccountPasswordDialog({ credentials, onClose }: { credentials: NewAccountCredentials | null; onClose: () => void }) {
    const { toast } = useToast();
    const [showLater, setShowLater] = useState(false);
    const c = credentials;

    const close = () => { setShowLater(false); onClose(); };
    const copy = () => {
        if (!c) return;
        try {
            navigator.clipboard.writeText(`Sign-in ID: ${c.email}\nTemporary password: ${c.password}\nWebsite: ${window.location.origin}`);
            toast({ title: 'Copied', description: 'Send it to the person privately.' });
        } catch { /* clipboard not available */ }
    };

    return (
        <Dialog open={!!c} onOpenChange={() => { /* must choose Now or Later */ }}>
            <DialogContent
                className="sm:max-w-md [&>button:last-child]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>Account created — get the password for {c?.name || 'this person'}</DialogTitle>
                    <DialogDescription>
                        Will you give {c?.name || 'them'} the login details now, or later?
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 flex gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div>
                        <strong>The password is NOT &quot;password123&quot;.</strong> Every new account now has its own
                        temporary password, shown below. Signing in with password123 will fail.
                    </div>
                </div>

                <div className="space-y-1.5 rounded-xl border bg-slate-50 p-4 font-mono text-sm">
                    <div><span className="text-slate-500">Sign-in ID:</span> {c?.email}</div>
                    <div><span className="text-slate-500">Temporary password:</span> <strong className="text-lg tracking-wide">{c?.password}</strong></div>
                    <div className="text-xs text-slate-500 font-sans pt-1">They will choose their own password the first time they sign in.</div>
                </div>

                {showLater ? (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 space-y-1">
                        <p className="font-semibold">To get this password later:</p>
                        <p>Open <strong>{c?.whereLater || 'the directory'}</strong>, find {c?.name || 'the person'}, click the <strong>key button</strong> (Reset Password) and look at <strong>&quot;Current login details&quot;</strong>. You can print the login slip there.</p>
                        <p className="text-xs text-blue-800">It stays available until they choose their own password. If they forget it after that, use the same key button to give them a new one.</p>
                        <div className="pt-2 flex justify-end">
                            <Button size="sm" onClick={close}>OK, I&apos;ll get it later</Button>
                        </div>
                    </div>
                ) : (
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setShowLater(true)}><Clock className="h-4 w-4 mr-1" /> Later</Button>
                        <Button variant="outline" onClick={copy}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
                        <Button variant="outline" onClick={() => c && printLoginSlip({ name: c.name, email: c.email, password: c.password, schoolName: c.schoolName })}>
                            <Printer className="h-4 w-4 mr-1" /> Print slip
                        </Button>
                        <Button onClick={close}><CheckCircle2 className="h-4 w-4 mr-1" /> Done — given now</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}

/**
 * Same choice after a bulk import (many accounts at once): print all login slips NOW, or LATER
 * (each person's details stay available from the key button in their directory).
 */
export function NewAccountsBatchDialog({ accounts, whereLater, schoolName, onClose }: {
    accounts: { name: string; email: string; password: string }[] | null;
    whereLater: string;
    schoolName?: string;
    onClose: () => void;
}) {
    const [showLater, setShowLater] = useState(false);
    const list = accounts || [];
    const close = () => { setShowLater(false); onClose(); };
    return (
        <Dialog open={list.length > 0} onOpenChange={() => { /* must choose Now or Later */ }}>
            <DialogContent
                className="sm:max-w-lg max-h-[85vh] overflow-y-auto [&>button:last-child]:hidden"
                onInteractOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader>
                    <DialogTitle>{list.length} account{list.length === 1 ? '' : 's'} created — get the passwords</DialogTitle>
                    <DialogDescription>Will you hand out the login details now, or later?</DialogDescription>
                </DialogHeader>
                <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 flex gap-2">
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                    <div><strong>The passwords are NOT &quot;password123&quot;.</strong> Each new account has its own temporary password.</div>
                </div>
                <div className="rounded-xl border bg-slate-50 p-2 font-mono text-xs max-h-56 overflow-y-auto divide-y">
                    {list.map((a, i) => (
                        <div key={i} className="py-1 flex flex-wrap justify-between gap-2"><span className="font-sans">{a.name}</span><span>{a.email} · <strong>{a.password}</strong></span></div>
                    ))}
                </div>
                {showLater ? (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 space-y-1">
                        <p>Each person&apos;s login details stay available in <strong>{whereLater}</strong>: find the person, click the <strong>key button</strong> and look at <strong>&quot;Current login details&quot;</strong> (with Print slip) — until they choose their own password.</p>
                        <div className="pt-2 flex justify-end"><Button size="sm" onClick={close}>OK, I&apos;ll get them later</Button></div>
                    </div>
                ) : (
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button variant="outline" onClick={() => setShowLater(true)}><Clock className="h-4 w-4 mr-1" /> Later</Button>
                        <Button variant="outline" onClick={() => printLoginSlips(list, schoolName)}><Printer className="h-4 w-4 mr-1" /> Print all slips</Button>
                        <Button onClick={close}><CheckCircle2 className="h-4 w-4 mr-1" /> Done</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    );
}
