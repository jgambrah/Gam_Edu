'use client';

import { useState, useMemo } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, query, where, orderBy, doc } from 'firebase/firestore';
import { Student } from '@/lib/types';
import { BADGE_CATALOG, calculateStudentLevel, triggerStudentBadgeEvent } from '@/lib/achievement-utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { Trophy, Award, Star, Search, PlusCircle, Printer, Sparkles, Loader2, Landmark, CheckCircle2 } from 'lucide-react';
import { StudentBadgeShowcase } from '@/components/achievements/StudentBadgeShowcase';

export default function AchievementsPage() {
  const { role } = useRole();
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();
  const schoolName = 'GAM EDU ACADEMY';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [awardStudentId, setAwardStudentId] = useState<string>('');
  const [awardBadgeId, setAwardBadgeId] = useState<string>(BADGE_CATALOG[0].id);
  const [isAwardOpen, setIsAwardOpen] = useState(false);
  const [certStudent, setCertStudent] = useState<any | null>(null);

  // Queries
  const classesQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: rawClasses } = useCollection<any>(classesQuery);
  const classes = rawClasses || [];

  const studentsQuery = useMemoFirebase(
    () => (firestore && schoolId ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId)) : null),
    [firestore, schoolId]
  );
  const { data: rawStudents, isLoading: loadingStudents, forceRefetch } = useCollection<Student>(studentsQuery);

  const leaderboardStudents = useMemo(() => {
    if (!rawStudents) return [];
    let filtered = [...rawStudents];

    if (selectedClass !== 'All') {
      filtered = filtered.filter((s: any) => s.classId === selectedClass || s.gradeLevel === selectedClass);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter((s: any) =>
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(q)
      );
    }

    // Sort by Total Points (XP) descending
    return filtered.sort((a: any, b: any) => (Number(b.totalPoints) || 0) - (Number(a.totalPoints) || 0));
  }, [rawStudents, selectedClass, searchTerm]);

  const canManageBadges = ['Administrator', 'Director', 'Teacher'].includes(role || '');

  const handleManualAward = async () => {
    if (!firestore || !awardStudentId || !awardBadgeId) return;
    try {
      await triggerStudentBadgeEvent(firestore, awardStudentId, {
        type: 'MANUAL_TEACHER_AWARD',
        customBadgeId: awardBadgeId
      });
      toast({ title: 'Badge Awarded! 🎉', description: 'Student has been awarded the achievement badge and XP.' });
      forceRefetch();
      setIsAwardOpen(false);
    } catch (err) {
      toast({ variant: 'destructive', title: 'Error', description: 'Could not award badge.' });
    }
  };

  const handlePrintCertificate = (student: any) => {
    setCertStudent(student);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Printable Assembly Certificate View */}
      {certStudent && (
        <div className="hidden print:block fixed inset-0 bg-white p-12 text-center select-none z-50">
          <div className="border-8 border-double border-indigo-900 p-8 h-full flex flex-col justify-between rounded-3xl">
            <div className="space-y-2">
              <Landmark className="h-16 w-16 text-indigo-900 mx-auto" />
              <h1 className="text-3xl font-black uppercase text-indigo-950 tracking-tight">{schoolName || 'GAM EDU ACADEMY'}</h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Official Certificate of Achievement</p>
            </div>

            <div className="space-y-4 my-8">
              <p className="text-sm italic font-serif text-slate-600">This certificate is proudly awarded to</p>
              <h2 className="text-4xl font-black text-indigo-900 border-b-2 border-indigo-900 pb-2 inline-block px-12">
                {certStudent.firstName} {certStudent.lastName}
              </h2>
              <p className="text-sm text-slate-700 max-w-lg mx-auto leading-relaxed">
                For outstanding dedication, academic excellence, and earning <strong>{certStudent.totalPoints || 0} XP Points</strong> in the GAM Edu Gamification League.
              </p>
              <div className="mt-4 flex justify-center gap-2">
                {((certStudent.earnedBadges || []) as any[]).map((b, idx) => (
                  <span key={idx} className="bg-indigo-50 border border-indigo-200 text-indigo-900 font-bold text-xs px-3 py-1 rounded-full">
                    🏆 {b.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-12 border-t border-slate-300 text-center text-xs font-bold text-slate-700">
              <div>
                <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto"></div>
                <p className="mt-2 uppercase tracking-wider">Class Teacher</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-8 max-w-[200px] mx-auto"></div>
                <p className="mt-2 uppercase tracking-wider">School Principal / Director</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Screen Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Trophy className="h-7 w-7 text-amber-400" />
            <h1 className="text-2xl font-black tracking-tight">Gamification & Achievement Hub</h1>
          </div>
          <p className="text-xs text-indigo-200 font-medium">
            Recognize and motivate students with automated badges, XP points, and class leaderboards.
          </p>
        </div>

        {canManageBadges && (
          <Dialog open={isAwardOpen} onOpenChange={setIsAwardOpen}>
            <DialogTrigger asChild>
              <Button className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs h-10 px-5 rounded-xl shadow-lg border-0">
                <Sparkles className="mr-1.5 h-4 w-4" /> Award Custom Badge
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-slate-800">Award Achievement Badge</DialogTitle>
                <DialogDescription>Select a student and choose a digital badge to award.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Student</label>
                  <Select value={awardStudentId} onValueChange={setAwardStudentId}>
                    <SelectTrigger className="bg-white border-slate-200 h-10">
                      <SelectValue placeholder="Choose student..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(rawStudents || []).map((s: any) => (
                        <SelectItem key={s.id || s.uid} value={s.id || s.uid} className="font-semibold text-xs">
                          {s.firstName} {s.lastName} ({s.gradeLevel || 'Student'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Badge</label>
                  <Select value={awardBadgeId} onValueChange={setAwardBadgeId}>
                    <SelectTrigger className="bg-white border-slate-200 h-10">
                      <SelectValue placeholder="Choose badge..." />
                    </SelectTrigger>
                    <SelectContent>
                      {BADGE_CATALOG.map(b => (
                        <SelectItem key={b.id} value={b.id} className="font-bold text-xs">
                          {b.icon} {b.title} (+{b.xpReward} XP)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleManualAward} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 rounded-xl">
                  Award Badge & Credit XP
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Leaderboard Table Card */}
      <Card className="border border-slate-100 shadow-md rounded-2xl overflow-hidden bg-white">
        <CardHeader className="bg-slate-50 border-b border-slate-100 p-5">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-base font-black text-slate-800 flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" /> Student XP Leaderboard
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Rankings updated in real-time based on total earned reward points.
              </CardDescription>
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-9 h-9 text-xs rounded-xl bg-white border-slate-200"
                />
              </div>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="h-9 w-40 bg-white border-slate-200 text-xs font-semibold">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Classes</SelectItem>
                  {classes.map((c: any) => (
                    <SelectItem key={c.id} value={c.id || c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loadingStudents ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-100/50">
                <TableRow>
                  <TableHead className="w-16 text-center font-bold">Rank</TableHead>
                  <TableHead className="font-bold">Student Name</TableHead>
                  <TableHead className="font-bold">Class / Grade</TableHead>
                  <TableHead className="font-bold">Level Title</TableHead>
                  <TableHead className="font-bold">Earned Badges</TableHead>
                  <TableHead className="text-right font-bold">Total Points</TableHead>
                  <TableHead className="text-right pr-6 font-bold">Certificate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardStudents.length > 0 ? (
                  leaderboardStudents.map((student: any, idx) => {
                    const levelInfo = calculateStudentLevel(student.totalPoints || 0);
                    const rank = idx + 1;
                    const badges: any[] = student.earnedBadges || [];

                    return (
                      <TableRow key={student.id || student.uid} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-center font-mono font-black text-sm">
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
                        </TableCell>
                        <TableCell className="font-bold text-slate-800 text-sm">
                          {student.firstName} {student.lastName}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-600">
                          {student.gradeLevel || student.classId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${levelInfo.badgeColor} text-white font-bold text-[10px] px-2.5 py-0.5 rounded-md`}>
                            Lvl {levelInfo.level}: {levelInfo.title}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {badges.slice(0, 4).map((b, bIdx) => (
                              <Badge key={bIdx} variant="secondary" className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                                {b.title}
                              </Badge>
                            ))}
                            {badges.length > 4 && (
                              <span className="text-[10px] font-bold text-slate-400 self-center">+{badges.length - 4} more</span>
                            )}
                            {badges.length === 0 && (
                              <span className="text-[11px] text-slate-400 italic">No badges yet</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-mono font-black text-indigo-700 text-base">
                          {student.totalPoints || 0} XP
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintCertificate(student)}
                            className="h-8 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-100"
                          >
                            <Printer className="h-3.5 w-3.5 mr-1 text-slate-500" /> Certificate
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-medium">
                      No student gamification records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
