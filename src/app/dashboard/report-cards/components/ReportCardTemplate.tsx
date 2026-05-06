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
 * Supports dual-brand colors for sophisticated Institutional white-labeling.
 */
export default function ReportCardTemplate({ data, classTeacherComment, headmasterComment, caWeight, examWeight }: ReportCardTemplateProps) {
    if (!data) return null;

    const primaryTheme = data.brandColor || '#1e293b';
    const secondaryTheme = data.secondaryColor || primaryTheme;

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
                padding: '0px',
                gap: '0px',
                overflow: 'hidden',
            }}
        >
            {/* ── HEADER: High-Impact Dual Tone ── */}
            <div 
                className="flex flex-row items-center justify-between px-10 py-12 mb-8 rounded-b-[3rem] shadow-lg"
                style={{ backgroundColor: primaryTheme, color: '#ffffff' }}
            >
                <div className="w-24 h-24 flex shrink-0 items-center justify-center bg-white rounded-3xl p-3 shadow-inner">
                    {data.logoBase64 ? (
                        <img src={data.logoBase64} alt="Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <div className="text-[10px] text-slate-300 font-black uppercase text-center">No Logo</div>
                    )}
                </div>

                <div className="flex-1 text-right pl-8">
                    <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-2">
                        {data.schoolName || 'SCHOOL NAME'}
                    </h1>
                    {data.schoolMotto && (
                        <p className="text-sm italic opacity-80 font-medium mb-4">"{data.schoolMotto}"</p>
                    )}
                    <div className="text-[10px] font-bold uppercase tracking-[0.1em] space-y-1 opacity-70">
                        <p>{data.schoolAddress}</p>
                        <p>{[data.schoolPhone, data.schoolEmail].filter(Boolean).join(' | ')}</p>
                    </div>
                </div>
            </div>

            <div className="px-10 flex-1">
                {/* ── TITLE ── */}
                <h2 
                    className="text-2xl font-black text-center mb-8 uppercase tracking-[0.3em] py-2 border-b-4"
                    style={{ color: primaryTheme, borderBottomColor: secondaryTheme }}
                >
                    Terminal Report Card
                </h2>

                {/* ── STUDENT INFO GRID ── */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 mb-8 text-sm border-2 p-6 font-medium bg-slate-50 rounded-3xl" style={{ borderColor: `${secondaryTheme}20` }}>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Student Name</span>
                        <span className="font-black uppercase">{data.student?.firstName} {data.student?.lastName}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Term</span>
                        <span className="font-bold">{data.term}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Class</span>
                        <span className="font-black uppercase">{data.className}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Academic Year</span>
                        <span className="font-bold">{data.academicYear}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Attendance</span>
                        <span className="font-bold">{data.studentPresentDays || 0} / {data.totalClassDays || 0} Days</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1">
                        <span className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Rank in Class</span>
                        <span className="font-black underline" style={{ color: primaryTheme }}>{data.classPosition || '-'} of {data.totalStudents || 0}</span>
                    </div>
                </div>

                {/* ── NEXT TERM ALERT ── */}
                <div 
                    className="border-2 p-4 text-center mb-8 rounded-2xl shadow-sm"
                    style={{ borderColor: secondaryTheme, backgroundColor: `${secondaryTheme}08` }}
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] mr-3" style={{ color: primaryTheme }}>Next Term Reopening:</span>
                    <span className="text-lg font-black" style={{ color: primaryTheme }}>{nextTermReopening}</span>
                </div>

                {/* ── GRADES TABLE ── */}
                <table className="w-full text-xs mb-8 border-collapse rounded-xl overflow-hidden shadow-sm" style={{ border: `2px solid ${secondaryTheme}` }}>
                    <thead>
                        <tr style={{ backgroundColor: secondaryTheme, color: '#ffffff' }}>
                            <th className="p-3 text-left w-[25%] uppercase font-black text-[10px] tracking-widest">Subject</th>
                            <th className="p-3 text-center w-[10%] uppercase font-black text-[10px] tracking-widest">CA ({caWeight})</th>
                            <th className="p-3 text-center w-[10%] uppercase font-black text-[10px] tracking-widest">Exam ({examWeight})</th>
                            <th className="p-3 text-center w-[10%] uppercase font-black text-[10px] tracking-widest bg-black/10">Total</th>
                            <th className="p-3 text-center w-[8%] uppercase font-black text-[10px] tracking-widest">Avg</th>
                            <th className="p-3 text-center w-[8%] uppercase font-black text-[10px] tracking-widest">Pos</th>
                            <th className="p-3 text-center w-[8%] uppercase font-black text-[10px] tracking-widest">Grd</th>
                            <th className="p-3 text-left w-[21%] uppercase font-black text-[10px] tracking-widest">Remark</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.rows?.map((row: any, i: number) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                <td className="p-3 font-bold uppercase border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.subjectName}</td>
                                <td className="p-3 text-center border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.ca}</td>
                                <td className="p-3 text-center border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.exam}</td>
                                <td className="p-3 text-center font-black bg-slate-100/50 border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.total}</td>
                                <td className="p-3 text-center text-slate-400 border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.classAverage}</td>
                                <td className="p-3 text-center font-bold border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.position}</td>
                                <td className="p-3 text-center font-black border-r" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.grade}</td>
                                <td className="p-3 italic text-slate-600 text-[10px]">{row.autoRemark}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ── REMARKS ── */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="p-5 border-2 rounded-3xl bg-slate-50" style={{ borderColor: `${secondaryTheme}40` }}>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Class Teacher's Remark</h4>
                        <p className="text-sm italic text-slate-800 leading-relaxed">"{classTeacherComment || 'Progress satisfactory.'}"</p>
                    </div>
                    <div className="p-5 border-2 rounded-3xl bg-slate-50" style={{ borderColor: `${secondaryTheme}40` }}>
                        <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Headmaster's Remark</h4>
                        <p className="text-sm italic text-slate-800 leading-relaxed">"{headmasterComment || 'Pending official review.'}"</p>
                    </div>
                </div>

                {/* ── SIGNATURES ── */}
                <div 
                    className="grid grid-cols-2 gap-20 pt-10 border-t-4 border-double"
                    style={{ borderTopColor: `${primaryTheme}20` }}
                >
                    <div className="text-center flex flex-col items-center">
                        <div className="h-20 flex items-end justify-center mb-2">
                            {data.teacherSigBase64 || data.classTeacherSignatureUrl ? (
                                <img 
                                    src={data.teacherSigBase64 || data.classTeacherSignatureUrl} 
                                    alt="Teacher Sig" 
                                    className="max-h-16 object-contain mix-blend-multiply contrast-125" 
                                />
                            ) : (
                                <span className="text-slate-200 uppercase font-black text-[10px] mb-4">Awaiting Signature</span>
                            )}
                        </div>
                        <div className="w-full border-t-2 border-slate-900 pt-2">
                            <p className="font-black text-[11px] uppercase text-slate-900">{data.classTeacherName || 'Class Teacher'}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Electronic Signature Verified</p>
                        </div>
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <div className="h-20 flex items-end justify-center mb-2 w-full">
                            {data.headmasterSigBase64 || data.headmasterSignatureUrl ? (
                                <img 
                                    src={data.headmasterSigBase64 || data.headmasterSignatureUrl} 
                                    alt="Headmaster Sig" 
                                    className="max-h-16 max-w-full object-contain mix-blend-multiply contrast-125" 
                                />
                            ) : (
                                <span className="text-slate-200 uppercase font-black text-[10px] mb-4">Awaiting Signature</span>
                            )}
                        </div>
                        <div className="w-full border-t-2 border-slate-900 pt-2">
                            <p className="font-black text-[11px] uppercase text-slate-900">{data.headmasterName || 'Headmaster'}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Authorized Official Stamp</p>
                        </div>
                    </div>
                </div>

                {/* ── FOOTER ── */}
                <div className="mt-12 mb-6 flex items-center justify-between opacity-30">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={12} style={{ color: primaryTheme }} />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-500">
                            Digital Key: {data.digitalFingerprint || 'GAM-EDU-VERIFIED'}
                        </span>
                    </div>
                    <p className="text-[8px] font-bold italic text-slate-400 uppercase">Generated by GAM IT Solutions</p>
                </div>
            </div>
        </div>
    );
}
