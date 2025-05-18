import { createContext, useEffect, useState, useContext } from 'react';
import { getAuthInstance } from '../lib/firebase';
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuthInstance();
// firebaseUser 객체는 직접 정의하는 것이 아니라, 
// Firebase Authentication 라이브러리가 내부적으로 생성해서 onAuthStateChanged() 함수의 콜백에 전달해주는 객체

  useEffect(() => {
    // onAuthStateChanged로 로그인 상태 리스닝 시작 -> Firebase가 현재 로그인한 사용자를 전달 → setUser(firebaseUser)
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("❌ 로그인 실패:", error);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("❌ 로그아웃 실패:", error);
    }
  };

    // ✅ 관리자 이메일 확인
  const isAdmin = user?.email === 'jckim3@gmail.com';

  return (
    //value={{ ... }} 부분은 React Context에 실제로 전달할 값입니다. 
    // 즉, 이 값들을 useAuth() 같은 훅을 통해 어디서든 접근할 수 있습니다.
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ 편리한 훅으로 제공
// AuthContext 안에 있는 값을 컴포넌트 어디서든 쉽게 꺼내쓸 수 있게 해주는 헬퍼 함수입니다.
// AuthContext는 AuthProvider 안에서 정의한 user, login, logout, loading 같은 값을 담고 있습니다.
// useContext(AuthContext)는 이 값을 현재 컴포넌트에서 직접 접근할 수 있게 해줘요.
// useAuth()는 이걸 한 줄로 간편하게 꺼내도록 만든 **custom hook (사용자 정의 훅)**입니다.
export function useAuth() {
  return useContext(AuthContext);
}
