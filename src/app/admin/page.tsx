'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('admin_token', data.token);
      router.push('/admin/dashboard');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-[#1C304A] flex items-center justify-center px-4">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7DD3FC] to-[#7C3AED] flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-black text-3xl">N</span>
              </div>
              <h1 className="text-2xl font-bold text-white uppercase tracking-wider">
                Admin Panel
              </h1>
              <p className="text-white/50 text-sm mt-2">Sign in to manage your portfolio</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7DD3FC] focus:ring-2 focus:ring-[#7DD3FC]/20 transition-all text-sm"
                  placeholder="Enter username"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-white/80 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#7DD3FC] focus:ring-2 focus:ring-[#7DD3FC]/20 transition-all text-sm"
                  placeholder="Enter password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1E3A8A] text-white font-bold text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_20px_rgba(30,58,138,0.3)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
}
