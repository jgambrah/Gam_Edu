'use client';

import { useMemo, useState } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { useRole } from '@/context/role-context';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Star,
  MessageSquare,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ThumbsUp,
  Search,
  MessageCircle,
  X,
  User,
  Activity,
  ThumbsDown,
  ArrowUpRight,
  Sparkles,
  Heart,
  Smile
} from 'lucide-react';
import { format } from 'date-fns';

interface ParentSatisfactionDashboardViewProps {
  records: any[];
  loading: boolean;
  schoolId: string;
}

export function ParentSatisfactionDashboardView({
  records = [],
  loading = false,
  schoolId
}: ParentSatisfactionDashboardViewProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { profile } = useRole();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'complaint' | 'feedback' | 'teacher_rating' | 'service_rating'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'In Progress' | 'Resolved' | 'Acknowledged'>('all');
  
  // Response Dialog State
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [replyStatus, setReplyStatus] = useState<'Pending' | 'In Progress' | 'Resolved' | 'Acknowledged'>('Pending');
  const [adminRemark, setAdminRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. KPI Calculations
  const stats = useMemo(() => {
    const total = records.length;
    
    // Ratings entries
    const ratingEntries = records.filter(r => r.rating !== undefined && r.rating > 0);
    const overallAvgRating = ratingEntries.length > 0 
      ? parseFloat((ratingEntries.reduce((sum, r) => sum + r.rating, 0) / ratingEntries.length).toFixed(1))
      : 0;

    // Open complaints
    const pendingComplaints = records.filter(r => r.type === 'complaint' && (r.status === 'Pending' || r.status === 'In Progress')).length;

    // Teacher Ratings Avg
    const teacherRatings = records.filter(r => r.type === 'teacher_rating' && r.rating !== undefined);
    const teacherAvg = teacherRatings.length > 0 
      ? parseFloat((teacherRatings.reduce((sum, r) => sum + r.rating, 0) / teacherRatings.length).toFixed(1))
      : 0;

    // Service Ratings Avg
    const serviceRatings = records.filter(r => r.type === 'service_rating' && r.rating !== undefined);
    const serviceAvg = serviceRatings.length > 0 
      ? parseFloat((serviceRatings.reduce((sum, r) => sum + r.rating, 0) / serviceRatings.length).toFixed(1))
      : 0;

    return {
      total,
      overallAvgRating,
      pendingComplaints,
      teacherAvg,
      serviceAvg
    };
  }, [records]);

  // 2. Search and filter records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        (r.parentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.content || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.teacherName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.serviceType || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = typeFilter === 'all' || r.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [records, searchTerm, typeFilter, statusFilter]);

  // 3. open reply dialog
  const handleOpenReply = (record: any) => {
    setSelectedRecord(record);
    setReplyStatus(record.status || 'Pending');
    setAdminRemark(record.adminRemark || '');
  };

  // 4. submit reply/update
  const handleUpdateRecord = async () => {
    if (!firestore || !selectedRecord) return;
    setIsSubmitting(true);
    try {
      const docRef = doc(firestore, 'parent_satisfaction', selectedRecord.id);
      const updateData: any = {
        status: replyStatus,
        adminRemark: adminRemark.trim(),
        adminRepliedAt: serverTimestamp(),
        adminRepliedBy: user?.uid || '',
        adminRepliedByName: profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : 'School Admin'
      };

      await updateDoc(docRef, updateData);

      toast({
        title: 'Entry Updated Successfully',
        description: `Status updated to ${replyStatus} for ${selectedRecord.parentName}'s submission.`
      });
      setSelectedRecord(null);
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: err.message || 'Failed to update satisfaction record.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Star Renderer
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={cn(
              "h-3.5 w-3.5",
              star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
            )}
          />
        ))}
      </div>
    );
  };

  // 6. Urgency Badge
  const getUrgencyBadge = (urgency: string) => {
    const cleanUrgency = urgency || 'Medium';
    const styles: Record<string, string> = {
      Low: 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full',
      Medium: 'bg-blue-50 text-blue-700 hover:bg-blue-50 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full',
      High: 'bg-amber-50 text-amber-700 hover:bg-amber-50 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full',
      Critical: 'bg-rose-50 text-rose-700 hover:bg-rose-50 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-rose-100 animate-pulse'
    };
    return (
      <Badge className={styles[cleanUrgency] || styles.Medium}>
        {cleanUrgency} Urgency
      </Badge>
    );
  };

  // 7. Status Badge
  const getStatusBadge = (status: string) => {
    const cleanStatus = status || 'Pending';
    const styles: Record<string, string> = {
      Pending: 'bg-rose-100 text-rose-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider',
      'In Progress': 'bg-amber-100 text-amber-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider',
      Resolved: 'bg-emerald-100 text-emerald-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider',
      Acknowledged: 'bg-blue-100 text-blue-800 border-none font-black text-[9px] px-2.5 py-1 rounded-full uppercase tracking-wider'
    };
    return (
      <Badge className={styles[cleanStatus] || styles.Pending}>
        {cleanStatus}
      </Badge>
    );
  };

  // 8. Type Badge
  const getTypeBadge = (type: string) => {
    const styles: Record<string, string> = {
      complaint: 'bg-rose-50 text-rose-600 hover:bg-rose-50 border border-rose-150 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider',
      feedback: 'bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-150 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider',
      teacher_rating: 'bg-purple-50 text-purple-600 hover:bg-purple-50 border border-purple-150 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider',
      service_rating: 'bg-amber-50 text-amber-600 hover:bg-amber-50 border border-amber-150 font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider'
    };
    const labels: Record<string, string> = {
      complaint: 'Complaint',
      feedback: 'General Feedback',
      teacher_rating: 'Teacher Appraisal',
      service_rating: 'Service Rating'
    };
    return (
      <Badge className={styles[type] || 'bg-slate-100 text-slate-700'}>
        {labels[type] || type}
      </Badge>
    );
  };

  // 9. Format timestamp helper
  const formatTime = (ts: any) => {
    if (!ts) return 'Just now';
    if (ts.toDate) return format(ts.toDate(), 'PPpp');
    const dateObj = new Date(ts);
    if (!isNaN(dateObj.getTime())) return format(dateObj, 'PPpp');
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Clock className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-sm font-bold uppercase tracking-wider text-slate-400">Loading parent satisfaction statistics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. KPI Metrics Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        
        {/* Total feedback logs */}
        <Card className="rounded-3xl border border-slate-100 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.02)] bg-white overflow-hidden relative border-l-4 border-l-indigo-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Logs</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.total}</h3>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tight">Parent submissions</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
              <MessageSquare className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Overall Satisfaction average */}
        <Card className="rounded-3xl border border-slate-100 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.02)] bg-white overflow-hidden relative border-l-4 border-l-rose-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Overall Score</p>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                {stats.overallAvgRating} <span className="text-xs text-slate-400 font-bold">/ 5</span>
              </h3>
              {stats.overallAvgRating > 0 ? (
                <div className="scale-75 origin-left">{renderStars(Math.round(stats.overallAvgRating))}</div>
              ) : (
                <p className="text-[8px] font-bold text-slate-450 uppercase">No ratings recorded</p>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 text-rose-600">
              <Heart className="h-5 w-5 fill-rose-100" />
            </div>
          </CardContent>
        </Card>

        {/* Pending complaints */}
        <Card className="rounded-3xl border border-slate-100 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.02)] bg-white overflow-hidden relative border-l-4 border-l-amber-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pending Complaints</p>
              <h3 className="text-2xl font-black text-slate-900">{stats.pendingComplaints}</h3>
              <p className="text-[8px] font-bold text-slate-455 uppercase tracking-tight">Need immediate response</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Teacher Appraisal Avg */}
        <Card className="rounded-3xl border border-slate-100 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.02)] bg-white overflow-hidden relative border-l-4 border-l-purple-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Teacher Avg</p>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                {stats.teacherAvg} <span className="text-xs text-slate-400 font-bold">/ 5</span>
              </h3>
              {stats.teacherAvg > 0 ? (
                <div className="scale-75 origin-left">{renderStars(Math.round(stats.teacherAvg))}</div>
              ) : (
                <p className="text-[8px] font-bold text-slate-450 uppercase">No appraisals</p>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <ThumbsUp className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        {/* Service Ratings Avg */}
        <Card className="rounded-3xl border border-slate-100 shadow-[0_15px_30px_-8px_rgba(0,0,0,0.02)] bg-white overflow-hidden relative border-l-4 border-l-emerald-500">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Service Avg</p>
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-1.5">
                {stats.serviceAvg} <span className="text-xs text-slate-400 font-bold">/ 5</span>
              </h3>
              {stats.serviceAvg > 0 ? (
                <div className="scale-75 origin-left">{renderStars(Math.round(stats.serviceAvg))}</div>
              ) : (
                <p className="text-[8px] font-bold text-slate-450 uppercase">No service ratings</p>
              )}
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600">
              <Smile className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

      </div>

      {/* 2. Search, Filters, and Table Controls */}
      <Card className="rounded-[2rem] border border-slate-100 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.02)] bg-white p-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          
          {/* Category tabs */}
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                typeFilter === 'all' 
                  ? "bg-slate-900 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              All Submissions ({records.length})
            </button>
            <button
              onClick={() => setTypeFilter('complaint')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                typeFilter === 'complaint' 
                  ? "bg-rose-600 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              Complaints ({records.filter(r => r.type === 'complaint').length})
            </button>
            <button
              onClick={() => setTypeFilter('feedback')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                typeFilter === 'feedback' 
                  ? "bg-blue-600 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              Feedback ({records.filter(r => r.type === 'feedback').length})
            </button>
            <button
              onClick={() => setTypeFilter('teacher_rating')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                typeFilter === 'teacher_rating' 
                  ? "bg-purple-600 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              Teachers ({records.filter(r => r.type === 'teacher_rating').length})
            </button>
            <button
              onClick={() => setTypeFilter('service_rating')}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                typeFilter === 'service_rating' 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "bg-slate-50 text-slate-500 hover:text-slate-800"
              )}
            >
              Services ({records.filter(r => r.type === 'service_rating').length})
            </button>
          </div>

          {/* Status select & search input */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:max-w-xl">
            
            {/* Status Selector */}
            <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto self-stretch items-center justify-between gap-1 shrink-0">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as any)}
                className="bg-transparent text-xs font-black uppercase text-slate-700 tracking-wider py-1.5 focus:outline-none pr-3 cursor-pointer"
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
                <option value="Acknowledged">Acknowledged</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by parent name, details, or metadata..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="h-10 pl-10 rounded-xl"
              />
            </div>

          </div>

        </div>
      </Card>

      {/* 3. Submissions Database Register */}
      <Card className="rounded-[2.5rem] border border-slate-100 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.03)] bg-white overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-slate-50/50 p-8 border-b">
          <CardTitle className="text-lg font-black uppercase tracking-tight text-slate-800 flex items-center gap-2">
            <Activity className="h-5 w-5 text-indigo-650" /> Parent Satisfaction Registers
          </CardTitle>
          <CardDescription className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">
            Browse and respond to complaints, appraisals, feedback, and performance grades submitted by parents.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-450 h-12">Parent Submitter</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-455 h-12">Log Type</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-455 h-12">Details & Subject</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-455 h-12">Rating / Urgency</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-455 h-12">Submitted Date</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-455 h-12">Resolution Status</TableHead>
                  <TableHead className="font-black text-xs uppercase tracking-wider text-slate-455 h-12 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((r) => (
                    <TableRow key={r.id} className="hover:bg-slate-50/50 border-slate-100 transition-colors">
                      
                      {/* Submitter */}
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                            <User className="h-4 w-4 text-indigo-650" />
                          </div>
                          <div className="space-y-0.5">
                            <span className="font-black text-xs text-slate-700 block">{r.parentName || 'Parent'}</span>
                            <span className="text-[8px] text-slate-400 font-mono block uppercase">ID: {r.parentId?.slice(0, 8)}...</span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Type badge */}
                      <TableCell className="py-4">
                        {getTypeBadge(r.type)}
                      </TableCell>

                      {/* Content */}
                      <TableCell className="py-4 max-w-sm">
                        <div className="space-y-1">
                          {r.title && (
                            <span className="font-bold text-xs text-slate-800 block truncate">
                              {r.title}
                            </span>
                          )}
                          
                          {/* Specific metadata details */}
                          {r.type === 'teacher_rating' && r.teacherName && (
                            <Badge variant="outline" className="bg-purple-50/50 text-purple-700 text-[8px] px-1.5 py-0 border-purple-100 mb-0.5">
                              Teacher appraised: {r.teacherName}
                            </Badge>
                          )}
                          {r.type === 'service_rating' && r.serviceType && (
                            <Badge variant="outline" className="bg-amber-50/50 text-amber-700 text-[8px] px-1.5 py-0 border-amber-100 mb-0.5">
                              Service appraised: {r.serviceType}
                            </Badge>
                          )}

                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {r.content}
                          </p>

                          {/* Admin reply remark preview */}
                          {r.adminRemark && (
                            <div className="mt-1.5 p-2 bg-slate-50 border border-slate-100 rounded-xl space-y-0.5">
                              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Admin Remark:</span>
                              <p className="text-[10px] text-indigo-700 italic font-semibold line-clamp-1">"{r.adminRemark}"</p>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      {/* Rating/Urgency */}
                      <TableCell className="py-4">
                        {r.type === 'complaint' ? (
                          getUrgencyBadge(r.urgency)
                        ) : r.rating !== undefined ? (
                          <div className="space-y-1">
                            <span className="font-mono text-xs font-bold text-slate-700 block">{r.rating}.0 Stars</span>
                            {renderStars(r.rating)}
                          </div>
                        ) : (
                          <span className="text-slate-350 text-xs italic font-medium">None</span>
                        )}
                      </TableCell>

                      {/* Date */}
                      <TableCell className="font-semibold text-xs text-slate-500 py-4">
                        {formatTime(r.createdAt)}
                      </TableCell>

                      {/* Status */}
                      <TableCell className="py-4">
                        {getStatusBadge(r.status)}
                      </TableCell>

                      {/* Action */}
                      <TableCell className="text-right py-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenReply(r)}
                          className="h-8 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-slate-100 hover:text-slate-900 border-slate-200"
                        >
                          Manage
                        </Button>
                      </TableCell>

                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-400 italic text-xs uppercase tracking-widest font-black">
                      No matching satisfaction logs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Action Reply Dialog */}
      <Dialog open={selectedRecord !== null} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-lg rounded-3xl border-0 shadow-2xl p-8 bg-white text-slate-800">
          <DialogHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-50 text-indigo-650 hover:bg-indigo-50 border-none font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md">
                Admin Console
              </Badge>
              {selectedRecord && getTypeBadge(selectedRecord.type)}
            </div>
            <DialogTitle className="text-xl font-black uppercase text-slate-900 tracking-tight">
              Manage Parent Feedback
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-450 font-bold uppercase tracking-widest mt-1">
              Read parent submission details, write remark replies, and update resolution status.
            </DialogDescription>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-5 pt-3">
              {/* Submission details */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Submitter:</span>
                    <span className="text-sm font-bold text-slate-800">{selectedRecord.parentName}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Date Submitted:</span>
                    <span className="text-xs font-semibold text-slate-500">{formatTime(selectedRecord.createdAt)}</span>
                  </div>
                </div>

                {selectedRecord.title && (
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Subject:</span>
                    <span className="text-xs font-bold text-slate-700">{selectedRecord.title}</span>
                  </div>
                )}

                {selectedRecord.type === 'teacher_rating' && selectedRecord.teacherName && (
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Appraised Teacher:</span>
                    <span className="text-xs font-bold text-purple-700">{selectedRecord.teacherName}</span>
                  </div>
                )}
                {selectedRecord.type === 'service_rating' && selectedRecord.serviceType && (
                  <div>
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Appraised Service:</span>
                    <span className="text-xs font-bold text-amber-700">{selectedRecord.serviceType}</span>
                  </div>
                )}

                <div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Parent Comments:</span>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">{selectedRecord.content}</p>
                </div>

                {selectedRecord.rating !== undefined && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-150/60 mt-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rating Given:</span>
                    <span className="text-xs font-bold font-mono text-slate-700">{selectedRecord.rating}/5</span>
                    {renderStars(selectedRecord.rating)}
                  </div>
                )}
                {selectedRecord.type === 'complaint' && selectedRecord.urgency && (
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-150/60 mt-1">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Reported Urgency:</span>
                    {getUrgencyBadge(selectedRecord.urgency)}
                  </div>
                )}
              </div>

              {/* Status Updater */}
              <div className="space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Update Resolution Status:</label>
                <div className="flex flex-wrap gap-2">
                  {(['Pending', 'In Progress', 'Resolved', 'Acknowledged'] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setReplyStatus(status)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all uppercase tracking-wider shadow-sm",
                        replyStatus === status
                          ? status === 'Pending' ? "bg-rose-100 text-rose-800 border-rose-200"
                            : status === 'In Progress' ? "bg-amber-100 text-amber-800 border-amber-200"
                            : status === 'Resolved' ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                            : "bg-blue-100 text-blue-800 border-blue-200"
                          : "bg-white text-slate-500 hover:text-slate-800 border-slate-100 hover:bg-slate-50"
                      )}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Remark field */}
              <div className="space-y-2">
                <label htmlFor="adminRemark" className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Administrative Reply / Remarks:</label>
                <Textarea
                  id="adminRemark"
                  rows={4}
                  value={adminRemark}
                  onChange={e => setAdminRemark(e.target.value)}
                  placeholder="Provide resolution remarks, action items, or feedback for the parents to see..."
                  className="rounded-2xl border-slate-200 resize-none font-semibold text-xs leading-relaxed focus:border-indigo-400"
                />
                <span className="text-[9px] text-slate-400 block font-medium">Remarks are visible to the submitting parent immediately upon saving.</span>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex flex-row justify-end items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setSelectedRecord(null)}
              className="rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-200 text-slate-500"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRecord}
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider px-5"
            >
              {isSubmitting ? 'Updating...' : 'Save & Publish'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
