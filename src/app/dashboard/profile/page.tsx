'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRole } from '@/context/role-context';
import { doc, getDoc } from 'firebase/firestore';
import SignatureManager from '@/components/profile/SignatureManager';
import ProfilePhotoManager from '@/components/profile/ProfilePhotoManager';
import { Mail, ShieldCheck, Shield, GraduationCap, Calendar, Building, BookOpen, User, Tag, IdCard, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function MyProfilePage() {
  const { user } = useUser();
  const { profile, role } = useRole();
  const firestore = useFirestore();

  const isStaff = role && role !== 'Student' && role !== 'Parent';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-slate-900">
          My <span className="text-blue-600">Identity</span>
        </h1>
        <p className="text-slate-500 font-bold text-xs uppercase italic tracking-widest">Personal Verification & Security Profile</p>
      </div>

      {role === 'Student' && firestore && profile && (
          <StudentProfileDetails profile={profile} firestore={firestore} />
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT: IDENTITY INFO */}
        <div className="md:col-span-1 space-y-6">
            <Card className="rounded-[40px] shadow-xl border-4 border-slate-900 overflow-hidden bg-white">
                <CardHeader className="bg-slate-50 text-center pb-8 pt-10 border-b">
                    <div className="h-24 w-24 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-indigo-600 font-black text-3xl mb-4 border-4 border-white shadow-lg overflow-hidden">
                        {profile?.photoURL ? (
                          <img src={profile.photoURL} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                          <span>{profile?.firstName?.[0]}{profile?.lastName?.[0]}</span>
                        )}
                    </div>
                    <CardTitle className="text-xl font-black uppercase tracking-tight">{profile?.firstName} {profile?.lastName}</CardTitle>
                    <div className="flex justify-center mt-2">
                        <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold px-3 py-1">
                            {role}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-slate-100 rounded-lg"><Mail className="h-4 w-4 text-slate-500" /></div>
                        <span className="text-slate-600 font-bold truncate">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <div className="p-2 bg-green-100 rounded-lg"><ShieldCheck className="h-4 w-4 text-green-600" /></div>
                        <span className="text-slate-600 font-bold">Authenticated User</span>
                    </div>
                </CardContent>
            </Card>
            
            <div className="p-6 bg-slate-900 text-indigo-100 rounded-[32px] space-y-2 shadow-lg border-b-8 border-indigo-500">
                <Shield className="h-6 w-6 text-indigo-400 mb-2"/>
                <h4 className="font-bold text-sm uppercase tracking-tight">Enterprise Security</h4>
                <p className="text-[10px] leading-relaxed opacity-70 font-medium">
                    Your profile is part of the school's verified cloud directory. Photo IDs {isStaff ? 'and digital signatures' : ''} are cryptographically tied to your specific credentials.
                </p>
            </div>
        </div>

        {/* RIGHT: PHOTO & SIGNATURE MANAGEMENT */}
        <div className="md:col-span-2 space-y-8">
            <ProfilePhotoManager />
            {isStaff && <SignatureManager />}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT: StudentProfileDetails ---
function StudentProfileDetails({ profile, firestore }: { profile: any; firestore: any }) {
    const [className, setClassName] = useState('Loading...');
    const [teacherName, setTeacherName] = useState('Loading...');
    const [academicYear, setAcademicYear] = useState('Loading...');
    const [term, setTerm] = useState('Loading...');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchStudentAcademicInfo() {
            if (!firestore || !profile) return;
            setIsLoading(true);
            try {
                // 1. Fetch Class Details
                if (profile.classId) {
                    const classSnap = await getDoc(doc(firestore, 'classes', profile.classId));
                    if (classSnap.exists()) {
                        const classData = classSnap.data();
                        setClassName(classData.name || 'Not Specified');
                        
                        // Fetch Teacher Details
                        if (classData.teacherId) {
                            const teacherSnap = await getDoc(doc(firestore, 'staff', classData.teacherId));
                            if (teacherSnap.exists()) {
                                const teacherData = teacherSnap.data();
                                setTeacherName(`${teacherData.firstName || ''} ${teacherData.lastName || ''}`.trim());
                            } else {
                                setTeacherName('Not Assigned');
                            }
                        } else {
                            setTeacherName('Not Assigned');
                        }
                    } else {
                        setClassName('Not Specified');
                        setTeacherName('Not Assigned');
                    }
                } else {
                    setClassName('Not Assigned');
                    setTeacherName('Not Assigned');
                }

                // 2. Fetch School Settings
                if (profile.schoolId) {
                    const settingsSnap = await getDoc(doc(firestore, 'schoolSettings', profile.schoolId));
                    if (settingsSnap.exists()) {
                        const settingsData = settingsSnap.data();
                        setAcademicYear(settingsData.academicYear || 'Not Configured');
                        setTerm(settingsData.term || 'Not Configured');
                    } else {
                        setAcademicYear('Not Configured');
                        setTerm('Not Configured');
                    }
                } else {
                    setAcademicYear('Not Configured');
                    setTerm('Not Configured');
                }
            } catch (err) {
                console.error("Error loading student academic profile:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStudentAcademicInfo();
    }, [firestore, profile]);

    const status = profile?.enrollmentStatus || 'Active';
    const statusColor = status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white';

    return (
        <Card className="rounded-[32px] overflow-hidden border border-slate-150 shadow-lg bg-white">
            <div className="bg-gradient-to-r from-blue-700 via-indigo-650 to-indigo-800 p-6 md:p-8 text-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl"><GraduationCap className="h-6 w-6 text-blue-200" /></div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight italic">Student Academic Profile</h2>
                        <p className="text-[10px] uppercase font-black tracking-widest text-blue-200 opacity-90 mt-0.5 font-bold">Official Student Enrollment Record</p>
                    </div>
                </div>
            </div>
            <CardContent className="p-6 md:p-8">
                {isLoading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                        <span className="text-xs font-semibold animate-pulse text-slate-500">Resolving school registration...</span>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-6 items-center">
                        {/* Photo Column */}
                        <div className="md:col-span-1 flex flex-col items-center justify-center space-y-3">
                            <div className="relative h-32 w-32 rounded-3xl overflow-hidden border-4 border-slate-100 shadow-md bg-slate-50">
                                {profile?.photoURL ? (
                                    <img src={profile.photoURL} alt="Student" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-indigo-50 text-indigo-600 text-3xl font-black uppercase">
                                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                    </div>
                                )}
                                <Badge className={`absolute bottom-2 left-1/2 -translate-x-1/2 font-black text-[9px] uppercase px-2.5 py-0.5 shadow-sm border-0 ${statusColor}`}>
                                    {status}
                                </Badge>
                            </div>
                        </div>

                        {/* Roster Information Column */}
                        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-6">
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Student ID</span>
                                <div className="flex items-center gap-1.5">
                                    <IdCard className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{profile?.studentId || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Admission Number</span>
                                <div className="flex items-center gap-1.5">
                                    <Tag className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{profile?.studentId || profile?.id || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Class / Grade</span>
                                <div className="flex items-center gap-1.5">
                                    <GraduationCap className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{className}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Boarding House</span>
                                <div className="flex items-center gap-1.5">
                                    <Building className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm uppercase">{profile?.house || 'Not Assigned'}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Programme / Dept</span>
                                <div className="flex items-center gap-1.5">
                                    <BookOpen className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{profile?.programme || profile?.department || profile?.track || 'General'}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Academic Year</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{academicYear}</span>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Semester / Term</span>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{term}</span>
                                </div>
                            </div>

                            <div className="space-y-1 col-span-2 md:col-span-2">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">Class Teacher</span>
                                <div className="flex items-center gap-1.5">
                                    <User className="h-4 w-4 text-indigo-650 shrink-0" />
                                    <span className="font-extrabold text-slate-700 text-sm">{teacherName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
