import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initFontScaleGuard } from './utils/fontScaleGuard';
import './index.css';

// 안드로이드 OS 폰트 스케일링 역보정 (가장 먼저 실행)
initFontScaleGuard();

// 플랫폼별 CSS 클래스 지정 (Android에서 버튼 더 높게 보정)
const isAndroid = /Android/i.test(navigator.userAgent);
const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
if (isAndroid) document.body.classList.add('platform-android');
else if (isIOS) document.body.classList.add('platform-ios');

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
