'use server';

/**
 * Staff clock-in / clock-out, done on the server so the record can be trusted:
 *  - the time is the server's (a wrong phone clock cannot make someone "on time"),
 *  - the campus distance is worked out here from the school's saved location,
 *  - a second clock-in on the same day, or a clock-out without a clock-in, is refused,
 *  - the selfie goes to Storage (the attendance record keeps only its link, not the whole photo),
 *  - the face check fetches the staff member's profile photo itself and compares it with the selfie.
 * Cost: about 5 reads + 1 write per clock action, plus one AI image comparison when a profile photo exists.
 */

import { randomUUID } from 'crypto';
import { getStorage } from 'firebase-admin/storage';
import { z } from 'zod';
import { requireSignedIn, schoolsOfUser, SessionError } from '@/lib/session-guard';
import { getAdminApp, getAdminDb, FieldValue } from '@/lib/firebaseAdmin';
import { getDistanceInMeters } from '@/lib/geo';
import { ai } from '@/ai/genkit';

const NON_STAFF_ROLES = ['student', 'parent', 'guardian'];
const DEFAULT_TZ = 'Africa/Accra';
const DEFAULT_RADIUS = 200;
const BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'gamedu-69888475-f5783.firebasestorage.app';

export type ClockResult =
  | {
      success: true;
      type: 'In' | 'Out';
      status: 'Present' | 'Late';
      leftEarly: boolean;
      afterHours: boolean;
      geofence: 'checked' | 'not_set';
      isFlagged: boolean;
      distanceMeters: number | null;
      allowedRadius: number;
      identityStatus: 'verified' | 'mismatch' | 'unchecked';
      identityNotes: string;
    }
  | { success: false; error: string };

