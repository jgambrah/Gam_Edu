
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore } from '@/firebase'; 
import { collection, getDocs } from 'firebase/firestore'; 
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StaffPageDiagnostic() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useAuth();
  
  const [logs, setLogs] = useState<string[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);

  const runDiagnosticFetch = async () => {
    if (!user || !firestore) {
        addLog("❌ Cannot fetch: User or Firestore missing.");
        return;
    }

    setIsLoading(true);
    setStaffList([]);
    addLog(`🚀 Starting Fetch... (UID: ${user.uid})`);
    
    try {
        // 1. Try lowercase 'staff'
        addLog("Attempting to fetch collection: 'staff'...");
        const snapLower = await getDocs(collection(firestore, 'staff'));
        
        if (!snapLower.empty) {
            addLog(`✅ SUCCESS: Found ${snapLower.size} documents in 'staff'.`);
            const data = snapLower.docs.map(d => ({ id: d.id, ...d.data(), _source: 'staff' }));
            setStaffList(data);
            setIsLoading(false);
            return;
        } else {
            addLog("⚠️ Collection 'staff' is empty or missing.");
        }

        // 2. Try Uppercase 'Staff' (Common mistake)
        addLog("Attempting to fetch collection: 'Staff' (Capitalized)...");
        const snapUpper = await getDocs(collection(firestore, 'Staff'));
        
        if (!snapUpper.empty) {
            addLog(`✅ SUCCESS: Found ${snapUpper.size} documents in 'Staff'.`);
            const data = snapUpper.docs.map(d => ({ id: d.id, ...d.data(), _source: 'Staff' }));
            setStaffList(data);
        } else {
            addLog("⚠️ Collection 'Staff' is also empty.");
            addLog("❌ CONCLUSION: No data found in either collection name.");
        }

    } catch (e: any) {
        addLog(`❌ ERROR: ${e.message}`);
        if (e.code === 'permission-denied') {
            addLog("👉 This is a PERMISSION issue. Check Rules.");
        }
    } finally {
        setIsLoading(false);
    }
  };

  // Run once on load if user is ready
  useEffect(() => {
      if (user && firestore && !isLoading) {
          runDiagnosticFetch();
      }
  }, [user, firestore]);

  if (isUserLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin"/> Loading Auth...</div>;

  return (
    <div className="space-y-6 p-6">
      
      {/* 1. ENVIRONMENT CHECK */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader><CardTitle className="text-red-800 flex items-center gap-2"><AlertCircle/> Debug Info</CardTitle></CardHeader>
        <CardContent className="font-mono text-xs space-y-2">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <span className="font-bold">User Email:</span> {user?.email || "NOT LOGGED IN"}
                </div>
                <div>
                    <span className="font-bold">User UID:</span> {user?.uid || "N/A"}
                </div>
                <div>
                    <span className="font-bold">Project ID:</span> {firestore?.app.options.projectId || "Unknown"}
                </div>
                <div>
                    <span className="font-bold">Firestore Instance:</span> {firestore ? "Active" : "Null"}
                </div>
            </div>
            <Button onClick={runDiagnosticFetch} size="sm" className="mt-4 w-full bg-red-600 hover:bg-red-700">
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                Force Re-Fetch
            </Button>
        </CardContent>
      </Card>

      {/* 2. LOGS */}
      <Card className="bg-slate-900 text-green-400 font-mono text-xs">
        <CardContent className="p-4 h-40 overflow-y-auto">
            {logs.map((log, i) => <div key={i}>{log}</div>)}
            {logs.length === 0 && <div>Waiting for logs...</div>}
        </CardContent>
      </Card>

      {/* 3. RESULTS TABLE */}
      <Card>
        <CardHeader><CardTitle>Raw Data Results</CardTitle></CardHeader>
        <CardContent>
            {staffList.length > 0 ? (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>First Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Source</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {staffList.map((s) => (
                                <TableRow key={s.id}>
                                    <TableCell className="font-mono text-xs">{s.id}</TableCell>
                                    <TableCell>{s.firstName || <span className="text-red-400">Missing</span>}</TableCell>
                                    <TableCell>{s.lastName || <span className="text-red-400">Missing</span>}</TableCell>
                                    <TableCell><Badge>{s.role || "None"}</Badge></TableCell>
                                    <TableCell>{s._source}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            ) : (
                <div className="text-center py-10 text-muted-foreground">
                    No data found yet. Check the red debug box above.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for Badge
function Badge({ children }: { children: React.ReactNode }) {
    return <span className="px-2 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-medium">{children}</span>;
}
