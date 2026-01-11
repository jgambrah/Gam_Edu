
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/firebase/config';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY is missing');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // 1. Verify the request is actually from Paystack (Security)
    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(body))
      .digest('hex');

    const signature = req.headers.get('x-paystack-signature');

    if (hash !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // 2. Handle the event
    const event = body.event;
    const data = body.data;

    if (event === 'charge.success') {
      const metadata = data.metadata;

      // PROTECT THE CEO ACCOUNT
      if (metadata?.userId === 'gZxe3nMbGcQhNgEzkwEZwDBnkFR2') {
        console.log("CEO account action detected. No changes will be made.");
        return NextResponse.json({ status: 'success', message: 'CEO account cannot be modified by webhook.' }, { status: 200 });
      }
      
      // SCENARIO 1: SCHOOL UPGRADE
      if (metadata?.type === 'school_upgrade' && metadata?.schoolId) {
        console.log(`🏫 Upgrading School: ${metadata.schoolId}`);
        const schoolRef = doc(db, 'schools', metadata.schoolId);
        
        await updateDoc(schoolRef, {
          plan: 'Premium',
          status: 'active',
          trialEndsAt: null, // Remove trial limit
          lastPaymentDate: serverTimestamp(),
          paymentReference: data.reference
        });
      } 
      
      // SCENARIO 2: INDIVIDUAL USER UPGRADE (Legacy/Fallback)
      else if (metadata?.userId) {
         const userRef = doc(db, 'users', metadata.userId);
         await updateDoc(userRef, { isPremium: true });
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
