
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, CheckCircle2, ArrowRight, RefreshCw, Upload, FileSpreadsheet, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { autoReconcileFlow } from '@/ai/flows/reconciliation-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// --- TYPES ---
type BankTx = { 
    id: string; 
    date: string; // Stored as ISO string or timestamp in DB
    description: string; 
    amount: number; 
    status?: 'Pending' | 'Reconciled' 
};

type InternalTx = { 
    id: string; 
    date: string; 
    description: string; // or 'category' or 'title'
    amount: number; 
};

type MatchSuggestion = { 
    bankTransactionId: string; 
    internalTransactionId: string; 
    confidence: 'High' | 'Medium' | 'Low'; 
    reasoning: string 
};

// --- COMPONENT: CSV UPLOADER ---
function ImportDialog({ type, onUploadComplete }: { type: 'Bank' | 'Cashbook', onUploadComplete: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !firestore) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const csvData = event.target?.result as string;
                const lines = csvData.split('\n');
                const batch = writeBatch(firestore);
                const collectionName = type === 'Bank' ? 'bank_transactions' : 'financialRecords';
                
                let count = 0;

                // Skip Header Row (index 0) and loop
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;

                    // ASSUMING CSV FORMAT: Date, Description, Amount
                    // Example: 2024-03-01, Amazon Purchase, 120.50
                    const [dateStr, desc, amtStr] = line.split(',');

                    if (dateStr && desc && amtStr) {
                        const newDocRef = doc(collection(firestore, collectionName));
                        // Clean data
                        const cleanAmount = parseFloat(amtStr.replace(/[^0-9.-]+/g, ""));
                        const cleanDate = new Date(dateStr); // Try parse

                        if (!isNaN(cleanAmount)) {
                            batch.set(newDocRef, {
                                date: cleanDate, // Store as Timestamp object in DB
                                description: desc.replace(/"/g, ''), // Remove quotes
                                amount: cleanAmount,
                                status: 'Pending',
                                uploadedAt: serverTimestamp(),
                                source: 'CSV Import'
                            });
                            count++;
                        }
                    }
                }

                await batch.commit();
                toast({ title: "Import Successful", description: `Imported ${count} records into ${type}.` });
                onUploadComplete();
                
            } catch (error: any) {
                console.error("CSV Error:", error);
                toast({ variant: "destructive", title: "Import Failed", description: "Check CSV format (Date, Description, Amount)" });
            } finally {
                setIsUploading(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };

        reader.readAsText(file);
    };

    return (
        <div className="space-y-4 pt-4">
            <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
                <FileSpreadsheet className="h-10 w-10 text-slate-400 mb-2" />
                <p className="text-sm font-medium text-slate-900">Upload {type} CSV</p>
                <p className="text-xs text-slate-500 mb-4">Format: Date, Description, Amount</p>
                
                <input 
                    type="file" 
                    accept=".csv" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />
                
                <Button 
                    onClick={() => fileInputRef.current?.click()} 
                    disabled={isUploading} 
                    variant="outline"
                >
                    {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Upload className="mr-2 h-4 w-4"/>}
                    {isUploading ? "Processing..." : "Select File"}
                </Button>
            </div>
            
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
                <strong>Tip:</strong> Create a CSV file in Excel/Sheets with 3 columns:
                <br/><code>2024-01-25, Walmart Store, 45.99</code>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function ReconciliationPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState<BankTx[]>([]);
  const [ledgerData, setLedgerData] = useState<InternalTx[]>([]);
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  const [view, setView] = useState<'bank' | 'cashbook'>('bank'); // For import dialog

  // 1. FETCH DATA
  const fetchLiveData = async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
        // A. Bank Transactions (Only Pending)
        const bankRef = collection(firestore, 'bank_transactions');
        const qBank = query(bankRef, where('status', '==', 'Pending')); // Only fetch unreconciled
        const bankSnap = await getDocs(qBank);
        
        const realBankData = bankSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                description: data.description || 'Unknown',
                amount: Number(data.amount) || 0,
                // Handle Firestore Timestamp or String date
                date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : (data.date || 'N/A'),
                status: data.status
            };
        }) as BankTx[];

        // B. Financial Records (Cashbook)
        // Usually we fetch records created by the Finance Module
        const ledgerRef = collection(firestore, 'financialRecords');
        const qLedger = query(ledgerRef, orderBy('date', 'desc'), where('status', '!=', 'Reconciled')); // Optimization
        // Note: For this to work perfectly, you need an index on financialRecords (status + date). 
        // If index error, remove the 'where' clause temporarily.
        const ledgerSnap = await getDocs(ledgerRef);
        
        const realLedgerData = ledgerSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                description: data.description || data.title || 'Unknown Record',
                amount: Number(data.amount) || 0,
                date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : (data.date || 'N/A'),
            };
        }) as InternalTx[];

        setBankData(realBankData);
        setLedgerData(realLedgerData);

    } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({ variant: 'destructive', title: "Error", description: "Could not load data. Check indexes." });
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => { fetchLiveData(); }, [firestore]);

  // 2. AI RECONCILE
  const handleAutoReconcile = async () => {
    if (bankData.length === 0) return;
    setIsLoading(true);
    setSuggestions([]);

    try {
        const result = await autoReconcileFlow(bankData, ledgerData);
        
        if (result.success && result.data) {
            setSuggestions(result.data.matches as MatchSuggestion[]);
            toast({ title: "Analysis Complete", description: `AI found ${result.data.matches.length} potential matches.` });
        } else {
             // If AI returns no matches or error, show toast
             if(result.error) toast({ variant: 'destructive', title: "AI Error", description: result.error });
             else toast({ title: "No Matches", description: "AI couldn't find any obvious matches." });
        }
    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "AI Service unavailable." });
    } finally {
        setIsLoading(false);
    }
  };

  // 3. CONFIRM MATCH
  const confirmMatch = async (match: MatchSuggestion) => {
    if (!firestore) return;
    try {
        const batch = writeBatch(firestore);
        
        // Update Bank Tx
        const bankRef = doc(firestore, 'bank_transactions', match.bankTransactionId);
        batch.update(bankRef, { 
            status: 'Reconciled', 
            matchedLedgerId: match.internalTransactionId,
            reconciledAt: serverTimestamp() 
        });

        // Optional: Update Ledger Record too
        // const ledgerRef = doc(firestore, 'financialRecords', match.internalTransactionId);
        // batch.update(ledgerRef, { status: 'Reconciled' });
        
        await batch.commit();

        setSuggestions(prev => prev.filter(s => s.bankTransactionId !== match.bankTransactionId));
        setBankData(prev => prev.filter(b => b.id !== match.bankTransactionId));
        toast({ title: "Reconciled", description: "Match confirmed." });

    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "Database update failed." });
    }
  };

  return (
    <div className="space-y-6">
        {/* HEADER ACTIONS */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Smart Reconciliation</h1>
                <p className="text-muted-foreground">Match bank statements with internal cashbook.</p>
            </div>
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Import Data</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Import Records</DialogTitle>
                            <DialogDescription>Upload CSV files to populate the system.</DialogDescription>
                        </DialogHeader>
                        <Tabs defaultValue="bank" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="bank">Bank Statement</TabsTrigger>
                                <TabsTrigger value="cashbook">Legacy Cashbook</TabsTrigger>
                            </TabsList>
                            <TabsContent value="bank">
                                <ImportDialog type="Bank" onUploadComplete={() => { fetchLiveData(); }} />
                            </TabsContent>
                            <TabsContent value="cashbook">
                                <ImportDialog type="Cashbook" onUploadComplete={() => { fetchLiveData(); }} />
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={fetchLiveData} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                    Refresh
                </Button>
                
                <Button onClick={handleAutoReconcile} disabled={isLoading || bankData.length === 0} className="bg-purple-600 hover:bg-purple-700">
                    <Wand2 className="mr-2 h-4 w-4" /> 
                    {isLoading ? "Analyzing..." : "Auto-Reconcile"}
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
            {/* LEFT: Unmatched Transactions */}
            <Card className="h-[600px] flex flex-col">
                <CardHeader className="pb-2">
                    <CardTitle>Unreconciled Bank Lines</CardTitle>
                    <CardDescription>{bankData.length} items pending</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {bankData.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground border-2 border-dashed rounded-lg">
                            <FileSpreadsheet className="h-8 w-8 mx-auto mb-2 opacity-50"/>
                            <p>No transactions found.</p>
                            <p className="text-xs mt-1">Click "Import Data" to upload a statement.</p>
                        </div>
                    ) : (
                     bankData.map(tx => (
                        <div key={tx.id} className="p-3 border rounded-lg flex justify-between items-center text-sm hover:bg-slate-50 transition-colors">
                            <div>
                                <p className="font-semibold text-slate-800">{tx.description}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                            <div className="text-right">
                                <span className={`font-mono font-bold block ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    ${tx.amount.toFixed(2)}
                                </span>
                                <Badge variant="outline" className="text-[10px] scale-90 origin-right">Pending</Badge>
                            </div>
                        </div>
                    )))}
                </CardContent>
            </Card>

            {/* RIGHT: AI Suggestions */}
            <Card className="h-[600px] flex flex-col border-l-4 border-l-purple-500 bg-slate-50/50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-purple-600" /> AI Suggestions
                    </CardTitle>
                    <CardDescription>Review and confirm matches</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {suggestions.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            {isLoading ? "AI is processing..." : "Click 'Auto-Reconcile' to start."}
                        </div>
                    ) : (
                        suggestions.map((match, i) => {
                            const bank = bankData.find(b => b.id === match.bankTransactionId);
                            const ledger = ledgerData.find(l => l.id === match.internalTransactionId);
                            if (!bank || !ledger) return null;

                            return (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 space-y-3 animate-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex justify-between items-center">
                                        <Badge variant={match.confidence === 'High' ? 'default' : 'secondary'} className={match.confidence === 'High' ? 'bg-green-600' : 'bg-yellow-600'}>
                                            {match.confidence} Match
                                        </Badge>
                                        <Button size="sm" onClick={() => confirmMatch(match)} className="h-8 bg-indigo-600 hover:bg-indigo-700 text-white">
                                            <CheckCircle2 className="mr-1 h-4 w-4" /> Confirm
                                        </Button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm gap-2">
                                        <div className="flex-1 p-2 bg-slate-50 rounded border border-slate-100">
                                            <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Bank Statement</p>
                                            <p className="font-bold text-slate-700 truncate" title={bank.description}>{bank.description}</p>
                                            <p className="text-xs text-slate-500">{bank.date} • ${bank.amount}</p>
                                        </div>
                                        <ArrowRight className="text-indigo-300 h-4 w-4" />
                                        <div className="flex-1 p-2 bg-indigo-50 rounded border border-indigo-100">
                                            <p className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Internal Ledger</p>
                                            <p className="font-bold text-indigo-900 truncate" title={ledger.description}>{ledger.description}</p>
                                            <p className="text-xs text-indigo-600">{ledger.date} • ${ledger.amount}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded italic">
                                        "{match.reasoning}"
                                    </div>
                                </div>
                            );
                        })
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  );
}

    