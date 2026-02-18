import { useState } from 'react';
import { login, register } from '../api/client';
import { useAuth } from '../context/AuthContext';

export function LoginForm() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { login: doLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const data = await login(username, password);
        doLogin(data.access_token, data.username || username);
        setSuccess('Login successful!');
      } else {
        await register(username, password);
        setSuccess('Account created! Switch to Login.');
        setPassword('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-slate-900/60 rounded-2xl border border-slate-700/50 shadow-xl">
      <h2 className="text-2xl font-semibold text-white mb-6">
        {mode === 'login' ? 'Welcome back' : 'Create account'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter username"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-slate-400 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            placeholder="Enter password"
            required
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-emerald-400 text-sm">{success}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Register'}
        </button>
      </form>
      <p className="mt-4 text-center text-slate-400 text-sm">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          type="button"
          onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess(''); }}
          className="text-sky-400 hover:text-sky-300 font-medium"
        >
          {mode === 'login' ? 'Register' : 'Log in'}
        </button>
      </p>
    </div>
  );
}
