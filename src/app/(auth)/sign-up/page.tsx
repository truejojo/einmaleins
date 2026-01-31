'use client';

import { useState } from 'react';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    

    try {
      const res = await fetch('/api/sign-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? 'Registrierung fehlgeschlagen');
        return;
      }

      console.log('User created:', data);
      setEmail('');
      setPassword('');
      setName('');
    } catch {
      setError('Netzwerkfehler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="h1">Sign Up</h1>
      <form onSubmit={handleSignUp}>
        <div>
          <label htmlFor="name">name:</label>
          <input
            type="name"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          {loading ? 'Wird erstellt…' : 'Sign Up'}
        </button>
      </form>
    </>
  );
};

export default SignUp;
