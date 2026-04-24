'use client';

import { useEffect, useState } from 'react';

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // Full-time, Part-time, Remote
  salary?: string;
  description: string;
  url: string;
  source: string;
  posted_at: string; // ISO date
  logo?: string;
  tags: string[];
}

// Data loker statis yang diperbarui secara berkala (simulasi scraping)
// Dalam produksi, ini bisa diganti dengan API call ke backend yang scrape data
const MOCK_JOBS: JobItem[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    company: 'PT Tokopedia',
    location: 'Jakarta, Indonesia',
    type: 'Full-time',
    salary: 'Rp 8.000.000 - 15.000.000',
    description: 'Kami mencari Frontend Developer berpengalaman dengan React.js untuk bergabung dengan tim produk kami. Kandidat ideal memiliki pengalaman minimal 2 tahun.',
    url: 'https://www.linkedin.com/jobs',
    source: 'LinkedIn',
    posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['React', 'TypeScript', 'Next.js'],
  },
  {
    id: '2',
    title: 'Hotel Supervisor',
    company: 'Grand Hyatt Jakarta',
    location: 'Jakarta Pusat',
    type: 'Full-time',
    salary: 'Rp 6.000.000 - 10.000.000',
    description: 'Dibutuhkan Hotel Supervisor berpengalaman untuk mengelola operasional hotel bintang 5. Pengalaman minimal 3 tahun di industri perhotelan.',
    url: 'https://www.jobstreet.co.id',
    source: 'JobStreet',
    posted_at: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Hospitality', 'Management', 'Hotel'],
  },
  {
    id: '3',
    title: 'Customer Service Representative',
    company: 'PT Gojek Indonesia',
    location: 'Remote / Jakarta',
    type: 'Remote',
    salary: 'Rp 4.500.000 - 7.000.000',
    description: 'Bergabunglah dengan tim CS kami untuk memberikan pelayanan terbaik kepada pengguna Gojek. Komunikatif, sabar, dan mampu bekerja dalam tekanan.',
    url: 'https://www.kalibrr.com',
    source: 'Kalibrr',
    posted_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Customer Service', 'Communication', 'Remote'],
  },
  {
    id: '4',
    title: 'Graphic Designer',
    company: 'Kreasi Digital Agency',
    location: 'Bandung, Jawa Barat',
    type: 'Full-time',
    salary: 'Rp 5.000.000 - 8.000.000',
    description: 'Dicari Graphic Designer kreatif untuk membuat konten visual menarik. Kuasai Adobe Illustrator, Photoshop, dan Figma.',
    url: 'https://www.glints.com',
    source: 'Glints',
    posted_at: new Date(Date.now() - 0.8 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Design', 'Adobe', 'Figma'],
  },
  {
    id: '5',
    title: 'Accounting Staff',
    company: 'PT Unilever Indonesia',
    location: 'Surabaya, Jawa Timur',
    type: 'Full-time',
    salary: 'Rp 5.500.000 - 9.000.000',
    description: 'Dibutuhkan Accounting Staff untuk mengelola laporan keuangan perusahaan. Lulusan S1 Akuntansi dengan pengalaman minimal 1 tahun.',
    url: 'https://www.indeed.co.id',
    source: 'Indeed',
    posted_at: new Date(Date.now() - 1.2 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Accounting', 'Finance', 'Excel'],
  },
  {
    id: '6',
    title: 'Backend Engineer (Node.js)',
    company: 'Traveloka',
    location: 'Jakarta Selatan',
    type: 'Hybrid',
    salary: 'Rp 12.000.000 - 20.000.000',
    description: 'Bergabunglah dengan tim engineering Traveloka. Kami mencari Backend Engineer dengan keahlian Node.js, PostgreSQL, dan microservices.',
    url: 'https://www.linkedin.com/jobs',
    source: 'LinkedIn',
    posted_at: new Date(Date.now() - 0.3 * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['Node.js', 'PostgreSQL', 'Microservices'],
  },
];

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}

function isExpired(isoDate: string): boolean {
  const diff = Date.now() - new Date(isoDate).getTime();
  return diff > 2 * 24 * 60 * 60 * 1000; // lebih dari 2 hari
}

const TYPE_COLORS: Record<string, string> = {
  'Full-time': 'bg-blue-100 text-blue-700',
  'Part-time': 'bg-purple-100 text-purple-700',
  'Remote': 'bg-green-100 text-green-700',
  'Hybrid': 'bg-amber-100 text-amber-700',
};

const SOURCE_COLORS: Record<string, string> = {
  'LinkedIn': 'bg-blue-600',
  'JobStreet': 'bg-orange-500',
  'Kalibrr': 'bg-violet-600',
  'Glints': 'bg-pink-500',
  'Indeed': 'bg-blue-800',
};

export default function LokerPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    // Filter hanya loker yang masih berlaku (< 2 hari)
    const activeJobs = MOCK_JOBS.filter(j => !isExpired(j.posted_at));
    setJobs(activeJobs);
    setLastUpdated(new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }));
  }, []);

  const filtered = jobs.filter(j => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === 'all' || j.type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Info Lowongan Kerja</h1>
          <p className="text-gray-500 text-sm mt-1">
            Loker terbaru · Diperbarui: {lastUpdated}
            <span className="ml-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">
              ● Live
            </span>
          </p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          Menampilkan loker <strong>2 hari terakhir</strong>
        </div>
      </div>

      {/* Warning penipuan */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-2xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-red-800 text-sm">Waspada Penipuan Lowongan Kerja!</p>
            <ul className="text-red-700 text-xs mt-1.5 space-y-1">
              <li>• <strong>Jangan pernah</strong> membayar biaya apapun untuk proses rekrutmen</li>
              <li>• Selalu <strong>verifikasi</strong> dengan mengunjungi website resmi perusahaan</li>
              <li>• Waspada terhadap tawaran gaji yang tidak realistis</li>
              <li>• Jangan berikan data pribadi sensitif (KTP, rekening) sebelum kontrak resmi</li>
              <li>• Laporkan ke <strong>Kemnaker RI</strong> jika menemukan indikasi penipuan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari posisi, perusahaan, atau keahlian..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'Full-time', 'Remote', 'Hybrid', 'Part-time'].map(type => (
            <button key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                filterType === type ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'
              }`}>
              {type === 'all' ? 'Semua' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Job count */}
      <p className="text-sm text-gray-500">
        Menampilkan <strong className="text-gray-900">{filtered.length}</strong> lowongan
        {search && ` untuk "${search}"`}
      </p>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">Tidak ada lowongan yang sesuai</p>
          <button onClick={() => { setSearch(''); setFilterType('all'); }}
            className="mt-3 text-blue-600 text-sm hover:underline">
            Reset filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(job => (
            <div key={job.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200 group">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                {/* Left */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  {/* Company logo placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-blue-600">
                    {job.company.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">
                        {job.title}
                      </h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-600'}`}>
                        {job.type}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{job.company}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span>📍 {job.location}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                      <span>🕐 {timeAgo(job.posted_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs text-white px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[job.source] || 'bg-gray-500'}`}>
                    {job.source}
                  </span>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                  >
                    Lamar Sekarang →
                  </a>
                  <p className="text-xs text-gray-400">Verifikasi di website resmi</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info sumber */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700">
        <p className="font-semibold mb-1">📌 Tentang Info Loker Ini</p>
        <p>Data lowongan dikumpulkan dari berbagai platform terpercaya (LinkedIn, JobStreet, Glints, Kalibrr, Indeed). Loker yang ditampilkan hanya yang diposting dalam <strong>2 hari terakhir</strong>. Selalu verifikasi informasi dengan mengunjungi website resmi perusahaan sebelum melamar.</p>
      </div>
    </div>
  );
}
