import { getSchoolSecrets } from '@/lib/school-secrets';

/**
 * Server-only WhatsApp sender (UltraMsg). Callers must have authorised the request already:
 * the `sendSchoolWhatsApp` server action checks the user's token; the biometric webhook checks its API key.
 */
export async function sendSchoolWhatsAppServer(db: FirebaseFirestore.Firestore, schoolId: string, phone: string, message: string) {
  if (!schoolId || !phone) return { success: false, error: 'Missing required data' };
  try {
    const settingsSnap = await db.collection('schoolSettings').doc(schoolId).get();
    const settings: any = settingsSnap.data() || {};
    const secrets = await getSchoolSecrets(db, schoolId);
    if (!settings.enableWhatsApp || !secrets.waInstanceId || !secrets.waToken) {
      return { success: false, error: 'WhatsApp automation is not fully configured for this school.' };
    }

    // Ghana numbers: 0XXXXXXXXX → 233XXXXXXXXX
    let cleanPhone = phone.replace(/\s+/g, '');
    if (cleanPhone.startsWith('0')) cleanPhone = '233' + cleanPhone.substring(1);
    const whatsappNumber = `${cleanPhone}@c.us`;

    const response = await fetch(`https://api.ultramsg.com/${encodeURIComponent(secrets.waInstanceId)}/messages/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ token: secrets.waToken, to: whatsappNumber, body: message }),
    });
    const result: any = await response.json().catch(() => ({}));
    if (result.sent === 'true' || result.sent === true) return { success: true };
    return { success: false, error: result.error || 'Provider failed to send message.' };
  } catch (error: any) {
    console.error('WhatsApp send error:', error?.message);
    return { success: false, error: error?.message || 'WhatsApp send failed.' };
  }
}
