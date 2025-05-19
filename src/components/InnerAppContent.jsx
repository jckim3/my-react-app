import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import AuthPanel from './AuthPanel';

export default function InnerAppContent() {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    if (!user) return;

    const db = getDb();
    const colRef = collection(db, 'golf_weeks');

    const now = new Date();
    now.setHours(0, 0, 0, 0); // 오늘 00:00 기준

    const unsubscribe = onSnapshot(colRef, (snap) => {
      const futureWeeks = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => {
          const c1 = doc.course1?.teeTime && new Date(doc.course1.teeTime) >= now;
          const c2 = doc.course2?.teeTime && new Date(doc.course2.teeTime) >= now;
          return c1 || c2;
        })
        .sort((a, b) => {
          const aTime = new Date(a.course1?.teeTime || a.course2?.teeTime);
          const bTime = new Date(b.course1?.teeTime || b.course2?.teeTime);
          return aTime - bTime;
        });

      setWeeks(futureWeeks);
    });

    return () => unsubscribe();
  }, [user]);

  const vote = async (weekId, courseKey) => {
    const db = getDb();
    const docRef = doc(db, 'golf_weeks', weekId);
    const week = weeks.find(w => w.id === weekId);
    const currentVotes = { ...(week.votes || {}) };

    const currentVote = currentVotes[user.uid];
    if (currentVote?.course === courseKey) {
      // ❌ 이미 같은 코스 → 취소
      delete currentVotes[user.uid];
    } else {
      // ✅ 새로 선택 또는 변경
      currentVotes[user.uid] = {
        course: courseKey,
        name: user.displayName || user.email || 'Unknown'
      };
    }

    await updateDoc(docRef, { votes: currentVotes });
    alert('✅ 투표가 반영되었습니다.');
  };

  return (
    <div className="max-w-screen-md mx-auto text-center">
      <AuthPanel />
      <h1 className="text-3xl font-bold mb-6">🏌️ 미래 골프장 투표</h1>

      {weeks.length > 0 ? (
        weeks.map(week => {
          const votes = week.votes || {};
          const selected = votes[user?.uid]?.course || '';

          const course1Voters = Object.entries(votes)
            .filter(([_, v]) => v.course === 'course1')
            .map(([_, v]) => v.name);
          const course2Voters = Object.entries(votes)
            .filter(([_, v]) => v.course === 'course2')
            .map(([_, v]) => v.name);

          return (
            <div key={week.id} className="mb-6 border rounded shadow p-4 bg-white dark:bg-gray-800 text-left">
              <h2 className="text-xl font-semibold mb-2">주간 ID: {week.id}</h2>

              {week.course1 && (
                <div className="mb-4">
                  <div className="font-bold">⛳ {week.course1.courseName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    🕒 {new Date(week.course1.teeTime).toLocaleString()}
                  </div>
                  <button
                    onClick={() => vote(week.id, 'course1')}
                    className={`mt-2 px-4 py-2 rounded ${
                      selected === 'course1' ? 'bg-red-600' : 'bg-blue-500'
                    } text-white hover:bg-opacity-80`}
                  >
                    {selected === 'course1'
                      ? `❌ 선택 취소 (${course1Voters.length}명)`
                      : `${course1Voters.length}명 선택하기`}
                  </button>
                  {course1Voters.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      👤 {course1Voters.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {week.course2 && (
                <div>
                  <div className="font-bold">⛳ {week.course2.courseName}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    🕒 {new Date(week.course2.teeTime).toLocaleString()}
                  </div>
                  <button
                    onClick={() => vote(week.id, 'course2')}
                    className={`mt-2 px-4 py-2 rounded ${
                      selected === 'course2' ? 'bg-red-600' : 'bg-blue-500'
                    } text-white hover:bg-opacity-80`}
                  >
                    {selected === 'course2'
                      ? `❌ 선택 취소 (${course2Voters.length}명)`
                      : `${course2Voters.length}명 선택하기`}
                  </button>
                  {course2Voters.length > 0 && (
                    <div className="text-sm text-gray-500 mt-1">
                      👤 {course2Voters.join(', ')}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">미래에 예정된 골프장이 없습니다.</p>
      )}
    </div>
  );
}
