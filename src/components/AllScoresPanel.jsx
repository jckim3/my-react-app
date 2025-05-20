// AllScoresPanel.jsx
import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import {
    collection,
    getDocs,
    doc,
    deleteDoc,
    query,
    orderBy,
    limit
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function AllScoresPanel() {
    const { user, isAdmin } = useAuth();
    const [members, setMembers] = useState([]);
    const db = getDb();

    const fetchData = async () => {
        const usersSnap = await getDocs(collection(db, 'golf_scores'));
        const data = await Promise.all(
            usersSnap.docs.map(async (uDoc) => {
                const userId = uDoc.id;
                const name = uDoc.data().name || userId;

                const historySnap = await getDocs(
                    query(collection(db, 'golf_scores', userId, 'history'), orderBy('date', 'desc'), limit(5))
                );
                const handySnap = await getDocs(
                    query(collection(db, 'golf_scores', userId, 'handy_history'), orderBy('calculatedAt', 'desc'), limit(1))
                );

                return {
                    userId,
                    name,
                    scores: historySnap.docs.map(d => ({ id: d.id, ...d.data() })),
                    handy: handySnap.docs[0]?.data() || null
                };
            })
        );
        setMembers(data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteScore = async (userId, scoreId) => {
        if (!isAdmin) return alert('관리자만 삭제할 수 있습니다.');
        await deleteDoc(doc(db, 'golf_scores', userId, 'history', scoreId));
        fetchData();
    };

    return (
        <div className="max-w-screen-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">📋 전체 멤버 스코어 기록</h2>
            {members.map((m) => (
                <div key={m.userId} className="mb-6 border p-4 rounded shadow bg-white">
                    <h3 className="text-lg font-semibold mb-2">👤 {m.name}</h3>
                    {m.handy && (
                        <div className="text-sm text-green-700 mb-2">
                            📈 Handy 평균: {m.handy.scoreAverage} (최근 {m.handy.roundCount}회)
                        </div>
                    )}
                    <ul className="space-y-1">
                        {m.scores.map(s => (
                            <li key={s.id} className="text-sm text-gray-800 flex justify-between items-center">
                                <span>
                                    🗓 {new Date(s.date || s.teeTime).toLocaleDateString()} | ⛳ {s.courseName} | 스코어: <strong>{s.score}</strong>
                                </span>
                                {isAdmin && (
                                    <button
                                        onClick={() => deleteScore(m.userId, s.id)}
                                        className="text-red-500 hover:underline ml-2"
                                    >
                                        삭제
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
