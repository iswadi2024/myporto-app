'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, LogOut, Settings } from '@/components/ui/icons';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-400' },
  { href: '/admin/payments', label: 'Pembayaran', icon: CreditCard, color: 'text-green-400' },
  { href: '/admin/users', label: 'Pengguna', icon: Users, color: 'text-violet-400' },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings, color: 'text-amber-400' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setToken, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('myporto_token');
    if (!token) { router.push('/login'); return; }
    api.get('/auth/me').then((res) => {
      if (res.data.user.role !== 'ADMIN') { router.push('/dashboard'); return; }
      setUser(res.data.user);
      setToken(token);
    }).catch(() => { logout(); router.push('/login'); });
  }, [router, setUser, setToken, logout]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col fixed h-full shadow-xl z-30">
        {/* Logo */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <div>
              <p className="font-bold text-white text-sm leading-none">MyPorto</p>
              <p className="text-xs text-slate-400 mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Admin info */}
        {user && (
          <div className="px-4 py-3 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-xs">
                  {user.profile?.nama_lengkap?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{user.profile?.nama_lengkap || 'Admin'}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive ? 'bg-white/15 text-white' : 'text-slate-400 hover:bg-white/10 hover:text-white'
                )}>
                <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : item.color)} />
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700">
          <button onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 w-full transition-all">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56">{children}</main>
    </div>
  );
}
