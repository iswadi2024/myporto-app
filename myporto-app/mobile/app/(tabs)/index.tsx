import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

interface Stats {
  educationCount: number;
  experienceCount: number;
  skillsCount: number;
}

interface ProfileData {
  nama_lengkap?: string;
  bio_singkat?: string;
  foto_closeup?: string;
  no_whatsapp?: string;
  email_publik?: string;
  alamat_koordinat?: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();

  const [stats, setStats] = useState<Stats>({ educationCount: 0, experienceCount: 0, skillsCount: 0 });
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [meRes, eduRes, expRes, skillsRes, profileRes] = await Promise.allSettled([
        api.get('/auth/me'),
        api.get('/education'),
        api.get('/experience'),
        api.get('/skills'),
        api.get('/profile'),
      ]);

      if (meRes.status === 'fulfilled') setUser(meRes.value.data.user);
      if (profileRes.status === 'fulfilled') setProfile(profileRes.value.data.profile || profileRes.value.data);

      setStats({
        educationCount: eduRes.status === 'fulfilled' ? (eduRes.value.data.education || eduRes.value.data || []).length : 0,
        experienceCount: expRes.status === 'fulfilled' ? (expRes.value.data.experience || expRes.value.data || []).length : 0,
        skillsCount: skillsRes.status === 'fulfilled' ? (skillsRes.value.data.skills || skillsRes.value.data || []).length : 0,
      });
    } catch (err) {
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('myporto_token');
    logout();
    router.replace('/(auth)/login');
  };

  // Calculate completion
  const completionItems = [
    { label: 'Bio', done: !!(profile?.bio_singkat) },
    { label: 'Foto', done: !!(profile?.foto_closeup) },
    { label: 'Pendidikan', done: stats.educationCount > 0 },
    { label: 'Pengalaman', done: stats.experienceCount > 0 },
    { label: 'Keahlian', done: stats.skillsCount > 0 },
    { label: 'Kontak', done: !!(profile?.no_whatsapp || profile?.email_publik) },
  ];
  const completedCount = completionItems.filter((i) => i.done).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  const displayName = profile?.nama_lengkap || user?.profile?.nama_lengkap || user?.username || 'Pengguna';

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.loadingText}>Memuat dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Halo, 👋</Text>
          <Text style={styles.headerName}>{displayName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3498db" />}
      >
        {/* Status Banner */}
        <View style={[styles.statusBanner, user?.is_paid ? styles.statusActive : styles.statusDraft]}>
          <Ionicons
            name={user?.is_paid ? 'checkmark-circle' : 'time-outline'}
            size={20}
            color={user?.is_paid ? '#16a34a' : '#d97706'}
          />
          <View style={styles.statusTextContainer}>
            <Text style={[styles.statusTitle, user?.is_paid ? styles.statusTitleActive : styles.statusTitleDraft]}>
              {user?.is_paid ? 'Portofolio Aktif!' : 'Status: Draft'}
            </Text>
            <Text style={[styles.statusDesc, user?.is_paid ? styles.statusDescActive : styles.statusDescDraft]}>
              {user?.is_paid
                ? `Link publik: myporto.id/p/${user?.username}`
                : 'Aktifkan untuk mendapatkan link portofolio publik'}
            </Text>
          </View>
          {!user?.is_paid && (
            <TouchableOpacity
              style={styles.activateButton}
              onPress={() => router.push('/(tabs)/payment')}
            >
              <Text style={styles.activateButtonText}>Aktifkan</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Completion Progress */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Kelengkapan Profil</Text>
            <Text style={styles.completionPercent}>{completionPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${completionPercent}%` as any }]} />
          </View>
          <View style={styles.completionItems}>
            {completionItems.map((item) => (
              <View key={item.label} style={styles.completionItem}>
                <Ionicons
                  name={item.done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={16}
                  color={item.done ? '#3498db' : '#cbd5e1'}
                />
                <Text style={[styles.completionLabel, item.done && styles.completionLabelDone]}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Cards */}
        <Text style={styles.sectionTitle}>Ringkasan Data</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/(tabs)/education')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#dbeafe' }]}>
              <Ionicons name="school" size={22} color="#3b82f6" />
            </View>
            <Text style={styles.statCount}>{stats.educationCount}</Text>
            <Text style={styles.statLabel}>Pendidikan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/(tabs)/experience')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="briefcase" size={22} color="#16a34a" />
            </View>
            <Text style={styles.statCount}>{stats.experienceCount}</Text>
            <Text style={styles.statLabel}>Pengalaman</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/(tabs)/skills')}
          >
            <View style={[styles.statIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="star" size={22} color="#d97706" />
            </View>
            <Text style={styles.statCount}>{stats.skillsCount}</Text>
            <Text style={styles.statLabel}>Keahlian</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Aksi Cepat</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/profile')}>
            <Ionicons name="person-circle-outline" size={24} color="#3498db" />
            <Text style={styles.quickActionText}>Edit Profil</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/appearance')}>
            <Ionicons name="color-palette-outline" size={24} color="#8b5cf6" />
            <Text style={styles.quickActionText}>Atur Tampilan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(tabs)/payment')}>
            <Ionicons name="card-outline" size={24} color="#f59e0b" />
            <Text style={styles.quickActionText}>Pembayaran</Text>
          </TouchableOpacity>
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
  headerGreeting: { fontSize: 13, color: '#64748b' },
  headerName: { fontSize: 20, fontWeight: '700', color: '#1e293b' },
  logoutButton: { padding: 8 },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
  },
  statusDraft: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  statusActive: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  statusTextContainer: { flex: 1, marginLeft: 10 },
  statusTitle: { fontSize: 14, fontWeight: '700' },
  statusTitleDraft: { color: '#92400e' },
  statusTitleActive: { color: '#14532d' },
  statusDesc: { fontSize: 12, marginTop: 2 },
  statusDescDraft: { color: '#b45309' },
  statusDescActive: { color: '#166534' },
  activateButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  activateButtonText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  completionPercent: { fontSize: 18, fontWeight: '800', color: '#3498db' },
  progressBarBg: { height: 8, backgroundColor: '#e2e8f0', borderRadius: 4, marginBottom: 14 },
  progressBarFill: { height: 8, backgroundColor: '#3498db', borderRadius: 4 },
  completionItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  completionItem: { flexDirection: 'row', alignItems: 'center', gap: 4, width: '30%' },
  completionLabel: { fontSize: 12, color: '#94a3b8' },
  completionLabelDone: { color: '#1e293b' },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statCount: { fontSize: 24, fontWeight: '800', color: '#1e293b' },
  statLabel: { fontSize: 11, color: '#64748b', marginTop: 2, textAlign: 'center' },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  quickActionText: { fontSize: 11, color: '#374151', fontWeight: '600', textAlign: 'center' },
});
