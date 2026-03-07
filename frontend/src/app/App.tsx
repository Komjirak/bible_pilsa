import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './page';
import WritingPage from './writing/page';
import CompletionPage from './completion/page';
import PointsPage from './points/page';
import SettingsPage from './settings/page';
import { useBridgeSDK } from '@/hooks/useBridgeSDK';

export function App() {
  const { colorMode } = useBridgeSDK();

  return (
    <div className={colorMode === 'dark' ? 'dark' : ''}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/writing" element={<WritingPage />} />
        <Route path="/completion" element={<CompletionPage />} />
        <Route path="/points" element={<PointsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}
