import { useState, useEffect } from 'react';
import { getDb } from '../lib/firebase';
import {
  doc, getDoc, setDoc, deleteDoc,
  getDocs, collection
} from 'firebase/firestore';

// 문서 ID 생성 (날짜+시간)
const generateDocIdFromTeeTime = (teeTime) => {
  const dt = new Date(teeTime);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  const hh = String(dt.getHours()).padStart(2, '0');
  const min = String(dt.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}_${hh}-${min}`;
};

function formatDateLocal(dt) {
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, '0');
  const dd = String(dt.getDate()).padStart(2, '0');
  const hh = String(dt.getHours()).padStart(2, '0');
  const min = String(dt.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

export default function SetWeeklyCourse() {
  const [courses, setCourses] = useState([]);
  const [inputs, setInputs] = useState([
    { selectedCourseId: '', teeTimes: ['', ''] }, // 골프장 1
    { selectedCourseId: '', teeTimes: ['', ''] }  // 골프장 2
  ]);

  useEffect(() => {
    const loadData = async () => {
      const db = getDb();

      // 골프장 목록
      const courseSnap = await getDocs(collection(db, 'courses'));
      setCourses(courseSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // 미래 티타임이 있는 코스 문서만 불러오기
      const weekSnap = await getDocs(collection(db, 'golf_weeks'));
      const now = new Date();
      const nowIso = new Date().toISOString();

      const items = weekSnap.docs
        .map(doc => {
          const data = doc.data();
          const teeTime = data.course?.teeTimes?.[0];
          return {
            courseId: data.course?.courseId || '',
            teeTimes: data.course?.teeTimes || [],
            isFuture: teeTime ? teeTime >= nowIso : false
          };
        })
        .filter(item => item.isFuture)
        .sort((a, b) => new Date(a.teeTimes[0]) - new Date(b.teeTimes[0]));

      // 최대 2개까지 입력 필드에 반영
      const newInputs = [0, 1].map(i => ({
        selectedCourseId: items[i]?.courseId || '',
        teeTimes: [
          items[i]?.teeTimes?.[0] || '',
          items[i]?.teeTimes?.[1] || ''
        ]
      }));

      setInputs(newInputs);
    };

    loadData();
  }, []);

  const updateInput = (index, key, value) => {
    const updated = [...inputs];
    if (key === 'selectedCourseId') {
      updated[index][key] = value;
    } else if (key.startsWith('teeTime')) {
      const i = parseInt(key.replace('teeTime', ''));
      updated[index].teeTimes[i] = value;
    }
    setInputs(updated);
  };

  const saveCourse = async (index) => {
    const db = getDb();
    const { selectedCourseId, teeTimes } = inputs[index];

    if (!selectedCourseId) return alert(`❌ 골프장 ${index + 1}을 선택하세요.`);
    const courseSnap = await getDoc(doc(db, 'courses', selectedCourseId));
    if (!courseSnap.exists()) return alert("❌ 해당 골프장이 존재하지 않습니다.");

    const validTeeTimes = teeTimes.filter(t => t);
    if (validTeeTimes.length === 0) return alert(`❌ 골프장 ${index + 1}의 티타임을 입력하세요.`);

    const docId = generateDocIdFromTeeTime(validTeeTimes[0]);

    const payload = {
      course: {
        courseId: selectedCourseId,
        courseName: courseSnap.data().name,
        teeTimes: validTeeTimes
      },
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'golf_weeks', docId), payload);
    alert(`✅ 골프장 ${index + 1}이 저장되었습니다. (ID: ${docId})`);
  };

  const deleteCourse = async (index) => {
    const db = getDb();
    const { teeTimes } = inputs[index];
    const validTeeTimes = teeTimes.filter(t => t);
    if (validTeeTimes.length === 0) return alert(`❌ 골프장 ${index + 1}에 삭제할 티타임이 없습니다.`);

    const docId = generateDocIdFromTeeTime(validTeeTimes[0]);
    await deleteDoc(doc(db, 'golf_weeks', docId));

    const updated = [...inputs];
    updated[index] = { selectedCourseId: '', teeTimes: ['', ''] };
    setInputs(updated);

    alert(`🗑️ 골프장 ${index + 1} 문서가 삭제되었습니다. (ID: ${docId})`);
  };

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">이번 주 골프장 설정</h3>

      {inputs.map((input, index) => (
        <div key={index} className="mb-6 border-t pt-4">
          <h4 className="text-md font-semibold mb-2">⛳ 골프장 {index + 1}</h4>

          <select
            className="border p-2 rounded w-full mb-2"
            value={input.selectedCourseId}
            onChange={(e) => updateInput(index, 'selectedCourseId', e.target.value)}
          >
            <option value="">선택하세요</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {[0, 1].map(i => (
            <div key={i} className="relative mb-2">
              <input
                type="datetime-local"
                className="border p-2 rounded w-full"
                value={input.teeTimes[i]}
                onChange={(e) => updateInput(index, `teeTime${i}`, e.target.value)}
                onFocus={() => {
                  if (i === 1 && !input.teeTimes[1] && input.teeTimes[0]) {
                    // 첫 번째 티타임에서 +10분 계산
                    const dt = new Date(input.teeTimes[0]);
                    dt.setMinutes(dt.getMinutes() + 10);

                    // datetime-local 포맷에 맞게 변환 (YYYY-MM-DDTHH:mm)
                    // const suggested = dt.toISOString().slice(0, 16);
                    const localFormatted = formatDateLocal(dt); // ← ✅ 수정
                    // 입력 상태 업데이트
                    const updated = [...inputs];
                    updated[index].teeTimes[1] = localFormatted;
                    setInputs(updated);
                  }
                }}
              />
              {i === 1 && input.teeTimes[1] && (
                <button
                  type="button"
                  onClick={() => {
                    const updated = [...inputs];
                    updated[index].teeTimes[1] = '';
                    setInputs(updated);
                  }}
                  className="absolute right-2 top-2 text-red-500 text-sm"
                  title="티타임 삭제"
                >
                  ❌
                </button>
              )}
            </div>

          ))}

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
      ))}
    </div>
  );
}
