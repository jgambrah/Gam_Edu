
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Input Schemas from lib/types
import type { FinancialRecord } from '@/lib/types';
export type BankTx = { id: string; date: string; description: string; amount: number };
export type InternalTx = FinancialRecord;

// Output Schema (Structured JSON)
const ReconciliationSchema = z.object({
  matches: z.array(z.object({
    bankTransactionId: z.string(),
    internalTransactionId: z.string(),
    confidence: z.enum(['High', 'Medium', 'Low']),
    reasoning: z.string()
  })),
  unmatchedBankIds: z.array(z.string())
});

export async function autoReconcileFlow(bankLines: BankTx[], ledgerLines: InternalTx[]) {
  try {
    // We strictly verify the inputs aren't empty
    if (bankLines.length === 0 || ledgerLines.length === 0) {
        return { success: false, error: "No data to compare." };
    }

    const prompt = `
      You are an Expert Accountant AI. Your job is to reconcile Bank Transactions with Internal Ledger Entries.

      TASK:
      Match the [BANK TRANSACTIONS] to the corresponding [INTERNAL ENTRIES].

      RULES FOR MATCHING:
      1. **Amount:** Must be exactly the same or extremely close (within 0.01 difference).
      2. **Date:** Transaction dates might differ by 1-5 days (bank clearing delay).
      3. **Description:** Use fuzzy logic. 
         - Example: "AMZN Mktp" matches "Amazon Office Supplies".
         - Example: "Check #101" matches "Payment to Vendor X (Ref 101)".
      
      OUTPUT:
      Return a JSON object classifying matches by confidence:
      - HIGH: Exact amount, close date, clear description match.
      - MEDIUM: Amount matches, but description is vague or date is far apart.
      - LOW: Amount matches, but nothing else does.

      DATA:
      [BANK TRANSACTIONS]:
      ${JSON.stringify(bankLines)}

      [INTERNAL ENTRIES]:
      ${JSON.stringify(ledgerLines.map(l => ({ id: l.id, date: l.createdAt, description: l.description, amount: l.billedAmount })))}
    `;

    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: prompt,
      output: {
        schema: ReconciliationSchema,
        format: "json"
      }
    });

    return { success: true, data: output };

  } catch (error: any) {
    console.error("Reconciliation Error:", error);
    return { success: false, error: error.message };
  }
}
