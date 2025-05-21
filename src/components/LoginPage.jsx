import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAuthInstance } from '../lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(null); // ✅ auth 상태로 관리
    const navigate = useNavigate();

    // ✅ Firebase가 초기화된 후 auth 인스턴스를 가져옴
    useEffect(() => {
        try {
            const instance = getAuthInstance();
            setAuth(instance);
        } catch (err) {
            console.error('Firebase Auth 초기화 실패:', err.message);
        }
    }, []);

    const handleEmailLogin = async () => {
        if (!auth) return alert('⚠️ Firebase 연결이 아직 완료되지 않았습니다.');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            alert('❌ 로그인 실패: ' + err.message);
        }
    };

    const handleGoogleLogin = async () => {
        if (!auth) return alert('⚠️ Firebase 연결이 아직 완료되지 않았습니다.');

        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            navigate('/');
        } catch (err) {
            alert('❌ Google 로그인 실패: ' + err.message);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* 왼쪽 소개 영역 */}
            <div className="w-1/2 bg-green-900 text-white flex flex-col justify-center items-center p-8">
                <div className="text-5xl font-bold mb-4">🍀 SwingVote</div>
                <p className="text-lg text-center max-w-xs">
                    Golf club management and grouping application.
                </p>
            </div>

            {/* 오른쪽 로그인 영역 */}
            <div className="w-1/2 flex justify-center items-center bg-yellow-50">
                <div className="bg-white rounded-lg shadow-md p-10 w-96">
                    <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>
                    <p className="text-sm text-gray-600 mb-6 text-center">
                        Enter your email and password or sign in with Google.
                    </p>

                    <input
                        type="email"
                        placeholder="m@example.com"
                        className="w-full mb-3 p-2 border border-gray-300 rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full mb-4 p-2 border border-gray-300 rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={handleEmailLogin}
                        disabled={!auth}
                        className="w-full bg-green-900 text-white py-2 rounded hover:bg-green-800 mb-4 disabled:opacity-50"
                    >
                        Login with Email
                    </button>
                    <button
                        onClick={handleGoogleLogin}
                        disabled={!auth}
                        className="w-full border border-gray-400 py-2 rounded flex items-center justify-center space-x-2 hover:bg-gray-100 disabled:opacity-50"
                    >
                        <span>🌐</span>
                        <span>Sign in with Google</span>
                    </button>

                    <p className="mt-4 text-sm text-center text-gray-600">
                        Don’t have an account? <a href="/signup" className="text-blue-600 underline">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
