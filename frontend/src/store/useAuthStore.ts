import { create } from 'zustand';
import { appLogin } from '@apps-in-toss/web-bridge';
import { apiClient } from '../api/client';
import { safeStorage } from '../utils/safeStorage';
import { useProgressStore } from './useProgressStore';

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
      // DEV 모드에서는 검증 생략 (로컬 개발용 더미 토큰 허용)
      if (!import.meta.env.DEV) {
        // JWT 형식 검증 (xxx.yyy.zzz — 3파트). 이전 더미 토큰 자동 폐기
        const isValidJwt = token.split('.').length === 3;
        if (!isValidJwt) {
          safeStorage.removeItem('komjirak_token');
          set({ isAuthenticated: false, isLoading: false });
          return;
        }
      }
      set({ isAuthenticated: true, isLoading: false });
      useProgressStore.getState().syncFromServer();
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
        // 로그인 성공 후 서버에서 진도 로드 (업데이트 전 데이터 복원)
        useProgressStore.getState().syncFromServer();
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

// apiClient에서 401 발생 시 → 즉시 로그아웃 처리
if (typeof window !== 'undefined') {
  window.addEventListener('auth:logout', () => {
    useAuthStore.setState({ isAuthenticated: false, isLoading: false });
  });
}
