// 앱인토스 인앱 광고 2.0 ver2 (전면형/보상형 광고) 연동 훅
// 가이드: https://developers-apps-in-toss.toss.im/ads/develop.html
// API: loadFullScreenAd / showFullScreenAd (@apps-in-toss/web-framework)
//
// 테스트 광고 ID:
//   전면형: ait-ad-test-interstitial-id
//   보상형: ait-ad-test-rewarded-id

import { useState, useEffect, useCallback, useRef } from 'react';

// 테스트 광고 ID (출시 전 반드시 실제 ID로 교체 필요)
// 실제 사용 환경용 상수
const LIVE_INTERSTITIAL_AD_GROUP_ID = 'ait.v2.live.6255b174cfea47ca';
const LIVE_REWARDED_AD_GROUP_ID = 'ait.v2.live.6255b174cfea47ca'; // 전면형과 동일하게 사용 (요건에 따라)

// SDK 함수 타입 (런타임에만 존재)
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

interface UseFullScreenAdOptions {
  adType?: 'interstitial' | 'rewarded';
  autoLoad?: boolean;
}

interface UseFullScreenAdReturn {
  isAdLoaded: boolean;
  isSupported: boolean;
  showAd: (onAdClosed?: () => void) => void;
  loadAd: () => void;
  adError: string | null;
}

export function useFullScreenAd(options: UseFullScreenAdOptions = {}): UseFullScreenAdReturn {
  const { adType = 'interstitial', autoLoad = true } = options;
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  const loadFnRef = useRef<LoadFullScreenAdFn | null>(null);
  const showFnRef = useRef<ShowFullScreenAdFn | null>(null);
  const unregisterRef = useRef<(() => void) | null>(null);

  // 운영용 ID로 교체
  let adGroupId = LIVE_INTERSTITIAL_AD_GROUP_ID;
  if (adType === 'rewarded') adGroupId = LIVE_REWARDED_AD_GROUP_ID;

  // SDK 동적 로드
  useEffect(() => {
    async function loadSdk() {
      try {
        const sdk: any = await import(/* @vite-ignore */ '@apps-in-toss/web-framework').catch(() => null);
        if (sdk?.loadFullScreenAd && sdk?.showFullScreenAd) {
          loadFnRef.current = sdk.loadFullScreenAd;
          showFnRef.current = sdk.showFullScreenAd;
          const supported = sdk.loadFullScreenAd.isSupported?.() ?? false;
          setIsSupported(supported);
        } else {
          console.warn('[ad] 앱인토스 광고 SDK 미사용 환경 — mock 모드');
          setIsSupported(false);
        }
      } catch {
        console.warn('[ad] 광고 SDK 로드 실패');
        setIsSupported(false);
      }
    }
    loadSdk();
  }, []);

  // 광고 로드
  const loadAd = useCallback(() => {
    const loadFn = loadFnRef.current;
    if (!loadFn) {
      // SDK 미사용 환경에서는 mock으로 동작
      console.warn('[ad] mock — 광고 로드 시뮬레이션');
      setTimeout(() => setIsAdLoaded(true), 500);
      return;
    }

    setAdError(null);
    setIsAdLoaded(false);

    unregisterRef.current = loadFn({
      options: { adGroupId },
      onEvent: (event) => {
        if (event.type === 'loaded') {
          console.log('[ad] 광고 로드 완료');
          setIsAdLoaded(true);
        }
      },
      onError: (err) => {
        console.error('[ad] 광고 로드 실패:', err);
        setAdError(err instanceof Error ? err.message : '광고 로드 실패');
      },
    });
  }, [adGroupId]);

  // autoLoad
  useEffect(() => {
    if (autoLoad) {
      // SDK 로드 후 약간의 딜레이를 줌
      const timer = setTimeout(() => loadAd(), 300);
      return () => clearTimeout(timer);
    }
  }, [autoLoad, loadAd]);

  // 클린업
  useEffect(() => {
    return () => {
      unregisterRef.current?.();
    };
  }, []);

  // 광고 표시
  const showAd = useCallback((onAdClosed?: () => void) => {
    const showFn = showFnRef.current;
    if (!showFn) {
      // SDK 미사용 환경에서는 mock으로 동작
      console.warn('[ad] mock — 광고 표시 시뮬레이션');
      setIsAdLoaded(false);
      onAdClosed?.();
      return;
    }

    showFn({
      options: { adGroupId },
      onEvent: (event) => {
        switch (event.type) {
          case 'requested':
            console.log('[ad] 광고 표시 요청됨');
            break;
          case 'show':
            console.log('[ad] 광고 화면 표시됨');
            break;
          case 'impression':
            console.log('[ad] 광고 노출 기록됨 (수익 발생)');
            break;
          case 'clicked':
            console.log('[ad] 광고 클릭됨');
            break;
          case 'dismissed':
            console.log('[ad] 광고 닫힘');
            setIsAdLoaded(false);
            onAdClosed?.();
            // 다음 광고 미리 로드 (load → show → load 패턴)
            loadAd();
            break;
          case 'failedToShow':
            console.error('[ad] 광고 표시 실패');
            setAdError('광고 표시 실패');
            onAdClosed?.();
            break;
          case 'userEarnedReward':
            console.log('[ad] 리워드 획득:', event.data);
            break;
        }
      },
      onError: (err) => {
        console.error('[ad] 광고 표시 실패:', err);
        setAdError(err instanceof Error ? err.message : '광고 표시 실패');
      },
    });
  }, [adGroupId, loadAd]);

  return { isAdLoaded, isSupported, showAd, loadAd, adError };
}
