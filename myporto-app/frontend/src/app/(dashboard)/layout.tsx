'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  User, GraduationCap, Briefcase, Award, Palette,
  CreditCard, LogOut, Eye, LayoutDashboard, Globe,
  FileText, Mail, Settings,
} from '@/components/ui/icons';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { cn, getPortfolioUrl, getPortfolioFullUrl } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
  { href: '/dashboard/profile', label: 'Profil', icon: User, color: 'text-violet-500' },
  { href: '/dashboard/education', label: 'Pendidikan', icon: GraduationCap, color: 'text-sky-500' },
  { href: '/dashboard/experience', label: 'Pengalaman', icon: Briefcase, color: 'text-emerald-500' },
  { href: '/dashboard/skills', label: 'Keahlian', icon: Award, color: 'text-amber-500' },
  { href: '/dashboard/appearance', label: 'Tampilan', icon: Palette, color: 'text-pink-500' },
  { href: '/dashboard/cv', label: 'Cetak CV', icon: FileText, color: 'text-cyan-500' },
  { href: '/dashboard/cover-letter', label: 'Surat Lamaran', icon: Mail, color: 'text-rose-500' },
  { href: '/dashboard/payment', label: 'Pembayaran', icon: CreditCard, color: 'text-orange-500' },
  { href: '/dashboard/publish', label: 'Publikasi', icon: Globe, color: 'text-green-500' },
  { href: '/dashboard/loker', label: 'Info Loker', icon: Briefcase, color: 'text-rose-500' },
  { href: '/dashboard/settings', label: 'Pengaturan Akun', icon: Settings, color: 'text-slate-400' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setToken, setLoading, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('myporto_token');
    if (!token) { router.push('/login'); return; }
    api.get('/auth/me')
      .then((res) => { setUser(res.data.user); setToken(token); })
      .catch(() => { logout(); router.push('/login'); })
      .finally(() => setLoading(false));
  }, [router, setUser, setToken, setLoading, logout]);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col fixed h-full z-30 shadow-xl">
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-white text-lg">MyPorto</span>
          </Link>
        </div>

        {/* User card */}
        {user && (
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 shadow">
                {user.profile?.foto_closeup ? (
                  <img src={user.profile.foto_closeup} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {user.profile?.nama_lengkap?.charAt(0) || user.username.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user.profile?.nama_lengkap || user.username}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.username}.myporto.id</p>
              </div>
            </div>

            {/* Status pill */}
            <div className={`mt-3 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit ${
              user.is_paid && user.paid_until && new Date() <= new Date(user.paid_until)
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : user.is_paid
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                user.is_paid && user.paid_until && new Date() <= new Date(user.paid_until)
                  ? 'bg-green-400' : user.is_paid ? 'bg-red-400' : 'bg-amber-400'
              }`} />
              {user.is_paid && user.paid_until && new Date() <= new Date(user.paid_until)
                ? `Aktif s/d ${new Date(user.paid_until).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
                : user.is_paid ? 'Expired' : 'Draft'
              }
            </div>

            {user.is_paid && (
              <a href={getPortfolioUrl(user.username)} target="_blank" rel="noopener noreferrer"
                className="mt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300">
                <Eye className="w-3 h-3" /> Lihat Portofolio
              </a>
            )}
          </div>
        )}

      {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isPublish = item.href === '/dashboard/publish';
            const isCvOrLetter = item.href === '/dashboard/cv' || item.href === '/dashboard/cover-letter';
            // Terkunci jika belum bayar ATAU sudah expired
            const isExpired = user?.paid_until ? new Date() > new Date(user.paid_until) : !user?.is_paid;
            const isLocked = (isPublish || isCvOrLetter) && isExpired;
            return (
              <Link key={item.href} href={isLocked ? '/dashboard/payment' : item.href}
                title={isLocked ? 'Aktifkan akun terlebih dahulu' : item.label}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  isActive
                    ? 'bg-white/15 text-white'
                    : 'text-slate-400 hover:bg-white/10 hover:text-white',
                  isLocked && 'opacity-50'
                )}>
                <item.icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-white' : item.color)} />
                <span className="truncate">{item.label}</span>
                {isLocked && <span className="ml-auto text-xs">🔒</span>}
                {isActive && !isLocked && <span className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-700">
          <button onClick={() => { logout(); router.push('/login'); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/15 hover:text-red-400 w-full transition-all">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 ml-72 flex flex-col min-h-screen">
        <main className="flex-1 p-8">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white px-8 py-3 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} <strong className="text-gray-600">MyPorto</strong> — Platform Portofolio Digital Indonesia</span>
          <span className="hidden sm:block">v1.0.0</span>
        </footer>
      </div>
    </div>
  );
}
