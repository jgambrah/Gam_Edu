'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Route, Stop, Student, Bus, Class } from '@/lib/types';
import { User, Users, Bus as BusIcon, MapPin, Route as RouteIcon, Loader2, PlusCircle, Trash2, Edit, Calendar, ShieldAlert, Clock, CheckCircle, XCircle, UserCheck, ClipboardList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// --- Student Assignment Dialog ---

const assignmentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student.'),
  stopId: z.string().min(1, 'Please select a stop.'),
});

function StudentAssignmentDialog({ 
    route, 
    allRoutes, 
    students, 
    open, 
    onOpenChange, 
    onAssignmentChange 
}: { 
    route: Route; 
    allRoutes: Route[];
    students: Student[]; 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
    onAssignmentChange: () => void; 
}) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const globallyAssignedIds = useMemo(() => {
    return allRoutes?.flatMap((r: Route) => r.stops?.flatMap((stop: Stop) => stop.assignedStudentIds || []) || []) || [];
  }, [allRoutes]);
  
  const availableStudents = useMemo(() => {
    // Filter for ACTIVE subscribers only
    return students.filter(s => 
        s.usesBusService === true && 
        (s.enrollmentStatus === 'Active' || !s.enrollmentStatus) &&
        !globallyAssignedIds.includes(s.uid)
    );
  }, [students, globallyAssignedIds]);
  
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
  });

  const onAssignSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setIsSubmitting(true);
    const routeRef = doc(firestore!, 'routes', route.id);
    
    const newStops = route.stops.map((stop: Stop) => {
        const filteredStudents = stop.assignedStudentIds.filter((id: string) => id !== values.studentId);
        if (stop.id === values.stopId) {
            return { ...stop, assignedStudentIds: [...filteredStudents, values.studentId] };
        }
        return { ...stop, assignedStudentIds: filteredStudents };
    });

    try {
        await updateDocumentNonBlocking(routeRef, { stops: newStops });
        toast({ title: 'Student Assigned', description: 'The student has been assigned to the stop.' });
        onAssignmentChange();
        form.reset();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to assign student.'});
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleUnassign = async (studentId: string) => {
    const routeRef = doc(firestore!, 'routes', route.id);
    const newStops = route.stops.map((stop: Stop) => ({
        ...stop,
        assignedStudentIds: stop.assignedStudentIds.filter((id: string) => id !== studentId)
    }));
    try {
        await updateDocumentNonBlocking(routeRef, { stops: newStops });
        toast({ title: 'Student Unassigned', description: 'The student has been removed from this route.' });
        onAssignmentChange();
    } catch (e) {
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to unassign student.'});
    }
  };
  
  const assignedInThisRoute = useMemo(() => {
    return route.stops?.flatMap((stop: Stop) => 
        stop.assignedStudentIds.map((studentId: string) => {
            const student = students.find(s => s.uid === studentId);
            // Verify student exists and is ACTIVE
            if (student && (student.enrollmentStatus === 'Active' || !student.enrollmentStatus)) {
                return { student, stop };
            }
            return null;
        })
    ).filter((item: { student: Student | undefined; stop: Stop } | null): item is { student: Student; stop: Stop } => item !== null && item.student !== undefined) || [];
  }, [route, students]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl rounded-3xl border-0 shadow-2xl">
        <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase text-slate-800 tracking-tight">Assign Students: {route.name}</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Manage student stop allocations for this route.</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">New Assignment</h3>
                    <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-600 font-bold uppercase text-[9px]">{availableStudents.length} Available</Badge>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAssignSubmit)} className="space-y-4">
                    <FormField control={form.control} name="studentId" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-black uppercase text-slate-400">Select Unassigned Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 rounded-xl border-2">
                                        <SelectValue placeholder="Choose a student..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {availableStudents.length === 0 ? (
                                        <div className="p-4 text-center text-xs text-muted-foreground italic">
                                            No unassigned active bus subscribers found.
                                        </div>
                                    ) : (
                                        availableStudents.map(s => (
                                            <SelectItem key={s.uid} value={s.uid}>
                                                {s.firstName} {s.lastName} ({s.classId || 'No Class'})
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="stopId" render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-black uppercase text-slate-400">Assign to Stop</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger className="h-11 rounded-xl border-2">
                                        <SelectValue placeholder="Choose a stop..." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {route.stops?.map(s => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.order}. {s.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <Button type="submit" disabled={isSubmitting || availableStudents.length === 0} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight shadow-md">
                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                        Assign Student
                    </Button>
                    </form>
                </Form>
            </div>
            <div className="bg-slate-50/50 p-6 rounded-3xl border-2 border-slate-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-xs uppercase tracking-widest text-slate-400">Current Assignments</h3>
                    <Badge className="bg-indigo-100 hover:bg-indigo-100 text-indigo-700 border-none font-bold uppercase text-[9px]">{assignedInThisRoute.length} Assigned</Badge>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {assignedInThisRoute.map(({student, stop}) => (
                        <div key={student?.uid} className="flex justify-between items-center p-3 bg-white border-2 border-slate-100 rounded-2xl shadow-sm group">
                            <div className="min-w-0">
                                {student && <StudentDisplay student={student} variant="compact" />}
                                <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold uppercase mt-1">
                                    <MapPin className="h-3 w-3"/>
                                    <span>{stop.name}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl" onClick={() => handleUnassign(student!.uid)}>
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    {assignedInThisRoute.length === 0 && (
                        <div className="text-center py-12 text-slate-400 italic text-xs font-bold uppercase tracking-wider">
                            No students assigned to this route.
                        </div>
                    )}
                </div>
            </div>
        </div>
        </DialogContent>
    </Dialog>
  );
}

// --- Bus Management Dialog ---
function BusManagementDialog({ open, onOpenChange, onBusChange, schoolId }: { open: boolean; onOpenChange: (open: boolean) => void; onBusChange: () => void; schoolId: string }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: buses, isLoading } = useCollection<Bus>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));

    const form = useForm({
        defaultValues: { name: '', capacity: 30, licensePlate: '', status: 'Active' as 'Active' | 'Maintenance' | 'Inactive' }
    });

    const onAddBus = async (values: { name: string; capacity: number; licensePlate?: string; status?: string }) => {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore!, 'buses'), { ...values, schoolId });
            toast({ title: 'Bus Enrolled in Fleet' });
            onBusChange();
            form.reset({ name: '', capacity: 30, licensePlate: '', status: 'Active' });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error adding bus' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-3xl border-0 shadow-2xl sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase text-slate-800 tracking-tight font-black uppercase">Transport Fleet Vehicles</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configure school buses, registration, and maintenance status.</DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAddBus)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Bus Name/Code</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g., Bus #04 - Yellow Eagle" className="h-11 rounded-xl border-2 text-xs" /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="licensePlate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">License Plate</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g., GT 4820-24" className="h-11 rounded-xl border-2 text-xs font-mono" /></FormControl>
                                </FormItem>
                            )} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="capacity" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Seat Capacity</FormLabel>
                                    <FormControl><Input type="number" {...field} className="h-11 rounded-xl border-2 text-xs font-mono" /></FormControl>
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Operational Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-11 rounded-xl border-2 text-xs"><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active (In Service)</SelectItem>
                                            <SelectItem value="Maintenance">Under Maintenance</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )} />
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight shadow-md">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Enroll Vehicle to Fleet
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 border-t border-slate-100 pt-4">
                    <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-2">Registered Fleet Inventory</h4>
                    {isLoading ? <div className="py-6 flex justify-center"><Loader2 className="animate-spin h-5 w-5 text-indigo-600"/></div> : (
                        <div className="max-h-52 overflow-y-auto border border-slate-100 rounded-2xl">
                            <Table>
                                <TableHeader className="bg-slate-50/50">
                                    <TableRow>
                                        <TableHead className="font-bold uppercase text-[9px] tracking-wider">Vehicle</TableHead>
                                        <TableHead className="font-bold uppercase text-[9px] tracking-wider">Plate</TableHead>
                                        <TableHead className="font-bold uppercase text-[9px] tracking-wider">Capacity</TableHead>
                                        <TableHead className="font-bold uppercase text-[9px] tracking-wider">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {buses?.map(bus => (
                                        <TableRow key={bus.id} className="hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="font-bold text-slate-800 text-xs uppercase">{bus.name}</TableCell>
                                            <TableCell className="font-mono text-xs font-bold text-slate-600">{bus.licensePlate || 'N/A'}</TableCell>
                                            <TableCell className="font-mono text-xs font-bold text-slate-500">{bus.capacity} seats</TableCell>
                                            <TableCell>
                                                <Badge className={cn(
                                                    "font-bold uppercase text-[9px] px-2 py-0.5 rounded-full border-none",
                                                    bus.status === 'Maintenance' ? "bg-amber-100 text-amber-800" :
                                                    bus.status === 'Inactive' ? "bg-rose-100 text-rose-800" :
                                                    "bg-emerald-100 text-emerald-800"
                                                )}>
                                                    {bus.status || 'Active'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </DialogContent>
         </Dialog>
    );
}

// --- Route Management Dialog ---
const stopSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Stop name is required.'),
  address: z.string().min(1, 'Address is required.'),
  order: z.coerce.number().min(1, 'Order must be at least 1.'),
  pickupTime: z.string().optional(),
  dropoffTime: z.string().optional(),
  assignedStudentIds: z.array(z.string()).default([]),
});

const routeSchema = z.object({
  name: z.string().min(1, 'Route name is required.'),
  busId: z.string().min(1, 'A bus must be selected.'),
  driverId: z.string().min(1, 'A driver must be selected.'),
  dailyRate: z.coerce.number().min(0, 'Daily rate must be at least 0.'),
  termlyRate: z.coerce.number().min(0, 'Termly rate must be at least 0.').optional(),
  stops: z.array(stopSchema).min(1, 'At least one stop is required.'),
});

function RouteManagementDialog({ 
    open, 
    onOpenChange, 
    onRouteChange, 
    schoolId, 
    editingRoute = null 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void; 
    onRouteChange: () => void; 
    schoolId: string;
    editingRoute?: Route | null;
}) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: buses } = useCollection<Bus>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]));
    const { data: drivers } = useCollection<any>(useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', '==', 'Transport Staff')) : null, [firestore, schoolId]));

    const form = useForm<z.infer<typeof routeSchema>>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            name: '',
            busId: '',
            driverId: '',
            dailyRate: 0,
            termlyRate: 0,
            stops: [{ name: '', address: '', order: 1, assignedStudentIds: [] }],
        },
    });

    useEffect(() => {
        if (open) {
            if (editingRoute) {
                form.reset({
                    name: editingRoute.name,
                    busId: editingRoute.busId,
                    driverId: editingRoute.driverId,
                    dailyRate: editingRoute.dailyRate || 0,
                    termlyRate: editingRoute.termlyRate || 0,
                    stops: editingRoute.stops || [],
                });
            } else {
                form.reset({
                    name: '',
                    busId: '',
                    driverId: '',
                    dailyRate: 0,
                    termlyRate: 0,
                    stops: [{ name: '', address: '', order: 1, pickupTime: '07:15 AM', dropoffTime: '04:00 PM', assignedStudentIds: [] }],
                });
            }
        }
    }, [editingRoute, open, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "stops"
    });

    const onSubmit = async (values: z.infer<typeof routeSchema>) => {
        if (!firestore || !schoolId) return;
        setIsSubmitting(true);
        
        try {
            const stopsWithIds = values.stops.map(stop => ({
                ...stop, 
                id: stop.id || doc(collection(firestore, 'temp')).id 
            }));

            if (editingRoute) {
                const routeRef = doc(firestore, 'routes', editingRoute.id);
                await updateDocumentNonBlocking(routeRef, { 
                    ...values, 
                    stops: stopsWithIds, 
                    updatedAt: serverTimestamp() 
                });
                toast({ title: 'Route Updated' });
            } else {
                await addDocumentNonBlocking(collection(firestore, 'routes'), {
                    ...values, 
                    stops: stopsWithIds, 
                    schoolId,
                    createdAt: serverTimestamp()
                });
                toast({ title: 'Route Created' });
            }
            
            onRouteChange();
            onOpenChange(false);
        } catch (e) {
             toast({ variant: 'destructive', title: 'Error', description: 'Failed to save route.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border-0 shadow-2xl p-8">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase text-slate-800 tracking-tight">{editingRoute ? 'Edit Route' : 'Create New Route'}</DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Configure stops, driver assignments, and fares.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem className="md:col-span-1">
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Route Name</FormLabel>
                                    <FormControl><Input {...field} placeholder="e.g., North Route" className="h-11 rounded-xl border-2" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="dailyRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Daily Rate (GH₵)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} placeholder="15.00" className="h-11 rounded-xl border-2 font-mono font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="termlyRate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Termly Rate (GH₵)</FormLabel>
                                    <FormControl><Input type="number" step="0.01" {...field} placeholder="800.00" className="h-11 rounded-xl border-2 font-mono font-bold" /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="busId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Assign Bus</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue placeholder="Select a bus" /></SelectTrigger></FormControl>
                                        <SelectContent>{buses?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="driverId" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-black uppercase text-slate-400">Assign Driver</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl><SelectTrigger className="h-11 rounded-xl border-2"><SelectValue placeholder="Select a driver" /></SelectTrigger></FormControl>
                                        <SelectContent>{drivers?.map(d => <SelectItem key={d.uid} value={d.uid}>{d.firstName} {d.lastName}</SelectItem>)}</SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-3">Stops Builder</h4>
                            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-center p-4 border-2 border-slate-100 rounded-2xl bg-white shadow-sm relative group hover:border-slate-200 transition-all">
                                        <div className="w-16">
                                            <FormField control={form.control} name={`stops.${index}.order`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Order</FormLabel>
                                                    <FormControl><Input type="number" {...field} className="h-10 rounded-xl border-2 font-mono font-bold" /></FormControl>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <div className="flex-1">
                                            <FormField control={form.control} name={`stops.${index}.name`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Stop Name</FormLabel>
                                                    <FormControl><Input {...field} placeholder="e.g. Junction" className="h-10 rounded-xl border-2" /></FormControl>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <div className="flex-1">
                                            <FormField control={form.control} name={`stops.${index}.address`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Address</FormLabel>
                                                    <FormControl><Input {...field} placeholder="e.g. Ring Road" className="h-10 rounded-xl border-2" /></FormControl>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <div className="w-24">
                                            <FormField control={form.control} name={`stops.${index}.pickupTime`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Pickup</FormLabel>
                                                    <FormControl><Input {...field} placeholder="07:15 AM" className="h-10 rounded-xl border-2 text-xs" /></FormControl>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <div className="w-24">
                                            <FormField control={form.control} name={`stops.${index}.dropoffTime`} render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] font-black uppercase text-slate-400">Dropoff</FormLabel>
                                                    <FormControl><Input {...field} placeholder="04:00 PM" className="h-10 rounded-xl border-2 text-xs" /></FormControl>
                                                </FormItem>
                                            )}/>
                                        </div>
                                        <div className="pt-5">
                                            <Button type="button" variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-rose-50 rounded-xl h-10 w-10" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4"/>
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', address: '', order: fields.length + 1, pickupTime: '07:15 AM', dropoffTime: '04:00 PM', assignedStudentIds: [] })} className="mt-4 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-xl h-10 px-4 font-black uppercase text-xs tracking-wider">
                                <PlusCircle className="h-4 w-4 mr-2 text-indigo-600"/> Add Route Stop
                            </Button>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-2xl font-black uppercase tracking-tight shadow-md">
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                            {editingRoute ? 'Save Route Changes' : 'Create Route'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

// --- Daily Transport Manifest Component ---
function DailyTransportManifest({
  route,
  routes,
  students,
  buses,
  drivers,
  schoolId
}: {
  route: Route | null;
  routes: Route[];
  students: Student[];
  buses: Bus[];
  drivers: any[];
  schoolId: string;
}) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [shift, setShift] = useState<'Morning AM' | 'Afternoon PM'>('Morning AM');
  const [transitState, setTransitState] = useState<Record<string, 'Boarded' | 'Dropped Off' | 'Absent'>>({});

  const handleMarkStatus = async (studentId: string, stopId: string, status: 'Boarded' | 'Dropped Off' | 'Absent') => {
    setTransitState(prev => ({ ...prev, [studentId]: status }));

    if (firestore && schoolId && route) {
      try {
        await addDocumentNonBlocking(collection(firestore, 'vehicle_logs'), {
          schoolId,
          routeId: route.id,
          routeName: route.name,
          stopId,
          studentId,
          shift,
          status,
          timestamp: serverTimestamp()
        });

        // Trigger in-app notification for student & parent suite
        const targetStudent = students?.find(s => s.uid === studentId || s.id === studentId);
        const studentName = targetStudent ? `${targetStudent.firstName} ${targetStudent.lastName}` : 'Student';
        await addDocumentNonBlocking(collection(firestore, 'notifications'), {
          schoolId,
          userId: studentId,
          title: `Bus Transit: ${studentName} ${status}`,
          message: `${studentName} has been marked as ${status} during ${shift} on route ${route.name}.`,
          type: 'transport',
          createdAt: serverTimestamp(),
          read: false
        });

        toast({ title: `Student marked as ${status}` });
      } catch (err) {
        console.error("Error logging vehicle transit:", err);
      }
    }
  };

  if (!route) {
    return (
      <Card className="rounded-[2.5rem] border border-slate-100 shadow-lg bg-white p-8 text-center">
        <BusIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <CardTitle className="text-base font-black uppercase text-slate-700 tracking-tight">No Route Selected</CardTitle>
        <CardDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Please select a route from the dropdown above to load the passenger check-in roster.</CardDescription>
      </Card>
    );
  }

  const assignedBus = buses?.find(b => b.id === route.busId);
  const assignedDriver = drivers?.find(d => d.uid === route.driverId);

  return (
    <Card className="rounded-[2.5rem] border border-slate-100 shadow-xl bg-white overflow-hidden space-y-6">
      <CardHeader className="bg-slate-900 text-white p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6 text-indigo-400" />
              <CardTitle className="text-xl font-black uppercase tracking-tight text-white">{route.name} - Passenger Manifest</CardTitle>
            </div>
            <CardDescription className="text-xs text-slate-300 font-medium mt-1">
              Vehicle: <strong className="text-white">{assignedBus?.name || 'School Bus'}</strong> ({assignedBus?.licensePlate || 'Plate N/A'}) | Driver: <strong className="text-white">{assignedDriver ? `${assignedDriver.firstName} ${assignedDriver.lastName}` : (route.driverName || 'Staff Driver')}</strong>
            </CardDescription>
          </div>
          <div className="flex gap-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            <Button
              variant={shift === 'Morning AM' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShift('Morning AM')}
              className={cn("rounded-xl font-black text-xs uppercase px-4", shift === 'Morning AM' ? "bg-indigo-600 text-white shadow-md" : "text-slate-300 hover:text-white")}
            >
              Morning Pickup (AM)
            </Button>
            <Button
              variant={shift === 'Afternoon PM' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setShift('Afternoon PM')}
              className={cn("rounded-xl font-black text-xs uppercase px-4", shift === 'Afternoon PM' ? "bg-indigo-600 text-white shadow-md" : "text-slate-300 hover:text-white")}
            >
              Afternoon Drop-off (PM)
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {route.stops?.sort((a, b) => a.order - b.order).map((stop) => (
          <div key={stop.id} className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
              <div>
                <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                  Stop {stop.order}: {stop.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{stop.address}</p>
              </div>
              <Badge className="bg-white text-indigo-600 border border-slate-200 font-bold text-[10px] uppercase px-3 py-1 rounded-full">
                Scheduled: {shift === 'Morning AM' ? (stop.pickupTime || '07:15 AM') : (stop.dropoffTime || '04:00 PM')}
              </Badge>
            </div>

            <div className="space-y-3">
              {stop.assignedStudentIds && stop.assignedStudentIds.length > 0 ? (
                stop.assignedStudentIds.map((studentId) => {
                  const student = students?.find(s => s.uid === studentId);
                  if (!student || (student.enrollmentStatus && student.enrollmentStatus !== 'Active')) return null;
                  const currentStatus = transitState[studentId];

                  return (
                    <div key={studentId} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-white rounded-xl border border-slate-150 shadow-sm gap-3">
                      <StudentDisplay student={student} variant="compact" />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant={currentStatus === 'Boarded' ? 'default' : 'outline'}
                          onClick={() => handleMarkStatus(studentId, stop.id, 'Boarded')}
                          className={cn("h-8 text-[10px] font-extrabold uppercase rounded-lg px-3", currentStatus === 'Boarded' ? "bg-emerald-600 text-white hover:bg-emerald-700" : "text-emerald-700 hover:bg-emerald-50 border-emerald-200")}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Boarded
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === 'Dropped Off' ? 'default' : 'outline'}
                          onClick={() => handleMarkStatus(studentId, stop.id, 'Dropped Off')}
                          className={cn("h-8 text-[10px] font-extrabold uppercase rounded-lg px-3", currentStatus === 'Dropped Off' ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-indigo-700 hover:bg-indigo-50 border-indigo-200")}
                        >
                          <UserCheck className="h-3 w-3 mr-1" /> Dropped Off
                        </Button>
                        <Button
                          size="sm"
                          variant={currentStatus === 'Absent' ? 'default' : 'outline'}
                          onClick={() => handleMarkStatus(studentId, stop.id, 'Absent')}
                          className={cn("h-8 text-[10px] font-extrabold uppercase rounded-lg px-3", currentStatus === 'Absent' ? "bg-rose-600 text-white hover:bg-rose-700" : "text-rose-700 hover:bg-rose-50 border-rose-200")}
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Absent
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic font-medium">No passengers assigned to this stop.</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// --- Stat Card Component ---
function StatCard({ title, value, icon: Icon, gradientClass }: { title: string; value: string | number; icon: React.ElementType; gradientClass: string }) {
    return (
      <Card className="border-none shadow-md bg-white rounded-3xl overflow-hidden relative group hover:shadow-lg transition-all duration-300">
        <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${gradientClass}`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-6">
          <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</CardTitle>
          <div className="h-8 w-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-slate-100 transition-colors">
            <Icon className="h-4 w-4" />
          </div>
        </CardHeader>
        <CardContent className="px-6 pb-6 pt-0">
          <div className="text-3xl font-black text-slate-900 tracking-tight">{value}</div>
        </CardContent>
      </Card>
    );
}

// --- Main Page ---
export default function TransportPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Dialog states
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [busManagementOpen, setBusManagementOpen] = useState(false);
  const [routeManagementOpen, setRouteManagementOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<Route | null>(null);
  
  const canAccess = ['Administrator', 'Director', 'Transport Staff'].includes(role || '');
  const canManage = ['Administrator', 'Director', 'Transport Staff'].includes(role || '');

  // Data fetching
  const routesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'routes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: routes, forceRefetch: refetchRoutes, isLoading: isLoadingRoutes } = useCollection<Route>(routesQuery);
  
  const busesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'buses'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: buses, forceRefetch: refetchBuses, isLoading: isLoadingBuses } = useCollection<Bus>(busesQuery);
  
  const studentsQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: students, forceRefetch: refetchStudents, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);
  
  const driversQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'staff'), where('schoolId', '==', schoolId), where('role', '==', 'Transport Staff')) : null, [firestore, schoolId]);
  const { data: drivers } = useCollection<any>(driversQuery);
  
  const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
  const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(classesQuery);

  const isLoading = isLoadingRoutes || isLoadingBuses || isLoadingStudents || isLoadingClasses || isLoadingSchool;

  const selectedRoute = useMemo(() => {
    return routes?.find(r => r.id === selectedRouteId);
  }, [selectedRouteId, routes]);

  const assignedBus = useMemo(() => {
    if (!selectedRoute) return null;
    return buses?.find(b => b.id === selectedRoute.busId);
  }, [selectedRoute, buses]);

  const assignedDriver = useMemo(() => {
    if(!selectedRoute || !drivers) return null;
    return drivers.find(d => d.uid === selectedRoute.driverId);
  }, [selectedRoute, drivers]);

  const subscribedStudents = useMemo(() => {
    if (!students) return [];
    // Filter for ACTIVE bus service subscribers
    return students.filter(s => 
        s.usesBusService === true && 
        (s.enrollmentStatus === 'Active' || !s.enrollmentStatus)
    );
  }, [students]);

  const totalRoutes = routes?.length || 0;
  const totalBuses = buses?.length || 0;
  const totalSubscribers = subscribedStudents.length;

  const assignedStudentIds = useMemo(() => {
    return routes?.flatMap((r: Route) => r.stops?.flatMap((stop: Stop) => stop.assignedStudentIds || []) || []) || [];
  }, [routes]);

  const waitingCount = useMemo(() => {
    return subscribedStudents.filter(s => !assignedStudentIds.includes(s.uid)).length;
  }, [subscribedStudents, assignedStudentIds]);

  const totalAssigned = useMemo(() => {
    if (!selectedRoute) return 0;
    return selectedRoute.stops?.reduce((sum, stop) => sum + (stop.assignedStudentIds?.length || 0), 0) || 0;
  }, [selectedRoute]);

  const occupancyRate = useMemo(() => {
    if (!selectedRoute || !assignedBus || !assignedBus.capacity) return 0;
    return (totalAssigned / assignedBus.capacity) * 100;
  }, [selectedRoute, assignedBus, totalAssigned]);

  const handleEditRoute = (route: Route) => {
      setEditingRoute(route);
      setRouteManagementOpen(true);
  };

  const handleDeleteRoute = async (routeId: string) => {
      if (!firestore || !confirm("Are you sure you want to delete this route? Students will be unassigned.")) return;
      try {
          await deleteDoc(doc(firestore, 'routes', routeId));
          toast({ title: 'Route Deleted' });
          setSelectedRouteId(null);
          refetchRoutes();
      } catch (e) {
          toast({ variant: 'destructive', title: 'Error deleting route' });
      }
  };

  if (!canAccess) {
    return (
      <Card className="rounded-[2.5rem] border-none shadow-xl bg-white p-8">
        <CardHeader><CardTitle className="font-black text-rose-600 uppercase italic">Access Denied</CardTitle></CardHeader>
        <CardContent><p className="font-bold text-slate-500 text-sm">This module is for transport and administrative staff only.</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase">
                    <BusIcon className="h-8 w-8 text-indigo-600 animate-pulse" /> Transport <span className="text-indigo-600">Hub</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Manage bus routes, stops, and student assignments</p>
            </div>
            
            {canManage && schoolId && (
                <div className="flex gap-2 flex-wrap">
                    <Button 
                        onClick={() => setAssignmentDialogOpen(true)} 
                        disabled={!selectedRoute} 
                        className="bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 h-12 px-6 rounded-2xl font-black uppercase tracking-tight"
                    >
                        Assign Students
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => setBusManagementOpen(true)}
                        className="border-2 rounded-2xl h-12 font-black uppercase tracking-tight"
                    >
                        Manage Buses
                    </Button>
                    <Button 
                        variant="outline" 
                        onClick={() => { setEditingRoute(null); setRouteManagementOpen(true); }}
                        className="border-2 rounded-2xl h-12 font-black uppercase tracking-tight bg-slate-900 text-white border-slate-900 hover:bg-slate-800 hover:text-white"
                    >
                        New Route
                    </Button>
                </div>
            )}
        </div>

        {/* STATISTICS STRIP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Active Routes" value={totalRoutes} icon={RouteIcon} gradientClass="from-blue-500 to-indigo-500" />
            <StatCard title="Buses Enrolled" value={totalBuses} icon={BusIcon} gradientClass="from-emerald-500 to-teal-500" />
            <StatCard title="Total Subscribers" value={totalSubscribers} icon={Users} gradientClass="from-purple-500 to-indigo-500" />
            <StatCard title="Waiting Assignment" value={waitingCount} icon={User} gradientClass="from-rose-500 to-red-500" />
        </div>

        <Tabs defaultValue="overview" className="w-full space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <TabsList className="bg-slate-100 p-1 rounded-xl">
              <TabsTrigger value="overview" className="rounded-lg font-bold text-xs uppercase px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <RouteIcon className="h-4 w-4 mr-2 text-indigo-600" /> Fleet & Route Overview
              </TabsTrigger>
              <TabsTrigger value="manifest" className="rounded-lg font-bold text-xs uppercase px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <ClipboardList className="h-4 w-4 mr-2 text-indigo-600" /> Daily Transport Manifest (Driver Roster)
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2 px-2">
              <span className="text-xs font-black uppercase text-slate-400">Route:</span>
              <Select onValueChange={setSelectedRouteId} value={selectedRouteId || undefined}>
                <SelectTrigger className="h-10 w-64 bg-white border-2 rounded-xl text-xs font-bold"><SelectValue placeholder="Choose route..." /></SelectTrigger>
                <SelectContent>
                  {routes?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6 mt-0">
            {isLoading && selectedRouteId && <div className="text-center p-20"><Loader2 className="h-10 w-10 animate-spin mx-auto text-indigo-600"/></div>}

      <div className="grid md:grid-cols-2 gap-6">
        {selectedRoute && !isLoading && (
            <div className="md:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4">
                <Card className="rounded-[2rem] border-none shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-row justify-between items-center py-4 px-6">
                    <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-600">
                        <BusIcon className="text-indigo-600 h-5 w-5"/> Bus & Driver Details
                    </CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRoute(selectedRoute)} className="rounded-xl h-8 font-bold"><Edit className="h-4 w-4 mr-1"/> Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRoute(selectedRoute.id)} className="rounded-xl h-8 text-rose-500 hover:text-rose-700 hover:bg-rose-50"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-semibold">Assigned Bus</p>
                            <p className="font-bold text-slate-800">{assignedBus?.name || 'N/A'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-semibold">Bus Capacity</p>
                            <p className="font-bold text-slate-800">{assignedBus?.capacity || 'N/A'} seats</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-semibold">Daily Rate</p>
                            <p className="font-bold text-indigo-600">GH₵{selectedRoute.dailyRate?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-semibold">Termly Rate</p>
                            <p className="font-bold text-emerald-600">GH₵{selectedRoute.termlyRate?.toFixed(2) || '0.00'}</p>
                        </div>
                    </div>
                    <div className="border-t border-slate-100 pt-4 space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-semibold">Route Driver</p>
                        <p className="font-bold text-slate-800 flex items-center gap-1.5 font-bold text-slate-800">
                            <User className="h-4 w-4 text-slate-400" />
                            {assignedDriver?.firstName ? `${assignedDriver.firstName} ${assignedDriver.lastName}`: 'N/A'}
                        </p>
                    </div>

                    <div className="border-t border-slate-100 pt-4">
                        {assignedBus && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-slate-400">
                                    <span>Route Occupancy</span>
                                    <span className={cn(
                                        "font-mono font-bold", 
                                        occupancyRate > 100 ? "text-rose-600 animate-pulse" : occupancyRate > 85 ? "text-orange-500" : "text-slate-600"
                                    )}>
                                        {totalAssigned} / {assignedBus.capacity} Seats ({occupancyRate.toFixed(0)}%)
                                    </span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden relative">
                                    <div 
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500", 
                                            occupancyRate > 100 ? "bg-rose-500 animate-pulse" : occupancyRate > 85 ? "bg-amber-500" : "bg-indigo-600"
                                        )}
                                        style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                                    />
                                </div>
                                {occupancyRate > 100 && (
                                    <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] text-rose-700 font-bold uppercase tracking-wider animate-pulse mt-2">
                                        <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                                        <span>Over-Capacity: Assigned count exceeds available seats!</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
                </Card>

                <Card className="rounded-[2rem] border-none shadow-lg bg-white overflow-hidden">
                <CardHeader className="bg-slate-50 border-b py-4 px-6">
                    <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-600">
                        <MapPin className="text-indigo-600 h-5 w-5"/> Route Stops & Assignments
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                    {selectedRoute.stops?.sort((a: Stop, b: Stop) => a.order - b.order).map((stop: Stop) => (
                    <div key={stop.id} className="p-4 border-2 border-slate-100 rounded-2xl bg-white shadow-sm hover:border-slate-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-black text-slate-800 uppercase tracking-tight">{stop.order}. {stop.name}</h4>
                            <Badge className="bg-slate-100 hover:bg-slate-100 text-slate-600 border-none font-bold uppercase text-[9px]">{stop.assignedStudentIds?.length || 0} Students</Badge>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                            <span>Address: {stop.address}</span>
                            <div className="flex gap-2">
                                <span className="text-indigo-600">Pickup: {stop.pickupTime || '07:15 AM'}</span>
                                <span className="text-slate-400">|</span>
                                <span className="text-emerald-600">Dropoff: {stop.dropoffTime || '04:00 PM'}</span>
                            </div>
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
                            {stop.assignedStudentIds?.length > 0 ? (
                                stop.assignedStudentIds.map((studentId: string) => {
                                    const student = students?.find(s => s.uid === studentId);
                                    if (student && (student.enrollmentStatus === 'Active' || !student.enrollmentStatus)) {
                                        return <div key={studentId} className="flex items-center gap-2 text-sm"><StudentDisplay student={student} variant="compact" /></div>;
                                    }
                                    return null;
                                })
                            ) : <p className="text-[10px] text-slate-400 italic font-medium">No students assigned to this stop.</p>}
                        </div>
                    </div>
                    ))}
                </CardContent>
                </Card>
            </div>
        )}
        
        <Card className="md:col-span-1 rounded-[2rem] border-none shadow-lg bg-white overflow-hidden h-fit">
            <CardHeader className="bg-white p-6 pb-4 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-600">
                    <Users className="text-indigo-600 h-5 w-5"/> Bus Service Subscribers
                </CardTitle>
                <CardDescription className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                    Found {subscribedStudents.length} active students enrolled in transport
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {isLoading ? (
                     <div className="text-center p-20"><Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600"/></div>
                ) : (
                     <Table>
                         <TableHeader className="bg-slate-50/50 border-b">
                             <TableRow>
                                 <TableHead className="font-bold uppercase text-[10px] tracking-widest">Student</TableHead>
                                 <TableHead className="font-bold uppercase text-[10px] tracking-widest">Class</TableHead>
                                 <TableHead className="font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
                             </TableRow>
                         </TableHeader>
                         <TableBody>
                             {subscribedStudents.map(student => {
                                 const isAssigned = routes?.some((r: Route) => r.stops?.some((s: Stop) => s.assignedStudentIds?.includes(student.uid)));
                                 return (
                                     <TableRow key={student.uid} className="hover:bg-slate-50/50 transition-colors">
                                         <TableCell><StudentDisplay student={student} variant="list" /></TableCell>
                                         <TableCell className="text-xs font-semibold text-slate-500">
                                             {classes?.find(c => c.id === student.classId)?.name || 'N/A'}
                                         </TableCell>
                                         <TableCell>
                                             <div className="flex flex-col gap-1">
                                                 {isAssigned ? (
                                                     <Badge className="bg-green-50 text-green-700 border-green-200 font-bold uppercase text-[9px] w-fit">Assigned</Badge>
                                                 ) : (
                                                     <Badge className="bg-orange-50 text-orange-700 border-orange-200 animate-pulse font-bold uppercase text-[9px] w-fit">Waiting</Badge>
                                                 )}
                                                 <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                                                     {student.transportBillingModel || 'Daily'} Billing
                                                 </span>
                                             </div>
                                         </TableCell>
                                     </TableRow>
                                 );
                             })}
                             {subscribedStudents.length === 0 && (
                                 <TableRow>
                                     <TableCell colSpan={3} className="text-center text-slate-400 py-16">
                                         <Users className="h-16 w-16 mx-auto mb-4 opacity-10" />
                                         <p className="font-bold text-xs uppercase tracking-widest">No active bus service subscribers</p>
                                     </TableCell>
                                 </TableRow>
                             )}
                         </TableBody>
                     </Table>
                )}
            </CardContent>
        </Card>
      </div>
          </TabsContent>

          <TabsContent value="manifest" className="mt-0">
            <DailyTransportManifest
              route={selectedRoute || null}
              routes={routes || []}
              students={students || []}
              buses={buses || []}
              drivers={drivers || []}
              schoolId={schoolId || ''}
            />
          </TabsContent>
        </Tabs>
      
      {selectedRoute && (
        <StudentAssignmentDialog 
            route={selectedRoute} 
            allRoutes={routes || []}
            students={students || []}
            onAssignmentChange={refetchRoutes}
            open={assignmentDialogOpen}
            onOpenChange={setAssignmentDialogOpen}
        />
      )}

      {canManage && schoolId && (
        <>
            <BusManagementDialog 
                open={busManagementOpen}
                onOpenChange={setBusManagementOpen}
                onBusChange={refetchBuses}
                schoolId={schoolId}
            />
            <RouteManagementDialog
                open={routeManagementOpen}
                onOpenChange={setRouteManagementOpen}
                onRouteChange={refetchRoutes}
                schoolId={schoolId}
                editingRoute={editingRoute}
            />
        </>
      )}
    </div>
  );
}

