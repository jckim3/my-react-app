import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

function ThemePage() {
  const { theme , count} = useContext(ThemeContext);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Theme 상태 확인 페이지</h2>
      <p>현재 테마는 <strong>{theme}</strong> 입니다.</p>
      <p>현재 count 값은 <strong>{count}</strong> 입니다.</p>
    </div>
  );
}

export default ThemePage;
