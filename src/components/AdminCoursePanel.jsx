// components/AdminCoursePanel.jsx
import { getDb } from '../lib/firebase'; // ✅ 함수로 불러옴
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

// const db = getDb(); // ✅ connectFirebase()가 App 시작 시 호출되어야 함

export default function AdminCoursePanel() {
  const [courses, setCourses] = useState([]);
  const [newCourseName, setNewCourseName] = useState("");

  const fetchCourses = async () => {    
    const db = getDb(); // ✅ connectFirebase()가 App 시작 시 호출되어야 함
    const snap = await getDocs(collection(db, "courses"));
    setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addCourse = async () => {
    if (newCourseName) {
      await addDoc(collection(db, "courses"), { name: newCourseName });
      setNewCourseName("");
      fetchCourses();
    }
  };

  const deleteCourse = async (id) => {
    await deleteDoc(doc(db, "courses", id));
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h3>골프장 관리</h3>
      <input value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="골프장 이름" />
      <button onClick={addCourse}>추가</button>
      <ul>
        {courses.map(c => (
          <li key={c.id}>
            {c.name} <button onClick={() => deleteCourse(c.id)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
