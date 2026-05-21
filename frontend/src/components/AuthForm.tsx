import React, { useEffect, useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import { authService } from '../services/api';
import { useAuthStore } from '../store/authStore';

const REMEMBER_EMAIL_KEY = 'collegeguide_remember_email';
const REMEMBER_FLAG_KEY = 'collegeguide_remember_me';

interface AuthFormProps {
  isSignup?: boolean;
  onSuccess: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isSignup = false, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_EMAIL_KEY);
      const flag = localStorage.getItem(REMEMBER_FLAG_KEY);
      if (saved && flag === '1') {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = isSignup
        ? await authService.signup(email, password, name)
        : await authService.login(email, password);

      login(response.data.user, response.data.token);
      try {
        if (rememberMe) {
          localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
          localStorage.setItem(REMEMBER_FLAG_KEY, '1');
        } else {
          localStorage.removeItem(REMEMBER_EMAIL_KEY);
          localStorage.removeItem(REMEMBER_FLAG_KEY);
        }
      } catch {
        /* ignore */
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 glass-effect rounded-3xl">
      <h2 className="text-3xl gradient-text font-bold mb-8 text-center">
        {isSignup ? 'Create Account' : 'Welcome Back'}
      </h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
        {isSignup && (
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              name="name"
              id="auth-full-name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>
        )}

        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            name="email"
            id="auth-email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="password"
            name="password"
            id="auth-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {!isSignup && (
          <label className="flex items-center gap-3 text-base font-semibold text-gray-900 cursor-pointer select-none bg-gradient-to-r from-emerald-50 to-cyan-50 p-3 rounded-lg hover:bg-emerald-100 transition-colors">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded border-2 border-gray-400 text-emerald-600 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            />
            <span>Remember email on this device</span>
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50"
        >
          {loading ? 'Loading...' : isSignup ? 'Sign Up' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
