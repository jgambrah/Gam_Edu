
'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, CheckCircle2, ArrowRight, RefreshCw, Upload, FileSpreadsheet, Link2, MousePointerClick } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { autoReconcileFlow } from '@/ai/flows/reconciliation-flow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useCurrentSchool } from '@/hooks/use-current-school'; // SAAS Import

// --- TYPES ---
type BankTx = { 
    id: string; 
    date: string; 
    description: string; 
    amount: number; 
    status?: 'Pending' | 'Reconciled' 
};

type InternalTx = { 
    id: string; 
    date: string; 
    description: string; 
    amount: number; 
};

type MatchSuggestion = { 
    bankTransactionId: string; 
    internalTransactionId: string; 
    confidence: 'High' | 'Medium' | 'Low'; 
    reasoning: string 
};

// --- IMPORT COMPONENT ---
function ImportDialog({ type, onUploadComplete }: { type: 'Bank' | 'Cashbook', onUploadComplete: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const { schoolId } = useCurrentSchool();
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !firestore || !schoolId) return;

        setIsUploading(true);
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const csvData = event.target?.result as string;
                const lines = csvData.split('\n');
                const batch = writeBatch(firestore);
                const collectionName = type === 'Bank' ? 'bank_transactions' : 'financialRecords';
                let count = 0;

                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    const [dateStr, desc, amtStr] = line.split(',');

                    if (dateStr && desc && amtStr) {
                        const newDocRef = doc(collection(firestore, collectionName));
                        const cleanAmount = parseFloat(amtStr.replace(/[^0-9.-]+/g, ""));
                        const cleanDate = new Date(dateStr); 

                        if (!isNaN(cleanAmount)) {
                            batch.set(newDocRef, {
                                date: cleanDate, 
                                description: desc.replace(/"/g, ''),
                                amount: cleanAmount,
                                status: 'Pending',
                                uploadedAt: serverTimestamp(),
                                source: 'CSV Import',
                                schoolId: schoolId, // SAAS Stamp
                            });
                            count++;
                        }
                    }
                }
                await batch.commit();
                toast({ title: "Import Successful", description: `Imported ${count} records.` });
                onUploadComplete();
            } catch (error: any) {
                toast({ variant: "destructive", title: "Import Failed", description: "Check CSV format." });
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
                <input type="file" accept=".csv" className="hidden" ref={fileInputRef} onChange={handleFileUpload}/>
                <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} variant="outline" className="mt-2">
                    {isUploading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Upload className="mr-2 h-4 w-4"/>}
                    {isUploading ? "Processing..." : "Select File"}
                </Button>
            </div>
        </div>
    );
}

