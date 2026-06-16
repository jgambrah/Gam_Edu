import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { processBiometricScans } from '@/app/actions/biometric-actions';

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
    const text = await req.text();
    if (!text) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    let body;
    try {
      body = JSON.parse(text);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    // Authenticate: read key from custom header or body payload
    const apiKey = req.headers.get('x-biometric-api-key') || body.apiKey;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing Integration API Key (apiKey or x-biometric-api-key header)' }, { status: 401 });
    }

    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);

    // 1. Resolve school by API Key
    const settingsSnap = await db.collection('schoolSettings')
      .where('biometricApiKey', '==', apiKey)
      .limit(1)
      .get();

    if (settingsSnap.empty) {
      return NextResponse.json({ error: 'Invalid Integration API Key' }, { status: 403 });
    }

    const settingsDoc = settingsSnap.docs[0];
    const schoolId = settingsDoc.id;

    // 2. Extract logs from request body
    const logs = body.logs;
    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty logs array' }, { status: 400 });
    }

    // Validate logs format
    const validatedLogs: { biometricId: string; timestamp: number }[] = [];
    for (const log of logs) {
      if (!log.biometricId) {
        continue;
      }
      const timestamp = Number(log.timestamp) || Date.now();
      validatedLogs.push({
        biometricId: String(log.biometricId),
        timestamp,
      });
    }

    if (validatedLogs.length === 0) {
      return NextResponse.json({ error: 'No valid logs with biometricId found' }, { status: 400 });
    }

    // 3. Process scans: records attendance, bills canteen/bus, triggers parents push notifications
    const result = await processBiometricScans(db, schoolId, new Date(), validatedLogs);

    return NextResponse.json({
      message: `Successfully processed ${result.processedCount} logs.`,
      ...result
    }, { status: 200 });

  } catch (error: any) {
    console.error('Critical error in biometric API endpoint:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
