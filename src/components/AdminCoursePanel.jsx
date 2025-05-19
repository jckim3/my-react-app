import { useEffect, useState } from 'react';
import { getDb } from '../lib/firebase';
import {
  collection, getDocs, addDoc, deleteDoc, doc, updateDoc
} from 'firebase/firestore';

export default function AdminCoursePanel() {
  const [courses, setCourses] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [link, setLink] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editFields, setEditFields] = useState({});

  const fetchCourses = async () => {
    const db = getDb();
    const snap = await getDocs(collection(db, 'courses'));
    setCourses(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const addCourse = async () => {
    const db = getDb();
    if (!name.trim()) return alert('골프장 이름을 입력하세요');

    await addDoc(collection(db, 'courses'), {
      name,
      address,
      link
    });

    setName('');
    setAddress('');
    setLink('');
    fetchCourses();
  };

  const deleteCourse = async (id) => {
    const db = getDb();
    await deleteDoc(doc(db, 'courses', id));
    fetchCourses();
  };

  const startEdit = (course) => {
    setEditingId(course.id);
    setEditFields({
      name: course.name,
      address: course.address || '',
      link: course.link || ''
    });
  };

  const saveEdit = async () => {
    const db = getDb();
    await updateDoc(doc(db, 'courses', editingId), {
      name: editFields.name,
      address: editFields.address,
      link: editFields.link
    });
    setEditingId(null);
    setEditFields({});
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div>
      <h3 className="text-xl font-bold mb-4">⛳ 골프장 관리</h3>

      <div className="space-y-2 mb-4">
        <input
          className="border p-2 rounded w-full"
          placeholder="골프장 이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="골프장 주소"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="border p-2 rounded w-full"
          placeholder="골프장 링크 (예: https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          onClick={addCourse}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          추가
        </button>
      </div>

      <ul className="space-y-4">
        {courses.map((c) => (
          <li key={c.id} className="border p-4 rounded shadow">
            {editingId === c.id ? (
              <>
                <input
                  className="border p-1 rounded w-full mb-1"
                  value={editFields.name}
                  onChange={(e) => setEditFields({ ...editFields, name: e.target.value })}
                />
                <input
                  className="border p-1 rounded w-full mb-1"
                  value={editFields.address}
                  onChange={(e) => setEditFields({ ...editFields, address: e.target.value })}
                />
                <input
                  className="border p-1 rounded w-full mb-2"
                  value={editFields.link}
                  onChange={(e) => setEditFields({ ...editFields, link: e.target.value })}
                />
                <div className="flex justify-end space-x-2">
                  <button onClick={saveEdit} className="bg-green-500 text-white px-3 py-1 rounded">저장</button>
                  <button onClick={() => setEditingId(null)} className="text-gray-500">취소</button>
                </div>
              </>
            ) : (
              <>
                <div className="font-bold">{c.name}</div>
                {c.address && <div className="text-sm text-gray-500">📍 {c.address}</div>}
                {c.link && (
                  <div className="text-sm">
                    🔗 <a href={c.link} className="text-blue-500 underline" target="_blank" rel="noreferrer">웹사이트</a>
                  </div>
                )}
                <div className="flex justify-end space-x-3 mt-2">
                  <button onClick={() => startEdit(c)} className="text-indigo-500 hover:underline">수정</button>
                  <button onClick={() => deleteCourse(c.id)} className="text-red-500 hover:underline">삭제</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
