'use client';

import { useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TimetableEntry, Subject, Room, TimeSlot } from "@/lib/types";
import { Building, UserCircle, Edit2, Coffee, Utensils } from "lucide-react";

type Teacher = { uid: string; firstName: string; lastName: string; };

type TimetableDisplayProps = {
  timetable: TimetableEntry[];
  subjects: Subject[];
  teachers: Teacher[];
  rooms: Room[];
  timeSlots: TimeSlot[];
  onEditEntry?: (entry: TimetableEntry) => void; 
};

export function TimetableDisplay({ timetable, subjects, teachers, rooms, timeSlots, onEditEntry }: TimetableDisplayProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  
  // Get unique start times for the row structure, sorted numerically
  const uniqueTimePoints = useMemo(() => {
    return Array.from(new Set(timeSlots.map(ts => ts.startTime))).sort((a, b) => {
        return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [timeSlots]);

  const getSubjectStyle = (subjectName: string) => {
      const name = subjectName.toLowerCase();
      if (name.includes('math')) return {
          border: 'border-l-blue-600',
          bg: 'bg-blue-50/30 hover:bg-blue-50/60 border-blue-100/50',
          text: 'text-blue-900',
      };
      if (name.includes('sci') || name.includes('physic') || name.includes('chem') || name.includes('biol')) return {
          border: 'border-l-emerald-600',
          bg: 'bg-emerald-50/30 hover:bg-emerald-50/60 border-emerald-100/50',
          text: 'text-emerald-900',
      };
      if (name.includes('english') || name.includes('read') || name.includes('writ') || name.includes('lit') || name.includes('lang')) return {
          border: 'border-l-purple-600',
          bg: 'bg-purple-50/30 hover:bg-purple-50/60 border-purple-100/50',
          text: 'text-purple-900',
      };
      if (name.includes('history') || name.includes('social') || name.includes('geograph') || name.includes('civic')) return {
          border: 'border-l-amber-600',
          bg: 'bg-amber-50/30 hover:bg-amber-50/60 border-amber-100/50',
          text: 'text-amber-900',
      };
      if (name.includes('art') || name.includes('music') || name.includes('creative') || name.includes('draw')) return {
          border: 'border-l-orange-600',
          bg: 'bg-orange-50/30 hover:bg-orange-50/60 border-orange-100/50',
          text: 'text-orange-900',
      };
      if (name.includes('pe') || name.includes('sport') || name.includes('phys') || name.includes('gym')) return {
          border: 'border-l-rose-600',
          bg: 'bg-rose-50/30 hover:bg-rose-50/60 border-rose-100/50',
          text: 'text-rose-900',
      };
      return {
          border: 'border-l-indigo-600',
          bg: 'bg-indigo-50/20 hover:bg-indigo-50/40 border-indigo-100/50',
          text: 'text-indigo-900',
      };
  };

  return (
    <div className="border border-slate-150/80 rounded-3xl overflow-hidden bg-white shadow-md">
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50/50 border-b border-slate-200">
                    <TableHead className="w-[120px] font-black text-[10px] uppercase tracking-widest text-slate-400 text-center py-4">Period</TableHead>
                    {days.map(day => (
                        <TableHead key={day} className="font-black text-[10px] uppercase tracking-widest text-slate-700 text-center border-l border-slate-100 py-4">
                            {day}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {uniqueTimePoints.map(startTime => {
                    const slotsAtTime = timeSlots.filter(ts => ts.startTime === startTime);
                    
                    // Logic: If all slots at this time across all 5 days are the same non-lesson type, render a unified bar.
                    const firstSlot = slotsAtTime[0];
                    const isUnifiedBar = firstSlot && (firstSlot.type === 'Break' || firstSlot.type === 'Lunch' || firstSlot.type === 'Worship') && 
                                       slotsAtTime.length >= 5 && 
                                       slotsAtTime.every(s => s.type === firstSlot.type);

                    return (
                        <TableRow key={startTime} className="border-b border-slate-100 last:border-0 hover:bg-transparent">
                            <TableCell className="font-bold bg-slate-50/30 py-5 text-center border-r border-slate-100/50">
                                <div className="text-sm font-black text-slate-800">{startTime}</div>
                                <div className="text-[9px] text-slate-400 font-extrabold mt-0.5">{firstSlot?.endTime || ''}</div>
                            </TableCell>
                            {isUnifiedBar ? (
                                <TableCell colSpan={5} className="p-2.5 border-l border-slate-100">
                                    <div className="flex items-center justify-center gap-3 h-20 bg-gradient-to-r from-indigo-50/20 via-purple-50/30 to-indigo-50/20 border border-dashed border-indigo-200/40 relative overflow-hidden rounded-2xl">
                                        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />
                                        <div className="relative z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-indigo-50/50 shadow-sm backdrop-blur-sm">
                                            {firstSlot.type === 'Break' ? (
                                                <Coffee className="h-4 w-4 text-amber-500 animate-pulse" />
                                            ) : firstSlot.type === 'Lunch' ? (
                                                <Utensils className="h-4 w-4 text-emerald-500" />
                                            ) : (
                                                <Building className="h-4 w-4 text-indigo-500" />
                                            )}
                                            <span className="font-black text-xs uppercase tracking-[0.25em] text-slate-700">
                                                {firstSlot.label || firstSlot.type.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>
                            ) : (
                                days.map(day => {
                                    const slot = timeSlots.find(ts => ts.day === day && ts.startTime === startTime);
                                    if (!slot) return <TableCell key={day} className="border-l border-slate-100 bg-slate-50/5"></TableCell>;

                                    if (slot.type === 'Break' || slot.type === 'Lunch' || slot.type === 'Worship') {
                                        return (
                                            <TableCell key={day} className="p-2 border-l border-slate-100 align-middle text-center bg-slate-50/20">
                                                <div className="flex flex-col items-center justify-center py-4 rounded-xl border border-slate-150/40 bg-white/60 backdrop-blur-sm shadow-sm gap-1">
                                                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500">
                                                        {slot.type === 'Break' ? <Coffee className="h-3.5 w-3.5 text-amber-500" /> : slot.type === 'Lunch' ? <Utensils className="h-3.5 w-3.5 text-emerald-500" /> : <Building className="h-3.5 w-3.5 text-indigo-550" />}
                                                    </div>
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{slot.type}</span>
                                                </div>
                                            </TableCell>
                                        );
                                    }

                                    const entry = timetable.find(e => e.timeSlotId === slot.id || (e.day === day && e.startTime === startTime));
                                    if (entry) {
                                        const subject = subjects.find(s => s.id === entry.subjectId);
                                        const teacher = teachers.find(t => t.uid === entry.teacherId);
                                        const room = rooms.find(r => r.id === entry.roomId);
                                        const style = getSubjectStyle(subject?.name || '');
                                        
                                        return (
                                            <TableCell key={day} className="p-2 border-l border-slate-100 align-top">
                                                <button 
                                                    onClick={() => onEditEntry?.(entry)}
                                                    className={`w-full text-left p-3.5 rounded-2xl border-2 border-slate-150/40 border-l-4 ${style.border} ${style.bg} h-full flex flex-col gap-2 min-h-[105px] hover:shadow-md transition-all duration-300 group relative overflow-hidden`}
                                                >
                                                    {onEditEntry && (
                                                        <div className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-white/90 border border-slate-200/50 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                                            <Edit2 className="h-3 w-3 text-indigo-650" />
                                                        </div>
                                                    )}
                                                    <p className={`font-black text-xs ${style.text} leading-tight line-clamp-2 pr-5`}>
                                                        {subject?.name || 'N/A'}
                                                    </p>
                                                    <div className="mt-auto space-y-1 pt-1.5 border-t border-slate-100/50">
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase truncate flex items-center gap-1.5">
                                                            <UserCircle className="h-3 w-3 text-slate-400 shrink-0" /> 
                                                            {teacher ? `${teacher.firstName} ${teacher.lastName}` : 'TBA'}
                                                        </p>
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase truncate flex items-center gap-1.5">
                                                            <Building className="h-3 w-3 text-slate-400 shrink-0" /> 
                                                            <span className="truncate">{room?.name || 'TBA'}</span>
                                                        </p>
                                                    </div>
                                                </button>
                                            </TableCell>
                                        );
                                    }
                                    return <TableCell key={day} className="border-l border-slate-100 bg-slate-50/5"></TableCell>;
                                })
                             )}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </div>
  );
}
