import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { db } from '@/firebase/config'; // <--- UPDATED THIS LINE
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
      console.log('Payment successful for:', data.customer.email);

      // EXTRACT USER ID from metadata
      const userId = data.metadata?.userId;

      if (userId) {
        // 3. Update Firestore to give the user access
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
          isPremium: true,
          subscriptionStatus: 'active',
          lastPaymentDate: serverTimestamp(),
          paymentReference: data.reference
        });
        console.log(`User ${userId} upgraded to Premium.`);
      } else {
        console.warn('No userId found in payment metadata');
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}