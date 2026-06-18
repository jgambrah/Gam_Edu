'use client';

import React from 'react';
import { ShieldCheck, User, Calendar, GraduationCap, Award, CheckCircle2, BookOpen } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { DEFAULT_GRADING_SYSTEM, type GradeBracket } from '@/lib/utils';

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
 * Styled with an authentic double-border certificate design and high-contrast tables.
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
            className="bg-white text-black font-sans flex flex-col relative"
            style={{
                width: '794px',
                minHeight: '1123px',
                boxSizing: 'border-box',
                margin: '0 auto',
                padding: '24px',
                overflow: 'hidden',
            }}
        >
            {/* ── CERTIFICATE EMBELLISHMENT FRAME ── */}
            <div 
                className="border-8 p-6 flex-1 flex flex-col justify-between"
                style={{ borderColor: primaryTheme, borderStyle: 'double', borderRadius: '1.5rem' }}
            >
                {/* ── HEADER CREST & BRANDING ── */}
                <div 
                    className="flex flex-row items-center justify-between p-6 rounded-2xl shadow-sm border border-slate-100"
                    style={{ background: `linear-gradient(135deg, ${primaryTheme}e6, ${primaryTheme})`, color: '#ffffff' }}
                >
                    <div className="w-20 h-20 flex shrink-0 items-center justify-center bg-white rounded-2xl p-2.5 shadow-md border border-white/20">
                        {data.logoBase64 || data.logoUrl ? (
                            <img src={data.logoBase64 || data.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="text-[9px] text-slate-350 font-black uppercase text-center leading-tight">School Logo</div>
                        )}
                    </div>

                    <div className="flex-1 text-right pl-6">
                        <h1 className="text-2xl font-black uppercase tracking-tight leading-none mb-1.5">
                            {data.schoolName || 'SCHOOL NAME'}
                        </h1>
                        {data.schoolMotto && (
                            <p className="text-xs italic opacity-85 font-medium mb-3">"{data.schoolMotto}"</p>
                        )}
                        <div className="text-[8px] font-bold uppercase tracking-widest space-y-0.5 opacity-70">
                            <p>{data.schoolAddress}</p>
                            <p>{[data.schoolPhone, data.schoolEmail].filter(Boolean).join(' | ')}</p>
                        </div>
                    </div>
                </div>

                {/* ── TRANSCRIPT TITLE BADGE ── */}
                <div className="my-5 flex flex-col items-center">
                    <div 
                        className="text-xs font-black uppercase tracking-[0.25em] px-6 py-1.5 border-y-2 text-center"
                        style={{ color: primaryTheme, borderColor: `${primaryTheme}30` }}
                    >
                        Official Terminal Transcript
                    </div>
                </div>

                {/* ── PASSPORT-STYLE STUDENT CREDENTIALS GRID ── */}
                <div 
                    className="grid grid-cols-2 gap-x-8 gap-y-2.5 mb-5 text-xs border p-5 font-semibold bg-slate-50/60 rounded-2xl" 
                    style={{ borderColor: `${secondaryTheme}20` }}
                >
                    <div className="flex justify-between items-center border-b border-slate-150 pb-1.5">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                            <User className="h-3 w-3 text-slate-400" /> Student Name
                        </span>
                        <span className="font-black uppercase text-slate-900">{data.student?.firstName} {data.student?.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-150 pb-1.5">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-400" /> Academic Term
                        </span>
                        <span className="font-bold text-slate-900">{data.term}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-150 pb-1.5">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="h-3 w-3 text-slate-400" /> Target Class
                        </span>
                        <span className="font-black uppercase text-slate-900">{data.className}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-150 pb-1.5">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-400" /> School Year
                        </span>
                        <span className="font-bold text-slate-900">{data.academicYear}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-150 pb-1.5">
                        <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-slate-400" /> Attendance
                        </span>
                        <span className="font-bold text-slate-900">{data.studentPresentDays || 0} / {data.totalClassDays || 0} Days</span>
                    </div>
                    {(data.reportCardPositionMode || 'both') === 'both' && (
                        <div className="flex justify-between items-center border-b border-slate-150 pb-1.5">
                            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-wider flex items-center gap-1.5">
                                <Award className="h-3 w-3 text-slate-400" /> Class Position
                            </span>
                            <span className="font-black underline" style={{ color: primaryTheme }}>
                                {data.classPosition || '-'} of {data.totalStudents || 0}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── ACADEMIC TRANSCRIPT TABLE ── */}
                {(() => {
                    const showSubjectPosition = (data.reportCardPositionMode || 'both') !== 'none';
                    const subjectWidth = showSubjectPosition ? 'w-[25%]' : 'w-[33%]';
                    return (
                        <table className="w-full text-[10px] mb-5 border-collapse rounded-xl overflow-hidden shadow-sm" style={{ border: `1.5px solid ${secondaryTheme}` }}>
                            <thead>
                                <tr style={{ backgroundColor: secondaryTheme, color: '#ffffff' }}>
                                    <th className={`p-2.5 text-left ${subjectWidth} uppercase font-black text-[9px] tracking-widest`}>Subject</th>
                                    <th className="p-2.5 text-center w-[10%] uppercase font-black text-[9px] tracking-widest">CA ({caWeight})</th>
                                    <th className="p-2.5 text-center w-[10%] uppercase font-black text-[9px] tracking-widest">Exam ({examWeight})</th>
                                    <th className="p-2.5 text-center w-[10%] uppercase font-black text-[9px] tracking-widest bg-black/10">Total</th>
                                    <th className="p-2.5 text-center w-[8%] uppercase font-black text-[9px] tracking-widest">Avg</th>
                                    {showSubjectPosition && (
                                        <th className="p-2.5 text-center w-[8%] uppercase font-black text-[9px] tracking-widest">Pos</th>
                                    )}
                                    <th className="p-2.5 text-center w-[8%] uppercase font-black text-[9px] tracking-widest">Grade</th>
                                    <th className="p-2.5 text-left w-[21%] uppercase font-black text-[9px] tracking-widest">Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.rows?.map((row: any, i: number) => {
                                    const gradeVal = (row.grade || '').toUpperCase();
                                    const isFail = gradeVal.includes('F') || gradeVal.includes('E');
                                    const isExcellent = gradeVal.includes('A') || gradeVal.includes('*');
                                    
                                    return (
                                        <tr key={i} className={`border-b border-slate-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="p-2.5 font-bold uppercase border-r text-slate-800 flex items-center gap-1.5" style={{ borderRightColor: `${secondaryTheme}20` }}>
                                                <BookOpen className="h-3 w-3 text-slate-400" />
                                                {row.subjectName}
                                            </td>
                                            <td className="p-2.5 text-center border-r text-slate-700" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.ca}</td>
                                            <td className="p-2.5 text-center border-r text-slate-700" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.exam}</td>
                                            <td className="p-2.5 text-center font-black bg-slate-100/30 border-r text-slate-900" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.total}</td>
                                            <td className="p-2.5 text-center text-slate-400 border-r font-mono text-[9px]" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.classAverage}</td>
                                            {showSubjectPosition && (
                                                <td className="p-2.5 text-center font-bold border-r text-slate-700 font-mono text-[9px]" style={{ borderRightColor: `${secondaryTheme}20` }}>{row.position}</td>
                                            )}
                                            <td className={`p-2.5 text-center font-black border-r ${
                                                isExcellent ? 'text-emerald-700' : isFail ? 'text-rose-600' : 'text-amber-600'
                                            }`} style={{ borderRightColor: `${secondaryTheme}20` }}>
                                                {row.grade}
                                            </td>
                                            <td className="p-2.5 italic text-slate-500 text-[9px] leading-snug">{row.autoRemark}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    );
                })()}

                {/* ── OFFICIAL GRADING SYSTEM SCALE KEY ── */}
                {(() => {
                    const gradingScale: GradeBracket[] = data.gradingSystem || DEFAULT_GRADING_SYSTEM;
                    const sortedScale = [...gradingScale].sort((a, b) => b.minScore - a.minScore);
                    
                    const getGradeColorClass = (grade: string) => {
                        const g = grade.toUpperCase();
                        if (g.includes('A') || g.includes('*')) return 'text-emerald-700';
                        if (g.includes('B')) return 'text-indigo-650';
                        if (g.includes('C')) return 'text-amber-650';
                        if (g.includes('D')) return 'text-orange-500';
                        if (g.includes('E')) return 'text-slate-500';
                        if (g.includes('F')) return 'text-rose-600';
                        return 'text-slate-650';
                    };
                    
                    return (
                        <div className="mb-4">
                            <h4 className="text-[9px] font-black uppercase mb-1 border-b border-slate-200 w-max pr-4" style={{ color: secondaryTheme }}>
                                Official Grading System Key
                            </h4>
                            <div 
                                className="grid border border-slate-200 bg-slate-50/50 divide-x divide-slate-200 text-[8px] rounded-lg overflow-hidden"
                                style={{ gridTemplateColumns: `repeat(${sortedScale.length}, minmax(0, 1fr))` }}
                            >
                                {sortedScale.map((bracket, index) => {
                                    const isFail = bracket.grade.toUpperCase().includes('F');
                                    return (
                                        <div key={index} className={`p-1.5 text-center flex flex-col justify-center ${isFail ? 'bg-rose-50/20' : ''}`}>
                                            <span className="font-extrabold text-slate-700">{bracket.minScore} - {bracket.maxScore}%</span>
                                            <span className={`font-black text-[9px] mt-0.5 ${getGradeColorClass(bracket.grade)}`}>{bracket.grade}</span>
                                            <span className="italic text-[7.5px] text-slate-400 mt-0.5 truncate">{bracket.remark}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                {/* ── NEXT TERM REOPENING DETAILS BANNER ── */}
                <div 
                    className="border p-3 text-center mb-5 rounded-xl shadow-sm"
                    style={{ borderColor: `${secondaryTheme}40`, backgroundColor: `${secondaryTheme}05` }}
                >
                    <span className="text-[9px] font-black uppercase tracking-wider mr-2" style={{ color: primaryTheme }}>Next Term Reopening Date:</span>
                    <span className="text-sm font-black" style={{ color: primaryTheme }}>{nextTermReopening}</span>
                </div>

                {/* ── COMMENTS & REMARKS CARD PANELS ── */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-slate-150 rounded-2xl bg-slate-50/30">
                        <h4 className="text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Class Teacher's Remark</h4>
                        <p className="text-xs italic text-slate-800 leading-relaxed">"{classTeacherComment || 'Progress satisfactory.'}"</p>
                    </div>
                    <div className="p-4 border border-slate-150 rounded-2xl bg-slate-50/30">
                        <h4 className="text-[9px] font-black uppercase text-slate-400 mb-1.5 tracking-wider">Headmaster's Remark</h4>
                        <p className="text-xs italic text-slate-800 leading-relaxed">"{headmasterComment || 'Pending official review.'}"</p>
                    </div>
                </div>

                {/* ── ELECTRONIC STAMP SIGNATURES ── */}
                <div 
                    className="grid grid-cols-2 gap-16 pt-5 border-t border-dashed"
                    style={{ borderTopColor: `${primaryTheme}30` }}
                >
                    <div className="text-center flex flex-col items-center">
                        <div className="h-16 flex items-end justify-center mb-1.5">
                            {data.teacherSigBase64 || data.classTeacherSignatureUrl ? (
                                <img 
                                    src={data.teacherSigBase64 || data.classTeacherSignatureUrl} 
                                    alt="Teacher Sig" 
                                    className="max-h-12 object-contain mix-blend-multiply contrast-125" 
                                />
                            ) : (
                                <span className="text-slate-300 uppercase font-bold text-[8px] mb-3">Awaiting Signature</span>
                            )}
                        </div>
                        <div className="w-full border-t border-slate-300 pt-1.5">
                            <p className="font-black text-[10px] uppercase text-slate-900">{data.classTeacherName || 'Class Teacher'}</p>
                            <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">E-Signature Verified</p>
                        </div>
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <div className="h-16 flex items-end justify-center mb-1.5 w-full">
                            {data.headmasterSigBase64 || data.headmasterSignatureUrl ? (
                                <img 
                                    src={data.headmasterSigBase64 || data.headmasterSignatureUrl} 
                                    alt="Headmaster Sig" 
                                    className="max-h-12 max-w-full object-contain mix-blend-multiply contrast-125" 
                                />
                            ) : (
                                <span className="text-slate-300 uppercase font-bold text-[8px] mb-3">Awaiting Approval</span>
                            )}
                        </div>
                        <div className="w-full border-t border-slate-300 pt-1.5">
                            <p className="font-black text-[10px] uppercase text-slate-900">{data.headmasterName || 'Head of School'}</p>
                            <p className="text-[7.5px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Authorized Official Stamp</p>
                        </div>
                    </div>
                </div>

                {/* ── SECURITY FOOTER ── */}
                <div className="mt-8 flex items-center justify-between opacity-35">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={11} style={{ color: primaryTheme }} className="text-indigo-650 animate-pulse" />
                        <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-500">
                            Secured Transcript Fingerprint: {data.digitalFingerprint || 'GAM-EDU-AUTHENTIC'}
                        </span>
                    </div>
                    <p className="text-[7.5px] font-bold italic text-slate-400 uppercase">Verified by GAM Edu Cloud Systems</p>
                </div>
            </div>
        </div>
    );
}
