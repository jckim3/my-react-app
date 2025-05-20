import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import { collection, doc, onSnapshot, updateDoc, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import AuthPanel from './AuthPanel';

// 상수 정의
const COLLECTIONS = {
  COURSES: 'courses',
  GOLF_WEEKS: 'golf_weeks'
};

// 컴포넌트 분리
const TeeTimeOption = ({ timeKey, teeTime, selected, voterCount, voterNames, onVote }) => (
  <div className="mb-4 ml-4 border-l-2 pl-4">
    <div className="text-sm text-gray-600 dark:text-gray-300">
      🕒 티타임: {new Date(teeTime).toLocaleString()}
    </div>

    <button
      onClick={onVote}
      className={`mt-2 px-4 py-2 rounded ${selected ? 'bg-red-600' : 'bg-blue-500'} text-white hover:bg-opacity-80`}
    >
      {selected
        ? `❌ 선택 취소 (${voterCount}명)`
        : `${voterCount}명 선택하기`}
    </button>

    {voterCount > 0 && (
      <div className="text-sm text-gray-500 mt-1">
        👤 {voterNames.join(', ')}
      </div>
    )}
  </div>
);

// 주차 항목 컴포넌트
const WeekItem = ({ week, coursesMap, user, onVote }) => {
  const votes = week.votes || {};
  const course = week.course;
  const courseInfo = coursesMap[course?.courseId] || {};

  return (
    <div className="mb-6 border rounded shadow p-4 bg-white dark:bg-gray-800 text-left">
      <p className="font-semibold text-lg mb-2">📅 주간 날짜: {week.id.split('_')[0]}</p>

      <div className="flex items-center justify-between mb-2">
        <div className="text-xl font-bold text-green-700 flex items-center gap-2">
          <span>⛳ {course?.courseName || '골프장 이름 없음'}</span>
        </div>
        {courseInfo.link && (
          <a
            href={courseInfo.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline"
          >
            🔗 골프장 상세 보기
          </a>
        )}
      </div>

      {course?.teeTimes?.map(teeTime => {
        const timeKey = `${course.courseId}_${teeTime}`; // 유일한 키
        const selected = votes[user?.uid]?.course === timeKey;
        const voters = Object.entries(votes)
          .filter(([_, v]) => v.course === timeKey)
          .map(([_, v]) => v.name);

        return (
          <TeeTimeOption
            key={timeKey}
            timeKey={timeKey}
            teeTime={teeTime}
            selected={selected}
            voterCount={voters.length}
            voterNames={voters}
            onVote={() => onVote(week.id, timeKey)}
          />
        );
      })}
    </div>
  );
};

export default function InnerAppContent() {
  const { user } = useAuth();
  const [weeks, setWeeks] = useState([]);
  const [coursesMap, setCoursesMap] = useState({});

  // 코스 정보 로드
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const db = getDb();
        const snapshot = await getDocs(collection(db, COLLECTIONS.COURSES));
        const map = snapshot.docs.reduce((acc, doc) => {
          acc[doc.id] = doc.data();
          return acc;
        }, {});
        setCoursesMap(map);
      } catch (error) {
        console.error('코스 로딩 중 오류 발생:', error);
      }
    };

    loadCourses();
  }, []);

  // 골프 주차 정보 로드
  useEffect(() => {
    if (!user) return;

    const db = getDb();
    const colRef = collection(db, COLLECTIONS.GOLF_WEEKS);
    const now = new Date();
    now.setHours(0, 0, 0, 0); // 오늘 00:00 기준

    const unsubscribe = onSnapshot(colRef, (snap) => {
      try {
        const futureWeeks = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(doc => {
            const datePart = doc.id.split('_')[0]; // "2025-05-24"
            const docDate = new Date(datePart);
            return docDate >= now;
          })
          .sort((a, b) => {
            // 날짜 기준으로 정렬
            const aDate = new Date(a.id.split('_')[0]);
            const bDate = new Date(b.id.split('_')[0]);
            return aDate - bDate;
          });

        setWeeks(futureWeeks);
      } catch (error) {
        console.error('골프 주차 데이터 처리 중 오류 발생:', error);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // 투표 기능
  const handleVote = async (weekId, courseKey) => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      const db = getDb();
      const docRef = doc(db, COLLECTIONS.GOLF_WEEKS, weekId);
      const week = weeks.find(w => w.id === weekId);

      if (!week) {
        console.error('해당 주차를 찾을 수 없습니다.');
        return;
      }

      const currentVotes = { ...(week.votes || {}) };
      const currentVote = currentVotes[user.uid];

      // 이미 같은 코스에 투표했으면 취소, 아니면 새로 투표
      if (currentVote?.course === courseKey) {
        delete currentVotes[user.uid];
      } else {
        currentVotes[user.uid] = {
          course: courseKey,
          name: user.displayName || user.email || 'Unknown'
        };
      }

      await updateDoc(docRef, { votes: currentVotes });
      alert('✅ 투표가 반영되었습니다.');
    } catch (error) {
      console.error('투표 처리 중 오류 발생:', error);
      alert('투표 처리 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-screen-md mx-auto text-center">
      <AuthPanel />
      <h1 className="text-3xl font-bold mb-6">🏌️ 다음 골프장 투표</h1>

      {weeks.length > 0 ? (
        weeks.map(week => (
          <WeekItem
            key={week.id}
            week={week}
            coursesMap={coursesMap}
            user={user}
            onVote={handleVote}
          />
        ))
      ) : (
        <p className="text-gray-500">미래에 예정된 골프장이 없습니다.</p>
      )}
    </div>
  );
}