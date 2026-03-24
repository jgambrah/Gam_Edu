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
        // Fetch the image from the source URL with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            console.error(`Upstream Image Proxy Error: ${response.status} ${response.statusText}`);
            return new NextResponse(`Upstream returned ${response.status}`, { status: response.status });
        }
        
        const buffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/png';
        
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
                'Access-Control-Allow-Origin': '*',
            },
        });
    } catch (err: any) {
        console.error('Image Proxy Error:', err.message);
        // Map common errors to safer responses to prevent 502s
        if (err.name === 'AbortError') {
            return new NextResponse('Image fetch timed out', { status: 504 });
        }
        return new NextResponse('Internal Image Proxy Error', { status: 500 });
    }
}
