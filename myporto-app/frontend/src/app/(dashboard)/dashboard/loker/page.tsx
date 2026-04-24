'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  city: string; // kota utama untuk filter
  type: string;
  salary?: string;
  description: string;
  url: string;
  source: string;
  posted_at: string;
  tags: string[];
}

// Database loker per kota — mudah diperluas
const ALL_JOBS: JobItem[] = [
  // ── MEDAN ──
  { id: 'm1', title: 'Hotel Supervisor', company: 'Grand Mercure Medan', location: 'Medan, Sumatera Utara', city: 'Medan', type: 'Full-time', salary: 'Rp 5.000.000 - 8.000.000', description: 'Dibutuhkan Hotel Supervisor berpengalaman untuk mengelola operasional hotel bintang 4 di Medan. Pengalaman minimal 2 tahun di industri perhotelan.', url: 'https://www.jobstreet.co.id', source: 'JobStreet', posted_at: new Date(Date.now() - 0.5 * 86400000).toISOString(), tags: ['Hospitality', 'Hotel', 'Management'] },
  { id: 'm2', title: 'Customer Service', company: 'Bank Sumut', location: 'Medan, Sumatera Utara', city: 'Medan', type: 'Full-time', salary: 'Rp 4.000.000 - 6.000.000', description: 'Bank Sumut membuka lowongan Customer Service untuk kantor cabang Medan. Komunikatif, berpenampilan menarik, dan berorientasi pelayanan.', url: 'https://www.glints.com', source: 'Glints', posted_at: new Date(Date.now() - 1 * 86400000).toISOString(), tags: ['Banking', 'Customer Service', 'Komunikasi'] },
  { id: 'm3', title: 'Accounting Staff', company: 'PT Perkebunan Nusantara IV', location: 'Medan, Sumatera Utara', city: 'Medan', type: 'Full-time', salary: 'Rp 5.500.000 - 8.000.000', description: 'PTPN IV membuka lowongan Accounting Staff. Lulusan S1 Akuntansi, pengalaman minimal 1 tahun, menguasai SAP.', url: 'https://www.indeed.co.id', source: 'Indeed', posted_at: new Date(Date.now() - 1.5 * 86400000).toISOString(), tags: ['Accounting', 'SAP', 'Finance'] },
  { id: 'm4', title: 'Marketing Executive', company: 'Tiara Convention Center', location: 'Medan, Sumatera Utara', city: 'Medan', type: 'Full-time', salary: 'Rp 4.500.000 - 7.000.000', description: 'Dicari Marketing Executive untuk memasarkan venue dan event di Medan. Target-oriented dan memiliki jaringan bisnis yang luas.', url: 'https://www.kalibrr.com', source: 'Kalibrr', posted_at: new Date(Date.now() - 0.8 * 86400000).toISOString(), tags: ['Marketing', 'Event', 'Sales'] },
  { id: 'm5', title: 'Front Office Staff', company: 'Aryaduta Hotel Medan', location: 'Medan, Sumatera Utara', city: 'Medan', type: 'Full-time', salary: 'Rp 3.500.000 - 5.500.000', description: 'Aryaduta Hotel Medan mencari Front Office Staff yang ramah dan profesional. Pengalaman di bidang perhotelan lebih diutamakan.', url: 'https://www.linkedin.com/jobs', source: 'LinkedIn', posted_at: new Date(Date.now() - 0.3 * 86400000).toISOString(), tags: ['Front Office', 'Hotel', 'Hospitality'] },

  // ── JAKARTA ──
  { id: 'j1', title: 'Frontend Developer', company: 'PT Tokopedia', location: 'Jakarta Selatan', city: 'Jakarta', type: 'Full-time', salary: 'Rp 8.000.000 - 15.000.000', description: 'Kami mencari Frontend Developer berpengalaman dengan React.js. Kandidat ideal memiliki pengalaman minimal 2 tahun.', url: 'https://www.linkedin.com/jobs', source: 'LinkedIn', posted_at: new Date(Date.now() - 1 * 86400000).toISOString(), tags: ['React', 'TypeScript', 'Next.js'] },
  { id: 'j2', title: 'Backend Engineer', company: 'Traveloka', location: 'Jakarta Selatan', city: 'Jakarta', type: 'Hybrid', salary: 'Rp 12.000.000 - 20.000.000', description: 'Bergabunglah dengan tim engineering Traveloka. Kami mencari Backend Engineer dengan keahlian Node.js dan microservices.', url: 'https://www.linkedin.com/jobs', source: 'LinkedIn', posted_at: new Date(Date.now() - 0.3 * 86400000).toISOString(), tags: ['Node.js', 'PostgreSQL', 'Microservices'] },
  { id: 'j3', title: 'Customer Service', company: 'PT Gojek Indonesia', location: 'Jakarta / Remote', city: 'Jakarta', type: 'Remote', salary: 'Rp 4.500.000 - 7.000.000', description: 'Bergabunglah dengan tim CS Gojek. Komunikatif, sabar, dan mampu bekerja dalam tekanan.', url: 'https://www.kalibrr.com', source: 'Kalibrr', posted_at: new Date(Date.now() - 1.5 * 86400000).toISOString(), tags: ['Customer Service', 'Remote', 'Communication'] },

  // ── BANDUNG ──
  { id: 'b1', title: 'Graphic Designer', company: 'Kreasi Digital Agency', location: 'Bandung, Jawa Barat', city: 'Bandung', type: 'Full-time', salary: 'Rp 5.000.000 - 8.000.000', description: 'Dicari Graphic Designer kreatif untuk membuat konten visual menarik. Kuasai Adobe Illustrator, Photoshop, dan Figma.', url: 'https://www.glints.com', source: 'Glints', posted_at: new Date(Date.now() - 0.8 * 86400000).toISOString(), tags: ['Design', 'Adobe', 'Figma'] },
  { id: 'b2', title: 'Software Engineer', company: 'Bukalapak', location: 'Bandung, Jawa Barat', city: 'Bandung', type: 'Hybrid', salary: 'Rp 10.000.000 - 18.000.000', description: 'Bukalapak mencari Software Engineer untuk tim platform. Pengalaman dengan Go atau Python lebih diutamakan.', url: 'https://www.linkedin.com/jobs', source: 'LinkedIn', posted_at: new Date(Date.now() - 1.2 * 86400000).toISOString(), tags: ['Go', 'Python', 'Backend'] },

  // ── SURABAYA ──
  { id: 's1', title: 'Accounting Staff', company: 'PT Unilever Indonesia', location: 'Surabaya, Jawa Timur', city: 'Surabaya', type: 'Full-time', salary: 'Rp 5.500.000 - 9.000.000', description: 'Dibutuhkan Accounting Staff untuk mengelola laporan keuangan. Lulusan S1 Akuntansi dengan pengalaman minimal 1 tahun.', url: 'https://www.indeed.co.id', source: 'Indeed', posted_at: new Date(Date.now() - 1.2 * 86400000).toISOString(), tags: ['Accounting', 'Finance', 'Excel'] },
  { id: 's2', title: 'Sales Manager', company: 'PT Semen Indonesia', location: 'Surabaya, Jawa Timur', city: 'Surabaya', type: 'Full-time', salary: 'Rp 8.000.000 - 14.000.000', description: 'Dicari Sales Manager berpengalaman untuk wilayah Jawa Timur. Target-oriented dengan track record penjualan yang baik.', url: 'https://www.jobstreet.co.id', source: 'JobStreet', posted_at: new Date(Date.now() - 0.6 * 86400000).toISOString(), tags: ['Sales', 'Management', 'B2B'] },

  // ── MAKASSAR ──
  { id: 'mk1', title: 'Hotel Manager', company: 'Claro Hotel Makassar', location: 'Makassar, Sulawesi Selatan', city: 'Makassar', type: 'Full-time', salary: 'Rp 8.000.000 - 15.000.000', description: 'Dibutuhkan Hotel Manager berpengalaman untuk mengelola operasional hotel bintang 4 di Makassar.', url: 'https://www.jobstreet.co.id', source: 'JobStreet', posted_at: new Date(Date.now() - 0.7 * 86400000).toISOString(), tags: ['Hotel', 'Management', 'Hospitality'] },
  { id: 'mk2', title: 'IT Support', company: 'Bank BRI Makassar', location: 'Makassar, Sulawesi Selatan', city: 'Makassar', type: 'Full-time', salary: 'Rp 4.000.000 - 6.500.000', description: 'Bank BRI cabang Makassar membuka lowongan IT Support. Menguasai troubleshooting hardware dan software.', url: 'https://www.glints.com', source: 'Glints', posted_at: new Date(Date.now() - 1.3 * 86400000).toISOString(), tags: ['IT Support', 'Networking', 'Banking'] },

  // ── YOGYAKARTA ──
  { id: 'y1', title: 'Tour Guide', company: 'Jogja Tour & Travel', location: 'Yogyakarta', city: 'Yogyakarta', type: 'Part-time', salary: 'Rp 3.000.000 - 5.000.000', description: 'Dicari Tour Guide berbahasa Inggris untuk wisatawan mancanegara di Yogyakarta. Menguasai sejarah dan budaya Jawa.', url: 'https://www.kalibrr.com', source: 'Kalibrr', posted_at: new Date(Date.now() - 0.4 * 86400000).toISOString(), tags: ['Tourism', 'English', 'Guide'] },
  { id: 'y2', title: 'Web Developer', company: 'Startup Jogja', location: 'Yogyakarta', city: 'Yogyakarta', type: 'Remote', salary: 'Rp 5.000.000 - 9.000.000', description: 'Startup teknologi di Yogyakarta mencari Web Developer full-stack. Pengalaman dengan Laravel dan Vue.js.', url: 'https://www.linkedin.com/jobs', source: 'LinkedIn', posted_at: new Date(Date.now() - 1.1 * 86400000).toISOString(), tags: ['Laravel', 'Vue.js', 'Full-stack'] },

  // ── REMOTE (semua kota) ──
  { id: 'r1', title: 'Content Writer', company: 'Media Digital Indonesia', location: 'Remote (Seluruh Indonesia)', city: 'Remote', type: 'Remote', salary: 'Rp 3.000.000 - 5.000.000', description: 'Dicari Content Writer untuk membuat artikel SEO-friendly. Bisa bekerja dari mana saja, deadline-oriented.', url: 'https://www.glints.com', source: 'Glints', posted_at: new Date(Date.now() - 0.9 * 86400000).toISOString(), tags: ['Writing', 'SEO', 'Content'] },
  { id: 'r2', title: 'Virtual Assistant', company: 'Global Services Co.', location: 'Remote (Seluruh Indonesia)', city: 'Remote', type: 'Remote', salary: 'Rp 4.000.000 - 7.000.000', description: 'Dibutuhkan Virtual Assistant untuk mendukung operasional bisnis. Menguasai Microsoft Office dan komunikasi profesional.', url: 'https://www.indeed.co.id', source: 'Indeed', posted_at: new Date(Date.now() - 1.4 * 86400000).toISOString(), tags: ['Admin', 'Remote', 'Office'] },
];

