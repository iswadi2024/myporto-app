'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { Education } from '@/types';
import { Printer } from '@/components/ui/icons';

const BULAN = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember',
];

function formatTanggalSurat(date: Date): string {
  return `${date.getDate()} ${BULAN[date.getMonth()]} ${date.getFullYear()}`;
}

// Ambil kota dari alamat teks biasa (bukan URL)
function extractKota(alamat?: string): string {
  if (!alamat) return 'Jakarta';
  // Jika berupa URL, abaikan
  if (alamat.startsWith('http')) return 'Jakarta';
  // Ambil bagian pertama sebelum koma atau newline
  return alamat.split(/[,\n]/)[0].trim() || 'Jakarta';
}

export default function CoverLetterPage() {
  const { user } = useAuthStore();
  const [education, setEducation] = useState<Education[]>([]);
  const [tujuanPerusahaan, setTujuanPerusahaan] = useState('');
  const [posisi, setPosisi] = useState('');
  const [kotaOverride, setKotaOverride] = useState('');
  const today = new Date();

  useEffect(() => {
    api.get('/education').then((res) => setEducation(res.data.education));
  }, []);

  const profile = user?.profile;
  const pendidikanTerakhir = education[0];
  const tanggalSurat = formatTanggalSurat(today);

  // Alamat teks (bukan URL)
  const alamatTeks = profile?.alamat_koordinat?.startsWith('http')
    ? '' : (profile?.alamat_koordinat || '');

  const kotaAsal = kotaOverride || extractKota(profile?.alamat_koordinat);
  const isReady = tujuanPerusahaan.trim() && posisi.trim();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ── Toolbar (hidden on print) ── */}
      <div className="print:hidden bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-lg font-bold text-gray-900">Surat Lamaran Kerja</h1>
            <p className="text-xs text-gray-500">Isi kolom di bawah, lalu cetak atau simpan sebagai PDF</p>
          </div>
          <button onClick={() => window.print()} disabled={!isReady}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
            <Printer className="w-4 h-4" />
            Cetak / Simpan PDF
          </button>
        </div>
      </div>

      {/* ── Form input (hidden on print) ── */}
      <div className="print:hidden max-w-4xl mx-auto px-4 pt-6 pb-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4 text-sm">Isi Data Lamaran</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Nama Perusahaan / Instansi *</label>
              <input value={tujuanPerusahaan} onChange={(e) => setTujuanPerusahaan(e.target.value)}
                placeholder="PT. Contoh Indonesia"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Posisi yang Dilamar *</label>
              <input value={posisi} onChange={(e) => setPosisi(e.target.value)}
                placeholder="Frontend Developer"
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">
                Kota <span className="text-gray-400 font-normal">(otomatis dari profil)</span>
              </label>
              <input value={kotaOverride} onChange={(e) => setKotaOverride(e.target.value)}
                placeholder={kotaAsal}
                className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
            </div>
          </div>
          {!isReady && (
            <p className="text-xs text-amber-600 mt-3">* Isi nama perusahaan dan posisi untuk mengaktifkan tombol cetak</p>
          )}
        </div>
      </div>

      {/* ── Surat (A4 preview) ── */}
      <div className="max-w-4xl mx-auto pb-8 px-4 print:p-0 print:max-w-none">
        <div id="letter-print"
          className="bg-white shadow-xl print:shadow-none"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '12pt',
            lineHeight: '1.8',
            color: '#111',
            padding: '2.5cm 3cm',
            minHeight: '29.7cm',
            width: '21cm',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}>

          {/* Tanggal */}
          <div style={{ textAlign: 'right', marginBottom: '1.5cm' }}>
            {kotaAsal}, {tanggalSurat}
          </div>

          {/* Kepada */}
          <div style={{ marginBottom: '1cm' }}>
            <div>Kepada Yth.</div>
            <div>HRD / Manajer Rekrutmen</div>
            <div style={{ fontWeight: 'bold' }}>{tujuanPerusahaan || '[Nama Perusahaan]'}</div>
            <div>di Tempat</div>
          </div>

          {/* Perihal */}
          <div style={{ marginBottom: '1cm' }}>
            <span style={{ fontWeight: 'bold' }}>Perihal</span>
            {' : Lamaran Pekerjaan sebagai '}
            <span style={{ fontWeight: 'bold' }}>{posisi || '[Posisi yang Dilamar]'}</span>
          </div>

          {/* Salam */}
          <div style={{ marginBottom: '0.5cm' }}>Dengan hormat,</div>

          {/* Pembuka */}
          <div style={{ marginBottom: '0.4cm', textAlign: 'justify' }}>
            Saya yang bertanda tangan di bawah ini:
          </div>

          {/* Data diri */}
          <table style={{ marginLeft: '1.5cm', marginBottom: '0.8cm', borderCollapse: 'separate', borderSpacing: '0 3px' }}>
            <tbody>
              {[
                ['Nama Lengkap', profile?.nama_lengkap || '-'],
                ['Tempat, Tanggal Lahir', '-'],
                ['Pendidikan Terakhir', pendidikanTerakhir
                  ? `${pendidikanTerakhir.gelar || ''} ${pendidikanTerakhir.jurusan ? '- ' + pendidikanTerakhir.jurusan : ''} (${pendidikanTerakhir.institusi})`.trim()
                  : '-'],
                ['No. Telepon / WA', profile?.no_whatsapp || '-'],
                ['Email', profile?.email_publik || '-'],
                ['Alamat', alamatTeks || '-'],
              ].map(([label, value]) => (
                <tr key={label}>
                  <td style={{ paddingRight: '12px', verticalAlign: 'top', minWidth: '190px' }}>{label}</td>
                  <td style={{ paddingRight: '8px', verticalAlign: 'top' }}>:</td>
                  <td style={{ verticalAlign: 'top' }}>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paragraf isi */}
          <div style={{ marginBottom: '0.5cm', textAlign: 'justify' }}>
            Dengan ini saya mengajukan permohonan untuk dapat bergabung dan bekerja di{' '}
            <strong>{tujuanPerusahaan || '[Nama Perusahaan]'}</strong> pada posisi{' '}
            <strong>{posisi || '[Posisi yang Dilamar]'}</strong>.
            Saya memiliki minat yang besar terhadap bidang ini dan yakin dapat memberikan kontribusi
            yang berarti bagi kemajuan perusahaan.
          </div>

          <div style={{ marginBottom: '0.5cm', textAlign: 'justify' }}>
            Saya memiliki latar belakang pendidikan dan pengalaman yang relevan dengan posisi yang
            dilamar. Saya adalah pribadi yang disiplin, bertanggung jawab, mampu bekerja secara
            mandiri maupun dalam tim, serta memiliki kemampuan komunikasi yang baik. Saya siap
            untuk terus belajar dan berkembang sesuai dengan kebutuhan perusahaan.
          </div>

          <div style={{ marginBottom: '0.4cm', textAlign: 'justify' }}>
            Sebagai bahan pertimbangan, bersama surat lamaran ini saya lampirkan:
          </div>

          <ol style={{ marginLeft: '2cm', marginBottom: '0.8cm', paddingLeft: '0' }}>
            <li>Daftar Riwayat Hidup (CV)</li>
            <li>Fotokopi Ijazah dan Transkrip Nilai</li>
            <li>Fotokopi KTP</li>
            <li>Pas Foto terbaru</li>
            <li>Sertifikat pendukung (jika ada)</li>
          </ol>

          <div style={{ marginBottom: '1cm', textAlign: 'justify' }}>
            Besar harapan saya untuk dapat diberikan kesempatan wawancara guna menjelaskan lebih
            lanjut mengenai kemampuan dan pengalaman saya. Atas perhatian dan kesempatan yang
            diberikan, saya mengucapkan terima kasih.
          </div>

          {/* Penutup & TTD */}
          <div>
            <div style={{ marginBottom: '2.5cm' }}>Hormat saya,</div>
            <div style={{ fontWeight: 'bold' }}>{profile?.nama_lengkap || '[Nama Lengkap]'}</div>
          </div>
        </div>
      </div>

      {/* ── Print CSS ── */}
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          body > * { display: none !important; }
          #letter-print {
            display: block !important;
            position: static !important;
            width: 21cm !important;
            min-height: 29.7cm !important;
            margin: 0 !important;
            padding: 2.5cm 3cm !important;
            box-shadow: none !important;
            font-family: "Times New Roman", Times, serif !important;
            font-size: 12pt !important;
            line-height: 1.8 !important;
            color: #111 !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
