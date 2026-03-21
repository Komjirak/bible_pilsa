import { create } from 'zustand';
import { appLogin } from '@apps-in-toss/web-bridge';
import { apiClient } from '../api/client';
import { safeStorage } from '../utils/safeStorage';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  login: () => Promise<void>;
}

// Ensure appLogin is statically imported and handled only here.
export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  isLoading: true,
  error: null,
  
  initialize: async () => {
    const token = safeStorage.getItem('komjirak_token');
    if (token) {
      set({ isAuthenticated: true, isLoading: false });
    } else {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async () => {
    if (get().isLoading) return; // Prevent multiple clicks/calls
    set({ isLoading: true, error: null });

    if (import.meta.env.DEV) {
      // Bypass Toss login in local desktop development
      setTimeout(() => {
        safeStorage.setItem('komjirak_token', 'dev_dummy_token');
        set({ isAuthenticated: true, isLoading: false });
      }, 500);
      return;
    }

    try {
      // 1. Prompt Toss App Login
      const { authorizationCode, referrer } = await appLogin();
      
      // 2. Exchange Token via Backend
      const response = await apiClient.post('/api/v1/auth/token', {
        authorizationCode,
        referrer,
      });

      const { token } = response.data;
      if (token) {
        safeStorage.setItem('komjirak_token', token);
        set({ isAuthenticated: true, isLoading: false });
      } else {
        throw new Error('Failed to retrieve token from server');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      // "User cancelled" errors or specific web-bridge errors usually don't need alerts, but handled per PRD
      if (err?.code !== 'USER_CANCELLED') {
         set({ error: err?.message || '로그인 중 오류가 발생했습니다.' });
      }
      set({ isLoading: false });
    }
  },
}));
