import { useAuth } from '../context/AuthContext';

function AuthPanel() {
  const { user, login, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-4">
        <p>⏳ 로그인 상태 확인 중...</p>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded shadow mb-4 bg-white text-black dark:bg-gray-800 dark:text-white">
      {user ? (
        <>
          <p className="mb-2">
            👤 <strong>{user.displayName}</strong><br />
            ✉️ {user.email}
          </p>
          {user.photoURL && (
            <img src={user.photoURL} alt="user" className="w-16 h-16 rounded-full mb-2" />
          )}
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            로그아웃
          </button>
        </>
      ) : (
        <button
          onClick={login}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Google 로그인
        </button>
      )}
    </div>
  );
}

export default AuthPanel;
