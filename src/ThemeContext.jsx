import { createContext, useState } from 'react';

// 1. 컨텍스트 생성
export const ThemeContext = createContext();

// 2. 공급자 컴포넌트 정의
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(0); // ✅ count 상태 추가

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme , count, setCount}}>
      {children}
    </ThemeContext.Provider>
  );
}
