'use client';

import { useState, useTransition } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/error-message';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const login = useLogin();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await login(formData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error de login');
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 lg:flex-row lg:gap-16 lg:items-center">
        <div className="flex-1 flex flex-col justify-center max-w-lg mx-auto lg:mx-0">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-white/10 p-3 rounded-xl">
              <span className="text-2xl font-bold text-blue-400">P</span>
            </div>
            <span className="text-xl font-semibold">FinanceTracker</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Take control of your{' '}
            <span className="text-blue-400">financial future</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Manage your income and expenses with ease. Track your spending,
            set budgets, and achieve your financial goals.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-sm font-medium">+24% Avg. savings increase</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm font-medium">10K+ Active users</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 lg:p-10">
            <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
            <p className="text-gray-400 mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPass ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="pl-10 pr-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPass ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && <ErrorMessage message={error} />}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/40"
              >
                {isPending ? 'Loading...' : 'Sign in'}
              </Button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Demo: admin@test.com / 123456
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

