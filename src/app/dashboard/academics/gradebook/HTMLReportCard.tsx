'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Assessment, Student } from '@/lib/types';

// Helper for Grading
function getGrade(percentage: number) {
    if (percentage >= 80) return { grade: 'A', remark: 'Excellent' };
    if (percentage >= 70) return { grade: 'B', remark: 'Very Good' };
    if (percentage >= 60) return { grade: 'C', remark: 'Good' };
    if (percentage >= 50) return { grade: 'D', remark: 'Pass' };
    return { grade: 'F', remark: 'Fail' };
}

// THIS IS THE COMPONENT THAT WILL BE CONVERTED TO PDF
export const HTMLReportCard = ({ student, assessments, year, term, rank, totalStudents, subjects, schoolProfile }: any) => {
    
    // --- Data Logic (Same as before) ---
    const subjectMap = useMemo(() => {
        return subjects?.reduce((acc: any, s: any) => {
            acc[s.id] = s.name || s.title;
            return acc;
        }, {}) || {};
    }, [subjects]);

    const reportData = useMemo(() => {
        return Object.values(assessments.reduce((acc: any, curr: Assessment) => {
            if (curr.studentId !== student.uid) return acc;
            
            const subId = curr.subjectId || 'unknown';
            const name = subjectMap[subId] || (curr as any).subjectName || 'Unknown Subject';

            if (!acc[subId]) {
                acc[subId] = { id: subId, name, total: 0, max: 0 };
            }
            acc[subId].total += curr.score || 0;
            acc[subId].max += curr.maxScore || 0;
            return acc;
        }, {})).map((item: any) => {
            const pct = item.max > 0 ? (item.total / item.max) * 100 : 0;
            return { ...item, pct, ...getGrade(pct) };
        });
    }, [assessments, student.uid, subjectMap]);

    const average = reportData.length > 0 
        ? reportData.reduce((sum: number, i: any) => sum + i.pct, 0) / reportData.length 
        : 0;

    // --- HTML TEMPLATE (A4 Sized) ---
    return (
        <div 
            id="printable-area" 
            className="bg-white text-black font-sans p-8 mx-auto"
            style={{ 
                width: '210mm', 
                minHeight: '297mm',
                position: 'relative' // Needed for absolute footer
            }}
        >
            {/* Header */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                {schoolProfile?.logoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={schoolProfile.logoUrl} 
                        alt="Logo" 
                        className="w-20 h-20 mx-auto mb-2 object-contain"
                        crossOrigin="anonymous" // Critical for html2canvas
                    />
                )}
                <h1 className="text-3xl font-bold uppercase tracking-wide">{schoolProfile?.name || "Sunnyside International School"}</h1>
                <p className="text-sm text-gray-600 mt-1">{schoolProfile?.address || "Address: N/A"} • {schoolProfile?.phone || "Phone: N/A"}</p>
                <p className="text-sm text-gray-600">{schoolProfile?.email || ""} • {schoolProfile?.website || ""}</p>
                <p className="text-sm italic mt-1 font-semibold">"{schoolProfile?.motto || 'Excellence • Integrity • Service'}"</p>
                <h2 className="text-xl font-bold mt-4 underline decoration-2 underline-offset-4">TERMINAL REPORT CARD</h2>
            </div>

            {/* Student Info Grid */}
            <div className="flex justify-between mb-6 text-sm">
                <div className="space-y-1">
                    <div className="flex gap-2"><span className="font-bold w-24">Name:</span> <span>{student.firstName} {student.lastName}</span></div>
                    <div className="flex gap-2"><span className="font-bold w-24">Student ID:</span> <span>{student.id.slice(0, 8).toUpperCase()}</span></div>
                </div>
                <div className="space-y-1 text-right">
                    <div className="flex gap-2 justify-end"><span className="font-bold">Academic Year:</span> <span>{year}</span></div>
                    <div className="flex gap-2 justify-end"><span className="font-bold">Term:</span> <span>{term}</span></div>
                    <div className="flex gap-2 justify-end"><span className="font-bold">Class:</span> <span>{student.classId || 'N/A'}</span></div>
                </div>
            </div>

            {/* Grades Table */}
            <div className="border border-black mb-8">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100 border-b border-black">
                            <th className="text-left p-2 border-r border-black w-[40%]">Subject</th>
                            <th className="text-center p-2 border-r border-black w-[20%]">Score</th>
                            <th className="text-center p-2 border-r border-black w-[15%]">Grade</th>
                            <th className="text-left p-2 w-[25%]">Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-black last:border-0">
                                <td className="p-2 border-r border-black">{row.name}</td>
                                <td className="p-2 border-r border-black text-center">{row.pct.toFixed(1)}%</td>
                                <td className="p-2 border-r border-black text-center font-bold">{row.grade}</td>
                                <td className="p-2">{row.remark}</td>
                            </tr>
                        ))}
                        {reportData.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center italic text-gray-500">No grades recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Box */}
            <div className="border border-dashed border-black p-4 mb-12">
                <div className="flex justify-between mb-2">
                    <span className="font-bold">Overall Average:</span>
                    <span className="text-lg font-bold">{average.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between mb-4">
                    <span className="font-bold">Class Position:</span>
                    <span className="text-lg font-bold">{rank} / {totalStudents}</span>
                </div>
                <div className="pt-2 border-t border-dashed border-black flex justify-between">
                    <span className="font-bold">Principal's Remark:</span>
                    <span className="italic">{getGrade(average).remark}</span>
                </div>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-16 px-4">
                <div className="text-center">
                    <div className="w-40 border-t border-black mb-1"></div>
                    <p className="text-xs">Class Teacher</p>
                </div>
                <div className="text-center">
                    <div className="w-40 border-t border-black mb-1"></div>
                    <p className="text-xs">Principal</p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-xs text-gray-400">
                Generated via Sunnyside SIS • {format(new Date(), 'PPP')}
            </div>
        </div>
    );
};
