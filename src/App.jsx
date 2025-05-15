import { useState, useEffect, useContext } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
// './Themepage' 로 쓰야됨, node_modules 안에 있는 npm 패키지를 의미함 (❌ 우리가 만든 파일은 해당 안 됨)
import ThemePage from './ThemePage'; // ✅ ThemePage를 만들어뒀다면 이 줄 꼭 필요
import UserCard from './UserCard'; // ✅ 추가

import './App.css';

import { ThemeContext, ThemeProvider } from './ThemeContext';

function InnerApp() {
  // const [count, setCount] = useState(0);
  const { theme, toggleTheme, count, setCount } = useContext(ThemeContext);
  const [showThemePage, setShowThemePage] = useState(false); // 페이지 전환용

  useEffect(() => {
    console.log(`📢 count 값이 변경되었습니다: ${count}`);
  }, [count]);

  const users = [
    { name: 'JC', age: 40, job: '개발자' },
    { name: 'Mina', age: 28, job: '디자이너' },
    { name: 'Tom', age: 35, job: 'PM' }
  ];

  // ThemeProvider로 감싸진 컴포넌트 트리 안에서 실행됩니다.
  if (showThemePage) {
    return <ThemePage />;
  }

  // InnerApp 내부
const handleUserClick = (name) => {
  alert(`🟢 ${name}님을 클릭했습니다!`);
};

  const isDark = theme === 'dark';

  return (
    <div
      style={{
        textAlign: 'center',
        marginTop: '50px',
        backgroundColor: isDark ? '#222' : '#fff',
        color: isDark ? '#fff' : '#000',
        minHeight: '100vh',
        paddingTop: '2rem',
      }}
    >
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <button onClick={toggleTheme}>
        Toggle Theme ({theme})
      </button>
      <br /><br />
      <button onClick={() => setShowThemePage(true)}>다른 페이지로 이동</button> 

      <br /><br />
      <h2>👥 사용자 카드</h2>
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
  );
}

// ThemeProvider로 감싸줌
function App() {
  return (
    <ThemeProvider>
      <InnerApp />
    </ThemeProvider>
  );
}

export default App;
