import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const hostname = req.headers.get('host') || '';

  // 1. Exclude main SaaS portal domains & local dev servers
  const mainDomains = [
    'localhost:3000',
    '127.0.0.1:3000',
    'gamedu.com',
    'gamedu-app.com',
    'nextn.vercel.app',
    'apphosting.com',
    'gam-it-service.app',
    'gam-it-service.vercel.app'
  ];

  const isMainDomain = mainDomains.some(domain => hostname === domain || hostname === `www.${domain}`);

  if (isMainDomain) {
    return NextResponse.next();
  }

  // 2. Fetch the matched school slug for this custom domain
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    if (!projectId) {
      console.error('[Middleware] FIREBASE_PROJECT_ID env variable is not set');
      return NextResponse.next();
    }

    const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery`;

    // Query Firestore for schools where customDomain == hostname
    const response = await fetch(firestoreUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId: 'schools' }],
          where: {
            fieldFilter: {
              field: { fieldPath: 'customDomain' },
              op: 'EQUAL',
              value: { stringValue: hostname }
            }
          },
          limit: 1
        }
      }),
      // Cache query for 60 seconds to avoid spamming Firestore REST API
      next: { revalidate: 60 }
    } as any);

    if (!response.ok) {
      console.error('[Middleware] Firestore query failed:', response.statusText);
      return NextResponse.next();
    }

    const data = await response.json();
    const document = data?.[0]?.document;

    if (document) {
      const fields = document.fields;
      const slug = fields?.slug?.stringValue;

      if (slug) {
        console.log(`[Middleware] Rewriting custom domain ${hostname} to /s/${slug}`);
        // Rewrite to the school's dynamic storefront route
        url.pathname = `/s/${slug}${url.pathname === '/' ? '' : url.pathname}`;
        return NextResponse.rewrite(url);
      }
    }
  } catch (error) {
    console.error('[Middleware] Custom domain resolution error:', error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt, manifest.json (metadata files)
     * - icons/ (PWA icon assets)
     * - sw.js (service worker)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|icons/|sw.js).*)',
  ],
};
