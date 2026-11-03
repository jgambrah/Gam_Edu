'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCollection, useFirestore, useMemoFirebase, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { collection, doc, query, where, getDocs, writeBatch, serverTimestamp, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, PlusCircle, GraduationCap, Download, Search, RotateCcw, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Student, editAlumniSchema, AlumniDetails } from '@/lib/types';
import { Checkbox } from '@/components/ui/checkbox';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { TimelineService } from '@/lib/timeline-service';
import { downloadXlsx } from '@/lib/xlsx-lite';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

/**
 * Alumni: pupils whose enrollmentStatus is "Graduated".
 * Reads only the school's graduates (it used to read every pupil of the school and keep them live); the
 * pupils of a class are read only when someone opens "Graduate pupils" and picks that class.
 */

const yearOfAlumnus = (a: any): number | null => {
  if (a.graduationYear) return Number(a.graduationYear) || null;
  const t = a.graduatedAt?.toDate?.() || (a.graduatedAt?.seconds ? new Date(a.graduatedAt.seconds * 1000) : null);
  return t ? t.getFullYear() : null;
};

// ─── Graduate pupils (a whole class, or some of them) ─────────────────────────
function GraduatePupilsDialog({ open, setOpen, classes, schoolId }: { open: boolean; setOpen: (v: boolean) => void; classes: any[]; schoolId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [classId, setClassId] = useState('');
  const [pupils, setPupils] = useState<any[] | null>(null);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [busy, setBusy] = useState(false);
  const [loadingPupils, setLoadingPupils] = useState(false);

  useEffect(() => { if (!open) { setClassId(''); setPupils(null); setPicked(new Set()); } }, [open]);

  useEffect(() => {
    if (!firestore || !classId) return;
    setLoadingPupils(true);
    getDocs(query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('classId', '==', classId)))
      .then(snap => {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
          .filter(s => (!s.enrollmentStatus || s.enrollmentStatus === 'Active') && s.isArchived !== true)
          .sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));
        setPupils(list);
        setPicked(new Set(list.map(s => s.id)));
      })
      .catch(err => toast({ variant: 'destructive', title: 'Could not load the class', description: err.message }))
      .finally(() => setLoadingPupils(false));
  }, [firestore, classId, schoolId, toast]);

  const className = classes.find(c => c.id === classId)?.name || '';

  const graduate = async () => {
    if (!firestore || !pupils) return;
    const list = pupils.filter(p => picked.has(p.id));
    if (!list.length) return;
    setBusy(true);
    try {
      // Up to 200 pupils per batch (each pupil = record update + timeline entry).
      for (let i = 0; i < list.length; i += 200) {
        const batch = writeBatch(firestore);
        list.slice(i, i + 200).forEach(p => {
          batch.update(doc(firestore, 'students', p.id), {
            enrollmentStatus: 'Graduated',
            graduationYear: year,
            graduatedAt: serverTimestamp(),
            previousClassId: classId,
            graduatedFromClassName: className,
            classId: '',
            updatedAt: serverTimestamp(),
          });
          TimelineService.logEventBatch(firestore, batch, {
            studentId: p.id, title: 'Graduation 🎓', description: `Graduated from ${className} (${year}).`,
            category: 'graduation', classId, className, schoolId,
            recordedBy: user?.displayName || 'Alumni page', recordedById: user?.uid || 'system',
            academicYear: '', term: '', date: new Date(),
          } as any);
        });
        await batch.commit();
      }
      toast({ title: 'Graduated', description: `${list.length} pupil${list.length === 1 ? '' : 's'} from ${className} moved to the alumni list.` });
      setOpen(false);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Not saved', description: err?.message || 'Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-3xl max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-black">Graduate pupils</DialogTitle>
          <DialogDescription className="text-xs">
            Pick the final-year class; everyone is ticked — untick anyone who is staying. (At the end of the year the
            Class Promotion page does the same for the top class.)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Class</p>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a class" /></SelectTrigger>
                <SelectContent>
                  {[...classes].sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true })).map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Year</p>
              <Input type="number" value={year} onChange={e => setYear(Number(e.target.value) || new Date().getFullYear())} className="rounded-xl" />
            </div>
          </div>
          {loadingPupils && <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-amber-600" /></div>}
          {pupils && !loadingPupils && (
            pupils.length === 0 ? <p className="text-xs text-slate-500 font-semibold">No active pupils in this class.</p> : (
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>{picked.size} of {pupils.length} will graduate</span>
                  <button onClick={() => setPicked(picked.size === pupils.length ? new Set() : new Set(pupils.map(p => p.id)))} className="text-amber-700">
                    {picked.size === pupils.length ? 'Untick all' : 'Tick all'}
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
                  {pupils.map(p => (
                    <label key={p.id} className="flex items-center gap-2.5 p-2 rounded-xl border border-slate-100 cursor-pointer">
                      <Checkbox checked={picked.has(p.id)} onCheckedChange={() => setPicked(prev => { const n = new Set(prev); n.has(p.id) ? n.delete(p.id) : n.add(p.id); return n; })} />
                      <span className="text-xs font-bold text-slate-800">{p.lastName}, {p.firstName}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{p.studentId || ''}</span>
                    </label>
                  ))}
                </div>
              </div>
            )
          )}
          <p className="text-[11px] text-slate-500">Graduated pupils stop appearing in classes, registers and new bills. Any balance they still owe stays on their account.</p>
          <Button onClick={graduate} disabled={busy || !pupils || picked.size === 0} className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black">
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
            Graduate {picked.size || ''} pupil{picked.size === 1 ? '' : 's'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit an alumnus ───────────────────────────────────────────────────────────
function EditAlumniDetailsForm({ onDone, alumnus }: { onDone: () => void; alumnus: any }) {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const d = alumnus.alumniDetails || {};
  const form = useForm<AlumniDetails>({
    resolver: zodResolver(editAlumniSchema),
    defaultValues: {
      currentOccupation: d.currentOccupation || '', employer: d.employer || '', mentorshipWillingness: !!d.mentorshipWillingness,
      phone: d.phone || alumnus.guardianPhone || '', personalEmail: d.personalEmail || '', furtherStudies: d.furtherStudies || '', location: d.location || '',
    },
  });

  async function onSubmit(values: AlumniDetails) {
    if (!firestore) return;
    setIsSubmitting(true);
    try {
      // Saved and confirmed (it used to say "updated" before the save had happened, even if it failed).
      await updateDoc(doc(firestore, 'students', alumnus.id || alumnus.uid), { alumniDetails: values, updatedAt: serverTimestamp() });
      toast({ title: 'Saved', description: `${alumnus.firstName} ${alumnus.lastName}` });
      onDone();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Not saved', description: error?.message || 'Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  const field = (name: keyof AlumniDetails, label: string, placeholder: string) => (
    <FormField control={form.control} name={name} render={({ field: f }) => (
      <FormItem className="space-y-1">
        <FormLabel className="text-[10px] font-black uppercase text-slate-400 tracking-wider">{label}</FormLabel>
        <FormControl><Input placeholder={placeholder} {...(f as any)} value={(f.value as any) ?? ''} className="rounded-xl" /></FormControl>
      </FormItem>
    )} />
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-2">
        <div className="grid grid-cols-2 gap-3">
          {field('phone', 'Phone', '024…')}
          {field('personalEmail', 'Personal email', 'name@gmail.com')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field('furtherStudies', 'School / university now', 'e.g. Achimota SHS')}
          {field('location', 'Lives in', 'e.g. Kumasi')}
        </div>
        <div className="grid grid-cols-2 gap-3">
          {field('currentOccupation', 'Occupation', 'e.g. Nurse')}
          {field('employer', 'Employer', 'e.g. KATH')}
        </div>
        <FormField control={form.control} name="mentorshipWillingness" render={({ field: f }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-3 bg-slate-50">
            <FormControl><Checkbox checked={!!f.value} onCheckedChange={f.onChange} /></FormControl>
            <FormLabel className="text-sm font-bold text-slate-700">Willing to mentor current pupils</FormLabel>
          </FormItem>
        )} />
        <Button type="submit" disabled={isSubmitting} className="w-full h-11 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black">
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Save
        </Button>
      </form>
    </Form>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function AlumniPage() {
  const { role } = useRole();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
  const [graduateOpen, setGraduateOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [restoring, setRestoring] = useState<any | null>(null);
  const [restoreClassId, setRestoreClassId] = useState('');
  const [restoreBusy, setRestoreBusy] = useState(false);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [mentorsOnly, setMentorsOnly] = useState(false);

  const canManage = !!role && ['Administrator', 'Director'].includes(role);

  const alumniQuery = useMemoFirebase(() =>
    (schoolId && firestore && canManage) ? query(collection(firestore, 'students'), where('schoolId', '==', schoolId), where('enrollmentStatus', 'in', ['Graduated', 'Alumni'])) : null,
  [firestore, schoolId, canManage]);
  const { data: alumniDocs, isLoading: loadingAlumni } = useCollection<Student>(alumniQuery);

  const classesQuery = useMemoFirebase(() =>
    (schoolId && firestore && canManage) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null,
  [firestore, schoolId, canManage]);
  const { data: classes } = useCollection<any>(classesQuery);
  const className = (id?: string) => (classes || []).find((c: any) => c.id === id)?.name || '';

  const alumni = useMemo(() => (alumniDocs || []).map((a: any) => ({ ...a, _year: yearOfAlumnus(a) }))
    .sort((a: any, b: any) => (b._year || 0) - (a._year || 0) || `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`)), [alumniDocs]);
  const years = useMemo(() => Array.from(new Set(alumni.map((a: any) => a._year).filter(Boolean))).sort((a: any, b: any) => b - a) as number[], [alumni]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return alumni.filter((a: any) =>
      (yearFilter === 'all' || String(a._year) === yearFilter) &&
      (!mentorsOnly || a.alumniDetails?.mentorshipWillingness) &&
      (!q || `${a.firstName} ${a.lastName} ${a.studentId || ''} ${a.alumniDetails?.currentOccupation || ''} ${a.alumniDetails?.furtherStudies || ''}`.toLowerCase().includes(q)));
  }, [alumni, search, yearFilter, mentorsOnly]);

  const stats = useMemo(() => ({
    total: alumni.length,
    mentors: alumni.filter((a: any) => a.alumniDetails?.mentorshipWillingness).length,
    cohorts: years.length,
    reachable: alumni.filter((a: any) => a.alumniDetails?.phone || a.alumniDetails?.personalEmail || a.guardianPhone).length,
  }), [alumni, years]);

  const exportExcel = () => {
    const rows = filtered.map((a: any, i: number) => [
      i + 1, `${a.firstName} ${a.lastName}`, a.studentId || '', a._year || '', a.graduatedFromClassName || className(a.previousClassId) || '',
      a.alumniDetails?.phone || a.guardianPhone || '', a.alumniDetails?.personalEmail || '', a.alumniDetails?.furtherStudies || '',
      a.alumniDetails?.currentOccupation || '', a.alumniDetails?.employer || '', a.alumniDetails?.location || '',
      a.alumniDetails?.mentorshipWillingness ? 'Yes' : 'No',
    ]);
    downloadXlsx(`Alumni_${format(new Date(), 'yyyy-MM-dd')}.xlsx`, 'Alumni',
      [['No.', 'Name', 'Student ID', 'Graduated', 'From class', 'Phone', 'Personal email', 'School / university now', 'Occupation', 'Employer', 'Lives in', 'Mentor'], ...rows],
      [6, 28, 15, 11, 14, 15, 26, 26, 18, 18, 14, 8]);
  };

  // Undo a graduation (e.g. a pupil graduated by mistake, or repeating the final year).
  const restore = async () => {
    if (!firestore || !restoring || !restoreClassId) return;
    setRestoreBusy(true);
    try {
      await updateDoc(doc(firestore, 'students', restoring.id || restoring.uid), {
        enrollmentStatus: 'Active', classId: restoreClassId, updatedAt: serverTimestamp(),
      });
      toast({ title: 'Back on the active roll', description: `${restoring.firstName} ${restoring.lastName} is in ${className(restoreClassId)} again.` });
      setRestoring(null);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Not saved', description: err?.message || 'Please try again.' });
    } finally {
      setRestoreBusy(false);
    }
  };

  if (!canManage) {
    return (
      <Card className="max-w-md mx-auto rounded-3xl">
        <CardHeader className="text-center">
          <CardTitle className="text-lg font-black">Access restricted</CardTitle>
          <CardDescription>The alumni list is for Administrators and Directors.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const loading = isLoadingSchool || (loadingAlumni && !alumniDocs);

  return (
    <div className="space-y-5 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-amber-600">Graduates</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Alumni</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">Former pupils, where they are now, and who is willing to mentor.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {alumni.length > 0 && (
            <Button variant="outline" onClick={exportExcel} className="rounded-xl text-xs font-bold h-10 text-emerald-700 border-emerald-300">
              <Download className="h-4 w-4 mr-1.5" /> Excel
            </Button>
          )}
          <Button onClick={() => setGraduateOpen(true)} className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl h-10 px-4">
            <PlusCircle className="h-4 w-4 mr-1.5" /> Graduate pupils
          </Button>
        </div>
      </div>

      {/* Figures */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Alumni', value: stats.total, sub: 'graduated pupils' },
          { label: 'Year groups', value: stats.cohorts, sub: years.length ? `${years[years.length - 1]}–${years[0]}` : '—' },
          { label: 'Can be reached', value: stats.reachable, sub: 'have a phone or email' },
          { label: 'Mentors', value: stats.mentors, sub: 'willing to help pupils' },
        ].map(x => (
          <Card key={x.label} className="rounded-2xl border border-slate-100 bg-white"><CardContent className="p-4">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{x.label}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{x.value}</p>
            <p className="text-[10px] font-bold text-slate-500">{x.sub}</p>
          </CardContent></Card>
        ))}
      </div>

      {/* Directory */}
      <Card className="rounded-3xl border border-slate-100 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-5 space-y-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, ID, school or job…" className="pl-9 rounded-xl h-10" />
            </div>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="rounded-xl h-10 md:w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All years</SelectItem>
                {years.map(y => <SelectItem key={y} value={String(y)}>Class of {y}</SelectItem>)}
              </SelectContent>
            </Select>
            <button onClick={() => setMentorsOnly(v => !v)} className={cn("px-3 h-10 rounded-xl border text-xs font-bold", mentorsOnly ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-slate-200 text-slate-500")}>
              Mentors only
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-amber-600" /></div>
          ) : alumni.length === 0 ? (
            <div className="text-center py-14 border border-dashed rounded-2xl bg-slate-50 space-y-2">
              <GraduationCap className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-sm font-black text-slate-700">No alumni yet</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">Pupils appear here when they graduate — from “Graduate pupils” above, or when the top class is moved to “Graduation” on the Class Promotion page.</p>
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-xs font-bold text-slate-400 py-10">No alumni match the search or filters.</p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <Table>
                <TableHeader className="bg-slate-50/60">
                  <TableRow>
                    <TableHead className="text-[10px] font-black uppercase">Name</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Graduated</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Contact</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Now</TableHead>
                    <TableHead className="text-[10px] font-black uppercase">Mentor</TableHead>
                    <TableHead className="text-right text-[10px] font-black uppercase">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((a: any) => {
                    const d = a.alumniDetails || {};
                    const phone = d.phone || a.guardianPhone;
                    const now = [d.furtherStudies, [d.currentOccupation, d.employer && `at ${d.employer}`].filter(Boolean).join(' '), d.location].filter(Boolean);
                    return (
                      <TableRow key={a.id}>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            {a.photoURL ? <img src={a.photoURL} alt="" className="h-9 w-9 rounded-full object-cover" /> : (
                              <div className="h-9 w-9 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-black text-xs">{a.firstName?.[0]}{a.lastName?.[0]}</div>
                            )}
                            <div>
                              <p className="text-sm font-bold text-slate-800 leading-tight">{a.firstName} {a.lastName}</p>
                              <p className="text-[10px] text-slate-400 font-semibold">{a.studentId || a.admissionNo || '—'}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs">
                          <p className="font-black text-slate-800">{a._year || '—'}</p>
                          <p className="text-[10px] text-slate-500">{a.graduatedFromClassName || className(a.previousClassId) || ''}</p>
                        </TableCell>
                        <TableCell className="py-3 text-xs">
                          {phone ? <a href={`tel:${phone}`} className="block font-semibold text-slate-700">{phone}{!d.phone ? <span className="text-[9px] text-slate-400"> (guardian)</span> : null}</a> : null}
                          {d.personalEmail ? <a href={`mailto:${d.personalEmail}`} className="block text-amber-700 font-semibold">{d.personalEmail}</a> : null}
                          {!phone && !d.personalEmail ? <span className="text-slate-400">No contact yet</span> : null}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-slate-700">
                          {now.length ? now.map((t, i) => <p key={i} className={i === 0 ? "font-semibold" : "text-[11px] text-slate-500"}>{t}</p>) : <span className="text-slate-400">Not recorded</span>}
                        </TableCell>
                        <TableCell className="py-3">
                          {d.mentorshipWillingness ? <Badge className="border-none bg-emerald-50 text-emerald-700 text-[10px] font-black">Mentor</Badge> : <span className="text-[11px] text-slate-400">—</span>}
                        </TableCell>
                        <TableCell className="py-3 text-right whitespace-nowrap">
                          <Button variant="outline" size="sm" onClick={() => setEditing(a)} className="h-8 rounded-lg text-xs font-bold mr-1.5"><Pencil className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => { setRestoring(a); setRestoreClassId(a.previousClassId || ''); }} className="h-8 rounded-lg text-xs font-bold text-slate-500" title="Undo graduation">
                            <RotateCcw className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {schoolId && <GraduatePupilsDialog open={graduateOpen} setOpen={setGraduateOpen} classes={classes || []} schoolId={schoolId} />}

      {editing && (
        <Dialog open onOpenChange={o => !o && setEditing(null)}>
          <DialogContent className="rounded-3xl max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-black">{editing.firstName} {editing.lastName}</DialogTitle>
              <DialogDescription className="text-xs">Contact details and what they are doing now.</DialogDescription>
            </DialogHeader>
            <EditAlumniDetailsForm alumnus={editing} onDone={() => setEditing(null)} />
          </DialogContent>
        </Dialog>
      )}

      {restoring && (
        <Dialog open onOpenChange={o => !o && setRestoring(null)}>
          <DialogContent className="rounded-3xl max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-black">Undo graduation?</DialogTitle>
              <DialogDescription className="text-xs">
                {restoring.firstName} {restoring.lastName} goes back on the active roll in the class you choose (registers, billing and classes).
              </DialogDescription>
            </DialogHeader>
            <Select value={restoreClassId} onValueChange={setRestoreClassId}>
              <SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a class" /></SelectTrigger>
              <SelectContent>
                {[...(classes || [])].sort((a: any, b: any) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true })).map((c: any) => (
                  <SelectItem key={c.id} value={c.id}>{c.name}{c.id === restoring.previousClassId ? ' (graduated from)' : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={restore} disabled={!restoreClassId || restoreBusy} className="w-full rounded-xl font-black">
              {restoreBusy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RotateCcw className="mr-2 h-4 w-4" />} Put back on the active roll
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
