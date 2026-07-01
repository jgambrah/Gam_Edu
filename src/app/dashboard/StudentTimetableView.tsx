'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Clock, Calendar, BookOpen, Users, MapPin, 
  Activity, CheckCircle2, ChevronRight, AlertCircle, Sparkles, School, Award
} from 'lucide-react';
import { format } from 'date-fns';

interface StudentTimetableViewProps {
  classTimetable: any[];
  subjectsList: any[];
  staffList: any[];
  roomsList: any[];
  timeSlotsList: any[];
  calendarEvents?: any[];
}

export default function StudentTimetableView({
  classTimetable = [],
  subjectsList = [],
  staffList = [],
  roomsList = [],
  timeSlotsList = [],
  calendarEvents = []
}: StudentTimetableViewProps) {
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'exams' | 'activities'>('daily');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const getSubjectName = (subId: string) => {
    return subjectsList.find(s => s.id === subId)?.name || 'Subject';
  };

  const getTeacherName = (tId: string) => {
    const staff = staffList.find(t => t.uid === tId || t.id === tId);
    return staff ? `${staff.firstName} ${staff.lastName}` : 'TBA';
  };

  const getRoomName = (rId: string) => {
    return roomsList.find(r => r.id === rId)?.name || 'Classroom';
  };

  // 1. Get unique start times for the weekly grid, sorted chronologically
  const uniqueTimePoints = useMemo(() => {
    const lessonSlots = timeSlotsList.filter(ts => ts.type === 'Lesson' || !ts.type);
    return Array.from(new Set(lessonSlots.map(ts => ts.startTime))).sort((a, b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [timeSlotsList]);

  // Find timetable entry for a specific day and period
  const getWeeklyEntry = (day: string, startTime: string) => {
    return classTimetable.find(entry => entry.day === day && entry.startTime === startTime);
  };

  // Resolve today's timeline lessons
  const todayLessons = useMemo(() => {
    const currentDayName = format(new Date(), 'EEEE');
    return classTimetable
      .filter((entry: any) => entry.day === currentDayName)
      .sort((a: any, b: any) => (a.startTime || '').localeCompare(b.startTime || ''));
  }, [classTimetable]);

  // Check if a specific time is currently active
  const getLessonStatus = (startTimeStr: string, endTimeStr: string) => {
    try {
      const now = new Date();
      const currentMin = now.getHours() * 60 + now.getMinutes();

      const parseTimeToMinutes = (timeStr: string) => {
        const parts = timeStr.trim().split(':');
        if (parts.length < 2) return 0;
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
      };

      const startMin = parseTimeToMinutes(startTimeStr);
      const endMin = parseTimeToMinutes(endTimeStr);

      if (currentMin >= startMin && currentMin <= endMin) return 'active';
      if (currentMin > endMin) return 'completed';
      return 'upcoming';
    } catch (e) {
      return 'upcoming';
    }
  };

  // Filter exam dates from calendar
  // Filter exam dates from calendar
  const examEvents = useMemo(() => {
    return calendarEvents.filter(ev => {
      const title = (ev.title || '').toLowerCase();
      const desc = (ev.description || '').toLowerCase();
      const type = (ev.type || '').toLowerCase();
      return type === 'academic' && (title.includes('exam') || title.includes('test') || title.includes('bece') || desc.includes('exam') || desc.includes('assessment'));
    });
  }, [calendarEvents]);

  // Special Activities (Clubs, assemblies, sports events)
  const specialActivities = useMemo(() => {
    return calendarEvents.filter(ev => {
      const title = (ev.title || '').toLowerCase();
      const type = (ev.type || '').toLowerCase();
      return type === 'sports' || type === 'event' || title.includes('club') || title.includes('society') || title.includes('assembly') || title.includes('worship');
    });
  }, [calendarEvents]);

  return (
    <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-755">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight italic">School Timetable & Schedule</CardTitle>
            <CardDescription className="text-slate-400">View daily lessons, weekly grids, mock examination timetables, and campus activities.</CardDescription>
          </div>
        </div>
        
        {/* Sub Navigation tabs */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl w-max border border-slate-200/20 gap-1 shrink-0">
          {(['daily', 'weekly', 'exams', 'activities'] as const).map(tab => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all duration-200",
                activeTab === tab 
                  ? "bg-white text-indigo-700 shadow-xs" 
                  : "text-slate-500 hover:text-indigo-650 hover:bg-white/30"
              )}
            >
              {tab === 'daily' && 'Daily List'}
              {tab === 'weekly' && 'Weekly Grid'}
              {tab === 'exams' && 'Exams Schedule'}
              {tab === 'activities' && 'Special Activities'}
            </Button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8">
        {/* DAILY TIMETABLE */}
        {activeTab === 'daily' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Today's Scheduled Lessons ({todayLessons.length})
              </h3>
              <Badge className="bg-indigo-50 text-indigo-700 font-bold border-0 text-[10px] uppercase">
                {format(new Date(), 'EEEE, MMMM dd')}
              </Badge>
            </div>

            {todayLessons.length > 0 ? (
              <div className="relative pl-6 ml-3 border-l-2 border-slate-100 space-y-6">
                {todayLessons.map((lesson, idx) => {
                  const status = getLessonStatus(lesson.startTime, lesson.endTime);
                  
                  return (
                    <div key={lesson.id || idx} className="relative group">
                      {/* Status Dot */}
                      <div className={cn(
                        "absolute left-[-31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ring-4 transition-colors",
                        status === 'active' ? "bg-amber-500 ring-amber-100 animate-pulse" :
                        status === 'completed' ? "bg-emerald-500 ring-emerald-100" :
                        "bg-slate-300 ring-slate-100"
                      )} />

                      <div className="p-4 border border-slate-100 rounded-2xl bg-slate-50/20 hover:bg-slate-50/50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-indigo-600 tracking-wide uppercase bg-indigo-50 px-2 py-0.5 rounded-md">
                              {lesson.startTime} - {lesson.endTime}
                            </span>
                            {status === 'active' && (
                              <Badge className="bg-amber-50 text-amber-700 text-[8px] font-black border-0 animate-bounce">
                                Active Now
                              </Badge>
                            )}
                            {status === 'completed' && (
                              <Badge className="bg-emerald-50 text-emerald-700 text-[8px] font-black border-0">
                                Completed
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-extrabold text-slate-850 text-sm group-hover:text-indigo-650 transition-colors">
                            {getSubjectName(lesson.subjectId)}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5 text-slate-400" /> {getTeacherName(lesson.teacherId)}
                            </span>
                            <span className="flex items-center gap-1">
                              <School className="h-3.5 w-3.5 text-slate-400" /> Room: {getRoomName(lesson.roomId)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto mb-3 stroke-[1.2]" />
                <p className="text-sm font-black uppercase text-slate-400">No classes scheduled for today! 🎉</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy your day or catch up on revision guides.</p>
              </div>
            )}
          </div>
        )}

        {/* WEEKLY GRID */}
        {activeTab === 'weekly' && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Weekly Class Schedule Grid
            </h3>

            {uniqueTimePoints.length > 0 ? (
              <div className="border rounded-2xl overflow-x-auto bg-white shadow-xs">
                <Table className="min-w-[800px]">
                  <TableHeader>
                    <TableRow className="bg-slate-55 border-b-2">
                      <TableHead className="w-[120px] font-black text-[9px] uppercase tracking-widest text-slate-400">Period</TableHead>
                      {days.map(day => (
                        <TableHead key={day} className="font-black text-[10px] uppercase tracking-widest text-slate-600 text-center border-l">
                          {day}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uniqueTimePoints.map(startTime => {
                      const slotData = timeSlotsList.find(ts => ts.startTime === startTime);
                      const endTime = slotData?.endTime || '';
                      
                      return (
                        <TableRow key={startTime}>
                          <TableCell className="font-bold bg-slate-50/50 py-4 text-center">
                            <div className="text-xs text-slate-900">{startTime}</div>
                            <div className="text-[9px] text-slate-400">{endTime}</div>
                          </TableCell>
                          {days.map(day => {
                            const entry = getWeeklyEntry(day, startTime);
                            if (entry) {
                              return (
                                <TableCell key={day} className="p-1 border-l align-top">
                                  <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 h-full flex flex-col gap-1 min-h-[90px] hover:bg-indigo-50 transition-colors">
                                    <p className="font-black text-xs text-indigo-900 leading-tight line-clamp-2">
                                      {getSubjectName(entry.subjectId)}
                                    </p>
                                    <div className="mt-auto space-y-0.5">
                                      <p className="text-[9px] font-bold text-slate-500 uppercase truncate flex items-center gap-1">
                                        <Users className="h-2.5 w-2.5 opacity-40" /> {getTeacherName(entry.teacherId)}
                                      </p>
                                      <p className="text-[9px] font-bold text-slate-500 uppercase truncate flex items-center gap-1">
                                        <School className="h-2.5 w-2.5 opacity-40" /> {getRoomName(entry.roomId)}
                                      </p>
                                    </div>
                                  </div>
                                </TableCell>
                              );
                            }
                            return <TableCell key={day} className="border-l bg-slate-50/10"></TableCell>;
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3 stroke-[1.2]" />
                <p className="text-sm font-black uppercase text-slate-400">No weekly periods configured yet.</p>
                <p className="text-xs text-slate-400 mt-1">Please ask your administrator to initialize classroom timetables.</p>
              </div>
            )}
          </div>
        )}

        {/* EXAMINATION TIMETABLE */}
        {activeTab === 'exams' && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-rose-700 tracking-wider flex items-center gap-2">
              <Award className="h-4 w-4" /> Examination Timetable & Hall Allocations
            </h3>

            {examEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examEvents.map((exam, idx) => {
                  const date = exam.date?.toDate ? exam.date.toDate() : new Date(exam.date);
                  
                  return (
                    <Card key={idx} className="border border-rose-100 rounded-3xl bg-rose-50/5 shadow-xs relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <div className="absolute top-0 right-0 h-1.5 w-full bg-rose-500" />
                      <CardHeader className="p-5 pb-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 text-rose-800 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 mb-2 w-max">
                          <Clock className="h-3 w-3" /> Exam Session
                        </span>
                        <CardTitle className="text-sm font-black text-slate-800 group-hover:text-rose-700 transition-colors leading-snug">
                          {exam.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-3">
                        <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>{format(date, 'EEEE, MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>{exam.time || '09:00 AM'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <School className="h-4 w-4 text-slate-400" />
                            <span>Hall: <strong className="text-slate-800">{exam.location || 'Assembly Hall'}</strong></span>
                          </div>
                        </div>
                        {exam.description && (
                          <p className="text-[11px] text-slate-400 italic border-t pt-2 mt-2 leading-relaxed">
                            "{exam.description}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3 stroke-[1.2]" />
                <p className="text-sm font-black uppercase text-slate-400">No exams scheduled</p>
                <p className="text-xs text-slate-400 mt-1">There are currently no active mock or BECE exam dates on the calendar.</p>
              </div>
            )}
          </div>
        )}

        {/* SPECIAL ACTIVITIES */}
        {activeTab === 'activities' && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-2">
              <Activity className="h-4 w-4" /> Weekly Assembly, Clubs & Campus Events
            </h3>

            {specialActivities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialActivities.map((act, idx) => {
                  const date = act.date?.toDate ? act.date.toDate() : new Date(act.date);
                  
                  return (
                    <Card key={idx} className="border border-emerald-100 rounded-3xl bg-emerald-50/5 shadow-xs relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
                      <div className="absolute top-0 right-0 h-1.5 w-full bg-emerald-500" />
                      <CardHeader className="p-5 pb-3">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase tracking-wider py-0.5 px-2 mb-2 w-max">
                          <Sparkles className="h-3 w-3" /> Special Activity
                        </span>
                        <CardTitle className="text-sm font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-snug">
                          {act.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 space-y-3">
                        <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span>{format(date, 'EEEE, MMM dd')}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span>{act.time || '03:00 PM'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span>Venue: <strong className="text-slate-800">{act.location || 'Campus'}</strong></span>
                          </div>
                        </div>
                        {act.description && (
                          <p className="text-[11px] text-slate-400 italic border-t pt-2 mt-2 leading-relaxed">
                            "{act.description}"
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl">
                <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-3 stroke-[1.2]" />
                <p className="text-sm font-black uppercase text-slate-400">No special activities scheduled</p>
                <p className="text-xs text-slate-400 mt-1">There are currently no active extracurricular sessions on the calendar.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
