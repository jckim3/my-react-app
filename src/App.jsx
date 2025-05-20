// src/App.jsx
import './App.css';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminGolfPage from './components/AdminGolfPage';
import InnerAppContent from './components/InnerAppContent';
import Layout from './components/Layout';
import ThemePage from './ThemePage'; // ✅ 추가
import MyScorePanel from './components/MyScorePanel'; // ✅ 추가
import AllScoresPanel from './components/AllScoresPanel'; // ✅ 전체 스코어 페이지 추가

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><InnerAppContent /></Layout>} />
            <Route path="/settings" element={<Layout><ThemePage /></Layout>} />  {/* ✅ 추가 */}
            <Route path="/my-score" element={<Layout><MyScorePanel /></Layout>} /> {/* ✅ 추가된 내 스코어 페이지 */}
            <Route path="/all-scores" element={<Layout><AllScoresPanel /></Layout>} /> {/* ✅ 전체 스코어 페이지 */}
            <Route path="/admin/golf" element={<Layout><AdminGolfPage /></Layout>} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
