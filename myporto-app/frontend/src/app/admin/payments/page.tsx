'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle } from '@/components/ui/icons';
import api from '@/lib/api';

interface AdminPayment {
  id: number;
  order_id: string;
  amount: number;
  status: string;
  bukti_bayar?: string;
  catatan_admin?: string;
  confirmed_at?: string;
  created_at: string;
  user: {
    email: string;
    username: string;
    profile?: { nama_lengkap: string };
  };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [confirming, setConfirming] = useState<number | null>(null);
  const [catatan, setCatatan] = useState('');
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const fetchData = (p = 1, status = filterStatus) => {
    const q = status ? `&status=${status}` : '';
    api.get(`/payment/admin/list?page=${p}&limit=20${q}`).then((res) => {
      setPayments(res.data.payments);
      setTotalPages(res.data.pagination.totalPages);
    });
  };

  useEffect(() => { fetchData(); }, []);

  const handleConfirm = async (id: number, action: 'approve' | 'reject') => {
    try {
      await api.put(`/payment/admin/${id}/confirm`, { action, catatan });
      setConfirming(null);
      setCatatan('');
      fetchData(page);
    } catch (e: any) {
      alert(e.response?.data?.error || 'Gagal');
    }
  };

  const statusIcon = (status: string) => {
    if (status === 'SUCCESS') return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (status === 'PENDING') return <Clock className="w-4 h-4 text-amber-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const statusLabel: Record<string, string> = {
    SUCCESS: 'Berhasil', PENDING: 'Menunggu', FAILED: 'Ditolak', EXPIRED: 'Kadaluarsa',
  };

  return (
    <div>
      {/* Preview modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4" onClick={() => setPreviewImg(null)}>
          <img src={previewImg} alt="Bukti bayar" className="max-w-lg max-h-screen rounded-xl shadow-2xl" />
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pembayaran QRIS</h1>
          <p className="text-gray-500 mt-1">Konfirmasi bukti transfer dari pengguna</p>
        </div>
        <div className="flex gap-2">
          {['', 'PENDING', 'SUCCESS', 'FAILED'].map((s) => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); fetchData(1, s); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {s || 'Semua'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {payments.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {statusIcon(p.status)}
                <div>
                  <p className="font-semibold text-gray-900">{p.user.profile?.nama_lengkap || '-'}</p>
                  <p className="text-xs text-gray-500">{p.user.email} · @{p.user.username}</p>
                  <p className="text-xs font-mono text-gray-600 mt-1">{p.order_id}</p>
                  <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  {p.catatan_admin && <p className="text-xs text-red-500 mt-1">Catatan: {p.catatan_admin}</p>}
                </div>
              </div>

              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">Rp {Number(p.amount).toLocaleString('id-ID')}</p>
                <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                  p.status === 'SUCCESS' ? 'bg-green-100 text-green-700' :
                  p.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                }`}>
                  {statusLabel[p.status]}
                </span>
              </div>
            </div>

            {/* Bukti bayar */}
            {p.bukti_bayar && (
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => setPreviewImg(p.bukti_bayar!)}
                  className="flex items-center gap-2 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100">
                  🖼 Lihat Bukti Transfer
                </button>
                {p.status === 'PENDING' && (
                  <>
                    {confirming === p.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input value={catatan} onChange={e => setCatatan(e.target.value)}
                          placeholder="Catatan (opsional)"
                          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => handleConfirm(p.id, 'approve')}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700">
                          ✓ Setujui
                        </button>
                        <button onClick={() => handleConfirm(p.id, 'reject')}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-600">
                          ✗ Tolak
                        </button>
                        <button onClick={() => setConfirming(null)}
                          className="text-gray-400 text-xs hover:text-gray-600">Batal</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirming(p.id)}
                        className="text-xs bg-gray-100 text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-200">
                        Konfirmasi Pembayaran
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Belum upload bukti */}
            {!p.bukti_bayar && p.status === 'PENDING' && (
              <p className="mt-2 text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg inline-block">
                ⏳ Menunggu pengguna upload bukti transfer
              </p>
            )}
          </div>
        ))}

        {payments.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>Tidak ada data pembayaran</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => { setPage(p); fetchData(p); }}
              className={`w-8 h-8 rounded-lg text-sm font-medium ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
