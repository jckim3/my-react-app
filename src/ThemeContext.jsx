import { createContext, useState } from 'react';

// 1. 컨텍스트 생성
export const ThemeContext = createContext();

// 2. 공급자 컴포넌트 정의
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [count, setCount] = useState(0); // ✅ count 상태 추가

  const toggleTheme = () =>
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const countDown = () => {
    setCount((prev) => prev - 1);};

  return (
    // 이건 JSX 문법이고, React에서는 컴포넌트 함수는 JSX를 return해야 합니다.
    // value={...}에 들어간 값만 하위 컴포넌트에서 useContext()로 꺼낼 수 있습니다.
    <ThemeContext.Provider value={{ theme, toggleTheme , count, setCount,countDown}}>
      {children}
    </ThemeContext.Provider>
  );
}
