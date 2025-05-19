import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import AuthPanel from './AuthPanel';
import { getDb } from '../lib/firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function InnerAppContent() {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState([]);

  useEffect(() => {
    const loadFutureWeeks = async () => {
      const db = getDb();
      const snap = await getDocs(collection(db, 'golf_weeks'));
      const now = new Date();
      now.setHours(0, 0, 0, 0); // 오늘 자정 (00:00) 기준
      
      const futureWeeks = snap.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(doc => {
          try {
            return (
              (doc.course1 && new Date(doc.course1.teeTime) > now) ||
              (doc.course2 && new Date(doc.course2.teeTime) > now)
            );
          } catch {
            return false;
          }
        })
        .sort((a, b) => {
          const aTime = new Date(a.course1?.teeTime || a.course2?.teeTime);
          const bTime = new Date(b.course1?.teeTime || b.course2?.teeTime);
          return aTime - bTime;
        });

      setWeeks(futureWeeks);
    };

    if (user) loadFutureWeeks();
  }, [user]);

  const vote = async (weekId, courseKey) => {
    const db = getDb();
    const docRef = doc(db, 'golf_weeks', weekId);
    const week = weeks.find(w => w.id === weekId);
    const newVotes = {
      ...(week.votes || {}),
      [user.uid]: courseKey
    };

    await updateDoc(docRef, { votes: newVotes });
    setWeeks(prev =>
      prev.map(w =>
        w.id === weekId ? { ...w, votes: newVotes } : w
      )
    );
    alert('✅ 투표가 저장되었습니다.');
  };

  return (
    <div className="max-w-screen-md mx-auto text-center">
      <AuthPanel />
      <h1 className="text-3xl font-bold mb-6">🏌️ 미래 골프장 투표</h1>

      {weeks.length > 0 ? (
        weeks.map(week => {
          const selected = week.votes?.[user.uid] || '';
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
                      selected === 'course1' ? 'bg-green-600' : 'bg-blue-500'
                    } text-white hover:bg-opacity-80`}
                  >
                    {selected === 'course1' ? '✅ 선택됨' : '이 골프장 선택'}
                  </button>
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
                      selected === 'course2' ? 'bg-green-600' : 'bg-blue-500'
                    } text-white hover:bg-opacity-80`}
                  >
                    {selected === 'course2' ? '✅ 선택됨' : '이 골프장 선택'}
                  </button>
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
