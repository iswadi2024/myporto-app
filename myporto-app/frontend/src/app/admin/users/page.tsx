'use client';

import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Trash2, Users } from '@/components/ui/icons';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface AdminUser {
  id: number;
  email: string;
  username: string;
  is_paid: boolean;
  is_active: boolean;
  created_at: string;
  profile?: { nama_lengkap: string; foto_closeup?: string };
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchUsers = (p = 1, q = search) => {
    setLoading(true);
    api.get(`/admin/users?page=${p}&limit=10&search=${q}`)
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.pagination.totalPages);
        setTotal(res.data.pagination.total);
      }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search);
  };

  const toggleStatus = async (id: number, name: string) => {
    if (!confirm(`Ubah status akun "${name}"?`)) return;
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      toast({ title: 'Status pengguna diperbarui' });
      fetchUsers(page);
    } catch {
      toast({ title: 'Gagal memperbarui status', variant: 'destructive' });
    }
  };

  const deleteUser = async (id: number, name: string) => {
    if (!confirm(`Hapus akun "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast({ title: 'Pengguna dihapus' });
      fetchUsers(page);
    } catch {
      toast({ title: 'Gagal menghapus pengguna', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1">
            Kelola akun pengguna platform
            {total > 0 && <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded-full">{total} pengguna</span>}
          </p>
        </div>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, username..."
              className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white"
            />
          </div>
          <button type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium">
            Cari
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="divide-y divide-gray-100">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
                <div className="h-6 bg-gray-100 rounded w-16" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              {search ? `Tidak ada pengguna dengan kata kunci "${search}"` : 'Belum ada pengguna terdaftar'}
            </p>
            {search && (
              <button onClick={() => { setSearch(''); fetchUsers(1, ''); }}
                className="mt-3 text-sm text-blue-600 hover:underline">
                Hapus pencarian
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">Pengguna</div>
              <div className="col-span-2">Username</div>
              <div className="col-span-3">Status</div>
              <div className="col-span-2">Bergabung</div>
              <div className="col-span-1 text-right">Aksi</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                  {/* User info */}
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {user.profile?.foto_closeup ? (
                        <img src={user.profile.foto_closeup} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-600 font-bold text-sm">
                          {(user.profile?.nama_lengkap || user.username).charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{user.profile?.nama_lengkap || '-'}</p>
                      <p className="text-gray-400 text-xs truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Username */}
                  <div className="col-span-2">
                    <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">
                      @{user.username}
                    </span>
                  </div>

                  {/* Status badges */}
                  <div className="col-span-3 flex gap-1.5 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.is_active ? '● Aktif' : '● Nonaktif'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      user.is_paid ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {user.is_paid ? '✓ Berbayar' : 'Draft'}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="col-span-2 text-xs text-gray-400">
                    {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex justify-end gap-1">
                    <button
                      onClick={() => toggleStatus(user.id, user.profile?.nama_lengkap || user.username)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        user.is_active
                          ? 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                          : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                      }`}
                      title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                      {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id, user.profile?.nama_lengkap || user.username)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus pengguna">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button disabled={page === 1} onClick={() => { setPage(p => p-1); fetchUsers(page-1); }}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
            ← Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => { setPage(p); fetchUsers(p); }}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === p ? 'bg-blue-600 text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}>
              {p}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => { setPage(p => p+1); fetchUsers(page+1); }}
            className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40">
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
