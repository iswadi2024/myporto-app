'use client';

import { useEffect, useState, useRef } from 'react';
import { Upload, Bell } from '@/components/ui/icons';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingQris, setUploadingQris] = useState(false);
  const [qrisPreview, setQrisPreview] = useState<string | null>(null);
  const qrisRef = useRef<HTMLInputElement>(null);

  // Form states
  const [adminWa, setAdminWa] = useState('');
  const [fonnteToken, setFonnteToken] = useState('');
  const [merchantName, setMerchantName] = useState('');
  const [nmid, setNmid] = useState('');

  const fetchSettings = async () => {
    const res = await api.get('/admin/settings');
    const s = res.data.settings;
    setSettings(s);
    setAdminWa(s.admin_wa_number || '');
    setFonnteToken(s.fonnte_token || '');
    setMerchantName(s.qris_merchant_name || 'DIGIVA DESAIN TEMPLATE');
    setNmid(s.qris_nmid || 'ID1026471797831');
    if (s.qris_image_url) setQrisPreview(s.qris_image_url);
  };

  useEffect(() => { fetchSettings(); }, []);

  const saveSetting = async (key: string, value: string, label: string) => {
    setSaving(key);
    try {
      await api.put('/admin/settings', { key, value });
      setSettings(prev => ({ ...prev, [key]: value }));
      alert(`${label} berhasil disimpan`);
    } catch {
      alert('Gagal menyimpan');
    } finally {
      setSaving(null);
    }
  };

  const handleQrisFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setQrisPreview(URL.createObjectURL(file));
  };

  const handleUploadQris = async () => {
    const file = qrisRef.current?.files?.[0];
    if (!file) return;
    setUploadingQris(true);
    try {
      const form = new FormData();
      form.append('qris', file);
      const res = await api.post('/admin/settings/upload-qris', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setQrisPreview(res.data.url);
      setSettings(prev => ({ ...prev, qris_image_url: res.data.url }));
      alert('QR QRIS berhasil diupload!');
    } catch {
      alert('Gagal upload QR QRIS');
    } finally {
      setUploadingQris(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Platform</h1>
        <p className="text-gray-500 mt-1">Konfigurasi QRIS, notifikasi WhatsApp, dan info merchant</p>
      </div>

      <div className="max-w-3xl space-y-6">

        {/* ── QR QRIS ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-xl">📱</span> QR Code QRIS
          </h2>
          <p className="text-sm text-gray-500 mb-5">Upload gambar QR QRIS yang akan ditampilkan ke pengguna saat pembayaran</p>

          <div className="flex gap-6 items-start flex-wrap">
            {/* Preview */}
            <div className="flex-shrink-0">
              {qrisPreview ? (
                <div className="w-40 h-40 border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
                  <img src={qrisPreview} alt="QR QRIS" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                  <p className="text-xs text-gray-400 text-center px-2">Belum ada QR QRIS</p>
                </div>
              )}
            </div>

            {/* Upload */}
            <div className="flex-1 min-w-48">
              <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Klik untuk pilih gambar QR QRIS</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG — max 5MB</p>
                <input ref={qrisRef} type="file" accept="image/*" className="hidden" onChange={handleQrisFileChange} />
              </label>
              <button onClick={handleUploadQris} disabled={!qrisRef.current?.files?.length || uploadingQris}
                className="mt-3 w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 transition-colors">
                {uploadingQris ? 'Mengupload...' : '📤 Upload QR QRIS'}
              </button>

              {/* Merchant info */}
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nama Merchant</label>
                  <div className="flex gap-2">
                    <input value={merchantName} onChange={e => setMerchantName(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => saveSetting('qris_merchant_name', merchantName, 'Nama merchant')}
                      disabled={saving === 'qris_merchant_name'}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-50">
                      Simpan
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">NMID</label>
                  <div className="flex gap-2">
                    <input value={nmid} onChange={e => setNmid(e.target.value)}
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    <button onClick={() => saveSetting('qris_nmid', nmid, 'NMID')}
                      disabled={saving === 'qris_nmid'}
                      className="bg-gray-800 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-700 disabled:opacity-50">
                      Simpan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Notifikasi WhatsApp ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-green-500" /> Notifikasi WhatsApp
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Konfigurasi Fonnte untuk menerima notifikasi WA saat ada pembayaran masuk.
            Daftar gratis di{' '}
            <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">fonnte.com</a>
          </p>

          <div className="space-y-4">
            {/* Nomor WA Admin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor WA Admin <span className="text-gray-400 font-normal text-xs">(format: 628xxx)</span>
              </label>
              <div className="flex gap-2">
                <input value={adminWa} onChange={e => setAdminWa(e.target.value)}
                  placeholder="628123456789"
                  className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                <button onClick={() => saveSetting('admin_wa_number', adminWa, 'Nomor WA admin')}
                  disabled={saving === 'admin_wa_number' || !adminWa}
                  className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {saving === 'admin_wa_number' ? '...' : 'Simpan'}
                </button>
              </div>
              {settings.admin_wa_number && (
                <p className="text-xs text-green-600 mt-1.5">✓ Tersimpan: {settings.admin_wa_number}</p>
              )}
            </div>

            {/* Fonnte Token */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Fonnte Token <span className="text-gray-400 font-normal text-xs">(dari dashboard fonnte.com)</span>
              </label>
              <div className="flex gap-2">
                <input value={fonnteToken} onChange={e => setFonnteToken(e.target.value)}
                  type="password"
                  placeholder="Token dari Fonnte"
                  className="flex-1 border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" />
                <button onClick={() => saveSetting('fonnte_token', fonnteToken, 'Fonnte token')}
                  disabled={saving === 'fonnte_token' || !fonnteToken}
                  className="bg-green-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition-colors">
                  {saving === 'fonnte_token' ? '...' : 'Simpan'}
                </button>
              </div>
              {settings.fonnte_token && (
                <p className="text-xs text-green-600 mt-1.5">✓ Token tersimpan</p>
              )}
            </div>

            {/* Cara setup */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-2">Cara Setup Fonnte:</p>
              <ol className="space-y-1 text-xs list-decimal list-inside text-blue-700">
                <li>Buka <strong>fonnte.com</strong> → Daftar akun gratis</li>
                <li>Tambahkan device → Scan QR dengan WhatsApp Anda</li>
                <li>Salin <strong>Token</strong> dari halaman device</li>
                <li>Isi token di kolom di atas → Simpan</li>
                <li>Isi nomor WA admin (format 628xxx) → Simpan</li>
              </ol>
            </div>
          </div>
        </div>

        {/* ── Akun Admin ── */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h2 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
            🔐 Info Akun Admin
          </h2>
          <div className="text-sm text-amber-800 space-y-1">
            <p><strong>Email:</strong> admin@myporto.id</p>
            <p><strong>Password default:</strong> Admin@123456</p>
            <p className="text-xs text-amber-600 mt-2">
              ⚠ Jalankan <code className="bg-amber-100 px-1 rounded">npm run seed</code> di folder backend untuk membuat akun admin pertama kali.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
