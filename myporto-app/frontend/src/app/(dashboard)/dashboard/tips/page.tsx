'use client';

import { useState } from 'react';

type Category = 'semua' | 'penampilan' | 'keterampilan' | 'psikologi' | 'interview' | 'dokumen';

interface Tip {
  id: number;
  category: Category;
  emoji: string;
  title: string;
  content: string;
  tags: string[];
  level: 'Penting' | 'Sangat Penting' | 'Wajib';
}

const TIPS: Tip[] = [
  // ── PENAMPILAN ──
  {
    id: 1, category: 'penampilan', emoji: '👔', level: 'Wajib',
    title: 'Pakaian Profesional Sesuai Industri',
    content: 'Kenakan pakaian formal atau smart casual sesuai budaya perusahaan. Untuk perusahaan korporat: kemeja/blazer rapi. Untuk startup: smart casual. Hindari warna mencolok. Pastikan pakaian bersih, disetrika, dan tidak berbau.',
    tags: ['Pakaian', 'First Impression', 'Dress Code'],
  },
  {
    id: 2, category: 'penampilan', emoji: '💇', level: 'Penting',
    title: 'Grooming & Kebersihan Diri',
    content: 'Rambut rapi dan bersih. Kuku dipotong pendek. Hindari parfum berlebihan. Gigi bersih dan napas segar. Untuk pria: cukur atau rapikan jenggot. Untuk wanita: makeup natural dan profesional.',
    tags: ['Grooming', 'Kebersihan', 'Penampilan'],
  },
  {
    id: 3, category: 'penampilan', emoji: '🎒', level: 'Penting',
    title: 'Aksesori & Perlengkapan',
    content: 'Bawa tas atau map yang rapi untuk dokumen. Gunakan jam tangan (menunjukkan kedisiplinan). Hindari perhiasan berlebihan. Sepatu bersih dan sesuai. Matikan atau silent HP sebelum masuk ruangan interview.',
    tags: ['Aksesori', 'Tas', 'Sepatu'],
  },
  {
    id: 4, category: 'penampilan', emoji: '🚶', level: 'Penting',
    title: 'Bahasa Tubuh & Postur',
    content: 'Berjalan tegak dengan percaya diri. Saat duduk: punggung tegak, tidak bersandar berlebihan. Kontak mata yang wajar (60-70% waktu). Jabat tangan kuat tapi tidak menyakitkan. Senyum tulus dan natural.',
    tags: ['Body Language', 'Postur', 'Kontak Mata'],
  },

  // ── KETERAMPILAN ──
  {
    id: 5, category: 'keterampilan', emoji: '💻', level: 'Wajib',
    title: 'Kuasai Hard Skill yang Relevan',
    content: 'Pelajari skill teknis yang diminta di job description. Ikuti kursus online (Coursera, Udemy, Dicoding). Buat portofolio nyata yang bisa ditunjukkan. Update skill sesuai tren industri. Sertifikasi resmi sangat meningkatkan nilai Anda.',
    tags: ['Hard Skill', 'Sertifikasi', 'Portofolio'],
  },
  {
    id: 6, category: 'keterampilan', emoji: '🗣️', level: 'Sangat Penting',
    title: 'Komunikasi Efektif',
    content: 'Latih kemampuan berbicara jelas dan terstruktur. Gunakan metode STAR (Situation, Task, Action, Result) saat menjawab. Dengarkan pertanyaan dengan seksama sebelum menjawab. Hindari kata filler berlebihan (eee, umm). Bicara dengan tempo sedang.',
    tags: ['Komunikasi', 'Public Speaking', 'STAR Method'],
  },
  {
    id: 7, category: 'keterampilan', emoji: '🤝', level: 'Sangat Penting',
    title: 'Soft Skill yang Dicari Perusahaan',
    content: 'Kemampuan kerja tim dan kolaborasi. Problem solving dan critical thinking. Adaptabilitas terhadap perubahan. Time management yang baik. Leadership (meski untuk posisi junior). Kreativitas dan inovasi dalam pekerjaan.',
    tags: ['Soft Skill', 'Teamwork', 'Leadership'],
  },
  {
    id: 8, category: 'keterampilan', emoji: '🌐', level: 'Penting',
    title: 'Kemampuan Bahasa Inggris',
    content: 'Minimal bisa membaca dan menulis email profesional dalam bahasa Inggris. Untuk perusahaan multinasional: kemampuan speaking sangat penting. Ikuti kursus atau gunakan aplikasi Duolingo, BBC Learning English. Sertifikat TOEFL/IELTS menjadi nilai plus.',
    tags: ['Bahasa Inggris', 'TOEFL', 'Komunikasi'],
  },
  {
    id: 9, category: 'keterampilan', emoji: '📊', level: 'Penting',
    title: 'Literasi Digital & Teknologi',
    content: 'Kuasai Microsoft Office (Word, Excel, PowerPoint) dengan baik. Familiar dengan tools kolaborasi (Google Workspace, Slack, Trello). Pahami dasar-dasar media sosial profesional (LinkedIn). Kemampuan analisis data dasar sangat dihargai.',
    tags: ['Digital', 'Microsoft Office', 'Tools'],
  },

  // ── PSIKOLOGI ──
  {
    id: 10, category: 'psikologi', emoji: '🧠', level: 'Wajib',
    title: 'Kendalikan Kecemasan Interview',
    content: 'Latihan pernapasan dalam sebelum interview (4-7-8 technique). Visualisasikan keberhasilan interview. Ingat: interviewer ingin Anda berhasil, bukan menjebak. Persiapan matang = kepercayaan diri. Tidur cukup malam sebelumnya.',
    tags: ['Kecemasan', 'Mindset', 'Pernapasan'],
  },
  {
    id: 11, category: 'psikologi', emoji: '💪', level: 'Sangat Penting',
    title: 'Bangun Kepercayaan Diri',
    content: 'Kenali kelebihan dan pencapaian Anda. Latihan di depan cermin atau rekam video. Minta feedback dari teman atau mentor. Ingat pengalaman sukses masa lalu. Power pose 2 menit sebelum interview terbukti meningkatkan kepercayaan diri.',
    tags: ['Kepercayaan Diri', 'Self-Esteem', 'Power Pose'],
  },
  {
    id: 12, category: 'psikologi', emoji: '🎯', level: 'Sangat Penting',
    title: 'Growth Mindset dalam Karir',
    content: 'Anggap penolakan sebagai pembelajaran, bukan kegagalan. Setiap interview adalah pengalaman berharga. Minta feedback setelah ditolak. Tetap konsisten melamar meski belum berhasil. Rata-rata orang melamar 10-20 posisi sebelum diterima.',
    tags: ['Growth Mindset', 'Resiliensi', 'Motivasi'],
  },
  {
    id: 13, category: 'psikologi', emoji: '🧘', level: 'Penting',
    title: 'Manajemen Stres Pencarian Kerja',
    content: 'Tetapkan jadwal melamar yang teratur (jangan berlebihan). Jaga keseimbangan antara melamar dan istirahat. Olahraga rutin untuk menjaga kesehatan mental. Bergabung dengan komunitas job seeker untuk support. Batasi waktu scroll media sosial yang memicu insecure.',
    tags: ['Stres', 'Work-Life Balance', 'Mental Health'],
  },
  {
    id: 14, category: 'psikologi', emoji: '🔍', level: 'Penting',
    title: 'Self-Awareness & Personal Branding',
    content: 'Kenali nilai-nilai, kekuatan, dan kelemahan diri. Buat personal brand yang konsisten di semua platform. LinkedIn, portofolio online, dan cara berpakaian harus selaras. Ceritakan "personal story" yang menarik dan autentik. Jadilah diri sendiri, bukan meniru orang lain.',
    tags: ['Personal Brand', 'Self-Awareness', 'Autentik'],
  },

  // ── INTERVIEW ──
  {
    id: 15, category: 'interview', emoji: '📋', level: 'Wajib',
    title: 'Riset Mendalam tentang Perusahaan',
    content: 'Pelajari visi, misi, produk/layanan, dan budaya perusahaan. Baca berita terbaru tentang perusahaan. Ketahui siapa kompetitor mereka. Pahami posisi yang dilamar secara detail. Siapkan pertanyaan cerdas untuk interviewer.',
    tags: ['Riset', 'Perusahaan', 'Persiapan'],
  },
  {
    id: 16, category: 'interview', emoji: '❓', level: 'Sangat Penting',
    title: 'Jawaban untuk Pertanyaan Umum',
    content: '"Ceritakan tentang diri Anda" — fokus pada profesional, bukan personal. "Kelebihan/kelemahan" — jujur dan tunjukkan self-awareness. "Mengapa ingin bergabung?" — hubungkan dengan nilai perusahaan. "Ekspektasi gaji" — riset market rate terlebih dahulu.',
    tags: ['Pertanyaan Interview', 'Jawaban', 'Persiapan'],
  },
  {
    id: 17, category: 'interview', emoji: '💰', level: 'Penting',
    title: 'Negosiasi Gaji yang Efektif',
    content: 'Riset rata-rata gaji posisi tersebut di Glassdoor, LinkedIn Salary. Berikan range, bukan angka pasti. Pertimbangkan total package (tunjangan, bonus, fasilitas). Jangan sebutkan gaji terlalu awal dalam proses. Tunjukkan nilai yang Anda bawa, bukan kebutuhan Anda.',
    tags: ['Negosiasi', 'Gaji', 'Salary'],
  },
  {
    id: 18, category: 'interview', emoji: '⏰', level: 'Wajib',
    title: 'Manajemen Waktu Interview',
    content: 'Datang 10-15 menit lebih awal. Untuk online: test koneksi 30 menit sebelumnya. Siapkan backup (hotspot HP jika internet bermasalah). Informasikan jika ada keterlambatan darurat. Follow up dengan email terima kasih dalam 24 jam setelah interview.',
    tags: ['Tepat Waktu', 'Online Interview', 'Follow Up'],
  },

  // ── DOKUMEN ──
  {
    id: 19, category: 'dokumen', emoji: '📄', level: 'Wajib',
    title: 'CV yang ATS-Friendly',
    content: 'Gunakan format sederhana yang bisa dibaca sistem ATS. Masukkan kata kunci dari job description. Urutkan pengalaman dari terbaru. Maksimal 2 halaman untuk fresh graduate, 3 halaman untuk senior. Gunakan bullet points, bukan paragraf panjang.',
    tags: ['CV', 'ATS', 'Resume'],
  },
  {
    id: 20, category: 'dokumen', emoji: '✉️', level: 'Sangat Penting',
    title: 'Cover Letter yang Menarik',
    content: 'Personalisasi untuk setiap perusahaan, jangan template generik. Tunjukkan mengapa Anda cocok untuk posisi TERSEBUT di perusahaan TERSEBUT. Maksimal 1 halaman. Mulai dengan kalimat pembuka yang kuat. Akhiri dengan call-to-action yang jelas.',
    tags: ['Cover Letter', 'Surat Lamaran', 'Personalisasi'],
  },
  {
    id: 21, category: 'dokumen', emoji: '🌐', level: 'Sangat Penting',
    title: 'Portofolio Online yang Profesional',
    content: 'Buat portofolio digital yang mudah diakses (seperti MyPorto!). Tampilkan proyek terbaik dengan deskripsi jelas. Sertakan link ke GitHub, Behance, atau platform relevan. Update secara berkala. Bagikan link di CV dan LinkedIn.',
    tags: ['Portofolio', 'Online', 'Digital'],
  },
  {
    id: 22, category: 'dokumen', emoji: '🔗', level: 'Penting',
    title: 'Optimasi Profil LinkedIn',
    content: 'Foto profil profesional (bukan selfie). Headline yang mendeskripsikan nilai Anda, bukan hanya jabatan. Summary yang menarik dan personal. Minta rekomendasi dari kolega/atasan. Aktif posting konten relevan di industri Anda.',
    tags: ['LinkedIn', 'Profil', 'Networking'],
  },
];

