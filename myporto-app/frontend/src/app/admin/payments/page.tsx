'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, Clock, XCircle, Users, CreditCard } from '@/components/ui/icons';
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

const STATUS_FILTERS = [
  { value: '', label: 'Semua', color: 'bg-gray-100 text-gray-700' },
  { value: 'PENDING', label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  { value: 'SUCCESS', label: 'Berhasil', color: 'bg-green-100 text-green-700' },
  { value: 'FAILED', label: 'Ditolak', color: 'bg-red-100 text-red-700' },
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('');
  const [confirming, setConfirming] = useState<number | null>(null);
  const [catatan, setCatatan] = useState('');
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const fetchData = (p = 1, status = filterStatus) => {
    setLoading(true);
    const q = status ? `&status=${status}` : '';
    api.get(`/payment/admin/list?page=${p}&limit=10${q}`).then((res) => {
      setPayments(res.data.payments);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    }).finally(() => setLoading(false));
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

  const statusConfig: Record<string, { icon: React.ReactNode; label: string; badge: string }> = {
    SUCCESS: { icon: <CheckCircle className="w-4 h-4 text-green-500" />, label: 'Berhasil', badge: 'bg-green-100 text-green-700' },
    PENDING: { icon: <Clock className="w-4 h-4 text-amber-500" />, label: 'Menunggu', badge: 'bg-amber-100 text-amber-700' },
    FAILED: { icon: <XCircle className="w-4 h-4 text-red-500" />, label: 'Ditolak', badge: 'bg-red-100 text-red-700' },
    EXPIRED: { icon: <XCircle className="w-4 h-4 text-gray-400" />, label: 'Kadaluarsa', badge: 'bg-gray-100 text-gray-500' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pembayaran</h1>
          <p className="text-gray-500 text-sm mt-1">
            Konfirmasi bukti transfer QRIS dari pengguna
            {total > 0 && <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{total} transaksi</span>}
          </p>
        </div>
        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button key={f.value}
              onClick={() => { setFilterStatus(f.value); setPage(1); fetchData(1, f.value); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                filterStatus === f.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {previewImg && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}>
          <div className="relative max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <img src={previewImg} alt="Bukti bayar" className="w-full rounded-2xl shadow-2xl" />
            <button onClick={() => setPreviewImg(null)}
              className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-red-500 font-bold text-lg">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
                <div className="h-6 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 flex flex-col items-center justify-center py-20 px-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Belum ada transaksi</p>
          <p className="text-gray-400 text-sm mt-1">
            {filterStatus ? `Tidak ada transaksi dengan status "${STATUS_FILTERS.find(f=>f.value===filterStatus)?.label}"` : 'Transaksi akan muncul di sini setelah pengguna melakukan pembayaran'}
          </p>
          {filterStatus && (
            <button onClick={() => { setFilterStatus(''); fetchData(1, ''); }}
              className="mt-4 text-sm text-blue-600 hover:underline">
              Lihat semua transaksi
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {payments.map((p) => {
            const sc = statusConfig[p.status] || statusConfig.FAILED;
            return (
              <div key={p.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  {/* Left: user info */}
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">
                        {(p.user.profile?.nama_lengkap || p.user.username).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{p.user.profile?.nama_lengkap || '-'}</p>
                      <p className="text-xs text-gray-500 truncate">{p.user.email} · @{p.user.username}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{p.order_id}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Right: amount + status */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-gray-900">Rp {Number(p.amount).toLocaleString('id-ID')}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${sc.badge}`}>
                      {sc.icon} {sc.label}
                    </span>
                    {p.confirmed_at && (
                      <p className="text-xs text-gray-400 mt-1">
                        Dikonfirmasi {new Date(p.confirmed_at).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Catatan admin */}
                {p.catatan_admin && (
                  <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-xs text-red-600">
                    📝 Catatan: {p.catatan_admin}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {p.bukti_bayar ? (
                    <button onClick={() => setPreviewImg(p.bukti_bayar!)}
                      className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      🖼 Lihat Bukti Transfer
                    </button>
                  ) : p.status === 'PENDING' ? (
                    <span className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg">
                      ⏳ Menunggu pengguna upload bukti
                    </span>
                  ) : null}

                  {p.status === 'PENDING' && p.bukti_bayar && (
                    confirming === p.id ? (
                      <div className="flex items-center gap-2 flex-1 flex-wrap">
                        <input value={catatan} onChange={e => setCatatan(e.target.value)}
                          placeholder="Catatan (opsional)"
                          className="flex-1 min-w-32 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <button onClick={() => handleConfirm(p.id, 'approve')}
                          className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors">
                          ✓ Setujui & Aktifkan
                        </button>
                        <button onClick={() => handleConfirm(p.id, 'reject')}
                          className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors">
                          ✗ Tolak
                        </button>
                        <button onClick={() => { setConfirming(null); setCatatan(''); }}
                          className="text-gray-400 text-xs hover:text-gray-600 px-2">
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirming(p.id)}
                        className="text-xs bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-100 font-medium transition-colors">
                        Konfirmasi Pembayaran
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => { setPage(p => p-1); fetchData(page-1); }}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => { setPage(p); fetchData(p); }}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p ? 'bg-blue-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {p}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => { setPage(p => p+1); fetchData(page+1); }}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
