import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemePage() {
  const { theme, count } = useContext(ThemeContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">🎨 Theme 상태 확인 페이지</h2>
        <p className="mb-2">
          현재 테마는 <span className="font-semibold text-indigo-600 dark:text-indigo-300">{theme}</span> 입니다.
        </p>
        <p>
          현재 count 값은 <span className="font-semibold text-blue-600 dark:text-blue-300">{count}</span> 입니다.
        </p>
      </div>
    </div>
  );
}

export default ThemePage;
