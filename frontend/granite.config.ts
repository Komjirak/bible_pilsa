// 앱인토스 Bridge SDK 설정 (@apps-in-toss/web-framework@2.0.1)
// 실제 배포 시 이 파일이 ait build 커맨드에 의해 사용됩니다.

interface BrandConfig {
  displayName: string;
  primaryColor: string;
  icon: string;
  bridgeColorMode: string;
}

interface WebConfig {
  host: string;
  port: number;
  commands: {
    dev: string;
    build: string;
  };
}

interface GraniteConfig {
  appName: string;
  brand: BrandConfig;
  web: WebConfig;
  permissions: string[];
  webViewProps: {
    type: string;
  };
}

function defineConfig(config: GraniteConfig): GraniteConfig {
  return config;
}

export default defineConfig({
  appName: 'komjirak-bible',
  brand: {
    displayName: '말씀필사',
    primaryColor: '#3182F6',
    icon: 'https://komjirak-bible.apps.tossmini.com/icon.png',
    bridgeColorMode: 'basic',
  },
  web: {
    host: 'localhost',
    port: 5173,
    commands: {
      dev: 'vite',
      build: 'vite build',
    },
  },
  permissions: [],
  webViewProps: {
    type: 'partner',
  },
});
