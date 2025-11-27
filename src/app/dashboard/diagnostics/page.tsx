
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore } from "@/firebase";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";

export default function DiagnosticTest() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [logs, setLogs] = useState<{ step: string; status: "success" | "error" | "pending"; msg: string }[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (step: string, status: "success" | "error" | "pending", msg: string) => {
    setLogs((prev) => [...prev, { step, status, msg }]);
  };

  const runDiagnostics = async () => {
    setLogs([]);
    setIsRunning(true);

    if (isUserLoading || !firestore || !user) {
      addLog("Initialization", "error", "Firestore or User not loaded. Refresh page.");
      setIsRunning(false);
      return;
    }

    // STEP 1: CHECK AUTH
    addLog("1. Authentication", "success", `Logged in as UID: ${user.uid}`);
    addLog("1. Authentication", "success", `Email: ${user.email}`);

    // STEP 2: CHECK STAFF DOCUMENT
    // This checks if the user exists in the database and has the right role
    try {
      addLog("2. Staff Profile", "pending", "Reading 'staff' collection...");
      const staffRef = doc(firestore, "staff", user.uid);
      const staffSnap = await getDoc(staffRef);

      if (staffSnap.exists()) {
        const data = staffSnap.data();
        addLog("2. Staff Profile", "success", `Document found! Role field: "${data.role}"`);
        
        if (data.role === "Director" || data.role === "Administrator") {
             addLog("2. Staff Profile", "success", "Role is valid for Admin access.");
        } else {
             addLog("2. Staff Profile", "error", `Role "${data.role}" does not grant Admin access.`);
        }
      } else {
        addLog("2. Staff Profile", "error", "CRITICAL: Staff document does not exist for this UID.");
        addLog("2. Staff Profile", "error", "Fix: Go to Firestore > staff > Add Document > ID: " + user.uid);
      }
    } catch (e: any) {
      addLog("2. Staff Profile", "error", `Permission Denied reading own profile: ${e.message}`);
    }

    // STEP 3: CHECK LEARNING MATERIALS
    try {
      addLog("3. Learning Materials", "pending", "Attempting to list collection...");
      const querySnapshot = await getDocs(collection(firestore, "learning_materials"));
      addLog("3. Learning Materials", "success", `Access Granted! Found ${querySnapshot.size} items.`);
    } catch (e: any) {
      addLog("3. Learning Materials", "error", `Access Denied: ${e.message}`);
      if (e.message.includes("insufficient permissions")) {
          addLog("3. Learning Materials", "error", "The Rule is blocking this request.");
      }
    }

    setIsRunning(false);
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10 border-2 border-blue-200">
      <CardHeader>
        <CardTitle>System Diagnostics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-slate-100 rounded-md min-h-[200px] space-y-2 font-mono text-sm">
          {logs.length === 0 && <p className="text-muted-foreground">Click button to start...</p>}
          {logs.map((log, i) => (
            <div key={i} className="flex items-start gap-2">
              {log.status === "success" && <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />}
              {log.status === "error" && <XCircle className="h-4 w-4 text-red-600 mt-0.5" />}
              {log.status === "pending" && <Loader2 className="h-4 w-4 animate-spin text-blue-600 mt-0.5" />}
              <span className={log.status === "error" ? "text-red-700 font-bold" : "text-slate-800"}>
                {log.step}: {log.msg}
              </span>
            </div>
          ))}
        </div>
        <Button onClick={runDiagnostics} disabled={isRunning || isUserLoading} className="w-full">
          {isRunning || isUserLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertCircle className="mr-2 h-4 w-4" />}
          Run Permission Test
        </Button>
      </CardContent>
    </Card>
  );
}
