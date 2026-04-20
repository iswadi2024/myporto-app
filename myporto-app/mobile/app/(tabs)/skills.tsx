import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';

type SkillType = 'kompetensi' | 'kursus' | 'pelatihan' | 'organisasi';

interface Skill {
  id: number;
  type: SkillType;
  nama_kegiatan: string;
  penyelenggara?: string;
  tahun?: number;
  level?: string;
  sertifikat_url?: string;
}

interface SkillForm {
  type: SkillType;
  nama_kegiatan: string;
  penyelenggara: string;
  tahun: string;
  level: string;
  sertifikat_url: string;
}

const EMPTY_FORM: SkillForm = {
  type: 'kompetensi',
  nama_kegiatan: '',
  penyelenggara: '',
  tahun: '',
  level: '',
  sertifikat_url: '',
};

const SKILL_TYPES: { value: SkillType; label: string; color: string; bg: string }[] = [
  { value: 'kompetensi', label: 'Kompetensi', color: '#3b82f6', bg: '#dbeafe' },
  { value: 'kursus', label: 'Kursus', color: '#8b5cf6', bg: '#ede9fe' },
  { value: 'pelatihan', label: 'Pelatihan', color: '#f59e0b', bg: '#fef3c7' },
  { value: 'organisasi', label: 'Organisasi', color: '#10b981', bg: '#d1fae5' },
];

const FILTER_TABS = [{ value: 'all', label: 'Semua' }, ...SKILL_TYPES.map((t) => ({ value: t.value, label: t.label }))];

function getTypeStyle(type: SkillType) {
  return SKILL_TYPES.find((t) => t.value === type) || SKILL_TYPES[0];
}

