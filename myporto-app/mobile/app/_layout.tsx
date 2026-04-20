import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@/lib/store';
import api from '@/lib/api';

export default function RootLayout() {
  const { setUser, setToken, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await SecureStore.getItemAsync('myporto_token');
      if (!token) {
        router.replace('/(auth)/login');
        return;
      }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        setToken(token);
        router.replace('/(tabs)');
      } catch {
        await SecureStore.deleteItemAsync('myporto_token');
        logout();
        router.replace('/(auth)/login');
      }
    };
    checkAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
