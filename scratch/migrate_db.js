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

async function migrate() {
    console.log('Fetching all journal entries...');
    const journalSnap = await db.collection('journal_entries').get();
    let updatedCount = 0;

    for (const doc of journalSnap.docs) {
        const data = doc.data();
        let changed = false;

        const newLines = data.lines.map(line => {
            // If it's a debit to Cash in a PV transaction, it's actually the VAT Input component!
            const isCashDebit = line.accountId === '1ciXPiBKVRw4GebDSb4m' && line.debit > 0;
            
            if (isCashDebit) {
                console.log(`Fixing VAT line in journal entry ${doc.id} (${data.reference}): changing account to VAT Input.`);
                changed = true;
                return {
                    ...line,
                    accountId: 'VAT-INPUT-DEFAULT',
                    accountName: 'VAT Input'
                };
            }
            return line;
        });

        if (changed) {
            await doc.ref.update({ lines: newLines });
            updatedCount++;
        }
    }

    console.log(`Migration complete. Fixed ${updatedCount} journal entries.`);
}

migrate().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
