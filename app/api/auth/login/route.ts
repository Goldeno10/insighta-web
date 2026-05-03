import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const { access_token, refresh_token, expires_in } = await request.json();

  const response = NextResponse.json({ status: 'success' });

  // 1. Seal Access Token in an HTTP-Only Cookie
  response.headers.append(
    'Set-Cookie',
    serialize('access_token', access_token, {
      httpOnly: true,     // Block JavaScript access (No XSS theft)
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict', // CSRF protection
      maxAge: parseInt(expires_in), // Align with token expiry
      path: '/',
    })
  );

  // 2. Seal Refresh Token
  response.headers.append(
    'Set-Cookie',
    serialize('refresh_token', refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: parseInt(expires_in), // Align with token expiry
      path: '/',
    })
  );

  return response;
}
