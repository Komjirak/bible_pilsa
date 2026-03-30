import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { initFontScaleGuard } from './utils/fontScaleGuard';
import './index.css';

// 안드로이드 OS 폰트 스케일링 역보정 (가장 먼저 실행)
initFontScaleGuard();

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
