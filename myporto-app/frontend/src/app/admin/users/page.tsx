'use client';

import { useEffect, useState } from 'react';
import { Search, UserCheck, UserX, Trash2 } from '@/components/ui/icons';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface AdminUser {
  id: number;
  email: string;
  username: string;
  is_paid: boolean;
  is_active: boolean;
  created_at: string;
  profile?: { nama_lengkap: string };
}

export default function AdminUsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = (p = 1, q = '') => {
    api.get(`/admin/users?page=${p}&limit=20&search=${q}`)
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.pagination.totalPages);
      });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1, search);
  };

  const toggleStatus = async (id: number) => {
    try {
      await api.put(`/admin/users/${id}/toggle-status`);
      toast({ title: 'Status pengguna diperbarui' });
      fetchUsers(page, search);
    } catch {
      toast({ title: 'Gagal memperbarui status', variant: 'destructive' });
    }
  };

  const deleteUser = async (id: number) => {
    if (!confirm('Hapus pengguna ini? Tindakan ini tidak dapat dibatalkan.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast({ title: 'Pengguna dihapus' });
      fetchUsers(page, search);
    } catch {
      toast({ title: 'Gagal menghapus pengguna', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, email, username..."
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Pengguna</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Username</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Bergabung</th>
              <th className="text-right px-4 py-3 font-medium text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{user.profile?.nama_lengkap || '-'}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{user.username}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                    {user.is_paid && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Berbayar
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">
                  {new Date(user.created_at).toLocaleDateString('id-ID')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggleStatus(user.id)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}>
                      {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    </button>
                    <button onClick={() => deleteUser(user.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => { setPage(p); fetchUsers(p, search); }}
                className={`w-8 h-8 rounded-lg text-sm font-medium ${
                  page === p ? 'bg-blue-600 text-white' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