// --- MAIN PAGE ---
export default function ReconciliationPage() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const { schoolId } = useCurrentSchool();

  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState<BankTx[]>([]);
  const [ledgerData, setLedgerData] = useState<InternalTx[]>([]);
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);
  
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [selectedLedgerId, setSelectedLedgerId] = useState<string | null>(null);

  // 1. FETCH DATA (School-Aware)
  const fetchLiveData = useCallback(async () => {
    if (!firestore || !schoolId) return;
    setIsLoading(true);
    try {
        const bankRef = collection(firestore, 'bank_transactions');
        const qBank = query(bankRef, where('schoolId', '==', schoolId), where('status', '==', 'Pending'));
        const bankSnap = await getDocs(qBank);
        const realBankData = bankSnap.docs.map(doc => { /*...*/ }) as BankTx[];

        const ledgerRef = collection(firestore, 'financialRecords');
        const qLedger = query(ledgerRef, where('schoolId', '==', schoolId), orderBy('date', 'desc'));
        const ledgerSnap = await getDocs(qLedger);
        const realLedgerData = ledgerSnap.docs.map(doc => { /*...*/ }) as InternalTx[];

        setBankData(realBankData);
        setLedgerData(realLedgerData);
        setSuggestions([]);

    } catch (error: any) {
        toast({ variant: 'destructive', title: "Error", description: "Could not load data." });
    } finally {
        setIsLoading(false);
    }
  }, [firestore, schoolId, toast]);

  useEffect(() => { fetchLiveData(); }, [fetchLiveData]);

  // 2. AI RECONCILE (School-Aware)
  const handleAutoReconcile = async () => {
    if (bankData.length === 0 || !schoolId) return;
    setIsLoading(true);
    setSuggestions([]);

    try {
        // Pass schoolId to the flow
        const result = await autoReconcileFlow(bankData, ledgerData, schoolId);
        if (result.success && result.data) {
            setSuggestions(result.data.matches as MatchSuggestion[]);
            toast({ title: "Analysis Complete", description: `AI found ${result.data.matches.length} potential matches.` });
        } else {
             toast({ variant: 'destructive', title: "AI Error", description: result.error });
        }
    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "AI Service unavailable." });
    } finally {
        setIsLoading(false);
    }
  };

  // 3. HANDLE MATCH (Unchanged, already references specific IDs)
  const executeMatch = async (bankId: string, ledgerId: string, isManual = false) => {
    // ... same logic ...
  };

  return (
    <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Reconciliation</h1>
                <p className="text-muted-foreground">Match bank statements with internal cashbook.</p>
            </div>
            <div className="flex gap-2">
                <Dialog>
                    <DialogTrigger asChild><Button variant="outline"><Upload className="mr-2 h-4 w-4"/> Import Data</Button></DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Import Records</DialogTitle><DialogDescription>Upload CSV files.</DialogDescription></DialogHeader>
                        <Tabs defaultValue="bank" className="w-full">
                            <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="bank">Bank Statement</TabsTrigger><TabsTrigger value="cashbook">Legacy Cashbook</TabsTrigger></TabsList>
                            <TabsContent value="bank"><ImportDialog type="Bank" onUploadComplete={fetchLiveData} /></TabsContent>
                            <TabsContent value="cashbook"><ImportDialog type="Cashbook" onUploadComplete={fetchLiveData} /></TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>

                <Button variant="outline" onClick={fetchLiveData} disabled={isLoading}><RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/> Refresh</Button>
                <Button onClick={handleAutoReconcile} disabled={isLoading || bankData.length === 0} className="bg-purple-600 hover:bg-purple-700"><Wand2 className="mr-2 h-4 w-4" /> AI Match (-25 Credits)</Button>
            </div>
        </div>

        {/* Manual Matching Bar */}
        {selectedBankId && selectedLedgerId && (
            <div className="bg-indigo-600 text-white p-4 rounded-lg flex justify-between items-center animate-in slide-in-from-top-2 shadow-lg">
                <div className="flex items-center gap-2">
                    <Link2 className="h-5 w-5" />
                    <span className="font-semibold">Link selected items?</span>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => { setSelectedBankId(null); setSelectedLedgerId(null); }}>Cancel</Button>
                    <Button 
                        variant="default" 
                        size="sm" 
                        className="bg-green-500 hover:bg-green-600 text-white border-0"
                        onClick={() => executeMatch(selectedBankId, selectedLedgerId, true)}
                    >
                        Confirm Match
                    </Button>
                </div>
            </div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
            
            {/* Unmatched Bank Transactions */}
            <Card className="h-[600px] flex flex-col border-t-4 border-t-slate-500">
                <CardHeader className="pb-2 bg-slate-50">
                    <CardTitle className="text-sm uppercase tracking-wide text-slate-500 flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4"/> Bank Statement ({bankData.length})
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto space-y-2 p-2">
                    {bankData.map(tx => (
                        <div 
                            key={tx.id} 
                            onClick={() => setSelectedBankId(selectedBankId === tx.id ? null : tx.id)}
                            className={cn(
                                "p-3 border rounded-lg flex justify-between items-center text-sm cursor-pointer transition-all",
                                selectedBankId === tx.id 
                                    ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md" 
                                    : "hover:bg-slate-50 hover:border-slate-300"
                            )}
                        >
                            <div>
                                <p className="font-semibold text-slate-800">{tx.description}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                            <span className={`font-mono font-bold ${tx.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                GH₵{tx.amount.toFixed(2)}
                            </span>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Internal Ledger OR AI Suggestions */}
            <Tabs defaultValue="suggestions" className="h-[600px] flex flex-col">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                    <TabsTrigger value="suggestions"><Wand2 className="w-4 h-4 mr-2"/> AI Suggestions</TabsTrigger>
                    <TabsTrigger value="ledger"><Link2 className="w-4 h-4 mr-2"/> Manual Match</TabsTrigger>
                </TabsList>

                {/* AI VIEW */}
                <TabsContent value="suggestions" className="flex-1 overflow-hidden">
                    <Card className="h-full flex flex-col border-l-4 border-l-purple-500 bg-slate-50/30">
                        <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
                            {suggestions.length === 0 ? (
                                <div className="text-center py-20 text-muted-foreground">
                                    {isLoading ? "Thinking..." : "No suggestions yet. Try 'Manual Match' tab."}
                                </div>
                            ) : (
                                suggestions.map((match, i) => {
                                    const bank = bankData.find(b => b.id === match.bankTransactionId);
                                    const ledger = ledgerData.find(l => l.id === match.internalTransactionId);
                                    if (!bank || !ledger) return null;

                                    return (
                                        <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-indigo-100 space-y-3">
                                            <div className="flex justify-between items-center">
                                                <Badge variant={match.confidence === 'High' ? 'default' : 'secondary'} className={match.confidence === 'High' ? 'bg-green-600' : 'bg-yellow-600'}>
                                                    {match.confidence} Match
                                                </Badge>
                                                <Button size="sm" onClick={() => executeMatch(match.bankTransactionId, match.internalTransactionId)}>
                                                    <CheckCircle2 className="mr-1 h-4 w-4" /> Accept
                                                </Button>
                                            </div>
                                            <div className="flex justify-between text-xs gap-2">
                                                <div className="flex-1 bg-slate-50 p-2 rounded"><p className="font-bold">{bank.description}</p><p>GH₵{bank.amount}</p></div>
                                                <div className="flex-1 bg-indigo-50 p-2 rounded"><p className="font-bold">{ledger.description}</p><p>GH₵{ledger.amount}</p></div>
                                            </div>
                                            <p className="text-xs text-slate-400 italic">"{match.reasoning}"</p>
                                        </div>
                                    );
                                })
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* MANUAL LEDGER VIEW */}
                <TabsContent value="ledger" className="flex-1 overflow-hidden">
                    <Card className="h-full flex flex-col border-t-4 border-t-indigo-500">
                        <CardHeader className="pb-2 bg-slate-50">
                            <CardTitle className="text-sm uppercase tracking-wide text-slate-500 flex items-center gap-2">
                                <MousePointerClick className="h-4 w-4"/> Internal Ledger
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-y-auto space-y-2 p-2">
                            {ledgerData.map(tx => (
                                <div 
                                    key={tx.id} 
                                    onClick={() => setSelectedLedgerId(selectedLedgerId === tx.id ? null : tx.id)}
                                    className={cn(
                                        "p-3 border rounded-lg flex justify-between items-center text-sm cursor-pointer transition-all",
                                        selectedLedgerId === tx.id 
                                            ? "bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500 shadow-md" 
                                            : "hover:bg-slate-50 hover:border-slate-300"
                                    )}
                                >
                                    <div>
                                        <p className="font-semibold text-slate-800">{tx.description}</p>
                                        <p className="text-xs text-muted-foreground">{tx.date}</p>
                                    </div>
                                    <span className="font-mono font-bold text-slate-700">GH₵{tx.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    </div>
  );
}