const CATEGORIES = [
  { id: 'semua', label: 'Semua Tips', emoji: '✨', color: 'bg-gray-100 text-gray-700' },
  { id: 'penampilan', label: 'Penampilan', emoji: '👔', color: 'bg-blue-100 text-blue-700' },
  { id: 'keterampilan', label: 'Keterampilan', emoji: '💡', color: 'bg-green-100 text-green-700' },
  { id: 'psikologi', label: 'Psikologi', emoji: '🧠', color: 'bg-purple-100 text-purple-700' },
  { id: 'interview', label: 'Interview', emoji: '🎯', color: 'bg-orange-100 text-orange-700' },
  { id: 'dokumen', label: 'Dokumen', emoji: '📄', color: 'bg-rose-100 text-rose-700' },
];

const LEVEL_COLORS = {
  'Wajib': 'bg-red-100 text-red-700 border-red-200',
  'Sangat Penting': 'bg-orange-100 text-orange-700 border-orange-200',
  'Penting': 'bg-blue-100 text-blue-700 border-blue-200',
};

const CAT_GRADIENTS: Record<string, string> = {
  penampilan: 'from-blue-500 to-cyan-500',
  keterampilan: 'from-green-500 to-emerald-500',
  psikologi: 'from-purple-500 to-violet-500',
  interview: 'from-orange-500 to-amber-500',
  dokumen: 'from-rose-500 to-pink-500',
};

