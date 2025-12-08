'use client';

import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useLogout } from '@/features/auth/hooks/useLogout';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="dashboard-gradient sidebar-backdrop sticky top-0 z-40 border-b border-slate-900/80">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">Welcome, {user?.name || 'User'}</span>
          <button
            onClick={logout}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

