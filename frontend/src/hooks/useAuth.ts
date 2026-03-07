import { useState, useCallback } from 'react';
import { appLogin } from '@/lib/toss-bridge';
import { exchangeToken, getToken, setToken, clearToken } from '@/lib/api';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isLoggedIn: !!getToken(),
    isLoading: false,
    error: null,
  });

  const login = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { authorizationCode, referrer } = await appLogin();
      const { token } = await exchangeToken(authorizationCode, referrer);
      setToken(token);
      setState({ isLoggedIn: true, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : '로그인에 실패했습니다.';
      setState({ isLoggedIn: false, isLoading: false, error: message });
    }
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setState({ isLoggedIn: false, isLoading: false, error: null });
  }, []);

  return { ...state, login, logout };
}