function timeAgo(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return 'Baru saja';
  if (hours < 24) return `${hours} jam lalu`;
  return `${Math.floor(hours / 24)} hari lalu`;
}

function isExpired(isoDate: string): boolean {
  return Date.now() - new Date(isoDate).getTime() > 2 * 86400000;
}

// Ekstrak nama kota dari alamat profil
function extractCity(alamat?: string): string {
  if (!alamat) return '';
  if (alamat.startsWith('http')) return '';
  // Ambil kata pertama yang kemungkinan nama kota
  const clean = alamat.split(/[,\n]/)[0].trim();
  // Cek apakah mengandung nama kota yang dikenal
  const cities = ['Medan', 'Jakarta', 'Bandung', 'Surabaya', 'Makassar', 'Yogyakarta', 'Semarang', 'Palembang', 'Pekanbaru', 'Denpasar'];
  for (const city of cities) {
    if (clean.toLowerCase().includes(city.toLowerCase())) return city;
  }
  return clean;
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
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCity, setFilterCity] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    api.get('/profile').then(res => {
      const p = res.data.profile;
      setProfile(p);
      // Auto-set kota dari profil
      if (p?.alamat_koordinat) {
        const city = extractCity(p.alamat_koordinat);
        if (city) setFilterCity(city);
      }
    }).catch(() => {});

    setLastUpdated(new Date().toLocaleString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }));
  }, []);

  const userCity = extractCity(profile?.alamat_koordinat);
  const activeJobs = ALL_JOBS.filter(j => !isExpired(j.posted_at));

  const filtered = activeJobs.filter(j => {
    const matchSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase()) ||
      j.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchType = filterType === 'all' || j.type === filterType;
    const matchCity = !filterCity ||
      j.city.toLowerCase().includes(filterCity.toLowerCase()) ||
      j.location.toLowerCase().includes(filterCity.toLowerCase()) ||
      j.city === 'Remote';
    return matchSearch && matchType && matchCity;
  });

  // Kota yang tersedia
  const availableCities = [...new Set(ALL_JOBS.map(j => j.city))].filter(c => c !== 'Remote');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Info Lowongan Kerja</h1>
          <p className="text-gray-500 text-sm mt-1">
            Loker terbaru · {lastUpdated}
            <span className="ml-2 bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full">● Live</span>
          </p>
        </div>
        <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          Berlaku <strong>2 hari</strong> sejak diposting
        </div>
      </div>

      {/* Lokasi user */}
      {userCity && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl">📍</span>
          <div className="flex-1">
            <p className="font-semibold text-blue-800 text-sm">
              Menampilkan loker di <strong>{userCity}</strong> sesuai alamat profil Anda
            </p>
            <p className="text-blue-600 text-xs mt-0.5">Loker Remote juga ditampilkan untuk semua kota</p>
          </div>
          <button
            onClick={() => setFilterCity('')}
            className="text-xs text-blue-600 hover:underline whitespace-nowrap"
          >
            Lihat semua kota
          </button>
        </div>
      )}

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
              <li>• Laporkan ke <strong>Kemnaker RI (1500-630)</strong> jika menemukan indikasi penipuan</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="space-y-3">
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari posisi, perusahaan, atau keahlian..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
        </div>

        {/* City filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterCity('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${!filterCity ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}
          >
            🌏 Semua Kota
          </button>
          {availableCities.map(city => (
            <button key={city}
              onClick={() => setFilterCity(city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filterCity === city ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300'}`}
            >
              📍 {city}
              {city === userCity && <span className="ml-1 text-amber-400">★</span>}
            </button>
          ))}
          <button
            onClick={() => setFilterCity('Remote')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filterCity === 'Remote' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300'}`}
          >
            🏠 Remote
          </button>
        </div>

        {/* Type filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'Full-time', 'Remote', 'Hybrid', 'Part-time'].map(type => (
            <button key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${filterType === type ? 'bg-slate-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-slate-300'}`}
            >
              {type === 'all' ? 'Semua Tipe' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-gray-500">
        <strong className="text-gray-900">{filtered.length}</strong> lowongan ditemukan
        {filterCity && <span> di <strong className="text-blue-600">{filterCity}</strong></span>}
        {search && <span> untuk "<strong>{search}</strong>"</span>}
      </p>

      {/* Job list */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">Tidak ada lowongan yang sesuai</p>
          <p className="text-gray-400 text-sm mt-1">Coba ubah filter kota atau kata kunci pencarian</p>
          <button onClick={() => { setSearch(''); setFilterType('all'); setFilterCity(''); }}
            className="mt-3 text-blue-600 text-sm hover:underline">
            Reset semua filter
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(job => (
            <div key={job.id}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md transition-all hover:border-blue-200 group">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 text-lg font-bold text-blue-600">
                    {job.company.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-bold text-gray-900 text-base group-hover:text-blue-600 transition-colors">{job.title}</h3>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${TYPE_COLORS[job.type] || 'bg-gray-100 text-gray-600'}`}>{job.type}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-700">{job.company}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
                      <span>📍 {job.location}</span>
                      {job.salary && <span>💰 {job.salary}</span>}
                      <span>🕐 {timeAgo(job.posted_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">{job.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {job.tags.map(tag => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className={`text-xs text-white px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[job.source] || 'bg-gray-500'}`}>{job.source}</span>
                  <a href={job.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors">
                    Lamar Sekarang →
                  </a>
                  <p className="text-xs text-gray-400 text-right">Verifikasi di<br/>website resmi</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700">
        <p className="font-semibold mb-1">📌 Tentang Info Loker</p>
        <p>Data dikumpulkan dari LinkedIn, JobStreet, Glints, Kalibrr, dan Indeed. Hanya loker <strong>2 hari terakhir</strong> yang ditampilkan. Loker disesuaikan otomatis dengan kota di profil Anda. Selalu verifikasi ke website resmi perusahaan sebelum melamar.</p>
      </div>
    </div>
  );
}
