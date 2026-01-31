import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { signInSchema } from '@/lib/validation/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((i) => ({ path: i.path, message: i.message }));
      return NextResponse.json({ error: 'Validierung fehlgeschlagen', issues }, { status: 400 });
    }

    const { email, password } = parsed.data;

    if (!email || !password) {
      return NextResponse.json({ error: 'E-Mail und Passwort sind erforderlich' }, { status: 400 });
    }

    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API-Schlüssel fehlt (NEXT_PUBLIC_FIREBASE_API_KEY)' },
        { status: 500 },
      );
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await res.json();

    if (!res.ok) {
      const code = data?.error?.message as string | undefined;
      const status =
        code === 'EMAIL_NOT_FOUND' || code === 'INVALID_PASSWORD'
          ? 401
          : code === 'USER_DISABLED'
            ? 403
            : 400;
      return NextResponse.json({ error: 'Anmeldung fehlgeschlagen', code }, { status });
    }

    const idToken = data?.idToken as string | undefined;
    const uid = data?.localId as string | undefined;
    if (!idToken || !uid) {
      return NextResponse.json({ error: 'Ungültige Antwort vom Login' }, { status: 500 });
    }

    // Session-Cookie erstellen (z. B. 5 Tage Gültigkeit)
    const expiresInMs = 5 * 24 * 60 * 60 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: expiresInMs });

    const response = NextResponse.json({ uid }, { status: 200 });
    response.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(expiresInMs / 1000),
    });
    return response;
  } catch (error: unknown) {
    const e = error as { message?: string } | undefined;
    const message = e?.message ?? 'Unbekannter Fehler';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
