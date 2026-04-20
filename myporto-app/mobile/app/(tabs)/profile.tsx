import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';

interface ProfileForm {
  nama_lengkap: string;
  bio_singkat: string;
  no_whatsapp: string;
  email_publik: string;
  alamat_koordinat: string;
  foto_closeup: string;
  foto_fullbody: string;
  linkedin_url: string;
  instagram_url: string;
  github_url: string;
  website_url: string;
}

const EMPTY_FORM: ProfileForm = {
  nama_lengkap: '',
  bio_singkat: '',
  no_whatsapp: '',
  email_publik: '',
  alamat_koordinat: '',
  foto_closeup: '',
  foto_fullbody: '',
  linkedin_url: '',
  instagram_url: '',
  github_url: '',
  website_url: '',
};

export default function ProfileScreen() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/profile');
      const data = res.data.profile || res.data || {};
      setForm({
        nama_lengkap: data.nama_lengkap || '',
        bio_singkat: data.bio_singkat || '',
        no_whatsapp: data.no_whatsapp || '',
        email_publik: data.email_publik || '',
        alamat_koordinat: data.alamat_koordinat || '',
        foto_closeup: data.foto_closeup || '',
        foto_fullbody: data.foto_fullbody || '',
        linkedin_url: data.linkedin_url || '',
        instagram_url: data.instagram_url || '',
        github_url: data.github_url || '',
        website_url: data.website_url || '',
      });
    } catch (err) {
      console.error('Profile fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    if (!form.nama_lengkap.trim()) {
      Alert.alert('Validasi', 'Nama lengkap wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      await api.put('/profile', form);
      Alert.alert('Berhasil', 'Profil berhasil disimpan!');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Gagal menyimpan profil.';
      Alert.alert('Error', message);
    } finally {
      setSaving(false);
    }
  };

  const update = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Memuat profil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Edit Profil</Text>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Simpan</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Identitas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Identitas</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap *</Text>
            <TextInput
              style={styles.input}
              value={form.nama_lengkap}
              onChangeText={(v) => update('nama_lengkap', v)}
              placeholder="Nama lengkap Anda"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Bio Singkat</Text>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={form.bio_singkat}
              onChangeText={(v) => update('bio_singkat', v)}
              placeholder="Ceritakan tentang diri Anda..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Kontak */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="call-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Kontak</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>No. WhatsApp</Text>
            <TextInput
              style={styles.input}
              value={form.no_whatsapp}
              onChangeText={(v) => update('no_whatsapp', v)}
              placeholder="08xxxxxxxxxx"
              placeholderTextColor="#94a3b8"
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Publik</Text>
            <TextInput
              style={styles.input}
              value={form.email_publik}
              onChangeText={(v) => update('email_publik', v)}
              placeholder="email@publik.com"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat / Koordinat</Text>
            <TextInput
              style={styles.input}
              value={form.alamat_koordinat}
              onChangeText={(v) => update('alamat_koordinat', v)}
              placeholder="Jakarta, Indonesia"
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Foto */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="image-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Foto</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL Foto Close-up</Text>
            <TextInput
              style={styles.input}
              value={form.foto_closeup}
              onChangeText={(v) => update('foto_closeup', v)}
              placeholder="https://..."
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>URL Foto Full Body</Text>
            <TextInput
              style={styles.input}
              value={form.foto_fullbody}
              onChangeText={(v) => update('foto_fullbody', v)}
              placeholder="https://..."
              placeholderTextColor="#94a3b8"
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        </View>

        {/* Sosial Media */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="share-social-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Sosial Media</Text>
          </View>

          {[
            { key: 'linkedin_url', label: 'LinkedIn', icon: 'logo-linkedin', placeholder: 'https://linkedin.com/in/...' },
            { key: 'instagram_url', label: 'Instagram', icon: 'logo-instagram', placeholder: 'https://instagram.com/...' },
            { key: 'github_url', label: 'GitHub', icon: 'logo-github', placeholder: 'https://github.com/...' },
            { key: 'website_url', label: 'Website', icon: 'globe-outline', placeholder: 'https://...' },
          ].map((social) => (
            <View key={social.key} style={styles.inputGroup}>
              <Text style={styles.label}>{social.label}</Text>
              <View style={styles.socialInputRow}>
                <Ionicons name={social.icon as any} size={18} color="#64748b" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  value={form[social.key as keyof ProfileForm]}
                  onChangeText={(v) => update(social.key as keyof ProfileForm, v)}
                  placeholder={social.placeholder}
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748b', fontSize: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  saveButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 72,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.7 },
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  textarea: { minHeight: 90, paddingTop: 11 },
  socialInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    backgroundColor: '#f8fafc',
  },
  socialIcon: { paddingLeft: 12 },
  socialInput: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 11,
    fontSize: 14,
    color: '#1e293b',
  },
});
