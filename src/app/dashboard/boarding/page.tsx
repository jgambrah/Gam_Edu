'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, doc, setDoc, deleteDoc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useCurrentSchool } from '@/hooks/use-current-school';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Loader2, Home, Bed, UserPlus, Users, ArrowRightLeft, ShieldCheck, RefreshCw, LogOut, 
  Calendar, Utensils, Activity, Search, AlertOctagon, Heart, ListTodo, ClipboardCopy, 
  Plus, Check, Clock, UserCheck, ShieldAlert, Wallet, Trash2, X, ChevronsUpDown
} from 'lucide-react';
import BoardingSeeder from '@/components/dashboard/boarding/boarding-seeder';
import { cn } from '@/lib/utils';
import { useRole } from '@/context/role-context';

interface Occupant {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  classId?: string;
  photoURL?: string;
}

interface BedInfo {
  id: string;
  bedIdentifier: string;
  status: 'Available' | 'Occupied' | 'Maintenance';
  currentOccupantId: string | null;
  occupant: Occupant | null;
}

interface RoomInfo {
  id: string;
  roomNumber: string;
  floorLevel: number;
  totalCapacity: number;
  roomType: 'Standard' | 'AC' | 'Premium' | 'Study';
  status: 'Available' | 'Full' | 'Maintenance' | 'Inactive';
  beds: BedInfo[];
}

interface FloorInfo {
  floorLevel: number;
  rooms: RoomInfo[];
}

interface BlockInfo {
  id: string;
  name: string;
  genderRestriction: 'Male' | 'Female' | 'Co-Ed' | 'None';
  totalFloors: number;
  floors: FloorInfo[];
}

