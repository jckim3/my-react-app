import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // 필요

function Sidebar({ setShowThemePage }) {
  const { isAdmin } = useAuth();
 const navigate = useNavigate(); // ✅ 여기가 중요합니다!

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-6">📋 메뉴</h2>
      <nav className="space-y-2">
<button
          className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
          onClick={() => alert('홈 버튼은 현재 페이지입니다')}
        >
          🏠 홈
        </button>
        <button
          className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
          onClick={() => setShowThemePage(true)} // ✅ 설정 → ThemePage 이동
        >
          ⚙️ 설정
        </button>

        {isAdmin && (
          <button
            className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
            onClick={() => navigate('/admin/golf')} // ✅ 관리자 페이지로 이동
          >
            🛡️ 관리자 전용
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar; // ✅ 하나만 남기세요
