'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Experience } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { formatDate } from '@/lib/utils';

type ExperienceForm = Omit<Experience, 'id' | 'user_id'>;

export default function ExperiencePage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Experience[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<ExperienceForm>();
  const masihBekerja = watch('masih_bekerja');

  const fetchData = () => {
    api.get('/experience').then((res) => setItems(res.data.experience));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    reset({ masih_bekerja: false });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item: Experience) => {
    reset({
      ...item,
      tanggal_mulai: item.tanggal_mulai?.split('T')[0],
      tanggal_selesai: item.tanggal_selesai?.split('T')[0],
    });
    setEditId(item.id);
    setShowForm(true);
  };

  const onSubmit = async (data: ExperienceForm) => {
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/experience/${editId}`, data);
        toast({ title: 'Pengalaman berhasil diperbarui' });
      } else {
        await api.post('/experience', data);
        toast({ title: 'Pengalaman berhasil ditambahkan' });
      }
      setShowForm(false);
      fetchData();
    } catch {
      toast({ title: 'Gagal menyimpan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus data pengalaman ini?')) return;
    try {
      await api.delete(`/experience/${id}`);
      toast({ title: 'Pengalaman dihapus' });
      fetchData();
    } catch {
      toast({ title: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengalaman Kerja</h1>
          <p className="text-gray-500 mt-1">Tambahkan riwayat pekerjaan Anda</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {editId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan *</label>
                <input
                  {...register('perusahaan', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="PT. Contoh Indonesia"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan *</label>
                <input
                  {...register('jabatan', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Software Engineer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                <input
                  {...register('tanggal_mulai', { required: true })}
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Selesai</label>
                <input
                  {...register('tanggal_selesai')}
                  type="date"
                  disabled={!!masihBekerja}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                />
                <label className="flex items-center gap-2 mt-2 text-sm text-gray-600 cursor-pointer">
                  <input {...register('masih_bekerja')} type="checkbox" className="rounded" />
                  Masih bekerja di sini
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Tugas</label>
                <textarea
                  {...register('deskripsi_tugas')}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50">
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.jabatan}</h3>
                <p className="text-gray-700 text-sm">{item.perusahaan}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatDate(item.tanggal_mulai)} — {item.masih_bekerja ? 'Sekarang' : formatDate(item.tanggal_selesai || null)}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-500">
            <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada data pengalaman</p>
            <button onClick={openAdd} className="mt-3 text-blue-600 font-medium hover:underline">
              Tambah sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
