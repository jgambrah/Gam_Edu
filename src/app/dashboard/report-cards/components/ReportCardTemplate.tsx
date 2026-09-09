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

    const rawSchoolName = data.schoolName || 'SCHOOL NAME';
    const displaySchoolName = rawSchoolName
        .replace(/\bACADMY\b/gi, 'ACADEMY')
        .replace(/SUNNY\s+SIDE\s+ACADMY/gi, 'SUNNY SIDE ACADEMY');

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
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
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
                            {displaySchoolName}
                        </h1>
                        {data.schoolMotto && (
                            <p className="text-xs italic opacity-85 font-medium mb-3">"{data.schoolMotto}"</p>
                        )}
                        <div className="text-[8px] font-bold uppercase tracking-widest space-y-0.5 opacity-70">
                            <p>{data.schoolAddress}</p>
                            <p>{[data.schoolPhone, data.schoolEmail, data.schoolWebsite || data.website].filter(Boolean).join(' | ')}</p>
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
                    style={{ borderColor: `${secondaryTheme}35` }}
                >
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                        <span className="text-slate-950 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                            <User className="h-3 w-3 text-slate-800" /> Student Name
                        </span>
                        <span className="font-black uppercase text-black">{data.student?.firstName} {data.student?.lastName}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                        <span className="text-slate-955 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-800" /> Academic Term
                        </span>
                        <span className="font-black text-black">{data.term}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                        <span className="text-slate-955 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                            <GraduationCap className="h-3 w-3 text-slate-800" /> Class Recorded
                        </span>
                        <span className="font-black uppercase text-black">{data.className}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                        <span className="text-slate-955 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 text-slate-800" /> School Year
                        </span>
                        <span className="font-black text-black">{data.academicYear}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                        <span className="text-slate-955 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="h-3 w-3 text-slate-800" /> Attendance
                        </span>
                        <span className="font-black text-black">{data.studentPresentDays || 0} / {data.totalClassDays || 0} Days</span>
                    </div>
                    {(data.reportCardPositionMode || 'both') === 'both' && (
                        <div className="flex justify-between items-center border-b border-slate-300 pb-1.5">
                            <span className="text-slate-955 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                                <Award className="h-3 w-3 text-slate-800" /> Class Position
                            </span>
                            <span className="font-black underline text-black" style={{ textDecorationColor: primaryTheme }}>
                                {data.classPosition || '-'} of {data.totalClassStudents || data.cohortTotal || data.totalStudents || 0}
                            </span>
                        </div>
                    )}
                    {(data.term === 'Third Term' || data.term === 'Term 3' || data.term === '3' || data.term === 'third term') && data.promotionDecision && (
                        <div className="flex justify-between items-center border-b border-slate-300 pb-2 col-span-2 px-1">
                            <span className="text-slate-955 font-black uppercase text-[9.5px] tracking-wider flex items-center gap-1.5">
                                <GraduationCap className="h-3.5 w-3.5 text-slate-800" /> Promotion Status
                            </span>
                            <span className="font-black uppercase text-[10px] mr-1">
                                {data.promotionDecision === 'Promoted' && (
                                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 px-3.5 py-1 rounded-full border-2 border-emerald-400 font-black tracking-wide shadow-sm">
                                        Promoted to {data.promotedToClassName || 'Next Class'}
                                    </span>
                                )}
                                {data.promotionDecision === 'Repeated' && (
                                    <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-900 px-3.5 py-1 rounded-full border-2 border-rose-400 font-black tracking-wide shadow-sm">
                                        Repeated in {data.className}
                                    </span>
                                )}
                                {data.promotionDecision === 'Graduated' && (
                                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-3.5 py-1 rounded-full border-2 border-amber-400 font-black tracking-wide shadow-sm">
                                        Graduated 🎓
                                    </span>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {/* ── ACADEMIC TRANSCRIPT TABLE ── */}
                {(() => {
                    const showSubjectPosition = (data.reportCardPositionMode || 'both') !== 'none';
                    const subjectWidth = showSubjectPosition ? 'w-[34%]' : 'w-[40%]';
                    return (
                        <table className="w-full text-[11.5px] mb-4 border-collapse rounded-xl overflow-hidden shadow-sm" style={{ border: `1.5px solid ${secondaryTheme}` }}>
                            <thead>
                                <tr style={{ backgroundColor: secondaryTheme, color: '#ffffff' }}>
                                    <th className={`p-2 text-left ${subjectWidth} uppercase font-black text-[10.5px] tracking-widest`}>Subject</th>
                                    <th className="p-2 text-center w-[8.5%] uppercase font-black text-[10px] tracking-wider">CA ({caWeight})</th>
                                    <th className="p-2 text-center w-[8.5%] uppercase font-black text-[10px] tracking-wider">Exam ({examWeight})</th>
                                    <th className="p-2 text-center w-[8.5%] uppercase font-black text-[10px] tracking-wider bg-black/10">Total</th>
                                    <th className="p-2 text-center w-[8.5%] uppercase font-black text-[10px] tracking-wider">Class Avg</th>
                                    {showSubjectPosition && (
                                        <th className="p-2 text-center w-[6%] uppercase font-black text-[10px] tracking-wider">Pos</th>
                                    )}
                                    <th className="p-2 text-center w-[6%] uppercase font-black text-[10px] tracking-wider">Grade</th>
                                    <th className={`p-2 text-left ${showSubjectPosition ? 'w-[20%]' : 'w-[20%]'} uppercase font-black text-[10.5px] tracking-widest`}>Remarks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.rows?.map((row: any, i: number) => {
                                    const gradeVal = (row.grade || '').toUpperCase();
                                    const isFail = gradeVal.includes('F') || gradeVal.includes('E');
                                    const isExcellent = gradeVal.includes('A') || gradeVal.includes('*');
                                    const nameLen = (row.subjectName || '').length;
                                    
                                    return (
                                        <tr key={i} className={`border-b border-slate-300 last:border-0 h-8 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="py-1.5 px-2.5 font-extrabold uppercase border-r text-black whitespace-nowrap" style={{ borderRightColor: `${secondaryTheme}35` }}>
                                                <div className="flex items-center gap-1.5 overflow-hidden">
                                                    <BookOpen className="h-3 w-3 text-slate-800 shrink-0" />
                                                    <span className={`tracking-tight truncate ${
                                                        nameLen > 24 
                                                            ? 'text-[10px]' 
                                                            : nameLen > 18 
                                                                ? 'text-[10.5px]' 
                                                                : 'text-[11.5px]'
                                                    }`}>
                                                        {row.subjectName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-1.5 px-2 text-center border-r text-black font-bold text-[12px]" style={{ borderRightColor: `${secondaryTheme}35` }}>{row.ca}</td>
                                            <td className="py-1.5 px-2 text-center border-r text-black font-bold text-[12px]" style={{ borderRightColor: `${secondaryTheme}35` }}>{row.exam}</td>
                                            <td className="py-1.5 px-2 text-center font-black bg-slate-100/50 border-r text-black text-[12.5px]" style={{ borderRightColor: `${secondaryTheme}35` }}>{row.total}</td>
                                            <td className="py-1.5 px-2 text-center text-slate-900 border-r font-black text-[10.5px] font-mono" style={{ borderRightColor: `${secondaryTheme}35` }}>{row.classAverage}</td>
                                            {showSubjectPosition && (
                                                <td className="py-1.5 px-2 text-center font-black border-r text-black text-[10.5px] font-mono" style={{ borderRightColor: `${secondaryTheme}35` }}>{row.position}</td>
                                            )}
                                            <td className={`py-1.5 px-2 text-center font-black border-r text-[12.5px] ${
                                                isExcellent ? 'text-emerald-800' : isFail ? 'text-rose-700' : 'text-amber-800'
                                            }`} style={{ borderRightColor: `${secondaryTheme}35` }}>
                                                {row.grade}
                                            </td>
                                            <td className="py-1.5 px-2.5 italic text-slate-955 font-bold text-[10px] leading-tight truncate">{row.autoRemark}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    );
                })()}

                {/* ── OFFICIAL GRADING SYSTEM SCALE KEY ── */}
                {(() => {
                    const gradingScale: GradeBracket[] = (Array.isArray(data?.gradingSystem) && data.gradingSystem.length > 0)
                        ? data.gradingSystem
                        : DEFAULT_GRADING_SYSTEM;
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
                        <div className="mb-3">
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
                                            <span className="font-black text-slate-950">{bracket.minScore} - {bracket.maxScore}%</span>
                                            <span className={`font-black text-[9px] mt-0.5 ${getGradeColorClass(bracket.grade)}`}>{bracket.grade}</span>
                                            <span className="italic text-[7.5px] text-slate-900 font-bold mt-0.5 truncate">{bracket.remark}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })()}

                {/* ── NEXT TERM REOPENING DETAILS BANNER ── */}
                <div className="my-2 py-1.5 px-3 rounded-lg border border-amber-200 bg-amber-50 text-amber-900 shadow-sm flex items-center justify-center gap-2.5">
                    <div className="flex items-center gap-1.5 font-black text-[9.5px] uppercase tracking-wider text-amber-800 shrink-0">
                        <Calendar className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>Next Term Reopening Date:</span>
                    </div>
                    <span className="text-xs font-black tracking-wide text-amber-950 underline decoration-amber-400 decoration-2 underline-offset-2">
                        {nextTermReopening}
                    </span>
                </div>

                {/* ── COMMENTS & REMARKS CARD PANELS ── */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 border border-slate-300 rounded-2xl bg-slate-50/50">
                        <h4 className="text-[9.5px] font-black uppercase text-slate-950 mb-1.5 tracking-wider">Class Teacher's Remark</h4>
                        <p className="text-xs italic text-black font-extrabold leading-relaxed">"{classTeacherComment || 'Progress satisfactory.'}"</p>
                    </div>
                    <div className="p-4 border border-slate-300 rounded-2xl bg-slate-50/50">
                        <h4 className="text-[9.5px] font-black uppercase text-slate-950 mb-1.5 tracking-wider">Headmaster's Remark</h4>
                        <p className="text-xs italic text-black font-extrabold leading-relaxed">"{headmasterComment || 'Pending official review.'}"</p>
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
                                <span className="text-slate-400 uppercase font-black text-[8px] mb-3">Awaiting Signature</span>
                            )}
                        </div>
                        <div className="w-full border-t border-slate-300 pt-1.5">
                            <p className="font-black text-[10px] uppercase text-black">{data.classTeacherName || 'Class Teacher'}</p>
                            <p className="text-[7.5px] font-black text-slate-900 uppercase tracking-widest mt-0.5">E-Signature Verified</p>
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
                                <span className="text-slate-400 uppercase font-black text-[8px] mb-3">Awaiting Approval</span>
                            )}
                        </div>
                        <div className="w-full border-t border-slate-300 pt-1.5">
                            <p className="font-black text-[10px] uppercase text-black">{data.headmasterName || 'Head of School'}</p>
                            <p className="text-[7.5px] font-black text-slate-900 uppercase tracking-widest mt-0.5">Authorized Official Stamp</p>
                        </div>
                    </div>
                </div>

                {/* ── SECURITY FOOTER ── */}
                <div className="mt-8 flex items-center justify-between opacity-75">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck size={11} style={{ color: primaryTheme }} className="text-indigo-650 animate-pulse" />
                        <span className="text-[7.5px] font-black uppercase tracking-widest text-slate-800">
                            Secured Transcript Fingerprint: {data.digitalFingerprint || 'GAM-EDU-AUTHENTIC'}
                        </span>
                    </div>
                    <p className="text-[7.5px] font-black italic text-slate-700 uppercase">Verified by GAM Edu Cloud Systems</p>
                </div>
            </div>
        </div>
    );
}
