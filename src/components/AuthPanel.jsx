import { useAuth } from '../context/AuthContext';

function AuthPanel() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="p-4">
        <p>⏳ 로그인 상태 확인 중...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex items-center gap-6 border p-6 rounded shadow mb-6 bg-white text-black dark:bg-gray-800 dark:text-white max-w-xl mx-auto">
      {/* 프로필 이미지 */}
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt="user"
          className="w-24 h-24 rounded-full object-cover border"
        />
      )}

      {/* 텍스트 정보 */}
      <div className="text-left space-y-1">
        <p className="text-xl font-semibold">👤 {user.displayName}</p>
        <p className="text-gray-700 dark:text-gray-300">📧 {user.email}</p>
        <p className="text-blue-600 dark:text-blue-300">
          🛡️ {isAdmin ? '✅ 관리자 권한 있음' : '🙅‍♂️ 일반 사용자'}
        </p>
      </div>
    </div>
  );
}

export default AuthPanel;
