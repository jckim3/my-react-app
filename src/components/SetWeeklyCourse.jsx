// components/SetWeeklyCourse.jsx
import { getDb } from '../lib/firebase'; // ✅ 함수로 불러옴
import { doc, getDoc, setDoc, getDocs, collection } from 'firebase/firestore';
import { useState, useEffect } from 'react';

// const db = getDb(); // ✅ connectFirebase()가 App 시작 시 호출되어야 함

export default function SetWeeklyCourse() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [teeTime, setTeeTime] = useState("");

  const weekId = "2025-05-25"; // 이번 주 날짜

  useEffect(() => {
    const loadCourses = async () => {
      const db = getDb(); // ✅ connectFirebase()가 App 시작 시 호출되어야 함
      const snap = await getDocs(collection(db, "courses"));
      setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    loadCourses();
  }, []);

  const submit = async () => {
    const courseDoc = await getDoc(doc(db, "courses", selectedCourseId));
    await setDoc(doc(db, "golf_weeks", weekId), {
      courseId: selectedCourseId,
      courseName: courseDoc.data().name,
      teeTime,
      createdAt: new Date().toISOString()
    });
    alert("이번 주 골프장이 설정되었습니다.");
  };

  return (
    <div>
      <h3>이번 주 골프장 설정</h3>
      <select onChange={(e) => setSelectedCourseId(e.target.value)} value={selectedCourseId}>
        <option value="">선택하세요</option>
        {courses.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      <input type="datetime-local" value={teeTime} onChange={(e) => setTeeTime(e.target.value)} />
      <button onClick={submit}>저장</button>
    </div>
  );
}
