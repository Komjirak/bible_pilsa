import { useEffect, useState } from 'react';
import { initBridge, getColorMode } from '@/lib/toss-bridge';

export function useBridgeSDK() {
  const [initialized, setInitialized] = useState(false);
  const [colorMode, setColorMode] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    let cancelled = false;

    async function init() {
      await initBridge();
      const mode = await getColorMode();
      if (!cancelled) {
        setColorMode(mode);
        setInitialized(true);
      }
    }

    init();
    return () => { cancelled = true; };
  }, []);

  return { initialized, colorMode };
}
