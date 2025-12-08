'use client';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { useAuthCheck } from '@/features/auth/hooks/useAuthCheck';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useAuthCheck();
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

