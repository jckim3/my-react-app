import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

function Sidebar({ isOpen, onClose, isMobile }) {
  const { isAdmin, logout } = useAuth(); // ✅ logout 가져오기
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
  };

  const handleLogout = async () => {
    await logout();         // 로그아웃 실행
    navigate('/login');     // ✅ 로그인 페이지로 이동
  };


  return (
    <aside
      className={`w-64 bg-gray-800 text-white h-screen p-4 fixed top-0 left-0 z-20 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* 닫기 버튼 (모바일용) */}
      <button
        className="absolute top-2 right-2 text-white md:hidden"
        onClick={onClose}
      >
        ✕
      </button>

      {/* 타이틀 영역 */}
      <div className="flex items-center space-x-2 group cursor-pointer">
        <ClipboardDocumentIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
        <h2 className="text-2xl font-bold">Swing Vote</h2>
      </div>
      <hr className="border-t border-gray-600 mb-4" />

      {/* 메뉴 네비게이션 */}
      <nav className="space-y-2">
        <button
          className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
          onClick={() => handleNav('/')}
        >
          🏠 홈
        </button>
        <button
          className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
          onClick={() => handleNav('/my-score')}
        >
          🏌️ 내 스코어
        </button>
        <button
          className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
          onClick={() => handleNav('/all-scores')}
        >
          📊 전체 스코어
        </button>
        <button
          className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
          onClick={() => handleNav('/settings')}
        >
          ⚙️ 설정
        </button>
        {isAdmin && (
          <>
            <button
              className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
              onClick={() => handleNav('/admin/golf')}
            >
              🛡️ 관리자 전용
            </button>
            <button
              className="block w-full text-left px-2 py-2 rounded hover:bg-gray-700"
              onClick={() => handleNav('/admin/members')}
            >
              👥 멤버 관리
            </button>
          </>
        )}
      </nav>

      {/* ✅ 하단 로그아웃 버튼 (고정 위치) */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded transition"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
