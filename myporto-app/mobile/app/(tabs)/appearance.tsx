import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';

type ThemeType = 'modern' | 'classic' | 'minimalist' | 'elegant' | 'bold';
type LayoutType = 'top-nav' | 'sidebar-nav';

interface AppearanceForm {
  theme: ThemeType;
  primary_color: string;
  layout: LayoutType;
  font: string;
}

const THEMES: { value: ThemeType; label: string; desc: string; preview: string[] }[] = [
  { value: 'modern', label: 'Modern', desc: 'Bersih dan kontemporer', preview: ['#3498db', '#2ecc71', '#f8fafc'] },
  { value: 'classic', label: 'Classic', desc: 'Elegan dan timeless', preview: ['#2c3e50', '#e74c3c', '#ecf0f1'] },
  { value: 'minimalist', label: 'Minimalist', desc: 'Sederhana dan fokus', preview: ['#1a1a1a', '#ffffff', '#f5f5f5'] },
  { value: 'elegant', label: 'Elegant', desc: 'Mewah dan profesional', preview: ['#8e44ad', '#f39c12', '#fdfefe'] },
  { value: 'bold', label: 'Bold', desc: 'Berani dan berkarakter', preview: ['#e74c3c', '#f39c12', '#2c3e50'] },
];

const PRESET_COLORS = [
  { color: '#3498db', label: 'Biru' },
  { color: '#2ecc71', label: 'Hijau' },
  { color: '#e74c3c', label: 'Merah' },
  { color: '#9b59b6', label: 'Ungu' },
  { color: '#f39c12', label: 'Oranye' },
  { color: '#1abc9c', label: 'Teal' },
  { color: '#e91e63', label: 'Pink' },
  { color: '#2c3e50', label: 'Navy' },
];

const FONTS = [
  { value: 'Inter', label: 'Inter', desc: 'Modern & bersih' },
  { value: 'Poppins', label: 'Poppins', desc: 'Ramah & bulat' },
  { value: 'Roboto', label: 'Roboto', desc: 'Netral & jelas' },
  { value: 'Playfair Display', label: 'Playfair', desc: 'Elegan & serif' },
  { value: 'Montserrat', label: 'Montserrat', desc: 'Tegas & geometris' },
];

