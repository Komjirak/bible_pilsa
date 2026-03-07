// 앱인토스 Bridge SDK 연동 유틸
// @apps-in-toss/web-framework@2.0.1 기반
// React 19.2.3 환경에서 동작

type ColorMode = 'light' | 'dark';

interface BridgeSDK {
  appLogin: () => Promise<{ authorizationCode: string; referrer: string }>;
  navigation: {
    back: () => void;
    close: () => void;
  };
  haptic: {
    impact: (style?: 'light' | 'medium' | 'heavy') => void;
    notification: (type?: 'success' | 'warning' | 'error') => void;
  };
  device: {
    getColorMode: () => Promise<ColorMode>;
    getInfo: () => Promise<{ appVersion: string; platform: 'ios' | 'android' }>;
  };
  notification: {
    request: () => Promise<boolean>;
  };
}

// SDK 초기화 상태
let sdkInitialized = false;

// 개발 환경 목 SDK
const mockSdk: BridgeSDK = {
  appLogin: async () => {
    console.warn('[mock] appLogin 호출됨');
    return { authorizationCode: 'mock-auth-code', referrer: 'https://komjirak-bible.apps.tossmini.com' };
  },
  navigation: {
    back: () => console.warn('[mock] navigation.back 호출됨'),
    close: () => console.warn('[mock] navigation.close 호출됨'),
  },
  haptic: {
    impact: (style) => console.warn('[mock] haptic.impact 호출됨:', style),
    notification: (type) => console.warn('[mock] haptic.notification 호출됨:', type),
  },
  device: {
    getColorMode: async () => 'dark',
    getInfo: async () => ({ appVersion: '1.0.0', platform: 'ios' }),
  },
  notification: {
    request: async () => true,
  },
};

// 실제 SDK 인스턴스 (런타임에 주입)
let bridge: BridgeSDK = mockSdk;

export async function initBridge(): Promise<void> {
  if (sdkInitialized) return;

  try {
    // @apps-in-toss/web-framework SDK 동적 임포트 시도
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sdk: any = await import(/* @vite-ignore */ '@apps-in-toss/web-framework').catch(() => null);
    if (sdk && sdk.bridge) {
      bridge = sdk.bridge as BridgeSDK;
      console.log('[bridge] 앱인토스 SDK 초기화 성공');
    } else {
      console.warn('[bridge] SDK 없음 — 목 SDK 사용');
    }
  } catch {
    console.warn('[bridge] SDK 로드 실패 — 목 SDK 사용');
  }

  sdkInitialized = true;
}

export async function appLogin(): Promise<{ authorizationCode: string; referrer: string }> {
  return bridge.appLogin();
}

export function navigateBack(): void {
  bridge.navigation.back();
}

export function navigateClose(): void {
  bridge.navigation.close();
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'medium'): void {
  try {
    bridge.haptic.impact(style);
  } catch {
    // 햅틱 실패는 무시
  }
}

export function hapticError(): void {
  try {
    bridge.haptic.notification('error');
  } catch {
    // 무시
  }
}

export async function getColorMode(): Promise<ColorMode> {
  try {
    return await bridge.device.getColorMode();
  } catch {
    return 'dark';
  }
}

export async function getDeviceInfo() {
  try {
    return await bridge.device.getInfo();
  } catch {
    return { appVersion: '1.0.0', platform: 'ios' as const };
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  try {
    return await bridge.notification.request();
  } catch {
    return false;
  }
}
