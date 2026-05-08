'use client';

import { useState, useRef, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { collection, query, where, doc } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Printer, Download, UserRound, IdCard } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Label } from '@/components/ui/label';
import { Student, Class } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';

export default function IDCardGeneratorPage() {
    const firestore = useFirestore();
    const { schoolId, loading: isLoadingSchool } = useCurrentSchool();
    const { toast } = useToast();

    const [classId, setClassId] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

    // Fetch School Profile
    const schoolProfileRef = useMemoFirebase(() => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null, [firestore, schoolId]);
    const { data: schoolProfile } = useDoc<any>(schoolProfileRef);

    // Fetch Classes
    const classesQuery = useMemoFirebase(() => (firestore && schoolId) ? query(collection(firestore, 'classes'), where('schoolId', '==', schoolId)) : null, [firestore, schoolId]);
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

    const handleDownloadPDF = async () => {
        const element = printRef.current;
        if (!element || !students || students.length === 0) return;
        
        setIsGenerating(true);
        toast({ title: "Generating ID Cards...", description: "Please wait while we render the high-quality PDF." });

        try {
            element.style.display = 'block'; // Make visible for capture
            
            // Allow time for images to load
            await new Promise(res => setTimeout(res, 1200));

            const canvas = await html2canvas(element, { 
                scale: 2, 
                useCORS: true, 
                backgroundColor: '#ffffff'
            });
            
            const imgData = canvas.toDataURL('image/jpeg', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${currentClassName.replace(/\s+/g, '_')}_ID_Cards.pdf`);
            
            element.style.display = 'none';
            toast({ title: "Success", description: "ID Cards PDF exported." });
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: "Export Failed" });
            if (element) element.style.display = 'none';
        } finally {
            setIsGenerating(false);
        }
    };

    if (isLoadingSchool) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-600"/></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-2 italic uppercase">
                    <IdCard className="text-blue-600 h-8 w-8"/> ID Card <span className="text-blue-600">Generator</span>
                </h1>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Generate printable identification cards for your students</p>
            </div>
            
            <Card className="border-t-4 border-t-blue-600 shadow-xl rounded-[2rem]">
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
                                variant="outline" 
                                className="flex-1 md:w-32 h-12 rounded-xl border-2 font-bold"
                                onClick={() => { 
                                    if(printRef.current) { 
                                        printRef.current.style.display='block'; 
                                        window.print(); 
                                        printRef.current.style.display='none'; 
                                    } 
                                }}
                            >
                                <Printer className="mr-2 h-4 w-4"/> Print
                            </Button>
                            <Button 
                                onClick={handleDownloadPDF} 
                                disabled={isGenerating || !students?.length} 
                                className="flex-1 md:w-48 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 font-black uppercase tracking-tight shadow-lg shadow-blue-100"
                            >
                                {isGenerating ? <Loader2 className="animate-spin mr-2"/> : <Download className="mr-2 h-4 w-4"/>}
                                Download PDF
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {classId && (
                <Card className="rounded-[2.5rem] border-none shadow-2xl bg-slate-50/50">
                    <CardHeader className="p-8 border-b bg-white rounded-t-[2.5rem]">
                        <CardTitle className="text-xl">Preview: {currentClassName}</CardTitle>
                        <CardDescription>Found {students?.length || 0} active students in this class.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        {loadingStudents ? (
                            <div className="flex flex-col items-center py-20 gap-3">
                                <Loader2 className="animate-spin text-blue-600 h-10 w-10"/>
                                <p className="text-xs font-black uppercase text-slate-400">Loading Student Database...</p>
                            </div>
                        ) : students && students.length > 0 ? (
                            <div className="flex flex-wrap justify-center gap-8">
                                {/* Visual sample of the design */}
                                <div className="p-8 bg-white rounded-[3rem] shadow-xl border-4 border-white ring-1 ring-slate-200">
                                    <div className="w-[54mm] h-[86mm] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col relative scale-[1.2] origin-center">
                                        <div className="h-[30%] flex flex-col items-center justify-center p-3 text-center" style={{ backgroundColor: primaryColor, color: 'white' }}>
                                            {schoolProfile?.logoUrl && <img src={schoolProfile.logoUrl} crossOrigin="anonymous" alt="Logo" className="h-8 object-contain mb-1" />}
                                            <h2 className="text-[10px] font-black uppercase leading-tight tracking-tighter line-clamp-2">{schoolProfile?.name || "SCHOOL NAME"}</h2>
                                        </div>
                                        <div className="flex-1 flex flex-col items-center pt-6 px-3 text-center">
                                            <div className="w-24 h-24 bg-slate-100 rounded-2xl border-4 border-white shadow-md mb-3 overflow-hidden flex items-center justify-center ring-1 ring-slate-200" style={{ borderColor: 'white' }}>
                                                {students[0].photoURL ? (
                                                    <img src={students[0].photoURL} crossOrigin="anonymous" alt="Student" className="w-full h-full object-cover" />
                                                ) : (
                                                    <UserRound className="w-12 h-12 text-slate-200" />
                                                )}
                                            </div>
                                            <div className="space-y-0.5">
                                                <h3 className="text-[13px] font-black text-slate-800 leading-tight uppercase">{students[0].lastName}</h3>
                                                <h4 className="text-[12px] font-bold text-slate-600 leading-tight">{students[0].firstName}</h4>
                                            </div>
                                            <Badge variant="secondary" className="mt-4 text-[9px] font-black bg-slate-100 text-slate-500 uppercase px-3 rounded-full">
                                                {currentClassName}
                                            </Badge>
                                        </div>
                                        <div className="h-10 mt-auto flex flex-col items-center justify-center text-white" style={{ backgroundColor: secondaryColor }}>
                                            <span className="text-[7px] font-bold uppercase opacity-60">Student ID Number</span>
                                            <span className="text-[11px] font-black tracking-widest font-mono">
                                                {formatStudentId(students[0])}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="mt-12 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sample Design Layout</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[2rem] border-4 border-dashed">
                                <UserRound className="h-16 w-16 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No active students in this class.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* HIDDEN PRINT TEMPLATE (A4 Grid) */}
            {students && students.length > 0 && (
                <div className="print:hidden fixed -left-[9999px]" style={{ display: 'none' }}>
                    <div ref={printRef} className="bg-white p-[10mm]" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
                        <div className="grid grid-cols-3 gap-x-[5mm] gap-y-[8mm] justify-items-center">
                            {students.map((student: any) => (
                                <div key={student.id} className="w-[54mm] h-[86mm] bg-white rounded-xl border border-slate-300 overflow-hidden flex flex-col relative" style={{ boxSizing: 'border-box' }}>
                                    
                                    {/* Header */}
                                    <div className="h-[26mm] flex flex-col items-center justify-center p-2 text-center" style={{ backgroundColor: primaryColor, color: 'white' }}>
                                        {schoolProfile?.logoUrl && <img src={schoolProfile.logoUrl} crossOrigin="anonymous" alt="Logo" className="h-8 object-contain mb-1" />}
                                        <h2 className="text-[8px] font-black uppercase leading-tight tracking-tighter">{schoolProfile?.name || "SCHOOL NAME"}</h2>
                                    </div>
                                    
                                    {/* Body */}
                                    <div className="flex-1 flex flex-col items-center pt-4 px-2 text-center">
                                        <div className="w-[28mm] h-[28mm] bg-slate-50 rounded-lg border-2 border-slate-100 shadow-inner mb-3 overflow-hidden flex items-center justify-center">
                                            {student.photoURL ? (
                                                <img src={student.photoURL} crossOrigin="anonymous" alt="Student" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserRound className="w-12 h-12 text-slate-200" />
                                            )}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h3 className="text-[11px] font-black text-slate-900 uppercase leading-none">{student.lastName}</h3>
                                            <h4 className="text-[10px] font-bold text-slate-700 leading-none">{student.firstName}</h4>
                                        </div>
                                        <p className="text-[8px] font-black text-slate-400 mt-3 uppercase tracking-widest">{currentClassName}</p>
                                    </div>
                                    
                                    {/* Footer */}
                                    <div className="h-[10mm] mt-auto flex flex-col items-center justify-center text-white" style={{ backgroundColor: secondaryColor }}>
                                        <span className="text-[6px] font-bold uppercase opacity-60">Student ID</span>
                                        <span className="text-[10px] font-black tracking-widest font-mono">
                                            {formatStudentId(student)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
