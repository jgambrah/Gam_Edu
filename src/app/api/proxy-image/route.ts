import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to proxy images from Firebase Storage.
 * This avoids client-side CORS issues during PDF generation.
 */
export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');
    if (!url) return new NextResponse('Missing url', { status: 400 });

    // Security: Only allow requests to the school's Firebase Storage domain
    if (!url.startsWith('https://firebasestorage.googleapis.com')) {
        return new NextResponse('Forbidden: Only Firebase Storage URLs are allowed', { status: 403 });
    }

    try {
        // Fetch the image from the source URL
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Upstream returned ${response.status}`);
        
        // Convert to buffer for the response
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';
        
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'Access-Control-Allow-Origin': '*',      // Explicitly allow all for internal proxy
            },
        });
    } catch (err: any) {
        console.error('Image Proxy Error:', err.message);
        return new NextResponse('Failed to fetch image', { status: 500 });
    }
}
