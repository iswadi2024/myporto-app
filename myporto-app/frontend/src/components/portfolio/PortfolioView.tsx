'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PublicPortfolio } from '@/types';
import { formatDate, getWhatsAppUrl } from '@/lib/utils';

type Section = 'home' | 'education' | 'experience' | 'skills' | 'contact';

interface PortfolioViewProps {
  portfolio: PublicPortfolio;
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '99,102,241';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

function darkenHex(hex: string, amount = 40): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '#4338ca';
  const r = Math.max(0, parseInt(result[1], 16) - amount);
  const g = Math.max(0, parseInt(result[2], 16) - amount);
  const b = Math.max(0, parseInt(result[3], 16) - amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default function PortfolioView({ portfolio }: PortfolioViewProps) {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const { profile, education, experience, skills_achievements, appearance } = portfolio;

  const primaryColor = appearance.primary_color || '#6366f1';
  const darkColor = darkenHex(primaryColor, 50);
  const rgb = hexToRgb(primaryColor);

  const navItems: { id: Section; label: string; emoji: string }[] = [
    { id: 'home', label: 'Beranda', emoji: '🏠' },
    { id: 'education', label: 'Pendidikan', emoji: '🎓' },
    { id: 'experience', label: 'Pengalaman', emoji: '💼' },
    { id: 'skills', label: 'Keahlian', emoji: '⚡' },
    { id: 'contact', label: 'Kontak', emoji: '📬' },
  ];

  const kompetensi = skills_achievements.filter((s) => s.type === 'kompetensi');
  const kursus = skills_achievements.filter((s) => s.type === 'kursus');
  const pelatihan = skills_achievements.filter((s) => s.type === 'pelatihan');
  const organisasi = skills_achievements.filter((s) => s.type === 'organisasi');

  const gradientStyle = {
    background: `linear-gradient(135deg, ${primaryColor} 0%, ${darkColor} 100%)`,
  };

  const isSidebar = appearance.layout_type === 'sidebar-nav';

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: appearance.font_style || 'sans-serif' }}>
      {/* ── TOP NAV ── */}
      {!isSidebar && (
        <nav className="sticky top-0 z-50 shadow-lg" style={gradientStyle}>
          <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-16">
            <span className="text-white font-bold text-lg tracking-tight truncate max-w-[160px]">
              {profile.nama_lengkap}
            </span>
            <div className="flex gap-1 overflow-x-auto scrollbar-hide">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap"
                  style={
                    activeSection === item.id
                      ? { backgroundColor: 'white', color: primaryColor }
                      : { color: 'rgba(255,255,255,0.85)' }
                  }
                >
                  <span>{item.emoji}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <div className={`max-w-5xl mx-auto ${isSidebar ? 'flex gap-0' : ''}`}>
        {/* ── SIDEBAR NAV ── */}
        {isSidebar && (
          <aside
            className="w-56 min-h-screen flex-shrink-0 sticky top-0 self-start shadow-xl"
            style={gradientStyle}
          >
            <div className="p-6">
              {profile.foto_closeup && (
                <div className="mb-4 flex justify-center">
                  <Image
                    src={profile.foto_closeup}
                    alt={profile.nama_lengkap}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white/30 shadow-lg"
                  />
                </div>
              )}
              <p className="text-white font-bold text-center text-sm mb-6 leading-tight">
                {profile.nama_lengkap}
              </p>
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                    style={
                      activeSection === item.id
                        ? { backgroundColor: 'rgba(255,255,255,0.25)', color: 'white' }
                        : { color: 'rgba(255,255,255,0.75)' }
                    }
                  >
                    <span className="text-base">{item.emoji}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>
        )}

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0">

          {/* ══ HERO SECTION ══ */}
          <section
            className="relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${primaryColor}ee 0%, ${darkColor}dd 60%, #1e1b4b 100%)` }}
          >
            {/* decorative blobs */}
            <div
              className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl"
              style={{ backgroundColor: 'white', transform: 'translate(30%, -30%)' }}
            />
            <div
              className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10 blur-2xl"
              style={{ backgroundColor: 'white', transform: 'translate(-30%, 30%)' }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-14 flex flex-col md:flex-row items-center gap-8">
              {/* Photo */}
              {profile.foto_closeup && (
                <div className="flex-shrink-0">
                  <div
                    className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden shadow-2xl border-4"
                    style={{ borderColor: 'rgba(255,255,255,0.4)' }}
                  >
                    <Image
                      src={profile.foto_closeup}
                      alt={profile.nama_lengkap}
                      width={176}
                      height={176}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Text */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
                  {profile.nama_lengkap}
                </h1>
                {profile.bio_singkat && (
                  <p className="text-white/85 text-base md:text-lg leading-relaxed mb-6 max-w-xl">
                    {profile.bio_singkat}
                  </p>
                )}

                {/* Social links */}
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: '#0077b5', color: 'white' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105"
                      style={{ backgroundColor: '#24292e', color: 'white' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      GitHub
                    </a>
                  )}
                  {profile.instagram_url && (
                    <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105"
                      style={{ background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: 'white' }}>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                      Instagram
                    </a>
                  )}
                  {profile.website_url && (
                    <a href={profile.website_url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shadow-md transition-transform hover:scale-105 border-2 border-white/50"
                      style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}>
                      🌐 Website
                    </a>
                  )}
                </div>
              </div>

              {/* Full body photo */}
              {profile.foto_fullbody && (
                <div className="hidden lg:block flex-shrink-0">
                  <Image
                    src={profile.foto_fullbody}
                    alt={`${profile.nama_lengkap} full body`}
                    width={120}
                    height={220}
                    className="w-28 rounded-2xl object-cover shadow-2xl border-4 border-white/30"
                  />
                </div>
              )}
            </div>
          </section>

          {/* ══ STATS BAR ══ */}
          <section className="px-4 -mt-6 relative z-10 mb-6">
            <div className="max-w-4xl mx-auto grid grid-cols-3 gap-3">
              {[
                { label: 'Pendidikan', value: education.length, emoji: '🎓', section: 'education' as Section },
                { label: 'Pengalaman', value: experience.length, emoji: '💼', section: 'experience' as Section },
                { label: 'Keahlian', value: skills_achievements.length, emoji: '⚡', section: 'skills' as Section },
              ].map((stat) => (
                <button
                  key={stat.label}
                  onClick={() => setActiveSection(stat.section)}
                  className="bg-white rounded-2xl shadow-lg p-4 text-center hover:shadow-xl transition-all hover:-translate-y-0.5 border border-gray-100"
                >
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <p className="text-2xl font-extrabold" style={{ color: primaryColor }}>{stat.value}</p>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                </button>
              ))}
            </div>
          </section>

          {/* ══ SECTION CONTENT ══ */}
          <div className="px-4 pb-10 max-w-4xl mx-auto space-y-6">

            {/* ── EDUCATION ── */}
            {(activeSection === 'home' || activeSection === 'education') && education.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🎓</span>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${darkColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    Riwayat Pendidikan
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {education.map((edu) => (
                    <div
                      key={edu.id}
                      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="h-2 w-full" style={gradientStyle} />
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div>
                            {edu.jenjang && (
                              <span
                                className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-2"
                                style={{ backgroundColor: `rgba(${rgb},0.12)`, color: primaryColor }}
                              >
                                {edu.jenjang}
                              </span>
                            )}
                            <h3 className="font-bold text-gray-900 text-base leading-tight">{edu.institusi}</h3>
                            {edu.gelar && (
                              <p className="text-sm text-gray-600 mt-0.5">{edu.gelar}{edu.jurusan ? ` — ${edu.jurusan}` : ''}</p>
                            )}
                          </div>
                          {edu.ipk && (
                            <div
                              className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-extrabold text-white shadow"
                              style={gradientStyle}
                            >
                              {edu.ipk}
                            </div>
                          )}
                        </div>
                        {(edu.tahun_masuk || edu.tahun_lulus) && (
                          <p className="text-xs text-gray-400 mt-2">
                            📅 {edu.tahun_masuk ?? '?'} — {edu.tahun_lulus ?? 'Sekarang'}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── EXPERIENCE ── */}
            {(activeSection === 'home' || activeSection === 'experience') && experience.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">💼</span>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${darkColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    Pengalaman Kerja
                  </h2>
                </div>
                <div className="relative">
                  {/* Timeline line */}
                  <div
                    className="absolute left-5 top-0 bottom-0 w-0.5"
                    style={{ background: `linear-gradient(to bottom, ${primaryColor}, ${darkColor})` }}
                  />
                  <div className="space-y-4">
                    {experience.map((exp, idx) => (
                      <div key={exp.id} className="relative flex gap-4">
                        {/* Dot */}
                        <div
                          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg z-10"
                          style={gradientStyle}
                        >
                          {idx + 1}
                        </div>
                        {/* Card */}
                        <div
                          className="flex-1 bg-white rounded-2xl shadow-sm border-l-4 p-5 hover:shadow-md transition-shadow"
                          style={{ borderLeftColor: primaryColor }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-2">
                            <div>
                              <h3 className="font-bold text-gray-900 text-base">{exp.jabatan}</h3>
                              <p className="text-sm font-semibold" style={{ color: primaryColor }}>{exp.perusahaan}</p>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              <span
                                className="inline-block text-xs px-2 py-1 rounded-full font-medium"
                                style={{ backgroundColor: `rgba(${rgb},0.1)`, color: primaryColor }}
                              >
                                {exp.masih_bekerja ? '🟢 Aktif' : '⏹ Selesai'}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(exp.tanggal_mulai)} — {exp.masih_bekerja ? 'Sekarang' : formatDate(exp.tanggal_selesai ?? null)}
                              </p>
                            </div>
                          </div>
                          {exp.deskripsi_tugas && (
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line mt-2 border-t border-gray-100 pt-2">
                              {exp.deskripsi_tugas}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ── SKILLS ── */}
            {(activeSection === 'home' || activeSection === 'skills') && skills_achievements.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">⚡</span>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${darkColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    Keahlian &amp; Sertifikasi
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* Kompetensi */}
                  {kompetensi.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#3b82f6' }} />
                        Kompetensi
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {kompetensi.map((skill) => (
                          <span
                            key={skill.id}
                            className="px-3 py-1.5 rounded-full text-sm font-semibold text-white shadow-sm"
                            style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}
                          >
                            {skill.nama_kegiatan}{skill.level ? ` · ${skill.level}` : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Kursus */}
                  {kursus.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#22c55e' }} />
                        Kursus &amp; Sertifikasi
                      </h3>
                      <div className="space-y-3">
                        {kursus.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-3 py-2 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                              <span className="px-2.5 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg,#22c55e,#15803d)' }}>
                                {item.tahun ?? '—'}
                              </span>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{item.nama_kegiatan}</p>
                                {item.penyelenggara && <p className="text-xs text-gray-500">{item.penyelenggara}</p>}
                              </div>
                            </div>
                            {item.sertifikat_url && (
                              <a
                                href={item.sertifikat_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 text-xs px-3 py-1 rounded-full font-semibold border-2 transition-colors"
                                style={{ borderColor: '#22c55e', color: '#22c55e' }}
                              >
                                📄 Sertifikat
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Pelatihan */}
                  {pelatihan.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#a855f7' }} />
                        Pelatihan
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {pelatihan.map((item) => (
                          <div
                            key={item.id}
                            className="px-3 py-2 rounded-xl text-sm border-2"
                            style={{ borderColor: '#a855f7', color: '#7e22ce' }}
                          >
                            <span className="font-semibold">{item.nama_kegiatan}</span>
                            {item.penyelenggara && <span className="text-xs text-gray-500 ml-1">· {item.penyelenggara}</span>}
                            {item.tahun && <span className="text-xs ml-1 font-bold" style={{ color: '#a855f7' }}>({item.tahun})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organisasi */}
                  {organisasi.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                      <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: '#f97316' }} />
                        Organisasi
                      </h3>
                      <div className="space-y-2">
                        {organisasi.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                            <span className="text-lg">🏛️</span>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">{item.nama_kegiatan}</p>
                              {item.penyelenggara && <p className="text-xs text-gray-500">{item.penyelenggara}</p>}
                            </div>
                            {item.tahun && (
                              <span className="text-xs px-2 py-1 rounded-full font-bold text-white" style={{ background: 'linear-gradient(135deg,#f97316,#c2410c)' }}>
                                {item.tahun}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ── CONTACT ── */}
            {(activeSection === 'home' || activeSection === 'contact') &&
              (profile.no_whatsapp || profile.email_publik || profile.alamat_koordinat) && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">📬</span>
                  <h2
                    className="text-xl font-extrabold"
                    style={{ background: `linear-gradient(90deg, ${primaryColor}, ${darkColor})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    Hubungi Saya
                  </h2>
                </div>
                <div className="space-y-4">
                  {/* WhatsApp CTA */}
                  {profile.no_whatsapp && (
                    <a
                      href={getWhatsAppUrl(profile.no_whatsapp, `Halo ${profile.nama_lengkap}, saya melihat portofolio Anda di MyPorto.`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 rounded-2xl shadow-md hover:shadow-xl transition-all hover:-translate-y-0.5 text-white"
                      style={{ background: 'linear-gradient(135deg,#25d366,#128c7e)' }}
                    >
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-extrabold text-lg">Chat via WhatsApp</p>
                        <p className="text-white/80 text-sm">{profile.no_whatsapp}</p>
                      </div>
                      <div className="flex-shrink-0 bg-white/20 rounded-xl px-4 py-2 font-bold text-sm">
                        Kirim Pesan →
                      </div>
                    </a>
                  )}

                  {/* Email */}
                  {profile.email_publik && (
                    <a
                      href={`mailto:${profile.email_publik}`}
                      className="flex items-center gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:-translate-y-0.5"
                    >
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Email</p>
                        <p className="text-blue-600 text-sm">{profile.email_publik}</p>
                      </div>
                    </a>
                  )}

                  {/* Maps */}
                  {(profile.alamat_koordinat || (profile as any).alamat_teks) && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={gradientStyle}>
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">Lokasi</p>
                          {(profile as any).alamat_teks && (
                            <p className="text-xs text-gray-500">{(profile as any).alamat_teks}</p>
                          )}
                        </div>
                        {profile.alamat_koordinat && (
                          <a href={profile.alamat_koordinat} target="_blank" rel="noopener noreferrer"
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-shrink-0 text-white"
                            style={{ backgroundColor: primaryColor }}>
                            Buka Maps →
                          </a>
                        )}
                      </div>
                      {/* Embed menggunakan alamat_teks sebagai query (lebih akurat dari short URL) */}
                      {(() => {
                        const teks = (profile as any).alamat_teks;
                        const koordinat = profile.alamat_koordinat || '';
                        // Ekstrak koordinat dari URL panjang jika ada
                        const coordMatch = koordinat.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                        let embedSrc = '';
                        if (coordMatch) {
                          embedSrc = `https://maps.google.com/maps?q=${coordMatch[1]},${coordMatch[2]}&output=embed&z=16`;
                        } else if (teks) {
                          embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(teks)}&output=embed`;
                        } else if (koordinat && !koordinat.startsWith('http')) {
                          embedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(koordinat)}&output=embed`;
                        }
                        return embedSrc ? (
                          <iframe
                            src={embedSrc}
                            width="100%"
                            height="280"
                            className="block"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Lokasi"
                            allowFullScreen
                          />
                        ) : (
                          <div className="h-32 flex items-center justify-center bg-gray-50">
                            <a href={koordinat} target="_blank" rel="noopener noreferrer"
                              className="text-sm font-semibold text-blue-600 hover:underline">
                              📍 Lihat di Google Maps
                            </a>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </section>
            )}

          </div>{/* end section content */}
        </div>{/* end main content */}
      </div>{/* end flex wrapper */}

      {/* ══ FOOTER ══ */}
      <footer className="mt-10 py-8 text-center text-white text-sm" style={gradientStyle}>
        <p className="font-semibold opacity-90">
          Dibuat dengan ❤️ menggunakan{' '}
          <a href="/" className="underline underline-offset-2 font-bold hover:opacity-80">
            MyPorto
          </a>
        </p>
        <p className="opacity-60 text-xs mt-1">{profile.nama_lengkap} · {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
