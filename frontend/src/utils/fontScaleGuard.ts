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
 * html 루트 요소에 CSS zoom 역보정을 적용합니다.
 *
 * transform: scale()은 레이아웃 좌표계는 그대로 두고 시각적 렌더링만 축소하므로
 * absolute/fixed 포지션 요소들이 잘못된 위치에 렌더링되는 문제가 생깁니다.
 *
 * CSS zoom은 레이아웃과 렌더링을 함께 균등하게 조정하므로
 * 포지션 요소가 깨지지 않고 의도한 디자인대로 표시됩니다.
 * Android WebView(Chromium 기반)에서 zoom 속성을 지원합니다.
 *
 * zoom만 적용하면 html이 viewport의 (correction * 100)%만 채워 빈 공간이 생기므로,
 * html 너비를 (scale * 100)vw로 확장하고 body 정렬을 flex-start로 고정해야 합니다.
 * 또한 #root max-width: 480px가 확장된 html 너비에서 clip되지 않도록 제거합니다.
 */
function applyFontScaleCorrection(scale: number): void {
  if (scale <= 0 || Math.abs(scale - 1) < 0.02) {
    // 스케일이 1에 가까우면(2% 미만 차이) 보정 불필요
    return;
  }

  const correction = 1 / scale;
  const html = document.documentElement;
  const body = document.body;
  const root = document.getElementById('root');

  // 1) CSS zoom으로 전체 페이지를 균등하게 역보정
  //    textZoom=1.5 → zoom=0.667 → 폰트 24px * 0.667 = 16px (의도한 크기)
  (html.style as CSSStyleDeclaration & { zoom: string }).zoom = String(correction);

  // 2) zoom으로 콘텐츠가 시각적으로 축소된 만큼 html 치수를 반비례로 확장
  //    (예: zoom=0.667이면 html을 150vw로 확장 → 150vw * 0.667 = 100vw 시각적 너비)
  html.style.width = `${scale * 100}vw`;
  html.style.minHeight = `${scale * 100}vh`;
  html.style.overflowX = 'hidden';

  // 3) body의 flex 중앙 정렬 해제 — html 확장 후 #root가 좌측 기준으로 배치되도록
  body.style.justifyContent = 'flex-start';

  // 4) #root max-width: 480px 제거 — html이 480px 이상으로 확장될 때 clip 방지
  //    min-height도 확장 — #root가 시각적으로 화면 전체 높이를 채우도록
  if (root) {
    root.style.maxWidth = 'none';
    root.style.minHeight = `${scale * 100}vh`;
  }

  // 5) CSS 변수로 zoom-보정된 스크린 높이 노출
  //    zoom=0.667일 때 height:100vh는 시각적 66.7%만 채움.
  //    height:var(--screen-height) = 150vh CSS → 150vh*0.667 = 100vh 시각적으로 화면 꽉 참.
  html.style.setProperty('--screen-height', `${scale * 100}vh`);

  console.log(
    `[FontScaleGuard] OS 폰트 스케일 ${scale.toFixed(2)}x 감지 → ` +
    `html zoom: ${correction.toFixed(4)}, width: ${scale * 100}vw, --screen-height: ${scale * 100}vh`
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
