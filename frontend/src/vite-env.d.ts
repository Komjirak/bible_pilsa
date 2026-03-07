/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_ENV: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// 앱인토스 SDK — 런타임에만 존재, 빌드 타임 타입 stub
declare module '@apps-in-toss/web-framework' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bridge: any;

  // 인앱 광고 2.0 ver2 (전면형/보상형 광고)
  function loadFullScreenAd(params: {
    options: { adGroupId: string };
    onEvent: (event: { type: string; data?: any }) => void;
    onError: (err: unknown) => void;
  }): () => void;
  namespace loadFullScreenAd {
    function isSupported(): boolean;
  }

  function showFullScreenAd(params: {
    options: { adGroupId: string };
    onEvent: (event: { type: string; data?: any }) => void;
    onError: (err: unknown) => void;
  }): () => void;
  namespace showFullScreenAd {
    function isSupported(): boolean;
  }

  export { bridge, loadFullScreenAd, showFullScreenAd };
}
