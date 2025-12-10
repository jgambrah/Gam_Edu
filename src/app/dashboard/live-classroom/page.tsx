
'use client';

import { useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, orderBy, where, doc, updateDoc } from 'firebase/firestore';
import { format } from 'date-fns';
import LiveRoom from '@/components/dashboard/live-classroom/live-room';

// UI
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Video, CalendarIcon, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { Lecture, Class, Student } from '@/lib/types';


export default function LiveClassroomLobby() {
    const { user } = useUser();
    const { role } = useRole();
    const firestore = useFirestore();
    const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

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
        </div>
    );
}
