'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { Education } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type EducationForm = Omit<Education, 'id' | 'user_id'>;

export default function EducationPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<Education[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset } = useForm<EducationForm>();

  const fetchData = () => {
    api.get('/education').then((res) => setItems(res.data.education));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    reset({});
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item: Education) => {
    reset(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const onSubmit = async (data: EducationForm) => {
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/education/${editId}`, data);
        toast({ title: 'Pendidikan berhasil diperbarui' });
      } else {
        await api.post('/education', data);
        toast({ title: 'Pendidikan berhasil ditambahkan' });
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
    if (!confirm('Hapus data pendidikan ini?')) return;
    try {
      await api.delete(`/education/${id}`);
      toast({ title: 'Pendidikan dihapus' });
      fetchData();
    } catch {
      toast({ title: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pendidikan</h1>
          <p className="text-gray-500 mt-1">Tambahkan riwayat pendidikan formal Anda</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Tambah
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-xl border border-blue-200 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">
            {editId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Institusi *</label>
                <input
                  {...register('institusi', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Universitas / Sekolah"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gelar</label>
                <input
                  {...register('gelar')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="S.Kom, S.T, dll"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jurusan</label>
                <input
                  {...register('jurusan')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Teknik Informatika"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Masuk</label>
                <input
                  {...register('tahun_masuk')}
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2018"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun Lulus</label>
                <input
                  {...register('tahun_lulus')}
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2022"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IPK <span className="text-gray-400 font-normal">(opsional, maks. 4.00)</span>
                </label>
                <input
                  {...register('ipk')}
                  type="number"
                  step="0.01"
                  min="0"
                  max="4"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3.85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenjang <span className="text-gray-400 font-normal">(opsional)</span>
                </label>
                <select
                  {...register('jenjang')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Jenjang --</option>
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA/SMK</option>
                  <option value="D1">D1</option>
                  <option value="D2">D2</option>
                  <option value="D3">D3</option>
                  <option value="D4">D4</option>
                  <option value="S1">S1</option>
                  <option value="S2">S2</option>
                  <option value="S3">S3</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium hover:bg-gray-50"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{item.institusi}</h3>
                  {(item as any).jenjang && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                      {(item as any).jenjang}
                    </span>
                  )}
                </div>
                {item.gelar && <p className="text-gray-700 text-sm">{item.gelar}{item.jurusan ? ` — ${item.jurusan}` : ''}</p>}
                <div className="flex items-center gap-3 mt-1">
                  {(item.tahun_masuk || item.tahun_lulus) && (
                    <p className="text-gray-500 text-xs">
                      {item.tahun_masuk} {item.tahun_masuk && item.tahun_lulus ? '—' : ''} {item.tahun_lulus}
                    </p>
                  )}
                  {(item as any).ipk && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                      IPK {Number((item as any).ipk).toFixed(2)}
                    </span>
                  )}
                </div>
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
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada data pendidikan</p>
            <button onClick={openAdd} className="mt-3 text-blue-600 font-medium hover:underline">
              Tambah sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