export default function TipsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('semua');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = TIPS.filter(tip => {
    const matchCat = activeCategory === 'semua' || tip.category === activeCategory;
    const matchSearch = !search ||
      tip.title.toLowerCase().includes(search.toLowerCase()) ||
      tip.content.toLowerCase().includes(search.toLowerCase()) ||
      tip.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const wajibCount = filtered.filter(t => t.level === 'Wajib').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            🚀 Panduan Lengkap
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Tips Sukses Melamar Kerja</h1>
          <p className="text-white/80 text-sm max-w-xl">
            Panduan komprehensif dari penampilan, keterampilan, hingga psikologi — semua yang perlu Anda persiapkan untuk mendapatkan pekerjaan impian.
          </p>
          <div className="flex gap-4 mt-4 text-sm">
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
              <p className="text-xl font-bold">{TIPS.length}</p>
              <p className="text-white/70 text-xs">Total Tips</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
              <p className="text-xl font-bold">{TIPS.filter(t => t.level === 'Wajib').length}</p>
              <p className="text-white/70 text-xs">Tips Wajib</p>
            </div>
            <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
              <p className="text-xl font-bold">5</p>
              <p className="text-white/70 text-xs">Kategori</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari tips berdasarkan kata kunci..."
          className="w-full border border-gray-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white shadow-sm"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(cat => (
          <button key={cat.id}
            onClick={() => setActiveCategory(cat.id as Category)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-200'
                : `${cat.color} hover:opacity-80`
            }`}>
            <span>{cat.emoji}</span>
            {cat.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-white/20' : 'bg-black/10'}`}>
              {cat.id === 'semua' ? TIPS.length : TIPS.filter(t => t.category === cat.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          <strong className="text-gray-900">{filtered.length}</strong> tips ditemukan
          {wajibCount > 0 && <span className="ml-2 text-red-600 font-medium">· {wajibCount} wajib dipelajari</span>}
        </p>
        {search && (
          <button onClick={() => setSearch('')} className="text-xs text-purple-600 hover:underline">
            Hapus pencarian
          </button>
        )}
      </div>

      {/* Tips grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500">Tidak ada tips yang sesuai</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map(tip => (
            <div key={tip.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              {/* Gradient top bar */}
              <div className={`h-1.5 bg-gradient-to-r ${CAT_GRADIENTS[tip.category] || 'from-gray-400 to-gray-500'}`} />

              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{tip.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[tip.level]}`}>
                          {tip.level === 'Wajib' ? '🔴' : tip.level === 'Sangat Penting' ? '🟠' : '🔵'} {tip.level}
                        </span>
                        <span className="text-xs text-gray-400 capitalize">{tip.category}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === tip.id ? null : tip.id)}
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 hover:bg-purple-100 flex items-center justify-center transition-colors text-gray-500 hover:text-purple-600 text-sm font-bold"
                  >
                    {expanded === tip.id ? '−' : '+'}
                  </button>
                </div>

                {/* Content — collapsed/expanded */}
                <p className={`text-sm text-gray-600 leading-relaxed ${expanded === tip.id ? '' : 'line-clamp-2'}`}>
                  {tip.content}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {tip.tags.map(tag => (
                    <span key={tag}
                      className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full cursor-pointer hover:bg-purple-100 hover:text-purple-600 transition-colors"
                      onClick={() => setSearch(tag)}>
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800">
        <p className="font-semibold mb-1">📌 Tentang Konten Tips Ini</p>
        <p>Tips ini dikurasi dari berbagai sumber terpercaya termasuk penelitian HR profesional, panduan karir dari LinkedIn, dan pengalaman praktisi rekrutmen. Konten diperbarui secara berkala untuk relevansi terkini.</p>
      </div>
    </div>
  );
}
