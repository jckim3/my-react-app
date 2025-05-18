import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { connectFirebase } from './lib/firebase'; // ✅ 바로 실행

connectFirebase(); // ✅ 앱 시작과 동시에 연결

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
