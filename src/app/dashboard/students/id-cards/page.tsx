'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, UserRound, IdCard, MapPin, Phone, Mail } from 'lucide-react';
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

export default function IDCardGeneratorPage() {
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();

    const [classId, setClassId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [logoBase64, setLogoBase64] = useState<string>('');

    // Fetch School Profile
    const schoolProfileRef = useMemoFirebase(
        () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, 
        [firestore, schoolId]
    );
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    // Convert logo to base64 for solid PDF rendering
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

    // Fetch Students
    const studentsQuery = useMemoFirebase(() => {
        if (!firestore || !schoolId || !classId) return null;
        return query(
            collection(firestore, 'students'), 
            where('schoolId', '==', schoolId), 
            where('classId', '==', classId),
            where('enrollmentStatus', '==', 'Active')
        );
    }, [firestore, schoolId, classId]);
    const { data: students, isLoading: loadingStudents } = useCollection<Student>(studentsQuery);

    const primaryColor = schoolProfile?.brandColor || schoolProfile?.primaryColor || '#2563eb';
    const secondaryColor = schoolProfile?.secondaryColor || primaryColor;
    const currentClassName = classes?.find(c => c.id === classId)?.name || 'N/A';

    // Chunk students for multi-page support (8 per A4 page for more spacing)
    const studentChunks = useMemo(() => {
        if (!students) return [];
        const size = 8;
        const result = [];
        for (let i = 0; i < students.length; i += size) {
            result.push(students.slice(i, i + size));
        }
        return result;
    }, [students]);

    const handleDownloadPDF = async () => {
        if (!studentChunks.length) return;
        
        setIsGenerating(true);
        toast({ title: "Generating ID Cards...", description: "Optimizing layout for high clarity and spacing." });

        try {
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Loop through each "page" chunk
            for (let i = 0; i < studentChunks.length; i++) {
                const pageElement = document.getElementById(`print-page-${i}`);
                if (!pageElement) continue;

                // Add new page if not the first
                if (i > 0) pdf.addPage();

                // Briefly make visible for capture
                pageElement.style.display = 'block';
                // Wait slightly more for layout stability
                await new Promise(res => setTimeout(res, 1000));

                const canvas = await html2canvas(pageElement, {
                    scale: 3, // Increased scale for high detail
                    useCORS: true,
                    logging: false,
                    backgroundColor: '#ffffff',
                    width: pageElement.offsetWidth,
                    height: pageElement.offsetHeight
                });

                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

                // Re-hide
                pageElement.style.display = 'none';
            }
            
            pdf.save(`${currentClassName.replace(/\s+/g, '_')}_ID_Cards.pdf`);
            toast({ title: "Success", description: `Exported ${students?.length} ID cards.` });
        } catch (error: any) {
            console.error("PDF Export Error:", error);
            toast({ 
                variant: 'destructive', 
                title: "Export Failed", 
                description: "An error occurred during multi-page rendering." 
            });
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoadingSchool) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase text-indigo-600">
                    <IdCard className="h-8 w-8"/> ID Card Generator
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Generate printable multi-page identification cards</p>
            </div>
            
            <Card className="border-t-4 border-t-indigo-600 shadow-xl rounded-[2rem] print:hidden">
                <CardHeader>
                    <CardTitle className="text-lg">Select Population</CardTitle>
                    <CardDescription>Choose a class to compile ID cards.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="space-y-2 flex-1 max-w-sm">
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
                    {classId && (
                        <div className="flex gap-2 w-full md:w-auto">
                            <Button 
                                onClick={handleDownloadPDF} 
                                disabled={isGenerating || !students?.length} 
                                className="flex-1 md:w-64 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-black uppercase tracking-tight shadow-lg shadow-indigo-100"
                            >
                                {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin mr-2"/> : <Download className="mr-2 h-4 w-4"/>}
                                Export {students?.length} Cards
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {classId && (
                <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-50/50 print:hidden">
                    <CardHeader className="p-8 border-b bg-white rounded-t-[2.5rem]">
                        <CardTitle className="text-xl">Layout Preview: {currentClassName}</CardTitle>
                        <CardDescription>Visualizing how the cards will appear on the printed A4 sheet.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {loadingStudents ? (
                            <div className="flex flex-col items-center py-20 gap-3">
                                <Loader2 className="animate-spin text-indigo-600 h-10 w-10"/>
                                <p className="text-xs font-black uppercase text-slate-400">Scanning Database...</p>
                            </div>
                        ) : students && students.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-8">
                                <div className="p-10 bg-white rounded-[3rem] shadow-xl border-4 border-white ring-1 ring-slate-200">
                                    <div className="w-[86mm] h-[54mm] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-row relative scale-[1.2] origin-center">
                                        <div className="w-[30mm] flex flex-col items-center justify-center p-3 text-center border-r border-black/5" style={{ backgroundColor: primaryColor, color: 'white' }}>
                                            {logoBase64 ? (
                                                <img src={logoBase64} alt="Logo" className="h-10 object-contain mb-1" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-white/20 mb-1" />
                                            )}
                                            <h2 className="text-[9px] font-black uppercase leading-tight tracking-tighter line-clamp-1">{schoolProfile?.name || "SCHOOL NAME"}</h2>
                                            
                                            <div className="mt-1 space-y-0.5 opacity-80 scale-[0.9]">
                                                <p className="text-[6px] font-bold truncate px-2">{schoolProfile?.address || "School Address"}</p>
                                                <p className="text-[6px] font-black tracking-widest">{schoolProfile?.phone || "000-000-0000"}</p>
                                            </div>
                                        </div>
                                        <div className="flex-1 flex flex-row items-center p-4 gap-3">
                                            <div className="w-20 h-20 bg-slate-100 rounded-xl border-4 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
                                                {students[0].photoURL ? (
                                                    <img src={students[0].photoURL} crossOrigin="anonymous" alt="Student" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserRound className="w-10 h-10 text-slate-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-[13px] font-black text-slate-800 uppercase truncate leading-none">{students[0].lastName}</h3>
                                                <h4 className="text-[12px] font-bold text-slate-600 truncate mb-1">{students[0].firstName}</h4>
                                                <Badge variant="secondary" className="text-[8px] font-black bg-slate-100 text-slate-500 uppercase px-2 rounded-full">
                                                    {currentClassName}
                                                </Badge>
                                                <div className="mt-2 flex flex-col">
                                                    <span className="text-[6px] font-black text-slate-400 uppercase tracking-widest">Student ID</span>
                                                    <span className="text-[10px] font-black tracking-widest font-mono text-slate-800">
                                                        {formatStudentId(students[0])}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute bottom-0 right-0 left-[30mm] h-1" style={{ backgroundColor: secondaryColor }} />
                                    </div>
                                    <p className="mt-14 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sample Digital Proof</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-24 bg-white rounded-[2rem] border-4 border-dashed">
                                <UserRound className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active students in this class.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* ── HIDDEN PRINT TEMPLATES (A4 Chunks with generous spacing) ── */}
            <div className="fixed" style={{ left: '-9999px', top: '0', zIndex: -1 }}>
                {studentChunks.map((chunk, pageIdx) => (
                    <div 
                        key={pageIdx}
                        id={`print-page-${pageIdx}`}
                        className="bg-white p-[15mm] mb-[30mm]" 
                        style={{ 
                            width: '210mm', 
                            height: '297mm', 
                            boxSizing: 'border-box',
                            display: 'none' 
                        }}
                    >
                        <div className="grid grid-cols-2 gap-x-[12mm] gap-y-[12mm] justify-items-center">
                            {chunk.map((student: Student) => (
                                <div 
                                    key={student.id} 
                                    className="w-[86mm] h-[54mm] bg-white rounded-2xl border border-slate-300 overflow-hidden flex flex-row relative shadow-sm" 
                                    style={{ 
                                        boxSizing: 'border-box',
                                    }}
                                >
                                    {/* Left Branding Sidebar */}
                                    <div 
                                        className="w-[30mm] flex flex-col items-center justify-center p-3 text-center border-r border-black/5" 
                                        style={{ backgroundColor: primaryColor, color: 'white' }}
                                    >
                                        {logoBase64 ? (
                                            <img src={logoBase64} alt="Logo" className="h-12 object-contain mb-2" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-white/20 mb-2" />
                                        )}
                                        <h2 className="text-[10px] font-black uppercase leading-tight tracking-tighter mb-2">{schoolProfile?.name || "SCHOOL"}</h2>
                                        
                                        <div className="space-y-1 opacity-80 scale-[0.85]">
                                            <p className="text-[7px] font-bold line-clamp-3 leading-tight">{schoolProfile?.address || "Address Not Set"}</p>
                                            <p className="text-[7px] font-black tracking-widest">{schoolProfile?.phone || ""}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Right Main Info Area */}
                                    <div className="flex-1 flex flex-row items-center p-4 gap-4">
                                        <div className="w-24 h-24 bg-slate-50 rounded-xl border-2 border-slate-100 shadow-inner overflow-hidden flex items-center justify-center shrink-0">
                                            {student.photoURL ? (
                                                <img src={student.photoURL} crossOrigin="anonymous" alt="Student" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserRound className="w-10 h-10 text-slate-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <div className="pb-2 border-b border-slate-100">
                                                <h3 className="text-[13px] font-black text-slate-900 uppercase truncate leading-none mb-1">{student.lastName}</h3>
                                                <h4 className="text-[12px] font-bold text-slate-600 leading-none truncate">{student.firstName}</h4>
                                            </div>
                                            
                                            <div className="pt-2 space-y-2">
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Enrollment Class</span>
                                                    <span className="text-[10px] font-black text-indigo-600 uppercase truncate">{currentClassName}</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Student ID Number</span>
                                                    <span className="text-[11px] font-black tracking-widest font-mono text-slate-800">
                                                        {formatStudentId(student)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Small bottom verification strip */}
                                    <div className="absolute bottom-0 right-0 left-[30mm] h-1.5" style={{ backgroundColor: secondaryColor }} />
                                </div>
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
