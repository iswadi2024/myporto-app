'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { Globe, ExternalLink, Eye, CheckCircle, User, GraduationCap, Briefcase, Award } from '@/components/ui/icons';
import api from '@/lib/api';

export default function PublishPage() {
  const { user } = useAuthStore();
  const [origin, setOrigin] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ education: 0, experience: 0, skills: 0 });

  useEffect(() => {
    setOrigin(window.location.origin);
    if (user?.is_paid) {
      Promise.all([
        api.get('/education'),
        api.get('/experience'),
        api.get('/skills'),
      ]).then(([edu, exp, sk]) => {
        setStats({
          education: edu.data.education?.length || 0,
          experience: exp.data.experience?.length || 0,
          skills: sk.data.skills?.length || 0,
        });
      }).catch(() => {});
    }
  }, [user]);

  const portfolioPath = `/p/${user?.username}`;
  const portfolioFullUrl = origin ? `${origin}/p/${user?.username}` : portfolioPath;

  const handleCopy = () => {
    navigator.clipboard.writeText(portfolioFullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Belum aktif ──────────────────────────────────────────────
  if (!user?.is_paid) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="max-w-lg w-full text-center">
          {/* Ilustrasi */}
          <div className="relative mx-auto w-40 h-40 mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full opacity-20 animate-pulse" />
            <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full opacity-30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Globe className="w-16 h-16 text-blue-500" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">Portofolio Belum Aktif</h1>
          <p className="text-gray-500 mb-2">
            Aktifkan portofolio Anda untuk mendapatkan link publik yang bisa dibagikan ke siapa saja.
          </p>
          <p className="text-blue-600 font-mono text-sm mb-8 bg-blue-50 px-4 py-2 rounded-xl inline-block">
            {origin}/p/{user?.username}
          </p>

          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            {[
              { icon: '🌐', label: 'Link Publik' },
              { icon: '🔍', label: 'SEO Otomatis' },
              { icon: '📱', label: 'Mobile Friendly' },
            ].map(f => (
              <div key={f.label} className="bg-white border border-gray-200 rounded-2xl p-4">
                <div className="text-2xl mb-1">{f.icon}</div>
                <p className="text-xs font-medium text-gray-600">{f.label}</p>
              </div>
            ))}
          </div>

          <Link href="/dashboard/payment"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-200">
            🚀 Aktifkan Sekarang — Rp 99.000
          </Link>
          <p className="text-xs text-gray-400 mt-3">Bayar sekali, aktif selamanya</p>
        </div>
      </div>
    );
  }

  // ── Sudah aktif ──────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 text-white">
        {/* Dekorasi background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="flex items-center gap-1.5 bg-green-400/20 text-green-300 border border-green-400/30 px-3 py-1 rounded-full text-xs font-semibold">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  LIVE & AKTIF
                </span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Portofolio Anda Sudah Online! 🎉</h1>
              <p className="text-blue-200 text-sm max-w-md">
                Portofolio digital Anda dapat diakses oleh siapa saja di seluruh dunia.
              </p>
            </div>

            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-white/20 border-2 border-white/30 overflow-hidden flex items-center justify-center">
                {user.profile?.foto_closeup ? (
                  <img src={user.profile.foto_closeup} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-white">
                    {(user.profile?.nama_lengkap || user.username).charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* URL bar */}
          <div className="mt-6 flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Globe className="w-4 h-4 text-blue-200 flex-shrink-0" />
              <span className="font-mono text-sm text-white truncate">{portfolioFullUrl}</span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  copied ? 'bg-green-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}>
                {copied ? '✓ Tersalin!' : 'Salin Link'}
              </button>
              <a href={portfolioPath} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-white text-blue-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
                Buka
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats portofolio */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { icon: User, label: 'Profil', value: user.profile?.nama_lengkap ? 'Lengkap' : 'Belum', color: 'from-violet-500 to-purple-600', bg: 'bg-violet-50', text: 'text-violet-600' },
          { icon: GraduationCap, label: 'Pendidikan', value: `${stats.education} data`, color: 'from-sky-500 to-blue-600', bg: 'bg-sky-50', text: 'text-sky-600' },
          { icon: Briefcase, label: 'Pengalaman', value: `${stats.experience} data`, color: 'from-emerald-500 to-green-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { icon: Award, label: 'Keahlian', value: `${stats.skills} data`, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-lg font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Preview + Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Preview iframe */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-1 text-xs text-gray-500 font-mono truncate">
              {portfolioFullUrl}
            </div>
            <Eye className="w-4 h-4 text-gray-400" />
          </div>
          <div style={{ height: '420px' }}>
            {origin && (
              <iframe src={portfolioPath} className="w-full h-full border-0" title="Preview Portofolio" />
            )}
          </div>
        </div>

        {/* Tips & Share */}
        <div className="space-y-4">
          {/* Share buttons */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-lg">📤</span> Bagikan Sekarang
            </h3>
            <div className="space-y-2">
              <a href={`https://wa.me/?text=${encodeURIComponent(`Lihat portofolio digital saya: ${portfolioFullUrl}`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                <span className="text-xl">💬</span> Bagikan via WhatsApp
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(portfolioFullUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                <span className="text-xl">💼</span> Bagikan ke LinkedIn
              </a>
              <button onClick={handleCopy}
                className="flex items-center gap-3 w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 px-4 py-3 rounded-xl text-sm font-medium transition-colors">
                <span className="text-xl">{copied ? '✅' : '🔗'}</span>
                {copied ? 'Link tersalin!' : 'Salin Link Portofolio'}
              </button>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-5">
            <h3 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span> Tips Maksimalkan
            </h3>
            <ul className="space-y-2.5">
              {[
                { icon: '📸', text: 'Upload foto profil yang profesional' },
                { icon: '✍️', text: 'Lengkapi bio singkat yang menarik' },
                { icon: '🏆', text: 'Tambahkan sertifikat dan pencapaian' },
                { icon: '🎨', text: 'Pilih tema yang sesuai kepribadian' },
                { icon: '📱', text: 'Cantumkan di bio Instagram & LinkedIn' },
              ].map((tip) => (
                <li key={tip.text} className="flex items-start gap-2 text-xs text-indigo-800">
                  <span className="flex-shrink-0">{tip.icon}</span>
                  {tip.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
