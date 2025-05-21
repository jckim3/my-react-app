import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen relative">
      {/* 사이드바 */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)} // ✅ onClose 전달
      />

      {/* 햄버거 버튼 */}
      <button
        className="fixed top-4 left-4 z-30 bg-white border rounded p-2 shadow md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰
      </button>

      {/* 메인 콘텐츠 */}
      <main
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'
          } py-10 px-4`}
      >
        {children}
      </main>
    </div>
  );
}
