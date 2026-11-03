'use client';

import React, { useMemo, useState } from 'react';
import { doc, getDoc, runTransaction, serverTimestamp, type Firestore } from 'firebase/firestore';
import { PlusCircle, Loader2 } from 'lucide-react';
import { useFirestore, useMemoFirebase, useDoc, useUser } from '@/firebase';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  BUILT_IN_FEE_TYPES,
  CUSTOM_FEE_ITEMS_MAX,
  CUSTOM_FEE_NAME_MAX,
  FEE_CATEGORIES,
  customFeeBillFields,
  isFeeCategory,
  normalizeFeeName,
  parseCustomFeeItems,
  validateCustomFeeName,
  type CustomFeeItem,
  type FeeCategory,
} from '@/lib/custom-fee-items';

/** Where a school's custom fee items are stored (finance staff of the school may write it — see firestore.rules). */
const catalogRef = (firestore: Firestore, schoolId: string) => doc(firestore, 'schoolSettings', schoolId, 'billing', 'customFeeItems');

const ADD_VALUE = '__add_custom_fee_item__';

const CATEGORY_HELP: Record<FeeCategory, string> = {
  Tuition: 'Counted with tuition / school fees',
  Canteen: 'Counted with canteen',
  Transport: 'Counted with transport',
  'PTA Levy': 'Counted with PTA levies',
  Other: 'Counted under Other (recommended if unsure)',
};

/** The school's custom fee items (live). */
export function useCustomFeeItems(schoolId?: string | null) {
  const firestore = useFirestore();
  const ref = useMemoFirebase(() => (firestore && schoolId ? catalogRef(firestore, schoolId) : null), [firestore, schoolId]);
  const { data, isLoading } = useDoc<any>(ref);
  const items = useMemo(() => parseCustomFeeItems(data), [data]);
  return { items, isLoading };
}

/**
 * Fields to save on a bill for `type`. Built-in types → {} (bill unchanged). A custom item → its mapping,
 * read from the database so it is right even if the list on screen had not finished loading.
 * Returns null when `type` is neither built-in nor an existing custom item (e.g. it was just removed).
 */
export async function resolveCustomFeeFields(firestore: Firestore, schoolId: string, type: string): Promise<Record<string, any> | null> {
  if (BUILT_IN_FEE_TYPES.some(t => t.toLowerCase() === normalizeFeeName(type).toLowerCase())) return {};
  const snap = await getDoc(catalogRef(firestore, schoolId));
  const items = parseCustomFeeItems(snap.exists() ? snap.data() : null);
  const fields = customFeeBillFields(type, items);
  return Object.keys(fields).length ? fields : null;
}

interface FeeTypeSelectProps {
  value: string;
  onChange: (type: string) => void;
  schoolId?: string | null;
  /** The built-in options this form already offered (kept exactly as they were). */
  builtIn: readonly string[];
  placeholder?: string;
  /** Hide "Add custom fee item…" (e.g. for read-only views). Default true. */
  allowAdd?: boolean;
}

export function FeeTypeSelect({ value, onChange, schoolId, builtIn, placeholder = 'Select fee type', allowAdd = true }: FeeTypeSelectProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const { items } = useCustomFeeItems(schoolId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<FeeCategory>('Other');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A bill being edited may already hold a value that is not in either list (older bill, or an item since
  // removed) — keep it selectable so the dropdown never shows blank or silently changes it.
  const known = useMemo(() => new Set<string>([...builtIn, ...items.map(i => i.name)]), [builtIn, items]);
  const orphan = value && !known.has(value) ? value : null;

  const canAdd = allowAdd && !!firestore && !!schoolId;

  const openAdd = () => { setName(''); setCategory('Other'); setError(null); setDialogOpen(true); };

  const handleChange = (v: string) => {
    // Let the dropdown finish closing before the dialog opens, so the two overlays never fight over focus
    // (which can leave the page unclickable).
    if (v === ADD_VALUE) { setTimeout(openAdd, 50); return; }
    onChange(v);
  };

  const save = async () => {
    if (!firestore || !schoolId || saving) return;
    const clean = normalizeFeeName(name);
    const problem = validateCustomFeeName(clean, items);
    if (problem) { setError(problem); return; }
    setSaving(true);
    setError(null);
    try {
      const ref = catalogRef(firestore, schoolId);
      const created: CustomFeeItem = {
        id: `cfi_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
        name: clean,
        category: isFeeCategory(category) ? category : 'Other',
        createdAt: Date.now(),
        createdBy: user?.uid || '',
      };
      // Re-check against the latest saved list inside a transaction, so two staff adding at the same moment
      // can never create a duplicate or overwrite each other's item.
      await runTransaction(firestore, async (tx) => {
        const snap = await tx.get(ref);
        const rawItems: any[] = snap.exists() && Array.isArray(snap.data()?.items) ? snap.data()!.items : [];
        const latest = parseCustomFeeItems(snap.exists() ? snap.data() : null);
        const again = validateCustomFeeName(clean, latest);
        if (again) throw new Error(again);
        if (rawItems.length >= CUSTOM_FEE_ITEMS_MAX) throw new Error(`Your school can have up to ${CUSTOM_FEE_ITEMS_MAX} custom fee items.`);
        tx.set(ref, { items: [...rawItems, created], updatedAt: serverTimestamp() }, { merge: true });
      });
      toast({ title: 'Fee item added', description: `"${clean}" is now in the Fee Type list for your school.` });
      setDialogOpen(false);
      onChange(clean); // select it straight away
    } catch (e: any) {
      const msg = e?.code === 'permission-denied'
        ? 'Only finance staff can add fee items.'
        : (e?.message || 'Could not save the fee item. Please try again.');
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Select onValueChange={handleChange} value={value || undefined}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          {builtIn.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          {orphan && <SelectItem key={`orphan-${orphan}`} value={orphan}>{orphan}</SelectItem>}
          {items.length > 0 && (
            <>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Your school&apos;s fee items</SelectLabel>
                {items.map(i => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}
              </SelectGroup>
            </>
          )}
          {canAdd && (
            <>
              <SelectSeparator />
              <SelectItem value={ADD_VALUE} className="font-semibold text-indigo-600">
                <span className="inline-flex items-center gap-2"><PlusCircle className="h-4 w-4" />Add custom fee item…</span>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>

      <Dialog open={dialogOpen} onOpenChange={(o) => { if (!saving) setDialogOpen(o); }}>
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Add custom fee item</DialogTitle>
            <DialogDescription>
              For a fee that is not in the list. It is saved for your whole school, appears in student ledgers under this name,
              and is counted in reports under the fee type you choose.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="custom-fee-name">Fee item name</Label>
              <Input
                id="custom-fee-name"
                autoFocus
                value={name}
                maxLength={CUSTOM_FEE_NAME_MAX}
                placeholder="e.g. Graduation Gown, Excursion, Club Dues"
                onChange={(e) => { setName(e.target.value); setError(null); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void save(); } }}
              />
            </div>
            <div className="space-y-2">
              <Label>Counts as</Label>
              <Select value={category} onValueChange={(v) => setCategory(isFeeCategory(v) ? v : 'Other')}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FEE_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c} — {CATEGORY_HELP[c]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm font-medium text-destructive" role="alert">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button type="button" onClick={() => void save()} disabled={saving || normalizeFeeName(name).length < 2}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}Add fee item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
