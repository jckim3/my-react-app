import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Sidebar({ isOpen, onClose, isMobile }) {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  console.log('🔍 Sidebar rendered. isOpen:', isOpen);

  const handleNav = (path) => {
    navigate(path);
    if (isMobile) onClose();
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

      <h2 className="text-xl font-bold mb-6">📋 메뉴</h2>
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
    </aside>
  );
}

export default Sidebar;
