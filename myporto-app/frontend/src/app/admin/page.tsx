'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, CreditCard, TrendingUp, UserCheck, Bell } from '@/components/ui/icons';
import api from '@/lib/api';

interface Stats {
  totalUsers: number;
  activeUsers: number;
  paidUsers: number;
  totalRevenue: number;
  successfulPayments: number;
  pendingPayments: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/admin/stats').then((res) => setStats(res.data.stats));
  }, []);

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitoring platform MyPorto</p>
      </div>

      {/* Alert pending */}
      {stats && stats.pendingPayments > 0 && (
        <Link href="/admin/payments?status=PENDING"
          className="flex items-center gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 hover:bg-amber-100 transition-colors">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800">
              {stats.pendingPayments} pembayaran menunggu konfirmasi
            </p>
            <p className="text-xs text-amber-600">Klik untuk lihat dan konfirmasi</p>
          </div>
          <span className="ml-auto bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            {stats.pendingPayments}
          </span>
        </Link>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Pengguna', value: stats?.totalUsers ?? '-', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600', border: 'border-blue-100' },
          { label: 'Pengguna Aktif', value: stats?.activeUsers ?? '-', icon: UserCheck, bg: 'bg-green-50', color: 'text-green-600', border: 'border-green-100' },
          { label: 'Akun Berbayar', value: stats?.paidUsers ?? '-', icon: CreditCard, bg: 'bg-violet-50', color: 'text-violet-600', border: 'border-violet-100' },
          {
            label: 'Total Pendapatan',
            value: stats ? `Rp ${Number(stats.totalRevenue).toLocaleString('id-ID')}` : '-',
            icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600', border: 'border-amber-100',
          },
        ].map((card) => (
          <div key={card.label} className={`bg-white rounded-2xl border ${card.border} p-5`}>
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { href: '/admin/payments', label: 'Kelola Pembayaran', desc: 'Konfirmasi bukti transfer QRIS', emoji: '💳', color: 'border-green-200 hover:border-green-400 hover:bg-green-50' },
          { href: '/admin/users', label: 'Kelola Pengguna', desc: 'Aktifkan, nonaktifkan, atau hapus akun', emoji: '👥', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50' },
          { href: '/admin/settings', label: 'Pengaturan', desc: 'Upload QRIS & konfigurasi notifikasi WA', emoji: '⚙️', color: 'border-amber-200 hover:border-amber-400 hover:bg-amber-50' },
        ].map((item) => (
          <Link key={item.href} href={item.href}
            className={`bg-white rounded-2xl border-2 p-5 transition-all ${item.color}`}>
            <p className="text-2xl mb-2">{item.emoji}</p>
            <p className="font-semibold text-gray-900">{item.label}</p>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>

      {/* Akun admin info */}
      <div className="mt-8 bg-slate-800 rounded-2xl p-5 text-white">
        <p className="text-sm font-semibold text-slate-300 mb-2">🔐 Info Akun Admin</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-slate-400">Email:</span> <span className="font-mono">admin@myporto.id</span></div>
          <div><span className="text-slate-400">Password:</span> <span className="font-mono">Admin@123456</span></div>
        </div>
        <p className="text-xs text-slate-500 mt-2">Ganti password setelah login pertama kali</p>
      </div>
    </div>
  );
}
