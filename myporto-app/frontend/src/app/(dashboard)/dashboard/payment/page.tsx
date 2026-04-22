'use client';

import { useEffect, useState, useRef } from 'react';
import { CheckCircle, Clock, XCircle, Upload } from '@/components/ui/icons';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { getPortfolioUrl } from '@/lib/utils';

interface Payment {
  id: number;
  order_id: string;
  amount: number;
  status: string;
  bukti_bayar?: string;
  catatan_admin?: string;
  confirmed_at?: string;
  created_at: string;
}

// QR QRIS DIGIVA DESAIN TEMPLATE — NMID: ID1026471797831
// Simpan file qris.png ke folder myporto-app/frontend/public/
// atau ganti dengan URL Cloudinary setelah upload
const QRIS_IMAGE_URL = process.env.NEXT_PUBLIC_QRIS_IMAGE_URL || '/qris.png';
const QRIS_MERCHANT_NAME = 'DIGIVA DESAIN TEMPLATE';
const QRIS_NMID = 'ID1026471797831';
const QRIS_BANK = 'Semua e-wallet & m-banking (GoPay, OVO, DANA, ShopeePay, BSI, dll)';

export default function PaymentPage() {
  const { user, setUser } = useAuthStore();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [activePayment, setActivePayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    const res = await api.get('/payment/history');
    const list: Payment[] = res.data.payments;
    setPayments(list);
    const pending = list.find(p => p.status === 'PENDING');
    const success = list.find(p => p.status === 'SUCCESS');
    setActivePayment(pending || null);
    if (pending?.bukti_bayar) setUploadDone(true);
    // Jika ada yang SUCCESS, refresh data user agar is_paid terupdate
    if (success) {
      const userRes = await api.get('/auth/me');
      setUser(userRes.data.user);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // Auto-polling setiap 15 detik setelah bukti diupload
  useEffect(() => {
    if (!uploadDone) return;
    const interval = setInterval(async () => {
      const res = await api.get('/payment/history');
      const list: Payment[] = res.data.payments;
      const success = list.find(p => p.status === 'SUCCESS');
      if (success) {
        clearInterval(interval);
        const userRes = await api.get('/auth/me');
        setUser(userRes.data.user);
        setPayments(list);
      }
    }, 15000);
    return () => clearInterval(interval);
  }, [uploadDone]);

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      await api.post('/payment/create');
      await fetchData();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Gagal membuat order');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file || !activePayment) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('bukti', file);
      await api.post(`/payment/${activePayment.id}/upload-bukti`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUploadDone(true);
      await fetchData();
    } catch (e: any) {
      alert(e.response?.data?.error || 'Gagal upload bukti');
    } finally {
      setUploading(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === 'SUCCESS') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'PENDING') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusLabel: Record<string, string> = {
    SUCCESS: 'Berhasil', PENDING: 'Menunggu Konfirmasi', FAILED: 'Ditolak', EXPIRED: 'Kadaluarsa',
  };

  // Sudah aktif
  if (user?.is_paid) {
    return (
      <div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Portofolio Sudah Aktif!</h2>
            <p className="text-green-700 mb-6">Portofolio Anda dapat diakses publik di:</p>
            <a href={getPortfolioUrl(user.username)} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-lg">
              🌐 {getPortfolioUrl(user.username)}
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pembayaran & Aktivasi</h1>
        <p className="text-gray-500 mt-1">Bayar via QRIS untuk mengaktifkan portofolio publik Anda</p>
      </div>

      <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Kiri: Info harga + QRIS */}
        <div className="space-y-4">
          {/* Harga */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <p className="text-blue-200 text-sm font-medium mb-1">AKTIVASI PORTOFOLIO</p>
            <p className="text-4xl font-bold mb-1">Rp 99.000</p>
            <p className="text-blue-200 text-sm">Bayar sekali, aktif selamanya</p>
            <div className="mt-4 space-y-2">
              {['Subdomain nama.myporto.id', 'Link publik yang bisa dibagikan', 'SEO otomatis', 'Semua fitur kustomisasi'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-blue-100">
                  <span className="text-green-300">✓</span> {f}
                </div>
              ))}
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
            <p className="font-semibold text-gray-800 mb-1">Scan QRIS untuk Membayar</p>
            <p className="text-xs text-gray-500 mb-4">Berlaku untuk semua e-wallet & m-banking</p>
            <div className="inline-block p-2 bg-white border-2 border-red-100 rounded-xl shadow-sm">
              <img src={QRIS_IMAGE_URL} alt="QRIS" className="w-52 h-52 object-contain" />
            </div>
            <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3">
              <p className="text-xs font-bold text-red-800 uppercase tracking-wide">{QRIS_MERCHANT_NAME}</p>
              <p className="text-xs text-gray-500 mt-0.5">NMID: {QRIS_NMID}</p>
              <p className="text-xs text-gray-500 mt-0.5">{QRIS_BANK}</p>
              <p className="text-lg font-bold text-gray-900 mt-2">Rp 99.000</p>
            </div>
            <p className="text-xs text-gray-400 mt-3">
              Pastikan nominal transfer tepat <strong>Rp 99.000</strong>
            </p>
          </div>
        </div>

        {/* Kanan: Langkah & Upload */}
        <div className="space-y-4">
          {/* Langkah */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Cara Pembayaran</h3>
            <div className="space-y-4">
              {[
                { step: '1', title: 'Buat Order', desc: 'Klik tombol "Buat Order Pembayaran" di bawah', done: !!activePayment },
                { step: '2', title: 'Scan & Bayar', desc: `Scan QR di atas dengan e-wallet atau m-banking, transfer tepat Rp 99.000`, done: !!activePayment },
                { step: '3', title: 'Upload Bukti', desc: 'Upload screenshot bukti transfer', done: uploadDone },
                { step: '4', title: 'Tunggu Konfirmasi', desc: 'Admin akan mengkonfirmasi dalam 1×24 jam', done: false },
              ].map((item) => (
                <div key={item.step} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    item.done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {item.done ? '✓' : item.step}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${item.done ? 'text-green-700' : 'text-gray-800'}`}>{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action area */}
          {!activePayment ? (
            <button onClick={handleCreateOrder} disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm">
              {loading ? 'Membuat order...' : '🛒 Buat Order Pembayaran'}
            </button>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono text-sm font-semibold text-gray-800">{activePayment.order_id}</p>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium bg-amber-100 text-amber-700 px-3 py-1.5 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> Menunggu Konfirmasi
                </span>
              </div>

              {uploadDone ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-green-800">Bukti bayar sudah diterima!</p>
                  <p className="text-xs text-green-600 mt-1">Admin akan mengkonfirmasi dalam 1×24 jam</p>
                  {activePayment.bukti_bayar && (
                    <a href={activePayment.bukti_bayar} target="_blank" rel="noopener noreferrer"
                      className="mt-2 inline-block text-xs text-blue-600 underline">
                      Lihat bukti yang diupload
                    </a>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-3">Upload Bukti Transfer</p>

                  {/* Preview */}
                  {previewUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden border border-gray-200">
                      <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-contain bg-gray-50" />
                    </div>
                  )}

                  <label className="block w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">{previewUrl ? 'Ganti foto' : 'Klik untuk pilih foto bukti transfer'}</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, max 5MB</p>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>

                  <button onClick={handleUpload} disabled={!previewUrl || uploading}
                    className="mt-3 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-40 text-sm">
                    {uploading ? 'Mengupload...' : '📤 Kirim Bukti Bayar'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Riwayat */}
      {payments.length > 0 && (
        <div className="mt-8 max-w-4xl">
          <h2 className="font-semibold text-gray-900 mb-3">Riwayat Transaksi</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {payments.map((p, i) => (
              <div key={p.id} className={`flex items-center justify-between p-4 ${i > 0 ? 'border-t border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  {statusIcon(p.status)}
                  <div>
                    <p className="text-sm font-medium text-gray-900 font-mono">{p.order_id}</p>
                    <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    {p.catatan_admin && <p className="text-xs text-red-500 mt-0.5">Catatan: {p.catatan_admin}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">Rp {Number(p.amount).toLocaleString('id-ID')}</p>
                  <p className={`text-xs font-medium ${p.status === 'SUCCESS' ? 'text-green-600' : p.status === 'PENDING' ? 'text-amber-600' : 'text-red-600'}`}>
                    {statusLabel[p.status] || p.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
