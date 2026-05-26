import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { apiClient } from '@/api/apiClient';
import { useAuth } from '@/lib/AuthContext';

const resolveTargetPath = (rawFromUrl) => {
  if (!rawFromUrl || typeof window === 'undefined') {
    return '/dashboard';
  }

  try {
    const parsedUrl = new URL(rawFromUrl, window.location.origin);
    return `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}` || '/dashboard';
  } catch (error) {
    return '/dashboard';
  }
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, checkAppState } = useAuth();

  const targetPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return resolveTargetPath(params.get('from_url'));
  }, [location.search]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(targetPath, { replace: true });
    }
  }, [isAuthenticated, navigate, targetPath]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await apiClient.auth.login({ email, password });
      await checkAppState();
      navigate(targetPath, { replace: true });
    } catch (error) {
      setErrorMessage(error.message || 'Unable to sign in');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b040d] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-black/30 border border-white/10 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Sign in to Designer Pro</h1>
        <p className="text-white/60 text-sm mb-6">Use your workspace account to continue.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80 block mb-2" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-[#ab00ff]"
              placeholder="admin@designerpro.com"
            />
          </div>

          <div>
            <label className="text-sm text-white/80 block mb-2" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2.5 outline-none focus:border-[#ab00ff]"
              placeholder="********"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#ab00ff] hover:bg-[#9600e0] disabled:opacity-60 transition-colors rounded-lg px-4 py-2.5 font-semibold"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
