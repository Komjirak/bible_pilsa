import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import WritingPage from './pages/WritingPage';
import CompletionPage from './pages/CompletionPage';
import PointsPage from './pages/PointsPage';
import SettingsPage from './pages/SettingsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/writing" element={<WritingPage />} />
      <Route path="/completion" element={<CompletionPage />} />
      <Route path="/points" element={<PointsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}

export default App;
