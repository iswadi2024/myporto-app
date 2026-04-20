import { Metadata } from 'next';
import PortfolioView from '@/components/portfolio/PortfolioView';
import { PublicPortfolio } from '@/types';

export const metadata: Metadata = {
  title: 'Iswadi Hamzah — Contoh Portofolio Digital | MyPorto',
  description: 'Lihat contoh portofolio digital profesional yang dibuat dengan MyPorto.',
};

const demoPortfolio: PublicPortfolio = {
  id: 0,
  username: 'demo',
  profile: {
    id: 0,
    user_id: 0,
    nama_lengkap: 'Iswadi Hamzah',
    bio_singkat:
      'Full Stack Developer dengan 5 tahun pengalaman membangun aplikasi web dan mobile yang scalable. Passionate tentang clean code, UI/UX yang intuitif, dan teknologi terkini.',
    foto_closeup:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=faces&auto=format&q=80',
    foto_fullbody:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=400&fit=crop&crop=faces,top&auto=format&q=80',
    no_whatsapp: '6281234567890',
    email_publik: 'iswadi@email.com',
    linkedin_url: 'https://linkedin.com',
    github_url: 'https://github.com',
    instagram_url: 'https://instagram.com',
    website_url: 'https://myporto.id',
    alamat_koordinat: 'Jakarta, Indonesia',
  },
  education: [
    {
      id: 1,
      user_id: 0,
      institusi: 'Universitas Indonesia',
      gelar: 'S.Kom',
      jurusan: 'Teknik Informatika',
      tahun_masuk: 2016,
      tahun_lulus: 2020,
      deskripsi: 'Lulus dengan predikat Cumlaude. Aktif di UKM Programming dan menjadi asisten dosen mata kuliah Algoritma & Pemrograman.',
    },
    {
      id: 2,
      user_id: 0,
      institusi: 'SMA Negeri 1 Jakarta',
      gelar: undefined,
      jurusan: 'IPA',
      tahun_masuk: 2013,
      tahun_lulus: 2016,
      deskripsi: 'Juara 1 Olimpiade Komputer tingkat Provinsi DKI Jakarta.',
    },
  ],
  experience: [
    {
      id: 1,
      user_id: 0,
      perusahaan: 'PT. Tokopedia',
      jabatan: 'Senior Full Stack Developer',
      tanggal_mulai: '2022-01-01',
      tanggal_selesai: undefined,
      masih_bekerja: true,
      deskripsi_tugas:
        '• Memimpin tim 5 developer dalam pengembangan fitur checkout baru\n• Meningkatkan performa halaman produk hingga 40% dengan optimasi React\n• Mengintegrasikan payment gateway baru (GoPay, OVO, Dana)\n• Mentoring junior developer dan code review rutin',
    },
    {
      id: 2,
      user_id: 0,
      perusahaan: 'PT. Gojek Indonesia',
      jabatan: 'Frontend Developer',
      tanggal_mulai: '2020-06-01',
      tanggal_selesai: '2021-12-31',
      masih_bekerja: false,
      deskripsi_tugas:
        '• Mengembangkan fitur GoFood menggunakan React Native\n• Berkolaborasi dengan tim desain untuk implementasi design system\n• Menulis unit test dengan coverage 85%',
    },
    {
      id: 3,
      user_id: 0,
      perusahaan: 'Startup Fintech (Magang)',
      jabatan: 'Frontend Developer Intern',
      tanggal_mulai: '2019-07-01',
      tanggal_selesai: '2019-12-31',
      masih_bekerja: false,
      deskripsi_tugas:
        '• Membangun dashboard admin menggunakan Vue.js\n• Integrasi REST API dengan Axios',
    },
  ],
  skills_achievements: [
    // Kompetensi
    { id: 1, user_id: 0, type: 'kompetensi', nama_kegiatan: 'React.js', level: 'Advanced' },
    { id: 2, user_id: 0, type: 'kompetensi', nama_kegiatan: 'Next.js', level: 'Advanced' },
    { id: 3, user_id: 0, type: 'kompetensi', nama_kegiatan: 'TypeScript', level: 'Advanced' },
    { id: 4, user_id: 0, type: 'kompetensi', nama_kegiatan: 'Node.js', level: 'Intermediate' },
    { id: 5, user_id: 0, type: 'kompetensi', nama_kegiatan: 'PostgreSQL', level: 'Intermediate' },
    { id: 6, user_id: 0, type: 'kompetensi', nama_kegiatan: 'React Native', level: 'Intermediate' },
    { id: 7, user_id: 0, type: 'kompetensi', nama_kegiatan: 'Docker', level: 'Beginner' },
    { id: 8, user_id: 0, type: 'kompetensi', nama_kegiatan: 'AWS', level: 'Beginner' },
    // Kursus
    {
      id: 9,
      user_id: 0,
      type: 'kursus',
      nama_kegiatan: 'AWS Certified Cloud Practitioner',
      penyelenggara: 'Amazon Web Services',
      tahun: 2023,
      sertifikat_url: 'https://aws.amazon.com',
    },
    {
      id: 10,
      user_id: 0,
      type: 'kursus',
      nama_kegiatan: 'Meta React Native Specialization',
      penyelenggara: 'Coursera / Meta',
      tahun: 2022,
      sertifikat_url: 'https://coursera.org',
    },
    {
      id: 11,
      user_id: 0,
      type: 'kursus',
      nama_kegiatan: 'Full Stack Web Development',
      penyelenggara: 'Dicoding Indonesia',
      tahun: 2021,
    },
    // Pelatihan
    {
      id: 12,
      user_id: 0,
      type: 'pelatihan',
      nama_kegiatan: 'Google Developer Student Club — Web Dev Bootcamp',
      penyelenggara: 'Google',
      tahun: 2020,
    },
    {
      id: 13,
      user_id: 0,
      type: 'pelatihan',
      nama_kegiatan: 'Hacktiv8 Full Stack JavaScript',
      penyelenggara: 'Hacktiv8',
      tahun: 2020,
    },
    // Organisasi
    {
      id: 14,
      user_id: 0,
      type: 'organisasi',
      nama_kegiatan: 'Ketua UKM Programming',
      penyelenggara: 'Universitas Indonesia',
      tahun: 2019,
    },
    {
      id: 15,
      user_id: 0,
      type: 'organisasi',
      nama_kegiatan: 'Anggota IEEE Student Branch',
      penyelenggara: 'IEEE Indonesia',
      tahun: 2018,
    },
  ],
  appearance: {
    id: 0,
    user_id: 0,
    theme_name: 'modern',
    primary_color: '#3b82f6',
    layout_type: 'top-nav',
    font_style: 'Inter, sans-serif',
  },
};

export default function DemoPortfolioPage() {
  return (
    <div>
      {/* Demo banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-center py-2.5 px-4 text-sm font-medium">
        🎨 Ini adalah contoh portofolio demo —{' '}
        <a href="/register" className="underline font-semibold hover:text-blue-200">
          Buat portofolio Anda sendiri sekarang
        </a>
      </div>
      <PortfolioView portfolio={demoPortfolio} />
    </div>
  );
}