interface SearchableSelectOption {
  id: string;
  name: string;
  subtext?: string;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Search and select...",
  className = ""
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const selectedOption = options.find(opt => opt.id === value);
  const displayValue = isOpen ? searchQuery : (selectedOption ? selectedOption.name : '');

  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (opt.subtext && opt.subtext.toLowerCase().includes(searchQuery.toLowerCase())) ||
    opt.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <Input
          type="text"
          placeholder={selectedOption ? selectedOption.name : placeholder}
          value={displayValue}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setSearchQuery('');
          }}
          onBlur={() => {
            // Delay to allow clicking items in dropdown
            setTimeout(() => setIsOpen(false), 250);
          }}
          className="bg-white border-2 pr-10 cursor-pointer text-xs h-9 rounded-xl w-full"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
          {value && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onValueChange('');
                setSearchQuery('');
              }}
              className="hover:text-rose-500 p-0.5"
            >
              <X size={14} />
            </button>
          )}
          <ChevronsUpDown size={14} className="pointer-events-none" />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onMouseDown={() => {
                  onValueChange(opt.id);
                  setSearchQuery('');
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 text-xs rounded-lg transition-colors flex flex-col",
                  value === opt.id 
                    ? 'bg-indigo-50 text-indigo-900 font-bold' 
                    : 'hover:bg-slate-50 text-slate-700'
                )}
              >
                <span>{opt.name}</span>
                {opt.subtext && (
                  <span className="text-[10px] text-slate-400 font-normal mt-0.5">{opt.subtext}</span>
                )}
              </button>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-slate-400 italic">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BoardingPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { schoolId } = useCurrentSchool();
  const { toast } = useToast();
  const { role } = useRole();

  // Role permissions
  const isSuperAdmin = user?.uid === "L4oE5XWweKRYrhtIXn6hB8IDHBC2" || user?.uid === "gZxe3nMbGcQhNgEzkwEZwDBnkFR2";
  const canManageBoarding = isSuperAdmin || ['Administrator', 'Director', 'Secretary', 'Teacher', 'Warden', 'Boarding Staff'].includes(role || '');
  const canManageMess = isSuperAdmin || ['Administrator', 'Director', 'Teacher', 'Cook', 'Mess Manager'].includes(role || '');
  const canManageMedical = isSuperAdmin || ['Administrator', 'Director', 'Teacher', 'Nurse', 'Doctor', 'Warden', 'Boarding Staff'].includes(role || '');
  const canManageSecurity = isSuperAdmin || ['Administrator', 'Director', 'Teacher', 'Security Officer', 'Warden', 'Boarding Staff'].includes(role || '');

  const canManageWallet = isSuperAdmin || ['Administrator', 'Director', 'Teacher', 'Warden', 'Boarding Staff', 'Shopkeeper', 'Parent'].includes(role || '');
  const canDebitWallet = isSuperAdmin || ['Administrator', 'Director', 'Teacher', 'Warden', 'Boarding Staff', 'Shopkeeper', 'Cook', 'Mess Manager'].includes(role || '');
  const canTopUpWallet = isSuperAdmin || ['Administrator', 'Director', 'Teacher', 'Warden', 'Boarding Staff', 'Parent'].includes(role || '');

  // Tab State
  const [activeTab, setActiveTab] = useState<'hostels' | 'applications' | 'leaves' | 'security' | 'mess' | 'medical' | 'wallet'>('hostels');

  // Unified States
  const [blocks, setBlocks] = useState<BlockInfo[]>([]);
  const [allStudents, setAllStudents] = useState<any[]>([]);
  const [boardingStudents, setBoardingStudents] = useState<any[]>([]);
  const [unassignedStudents, setUnassignedStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Parent Boarding Applications States
  const [applications, setApplications] = useState<any[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [appToReject, setAppToReject] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [allocateFromApp, setAllocateFromApp] = useState<any | null>(null);

  // Modal States (Hostels)
  const [allocateOpen, setAllocateOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [studentToCheckout, setStudentToCheckout] = useState<{ id: string; name: string } | null>(null);

  // Setup Facilities States
  const [facilitiesOpen, setFacilitiesOpen] = useState(false);
  const [facilitiesTab, setFacilitiesTab] = useState<'blocks' | 'rooms'>('blocks');
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockGender, setNewBlockGender] = useState<'Male' | 'Female' | 'Co-Ed' | 'None'>('Male');
  const [newBlockFloors, setNewBlockFloors] = useState('2');
  const [newRoomBlockId, setNewRoomBlockId] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newRoomFloor, setNewRoomFloor] = useState('0');
  const [newRoomType, setNewRoomType] = useState<'Standard' | 'AC' | 'Premium' | 'Study'>('Standard');
  const [newRoomCapacity, setNewRoomCapacity] = useState('4');

  // Form States (Hostels)
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [transferStudentId, setTransferStudentId] = useState('');
  const [transferNewBedId, setTransferNewBedId] = useState('');

  // Search/Filtering States
  const [hostelLayoutSearch, setHostelLayoutSearch] = useState('');

  // When Check-In modal opens/closes
  const handleSetAllocateOpen = (open: boolean) => {
    setAllocateOpen(open);
    if (!open) {
      setAllocateFromApp(null);
    }
  };

  // When Transfer modal opens/closes
  const handleSetTransferOpen = (open: boolean) => {
    setTransferOpen(open);
  };

  // --- Leaves & Outings State ---
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loadingLeaves, setLoadingLeaves] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    studentId: '',
    leaveType: 'Day Outing' as 'Day Outing' | 'Weekend Leave' | 'Vacation',
    departureDate: '',
    expectedReturnDate: '',
    destination: '',
    reason: '',
    parentContact: '',
  });
  const [gatePassToken, setGatePassToken] = useState('');
  const [gatePassLoading, setGatePassLoading] = useState(false);

  // --- Security & Visitors State ---
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [visitorForm, setVisitorForm] = useState({
    visitorName: '',
    contactNumber: '',
    relationshipToStudent: '',
    photoIdUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60',
    studentId: '',
  });
  const [rollCallDate, setRollCallDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [presentStudentIds, setPresentStudentIds] = useState<string[]>([]);
  const [rollCallResult, setRollCallResult] = useState<any>(null);
  const [rollCallLoading, setRollCallLoading] = useState(false);

  // --- Mess & Diet State ---
  const [messMenu, setMessMenu] = useState<any>(null);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [menuWeekStartDate, setMenuWeekStartDate] = useState(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  });
  const [menuForm, setMenuForm] = useState<Record<string, { breakfast: string; lunch: string; dinner: string }>>({
    'Monday': { breakfast: '', lunch: '', dinner: '' },
    'Tuesday': { breakfast: '', lunch: '', dinner: '' },
    'Wednesday': { breakfast: '', lunch: '', dinner: '' },
    'Thursday': { breakfast: '', lunch: '', dinner: '' },
    'Friday': { breakfast: '', lunch: '', dinner: '' },
    'Saturday': { breakfast: '', lunch: '', dinner: '' },
    'Sunday': { breakfast: '', lunch: '', dinner: '' },
  });
  const [dietaryProfile, setDietaryProfile] = useState<any>(null);
  const [loadingDietary, setLoadingDietary] = useState(false);
  const [diningAttendanceForm, setDiningAttendanceForm] = useState({
    date: new Date().toISOString().split('T')[0],
    mealType: 'Breakfast' as 'Breakfast' | 'Lunch' | 'Dinner',
    studentId: '',
    status: 'Attended' as 'Attended' | 'Missed',
  });

  // --- Sick Bay / Medical State ---
  const [selectedMedStudentId, setSelectedMedStudentId] = useState('');
  const [medicalProfile, setMedicalProfile] = useState<any>(null);
  const [loadingMedProfile, setLoadingMedProfile] = useState(false);
  const [visitForm, setVisitForm] = useState({
    studentId: '',
    reportedSymptoms: '',
    treatmentAdministered: '',
    disposition: 'Returned to Dorm' as 'Returned to Dorm' | 'Kept for Observation' | 'Transferred to Hospital',
    isSevereTriage: false,
  });

  // --- Digital Wallet State ---
  const [selectedWalletStudentId, setSelectedWalletStudentId] = useState('');
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [loadingWallet, setLoadingWallet] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [topUpDescription, setTopUpDescription] = useState('Parent Top-Up');
  const [debitAmount, setDebitAmount] = useState('');
  const [debitDescription, setDebitDescription] = useState('Tuck Shop Purchase');

  // Fetch boarding layout tree & unassigned students
  const loadData = useCallback(async () => {
    if (!user || !schoolId || !firestore) return;
    setLoading(true);
    try {
      const token = await user.getIdToken();

      // 1. Fetch layout tree
      const layoutRes = await fetch(`/api/boarding/layout?schoolId=${schoolId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const layoutData = await layoutRes.json();
      if (!layoutRes.ok) throw new Error(layoutData.error || 'Failed to fetch layout');
      setBlocks(layoutData.blocks || []);

      // 2. Fetch all active students in school to calculate unassigned ones
      const studentsSnap = await getDocs(
        query(
          collection(firestore, 'students'),
          where('schoolId', '==', schoolId),
          where('enrollmentStatus', '==', 'Active')
        )
      );

      const allStudentsList = studentsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllStudents(allStudentsList);

      // Extract all assigned student IDs from the layout tree
      const assignedIds = new Set<string>();
      layoutData.blocks.forEach((block: BlockInfo) => {
        block.floors.forEach((floor) => {
          floor.rooms.forEach((room) => {
            room.beds.forEach((bed) => {
              if (bed.currentOccupantId) {
                assignedIds.add(bed.currentOccupantId);
              }
            });
          });
        });
      });

      // Filter for unassigned students
      const unassigned = allStudentsList.filter(student => !assignedIds.has(student.id));
      setUnassignedStudents(unassigned);

    } catch (error: any) {
      console.error('Error loading boarding data:', error);
      toast({ variant: 'destructive', title: 'Error Loading Boarding', description: error.message });
    } finally {
      setLoading(false);
    }
  }, [user, schoolId, firestore, toast]);

  // Load Active Boarding Allocations (for roll call & mess checklists)
  const loadBoardingStudents = useCallback(async () => {
    if (!schoolId || !firestore) return;
    try {
      const snap = await getDocs(
        query(
          collection(firestore, 'hostel_allocations'),
          where('schoolId', '==', schoolId),
          where('status', '==', 'Active')
        )
      );
      setBoardingStudents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (e) {
      console.error('Error fetching boarding students:', e);
    }
  }, [schoolId, firestore]);

  // --- Parent Boarding Applications Backend Calls ---
  const fetchApplications = useCallback(async () => {
    if (!schoolId || !firestore) return;
    setLoadingApplications(true);
    try {
      const snap = await getDocs(
        query(
          collection(firestore, 'boarding_applications'),
          where('schoolId', '==', schoolId)
        )
      );
      const list = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt ? new Date(d.createdAt) : new Date(),
        };
      });
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setApplications(list);
    } catch (e: any) {
      console.error('Error fetching applications:', e);
    } finally {
      setLoadingApplications(false);
    }
  }, [schoolId, firestore]);

  const handleRejectApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !appToReject || !rejectionReason || !user) return;
    setActionLoading(true);
    try {
      const reviewerName = user.displayName || 'Administrator';
      const appRef = doc(firestore, 'boarding_applications', appToReject.id);
      await setDoc(appRef, {
        status: 'Rejected',
        rejectionReason,
        reviewedById: user.uid,
        reviewedByName: reviewerName,
        reviewedAt: serverTimestamp(),
      }, { merge: true });

      toast({ title: 'Application Rejected ❌', description: 'The application was rejected.' });
      setRejectDialogOpen(false);
      setAppToReject(null);
      setRejectionReason('');
      fetchApplications();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Action Failed', description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Outings & Leaves Backend Calls ---
  const fetchLeaves = useCallback(async () => {
    if (!schoolId || !firestore) return;
    setLoadingLeaves(true);
    try {
      const snap = await getDocs(
        query(
          collection(firestore, 'student_leaves'),
          where('schoolId', '==', schoolId)
        )
      );
      const list = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          departureDate: d.departureDate?.toDate ? d.departureDate.toDate() : new Date(d.departureDate),
          expectedReturnDate: d.expectedReturnDate?.toDate ? d.expectedReturnDate.toDate() : new Date(d.expectedReturnDate),
          actualDepartureTime: d.actualDepartureTime?.toDate ? d.actualDepartureTime.toDate() : d.actualDepartureTime,
          actualReturnTime: d.actualReturnTime?.toDate ? d.actualReturnTime.toDate() : d.actualReturnTime,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : d.createdAt,
        };
      });
      list.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setLeaves(list);
    } catch (e: any) {
      console.error('Error loading leaves:', e);
    } finally {
      setLoadingLeaves(false);
    }
  }, [schoolId, firestore]);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !leaveForm.studentId || !leaveForm.departureDate || !leaveForm.expectedReturnDate || !leaveForm.destination) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      // Resolve student name
      const targetStudent = allStudents.find(s => s.id === leaveForm.studentId);
      const studentName = targetStudent ? `${targetStudent.firstName} ${targetStudent.lastName}` : 'Student';

      const res = await fetch('/api/leaves/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: leaveForm.studentId,
          studentName,
          leaveType: leaveForm.leaveType,
          departureDate: new Date(leaveForm.departureDate).toISOString(),
          expectedReturnDate: new Date(leaveForm.expectedReturnDate).toISOString(),
          destination: leaveForm.destination,
          reason: leaveForm.reason,
          parentContact: leaveForm.parentContact,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit leave request');

      toast({ title: 'Leave Request Submitted! 🛫', description: 'Warden approval is pending.' });
      setLeaveForm({
        studentId: '',
        leaveType: 'Day Outing',
        departureDate: '',
        expectedReturnDate: '',
        destination: '',
        reason: '',
        parentContact: '',
      });
      fetchLeaves();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Request Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId: string, action: 'Approve' | 'Reject') => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/leaves/approve', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ leaveId, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update leave request');

      toast({ title: `Leave ${action}d successfully!`, description: data.gatePassToken ? `Digital Gate Pass generated: ${data.gatePassToken}` : '' });
      fetchLeaves();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Action Failed', description: err.message });
    }
  };

  const handleGateAction = async (action: 'checkout' | 'checkin') => {
    if (!user || !gatePassToken) return;
    setGatePassLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/leaves/gate-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ gatePassToken, action }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gate action failed');

      toast({ title: 'Security Pass Scanned! 🛡️', description: `Student marked as ${action === 'checkout' ? 'Checked-Out' : 'Checked-In'}.` });
      setGatePassToken('');
      fetchLeaves();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Gate Action Error', description: err.message });
    } finally {
      setGatePassLoading(false);
    }
  };

  // --- Security & Visitors Backend Calls ---
  const fetchVisitors = useCallback(async () => {
    if (!schoolId || !firestore) return;
    setLoadingVisitors(true);
    try {
      const snap = await getDocs(
        query(
          collection(firestore, 'boarding_visitors'),
          where('schoolId', '==', schoolId)
        )
      );
      const list = snap.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          ...d,
          checkInTime: d.checkInTime?.toDate ? d.checkInTime.toDate() : new Date(d.checkInTime),
          checkOutTime: d.checkOutTime?.toDate ? d.checkOutTime.toDate() : d.checkOutTime ? new Date(d.checkOutTime) : null,
        };
      });
      list.sort((a, b) => b.checkInTime.getTime() - a.checkInTime.getTime());
      setVisitors(list);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingVisitors(false);
    }
  }, [schoolId, firestore]);

  const handleVisitorCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !visitorForm.visitorName || !visitorForm.contactNumber || !visitorForm.studentId) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/security/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...visitorForm }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check-in visitor');

      toast({ title: 'Visitor Logged! 👤', description: 'Visitor check-in time recorded at gate.' });
      setVisitorForm({
        visitorName: '',
        contactNumber: '',
        relationshipToStudent: '',
        photoIdUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=60',
        studentId: '',
      });
      fetchVisitors();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Visitor Log Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleVisitorCheckOut = async (visitorId: string) => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/security/visitor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ visitorId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to check-out visitor');

      toast({ title: 'Visitor Checked Out 👋', description: 'Check-out timestamp registered.' });
      fetchVisitors();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Check-Out Failed', description: err.message });
    }
  };

  const handleRollCallSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !rollCallDate) return;
    setRollCallLoading(true);
    setRollCallResult(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/security/roll-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          date: rollCallDate,
          presentStudentIds,
          schoolId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit roll call report');

      toast({ title: 'Roll-Call Logged! 📋', description: 'Night roll call checklist submitted.' });
      setRollCallResult(data);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Roll-Call Failed', description: err.message });
    } finally {
      setRollCallLoading(false);
    }
  };

  // --- Mess & Diet Backend Calls ---
  const fetchMenu = useCallback(async () => {
    if (!schoolId || !firestore || !menuWeekStartDate) return;
    setLoadingMenu(true);
    try {
      const snap = await getDocs(
        query(
          collection(firestore, 'mess_weekly_menus'),
          where('schoolId', '==', schoolId),
          where('weekStartDate', '==', menuWeekStartDate)
        )
      );

      if (!snap.empty) {
        const d = snap.docs[0].data();
        setMessMenu(d);
        setMenuForm(d.menu || {});
      } else {
        setMessMenu(null);
        setMenuForm({
          'Monday': { breakfast: '', lunch: '', dinner: '' },
          'Tuesday': { breakfast: '', lunch: '', dinner: '' },
          'Wednesday': { breakfast: '', lunch: '', dinner: '' },
          'Thursday': { breakfast: '', lunch: '', dinner: '' },
          'Friday': { breakfast: '', lunch: '', dinner: '' },
          'Saturday': { breakfast: '', lunch: '', dinner: '' },
          'Sunday': { breakfast: '', lunch: '', dinner: '' },
        });
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoadingMenu(false);
    }
  }, [schoolId, firestore, menuWeekStartDate]);

  const handlePublishMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !menuWeekStartDate) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/mess/menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          weekStartDate: menuWeekStartDate,
          menu: menuForm,
          schoolId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to publish weekly menu');

      toast({ title: 'Menu Published! 🍽️', description: `Weekly schedule starting ${menuWeekStartDate} is live.` });
      fetchMenu();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Publish Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const fetchDietary = useCallback(async () => {
    if (!user || !schoolId) return;
    setLoadingDietary(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/mess/dietary-profiles?schoolId=${schoolId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch dietary stats');
      setDietaryProfile(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoadingDietary(false);
    }
  }, [user, schoolId]);

  const handleDiningAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !diningAttendanceForm.studentId || !diningAttendanceForm.date) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/mess/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...diningAttendanceForm, schoolId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log dining attendance');

      toast({ title: 'Attendance Logged! 🍽️', description: 'Dining entry successfully saved.' });
      setDiningAttendanceForm({
        ...diningAttendanceForm,
        studentId: '',
      });
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Attendance Log Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Sick Bay / Medical Backend Calls ---
  const handleFetchMedicalProfile = async (studentId: string) => {
    if (!user || !studentId) return;
    setLoadingMedProfile(true);
    setMedicalProfile(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/medical/profile/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch medical profile');
      setMedicalProfile(data);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Lookup Failed', description: err.message });
    } finally {
      setLoadingMedProfile(false);
    }
  };

  const handleLogVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !visitForm.studentId || !visitForm.reportedSymptoms || !visitForm.treatmentAdministered) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/medical/visit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ ...visitForm, schoolId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to log infirmary visit');

      toast({ 
        title: data.isSevereTriage ? '🚨 SEVERE VISIT LOGGED' : 'Sick Bay Log Saved! 🩺', 
        description: data.isSevereTriage ? 'Urgent escalation alert has been dispatched to all school administrators.' : 'Visit details stored successfully.' 
      });

      setVisitForm({
        studentId: '',
        reportedSymptoms: '',
        treatmentAdministered: '',
        disposition: 'Returned to Dorm',
        isSevereTriage: false,
      });

      if (selectedMedStudentId === visitForm.studentId) {
        handleFetchMedicalProfile(selectedMedStudentId);
      }
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Logging Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Digital Wallet Backend Actions ---
  const fetchWalletStatement = async (studentId: string) => {
    if (!user || !studentId) return;
    setLoadingWallet(true);
    setWalletInfo(null);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/wallet/statement/${studentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch statement');
      setWalletInfo(data);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Statement Error', description: err.message });
    } finally {
      setLoadingWallet(false);
    }
  };

  const handleTopUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedWalletStudentId || !topUpAmount) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/wallet/top-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedWalletStudentId,
          amount: parseFloat(topUpAmount),
          description: topUpDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to top-up wallet');

      toast({ title: 'Top-Up Successful! 💰', description: `Added GHS ${parseFloat(topUpAmount).toFixed(2)} to wallet.` });
      setTopUpAmount('');
      setTopUpDescription('Parent Top-Up');
      fetchWalletStatement(selectedWalletStudentId);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Top-Up Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDebitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedWalletStudentId || !debitAmount || !debitDescription) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/wallet/transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedWalletStudentId,
          amount: parseFloat(debitAmount),
          description: debitDescription,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transaction failed');

      toast({ title: 'Debit Processed! 🛒', description: `Debited GHS ${parseFloat(debitAmount).toFixed(2)} for ${debitDescription}.` });
      setDebitAmount('');
      setDebitDescription('Tuck Shop Purchase');
      fetchWalletStatement(selectedWalletStudentId);
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Debit Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // --- Hostel Management Backend Actions ---
  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedStudentId || !selectedBedId) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/boarding/allocate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedStudentId,
          bedId: selectedBedId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to allocate bed');

      // If we are allocating from a parent boarding application, update the application record to Approved
      if (allocateFromApp && firestore) {
        try {
          const reviewerName = user.displayName || 'Administrator';
          const appRef = doc(firestore, 'boarding_applications', allocateFromApp.id);
          await setDoc(appRef, {
            status: 'Approved',
            reviewedById: user.uid,
            reviewedByName: reviewerName,
            reviewedAt: serverTimestamp(),
            allocationId: data.allocationId || '',
          }, { merge: true });
          
          fetchApplications();
        } catch (dbErr) {
          console.error('Failed to update boarding application status:', dbErr);
        } finally {
          setAllocateFromApp(null);
        }
      }

      toast({ title: 'Allocation Successful! 🎉', description: 'Student is checked into the bed.' });
      setAllocateOpen(false);
      setSelectedStudentId('');
      setSelectedBedId('');
      loadData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Allocation Failed', description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !transferStudentId || !transferNewBedId) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/boarding/transfer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: transferStudentId,
          newBedId: transferNewBedId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to transfer bed');

      toast({ title: 'Transfer Successful! 🔄', description: 'Student has been moved to the new bed.' });
      setTransferOpen(false);
      setTransferStudentId('');
      setTransferNewBedId('');
      loadData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Transfer Failed', description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckout = async (studentId: string, studentName: string) => {
    setStudentToCheckout({ id: studentId, name: studentName });
    setCheckoutOpen(true);
  };

  const confirmCheckoutBed = async () => {
    if (!user || !studentToCheckout) return;
    setActionLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/boarding/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: studentToCheckout.id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to checkout student');

      toast({ title: 'Check-Out Successful! 👋', description: 'Student has been checked out of the bed.' });
      setCheckoutOpen(false);
      setStudentToCheckout(null);
      loadData();
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Check-Out Failed', description: error.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || !user || !newBlockName || !newBlockFloors) return;
    setActionLoading(true);
    try {
      const floors = parseInt(newBlockFloors);
      if (isNaN(floors) || floors <= 0) throw new Error('Floors must be a positive number');

      const blockRef = doc(collection(firestore, 'hostel_blocks'));
      await setDoc(blockRef, {
        id: blockRef.id,
        schoolId,
        name: newBlockName,
        genderRestriction: newBlockGender,
        totalFloors: floors,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      toast({ title: 'Hostel Block Created! 🏢', description: `Block "${newBlockName}" was successfully set up.` });
      setNewBlockName('');
      setNewBlockFloors('2');
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Block Creation Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !schoolId || !newRoomBlockId || !newRoomNumber || !newRoomCapacity) return;
    setActionLoading(true);
    try {
      const capacity = parseInt(newRoomCapacity);
      const floor = parseInt(newRoomFloor);
      if (isNaN(capacity) || capacity <= 0) throw new Error('Room capacity must be a positive number');
      if (isNaN(floor) || floor < 0) throw new Error('Floor level must be 0 or higher');

      const block = blocks.find(b => b.id === newRoomBlockId);
      if (!block) throw new Error('Selected block not found');
      if (floor >= block.totalFloors) {
        throw new Error(`Invalid floor: "${block.name}" only has ${block.totalFloors} floors (max floor level is ${block.totalFloors - 1}).`);
      }

      const batch = writeBatch(firestore);
      const roomRef = doc(collection(firestore, 'hostel_rooms'));
      const roomId = roomRef.id;

      batch.set(roomRef, {
        id: roomId,
        schoolId,
        blockId: newRoomBlockId,
        roomNumber: newRoomNumber,
        floorLevel: floor,
        totalCapacity: capacity,
        roomType: newRoomType,
        status: 'Available',
        createdAt: serverTimestamp(),
      });

      for (let i = 1; i <= capacity; i++) {
        const bedRef = doc(collection(firestore, 'hostel_beds'));
        batch.set(bedRef, {
          id: bedRef.id,
          schoolId,
          blockId: newRoomBlockId,
          roomId,
          bedIdentifier: `Bed ${i}`,
          status: 'Available',
          currentOccupantId: null,
          createdAt: serverTimestamp(),
        });
      }

      await batch.commit();
      toast({ title: 'Room & Beds Created! 🛏️', description: `Room ${newRoomNumber} with ${capacity} beds was successfully created.` });
      setNewRoomNumber('');
      setNewRoomFloor('0');
      setNewRoomCapacity('4');
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Room Creation Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!firestore || !schoolId) return;
    
    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    let hasOccupied = false;
    block.floors.forEach((f) => {
      f.rooms.forEach((r) => {
        r.beds.forEach((b) => {
          if (b.status === 'Occupied') hasOccupied = true;
        });
      });
    });

    if (hasOccupied) {
      toast({ variant: 'destructive', title: 'Cannot Delete Block', description: 'This block cannot be deleted because it contains occupied beds. Please check out students first.' });
      return;
    }

    setActionLoading(true);
    try {
      const batch = writeBatch(firestore);
      batch.delete(doc(firestore, 'hostel_blocks', blockId));

      const roomsSnap = await getDocs(
        query(collection(firestore, 'hostel_rooms'), where('blockId', '==', blockId))
      );
      roomsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      const bedsSnap = await getDocs(
        query(collection(firestore, 'hostel_beds'), where('blockId', '==', blockId))
      );
      bedsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      toast({ title: 'Block Deleted', description: `Hostel block "${block.name}" and all its rooms/beds were deleted.` });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId: string, roomNumber: string) => {
    if (!firestore || !schoolId) return;

    let hasOccupied = false;
    blocks.forEach((block) => {
      block.floors.forEach((floor) => {
        const found = floor.rooms.find(r => r.id === roomId);
        if (found) {
          found.beds.forEach((bed) => {
            if (bed.status === 'Occupied') hasOccupied = true;
          });
        }
      });
    });

    if (hasOccupied) {
      toast({ variant: 'destructive', title: 'Cannot Delete Room', description: 'This room cannot be deleted because it has occupied beds.' });
      return;
    }

    setActionLoading(true);
    try {
      const batch = writeBatch(firestore);
      batch.delete(doc(firestore, 'hostel_rooms', roomId));

      const bedsSnap = await getDocs(
        query(collection(firestore, 'hostel_beds'), where('roomId', '==', roomId))
      );
      bedsSnap.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      toast({ title: 'Room Deleted', description: `Room ${roomNumber} and its beds were successfully deleted.` });
      loadData();
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Deletion Failed', description: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to compile statistics
  const stats = (() => {
    let totalBlocks = blocks.length;
    let totalRooms = 0;
    let totalBeds = 0;
    let occupiedBeds = 0;

    blocks.forEach((block) => {
      block.floors.forEach((floor) => {
        floor.rooms.forEach((room) => {
          totalRooms++;
          room.beds.forEach((bed) => {
            totalBeds++;
            if (bed.status === 'Occupied') occupiedBeds++;
          });
        });
      });
    });

    return {
      totalBlocks,
      totalRooms,
      totalBeds,
      occupiedBeds,
      availableBeds: totalBeds - occupiedBeds,
    };
  })();

  const availableBedsList: { 
    id: string; 
    label: string; 
    genderRestriction: string;
    roomId: string;
    roomNumber: string;
    blockName: string;
    floorLevel: number;
  }[] = [];
  blocks.forEach((block) => {
    block.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        room.beds.forEach((bed) => {
          if (bed.status === 'Available') {
            availableBedsList.push({
              id: bed.id,
              label: `${block.name} - Floor ${floor.floorLevel} - Rm ${room.roomNumber} - ${bed.bedIdentifier}`,
              genderRestriction: block.genderRestriction,
              roomId: room.id,
              roomNumber: room.roomNumber,
              blockName: block.name,
              floorLevel: floor.floorLevel,
            });
          }
        });
      });
    });
  });

  const allocatedStudentsList: { id: string; name: string }[] = [];
  blocks.forEach((block) => {
    block.floors.forEach((floor) => {
      floor.rooms.forEach((room) => {
        room.beds.forEach((bed) => {
          if (bed.status === 'Occupied' && bed.occupant) {
            allocatedStudentsList.push({
              id: bed.occupant.id,
              name: `${bed.occupant.firstName} ${bed.occupant.lastName} (${block.name}, Rm ${room.roomNumber})`,
            });
          }
        });
      });
    });
  });

  // Filter available beds for Check-In modal
  const getFilteredBedsForCheckIn = () => {
    let list = availableBedsList;
    if (selectedStudentId) {
      const student = unassignedStudents.find(s => s.id === selectedStudentId) || 
                      (allocateFromApp && allocateFromApp.studentId === selectedStudentId ? allocateFromApp : null);
      if (student && student.gender) {
        const sg = student.gender.toLowerCase();
        list = list.filter(b => {
          const restriction = b.genderRestriction.toLowerCase();
          if (restriction === 'male' && sg !== 'male' && sg !== 'm') return false;
          if (restriction === 'female' && sg !== 'female' && sg !== 'f') return false;
          return true;
        });
      }
    }
    return list;
  };

  // Filter available beds for Transfer modal
  const getFilteredBedsForTransfer = () => {
    let list = availableBedsList;
    if (transferStudentId) {
      const student = allStudents.find(s => s.id === transferStudentId);
      if (student && student.gender) {
        const sg = student.gender.toLowerCase();
        list = list.filter(b => {
          const restriction = b.genderRestriction.toLowerCase();
          if (restriction === 'male' && sg !== 'male' && sg !== 'm') return false;
          if (restriction === 'female' && sg !== 'female' && sg !== 'f') return false;
          return true;
        });
      }
    }
    return list;
  };

  // Dynamically filter blocks, floors, rooms, beds based on layout search (search engine)
  const getFilteredBlocks = () => {
    if (!hostelLayoutSearch) return blocks;
    const query = hostelLayoutSearch.toLowerCase();
    
    return blocks.map(block => {
      const floorsFiltered = block.floors.map(floor => {
        const roomsFiltered = floor.rooms.filter(room => {
          if (block.name.toLowerCase().includes(query)) return true;
          if (room.roomNumber.toLowerCase().includes(query)) return true;
          if (room.roomType.toLowerCase().includes(query)) return true;
          
          const bedMatch = room.beds.some(bed => {
            if (bed.bedIdentifier.toLowerCase().includes(query)) return true;
            if (bed.occupant) {
              const fullName = `${bed.occupant.firstName} ${bed.occupant.lastName}`.toLowerCase();
              if (fullName.includes(query)) return true;
              if (bed.occupant.id.toLowerCase().includes(query)) return true;
            }
            return false;
          });
          return bedMatch;
        });
        
        return {
          ...floor,
          rooms: roomsFiltered,
        };
      }).filter(floor => floor.rooms.length > 0);
      
      return {
        ...block,
        floors: floorsFiltered,
      };
    }).filter(block => block.floors.length > 0);
  };

  // Trigger loads based on active tab
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (activeTab === 'leaves') {
      fetchLeaves();
    } else if (activeTab === 'applications') {
      fetchApplications();
    } else if (activeTab === 'security') {
      fetchVisitors();
      loadBoardingStudents();
    } else if (activeTab === 'mess') {
      fetchMenu();
      fetchDietary();
      loadBoardingStudents();
    }
  }, [activeTab, fetchLeaves, fetchApplications, fetchVisitors, loadBoardingStudents, fetchMenu, fetchDietary]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Executive Indigo/Violet Gradient Header Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 p-8 md:p-10 text-white shadow-xl shadow-indigo-100/50 dark:shadow-none mb-2">
        {/* Decorative background shapes for rich aesthetics */}
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl animate-pulse" />
        <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md font-bold">
              <Home className="h-3.5 w-3.5 text-indigo-200 animate-pulse" /> Campus Housing & Boarding
            </span>
            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight italic uppercase">Boarding & Hostels</h1>
            <p className="mt-2 text-indigo-100/90 max-w-xl text-sm leading-relaxed font-semibold italic">
              Manage campus boarding allocations, bed capacities, parent applications, clearance workflows, and student digital wallets.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button onClick={loadData} variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white rounded-xl h-11 border-2 font-bold">
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh Layout
            </Button>

          {canManageBoarding && activeTab === 'hostels' && (
            <>
              {/* Setup Facilities Dialog */}
              <Dialog open={facilitiesOpen} onOpenChange={setFacilitiesOpen}>
                <Button onClick={() => setFacilitiesOpen(true)} className="bg-white text-indigo-600 hover:bg-white/90 font-extrabold h-11 rounded-xl px-5 border-0 shadow-lg">
                  <Plus className="mr-2 h-4 w-4" /> Setup Facilities
                </Button>
                <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-3xl p-6">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 italic uppercase">Setup Boarding Facilities</DialogTitle>
                    <DialogDescription className="font-semibold text-slate-500">
                      Configure your campus hostel blocks, floors, and rooms. Beds are generated automatically based on room capacities.
                    </DialogDescription>
                  </DialogHeader>

                  {/* Tabs inside Setup Modal */}
                  <div className="flex border-b border-slate-200 my-4">
                    <button
                      type="button"
                      onClick={() => setFacilitiesTab('blocks')}
                      className={cn(
                        "flex-1 py-2 text-center text-sm font-bold border-b-2 transition-all",
                        facilitiesTab === 'blocks' ? "border-indigo-600 text-indigo-600 border-b-indigo-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Hostel Blocks
                    </button>
                    <button
                      type="button"
                      onClick={() => setFacilitiesTab('rooms')}
                      className={cn(
                        "flex-1 py-2 text-center text-sm font-bold border-b-2 transition-all",
                        facilitiesTab === 'rooms' ? "border-indigo-600 text-indigo-600 border-b-indigo-600 font-extrabold" : "border-transparent text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Dorm Rooms
                    </button>
                  </div>

                  {facilitiesTab === 'blocks' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Block Creation Form */}
                      <form onSubmit={handleCreateBlock} className="space-y-4 p-4 border border-indigo-100 bg-indigo-50/20 rounded-2xl">
                        <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Add Hostel Block</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Block Name</Label>
                            <Input 
                              placeholder="e.g. Prestige Block C" 
                              value={newBlockName} 
                              onChange={(e) => setNewBlockName(e.target.value)} 
                              required 
                              className="bg-white h-9 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Gender Restriction</Label>
                            <Select value={newBlockGender} onValueChange={(val: any) => setNewBlockGender(val)}>
                              <SelectTrigger className="bg-white h-9 rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Co-Ed">Co-Ed</SelectItem>
                                <SelectItem value="None">None</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Total Floors</Label>
                            <Input 
                              type="number" 
                              min="1" 
                              max="10" 
                              value={newBlockFloors} 
                              onChange={(e) => setNewBlockFloors(e.target.value)} 
                              required 
                              className="bg-white h-9 rounded-lg"
                            />
                          </div>
                        </div>
                        <Button type="submit" disabled={actionLoading || !newBlockName} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-xs rounded-lg">
                          {actionLoading ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" /> : <Plus className="h-3.5 w-3.5 mr-2" />}
                          Create Block
                        </Button>
                      </form>

                      {/* Blocks List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Active Hostel Blocks</h4>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[25vh] overflow-y-auto">
                          {blocks.length === 0 ? (
                            <div className="p-4 text-center text-xs text-slate-400 italic">No blocks created yet.</div>
                          ) : (
                            <table className="w-full text-xs text-left">
                              <thead className="bg-slate-50 text-slate-500 font-bold">
                                <tr>
                                  <th className="p-3">Block Name</th>
                                  <th className="p-3">Gender</th>
                                  <th className="p-3">Floors</th>
                                  <th className="p-3 text-right">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {blocks.map((b) => (
                                  <tr key={b.id} className="hover:bg-slate-50/50">
                                    <td className="p-3 font-semibold">{b.name}</td>
                                    <td className="p-3">{b.genderRestriction}</td>
                                    <td className="p-3">{b.totalFloors}</td>
                                    <td className="p-3 text-right">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteBlock(b.id)}
                                        className="h-7 w-7 text-rose-500 hover:bg-rose-50 rounded-lg"
                                        title="Delete Block"
                                      >
                                        <Trash2 size={14} />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {facilitiesTab === 'rooms' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Room Creation Form */}
                      <form onSubmit={handleCreateRoom} className="space-y-4 p-4 border border-indigo-100 bg-indigo-50/20 rounded-2xl">
                        <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Add Dorm Room</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <Label className="text-xs">Select Block</Label>
                            <Select value={newRoomBlockId} onValueChange={setNewRoomBlockId}>
                              <SelectTrigger className="bg-white h-9 rounded-lg">
                                <SelectValue placeholder="Choose block..." />
                              </SelectTrigger>
                              <SelectContent>
                                {blocks.map(b => (
                                  <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Room Number</Label>
                            <Input 
                              placeholder="e.g. 101" 
                              value={newRoomNumber} 
                              onChange={(e) => setNewRoomNumber(e.target.value)} 
                              required 
                              className="bg-white h-9 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Floor Level</Label>
                            <Input 
                              type="number" 
                              min="0" 
                              value={newRoomFloor} 
                              onChange={(e) => setNewRoomFloor(e.target.value)} 
                              required 
                              className="bg-white h-9 rounded-lg"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Room Type</Label>
                            <Select value={newRoomType} onValueChange={(val: any) => setNewRoomType(val)}>
                              <SelectTrigger className="bg-white h-9 rounded-lg">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Standard">Standard</SelectItem>
                                <SelectItem value="AC">AC</SelectItem>
                                <SelectItem value="Premium">Premium</SelectItem>
                                <SelectItem value="Study">Study</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <Label className="text-xs">Bed Capacity</Label>
                            <Input 
                              type="number" 
                              min="1" 
                              max="12" 
                              value={newRoomCapacity} 
                              onChange={(e) => setNewRoomCapacity(e.target.value)} 
                              required 
                              className="bg-white h-9 rounded-lg"
                            />
                          </div>
                        </div>
                        <Button type="submit" disabled={actionLoading || !newRoomBlockId || !newRoomNumber} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 text-xs rounded-lg">
                          {actionLoading ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-2" /> : <Plus className="h-3.5 w-3.5 mr-2" />}
                          Create Room & Generate Beds
                        </Button>
                      </form>

                      {/* Rooms List */}
                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider">Active Rooms</h4>
                        <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[25vh] overflow-y-auto">
                          {(() => {
                            const flatRooms: any[] = [];
                            blocks.forEach((block) => {
                              block.floors.forEach((floor) => {
                                floor.rooms.forEach((room) => {
                                  flatRooms.push({
                                    ...room,
                                    blockName: block.name,
                                  });
                                });
                              });
                            });

                            if (flatRooms.length === 0) {
                              return <div className="p-4 text-center text-xs text-slate-400 italic">No rooms set up yet.</div>;
                            }

                            return (
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 text-slate-500 font-bold">
                                  <tr>
                                    <th className="p-3">Block</th>
                                    <th className="p-3">Room</th>
                                    <th className="p-3">Floor</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">Beds</th>
                                    <th className="p-3 text-right">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {flatRooms.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-50/50">
                                      <td className="p-3 font-semibold">{r.blockName}</td>
                                      <td className="p-3 font-semibold">Room {r.roomNumber}</td>
                                      <td className="p-3">{r.floorLevel}</td>
                                      <td className="p-3">{r.roomType}</td>
                                      <td className="p-3">{r.beds.length}</td>
                                      <td className="p-3 text-right">
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteRoom(r.id, r.roomNumber)}
                                          className="h-7 w-7 text-rose-500 hover:bg-rose-50 rounded-lg"
                                          title="Delete Room"
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            );
                          })()}
                        </div>
                      </div>
                    </div>
                  )}

                  <DialogFooter className="pt-4 border-t">
                    <Button type="button" variant="outline" className="border-2 rounded-xl" onClick={() => setFacilitiesOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button onClick={() => setAllocateOpen(true)} className="bg-white/20 hover:bg-white/30 border border-white/20 font-extrabold text-white h-11 rounded-xl px-5 shadow-md">
                <UserPlus className="mr-2 h-4 w-4" /> Check-In Allocation
              </Button>

              <Dialog open={transferOpen} onOpenChange={handleSetTransferOpen}>
                <Button onClick={() => setTransferOpen(true)} className="bg-white/20 hover:bg-white/30 border border-white/20 font-extrabold text-white h-11 rounded-xl px-5 shadow-md">
                  <ArrowRightLeft className="mr-2 h-4 w-4" /> Transfer Bed
                </Button>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Transfer Student Bed</DialogTitle>
                    <DialogDescription>Move a student to a different bed. This closes their active check-in record and starts a new one.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleTransfer} className="space-y-4 py-2">
                    {(() => {
                      const transferStudentOptions = allocatedStudentsList.map(s => ({
                        id: s.id,
                        name: s.name,
                      }));

                      const transferBedOptions = getFilteredBedsForTransfer().map(b => ({
                        id: b.id,
                        name: b.label,
                        subtext: `Gender rule: ${b.genderRestriction}`
                      }));

                      return (
                        <>
                          <div className="space-y-2">
                            <Label>Select Student to Transfer</Label>
                            <SearchableSelect
                              options={transferStudentOptions}
                              value={transferStudentId}
                              onValueChange={setTransferStudentId}
                              placeholder="Search allocated student..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Select New Bed</Label>
                            <SearchableSelect
                              options={transferBedOptions}
                              value={transferNewBedId}
                              onValueChange={setTransferNewBedId}
                              placeholder="Search new bed location..."
                            />
                          </div>
                        </>
                      );
                    })()}

                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" onClick={() => setTransferOpen(false)}>Cancel</Button>
                      <Button type="submit" disabled={actionLoading || !transferStudentId || !transferNewBedId} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                        {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Confirm Transfer'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </>
          )}

          {canManageBoarding && (
            <>
              {/* Allocate Bed Dialog */}
              <Dialog open={allocateOpen} onOpenChange={handleSetAllocateOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Allocate Room Bed</DialogTitle>
                    <DialogDescription>Assign an active student to an available bed. Compatibility rules will run automatically.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAllocate} className="space-y-4 py-2">
                    {(() => {
                      const checkInStudentOptions = unassignedStudents.map(s => ({
                        id: s.id,
                        name: `${s.firstName} ${s.lastName}`,
                        subtext: `${s.gender}, Class ID: ${s.classId || 'N/A'}`
                      }));
                      if (allocateFromApp && !unassignedStudents.some(s => s.id === allocateFromApp.studentId)) {
                        checkInStudentOptions.unshift({
                          id: allocateFromApp.studentId,
                          name: `${allocateFromApp.studentName} (From Application)`,
                          subtext: `Application review`
                        });
                      }

                      const checkInBedOptions = getFilteredBedsForCheckIn().map(b => ({
                        id: b.id,
                        name: b.label,
                        subtext: `Gender rule: ${b.genderRestriction}`
                      }));

                      return (
                        <>
                          <div className="space-y-2">
                            <Label>Select Student</Label>
                            <SearchableSelect
                              options={checkInStudentOptions}
                              value={selectedStudentId}
                              onValueChange={setSelectedStudentId}
                              placeholder="Search student by name or ID..."
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Select Bed Location</Label>
                            <SearchableSelect
                              options={checkInBedOptions}
                              value={selectedBedId}
                              onValueChange={setSelectedBedId}
                              placeholder="Search block, floor, room, or bed..."
                            />
                          </div>
                        </>
                      );
                    })()}

                    <DialogFooter className="pt-4">
                      <Button type="button" variant="outline" onClick={() => {
                        setAllocateOpen(false);
                        setAllocateFromApp(null);
                      }}>Cancel</Button>
                      <Button type="submit" disabled={actionLoading || !selectedStudentId || !selectedBedId} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                        {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Confirm Allocation'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Confirm Check-Out Dialog */}
              <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-slate-800 font-black uppercase italic tracking-tight">Confirm Check-Out</DialogTitle>
                    <DialogDescription className="font-semibold text-slate-500">
                      Are you sure you want to check out <span className="text-indigo-600 underline font-extrabold">{studentToCheckout?.name}</span>? This will release the bed and mark the allocation record as completed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="pt-4">
                    <Button type="button" variant="outline" className="border-2 rounded-xl font-bold" onClick={() => setCheckoutOpen(false)}>Cancel</Button>
                    <Button onClick={confirmCheckoutBed} disabled={actionLoading} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl px-5">
                      {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Confirm Check-Out'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}

          {/* Rejection Dialog for Parent Boarding Applications */}
          <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
            <DialogContent className="max-w-md rounded-2xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 font-black uppercase italic tracking-tight flex items-center gap-2">
                  <ShieldAlert className="text-rose-500 h-5 w-5" /> Reject Application
                </DialogTitle>
                <DialogDescription className="font-semibold text-slate-500">
                  Please enter a reason for rejecting the boarding application for <span className="font-bold text-slate-700">{appToReject?.studentName}</span>. This explanation will be visible to the parent.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleRejectApplication} className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="rejection-reason" className="text-xs font-bold text-slate-600 uppercase">Reason for Rejection</Label>
                  <Textarea 
                    id="rejection-reason"
                    placeholder="e.g. No vacancy in the requested hostel block/gender restriction. Or missing medical records."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="bg-white border-2 h-24"
                    required
                  />
                </div>
                <DialogFooter className="pt-2">
                  <Button type="button" variant="outline" className="border-2 rounded-xl font-bold" onClick={() => {
                    setRejectDialogOpen(false);
                    setAppToReject(null);
                    setRejectionReason('');
                  }}>Cancel</Button>
                  <Button type="submit" disabled={actionLoading || !rejectionReason.trim()} className="bg-rose-600 hover:bg-rose-700 text-white font-bold h-10 rounded-xl px-5">
                    {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Confirm Rejection'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>

      {/* Modern Horizontal Tabs Navigation Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 py-1 scrollbar-none">
        <button
          onClick={() => setActiveTab('hostels')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'hostels' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <Home size={16} /> Hostels & Beds
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'applications' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <ClipboardCopy size={16} /> Parent Applications
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'leaves' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <Calendar size={16} /> Outings & Leaves
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'security' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <ShieldCheck size={16} /> Visitors & Roll Call
        </button>
        <button
          onClick={() => setActiveTab('mess')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'mess' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <Utensils size={16} /> Mess & Diet
        </button>
        <button
          onClick={() => setActiveTab('medical')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'medical' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <Activity size={16} /> Sick Bay (Infirmary)
        </button>
        <button
          onClick={() => setActiveTab('wallet')}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 text-sm font-bold border-b-2 transition-all rounded-t-xl shrink-0",
            activeTab === 'wallet' 
              ? "border-indigo-600 text-indigo-600 bg-indigo-50/40" 
              : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
          )}
        >
          <Wallet size={16} /> Digital Wallet
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        
        {/* TAB 1: HOSTELS & BEDS */}
        {activeTab === 'hostels' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="bg-indigo-50/50 border-indigo-100">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Home size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Blocks</p>
                    <p className="text-xl font-black text-indigo-900">{stats.totalBlocks}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-indigo-50/50 border-indigo-100">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><Home size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Total Rooms</p>
                    <p className="text-xl font-black text-indigo-900">{stats.totalRooms}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-slate-200 rounded-lg text-slate-500"><Bed size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Beds</p>
                    <p className="text-xl font-black text-slate-800">{stats.totalBeds}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-emerald-50 border-emerald-100">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><ShieldCheck size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Available Beds</p>
                    <p className="text-xl font-black text-emerald-900">{stats.availableBeds}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-blue-50 border-blue-100">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Users size={20}/></div>
                  <div>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Occupied Beds</p>
                    <p className="text-xl font-black text-blue-900">{stats.occupiedBeds}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Developer Seeder Section */}
            {canManageBoarding && blocks.length === 0 && !loading && (
              <BoardingSeeder onSeedComplete={loadData} />
            )}

            {/* Main Layout Grid Search Bar (Search Engine) */}
            {blocks.length > 0 && !loading && (
              <div className="relative max-w-md w-full bg-white border-2 border-indigo-50 rounded-2xl shadow-sm p-1.5 flex items-center gap-2 mb-4">
                <Search className="text-indigo-600 h-4.5 w-4.5 ml-2.5" />
                <Input
                  placeholder="Search layout (student, room, block, type)..."
                  value={hostelLayoutSearch}
                  onChange={(e) => setHostelLayoutSearch(e.target.value)}
                  className="bg-transparent border-0 h-9 font-semibold text-slate-700 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-slate-400 text-xs w-full"
                />
                {hostelLayoutSearch && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setHostelLayoutSearch('')} 
                    className="h-7 px-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                  >
                    Clear
                  </Button>
                )}
              </div>
            )}

            {/* Main Layout Grid */}
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-indigo-600 gap-3">
                <Loader2 className="animate-spin h-10 w-10" />
                <p className="text-sm font-bold animate-pulse">Loading hostel layouts...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {getFilteredBlocks().map((block) => (
                  <Card key={block.id} className="border-2 border-indigo-100 shadow-sm rounded-3xl overflow-hidden">
                    <CardHeader className="bg-indigo-50/50 border-b p-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <CardTitle className="text-xl font-black text-slate-800">{block.name}</CardTitle>
                          <CardDescription className="font-semibold text-indigo-700/80">
                            Gender Restriction: <span className="underline">{block.genderRestriction}</span> | Floors: {block.totalFloors}
                          </CardDescription>
                        </div>
                        <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-100 shadow-sm text-xs font-bold text-slate-500">
                          Beds: {block.floors.reduce((sum, f) => sum + f.rooms.reduce((s, r) => s + r.beds.length, 0), 0)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">
                      {block.floors.map((floor) => (
                        <div key={floor.floorLevel} className="space-y-4 border-l-4 border-indigo-200 pl-4">
                          <h3 className="text-xs font-black uppercase text-indigo-900 tracking-wider">
                            Floor {floor.floorLevel === 0 ? '0 (Ground Floor)' : floor.floorLevel}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {floor.rooms.map((room) => (
                              <Card key={room.id} className="border border-slate-200 rounded-2xl shadow-sm hover:border-indigo-200 transition-all">
                                <CardHeader className="p-4 pb-2 border-b bg-slate-50/50">
                                  <div className="flex justify-between items-center">
                                    <span className="font-black text-slate-800 text-sm">Room {room.roomNumber}</span>
                                    <span className={cn(
                                      "text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border",
                                      room.roomType === 'AC' ? "bg-cyan-50 border-cyan-100 text-cyan-700" : "bg-slate-100 border-slate-200 text-slate-600"
                                    )}>
                                      {room.roomType}
                                    </span>
                                  </div>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                  {room.beds.map((bed) => (
                                    <div key={bed.id} className={cn(
                                      "p-3 rounded-xl border flex flex-col justify-center gap-1.5 transition-all text-xs",
                                      bed.status === 'Occupied' 
                                        ? "bg-indigo-50/30 border-indigo-100 text-slate-700" 
                                        : bed.status === 'Maintenance'
                                          ? "bg-amber-50/30 border-amber-100 text-amber-700"
                                          : "bg-emerald-50/20 border-emerald-100/50 text-slate-600"
                                    )}>
                                      <div className="flex justify-between items-center font-bold">
                                        <span>{bed.bedIdentifier}</span>
                                        <span className={cn(
                                          "text-[9px] font-black uppercase",
                                          bed.status === 'Occupied' 
                                            ? "text-indigo-600" 
                                            : bed.status === 'Maintenance'
                                              ? "text-amber-600"
                                              : "text-emerald-600"
                                        )}>
                                          {bed.status}
                                        </span>
                                      </div>
                                      
                                      {bed.occupant ? (
                                        <div className="flex items-center justify-between gap-2 mt-1 bg-white p-2 rounded-lg border border-slate-100 shadow-sm w-full min-w-0">
                                          <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center font-black text-[10px] text-indigo-700 uppercase shrink-0">
                                              {bed.occupant.photoURL ? (
                                                <img src={bed.occupant.photoURL} alt="student" className="h-6 w-6 rounded-full object-cover"/>
                                              ) : (
                                                bed.occupant.firstName.substring(0,2)
                                              )}
                                            </div>
                                            <div className="flex flex-col truncate min-w-0">
                                              <span className="font-bold text-slate-800 truncate text-[11px]">{bed.occupant.firstName} {bed.occupant.lastName}</span>
                                              <span className="text-[9px] text-slate-400 uppercase tracking-tighter">ID: {bed.occupant.id.slice(0,8)}</span>
                                            </div>
                                          </div>
                                          {canManageBoarding && (
                                            <div className="flex items-center gap-1 shrink-0">
                                              <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                title="Transfer Student"
                                                className="h-6 w-6 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                                onClick={() => {
                                                  setTransferStudentId(bed.occupant!.id);
                                                  setTransferOpen(true);
                                                }}
                                              >
                                                <ArrowRightLeft size={12} />
                                              </Button>
                                              <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="icon" 
                                                title="Check-Out Student"
                                                className="h-6 w-6 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg shrink-0"
                                                onClick={() => handleCheckout(bed.occupant!.id, `${bed.occupant!.firstName} ${bed.occupant!.lastName}`)}
                                              >
                                                <LogOut size={12} />
                                              </Button>
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between mt-1 bg-slate-50/50 p-2 rounded-lg border border-dashed border-slate-200 w-full">
                                          <span className="text-[10px] italic text-slate-400">Empty</span>
                                          {canManageBoarding && bed.status === 'Available' && (
                                            <Button
                                              type="button"
                                              variant="ghost"
                                              size="sm"
                                              className="h-5 text-[9px] font-black text-emerald-600 hover:bg-emerald-50 rounded-md px-1.5 border border-emerald-100"
                                              onClick={() => {
                                                setSelectedBedId(bed.id);
                                                setAllocateOpen(true);
                                              }}
                                            >
                                              Check-In
                                            </Button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}

                {blocks.length === 0 && (
                  <div className="py-20 text-center border-2 border-dashed border-indigo-200 rounded-3xl bg-slate-50/50">
                    <Home className="h-12 w-12 text-indigo-300 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-slate-700">No Boarding Structures Found</h2>
                    <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                      No hostel blocks are configured yet. Refresh this page or use the initialization tools to set up hostel blocks.
                    </p>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* TAB: PARENT APPLICATIONS */}
        {activeTab === 'applications' && (
          <Card className="border-2 border-indigo-50 shadow-sm rounded-3xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <ClipboardCopy className="text-indigo-600" size={20} /> Boarding Applications Registry
                </CardTitle>
                <CardDescription className="font-semibold text-slate-500">
                  Review and manage student housing applications submitted by parents.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {loadingApplications ? (
                <div className="py-20 flex justify-center text-indigo-600">
                  <Loader2 className="animate-spin h-8 w-8" />
                </div>
              ) : applications.length === 0 ? (
                <div className="py-20 text-center text-slate-400 italic bg-white">No parent boarding applications found.</div>
              ) : (
                <div className="overflow-x-auto bg-white">
                  <table className="min-w-full divide-y divide-slate-100 text-sm">
                    <thead className="bg-slate-50 font-bold text-slate-600">
                      <tr>
                        <th className="px-6 py-3 text-left">Student</th>
                        <th className="px-6 py-3 text-left">Parent</th>
                        <th className="px-6 py-3 text-left">Request Details</th>
                        <th className="px-6 py-3 text-left">Submitted Date</th>
                        <th className="px-6 py-3 text-left">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-800">{app.studentName}</div>
                            <div className="text-[10px] text-slate-400">ID: {app.studentId?.slice(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-700">{app.parentName || 'Parent'}</div>
                            <div className="text-[10px] text-slate-400">ID: {app.parentId?.slice(0, 8)}...</div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <div className="text-slate-600 text-xs line-clamp-2" title={app.requestDetails}>
                              {app.requestDetails || 'No specific requests.'}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-xs">
                            {app.createdAt ? app.createdAt.toLocaleDateString() + ' ' + app.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                              app.status === 'Pending' ? "bg-amber-100 text-amber-800 font-extrabold" :
                              app.status === 'Approved' ? "bg-emerald-100 text-emerald-800 font-extrabold" :
                              "bg-rose-100 text-rose-800 font-extrabold"
                            )}>
                              {app.status}
                            </span>
                            {app.status === 'Rejected' && app.rejectionReason && (
                              <div className="text-[9px] text-rose-600 mt-1 max-w-[150px] truncate" title={app.rejectionReason}>
                                Reason: {app.rejectionReason}
                              </div>
                            )}
                            {app.status === 'Approved' && app.reviewedByName && (
                              <div className="text-[9px] text-emerald-600 mt-1">
                                By: {app.reviewedByName}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {app.status === 'Pending' && canManageBoarding ? (
                              <div className="flex justify-end gap-1.5">
                                <Button 
                                  size="sm" 
                                  onClick={() => {
                                    setAllocateFromApp(app);
                                    setSelectedStudentId(app.studentId);
                                    setAllocateOpen(true);
                                  }} 
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] h-8 rounded-lg"
                                >
                                  Approve & Allocate
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="destructive" 
                                  onClick={() => {
                                    setAppToReject(app);
                                    setRejectDialogOpen(true);
                                  }} 
                                  className="font-bold text-[11px] h-8 rounded-lg"
                                >
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400 italic">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* TAB 2: OUTINGS & LEAVES */}
        {activeTab === 'leaves' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Form Column */}
            <div className="space-y-6">
              {/* Apply Leave Card */}
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                <CardHeader className="bg-indigo-50/20">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="text-indigo-600" size={20} /> Request Leave / Outing
                  </CardTitle>
                  <CardDescription>Parents or Students submit leave requests.</CardDescription>
                </CardHeader>
                <form onSubmit={handleApplyLeave}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Select Student</Label>
                      <SearchableSelect
                        options={allStudents.map(s => ({
                          id: s.id,
                          name: `${s.firstName} ${s.lastName}`,
                          subtext: `Gender: ${s.gender}`
                        }))}
                        value={leaveForm.studentId}
                        onValueChange={(val) => setLeaveForm({ ...leaveForm, studentId: val })}
                        placeholder="Type to search/choose student..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Leave Type</Label>
                      <Select value={leaveForm.leaveType} onValueChange={(val: any) => setLeaveForm({ ...leaveForm, leaveType: val })}>
                        <SelectTrigger className="bg-white border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Day Outing">Day Outing</SelectItem>
                          <SelectItem value="Weekend Leave">Weekend Leave</SelectItem>
                          <SelectItem value="Vacation">Vacation</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Departure Date</Label>
                        <Input 
                          type="datetime-local" 
                          value={leaveForm.departureDate} 
                          onChange={(e) => setLeaveForm({ ...leaveForm, departureDate: e.target.value })} 
                          className="bg-white border-2" 
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expected Return</Label>
                        <Input 
                          type="datetime-local" 
                          value={leaveForm.expectedReturnDate} 
                          onChange={(e) => setLeaveForm({ ...leaveForm, expectedReturnDate: e.target.value })} 
                          className="bg-white border-2" 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Destination Details</Label>
                      <Input 
                        placeholder="Home Address or Outing Venue" 
                        value={leaveForm.destination} 
                        onChange={(e) => setLeaveForm({ ...leaveForm, destination: e.target.value })} 
                        className="bg-white border-2" 
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Textarea 
                        placeholder="Medical checkup, weekend holiday, emergency..." 
                        value={leaveForm.reason} 
                        onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })} 
                        className="bg-white border-2 h-20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Parent/Guardian Contact</Label>
                      <Input 
                        placeholder="Primary telephone number" 
                        value={leaveForm.parentContact} 
                        onChange={(e) => setLeaveForm({ ...leaveForm, parentContact: e.target.value })} 
                        className="bg-white border-2" 
                        required
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                    <Button type="submit" disabled={actionLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl">
                      {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Submit Request'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Security Gate Action Card */}
              {canManageSecurity && (
                <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                  <CardHeader className="bg-indigo-50/20">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <ShieldCheck className="text-indigo-600" size={20} /> Gate Security Actions
                    </CardTitle>
                    <CardDescription>Log student departures and returns using Gate Passes.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Gate Pass Token</Label>
                      <Input 
                        placeholder="e.g. GP-A1B2C3" 
                        value={gatePassToken} 
                        onChange={(e) => setGatePassToken(e.target.value.toUpperCase())}
                        className="bg-white border-2 font-mono text-center text-lg font-black tracking-widest text-indigo-700 border-indigo-100"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <Button 
                        onClick={() => handleGateAction('checkout')} 
                        disabled={gatePassLoading || !gatePassToken} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-10 rounded-xl"
                      >
                        {gatePassLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Check-Out (Exit)'}
                      </Button>
                      <Button 
                        onClick={() => handleGateAction('checkin')} 
                        disabled={gatePassLoading || !gatePassToken} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-10 rounded-xl"
                      >
                        {gatePassLoading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Check-In (Entry)'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Requests List Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Clock className="text-indigo-600" size={20} /> Outing & Leave Registry
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingLeaves ? (
                    <div className="py-20 flex justify-center text-indigo-600"><Loader2 className="animate-spin h-8 w-8" /></div>
                  ) : leaves.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 italic">No leave or outing records found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 font-bold text-slate-600">
                          <tr>
                            <th className="px-6 py-3 text-left">Student</th>
                            <th className="px-6 py-3 text-left">Type / Dates</th>
                            <th className="px-6 py-3 text-left">Token</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {leaves.map((leave) => (
                            <tr key={leave.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{leave.studentName}</div>
                                <div className="text-[10px] text-slate-400">Destination: {leave.destination}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-slate-600">{leave.leaveType}</div>
                                <div className="text-[10px] text-slate-400">
                                  Out: {leave.departureDate.toLocaleDateString()} &bull; In: {leave.expectedReturnDate.toLocaleDateString()}
                                </div>
                              </td>
                              <td className="px-6 py-4 font-mono font-black text-indigo-600 text-xs">
                                {leave.gatePassToken || '—'}
                              </td>
                              <td className="px-6 py-4">
                                <span className={cn(
                                  "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                  leave.status === 'Pending' ? "bg-amber-100 text-amber-800" :
                                  leave.status === 'Approved' ? "bg-blue-100 text-blue-800" :
                                  leave.status === 'CheckedOut' ? "bg-indigo-100 text-indigo-800 animate-pulse" :
                                  leave.status === 'Completed' ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                )}>
                                  {leave.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {leave.status === 'Pending' && canManageBoarding ? (
                                  <div className="flex justify-end gap-1.5">
                                    <Button 
                                      size="sm" 
                                      onClick={() => handleApproveLeave(leave.id, 'Approve')} 
                                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] h-8 rounded-lg"
                                    >
                                      Approve
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      variant="destructive" 
                                      onClick={() => handleApproveLeave(leave.id, 'Reject')} 
                                      className="font-bold text-[11px] h-8 rounded-lg"
                                    >
                                      Reject
                                    </Button>
                                  </div>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">No actions</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 3: VISITORS & ROLL CALL */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Visitors Entry Form */}
            <div className="space-y-6">
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                <CardHeader className="bg-indigo-50/20">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <UserPlus className="text-indigo-600" size={20} /> Log Campus Visitor
                  </CardTitle>
                  <CardDescription>Log checking in visitors at the school gate.</CardDescription>
                </CardHeader>
                <form onSubmit={handleVisitorCheckIn}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Visitor Full Name</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={visitorForm.visitorName} 
                        onChange={(e) => setVisitorForm({ ...visitorForm, visitorName: e.target.value })} 
                        className="bg-white border-2" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Number</Label>
                      <Input 
                        placeholder="+233..." 
                        value={visitorForm.contactNumber} 
                        onChange={(e) => setVisitorForm({ ...visitorForm, contactNumber: e.target.value })} 
                        className="bg-white border-2" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Relationship to Student</Label>
                      <Input 
                        placeholder="Father, Mother, Brother..." 
                        value={visitorForm.relationshipToStudent} 
                        onChange={(e) => setVisitorForm({ ...visitorForm, relationshipToStudent: e.target.value })} 
                        className="bg-white border-2" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Select Visited Student</Label>
                      <SearchableSelect
                        options={allStudents.map(s => ({
                          id: s.id,
                          name: `${s.firstName} ${s.lastName}`,
                          subtext: `ID: ${s.id}`
                        }))}
                        value={visitorForm.studentId}
                        onValueChange={(val) => setVisitorForm({ ...visitorForm, studentId: val })}
                        placeholder="Type to search/choose student..."
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                    <Button type="submit" disabled={actionLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 rounded-xl">
                      {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Log Check-In'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>

              {/* Night Roll-Call Submission Card */}
              {canManageBoarding && (
                <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                  <CardHeader className="bg-indigo-50/20">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <ListTodo className="text-indigo-600" size={20} /> Night Roll-Call Report
                    </CardTitle>
                    <CardDescription>Submit daily biometric or manual checklists.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleRollCallSubmit}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Roll Call Date</Label>
                        <Input 
                          type="date" 
                          value={rollCallDate} 
                          onChange={(e) => setRollCallDate(e.target.value)} 
                          className="bg-white border-2" 
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center mb-2">
                          <Label className="font-bold text-xs">Select Present Students</Label>
                          <Button 
                            type="button" 
                            variant="link" 
                            onClick={() => setPresentStudentIds(boardingStudents.map((s: any) => s.studentId))}
                            className="p-0 h-auto text-xs text-indigo-600 font-extrabold"
                          >
                            Mark All Present
                          </Button>
                        </div>
                        <div className="border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-slate-50/50">
                          {boardingStudents.map((allocation: any) => {
                            const isChecked = presentStudentIds.includes(allocation.studentId);
                            return (
                              <div key={allocation.id} className="flex items-center gap-2.5">
                                <Checkbox 
                                  checked={isChecked} 
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setPresentStudentIds([...presentStudentIds, allocation.studentId]);
                                    } else {
                                      setPresentStudentIds(presentStudentIds.filter(id => id !== allocation.studentId));
                                    }
                                  }}
                                />
                                <span className="text-xs font-bold text-slate-700">
                                  {allocation.studentName} ({allocation.roomNumber})
                                </span>
                              </div>
                            );
                          })}
                          {boardingStudents.length === 0 && (
                            <div className="text-center text-xs text-slate-400 italic py-6">No active hostel allocations.</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 font-semibold">{presentStudentIds.length} marked present</span>
                      <Button type="submit" disabled={rollCallLoading || boardingStudents.length === 0} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-5">
                        {rollCallLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Log Daily Report'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </div>

            {/* Roll Call Results & Visitor Log Queue */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Roll Call Result Notification */}
              {rollCallResult && (
                <Card className="border-2 border-rose-100 bg-rose-50/20 shadow-sm rounded-2xl overflow-hidden">
                  <CardHeader className="bg-rose-50/40 p-4">
                    <CardTitle className="text-sm font-black text-rose-800 flex items-center gap-2">
                      <ShieldAlert className="text-rose-600" size={16} /> Roll-Call Submitted: Flagged Exceptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-600">
                      <div className="bg-white border border-slate-100 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-400">UNACCOUNTED</div>
                        <div className="text-lg font-black text-rose-600">{rollCallResult.unaccountedCount}</div>
                      </div>
                      <div className="bg-white border border-slate-100 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-400">LEGAL LEAVE</div>
                        <div className="text-lg font-black text-indigo-600">{rollCallResult.legallyAbsentCount}</div>
                      </div>
                      <div className="bg-white border border-slate-100 p-2 rounded-xl">
                        <div className="text-[10px] text-slate-400">TOTAL ABSENT</div>
                        <div className="text-lg font-black text-slate-800">
                          {rollCallResult.unaccountedCount + rollCallResult.legallyAbsentCount}
                        </div>
                      </div>
                    </div>

                    {rollCallResult.unaccountedStudentIds && rollCallResult.unaccountedStudentIds.length > 0 && (
                      <div className="bg-white border border-rose-100 p-3 rounded-xl space-y-1.5">
                        <div className="text-xs font-black text-rose-800 flex items-center gap-1">
                          <AlertOctagon size={14} /> Critical: Unaccounted Boarders
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold list-disc pl-3">
                          {rollCallResult.unaccountedStudentIds.map((sid: string) => {
                            const name = allStudents.find(s => s.id === sid);
                            return <div key={sid}>&bull; {name ? `${name.firstName} ${name.lastName}` : `Student ID: ${sid.slice(0, 8)}`}</div>;
                          })}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Visitors Registry */}
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b">
                  <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                    <Users className="text-indigo-600" size={20} /> Visitor Registry Logs
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {loadingVisitors ? (
                    <div className="py-20 flex justify-center text-indigo-600"><Loader2 className="animate-spin h-8 w-8" /></div>
                  ) : visitors.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 italic">No visitor check-in logs found.</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 font-bold text-slate-600">
                          <tr>
                            <th className="px-6 py-3 text-left">Visitor Details</th>
                            <th className="px-6 py-3 text-left">Student Visited</th>
                            <th className="px-6 py-3 text-left">Check-In / Out</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {visitors.map((v) => (
                            <tr key={v.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="font-bold text-slate-800">{v.visitorName}</div>
                                <div className="text-[10px] text-slate-400">Contact: {v.contactNumber}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-bold text-indigo-700">{v.studentName}</div>
                                <div className="text-[10px] text-slate-400">Relation: {v.relationshipToStudent}</div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-xs text-slate-700 font-semibold flex items-center gap-1">
                                  <Clock size={12} className="text-slate-400" />
                                  In: {v.checkInTime.toLocaleTimeString()} ({v.checkInTime.toLocaleDateString()})
                                </div>
                                <div className="text-xs text-slate-500 font-semibold flex items-center gap-1 mt-1">
                                  <Clock size={12} className="text-slate-400" />
                                  Out: {v.checkOutTime ? `${v.checkOutTime.toLocaleTimeString()} (${v.checkOutTime.toLocaleDateString()})` : '—'}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                {!v.checkOutTime && canManageSecurity ? (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleVisitorCheckOut(v.id)} 
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] h-8 rounded-lg"
                                  >
                                    Log Out
                                  </Button>
                                ) : (
                                  <span className="text-xs text-slate-400 italic">Signed Out</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 4: MESS & DIET */}
        {activeTab === 'mess' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Daily dining attendance checklist & restricted headcounts */}
            <div className="space-y-6">
              
              {/* Dietary Prep Headcounts */}
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                <CardHeader className="bg-indigo-50/20">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Users className="text-indigo-600" size={20} /> Kitchen Headcounts
                  </CardTitle>
                  <CardDescription>Aggregated allergy and dietary restrictions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  {loadingDietary ? (
                    <div className="py-6 flex justify-center"><Loader2 className="animate-spin h-6 w-6 text-indigo-600" /></div>
                  ) : !dietaryProfile ? (
                    <div className="text-center text-xs text-slate-400 italic py-4">No headcounts aggregated.</div>
                  ) : (
                    <div className="space-y-4">
                      {/* Metric grids */}
                      <div className="grid grid-cols-2 gap-2 text-center text-xs font-bold">
                        <div className="bg-slate-50 border p-2 rounded-xl">
                          <div className="text-[10px] text-slate-400">VEGETARIAN</div>
                          <div className="text-lg font-black text-indigo-600">{dietaryProfile.headcounts.vegetarian || 0}</div>
                        </div>
                        <div className="bg-slate-50 border p-2 rounded-xl">
                          <div className="text-[10px] text-slate-400">ALLERGIES</div>
                          <div className="text-lg font-black text-rose-600">{dietaryProfile.headcounts.hasAllergies || 0}</div>
                        </div>
                      </div>

                      {/* Detail list */}
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-600">Students with Allergies/Restrictions</Label>
                        <div className="max-h-48 overflow-y-auto space-y-2 border rounded-xl p-3 bg-slate-50/50">
                          {dietaryProfile.studentsWithRestrictions?.map((s: any) => (
                            <div key={s.id} className="text-xs bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                              <div className="font-bold text-slate-800">{s.name} ({s.classId || 'Unassigned'})</div>
                              <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
                                Allergies: <span className="text-rose-600 underline font-extrabold">{s.allergies?.join(', ') || 'None'}</span>
                              </div>
                            </div>
                          ))}
                          {(!dietaryProfile.studentsWithRestrictions || dietaryProfile.studentsWithRestrictions.length === 0) && (
                            <div className="text-center text-[10px] text-slate-400 italic">No restrictive profiles found.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Dining Attendance Logger */}
              {canManageMess && (
                <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                  <CardHeader className="bg-indigo-50/20">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <UserCheck className="text-indigo-600" size={20} /> Log Meal Attendance
                    </CardTitle>
                    <CardDescription>Track daily entries to optimize inventory.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleDiningAttendance}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Meal Date</Label>
                          <Input 
                            type="date" 
                            value={diningAttendanceForm.date} 
                            onChange={(e) => setDiningAttendanceForm({ ...diningAttendanceForm, date: e.target.value })} 
                            className="bg-white border-2" 
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Meal Type</Label>
                          <Select 
                            value={diningAttendanceForm.mealType} 
                            onValueChange={(val: any) => setDiningAttendanceForm({ ...diningAttendanceForm, mealType: val })}
                          >
                            <SelectTrigger className="bg-white border-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Breakfast">Breakfast</SelectItem>
                              <SelectItem value="Lunch">Lunch</SelectItem>
                              <SelectItem value="Dinner">Dinner</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Select Student</Label>
                        <SearchableSelect
                          options={boardingStudents.map((s: any) => ({
                            id: s.studentId,
                            name: s.studentName,
                            subtext: `Room: ${s.roomNumber}`
                          }))}
                          value={diningAttendanceForm.studentId}
                          onValueChange={(val) => setDiningAttendanceForm({ ...diningAttendanceForm, studentId: val })}
                          placeholder="Type to search/choose student..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select 
                          value={diningAttendanceForm.status} 
                          onValueChange={(val: any) => setDiningAttendanceForm({ ...diningAttendanceForm, status: val })}
                        >
                          <SelectTrigger className="bg-white border-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Attended">Attended</SelectItem>
                            <SelectItem value="Missed">Missed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                      <Button type="submit" disabled={actionLoading || !diningAttendanceForm.studentId} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-5">
                        {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Log Dining Attendance'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </div>

            {/* Weekly menu calendar layout */}
            <div className="lg:col-span-2 space-y-6">
              
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Utensils className="text-indigo-600" size={20} /> Weekly Meal Schedule
                    </CardTitle>
                    <CardDescription>Current published menu starting {menuWeekStartDate}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label className="text-xs font-bold">Week Start:</Label>
                    <Input 
                      type="date" 
                      value={menuWeekStartDate} 
                      onChange={(e) => setMenuWeekStartDate(e.target.value)} 
                      className="bg-white border-2 h-8 w-36 text-xs" 
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingMenu ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Read Menu Schedule grid */}
                      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                        {Object.keys(menuForm).map((day) => {
                          const meals = menuForm[day] || { breakfast: '', lunch: '', dinner: '' };
                          return (
                            <div key={day} className="bg-slate-50 border rounded-xl p-3 flex flex-col gap-2.5 hover:border-indigo-100 hover:bg-indigo-50/10 transition-colors text-xs">
                              <h4 className="font-black text-xs text-indigo-900 border-b pb-1 uppercase">{day}</h4>
                              <div className="space-y-1.5 text-[11px] font-semibold">
                                <div>
                                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Breakfast</span>
                                  <span className="text-slate-700 italic block">{meals.breakfast || '—'}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Lunch</span>
                                  <span className="text-slate-700 italic block">{meals.lunch || '—'}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Dinner</span>
                                  <span className="text-slate-700 italic block">{meals.dinner || '—'}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Cook editor inputs (Mess manager role) */}
                      {canManageMess && (
                        <form onSubmit={handlePublishMenu} className="border-t pt-6 space-y-4">
                          <h3 className="font-black text-slate-800 text-sm flex items-center gap-1 uppercase italic tracking-tight">
                            <Plus size={16} /> Publish / Edit Weekly Menu Payload
                          </h3>
                          <div className="max-h-72 overflow-y-auto space-y-4 border rounded-2xl p-4 bg-slate-50/20">
                            {Object.keys(menuForm).map((day) => (
                              <div key={day} className="space-y-2 border-b pb-3 last:border-0 last:pb-0">
                                <Label className="font-extrabold text-xs text-indigo-700 uppercase">{day} Meals</Label>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <Input 
                                    placeholder="Breakfast details..." 
                                    value={menuForm[day]?.breakfast || ''} 
                                    onChange={(e) => setMenuForm({
                                      ...menuForm,
                                      [day]: { ...(menuForm[day] || { breakfast: '', lunch: '', dinner: '' }), breakfast: e.target.value }
                                    })}
                                    className="bg-white border-2 text-xs"
                                  />
                                  <Input 
                                    placeholder="Lunch details..." 
                                    value={menuForm[day]?.lunch || ''} 
                                    onChange={(e) => setMenuForm({
                                      ...menuForm,
                                      [day]: { ...(menuForm[day] || { breakfast: '', lunch: '', dinner: '' }), lunch: e.target.value }
                                    })}
                                    className="bg-white border-2 text-xs"
                                  />
                                  <Input 
                                    placeholder="Dinner details..." 
                                    value={menuForm[day]?.dinner || ''} 
                                    onChange={(e) => setMenuForm({
                                      ...menuForm,
                                      [day]: { ...(menuForm[day] || { breakfast: '', lunch: '', dinner: '' }), dinner: e.target.value }
                                    })}
                                    className="bg-white border-2 text-xs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={actionLoading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-6">
                              {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Publish Menu'}
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* TAB 5: SICK BAY (INFIRMARY) */}
        {activeTab === 'medical' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Infirmary Log Entry form */}
            <div className="space-y-6">
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                <CardHeader className="bg-indigo-50/20">
                  <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Heart className="text-rose-500 animate-pulse" size={20} /> Log Infirmary Visit
                  </CardTitle>
                  <CardDescription>Log active visit details inside the sick bay log registry.</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogVisit}>
                  <CardContent className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Select Student</Label>
                      <SearchableSelect
                        options={allStudents.map(s => ({
                          id: s.id,
                          name: `${s.firstName} ${s.lastName}`,
                          subtext: `ID: ${s.id}`
                        }))}
                        value={visitForm.studentId}
                        onValueChange={(val) => setVisitForm({ ...visitForm, studentId: val })}
                        placeholder="Type to search/choose student..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Reported Symptoms</Label>
                      <Textarea 
                        placeholder="Fever, cough, headache, physical injury..." 
                        value={visitForm.reportedSymptoms} 
                        onChange={(e) => setVisitForm({ ...visitForm, reportedSymptoms: e.target.value })} 
                        className="bg-white border-2 h-20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Administered Medication / Treatment</Label>
                      <Textarea 
                        placeholder="Paracetamol administered, icepack applied, rest..." 
                        value={visitForm.treatmentAdministered} 
                        onChange={(e) => setVisitForm({ ...visitForm, treatmentAdministered: e.target.value })} 
                        className="bg-white border-2 h-20"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Disposition</Label>
                      <Select 
                        value={visitForm.disposition} 
                        onValueChange={(val: any) => setVisitForm({ ...visitForm, disposition: val })}
                      >
                        <SelectTrigger className="bg-white border-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Returned to Dorm">Returned to Dorm</SelectItem>
                          <SelectItem value="Kept for Observation">Kept for Observation</SelectItem>
                          <SelectItem value="Transferred to Hospital">Transferred to Hospital</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-2.5 bg-rose-50/50 border border-rose-100 p-3 rounded-xl">
                      <Checkbox 
                        id="severeTriage"
                        checked={visitForm.isSevereTriage} 
                        onCheckedChange={(checked) => setVisitForm({ ...visitForm, isSevereTriage: !!checked })}
                      />
                      <Label htmlFor="severeTriage" className="font-extrabold text-rose-800 text-xs flex items-center gap-1 cursor-pointer select-none">
                        <AlertOctagon size={14} className="animate-pulse" /> Severe Triage Event (Instant Escalation Alert)
                      </Label>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                    <Button type="submit" disabled={actionLoading || !visitForm.studentId} className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-5">
                      {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Log Sick Bay Visit'}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </div>

            {/* Student medical profile search & historic logs */}
            <div className="lg:col-span-2 space-y-6">
              
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Search className="text-indigo-600" size={20} /> Medical Profile Lookup
                    </CardTitle>
                    <CardDescription>Retrieve blood groups, chronic conditions, and histories.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <SearchableSelect
                      options={allStudents.map(s => ({
                        id: s.id,
                        name: `${s.firstName} ${s.lastName}`,
                        subtext: `ID: ${s.id}`
                      }))}
                      value={selectedMedStudentId}
                      onValueChange={(val) => {
                        setSelectedMedStudentId(val);
                        handleFetchMedicalProfile(val);
                      }}
                      placeholder="Search/select student..."
                      className="w-48 text-xs"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingMedProfile ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                  ) : !medicalProfile ? (
                    <div className="py-20 text-center text-slate-400 italic">Select a student above to look up their medical profile.</div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Metric cards */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="bg-slate-50 border-slate-200">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-rose-100 rounded-lg text-rose-600"><Heart size={20}/></div>
                            <div>
                              <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Blood Group</p>
                              <p className="text-xl font-black text-slate-800">{medicalProfile.bloodGroup || 'Unknown'}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-slate-200">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg text-amber-600"><AlertOctagon size={20}/></div>
                            <div>
                              <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Allergies</p>
                              <p className="text-sm font-bold text-slate-800 truncate" title={medicalProfile.allergies}>{medicalProfile.allergies || 'None'}</p>
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="bg-slate-50 border-slate-200">
                          <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600"><AlertOctagon size={20}/></div>
                            <div>
                              <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Chronic Conditions</p>
                              <p className="text-sm font-bold text-slate-800 truncate" title={medicalProfile.chronicIllnesses}>{medicalProfile.chronicIllnesses || 'None'}</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {medicalProfile.healthNotes && medicalProfile.healthNotes !== 'None' && (
                        <Card className="bg-blue-50/50 border-blue-100">
                          <CardContent className="p-4 flex items-start gap-3 text-xs">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 shrink-0"><AlertOctagon size={16}/></div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Other Health Notes & Issues</p>
                              <p className="font-semibold text-slate-700 leading-relaxed">{medicalProfile.healthNotes}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Logs Feed */}
                      <div className="space-y-3">
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                          <ListTodo size={14} /> Historical Sick Bay Visits
                        </h4>
                        
                        <div className="space-y-3">
                          {medicalProfile.medicalLogs?.map((log: any) => (
                            <div 
                              key={log.id} 
                              className={cn(
                                "border p-4 rounded-2xl flex flex-col md:flex-row justify-between gap-4 transition-colors text-xs",
                                log.isSevereTriage ? "bg-rose-50/30 border-rose-200" : "bg-white border-slate-200"
                              )}
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-slate-800 text-sm">
                                    Symptoms: <span className="underline font-bold italic">"{log.reportedSymptoms}"</span>
                                  </span>
                                  {log.isSevereTriage && (
                                    <span className="bg-rose-100 text-rose-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase flex items-center gap-0.5">
                                      <AlertOctagon size={10} /> Severe
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs font-semibold text-slate-600">
                                  Treatment: <span className="italic">{log.treatmentAdministered}</span>
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  Dispatched status: <span className="font-extrabold text-indigo-600">{log.disposition}</span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-xs font-bold text-slate-700 flex items-center justify-end gap-1">
                                  <Clock size={12} className="text-slate-400" />
                                  {log.visitDate?.toDate 
                                    ? log.visitDate.toDate().toLocaleString() 
                                    : new Date(log.visitDate).toLocaleString()}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">Logged by: {log.treatingStaffName}</div>
                              </div>
                            </div>
                          ))}
                          {(!medicalProfile.medicalLogs || medicalProfile.medicalLogs.length === 0) && (
                            <div className="text-center py-10 text-xs text-slate-400 italic bg-slate-50/50 rounded-2xl border border-dashed">
                              No historic sick bay visit logs.
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Top-up and Debit Panels */}
            <div className="space-y-6">
              
              {/* Top-Up Simulator Card */}
              {canTopUpWallet && (
                <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                  <CardHeader className="bg-indigo-50/20">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Plus className="text-indigo-600" size={20} /> Parent Balance Top-Up
                    </CardTitle>
                    <CardDescription>Simulate credit transactions to a student digital wallet.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleTopUpSubmit}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Select Student</Label>
                        <SearchableSelect
                          options={allStudents.map(s => ({
                            id: s.id,
                            name: `${s.firstName} ${s.lastName}`,
                            subtext: `ID: ${s.id}`
                          }))}
                          value={selectedWalletStudentId}
                          onValueChange={(val) => {
                            setSelectedWalletStudentId(val);
                            fetchWalletStatement(val);
                          }}
                          placeholder="Type to search/choose student..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Top-Up Amount (GHS)</Label>
                        <Input 
                          placeholder="e.g. 50.00" 
                          type="number"
                          step="0.01"
                          value={topUpAmount} 
                          onChange={(e) => setTopUpAmount(e.target.value)} 
                          className="bg-white border-2" 
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Transaction Description</Label>
                        <Input 
                          placeholder="Parent Top-Up, Allowance check, etc." 
                          value={topUpDescription} 
                          onChange={(e) => setTopUpDescription(e.target.value)} 
                          className="bg-white border-2" 
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                      <Button type="submit" disabled={actionLoading || !selectedWalletStudentId} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-5">
                        {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Process Top-Up'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}

              {/* Tuck Shop debit processing (Visible to staff/admins) */}
              {canDebitWallet && (
                <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl">
                  <CardHeader className="bg-indigo-50/20">
                    <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <Utensils className="text-indigo-600" size={20} /> Tuck Shop / Cafeteria Debit
                    </CardTitle>
                    <CardDescription>Charge purchase items directly to student card.</CardDescription>
                  </CardHeader>
                  <form onSubmit={handleDebitSubmit}>
                    <CardContent className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label>Select Student</Label>
                        <SearchableSelect
                          options={allStudents.map(s => ({
                            id: s.id,
                            name: `${s.firstName} ${s.lastName}`,
                            subtext: `ID: ${s.id}`
                          }))}
                          value={selectedWalletStudentId}
                          onValueChange={(val) => {
                            setSelectedWalletStudentId(val);
                            fetchWalletStatement(val);
                          }}
                          placeholder="Type to search/choose student..."
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Purchase Cost (GHS)</Label>
                        <Input 
                          placeholder="e.g. 12.50" 
                          type="number"
                          step="0.01"
                          value={debitAmount} 
                          onChange={(e) => setDebitAmount(e.target.value)} 
                          className="bg-white border-2" 
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Purchase Description</Label>
                        <Input 
                          placeholder="Tuck Shop Snacks, Soda & Bread, Lunch item" 
                          value={debitDescription} 
                          onChange={(e) => setDebitDescription(e.target.value)} 
                          className="bg-white border-2" 
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter className="bg-slate-50/50 border-t p-4 flex justify-end">
                      <Button type="submit" disabled={actionLoading || !selectedWalletStudentId} className="bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl px-5">
                        {actionLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Log Purchase'}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              )}
            </div>

            {/* Wallet Balance & Statement histories */}
            <div className="lg:col-span-2 space-y-6">
              
              <Card className="border-2 border-indigo-50 shadow-sm rounded-2xl overflow-hidden">
                <CardHeader className="bg-slate-50 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <CardTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Search className="text-indigo-600" size={20} /> Wallet Account Registry
                    </CardTitle>
                    <CardDescription>Statement feeds for student spending tracking.</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <SearchableSelect
                      options={allStudents.map(s => ({
                        id: s.id,
                        name: `${s.firstName} ${s.lastName}`,
                        subtext: `ID: ${s.id}`
                      }))}
                      value={selectedWalletStudentId}
                      onValueChange={(val) => {
                        setSelectedWalletStudentId(val);
                        fetchWalletStatement(val);
                      }}
                      placeholder="Search/select student..."
                      className="w-48 text-xs"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {loadingWallet ? (
                    <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600" /></div>
                  ) : !walletInfo ? (
                    <div className="py-20 text-center text-slate-400 italic">Select a student above to view balance and transaction statements.</div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Balance Metric card */}
                      <div className="grid grid-cols-1 gap-4">
                        <Card className="bg-indigo-50/40 border-indigo-100">
                          <CardContent className="p-5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><Home size={24}/></div>
                              <div>
                                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Available Account Balance</p>
                                <p className="text-3xl font-black text-indigo-900 mt-1">GHS {walletInfo.balance.toFixed(2)}</p>
                              </div>
                            </div>
                            <div className="bg-white px-3 py-1.5 rounded-xl border border-indigo-100 text-xs font-black text-indigo-600 animate-pulse uppercase">
                              Active Wallet
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Statement Table */}
                      <div className="space-y-3">
                        <h4 className="font-black text-slate-800 text-xs uppercase tracking-wider flex items-center gap-1">
                          <ListTodo size={14} /> Transaction History
                        </h4>
                        
                        <div className="overflow-x-auto border rounded-2xl bg-white shadow-sm">
                          <table className="min-w-full divide-y divide-slate-100 text-xs">
                            <thead className="bg-slate-50 font-bold text-slate-600">
                              <tr>
                                <th className="px-4 py-3 text-left">Reference</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Recorded By</th>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-right">Amount</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                              {walletInfo.transactions?.map((t: any) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="px-4 py-3 font-mono text-[10px] text-slate-400 font-black">{t.reference}</td>
                                  <td className="px-4 py-3">{t.description}</td>
                                  <td className="px-4 py-3 text-slate-500">{t.recordedByName}</td>
                                  <td className="px-4 py-3 text-slate-400">
                                    {t.timestamp?.toDate 
                                      ? t.timestamp.toDate().toLocaleString() 
                                      : new Date(t.timestamp).toLocaleString()}
                                  </td>
                                  <td className={cn(
                                    "px-4 py-3 text-right font-bold text-sm",
                                    t.type === 'Credit' ? "text-emerald-600" : "text-rose-600"
                                  )}>
                                    {t.type === 'Credit' ? '+' : ''}{t.amount.toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                              {(!walletInfo.transactions || walletInfo.transactions.length === 0) && (
                                <tr>
                                  <td colSpan={5} className="text-center py-10 text-xs text-slate-400 italic bg-slate-50/30">
                                    No transaction records found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
