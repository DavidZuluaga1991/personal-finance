'use client';

import { useState, useTransition } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const login = useLogin();
  const { showSuccess, showError } = useToast();
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
        showSuccess('Login successful', 'Welcome back!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error de login';
        setError(errorMessage);
        showError('Login failed', errorMessage);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-white">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-12 lg:flex-row lg:gap-20 lg:items-center max-w-7xl mx-auto w-full">
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto lg:mx-0 mb-12 lg:mb-0">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
              <span className="text-2xl font-bold text-white">P</span>
            </div>
            <span className="text-xl font-semibold">FinanceTracker</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Take control of your{' '}
            <span className="text-blue-400">financial future</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mb-6 sm:mb-8">
            Manage your income and expenses with ease. Track your spending,
            set budgets, and achieve your financial goals.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <span className="text-sm font-medium">+24% Avg. savings increase</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-sm font-medium">10K+ Active users</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center items-center max-w-md mx-auto lg:mx-0">
          <div className="w-full bg-slate-900/70 backdrop-blur-lg border border-slate-700/60 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 text-white">Welcome back</h2>
            <p className="text-sm sm:text-base text-slate-400 mb-4 sm:mb-6">Sign in to your account</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="pl-10 bg-slate-950/80 border-slate-700/60 text-white placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-400 cursor-pointer"
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
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 hover:shadow-md hover:shadow-blue-500/30"
              >
                {isPending ? 'Loading...' : 'Sign in'}
              </Button>

              <p className="text-xs text-center text-slate-500 mt-4">
                Demo: admin@test.com / 123456
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

