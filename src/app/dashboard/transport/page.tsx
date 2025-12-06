
'use client';

import { useState, useMemo, useCallback } from 'react';
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
import { addDoc, collection, doc, updateDoc, writeBatch, query, where } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// --- Student Assignment Dialog ---

const assignmentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student.'),
  stopId: z.string().min(1, 'Please select a stop.'),
});

function StudentAssignmentDialog({ route, students, open, onOpenChange, onAssignmentChange }: { route: Route; students: Student[], open: boolean; onOpenChange: (open: boolean) => void; onAssignmentChange: () => void; }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const assignedStudentIdsInRoute = useMemo(() => {
    return route.stops?.flatMap(stop => stop.assignedStudentIds) || [];
  }, [route]);
  
  const unassignedStudents = students.filter(s => !assignedStudentIdsInRoute.includes(s.uid));
  
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
  });

  const onAssignSubmit = async (values: z.infer<typeof assignmentSchema>) => {
    setIsSubmitting(true);
    const routeRef = doc(firestore, 'routes', route.id);
    
    // Create a new array of stops with the student added
    const newStops = route.stops.map(stop => {
        // Remove student from any other stop first
        const filteredStudents = stop.assignedStudentIds.filter(id => id !== values.studentId);
        if (stop.id === values.stopId) {
            // Add to the new stop
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
    const routeRef = doc(firestore, 'routes', route.id);
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
  
  const assignedStudents = route.stops?.flatMap(stop => 
    stop.assignedStudentIds.map(studentId => ({
        student: students.find(s => s.uid === studentId),
        stop: stop
    }))
  ).filter(item => item.student) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
        <DialogHeader>
            <DialogTitle>Assign Students to Route: {route.name}</DialogTitle>
            <DialogDescription>Manage student assignments for this transport route.</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-8">
            <div>
            <h3 className="font-semibold mb-4">Assign New Student</h3>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onAssignSubmit)} className="space-y-4">
                <FormField control={form.control} name="studentId" render={({ field }) => (
                    <FormItem><FormLabel>Unassigned Student</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a student" /></SelectTrigger></FormControl><SelectContent>{unassignedStudents.map(s => <SelectItem key={s.uid} value={s.uid}>{s.firstName} {s.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="stopId" render={({ field }) => (
                    <FormItem><FormLabel>Assign to Stop</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a stop" /></SelectTrigger></FormControl><SelectContent>{route.stops?.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Assign</Button>
                </form>
            </Form>
            </div>
            <div>
            <h3 className="font-semibold mb-4">Currently Assigned Students</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
                {assignedStudents.map(({student, stop}) => (
                    <div key={student?.uid} className="flex justify-between items-center p-2 border rounded-md">
                        <div>
                            <p className="font-medium">{student?.firstName} {student?.lastName}</p>
                            <p className="text-sm text-muted-foreground">{stop.name}</p>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleUnassign(student!.uid)}>Unassign</Button>
                    </div>
                ))}
                {assignedStudents.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No students assigned to this route.</p>}
            </div>
            </div>
        </div>
        </DialogContent>
    </Dialog>
  );
}

// --- Bus Management Dialog ---
function BusManagementDialog({ open, onOpenChange, onBusChange }: { open: boolean; onOpenChange: (open: boolean) => void; onBusChange: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: buses, isLoading } = useCollection<Bus>(useMemoFirebase(() => collection(firestore, 'buses'), [firestore]));

    const form = useForm({
        defaultValues: { name: '', capacity: 30 }
    });

    const onAddBus = async (values: { name: string; capacity: number }) => {
        setIsSubmitting(true);
        try {
            await addDocumentNonBlocking(collection(firestore, 'buses'), values);
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
                    {isLoading ? <Loader2 /> : (
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
  stops: z.array(stopSchema).min(1, 'At least one stop is required.'),
});

function RouteManagementDialog({ open, onOpenChange, onRouteChange }: { open: boolean; onOpenChange: (open: boolean) => void; onRouteChange: () => void; }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { data: buses } = useCollection<Bus>(useMemoFirebase(() => collection(firestore, 'buses'), [firestore]));
    const { data: drivers } = useCollection<Student>(useMemoFirebase(() => query(collection(firestore, 'staff'), where('role', '==', 'Transport Staff')), [firestore]));

    const form = useForm<z.infer<typeof routeSchema>>({
        resolver: zodResolver(routeSchema),
        defaultValues: {
            name: '',
            busId: '',
            driverId: '',
            stops: [{ name: '', address: '', order: 1, assignedStudentIds: [] }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "stops"
    });

    const onAddRoute = async (values: z.infer<typeof routeSchema>) => {
        setIsSubmitting(true);
        const stopsWithIds = values.stops.map(stop => ({...stop, id: doc(collection(firestore, 'temp')).id }));
        try {
            await addDocumentNonBlocking(collection(firestore, 'routes'), {...values, stops: stopsWithIds});
            toast({ title: 'Route Created' });
            onRouteChange();
            onOpenChange(false);
        } catch (e) {
             toast({ variant: 'destructive', title: 'Error', description: 'Failed to create route.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Create New Route</DialogTitle></DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onAddRoute)} className="space-y-4">
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem><FormLabel>Route Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Morning Route A - North" /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="busId" render={({ field }) => (
                                <FormItem><FormLabel>Assign Bus</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a bus" /></SelectTrigger></FormControl><SelectContent>{buses?.map(b => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="driverId" render={({ field }) => (
                                <FormItem><FormLabel>Assign Driver</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a driver" /></SelectTrigger></FormControl><SelectContent>{drivers?.map(d => <SelectItem key={d.uid} value={d.uid}>{d.firstName} {d.lastName}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">Stops</h4>
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-2 items-end p-2 border rounded-md">
                                        <FormField control={form.control} name={`stops.${index}.order`} render={({ field }) => (
                                            <FormItem className="w-16"><FormLabel>Order</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`stops.${index}.name`} render={({ field }) => (
                                            <FormItem className="flex-1"><FormLabel>Stop Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}/>
                                        <FormField control={form.control} name={`stops.${index}.address`} render={({ field }) => (
                                            <FormItem className="flex-1"><FormLabel>Address/Location</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                                        )}/>
                                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash2 className="h-4 w-4"/></Button>
                                    </div>
                                ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', address: '', order: fields.length + 1, assignedStudentIds: [] })} className="mt-2">Add Stop</Button>
                        </div>
                        <Button type="submit" disabled={isSubmitting}>Create Route</Button>
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
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  
  // Dialog states
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  const [busManagementOpen, setBusManagementOpen] = useState(false);
  const [routeManagementOpen, setRouteManagementOpen] = useState(false);
  
  const canAccess = ['Administrator', 'Director', 'Transport Staff'].includes(role);
  const canManage = ['Administrator', 'Director'].includes(role);

  // Data fetching
  const { data: routes, forceRefetch: refetchRoutes, isLoading: isLoadingRoutes } = useCollection<Route>(useMemoFirebase(() => collection(firestore, 'routes'), [firestore]));
  const { data: buses, forceRefetch: refetchBuses, isLoading: isLoadingBuses } = useCollection<Bus>(useMemoFirebase(() => collection(firestore, 'buses'), [firestore]));
  const { data: students, forceRefetch: refetchStudents, isLoading: isLoadingStudents } = useCollection<Student>(useMemoFirebase(() => collection(firestore, 'students'), [firestore]));
  const { data: drivers } = useCollection<Student>(useMemoFirebase(() => query(collection(firestore, 'staff'), where('role', '==', 'Transport Staff')), [firestore]));
  const { data: classes, isLoading: isLoadingClasses } = useCollection<Class>(useMemoFirebase(() => collection(firestore, 'classes'), [firestore]));


  const isLoading = isLoadingRoutes || isLoadingBuses || isLoadingStudents || isLoadingClasses;

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

  if (!canAccess) {
    return (
      <Card>
        <CardHeader><CardTitle>Access Denied</CardTitle><CardDescription>This module is for transport and administrative staff only.</CardDescription></CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2"><RouteIcon /> Transport Management</CardTitle>
              <CardDescription>Manage bus routes, stops, and student assignments.</CardDescription>
            </div>
            {canManage && (
                <div className="flex gap-2">
                    <Button onClick={() => setAssignmentDialogOpen(true)} disabled={!selectedRoute}>Assign Students</Button>
                    <Button variant="outline" onClick={() => setBusManagementOpen(true)}>Manage Buses</Button>
                    <Button variant="outline" onClick={() => setRouteManagementOpen(true)}>Manage Routes</Button>
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

      {isLoading && selectedRouteId && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>}

      <div className="grid md:grid-cols-2 gap-6">
        {selectedRoute && !isLoading && (
            <div className="md:col-span-1 space-y-6">
                <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><BusIcon /> Bus & Driver</CardTitle></CardHeader>
                <CardContent>
                    <p><strong>Bus:</strong> {assignedBus?.name || 'N/A'}</p>
                    <p><strong>Capacity:</strong> {assignedBus?.capacity || 'N/A'}</p>
                    <p><strong>Driver:</strong> {assignedDriver?.firstName ? `${assignedDriver.firstName} ${assignedDriver.lastName}`: 'N/A'}</p>
                </CardContent>
                </Card>
                <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><MapPin/> Route Stops & Assignments</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {selectedRoute.stops?.sort((a,b) => a.order - b.order).map(stop => (
                    <div key={stop.id} className="p-4 border rounded-md">
                        <h4 className="font-semibold">{stop.order}. {stop.name}</h4>
                        <p className="text-sm text-muted-foreground">{stop.address}</p>
                        <div className="mt-2 pl-4">
                            {stop.assignedStudentIds?.length > 0 ? (
                                stop.assignedStudentIds.map(studentId => {
                                    const student = students?.find(s => s.uid === studentId);
                                    return <div key={studentId} className="flex items-center gap-2 text-sm"><User className="h-4 w-4"/>{student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}</div>
                                })
                            ) : <p className="text-xs text-muted-foreground italic">No students assigned to this stop.</p>}
                        </div>
                    </div>
                    ))}
                </CardContent>
                </Card>
            </div>
        )}
        
        <Card className="md:col-span-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users/> Subscribed Students</CardTitle>
                <CardDescription>List of all students subscribed to the bus service.</CardDescription>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                     <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto"/></div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Class</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subscribedStudents.map(student => (
                                <TableRow key={student.uid}>
                                    <TableCell>{student.firstName} {student.lastName}</TableCell>
                                    <TableCell>{classes?.find(c => c.id === student.classId)?.name || 'N/A'}</TableCell>
                                </TableRow>
                            ))}
                            {subscribedStudents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={2} className="text-center text-muted-foreground">No students are currently subscribed to the bus service.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
      </div>
      
      {selectedRoute && (
        <StudentAssignmentDialog 
            route={selectedRoute} 
            students={students || []}
            onAssignmentChange={refetchRoutes}
            open={assignmentDialogOpen}
            onOpenChange={setAssignmentDialogOpen}
        />
      )}

      {canManage && (
        <>
            <BusManagementDialog 
                open={busManagementOpen}
                onOpenChange={setBusManagementOpen}
                onBusChange={refetchBuses}
            />
            <RouteManagementDialog
                open={routeManagementOpen}
                onOpenChange={setRouteManagementOpen}
                onRouteChange={refetchRoutes}
            />
        </>
      )}
    </div>
  );
}
