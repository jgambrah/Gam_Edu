'use client';

import { Suspense, useState, useMemo } from 'react';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, orderBy, Timestamp, addDoc, serverTimestamp } from 'firebase/firestore';
import { Student, AttendanceRecord, BehavioralRecord } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, User, CalendarCheck, ShieldAlert, BadgeInfo, CheckCircle2, Users, Calendar as CalendarIcon, Home, ClipboardCopy, Plus, AlertOctagon, HelpCircle, Wallet, Coins, Milestone } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useRole } from '@/context/role-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { format, startOfDay, endOfDay } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StudentDisplay } from '@/components/student-display';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PaystackButton } from 'react-paystack';

const toDateSafe = (d: any): Date => {
  if (!d) return new Date();
  if (typeof d.toDate === 'function') return d.toDate();
  if (d instanceof Date) return d;
  if (d.seconds) return new Date(d.seconds * 1000);
  return new Date(d);
};
import { useCurrentSchool } from '@/hooks/use-current-school';
import { StudentJourneyTimeline } from '@/components/StudentJourneyTimeline';

function AttendanceHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { role, profile, loading: isRoleLoading } = useRole();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfDay(new Date(new Date().setDate(new Date().getDate() - 30))),
        to: endOfDay(new Date()),
    });

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const isTargetStudent = user?.uid === studentId;
    const isParent = role === 'Parent';
    
    const parentStudentIds = useMemo(() => {
        return (
            profile?.studentIds || 
            profile?.student_ids || 
            profile?.students || 
            profile?.linkedStudentIds ||
            []
        );
    }, [profile]);

    const hasPermission = isStaff || isTargetStudent || (isParent && parentStudentIds.includes(studentId));

    const attendanceQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !studentId || !hasPermission || isRoleLoading) return null;
        
        // Remove complex filters from the DB query to avoid index errors for now
        return query(
            collection(firestore, 'attendance'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId)
        );
    }, [firestore, schoolId, studentId, hasPermission, isRoleLoading]);
    
    const { data: rawRecords, isLoading } = useCollection<AttendanceRecord>(attendanceQuery);

    const filteredAndSortedRecords = useMemo(() => {
        if (!rawRecords) return [];
        
        let filtered = [...rawRecords];
        
        if (dateRange?.from) {
            const start = startOfDay(dateRange.from).getTime();
            const end = dateRange.to ? endOfDay(dateRange.to).getTime() : endOfDay(dateRange.from).getTime();
            
            filtered = filtered.filter(r => {
                const d = r.date?.toDate ? r.date.toDate().getTime() : 0;
                return d >= start && d <= end;
            });
        }

        return filtered.sort((a,b) => {
            const da = a.date?.toDate ? a.date.toDate().getTime() : 0;
            const db = b.date?.toDate ? b.date.toDate().getTime() : 0;
            return db - da;
        });
    }, [rawRecords, dateRange]);

    const getStatusVariant = (status: AttendanceRecord['status']) => {
        switch (status) {
            case 'Present': return 'default';
            case 'Late': return 'secondary';
            case 'Absent': return 'destructive';
            default: return 'outline';
        }
    };
    
    if (!hasPermission && !isRoleLoading) return null;

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                 <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn("w-full sm:w-[300px] justify-start text-left font-normal border-2", !dateRange && "text-muted-foreground")}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (dateRange.to ? (<>{format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}</>) : (format(dateRange.from, "LLL dd, y"))) : (<span>Filter by Date</span>)}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar initialFocus mode="range" defaultMonth={dateRange?.from} selected={dateRange} onSelect={setDateRange} numberOfMonths={2} />
                    </PopoverContent>
                </Popover>
            </div>
            {isLoading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div> : (
                <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead>Notes</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSortedRecords.map(rec => (
                                <TableRow key={rec.id}>
                                    <TableCell className="font-medium">{rec.date?.toDate ? format(rec.date.toDate(), 'PPP') : 'N/A'}</TableCell>
                                    <TableCell><Badge variant={getStatusVariant(rec.status)}>{rec.status}</Badge></TableCell>
                                    <TableCell className="text-slate-500 text-xs italic">{rec.notes || '-'}</TableCell>
                                </TableRow>
                            ))}
                            {filteredAndSortedRecords.length === 0 && (
                                <TableRow><TableCell colSpan={3} className="text-center py-12 text-muted-foreground italic">No attendance records found for this period.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}

function BehavioralHistory({ studentId }: { studentId: string }) {
    const firestore = useFirestore();
    const { role, profile, loading: isRoleLoading } = useRole();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();

    const isStaff = ['Teacher', 'Administrator', 'Director'].includes(role || '');
    const isTargetStudent = user?.uid === studentId;
    const isParent = role === 'Parent';

    const parentStudentIds = useMemo(() => {
        return (
            profile?.studentIds || 
            profile?.student_ids || 
            profile?.students || 
            profile?.linkedStudentIds ||
            []
        );
    }, [profile]);

    const hasPermission = isStaff || isTargetStudent || (isParent && parentStudentIds.includes(studentId));

    const recordsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !studentId || !hasPermission || isRoleLoading) return null;
        return query(
            collection(firestore, 'behavioral_records'), 
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId), 
            orderBy('date', 'desc')
        );
    }, [firestore, schoolId, studentId, hasPermission, isRoleLoading]);
    const { data: records, isLoading } = useCollection<BehavioralRecord>(recordsQuery);

    const getIcon = (type: BehavioralRecord['incidentType']) => {
        switch(type) {
            case 'Positive Behavior': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'Infraction':
            case 'Disciplinary Action': return <ShieldAlert className="h-4 w-4 text-red-500" />;
            default: return <BadgeInfo className="h-4 w-4 text-slate-500"/>
        }
    };
    
    if (!hasPermission && !isRoleLoading) return null;

    return (
        <div className="space-y-4">
             {isLoading ? <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div> : (
                <div className="space-y-3">
                    {records?.map(rec => (
                        <Card key={rec.id} className="border shadow-sm bg-white overflow-hidden">
                            <CardHeader className="bg-slate-50 py-3 flex flex-row justify-between items-center">
                                <div className="flex items-center gap-2">
                                    {getIcon(rec.incidentType)}
                                    <span className="font-bold text-slate-800 text-sm">{rec.incidentType}</span>
                                </div>
                                <span className="text-[10px] uppercase font-bold text-slate-400">
                                    {rec.date ? format(toDateSafe(rec.date), 'PPP') : 'N/A'}
                                </span>
                            </CardHeader>
                            <CardContent className="pt-4">
                                <p className="text-sm text-slate-700 leading-relaxed">{rec.description}</p>
                                {rec.actionTaken && (
                                    <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
                                        <BadgeInfo className="h-4 w-4 shrink-0 mt-0.5 text-blue-500"/>
                                        <p><strong>Action Taken:</strong> {rec.actionTaken}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                    {(!records || records.length === 0) && (
                        <div className="text-center py-16 text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed">
                            <p className="italic">No behavioral records logged for this child.</p>
                        </div>
                    )}
                </div>
             )}
        </div>
    );
}

function BoardingServiceTab({ student }: { student: Student }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { profile } = useRole();
    const [applyOpen, setApplyOpen] = useState(false);
    const [requestDetails, setRequestDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const studentId = student.id || student.uid;

    // 1. Query child's active allocation
    const allocQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !studentId) return null;
        return query(
            collection(firestore, 'hostel_allocations'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId),
            where('status', '==', 'Active')
        );
    }, [firestore, schoolId, studentId]);
    const { data: allocations, isLoading: loadingAlloc } = useCollection<any>(allocQuery);

    // 2. Query child's applications
    const appsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !studentId) return null;
        return query(
            collection(firestore, 'boarding_applications'),
            where('schoolId', '==', schoolId),
            where('studentId', '==', studentId)
        );
    }, [firestore, schoolId, studentId]);
    const { data: applications, isLoading: loadingApps } = useCollection<any>(appsQuery);

    const handleSubmitApplication = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !schoolId || !studentId || isSubmitting) return;
        setIsSubmitting(true);

        try {
            const parentName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || user?.email || 'Parent');
            await addDoc(collection(firestore, 'boarding_applications'), {
                schoolId,
                studentId,
                studentName: `${student.firstName} ${student.lastName}`.trim(),
                parentId: user?.uid || 'UnknownParent',
                parentName,
                status: 'Pending',
                requestDetails,
                createdAt: new Date(),
                reviewedById: null,
                reviewedByName: null,
                reviewedAt: null,
            });

            setRequestDetails('');
            setApplyOpen(false);
        } catch (error) {
            console.error('Error submitting application:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingAlloc || loadingApps) {
        return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    const currentPlacement = allocations?.[0];
    const pendingApp = applications?.find(a => a.status === 'Pending');

    return (
        <div className="space-y-6">
            {currentPlacement ? (
                <Card className="border-2 border-emerald-100 bg-emerald-50/20 rounded-2xl overflow-hidden shadow-sm">
                    <CardHeader className="bg-emerald-50/50 p-4 border-b border-emerald-100 flex flex-row items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><Home size={20}/></div>
                        <div>
                            <CardTitle className="text-sm font-black uppercase text-emerald-950">Active Boarding Placement</CardTitle>
                            <CardDescription className="text-xs text-emerald-700 font-medium">Child is currently checked into hostels</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 grid grid-cols-2 gap-4 text-xs font-semibold text-slate-800">
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Hostel Block</span>
                            <span className="text-slate-800 text-[13px]">{currentPlacement.blockName}</span>
                        </div>
                        <div>
                            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Room & Bed</span>
                            <span className="text-slate-800 text-[13px]">Room {currentPlacement.roomNumber} ({currentPlacement.bedIdentifier})</span>
                        </div>
                        <div className="col-span-2 border-t border-emerald-100/50 pt-2 mt-1">
                            <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Check-in Date</span>
                            <span className="text-slate-800 font-medium">
                                {currentPlacement.checkInDate?.toDate ? currentPlacement.checkInDate.toDate().toLocaleDateString() : new Date(currentPlacement.checkInDate).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Card className="border-2 border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden p-6 text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 border rounded-full flex items-center justify-center mx-auto text-slate-400">
                        <Home size={28} />
                    </div>
                    <div>
                        <h3 className="font-extrabold text-slate-800">Not Boarded</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                            This child is not currently allocated to any campus dorm room. You can submit an application to enlist them in the boarding services.
                        </p>
                    </div>

                    {pendingApp ? (
                        <div className="p-4 border-2 border-amber-100 bg-amber-50/20 rounded-xl max-w-sm mx-auto text-xs flex flex-col gap-1 shadow-inner">
                            <div className="flex items-center gap-1.5 justify-center font-bold text-amber-850">
                                <HelpCircle size={14} className="animate-bounce" /> Pending Application Submitted
                            </div>
                            <p className="text-slate-500 font-medium mt-1">Details: "{pendingApp.requestDetails}"</p>
                            <p className="text-[9px] uppercase tracking-wider text-slate-450 mt-1 font-bold">
                                Submitted on: {pendingApp.createdAt?.toDate ? pendingApp.createdAt.toDate().toLocaleDateString() : new Date(pendingApp.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <Dialog open={applyOpen} onOpenChange={setApplyOpen}>
                            <DialogTrigger asChild>
                                <Button onClick={() => setApplyOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 px-5 rounded-xl shadow-md">
                                    <Plus className="mr-2 h-4 w-4" /> Apply for Boarding
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md rounded-3xl p-6">
                                <DialogHeader>
                                    <DialogTitle className="text-slate-800 font-black uppercase italic tracking-tight">Apply for Boarding Placement</DialogTitle>
                                    <DialogDescription className="font-semibold text-slate-500">
                                        Submit a housing placement request for <strong>{student.firstName} {student.lastName}</strong>.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmitApplication} className="space-y-4 py-4">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-bold text-slate-700">Request Comments / Special Notes</Label>
                                        <Textarea 
                                            placeholder="Specify health conditions, dietary restrictions, lower-bunk preferences, or other guidelines for the Warden..." 
                                            value={requestDetails}
                                            onChange={e => setRequestDetails(e.target.value)}
                                            rows={4}
                                            required
                                            className="bg-white border-2 rounded-xl text-xs leading-relaxed"
                                        />
                                    </div>
                                    <DialogFooter className="pt-2">
                                        <Button type="button" variant="outline" className="border-2 rounded-xl" onClick={() => setApplyOpen(false)}>Cancel</Button>
                                        <Button type="submit" disabled={isSubmitting || !requestDetails.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                                            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Submit Request'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
                </Card>
            )}

            {/* Applications History */}
            {applications && applications.length > 0 && (
                <div className="space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-655 flex items-center gap-1.5">
                        <ClipboardCopy size={14} /> Application History
                    </h4>
                    <div className="border border-slate-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead className="font-bold text-slate-700 h-10 text-xs">Date</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-10 text-xs">Notes</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-10 text-xs">Status</TableHead>
                                    <TableHead className="font-bold text-slate-700 h-10 text-xs">Review Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="text-xs">
                                {applications.map((app: any) => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium whitespace-nowrap">
                                            {app.createdAt?.toDate ? format(app.createdAt.toDate(), 'PPP') : new Date(app.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate text-slate-600">{app.requestDetails}</TableCell>
                                        <TableCell>
                                            <Badge 
                                                variant="outline" 
                                                className={cn(
                                                    "font-bold text-[10px] rounded-md px-2 py-0.5",
                                                    app.status === 'Pending' && "bg-amber-50 text-amber-700 border-amber-100",
                                                    app.status === 'Approved' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                                                    app.status === 'Rejected' && "bg-rose-50 text-rose-700 border-rose-100"
                                                )}
                                            >
                                                {app.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-slate-500 italic">
                                            {app.status === 'Rejected' ? (
                                                <span className="text-rose-600 font-medium">Rejection Reason: "{app.rejectionReason || 'No details'}"</span>
                                            ) : app.status === 'Approved' ? (
                                                <span className="text-emerald-700 font-medium">Approved by {app.reviewedByName || 'Staff'}</span>
                                            ) : (
                                                <span className="text-slate-400">Awaiting warden review</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
}

function DigitalWalletTab({ student }: { student: Student }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { schoolId } = useCurrentSchool();
    const { profile } = useRole();
    const { toast } = useToast();

    const [topUpAmount, setTopUpAmount] = useState('');

    const studentId = student.id || student.uid;

    // 1. Fetch school settings for Paystack keys
    const schoolSettingsQuery = useMemoFirebase(
      () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
      [firestore, schoolId]
    );
    const { data: schoolSettings } = useDoc<any>(schoolSettingsQuery as any);

    // 2. Fetch student wallet balance (real-time)
    const walletDocRef = useMemoFirebase(
      () => (firestore && studentId) ? doc(firestore, 'student_wallets', studentId) : null,
      [firestore, studentId]
    );
    const { data: wallet, isLoading: isWalletLoading } = useDoc<any>(walletDocRef);

    // 3. Fetch student wallet transactions (real-time, filtered by studentId, sorted in memory)
    const txQuery = useMemoFirebase(
      () => (firestore && studentId) ? query(
        collection(firestore, 'wallet_transactions'),
        where('studentId', '==', studentId)
      ) : null,
      [firestore, studentId]
    );
    const { data: rawTransactions, isLoading: isTxLoading } = useCollection<any>(txQuery);

    const transactions = useMemo(() => {
      if (!rawTransactions) return [];
      return [...rawTransactions].sort((a: any, b: any) => {
        const aTime = a.timestamp?.toDate ? a.timestamp.toDate().getTime() : new Date(a.timestamp || 0).getTime();
        const bTime = b.timestamp?.toDate ? b.timestamp.toDate().getTime() : new Date(b.timestamp || 0).getTime();
        return bTime - aTime;
      });
    }, [rawTransactions]);

    if (isWalletLoading || isTxLoading) {
      return <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>;
    }

    const balance = wallet?.balance || 0;
    const paystackEnabled = schoolSettings?.enablePaystack && schoolSettings?.paystackPubKey;

    // Paystack payment properties
    const amountVal = parseFloat(topUpAmount);
    const payAmountPesewas = !isNaN(amountVal) && amountVal > 0 ? Math.round(amountVal * 100) : 0;

    const parentName = profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : (user?.displayName || 'Parent');

    const paymentProps = {
        email: user?.email || 'parent@gamedu.app', 
        amount: payAmountPesewas, 
        currency: 'GHS',
        publicKey: schoolSettings?.paystackPubKey || '',
        text: `Top Up GH₵ ${amountVal ? amountVal.toFixed(2) : '0.00'}`,
        metadata: {
            type: 'wallet_topup',
            schoolId: schoolId,
            studentId: studentId,
            parentId: user?.uid,
            parentName: parentName,
            amount: amountVal
        },
        onSuccess: () => {
            toast({ title: 'Payment Successful! 🎉', description: 'Your transaction has been submitted and the pocket money wallet will be credited shortly.' });
            setTopUpAmount('');
        },
        onClose: () => {
            toast({ variant: 'destructive', title: 'Payment Cancelled', description: 'The payment process was closed.' });
        },
    };

    const PaystackButtonComponent = PaystackButton as any;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* 1. Wallet Balance Card (Premium design with executive deep indigo-violet gradient) */}
                <Card className="md:col-span-1 overflow-hidden relative border-none bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-850 text-white shadow-xl rounded-3xl p-6">
                    <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
                    <div className="relative z-10 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Pocket Money Balance</span>
                            <Wallet className="h-5 w-5 text-indigo-200" />
                        </div>
                        <div>
                            <span className="text-4xl font-black tracking-tight">GH₵{balance.toFixed(2)}</span>
                        </div>
                        <div className="pt-2 text-[10px] text-indigo-200 font-medium">
                            Linked Student: <span className="font-bold text-white uppercase">{student.firstName} {student.lastName}</span>
                        </div>
                    </div>
                </Card>

                {/* 2. Top-Up Panel */}
                <Card className="md:col-span-2 border-2 border-slate-100 rounded-3xl bg-white shadow-sm overflow-hidden p-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-tight flex items-center gap-1.5">
                                <Coins className="text-indigo-600" size={18}/> Mobile Money Wallet Refill
                            </h3>
                            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                Instantly credit your ward's pocket money wallet using Paystack. Momo and Cards accepted.
                            </p>
                        </div>

                        {paystackEnabled ? (
                            <div className="space-y-3">
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold text-slate-700">Refill Amount (GH₵)</Label>
                                    <Input 
                                        type="number"
                                        min="1"
                                        step="any"
                                        placeholder="e.g. 50"
                                        value={topUpAmount}
                                        onChange={e => setTopUpAmount(e.target.value)}
                                        className="bg-white border-2 rounded-xl text-xs h-10"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 border-2 border-amber-100 bg-amber-50/20 rounded-xl text-xs text-amber-850 font-semibold text-center">
                                Online Paystack payment is not configured by the school. Please contact school administration.
                            </div>
                        )}
                    </div>

                    {paystackEnabled && (
                        <div className="pt-4">
                            {payAmountPesewas > 0 ? (
                                <PaystackButtonComponent 
                                    className="w-full h-11 rounded-xl text-sm font-black uppercase tracking-widest text-white shadow-lg bg-indigo-600 hover:bg-indigo-700 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center"
                                    {...paymentProps}
                                />
                            ) : (
                                <Button disabled className="w-full h-11 rounded-xl text-sm font-black uppercase tracking-widest bg-slate-100 text-slate-400">
                                    Enter Amount to Refill
                                </Button>
                            )}
                        </div>
                    )}
                </Card>

            </div>

            {/* 3. Transaction History */}
            <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-655 flex items-center gap-1.5">
                    Recent Wallet Transactions
                </h4>
                <div className="border border-slate-100 rounded-3xl overflow-hidden bg-white shadow-sm">
                    <Table>
                        <TableHeader className="bg-slate-50">
                            <TableRow>
                                <TableHead className="font-bold text-slate-700 h-10 text-xs">Date</TableHead>
                                <TableHead className="font-bold text-slate-700 h-10 text-xs">Reference</TableHead>
                                <TableHead className="font-bold text-slate-700 h-10 text-xs">Description</TableHead>
                                <TableHead className="font-bold text-slate-700 h-10 text-xs">Type</TableHead>
                                <TableHead className="font-bold text-slate-700 h-10 text-xs text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="text-xs">
                            {transactions.map((tx: any) => (
                                <TableRow key={tx.id}>
                                    <TableCell className="font-medium whitespace-nowrap">
                                        {tx.timestamp?.toDate ? format(tx.timestamp.toDate(), 'PPP p') : new Date(tx.timestamp).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="font-mono text-[10px] text-slate-500 uppercase tracking-tight">{tx.reference || 'N/A'}</TableCell>
                                    <TableCell className="text-slate-600 font-semibold">{tx.description}</TableCell>
                                    <TableCell>
                                        <Badge 
                                            variant="outline" 
                                            className={cn(
                                                "font-bold text-[9px] rounded-md px-1.5 py-0.5",
                                                tx.type === 'Credit' && "bg-emerald-50 text-emerald-700 border-emerald-100",
                                                tx.type === 'Debit' && "bg-rose-50 text-rose-700 border-rose-100"
                                            )}
                                        >
                                            {tx.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className={cn(
                                        "font-bold text-right text-xs",
                                        tx.type === 'Credit' ? "text-emerald-600" : "text-rose-600"
                                    )}>
                                        {tx.type === 'Credit' ? '+' : '-'}GH₵{tx.amount.toFixed(2)}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {transactions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                        No transaction logs recorded for this pocket money account.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

        </div>
    );
}

function StudentDetailView({ student }: { student: Student }) {
    const studentId = student.id || student.uid;

    return (
        <div className="space-y-6">
            <Tabs defaultValue="attendance" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-slate-100 p-1 rounded-xl">
                    <TabsTrigger value="attendance" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <CalendarCheck className="mr-2 h-4 w-4" /> Attendance Log
                    </TabsTrigger>
                    <TabsTrigger value="behavioral" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <ShieldAlert className="mr-2 h-4 w-4" /> Behavioral Log
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Milestone className="mr-2 h-4 w-4" /> Journey Timeline
                    </TabsTrigger>
                    <TabsTrigger value="boarding" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Home className="mr-2 h-4 w-4" /> Boarding Service
                    </TabsTrigger>
                    <TabsTrigger value="wallet" className="rounded-lg font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                        <Wallet className="mr-2 h-4 w-4" /> Digital Wallet
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="attendance" className="mt-6">
                    <AttendanceHistory studentId={studentId} />
                </TabsContent>

                <TabsContent value="behavioral" className="mt-6">
                    <BehavioralHistory studentId={studentId} />
                </TabsContent>

                <TabsContent value="timeline" className="mt-6">
                    <StudentJourneyTimeline studentId={studentId} />
                </TabsContent>

                <TabsContent value="boarding" className="mt-6">
                    <BoardingServiceTab student={student} />
                </TabsContent>

                <TabsContent value="wallet" className="mt-6">
                    <DigitalWalletTab student={student} />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function StudentAccordionItem({ studentUid }: { studentUid: string }) {
    const firestore = useFirestore();
    
    const studentDocRef = useMemoFirebase(
        () => firestore ? doc(firestore, 'students', studentUid) : null,
        [firestore, studentUid]
    );
    
    const { data: student, isLoading } = useDoc<Student>(studentDocRef);

    if (isLoading) {
        return (
            <div className="flex items-center p-6 border-b">
                <Loader2 className="h-5 w-5 animate-spin text-primary"/>
                <span className="ml-3 text-sm font-medium text-slate-500">Synchronizing child profile...</span>
            </div>
        );
    }
    
    if (!student || student.enrollmentStatus === 'Inactive') {
        return null;
    }

    return (
        <AccordionItem value={studentUid} key={studentUid} className="border rounded-2xl mb-4 overflow-hidden shadow-sm bg-white">
            <AccordionTrigger className="hover:no-underline px-6 py-5 hover:bg-slate-50 transition-all">
                <StudentDisplay student={student} variant="list" showAvatar/>
            </AccordionTrigger>
            <AccordionContent className="p-6 bg-slate-50/30 border-t">
                <StudentDetailView student={student} />
            </AccordionContent>
        </AccordionItem>
    );
}

function MyChildrenPageContent() {
    const { user, isUserLoading } = useUser();
    const { role, profile, loading: isRoleLoading } = useRole();
    const firestore = useFirestore();

    const studentIds = useMemo(() => {
        return (
            profile?.studentIds || 
            profile?.student_ids || 
            profile?.students || 
            profile?.childrenIds || 
            profile?.linkedStudentIds || 
            []
        );
    }, [profile]);
    
    const { data: studentForStudentRole, isLoading: isStudentLoading } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user && firestore) ? query(collection(firestore, 'students'), where('uid', '==', user.uid)) : null, [firestore, user?.uid, role])
    );
    
    const isLoading = isUserLoading || isRoleLoading || isStudentLoading;

    if (isLoading) {
        return (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        );
    }

    if (role !== 'Parent' && role !== 'Student') {
        return (
            <Card className="max-w-md mx-auto">
                <CardHeader className="text-center">
                    <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <CardTitle>Access Denied</CardTitle>
                    <CardDescription>This information is only available to parents and students.</CardDescription>
                </CardHeader>
            </Card>
        );
    }
    
    if (role === 'Student') {
        const student = studentForStudentRole?.[0];
        if (!student) {
            return (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50">
                    <User className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Your student profile could not be loaded.</p>
                </div>
            );
        }
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white p-6 rounded-3xl border-2 border-indigo-50 shadow-xl">
                    <StudentDetailView student={student} />
                </div>
            </div>
        );
    }

    if (role === 'Parent') {
        if (!studentIds || studentIds.length === 0) {
            return (
                <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-slate-50 max-w-2xl mx-auto mt-10">
                    <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold text-slate-800">No Children Linked</h3>
                    <p className="text-slate-500 mt-2">We couldn't find any students associated with your parent account.</p>
                    <p className="text-sm text-indigo-600 mt-4 font-bold">Please contact the school office to verify your account link.</p>
                </div>
            );
        }
        
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Executive Violet/Fuchsia Gradient Banner */}
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 via-fuchsia-600 to-indigo-600 p-8 text-white shadow-xl shadow-indigo-100/50 dark:shadow-none mb-6">
                    {/* Decorative background shapes */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-xl animate-pulse" />
                    <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                                <Users className="h-3.5 w-3.5 text-fuchsia-200" /> Parent Portal
                            </span>
                            <h1 className="mt-4 text-2xl md:text-3xl font-extrabold tracking-tight italic uppercase">My Children</h1>
                            <p className="mt-2 text-indigo-100/90 text-xs leading-relaxed font-semibold italic">
                                Access your children's live academic attendance log, behavioral records, and campus housing boarding details.
                            </p>
                        </div>
                    </div>
                </div>

                <Accordion type="single" collapsible defaultValue={studentIds[0]} className="w-full">
                    {studentIds.map((uid: string) => (
                        <StudentAccordionItem key={uid} studentUid={uid} />
                    ))}
                </Accordion>
            </div>
        );
    }

    return null;
}

export default function MyChildrenPage() {
    return (
      <div className="p-4 md:p-6 pb-20">
        <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
            <MyChildrenPageContent />
        </Suspense>
      </div>
    );
}
