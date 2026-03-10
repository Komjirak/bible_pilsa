import React, { useEffect, useRef } from 'react';

interface BannerAdProps {
  adUnitId: string;
}

export function BannerAd({ adUnitId }: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const attachedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || attachedRef.current) return;

    async function attachAd() {
      try {
        let TossAds: any;
        
        // 1. Framework import 시도
        try {
          const sdk: any = await import(/* @vite-ignore */ '@apps-in-toss/web-framework');
          if (sdk && sdk.TossAds) {
            TossAds = sdk.TossAds;
          }
        } catch (e) {
          // ignore
        }

        // 2. window 객체에서 Fallback 찾기
        if (!TossAds && window && (window as any).TossAds) {
          TossAds = (window as any).TossAds;
        }

        if (TossAds && typeof TossAds.attachBanner === 'function') {
          await TossAds.attachBanner({
            adUnitId,
            element: containerRef.current!,
          });
          attachedRef.current = true;
          console.log('[BannerAd] 부착 성공', adUnitId);
        } else {
          console.warn('[BannerAd] TossAds 객체를 찾을 수 없습니다.');
        }
      } catch (err) {
        console.warn('[BannerAd] 배너 광고 부착 실패', err);
      }
    }

    attachAd();
  }, [adUnitId]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        minHeight: '70px',
        backgroundColor: 'var(--color-bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '12px',
        color: 'var(--color-text-tertiary)',
        fontSize: '14px',
        overflow: 'hidden',
      }}
      data-ad-unit-id={adUnitId}
    />
  );
}
