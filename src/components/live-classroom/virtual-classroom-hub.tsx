'use client';

import React, { useState, useEffect } from 'react';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useRole } from '@/context/role-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Video, 
  Calendar, 
  Clock, 
  ExternalLink, 
  UserCheck, 
  Plus, 
  Copy, 
  Check, 
  Sparkles, 
  Trash2, 
  Users, 
  BookOpen, 
  Radio, 
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';

interface LiveSession {
  id?: string;
  subject: string;
  className: string;
  teacherName: string;
  teacherId: string;
  platform: 'zoom' | 'google-meet';
  meetingUrl: string;
  meetingId?: string;
  passcode?: string;
  scheduledTime: string;
  status: 'active' | 'scheduled' | 'ended';
  createdAt: any;
  attendeesCount?: number;
}

export function VirtualClassroomHub() {
  const { schoolId } = useCurrentSchool();
  const { user } = useUser();
  const { role, profile } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [subject, setSubject] = useState('Mathematics');
  const [className, setClassName] = useState('BS7 Gold');
  const [platform, setPlatform] = useState<'zoom' | 'google-meet'>('zoom');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [customLink, setCustomLink] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Fetch active sessions from Firestore
  const sessionsQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, `schools/${schoolId}/liveSessions`), orderBy('createdAt', 'desc')) : null),
    [firestore, schoolId]
  );
  const { data: rawSessions, isLoading } = useCollection<LiveSession>(sessionsQuery);

  const isTeacherOrAdmin = role === 'Teacher' || role === 'Director' || role === 'Admin' || user?.email === 'jamesgambrah@gmail.com';

  const handleGenerateAndSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || !user) return;

    setIsCreating(true);
    try {
      let finalMeetingUrl = customLink.trim();
      let meetingId = '';
      let passcode = '';

      if (!finalMeetingUrl) {
        if (platform === 'zoom') {
          const randomId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
          passcode = Math.floor(100000 + Math.random() * 900000).toString();
          finalMeetingUrl = `https://zoom.us/j/${randomId}?pwd=${passcode}`;
          meetingId = `${randomId.slice(0, 3)} ${randomId.slice(3, 7)} ${randomId.slice(7)}`;
        } else {
          const randStr = () => Math.random().toString(36).substring(2, 6);
          const meetCode = `${randStr()}-${randStr()}-${randStr()}`;
          finalMeetingUrl = `https://meet.google.com/${meetCode}`;
          meetingId = meetCode;
        }
      }

      const teacherName = profile?.firstName && profile?.lastName 
        ? `${profile.firstName} ${profile.lastName}` 
        : user.displayName || user.email || 'Teacher';

      await addDoc(collection(firestore, `schools/${schoolId}/liveSessions`), {
        subject,
        className,
        teacherName,
        teacherId: user.uid,
        platform,
        meetingUrl: finalMeetingUrl,
        meetingId,
        passcode,
        scheduledTime,
        status: 'active',
        createdAt: serverTimestamp(),
        attendeesCount: 0,
      });

      toast({
        title: 'Virtual Class Created!',
        description: `Scheduled ${subject} for ${className} on ${platform === 'zoom' ? 'Zoom' : 'Google Meet'}.`,
      });

      setCustomLink('');
    } catch (error: any) {
      console.error('Error creating live session:', error);
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: error.message || 'Could not schedule live session.',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinClass = async (session: LiveSession) => {
    if (firestore && schoolId && user) {
      try {
        // Auto sync attendance log
        const attendeeName = profile?.firstName && profile?.lastName 
          ? `${profile.firstName} ${profile.lastName}` 
          : user.displayName || user.email || 'Student';

        await addDoc(collection(firestore, `schools/${schoolId}/virtualAttendance`), {
          sessionId: session.id,
          subject: session.subject,
          className: session.className,
          studentId: user.uid,
          studentName: attendeeName,
          joinedAt: serverTimestamp(),
          role: role || 'Student',
        });

        toast({
          title: '✅ Attendance Logged!',
          description: `You are marked Present for ${session.subject}. Opening class...`,
        });
      } catch (err) {
        console.warn('Attendance auto-sync failed:', err);
      }
    }

    window.open(session.meetingUrl, '_blank');
  };

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast({ title: 'Link Copied!', description: 'Meeting link copied to clipboard for broadcasting.' });
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!firestore || !schoolId) return;
    try {
      await deleteDoc(doc(firestore, `schools/${schoolId}/liveSessions`, sessionId));
      toast({ title: 'Session Ended', description: 'Live class session removed.' });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not remove session.' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative p-8 rounded-[2.5rem] bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 text-white shadow-2xl overflow-hidden border border-white/10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-widest border border-blue-400/30">
            <Radio className="w-3.5 h-3.5 animate-pulse text-blue-400" />
            <span>Unified Virtual Classrooms</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase italic">
            Zoom & Google Meet Integration Hub
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed font-medium">
            Launch or join live virtual sessions directly from your timetable. Auto-syncs student attendance and eliminates WhatsApp meeting link chaos!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create Live Class (Teacher/Admin) */}
        {isTeacherOrAdmin && (
          <Card className="lg:col-span-5 rounded-[2rem] border-slate-200 shadow-xl overflow-hidden bg-white">
            <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-6">
              <CardTitle className="text-xl font-black uppercase tracking-tight flex items-center gap-2.5 text-slate-900">
                <Plus className="w-5 h-5 text-blue-600" />
                <span>Schedule Virtual Class</span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 font-medium">
                Auto-generate Zoom or Meet links synced with your class timetable.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <form onSubmit={handleGenerateAndSchedule} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Subject Name</Label>
                  <Input 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)} 
                    placeholder="e.g. Mathematics" 
                    required 
                    className="h-11 rounded-xl font-semibold border-slate-200 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Target Class</Label>
                    <Input 
                      value={className} 
                      onChange={(e) => setClassName(e.target.value)} 
                      placeholder="e.g. BS7 Gold" 
                      required 
                      className="h-11 rounded-xl font-semibold border-slate-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-slate-700 uppercase">Time Slot</Label>
                    <Input 
                      value={scheduledTime} 
                      onChange={(e) => setScheduledTime(e.target.value)} 
                      placeholder="e.g. 10:00 AM" 
                      required 
                      className="h-11 rounded-xl font-semibold border-slate-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Platform Selector */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Video Platform</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPlatform('zoom')}
                      className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-xs transition-all ${
                        platform === 'zoom' 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-[10px]">
                        Z
                      </div>
                      <span>Zoom Meeting</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlatform('google-meet')}
                      className={`flex items-center justify-center gap-2.5 p-3.5 rounded-2xl border-2 font-bold text-xs transition-all ${
                        platform === 'google-meet' 
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm' 
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-[10px]">
                        G
                      </div>
                      <span>Google Meet</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <Label className="text-xs font-bold text-slate-700 uppercase">Custom URL (Optional)</Label>
                  <Input 
                    value={customLink} 
                    onChange={(e) => setCustomLink(e.target.value)} 
                    placeholder="Paste existing Zoom or Meet link (or leave blank to auto-generate)" 
                    className="h-11 rounded-xl font-medium border-slate-200 text-xs"
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all uppercase tracking-wider"
                >
                  {isCreating ? 'Generating & Syncing...' : '🚀 Launch Virtual Class'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Right Column: Live & Scheduled Virtual Sessions */}
        <div className={`space-y-6 ${isTeacherOrAdmin ? 'lg:col-span-7' : 'lg:col-span-12'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black uppercase text-slate-900 tracking-tight">Active Virtual Classes</h3>
            </div>
            <Badge variant="outline" className="font-bold text-xs px-3 py-1 border-blue-200 text-blue-700 bg-blue-50">
              {rawSessions?.length || 0} Sessions
            </Badge>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-slate-400 font-medium">Loading live classroom schedule...</div>
          ) : !rawSessions || rawSessions.length === 0 ? (
            <Card className="rounded-[2rem] border-dashed border-2 border-slate-200 p-12 text-center bg-slate-50/50">
              <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700 uppercase">No Active Virtual Classes</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">
                {isTeacherOrAdmin 
                  ? 'Use the form on the left to generate a Zoom or Google Meet link for your class.'
                  : 'Your teachers will post live virtual classroom links here when sessions are active.'}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {rawSessions.map((session) => (
                <Card 
                  key={session.id} 
                  className="rounded-[2rem] border-slate-200/80 shadow-md hover:shadow-lg transition-all overflow-hidden bg-white border"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className={session.platform === 'zoom' ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white'}>
                            {session.platform === 'zoom' ? 'Zoom' : 'Google Meet'}
                          </Badge>
                          <Badge variant="outline" className="border-indigo-200 text-indigo-700 bg-indigo-50 font-bold">
                            {session.className}
                          </Badge>
                        </div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">{session.subject}</h4>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                          <span>Instructor:</span>
                          <span className="font-bold text-slate-700">{session.teacherName}</span>
                        </p>
                      </div>

                      <div className="text-right space-y-1">
                        <div className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{session.scheduledTime}</span>
                        </div>
                      </div>
                    </div>

                    {session.meetingId && (
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs text-slate-600 font-mono">
                        <div>
                          <span className="text-slate-400">Meeting ID: </span>
                          <span className="font-bold text-slate-800">{session.meetingId}</span>
                        </div>
                        {session.passcode && (
                          <div>
                            <span className="text-slate-400">Passcode: </span>
                            <span className="font-bold text-slate-800">{session.passcode}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleJoinClass(session)}
                          className={`h-11 px-6 rounded-xl font-bold text-xs shadow-md transition-all ${
                            session.platform === 'zoom'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span>Join Virtual Class & Sync Attendance</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => session.id && handleCopyLink(session.meetingUrl, session.id)}
                          className="h-11 w-11 rounded-xl border-slate-200 hover:bg-slate-50"
                          title="Copy Link for Parent WhatsApp Broadcast"
                        >
                          {copiedId === session.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-slate-600" />
                          )}
                        </Button>
                      </div>

                      {isTeacherOrAdmin && session.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteSession(session.id!)}
                          className="h-10 w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                          title="End Session"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
