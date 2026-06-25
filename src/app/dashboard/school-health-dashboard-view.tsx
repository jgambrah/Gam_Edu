'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  Heart, ShieldAlert, AlertTriangle, AlertCircle, Calendar, 
  Users, CheckCircle2, TrendingUp, Info, Activity, ClipboardList
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

interface SchoolHealthDashboardViewProps {
  students: any[];
  classes: any[];
  medicalLogs: any[];
}

export function SchoolHealthDashboardView({
  students: rawStudents,
  classes: rawClasses,
  medicalLogs: rawMedicalLogs
}: SchoolHealthDashboardViewProps) {
  const students = rawStudents || [];
  const classes = rawClasses || [];
  const medicalLogs = rawMedicalLogs || [];

  const [filterSevere, setFilterSevere] = useState<'all' | 'severe' | 'normal'>('all');

  // Mapping studentId to student details
  const studentMap = useMemo(() => {
    const map = new Map<string, any>();
    students.forEach(s => map.set(s.uid || s.id, s));
    return map;
  }, [students]);

  // Mapping classId to class name
  const classMap = useMemo(() => {
    const map = new Map<string, string>();
    classes.forEach(c => map.set(c.id, c.name));
    return map;
  }, [classes]);

  // 1. Process medical visits
  const processedLogs = useMemo(() => {
    return medicalLogs.map((log: any) => {
      const stud = studentMap.get(log.studentId) || {};
      const className = stud.classId ? (classMap.get(stud.classId) || stud.classId) : 'Unassigned';
      
      return {
        ...log,
        studentName: stud.firstName ? `${stud.firstName} ${stud.lastName}`.trim() : (log.studentName || 'Unknown Student'),
        className,
        bloodGroup: stud.bloodGroup || stud.medical?.bloodGroup || 'Unknown'
      };
    }).sort((a, b) => {
      const dateA = a.visitDate?.toDate ? a.visitDate.toDate().getTime() : new Date(a.visitDate).getTime();
      const dateB = b.visitDate?.toDate ? b.visitDate.toDate().getTime() : new Date(b.visitDate).getTime();
      return dateB - dateA;
    });
  }, [medicalLogs, studentMap, classMap]);

  // 2. Compute Health metrics
  const healthMetrics = useMemo(() => {
    const totalVisits = processedLogs.length;
    const severeVisits = processedLogs.filter(log => log.isSevereTriage).length;
    
    // Chronic illnesses counts
    const chronicList: any[] = [];
    let chronicCount = 0;
    
    // Medication alerts counts
    const medicationList: any[] = [];
    
    // Categorizing conditions for graph
    const conditionsMap: Record<string, number> = {
      'Asthma': 0,
      'Allergies': 0,
      'ADHD / Autism': 0,
      'Diabetes': 0,
      'Epilepsy': 0,
      'Sickle Cell': 0,
      'Other': 0
    };

    students.forEach((s: any) => {
      const illnesses = (s.chronicIllnesses || s.medical?.conditions || '').trim();
      const allergies = (s.allergies || s.medical?.allergies || '').trim();
      const healthNotes = (s.healthNotes || '').trim();
      const hasChronic = (illnesses && illnesses.toLowerCase() !== 'none') || (allergies && allergies.toLowerCase() !== 'none');
      
      const className = s.classId ? (classMap.get(s.classId) || s.classId) : 'Unassigned';

      if (hasChronic) {
        chronicCount++;
        chronicList.push({
          id: s.uid || s.id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          className,
          conditions: illnesses || 'None',
          allergies: allergies || 'None',
          notes: healthNotes || 'N/A'
        });

        // Parse condition type for distribution
        const lowerIll = illnesses.toLowerCase();
        const lowerAll = allergies.toLowerCase();
        let matched = false;
        
        if (lowerIll.includes('asthma') || lowerIll.includes('inhaler')) {
          conditionsMap['Asthma']++;
          matched = true;
        }
        if (lowerAll.includes('allerg') || lowerAll.length > 3) {
          conditionsMap['Allergies']++;
          matched = true;
        }
        if (lowerIll.includes('adhd') || lowerIll.includes('autism') || lowerIll.includes('add')) {
          conditionsMap['ADHD / Autism']++;
          matched = true;
        }
        if (lowerIll.includes('diabet') || lowerIll.includes('insulin')) {
          conditionsMap['Diabetes']++;
          matched = true;
        }
        if (lowerIll.includes('epilep') || lowerIll.includes('seiz')) {
          conditionsMap['Epilepsy']++;
          matched = true;
        }
        if (lowerIll.includes('sickle') || lowerIll.includes('ss') || lowerIll.includes('sc')) {
          conditionsMap['Sickle Cell']++;
          matched = true;
        }
        if (!matched && illnesses.length > 2) {
          conditionsMap['Other']++;
        }
      }

      // Parse healthNotes / illnesses for medication alerts
      const textForMed = `${illnesses} ${healthNotes}`.toLowerCase();
      const needsMed = textForMed.includes('medication') || textForMed.includes('pill') || 
                       textForMed.includes('tablet') || textForMed.includes('daily dose') || 
                       textForMed.includes('insulin') || textForMed.includes('inhaler') ||
                       textForMed.includes('treatment') || textForMed.includes('med');

      if (needsMed) {
        medicationList.push({
          id: s.uid || s.id,
          name: `${s.firstName || ''} ${s.lastName || ''}`.trim(),
          className,
          guideline: healthNotes || illnesses || 'Daily medical observation required.'
        });
      }
    });

    // Populate graph data for chronic conditions
    const chronicChartData = Object.entries(conditionsMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    // Real immunization status dynamically aggregated from live student profiles
    let fullyImmunized = 0;
    let pendingImmunization = 0;
    let unrecordedImmunization = 0;

    students.forEach((s: any) => {
      const status = s.immunizationStatus;
      if (status === 'Fully Immunized') {
        fullyImmunized++;
      } else if (status === 'Pending / Incomplete') {
        pendingImmunization++;
      } else if (status === 'No History / Missing') {
        unrecordedImmunization++;
      }
    });

    const totalStudents = students.length || 1;
    const immunizationRate = Math.round((fullyImmunized / totalStudents) * 100);

    const immunizationData = [
      { name: 'Fully Immunized', value: fullyImmunized, fill: '#10b981' },
      { name: 'Pending / Incomplete', value: pendingImmunization, fill: '#f59e0b' },
      { name: 'No History / Missing', value: unrecordedImmunization, fill: '#ef4444' }
    ];

    return {
      totalVisits,
      severeVisits,
      chronicCount,
      chronicList,
      chronicChartData,
      medicationCount: medicationList.length,
      medicationList,
      immunizationData,
      immunizationRate
    };
  }, [students, processedLogs, classMap]);

  // 3. Process visits over time
  const visitsTrendData = useMemo(() => {
    const counts: Record<string, number> = {};
    
    processedLogs.forEach(log => {
      const date = log.visitDate?.toDate ? log.visitDate.toDate() : new Date(log.visitDate);
      if (!isNaN(date.getTime())) {
        const key = format(date, 'MMM dd');
        counts[key] = (counts[key] || 0) + 1;
      }
    });

    const keys = Object.keys(counts);
    if (keys.length === 0) {
      return [];
    }

    return keys.map(k => ({
      day: k,
      visits: counts[k]
    }));
  }, [processedLogs]);

  // 4. Disposition Pie Chart Data
  const dispositionData = useMemo(() => {
    const counts: Record<string, number> = {
      'Returned to Dorm': 0,
      'Kept for Observation': 0,
      'Transferred to Hospital': 0
    };

    processedLogs.forEach(log => {
      const disp = log.disposition || 'Returned to Dorm';
      counts[disp] = (counts[disp] || 0) + 1;
    });

    if (processedLogs.length === 0) {
      return [];
    }

    return Object.entries(counts)
      .map(([name, value]) => {
        let fill = '#6366f1';
        if (name === 'Kept for Observation') fill = '#f59e0b';
        else if (name === 'Transferred to Hospital') fill = '#ef4444';
        return { name, value, fill };
      })
      .filter(d => d.value > 0);
  }, [processedLogs]);

  // Filter visit logs list
  const filteredLogsList = useMemo(() => {
    return processedLogs.filter(log => {
      if (filterSevere === 'all') return true;
      if (filterSevere === 'severe') return log.isSevereTriage === true;
      return !log.isSevereTriage;
    });
  }, [processedLogs, filterSevere]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HEALTH METRICS CARDS GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Sick Bay Visits */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Sick Bay Visits</p>
              <h4 className="text-2xl font-black text-slate-800 mt-2">{healthMetrics.totalVisits} Logged</h4>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Infirmary admissions</p>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Students with Chronic Conditions */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Chronic Conditions</p>
              <h4 className="text-2xl font-black text-slate-800 mt-2">{healthMetrics.chronicCount} Students</h4>
              <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Medical registries</p>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Medication Alerts */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Medication Alerts</p>
              <h4 className="text-2xl font-black text-slate-850 mt-2">{healthMetrics.medicationCount} Active</h4>
              <p className="text-[9px] font-bold text-amber-600 mt-1 uppercase">Guidelines / Reminders</p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </Card>

        {/* Immunization Coverage Rate */}
        <Card className="rounded-[2rem] border border-slate-100 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.03)] bg-white p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Immunization Status</p>
              <h4 className="text-2xl font-black text-slate-800 mt-2">{healthMetrics.immunizationRate}%</h4>
              <p className="text-[9px] font-bold text-emerald-600 mt-1 uppercase">Fully vaccinated profile</p>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
        </Card>
      </div>

      {/* 2. CHRONIC OR SEVERE ALERT LOGS (If severe visits exist) */}
      {healthMetrics.severeVisits > 0 && (
        <Card className="rounded-[2.5rem] border border-rose-100 shadow-[0_20px_50px_-12px_rgba(244,63,94,0.05)] bg-rose-50/10 p-8 border-l-4 border-l-rose-500">
          <h3 className="text-sm font-black uppercase tracking-widest text-rose-700 mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-rose-600 animate-pulse" /> Critical Triage Events Active
          </h3>
          <p className="text-xs text-rose-650 font-bold mb-6 uppercase">Instant escalation alerts triggered for administrators:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedLogs.filter(log => log.isSevereTriage).slice(0, 3).map(event => (
              <div key={event.id} className="p-5 bg-white border border-rose-150 rounded-2xl flex flex-col gap-2.5 shadow-sm hover:scale-[1.01] transition-transform duration-300">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight block">{event.studentName}</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase">{event.className}</span>
                  </div>
                  <Badge className="bg-rose-100 text-rose-800 border-none font-black text-[8px] px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                    Severe Event
                  </Badge>
                </div>
                <div className="text-xs font-semibold text-slate-650 border-t pt-2 border-slate-100">
                  Symptoms: <span className="italic">"{event.reportedSymptoms}"</span>
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between items-center mt-2">
                  <span>Staff: {event.treatingStaffName}</span>
                  <span>{event.visitDate?.toDate ? format(event.visitDate.toDate(), 'HH:mm aaa') : 'Just now'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 3. VISUAL TREND ANALYSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sick Bay Visits over Time */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(99,102,241,0.05)] transition-all duration-300">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-rose-500" /> Daily Sick Bay Visits Timeline
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Active daily count logs tracked chronologically
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            {visitsTrendData.length > 0 ? (
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitsTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} fontWeight="bold" axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                      formatter={(value: number) => [`${value} Visits`, 'Infirmary Visit']} 
                    />
                    <Area type="monotone" dataKey="visits" stroke="#ef4444" strokeWidth={2.5} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-center text-slate-450 italic text-xs uppercase tracking-widest font-black">
                No sick bay visits logged in the database
              </div>
            )}
          </CardContent>
        </Card>

        {/* Immunization status pie chart */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 flex flex-col justify-between hover:shadow-[0_30px_60px_-15px_rgba(16,185,129,0.05)] transition-all duration-300">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-emerald-600" /> Immunization Audit
            </h3>
            {healthMetrics.immunizationData.some(d => d.value > 0) ? (
              <div className="h-[180px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={healthMetrics.immunizationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {healthMetrics.immunizationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                      formatter={(value: number) => [`${value} Students`, 'Coverage']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-center text-slate-450 italic text-xs uppercase tracking-widest font-black">
                No immunization records found
              </div>
            )}
          </div>

          <div className="space-y-2 pt-4 border-t mt-4">
            {healthMetrics.immunizationData.map((g) => {
              const totalVal = healthMetrics.immunizationData.reduce((sum, item) => sum + item.value, 0) || 1;
              const percent = Math.round((g.value / totalVal) * 100);
              const colorDot = g.name.includes('Fully') ? 'bg-emerald-500' : g.name.includes('Pending') ? 'bg-amber-500' : 'bg-rose-500';
              
              return (
                <div key={g.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", colorDot)} />
                    <span className="font-bold text-slate-700">{g.name}</span>
                  </div>
                  <span className="font-bold font-mono text-slate-900">{g.value} ({percent}%)</span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* 4. CHRONIC CONDITIONS BAR CHART & DISPOSITION PIE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Chronic Conditions breakdown */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Heart className="h-5 w-5 text-indigo-650" /> Chronic Conditions Directory
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Active student profiles mapped to chronic disease classifications
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[250px] w-full">
              {healthMetrics.chronicCount > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={healthMetrics.chronicChartData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                    <XAxis type="number" stroke="#94a3b8" fontSize={11} fontWeight="bold" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={10} fontWeight="bold" width={100} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                      formatter={(value: number) => [`${value} Students`, 'Total diagnosed']} 
                    />
                    <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={30}>
                      {healthMetrics.chronicChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#a78bfa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center text-slate-400 italic text-xs uppercase tracking-widest font-black py-16">
                  No chronic disease conditions diagnosed inside active registries
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sick Bay Disposition outcomes */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white p-8 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <Activity className="h-4 w-4 text-indigo-650" /> Visit Outcome Disposition
            </h3>
            {dispositionData.length > 0 ? (
              <div className="h-[180px] w-full relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dispositionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={6}
                      dataKey="value"
                    >
                      {dispositionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '1rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}
                      formatter={(value: number) => [`${value} Visits`, 'Outcome']} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[180px] flex items-center justify-center text-center text-slate-450 italic text-xs uppercase tracking-widest font-black">
                No outcomes to analyze
              </div>
            )}
          </div>

          {dispositionData.length > 0 && (
            <div className="space-y-2 pt-4 border-t mt-4">
              {dispositionData.map((g) => {
                const totalVal = dispositionData.reduce((sum, item) => sum + item.value, 0) || 1;
                const percent = Math.round((g.value / totalVal) * 100);
                
                return (
                  <div key={g.name} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", g.name === 'Returned to Dorm' ? 'bg-indigo-600' : g.name === 'Kept for Observation' ? 'bg-amber-500' : 'bg-rose-500')} />
                      <span className="font-bold text-slate-700">{g.name}</span>
                    </div>
                    <span className="font-bold font-mono text-slate-900">{g.value} ({percent}%)</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {/* 5. MEDICATION ALERTS & CHRONIC REGISTER TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Medication Alerts table */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" /> Active Medication Guideline Alert Log
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Active student daily dosing plans and medical requirements
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Student Profile</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Class Stream</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Medication Guidelines / Instructions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthMetrics.medicationList.length > 0 ? (
                    healthMetrics.medicationList.map((m: any, idx: number) => (
                      <TableRow key={m.id || idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="font-black text-xs text-slate-700 py-4">{m.name}</TableCell>
                        <TableCell className="font-bold text-xs text-slate-500 py-4 uppercase">{m.className}</TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-slate-600 italic">
                          "{m.guideline}"
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-slate-450 italic text-xs uppercase tracking-widest font-black">
                        No active medication alerts logged
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Chronic Conditions Patients list */}
        <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50/50 p-8 border-b">
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-650" /> Chronic Patient Roster Index
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Active patient register mapping class groups and diagnosed pathologies
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="overflow-x-auto max-h-[300px] overflow-y-auto pr-1">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-100">
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Patient</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Class</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Condition</TableHead>
                    <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Allergies</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {healthMetrics.chronicList.length > 0 ? (
                    healthMetrics.chronicList.map((c: any, idx: number) => (
                      <TableRow key={c.id || idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="font-black text-xs text-slate-700 py-4">{c.name}</TableCell>
                        <TableCell className="font-bold text-xs text-slate-500 py-4 uppercase">{c.className}</TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-[9px] font-black uppercase text-indigo-600 border-indigo-200 bg-indigo-50/20">
                            {c.conditions}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className="text-[9px] font-black uppercase text-rose-600 border-rose-200 bg-rose-50/20">
                            {c.allergies}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-slate-450 italic text-xs uppercase tracking-widest font-black">
                        No chronic patients registered
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 6. DETAILED SICK BAY VISITS LOG DIRECTORY */}
      <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-slate-50/50 p-8 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
              <Heart className="h-5 w-5 text-rose-500" /> Sick Bay Admission Register
            </CardTitle>
            <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
              Active tracking feed of infirmary visit histories and treatments
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {(['all', 'severe', 'normal'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setFilterSevere(mode)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                  filterSevere === mode 
                    ? "bg-rose-600 text-white shadow-sm" 
                    : "bg-slate-50 text-slate-400 hover:text-slate-700"
                )}
              >
                {mode} triages
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Student Admitted</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Class Stream</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Reported Symptoms</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Treatment Administered</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Disposition</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Treating Staff</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12 text-right">Triage Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogsList.length > 0 ? (
                  filteredLogsList.map((log: any, idx: number) => {
                    const dateStr = log.visitDate?.toDate
                      ? format(log.visitDate.toDate(), 'PPP p')
                      : log.visitDate
                      ? format(new Date(log.visitDate), 'PPP p')
                      : 'N/A';

                    return (
                      <TableRow key={log.id || idx} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                        <TableCell className="py-4">
                          <div className="space-y-1">
                            <span className="font-black text-xs text-slate-700 block">{log.studentName}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">{dateStr}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-xs text-slate-500 py-4 uppercase">{log.className}</TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-slate-650 max-w-xs leading-relaxed">
                          "{log.reportedSymptoms}"
                        </TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-slate-650 max-w-xs leading-relaxed">
                          {log.treatmentAdministered}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge variant="outline" className={cn(
                            "text-[8px] font-black uppercase tracking-wider px-2 py-0.5",
                            log.disposition === 'Returned to Dorm' 
                              ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                              : log.disposition === 'Kept for Observation'
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          )}>
                            {log.disposition}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-500 py-4">{log.treatingStaffName}</TableCell>
                        <TableCell className="text-right py-4">
                          {log.isSevereTriage ? (
                            <Badge className="bg-rose-100 text-rose-800 border-none font-black text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider animate-pulse">
                              Severe
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-100 text-slate-700 border-none font-black text-[8px] px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Normal
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-450 italic text-xs uppercase tracking-widest font-black">
                      No infirmary logs found matching criteria
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
