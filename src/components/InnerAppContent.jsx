import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import AuthPanel from './AuthPanel';
import { getDocs } from 'firebase/firestore';

export default function InnerAppContent() {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});

  // 🧭 Load all course info
  useEffect(() => {

    const loadCourses = async () => {
      const db = getDb();
      const snapshot = await getDocs(collection(db, 'courses'));
      const map = {};
      snapshot.docs.forEach(doc => {
        map[doc.id] = doc.data(); // address, link, name
      });
      setCoursesMap(map);
    };
    loadCourses();
  }, []);

  // 📅 Load upcoming golf weeks
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
          const datePart = doc.id.split('_')[0]; // "2025-05-24"
          const docDate = new Date(datePart);
          const include = docDate >= now;
          console.log(`📌 FILTER → ID: ${doc.id} | DateOnly: ${docDate.toISOString().slice(0, 10)} | Include: ${include}`);
          return include;
        })
      // .sort((a, b) => {
      //   const aDate = new Date(a.id.replace('_', 'T').replace(/-/g, ':').replace(/:/, '-'));
      //   const bDate = new Date(b.id.replace('_', 'T').replace(/-/g, ':').replace(/:/, '-'));
      //   console.log(`🧮 SORT → A: ${a.id} → ${aDate.toISOString()} | B: ${b.id} → ${bDate.toISOString()}`);
      //   return aDate - bDate;
      // });

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
          const course = week.course;
          const courseInfo = coursesMap[course.courseId] || {};


          return (
            <div key={week.id} className="mb-6 border rounded shadow p-4 bg-white dark:bg-gray-800 text-left">
              <p className="font-semibold text-lg mb-2">📅 주간 날짜: {week.id.split('_')[0]}</p>

              <div className="flex items-center justify-between mb-2">
                <div className="text-xl font-bold text-green-700 flex items-center gap-2">
                  <span>⛳ {course?.courseName || '골프장 이름 없음'}</span>
                </div>
                <a
                  // href={`/courses/${course.courseId}`}
                  href={courseInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 underline"
                >
                  🔗 골프장 상세 보기
                </a>
              </div>

              {
                course?.teeTimes?.map((teeTime, index) => {
                  const timeKey = `${course.courseId}_${teeTime}`; // 유일한 키
                  const selected = votes[user?.uid]?.course === timeKey;

                  const voters = Object.entries(votes)
                    .filter(([_, v]) => v.course === timeKey)
                    .map(([_, v]) => v.name);

                  return (
                    <div key={timeKey} className="mb-4 ml-4 border-l-2 pl-4">
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        🕒 티타임: {new Date(teeTime).toLocaleString()}
                      </div>
                      {/* <p className="text-sm text-blue-600 underline mt-1">
                        🔗 <a href={`/courses/${course.courseId}`} target="_blank" rel="noopener noreferrer">
                          골프장 상세 보기
                        </a>
                      </p> */}

                      <button
                        onClick={() => vote(week.id, timeKey)}
                        className={`mt-2 px-4 py-2 rounded ${selected ? 'bg-red-600' : 'bg-blue-500'} text-white hover:bg-opacity-80`}
                      >
                        {selected
                          ? `❌ 선택 취소 (${voters.length}명)`
                          : `${voters.length}명 선택하기`}
                      </button>

                      {voters.length > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                          👤 {voters.join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })
              }
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">미래에 예정된 골프장이 없습니다.</p>
      )}

    </div >
  );
}
