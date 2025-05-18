import { useAuth } from '../context/AuthContext';

function Sidebar() {
  const { isAdmin } = useAuth();

  return (
    <aside className="w-64 bg-gray-800 text-white min-h-screen p-4 fixed top-0 left-0">
      <h2 className="text-xl font-bold mb-6">📋 메뉴</h2>
      <nav className="space-y-2">
        <a href="#" className="block px-2 py-2 rounded hover:bg-gray-700">🏠 홈</a>
        <a href="#" className="block px-2 py-2 rounded hover:bg-gray-700">⚙️ 설정</a>
        {isAdmin && (
          <a href="#" className="block px-2 py-2 rounded hover:bg-gray-700">🛡️ 관리자 전용</a>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar; // ✅ 하나만 남기세요
