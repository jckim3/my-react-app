// src/App.jsx
import './App.css';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminGolfPage from './components/AdminGolfPage';
import InnerAppContent from './components/InnerAppContent';
import Layout from './components/Layout';
import ThemePage from './ThemePage';
import MyScorePanel from './components/MyScorePanel';
import AllScoresPanel from './components/AllScoresPanel';
import AdminMemberPanel from './components/AdminMemberPanel';
import LoginPage from './components/LoginPage'; // ✅ 로그인 페이지 import 추가

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout><InnerAppContent /></Layout>} />
            <Route path="/settings" element={<Layout><ThemePage /></Layout>} />
            <Route path="/my-score" element={<Layout><MyScorePanel /></Layout>} />
            <Route path="/all-scores" element={<Layout><AllScoresPanel /></Layout>} />
            <Route path="/admin/golf" element={<Layout><AdminGolfPage /></Layout>} />
            <Route path="/admin/members" element={<Layout><AdminMemberPanel /></Layout>} />

            {/* ✅ 로그인 페이지 경로 추가 */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
