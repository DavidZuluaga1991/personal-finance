'use client';

import { Home, BarChart3, CreditCard, Settings, User, LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/store/slices/authSlice';
import { useLogout } from '@/features/auth/hooks/useLogout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = 'dashboard' | 'analytics' | 'accounts' | 'settings';

interface NavItemConfig {
  id: NavItem;
  label: string;
  icon: typeof Home;
  href: string;
}

const navItems: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/dashboard' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, href: '/analytics' },
  { id: 'accounts', label: 'Accounts', icon: CreditCard, href: '/accounts' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const pathname = usePathname();

  const getActiveNav = (): NavItem => {
    if (pathname?.startsWith('/dashboard')) return 'dashboard';
    if (pathname?.startsWith('/analytics')) return 'analytics';
    if (pathname?.startsWith('/accounts')) return 'accounts';
    if (pathname?.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeNav = getActiveNav();

  return (
    <aside className="dashboard-gradient sidebar-backdrop fixed left-0 top-0 h-screen w-64 border-r border-slate-900/80 flex flex-col z-50">
      <div className="px-6 py-6 border-b border-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
            P
          </div>
          <h1 className="text-lg font-bold text-white">FinanceTracker</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeNav === item.id;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/40'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-800/30'
              }`}
            >
              <IconComponent size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-6 border-t border-slate-900/50 space-y-4">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-slate-800/30">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600/20 border border-blue-600/40">
            <User size={16} className="text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-slate-400 truncate">{user?.email || ''}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-slate-800/30 hover:bg-slate-800/60 transition-colors text-slate-300 hover:text-white text-sm font-medium cursor-pointer"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

