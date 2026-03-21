import { Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import DevToolsPage from './pages/DevToolsPage';
import HomePage from './pages/HomePage';
import WritingPage from './pages/WritingPage';
import CompletionPage from './pages/CompletionPage';
import PointsPage from './pages/PointsPage';
import SettingsPage from './pages/SettingsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<IntroPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/writing" element={<WritingPage />} />
      <Route path="/completion" element={<CompletionPage />} />
      <Route path="/points" element={<PointsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/dev" element={<DevToolsPage />} />
    </Routes>
  );
}

export default App;
