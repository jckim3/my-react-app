import { useState, useEffect } from 'react';
import { getDb } from '../lib/firebase';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  getDocs, collection, deleteField
} from 'firebase/firestore';

export default function SetWeeklyCourse() {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId1, setSelectedCourseId1] = useState('');
  const [selectedCourseId2, setSelectedCourseId2] = useState('');
  const [teeTime1, setTeeTime1] = useState('');
  const [teeTime2, setTeeTime2] = useState('');

  const weekId = "2025-05-25";

  useEffect(() => {
    const loadData = async () => {
      const db = getDb();
      const courseSnap = await getDocs(collection(db, 'courses'));
      setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      const weekDoc = await getDoc(doc(db, 'golf_weeks', weekId));
      if (weekDoc.exists()) {
        const data = weekDoc.data();
        if (data.course1) {
          setSelectedCourseId1(data.course1.courseId || '');
          setTeeTime1(data.course1.teeTime || '');
        }
        if (data.course2) {
          setSelectedCourseId2(data.course2.courseId || '');
          setTeeTime2(data.course2.teeTime || '');
        }
      }
    };

    loadData();
  }, []);

  const saveCourse = async (index) => {
    const db = getDb();
    const selectedId = index === 1 ? selectedCourseId1 : selectedCourseId2;
    const teeTime = index === 1 ? teeTime1 : teeTime2;

    if (!selectedId) return alert(`❌ 골프장 ${index}을 선택하세요.`);

    const courseSnap = await getDoc(doc(db, 'courses', selectedId));
    if (!courseSnap.exists()) return alert("❌ 해당 골프장이 존재하지 않습니다.");

    const fieldName = `course${index}`;
    const payload = {
      [fieldName]: {
        courseId: selectedId,
        courseName: courseSnap.data().name,
        teeTime
      },
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'golf_weeks', weekId), payload, { merge: true });
    alert(`✅ 골프장 ${index}이 저장되었습니다.`);
  };

  const deleteCourse = async (index) => {
    const db = getDb();
    const fieldName = `course${index}`;
    await updateDoc(doc(db, 'golf_weeks', weekId), {
      [fieldName]: deleteField(),
      updatedAt: new Date().toISOString()
    });

    if (index === 1) {
      setSelectedCourseId1('');
      setTeeTime1('');
    } else {
      setSelectedCourseId2('');
      setTeeTime2('');
    }

    alert(`🗑️ 골프장 ${index}이 삭제되었습니다.`);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">이번 주 골프장 설정</h3>

      {[1, 2].map(index => {
        const selectedCourseId = index === 1 ? selectedCourseId1 : selectedCourseId2;
        const teeTime = index === 1 ? teeTime1 : teeTime2;
        const setSelectedCourseId = index === 1 ? setSelectedCourseId1 : setSelectedCourseId2;
        const setTeeTime = index === 1 ? setTeeTime1 : setTeeTime2;

        return (
          <div key={index} className="mb-6 border-t pt-4">
            <h4 className="text-lg font-semibold mb-2">⛳ 골프장 {index}</h4>
            <select
              className="border p-2 rounded w-full mb-2"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">선택하세요</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="border p-2 rounded w-full mb-2"
              value={teeTime}
              onChange={(e) => setTeeTime(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                onClick={() => saveCourse(index)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                저장
              </button>
              <button
                onClick={() => deleteCourse(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                ❌ 삭제
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
