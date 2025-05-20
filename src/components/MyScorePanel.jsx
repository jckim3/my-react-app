import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import {
    collection, addDoc, getDocs
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function MyScorePanel() {
    const { user } = useAuth();
    const [score, setScore] = useState('');
    const [history, setHistory] = useState([]);
    const [availableWeeks, setAvailableWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(null);

    const db = getDb();

    // 🔁 내 스코어 기록 불러오기
    const fetchHistory = async () => {
        const snap = await getDocs(collection(db, 'golf_scores', user.uid, 'history'));
        const docs = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.teeTime || b.date) - new Date(a.teeTime || a.date));

        setHistory(docs);
        return docs.map(h => h.weekId);
    };

    // 📋 아직 점수 입력하지 않은 라운드만 가져오기
    const fetchUnscoredWeeks = async () => {
        const weekSnap = await getDocs(collection(db, 'golf_weeks'));
        const allWeeks = weekSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const historyWeekIds = await fetchHistory();

        const filtered = allWeeks.filter(week =>
            user.uid in (week.votes || {}) &&
            !historyWeekIds.includes(week.id)
        );

        setAvailableWeeks(filtered);
        setSelectedWeek(filtered[0] || null);
    };

    useEffect(() => {
        if (user) fetchUnscoredWeeks();
    }, [user]);

    // ✅ 점수 및 Handy 저장
    const submitScore = async () => {
        const parsedScore = parseInt(score);
        if (isNaN(parsedScore)) return alert('숫자로 입력하세요');
        if (!selectedWeek) return alert('라운드를 선택하세요');

        const course = selectedWeek.course;

        // 1️⃣ 점수 저장
        await addDoc(collection(db, 'golf_scores', user.uid, 'history'), {
            userId: user.uid,
            name: user.displayName || user.email || 'Unknown',
            score: parsedScore,
            date: course.teeTimes?.[0] || new Date().toISOString(),
            weekId: selectedWeek.id,
            courseId: course.courseId,
            courseName: course.courseName,
            teeTime: course.teeTimes?.[0] || null
        });

        setScore('');
        await fetchUnscoredWeeks();

        // 2️⃣ Handy 계산 & 저장 (history 상태 말고 fresh snapshot 사용)
        const snap = await getDocs(collection(db, 'golf_scores', user.uid, 'history'));
        const fresh = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .sort((a, b) => new Date(b.teeTime || b.date) - new Date(a.teeTime || a.date));

        const recent = fresh.slice(0, 5).map(h => h.score);
        console.log('📊 Handy 저장용 최근 5회 스코어:', recent);

        if (recent.length > 0) {
            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
            console.log(`✅ Handy 저장: 평균 ${avg.toFixed(1)}, 라운드 수 ${recent.length}`);

            await addDoc(collection(db, 'golf_scores', user.uid, 'handy_history'), {
                scoreAverage: parseFloat(avg.toFixed(1)),
                roundCount: recent.length,
                calculatedAt: new Date().toISOString()
            });

            alert(`✅ 스코어와 Handy(${avg.toFixed(1)}) 저장 완료!`);
        } else {
            alert('✅ 스코어는 저장되었지만, Handy 계산할 수 없습니다.');
        }
    };

    return (
        <div className="max-w-screen-md mx-auto p-4">
            <h2 className="text-xl font-bold mb-2">🏌️ 스코어 입력</h2>

            {/* Handy 요약 */}
            {history.length > 0 && (
                <div className="mb-4 text-lg text-green-700 font-semibold">
                    📈 최근 5회 평균 스코어 (Handy): {
                        (() => {
                            const recent = history.slice(0, 5).map(h => h.score);
                            if (recent.length === 0) return '없음';
                            const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
                            return avg.toFixed(1);
                        })()
                    }
                </div>
            )}

            {/* 라운드 선택 */}
            <div className="mb-4">
                <label className="block font-semibold mb-1">🔍 스코어 입력할 라운드 선택:</label>
                <select
                    value={selectedWeek?.id || ''}
                    onChange={(e) => {
                        const selected = availableWeeks.find(w => w.id === e.target.value);
                        setSelectedWeek(selected);
                    }}
                    className="border rounded p-2 w-full"
                >
                    {availableWeeks.length === 0 && (
                        <option disabled>⛳ 입력할 라운드가 없습니다</option>
                    )}
                    {availableWeeks.map(week => (
                        <option key={week.id} value={week.id}>
                            {week.id} | {week.course?.courseName || '코스 없음'}
                        </option>
                    ))}
                </select>
            </div>

            {/* 스코어 입력 */}
            {selectedWeek && (
                <div className="mb-6">
                    <label className="block font-semibold mb-1">📝 스코어 입력:</label>
                    <input
                        type="number"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        className="border p-2 rounded w-1/2"
                        placeholder="예: 84"
                    />
                    <button
                        onClick={submitScore}
                        className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        저장
                    </button>
                </div>
            )}

            {/* 전체 스코어 기록 */}
            <h3 className="text-lg font-semibold mb-2">📊 내 전체 스코어 기록</h3>
            <ul className="space-y-2">
                {history.map((h) => (
                    <li key={h.id} className="border p-3 rounded bg-white shadow">
                        <div className="font-semibold">{h.courseName || '골프장 미지정'}</div>
                        <div className="text-sm text-gray-500">
                            📅 {new Date(h.teeTime || h.date).toLocaleDateString()} | ⛳ 스코어: <strong>{h.score}</strong>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
