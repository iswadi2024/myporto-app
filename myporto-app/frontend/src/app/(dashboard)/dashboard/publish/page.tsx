'use client';

import { useAuthStore } from '@/lib/store';
import { getPortfolioUrl } from '@/lib/utils';
import Link from 'next/link';
import { Globe, ExternalLink, Eye } from '@/components/ui/icons';

export default function PublishPage() {
  const { user } = useAuthStore();

  if (!user?.is_paid) {
    return (
      <div className="p-8">
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
      </div>
    );
  }

  const portfolioUrl = getPortfolioUrl(user.username);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Publikasi Portofolio</h1>
        <p className="text-gray-500 mt-1">Portofolio Anda sudah aktif dan dapat diakses publik</p>
      </div>

      <div className="max-w-2xl space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Globe className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-green-800">Portofolio Aktif!</p>
              <p className="text-sm text-green-600">Dapat diakses oleh siapa saja</p>
            </div>
          </div>

          <div className="bg-white border border-green-200 rounded-xl p-4 flex items-center justify-between gap-3">
            <p className="font-mono text-sm text-blue-600 font-medium truncate">{portfolioUrl}</p>
            <a href={portfolioUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 whitespace-nowrap flex-shrink-0">
              <ExternalLink className="w-4 h-4" />
              Buka
            </a>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Tips Berbagi Portofolio
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            {[
              'Tambahkan link portofolio di bio Instagram dan LinkedIn Anda',
              'Cantumkan di CV dan email signature',
              'Bagikan ke grup alumni atau komunitas profesional',
              'Gunakan sebagai pengganti kartu nama digital',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
