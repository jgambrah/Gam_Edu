import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// 1. Initialize Admin SDK (Bypasses Security Rules)
function getAdminApp() {
  const existingApp = getApps().find(app => app.name === 'admin');
  if (existingApp) return existingApp;

  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  return initializeApp({ credential: cert(serviceAccount) }, 'admin');
}

export async function POST(req: NextRequest) {
  try {
    // Read the raw body for signature verification
    const text = await req.text();
    
    if (!text) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      console.error('PAYSTACK_SECRET_KEY is missing');
      return NextResponse.json({ error: 'Server config error' }, { status: 500 });
    }

    // Verify Paystack Signature
    const hash = crypto.createHmac('sha512', secret).update(text).digest('hex');
    const signature = req.headers.get('x-paystack-signature');

    if (hash !== signature) {
      console.error('Invalid Paystack Signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Parse the JSON body safely
    let body;
    try {
        body = JSON.parse(text);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const event = body.event;
    const data = body.data;

    // 2. Handle Successful Payment
    if (event === 'charge.success') {
      const metadata = data.metadata;
      console.log('Payment Success Metadata:', metadata);

      const adminApp = getAdminApp();
      const db = getFirestore(adminApp);

      // SCENARIO: SCHOOL SUBSCRIPTION UPGRADE
      // The amount actually paid decides the period: GHS 3,000+ = 1 year, GHS 300+ = 1 month (per GHS 300).
      // Less than one month's fee upgrades nothing (before, ANY amount unlocked Premium for ever).
      if (metadata?.type === 'school_upgrade' && metadata?.schoolId) {
        const MONTHLY = 300, ANNUAL = 3000;
        const paid = Number(data.amount || 0) / 100;
        const currency = String(data.currency || 'GHS').toUpperCase();
        const schoolRef = db.collection('schools').doc(metadata.schoolId);
        const eventRef = db.collection('paystackEvents').doc(`upgrade_${String(data.reference).replace(/[^A-Za-z0-9_-]/g, '')}`);

        if (currency !== 'GHS' || paid < MONTHLY) {
          console.warn(`[Subscription] ${metadata.schoolId}: payment ${data.reference} of ${currency} ${paid} is below one month's fee — not upgraded.`);
          await eventRef.set({ schoolId: metadata.schoolId, amount: paid, currency, upgraded: false, at: new Date() }, { merge: true });
        } else {
          const days = paid >= ANNUAL ? 365 * Math.floor(paid / ANNUAL) + 31 * Math.floor((paid % ANNUAL) / MONTHLY) : 31 * Math.floor(paid / MONTHLY);
          await db.runTransaction(async (t) => {
            const ev = await t.get(eventRef);
            if (ev.exists) return; // Paystack retries: count each payment once
            const school = await t.get(schoolRef);
            const cur: any = school.data() || {};
            const curUntil = cur.paidUntil?.toDate ? cur.paidUntil.toDate().getTime() : 0;
            const start = Math.max(Date.now(), curUntil); // early renewal adds to the remaining time
            const paidUntil = new Date(start + days * 24 * 60 * 60 * 1000);
            t.update(schoolRef, {
              plan: 'Premium',
              status: 'active',
              trialEndsAt: null,
              paidUntil,
              lastPaymentDate: new Date(),
              lastPaymentAmount: paid,
              paymentReference: data.reference,
            });
            t.set(eventRef, { schoolId: metadata.schoolId, amount: paid, currency, days, paidUntil, upgraded: true, at: new Date() });
          });
          console.log(`✅ School ${metadata.schoolId} paid GHS ${paid}: Premium for ${days} more days.`);
        }
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
