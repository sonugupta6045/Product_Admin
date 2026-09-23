import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/login
 * Proxies credentials to DummyJSON, then stores the returned JWT in an
 * HttpOnly, SameSite=Lax cookie so the middleware can read it.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body as {
      username: string;
      password: string;
    };

    const res = await fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, expiresInMins: 60 }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.message ?? 'Invalid credentials' },
        { status: res.status }
      );
    }

    // Set the token in an HttpOnly cookie readable by middleware
    const response = NextResponse.json(data, { status: 200 });
    response.cookies.set('token', data.token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60, // 1 hour — matches expiresInMins above
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
