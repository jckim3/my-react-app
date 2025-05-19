// components/Layout.jsx
import Sidebar from './Sidebar';
import { useState } from 'react';

export default function Layout({ children }) {
  const [showThemePage, setShowThemePage] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar setShowThemePage={setShowThemePage} />
      <main className="flex-1 ml-64 py-10 px-4">
        {children}
      </main>
    </div>
  );
}
