'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Education, Experience, SkillsAndAchievement } from '@/types';
import { formatDate } from '@/lib/utils';
import { Printer, Download } from '@/components/ui/icons';

const THEMES = [
  { id: 'blue', label: 'Biru Profesional', accent: '#2563eb', header: '#1e3a8a', light: '#eff6ff', gradient: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' },
  { id: 'green', label: 'Hijau Elegan', accent: '#16a34a', header: '#14532d', light: '#f0fdf4', gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)' },
  { id: 'purple', label: 'Ungu Modern', accent: '#7c3aed', header: '#4c1d95', light: '#f5f3ff', gradient: 'linear-gradient(135deg, #4c1d95 0%, #7c3aed 100%)' },
  { id: 'slate', label: 'Abu Minimalis', accent: '#475569', header: '#1e293b', light: '#f8fafc', gradient: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)' },
  { id: 'rose', label: 'Merah Berani', accent: '#e11d48', header: '#881337', light: '#fff1f2', gradient: 'linear-gradient(135deg, #881337 0%, #e11d48 100%)' },
  { id: 'ocean', label: 'Ocean Gradasi', accent: '#0891b2', header: '#164e63', light: '#ecfeff', gradient: 'linear-gradient(135deg, #164e63 0%, #0891b2 50%, #06b6d4 100%)' },
  { id: 'sunset', label: 'Sunset Gradasi', accent: '#ea580c', header: '#7c2d12', light: '#fff7ed', gradient: 'linear-gradient(135deg, #7c2d12 0%, #ea580c 50%, #f59e0b 100%)' },
  { id: 'forest', label: 'Forest Gradasi', accent: '#15803d', header: '#14532d', light: '#f0fdf4', gradient: 'linear-gradient(135deg, #14532d 0%, #15803d 50%, #4ade80 100%)' },
  { id: 'royal', label: 'Royal Gradasi', accent: '#6d28d9', header: '#2e1065', light: '#faf5ff', gradient: 'linear-gradient(135deg, #2e1065 0%, #6d28d9 50%, #a78bfa 100%)' },
  { id: 'midnight', label: 'Midnight Dark', accent: '#818cf8', header: '#0f172a', light: '#f8fafc', gradient: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)' },
];

export default function CVPage() {
  const { user } = useAuthStore();
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [skills, setSkills] = useState<SkillsAndAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      api.get('/education'),
      api.get('/experience'),
      api.get('/skills'),
    ]).then(([edu, exp, sk]) => {
      setEducation(edu.data.education);
      setExperience(exp.data.experience);
      setSkills(sk.data.skills);
    }).finally(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const profile = user?.profile;
  const kompetensi = skills.filter(s => s.type === 'kompetensi');
  const kursus = skills.filter(s => s.type === 'kursus');
  const organisasi = skills.filter(s => s.type === 'organisasi');

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Memuat data CV...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar — hidden on print */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Cetak CV</h1>
            <p className="text-xs text-gray-500">Data diambil otomatis dari profil Anda</p>
          </div>

          {/* Theme picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500 font-medium">Tema:</span>
            <div className="flex gap-1.5 flex-wrap">
              {THEMES.map((t) => (
                <button key={t.id} onClick={() => setSelectedTheme(t)}
                  title={t.label}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${selectedTheme.id === t.id ? 'border-gray-800 scale-110 shadow-md' : 'border-transparent'}`}
                  style={{ background: t.gradient }} />
              ))}
            </div>
            <span className="text-xs text-gray-400 ml-1">{selectedTheme.label}</span>
          </div>

          <div className="flex gap-2">
            <button onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>
      </div>

      {/* CV Preview */}
      <div className="max-w-4xl mx-auto py-8 px-4 print:p-0 print:max-w-none">
        <div ref={printRef} id="cv-print"
          className="bg-white shadow-xl print:shadow-none"
          style={{ minHeight: '297mm', fontFamily: 'Arial, sans-serif' }}>

          {/* Header */}
          <div style={{ background: selectedTheme.gradient, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties} className="text-white p-8 print:p-6">
            <div className="flex items-start gap-6">
              {/* Photo */}
              {profile?.foto_closeup ? (
                <img src={profile.foto_closeup} alt={profile.nama_lengkap}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30 flex-shrink-0" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 border-4 border-white/30">
                  <span className="text-3xl font-bold text-white">
                    {profile?.nama_lengkap?.charAt(0) || '?'}
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">{profile?.nama_lengkap || 'Nama Lengkap'}</h1>
                {experience[0] && (
                  <p className="text-lg opacity-80 mb-3">{experience[0].jabatan}</p>
                )}
                {profile?.bio_singkat && (
                  <p className="text-sm opacity-70 leading-relaxed max-w-xl">{profile.bio_singkat}</p>
                )}
              </div>
            </div>

            {/* Contact bar — rapi dalam frame */}
            <div className="mt-5 pt-4 border-t border-white/20">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
                {profile?.no_whatsapp && (
                  <span className="flex items-center gap-1 opacity-90">
                    <span>📱</span> {profile.no_whatsapp}
                  </span>
                )}
                {profile?.email_publik && (
                  <span className="flex items-center gap-1 opacity-90">
                    <span>✉</span> {profile.email_publik}
                  </span>
                )}
                {profile?.alamat_koordinat && !profile.alamat_koordinat.startsWith('http') && (
                  <span className="flex items-center gap-1 opacity-90">
                    <span>📍</span> {profile.alamat_koordinat.split(',')[0].trim()}
                  </span>
                )}
                {profile?.linkedin_url && (
                  <span className="flex items-center gap-1 opacity-90">
                    <span>🔗</span> {profile.linkedin_url.replace('https://www.linkedin.com/in/', 'linkedin.com/in/').replace('https://linkedin.com/in/', 'linkedin.com/in/')}
                  </span>
                )}
                {profile?.github_url && (
                  <span className="flex items-center gap-1 opacity-90">
                    <span>💻</span> {profile.github_url.replace('https://github.com/', 'github.com/')}
                  </span>
                )}
                {profile?.website_url && !profile.website_url.includes('maps') && (
                  <span className="flex items-center gap-1 opacity-90">
                    <span>🌐</span> {profile.website_url.replace('https://www.', '').replace('https://', '')}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Body — 2 column */}
          <div className="flex">
            {/* Left sidebar */}
            <div className="w-64 flex-shrink-0 p-6 print:p-5" style={{ backgroundColor: selectedTheme.light, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties}>

              {/* Kompetensi */}
              {kompetensi.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: selectedTheme.accent }}>Kompetensi</h2>
                  <div className="space-y-2">
                    {kompetensi.map((s) => (
                      <div key={s.id}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-medium text-gray-800">{s.nama_kegiatan}</span>
                          {s.level && <span className="text-gray-500">{s.level}</span>}
                        </div>
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all"
                            style={{
                              backgroundColor: selectedTheme.accent,
                              width: s.level === 'Advanced' ? '90%' : s.level === 'Intermediate' ? '65%' : '40%',
                            }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kursus & Sertifikasi */}
              {kursus.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: selectedTheme.accent }}>Sertifikasi</h2>
                  <div className="space-y-2">
                    {kursus.map((s) => (
                      <div key={s.id} className="text-xs">
                        <p className="font-medium text-gray-800">{s.nama_kegiatan}</p>
                        {s.penyelenggara && <p className="text-gray-500">{s.penyelenggara}{s.tahun ? ` · ${s.tahun}` : ''}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Organisasi */}
              {organisasi.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: selectedTheme.accent }}>Organisasi</h2>
                  <div className="space-y-2">
                    {organisasi.map((s) => (
                      <div key={s.id} className="text-xs">
                        <p className="font-medium text-gray-800">{s.nama_kegiatan}</p>
                        {s.penyelenggara && <p className="text-gray-500">{s.penyelenggara}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Kontak sosmed */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-widest mb-3"
                  style={{ color: selectedTheme.accent }}>Kontak</h2>
                <div className="space-y-1.5 text-xs text-gray-700">
                  {profile?.no_whatsapp && <p>📱 {profile.no_whatsapp}</p>}
                  {profile?.email_publik && <p>✉ {profile.email_publik}</p>}
                  {profile?.alamat_koordinat && !profile.alamat_koordinat.startsWith('http') && (
                    <p>📍 {profile.alamat_koordinat.split(',')[0].trim()}</p>
                  )}
                  {profile?.linkedin_url && <p>🔗 {profile.linkedin_url.replace('https://www.linkedin.com/in/', 'linkedin.com/in/').replace('https://linkedin.com/in/', 'linkedin.com/in/')}</p>}
                  {profile?.github_url && <p>💻 {profile.github_url.replace('https://github.com/', 'github.com/')}</p>}
                </div>
              </div>
            </div>

            {/* Right main content */}
            <div className="flex-1 p-6 print:p-5">

              {/* Pengalaman */}
              {experience.length > 0 && (
                <div className="mb-7">
                  <h2 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4 border-b-2"
                    style={{ color: selectedTheme.accent, borderColor: selectedTheme.accent }}>
                    Pengalaman Kerja
                  </h2>
                  <div className="space-y-5">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: selectedTheme.light }}>
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white"
                          style={{ backgroundColor: selectedTheme.accent }} />
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{exp.jabatan}</p>
                            <p className="text-sm font-medium" style={{ color: selectedTheme.accent }}>{exp.perusahaan}</p>
                          </div>
                          <p className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                            {formatDate(exp.tanggal_mulai)} — {exp.masih_bekerja ? 'Sekarang' : formatDate(exp.tanggal_selesai || null)}
                          </p>
                        </div>
                        {exp.deskripsi_tugas && (
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mt-1">{exp.deskripsi_tugas}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pendidikan */}
              {education.length > 0 && (
                <div className="mb-7">
                  <h2 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4 border-b-2"
                    style={{ color: selectedTheme.accent, borderColor: selectedTheme.accent }}>
                    Riwayat Pendidikan
                  </h2>
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <div key={edu.id} className="relative pl-4 border-l-2" style={{ borderColor: selectedTheme.light }}>
                        <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full border-2 border-white"
                          style={{ backgroundColor: selectedTheme.accent }} />
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{edu.institusi}</p>
                            {edu.gelar && (
                              <p className="text-xs text-gray-600">{edu.gelar}{edu.jurusan ? ` — ${edu.jurusan}` : ''}</p>
                            )}
                            {(edu as any).ipk && (
                              <p className="text-xs font-medium mt-0.5" style={{ color: selectedTheme.accent }}>
                                IPK: {(edu as any).ipk}
                              </p>
                            )}
                            {edu.deskripsi && <p className="text-xs text-gray-500 mt-1">{edu.deskripsi}</p>}
                          </div>
                          {(edu.tahun_masuk || edu.tahun_lulus) && (
                            <p className="text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
                              {edu.tahun_masuk}{edu.tahun_masuk && edu.tahun_lulus ? ' — ' : ''}{edu.tahun_lulus}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pelatihan */}
              {skills.filter(s => s.type === 'pelatihan').length > 0 && (
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest pb-2 mb-4 border-b-2"
                    style={{ color: selectedTheme.accent, borderColor: selectedTheme.accent }}>
                    Pelatihan
                  </h2>
                  <div className="grid grid-cols-2 gap-2">
                    {skills.filter(s => s.type === 'pelatihan').map((s) => (
                      <div key={s.id} className="text-xs p-2 rounded-lg" style={{ backgroundColor: selectedTheme.light }}>
                        <p className="font-medium text-gray-800">{s.nama_kegiatan}</p>
                        {s.penyelenggara && <p className="text-gray-500">{s.penyelenggara}{s.tahun ? ` · ${s.tahun}` : ''}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-3 text-center text-xs text-gray-400 border-t border-gray-100 print:py-2">
            CV dibuat dengan MyPorto — myporto.id
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          aside, nav, .no-print { display: none !important; visibility: hidden !important; }
          body { margin: 0 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #cv-print { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; visibility: visible !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          #cv-print * { visibility: visible !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { margin: 0; size: A4; }
        }
      `}</style>
    </div>
  );
}
