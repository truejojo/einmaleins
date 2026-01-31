import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/admin';
import { signUpSchema, formatZodIssues } from '@/lib/validation/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validierung fehlgeschlagen', issues: formatZodIssues(parsed.error) },
        { status: 400 },
      );
    }

    const { email, password, name } = parsed.data;

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    return NextResponse.json({ uid: userRecord.uid }, { status: 201 });
  } catch (error: unknown) {
    const e = error as { message?: string; code?: string } | undefined;
    const message = e?.message ?? 'Unbekannter Fehler';
    const code = e?.code ?? 'unknown';
    const status = code === 'auth/email-already-exists' ? 409 : 400;
    return NextResponse.json({ error: message, code }, { status });
  }
}
