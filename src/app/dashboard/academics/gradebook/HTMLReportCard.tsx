'use client';

import { useMemo } from 'react';
import { format } from 'date-fns';
import { Assessment, Student } from '@/lib/types';
import { formatStudentId } from '@/lib/student-utils';
import { getGradeFromScale } from '@/lib/utils';


// Professional Ordinal Formatter
function formatOrdinal(n: number): string {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}


// THIS IS THE COMPONENT THAT WILL BE CONVERTED TO PDF
export const HTMLReportCard = ({ 
    student, 
    assessments, 
    year, 
    term, 
    rank, 
    totalStudents, 
    subjects, 
    schoolProfile,
    customRemark,
    caWeight,
    examWeight
}: any) => {
    const currentCaWeight = caWeight ?? 30;
    const currentExamWeight = examWeight ?? 70;
    
    const globalSubjectStats = useMemo(() => {
        const grouping: Record<string, Record<string, { ca: number, caMax: number, exam: number, examMax: number }>> = {};

        assessments.forEach((a: Assessment) => {
             const subId = a.subjectId || 'unknown';
             const uId = a.studentId;
             
             if (!grouping[subId]) grouping[subId] = {};
             if (!grouping[subId][uId]) grouping[subId][uId] = { ca: 0, caMax: 0, exam: 0, examMax: 0 };

             const type = (a.assessmentType || '').toLowerCase();
             const isExam = type.includes('exam') || type.includes('term');

             if (isExam) {
                 grouping[subId][uId].exam += (a.score || 0);
                 grouping[subId][uId].examMax += (a.maxScore || 0);
             } else {
                 grouping[subId][uId].ca += (a.score || 0);
                 grouping[subId][uId].caMax += (a.maxScore || 0);
             }
        });

        const stats: Record<string, { average: number, studentScores: Record<string, number> }> = {};
        
        Object.keys(grouping).forEach(subId => {
            const studentsInSub = grouping[subId];
            let sumPercentages = 0;
            let count = 0;
            const scoresMap: Record<string, number> = {};

            Object.entries(studentsInSub).forEach(([uid, data]) => {
                const caPct = data.caMax > 0 ? (data.ca / data.caMax) * currentCaWeight : 0;
                const examPct = data.examMax > 0 ? (data.exam / data.examMax) * currentExamWeight : 0;
                const final = caPct + examPct;
                
                scoresMap[uid] = final;
                sumPercentages += final;
                count++;
            });

            stats[subId] = {
                average: count > 0 ? sumPercentages / count : 0,
                studentScores: scoresMap
            };
        });
        
        return stats;
    }, [assessments, currentCaWeight, currentExamWeight]);

    // 2. STUDENT SPECIFIC DATA (Display Logic) - FIXED TO ITERATE OVER SUBJECTS
    const reportData = useMemo(() => {
        if (!subjects || subjects.length === 0) return [];
        
        return subjects.map((subject: any) => {
            const subId = subject.id;
            const subName = subject.name;

            const studentAssessments = assessments.filter((a: Assessment) => a.studentId === student.uid && a.subjectId === subId);

            let caObtained = 0, caMax = 0, examObtained = 0, examMax = 0;

            studentAssessments.forEach((a: Assessment) => {
                const type = (a.assessmentType || '').toLowerCase();
                const isExam = type.includes('exam') || type.includes('term');
                if (isExam) {
                    examObtained += (a.score || 0);
                    examMax += (a.maxScore || 0);
                } else {
                    caObtained += (a.score || 0);
                    caMax += (a.maxScore || 0);
                }
            });

            const caWeighted = caMax > 0 ? (caObtained / caMax) * currentCaWeight : 0;
            const examWeighted = examMax > 0 ? (examObtained / examMax) * currentExamWeight : 0;
            const totalPercent = caWeighted + examWeighted;

            const subStats = globalSubjectStats[subId];
            let classAvg = subStats ? subStats.average : 0;
            let subRank: string | number = 'N/A';
            let totalSubStudents = 0;

            if (subStats && subStats.studentScores) {
                const studentScore = subStats.studentScores[student.uid];
                if (studentScore !== undefined) {
                    const allScores = Object.values(subStats.studentScores);
                    // Standard Competition Ranking
                    const higherCount = allScores.filter(s => s > studentScore + 0.001).length;
                    subRank = formatOrdinal(higherCount + 1);
                }
                totalSubStudents = Object.keys(subStats.studentScores).length;
            }

            return { 
                id: subId,
                name: subName,
                caWeighted, 
                examWeighted, 
                totalPercent, 
                classAvg, 
                rank: subRank,
                totalSubStudents,
                ...getGradeFromScale(totalPercent, schoolProfile?.gradingSystem) 
            };
        });
    }, [assessments, student.uid, subjects, globalSubjectStats, currentCaWeight, currentExamWeight, schoolProfile]);


    const overallAverage = reportData.length > 0 
        ? reportData.reduce((sum: number, i: any) => sum + i.totalPercent, 0) / reportData.length 
        : 0;

    // --- HTML TEMPLATE (A4 Sized) ---
    return (
        <div 
            id="printable-area" 
            className="bg-white text-black font-sans p-8 mx-auto"
            style={{ 
                width: '210mm', 
                minHeight: '297mm',
                position: 'relative' 
            }}
        >
            {/* Header: Dynamic School Profile */}
            <div className="text-center border-b-2 border-black pb-4 mb-6">
                {schoolProfile?.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={schoolProfile.logoUrl} 
                        alt="" 
                        className="w-24 h-24 mx-auto mb-2 object-contain"
                    />
                ) : (
                    // Fallback Spacer
                    <div className="h-4"></div>
                )}
                <h1 className="text-3xl font-bold uppercase tracking-wide">{schoolProfile?.name || "School Name Not Set"}</h1>
                <p className="text-sm text-gray-600 mt-1">{schoolProfile?.address || ""}</p>
                <div className="flex justify-center gap-4 text-sm text-gray-600">
                    <span>{schoolProfile?.phone || ""}</span>
                    <span>{schoolProfile?.email || ""}</span>
                </div>
                {schoolProfile?.website && <p className="text-sm text-gray-600">{schoolProfile.website}</p>}
                
                <p className="text-sm italic mt-2 font-semibold">"{schoolProfile?.motto || 'Excellence'}"</p>
                <h2 className="text-xl font-bold mt-4 underline decoration-2 underline-offset-4">TERMINAL REPORT CARD</h2>
            </div>

            {/* Student Info Grid */}
            <div className="flex justify-between mb-6 text-sm border p-4 rounded-lg bg-gray-50">
                <div className="space-y-2">
                    <div className="flex gap-2"><span className="font-bold w-24">Name:</span> <span className="uppercase">{student.firstName} {student.lastName}</span></div>
                    <div className="flex gap-2"><span className="font-bold w-24">Student ID:</span> <span className="uppercase font-mono">{formatStudentId(student)}</span></div>
                </div>
                <div className="space-y-2 text-right">
                    <div className="flex gap-2 justify-end"><span className="font-bold">Academic Year:</span> <span>{year}</span></div>
                    <div className="flex gap-2 justify-end"><span className="font-bold">Term:</span> <span>{term}</span></div>
                    <div className="flex gap-2 justify-end"><span className="font-bold">Class:</span> <span>{student.classId || 'N/A'}</span></div>
                </div>
            </div>

            {/* Grades Table - Matching Gradebook Exactly */}
            <div className="border border-black mb-8">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="bg-gray-200 border-b border-black">
                            <th className="text-left p-2 border-r border-black w-[25%]">Subject</th>
                            <th className="text-center p-2 border-r border-black w-[10%]">C.A. ({currentCaWeight}%)</th>
                            <th className="text-center p-2 border-r border-black w-[10%]">Exam ({currentExamWeight}%)</th>
                            <th className="text-center p-2 border-r border-black w-[10%]">Total</th>
                            <th className="text-center p-2 border-r border-black w-[10%]">Class Avg</th>
                            <th className="text-center p-2 border-r border-black w-[10%]">Pos</th>
                            <th className="text-center p-2 border-r border-black w-[10%]">Grade</th>
                            <th className="text-left p-2 w-[15%]">Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reportData.map((row: any, i: number) => (
                            <tr key={i} className="border-b border-black last:border-0">
                                <td className="p-2 border-r border-black font-semibold">{row.name}</td>
                                <td className="p-2 border-r border-black text-center">{row.caWeighted > 0 ? row.caWeighted.toFixed(1) : '-'}</td>
                                <td className="p-2 border-r border-black text-center">{row.examWeighted > 0 ? row.examWeighted.toFixed(1) : '-'}</td>
                                <td className="p-2 border-r border-black text-center font-bold">{row.totalPercent > 0 ? `${row.totalPercent.toFixed(1)}%` : '-'}</td>
                                <td className="p-2 border-r border-black text-center text-gray-500">{row.classAvg > 0 ? `${row.classAvg.toFixed(1)}%` : '-'}</td>
                                <td className="p-2 border-r border-black text-center">{row.rank !== 'N/A' ? `${row.rank}/${row.totalSubStudents}` : '-'}</td>
                                <td className="p-2 border-r border-black text-center font-bold">{row.grade}</td>
                                <td className="p-2">{row.remark}</td>
                            </tr>
                        ))}
                        {reportData.length === 0 && (
                            <tr>
                                <td colSpan={8} className="p-4 text-center italic text-gray-500">No grades recorded yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Summary Box */}
            <div className="border-2 border-dashed border-black p-4 mb-8 rounded-lg bg-gray-50 space-y-3">
                <div className="flex justify-between text-lg">
                    <div>
                        <span className="font-bold">Overall Average:</span>
                        <span className="ml-2">{overallAverage > 0 ? `${overallAverage.toFixed(2)}%` : 'N/A'}</span>
                    </div>
                    <div>
                        <span className="font-bold">Class Position:</span>
                        <span className="ml-2 font-bold underline">{rank} / {totalStudents}</span>
                    </div>
                </div>
                
                {customRemark?.teacherRemark && (
                    <div className="pt-3 border-t border-dashed border-black">
                        <span className="font-bold block mb-1 text-sm">Class Teacher's Remark:</span>
                        <span className="italic text-sm text-gray-700">{customRemark.teacherRemark}</span>
                    </div>
                )}
                
                {customRemark?.principalRemark && (
                     <div className="pt-3 border-t border-dashed border-black">
                        <span className="font-bold block mb-1 text-sm">Principal's Remark:</span>
                        <span className="italic text-sm text-gray-700">{customRemark.principalRemark}</span>
                    </div>
                )}

            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-auto px-8 pb-10">
                <div className="text-center">
                    <div className="w-48 border-b-2 border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Class Teacher's Signature</p>
                </div>
                <div className="text-center">
                    <div className="w-48 border-b-2 border-black mb-2"></div>
                    <p className="text-xs font-bold uppercase">Principal's Signature</p>
                    <p className="text-[10px] text-gray-500 mt-1">{format(new Date(), 'PPP')}</p>
                </div>
            </div>

            {/* Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-[10px] text-gray-400">
                Generated via Sunnyside Student Information System
            </div>
        </div>
    );
};