'use server';
/**
 * School shop orders paid online: the order is only marked PAID after the server has checked the payment
 * with Paystack (using the school's own secret key). Before, the parent's browser wrote "PAID" itself —
 * and the Mobile Money option marked orders paid without any payment at all.
 */
import { getAdminAuth, getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { getSchoolSecrets } from '@/lib/school-secrets';

export async function verifyShopOrderPayment(orderId: string, idToken?: string): Promise<{ success: boolean; paid?: boolean; error?: string }> {
    try {
        if (!orderId || !idToken) throw new Error('Not signed in.');
        const caller = await getAdminAuth().verifyIdToken(idToken);
        const db = getAdminDb();
        const orderRef = db.collection('school_shop_orders').doc(orderId);
        const orderSnap = await orderRef.get();
        if (!orderSnap.exists) throw new Error('Order not found.');
        const order: any = orderSnap.data();
        if (order.parentId !== caller.uid) throw new Error('This is not your order.');
        if (order.paymentStatus === 'PAID') return { success: true, paid: true };
        const reference = String(order.paystackReference || '').trim();
        if (!reference) throw new Error('No online payment reference on this order.');

        const secret = (await getSchoolSecrets(db as any, order.schoolId)).paystackSecKey;
        if (!secret) throw new Error('Online payments are not set up for this school.');

        const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: { Authorization: `Bearer ${secret}` },
            cache: 'no-store',
        });
        const body: any = await res.json().catch(() => ({}));
        const tx = body?.data;
        const expected = Math.round(Number(order.totalAmount || 0) * 100);
        const ok = res.ok && body?.status === true && tx?.status === 'success'
            && String(tx?.currency || 'GHS').toUpperCase() === 'GHS'
            && Number(tx?.amount || 0) >= expected
            && (!tx?.metadata?.schoolId || tx.metadata.schoolId === order.schoolId);
        if (!ok) {
            await orderRef.update({ paymentStatus: 'VERIFYING', verifyNote: 'Payment not confirmed by Paystack yet.', verifyCheckedAt: FieldValue.serverTimestamp() });
            return { success: true, paid: false };
        }

        // One payment pays one order (a reference cannot be reused for a second order).
        const usedRef = db.collection('paystackEvents').doc(`shop_${reference.replace(/[^A-Za-z0-9_-]/g, '')}`);
        const paid = await db.runTransaction(async (t) => {
            const used = await t.get(usedRef);
            if (used.exists && used.data()?.orderId !== orderId) return false;
            const fresh = await t.get(orderRef);
            if (fresh.data()?.paymentStatus === 'PAID') return true;
            t.set(usedRef, { orderId, schoolId: order.schoolId, amount: Number(tx.amount) / 100, at: FieldValue.serverTimestamp() });
            t.update(orderRef, { paymentStatus: 'PAID', paidVerifiedAt: FieldValue.serverTimestamp(), paidAmount: Number(tx.amount) / 100 });
            // Stock leaves the shelf only for a confirmed payment.
            (Array.isArray(order.items) ? order.items : []).forEach((it: any) => {
                if (it?.itemId && Number(it.quantity) > 0) {
                    t.update(db.collection('school_shop_items').doc(String(it.itemId)), { stock: FieldValue.increment(-Number(it.quantity)) });
                }
            });
            return true;
        });
        if (!paid) throw new Error('This payment was already used for another order.');
        return { success: true, paid: true };
    } catch (e: any) {
        return { success: false, error: e?.message || 'Could not verify the payment.' };
    }
}
