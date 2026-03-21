import { useEffect, useRef } from 'react';
import { TossAds } from '@apps-in-toss/web-bridge';

interface BannerAdProps {
  adUnitId: string;
}

export function BannerAd({ adUnitId }: BannerAdProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const attachedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || attachedRef.current) return;

    try {
      if (TossAds && typeof TossAds.initialize === 'function') {
        try { TossAds.initialize({}); } catch (e) {}
      }

      if (TossAds && typeof TossAds.attachBanner === 'function') {
        TossAds.attachBanner(adUnitId, containerRef.current);
        attachedRef.current = true;
      }
    } catch (err) {
      console.warn('[BannerAd] 배너 광고 부착 실패', err);
    }
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
