import { useState, useCallback, useEffect } from 'react';
import { getToken, setToken, clearToken, exchangeToken } from '@/lib/api';
import { getAppGlobals } from '@/lib/toss-bridge';

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

  // 토스 앱 컨테이너 내에서는 앱 실행 시 URL queryParam으로 authorizationCode가 제공될 수 있음
  // SDK 2.0.1에서 appLogin()이 제거됨 → URL 파라미터를 통한 자동 인증 시도
  useEffect(() => {
    if (state.isLoggedIn) return;

    const params = new URLSearchParams(window.location.search);
    const authCode = params.get('authorizationCode');
    const referrer = params.get('referrer') ?? '';

    if (authCode) {
      setState((prev) => ({ ...prev, isLoading: true }));
      exchangeToken(authCode, referrer)
        .then(({ token }) => {
          setToken(token);
          setState({ isLoggedIn: true, isLoading: false, error: null });
          // 사용한 파라미터 제거
          const url = new URL(window.location.href);
          url.searchParams.delete('authorizationCode');
          url.searchParams.delete('referrer');
          window.history.replaceState({}, '', url);
        })
        .catch(() => {
          // 자동 인증 실패 시 무시 (로그인 버튼으로 수동 진행)
          setState((prev) => ({ ...prev, isLoading: false }));
        });
    }
  }, [state.isLoggedIn]);

  // 개발 환경에서 수동 로그인 (토스 앱 밖에서 테스트용)
  const login = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      // 개발 환경에서만 동작하는 mock 인증
      const globals = getAppGlobals();
      const mockToken = `mock-token-${globals.deploymentId}-${Date.now()}`;
      setToken(mockToken);
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
