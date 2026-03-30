/**
 * fontScaleGuard.ts
 * 
 * 안드로이드 WebView에서 기기 하드웨어 폰트 스케일링(접근성 > 글꼴 크기)을
 * 완전 무효화하는 런타임 방어 유틸리티.
 * 
 * 원리:
 *   안드로이드 WebView는 Settings.setTextZoom(percent) 으로 CSS px 값 자체를 스케일링합니다.
 *   CSS의 text-size-adjust: 100% 는 브라우저 자체 텍스트 자동 크기 조절만 비활성화하며,
 *   OS 수준의 접근성 폰트 스케일링은 차단하지 못합니다.
 *   
 *   따라서 런타임에 실제로 렌더링된 1rem의 px 높이를 측정하여 스케일 팩터를 역산하고,
 *   html 루트의 font-size를 역으로 조정하여 결과적으로 모든 하위 요소가
 *   디자인 의도대로 원래 픽셀 크기로 렌더링되게 합니다.
 */

const BASE_FONT_SIZE = 16; // 브라우저 기본 1rem = 16px

/**
 * 현재 OS 레벨 폰트 스케일 팩터를 측정합니다.
 * Android WebView에서 textZoom이 적용되면 1rem != 16px가 됩니다.
 */
function measureFontScale(): number {
  const probe = document.createElement('div');
  probe.style.cssText = [
    'position:absolute',
    'top:-9999px',
    'left:-9999px',
    'font-size:16px',    // 기준 16px
    'line-height:1',
    'height:auto',
    'width:auto',
    'visibility:hidden',
    'pointer-events:none',
  ].join(';');
  probe.textContent = 'M'; // 기준 글자
  document.body.appendChild(probe);
  
  const measuredHeight = probe.getBoundingClientRect().height;
  document.body.removeChild(probe);
  
  // font-size: 16px인데 실제 높이가 16px보다 크면 폰트 스케일이 적용된 것
  const scale = measuredHeight / BASE_FONT_SIZE;
  return scale;
}

/**
 * html 루트 요소에 역보정 font-size를 적용합니다.
 * 예: OS 스케일이 1.5x이면 html font-size를 (16/1.5)px ≈ 10.67px로 설정하여
 *     하위 rem/em 기반 크기가 원래대로 렌더링되게 합니다.
 * 
 * 그러나 이 앱은 inline style에서 px 단위를 직접 사용하고 있으므로,
 * html의 font-size 조정만으로는 부족합니다.
 * 대신 전체 #root에 CSS zoom 역보정을 적용합니다.
 */
function applyFontScaleCorrection(scale: number): void {
  if (scale <= 0 || Math.abs(scale - 1) < 0.02) {
    // 스케일이 1에 가까우면(2% 미만 차이) 보정 불필요
    return;
  }

  const correction = 1 / scale;
  const root = document.getElementById('root');
  const html = document.documentElement;
  
  if (root) {
    // 1) CSS zoom을 사용한 역보정 (Android WebView에서 잘 동작)
    root.style.zoom = String(correction);
    
    // 2) zoom으로 축소된 만큼 width/height를 역으로 확대하여 레이아웃 유지
    root.style.width = `${scale * 100}%`;
    root.style.minHeight = `${scale * 100}vh`;
  }
  
  // html에도 font-size 역보정 적용 (rem 기반 스타일 방어)
  html.style.fontSize = `${BASE_FONT_SIZE * correction}px`;

  console.log(
    `[FontScaleGuard] OS 폰트 스케일 ${scale.toFixed(2)}x 감지 → ` +
    `zoom: ${correction.toFixed(4)}, html font-size: ${(BASE_FONT_SIZE * correction).toFixed(2)}px`
  );
}

/**
 * 앱 시작 시 호출합니다.
 * DOM이 ready 상태여야 정확한 측정이 가능합니다.
 */
export function initFontScaleGuard(): void {
  // requestAnimationFrame으로 첫 렌더링 이후에 측정
  const run = () => {
    const scale = measureFontScale();
    applyFontScaleCorrection(scale);
  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    requestAnimationFrame(run);
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(run);
    });
  }
}