/** Date (yyyy-mm-dd) and minutes since midnight in the school's time zone. */
function localParts(date: Date, timeZone: string) {
  let tz = timeZone;
  try { new Intl.DateTimeFormat('en-GB', { timeZone: tz }); } catch { tz = DEFAULT_TZ; }
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  const get = (t: string) => parts.find(p => p.type === t)?.value || '00';
  return { day: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

const toMinutes = (hhmm: unknown) => {
  const m = typeof hhmm === 'string' ? hhmm.match(/^(\d{1,2}):(\d{2})/) : null;
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

const num = (v: unknown) => {
  const n = typeof v === 'string' ? parseFloat(v) : (v as number);
  return typeof n === 'number' && Number.isFinite(n) ? n : null;
};

/** The profile photo as base64 (accepts a data URI or an https link). */
async function profilePhotoBase64(src: unknown): Promise<string | null> {
  if (typeof src !== 'string' || !src) return null;
  if (src.startsWith('data:image/')) return src.split(',')[1] || null;
  if (!/^https:\/\//i.test(src)) return null;
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(src, { signal: ctrl.signal });
    clearTimeout(t);
    if (!res.ok || !(res.headers.get('content-type') || '').startsWith('image/')) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length > 6 * 1024 * 1024) return null;
    return buf.toString('base64');
  } catch {
    return null;
  }
}

const FaceSchema = z.object({
  isMatch: z.boolean().describe('True if the two photos show the same person.'),
  confidence: z.string().describe('One short sentence on why.'),
  showsSchoolEnvironment: z.boolean().describe('True if the background of the live selfie clearly shows a school compound, classroom, chalkboard/whiteboard, school desks, school office, noticeboard, or school signage/uniforms.'),
});

const EnvironmentSchema = z.object({
  showsSchoolEnvironment: z.boolean().describe('True if the background of the selfie clearly shows a school compound, classroom, chalkboard/whiteboard, school desks, school office, noticeboard, or school signage/uniforms.'),
});

async function compareFaces(profileB64: string, selfieB64: string) {
  const { output } = await ai.generate({
    model: 'googleai/gemini-3-flash-preview',
    prompt: [
      { text: 'You are an HR security assistant. Image 1 is the official staff profile photo; Image 2 is a live selfie taken to clock in. 1) Are they the same person? Focus on facial features; ignore lighting, glasses, head-wear and clothing. If Image 2 shows no clear face, answer false. 2) Does the background of Image 2 clearly show a school environment (classroom, whiteboard/chalkboard, school desks, school office/noticeboard, or school compound)?' },
      { media: { url: `data:image/jpeg;base64,${profileB64}` } },
      { media: { url: `data:image/jpeg;base64,${selfieB64}` } },
    ],
    output: { schema: FaceSchema },
  });
  if (!output) throw new Error('No answer from the face check.');
  return output;
}

async function checkSchoolBackground(selfieB64: string) {
  const { output } = await ai.generate({
    model: 'googleai/gemini-3-flash-preview',
    prompt: [
      { text: 'You are an HR security assistant reviewing a staff clock-in selfie. Does the background clearly show a school environment (such as a classroom, chalkboard/whiteboard, school desks, school office/noticeboard, or school compound/corridor)? Answer true only if school/classroom/office features are visible.' },
      { media: { url: `data:image/jpeg;base64,${selfieB64}` } },
    ],
    output: { schema: EnvironmentSchema },
  });
  return Boolean(output?.showsSchoolEnvironment);
}

async function uploadSelfie(schoolId: string, uid: string, day: string, type: string, b64: string): Promise<string | null> {
  try {
    const bucket = getStorage(getAdminApp()).bucket(BUCKET);
    const path = `schools/${schoolId}/staff_attendance/${uid}/${day}_${type}_${Date.now()}.jpg`;
    const token = randomUUID();
    await bucket.file(path).save(Buffer.from(b64, 'base64'), {
      contentType: 'image/jpeg',
      resumable: false,
      metadata: { cacheControl: 'private, max-age=86400', metadata: { firebaseStorageDownloadTokens: token } },
    });
    return `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/${encodeURIComponent(path)}?alt=media&token=${token}`;
  } catch (e) {
    console.error('[staff-clock] selfie upload failed', e);
    return null;
  }
}

export async function clockStaffAction(input: {
  schoolId: string;
  type: 'In' | 'Out';
  photo: string;
  latitude: number;
  longitude: number;
  accuracy?: number | null;
}): Promise<ClockResult> {
  try {
    const user = await requireSignedIn();
    const { schoolId, type } = input || ({} as any);
    if (!schoolId || (type !== 'In' && type !== 'Out')) return { success: false, error: 'Missing details.' };
    if (!user.isSuperAdmin) {
      const schools = await schoolsOfUser(user);
      if (!schools.includes(schoolId)) return { success: false, error: "You can only clock in at your own school." };
    }

    const lat = num(input.latitude), lng = num(input.longitude);
    if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) return { success: false, error: 'Your location is missing. Turn on location and try again.' };
    const photo = typeof input.photo === 'string' ? input.photo : '';
    const selfieB64 = photo.startsWith('data:image/') ? photo.split(',')[1] || '' : '';
    if (!selfieB64) return { success: false, error: 'Please take a photo first.' };
    if (selfieB64.length > 1_200_000) return { success: false, error: 'The photo is too large. Please retake it.' };

    const db = getAdminDb();
    const [staffSnap, userSnap, settingsSnap] = await Promise.all([
      db.collection('staff').doc(user.uid).get(),
      db.collection('users').doc(user.uid).get(),
      db.collection('schoolSettings').doc(schoolId).get(),
    ]);
    const staff: any = staffSnap.exists ? staffSnap.data() : {};
    const usr: any = userSnap.exists ? userSnap.data() : {};
    const role = String(staff.role || usr.role || user.claims?.role || '').toLowerCase();
    if (!staffSnap.exists && NON_STAFF_ROLES.includes(role)) return { success: false, error: 'Clock-in is for school staff only.' };
    const settings: any = settingsSnap.exists ? settingsSnap.data() : {};

    // --- Today, in the school's time zone (server clock) ---
    const now = new Date();
    const tz = typeof settings.timezone === 'string' && settings.timezone ? settings.timezone : DEFAULT_TZ;
    const { day, minutes } = localParts(now, tz);

    // Today's records for this person: the last 10 is plenty (at most 2 a day).
    const recent = await db.collection('staff_attendance')
      .where('schoolId', '==', schoolId).where('staffId', '==', user.uid)
      .orderBy('timestamp', 'desc').limit(10).get();
    const today = recent.docs
      .map(d => d.data() as any)
      .filter(d => d.timestamp?.toDate && localParts(d.timestamp.toDate(), tz).day === day);
    const inToday = today.find(d => d.type === 'In');
    const outToday = today.find(d => d.type === 'Out');
    if (type === 'In' && inToday) return { success: false, error: 'You have already clocked in today.' };
    if (type === 'Out' && !inToday) return { success: false, error: 'Clock in first — there is no clock-in for today.' };
    if (type === 'Out' && outToday) return { success: false, error: 'You have already clocked out today.' };

    // --- Time rules ---
    const start = toMinutes(settings.schoolStartTime);
    const close = toMinutes(settings.schoolCloseTime);
    let status: 'Present' | 'Late' = 'Present';
    let leftEarly = false;
    let afterHours = false;
    if (type === 'In') {
      if (start !== null && minutes > start + 5) status = 'Late';
      if (close !== null && minutes >= close) afterHours = true;
    } else if (close !== null && minutes < close) {
      leftEarly = true;
    }

    // --- Geofence (accounts for indoor GPS uncertainty radius up to 600m) ---
    const sLat = num(settings.schoolLat), sLng = num(settings.schoolLng);
    const radius = num(settings.allowedRadius) && num(settings.allowedRadius)! > 0 ? num(settings.allowedRadius)! : DEFAULT_RADIUS;
    const geofence: 'checked' | 'not_set' = sLat !== null && sLng !== null && !(sLat === 0 && sLng === 0) ? 'checked' : 'not_set';
    const distance = geofence === 'checked' ? Math.round(getDistanceInMeters(sLat!, sLng!, lat, lng)) : null;
    const accuracy = num(input.accuracy);
    const accuracyMargin = accuracy !== null && accuracy > 0 ? Math.min(Math.round(accuracy), 600) : 0;
    const effectiveDistance = distance !== null ? Math.max(0, distance - accuracyMargin) : null;
    let isFlagged = geofence === 'checked' && effectiveDistance! > radius;

    // --- Selfie + face/background check (in parallel) ---
    const profileSrc = staff.photoURL || staff.profilePic || staff.avatar || usr.photoURL || null;
    const [photoUrl, identity] = await Promise.all([
      uploadSelfie(schoolId, user.uid, day, type, selfieB64),
      (async () => {
        const profileB64 = await profilePhotoBase64(profileSrc);
        if (!profileB64) {
          let showsSchool = false;
          if (isFlagged) {
            try { showsSchool = await checkSchoolBackground(selfieB64); } catch {}
          }
          const baseNotes = profileSrc ? 'Profile photo could not be opened, so the face was not checked.' : 'No profile photo on record, so the face was not checked.';
          return {
            status: 'unchecked' as const,
            notes: showsSchool ? `${baseNotes} School environment verified in background photo.` : baseNotes,
            showsSchoolEnvironment: showsSchool,
          };
        }
        try {
          const r = await compareFaces(profileB64, selfieB64);
          return r.isMatch
            ? {
                status: 'verified' as const,
                notes: r.showsSchoolEnvironment ? 'Identity & school background verified by AI.' : 'Identity Verified by AI.',
                showsSchoolEnvironment: Boolean(r.showsSchoolEnvironment),
              }
            : {
                status: 'mismatch' as const,
                notes: r.confidence || 'Face does not match the profile photo.',
                showsSchoolEnvironment: Boolean(r.showsSchoolEnvironment),
              };
        } catch (e) {
          console.error('[staff-clock] face check failed', e);
          return { status: 'unchecked' as const, notes: 'Face check was unavailable. Manual review required.', showsSchoolEnvironment: false };
        }
      })(),
    ]);

    // If GPS drifted outside the radius (indoor cell/Wi-Fi fallback or slight campus pin offset)
    // but the live selfie background clearly shows a classroom/school environment, do not flag off-campus.
    if (isFlagged && identity.showsSchoolEnvironment) {
      isFlagged = false;
    }

    await db.collection('staff_attendance').add({
      staffId: user.uid,
      staffName: staff.name || [staff.firstName, staff.lastName].filter(Boolean).join(' ') || usr.displayName || usr.name || user.name || 'N/A',
      type,
      status,
      leftEarly,
      afterHours,
      timestamp: FieldValue.serverTimestamp(),
      localDate: day,
      // Link to the photo in Storage; the photo itself is only kept in the record if the upload failed.
      verificationPhotoUrl: photoUrl || photo,
      schoolId,
      latitude: lat,
      longitude: lng,
      gpsAccuracyMeters: accuracy !== null ? Math.round(accuracy) : null,
      geofence,
      isFlagged,
      distanceMeters: distance,
      allowedRadius: radius,
      identityStatus: identity.status,
      isIdentityFlagged: identity.status === 'mismatch',
      identityNotes: identity.notes,
      recordedBy: 'server',
    });

    return {
      success: true, type, status, leftEarly, afterHours, geofence, isFlagged,
      distanceMeters: distance, allowedRadius: radius,
      identityStatus: identity.status, identityNotes: identity.notes,
    };
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('[staff-clock] failed', e);
    return { success: false, error: 'Could not record your attendance. Please try again.' };
  }
}

const ADMIN_OVERRIDE_ROLES = ['director', 'administrator', 'admin', 'principal', 'headmaster', 'headmistress', 'head teacher', 'owner', 'hr', 'secretary'];

export async function overrideStaffGeofenceAction(input: {
  schoolId: string;
  logId: string;
  mode: 'approve_log' | 'reanchor_campus';
}): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    const user = await requireSignedIn();
    const { schoolId, logId, mode } = input || ({} as any);
    if (!schoolId || !logId || (mode !== 'approve_log' && mode !== 'reanchor_campus')) {
      return { success: false, error: 'Invalid request parameters.' };
    }
    if (!user.isSuperAdmin) {
      const schools = await schoolsOfUser(user);
      if (!schools.includes(schoolId)) return { success: false, error: 'Unauthorized school access.' };
    }

    const db = getAdminDb();
    const [staffSnap, userSnap, logSnap, settingsSnap] = await Promise.all([
      db.collection('staff').doc(user.uid).get(),
      db.collection('users').doc(user.uid).get(),
      db.collection('staff_attendance').doc(logId).get(),
      db.collection('schoolSettings').doc(schoolId).get(),
    ]);

    const role = String(
      (staffSnap.exists ? staffSnap.data()?.role : '') ||
      (userSnap.exists ? userSnap.data()?.role : '') ||
      user.claims?.role || ''
    ).toLowerCase();

    if (!user.isSuperAdmin && !ADMIN_OVERRIDE_ROLES.includes(role)) {
      return { success: false, error: 'Only school administrators can override geofence flags.' };
    }
    if (!logSnap.exists || logSnap.data()?.schoolId !== schoolId) {
      return { success: false, error: 'Attendance record not found.' };
    }

    const logData: any = logSnap.data() || {};
    const settings: any = settingsSnap.exists ? settingsSnap.data() : {};
    const radius = num(settings.allowedRadius) && num(settings.allowedRadius)! > 0 ? num(settings.allowedRadius)! : DEFAULT_RADIUS;

    if (mode === 'approve_log') {
      await logSnap.ref.update({
        isFlagged: false,
        geofenceOverrideBy: user.uid,
        identityNotes: logData.identityNotes
          ? `${logData.identityNotes} (Confirmed on-campus by admin)`
          : 'Confirmed on-campus by admin photo review.',
      });
      return { success: true, updatedCount: 1 };
    }

    // mode === 'reanchor_campus': Use this verified scan's GPS as the school's master coordinates
    const newLat = num(logData.latitude), newLng = num(logData.longitude);
    if (newLat === null || newLng === null) {
      return { success: false, error: 'This attendance record does not have GPS coordinates.' };
    }

    await db.collection('schoolSettings').doc(schoolId).set(
      { schoolLat: newLat, schoolLng: newLng },
      { merge: true }
    );

    // Re-evaluate recent flagged logs for this school against the corrected campus coordinates
    const recentFlaggedSnap = await db.collection('staff_attendance')
      .where('schoolId', '==', schoolId)
      .orderBy('timestamp', 'desc')
      .limit(60)
      .get();

    const batch = db.batch();
    let updatedCount = 0;
    for (const d of recentFlaggedSnap.docs) {
      const data = d.data() as any;
      const dLat = num(data.latitude), dLng = num(data.longitude);
      if (dLat !== null && dLng !== null) {
        const dist = Math.round(getDistanceInMeters(newLat, newLng, dLat, dLng));
        const acc = num(data.gpsAccuracyMeters);
        const accMargin = acc !== null && acc > 0 ? Math.min(Math.round(acc), 600) : 0;
        const nextFlagged = Math.max(0, dist - accMargin) > radius;
        if (data.isFlagged !== nextFlagged || data.distanceMeters !== dist || d.id === logId) {
          batch.update(d.ref, {
            distanceMeters: dist,
            isFlagged: d.id === logId ? false : nextFlagged,
          });
          updatedCount++;
        }
      }
    }
    if (updatedCount > 0) {
      await batch.commit();
    }

    return { success: true, updatedCount };
  } catch (e: any) {
    if (e instanceof SessionError) return { success: false, error: e.message };
    console.error('[staff-clock] overrideStaffGeofenceAction failed', e);
    return { success: false, error: e?.message || 'Failed to update geofence status.' };
  }
}
