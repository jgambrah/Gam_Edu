'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Route, Stop, Student, Bus, Class } from '@/lib/types';
import { User, Users, Bus as BusIcon, MapPin, Route as RouteIcon, Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { addDoc, collection, doc, updateDoc, writeBatch, query, where, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StudentDisplay } from '@/components/student-display';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Badge } from '@/components/ui/badge';

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
    return allRoutes?.flatMap(r => r.stops?.flatMap(stop => stop.assignedStudentIds || []) || []) || [];
  }, [allRoutes]);
  
  const availableStudents = useMemo(() => {
    return students.filter(s => s.usesBusService === true && !globallyAssignedIds.includes(s.uid));
  }, [students, globallyAssignedIds]);
  
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
  });

  const onAssignSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setIsSubmitting(true);
    const routeRef = doc(firestore!, 'routes', route.id);
    
    const newStops = route.stops.map(stop => {
        const filteredStudents = stop.assignedStudentIds.filter(id => id !== values.studentId);
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
    const newStops = route.stops.map(stop => ({
        ...stop,
        assignedStudentIds: stop.assignedStudentIds.filter(id => id !== studentId)
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
    return route.stops?.flatMap(stop => 
        stop.assignedStudentIds.map(studentId => ({
            student: students.find(s => s.uid === studentId),
            stop: stop
        }))
    ).filter(item => item.student) || [];
  }, [route, students]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
        <DialogHeader>
            <DialogTitle>Assign Students to Route: {route.name}</DialogTitle>
            <DialogDescription>Manage student assignments for this transport route.</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8 mt-4">
            <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800">New Assignment</h3>
                <Badge variant="secondary">{availableStudents.length} Available</Badge>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onAssignSubmit)} className="space-y-4">
                <FormField control={form.control} name="studentId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select Unassigned Student</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a student..." />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {availableStudents.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-muted-foreground italic">
                                        No unassigned bus subscribers found.
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
                        <FormLabel>Assign to Stop</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
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
                <Button type="submit" disabled={isSubmitting || availableStudents.length === 0} className="w-full h-12 text-lg bg-indigo-600">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <PlusCircle className="mr-2 h-4 w-4"/>}
                    Assign Student
                </Button>
                </form>
            </Form>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-800">Current Assignments</h3>
                    <Badge variant="outline">{assignedInThisRoute.length} Assigned</Badge>
                </div>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {assignedInThisRoute.map(({student, stop}) => (
                        <div key={student?.uid} className="flex justify-between items-center p-3 bg-white border rounded-xl shadow-sm group">
                            <div className="min-w-0">
                                {student && <StudentDisplay student={student} variant="compact" />}
                                <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold uppercase mt-1">
                                    <MapPin className="h-3 w-3"/>
                                    <span>{stop.name}</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleUnassign(student!.uid)}>
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>
                    ))}
                    {assignedInThisRoute.length === 0 && (
                        <div className="text-center py-12 text-slate-400 italic text-sm">
                            No students assigned to this route yet.
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
        defaultValues: { name: '', capacity: 30 }
    });

    const onAddBus = async (values: { name: string; capacity: number }) => {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore!, 'buses'), { ...values, schoolId });
            toast({ title: 'Bus Added' });
            onBusChange();
            form.reset();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Error' });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
         <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manage Buses</DialogTitle>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAddBus)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Bus Name/Number</FormLabel><FormControl><Input {...field} placeholder="e.g., Yellow Eagle" /></FormControl></FormItem>
                        )} />
                        <FormField control={form.control} name="capacity" render={({ field }) => (
                            <FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                        )} />
                        <Button type="submit" disabled={isSubmitting}>Add Bus</Button>
                    </form>
                </Form>
                <div className="mt-4 border-t pt-4">
                     <h4 className="font-semibold mb-2">Existing Buses</h4>
                    {isLoading ? <Loader2 className="animate-spin h-4 w-4"/> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Capacity</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {buses?.map(bus => (
                                    <TableRow key={bus.id}><TableCell>{bus.name}</TableCell><TableCell>{bus.capacity}</TableCell></TableRow>
                                ))}
                            </TableBody>
                        </Table>
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
                    stops: [{ name: '', address: '', order: 1, assignedStudentIds: [] }],
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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{editingRoute ? 'Edit Route' : 'Create New Route'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem className="md:col-span-1"><FormLabel>Route Name</FormLabel><FormControl><Input {...field} placeholder="e.g., North Route" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="dailyRate" render={({ field }) => (
                                <FormItem><FormLabel>Daily Rate (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="15.00" /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="termlyRate" render={({ field }) => (
                                <FormItem><FormLabel>Termly Rate (GH₵)</FormLabel><FormControl><Input type="number" step="0.01" {...field} placeholder="800.00" /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="busId" render={({ field }) => (
                                <FormItem><FormLabel>Assign Bus</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a bus" /></SelectTrigger></FormControl>
                                    <SelectContent>{buses?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="driverId" render={({ field }) => (
                                <FormItem><FormLabel>Assign Driver</FormLabel><Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl><SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger></FormControl>
                                    <SelectContent>{drivers?.map(d => <SelectItem key={d.uid} value={d.uid}>{d.firstName} {d.lastName}</SelectItem>)}</SelectContent>
                                </Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Stops</h4>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-end p-2 border rounded-md bg-slate-50/50">
                                        <FormField control={form.control} name={`stops.${index}.order`} render={({ field }) => (
                                            <FormItem className="w-16"><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`stops.${index}.name`} render={({ field }) => (
                                            <FormItem className="flex-1"><FormLabel>Stop Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`stops.${index}.address`} render={({ field }) => (
                                            <FormItem className="flex-1"><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}/>
                                        <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 h-10 w-10" onClick={() => remove(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', address: '', order: fields.length + 1, assignedStudentIds: [] })} className="mt-4">
                                <PlusCircle className="h-4 w-4 mr-2"/> Add Stop
                            </Button>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-lg">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                            {editingRoute ? 'Save Route Changes' : 'Create Route'}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
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
    return students.filter(s => s.usesBusService === true);
  }, [students]);

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
      <Card>
        <CardHeader><CardTitle>Access Denied</CardTitle></CardHeader>
        <CardContent><p>This module is for transport and administrative staff only.</p></CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold"><RouteIcon className="h-6 w-6 text-indigo-600"/> Transport Management</CardTitle>
              <CardDescription>Manage bus routes, stops, and student assignments.</CardDescription>
            </div>
            {canManage && (
                <div className="flex gap-2 flex-wrap">
                    <Button onClick={() => setAssignmentDialogOpen(true)} disabled={!selectedRoute} className="bg-indigo-600">Assign Students</Button>
                    <Button variant="outline" onClick={() => setBusManagementOpen(true)}>Manage Buses</Button>
                    <Button variant="outline" onClick={() => { setEditingRoute(null); setRouteManagementOpen(true); }}>New Route</Button>
                </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/3">
            <Select onValueChange={setSelectedRouteId}>
              <SelectTrigger><SelectValue placeholder="Select a route to view details..." /></SelectTrigger>
              <SelectContent>{routes?.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading && selectedRouteId && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600"/></div>}

      <div className="grid md:grid-cols-2 gap-6">
        {selectedRoute && !isLoading && (
            <div className="md:col-span-1 space-y-6 animate-in fade-in slide-in-from-left-4">
                <Card>
                <CardHeader className="bg-slate-50 border-b flex flex-row justify-between items-center py-3">
                    <CardTitle className="flex items-center gap-2 text-lg"><BusIcon className="text-indigo-600 h-5 w-5"/> Bus & Driver</CardTitle>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => handleEditRoute(selectedRoute)}><Edit className="h-4 w-4 mr-1"/> Edit</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteRoute(selectedRoute.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50"><Trash2 className="h-4 w-4"/></Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        <p className="flex justify-between border-b pb-2"><strong>Assigned Bus:</strong> <span>{assignedBus?.name || 'N/A'}</span></p>
                        <p className="flex justify-between border-b pb-2"><strong>Capacity:</strong> <span>{assignedBus?.capacity || 'N/A'} seats</span></p>
                        <div className="grid grid-cols-2 gap-4 border-b pb-2">
                            <p><strong>Daily Rate:</strong> <span className="font-bold text-indigo-600">GH₵{selectedRoute.dailyRate?.toFixed(2) || '0.00'}</span></p>
                            <p><strong>Termly Rate:</strong> <span className="font-bold text-emerald-600">GH₵{selectedRoute.termlyRate?.toFixed(2) || '0.00'}</span></p>
                        </div>
                        <p className="flex justify-between"><strong>Driver:</strong> <span>{assignedDriver?.firstName ? `${assignedDriver.firstName} ${assignedDriver.lastName}`: 'N/A'}</span></p>
                    </div>
                </CardContent>
                </Card>
                <Card>
                <CardHeader className="bg-slate-50 border-b"><CardTitle className="flex items-center gap-2 text-lg"><MapPin className="text-indigo-600 h-5 w-5"/> Route Stops & Assignments</CardTitle></CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {selectedRoute.stops?.sort((a,b) => a.order - b.order).map(stop => (
                    <div key={stop.id} className="p-4 border rounded-xl bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="font-bold text-slate-800">{stop.order}. {stop.name}</h4>
                            <Badge variant="secondary">{stop.assignedStudentIds?.length || 0} Students</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-4">{stop.address}</p>
                        <div className="space-y-2 pl-4 border-l-2 border-indigo-100">
                            {stop.assignedStudentIds?.length > 0 ? (
                                stop.assignedStudentIds.map(studentId => {
                                    const student = students?.find(s => s.uid === studentId);
                                    return student ? <div key={studentId} className="flex items-center gap-2 text-sm"><StudentDisplay student={student} variant="compact" /></div> : null;
                                })
                            ) : <p className="text-[10px] text-slate-400 italic">No students assigned to this stop.</p>}
                        </div>
                    </div>
                    ))}
                </CardContent>
                </Card>
            </div>
        )}
        
        <Card className="md:col-span-1 border-t-4 border-t-indigo-500 shadow-sm h-fit">
            <CardHeader className="bg-white">
                <CardTitle className="flex items-center gap-2 text-lg"><Users className="text-indigo-600 h-5 w-5"/> Bus Service Subscribers</CardTitle>
                <CardDescription>Found {subscribedStudents.length} students enrolled in transport.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-600"/></div>
                ) : (
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {subscribedStudents.map(student => {
                                    const isAssigned = routes?.some(r => r.stops?.some(s => s.assignedStudentIds?.includes(student.uid)));
                                    return (
                                        <TableRow key={student.uid}>
                                            <TableCell><StudentDisplay student={student} variant="list" /></TableCell>
                                            <TableCell className="text-xs">{classes?.find(c => c.id === student.classId)?.name || 'N/A'}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1">
                                                    {isAssigned ? (
                                                        <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">Assigned</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 animate-pulse">Waiting</Badge>
                                                    )}
                                                    <span className="text-[9px] font-bold uppercase text-slate-400">{student.transportBillingModel || 'Daily'} Billing</span>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                                {subscribedStudents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-10 italic">No students are currently subscribed to the bus service.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
      
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
