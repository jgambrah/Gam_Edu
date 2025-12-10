
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, where, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { format } from 'date-fns';
import LiveRoom from '@/components/dashboard/live-classroom/live-room';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, CalendarIcon, Clock, PlusCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


// Types
import type { Lecture, Class, Student } from '@/lib/types';

// --- Schedule Form Component ---
function ScheduleLectureForm({ open, setOpen, classes }: { open: boolean, setOpen: (o: boolean) => void, classes: Class[] | null }) {
    const firestore = useFirestore();
    const { user } = useUser();
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [title, setTitle] = useState('');
    const [classId, setClassId] = useState('');
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [time, setTime] = useState('09:00');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !classId || !date || !time || !user) {
            toast({ variant: 'destructive', title: 'Missing fields', description: 'Please fill out all required information.' });
            return;
        }

        setIsSubmitting(true);
        try {
            const [hours, minutes] = time.split(':').map(Number);
            const scheduledDateTime = new Date(date);
            scheduledDateTime.setHours(hours, minutes);

            await addDoc(collection(firestore, 'lectures'), {
                title,
                classId,
                scheduledFor: scheduledDateTime,
                teacherId: user.uid,
                teacherName: user.displayName || 'Teacher',
                status: 'scheduled',
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Success', description: 'New live class has been scheduled.' });
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Failed to schedule class.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Schedule a New Live Class</DialogTitle>
                    <DialogDescription>Set up a future live session for one of your classes.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Lecture Title</Label>
                        <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Chapter 5 Review" required />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select onValueChange={setClassId} value={classId}>
                            <SelectTrigger><SelectValue placeholder="Select a class" /></SelectTrigger>
                            <SelectContent>{classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                             <Popover>
                                <PopoverTrigger asChild>
                                <Button variant={'outline'} className={cn('w-full justify-start text-left font-normal', !date && 'text-muted-foreground')}>
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={date} onSelect={setDate} initialFocus /></PopoverContent>
                            </Popover>
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="time">Time</Label>
                            <Input id="time" type="time" value={time} onChange={e => setTime(e.target.value)} required />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting} className="w-full">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : 'Schedule Class'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}


export default function LiveClassroomLobby() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
    const [isScheduling, setIsScheduling] = useState(false);

    const isTeacher = role === 'Teacher' || role === 'Administrator' || role === 'Director';

    const { data: studentData } = useCollection<Student>(
        useMemoFirebase(() => (role === 'Student' && user) ? query(collection(firestore!, 'students'), where('uid', '==', user.uid)) : null, [role, user, firestore])
    );
    const studentClassId = studentData?.[0]?.classId;
    
    const lecturesQuery = useMemoFirebase(() => {
        if (!user || !firestore) return null; 
        return query(collection(firestore, 'lectures'), orderBy('createdAt', 'desc'));
    }, [firestore, user]);

    const { data: allLectures } = useCollection<Lecture>(lecturesQuery);
    const { data: classes } = useCollection<Class>(useMemoFirebase(() => firestore ? collection(firestore, 'classes') : null, [firestore]));

    const filteredLectures = useMemo(() => {
        if (isTeacher || !allLectures) return allLectures || [];
        return allLectures.filter(l => l.classId === studentClassId);
    }, [allLectures, isTeacher, studentClassId]);

    const liveLectures = filteredLectures.filter(l => l.status === 'live');
    const upcomingLectures = filteredLectures.filter(l => l.status === 'scheduled').sort((a,b) => (a.scheduledFor?.seconds || 0) - (b.scheduledFor?.seconds || 0));

    const handleStartLecture = async (id: string) => {
        if(!firestore) return;
        await updateDoc(doc(firestore, 'lectures', id), { status: 'live' });
        setActiveRoomId(id);
    };

    if (activeRoomId) {
        return <LiveRoom roomId={activeRoomId} isHost={isTeacher} />;
    }

    return (
        <div className="space-y-6 p-6">
            <Card className="bg-slate-900 text-white">
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2"><Video className="text-red-500"/> Live Classroom Lobby</CardTitle>
                        <p className="text-slate-400">Join a live session or see what's scheduled.</p>
                    </div>
                     {isTeacher && (
                        <Button onClick={() => setIsScheduling(true)}>
                            <PlusCircle className="mr-2 h-4 w-4"/> Schedule New Class
                        </Button>
                    )}
                </CardHeader>
            </Card>
            <Tabs defaultValue="live" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="live">Live Now ({liveLectures.length})</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming ({upcomingLectures.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="live" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {liveLectures.length === 0 && <p className="text-muted-foreground col-span-full text-center py-8">No live classes at the moment.</p>}
                        {liveLectures.map(l => (
                            <Card key={l.id} className="border-l-4 border-l-red-500 shadow-sm animate-pulse">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge className="bg-red-100 text-red-700 hover:bg-red-200">LIVE</Badge>
                                        <Badge variant="outline">{classes?.find(c => c.id === l.classId)?.name || 'N/A'}</Badge>
                                    </div>
                                    <CardTitle className="mt-2">{l.title}</CardTitle>
                                    <CardDescription>Host: {l.teacherName}</CardDescription>
                                </CardHeader>
                                <CardFooter>
                                    <Button onClick={() => setActiveRoomId(l.id)} className="w-full bg-red-600 hover:bg-red-700">Join Class</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="upcoming" className="mt-6">
                     <div className="space-y-4">
                        {upcomingLectures.length === 0 && <p className="text-muted-foreground text-center py-8">No classes scheduled.</p>}
                        {upcomingLectures.map(l => (
                            <div key={l.id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                                <div className="flex gap-4 items-center">
                                    <div className="bg-indigo-50 p-3 rounded-lg text-center min-w-[70px]">
                                        <p className="text-xs font-bold text-indigo-600 uppercase">{l.scheduledFor ? format(l.scheduledFor.toDate(), 'MMM') : 'DATE'}</p>
                                        <p className="text-xl font-bold text-slate-800">{l.scheduledFor ? format(l.scheduledFor.toDate(), 'd') : '00'}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{l.title}</h4>
                                        <div className="flex gap-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock className="h-3 w-3"/> {l.scheduledFor ? format(l.scheduledFor.toDate(), 'p') : 'Time'}</span>
                                            <span>•</span>
                                            <span>{classes?.find(c => c.id === l.classId)?.name || 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                                {isTeacher ? (
                                    <Button onClick={() => handleStartLecture(l.id)} size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                        Start Now
                                    </Button>
                                ) : (
                                    <Button disabled variant="secondary" size="sm">Not Started</Button>
                                )}
                            </div>
                        ))}
                     </div>
                </TabsContent>
            </Tabs>
            
            {isTeacher && (
                <ScheduleLectureForm open={isScheduling} setOpen={setIsScheduling} classes={classes || null} />
            )}
        </div>
    );
}
