import { create } from 'zustand';

interface User {
  id: number;
  email: string;
  username: string;
  role: 'USER' | 'ADMIN';
  is_paid: boolean;
  profile?: {
    nama_lengkap: string;
    bio_singkat?: string;
    foto_closeup?: string;
    no_whatsapp?: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));
