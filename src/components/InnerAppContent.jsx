import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';
import AuthPanel from './AuthPanel';
import ThemePage from '../ThemePage';
import { connectFirebase } from '../lib/firebase';
import reactLogo from '../assets/react.svg';
import viteLogo from '/vite.svg';

export default function InnerAppContent() {
  const { theme, toggleTheme, count, setCount, countDown } = useContext(ThemeContext);

  return (
    <div className={`max-w-screen-md mx-auto text-center`}>
      <AuthPanel />

      <div className="flex justify-center gap-4 mb-6">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="h-12" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="h-12" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold mb-6">Vite + React</h1>

      <div className="mb-4">
        <button className="bg-gray-200 text-black rounded px-4 py-2 mb-2" onClick={() => setCount(count + 1)}>
          count is {count}
        </button>
        <button className="bg-red-400 text-white rounded px-4 py-2 mb-2 ml-2" onClick={() => setCount((prev) => Math.max(prev - 1, 0))}>
          Count Down
        </button>
        <button className="bg-red-400 text-blue-500 rounded px-4 py-2 mb-2 ml-2" onClick={countDown}>
          Count Down3
        </button>
        <button onClick={connectFirebase} className="bg-yellow-400 text-black rounded px-4 py-2 hover:bg-yellow-500 transition">
          🔌 Firebase 연결
        </button>
        <p className="text-sm text-gray-500">Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>

      <div className="space-y-2 mb-10">
        <button className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition" onClick={toggleTheme}>
          Toggle Theme ({theme})
        </button>
      </div>

      <h1 className="text-3xl font-bold text-blue-900 mb-4">Tailwind 동작 확인</h1>
      <div className="p-4 rounded bg-white text-black dark:bg-black dark:text-white">
        Tailwind 다크모드 테스트
      </div>
    </div>
  );
}
