
'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, getDocs, writeBatch, doc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wand2, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { autoReconcileFlow } from '@/ai/flows/reconciliation-flow';

// --- TYPES ---
type BankTx = { id: string; date: string; description: string; amount: number; status: 'Pending' | 'Matched' };
type InternalTx = { id: string; date: string; description: string; amount: number };
type MatchSuggestion = { bankTransactionId: string; internalTransactionId: string; confidence: 'High' | 'Medium' | 'Low'; reasoning: string };

export default function ReconciliationPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [bankData, setBankData] = useState<BankTx[]>([]);
  const [ledgerData, setLedgerData] = useState<InternalTx[]>([]);
  const [suggestions, setSuggestions] = useState<MatchSuggestion[]>([]);

  // 1. SIMULATE LOADING DATA (In production, you'd fetch from Firestore 'bank_feeds' and 'expenses')
  const loadMockData = async () => {
    setIsLoading(true);
    // Simulating fetching data...
    setTimeout(() => {
        setBankData([
            { id: 'b1', date: '2024-03-01', description: 'AWS EMEA SERVICE', amount: 120.50, status: 'Pending' },
            { id: 'b2', date: '2024-03-03', description: 'Deposit - School Fees', amount: 5000.00, status: 'Pending' },
            { id: 'b3', date: '2024-03-05', description: 'STAPLES #9928', amount: 45.99, status: 'Pending' },
            { id: 'b4', date: '2024-03-06', description: 'UNKNOWN TRANSFER', amount: 200.00, status: 'Pending' },
        ]);
        setLedgerData([
            { id: 'i1', date: '2024-02-28', description: 'Amazon Web Services - Feb', amount: 120.50 }, // Match (Date diff)
            { id: 'i2', date: '2024-03-03', description: 'Fees: John Doe', amount: 5000.00 }, // Match (Exact)
            { id: 'i3', date: '2024-03-05', description: 'Office Supplies', amount: 45.99 }, // Match (Fuzzy)
            { id: 'i4', date: '2024-03-10', description: 'Bus Fuel', amount: 200.00 }, // Possible false positive (Date diff)
        ]);
        setIsLoading(false);
    }, 1000);
  };

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
            toast({ variant: 'destructive', title: "Error", description: result.error || "AI failed to process." });
        }
    } catch (e) {
        console.error(e);
        toast({ variant: 'destructive', title: "Error", description: "Connection failed." });
    } finally {
        setIsLoading(false);
    }
  };

  // 3. CONFIRM MATCH (Save to DB)
  const confirmMatch = async (match: MatchSuggestion) => {
    if (!firestore) return;
    
    try {
        const batch = writeBatch(firestore);
        
        // Mark Bank Tx as Reconciled
        // Note: In a real app, these documents would exist in Firestore. 
        // For this demo, we just update local state.
        
        // Mock DB Update:
        // const bankRef = doc(firestore, 'bank_transactions', match.bankTransactionId);
        // batch.update(bankRef, { status: 'Reconciled', matchedWith: match.internalTransactionId });
        
        // await batch.commit();

        // Update UI
        setSuggestions(prev => prev.filter(s => s.bankTransactionId !== match.bankTransactionId));
        setBankData(prev => prev.filter(b => b.id !== match.bankTransactionId));
        
        toast({ title: "Reconciled", description: "Transaction matched successfully." });

    } catch (e) {
        toast({ variant: 'destructive', title: "Error", description: "Could not save match." });
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
                <Button variant="outline" onClick={loadMockData} disabled={isLoading || bankData.length > 0}>
                    {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : null}
                    Load Data (Demo)
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
                <CardContent className="space-y-2">
                    {bankData.length === 0 ? <p className="text-sm text-muted-foreground">No pending transactions.</p> : 
                     bankData.map(tx => (
                        <div key={tx.id} className="p-3 border rounded-lg flex justify-between items-center text-sm">
                            <div>
                                <p className="font-bold">{tx.description}</p>
                                <p className="text-xs text-muted-foreground">{tx.date}</p>
                            </div>
                            <span className="font-mono font-bold">${tx.amount.toFixed(2)}</span>
                        </div>
                    ))}
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
                <CardContent className="space-y-4">
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
                                            <p className="text-xs text-slate-500">{bank.date} • ${bank.amount}</p>
                                        </div>
                                        <ArrowRight className="mx-2 text-slate-300" />
                                        <div className="flex-1 p-2 bg-indigo-50 rounded border border-indigo-100">
                                            <p className="font-bold text-indigo-900">{ledger.description}</p>
                                            <p className="text-xs text-indigo-600">{ledger.date} • ${ledger.amount}</p>
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

    