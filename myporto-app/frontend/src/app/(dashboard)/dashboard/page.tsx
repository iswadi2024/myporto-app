'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, GraduationCap, Briefcase, Award, Palette, CreditCard, ExternalLink } from '@/components/ui/icons';
import { useAuthStore } from '@/lib/store';
import { getPortfolioUrl } from '@/lib/utils';
import api from '@/lib/api';

interface DashboardStats {
  education: number;
  experience: number;
  skills: number;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({ education: 0, experience: 0, skills: 0 });

  useEffect(() => {
    Promise.all([
      api.get('/education'),
      api.get('/experience'),
      api.get('/skills'),
    ]).then(([edu, exp, skills]) => {
      setStats({
        education: edu.data.education.length,
        experience: exp.data.experience.length,
        skills: skills.data.skills.length,
      });
    }).catch(console.error);
  }, []);

  const completionItems = [
    { label: 'Profil Dasar', done: !!user?.profile?.bio_singkat, href: '/dashboard/profile' },
    { label: 'Foto Profil', done: !!user?.profile?.foto_closeup, href: '/dashboard/profile' },
    { label: 'Riwayat Pendidikan', done: stats.education > 0, href: '/dashboard/education' },
    { label: 'Pengalaman Kerja', done: stats.experience > 0, href: '/dashboard/experience' },
    { label: 'Keahlian', done: stats.skills > 0, href: '/dashboard/skills' },
    { label: 'Kontak & Sosmed', done: !!user?.profile?.no_whatsapp, href: '/dashboard/profile' },
  ];

  const completionPercent = Math.round(
    (completionItems.filter((i) => i.done).length / completionItems.length) * 100
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Selamat datang, {user?.profile?.nama_lengkap || user?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Kelola dan lengkapi portofolio digital Anda</p>
      </div>

      {/* Status Banner */}
      {!user?.is_paid ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-amber-800">Portofolio Anda masih berstatus Draft</p>
            <p className="text-sm text-amber-700 mt-1">
              Aktifkan sekarang untuk mendapatkan link publik yang bisa dibagikan ke siapa saja.
            </p>
          </div>
          <Link
            href="/dashboard/payment"
            className="bg-amber-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-amber-600 whitespace-nowrap ml-4"
          >
            Aktifkan — Rp 99.000
          </Link>
        </div>
      ) : (
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-green-800">✓ Portofolio Anda sudah aktif!</p>
            <p className="text-sm text-green-700 mt-1">
              Link publik Anda:{' '}
              <span className="font-medium">{getPortfolioUrl(user?.username || '')}</span>
            </p>
          </div>
          <a
            href={getPortfolioUrl(user?.username || '')}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700"
          >
            <ExternalLink className="w-4 h-4" />
            Buka Portofolio
          </a>
        </div>
      )}

      {/* Completion Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Kelengkapan Profil</h2>
          <span className="text-2xl font-bold text-blue-600">{completionPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {completionItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
            >
              <span className={item.done ? 'text-green-500' : 'text-gray-300'}>
                {item.done ? '✓' : '○'}
              </span>
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pendidikan', value: stats.education, icon: GraduationCap, href: '/dashboard/education', color: 'blue' },
          { label: 'Pengalaman', value: stats.experience, icon: Briefcase, href: '/dashboard/experience', color: 'green' },
          { label: 'Keahlian', value: stats.skills, icon: Award, href: '/dashboard/skills', color: 'purple' },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Edit Profil', icon: User, href: '/dashboard/profile' },
            { label: 'Tambah Pendidikan', icon: GraduationCap, href: '/dashboard/education' },
            { label: 'Tambah Pengalaman', icon: Briefcase, href: '/dashboard/experience' },
            { label: 'Ubah Tampilan', icon: Palette, href: '/dashboard/appearance' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-center"
            >
              <action.icon className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-medium text-gray-700">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
