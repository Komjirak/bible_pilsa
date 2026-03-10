// 앱인토스 Bridge SDK 연동 유틸
// @apps-in-toss/web-framework@2.0.1 기반
// SDK 2.0.1에서 appLogin()이 제거됨 → 토스 앱 컨테이너가 자동 인증 제공

import { getAppsInTossGlobals, graniteEvent, tdsEvent } from '@apps-in-toss/web-bridge';

type ColorMode = 'light' | 'dark';

// 개발 환경 여부 (Vite 빌드 시 process.env.NODE_ENV 기준)
const isDev = import.meta.env.DEV;

// 앱 글로벌 정보 획득 (토스 앱 런타임에서 주입됨)
export function getAppGlobals() {
  try {
    return getAppsInTossGlobals();
  } catch {
    return {
      deploymentId: 'dev-local',
      brandDisplayName: '말씀필사',
      brandIcon: '',
      brandPrimaryColor: '#3182F6',
    };
  }
}

// 뒤로가기 이벤트 리스너 등록
export function onBackEvent(handler: () => void): () => void {
  try {
    return graniteEvent.addEventListener('backEvent', { onEvent: handler });
  } catch {
    return () => {};
  }
}

// 더보기 버튼 이벤트 리스너 등록
export function onNavigationAccessoryEvent(handler: (data: { id: string }) => void): () => void {
  try {
    return tdsEvent.addEventListener('navigationAccessoryEvent', { onEvent: handler });
  } catch {
    return () => {};
  }
}

export function navigateBack(): void {
  try {
    window.history.back();
  } catch {
    // 무시
  }
}

export function navigateClose(): void {
  try {
    window.history.back();
  } catch {
    // 무시
  }
}

export function hapticImpact(_style: 'light' | 'medium' | 'heavy' = 'medium'): void {
  // SDK 2.0.1 — haptic은 네이티브에서 자동 처리
}

export function hapticError(): void {
  // SDK 2.0.1 — haptic은 네이티브에서 자동 처리
}

export async function getColorMode(): Promise<ColorMode> {
  try {
    // 토스 앱 스타일을 따르므로 기본 light
    return 'light';
  } catch {
    return 'light';
  }
}

export async function getDeviceInfo() {
  if (isDev) {
    return { appVersion: '1.0.0', platform: 'ios' as const };
  }
  return { appVersion: '1.0.0', platform: 'ios' as const };
}

export async function requestNotificationPermission(): Promise<boolean> {
  // 토스 알림 권한은 설정 화면에서 useUserSettings 훅을 통해 처리
  return false;
}
