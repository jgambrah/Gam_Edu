'use server';

import { getAdminDb } from '@/lib/firebaseAdmin';
import { verifySchoolStaffToken, AuthError } from '@/lib/admin-guard';
import { sendSchoolWhatsAppServer } from '@/lib/whatsapp-server';

/**
 * Sends a WhatsApp message from the school's UltraMsg instance.
 * Requires the caller's ID token: a server action is a public endpoint, so without this check anyone could
 * send messages from a school's WhatsApp number.
 */
export async function sendSchoolWhatsApp(schoolId: string, phone: string, message: string, idToken?: string) {
  if (!schoolId || !phone) return { success: false, error: 'Missing required data' };
  try {
    await verifySchoolStaffToken(idToken, schoolId);
  } catch (e: any) {
    return { success: false, error: e instanceof AuthError ? e.message : 'Not authorised.' };
  }
  return sendSchoolWhatsAppServer(getAdminDb(), schoolId, phone, message);
}
