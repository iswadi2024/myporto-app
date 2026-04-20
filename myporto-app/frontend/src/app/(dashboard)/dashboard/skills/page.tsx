'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Award } from '@/components/ui/icons';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { SkillsAndAchievement } from '@/types';
import { useToast } from '@/components/ui/use-toast';

type SkillForm = Omit<SkillsAndAchievement, 'id' | 'user_id'>;

const TYPE_LABELS: Record<string, string> = {
  kompetensi: 'Kompetensi',
  kursus: 'Kursus',
  pelatihan: 'Pelatihan',
  organisasi: 'Organisasi',
};

const TYPE_COLORS: Record<string, string> = {
  kompetensi: 'bg-blue-100 text-blue-700',
  kursus: 'bg-green-100 text-green-700',
  pelatihan: 'bg-purple-100 text-purple-700',
  organisasi: 'bg-orange-100 text-orange-700',
};

export default function SkillsPage() {
  const { toast } = useToast();
  const [items, setItems] = useState<SkillsAndAchievement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');

  const { register, handleSubmit, reset } = useForm<SkillForm>();

  const fetchData = () => {
    api.get('/skills').then((res) => setItems(res.data.skills));
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => {
    reset({ type: 'kompetensi' });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (item: SkillsAndAchievement) => {
    reset(item);
    setEditId(item.id);
    setShowForm(true);
  };

  const onSubmit = async (data: SkillForm) => {
    setSaving(true);
    try {
      if (editId) {
        await api.put(`/skills/${editId}`, data);
        toast({ title: 'Data berhasil diperbarui' });
      } else {
        await api.post('/skills', data);
        toast({ title: 'Data berhasil ditambahkan' });
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
    if (!confirm('Hapus data ini?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast({ title: 'Data dihapus' });
      fetchData();
    } catch {
      toast({ title: 'Gagal menghapus', variant: 'destructive' });
    }
  };

  const filtered = filterType === 'all' ? items : items.filter((i) => i.type === filterType);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Keahlian & Pengembangan Diri</h1>
          <p className="text-gray-500 mt-1">Kompetensi, kursus, pelatihan, dan organisasi</p>
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
            {editId ? 'Edit Data' : 'Tambah Data'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  {...register('type', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="kompetensi">Kompetensi / Skill</option>
                  <option value="kursus">Kursus / Sertifikasi</option>
                  <option value="pelatihan">Pelatihan</option>
                  <option value="organisasi">Organisasi</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama *</label>
                <input
                  {...register('nama_kegiatan', { required: true })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React.js, AWS Cloud Practitioner, dll"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Penyelenggara</label>
                <input
                  {...register('penyelenggara')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Udemy, Coursera, dll"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
                <input
                  {...register('tahun')}
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="2023"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level (untuk kompetensi)</label>
                <input
                  {...register('level')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Beginner / Intermediate / Advanced"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL Sertifikat</label>
                <input
                  {...register('sertifikat_url')}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
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

      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {['all', 'kompetensi', 'kursus', 'pelatihan', 'organisasi'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filterType === type ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {type === 'all' ? 'Semua' : TYPE_LABELS[type]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{item.nama_kegiatan}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[item.type]}`}>
                    {TYPE_LABELS[item.type]}
                  </span>
                  {item.level && (
                    <span className="text-xs text-gray-500">({item.level})</span>
                  )}
                </div>
                {item.penyelenggara && (
                  <p className="text-sm text-gray-500">{item.penyelenggara}{item.tahun ? ` · ${item.tahun}` : ''}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {item.sertifikat_url && (
                <a href={item.sertifikat_url} target="_blank" rel="noopener noreferrer"
                  className="text-xs px-2 py-1 border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
                  Sertifikat
                </a>
              )}
              <button onClick={() => openEdit(item)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && !showForm && (
          <div className="text-center py-12 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Belum ada data</p>
            <button onClick={openAdd} className="mt-3 text-blue-600 font-medium hover:underline">
              Tambah sekarang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
