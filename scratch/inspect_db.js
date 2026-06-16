const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Read and parse .env file
const envPath = path.join(__dirname, '..', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
        let val = match[2] || '';
        if (val.startsWith('"') && val.endsWith('"')) {
            val = val.substring(1, val.length - 1);
        }
        val = val.replace(/\\n/g, '\n');
        env[match[1]] = val;
    }
});

// Initialize Firebase Admin
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: env.FIREBASE_PRIVATE_KEY
    })
});

const db = admin.firestore();

async function inspect() {
    console.log('--- RECENT PAYMENT VOUCHERS ---');
    const pvSnap = await db.collection('paymentVouchers').orderBy('createdAt', 'desc').limit(5).get();
    pvSnap.forEach(doc => {
        const data = doc.data();
        console.log(`PV: ${data.pvNumber}, Payee: ${data.payee}, Gross: ${data.grossAmount}, VAT: ${data.vatAmount}, WHT: ${data.whtAmount}, Net: ${data.netPayable}, Status: ${data.status}`);
    });

    console.log('\n--- RECENT JOURNAL ENTRIES ---');
    const jSnap = await db.collection('journal_entries').orderBy('createdAt', 'desc').limit(5).get();
    jSnap.forEach(doc => {
        const data = doc.data();
        console.log(`Journal Ref: ${data.reference}, Description: ${data.description}, Total: ${data.totalAmount}`);
        console.log('Lines:');
        data.lines.forEach(l => {
            console.log(`  - AccountId: ${l.accountId}, Name: ${l.accountName}, Debit: ${l.debit}, Credit: ${l.credit}`);
        });
    });
}

inspect().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
