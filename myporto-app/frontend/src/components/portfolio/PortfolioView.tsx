'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Github,
  Globe,
  MessageCircle,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Users,
} from '@/components/ui/icons';
import { PublicPortfolio } from '@/types';
import { formatDate, getWhatsAppUrl } from '@/lib/utils';

type Section = 'home' | 'education' | 'experience' | 'skills' | 'contact';

interface PortfolioViewProps {
  portfolio: PublicPortfolio;
}

export default function PortfolioView({ portfolio }: PortfolioViewProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const { profile, education, experience, skills_achievements, appearance } = portfolio;

  const primaryColor = appearance.primary_color;
  const theme = appearance.theme_name;

  const navItems: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: 'Beranda', icon: Globe },
    { id: 'education', label: 'Pendidikan', icon: GraduationCap },
    { id: 'experience', label: 'Pengalaman', icon: Briefcase },
    { id: 'skills', label: 'Keahlian', icon: Award },
    { id: 'contact', label: 'Kontak', icon: Phone },
  ];

  const kompetensi = skills_achievements.filter((s) => s.type === 'kompetensi');
  const kursus = skills_achievements.filter((s) => s.type === 'kursus');
  const pelatihan = skills_achievements.filter((s) => s.type === 'pelatihan');
  const organisasi = skills_achievements.filter((s) => s.type === 'organisasi');

  return (
    <div className={`min-h-screen theme-${theme}`} style={{ fontFamily: appearance.font_style }}>
      {/* Top Navigation */}
      {appearance.layout_type === 'top-nav' && (
        <nav
          className="sticky top-0 z-50 shadow-sm"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="max-w-4xl mx-auto px-4 flex items-center justify-between h-14">
            <span className="text-white font-bold text-lg">{profile.nama_lengkap}</span>
            <div className="flex gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <div className={`max-w-4xl mx-auto px-4 py-8 ${appearance.layout_type === 'sidebar-nav' ? 'flex gap-8' : ''}`}>
        {/* Sidebar Navigation */}
        {appearance.layout_type === 'sidebar-nav' && (
          <aside className="w-48 flex-shrink-0">
            <div className="sticky top-8">
              <p className="font-bold text-gray-900 mb-4">{profile.nama_lengkap}</p>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left"
                    style={
                      activeSection === item.id
                        ? { backgroundColor: primaryColor, color: 'white' }
                        : { color: '#6b7280' }
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* Content */}
        <div className="flex-1">
          {/* HOME */}
          {activeSection === 'home' && (
            <div>
              <div className="flex flex-col md:flex-row gap-8 items-start mb-8">
                {profile.foto_closeup && (
                  <div className="flex-shrink-0">
                    <Image
                      src={profile.foto_closeup}
                      alt={profile.nama_lengkap}
                      width={160}
                      height={160}
                      className="w-40 h-40 rounded-2xl object-cover shadow-lg"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.nama_lengkap}</h1>
                  {profile.bio_singkat && (
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">{profile.bio_singkat}</p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    {profile.linkedin_url && (
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: '#0077b5' }}>
                        <Linkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {profile.github_url && (
                      <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-900 text-white">
                        <Github className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {profile.instagram_url && (
                      <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                        style={{ backgroundColor: '#e1306c' }}>
                        <Instagram className="w-4 h-4" /> Instagram
                      </a>
                    )}
                    {profile.website_url && (
                      <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700">
                        <Globe className="w-4 h-4" /> Website
                      </a>
                    )}
                  </div>
                </div>
                {profile.foto_fullbody && (
                  <div className="hidden md:block flex-shrink-0">
                    <Image
                      src={profile.foto_fullbody}
                      alt={`${profile.nama_lengkap} full body`}
                      width={120}
                      height={200}
                      className="w-28 rounded-xl object-cover shadow-md"
                    />
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Pendidikan', value: education.length, icon: GraduationCap },
                  { label: 'Pengalaman', value: experience.length, icon: Briefcase },
                  { label: 'Keahlian', value: kompetensi.length, icon: Award },
                ].map((stat) => (
                  <button
                    key={stat.label}
                    onClick={() => setActiveSection(stat.label.toLowerCase() as Section)}
                    className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: primaryColor }} />
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {activeSection === 'education' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <GraduationCap style={{ color: primaryColor }} />
                Riwayat Pendidikan
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">{edu.institusi}</h3>
                        {edu.gelar && <p className="text-gray-700">{edu.gelar}{edu.jurusan ? ` — ${edu.jurusan}` : ''}</p>}
                        {edu.deskripsi && <p className="text-gray-600 text-sm mt-2">{edu.deskripsi}</p>}
                      </div>
                      <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-4">
                        {edu.tahun_masuk && <span>{edu.tahun_masuk}</span>}
                        {edu.tahun_masuk && edu.tahun_lulus && <span> — </span>}
                        {edu.tahun_lulus && <span>{edu.tahun_lulus}</span>}
                      </div>
                    </div>
                  </div>
                ))}
                {education.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Belum ada data pendidikan</p>
                )}
              </div>
            </div>
          )}

          {/* EXPERIENCE */}
          {activeSection === 'experience' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Briefcase style={{ color: primaryColor }} />
                Pengalaman Kerja
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{exp.jabatan}</h3>
                        <p className="text-gray-700 font-medium">{exp.perusahaan}</p>
                        {exp.deskripsi_tugas && (
                          <p className="text-gray-600 text-sm mt-2 whitespace-pre-line">{exp.deskripsi_tugas}</p>
                        )}
                      </div>
                      <div className="text-right text-sm text-gray-500 flex-shrink-0 ml-4">
                        <p>{formatDate(exp.tanggal_mulai)}</p>
                        <p>— {exp.masih_bekerja ? 'Sekarang' : formatDate(exp.tanggal_selesai || null)}</p>
                      </div>
                    </div>
                  </div>
                ))}
                {experience.length === 0 && (
                  <p className="text-gray-500 text-center py-8">Belum ada data pengalaman</p>
                )}
              </div>
            </div>
          )}

          {/* SKILLS */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Award style={{ color: primaryColor }} />
                Keahlian & Sertifikasi
              </h2>

              {kompetensi.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Award className="w-4 h-4" style={{ color: primaryColor }} />
                    Kompetensi
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {kompetensi.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {skill.nama_kegiatan}
                        {skill.level && ` (${skill.level})`}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {kursus.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" style={{ color: primaryColor }} />
                    Kursus & Sertifikasi
                  </h3>
                  <div className="space-y-3">
                    {kursus.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.nama_kegiatan}</p>
                          {item.penyelenggara && <p className="text-sm text-gray-500">{item.penyelenggara}</p>}
                        </div>
                        <div className="flex items-center gap-3">
                          {item.tahun && <span className="text-sm text-gray-500">{item.tahun}</span>}
                          {item.sertifikat_url && (
                            <a href={item.sertifikat_url} target="_blank" rel="noopener noreferrer"
                              className="text-xs px-2 py-1 rounded border text-blue-600 border-blue-300 hover:bg-blue-50">
                              Lihat Sertifikat
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pelatihan.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3">Pelatihan</h3>
                  <div className="space-y-3">
                    {pelatihan.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.nama_kegiatan}</p>
                          {item.penyelenggara && <p className="text-sm text-gray-500">{item.penyelenggara}</p>}
                        </div>
                        {item.tahun && <span className="text-sm text-gray-500">{item.tahun}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {organisasi.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: primaryColor }} />
                    Organisasi
                  </h3>
                  <div className="space-y-3">
                    {organisasi.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{item.nama_kegiatan}</p>
                          {item.penyelenggara && <p className="text-sm text-gray-500">{item.penyelenggara}</p>}
                        </div>
                        {item.tahun && <span className="text-sm text-gray-500">{item.tahun}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CONTACT */}
          {activeSection === 'contact' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Phone style={{ color: primaryColor }} />
                Kontak
              </h2>
              <div className="space-y-4">
                {profile.no_whatsapp && (
                  <a
                    href={getWhatsAppUrl(profile.no_whatsapp, `Halo ${profile.nama_lengkap}, saya melihat portofolio Anda di MyPorto.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">WhatsApp</p>
                      <p className="text-gray-600">{profile.no_whatsapp}</p>
                    </div>
                    <span className="ml-auto bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Chat Sekarang
                    </span>
                  </a>
                )}

                {profile.email_publik && (
                  <a
                    href={`mailto:${profile.email_publik}`}
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-600">{profile.email_publik}</p>
                    </div>
                  </a>
                )}

                {profile.alamat_koordinat && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <MapPin className="w-5 h-5" style={{ color: primaryColor }} />
                      <p className="font-semibold text-gray-900">Lokasi</p>
                    </div>
                    <iframe
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(profile.alamat_koordinat)}&output=embed`}
                      width="100%"
                      height="300"
                      className="rounded-lg border border-gray-200"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100 mt-8">
        Dibuat dengan{' '}
        <a href="/" className="text-blue-500 hover:underline">MyPorto</a>
      </footer>
    </div>
  );
}
