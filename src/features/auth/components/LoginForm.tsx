'use client';

import { useState, useTransition } from 'react';
import { useLogin } from '../hooks/useLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage } from '@/components/ui/error-message';
import { useToast } from '@/contexts/ToastContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import {
  PageWrapper,
  Container,
  LeftSection,
  Brand,
  BrandIcon,
  Title,
  Description,
  Stats,
  StatItem,
  RightSection,
  Card,
  TextDemo
} from "./LoginForm.styles";

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
        const errorMessage = err instanceof Error ? err.message : 'Login error';
        setError(errorMessage);
        showError('Login failed', errorMessage);
      }
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <PageWrapper>
      <Container>
        
        <LeftSection>
          <Brand>
            <BrandIcon>
              <span>P</span>
            </BrandIcon>
            <span className="text-xl font-semibold">FinanceTracker</span>
          </Brand>

          <Title>
            Take control of your <span>financial future</span>
          </Title>

          <Description>
            Manage your income and expenses with ease. Track your spending, set
            budgets, and achieve your financial goals.
          </Description>

          <Stats>
            <StatItem color="#4ade80">
              <span>+24% Avg. savings increase</span>
            </StatItem>

            <StatItem>
              <span>10K+ Active users</span>
            </StatItem>
          </Stats>
        </LeftSection>

        <RightSection>
          <Card>
            <h2>Welcome back</h2>
            <p>Sign in to your account</p>
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
                    type={showPass ? "text" : "password"}
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
                {isPending ? "Loading..." : "Sign in"}
              </Button>
              <TextDemo>

                Demo: admin@test.com / 123456
              </TextDemo>
            </form>
          </Card>
        </RightSection>
      </Container>
    </PageWrapper>
  );
}