export default function AppearanceScreen() {
  const [form, setForm] = useState<AppearanceForm>({
    theme: 'modern',
    primary_color: '#3498db',
    layout: 'top-nav',
    font: 'Inter',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchAppearance = useCallback(async () => {
    try {
      const res = await api.get('/appearance');
      const data = res.data.appearance || res.data || {};
      setForm({
        theme: data.theme || 'modern',
        primary_color: data.primary_color || '#3498db',
        layout: data.layout || 'top-nav',
        font: data.font || 'Inter',
      });
    } catch (err) {
      console.error('Appearance fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppearance(); }, [fetchAppearance]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/appearance', form);
      Alert.alert('Berhasil', 'Tampilan berhasil disimpan!');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal menyimpan tampilan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tampilan</Text>
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
        {/* Theme Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Tema</Text>
          </View>
          <View style={styles.themeGrid}>
            {THEMES.map((theme) => (
              <TouchableOpacity
                key={theme.value}
                style={[
                  styles.themeCard,
                  form.theme === theme.value && styles.themeCardActive,
                ]}
                onPress={() => setForm((prev) => ({ ...prev, theme: theme.value }))}
              >
                {/* Color preview */}
                <View style={styles.themePreview}>
                  {theme.preview.map((color, i) => (
                    <View
                      key={i}
                      style={[
                        styles.themePreviewBlock,
                        { backgroundColor: color, flex: i === 2 ? 2 : 1 },
                      ]}
                    />
                  ))}
                </View>
                <Text style={[styles.themeLabel, form.theme === theme.value && styles.themeLabelActive]}>
                  {theme.label}
                </Text>
                <Text style={styles.themeDesc}>{theme.desc}</Text>
                {form.theme === theme.value && (
                  <View style={styles.themeCheck}>
                    <Ionicons name="checkmark-circle" size={18} color="#3498db" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Picker */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="ellipse-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Warna Utama</Text>
          </View>
          <View style={styles.colorGrid}>
            {PRESET_COLORS.map((item) => (
              <TouchableOpacity
                key={item.color}
                style={styles.colorItem}
                onPress={() => setForm((prev) => ({ ...prev, primary_color: item.color }))}
              >
                <View
                  style={[
                    styles.colorCircle,
                    { backgroundColor: item.color },
                    form.primary_color === item.color && styles.colorCircleActive,
                  ]}
                >
                  {form.primary_color === item.color && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                <Text style={styles.colorLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Layout Toggle */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="grid-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Layout Navigasi</Text>
          </View>
          <View style={styles.layoutRow}>
            {[
              { value: 'top-nav', label: 'Top Navigation', icon: 'menu-outline', desc: 'Menu di bagian atas' },
              { value: 'sidebar-nav', label: 'Sidebar Navigation', icon: 'reorder-three-outline', desc: 'Menu di samping kiri' },
            ].map((layout) => (
              <TouchableOpacity
                key={layout.value}
                style={[
                  styles.layoutOption,
                  form.layout === layout.value && styles.layoutOptionActive,
                ]}
                onPress={() => setForm((prev) => ({ ...prev, layout: layout.value as LayoutType }))}
              >
                <Ionicons
                  name={layout.icon as any}
                  size={24}
                  color={form.layout === layout.value ? '#3498db' : '#94a3b8'}
                />
                <Text style={[styles.layoutLabel, form.layout === layout.value && styles.layoutLabelActive]}>
                  {layout.label}
                </Text>
                <Text style={styles.layoutDesc}>{layout.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Font Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="text-outline" size={18} color="#3498db" />
            <Text style={styles.sectionTitle}>Font</Text>
          </View>
          {FONTS.map((font) => (
            <TouchableOpacity
              key={font.value}
              style={[
                styles.fontOption,
                form.font === font.value && styles.fontOptionActive,
              ]}
              onPress={() => setForm((prev) => ({ ...prev, font: font.value }))}
            >
              <View style={styles.fontInfo}>
                <Text style={[styles.fontLabel, form.font === font.value && styles.fontLabelActive]}>
                  {font.label}
                </Text>
                <Text style={styles.fontDesc}>{font.desc}</Text>
              </View>
              {form.font === font.value && (
                <Ionicons name="checkmark-circle" size={20} color="#3498db" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Info */}
        <View style={styles.previewInfo}>
          <Ionicons name="information-circle-outline" size={16} color="#64748b" />
          <Text style={styles.previewInfoText}>
            Perubahan tampilan akan terlihat di portofolio publik Anda setelah disimpan.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  themeCard: {
    width: '47%',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  themeCardActive: { borderColor: '#3498db', backgroundColor: '#f0f9ff' },
  themePreview: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  themePreviewBlock: { height: '100%' },
  themeLabel: { fontSize: 13, fontWeight: '700', color: '#374151' },
  themeLabelActive: { color: '#3498db' },
  themeDesc: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  themeCheck: { position: 'absolute', top: 8, right: 8 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  colorItem: { alignItems: 'center', width: '22%' },
  colorCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  colorCircleActive: {
    borderWidth: 3,
    borderColor: '#1e293b',
  },
  colorLabel: { fontSize: 11, color: '#64748b', textAlign: 'center' },
  layoutRow: { flexDirection: 'row', gap: 12 },
  layoutOption: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
  },
  layoutOptionActive: { borderColor: '#3498db', backgroundColor: '#f0f9ff' },
  layoutLabel: { fontSize: 12, fontWeight: '700', color: '#374151', textAlign: 'center' },
  layoutLabelActive: { color: '#3498db' },
  layoutDesc: { fontSize: 11, color: '#94a3b8', textAlign: 'center' },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    marginBottom: 8,
  },
  fontOptionActive: { borderColor: '#3498db', backgroundColor: '#f0f9ff' },
  fontInfo: { flex: 1 },
  fontLabel: { fontSize: 14, fontWeight: '700', color: '#374151' },
  fontLabelActive: { color: '#3498db' },
  fontDesc: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  previewInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  previewInfoText: { flex: 1, fontSize: 12, color: '#64748b', lineHeight: 18 },
});
