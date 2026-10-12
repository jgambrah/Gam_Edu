export const GOOGLE_TAG_ID = 'AW-18497577658';
export const GOOGLE_LEAD_CONVERSION_ID = 'AW-18497577658/E_YlCOPBlJMdELrFqvRE';

/**
 * Dispatches a conversion event to Google Ads specifically when a lead is captured.
 */
export function trackGoogleLeadConversion(details?: {
  schoolName?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    try {
      (window as any).gtag('event', 'conversion', {
        send_to: GOOGLE_LEAD_CONVERSION_ID,
        value: details?.value ?? 1.0,
        currency: details?.currency ?? 'USD',
        event_category: 'Lead',
        event_label: details?.schoolName ?? 'School Lead',
      });
      console.log('✅ [Google Ads] Lead conversion successfully recorded for:', details?.schoolName || 'New Lead');
    } catch (err) {
      console.warn('⚠️ [Google Ads] Conversion tracking error:', err);
    }
  }
}
