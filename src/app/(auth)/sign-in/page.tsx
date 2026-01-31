'use client';

import { useState } from 'react';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Anmeldung fehlgeschlagen');
        return;
      }

      console.log('User signed in:', data);
      setEmail('');
      setPassword('');
    } catch {
      setError('Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="h1">Sign In</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <button type="submit" className="button" data-type="primary-dark" disabled={loading}>
          {loading ? 'Wird erstellt…' : 'Sign In'}
        </button>
      </form>
    </>
  );
};

export default SignIn;
