'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import Link from 'next/link';
import { Globe, ExternalLink, Eye, CheckCircle } from '@/components/ui/icons';

export default function PublishPage() {
  const { user } = useAuthStore();
  const [origin, setOrigin] = useState('');

  useEffect(() => {
    // Ambil domain dari window — otomatis sesuai Vercel/localhost
    setOrigin(window.location.origin);
  }, []);

  const portfolioPath = `/p/${user?.username}`;
  const portfolioFullUrl = origin ? `${origin}/p/${user?.username}` : portfolioPath;

  if (!user?.is_paid) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Aktifkan Portofolio Anda</h1>
        <p className="text-gray-500 mb-6">
          Portofolio Anda masih berstatus <strong>Draft</strong>. Lakukan pembayaran aktivasi untuk mendapatkan link publik.
        </p>
        <Link href="/dashboard/payment"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Aktifkan Sekarang — Rp 99.000
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Publikasi Portofolio</h1>
        <p className="text-gray-500 mt-1">Portofolio Anda sudah aktif dan dapat diakses publik</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Status aktif */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Portofolio Aktif!</p>
              <p className="text-sm text-green-600">Dapat diakses oleh siapa saja</p>
            </div>
          </div>

          {/* Link box */}
          <div className="bg-white border border-green-200 rounded-xl p-4 flex items-center justify-between gap-3 mb-3">
            <p className="font-mono text-sm text-blue-600 font-medium truncate">{portfolioFullUrl}</p>
            <a href={portfolioPath} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap flex-shrink-0">
              <ExternalLink className="w-4 h-4" />
              Buka
            </a>
          </div>
          <p className="text-xs text-green-600">
            💡 Link ini menggunakan domain Vercel Anda. Untuk subdomain personal (nama.myporto.id), diperlukan konfigurasi DNS khusus.
          </p>
        </div>

        {/* Preview iframe */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Preview Portofolio
          </h2>
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50" style={{ height: '420px' }}>
            {origin && (
              <iframe src={portfolioPath} className="w-full h-full" title="Preview Portofolio" />
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">Preview langsung portofolio Anda</p>
        </div>

        {/* Tips */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tips Berbagi Portofolio</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              'Tambahkan link portofolio di bio Instagram dan LinkedIn Anda',
              'Cantumkan di CV dan email signature',
              'Bagikan ke grup alumni atau komunitas profesional',
              'Gunakan sebagai pengganti kartu nama digital',
              'Share di WhatsApp Story atau status media sosial',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