export default function SkillsScreen() {
  const [items, setItems] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<SkillForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/skills');
      setItems(res.data.skills || res.data || []);
    } catch (err) {
      console.error('Skills fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const filteredItems = activeFilter === 'all'
    ? items
    : items.filter((i) => i.type === activeFilter);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (item: Skill) => {
    setEditingId(item.id);
    setForm({
      type: item.type,
      nama_kegiatan: item.nama_kegiatan || '',
      penyelenggara: item.penyelenggara || '',
      tahun: item.tahun?.toString() || '',
      level: item.level || '',
      sertifikat_url: item.sertifikat_url || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nama_kegiatan.trim()) {
      Alert.alert('Validasi', 'Nama kegiatan wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        type: form.type,
        nama_kegiatan: form.nama_kegiatan.trim(),
        penyelenggara: form.penyelenggara.trim() || undefined,
        tahun: form.tahun ? parseInt(form.tahun) : undefined,
        level: form.level.trim() || undefined,
        sertifikat_url: form.sertifikat_url.trim() || undefined,
      };

      if (editingId) {
        await api.put(`/skills/${editingId}`, payload);
      } else {
        await api.post('/skills', payload);
      }

      setModalVisible(false);
      fetchData();
      Alert.alert('Berhasil', editingId ? 'Keahlian diperbarui.' : 'Keahlian ditambahkan.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number, nama: string) => {
    Alert.alert(
      'Hapus Keahlian',
      `Hapus "${nama}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/skills/${id}`);
              fetchData();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Gagal menghapus data.');
            }
          },
        },
      ]
    );
  };

  const update = (key: keyof SkillForm, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
        <Text style={styles.headerTitle}>Keahlian</Text>
        <Text style={styles.headerCount}>{items.length} data</Text>
      </View>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filterContent}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.filterTab, activeFilter === tab.value && styles.filterTabActive]}
            onPress={() => setActiveFilter(tab.value)}
          >
            <Text style={[styles.filterTabText, activeFilter === tab.value && styles.filterTabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498db" />}
      >
        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="star-outline" size={56} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Belum ada data keahlian</Text>
            <Text style={styles.emptyDesc}>Tambahkan keahlian dan sertifikasi Anda</Text>
          </View>
        ) : (
          filteredItems.map((item) => {
            const typeStyle = getTypeStyle(item.type);
            return (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardLeft}>
                  <View style={[styles.iconBox, { backgroundColor: typeStyle.bg }]}>
                    <Ionicons name="star" size={20} color={typeStyle.color} />
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <View style={styles.cardTitleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>{item.nama_kegiatan}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: typeStyle.bg }]}>
                      <Text style={[styles.typeBadgeText, { color: typeStyle.color }]}>{typeStyle.label}</Text>
                    </View>
                  </View>
                  {item.penyelenggara && (
                    <Text style={styles.cardSubtitle}>{item.penyelenggara}</Text>
                  )}
                  <View style={styles.cardMetaRow}>
                    {item.tahun && <Text style={styles.cardMeta}>{item.tahun}</Text>}
                    {item.level && (
                      <View style={styles.levelBadge}>
                        <Text style={styles.levelBadgeText}>{item.level}</Text>
                      </View>
                    )}
                  </View>
                  {item.sertifikat_url && (
                    <Text style={styles.certLink} numberOfLines={1}>🔗 Sertifikat</Text>
                  )}
                </View>
                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                    <Ionicons name="pencil-outline" size={16} color="#3498db" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.nama_kegiatan)}>
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Keahlian' : 'Tambah Keahlian'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              {/* Type Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tipe *</Text>
                <View style={styles.typeSelector}>
                  {SKILL_TYPES.map((t) => (
                    <TouchableOpacity
                      key={t.value}
                      style={[
                        styles.typeOption,
                        { borderColor: t.color },
                        form.type === t.value && { backgroundColor: t.bg },
                      ]}
                      onPress={() => update('type', t.value)}
                    >
                      <Text style={[styles.typeOptionText, { color: form.type === t.value ? t.color : '#64748b' }]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Kegiatan / Skill *</Text>
                <TextInput
                  style={styles.input}
                  value={form.nama_kegiatan}
                  onChangeText={(v) => update('nama_kegiatan', v)}
                  placeholder="React Native, AWS, dll."
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Penyelenggara</Text>
                <TextInput
                  style={styles.input}
                  value={form.penyelenggara}
                  onChangeText={(v) => update('penyelenggara', v)}
                  placeholder="Udemy, Coursera, dll."
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tahun</Text>
                <TextInput
                  style={styles.input}
                  value={form.tahun}
                  onChangeText={(v) => update('tahun', v)}
                  placeholder="2023"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Level / Tingkat</Text>
                <TextInput
                  style={styles.input}
                  value={form.level}
                  onChangeText={(v) => update('level', v)}
                  placeholder="Beginner / Intermediate / Advanced"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>URL Sertifikat</Text>
                <TextInput
                  style={styles.input}
                  value={form.sertifikat_url}
                  onChangeText={(v) => update('sertifikat_url', v)}
                  placeholder="https://..."
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                onPress={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Simpan</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  headerCount: { fontSize: 13, color: '#64748b', backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  filterScroll: { backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  filterContent: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterTabActive: { backgroundColor: '#3498db' },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterTabTextActive: { color: '#fff' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#64748b', marginTop: 16 },
  emptyDesc: { fontSize: 13, color: '#94a3b8', marginTop: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cardLeft: { marginRight: 12 },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', flex: 1 },
  typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  typeBadgeText: { fontSize: 11, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  cardMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  cardMeta: { fontSize: 12, color: '#94a3b8' },
  levelBadge: { backgroundColor: '#f1f5f9', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  levelBadgeText: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  certLink: { fontSize: 12, color: '#3498db', marginTop: 4 },
  cardActions: { flexDirection: 'column', gap: 6, marginLeft: 8 },
  editBtn: { padding: 6, backgroundColor: '#dbeafe', borderRadius: 8 },
  deleteBtn: { padding: 6, backgroundColor: '#fee2e2', borderRadius: 8 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    backgroundColor: '#3498db',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  modalScroll: { padding: 20, maxHeight: 440 },
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
  typeSelector: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  typeOptionText: { fontSize: 13, fontWeight: '600' },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  saveBtn: {
    flex: 1,
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
