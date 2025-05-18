import { useState, useEffect, useContext } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import ThemePage from './ThemePage';
import UserCard from './UserCard';
import './App.css';
import { ThemeContext, ThemeProvider } from './ThemeContext';

function InnerApp() {
  const { theme, toggleTheme, count, setCount,countDown } = useContext(ThemeContext);
  const [showThemePage, setShowThemePage] = useState(false);
  const isDark = theme === 'dark';

  // ✅ 이 부분 추가
  useEffect(() => {
    const root = document.documentElement; // <html> 요소
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const users = [
    { name: 'JC', age: 40, job: '개발자' },
    { name: 'Mina', age: 28, job: '디자이너' },
    { name: 'Tom', age: 35, job: 'PM' }
  ];

  if (showThemePage) {
    return <ThemePage />;
  }

  const handleUserClick = (name) => {
    alert(`🟢 ${name}님을 클릭했습니다!`);
  };

  return (
    // <div className={`${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen py-10 px-4`}>
    <div className={`min-h-screen py-10 px-4 ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <div className="max-w-screen-md mx-auto text-center">
        {/* 로고 */}
        <div className="flex justify-center gap-4 mb-6">
          <a href="https://vite.dev" target="_blank">
            <img src={viteLogo} className="h-12" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="h-12" alt="React logo" />
          </a>
        </div>

        {/* 제목 */}
        <h1 className="text-4xl font-bold mb-6">Vite + React</h1>

        {/* Count 버튼 */}
        <div className="mb-4">
          <button
            className="bg-gray-200 text-black rounded px-4 py-2 mb-2"
            onClick={() => setCount(count + 1)}
          >
            count is {count}
          </button>


          <button
            className="bg-red-400 text-white rounded px-4 py-2 mb-2 ml-2"
            onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
          >
            Count Down
          </button>

          <button
          className="bg-red-400 text-blue-500 rounded px-4 py-2 mb-2 ml-2"
          onClick={countDown} // ✅ 여기!
          >
            Count Down3
          </button>

          <p className="text-sm text-gray-500">
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>

        {/* 테마 전환 및 페이지 이동 버튼 */}
        <div className="space-y-2 mb-10">
          <button
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
            onClick={toggleTheme}
          >
            Toggle Theme ({theme})
          </button>
          <br />
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            onClick={() => setShowThemePage(true)}
          >
            다른 페이지로 이동
          </button>
        </div>

        {/* Tailwind 확인 */}
        <h1 className="text-3xl font-bold text-blue-900 mb-4">Tailwind 동작 확인</h1>
        <div className="p-4 rounded bg-white text-black dark:bg-black dark:text-white">
          Tailwind 다크모드 테스트
      </div>
        {/* 사용자 카드 */}
        <h2 className="text-xl font-semibold mb-4">👥 사용자 카드</h2>
        <div className="space-y-4">
          {users.map((user, index) => (
            <UserCard
              key={index}
              name={user.name}
              age={user.age}
              job={user.job}
              onClick={handleUserClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

export default App;
