import Link from 'next/link';
import { ArrowRight, Globe, Palette, Shield, Zap, CheckCircle, Users, Award } from '@/components/ui/icons';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-lg text-gray-900">MyPorto</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
              Masuk
            </Link>
            <Link href="/register" className="text-sm font-semibold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Daftar Gratis
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950 text-white">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Text content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-8">
                <Zap className="w-3.5 h-3.5" />
                Platform Portofolio Digital #1 Indonesia
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
                Portofolio Profesional
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  dengan Nama Anda
                </span>
              </h1>

              <p className="text-lg text-slate-300 mb-10 max-w-xl leading-relaxed">
                Buat portofolio digital yang memukau dengan link personal.
                Tampilkan CV, pengalaman, dan keahlian Anda di{' '}
                <span className="text-blue-300 font-semibold">myporto-app.vercel.app/p/nama-anda</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/register" className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-400/40 hover:-translate-y-0.5">
                  Mulai Sekarang — Gratis
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/p/demo" className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all backdrop-blur-sm">
                  Lihat Contoh Portofolio
                </Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-sm mx-auto lg:mx-0">
                {[
                  { value: '500+', label: 'Pengguna Aktif' },
                  { value: '5', label: 'Tema Tersedia' },
                  { value: '99%', label: 'Uptime' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center lg:text-left">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero image — full body PNG transparan, menyatu dengan background biru */}
            <div className="flex-shrink-0 relative flex items-end justify-center">
              {/* Glow di belakang figur */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-56 h-56 bg-blue-400/30 rounded-full blur-3xl" />

              {/* Foto PNG transparan full body */}
              <div className="relative z-10">
                <img
                  src="https://pngimg.com/uploads/businessman/businessman_PNG6557.png"
                  alt="Profesional berdasi full body"
                  className="w-64 sm:w-80 h-auto drop-shadow-2xl select-none"
                  style={{ filter: 'drop-shadow(0 20px 40px rgba(59,130,246,0.4))' }}
                />
              </div>

              {/* Floating badge — Portofolio Aktif */}
              <div className="absolute bottom-12 -left-8 bg-white rounded-2xl shadow-2xl px-4 py-3 flex items-center gap-3 z-20">
                <div className="w-9 h-9 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Portofolio Aktif</p>
                  <p className="text-xs text-gray-500">myporto-app.vercel.app/p/iswadi</p>
                </div>
              </div>

              {/* Floating badge — 500+ */}
              <div className="absolute top-8 -right-6 bg-blue-600 rounded-2xl shadow-2xl px-4 py-3 text-white text-center z-20">
                <p className="text-xl font-bold leading-none">500+</p>
                <p className="text-xs text-blue-200 mt-1">Pengguna</p>
              </div>
            </div>

          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* ── Interview Tips ── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-blue-900 to-slate-900" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              💡 Tips Karir
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Rahasia Sukses{' '}
              <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Interview Kerja
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Persiapkan diri Anda dengan tips terbukti dari para profesional HR
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {[
              { emoji: '📋', color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10 border-blue-500/20', title: 'Riset Perusahaan', tip: 'Pelajari visi, misi, dan produk perusahaan sebelum interview. Recruiter sangat terkesan dengan kandidat yang tahu tentang perusahaan mereka.', tag: 'Persiapan' },
              { emoji: '🎯', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10 border-purple-500/20', title: 'Metode STAR', tip: 'Jawab pertanyaan behavioral dengan Situation, Task, Action, Result. Ceritakan pengalaman nyata yang relevan dengan posisi yang dilamar.', tag: 'Teknik Menjawab' },
              { emoji: '💼', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10 border-amber-500/20', title: 'Portofolio Digital', tip: 'Bagikan link portofolio online Anda sebelum interview. Recruiter yang melihat portofolio Anda lebih dulu akan lebih tertarik memanggil Anda.', tag: 'Personal Branding' },
              { emoji: '🗣️', color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10 border-green-500/20', title: 'Latihan Berbicara', tip: 'Rekam diri Anda menjawab pertanyaan umum. Perhatikan intonasi, kecepatan bicara, dan bahasa tubuh. Latihan membuat sempurna.', tag: 'Komunikasi' },
              { emoji: '❓', color: 'from-rose-500 to-red-500', bg: 'bg-rose-500/10 border-rose-500/20', title: 'Siapkan Pertanyaan', tip: 'Selalu siapkan 2-3 pertanyaan untuk interviewer. Ini menunjukkan antusiasme dan keseriusan Anda terhadap posisi tersebut.', tag: 'Strategi' },
              { emoji: '⏰', color: 'from-teal-500 to-cyan-500', bg: 'bg-teal-500/10 border-teal-500/20', title: 'Tepat Waktu', tip: 'Datang 10-15 menit lebih awal. Untuk interview online, test koneksi dan peralatan 30 menit sebelumnya. Keterlambatan adalah kesan pertama yang buruk.', tag: 'Profesionalisme' },
            ].map((item) => (
              <div key={item.title} className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-1 group ${item.bg}`}>
                <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-4 bg-gradient-to-r ${item.color} text-white`}>{item.tag}</span>
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl flex-shrink-0">{item.emoji}</span>
                  <h3 className="font-bold text-white text-lg leading-tight">{item.title}</h3>
                </div>
                <p className="text-slate-400 text-sm leading-relaxed group-hover:text-slate-300 transition-colors">{item.tip}</p>
                <div className={`absolute bottom-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
            ))}
          </div>

          <div className="relative bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-3xl p-8 text-center overflow-hidden">
            <div className="relative">
              <p className="text-3xl mb-3">🚀</p>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">Portofolio Online = Nilai Plus di Mata Recruiter</h3>
              <p className="text-slate-400 mb-6 max-w-lg mx-auto text-sm">
                Kandidat dengan portofolio digital profesional <strong className="text-amber-400">3x lebih sering</strong> dipanggil interview dibanding yang hanya mengirim CV biasa.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-amber-500/30 hover:-translate-y-0.5">
                Buat Portofolio Sekarang <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Fitur Unggulan</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Semua yang Anda Butuhkan</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Satu platform lengkap untuk membangun identitas digital profesional Anda</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Globe,
              title: 'Link Personal',
              desc: 'Dapatkan link unik myporto-app.vercel.app/p/nama-anda yang mudah diingat dan dibagikan.',
              color: 'blue',
            },
            {
              icon: Palette,
              title: 'Kustomisasi Penuh',
              desc: '5 tema elegan, pilihan warna, dan layout yang bisa disesuaikan.',
              color: 'purple',
            },
            {
              icon: Shield,
              title: 'Aman & Terpercaya',
              desc: 'Data Anda aman dengan enkripsi dan sistem keamanan berlapis.',
              color: 'green',
            },
            {
              icon: Zap,
              title: 'SEO Friendly',
              desc: 'Portofolio Anda mudah ditemukan di Google dengan optimasi SEO otomatis.',
              color: 'amber',
            },
          ].map((feature) => {
            const colorMap: Record<string, string> = {
              blue: 'bg-blue-50 text-blue-600',
              purple: 'bg-purple-50 text-purple-600',
              green: 'bg-green-50 text-green-600',
              amber: 'bg-amber-50 text-amber-600',
            };
            return (
              <div key={feature.title} className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300">
                <div className={`w-12 h-12 ${colorMap[feature.color]} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Cara Kerja</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">3 Langkah Mudah</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Dari daftar hingga portofolio online dalam hitungan menit</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200" />

            {[
              { step: '01', title: 'Daftar Akun', desc: 'Buat akun gratis dengan email Anda. Tidak perlu kartu kredit.' },
              { step: '02', title: 'Isi Portofolio', desc: 'Tambahkan profil, pendidikan, pengalaman, dan keahlian Anda.' },
              { step: '03', title: 'Aktifkan & Bagikan', desc: 'Bayar sekali dan dapatkan link publik myporto-app.vercel.app/p/nama-anda.' },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-20 h-20 bg-white rounded-2xl shadow-md border border-blue-100 flex items-center justify-center mx-auto mb-5">
                  <span className="text-2xl font-bold text-blue-600">{item.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
        <div className="text-center mb-14">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mb-3">Harga</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Transparan & Terjangkau</h2>
          <p className="text-gray-500">Bayar sekali, nikmati selamanya. Tanpa biaya bulanan.</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200">
            {/* Badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-sm">
              PALING POPULER
            </div>

            <div className="text-center mb-8">
              <p className="text-blue-200 text-sm font-medium mb-2">AKTIVASI PORTOFOLIO</p>
              <div className="flex items-end justify-center gap-1 mb-1">
                <span className="text-2xl font-semibold text-blue-200">Rp</span>
                <span className="text-6xl font-bold">99.000</span>
              </div>
              <p className="text-blue-200 text-sm">Bayar sekali, aktif selamanya</p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Link publik yang bisa dibagikan',
                'Semua fitur kustomisasi tema',
                'Upload foto profil & fullbody',
                'Cetak CV & Surat Lamaran',
                'SEO otomatis per halaman',
                'Tombol WhatsApp & Google Maps',
                'Support prioritas',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-blue-300 flex-shrink-0" />
                  <span className="text-blue-50">{item}</span>
                </li>
              ))}
            </ul>

            <Link href="/register" className="block w-full bg-white text-blue-700 py-3.5 rounded-xl font-bold text-center hover:bg-blue-50 transition-colors shadow-sm">
              Daftar & Aktifkan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonial / CTA ── */}
      <section className="bg-gradient-to-br from-slate-900 to-blue-950 py-20 sm:py-28 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            ))}
          </div>
          <blockquote className="text-xl sm:text-2xl font-medium text-slate-200 mb-6 leading-relaxed">
            "MyPorto membantu saya mendapatkan pekerjaan impian. Recruiter langsung terkesan dengan portofolio profesional saya di myporto-app.vercel.app/p/iswadi"
          </blockquote>
          <p className="text-slate-400 text-sm mb-10">— Iswadi H., Software Engineer</p>

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Siap Memulai?</h2>
          <p className="text-slate-300 mb-8">Bergabung dengan ratusan profesional yang sudah membangun identitas digital mereka.</p>
          <Link href="/register" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all shadow-lg shadow-blue-500/30 hover:-translate-y-0.5">
            Buat Portofolio Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-950 text-slate-400 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="font-semibold text-slate-300">MyPorto</span>
          </div>
          <p className="text-sm">© 2026 MyPorto. Platform Portofolio Digital Indonesia.</p>
          <div className="flex gap-4 text-sm">
            <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
            <Link href="/register" className="hover:text-white transition-colors">Daftar</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
