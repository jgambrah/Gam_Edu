'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, 
  Clock, Info, Sparkles, Filter 
} from 'lucide-react';
import { 
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, 
  eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths 
} from 'date-fns';

type CustomCategory = 
  | 'School Opening Dates'
  | 'Holidays'
  | 'Examination Dates'
  | 'PTA Meetings'
  | 'Speech & Prize Giving Day'
  | 'Sports Festivals'
  | 'Excursions'
  | 'Educational Trips'
  | 'General Events';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: any; // Timestamp or Date
  type: string;
  location?: string;
  time?: string;
}

interface StudentCalendarViewProps {
  calendarEvents: CalendarEvent[];
}

const CATEGORY_COLORS: Record<CustomCategory, { badge: string; dot: string }> = {
  'School Opening Dates': { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  'Holidays': { badge: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' },
  'Examination Dates': { badge: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-500' },
  'PTA Meetings': { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', dot: 'bg-indigo-500' },
  'Speech & Prize Giving Day': { badge: 'bg-purple-50 text-purple-700 border-purple-200', dot: 'bg-purple-500' },
  'Sports Festivals': { badge: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  'Excursions': { badge: 'bg-cyan-50 text-cyan-700 border-cyan-200', dot: 'bg-cyan-500' },
  'Educational Trips': { badge: 'bg-teal-50 text-teal-700 border-teal-200', dot: 'bg-teal-500' },
  'General Events': { badge: 'bg-slate-100 text-slate-700 border-slate-200', dot: 'bg-slate-400' }
};

export default function StudentCalendarView({ calendarEvents = [] }: StudentCalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<CustomCategory | 'All'>('All');

  // Helper to classify an event title/type into the 8 requested categories
  const getEventCategory = (title: string = '', description: string = '', type: string = ''): CustomCategory => {
    const t = title.toLowerCase();
    const d = description.toLowerCase();
    const cat = type.toLowerCase();

    if (t.includes('open') || t.includes('reopen') || t.includes('opening') || t.includes('resume')) {
      return 'School Opening Dates';
    }
    if (cat === 'holiday' || t.includes('holiday') || t.includes('vacation') || t.includes('independence') || t.includes('break') || t.includes('christmas') || t.includes('easter')) {
      return 'Holidays';
    }
    if (t.includes('exam') || t.includes('bece') || t.includes('test') || t.includes('assess') || t.includes('mid-term') || t.includes('end-of-term')) {
      return 'Examination Dates';
    }
    if (t.includes('pta') || t.includes('parent') || t.includes('teachers association')) {
      return 'PTA Meetings';
    }
    if (t.includes('speech') || t.includes('prize') || t.includes('giving') || t.includes('graduation') || t.includes('awards')) {
      return 'Speech & Prize Giving Day';
    }
    if (cat === 'sports' || t.includes('sport') || t.includes('match') || t.includes('football') || t.includes('athletics') || t.includes('games') || t.includes('inter-house')) {
      return 'Sports Festivals';
    }
    if (t.includes('excursion') || t.includes('picnic')) {
      return 'Excursions';
    }
    if (t.includes('trip') || t.includes('tour') || t.includes('visit') || t.includes('educational')) {
      return 'Educational Trips';
    }
    return 'General Events';
  };

  // Convert raw events to mapped events with their classified category
  const classifiedEvents = useMemo(() => {
    return calendarEvents.map(ev => {
      const dateObj = ev.date?.toDate ? ev.date.toDate() : new Date(ev.date);
      return {
        ...ev,
        dateObj,
        customCategory: getEventCategory(ev.title, ev.description || '', ev.type)
      };
    });
  }, [calendarEvents]);

  // Generate monthly grid days
  const daysInGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [currentMonth]);

  // Navigation handlers
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const jumpToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  // Get active events for the selected date
  const selectedDayEvents = useMemo(() => {
    return classifiedEvents.filter(e => isSameDay(e.dateObj, selectedDate));
  }, [classifiedEvents, selectedDate]);

  // Get events list for current month view, filtered by selected category
  const filteredMonthEvents = useMemo(() => {
    return classifiedEvents.filter(e => {
      const matchMonth = isSameMonth(e.dateObj, currentMonth);
      const matchCat = selectedCategoryFilter === 'All' || e.customCategory === selectedCategoryFilter;
      return matchMonth && matchCat;
    });
  }, [classifiedEvents, currentMonth, selectedCategoryFilter]);

  return (
    <Card className="rounded-[2.2rem] border border-slate-100 shadow-md bg-white overflow-hidden">
      <CardHeader className="bg-slate-50/50 p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-100 rounded-xl text-indigo-755">
            <CalendarIcon className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight italic">School Calendar & Events</CardTitle>
            <CardDescription className="text-slate-400">Track terms, exam schedules, holidays, PTA meetings, trips, and festivals.</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 md:p-8 space-y-6">
        {/* Category Filters Roster */}
        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Filter className="h-3 w-3" /> Filter Mapped Calendars
          </span>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategoryFilter('All')}
              className={cn(
                "h-8 rounded-xl text-[10px] font-bold uppercase transition-all duration-200 border-slate-200",
                selectedCategoryFilter === 'All' ? "bg-indigo-600 text-white border-indigo-600" : "bg-white hover:bg-slate-55"
              )}
            >
              All Events
            </Button>
            {(Object.keys(CATEGORY_COLORS) as CustomCategory[]).map(cat => (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategoryFilter(cat)}
                className={cn(
                  "h-8 rounded-xl text-[10px] font-bold uppercase transition-all duration-200 border-slate-205/60",
                  selectedCategoryFilter === cat ? "bg-indigo-600 text-white border-indigo-650" : "bg-slate-50/50 hover:bg-slate-100"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full mr-1.5", CATEGORY_COLORS[cat].dot)} />
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Grid split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Calendar monthly view */}
          <Card className="lg:col-span-2 border border-slate-100 shadow-xs rounded-2xl overflow-hidden bg-white">
            <div className="flex items-center justify-between p-4 bg-slate-50 border-b">
              <h3 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
                {format(currentMonth, 'MMMM yyyy')}
              </h3>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={prevMonth}><ChevronLeft className="h-4 w-4"/></Button>
                <Button variant="outline" size="sm" className="h-8 px-3 text-[10px] font-bold uppercase" onClick={jumpToToday}>Today</Button>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={nextMonth}><ChevronRight className="h-4 w-4"/></Button>
              </div>
            </div>
            
            <div className="p-4">
              {/* Weekdays Row */}
              <div className="grid grid-cols-7 text-center mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-[9px] font-black text-slate-400 uppercase tracking-widest py-1.5">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {daysInGrid.map((day, idx) => {
                  const isToday = isSameDay(day, new Date());
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  
                  // Mapped events for this day
                  const dayEvents = classifiedEvents.filter(e => isSameDay(e.dateObj, day));

                  return (
                    <div 
                      key={idx}
                      onClick={() => setSelectedDate(day)}
                      className={cn(
                        "min-h-[85px] p-1.5 border rounded-xl cursor-pointer transition-all flex flex-col justify-between group",
                        !isCurrentMonth ? "bg-slate-50/50 text-slate-400 border-slate-100" : "bg-white border-slate-100",
                        isSelected ? "ring-2 ring-indigo-500 z-10 border-transparent shadow-sm" : "hover:border-indigo-300",
                        isToday ? "bg-indigo-50/40 text-indigo-750 font-bold border-indigo-200" : ""
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[11px] font-semibold">{format(day, 'd')}</span>
                        {isToday && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />}
                      </div>

                      {/* Display event dots on day card */}
                      <div className="space-y-0.5 mt-2">
                        {dayEvents.slice(0, 2).map(event => (
                          <div 
                            key={event.id}
                            className={cn(
                              "text-[8px] truncate px-1 py-0.5 rounded font-black uppercase tracking-wide border-0 border-l-2",
                              CATEGORY_COLORS[event.customCategory].badge,
                              `border-l-${CATEGORY_COLORS[event.customCategory].dot.split('-')[1]}-500`
                            )}
                          >
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-[7.5px] text-slate-450 font-bold uppercase tracking-wider pl-1">
                            + {dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Right sidebar: Selected day event panel */}
          <div className="space-y-6">
            <Card className="border border-slate-100 shadow-xs rounded-2xl overflow-hidden bg-white flex flex-col h-[400px]">
              <CardHeader className="bg-slate-50/50 p-4 border-b">
                <CardTitle className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-2">
                  <div className="bg-indigo-100 p-2 rounded-lg text-indigo-650 shrink-0">
                    <span className="text-sm font-black">{format(selectedDate, 'd')}</span>
                  </div>
                  <div className="flex flex-col">
                    <span>{format(selectedDate, 'EEEE')}</span>
                    <span className="text-[9px] text-slate-450 font-bold tracking-widest">{format(selectedDate, 'MMMM yyyy')}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[310px] p-4">
                  {selectedDayEvents.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                      <Info className="h-10 w-10 mx-auto mb-2 opacity-20"/>
                      <p className="text-[10px] font-bold uppercase tracking-wider">No events scheduled.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedDayEvents.map(event => (
                        <div key={event.id} className="p-3 border rounded-xl space-y-2 bg-slate-50/30">
                          <Badge className={cn("text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border-0", CATEGORY_COLORS[event.customCategory].badge)}>
                            {event.customCategory}
                          </Badge>
                          <h4 className="font-extrabold text-slate-800 text-xs leading-snug">{event.title}</h4>
                          <div className="space-y-1 text-[10px] text-slate-500 font-medium">
                            {event.time && <div className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {event.time}</div>}
                            {event.location && <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {event.location}</div>}
                          </div>
                          {event.description && (
                            <p className="text-[10.5px] text-slate-450 italic border-t pt-1 leading-snug mt-1">
                              "{event.description}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Upcoming events ledger */}
            <Card className="border border-slate-100 shadow-xs rounded-2xl overflow-hidden bg-white flex flex-col h-[270px]">
              <CardHeader className="bg-slate-50/50 p-4 border-b">
                <CardTitle className="text-xs font-black uppercase text-indigo-700 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 animate-pulse" /> Month Overview ({filteredMonthEvents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[185px] p-4">
                  {filteredMonthEvents.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                      <p className="text-[10px] font-bold uppercase tracking-wider">No events this month.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredMonthEvents.map(event => (
                        <div key={event.id} className="flex items-start justify-between border-b pb-2 gap-2 text-xs">
                          <div className="space-y-0.5">
                            <h4 className="font-extrabold text-slate-800 leading-tight">{event.title}</h4>
                            <p className="text-[9px] text-slate-450 font-bold uppercase">{format(event.dateObj, 'MMM dd')} {event.time ? `| ${event.time}` : ''}</p>
                          </div>
                          <span className={cn("text-[7.5px] font-black uppercase tracking-wider py-0.5 px-2 rounded-md shrink-0 border-0", CATEGORY_COLORS[event.customCategory].badge)}>
                            {event.customCategory.split(' ')[0]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
