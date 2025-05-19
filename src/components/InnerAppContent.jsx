import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../ThemeContext';
import AuthPanel from './AuthPanel';
import { getDb } from '../lib/firebase';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function InnerAppContent() {
  const { user } = useAuth();
  const [weekData, setWeekData] = useState(null);
  const [selected, setSelected] = useState('');

  useEffect(() => {
    const loadClosestWeek = async () => {
      const db = getDb();
      const snap = await getDocs(collection(db, 'golf_weeks'));
      const now = new Date();

      // 🔹 미래 티타임을 가진 주 중 가장 가까운 것 찾기
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

      if (futureWeeks.length > 0) {
        const data = futureWeeks[0];
        setWeekData(data);
        if (data.votes && user?.uid) {
          setSelected(data.votes[user.uid]);
        }
      }
    };

    if (user) loadClosestWeek();
  }, [user]);

  const vote = async (courseKey) => {
    const db = getDb();
    const ref = collection(db, 'golf_weeks');
    const docRef = doc(db, 'golf_weeks', weekData.id);

    const newVotes = {
      ...(weekData.votes || {}),
      [user.uid]: courseKey
    };

    await updateDoc(docRef, { votes: newVotes });
    setSelected(courseKey);
    alert('✅ 투표가 저장되었습니다.');
  };

  return (
    <div className="max-w-screen-md mx-auto text-center">
      <AuthPanel />
      <h1 className="text-3xl font-bold mb-6">🏌️ 이번 주 골프장 투표</h1>

      {weekData?.course1 && (
        <div className="border p-4 mb-4 rounded shadow bg-white dark:bg-gray-800 text-left">
          <div className="font-bold text-lg">⛳ {weekData.course1.courseName}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            🕒 {new Date(weekData.course1.teeTime).toLocaleString()}
          </div>
          <button
            onClick={() => vote('course1')}
            className={`mt-2 px-4 py-2 rounded ${
              selected === 'course1' ? 'bg-green-600' : 'bg-blue-500'
            } text-white hover:bg-opacity-80`}
          >
            {selected === 'course1' ? '✅ 선택됨' : '이 골프장 선택'}
          </button>
        </div>
      )}

      {weekData?.course2 && (
        <div className="border p-4 rounded shadow bg-white dark:bg-gray-800 text-left">
          <div className="font-bold text-lg">⛳ {weekData.course2.courseName}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            🕒 {new Date(weekData.course2.teeTime).toLocaleString()}
          </div>
          <button
            onClick={() => vote('course2')}
            className={`mt-2 px-4 py-2 rounded ${
              selected === 'course2' ? 'bg-green-600' : 'bg-blue-500'
            } text-white hover:bg-opacity-80`}
          >
            {selected === 'course2' ? '✅ 선택됨' : '이 골프장 선택'}
          </button>
        </div>
      )}

      {!weekData && (
        <p className="text-gray-500 mt-4">이번 주 골프장 정보가 없습니다.</p>
      )}
    </div>
  );
}
