import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface PaymentHistory {
  id: number;
  amount: number;
  status: string;
  method?: string;
  created_at: string;
  notes?: string;
}

const BENEFITS = [
  'Link portofolio publik (myporto.id/p/username)',
  'Semua tema premium tersedia',
  'Tampil di direktori pencarian',
  'Dukungan prioritas',
  'Akses seumur hidup',
  'Update fitur gratis',
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'paid':
    case 'success':
    case 'completed':
      return { bg: '#dcfce7', color: '#16a34a', label: 'Berhasil' };
    case 'pending':
      return { bg: '#fef3c7', color: '#d97706', label: 'Menunggu' };
    case 'failed':
    case 'cancelled':
      return { bg: '#fee2e2', color: '#dc2626', label: 'Gagal' };
    default:
      return { bg: '#f1f5f9', color: '#64748b', label: status };
  }
}

export default function PaymentScreen() {
  const { user, setUser } = useAuthStore();
  const [history, setHistory] = useState<PaymentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, historyRes] = await Promise.allSettled([
        api.get('/auth/me'),
        api.get('/payment/history'),
      ]);

      if (meRes.status === 'fulfilled') setUser(meRes.value.data.user);
      if (historyRes.status === 'fulfilled') {
        setHistory(historyRes.value.data.payments || historyRes.value.data || []);
      }
    } catch (err) {
      console.error('Payment fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleContactAdmin = () => {
    const phone = '6281234567890'; // Replace with actual admin WhatsApp
    const message = encodeURIComponent(
      `Halo Admin MyPorto, saya ingin mengaktifkan portofolio saya.\n\nUsername: ${user?.username || '-'}\nEmail: ${user?.email || '-'}`
    );
    const url = `https://wa.me/${phone}?text=${message}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Tidak dapat membuka WhatsApp. Pastikan WhatsApp terinstal.');
    });
  };

  const handleCopyLink = () => {
    Alert.alert('Link Portofolio', `myporto.id/p/${user?.username}`, [
      { text: 'OK' },
    ]);
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
        <Text style={styles.headerTitle}>Pembayaran</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498db" />}
      >
        {user?.is_paid ? (
          /* Active State */
          <View style={styles.activeCard}>
            <View style={styles.activeIconContainer}>
              <Ionicons name="checkmark-circle" size={48} color="#16a34a" />
            </View>
            <Text style={styles.activeTitle}>Portofolio Aktif! 🎉</Text>
            <Text style={styles.activeDesc}>
              Portofolio Anda sudah aktif dan dapat diakses publik.
            </Text>
            <View style={styles.linkBox}>
              <Ionicons name="link-outline" size={16} color="#3498db" />
              <Text style={styles.linkText}>myporto.id/p/{user?.username}</Text>
              <TouchableOpacity onPress={handleCopyLink}>
                <Ionicons name="copy-outline" size={16} color="#3498db" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.visitButton}
              onPress={() => Linking.openURL(`https://myporto.id/p/${user?.username}`)}
            >
              <Ionicons name="open-outline" size={16} color="#fff" />
              <Text style={styles.visitButtonText}>Lihat Portofolio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Inactive State */
          <>
            <View style={styles.activationCard}>
              <View style={styles.activationHeader}>
                <View style={styles.activationIconBox}>
                  <Ionicons name="rocket-outline" size={28} color="#3498db" />
                </View>
                <View style={styles.activationHeaderText}>
                  <Text style={styles.activationTitle}>Aktifkan Portofolio</Text>
                  <Text style={styles.activationSubtitle}>Satu kali pembayaran, akses seumur hidup</Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Harga Aktivasi</Text>
                <Text style={styles.price}>Rp 99.000</Text>
                <Text style={styles.priceNote}>Bayar sekali, aktif selamanya</Text>
              </View>

              <View style={styles.divider} />

              <Text style={styles.benefitsTitle}>Yang Anda dapatkan:</Text>
              {BENEFITS.map((benefit, i) => (
                <View key={i} style={styles.benefitItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#3498db" />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}

              <TouchableOpacity style={styles.contactButton} onPress={handleContactAdmin}>
                <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                <Text style={styles.contactButtonText}>Hubungi Admin via WhatsApp</Text>
              </TouchableOpacity>

              <Text style={styles.contactNote}>
                Admin akan memproses aktivasi dalam 1x24 jam setelah pembayaran dikonfirmasi.
              </Text>
            </View>
          </>
        )}

        {/* Payment History */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Riwayat Pembayaran</Text>

          {history.length === 0 ? (
            <View style={styles.emptyHistory}>
              <Ionicons name="receipt-outline" size={40} color="#cbd5e1" />
              <Text style={styles.emptyHistoryText}>Belum ada riwayat pembayaran</Text>
            </View>
          ) : (
            history.map((item) => {
              const statusStyle = getStatusStyle(item.status);
              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyLeft}>
                    <View style={styles.historyIconBox}>
                      <Ionicons name="card-outline" size={20} color="#3498db" />
                    </View>
                  </View>
                  <View style={styles.historyContent}>
                    <Text style={styles.historyAmount}>{formatCurrency(item.amount)}</Text>
                    <Text style={styles.historyDate}>{formatDate(item.created_at)}</Text>
                    {item.method && (
                      <Text style={styles.historyMethod}>{item.method}</Text>
                    )}
                    {item.notes && (
                      <Text style={styles.historyNotes}>{item.notes}</Text>
                    )}
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
                      {statusStyle.label}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 40 },

  // Active state
  activeCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    marginBottom: 20,
  },
  activeIconContainer: { marginBottom: 12 },
  activeTitle: { fontSize: 22, fontWeight: '800', color: '#14532d', marginBottom: 8 },
  activeDesc: { fontSize: 14, color: '#166534', textAlign: 'center', marginBottom: 16 },
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: 16,
  },
  linkText: { flex: 1, fontSize: 13, color: '#3498db', fontWeight: '600' },
  visitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3498db',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  visitButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  // Activation card
  activationCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  activationHeader: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 20 },
  activationIconBox: {
    width: 52,
    height: 52,
    backgroundColor: '#dbeafe',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activationHeaderText: { flex: 1 },
  activationTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  activationSubtitle: { fontSize: 13, color: '#64748b', marginTop: 2 },
  priceContainer: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  priceLabel: { fontSize: 13, color: '#64748b', marginBottom: 4 },
  price: { fontSize: 32, fontWeight: '800', color: '#3498db' },
  priceNote: { fontSize: 12, color: '#64748b', marginTop: 4 },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginBottom: 16 },
  benefitsTitle: { fontSize: 14, fontWeight: '700', color: '#374151', marginBottom: 12 },
  benefitItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  benefitText: { fontSize: 14, color: '#374151', flex: 1 },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#25d366',
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    marginBottom: 12,
  },
  contactButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  contactNote: { fontSize: 12, color: '#94a3b8', textAlign: 'center', lineHeight: 18 },

  // History
  historySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  historyTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 14 },
  emptyHistory: { alignItems: 'center', paddingVertical: 24 },
  emptyHistoryText: { fontSize: 14, color: '#94a3b8', marginTop: 8 },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  historyLeft: { marginRight: 12 },
  historyIconBox: {
    width: 40,
    height: 40,
    backgroundColor: '#dbeafe',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  historyContent: { flex: 1 },
  historyAmount: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  historyDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
  historyMethod: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
  historyNotes: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 12, fontWeight: '700' },
});
