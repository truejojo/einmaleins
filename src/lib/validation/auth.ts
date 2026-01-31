import { z } from 'zod';

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: 'Ungültige E-Mail-Adresse' })
  .max(254, { message: 'E-Mail ist zu lang' });

export const passwordSchema = z
  .string()
  .min(6, { message: 'Passwort muss mindestens 6 Zeichen haben' })
  .max(128, { message: 'Passwort ist zu lang' });

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: 'Name darf nicht leer sein' })
  .max(64, { message: 'Name ist zu lang' });

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInInput = z.infer<typeof signInSchema>;

export function formatZodIssues(error: z.ZodError) {
  return error.issues.map((i) => ({ path: i.path, message: i.message }));
}
