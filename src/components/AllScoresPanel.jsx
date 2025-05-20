// AllScoresPanel.jsx (관리자 삭제 기능 + 선택 상태 유지)
import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function AllScoresPanel() {
    const db = getDb();
    const { isAdmin } = useAuth();
    const [weeks, setWeeks] = useState([]);
    const [selectedWeek, setSelectedWeek] = useState(() => {
        return JSON.parse(localStorage.getItem('selectedWeek')) || null;
    });
    const [scores, setScores] = useState([]);
    const [sortMode, setSortMode] = useState('score');

    const fetchWeeks = async () => {
        const snap = await getDocs(collection(db, 'golf_weeks'));
        const weekList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWeeks(weekList);
        if (!selectedWeek && weekList.length > 0) {
            setSelectedWeek(weekList[0]);
            localStorage.setItem('selectedWeek', JSON.stringify(weekList[0]));
        }
    };

    const fetchScoresForWeek = async (weekId) => {
        const scoresList = [];
        const userSnap = await getDocs(collection(db, 'golf_scores'));

        for (const userDoc of userSnap.docs) {
            const userId = userDoc.id;
            const name = userDoc.data().name || userId;
            const historySnap = await getDocs(collection(db, 'golf_scores', userId, 'history'));
            const handySnap = await getDocs(query(collection(db, 'golf_scores', userId, 'handy_history'), orderBy('calculatedAt', 'desc')));
            const latestHandy = handySnap.docs[0]?.data()?.scoreAverage || null;

            historySnap.docs.forEach(d => {
                const data = d.data();
                if (data.weekId === weekId) {
                    scoresList.push({
                        id: d.id,
                        userId,
                        name,
                        score: data.score,
                        handy: latestHandy,
                        netScore: latestHandy !== null ? data.score - latestHandy : null
                    });
                }
            });
        }

        sortAndRank(scoresList);
    };

    const sortAndRank = (list) => {
        const sorted = [...list].sort((a, b) => {
            if (sortMode === 'net') return a.netScore - b.netScore;
            return a.score - b.score;
        });
        const ranked = sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
        setScores(ranked);
    };

    useEffect(() => { fetchWeeks(); }, []);
    useEffect(() => {
        if (selectedWeek) {
            localStorage.setItem('selectedWeek', JSON.stringify(selectedWeek));
            fetchScoresForWeek(selectedWeek.id);
        }
    }, [selectedWeek]);
    useEffect(() => { sortAndRank(scores); }, [sortMode]);

    const handleDelete = async (userId, scoreId) => {
        if (!window.confirm('정말 이 스코어를 삭제하시겠습니까?')) return;

        // 1️⃣ 스코어 삭제
        await deleteDoc(doc(db, 'golf_scores', userId, 'history', scoreId));

        // 2️⃣ Handy 히스토리 전체 삭제
        const handySnap = await getDocs(collection(db, 'golf_scores', userId, 'handy_history'));
        for (const docRef of handySnap.docs) {
            await deleteDoc(doc(db, 'golf_scores', userId, 'handy_history', docRef.id));
        }

        fetchScoresForWeek(selectedWeek.id);
    };

    const scoreAvg = scores.length > 0 ? (scores.reduce((sum, s) => sum + s.score, 0) / scores.length).toFixed(1) : '-';
    const netAvg = scores.length > 0 ? (
        scores.filter(s => s.netScore !== null).reduce((sum, s) => sum + s.netScore, 0) / scores.filter(s => s.netScore !== null).length
    ).toFixed(1) : '-';

    return (
        <div className="max-w-screen-md mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">📋 전체 멤버 스코어 기록 (주간별)</h2>

            <select
                className="border p-2 rounded w-full mb-2"
                value={selectedWeek?.id || ''}
                onChange={(e) => {
                    const week = weeks.find(w => w.id === e.target.value);
                    setSelectedWeek(week);
                    localStorage.setItem('selectedWeek', JSON.stringify(week));
                }}
            >
                {weeks.map(week => (
                    <option key={week.id} value={week.id}>
                        {week.id} | {week.course?.courseName || '코스 없음'}
                    </option>
                ))}
            </select>

            <select
                className="border p-2 rounded w-full mb-4"
                value={sortMode}
                onChange={(e) => setSortMode(e.target.value)}
            >
                <option value="score">일반 스코어 순</option>
                <option value="net">순수 스코어 순</option>
            </select>

            <table className="w-full table-auto border border-gray-200">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-left">랭킹</th>
                        <th className="px-4 py-2 text-left">이름</th>
                        <th className="px-4 py-2 text-left">스코어</th>
                        <th className="px-4 py-2 text-left">Handy</th>
                        <th className="px-4 py-2 text-left">순수 스코어</th>
                        {isAdmin && <th className="px-4 py-2 text-left">관리</th>}
                    </tr>
                </thead>
                <tbody>
                    {scores.map((s, i) => (
                        <tr key={i} className="border-t">
                            <td className="px-4 py-2">#{s.rank}</td>
                            <td className="px-4 py-2">{s.name}</td>
                            <td className="px-4 py-2">{s.score}</td>
                            <td className="px-4 py-2">{s.handy !== null ? s.handy : '-'}</td>
                            <td className="px-4 py-2">{s.netScore !== null ? s.netScore.toFixed(1) : '-'}</td>
                            {isAdmin && (
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleDelete(s.userId, s.id)}
                                        className="text-red-500 hover:underline"
                                    >
                                        삭제
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                    <tr className="bg-gray-50 font-semibold">
                        <td className="px-4 py-2" colSpan={2}>평균</td>
                        <td className="px-4 py-2">{scoreAvg}</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2">{netAvg}</td>
                        {isAdmin && <td className="px-4 py-2">-</td>}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
