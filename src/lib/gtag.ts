export const GOOGLE_TAG_ID = 'AW-18497577658';
export const GOOGLE_LEAD_CONVERSION_ID = 'AW-18497577658/E_YlCOPBlJMdELrFqvRE';
export const GOOGLE_CALL_CONVERSION_ID = 'AW-18497577658/QzWhCKmp9J4dELrFqvRE';

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

/**
 * Dispatches a conversion event to Google Ads when someone clicks a call button/link.
 * Matches Google Ads 'Click to call' event snippet: AW-18497577658/QzWhCKmp9J4dELrFqvRE
 */
export function trackGoogleCallConversion(url?: string) {
  if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
    try {
      const callback = function () {
        if (typeof url !== 'undefined' && url) {
          window.location.href = url;
        }
      };
      (window as any).gtag('event', 'conversion', {
        send_to: GOOGLE_CALL_CONVERSION_ID,
        value: 1.0,
        currency: 'USD',
        event_callback: callback,
      });
      console.log('✅ [Google Ads] Click-to-call conversion successfully recorded');
    } catch (err) {
      console.warn('⚠️ [Google Ads] Call conversion tracking error:', err);
    }
  }
}

// Global hook for direct script calls
if (typeof window !== 'undefined') {
  (window as any).gtag_report_conversion = trackGoogleCallConversion;
}
