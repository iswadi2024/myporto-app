export interface User {
  id: number;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  is_paid: boolean;
  paid_until?: string; // tanggal expired subscription
  created_at: string;
  profile?: Profile;
  appearance?: AppearanceSetting;
}

export interface Profile {
  id: number;
  user_id: number;
  nama_lengkap: string;
  nama_locked?: boolean; // true = nama tidak bisa diubah
  bio_singkat?: string;
  foto_closeup?: string;
  foto_fullbody?: string;
  tempat_lahir?: string;
  tanggal_lahir?: string;
  no_whatsapp?: string;
  alamat_koordinat?: string;
  email_publik?: string;
  instagram_url?: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
}

export interface Education {
  id: number;
  user_id: number;
  jenjang?: string;
  institusi: string;
  gelar?: string;
  jurusan?: string;
  tahun_masuk?: number;
  tahun_lulus?: number;
  ipk?: number;
  deskripsi?: string;
}

export interface Experience {
  id: number;
  user_id: number;
  perusahaan: string;
  jabatan: string;
  tanggal_mulai: string;
  tanggal_selesai?: string;
  masih_bekerja: boolean;
  deskripsi_tugas?: string;
}

export interface SkillsAndAchievement {
  id: number;
  user_id: number;
  type: 'kursus' | 'pelatihan' | 'organisasi' | 'kompetensi';
  nama_kegiatan: string;
  penyelenggara?: string;
  tahun?: number;
  sertifikat_url?: string;
  level?: string;
}

export interface AppearanceSetting {
  id: number;
  user_id: number;
  theme_name: string;
  primary_color: string;
  layout_type: string;
  font_style: string;
}

export interface Payment {
  id: number;
  user_id: number;
  order_id: string;
  amount: number;
  status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'EXPIRED';
  bukti_bayar?: string;
  catatan_admin?: string;
  confirmed_at?: string;
  created_at: string;
}

export interface PublicPortfolio {
  id: number;
  username: string;
  profile: Profile;
  education: Education[];
  experience: Experience[];
  skills_achievements: SkillsAndAchievement[];
  appearance: AppearanceSetting;
}
