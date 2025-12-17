
'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { autoReconcileFlow } from '@/ai/flows/reconciliation-flow';

// --- TYPES ---
// Updated to match your likely Firestore structure
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
    type?: 'Income' | 'Expense'
};

type MatchSuggestion = { 
    bankTransactionId: string; 
    internalTransactionId: string; 
    confidence: 'High' | 'Medium' | 'Low'; 
    reasoning: string 
};

export default function ReconciliationPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState<BankTx[]>([]);
  const [ledgerData, setLedgerData] = useState<InternalTx[]>([]);
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);

  // 1. FETCH REAL DATA FROM FIREBASE
  const fetchLiveData = async () => {
    if (!firestore) return;
    setIsLoading(true);
    try {
        // A. Fetch Bank Transactions
        // In a real app, you might upload a CSV to populate this collection first
        const bankRef = collection(firestore, 'bank_transactions');
        // Optional: Filter only 'Pending' if you have a status field
        // const qBank = query(bankRef, where('status', '==', 'Pending')); 
        const bankSnap = await getDocs(bankRef);
        
        const realBankData = bankSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                description: data.description || data.memo || 'Unknown Transaction',
                amount: Number(data.amount) || 0,
                date: data.date?.toDate ? data.date.toDate().toISOString().split('T')[0] : (data.date || 'N/A'),
                status: data.status || 'Pending'
            };
        }) as BankTx[];

        // B. Fetch Internal Financial Records (Ledger)
        const ledgerRef = collection(firestore, 'financialRecords');
        const ledgerSnap = await getDocs(ledgerRef);
        
        const realLedgerData = ledgerSnap.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                description: data.description || data.title || 'Unknown Record',
                amount: Number(data.billedAmount) || 0,
                date: data.createdAt?.toDate ? data.createdAt.toDate().toISOString().split('T')[0] : (data.date || 'N/A'),
            };
        }) as InternalTx[];

        setBankData(realBankData);
        setLedgerData(realLedgerData);

        if (realBankData.length === 0) {
            toast({ description: "No bank transactions found. Upload a statement first." });
        } else {
            toast({ title: "Data Loaded", description: `Found ${realBankData.length} bank transactions.` });
        }

    } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({ variant: 'destructive', title: "Error", description: error.message });
    } finally {
        setIsLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
      fetchLiveData();
  }, [firestore]);

  // 2. TRIGGER AI RECONCILIATION
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
            // Handle specific AI errors
            if (result.error?.includes("No data")) {
                 toast({ variant: 'default', title: "Info", description: "Not enough data to compare." });
            } else {
                 toast({ variant: 'destructive', title: "AI Error", description: "Could not generate matches." });
            }
        }
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Connection Error", description: "Please check your internet." });
    } finally {
        setIsLoading(false);
    }
  };

  // 3. CONFIRM MATCH (Save to DB)
  const confirmMatch = async (match: MatchSuggestion) => {
    if (!firestore) return;
    
    try {
        const batch = writeBatch(firestore);
        
        // Update the Bank Transaction status to 'Reconciled'
        const bankRef = doc(firestore, 'bank_transactions', match.bankTransactionId);
        batch.update(bankRef, { 
            status: 'Reconciled', 
            matchedLedgerId: match.internalTransactionId,
            reconciledAt: serverTimestamp() 
        });
        
        await batch.commit();

        // Remove from UI immediately
        setSuggestions(prev => prev.filter(s => s.bankTransactionId !== match.bankTransactionId));
        setBankData(prev => prev.filter(b => b.id !== match.bankTransactionId));
        
        toast({ title: "Reconciled", description: "Transaction matched successfully." });

    } catch (e: any) {
        console.error(e);
        toast({ variant: 'destructive', title: "Error", description: "Could not update database." });
    }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Smart Reconciliation</h1>
                <p className="text-muted-foreground">Match bank statements with internal records using AI.</p>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={fetchLiveData} disabled={isLoading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}/>
                    Refresh Data
                </Button>
                <Button onClick={handleAutoReconcile} disabled={isLoading || bankData.length === 0} className="bg-purple-600 hover:bg-purple-700">
                    <Wand2 className="mr-2 h-4 w-4" /> 
                    {isLoading ? "Analyzing..." : "Auto-Reconcile"}
                </Button>
            </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
            {/* LEFT: Unmatched Transactions */}
            <Card>
                <CardHeader><CardTitle>Unreconciled Bank Lines ({bankData.length})</CardTitle></CardHeader>
                <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                    {bankData.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                            <p>No transactions found.</p>
                            <p className="text-xs mt-1">Please populate the 'bank_transactions' collection.</p>
                        </div>
                    ) : (
                     bankData.map(tx => (
                        <div key={tx.id} className="p-3 border rounded-lg flex justify-between items-center text-sm hover:bg-slate-50">
                            <div>
                                <p className="font-bold">{tx.description}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                            <div className="text-right">
                                <span className="font-mono font-bold block">GH₵{tx.amount.toFixed(2)}</span>
                                <Badge variant="outline" className="text-[10px]">{tx.status || 'Pending'}</Badge>
                            </div>
                        </div>
                    )))}
                </CardContent>
            </Card>

            {/* RIGHT: AI Suggestions */}
            <Card className="border-l-4 border-l-purple-500 bg-slate-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-purple-600" /> AI Suggestions
                    </CardTitle>
                    <CardDescription>Review and confirm the matches below.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                    {suggestions.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            {isLoading ? "AI is comparing records..." : "Click 'Auto-Reconcile' to generate matches."}
                        </div>
                    ) : (
                        suggestions.map((match, i) => {
                            const bank = bankData.find(b => b.id === match.bankTransactionId);
                            const ledger = ledgerData.find(l => l.id === match.internalTransactionId);
                            if (!bank || !ledger) return null;

                            return (
                                <div key={i} className="bg-white p-4 rounded-lg shadow-sm border space-y-3">
                                    <div className="flex justify-between items-center">
                                        <Badge variant={match.confidence === 'High' ? 'default' : 'secondary'} className={match.confidence === 'High' ? 'bg-green-600' : 'bg-yellow-600'}>
                                            {match.confidence} Confidence
                                        </Badge>
                                        <Button size="sm" onClick={() => confirmMatch(match)} className="h-8">
                                            <CheckCircle2 className="mr-1 h-4 w-4" /> Confirm
                                        </Button>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex-1 p-2 bg-slate-50 rounded">
                                            <p className="font-bold text-slate-700">{bank.description}</p>
                                            <p className="text-xs text-slate-500">{bank.date} • GH₵{bank.amount.toFixed(2)}</p>
                                        </div>
                                        <ArrowRight className="mx-2 text-slate-300" />
                                        <div className="flex-1 p-2 bg-indigo-50 rounded border border-indigo-100">
                                            <p className="font-bold text-indigo-900">{ledger.description}</p>
                                            <p className="text-xs text-indigo-600">{ledger.date} • GH₵{ledger.amount.toFixed(2)}</p>
                                        </div>
                                    </div>
                                    
                                    <p className="text-xs text-slate-500 italic border-t pt-2">
                                        🤖 AI Reasoning: {match.reasoning}
                                    </p>
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
