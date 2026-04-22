'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { User, Settings } from '@/components/ui/icons';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();

  // Username form
  const [newUsername, setNewUsername] = useState('');
  const [usernamePassword, setUsernamePassword] = useState('');
  const [savingUsername, setSavingUsername] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const inputCls = 'w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors';

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !usernamePassword) return;

    const usernameRegex = /^[a-z0-9-]{3,30}$/;
    if (!usernameRegex.test(newUsername)) {
      toast({ title: 'Username tidak valid', description: 'Hanya huruf kecil, angka, dan tanda hubung (3-30 karakter)', variant: 'destructive' });
      return;
    }

    setSavingUsername(true);
    try {
      const res = await api.put('/auth/change-username', {
        new_username: newUsername,
        password: usernamePassword,
      });
      toast({ title: '✓ Username berhasil diubah!' });
      if (user) setUser({ ...user, username: res.data.user.username });
      setNewUsername('');
      setUsernamePassword('');
    } catch (err: any) {
      toast({ title: err.response?.data?.error || 'Gagal mengubah username', variant: 'destructive' });
    } finally {
      setSavingUsername(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) return;

    if (newPassword !== confirmPassword) {
      toast({ title: 'Password baru tidak cocok', variant: 'destructive' });
      return;
    }
    if (newPassword.length < 8) {
      toast({ title: 'Password minimal 8 karakter', variant: 'destructive' });
      return;
    }

    setSavingPassword(true);
    try {
      await api.put('/auth/change-password', {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast({ title: '✓ Password berhasil diubah!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast({ title: err.response?.data?.error || 'Gagal mengubah password', variant: 'destructive' });
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
        <p className="text-slate-500 mt-1">Ubah username dan password akun Anda</p>
      </div>

      {/* Info akun saat ini */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
            {user?.profile?.foto_closeup ? (
              <img src={user.profile.foto_closeup} alt="" className="w-12 h-12 rounded-full object-cover" />
            ) : (
              <span className="text-xl font-bold">
                {(user?.profile?.nama_lengkap || user?.username || 'U').charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-lg">{user?.profile?.nama_lengkap || user?.username}</p>
            <p className="text-blue-200 text-sm">@{user?.username} · {user?.email}</p>
          </div>
        </div>
      </div>

      {/* Ubah Username */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-5">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Ubah Username</h2>
            <p className="text-xs text-slate-500">Username saat ini: <strong>@{user?.username}</strong></p>
          </div>
        </div>

        <form onSubmit={handleChangeUsername} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Username Baru</label>
            <input
              value={newUsername}
              onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
              className={inputCls}
              placeholder="username-baru"
              minLength={3}
              maxLength={30}
            />
            <p className="text-xs text-slate-400 mt-1">Hanya huruf kecil, angka, dan tanda hubung (-). 3-30 karakter.</p>
            {newUsername && (
              <p className="text-xs mt-1 font-mono" style={{ color: /^[a-z0-9-]{3,30}$/.test(newUsername) ? '#16a34a' : '#dc2626' }}>
                {/^[a-z0-9-]{3,30}$/.test(newUsername) ? '✓ Format valid' : '✗ Format tidak valid'}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi dengan Password</label>
            <input
              type="password"
              value={usernamePassword}
              onChange={e => setUsernamePassword(e.target.value)}
              className={inputCls}
              placeholder="Masukkan password Anda"
            />
          </div>
          <button
            type="submit"
            disabled={savingUsername || !newUsername || !usernamePassword}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {savingUsername ? 'Menyimpan...' : 'Simpan Username'}
          </button>
        </form>
      </div>

      {/* Ubah Password */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">Ubah Password</h2>
            <p className="text-xs text-slate-500">Minimal 8 karakter</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password Saat Ini</label>
            <input
              type="password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className={inputCls}
              placeholder="Minimal 8 karakter"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className={inputCls}
              placeholder="Ulangi password baru"
            />
            {confirmPassword && newPassword !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">✗ Password tidak cocok</p>
            )}
            {confirmPassword && newPassword === confirmPassword && newPassword.length >= 8 && (
              <p className="text-xs text-green-600 mt-1">✓ Password cocok</p>
            )}
          </div>
          <button
            type="submit"
            disabled={savingPassword || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50"
          >
            {savingPassword ? 'Menyimpan...' : 'Simpan Password'}
          </button>
        </form>
      </div>

      {/* Warning */}
      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
        <strong>⚠ Perhatian:</strong> Setelah mengubah username, link portofolio Anda akan berubah. Pastikan update link di semua platform yang sudah Anda bagikan.
      </div>
    </div>
  );
}
