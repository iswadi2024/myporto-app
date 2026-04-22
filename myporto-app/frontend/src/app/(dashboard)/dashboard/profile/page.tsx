'use client';

import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { useToast } from '@/components/ui/use-toast';
import { Profile } from '@/types';
import { User, Mail, Phone, MapPin, Github, Linkedin, Instagram, Globe } from '@/components/ui/icons';

type ProfileForm = Omit<Profile, 'id' | 'user_id' | 'foto_closeup' | 'foto_fullbody'>;

function PhotoUpload({
  label, current, type, onUploaded,
}: { label: string; current?: string; type: 'closeup' | 'fullbody'; onUploaded: (url: string) => void }) {
  const [preview, setPreview] = useState(current || '');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync preview saat current berubah (setelah data dari API datang)
  useEffect(() => {
    if (current) setPreview(current);
  }, [current]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const form = new FormData();
      form.append('photo', file);
      const res = await api.post(`/profile/upload/${type}`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onUploaded(res.data.url);
    } catch {
      alert('Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        onClick={() => inputRef.current?.click()}
        className="relative cursor-pointer group"
      >
        <div className={`${type === 'closeup' ? 'w-28 h-28 rounded-full' : 'w-24 h-36 rounded-2xl'} bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center group-hover:border-blue-400 transition-colors`}>
          {preview ? (
            <img src={preview} alt={label} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center p-2">
              <User className="w-8 h-8 text-slate-400 mx-auto mb-1" />
              <p className="text-xs text-slate-400">Klik upload</p>
            </div>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit]">
            <p className="text-white text-xs font-medium">Ganti Foto</p>
          </div>
        </div>
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-[inherit]">
            <svg className="animate-spin w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
          </div>
        )}
      </div>
      <p className="text-xs font-medium text-slate-600">{label}</p>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState({ closeup: '', fullbody: '' });

  const { register, handleSubmit, reset } = useForm<ProfileForm>();

  useEffect(() => {
    api.get('/profile').then((res) => {
      if (res.data.profile) {
        reset(res.data.profile);
        setPhotos({
          closeup: res.data.profile.foto_closeup || '',
          fullbody: res.data.profile.foto_fullbody || '',
        });
      }
    }).catch(() => {});
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true);
    try {
      const res = await api.put('/profile', data);
      toast({ title: '✓ Profil berhasil disimpan!' });
      if (user) setUser({ ...user, profile: res.data.profile });
    } catch {
      toast({ title: 'Gagal menyimpan profil', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full border border-slate-200 bg-slate-50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors';

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Edit Profil</h1>
        <p className="text-slate-500 mt-1">Lengkapi informasi identitas Anda</p>
      </div>

      {/* Photo upload section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 mb-6 text-white">
        <h2 className="font-semibold mb-1">Foto Profil</h2>
        <p className="text-blue-200 text-sm mb-5">Upload foto wajah dan foto full body Anda (maks. 5MB)</p>
        <div className="flex gap-10 justify-center sm:justify-start">
          <PhotoUpload
            label="Foto Wajah (Close-up)"
            current={photos.closeup}
            type="closeup"
            onUploaded={(url) => setPhotos(p => ({ ...p, closeup: url }))}
          />
          <PhotoUpload
            label="Foto Full Body"
            current={photos.fullbody}
            type="fullbody"
            onUploaded={(url) => setPhotos(p => ({ ...p, fullbody: url }))}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Identitas */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
              <User className="w-4 h-4 text-violet-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Identitas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nama Lengkap *</label>
              <input {...register('nama_lengkap', { required: true })} className={inputCls} placeholder="Nama lengkap Anda" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tempat Lahir</label>
              <input {...register('tempat_lahir')} className={inputCls} placeholder="Jakarta" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Tanggal Lahir</label>
              <input {...register('tanggal_lahir')} type="date" className={inputCls} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Bio Singkat</label>
              <textarea {...register('bio_singkat')} rows={3} className={inputCls} placeholder="Ceritakan tentang diri Anda secara singkat..." />
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-sky-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Kontak</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">No. WhatsApp</label>
              <input {...register('no_whatsapp')} className={inputCls} placeholder="08123456789" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Publik</label>
              <input {...register('email_publik')} type="email" className={inputCls} placeholder="email@contoh.com" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Alamat / Koordinat Google Maps</label>
              <input {...register('alamat_koordinat')} className={inputCls} placeholder="Jakarta, Indonesia atau URL Google Maps" />
            </div>
          </div>
        </div>

        {/* Sosial Media */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-pink-600" />
            </div>
            <h2 className="font-semibold text-slate-900">Sosial Media & Website</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'linkedin_url' as const, label: 'LinkedIn', icon: Linkedin, placeholder: 'https://linkedin.com/in/username', color: 'text-blue-600' },
              { name: 'instagram_url' as const, label: 'Instagram', icon: Instagram, placeholder: 'https://instagram.com/username', color: 'text-pink-600' },
              { name: 'github_url' as const, label: 'GitHub', icon: Github, placeholder: 'https://github.com/username', color: 'text-slate-700' },
              { name: 'website_url' as const, label: 'Website', icon: Globe, placeholder: 'https://website-anda.com', color: 'text-green-600' },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <field.icon className={`w-3.5 h-3.5 ${field.color}`} />
                  {field.label}
                </label>
                <input {...register(field.name)} className={inputCls} placeholder={field.placeholder} />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-200">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              Menyimpan...
            </span>
          ) : 'Simpan Profil'}
        </button>
      </form>
    </div>
  );
}
