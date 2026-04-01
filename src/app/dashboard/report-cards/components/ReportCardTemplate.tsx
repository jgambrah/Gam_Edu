'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';
import SignatureStamp from '@/components/shared/SignatureStamp';
import { format, parseISO, isValid } from 'date-fns';

interface ReportCardTemplateProps {
    data: any;
    classTeacherComment: string;
    headmasterComment: string;
    caWeight: number;
    examWeight: number;
}

/**
 * Standardized Report Card Template for GAM Edu.
 * Displays academic results, attendance, and persistent digital signatures.
 * (STEP 4): Standardized date parsing for ISO strings to prevent timezone shifts.
 */
export default function ReportCardTemplate({ data, classTeacherComment, headmasterComment, caWeight, examWeight }: ReportCardTemplateProps) {
    if (!data) return null;

    const getSafeDate = (d: any) => {
        if (!d) return null;
        try {
            if (typeof d === 'string') {
                const parsed = parseISO(d);
                return isValid(parsed) ? parsed : null;
            }
            if (typeof d.toDate === 'function') {
                return d.toDate();
            }
            return new Date(d);
        } catch (e) {
            return null;
        }
    };

    const nextTermDate = getSafeDate(data.nextTermDate);
    const nextTermReopening = nextTermDate 
        ? format(nextTermDate, 'PPP') 
        : "To Be Announced";

    return (
        <div
            id="pdf-content"
            className="bg-white text-black font-sans flex flex-col"
            style={{
                width: '794px',
                minHeight: '1123px',
                boxSizing: 'border-box',
                margin: '0 auto',
                padding: '30px 40px',
                gap: '0px',
                overflow: 'hidden',
            }}
        >
            {/* ── HEADER ── */}
            <div className="flex flex-row items-center justify-between border-b-[3px] border-double border-slate-900 pb-4 mb-4">
                <div className="w-24 h-24 flex shrink-0 items-center justify-center">
                    {data.logoBase64 ? (
                        <img src={data.logoBase64} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="w-20 h-20 bg-slate-100 border border-dashed rounded flex items-center justify-center text-[10px] text-slate-400">No Logo</div>
                    )}
                </div>

                <div className="flex-1 text-center px-4">
                    <h1 className="text-3xl font-black uppercase tracking-tight leading-none mb-1">
                        {data.schoolName || 'SCHOOL NAME'}
                    </h1>
                    {data.schoolMotto && (
                        <p className="text-sm italic text-slate-600 font-medium">"{data.schoolMotto}"</p>
                    )}
                    <p className="text-xs font-bold mt-2 text-slate-800">{data.schoolAddress}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                        {[data.schoolPhone, data.schoolEmail].filter(Boolean).join(' | ')}
                    </p>
                </div>

                <div className="w-24 shrink-0" />
            </div>

            {/* ── TITLE ── */}
            <div className="bg-slate-100 border border-slate-300 py-2 text-center mb-4 uppercase font-black tracking-[0.2em] text-lg">
                Terminal Report Card
            </div>

            {/* ── STUDENT INFO GRID ── */}
            <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-4 text-sm border p-4 font-medium bg-slate-50/50 rounded-lg">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Student Name</span>
                    <span className="font-bold uppercase">{data.student?.firstName} {data.student?.lastName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Term</span>
                    <span className="font-bold">{data.term}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Class</span>
                    <span className="font-bold uppercase">{data.className}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Academic Year</span>
                    <span className="font-bold">{data.academicYear}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Attendance</span>
                    <span className="font-bold">{data.studentPresentDays || 0} / {data.totalClassDays || 0} Days</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-1">
                    <span className="text-slate-500 font-bold uppercase text-[10px]">Rank in Class</span>
                    <span className="font-black underline">{data.classPosition || '-'} of {data.totalStudents || 0}</span>
                </div>
            </div>

            {/* ── NEXT TERM ALERT ── */}
            <div className="bg-indigo-50 border-2 border-indigo-100 p-3 text-center mb-6 rounded-xl">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mr-2">Next Term Reopening:</span>
                <span className="text-base font-black text-indigo-900">{nextTermReopening}</span>
            </div>

            {/* ── GRADES TABLE ── */}
            <table className="w-full text-xs mb-6 border-collapse">
                <thead>
                    <tr className="bg-slate-900 text-white uppercase font-bold text-[10px]">
                        <th className="border border-slate-900 p-2 text-left w-[25%]">Subject</th>
                        <th className="border border-slate-900 p-2 text-center w-[10%]">CA ({caWeight})</th>
                        <th className="border border-slate-900 p-2 text-center w-[10%]">Exam ({examWeight})</th>
                        <th className="border border-slate-900 p-2 text-center w-[10%] bg-slate-800">Total</th>
                        <th className="border border-slate-900 p-2 text-center w-[8%]">Avg</th>
                        <th className="border border-slate-900 p-2 text-center w-[8%]">Pos</th>
                        <th className="border border-slate-900 p-2 text-center w-[8%]">Grd</th>
                        <th className="border border-slate-900 p-2 text-left w-[21%]">Remark</th>
                    </tr>
                </thead>
                <tbody>
                    {data.rows?.map((row: any, i: number) => (
                        <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                            <td className="border border-slate-300 p-2 font-bold uppercase">{row.subjectName}</td>
                            <td className="border border-slate-300 p-2 text-center">{row.ca}</td>
                            <td className="border border-slate-300 p-2 text-center">{row.exam}</td>
                            <td className="border border-slate-300 p-2 text-center font-black bg-slate-100/50">{row.total}</td>
                            <td className="border border-slate-300 p-2 text-center text-slate-400">{row.classAverage}</td>
                            <td className="border border-slate-300 p-2 text-center font-bold">{row.position}</td>
                            <td className="border border-slate-300 p-2 text-center font-black">{row.grade}</td>
                            <td className="border border-slate-300 p-2 italic text-slate-600 text-[10px]">{row.autoRemark}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ── REMARKS ── */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 border rounded-xl bg-slate-50">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Class Teacher's Remark</h4>
                    <p className="text-sm italic text-slate-800 leading-relaxed">"{classTeacherComment || 'Progress satisfactory.'}"</p>
                </div>
                <div className="p-4 border rounded-xl bg-slate-50">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Headmaster's Remark</h4>
                    <p className="text-sm italic text-slate-800 leading-relaxed">"{headmasterComment || 'Pending official review.'}"</p>
                </div>
            </div>

            {/* ── SIGNATURES ── */}
            <div className="grid grid-cols-2 gap-16 pt-10 mt-auto border-t-2 border-slate-100">
                <div className="text-center flex flex-col items-center">
                    <div className="h-20 flex items-end justify-center mb-2">
                        {data.teacherSigBase64 || data.classTeacherSignatureUrl ? (
                            <img 
                                src={data.teacherSigBase64 || data.classTeacherSignatureUrl} 
                                alt="Teacher Sig" 
                                className="max-h-16 object-contain mix-blend-multiply" 
                            />
                        ) : (
                            <span className="text-slate-200 uppercase font-black text-[10px] mb-4">Awaiting Signature</span>
                        )}
                    </div>
                    <div className="w-full border-t-2 border-slate-900 pt-2">
                        <p className="font-black text-[10px] uppercase text-slate-900">{data.classTeacherName || 'Class Teacher'}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Digital Verification Key</p>
                    </div>
                </div>

                <div className="text-center flex flex-col items-center">
                    <div className="h-20 flex items-end justify-center mb-2 w-full">
                        {data.headmasterSigBase64 || data.headmasterSignatureUrl ? (
                            <img 
                                src={data.headmasterSigBase64 || data.headmasterSignatureUrl} 
                                alt="Headmaster Sig" 
                                className="max-h-16 max-w-full object-contain mix-blend-multiply" 
                            />
                        ) : (
                            <span className="text-slate-200 uppercase font-black text-[10px] mb-4">Awaiting Signature</span>
                        )}
                    </div>
                    <div className="w-full border-t-2 border-slate-900 pt-2">
                        <p className="font-black text-[10px] uppercase text-slate-900">{data.headmasterName || 'Headmaster'}</p>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Authorized Official Stamp</p>
                    </div>
                </div>
            </div>

            {/* ── FOOTER ── */}
            <div className="mt-12 flex items-center justify-between opacity-40">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={12} className="text-indigo-600" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                        Fingerprint: {data.digitalFingerprint || 'GAM-EDU-VERIFIED'}
                    </span>
                </div>
                <p className="text-[8px] font-bold italic text-slate-400 uppercase">Powered by GAM IT Solutions</p>
            </div>
        </div>
    );
}