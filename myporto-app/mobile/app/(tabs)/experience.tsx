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
  Switch,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';

interface Experience {
  id: number;
  perusahaan: string;
  jabatan: string;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  masih_bekerja?: boolean;
  deskripsi_tugas?: string;
}

interface ExperienceForm {
  perusahaan: string;
  jabatan: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  masih_bekerja: boolean;
  deskripsi_tugas: string;
}

const EMPTY_FORM: ExperienceForm = {
  perusahaan: '',
  jabatan: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  masih_bekerja: false,
  deskripsi_tugas: '',
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'short' });
  } catch {
    return dateStr;
  }
}

export default function ExperienceScreen() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ExperienceForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/experience');
      setItems(res.data.experience || res.data || []);
    } catch (err) {
      console.error('Experience fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalVisible(true);
  };

  const openEdit = (item: Experience) => {
    setEditingId(item.id);
    setForm({
      perusahaan: item.perusahaan || '',
      jabatan: item.jabatan || '',
      tanggal_mulai: item.tanggal_mulai ? item.tanggal_mulai.split('T')[0] : '',
      tanggal_selesai: item.tanggal_selesai ? item.tanggal_selesai.split('T')[0] : '',
      masih_bekerja: item.masih_bekerja || false,
      deskripsi_tugas: item.deskripsi_tugas || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.perusahaan.trim() || !form.jabatan.trim()) {
      Alert.alert('Validasi', 'Nama perusahaan dan jabatan wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload: any = {
        perusahaan: form.perusahaan.trim(),
        jabatan: form.jabatan.trim(),
        masih_bekerja: form.masih_bekerja,
        deskripsi_tugas: form.deskripsi_tugas.trim() || undefined,
      };
      if (form.tanggal_mulai) payload.tanggal_mulai = form.tanggal_mulai;
      if (!form.masih_bekerja && form.tanggal_selesai) payload.tanggal_selesai = form.tanggal_selesai;

      if (editingId) {
        await api.put(`/experience/${editingId}`, payload);
      } else {
        await api.post('/experience', payload);
      }

      setModalVisible(false);
      fetchData();
      Alert.alert('Berhasil', editingId ? 'Pengalaman diperbarui.' : 'Pengalaman ditambahkan.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number, jabatan: string) => {
    Alert.alert(
      'Hapus Pengalaman',
      `Hapus "${jabatan}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/experience/${id}`);
              fetchData();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Gagal menghapus data.');
            }
          },
        },
      ]
    );
  };

  const update = (key: keyof ExperienceForm, value: any) => {
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
        <Text style={styles.headerTitle}>Pengalaman</Text>
        <Text style={styles.headerCount}>{items.length} data</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498db" />}
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={56} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Belum ada data pengalaman</Text>
            <Text style={styles.emptyDesc}>Tambahkan riwayat pekerjaan Anda</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name="briefcase" size={20} color="#16a34a" />
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.jabatan}</Text>
                <Text style={styles.cardSubtitle}>{item.perusahaan}</Text>
                <Text style={styles.cardMeta}>
                  {formatDate(item.tanggal_mulai)} – {item.masih_bekerja ? 'Sekarang' : formatDate(item.tanggal_selesai)}
                </Text>
                {item.masih_bekerja && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Masih Bekerja</Text>
                  </View>
                )}
                {item.deskripsi_tugas && (
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.deskripsi_tugas}</Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                  <Ionicons name="pencil-outline" size={16} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.jabatan)}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
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
              <Text style={styles.modalTitle}>{editingId ? 'Edit Pengalaman' : 'Tambah Pengalaman'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nama Perusahaan *</Text>
                <TextInput
                  style={styles.input}
                  value={form.perusahaan}
                  onChangeText={(v) => update('perusahaan', v)}
                  placeholder="PT. Contoh Indonesia"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Jabatan *</Text>
                <TextInput
                  style={styles.input}
                  value={form.jabatan}
                  onChangeText={(v) => update('jabatan', v)}
                  placeholder="Software Engineer"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Tanggal Mulai (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={form.tanggal_mulai}
                  onChangeText={(v) => update('tanggal_mulai', v)}
                  placeholder="2022-01-01"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={styles.switchRow}>
                <Text style={styles.label}>Masih Bekerja di Sini</Text>
                <Switch
                  value={form.masih_bekerja}
                  onValueChange={(v) => update('masih_bekerja', v)}
                  trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
                  thumbColor={form.masih_bekerja ? '#3498db' : '#94a3b8'}
                />
              </View>

              {!form.masih_bekerja && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Tanggal Selesai (YYYY-MM-DD)</Text>
                  <TextInput
                    style={styles.input}
                    value={form.tanggal_selesai}
                    onChangeText={(v) => update('tanggal_selesai', v)}
                    placeholder="2023-12-31"
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Deskripsi Tugas</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={form.deskripsi_tugas}
                  onChangeText={(v) => update('deskripsi_tugas', v)}
                  placeholder="Jelaskan tugas dan tanggung jawab Anda..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
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
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  cardSubtitle: { fontSize: 13, color: '#16a34a', marginTop: 2 },
  cardMeta: { fontSize: 12, color: '#64748b', marginTop: 3 },
  activeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#dcfce7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  activeBadgeText: { fontSize: 11, color: '#16a34a', fontWeight: '600' },
  cardDesc: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
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
  modalScroll: { padding: 20, maxHeight: 420 },
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
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 4,
  },
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
