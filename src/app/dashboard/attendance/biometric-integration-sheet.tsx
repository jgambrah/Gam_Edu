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
  Code,
  Terminal,
  Settings,
  AlertCircle,
  Sparkles,
  Badge,
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

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* 1. API Configuration Card */}
      <Card className="border border-indigo-150 bg-white/80 backdrop-blur-md shadow-md overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 border-b border-indigo-950/20 py-5">
          <CardTitle className="text-lg font-black text-white flex items-center gap-2.5">
            <Terminal className="h-5 w-5 text-indigo-400" />
            Biometric Hardware Integration Cockpit
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Configure secure API credentials to synchronize physical scanning hardware (e.g., RFID gates, face scanners) to GAM Edu.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-5">
              
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">School Webhook / Integration Endpoint</Label>
                <div className="relative flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-indigo-300 text-xs font-mono select-all">
                  <span className="flex-1 overflow-x-auto whitespace-nowrap pr-4">{getWebhookUrl() || 'Acquiring integration URL...'}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-white shrink-0 hover:bg-slate-900 rounded-lg transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(getWebhookUrl());
                      toast({ title: 'Webhook URL Copied', description: 'Endpoint endpoint url successfully copied to clipboard.' });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Integration API Key Token</Label>
                {isLoadingSettings ? (
                  <div className="flex items-center gap-2 text-slate-400 py-3 text-xs font-medium">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-600" /> Loading configuration...
                  </div>
                ) : schoolSettings?.biometricApiKey ? (
                  <div className="flex gap-2.5">
                    <div className="relative flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-emerald-400 text-xs font-mono">
                      <span className="flex-1 overflow-x-auto whitespace-nowrap pr-10">
                        {apiKeyRevealed ? schoolSettings.biometricApiKey : '•'.repeat(40)}
                      </span>
                      <div className="absolute right-2 top-1.5 flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg"
                          onClick={() => setApiKeyRevealed(!apiKeyRevealed)}
                        >
                          {apiKeyRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg"
                          onClick={handleCopyKey}
                        >
                          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      className="rounded-xl px-4 shrink-0 font-bold text-xs h-10 border border-red-900 bg-red-950/20 text-red-400 hover:bg-red-950/50 hover:text-red-300 transition-all duration-200"
                      onClick={handleRevokeKey}
                      disabled={apiActionLoading}
                    >
                      Revoke
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between border border-dashed border-slate-350 rounded-xl p-4 bg-slate-50/50">
                    <span className="text-slate-500 text-xs font-medium">No integration API key is active.</span>
                    <Button 
                      onClick={handleGenerateKey} 
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs h-9 flex items-center gap-2"
                      disabled={apiActionLoading}
                    >
                      {apiActionLoading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <Key className="h-4 w-4" />}
                      Generate Integration Key
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:col-span-1 bg-slate-950 border border-slate-900 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5">
                  <Code className="h-3.5 w-3.5" /> Request Scheme
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Gateway script should submit HTTP POST JSON request logs containing matching active student RFID Card codes.
                </p>
                <div className="bg-slate-900 border border-slate-800 text-[10px] text-slate-300 p-3 rounded-xl font-mono leading-relaxed space-y-1 select-all select-none">
                  <div className="text-emerald-400 font-bold">POST /api/v1/attendance/biometric</div>
                  <div className="text-indigo-300">Headers:</div>
                  <div className="text-slate-400">  x-biometric-api-key: [key]</div>
                  <div className="text-indigo-300">Payload:</div>
                  <div className="text-slate-400">{"{"}</div>
                  <div className="text-indigo-200">{"  \"logs\": ["}</div>
                  <div className="text-indigo-200">{"    { \"biometricId\": \"rfid_code\", \"timestamp\": 1718... }"}</div>
                  <div className="text-indigo-200">{"  ]"}</div>
                  <div className="text-slate-400">{"}"}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. CSV Logs Import Card */}
      <Card className="border border-indigo-150 bg-white/80 backdrop-blur-md shadow-md overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-teal-50/30 to-indigo-50/20 border-b border-slate-100 py-5">
          <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2.5">
            <FileSpreadsheet className="h-5 w-5 text-teal-600" />
            CSV Offline Scan Log Importer
          </CardTitle>
          <CardDescription className="text-slate-500 text-xs">
            Import exported scanner device logs manually. Ensure your CSV contains a <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[11px] font-bold">biometricId</code> column and a <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono text-[11px] font-bold">timestamp</code> column.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Attendance Log Date</Label>
              <Input 
                type="date" 
                value={csvDate} 
                onChange={e => setCsvDate(e.target.value)} 
                className="bg-white border-slate-200 rounded-xl h-11 focus:ring-teal-500 shadow-sm"
              />
            </div>
            
            <div className="md:col-span-2 space-y-2">
              <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 block">Upload CSV Logs File</Label>
              <div className="relative group border-2 border-dashed border-slate-200 hover:border-teal-500 hover:bg-teal-50/10 transition-all rounded-2xl p-6 text-center cursor-pointer flex flex-col items-center justify-center min-h-[140px] shadow-sm">
                <input 
                  type="file" 
                  accept=".csv"
                  id="csv-file-upload"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) setCsvFile(file);
                  }} 
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {csvFile ? (
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto border border-teal-100 shadow-sm">
                      <FileSpreadsheet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">{csvFile.name}</p>
                      <p className="text-[10px] text-slate-400">{(csvFile.size / 1024).toFixed(1)} KB • CSV Format File</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCsvFile(null);
                      }} 
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-semibold h-7"
                    >
                      Clear File
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto border border-slate-100/50 group-hover:scale-105 transition-all">
                      <Upload className="h-5 w-5 group-hover:text-teal-600" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">Drag & drop your CSV log file or <span className="text-teal-600 underline">browse</span></p>
                      <p className="text-[10px] text-slate-400">Supports standard device log outputs</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-slate-100">
            <Button 
              onClick={handleCsvUpload} 
              disabled={isUploading || !csvFile}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold h-11 rounded-xl flex items-center gap-2 px-6 shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload & Process Attendance Logs
            </Button>
          </div>

          {uploadResult && (
            <div className="border border-emerald-100 bg-emerald-50/30 rounded-2xl p-5 space-y-4 shadow-sm animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                <BadgeCheck className="h-5 w-5 text-emerald-600" /> Import completed successfully!
              </div>
              <div className="grid sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-white border border-emerald-100/50 rounded-xl p-3 shadow-sm">
                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[9px] font-bold">Logs Matched & Logged</span>
                  <strong className="text-slate-800 text-lg font-black">{uploadResult.processedCount}</strong>
                </div>
                <div className="bg-white border border-emerald-100/50 rounded-xl p-3 shadow-sm">
                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[9px] font-bold">Daily Billings Generated</span>
                  <strong className="text-emerald-600 text-lg font-black">{uploadResult.billing?.successful || 0}</strong>
                </div>
                <div className="bg-white border border-emerald-100/50 rounded-xl p-3 shadow-sm">
                  <span className="text-slate-400 block mb-1 uppercase tracking-wider text-[9px] font-bold">Total Bills Billed</span>
                  <strong className="text-indigo-600 text-lg font-black">GHS {(uploadResult.billing?.totalBilled || 0).toFixed(2)}</strong>
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
      <Card className="border border-indigo-150 bg-white/80 backdrop-blur-md shadow-md overflow-hidden rounded-2xl">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-indigo-50/20 border-b border-slate-100 flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 py-5">
          <div>
            <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2.5">
              <User className="h-5 w-5 text-indigo-600" />
              Student Biometric ID Mapping
            </CardTitle>
            <CardDescription className="text-slate-500 text-xs">
              Link students to their physical biometric scanner / RFID card codes.
            </CardDescription>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select onValueChange={setSelectedClassId} value={selectedClassId}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white border-slate-200 rounded-xl h-10 shadow-sm focus:ring-indigo-500">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Classes</SelectItem>
                {classes?.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            
            <div className="relative w-full sm:w-[220px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search name or ID..." 
                className="pl-9 bg-white border-slate-200 rounded-xl h-10 shadow-sm focus-visible:ring-indigo-500" 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          {isLoadingStudents ? (
            <div className="flex justify-center p-12 text-slate-400 gap-2"><Loader2 className="h-5 w-5 animate-spin text-indigo-600" /> Loading student database...</div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-slate-400">
              <BadgeAlert className="h-8 w-8 mb-2 text-slate-350" />
              <span className="text-xs font-semibold">No active students found matching filters.</span>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead className="font-bold text-slate-700 pl-6 text-xs uppercase tracking-wider">Student Profile</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider">Class Cohort</TableHead>
                  <TableHead className="font-bold text-slate-700 text-xs uppercase tracking-wider">Official Student ID</TableHead>
                  <TableHead className="font-bold text-slate-700 pr-6 text-xs uppercase tracking-wider">Biometric / RFID Card ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map(student => {
                  const isEditing = editingStudentId === student.uid;
                  const studentClass = classes?.find(c => c.id === student.classId)?.name || 'N/A';
                  return (
                    <TableRow key={student.uid} className="hover:bg-slate-50/40 transition-colors border-b border-slate-100">
                      <TableCell className="font-medium text-slate-800 pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm uppercase shrink-0">
                            {getInitials(student.firstName, student.lastName)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm leading-tight">{student.firstName} {student.lastName}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{student.uid.substring(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 border border-slate-200/50 text-slate-600">
                          {studentClass}
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-500 font-mono text-xs font-semibold">{student.studentId || 'N/A'}</TableCell>
                      <TableCell className="pr-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={tempBiometricId}
                              onChange={e => setTempBiometricId(e.target.value)}
                              placeholder="Scan or enter code..."
                              className="bg-white border-indigo-200 focus-visible:ring-indigo-500 rounded-xl h-9 w-[180px] font-mono text-xs shadow-inner"
                              autoFocus
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleSaveMapping(student.uid)} 
                              disabled={isSavingMapping}
                              className="bg-indigo-600 hover:bg-indigo-700 h-9 font-bold px-3 rounded-xl text-white text-xs shadow-sm"
                            >
                              {isSavingMapping ? <Loader2 className="h-3 w-3 animate-spin text-white" /> : 'Save'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              onClick={() => setEditingStudentId(null)}
                              className="h-9 hover:bg-slate-100 rounded-xl text-slate-500 font-bold text-xs"
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/btn">
                            {(student as any).biometricId ? (
                              <span className="font-mono text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200/50 px-2.5 py-1 rounded-lg">
                                {(student as any).biometricId}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-405 italic bg-slate-50 border border-dashed border-slate-200 px-2.5 py-1 rounded-lg">Unmapped</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEditing(student)}
                              className="opacity-0 group-hover/btn:opacity-100 h-8 font-bold text-xs text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 transition-all px-2.5"
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
