import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

/**
 * Internal API endpoint for cross-platform token verification.
 * Safely handles empty or invalid request bodies.
 */
export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    
    if (!text) {
        return NextResponse.json({ error: 'Body is missing' }, { status: 400 });
    }

    let body;
    try {
        body = JSON.parse(text);
    } catch (e) {
        return NextResponse.json({ error: 'Invalid JSON format' }, { status: 400 });
    }

    const { token } = body;
    const secretKey = process.env.JWT_SECRET_KEY;

    if (!token) {
      return NextResponse.json({ error: 'Token is missing' }, { status: 400 });
    }

    if (!secretKey) {
      console.error('JWT_SECRET_KEY is not set on the server.');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify the token using the secret key.
    // This will throw an error if the token is invalid or expired.
    jwt.verify(token, secretKey);

    return NextResponse.json({ valid: true });

  } catch (error: any) {
    // If jwt.verify fails, it will be caught here.
    console.error('Token verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid or expired token', details: error.message }, { status: 401 });
  }
}
