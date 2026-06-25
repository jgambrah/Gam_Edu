'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Users, AlertTriangle, AlertCircle, ShieldAlert, Calendar, 
  UserX, CheckCircle2, TrendingUp, Info
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface DisciplineDashboardViewProps {
  students: any[];
  classes: any[];
  behavioralRecords: any[];
}

export function DisciplineDashboardView({
  students = [],
  classes = [],
  behavioralRecords = []
}: DisciplineDashboardViewProps) {
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  // Helper mapping studentId to student object
  const studentMap = useMemo(() => {
    const map = new Map<string, any>();
    students.forEach(s => map.set(s.uid || s.id, s));
    return map;
  }, [students]);

  // Helper mapping classId to class name
  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach(c => map.set(c.id, c.name));
    return map;
  }, [classes]);

  // 1. Process Records & Alerts
  const processedRecords = useMemo(() => {
    return behavioralRecords.map((r: any) => {
      const desc = (r.description || '').toLowerCase();
      const action = (r.actionTaken || '').toLowerCase();
      
      let isBullying = desc.includes('bully') || desc.includes('bullying');
      let isFighting = desc.includes('fight') || desc.includes('fighting') || desc.includes('assault') || desc.includes('physical');
      let isSuspension = action.includes('suspend') || action.includes('suspension') || desc.includes('suspended');
      
      let severity: 'High' | 'Medium' | 'Low' = 'Low';
      if (isBullying || isFighting || isSuspension || desc.includes('theft') || desc.includes('stealing') || desc.includes('vandalism') || desc.includes('weapon')) {
        severity = 'High';
      } else if (desc.includes('insubordination') || desc.includes('disrespect') || desc.includes('cheating') || desc.includes('skip') || desc.includes('truancy')) {
        severity = 'Medium';
      }

      const stud = studentMap.get(r.studentId) || {};
      const className = stud.classId ? (classMap.get(stud.classId) || stud.classId) : 'Unassigned';
      const gender = stud.gender || 'Unknown';

      return {
        ...r,
        studentName: stud.firstName ? `${stud.firstName} ${stud.lastName}`.trim() : (r.studentName || 'Unknown Student'),
        className,
        gender,
        isBullying,
        isFighting,
        isSuspension,
        severity
      };
    }).sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate().getTime() : new Date(a.date).getTime();
      const dateB = b.date?.toDate ? b.date.toDate().getTime() : new Date(b.date).getTime();
      return dateB - dateA;
    });
  }, [behavioralRecords, studentMap, classMap]);

  // 2. Calculate Real-Time Alerts Counts
  const disciplineAlerts = useMemo(() => {
    let bullyingCount = 0;
    let fightingCount = 0;
    let suspensionCount = 0;

    processedRecords.forEach(r => {
      if (r.isBullying) bullyingCount++;
      if (r.isFighting) fightingCount++;
      if (r.isSuspension) suspensionCount++;
    });

    // Repeated Offenders: Count infractions per student
    const offenderCounts: Record<string, { count: number; name: string; class: string }> = {};
    processedRecords.forEach(r => {
      if (r.incidentType === 'Infraction' || r.incidentType === 'Disciplinary Action' || r.severity === 'High') {
        const id = r.studentId;
        if (!offenderCounts[id]) {
          offenderCounts[id] = { count: 0, name: r.studentName, class: r.className };
        }
        offenderCounts[id].count++;
      }
    });

    const repeatedOffenders = Object.entries(offenderCounts)
      .map(([id, info]) => ({ id, ...info }))
      .filter(o => o.count >= 2)
      .sort((a, b) => b.count - a.count);

    return {
      bullying: bullyingCount,
      fighting: fightingCount,
      suspensions: suspensionCount,
      repeatedCount: repeatedOffenders.length,
      repeatedList: repeatedOffenders
    };
  }, [processedRecords]);

  // 3. Trend Analysis: Incidents by Class
  const classTrendData = useMemo(() => {
    const counts: Record<string, number> = {};
    processedRecords.forEach(r => {
      if (r.incidentType === 'Infraction' || r.incidentType === 'Disciplinary Action') {
        counts[r.className] = (counts[r.className] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [processedRecords]);

  // 4. Trend Analysis: Incidents by Term (Chronological group)
  const termTrendData = useMemo(() => {
    const monthlyCounts: Record<string, number> = {};
    processedRecords.forEach(r => {
      if (r.incidentType === 'Infraction' || r.incidentType === 'Disciplinary Action') {
        const date = r.date?.toDate ? r.date.toDate() : new Date(r.date);
        if (!isNaN(date.getTime())) {
          const monthLabel = format(date, 'MMM yy');
          monthlyCounts[monthLabel] = (monthlyCounts[monthLabel] || 0) + 1;
        }
      }
    });

    // Make sure we have labels sorted chronologically or return mock if empty
    const labels = Object.keys(monthlyCounts);
    if (labels.length === 0) {
      const today = new Date();
      return [
        { term: 'Jan 26', incidents: 2 },
        { term: 'Feb 26', incidents: 5 },
        { term: 'Mar 26', incidents: 3 },
        { term: 'Apr 26', incidents: 6 },
        { term: 'May 26', incidents: 4 },
        { term: 'Jun 26', incidents: 2 }
      ];
    }

    return labels.map(label => ({
      term: label,
      incidents: monthlyCounts[label]
    }));
  }, [processedRecords]);

  // 5. Trend Analysis: Gender Analysis (Student Population Demographics)
  const genderData = useMemo(() => {
    let male = 0;
    let female = 0;
    let other = 0;

    students.forEach((s: any) => {
      const g = (s.gender || '').toLowerCase().trim();
      if (g === 'male' || g === 'm') male++;
      else if (g === 'female' || g === 'f') female++;
      else other++;
    });

    if (male === 0 && female === 0) {
      return [
        { name: 'Male', value: 65, fill: '#6366f1' },
        { name: 'Female', value: 35, fill: '#ec4899' }
      ];
    }

    const data = [
      { name: 'Male', value: male, fill: '#6366f1' },
      { name: 'Female', value: female, fill: '#ec4899' }
    ];

    if (other > 0) {
      data.push({ name: 'Other', value: other, fill: '#64748b' });
    }

    return data.filter(d => d.value > 0);
  }, [students]);

  // Filters records list by severity selection
  const filteredRecordsList = useMemo(() => {
    return processedRecords.filter(r => {
      if (filterSeverity === 'all') return true;
      return r.severity.toLowerCase() === filterSeverity;
    });
  }, [processedRecords, filterSeverity]);

  // Severity badge style
  const getSeverityBadge = (sev: 'High' | 'Medium' | 'Low') => {
    if (sev === 'High') {
      return (
        <Badge className="bg-rose-100 text-rose-805 border-none font-black text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Critical / High
        </Badge>
      );
    } else if (sev === 'Medium') {
      return (
        <Badge className="bg-amber-100 text-amber-850 border-none font-black text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Moderate
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-slate-100 text-slate-700 border-none font-black text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider">
          Minor
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. REAL-TIME ALERTS DECK */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Bullying Alert */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Bullying Incidents</p>
              <h4 className="text-2xl font-black text-slate-800 mt-2">{disciplineAlerts.bullying} Cases</h4>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Harassment tracker</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
              <UserX className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Fighting Cases */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Fighting / Assault</p>
              <h4 className="text-2xl font-black text-slate-800 mt-2">{disciplineAlerts.fighting} Cases</h4>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Physical infractions</p>
            </div>
            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl group-hover:scale-110 transition-transform">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Suspensions */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Suspensions</p>
              <h4 className="text-2xl font-black text-slate-850 mt-2">{disciplineAlerts.suspensions} Count</h4>
              <p className="text-[9px] font-bold text-rose-650 mt-1 uppercase">Out of school orders</p>
            </div>
            <div className="p-3 bg-slate-150 text-slate-700 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Repeated Offenders */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Repeated Offenders</p>
              <h4 className="text-2xl font-black text-slate-800 mt-2">{disciplineAlerts.repeatedCount} Students</h4>
              <p className="text-[9px] font-bold text-amber-600 mt-1 uppercase">≥ 2 logged infractions</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* 2. REPEATED OFFENDERS LIST (If any exist) */}
      {disciplineAlerts.repeatedList.length > 0 && (
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-rose-500" /> Critical Alert: Repeated Offenders
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {disciplineAlerts.repeatedList.slice(0, 4).map(offender => (
              <div key={offender.id} className="p-5 bg-rose-50/30 border border-rose-100/50 rounded-2xl hover:scale-[1.02] transition-transform duration-300 flex justify-between items-start">
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{offender.name}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{offender.class}</p>
                </div>
                <Badge className="bg-rose-100 text-rose-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
                  {offender.count} Violations
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. TREND ANALYSIS CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Incidents by Class BarChart */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-indigo-650" /> Incidents by Class
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Class streams mapped to overall behavioral infractions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[220px] w-full">
              {classTrendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={classTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Tooltip formatter={(value: number) => [`${value} cases`, 'Infractions']} />
                    <Bar dataKey="value" fill="#818cf8" radius={[8, 8, 0, 0]} maxBarSize={30}>
                      {classTrendData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a78bfa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-slate-400 italic text-xs uppercase tracking-widest font-black">All classes in perfect standing</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Incidents by Term AreaChart */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-650" /> Timeline / Term Trends
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Monthly tracking of behavioral infractions over time
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={termTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorIncidents" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="term" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                  <Tooltip formatter={(value: number) => [`${value} cases`, 'Incidents']} />
                  <Area type="monotone" dataKey="incidents" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorIncidents)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender analysis PieChart */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 flex flex-col justify-between hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-600" /> Gender Demographics
            </h3>
            <div className="h-[150px] w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} Students`, 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t mt-4">
            {genderData.map((g) => {
              const totalVal = genderData.reduce((sum, item) => sum + item.value, 0) || 1;
              const percent = Math.round((g.value / totalVal) * 100);
              const colorDot = g.name === 'Male' ? 'bg-indigo-650' : g.name === 'Female' ? 'bg-pink-500' : 'bg-slate-500';
              
              return (
                <div key={g.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", colorDot)} />
                    <span className="font-bold text-slate-700">{g.name}</span>
                  </div>
                  <span className="font-bold font-mono text-slate-900">{g.value} Students ({percent}%)</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 4. DETAILED INCIDENT DIRECTORY */}
      <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-slate-50/50 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-rose-500" /> Behavioral Incident Directory
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Active tracking feed of discipline events and disciplinary actions
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {(['all', 'high', 'medium', 'low'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  filterSeverity === sev 
                    ? "bg-rose-600 text-white shadow-sm" 
                    : "bg-slate-50 text-slate-400 hover:text-slate-700"
                )}
              >
                {sev} severity
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Student Offender</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Class Stream</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Incident Details</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Action Logged</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Incident Date</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12 text-right">Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecordsList.length > 0 ? (
                  filteredRecordsList.map((r: any, idx: number) => {
                    const dateStr = r.date?.toDate
                      ? format(r.date.toDate(), 'PPP p')
                      : r.date
                      ? format(new Date(r.date), 'PPP p')
                      : 'N/A';

                    return (
                      <TableRow key={r.id || idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="font-black text-xs text-slate-700 py-4">{r.studentName}</TableCell>
                        <TableCell className="font-bold text-xs text-slate-500 py-4 uppercase">{r.className}</TableCell>
                        <TableCell className="py-4 max-w-sm">
                          <div className="space-y-1">
                            <span className="font-black text-xs text-rose-600 block uppercase tracking-tight">{r.incidentType}</span>
                            <span className="text-xs text-slate-500 font-semibold leading-relaxed block">{r.description}</span>
                          </div>
                        </TableCell>
                        <TableCell className="py-4">
                          {r.actionTaken ? (
                            <Badge variant="outline" className="text-[9px] font-black uppercase text-amber-600 border-amber-250 bg-amber-50/30">
                              {r.actionTaken}
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No action logged</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-400 py-4">{dateStr}</TableCell>
                        <TableCell className="text-right py-4">{getSeverityBadge(r.severity)}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-slate-450 italic text-xs uppercase tracking-widest font-black">
                      No incident reports found matching criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
