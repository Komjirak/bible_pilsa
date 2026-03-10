import { useEffect, useState } from 'react';

export function useBridgeSDK() {
  const [initialized, setInitialized] = useState(false);
  const [colorMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // SDK 2.0.1에서는 별도 초기화 불필요 — 토스 앱 컨테이너가 자동 처리
    setInitialized(true);
  }, []);

  return { initialized, colorMode };
}
