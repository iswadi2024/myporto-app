'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { AppearanceSetting } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const THEMES = [
  { id: 'modern', label: 'Modern', color: '#3498db', bg: '#ffffff', desc: 'Bersih dan profesional' },
  { id: 'classic', label: 'Klasik', color: '#8b4513', bg: '#fdf6e3', desc: 'Elegan dan hangat' },
  { id: 'minimalist', label: 'Minimalis', color: '#333333', bg: '#fafafa', desc: 'Simpel dan fokus' },
  { id: 'elegant', label: 'Elegan', color: '#6c5ce7', bg: '#ffffff', desc: 'Mewah dan kreatif' },
  { id: 'bold', label: 'Bold', color: '#e74c3c', bg: '#1a1a2e', desc: 'Berani dan berkarakter' },
];

const FONTS = [
  { id: 'inter', label: 'Inter' },
  { id: 'poppins', label: 'Poppins' },
  { id: 'roboto', label: 'Roboto' },
  { id: 'playfair', label: 'Playfair Display' },
  { id: 'montserrat', label: 'Montserrat' },
];

const LAYOUTS = [
  { id: 'top-nav', label: 'Navigasi Atas', desc: 'Menu di bagian atas halaman' },
  { id: 'sidebar-nav', label: 'Navigasi Samping', desc: 'Menu di sisi kiri halaman' },
];

export default function AppearancePage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<AppearanceSetting | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    theme_name: 'modern',
    primary_color: '#3498db',
    layout_type: 'top-nav',
    font_style: 'inter',
  });

  useEffect(() => {
    api.get('/appearance').then((res) => {
      if (res.data.appearance) {
        setSettings(res.data.appearance);
        setForm({
          theme_name: res.data.appearance.theme_name,
          primary_color: res.data.appearance.primary_color,
          layout_type: res.data.appearance.layout_type,
          font_style: res.data.appearance.font_style,
        });
      }
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/appearance', form);
      toast({ title: 'Tampilan berhasil disimpan!' });
    } catch {
      toast({ title: 'Gagal menyimpan', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kustomisasi Tampilan</h1>
        <p className="text-gray-500 mt-1">Pilih tema, warna, dan layout portofolio Anda</p>
      </div>

      <div className="space-y-6">
        {/* Theme Selector */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Pilih Tema</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {THEMES.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setForm({ ...form, theme_name: theme.id, primary_color: theme.color })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.theme_name === theme.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div
                  className="w-full h-12 rounded-lg mb-3"
                  style={{ backgroundColor: theme.bg, border: `3px solid ${theme.color}` }}
                />
                <p className="font-medium text-sm text-gray-900">{theme.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{theme.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Color Picker */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Warna Utama</h2>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={form.primary_color}
              onChange={(e) => setForm({ ...form, primary_color: e.target.value })}
              className="w-16 h-16 rounded-xl cursor-pointer border border-gray-200"
            />
            <div>
              <p className="font-medium text-gray-900">{form.primary_color.toUpperCase()}</p>
              <p className="text-sm text-gray-500">Klik untuk mengubah warna</p>
            </div>
            <div className="flex gap-2 ml-4">
              {['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f39c12', '#1abc9c', '#e67e22', '#34495e'].map((color) => (
                <button
                  key={color}
                  onClick={() => setForm({ ...form, primary_color: color })}
                  className="w-8 h-8 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Layout */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Layout Navigasi</h2>
          <div className="grid grid-cols-2 gap-3">
            {LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => setForm({ ...form, layout_type: layout.id })}
                className={`p-4 rounded-xl border-2 text-left transition-all ${
                  form.layout_type === layout.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm text-gray-900">{layout.label}</p>
                <p className="text-xs text-gray-500 mt-1">{layout.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Gaya Font</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {FONTS.map((font) => (
              <button
                key={font.id}
                onClick={() => setForm({ ...form, font_style: font.id })}
                className={`p-3 rounded-xl border-2 text-center transition-all ${
                  form.font_style === font.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <p className="font-medium text-sm text-gray-900">{font.label}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : 'Simpan Tampilan'}
        </button>
      </div>
    </div>
  );
}
