'use client';

import { LogOut, Menu } from 'lucide-react';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useLogout } from '@/features/auth/hooks/useLogout';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="dashboard-gradient sidebar-backdrop sticky top-0 z-40 border-b border-slate-900/80">
      <div className="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Botón hamburguesa solo en mobile */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <span className="hidden sm:inline text-sm text-slate-400">Welcome, {user?.name || 'User'}</span>
          <button
            onClick={logout}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white cursor-pointer"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}

