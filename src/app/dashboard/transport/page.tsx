
'use client';

import { useState, useMemo } from 'react';
import { useRole } from '@/context/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { MOCK_BUSES, MOCK_ROUTES, MOCK_STUDENTS_FOR_TRANSPORT } from '@/lib/data';
import { Route, Stop, Student } from '@/lib/types';
import { User, Users, Bus as BusIcon, MapPin, Route as RouteIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';

// --- Student Assignment Dialog ---

const assignmentSchema = z.object({
  studentId: z.string().min(1, 'Please select a student.'),
  stopId: z.string().min(1, 'Please select a stop.'),
});

function StudentAssignmentDialog({ route, onAssignmentChange }: { route: Route; onAssignmentChange: () => void }) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter students who are not assigned to any stop in *this specific route*
  const assignedStudentIdsInRoute = useMemo(() => {
    return route.stops.flatMap(stop => stop.assignedStudentIds);
  }, [route]);
  
  const unassignedStudents = MOCK_STUDENTS_FOR_TRANSPORT.filter(s => !assignedStudentIdsInRoute.includes(s.uid));
  
  const form = useForm<z.infer<typeof assignmentSchema>>({
    resolver: zodResolver(assignmentSchema),
  });

  const assignStudentToStop = (studentId: string, stopId: string) => {
    const routeIndex = MOCK_ROUTES.findIndex(r => r.id === route.id);
    if (routeIndex === -1) return;

    // Remove from any previous stop in this route
    MOCK_ROUTES[routeIndex].stops.forEach(stop => {
        const studentIndex = stop.assignedStudentIds.indexOf(studentId);
        if (studentIndex > -1) {
            stop.assignedStudentIds.splice(studentIndex, 1);
        }
    });

    // Add to the new stop
    const stopIndex = MOCK_ROUTES[routeIndex].stops.findIndex(s => s.id === stopId);
    if (stopIndex > -1) {
        MOCK_ROUTES[routeIndex].stops[stopIndex].assignedStudentIds.push(studentId);
    }
  };
  
  const unassignStudentFromRoute = (studentId: string) => {
     const routeIndex = MOCK_ROUTES.findIndex(r => r.id === route.id);
     if (routeIndex === -1) return;

     MOCK_ROUTES[routeIndex].stops.forEach(stop => {
        const studentIndex = stop.assignedStudentIds.indexOf(studentId);
        if (studentIndex > -1) {
            stop.assignedStudentIds.splice(studentIndex, 1);
        }
    });
  };

  async function onAssignSubmit(values: z.infer<typeof assignmentSchema>) {
    setIsSubmitting(true);
    assignStudentToStop(values.studentId, values.stopId);
    toast({ title: 'Student Assigned', description: 'The student has been assigned to the stop.' });
    onAssignmentChange();
    form.reset();
    setIsSubmitting(false);
  }

  function handleUnassign(studentId: string) {
    unassignStudentFromRoute(studentId);
    toast({ title: 'Student Unassigned', description: 'The student has been removed from this route.' });
    onAssignmentChange();
  }

  const assignedStudents = route.stops.flatMap(stop => 
    stop.assignedStudentIds.map(studentId => ({
        student: MOCK_STUDENTS_FOR_TRANSPORT.find(s => s.uid === studentId),
        stop: stop
    }))
  ).filter(item => item.student);


  return (
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
                <FormItem><FormLabel>Assign to Stop</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a stop" /></SelectTrigger></FormControl><SelectContent>{route.stops.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
              )} />
              <Button type="submit" disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Assign</Button>
            </form>
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
  );
}


// --- Main Page ---

export default function TransportPage() {
  const { role } = useRole();
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [assignmentDialogOpen, setAssignmentDialogOpen] = useState(false);
  // This state is used to force re-renders when mock data changes
  const [dataVersion, setDataVersion] = useState(0);

  const canAccess = ['Administrator', 'Director', 'Transport Staff'].includes(role);

  const selectedRoute = useMemo(() => {
    return MOCK_ROUTES.find(r => r.id === selectedRouteId);
  }, [selectedRouteId, dataVersion]);

  const assignedBus = useMemo(() => {
    if (!selectedRoute) return null;
    return MOCK_BUSES.find(b => b.id === selectedRoute.busId);
  }, [selectedRoute]);

  const assignedDriver = useMemo(() => {
    if(!selectedRoute) return null;
    // In a real app, you'd fetch from staff where role is 'Transport Staff'
    const drivers = [{uid: 'driver-01', name: 'John Doe'}, {uid: 'driver-02', name: 'Jane Smith'}];
    return drivers.find(d => d.uid === selectedRoute.driverId);
  }, [selectedRoute]);

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
            <div className="flex gap-2">
                 <Dialog open={assignmentDialogOpen} onOpenChange={setAssignmentDialogOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={!selectedRoute}>Assign Students</Button>
                    </DialogTrigger>
                    {selectedRoute && <StudentAssignmentDialog route={selectedRoute} onAssignmentChange={() => setDataVersion(v => v + 1)} />}
                </Dialog>
                <Button variant="outline">Manage Buses</Button>
                <Button variant="outline">Manage Routes</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full md:w-1/3">
            <Select onValueChange={setSelectedRouteId}>
              <SelectTrigger><SelectValue placeholder="Select a route to view details..." /></SelectTrigger>
              <SelectContent>{MOCK_ROUTES.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {selectedRoute && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><BusIcon /> Bus & Driver</CardTitle></CardHeader>
              <CardContent>
                <p><strong>Bus:</strong> {assignedBus?.name || 'N/A'}</p>
                <p><strong>Capacity:</strong> {assignedBus?.capacity || 'N/A'}</p>
                <p><strong>Driver:</strong> {assignedDriver?.name || 'N/A'}</p>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin/> Route Stops & Assignments</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {selectedRoute.stops.sort((a,b) => a.order - b.order).map(stop => (
                  <div key={stop.id} className="p-4 border rounded-md">
                    <h4 className="font-semibold">{stop.order}. {stop.name}</h4>
                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                    <div className="mt-2 pl-4">
                        {stop.assignedStudentIds.length > 0 ? (
                            stop.assignedStudentIds.map(studentId => {
                                const student = MOCK_STUDENTS_FOR_TRANSPORT.find(s => s.uid === studentId);
                                return <div key={studentId} className="flex items-center gap-2 text-sm"><User className="h-4 w-4"/>{student ? `${student.firstName} ${student.lastName}` : 'Unknown Student'}</div>
                            })
                        ) : <p className="text-xs text-muted-foreground italic">No students assigned to this stop.</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
