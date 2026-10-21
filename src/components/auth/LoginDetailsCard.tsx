'use client';
/**
 * Shows the sign-in details the school can hand to a pupil, parent or staff member — any time until they
 * choose their own password — with Copy and Print (login slip). Used in the Reset Password dialogs.
 */
import { useEffect, useState } from 'react';
import { useAuth } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Loader2, Copy, Printer, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getPendingCredential, type PendingCredentialView } from '@/app/actions/credentials';

function escapeHtml(s: string) {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

export function printLoginSlip(args: { name: string; email: string; password: string; schoolName?: string }) {
    printLoginSlips([args], args.schoolName);
}

/** Prints one or many login slips (several per page, cut along the dashed lines). */
export function printLoginSlips(list: { name: string; email: string; password: string }[], schoolName?: string) {
    if (!list.length) return;
    const w = window.open('', '_blank', 'width=520,height=700');
    if (!w) return;
    const site = window.location.origin;
    const slips = list.map(a => `<div class="slip"><h2>${escapeHtml(schoolName || 'GAM Edu')} — Login details</h2>
<p>Name: <strong>${escapeHtml(a.name)}</strong></p>
<p>Website: <span class="v">${escapeHtml(site)}</span></p>
<p>Sign-in ID: <span class="v">${escapeHtml(a.email)}</span></p>
<p>Temporary password: <span class="v">${escapeHtml(a.password)}</span></p>
<p class="n">You will be asked to choose your own password the first time you sign in. Keep this slip private.
If you forget your password, the school office can give you a new one.</p></div>`).join('');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Login slips</title>
<style>body{font-family:Arial,sans-serif;padding:16px;color:#111}.slip{border:2px dashed #555;border-radius:12px;padding:16px;max-width:380px;margin:0 0 14px;page-break-inside:avoid}
h2{margin:0 0 4px;font-size:17px}p{margin:5px 0;font-size:14px}.v{font-family:monospace;font-size:16px;font-weight:bold}.n{color:#555;font-size:12px;margin-top:12px}</style></head>
<body>${slips}<script>window.onload=function(){window.print()}</script></body></html>`);
    w.document.close();
}

export function LoginDetailsCard({ uid, name, email, refreshKey, schoolName }: { uid?: string; name: string; email?: string; refreshKey?: number; schoolName?: string }) {
    const auth = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [cred, setCred] = useState<PendingCredentialView | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;
        (async () => {
            if (!uid) return;
            setLoading(true); setMessage(null); setCred(null);
            try {
                const token = await auth?.currentUser?.getIdToken();
                const res = await getPendingCredential(uid, token);
                if (!alive) return;
                if (!res.success) setMessage(res.error || 'Could not load login details.');
                else if (!res.credential) setMessage('This person has already chosen their own password (or their account is older than this feature). Use the reset below to give them a new temporary password.');
                else setCred(res.credential);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [uid, auth, refreshKey]);

    if (!uid) return null;
    return (
        <div className="rounded-xl border bg-slate-50 p-3 text-sm space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-700"><KeyRound className="h-4 w-4" /> Current login details</div>
            {loading ? (
                <div className="flex items-center gap-2 text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Checking…</div>
            ) : cred ? (
                <>
                    <div className="font-mono text-xs space-y-1">
                        <div><span className="text-slate-500">Sign-in ID:</span> {cred.email || email}</div>
                        <div><span className="text-slate-500">Temporary password:</span> <strong className="text-base">{cred.password}</strong></div>
                        {cred.setAt && <div className="text-slate-400">Set {new Date(cred.setAt).toLocaleString()} · not yet changed by the user</div>}
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => {
                            try { navigator.clipboard.writeText(`Sign-in ID: ${cred.email || email}\nTemporary password: ${cred.password}`); toast({ title: 'Copied' }); } catch { /* ignore */ }
                        }}><Copy className="h-3.5 w-3.5 mr-1" /> Copy</Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => printLoginSlip({ name, email: cred.email || email || '', password: cred.password, schoolName })}>
                            <Printer className="h-3.5 w-3.5 mr-1" /> Print slip
                        </Button>
                    </div>
                </>
            ) : (
                <p className="text-xs text-slate-500">{message}</p>
            )}
        </div>
    );
}
