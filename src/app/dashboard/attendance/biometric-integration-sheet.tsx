'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useFirestore, useUser, useMemoFirebase, useDoc, useCollection } from '@/firebase';
import { doc, collection, query, where } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCurrentSchool } from '@/hooks/use-current-school';
import {
  Key,
  Copy,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  User,
  Shield,
  Search,
  Loader2,
  FileSpreadsheet,
  BadgeAlert,
  BadgeCheck,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { generateBiometricApiKey, revokeBiometricApiKey, updateStudentBiometricId, importBiometricCsvAction } from '@/app/actions/biometric-actions';
import { type Student, type Class } from '@/lib/types';
import Papa from 'papaparse';
import { format } from 'date-fns';

export function BiometricIntegrationSheet() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  // 1. Settings State
  const [apiKeyRevealed, setApiKeyRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [apiActionLoading, setApiActionLoading] = useState(false);

  const schoolSettingsRef = useMemoFirebase(
    () => (firestore && schoolId) ? doc(firestore, 'schoolSettings', schoolId) : null,
    [firestore, schoolId]
  );
  const { data: schoolSettings, isLoading: isLoadingSettings } = useDoc<any>(schoolSettingsRef as any);

  // 2. CSV Import State
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvDate, setCsvDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any | null>(null);

  // 3. Mapping State
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [tempBiometricId, setTempBiometricId] = useState('');
  const [isSavingMapping, setIsSavingMapping] = useState(false);

  // Fetch classes for filtering
  const classesQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    return query(collection(firestore, 'classes'), where('schoolId', '==', schoolId));
  }, [firestore, schoolId]);
  const { data: classes } = useCollection<Class>(classesQuery);

  // Fetch active students for mapping
  const studentsQuery = useMemoFirebase(() => {
    if (!firestore || !schoolId) return null;
    let q = query(
      collection(firestore, 'students'),
      where('schoolId', '==', schoolId),
      where('enrollmentStatus', '==', 'Active')
    );
    return q;
  }, [firestore, schoolId]);
  const { data: rawStudents, isLoading: isLoadingStudents } = useCollection<Student>(studentsQuery);

  // Filter students based on search and class selection
  const filteredStudents = useMemo(() => {
    if (!rawStudents) return [];
    return rawStudents.filter(s => {
      const matchClass = selectedClassId === 'all' || s.classId === selectedClassId;
      const studentName = `${s.firstName || ''} ${s.lastName || ''}`.toLowerCase();
      const matchSearch = !searchTerm || studentName.includes(searchTerm.toLowerCase()) || ((s as any).biometricId && (s as any).biometricId.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchClass && matchSearch;
    });
  }, [rawStudents, selectedClassId, searchTerm]);

  // Actions
  const handleGenerateKey = async () => {
    if (!schoolId) return;
    setApiActionLoading(true);
    try {
      const res = await generateBiometricApiKey(schoolId);
      if (res.success) {
        toast({ title: 'API Key Generated', description: 'Your new biometric API integration key is ready.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.error });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setApiActionLoading(false);
    }
  };

  const handleRevokeKey = async () => {
    if (!schoolId) return;
    if (!confirm('Are you sure you want to revoke the biometric integration key? All active device sync connections will fail immediately.')) return;
    setApiActionLoading(true);
    try {
      const res = await revokeBiometricApiKey(schoolId);
      if (res.success) {
        toast({ title: 'API Key Revoked', description: 'Biometric API access has been disabled.' });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.error });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setApiActionLoading(false);
    }
  };

  const handleCopyKey = () => {
    if (!schoolSettings?.biometricApiKey) return;
    navigator.clipboard.writeText(schoolSettings.biometricApiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: 'Copied', description: 'API Key copied to clipboard.' });
  };

  // CSV Processing
  const handleCsvUpload = () => {
    if (!csvFile || !schoolId) return;
    setIsUploading(true);
    setUploadResult(null);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const rawLogs = results.data;
          if (rawLogs.length === 0) {
            toast({ variant: 'destructive', title: 'Empty CSV', description: 'No rows detected in the CSV file.' });
            setIsUploading(false);
            return;
          }

          // Map CSV Columns automatically
          const formattedRecords = rawLogs.map((row: any) => {
            const keys = Object.keys(row);
            
            // Search case-insensitively for card/biometric ID columns
            const biometricIdKey = keys.find(k => 
              /biometricId|biometric_id|cardId|card_id|card|rfid|biometric_code|student_code/i.test(k)
            ) || keys[0];

            // Search case-insensitively for timestamp columns
            const timestampKey = keys.find(k => 
              /timestamp|time|date|scan_time|check_in|scan/i.test(k)
            ) || keys[1];

            const bioId = row[biometricIdKey];
            const timeVal = row[timestampKey];

            let timestamp = Date.now();
            if (timeVal) {
              const parsedTime = new Date(timeVal).getTime();
              if (!isNaN(parsedTime)) timestamp = parsedTime;
            }

            return {
              biometricId: String(bioId || '').trim(),
              timestamp
            };
          }).filter(r => r.biometricId);

          if (formattedRecords.length === 0) {
            toast({ variant: 'destructive', title: 'Parsing Error', description: 'Could not resolve a biometricId column in your CSV. Ensure headers exist.' });
            setIsUploading(false);
            return;
          }

          const res = await importBiometricCsvAction(schoolId, csvDate, formattedRecords);
          if (res.success && 'processedCount' in res) {
            setUploadResult(res);
            toast({ title: 'Import Complete', description: `Processed ${res.processedCount} student scans successfully.` });
          } else {
            const errMsg = res && 'error' in res ? res.error : 'Check file format.';
            toast({ variant: 'destructive', title: 'Import Failed', description: errMsg });
          }
        } catch (err: any) {
          console.error(err);
          toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        toast({ variant: 'destructive', title: 'CSV Error', description: error.message });
        setIsUploading(false);
      }
    });
  };

  // Mapping Save
  const handleStartEditing = (student: Student) => {
    setEditingStudentId(student.uid);
    setTempBiometricId((student as any).biometricId || '');
  };

  const handleSaveMapping = async (studentId: string) => {
    if (!schoolId) return;
    setIsSavingMapping(true);
    try {
      const res = await updateStudentBiometricId(schoolId, studentId, tempBiometricId);
      if (res.success) {
        toast({ title: 'Mapping Saved', description: 'Student Card ID mapped successfully.' });
        setEditingStudentId(null);
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.error });
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message });
    } finally {
      setIsSavingMapping(false);
    }
  };

  const getWebhookUrl = () => {
    if (typeof window === 'undefined') return '';
    const protocol = window.location.protocol;
    const host = window.location.host;
    return `${protocol}//${host}/api/v1/attendance/biometric`;
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* 1. API Configuration Card */}
      <Card className="border border-indigo-100 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-indigo-50">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            Biometric Hardware Integration API
          </CardTitle>
          <CardDescription>
            Generate a secure API token to sync scanning hardware (e.g., RFID gates, face scanners) to GAM Edu.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">School Webhook / Integration URL</Label>
                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-600 text-xs font-mono select-all select-none">
                  <span className="flex-1 overflow-x-auto whitespace-nowrap pr-4">{getWebhookUrl() || 'Acquiring integration URL...'}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:text-slate-700 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(getWebhookUrl());
                      toast({ title: 'Webhook URL Copied' });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700">Integration API Key</Label>
                {isLoadingSettings ? (
                  <div className="flex items-center gap-2 text-slate-400 py-3 text-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" /> Loading configuration...
                  </div>
                ) : schoolSettings?.biometricApiKey ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-600 text-xs font-mono">
                      <span className="flex-1 overflow-x-auto whitespace-nowrap pr-10">
                        {apiKeyRevealed ? schoolSettings.biometricApiKey : '•'.repeat(40)}
                      </span>
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                          onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
                        >
                          {apiKeyRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-500 hover:text-slate-700"
                          onClick={handleCopyKey}
                        >
                          {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="rounded-xl px-4 shrink-0 font-bold"
                      onClick={handleRevokeKey}
                      disabled={apiActionLoading}
                    >
                      Revoke
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-dashed border-slate-300 rounded-xl p-4 bg-slate-50/50">
                    <span className="text-slate-500 text-sm">No integration API key active.</span>
                    <Button 
                      onClick={handleGenerateKey} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2"
                      disabled={apiActionLoading}
                    >
                      {apiActionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
                      Generate Key
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-1 bg-slate-50 border border-slate-200/60 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Connection Guide</span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configure your biometric scanning software or local script gateway to POST scans to our API. The request payload must authenticate using the API key in the headers.
                </p>
                <div className="bg-slate-900 text-[10px] text-indigo-300 p-3 rounded-xl font-mono leading-relaxed space-y-1 select-all">
                  <div>POST /api/v1/attendance/biometric</div>
                  <div>Headers: x-biometric-api-key: [key]</div>
                  <div>Body:</div>
                  <div className="text-slate-400">{"{"}</div>
                  <div className="text-indigo-200">{"  \"logs\": ["}</div>
                  <div className="text-indigo-200">{"    { \"biometricId\": \"ID\", \"timestamp\": 1718... }"}</div>
                  <div className="text-indigo-200">{"  ]"}</div>
                  <div className="text-slate-400">{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. CSV Logs Import Card */}
      <Card className="border border-indigo-100 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-indigo-50">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
            CSV Offline Scan Log Upload
          </CardTitle>
          <CardDescription>
            Import exported scans from your device manually. Ensure your CSV contains a <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">biometricId</code> column and a <code className="bg-slate-100 px-1 py-0.5 rounded text-red-600 font-mono">timestamp</code> column.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Attendance Log Date</Label>
              <Input 
                type="date" 
                value={csvDate} 
                onChange={e => setCsvDate(e.target.value)} 
                className="bg-white border-slate-200 rounded-xl h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700">Select Exported Log File (CSV)</Label>
              <Input 
                type="file" 
                accept=".csv"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setCsvFile(file);
                }} 
                className="bg-white border-slate-200 rounded-xl h-11 pt-2 cursor-pointer"
              />
            </div>

            <Button 
              onClick={handleCsvUpload} 
              disabled={isUploading || !csvFile}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-11 rounded-xl flex items-center gap-2 w-full md:w-auto shrink-0 shadow-sm"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload & Process Attendance
            </Button>
          </div>

          {uploadResult && (
            <div className="border border-green-100 bg-green-50/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-green-700 font-bold text-sm">
                <BadgeCheck className="h-5 w-5" /> Import completed successfully!
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white border border-green-100 rounded-xl p-3 shadow-sm">
                  <span className="text-slate-500 block mb-1">Logs Matched & Logged</span>
                  <strong className="text-slate-800 text-lg">{uploadResult.processedCount}</strong>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-3 shadow-sm">
                  <span className="text-slate-500 block mb-1">Daily Billings Generated</span>
                  <strong className="text-green-600 text-lg">{uploadResult.billing?.successful || 0}</strong>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-3 shadow-sm">
                  <span className="text-slate-500 block mb-1">Total Bills Billed</span>
                  <strong className="text-indigo-600 text-lg">GHS {(uploadResult.billing?.totalBilled || 0).toFixed(2)}</strong>
                </div>
              </div>
              
              {uploadResult.details && uploadResult.details.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-600">Matched Students:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {uploadResult.details.map((name: string, i: number) => (
                      <span key={i} className="bg-white text-[10px] border border-slate-200 px-2.5 py-1 rounded-full font-medium text-slate-700">{name}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Mapping ID Card Table Card */}
      <Card className="border border-indigo-100 bg-white/70 backdrop-blur-sm shadow-sm overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-indigo-50 flex flex-row flex-wrap justify-between items-center gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              Student Biometric ID Mapping
            </CardTitle>
            <CardDescription>
              Link students to their physical biometric scanner / RFID card codes.
            </CardDescription>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200 rounded-xl h-10">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search name or ID..." 
                className="pl-9 bg-white border-slate-200 rounded-xl h-10" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingStudents ? (
            <div className="flex justify-center p-12 text-slate-400 gap-2"><Loader2 className="h-5 w-5 animate-spin text-indigo-600" /> Loading student database...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <BadgeAlert className="h-8 w-8 mb-2 text-slate-300" />
              <span>No active students found matching filters.</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 pl-6">Student</TableHead>
                  <TableHead className="font-bold text-slate-700">Class</TableHead>
                  <TableHead className="font-bold text-slate-700">Official Student ID</TableHead>
                  <TableHead className="font-bold text-slate-700 pr-6">Biometric / RFID Card ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(student => {
                  const isEditing = editingStudentId === student.uid;
                  const studentClass = classes?.find(c => c.id === student.classId)?.name || 'N/A';
                  return (
                    <TableRow key={student.uid} className="hover:bg-slate-50/50 transition-colors border-b border-slate-100">
                      <TableCell className="font-medium text-slate-800 pl-6 py-4">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell className="text-slate-600">{studentClass}</TableCell>
                      <TableCell className="text-slate-500 font-mono text-xs">{student.studentId || 'N/A'}</TableCell>
                      <TableCell className="pr-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={tempBiometricId}
                              onChange={e => setTempBiometricId(e.target.value)}
                              placeholder="Scan or enter code..."
                              className="bg-white border-indigo-200 focus-visible:ring-indigo-500 rounded-xl h-9 w-[180px] font-mono text-xs"
                              autoFocus
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveMapping(student.uid)} 
                              disabled={isSavingMapping}
                              className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold px-3 rounded-xl"
                            >
                              {isSavingMapping ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Save'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setEditingStudentId(null)}
                              className="h-9 hover:bg-slate-100 rounded-xl text-slate-500"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group">
                            {(student as any).biometricId ? (
                              <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                                {(student as any).biometricId}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic">Unmapped</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEditing(student)}
                              className="opacity-0 group-hover:opacity-100 h-8 font-semibold text-xs text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition"
                            >
                              Edit ID
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
