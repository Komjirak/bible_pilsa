import { useEffect, useRef } from 'react';
import { TossAds } from '@apps-in-toss/web-bridge';

interface BannerAdProps {
  adUnitId: string;
  variant?: 'default' | 'image-highlight';
}

export function BannerAd({ adUnitId, variant = 'default' }: BannerAdProps) {
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
        minHeight: variant === 'image-highlight' ? '250px' : '70px',
        backgroundColor: variant === 'image-highlight' ? '#F2F4F6' : 'var(--color-bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '16px',
        color: 'var(--color-text-tertiary)',
        fontSize: '14px',
        overflow: 'hidden',
        border: variant === 'image-highlight' ? '1px solid #E5E8EB' : 'none',
        boxShadow: variant === 'image-highlight' ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
      }}
      data-ad-unit-id={adUnitId}
    />
  );
}
