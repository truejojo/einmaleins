import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email as string | undefined;
    const password = body?.password as string | undefined;
    const name = (body?.name as string | undefined) ?? undefined;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich' },
        { status: 400 },
      );
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    return NextResponse.json(
      { uid: userRecord.uid },
      { status: 201 },
    );
  } catch (error: unknown) {
    const e = error as { message?: string; code?: string } | undefined;
    const message = e?.message ?? 'Unbekannter Fehler';
    const code = e?.code ?? 'unknown';
    const status = code === 'auth/email-already-exists' ? 409 : 400;
    return NextResponse.json({ error: message, code }, { status });
  }
}
