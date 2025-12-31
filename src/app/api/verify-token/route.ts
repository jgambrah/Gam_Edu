
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// This is your new API endpoint for token verification.
export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
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

    // If verification is successful, return a success response.
    // In a real application, you might also check if the token has been used before (nonce check).
    return NextResponse.json({ valid: true });

  } catch (error: any) {
    // If jwt.verify fails, it will be caught here.
    console.error('Token verification failed:', error.message);
    return NextResponse.json({ error: 'Invalid or expired token', details: error.message }, { status: 401 });
  }
}
