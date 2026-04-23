'use client';

import { useEffect, useState, useRef } from 'react';
import { Upload, Bell } from '@/components/ui/icons';
import api from '@/lib/api';

function AdminPasswordForm() {
  const [current, setCurrent] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPwd !== confirm) { setMsg({ type: 'error', text: 'Password baru tidak cocok' }); return; }
    if (newPwd.length < 8) { setMsg({ type: 'error', text: 'Password minimal 8 karakter' }); return; }
    setSaving(true);
    setMsg(null);
    try {
      await api.put('/auth/change-password', { current_password: current, new_password: newPwd });
      setMsg({ type: 'success', text: '✓ Password berhasil diubah!' });
      setCurrent(''); setNewPwd(''); setConfirm('');
    } catch (err: any) {
      setMsg({ type: 'error', text: err.response?.data?.error || 'Gagal mengubah password' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {msg.text}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Saat Ini</label>
        <input type="password" value={current} onChange={e => setCurrent(e.target.value)} className={inputCls} placeholder="••••••••" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
        <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} className={inputCls} placeholder="Minimal 8 karakter" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className={inputCls} placeholder="Ulangi password baru" required />
        {confirm && newPwd !== confirm && <p className="text-xs text-red-500 mt-1">✗ Password tidak cocok</p>}
        {confirm && newPwd === confirm && newPwd.length >= 8 && <p className="text-xs text-green-600 mt-1">✓ Password cocok</p>}
      </div>
      <button type="submit" disabled={saving || !current || !newPwd || !confirm || newPwd !== confirm}
        className="bg-red-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition-colors">
        {saving ? 'Menyimpan...' : '🔒 Ubah Password Admin'}
      </button>
      <p className="text-xs text-gray-400">Setelah mengubah password, Anda perlu login ulang.</p>
    </form>
  );
}

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

        {/* ── Keamanan Akun Admin ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <span className="text-xl">🔐</span> Keamanan Akun Admin
          </h2>
          <p className="text-sm text-gray-500 mb-5">Ubah password akun admin untuk keamanan yang lebih baik</p>
          <AdminPasswordForm />
        </div>

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

      </div>
    </div>
  );
}
