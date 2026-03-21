import { useState, useEffect, useCallback, useRef } from 'react';
import { loadFullScreenAd, showFullScreenAd } from '@apps-in-toss/web-bridge';

const LIVE_INTERSTITIAL_AD_GROUP_ID = 'ait.v2.live.6255b174cfea47ca';

type LoadFullScreenAdFn = ((params: {
  options: { adGroupId: string };
  onEvent: (event: { type: string; data?: any }) => void;
  onError: (err: unknown) => void;
}) => () => void) & { isSupported?: () => boolean };

type ShowFullScreenAdFn = ((params: {
  options: { adGroupId: string };
  onEvent: (event: { type: string; data?: any }) => void;
  onError: (err: unknown) => void;
}) => () => void) & { isSupported?: () => boolean };

interface UseFullScreenAdReturn {
  isAdLoaded: boolean;
  isSupported: boolean;
  showAd: (onAdClosed?: () => void) => void;
  loadAd: () => void;
  adError: string | null;
}

export function useFullScreenAd(): UseFullScreenAdReturn {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  const loadFnRef = useRef<LoadFullScreenAdFn | null>(null);
  const showFnRef = useRef<ShowFullScreenAdFn | null>(null);
  const unregisterRef = useRef<(() => void) | null>(null);

  // SDK static methods mapping
  useEffect(() => {
    try {
      if (typeof loadFullScreenAd === 'function' && typeof showFullScreenAd === 'function') {
        loadFnRef.current = loadFullScreenAd as any;
        showFnRef.current = showFullScreenAd as any;
        // @ts-ignore
        const supported = loadFullScreenAd.isSupported?.() ?? false;
        setIsSupported(supported);
      } else {
        setIsSupported(false);
      }
    } catch {
      setIsSupported(false);
    }
  }, []);

  // 광고 로드
  const loadAd = useCallback(() => {
    const loadFn = loadFnRef.current;
    if (!loadFn) {
      setTimeout(() => setIsAdLoaded(true), 500); // Mock in dev
      return;
    }

    setAdError(null);
    setIsAdLoaded(false);

    unregisterRef.current = loadFn({
      options: { adGroupId: LIVE_INTERSTITIAL_AD_GROUP_ID },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          setIsAdLoaded(true);
        }
      },
      onError: () => {
        setAdError('광고 로드 실패');
      },
    });
  }, []);

  // autoLoad
  useEffect(() => {
    const timer = setTimeout(() => loadAd(), 300);
    return () => clearTimeout(timer);
  }, [loadAd]);

  useEffect(() => {
    return () => {
      unregisterRef.current?.();
    };
  }, []);

  const showAd = useCallback((onAdClosed?: () => void) => {
    const showFn = showFnRef.current;
    if (!showFn) {
      setIsAdLoaded(false);
      onAdClosed?.();
      return;
    }

    showFn({
      options: { adGroupId: LIVE_INTERSTITIAL_AD_GROUP_ID },
      onEvent: (event) => {
        switch (event.type) {
          case 'dismissed':
          case 'failedToShow':
            setIsAdLoaded(false);
            onAdClosed?.();
            loadAd();
            break;
        }
      },
      onError: () => {
        setAdError('광고 표시 실패');
        onAdClosed?.();
      },
    });
  }, [loadAd]);

  return { isAdLoaded, isSupported, showAd, loadAd, adError };
}
