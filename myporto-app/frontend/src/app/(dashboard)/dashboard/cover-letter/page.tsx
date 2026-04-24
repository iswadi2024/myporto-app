'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Education } from '@/types';
import { Printer, Plus, Trash2 } from '@/components/ui/icons';

const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function formatTanggal(date: Date): string {
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTTL(tempat?: string, tanggal?: string): string {
  if (!tempat && !tanggal) return '-';
  const parts: string[] = [];
  if (tempat) parts.push(tempat);
  if (tanggal) {
    try { parts.push(formatTanggal(new Date(tanggal))); } catch { parts.push(tanggal); }
  }
  return parts.join(', ');
}

function extractKota(alamat?: string): string {
  if (!alamat || alamat.startsWith('http')) return 'Jakarta';
  return alamat.split(/[,\n]/)[0].trim() || 'Jakarta';
}

const DEFAULT_LAMPIRAN = [
  'Daftar Riwayat Hidup (CV)',
  'Fotokopi Ijazah dan Transkrip Nilai',
  'Fotokopi KTP',
  'Pas Foto terbaru (4×6)',
  'Sertifikat pendukung',
];

export default function CoverLetterPage() {
  const { user } = useAuthStore();
  const [education, setEducation] = useState<Education[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [tujuanPerusahaan, setTujuanPerusahaan] = useState('');
  const [posisi, setPosisi] = useState('');
  const [kotaOverride, setKotaOverride] = useState('');
  const [lampiran, setLampiran] = useState<string[]>(DEFAULT_LAMPIRAN);
  const [newLampiran, setNewLampiran] = useState('');
  const today = new Date();

  useEffect(() => {
    api.get('/education').then((res) => setEducation(res.data.education || []));
    api.get('/profile').then((res) => setProfile(res.data.profile || null));
  }, []);

  // Fallback: jika profile dari API tidak punya TTL, coba dari store
  const profileData = profile || user?.profile || null;
  const pendidikanTerakhir = education[0];
  const tanggalSurat = formatTanggal(today);

  // Alamat: hanya tampilkan teks, bukan URL
  const alamatRaw = profileData?.alamat_koordinat || '';
  const alamatTeks = alamatRaw.startsWith('http') ? '' : alamatRaw;
  const kotaAsal = kotaOverride || extractKota(profileData?.alamat_koordinat);
  const ttl = formatTTL((profileData as any)?.tempat_lahir, (profileData as any)?.tanggal_lahir);
  const isReady = tujuanPerusahaan.trim() && posisi.trim();

  const addLampiran = () => {
    if (!newLampiran.trim()) return;
    setLampiran(prev => [...prev, newLampiran.trim()]);
    setNewLampiran('');
  };

  const removeLampiran = (i: number) => setLampiran(prev => prev.filter((_, idx) => idx !== i));

  const handlePrint = () => window.print();

  return (
    <>
      {/* Print styles — harus di luar wrapper agar tidak tersembunyi */}
      <style>{`
        @media print {
          /* Sembunyikan elemen UI */
          aside, nav, .no-print { display: none !important; }
          
          /* Reset body */
          body { margin: 0 !important; background: white !important; }
          
          /* Tampilkan hanya letter-wrap */
          #letter-wrap { display: block !important; visibility: visible !important; }
          #letter-print { visibility: visible !important; box-shadow: none !important; }
          #letter-print * { visibility: visible !important; }
          
          /* Warna border tercetak */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          
          @page { size: A4 portrait; margin: 1cm; }
        }
      `}</style>

      <div className="bg-slate-100 -m-8 min-h-screen">
        {/* Toolbar */}
        <div className="no-print bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Surat Lamaran Kerja</h1>
              <p className="text-xs text-gray-500">Data diambil otomatis dari profil Anda</p>
            </div>
            <button onClick={handlePrint} disabled={!isReady}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-40">
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="no-print max-w-4xl mx-auto px-4 pt-6 pb-4 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4 text-sm">Data Lamaran</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Perusahaan *</label>
                <input value={tujuanPerusahaan} onChange={e => setTujuanPerusahaan(e.target.value)}
                  placeholder="PT. Contoh Indonesia"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Posisi yang Dilamar *</label>
                <input value={posisi} onChange={e => setPosisi(e.target.value)}
                  placeholder="Frontend Developer"
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kota (dari profil: {kotaAsal})</label>
                <input value={kotaOverride} onChange={e => setKotaOverride(e.target.value)}
                  placeholder={kotaAsal}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            {!isReady && <p className="text-xs text-amber-600 mt-3">* Isi nama perusahaan dan posisi untuk mengaktifkan tombol cetak</p>}
          </div>

          {/* Lampiran */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4 text-sm">Daftar Lampiran</h2>
            <div className="space-y-2 mb-3">
              {lampiran.map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-xs font-bold text-blue-600 w-5">{i + 1}.</span>
                  <span className="flex-1 text-sm text-gray-700">{item}</span>
                  <button onClick={() => removeLampiran(i)} className="text-gray-300 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={newLampiran} onChange={e => setNewLampiran(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addLampiran()}
                placeholder="Tambah lampiran..."
                className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={addLampiran}
                className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
          </div>

          {/* Info sinkron */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
            <strong>Data profil:</strong> {profileData?.nama_lengkap || '-'} · TTL: {ttl} · WA: {profileData?.no_whatsapp || '-'}
            {(!(profileData as any)?.tempat_lahir || !(profileData as any)?.tanggal_lahir) && (
              <span className="ml-2 text-amber-600">⚠ <a href="/dashboard/profile" className="underline">Lengkapi TTL di Profil</a></span>
            )}
          </div>
        </div>

        {/* Surat A4 */}
        <div id="letter-wrap" className="max-w-4xl mx-auto pb-8 px-4">
          <div id="letter-print" className="bg-white shadow-2xl relative"
            style={{
              fontFamily: '"Times New Roman", Times, serif',
              fontSize: '12pt',
              lineHeight: '1.8',
              color: '#111',
              minHeight: '27cm',
              width: '19cm',
              margin: '0 auto',
              boxSizing: 'border-box' as const,
              overflow: 'hidden',
            }}>

            {/* Border dekoratif — dikurangi agar tidak terpotong */}
            <div style={{ position: 'absolute', inset: 0, border: '8px solid #1e3a8a', pointerEvents: 'none', zIndex: 1, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties} />
            <div style={{ position: 'absolute', inset: '11px', border: '2px solid #3b82f6', pointerEvents: 'none', zIndex: 1, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties} />
            <div style={{ position: 'absolute', inset: '15px', border: '1px solid #bfdbfe', pointerEvents: 'none', zIndex: 1, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties} />

            {/* Ornamen sudut */}
            {([
              { top: 4, left: 4, borderTop: '3px solid #f59e0b', borderLeft: '3px solid #f59e0b' },
              { top: 4, right: 4, borderTop: '3px solid #f59e0b', borderRight: '3px solid #f59e0b' },
              { bottom: 4, left: 4, borderBottom: '3px solid #f59e0b', borderLeft: '3px solid #f59e0b' },
              { bottom: 4, right: 4, borderBottom: '3px solid #f59e0b', borderRight: '3px solid #f59e0b' },
            ] as React.CSSProperties[]).map((style, i) => (
              <div key={i} style={{ position: 'absolute', width: 20, height: 20, zIndex: 2, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact', ...style } as React.CSSProperties} />
            ))}

            {/* Konten — padding lebih kecil agar muat */}
            <div style={{ padding: '1.5cm 2cm', position: 'relative', zIndex: 3 }}>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '0.6cm', paddingBottom: '0.3cm', borderBottom: '2px solid #1e3a8a' }}>
                <div style={{ fontSize: '13pt', color: '#1e3a8a', fontWeight: 'bold', letterSpacing: '2px' }}>
                  SURAT LAMARAN PEKERJAAN
                </div>
              </div>

              {/* Tanggal */}
              <div style={{ textAlign: 'right', marginBottom: '0.8cm' }}>
                {kotaAsal}, {tanggalSurat}
              </div>

              {/* Kepada */}
              <div style={{ marginBottom: '0.6cm' }}>
                <div>Kepada Yth.</div>
                <div>Bapak/Ibu HRD / Manajer Rekrutmen</div>
                <div style={{ fontWeight: 'bold' }}>{tujuanPerusahaan || '[Nama Perusahaan / Instansi]'}</div>
                <div>di Tempat</div>
              </div>

              {/* Perihal */}
              <div style={{ marginBottom: '0.6cm' }}>
                <strong>Perihal</strong>{' : Lamaran Pekerjaan sebagai '}
                <strong>{posisi || '[Posisi yang Dilamar]'}</strong>
              </div>

              <div style={{ marginBottom: '0.3cm' }}>Dengan hormat,</div>

              <div style={{ marginBottom: '0.3cm', textAlign: 'justify' }}>
                Saya yang bertanda tangan di bawah ini:
              </div>

              {/* Data diri */}
              <table style={{ marginLeft: '1.5cm', marginBottom: '0.5cm', borderCollapse: 'separate', borderSpacing: '0 2px' }}>
                <tbody>
                  {[
                    ['Nama Lengkap', profileData?.nama_lengkap || '-'],
                    ['Tempat, Tanggal Lahir', ttl],
                    ['Pendidikan Terakhir', pendidikanTerakhir
                      ? `${pendidikanTerakhir.jenjang ? pendidikanTerakhir.jenjang + ' - ' : ''}${pendidikanTerakhir.gelar || ''} ${pendidikanTerakhir.jurusan ? '- ' + pendidikanTerakhir.jurusan : ''} (${pendidikanTerakhir.institusi})`.trim()
                      : '-'],
                    ['No. Telepon / WA', profileData?.no_whatsapp || '-'],
                    ['Email', profileData?.email_publik || '-'],
                    ['Alamat', alamatTeks || '-'],
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ paddingRight: '12px', verticalAlign: 'top', minWidth: '185px' }}>{label}</td>
                      <td style={{ paddingRight: '8px', verticalAlign: 'top' }}>:</td>
                      <td style={{ verticalAlign: 'top' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ marginBottom: '0.4cm', textAlign: 'justify' }}>
                Dengan ini saya mengajukan permohonan untuk dapat bergabung dan bekerja di{' '}
                <strong>{tujuanPerusahaan || '[Nama Perusahaan]'}</strong> pada posisi{' '}
                <strong>{posisi || '[Posisi yang Dilamar]'}</strong>.
                Saya memiliki minat yang besar terhadap bidang ini dan yakin dapat memberikan kontribusi yang berarti bagi kemajuan perusahaan.
              </div>

              <div style={{ marginBottom: '0.4cm', textAlign: 'justify' }}>
                Saya adalah pribadi yang disiplin, bertanggung jawab, mampu bekerja secara mandiri maupun dalam tim, serta memiliki kemampuan komunikasi yang baik. Saya siap untuk terus belajar dan berkembang sesuai dengan kebutuhan perusahaan.
              </div>

              <div style={{ marginBottom: '0.3cm' }}>
                Sebagai bahan pertimbangan, bersama surat lamaran ini saya lampirkan:
              </div>

              <ol style={{ 
                marginLeft: '1.5cm', 
                marginBottom: '0.5cm', 
                paddingLeft: '0.5cm',
                listStyleType: 'decimal',
                listStylePosition: 'outside',
              }}>
                {lampiran.map((item, i) => (
                  <li key={i} style={{ marginBottom: '2px', paddingLeft: '4px' }}>{item}</li>
                ))}
              </ol>

              <div style={{ marginBottom: '0.6cm', textAlign: 'justify' }}>
                Besar harapan saya untuk dapat diberikan kesempatan wawancara guna menjelaskan lebih lanjut mengenai kemampuan dan pengalaman saya. Atas perhatian dan kesempatan yang diberikan, saya mengucapkan terima kasih.
              </div>

              {/* TTD */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                  <div>Hormat saya,</div>
                  <div style={{ height: '2cm' }} />
                  <div style={{ fontWeight: 'bold', borderTop: '1px solid #333', paddingTop: '4px' }}>
                    {profileData?.nama_lengkap || '[Nama Lengkap]'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
