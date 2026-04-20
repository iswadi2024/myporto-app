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

interface Education {
  id: number;
  institusi: string;
  gelar?: string;
  jurusan?: string;
  tahun_masuk?: number;
  tahun_lulus?: number;
  deskripsi?: string;
}

interface EducationForm {
  institusi: string;
  gelar: string;
  jurusan: string;
  tahun_masuk: string;
  tahun_lulus: string;
  deskripsi: string;
}

const EMPTY_FORM: EducationForm = {
  institusi: '',
  gelar: '',
  jurusan: '',
  tahun_masuk: '',
  tahun_lulus: '',
  deskripsi: '',
};

export default function EducationScreen() {
  const [items, setItems] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<EducationForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/education');
      setItems(res.data.education || res.data || []);
    } catch (err) {
      console.error('Education fetch error:', err);
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

  const openEdit = (item: Education) => {
    setEditingId(item.id);
    setForm({
      institusi: item.institusi || '',
      gelar: item.gelar || '',
      jurusan: item.jurusan || '',
      tahun_masuk: item.tahun_masuk?.toString() || '',
      tahun_lulus: item.tahun_lulus?.toString() || '',
      deskripsi: item.deskripsi || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.institusi.trim()) {
      Alert.alert('Validasi', 'Nama institusi wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        institusi: form.institusi.trim(),
        gelar: form.gelar.trim() || undefined,
        jurusan: form.jurusan.trim() || undefined,
        tahun_masuk: form.tahun_masuk ? parseInt(form.tahun_masuk) : undefined,
        tahun_lulus: form.tahun_lulus ? parseInt(form.tahun_lulus) : undefined,
        deskripsi: form.deskripsi.trim() || undefined,
      };

      if (editingId) {
        await api.put(`/education/${editingId}`, payload);
      } else {
        await api.post('/education', payload);
      }

      setModalVisible(false);
      fetchData();
      Alert.alert('Berhasil', editingId ? 'Pendidikan diperbarui.' : 'Pendidikan ditambahkan.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Gagal menyimpan data.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number, institusi: string) => {
    Alert.alert(
      'Hapus Pendidikan',
      `Hapus "${institusi}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/education/${id}`);
              fetchData();
            } catch (err: any) {
              Alert.alert('Error', err.response?.data?.message || 'Gagal menghapus data.');
            }
          },
        },
      ]
    );
  };

  const update = (key: keyof EducationForm, value: string) => {
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
        <Text style={styles.headerTitle}>Pendidikan</Text>
        <Text style={styles.headerCount}>{items.length} data</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498db" />}
      >
        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="school-outline" size={56} color="#cbd5e1" />
            <Text style={styles.emptyTitle}>Belum ada data pendidikan</Text>
            <Text style={styles.emptyDesc}>Tambahkan riwayat pendidikan Anda</Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                  <Ionicons name="school" size={20} color="#3498db" />
                </View>
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.institusi}</Text>
                {(item.gelar || item.jurusan) && (
                  <Text style={styles.cardSubtitle}>
                    {[item.gelar, item.jurusan].filter(Boolean).join(' - ')}
                  </Text>
                )}
                {(item.tahun_masuk || item.tahun_lulus) && (
                  <Text style={styles.cardMeta}>
                    {item.tahun_masuk || '?'} – {item.tahun_lulus || 'Sekarang'}
                  </Text>
                )}
                {item.deskripsi && (
                  <Text style={styles.cardDesc} numberOfLines={2}>{item.deskripsi}</Text>
                )}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => openEdit(item)}>
                  <Ionicons name="pencil-outline" size={16} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.institusi)}>
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openAdd}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Edit Pendidikan' : 'Tambah Pendidikan'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll} keyboardShouldPersistTaps="handled">
              {[
                { key: 'institusi', label: 'Nama Institusi *', placeholder: 'Universitas / Sekolah' },
                { key: 'gelar', label: 'Gelar', placeholder: 'S.Kom, S.T, dll.' },
                { key: 'jurusan', label: 'Jurusan / Program Studi', placeholder: 'Teknik Informatika' },
                { key: 'tahun_masuk', label: 'Tahun Masuk', placeholder: '2018', keyboard: 'numeric' },
                { key: 'tahun_lulus', label: 'Tahun Lulus', placeholder: '2022', keyboard: 'numeric' },
              ].map((field) => (
                <View key={field.key} style={styles.inputGroup}>
                  <Text style={styles.label}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    value={form[field.key as keyof EducationForm]}
                    onChangeText={(v) => update(field.key as keyof EducationForm, v)}
                    placeholder={field.placeholder}
                    placeholderTextColor="#94a3b8"
                    keyboardType={(field.keyboard as any) || 'default'}
                  />
                </View>
              ))}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Deskripsi</Text>
                <TextInput
                  style={[styles.input, styles.textarea]}
                  value={form.deskripsi}
                  onChangeText={(v) => update('deskripsi', v)}
                  placeholder="Deskripsi singkat..."
                  placeholderTextColor="#94a3b8"
                  multiline
                  numberOfLines={3}
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
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  cardSubtitle: { fontSize: 13, color: '#3498db', marginTop: 2 },
  cardMeta: { fontSize: 12, color: '#64748b', marginTop: 3 },
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
  modalScroll: { padding: 20, maxHeight: 400 },
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
  textarea: { minHeight: 80, paddingTop: 11 },
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
