'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Download, UserRound, IdCard, Users } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Student, Class } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';
import { Badge } from '@/components/ui/badge';

// Helper to get base64 via proxy to avoid CORS issues with html2canvas
async function getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    try {
        const fetchUrl = imageUrl.startsWith('https://firebasestorage.googleapis.com')
            ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
            : imageUrl;

        const res = await fetch(fetchUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error: any) {
        console.error("❌ getBase64ImageFromUrl failed:", error.message);
        return "";
    }
}

// ── Single ID Card Component (used in both preview & print templates) ──
function IDCard({
    student,
    className,
    schoolProfile,
    logoBase64,
    primaryColor,
    secondaryColor,
    forPrint = false,
}: {
    student: Student;
    className: string;
    schoolProfile: any;
    logoBase64: string;
    primaryColor: string;
    secondaryColor: string;
    forPrint?: boolean;
}) {
    // For print: fixed CR80 card size in mm rendered at 96dpi equivalent.
    // We use px values sized to 86mm × 54mm at ~3.78px/mm ≈ 325px × 204px.
    const cardStyle = forPrint
        ? {
              width: '325px',
              height: '204px',
              minHeight: '204px',
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              border: '1px solid #cbd5e1',
              display: 'flex',
              flexDirection: 'row' as const,
              position: 'relative' as const,
              boxSizing: 'border-box' as const,
          }
        : {};

    const sidebarStyle = forPrint
        ? {
              width: '105px',
              minWidth: '105px',
              display: 'flex',
              flexDirection: 'column' as const,
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 8px',
              textAlign: 'center' as const,
              backgroundColor: primaryColor,
              color: 'white',
              borderRadius: '10px 0 0 10px',
              overflow: 'hidden',
          }
        : {};

    const mainAreaStyle = forPrint
        ? {
              flex: 1,
              display: 'flex',
              flexDirection: 'row' as const,
              alignItems: 'center',
              padding: '14px 14px 18px 14px', 
              gap: '12px',
              minWidth: 0,
          }
        : {};

    const stripStyle = forPrint
        ? {
              position: 'absolute' as const,
              bottom: 0,
              left: '105px',
              right: 0,
              height: '7px',
              backgroundColor: secondaryColor,
              borderRadius: '0 0 10px 0',
          }
        : {};

    if (forPrint) {
        return (
            <div style={cardStyle}>
                {/* Left Branding Sidebar */}
                <div style={sidebarStyle}>
                    {logoBase64 ? (
                        <img
                            src={logoBase64}
                            alt="Logo"
                            style={{ height: '44px', objectFit: 'contain', marginBottom: '6px' }}
                        />
                    ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '6px' }} />
                    )}
                    <p style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '6px', wordBreak: 'break-word' }}>
                        {schoolProfile?.name || 'SCHOOL NAME'}
                    </p>
                    <p style={{ fontSize: '7px', fontWeight: 700, opacity: 0.8, lineHeight: '1.3', wordBreak: 'break-word' }}>
                        {schoolProfile?.address || ''}
                    </p>
                    {schoolProfile?.phone && (
                        <p style={{ fontSize: '7px', fontWeight: 900, letterSpacing: '0.05em', opacity: 0.8, marginTop: '3px' }}>
                            {schoolProfile.phone}
                        </p>
                    )}
                </div>

                {/* Right Main Info Area */}
                <div style={mainAreaStyle}>
                    {/* Photo */}
                    <div style={{
                        width: '80px', height: '80px', minWidth: '80px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '10px',
                        border: '2px solid #e2e8f0',
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {student.photoURL ? (
                            <img
                                src={student.photoURL}
                                crossOrigin="anonymous"
                                alt="Student"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <svg viewBox="0 0 24 24" style={{ width: '36px', height: '36px', color: '#cbd5e1' }} fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                        )}
                    </div>

                    {/* Text Info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', marginBottom: '4px' }}>
                            <p style={{
                                fontSize: '14px', fontWeight: 900,
                                color: '#0f172a', textTransform: 'uppercase',
                                lineHeight: '1.2', letterSpacing: '-0.01em',
                                wordBreak: 'break-word', whiteSpace: 'normal',
                            }}>
                                {student.lastName}
                            </p>
                            <p style={{
                                fontSize: '12px', fontWeight: 700, color: '#475569',
                                lineHeight: '1.3', wordBreak: 'break-word', whiteSpace: 'normal',
                            }}>
                                {student.firstName}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: '7px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                Grade / Class
                            </p>
                            <p style={{ fontSize: '11px', fontWeight: 900, color: '#4f46e5', textTransform: 'uppercase', lineHeight: '1.3', wordBreak: 'break-word' }}>
                                {className}
                            </p>
                        </div>

                        <div>
                            <p style={{ fontSize: '7px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                                Student ID
                            </p>
                            <p style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'monospace', color: '#0f172a' }}>
                                {formatStudentId(student)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom color strip */}
                <div style={stripStyle} />
            </div>
        );
    }

    // ── Preview card (Tailwind-based, scaled up for display) ──
    return (
        <div className="w-[86mm] h-[54mm] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-row relative scale-[1.2] origin-center">
            <div
                className="w-[28mm] flex flex-col items-center justify-center p-3 text-center border-r border-black/5"
                style={{ backgroundColor: primaryColor, color: 'white' }}
            >
                {logoBase64 ? (
                    <img src={logoBase64} alt="Logo" className="h-10 object-contain mb-1" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-white/20 mb-1" />
                )}
                <h2 className="text-[9px] font-black uppercase leading-tight tracking-tighter line-clamp-2">
                    {schoolProfile?.name || 'SCHOOL NAME'}
                </h2>
                <div className="mt-1 space-y-0.5 opacity-80">
                    <p className="text-[6px] font-bold line-clamp-2 px-1">{schoolProfile?.address || 'School Address'}</p>
                    <p className="text-[6px] font-black tracking-widest">{schoolProfile?.phone || ''}</p>
                </div>
            </div>
            <div className="flex-1 flex flex-row items-center p-4 gap-4">
                <div className="w-20 h-20 bg-slate-100 rounded-xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
                    {student.photoURL ? (
                        <img src={student.photoURL} crossOrigin="anonymous" alt="Student" className="w-full h-full object-cover" />
                    ) : (
                        <UserRound className="w-10 h-10 text-slate-200" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="border-b pb-1 mb-1">
                        <h3 className="text-[13px] font-black text-slate-800 uppercase leading-tight">{student.lastName}</h3>
                        <h4 className="text-[12px] font-bold text-slate-600">{student.firstName}</h4>
                    </div>
                    <Badge variant="secondary" className="text-[8px] font-black bg-slate-100 text-slate-500 uppercase px-2 rounded-full">
                        {className}
                    </Badge>
                    <div className="mt-2 flex flex-col">
                        <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Student ID</span>
                        <span className="text-[11px] font-black tracking-widest font-mono text-slate-800">
                            {formatStudentId(student)}
                        </span>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 right-0 left-[28mm] h-1.5" style={{ backgroundColor: secondaryColor }} />
        </div>
    );
}

export default function IDCardGeneratorPage() {
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();

    const [classId, setClassId] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState<string>('all');
    const [isGenerating, setIsGenerating] = useState(false);
    const [logoBase64, setLogoBase64] = useState<string>('');

    // Fetch School Profile
    const schoolProfileRef = useMemoFirebase(
        () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
        [firestore, schoolId]
    );
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    useEffect(() => {
        if (schoolProfile?.logoUrl) {
            getBase64ImageFromUrl(schoolProfile.logoUrl).then(setLogoBase64);
        }
    }, [schoolProfile]);

    // Fetch Classes
    const classesQuery = useMemoFirebase(
        () => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null,
        [firestore, schoolId]
    );
    const { data: classes, isLoading: loadingClasses } = useCollection<Class>(classesQuery);

    // Fetch Students for selected class
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !classId) return null;
        return query(
            collection(firestore, 'students'),
            where('schoolId', '==', schoolId),
            where('classId', '==', classId),
            where('enrollmentStatus', '==', 'Active')
        );
    }, [firestore, schoolId, classId]);
    const { data: allStudents, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

    // Reset student selection when class changes
    useEffect(() => {
        setSelectedStudentId('all');
    }, [classId]);

    // ── MOVED HOOKS ABOVE CONDITIONAL RETURNS ──
    const sortedStudents = useMemo(() =>
        [...(allStudents || [])].sort((a, b) => a.lastName.localeCompare(b.lastName)),
        [allStudents]
    );

    const studentsToExport = useMemo(() => {
        if (!allStudents) return [];
        if (selectedStudentId === 'all') return sortedStudents;
        return sortedStudents.filter(s => (s.id || s.uid) === selectedStudentId);
    }, [allStudents, sortedStudents, selectedStudentId]);

    const previewStudent = useMemo(() => studentsToExport[0] || null, [studentsToExport]);

    const studentChunks = useMemo(() => {
        if (!studentsToExport.length) return [];
        const size = 8;
        const result = [];
        for (let i = 0; i < studentsToExport.length; i += size) {
            result.push(studentsToExport.slice(i, i + size));
        }
        return result;
    }, [studentsToExport]);

    const primaryColor = schoolProfile?.brandColor || schoolProfile?.primaryColor || '#2563eb';
    const secondaryColor = schoolProfile?.secondaryColor || primaryColor;
    const currentClassName = classes?.find(c => c.id === classId)?.name || 'N/A';

    const handleDownloadPDF = async () => {
        if (!studentChunks.length) return;

        setIsGenerating(true);
        toast({ title: "Generating ID Cards...", description: `Preparing ${studentsToExport.length} card(s) for export.` });

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            for (let i = 0; i < studentChunks.length; i++) {
                const pageElement = document.getElementById(`print-page-${i}`);
                if (!pageElement) continue;

                if (i > 0) pdf.addPage();

                pageElement.style.display = 'block';
                await new Promise(res => setTimeout(res, 1000));

                const canvas = await html2canvas(pageElement, {
                    scale: 3,
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: pageElement.offsetWidth,
                    height: pageElement.offsetHeight,
                });

                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                pageElement.style.display = 'none';
            }

            const label = selectedStudentId === 'all'
                ? currentClassName.replace(/\s+/g, '_')
                : `${studentsToExport[0]?.lastName}_${studentsToExport[0]?.firstName}`.replace(/\s+/g, '_');

            pdf.save(`${label}_ID_Cards.pdf`);
            toast({ title: "Success!", description: `Exported ${studentsToExport.length} ID card(s) successfully.` });
        } catch (error: any) {
            console.error("PDF Export Error:", error);
            toast({
                variant: 'destructive',
                title: "Export Failed",
                description: "An error occurred during PDF rendering.",
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoadingSchool) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-indigo-600 tracking-tight flex items-center gap-2 italic uppercase">
                    <IdCard className="h-8 w-8" /> ID Card Generator
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                    Generate printable identification cards — entire class or individual students
                </p>
            </div>

            {/* ── Controls Card ── */}
            <Card className="border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] print:hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Select Population</CardTitle>
                    <CardDescription>Choose a class, then optionally narrow down to a single student.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
                    {/* Class Selector */}
                    <div className="space-y-2 flex-1 min-w-[180px] max-w-sm">
                        <Label className="text-[10px] font-black uppercase text-slate-400">Target Class</Label>
                        <Select value={classId} onValueChange={setClassId}>
                            <SelectTrigger className="h-12 border-2 rounded-xl bg-slate-50">
                                <SelectValue placeholder="Select Class" />
                            </SelectTrigger>
                            <SelectContent>
                                {classes?.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Student Selector — only shown once a class is chosen */}
                    {classId && !loadingStudents && sortedStudents.length > 0 && (
                        <div className="space-y-2 flex-1 min-w-[200px] max-w-sm">
                            <Label className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1">
                                <Users className="h-3 w-3" /> Student (optional)
                            </Label>
                            <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                                <SelectTrigger className="h-12 border-2 rounded-xl bg-slate-50">
                                    <SelectValue placeholder="All Students" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        <span className="font-bold">All Students ({sortedStudents.length})</span>
                                    </SelectItem>
                                    {sortedStudents.map((s) => (
                                        <SelectItem key={s.id || s.uid} value={s.id || s.uid}>
                                            {s.lastName}, {s.firstName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Export Button */}
                    {classId && (
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating || !studentsToExport.length}
                            className="flex-1 md:w-64 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-tight shadow-lg shadow-indigo-100"
                        >
                            {isGenerating
                                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                : <Download className="mr-2 h-4 w-4" />
                            }
                            Export {studentsToExport.length} Card{studentsToExport.length !== 1 ? 's' : ''}
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* ── Preview Card ── */}
            {classId && (
                <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-50/50 print:hidden">
                    <CardHeader className="p-8 border-b bg-white rounded-t-[2.5rem]">
                        <CardTitle className="text-xl">
                            Layout Preview
                            <span className="ml-2 text-indigo-600">{currentClassName}</span>
                            {selectedStudentId !== 'all' && previewStudent && (
                                <span className="ml-2 text-slate-400 font-normal text-base">
                                    — {previewStudent.firstName} {previewStudent.lastName}
                                </span>
                            )}
                        </CardTitle>
                        <CardDescription>
                            {selectedStudentId === 'all'
                                ? `Showing sample card. ${sortedStudents.length} cards will be exported.`
                                : 'Showing selected student card preview.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {loadingStudents ? (
                            <div className="flex flex-col items-center py-20 gap-3">
                                <Loader2 className="animate-spin text-indigo-600 h-10 w-10" />
                                <p className="text-xs font-black uppercase text-slate-400">Scanning Database...</p>
                            </div>
                        ) : previewStudent ? (
                            <div className="flex flex-wrap justify-center gap-10">
                                <div className="p-10 bg-white rounded-[3rem] shadow-xl border-4 border-white ring-1 ring-slate-200">
                                    <IDCard
                                        student={previewStudent}
                                        className={currentClassName}
                                        schoolProfile={schoolProfile}
                                        logoBase64={logoBase64}
                                        primaryColor={primaryColor}
                                        secondaryColor={secondaryColor}
                                        forPrint={false}
                                    />
                                    <p className="mt-14 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Sample Digital Proof
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[2rem] border-4 border-dashed">
                                <UserRound className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                                    No active students in this class.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── HIDDEN PRINT TEMPLATES ── */}
            <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -1 }}>
                {studentChunks.map((chunk, pageIdx) => (
                    <div
                        key={pageIdx}
                        id={`print-page-${pageIdx}`}
                        style={{
                            width: '794px',      // 210mm @ 96dpi
                            height: '1123px',    // 297mm @ 96dpi
                            backgroundColor: '#ffffff',
                            padding: '57px',     // ~15mm
                            boxSizing: 'border-box',
                            display: 'none',
                        }}
                    >
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '57px',         // ~15mm
                            justifyItems: 'center',
                        }}>
                            {chunk.map((student: Student) => (
                                <IDCard
                                    key={student.id || student.uid}
                                    student={student}
                                    className={currentClassName}
                                    schoolProfile={schoolProfile}
                                    logoBase64={logoBase64}
                                    primaryColor={primaryColor}
                                    secondaryColor={secondaryColor}
                                    forPrint={true}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <style jsx global>{`
                @media print {
                    body * { visibility: hidden !important; }
                    [id^="print-page-"], [id^="print-page-"] * { visibility: visible !important; }
                    [id^="print-page-"] {
                        position: relative !important;
                        margin: 0 !important;
                        page-break-after: always !important;
                        display: block !important;
                        background: white !important;
                    }
                }
            `}</style>
        </div>
    );
}
