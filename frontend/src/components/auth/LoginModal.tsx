'use client';

import { useState } from 'react';
import { login } from '@/lib/auth';

interface Props {
  onSuccess: () => void;
  onClose: () => void;
}

export function LoginModal({ onSuccess, onClose }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      onSuccess();
    } catch {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-8">
        <h2 className="mb-6 text-xl font-semibold text-neutral-100">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-neutral-100 outline-none focus:border-amber-400"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-neutral-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-white/10 bg-neutral-800 px-4 py-2.5 text-neutral-100 outline-none focus:border-amber-400"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 cursor-pointer rounded-lg bg-amber-500 py-2.5 font-medium text-neutral-950 hover:bg-amber-400 disabled:opacity-50"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer rounded-lg border border-white/10 py-2.5 text-neutral-300 hover:bg-white/5"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
