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

  useEffect(() => {
    if (state.isLoggedIn) return;

    const performLogin = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true }));
        
        // 1. 토스 앱인토스 appLogin() 호출하여 인가 코드 발급
        const { appLogin } = await import('@apps-in-toss/web-bridge');
        const { authorizationCode, referrer } = await appLogin();
        
        if (authorizationCode) {
          // 2. 백엔드로 토큰 교환 요청
          const { token } = await exchangeToken(authorizationCode, referrer || '');
          setToken(token);
          setState({ isLoggedIn: true, isLoading: false, error: null });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('Toss appLogin failed:', err);
        // 자동 인증 실패 시 무시 (로그인 버튼으로 수동 진행)
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    performLogin();
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
