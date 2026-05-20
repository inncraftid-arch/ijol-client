import React, { useEffect, useState, type FormEvent } from 'react';
import { LockKeyhole } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { getValidAdminSession, signInAdmin } from '../services/adminAuthService';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    getValidAdminSession()
      .then((session) => {
        if (session && isActive) {
          navigate('/admin/items', { replace: true });
        }
      })
      .finally(() => {
        if (isActive) {
          setIsCheckingSession(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await signInAdmin(email.trim(), password);
      navigate('/admin/items', { replace: true });
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'Login gagal. Cek email dan password admin.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F0EB] px-5 text-brand-dark">
        <p className="text-sm font-semibold text-brand-dark/60">Memeriksa sesi admin...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0EB] px-5 py-12 text-brand-dark">
      <section className="w-full max-w-[420px] rounded-lg border border-brand-dark/10 bg-white px-6 py-8 shadow-sm md:px-8">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link to="/" className="inline-flex items-center">
            <img src="/assets/images/logo.light.svg" alt="IJOL" className="h-7" />
          </Link>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCF8F2] text-brand-gold">
            <LockKeyhole className="h-5 w-5" />
          </div>
        </div>

        <h1 className="font-serif text-3xl font-bold tracking-wide">Admin Login</h1>
        <p className="mt-2 text-sm leading-relaxed text-brand-dark/60">
          Masuk untuk melakukan QC item yang dikirim user.
        </p>

        {error && (
          <div className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-dark/55">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              autoComplete="email"
              className="mt-2 h-12 w-full rounded-md border border-brand-dark/15 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-brand-gold"
              placeholder="admin@ijol.id"
            />
          </label>

          <label className="block">
            <span className="text-xs font-bold uppercase tracking-wide text-brand-dark/55">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 h-12 w-full rounded-md border border-brand-dark/15 bg-white px-4 text-sm font-semibold outline-none transition-colors focus:border-brand-gold"
              placeholder="Password admin"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex h-12 w-full items-center justify-center rounded-full bg-brand-dark px-5 text-sm font-bold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Masuk...' : 'Masuk'}
          </button>
        </form>
      </section>
    </main>
  );
};
