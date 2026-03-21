import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import WritingPage from './pages/WritingPage';
import CompletionPage from './pages/CompletionPage';
import PointsPage from './pages/PointsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { initialize, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    // App.tsx 최상단에서 단 1회만 초기화
    initialize();
  }, [initialize]);

  if (isLoading) {
    return <div>인증 정보 로딩 중...</div>;
  }

  return (
    <HashRouter>
      <Routes>
        <Route path="/intro" element={<IntroPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={isAuthenticated ? <HomePage /> : <Navigate to="/intro" />} 
        />
        <Route 
          path="/writing" 
          element={isAuthenticated ? <WritingPage /> : <Navigate to="/intro" />} 
        />
        <Route 
          path="/completion" 
          element={isAuthenticated ? <CompletionPage /> : <Navigate to="/intro" />} 
        />
        <Route 
          path="/points" 
          element={isAuthenticated ? <PointsPage /> : <Navigate to="/intro" />} 
        />
        <Route 
          path="/settings" 
          element={isAuthenticated ? <SettingsPage /> : <Navigate to="/intro" />} 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
