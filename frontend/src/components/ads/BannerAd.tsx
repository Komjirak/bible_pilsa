import React, { useEffect, useState } from 'react';

interface BannerAdProps {
  adUnitId: string;
}

export function BannerAd({ adUnitId }: BannerAdProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [AdComponent, setAdComponent] = useState<any>(null);

  useEffect(() => {
    async function loadSdk() {
      try {
        // @apps-in-toss/web-framework의 AdBanner 동적 임포트
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const sdk: any = await import(/* @vite-ignore */ '@apps-in-toss/web-framework').catch(() => null);
        
        if (sdk && sdk.AdBanner) {
          setAdComponent(() => sdk.AdBanner);
        } else {
          console.warn('[BannerAd] AdBanner 컴포넌트 로드 실패 (SDK 미포함 환경)');
        }
      } catch (err) {
        console.warn('[BannerAd] AdBanner 임포트 중 에러 발생', err);
      }
    }
    loadSdk();
  }, []);

  if (!AdComponent) {
    // 개발 환경 / PC 브라우저 등 SDK가 없을 때의 mock 뷰
    return (
      <div style={{
        width: '100%',
        minHeight: '70px',
        backgroundColor: 'var(--color-bg-secondary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '16px 0',
        borderRadius: '12px',
        color: 'var(--color-text-tertiary)',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
      }}>
        Toss Ad Banner Area
      </div>
    );
  }

  // 실제 SDK 컴포넌트 렌더링
  return <AdComponent adUnitId={adUnitId} />;
}
