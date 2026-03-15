'use client';

import React from 'react';

interface ReportCardTemplateProps {
    data: any;
    classTeacherComment: string;
    headmasterComment: string;
    caWeight: number;
    examWeight: number;
}

/**
 * Standardized Report Card Template for GAM Edu.
 * Used for both live preview and PDF generation.
 */
export default function ReportCardTemplate({ data, classTeacherComment, headmasterComment, caWeight, examWeight }: ReportCardTemplateProps) {
    if (!data) return null;

    return (
        <div
            id="pdf-content"
            style={{
                width: '794px',
                minHeight: '1123px',
                maxHeight: '1123px',
                color: 'black',
                boxSizing: 'border-box',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '20px 30px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0px',
                overflow: 'hidden',
                fontFamily: 'sans-serif'
            }}
        >
            {/* ── HEADER ── */}
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '3px double #1e293b',
                paddingBottom: '8px',
                marginBottom: '8px',
            }}>
                {/* Logo */}
                <div style={{ width: '80px', height: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    {data.logoBase64 ? (
                        <img
                            src={data.logoBase64}
                            alt="School Logo"
                            style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'contain', display: 'block' }}
                        />
                    ) : (
                        <div style={{ width: 80, height: 80, background: '#f1f5f9', border: '1px dashed #94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                            No Logo
                        </div>
                    )}
                </div>

                {/* School Info */}
                <div style={{ flex: 1, textAlign: 'center', padding: '0 10px' }}>
                    <div style={{ fontSize: '25px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                        {data.schoolName || 'SCHOOL NAME'}
                    </div>
                    {data.schoolMotto && (
                        <div style={{ fontSize: '14px', fontStyle: 'italic', color: '#475569', marginTop: '1px' }}>
                            "{data.schoolMotto}"
                        </div>
                    )}
                    <div style={{ fontSize: '14px', fontWeight: 700, marginTop: '3px' }}>{data.schoolAddress || ''}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>
                        {[data.schoolPhone, data.schoolEmail].filter(Boolean).join(' | ')}
                    </div>
                </div>

                <div style={{ width: '80px', flexShrink: 0 }} />
            </div>

            {/* ── REPORT TITLE ── */}
            <div style={{
                fontSize: '19px',
                fontWeight: 800,
                textAlign: 'center',
                marginBottom: '8px',
                background: '#f1f5f9',
                padding: '5px',
                border: '1px solid #cbd5e1',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
            }}>
                Terminal Report Card
            </div>

            {/* ── STUDENT INFO ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '4px 16px',
                marginBottom: '8px',
                fontSize: '15px',
                border: '1px solid #cbd5e1',
                padding: '8px 12px',
                fontWeight: 500,
                background: '#f8fafc',
            }}>
                <div><strong>Name:</strong> {data.student?.firstName} {data.student?.lastName}</div>
                <div><strong>Term:</strong> {data.term}</div>
                <div><strong>Class:</strong> {data.className}</div>
                <div><strong>Academic Year:</strong> {data.academicYear}</div>
                <div><strong>Attendance:</strong> {data.studentPresentDays || 0} / {data.totalClassDays || 0} days</div>
                <div style={{ gridColumn: '1 / -1', marginTop: '4px', paddingTop: '4px', borderTop: '1px solid #cbd5e1', display: 'flex', justifyContent: 'space-between' }}>
                    <span>
                        <strong>Position: </strong>
                        <span style={{ fontWeight: 800, textDecoration: 'underline' }}>{data.classPosition || '-'}</span> of {data.totalStudents || 0}
                    </span>
                    <span>
                        <strong>Overall Average: </strong>
                        <span style={{ fontWeight: 800, textDecoration: 'underline' }}>{data.overallAverage || 0}%</span>
                    </span>
                </div>
            </div>

            {/* ── GRADES TABLE ── */}
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse', marginBottom: '8px', tableLayout: 'fixed' }}>
                <colgroup>
                    <col style={{ width: '22%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '7%' }} />
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '10%' }} />
                    <col style={{ width: '29%' }} />
                </colgroup>
                <thead>
                    <tr style={{ background: '#f1f5f9', fontSize: '13px' }}>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'left' }}>Subject</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>CA ({caWeight})</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>Ex ({examWeight})</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>Total</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>Avg</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>Grd</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>Pos</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'center' }}>Remark</th>
                        <th style={{ border: '1px solid #1e293b', padding: '4px', textAlign: 'left' }}>Teacher Comment</th>
                    </tr>
                </thead>
                <tbody>
                    {data.rows?.map((row: any, i: number) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.subjectName}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center' }}>{row.ca}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center' }}>{row.exam}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center', fontWeight: 900, background: '#f1f5f9' }}>{row.total}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center', color: '#64748b' }}>{row.classAverage}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center', fontWeight: 700 }}>{row.grade}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center' }}>{row.position}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', textAlign: 'center', fontWeight: 600 }}>{row.autoRemark}</td>
                            <td style={{ border: '1px solid #1e293b', padding: '3px 4px', fontStyle: 'italic', color: '#475569', fontSize: '12.5px', wordBreak: 'break-word' }}>{row.teacherRemark || '-'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ── GRADING KEY ── */}
            <div style={{
                border: '1px solid #cbd5e1',
                padding: '4px 10px',
                fontSize: '13px',
                background: '#f8fafc',
                marginBottom: '8px',
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                <strong>Grading Key:</strong>
                <span>80–100: A (Excellent)</span>
                <span>70–79: B (Very Good)</span>
                <span>60–69: C (Good)</span>
                <span>50–59: D (Credit)</span>
                <span>40–49: E (Pass)</span>
                <span>0–39: F (Fail)</span>
            </div>

            {/* ── REMARKS ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
                        Class Teacher's Remark:
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: '#1e293b',
                        lineHeight: 1.3,
                        whiteSpace: 'pre-wrap',
                        minHeight: '20px',
                    }}>
                        {classTeacherComment || '...'}
                    </div>
                </div>
                <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 10px', background: '#f8fafc' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '4px' }}>
                        Headmaster's Remark:
                    </div>
                    <div style={{
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: '#1e293b',
                        lineHeight: 1.3,
                        whiteSpace: 'pre-wrap',
                        minHeight: '20px',
                    }}>
                        {headmasterComment || '...'}
                    </div>
                </div>
            </div>

            {/* ── SIGNATURES ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '40px',
                borderTop: '1px dashed #cbd5e1',
                paddingTop: '10px',
                marginTop: 'auto',
                marginBottom: '10px'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '20px', borderBottom: '1px solid black', width: '60%', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Class Teacher Signature
                    </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ height: '20px', borderBottom: '1px solid black', width: '60%', margin: '0 auto 4px' }} />
                    <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                        Headmaster Signature
                    </div>
                </div>
            </div>
            
            <div style={{ fontSize: '11px', textAlign: 'center', color: '#94a3b8' }}>
                Generated via GAM Edu Management System
            </div>
        </div>
    );
}
