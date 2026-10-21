"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSchoolWriteForPublicSite = exports.cleanDomain = exports.cleanSlug = void 0;
exports.publicSiteData = publicSiteData;
exports.syncPublicSite = syncPublicSite;
/**
 * Public copy of each school's website data.
 *
 * The school website (/s/{slug}) and custom domains are visited by people who are not signed in. They used
 * to read the `schools` collection directly, which meant anyone on the internet could LIST every school on
 * the platform with all its settings (plan, AI credits, report-card settings, signature image...).
 *
 * Now the server keeps:
 *   publicSites/{slug}      — the school document WITHOUT private/billing fields (what the website shows)
 *   publicDomains/{domain}  — { slug } for a custom domain (domain stored lower-case, without "www.")
 * Both can be fetched by id only (no listing), so the `schools` collection no longer needs to be public.
 *
 * Kept current by onSchoolWriteForPublicSite (on every change to a school). Run rebuild-public-sites.js once
 * after deploying, to create them for existing schools.
 */
const firestore_1 = require("firebase-functions/v2/firestore");
const app_1 = require("firebase-admin/app");
const firestore_2 = require("firebase-admin/firestore");
if (!(0, app_1.getApps)().length)
    (0, app_1.initializeApp)();
const db = (0, firestore_2.getFirestore)();
/** Fields never published: subscription/billing, internal settings, signatures, and anything secret. */
const PRIVATE_FIELDS = new Set([
    'aiCredits', 'aiCreditBalance', 'plan', 'status', 'isActive', 'trialEndsAt', 'subscription', 'subscriptionStatus',
    'subscriptionPlan', 'planExpiresAt', 'billingStatus', 'headmasterSignature', 'headmasterSignatureUrl',
    'smsProvider', 'smsSenderId', 'enableSms', 'enableWhatsApp', 'paystackPubKey', 'enablePaystack', 'enableTransflow',
    'shopTillMode', 'customCostCenters', 'gradingSystem', 'caWeight', 'examWeight', 'reportCardPositionMode',
    'trackStaffOnWeekends', 'vacationMode', 'isSetupComplete', 'billsHaveArchiveFlag', 'ownerId', 'createdBy',
]);
const SECRET_PATTERN = /(secret|token|apikey|api_key|password|passwd|privatekey|private_key|instanceid|credential)/i;
const isPrivateKey = (k) => PRIVATE_FIELDS.has(k) || SECRET_PATTERN.test(k) || /^wa[A-Z]/.test(k);
function publicSiteData(schoolId, data) {
    const out = {};
    Object.entries(data || {}).forEach(([k, v]) => { if (!isPrivateKey(k) && v !== undefined)
        out[k] = v; });
    out.id = schoolId;
    out.schoolId = schoolId;
    out.publishedAt = firestore_2.FieldValue.serverTimestamp();
    return out;
}
const cleanSlug = (s) => String(s || '').trim().toLowerCase();
exports.cleanSlug = cleanSlug;
const cleanDomain = (d) => String(d || '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');
exports.cleanDomain = cleanDomain;
const validId = (s) => !!s && !s.includes('/') && s !== '.' && s !== '..' && s.length <= 300;
/** Writes (or removes) one school's public copies. Exported for the one-off rebuild script. */
async function syncPublicSite(schoolId, before, after) {
    var _a, _b, _c, _d, _e;
    const oldSlug = (0, exports.cleanSlug)(before === null || before === void 0 ? void 0 : before.slug);
    const newSlug = after ? (0, exports.cleanSlug)(after.slug) : '';
    const oldDomain = (0, exports.cleanDomain)(before === null || before === void 0 ? void 0 : before.customDomain);
    const newDomain = after ? (0, exports.cleanDomain)(after.customDomain) : '';
    // Remove copies under an old slug/domain — only if they belong to this school.
    const removeIfOwn = async (col, id) => {
        var _a;
        if (!validId(id))
            return;
        const ref = db.collection(col).doc(id);
        const snap = await ref.get();
        if (snap.exists && ((_a = snap.data()) === null || _a === void 0 ? void 0 : _a.schoolId) === schoolId)
            await ref.delete();
    };
    if (oldSlug && oldSlug !== newSlug)
        await removeIfOwn('publicSites', oldSlug);
    if (oldDomain && oldDomain !== newDomain)
        await removeIfOwn('publicDomains', oldDomain);
    if (!after)
        return;
    if (validId(newSlug)) {
        const ref = db.collection('publicSites').doc(newSlug);
        const existing = await ref.get();
        // Two schools must not share a web address: the school that has it keeps it.
        if (existing.exists && ((_a = existing.data()) === null || _a === void 0 ? void 0 : _a.schoolId) && ((_b = existing.data()) === null || _b === void 0 ? void 0 : _b.schoolId) !== schoolId) {
            console.warn(`[publicSite] slug "${newSlug}" already used by school ${(_c = existing.data()) === null || _c === void 0 ? void 0 : _c.schoolId}; ${schoolId} not published.`);
        }
        else {
            await ref.set(publicSiteData(schoolId, after));
        }
    }
    if (validId(newDomain) && validId(newSlug)) {
        const ref = db.collection('publicDomains').doc(newDomain);
        const existing = await ref.get();
        if (!(existing.exists && ((_d = existing.data()) === null || _d === void 0 ? void 0 : _d.schoolId) && ((_e = existing.data()) === null || _e === void 0 ? void 0 : _e.schoolId) !== schoolId)) {
            await ref.set({ slug: newSlug, schoolId, updatedAt: firestore_2.FieldValue.serverTimestamp() });
        }
    }
}
exports.onSchoolWriteForPublicSite = (0, firestore_1.onDocumentWritten)('schools/{schoolId}', async (event) => {
    var _a, _b, _c, _d;
    const before = ((_b = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before) === null || _b === void 0 ? void 0 : _b.exists) ? event.data.before.data() : null;
    const after = ((_d = (_c = event.data) === null || _c === void 0 ? void 0 : _c.after) === null || _d === void 0 ? void 0 : _d.exists) ? event.data.after.data() : null;
    try {
        await syncPublicSite(event.params.schoolId, before, after);
    }
    catch (e) {
        console.error('[publicSite] sync failed for', event.params.schoolId, e === null || e === void 0 ? void 0 : e.message);
    }
});
//# sourceMappingURL=public-site.js.map