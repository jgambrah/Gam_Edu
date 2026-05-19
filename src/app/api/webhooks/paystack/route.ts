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
      if (metadata?.type === 'school_upgrade' && metadata?.schoolId) {
        console.log(`🏫 Upgrading School ID: ${metadata.schoolId}`);
        
        const schoolRef = db.collection('schools').doc(metadata.schoolId);
        
        // Use Admin SDK to force the update
        await schoolRef.update({
          plan: 'Premium',
          status: 'active',
          trialEndsAt: null, // Removes the lock
          lastPaymentDate: new Date(),
          paymentReference: data.reference
        });
        
        console.log(`✅ School ${metadata.schoolId} unlocked successfully.`);
      }
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
